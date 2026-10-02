const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=['data','ch02-data','ch03-data','exam-data','ch01-expansion','chapter-split','late-goryeo','official-late-exams'].map(file=>fs.readFileSync(`dist/${file}.js`,'utf8')).join('\n');
const context=vm.createContext({Date});
vm.runInContext(`${code};this.api={SAVE_VERSION,CHAPTERS,STORIES,QUESTIONS,QUESTION_SETS,SPLIT_STORY_QUESTION_IDS,SPLIT_REVIEW_IDS,ASSETS,CHARACTERS,CHARACTER_RENDER_PROFILES,LATE_GORYEO_REPORT,INITIAL,INITIAL_RUN,startChapter,applySceneEntry,applyChoice,recordQuestion,finishChapter,migrateSave};`,context);
const api=context.api,lateIds=['ch05','ch06','ch07','ch08','ch09','ch10','ch11','ch12'];
const expectedQuestions={ch05:9,ch06:15,ch07:12,ch08:15,ch09:15,ch10:15,ch11:15,ch12:15};

assert.equal(api.SAVE_VERSION,15);
assert(lateIds.every(id=>api.CHAPTERS[id].implemented));
for(const id of lateIds){
  const scenes=Object.values(api.STORIES).filter(scene=>scene.chapterId===id&&scene.storyActive!==false),questions=api.QUESTIONS.filter(q=>q.chapterId===id&&!q.retired&&!q.reviewOnly),sets=Object.values(api.QUESTION_SETS).filter(set=>set.chapterId===id);
  assert.equal(scenes.length,api.LATE_GORYEO_REPORT[id].scenes,`${id} scene count`);
  assert.equal(questions.length,expectedQuestions[id],`${id} question count`);
  assert.equal(sets.length,expectedQuestions[id]/3,`${id} set count`);
  assert(questions.filter(q=>!q.isOfficial).every(q=>q.sourceType==='original_advanced_practice'&&q.examType.startsWith('[심화 연습]')&&!q.examRound&&q.sourceReference==='https://contents.history.go.kr/'&&q.requiresOriginalImage===false&&q.assetStatus==='not_required_text_only'),`${id} practice source labels`);
  assert(questions.filter(q=>q.isOfficial).every(q=>q.sourceType==='official_exam'&&q.sourceVerified&&Number.isInteger(q.examRound)&&Number.isInteger(q.questionNumber)),`${id} official source labels`);
  assert(sets.every(set=>set.status==='ready'&&set.officialQuestionIds.length+set.practiceQuestionIds.length===3));
  assert.deepEqual(api.SPLIT_STORY_QUESTION_IDS[id],api.SPLIT_REVIEW_IDS[id]);
  const reached=new Set(),walk=sceneId=>{if(!sceneId||reached.has(sceneId))return;const scene=api.STORIES[sceneId];assert(scene&&scene.chapterId===id,`${id} broken route at ${sceneId}`);reached.add(sceneId);walk(scene.nextStoryId);for(const option of scene.choices||[])walk(option.nextStoryId)};walk(api.CHAPTERS[id].startStoryId);
  assert.equal(reached.size,scenes.length,`${id} all scenes reachable`);
  let sceneId=api.CHAPTERS[id].startStoryId,lastYear=-Infinity;
  while(sceneId){const scene=api.STORIES[sceneId];assert(scene.year>=lastYear,`${id} chronology regresses from ${lastYear} to ${scene.year} at ${sceneId}`);lastYear=scene.year;sceneId=scene.nextStoryId||(scene.choices&&scene.choices[0]?.nextStoryId);}
  assert(api.STORIES[api.CHAPTERS[id].completeStoryId].completeChapter,`${id} completion scene`);
}
assert.equal(lateIds.flatMap(id=>api.SPLIT_STORY_QUESTION_IDS[id]).length,111);
assert.equal(lateIds.flatMap(id=>api.SPLIT_STORY_QUESTION_IDS[id]).filter(id=>api.QUESTIONS.find(q=>q.questionId===id)?.isOfficial).length,8);
for(const id of ['ch05-seohui-negotiation','ch06-gaegyeong-rebuild','ch07-gwiju-battlefield','ch08-seogyeong-rebellion','ch09-choe-regime','ch10-cheoin-fortress','ch11-ssangseong-recovery','ch12-wihwado-rain'])assert.equal(api.ASSETS[id].status,'ready',id);

