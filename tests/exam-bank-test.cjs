const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=['data','ch02-data','ch03-data','exam-data','ch01-expansion','chapter-split'].map(file=>fs.readFileSync(`dist/${file}.js`,'utf8')).join('\n');
const context=vm.createContext({});
vm.runInContext(`${code};this.api={CHAPTERS,STORIES,QUESTIONS};`,context);
const {CHAPTERS,STORIES,QUESTIONS}=context.api;

for(const chapterId of ['ch01','ch02','ch03','ch04']){
  const chapterQuestions=QUESTIONS.filter(question=>question.chapterId===chapterId&&!question.reviewOnly&&!question.retired);
  assert.equal(CHAPTERS[chapterId].questionCount,chapterId==='ch01'?4:chapterId==='ch02'?6:10,`${chapterId}: metadata count`);
  assert.equal(chapterQuestions.length,CHAPTERS[chapterId].questionCount,`${chapterId}: actual question count`);
  assert.equal(new Set(chapterQuestions.map(question=>question.questionId)).size,CHAPTERS[chapterId].questionCount,`${chapterId}: duplicate id`);
}

const expectedOfficialAnswers={
  'ch01-official-70-advanced-10':2,
  'ch01-official-73-basic-10':2,
  'ch01-official-74-advanced-10':3,
  'ch01-official-76-advanced-10':1,
  'ch02-official-69-advanced-10':4,
  'ch02-official-74-advanced-11':1,
  'ch02-official-76-advanced-50':4,
  'ch02-official-77-advanced-14':4,
  'ch02-official-78-advanced-11':3,
  'ch03-official-75-basic-10':2,
  'ch03-official-75-basic-12':2
};
const official=QUESTIONS.filter(question=>question.isOfficial);
assert.equal(official.length,7);
assert.deepEqual(Object.fromEntries(official.map(question=>[question.questionId,question.answer])),Object.fromEntries(Object.entries(expectedOfficialAnswers).filter(([id])=>!id.startsWith('ch01-'))));
assert.deepEqual(Object.fromEntries(['ch01','ch02','ch03','ch04'].map(chapterId=>[chapterId,official.filter(question=>question.chapterId===chapterId).length])),{ch01:0,ch02:0,ch03:5,ch04:2});
for(const question of official){
  assert(['기본','심화'].includes(question.examLevel));
  assert(question.sourceFile.endsWith('.pdf')&&!/[\\/]/.test(question.sourceFile));
  assert(question.answerFile.endsWith('.pdf')&&!/[\\/]/.test(question.answerFile));
  assert(STORIES[question.relatedSceneId]?.supplementalExam||question.questionId==='ch03-official-75-basic-10');
}

const addedPractice=QUESTIONS.filter(question=>/^ch03-practice-0[5-9]$/.test(question.questionId));
assert.equal(addedPractice.length,5);
assert(addedPractice.every(question=>!question.isOfficial&&question.examType==='실전 유형 연습 · 자체 제작'));
assert.equal(QUESTIONS.find(question=>question.questionId==='ch01-boss').originalResumeStoryId,'complete');
assert.equal(QUESTIONS.find(question=>question.questionId==='ch02-test-05').originalResumeStoryId,'ch02_complete');
assert.equal(QUESTIONS.find(question=>question.questionId==='ch03-practice-04').originalResumeStoryId,'ch03_courtyard');

console.log('PASS: CH.01/02 contain 4/6 story questions; CH.03/04 each contain 10 distributed questions; 7 preserved CH.02/CH.03 official answers and 5 new practice items are source-labeled and chained.');
