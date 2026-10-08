const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]).filter(name=>name!=='pwa.js');
let html='',saved=null,handlers={},context;
context=vm.createContext({Date,console,document:{querySelector:selector=>selector==='#app'?{set innerHTML(value){html=value}}:null,querySelectorAll:()=>[],addEventListener:(type,handler,capture)=>{(handlers[type]||=[]).push({handler,capture})},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){}});
const run=code=>vm.runInContext(code,context),copy=code=>JSON.parse(run('JSON.stringify('+code+')'));
run(scripts.map(name=>fs.readFileSync('dist/'+name,'utf8')).join('\n'));
function click(dataset){run('inputLockedUntil=0');let stopped=false;const button={dataset,disabled:false};for(const item of (handlers.click||[]).slice().sort((a,b)=>Number(Boolean(b.capture))-Number(Boolean(a.capture)))){item.handler({target:{closest:()=>button},stopImmediatePropagation(){stopped=true}});if(stopped)break}}

const inventory=JSON.parse(fs.readFileSync('dist/official-exam-inventory.json','utf8'));
assert.equal(inventory.examEditionCount,36);assert.equal(inventory.advancedEditionCount,23);assert.equal(inventory.basicEditionCount,13);
assert.equal(inventory.canonicalQuestionCount,1800);assert.equal(inventory.processedFileCount,72);assert.equal(inventory.duplicateFiles.length,7);assert.equal(inventory.deferredFiles.length,1);
assert.equal(new Set(inventory.exams.map(exam=>exam.examRound+':'+exam.examLevel)).size,36);
for(const exam of inventory.exams){assert.equal(exam.questionCount,50);assert.equal(exam.answerCount,50);assert(/^[a-f0-9]{64}$/.test(exam.questionPdfSha256));assert(/^[a-f0-9]{64}$/.test(exam.answerPdfSha256))}

const entries=copy('globalThis.OFFICIAL_EXAM_CATALOG'),sources=copy('globalThis.OFFICIAL_EXAM_SOURCE_RECORDS');
assert.equal(entries.length,1800);assert.equal(sources.length,1800);assert.equal(new Set(entries.map(entry=>entry.key)).size,1800);assert.equal(new Set(entries.map(entry=>entry.canonicalQuestionId)).size,1800);
assert.equal(copy('globalThis.OFFICIAL_ERA_TAXONOMY').length,6);for(const era of ['ancient','goryeo','joseon','empire','occupation','republic'])assert.equal(run(`libraryStatus('${era}')`),'UNLOCKED');
for(const entry of entries){const question=copy(`QUESTIONS.find(question=>question.questionId===${JSON.stringify(entry.canonicalQuestionId)})`);assert(question);assert.equal(question.officialQuestionId,entry.canonicalQuestionId);assert.equal(question.sourceStatus,'verified');assert.equal(question.needsVerification,false);assert(fs.existsSync(path.join('dist',entry.libraryImage)),entry.libraryImage)}
const fixed=copy("QUESTIONS.find(question=>question.examRound===70&&question.examLevel==='심화'&&question.questionNumber===13)");assert.equal(fixed.answer,0);assert.equal(fixed.answerLabel,'①');assert.equal(fixed.needsVerification,false);assert(!/missing_pdf/i.test(JSON.stringify(fixed)));
const corrected=copy("QUESTIONS.find(question=>question.examRound===63&&question.examLevel==='심화'&&question.questionNumber===42)");assert.deepEqual(corrected.acceptedAnswers,[0,1,2,3,4]);
const recovery=copy('globalThis.OFFICIAL_EXAM_RECOVERY_REPORT');assert.equal(recovery.legacyMissingPdfIds.length,4);assert.equal(recovery.recoveredMissingPdfIds.length,4);assert.equal(recovery.round70Advanced13.answer,0);

