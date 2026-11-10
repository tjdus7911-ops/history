// 취약한 시대 판정 규칙(내 기록 › 취약점 분석, 홈 배너) 회귀 테스트
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(n=>n!=='pwa.js');
let html='',saved=null;
const document={querySelector:s=>s==='#app'?{set innerHTML(v){html=v}}:null,querySelectorAll:()=>[],addEventListener(){},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){},classList:{toggle(){}}}};
const ctx=vm.createContext({Date,console,document,localStorage:{getItem:()=>saved,setItem:(k,v)=>{saved=v}},window:{scrollTo(){},addEventListener(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>1,clearInterval(){}});
vm.runInContext(scripts.map(n=>fs.readFileSync('dist/'+n,'utf8')).join('\n'),ctx);
const run=c=>vm.runInContext(c,ctx),copy=c=>JSON.parse(run('JSON.stringify('+c+')'));
// 시대별로 문항을 골라 정답/오답 기록을 만든다(최근 풀이 기준)
const eras=copy("[...new Set(OFFICIAL_EXAM_CATALOG.map(e=>e.primaryEra))]");
const [A,B,C]=eras;
function setRecords(plan){ // plan: {eraId:[correct,wrong]}
 run('meta().questionRecords={};meta().learningEvents=[];');
 for(const [era,[ok,bad]] of Object.entries(plan)){
  run(`(()=>{const list=OFFICIAL_EXAM_CATALOG.filter(e=>e.primaryEra===${JSON.stringify(era)});let i=0;
   for(let n=0;n<${ok};n++,i++)meta().questionRecords[list[i].canonicalQuestionId]={attempts:1,correctCount:1,lastCorrect:true,lastAnswer:0,lastAttempt:'2026-11-01T00:00:00Z'};
   for(let n=0;n<${bad};n++,i++)meta().questionRecords[list[i].canonicalQuestionId]={attempts:1,correctCount:0,lastCorrect:false,lastAnswer:1,lastAttempt:'2026-11-01T00:00:00Z'};})()`);
 }
}
const W='WEAK_ERA_ANALYSIS';
setRecords({});
assert.equal(run(W+'.summary()'),null,'no records: no summary');
setRecords({[A]:[12,0]});
assert.equal(copy(W+'.assess()').status,'insufficient','one studied era is not enough');
assert.match(run(W+'.pageHTML()'),/아직 분석할 학습 데이터가 부족해요/);
setRecords({[A]:[12,0],[B]:[3,6]});
assert.equal(copy(W+'.assess()').status,'insufficient','an era below the sample floor never counts or becomes weak');
assert.doesNotMatch(run(W+'.pageHTML()'),/가장 취약한 시대/);
setRecords({[A]:[12,0],[B]:[15,0]});
assert.equal(copy(W+'.assess()').status,'perfect','two studied eras at 100%');
assert.match(run(W+'.pageHTML()'),/대단해요! 현재 분석된 취약한 시대가 없어요\./);
assert.equal(copy(W+'.summary()').status,'perfect');
setRecords({[A]:[12,0],[B]:[9,1],[C]:[8,2]});
let r=copy(W+'.assess()');
assert.equal(r.status,'weak');assert.equal(r.weakest.id,C,'lowest accuracy first');
assert(!r.candidates.some(x=>x.id===A),'100% era is never weak');
assert.match(run(W+'.pageHTML()'),/가장 취약한 시대/);
setRecords({[A]:[12,0],[B]:[8,2],[C]:[16,4]});
r=copy(W+'.assess()');assert.equal(r.weakest.id,C,'same 80% accuracy: more wrong answers first');
const banner=copy(W+'.summary()');assert.equal(banner.status,'weak');assert.equal(banner.id,C);
console.log('PASS: weak-era judgment — 2 studied eras required, sample floor, 100% excluded, accuracy→wrong→solved order, perfect/insufficient messages.');
