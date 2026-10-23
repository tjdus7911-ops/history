/* Rev.7 layouts from the saved 132:4 design context. Presentation and navigation only.
 * The four frames without design context retain their existing renderers.
 * No content, scoring, timer, save schema or historical record is rewritten here. */
(function () {
  'use strict';
  if (!globalThis.REV7_OX_VIEWS || !globalThis.REV7_EXAM_VIEWS || typeof document === 'undefined') return;
  const examViews=globalThis.REV7_EXAM_VIEWS, oxViews=globalThis.REV7_OX_VIEWS;
  const {catalog:OFFICIAL_EXAM_CATALOG,eras:OFFICIAL_ERA_TAXONOMY,entry:officialEntry,question:officialQuestion,record:officialLearningRecord,eraInfo:officialEraInfo,results:officialExamResults,start:startOfficialSession}=examViews;
  const {meta:oxMeta,stats:oxStats,era:oxEra,active:activeOXSession,wrongIds:oxCurrentWrongIds,recordSection:oxRecordSection,descriptions:OX_ERA_DESCRIPTIONS,readRoute:oxReadRoute,writeRoute:oxWriteRoute}=oxViews;
  const asset = name => '<span class="r7-icon" aria-hidden="true"><img src="media/rev7/' + name + '.svg" alt=""></span>';
  const chevron = () => asset('chevron');
  const tile = (label, value, caption) => '<article class="r7-tile"><small>' + label + '</small><strong>' + value + '</strong><p>' + caption + '</p></article>';
  const header = (title, profile = false) => '<header class="r7-heading r7-menu-heading"><h1>' + title + '</h1>' + (profile ? '<button class="r7-profile" data-action="status" aria-label="내 상태 보기">' + asset('user') + '</button>' : '') + '</header>';
  const bar = title => '<header class="r7-appbar"><button data-r7-record-home aria-label="내 기록으로 돌아가기">' + asset('back') + '</button><h1>' + title + '</h1><span></span></header>';
  const day = value => learningDay(value);
  let recordView = 'home', wrongStatus = 'needed', filterOpen = false, filterDraft = 'all', wrongDetailId = null;

  function learningEvents() {
    return [...(meta().learningEvents || []).map(e => ({...e, eraId:e.eraId||officialEntry(e.questionId)?.primaryEra||chapterEra(QUESTIONS.find(q=>q.questionId===e.questionId)?.chapterId), correct: e.correct})), ...(oxMeta().history || []).map(e => ({...e, correct: e.isCorrect}))]
      .filter(e => day(e.answeredAt));
  }
  function streak(events) {
    const days = new Set(events.map(e => day(e.answeredAt))), cursor = new Date();
    let count = 0;
    if (!days.has(day(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (days.has(day(cursor))) { count++; cursor.setDate(cursor.getDate() - 1); }
    return count;
  }
  function visitedScenes() {
    const scenes = new Set([...(mainRun().visited || []), ...(run().visited || [])]);
    for (const progress of Object.values(meta().eraProgress || {})) {
      for (const id of progress.resume?.run?.visited || []) scenes.add(id);
      for (const id of progress.resume?.mainRun?.visited || []) scenes.add(id);
    }
    // A chapter restart replaces its live cursor, not its cumulative reading.
    for (const book of [meta().protoRevisionBook, meta().threeCompleteBook]) {
      for (const id of book?.readSceneIds || []) scenes.add(id);
    }
    for (const record of Object.values(meta().chapterRecords || {})) {
      for (const id of record.finalRun?.visited || []) scenes.add(id);
      for (const id of record.latestRun?.finalRun?.visited || []) scenes.add(id);
    }
    return [...scenes].filter(id => STORIES[id]);
  }
  function wrongEntries() {
    // Canonical catalogue IDs deduplicate questions shared by stories and exams.
    return OFFICIAL_EXAM_CATALOG.map(entry => ({entry, question: officialQuestion(entry.canonicalQuestionId), record: officialLearningRecord(entry.canonicalQuestionId)}))
      .filter(row => row.question && row.record.wrongCount > 0)
      .sort((a, b) => String(b.record.lastAnsweredAt || '').localeCompare(String(a.record.lastAnsweredAt || '')));
  }
  function myHome() {
    const events = learningEvents(), summary = learningSummary(meta()), seen = visitedScenes(), today = events.filter(e => day(e.answeredAt) === day(new Date()));
    const any = summary.attempts > 0 || oxStats().attempts > 0 || events.length > 0 || seen.length > 0 || officialExamResults().length > 0;
    if (!any) return '<section class="r7-page r7-my" data-figma-frame="M-09">' + header('내 기록', true) + '<div class="r7-empty"><span class="r7-empty-icon">' + asset('chart') + '</span><h2>아직 학습 기록이 없어요</h2><p>이야기를 읽거나 문제를 풀면 오늘의 학습이 여기에 쌓여요.</p></div><button class="r7-primary" data-nav="home">첫 이야기 시작하기</button><button class="r7-secondary" data-r7-record-learning>학습 기록 보기</button></section>';
    const wrong = wrongEntries().filter(row => row.record.lastCorrect === false).length + oxCurrentWrongIds('all').length;
    return '<section class="r7-page r7-my" data-figma-frame="M-01">' + header('내 기록', true)
      + '<div class="r7-tiles">' + tile('오늘 학습', '—', '학습 시간 기록 없음 · 문제 ' + today.length) + tile('연속 학습', streak(events) + '일', '문제 풀이 기록 기준') + '</div>'
      + '<div class="r7-my-links">'
      + '<button data-r7-record-learning><span><b>학습 기록</b><small>오늘 · 이번 주 · 시대별</small></span>' + chevron() + '</button>'
      + '<button data-official-results-list="true"><span><b>기출 기록</b><small>푼 시험과 점수 추이</small></span>' + chevron() + '</button>'
      + '<button data-nav="study"><span><b>오답 복습</b><small>복습할 오답 ' + wrong + '개</small></span>' + chevron() + '</button></div></section>';
  }
  // Read existing statistics/result helpers; never mount the legacy records page
  // inside M-02. Extra cumulative sections have no separate confirmed Figma frame.
  function learningDetails() {
    const records=OFFICIAL_EXAM_CATALOG.map(entry=>({entry,record:officialLearningRecord(entry.canonicalQuestionId)})).filter(row=>row.record.attempts>0);
    const attempts=records.reduce((sum,row)=>sum+row.record.attempts,0),correct=records.reduce((sum,row)=>sum+row.record.correctCount,0),results=officialExamResults();
    const latest=results.reduce((best,row)=>!best||String(row.completedAt)>String(best.completedAt)?row:best,null);
    const eraRows=OFFICIAL_ERA_TAXONOMY.map(era=>{const entries=OFFICIAL_EXAM_CATALOG.filter(entry=>entry.primaryEra===era.id),done=entries.map(entry=>officialLearningRecord(entry.canonicalQuestionId)).filter(r=>r.attempts>0),total=done.reduce((n,r)=>n+r.attempts,0),right=done.reduce((n,r)=>n+r.correctCount,0);return '<li><div><b>'+esc(era.name)+'</b><span>'+done.length+' / '+entries.length+'문항</span></div><strong>'+(total?Math.round(right/total*100)+'%':'—')+'</strong><progress value="'+done.length+'" max="'+Math.max(1,entries.length)+'" aria-label="'+esc(era.name)+' 학습 문항"></progress></li>';}).join('');
    let exam='<p class="r7-record-empty">아직 완료한 시험이 없어요.</p><button class="r7-record-link" data-nav="exam-library">기출문제 풀기 '+chevron()+'</button>';
    if(latest){const edition=officialResultEdition(latest),entries=(latest.questionIds||[]).map(id=>officialEntry(id)).filter(Boolean),summary=examViews.summary(latest,entries,latest.graded||{},latest.answers||{}),cert=examViews.certification(summary,edition?.examLevel,Boolean(edition)),title=edition?'제'+edition.examRound+'회 · '+edition.examLevel:latest.examEra?officialEraInfo(latest.examEra).name:'기출 시험';exam='<article class="r7-record-result"><small>'+esc(examViews.date(latest.completedAt))+'</small><h3>'+esc(title)+'</h3><p>정답 '+summary.correct+' / '+summary.total+'문항 · '+esc(examViews.duration(latest.elapsedMs))+'</p><div><strong>'+(summary.score==null?'—':summary.score+'점')+'</strong><span>'+(cert.eligible?(cert.grade?esc(edition.examLevel)+' '+cert.grade+'급 · ':'')+(cert.passed?'합격':'불합격'):'공식 등급 기준 미적용')+'</span></div></article><button class="r7-record-link" data-official-result-open="'+esc(latest.attemptId)+'">결과지 다시 보기 '+chevron()+'</button><button class="r7-record-link" data-official-results-list="true">전체 시험 기록 '+chevron()+'</button>';}
    const ox=oxStats(),oxRows=oxViews.eraStats().map(row=>'<li><div><b>'+esc(row.name)+'</b><span>'+row.attempts+'회 · '+row.learned+'/'+row.total+'개 학습</span></div><strong>'+(row.accuracy===null?'—':row.accuracy+'%')+'</strong></li>').join('');
    const recent=oxMeta().history.filter(e=>oxViews.questionById(e.questionId)).slice(-5).reverse();
    return '<div class="r7-record-content" data-record-renderer="rev7-cumulative"><p class="r7-note">날짜가 없는 이전 기록까지 포함한 누적 통계예요. 위 기간 필터의 집계와 다를 수 있어요.</p><section class="r7-record-panel"><h2>기출 학습 요약</h2><div class="r7-record-metrics">'+tile('누적 풀이',attempts,'기출 문제')+tile('누적 정답',correct,attempts?'정답률 '+Math.round(correct/attempts*100)+'%':'정답률 기록 없음')+tile('학습 문항',records.length,'중복 제외')+tile('완료한 시험',results.length+'회','기존 시험 기록')+'</div></section><section class="r7-record-panel"><h2>시험 기록</h2>'+exam+'</section><section class="r7-record-panel r7-record-weakness">'+examViews.weakness()+'</section><section class="r7-record-panel"><h2>시대별 기출 기록</h2><ul class="r7-record-era-list">'+eraRows+'</ul></section><section class="r7-record-panel"><h2>OX 퀴즈 학습 통계</h2><div class="r7-record-metrics">'+tile('총 OX 풀이',ox.attempts,'기존 OX 기록')+tile('OX 정답률',ox.accuracy===null?'—':ox.accuracy+'%','누적 정답 기준')+tile('학습 개념',ox.learned,'중복 제외')+tile('복습할 OX',ox.currentWrong,'현재 오답')+'</div><ul class="r7-record-era-list">'+oxRows+'</ul>'+(recent.length?'<details class="r7-record-recent"><summary>최근 OX 학습 기록</summary>'+recent.map(e=>'<article><span>'+(e.isCorrect?'정답':'오답')+'</span><p>'+esc(oxViews.questionById(e.questionId).statement)+'</p><time>'+esc(e.answeredAt?new Date(e.answeredAt).toLocaleString('ko-KR'):'기록 시간 없음')+'</time></article>').join('')+'</details>':'')+'</section></div>';
  }
  function learningPage() {
    const now = new Date(), boundary = new Date(now); boundary.setHours(0, 0, 0, 0);
    if (recordPeriod === '7') boundary.setDate(boundary.getDate() - (boundary.getDay() + 6) % 7);
    if (recordPeriod === '30') boundary.setDate(1);
    const matches = e => recordEra === 'all' || (e.eraId ? e.eraId === recordEra : chapterEra(QUESTIONS.find(q => q.questionId === e.questionId)?.chapterId) === recordEra);
    const events = learningEvents().filter(e => matches(e) && (recordPeriod === 'all' || new Date(e.answeredAt) >= boundary));
    const counts = Array.from({length: 7}, () => 0);
    for (const e of events) counts[(new Date(e.answeredAt).getDay() + 6) % 7]++;
    const max = Math.max(1, ...counts), correct = events.filter(e => e.correct).length;
    const scenes = recordPeriod === 'all' ? visitedScenes().filter(id => recordEra === 'all' || chapterEra(STORIES[id].chapterId) === recordEra).length : '—';
    return '<section class="r7-page r7-learning" data-figma-frame="M-02">' + bar('학습 기록')
      + '<div class="r7-chips" aria-label="학습 기간">' + [['today','오늘'],['7','이번 주'],['30','이번 달'],['all','전체']].map(([id,label]) => '<button data-record-period="' + id + '" aria-pressed="' + (recordPeriod === id) + '"><span>' + label + '</span></button>').join('') + '</div>'
      + '<div class="r7-chips r7-era-chips" aria-label="학습 시대">' + [{id:'all',name:'전체'},...LEARNING_ERAS.filter(e => e.available||learningEvents().some(event=>event.eraId===e.id))].map(e => '<button data-record-era="' + e.id + '" aria-pressed="' + (recordEra === e.id) + '"><span>' + esc(e.name) + '</span></button>').join('') + '</div>'
      + '<div class="r7-tiles">' + tile('읽은 장면', scenes, recordPeriod === 'all' ? '저장된 장면 기록' : '날짜별 장면 기록 없음') + tile('푼 문제', events.length, '정답 ' + correct) + '</div>'
      + '<section class="r7-chart"><h2>요일별 학습</h2><div class="r7-bars">' + counts.map((n,i) => '<div><i class="'+(i===(now.getDay()+6)%7?'is-today':'')+'" style="height:' + (n ? Math.max(4, n / max * 84) : 2) + 'px" aria-label="' + '월화수목금토일'[i] + '요일 ' + n + '문제"></i><small>' + '월화수목금토일'[i] + '</small></div>').join('') + '</div></section>'
      + (!events.length ? '<div class="r7-learning-empty" role="status"><h2>선택한 기간의 풀이 기록이 없어요</h2><p>다른 기간이나 시대를 선택해 보세요. 기존 누적 기록은 유지돼요.</p></div>' : '')
      + '<p class="r7-note">날짜가 저장된 문제 풀이 기록을 집계해요.</p><details class="r7-record-details r7-record-disclosure"><summary>상세 통계 보기</summary>' + learningDetails() + '</details></section>';
  }

  const renderBefore = renderContent;
  // Keep direct records() callers and route rendering on the same Rev.7 view.
  records = function () { return recordView === 'learning' ? learningPage() : myHome(); };
  renderContent = function () {
    if (screen === 'records') return recordView === 'learning' ? learningPage() : myHome();
    if (screen === 'study' && wrongDetailId) return wrongDetailPage();
    return renderBefore();
  };
  const applyRouteBefore = oxViews.applyRoute;
  oxViews.addRoute('records/learning');
  oxViews.setApplyRoute(function (route = oxReadRoute()) {
    recordView = route === 'records/learning' ? 'learning' : 'home';
    wrongDetailId=route?.startsWith('study/question/')?decodeURIComponent(route.slice('study/question/'.length)):null;
    if(wrongDetailId){screen='study';modal=null;render();window.scrollTo(0,0);return route;}
    if (route === 'records/learning') { screen = 'records'; modal = null; render(); window.scrollTo(0, 0); return route; }
    return applyRouteBefore(route);
  });

  const oxHomeBefore = oxViews.home();
  oxViews.setHome(function () {
    const session = activeOXSession(), all = oxStats();
    const row = (id, name, description, stats) => {
      const inProgress = session && (id === 'all' ? !session.eraId : session.eraId === id);
      const state = inProgress ? '풀던 중 ' + (session.index + 1) + '/' + session.questionIds.length : stats.accuracy === null ? '아직 학습 전' : '정답률 ' + stats.accuracy + '%';
      const action = inProgress ? 'data-ox-resume="true"' : id === 'all' ? 'data-ox-start="all"' : 'data-ox-era="' + id + '"';
      return '<button class="r7-ox-row" ' + action + '><span><b>' + esc(name) + '</b><small>' + esc(description) + '</small><small>전체 ' + OX_QUESTIONS.filter(q=>id==='all'||q.eraId===id).length + '문제</small></span><em class="' + (inProgress ? 'active' : stats.accuracy === null ? '' : stats.accuracy < 70 ? 'low' : 'learned') + '">' + state + '</em>' + chevron() + '</button>';
    };
    return '<section class="r7-page r7-ox-home" data-figma-frame="O-01">' + header('OX 퀴즈') + '<p class="r7-intro">한능검 심화 핵심 개념을 빠르게 확인해요.</p>'
      + (session ? '<button class="r7-resume" data-ox-resume="true"><span><small>진행 중인 퀴즈 이어하기</small><b>' + esc(session.eraId ? oxEra(session.eraId).shortName : '전체 시대') + ' · ' + (session.index + 1) + ' / ' + session.questionIds.length + ' 문제</b></span>' + chevron() + '</button>' : '')
      + '<div class="r7-section-title"><h2>시대 골라 풀기</h2><small>최대 20문제</small></div>'
      + row('all', '전체 시대', '한 번에 섞어서 풀어요', all)
      + OX_ERAS.map(era => row(era.id, era.name, OX_ERA_DESCRIPTIONS[era.id] || '핵심 개념을 확인해요.', oxStats(era.id))).join('')
      + '<details class="r7-legacy"><summary>틀린 OX 다시 풀기</summary>' + oxHomeBefore().match(/<section class="ox-main-section"><div class="ox-main-heading"><div><small>REVIEW[\s\S]*?<\/section>/)?.[0] + '</details></section>';
  });

  function eraFilter() {
    if (!filterOpen) return '';
    const eras = [{id:'all',name:'전체 시대'},...OFFICIAL_ERA_TAXONOMY];
    return '<div class="r7-filter-overlay"><button class="r7-scrim" data-r7-filter-close aria-label="필터 닫기"></button><section class="r7-sheet" role="dialog" aria-modal="true" aria-labelledby="r7-filter-title"><div class="r7-handle"></div><header><h2 id="r7-filter-title">시대 선택</h2><button data-r7-filter-close aria-label="닫기">×</button></header><div class="r7-filter-list">' + eras.map(e => '<button data-r7-filter-era="' + e.id + '" aria-pressed="' + (filterDraft === e.id) + '"><span>' + esc(e.name) + '</span><span>' + (filterDraft === e.id ? asset('check') : '') + '</span></button>').join('') + '</div><button class="r7-primary" data-r7-filter-apply>적용하기</button></section></div>';
  }
  const studyBefore = study;
  function wrongDetailPage() {
    const q=officialQuestion(wrongDetailId),entry=officialEntry(wrongDetailId);if(!q||!entry){wrongDetailId=null;return study();}
    const record=officialLearningRecord(wrongDetailId),selected=meta().questionRecords[wrongDetailId]?.lastAnswer,labels=['①','②','③','④','⑤'];
    const hasSelected=Number.isInteger(selected),selectedCorrect=hasSelected&&typeof officialAnswerAccepted==='function'&&officialAnswerAccepted(q,selected);
    const history=(meta().learningEvents||[]).filter(e=>e.questionId===wrongDetailId).slice().reverse();
    const explanation=globalThis.OFFICIAL_EXAM_UI?.visibleExplanation?.(q)||q.explanation||'';
    const image=typeof v2OfficialQuestionImage==='function'?v2OfficialQuestionImage(q):'';
    return '<section class="r7-page r7-wrong-detail" data-figma-frame="W-08"><header class="r7-appbar"><button data-r7-wrong-back aria-label="오답노트로 돌아가기">'+asset('back')+'</button><h1>오답 상세</h1><span></span></header>'
      +'<div class="r7-detail-meta"><small>'+esc(officialEraInfo(entry.primaryEra).name)+'</small><span>'+esc('제 '+q.examRound+'회 '+q.examLevel+' · '+q.questionNumber+'번')+'</span><em>'+record.wrongCount+'회 틀림</em></div><h2>'+esc(q.sourceQuestionText||q.question)+'</h2>'+image
      +'<div class="r7-answer-summary" aria-label="내 답과 정답 비교"><div class="r7-answer-side '+(hasSelected?(selectedCorrect?'is-correct':'is-wrong'):'is-unanswered')+'"><small>내가 고른 답</small><b>'+(hasSelected?(labels[selected]||'선택 답안'):'선택하지 않음')+'</b><span class="r7-answer-state">'+(hasSelected?(selectedCorrect?'정답':'오답'):'미응답')+'</span></div><div class="r7-answer-side is-correct"><small>정답</small><b>'+(labels[q.answer]||esc(q.answerLabel||''))+'</b><span class="r7-answer-state">정답</span></div></div>'
      +'<section class="r7-detail-explanation"><h2>해설</h2><p>'+esc(explanation)+'</p>'+(globalThis.OFFICIAL_EXAM_UI?.choiceExplanations(q,selected)||'')+'</section>'
      +'<section class="r7-detail-history"><h2>풀이 기록</h2>'+(history.length?history.map(e=>'<p><time>'+esc(new Date(e.answeredAt).toLocaleDateString('ko-KR'))+'</time><span>'+(labels[e.answer]||'답안 기록 없음')+' 선택 · '+(e.correct?'정답':'오답')+'</span></p>').join(''):'<p>날짜별 풀이 기록이 없어요.</p>')+'</section><button class="r7-primary" data-r7-wrong-single="'+esc(q.questionId)+'">이 문제 다시 풀기</button></section>';
  }
  const wrongTabs=selected=>'<div class="r7-tabs" role="tablist" aria-label="오답 유형"><button role="tab" aria-selected="'+(selected==='official')+'" data-wrong-filter="official">기출 오답</button><button role="tab" aria-selected="'+(selected==='ox')+'" data-wrong-filter="ox">OX 오답</button></div>';
  study = function () {
    if(studyTab==='review'&&wrongFilter==='ox'&&!oxCurrentWrongIds('all').length)return '<section class="r7-page" data-figma-frame="O-09">'+header('오답노트')+wrongTabs('ox')+'<div class="r7-empty"><span class="r7-empty-icon">'+asset('empty-wrong')+'</span><h2>OX 오답이 없습니다</h2><p>퀴즈를 풀다 틀린 문제가 생기면 여기에 모여요.</p></div><button class="r7-primary" data-nav="ox">시대 골라 풀기</button><details class="r7-legacy"><summary>OX 복습 완료 이력</summary>'+studyBefore()+'</details></section>';
    if (studyTab !== 'review' || wrongFilter === 'ox') return studyBefore(); // Populated O-07 intentionally unchanged.
    if (!wrongEntries().length) return '<section class="r7-page r7-wrong" data-figma-frame="W-03">'+header('오답노트')+wrongTabs('official')+'<div class="r7-empty"><span class="r7-empty-icon">'+asset('empty-wrong')+'</span><h2>복습할 오답이 아직 없어요</h2><p>기출문제나 이야기 속 문제에서 틀린 문제가 여기에 모여요.</p></div><button class="r7-primary" data-nav="exam-library">기출문제 풀러 가기</button><button class="r7-secondary" data-nav="home">이야기 읽으러 가기</button><details class="r7-legacy"><summary>OX 오답과 학습 이력</summary>'+studyBefore()+'</details></section>';
    const all = wrongEntries().filter(row => wrongEra === 'all' || row.entry.primaryEra === wrongEra);
    const needed = all.filter(row => row.record.lastCorrect === false), completed = all.filter(row => row.record.lastCorrect === true);
    const rows = wrongStatus === 'completed' ? completed : needed;
    const labels = ['①','②','③','④','⑤'];
    const list = rows.map(({entry,question:q,record}) => {
      const selected = meta().questionRecords[entry.canonicalQuestionId]?.lastAnswer;
      return '<button class="r7-wrong-row" data-r7-wrong-detail="' + esc(entry.canonicalQuestionId) + '"><span class="r7-wrong-copy"><span class="r7-wrong-title"><small>' + esc(officialEraInfo(entry.primaryEra).name) + '</small><b>' + esc('제 ' + q.examRound + '회 ' + q.examLevel + ' · ' + q.questionNumber + '번') + '</b></span><span>내 답 ' + (Number.isInteger(selected) ? labels[selected] : '기록 없음') + ' · 정답 ' + (labels[q.answer] || esc(q.answerLabel || '')) + '</span><small class="' + (record.wrongCount > 1 ? 'repeated' : '') + '">' + record.wrongCount + '회 틀림 · ' + (record.lastCorrect ? '복습 완료' : record.wrongCount > 1 ? '반복 오답' : '최근 풀이 오답') + '</small></span>' + chevron() + '</button>';
    }).join('');
    const metric = (label, count) => '<div><small>' + label + '</small><strong>' + count + '<em>개</em></strong></div>';
    const eraName = OFFICIAL_ERA_TAXONOMY.find(e => e.id === wrongEra)?.name || '시대 전체';
    return '<section class="r7-page r7-wrong" data-figma-frame="W-01">' + header('오답노트')
      + '<div class="r7-tabs" role="tablist" aria-label="오답 유형"><button role="tab" aria-selected="true" data-wrong-filter="official">기출 오답</button><button role="tab" aria-selected="false" data-wrong-filter="ox">OX 오답</button></div>'
      + '<div class="r7-metrics">' + metric('복습 필요', needed.length) + metric('복습 완료', completed.length) + metric('반복 오답', all.filter(row => row.record.wrongCount > 1).length) + '</div>'
      + '<div class="r7-wrong-controls"><div class="r7-chips"><button data-r7-wrong-status="needed" aria-pressed="' + (wrongStatus === 'needed') + '">복습 필요</button><button data-r7-wrong-status="completed" aria-pressed="' + (wrongStatus === 'completed') + '">복습 완료</button></div><button class="r7-filter-button" data-r7-filter-open>' + esc(eraName) + asset('down') + '</button></div>'
      + (rows.length ? '<div class="r7-wrong-list">' + list + '</div>' : '<div class="r7-empty"><span class="r7-empty-icon">' + asset('empty-wrong') + '</span><h2>' + (wrongStatus === 'completed' ? '아직 복습 완료한 오답이 없어요' : '복습할 오답이 없어요') + '</h2><p>틀린 문제는 여기에 모여요.<br>문제를 풀며 차근차근 쌓아가요.</p></div>')
      + (needed.length && wrongStatus === 'needed' ? '<div class="r7-bottom"><button class="r7-primary" data-r7-wrong-bulk>오답 ' + needed.length + '개 풀기</button></div>' : '')
      + '<details class="r7-legacy"><summary>오답 이력과 추가 필터</summary>' + studyBefore() + '</details>' + eraFilter() + '</section>';
  };
  document.addEventListener('click', function (event) {
    const button = event.target.closest('button'); if (!button) return;
    const d = button.dataset;
    if (d.nav === 'records') recordView = 'home';
    if (d.nav || d.review) wrongDetailId = null;
    if (!Object.keys(d).some(key => ['r7RecordLearning','r7RecordHome','r7WrongStatus','r7FilterOpen','r7FilterClose','r7FilterEra','r7FilterApply','r7WrongDetail','r7WrongBack','r7WrongBulk','r7WrongSingle'].includes(key))) return;
    event.stopImmediatePropagation();
    if ('r7RecordLearning' in d) { recordView = 'learning'; screen = 'records'; oxWriteRoute('records/learning'); }
    if ('r7RecordHome' in d) { recordView = 'home'; screen = 'records'; oxWriteRoute('records'); }
    if (d.r7WrongStatus) wrongStatus = d.r7WrongStatus;
    if ('r7FilterOpen' in d) { filterDraft = wrongEra; filterOpen = true; }
    if ('r7FilterClose' in d) filterOpen = false;
    if (d.r7FilterEra) filterDraft = d.r7FilterEra;
    if ('r7FilterApply' in d) { wrongEra = filterDraft; filterOpen = false; }
    if (d.r7WrongDetail) {wrongDetailId=d.r7WrongDetail;const route='study/question/'+encodeURIComponent(wrongDetailId);oxViews.addRoute(route);oxWriteRoute(route);}
    if ('r7WrongBack' in d) {wrongDetailId=null;oxWriteRoute('study');}
    if(d.r7WrongSingle){const entry=officialEntry(d.r7WrongSingle);if(entry)startOfficialSession([entry],'learn',{scope:'wrong-only'});return;}
    if ('r7WrongBulk' in d) { const entries = wrongEntries().filter(row => row.record.lastCorrect === false && (wrongEra === 'all' || row.entry.primaryEra === wrongEra)).map(row => row.entry); if (entries.length) startOfficialSession(entries, 'learn', {scope:'wrong-only'}); return; }
    render();
    if (filterOpen) document.querySelector('.r7-sheet button')?.focus({preventScroll:true});
    else if ('r7RecordLearning' in d || 'r7RecordHome' in d) window.scrollTo(0, 0);
  }, true);
  document.addEventListener('keydown', function (event) {
    if (!filterOpen) return;
    if (event.key === 'Escape') { filterOpen = false; render(); document.querySelector('[data-r7-filter-open]')?.focus(); }
    if (event.key === 'Tab') {
      const buttons = [...document.querySelectorAll('.r7-sheet button')], first = buttons[0], last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  const renderLayoutBefore = render;
  render = function () {
    if (screen !== 'study' || wrongFilter === 'ox') filterOpen = false;
    renderLayoutBefore();
    document.body?.classList?.toggle('r7-filter-locked', filterOpen);
  };
  if (oxReadRoute() === 'records/learning') { screen = 'records'; recordView = 'learning'; }
  const initialWrong=/^#study\/question\/(.+)$/.exec(globalThis.location?.hash||'');
  if(initialWrong){wrongDetailId=decodeURIComponent(initialWrong[1]);oxViews.addRoute('study/question/'+initialWrong[1]);screen='study';}
  render();
})();
