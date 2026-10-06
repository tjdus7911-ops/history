const fs=require('fs'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(n=>n!=='pwa.js');
let html='',saved=null,handlers,context;
function boot(){handlers={};context=vm.createContext({Date,console,document:{querySelector:s=>s==='#app'?{set innerHTML(v){html=v}}:null,querySelectorAll:()=>[],addEventListener:(type,fn,capture)=>{(handlers[type]||=[]).push({fn,capture})},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>saved,setItem:(k,v)=>saved=v},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){}});run(scripts.map(n=>fs.readFileSync('dist/'+n,'utf8')).join('\n'));}
const run=s=>vm.runInContext(s,context),copy=s=>JSON.parse(run('JSON.stringify('+s+')'));
function click(dataset){run('inputLockedUntil=0');let stopped=false;const b={dataset,disabled:false};for(const {fn}of handlers.click.slice().sort((a,b)=>Number(!!b.capture)-Number(!!a.capture))){fn({target:{closest:()=>b},stopImmediatePropagation(){stopped=true}});if(stopped)break}}

boot();
const contentBefore=copy('({stories:STORIES,questions:QUESTIONS,chapters:CHAPTERS})');
assert(html.includes('data-nav="exam-library"'));assert(!html.includes('data-nav="era" aria-current="page"'));
assert.equal(run("libraryStatus('goryeo')"),'LOCKED');
assert.equal(run("libraryStatus('joseon')"),'LOCKED');for(const era of ['empire','occupation','republic'])assert.equal(run(`libraryStatus('${era}')`),'COMING_SOON');
run("meta().eraProgress.goryeo.progress=100");assert.equal(run("libraryStatus('goryeo')"),'LOCKED','numeric progress is never an unlock');
click({nav:'exam-library'});assert.equal((html.match(/class="library-era"/g)||[]).length,5);assert(!html.includes('<img'));
click({libraryEra:'goryeo'});assert(html.includes('기출문제 이용 안내'));assert(html.includes('data-era-resume="goryeo"'));
click({action:'close'});click({libraryEra:'joseon'});assert(html.includes('모든 챕터를 완료하면'));assert(html.includes('data-era-resume="joseon"'));
click({action:'close'});
run("meta().completedChapters=eraChapters('goryeo').slice(0,-1).map(ch=>ch.chapterId)");assert.equal(run("libraryStatus('goryeo')"),'LOCKED');
run("meta().completedChapters=eraChapters('goryeo').map(ch=>ch.chapterId)");assert.equal(run("libraryStatus('goryeo')"),'UNLOCKED');
const entries=copy('EXAM_LIBRARY_ENTRIES');assert.equal(entries.length,140);assert.equal(new Set(entries.map(e=>e.key)).size,140);assert.equal(entries.reduce((n,e)=>n+e.aliases.length,0),150);
assert.equal(entries.filter(e=>e.aliases.length>1).length,10);
assert.equal(run("libraryEntries('goryeo').length"),73);assert.equal(run("libraryEntries('joseon').length"),65);assert.equal(run("libraryEntries('empire').length"),1);
assert.equal(entries.filter(e=>e.needsVerification).length,1);assert.equal(entries.find(e=>e.key==='76:심화:50').primaryEra,'empire');
for(const e of entries){assert(e.primaryEra);for(const id of e.aliases)assert(contentBefore.questions.some(q=>q.questionId===id));const q=contentBefore.questions.find(q=>q.questionId===e.canonicalQuestionId);assert(fs.existsSync('dist/'+(e.libraryImage||q.sourceQuestionImage)));}
click({libraryEra:'goryeo'});assert.equal((html.match(/class="library-question"/g)||[]).length,73);
click({libraryLevel:'기본'});assert(!html.includes('회 심화'));assert(html.includes('회 기본'));click({libraryLevel:'all'});
const duplicate=entries.find(e=>e.aliases.length>1&&!e.needsVerification&&e.primaryEra==='goryeo');
run(`meta().questionRecords[${JSON.stringify(duplicate.aliases[1])}]={attempts:2,correctCount:0,lastCorrect:false};(meta().learningEvents||=[]).push({questionId:${JSON.stringify(duplicate.aliases[1])},correct:false,answeredAt:'2026-01-01T00:00:00Z'})`);
assert.equal(run("librarySummary('goryeo').attempted"),1);assert.equal(run("librarySummary('goryeo').wrong"),1);
const snapshot=run('JSON.stringify({run:state.run,mainRun:state.mainRun})');
click({libraryQuestion:duplicate.canonicalQuestionId});assert(html.includes('library-quiz'));assert(html.includes('data-library-back="list"'));
const q=copy('activeQuestion()');assert.equal(q.questionId,duplicate.canonicalQuestionId);
click({submitAnswer:'true'});assert.equal(run(`meta().questionRecords['${q.questionId}']`),undefined);
click({pickAnswer:String((q.answer+1)%q.choices.length)});click({submitAnswer:'true'});
assert.equal(run('JSON.stringify({run:state.run,mainRun:state.mainRun})'),snapshot,'library grading must not alter story state');
assert.equal(run(`meta().questionRecords['${q.questionId}'].attempts`),1);assert(run(`meta().wrongQuestionIds.includes('${q.questionId}')`));assert(html.includes('역사 해설'));
click({submitAnswer:'true'});assert.equal(run(`meta().questionRecords['${q.questionId}'].attempts`),1,'double submit is ignored');
click({action:'quiz-next'});assert.equal(run('screen'),'exam-era');assert.equal(run("librarySummary('goryeo').attempted"),1);
click({libraryQuestion:q.questionId});click({pickAnswer:String(q.answer)});click({submitAnswer:'true'});
assert.equal(run(`meta().questionRecords['${q.questionId}'].attempts`),2);assert.equal(run("librarySummary('goryeo').correct"),1);
assert.equal(run(`meta().questionRecords['${duplicate.aliases[1]}'].attempts`),2,'legacy alias record retained');
assert.equal(run('JSON.stringify({run:state.run,mainRun:state.mainRun})'),snapshot);
click({nav:'study'});assert(!run('librarySession'));assert(html.includes('오답노트'));assert(html.includes(q.questionId));
assert.deepEqual(copy('({stories:STORIES,questions:QUESTIONS,chapters:CHAPTERS})'),contentBefore,'story/question payloads unchanged');
// Verify home / other screen functions and all existing story renderer code are byte-identical to pre-library implementation.
const current=fs.readFileSync('dist/editorial-ui.js','utf8');
const preserved=current.split('/* Standalone exam library.')[0].replace(/shell=function\(content\)\{[^\n]+\n/,'').trim();
assert.equal(crypto.createHash('sha256').update(preserved).digest('hex'),'62fb16c24ead1e098d105716976713e1c156eb8f03dd2f4578cfac029c7a588f','existing UI implementation preserved');
console.log('PASS: exam library classification, unique IDs, unlock, images, legacy history, grading, wrong notebook and isolation');
