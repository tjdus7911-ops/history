const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const scripts = [...fs.readFileSync('dist/index.html', 'utf8').matchAll(/<script src="([^"]+)"/g)]
  .map((match) => match[1]).filter((name) => name !== 'pwa.js');

function loadContext(seed = {}) {
  let html = '';
  const storage = new Map(Object.entries(seed));
  const document = {
    querySelector: (selector) => selector === '#app' ? { set innerHTML(value) { html = value; } } : null,
    querySelectorAll: () => [],
    addEventListener() {},
    createElement: () => ({ setAttribute() {}, remove() {} }),
    body: { append() {}, classList: { toggle() {} } },
  };
  const localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key),
  };
  const context = vm.createContext({
    Date, console, document, localStorage,
    window: { scrollTo() {}, addEventListener() {} },
    navigator: {}, setTimeout: () => 0, clearTimeout() {}, setInterval: () => 1, clearInterval() {},
  });
  vm.runInContext(scripts.map((name) => fs.readFileSync('dist/' + name, 'utf8')).join('\n'), context);
  return {
    context, storage,
    run: (code) => vm.runInContext(code, context),
    html: () => html,
  };
}

const today = new Date('2026-10-22T12:00:00+09:00');
const tomorrow = new Date('2026-10-23T00:30:00+09:00');
let app = loadContext();
assert.equal(app.run('typeof LEARNING_MISSIONS'), 'object', 'mission module is loaded after the existing UI');
app.run(`
  meta().officialExamResults = [
    { attemptId: 'exam-a', mode: 'exam', completedAt: '2026-10-22T09:00:00+09:00', questionIds: ['q1'] },
    { attemptId: 'exam-a', mode: 'exam', completedAt: '2026-10-22T09:00:00+09:00', questionIds: ['q1'] },
    { attemptId: 'exam-b', mode: 'exam', completedAt: '2026-10-22T10:00:00+09:00', questionIds: ['q1'] },
    { attemptId: 'exam-old', mode: 'exam', completedAt: '2026-10-21T10:00:00+09:00', questionIds: ['q2'] },
    { attemptId: 'practice-only', mode: 'learn', completedAt: '2026-10-22T10:00:00+09:00', questionIds: ['q3'] }
  ];
  meta().chapterRuns = {
    ch01: [
      { runId: 'r1', completedAt: '2026-10-22T09:00:00+09:00' },
      { runId: 'r2', completedAt: '2026-10-22T10:00:00+09:00' }
    ],
    ch02: [{ runId: 'r3', completedAt: '2026-10-21T10:00:00+09:00' }]
  };
  meta().chapterRecords = {
    ch01: { completedAt: '2026-10-22T10:00:00+09:00' },
    ch03: { completedAt: '2026-10-22T11:00:00+09:00' }
  };
  meta().oxQuiz = { history: [
    { questionId: 'ox-1', answeredAt: '2026-10-22T09:00:00+09:00', isCorrect: true },
    { questionId: 'ox-1', answeredAt: '2026-10-22T09:30:00+09:00', isCorrect: false },
    { questionId: 'ox-2', answeredAt: '2026-10-22T10:00:00+09:00', isCorrect: false },
    { questionId: 'ox-1', answeredAt: '2026-10-21T10:00:00+09:00', isCorrect: true }
  ] };
`);
const protectedBefore = app.run('JSON.stringify(meta())');
app.run("LEARNING_MISSIONS.recordJokboKeyword('kw-1', new Date('2026-10-22T11:00:00+09:00')); LEARNING_MISSIONS.recordJokboKeyword('kw-1', new Date('2026-10-22T11:30:00+09:00')); LEARNING_MISSIONS.recordJokboKeyword('kw-2', new Date('2026-10-22T11:45:00+09:00'));");
let summary = JSON.parse(app.run(`JSON.stringify(LEARNING_MISSIONS.snapshot(new Date('${today.toISOString()}')))`));
assert.deepEqual(summary.counts, { exam: 2, story: 2, ox: 2, jokbo: 2 }, 'submitted retakes count separately, story chapters and OX questions deduplicate per day');
assert.equal(summary.completed, 2);
assert.equal(summary.total, 4);
assert.equal(summary.percent, 50);
assert.equal(summary.allComplete, false);
assert.equal((app.run(`LEARNING_MISSIONS.cardHTML(new Date('${today.toISOString()}'))`).match(/class="lm-row(?: is-complete)?"/g) || []).length, 2, 'home shows the first two selected missions by default');
assert(app.run(`LEARNING_MISSIONS.cardHTML(new Date('${today.toISOString()}'))`).includes('전체 보기'));
assert.equal(app.run('JSON.stringify(meta())'), protectedBefore, 'mission setup and keyword visits do not modify the existing learning save');

