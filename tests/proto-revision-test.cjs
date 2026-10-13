const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {load,step}=require('./proto-revision-harness.cjs');
const {assertSha256IfLocal}=require('./deployment-asset-test-helper.cjs');
const raw=fs.readFileSync('docs/proto-revision/눈떠보니원삼국_개정게임데이터.json'),source=JSON.parse(raw);
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
assert.equal(digest(raw),'e34fce45eedabdde950c1b08f440177cdfe958f7636b24022f8f7e84f6816595');
assert.deepEqual(fs.readFileSync('dist/proto-story-script.json'),raw);
const h=load(),scenes=source.chapters.flatMap(chapter=>chapter.scenes),catalog=JSON.parse(fs.readFileSync('dist/official-exam-catalog.json')),catalogById=new Map(catalog.map(item=>[item.officialQuestionId,item]));
assert.deepEqual(h.copy('PROTO_REVISION_SOURCE'),source);
assert.equal(h.run('PROTO_REVISION_SOURCE_SHA256'),digest(raw));
assert.equal(h.run('PROTO_STUDY_QUESTION_IDS.length'),23);
assert.equal(h.run('PROTO_CHECKPOINTS.length'),11);
let utterances=0,choices=0;
for(const scene of scenes){
 const installed=h.copy('STORIES['+JSON.stringify(scene.sceneId)+']');
 assert.equal(installed.title,scene.title);assert.equal(installed.location,scene.location);assert.equal(installed.protoPeriod,scene.period);
 const convert=entries=>entries.map(line=>({lineId:line.lineId,speaker:line.protoSpeaker,text:line.dialogue}));
 assert.deepEqual(convert(installed.dialogues),scene.main.map(({lineId,speaker,text})=>({lineId,speaker,text})));
 assert.deepEqual(convert(installed.protoCommon),scene.join.map(({lineId,speaker,text})=>({lineId,speaker,text})));
 utterances+=scene.main.length+scene.join.length;
 for(let index=0;index<scene.choices.length;index++){
  const choice=scene.choices[index],actual=installed.choices[index],expected=[choice.spokenLine,...choice.reply];
  assert.equal(actual.label,choice.label);assert.deepEqual(convert(actual.resultDialogues),expected.map(({lineId,speaker,text})=>({lineId,speaker,text})));
  assert.deepEqual(actual.statChanges,{});assert.deepEqual(actual.relationshipChanges,{});assert.deepEqual(actual.trustChanges||{},{});
  choices++;utterances+=expected.length;
 }
}
assert.equal(choices,108);assert.equal(utterances,1369);
for(const authored of source.examPlan.questions){
 const q=h.copy('PROTO_REVISION_RUNTIME.questionByOfficialId.get('+JSON.stringify(authored.officialQuestionId)+')');
 assert.equal(q.answer,authored.answerIndex0);assert.equal(q.answer+1,authored.answerNumber1);assert.equal(q.choices.length,authored.choiceCount);
 const canonical=catalogById.get(authored.officialQuestionId);assert(canonical,authored.officialQuestionId+' canonical image');
 assertSha256IfLocal('dist/'+authored.questionImage,authored.questionImageSha256,authored.officialQuestionId+' authored image');
 assert.equal(q.sourceQuestionImage,canonical.detailImage);assertSha256IfLocal('dist/'+q.sourceQuestionImage,canonical.detailImageSha256,q.questionId);
 assert.equal(q.explanation,authored.proposed.playExplanation);assert.deepEqual(q.protoRequiredSceneIds,authored.proposed.requiresReadSceneIds);
}
h.run("resumeEra('proto-kingdoms')");
h.run("run().visited=Array.from(PROTO_REVISION_RUNTIME.sources.keys());meta().completedChapters=Object.values(CHAPTERS).filter(ch=>ch.eraId==='proto-kingdoms').map(ch=>ch.chapterId);for(const id of PROTO_STUDY_QUESTION_IDS)meta().questionRecords[id]={attempts:1,lastAnswer:0}");
assert.equal(h.run("experiencedConcepts('proto-kingdoms').length"),0);
assert.equal(h.run("PROTO_STUDY_QUESTION_IDS.some(id=>PROTO_LEARNING_BOUNDARY.canPractice(id))"),false);
assert.equal(h.run('PROTO_REVISION_ACTIONS.book().readSceneIds.length'),0);
const independent=load();independent.run("resumeEra('proto-kingdoms')");
const officialId=independent.run("globalThis.OFFICIAL_EXAM_CATALOG.find(entry=>entry.sourceRecord.officialQuestionId==='official-60-advanced-02').canonicalQuestionId");
independent.run('recordQuestion({...state,run:JSON.parse(JSON.stringify(run()))},'+JSON.stringify(officialId)+',null)');
assert.equal(independent.run('PROTO_REVISION_ACTIONS.book().answeredQuestionIds.length'),0);
assert.equal(independent.run('PROTO_SAVE_V3.answeredFromRecords(meta()).length'),0);
independent.click({officialSingle:officialId});independent.click({officialPick:'0'});
assert.equal(independent.run('PROTO_REVISION_ACTIONS.book().answeredQuestionIds.length'),0);
independent.click({officialSubmit:'true'});
assert.equal(independent.run('PROTO_REVISION_ACTIONS.book().answeredQuestionIds.length'),1);
assert.equal(independent.run('PROTO_REVISION_ACTIONS.book().readSceneIds.length'),0);
assert.equal(independent.run("PROTO_LEARNING_BOUNDARY.canPractice('proto-v3-official-60-advanced-02')"),false);
function fullPlay(branch,wrong){
 const game=load(),trace=[],seen=new Set(),questionOrder=[],questionSet=new Set();game.run("resumeEra('proto-kingdoms')");
 let steps=0;
 while(game.run("meta().completedChapters.filter(id=>id.startsWith('proto-')).length")<8){
  assert(++steps<1800,'dead end: '+game.run('screen')+' '+game.run('run().storyId'));
  assert.equal(game.run('PROTO_SAVE_V3.validRun(run())'),true,'run invalid '+game.run('run().storyId'));
  assert.equal(game.run('PROTO_SAVE_V3.validLearningCursor(run(),PROTO_REVISION_ACTIONS.book())'),true,'learning cursor invalid '+game.run('run().storyId'));
  const screen=game.run('screen');
  if(screen==='game'){
   const phase=game.run('PROTO_REVISION_ACTIONS.phaseState().phase');
   if(['main','branch','join'].includes(phase)){
    const line=game.copy('PROTO_REVISION_ACTIONS.phaseEntries()[run().dialogueCursor-1]'),key=line.lineId;
    if(!seen.has(key)){seen.add(key);trace.push({lineId:line.lineId,speaker:line.protoSpeaker,text:line.dialogue});}
    const escaped=game.run('esc('+JSON.stringify(line.dialogue)+')');assert(game.html().includes(escaped),'full current line omitted '+line.lineId);
   }
  }
  if(screen==='quiz'){
   const q=game.copy('activeQuestion()');
   if(!questionSet.has(q.officialQuestionId)){
    questionSet.add(q.officialQuestionId);questionOrder.push(q.officialQuestionId);
    for(const id of q.protoRequiredSceneIds)assert(game.copy('PROTO_REVISION_ACTIONS.book().readSceneIds').includes(id),'question opened before common learning '+id);
   }
  }
  step(game,branch,wrong);
 }
 const expected=scenes.flatMap(scene=>[...scene.main,...(scene.choices.length?[scene.choices[branch].spokenLine,...scene.choices[branch].reply]:[]),...scene.join]).map(({lineId,speaker,text})=>({lineId,speaker,text}));
 assert.deepEqual(trace,expected,'actual UI omitted, repeated, or reordered source text');
 assert.equal(trace.length,1151);
 assert.deepEqual(questionOrder,source.examPlan.queues.flatMap(queue=>queue.officialQuestionIds));
 assert.equal(questionSet.size,23);assert.equal(game.run('PROTO_REVISION_ACTIONS.book().readSceneIds.length'),83);assert.equal(game.run('PROTO_REVISION_ACTIONS.book().readLineIds.length'),1042);
 assert.equal(game.run('PROTO_REVISION_ACTIONS.book().answeredQuestionIds.length'),23);assert.equal(game.run("experiencedConcepts('proto-kingdoms').length"),31);
 assert.equal(game.run("meta().eraProgress['proto-kingdoms-v3'].progress"),100);assert.equal(game.run("meta().eraProgress['proto-kingdoms-v3'].completed"),true);
 assert.equal(game.run('run().characterStates.proto_modern.characterAge'),24);assert.equal(game.run('run().characterStates.proto_guide.characterAge'),27);assert.equal(game.run('run().characterStates.proto_raon.characterAge'),19);
 assert.equal(game.run('run().characterStates.proto_guide.isAlive'),true);
 assert.equal(game.run("PROTO_STUDY_QUESTION_IDS.filter(id=>{const q=QUESTIONS.find(item=>item.questionId===id),entry=globalThis.OFFICIAL_EXAM_CATALOG.find(item=>item.sourceRecord.officialQuestionId===q.officialQuestionId);return meta().wrongQuestionIds.includes(entry.canonicalQuestionId)}).length"),wrong?23:0);
 assert.equal(game.run("meta().wrongQuestionIds.filter(id=>id.startsWith('proto-v3-')).length"),0,'official wrong-note IDs stay canonical');
 game.click({action:'proto-recordbook'});assert.equal((game.html().match(/class="proto-topic"/g)||[]).length,31);
 const before=game.copy('run()');const reviewId=game.run('PROTO_STUDY_QUESTION_IDS[0]');game.click({protoReview:reviewId});game.click({protoAnswer:'0'});game.click({action:'proto-submit'});game.click({action:'proto-quiz-next'});assert.deepEqual(game.copy('run()'),before,'optional review changed main run');
 game.run("state.mainRun=null;state.run=INITIAL_RUN('proto-ch02');PROTO_SAVE_V3.identifyRun(run(),true);run().storyId='proto_ch02_s3';run().protoStoryState.scenes.proto_ch02_s3={phase:'join',choiceIndex:0};run().dialogueCursor=3;run().dialogueSceneId=run().storyId;modal=null;screen='game';render()");
 game.click({action:'advance-dialogue'});assert.equal(game.run('screen'),'game');assert.equal(game.run('run().storyId'),'proto_ch02_s4','completed official questions repeated as mandatory queue');
 console.log('PASS Proto route '+branch+': 1151 exact spoken frames, 83 scenes, 23 questions, '+(wrong?'wrong':'correct')+'.');
}
for(let branch=0;branch<3;branch++)fullPlay(branch,branch===1);
const typing=load({}, {typing:true});typing.run("resumeEra('proto-kingdoms')");const first=typing.run('run().dialogueCursor');assert.equal(typing.run('typingLine'),null);typing.click({action:'advance-dialogue'});assert.equal(typing.run('run().dialogueCursor'),first+1);
typing.run("state.mainRun=null;state.run=INITIAL_RUN('ch01');run().storyId='house';run().dialogueSceneId='house';run().dialogueCursor=1;screen='game';render()");assert.equal(typing.run('typingLine!==null'),true);typing.click({action:'advance-dialogue'});assert.equal(typing.run('run().dialogueCursor'),1);typing.click({action:'advance-dialogue'});assert.equal(typing.run('run().dialogueCursor'),2);
console.log('PASS Proto revision: complete source identity, 108 branch arrays, 1369 authored utterances, all 3 actual UI routes, 31 read-gated topics, image answers, unchanged common typing, optional review.');
