const fs=require('fs'),vm=require('vm'),assert=require('assert');

const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]).filter(file=>file!=='pwa.js');
let html='',saved=null,handlers={};
const context=vm.createContext({Date,console,document:{
  querySelector:selector=>selector==='#app'?{set innerHTML(value){html=value}}:null,
  querySelectorAll:()=>[],addEventListener:(type,handler)=>{(handlers[type]||=[]).push(handler)},
  createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}
},localStorage:{getItem:()=>saved,setItem:(key,value)=>{saved=value}},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){}});
vm.runInContext(scripts.map(file=>fs.readFileSync('dist/'+file,'utf8')).join('\n'),context);
const run=source=>vm.runInContext(source,context),copy=source=>JSON.parse(run('JSON.stringify('+source+')'));
const stateFor=(lines,cursor)=>copy(`joseonCharacterState(${lines},${cursor})`);
const npc=(id='minjun_j',text='말')=>`dialogueLine(${JSON.stringify(id)},'neutral',${JSON.stringify(text)},'npc')`;
const player=(type='player',text='답')=>`dialogueLine('joseon_player','thinking',${JSON.stringify(text)},${JSON.stringify(type)})`;
const narration=text=>`dialogueLine('narrator','neutral',${JSON.stringify(text)},'narration')`;
const ids=state=>state.cast.map(line=>line.characterId);

let lines=`[${npc()},${player()}]`;
let state=stateFor(lines,1);assert.deepEqual(ids(state),['minjun_j','joseon_player']);assert.equal(state.activeId,'minjun_j','NPC is active before player reply');
state=stateFor(lines,2);assert.deepEqual(ids(state),['minjun_j','joseon_player']);assert.equal(state.activeId,'joseon_player','player is active on reply');

lines=`[${player()},${npc()}]`;
state=stateFor(lines,1);assert.deepEqual(ids(state),['minjun_j','joseon_player']);assert.equal(state.activeId,'joseon_player','player-led exchange previews only the actual partner');
state=stateFor(lines,2);assert.deepEqual(ids(state),['minjun_j','joseon_player']);assert.equal(state.activeId,'minjun_j');

lines=`[${npc('minjun_j')},${npc('joseon_scholar')}]`;
state=stateFor(lines,2);assert.deepEqual(ids(state),['joseon_scholar'],'NPC B immediately replaces NPC A');

lines=`[${npc()},${player('thought')}]`;
state=stateFor(lines,2);assert.deepEqual(ids(state),['minjun_j','joseon_player']);assert.equal(state.activeId,'joseon_player','thought keeps active player and inactive partner');

lines=`[${player('thought')},${npc()}]`;
state=stateFor(lines,2);assert.deepEqual(ids(state),['minjun_j','joseon_player']);assert.equal(state.activeId,'minjun_j','NPC becomes active after a player thought');

lines=`[${narration('새 장소')},${player()}]`;
assert.deepEqual(ids(stateFor(lines,1)),[],'new-scene narration starts with an empty stage');
assert.deepEqual(ids(stateFor(lines,2)),['joseon_player'],'player-only scene does not summon an NPC');

lines=`[${npc()},${npc('minjun_j','계속')}]`;
assert.deepEqual(ids(stateFor(lines,1)),['minjun_j'],'NPC-only scene does not summon the player');
assert.deepEqual(ids(stateFor(lines,2)),['minjun_j'],'NPC-only continuation stays single-cast');

lines=`[${player()},${player('thought')}]`;
assert.deepEqual(ids(stateFor(lines,1)),['joseon_player']);assert.deepEqual(ids(stateFor(lines,2)),['joseon_player']);

lines=`[${npc()},${narration('같은 대화 중 설명')},${player()}]`;
state=stateFor(lines,2);assert.deepEqual(ids(state),['minjun_j','joseon_player']);assert.equal(state.activeId,null,'narration only preserves an existing exchange');

const scenes=copy("Object.values(STORIES).filter(story=>story.eraId==='joseon').map(story=>({sceneId:story.sceneId,dialogues:story.dialogues||[]}))");
const transitionCounts={};let auditedStates=0;
for(const scene of scenes){
  for(let i=1;i<scene.dialogues.length;i++){const key=scene.dialogues[i-1].speakerType+'→'+scene.dialogues[i].speakerType;transitionCounts[key]=(transitionCounts[key]||0)+1}
  for(let cursor=1;cursor<=scene.dialogues.length;cursor++){
    const actual=copy(`joseonCharacterState(STORIES[${JSON.stringify(scene.sceneId)}].dialogues,${cursor})`),npcIds=ids(actual).filter(id=>id!=='joseon_player');
    assert(npcIds.length<=1,`${scene.sceneId}:${cursor} must never overlap NPCs`);assert(new Set(ids(actual)).size===ids(actual).length,`${scene.sceneId}:${cursor} duplicate cast`);auditedStates++;
  }
}
for(const key of ['npc→player','player→npc','npc→narration','narration→player','player→thought'])assert(transitionCounts[key]>0,`missing Joseon transition coverage: ${key}`);

const set=copy("Object.values(QUESTION_SETS).find(item=>item.chapterId==='joseon-ch01')"),resumeId=set.resumeStoryId;
run(`state.run=INITIAL_RUN('joseon-ch01');state.run.started=true;state.run.storyId=${JSON.stringify(set.afterSceneId)};state.run.dialogueSceneId=${JSON.stringify(set.afterSceneId)};state.run.dialogueCursor=99;state.run.questionQueue=[${JSON.stringify(set.officialQuestionIds[0]||set.practiceQuestionIds[0])}];state.run.questionQueueIndex=0;state.run.questionQueueResumeStoryId=${JSON.stringify(resumeId)};state.run.activeQuestionId=state.run.questionQueue[0];state.run.questionAnswer=0;quizMode='story';screen='quiz';continueStoryQuestion()`);
assert.equal(run('run().storyId'),resumeId);assert.equal(run('run().dialogueSceneId'),resumeId);assert.equal(run('run().dialogueCursor'),1,'question resume recomputes from the resumed scene first line');

run('this.goryeoStage=characterStage(conversationEntries(STORIES.ch01_trade_start,null).slice(0,3),STORIES.ch01_trade_start,false,null,STORIES.ch01_trade_start.illustrationId)');
assert(run("goryeoStage.includes('data-character-id=\"doyun\"')")&&run("goryeoStage.includes('data-character-id=\"player\"')"),'Goryeo two-character stage remains intact');
assert(!run("goryeoStage.includes('joseon-conversation')"),'Goryeo does not enter the Joseon state renderer');

console.log(`PASS: Joseon character state ${auditedStates} states, ${Object.values(transitionCounts).reduce((a,b)=>a+b,0)} transitions, question resume and Goryeo regression`);
