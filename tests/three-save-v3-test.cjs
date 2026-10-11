/* Save boundaries use the actual core/era functions; dialogue-controller QA lives
   in three-complete-test.cjs. No browser or legacy storage is overwritten. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let files=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
files=files.filter(f=>!['pwa.js','three-story-ui.js','three-service-ui.js'].includes(f));
// This standalone importer/save test can run while the entry point is being
// wired. Once installed, the same authoritative script is read from index.html.
if(!files.includes('three-exam-data.js'))files.splice(files.indexOf('three-story-data.js'),0,'three-exam-data.js');
function load(saved={}){
  const storage=new Map(Object.entries(saved));let html='';
  const context=vm.createContext({Date,console,document:{querySelector:s=>s==='#app'?{set innerHTML(v){html=v}}:null,
    querySelectorAll:()=>[],addEventListener(){},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},
    localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
    window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>1,clearInterval(){}});
  vm.runInContext(files.map(f=>fs.readFileSync('dist/'+f,'utf8')).join('\n'),context);
  const run=code=>vm.runInContext(code,context),copy=code=>JSON.parse(run('JSON.stringify('+code+')'));
  return {run,copy,storage:()=>Object.fromEntries(storage),html:()=>html};
}
const current=load();
assert.equal(current.run("historySeasonProgressKey('three-kingdoms')"),'three-kingdoms-v3');
assert.equal(current.run("eraChapters('three-kingdoms').length"),23);
assert.equal(current.run("eraProtagonist('three-kingdoms').id"),'three_v3_seoa');
assert(current.run("HISTORY_SEASONS.find(s=>s.id==='three-kingdoms').characterIds.every(id=>typeof id==='string')"));
assert(current.run("THREE_COMPLETE_ART.protagonist.files.every(file=>eraProtagonist('three-kingdoms').assetPaths[file.expression]===file.src)"));
assert.equal(current.run("eraProtagonist('three-kingdoms').assetPaths.modern"),current.run('THREE_COMPLETE_ART.protagonist.modernSrc'));
assert.equal(current.run("eraProtagonist('three-kingdoms').assetPaths.hero"),current.run('THREE_COMPLETE_ART.protagonist.cover.src'));
current.run("resumeEra('three-kingdoms')");
assert.equal(current.run('run().storyId'),'THR-PRO-S01');
assert.equal(current.run('run().currentChapter'),'THR-C01');
assert(current.run('THREE_SAVE_V3.validRun(run())'));

// A completed Goryeo chapter must not dress this protagonist or alter branch,
// hint, typewriter, queue, answer or return-to state during core migration.
current.run(`meta().completedChapters.push('ch01');
  run().storyId='THR-C01-S04';run().dialogueSceneId='result:THR-C01-S04';run().dialogueCursor=3;
  run().pending={...STORIES['THR-C01-S04'].choices[1],sourceSceneId:'THR-C01-S04'};
  run().threeStoryState.scenes['THR-C01-S04']={phase:'branch',choiceIndex:1};
  run().threeTypedLineId='THR-C01-S04-B2-reply-2';
  meta().threeCompleteBook.choiceBySceneId={'THR-C01-S04':1};
  meta().threeCompleteBook.readSceneIds=['THR-PRO-S01','THR-PRO-S02','THR-PRO-S03','THR-C01-S01'];
  meta().threeCompleteBook.answeredQuestionIds=['official-64-advanced-03'];
  meta().threeCompleteBook.unlockedQuestionIds=['official-64-advanced-03'];
  meta().threeCompleteBook.hintReadIds=['first-64-hint-0'];
  save();`);
const branch=current.copy('run()'),book=current.copy('meta().threeCompleteBook');
const reloaded=load(current.storage());
for(const field of ['pending','dialogueCursor','dialogueSceneId','threeTypedLineId','threeStoryState'])assert.deepEqual(reloaded.copy('run()['+JSON.stringify(field)+']'),branch[field],field+' survives reload');
assert.deepEqual(reloaded.copy('meta().threeCompleteBook'),book);
assert.equal(reloaded.run('run().playerOutfit'),'three_traveler');
assert(!reloaded.run("run().inventory.some(item=>item.id==='goryeo-commoner-clothes')"));
assert(!reloaded.run("Object.hasOwn(run().characterStates,'doyun')"));
reloaded.run(`run().pending=null;run().storyId='THR-C01-S06';run().dialogueSceneId='THR-C01-S06';run().dialogueCursor=2;
  run().threeStoryState.scenes['THR-C01-S06']={phase:'hints',choiceIndex:0};
  run().threeHintEntries=[{kind:'record',speaker:'기록책',text:'자료를 다시 확인한다.',lineId:'hint-line'}];
  run().threeCheckpoint={sceneId:'THR-C01-S06',kind:'first',scheduleIds:[THREE_COMPLETE_EXAMS.schedule[0].id],returnTo:{sceneId:'THR-C01-S06',phase:'join'}};
  run().questionQueue=['THR-official-64-advanced-03'];run().questionQueueIndex=0;
  run().activeQuestionId='THR-official-64-advanced-03';run().questionAnswer=2;save();`);
const queue=reloaded.copy('run()'),withQueue=load(reloaded.storage());
for(const field of ['threeCheckpoint','threeHintEntries','threeStoryState','questionQueue','questionQueueIndex','activeQuestionId','questionAnswer','dialogueCursor'])assert.deepEqual(withQueue.copy('run()['+JSON.stringify(field)+']'),queue[field],field+' survives queue reload');
// Reopening an earlier chapter's question may temporarily display its hint
// scene while the interrupted current chapter stays in returnTo.
withQueue.run(`run().currentChapter='THR-C03';run().threeCheckpoint.kind='review';
  run().threeCheckpoint.returnTo={values:{currentChapter:'THR-C03',storyId:'THR-C03-S01',dialogueCursor:4},keys:['currentChapter','storyId','dialogueCursor']};save();`);
assert(withQueue.run('THREE_SAVE_V3.validRun(run())'));
const earlierReview=load(withQueue.storage());
assert.deepEqual(earlierReview.copy('run().threeCheckpoint'),withQueue.copy('run().threeCheckpoint'));

// The self-contained v3 record recovers even when the shared shell save is gone.
const independent=reloaded.storage()['lived-history-three-kingdoms-v3'];
assert(independent);const recovered=load({'lived-history-three-kingdoms-v3':independent});
assert(recovered.run("THREE_ERA_ISOLATION.validResume(meta().eraProgress['three-kingdoms-v3'].resume)"));
assert.deepEqual(recovered.copy("meta().eraProgress['three-kingdoms-v3'].resume.run.threeCheckpoint"),queue.threeCheckpoint);
assert.deepEqual(recovered.copy('meta().threeCompleteBook'),book);

// Old keys remain byte-identical. Old chapter completion never unlocks THR-C02.
const old={version:15,run:{...branch,currentChapter:'three-v2-ch01',storyId:'three_v2_ch01_s2',contentVersion:2,threeStoryState:{version:2,scenes:{}},completed:true},
  mainRun:null,meta:current.copy('meta()')};
old.meta.completedChapters=['ch01','three-v2-ch01'];old.meta.chapterRecords['three-v2-ch01']={chapterId:'three-v2-ch01',finalRun:{sentinel:'retain-old-record'}};
old.meta.chapterRuns['three-v2-ch01']=[];delete old.meta.threeCompleteBook;delete old.meta.eraProgress['three-kingdoms-v3'];
old.meta.eraProgress['three-kingdoms']={legacySentinel:'v1-preserved'};
old.meta.eraProgress['three-kingdoms-v2']={legacySentinel:'v2-preserved',resume:{run:old.run,mainRun:null}};
const oldIndependent=JSON.stringify({schemaVersion:1,eraId:'three-kingdoms',contentVersion:2,progress:old.meta.eraProgress['three-kingdoms-v2']});
const legacy=load({'lived-history-v1':JSON.stringify(old),'lived-history-three-kingdoms-v2':oldIndependent});
assert.equal(legacy.storage()['lived-history-three-kingdoms-v2'],oldIndependent);
assert.equal(legacy.run('run().storyId'),'THR-PRO-S01');
assert.equal(legacy.run("chapterStatus('THR-C02')"),'LOCKED');
assert.deepEqual(legacy.copy("meta().chapterRecords['three-v2-ch01']"),old.meta.chapterRecords['three-v2-ch01']);
assert.deepEqual(legacy.copy("meta().eraProgress['three-kingdoms']"),{legacySentinel:'v1-preserved'});
assert(legacy.run('THREE_ERA_ISOLATION.archiveNotices().length')>0);
assert(legacy.storage()['lived-history-three-kingdoms-archives-v3']);
legacy.run('finishChapter(state);save()');
assert.deepEqual(legacy.copy("meta().eraProgress['three-kingdoms']"),{legacySentinel:'v1-preserved'});
assert(legacy.run("meta().eraProgress['three-kingdoms-v3'].progress>0"));
// Immutable archives are preserved once, rather than copied or rewritten for
// every dialogue line. Adding new original evidence still persists immediately.
legacy.run(`globalThis.archiveWriteCount=0;const oldSetItem=localStorage.setItem;
  localStorage.setItem=(key,value)=>{if(key===THREE_ERA_ISOLATION.archiveStorageKey)archiveWriteCount++;oldSetItem(key,value)};
  save();save();`);
assert.equal(legacy.run('archiveWriteCount'),0);
const archiveCount=legacy.run('meta().threeSaveArchives.entries.length');
legacy.run(`THREE_SAVE_V3.archive(meta(),'legacy-content','dedup-probe',{original:'unchanged'});save();
  THREE_SAVE_V3.archive(meta(),'legacy-content','dedup-probe',{original:'unchanged'});save();`);
assert.equal(legacy.run('archiveWriteCount'),1);
assert.equal(legacy.run('meta().threeSaveArchives.entries.length'),archiveCount+1);

// A same-name chapter with an unknown schema is retained but not auto-completed.
const unknown=JSON.parse(JSON.stringify(old));unknown.run={...branch,completed:true,threeStoryState:{version:999,scenes:{}}};
unknown.meta.completedChapters=['ch01','THR-C01'];unknown.meta.threeCompleteBook={version:999,contentVersion:'unknown',readSceneIds:['THR-C01-S01']};
const quarantined=load({'lived-history-v1':JSON.stringify(unknown)});
assert.equal(quarantined.run('run().storyId'),'THR-PRO-S01');
assert(!quarantined.run("meta().completedChapters.includes('THR-C01')"));
assert(quarantined.run("meta().completedChapters.includes('ch01')"));
assert.equal(quarantined.run("chapterStatus('THR-C02')"),'LOCKED');
const noBook={version:15,run:branch,mainRun:null,meta:current.copy('meta()')};
delete noBook.meta.threeCompleteBook;delete noBook.meta.eraProgress['three-kingdoms-v3'];
const missingBook=load({'lived-history-v1':JSON.stringify(noBook)});
assert.equal(missingBook.run('run().storyId'),'THR-PRO-S01');
assert(missingBook.run('THREE_ERA_ISOLATION.archiveNotices().length')>0);

// A malformed independent record is retained as raw text before replacement.
const broken=load({'lived-history-three-kingdoms-v3':'{incomplete JSON'});
broken.run("resumeEra('three-kingdoms');save()");
const brokenArchive=JSON.parse(broken.storage()['lived-history-three-kingdoms-archives-v3']);
assert(brokenArchive.entries.some(e=>e.sourceKey==='lived-history-three-kingdoms-v3'&&e.payload.raw==='{incomplete JSON'));

// Restart only resets the story position and preserves cumulative learning.
reloaded.run('restartEpisodeMain(state);save()');
assert.equal(reloaded.run('run().storyId'),'THR-PRO-S01');
assert.deepEqual(reloaded.copy('meta().threeCompleteBook'),book);
assert.equal(reloaded.run('run().threeCheckpoint'),null);
assert.equal(reloaded.run('run().threeTypedLineId'),undefined);

// Round-trip all four eras through their actual resume handlers and storage.
const boundary=load(),expected=new Map();
for(const [index,id] of ['goryeo','proto-kingdoms','joseon','three-kingdoms'].entries()){
  boundary.run('resumeEra('+JSON.stringify(id)+');run().flags.saveProbe='+JSON.stringify(id)+';run().stats.wealth='+(30+index)+';run().dialogueCursor=2;save()');
  expected.set(id,boundary.copy('({chapter:run().currentChapter,story:run().storyId,flags:run().flags,wealth:run().stats.wealth,cursor:run().dialogueCursor})'));
}
for(const id of ['joseon','proto-kingdoms','goryeo','three-kingdoms']){
  boundary.run('resumeEra('+JSON.stringify(id)+');save()');
  assert.deepEqual(boundary.copy('({chapter:run().currentChapter,story:run().storyId,flags:run().flags,wealth:run().stats.wealth,cursor:run().dialogueCursor})'),expected.get(id),id+' progress boundary');
}
console.log('PASS three v3 saves: exact branch/hint/queue/typewriter/book round trips; independent recovery; legacy and unknown-schema archives; no inherited completion; restart retains learning; four-era isolation.');
