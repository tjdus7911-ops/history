const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const root=path.resolve('dist'),shots=path.resolve('tmp/dialogue-nameplates');
const remoteBase=process.env.HISTORY_BASE_URL?.replace(/\/+$/,'');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{const relative=decodeURIComponent(req.url.split('?')[0]),file=path.resolve(root,'.'+(relative==='/'?'/index.html':relative));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}fs.readFile(file,(error,body)=>{if(error){res.writeHead(404);return res.end()}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(body)})});
const samples=[
 {label:'Goryeo',id:'house',chapterId:'ch01',cursor:2,npc:'낯선 청년',kind:'common'},
 {label:'Joseon',id:'joseon_ch00_s3',chapterId:'joseon-ch00',cursor:2,npc:'민준',kind:'common'},
 {label:'Proto',id:'proto_ch00_s2',chapterId:'proto-ch00',cursor:2,npc:'???',kind:'proto'},
 {label:'Three',id:'THR-C01-S01',chapterId:'THR-C01',cursor:2,npc:'연우',kind:'three'}
];

async function show(page,sample,phase='main'){
 return page.evaluate(({sample,phase})=>{
  const source=STORIES[sample.id];state.mainRun=null;state.run=INITIAL_RUN(sample.chapterId);run().started=true;run().storyId=sample.id;run().dialogueSceneId=sample.id;modal=null;screen='game';
  if(sample.kind==='proto'){PROTO_SAVE_V3.identifyRun(run(),true);run().protoStoryState.scenes[sample.id]={phase,choiceIndex:null};}
  if(sample.kind==='three'){THREE_SAVE_V3.identifyRun(run(),true);THREE_COMPLETE_ACTIONS.switchPhase(source,phase);}
  run().dialogueCursor=sample.cursor;render();if(typeof finishOpeningTyping==='function')finishOpeningTyping();
  const entries=sample.kind==='three'?THREE_COMPLETE_ACTIONS.phaseEntries(source):conversationEntries(source,null),visible=entries.slice(0,sample.cursor);
  return{player:[...visible].reverse().find(entry=>entry.speakerType==='player')?.dialogue,npc:[...visible].reverse().find(entry=>entry.speakerType==='npc')?.dialogue};
 },{sample,phase});
}

async function assertAlternating(page,sample,expected,width){
 const player=page.locator('.message-row.player').last(),npc=page.locator('.message-row.npc').last();
 assert(await player.isVisible(),`${sample.label}/${width}: player bubble missing`);assert(await npc.isVisible(),`${sample.label}/${width}: NPC bubble missing`);
 assert.equal(await player.locator('.character-name').count(),0,`${sample.label}/${width}: player nameplate remains`);
 assert.equal(await npc.locator('.character-name').count(),1,`${sample.label}/${width}: NPC nameplate missing`);
 assert.equal((await npc.locator('.character-name').innerText()).trim(),sample.npc,`${sample.label}/${width}: NPC name changed`);
 assert.equal((await player.locator('.speech-bubble').innerText()).trim(),expected.player,`${sample.label}/${width}: player dialogue changed`);
 assert.equal((await npc.locator('.speech-bubble').innerText()).trim(),expected.npc,`${sample.label}/${width}: NPC dialogue changed`);
 const layout=await player.evaluate(row=>{const stack=row.querySelector('.bubble-stack'),bubble=row.querySelector('.speech-bubble'),s=stack.getBoundingClientRect(),b=bubble.getBoundingClientRect(),r=row.getBoundingClientRect();return{children:stack.children.length,first:stack.firstElementChild?.className,topGap:b.top-s.top,heightGap:s.height-b.height,rightGap:r.right-s.right,justify:getComputedStyle(row).justifyContent}});
 assert.equal(layout.children,1,`${sample.label}/${width}: empty nameplate node remains`);assert.equal(layout.first,'speech-bubble');
 assert(Math.abs(layout.topGap)<.6&&Math.abs(layout.heightGap)<.6,`${sample.label}/${width}: nameplate spacing remains ${JSON.stringify(layout)}`);
 assert(Math.abs(layout.rightGap)<1.1&&layout.justify==='flex-end',`${sample.label}/${width}: player bubble left its right side ${JSON.stringify(layout)}`);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${sample.label}/${width}: horizontal overflow`);
}

(async()=>{let browser;try{
 fs.mkdirSync(shots,{recursive:true});if(!remoteBase)await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=remoteBase||`http://127.0.0.1:${server.address().port}`;browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 for(const width of [390,1280]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:900},isMobile:width===390,hasTouch:width===390,serviceWorkers:'block'}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));await page.goto(`${base}/`);
  for(const sample of samples){const expected=await show(page,sample);await assertAlternating(page,sample,expected,width);await page.screenshot({path:path.join(shots,`${sample.label.toLowerCase()}-${width}.png`),fullPage:true});}
  await page.evaluate(()=>{const source=STORIES['THR-C01-S01'];state.mainRun=null;state.run=INITIAL_RUN(source.chapterId);THREE_SAVE_V3.identifyRun(run(),true);run().openingFlowVersion=3;run().started=true;run().storyId=source.sceneId;screen='game';modal=null;THREE_COMPLETE_ACTIONS.switchPhase(source,'choice');finishOpeningTyping()});
  await page.evaluate(()=>{inputLockedUntil=0});await page.locator('.three-dialogue-choices [data-choice="1"]').click();await page.evaluate(()=>finishOpeningTyping());
  assert.equal(await page.evaluate(()=>THREE_COMPLETE_ACTIONS.phaseState(THREE_COMPLETE_ACTIONS.currentSource()).phase),'branch');
  assert.equal(await page.locator('.message-row.player .character-name').count(),0,`Three choice/${width}: selected player line has a nameplate`);
  assert.equal((await page.locator('.message-row.player .speech-bubble').last().innerText()).trim(),await page.evaluate(()=>STORIES['THR-C01-S01'].choices[1].label));
  await page.evaluate(()=>{inputLockedUntil=0;finishOpeningTyping()});await page.locator('button.advance-dialogue').click();await page.evaluate(()=>finishOpeningTyping());
  assert.equal((await page.locator('.message-row.npc .character-name').last().innerText()).trim(),'연우',`Three reaction/${width}: NPC label missing`);
  const saved=await page.evaluate(()=>{save();return JSON.stringify(run())});await page.reload();await page.evaluate(()=>{screen='game';render();if(typeof finishOpeningTyping==='function')finishOpeningTyping()});assert.deepEqual(await page.evaluate(()=>run()),JSON.parse(saved),`Three choice/${width}: save/reload changed`);
  assert.deepEqual(errors,[]);await context.close();
 }
 console.log('PASS: protagonist nameplates removed and NPC labels retained in alternating Goryeo/Joseon/Proto/Three dialogue at 390/1280px; no gap, alignment drift, overflow, choice or reload regression.');
}finally{if(browser)await browser.close();if(server.listening)await new Promise(resolve=>server.close(resolve))}})().catch(error=>{console.error(error);process.exitCode=1});
