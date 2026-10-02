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
  let guard=0,checkedOpening=false,checked943=false,checkedVillagerVoice=false,checkedInjuredMerchant=false,checkedGyeonhwonRumor=false,checkedFoundationExam=false,checkedConflict=false,checkedGochang=false,checkedBelonging=false;
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
    if(current.run.storyId==='rumor'&&current.run.dialogueCursor===1&&!checkedVillagerVoice){assert((await page.locator('.game').getAttribute('style')).includes('village-residents-rumor-918.png'));assert.equal(await page.locator('.stage-character').count(),0);assert.equal(await page.locator('.character-name').filter({hasText:'주민 A'}).count(),1);await snapshot('ch01-villager-ambient-voice');checkedVillagerVoice=true}
    if(current.run.storyId==='foundation'&&!checkedFoundationExam){assert.deepEqual(current.scene.linkedOfficialQuestions,['ch01-official-69-basic-10']);assert.equal(await page.locator('.stage-character').count(),0);await snapshot('ch01-foundation-before-exam');checkedFoundationExam=true}
    if(current.run.storyId==='ch01_gongsan'&&current.run.dialogueCursor===7&&!checkedInjuredMerchant){assert.equal(await page.locator('[data-character-id="injured_merchant"][data-position="left"]').count(),1);assert.equal(await page.locator('.character-name').filter({hasText:'부상당한 상인'}).count(),1);await snapshot('ch01-injured-merchant-standing');checkedInjuredMerchant=true}
    if(current.run.storyId==='ch01_conflict'&&!checkedConflict){assert(current.scene.dialogues.some(line=>line.dialogue==='다시 하면 되잖아.'));assert(current.scene.dialogues.some(line=>line.dialogue==='자네는 잃을 것이 없으니 그런 말을 하는 것이오.'));await snapshot('ch01-conflict');checkedConflict=true}
    if(current.run.storyId==='ch01_gochang'&&!checkedGochang){assert((await page.locator('.game').getAttribute('style')).includes('route-caravan.png'));assert.equal(await page.locator('.stage-character').count(),0);await snapshot('ch01-gochang-open-road');checkedGochang=true}
    if(current.run.storyId==='ch01_belonging'&&!checkedBelonging){assert(current.scene.dialogues.some(line=>line.dialogue==='이번에는 우리가 이겼군.'));assert(current.scene.dialogues.some(line=>line.dialogue==='십 년 가까이 여기 살았으면 고려 사람 아니오?'));await snapshot('ch01-belonging');checkedBelonging=true}
    if(current.run.storyId==='ch01_gyeonhwon'&&current.run.dialogueCursor===3&&!checkedGyeonhwonRumor){assert.equal(await page.locator('.stage-character').count(),0);assert.equal(await page.locator('.dialogue-log > :last-child .character-name').textContent(),'상인');await snapshot('ch02-gyeonhwon-ambient-rumor');checkedGyeonhwonRumor=true}
    if(current.scene?.year===943&&!checked943){assert.equal(current.run.characterStates.doyun.characterAge,49);await snapshot('ch01-943');checked943=true}
    if(!['prologue','sleep','voice','house','outfit_question','outfit_gift'].includes(current.run.storyId)&&!current.question){const line=(current.run.pending?current.run.pending.resultDialogues:current.scene.dialogues)?.[(current.run.dialogueCursor||1)-1];if(['thought','narration'].includes(line?.speakerType))assert.equal(await page.locator('.stage-character').count(),0)}
    if(current.question){if(current.question.chapterId==='ch01'){assert(current.question.isOfficial&&current.question.sourceVerified);assert.equal(await page.locator('text=ACTUAL EXAM').count(),1);await snapshot('ch01-question-'+current.question.questionId)}await tap(`[data-answer="${current.question.answer}"]`);await tap('[data-action="quiz-next"]')}
    else if(await page.locator('[data-action="advance-dialogue"]').count())await tap('[data-action="advance-dialogue"]');
    else if(current.run.pending)await tap('[data-action="result-next"]');
    else if(current.scene.choices)await tap('[data-choice="0"]');
    else await tap('[data-action="next"]');
    if(++guard>500)throw new Error('mobile play did not complete');
  }
  assert.equal((await read()).run.currentChapter,chapterId);assert.equal(Object.keys((await read()).run.questionResults).length,chapterId==='ch01'?3:11);await fit();await snapshot(chapterId+'-complete');
  }
  assert(checkedOpening&&checked943&&checkedVillagerVoice&&checkedInjuredMerchant&&checkedGyeonhwonRumor&&checkedFoundationExam&&checkedConflict&&checkedGochang&&checkedBelonging);
  await tap('[data-nav="study"]');
  for(const chapterId of ['ch01','ch02']){
    await tap('[data-review-chapter="'+chapterId+'"]');
    const total=await page.evaluate(id=>SPLIT_REVIEW_IDS[id].length,chapterId);
    if(chapterId==='ch01')assert(await page.evaluate(()=>SPLIT_REVIEW_IDS.ch01.every(id=>QUESTIONS.find(q=>q.questionId===id)?.isOfficial)));
    for(let index=0;index<total;index++){const answer=await page.evaluate(()=>QUESTIONS.find(q=>q.questionId===reviewQuestionId).answer);await tap('[data-answer="'+answer+'"]');await tap('[data-action="quiz-next"]');await fit()}
    assert.equal(await page.evaluate(()=>meta().ch01ReviewAttempts.at(-1).correct),total);
  }
  await page.reload();await tap('[data-action="play"]');await tap('[data-nav="teaser"]');await tap('[data-chapter="ch03"]');assert.equal((await read()).run.currentChapter,'ch03');
  let checkedRobes=false,checkedHyunwooOfficial=false,checkedGwangdeok=false,checkedJunpung=false,checkedFreedMan=false,checkedDoyun960=false;
  while(!(await read()).run.completed){
    const current=await read();await fit();
    if(current.run.storyId==='ch02_official_robes_walk'&&!checkedRobes){assert((await page.locator('.game').getAttribute('style')).includes('ch02-official-robes-street-960.png'));assert.equal(await page.locator('.stage-character').count(),0);await snapshot('ch03-official-robes-background');checkedRobes=true}
    if(current.run.storyId==='ch02_hyunwoo_official'&&current.run.dialogueCursor===1&&!checkedHyunwooOfficial){assert.equal(await page.locator('[data-character-id="hyunwoo"][data-position="right"]').count(),1);await snapshot('ch03-hyunwoo-official');checkedHyunwooOfficial=true}
    if(current.run.storyId==='ch02_reign_titles'&&current.run.dialogueCursor===1&&!checkedGwangdeok){assert.equal(current.scene.illustrationId,'ch02-gaegyeong-market');assert.equal(await page.locator('.stage-character').count(),0);assert.equal(await page.locator('.character-name').filter({hasText:'상인 A'}).count(),1);await snapshot('ch03-gwangdeok-ambient-voices');checkedGwangdeok=true}
    if(current.run.storyId==='ch02_reign_followup'&&current.run.dialogueCursor===1&&!checkedJunpung){assert.equal(current.scene.illustrationId,'ch02-gaegyeong-market');assert.equal(await page.locator('.stage-character').count(),0);assert.equal(await page.locator('.character-name').filter({hasText:'상인 A'}).count(),1);await snapshot('ch03-junpung-ambient-voices');checkedJunpung=true}
    if(current.run.storyId==='ch02_purge'&&current.run.dialogueCursor===2&&!checkedFreedMan){assert.equal(await page.locator('[data-character-id="freed_man"][data-position="left"]').count(),1);await snapshot('ch03-freed-man');checkedFreedMan=true}
    if(current.run.storyId==='ch02_purge'&&current.run.dialogueCursor===3&&!checkedDoyun960){assert.equal(await page.locator('[data-character-id="doyun"][data-position="left"]').count(),1);assert.equal(current.run.characterStates.doyun.characterAge,68);await snapshot('ch03-doyun-960');checkedDoyun960=true}
    if(current.question){await tap(`[data-answer="${current.question.answer}"]`);await tap('[data-action="quiz-next"]')}
    else if(await page.locator('[data-action="advance-dialogue"]').count())await tap('[data-action="advance-dialogue"]');
    else if(current.run.pending)await tap('[data-action="result-next"]');
    else if(current.scene.choices)await tap('[data-choice="0"]');
    else await tap('[data-action="next"]');
    if(++guard>800)throw new Error('mobile CH.03 play did not complete');
  }
  assert(checkedRobes&&checkedHyunwooOfficial&&checkedGwangdeok&&checkedJunpung&&checkedFreedMan&&checkedDoyun960);assert.equal(Object.keys((await read()).run.questionResults).length,12);assert(await page.locator('text=CHAPTER 03 CLEAR').count());await fit();await snapshot('ch03-complete');
  await tap('[data-review-chapter="ch03"]');
  for(let index=0;index<5;index++){const answer=await page.evaluate(()=>QUESTIONS.find(q=>q.questionId===reviewQuestionId).answer);await tap('[data-answer="'+answer+'"]');await tap('[data-action="quiz-next"]');await fit()}
  assert.equal(await page.evaluate(()=>meta().ch01ReviewAttempts.at(-1).correct),5);
  for(const width of [320,390,760]){await page.setViewportSize({width,height:844});await fit()}
  assert.deepEqual(errors,[]);console.log('PASS: isolated mobile CH.01~03 full play, CH.01 official-only 3-question pacing, injured merchant standing exception, ambient residents, conflict/reconciliation/belonging beats, Gwangdeok/Junpung market backgrounds, dynamic reviews, reload, and 320/390/760px overflow.');
}
main().catch(error=>{console.error(error.stack||error);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
