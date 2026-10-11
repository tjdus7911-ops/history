const assert=require('node:assert/strict');
const {load,step}=require('./proto-revision-harness.cjs'),h=load();
const legacy=h.copy("meta().eraProgress['proto-kingdoms']||null"),questions=new Set(),chapters=new Set();
h.run("resumeEra('proto-kingdoms')");
let guard=0;
while(h.run("meta().completedChapters.filter(id=>id.startsWith('proto-')).length")<8){
 assert(++guard<1700,'Proto route dead end');
 if(h.run('screen')==='quiz')questions.add(h.run('activeQuestion().officialQuestionId'));
 if(h.run('screen')==='complete')chapters.add(h.run('run().currentChapter'));
 step(h,0,false);
}
chapters.add(h.run('run().currentChapter'));
assert.deepEqual([...chapters],Array.from({length:8},(_,i)=>'proto-ch0'+i));assert.equal(questions.size,23);
assert.equal(h.run('PROTO_REVISION_ACTIONS.book().readSceneIds.length'),83);assert.equal(h.run('PROTO_REVISION_ACTIONS.book().answeredQuestionIds.length'),23);
assert.equal(h.run("meta().eraProgress['proto-kingdoms-v3'].progress"),100);assert.equal(h.run("meta().eraProgress['proto-kingdoms-v3'].completed"),true);
assert.deepEqual(h.copy("meta().eraProgress['proto-kingdoms']||null"),legacy,'old namespace preserved');
assert.equal(h.run("Object.values(CHAPTERS).filter(ch=>ch.eraId==='three-kingdoms'&&ch.threeStoryVersion===3).length"),23);
assert.equal(h.run("Object.values(STORIES).filter(s=>s.eraId==='three-kingdoms'&&!s.threeStoryVersion&&s.storyActive!==false).length"),0);
assert.equal(h.run("meta().completedChapters.some(id=>id.startsWith('THR-C'))"),false);
assert.equal(h.run("meta().wrongQuestionIds.some(id=>id.startsWith('ancient-'))"),false);
console.log('PASS: 8 Proto chapters / 83 scenes / 23 real question answers through actual UI clicks, independent v3 completion, preserved legacy progress and unchanged Three season.');
