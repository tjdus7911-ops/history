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
const context=vm.createContext({Date,console,document,localStorage:{getItem:()=>saved,setItem:(key,value)=>{saved=value}},window:{scrollTo(){},addEventListener(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>1,clearInterval(){}});
vm.runInContext(scripts.map(name=>fs.readFileSync('dist/'+name,'utf8')).join('\n'),context);
const run=code=>vm.runInContext(code,context),copy=code=>JSON.parse(run('JSON.stringify('+code+')'));

assert.equal(run('typeof HOME_V6_API'),'object','home metrics API is available');
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
assert.equal(copy("HOME_V6_API.dday(new Date(2026,9,22,0,5))").kind,'past','past exam dates consistently require resetting from the device-local calendar day');
run("meta().examTargetDate='2026-11-05'");
run('render()');
assert(html.includes('<span>눈떠보니</span><em>한국사</em>'),'header uses the split brand wordmark');
assert(!html.includes('요일'),'the old date header is removed');
assert(html.includes('학습 현황')&&html.includes('남은 시험일')&&html.includes('D-14'),'D-day renders from the saved target date');
assert(html.includes('data-hv-exam-open')&&!html.includes('data-hv-exam-date'),'exam card opens the in-app calendar instead of an unreliable transparent native input');
assert(html.includes('연속 학습')&&html.includes('오늘 푼 문제')&&html.includes('최근 정답률'),'all four status items render');
assert(html.includes('<p>오늘도 화이팅! 한 장면, 한 문제씩 이어가요.</p>'),'compact encouragement copy is exact');
assert(html.includes('class="hv-cheer-avatar"')&&html.includes('icons/icon-192.png'),'encouragement card uses the requested app-icon character art');
assert.equal((html.match(/class="hv-row hv-row-/g)||[]).length,3,'three practical-learning cards render');
assert(html.includes('data-era-open="proto-kingdoms" aria-label="원삼국 스토리 목록 보기"'),'story artwork opens the existing era list');
assert.equal(run('JSON.stringify({run:state.run,mainRun:state.mainRun,records:meta().questionRecords,wrong:meta().wrongQuestionIds,results:meta().officialExamResults})'),protectedBefore,'rendering home does not mutate protected learning data');
console.log('PASS: home v6 wordmark, de-duplicated real learning metrics, D-day, banner, practical cards and protected data.');
