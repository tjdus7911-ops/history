const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');

const html=fs.readFileSync('dist/index.html','utf8');
const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]);
const dataScripts=scripts.slice(0,scripts.indexOf('v2-learning.js'));
const context=vm.createContext({console});
vm.runInContext(dataScripts.map(file=>fs.readFileSync(path.join('dist',file),'utf8')).join('\n')+';this.snapshot={ASSETS,PORTRAITS,CHARACTERS,STORIES,QUESTIONS,QUESTION_SETS,CHAPTERS,JOSEON_BLUEPRINTS,JOSEON_OFFICIAL_QUESTION_IDS,JOSEON_QUESTION_SCOPE,ERA_PROTAGONISTS,CHARACTER_RENDER_PROFILES,JOSEON_CHARACTER_FRAMING,JOSEON_CHARACTER_RENDER_PROFILES};',context);
const data=JSON.parse(vm.runInContext('JSON.stringify(snapshot)',context));

const chapters=Object.values(data.CHAPTERS).filter(chapter=>chapter.eraId==='joseon').sort((a,b)=>Number(a.number)-Number(b.number));
assert.equal(chapters.length,23);
assert.deepEqual(chapters.map(chapter=>chapter.number),Array.from({length:23},(_,index)=>String(index).padStart(2,'0')));
assert(chapters.every(chapter=>chapter.implemented));

const scenes=Object.values(data.STORIES).filter(story=>story.eraId==='joseon');
const questions=data.QUESTIONS.filter(question=>question.primaryEra==='joseon');
const official=questions.filter(question=>question.isOfficial);
const practice=questions.filter(question=>!question.isOfficial);
assert.equal(official.length,65);
assert.equal(practice.length,6);
assert.equal(new Set(questions.map(question=>question.questionId)).size,71);
assert.equal(data.JOSEON_QUESTION_SCOPE.officialCount,65);
assert.equal(data.JOSEON_QUESTION_SCOPE.practiceCount,6);
assert.deepEqual(data.JOSEON_QUESTION_SCOPE.rounds,[73,74,75,76,77,78,79]);
assert.equal(data.JOSEON_OFFICIAL_QUESTION_IDS.length,65);

const chapter00=chapters[0];
assert.equal(chapter00.questionCount,0);
assert.equal(questions.filter(question=>question.chapterId===chapter00.chapterId).length,0);
assert(!scenes.filter(story=>story.chapterId===chapter00.chapterId).some(story=>story.questionSetId));
const prologueText=scenes.filter(story=>story.chapterId===chapter00.chapterId).flatMap(story=>story.dialogues||[]).map(line=>line.dialogue).join(' ');
for(const phrase of ['경복궁','비가','번개','태조','1390년대','조선'])assert(prologueText.includes(phrase),`CH.00 missing ${phrase}`);

for(const chapter of chapters){
  const ownScenes=scenes.filter(story=>story.chapterId===chapter.chapterId);
  assert(ownScenes.length>=4,`${chapter.chapterId} scene count`);
  assert(data.STORIES[chapter.startStoryId],`${chapter.chapterId} start scene`);
  assert(data.STORIES[chapter.completeStoryId]?.completeChapter,`${chapter.chapterId} complete scene`);
  assert.equal(chapter.questionCount,questions.filter(question=>question.chapterId===chapter.chapterId).length,`${chapter.chapterId} question count`);
  for(const story of ownScenes){
    assert(data.ASSETS[story.illustrationId],`${story.sceneId} illustration`);
    if(story.nextStoryId)assert(data.STORIES[story.nextStoryId],`${story.sceneId} next story`);
    if(story.questionSetId){
      const set=data.QUESTION_SETS[story.questionSetId];
      assert(set&&set.status==='ready',`${story.sceneId} question set`);
      assert(set.requiredCount>=1&&set.requiredCount<=3,`${story.sceneId} question density`);
      assert.deepEqual([...set.officialQuestionIds,...set.practiceQuestionIds],story.linkedQuestionIds);
    }
  }
}

