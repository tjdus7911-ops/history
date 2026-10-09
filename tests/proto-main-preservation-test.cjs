const fs=require('fs'),assert=require('assert'),crypto=require('crypto');
// The visual-only overlay is covered against this same baseline by proto-art-test.
const {load}=require('./proto-harness.cjs'),h=load({'proto-art.js':'','proto-background-art.js':''}),{run,copy}=h;
const digest=v=>crypto.createHash('sha256').update(typeof v==='string'?v.replace(/\r\n/g,'\n'):JSON.stringify(v)).digest('hex');
const baseline=require('./fixtures/proto-runtime-preservation.json');
for(const [id,hash] of Object.entries(baseline.sceneHashes))assert.equal(digest(copy(`STORIES[${JSON.stringify(id)}]`)),hash,'protected runtime scene '+id);
for(const [id,hash] of Object.entries(baseline.chapterHashes))assert.equal(digest(copy(`CHAPTERS[${JSON.stringify(id)}]`)),hash,'protected chapter '+id);
for(const [name,hash] of Object.entries(baseline.runtimeHashes))assert.equal(digest(copy(name)),hash,'unchanged runtime '+name);
for(const [file,hash] of Object.entries(baseline.fileHashes))assert.equal(digest(fs.readFileSync(file,'utf8')),hash,'unchanged renderer/assets '+file);
assert.deepEqual(copy('PROTO_QUESTION_SLOTS'),require('../docs/PROTO_QUESTION_SLOTS.json'));
const evidence=new Map(require('../docs/PROTO_MAIN_OFFICIAL_SOURCES.json').map(s=>[s.officialQuestionId,s]));
const slots=copy('PROTO_QUESTION_SLOTS');assert.equal(slots.length,18);assert.equal(new Set(slots.map(s=>s.questionSlotId)).size,18);
assert.deepEqual(slots.filter(s=>s.sourceVerificationStatus==='기출 검증 대기').map(s=>s.questionSlotId),['Q03','Q13','Q17']);
for(const slot of slots){
 assert(!Object.hasOwn(baseline.sceneHashes,slot.sceneId));
 if(!slot.questionId){assert.equal(slot.correctAnswer,null);continue;}
 const source=evidence.get(slot.officialQuestionId);assert(source,slot.questionSlotId+' official provenance missing');
 for(const field of ['examRound','examLevel','examQuestionNumber','correctAnswer'])assert.equal(slot[field],source[field]);
 assert(copy(`STORIES[${JSON.stringify(slot.reviewSceneId)}].linkedQuestionIds`).includes(slot.questionId));
 assert.equal(copy(`QUESTIONS.filter(q=>q.questionId===${JSON.stringify(slot.questionId)}).length`),1);
}
const main=copy('PROTO_STORY_SCRIPT').filter(c=>c.number>0&&c.number<7).flatMap(c=>c.scenes.filter(s=>!(c.number===6&&s.number>=9)));
const text=main.flatMap(s=>s.dialogues.map(d=>d.text)).join('\n');
for(const concept of ['5부족 연맹','사출도','마가·우가·저가·구가','영고','순장','1책 12법','5부','제가회의','서옥제','동맹','민며느리제','가족 공동 무덤','소금','어물','공납','고구려의 지배','족외혼','책화','무천','단궁','과하마','반어피','마한·진한·변한','여러 소국','신지','읍차','소도','천군','제정 분리','두레','5월','10월','변한','철','낙랑','왜'])assert(text.includes(concept),'missing spoken concept '+concept);
assert(!/나무패|부모님이 돌아가신|며칠 전.*손.*놓/.test(text),'conflicting new backstory');
let lines=0,branches=0;
const scenes=copy("Object.values(STORIES).filter(s=>s.eraId==='proto-kingdoms'&&s.storyActive!==false)");
for(const scene of scenes){
 run(`state.run=INITIAL_RUN(${JSON.stringify(scene.chapterId)});run().flags.protoStoryVersion=2;run().started=true;run().storyId=${JSON.stringify(scene.sceneId)};screen='game'`);
 const entries=copy(`conversationEntries(STORIES[${JSON.stringify(scene.sceneId)}],null)`);
 for(let i=0;i<entries.length;i++){
  run(`run().dialogueCursor=${i+1};render()`);
  assert(h.html().includes(run(`esc(${JSON.stringify(entries[i].dialogue)})`)),scene.sceneId+' dialogue '+i);lines++;
 }
 for(let i=0;i<(scene.choices||[]).length;i++){
  run(`state.run=INITIAL_RUN(${JSON.stringify(scene.chapterId)});run().started=true;run().storyId=${JSON.stringify(scene.sceneId)};applyChoice(state,run().storyId,${i});screen='game';render()`);
  const result=copy('run().pending.resultDialogues');assert.equal(result[0].characterId,'proto_modern');assert.equal(result[0].dialogue,scene.choices[i].label);
  for(let j=0;j<result.length;j++){run(`run().dialogueCursor=${j+1};render()`);assert(h.html().includes(run(`esc(${JSON.stringify(result[j].dialogue)})`)),scene.sceneId+' branch '+i+' line '+j);}
  if(!Object.hasOwn(baseline.sceneHashes,scene.sceneId))assert(/[.?!]$/.test(result[0].dialogue),'main choice is not a sentence: '+result[0].dialogue);
  branches++;
 }
}
console.log(`PASS: 22 protected runtime scenes/aliases, all original questions/cast/assets/renderers unchanged; 18 slots (15 verified, 3 pending); ${lines} dialogue frames and ${branches} branch results rendered.`);
