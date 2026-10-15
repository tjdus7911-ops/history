/* Full mobile/browser play through the compact five-scene Proto route. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const root=path.resolve('dist'),shots=path.resolve('docs/ui-qa/proto-compact');fs.mkdirSync(shots,{recursive:true});
const explanationJson=fs.readFileSync(path.join(root,'official-exam-explanations.json'),'utf8');
const widths=process.env.PROTO_TEST_WIDTHS?process.env.PROTO_TEST_WIDTHS.split(',').map(Number):[360,375,390,430,1280];
(async()=>{
 let browser;
 try{
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  for(const width of widths){
   console.log('Chromium mobile/desktop pass started: '+width+'px');
   const context=await browser.newContext({viewport:{width,height:900},isMobile:width<=430,hasTouch:width<=430,serviceWorkers:'block'}),page=await context.newPage(),errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.addInitScript(text=>{const native=window.fetch.bind(window);window.fetch=(input,...args)=>String(input).endsWith('/official-exam-explanations.json')?Promise.resolve(new Response(text,{status:200,headers:{'content-type':'application/json'}})):native(input,...args)},explanationJson);
   await page.goto('file:///'+path.join(root,'index.html').replaceAll('\\','/'),{waitUntil:'domcontentloaded'});
   await page.evaluate(()=>{state.mainRun=null;state.run=PROTO_SAVE_V3.freshRun(true);state.mainRun=null;modal=null;screen='game';enterStory();render()});
   assert.equal(await page.locator('.proto-revision-game').count(),1,'first country scene at '+width);
   let guard=0,questions=0,scenes=0;
   while(await page.evaluate(()=>meta().completedChapters.filter(id=>['proto-ch02','proto-ch03','proto-ch04','proto-ch05','proto-ch06'].includes(id)).length)<5){
    assert(++guard<160,'route stalled at '+width+' '+await page.evaluate(()=>screen+' '+run().storyId));
    const currentScreen=await page.evaluate(()=>screen);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow at '+width);
    if(currentScreen==='game'){
     const label=page.locator('.proto-place-label');assert(await label.isVisible(),'country/place label at '+width);
     const country=await label.locator('span').innerText(),place=await label.locator('small').innerText();assert(country&&place);
     const sceneId=await page.locator('.proto-revision-game').getAttribute('data-proto-scene');
     if(await page.locator('.proto-scene-recap').count()){const names=await page.locator('.proto-scene-recap li').allTextContents();assert(names.length>0,sceneId+' recap');}
     const action=page.locator('.conversation-panel [data-action="advance-dialogue"],.conversation-panel [data-action="next"]');assert(await action.count(),sceneId+' next dialogue control');
     assert(await action.isVisible(),sceneId+' dialogue control visible');
     if(width===390&&scenes===0&&guard===1)await page.screenshot({path:path.join(shots,'scene-first-390.png'),fullPage:true});
     await action.click();
     if(await page.locator('.proto-revision-quiz').count())scenes++;
     continue;
    }
    if(currentScreen==='quiz'){
     const q=await page.evaluate(()=>{const item=QUESTIONS.find(q=>q.questionId===run().activeQuestionId);return {id:item.officialQuestionId,answer:item.answer,count:item.choices.length}});
     const image=page.locator('.proto-original-question img');await image.evaluate(element=>element.decode());assert(await image.evaluate(element=>element.naturalWidth>0),q.id+' original image');
     assert.equal(await page.locator('[data-proto-answer]').count(),q.count,q.id+' choice count');assert([4,5].includes(q.count));
     await page.locator('[data-proto-answer="'+q.answer+'"]').click();await page.locator('[data-action="proto-submit"]').click();
     await page.waitForFunction(()=>globalThis.OFFICIAL_EXAM_EXPLANATION_LOADER?.state==='ready',undefined,{timeout:60000});
     const explanations=page.locator('.official-choice-explanations li');await explanations.first().waitFor({state:'visible'});
     assert.equal(await explanations.count(),q.count,q.id+' full option explanations');
     assert(await page.locator('.feedback').innerText().then(text=>text.includes('정답입니다.')),q.id+' answer feedback');
     assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),q.id+' quiz overflow '+width);
     for(let i=0;i<await page.locator('.proto-revision-quiz button').count();i++){
      const button=page.locator('.proto-revision-quiz button').nth(i);assert(await button.isVisible(),q.id+' button visible');
      assert(await button.evaluate(element=>element.scrollWidth<=element.clientWidth+2),q.id+' clipped button text');
     }
     questions++;if(width===390&&questions===1)await page.screenshot({path:path.join(shots,'official-question-390.png'),fullPage:true});
     const continueButton=page.locator('[data-action="proto-quiz-next"]');await continueButton.evaluate(element=>element.scrollIntoView({block:'center',inline:'nearest'}));
     if(width<=430){const buttonBox=await continueButton.boundingBox(),navBox=await page.locator('.sidebar').boundingBox();assert(buttonBox.y+buttonBox.height<=navBox.y+1,q.id+' continue action clears fixed mobile navigation: '+JSON.stringify({buttonBox,navBox}));}
     await continueButton.click();continue;
    }
    if(currentScreen==='complete'){
     assert.equal(await page.locator('.ancient-complete .chapter-learning strong').first().innerText(),'1씬');
     const next=page.locator('.ancient-complete [data-action="start-chapter"]');
     if(width===390&&scenes===1)await page.screenshot({path:path.join(shots,'chapter-result-390.png'),fullPage:true});
     if(await next.count()){await next.evaluate(element=>element.scrollIntoView({block:'center',inline:'nearest'}));if(width<=430){const buttonBox=await next.boundingBox(),navBox=await page.locator('.sidebar').boundingBox();assert(buttonBox.y+buttonBox.height<=navBox.y+1,'chapter result action clears fixed mobile navigation: '+JSON.stringify({buttonBox,navBox}));}await next.click();}else{assert.equal(await page.locator('.ancient-complete [data-nav="home"]').count(),1,'final chapter has a home action');break;}
     continue;
    }
    throw Error('unexpected screen '+currentScreen+' at '+width);
   }
   assert.equal(scenes,5,'five country scenes completed at '+width);assert.equal(questions,15,'all official questions answered at '+width);
   assert.equal(await page.evaluate(()=>PROTO_REVISION_ACTIONS.book().readSceneIds.length),5);assert.equal(await page.evaluate(()=>PROTO_REVISION_ACTIONS.book().answeredQuestionIds.length),15);
   assert.deepEqual(errors,[],'browser errors at '+width);await context.close();console.log('Chromium mobile/desktop pass complete: '+width+'px');
  }
  console.log('PASS real Chromium play at 360/375/390/430/1280px: five countries, 15 image questions, all choice explanations, visible navigation/recaps, preserved progress, no horizontal overflow or browser errors.');
 }finally{if(browser)await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
