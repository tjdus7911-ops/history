const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(n=>n!=='pwa.js');
let now=1000;const listeners={};class Clock extends Date{static now(){return now}}
const context=vm.createContext({Date:Clock,console,document:{visibilityState:'visible',querySelector:s=>s==='#app'?{set innerHTML(v){}}:null,querySelectorAll:()=>[],addEventListener:(name,fn)=>{(listeners[name]||=[]).push(fn)},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>null,setItem(){}},window:{innerWidth:390,scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>1,clearInterval(){}});
vm.runInContext(scripts.map(n=>fs.readFileSync('dist/'+n,'utf8')).join('\n'),context);
const run=code=>vm.runInContext(code,context);
run("screen='exam-library';startOfficialSession(OFFICIAL_EXAM_CATALOG.filter(e=>e.sourceRecord.examRound===70&&e.sourceRecord.examLevel==='심화').slice(0,3),'exam',{examTab:'round',examRound:70,examLevel:'심화',timed:false,startImmediately:true})");
const stage={closest:selector=>selector==='[data-official-question-stage]'?stage:null};
const emit=(type,x,y,count=1)=>{const event={target:stage,touches:type==='touchend'?[]:Array.from({length:count},()=>({clientX:x,clientY:y})),changedTouches:[{clientX:x,clientY:y}],cancelable:true,preventDefault(){}};for(const fn of listeners[type]||[])fn(event)};
const swipe=(x,endX,y=300,endY=y)=>{emit('touchstart',x,y);emit('touchmove',endX,endY);emit('touchend',endX,endY)};
swipe(300,50);assert.equal(run('OFFICIAL_EXAM_UI.snapshot().index'),1);
swipe(300,50);assert.equal(run('OFFICIAL_EXAM_UI.snapshot().index'),1,'rapid duplicate swipe is ignored');
now+=300;swipe(300,50);assert.equal(run('OFFICIAL_EXAM_UI.snapshot().index'),2);
now+=300;swipe(300,50);assert.equal(run('OFFICIAL_EXAM_UI.snapshot().index'),2);assert.equal(run('modal'),null,'last boundary does not submit');
now+=300;swipe(50,300);assert.equal(run('OFFICIAL_EXAM_UI.snapshot().index'),1,'previous navigation');
now+=300;swipe(180,185,300,150);assert.equal(run('OFFICIAL_EXAM_UI.snapshot().index'),1,'vertical scroll stays on the question');
emit('touchstart',200,300,2);emit('touchmove',60,300,2);emit('touchend',60,300);assert.equal(run('OFFICIAL_EXAM_UI.snapshot().index'),1,'pinch does not navigate');
run("modal={type:'official-question-sheet'}");swipe(300,50);assert.equal(run('OFFICIAL_EXAM_UI.snapshot().index'),1);run('modal=null');
swipe(10,300);assert.equal(run('OFFICIAL_EXAM_UI.snapshot().index'),1,'system edge gesture is excluded');
run("OFFICIAL_EXAM_UI.startLearning(OFFICIAL_EXAM_UI.snapshot().questionIds,{examTab:\'round\',examRound:70,examLevel:\'심화\'})");
now+=300;swipe(50,300);assert.equal(run('OFFICIAL_EXAM_UI.snapshot().index'),0,'first boundary');now+=300;swipe(300,50);assert.equal(run('OFFICIAL_EXAM_UI.snapshot().index'),1,'learning navigation');
assert.equal(run('Object.keys(OFFICIAL_EXAM_UI.snapshot().answers).length'),0,'swipes do not select choices');
console.log('PASS: shared-stage gestures, duplicate suppression, boundaries, vertical/pinch/modal/edge exclusion and learning navigation.');

