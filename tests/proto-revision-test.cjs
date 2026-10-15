const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {load,step}=require('./proto-revision-harness.cjs');
const {assertSha256IfLocal}=require('./deployment-asset-test-helper.cjs');
const raw=fs.readFileSync('docs/proto-revision/눈떠보니원삼국_개정게임데이터.json'),source=JSON.parse(raw);
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
assert.equal(digest(raw),'13f950c903028d8ae17d74e28eb62d8416f15dc33b84986b921a8c7fb981b4f9');
assert.deepEqual(fs.readFileSync('dist/proto-story-script.json'),raw);
const h=load(),scenes=source.chapters.flatMap(chapter=>chapter.scenes),catalog=JSON.parse(fs.readFileSync('dist/official-exam-catalog.json')),catalogById=new Map(catalog.map(item=>[item.officialQuestionId,item]));
const choices=JSON.parse(fs.readFileSync('dist/official-exam-choices.json')).records,explanations=JSON.parse(fs.readFileSync('dist/official-exam-explanations.json')).records;
const choicesById=new Map(choices.map(item=>[item.officialQuestionId,item])),explanationsById=new Map(explanations.map(item=>[item.officialQuestionId,item]));
assert.deepEqual(h.copy('PROTO_REVISION_SOURCE'),source);
assert.equal(h.run('PROTO_REVISION_SOURCE_SHA256'),digest(raw));
assert.equal(h.run('PROTO_STUDY_QUESTION_IDS.length'),15);
assert.equal(h.run('PROTO_CHECKPOINTS.length'),5);
assert.equal(scenes.length,5);
const required={
 '부여':['5부족 연맹체','사출도','영고','12월','1책 12법'],
 '고구려':['5부족 연맹체','연맹왕국','동맹','10월','서옥제','1책 12법'],
 '옥저':['읍군·삼로','민며느리제','가족 공동 무덤','소금','어물'],
 '동예':['읍군·삼로','무천','10월','족외혼','책화','단궁','과하마','반어피'],
 '삼한':['소도','천군','계절제','10월','두레','철 수출']
};
let lineCount=0;
for(const scene of scenes){
 assert(scene.country&&scene.place&&scene.location,scene.sceneId+' country/place');
 assert.deepEqual(scene.choices,[],scene.sceneId+' compact scene has no unnecessary branch');
 const lines=[...scene.main,...scene.join],text=lines.map(line=>line.text).join('\n');lineCount+=lines.length;
 for(const line of lines){assert(Array.isArray(line.learningKeywordIds),line.lineId+' explicit learningKeywordIds');assert(line.learningKeywordIds.every(id=>source.learning.some(item=>item.id===id)),line.lineId+' known keyword IDs');}
 for(const entry of scene.keyDialogues){const line=lines.find(item=>item.lineId===entry.lineId&&item.text===entry.text);assert(line,entry.lineId+' quoted dialogue');assert(line.learningKeywordIds.length>0,line.lineId+' learning dialogue has a keyword ID');}
 for(const word of required[scene.country])assert(text.includes(word),scene.country+' spoken keyword '+word);
 assert.equal(scene.quizAfter.count,3,scene.country+' three real questions');
 assert.equal(scene.quizAfter.officialQuestionIds.length,3);
 assert.equal(scene.quizAfter.afterLineId,lines.at(-1).lineId,'exam queue follows learned scene');
 const installed=h.copy('STORIES['+JSON.stringify(scene.sceneId)+']');
 assert.equal(installed.protoCountry,scene.country);assert.equal(installed.protoPlace,scene.place);
 assert.equal(installed.dialogues.length,scene.main.length);assert.equal(installed.protoCommon.length,scene.join.length);
 h.run('(function(){state.mainRun=null;state.run=INITIAL_RUN('+JSON.stringify(installed.chapterId)+');PROTO_SAVE_V3.identifyRun(run(),true);run().storyId='+JSON.stringify(scene.sceneId)+';run().dialogueSceneId='+JSON.stringify(scene.sceneId)+';run().dialogueCursor=1;run().protoStoryState.scenes['+JSON.stringify(scene.sceneId)+']={phase:"main",choiceIndex:null};screen="game";modal=null;})()');
 const rendered=h.run('game()');assert(rendered.includes('data-proto-country="'+scene.country+'"'));assert(rendered.includes('data-proto-place="'+scene.place+'"'));
 assert(!rendered.includes('이번 장면에서 배운 것'),'recap appears after all scene lines');
 const recap=h.run('(function(){run().storyId='+JSON.stringify(scene.sceneId)+';run().protoStoryState.scenes['+JSON.stringify(scene.sceneId)+']={phase:"join",choiceIndex:null};run().dialogueCursor=STORIES['+JSON.stringify(scene.sceneId)+'].protoCommon.length;return game()})()');
 assert(recap.includes('이번 장면에서 배운 것'),scene.country+' recap');
}
assert.equal(lineCount,50);
assert.equal(new Set(source.examPlan.questions.map(question=>question.officialQuestionId)).size,15,'no repeated question');
for(const queue of source.examPlan.queues){
 const scene=scenes.find(item=>item.sceneId===queue.sceneId);assert(scene,queue.sceneId);
 assert.equal(queue.officialQuestionIds.length,3);assert.deepEqual(queue.officialQuestionIds,scene.quizAfter.officialQuestionIds);
}
for(const authored of source.examPlan.questions){
 const q=h.copy('PROTO_REVISION_RUNTIME.questionByOfficialId.get('+JSON.stringify(authored.officialQuestionId)+')');
 assert(q,authored.officialQuestionId+' installed');assert.equal(q.answer,authored.answerIndex0);assert.equal(q.answer+1,authored.answerNumber1);assert.equal(q.choices.length,authored.choiceCount);
 const canonical=catalogById.get(authored.officialQuestionId),choice=choicesById.get(authored.officialQuestionId),detail=explanationsById.get(authored.officialQuestionId);
 assert(canonical,authored.officialQuestionId+' canonical catalog');assert(choice,authored.officialQuestionId+' original choices');assert(detail,authored.officialQuestionId+' explanations');
 assertSha256IfLocal('dist/'+authored.questionImage,authored.questionImageSha256,authored.officialQuestionId+' authored image');
 assert.equal(q.sourceQuestionImage,canonical.detailImage);assertSha256IfLocal('dist/'+q.sourceQuestionImage,canonical.detailImageSha256,q.questionId);
 assert.equal(q.examRound,canonical.examRound);assert.equal(q.examYear,canonical.examYear);assert.equal(q.examLevel,canonical.examLevel);assert.equal(q.questionNumber,canonical.questionNumber);
 assert.equal(q.explanation,detail.explanation);assert.equal(detail.choiceExplanations.length,authored.choiceCount);assert(detail.choiceExplanations.every(item=>item.choiceText&&item.explanation&&item.meaning&&item.judgmentReason),authored.officialQuestionId+' full option explanations');
 assert.deepEqual(q.protoRequiredSceneIds,authored.proposed.requiresReadSceneIds);
 const learned=new Set(authored.proposed.requiresReadSceneIds.flatMap(id=>{const scene=scenes.find(item=>item.sceneId===id);return [...scene.main,...scene.join].flatMap(line=>line.learningKeywordIds)}));
 assert(authored.learningKeywordIds.every(id=>learned.has(id)),authored.officialQuestionId+' after linked learning');
}
const legacy=JSON.parse(fs.readFileSync('docs/proto-revision/legacy-study-questions.json'));
assert.equal(legacy.questions.length,23);assert.equal(h.run("QUESTIONS.filter(q=>q.protoStoryVersion===2).length"),23,'legacy exam records remain intact');
function fullPlay(wrong){
 const game=load(),seenQuestions=new Set(),seenLines=new Set();game.run("resumeEra('proto-kingdoms')");let guard=0;
 while(game.run("meta().completedChapters.filter(id=>id.startsWith('proto-ch')).length")<5){
  assert(++guard<180,'compact Proto route dead end '+game.run('screen')+' '+game.run('run().storyId'));
  assert.equal(game.run('PROTO_SAVE_V3.validRun(run())'),true,'valid run '+game.run('run().storyId'));
  assert.equal(game.run('PROTO_SAVE_V3.validLearningCursor(run(),PROTO_REVISION_ACTIONS.book())'),true,'read proof '+game.run('run().storyId'));
  if(game.run('screen')==='game'){
   const line=game.copy('PROTO_REVISION_ACTIONS.phaseEntries()[run().dialogueCursor-1]');
   if(line){seenLines.add(line.lineId);assert(game.html().includes(game.run('esc('+JSON.stringify(line.dialogue)+')')),line.lineId+' shown');}
  }
  if(game.run('screen')==='quiz'){
   const q=game.copy('activeQuestion()');seenQuestions.add(q.officialQuestionId);
   for(const id of q.protoRequiredSceneIds)assert(game.copy('PROTO_REVISION_ACTIONS.book().readSceneIds').includes(id),q.officialQuestionId+' gated by learning');
  }
  step(game,0,wrong);
 }
 assert.equal(seenLines.size,50,'all scene dialogue lines shown');assert.equal(seenQuestions.size,15,'all official questions shown');
 assert.equal(game.run('PROTO_REVISION_ACTIONS.book().readSceneIds.length'),5);
 assert.equal(game.run('PROTO_REVISION_ACTIONS.book().readLineIds.length'),50);
 assert.equal(game.run('PROTO_REVISION_ACTIONS.book().answeredQuestionIds.length'),15);
 assert.equal(game.run("experiencedConcepts('proto-kingdoms').length"),31);
 assert.equal(game.run("meta().eraProgress['proto-kingdoms-v3'].progress"),100);
 assert.equal(game.run("meta().eraProgress['proto-kingdoms-v3'].completed"),true);
 assert.equal(game.run("PROTO_STUDY_QUESTION_IDS.filter(id=>{const q=QUESTIONS.find(item=>item.questionId===id),entry=OFFICIAL_EXAM_CATALOG.find(item=>item.sourceRecord.officialQuestionId===q.officialQuestionId);return meta().wrongQuestionIds.includes(entry.canonicalQuestionId)}).length"),wrong?15:0);
 game.click({action:'proto-recordbook'});assert.equal((game.html().match(/class="proto-topic"/g)||[]).length,31);
 const before=game.copy('run()'),reviewId=game.run('PROTO_STUDY_QUESTION_IDS[0]');game.click({protoReview:reviewId});game.click({protoAnswer:'0'});game.click({action:'proto-submit'});game.click({action:'proto-quiz-next'});
 assert.deepEqual(game.copy('run()'),before,'optional review did not change main run');
 console.log('PASS compact Proto full play: five scenes, 15 official questions, 31 learning terms, '+(wrong?'wrong':'correct')+' submissions.');
}
fullPlay(false);fullPlay(true);
const typing=load({}, {typing:true});typing.run("resumeEra('proto-kingdoms')");const cursor=typing.run('run().dialogueCursor');assert.equal(typing.run('typingLine'),null);typing.click({action:'advance-dialogue'});assert.equal(typing.run('run().dialogueCursor'),cursor+1);
console.log('PASS Proto revision: exact source, all spoken keywords, country/place and recap, 15 unique verified official question images and full option explanations, read-gated queues, preserved 23 legacy questions, both answer paths.');
