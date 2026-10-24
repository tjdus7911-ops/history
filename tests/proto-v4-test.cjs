const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {load,until}=require('./proto-revision-harness.cjs');
const source=JSON.parse(fs.readFileSync('dist/proto-story-script.json'));const scenes=source.chapters.flatMap(c=>c.scenes);
assert.equal(scenes.length,17);assert.equal(source.examPlan.questions.length,41);assert.equal(source.examPlan.queues.reduce((n,q)=>n+q.missingQuestionCount,0),10);
assert.equal(crypto.createHash('sha256').update(JSON.stringify(scenes)).digest('hex'),'291fffcafce23583abaa63197f6d7d1c1aa37a37e04e309037bc0c438f1a29fe','the 17 historical scenes changed while adding the prologue');
assert.equal(crypto.createHash('sha256').update(JSON.stringify(source.examPlan.questions)).digest('hex'),'1654388115b42bf5da413fd3b6443ac0cf7b54d66160bafbbb2f995a8333b4f1','official question IDs or authored question content changed');
// Independently count every authored utterance, including both replies and the post-exam ending.
const manuscript=fs.readFileSync('docs/proto-v4/manuscript.md','utf8').split('## 실제 기출 배치 검토 결과')[0];
const authored=[...manuscript.matchAll(/^(?:→ )?([^:\n]+): “(.+)”$/gm)].map(m=>[m[1],m[2].replace(/\*\*/g,'')]);
const imported=scenes.flatMap(s=>[...s.main,...s.join,...s.outro,...s.choices.flatMap(c=>c.reply)]).map(l=>[l.speaker,l.text]);
assert.equal(authored.length,imported.length);for(const pair of authored)assert(imported.some(p=>JSON.stringify(p)===JSON.stringify(pair)),pair[1]);
for(const q of source.examPlan.questions){assert.equal(q.choices.length,q.choiceExplanations.length);assert(q.questionImage&&q.proposed.playExplanation);}

const prologueIds=['proto_prologue_museum','proto_prologue_separation','proto_prologue_timeslip','proto_prologue_buyeo_field'];
const topology=load();
assert.deepEqual(topology.copy('PROTO_REVISION_RUNTIME.prologueSceneIds'),prologueIds);
assert.equal(topology.run('PROTO_STORY_SCOPE.storyScenes'),17);assert.equal(topology.run('PROTO_STORY_SCOPE.prologueScenes'),4);assert.equal(topology.run('PROTO_STORY_SCOPE.totalStoryScenes'),21);
assert.equal(topology.run('PROTO_REVISION_RUNTIME.sources.size'),21);assert.equal(topology.run('PROTO_REVISION_RUNTIME.entrySceneId'),'proto_prologue_museum');assert.equal(topology.run('PROTO_REVISION_RUNTIME.firstMainSceneId'),'proto_ch01_s1');
assert.equal(topology.run('PROTO_SAVE_V3.freshRun(false).storyId'),'proto_prologue_museum');assert.equal(topology.run("CHAPTERS['proto-ch01'].startStoryId"),'proto_ch01_s1','the canonical CH.01 history scene ID must remain unchanged');
for(const id of prologueIds){
 const item=topology.copy(`STORIES[${JSON.stringify(id)}]`);
 assert.equal(item.isPrologue,true,id+' must be a separately identified prologue scene');
 assert.equal(item.choices,null,id+' must not contain a history choice');assert.equal(item.protoQueue,null,id+' must not contain an exam queue');assert.deepEqual(item.protoLearningIds,[],id+' must not award a history keyword');assert.deepEqual(item.protoSource.learning,[],id+' must not mix learning content into the prologue');
}
assert.equal(topology.run("STORIES['proto_prologue_museum'].illustrationId"),'proto-v4-modern-museum');assert.equal(topology.run("ASSETS['proto-v4-modern-museum'].src"),'media/proto-v4/ancient-modern-museum.jpg');
assert.equal(topology.run("STORIES['proto_prologue_separation'].illustrationId"),'proto-v4-modern-museum');assert.equal(topology.run("STORIES['proto_prologue_timeslip'].illustrationId"),'proto-v4-modern-museum');
assert.equal(topology.run("STORIES['proto_prologue_buyeo_field'].illustrationId"),'proto-v4-buyeo-village');assert.equal(topology.run("STORIES['proto_ch01_s1'].illustrationId"),'proto-v4-buyeo-village');
const prologueText=topology.copy("PROTO_REVISION_RUNTIME.prologueSceneIds.map(id=>STORIES[id].dialogues.map(line=>line.dialogue).join(' ')).join(' ')");
for(const pattern of [/전시/,/손이 풀렸다/,/동생/,/차가운/,/부여/])assert(pattern.test(prologueText),`missing prologue beat: ${pattern}`);

