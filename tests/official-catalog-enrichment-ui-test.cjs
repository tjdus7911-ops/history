const fs=require('fs'),vm=require('vm'),assert=require('assert');

const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)]
  .map(match=>match[1]).filter(name=>name!=='pwa.js');
let html='',saved=null,handlers={};
const root={set innerHTML(value){html=value}};
const document={
  visibilityState:'visible',
  querySelector:selector=>selector==='#app'?root:null,
  querySelectorAll:()=>[],
  addEventListener:(type,handler,capture)=>{(handlers[type]||=[]).push({handler,capture})},
  createElement:()=>({setAttribute(){},remove(){}}),
  body:{append(){}}
};
const context=vm.createContext({console,document,localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>1,clearInterval(){}});
const run=code=>vm.runInContext(code,context),copy=code=>JSON.parse(run(`JSON.stringify(${code})`));
run(scripts.map(name=>fs.readFileSync(`dist/${name}`,'utf8')).join('\n'));

function click(dataset){
  run('inputLockedUntil=0');let stopped=false;const button={dataset,disabled:false};
  for(const item of (handlers.click||[]).slice().sort((a,b)=>Number(Boolean(b.capture))-Number(Boolean(a.capture)))){
    item.handler({target:{closest:selector=>selector==='button'?button:null},stopImmediatePropagation(){stopped=true}});
    if(stopped)break;
  }
}

function createLoaderHarness(){
  let markup='',renderCount=0,savedState=null;const eventHandlers={};
  const appRoot={set innerHTML(value){markup=value;renderCount++}};
  const testDocument={
    visibilityState:'visible',
    querySelector:selector=>selector==='#app'?appRoot:null,
    querySelectorAll:()=>[],
    addEventListener:(type,handler,capture)=>{(eventHandlers[type]||=[]).push({handler,capture})},
    createElement:()=>({setAttribute(){},remove(){}}),
    body:{append(){}}
  };
  const testContext=vm.createContext({console,document:testDocument,localStorage:{getItem:()=>savedState,setItem:(key,value)=>savedState=value},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>1,clearInterval(){}});
  const testRun=code=>vm.runInContext(code,testContext);
  testRun(scripts.map(name=>fs.readFileSync(`dist/${name}`,'utf8')).join('\n'));
  return {
    context:testContext,
    run:testRun,
    renderCount:()=>renderCount,
    markup:()=>markup,
    click(dataset){
      testRun('inputLockedUntil=0');let stopped=false;const button={dataset,disabled:false};
      for(const item of (eventHandlers.click||[]).slice().sort((a,b)=>Number(Boolean(b.capture))-Number(Boolean(a.capture)))){
        item.handler({target:{closest:selector=>selector==='button'?button:null},stopImmediatePropagation(){stopped=true}});
        if(stopped)break;
      }
    },
    dispatch(type,target){
      for(const item of eventHandlers[type]||[])item.handler({target});
    }
  };
}

function loaderPayload(harness){
  return harness.run(`({schemaVersion:3,canonicalChoiceCount:8350,records:OFFICIAL_EXAM_CATALOG.map(entry=>{const count=entry.sourceRecord.examLevel==='기본'?4:5;return {officialQuestionId:entry.sourceRecord.officialQuestionId,choices:Array.from({length:count},(_,index)=>'ASYNC-'+entry.sourceRecord.officialQuestionId+'-'+index),choiceExplanations:Array.from({length:count},(_,index)=>({choiceIndex:index,choiceText:'ASYNC-'+entry.sourceRecord.officialQuestionId+'-'+index,explanation:'async fixture'}))}})})`);
}

