const fs=require('fs'),vm=require('vm'),crypto=require('crypto'),assert=require('assert');
const hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
function storyContent(s){const copy=JSON.parse(JSON.stringify(s));for(const field of ['illustrationId','backgroundImage','linkedQuestionIds','questionSequenceMode','questionSetId','afterChoiceQuestionSetId','questionSetResumeStoryId'])delete copy[field];for(const c of copy.choices||[])delete c.resultIllustrationId;return copy}
function practiceContent(q){const copy=JSON.parse(JSON.stringify(q));for(const field of ['relatedSceneId','relatedIllustrationId'])delete copy[field];return copy}
const source=process.argv[2];
if(source){const baseline=JSON.parse(fs.readFileSync(source,'utf8'));const fixture={saveVersion:baseline.SAVE_VERSION,stories:Object.fromEntries(Object.entries(baseline.STORIES).map(([id,s])=>[id,hash(storyContent(s))])),practice:Object.fromEntries(baseline.QUESTIONS.filter(q=>!q.isOfficial).map(q=>[q.questionId,hash(practiceContent(q))])),characters:hash(baseline.CHARACTERS)};fs.writeFileSync('tests/fixtures/v2-content-preservation.json',JSON.stringify(fixture,null,2));console.log('Baseline preservation hashes written');process.exit(0)}
const files=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(n=>!['app.js','v2-app.js','pwa.js'].includes(n));
const context=vm.createContext({});vm.runInContext(files.map(n=>fs.readFileSync('dist/'+n,'utf8')).join('\n')+';this.current={STORIES,QUESTIONS,CHARACTERS,SAVE_VERSION};',context);
const fixture=JSON.parse(fs.readFileSync('tests/fixtures/v2-content-preservation.json','utf8')),current=context.current;
for(const [id,digest]of Object.entries(fixture.stories))assert.equal(hash(storyContent(current.STORIES[id])),digest,'Story, dialogue, choice, chronology or save ID changed: '+id);
for(const [id,digest]of Object.entries(fixture.practice))assert.equal(hash(practiceContent(current.QUESTIONS.find(q=>q.questionId===id))),digest,'Original practice content changed: '+id);
assert.equal(current.SAVE_VERSION,fixture.saveVersion);assert.equal(hash(current.CHARACTERS),fixture.characters);
for(const q of current.QUESTIONS.filter(q=>q.isOfficial)){assert(q.sourceVerified&&q.examRound&&q.examYear&&q.examLevel&&q.questionNumber&&q.sourceFile&&q.answerFile&&q.sourceQuestionImage,'Unverified official: '+q.questionId);assert(fs.existsSync('dist/'+q.sourceQuestionImage),'Missing original image: '+q.questionId)}
console.log('PASS: every original story, dialogue, choice, chronology, character identity, practice question and save version preserved; all official records have original images.');
