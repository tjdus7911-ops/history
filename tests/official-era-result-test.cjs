const fs=require('fs'),vm=require('vm'),assert=require('assert');
const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]).filter(name=>name!=='pwa.js');
let html='',saved=null,handlers={};
const context=vm.createContext({Date,console,document:{visibilityState:'visible',querySelector:selector=>selector==='#app'?{set innerHTML(value){html=value}}:null,querySelectorAll:()=>[],addEventListener:(type,handler,capture)=>{(handlers[type]||=[]).push({handler,capture})},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>1,clearInterval(){}});
const run=code=>vm.runInContext(code,context),copy=code=>JSON.parse(run('JSON.stringify('+code+')'));
run(scripts.map(name=>fs.readFileSync('dist/'+name,'utf8')).join('\n'));
function click(dataset){run('inputLockedUntil=0');let stopped=false;const button={dataset,disabled:false};for(const item of (handlers.click||[]).slice().sort((a,b)=>Number(Boolean(b.capture))-Number(Boolean(a.capture)))){item.handler({target:{closest:()=>button},stopImmediatePropagation(){stopped=true}});if(stopped)break}}

const eras=copy('globalThis.OFFICIAL_ANALYSIS_ERAS'),entries=copy('globalThis.OFFICIAL_EXAM_CATALOG'),eraIds=new Set(eras.map(era=>era.id));
assert.deepEqual(eras.map(era=>era.name),['선사·고조선','여러 나라의 성장(원삼국 포함)','삼국·가야','남북국','고려','조선 전기','조선 후기','개항기·대한제국','일제강점기','현대']);
assert.equal(entries.length,1800);assert(entries.every(entry=>eraIds.has(entry.analysisEra)),'every official question needs exactly one analysis era');
assert.equal(entries.find(entry=>entry.sourceRecord.officialQuestionId==='official-57-basic-01').analysisEra,'prehistoric-gogojoseon');
assert.equal(entries.find(entry=>entry.sourceRecord.officialQuestionId==='official-57-basic-02').analysisEra,'early-states');
assert.equal(entries.find(entry=>entry.sourceRecord.officialQuestionId==='official-60-advanced-03').analysisEra,'three-gaya');
assert.equal(entries.find(entry=>entry.sourceRecord.officialQuestionId==='official-79-advanced-10').analysisEra,'north-south');
assert.equal(entries.find(entry=>entry.sourceRecord.officialQuestionId==='official-79-advanced-18').analysisEra,'goryeo');
assert.equal(entries.find(entry=>entry.sourceRecord.officialQuestionId==='official-79-advanced-31').analysisEra,'empire');
assert.equal(entries.find(entry=>entry.sourceRecord.officialQuestionId==='official-79-advanced-50').analysisEra,'joseon-late');

for(const [level,score,passed,grade] of [['심화',100,true,1],['심화',80,true,1],['심화',79,true,2],['심화',70,true,2],['심화',69,true,3],['심화',60,true,3],['심화',59,false,null],['기본',80,true,4],['기본',79,true,5],['기본',70,true,5],['기본',69,true,6],['기본',60,true,6],['기본',59,false,null]]){
 const value=copy(`OFFICIAL_CERTIFICATION({score:${score},maxScore:100},${JSON.stringify(level)},true)`);assert.equal(value.passed,passed,`${level} ${score}`);assert.equal(value.grade,grade,`${level} ${score}`);
}

click({nav:'exam-library'});const roundIndex=html.indexOf('data-official-tab="round"'),eraIndex=html.indexOf('data-official-tab="era"');assert(roundIndex>=0&&roundIndex<eraIndex,'round tab must be the first visible tab');assert(html.includes('data-official-tab="round" aria-selected="true"'));
const selected=[];for(const era of eras.slice(0,4))selected.push(...entries.filter(entry=>entry.analysisEra===era.id).slice(0,2));const selectedIds=selected.map(entry=>entry.canonicalQuestionId);
run(`startOfficialSession(${JSON.stringify(selectedIds)}.map(id=>globalThis.OFFICIAL_EXAM_CATALOG.find(entry=>entry.canonicalQuestionId===id)),'exam',{examTab:'round',examRound:79,examLevel:'심화',timed:false})`);
for(const [index,id] of selectedIds.entries()){const accepted=copy(`QUESTIONS.find(question=>question.questionId===${JSON.stringify(id)}).acceptedAnswers`),answer=index%3===0?[0,1,2,3,4].find(value=>!accepted.includes(value)):accepted[0];click({officialPick:String(answer)});if(index<selectedIds.length-1)click({officialNext:'true'})}
click({officialRequestSubmit:'true'});click({officialSubmitConfirm:'true'});
const analysis=copy('OFFICIAL_RESULT_ANALYSIS.current("attempt")');assert.equal(analysis.total,8);assert.equal(analysis.correct,5);assert.equal(analysis.wrongTotal,3);assert.equal(analysis.rows.reduce((sum,row)=>sum+row.wrong,0),3);assert(Math.abs(analysis.rows.reduce((sum,row)=>sum+row.wrongShare,0)-100)<0.2);assert.equal(analysis.rows.filter(row=>row.total===0).length,6);assert(analysis.rows.filter(row=>row.total===0).every(row=>row.status.label==='분석 데이터 없음'));assert(analysis.rows.filter(row=>row.total===2).every(row=>row.sampleLimited));
assert(html.includes('class="official-results"'),html.slice(0,500));
for(const copyText of ['최종 점수','시대별 취약점 분석','오답 기준','집중 복습 필요 TOP 3','문제별 정답과 해설','오답 다시 풀기','해설 보기'])assert(html.includes(copyText),copyText);assert(/심화 [123]급|불합격/.test(html),'the result must show an official advanced grade or fail state');
assert.equal((html.match(/data-official-analysis-era=/g)||[]).length,10,'all ten legend items remain selectable');
assert(!html.includes('official-era-detail-section')&&!html.includes('official-era-detail-list'),'duplicate accuracy section must not render');
click({officialAnalysisScope:'cumulative'});assert(html.includes('data-official-analysis-scope="cumulative" aria-selected="true"'));assert(html.includes('가장 최근 답안'));
click({officialAnalysisScope:'attempt'});click({officialAnalysisEra:analysis.top3[0].id});assert(html.includes('aria-pressed="true"')&&html.includes('선택한 시대'));
console.log('PASS: first round tab, 1,800 ten-era mappings, actual-answer analysis, no-data/low-sample policy, donut semantics, selection and official grade thresholds verified.');

