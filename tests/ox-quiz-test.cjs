const fs=require('fs'),vm=require('vm'),assert=require('assert');

const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)]
 .map(match=>match[1]).filter(name=>name!=='pwa.js');
let saved=null,html='',handlers={},context;

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
  localStorage:{getItem:()=>saved,setItem:(key,value)=>{saved=value}},
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

/* Count the actual exported bank. Report constants alone cannot satisfy this test. */
const targetCounts={prehistoric:100,kingdoms:120,goryeo:120,joseon:150,empire:100,occupation:120,republic:100};
const questions=copy('globalThis.OX_QUESTIONS');
const eras=copy('globalThis.OX_ERAS');
const report=copy('globalThis.OX_ANALYSIS_REPORT');
const actualCounts=Object.fromEntries(Object.keys(targetCounts).map(eraId=>[eraId,questions.filter(question=>question.eraId===eraId).length]));
assert.equal(eras.length,7,'seven OX eras must be exported');
assert(questions.length>=810,`OX bank must contain at least 810 questions (actual ${questions.length})`);
assert.equal(report.roundCount,23);assert.equal(report.questionCount,1150,'all advanced official questions must remain the analysis basis');
for(const [eraId,target] of Object.entries(targetCounts)){
 assert(actualCounts[eraId]>=target,`${eraId} must contain at least ${target} questions (actual ${actualCounts[eraId]})`);
 assert.equal(report.eraCounts[eraId],actualCounts[eraId],`${eraId} report count must match the actual bank`);
 const eraAnswers=questions.filter(question=>question.eraId===eraId),oCount=eraAnswers.filter(question=>question.answer).length;
 assert(oCount/eraAnswers.length>=.35&&oCount/eraAnswers.length<=.65,`${eraId}: O/X answers are too imbalanced`);
}
assert.equal(report.generatedQuestionCount,questions.length,'analysis report total must match actual OX data');
assert.equal(report.linkedQuestionCount,questions.filter(question=>question.sourceQuestionIds.length).length,'linked count must come from the exported bank');
assert.equal(Object.values(report.baselineEraCounts).reduce((sum,count)=>sum+count,0),210,'baseline inventory must remain intact');
assert.equal(Object.values(report.addedEraCounts).reduce((sum,count)=>sum+count,0),600,'expansion inventory must report all additions');
assert.equal(report.editorialContextTokenMatchedCount,600);assert.equal(report.editorialContextTokenUnmatchedCount,0,'every expansion must have an editorial context-token audit trail');
assert.equal(report.rawDirectLinkedCount+report.explanationOnlyMatchCount+report.genericTokenFallbackCount,600,'source-link quality tiers must cover every expansion');
assert.equal(report.contextualFallbackCount,report.explanationOnlyMatchCount+report.genericTokenFallbackCount,'contextual fallback total must be explicit');
assert.equal(report.unlinkedEditorialCount,report.contextualFallbackCount,'non-direct concepts must not expose unrelated official question ids');
assert.deepEqual(report.expansionAnswerBalance,{o:300,x:300});assert.deepEqual(report.templateParity,{o:300,x:300});
for(const key of ['statementDuplicateCount','topicIdDuplicateCount','verifiedFactDuplicateCount','knowledgeFactDuplicateCount','baselineExpansionDuplicateCount','baselineExpansionNearDuplicateCount','expansionNearDuplicateCount','oppositePairDuplicateCount','wrongTagSameCount','wrongTagFactOverlapCount','wrongTagTokenCollisionCount'])assert.equal(report[key],0,`${key} must be zero`);
assert.equal(report.sentenceValidation.invalidEndingCount,0);assert.equal(report.sentenceValidation.forbiddenFragmentCount,0);assert.equal(report.sentenceValidation.tooShortCount,0);assert.equal(report.sentenceValidation.xExplanationSpecificCount,300);
assert.deepEqual(report.explanationValidation,{emptyCount:0,answerLabelMismatchCount:0});
assert.equal(new Set(questions.map(question=>question.id)).size,questions.length,'question ids must be unique');
assert.equal(new Set(questions.map(question=>question.statement.trim())).size,questions.length,'question statements must be unique');
assert.equal(new Set(questions.map(question=>question.topicId)).size,questions.length,'topic ids must be unique');
const sourceRecords=copy('globalThis.OFFICIAL_EXAM_SOURCE_RECORDS');
const advancedIds=new Set(sourceRecords.filter(record=>record.examLevel==='심화').map(record=>record.officialQuestionId));
for(const question of questions){
 assert(Object.hasOwn(targetCounts,question.eraId),`${question.id}: unknown era`);
 assert(question.topicId&&question.statement.length>10&&question.explanation.length>15,`${question.id}: incomplete learning content`);
 assert.equal(typeof question.answer,'boolean',`${question.id}: answer must be boolean`);
 assert(['medium','hard'].includes(question.difficulty),`${question.id}: unsupported difficulty`);
 assert(Array.isArray(question.tags)&&question.tags.length>=2,`${question.id}: topic labels are required for analysis`);
 assert(Array.isArray(question.sourceQuestionIds)&&Array.isArray(question.sourceRounds),`${question.id}: source metadata must be arrays`);
 if(!question.topicId.startsWith('supp-'))assert(question.sourceQuestionIds.length>0&&question.sourceRounds.length>0,`${question.id}: retained baseline source is required`);
 assert(question.sourceQuestionIds.every(id=>advancedIds.has(id)),`${question.id}: sources must be advanced official questions`);
 assert.deepEqual([...new Set(question.sourceRounds)].sort((a,b)=>a-b),question.sourceRounds,`${question.id}: source rounds must be unique/sorted`);
 assert.equal(question.frequency,question.sourceRounds.length,`${question.id}: frequency must reflect source rounds`);
}
const expansionQuestions=questions.filter(question=>question.topicId.startsWith('supp-'));
assert.equal(expansionQuestions.filter(question=>question.sourceQuestionIds.length).length,report.rawDirectLinkedCount,'only raw-direct expansion links may be exported');
assert.equal(questions.filter(question=>!question.topicId.startsWith('supp-')&&question.sourceQuestionIds.length).length,210,'all retained baseline concepts must keep their existing links');

