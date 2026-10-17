/* Confirmed Rev.7 O-02/03/04/06/08 only. O-05 and O-07 stay with their original renderers. */
(function(){
 'use strict';
 const views=globalThis.REV7_OX_VIEWS;if(!views)return;
 const icon=name=>'<span class="r7-icon" aria-hidden="true"><img alt="" src="media/rev7/'+name+'.svg"></span>';
 let resumeSheet=false,analysis=false;
 const homeBefore=views.home();
 views.setHome(function(){
  const session=views.active();
  let html=homeBefore().replaceAll('data-ox-resume="true"','data-r7-ox-open-resume');
  html=html.replace('<details class="r7-legacy">','<button class="r7-analysis-link" data-r7-ox-analysis>시대별 오답 비중 보기 '+icon('chevron')+'</button><details class="r7-legacy">');
  if(!resumeSheet||!session)return html;
  return html+'<div class="r7-page r7-filter-overlay"><button class="r7-scrim" data-r7-ox-sheet-close aria-label="이어하기 시트 닫기"></button><section class="r7-sheet r7-resume-sheet" role="dialog" aria-modal="true" aria-labelledby="r7-ox-resume-title"><div class="r7-handle"></div><h2 id="r7-ox-resume-title">퀴즈를 이어 풀까요?</h2><p>'+esc(session.eraId?views.era(session.eraId).shortName:'전체 시대')+' · '+(session.index+1)+'/'+session.questionIds.length+' 문제에서 멈췄어요.</p><button class="r7-primary" data-r7-ox-continue>이어 풀기</button><button class="r7-secondary" data-r7-ox-restart>새로 시작</button></section></div>';
 });
 views.setQuiz(function(){
  const session=views.active(),question=views.question();if(!session||!question)return views.home()();
  const answered=Object.hasOwn(session.answers,question.id),correct=session.results[question.id],era=views.era(question.eraId),percent=Math.round((session.index+(answered?1:0))/session.questionIds.length*100);
  const title=session.mode==='review'?'OX 오답 복습':session.eraId?era.shortName+' OX 퀴즈':'OX 퀴즈';
  return '<section class="r7-page r7-ox-play" data-figma-frame="'+(answered?correct?'O-03':'O-04':'O-02')+'"><header class="r7-quiz-head"><button data-ox-back="home" aria-label="OX 퀴즈 닫기">'+icon('close')+'</button><div><p><b>'+esc(title)+'</b><span>'+(session.index+1)+' / '+session.questionIds.length+'</span></p><div class="r7-quiz-progress" role="progressbar" aria-label="퀴즈 진행률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+percent+'"><i style="width:'+percent+'%"></i></div></div></header>'
   +'<article class="r7-ox-question"><div class="r7-ox-tags"><span>'+esc(era.shortName)+'</span><span>'+esc(answered?views.topicLabel(question):'한능검 심화 핵심 개념')+'</span></div><p>다음 설명이 맞으면 O, 틀리면 X</p><h1>'+esc(question.statement)+'</h1></article>'
   +(answered?'<section class="r7-ox-feedback '+(correct?'correct':'incorrect')+'" aria-live="polite"><strong>'+(correct?'정답입니다':'오답입니다 · 정답은 '+(question.answer?'O':'X'))+'</strong><p>'+esc(question.explanation)+'</p></section>':'')
   +'<footer class="r7-ox-answerbar">'+(answered?'<button class="r7-primary" data-ox-next="true">'+(session.index===session.questionIds.length-1?'결과 확인':'다음 문제')+'</button>':'<div class="r7-ox-choices"><button data-ox-answer="true"><b>O</b><span>맞아요</span></button><button data-ox-answer="false"><b>X</b><span>틀려요</span></button></div>')+'</footer></section>';
 });
 function analysisPage(){
  const distribution=views.distribution(),colors=['#e9513b','#169b8d','#e0a100','#7e8cd9','#4c9ad6','#849098','#5b6a75'];
  let start=0;const rows=distribution.rows.filter(row=>row.wrong>0),segments=rows.map((row,i)=>{const end=start+row.percentage;const segment=colors[i%colors.length]+' '+start+'% '+end+'%';start=end;return segment;});
  return '<section class="r7-page r7-ox-analysis" data-figma-frame="O-06"><header class="r7-appbar"><button data-r7-ox-analysis-back aria-label="OX 퀴즈로 돌아가기">'+icon('back')+'</button><h1>오답 분석</h1><span></span></header><h2>시대별 오답 비중</h2><div class="r7-analysis-donut" role="img" aria-label="고유 오답 '+distribution.total+'개" style="--r7-donut:'+(segments.length?'conic-gradient('+segments.join(',')+')':'var(--r7-line)')+'"><span>'+distribution.total+'<small>고유 오답</small></span></div>'
   +(rows.length?'<div class="r7-analysis-rows">'+rows.map((row,i)=>'<div><i style="background:'+colors[i%colors.length]+'"></i><b>'+esc(row.shortName||row.name)+'</b><span>'+row.percentage+'%</span></div>').join('')+'</div>':'<p class="r7-note">OX 퀴즈를 풀면 시대별 오답 비중을 확인할 수 있어요.</p>')+'<button class="r7-primary" data-r7-ox-wrongs>오답노트 보기</button></section>';
 }
 const contentBefore=renderContent;
 renderContent=function(){if(screen==='ox'&&analysis)return analysisPage();return contentBefore();};
 const applyBefore=views.applyRoute;
 views.setApplyRoute(function(route=views.readRoute()){
  // Use APP_ROUTE's live closure rather than the previous adapter's initial function.
  analysis=route==='ox/analysis';resumeSheet=false;
  if(analysis){screen='ox';modal=null;render();window.scrollTo(0,0);return route;}
  return applyBefore(route);
 });
 document.addEventListener('click',function(event){
  const button=event.target.closest('button');if(!button)return;const d=button.dataset;
  if(d.nav){analysis=false;resumeSheet=false;}
  if(d.oxAnswer!==undefined||d.oxNext){resumeSheet=false;analysis=false;return;}
  if('r7OxContinue' in d){event.stopImmediatePropagation();resumeSheet=false;views.resume();return;}
  if('r7OxOpenResume' in d){event.stopImmediatePropagation();resumeSheet=true;render();document.querySelector('.r7-resume-sheet button')?.focus();return;}
  if('r7OxSheetClose' in d){event.stopImmediatePropagation();resumeSheet=false;render();return;}
  if('r7OxRestart' in d){event.stopImmediatePropagation();const session=views.active();resumeSheet=false;if(session)OX_QUIZ_API.startSession(session.mode,session.eraId,{count:session.questionIds.length,questionIds:session.questionIds});return;}
  if('r7OxAnalysis' in d){event.stopImmediatePropagation();analysis=true;screen='ox';views.writeRoute('ox/analysis');render();window.scrollTo(0,0);return;}
  if('r7OxAnalysisBack' in d){event.stopImmediatePropagation();analysis=false;views.writeRoute('ox');render();return;}
  if('r7OxWrongs' in d){event.stopImmediatePropagation();analysis=false;wrongFilter='ox';studyTab='review';navigate('study');return;}
 },true);
 document.addEventListener('keydown',function(event){if(resumeSheet&&event.key==='Escape'){resumeSheet=false;render();}});
 const renderBefore=render;
 render=function(){analysis=screen==='ox'&&views.readRoute()==='ox/analysis';renderBefore();document.body?.classList?.toggle('r7-quiz-active',Boolean(document.querySelector('.r7-ox-play')));document.body?.classList?.toggle('r7-ox-sheet-locked',resumeSheet);};
 render();
})();
