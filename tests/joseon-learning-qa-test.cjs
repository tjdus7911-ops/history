const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');

const html=fs.readFileSync('dist/index.html','utf8');
const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]);
const dataScripts=scripts.slice(0,scripts.indexOf('v2-learning.js'));
const context=vm.createContext({console});
vm.runInContext(dataScripts.map(file=>fs.readFileSync(path.join('dist',file),'utf8')).join('\n')+';this.snapshot={ASSETS,STORIES,QUESTIONS,QUESTION_SETS,CHAPTERS,JOSEON_BLUEPRINTS,JOSEON_OFFICIAL_STORY_MAP,JOSEON_RELATED_SCENE_REMAP_COUNT,JOSEON_QUESTION_SCOPE};',context);
const data=JSON.parse(vm.runInContext('JSON.stringify(snapshot)',context));
const chapters=Object.values(data.CHAPTERS).filter(chapter=>chapter.eraId==='joseon').sort((a,b)=>Number(a.number)-Number(b.number));
const scenes=Object.values(data.STORIES).filter(story=>story.eraId==='joseon');
const questions=data.QUESTIONS.filter(question=>question.primaryEra==='joseon');
const official=questions.filter(question=>question.isOfficial),practice=questions.filter(question=>!question.isOfficial);
const prohibited=/핵심 개념을 (판별|확인)|핵심 단서입니다|자료의 조건과 일치|다른 선택지는 구분|실제 한능검 자료와 선택지로 구분/;

assert.equal(chapters.length,23);
assert.equal(official.length,65);
assert.equal(practice.length,6);
assert.equal(data.JOSEON_QUESTION_SCOPE.storyBlockCount,68);
assert.equal(Object.keys(data.JOSEON_OFFICIAL_STORY_MAP).length,65);
assert(data.JOSEON_RELATED_SCENE_REMAP_COUNT>0);
assert.equal(data.JOSEON_RELATED_SCENE_REMAP_COUNT,data.JOSEON_QUESTION_SCOPE.relatedSceneRemapCount);
assert.equal(data.ASSETS['joseon-modern-gyeongbokgung'].src,'assets/joseon/backgrounds/modern-gyeongbokgung-rain.webp');
assert(fs.statSync(path.join('dist',data.ASSETS['joseon-modern-gyeongbokgung'].src)).size>100000);

const report=[];
for(const chapter of chapters){
  const ownScenes=scenes.filter(scene=>scene.chapterId===chapter.chapterId);
  const storyBlocks=ownScenes.filter(scene=>!scene.completeChapter);
  const sets=storyBlocks.filter(scene=>scene.questionSetId).map(scene=>data.QUESTION_SETS[scene.questionSetId]);
  const ownQuestions=questions.filter(question=>question.chapterId===chapter.chapterId);
  for(const scene of storyBlocks){
    assert(scene.dialogues.length>=6||chapter.number==='00',`${scene.sceneId}: compressed story block`);
    assert(data.ASSETS[scene.illustrationId],`${scene.sceneId}: missing background`);
  }
  for(const set of sets){
    assert(set.requiredCount>=1&&set.requiredCount<=3,`${set.questionSetId}: 1–3 questions per block`);
    assert.equal(set.resumeStoryId,data.STORIES[set.afterSceneId].nextStoryId,`${set.questionSetId}: resume scene`);
  }
  report.push({chapter:`CH.${chapter.number}`,scenes:ownScenes.length,storyBlocks:storyBlocks.length,questionBlocks:sets.length,official:ownQuestions.filter(question=>question.isOfficial).length,practice:ownQuestions.filter(question=>!question.isOfficial).length});
}

for(const question of official){
  const scene=data.STORIES[question.relatedSceneId],set=data.QUESTION_SETS[scene.questionSetId];
  assert(scene&&scene.chapterId===question.chapterId,`${question.questionId}: related scene`);
  assert(set.officialQuestionIds.includes(question.questionId),`${question.questionId}: canonical set reuse`);
  assert.equal(question.resumeStoryId,scene.nextStoryId,`${question.questionId}: resumeStoryId`);
  assert(question.storyConnection?.includes(scene.title),`${question.questionId}: Story connection`);
  assert(!prohibited.test(question.explanation),`${question.questionId}: generic explanation`);
  assert(question.explanation.length>=80,`${question.questionId}: explanation depth`);
}
for(const question of practice){
  assert.equal(question.examType,'심화 연습 · 자체 제작');
  assert(!question.officialQuestionId);
}

const ch00=scenes.filter(scene=>scene.chapterId==='joseon-ch00').flatMap(scene=>scene.dialogues||[]).map(line=>line.dialogue).join(' ');
for(const phrase of ['경복궁 돌담길','맑던 하늘','처마','휴대전화','번개','흙길','촬영장','안테나','새 도성','궁궐','태조','눈떠보니 조선'])assert(ch00.includes(phrase),`CH.00: ${phrase}`);
assert(!/고려에서 왔|고려에서도/.test(ch00),'CH.00: no Goryeo connection exposition');
const mapping=fs.readFileSync('docs/JOSEON_STORY_LEARNING_MAPPING.md','utf8');
for(let number=0;number<=22;number++)assert(mapping.includes(String(number).padStart(2,'0')),`mapping CH.${number}`);

console.log('PASS: Joseon Story learning QA');
console.log(JSON.stringify({relatedSceneRemapCount:data.JOSEON_RELATED_SCENE_REMAP_COUNT,totals:{scenes:scenes.length,storyBlocks:scenes.filter(scene=>!scene.completeChapter).length,questionBlocks:report.reduce((sum,row)=>sum+row.questionBlocks,0),official:official.length,practice:practice.length},chapters:report},null,2));
