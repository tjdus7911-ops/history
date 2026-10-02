const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=['data','ch02-data','ch03-data','exam-data','ch01-expansion','chapter-split'].map(file=>fs.readFileSync(`dist/${file}.js`,'utf8')).join('\n');
const context=vm.createContext({});
vm.runInContext(`${code};this.api={CHAPTERS,STORIES,QUESTIONS};`,context);
const {CHAPTERS,STORIES,QUESTIONS}=context.api;

for(const chapterId of ['ch01','ch02','ch03','ch04']){
  const chapterQuestions=QUESTIONS.filter(question=>question.chapterId===chapterId&&!question.reviewOnly&&!question.retired);
  const expectedCounts={ch01:2,ch02:6,ch03:3,ch04:3};
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
  ,'ch02-official-65-advanced-10':0
  ,'ch04-official-65-advanced-11':1
  ,'ch02-official-66-advanced-09':2
  ,'ch02-official-67-basic-10':1
  ,'ch02-official-67-basic-11':0
  ,'ch04-official-68-advanced-09':1
  ,'ch03-official-68-advanced-11':4
};
const official=QUESTIONS.filter(question=>question.isOfficial&&!question.retired);
assert.equal(official.length,20);
assert.deepEqual(Object.fromEntries(official.map(question=>[question.questionId,question.answer])),expectedOfficialAnswers);
assert.deepEqual(Object.fromEntries(['ch01','ch02','ch03','ch04'].map(chapterId=>[chapterId,official.filter(question=>question.chapterId===chapterId).length])),{ch01:2,ch02:9,ch03:6,ch04:3});
for(const question of official){
  assert(['기본','심화'].includes(question.examLevel));
  assert.equal(question.sourceVerified,true);
  assert.equal(question.sourceStatus,'verified_from_attached_pdf');
  assert(question.storyConnection&&question.storyConnection.length>20);
  assert(question.sourceFile.endsWith('.pdf')&&!/[\\/]/.test(question.sourceFile));
  assert(question.answerFile.endsWith('.pdf')&&!/[\\/]/.test(question.answerFile));
  assert(STORIES[question.relatedSceneId],`${question.questionId}: related story scene required`);
}

const ch01Active=QUESTIONS.filter(question=>question.chapterId==='ch01'&&!question.retired);
assert.deepEqual(ch01Active.map(question=>question.questionId),['ch01-official-69-basic-10','ch01-official-79-advanced-09']);
assert(ch01Active.every(question=>question.isOfficial&&question.sourceVerified&&question.exactTranscription&&question.questionAuditStatus==='VERIFIED_OFFICIAL'));
assert(QUESTIONS.filter(question=>question.chapterId==='ch01'&&!question.isOfficial).every(question=>question.retired&&question.questionAuditStatus==='SELF_AUTHORED'));
const ch02Active=QUESTIONS.filter(question=>question.chapterId==='ch02'&&!question.retired);
assert.deepEqual(ch02Active.map(question=>question.questionId).sort(),['ch01-official-70-advanced-10','ch01-official-73-basic-10','ch01-official-74-advanced-10','ch01-official-76-advanced-10','ch03-official-75-basic-12','ch02-official-65-advanced-10','ch02-official-66-advanced-09','ch02-official-67-basic-10','ch02-official-67-basic-11'].sort());
assert(ch02Active.every(question=>question.isOfficial&&question.sourceVerified&&question.questionAuditStatus==='VERIFIED_OFFICIAL'));
assert(QUESTIONS.filter(question=>question.chapterId==='ch02'&&!question.isOfficial).every(question=>question.retired&&question.questionAuditStatus==='SELF_AUTHORED'));

const addedPractice=QUESTIONS.filter(question=>/^ch03-practice-0[5-9]$/.test(question.questionId));
assert.equal(addedPractice.length,5);
assert(addedPractice.every(question=>!question.isOfficial&&question.examType==='실전 유형 연습 · 자체 제작'));
assert(QUESTIONS.every(question=>question.id===question.questionId&&question.topic&&question.era&&question.source),'normalized question metadata');
assert.equal(QUESTIONS.find(question=>question.questionId==='ch01-boss').originalResumeStoryId,'complete');
assert.equal(QUESTIONS.find(question=>question.questionId==='ch02-test-05').originalResumeStoryId,'ch02_complete');
assert.equal(QUESTIONS.find(question=>question.questionId==='ch03-practice-04').originalResumeStoryId,'ch03_courtyard');
const newStoryQuestions=QUESTIONS.filter(question=>['ch01-story-war-context','ch01-story-gongsan-battle','ch01-story-gochang-name','ch02-story-geumsansa','ch02-story-sasimgwan','ch02-story-balhae-refugees'].includes(question.questionId));
assert.equal(newStoryQuestions.length,6);assert(newStoryQuestions.every(question=>question.sourceType==='exam_style'&&!question.isOfficial&&question.gameMemory));

console.log('PASS: CH.01 plays 2 verified official questions, CH.02–04 use verified official sets, and all 20 official answers remain source-labeled and story-linked.');
