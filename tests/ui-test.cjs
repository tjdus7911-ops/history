const fs=require('fs'),vm=require('vm'),assert=require('assert');
let saved=null,html='',handlers={},context;
const data=fs.readFileSync('dist/data.js','utf8'),app=fs.readFileSync('dist/app.js','utf8');
function boot(){
  handlers={};
  const root={set innerHTML(s){html=s},get innerHTML(){return html}};
  const document={querySelector:s=>s==='#app'?root:null,querySelectorAll:()=>[],addEventListener:(e,f)=>handlers[e]=f,createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}};
  context=vm.createContext({document,localStorage:{getItem:()=>saved,setItem:(k,s)=>saved=s},window:{scrollTo(){}},navigator:{},setTimeout(){},Date});
  vm.runInContext(data+app,context);
}
const click=dataset=>handlers.click({target:{closest:()=>({dataset,disabled:false})}});
const action=x=>click({action:x}),nav=x=>click({nav:x}),choice=i=>click({choice:String(i)}),answer=i=>click({answer:String(i)});
const current=()=>JSON.parse(saved),story=()=>current().run.storyId;
function next(){action('next')}
function answerCurrent(index){answer(index);assert(html.includes(index===currentAnswer()?'기억이 선명해졌다':'기억이 흐릿하다'));action('quiz-next')}
function currentAnswer(){const id=current().run.activeQuestionId;return vm.runInContext(`QUESTIONS.find(q=>q.questionId===${JSON.stringify(id)}).answer`,context)}

boot();
assert(html.includes('이야기 시작하기'));assert(!html.includes('처음부터 다시하기'));
action('play');assert(html.includes('순서가 자꾸 헷갈린다'));
choice(1);assert.equal(current().run.initialMemory,'936');assert(html.includes('선택의 결과'));action('result-next');
assert.equal(story(),'sleep');assert(html.includes('ASSET_REQUIRED'));next();next();
assert.equal(story(),'house');choice(2);assert(current().run.flags.observation);action('result-next');next();
assert.equal(story(),'rumor');next();assert.equal(current().run.activeQuestionId,'ch01-test-01');assert(html.includes('STORY TEST'));
answer(1);assert(html.includes('기억이 흐릿하다'));assert(current().meta.wrongQuestionIds.includes('ch01-test-01'));action('quiz-next');
assert.equal(story(),'foundation');assert(html.includes('918년과 936년을 헷갈리고 있어요'));next();
answerCurrent(2);assert.equal(story(),'market');next();assert.equal(story(),'doyun');next();answerCurrent(1);
assert.equal(story(),'status');next();assert.equal(story(),'life_choice');assert(!html.includes('disabled=""'));
choice(2);assert.equal(current().run.route,'merchant');assert(html.includes('route-caravan'));action('result-next');
assert.equal(story(),'route_caravan');choice(0);assert.equal(current().run.stats.wealth,10);assert.equal(current().run.job,'상단 일꾼');assert(html.includes('route-caravan-work'));action('result-next');
assert.equal(story(),'route_context');next();answerCurrent(1);
assert.equal(story(),'thief');choice(2);assert.equal(current().run.stats.fame,7);assert(html.includes('thief-alley'));action('result-next');
assert.equal(story(),'thief_aftermath');next();answerCurrent(3);
assert.equal(story(),'night');next();assert.equal(story(),'future_flow');next();answerCurrent(3);
assert(current().run.completed);assert.equal(current().run.storyId,'complete');assert(html.includes('CHAPTER 01 COMPLETE'));assert(html.includes('처음에 헷갈렸던 936년'));
assert.equal(current().meta.completedRuns,1);assert(current().meta.cards.includes('goryeo-foundation-918'));assert(current().meta.people.includes('왕건'));

nav('home');assert(html.includes('이야기 이어하기'));assert(html.includes('처음부터 다시하기'));
const preserved=JSON.parse(JSON.stringify(current().meta));action('restart');assert(html.includes('CH.01을 다시 시작할까요?'));assert(html.includes('현재 회차의 진행 상태는 초기화됩니다'));
action('confirm-restart');assert.equal(story(),'prologue');assert(!current().run.completed);assert.equal(current().run.stats.wealth,0);assert.equal(current().run.choices.length,0);assert.deepEqual(current().meta,preserved);assert(html.includes('순서가 자꾸 헷갈린다'));

boot();nav('study');assert(html.includes('오답노트'));click({review:'ch01-test-01'});answer(0);assert(html.includes('기억이 선명해졌다'));action('quiz-next');assert(html.includes('복습 완료'));
console.log('PASS: start/continue/restart, prologue, time slip, distributed story tests, result illustrations, observation unlock, route stats, boss question, completion summary, cumulative learning preservation, and wrong-answer review.');
