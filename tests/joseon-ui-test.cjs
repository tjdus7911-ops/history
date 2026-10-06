const fs=require('fs'),vm=require('vm'),assert=require('assert');

const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]).filter(file=>file!=='pwa.js');
let html='',saved=null,handlers={},context;
const run=source=>vm.runInContext(source,context),copy=source=>JSON.parse(run('JSON.stringify('+source+')'));

function boot(){
  handlers={};
  context=vm.createContext({Date,console,document:{
    querySelector:selector=>selector==='#app'?{set innerHTML(value){html=value}}:null,
    querySelectorAll:()=>[],
    addEventListener:(type,handler,capture)=>{(handlers[type]||=[]).push({handler,capture})},
    createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}
  },localStorage:{getItem:()=>saved,setItem:(key,value)=>{saved=value}},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){}});
  run(scripts.map(file=>fs.readFileSync('dist/'+file,'utf8')).join('\n'));
}

function click(dataset){
  run('inputLockedUntil=0');
  let stopped=false;const button={dataset,disabled:false};
  for(const {handler} of (handlers.click||[]).slice().sort((a,b)=>Number(!!b.capture)-Number(!!a.capture))){
    handler({target:{closest:()=>button},stopImmediatePropagation(){stopped=true},stopPropagation(){stopped=true}});
    if(stopped)break;
  }
}

boot();
assert.equal(run("eraInfo('joseon').available"),true);
assert.equal(run("eraChapters('joseon').length"),23);
assert.equal(run("libraryStatus('joseon')"),'LOCKED');
assert.equal(run("libraryEntries('joseon').length"),65);
assert.equal(run('EXAM_LIBRARY_ENTRIES.length'),140);

const originalRun=run('JSON.stringify(state.run)');
click({eraOpen:'joseon'});
assert.equal((html.match(/class="ed-chapter-row/g)||[]).length,23);
assert(html.includes('data-era-resume="joseon"'));
assert(html.includes('조선 처음부터 다시하기'));
assert.equal(run('JSON.stringify(state.run)'),originalRun,'opening Joseon detail must not mutate story');

click({eraResume:'joseon'});
assert.equal(run('run().currentChapter'),'joseon-ch00');
assert.equal(run('run().storyId'),'joseon_ch00_s1');
assert.equal(run('screen'),'game');
assert(html.includes('경복궁의 비'));
run("run().storyId='joseon_ch00_s3';enterStory();save()");
const resumeSnapshot=copy('({chapter:run().currentChapter,story:run().storyId,selected:meta().selectedLearningEra})');
boot();
assert.deepEqual(copy('({chapter:run().currentChapter,story:run().storyId,selected:meta().selectedLearningEra})'),resumeSnapshot);

run("meta().completedChapters=['joseon-ch00'];state.run=INITIAL_RUN('joseon-ch00');state.run.started=true;state.run.completed=true;selectedEra='joseon';screen='era';render()");
click({chapter:'joseon-ch01'});
assert(html.includes('CHAPTER 01 시작하기'));
click({action:'start-chapter',chapter:'joseon-ch01'});
assert.equal(run('run().currentChapter'),'joseon-ch01');
assert.equal(run('run().storyId'),'joseon_ch01_s1');
assert.equal(run('screen'),'game');

const questionId=run("QUESTIONS.find(q=>q.primaryEra==='joseon'&&q.isOfficial).questionId");
run(`state.run=INITIAL_RUN('joseon-ch01');state.run.started=true;state.run.activeQuestionId=${JSON.stringify(questionId)};state.run.questionQueue=[${JSON.stringify(questionId)}];state.run.questionQueueIndex=0;quizMode='story';screen='quiz';render()`);
const question=copy('activeQuestion()'),wrong=(question.answer+1)%question.choices.length;
assert.equal(question.questionId,question.officialQuestionId);
assert(html.includes(question.sourceQuestionImage));
click({pickAnswer:String(wrong)});
click({submitAnswer:'true'});
assert.equal(run(`meta().questionRecords[${JSON.stringify(questionId)}].lastCorrect`),false);
assert(run(`meta().wrongQuestionIds.includes(${JSON.stringify(questionId)})`));
assert.equal(run(`meta().wrongAnswers.find(item=>item.questionId===${JSON.stringify(questionId)}).questionId`),questionId);
assert(html.includes('오답노트 +1'));

run("meta().completedChapters=eraChapters('joseon').slice(0,-1).map(ch=>ch.chapterId)");
assert.equal(run("libraryStatus('joseon')"),'LOCKED');
run("meta().completedChapters=eraChapters('joseon').map(ch=>ch.chapterId)");
assert.equal(run("libraryStatus('joseon')"),'UNLOCKED');
click({nav:'exam-library'});
click({libraryEra:'joseon'});
assert.equal((html.match(/class="library-question"/g)||[]).length,65);
assert(html.includes('73회')&&html.includes('79회'));

run("state.run=INITIAL_RUN('joseon-ch22');state.run.started=true;state.run.storyId='joseon_ch22_complete';meta().completedChapters=eraChapters('joseon').slice(0,-1).map(ch=>ch.chapterId);finishChapter(state)");
assert.equal(run('meta().eraProgress.joseon.completed'),true);
assert.equal(run('meta().eraProgress.joseon.progress'),100);
assert.equal(run("libraryStatus('joseon')"),'UNLOCKED');

console.log('PASS: Joseon chapter selection, independent save/resume, official wrong-note ID, era completion and 65-question library unlock');
