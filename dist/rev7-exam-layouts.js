/* Rev.7 exam views use the existing canonical summary, certification and timer APIs. */
(function(){
 'use strict';
 const views=globalThis.REV7_EXAM_VIEWS;if(!views||!globalThis.REV7_OX_VIEWS)return;
 const icon=name=>'<span class="r7-icon" aria-hidden="true"><img src="media/rev7/'+name+'.svg" alt=""></span>';
 let level='all',resultTab='summary',lastResult=null,trend=null,gradingPending=false,lastView=null,cumulativeEra=null;
 const expiredSeen=new Set();
 const examLabel=s=>s.examRound?'제 '+s.examRound+'회 '+s.examLevel:views.eraInfo(s.examEra).name+' · '+s.examLevel;
 const tabs=active=>'<div class="r7-tabs" role="tablist" aria-label="기출문제 보기 방식"><button data-official-tab="round" aria-selected="'+(active==='round')+'">회차별</button><button data-official-tab="era" aria-selected="'+(active==='era')+'">시대별</button><button data-official-results-list="true" aria-selected="'+(active==='history')+'">기록</button></div>';
 const chips=()=>'<div class="r7-chips r7-exam-levels" aria-label="시험 유형">'+[['all','전체'],['기본','기본'],['심화','심화']].map(([id,label])=>'<button data-r7-exam-level="'+id+'" aria-pressed="'+(level===id)+'">'+label+'</button>').join('')+'</div>';
 const heading=()=>'<header class="r7-heading"><h1>기출문제</h1></header>';
 views.setHome(function(){
  const state=views.state(),active=meta().officialExamActiveSession;
  if(state.tab==='era'){
   const analysis=views.analysis(null,'cumulative'),policy=globalThis.OFFICIAL_LEARNING_ANALYSIS.policy;
   if(cumulativeEra){const row=analysis.rows.find(r=>r.id===cumulativeEra),entries=views.catalog.filter(e=>e.analysisEra===cumulativeEra&&typeof views.record(e.canonicalQuestionId).lastCorrect==='boolean');return '<section class="r7-page" data-figma-frame="E-12"><header class="r7-appbar"><button data-r7-cumulative-back aria-label="시대별 취약점으로">'+icon('back')+'</button><h1>'+esc(row?.name||'시대별 기록')+'</h1><span></span></header><h2>푼 문항 '+entries.length+'개</h2><div class="r7-result-map">'+entries.map(e=>'<button class="'+(views.record(e.canonicalQuestionId).lastCorrect?'correct':'wrong')+'" data-r7-cumulative-detail="'+e.canonicalQuestionId+'" aria-label="'+esc(e.sourceRecord.examRound+'회 '+e.sourceRecord.questionNumber+'번 해설')+'">'+e.sourceRecord.questionNumber+'</button>').join('')+'</div></section>';}
   return '<section class="r7-page r7-exam-home" data-figma-frame="E-22">'+heading()+tabs('era')+'<p class="r7-note">문항별 최근 제출 답안 기준 정답률이에요. 표본이 적은 시대는 참고용으로 봐 주세요.</p><div class="r7-cumulative-eras">'+analysis.rows.map(row=>{const tag=!row.total?'학습 전':row.total<policy.minimumUniqueQuestions?'표본 부족':row.accuracy<policy.targetAccuracy?'집중 복습':'학습 중';return '<button data-r7-cumulative-era="'+row.id+'" '+(row.total?'':'disabled')+'><span><b>'+esc(row.name)+'</b><em>'+tag+'</em><strong>'+(row.accuracy===null?'기록 없음':row.accuracy+'%')+'</strong></span><span class="r7-cumulative-track"><i style="width:'+(row.accuracy||0)+'%"></i></span></button>';}).join('')+'</div><p class="r7-note">고유 '+policy.minimumUniqueQuestions+'문항 이상·최근 정답률 '+policy.targetAccuracy+'% 미만이면 집중 복습으로 표시해요.</p><details class="r7-legacy"><summary>누적 오답 횟수와 기존 시대별 학습</summary>'+views.weakness()+views.eras.map(e=>'<button class="r7-secondary" data-official-era="'+e.id+'">'+esc(e.name)+'</button>').join('')+'</details></section>';
  }
  const rows=views.editions(level).map(entries=>{
   const source=entries[0].sourceRecord,activity=views.editionActivity(entries),summary=activity.summary;
   const cert=summary?views.certification(summary,source.examLevel,true):null;
   const status=activity.activeForEdition?'풀이 중':activity.latest?summary?.score+'점'+(cert?.grade?' · '+cert.grade+'급':''):'시작 전';
   return '<button class="r7-exam-row" data-r7-exam-round="'+source.examRound+'" data-r7-exam-level-value="'+source.examLevel+'"><span class="r7-exam-round">'+source.examRound+'<small>회</small></span><span class="r7-exam-name"><b>한국사능력검정시험</b><small>'+source.examLevel+' · '+entries.length+'문항 · 80분</small>'+views.statistic(source,'card')+'</span><em class="'+(activity.latest?'complete':'')+'">'+esc(status)+'</em>'+icon('chevron')+'</button>';
  }).join('');
  return '<section class="r7-page r7-exam-home" data-figma-frame="E-01">'+heading()+tabs('round')+(active?'<button class="r7-resume" data-r7-exam-open><span><small>풀던 시험 이어 풀기</small><b>'+esc(examLabel(active))+' · '+Object.keys(active.answers||{}).length+'/'+active.questionIds.length+'문항</b></span>'+icon('chevron')+'</button>':'')+'<div class="r7-exam-filter">'+chips()+'<small>최신 회차순</small></div>'+rows+'<details class="r7-legacy"><summary>누적 취약점 보기</summary>'+views.weakness()+'</details></section>';
 });
 views.setCover(function(){
  const cover=views.state().cover;if(!cover)return views.home()();
  const {entries,options,token}=cover,count=options.examTab==='era'?Math.min(20,entries.length):entries.length,active=views.coverActive(),cert=views.certification({score:0,maxScore:100},options.examLevel,true);
  const stat=(name,value,unit)=>'<div><small>'+name+'</small><strong>'+value+'<em>'+unit+'</em></strong></div>';
  return '<section class="r7-page r7-exam-cover" data-figma-frame="E-02"><header class="r7-appbar"><button data-official-cover-back="true" aria-label="시험 목록으로">'+icon('back')+'</button><h1>시험 안내</h1><span></span></header><article class="r7-cover-title"><p><span>'+esc(options.examLevel==='all'?'전체 유형':options.examLevel)+'</span> 한국사능력검정시험</p><h2>'+(options.examTab==='round'?'제 '+options.examRound+'회':esc(views.eraInfo(options.examEra).name))+'</h2></article><div class="r7-metrics r7-cover-facts">'+stat('문항 수',count,'문항')+stat('제한 시간',options.timed?80:'—','분')+stat('선택지',5,'지선다')+'</div><section class="r7-pass-criteria"><h2>합격 기준 ('+esc(options.examLevel)+')</h2>'+cert.criteria.split(' · ').map(item=>'<p>'+esc(item)+'</p>').join('')+'</section><p class="r7-note">공식 합격률은 발표 자료가 확인된 회차만 보여줘요.</p><section class="r7-cover-guide"><h2>시작하기 전에</h2><ul><li>문제는 실제 기출 원문 이미지로 보여줘요.</li><li>답안은 자동 저장돼서 나가도 이어 풀 수 있어요.</li><li>시험 중 정답과 해설은 표시되지 않아요.</li>'+(options.timed?'<li>시간이 끝나면 자동 제출돼요.</li>':'')+'</ul></section><div class="r7-cover-start">'+(active?'<p>진행 중인 시험이 있습니다.</p><button class="r7-primary" data-official-cover-resume="'+token+'">이어하기</button><button class="r7-secondary" data-official-cover-new="'+token+'">새로 시작하기</button>':'<button class="r7-primary" data-official-cover-start="'+token+'">시험 시작</button>')+'</div></section>';
 });
 const practiceBefore=views.practice();
 views.setPractice(function(){
  let html=practiceBefore();const session=views.state().session;if(!session)return html;
  if(session.mode==='exam'&&OFFICIAL_EXAM_TIMER.snapshot()?.timerState==='PAUSED'){
   const answered=Object.values(session.answers).filter(Number.isInteger).length;
   return '<section class="r7-page r7-exam-paused" data-figma-frame="E-08"><h1>시험이 중지되었어요</h1><p class="sr-only" role="status">시험이 일시정지되었습니다.</p><p>남은 시간</p><strong>'+esc(OFFICIAL_EXAM_TIMER.snapshot().remainingMs==null?'—':views.formatTimer(OFFICIAL_EXAM_TIMER.snapshot().remainingMs))+'</strong><div class="r7-tiles"><article class="r7-tile"><small>푼 문제</small><strong>'+answered+' / '+session.entries.length+'</strong></article><article class="r7-tile"><small>미응답</small><strong>'+(session.entries.length-answered)+'문항</strong></article></div><button class="r7-primary" data-official-timer-start="true">이어서 풀기</button><button class="r7-secondary" data-r7-exam-save-exit>나가기 (진행 상황 저장)</button></section>';
  }
  if(session.mode==='exam'){
   const time=views.timerMarkup(session).replace('남은 시간 ','<span class="sr-only">남은 시간 </span>'+icon('exam-clock')).replace('>일시정지</button>','>'+icon('exam-pause')+' 일시정지</button>');
   const top='<header class="r7-exam-head"><button data-r7-exam-pause-exit aria-label="시험 중지">'+icon('exam-close')+'</button>'+time+'<button data-official-question-list="true">'+icon('exam-list')+' 문제 목록</button></header><div class="r7-exam-progress"><span>'+(session.index+1)+' / '+session.entries.length+'</span><div><i style="width:'+((session.index+1)/session.entries.length*100)+'%"></i></div></div>';
   html=html.replace(/<header class="official-exam-intro"[\s\S]*?<\/header>/,top).replace('class="official-practice ','data-figma-frame="'+(session.timed&&OFFICIAL_EXAM_TIMER.remainingMs()<=300000?'E-20':'E-03')+'" class="official-practice r7-exam-practice ');
   const previous='<button class="secondary" data-official-previous="true" '+(session.index===0?'disabled':'')+'>이전</button>',next=session.index<session.entries.length-1?'<button class="primary" data-official-forward="true">다음</button>':'<button class="primary" data-official-request-submit="true">답안 제출</button>';
   html=html.replace(/<div class="official-exam-bottom-actions">[\s\S]*?<\/div>/,'<div class="official-exam-bottom-actions">'+previous+next+'</div>');
  }else if(session.scope==='wrong-only'){
   const current=session.entries[session.index],done=Object.hasOwn(session.feedback,current.canonicalQuestionId),right=session.feedback[current.canonicalQuestionId];
   html=html.replace('class="official-practice ','data-figma-frame="'+(done?right?'W-05':'W-06':'W-04')+'" class="official-practice r7-page r7-wrong-practice ')
    .replace(/<header class="official-subhead">[\s\S]*?<\/header>/,'<header class="r7-appbar"><button data-r7-review-stop aria-label="복습 중단">'+icon('close')+'</button><h1>오답 복습 '+(session.index+1)+' / '+session.entries.length+'</h1><span></span></header>');
  }
  return html;
 });
 const reviewBefore=views.review();
 views.setReview(function(){
  const s=views.state().session,entry=s?.entries.find(e=>e.canonicalQuestionId===s.reviewQuestionId);if(!entry)return reviewBefore();
  const q=views.question(entry.canonicalQuestionId),snapshot=views.storedResult(s,entry.canonicalQuestionId),selected=snapshot?snapshot.selectedAnswer:s.answers[entry.canonicalQuestionId],right=snapshot?snapshot.right:Boolean(s.graded?.[entry.canonicalQuestionId]),index=s.entries.indexOf(entry),number=entry.sourceRecord?.questionNumber||index+1;
  const label=Number.isInteger(selected)?['①','②','③','④','⑤'][selected]||String(selected+1):'미응답',answer=snapshot?.answerLabel||views.answerLabel(q),original=reviewBefore(),navigation=original.match(/<nav class="official-review-actions"[\s\S]*?<\/nav>/)?.[0]||'';
  return '<section class="official-review r7-page r7-exam-review" data-figma-frame="E-13" data-official-review-surface="true" aria-label="문제 해설 슬라이드"><header class="r7-appbar"><button data-official-review-back="true" aria-label="결과 화면으로 닫기">'+icon('back')+'</button><h1>'+number+'번 해설</h1><span></span></header><div class="r7-review-banner '+(right?'correct':'wrong')+'" role="status">내 답 '+esc(label)+' · 정답 '+esc(answer)+'</div><div class="official-review-paper">'+views.paper(entry)+'</div><section class="r7-review-choices" aria-label="선지별 해설">'+views.choiceExplanations(q,selected)+'</section><section class="r7-review-core" aria-label="문제 해설"><h2>[문제 핵심 해설]</h2><p>'+esc(views.visibleExplanation(q))+'</p></section><details class="r7-legacy"><summary>기존 답안 분석과 암기법</summary>'+original.replace(/<section /,'<div ').replace(/<\/section>$/,'</div>')+'</details>'+navigation+'</section>';
 });
 const resultBefore=views.result();
 views.setResult(function(){
  const s=views.state().session;if(!s)return resultBefore();
  if(gradingPending)return '<section class="r7-page r7-grading" data-figma-frame="E-09" role="status" aria-live="polite"><span class="r7-grading-ring">'+icon('story-loading')+'</span><h1>채점하고 있어요</h1><p>시대별 분석도 함께 만들고 있어요</p></section>';
  const summary=views.summary(s.resultRecord,s.entries,s.graded||{},s.answers),key=s.attemptId||s.entries.map(e=>e.canonicalQuestionId).join(',');
  if(lastResult!==key){lastResult=key;resultTab='summary';}
  const wrong=s.entries.filter(e=>s.graded?.[e.canonicalQuestionId]===false),analysis=views.analysis(s),cert=views.certification(summary,s.examLevel,s.mode==='exam'&&s.examTab==='round');
  const earlier=s.resultRecord?views.results().filter(r=>r.attemptId!==s.resultRecord.attemptId&&r.examRound===s.examRound&&r.examLevel===s.examLevel&&r.completedAt<s.resultRecord.completedAt).sort((a,b)=>b.completedAt.localeCompare(a.completedAt))[0]:null;
  const previousScore=earlier?views.summary(earlier,earlier.questionIds.map(views.entry).filter(Boolean),earlier.graded||{},earlier.answers||{}).score:null;
  const scoreDelta=previousScore==null||summary.score==null?null:summary.score-previousScore;
  const passLine=cert.eligible&&summary.score!=null?'<section class="r7-pass-line"><div><span>최저 합격선 60점</span><b>합격선보다 '+(summary.score>=60?'+':'')+(summary.score-60)+'점</b></div><div class="r7-pass-track"><i style="width:'+Math.min(100,summary.score)+'%"></i><span></span></div>'+(scoreDelta==null?'':'<p>지난 풀이 '+previousScore+'점보다 '+(scoreDelta>0?scoreDelta+'점 올랐어요':scoreDelta<0?Math.abs(scoreDelta)+'점 낮아졌어요':'같은 점수예요')+'</p>')+'</section>':'';
  const resultTabs='<div class="r7-tabs" role="tablist" aria-label="결과 분석">'+[['summary','요약'],['era','시대별'],['questions','문항별']].map(([id,label])=>'<button data-r7-result-tab="'+id+'" aria-selected="'+(resultTab===id)+'">'+label+'</button>').join('')+'</div>';
  let body='';
  if(resultTab==='questions')body='<div class="r7-result-map">'+s.entries.map((entry,i)=>'<button data-official-review="'+entry.canonicalQuestionId+'" class="'+(s.graded?.[entry.canonicalQuestionId]?'correct':'wrong')+'" aria-label="'+(i+1)+'번 '+(s.graded?.[entry.canonicalQuestionId]?'정답':'오답')+' 해설">'+(i+1)+'</button>').join('')+'</div><p class="r7-note">초록 정답 · 빨강 오답 · 번호를 누르면 해설을 봐요</p>';
  else if(resultTab==='era')body='<section class="r7-era-analysis"><h2>시대별 정답률</h2>'+analysis.rows.map(row=>'<button data-r7-result-era-review="'+row.id+'"><span><b>'+esc(row.name)+'</b><small>'+row.correct+'/'+row.total+'</small></span><span class="r7-analysis-track"><i style="width:'+(row.accuracy||0)+'%"></i></span><strong>'+(row.accuracy==null?'—':row.accuracy+'%')+'</strong></button>').join('')+'<p class="r7-note">시대 구분은 기출 데이터 분류 기준이에요.</p></section>';
  else body='<section class="r7-result-score"><p>'+esc(s.examRound?'제 '+s.examRound+'회 한국사능력검정시험 · '+s.examLevel:'기출 학습 결과')+'</p><strong>'+(summary.score==null?'—':summary.score)+'<small>점</small></strong><span class="'+(cert.passed?'pass':'fail')+'">'+esc(cert.eligible?cert.label:'학습 완료')+'</span><p>정답 '+summary.correct+' · 오답 '+(summary.total-summary.correct)+' · 미응답 '+summary.unanswered+'</p></section>'+passLine+'<div class="r7-result-facts"><div><small>푼 시간</small><b>'+esc(s.resultRecord?views.duration(s.resultRecord.elapsedMs):'기록 없음')+'</b></div><div><small>제한 시간</small><b>'+(s.timed?'80분':'없음')+'</b></div><div><small>안 푼 문제</small><b>'+summary.unanswered+'개</b></div></div>'+(analysis.top3.length?'<section class="r7-result-weak"><h2>이번에 보완할 시대</h2>'+analysis.top3.map(row=>'<div><b>'+esc(row.name)+'</b><small>'+esc(row.status.label)+'</small><strong>'+row.accuracy+'%</strong><span class="r7-weak-track"><i style="width:'+row.accuracy+'%"></i></span></div>').join('')+'</section>':'');
  const actions='<div class="r7-result-actions"><button class="r7-primary" data-official-retry="true" '+(wrong.length&&views.canRetry()?'':'disabled')+'>틀린 문제 복습하기 ('+wrong.length+')</button><div><button class="r7-secondary" data-r7-result-tab="questions">문항별 해설</button><button class="r7-secondary" data-r7-exam-retry-sheet '+(views.canRetry()?'':'disabled')+'>다시 풀기</button></div></div>';
  const timeout=s.submissionReason==='TIME_EXPIRED'&&!expiredSeen.has(key)?'<div data-figma-frame="E-07" class="modal-overlay r7-confirm-overlay"><section class="modal" role="dialog" aria-modal="true"><h2>시간이 종료됐어요</h2><p>답안이 자동 제출되었어요. 채점 결과를 확인해 주세요.</p><button class="primary" data-r7-timeout-confirm="'+esc(key)+'">결과 보기</button></section></div>':'';
  if(s.scope==='wrong-only'&&s.mode==='learn')return '<section class="r7-page r7-review-result" data-figma-frame="W-07"><header class="r7-appbar"><button data-nav="study" aria-label="오답노트로">'+icon('back')+'</button><h1>복습 결과</h1><span></span></header><h2>오답 복습 완료</h2><div class="r7-result-score"><strong>'+summary.correct+'<small> / '+summary.total+'개 맞힘</small></strong><p>'+summary.correct+'개를 새로 맞혔어요. 아직 헷갈리는 '+wrong.length+'개는 오답노트에 남겨 둘게요.</p></div>'+actions+'<button class="r7-secondary" data-nav="study">오답노트로</button></section>';
  return '<section class="r7-page r7-exam-result" data-figma-frame="'+(resultTab==='era'?'E-11':resultTab==='questions'?'E-12':'E-10')+'"><header class="r7-appbar"><button data-official-result-home="true" aria-label="기출문제 메인으로">'+icon('back')+'</button><h1>채점 결과</h1><button data-official-results-list="true" aria-label="시험 기록">···</button></header>'+resultTabs+body+actions+'<details class="r7-legacy"><summary>상세 결과와 기존 분석</summary>'+resultBefore()+'</details>'+timeout+'</section>';
 });
  views.setHistory(function(){
  const results=views.results().filter(r=>level==='all'||r.examLevel===level);
  if(trend){
   const rows=results.filter(r=>r.examRound===trend.round&&r.examLevel===trend.level).slice().reverse();
   const scores=rows.map(r=>views.summary(r,r.questionIds.map(views.entry).filter(Boolean),r.graded||{},r.answers||{}).score||0),max=Math.max(100,...scores);
   return '<section class="r7-page r7-exam-trend" data-figma-frame="E-16"><header class="r7-appbar"><button data-r7-trend-back aria-label="기록 목록으로">'+icon('back')+'</button><h1>제 '+trend.round+'회 '+esc(trend.level)+'</h1><span></span></header><h2>응시 점수 추이</h2><div class="r7-trend-bars">'+scores.map((score,i)=>'<div><b>'+score+'</b><i style="height:'+Math.max(2,score/max*100)+'px"></i><small>'+(i+1)+'회</small></div>').join('')+'</div>'+rows.map((r,i)=>'<button class="r7-history-row" aria-label="결과지 보기" data-official-result-open="'+esc(r.attemptId)+'"><span><b>'+(i+1)+'회차 · '+scores[i]+'점</b><small>'+esc(views.date(r.completedAt))+' · '+esc(views.duration(r.elapsedMs))+'</small></span>'+icon('chevron')+'</button>').join('')+'<button class="r7-primary" data-r7-exam-round="'+trend.round+'" data-r7-exam-level-value="'+trend.level+'">이 회차 다시 풀기</button></section>';
  }
  return '<section class="r7-page r7-exam-history" aria-label="시험 기록" data-figma-frame="'+(results.length?'E-15':'E-17')+'">'+heading()+tabs('history')+chips()+(results.length?results.map(r=>{const entries=r.questionIds.map(views.entry).filter(Boolean),summary=views.summary(r,entries,r.graded||{},r.answers||{}),cert=views.certification(summary,r.examLevel,true);return '<article class="r7-history-item"><button class="r7-history-row" aria-label="결과지 보기" data-official-result-open="'+esc(r.attemptId)+'"><span class="r7-history-score">'+(summary.score==null?'—':summary.score)+'<small>점</small></span><span><b>'+esc(examLabel(r))+'</b><small>'+esc(views.date(r.completedAt))+' · 정답 '+summary.correct+'/'+summary.total+'</small></span><em>'+esc(cert.label)+'</em>'+icon('chevron')+'</button><button class="r7-trend-link" data-r7-exam-trend="'+r.examRound+'" data-r7-exam-level-value="'+r.examLevel+'">이 회차 점수 추이</button></article>'}).join(''):'<div class="r7-empty"><h2>아직 푼 시험이 없어요</h2><p>회차를 골라 한 번 풀면 점수와 시대별 분석이 여기에 쌓여요.</p><button class="r7-primary" data-official-results-back="true">기출문제 풀러 가기</button></div>')+'</section>';
 });
 const modalBefore=modalHTML;
 modalHTML=function(){
  const s=views.state().session,active=meta().officialExamActiveSession;
  if(modal?.type==='r7-exam-resume'&&active)return '<div data-figma-frame="E-19" class="modal-overlay chapter-sheet-overlay r7-chapter-overlay"><section class="modal chapter-sheet r7-player-menu" role="dialog" aria-modal="true"><div class="sheet-handle"></div><h2>풀던 시험이 있어요</h2><p>'+esc(examLabel(active))+' · '+Object.keys(active.answers||{}).length+'/'+active.questionIds.length+'문항</p><button class="primary full" data-r7-exam-continue>이어 풀기</button><button class="secondary full" data-r7-exam-replace>처음부터 새로 풀기</button><button class="r7-secondary" data-action="close">취소</button></section></div>';
  if(modal?.type==='r7-exam-retry'&&s)return '<div data-figma-frame="E-14" class="modal-overlay chapter-sheet-overlay r7-chapter-overlay"><section class="modal chapter-sheet r7-player-menu" role="dialog" aria-modal="true"><div class="sheet-handle"></div><h2>어떻게 다시 풀까요?</h2><button data-official-retry="true">틀린 문제만 다시 풀기</button><button data-official-retake="true">전체 다시 풀기</button><button class="r7-secondary" data-action="close">취소</button></section></div>';
  if(modal?.type==='r7-exam-exit')return '<div class="modal-overlay r7-confirm-overlay"><section class="modal" role="dialog" aria-modal="true"><h2>시험을 멈출까요?</h2><p>지금까지 푼 답안은 저장돼요.</p><button class="secondary" data-action="close">계속 풀기</button><button class="primary" data-r7-exam-save-exit>나가기</button></section></div>';
  if(modal?.type==='r7-review-stop')return '<div data-figma-frame="W-10" class="modal-overlay r7-confirm-overlay"><section class="modal" role="dialog" aria-modal="true"><h2>복습을 멈출까요?</h2><p>지금까지 푼 문제의 기록은 저장돼요.</p><div><button class="secondary" data-action="close">계속 풀기</button><button class="primary" data-nav="study">나가기</button></div></section></div>';
  let html=modalBefore();if(modal?.type==='official-question-sheet'){html=html.replace('class="modal-overlay official-question-sheet-overlay"','data-figma-frame="E-04" class="modal-overlay official-question-sheet-overlay r7-question-sheet-overlay"').replace('<small>QUESTION MAP</small>','').replace(/<div class="official-question-sheet-tools">([\s\S]*?)<\/div>/,'<details class="r7-sheet-tools"><summary>시험 관리</summary>$1</details>');html=html.replace('</section></div>','<button class="r7-primary" data-official-request-submit="true">답안 제출하기</button></section></div>');}
  if(modal?.type==='official-submit-confirm')html=html.replace('class="modal-overlay','class="modal-overlay r7-confirm-overlay');
  return html;
 };
 document.addEventListener('click',function(event){
  const b=event.target.closest('button');if(!b)return;const d=b.dataset;
  const handled=()=>event.stopImmediatePropagation();
  if(d.r7CumulativeEra){handled();cumulativeEra=d.r7CumulativeEra;render();return;}
  if('r7CumulativeBack' in d){handled();cumulativeEra=null;render();return;}
  if(d.r7CumulativeDetail){handled();const route='study/question/'+encodeURIComponent(d.r7CumulativeDetail);globalThis.REV7_OX_VIEWS.addRoute(route);globalThis.REV7_OX_VIEWS.applyRoute(route);globalThis.REV7_OX_VIEWS.writeRoute(route);return;}
  if(d.r7ExamLevel){handled();level=d.r7ExamLevel;render();return;}
  if(d.r7ExamRound){handled();trend=null;views.openCover(views.entriesForRound(Number(d.r7ExamRound),d.r7ExamLevelValue),{examTab:'round',examRound:Number(d.r7ExamRound),examLevel:d.r7ExamLevelValue,timed:true});return;}
  if('r7ExamOpen' in d){handled();modal={type:'r7-exam-resume'};render();return;}
  if('r7ExamContinue' in d){handled();modal=null;views.resume();return;}
  if('r7ExamReplace' in d&&activeSession()){handled();const a=activeSession();modal=null;views.openCover(views.entriesForRound(a.examRound,a.examLevel),{examTab:'round',examRound:a.examRound,examLevel:a.examLevel,timed:true});return;}
  if('r7ExamPauseExit' in d){handled();if(views.state().session?.timed)views.pause();else{modal={type:'r7-exam-exit'};render();}return;}
  if('r7ExamSaveExit' in d){handled();views.leaveToHome();return;}
  if(d.r7ResultEraReview){handled();if(!views.canRetry())return;const s=views.state().session,row=views.analysis(s).rows.find(row=>row.id===d.r7ResultEraReview),entries=(row?.wrongEntries||[]).map(item=>item.entry);if(entries.length)views.start(entries,'learn',{scope:'wrong-only'});return;}
  if(d.r7ResultTab){handled();resultTab=d.r7ResultTab;render();return;}
  if('r7ExamRetrySheet' in d){handled();if(!views.canRetry())return;modal={type:'r7-exam-retry'};render();return;}
  if(d.r7TimeoutConfirm){handled();expiredSeen.add(d.r7TimeoutConfirm);render();return;}
  if('r7ReviewStop' in d){handled();modal={type:'r7-review-stop'};render();return;}
  if(d.r7ExamTrend){handled();trend={round:Number(d.r7ExamTrend),level:d.r7ExamLevelValue};render();return;}
  if('r7TrendBack' in d){handled();trend=null;render();return;}
 },true);
 function activeSession(){return meta().officialExamActiveSession;}
 const renderBefore=render;
 render=function(){const before=views.state();if(lastView==='practice'&&before.view==='result'&&typeof requestAnimationFrame==='function'){gradingPending=true;requestAnimationFrame(()=>requestAnimationFrame(()=>{gradingPending=false;render();}));}lastView=before.view;renderBefore();const state=views.state();document.body?.classList?.toggle('r7-exam-active',screen==='exam-library'&&['cover','practice','review','result'].includes(state.view));};
 render();
})();