/* Audited corrections: dates/factual scope, ambiguous false labels, and known baseline/expansion duplicates stay fixed. */
const byId=id=>questions.find(question=>question.id===id);
assert(byId('ox-prehistoric-096').explanation.includes('변한에서는 철을 화폐처럼'),'iron-currency fact must not overgeneralize all Samhan');
assert(!byId('ox-prehistoric-096').explanation.includes('삼한에서는 철을 화폐처럼'));
assert(byId('ox-goryeo-098').explanation.includes('원이 고려 왕들에게 충 자가 든 시호를 내렸다'),'Yuan-era posthumous-title wording regressed');
assert(byId('ox-republic-073').explanation.includes('1964년 한일 회담 추진에 반대'),'6·3 protest chronology regressed');
for(const [id,wrongLabel] of Object.entries({'ox-prehistoric-052':'부여 제천 행사','ox-joseon-039':'조선 후기 광업','ox-joseon-129':'조선 군사 제도','ox-empire-070':'근대 교육','ox-republic-064':'남북 관계'})){
 assert.equal(byId(id).answer,false,`${id}: ambiguity guard must exercise an X item`);
 assert(byId(id).statement.includes(`핵심 개념은 ${wrongLabel}이다`),`${id}: explicit unambiguous wrong label missing`);
}
for(const [id,detail] of Object.entries({'ox-joseon-051':'관수 관급제','ox-joseon-088':'조헌과 영규','ox-joseon-093':'강홍립','ox-joseon-106':'선무군관포','ox-joseon-117':'도고','ox-empire-037':'보빙사','ox-empire-056':'전봉준을 총대장','ox-empire-058':'교정청','ox-empire-062':'공사 노비','ox-empire-077':'상공 학교','ox-occupation-083':'선전 활동과 포로 심문','ox-occupation-085':'지청천','ox-occupation-087':'조선 의용대의 일부','ox-occupation-100':'1929년 11월','ox-occupation-107':'1931년','ox-republic-042':'제주 4·3 특별법','ox-republic-062':'경향신문','ox-republic-081':'계엄','ox-republic-083':'정승화','ox-republic-098':'통일 방안의 공통성','ox-republic-100':'남측의 자본·기술'}))assert(byId(id).explanation.includes(detail),`${id}: audited replacement fact missing (${detail})`);

