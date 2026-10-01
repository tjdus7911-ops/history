const fs=require('fs'),vm=require('vm'),assert=require('assert');
let saved=null,html='',handlers={},context;
const data=fs.readFileSync('dist/data.js','utf8')+'\n'+fs.readFileSync('dist/ch02-data.js','utf8'),app=fs.readFileSync('dist/app.js','utf8');
function boot(){handlers={};const root={set innerHTML(s){html=s},get innerHTML(){return html}};const document={querySelector:s=>s==='#app'?root:null,querySelectorAll:()=>[],addEventListener:(e,f)=>handlers[e]=f,createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}};context=vm.createContext({document,localStorage:{getItem:()=>saved,setItem:(k,s)=>saved=s},window:{scrollTo(){}},navigator:{},setTimeout(){},Date});vm.runInContext(data+app,context)}
const click=dataset=>handlers.click({target:{closest:()=>({dataset,disabled:false})}}),action=x=>click({action:x}),nav=x=>click({nav:x}),selectChoice=i=>click({choice:String(i)}),answer=i=>click({answer:String(i)});
const current=()=>JSON.parse(saved),story=()=>current().run.storyId;
function reveal(){let n=0;while(html.includes('data-action="advance-dialogue"')){action('advance-dialogue');if(++n>15)throw Error('dialogue guard')}}
function next(){reveal();action('next')}function choose(i){reveal();selectChoice(i);reveal();action('result-next')}
function answerAndContinue(i){answer(i);assert(html.includes(i===vm.runInContext(`QUESTIONS.find(q=>q.questionId===run().activeQuestionId).answer`,context)?'기억이 선명해졌다':'기억이 흐릿하다'));action('quiz-next')}

boot();
vm.runInContext("state.run.started=true;state.run.stats={health:88,knowledge:11,fame:6,wealth:24};state.run.relations.doyun=19;state.run.job='상단 장부 보조';state.run.route='merchant';finishChapter(state);save();",context);
nav('teaser');assert(html.includes('CHAPTER 02 · UNLOCKED'));action('start-ch02');
assert.equal(current().run.currentChapter,'ch02');assert.equal(story(),'ch02_transition');assert.equal(current().run.stats.wealth,24);assert.equal(current().run.job,'상단 장부 보조');assert(html.includes('CH.02'));
next();assert.equal(story(),'ch02_market');reveal();assert(html.includes('data-speaker-type="npc"'));assert(html.includes('data-speaker-type="thought"'));choose(0);assert.equal(current().meta.knowledgeMemory['ch02-king-after-taejo'].answer,'광종');
assert.equal(story(),'ch02_dispute');reveal();assert(html.includes('message-row npc'));assert(vm.runInContext("STORIES.ch02_dispute.dialogues.some(line=>line.speakerType==='player'&&line.alignment==='right')",context));next();assert.equal(story(),'ch02_trust');choose(0);assert.equal(current().run.relations.citizens,5);
assert.equal(story(),'ch02_inspection');next();assert.equal(story(),'ch02_policy_reason');choose(0);assert(current().run.flags.understandsNobi);assert.equal(current().meta.knowledgeMemory['ch02-nobi-purpose'].correct,true);
assert.equal(story(),'ch02_policy_memory');next();assert.equal(current().run.activeQuestionId,'ch02-test-01');answerAndContinue(0);assert(current().meta.wrongQuestionIds.includes('ch02-test-01'));
assert.equal(story(),'ch02_noble_night');next();assert.equal(story(),'ch02_exam_notice');reveal();assert(html.includes('hyunwoo_neutral'));next();assert.equal(story(),'ch02_ssanggi');next();answerAndContinue(0);
assert.equal(story(),'ch02_exam_day');reveal();assert(html.includes('hyunwoo_worried'));choose(0);assert.equal(current().run.relations.hyunwoo,5);
assert.equal(story(),'ch02_reign_titles');next();answerAndContinue(1);assert.equal(story(),'ch02_reign_followup');next();answerAndContinue(4);assert.equal(story(),'ch02_purge');reveal();assert(html.includes('data-speaker-type="thought"'));action('next');answerAndContinue(0);
assert(current().run.completed);assert.equal(story(),'ch02_complete');assert(html.includes('CHAPTER 02 COMPLETE'));assert(html.includes('노비안검법'));assert(html.includes('과거제'));assert(html.includes('광덕 · 준풍'));assert(current().meta.completedChapters.includes('ch01'));assert(current().meta.completedChapters.includes('ch02'));
nav('teaser');assert(html.includes('CHAPTER 03 · NEXT'));assert(html.includes('시무 28조'));
nav('complete');action('restart');assert(html.includes('CH.02을 다시 시작할까요?'));assert(html.includes('CH.01에서 이어온 직업·스탯·관계는 유지'));action('confirm-restart');assert.equal(current().run.currentChapter,'ch02');assert.equal(story(),'ch02_transition');assert.equal(current().run.stats.wealth,24);assert.equal(current().run.job,'상단 장부 보조');assert.equal(current().run.relations.doyun,19);assert.equal(current().run.choices.length,0);assert(current().meta.completedChapters.includes('ch01'));
boot();action('play');assert.equal(current().run.currentChapter,'ch02');assert.equal(story(),'ch02_transition');
console.log('PASS: CH.02 carry-over, sequential dialogue, thought, four choice points, five story tests, wrong-note save, completion, CH.03 teaser, reload, and chapter-only restart.');
