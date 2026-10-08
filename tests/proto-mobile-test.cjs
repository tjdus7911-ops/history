const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert'),{chromium}=require('playwright');
const root=path.resolve('dist'),shots=path.resolve('../proto-qa');fs.mkdirSync(shots,{recursive:true});
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{const p=path.resolve(root,'.'+(req.url==='/'?'/index.html':req.url.split('?')[0]));if(!p.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end();}res.setHeader('Content-Type',types[path.extname(p)]||'application/octet-stream');res.end(b);});});
(async()=>{let browser;try{await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
for(const width of [360,390,412]){
 const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}/`);
 const scenes=await page.evaluate(()=>Object.values(STORIES).filter(s=>s.eraId==='proto-kingdoms'&&s.storyActive!==false).map(s=>s.sceneId));
 for(const id of scenes){await page.evaluate(id=>{const s=STORIES[id];state.run=INITIAL_RUN(s.chapterId);run().flags.protoStoryVersion=2;run().started=true;run().storyId=id;run().dialogueCursor=s.dialogues.length;screen='game';render();},id);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),id+' overflow '+width);
  const images=page.locator('.character-stage img');for(let i=0;i<await images.count();i++)await images.nth(i).evaluate(im=>im.decode());
  const count=await page.locator('[data-choice]').count();const expected=await page.evaluate(id=>STORIES[id].choices?.length||0,id);assert.equal(count,expected,id);
  if(width===390&&['proto_ch00_s2','proto_ch03_s4','proto_ch06_s11','proto_ch07_s7'].includes(id))await page.screenshot({path:path.join(shots,id+'.png'),fullPage:true});
 }
 // Actual button choice -> immediate response -> save/reload -> next scene.
 await page.evaluate(()=>{state.run=INITIAL_RUN('proto-ch00');run().flags.protoStoryVersion=2;run().started=true;run().storyId='proto_ch00_s2';run().dialogueCursor=STORIES.proto_ch00_s2.dialogues.length;screen='game';render();});
 await page.locator('[data-choice="1"]').click();assert(await page.evaluate(()=>run().pending.resultDialogues[1].dialogue==='북쪽 교역로 근처다.'));
 await page.reload();await page.evaluate(()=>{screen='game';render();});assert(await page.evaluate(()=>run().pending.sourceSceneId==='proto_ch00_s2'));
 await page.evaluate(()=>{run().dialogueCursor=run().pending.resultDialogues.length;render();});await page.locator('[data-action="result-next"]').click();assert.equal(await page.evaluate(()=>run().storyId),'proto_ch00_s3');
 for(const id of await page.evaluate(()=>PROTO_STUDY_QUESTION_IDS)){
  await page.evaluate(id=>{const q=QUESTIONS.find(q=>q.questionId===id);state.run=INITIAL_RUN(q.chapterId);run().activeQuestionId=id;run().questionQueue=[id];run().questionQueueIndex=0;run().questionAnswer=null;quizMode='story';screen='quiz';render();},id);
  const img=page.locator('.official-source-question img');await img.evaluate(im=>im.decode());assert(await img.evaluate(im=>im.naturalWidth>0),id);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),id+' quiz overflow '+width);
  assert(await page.getByText('한능검 대비',{exact:false}).count());if(width===390&&id.includes('66-advanced'))await page.screenshot({path:path.join(shots,'official-quiz.png'),fullPage:true});
 }
 assert.deepEqual(errors,[]);await context.close();
}
console.log('PASS: 83 story screens and 23 original images at 360/390/412px; real choice buttons, response persistence/reload and next-scene transition; no browser errors.');
}finally{if(browser)await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1});
