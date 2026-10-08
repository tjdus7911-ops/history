const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert');
const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]).filter(file=>file!=='pwa.js');
let html='',saved=null;
const context=vm.createContext({Date,console,document:{querySelector:selector=>selector==='#app'?{set innerHTML(value){html=value}}:null,querySelectorAll:()=>[],addEventListener(){},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>saved,setItem:(key,value)=>{saved=value}},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>1,clearInterval(){}});
const run=source=>vm.runInContext(source,context),copy=source=>JSON.parse(run('JSON.stringify('+source+')'));
run(scripts.map(file=>fs.readFileSync('dist/'+file,'utf8')).join('\n'));

function playSeason(eraId,expectedCount){
 run(`resumeEra(${JSON.stringify(eraId)})`);const completed=[];let guard=0;
 while(completed.length<expectedCount){
  assert(++guard<900,JSON.stringify(copy('({screen,chapter:run().currentChapter,story:run().storyId,question:run().activeQuestionId,answer:run().questionAnswer})')));
  const state=copy('({screen,chapter:run().currentChapter,answer:run().questionAnswer})');
  if(state.screen==='game'){run("(()=>{const source=STORIES[run().storyId];run().dialogueCursor=conversationEntries(source,run().pending).length;nextStory()})()");continue;}
  if(state.screen==='quiz'){
   const q=copy('activeQuestion()');if(state.answer===null)run(`recordQuestion(state,${JSON.stringify(q.questionId)},${q.answer});save();render()`);else run('continueStoryQuestion()');continue;
  }
  if(state.screen==='complete'){
   if(!completed.includes(state.chapter))completed.push(state.chapter);if(completed.length===expectedCount)break;
   const next=run(`eraChapters(${JSON.stringify(eraId)})[eraChapters(${JSON.stringify(eraId)}).findIndex(ch=>ch.chapterId===${JSON.stringify(state.chapter)})+1].chapterId`);run(`startAvailableChapter(${JSON.stringify(next)})`);continue;
  }
  throw Error(`unexpected screen ${state.screen}`);
 }
 assert.equal(run(`meta().completedChapters.filter(id=>chapterEra(id)===${JSON.stringify(eraId)}).length`),expectedCount);
 assert.equal(run(`meta().eraProgress[${JSON.stringify(eraId)}].completed`),true);assert.equal(run(`meta().eraProgress[${JSON.stringify(eraId)}].progress`),100);
 return completed;
}
assert.deepEqual(playSeason('proto-kingdoms',8),Array.from({length:8},(_,index)=>`proto-ch${String(index).padStart(2,'0')}`));
assert.deepEqual(playSeason('three-kingdoms',14),Array.from({length:14},(_,index)=>`three-ch${String(index).padStart(2,'0')}`));
assert.equal(run("Object.keys(meta().questionRecords).filter(id=>ANCIENT_OFFICIAL_QUESTION_IDS.includes(id)).length"),20);assert.equal(run("meta().wrongQuestionIds.filter(id=>ANCIENT_OFFICIAL_QUESTION_IDS.includes(id)).length"),0);
assert.equal(run("meta().eraProgress['proto-kingdoms'].progress"),100);assert.equal(run("meta().eraProgress['three-kingdoms'].progress"),100);assert(run("meta().completedChapters.includes('three-ch13')"));
console.log('PASS: complete 원삼국 CH.00–07 and 삼국 CH.00–13 playthrough, 20 official questions, 100% independent season completion and no dead-end transition.');
