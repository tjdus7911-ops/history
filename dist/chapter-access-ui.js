/* Implemented chapters are freely enterable; completion is earned independently. */
if(globalThis.CORE_APP_READY===true){
 const available=id=>!!CHAPTERS[id]?.implemented&&eraChapters(chapterEra(id)).some(ch=>ch.chapterId===id);
 const oldStatus=chapterStatus;
 chapterStatus=function(id){return available(id)?meta().completedChapters.includes(id)?'COMPLETED':'CURRENT':oldStatus(id);};
 const oldDetail=chapterDetailModal;
 chapterDetailModal=function(id){return oldDetail(id).replace('>다음 이야기</p>','>미시작</p>');};
 const oldRow=editorialChapterRow;
 editorialChapterRow=function(ch){let html=oldRow(ch);if(available(ch.chapterId)&&!meta().completedChapters.includes(ch.chapterId)&&!(run().currentChapter===ch.chapterId&&run().started))html=html.replace('aria-label="진행 중"','aria-label="미시작"');return html;};
 openChapterCard=function(id){if(!available(id))return toast('아직 준비 중인 챕터입니다.');modal={type:'chapter',chapterId:id};render();};
 function begin(id,replay=false){
  if(!available(id))return toast('아직 준비 중인 챕터입니다.');
  const era=chapterEra(id);
  if(chapterEra(mainRun().currentChapter)!==era){
   rememberEraProgress();const saved=meta().eraProgress?.[historySeasonProgressKey(era)]?.resume;
   state.run=saved?.run?cloneRun(saved.run):INITIAL_RUN(id);state.mainRun=saved?.mainRun?cloneRun(saved.mainRun):null;
  }
  const keep=replay||state.mainRun||meta().completedChapters.includes(id)||(run().started&&!run().completed&&run().currentChapter!==id);
  if(keep){if(!beginReplay(state,id))return false;}else if(!startChapter(state,id))return false;
  selectedEra=era;meta().selectedLearningEra=era;resultChapterId=null;modal=null;quizMode='story';
  preloadChapterCore(id);save();screen='game';enterStory();render();window.scrollTo(0,0);return true;
 }
 startAvailableChapter=function(id){return begin(id);};
 const oldResume=resumeEra;
 resumeEra=function(id){
  if(run().mode==='replay'&&chapterEra(run().currentChapter)===id&&available(run().currentChapter)){
   selectedEra=id;meta().selectedLearningEra=id;resultChapterId=null;modal=null;save();return play();
  }
  const saved=meta().eraProgress?.[historySeasonProgressKey(id)]?.resume;
  const valid=id==='proto-kingdoms'?globalThis.PROTO_SAVE_V3.validResume(saved,globalThis.PROTO_SAVE_V3.ensureBook(meta())):id==='three-kingdoms'?globalThis.THREE_SAVE_V3.validResume(saved):saved?.run&&available(saved.run.currentChapter)&&STORIES[saved.run.storyId]?.chapterId===saved.run.currentChapter;
  if(valid&&saved.run.mode==='replay'&&chapterEra(saved.run.currentChapter)===id){rememberEraProgress();state.run=cloneRun(saved.run);state.mainRun=saved.mainRun?cloneRun(saved.mainRun):null;selectedEra=id;meta().selectedLearningEra=id;resultChapterId=null;modal=null;save();return play();}
  return oldResume(id);
 };
 resultFooter=function(id){
  const order=eraChapters(chapterEra(id)),index=order.findIndex(ch=>ch.chapterId===id),next=index>=0?order[index+1]:null;
  return '<div class="replay-complete-actions">'+(next?.implemented?'<button class="primary next" data-action="chapter-next-direct" data-chapter="'+id+'">다음 챕터로 · CH.'+next.number+' '+esc(next.title)+'</button>':'<button class="primary next" data-nav="home">시대 선택으로</button>')+'<button class="secondary full" data-action="chapter-list-direct" data-chapter="'+id+'">챕터 목록</button><button class="secondary full" data-action="chapter-replay-direct" data-chapter="'+id+'">다시 플레이</button></div>';
 };
 document.addEventListener('click',event=>{
  const b=event.target.closest('button'),action=b?.dataset.action;if(action==='continue-chapter'&&b.dataset.chapter===run().currentChapter&&run().mode==='replay'){event.preventDefault();event.stopImmediatePropagation();modal=null;resultChapterId=null;return play();}if(!['chapter-next-direct','chapter-list-direct','chapter-replay-direct'].includes(action))return;
  event.preventDefault();event.stopImmediatePropagation();const id=b.dataset.chapter;if(!available(id))return;
  if(action==='chapter-list-direct'){selectedEra=chapterEra(id);meta().selectedLearningEra=selectedEra;modal=null;resultChapterId=null;save();eraTab='chapters';return navigate('era');}
  if(action==='chapter-replay-direct')return begin(id,true);
  const order=eraChapters(chapterEra(id)),index=order.findIndex(ch=>ch.chapterId===id),next=order[index+1];
  if(index>=0&&next?.implemented)return begin(next.chapterId,run().mode==='replay'||!!resultChapterId);
 },true);
 globalThis.CHAPTER_ACCESS={available,begin};
}