async function assertAsyncLoaderContract(){
  {
    const harness=createLoaderHarness(),calls=[];let resolveFetch;
    harness.context.fetch=(url,options)=>{calls.push({url,options});return new Promise(resolve=>{resolveFetch=resolve})};
    const wrongId=harness.run(`(()=>{const question=QUESTIONS.find(item=>item.isOfficial&&(globalThis.THREE_LEARNING_BOUNDARY?.canPractice(item)??true)&&(globalThis.PROTO_LEARNING_BOUNDARY?.canPractice(item)??true));if(!question)throw new Error('official wrong-answer fixture missing');const data=meta();data.wrongQuestionIds=[question.questionId];data.wrongAnswers=[{questionId:question.questionId,userAnswer:0,answeredAt:'2026-10-12T00:00:00.000Z'}];data.questionRecords[question.questionId]={attempts:1,correctCount:0,lastAnswer:0,lastCorrect:false};screen='home';render();return question.questionId})()`);
    assert(harness.markup().includes(`data-review="${wrongId}"`)&&!harness.markup().includes('official-choice-load'),'home recent-wrong preview must not render hidden choice explanations');
    assert.equal(calls.length,0,'closed home wrong-answer detail eagerly fetched choice explanations');
    harness.run(`studyTab='review';screen='study';render()`);
    assert(harness.markup().includes(`data-wrong-detail="${wrongId}"`)&&!harness.markup().includes(`data-wrong-detail="${wrongId}" open`),'review list must render wrong-answer detail closed');
    assert.equal(calls.length,0,'closed review-list detail eagerly fetched choice explanations');
    const details={dataset:{wrongDetail:wrongId},open:true,closest:selector=>selector==='details[data-wrong-detail]'?details:null};
    harness.dispatch('toggle',details);
    assert.equal(calls.length,1,'opening a wrong-answer detail must start one lazy payload fetch');
    assert.equal(harness.run('OFFICIAL_EXAM_EXPLANATION_LOADER.state'),'loading');
    assert(harness.markup().includes(`data-wrong-detail="${wrongId}" open`)&&harness.markup().includes('official-choice-load'),'opened detail must stay open while choice explanations load');
    const pending=harness.run('OFFICIAL_EXAM_EXPLANATION_LOADER.ensure()');
    resolveFetch({ok:true,status:200,json:()=>Promise.resolve(loaderPayload(harness))});
    assert.equal(await pending,true);
    assert.equal(calls.length,1,'hydrating an opened wrong-answer detail fetched more than once');
    assert(harness.markup().includes(`data-wrong-detail="${wrongId}" open`)&&harness.markup().includes('async fixture'),'opened detail did not rerender with hydrated explanations');
    details.open=false;harness.dispatch('toggle',details);
    const closed=harness.run(`v2QuestionRow(QUESTIONS.find(item=>item.questionId===${JSON.stringify(wrongId)}))`);
    assert(!closed.includes(`data-wrong-detail="${wrongId}" open`)&&!closed.includes('async fixture'),'closing a wrong-answer detail must clear its expanded explanation state');
    details.open=true;harness.dispatch('toggle',details);
    assert.equal(calls.length,1,'reopening after hydration must reuse the ready payload');
    assert(harness.markup().includes(`data-wrong-detail="${wrongId}" open`)&&harness.markup().includes('async fixture'),'reopened detail did not restore hydrated explanations');
  }
  {
    const harness=createLoaderHarness(),calls=[];let resolveFetch;
    harness.context.fetch=(url,options)=>{calls.push({url,options});return new Promise(resolve=>{resolveFetch=resolve})};
    const rendersBefore=harness.renderCount();
    const loading=harness.run(`(()=>{const question=QUESTIONS.find(item=>item.isOfficial);return OFFICIAL_EXAM_UI.choiceExplanations(question,0)})()`);
    assert(loading.includes('official-choice-load')&&loading.includes('불러오는 중'),'idle loader must expose a loading state');
    assert.equal(harness.run('OFFICIAL_EXAM_EXPLANATION_LOADER.state'),'loading');
    const pending=harness.run('OFFICIAL_EXAM_EXPLANATION_LOADER.ensure()');
    assert.equal(calls.length,1,'concurrent loader calls must share one fetch');
    assert.deepEqual(calls[0],{url:'/official-exam-explanations.json',options:{cache:'no-cache'}},'lazy payload request contract changed');
    resolveFetch({ok:true,status:200,json:()=>Promise.resolve(loaderPayload(harness))});
    assert.equal(await pending,true,'successful lazy payload must resolve true');
    assert.equal(harness.run('OFFICIAL_EXAM_EXPLANATION_LOADER.state'),'ready');
    assert.equal(calls.length,1,'successful lazy payload fetched more than once');
    assert(harness.renderCount()>rendersBefore,'successful hydration must rerender the UI');
    const ready=harness.run(`(()=>{const question=QUESTIONS.find(item=>item.isOfficial);return OFFICIAL_EXAM_UI.choiceExplanations(question,0)})()`);
    assert(ready.includes('async fixture')&&!ready.includes('official-choice-load'),'hydrated choice explanations did not replace loading state');
  }
  {
    const harness=createLoaderHarness(),calls=[];let resolveFetch;
    harness.context.fetch=(url,options)=>{calls.push({url,options});return new Promise(resolve=>{resolveFetch=resolve})};
    harness.run(`(()=>{const question=QUESTIONS.find(item=>item.isOfficial);return OFFICIAL_EXAM_UI.choiceExplanations(question,0)})()`);
    const failed=harness.run('OFFICIAL_EXAM_EXPLANATION_LOADER.ensure()');
    resolveFetch({ok:false,status:503,json:()=>Promise.reject(new Error('unexpected json'))});
    assert.equal(await failed,false,'failed lazy payload must resolve false');
    assert.equal(harness.run('OFFICIAL_EXAM_EXPLANATION_LOADER.state'),'error');
    const errorMarkup=harness.run(`(()=>{const question=QUESTIONS.find(item=>item.isOfficial);return OFFICIAL_EXAM_UI.choiceExplanations(question,0)})()`);
    assert(errorMarkup.includes('official-choice-load error')&&errorMarkup.includes('다시 불러오기'),'failed lazy payload must expose retry UI');
    harness.click({officialExplanationsRetry:'true'});
    assert.equal(calls.length,2,'retry action must issue exactly one additional fetch');
    assert.equal(harness.run('OFFICIAL_EXAM_EXPLANATION_LOADER.state'),'loading');
    const retried=harness.run('OFFICIAL_EXAM_EXPLANATION_LOADER.ensure()');
    resolveFetch({ok:true,status:200,json:()=>Promise.resolve(loaderPayload(harness))});
    assert.equal(await retried,true,'retry must recover after a valid payload');
    assert.equal(harness.run('OFFICIAL_EXAM_EXPLANATION_LOADER.state'),'ready');
    assert.equal(calls.length,2,'retry recovery fetched more than once');
  }
}

