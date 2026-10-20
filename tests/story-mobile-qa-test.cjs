const assert=require('node:assert/strict');
const layoutCss=require('node:fs').readFileSync('dist/rev7-layouts.css','utf8');assert(layoutCss.indexOf('@import')<layoutCss.indexOf(':root'),'font import must precede ordinary CSS rules');
const {load,step,until}=require('./proto-revision-harness.cjs');
const protectedData=g=>g.copy('({completed:meta().completedChapters,records:meta().chapterRecords,runs:meta().chapterRuns,questions:meta().questionRecords,wrong:meta().wrongQuestionIds,events:meta().learningEvents,exams:meta().officialExamResults})');
let g=load();g.click({eraOpen:'proto-kingdoms'});g.click({action:'start-chapter',chapter:'proto-ch01'});
assert.equal(g.run('run().storyId'),'proto_prologue_museum');
const seen=new Set();for(let i=0;i<1500&&g.run('screen')!=='complete';i++){seen.add(g.run('run().storyId'));step(g);}
assert.equal(g.run('screen'),'complete');
for(const id of g.copy('PROTO_REVISION_RUNTIME.prologueSceneIds'))assert(seen.has(id),'original prologue scene '+id);
assert(g.run('meta().completedChapters.includes("proto-ch01")'));
g.click({action:'chapter-next-direct',chapter:'proto-ch01'});for(let i=0;i<6;i++)step(g);
const before=protectedData(g),main=g.copy('state.mainRun'),cursor=g.copy('({chapter:run().currentChapter,scene:run().storyId,cursor:run().dialogueCursor,pending:run().pending,choices:run().choices})');
g.click({action:'restart-current',chapter:'proto-ch02'});assert(g.run('modalHTML()').includes('CH.02의 진행 위치'));assert(!g.run('modalHTML()').includes('CH.01'));
g.click({action:'close'});assert.deepEqual(g.copy('({chapter:run().currentChapter,scene:run().storyId,cursor:run().dialogueCursor,pending:run().pending,choices:run().choices})'),cursor);assert.deepEqual(protectedData(g),before);
g.click({action:'restart-current',chapter:'proto-ch02'});g.click({action:'confirm-restart-current'});
assert.equal(g.run('run().currentChapter'),'proto-ch02');assert.equal(g.run('run().storyId'),'proto_ch02_s1');assert.equal(g.run('run().dialogueCursor'),1);assert.equal(g.run('run().pending'),null);assert.deepEqual(protectedData(g),before);assert.deepEqual(g.copy('state.mainRun'),main);
const storage=Object.fromEntries(g.storage);g=load(storage);g.run('resumeEra("proto-kingdoms")');assert.equal(g.run('run().currentChapter'),'proto-ch02');assert.equal(g.run('run().dialogueCursor'),1);assert.deepEqual(protectedData(g),before);
g.click({nav:'records'});g.click({r7RecordLearning:''});g.click({recordPeriod:'all'});const displayed=Number(/<small>읽은 장면<\/small><strong>(\d+)/.exec(g.run('records()'))?.[1]);assert(displayed>=g.run('meta().protoRevisionBook.readSceneIds.length'),'cumulative completed scenes remain visible after chapter restart');assert.deepEqual(protectedData(g),before);
// The exact same confirm path must reset each implemented chapter. Other eras
// remain unpublished in the product; only this internal regression bypasses the release gate.
const internal=load({}, {overrides:{'story-release-policy.js':''}}),chapters=internal.copy('Object.values(CHAPTERS).filter(ch=>CHAPTER_ACCESS.available(ch.chapterId)).map(ch=>ch.chapterId)');
for(const id of chapters){internal.run('state=INITIAL();modal=null;CHAPTER_ACCESS.begin('+JSON.stringify(id)+')');const first=internal.copy('({chapter:run().currentChapter,scene:run().storyId,cursor:run().dialogueCursor})'),cumulative=protectedData(internal);internal.click({action:'restart-current',chapter:id});internal.click({action:'confirm-restart-current'});assert.equal(internal.run('run().currentChapter'),id,id+' exact target');assert.equal(internal.run('run().pending'),null);assert.equal(internal.run('run().activeQuestionId'),null);assert.deepEqual(protectedData(internal),cumulative,id+' records preserved');if(id!=='proto-ch01'){assert.equal(internal.run('run().storyId'),first.scene,id+' first scene');assert.equal(internal.run('run().dialogueCursor'),first.cursor,id+' fresh-entry dialogue position');}}
// Entering CH.01 from another individually opened chapter must still show an unread prologue.
g=load();g.run('CHAPTER_ACCESS.begin("proto-ch02");CHAPTER_ACCESS.begin("proto-ch01")');assert.equal(g.run('run().storyId'),'proto_prologue_museum');
g.run('restartEpisodeMain(state)');assert.equal(g.run('run().storyId'),'proto_prologue_museum');
g=load();g.click({nav:'records'});g.click({r7RecordLearning:''});assert(g.html().includes('data-figma-frame="M-02"'));assert(g.run('records()').includes('data-figma-frame="M-02"'));assert(g.html().includes('선택한 기간의 풀이 기록이 없어요'));g.click({r7RecordHome:''});assert(g.html().includes('data-figma-frame="M-09"'));
g.click({eraOpen:'proto-kingdoms'});const learningBefore=protectedData(g);g.click({r7EraChapters:'proto-kingdoms'});assert(g.html().includes('id="r7-era-chapters"'));assert.deepEqual(protectedData(g),learningBefore);
console.log('PASS story QA: complete original museum prologue -> CH.01 -> CH.02, exact restart/cancel/reload, preserved records, '+chapters.length+' chapter restart targets (internal eras), thumbnail list, Rev.7 learning/empty records.');
