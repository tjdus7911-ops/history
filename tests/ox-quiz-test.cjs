const crypto=require('crypto'),fs=require('fs'),vm=require('vm'),assert=require('assert');
require('node:child_process').execFileSync(process.execPath,['scripts/build-ox-quiz-curation.cjs','--check'],{stdio:'pipe'});

const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)]
 .map(match=>match[1]).filter(name=>name!=='pwa.js');
let saved=null,html='',handlers={},context;const otherStorage=new Map();

function boot(){
 html='';handlers={};
 context=vm.createContext({
  Date,console,
  document:{
   visibilityState:'visible',
   querySelector:selector=>selector==='#app'?{set innerHTML(value){html=value}}:null,
   querySelectorAll:()=>[],
   addEventListener:(type,handler,capture)=>{(handlers[type]||=[]).push({handler,capture})},
   createElement:()=>({set innerHTML(value){this.value=value},querySelector:()=>null,setAttribute(){},remove(){}}),
   body:{append(){}}
  },
  localStorage:{getItem:key=>key==='lived-history-v1'?saved:otherStorage.get(key)||null,setItem:(key,value)=>{if(key==='lived-history-v1')saved=value;else otherStorage.set(key,value)}},
  window:{scrollTo(){}},navigator:{},
  setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){}
 });
 vm.runInContext(scripts.map(name=>fs.readFileSync('dist/'+name,'utf8')).join('\n'),context);
}

const run=code=>vm.runInContext(code,context);
const copy=code=>JSON.parse(run('JSON.stringify('+code+')'));
function dispatch(type,dataset,value=''){
 run('inputLockedUntil=0');
 let stopped=false;
 const control={dataset,value,disabled:false};
 const target={dataset,value,closest:()=>control,matches:selector=>{const match=selector.match(/^\[data-([a-z-]+)\]$/);if(!match)return false;const key=match[1].replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase());return Object.hasOwn(dataset,key);}};
 for(const item of (handlers[type]||[]).slice().sort((a,b)=>Number(Boolean(b.capture))-Number(Boolean(a.capture)))){
  item.handler({target,stopImmediatePropagation(){stopped=true}});
  if(stopped)break;
 }
}
const click=dataset=>dispatch('click',dataset);
const change=(dataset,value)=>dispatch('change',dataset,value);

function answerCurrent(correct=true){
 const answer=run('OX_QUESTIONS.find(question=>question.id===meta().oxQuiz.activeSession.questionIds[meta().oxQuiz.activeSession.index]).answer');
 click({oxAnswer:String(correct?answer:!answer)});
}

boot();

