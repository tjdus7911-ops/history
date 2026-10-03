const fs=require('fs'),vm=require('vm'),assert=require('assert');
let saved=null,html='',handlers={},context,timers=[],typingElement=null;
const data=fs.readFileSync('dist/data.js','utf8')+'\n'+fs.readFileSync('dist/ch02-data.js','utf8')+'\n'+fs.readFileSync('dist/ch03-data.js','utf8')+'\n'+fs.readFileSync('dist/exam-data.js','utf8')+'\n'+fs.readFileSync('dist/ch01-expansion.js','utf8')+'\n'+fs.readFileSync('dist/chapter-split.js','utf8')+'\n'+fs.readFileSync('dist/late-goryeo.js','utf8')+'\n'+fs.readFileSync('dist/official-late-exams.js','utf8'),app=fs.readFileSync('dist/app.js','utf8'),css=fs.readFileSync('dist/dialogue.css','utf8');
function boot(){
  handlers={};timers=[];
  const root={set innerHTML(s){html=s},get innerHTML(){return html}};
  const document={querySelector:s=>s==='#app'?root:typingElement&&s.startsWith('[data-dialogue-index=')?typingElement:null,querySelectorAll:()=>[],addEventListener:(e,f)=>handlers[e]=f,createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}};
  context=vm.createContext({document,localStorage:{getItem:()=>saved,setItem:(k,s)=>saved=s},window:{scrollTo(){}},navigator:{},setTimeout(fn){timers.push(fn);return timers.length},clearTimeout(){},Date});
  vm.runInContext(data+app,context);
}
const click=dataset=>{vm.runInContext('inputLockedUntil=0',context);handlers.click({target:{closest:()=>({dataset,disabled:false})}})};
const action=x=>click({action:x}),nav=x=>click({nav:x}),selectChoice=i=>click({choice:String(i)}),answer=i=>click({answer:String(i)});
const current=()=>JSON.parse(saved),story=()=>current().run.storyId;
function revealDialogue(){let guard=0;while(html.includes('data-action="advance-dialogue"')){action('advance-dialogue');if(++guard>30)throw new Error('dialogue did not finish')}}
function next(){revealDialogue();action('next')}
function choice(i){revealDialogue();selectChoice(i)}
function resultNext(){revealDialogue();action('result-next')}
function currentAnswer(){const id=current().run.activeQuestionId;return vm.runInContext(`QUESTIONS.find(q=>q.questionId===${JSON.stringify(id)}).answer`,context)}
function drainSupplementalQuestions(){let guard=0;while(vm.runInContext(`Boolean(STORIES[${JSON.stringify(story())}]?.supplementalExam)`,context)){next();answer(currentAnswer());assert(html.includes('기억이 선명해졌다'));action('quiz-next');if(++guard>8)throw new Error('supplemental quiz guard')}}
function answerCurrent(index){answer(index);assert(html.includes(index===currentAnswer()?'기억이 선명해졌다':'기억이 섞였어'));action('quiz-next');drainSupplementalQuestions()}