app.run(`LEARNING_MISSIONS.saveSettings({exam:{enabled:true,target:3},story:{enabled:true,target:3},ox:{enabled:true,target:5},jokbo:{enabled:true,target:3}});`);
for (let index = 3; index <= 5; index += 1) app.run(`meta().oxQuiz.history.push({questionId:'ox-${index}', answeredAt:'2026-10-22T11:00:00+09:00', isCorrect:${index % 2 === 0}});`);
app.run("LEARNING_MISSIONS.recordJokboKeyword('kw-3', new Date('2026-10-22T11:50:00+09:00'));");
summary = JSON.parse(app.run(`JSON.stringify(LEARNING_MISSIONS.snapshot(new Date('${today.toISOString()}')))`));
assert.equal(summary.counts.exam, 2, 'changing a goal recalculates from the same existing records');
assert.equal(summary.completed, 2, 'the new 3/3 targets remain incomplete while OX and Jokbo pass');
assert.equal(summary.allComplete, false);

app.run(`LEARNING_MISSIONS.saveSettings({exam:{enabled:true,target:1},story:{enabled:true,target:1},ox:{enabled:true,target:5},jokbo:{enabled:true,target:3}});`);
summary = JSON.parse(app.run(`JSON.stringify(LEARNING_MISSIONS.snapshot(new Date('${today.toISOString()}')))`));
assert.equal(summary.allComplete, true, 'the goal changes recompute completion without editing learning logs');
assert(app.run(`LEARNING_MISSIONS.cardHTML(new Date('${today.toISOString()}'))`).includes('오늘의 목표 달성!'));
assert(app.run(`LEARNING_MISSIONS.cardHTML(new Date('${today.toISOString()}'))`).includes('정말 잘했어요. 내일도 함께 이어가요.'));
assert.equal(app.run(`LEARNING_MISSIONS.snapshot(new Date('${tomorrow.toISOString()}')).counts.exam`), 0, 'completed submissions reset on the Korean calendar date');
assert.equal(app.run(`LEARNING_MISSIONS.snapshot(new Date('${tomorrow.toISOString()}')).counts.jokbo`), 0, 'keyword visits reset on the Korean calendar date');
app.run(`LEARNING_MISSIONS.recordJokboKeyword('kw-1', new Date('${tomorrow.toISOString()}'));`);
assert.equal(app.run(`LEARNING_MISSIONS.snapshot(new Date('${tomorrow.toISOString()}')).counts.jokbo`), 1, 'the same keyword can count again on a new day');

const reloaded = loadContext({ 'history-learning-missions-v1': app.storage.get('history-learning-missions-v1') });
assert.equal(reloaded.run('LEARNING_MISSIONS.state().settings.ox.target'), 5, 'goal settings persist after application reload');
assert.equal(reloaded.run('LEARNING_MISSIONS.state().settings.jokbo.target'), 3);
assert.equal(reloaded.run("LEARNING_MISSIONS.state().keywordVisits['2026-10-22'].length"), 3, 'daily keyword deduplication data persists after reload');
assert.equal(reloaded.run("LEARNING_MISSIONS.state().keywordVisits['2026-10-23'].length"), 1);

reloaded.run(`LEARNING_MISSIONS.saveSettings({exam:{enabled:false,target:3},story:{enabled:false,target:3},ox:{enabled:false,target:5},jokbo:{enabled:false,target:3}});`);
summary = JSON.parse(reloaded.run(`JSON.stringify(LEARNING_MISSIONS.snapshot(new Date('${tomorrow.toISOString()}')))`));
assert.equal(summary.total, 0, 'no selected missions produces the setup prompt state');
assert(reloaded.run(`LEARNING_MISSIONS.cardHTML(new Date('${tomorrow.toISOString()}'))`).includes('오늘 실천할 미션을 선택해 주세요.'));
assert.equal(reloaded.run('LEARNING_MISSIONS.state().settings.ox.enabled'), false);

console.log('PASS: daily mission aggregation, duplicate handling, target recalculation, settings persistence, Korean midnight reset and existing-save isolation.');
