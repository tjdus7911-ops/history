const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');

const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)]
  .map(match=>match[1]).filter(name=>name!=='pwa.js');
let html='',saved=null;
const document={
  querySelector:selector=>selector==='#app'?{set innerHTML(value){html=value}}:null,
  querySelectorAll:()=>[],
  addEventListener(){},
  createElement:()=>({setAttribute(){},remove(){}}),
  body:{append(){},classList:{toggle(){}}}
};
// 실행하는 날짜와 상관없이 같은 결과가 나오도록 '오늘'을 2026-10-22 12:00(KST)로 고정한다.
const FIXED_NOW=new Date(2026,9,22,12,0).getTime();
class FixedDate extends Date{constructor(...args){super(...(args.length?args:[FIXED_NOW]))}static now(){return FIXED_NOW}}
const context=vm.createContext({Date:FixedDate,console,document,localStorage:{getItem:()=>saved,setItem:(key,value)=>{saved=value}},window:{scrollTo(){},addEventListener(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>1,clearInterval(){}});
vm.runInContext(scripts.map(name=>fs.readFileSync('dist/'+name,'utf8')).join('\n'),context);
const run=code=>vm.runInContext(code,context),copy=code=>JSON.parse(run('JSON.stringify('+code+')'));

assert.equal(run('typeof HOME_V6_API'),'object','home metrics API is available');
assert.equal(run('HOME_V6_API.passRate()'),null,'official pass rate stays empty until official exam results exist');
run(`meta().officialExamResults=[
 {mode:'exam',examRound:79,examLevel:'심화',summary:{score:80,maxScore:100}},
 {mode:'exam',examRound:79,examLevel:'심화',summary:{score:59,maxScore:100}},
 {mode:'learn',examRound:79,examLevel:'심화',summary:{score:100,maxScore:100}}
];`);
assert.equal(run('HOME_V6_API.passRate()'),50,'home pass rate uses only completed official exams and the existing certification threshold');
const protectedBefore=run('JSON.stringify({run:state.run,mainRun:state.mainRun,records:meta().questionRecords,wrong:meta().wrongQuestionIds,results:meta().officialExamResults})');
run(`meta().learningEvents=[
 {questionId:'regular-today',answer:0,correct:true,answeredAt:'2026-10-22T09:00:00+09:00'},
 {questionId:'regular-today',answer:0,correct:true,answeredAt:'2026-10-22T09:00:00+09:00'},
 {questionId:'regular-yesterday',answer:1,correct:false,answeredAt:'2026-10-21T09:00:00+09:00'},
 {questionId:'future',answer:0,correct:true,answeredAt:'2026-10-23T09:00:00+09:00'}
];
meta().oxQuiz={history:[{questionId:'ox-today',selectedAnswer:true,isCorrect:true,answeredAt:'2026-10-22T10:00:00+09:00',sessionId:'ox-session',attemptNumber:1}],records:{},wrongIds:[],recentQuestionIds:[],completedSessions:[]};
meta().examTargetDate='2026-11-05';`);
const stats=copy("HOME_V6_API.stats(new Date('2026-10-22T12:00:00+09:00'))");
assert.deepEqual(stats,{streak:2,todayCount:2,accuracy:67,any:true},'regular + OX records are combined, exact duplicates and future rows are excluded');
assert.equal(run("HOME_V6_API.events(new Date('2026-10-22T12:00:00+09:00')).length"),3,'one stored submission event is counted once');
const dday=copy("HOME_V6_API.dday(new Date('2026-10-22T12:00:00+09:00'))");
assert.equal(dday.kind,'set');assert.equal(dday.days,14);
run("meta().examTargetDate='2026-10-21'");
// 직접 정한 시험일이 지나면 다음 공식 시험일(제81회 11/28)로 자동 전환한다(기기 현지 날짜 기준).
const fallback=copy("HOME_V6_API.dday(new Date(2026,9,22,0,5))");
assert.deepEqual({kind:fallback.kind,auto:fallback.auto,round:fallback.round,days:fallback.days},{kind:'set',auto:true,round:81,days:37},'a past custom exam date falls back to the next official exam from the device-local calendar day');
// 남은 공식 시험 일정도 없으면 다시 설정하도록 안내한다.
assert.equal(copy("HOME_V6_API.dday(new Date(2026,11,1,0,5))").kind,'past','past exam dates require resetting when no official exam is scheduled');
run("meta().examTargetDate='2026-11-05'");
run('render()');
assert(html.includes('<span>눈떠보니</span><em>한국사</em>'),'header uses the split brand wordmark');
assert(!html.includes('요일'),'the old date header is removed');
assert(html.includes('한능검 시험일까지')&&html.includes('<b>D-14</b>'),'D-day renders from the saved target date');
// 홈 개편(학습 미션) 이후 합격률은 홈에 표시하지 않고 HOME_V6_API.passRate()로만 제공한다(위에서 검증).
assert(!html.includes('실전 합격률'),'home no longer repeats the pass-rate tile after the learning-mission redesign');
assert(html.includes('data-hv-exam-open')&&!html.includes('data-hv-exam-date'),'exam card opens the in-app calendar instead of an unreliable transparent native input');
assert(html.includes('class="lm-card"')&&html.includes('오늘의 학습 미션')&&html.includes('0 / 4 완료'),'today\'s learning mission card renders with its four missions');
assert(html.includes('<strong>오늘도 한 장면, 한 문제씩!</strong>'),'compact encouragement copy is exact');
assert(html.includes('<span class="lm-mascot"><img src="icons/mascot-192.png"'),'encouragement card uses the requested app-icon character art');
assert.equal((html.match(/class="hv-shortcut hv-shortcut-/g)||[]).length,4,'four learning shortcuts (story, exam, OX, wrong notes) render');
assert(html.includes('data-era-open="proto-kingdoms" aria-label="원삼국 스토리 목록 보기"'),'story artwork opens the existing era list');
assert.equal(run('JSON.stringify({run:state.run,mainRun:state.mainRun,records:meta().questionRecords,wrong:meta().wrongQuestionIds,results:meta().officialExamResults})'),protectedBefore,'rendering home does not mutate protected learning data');
console.log('PASS: home v6 wordmark, de-duplicated real learning metrics, D-day, banner, practical cards and protected data.');