/* OX home is era-first: old daily/quick affordances are gone, seven compact era entries remain. */
assert(!html.includes('data-nav="association"')&&!html.includes('>암기법<'));
click({nav:'ox'});
assert(html.includes('OX 퀴즈')&&html.includes('한능검 심화 핵심 개념을 빠르게 확인해요.'));
for(const removed of ['오늘의 심화 핵심 개념','오늘의 OX 퀴즈','빠른 OX 퀴즈','QUICK START'])assert(!html.includes(removed),`removed menu remains: ${removed}`);
assert(!html.includes('data-ox-start="daily"')&&!html.includes('data-ox-start="quick"'),'daily/quick start controls must be removed');
assert.equal((html.match(/data-ox-era=/g)||[]).length,7,'home must render seven era cards');
for(const [eraId,count] of Object.entries(actualCounts)){
 assert(html.includes(`data-ox-era="${eraId}"`),`${eraId} card missing`);
 assert(html.includes(`${count}`),`${eraId} actual question count missing from home`);
}
assert(html.includes('누적 풀이')&&html.includes('전체 정답률')&&html.includes('누적 오답'),'real learning summary labels missing');
assert((html.match(/아직 학습 전/g)||[]).length>=7,'unattempted eras must say 아직 학습 전');
assert(html.includes('data-ox-review')&&html.includes('data-ox-analysis'),'review and weakness analysis entries are required');

/* A small public API lets the tests verify behavior instead of private rendering details. */
assert.equal(run('typeof globalThis.OX_QUIZ_API'),'object','OX_QUIZ_API must be exposed');
for(const method of ['stats','eraStats','weaknessRows','wrongDistribution','choose','startSession','snapshot'])assert.equal(run(`typeof OX_QUIZ_API.${method}`),'function',`OX_QUIZ_API.${method} missing`);
const chosen=copy(`OX_QUIZ_API.choose(20,{eraId:'goryeo',seed:'qa-first'})`);
assert.equal(chosen.length,20,'era selection must return exactly 20 questions');
assert.equal(new Set(chosen).size,20,'one session must not repeat a question');
assert(chosen.every(id=>questions.find(question=>question.id===id)?.eraId==='goryeo'),'era selection leaked another era');

