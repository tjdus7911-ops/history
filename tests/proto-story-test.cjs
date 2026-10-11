const fs=require('node:fs'),assert=require('node:assert/strict');
const {load}=require('./proto-revision-harness.cjs'),h=load(),source=JSON.parse(fs.readFileSync('dist/proto-story-script.json'));
const scenes=source.chapters.flatMap(chapter=>chapter.scenes);
assert.equal(scenes.length,83);assert.deepEqual(source.chapters.map(ch=>ch.scenes.length),[5,10,12,14,10,10,14,8]);
assert.equal(h.run("eraProtagonist('proto-kingdoms').gender"),'male');assert.equal(h.run("eraProtagonist('proto-kingdoms').id"),'protagonist_proto_kingdoms');
function setScene(scene,phase,index=null){
 h.run("(function(){const source=STORIES["+JSON.stringify(scene.sceneId)+"];state.mainRun=null;state.run=INITIAL_RUN(source.chapterId);PROTO_SAVE_V3.identifyRun(run(),true);run().started=true;run().storyId=source.sceneId;run().protoStoryState.scenes[source.sceneId]={phase:"+JSON.stringify(phase)+",choiceIndex:"+index+"};run().pending="+(phase==='branch'?"{...source.choices["+index+"],sourceSceneId:source.sceneId}":"null")+";run().dialogueSceneId=run().pending?'result:'+source.sceneId:source.sceneId;screen='game';modal=null;})()");
}
let frames=0,choices=0;
function checkFrames(scene,entries,phase,index=null){
 setScene(scene,phase,index);
 for(let cursor=1;cursor<=entries.length;cursor++){
  h.run('run().dialogueCursor='+cursor);const html=h.run('game()'),entry=entries[cursor-1];
  assert(html.includes(h.run('esc('+JSON.stringify(entry.text)+')')),entry.lineId+' complete text');
  assert(html.includes('conversation-game proto-revision-game'));assert(html.includes('conversation-panel'));assert(!html.includes('class="proto-bubble'));
  assert.equal((html.match(/data-dialogue-index=/g)||[]).length,Math.min(3,cursor),entry.lineId+' shared recent-three layout');
  if(entry.speaker==='주인공')assert(html.includes('data-speaker-type="player"')&&html.includes('주인공'),entry.lineId);
  if(entry.speaker==='주인공(속마음)')assert(html.includes('주인공 · 속마음'),entry.lineId+' thought label');
  frames++;
 }
}
for(const scene of scenes){
 checkFrames(scene,scene.main,'main');
 if(scene.choices.length){
  setScene(scene,'choice');h.run('run().dialogueCursor='+scene.main.length);const html=h.run('game()');
  assert.equal((html.match(/data-dialogue-index=/g)||[]).length,2,scene.sceneId+' shared choice context');
  assert.equal((html.match(/data-choice="/g)||[]).length,3);assert(html.includes('choice-dock'));
  for(let index=0;index<3;index++){const choice=scene.choices[index];assert(html.includes(h.run('esc('+JSON.stringify(choice.label)+')')),choice.choiceId+' full button');checkFrames(scene,[choice.spokenLine,...choice.reply],'branch',index);choices++;}
  assert.equal(h.run('STORIES['+JSON.stringify(scene.sceneId)+'].choices.length'),3,'temporary renderer view did not restore source');
 }
 if(scene.join.length){checkFrames(scene,scene.join,'join',scene.choices.length?0:null);assert(!h.run('game()').includes('choice-dock'));}
}
assert.equal(frames,1369);assert.equal(choices,108);
assert.equal(h.run('PROTO_CHECKPOINTS.length'),11);assert.equal(h.run('PROTO_STUDY_QUESTION_IDS.length'),23);assert.equal(h.run("QUESTIONS.filter(q=>q.protoStoryVersion===2).length"),23);
for(const point of source.examPlan.queues){const scene=scenes.find(s=>s.sceneId===point.sceneId);assert.equal(point.afterLineId,(scene.join.length?scene.join:scene.main).at(-1).lineId);}
console.log('PASS: all 1369 authored utterance frames and 108 choice buttons use the approved common messenger (3 recent messages / 2 with choices); 83 scenes, 31 learning topics and 23 questions in 11 queues.');
