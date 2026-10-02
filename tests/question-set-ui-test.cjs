const fs=require('fs'),vm=require('vm'),assert=require('assert');
let saved=null,html='',handlers={},context;
const data=['data','ch02-data','ch03-data','exam-data','ch01-expansion','chapter-split'].map(file=>fs.readFileSync(`dist/${file}.js`,'utf8')).join('\n'),app=fs.readFileSync('dist/app.js','utf8');
function boot(){
  handlers={};const root={set innerHTML(value){html=value},get innerHTML(){return html}};
  const document={querySelector:selector=>selector==='#app'?root:null,querySelectorAll:()=>[],addEventListener:(name,handler)=>handlers[name]=handler,createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}};
  context=vm.createContext({document,localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},Date});vm.runInContext(data+app,context);
}
const click=dataset=>{vm.runInContext('inputLockedUntil=0',context);handlers.click({target:{closest:()=>({dataset,disabled:false})}})};
const action=value=>click({action:value}),answer=value=>click({answer:String(value)}),current=()=>JSON.parse(saved);
boot();
vm.runInContext("state.run.started=true;state.run.currentChapter='ch02';state.run.storyId='future_flow';state.run.dialogueSceneId='future_flow';state.run.dialogueCursor=STORIES.future_flow.dialogues.length;save();render();",context);
action('next');
let state=current();assert.equal(state.run.activeQuestionSetId,'ch02-illyecheon');assert.equal(state.run.questionQueue.length,3);assert.equal(state.run.activeQuestionId,'ch01-official-76-advanced-10');assert(html.includes('실제 기출 1 / 3'));
let correct=vm.runInContext("QUESTIONS.find(q=>q.questionId===run().activeQuestionId).answer",context);answer((correct+1)%5);assert(html.includes('게임 속 기억'));action('quiz-next');assert(html.includes('실제 기출 2 / 3'));
boot();action('play');assert.equal(current().run.questionQueueIndex,1,'reload resumes the second question');correct=vm.runInContext("QUESTIONS.find(q=>q.questionId===run().activeQuestionId).answer",context);answer(correct);action('quiz-next');assert(html.includes('실제 기출 3 / 3'));
correct=vm.runInContext("QUESTIONS.find(q=>q.questionId===run().activeQuestionId).answer",context);answer(correct);assert(html.includes('이번 기억'));assert(html.includes('2 / 3 정답'));assert(html.includes('이야기 계속'));assert.equal(current().meta.wrongAnswers.length,1);action('quiz-next');assert.equal(current().run.storyId,'ch01_integration');assert.equal(current().run.activeQuestionSetId,null);

vm.runInContext("state.run.storyId='ch03_gukjagam';state.run.currentChapter='ch04';state.run.dialogueSceneId='ch03_gukjagam';state.run.dialogueCursor=STORIES.ch03_gukjagam.dialogues.length;save();render();",context);action('next');
assert.deepEqual(current().run.questionQueue,['ch03-official-75-basic-10','ch04-official-68-advanced-09','ch04-official-65-advanced-11']);
for(let i=0;i<3;i++){const right=vm.runInContext("QUESTIONS.find(q=>q.questionId===run().activeQuestionId).answer",context);answer(right);if(i<2)action('quiz-next')}
assert(html.includes('3 / 3 정답'));action('quiz-next');assert.equal(current().run.storyId,'ch03_policy_effect');
vm.runInContext("state.run.storyId='ch03_farewell';state.run.dialogueSceneId='ch03_farewell';state.run.dialogueCursor=STORIES.ch03_farewell.dialogues.length;save();render();",context);action('next');assert.equal(current().run.storyId,'ch03_doyun_soliloquy');assert(!current().run.activeQuestionId);assert(html.includes('나쁘지 않은 장사'));action('next');assert.equal(current().run.storyId,'ch03_death');
console.log('PASS: story question sets run as uninterrupted 1/3–3/3 queues, survive reload, show set score, resume correctly, and never interrupt Doyun finale.');