for(const id of ['seohui','yanggyu','ganggamchan','yoon_gwan','yi_jagyeom','myocheong','kim_busik','choe_chungheon','kim_yunhu','gongmin','sindon','choe_yeong','yi_seonggye','jeong_mongju'])assert.equal(api.CHARACTERS[id].renderTier,'MAIN',`${id} must be MAIN`);
assert.equal(api.CHARACTERS.player.renderTier,'MAIN');assert.equal(api.CHARACTERS.doyun.renderTier,'MAIN');assert.equal(api.CHARACTERS.merchant.renderTier,'SUPPORTING');
for(const id of ['yeon','seon','muyeong','harim','arin','junseo'])assert.equal(api.CHARACTERS[id].position,'left',`${id} must face the player from the NPC slot`);
for(const id of ['doyun_935','doyun_935_neutral','doyun_935_smile','doyun_935_serious','doyun_935_worried']){assert.equal(api.CHARACTER_RENDER_PROFILES.portraits[id].scale,1.35);assert.equal(api.CHARACTER_RENDER_PROFILES.portraits[id].anchorY,32)}
for(const id of ['doyun_943','doyun_943_neutral','doyun_943_smile','doyun_943_serious','doyun_943_worried']){assert.equal(api.CHARACTER_RENDER_PROFILES.portraits[id].scale,1.45);assert.equal(api.CHARACTER_RENDER_PROFILES.portraits[id].anchorY,36)}

const coverage=['서희','강동 6주','양규','귀주대첩','별무반','이자겸','묘청','무신 정변','망이·망소이','팔만대장경','삼별초','공민왕','쌍성총관부','전민변정도감','위화도 회군','과전법','정몽주','1392년','의천','지눌','삼국사기','직지'];
const corpus=lateIds.flatMap(id=>Object.values(api.STORIES).filter(scene=>scene.chapterId===id).flatMap(scene=>(scene.dialogues||[]).map(line=>line.dialogue))).join(' ');
for(const keyword of coverage)assert(corpus.includes(keyword),`missing story coverage: ${keyword}`);

const state=api.INITIAL();state.meta.completedChapters.push('ch01','ch02','ch03','ch04');state.run=api.INITIAL_RUN('ch04');state.run.completed=true;state.run.started=true;state.run.characterStates.doyun.isAlive=false;
let intentionallyWrong=false;
for(const chapterId of lateIds){
  assert(api.startChapter(state,chapterId),`${chapterId} unlock`);assert.equal(state.run.storyId,api.CHAPTERS[chapterId].startStoryId);assert.equal(state.run.characterStates.player.characterAge,23);assert.equal(state.run.characterStates.doyun.isAlive,false);
  let guard=0;
  while(!state.run.completed){
    assert(++guard<200,`${chapterId} play guard`);const scene=api.STORIES[state.run.storyId];assert(scene);
    api.applySceneEntry(state,scene.sceneId);
    if(scene.choices?.length){api.applyChoice(state,scene.sceneId,0);state.run.pending=null;continue}
    if(scene.questionSetId){const set=api.QUESTION_SETS[scene.questionSetId];for(const id of [...set.officialQuestionIds,...set.practiceQuestionIds]){const q=api.QUESTIONS.find(item=>item.questionId===id),answer=!intentionallyWrong?(intentionallyWrong=true,(q.answer+1)%q.choices.length):q.answer;api.recordQuestion(state,id,answer)}state.run.storyId=set.resumeStoryId;continue}
    if(scene.completeChapter){api.finishChapter(state);break}
    state.run.storyId=scene.nextStoryId;
  }
  assert(state.meta.completedChapters.includes(chapterId));assert.equal(state.meta.chapterRecords[chapterId].latestRun.questionScore.total,expectedQuestions[chapterId]);
}
assert.equal(state.run.currentChapter,'ch12');assert(state.run.completed);assert(state.meta.wrongQuestionIds.length>=1);assert.equal(state.run.characterStates.player.characterAge,23);
for(const id of ['ch12_918','ch12_faces','ch12_memory','ch12_teaser','ch12_after'])assert(!api.STORIES[id].questionSetId,`${id} emotional ending must not be interrupted`);
const legacy=JSON.parse(JSON.stringify(state));legacy.version=14;legacy.run.stats.wealth=91;const migrated=api.migrateSave(legacy);assert.equal(migrated.version,15);assert.equal(migrated.run.stats.wealth,91);assert.deepEqual(migrated.meta.completedChapters,state.meta.completedChapters);assert.equal(migrated.run.characterStates.player.characterAge,23);

console.log('PASS: CH.05–12 provide 118 reachable scenes, 37 uninterrupted three-question sets, 8 verified official and 103 clearly labeled practice questions, historical coverage, aging, save migration, and full data play.');
