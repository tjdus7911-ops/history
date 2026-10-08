const fs=require('fs'),vm=require('vm'),assert=require('assert');
const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]).filter(name=>name!=='pwa.js');
let saved=null,html='',handlers={},context;
function boot(){
 html='';handlers={};context=vm.createContext({console,document:{visibilityState:'visible',querySelector:selector=>selector==='#app'?{set innerHTML(value){html=value}}:null,querySelectorAll:()=>[],addEventListener:(type,handler,capture)=>{(handlers[type]||=[]).push({handler,capture})},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>1,clearInterval(){}});vm.runInContext(scripts.map(name=>fs.readFileSync('dist/'+name,'utf8')).join('\n'),context);
}
const run=code=>vm.runInContext(code,context),copy=code=>JSON.parse(run('JSON.stringify('+code+')'));
function click(dataset){run('inputLockedUntil=0');let stopped=false;const button={dataset,disabled:false};for(const item of (handlers.click||[]).slice().sort((a,b)=>Number(Boolean(b.capture))-Number(Boolean(a.capture)))){item.handler({target:{closest:()=>button},stopImmediatePropagation(){stopped=true}});if(stopped)break}}
const currentId=()=>run('officialSessionQuestion().canonicalQuestionId');
const currentNumber=()=>run('officialSessionQuestion().sourceRecord.questionNumber');
function answerCurrent(){const id=currentId(),answer=run(`QUESTIONS.find(question=>question.questionId===${JSON.stringify(id)}).acceptedAnswers[0]`);click({officialPick:String(answer)});return {id,answer}}
function restartAndStart(){click({officialTimerRestart:'true'});click({officialRestartConfirm:'true'});click({officialTimerStart:'true'})}

boot();click({nav:'exam-library'});click({officialTab:'round'});click({officialRoundLevel:'심화'});click({officialRound:'70',officialEditionLevel:'심화'});click({officialStart:'exam'});click({officialTimerStart:'true'});
const ids=copy('meta().officialExamActiveSession.questionIds');assert.equal(ids.length,50);

// Scenario 1: question 1 is passed, the untouched sequence reaches 50, then question 1 returns.
click({officialPass:'true'});assert.equal(currentNumber(),2);assert.deepEqual(copy('meta().officialExamActiveSession.passedQuestionIds'),[ids[0]]);assert(html.includes('답변 완료 <b>0</b>')&&html.includes('미응답 <b>50</b>')&&html.includes('패스 <b>1</b>'));
click({officialNext:'true'});assert.equal(currentNumber(),2,'unanswered next must not move');
for(let number=2;number<=50;number++){assert.equal(currentNumber(),number);answerCurrent();click({officialNext:'true'})}
assert.equal(currentNumber(),1);assert.equal(run('meta().officialExamActiveSession.initialPassComplete'),true);assert.deepEqual(copy('meta().officialExamActiveSession.passedQuestionIds'),[ids[0]]);
answerCurrent();assert.deepEqual(copy('meta().officialExamActiveSession.passedQuestionIds'),[],'answering a passed question clears pass state');click({officialNext:'true'});assert(html.includes('모든 문제를 확인했습니다. 시험을 제출하시겠어요?'));click({officialSubmitCancel:'true'});

// Scenario 2: 1, 5 and 12 return in order; re-passing rotates them only on button clicks.
restartAndStart();
for(let number=1;number<=50;number++){
 assert.equal(currentNumber(),number);
 if([1,5,12].includes(number))click({officialPass:'true'});else{answerCurrent();click({officialNext:'true'})}
}
assert.equal(currentNumber(),1);assert.deepEqual(copy('meta().officialExamActiveSession.passedQuestionIds'),[ids[0],ids[4],ids[11]]);
boot();assert.equal(currentNumber(),1,'reload restores current question');assert.deepEqual(copy('meta().officialExamActiveSession.passedQuestionIds'),[ids[0],ids[4],ids[11]],'reload restores pass order');assert.equal(run('meta().officialExamActiveSession.timerState'),'RUNNING');
click({officialPass:'true'});assert.equal(currentNumber(),5);assert.deepEqual(copy('meta().officialExamActiveSession.passedQuestionIds'),[ids[4],ids[11],ids[0]]);
click({officialPass:'true'});assert.equal(currentNumber(),12);assert.deepEqual(copy('meta().officialExamActiveSession.passedQuestionIds'),[ids[11],ids[0],ids[4]]);
answerCurrent();click({officialNext:'true'});assert.equal(currentNumber(),1);answerCurrent();click({officialNext:'true'});assert.equal(currentNumber(),5);answerCurrent();click({officialNext:'true'});assert(html.includes('모든 문제를 확인했습니다. 시험을 제출하시겠어요?'));

// Scenario 3: manual submit reports unanswered count; continue returns to the earliest passed question.
click({officialSubmitCancel:'true'});restartAndStart();click({officialPass:'true'});const selectedBeforePass=answerCurrent();click({officialPass:'true'});assert.equal(run(`meta().officialExamActiveSession.answers[${JSON.stringify(selectedBeforePass.id)}]`),selectedBeforePass.answer,'pass must not delete an existing answer');assert.deepEqual(copy('meta().officialExamActiveSession.passedQuestionIds'),[ids[0]],'answered questions must not enter the pass queue');answerCurrent();click({officialNext:'true'});assert.equal(currentNumber(),4);
click({officialRequestSubmit:'true'});assert(html.includes('아직 답하지 않은 문제가 48개 있습니다. 그래도 제출하시겠어요?'));click({officialSubmitCancel:'true'});assert.equal(currentNumber(),1,'continue solving returns to the earliest passed question');assert.equal(run('meta().officialExamActiveSession.initialPassComplete'),true);
const completedBefore=run('(meta().officialExamResults||[]).length');click({officialRequestSubmit:'true'});click({officialSubmitConfirm:'true'});assert(html.includes('OFFICIAL EXAM RESULT'));assert.equal(run('(meta().officialExamResults||[]).length'),completedBefore+1);const manual=copy('meta().officialExamResults.at(-1)');assert.equal(manual.submissionReason,'MANUAL');assert.equal(Object.keys(manual.answers).length,50);assert.equal(Object.values(manual.answers).filter(Number.isInteger).length,2);assert.equal(Object.values(manual.answers).filter(value=>value===null).length,48);
console.log('PASS: pass queue order, last-question revisit, repeated pass rotation, answer clearing, reload restore and unanswered manual submission verified.');
