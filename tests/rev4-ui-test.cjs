const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');

const css=fs.readFileSync('dist/rev4.css','utf8');
const ui=fs.readFileSync('dist/rev4-ui.js','utf8');
const html=fs.readFileSync('dist/index.html','utf8');
const sw=fs.readFileSync('dist/sw.js','utf8');
const matrix=fs.readFileSync('docs/rev4/REV4_IMPLEMENTATION_MATRIX.md','utf8');
const threeBoundary=fs.readFileSync('dist/three-learning-boundary.js','utf8');

new vm.Script(ui,{filename:'dist/rev4-ui.js'});
for(const [token,value] of Object.entries({
  '--color-navy-950':'#0b1626','--color-navy-900':'#101f35','--color-navy-800':'#172b47',
  '--color-gold-500':'#b08a4e','--color-neutral-900':'#1e1c19','--layout-touch-min':'44px',
  '--layout-screen-width':'390px','--layout-nav-height':'64px','--layout-button-l':'52px'
}))assert(css.includes(`${token}:${value}`),`missing Rev.4 token ${token}`);
for(const value of ['Noto Sans KR','Noto Serif KR','Inter','env(safe-area-inset-bottom)','@media (max-width:360px)','@media (min-width:430px)'])assert(css.includes(value),`missing responsive/foundation rule ${value}`);
assert(css.includes('width:250px!important;height:456px!important'),'story character container is not 250x456');
assert(css.includes('.stage-character.listening{opacity:.55'),'listening character opacity is not Rev.4');
assert(!ui.includes('응답 고르기'),'obsolete response button returned');
for(const label of ['홈','기출 문제','학습','오답노트','내 기록'])assert(ui.includes(`'${label}'`),`missing navigation label ${label}`);
for(const name of ['rev4Home','homeWelcome','searchMarkup','enhanceStory','enhanceWrongNote'])assert(ui.includes(name),`missing Rev.4 implementation ${name}`);
assert(html.indexOf('rev4.css')>html.indexOf('proto-revision.css'),'Rev.4 CSS must load after legacy story styles');
assert(html.indexOf('rev4-ui.js')>html.indexOf('pwa.js'),'Rev.4 enhancer must load last');
assert(sw.includes("'/rev4.css'")&&sw.includes("'/rev4-ui.js'"),'service worker does not precache Rev.4 shell');
assert(threeBoundary.includes('function recordThreeOfficialAttempt')&&!threeBoundary.includes('function recordOfficialAttempt(id, answer)'),'Three runtime still shadows the global official attempt recorder');

const groups={Home:2,Story:28,Exam:21,OX:5,'Wrong Answer Note':14,'My Records':4,'Common & States':10};
assert.equal(Object.values(groups).reduce((sum,value)=>sum+value,0),84);
for(const [name,count] of Object.entries(groups))assert(matrix.includes(`### ${name} — ${count}/${count}`),`matrix missing ${name} ${count}/${count}`);
assert(matrix.includes('실제 제품 화면 프레임: 84개'),'matrix total is not 84');
assert(matrix.includes('49개 최상위 컴포넌트 패밀리'),'component library coverage missing');
console.log('PASS: Rev.4 tokens, responsive rules, 84-screen matrix, shared components, load order, service worker, story staging, and runtime shadow fix.');
