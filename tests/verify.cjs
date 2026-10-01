const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync('dist/data.js','utf8'),ctx=vm.createContext({Date});
vm.runInContext(code+';this.api={SAVE_VERSION,STORIES,QUESTIONS,ASSETS,EXPRESSIONS,PORTRAITS,CHARACTERS,INITIAL,INITIAL_RUN,applyChoice,choiceAvailable,recordQuestion,finishChapter,resetRun,migrateSave};',ctx);
const{SAVE_VERSION,STORIES,QUESTIONS,ASSETS,EXPRESSIONS,PORTRAITS,CHARACTERS,INITIAL,applyChoice,choiceAvailable,recordQuestion,finishChapter,resetRun,migrateSave}=ctx.api;
assert.equal(SAVE_VERSION,3);
assert.equal(QUESTIONS.length,6,'CH.01 must have six distributed story tests');
const requiredQuestionFields=['questionId','chapterId','relatedSceneId','relatedHistoricalEventId','relatedIllustrationId','questionType','difficulty','passage','question','choices','answer','explanation','examKeywords','userAnswer','isCorrect','isOfficial','source','examRound','examYear','questionNumber'];
for(const q of QUESTIONS){
  for(const field of requiredQuestionFields)assert(Object.prototype.hasOwnProperty.call(q,field),`${q.questionId}: missing ${field}`);
  assert(q.answer>=0&&q.answer<q.choices.length,`${q.questionId}: invalid answer`);
  assert.equal(q.isOfficial,false,`${q.questionId}: official content must not be copied`);
  assert(STORIES[q.relatedSceneId],`${q.questionId}: missing related scene`);
  assert(ASSETS[q.relatedIllustrationId],`${q.questionId}: missing related illustration`);
  assert(STORIES[q.resumeStoryId],`${q.questionId}: missing resume scene`);
}
const choiceIllustrations=new Set();
for(const[id,s]of Object.entries(STORIES)){
  assert.equal(s.sceneId,id,`${id}: sceneId mismatch`);
  assert(ASSETS[s.illustrationId],`${id}: missing illustration`);
  for(const field of ['backgroundImage','characterImage','characterExpression','foregroundImage','sceneEffect','timeOfDay','music','ambientSound'])assert(Object.prototype.hasOwnProperty.call(s,field),`${id}: missing ${field}`);
  if(s.nextStoryId)assert(STORIES[s.nextStoryId],`${id}: missing next scene ${s.nextStoryId}`);
  if(s.quizId)assert(QUESTIONS.some(q=>q.questionId===s.quizId),`${id}: missing quiz ${s.quizId}`);
  assert(Array.isArray(s.dialogues)&&s.dialogues.length,`${id}: structured dialogues required`);
  for(const line of s.dialogues){
    for(const field of ['characterId','characterName','speakerType','portrait','expression','dialogue','alignment'])assert(Object.prototype.hasOwnProperty.call(line,field),`${id}: dialogue missing ${field}`);
    assert(['player','npc','thought','narration'].includes(line.speakerType),`${id}: unsupported speakerType ${line.speakerType}`);
    assert(EXPRESSIONS.includes(line.expression),`${id}: unsupported expression ${line.expression}`);
    assert.equal(line.alignment,line.speakerType==='player'?'right':line.speakerType==='npc'?'left':'center',`${id}: alignment must derive from speakerType`);
    if(['player','npc'].includes(line.speakerType))assert(PORTRAITS[line.portrait],`${id}: missing portrait ${line.portrait}`);
  }
  for(const c of s.choices||[]){
    assert(STORIES[c.nextStoryId],`${id}: missing choice destination ${c.nextStoryId}`);
    assert(c.resultSceneId,`${id}: missing resultSceneId`);
    assert(ASSETS[c.resultIllustrationId],`${id}: missing result illustration ${c.resultIllustrationId}`);
    assert(Array.isArray(c.resultDialogues)&&c.resultDialogues.length>=2,`${id}: choice result dialogue sequence required`);
    assert.equal(c.resultDialogues[0].speakerType,'player',`${id}: selected choice must appear as player dialogue first`);
    choiceIllustrations.add(c.resultIllustrationId);
  }
}
assert.equal(new Set(STORIES.thief.choices.map(c=>c.resultIllustrationId)).size,4,'thief outcomes need four distinct illustrations');
assert(STORIES.thief.choices[2].condition.flag==='observation','alley route must be unlocked by observation');
assert(STORIES.life_choice.choices[3].condition.stat==='knowledge','Wang Geon route must require knowledge');
assert.deepEqual(STORIES.status.dialogues.map(x=>x.speakerType),['npc','player','npc','player','thought'],'status scene must alternate NPC/player and end with thought');
assert.deepEqual(STORIES.status.dialogues.map(x=>x.expression),['neutral','embarrassed','surprised','embarrassed','worried'],'status scene expression changes must be data-driven');
assert.equal(STORIES.life_choice.choices[2].resultDialogues[1].characterId,'doyun','life choice must support NPC reaction after player response');

