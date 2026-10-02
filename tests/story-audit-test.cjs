const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const code=['data','ch02-data','ch03-data','exam-data','ch01-expansion','chapter-split','late-goryeo','official-late-exams'].map(file=>fs.readFileSync(`dist/${file}.js`,'utf8')).join('\n');
const context=vm.createContext({Date});
vm.runInContext(`${code};this.api={SAVE_VERSION,CHAPTERS,STORIES,QUESTIONS,QUESTION_POOLS,QUESTION_SETS,SPLIT_STORY_QUESTION_IDS,SPLIT_REVIEW_IDS,ASSETS,PORTRAITS,CHARACTERS,CHARACTER_ASSET_MAP,INITIAL,applyChoice,applySceneEntry,applyDialogueMilestone,recordQuestion,finishChapter,startChapter,migrateSave};`,context);
const{SAVE_VERSION,CHAPTERS,STORIES,QUESTIONS,QUESTION_POOLS,QUESTION_SETS,SPLIT_STORY_QUESTION_IDS,SPLIT_REVIEW_IDS,ASSETS,PORTRAITS,CHARACTERS,CHARACTER_ASSET_MAP,INITIAL,applyChoice,applySceneEntry,applyDialogueMilestone,recordQuestion,finishChapter,startChapter,migrateSave}=context.api;

assert.equal(SAVE_VERSION,15);
assert.equal(Object.keys(CHAPTERS).length,12);
assert.deepEqual(Object.fromEntries(['ch01','ch02','ch03','ch04'].map(id=>[id,CHAPTERS[id].questionCount])),{ch01:9,ch02:15,ch03:12,ch04:3});
assert.deepEqual(Object.fromEntries(['ch01','ch02','ch03','ch04'].map(id=>[id,CHAPTERS[id].reviewQuestionCount])),{ch01:9,ch02:15,ch03:12,ch04:3});

const official=QUESTIONS.filter(q=>q.isOfficial&&!q.retired),earlyOfficial=official.filter(q=>Number(q.chapterId.slice(2))<=4),lateOfficial=official.filter(q=>Number(q.chapterId.slice(2))>=5),main=QUESTIONS.filter(q=>!q.retired&&!q.reviewOnly&&['ch01','ch02','ch03','ch04'].includes(q.chapterId));
assert.equal(earlyOfficial.length,21);assert.equal(lateOfficial.length,8);
assert.equal(main.length,39);
assert(main.every(q=>q.isOfficial?q.sourceVerified&&q.sourceType==='official_exam':q.sourceType==='original_advanced_practice'&&q.examType.startsWith('[심화 연습]')));
assert.equal(QUESTIONS.filter(q=>!q.isOfficial&&!q.retired&&['ch01','ch02','ch03','ch04'].includes(q.chapterId)).length,18);
const latePractice=QUESTIONS.filter(q=>!q.isOfficial&&!q.retired&&Number(q.chapterId.slice(2))>=5);
assert.equal(latePractice.length,103);assert(latePractice.every(q=>q.sourceType==='original_advanced_practice'&&q.examType.startsWith('[심화 연습]')));
for(const q of official){
  assert(q.sourceVerified&&q.sourceStatus==='verified_from_attached_pdf');
  assert(Number.isInteger(q.examRound)&&Number.isInteger(q.questionNumber));
  assert(['기본','심화'].includes(q.examLevel));
  assert(q.sourceFile.endsWith('.pdf')&&!/[\\/]/.test(q.sourceFile));
  assert(q.answerFile.endsWith('.pdf')&&!/[\\/]/.test(q.answerFile));
  assert(q.storyConnection?.length>10);
  assert(Array.isArray(q.conceptIds)&&q.conceptIds.length);
  assert(Array.isArray(q.historicalEventIds)&&q.historicalEventIds.length);
  assert(q.chapterCandidate);
  assert(STORIES[q.relatedSceneId]);assert(STORIES[q.resumeStoryId]);assert(ASSETS[q.relatedIllustrationId]);
}

const newAnswers={
  'ch02-official-65-advanced-10':0,'ch04-official-65-advanced-11':1,'ch02-official-66-advanced-09':2,
  'ch02-official-67-basic-10':1,'ch02-official-67-basic-11':0,'ch04-official-68-advanced-09':1,'ch03-official-68-advanced-11':4
};
for(const[id,answer]of Object.entries(newAnswers))assert.equal(QUESTIONS.find(q=>q.questionId===id).answer,answer,id);
assert.equal(QUESTIONS.find(q=>q.questionId==='ch02-official-66-advanced-09').chapterId,'ch02','66회 9번은 궁예가 아니라 견훤 문제');

