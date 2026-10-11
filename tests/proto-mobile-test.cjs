/* Optional real-browser checks. Run only where Playwright Chromium is available. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const root=path.resolve('dist'),shots=path.resolve('docs/ui-qa/proto-revision');fs.mkdirSync(shots,{recursive:true});
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{const url=(req.url||'/').split('?')[0],file=path.resolve(root,'.'+(url==='/'?'/index.html':url));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(file,(error,bytes)=>{if(error){res.writeHead(404);return res.end();}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(bytes);});});
(async()=>{
 let browser;
 try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  for(const width of [360,390,430,1280]){
   const context=await browser.newContext({viewport:{width,height:900},isMobile:width<=430,hasTouch:width<=430,serviceWorkers:'block'}),page=await context.newPage(),errors=[];
   page.on('pageerror',error=>errors.push(error.message));await page.goto('http://127.0.0.1:'+server.address().port+'/');
   const scenes=await page.evaluate(()=>[...PROTO_REVISION_RUNTIME.sources.keys()]);
   for(const id of scenes){
    await page.evaluate(id=>{
     const source=STORIES[id];state.mainRun=null;state.run=INITIAL_RUN(source.chapterId);PROTO_SAVE_V3.identifyRun(run(),true);
     run().started=true;run().storyId=id;run().dialogueSceneId=id;run().dialogueCursor=source.dialogues.length;
     run().protoStoryState.scenes[id]={phase:source.choices?.length?'choice':'main',choiceIndex:null};
     const learned=PROTO_REVISION_ACTIONS.book();learned.readLineIds=[...new Set([...learned.readLineIds,...source.dialogues.map(line=>line.lineId)])];
     modal=null;screen='game';render();
    },id);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),id+' horizontal overflow '+width);
    const game=await page.locator('.proto-revision-game').boundingBox();assert(game.width<=430.5,'approved PC game width '+id+' '+width);
    const expected=await page.evaluate(id=>STORIES[id].choices?.length||0,id);
    assert.equal(await page.locator('[data-choice]').count(),expected,id);
    assert.equal(await page.locator('[data-dialogue-index]').count(),expected?2:3,id+' common recent-message count');
    const portraits=page.locator('.character-stage img');for(let i=0;i<await portraits.count();i++)await portraits.nth(i).evaluate(image=>image.decode());
    const controls=page.locator('.conversation-panel [data-choice],.conversation-panel .next,.conversation-panel .advance-dialogue');
    for(let i=0;i<await controls.count();i++){const control=controls.nth(i);await control.scrollIntoViewIfNeeded();assert(await control.isVisible(),id+' reachable control');assert(await control.evaluate(element=>element.scrollHeight<=element.clientHeight+1),id+' control text clipped');}
    if([390,1280].includes(width)&&['proto_ch00_s2','proto_ch02_s3','proto_ch06_s7','proto_ch07_s7'].includes(id))await page.screenshot({path:path.join(shots,id+'-'+width+'.png'),fullPage:true});
   }
   // Real clicks, chosen spoken line, branch replies and common join after reload.
   await page.evaluate(()=>{state.mainRun=null;state.run=PROTO_SAVE_V3.freshRun(true);meta().protoRevisionBook=PROTO_SAVE_V3.emptyBook(meta());modal=null;screen='game';enterStory();render();});
   const first=await page.evaluate(()=>run().dialogueCursor);await page.locator('[data-action="advance-dialogue"]').click();assert.equal(await page.evaluate(()=>run().dialogueCursor),first+1);
   for(let guard=0;guard<60&&!await page.locator('[data-choice="1"]').count();guard++)await page.locator('.conversation-panel [data-action="advance-dialogue"],.conversation-panel [data-action="next"]').click();
   const branch=await page.evaluate(()=>({sceneId:run().storyId,lines:STORIES[run().storyId].choices[1].resultDialogues.map(line=>line.dialogue)}));
   await page.locator('[data-choice="1"]').click();
   assert.equal(await page.evaluate(()=>PROTO_REVISION_ACTIONS.phaseState().phase),'branch');
   assert.equal(await page.locator('[data-dialogue-index="0"] p').innerText(),branch.lines[0]);
   const saved=await page.evaluate(()=>{save();return JSON.stringify(run());});
   await page.reload();await page.evaluate(()=>{screen='game';render();});assert.deepEqual(await page.evaluate(()=>run()),JSON.parse(saved));
   for(let guard=0;guard<40&&await page.evaluate(()=>run().storyId)===branch.sceneId;guard++)await page.locator('.conversation-panel [data-action="advance-dialogue"],.conversation-panel [data-action="result-next"],.conversation-panel [data-action="next"]').click();
   assert(await page.evaluate(id=>PROTO_REVISION_ACTIONS.book().readSceneIds.includes(id),branch.sceneId));
   // Layout fixtures contain complete prerequisites; they never bypass a gate.
   for(const id of await page.evaluate(()=>PROTO_STUDY_QUESTION_IDS)){
    await page.evaluate(id=>{
     const q=QUESTIONS.find(q=>q.questionId===id),source=STORIES[q.relatedSceneId];state.mainRun=null;state.run=INITIAL_RUN(q.chapterId);PROTO_SAVE_V3.identifyRun(run(),true);
     run().started=true;run().storyId=source.sceneId;run().dialogueSceneId=source.sceneId;run().protoStoryState.scenes[source.sceneId]={phase:'quiz',choiceIndex:source.choices?.length?0:null};
     const learned=PROTO_REVISION_ACTIONS.book();
     for(const sceneId of [...new Set([...q.protoRequiredSceneIds,source.sceneId])]){const s=STORIES[sceneId];learned.readLineIds=[...new Set([...learned.readLineIds,...s.dialogues.map(line=>line.lineId),...s.protoCommon.map(line=>line.lineId)])];if(s.choices?.length)learned.choiceBySceneId[sceneId]=0;if(!learned.readSceneIds.includes(sceneId))learned.readSceneIds.push(sceneId);}
     run().protoCheckpoint={kind:'first',sceneId:source.sceneId,afterLineId:source.protoQueue.afterLineId};run().questionQueue=[id];run().questionQueueIndex=0;run().activeQuestionId=id;run().questionAnswer=null;run().protoAnswerDraft=null;run().dialogueCursor=1;modal=null;quizMode='story';screen='quiz';render();
    },id);
    const image=page.locator('.proto-original-question img');await image.evaluate(element=>element.decode());assert(await image.evaluate(element=>element.naturalWidth>0),id+' image');
    const count=await page.evaluate(id=>QUESTIONS.find(q=>q.questionId===id).choices.length,id);assert.equal(await page.locator('[data-proto-answer]').count(),count,id+' original choice count');assert([4,5].includes(count));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),id+' quiz overflow '+width);
    await page.locator('.question-image-open').click();assert(await page.locator('.modal').isVisible(),id+' zoom');await page.evaluate(()=>{modal=null;render();});
    if(width===390&&id.includes('66-advanced'))await page.screenshot({path:path.join(shots,'official-quiz-'+width+'.png'),fullPage:true});
   }
   assert.deepEqual(errors,[]);await context.close();
  }
  console.log('PASS: 83 approved common story screens and 23 full original question images at 360/390/430/1280px; real v3 choice/reply/join reload, reachable controls, no clipping or browser errors.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
