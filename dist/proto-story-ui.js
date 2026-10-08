/* 원삼국 대화 배치/저장 호환. 공통 렌더링은 기존 함수를 호출한다. */
if(globalThis.CORE_APP_READY===true&&globalThis.ANCIENT_UI_READY===true){
// Common learning initialization derives illustrations from scenes; keep old question metadata intact.
for(const [q,art] of PROTO_LEGACY_QUESTION_ART)q.relatedIllustrationId=art;
const protoBeforeCharacterStage=characterStage;
characterStage=function(visible,source,complete,p,assetId,allEntries,cursor){
 if(source?.eraId!=='proto-kingdoms')return protoBeforeCharacterStage(visible,source,complete,p,assetId,allEntries,cursor);
 if(source.flashback)return '';
 const entries=allEntries||conversationEntries(source,p),index=Math.max(0,Math.min((cursor||run().dialogueCursor||1)-1,entries.length-1)),active=entries[index];
 if(!active||active.speakerType==='narration')return '';
 const standing=(entry,position)=>({...entry,position,show:true,presentation:'standing'});
 const spoken=entry=>['player','thought','npc'].includes(entry?.speakerType);
 const nearby=[];for(let d=1;d<entries.length;d++){if(index-d>=0&&spoken(entries[index-d]))nearby.push(entries[index-d]);if(index+d<entries.length&&spoken(entries[index+d]))nearby.push(entries[index+d]);}
 let cast;
 if(active.speakerType==='npc'){
  const peer=nearby[0];cast=[standing(active,'left')];
  if(peer&&['player','thought'].includes(peer.speakerType))cast.push(standing(peer,'right'));
 }else{
  const peer=nearby.find(e=>e.speakerType==='npc')||(p?(source.dialogues||[]).findLast(e=>e.speakerType==='npc'):null);
  cast=[...(peer?[standing(peer,'left')]:[]),standing(active,'right')];
 }
 const portraits=cast.map(entry=>stagePortrait(entry,entry.position,entry.characterId===active.characterId)).join('');
 return portraits?`<div class="character-stage" data-slot-mode="proto-conversation" aria-hidden="true">${portraits}</div>`:'';
};
const protoBeforeEntries=conversationEntries;
conversationEntries=function(source,p){
 const entries=protoBeforeEntries(source,p);
 if(source?.sceneId!=='proto_ch06_s13'||p)return entries;
 const chosen=run().flags?.protoChoice_6_11;
 const extra=chosen===0?protoLine({speaker:'단',text:'내게 먼저 라온의 말을 들으라고 해 줘서 고맙다.'}):chosen===1?protoLine({speaker:'라온',text:'형이 걱정했다는 것도 이해해. 내 선택을 존중해 줘서 고마워.'}):chosen===2?protoLine({speaker:'단',text:'우리끼리 이야기할 시간을 내어 줘서 고맙다.'}):null;
 return extra?[...entries,extra]:entries;
};
function protoMigrateRun(r){
 if(!r||CHAPTERS[r.currentChapter]?.eraId!=='proto-kingdoms'||r.flags?.protoStoryVersion===PROTO_STORY_VERSION)return;
 r.flags||={};
 const hasProgress=(r.visited||[]).length>0||r.pending||r.activeQuestionId;
 if(hasProgress&&!r.completed){
  r.flags.protoLegacyResumeScene=r.storyId;
  // Preserve active legacy quizzes and their scores; resume at the chapter opening afterward.
  if(r.activeQuestionId){r.questionQueueResumeStoryId=CHAPTERS[r.currentChapter].startStoryId;r.resumeAfterLegacyQuiz=CHAPTERS[r.currentChapter].startStoryId;}
  else{r.storyId=CHAPTERS[r.currentChapter].startStoryId;r.pending=null;r.dialogueSceneId=null;r.dialogueCursor=1;}
 }
 r.flags.protoStoryVersion=PROTO_STORY_VERSION;
}
const protoBeforeEnterStory=enterStory;
enterStory=function(){protoMigrateRun(run());const s=STORIES[run().storyId];if(s?.legacyAliasFor)run().storyId=s.legacyAliasFor;return protoBeforeEnterStory();};
const protoBeforeContinueQuestion=continueStoryQuestion;
continueStoryQuestion=function(){
 const r=run(),q=activeQuestion(),last=!(r.questionQueue||[]).length||(r.questionQueueIndex||0)+1>=r.questionQueue.length;
 if(q?.protoStoryVersion===PROTO_STORY_VERSION&&last&&STORIES[q.relatedSceneId]?.completeChapter){
  r.storyId=q.relatedSceneId;r.questionQueue=[];r.questionQueueIndex=0;r.activeQuestionId=null;r.activeQuestionSetId=null;r.questionAnswer=null;r.questionQueueResumeStoryId=null;
  finishChapter(state);save();return navigate('complete');
 }
 return protoBeforeContinueQuestion();
};
const protoBeforeResumeEra=resumeEra;
resumeEra=function(id){const result=protoBeforeResumeEra(id);if(id==='proto-kingdoms'){protoMigrateRun(run());save();render();}return result;};
protoMigrateRun(state.run);protoMigrateRun(state.mainRun);
// The image includes its original numbering. Surrounding story UI uses only the learning label.
const protoBeforeSourceLabel=questionSourceLabel;
questionSourceLabel=function(q){return q?.protoStoryVersion===PROTO_STORY_VERSION?'한능검 대비 · 실제 기출':protoBeforeSourceLabel(q);};
const protoBeforeFigure=officialQuestionFigure;
officialQuestionFigure=function(q,label){
 if(q?.protoStoryVersion!==PROTO_STORY_VERSION)return protoBeforeFigure(q,label);
 return `<figure class="official-source-question"><button class="question-image-open" data-action="exam-image" data-question="${esc(q.questionId)}" aria-label="원본 문제 확대"><img src="${esc(q.sourceQuestionImage)}" loading="lazy" decoding="async" alt="실제 기출 원본: 지문, 자료, 보기"></button><figcaption>출처: 국사편찬위원회 한국사능력검정시험 · 탭하여 확대</figcaption></figure>`;
};
const protoBeforeComplete=complete;
complete=function(){
 const id=resultChapterId||run().currentChapter;if(CHAPTERS[id]?.eraId!=='proto-kingdoms')return protoBeforeComplete();
 const info=CHAPTERS[id],r=resultRun(id),questions=chapterQuestions(id),attempted=questions.filter(q=>Object.hasOwn(r.questionResults||{},q.questionId)),correct=attempted.filter(q=>r.questionResults[q.questionId]).length;
 return `<section class="complete late-complete ancient-complete"><div class="seal">原</div><div class="eyebrow complete-label">CHAPTER ${info.number} CLEAR</div><h1>${esc(info.title)}</h1><p>단과 함께 걸은 길, 사람들에게 배운 역사</p><div class="chapter-learning"><div><small>이야기</small><strong>${chapterScenes(id).length}씬</strong></div><div><small>실제 기출</small><strong>${questions.length}문항</strong></div><div><small>복습 정답</small><strong>${correct} / ${attempted.length}</strong></div></div>${correct<attempted.length?'<button class="secondary full" data-action="review-wrong">틀린 문제 다시 풀기</button>':''}${resultFooter(id)}</section>`;
};
globalThis.PROTO_STORY_UI_READY=true;render();
}