const earlySets=Object.values(QUESTION_SETS).filter(set=>Number(set.chapterId.slice(2))<=4),ready=earlySets.filter(set=>set.status==='ready'),waiting=earlySets.filter(set=>set.status==='waiting_for_source');
assert.deepEqual(ready.map(set=>set.questionSetId),['ch01-foundation','ch01-gongsan','ch01-gochang','ch02-gyeonhwon','ch02-illyecheon','ch02-taejo-integration','ch02-north-welfare','ch02-hunyo','ch03-nobi-inspection','ch03-gwageo','ch03-gwangjong-synthesis','ch03-imperial-symbols','ch04-seongjong-system']);
assert.equal(waiting.length,0);
for(const set of earlySets){
  const expectedRequired=3,allIds=[...(set.officialQuestionIds||[]),...(set.practiceQuestionIds||[])];
  assert(QUESTION_POOLS[set.questionPoolId]);assert(STORIES[set.afterSceneId]);assert(STORIES[set.resumeStoryId]);assert.equal(set.requiredCount,expectedRequired);
  assert.equal(set.verifiedCount,set.officialQuestionIds.length);assert.equal(set.missingQuestionCount,set.status==='ready'?0:Math.max(0,expectedRequired-set.verifiedCount));
  assert(set.officialQuestionIds.every(id=>{const q=QUESTIONS.find(item=>item.questionId===id);return q?.isOfficial&&q.sourceVerified&&!q.retired}));
  assert((set.practiceQuestionIds||[]).every(id=>{const q=QUESTIONS.find(item=>item.questionId===id);return q&&!q.isOfficial&&!q.retired&&q.sourceType==='original_advanced_practice'}));
  const scene=STORIES[set.afterSceneId];assert.equal(scene.questionSetId,set.questionSetId);assert.equal(scene.questionSetStatus,set.status);
  if(set.status==='ready'){assert.equal(allIds.length,expectedRequired);assert.equal(scene.linkedQuestionIds.length,expectedRequired);assert.equal(scene.questionSequenceMode,'queue')}
  else assert.equal(scene.linkedQuestionIds,undefined);
}
const lateSets=Object.values(QUESTION_SETS).filter(set=>Number(set.chapterId.slice(2))>=5);
assert.equal(lateSets.length,37);for(const set of lateSets){assert.equal(set.status,'ready');assert.equal(set.officialQuestionIds.length+set.practiceQuestionIds.length,3);assert.equal(STORIES[set.afterSceneId].linkedQuestionIds.length,3)}
assert.deepEqual(Array.from(SPLIT_STORY_QUESTION_IDS.ch01),['ch01-official-69-basic-10','ch01-official-79-advanced-09','ch01-practice-foundation-sequence','ch01-practice-gongsan-source','ch01-practice-gongsan-result','ch01-practice-gongsan-after','ch01-practice-gochang-compare','ch01-practice-gochang-order','ch01-practice-gochang-context']);
assert.deepEqual(Array.from(SPLIT_STORY_QUESTION_IDS.ch02),['ch01-official-73-basic-10','ch02-official-66-advanced-09','ch01-official-74-advanced-10','ch01-official-76-advanced-10','ch01-official-70-advanced-10','ch02-practice-illyecheon-situation','ch02-official-67-basic-10','ch03-official-75-basic-12','ch02-official-65-advanced-10','ch02-official-67-basic-11','ch02-practice-north-policy','ch02-practice-north-compare','ch02-official-69-advanced-10','ch02-practice-hunyo-source','ch02-practice-taejo-policy']);

function walk(startId,state){let paths=0;const tests=new Set(),branches=new Set();
  function visit(id,copy,stack=[]){
    assert(!stack.includes(id),`cycle: ${[...stack,id].join(' -> ')}`);const s=STORIES[id];assert(s,`missing scene ${id}`);
    assert.notEqual(s.storyActive,false,`${id}: active route entered a retired scene`);
    applySceneEntry(copy,id);applyDialogueMilestone(copy,id,s.dialogues.length);
    if(s.completeChapter){paths++;return}
    const set=s.questionSetId&&QUESTION_SETS[s.questionSetId];
    if(set?.status==='ready'){const ids=[...(set.officialQuestionIds||[]),...(set.practiceQuestionIds||[])];assert.equal(ids.length,set.requiredCount);for(const qid of ids){const q=QUESTIONS.find(item=>item.questionId===qid);tests.add(qid);recordQuestion(copy,qid,q.answer)}return visit(set.resumeStoryId,copy,[...stack,id])}
    if(s.choices){branches.add(id);for(let index=0;index<s.choices.length;index++){const branch=JSON.parse(JSON.stringify(copy));applyChoice(branch,id,index);branch.run.pending=null;visit(branch.run.storyId,branch,[...stack,id])}return}
    assert(s.nextStoryId,`${id}: dead end`);visit(s.nextStoryId,copy,[...stack,id]);
  }
  visit(startId,state);return{paths,tests,branches};
}
const expected={ch01:{paths:4,tests:9},ch02:{paths:3,tests:15},ch03:{paths:324,tests:12},ch04:{paths:3,tests:3}};
for(const id of ['ch01','ch02','ch03','ch04']){
  const state=INITIAL();state.run.started=true;
  for(const previous of ['ch01','ch02','ch03']){if(previous===id)break;finishChapter(state);startChapter(state,CHAPTERS[previous].nextChapterId)}
  if(state.run.currentChapter!==id){while(state.run.currentChapter!==id){finishChapter(state);startChapter(state,CHAPTERS[state.run.currentChapter].nextChapterId)}}
  const result=walk(CHAPTERS[id].startStoryId,JSON.parse(JSON.stringify(state)));assert.equal(result.paths,expected[id].paths,`${id} paths`);assert.equal(result.tests.size,expected[id].tests,`${id} main tests`);
}

