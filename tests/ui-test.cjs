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
const action=x=>click({action:x}),nav=x=>click({nav:x}),selectChoice=i=>click({choice:String(i)}),answer=i=>click({answer:String(i)});
const current=()=>JSON.parse(saved),story=()=>current().run.storyId;
function revealDialogue(){let guard=0;while(html.includes('data-action="advance-dialogue"')){action('advance-dialogue');if(++guard>12)throw new Error('dialogue did not finish')}}
function next(){revealDialogue();action('next')}
function choice(i){revealDialogue();selectChoice(i)}
function resultNext(){revealDialogue();action('result-next')}
function answerCurrent(index){answer(index);assert(html.includes(index===currentAnswer()?'기억이 선명해졌다':'기억이 흐릿하다'));action('quiz-next')}
function currentAnswer(){const id=current().run.activeQuestionId;return vm.runInContext(`QUESTIONS.find(q=>q.questionId===${JSON.stringify(id)}).answer`,context)}

boot();
assert(html.includes('이야기 시작하기'));assert(!html.includes('처음부터 다시하기'));
action('play');assert(html.includes('순서가 자꾸 헷갈린다'));
assert(html.includes('data-speaker-type="player"'));assert(html.includes('player_worried'));assert.equal(current().run.dialogueCursor,1);
action('advance-dialogue');assert.equal(current().run.dialogueCursor,2);boot();action('play');assert.equal(current().run.dialogueCursor,2);
choice(1);assert.equal(current().run.initialMemory,'936');assert(html.includes('data-speaker-type="player"'));assert(html.includes('936년'));resultNext();
assert.equal(story(),'sleep');assert(html.includes('ASSET_REQUIRED'));next();next();
assert.equal(story(),'house');choice(2);assert(current().run.flags.observation);resultNext();next();
assert.equal(story(),'rumor');next();assert.equal(current().run.activeQuestionId,'ch01-test-01');assert(html.includes('STORY TEST'));
answer(1);assert(html.includes('기억이 흐릿하다'));assert(current().meta.wrongQuestionIds.includes('ch01-test-01'));action('quiz-next');
assert.equal(story(),'foundation');revealDialogue();assert(html.includes('918년과 936년을 헷갈리고 있어요'));action('next');
answerCurrent(2);assert.equal(story(),'market');next();assert.equal(story(),'doyun');next();answerCurrent(1);
assert.equal(story(),'status');assert(html.includes('data-speaker-type="npc"'));assert(html.includes('doyun_neutral'));assert(html.includes('갈 곳은 있소?'));
action('advance-dialogue');assert(html.includes('data-speaker-type="player"'));assert(html.includes('player_embarrassed'));assert(html.includes('……없는데요.'));
action('advance-dialogue');assert(html.includes('doyun_surprised'));assert(html.includes('돈은?'));
action('advance-dialogue');assert(html.includes('player_embarrassed'));action('advance-dialogue');assert(html.includes('data-speaker-type="thought"'));assert(html.includes('나 지금 무일푼이잖아'));
assert(!html.includes('data-action="advance-dialogue"'));action('next');assert.equal(story(),'life_choice');revealDialogue();assert(html.includes('choice-dock'));assert(!html.includes('disabled=""'));
selectChoice(2);assert.equal(current().run.route,'merchant');assert(html.includes('data-speaker-type="player"'));assert(html.includes('상단에서 일할 수 있을까요?'));assert(html.includes('route-caravan'));
action('advance-dialogue');assert(html.includes('data-speaker-type="npc"'));assert(html.includes('doyun_smile'));assert(html.includes('일손은 언제나 필요하지'));resultNext();
assert.equal(story(),'route_caravan');choice(0);assert.equal(current().run.stats.wealth,10);assert.equal(current().run.job,'상단 일꾼');assert(html.includes('route-caravan-work'));resultNext();
assert.equal(story(),'route_context');next();answerCurrent(1);
assert.equal(story(),'thief');choice(2);assert.equal(current().run.stats.fame,7);assert(html.includes('thief-alley'));resultNext();
assert.equal(story(),'thief_aftermath');next();answerCurrent(3);
assert.equal(story(),'night');next();assert.equal(story(),'future_flow');next();answerCurrent(3);
assert(current().run.completed);assert.equal(current().run.storyId,'complete');assert(html.includes('CHAPTER 01 COMPLETE'));assert(html.includes('처음에 헷갈렸던 936년'));
assert.equal(current().meta.completedRuns,1);assert(current().meta.cards.includes('goryeo-foundation-918'));assert(current().meta.people.includes('왕건'));

nav('home');assert(html.includes('이야기 이어하기'));assert(html.includes('처음부터 다시하기'));
const preserved=JSON.parse(JSON.stringify(current().meta));action('restart');assert(html.includes('CH.01을 다시 시작할까요?'));assert(html.includes('현재 회차의 진행 상태는 초기화됩니다'));
action('confirm-restart');assert.equal(story(),'prologue');assert(!current().run.completed);assert.equal(current().run.stats.wealth,0);assert.equal(current().run.choices.length,0);assert.deepEqual(current().meta,preserved);assert(html.includes('순서가 자꾸 헷갈린다'));

boot();nav('study');assert(html.includes('오답노트'));click({review:'ch01-test-01'});answer(0);assert(html.includes('기억이 선명해졌다'));action('quiz-next');assert(html.includes('복습 완료'));
console.log('PASS: sequential NPC/player dialogue, expression portraits, thought styling, choice response/reaction, cursor reload, full story tests, branching, restart preservation, and wrong-answer review.');
