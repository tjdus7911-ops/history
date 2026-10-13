/* Only the legacy entry boundaries uncovered by the Three integration review. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(f=>f!=='pwa.js');
if(!scripts.includes('three-learning-boundary.js'))scripts.push('three-learning-boundary.js');
let context,listeners,html='',storage={};
function boot(reset=false){
  if(reset)storage={};listeners=[];
  const app={set innerHTML(value){html=value},get innerHTML(){return html}};
  context=vm.createContext({Date,console,URL,document:{querySelector:s=>s==='#app'?app:null,querySelectorAll:()=>[],
    addEventListener:(type,fn,capture)=>{if(type==='click')listeners.push({fn,capture:capture===true})},
    createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},
    localStorage:{getItem:key=>storage[key]||null,setItem:(key,value)=>{storage[key]=value},removeItem:key=>{delete storage[key]}},
    window:{scrollTo(){},addEventListener(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){}});
  for(const file of scripts)vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context,{filename:file});
}
const run=code=>vm.runInContext(code,context),copy=code=>JSON.parse(run('JSON.stringify('+code+')'));
function click(dataset){
  run('inputLockedUntil=0');let stopped=false;const button={dataset,disabled:false};
  const event={target:{closest:selector=>selector==='button'?button:null},stopImmediatePropagation(){stopped=true},stopPropagation(){},preventDefault(){}};
  for(const listener of [...listeners.filter(v=>v.capture),...listeners.filter(v=>!v.capture)]){listener.fn(event);if(stopped)break;}
}
function canonical(id){return run('OFFICIAL_EXAM_CATALOG.find(e=>e.sourceRecord.officialQuestionId==='+JSON.stringify(id)+').canonicalQuestionId');}
function officialAttempt(id,answer=4){click({officialSingle:canonical(id)});click({officialPick:String(answer)});click({officialSubmit:'true'});}
const firstId='official-64-advanced-03',gateId='official-79-advanced-09';
boot(true);
// Stored counters do not mark a new manuscript or its questions completed.
run('meta().questionRecords['+JSON.stringify(canonical(firstId))+']={attempts:2,correctCount:1,lastCorrect:false};save()');
boot();
assert.equal(run('meta().threeCompleteBook.answeredQuestionIds.length'),0);
const foreign=copy('run()');

// Locked Three wrappers do not appear or enter through old practice/recall UI.
assert(!run('v2OfficialStudy()').includes('data-practice="THR-'+gateId+'"'));
assert(!run("eraExamList('three-kingdoms')").includes('data-practice="THR-'));
const oldScreen=run('screen');click({practice:'THR-'+gateId});assert.equal(run('screen'),oldScreen);
click({storyMemory:'THR-'+gateId});assert.equal(run('modal'),null);
assert.deepEqual(copy('run()'),foreign);

// A fresh independent attempt uses the same official identity, while keeping
// the current era's run and the manuscript's read/unlock state intact.
officialAttempt(firstId,run('THREE_STORY_RUNTIME.questionByOfficialId.get('+JSON.stringify(firstId)+').answer'));
assert.deepEqual(copy('run()'),foreign);
assert.deepEqual(copy('meta().threeCompleteBook.answeredQuestionIds'),[firstId]);
assert.equal(run('meta().threeCompleteBook.readSceneIds.length'),0);
assert.equal(run('meta().threeCompleteBook.unlockedQuestionIds.length'),0);
officialAttempt(firstId,0);
assert.deepEqual(copy('meta().threeCompleteBook.answeredQuestionIds'),[firstId]);
assert.deepEqual(copy('run()'),foreign);

// Source aliases in the independent catalog also respect the one delayed
// comparison explanation while the learner is in the Three context.
run("selectedEra='three-kingdoms';meta().selectedLearningEra=selectedEra;meta().threeCompleteBook.readSceneIds=['THR-C23-S01','THR-C23-S02','THR-C23-S03','THR-C23-S04','THR-C23-S05']");
const safe=run('THREE_COMPLETE_ACTIONS.safeExplanation(THREE_STORY_RUNTIME.questionByOfficialId.get('+JSON.stringify(gateId)+'))');
const original=run('QUESTIONS.find(q=>q.questionId==='+JSON.stringify(canonical(gateId))+').explanation');
const visibleOriginal=/OCR 전사|OCR 원문 확인|추가 검수|추가 대조|검수 전까지|검수가 끝나지|확정 사실로 사용하지/.test(original)?'원문 확인 중':original;
click({officialTab:'round'});officialAttempt(gateId);
assert(html.includes(run('esc('+JSON.stringify(safe)+')')));
assert(!html.includes(run('esc('+JSON.stringify(original)+')'))||original===safe);
assert.deepEqual(copy('run()'),foreign);

// An explicit different era remains an independent study context.
click({officialEra:'goryeo'});officialAttempt(gateId);
assert(html.includes(run('esc('+JSON.stringify(visibleOriginal)+')')));
assert.deepEqual(copy('run()'),foreign);

// Wrong notes for the Three wrapper receive the same scene-aware explanation.
const threeGate='THR-'+gateId;
run('meta().questionRecords['+JSON.stringify(threeGate)+']={attempts:1,correctCount:0,lastAnswer:0,lastCorrect:false}');
assert(run('v2QuestionRow(THREE_STORY_RUNTIME.questionByOfficialId.get('+JSON.stringify(gateId)+'))').includes(run('esc('+JSON.stringify(safe)+')')));
run("meta().threeCompleteBook.readSceneIds.push('THR-C23-S10')");
const full=run('THREE_STORY_RUNTIME.questionByOfficialId.get('+JSON.stringify(gateId)+').threeExam.explanation');
assert(run('v2QuestionRow(THREE_STORY_RUNTIME.questionByOfficialId.get('+JSON.stringify(gateId)+'))').includes(run('esc('+JSON.stringify(full)+')')));
click({officialTab:'round'});officialAttempt(gateId);
assert(html.includes(run('esc('+JSON.stringify(visibleOriginal)+')')));

// Open a learned Three question through the old UI while another era runs.
click({practice:threeGate});click({threeAnswer:'4'});click({action:'three-submit'});
assert.deepEqual(copy('run()'),foreign);
run("modal=null;reviewQuestionId=null;reviewAnswer=null;quizMode='story';screen='study'");
click({storyMemory:threeGate});assert.equal(run('modal.type'),'v2-memory');
assert.deepEqual(copy('run()'),foreign);

// All first/review/additional placements unlock one item per official source.
run('modal=null;meta().threeCompleteBook=THREE_SAVE_V3.emptyBook()');
assert.equal(run("THREE_COMPLETE_EXAMS.schedule.filter(row=>row.playMode==='first').length"),98);
assert.equal(run("THREE_COMPLETE_EXAMS.schedule.filter(row=>row.playMode==='review').length"),99);
assert.equal(run('THREE_COMPLETE_EXAMS.additionalCandidates.length'),26);
for(const sceneId of copy('THREE_STORY_RUNTIME.order')){
  run('meta().threeCompleteBook.readSceneIds.push('+JSON.stringify(sceneId)+');THREE_COMPLETE_ACTIONS.unlockLearnedQuestions()');
  const expected=copy("[...new Set([...THREE_COMPLETE_EXAMS.schedule,...THREE_COMPLETE_EXAMS.additionalCandidates].filter(row=>meta().threeCompleteBook.readSceneIds.includes(row.quizAfterSceneId)).map(row=>row.officialQuestionId))].sort()");
  assert.deepEqual(copy('meta().threeCompleteBook.unlockedQuestionIds.slice().sort()'),expected);
}
assert.equal(run('meta().threeCompleteBook.unlockedQuestionIds.length'),99);
assert.equal(run('THREE_RECORD_BOOK.questionRows().length'),99);
assert.equal((run("eraExamList('three-kingdoms')").match(/data-practice=/g)||[]).length,99);

// Independent catalog history must not skip a question in a fresh story run.
run('meta().threeCompleteBook=THREE_SAVE_V3.emptyBook()');
officialAttempt(firstId,run('THREE_STORY_RUNTIME.questionByOfficialId.get('+JSON.stringify(firstId)+').answer'));
run(`state.mainRun=null;state.run=THREE_SAVE_V3.freshRun(true);selectedEra='three-kingdoms';modal=null;
  const row=THREE_STORY_RUNTIME.firstScheduleFor(${JSON.stringify(firstId)}),source=STORIES[row.quizAfterSceneId];
  run().currentChapter=source.chapterId;run().storyId=source.sceneId;run().dialogueSceneId=source.sceneId;
  THREE_COMPLETE_ACTIONS.phaseState(source).phase='join';THREE_COMPLETE_ACTIONS.checkpoint(source);`);
assert(copy('run().questionQueue').includes('THR-'+firstId));
assert(run('run().activeQuestionId')==='THR-'+firstId || run('THREE_COMPLETE_ACTIONS.phaseState(STORIES[run().storyId]).phase')==='hints');
console.log('PASS Three learning boundaries: locked legacy entry/recall, independent official dedup, delayed explanations across aliases, explicit other-era behavior, unchanged foreign runs, all 99 unlocks.');