// A fresh run survives reload inside the museum, then crosses into the unchanged CH.01 at cursor 10.
let opening=load();opening.run("resumeEra('proto-kingdoms')");assert.equal(opening.run('run().storyId'),'proto_prologue_museum');opening.click({action:'advance-dialogue'});opening.run('save()');
opening=load(Object.fromEntries(opening.storage));opening.run("resumeEra('proto-kingdoms')");assert.deepEqual(opening.copy('[run().storyId,run().dialogueCursor]'),['proto_prologue_museum',2]);
until(opening,g=>g.run("run().storyId==='proto_ch01_s1'"));assert.deepEqual(opening.copy('[run().storyId,run().dialogueCursor]'),['proto_ch01_s1',10]);
assert(opening.copy("STORIES['proto_ch01_s1'].dialogues.slice(0,9).every(line=>PROTO_REVISION_ACTIONS.book().readLineIds.includes(line.lineId))"),'the intentionally skipped legacy opening lines were not recorded for save validation');
assert(opening.html().includes('<div class="dialogue-step"><span>1 / 6</span>'),'the first historical line retained the legacy 10 / 15 counter');
opening.run('save()');const chapterReload=load(Object.fromEntries(opening.storage));chapterReload.run("resumeEra('proto-kingdoms')");assert.deepEqual(chapterReload.copy('[run().storyId,run().dialogueCursor]'),['proto_ch01_s1',10]);
const beforePrologueReplay=opening.copy('[run().storyId,run().dialogueCursor]');opening.run('PROTO_REVISION_ACTIONS.replayPrologue()');assert.deepEqual(opening.copy('[run().storyId,run().dialogueCursor,run().protoReplayScope]'),['proto_prologue_museum',1,'prologue']);
until(opening,g=>g.run("screen!=='game'"));assert.equal(opening.run('screen'),'era');assert.deepEqual(opening.copy('[run().storyId,run().dialogueCursor]'),beforePrologueReplay);assert.equal(opening.run('state.mainRun'),null,'prologue replay did not restore the main run');

