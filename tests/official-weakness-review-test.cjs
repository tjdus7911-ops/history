const fs=require('fs'),vm=require('vm'),assert=require('assert');
const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]).filter(name=>name!=='pwa.js');
let html='',saved=null,handlers={};
const context=vm.createContext({Date,console,document:{querySelector:selector=>selector==='#app'?{set innerHTML(value){html=value}}:null,querySelectorAll:()=>[],addEventListener:(type,handler,capture)=>{(handlers[type]||=[]).push({handler,capture})},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){}});
const run=code=>vm.runInContext(code,context),copy=code=>JSON.parse(run('JSON.stringify('+code+')'));
run(scripts.map(name=>fs.readFileSync('dist/'+name,'utf8')).join('\n'));
function click(dataset){run('inputLockedUntil=0');let stopped=false;const button={dataset,disabled:false};for(const item of (handlers.click||[]).slice().sort((a,b)=>Number(Boolean(b.capture))-Number(Boolean(a.capture)))){item.handler({target:{closest:()=>button},stopImmediatePropagation(){stopped=true},stopPropagation(){}});if(stopped)break}}
const entryQuestion=id=>copy(`QUESTIONS.find(question=>question.questionId===${JSON.stringify(id)})`);
const otherAnswer=question=>[0,1,2,3,4].find(value=>!(question.acceptedAnswers||[question.answer]).includes(value));
const answerDisplay=question=>question.answerLabel==='없음'?'모든 선택지':['①','②','③','④','⑤'][question.answer];
const visibleExplanation=question=>/OCR 전사|추가 검수|추가 대조|검수 전까지|확정 사실로 사용하지/.test(question.explanation)?'원문 확인 중':question.explanation;


