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

const coverage=copy('globalThis.OFFICIAL_EXPLANATION_COVERAGE');
assert.deepEqual(coverage,{total:1300,preexisting:122,restoredMappings:0,supplemented:1178,covered:1300,missing:0});
const entries=copy('globalThis.OFFICIAL_EXAM_CATALOG');
for(const entry of entries){
  const question=entryQuestion(entry.canonicalQuestionId);
  assert(question.explanation&&question.explanation.trim(),entry.canonicalQuestionId+' missing explanation');
  assert(!/^공식 정답은 [①②③④⑤1-5]입니다[.]$/.test(question.explanation),entry.canonicalQuestionId+' answer-only placeholder');
  assert(!/undefined|null|해설이 준비 중/.test(question.explanation),entry.canonicalQuestionId+' invalid explanation text');
}

// TEST 1/2: era practice shows answer and explanation for wrong and right answers.
click({nav:'exam-library'});click({officialEra:'ancient'});
const eraEntry=entries.find(entry=>entry.primaryEra==='ancient'),eraQuestion=entryQuestion(eraEntry.canonicalQuestionId),eraWrong=otherAnswer(eraQuestion);
click({officialSingle:eraEntry.canonicalQuestionId});click({officialPick:String(eraWrong)});click({officialSubmit:'true'});
assert(html.includes('✕ 오답입니다.'));assert(html.includes('정답 '+answerDisplay(eraQuestion)));assert(html.includes('[해설]'));assert(html.includes(eraQuestion.explanation));
click({officialExit:'true'});click({officialSingle:eraEntry.canonicalQuestionId});click({officialPick:String(eraQuestion.answer)});click({officialSubmit:'true'});
assert(html.includes('✓ 정답입니다.'));assert(html.includes('[해설]'));assert(html.includes(eraQuestion.explanation));

// TEST 3/4: round learn mode immediately shows explanations for both outcomes.
click({officialExit:'true'});click({officialBack:'home'});click({officialTab:'round'});click({officialRound:'70',officialEditionLevel:'심화'});click({officialStart:'learn'});
let current=copy('officialSessionQuestion()'),question=entryQuestion(current.canonicalQuestionId),wrong=otherAnswer(question);
click({officialPick:String(wrong)});click({officialSubmit:'true'});assert(html.includes('✕ 오답입니다.')&&html.includes('[해설]')&&html.includes(question.explanation));
click({officialExit:'true'});click({officialStart:'learn'});current=copy('officialSessionQuestion()');question=entryQuestion(current.canonicalQuestionId);click({officialPick:String(question.answer)});click({officialSubmit:'true'});assert(html.includes('✓ 정답입니다.')&&html.includes('[해설]')&&html.includes(question.explanation));

// TEST 5/6: exam mode hides explanations while solving and exposes direct review only after grading.
click({officialExit:'true'});click({officialStart:'exam'});
const examEntries=entries.filter(entry=>entry.sourceRecord.examRound===70&&entry.sourceRecord.examLevel==='심화').sort((a,b)=>a.sourceRecord.questionNumber-b.sourceRecord.questionNumber);let firstWrongId=null;
for(let index=0;index<examEntries.length;index++){
  const entry=examEntries[index],examQuestion=entryQuestion(entry.canonicalQuestionId),answer=index===0?otherAnswer(examQuestion):examQuestion.answer;
  if(index===0)firstWrongId=entry.canonicalQuestionId;
  click({officialPick:String(answer)});
  assert(!html.includes('[해설]'));assert(!html.includes(examQuestion.explanation));
  click({officialNext:'true'});
}
assert(html.includes('OFFICIAL EXAM RESULT'));assert(html.includes('문제별 해설 · 오답 1'));assert(html.includes(`data-official-review="${firstWrongId}"`));
click({officialReview:firstWrongId});const reviewed=entryQuestion(firstWrongId);assert(html.includes('채점 후 문제 다시 보기'));assert(html.includes('✕ 오답입니다.'));assert(html.includes('정답 '+answerDisplay(reviewed)));assert(html.includes('[해설]'));assert(html.includes(reviewed.explanation));

// TEST 7: Story official question keeps its submit -> grading -> explanation flow.
const storyId=entries.find(entry=>entry.canonicalQuestionId.startsWith('ch')&&entryQuestion(entry.canonicalQuestionId).relatedSceneId).canonicalQuestionId,storyQuestion=entryQuestion(storyId);
run(`quizMode='story';run().activeQuestionId=${JSON.stringify(storyId)};run().questionAnswer=${storyQuestion.answer};screen='quiz';render()`);
assert(html.includes('역사 해설'));assert(html.includes(storyQuestion.explanation));assert(html.includes('정답 · 정답'));

// TEST 8: wrong-note detail includes question, correct answer, selected answer, and explanation.
run(`recordQuestion(state,${JSON.stringify(eraEntry.canonicalQuestionId)},${eraWrong});screen='study';studyTab='review';render()`);
assert(html.includes('wrong-answer-detail'));assert(html.includes('문제 · 정답 · 해설 보기'));assert(html.includes('내가 선택한 답'));assert(html.includes(eraQuestion.explanation));

// TEST 9 is covered by the exhaustive canonical assertions above.
console.log('PASS: all 1,300 official explanations covered; era/round correct+wrong feedback, exam spoiler gate+post-grade review, Story, wrong-note detail, and null safety.');