boot();
assert(html.includes('이야기 시작하기'));assert(!html.includes('처음부터 다시하기'));
action('play');assert(html.includes('순서가 자꾸 헷갈린다'));
assert(html.includes('data-speaker-type="player"'));assert(html.includes('data-expression="worried"'));assert.equal(current().run.dialogueCursor,1);
action('advance-dialogue');assert.equal(current().run.dialogueCursor,2);boot();action('play');assert.equal(current().run.dialogueCursor,2);
choice(1);assert.equal(current().run.initialMemory,'936');assert(html.includes('data-speaker-type="player"'));assert(html.includes('936년'));resultNext();
assert.equal(story(),'sleep');assert(html.includes('has-art'));assert(!html.includes('ASSET_REQUIRED'));next();
assert.equal(story(),'voice');assert(html.includes('cinematic-black'));assert(!html.includes('background-image'));assert(css.includes('.cinematic-black .game-header'));assert(css.includes('.cinematic-black .game-stats'));assert(html.includes('이보시오'));assert.equal(timers.length,0);assert.equal(current().run.dialogueCursor,1);action('advance-dialogue');assert(html.includes('이보시오……!'));assert.equal(timers.length,0);boot();action('play');assert.equal(current().run.dialogueCursor,2);action('next');
assert.equal(story(),'house');assert(html.includes('effect-wake-reveal'));assert(html.includes('stage-left active'));assert(html.includes('data-character-id="doyun"'));assert(html.includes('data-position="left"'));assert(html.includes('stage-right listening'));assert(html.includes('정신이 드시오?'));action('advance-dialogue');assert(!html.includes('effect-wake-reveal'));assert(html.includes('stage-right active'));next();
assert.equal(story(),'outfit_gift');assert.equal(current().run.playerOutfit,'modern');while(current().run.dialogueCursor<6)action('advance-dialogue');assert.equal(current().run.playerOutfit,'modern');assert(html.includes('player_modern_'));action('advance-dialogue');assert.equal(current().run.playerOutfit,'goryeo_commoner');assert(current().run.flags.hasModernClothes);assert.equal(current().run.flags.wearingModernClothes,false);assert(current().run.flags.receivedGoryeoClothesFromDoyun);assert(current().run.inventory.some(item=>item.id==='modern-clothes'&&item.status==='stored'));assert(current().run.inventory.some(item=>item.id==='goryeo-commoner-clothes'&&item.status==='equipped'));boot();action('play');assert.equal(story(),'outfit_gift');assert.equal(current().run.playerOutfit,'goryeo_commoner');revealDialogue();assert(html.includes('현대 복장은 보관 중'));action('next');
assert.equal(story(),'rumor');assert.equal(current().run.playerOutfit,'goryeo_commoner');assert(html.includes('village-residents-rumor-918.png'));assert(html.includes('주민 A'));assert(html.includes('궁예가 그렇게 쫓겨날 줄'));assert(!html.includes('character-stage'));assert(!html.includes('data-character-id="resident_a"'));next();assert.equal(story(),'foundation');assert(html.includes('918년 · 고려 건국'));next();assert.equal(current().run.activeQuestionId,'ch01-official-69-basic-10');assert(html.includes('[실제 기출] 제69회 한국사능력검정시험 · 기본 · 10번'));answerCurrent(currentAnswer());assert.equal(current().run.activeQuestionId,'ch01-official-79-advanced-09');assert(html.includes('[실제 기출] 제79회 한국사능력검정시험 · 심화 · 9번'));answerCurrent(currentAnswer());assert.equal(current().run.activeQuestionId,'ch01-practice-foundation-sequence');assert(html.includes('[심화 연습] 한능검 심화 대비'));answerCurrent(currentAnswer());assert.equal(story(),'ch01_trade_start');assert.equal(current().run.activeQuestionId,null);assert.equal(current().run.job,'상단 일꾼');assert.equal(current().run.route,'merchant');
const years=new Set();let expansionGuard=0;
while(!current().run.completed){years.add(vm.runInContext('STORIES[run().storyId]?.year',context));if(current().run.activeQuestionId)answerCurrent(currentAnswer());else if(current().run.pending)resultNext();else if(vm.runInContext('Boolean(STORIES[run().storyId]?.choices)',context))choice(0);else next();if(++expansionGuard>90)throw new Error('expanded story stalled')}
assert([927,930].every(year=>years.has(year)));assert.equal(Object.keys(current().run.questionResults).length,9);assert.equal(current().run.characterStates.doyun.characterAge,36);
assert(current().run.completed);assert.equal(current().run.storyId,'ch01_clear_930');assert(html.includes('CHAPTER 01 CLEAR'));
assert.equal(current().meta.completedRuns,1);assert(current().meta.cards.includes('goryeo-foundation-918'));assert(current().meta.people.includes('왕건'));

nav('home');assert(html.includes('챕터 결과 보기'));assert(html.includes('현재 챕터 다시하기'));assert(html.includes('CHAPTER 02'));
const preserved=JSON.parse(JSON.stringify(current().meta));action('restart-current');assert(html.includes('CH.01을 처음부터 다시 시작할까요?'));assert(html.includes('현재 메인 이야기의 CH.01 진행을 처음으로 되돌립니다.'));
action('confirm-restart-current');assert.equal(story(),'prologue');assert(!current().run.completed);assert.equal(current().run.stats.wealth,0);assert.equal(current().run.choices.length,0);assert.deepEqual(current().meta,preserved);assert(html.includes('순서가 자꾸 헷갈린다'));

boot();nav('study');assert(html.includes('오답노트'));click({review:'ch01-official-69-basic-10'});answer(2);assert(html.includes('기억이 선명해졌다'));action('quiz-next');assert(html.includes('오답노트'));
console.log('PASS: sequential NPC/player dialogue, expression portraits, thought styling, choice response/reaction, cursor reload, full CH.01 flow, restart preservation, and review return.');

// Real typing state uses the shared dialogue element: tap completes, then advances.
vm.runInContext("state.run.storyId='house';state.run.dialogueSceneId=null;state.run.pending=null;state.run.activeQuestionId=null;state.run.completed=false;screen='game';enterStory();save()",context);
typingElement={textContent:''};boot();action('play');
assert.equal(current().run.dialogueCursor,1);assert.equal(typingElement.textContent,'정');
action('advance-dialogue');assert.equal(current().run.dialogueCursor,1);assert.equal(typingElement.textContent,'정신이 드시오?');
action('advance-dialogue');assert.equal(current().run.dialogueCursor,2);assert.equal(typingElement.textContent,'…');
action('advance-dialogue');assert.equal(current().run.dialogueCursor,2);assert.equal(typingElement.textContent,'……여기가 어디예요?');
typingElement=null;
// Version 2 saves resume at the same spoken moment after the first-meeting compression.
let legacy=JSON.parse(saved);legacy.run.openingFlowVersion=2;legacy.run.storyId='house';legacy.run.dialogueSceneId='house';legacy.run.dialogueCursor=5;saved=JSON.stringify(legacy);boot();action('play');assert.equal(current().run.dialogueCursor,2);boot();action('play');assert.equal(current().run.dialogueCursor,2);
legacy=JSON.parse(saved);delete legacy.run.openingFlowVersion;legacy.run.storyId='voice';legacy.run.dialogueSceneId='voice';legacy.run.dialogueCursor=4;saved=JSON.stringify(legacy);boot();action('play');assert.equal(story(),'house');assert.equal(current().run.dialogueCursor,2);
console.log('PASS: opening tap flow, typing completion, both portraits, one-time fade and legacy save continuity.');