const legacyOpeningLineIds=topology.copy("STORIES['proto_ch01_s1'].dialogues.slice(0,9).map(line=>line.lineId)");
const assertChapterOneRestartIncludesPrologue=(game,label)=>{
 assert.deepEqual(game.copy('[run().storyId,run().dialogueCursor]'),['proto_prologue_museum',1],label+' did not restart at the museum prologue');
 until(game,g=>g.run("run().storyId==='proto_ch01_s1'"));
 assert.deepEqual(game.copy('[run().storyId,run().dialogueCursor]'),['proto_ch01_s1',10],label+' did not continue into the first historical line after the prologue');
 assert(game.copy('STORIES["proto_ch01_s1"].dialogues.slice(0,9).every(line=>PROTO_REVISION_ACTIONS.book().readLineIds.includes(line.lineId))'),label+' did not preserve save validation for the skipped legacy lines');
 assert(game.run('PROTO_SAVE_V3.validLearningCursor(run(),PROTO_REVISION_ACTIONS.book())'),label+' produced an invalid learning cursor');
};
for(const [label,operation] of [
 ['startChapter',"startChapter(state,'proto-ch01')"],
 ['resetRun',"resetRun(state,'proto-ch01')"],
 ['restartChapter','restartChapter(state)'],
 ['beginReplay',"beginReplay(state,'proto-ch01')"]
]){
 const restarted=load();restarted.run("resumeEra('proto-kingdoms')");until(restarted,g=>g.run("run().storyId==='proto_ch01_s1'"));restarted.run(operation);
 if(label==='beginReplay'){assert.equal(restarted.run('run().mode'),'replay');assert.equal(restarted.run('state.mainRun.storyId'),'proto_ch01_s1');assert.equal(restarted.run('state.mainRun.dialogueCursor'),10);}
 assertChapterOneRestartIncludesPrologue(restarted,label);
}
for(const [label,operation] of [['startChapter',"startChapter(state,'proto-ch01')"],['resetRun',"resetRun(state,'proto-ch01')"]]){
 const unread=load();unread.run(operation);assert.deepEqual(unread.copy('[run().storyId,run().dialogueCursor]'),['proto_prologue_museum',1],label+' skipped an unread prologue');assert(!unread.copy('PROTO_REVISION_ACTIONS.book().readLineIds').some(id=>legacyOpeningLineIds.includes(id)),label+' marked the hidden CH.01 lines before the prologue finished');
}
const episodeRestart=load();episodeRestart.run("resumeEra('proto-kingdoms')");episodeRestart.click({action:'advance-dialogue'});episodeRestart.run('restartEpisodeMain(state)');assert.deepEqual(episodeRestart.copy('[run().storyId,run().dialogueCursor]'),['proto_prologue_museum',1],'new episode restart did not return to the museum prologue');

const recall=load();recall.run("resumeEra('proto-kingdoms')");until(recall,g=>g.run("run().storyId==='proto_ch01_s2'"));recall.run("modal={type:'proto-recall',sceneId:'proto_ch01_s1'};render()");assert(!recall.html().includes('잠깐만, 저쪽도 보고 가자!'),'CH.01 recall leaked a legacy museum line');assert(!recall.html().includes('부여요.'),'CH.01 recall leaked the legacy pre-handoff reveal');assert(recall.html().includes('부여…? 설마 내가 책에서 봤던 그 나라?'),'CH.01 recall omitted the first historical line');

