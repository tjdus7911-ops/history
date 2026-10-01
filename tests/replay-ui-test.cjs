const fs=require('fs'),vm=require('vm'),assert=require('assert');
let saved=null,html='',handlers={},context,toastText='';
const data=fs.readFileSync('dist/data.js','utf8')+'\n'+fs.readFileSync('dist/ch02-data.js','utf8'),app=fs.readFileSync('dist/app.js','utf8');
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
finishChapter(state);
startChapter(state,'ch02');
recordQuestion(state,'ch02-test-01',0);
state.run.choices.push({chapterId:'ch02',scene:'test',label:'두 번째 선택'});
finishChapter(state);
state.run={...INITIAL_RUN('ch03'),currentChapter:'ch03',storyId:'ch03-progress-67',started:true,completed:false,visited:['ch03-a','ch03-b']};
save();screen='home';render();
`,context);

// CASE 1: completed card -> detail -> replay starts at that chapter.
click({chapter:'ch01'});assert(html.includes('CHAPTER 01 상세'));assert(html.includes('챕터 다시 플레이'));assert(html.includes('플레이 회차'));
action('request-replay',{chapter:'ch01'});assert(html.includes('CH.01을 다시 플레이할까요?'));assert(html.includes('이미 완료한 이후 챕터의 진행 기록은 유지됩니다.'));
action('confirm-replay',{chapter:'ch01'});assert.equal(current().run.mode,'replay');assert.equal(current().run.storyId,'prologue');assert.equal(current().mainRun.currentChapter,'ch03');assert.equal(current().mainRun.storyId,'ch03-progress-67');

// CASE 6: refresh keeps replay and main progress separately.
boot();assert.equal(current().run.mode,'replay');assert.equal(current().mainRun.currentChapter,'ch03');assert(html.includes('CHAPTER 01'));assert(html.includes('CHAPTER 03'));

// CASE 7 + CASE 2: another test attempt/run is appended; later completion remains.
const attemptsBefore=current().meta.questionRecords['ch01-test-01'].attempts;
vm.runInContext(`recordQuestion(state,'ch01-test-01',0);state.run.choices.push({chapterId:'ch01',scene:'replay',label:'새 선택'});finishChapter(state);save();screen='complete';render();`,context);
assert.equal(current().meta.questionRecords['ch01-test-01'].attempts,attemptsBefore+1);assert.equal(current().meta.chapterRuns.ch01.length,2);assert.equal(current().meta.chapterRecords.ch01.firstRun.runId,1);assert.equal(current().meta.chapterRecords.ch01.latestRun.runId,2);assert(current().meta.completedChapters.includes('ch02'));assert(html.includes('CH.01 재플레이 완료'));assert(html.includes('현재 이야기 이어하기'));

// CASE 3: finishing the replay restores the exact CH.03 main position.
action('current-main');assert.equal(current().run.currentChapter,'ch03');assert.equal(current().run.storyId,'ch03-progress-67');assert.equal(current().mainRun,null);

// CASE 4: result shortcut does not open the chapter sheet.
vm.runInContext("screen='home';render()",context);click({chapterResult:'ch02'});assert(html.includes('CHAPTER 02 COMPLETE'));assert(!html.includes('chapter-sheet'));

// CASE 5: a locked chapter cannot enter story and gives a lock message.
vm.runInContext("screen='home';render()",context);const storyBefore=current().run.storyId;click({chapter:'ch04'});assert.equal(current().run.storyId,storyBefore);assert(toastText.includes('CH.03을 완료하면 열립니다.'));

// CASE 8: all eleven metadata-driven cards use the same renderer.
action('toggle-chapters');assert(html.includes('CHAPTER 11'));assert.equal((html.match(/class="chapter-line /g)||[]).length,11);click({chapter:'ch03'});assert(html.includes('다음 챕터 준비 중'));assert(!html.includes('CHAPTER 03 시작하기'));

console.log('PASS: chapter card details, completed replay, main progress restoration, result shortcut isolation, locked feedback, refresh persistence, attempt history, and CH.01~11 metadata rendering.');
