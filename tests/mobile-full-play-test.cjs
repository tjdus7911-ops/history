const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const{chromium}=require('playwright');
const root=path.resolve(__dirname,'../dist'),shots=path.resolve(__dirname,'../tmp/mobile-full-play');
const server=http.createServer((req,res)=>{const relative=decodeURIComponent(req.url.split('?')[0]),file=path.resolve(root,'.'+(relative==='/'?'/index.html':relative));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}fs.readFile(file,(error,buffer)=>{if(error){res.writeHead(404);return res.end()}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webmanifest':'application/manifest+json'})[path.extname(file)]||'application/octet-stream');res.end(buffer)})});
let browser;
async function main(){
  fs.mkdirSync(shots,{recursive:true});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  const profile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await profile.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const read=()=>page.evaluate(()=>({screen,storyId:run().storyId,chapter:run().currentChapter,pending:Boolean(run().pending),cursor:run().dialogueCursor,dialogues:(run().pending?conversationEntries(STORIES[run().pending.sourceSceneId],run().pending):conversationEntries(STORIES[run().storyId],null)).length,questionId:run().activeQuestionId,answer:run().questionAnswer,queue:[...(run().questionQueue||[])],queueIndex:run().questionQueueIndex||0,completed:run().completed,characterStates:JSON.parse(JSON.stringify(run().characterStates)),wrong:[...meta().wrongQuestionIds],cards:[...meta().cards],completedChapters:[...meta().completedChapters]}));
  const tap=async selector=>{const locator=page.locator(selector).first();await locator.waitFor({state:'attached'});await locator.evaluate(element=>element.click());await page.evaluate(()=>{inputLockedUntil=0});await page.waitForTimeout(24)};
  const answerQuestion=async answer=>{if(await page.locator('[data-pick-answer]').count()){await tap(`[data-pick-answer="${answer}"]`);await tap('[data-submit-answer]')}else await tap(`[data-answer="${answer}"]`)};
  const fit=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`horizontal overflow at ${(await read()).storyId}`);
  const shot=async name=>page.screenshot({path:path.join(shots,`${name}.png`),fullPage:true});
  await tap('[data-era-open="goryeo"]');await tap('[data-era-resume="goryeo"]');
  const expectedQueues={ch01:[['ch01-official-69-basic-10','ch01-official-79-advanced-09','ch01-practice-foundation-sequence'],['ch01-practice-gongsan-source','ch01-practice-gongsan-result','ch01-practice-gongsan-after'],['ch01-practice-gochang-compare','ch01-practice-gochang-order','ch01-practice-gochang-context']],ch02:[['ch01-official-73-basic-10','ch02-official-66-advanced-09','ch01-official-74-advanced-10'],['ch01-official-76-advanced-10','ch01-official-70-advanced-10','ch02-practice-illyecheon-situation'],['ch02-official-67-basic-10','ch03-official-75-basic-12','ch02-official-65-advanced-10'],['ch02-official-67-basic-11','ch02-practice-north-policy','ch02-practice-north-compare'],['ch02-official-69-advanced-10','ch02-practice-hunyo-source','ch02-practice-taejo-policy']],ch03:[["ch03-pdf-69-advanced-10","ch03-pdf-75-basic-12"],["ch03-practice-king-949","ch03-practice-kings-flow"],["ch03-practice-king-956"],["ch03-pdf-65-advanced-10"],["ch03-pdf-65-advanced-11"],["ch03-practice-nobi-basic","ch02-review-01","ch02-official-74-advanced-11"],["ch03-practice-nobi-power","ch03-pdf-73-advanced-11"],["ch03-pdf-76-advanced-11"],["ch02-test-02","ch03-practice-gwageo-purpose","ch02-official-78-advanced-11"],["ch03-official-71-advanced-11","ch03-pdf-75-basic-10"],["ch02-test-robes","ch03-pdf-68-advanced-09","ch03-pdf-76-advanced-18"],["ch02-test-04","ch02-official-76-advanced-50","ch02-official-77-advanced-14"],["ch03-pdf-70-advanced-13","ch03-pdf-79-advanced-13"],["ch02-test-06","ch03-official-68-advanced-11"],["ch03-pdf-72-advanced-11"]],ch04:[['ch03-official-75-basic-10','ch04-official-68-advanced-09','ch04-official-65-advanced-11']]};
  const seenQueues={ch01:[],ch02:[],ch03:[],ch04:[]},seenScenes=new Set(),completed=[],checks={injured:false,943:false,examEve:false,gilsang:false,hyunwoo:false,oldDoyun:false,soliloquy:false,death:false,legacy:false,reloaded:false,summary:false},questionOrder=[];
  let deliberatelyWrong=false,guard=0;
  while(completed.length<4){
    if(++guard>1800)throw Error(`mobile play guard at ${JSON.stringify(await read())}`);const now=await read();await fit();
    if(now.screen==='quiz'){
      if(now.answer===null){
        if(now.queueIndex===0){if(!seenQueues[now.chapter].some(queue=>JSON.stringify(queue)===JSON.stringify(now.queue)))seenQueues[now.chapter].push(now.queue);assert(now.queue.length>=1&&now.queue.length<=3)}
        const source=await page.evaluate(()=>{const question=activeQuestion();return {isOfficial:question.isOfficial,sourceVerified:question.sourceVerified,sourceType:question.sourceType,examRound:question.examRound,examLevel:question.examLevel,questionNumber:question.questionNumber,chapterId:question.chapterId}});
        const early=['ch01','ch02'].includes(source.chapterId),expectedLabel=source.chapterId==='ch03'?(source.isOfficial?`[실제 기출] 제${source.examRound}회 한국사능력검정시험 · ${source.examLevel} · ${source.questionNumber}번`:'[심화 연습] 자체 제작'):early?(source.isOfficial?`[실제 기출] 제${source.examRound}회 한국사능력검정시험 · ${source.examLevel} · ${source.questionNumber}번`:'[심화 연습] 한능검 심화 대비'):source.isOfficial?`[실제 기출] 제${source.examRound}회 한국사능력검정시험 · ${source.examLevel} · ${source.questionNumber}번`:'[심화 연습] 자체 제작';if(source.isOfficial)assert(source.sourceVerified);else assert.equal(source.sourceType,'original_advanced_practice');assert.equal(await page.getByText(expectedLabel,{exact:true}).count(),1);
        questionOrder.push(now.questionId);const correct=await page.evaluate(()=>activeQuestion().answer),choices=await page.evaluate(()=>activeQuestion().choices.length),selected=!deliberatelyWrong?(correct+1)%choices:correct;deliberatelyWrong=true;await answerQuestion(selected);
        const answered=await read();if(answered.queue.length>1&&answered.queueIndex===answered.queue.length-1){assert(await page.getByText('이번 기억',{exact:false}).count());assert(await page.getByText('이야기 계속',{exact:true}).count());checks.summary=true;await shot(`${answered.chapter}-question-set-summary`)}
      }else{
        if(!checks.reloaded&&now.chapter==='ch02'&&now.queueIndex===1){await page.reload();await page.evaluate(()=>playMain());assert.equal((await read()).queueIndex,1);assert.equal((await read()).screen,'quiz');checks.reloaded=true}
        await tap('[data-action="quiz-next"]');
      }
      continue;
    }
    if(now.screen==='complete'){
      if(!completed.includes(now.chapter))completed.push(now.chapter);await shot(`${now.chapter}-complete`);if(now.chapter==='ch04')break;await tap('[data-nav="teaser"]');continue;
    }
    if(now.screen==='teaser'){const next={ch01:'ch02',ch02:'ch03',ch03:'ch04'}[now.chapter];await tap(`[data-action="start-chapter"][data-chapter="${next}"]`);continue}
    assert.equal(now.screen,'game');seenScenes.add(now.storyId);
    if(now.storyId==='ch01_gongsan'&&!checks.injured){while((await read()).cursor<5)await tap('[data-action="advance-dialogue"]');const merchant=page.locator('[data-character-id="merchant_01"]');assert(await merchant.count());await merchant.evaluate(image=>image.decode());assert(await merchant.evaluate(image=>image.naturalWidth>0));checks.injured=true;await shot('ch01-injured-merchant')}
    if(now.storyId==='ch01_memory_943'&&!checks[943]){assert.equal(now.characterStates.doyun.ageState,'mature_943');checks[943]=true}
    if(now.storyId==='ch02_policy_reason')checks.gilsang=true;
    if(now.storyId==='ch02_exam_eve'&&!checks.examEve){const style=await page.locator('.game').getAttribute('style');assert(style.includes('shop-interior-night-960.webp'));checks.examEve=true}
    if(now.storyId==='ch02_hyunwoo_official')checks.hyunwoo=true;
    if(now.storyId==='ch03_dream_realized'&&!checks.oldDoyun){while((await read()).cursor<2)await tap('[data-action="advance-dialogue"]');const doyun=page.locator('[data-character-id="doyun"]');assert(await doyun.count());await doyun.evaluate(image=>image.decode());assert(await doyun.evaluate(image=>image.naturalWidth>0));checks.oldDoyun=true;await shot('ch04-doyun-guild')}
    if(now.storyId==='ch03_doyun_soliloquy'&&!checks.soliloquy){assert.equal(now.questionId,null);while((await read()).cursor<5)await tap('[data-action="advance-dialogue"]');assert(await page.getByText('나쁘지 않은 장사였소.',{exact:false}).count());checks.soliloquy=true;await shot('ch04-doyun-soliloquy')}
    if(now.storyId==='ch03_death'){assert.equal(now.questionId,null);checks.death=true}
    if(now.storyId==='ch03_legacy'){assert.equal(now.questionId,null);checks.legacy=true}
    if(now.cursor<now.dialogues){if(await page.locator('[data-action="advance-dialogue"]').count())await tap('[data-action="advance-dialogue"]');else await page.waitForFunction(cursor=>run().dialogueCursor>cursor,now.cursor,{timeout:2500});continue}
    if(now.pending){await tap('[data-action="result-next"]');continue}
    if(await page.locator('[data-choice]').count()){await tap('[data-choice="0"]');continue}
    await tap('[data-action="next"]');
  }
  assert.deepEqual(completed,['ch01','ch02','ch03','ch04']);
  for(const id of ['ch01_conflict','ch01_reconcile','ch01_belonging','ch01_memory_943','ch01_guild_seed','ch02_policy_reason','ch02_exam_day','ch03_courtyard','ch03_weakening','ch03_farewell','ch03_doyun_soliloquy','ch03_death','ch03_legacy'])assert(seenScenes.has(id),id);
  assert.deepEqual(seenQueues.ch01,expectedQueues.ch01);assert.deepEqual(seenQueues.ch02,expectedQueues.ch02);assert.deepEqual(seenQueues.ch03,expectedQueues.ch03);assert.deepEqual(seenQueues.ch04,expectedQueues.ch04);
  assert(Object.values(checks).every(Boolean),JSON.stringify(checks));const final=await read();assert.equal(final.characterStates.doyun.isAlive,false);assert(final.wrong.length>=1);assert(final.cards.includes('gukjagam'));assert.deepEqual(errors,[]);
  await tap('[data-action="request-replay"]');await tap('[data-action="confirm-replay"][data-chapter="ch04"]');const replay=await read();assert.equal(replay.chapter,'ch04');assert.equal(replay.storyId,'ch03_transition');assert.equal(replay.characterStates.doyun.ageState,'elder_982');
  console.log(`PASS: 390px CH.01–04 full play (${seenScenes.size} scenes, ${questionOrder.length} answers), queues, exact source labels, reload, wrong note, history cards, aging portraits, Doyun finale, and replay.`);
}
main().finally(async()=>{if(browser)await browser.close();server.close()}).catch(error=>{console.error(error);process.exitCode=1});
