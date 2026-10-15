const fs=require('node:fs'),assert=require('node:assert/strict');
const {load}=require('./proto-revision-harness.cjs');
const h=load(),source=JSON.parse(fs.readFileSync('dist/proto-story-script.json'));
const scenes=source.chapters.flatMap(chapter=>chapter.scenes),allIds=new Set();
assert.equal(scenes.length,5);assert.deepEqual(source.chapters.map(ch=>ch.chapterNumber),[2,3,4,5,6]);
assert.equal(source.learning.length,31);assert.equal(source.examPlan.questions.length,15);
let utterances=0;
for(const scene of scenes){
 const installed=h.copy('STORIES['+JSON.stringify(scene.sceneId)+']');
 assert.equal(installed.title,scene.title);assert.equal(installed.location,scene.location);assert.equal(installed.protoCountry,scene.country);assert.equal(installed.protoPlace,scene.place);
 const lines=[...scene.main,...scene.join];utterances+=lines.length;
 for(const line of lines){assert(!allIds.has(line.lineId),line.lineId+' unique');allIds.add(line.lineId);assert(Array.isArray(line.learningKeywordIds),line.lineId+' keyword metadata');}
 assert(lines.filter(line=>line.learningKeywordIds.length).length>0,scene.country+' has tagged history dialogue');
 assert.deepEqual(installed.dialogues.map(line=>line.lineId),scene.main.map(line=>line.lineId));
 assert.deepEqual(installed.protoCommon.map(line=>line.lineId),scene.join.map(line=>line.lineId));
 h.run('(function(){state.mainRun=null;state.run=INITIAL_RUN('+JSON.stringify(installed.chapterId)+');PROTO_SAVE_V3.identifyRun(run(),true);run().storyId='+JSON.stringify(scene.sceneId)+';run().dialogueSceneId='+JSON.stringify(scene.sceneId)+';run().dialogueCursor=1;run().protoStoryState.scenes['+JSON.stringify(scene.sceneId)+']={phase:"main",choiceIndex:null};screen="game";modal=null;})()');
 let html=h.run('game()');assert(html.includes(scene.country));assert(html.includes(scene.place));assert(html.includes('data-proto-country="'+scene.country+'"'));
 assert(!html.includes('이번 장면에서 배운 것'),'the recap waits until the final join line');
 h.run('(function(){run().protoStoryState.scenes['+JSON.stringify(scene.sceneId)+'].phase="join";run().dialogueCursor='+scene.join.length+';return game()})()');
 html=h.run('game()');assert(html.includes('이번 장면에서 배운 것'));for(const item of scene.learning)assert(html.includes(item.keyword||item.title),scene.country+' recap '+item.id);
 assert.equal(scene.quizAfter.officialQuestionIds.length,3);assert.equal(scene.quizAfter.afterLineId,lines.at(-1).lineId);
}
assert.equal(utterances,50);assert.equal(h.run('PROTO_CHECKPOINTS.length'),5);assert.equal(h.run('PROTO_STUDY_QUESTION_IDS.length'),15);
assert.equal(h.run("QUESTIONS.filter(q=>q.protoStoryVersion===2).length"),23,'old Proto question catalog remains available as legacy data');
assert.equal(h.run("chapterOrder('proto-kingdoms').length"),5,'only the five current chapters appear in the story list');
assert.equal(h.run("Object.values(STORIES).filter(s=>s.eraId==='proto-kingdoms'&&s.storyActive!==false).length"),5);
console.log('PASS: five compact country scenes, 31 linked topics, 15 queued official questions, country/place labels and end-of-scene recaps.');
