const fs=require('fs'),vm=require('vm'),assert=require('assert');
let saved=null,html='',handlers={},context;
const choiceIndex=Number(process.argv.find(a=>a.startsWith('--choice='))?.split('=')[1]||0),allWrong=process.argv.includes('--wrong'),editorial=process.argv.includes('--editorial');
const data=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(n=>!['editorial-ui.js','app.js','v2-app.js','pwa.js'].includes(n)).map(n=>fs.readFileSync('dist/'+n,'utf8')).join('\n'),app=fs.readFileSync('dist/app.js','utf8')+'\n'+fs.readFileSync('dist/v2-app.js','utf8');
function boot(){handlers={};const root={set innerHTML(value){html=value},get innerHTML(){return html}};const document={querySelector:selector=>selector==='#app'?root:null,querySelectorAll:()=>[],addEventListener:(name,handler,capture)=>{(handlers[name]||(handlers[name]=[])).push({handler,capture})},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}};context=vm.createContext({document,localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},Date});vm.runInContext(data+app+(editorial?'\n'+fs.readFileSync('dist/editorial-ui.js','utf8'):''),context)}
const click=dataset=>{vm.runInContext('inputLockedUntil=0',context);let stopped=false;for(const {handler}of handlers.click.slice().sort((a,b)=>Number(Boolean(b.capture))-Number(Boolean(a.capture)))){handler({target:{closest:()=>({dataset,disabled:false})},stopImmediatePropagation(){stopped=true}});if(stopped)break}},action=value=>click({action:value}),current=()=>JSON.parse(saved);
function answer(value){if(!editorial)return click({answer:String(value)});const before=JSON.stringify(current().meta.questionRecords);click({pickAnswer:String(value)});assert.equal(JSON.stringify(current().meta.questionRecords),before,'selection must not grade');assert.equal(current().run.questionAnswer,null);assert(!html.includes('class="feedback"'));click({submitAnswer:'true'});}
boot();action('play');
const questionLog=[];const completed=[];let guard=0,reloaded=false,sawPractice=false,sawOfficial=false;
while(completed.length<12){
  assert(++guard<7000,`UI guard ${JSON.stringify({screen:vm.runInContext('screen',context),run:current().run})}`);const screen=vm.runInContext('screen',context),run=current().run;
  if(screen==='game'){
    const length=vm.runInContext("conversationEntries(run().pending?STORIES[run().pending.sourceSceneId]:STORIES[run().storyId],run().pending).length",context);
    if(run.dialogueCursor<length){action('advance-dialogue');continue}
    if(run.pending){action('result-next');continue}
    const hasChoices=vm.runInContext('Boolean(STORIES[run().storyId].choices?.length)',context);if(hasChoices){const count=vm.runInContext('STORIES[run().storyId].choices.length',context);click({choice:String(choiceIndex%count)});continue}action('next');continue;
  }
  if(screen==='quiz'){
    const q=vm.runInContext('QUESTIONS.find(q=>q.questionId===run().activeQuestionId)',context);questionLog.push({chapter:run.currentChapter,scene:run.questionSequence?.sourceStoryId||q.relatedSceneId,questionId:q.questionId,official:q.isOfficial===true,image:q.sourceQuestionImage||null});if(q.isOfficial){assert(q.sourceVerified&&q.sourceQuestionImage);assert(html.includes(q.sourceQuestionImage));assert(html.includes(`[실제 기출] 제${q.examRound}회 한국사능력검정시험 · ${q.examLevel} · ${q.questionNumber}번`));sawOfficial=true}else{assert(!html.includes('[실제 기출] 제'));sawPractice=true}answer(allWrong?(q.answer+1)%q.choices.length:q.answer);assert(html.includes('역사 해설'));action('quiz-next');
    if(!reloaded&&run.currentChapter==='ch06'){reloaded=true;boot();action('play')}
    continue;
  }
  if(screen==='complete'){
    completed.push(run.currentChapter);assert(html.includes('CHAPTER')||html.includes('완료')||html.includes('CLEAR'));if(run.currentChapter==='ch12')break;click({nav:'teaser'});assert(vm.runInContext('screen',context)==='teaser');click({action:'start-chapter',chapter:`ch${String(Number(run.currentChapter.slice(2))+1).padStart(2,'0')}`});continue;
  }
  throw Error(`unexpected screen ${screen}`);
}
assert.deepEqual(completed,Array.from({length:12},(_,i)=>'ch'+String(i+1).padStart(2,'0')));assert(sawPractice&&sawOfficial&&reloaded);assert.equal(current().run.characterStates.player.characterAge,23);assert.equal(current().run.characterStates.doyun.isAlive,false);
vm.runInContext("screen='teaser';render()",context);assert(html.includes('고려의 끝, 조선의 시작'));
vm.runInContext("beginReplay(state,'ch08');save();screen='game';enterStory();render()",context);assert.equal(current().run.mode,'replay');assert.equal(current().run.currentChapter,'ch08');assert(current().meta.completedChapters.includes('ch12'));
vm.runInContext("const sample=STORIES.ch05_seohui.dialogues.find(line=>line.characterId==='seohui');this.samplePortrait=stagePortrait(sample,'left',true);this.doyunProfile=characterRenderProfile({characterId:'doyun'},'doyun_935');this.ch08Duo=characterStage(STORIES.ch08_revolt.dialogues,STORIES.ch08_revolt,false,null,'late-war');",context);
assert(context.samplePortrait.includes('data-character-tier="MAIN"'));assert.equal(context.doyunProfile.scale,1.35);assert.equal(context.doyunProfile.anchorY,32);
assert(context.ch08Duo.includes('data-character-id="seon"')&&context.ch08Duo.includes('data-character-id="player"'));assert(context.ch08Duo.includes('data-position="left"')&&context.ch08Duo.includes('data-position="right"'));
for(const source of vm.runInContext('V2_NEW_EXAM_SOURCES',context))assert(questionLog.some(q=>q.questionId===source.questionId),'New official question not encountered: '+source.questionId);fs.writeFileSync('docs/'+(editorial?'EDITORIAL':'V2')+'_PLAY_QUESTION_LOG_'+choiceIndex+(allWrong?'_wrong':'')+'.json',JSON.stringify(questionLog,null,2));console.log('PASS: '+(editorial?'Editorial selection/confirmation + ':'')+'V2 CH.01–12 UI full play, 3-question queues, explanation return, reload, unlock, ending teaser, replay preservation, and render-tier output.');
