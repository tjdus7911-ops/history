const assert=require('node:assert/strict');
const {load,step,until}=require('./proto-revision-harness.cjs');
function checkpoint(game,label){
 game.run('save()');const expected=game.copy('run()'),learned=game.copy('PROTO_REVISION_ACTIONS.book()'),storage=Object.fromEntries(game.storage),reloaded=load(storage);
 assert.deepEqual(reloaded.copy('run()'),expected,label+' run');assert.deepEqual(reloaded.copy('PROTO_REVISION_ACTIONS.book()'),learned,label+' book');
 assert.equal(reloaded.run('PROTO_SAVE_V3.validRun(run())'),true,label+' run shape');assert.equal(reloaded.run('PROTO_SAVE_V3.validLearningCursor(run(),PROTO_REVISION_ACTIONS.book())'),true,label+' read proof');
 reloaded.run("screen=run().activeQuestionId?'quiz':'game';if(run().activeQuestionId)quizMode='story';render()");return reloaded;
}
let game=load();game.run("resumeEra('proto-kingdoms')");assert.equal(game.run('run().currentChapter'),'proto-ch02');
game.click({action:'advance-dialogue'});game.click({action:'advance-dialogue'});assert.equal(game.run('run().dialogueCursor'),3);assert.equal(game.run('PROTO_REVISION_ACTIONS.book().readLineIds.length'),2);
game=checkpoint(game,'main dialogue cursor');
until(game,g=>g.run("screen==='game'&&PROTO_REVISION_ACTIONS.phaseState().phase==='join'"));game=checkpoint(game,'joined lines');
assert.equal(game.run('PROTO_REVISION_ACTIONS.markRead()'),false,'partial scene reading is not counted as complete');
until(game,g=>g.run("screen==='quiz'"));assert.equal(game.run('run().questionQueue.length'),3);assert.equal(game.run('PROTO_REVISION_ACTIONS.book().openedQuestionIds.length'),1);assert.equal(game.run('PROTO_REVISION_ACTIONS.book().answeredQuestionIds.length'),0);
game=checkpoint(game,'queue opened');
const active=game.copy('activeQuestion()'),wrong=(active.answer+1)%active.choices.length;game.click({protoAnswer:String(wrong)});game=checkpoint(game,'answer draft');
assert.equal(game.run('PROTO_REVISION_ACTIONS.book().answeredQuestionIds.length'),0);game.click({action:'proto-submit'});assert.equal(game.run('PROTO_REVISION_ACTIONS.book().answeredQuestionIds.length'),1);game=checkpoint(game,'answer submitted');
game.click({action:'proto-quiz-next'});assert.equal(game.run('run().questionQueueIndex'),1);game=checkpoint(game,'queue second question');
while(game.run('screen')==='quiz'){
 if(game.run('run().questionAnswer===null')){const q=game.copy('activeQuestion()');game.click({protoAnswer:String(q.answer)});game.click({action:'proto-submit'});}
 game.click({action:'proto-quiz-next'});
}
assert.equal(game.run('screen'),'complete');game.click({action:'start-chapter',chapter:'proto-ch03'});assert.equal(game.run('run().storyId'),'proto_ch03_s1');assert.equal(game.run('PROTO_REVISION_ACTIONS.book().readSceneIds.length'),1);game=checkpoint(game,'next country');
const ownKey=game.run('PROTO_SAVE_V3.storageKey'),archiveKey=game.run('PROTO_SAVE_V3.archiveStorageKey');
const onlyOwn=load({[ownKey]:game.storage.get(ownKey),unrelated:'preserve'});onlyOwn.run("resumeEra('proto-kingdoms')");
assert.deepEqual(onlyOwn.copy('run()'),game.copy('run()'),'independent namespace restores the current run');assert.deepEqual(onlyOwn.copy('PROTO_REVISION_ACTIONS.book()'),game.copy('PROTO_REVISION_ACTIONS.book()'));assert.equal(onlyOwn.storage.get('unrelated'),'preserve');
const beforeReview=game.copy('run()'),reviewId=game.run('PROTO_STUDY_QUESTION_IDS[0]');game.click({action:'proto-recordbook'});game.click({protoReview:reviewId});game.click({protoAnswer:'0'});game.run('save()');
let reviewReload=load(Object.fromEntries(game.storage));assert.equal(reviewReload.run('screen'),'quiz');assert.equal(reviewReload.run('meta().protoReviewSession.draft'),0);assert.deepEqual(reviewReload.copy('run()'),beforeReview);
reviewReload.click({action:'proto-submit'});reviewReload.click({action:'proto-quiz-next'});assert.deepEqual(reviewReload.copy('run()'),beforeReview);assert.equal(reviewReload.run('modal.type'),'proto-recordbook');

