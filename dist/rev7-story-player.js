/* Rev.7 story presentation. All advance/choice/answer/replay commands use the existing runtime. */
(function(){
 'use strict';
 if(!globalThis.REV7_STORY_VIEWS_READY)return;
 const icon=name=>'<span class="r7-icon" aria-hidden="true"><img src="media/rev7/'+name+'.svg" alt=""></span>';
 let largeText=false,showLog=false,originalControls='';
 const gameBefore=game;
 game=function(){
  let html=gameBefore();const r=run(),source=STORIES[r.pending?.sourceSceneId||r.storyId],ch=CHAPTERS[r.currentChapter];if(!source||!ch||!html.includes('conversation-game'))return html;
  const entries=conversationEntries(source,r.pending),cursor=Math.max(1,Math.min(r.dialogueCursor||1,entries.length)),active=entries[cursor-1],ids=chapterScenes(ch.chapterId).map(scene=>scene.sceneId),at=Math.max(1,ids.indexOf(source.sceneId)+1),complete=cursor>=entries.length;
  const linked=source.questionSequenceMode==='queue'&&source.linkedQuestionIds?.length||source.quizId;
  const frame=complete&&linked?'S-08':isNarrative(active||{})?'S-06':active?.position==='right'||active?.speakerType==='player'?'S-07B':'S-07';
  const oldHeader=html.match(/<div class="game-header">[\s\S]*?<\/div>/)?.[0]||'';
  originalControls=(oldHeader.match(/<button[^>]*data-action="[^"]+"[^>]*>[\s\S]*?<\/button>/g)||[]).join('');
  const pct=ids.length?Math.round(at/ids.length*100):0;
  const top='<header class="r7-story-header"><button data-r7-story-exit aria-label="이야기 나가기">'+icon('story-back')+'</button><div><p>CH.'+String(ch.number).padStart(2,'0')+' '+esc(ch.title)+' · 장면 '+at+' / '+ids.length+'</p><div><i style="width:'+pct+'%"></i></div></div><button data-r7-story-menu aria-label="이야기 메뉴">'+icon('story-more')+'</button></header>';
  html=html.replace(oldHeader,top).replace('conversation-game','conversation-game r7-story-play'+(showLog?' r7-story-history':''));
  html=html.replace('data-illustration=','data-figma-frame="'+frame+'" data-illustration=');
  if(!html.includes('data-figma-frame='))html=html.replace('<section ','<section data-figma-frame="'+frame+'" ');
  const marker='data-dialogue-index="'+(cursor-1)+'"';
  if(html.includes(marker)){html=html.replaceAll(marker,marker+' data-r7-active="true"').replace('r7-story-play','r7-story-play r7-has-active');}
  if(complete&&linked)html=html.replace('<section class="conversation-panel','<div class="r7-story-question-notice">기출 연결 문제 · 이 장면에서 배운 내용을 기출로 확인해요</div><section class="conversation-panel');
  return '<div class="r7-story-stage" style="--r7-dialogue-size:'+(largeText?19:17)+'px">'+html+'</div>';
 };
 const quizBefore=quiz;
 quiz=function(){
  let html=quizBefore();if(quizMode!=='story')return html;
  const q=activeQuestion();if(!q)return html;const selected=run().questionAnswer,draft=quizDraft(),done=selected!==null;
  const frame=done?selected===q.answer?'S-11':'S-12':draft===null?'S-09':draft===q.answer?'S-10':'S-10B';
  html=html.replace('class="editorial-quiz','data-figma-frame="'+frame+'" class="editorial-quiz r7-page r7-story-question');
  const queue=run().questionQueue||[],questionIndex=run().questionQueueIndex||0,entry=globalThis.REV7_EXAM_VIEWS.entry(q.questionId),points=entry?.sourceRecord?.points;
  html=html.replace(/<header class="quiz-top">[\s\S]*?<\/header>/,'<header class="quiz-top r7-appbar"><button data-r7-story-exit aria-label="연결 문제 나가기">'+icon('back')+'</button><h1>이야기 속 문제 '+(questionIndex+1)+' / '+Math.max(1,queue.length)+'</h1><span></span></header>');
  html=html.replace(/<div class="quiz-progress">[\s\S]*?<\/small><\/div>/,'');
  if(isVerifiedOfficialQuestion(q))html=html.replace(/<div class="exam-source-row">[\s\S]*?<\/div>/,'<div class="r7-story-source"><span>연결 기출</span><p>제 '+q.examRound+'회 '+esc(q.examLevel)+' · '+q.questionNumber+'번'+(points?' · '+points+'점':'')+'</p></div>');
  html=html.replace('>Q. ','>');
  html=html.replace(/<\/section>$/,'<details class="r7-legacy"><summary>내 상태 보기</summary><button class="r7-secondary" data-action="status">내 상태 열기</button></details></section>');
  return html;
 };
 const modalBefore=modalHTML;
 modalHTML=function(){
  if(modal?.type==='r7-story-exit')return '<div data-figma-frame="S-14" class="modal-overlay r7-confirm-overlay"><section class="modal r7-confirm" role="dialog" aria-modal="true" aria-labelledby="r7-story-exit-title"><h2 id="r7-story-exit-title">여기서 나갈까요?</h2><p>지금까지 읽은 곳은 저장돼요. 나중에 이어 읽을 수 있어요.</p><div><button class="secondary" data-action="close">계속 읽기</button><button class="primary" data-r7-story-exit-confirm>나가기</button></div></section></div>';
  if(modal?.type==='r7-story-menu')return '<div data-figma-frame="S-16" class="modal-overlay chapter-sheet-overlay r7-chapter-overlay"><section class="modal chapter-sheet r7-player-menu" role="dialog" aria-modal="true" aria-labelledby="r7-story-menu-title"><div class="sheet-handle"></div><header><h2 id="r7-story-menu-title">메뉴</h2><button class="close" data-action="close" aria-label="메뉴 닫기">×</button></header><button data-r7-story-font><span>글자 크기</span><b>'+(largeText?'크게':'보통')+'</b></button><button data-action="restart-current" data-chapter="'+esc(run().currentChapter)+'">챕터 처음부터 보기</button><button data-nav="era">챕터 목록으로</button><button data-r7-story-log>'+(showLog?'현재 대사만 보기':'대화 기록 보기')+'</button>'+originalControls+'<button data-r7-story-exit>읽기 종료</button></section></div>';
  if(modal?.type==='r7-story-resume'){
   const e=eraInfo(modal.eraId),r=seasonRun(e),ch=CHAPTERS[r?.currentChapter],ids=ch?chapterScenes(ch.chapterId).map(scene=>scene.sceneId):[],index=ch?Math.max(1,ids.indexOf(r.storyId)+1):1;
   return '<div data-figma-frame="S-15" class="modal-overlay chapter-sheet-overlay r7-chapter-overlay"><section class="modal chapter-sheet r7-player-menu" role="dialog" aria-modal="true" aria-labelledby="r7-story-resume-title"><div class="sheet-handle"></div><header><h2 id="r7-story-resume-title">이어서 읽을까요?</h2><button class="close" data-action="close" aria-label="닫기">×</button></header><p>'+esc(ch?'CH.'+ch.number+' '+ch.title+' · 장면 '+index+'에서 멈췄어요.':e.title)+'</p><button class="primary full" data-r7-story-continue="'+e.id+'">장면 '+index+'부터 이어 읽기</button><button class="secondary full" data-r7-story-restart="'+e.id+'">챕터 처음부터 다시 읽기</button></section></div>';
  }
  let html=modalBefore();
  if(['restart-current','replay-confirm'].includes(modal?.type))html=html.replace('class="modal-overlay','class="modal-overlay r7-confirm-overlay');
  if(['official-image','exam-image'].includes(modal?.type))html=html.replace('class="modal-overlay','class="modal-overlay r7-image-overlay');
  return html;
 };
 const contentBefore=renderContent;
 renderContent=function(){
  const legacy=contentBefore();if(screen!=='complete')return legacy;
  const id=resultChapterId||run().currentChapter,ch=CHAPTERS[id];if(!ch)return legacy;
  const r=resultRun(id),score=questionScore(id,r.questionResults),order=eraChapters(chapterEra(id)),at=order.findIndex(c=>c.chapterId===id),next=order[at+1],footer=resultFooter(id),primaryFooter=footer.match(/<button class="primary[^"]*"[^>]*>[\s\S]*?<\/button>/)?.[0]||footer;
  return '<section class="r7-page r7-story-complete" data-figma-frame="S-13"><div class="r7-complete-mark">'+icon('check')+'</div><p class="r7-complete-chapter">CH.'+ch.number+' '+esc(ch.title)+'</p><h1>챕터를 마쳤어요</h1><p>이야기 속 연결 문제까지 모두 풀었어요</p><div class="r7-metrics r7-complete-metrics"><article><small>연결 문제</small><strong>'+score.correct+' / '+score.total+'</strong><p>정답</p></article><article><small>챕터 진행</small><strong>'+meta().completedChapters.filter(c=>chapterEra(c)===chapterEra(id)).length+' / '+order.length+'</strong><p>챕터</p></article><article><small>걸린 시간</small><strong>—</strong><p>기록 없음</p></article></div>'+(next?'<div class="r7-next-story"><small>다음 이야기</small><h2>CH.'+next.number+' '+esc(next.title)+'</h2></div>':'')+primaryFooter+(score.correct<score.total?'<button class="r7-secondary" data-action="review-wrong">틀린 문제 복습하기 ('+(score.total-score.correct)+')</button>':'')+'<details class="r7-legacy"><summary>기존 플레이 결과와 수집 기록</summary>'+legacy+'</details></section>';
 };
 document.addEventListener('click',function(event){
  const b=event.target.closest('button');if(!b)return;const d=b.dataset;
  if('r7StoryExit' in d){event.stopImmediatePropagation();modal={type:'r7-story-exit'};render();return;}
  if('r7StoryExitConfirm' in d){event.stopImmediatePropagation();save();navigate('era');return;}
  if('r7StoryMenu' in d){event.stopImmediatePropagation();modal={type:'r7-story-menu'};render();return;}
  if('r7StoryFont' in d){event.stopImmediatePropagation();largeText=!largeText;render();return;}
  if('r7StoryLog' in d){event.stopImmediatePropagation();showLog=!showLog;modal=null;render();return;}
  if(d.r7StoryResume){event.stopImmediatePropagation();const e=eraInfo(d.r7StoryResume);if(!seasonRun(e)?.started){resumeEra(e.id);return;}modal={type:'r7-story-resume',eraId:e.id};render();return;}
  if(d.r7StoryContinue){event.stopImmediatePropagation();modal=null;resumeEra(d.r7StoryContinue);return;}
  if(d.r7StoryRestart){event.stopImmediatePropagation();resumeEra(d.r7StoryRestart);modal={type:'restart-current',chapterId:run().currentChapter};render();return;}
 },true);
 const renderBefore=render;
 render=function(){renderBefore();document.body?.classList?.toggle('r7-story-active',screen==='game'||screen==='complete'||screen==='quiz'&&quizMode==='story');};
 render();
})();