assertAsyncLoaderContract().then(()=>{

assert.equal(run(`OFFICIAL_EXAM_UI.thumbnail({sourceRecord:{questionImage:'legacy-question.webp'}})`),'legacy-question.webp');
assert.equal(run(`OFFICIAL_EXAM_UI.detail({sourceRecord:{questionImage:'legacy-question.webp'}})`),'legacy-question.webp');
assert.equal(run(`typeof OFFICIAL_EXAM_UI.choiceExplanations`),'function');assert.equal(run(`typeof OFFICIAL_EXAM_UI.imageOpen`),'function');

const supplement=copy(`(()=>{const question=QUESTIONS.find(item=>item.questionId==='story-official-60-basic-03');if(!question)throw new Error('60-basic story supplement missing');return {detail:OFFICIAL_EXAM_UI.detail(question),markup:OFFICIAL_EXAM_UI.choiceExplanations(question,question.answer),inlineCount:question.choiceExplanations?.length,loaderState:OFFICIAL_EXAM_EXPLANATION_LOADER.state}})()`);
assert(supplement.detail.includes('60-basic-03.webp'),'non-canonical story supplement lost its original image fallback');
assert.equal(supplement.inlineCount,4);assert(!supplement.markup.includes('official-choice-load'),'verified story supplement incorrectly waited for the 1,800-question lazy payload');
assert.equal(supplement.loaderState,'idle','inline supplement must not trigger the canonical payload fetch');

run(`{const question=QUESTIONS.find(item=>item.choiceExplanations?.length&&OFFICIAL_EXAM_CATALOG.some(entry=>entry.aliases.includes(item.questionId)||entry.sourceRecord.officialQuestionId===item.officialQuestionId));question.__savedChoiceExplanations=question.choiceExplanations;question.choiceExplanations=['LEGACY-INLINE'];this.__lazyProbe=OFFICIAL_EXAM_UI.choiceExplanations(question,0);question.choiceExplanations=question.__savedChoiceExplanations;delete question.__savedChoiceExplanations;const records=OFFICIAL_EXAM_CATALOG.map(entry=>{const count=entry.sourceRecord.examLevel==='기본'?4:5;return {officialQuestionId:entry.sourceRecord.officialQuestionId,choices:Array.from({length:count},(_,index)=>'FIXTURE-'+entry.sourceRecord.officialQuestionId+'-'+index),choiceExplanations:Array.from({length:count},(_,index)=>({choiceIndex:index,choiceText:'FIXTURE-'+entry.sourceRecord.officialQuestionId+'-'+index,explanation:'fixture'}))}});OFFICIAL_EXAM_EXPLANATION_LOADER.hydrate({schemaVersion:3,canonicalChoiceCount:8350,records});}`);
assert(!run('__lazyProbe').includes('LEGACY-INLINE')&&run('__lazyProbe').includes('불러오지 못했습니다'),'partial legacy choice data must not bypass the canonical lazy payload');
const storyMapping=copy(`(()=>{
  const question=QUESTIONS.find(item=>{
    const mapped=item.officialQuestionId&&OFFICIAL_EXAM_CATALOG.find(entry=>entry.sourceRecord.officialQuestionId===item.officialQuestionId&&!entry.aliases.includes(item.questionId));
    const canonical=mapped&&QUESTIONS.find(candidate=>candidate.questionId===mapped.canonicalQuestionId);
    return item.protoStoryVersion===3&&mapped&&Number(item.rewardKnowledge)!==Number(canonical?.rewardKnowledge);
  });
  if(!question)throw new Error('story-specific official reward fixture missing');
  const entry=OFFICIAL_EXAM_CATALOG.find(item=>item.sourceRecord.officialQuestionId===question.officialQuestionId),saved={detailImage:entry.detailImage,detailImageWidth:entry.detailImageWidth,detailImageHeight:entry.detailImageHeight};
  entry.detailImage='story-hq-detail.webp';entry.detailImageWidth=1280;entry.detailImageHeight=1960;
  const detail=OFFICIAL_EXAM_UI.choiceExplanations(question,question.answer),figure=officialQuestionFigure(question,'스토리 기출'),model=JSON.parse(JSON.stringify(state));
  model.run.questionResults={};model.run.stats.knowledge=10;model.meta.questionRecords={};model.meta.wrongQuestionIds=[];model.meta.wrongAnswers=[];model.meta.reviewedQuestionIds=[];model.meta.learningEvents=[];
  const knowledgeBefore=model.run.stats.knowledge;
  recordQuestion(model,question.questionId,question.answer);
  const knowledgeAfterFirst=model.run.stats.knowledge;
  recordQuestion(model,question.questionId,question.answer);
  const knowledgeAfterSecond=model.run.stats.knowledge,wrongAnswer=(question.answer+1)%question.choices.length;
  model.meta.reviewedQuestionIds=[entry.canonicalQuestionId];
  recordQuestion(model,question.questionId,wrongAnswer);
  model.run.visited=[...(model.run.visited||[]),question.relatedSceneId];
  const protoAuthored=globalThis.PROTO_REVISION_RUNTIME?.questionByOfficialId?.get(question.officialQuestionId)?.protoExam,protoBook=globalThis.PROTO_REVISION_ACTIONS?.book?.(model);if(protoBook)for(const sceneId of new Set([...(protoAuthored?.proposed?.requiresReadSceneIds||[]),question.relatedSceneId])){const source=globalThis.PROTO_REVISION_RUNTIME?.sources?.get(sceneId);for(const line of [...(source?.dialogues||[]),...(source?.protoCommon||[])])if(!protoBook.readLineIds.includes(line.lineId))protoBook.readLineIds.push(line.lineId);if(source?.choices?.length&&!Number.isInteger(protoBook.choiceBySceneId[sceneId]))protoBook.choiceBySceneId[sceneId]=0;if(sceneId&&!protoBook.readSceneIds.includes(sceneId))protoBook.readSceneIds.push(sceneId)}
  const originalState=state,canonicalQuestion=QUESTIONS.find(item=>item.questionId===entry.canonicalQuestionId);let wrongRow='';
  try{state=model;wrongRow=v2QuestionRow(canonicalQuestion)}finally{state=originalState}
  const wrongStoryQuestionId=wrongRow.match(/data-story-memory="([^"]+)"/)?.[1],wrongStoryScene=QUESTIONS.find(item=>item.questionId===wrongStoryQuestionId)?.relatedSceneId;
  Object.assign(entry,saved);
  return {
    questionId:question.questionId,canonicalQuestionId:entry.canonicalQuestionId,detail,figure,rewardKnowledge:question.rewardKnowledge,
    firstKnowledgeDelta:knowledgeAfterFirst-knowledgeBefore,secondKnowledgeDelta:knowledgeAfterSecond-knowledgeAfterFirst,
    canonicalRecord:model.meta.questionRecords[entry.canonicalQuestionId],storyRecordPresent:Boolean(model.meta.questionRecords[question.questionId]),
    storyResult:model.run.questionResults[question.questionId],questionAnswer:model.run.questionAnswer,
    wrongIds:model.meta.wrongQuestionIds,reviewedIds:model.meta.reviewedQuestionIds,wrongAnswerIds:model.meta.wrongAnswers.map(item=>item.questionId),wrongRuntimeQuestionIds:model.meta.wrongAnswers.map(item=>item.runtimeQuestionId),wrongStoryQuestionId,wrongStoryScene,eventIds:model.meta.learningEvents.map(item=>item.questionId)
  };
})()`);
assert(storyMapping.detail.includes('fixture'),'story-specific official IDs did not receive the canonical lazy choice explanations');
assert(storyMapping.figure.includes('story-hq-detail.webp')&&storyMapping.figure.includes('width="1280" height="1960"'),'story official figure did not use the HQ detail image and dimensions');
assert.equal(storyMapping.firstKnowledgeDelta,storyMapping.rewardKnowledge,'story-specific official question lost its original knowledge reward');
assert.equal(storyMapping.secondKnowledgeDelta,0,'repeating the same story question granted its first-correct reward twice');
assert(!storyMapping.storyRecordPresent&&storyMapping.storyResult===false&&storyMapping.questionAnswer!==null,'story attempt did not preserve story gameplay results while merging progress');
assert.equal(storyMapping.canonicalRecord.attempts,3,'story attempts were not merged into the canonical official record');
assert.equal(storyMapping.canonicalRecord.correctCount,2,'canonical official correct count did not preserve story attempts');
assert.deepEqual(storyMapping.wrongIds,[storyMapping.canonicalQuestionId],'story wrong-question ID was not canonicalized');
assert.deepEqual(storyMapping.reviewedIds,[],'a later story error did not clear the canonical review state');
assert.deepEqual(storyMapping.wrongAnswerIds,[storyMapping.canonicalQuestionId],'story wrong-answer metadata was not deduplicated under the canonical ID');
assert.deepEqual(storyMapping.wrongRuntimeQuestionIds,[storyMapping.questionId],'canonical wrong-answer metadata lost the originating story question ID');
assert.equal(storyMapping.wrongStoryQuestionId,storyMapping.questionId,'canonical wrong-note row did not restore the originating story question');
assert.equal(storyMapping.wrongStoryScene,run(`QUESTIONS.find(item=>item.questionId===${JSON.stringify(storyMapping.questionId)}).relatedSceneId`),'canonical wrong-note row linked to the wrong story scene');
assert(storyMapping.eventIds.length===3&&storyMapping.eventIds.every(id=>id===storyMapping.canonicalQuestionId),'story learning-event IDs were not canonicalized');

click({nav:'exam-library'});click({officialTab:'round'});click({officialRoundLevel:'심화'});
assert(html.includes('합격률 63.6%'),'verified rate missing from round-card badge or not rounded to one decimal place');
assert(html.includes('합격률 49.3%'),'verified official statistic with a source note must remain connected to its edition and use display rounding');
assert(run(`officialStatisticMarkup({examRound:61,examLevel:'심화'},'card')`).includes('합격률 50.1%'),'50.05% must use decimal half-up display rounding');
assert(run(`officialStatisticMarkup({examRound:66,examLevel:'기본'},'card')`).includes('합격률 46.2%'),'46.15% must use decimal half-up display rounding');
assert(!html.includes('공식 합격률')&&!html.includes('공식 합격률 정보 없음')&&!html.includes('공식 합격률 확인 중'),'round cards must not render the former large pass-rate block or unavailable placeholders');
assert(!html.includes('발표일 2026-08-21')&&!html.includes('국사편찬위원회 출처'),'round cards must hide announcement and source metadata');
assert(!html.includes('class="official-pass-rate verified card"')&&!html.includes('class="open-pill">OPEN</span><h2>제'),'round cards must use only the compact rate badge in the former OPEN position');

run(`OFFICIAL_EXAM_STATISTICS.byEdition['79-advanced'].verificationStatus='SOURCE_NOT_FOUND';render()`);
assert(!html.includes('합격률 63.6%'),'unverified pass rate badge leaked');
assert(!html.includes('공식 합격률 확인 중'),'unverified round-card statistics must not create a placeholder badge or box');
run(`OFFICIAL_EXAM_STATISTICS.byEdition['79-advanced'].verificationStatus='OFFICIAL_VERIFIED';render()`);

click({officialRound:'79',officialEditionLevel:'심화'});
assert(html.includes('aria-label="나의 기출 진행률"'),'personal progress label missing');
assert(html.includes('class="official-pass-rate verified detail"'),'official detail statistic is not separated');
assert(html.indexOf('aria-label="나의 기출 진행률"')<html.indexOf('class="official-pass-rate verified detail"'));

const id=run(`OFFICIAL_EXAM_CATALOG.find(entry=>entry.sourceRecord.examRound===79&&entry.sourceRecord.examLevel==='심화'&&QUESTIONS.find(question=>question.questionId===entry.canonicalQuestionId).acceptedAnswers.length===1).canonicalQuestionId`);
const choiceCount=run(`QUESTIONS.find(question=>question.questionId===${JSON.stringify(id)}).choices.length`);
run(`{
  const entry=OFFICIAL_EXAM_CATALOG.find(item=>item.canonicalQuestionId===${JSON.stringify(id)}),question=QUESTIONS.find(item=>item.questionId===${JSON.stringify(id)});
  entry.thumbnailImage='thumb-only.webp';entry.detailImage='detail-only.webp';entry.libraryImage='legacy-library.webp';
  entry.thumbnailImageWidth=320;entry.thumbnailImageHeight=180;entry.detailImageWidth=1200;entry.detailImageHeight=1600;
  question.thumbnailImage='thumb-only.webp';question.detailImage='detail-only.webp';question.sourceQuestionImage='legacy-question.webp';
  question.thumbnailImageWidth=320;question.thumbnailImageHeight=180;question.detailImageWidth=1200;question.detailImageHeight=1600;
  question.officialChoices=Array.from({length:${choiceCount}},(_,index)=>'CHOICE-'+(index+1));
  question.choiceExplanations=Array.from({length:${choiceCount}},(_,index)=>({choiceIndex:index,choiceText:'CHOICE-'+(index+1),relatedEra:'ERA-'+(index+1),relatedTarget:'TARGET-'+(index+1),meaning:'MEANING-'+(index+1),judgmentReason:'JUDGMENT-'+(index+1),correctedFact:index===0?'CORRECTION-1':null,explanation:'EXPLANATION-'+(index+1),verificationStatus:index===0?'CURATED_VERIFIED':index===1?'DATA_REVIEW_REQUIRED':index===2?'CURATED_REVIEWED':'KNOWLEDGE_RULE',choiceTextVerificationStatus:index===0?'DATA_REVIEW_REQUIRED':index===2?'VISUALLY_REVIEWED':'OCR_EXTRACTED',sourceImageHashVerified:index!==0}));
}`);
run('render()');
assert(html.includes('src="thumb-only.webp"'),'list must use thumbnailImage');
assert(html.includes('width="320" height="180" loading="lazy" decoding="async"'),'thumbnail dimensions/loading contract missing');
assert(!html.includes('src="detail-only.webp"'),'list leaked detailImage');

const legacyLibraryFigure=run(`(()=>{librarySession={era:'goryeo'};const question=QUESTIONS.find(item=>item.questionId===${JSON.stringify(id)});return officialQuestionFigure(question,'상세 이미지')})()`);
assert(legacyLibraryFigure.includes('detail-only.webp'),'legacy exam library practice replaced HQ detail with its thumbnail');
assert(!legacyLibraryFigure.includes('thumb-only.webp')&&!legacyLibraryFigure.includes('legacy-library.webp'),'legacy exam library detail leaked a preview image');
run('librarySession=null');

click({officialSingle:id});
assert(html.includes('src="detail-only.webp"'),'practice must use detailImage');
assert(html.includes('width="1200" height="1600" loading="eager" decoding="async" fetchpriority="high"'),'detail dimensions/loading contract missing');
assert(!html.includes('src="thumb-only.webp"'),'practice must not use the thumbnail');
assert(html.includes(`data-official-image-open="${id}"`),'detail image is not actionable');
assert(!html.includes('EXPLANATION-1')&&!html.includes('선지별 해설'),'choice explanations leaked before answer confirmation');
const answer=run(`QUESTIONS.find(question=>question.questionId===${JSON.stringify(id)}).acceptedAnswers[0]`);
click({officialPick:String(answer)});
assert(html.includes('aria-pressed="true"')&&html.includes('내 선택'),'picked choice needs a non-color state label');
assert(!html.includes('EXPLANATION-1'),'choice explanations leaked after picking but before confirmation');
click({officialSubmit:'true'});
for(let index=1;index<=choiceCount;index++){
  assert(html.includes(`CHOICE-${index}`),`choice ${index} source text missing`);
  assert(html.includes(`MEANING-${index}`),`choice ${index} concise summary missing`);
  assert(html.includes(`JUDGMENT-${index}`),`choice ${index} judgment reason missing`);
  assert(!html.includes(`EXPLANATION-${index}`),`choice ${index} forced a duplicate supplement`);
}
assert(html.includes('official-choice-text">CHOICE-1')&&html.includes('<small>핵심 요약</small>')&&html.includes('<small>판단 이유</small>'),'choice source, concise summary, and judgment structure changed');
assert(!html.includes('<small>선지 원문</small>')&&!html.includes('<small>보충 해설</small>'),'structured choices must not repeat source or force a supplement');
assert(html.includes('MEANING-1')&&html.includes('JUDGMENT-1')&&html.includes('CORRECTION-1'),'structured summary, judgment, or optional correction is missing');
assert(!html.includes('ERA-1')&&!html.includes('TARGET-1'),'era and target metadata must not be forced into every choice introduction');
assert(html.includes('[문제 핵심 해설]'),'question-level analysis heading missing');
assert(/핵심 해설 추가 검수 필요|역사 규칙 대조|출처 근거 검수 완료|수기 해설 검토/.test(html),'question-level explanation verification badge missing');
assert(html.includes('official-choice-badge answer">정답')&&html.includes('official-choice-badge selected">내 선택'),'answer and selection badges missing');
assert(html.includes('출처 근거 검수 완료')&&html.includes('수기 해설 검토')&&html.includes('역사 규칙 대조')&&html.includes('해설 추가 검수 필요'),'choice explanation verification status labels missing');
assert(html.includes('선지 원문 추가 검수 필요'),'curated explanation must not overstate OCR source-text verification');
assert(html.includes('선지 원문 육안 대조'),'visually reviewed source text badge is missing');
assert(html.includes('원본 연결 재확인 필요'),'source-text and image-hash review states must both remain visible');
assert(html.includes('정답·내답'),'graded choice needs a visible non-color answer/selection state');

run(`startOfficialSession([OFFICIAL_EXAM_CATALOG.find(entry=>entry.canonicalQuestionId===${JSON.stringify(id)})],'exam');beginOrResumeOfficialTimer()`);
click({officialPick:String(answer)});
assert(!html.includes('EXPLANATION-1'),'exam mode leaked explanations before grading');
const stableSession=`(()=>{const snapshot=OFFICIAL_EXAM_TIMER.snapshot();return {session:{index:snapshot.index,answers:snapshot.answers,timerState:snapshot.timerState,endTimeMs:snapshot.endTimeMs},stored:meta().officialExamActiveSession}})()`;
const before=copy(stableSession);
click({officialImageOpen:id});
assert(html.includes('official-image-modal')&&html.includes('src="detail-only.webp"'),'fullscreen detail modal missing');
assert(html.includes('선지까지 확인'),'modal must explain vertical scrolling');
assert.deepEqual(copy(stableSession),before,'opening the modal changed answer/timer state');
click({officialImageZoom:'true'});assert(html.includes('official-image-scroll zoomed'));
assert.deepEqual(copy(stableSession),before,'zooming changed answer/timer state');
click({officialImageClose:'true'});assert.equal(run('modal'),null);
assert.deepEqual(copy(stableSession),before,'closing the modal changed answer/timer state');

run(`gradeOfficialSession('MANUAL')`);
assert(html.includes('src="thumb-only.webp"'),'result row must use thumbnailImage');
assert(!html.includes('EXPLANATION-1'),'result summary must not expand choice explanations');
click({officialReview:id});
assert(html.includes('src="detail-only.webp"'),'graded review must use detailImage');
for(let index=1;index<=choiceCount;index++)assert(html.includes(`MEANING-${index}`)&&html.includes(`JUDGMENT-${index}`),`review choice ${index} structured explanation missing`);

const css=fs.readFileSync('dist/exam-memory.css','utf8');
for(const contract of ['.official-image-modal-overlay','height:100dvh','.official-image-scroll{','overflow:auto','touch-action:pan-x pan-y pinch-zoom','.official-choice-explanations','.official-choice-text','word-break:keep-all','overflow-wrap:anywhere','.official-pass-rate','.official-pass-rate-badge','white-space:nowrap'])assert(css.includes(contract),`missing CSS contract: ${contract}`);
assert(!css.includes('.official-pass-rate.card'),'retired card pass-rate box CSS remains');
assert(fs.readFileSync('dist/story-exam-ui.js','utf8').includes("markup.includes('official-choice-load')"),'Story wrapper can duplicate the lazy loading/error block');
console.log('PASS: thumbnail/detail routing, state-safe fullscreen zoom, verified official rates, strict pending state, and spoiler-safe choice explanations.');
}).catch(error=>{console.error(error);process.exitCode=1});
