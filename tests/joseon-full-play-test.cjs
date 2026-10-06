const fs=require('fs'),vm=require('vm'),assert=require('assert');
const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]).filter(file=>file!=='pwa.js');
let html='',saved=null;
const context=vm.createContext({Date,console,document:{querySelector:selector=>selector==='#app'?{set innerHTML(value){html=value}}:null,querySelectorAll:()=>[],addEventListener(){},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>saved,setItem:(key,value)=>{saved=value}},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){}});
const run=source=>vm.runInContext(source,context),copy=source=>JSON.parse(run('JSON.stringify('+source+')'));
run(scripts.map(file=>fs.readFileSync('dist/'+file,'utf8')).join('\n'));
run("resumeEra('joseon')");

const completed=[];let guard=0,wrongId=null;
while(completed.length<23){
  assert(++guard<1200,JSON.stringify(copy('({screen,chapter:run().currentChapter,story:run().storyId,question:run().activeQuestionId,answer:run().questionAnswer})')));
  const state=copy('({screen,chapter:run().currentChapter,story:run().storyId,question:run().activeQuestionId,answer:run().questionAnswer,completed:run().completed})');
  if(state.screen==='game'){
    run("(()=>{const source=STORIES[run().storyId];run().dialogueCursor=conversationEntries(source,run().pending).length;nextStory()})()");
    continue;
  }
  if(state.screen==='quiz'){
    const question=copy('activeQuestion()');
    if(state.answer===null){
      const shouldMiss=!wrongId&&question.isOfficial&&question.chapterId==='joseon-ch12';
      const answer=shouldMiss?(question.answer+1)%question.choices.length:question.answer;
      run(`recordQuestion(state,${JSON.stringify(question.questionId)},${answer});save();render()`);
      if(shouldMiss)wrongId=question.questionId;
    }else run('continueStoryQuestion()');
    continue;
  }
  if(state.screen==='complete'){
    if(!completed.includes(state.chapter))completed.push(state.chapter);
    if(state.chapter==='joseon-ch22')break;
    const next=run(`eraChapters('joseon')[eraChapters('joseon').findIndex(ch=>ch.chapterId===${JSON.stringify(state.chapter)})+1].chapterId`);
    run(`startAvailableChapter(${JSON.stringify(next)})`);
    continue;
  }
  throw Error(`unexpected screen ${state.screen}`);
}

assert.deepEqual(completed,Array.from({length:23},(_,index)=>`joseon-ch${String(index).padStart(2,'0')}`));
assert.equal(run('meta().completedChapters.filter(id=>chapterEra(id)==="joseon").length'),23);
assert.equal(run('Object.keys(meta().questionRecords).filter(id=>QUESTIONS.find(q=>q.questionId===id)?.primaryEra==="joseon").length'),71);
assert.equal(run('meta().eraProgress.joseon.completed'),true);
assert.equal(run('meta().eraProgress.joseon.progress'),100);
assert.equal(run("libraryStatus('joseon')"),'UNLOCKED');
assert(wrongId&&run(`meta().wrongQuestionIds.includes(${JSON.stringify(wrongId)})`));
assert.equal(run(`meta().wrongAnswers.find(item=>item.questionId===${JSON.stringify(wrongId)}).questionId`),wrongId);
assert(run("meta().completedChapters.includes('joseon-ch22')"));
assert(html.includes('새로운 시대가 다가오고 있습니다.'));
console.log('PASS: complete Joseon CH.00–22 playthrough, 71 questions, one preserved official wrong note, completion flag and library unlock');
