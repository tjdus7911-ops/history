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
  const answerQuestion=async answer=>{if(await page.locator('[data-pick-answer]').count()){await tap(`[data-pick-answer="${answer}"]`);await tap('[data-submit-answer]')}else await tap(`[data-answer="${answer}"]`)};
  const fit=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'mobile horizontal overflow');
  const snapshot=async name=>{if(!process.env.TEST_ARTIFACT_DIR)return;fs.mkdirSync(process.env.TEST_ARTIFACT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.TEST_ARTIFACT_DIR,name+'.png'),fullPage:true})};
  await tap('[data-era-open="goryeo"]');await tap('[data-era-resume="goryeo"]');
  let guard=0,checkedOpening=false,checkedNormalMerchant=false,checked943=false,checkedVillagerVoice=false,checkedInjuredMerchant=false,checkedGyeonhwonRumor=false,checkedFoundationExam=false,checkedConflict=false,checkedGochang=false,checkedBelonging=false;
  const ch02DuoScenes=new Set();
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
    if(current.run.storyId==='rumor'&&current.run.dialogueCursor===1&&!checkedVillagerVoice){const rumorStyle=await page.locator('.game').getAttribute('style');assert(rumorStyle.includes('songak-village-918.webp'),rumorStyle);assert.equal(await page.locator('.stage-character').count(),0);assert.equal(await page.locator('.character-name').filter({hasText:'주민 A'}).count(),1);await snapshot('ch01-villager-ambient-voice');checkedVillagerVoice=true}
    if(current.run.storyId==='foundation'&&!checkedFoundationExam){assert.equal(current.scene.questionSetStatus,'ready');assert.deepEqual(current.scene.linkedQuestionIds,['ch01-official-69-basic-10','ch01-official-79-advanced-09','ch01-practice-foundation-sequence']);assert.equal(await page.locator('.stage-character').count(),0);await snapshot('ch01-foundation-three-question-ready');checkedFoundationExam=true}
    if(current.run.storyId==='ch01_trade_start'&&current.run.dialogueCursor===3&&!checkedNormalMerchant){assert.equal(await page.locator('[data-character-id="doyun"][data-position="left"]').count(),1);assert.equal(await page.locator('[data-character-id="player"][data-position="right"]').count(),1);await snapshot('ch01-trade-duo-918');checkedNormalMerchant=true}
    if(current.run.storyId==='ch01_gongsan'&&current.run.dialogueCursor===5&&!checkedInjuredMerchant){assert.equal(await page.locator('[data-character-id="merchant_01"][data-position="left"][data-portrait="merchant_01_injured_927"]').count(),1);assert.equal(await page.locator('.dialogue-log > :last-child .character-name').textContent(),'부상당한 상인');await snapshot('ch01-injured-merchant-standing');checkedInjuredMerchant=true}
    if(current.run.storyId==='ch01_conflict'&&!checkedConflict){assert(current.scene.dialogues.some(line=>line.dialogue==='다시 시작하면 되잖아요.'));assert(current.scene.dialogues.some(line=>line.dialogue==='자네는 잃을 것이 없으니 그런 말을 하는 것이오.'));await snapshot('ch01-conflict');checkedConflict=true}
    if(current.run.storyId==='ch01_gochang'&&!checkedGochang){const gochangStyle=await page.locator('.game').getAttribute('style');assert(gochangStyle.includes('caravan-peace-930.webp'),gochangStyle);assert.equal(await page.locator('.stage-character').count(),0);await snapshot('ch01-gochang-open-road');checkedGochang=true}
    if(current.run.storyId==='ch01_belonging'&&!checkedBelonging){assert(current.scene.dialogues.some(line=>line.dialogue==='이번에는 우리가 이겼군.'));assert(current.scene.dialogues.some(line=>line.dialogue==='십 년 가까이 여기 살았으면 고려 사람 아니오?'));await snapshot('ch01-belonging');checkedBelonging=true}
    if(current.run.storyId==='ch01_gyeonhwon'&&current.run.dialogueCursor===2&&!checkedGyeonhwonRumor){assert.equal(await page.locator('[data-character-id="merchant_01"][data-position="left"][data-portrait="merchant_01_older_935"]').count(),1);assert.equal(await page.locator('.dialogue-log > :last-child .character-name').textContent(),'상인');await snapshot('ch02-gyeonhwon-recurring-merchant');checkedGyeonhwonRumor=true}
    if(current.run.storyId==='ch01_memory_943'&&current.run.dialogueCursor===8&&!checked943){assert.equal(current.run.characterStates.doyun.characterAge,49);assert.equal(await page.locator('[data-character-id="doyun"][data-position="left"][data-portrait^="doyun_943"]').count(),1);await snapshot('ch02-doyun-943');checked943=true}
    if(chapterId==='ch02'&&!current.question&&await page.locator('[data-character-id="doyun"]').count()&&await page.locator('[data-character-id="player"]').count()&&!ch02DuoScenes.has(current.run.storyId)){
      const geometry=await page.evaluate(()=>Object.fromEntries(['doyun','player'].map(id=>{const element=document.querySelector(`[data-character-id="${id}"]`),rect=element.getBoundingClientRect(),canvas=document.createElement('canvas');canvas.width=element.naturalWidth;canvas.height=element.naturalHeight;const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(element,0,0);const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;let minX=canvas.width,minY=canvas.height,maxX=0,maxY=0;for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(pixels[(y*canvas.width+x)*4+3]>16){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y)}const left=rect.left+minX/canvas.width*rect.width,top=rect.top+minY/canvas.height*rect.height,right=rect.left+(maxX+1)/canvas.width*rect.width,bottom=rect.top+(maxY+1)/canvas.height*rect.height;return [id,{left,right,top,bottom,width:right-left,height:bottom-top}]})));
      for(const [id,rect] of Object.entries(geometry)){assert(rect.width>0&&rect.height>0,`${current.run.storyId}: ${id} must render`);const center=(rect.left+rect.right)/2;assert(id==='doyun'?center<220:center>170,`${current.run.storyId}: ${id} must stay in its dialogue slot ${JSON.stringify(rect)}`);assert(rect.top>=-1,`${current.run.storyId}: ${id} head clipping ${JSON.stringify(rect)}`);assert(rect.bottom<=845,`${current.run.storyId}: ${id} lower-body clipping ${JSON.stringify(rect)}`)}
      ch02DuoScenes.add(current.run.storyId);await snapshot('ch02-duo-'+current.run.storyId);
    }
    if(!['prologue','sleep','voice','house','outfit_question','outfit_gift'].includes(current.run.storyId)&&!current.question){const line=(current.run.pending?current.run.pending.resultDialogues:current.scene.dialogues)?.[(current.run.dialogueCursor||1)-1];if(['thought','narration'].includes(line?.speakerType))assert.equal(await page.locator('.stage-character').count(),0)}
    if(current.question){if(['ch01','ch02'].includes(current.question.chapterId)){const expected=current.question.isOfficial?`[실제 기출] 제${current.question.examRound}회 한국사능력검정시험 · ${current.question.examLevel} · ${current.question.questionNumber}번`:'[심화 연습] 한능검 심화 대비';if(current.question.isOfficial)assert(current.question.sourceVerified);else assert.equal(current.question.sourceType,'original_advanced_practice');assert.equal(await page.getByText(expected,{exact:true}).count(),1);await snapshot(current.question.chapterId+'-question-'+current.question.questionId)}await answerQuestion(current.question.answer);await tap('[data-action="quiz-next"]')}
    else if(await page.locator('[data-action="advance-dialogue"]').count())await tap('[data-action="advance-dialogue"]');
    else if(current.run.pending)await tap('[data-action="result-next"]');
    else if(current.scene.choices)await tap('[data-choice="0"]');
    else await tap('[data-action="next"]');
    if(++guard>500)throw new Error('mobile play did not complete');
  }
  assert.equal((await read()).run.currentChapter,chapterId);assert.equal(Object.keys((await read()).run.questionResults).length,chapterId==='ch01'?9:15);await fit();await snapshot(chapterId+'-complete');
  }
  for(const sceneId of ['ch01_jump_935','ch01_gyeonhwon','ch01_jump_936','ch01_war_choice','ch01_war_supply','ch01_victory','ch01_sasimgwan','ch01_refugee_family','ch01_memory_943','ch01_taejo_death','ch01_guild_seed'])assert(ch02DuoScenes.has(sceneId),`${sceneId}: Doyun/player two-person mobile frame not observed`);
  assert(checkedOpening&&checkedNormalMerchant&&checked943&&checkedVillagerVoice&&checkedInjuredMerchant&&checkedGyeonhwonRumor&&checkedFoundationExam&&checkedConflict&&checkedGochang&&checkedBelonging);
  await page.reload();await page.evaluate(()=>playMain());await tap('[data-nav="teaser"]');await tap('[data-chapter="ch03"]');assert.equal((await read()).run.currentChapter,'ch03');
  let checkedRobes=false,checkedHyunwooOfficial=false,checkedGwangdeok=false,checkedJunpung=false,checkedFreedMan=false,checkedDoyun960=false;
  while(!(await read()).run.completed){
    const current=await read();await fit();
    if(current.run.storyId==='ch02_official_robes_walk'&&!checkedRobes){const robesStyle=await page.locator('.game').getAttribute('style');assert(robesStyle.includes('exam-notice-958.webp'),robesStyle);assert.equal(await page.locator('.stage-character').count(),0);await snapshot('ch03-official-robes-background');checkedRobes=true}
    if(current.run.storyId==='ch02_hyunwoo_official'&&current.run.dialogueCursor===1&&!checkedHyunwooOfficial){assert.equal(await page.locator('[data-character-id="hyunwoo"]').count(),1);await snapshot('ch03-hyunwoo-official');checkedHyunwooOfficial=true}
    if(current.run.storyId==='ch02_reign_titles'&&current.run.dialogueCursor===1&&!checkedGwangdeok){assert.equal(await page.locator('.stage-character').count(),0);assert.equal(await page.locator('.character-name').filter({hasText:'상인 A'}).count(),1);await snapshot('ch03-gwangdeok-ambient-voices');checkedGwangdeok=true}
    if(current.run.storyId==='ch02_reign_followup'&&current.run.dialogueCursor===1&&!checkedJunpung){assert.equal(await page.locator('.stage-character').count(),0);assert.equal(await page.locator('.character-name').filter({hasText:'상인 A'}).count(),1);await snapshot('ch03-junpung-ambient-voices');checkedJunpung=true}
    if(current.run.storyId==='ch02_purge'&&current.run.dialogueCursor===2&&!checkedFreedMan){await snapshot('ch03-freed-man');checkedFreedMan=true}
    if(current.run.storyId==='ch02_purge'&&current.run.dialogueCursor===3&&!checkedDoyun960){assert.equal(current.run.characterStates.doyun.characterAge,66);await snapshot('ch03-doyun-960');checkedDoyun960=true}
    if(current.question){await answerQuestion(current.question.answer);await tap('[data-action="quiz-next"]')}
    else if(await page.locator('[data-action="advance-dialogue"]').count())await tap('[data-action="advance-dialogue"]');
    else if(current.run.pending)await tap('[data-action="result-next"]');
    else if(current.scene.choices)await tap('[data-choice="0"]');
    else await tap('[data-action="next"]');
    if(++guard>800)throw new Error('mobile CH.03 play did not complete');
  }
  assert(checkedRobes&&checkedHyunwooOfficial&&checkedGwangdeok&&checkedJunpung&&checkedFreedMan&&checkedDoyun960);assert.equal(Object.keys((await read()).run.questionResults).length,29);assert(await page.locator('text=CHAPTER 03 CLEAR').count());await fit();await snapshot('ch03-complete');
  for(const width of [320,390,760]){await page.setViewportSize({width,height:844});await fit()}
  assert.deepEqual(errors,[]);console.log('PASS: isolated 390x844 CH.01~03 full play, 9/15-question early pacing, exact source labels, all major CH.02 Doyun/player scenes, reload, and 320/390/760px overflow.');
}
main().catch(error=>{console.error(error.stack||error);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});
