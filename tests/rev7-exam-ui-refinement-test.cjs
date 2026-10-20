const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const fixtureSource = fs.readFileSync('tests/ox-route-test.cjs', 'utf8')
  .split('/* Build one genuine persisted active session.')[0];
const harness = {require, console, URL};
vm.runInNewContext(`${fixtureSource}\nglobalThis.boot=boot;`, harness);

const css = fs.readFileSync('dist/rev7-layouts.css', 'utf8');
assert.match(css, /r7-wrong-controls[\s\S]*?aria-pressed=true[\s\S]*?background:var\(--r7-coral\)/);
assert.match(css, /r7-exam-levels[\s\S]*?aria-pressed=true[\s\S]*?background:var\(--r7-coral\)/);
assert.match(css, /r7-exam-modes[\s\S]*?aria-pressed=true[\s\S]*?background:var\(--r7-coral\)/);
assert.match(css, /r7-exam-history \.r7-history-row\{display:grid;grid-template-columns:68px minmax\(0,1fr\) 20px/);
assert.match(css, /r7-history-cert\.fail\{background:var\(--r7-danger-soft\);color:var\(--r7-danger\)\}/);

const app = harness.boot('#exam-library');
app.run('globalThis.rev7Frames=[];globalThis.requestAnimationFrame=callback=>rev7Frames.push(callback)');

function submitAttempt() {
  app.run("REV7_EXAM_VIEWS.start(REV7_EXAM_VIEWS.entriesForRound(79,'심화'),'exam',{examTab:'round',examRound:79,examLevel:'심화',timed:false});render()");
  app.click({officialSubmitConfirm: 'true'});
  assert(app.html().includes('data-figma-frame="E-09"'));
  app.run('while(rev7Frames.length)rev7Frames.shift()()');
  assert(app.html().includes('data-figma-frame="E-10"'));
}

submitAttempt();
app.click({officialResultsList: 'true'});
let html = app.html();
assert(html.includes('class="r7-history-copy"'));
assert(html.includes('응시 '));
assert(html.includes('r7-history-cert fail'));
assert(html.includes('같은 회차를 한 번 더 풀면 점수 추이가 표시돼요.'));
assert.equal((html.match(/data-r7-exam-trend=/g) || []).length, 0);

submitAttempt();
app.click({officialResultsList: 'true'});
html = app.html();
assert.equal((html.match(/data-r7-exam-trend=/g) || []).length, 1, 'one trend entry is rendered per round and level');
assert(html.includes('2회 응시'));
assert(!html.includes('같은 회차를 한 번 더 풀면 점수 추이가 표시돼요.'));
const recordsBeforeTrend = app.run('JSON.stringify(meta().officialExamResults)');

app.click({r7ExamTrend: '79', r7ExamLevelValue: '심화'});
html = app.html();
assert(html.includes('응시 점수 추이'));
assert.equal((html.match(/<div><b>0<\/b><i style="height:2px"><\/i><small>\d회<\/small><\/div>/g) || []).length, 2);
assert(!html.includes('아직 점수 추이가 없어요'));
assert.equal(app.run('JSON.stringify(meta().officialExamResults)'), recordsBeforeTrend, 'opening a trend must not mutate exam records');

console.log('PASS: coral review/exam filters, responsive history markup, grouped trend affordance, singleton trend empty state, and record preservation.');