const eraEntries=copy('globalThis.OFFICIAL_EXAM_CATALOG');
const joseon=eraEntries.filter(e=>e.primaryEra==='joseon').filter(e=>{const q=entryQuestion(e.canonicalQuestionId);return (q.acceptedAnswers||[q.answer]).length<q.choices.length}).slice(0,10);
assert.equal(joseon.length,10);
run('meta().questionRecords={};meta().wrongQuestionIds=[];meta().reviewedQuestionIds=[];meta().wrongAnswers=[];meta().learningEvents=[]');
assert.equal(copy('OFFICIAL_LEARNING_ANALYSIS.rows().filter(row=>row.solved).length'),0,'empty statistics');
for(let i=0;i<10;i++){const q=entryQuestion(joseon[i].canonicalQuestionId);run('recordQuestion(state,'+JSON.stringify(q.questionId)+','+(i<5?otherAnswer(q):q.answer)+')');}
const rows=()=>copy('OFFICIAL_LEARNING_ANALYSIS.rows()'),joseonRow=()=>rows().find(r=>r.id==='joseon');
assert.equal(joseonRow().solved,10);assert.equal(joseonRow().wrong,5);assert.equal(joseonRow().accuracy,50);assert.equal(joseonRow().errorRate,50);assert.equal(joseonRow().weak,true);assert.equal(joseonRow().wrongCount,5);assert(joseonRow().recentWrong);
const goryeo=eraEntries.find(e=>e.primaryEra==='goryeo'),gq=entryQuestion(goryeo.canonicalQuestionId);run('recordQuestion(state,'+JSON.stringify(gq.questionId)+','+otherAnswer(gq)+')');
assert.equal(rows().find(r=>r.id==='goryeo').eligible,false);assert.equal(rows().find(r=>r.id==='goryeo').weak,false,'one wrong is not a weak era');
const repeated=joseon[0].canonicalQuestionId,rq=entryQuestion(repeated);
for(let i=0;i<2;i++)run('recordQuestion(state,'+JSON.stringify(repeated)+','+otherAnswer(rq)+')');
assert.equal(copy('OFFICIAL_LEARNING_ANALYSIS.record('+JSON.stringify(repeated)+')').wrongCount,3);
run('recordQuestion(state,'+JSON.stringify(repeated)+','+rq.answer+')');
assert.equal(copy('OFFICIAL_LEARNING_ANALYSIS.record('+JSON.stringify(repeated)+')').wrongCount,3);assert.equal(joseonRow().accuracy,60);assert.equal(joseonRow().wrong,4);assert.equal(joseonRow().repeatedWrong,2);
run("screen='exam-library';render()");assert(html.includes('기출문제'));click({officialWeakEra:'joseon'});
assert.equal(run('screen'),'study');assert.equal(run('wrongFilter'),'official');assert.equal(run('wrongEra'),'joseon');assert(html.includes('3회 틀림'));assert(html.includes('최근 풀이 정답'));assert(!html.includes('data-wrong-detail-open="'+gq.questionId+'"'));
const before=copy('meta()'),sessionBefore=copy('OFFICIAL_EXAM_UI.snapshot()');click({wrongDetailOpen:repeated});assert(html.includes('wrong-answer-detail'));assert(html.includes('내가 선택한 답'));assert(html.includes('정답'));assert.deepEqual(copy('meta()'),before);assert.deepEqual(copy('OFFICIAL_EXAM_UI.snapshot()'),sessionBefore);
click({wrongDetailOpen:repeated});assert.deepEqual(copy('meta()'),before);click({officialWeakEra:'occupation'});assert(html.includes('선택한 조건에 맞는 오답이 없습니다.'));click({officialWeakEra:'joseon'});assert(!/클릭하면 이동|누르면 이동|문제로 이동/.test(html));
// A submitted exam with an unanswered item must not count that item as an answer.
const untouched=eraEntries.find(e=>e.primaryEra==='empire'),uq=entryQuestion(untouched.canonicalQuestionId);run('recordQuestion(state,'+JSON.stringify(uq.questionId)+',null)');
assert.equal(copy('OFFICIAL_LEARNING_ANALYSIS.record('+JSON.stringify(uq.questionId)+')').attempts,0);assert.equal(rows().find(r=>r.id==='empire').solved,0);
// An unanswered revisit cannot erase the latest submitted answer or add an error.
run('recordQuestion(state,'+JSON.stringify(repeated)+',null)');assert.equal(copy('OFFICIAL_LEARNING_ANALYSIS.record('+JSON.stringify(repeated)+')').wrongCount,3);assert.equal(copy('OFFICIAL_LEARNING_ANALYSIS.record('+JSON.stringify(repeated)+')').lastCorrect,true);
const statsBeforeOX=rows();run("OX_QUIZ_API.startSession('era','joseon',{count:1})");const oxQuestion=copy('OX_QUESTIONS.find(q=>q.id===meta().oxQuiz.activeSession.questionIds[0])');click({oxAnswer:String(!oxQuestion.answer)});click({oxAnswer:String(!oxQuestion.answer)});click({oxNext:'true'});
assert.deepEqual(rows(),statsBeforeOX,'OX attempts polluted official statistics');assert.equal(copy('OX_QUIZ_API.snapshot().meta.records['+JSON.stringify(oxQuestion.id)+']').wrongCount,1,'duplicate OX submit');
run("wrongEra='joseon';wrongFilter='all';studyTab='review';screen='study';render()");assert(html.includes('data-ox-wrong-open="'+oxQuestion.id+'"'));assert(html.includes('data-wrong-detail-open="'+repeated+'"'));
const oxBefore=copy('OX_QUIZ_API.snapshot()'),officialBefore=copy('meta().questionRecords');click({oxWrongOpen:oxQuestion.id});assert(html.includes(oxQuestion.explanation));assert.deepEqual(copy('OX_QUIZ_API.snapshot()'),oxBefore);assert.deepEqual(copy('meta().questionRecords'),officialBefore);
click({wrongFilter:'ox'});assert(html.includes('1회 틀림'));assert(!html.includes('data-wrong-detail-open="'+repeated+'"'));
click({oxReviewOne:oxQuestion.id});click({oxAnswer:String(oxQuestion.answer)});click({oxNext:'true'});run("wrongFilter='ox';screen='study';render()");assert(html.includes('최근 풀이 정답 · 복습 완료'));assert(html.includes('1회 틀림'));assert.equal(copy('OX_QUIZ_API.snapshot().meta.records['+JSON.stringify(oxQuestion.id)+']').wrongCount,1);
console.log('PASS: 10/5 weakness, sample floor, latest-versus-cumulative correctness, era routing, 3 wrong then right, no-answer exclusion, record-free official/OX detail opening, separate records, and duplicate submit guard');