/* A real era session stores canonical attempt events and preserves non-OX app records. */
const protectedBefore=run('JSON.stringify({run:state.run,mainRun:state.mainRun,officialResults:meta().officialExamResults||[],questionRecords:meta().questionRecords,wrongQuestionIds:meta().wrongQuestionIds,wrongAnswers:meta().wrongAnswers})');
click({oxEra:'goryeo'});
let session=copy('meta().oxQuiz.activeSession');
assert.equal(session.mode,'era');assert.equal(session.eraId,'goryeo');assert.equal(session.questionIds.length,20);
assert.equal(new Set(session.questionIds).size,20);assert(session.questionIds.every(id=>questions.find(question=>question.id===id)?.eraId==='goryeo'));
const firstSessionIds=[...session.questionIds],firstQuestion=questions.find(question=>question.id===session.questionIds[0]);
assert(html.includes('<small>한능검 심화 핵심 개념</small>'),'the answer-bearing topic label must stay hidden before answering');
assert(!html.includes(`<small>${firstQuestion.tags.join(' · ')}</small>`),'the correct topic must not leak before an O/X choice');
answerCurrent(false);
assert(html.includes(`<small>${firstQuestion.tags.join(' · ')}</small>`),'topic label should be revealed with the explanation');
assert(!html.includes('연계 심화 기출'),'unreviewed source-round claims must not be rendered in OX feedback');
let event=copy('meta().oxQuiz.history.at(-1)');
const canonical=['answeredAt','attemptNumber','correctAnswer','eraId','isCorrect','questionId','selectedAnswer','sessionId','topicId'];
assert.deepEqual(canonical.filter(key=>Object.hasOwn(event,key)).sort(),canonical,`attempt event is missing canonical fields: ${JSON.stringify(event)}`);
assert.equal(event.questionId,firstQuestion.id);assert.equal(event.eraId,'goryeo');assert.equal(event.topicId,`goryeo:${firstQuestion.tags.join('|')}`);
assert.equal(event.selectedAnswer,!firstQuestion.answer);assert.equal(event.correctAnswer,firstQuestion.answer);assert.equal(event.isCorrect,false);assert.equal(event.attemptNumber,1);
assert(!Number.isNaN(Date.parse(event.answeredAt))&&event.sessionId===session.id,'attempt timestamp/session id invalid');
click({oxNext:'true'});
for(let index=1;index<20;index++){answerCurrent(true);click({oxNext:'true'})}
assert.equal(run('meta().oxQuiz.activeSession'),null);assert(html.includes('학습 결과'));
assert(html.includes('총 20문제')||html.includes('20문제 중'),'result total missing');
assert(html.includes('19문제 정답')&&html.includes('오답 1'),'result correct/wrong counts missing');
assert(html.includes('소요 시간'),'result duration missing');
assert(html.includes('세부 주제')&&html.includes('오답 분석'),'era result must include topic-level wrong analysis');
assert(html.includes(firstQuestion.tags.join(' · '))&&(html.match(/class="ox-bar-row"/g)||[]).length===1,'era result must group wrong answers by topic');

/* The next same-era session prefers unseen questions; learned progress counts unique ids. */
click({oxHome:'true'});click({oxEra:'goryeo'});
session=copy('meta().oxQuiz.activeSession');
assert.equal(session.questionIds.length,20);assert.equal(new Set(session.questionIds).size,20);
assert.equal(session.questionIds.filter(id=>firstSessionIds.includes(id)).length,0,'next era session must prefer unseen/recently unused questions while enough exist');
let stats=copy('OX_QUIZ_API.stats()'),eraStats=copy('OX_QUIZ_API.eraStats()');
let goryeo=Array.isArray(eraStats)?eraStats.find(row=>row.eraId==='goryeo'):eraStats.goryeo;
assert.equal(stats.attempts,20);assert.equal(stats.wrong,1);assert.equal(goryeo.learned,20,'learned progress must count unique questions, not attempts');
assert.equal(goryeo.total,actualCounts.goryeo);assert.equal(goryeo.attempts,20);assert.equal(goryeo.wrong,1);
click({oxBack:'home'});

/* Once every item is seen, the immediate prior session is still avoided and order is seed-shuffled. */
const selectionSnapshot=run('JSON.stringify(meta().oxQuiz)');
run(`(()=>{const ox=meta().oxQuiz;ox.records={};for(const q of OX_QUESTIONS.filter(item=>item.eraId==='goryeo'))ox.records[q.id]={attempts:1,correctCount:1,wrongCount:0,lastCorrect:true,lastAnsweredAt:'2026-01-01T00:00:00.000Z'};ox.recentQuestionIds=${JSON.stringify(firstSessionIds)};})()`);
const allSeenA=copy(`OX_QUIZ_API.choose(20,{eraId:'goryeo',seed:'all-seen-a'})`),allSeenB=copy(`OX_QUIZ_API.choose(20,{eraId:'goryeo',seed:'all-seen-b'})`);
assert.equal(allSeenA.filter(id=>firstSessionIds.includes(id)).length,0,'all-seen selection must avoid the immediately prior session while alternatives exist');
assert.equal(new Set(allSeenA).size,20);assert.notDeepEqual(allSeenA,allSeenB,'different seeds should shuffle equal-priority questions');
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
assert(html.includes('시대별 오답')&&(html.match(/class="ox-bar-row"/g)||[]).length===2,'mixed review result must group wrong answers by era');
assert(html.includes('개항기')&&html.includes('조선'),'mixed review result must label each wrong era');

