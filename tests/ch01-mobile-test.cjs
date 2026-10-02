/* Optional real-browser QA. Use an isolated profile, never the player's saved browser. */
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../dist');
const server=http.createServer((req,res)=>{
  const relative=decodeURIComponent(req.url.split('?')[0]);
  const file=path.resolve(root,'.'+(relative==='/'?'/index.html':relative));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}
  fs.readFile(file,(error,buffer)=>{if(error){res.writeHead(404);return res.end()}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[path.extname(file)]||'application/octet-stream');res.end(buffer)});
});
let browser;
async function main(){
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url=`http://127.0.0.1:${server.address().port}/`;
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'});
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(url);
  const read=()=>page.evaluate(()=>({screen,run:JSON.parse(JSON.stringify(run())),scene:STORIES[run().storyId],question:QUESTIONS.find(q=>q.questionId===run().activeQuestionId)}));
  const tap=async selector=>{await page.locator(selector).first().evaluate(element=>element.click());await page.evaluate(()=>{inputLockedUntil=0});await page.waitForTimeout(40)};
  const fit=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'mobile horizontal overflow');
  const snapshot=async name=>{if(!process.env.TEST_ARTIFACT_DIR)return;fs.mkdirSync(process.env.TEST_ARTIFACT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.TEST_ARTIFACT_DIR,name+'.png'),fullPage:true})};
  await tap('[data-action="play"]');
  let guard=0,checkedOpening=false,checked943=false,checkedVillager=false,checkedMerchant=false;
  for(const chapterId of ['ch01','ch02']){
  if(chapterId==='ch02'){await tap('[data-nav="teaser"]');await tap('[data-chapter="ch02"]');assert.equal((await read()).run.storyId,'ch02_open_935')}
  while(!(await read()).run.completed){
    const current=await read();await fit();
    if(current.run.storyId==='voice'&&!checkedOpening){
      assert.equal(current.run.dialogueCursor,1);assert.equal(await page.locator('.cinematic-black').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 0)');
      assert.equal(await page.locator('.stage-character').count(),0);await page.waitForTimeout(2200);assert.equal((await read()).run.dialogueCursor,1);
      await snapshot('ch01-black-first');await tap('[data-action="advance-dialogue"]');assert.equal((await read()).run.dialogueCursor,2);await page.waitForTimeout(2200);assert.equal((await read()).run.dialogueCursor,2);await snapshot('ch01-black-second');
      await tap('[data-action="next"]');await page.waitForSelector('.effect-wake-reveal');await page.waitForTimeout(500);
      assert.equal(await page.locator('.stage-character').count(),2);assert.equal(await page.locator('[data-character-id="doyun"][data-position="left"]').count(),1);assert.equal(await page.locator('[data-character-id="player"][data-position="right"]').count(),1);assert.equal((await read()).run.storyId,'house');await snapshot('ch01-first-meeting');checkedOpening=true;continue;
    }
    if(current.run.storyId==='rumor'&&current.run.dialogueCursor===1&&!checkedVillager){assert.equal(await page.locator('[data-character-id="resident_a"][data-position="left"][src*="villager_male_01.png"]').count(),1);await snapshot('ch01-villager-portrait');checkedVillager=true}
    if(current.run.storyId==='ch01_gongsan'&&current.run.dialogueCursor===2&&!checkedMerchant){assert.equal(await page.locator('[data-character-id="merchant"][data-position="left"][src*="merchant_01.png"]').count(),1);await snapshot('ch01-merchant-portrait');checkedMerchant=true}
    if(current.scene?.year===943&&!checked943){assert.equal(current.run.characterStates.doyun.characterAge,49);await snapshot('ch01-943');checked943=true}
    if(!['prologue','sleep','voice','house','outfit_question','outfit_gift'].includes(current.run.storyId)&&!current.question){const line=(current.run.pending?current.run.pending.resultDialogues:current.scene.dialogues)?.[(current.run.dialogueCursor||1)-1];if(['thought','narration'].includes(line?.speakerType))assert.equal(await page.locator('.stage-character').count(),0)}
    if(current.question){await tap(`[data-answer="${current.question.answer}"]`);await tap('[data-action="quiz-next"]')}
    else if(await page.locator('[data-action="advance-dialogue"]').count())await tap('[data-action="advance-dialogue"]');
    else if(current.run.pending)await tap('[data-action="result-next"]');
    else if(current.scene.choices)await tap('[data-choice="0"]');
    else await tap('[data-action="next"]');
    if(++guard>500)throw new Error('mobile play did not complete');
  }
  assert.equal((await read()).run.currentChapter,chapterId);assert.equal(Object.keys((await read()).run.questionResults).length,chapterId==='ch01'?6:8);await fit();await snapshot(chapterId+'-complete');
  }
  assert(checkedOpening&&checked943&&checkedVillager&&checkedMerchant);
  await tap('[data-nav="study"]');
  for(const chapterId of ['ch01','ch02']){
    await tap('[data-review-chapter="'+chapterId+'"]');
    const total=chapterId==='ch01'?5:7;
    for(let index=0;index<total;index++){const answer=await page.evaluate(()=>QUESTIONS.find(q=>q.questionId===reviewQuestionId).answer);await tap('[data-answer="'+answer+'"]');await tap('[data-action="quiz-next"]');await fit()}
    assert.equal(await page.evaluate(()=>meta().ch01ReviewAttempts.at(-1).correct),total);
  }
  await page.reload();await tap('[data-action="play"]');await tap('[data-nav="teaser"]');await tap('[data-chapter="ch03"]');assert.equal((await read()).run.currentChapter,'ch03');
  let checkedRobes=false,checkedHyunwooOfficial=false,checkedFreedMan=false,checkedDoyun960=false;
  while(!(await read()).run.completed){
    const current=await read();await fit();
    if(current.run.storyId==='ch02_official_robes_walk'&&!checkedRobes){assert.equal(await page.locator('.stage-character').count(),0);await snapshot('ch03-official-robes-background');checkedRobes=true}
    if(current.run.storyId==='ch02_hyunwoo_official'&&current.run.dialogueCursor===1&&!checkedHyunwooOfficial){assert.equal(await page.locator('[data-character-id="hyunwoo"][data-position="right"]').count(),1);await snapshot('ch03-hyunwoo-official');checkedHyunwooOfficial=true}
    if(current.run.storyId==='ch02_purge'&&current.run.dialogueCursor===2&&!checkedFreedMan){assert.equal(await page.locator('[data-character-id="freed_man"][data-position="left"]').count(),1);await snapshot('ch03-freed-man');checkedFreedMan=true}
    if(current.run.storyId==='ch02_purge'&&current.run.dialogueCursor===3&&!checkedDoyun960){assert.equal(await page.locator('[data-character-id="doyun"][data-position="left"]').count(),1);assert.equal(current.run.characterStates.doyun.characterAge,68);await snapshot('ch03-doyun-960');checkedDoyun960=true}
    if(current.question){await tap(`[data-answer="${current.question.answer}"]`);await tap('[data-action="quiz-next"]')}
    else if(await page.locator('[data-action="advance-dialogue"]').count())await tap('[data-action="advance-dialogue"]');
    else if(current.run.pending)await tap('[data-action="result-next"]');
    else if(current.scene.choices)await tap('[data-choice="0"]');
    else await tap('[data-action="next"]');
    if(++guard>800)throw new Error('mobile CH.03 play did not complete');
  }
  assert(checkedRobes&&checkedHyunwooOfficial&&checkedFreedMan&&checkedDoyun960);assert.equal(Object.keys((await read()).run.questionResults).length,12);assert(await page.locator('text=CHAPTER 03 CLEAR').count());await fit();await snapshot('ch03-complete');
  await tap('[data-review-chapter="ch03"]');
  for(let index=0;index<5;index++){const answer=await page.evaluate(()=>QUESTIONS.find(q=>q.questionId===reviewQuestionId).answer);await tap('[data-answer="'+answer+'"]');await tap('[data-action="quiz-next"]');await fit()}
  assert.equal(await page.evaluate(()=>meta().ch01ReviewAttempts.at(-1).correct),5);
  for(const width of [320,390,760]){await page.setViewportSize({width,height:844});await fit()}
  assert.deepEqual(errors,[]);console.log('PASS: isolated mobile CH.01~03 full play, fixed portrait positions, background-only narration, 6+8+12 story questions, 5+7+5 reviews, reload, and 320/390/760px overflow.');
}
main().catch(error=>{console.error(error.stack||error);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
