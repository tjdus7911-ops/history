const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const {load}=require('./proto-revision-harness.cjs');
const source=JSON.parse(fs.readFileSync('dist/proto-story-script.json'));const scenes=source.chapters.flatMap(c=>c.scenes);
assert.equal(scenes.length,17);assert.equal(source.examPlan.questions.length,26);assert.equal(source.examPlan.queues.reduce((n,q)=>n+q.missingQuestionCount,0),25);
// Independently count every authored utterance, including both replies and the post-exam ending.
const manuscript=fs.readFileSync('docs/proto-v4/manuscript.md','utf8').split('## 실제 기출 배치 검토 결과')[0];
const authored=[...manuscript.matchAll(/^(?:→ )?([^:\n]+): “(.+)”$/gm)].map(m=>[m[1],m[2].replace(/\*\*/g,'')]);
const imported=scenes.flatMap(s=>[...s.main,...s.join,...s.outro,...s.choices.flatMap(c=>c.reply)]).map(l=>[l.speaker,l.text]);
assert.equal(authored.length,imported.length);for(const pair of authored)assert(imported.some(p=>JSON.stringify(p)===JSON.stringify(pair)),pair[1]);
for(const q of source.examPlan.questions){assert.equal(q.choices.length,q.choiceExplanations.length);assert(q.questionImage&&q.proposed.playExplanation);assert(!q.officialQuestionId.includes('71-advanced-02'));}
for(const branch of [0,1]){
 let g=load();g.run("resumeEra('proto-kingdoms')");const visited=new Set(),questions=new Set(),outro=[],reloaded=new Set();
 for(let tick=0;tick<1600;tick++){
  const screen=g.run('screen');assert(g.run('PROTO_SAVE_V3.validRun(run())'),'invalid run at '+tick);
  if(screen==='game'){
   visited.add(g.run('run().storyId'));const phase=g.run('PROTO_REVISION_ACTIONS.phaseState().phase');
   if(phase==='outro')outro.push(g.run('PROTO_REVISION_ACTIONS.phaseEntries()[run().dialogueCursor-1].dialogue'));
   // Every phase must survive a full storage round trip, without skipping its current line.
   if(['branch','join','outro'].includes(phase)&&!reloaded.has(phase)&&g.run('run().dialogueCursor')===1){reloaded.add(phase);const before=g.copy('[run().storyId,run().dialogueCursor,PROTO_REVISION_ACTIONS.phaseState().phase]');g.run('save()');const reload=load(Object.fromEntries(g.storage));reload.run("resumeEra('proto-kingdoms')");assert.deepEqual(reload.copy('[run().storyId,run().dialogueCursor,PROTO_REVISION_ACTIONS.phaseState().phase]'),before);g=reload;}
   g.click(phase==='choice'?{choice:String(branch)}:{action:'advance-dialogue'});
  }else if(screen==='quiz'){
   const q=g.copy('activeQuestion()');questions.add(q.officialQuestionId);
   if(g.run('run().questionAnswer===null')){g.click({protoAnswer:String(branch?(q.answer+1)%q.choices.length:q.answer)});g.click({action:'proto-submit'});assert(g.html().includes('proto-choice-explanations'));}else g.click({action:'proto-quiz-next'});
  }else if(screen==='complete'){
   const number=g.run('Number(CHAPTERS[run().currentChapter].number)');if(number===5)break;
   g.click({action:'start-chapter',chapter:'proto-ch0'+(number+1)});
  }else assert.fail(screen);
  assert(tick<1599,'route stuck');
 }
 assert.equal(visited.size,17);assert.equal(questions.size,26);assert.deepEqual(outro,['준비됐어?','응. 이번에는 같이.']);assert.equal(g.copy('PROTO_REVISION_ACTIONS.book().readSceneIds').length,17);
}
// Snapshot all non-proto story/chapter/question objects against the checked-out base commit.
const after=load(),crypto=require('node:crypto'),baseline=JSON.parse(fs.readFileSync('docs/proto-v4/other-era-baseline.json'));
for(const row of baseline.records)assert.equal(crypto.createHash('sha256').update(JSON.stringify(after.copy(row.expression))).digest('hex'),row.sha256,'changed another era: '+row.expression);
const before=load();before.run("resumeEra('proto-kingdoms')");before.run("run().protoContentVersion='proto-compact-5-scenes-v2';meta().protoRevisionBook.contentVersion='proto-compact-5-scenes-v2'");
const old=before.copy('state');old.meta.completedChapters.push('proto-ch03');old.meta.questionRecords['keep-other']={attempts:4,lastAnswer:1};const migrated=after.run('migrateSave('+JSON.stringify(old)+')');assert.equal(migrated.run.storyId,'proto_ch01_s1');assert.equal(migrated.run.started,false);assert(!migrated.meta.completedChapters.some(id=>id.startsWith('proto-')));assert.equal(migrated.meta.questionRecords['keep-other'].attempts,4);
console.log('PASS 17 scenes, both branches, 26 exams, wrong answers, post-exam ending, reloads, old saves and other-era byte-equivalent data.');
