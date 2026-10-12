const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {load}=require('./proto-revision-harness.cjs');
const excluded=['proto-story-script.js','proto-story-data.js','proto-save-data.js','proto-story-ui.js','proto-art.js','proto-background-art.js'];
const before=load({}, {overrides:Object.fromEntries(excluded.map(file=>[file,'']))}),after=load();
for(const name of ['CHAPTERS','STORIES'])assert.deepEqual(after.copy("Object.values("+name+").filter(item=>item.eraId!=='proto-kingdoms')"),before.copy("Object.values("+name+").filter(item=>item.eraId!=='proto-kingdoms')"),name+' other eras');
for(const q of before.copy('QUESTIONS'))assert.deepEqual(after.copy('QUESTIONS.find(q=>q.questionId==='+JSON.stringify(q.questionId)+')'),q,'original question '+q.questionId);
const legacy=JSON.parse(fs.readFileSync('docs/proto-revision/legacy-study-questions.json')).questions;
assert.equal(legacy.length,23);for(const q of legacy){
 const actual=after.copy('QUESTIONS.find(q=>q.questionId==='+JSON.stringify(q.questionId)+')');
 for(const field of ['thumbnailImage','detailImage','thumbnailImageWidth','thumbnailImageHeight','detailImageWidth','detailImageHeight','sourceImageWidth','sourceImageHeight'])delete actual[field];
 actual.sourceQuestionImage=q.sourceQuestionImage;actual.questionImage=q.questionImage;
 assert.deepEqual(actual,q,'legacy Proto question '+q.questionId+' (except approved HQ media routing)');
}
for(const name of ['ASSETS','PORTRAITS','CHARACTERS'])for(const [id,value] of Object.entries(before.copy(name)))if(!id.startsWith('proto_')&&!id.startsWith('proto-'))assert.deepEqual(after.copy(name+'['+JSON.stringify(id)+']'),value,name+' '+id);
const digest=value=>crypto.createHash('sha256').update(value.replace(/\r\n/g,'\n')).digest('hex');
const baseline=JSON.parse(fs.readFileSync('tests/fixtures/proto-runtime-preservation.json'));
for(const [file,hash] of Object.entries(baseline.fileHashes)){
 if(file==='dist/proto-story-ui.js')continue;
 let text=fs.readFileSync(file,'utf8');
 if(file==='dist/app.js')for(const addition of ['&&(globalThis.THREE_LEARNING_BOUNDARY?.canPractice(q)??true)','&&(globalThis.PROTO_LEARNING_BOUNDARY?.canPractice(q)??true)'])text=text.replace(addition,'');
 if(file==='dist/editorial-ui.js')text=text.replace("&&(!globalThis.THREE_STORY_RUNTIME||id!=='three-kingdoms'||q.threeStoryVersion===globalThis.THREE_STORY_RUNTIME.version)",'');
 assert.equal(digest(text),hash,'preserved shared renderer/styles/data: '+file);
}
for(const era of ['goryeo','joseon']){
 const code="(function(){const fixture=Object.values(STORIES).find(s=>chapterEra(s.chapterId)==="+JSON.stringify(era)+"&&s.storyActive!==false&&s.dialogues?.length>2&&!s.choices);state.run=INITIAL_RUN(fixture.chapterId);state.mainRun=null;run().storyId=fixture.sceneId;run().dialogueCursor=3;run().dialogueSceneId=fixture.sceneId;screen='game';modal=null;return game();})()";
 assert.equal(after.run(code),before.run(code),era+' approved game markup is byte-identical');
}
const css=fs.readFileSync('dist/proto-revision.css','utf8');
assert(!/\.character-stage|\.stage-character/.test(css),'no portrait layout override');
assert(!/\.proto-revision-game\s*\{[^}]*(?:width|background|border-radius|font-size)\s*:/.test(css),'no new game layout');
console.log('PASS: all other-era data, every original question and 23 old Proto question objects preserved; shared CSS/renderer hashes unchanged and Goryeo/Joseon game markup identical.');
