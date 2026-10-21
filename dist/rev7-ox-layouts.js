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
 // OX 카드: 문제를 카드에 담아 오른쪽으로 밀면 O, 왼쪽으로 밀면 X. 버튼도 같은 data-ox-answer 경로를 써서 결과·오답 기록은 기존 기능이 처리한다.
 const oIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.5"/></svg>',xIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.5 6.5 11 11m0-11-11 11"/></svg>';
 views.setQuiz(function(){
  const session=views.active(),question=views.question();if(!session||!question)return views.home()();
  const answered=Object.hasOwn(session.answers,question.id),correct=session.results[question.id],era=views.era(question.eraId),total=session.questionIds.length,done=session.index+(answered?1:0),percent=Math.round(done/total*100);
  const results=Object.values(session.results),right=results.filter(Boolean).length,wrong=results.length-right,last=session.index===total-1;
  const title=session.mode==='review'?'OX 오답 복습':session.eraId?era.shortName+' OX 퀴즈':'OX 퀴즈';
  const picked=answered?session.answers[question.id]:null,answerMark=v=>v?'O':'X';
  const card=answered
   ?'<article class="r7-ox-card is-answered '+(correct?'is-correct':'is-wrong')+'" data-r7-ox-card data-answered="true" tabindex="-1" role="group" aria-label="답변과 해설" aria-live="polite"><div class="r7-ox-card-top r7-ox-tags"><span class="r7-ox-qno">Q'+(session.index+1)+'</span><span class="r7-ox-tag">'+esc(views.topicLabel(question))+'</span></div><div class="r7-ox-verdict r7-ox-feedback '+(correct?'correct':'incorrect')+'"><strong>'+(correct?'정답이에요':'오답이에요')+'</strong><span>정답 '+answerMark(question.answer)+' · 내 선택 '+answerMark(picked)+'</span></div><h1 class="r7-ox-statement">'+esc(question.statement)+'</h1><div class="r7-ox-explain"><small>해설</small><p>'+esc(question.explanation)+'</p></div></article>'
   :'<article class="r7-ox-card" data-r7-ox-card data-answered="false" tabindex="0" role="group" aria-label="OX 문제 카드. 왼쪽은 X, 오른쪽은 O" aria-keyshortcuts="ArrowLeft ArrowRight X O"><span class="r7-ox-stamp is-o" aria-hidden="true">O 맞아요</span><span class="r7-ox-stamp is-x" aria-hidden="true">X 틀려요</span><div class="r7-ox-card-top r7-ox-tags"><span class="r7-ox-qno">Q'+(session.index+1)+'</span><span class="r7-ox-tag">'+esc(era.shortName)+'</span></div><h1 class="r7-ox-statement">'+esc(question.statement)+'</h1><p class="r7-ox-hint">맞으면 오른쪽, 틀리면 왼쪽으로 밀어요</p></article>';
  return '<section class="r7-page r7-ox-play r7-ox-swipe" data-figma-frame="'+(answered?correct?'O-03':'O-04':'O-02')+'"><header class="r7-quiz-head"><button data-ox-back="home" aria-label="OX 퀴즈 닫기">'+icon('close')+'</button><div><p><b>'+esc(title)+'</b><span class="r7-ox-count"><em>'+(session.index+1)+'</em> / '+total+'</span></p><div class="r7-quiz-progress" role="progressbar" aria-label="퀴즈 진행률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+percent+'"><i style="width:'+percent+'%"></i></div></div></header>'
   +'<div class="r7-ox-tally" aria-label="정답 '+right+'개, 오답 '+wrong+'개"><span class="is-right">'+oIcon+'정답 <b>'+right+'</b></span><span class="is-wrong">'+xIcon+'오답 <b>'+wrong+'</b></span><span class="r7-ox-left">남은 문제 '+(total-done)+'</span></div>'
   +'<div class="r7-ox-deck"><div class="r7-ox-stack'+(answered?' is-answered':'')+'"><div class="r7-ox-card-back" aria-hidden="true"></div>'+card+'</div></div>'
   +'<footer class="r7-ox-answerbar">'+(answered?'<button class="r7-primary" data-ox-next="true">'+(last?'결과 확인':'다음 문제')+'</button>':'<div class="r7-ox-choices"><button class="r7-ox-x" data-ox-answer="false" aria-label="X, 틀려요">'+xIcon+'<span>틀려요</span></button><button class="r7-ox-o" data-ox-answer="true" aria-label="O, 맞아요"><span>맞아요</span>'+oIcon+'</button></div>')+'</footer></section>';
 });
 // 스와이프: 답변 전 카드의 가로 이동만 반영한다. 해설 화면은 명시적인 다음 버튼으로만 진행한다.
 let drag=null;
 const reduced=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 function setCard(card,dx){card.style.transform='translateX('+dx.toFixed(1)+'px) rotate('+(dx*.05).toFixed(2)+'deg)';const k=Math.min(1,Math.abs(dx)/90);card.style.setProperty('--r7-ox-o',dx>0?k:0);card.style.setProperty('--r7-ox-x',dx<0?k:0);}
 function resetCard(card){if(!card)return;card.classList.remove('is-dragging');card.style.transform='';card.style.removeProperty('--r7-ox-o');card.style.removeProperty('--r7-ox-x');}
 function commit(card,dx){
  if(card.dataset.answered==='true'){resetCard(card);return;}
  const target=document.querySelector('[data-ox-answer="'+(dx>0)+'"]');if(!target){resetCard(card);return;}
  if(reduced()||!card.animate){target.click();return;}
  card.classList.remove('is-dragging');const out=Math.sign(dx)*(innerWidth+80);
  card.animate([{transform:card.style.transform||'none'},{transform:'translateX('+out+'px) rotate('+(Math.sign(dx)*14)+'deg)'}],{duration:180,easing:'ease-in',fill:'forwards'}).onfinish=()=>target.click();
 }
 document.addEventListener('pointerdown',event=>{
  const card=event.target.closest?.('[data-r7-ox-card]');if(!card||card.dataset.answered==='true'||event.button>0||event.clientX<=24||event.clientX>=innerWidth-24||event.target.closest('a,button'))return;
  drag={card,id:event.pointerId,x:event.clientX,y:event.clientY,axis:null,dx:0};
 });
 document.addEventListener('pointermove',event=>{
  if(!drag||event.pointerId!==drag.id)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
  if(!drag.axis&&Math.max(Math.abs(dx),Math.abs(dy))>8){drag.axis=Math.abs(dx)>Math.abs(dy)*1.2?'x':'y';if(drag.axis==='x'){drag.card.classList.add('is-dragging');try{drag.card.setPointerCapture(event.pointerId)}catch{}}}
  if(drag.axis!=='x')return;drag.dx=dx;setCard(drag.card,dx);
 });
 const endDrag=event=>{
  if(!drag||event.pointerId!==drag.id)return;const {card,axis,dx}=drag;drag=null;
  if(axis!=='x')return;const threshold=Math.max(64,Math.min(96,card.getBoundingClientRect().width*.22));if(event.type==='pointerup'&&Math.abs(dx)>=threshold){commit(card,dx);return;}
  if(card.animate&&!reduced())card.animate([{transform:card.style.transform||'none'},{transform:'none'}],{duration:160,easing:'ease-out'});resetCard(card);
 };
 document.addEventListener('pointerup',endDrag);document.addEventListener('pointercancel',endDrag);
 document.addEventListener('keydown',event=>{
  const card=document.querySelector('.r7-ox-swipe [data-r7-ox-card]');
  if(!card||card.dataset.answered==='true'||event.target!==card||event.repeat||event.altKey||event.ctrlKey||event.metaKey)return;
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();commit(card,event.key==='ArrowRight'?1:-1);}
  else if(event.key==='o'||event.key==='O'){event.preventDefault();document.querySelector('[data-ox-answer="true"]')?.click();}
  else if(event.key==='x'||event.key==='X'){event.preventDefault();document.querySelector('[data-ox-answer="false"]')?.click();}
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