/* Count the actual curated bank. No fixed inventory or answer ratio is a product requirement. */
const questions=copy('globalThis.OX_QUESTIONS');
const eras=copy('globalThis.OX_ERAS');
const curatedRows=copy('globalThis.OX_QUIZ_CURATION');
const coreItems=copy('globalThis.OX_QUIZ_CORE_ITEMS');
const report=copy('globalThis.OX_ANALYSIS_REPORT');
const curationReport=copy('globalThis.OX_CURATION_REPORT');
const eraIds=eras.map(era=>era.id);
const actualCounts=Object.fromEntries(eraIds.map(eraId=>[eraId,questions.filter(question=>question.eraId===eraId).length]));
assert.equal(eras.length,7,'seven OX eras must be exported');
assert(questions.length>0,'the reviewed OX bank must not be empty');
assert.equal(questions.length,curatedRows.length,'runtime questions must map one-to-one from reviewed source rows');
assert.equal(report.roundCount,23);assert.equal(report.questionCount,1150,'all advanced official questions must remain the analysis basis');
for(const eraId of eraIds){
 assert(actualCounts[eraId]>0,`${eraId} must retain at least one reviewed question`);
 assert.equal(report.eraCounts[eraId],actualCounts[eraId],`${eraId} report count must match the actual bank`);
 assert.equal(curationReport.eraCounts[eraId],actualCounts[eraId],`${eraId} curation report count must match the actual bank`);
}
assert.equal(report.generatedQuestionCount,questions.length,'analysis report total must match actual OX data');
assert.equal(report.curatedQuestionCount,questions.length,'every runtime question must come from reviewed copy');
assert.equal(curationReport.questionCount,questions.length,'generated curation artifact must cover the whole bank');
assert.equal(report.linkedQuestionCount,questions.filter(question=>question.sourceQuestionIds.length).length,'linked count must come from the exported bank');
assert.equal(report.unlinkedQuestionCount,questions.filter(question=>!question.sourceQuestionIds.length).length,'unlinked count must come from explicit source arrays');
assert.equal(report.officialSourceLinkCount,questions.reduce((sum,question)=>sum+question.sourceQuestionIds.length,0));
assert.equal(report.sourcePolicy,'explicit-reviewed-only');
assert.equal(report.contentRevision,'2026-10-jokbo-core-v1');
assert.equal(report.coreItemCount,coreItems.length);
assert.equal(report.coveredCoreItemCount,coreItems.length,'every core learning item must have an active OX');
assert.deepEqual(report.uncoveredCoreIds,[]);
assert.deepEqual(curationReport.answerBalance,{o:questions.filter(question=>question.answer).length,x:questions.filter(question=>!question.answer).length});
assert(curationReport.explanationSentenceRange[0]>=2&&curationReport.explanationSentenceRange[1]<=4,'curated explanations must stay within 2-4 sentences');
assert.equal(curationReport.declarativeStatementCount,questions.length);
assert.equal(curationReport.genericTemplateCount,0);
assert.equal(report.statementDuplicateCount,0);
assert.equal(report.fingerprintDuplicateCount,0);
assert.equal(new Set(questions.map(question=>question.id)).size,questions.length,'question ids must be unique');
assert.equal(new Set(questions.map(question=>question.statement.trim())).size,questions.length,'question statements must be unique');
const sourceRecords=copy('globalThis.OFFICIAL_EXAM_SOURCE_RECORDS');
const advancedIds=new Set(sourceRecords.filter(record=>record.examLevel==='심화').map(record=>record.officialQuestionId));
const advancedById=new Map(sourceRecords.filter(record=>record.examLevel==='심화').map(record=>[record.officialQuestionId,record]));
const curatedById=new Map(curatedRows.map(row=>[row.id,row]));
const coreById=new Map(coreItems.map(item=>[item.id,item]));
const idHistory=JSON.parse(fs.readFileSync('docs/ox-quiz-curation/id-history.json','utf8'));
const retiredIds=new Set(idHistory.retiredIds);
for(const question of questions){
 const source=curatedById.get(question.id),core=coreById.get(question.coreId);
 assert(eraIds.includes(question.eraId),`${question.id}: unknown era`);
 assert(source,`${question.id}: reviewed source row is missing`);
 assert(core&&core.eraId===question.eraId,`${question.id}: core learning item must exist in the same era`);
 assert(question.topicId&&question.coreId&&question.statement.length>10&&question.explanation.length>15,`${question.id}: incomplete learning content`);
 assert.equal(typeof question.answer,'boolean',`${question.id}: answer must be boolean`);
 assert(['easy','medium','hard'].includes(question.difficulty),`${question.id}: unsupported difficulty`);
 assert(Array.isArray(question.tags)&&question.tags.length>=1,`${question.id}: topic labels are required for analysis`);
 assert(Array.isArray(question.sourceRefs)&&question.sourceRefs.length>=1,`${question.id}: genealogy source references are required`);
 assert(Array.isArray(question.sourceQuestionIds)&&Array.isArray(question.sourceRounds),`${question.id}: official source metadata must be arrays`);
 assert.equal(question.contentRevision,report.contentRevision,`${question.id}: content revision mismatch`);
 assert.match(question.contentFingerprint,/^sha256:[0-9a-f]{64}$/,`${question.id}: source fingerprint is required`);
 const normalizedStatement=source.statement.normalize('NFKC').replace(/\s+/g,' ').trim(),expectedFingerprint=`sha256:${crypto.createHash('sha256').update(JSON.stringify([normalizedStatement,source.answer])).digest('hex')}`;
 assert.equal(question.contentFingerprint,expectedFingerprint,`${question.id}: fingerprint must represent the reviewed statement and answer`);
 assert.deepEqual(question.sourceQuestionIds,source.sourceQuestionIds,`${question.id}: runtime must use only explicitly reviewed official links`);
 assert.deepEqual(question.sourceRefs,source.sourceRefs,`${question.id}: runtime must preserve genealogy references`);
 assert.equal(question.contentFingerprint,source.contentFingerprint,`${question.id}: runtime fingerprint must come from the source row`);
 assert(question.sourceQuestionIds.every(id=>advancedIds.has(id)),`${question.id}: sources must be advanced official questions`);
 const expectedRounds=[...new Set(question.sourceQuestionIds.map(id=>advancedById.get(id).examRound))].sort((a,b)=>a-b);
 assert.deepEqual(question.sourceRounds,expectedRounds,`${question.id}: source rounds must derive only from explicit ids`);
 assert.deepEqual([...new Set(question.sourceRounds)].sort((a,b)=>a-b),question.sourceRounds,`${question.id}: source rounds must be unique/sorted`);
 assert.equal(question.frequency,question.sourceRounds.length,`${question.id}: frequency must reflect source rounds`);
}
const assertNoBadAutoLink=(eraId,pattern,badIds,label)=>{
 const matches=questions.filter(question=>question.eraId===eraId&&pattern.test(`${question.statement} ${question.explanation}`));
 for(const question of matches)for(const badId of badIds)assert(!question.sourceQuestionIds.includes(badId),`${label}: ${question.id} must not inherit ${badId} from keyword matching`);
};
assertNoBadAutoLink('kingdoms',/우륵|가야금/,['official-79-advanced-01'],'우륵·가야금/구석기 오연결');
assertNoBadAutoLink('joseon',/내상/,['official-72-advanced-07','official-57-advanced-09'],'조선 내상/발해 대내상 오연결');
assertNoBadAutoLink('joseon',/성호사설/,['official-77-advanced-25','official-72-advanced-27','official-65-advanced-25'],'이익 인물/경제적 이익 오연결');
assert(retiredIds.has('ox-kingdoms-003'),'the removed Uruk misclassification question must be tombstoned');
assert(!curatedById.has('ox-kingdoms-003'),'a retired misclassification question must not remain active');
const runtimeSource=fs.readFileSync('dist/ox-quiz-data.js','utf8');
for(const removed of ['const BANK=','EXPANSION_FACTS','relatedSources(','strictRelatedSources(','SEARCH_ROWS'])assert(!runtimeSource.includes(removed),`runtime auto-link/generation code remains: ${removed}`);
const builderSource=fs.readFileSync('scripts/build-ox-quiz-curation.cjs','utf8');
assert(builderSource.includes('DECISION_LEDGER_FILE')&&builderSource.includes('ledgerRetiredIds'),'the build must enforce the permanent retired-id decision ledger');

/* OX home starts with the compact weakness donut, then the seven era entries and
   finally wrong-answer review. Old daily/quick and duplicate summary cards stay gone. */