/* Old events without topicId are safe; weakness ranking requires at least ten attempts. */
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
assert.equal(distribution.total,17,'donut denominator must be the sum of all seven eras cumulative wrong counts');
assert.equal(distribution.rows.length,7);assert.equal(distributionRow('prehistoric').wrong,9);assert.equal(distributionRow('goryeo').wrong,5);assert.equal(distributionRow('joseon').wrong,3);
assert.equal(distributionRow('prehistoric').percentage,'52.9');assert.equal(distributionRow('goryeo').percentage,'29.4');assert.equal(distributionRow('joseon').percentage,'17.6');

click({nav:'ox'});click({oxAnalysis:'true'});
assert(html.includes('시대별 취약점 분석')&&html.includes('가장 취약한 시대'));
assert(html.includes('데이터 부족'),'analysis screen must identify insufficient samples');
assert.equal((html.match(/class="ox-weakness-donut"/g)||[]).length,1,'analysis must render one all-era wrong-answer donut');
assert.equal((html.match(/data-era="(?:prehistoric|kingdoms|goryeo|joseon|empire|occupation|republic)" data-wrong=/g)||[]).length,7,'donut must include a labeled row for every era');
assert(!html.includes('ox-weakness-meter'),'the replaced horizontal weakness bars must not remain');
assert(html.includes('role="img"')&&html.includes('누적 오답 총 17문제'),'donut needs an accessible data summary');
assert(html.includes('data-era="goryeo" data-wrong="5" data-share="29.4"'),'legend must expose the actual count and calculated share');
assert(html.includes('data-ox-review-era="goryeo"'),'weak era must link to targeted review');

/* Repeating one question cannot satisfy the ten-unique-question ranking threshold. */
const analyticsSnapshot=run('JSON.stringify(meta().oxQuiz)'),repeatQuestion=questions.find(question=>question.eraId==='prehistoric');
run(`(()=>{const q=OX_QUESTIONS.find(item=>item.id===${JSON.stringify(repeatQuestion.id)}),ox=meta().oxQuiz;ox.records={};ox.wrongIds=[q.id];ox.history=Array.from({length:10},(_,index)=>({questionId:q.id,eraId:q.eraId,selectedAnswer:!q.answer,correctAnswer:q.answer,isCorrect:false,answeredAt:new Date(Date.now()+index).toISOString(),sessionId:'repeat-one',attemptNumber:index+1,answer:!q.answer,correct:false,mode:'era'}));})()`);
let repeatedEra=copy('OX_QUIZ_API.eraStats()').find(item=>item.eraId==='prehistoric');
assert.equal(repeatedEra.attempts,10);assert.equal(repeatedEra.learned,1);assert.equal(repeatedEra.eligible,false,'ten repeats of one item must remain 데이터 부족');

/* Multiple questions with the same era/concept tags aggregate into one weakness row. */
const conceptGroups=new Map();for(const question of questions){const key=`${question.eraId}:${question.tags.join('|')}`,rows=conceptGroups.get(key)||[];rows.push(question);conceptGroups.set(key,rows);}
const conceptPair=[...conceptGroups.values()].find(rows=>rows.length>=2).slice(0,2),conceptEra=conceptPair[0].eraId;
run(`(()=>{const ids=${JSON.stringify(conceptPair.map(question=>question.id))},ox=meta().oxQuiz;ox.records={};ox.wrongIds=[...ids];ox.history=ids.map((id,index)=>{const q=OX_QUESTIONS.find(item=>item.id===id);return {questionId:id,eraId:q.eraId,topicId:q.topicId,selectedAnswer:!q.answer,correctAnswer:q.answer,isCorrect:false,answeredAt:new Date(Date.now()+index).toISOString(),sessionId:'grouped-topic',attemptNumber:1,answer:!q.answer,correct:false,mode:'era'};});})()`);
const groupedTopics=copy(`OX_QUIZ_API.topicStats(${JSON.stringify(conceptEra)})`),grouped=groupedTopics.find(item=>item.learned===2&&item.wrong===2);
assert(grouped,'two questions sharing era/concept tags must collapse into one topic weakness row');
run(`meta().oxQuiz=${analyticsSnapshot}`);

