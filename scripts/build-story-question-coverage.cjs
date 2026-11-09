#!/usr/bin/env node
/* 원삼국 스토리에 연결된 기출(이야기 속 문제)의 학습 범위를 조사해 dist/story-question-coverage.js를 만든다.
 *
 * 문제마다 정답 선지·오답 선지·자료 핵심(clue)에 나오는 초기 국가 핵심 개념을 찾고,
 * 그 개념이 문제가 나오는 장면까지의 스토리에서 이미 나왔는지(스토리 대사 기준) 확인한다.
 * - covered            : 정답과 선지의 개념을 모두 이미 배움
 * - distractor-ahead   : 정답은 배웠지만 오답 선지에 뒤 챕터에서 배우는 개념이 있음
 * - distractor-outside : 오답 선지에 스토리에서 다루지 않는 개념이 있음(족보 안내)
 * - answer-not-covered : 정답 개념을 아직 배우지 않음(배치 오류 → 빌드 실패)
 * 기출 원문(발문·선지)은 바꾸지 않는다.
 * 사용: node scripts/build-story-question-coverage.cjs [--check]
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const story = JSON.parse(fs.readFileSync(path.join(root, 'dist/proto-story-script.json'), 'utf8'));
const jokboContext = {}; jokboContext.globalThis = jokboContext; jokboContext.window = jokboContext;
vm.createContext(jokboContext);
vm.runInContext(fs.readFileSync(path.join(root, 'dist/jokbo-data.js'), 'utf8'), jokboContext);
const jokbo = jokboContext.JOKBO_DATA.keywords;

const flat = (value) => String(value || '').normalize('NFKC').replace(/\s+/g, '');
// 초기 국가·고조선 시험 개념(표시 이름). 짧은 낱말은 앞뒤가 다른 한글이 아닐 때만 인정한다.
const TERMS = ['부여', '사출도', '마가', '우가', '저가', '구가', '영고', '1책 12법', '우제점법', '형사취수제', '순장', '쑹화강',
  '고구려', '동맹', '서옥제', '데릴사위', '제가 회의', '부경', '대가', '사자', '조의', '선인', '계루부', '졸본',
  '옥저', '민며느리제', '가족 공동 무덤', '골장제', '읍군', '삼로',
  '동예', '책화', '족외혼', '단궁', '과하마', '반어피', '무천',
  '삼한', '마한', '진한', '변한', '신지', '읍차', '천군', '소도', '제정 분리', '계절제', '두레', '낙랑', '목지국', '벽골제', '의림지', '덩이쇠',
  '고조선', '범금 8조', '단군', '위만', '우거왕', '왕검성', '한 무제', '비파형 동검', '미송리식 토기', '고인돌', '세형 동검', '거푸집', '명도전'];
const SHORT = new Set(['대가', '사자', '조의', '선인', '두레', '단군']);
const termsIn = (text) => {
  const s = flat(text);
  return TERMS.filter((t) => {
    const f = flat(t).replace('우제점법', '우제점').replace('형사취수제', '형사취수');
    if (!SHORT.has(t)) return s.includes(f);
    return new RegExp('(?<![가-힣])' + f + '(?![가-힣])').test(s);
  });
};

const order = story.chapters.flatMap((chapter) => chapter.scenes.map((scene) => ({ chapter, scene })));
const position = new Map(order.map(({ scene }, index) => [scene.sceneId, index]));
const sceneText = (scene) => {
  const parts = [];
  (function walk(value) {
    if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === 'object') for (const [key, inner] of Object.entries(value)) key === 'text' && typeof inner === 'string' ? parts.push(inner) : walk(inner);
  })(scene);
  return flat(parts.join(' '));
};
const firstScene = new Map();
for (const { chapter, scene } of order) {
  const text = sceneText(scene);
  for (const t of TERMS) {
    const f = flat(t).replace('우제점법', '우제점').replace('형사취수제', '형사취수');
    if (!firstScene.has(t) && text.includes(f)) firstScene.set(t, { sceneId: scene.sceneId, chapterNumber: chapter.chapterNumber, chapterTitle: chapter.title.split(' — ')[0] });
  }
}
const jokboFor = (term) => {
  const f = flat(term).replace('우제점법', '우제점').replace('형사취수제', '형사취수');
  const hit = jokbo.find((k) => flat([k.value, k.definition, ...(k.bullets || []), ...(k.examTerms || [])].join(' ')).includes(f));
  return hit ? hit.id : null;
};

const questions = new Map(story.examPlan.questions.map((q) => [q.officialQuestionId, q]));
const rows = [];
for (const queue of story.examPlan.queues) {
  const at = position.get(queue.sceneId);
  const { chapter } = order[at];
  for (const id of queue.officialQuestionIds) {
    const q = questions.get(id);
    const answer = q.choices[q.answerIndex0];
    const correctTerms = termsIn(answer);
    const distractorTerms = [...new Set(q.choices.flatMap((choice, index) => index === q.answerIndex0 ? [] : termsIn(choice)))];
    const learned = (t) => firstScene.has(t) && position.get(firstScene.get(t).sceneId) <= at;
    const answerMissing = correctTerms.filter((t) => !learned(t));
    const ahead = distractorTerms.filter((t) => firstScene.has(t) && !learned(t)).map((t) => ({ term: t, chapterNumber: firstScene.get(t).chapterNumber, chapterTitle: firstScene.get(t).chapterTitle }));
    const outside = distractorTerms.filter((t) => !firstScene.has(t)).map((t) => ({ term: t, jokboId: jokboFor(t) }));
    const status = answerMissing.length ? 'answer-not-covered' : outside.length ? 'distractor-outside' : ahead.length ? 'distractor-ahead' : 'covered';
    rows.push({ questionId: id, eraId: 'proto', chapterId: 'proto_ch' + String(chapter.chapterNumber).padStart(2, '0'), sceneId: queue.sceneId,
      keywordIds: q.learningKeywordIds || [], learningCoverageStatus: status, answerTerms: correctTerms, answerMissing, aheadTerms: ahead, outsideTerms: outside });
  }
}

const notCovered = rows.filter((r) => r.learningCoverageStatus === 'answer-not-covered');
assert.deepEqual(notCovered.map((r) => r.questionId + ':' + r.answerMissing.join(',')), [], 'story-linked question asks an answer concept the story has not taught yet');
const unlinked = rows.flatMap((r) => r.outsideTerms.filter((t) => !t.jokboId).map((t) => r.questionId + ':' + t.term));
assert.deepEqual(unlinked, [], 'a distractor concept outside the story has no 족보 explanation');

const summary = rows.reduce((acc, r) => ({ ...acc, [r.learningCoverageStatus]: (acc[r.learningCoverageStatus] || 0) + 1 }), {});
const output = '/* Generated by scripts/build-story-question-coverage.cjs — 원삼국 스토리 연결 기출의 학습 범위. */\n'
  + 'globalThis.STORY_QUESTION_COVERAGE=Object.freeze(' + JSON.stringify({ storyId: 'proto-kingdoms', summary, questions: rows }) + ');\n';
const target = path.join(root, 'dist/story-question-coverage.js');
if (process.argv.includes('--check')) {
  assert.equal(fs.readFileSync(target, 'utf8'), output, 'dist/story-question-coverage.js is stale; run node scripts/build-story-question-coverage.cjs');
  console.log('PASS: story question coverage is current', JSON.stringify(summary));
} else {
  fs.writeFileSync(target, output);
  console.log('Wrote', path.relative(root, target), JSON.stringify(summary));
}
