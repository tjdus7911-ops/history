const fs=require('fs'),vm=require('vm'),assert=require('assert');
let saved=null,html='',handlers={},context;
const data=['data','ch02-data','ch03-data','exam-data','ch01-expansion','chapter-split','late-goryeo','official-late-exams'].map(file=>fs.readFileSync(`dist/${file}.js`,'utf8')).join('\n'),app=fs.readFileSync('dist/app.js','utf8');
function boot(){handlers={};const root={set innerHTML(value){html=value},get innerHTML(){return html}};const document={querySelector:selector=>selector==='#app'?root:null,querySelectorAll:()=>[],addEventListener:(name,handler)=>handlers[name]=handler,createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}};context=vm.createContext({document,localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},Date});vm.runInContext(data+app,context)}
const click=dataset=>{vm.runInContext('inputLockedUntil=0',context);handlers.click({target:{closest:()=>({dataset,disabled:false})}})},action=value=>click({action:value}),answer=value=>click({answer:String(value)}),current=()=>JSON.parse(saved);
boot();vm.runInContext("state.meta.completedChapters=['ch01','ch02','ch03','ch04'];state.run=INITIAL_RUN('ch04');state.run.started=true;state.run.completed=true;state.run.characterStates.doyun.isAlive=false;save();render();startAvailableChapter('ch05');",context);
const completed=[];let guard=0,reloaded=false,sawPractice=false,sawOfficial=false;
while(completed.length<8){
  assert(++guard<2500,`UI guard ${JSON.stringify({screen:vm.runInContext('screen',context),run:current().run})}`);const screen=vm.runInContext('screen',context),run=current().run;
  if(screen==='game'){
    const length=vm.runInContext("conversationEntries(run().pending?STORIES[run().pending.sourceSceneId]:STORIES[run().storyId],run().pending).length",context);
    if(run.dialogueCursor<length){action('advance-dialogue');continue}
    if(run.pending){action('result-next');continue}
    const hasChoices=vm.runInContext('Boolean(STORIES[run().storyId].choices?.length)',context);if(hasChoices){click({choice:'0'});continue}action('next');continue;
  }
  if(screen==='quiz'){
    const q=vm.runInContext('QUESTIONS.find(q=>q.questionId===run().activeQuestionId)',context);if(q.isOfficial){assert(html.includes(`기출 · 제${q.examRound}회 ${q.examLevel} ${q.questionNumber}번`));sawOfficial=true}else{assert(html.includes('한능검 대비 연습문제'));sawPractice=true}answer(q.answer);assert(html.includes('역사 해설'));action('quiz-next');
    if(!reloaded&&run.currentChapter==='ch06'){reloaded=true;boot();action('play')}
    continue;
  }
  if(screen==='complete'){
    completed.push(run.currentChapter);assert(html.includes('실제 기출')&&html.includes('연습문제'));if(run.currentChapter==='ch12')break;click({nav:'teaser'});assert(html.includes('· NEXT'));click({action:'start-chapter',chapter:`ch${String(Number(run.currentChapter.slice(2))+1).padStart(2,'0')}`});continue;
  }
  throw Error(`unexpected screen ${screen}`);
}
assert.deepEqual(completed,['ch05','ch06','ch07','ch08','ch09','ch10','ch11','ch12']);assert(sawPractice&&sawOfficial&&reloaded);assert.equal(current().run.characterStates.player.characterAge,23);assert.equal(current().run.characterStates.doyun.isAlive,false);
vm.runInContext("screen='teaser';render()",context);assert(html.includes('고려의 끝, 조선의 시작'));
vm.runInContext("beginReplay(state,'ch08');save();screen='game';enterStory();render()",context);assert.equal(current().run.mode,'replay');assert.equal(current().run.currentChapter,'ch08');assert(current().meta.completedChapters.includes('ch12'));
vm.runInContext("const sample=STORIES.ch05_seohui.dialogues.find(line=>line.characterId==='seohui');this.samplePortrait=stagePortrait(sample,'left',true);this.doyunProfile=characterRenderProfile({characterId:'doyun'},'doyun_935');this.ch08Duo=characterStage(STORIES.ch08_revolt.dialogues,STORIES.ch08_revolt,false,null,'late-war');",context);
assert(context.samplePortrait.includes('data-character-tier="MAIN"'));assert.equal(context.doyunProfile.scale,1.35);assert.equal(context.doyunProfile.anchorY,32);
assert(context.ch08Duo.includes('data-character-id="seon"')&&context.ch08Duo.includes('data-character-id="player"'));assert(context.ch08Duo.includes('data-position="left"')&&context.ch08Duo.includes('data-position="right"'));
console.log('PASS: CH.05–12 UI full play, 3-question queues, explanation return, reload, unlock, ending teaser, replay preservation, and render-tier output.');
