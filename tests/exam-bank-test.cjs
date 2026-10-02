const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=['data','ch02-data','ch03-data','exam-data','ch01-expansion','chapter-split'].map(file=>fs.readFileSync(`dist/${file}.js`,'utf8')).join('\n');
const context=vm.createContext({});
vm.runInContext(`${code};this.api={CHAPTERS,STORIES,QUESTIONS};`,context);
const {CHAPTERS,STORIES,QUESTIONS}=context.api;

for(const chapterId of ['ch01','ch02','ch03','ch04']){
  const chapterQuestions=QUESTIONS.filter(question=>question.chapterId===chapterId&&!question.reviewOnly&&!question.retired);
  const expectedCounts={ch01:6,ch02:8,ch03:12,ch04:10};
  assert.equal(CHAPTERS[chapterId].questionCount,expectedCounts[chapterId],`${chapterId}: metadata count`);
  assert.equal(chapterQuestions.length,CHAPTERS[chapterId].questionCount,`${chapterId}: actual question count`);
  assert.equal(new Set(chapterQuestions.map(question=>question.questionId)).size,CHAPTERS[chapterId].questionCount,`${chapterId}: duplicate id`);
}

const expectedOfficialAnswers={
  'ch01-official-69-basic-10':2,
  'ch01-official-79-advanced-09':4,
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
const official=QUESTIONS.filter(question=>question.isOfficial&&!question.retired);
assert.equal(official.length,13);
assert.deepEqual(Object.fromEntries(official.map(question=>[question.questionId,question.answer])),expectedOfficialAnswers);
assert.deepEqual(Object.fromEntries(['ch01','ch02','ch03','ch04'].map(chapterId=>[chapterId,official.filter(question=>question.chapterId===chapterId).length])),{ch01:2,ch02:4,ch03:5,ch04:2});
for(const question of official){
  assert(['기본','심화'].includes(question.examLevel));
  assert.equal(question.sourceVerified,true);
  assert.equal(question.sourceStatus,'verified_from_attached_pdf');
  assert(question.storyConnection&&question.storyConnection.length>20);
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

console.log('PASS: CH.01/02 now use 6/8 story questions, CH.03 uses 12 story questions plus 5 review questions, and all 13 active official answers remain source-labeled and story-linked.');
