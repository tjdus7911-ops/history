const fs=require('fs'),vm=require('vm'),assert=require('assert');
let saved=null,html='',handlers={},context,timers=[];
const data=fs.readFileSync('dist/data.js','utf8')+'\n'+fs.readFileSync('dist/ch02-data.js','utf8')+'\n'+fs.readFileSync('dist/ch03-data.js','utf8')+'\n'+fs.readFileSync('dist/exam-data.js','utf8')+'\n'+fs.readFileSync('dist/ch01-expansion.js','utf8')+'\n'+fs.readFileSync('dist/chapter-split.js','utf8')+'\n'+fs.readFileSync('dist/late-goryeo.js','utf8')+'\n'+fs.readFileSync('dist/official-late-exams.js','utf8'),app=fs.readFileSync('dist/app.js','utf8');
function boot(){handlers={};timers=[];const root={set innerHTML(s){html=s},get innerHTML(){return html}};const document={querySelector:s=>s==='#app'?root:null,querySelectorAll:()=>[],addEventListener:(e,f)=>handlers[e]=f,createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}};context=vm.createContext({document,localStorage:{getItem:()=>saved,setItem:(k,s)=>saved=s},window:{scrollTo(){}},navigator:{},setTimeout(fn){timers.push(fn);return timers.length},clearTimeout(){},Date});vm.runInContext(data+app,context)}
const click=dataset=>{vm.runInContext('inputLockedUntil=0',context);handlers.click({target:{closest:()=>({dataset,disabled:false})}})},action=x=>click({action:x}),nav=x=>click({nav:x}),selectChoice=i=>click({choice:String(i)}),answer=i=>click({answer:String(i)});
const current=()=>JSON.parse(saved),story=()=>current().run.storyId;
function reveal(){let n=0;while(html.includes('data-action="advance-dialogue"')){action('advance-dialogue');if(++n>15)throw Error('dialogue guard')}}
function next(){reveal();action('next')}function choose(i){reveal();selectChoice(i);reveal();action('result-next')}
function drainSupplementalQuestions(){let guard=0;while(vm.runInContext(`Boolean(STORIES[${JSON.stringify(story())}]?.supplementalExam)`,context)){next();const correct=vm.runInContext('QUESTIONS.find(q=>q.questionId===run().activeQuestionId).answer',context);answer(correct);assert(html.includes('기억이 선명해졌다'));action('quiz-next');if(++guard>8)throw new Error('supplemental quiz guard')}}
function answerAndContinue(i){answer(i);assert(html.includes(i===vm.runInContext(`QUESTIONS.find(q=>q.questionId===run().activeQuestionId).answer`,context)?'기억이 선명해졌다':'기억이 흐릿하다'));action('quiz-next');drainSupplementalQuestions()}


const crypto=require('crypto'),fixture=JSON.parse(fs.readFileSync('tests/fixtures/ch03-original-question-hashes.json'));boot();for(const[id,digest]of Object.entries(fixture.hashes)){const value=vm.runInContext('QUESTIONS.find(q=>q.questionId==='+JSON.stringify(id)+')',context);assert.equal(crypto.createHash('sha256').update(JSON.stringify(Object.fromEntries(Object.entries(value).filter(([key])=>!fixture.ignoredLearningFields.includes(key)&&!(!value.isOfficial&&fixture.selfAuthoredPresentationFields.includes(key)))))).digest('hex'),digest,'original question unchanged: '+id)}
const expected=Array.from(vm.runInContext("SPLIT_STORY_QUESTION_IDS.ch03",context));
for(const wrong of [false,true]){
 saved=null;boot();vm.runInContext("state=INITIAL();finishChapter(state);startChapter(state,'ch02');finishChapter(state);startChapter(state,'ch03');play()",context);
 const seen=[];let guard=0;
 while(!current().run.completed){
  assert(++guard<500);
  if(vm.runInContext('screen',context)==='quiz'){
   const q=vm.runInContext('activeQuestion()',context);seen.push(q.questionId);
   assert(html.includes(q.question));if(q.isOfficial){assert(html.includes(q.sourceQuestionImage));assert.equal(fs.existsSync("dist/"+q.sourceQuestionImage),true)}assert(html.includes(q.isOfficial?'제'+q.examRound+'회':'[심화 연습]'));assert.equal(vm.runInContext('STORIES[run().storyId].quizOnly',context),true);assert.equal(current().run.questionQueue.length,vm.runInContext("QUESTION_SETS[run().activeQuestionSetId].requiredCount",context));assert.equal(current().run.storyId,vm.runInContext('QUESTION_SCENE_IDS[run().activeQuestionId]',context));assert(!html.includes('character-stage'));
   for(let i=0;i<q.choices.length;i++)assert(html.includes('data-answer="'+i+'"'));
   boot();action('play');assert.equal(current().run.activeQuestionId,q.questionId,'reload before answer');
   const before=current().run.stats.knowledge;answer(wrong?(q.answer+1)%q.choices.length:q.answer);
   assert(html.includes(q.explanation));assert(html.includes(wrong?'기억이 흐릿하다':'기억이 선명해졌다'));
   assert.equal(current().run.questionResults[q.questionId],!wrong);
   assert.equal(current().run.stats.knowledge,before+(wrong?0:q.rewardKnowledge));
   boot();action('play');assert(html.includes('feedback'),'reload retains judged answer');
   action('quiz-next');continue;
  }
  if(html.includes('data-action="advance-dialogue"'))action('advance-dialogue');
  else if(current().run.pending)action('result-next');
  else if(html.includes('data-choice='))selectChoice(0);
  else action('next');
 }
 assert.deepEqual(seen,expected);assert.equal(Object.keys(current().run.questionResults).length,29);
 assert.equal(story(),'ch02_chapter_clear');assert(current().meta.completedChapters.includes('ch03'));
 console.log('PASS: CH.03 twenty-nine questions in fifteen 1–3-question blocks, '+(wrong?'all incorrect':'all correct')+', source labels, choices, explanation, rewards, reload, story return and chapter clear.');
}
