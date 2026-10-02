const fs=require('fs'),vm=require('vm'),assert=require('assert');
let saved=null,html='',handlers={},context,toastText='';
const data=fs.readFileSync('dist/data.js','utf8')+'\n'+fs.readFileSync('dist/ch02-data.js','utf8')+'\n'+fs.readFileSync('dist/ch03-data.js','utf8')+'\n'+fs.readFileSync('dist/exam-data.js','utf8')+'\n'+fs.readFileSync('dist/ch01-expansion.js','utf8')+'\n'+fs.readFileSync('dist/chapter-split.js','utf8')+'\n'+fs.readFileSync('dist/late-goryeo.js','utf8'),app=fs.readFileSync('dist/app.js','utf8');
function boot(){
  handlers={};toastText='';
  const root={set innerHTML(value){html=value},get innerHTML(){return html}};
  const body={append(el){toastText=el.textContent||''}};
  const document={querySelector:selector=>selector==='#app'?root:null,querySelectorAll:()=>[],addEventListener:(event,handler)=>handlers[event]=handler,createElement:()=>({className:'',textContent:'',setAttribute(){},remove(){}}),body};
  context=vm.createContext({document,localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},window:{scrollTo(){}},navigator:{},setTimeout(){return 1},clearTimeout(){},Date});
  vm.runInContext(data+app,context);
}
const click=dataset=>{vm.runInContext('inputLockedUntil=0',context);handlers.click({stopPropagation(){},target:{closest:()=>({dataset,disabled:false})}})};
const action=(name,extra={})=>click({action:name,...extra}),current=()=>JSON.parse(saved);

boot();
vm.runInContext(`
state.run.started=true;
recordQuestion(state,'ch01-test-01',QUESTIONS.find(q=>q.questionId==='ch01-test-01').answer);
state.run.choices.push({chapterId:'ch01',scene:'test',label:'첫 선택'});
finishChapter(state);if(state.run.currentChapter==='ch01'){startChapter(state,'ch02');finishChapter(state);}
startChapter(state,'ch03');
recordQuestion(state,'ch02-test-01',0);
state.run.choices.push({chapterId:'ch03',scene:'test',label:'두 번째 선택'});
finishChapter(state);
state.run={...INITIAL_RUN('ch04'),currentChapter:'ch04',storyId:'ch03-progress-67',started:true,completed:false,visited:['ch03-a','ch03-b']};
save();screen='home';render();
`,context);

// CASE 1: completed card -> detail -> replay starts at that chapter.
click({chapter:'ch01'});assert(html.includes('CHAPTER 01 상세'));assert(html.includes('챕터 다시 플레이'));assert(html.includes('플레이 회차'));
action('request-replay',{chapter:'ch01'});assert(html.includes('CH.01을 다시 플레이할까요?'));assert(html.includes('이미 완료한 이후 챕터의 진행 기록은 유지됩니다.'));
action('confirm-replay',{chapter:'ch01'});assert.equal(current().run.mode,'replay');assert.equal(current().run.storyId,'prologue');assert.equal(current().mainRun.currentChapter,'ch04');assert.equal(current().mainRun.storyId,'ch03-progress-67');

// CASE 6: refresh keeps replay and main progress separately.
boot();assert.equal(current().run.mode,'replay');assert.equal(current().mainRun.currentChapter,'ch04');assert(html.includes('CHAPTER 01'));assert(html.includes('CH.04'));

// CASE 7 + CASE 2: another test attempt/run is appended; later completion remains.
const attemptsBefore=current().meta.questionRecords['ch01-test-01'].attempts;
vm.runInContext(`recordQuestion(state,'ch01-test-01',0);state.run.choices.push({chapterId:'ch01',scene:'replay',label:'새 선택'});finishChapter(state);save();screen='complete';render();`,context);
assert.equal(current().meta.questionRecords['ch01-test-01'].attempts,attemptsBefore+1);assert.equal(current().meta.chapterRuns.ch01.length,2);assert.equal(current().meta.chapterRecords.ch01.firstRun.runId,1);assert.equal(current().meta.chapterRecords.ch01.latestRun.runId,2);assert(current().meta.completedChapters.includes('ch03'));assert(html.includes('REPLAY COMPLETE'));assert(html.includes('현재 이야기 이어하기'));

// CASE 3: finishing the replay restores the exact CH.04 main position.
action('current-main');assert.equal(current().run.currentChapter,'ch04');assert.equal(current().run.storyId,'ch03-progress-67');assert.equal(current().mainRun,null);

// CASE 4: result shortcut does not open the chapter sheet.
vm.runInContext("screen='home';render()",context);click({chapterResult:'ch03'});assert(html.includes('CHAPTER 03 CLEAR'));assert(!html.includes('chapter-sheet'));

// CASE 5: a locked chapter cannot enter story and gives a lock message.
vm.runInContext("screen='home';render()",context);const storyBefore=current().run.storyId;click({chapter:'ch05'});assert.equal(current().run.storyId,storyBefore);assert(toastText.includes('CH.04을 완료하면 열립니다.'));

// CASE 8: all eleven metadata-driven cards use the same renderer.
action('toggle-chapters');assert(html.includes('CHAPTER 12'));assert.equal((html.match(/class="chapter-line /g)||[]).length,12);click({chapter:'ch04'});assert(html.includes('현재 진행'));assert(html.includes('이어서 플레이'));assert(!html.includes('다음 챕터 준비 중'));

console.log('PASS: chapter card details, completed replay, main progress restoration, result shortcut isolation, locked feedback, refresh persistence, attempt history, and CH.01~12 metadata rendering.');
