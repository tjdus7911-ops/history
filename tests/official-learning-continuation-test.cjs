const fs=require('fs'),vm=require('vm'),assert=require('assert');
const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]).filter(name=>name!=='pwa.js');
let saved=null,html='',handlers={},context,scrolls=0;
function boot(){
 html='';handlers={};scrolls=0;
 context=vm.createContext({Date,console,document:{visibilityState:'visible',querySelector:selector=>selector==='#app'?{set innerHTML(value){html=value}}:null,querySelectorAll:()=>[],addEventListener:(type,handler,capture)=>{(handlers[type]||=[]).push({handler,capture})},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},window:{scrollTo(){scrolls++}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>1,clearInterval(){}});
 vm.runInContext(scripts.map(name=>fs.readFileSync('dist/'+name,'utf8')).join('\n'),context);
}
const run=code=>vm.runInContext(code,context),copy=code=>JSON.parse(run('JSON.stringify('+code+')'));
function click(dataset){run('inputLockedUntil=0');let stopped=false;const button={dataset,disabled:false};for(const item of (handlers.click||[]).slice().sort((a,b)=>Number(Boolean(b.capture))-Number(Boolean(a.capture)))){item.handler({target:{closest:()=>button},stopImmediatePropagation(){stopped=true}});if(stopped)break}}
const currentId=()=>run('officialSessionQuestion().canonicalQuestionId');
function answerCurrent(){const id=currentId(),answer=run(`QUESTIONS.find(question=>question.questionId===${JSON.stringify(id)}).acceptedAnswers[0]`);click({officialPick:String(answer)});click({officialSubmit:'true'});return {id,answer}}

boot();click({nav:'exam-library'});click({officialTab:'round'});click({officialRoundLevel:'심화'});click({officialRound:'70',officialEditionLevel:'심화'});
const ids=copy("globalThis.OFFICIAL_ENTRIES_FOR_ROUND(70,'심화').map(entry=>entry.canonicalQuestionId)");assert.equal(ids.length,50);

// An already-completed edition must still create a fresh, continuous learning session.
run("for(const entry of globalThis.OFFICIAL_ENTRIES_FOR_ROUND(70,'심화'))meta().questionRecords[entry.canonicalQuestionId]={attempts:1,correctCount:1,lastAnswer:0,lastCorrect:true,everCorrect:true,solved:true};save()");
const firstBaseline=run(`meta().questionRecords[${JSON.stringify(ids[0])}].attempts`);
click({officialStudyFrom:ids[0]});assert.equal(run('globalThis.OFFICIAL_EXAM_UI.snapshot().questionIds.length'),50);assert.equal(currentId(),ids[0]);assert.equal(run('Object.keys(globalThis.OFFICIAL_EXAM_UI.snapshot().answers).length'),0);assert.equal(run('Object.keys(globalThis.OFFICIAL_EXAM_UI.snapshot().feedback).length'),0);
answerCurrent();assert(html.includes('다음 문제')&&!html.includes('학습 결과 보기'));assert.equal(run(`meta().questionRecords[${JSON.stringify(ids[0])}].attempts`),firstBaseline+1);
click({officialSubmit:'true'});assert.equal(run(`meta().questionRecords[${JSON.stringify(ids[0])}].attempts`),firstBaseline+1,'re-rendered submit must not duplicate an attempt');
click({officialNext:'true'});assert.equal(currentId(),ids[1]);assert.equal(run(`globalThis.OFFICIAL_EXAM_UI.snapshot().answers[${JSON.stringify(ids[1])}]`),undefined);assert.equal(run(`globalThis.OFFICIAL_EXAM_UI.snapshot().feedback[${JSON.stringify(ids[1])}]`),undefined);assert(html.includes('정답 확인'));
click({officialPrevious:'true'});assert.equal(currentId(),ids[0]);assert(Number.isInteger(run(`globalThis.OFFICIAL_EXAM_UI.snapshot().answers[${JSON.stringify(ids[0])}]`)));assert.equal(typeof run(`globalThis.OFFICIAL_EXAM_UI.snapshot().feedback[${JSON.stringify(ids[0])}]`),'boolean');assert(html.includes('[문제 핵심 해설]'));
click({officialNext:'true'});assert.equal(currentId(),ids[1]);answerCurrent();click({officialNext:'true'});assert.equal(currentId(),ids[2]);assert(scrolls>0,'question navigation must reset the scroll position');

// Starting in the middle scopes the result to that point onward and never imports earlier questions.
click({officialExit:'true'});click({officialStudyFrom:ids[9]});assert.equal(currentId(),ids[9]);assert.equal(run('globalThis.OFFICIAL_EXAM_UI.snapshot().questionIds.length'),41);assert(!copy('globalThis.OFFICIAL_EXAM_UI.snapshot().questionIds').includes(ids[8]));answerCurrent();click({officialNext:'true'});assert.equal(currentId(),ids[10]);

// Wrong-only retry keeps its filtered order and exposes the result action only at the real end.
click({officialExit:'true'});const wrongIds=[ids[2],ids[6],ids[11]],wrongLiteral=JSON.stringify(wrongIds);run(`globalThis.OFFICIAL_EXAM_UI.startLearning(${wrongLiteral},{scope:'wrong-seed'})`);
for(let index=0;index<wrongIds.length;index++){const answer=run(`(QUESTIONS.find(question=>question.questionId===${JSON.stringify(wrongIds[index])}).acceptedAnswers[0]+1)%4`);click({officialPick:String(answer)});click({officialSubmit:'true'});click({officialNext:'true'})}
assert(run('globalThis.OFFICIAL_EXAM_UI.snapshot().graded')&&/data-figma-frame="(?:W-07|E-10)"/.test(html));click({officialRetry:'true'});assert.deepEqual(copy('globalThis.OFFICIAL_EXAM_UI.snapshot().questionIds'),wrongIds);assert.equal(currentId(),wrongIds[0]);
for(let index=0;index<wrongIds.length;index++){assert.equal(currentId(),wrongIds[index]);answerCurrent();if(index<wrongIds.length-1){assert(html.includes('다음 문제')&&!html.includes('학습 결과 보기'));click({officialNext:'true'})}}
assert(html.includes('학습 결과 보기')&&!html.includes('data-official-next="true">다음 문제'));click({officialNext:'true'});assert(run('globalThis.OFFICIAL_EXAM_UI.snapshot().graded')&&/data-figma-frame="(?:W-07|E-10)"/.test(html));assert.equal(run('globalThis.OFFICIAL_EXAM_UI.snapshot().questionIds.length'),3);assert.equal(currentId(),wrongIds[2]);

// An explicitly requested single-question review remains a one-question session.
click({officialBack:'list'});click({officialSingle:ids[0]});assert.equal(run('globalThis.OFFICIAL_EXAM_UI.snapshot().questionIds.length'),1);assert.equal(currentId(),ids[0]);
console.log('PASS: completed/mixed history, middle-start scope, previous revisit state, wrong-only order, final action, single review and duplicate-attempt guard verified.');