/* Donut safely handles no wrong answers and a single-era 100% share. */
const donutSnapshot=run('JSON.stringify(meta().oxQuiz)'),singleWrong=questions.find(question=>question.eraId==='occupation');
run(`(()=>{const ox=meta().oxQuiz;ox.records={};ox.history=[];ox.wrongIds=[];render();})()`);
let emptyDistribution=copy('OX_QUIZ_API.wrongDistribution()');assert.equal(emptyDistribution.total,0);assert(emptyDistribution.rows.every(item=>item.percentage==='0'));
assert(html.includes('아직 누적 오답이 없습니다.')&&!html.includes('conic-gradient()'),'zero data must render a neutral, valid empty state');
run(`(()=>{const q=OX_QUESTIONS.find(item=>item.id===${JSON.stringify(singleWrong.id)}),ox=meta().oxQuiz;ox.records={[q.id]:{attempts:2,correctCount:0,wrongCount:2,lastCorrect:false,lastAnsweredAt:'2026-10-08T00:00:00.000Z'}};ox.history=[];ox.wrongIds=[q.id];render();})()`);
const singleDistribution=copy('OX_QUIZ_API.wrongDistribution()');assert.equal(singleDistribution.total,2);assert.equal(singleDistribution.rows.find(item=>item.eraId==='occupation').percentage,'100');
assert(html.includes('data-era="occupation" data-wrong="2" data-share="100"'),'one-era data must fill the donut at an exact 100% share');
run(`meta().oxQuiz=${donutSnapshot}`);

/* OX work remains isolated from Story, official exams, and their wrong-note records. */
assert.equal(run('JSON.stringify({run:state.run,mainRun:state.mainRun,officialResults:meta().officialExamResults||[],questionRecords:meta().questionRecords,wrongQuestionIds:meta().wrongQuestionIds,wrongAnswers:meta().wrongAnswers})'),protectedBefore,'OX must not alter Story or official exam records');
click({nav:'records'});assert(html.includes('OX 퀴즈 학습 통계')&&html.includes('시대별 기출 기록'));
assert.equal(run('globalThis.OX_QUIZ_UI_READY'),true);

/* Hybrid legacy records merge the latest event state without losing cumulative counts. */
const migrationQuestion=questions[0];
run(`(()=>{const q=OX_QUESTIONS.find(item=>item.id===${JSON.stringify(migrationQuestion.id)}),now='2026-10-08T01:02:03.000Z';meta().oxQuiz={records:{[q.id]:{attempts:3,correctCount:1,wrongCount:2}},wrongIds:[q.id],history:[{questionId:q.id,answer:q.answer,correct:true,answeredAt:now,sessionId:'legacy-hybrid',mode:'era'}],recentQuestionIds:[],completedSessions:[],activeSession:null,lastSession:null};save();})()`);
boot();
const migratedRecord=copy(`meta().oxQuiz.records[${JSON.stringify(migrationQuestion.id)}]`),migratedEvent=copy('meta().oxQuiz.history[0]');
assert.equal(migratedRecord.attempts,3);assert.equal(migratedRecord.correctCount,1);assert.equal(migratedRecord.wrongCount,2,'migration must preserve cumulative counts');
assert.equal(migratedRecord.lastCorrect,true);assert(!run(`meta().oxQuiz.wrongIds.includes(${JSON.stringify(migrationQuestion.id)})`),'latest correct legacy event must mark review complete');
assert(migratedEvent.topicId&&migratedEvent.eraId&&typeof migratedEvent.selectedAnswer==='boolean','legacy event must gain canonical fields');

/* Reload keeps canonical event history and OX state after migration. */
run('save()');const savedSnapshot=saved,historySnapshot=run('JSON.stringify(meta().oxQuiz.history)');boot();
assert.equal(saved,savedSnapshot);assert.equal(run('JSON.stringify(meta().oxQuiz.history)'),historySnapshot);

console.log(`PASS: ${questions.length} audited OX questions across seven eras, era-first UI, 20-question unique sessions, canonical attempts, unique progress, weakness ranking, review history, analysis, isolation, and reload persistence.`);
