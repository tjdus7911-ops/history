// 해설 '핵심 키워드'·'암기법' 영역: 실제 암기법만 보이고, 없으면 제목도 그리지 않는다.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(n=>n!=='pwa.js');
const document={querySelector:s=>s==='#app'?{set innerHTML(v){}}:null,querySelectorAll:()=>[],addEventListener(){},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){},classList:{toggle(){}}}};
const ctx=vm.createContext({Date,console,document,localStorage:{getItem:()=>null,setItem(){}},window:{scrollTo(){},addEventListener(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>1,clearInterval(){}});
vm.runInContext(scripts.map(n=>fs.readFileSync('dist/'+n,'utf8')).join('\n'),ctx);
const run=c=>vm.runInContext(c,ctx);
const X='EXPLANATION_STUDY';
// 부여 문제: 제천 행사 비교 암기법 + 부여 암기법
let html=run(X+".mnemonicHTML('official-60-advanced-02')");
assert.match(html,/<h2>암기법<\/h2>/);assert.match(html,/부여는 12월 영고, 고구려는 10월 동맹, 동예는 10월 무천/);assert.match(html,/마·우·저·구/);
// 영고탑(조선 후기 나선 정벌)은 부여 영고와 무관
assert.equal(run(X+".mnemonicHTML('official-78-advanced-23')").includes('영고'),false,'영고탑 is not 영고');
// 고구마가 → '마가'로 오인하지 않음
assert(!JSON.parse(run('JSON.stringify('+X+".mnemonicsFor('official-63-basic-22'))")).some(m=>m.id.startsWith('cmp-')),'조선 후기 경제 문제에 초기 국가 비교 암기법을 붙이지 않음');
// 암기법이 없는 문제는 '암기법' 제목을 그리지 않음
const none=run(`OFFICIAL_EXAM_CATALOG.find(e=>!${X}.mnemonicsFor(e).length).canonicalQuestionId`);
assert.equal(run(X+".mnemonicHTML("+JSON.stringify(none)+")"),'');
// 검수된 공개 암기법 카드는 연결된 문제에 그대로 노출
const pub=run(`(()=>{const m=ASSOCIATION_MEMORIES.find(m=>m.status==='published'&&m.relatedOfficialQuestionIds.length&&(m.publicMnemonic||m.mnemonic));return JSON.stringify({id:m.relatedOfficialQuestionIds[0],text:m.publicMnemonic||m.mnemonic})})()`);
const {id,text}=JSON.parse(pub);assert(run(X+".mnemonicHTML("+JSON.stringify(id)+")").includes(text.replace(/&/g,'&amp;')),'published card shows in its linked question');
// 핵심 키워드: 단서 문장
assert.match(run(X+".keywordHTML('official-60-advanced-02')"),/핵심 키워드[\s\S]*쑹화강 유역, 영고, 형사취수제/);
// 리뷰 화면의 접힌 영역 제목은 더 이상 '암기법'을 약속하지 않음
assert(!fs.readFileSync('dist/rev7-exam-layouts.js','utf8').includes('답안 분석과 암기법'));
console.log('PASS: explanation keywords and mnemonics — real content only, strict evidence matching, no empty 암기법 heading.');