let completePaths=0,storyTests=new Set(),routes=new Set(),jobs=new Set();
function walk(id,state,stack=[]){
  assert(!stack.includes(id),`cycle: ${[...stack,id].join(' -> ')}`);
  if(id==='complete'){completePaths++;routes.add(state.run.route);jobs.add(state.run.job);return}
  const s=STORIES[id];assert(s,`missing scene ${id}`);
  if(s.quizId){const q=QUESTIONS.find(x=>x.questionId===s.quizId);storyTests.add(q.questionId);recordQuestion(state,q.questionId,q.answer);state.run.activeQuestionId=null;state.run.questionAnswer=null;return walk(q.resumeStoryId,state,[...stack,id])}
  if(s.choices){
    s.choices.forEach((c,i)=>{
      const copy=JSON.parse(JSON.stringify(state));
      if(!choiceAvailable(copy.run,c))return;
      applyChoice(copy,id,i);copy.run.pending=null;
      walk(copy.run.storyId,copy,[...stack,id]);
    });
    return;
  }
  assert(s.nextStoryId,`${id}: dead end`);
  walk(s.nextStoryId,state,[...stack,id]);
}
const initial=INITIAL();initial.run.started=true;walk('prologue',initial);
assert(completePaths>=20,'expected substantial branching coverage');
assert.equal(storyTests.size,6,'all story tests must be reachable');
assert(routes.has('songak')&&routes.has('village')&&routes.has('merchant')&&routes.has('royal'),'all four life routes must be reachable');
assert(jobs.has('상단 일꾼')&&jobs.has('마을 일꾼'),'route jobs must be applied');

const save=INITIAL();save.run.started=true;recordQuestion(save,'ch01-test-01',0);save.meta.cards.push('persistent-card');save.meta.people.push('persistent-person');finishChapter(save);
const kept=JSON.parse(JSON.stringify(save.meta));resetRun(save);
assert.deepEqual(save.meta,kept,'restart must preserve cumulative meta data');
assert.equal(save.run.storyId,'prologue');assert.equal(save.run.stats.wealth,0);assert.equal(save.run.choices.length,0);assert(!save.run.completed);
const migrated=migrateSave({version:1,started:true,storyId:'prologue',completed:false,stats:{health:80,knowledge:10,fame:2,wealth:30},relations:{merchant:4},job:'상인',answers:{q918:true},wrong:['q919'],reviewed:[],cards:['goryeo-918'],choices:[],visited:['prologue'],peakWealth:30});
assert.equal(migrated.version,3);assert.equal(migrated.run.stats.wealth,30);assert(migrated.meta.cards.includes('goryeo-918'));assert(migrated.meta.wrongQuestionIds.includes('q919'));
const oldV2=INITIAL();oldV2.version=2;oldV2.run.storyId='status';oldV2.run.stats.wealth=17;oldV2.meta.cards.push('v2-card');delete oldV2.run.dialogueSceneId;delete oldV2.run.dialogueCursor;
const upgraded=migrateSave(oldV2);assert.equal(upgraded.version,3);assert.equal(upgraded.run.storyId,'status');assert.equal(upgraded.run.stats.wealth,17);assert(upgraded.meta.cards.includes('v2-card'));assert.equal(upgraded.run.dialogueCursor,1);

const manifest=fs.readFileSync('docs/ASSET_REQUIRED.md','utf8');
const requiredAssets=Object.entries(ASSETS).filter(([,a])=>a.status==='ASSET_REQUIRED').map(([id])=>id);
for(const id of requiredAssets)assert(manifest.includes('`'+id+'`'),`asset manifest missing ${id}`);
const portraitManifest=fs.readFileSync('docs/CHARACTER_ASSET_REQUIRED.md','utf8');
for(const[id,asset]of Object.entries(PORTRAITS)){assert(CHARACTERS[asset.characterId],`portrait ${id}: unknown character`);assert(EXPRESSIONS.includes(asset.expression),`portrait ${id}: invalid expression`);assert(portraitManifest.includes('`'+id+'`'),`portrait manifest missing ${id}`)}
console.log(JSON.stringify({scenes:Object.keys(STORIES).length,questions:QUESTIONS.length,assetRequired:requiredAssets.length,portraitAssets:Object.keys(PORTRAITS).length,choiceResultIllustrations:choiceIllustrations.size,completePaths,routes:[...routes],status:'PASS'}));
