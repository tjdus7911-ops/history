const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync('dist/data.js','utf8')+'\n'+fs.readFileSync('dist/ch02-data.js','utf8');
const ctx=vm.createContext({Date});
vm.runInContext(code+';this.api={SAVE_VERSION,CHAPTERS,STORIES,QUESTIONS,ASSETS,EXPRESSIONS,PORTRAITS,CHARACTERS,INITIAL,INITIAL_RUN,applyChoice,applySceneEntry,choiceAvailable,recordQuestion,finishChapter,resetRun,startChapter,restartChapter,migrateSave};',ctx);
const{SAVE_VERSION,CHAPTERS,STORIES,QUESTIONS,ASSETS,EXPRESSIONS,PORTRAITS,INITIAL,applyChoice,applySceneEntry,choiceAvailable,recordQuestion,finishChapter,startChapter,restartChapter,migrateSave}=ctx.api;
assert.equal(SAVE_VERSION,5);
assert.equal(Object.keys(CHAPTERS).length,2);
assert.equal(QUESTIONS.filter(q=>q.chapterId==='ch01').length,6,'CH.01 must retain six tests');
assert.equal(QUESTIONS.filter(q=>q.chapterId==='ch02').length,5,'CH.02 must have five distributed tests');
const requiredQuestionFields=['questionId','chapterId','relatedSceneId','relatedHistoricalEventId','relatedIllustrationId','questionType','difficulty','passage','question','choices','answer','explanation','examKeywords','userAnswer','isCorrect','isOfficial','source','examRound','examYear','questionNumber'];
for(const q of QUESTIONS){
  for(const field of requiredQuestionFields)assert(Object.prototype.hasOwnProperty.call(q,field),`${q.questionId}: missing ${field}`);
  assert(q.answer>=0&&q.answer<q.choices.length,`${q.questionId}: invalid answer`);
  assert.equal(q.isOfficial,false,`${q.questionId}: copied official content is not allowed`);
  assert(STORIES[q.relatedSceneId],`${q.questionId}: missing related scene`);
  assert(ASSETS[q.relatedIllustrationId],`${q.questionId}: missing related illustration`);
  assert(STORIES[q.resumeStoryId],`${q.questionId}: missing resume scene`);
}
for(const[id,s]of Object.entries(STORIES)){
  assert.equal(s.sceneId,id,`${id}: sceneId mismatch`);assert(ASSETS[s.illustrationId],`${id}: missing illustration`);
  if(s.nextStoryId)assert(STORIES[s.nextStoryId],`${id}: missing next scene ${s.nextStoryId}`);
  if(s.quizId)assert(QUESTIONS.some(q=>q.questionId===s.quizId),`${id}: missing quiz ${s.quizId}`);
  assert(Array.isArray(s.dialogues)&&s.dialogues.length,`${id}: structured dialogues required`);
  for(const line of s.dialogues){
    for(const field of ['characterId','characterName','speakerType','portrait','expression','dialogue','alignment'])assert(Object.prototype.hasOwnProperty.call(line,field),`${id}: dialogue missing ${field}`);
    assert(['player','npc','thought','narration'].includes(line.speakerType),`${id}: unsupported speaker type`);assert(EXPRESSIONS.includes(line.expression),`${id}: unsupported expression ${line.expression}`);
    assert.equal(line.alignment,line.speakerType==='player'?'right':line.speakerType==='npc'?'left':'center',`${id}: alignment must derive from speakerType`);
    if(['player','npc'].includes(line.speakerType))assert(PORTRAITS[line.portrait],`${id}: missing portrait ${line.portrait}`);
  }
  for(const c of s.choices||[]){assert(STORIES[c.nextStoryId],`${id}: missing choice destination`);assert(c.resultSceneId&&ASSETS[c.resultIllustrationId],`${id}: result scene/illustration required`);assert(Array.isArray(c.resultDialogues)&&c.resultDialogues.length>=2,`${id}: player response and reaction required`);assert.equal(c.resultDialogues[0].speakerType,'player');}
}
assert.deepEqual(STORIES.status.dialogues.map(x=>x.speakerType),['npc','player','npc','player','thought']);
assert.equal(STORIES.voice.sceneEffect,'blackout');assert.equal(STORIES.voice.autoAdvanceDelays.length,4);assert.equal(STORIES.voice.dialogues.length,5);
assert.equal(STORIES.outfit_question.choices.length,4);assert(STORIES.outfit_gift.enterFlags.receivedGoryeoClothesFromDoyun);
assert.equal(STORIES.life_choice.choices.length,4);assert.equal(STORIES.ch02_market.choices.length,4);assert.equal(STORIES.ch02_life_path.choices.length,3);assert.equal(STORIES.ch02_trust.choices.length,3);assert(STORIES.ch02_trust.choices.every(c=>c.importantChoice));assert.equal(STORIES.ch02_policy_reason.choices[0].memoryKey,'ch02-nobi-purpose');assert(STORIES.ch02_exam_notice.dialogues.some(x=>x.characterId==='hyunwoo'));assert(STORIES.ch02_three_way.dialogues.some(x=>x.characterId==='doyun'));assert(STORIES.ch02_reflection.mysteryKey==='unknown-aging');assert(STORIES.ch02_purge.dialogues.some(x=>x.speakerType==='thought'));
for(const[id,asset]of Object.entries(ASSETS))if(asset.src)assert(fs.existsSync('dist/'+asset.src),`${id}: missing generated scene file ${asset.src}`);
for(const expression of ['neutral','smile','surprised','worried','thinking','serious','embarrassed','angry','sad'])assert(fs.existsSync('dist/'+PORTRAITS[`player_${expression}`].src));
for(const expression of ['neutral','smile','surprised','worried','thinking','serious','embarrassed'])assert(fs.existsSync('dist/'+PORTRAITS[`player_goryeo_${expression}`].src));
for(const expression of ['neutral','smile','surprised','suspicious','serious','worried'])assert(fs.existsSync('dist/'+PORTRAITS[`doyun_${expression}`].src));
for(const expression of ['neutral','worried','smile']){const p=PORTRAITS[`hyunwoo_${expression}`];assert.equal(p.status,'ready');assert(fs.existsSync('dist/'+p.src));}