assert.equal((html.match(/class="nav"/g)||[]).length,1);for(const nav of ['home','exam-library','association','study','records'])assert(html.includes(`data-nav="${nav}"`));
click({nav:'exam-library'});assert.equal((html.match(/class="official-card"/g)||[]).length,6);assert(!html.includes('LOCK'));assert(html.includes('등록이 완료된 공식 기출은 모두 바로'));
click({officialTab:'round'});assert.equal((html.match(/class="official-card round"/g)||[]).length,36);
click({officialRound:'70',officialEditionLevel:'심화'});assert(html.includes('제70회 · 심화'));assert(html.includes('<b>50</b>'));
const storySnapshot=run('JSON.stringify({run:state.run,mainRun:state.mainRun})');
click({officialStart:'exam'});assert(html.includes('시험 모드'));
const round70=entries.filter(entry=>entry.sourceRecord.examRound===70&&entry.sourceRecord.examLevel==='심화').sort((a,b)=>a.sourceRecord.questionNumber-b.sourceRecord.questionNumber);
for(const entry of round70){const answer=(entry.sourceRecord.acceptedAnswers||[entry.sourceRecord.answer])[0];click({officialPick:String(answer)});click({officialNext:'true'})}
assert(html.includes('OFFICIAL EXAM RESULT'));assert(html.includes('50 / 50'));assert(html.includes('100 / 100'));for(const label of ['총 문제','정답','오답','점수','정답률','시대별 정답률','취약 시대'])assert(html.includes(label));assert.equal(run('JSON.stringify({run:state.run,mainRun:state.mainRun})'),storySnapshot,'exam grading must not alter story progress');
for(const entry of round70)assert.equal(run(`meta().questionRecords[${JSON.stringify(entry.canonicalQuestionId)}].attempts`),1);

const legacyEntry=entries.find(entry=>entry.aliases.length>1);if(legacyEntry){const alias=legacyEntry.aliases.find(id=>id!==legacyEntry.canonicalQuestionId);if(alias){run(`recordQuestion(state,${JSON.stringify(alias)},QUESTIONS.find(question=>question.questionId===${JSON.stringify(alias)}).acceptedAnswers[0])`);assert.equal(run(`meta().questionRecords[${JSON.stringify(legacyEntry.canonicalQuestionId)}].attempts`),1);assert.equal(run(`meta().questionRecords[${JSON.stringify(alias)}]`),undefined)}}