for(const branch of [0,1]){
 let g=load();g.run("resumeEra('proto-kingdoms')");const visited=new Set(),historyVisited=new Set(),prologueVisited=new Set(),questions=new Set(),outro=[],reloaded=new Set();let firstMainEntry=false;
 for(let tick=0;tick<1600;tick++){
  const screen=g.run('screen');assert(g.run('PROTO_SAVE_V3.validRun(run())'),'invalid run at '+tick);
  if(screen==='game'){
   const sceneId=g.run('run().storyId'),isPrologue=g.run('PROTO_REVISION_ACTIONS.currentSource().isPrologue===true');visited.add(sceneId);(isPrologue?prologueVisited:historyVisited).add(sceneId);const phase=g.run('PROTO_REVISION_ACTIONS.phaseState().phase');
   if(isPrologue){assert.equal(g.run('PROTO_REVISION_ACTIONS.currentSource().choices'),null);assert.equal(g.run('PROTO_REVISION_ACTIONS.currentSource().protoQueue'),null);assert.deepEqual(g.copy('PROTO_REVISION_ACTIONS.currentSource().protoSource.learning'),[]);}
   if(sceneId==='proto_ch01_s1'&&!firstMainEntry){assert.equal(g.run('run().dialogueCursor'),10);firstMainEntry=true;}
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
 assert.equal(visited.size,21);assert.equal(historyVisited.size,17);assert.deepEqual([...prologueVisited],prologueIds);assert.equal(questions.size,41);assert.deepEqual(outro,['준비됐어?','응. 이번에는 같이.']);assert.equal(g.copy('PROTO_REVISION_ACTIONS.book().readSceneIds').length,21);
}
// Snapshot all non-proto story/chapter/question objects against the checked-out base commit.
const after=load(),baseline=JSON.parse(fs.readFileSync('docs/proto-v4/other-era-baseline.json'));
for(const row of baseline.records)assert.equal(crypto.createHash('sha256').update(JSON.stringify(after.copy(row.expression))).digest('hex'),row.sha256,'changed another era: '+row.expression);
const before=load();before.run("resumeEra('proto-kingdoms')");before.run("run().protoContentVersion='proto-compact-5-scenes-v2';meta().protoRevisionBook.contentVersion='proto-compact-5-scenes-v2'");
const old=before.copy('state');old.meta.completedChapters.push('proto-ch03');old.meta.questionRecords['keep-other']={attempts:4,lastAnswer:1};const migrated=after.run('migrateSave('+JSON.stringify(old)+')');assert.equal(migrated.run.storyId,'proto_prologue_museum');assert.equal(migrated.run.started,false);assert(!migrated.meta.completedChapters.some(id=>id.startsWith('proto-')));assert.equal(migrated.meta.questionRecords['keep-other'].attempts,4);

topology.run("state.run=INITIAL_RUN('proto-ch01');PROTO_SAVE_V3.identifyRun(state.run,true);state.run.started=false;state.mainRun=null;meta().protoRevisionBook=PROTO_SAVE_V3.emptyBook(meta())");
const pristineModel=topology.copy('state'),redirected=after.run('migrateSave('+JSON.stringify(pristineModel)+')');assert.deepEqual([redirected.run.storyId,redirected.run.dialogueCursor,redirected.run.started],['proto_prologue_museum',1,false],'a pristine same-version CH.01 save was not redirected to the new prologue');
const startedPristineModel=structuredClone(pristineModel);startedPristineModel.run.started=true;const startedRedirected=after.run('migrateSave('+JSON.stringify(startedPristineModel)+')');assert.deepEqual([startedRedirected.run.storyId,startedRedirected.run.dialogueCursor,startedRedirected.run.started],['proto_prologue_museum',1,true],'a started-but-unread pristine CH.01 save was not redirected to the new prologue');
const unreadPrologueUi=load();unreadPrologueUi.run("selectedEra='proto-kingdoms';screen='era';render()");assert(!unreadPrologueUi.html().includes('data-action="proto-prologue-replay"'),'era screen no longer exposes the removed prologue replay menu');

// A valid same-version save already inside CH.01 remains exactly there and keeps unrelated-era records.
const existing=opening.copy('state'),prologueLineIds=opening.copy("PROTO_REVISION_RUNTIME.prologueSceneIds.flatMap(id=>STORIES[id].dialogues.map(line=>line.lineId))");
existing.meta.protoRevisionBook.readSceneIds=existing.meta.protoRevisionBook.readSceneIds.filter(id=>!prologueIds.includes(id));existing.meta.protoRevisionBook.readLineIds=existing.meta.protoRevisionBook.readLineIds.filter(id=>!prologueLineIds.includes(id));existing.meta.questionRecords['keep-other-era']={attempts:7,lastAnswer:2};
const preserved=after.run('migrateSave('+JSON.stringify(existing)+')');assert.deepEqual([preserved.run.storyId,preserved.run.dialogueCursor],['proto_ch01_s1',10]);assert.equal(preserved.meta.questionRecords['keep-other-era'].attempts,7);assert(!preserved.meta.protoRevisionBook.readSceneIds.some(id=>prologueIds.includes(id)));
console.log('PASS: 4-scene prologue + unchanged 17 history scenes/17 choices/41 official exams, cursor-10 handoff, reloads, old-save preservation and other-era byte-equivalent data.');
