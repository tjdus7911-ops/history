/* 원삼국·삼국 시즌 전환과 챕터 체인. joseon-ui.js 이후에 로드한다. */
if(globalThis.CORE_APP_READY===true&&globalThis.EDITORIAL_UI_READY===true){
const ANCIENT_ERA_IDS=['proto-kingdoms','three-kingdoms'];
const ancientIsEra=id=>ANCIENT_ERA_IDS.includes(id);
const ancientSeasonName=id=>historySeasonInfo(id).name;

for(const id of ANCIENT_ERA_IDS){const info=LEARNING_ERAS.find(era=>era.id===id);if(info)info.available=true;}

const openChapterCardBeforeAncient=openChapterCard;
openChapterCard=function(id){
 const era=chapterEra(id);if(!ancientIsEra(era))return openChapterCardBeforeAncient(id);
 const status=chapterStatus(id),order=eraChapters(era),index=order.findIndex(ch=>ch.chapterId===id),previous=order[index-1];
 if(status==='LOCKED')return toast(`CH.${previous?.number||'이전 챕터'}을 완료하면 열립니다.`);
 modal={type:'chapter',chapterId:id};render();
};

const resumeEraBeforeAncient=resumeEra;
resumeEra=function(id){
 if(!ancientIsEra(id))return resumeEraBeforeAncient(id);
 const era=eraInfo(id);if(!era.available)return;
 const current=chapterEra(mainRun().currentChapter);
 if(current!==id){
  rememberEraProgress();
  const saved=meta().eraProgress?.[historySeasonProgressKey(id)]?.resume;
  if(saved){state.run=JSON.parse(JSON.stringify(saved.run));state.mainRun=saved.mainRun?JSON.parse(JSON.stringify(saved.mainRun)):null;}
  else{const first=eraChapters(id)[0];state.mainRun=null;if(!first||!startChapter(state,first.chapterId))return toast(`${era.name}편을 시작할 수 없습니다.`);}
 }
 selectedEra=id;meta().selectedLearningEra=id;save();return playMain();
};

const resultFooterBeforeAncient=resultFooter;
resultFooter=function(chapterId){
 const era=chapterEra(chapterId);if(!ancientIsEra(era))return resultFooterBeforeAncient(chapterId);
 const name=ancientSeasonName(era);
 if(run().mode==='replay'&&run().completed&&!resultChapterId)return `<div class="replay-complete-actions"><button class="primary next" data-action="view-replay-result" data-chapter="${chapterId}">챕터 결과 보기</button><button class="secondary full" data-action="return-replay-home">눈떠보니 ${name}으로 돌아가기</button><button class="text-btn home-link" data-action="current-main">현재 이야기 이어하기</button></div>`;
 if(resultChapterId)return `<button class="primary next" data-action="request-replay" data-chapter="${chapterId}">챕터 다시 플레이</button><button class="text-btn home-link" data-nav="home">눈떠보니 ${name}으로 돌아가기</button>`;
 const order=eraChapters(era),index=order.findIndex(ch=>ch.chapterId===chapterId),next=order[index+1];
 return `<button class="primary next" data-nav="${next?'teaser':'home'}">${next?`CH.${next.number} ${next.title}`:'홈으로 돌아가기'}</button><button class="secondary full" data-action="request-replay" data-chapter="${chapterId}">다른 선택으로 다시 살아보기</button><button class="text-btn home-link" data-nav="home">홈으로 돌아가기</button>`;
};

const completeBeforeAncient=complete;
complete=function(){
 const id=resultChapterId||run().currentChapter,era=chapterEra(id);if(!ancientIsEra(era))return completeBeforeAncient();
 const info=CHAPTERS[id],r=resultRun(id),questions=chapterQuestions(id),attempted=questions.filter(q=>Object.hasOwn(r.questionResults||{},q.questionId)),correct=attempted.filter(q=>r.questionResults[q.questionId]).length,missed=attempted.length-correct,order=eraChapters(era),final=id===order.at(-1)?.chapterId,replay=run().mode==='replay'&&run().completed&&!resultChapterId;
 return `<section class="complete late-complete ancient-complete"><div class="seal">${era==='proto-kingdoms'?'原':'三'}</div><div class="eyebrow complete-label">CHAPTER ${info.number} ${replay?'REPLAY COMPLETE':'CLEAR'}</div><h1>${esc(info.title)}</h1><p>${esc(info.years)}</p><p>${final?'첫 장면부터 마지막 흐름까지, 직접 살아 낸 기억을 공식 기출의 원본 자료와 연결했습니다.':'연도·장소·맥락을 따라간 장면을 같은 officialQuestionId의 기출과 연결했습니다.'}</p><div class="chapter-learning"><div><small>스토리 장면</small><strong>${chapterScenes(id).length}개</strong></div><div><small>문제 세트</small><strong>${info.questionSetCount||0}개</strong></div><div><small>실제 기출</small><strong>${questions.filter(q=>q.isOfficial).length}문제</strong></div><div><small>자체 제작</small><strong>${questions.filter(q=>!q.isOfficial).length}문제</strong></div></div><p>${correct} / ${attempted.length} 정답 · 원본 이미지와 정답·해설은 공식 카탈로그 값을 유지합니다.</p>${missed?'<button class="secondary full" data-action="review-wrong">틀린 문제 다시 풀기</button>':''}${resultFooter(id)}</section>`;
};

const teaserBeforeAncient=teaser;
teaser=function(){
 const current=CHAPTERS[run().currentChapter],era=chapterEra(current?.chapterId);if(!ancientIsEra(era))return teaserBeforeAncient();
 const order=eraChapters(era),index=order.findIndex(ch=>ch.chapterId===current.chapterId),next=order[index+1],name=ancientSeasonName(era);
 if(!next)return `<section class="hero teaser has-art" style="${assetStyle(STORIES[current.completeStoryId]?.illustrationId)}"><div class="hero-content teaser-content"><span class="pill">SEASON COMPLETE</span><h2>눈떠보니 ${name} 기록 완료</h2><p>${esc(current.years)}<br>공식 기출의 단서와 살아 본 장면을 한 흐름으로 연결했습니다.</p><button class="primary teaser-button" data-nav="home">시즌 선택으로 돌아가기</button></div></section>`;
 const story=STORIES[next.startStoryId];return `<section class="hero teaser has-art" style="${assetStyle(story.illustrationId)}"><div class="hero-content teaser-content"><span class="pill">CHAPTER ${next.number} · NEXT</span><h2>${esc(next.title)}</h2><p>${esc(next.years)}<br>${esc(next.subtitle)}</p><button class="primary teaser-button" data-action="start-chapter" data-chapter="${next.chapterId}">CH.${next.number} 시작하기</button></div></section>`;
};

const modalHTMLBeforeAncient=modalHTML;
modalHTML=function(){
 if(modal?.type==='ancient-restart'){const name=ancientSeasonName(modal.eraId);return `<div class="modal-overlay"><section class="modal confirm-modal" role="dialog" aria-modal="true" aria-label="${name}편 처음부터 다시 시작"><h2>${name}편을 처음부터 다시 시작할까요?</h2><p class="lead modal-copy">현재 ${name} 이야기를 CH.00 첫 장면으로 되돌립니다.<br>완료 챕터와 누적 기출·오답 기록은 보존됩니다.</p><div class="modal-actions"><button class="glass" data-action="close">취소</button><button class="primary" data-action="confirm-ancient-restart" data-era="${modal.eraId}">처음부터 다시하기</button></div></section></div>`;}
 return modalHTMLBeforeAncient();
};

document.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button)return;
 if(button.dataset.action==='restart-episode'&&ancientIsEra(selectedEra)){event.stopImmediatePropagation();modal={type:'ancient-restart',eraId:selectedEra};render();return;}
 if(button.dataset.action==='confirm-ancient-restart'){
  event.stopImmediatePropagation();const eraId=button.dataset.era,first=eraChapters(eraId)[0];if(!first)return;
  state.mainRun=null;state.run=INITIAL_RUN(first.chapterId);state.run.started=true;selectedEra=eraId;meta().selectedLearningEra=eraId;modal=null;save();play();
 }
},true);

globalThis.ANCIENT_UI_READY=true;
render();
}