const expectedByRound={73:12,74:8,75:8,76:10,77:9,78:9,79:9};
for(const [round,count] of Object.entries(expectedByRound))assert.equal(official.filter(question=>question.examRound===Number(round)).length,count);
for(const question of official){
  assert.equal(question.questionId,question.officialQuestionId);
  assert(question.sourceVerified&&question.sourceImageStatus==='verified');
  assert.equal(question.examLevel,'심화');
  assert.equal(question.choices.length,5);
  assert(question.answer>=0&&question.answer<5);
  assert.equal(question.questionImage,question.sourceQuestionImage);
  assert.equal(question.sourcePdf,question.sourceFile);
  assert(/^[a-f0-9]{64}$/.test(question.sourcePdfHash));
  assert(/^[a-f0-9]{64}$/.test(question.answerPdfHash));
  assert.equal(question.sourceImageWidth,714);
  assert(question.sourceImageHeight>=450);
  const image=path.join('dist',question.sourceQuestionImage);
  assert(fs.existsSync(image),`${question.questionId} image`);
  assert(fs.statSync(image).size>12000,`${question.questionId} image payload`);
  const story=data.STORIES[question.relatedSceneId];
  assert(story&&story.chapterId===question.chapterId,`${question.questionId} related scene`);
  assert.equal(question.relatedIllustrationId,story.illustrationId);
  assert(story.linkedOfficialQuestionIds.includes(question.questionId));
}
for(const question of practice){
  assert.equal(question.isOfficial,false);
  assert.equal(question.sourceType,'original_advanced_practice');
  assert.equal(question.examType,'심화 연습 · 자체 제작');
  assert(!question.officialQuestionId);
}

const endingText=['joseon_ch22_shore','joseon_ch22_unyo','joseon_ch22_complete'].flatMap(id=>data.STORIES[id].dialogues).map(line=>line.dialogue);
for(const line of ['이제 외국 놈들도 다시는 오지 않겠지요.','...글쎄.','1875년. 어둠 너머로 다시 함포와 증기선의 그림자가 다가왔다.','...또 왔네.','운요호.','END','새로운 시대가 다가오고 있습니다.'])assert(endingText.includes(line),`ending line: ${line}`);

const heroine=data.ERA_PROTAGONISTS.protagonist_joseon;
assert.equal(heroine.status,'playable');
assert.equal(heroine.gender,'female');
assert.equal(heroine.expressions.length,15);
assert.equal(heroine.ageState.kind,'persistent');
for(const expression of heroine.expressions)assert(fs.existsSync(path.join('dist',heroine.assetPaths[expression])),`heroine ${expression}`);
for(const id of ['minjun_j','minjun_elder_j','joseon_scholar','joseon_soldier','joseon_naval','joseon_woman'])assert(data.CHARACTERS[id]&&fs.existsSync(path.join('dist',data.PORTRAITS[`${id}_neutral`].src)),`NPC ${id}`);
const joseonNpcIds=['minjun_j','minjun_elder_j','joseon_scholar','joseon_soldier','joseon_naval','joseon_woman'];
assert.deepEqual(Object.keys(data.JOSEON_CHARACTER_RENDER_PROFILES).sort(),['joseon_player',...joseonNpcIds].sort());
const expectedFrames={joseon_player:{scale:1.73,translateX:6,translateY:17},minjun_j:{scale:1.92,translateX:0,translateY:14},minjun_elder_j:{scale:1.82,translateX:0,translateY:14},joseon_scholar:{scale:1.87,translateX:0,translateY:14},joseon_soldier:{scale:1.7,translateX:0,translateY:14},joseon_naval:{scale:1.62,translateX:0,translateY:14},joseon_woman:{scale:1.79,translateX:0,translateY:14}};
assert.equal(data.JOSEON_CHARACTER_FRAMING.mode,'upper-body');assert(data.JOSEON_CHARACTER_FRAMING.lockDialogueStateScale);
for(const [id,frame] of Object.entries(expectedFrames)){assert.deepEqual(data.JOSEON_CHARACTER_FRAMING[id],frame,`${id} framing values`);const profile=data.JOSEON_CHARACTER_RENDER_PROFILES[id];assert.equal(profile.scale,frame.scale,`${id} visual scale`);assert.equal(profile.anchorX,frame.translateX,`${id} horizontal offset`);assert.equal(profile.anchorY,frame.translateY,`${id} top anchor offset`);assert.equal(profile.framing,'upper-body',`${id} upper-body framing`);assert(profile.lockStateScale,`${id} active/listening scale lock`)}
for(const id of joseonNpcIds)assert.equal(data.CHARACTERS[id].position,'left',`${id} stays left`);
assert.equal(data.CHARACTERS.joseon_player.position,'right');
assert.equal(data.CHARACTER_RENDER_PROFILES.characters.player.scale??1,1,'Goryeo player scale preserved');
assert.equal(data.CHARACTER_RENDER_PROFILES.characters.doyun.scale??1,1,'Goryeo Doyun scale preserved');
assert.equal(Object.keys(data.ASSETS).filter(id=>id.startsWith('joseon-bg-')).length,16);
assert(fs.existsSync('docs/JOSEON_OFFICIAL_QUESTION_MAPPING.md'));

console.log('PASS: Joseon CH.00–22 data, 65 official images, 6 labeled practice questions, scene mapping, assets, heroine, NPCs and fixed ending');