function walk(startId,state,endId){let paths=0;const tests=new Set(),branches=new Set(),choices=new Set();
  function visit(id,copy,stack=[]){assert(!stack.includes(id),`cycle: ${[...stack,id].join(' -> ')}`);if(id===endId){paths++;return}const s=STORIES[id];assert(s,`missing scene ${id}`);applySceneEntry(copy,id);
    if(s.quizId){const q=QUESTIONS.find(x=>x.questionId===s.quizId);tests.add(q.questionId);recordQuestion(copy,q.questionId,q.answer);copy.run.activeQuestionId=null;copy.run.questionAnswer=null;return visit(q.resumeStoryId,copy,[...stack,id])}
    if(s.choices){branches.add(id);s.choices.forEach((c,i)=>{choices.add(`${id}:${i}`);const next=JSON.parse(JSON.stringify(copy));if(!choiceAvailable(next.run,c))return;applyChoice(next,id,i);next.run.pending=null;visit(next.run.storyId,next,[...stack,id])});return}
    assert(s.nextStoryId,`${id}: dead end`);visit(s.nextStoryId,copy,[...stack,id]);
  }visit(startId,state);return{paths,tests,branches,choices};}
const ch1=INITIAL();ch1.run.started=true;const ch1Coverage=walk('prologue',ch1,'complete');assert(ch1Coverage.paths>=20);assert.equal(ch1Coverage.tests.size,6);
const carry=INITIAL();carry.run.started=true;carry.run.stats={health:83,knowledge:9,fame:7,wealth:22};carry.run.relations.doyun=17;carry.run.job='상단 장부 보조';finishChapter(carry);
assert(carry.meta.completedChapters.includes('ch01'));assert(carry.meta.chapterRecords.ch01);assert(startChapter(carry,'ch02'));assert.equal(carry.run.storyId,'ch02_transition');assert.equal(carry.run.stats.wealth,22);assert.equal(carry.run.job,'상단 장부 보조');assert.equal(carry.run.relations.doyun,17);
const ch2Coverage=walk('ch02_transition',JSON.parse(JSON.stringify(carry)),'ch02_complete');assert.equal(ch2Coverage.paths,324);assert.equal(ch2Coverage.tests.size,5);assert.equal(ch2Coverage.branches.size,5);assert.equal(ch2Coverage.choices.size,16);
applyChoice(carry,'ch02_market',0);carry.run.pending=null;carry.run.stats.wealth=99;restartChapter(carry);assert.equal(carry.run.currentChapter,'ch02');assert.equal(carry.run.storyId,'ch02_transition');assert.equal(carry.run.stats.wealth,22);assert.equal(carry.run.job,'상단 장부 보조');assert(carry.meta.completedChapters.includes('ch01'));
recordQuestion(carry,'ch02-test-01',QUESTIONS.find(q=>q.questionId==='ch02-test-01').answer);carry.run.storyId='ch02_complete';finishChapter(carry);assert(carry.meta.completedChapters.includes('ch02'));assert(carry.meta.chapterRecords.ch02);assert(carry.meta.cards.includes('gwangjong-authority'));assert(carry.meta.people.includes('쌍기'));
const legacy=INITIAL();legacy.version=3;legacy.run.started=true;legacy.run.completed=true;legacy.run.storyId='complete';legacy.run.stats.wealth=30;legacy.meta.cards.push('legacy-card');delete legacy.run.currentChapter;delete legacy.meta.completedChapters;delete legacy.meta.chapterRecords;
const migrated=migrateSave(legacy);assert.equal(migrated.version,5);assert(migrated.meta.completedChapters.includes('ch01'));assert(migrated.meta.chapterRecords.ch01);assert.equal(migrated.run.stats.wealth,30);assert.equal(migrated.run.flags.wearingModernClothes,false);assert(migrated.run.flags.hasModernClothes);
const midChapter=INITIAL();midChapter.version=4;midChapter.run.started=true;midChapter.run.storyId='village';const migratedMid=migrateSave(midChapter);assert.equal(migratedMid.run.flags.wearingModernClothes,false);assert(migratedMid.run.inventory.some(item=>item.id==='modern-clothes'&&item.status==='stored'));assert(migratedMid.run.inventory.some(item=>item.id==='goryeo-commoner-clothes'&&item.status==='equipped'));
const pendingHouse=INITIAL();pendingHouse.version=4;pendingHouse.run.started=true;pendingHouse.run.storyId='village';pendingHouse.run.pending={sourceSceneId:'house',nextStoryId:'village'};const migratedPending=migrateSave(pendingHouse);assert.equal(migratedPending.run.storyId,'outfit_question');assert.equal(migratedPending.run.pending.nextStoryId,'outfit_question');assert.equal(migratedPending.run.flags.wearingModernClothes,true);
const manifest=fs.readFileSync('docs/CHARACTER_ASSET_REQUIRED.md','utf8');for(const id of Object.keys(PORTRAITS))assert(manifest.includes('`'+id+'`'),`portrait manifest missing ${id}`);
console.log(JSON.stringify({scenes:Object.keys(STORIES).length,ch01Scenes:Object.values(STORIES).filter(s=>s.chapterId==='ch01').length,ch02Scenes:Object.values(STORIES).filter(s=>s.chapterId==='ch02').length,questions:QUESTIONS.length,ch02Paths:ch2Coverage.paths,ch02Choices:ch2Coverage.choices.size,status:'PASS'}));