for(const sceneId of ['ch03_exam_75','ch03_trade_practice','ch03_exam_practice_05','ch03_choe_practice','ch03_exam_practice_06','ch03_exam_practice_07','ch03_timeline_practice','ch03_exam_practice_08','ch03_exam_practice_09'])assert.equal(STORIES[sceneId].storyActive,false,sceneId);
assert.equal(STORIES.ch03_gukjagam.questionSetId,'ch04-seongjong-system');
assert.equal(STORIES.ch03_policy_effect.nextStoryId,'ch03_three_friends');
assert.equal(STORIES.ch03_history_reflection.nextStoryId,'ch03_courtyard');
assert.equal(STORIES.ch03_farewell.nextStoryId,'ch03_doyun_soliloquy');
assert.equal(STORIES.ch03_doyun_soliloquy.nextStoryId,'ch03_death');
assert(!STORIES.ch03_doyun_soliloquy.quizId&&!STORIES.ch03_death.quizId&&!STORIES.ch03_legacy.quizId);
assert(STORIES.ch03_doyun_soliloquy.dialogues.some(line=>line.dialogue==='……나쁘지 않은 장사였소.'));
assert(STORIES.ch03_farewell.dialogues.some(line=>line.dialogue.includes('얼마나 더 살아야')));
assert(STORIES.ch03_death.dialogues.some(line=>line.dialogue.includes('오래 살아낸 사람')));
assert(STORIES.ch03_legacy.dialogues.some(line=>line.dialogue==='여전히 그대로였다.'));

assert.equal(CHARACTERS.player.position,'right');assert.equal(CHARACTERS.doyun.position,'left');
assert.equal(CHARACTERS.merchant_01.show,true);assert.equal(CHARACTERS.merchant.show,false);
assert.equal(STORIES.ch01_gongsan.enterCharacterStates.merchant_01.variant,'injured');
assert.equal(STORIES.ch02_news_935.enterCharacterStates.merchant_01.ageState,'older_935');
assert.equal(STORIES.ch02_transition.enterCharacterStates.doyun.characterAge,55);
assert.equal(STORIES.ch02_jump_956.enterCharacterStates.doyun.characterAge,62);
assert.equal(STORIES.ch03_transition.enterCharacterStates.doyun.characterAge,88);
assert.equal(STORIES.ch03_transition.enterCharacterStates.hyunwoo.characterAge,47);
for(const file of ['merchant_01.png','injured_merchant_01.png','merchant_01_935.png','doyun_935.png','doyun_943.png','doyun_old_neutral.png','hyunwoo_middle_neutral.png'])assert(fs.existsSync(path.join('dist','assets','characters',file)),file);
for(const asset of [...Object.values(ASSETS),...Object.values(PORTRAITS)].filter(a=>a.status==='ready'&&a.src))assert(fs.existsSync(path.join('dist',asset.src)),asset.src);

const old=INITIAL();old.version=13;old.meta.storyAuditVersion=0;old.run.started=true;old.run.currentChapter='ch04';old.run.storyId='ch03_trade_practice';old.run.activeQuestionId='ch03-practice-02';old.run.questionAnswer=1;old.run.stats.wealth=77;old.meta.wrongQuestionIds.push('ch03-practice-02');
const migrated=migrateSave(old);assert.equal(migrated.version,15);assert.equal(migrated.run.storyId,'ch03_three_friends');assert.equal(migrated.run.activeQuestionId,null);assert.equal(migrated.run.stats.wealth,77);assert(migrated.meta.wrongQuestionIds.includes('ch03-practice-02'));assert.equal(migrated.meta.storyAuditVersion,1);assert.deepEqual(migrateSave(migrated),migrated);

console.log(`PASS: ${official.length} verified official questions, ${ready.length} ready question sets, ${waiting.length} waiting sets, CH.01–04 reachable paths, aging assets, Doyun finale, and v15 save migration.`);
