const assert=require('node:assert/strict'),fs=require('node:fs');
const {load}=require('./proto-revision-harness.cjs');
function step(g,branch=0){
 const s=g.copy('({screen,story:run().storyId,pending:run().pending,cursor:run().dialogueCursor,answer:run().questionAnswer})');
 if(s.screen==='quiz'){
  const q=g.copy('activeQuestion()');assert(q);
  if(s.answer===null){if(q.threeStoryVersion){g.click({threeAnswer:String(q.answer)});g.click({action:'three-submit'});}else if(q.protoStoryVersion){g.click({protoAnswer:String(q.answer)});g.click({action:'proto-submit'});}else {g.click({pickAnswer:String(q.answer)});g.click({submitAnswer:'true'});}}
  else g.click({action:q.protoStoryVersion?'proto-quiz-next':'quiz-next'});return;
 }
 assert.equal(s.screen,'game');const source=g.copy('STORIES[run().pending?.sourceSceneId||run().storyId]');
 if(source.threeStoryVersion){const phase=g.run('THREE_COMPLETE_ACTIONS.phaseState(THREE_COMPLETE_ACTIONS.currentSource()).phase');return phase==='choice'?g.click({choice:String(branch)}):g.click({action:'advance-dialogue'});}
 if(source.protoStoryVersion){const phase=g.run('PROTO_REVISION_ACTIONS.phaseState().phase');return phase==='choice'?g.click({choice:String(branch)}):g.click({action:'advance-dialogue'});}
 const length=g.run('conversationEntries(STORIES[run().pending?.sourceSceneId||run().storyId],run().pending).length');
 if(s.cursor<length)return g.click({action:'advance-dialogue'});
 if(s.pending)return g.click({action:'result-next'});
 if(source.choices?.length){const index=g.run('STORIES[run().storyId].choices.findIndex(c=>choiceAvailable(run(),c))');return g.click({choice:String(index)});}
 g.click({action:'next'});
}
function finish(g){const seen=new Set();for(let i=0;i<1800;i++){if(g.run('screen')==='complete')return seen;if(g.run('screen')==='quiz')seen.add(g.run('run().activeQuestionId'));step(g);}throw Error('stalled '+g.run('screen+" "+run().storyId'));}
let g=load();const chapters=g.copy('Object.values(CHAPTERS).filter(c=>CHAPTER_ACCESS.available(c.chapterId)).map(c=>c.chapterId)');
for(const id of chapters){g.run('state=INITIAL();state.mainRun=null;modal=null;CHAPTER_ACCESS.begin('+JSON.stringify(id)+')');assert.equal(g.run('run().currentChapter'),id);assert.equal(g.run('screen'),'game');assert.equal(g.run('meta().completedChapters.length'),0);assert.equal(g.run('run().choices.length'),0);assert.equal(g.run('Object.keys(run().questionResults).length'),0);}
const fixtures=['proto-ch02','THR-C03','ch09','joseon-ch12'],results=[];
for(const id of fixtures){
 g=load();g.run('CHAPTER_ACCESS.begin('+JSON.stringify(id)+')');const first=finish(g);assert(first.size>0,id+' has quizzes');
 g.click({action:'chapter-replay-direct',chapter:id});const main=g.copy('state.mainRun'),second=finish(g);assert.deepEqual([...second],[...first],id+' replay questions');assert.deepEqual(g.copy('state.mainRun'),main,'main run preserved');
 const next=g.run('(()=>{const a=eraChapters(chapterEra('+JSON.stringify(id)+'));return a[a.findIndex(c=>c.chapterId==='+JSON.stringify(id)+')+1].chapterId})()');
 assert(g.run('resultFooter('+JSON.stringify(id)+')').includes('chapter-next-direct'));
 g.click({action:'chapter-next-direct',chapter:id});assert.equal(g.run('run().currentChapter'),next);step(g);
 g.run('save()');const before=g.copy('run()'),storage=Object.fromEntries(g.storage),era=g.run('chapterEra(run().currentChapter)');g=load(storage);g.run('resumeEra('+JSON.stringify(era)+')');
 assert.equal(g.run('run().currentChapter'),next,id+' next reload chapter');assert.equal(g.run('run().storyId'),before.storyId,id+' next reload scene');assert.equal(g.run('run().dialogueCursor'),before.dialogueCursor,id+' next reload cursor');
 g.run('selectedEra='+JSON.stringify(era));const resumeCard=g.run('eras()').match(/<button class="era-resume"[^>]*>[\s\S]*?<\/button>/)?.[0];assert(resumeCard?.includes(g.run('esc(CHAPTERS[run().currentChapter].title)')),id+' replay resume label');
 results.push({id,next,questions:first.size,replayQuestions:second.size,reload:true});
}
const policy=g.copy('STORY_EXAM_POLICY');assert.equal(new Set(policy.placements.map(p=>p.officialQuestionId)).size,policy.placements.length);
assert.equal(new Set(policy.placements.map(p=>[p.examRound,p.examLevel,p.questionNumber].join(':'))).size,policy.placements.length);
for(const row of policy.placements){const q=g.copy('QUESTIONS.find(q=>q.questionId==='+JSON.stringify(row.questionId)+')');assert(q);assert.equal(q.answer,row.answer);assert(fs.existsSync('dist/'+q.sourceQuestionImage)||JSON.parse(fs.readFileSync('config/deployment-assets-manifest.json','utf8')).files.some(([asset,hash,bytes])=>asset===q.sourceQuestionImage&&/^[a-f0-9]{40}$/.test(hash)&&bytes>0),'original story question image must exist locally or in the immutable deployment manifest');}
fs.writeFileSync('docs/story-exams/playback-test-results.json',JSON.stringify({freshEntryChapters:chapters.length,results,summary:policy.summary},null,2)+'\n');console.log(JSON.stringify({freshEntryChapters:chapters.length,results}));
module.exports={step,finish};