assert(html.includes('data-nav="association"'),'existing mnemonic tools must remain reachable');
click({nav:'ox'});
assert(html.includes('OX 퀴즈')&&html.includes('오늘의 20문제, 3분 여행'));
assert.equal(run('meta().oxQuiz.schemaVersion'),3);assert.equal(run('meta().oxQuiz.contentRevision'),report.contentRevision,'saved OX metadata must track the revised answer key');
for(const removed of ['오늘의 심화 핵심 개념','오늘의 OX 퀴즈','빠른 OX 퀴즈','QUICK START'])assert(!html.includes(removed),`removed menu remains: ${removed}`);
assert(html.includes('data-ox-start="daily"')&&!html.includes('data-ox-start="quick"'),'Rev.3 restores the daily journey without a duplicate quick control');
assert(html.includes('TODAY · 20 STOPS'),'Rev.3 daily journey heading missing');
assert.equal((html.match(/data-ox-era=/g)||[]).length,7,'home must render seven era cards');
for(const [eraId,count] of Object.entries(actualCounts)){
 assert(html.includes(`data-ox-era="${eraId}"`),`${eraId} card missing`);
 assert(html.includes(`${count}`),`${eraId} actual question count missing from home`);
}
assert(!html.includes('data-ox-home-analysis'),'OX weakness summary must not render');
assert.equal((html.match(/class="ox-weakness-donut/g)||[]).length,0,'no-history OX main must show an empty state instead of a meaningless donut');
assert(!html.includes('data-ox-analysis='),'OX analysis entry must not render');
assert(!html.includes('data-ox-analysis="true"'),'analysis detail control is removed');
assert(!html.includes('class="ox-learning-summary"')&&!html.includes('나의 OX 학습'),'the old duplicate learning summary card must be removed');
assert(!html.includes('시대별 취약점 분석'),'OX analysis description is removed');
const eraPosition=html.indexOf('data-ox-era='),reviewPosition=html.indexOf('틀린 OX ');
assert(eraPosition>=0&&reviewPosition<eraPosition,'Rev.3 wrong review precedes era stations');
assert((html.match(/아직 출발 전/g)||[]).length>=7,'unattempted eras must say 아직 학습 전');
assert(html.includes('data-ox-review'),'wrong-answer review entry is required');

/* Learning history with no historical wrong question has a different state from
   never having learned. The compact analysis remains visible in both cases. */
const emptyHomeSnapshot=run('JSON.stringify(meta().oxQuiz)'),allCorrectQuestion=questions[0];
run(`(()=>{const q=OX_QUESTIONS.find(item=>item.id===${JSON.stringify(allCorrectQuestion.id)}),ox=meta().oxQuiz;ox.records={[q.id]:{attempts:2,correctCount:2,wrongCount:0,lastCorrect:true,lastAnsweredAt:'2026-10-08T00:00:00.000Z'}};ox.history=[];ox.wrongIds=[];oxView='home';screen='ox';render();})()`);
assert(html.includes('복습할 문제가 없어요'),'empty wrong-review state remains available');
assert(!html.includes('아직 분석할 학습 기록이 없어요.'),'zero-wrong state must be distinct from no-history state');
run(`meta().oxQuiz=${emptyHomeSnapshot};oxView='home';screen='ox';render()`);

/* A small public API lets the tests verify behavior instead of private rendering details. */
assert.equal(run('typeof globalThis.OX_QUIZ_API'),'object','OX_QUIZ_API must be exposed');
for(const method of ['stats','eraStats','weaknessRows','wrongDistribution','choose','startSession','snapshot'])assert.equal(run(`typeof OX_QUIZ_API.${method}`),'function',`OX_QUIZ_API.${method} missing`);
const sessionSize=Math.min(20,actualCounts.goryeo);
const chosen=copy(`OX_QUIZ_API.choose(20,{eraId:'goryeo',seed:'qa-first'})`);
assert.equal(chosen.length,sessionSize,'era selection must return min(20, available questions)');
assert.equal(new Set(chosen).size,sessionSize,'one session must not repeat a question');
assert(chosen.every(id=>questions.find(question=>question.id===id)?.eraId==='goryeo'),'era selection leaked another era');
for(const eraId of eraIds){
 const eraChosen=copy(`OX_QUIZ_API.choose(20,{eraId:${JSON.stringify(eraId)},seed:'dynamic-size-${eraId}'})`);
 assert.equal(eraChosen.length,Math.min(20,actualCounts[eraId]),`${eraId} must use every available item below the 20-question cap`);
 assert.equal(new Set(eraChosen).size,eraChosen.length,`${eraId} dynamic-size selection must not repeat ids`);
}

/* An era with fewer than 20 items must also finish and report its actual size. */
const shortEraId=eraIds.find(eraId=>actualCounts[eraId]<20),shortEraCount=actualCounts[shortEraId],shortSessionSnapshot=run('JSON.stringify(meta().oxQuiz)');
assert(shortEraId&&shortEraCount>0,'the fixture must contain an era below the 20-question cap');
assert.equal(run(`OX_QUIZ_API.startSession('era',${JSON.stringify(shortEraId)})`),true);
assert.equal(run('meta().oxQuiz.activeSession.questionIds.length'),shortEraCount,'short-era session must include every available question exactly once');
while(run('meta().oxQuiz.activeSession')){answerCurrent(true);click({oxNext:'true'})}
assert.equal(run('meta().oxQuiz.lastSession.summary.total'),shortEraCount,'short-era result must keep the actual session size');
assert(html.includes(`${shortEraCount} STOPS`),'short-era result must display the actual question total');
run(`meta().oxQuiz=${shortSessionSnapshot};oxView='home';screen='ox';render()`);

/* A real era session stores canonical attempt events and preserves non-OX app records. */
const protectedBefore=run('JSON.stringify({run:state.run,mainRun:state.mainRun,officialResults:meta().officialExamResults||[],questionRecords:meta().questionRecords,wrongQuestionIds:meta().wrongQuestionIds,wrongAnswers:meta().wrongAnswers})');
click({oxEra:'goryeo'});
let session=copy('meta().oxQuiz.activeSession');
assert.equal(session.mode,'era');assert.equal(session.eraId,'goryeo');assert.equal(session.questionIds.length,sessionSize);
assert.equal(new Set(session.questionIds).size,sessionSize);assert(session.questionIds.every(id=>questions.find(question=>question.id===id)?.eraId==='goryeo'));
assert.deepEqual(session.questionFingerprints,Object.fromEntries(session.questionIds.map(id=>[id,questions.find(question=>question.id===id).contentFingerprint])),'session must snapshot current source fingerprints');
const firstSessionIds=[...session.questionIds],firstQuestion=questions.find(question=>question.id===session.questionIds[0]);
assert(html.includes('STOP 01'),'the answer-bearing topic label must stay hidden before answering');
assert(!html.includes(`<small>${firstQuestion.tags.join(' · ')}</small>`),'the correct topic must not leak before an O/X choice');
assert(!html.includes('class="ox-feedback')&&!html.includes('data-ox-next="true"'),'answer, explanation, and next action must stay hidden before an O/X choice');
answerCurrent(false);
assert(html.includes(firstQuestion.explanation),'the source explanation must be revealed after answering');
assert(!html.includes('연계 심화 기출'),'unreviewed source-round claims must not be rendered in OX feedback');
let event=copy('meta().oxQuiz.history.at(-1)');
const canonical=['answeredAt','attemptNumber','contentFingerprint','correctAnswer','eraId','isCorrect','questionId','selectedAnswer','sessionId','topicId'];
assert.deepEqual(canonical.filter(key=>Object.hasOwn(event,key)).sort(),canonical,`attempt event is missing canonical fields: ${JSON.stringify(event)}`);
assert.equal(event.questionId,firstQuestion.id);assert.equal(event.eraId,'goryeo');assert.equal(event.topicId,firstQuestion.topicId);assert.equal(event.contentFingerprint,firstQuestion.contentFingerprint);
assert.equal(event.selectedAnswer,!firstQuestion.answer);assert.equal(event.correctAnswer,firstQuestion.answer);assert.equal(event.isCorrect,false);assert.equal(event.attemptNumber,1);
assert(!Number.isNaN(Date.parse(event.answeredAt))&&event.sessionId===session.id,'attempt timestamp/session id invalid');
click({oxNext:'true'});
for(let index=1;index<sessionSize;index++){answerCurrent(true);click({oxNext:'true'})}
assert.equal(run('meta().oxQuiz.activeSession'),null);assert(html.includes('OX 결과'));
assert(html.includes(`${sessionSize} STOPS`),'result total missing');
assert(html.includes(`<h1>${sessionSize-1}</h1>`)&&html.includes('길을 잃은 1곳'),'result correct/wrong counts missing');
assert(html.includes('소요'),'result duration missing');
assert(!html.includes('ox-result-analysis'),'Rev.3 replaces redundant analysis with individual wrong-question review');
assert(html.includes(firstQuestion.statement)&&(html.match(/class="r3-ox-wrong"/g)||[]).length===1,'era result must display the actual wrong question');

/* The next same-era session prefers unseen questions; learned progress counts unique ids. */
click({oxHome:'true'});click({oxEra:'goryeo'});
session=copy('meta().oxQuiz.activeSession');
assert.equal(session.questionIds.length,sessionSize);assert.equal(new Set(session.questionIds).size,sessionSize);
assert.equal(session.questionIds.filter(id=>firstSessionIds.includes(id)).length,Math.max(0,sessionSize*2-actualCounts.goryeo),'next era session must minimize reuse when fewer than 40 questions exist');
let stats=copy('OX_QUIZ_API.stats()'),eraStats=copy('OX_QUIZ_API.eraStats()');
let goryeo=Array.isArray(eraStats)?eraStats.find(row=>row.eraId==='goryeo'):eraStats.goryeo;
assert.equal(stats.attempts,sessionSize);assert.equal(stats.wrong,1);assert.equal(goryeo.learned,sessionSize,'learned progress must count unique questions, not attempts');
assert.equal(goryeo.total,actualCounts.goryeo);assert.equal(goryeo.attempts,sessionSize);assert.equal(goryeo.wrong,1);
click({oxBack:'home'});

/* Once every item is seen, the immediate prior session is still avoided and order is seed-shuffled. */
const selectionSnapshot=run('JSON.stringify(meta().oxQuiz)');
run(`(()=>{const ox=meta().oxQuiz;ox.records={};for(const q of OX_QUESTIONS.filter(item=>item.eraId==='goryeo'))ox.records[q.id]={attempts:1,correctCount:1,wrongCount:0,lastCorrect:true,lastAnsweredAt:'2026-01-01T00:00:00.000Z'};ox.recentQuestionIds=${JSON.stringify(firstSessionIds)};})()`);
const allSeenA=copy(`OX_QUIZ_API.choose(20,{eraId:'goryeo',seed:'all-seen-a'})`),allSeenB=copy(`OX_QUIZ_API.choose(20,{eraId:'goryeo',seed:'all-seen-b'})`);
assert.equal(allSeenA.filter(id=>firstSessionIds.includes(id)).length,Math.max(0,sessionSize*2-actualCounts.goryeo),'all-seen selection must minimize reuse of the immediately prior session');
assert.equal(new Set(allSeenA).size,sessionSize);if(sessionSize>1)assert.notDeepEqual(allSeenA,allSeenB,'different seeds should shuffle equal-priority questions');
run(`meta().oxQuiz=${selectionSnapshot}`);

/* Review is filterable; a correct retry clears current need but keeps the original error event. */
click({oxEra:'empire'});const otherWrong=questions.find(question=>question.id===run('meta().oxQuiz.activeSession.questionIds[0]'));
answerCurrent(false);click({oxBack:'home'});
click({nav:'study'});click({wrongFilter:'ox'});
assert(html.includes('틀린 OX 다시 풀기')&&html.includes('data-ox-review-filter'));
change({oxReviewFilter:'true'},'goryeo');
assert(html.includes(firstQuestion.statement),'selected-era wrong question must remain visible');
assert(!html.includes(otherWrong.statement),'selected-era filter must hide other-era wrong questions');
click({oxReviewEra:'goryeo'});
assert.equal(run('meta().oxQuiz.activeSession.mode'),'review');
assert(run(`meta().oxQuiz.activeSession.questionIds.includes(${JSON.stringify(firstQuestion.id)})`));
while(run('meta().oxQuiz.activeSession')){answerCurrent(true);click({oxNext:'true'})}
const attemptsForFirst=copy(`meta().oxQuiz.history.filter(item=>item.questionId===${JSON.stringify(firstQuestion.id)})`);
assert.equal(attemptsForFirst.length,2,'review must append rather than replace attempt history');
assert.equal(attemptsForFirst[0].isCorrect,false);assert.equal(attemptsForFirst[1].isCorrect,true);assert.equal(attemptsForFirst[1].attemptNumber,2);
assert(!run(`meta().oxQuiz.wrongIds.includes(${JSON.stringify(firstQuestion.id)})`),'correct review must mark current review complete');
assert(run(`meta().oxQuiz.wrongIds.includes(${JSON.stringify(otherWrong.id)})`),'reviewing one era must not clear another era wrong state');
assert(run(`meta().oxQuiz.history.some(item=>item.questionId===${JSON.stringify(firstQuestion.id)}&&item.isCorrect===false)`),'historical wrong attempt must be preserved');
const postReviewStats=copy('OX_QUIZ_API.stats()');
assert.equal(postReviewStats.wrong,2,'cumulative wrong attempts must remain in statistics');
assert.equal(postReviewStats.currentWrong,1);assert.equal(postReviewStats.reviewNeeded,1,'latest state must separately track current review need');
assert.equal(postReviewStats.completedReview,1,'corrected past wrong questions must be counted separately');
click({nav:'study'});click({wrongFilter:'ox'});change({oxReviewFilter:'true'},'goryeo');
assert(html.includes('ox-review-group')&&html.includes('ox-completed-review'),'current and completed review groups must be separate');
assert(html.includes('복습 완료한 과거 오답')&&html.includes(firstQuestion.statement)&&html.includes('복습 완료'),'completed review must stay visible without returning to the active wrong list');
assert.deepEqual(copy(`OX_QUIZ_API.choose(20,{eraId:'goryeo',onlyWrong:true})`),[],'completed reviews must not be re-issued as current wrong questions');
assert(copy(`OX_QUIZ_API.choose(20,{eraId:'empire',onlyWrong:true})`).includes(otherWrong.id),'unresolved wrong questions must remain available for review');

/* A mixed-era review result analyzes wrong answers by era rather than by topic. */
click({nav:'ox'});click({oxEra:'joseon'});const joseonWrong=questions.find(question=>question.id===run('meta().oxQuiz.activeSession.questionIds[0]'));
answerCurrent(false);click({oxBack:'home'});click({nav:'study'});click({wrongFilter:'ox'});change({oxReviewFilter:'true'},'all');click({oxReviewEra:'all'});
session=copy('meta().oxQuiz.activeSession');assert.deepEqual(new Set(session.questionIds),new Set([otherWrong.id,joseonWrong.id]),'all-era review must contain only current wrong questions');
while(run('meta().oxQuiz.activeSession')){answerCurrent(false);click({oxNext:'true'})}
assert((html.match(/class="r3-ox-wrong"/g)||[]).length===2,'mixed review result must retain both wrong-question disclosures');
assert(html.includes(otherWrong.statement)&&html.includes(joseonWrong.statement),'mixed review result must retain each wrong source statement');

/* Old events without topicId are safe; weakness ranking requires at least ten attempts. */
if(actualCounts.prehistoric>=9&&actualCounts.goryeo>=10&&actualCounts.joseon>=12){
run(`(()=>{
 const ox=meta().oxQuiz,make=(question,index,correct)=>({questionId:question.id,eraId:question.eraId,selectedAnswer:correct?question.answer:!question.answer,correctAnswer:question.answer,isCorrect:correct,answeredAt:new Date(Date.now()+index*1000).toISOString(),sessionId:'qa-seed',attemptNumber:1,answer:correct?question.answer:!question.answer,correct,mode:'era'});
 const p=OX_QUESTIONS.filter(q=>q.eraId==='prehistoric').slice(0,9),g=OX_QUESTIONS.filter(q=>q.eraId==='goryeo').slice(0,10),j=OX_QUESTIONS.filter(q=>q.eraId==='joseon').slice(0,12);
 ox.history=[...p.map((q,i)=>make(q,i,false)),...g.map((q,i)=>({...make(q,20+i,i<5),topicId:q.topicId})),...j.map((q,i)=>({...make(q,40+i,i<9),topicId:q.topicId}))];
 ox.records={};ox.wrongIds=[];save();
})()`);
assert.doesNotThrow(()=>copy('OX_QUIZ_API.stats()'),'legacy history without topicId must not crash stats');
eraStats=copy('OX_QUIZ_API.eraStats()');
const row=id=>(Array.isArray(eraStats)?eraStats.find(item=>item.eraId===id):eraStats[id]);
assert.equal(row('prehistoric').attempts,9);assert.equal(row('prehistoric').eligible,false);assert.equal(row('prehistoric').dataStatus,'insufficient');
assert.equal(row('goryeo').attempts,10);assert.equal(row('goryeo').wrong,5);assert.equal(row('goryeo').accuracy,50);
assert.equal(row('joseon').attempts,12);assert.equal(row('joseon').wrong,3);assert.equal(row('joseon').accuracy,75);
const weakness=copy(`OX_QUIZ_API.weaknessRows('weakest')`);
const ranked=weakness.filter(item=>item.eligible);
assert.equal(ranked[0].eraId,'goryeo','eligible weakest era must be ranked first');
assert.equal(weakness.find(item=>item.eraId==='prehistoric')?.eligible,false,'fewer than ten attempts must be marked 데이터 부족');
assert(copy(`OX_QUIZ_API.topicStats('goryeo')`).length,'topic stats must expose concept weakness data');
assert(row('goryeo').topics.length,'era rows must include their top concept statistics');
const distribution=copy('OX_QUIZ_API.wrongDistribution()'),distributionRow=id=>distribution.rows.find(item=>item.eraId===id);
assert.equal(distribution.total,17,'donut denominator must count distinct historically wrong questions across all seven eras');
assert.equal(distribution.rows.length,7);assert.equal(distributionRow('prehistoric').wrong,9);assert.equal(distributionRow('goryeo').wrong,5);assert.equal(distributionRow('joseon').wrong,3);
assert.equal(distributionRow('prehistoric').percentage,'52.9');assert.equal(distributionRow('goryeo').percentage,'29.4');assert.equal(distributionRow('joseon').percentage,'17.6');
assert.equal(distribution.leader.eraId,'prehistoric','the largest unique-wrong share must drive the compact summary highlight');

click({nav:'ox'});
assert(!html.includes('data-ox-home-analysis'),'OX weakness summary must not render');
assert(!html.includes('ox-weakness-donut'),'OX charts must not render even when history exists');
click({oxAnalysis:'true'});assert.equal(run('OX_QUIZ_API.snapshot().view'),'home','stale analysis controls return to the quiz home');

/* The detail selector follows the historical unique-wrong basis used by the chart.
   A corrected past error must remain available here without returning to the
   existing current-wrong queue. */
const focusSnapshot=run('JSON.stringify(meta().oxQuiz)');
const completedHistoricalId=run("meta().oxQuiz.history.find(item=>item.eraId==='joseon'&&item.isCorrect===false).questionId");
const unresolvedHistoricalId=run(`meta().oxQuiz.history.find(item=>item.eraId==='joseon'&&item.isCorrect===false&&item.questionId!==${JSON.stringify(completedHistoricalId)}).questionId`);
run(`(()=>{const completedId=${JSON.stringify(completedHistoricalId)},unresolvedId=${JSON.stringify(unresolvedHistoricalId)},completed=OX_QUESTIONS.find(item=>item.id===completedId),unresolved=OX_QUESTIONS.find(item=>item.id===unresolvedId),ox=meta().oxQuiz;ox.records[completedId]={attempts:2,correctCount:1,wrongCount:1,lastCorrect:true,lastAnswer:completed.answer,lastAnsweredAt:'2026-10-08T00:00:00.000Z'};ox.records[unresolvedId]={attempts:1,correctCount:0,wrongCount:1,lastCorrect:false,lastAnswer:!unresolved.answer,lastAnsweredAt:'2026-10-08T00:01:00.000Z'};ox.wrongIds=[unresolvedId];render();})()`);
change({oxAnalysisReviewEra:'true'},'joseon');
assert(html.includes('data-ox-home-review-era'),'the main wrong-review selector remains available');
click({oxAnalysisReviewStart:'joseon'});
assert.equal(run('meta().oxQuiz.activeSession.mode'),'review');
assert.equal(run('meta().oxQuiz.activeSession.eraId'),'joseon');
assert(run("meta().oxQuiz.activeSession.questionIds.every(id=>OX_QUESTIONS.find(question=>question.id===id)?.eraId==='joseon')"),'focused review must contain only historically wrong questions from the selected era');
assert(run(`meta().oxQuiz.activeSession.questionIds.includes(${JSON.stringify(completedHistoricalId)})`),'focused review must include a corrected past error represented by the historical donut');

/* Leaving analysis must not leak its historical-review behavior into the existing
   wrong notebook, whose queue is deliberately limited to current wrong answers. */
run("meta().oxQuiz.activeSession=null;oxView='analysis';screen='ox';render()");
click({nav:'study'});click({wrongFilter:'ox'});change({oxReviewFilter:'true'},'joseon');click({oxReviewEra:'joseon'});
assert.deepEqual(copy('meta().oxQuiz.activeSession.questionIds'),[unresolvedHistoricalId],'analysis state must not broaden the current-wrong notebook queue');
assert(!run(`meta().oxQuiz.activeSession.questionIds.includes(${JSON.stringify(completedHistoricalId)})`),'the current-wrong notebook must exclude corrected historical errors');
run(`meta().oxQuiz=${focusSnapshot};oxAnalysisReviewEra=null;oxHomeReviewEra='all';oxView='analysis';screen='ox';render()`);
}

/* Repeating one question cannot satisfy the ten-unique-question ranking threshold. */
const analyticsSnapshot=run('JSON.stringify(meta().oxQuiz)'),repeatQuestion=questions.find(question=>question.eraId==='prehistoric');
run(`(()=>{const q=OX_QUESTIONS.find(item=>item.id===${JSON.stringify(repeatQuestion.id)}),ox=meta().oxQuiz;ox.records={};ox.wrongIds=[q.id];ox.history=Array.from({length:10},(_,index)=>({questionId:q.id,eraId:q.eraId,selectedAnswer:!q.answer,correctAnswer:q.answer,isCorrect:false,answeredAt:new Date(Date.now()+index).toISOString(),sessionId:'repeat-one',attemptNumber:index+1,answer:!q.answer,correct:false,mode:'era'}));})()`);
let repeatedEra=copy('OX_QUIZ_API.eraStats()').find(item=>item.eraId==='prehistoric');
assert.equal(repeatedEra.attempts,10);assert.equal(repeatedEra.learned,1);assert.equal(repeatedEra.eligible,false,'ten repeats of one item must remain 데이터 부족');
const repeatedDistribution=copy('OX_QUIZ_API.wrongDistribution()');
assert.equal(repeatedDistribution.total,1,'repeated wrong attempts for one question must count once in the donut');
assert.equal(repeatedDistribution.rows.find(item=>item.eraId==='prehistoric').wrong,1);
assert.equal(repeatedDistribution.rows.find(item=>item.eraId==='prehistoric').percentage,'100');

/* Multiple questions with the same explicit topic id aggregate into one weakness row. */
const conceptGroups=new Map();for(const question of questions){const key=`${question.eraId}:${question.topicId}`,rows=conceptGroups.get(key)||[];rows.push(question);conceptGroups.set(key,rows);}
const sharedConcept=[...conceptGroups.values()].find(rows=>rows.length>=2);
if(sharedConcept){
 const conceptPair=sharedConcept.slice(0,2),conceptEra=conceptPair[0].eraId;
 run(`(()=>{const ids=${JSON.stringify(conceptPair.map(question=>question.id))},ox=meta().oxQuiz;ox.records={};ox.wrongIds=[...ids];ox.history=ids.map((id,index)=>{const q=OX_QUESTIONS.find(item=>item.id===id);return {questionId:id,eraId:q.eraId,topicId:q.topicId,selectedAnswer:!q.answer,correctAnswer:q.answer,isCorrect:false,answeredAt:new Date(Date.now()+index).toISOString(),sessionId:'grouped-topic',attemptNumber:1,answer:!q.answer,correct:false,mode:'era'};});})()`);
 const groupedTopics=copy(`OX_QUIZ_API.topicStats(${JSON.stringify(conceptEra)})`),grouped=groupedTopics.find(item=>item.topicId===conceptPair[0].topicId&&item.learned===2&&item.wrong===2);
 assert(grouped,'two questions sharing an explicit topic id must collapse into one topic weakness row');
}
run(`meta().oxQuiz=${analyticsSnapshot}`);

/* Donut safely distinguishes no history from zero wrongs and deduplicates repeated
   wrong attempts while retaining their cumulative attempt record. */
const donutSnapshot=run('JSON.stringify(meta().oxQuiz)'),singleWrong=questions.find(question=>question.eraId==='occupation');
run(`(()=>{const ox=meta().oxQuiz;ox.records={};ox.history=[];ox.wrongIds=[];render();})()`);
let emptyDistribution=copy('OX_QUIZ_API.wrongDistribution()');assert.equal(emptyDistribution.total,0);assert(emptyDistribution.rows.every(item=>item.percentage==='0'));
assert(!html.includes('시대별 취약점 분석'),'OX analysis description is removed');
run(`(()=>{const q=OX_QUESTIONS.find(item=>item.id===${JSON.stringify(allCorrectQuestion.id)}),ox=meta().oxQuiz;ox.records={[q.id]:{attempts:2,correctCount:2,wrongCount:0,lastCorrect:true,lastAnsweredAt:'2026-10-08T00:00:00.000Z'}};ox.history=[];ox.wrongIds=[];render();})()`);
emptyDistribution=copy('OX_QUIZ_API.wrongDistribution()');assert.equal(emptyDistribution.total,0);
assert(html.includes('복습할 문제가 없어요'),'empty wrong-review state remains available');
run(`(()=>{const q=OX_QUESTIONS.find(item=>item.id===${JSON.stringify(singleWrong.id)}),ox=meta().oxQuiz;ox.records={[q.id]:{attempts:2,correctCount:1,wrongCount:1,lastCorrect:true,lastAnsweredAt:'2026-10-08T00:00:00.000Z'}};ox.history=[];ox.wrongIds=[];oxView='home';screen='ox';render();})()`);
assert(!html.includes('누적 고유 오답'),'removed analysis metrics must not reappear');
assert(html.includes('복습할 문제가 없어요')&&!html.includes('ox-weakness-donut'),'completed history remains out of the current-wrong queue');
run(`(()=>{const q=OX_QUESTIONS.find(item=>item.id===${JSON.stringify(singleWrong.id)}),ox=meta().oxQuiz;ox.records={[q.id]:{attempts:2,correctCount:0,wrongCount:2,lastCorrect:false,lastAnsweredAt:'2026-10-08T00:00:00.000Z'}};ox.history=[];ox.wrongIds=[q.id];oxView='analysis';render();})()`);
const singleDistribution=copy('OX_QUIZ_API.wrongDistribution()');assert.equal(copy('OX_QUIZ_API.stats()').wrong,2,'cumulative statistics must retain both wrong attempts');
assert.equal(singleDistribution.total,1,'the donut must count the repeatedly missed question only once');
assert.equal(singleDistribution.rows.find(item=>item.eraId==='occupation').percentage,'100');
assert.equal(copy('OX_QUIZ_API.wrongDistribution()').rows.find(row=>row.eraId==='occupation').percentage,'100','historical distribution data is preserved');
run(`meta().oxQuiz=${donutSnapshot}`);

/* OX work remains isolated from Story, official exams, and their wrong-note records. */
assert.equal(run('JSON.stringify({run:state.run,mainRun:state.mainRun,officialResults:meta().officialExamResults||[],questionRecords:meta().questionRecords,wrongQuestionIds:meta().wrongQuestionIds,wrongAnswers:meta().wrongAnswers})'),protectedBefore,'OX must not alter Story or official exam records');
click({nav:'records'});assert(html.includes('OX 퀴즈 학습 통계')&&html.includes('시대별 기출 기록'));
assert.equal(run('globalThis.OX_QUIZ_UI_READY'),true);

/* Sessions survive retired questions: invalid ids are removed and the cursor,
   answers, results, fingerprints, and completed summary are repaired in place. */
const survivingIds=questions.slice(0,2).map(question=>question.id),deletedId='ox-goryeo-999999';
assert.equal(survivingIds.length,2,'session migration regression needs two active questions');
const savedSessionFingerprint=questions.find(question=>question.id===survivingIds[0]).contentFingerprint;
run(`(()=>{const ids=${JSON.stringify(survivingIds)},deleted=${JSON.stringify(deletedId)},ox=meta().oxQuiz,now='2026-10-08T01:00:00.000Z';ox.activeSession={id:'active-with-retired',mode:'era',eraId:null,questionIds:[ids[0],deleted,ids[1]],questionFingerprints:{[ids[0]]:${JSON.stringify(savedSessionFingerprint)},[deleted]:'retired-fingerprint'},index:1,answers:{[ids[0]]:true,[deleted]:false},results:{[ids[0]]:true,[deleted]:false},startedAt:now,completedAt:null,status:'active'};ox.lastSession={id:'completed-with-retired',mode:'era',eraId:null,questionIds:[deleted,ids[0],ids[1]],index:2,answers:{[deleted]:true,[ids[0]]:true,[ids[1]]:false},results:{[deleted]:true,[ids[0]]:true,[ids[1]]:false},startedAt:now,completedAt:'2026-10-08T01:01:00.000Z',status:'completed',summary:{total:3,correct:2,wrong:1,accuracy:67,durationMs:60000}};save();})()`);
const staleSessionStorage=saved;
boot();
const shrunkActive=copy('meta().oxQuiz.activeSession'),shrunkLast=copy('meta().oxQuiz.lastSession');
assert.deepEqual(shrunkActive.questionIds,survivingIds,'active session must retain only still-existing ids');
assert.equal(shrunkActive.index,1,'removed current question must advance to the next surviving position');
assert(!Object.hasOwn(shrunkActive.answers,deletedId)&&!Object.hasOwn(shrunkActive.results,deletedId),'active session must drop retired-id answer state');
assert.deepEqual(Object.keys(shrunkActive.questionFingerprints).sort(),[...survivingIds].sort(),'active session fingerprints must match surviving ids');
assert.equal(shrunkActive.questionFingerprints[survivingIds[0]],savedSessionFingerprint,'session repair must preserve an existing fingerprint snapshot');
assert.deepEqual(shrunkLast.questionIds,survivingIds,'last session must retain only still-existing ids');
assert.equal(shrunkLast.index,1);assert(!Object.hasOwn(shrunkLast.answers,deletedId)&&!Object.hasOwn(shrunkLast.results,deletedId));
assert.deepEqual(shrunkLast.summary,{total:2,correct:1,wrong:1,accuracy:50,durationMs:60000},'completed summary must be recalculated after removing retired ids');
assert.notEqual(saved,staleSessionStorage,'session repair must update persisted storage during boot');
const persistedRepair=JSON.parse(saved).meta.oxQuiz;
assert(!persistedRepair.activeSession.questionIds.includes(deletedId)&&!persistedRepair.lastSession.questionIds.includes(deletedId),'persisted sessions must omit retired ids');
const repairedStorage=saved;boot();
assert.equal(saved,repairedStorage,'retired-id session repair must be persisted and stable across reloads');
assert.deepEqual(copy('meta().oxQuiz.activeSession.questionIds'),survivingIds,'persisted active session repair must survive another boot');

/* A reused id with a different content fingerprint must never inherit attempts,
   wrong-note state, or an answered session from the old question meaning. The
   old payload remains archived instead of being silently deleted. */
const changedMeaningQuestion=questions[0],unchangedSessionQuestion=questions[1],staleFingerprint=`sha256:${'2'.repeat(64)}`;
run(`(()=>{const q=${JSON.stringify(changedMeaningQuestion.id)},next=${JSON.stringify(unchangedSessionQuestion.id)},ox=meta().oxQuiz,now='2026-10-08T01:01:30.000Z';meta().oxQuiz={schemaVersion:3,contentRevision:'old-content-revision',records:{[q]:{attempts:1,correctCount:0,wrongCount:1,lastCorrect:false,lastAnsweredAt:now,contentFingerprint:${JSON.stringify(staleFingerprint)}}},wrongIds:[q],history:[{questionId:q,selectedAnswer:false,correctAnswer:true,isCorrect:false,answeredAt:now,sessionId:'changed-meaning',attemptNumber:1,contentFingerprint:${JSON.stringify(staleFingerprint)}}],recentQuestionIds:[q],completedSessions:[],activeSession:{id:'changed-meaning',mode:'era',eraId:null,questionIds:[q,next],index:0,answers:{[q]:false},results:{[q]:false},startedAt:now,completedAt:null,status:'active'},lastSession:null};save();})()`);
boot();
assert(!run(`Object.hasOwn(meta().oxQuiz.records,${JSON.stringify(changedMeaningQuestion.id)})`),'a stale-fingerprint record must not count for the current question');
assert(!run(`meta().oxQuiz.history.some(item=>item.questionId===${JSON.stringify(changedMeaningQuestion.id)})`),'stale-fingerprint history must not count for the current question');
assert(!run(`meta().oxQuiz.wrongIds.includes(${JSON.stringify(changedMeaningQuestion.id)})`),'a stale-fingerprint question must leave the active wrong-note queue');
assert(!run(`meta().oxQuiz.recentQuestionIds.includes(${JSON.stringify(changedMeaningQuestion.id)})`),'a stale-fingerprint question must not inherit recent-selection penalties');
assert.deepEqual(copy('meta().oxQuiz.activeSession.questionIds'),[unchangedSessionQuestion.id],'a stale-fingerprint answered question must be removed from the resumable session');
const archivedContent=copy('meta().oxQuiz.archivedContent');
assert(archivedContent.records.some(item=>item.questionId===changedMeaningQuestion.id&&item.contentFingerprint===staleFingerprint),'the stale record must be preserved in the content archive');
assert(archivedContent.history.some(item=>item.questionId===changedMeaningQuestion.id&&item.contentFingerprint===staleFingerprint),'the stale attempt must be preserved in the content archive');
assert(archivedContent.sessions.some(item=>item.kind==='activeSession'&&item.session.id==='changed-meaning'),'the stale session snapshot must be preserved in the content archive');

/* A history-only stale fingerprint must also clear recent-selection state. */
run(`(()=>{const q=${JSON.stringify(changedMeaningQuestion.id)},now='2026-10-08T01:01:45.000Z',current=OX_QUESTIONS.find(item=>item.id===q).contentFingerprint;meta().oxQuiz={schemaVersion:3,contentRevision:'old-content-revision',records:{[q]:{attempts:7,correctCount:6,wrongCount:1,lastCorrect:true,lastAnsweredAt:now,contentFingerprint:current}},wrongIds:[q],history:[{questionId:q,selectedAnswer:false,correctAnswer:true,isCorrect:false,answeredAt:now,sessionId:'history-only-stale',attemptNumber:1,contentFingerprint:${JSON.stringify(staleFingerprint)}}],recentQuestionIds:[q],completedSessions:[],activeSession:null,lastSession:null};save();})()`);
boot();
assert(!run(`Object.hasOwn(meta().oxQuiz.records,${JSON.stringify(changedMeaningQuestion.id)})`),'a stale history id must not retain a possibly aggregated current record');
assert(!run(`meta().oxQuiz.recentQuestionIds.includes(${JSON.stringify(changedMeaningQuestion.id)})`),'history-only stale content must not keep recent-selection penalties');
assert(!run(`meta().oxQuiz.wrongIds.includes(${JSON.stringify(changedMeaningQuestion.id)})`),'history-only stale content must not remain in the active wrong-note queue');
assert(run(`meta().oxQuiz.archivedContent.history.some(item=>item.questionId===${JSON.stringify(changedMeaningQuestion.id)}&&item.contentFingerprint===${JSON.stringify(staleFingerprint)})`),'history-only stale content must be archived');

/* Hybrid legacy records merge the latest event state without losing cumulative counts. */
const migrationQuestion=questions[0];
run(`(()=>{const q=OX_QUESTIONS.find(item=>item.id===${JSON.stringify(migrationQuestion.id)}),now='2026-10-08T01:02:03.000Z';meta().oxQuiz={schemaVersion:3,contentRevision:'2026-10-natural-fact-v1',records:{[q.id]:{attempts:3,correctCount:1,wrongCount:2}},wrongIds:[q.id],history:[{questionId:q.id,answer:q.answer,correct:true,answeredAt:now,sessionId:'legacy-hybrid',mode:'era'}],recentQuestionIds:[],completedSessions:[],activeSession:null,lastSession:null};save();})()`);
const legacyStorage=saved;
boot();
const migratedRecord=copy(`meta().oxQuiz.records[${JSON.stringify(migrationQuestion.id)}]`),migratedEvent=copy('meta().oxQuiz.history[0]');
assert.equal(migratedRecord.attempts,3);assert.equal(migratedRecord.correctCount,1);assert.equal(migratedRecord.wrongCount,2,'migration must preserve cumulative counts');
assert.equal(migratedRecord.lastCorrect,true);assert(!run(`meta().oxQuiz.wrongIds.includes(${JSON.stringify(migrationQuestion.id)})`),'latest correct legacy event must mark review complete');
assert(migratedEvent.topicId&&migratedEvent.eraId&&typeof migratedEvent.selectedAnswer==='boolean','legacy event must gain canonical fields');
assert.equal(migratedRecord.contentFingerprint,migrationQuestion.contentFingerprint);assert.equal(migratedEvent.contentFingerprint,migrationQuestion.contentFingerprint,'legacy state must be annotated with the current source fingerprint without resetting attempts');
assert.equal(run('meta().oxQuiz.contentRevision'),report.contentRevision,'reviewed content revision must replace the old revision without deleting attempts');
assert.notEqual(saved,legacyStorage,'legacy fingerprint and revision backfill must be persisted during boot');

/* Reload keeps canonical event history and OX state after migration. */
run('save()');const savedSnapshot=saved,historySnapshot=run('JSON.stringify(meta().oxQuiz.history)');boot();
assert.equal(saved,savedSnapshot);assert.equal(run('JSON.stringify(meta().oxQuiz.history)'),historySnapshot);

console.log(`PASS: ${questions.length} audited OX questions across seven eras, dynamic up-to-20 sessions, retired-id session repair, canonical attempts, isolation, and reload persistence.`);


