const fs=require('fs'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(n=>n!=='pwa.js');
let html='',saved=null,handlers,context;
function boot(){handlers={};context=vm.createContext({Date,console,document:{querySelector:s=>s==='#app'?{set innerHTML(v){html=v}}:null,querySelectorAll:()=>[],addEventListener:(type,fn,capture)=>{(handlers[type]||=[]).push({fn,capture})},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>saved,setItem:(k,v)=>saved=v},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){}});run(scripts.map(n=>fs.readFileSync('dist/'+n,'utf8')).join('\n'));}
const run=s=>vm.runInContext(s,context),copy=s=>JSON.parse(run('JSON.stringify('+s+')'));
function click(dataset){run('inputLockedUntil=0');let stopped=false;const b={dataset,disabled:false};for(const {fn}of handlers.click.slice().sort((a,b)=>Number(!!b.capture)-Number(!!a.capture))){fn({target:{closest:()=>b},stopImmediatePropagation(){stopped=true}});if(stopped)break}}
boot();
assert(html.includes('오늘의 학습')&&html.includes('최근 학습')&&html.includes('최근 오답'));
assert(!html.includes('ed-chapter-row'));assert.equal((html.match(/data-era-slide=/g)||[]).length,7);
const heroes=copy('LEARNING_ERAS.map(e=>eraHero(e.id))');assert.equal(heroes.filter(Boolean).length,5);assert.equal(new Set(heroes.filter(Boolean)).size,5);
const hashes=new Set();for(const c of copy('Object.values(ERA_PROTAGONISTS)')){assert.equal(c.id,run(`eraProtagonist('${c.era}').id`));for(const file of Object.values(c.assetPaths)){assert(fs.existsSync('dist/'+file));hashes.add(crypto.createHash('sha256').update(fs.readFileSync('dist/'+file)).digest('hex'))}for(const file of Object.values(c.conceptAssetPaths||{}))assert(fs.existsSync('dist/'+file))}
assert.equal(hashes.size,18,'existing Goryeo/Joseon protagonist art remains independent and unchanged');
assert.deepEqual(copy('Object.values(ERA_PROTAGONISTS).map(c=>c.gender)'),['UNSPECIFIED','UNSPECIFIED','male','female','UNSPECIFIED','UNSPECIFIED','UNSPECIFIED']);
assert.equal(run("eraProtagonist('missing')"),null);assert.equal(run("eraSceneVisuals('joseon',{backgroundId:'goryeo-gaegyeong-cover',year:1398})"),null);
for(const b of copy('Object.values(ERA_BACKGROUNDS)')){assert(b.era&&b.yearRange.length===2&&b.location&&b.event&&b.timeOfDay);assert(fs.existsSync('dist/'+b.src))}
run("const fixtureBackground={id:'test-only',era:'joseon',yearRange:[1395,1398],location:'hanyang',event:'city',usage:'story',src:'test.webp'}; ERA_BACKGROUNDS['test-only']=fixtureBackground");
assert.equal(run("eraSceneVisuals('joseon',{backgroundId:'test-only',year:1398,location:'hanyang',event:'city',outfit:'earlyJoseon'}).protagonistId"),'protagonist_joseon');
assert.equal(run("eraSceneVisuals('joseon',{backgroundId:'test-only',year:1592,location:'hanyang',event:'war',outfit:'earlyJoseon'})"),null);run("delete ERA_BACKGROUNDS['test-only']");
const empty=copy('periodLearning(meta())');assert.equal(empty.attempts,0);assert.equal(empty.accuracy,null);assert.equal(run('learningReadiness(meta()).score'),null);
run("const testId='ch06-official-79-advanced-13';state.meta.questionRecords={[testId]:{attempts:8,correctCount:3,lastCorrect:false}};state.meta.wrongQuestionIds=[testId,testId];state.meta.learningEvents=[{questionId:testId,correct:true,answeredAt:'2026-10-05T10:00:00+09:00'},{questionId:testId,correct:false,answeredAt:'2026-10-04T10:00:00+09:00'},{questionId:testId,correct:false},{questionId:testId,correct:false,answeredAt:'2099-01-01T00:00:00Z'}];");
const daily=copy("periodLearning(meta(),'today','all',new Date('2026-10-05T12:00:00+09:00'))");assert.equal(daily.attempts,1);assert.equal(daily.correct,1);assert.equal(daily.wrong,0);assert.equal(daily.streak,2);
assert.equal(run("periodLearning(meta(),'7','all',new Date('2026-10-05T12:00:00+09:00')).attempts"),2);assert.equal(run("periodLearning(meta(),'all').attempts"),8);assert.equal(run("periodLearning(meta(),'all','joseon').attempts"),0);
const ready=copy('learningReadiness(meta())');assert.equal(ready.studied,1);assert.equal(ready.attempts,2);assert.equal(ready.score,Math.round(100*(.5*.55+1/ready.total*.25)));
assert.equal(run('editorialWrongQuestions().length'),1);run("wrongEra='joseon'");assert.equal(run('editorialWrongQuestions().length'),0);run("wrongEra='all';wrongFilter='repeated'");assert.equal(run('editorialWrongQuestions().length'),1);
run("state.meta.learningEvents=[];state.meta.wrongQuestionIds=[testId];wrongFilter='all';save()");
const originalRun=run('JSON.stringify(state.run)');click({eraOpen:'joseon'});assert(html.includes('assets/editorial/heroes/joseon.webp'));assert.equal((html.match(/class="ed-chapter-row/g)||[]).length,23);assert(html.includes('data-era-resume="joseon"'));assert.equal(run('JSON.stringify(state.run)'),originalRun);
click({eraOpen:'goryeo'});assert.equal((html.match(/class="ed-chapter-row/g)||[]).length,12);run("meta().eraProgress.joseon={lastScene:'future-test',progress:0};save()");boot();assert.equal(run('meta().eraProgress.joseon.lastScene'),'future-test');assert.equal(run('JSON.stringify(state.run)'),originalRun);
click({practice:'ch06-official-79-advanced-13'});assert(html.includes('official-source-question'));assert(html.indexOf('quiz-recall')>html.indexOf('quiz-submit-row'));assert(html.includes('assets/scenes/ch06-tripitaka-workshop.webp'));
const before=run('JSON.stringify(meta().questionRecords)');click({submitAnswer:'true'});assert.equal(run('JSON.stringify(meta().questionRecords)'),before);
const q=copy('activeQuestion()');click({pickAnswer:String((q.answer+1)%q.choices.length)});assert.equal(run('JSON.stringify(meta().questionRecords)'),before);assert(!html.includes('class="feedback"'));assert.equal(run('quizDraft()'),(q.answer+1)%q.choices.length);
click({pickAnswer:String(q.answer)});click({submitAnswer:'true'});assert(html.includes('역사 해설'));assert.equal(run(`meta().questionRecords['${q.questionId}'].attempts`),9);assert.equal(run(`meta().questionRecords['${q.questionId}'].correctCount`),4);assert(run(`meta().wrongQuestionIds.includes('${q.questionId}')`),'wrong history preserved after success');
const after=run('JSON.stringify(meta().questionRecords)');click({submitAnswer:'true'});assert.equal(run('JSON.stringify(meta().questionRecords)'),after);
const runBeforeMemory=run('JSON.stringify(state.run)');click({storyMemory:q.questionId});assert(html.includes('관련 스토리 다시 보기'));assert.equal(run('JSON.stringify(state.run)'),runBeforeMemory);click({action:'close'});
click({nav:'records'});assert(html.includes('예상 준비도'));assert(html.includes('학습 캘린더'));click({recordEra:'joseon'});assert(html.includes('학습 기록이 쌓이면'));assert(!html.includes('class="weak-row"'));
// All latest UI source files and artwork are included in the build/cache contract.
const worker=fs.readFileSync('dist/sw.js','utf8');for(const n of ['editorial-ui.js','editorial.css','era-visuals.js','season-data.js'])assert(worker.includes('/'+n));
console.log('PASS: seven-season editorial UI, distinct protagonist identities, strict scene lookup, independent resume, real date metrics/readiness, deduplicated wrong filters, explicit answer confirmation, preserved retry history, exact recall and calendar.');
