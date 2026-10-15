const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),cp=require('child_process');
(async()=>{
 const server=cp.spawn(process.execPath,['serve.cjs'],{stdio:'ignore'});await new Promise(r=>setTimeout(r,400));
 const args={headless:true};if(process.env.CHROMIUM_PATH){args.executablePath=process.env.CHROMIUM_PATH;args.args=['--no-sandbox','--disable-gpu'];}
 const browser=await chromium.launch(args),report=[];fs.mkdirSync('docs/proto-v4/qa',{recursive:true});
 try{for(const [width,height,branch] of [[390,844,0],[1280,900,1]]){
 const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 if(process.env.PROTO_QUESTION_CACHE){await page.route('**/assets/exams/**',async route=>{const url=route.request().url(),id=url.includes('/60-basic-02.webp')?'official-60-basic-02':url.match(/official-\d+-(?:basic|advanced)-\d+/)?.[0],file=id&&path.join(process.env.PROTO_QUESTION_CACHE,id+'.webp');if(file&&fs.existsSync(file))return route.fulfill({path:file,contentType:'image/webp'});return route.continue();});}
 await page.goto('http://127.0.0.1:4173',{waitUntil:'domcontentloaded'});await page.evaluate(()=>resumeEra('proto-kingdoms'));
 const scenes=new Set(),exams=new Set(),outro=[];let maxOverflow=0;
 for(let tick=0;tick<1100;tick++){
 const current=await page.evaluate(()=>({screen,sid:run().storyId,cursor:run().dialogueCursor,phase:screen==='game'?PROTO_REVISION_ACTIONS.phaseState().phase:null,chapter:Number(CHAPTERS[run().currentChapter].number),q:screen==='quiz'?{id:activeQuestion().officialQuestionId,answer:activeQuestion().answer,done:run().questionAnswer!==null}:null}));
 if(current.screen==='game'){
 if(!scenes.has(current.sid))console.log('browser',width,current.sid);scenes.add(current.sid);
 if(current.phase==='outro')outro.push(await page.evaluate(()=>PROTO_REVISION_ACTIONS.phaseEntries()[run().dialogueCursor-1].dialogue));
 const visible=page.locator('.stage-character');for(const img of await visible.all()){await img.evaluate(el=>el.decode());assert(await img.evaluate(el=>el.naturalWidth>0),'portrait missing');}
 if(current.cursor===5&&current.phase==='main'&&['proto_ch01_s1','proto_ch03_s2','proto_ch05_s3'].includes(current.sid))await page.screenshot({path:`docs/proto-v4/qa/${current.sid}-${width}.png`,fullPage:true});
 if(current.phase==='choice'){
 if(['proto_ch01_s1','proto_ch03_s2','proto_ch05_s3'].includes(current.sid))await page.screenshot({path:`docs/proto-v4/qa/${current.sid}-choice-${width}.png`,fullPage:true});
 await page.locator(`[data-choice="${branch}"]`).click();
 }else{
 const button=page.locator('[data-action="advance-dialogue"], [data-action="next"], [data-action="result-next"]').last();await button.click();
 }
 }else if(current.screen==='quiz'){
 exams.add(current.q.id);const image=page.locator('.proto-original-question img').first();await image.evaluate(el=>el.decode());assert(await image.evaluate(el=>el.naturalWidth>0));
 if(!current.q.done){await page.locator(`[data-proto-answer="${current.q.answer}"]`).click();await page.locator('[data-action="proto-submit"]').click();assert(await page.locator('.proto-choice-explanations li').count()>=4);}
 else{if(exams.size===1)await page.screenshot({path:`docs/proto-v4/qa/exam-feedback-${width}.png`,fullPage:true});await page.locator('[data-action="proto-quiz-next"]').click();}
 }else if(current.screen==='complete'){
 await page.screenshot({path:`docs/proto-v4/qa/chapter-${current.chapter}-complete-${width}.png`,fullPage:true});if(current.chapter===5)break;await page.locator(`[data-action="start-chapter"]`).first().click();
 }else throw Error(current.screen);
 maxOverflow=Math.max(maxOverflow,await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth));assert(tick<1099,'route did not finish');
 }
 assert.equal(scenes.size,17);assert.equal(exams.size,26);assert.deepEqual(outro,['준비됐어?','응. 이번에는 같이.']);assert.equal(maxOverflow,0);assert.deepEqual(errors,[]);
 // Reload at the ending and verify its completion, then enter replay without losing the completed main run.
 await page.reload({waitUntil:'domcontentloaded'});await page.evaluate(()=>resumeEra('proto-kingdoms'));assert.equal(await page.evaluate(()=>run().currentChapter),'proto-ch05');
 report.push({width,height,branch,scenes:scenes.size,exams:exams.size,pageErrors:errors,horizontalOverflow:maxOverflow});await page.close();
 }
 fs.writeFileSync('docs/proto-v4/qa/browser-results.json',JSON.stringify(report,null,2)+'\n');console.log('PASS browser full routes',JSON.stringify(report));
 }finally{await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exit(1);});