click({nav:'association'});const baseline=copy('globalThis.MNEMONIC_IMPORT_BASELINE'),publishedBaseline=baseline.filter(item=>item.publicationStatus==='PUBLISHED'),pendingBaseline=baseline.filter(item=>item.publicationStatus!=='PUBLISHED'),memories=copy('globalThis.ASSOCIATION_MEMORIES'),expectedPublished=memories.filter(item=>item.status==='published').length;assert.equal(baseline.length,118);assert.equal(new Set(baseline.map(item=>item.sourceId)).size,118);assert.equal(new Set(baseline.map(item=>item.sourceMnemonic)).size,118);assert(baseline.every(item=>item.era&&item.memoryType&&item.sourceMnemonic&&item.sourceMnemonic!==item.title));assert(publishedBaseline.every(item=>item.facts.length>0&&item.facts.every(fact=>fact.cue&&fact.title)&&item.background&&item.causalFlow.length&&item.examPoints.length));assert.equal(pendingBaseline.length+publishedBaseline.length,118);assert.equal((html.match(/data-association-open=/g)||[]).length,expectedPublished);assert.equal(copy('globalThis.ASSOCIATION_MEMORY_CANDIDATES').length,pendingBaseline.length);assert(!html.includes('candidate')&&!html.includes('후보'));assert(html.includes('발해–공산–고창–신라–통일')&&html.includes('무갑기을')&&html.includes('병제병문한정양')&&html.includes('태정태세문단세')&&html.includes('경복·창덕·창경·경희·경운')&&html.includes('훈어총수금'));assert(!html.includes('광노(안)과 공복'),'internal source mnemonic leaked');
assert(html.includes('data-association-search')&&html.includes('시대 필터')&&html.includes('선사·고대')&&html.includes('근현대'),'mnemonic search/era filters missing');
const genericMemory=/중요한 사건|핵심 개념을 기억|시험에 자주 출제|시대를 판단/;
assert.equal(memories.filter(item=>item.status==='published').length,expectedPublished);assert.equal(new Set(memories.map(item=>item.id)).size,memories.length);assert(memories.every(item=>item.mnemonic&&item.mnemonic.length>1&&item.mnemonic.replace(/\s+/g,'')!==item.title.replace(/\s+/g,'')),'published cards need a public mnemonic distinct from the title');assert(publishedBaseline.every(item=>memories.some(memory=>memory.id===item.id&&memory.mnemonic===item.mnemonic)), 'every published canonical mnemonic must be visible');const importedMemories=memories.filter(item=>item.sourceId);assert(importedMemories.every(item=>item.memoryType&&item.category&&item.sourceMnemonic&&item.publicMnemonic&&Array.isArray(item.sourceFacts)&&Array.isArray(item.verifiedFacts)),'published canonical cards need structured mnemonic metadata');const officialIds=new Set(entries.map(entry=>entry.canonicalQuestionId)),sceneIds=new Set(copy('Object.keys(STORIES)'));for(const item of memories){for(const questionId of item.relatedOfficialQuestionIds)assert(officialIds.has(questionId),item.id+' has invalid officialQuestionId');for(const sceneId of item.relatedSceneIds)assert(sceneIds.has(sceneId),item.id+' has invalid relatedSceneId');}
for(const item of memories){
 // Zero verified connections are valid.
 assert.equal(item.steps.length,item.sequence.length,item.id+' step/recall mismatch');
 assert.deepEqual(item.sequence,item.steps.map(step=>step.recallTitle||step.title),item.id+' recall order changed');
 for(const step of item.steps){assert(step.title&&step.shortExplanation&&step.cue,item.id+' incomplete step');assert(!genericMemory.test(step.shortExplanation),item.id+' generic step explanation');assert((step.shortExplanation.match(/[.!?](?:\s|$)/g)||[]).length>=1&&((step.shortExplanation.match(/[.!?](?:\s|$)/g)||[]).length<=2),item.id+' explanation must be 1-2 sentences')}
 click({associationOpen:item.id});
 assert.equal((html.match(/class="association-question"/g)||[]).length,item.relatedOfficialQuestionIds.length,item.id+' actual link count');
 assert.equal((html.match(/data-association-step=/g)||[]).length,item.steps.length,item.id+' accordion rows');
 assert.equal((html.match(/aria-expanded="false"/g)||[]).length,item.steps.length,item.id+' defaults closed');
 click({associationStep:'0'});assert.equal((html.match(/aria-expanded="true"/g)||[]).length,1,item.id+' first row opens');
 if(item.steps.length>1){click({associationStep:'1'});assert.equal((html.match(/aria-expanded="true"/g)||[]).length,2,item.id+' multiple rows open');}
 click({associationStep:'0'});assert.equal((html.match(/aria-expanded="true"/g)||[]).length,item.steps.length>1?1:0,item.id+' row closes independently');
 click({associationBack:'true'});
}
const unopened=memories.find(item=>item.id==='memory-palaces');assert.equal(run(`meta().associationMemoryStatus?.[${JSON.stringify(unopened.id)}]`),undefined);click({associationOpen:unopened.id});assert.equal(run(`meta().associationMemoryStatus?.[${JSON.stringify(unopened.id)}]`),undefined,'opening a detail must not change learning status');click({associationBack:'true'});
const recallQaIds=['gong-go-sin-il','mu-gap-gi-eul','byeong-je-byeong-o-sin-cheok','joseon-kings'],observedAnswerPositions=[];
for(const memoryId of recallQaIds){
 const item=memories.find(memory=>memory.id===memoryId),cueReview=item.steps.map(step=>step.cue).join(' · ');
 click({associationOpen:item.id});click({associationRecall:item.id});
 assert(html.includes('RECALL TEST · 1 /'),item.id+' progress missing');
 assert(!html.includes(item.title),item.id+' mnemonic title leaked before answer');
 assert(!html.includes(cueReview),item.id+' mnemonic cue line leaked before answer');
 if(item.id==='joseon-kings')for(const step of item.steps)assert(!html.includes(step.cue),'king mnemonic leaked before answer: '+step.cue);
 assert(html.includes(item.steps[0].title),item.id+' question context missing');
 assert(!html.includes('association-recall-review'),item.id+' review leaked before answer');
 const optionOrder=[...html.matchAll(/data-association-answer="([^"]+)"/g)].map(match=>match[1]);assert.equal(optionOrder.length,Math.min(4,item.steps.length),item.id+' choice count');assert(optionOrder.includes(item.steps[1].title),item.id+' correct choice missing');assert(optionOrder.every(option=>item.steps.some(step=>step.title===option)),item.id+' choices must use event titles');observedAnswerPositions.push(optionOrder.indexOf(item.steps[1].title));
 run('render()');assert.deepEqual([...html.matchAll(/data-association-answer="([^"]+)"/g)].map(match=>match[1]),optionOrder,item.id+' choices moved during rerender');
 click({associationAnswer:item.steps[1].title});
 assert(html.includes('✓ 정답입니다.'),item.id+' correct feedback missing');
 assert(html.includes(item.title),item.id+' mnemonic title not revealed after answer');
 assert(html.includes(cueReview),item.id+' mnemonic cue line not revealed after answer');
 for(const step of item.steps)assert(html.includes(step.title),item.id+' full order review missing '+step.title);
 click({associationCancel:'true'});click({associationBack:'true'});
}
assert(new Set(observedAnswerPositions).size>1,'correct choice must not always use the same position');
const wrongMemory=memories.find(item=>item.id==='mu-gap-gi-eul');click({associationOpen:wrongMemory.id});click({associationRecall:wrongMemory.id});const wrongChoice=[...html.matchAll(/data-association-answer="([^"]+)"/g)].map(match=>match[1]).find(option=>option!==wrongMemory.steps[1].title);click({associationAnswer:wrongChoice});assert(html.includes('✕ 아쉬워요.'));assert(html.includes('정답:'));assert(html.includes(wrongMemory.title));assert(html.includes(wrongMemory.steps[3].title));click({associationCancel:'true'});click({associationBack:'true'});
const memory=memories.find(item=>item.id==='gong-go-sin-il');assert.deepEqual(memory.sequence,['발해 멸망','공산전투','고창전투','신라 멸망/항복 관련','후삼국 통일']);click({associationOpen:memory.id});assert(html.includes('<span class="association-cue">공</span>산전투'));assert(html.includes('927년 고려가 후백제에 패하고 신숭겸이 전사한 전투'));assert.equal(run(`meta().associationMemoryStatus[${JSON.stringify(memory.id)}]`),'LEARNING');click({associationRecall:memory.id});for(const answer of memory.steps.slice(1).map(step=>step.title)){click({associationAnswer:answer});assert(html.includes('✓ 정답입니다.'));click({associationNext:'true'})}assert.equal(run(`meta().associationMemoryStatus[${JSON.stringify(memory.id)}]`),'MEMORIZED');assert(!html.includes('RECALL TEST'));

const associationCss=fs.readFileSync('dist/exam-memory.css','utf8');assert(associationCss.includes('min-height:58px'));assert(associationCss.includes('grid-template-rows .24s ease'));assert(associationCss.includes('.association-step.open .association-chevron'));assert(associationCss.includes('.association-recall-question'));assert(associationCss.includes('.association-recall-review'));

click({nav:'records'});assert(html.includes('시대별 기출 기록'));assert(html.includes('누적 풀이'));assert(run('Object.keys(meta().questionRecords).length')>=50);
click({nav:'study'});assert(html.includes('오답노트'));
assert.equal(run('globalThis.EXAM_MEMORY_UI_READY'),true);
console.log('PASS: 1,800 canonical official questions, 36 editions, reusable mnemonic accordions, hint-free stable Recall Test choices, post-answer mnemonic review, preserved official grading and shared records.');