// The independent v3 namespace is migrated in place while retaining its completion, records and learned terms.
const blank=load(),storageKey=blank.run('PROTO_SAVE_V3.storageKey'),legacyVersion='proto-revision-83-v1',script=blank.copy('PROTO_REVISION_SOURCE');
const legacyRead=[...new Set([...script.learning.map(item=>item.legacyFirstSceneId),'proto_ch02_s5'])];
const oldRun=blank.copy('PROTO_SAVE_V3.freshRun(true,"proto-ch03")');oldRun.protoContentVersion=legacyVersion;oldRun.protoStoryState={version:3,scenes:{}};oldRun.storyId='proto_ch03_s7';oldRun.dialogueSceneId=oldRun.storyId;oldRun.dialogueCursor=5;
const oldQuestionId=require('../docs/proto-revision/legacy-study-questions.json').questions[0].questionId;
const oldStorage={schemaVersion:3,eraId:'proto-kingdoms',contentVersion:3,contentRevision:legacyVersion,progress:{contentVersion:3,contentRevision:legacyVersion,progress:20,completed:false,lastChapter:'proto-ch03',lastScene:'proto_ch03_s7',resume:{run:oldRun,mainRun:null}},meta:{completedChapters:['proto-ch00','proto-ch01','proto-ch02'],chapterRecords:{'proto-ch00':{runsCount:1,marker:'archive'},'proto-ch02':{runsCount:4,marker:'kept'}},chapterRuns:{'proto-ch02':[{runId:7,completedAt:'old'}]},questionRecords:{[oldQuestionId]:{attempts:3,lastAnswer:1}},wrongQuestionIds:[oldQuestionId],reviewedQuestionIds:[],wrongAnswers:[{questionId:oldQuestionId,answeredAt:'old'}],learningEvents:[{questionId:oldQuestionId,source:'old'}],protoRevisionBook:{version:3,contentVersion:legacyVersion,readSceneIds:legacyRead,readLineIds:[],openedQuestionIds:['official-64-basic-02'],answeredQuestionIds:['official-64-basic-02'],choiceBySceneId:{}}}};
const migrated=load({[storageKey]:JSON.stringify(oldStorage)});migrated.run("resumeEra('proto-kingdoms')");
assert.equal(migrated.run('run().currentChapter'),'proto-ch03');assert.equal(migrated.run('run().storyId'),'proto_ch03_s1','old scene cursor resumes at the new chapter opening');
assert(migrated.copy('meta().completedChapters').includes('proto-ch02'));assert(!migrated.copy('meta().completedChapters').includes('proto-ch00'));
assert.equal(migrated.run('PROTO_REVISION_ACTIONS.book().readSceneIds.length'),5);assert.equal(migrated.run('PROTO_REVISION_ACTIONS.book().learnedKeywordIds.length'),31);
assert.equal(migrated.run('meta().chapterRecords["proto-ch02"].marker'),'kept');assert.equal(migrated.run('meta().chapterRuns["proto-ch02"].length'),1);
assert.equal(migrated.run('meta().questionRecords['+JSON.stringify(oldQuestionId)+'].attempts'),3);assert(migrated.copy('meta().wrongQuestionIds').includes(oldQuestionId));
assert(migrated.copy('meta().protoSaveArchives.entries').some(entry=>entry.sourceKey===storageKey&&entry.payload?.contentRevision===legacyVersion),'old independent payload kept in archive');
assert.equal(JSON.parse(migrated.storage.get(storageKey)).contentRevision,'proto-compact-5-scenes-v2','independent record rewrites in current format after resume');

const corrupted=load({[ownKey]:'{unreadable',[archiveKey]:JSON.stringify({schemaVersion:1,entries:[null]})});corrupted.run("resumeEra('proto-kingdoms');save()");
const archives=corrupted.copy('meta().protoSaveArchives.entries');assert(archives.some(entry=>entry.sourceKey===ownKey&&entry.payload?.raw==='{unreadable'));assert(archives.some(entry=>entry.sourceKey===archiveKey&&entry.payload.entries[0]===null));
const other=load();other.run("resumeEra('three-kingdoms');run().dialogueCursor=2;save()");const foreign=other.copy('run()');other.run("resumeEra('proto-kingdoms');save()");other.run("resumeEra('three-kingdoms')");assert.equal(other.run('run().storyId'),foreign.storyId,'other-era independent resume survives switching through Proto');assert.equal(other.run('run().dialogueCursor'),foreign.dialogueCursor);
console.log('PASS Proto saves: dialogue/join/queue/draft/answer reloads, independent recovery, optional review, 83-scene v3 namespace migration, progress/questions/records retention, malformed archive and other-era isolation.');
