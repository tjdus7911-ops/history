/* Rev.4 application shell and shared presentation helpers.
   Existing story, exam and persistence runtimes remain the source of truth. */
(() => {
  const icons = {
    home: '<path d="M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3z"/>',
    exam: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
    learn: '<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 11h6M9 15h6"/>',
    wrong: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="m9 10 6 6m0-6-6 6"/>',
    records: '<path d="M5 21V12m5 9V7m5 14V3m5 18V9"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>',
    filter: '<path d="M4 7h16M7 12h10M10 17h4"/>',
    back: '<path d="m15 5-7 7 7 7"/>',
    book: '<path d="M4 4h5a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4zM20 4h-5a3 3 0 0 0-3 3v14a4 4 0 0 1 4-2h4z"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>'
  };
  const icon = (name, className = '') => `<svg class="rev4-icon ${className}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.chevron}</svg>`;
  const button = (label, attrs = '', tone = 'primary', size = 'l') => `<button class="rev4-button ${tone} size-${size}" ${attrs}>${label}</button>`;
  const badge = (label, tone = 'neutral') => `<span class="rev4-badge ${tone}">${label}</span>`;
  const empty = (title, copy = '', action = '') => `<section class="rev4-empty"><span aria-hidden="true">${icon('book')}</span><h2>${title}</h2>${copy ? `<p>${copy}</p>` : ''}${action}</section>`;
  globalThis.REV4_UI = Object.freeze({ icon, button, badge, empty, version: 4 });

  const navItems = [
    ['home', '홈', 'home'],
    ['exam-library', '기출 문제', 'exam'],
    ['ox', '학습', 'learn'],
    ['study', '오답노트', 'wrong'],
    ['records', '내 기록', 'records']
  ];
  const immersiveScreen = () => {
    if (['game', 'quiz', 'complete', 'teaser', 'history'].includes(screen)) return true;
    if (screen === 'exam-library' && typeof officialExamView !== 'undefined' && ['cover', 'practice', 'result', 'review', 'history'].includes(officialExamView)) return true;
    if (screen === 'ox' && typeof oxView !== 'undefined' && ['quiz', 'result', 'analysis'].includes(oxView)) return true;
    return false;
  };
  const activeNav = () => {
    if (screen === 'game' || screen === 'quiz' || screen === 'complete' || screen === 'teaser' || screen === 'history' || screen === 'era') return 'home';
    if (screen.startsWith('exam-')) return 'exam-library';
    if (screen === 'association') return 'ox';
    return screen;
  };
  const offlineMarkup = () => globalThis.navigator?.onLine !== false ? '' : '<div class="rev4-offline" role="status">오프라인 상태예요. 저장된 학습은 계속할 수 있어요.</div>';
  shell = function rev4Shell(content) {
    const active = activeNav();
    const immersive = immersiveScreen();
    const navigation = immersive ? '' : `<aside class="sidebar rev4-navigation"><div class="brand">눈떠보니 한국사<small>역사를 살고, 기출로 기억하다</small></div><nav class="nav" aria-label="주 메뉴">${navItems.map(([id, label, image]) => `<button data-nav="${id}" ${active === id ? 'aria-current="page"' : ''} class="${active === id ? 'active' : ''}">${icon(image)}<span>${label}</span></button>`).join('')}</nav></aside>`;
    return `${offlineMarkup()}<div class="shell editorial-shell five-nav rev4-shell ${immersive ? 'rev4-immersive' : ''}">${navigation}<main class="main ed-screen ed-${screen} rev4-screen">${content}</main></div>${searchMarkup()}${modal ? modalHTML() : ''}`;
  };

  const safeNumber = value => Number.isFinite(Number(value)) ? Number(value) : 0;
  const learningEras = () => typeof LEARNING_ERAS !== 'undefined' ? LEARNING_ERAS : globalThis.LEARNING_ERAS || [];
  const todayStats = () => typeof periodLearning === 'function' ? periodLearning(meta()) : { streak: 0, attempts: 0, accuracy: null, wrong: 0 };
  const learningStats = () => typeof learningSummary === 'function' ? learningSummary(meta()) : { weak: [], attempts: 0, accuracy: null };
  const recentEra = () => typeof eraInfo === 'function' ? eraInfo(meta().lastLearningEra || (typeof chapterEra === 'function' ? chapterEra(mainRun().currentChapter) : 'goryeo')) : null;
  const eraArtwork = era => typeof eraHero === 'function' ? eraHero(era.id) : '';
  const eraPercent = era => typeof eraProgress === 'function' ? eraProgress(era.id) : 0;
  const homeHeader = () => `<header class="rev4-home-header"><div><h1>눈떠보니 한국사</h1><p>역사를 살고, 기출로 기억하다</p></div><div class="rev4-home-tools"><button data-rev4-search-open aria-label="검색">${icon('search')}</button><button data-action="status" aria-label="내 상태 보기">${icon('user')}</button></div></header>`;
  const homeMetrics = stats => `<section class="rev4-home-section"><h2>오늘의 학습</h2><div class="rev4-metric-card">${[
    ['연속 학습', `${safeNumber(stats.streak)}일`],
    ['오늘 푼 문제', `${safeNumber(stats.attempts)}문항`],
    ['정답률', stats.accuracy == null ? '—' : `${Math.round(stats.accuracy)}%`],
    ['복습할 오답', `${safeNumber(stats.wrong)}문항`]
  ].map(([label, value]) => `<div><small>${label}</small><strong>${value}</strong></div>`).join('')}</div></section>`;
  const homeHero = (era, runState, chapterInfo, story, started) => {
    const background = story && ASSETS[story.illustrationId]?.src || eraArtwork(era) || chapterInfo?.thumbnail || '';
    const chapterNo = chapterInfo?.number || '01';
    const title = story?.title || chapterInfo?.title || `${era?.name || '한국사'} 첫 이야기`;
    const progress = started && typeof progressFor === 'function' ? progressFor(runState) : 0;
    const action = started ? `data-era-resume="${era?.id || 'goryeo'}"` : `data-era-open="${era?.id || 'goryeo'}"`;
    return `<section class="rev4-home-hero" style="--rev4-hero:url('${esc(background)}')"><div class="rev4-home-hero-shade"></div><div class="rev4-home-hero-copy"><span>${started ? '◉ 이어 읽기' : '첫 이야기'}</span><h2>CH.${chapterNo} ${esc(title)}</h2><p>${started ? `장면 진행 ${Math.max(1, Math.round(progress / 9))} / 11 · 최근 학습` : '한 장면씩 역사를 직접 살아보세요'}</p><div class="rev4-home-hero-progress"><i style="width:${progress}%"></i></div><button ${action}>${started ? '이어서 읽기' : '이야기 시작'} ${icon('chevron')}</button></div></section>`;
  };
  const homeEraCards = () => `<section class="rev4-home-section"><div class="rev4-section-title"><h2>시대 여행</h2><button data-nav="home" data-rev4-era-all="true">전체 보기 ${icon('chevron')}</button></div><div class="rev4-era-scroll">${learningEras().map(era => {
    const art = eraArtwork(era);
    const progress = eraPercent(era);
    return `<button class="rev4-era-tile" ${era.available ? `data-era-open="${era.id}"` : 'disabled'} style="--era-accent:${era.accent};--era-image:url('${esc(art || '')}')"><span>SEASON ${String(era.order).padStart(2, '0')}</span><strong>${esc(era.name)}</strong><small>${era.available ? `진행 ${progress}%` : '준비 중'}</small><i><b style="width:${progress}%"></b></i></button>`;
  }).join('')}</div></section>`;
  const homeShortcuts = stats => `<section class="rev4-home-section"><h2>학습 바로가기</h2><div class="rev4-shortcuts"><button data-nav="exam-library"><span>${icon('exam')}</span><b>실전 기출 이어 풀기</b><small>회차별·시대별 실제 기출</small>${icon('chevron')}</button><button data-nav="ox"><span>${icon('learn')}</span><b>오늘의 OX 20문제</b><small>핵심 개념을 빠르게 확인</small>${icon('chevron')}</button><button data-nav="study"><span>${icon('wrong')}</span><b>오답 ${safeNumber(stats.wrong)}문제 복습</b><small>아직 틀린 문제부터 다시</small>${icon('chevron')}</button></div></section>`;
  const homeRecentWrong = () => {
    const id = (meta().wrongQuestionIds || []).find(questionId => QUESTIONS.some(question => question.questionId === questionId));
    const question = id && QUESTIONS.find(item => item.questionId === id);
    if (!question) return '';
    const source = question.sourceLabel || question.officialQuestionId || (question.isOfficial ? '실제 기출' : '스토리 학습');
    return `<section class="rev4-home-section"><div class="rev4-section-title"><h2>최근 오답 다시 보기</h2><button data-nav="study">전체 보기 ${icon('chevron')}</button></div><div class="rev4-shortcuts"><button data-review="${esc(question.questionId)}"><span>${icon('wrong')}</span><b>${esc(question.sourceQuestionText || question.question)}</b><small>${esc(source)}</small>${icon('chevron')}</button></div></section>`;
  };
  const homeWeakness = () => {
    const rows = learningStats().weak?.slice(0, 3) || [];
    if (!rows.length) return '';
    return `<section class="rev4-home-section"><div class="rev4-section-title"><h2>보완이 필요한 시대</h2><button data-nav="records">분석 보기 ${icon('chevron')}</button></div><div class="rev4-weak-list">${rows.map((row, index) => `<button data-nav="records"><span><b>${esc(row.name)}</b><small>${safeNumber(row.wrong)}회 오답</small></span><i><b style="width:${safeNumber(row.accuracy)}%"></b></i><strong>${safeNumber(row.accuracy)}%</strong>${badge(index === 0 ? '집중 학습' : '복습 권장', index === 0 ? 'error' : 'warning')}</button>`).join('')}</div></section>`;
  };
  const homeWelcome = era => {
    const intro = STORIES.proto_ch01_s1 || Object.values(STORIES).find(story => /박물관|전시/.test(`${story.location || ''} ${story.title || ''}`));
    const background = ASSETS[intro?.illustrationId]?.src || eraArtwork(era) || '';
    return `<section class="rev4-home first-visit">${homeHeader()}<section class="rev4-welcome-hero" style="--rev4-hero:url('${esc(background)}')"><div class="rev4-home-hero-shade"></div><div><span>PROLOGUE</span><h2>박물관에서 눈을 감았다.<br>눈을 뜨니, 이천 년 전이었다.</h2><p>이야기 속 장면에서 배운 개념을 실제 한능검 기출로 바로 확인해요.</p>${button(`첫 이야기 시작하기 · 원삼국 ${icon('chevron')}`, 'data-era-open="proto-kingdoms"', 'accent')}</div></section><section class="rev4-home-section rev4-how"><h2>이렇게 공부해요</h2><ol><li><b>1</b><span><strong>이야기를 읽어요</strong><small>주인공이 되어 그 시대 사람들과 대화하고 선택해요.</small></span></li><li><b>2</b><span><strong>장면이 끝나면 기출로 확인해요</strong><small>방금 만난 개념이 나온 실제 한능검 문제를 풀어요.</small></span></li><li><b>3</b><span><strong>틀린 문제는 오답노트로</strong><small>다시 풀고, 선택별 해설로 완전히 이해해요.</small></span></li></ol></section>${homeEraCards()}${homeRecentWrong()}<section class="rev4-home-section"><h2>바로 문제부터 풀고 싶다면</h2><div class="rev4-first-shortcuts"><button data-nav="exam-library"><span>${icon('exam')}</span><b>회차별 기출문제</b><small>제57회 ~ 제79회 · 1,800문항</small>${icon('chevron')}</button><button data-nav="ox"><span>${icon('learn')}</span><b>시대별 OX 퀴즈</b><small>3,262문항 · 한 번에 최대 20문제</small>${icon('chevron')}</button></div></section></section>`;
  };
  const homeBeforeRev4 = typeof home === 'function' ? home : null;
  home = function rev4Home() {
    try {
      const era = recentEra() || learningEras()[0];
      const r = era?.id === (typeof chapterEra === 'function' ? chapterEra(mainRun().currentChapter) : era?.id) ? mainRun() : meta().eraProgress?.[historySeasonProgressKey(era.id)]?.resume?.run;
      const chapterInfo = CHAPTERS[r?.currentChapter] || CHAPTERS[mainRun().currentChapter];
      const story = STORIES[r?.pending?.sourceSceneId || r?.storyId] || STORIES[chapterInfo?.startStoryId];
      const stats = todayStats();
      const started = Boolean(r?.started);
      if (!started) return homeWelcome(era);
      return `<section class="rev4-home returning">${homeHeader()}${homeHero(era, r || mainRun(), chapterInfo, story, true)}${homeMetrics(stats)}${homeEraCards()}${homeShortcuts(stats)}${homeRecentWrong()}${homeWeakness()}</section>`;
    } catch (error) {
      if (homeBeforeRev4 && error instanceof ReferenceError && /before initialization|not defined/.test(error.message)) return homeBeforeRev4();
      throw error;
    }
  };

  if (typeof eras === 'function') {
    const erasBeforeRev4 = eras;
    eras = function rev4Eras() { return `<section class="rev4-story-index">${erasBeforeRev4()}</section>`; };
  }

  let wrongDetailId = null;
  let wrongFilterOpen = false;
  let rev4SearchOpen = false;
  let rev4SearchQuery = '';
  function searchMarkup() {
    if (!rev4SearchOpen) return '';
    const query = rev4SearchQuery.trim().toLocaleLowerCase('ko-KR');
    const rows = [];
    if (query) {
      for (const era of learningEras()) if (`${era.name} ${era.subtitle || ''}`.toLocaleLowerCase('ko-KR').includes(query)) rows.push({ kind: '시대', title: era.name, copy: era.subtitle || '시대 이야기', attrs: `data-era-open="${esc(era.id)}"` });
      for (const chapter of Object.values(CHAPTERS)) if (`${chapter.title || ''} ${chapter.subtitle || ''}`.toLocaleLowerCase('ko-KR').includes(query)) rows.push({ kind: '챕터', title: `CH.${chapter.number} ${chapter.title || chapter.subtitle}`, copy: chapter.subtitle || '', attrs: `data-era-open="${esc(chapter.eraId || 'goryeo')}"` });
      for (const question of QUESTIONS) if (`${question.question || ''} ${question.sourceQuestionText || ''}`.toLocaleLowerCase('ko-KR').includes(query)) rows.push({ kind: isVerifiedOfficialQuestion(question) ? '기출' : '학습', title: question.sourceQuestionText || question.question, copy: questionSourceLabel(question), attrs: `data-review="${esc(question.questionId)}"` });
    }
    return `<div class="modal-overlay rev4-search-overlay"><section class="rev4-search" role="dialog" aria-modal="true" aria-label="통합 검색"><header><button data-rev4-search-close aria-label="검색 닫기">${icon('back')}</button><label>${icon('search')}<input data-rev4-search-input type="search" value="${esc(rev4SearchQuery)}" placeholder="시대, 인물, 사건, 문제 검색" autocomplete="off"></label></header>${query ? rows.length ? `<div class="rev4-search-results"><p><b>${rows.length}</b>개의 검색 결과</p>${rows.slice(0, 20).map(row => `<button ${row.attrs}><span>${badge(row.kind, 'brand')}<strong>${esc(row.title)}</strong><small>${esc(row.copy)}</small></span>${icon('chevron')}</button>`).join('')}</div>` : empty('검색 결과가 없어요', '다른 인물·사건·시대 이름으로 검색해 보세요.') : `<section class="rev4-search-guide"><h2>무엇을 찾고 있나요?</h2><p>시대, 인물, 사건이나 기출문제의 핵심어를 검색할 수 있어요.</p><div><button data-rev4-search-suggest="광개토 대왕">광개토 대왕</button><button data-rev4-search-suggest="고려">고려</button><button data-rev4-search-suggest="토지 제도">토지 제도</button></div></section>`}</section></div>`;
  }
  const wrongRecord = id => (meta().wrongAnswers || []).filter(item => item.questionId === id || item.runtimeQuestionId === id).sort((a, b) => String(b.answeredAt || '').localeCompare(String(a.answeredAt || '')))[0];
  const wrongDetail = id => {
    const q = QUESTIONS.find(item => item.questionId === id || item.officialQuestionId === id);
    if (!q) return `<section class="rev4-wrong-detail"><header><button data-rev4-wrong-back aria-label="오답노트로 돌아가기">${icon('back')}</button><h1>오답 상세</h1></header>${empty('문제 데이터를 불러올 수 없어요', '기록은 그대로 보존되어 있습니다. 잠시 후 다시 시도해 주세요.', button('다시 시도', 'data-rev4-wrong-back'))}</section>`;
    const record = meta().questionRecords?.[q.questionId] || {};
    const event = wrongRecord(q.questionId) || {};
    const choices = typeof quizChoices === 'function' ? quizChoices(q) : q.choices || [];
    const selected = Number.isInteger(event.answer) ? event.answer : Number.isInteger(event.selectedAnswer) ? event.selectedAnswer : null;
    const answer = Number.isInteger(q.answer) ? q.answer : 0;
    const source = typeof questionSourceLabel === 'function' ? questionSourceLabel(q) : '학습 문제';
    return `<section class="rev4-wrong-detail"><header><button data-rev4-wrong-back aria-label="오답노트로 돌아가기">${icon('back')}</button><h1>오답 상세</h1></header><div class="rev4-wrong-meta">${badge(isVerifiedOfficialQuestion(q) ? '기출' : '스토리', 'brand')}<span>${esc(source)}</span></div><h2>${esc(q.sourceQuestionText || q.question)}</h2>${q.passage ? `<div class="rev4-passage">${esc(q.passage)}</div>` : ''}<div class="rev4-answer-review">${choices.map((choice, index) => `<div class="${index === answer ? 'correct' : index === selected ? 'wrong' : ''}"><span>${index + 1}</span><p>${esc(choice)}</p>${index === answer ? badge('정답', 'success') : index === selected ? badge('내 답', 'error') : ''}</div>`).join('')}</div><section class="rev4-explanation"><small>문제 핵심 해설</small><p>${esc(globalThis.OFFICIAL_EXAM_UI?.visibleExplanation?.(q) || q.explanation || '해설 데이터를 확인하고 있습니다.')}</p></section><div class="rev4-attempt-history"><h3>풀이 기록</h3><p>누적 ${safeNumber(record.attempts)}회 · ${Math.max(1, safeNumber(record.attempts) - safeNumber(record.correctCount))}회 틀림${event.answeredAt ? ` · ${new Date(event.answeredAt).toLocaleDateString('ko-KR')}` : ''}</p></div>${button('이 문제 다시 풀기', `data-review="${esc(q.questionId)}"`)}</section>`;
  };
  if (typeof study === 'function') {
    const studyBeforeRev4 = study;
    study = function rev4Study() {
      if (studyTab === 'review' && wrongDetailId) return wrongDetail(wrongDetailId);
      return `<section class="rev4-wrong-index">${studyBeforeRev4()}</section>`;
    };
  }
  if (typeof records === 'function') {
    const recordsBeforeRev4 = records;
    records = function rev4Records() { return `<section class="rev4-records">${recordsBeforeRev4()}</section>`; };
  }

  if (typeof modalHTML === 'function') {
    const modalBeforeRev4 = modalHTML;
    modalHTML = function rev4Modal() {
      return modalBeforeRev4().replace(/<section class="modal/g, '<section class="modal rev4-modal');
    };
  }

  if (typeof toast === 'function') {
    const toastBeforeRev4 = toast;
    toast = function rev4Toast(message) {
      toastBeforeRev4(message);
      document.querySelector?.('.toast')?.classList?.add('rev4-toast');
    };
  }

  function enhanceStory() {
    const game = document.querySelector('.conversation-game');
    if (!game) return;
    game.setAttribute('data-rev4-screen', 'story');
    const controls = game.querySelectorAll('.game-header > *');
    if (controls[0]) controls[0].innerHTML = icon('back');
    if (controls[1]) controls[1].classList.add('rev4-story-location');
    if (controls[2]) controls[2].innerHTML = icon('book');
    const stepButton = game.querySelector('.advance-dialogue');
    if (stepButton) stepButton.innerHTML = `<span aria-hidden="true">☝</span> 화면을 탭하면 다음 대사`;
  }
  function enhanceWrongNote() {
    const root = document.querySelector('.rev4-wrong-index');
    if (!root) return;
    const header = root.querySelector('.ed-header');
    if (header && !root.querySelector('.rev4-wrong-summary')) {
      const ids = [...new Set(meta().wrongQuestionIds || [])];
      const reviewed = ids.filter(id => meta().reviewedQuestionIds?.includes(id)).length;
      const repeated = ids.filter(id => {
        const record = meta().questionRecords?.[id];
        return safeNumber(record?.attempts) - safeNumber(record?.correctCount) > 1;
      }).length;
      header.insertAdjacentHTML('afterend', `<div class="rev4-wrong-summary">${[['전체 오답', ids.length], ['아직 틀림', Math.max(0, ids.length - reviewed)], ['다시 맞힘', reviewed], ['반복 오답', repeated]].map(([label, value]) => `<div><small>${label}</small><strong>${value}<span>문항</span></strong></div>`).join('')}</div><button class="rev4-filter-trigger" data-rev4-filter-toggle>${icon('filter')} 정렬·필터</button>`);
    }
    const filters = root.querySelector('.v2-filters');
    if (filters) {
      filters.classList.add('rev4-filter-sheet');
      filters.classList.toggle('open', wrongFilterOpen);
      filters.setAttribute('aria-hidden', String(!wrongFilterOpen));
      if (!filters.querySelector('.rev4-sheet-head')) filters.insertAdjacentHTML('afterbegin', `<div class="rev4-sheet-head"><span></span><h2>정렬·필터</h2><button data-rev4-filter-toggle aria-label="닫기">${icon('close')}</button></div>`);
      if (wrongFilterOpen && !document.querySelector('.rev4-filter-backdrop')) document.body.insertAdjacentHTML('beforeend', '<button class="rev4-filter-backdrop" data-rev4-filter-toggle aria-label="필터 닫기"></button>');
    }
    root.querySelectorAll('.v2-question-row').forEach(row => {
      const source = row.querySelector('[data-review],[data-practice],[data-story-memory]');
      const id = source?.dataset.review || source?.dataset.practice || source?.dataset.storyMemory;
      if (!id || row.querySelector('[data-rev4-wrong-open]')) return;
      row.insertAdjacentHTML('beforeend', `<button class="rev4-wrong-open" data-rev4-wrong-open="${esc(id)}">상세 보기 ${icon('chevron')}</button>`);
    });
    const invalid = (meta().wrongQuestionIds || []).filter(id => !QUESTIONS.some(q => q.questionId === id));
    if (invalid.length && !root.querySelector('.rev4-data-exception')) root.insertAdjacentHTML('beforeend', `<section class="rev4-data-exception">${badge('데이터 확인 필요', 'warning')}<h2>${invalid.length}개의 이전 오답 기록을 읽지 못했어요.</h2><p>학습 기록은 삭제하지 않았습니다. 문제 데이터가 복원되면 다시 표시됩니다.</p></section>`);
    if (root.querySelectorAll('.v2-question-row,.wrong-note-row').length > 24) root.classList.add('rev4-large-list');
  }
  function enhanceCommon() {
    document.documentElement.classList.add('rev4-active');
    document.querySelectorAll('button').forEach(button => { if (!button.type) button.type = 'button'; });
    document.querySelectorAll('.primary:not(.rev4-button),.confirm-answer,.official-submit-answer').forEach(button => button.classList.add('rev4-primary'));
    document.querySelectorAll('.secondary:not(.rev4-button)').forEach(button => button.classList.add('rev4-secondary'));
  }
  function enhanceRev4() {
    if (!document?.documentElement?.classList || typeof document.querySelector !== 'function') return;
    document.querySelector('.rev4-filter-backdrop')?.remove();
    enhanceCommon();
    enhanceStory();
    enhanceWrongNote();
  }
  if (typeof render === 'function') {
    const renderBeforeRev4 = render;
    render = function rev4Render() {
      renderBeforeRev4();
      enhanceRev4();
    };
  }
  const requestRender = () => { if (typeof render === 'function') render(); };

  if (typeof document !== 'undefined') {
  document.addEventListener('click', event => {
    const searchOpen = event.target.closest('[data-rev4-search-open]');
    if (searchOpen && Object.hasOwn(searchOpen.dataset || {}, 'rev4SearchOpen')) {
      event.preventDefault?.();
      event.stopImmediatePropagation?.();
      rev4SearchOpen = true;
      requestRender();
      setTimeout(() => document.querySelector('[data-rev4-search-input]')?.focus(), 0);
      return;
    }
    const searchClose = event.target.closest('[data-rev4-search-close]');
    if (searchClose && Object.hasOwn(searchClose.dataset || {}, 'rev4SearchClose')) {
      event.preventDefault?.();
      event.stopImmediatePropagation?.();
      rev4SearchOpen = false;
      rev4SearchQuery = '';
      requestRender();
      return;
    }
    const suggestion = event.target.closest('[data-rev4-search-suggest]');
    if (suggestion && Object.hasOwn(suggestion.dataset || {}, 'rev4SearchSuggest')) {
      event.preventDefault?.();
      event.stopImmediatePropagation?.();
      rev4SearchQuery = suggestion.dataset.rev4SearchSuggest;
      requestRender();
      setTimeout(() => document.querySelector('[data-rev4-search-input]')?.focus(), 0);
      return;
    }
    const searchResult = event.target.closest('.rev4-search-results [data-era-open],.rev4-search-results [data-review]');
    if (searchResult && (Object.hasOwn(searchResult.dataset || {}, 'eraOpen') || Object.hasOwn(searchResult.dataset || {}, 'review'))) rev4SearchOpen = false;
    const filterToggle = event.target.closest('[data-rev4-filter-toggle]');
    if (filterToggle && Object.hasOwn(filterToggle.dataset || {}, 'rev4FilterToggle')) {
      event.preventDefault?.();
      event.stopImmediatePropagation?.();
      wrongFilterOpen = !wrongFilterOpen;
      requestRender();
      return;
    }
    const detail = event.target.closest('[data-rev4-wrong-open]');
    if (detail && Object.hasOwn(detail.dataset || {}, 'rev4WrongOpen')) {
      event.preventDefault?.();
      event.stopImmediatePropagation?.();
      wrongDetailId = detail.dataset.rev4WrongOpen;
      requestRender();
      globalThis.scrollTo?.(0, 0);
      return;
    }
    const back = event.target.closest('[data-rev4-wrong-back]');
    if (back && Object.hasOwn(back.dataset || {}, 'rev4WrongBack')) {
      event.preventDefault?.();
      event.stopImmediatePropagation?.();
      wrongDetailId = null;
      requestRender();
      globalThis.scrollTo?.(0, 0);
    }
  }, true);
  document.addEventListener('input', event => {
    if (!event.target.matches?.('[data-rev4-search-input]')) return;
    rev4SearchQuery = event.target.value;
    const selectionStart = event.target.selectionStart;
    requestRender();
    const input = document.querySelector('[data-rev4-search-input]');
    input?.focus();
    if (Number.isInteger(selectionStart)) input?.setSelectionRange?.(selectionStart, selectionStart);
  });
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('online', requestRender);
    window.addEventListener('offline', requestRender);
  }
  if (document?.querySelector?.('#app')) {
    if (typeof setTimeout === 'function') setTimeout(requestRender, 0);
    else requestRender();
  }
  else enhanceRev4();
  }
})();
