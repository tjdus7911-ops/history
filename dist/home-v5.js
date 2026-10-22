/* Home v6 — mobile-first home.
 * Loaded after every other UI layer so it only replaces home().
 * Story, scoring, exam sessions and saves are untouched: every action below
 * reuses the existing data-* routes. Home statistics are derived from dated
 * question events and de-duplicated before display. */
(function () {
  'use strict';
  if (typeof document === 'undefined' || typeof window === 'undefined' || typeof setInterval !== 'function') return;
  if (typeof home !== 'function' || typeof render !== 'function' || typeof LEARNING_ERAS === 'undefined') return;

  let sheet = null; // null | 'seasons' | 'calendar'
  let calendarMonth = null;
  let calendarSelectedKey = null;

  const DAY = 86400000;
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const localDayNumber = (d) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY);
  const toKey = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const parseKey = (key) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key || '');
    if (!m) return null;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return Number.isNaN(d.getTime()) || d.getMonth() !== Number(m[2]) - 1 ? null : d;
  };

  /* ---------- derived state ---------- */
  function ddayState(now = new Date()) {
    const target = parseKey(meta().examTargetDate);
    if (!target) return { kind: 'unset' };
    const days = localDayNumber(target) - localDayNumber(now);
    if (days < 0) return { kind: 'past', date: target };
    return { kind: days === 0 ? 'today' : 'set', days, date: target };
  }

  function heroEra() {
    // eraInfo() falls back to Goryeo for unknown ids, so look the era up directly.
    const pick = (id) => { const e = LEARNING_ERAS.find((x) => x.id === id); return e && e.available ? e : null; };
    return pick(meta().lastLearningEra)
      || LEARNING_ERAS.find((e) => e.available && seasonRun(e)?.started)
      || LEARNING_ERAS.filter((e) => e.available).sort((a, b) => a.order - b.order)[0]
      || eraInfo('goryeo');
  }

  function activeExam() {
    const a = meta().officialExamActiveSession;
    if (!a || a.mode !== 'exam' || !Array.isArray(a.questionIds) || !a.questionIds.length) return null;
    const total = a.questionIds.length;
    const answered = Object.values(a.answers || {}).filter(Number.isInteger).length;
    let remaining = null;
    if (a.timed) {
      remaining = a.timerState === 'RUNNING' && Number(a.endTimeMs) > 0
        ? Math.max(0, Number(a.endTimeMs) - Date.now())
        : Number(a.remainingMs);
      if (!Number.isFinite(remaining)) remaining = null;
    }
    const title = a.examTab === 'round' && a.examRound != null
      ? '제 ' + a.examRound + '회 ' + (a.examLevel && a.examLevel !== 'all' ? a.examLevel : '')
      : '시대별 모의시험';
    return { total, answered, remaining, title: title.trim(), paused: a.timerState === 'PAUSED' };
  }

  const clock = (ms) => {
    const s = Math.ceil(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
    return (h ? h + ':' + String(m).padStart(2, '0') : String(m)) + ':' + String(r).padStart(2, '0');
  };

  function wrongPool() {
    const reviewed = new Set(meta().reviewedQuestionIds || []);
    const seen = new Set(), list = [];
    for (const id of meta().wrongQuestionIds || []) {
      if (seen.has(id)) continue;
      seen.add(id);
      if (!reviewed.has(id) && QUESTIONS.some((q) => q.questionId === id)) list.push(id);
    }
    // most recently missed first, when the timestamp helper exists
    if (typeof v2WrongTime === 'function') list.sort((a, b) => String(v2WrongTime(b)).localeCompare(String(v2WrongTime(a))));
    return list;
  }

  /* ---------- small view helpers ---------- */
  const ico = {
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.4"/><path d="M5 20.5v-1.2a6.5 6.5 0 0 1 14 0v1.2"/></svg>',
    paper: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h8l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7 3.5Z"/><path d="M14.5 3.5V8H19M9.5 12.5h6M9.5 16h4"/></svg>',
    ox: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="3.6"/><path d="m14.5 14.5 6 6M20.5 14.5l-6 6"/></svg>',
    redo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5"/><path d="M4 4v4.5h4.5"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  };

  const illustrations = {
    calendar: '<svg class="hv-mini-art" viewBox="0 0 48 48" aria-hidden="true"><rect class="icon-surface-coral" x="4" y="4" width="40" height="40" rx="14"/><rect class="icon-sheet" x="12" y="13" width="24" height="23" rx="5"/><path class="icon-accent" d="M12 20h24"/><path class="icon-line" d="M18 10v6m12-6v6"/><path class="icon-accent" d="m18 28 3 3 8-8"/></svg>',
    fire: '<svg class="hv-mini-art" viewBox="0 0 48 48" aria-hidden="true"><circle class="icon-surface-amber" cx="24" cy="24" r="20"/><path class="icon-accent" d="M27 11c1 7-4 8-2 14 3-1 5-4 6-7 6 7 5 18-3 21-8 3-16-2-16-11 0-6 3-9 7-13-1 6 3 9 5 10-1-8 7-10 5-15Z"/><path class="icon-line" d="M24 37c-4-1-5-5-2-8 0 2 2 3 2 3 0-3 3-4 3-7 4 5 3 10-3 12Z"/></svg>',
    paper: '<svg class="hv-mini-art" viewBox="0 0 48 48" aria-hidden="true"><rect class="icon-surface-blue" x="4" y="4" width="40" height="40" rx="14"/><path class="icon-sheet" d="M13 10h16l7 7v21H13Z"/><path class="icon-line" d="M29 10v8h7M18 23h12m-12 6h8"/><path class="icon-accent" d="m27 34 2.5 2.5L35 31"/></svg>',
    target: '<svg class="hv-mini-art" viewBox="0 0 48 48" aria-hidden="true"><circle class="icon-surface-mint" cx="24" cy="24" r="20"/><circle class="icon-sheet" cx="22" cy="26" r="12"/><circle class="icon-line" cx="22" cy="26" r="6"/><circle class="icon-accent-fill" cx="22" cy="26" r="2.5"/><path class="icon-line" d="m22 26 14-14m-4 0h4v4"/></svg>',
    ox: '<svg class="hv-mini-art" viewBox="0 0 48 48" aria-hidden="true"><rect class="icon-surface-mint" x="4" y="4" width="40" height="40" rx="14"/><circle class="icon-sheet" cx="17" cy="24" r="7"/><path class="icon-accent" d="m29 18 10 12m0-12L29 30"/></svg>',
    review: '<svg class="hv-mini-art" viewBox="0 0 48 48" aria-hidden="true"><rect class="icon-surface-amber" x="4" y="4" width="40" height="40" rx="14"/><path class="icon-sheet" d="M13 11h23v25H17a4 4 0 0 0-4 4Z"/><path class="icon-line" d="M19 18h11m-11 6h8"/><path class="icon-accent" d="M10 29a9 9 0 0 0 8 9m-8-9v6m0-6h6"/></svg>'
  };

  /* General questions and OX keep separate histories. Merge them for the home
   * snapshot, reject invalid/future dates, and drop only exact duplicate events. */
  function learningEvents(now = new Date()) {
    const regular = (meta().learningEvents || []).map((event) => ({ ...event, source: 'question' }));
    const ox = (globalThis.REV7_OX_VIEWS?.meta?.().history || meta().oxQuiz?.history || [])
      .map((event) => ({ ...event, source: 'ox', correct: typeof event.isCorrect === 'boolean' ? event.isCorrect : event.correct }));
    const seen = new Set();
    return regular.concat(ox).filter((event) => {
      const time = Date.parse(event?.answeredAt || '');
      if (!Number.isFinite(time) || time > now.getTime()) return false;
      const identity = [event.source, event.eventId || event.sessionId || '', event.questionId || '', event.attemptNumber || '', event.answeredAt, String(event.answer ?? event.selectedAnswer ?? ''), String(Boolean(event.correct))].join('|');
      if (seen.has(identity)) return false;
      seen.add(identity);
      return true;
    }).sort((a, b) => Date.parse(a.answeredAt) - Date.parse(b.answeredAt));
  }

  function studyStats(now = new Date()) {
    const events = learningEvents(now);
    const days = new Set(events.map((event) => toKey(new Date(event.answeredAt))));
    const today = toKey(now);
    const todayCount = events.filter((event) => toKey(new Date(event.answeredAt)) === today).length;
    let streak = 0;
    const cursor = startOfDay(now);
    if (!days.has(toKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (days.has(toKey(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
    const recent = events.slice(-20);
    const accuracy = recent.length ? Math.round((recent.filter((event) => event.correct).length / recent.length) * 100) : null;
    return { streak, todayCount, accuracy, any: events.length > 0 };
  }

  function examHistoryCount() {
    const r = meta().officialExamResults;
    return Array.isArray(r) ? r.length : r && typeof r === 'object' ? Object.keys(r).length : 0;
  }

  function oxState() {
    const ox = globalThis.REV7_OX_VIEWS?.meta?.() || meta().oxQuiz || {};
    const a = ox.activeSession;
    if (a && Array.isArray(a.questionIds) && a.questionIds.length) {
      const idx = Math.min(a.questionIds.length, Number(a.index || 0) + 1);
      return { kind: 'active', text: 'OX 퀴즈 ' + idx + ' / ' + a.questionIds.length + '번째' };
    }
    const any = (ox.history && ox.history.length) || ox.lastSession || (ox.completedSessions && (Array.isArray(ox.completedSessions) ? ox.completedSessions.length : Number(ox.completedSessions)));
    return { kind: any ? 'done' : 'none' };
  }

  /* hero rail: one portrait card per era, ~1.5 cards visible */
  function eraCard(e, current) {
    const r = seasonRun(e), started = Boolean(r?.started), pct = e.available ? eraProgress(e.id) : 0;
    const ch = CHAPTERS[r?.currentChapter];
    const source = STORIES[r?.pending?.sourceSceneId || r?.storyId];
    const inPrologue = Boolean(source?.isPrologue);
    const currentSceneIds = inPrologue && globalThis.PROTO_REVISION_RUNTIME ? globalThis.PROTO_REVISION_RUNTIME.prologueSceneIds : ch ? chapterScenes(ch.chapterId).map(scene => scene.sceneId) : [];
    const done = pct >= 100;
    const sub = !e.available ? esc(e.years) + ' · 준비 중'
      : started && ch ? (inPrologue ? '원삼국 프롤로그' : 'CH.' + ch.number + ' ' + esc(ch.title)) + (currentSceneIds.length ? ' · 장면 ' + Math.max(1, currentSceneIds.indexOf(r.storyId) + 1) + ' / ' + currentSceneIds.length : '') : esc(e.years);
    const tag = !e.available ? '준비 중' : started ? (done ? '완료' : '이어서 학습') : '시작하기';
    const action = !e.available ? 'disabled aria-disabled="true"' : started && !done ? 'data-r7-story-resume="' + e.id + '"' : 'data-era-open="' + e.id + '"';
    const label = !e.available ? '준비 중' : done ? '다시 보기' : started ? '이어하기' : '시작하기';
    const art = e.bannerAsset ? '<img class="hv-card-art" src="' + esc(e.bannerAsset) + '" alt="" ' + (current ? 'fetchpriority="high" ' : 'loading="lazy" ') + 'decoding="async" onerror="this.remove()">' : '';
    return '<article class="hv-era' + (e.available ? '' : ' is-soon') + (current ? ' is-current' : '') + '" style="--era-accent:' + esc(e.accent || '#169B8D') + '" aria-label="눈떠보니 ' + esc(e.name) + '">'
      + art + '<div class="hv-era-shade"></div>'
      + (e.available ? '<button class="hv-era-hit" data-era-open="' + e.id + '" aria-label="' + esc(e.name) + ' 스토리 목록 보기"></button>' : '')
      + '<div class="hv-era-body"><div class="hv-era-tags"><span class="hv-tag' + (started && !done ? ' is-on' : '') + '">' + tag + '</span><span class="hv-season-tag">SEASON ' + String(e.order).padStart(2,'0') + ' · ' + esc(e.name) + '</span></div>'
      + '<h2 class="hv-era-title">눈떠보니 ' + esc(e.name) + '</h2>'
      + '<p class="hv-era-sub">' + sub + '</p>'
      + (e.available ? '<div class="hv-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="' + esc(e.name) + ' 진행률"><i style="width:' + pct + '%"></i></div>' : '')
      + '<button class="hv-era-btn" ' + action + '>' + label + '</button></div></article>';
  }

  function railHTML(current) {
    const eras = LEARNING_ERAS.slice().sort((a, b) => a.order - b.order);
    const ordered = [current].concat(eras.filter((e) => e.id !== current.id));
    return '<section class="hv-rail-wrap" aria-label="시대별 이야기">'
      + '<div class="hv-rail" role="list" tabindex="0">' + ordered.map((e) => '<div role="listitem" class="hv-rail-item">' + eraCard(e, e.id === current.id) + '</div>').join('') + '</div>'
      + '<div class="hv-rail-foot"><div class="hv-dots" aria-hidden="true">' + ordered.map((_, i) => '<i class="' + (i === 0 ? 'on' : '') + '"></i>').join('') + '</div>'
      + '<button class="hv-textbtn" data-hv-sheet="seasons">시대 전체 보기</button></div></section>';
  }

  /* practice rows: pill = action in the row, chevron = plain link */
  const row = (kind, icon, title, sub, attrs, pill) =>
    '<button class="hv-row hv-row-' + kind + '" ' + attrs + '><span class="hv-ico">' + icon + '</span>'
    + '<span class="hv-row-text"><b>' + title + '</b><small>' + sub + '</small></span>'
    + (pill ? '<span class="hv-pill">' + pill + '</span>' : '<span class="hv-chev">' + ico.chevron + '</span>') + '</button>';

  function practiceHTML() {
    const a = activeExam(), pool = wrongPool(), ox = oxState();
    let exam;
    if (a) {
      exam = row('exam', illustrations.paper, '기출문제 이어 풀기',
        esc(a.title) + ' · ' + a.answered + '/' + a.total + '문항' + (a.remaining != null ? ' · 남은 ' + (a.paused ? '시간 정지' : Math.ceil(a.remaining / 60000) + '분') : ''),
        'data-r7-exam-open', '이어 풀기');
    } else if (examHistoryCount() > 0) {
      exam = row('exam', illustrations.paper, '기출문제', '회차별·시대별 실제 기출로 실전 감각을 길러요', 'data-nav="exam-library"', '');
    } else {
      exam = row('exam', illustrations.paper, '기출문제', '실제 기출로 시험 감각을 차근차근 길러요', 'data-nav="exam-library"', '시작하기');
    }
    let oxRow;
    if (ox.kind === 'active') oxRow = row('ox', illustrations.ox, 'OX 퀴즈 이어 풀기', esc(ox.text), 'data-nav="ox"', '이어 풀기');
    else if (ox.kind === 'done') oxRow = row('ox', illustrations.ox, 'OX 퀴즈', '핵심 개념을 빠르게 확인해요', 'data-nav="ox"', '');
    else oxRow = row('ox', illustrations.ox, 'OX 퀴즈', '핵심 개념을 OX로 빠르게 확인해요', 'data-nav="ox"', 'OX 풀기');
    let wrong;
    if (pool.length) wrong = row('wrong', illustrations.review, '오답노트', '복습할 문제 ' + pool.length + '개 · 최근에 틀린 것부터', 'data-review="' + esc(pool[0]) + '"', '복습하기');
    else {
      const hadAny = (meta().wrongQuestionIds || []).length > 0;
      wrong = row('wrong', illustrations.review, '오답노트', hadAny ? '오답을 모두 복습했어요' : '틀린 문제는 여기에 모여요', 'data-nav="study"', '');
    }
    return '<section class="hv-section" aria-label="실전 학습"><div class="hv-section-head"><h2 class="hv-h">실전 학습</h2><button class="hv-textbtn" data-nav="exam-library">목록 보기</button></div><div class="hv-list">' + exam + oxRow + wrong + '</div></section>';
  }

  function metricsHTML(now = new Date()) {
    const s = studyStats(now), d = ddayState(now);
    const dday = d.kind === 'today' ? 'D-DAY' : d.kind === 'set' ? 'D-' + d.days : d.kind === 'past' ? '다시 설정' : '설정하기';
    const dateValue = d.date ? toKey(d.date) : '';
    const cell = (kind, icon, label, value, unit = '', hint = '') => '<article class="hv-metric hv-metric-' + kind + '"' + (hint ? ' title="' + hint + '"' : '') + '><span class="hv-metric-art">' + icon + '</span><small>' + label + '</small><b>' + value + (unit ? '<em>' + unit + '</em>' : '') + '</b></article>';
    const exam = '<button type="button" class="hv-metric hv-metric-exam" data-hv-exam-open title="시험일 설정 또는 변경" aria-label="시험일 ' + (dateValue ? '변경' : '설정') + '"><span class="hv-metric-art">' + illustrations.calendar + '</span><small>남은 시험일</small><b>' + dday + '</b></button>';
    return '<section class="hv-status" aria-labelledby="hv-status-title"><h2 class="hv-h" id="hv-status-title">학습 현황</h2><div class="hv-metrics">' + exam + cell('streak', illustrations.fire, '연속 학습', s.streak, '일') + cell('today', illustrations.paper, '오늘 푼 문제', s.todayCount, '문항') + cell('accuracy', illustrations.target, '최근 정답률', s.accuracy == null ? '-' : s.accuracy, s.accuracy == null ? '' : '%', '최근 완료한 문제 풀이 최대 20문항 기준') + '</div></section>';
  }

  function cheerHTML() {
    return '<section class="hv-cheer-banner" aria-label="학습 응원"><span class="hv-cheer-avatar"><img src="icons/icon-192.png" alt="" aria-hidden="true"></span><p>오늘도 화이팅! 한 장면, 한 문제씩 이어가요.</p></section>';
  }
  function weakHTML() {
    const weak=globalThis.OFFICIAL_LEARNING_ANALYSIS?.rows?.().find(row=>row.weak);
    if(!weak)return '';
    return '<section class="hv-section hv-weak-section"><div class="hv-weak-heading"><h2 class="hv-h">보완이 필요한 시대</h2><button class="hv-textbtn" data-official-weak-era="'+esc(weak.id)+'">분석 보기</button></div><button class="hv-weak-card" data-official-weak-era="'+esc(weak.id)+'"><span><b>'+weak.accuracy+'</b><small>정답률 %</small></span><span><b>'+esc(weak.name)+'</b><small>최근 오답 '+weak.wrong+'문항 · 반복 오답 '+weak.repeatedWrong+'문항</small></span><em>풀기</em></button></section>';
  }

  function calendarHTML(now = new Date()) {
    const month = calendarMonth || new Date(now.getFullYear(), now.getMonth(), 1);
    const year = month.getFullYear(), monthIndex = month.getMonth();
    const firstWeekday = new Date(year, monthIndex, 1).getDay();
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    const todayKey = toKey(now), todayNumber = localDayNumber(now);
    const days = Array.from({ length: 42 }, (_, index) => {
      const day = index - firstWeekday + 1;
      if (day < 1 || day > lastDay) return '<span class="hv-calendar-blank" aria-hidden="true"></span>';
      const date = new Date(year, monthIndex, day), key = toKey(date), past = localDayNumber(date) < todayNumber;
      const classes = ['hv-calendar-day', key === todayKey ? 'is-today' : '', key === calendarSelectedKey ? 'is-selected' : ''].filter(Boolean).join(' ');
      return '<button type="button" class="' + classes + '" data-hv-calendar-day="' + key + '" ' + (past ? 'disabled aria-disabled="true"' : '') + (key === todayKey ? ' aria-current="date"' : '') + ' aria-label="' + year + '년 ' + (monthIndex + 1) + '월 ' + day + '일">' + day + '</button>';
    }).join('');
    const selected = parseKey(calendarSelectedKey);
    const selectedText = selected ? selected.getFullYear() + '. ' + (selected.getMonth() + 1) + '. ' + selected.getDate() + '.' : '날짜를 선택해 주세요.';
    return '<div class="hv-scrim" data-hv-close="1"></div><section class="hv-sheet hv-calendar-sheet" role="dialog" aria-modal="true" aria-labelledby="hv-calendar-title">'
      + '<div class="hv-sheet-grip" aria-hidden="true"></div><div class="hv-sheet-head"><h2 id="hv-calendar-title">시험일 선택</h2><button class="hv-x" data-hv-close="1" aria-label="닫기">' + ico.close + '</button></div>'
      + '<div class="hv-calendar-month"><button type="button" data-hv-calendar-move="-1" aria-label="이전 달">‹</button><b>' + year + '년 ' + (monthIndex + 1) + '월</b><button type="button" data-hv-calendar-move="1" aria-label="다음 달">›</button></div>'
      + '<div class="hv-calendar-week" aria-hidden="true">' + ['일','월','화','수','목','금','토'].map((day) => '<span>' + day + '</span>').join('') + '</div>'
      + '<div class="hv-calendar-grid">' + days + '</div><p class="hv-calendar-selection">' + selectedText + '</p>'
      + '<div class="hv-calendar-actions"><button type="button" class="hv-calendar-cancel" data-hv-close="1">취소</button><button type="button" class="hv-calendar-save" data-hv-calendar-save ' + (selected ? '' : 'disabled') + '>설정 완료</button></div></section>';
  }

  function sheetHTML() {
    if (sheet === 'calendar') return calendarHTML();
    if (sheet !== 'seasons') return '';
    return '<div class="hv-scrim" data-hv-close="1"></div><section class="hv-sheet" role="dialog" aria-modal="true" aria-labelledby="hv-sheet-title">'
      + '<div class="hv-sheet-grip" aria-hidden="true"></div>'
      + '<div class="hv-sheet-head"><h2 id="hv-sheet-title">시대 선택</h2><button class="hv-x" data-hv-close="1" aria-label="닫기">' + ico.close + '</button></div>'
      + '<ul class="hv-seasons">' + LEARNING_ERAS.slice().sort((a, b) => a.order - b.order).map((e) => {
        const started = Boolean(seasonRun(e)?.started), pct = eraProgress(e.id);
        const right = !e.available ? '<em class="hv-soon">준비 중</em>' : started ? '<b class="hv-season-pct">' + pct + '%</b>' : '<em class="hv-new">시작 전</em>';
        return '<li><button class="hv-season" ' + (e.available ? 'data-era-open="' + e.id + '"' : 'disabled aria-disabled="true"') + '>'
          + '<span class="hv-season-text"><b>눈떠보니 ' + esc(e.name) + '</b><small>' + esc(e.years) + '</small></span>' + right + '</button></li>';
      }).join('') + '</ul></section>';
  }

  /* ---------- home() ---------- */
  home = function () {
    const e = heroEra(), now = new Date();
    return '<div class="hv">'
      + '<header class="hv-top"><h1 class="hv-brand" aria-label="눈떠보니 한국사"><span>눈떠보니</span><em>한국사</em></h1>'
      + '<button class="hv-icon-btn" data-action="status" aria-label="내 상태 보기">' + ico.user + '</button></header>'
      + railHTML(e)
      + metricsHTML(now)
      + cheerHTML()
      + practiceHTML()
      + weakHTML()
      + sheetHTML() + '</div>';
  };

  /* ---------- interactions ---------- */
  document.addEventListener('click', (ev) => {
    const examOpen = ev.target?.closest?.('[data-hv-exam-open]');
    if (examOpen) {
      ev.stopImmediatePropagation();
      const now = new Date(), saved = parseKey(meta().examTargetDate);
      const validSaved = saved && localDayNumber(saved) >= localDayNumber(now);
      calendarSelectedKey = validSaved ? toKey(saved) : null;
      const focusDate = validSaved ? saved : now;
      calendarMonth = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
      sheet = 'calendar'; render(); return;
    }
    const monthMove = ev.target?.closest?.('[data-hv-calendar-move]');
    if (monthMove && sheet === 'calendar') {
      ev.stopImmediatePropagation();
      const delta = Number(monthMove.dataset.hvCalendarMove) || 0;
      calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + delta, 1);
      render(); return;
    }
    const calendarDay = ev.target?.closest?.('[data-hv-calendar-day]');
    if (calendarDay && sheet === 'calendar' && !calendarDay.disabled) {
      ev.stopImmediatePropagation();
      calendarSelectedKey = calendarDay.dataset.hvCalendarDay;
      render(); return;
    }
    const calendarSave = ev.target?.closest?.('[data-hv-calendar-save]');
    if (calendarSave && sheet === 'calendar' && calendarSelectedKey) {
      ev.stopImmediatePropagation();
      const target = parseKey(calendarSelectedKey), now = new Date();
      if (!target || localDayNumber(target) < localDayNumber(now)) return;
      meta().examTargetDate = toKey(target); save();
      sheet = null; calendarMonth = null; calendarSelectedKey = null;
      render(); toast('시험일을 저장했어요.'); return;
    }
    const t = ev.target?.closest?.('[data-hv-sheet],[data-hv-close]');
    const d = t?.dataset || {};
    if (d.hvSheet || d.hvClose) {
      ev.stopImmediatePropagation();
      if(d.hvSheet==='seasons' && globalThis.REV7_STORY_VIEWS_READY){sheet=null;navigate('seasons');globalThis.APP_ROUTE?.push('seasons');return;}
      sheet = d.hvSheet || null;
      if (!sheet) { calendarMonth = null; calendarSelectedKey = null; }
      render(); return;
    }
    // leaving through a sheet row (data-era-open) must close the sheet; other handlers still run
    if (sheet && ev.target?.closest?.('.hv-sheet [data-era-open]')) sheet = null;
  }, true);

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && sheet) { sheet = null; render(); }
  });

  /* dots follow the rail's scroll position */
  document.addEventListener('scroll', (ev) => {
    const rail = ev.target;
    if (!rail || !rail.classList || !rail.classList.contains('hv-rail')) return;
    const items = rail.querySelectorAll('.hv-rail-item');
    if (!items.length) return;
    const step = items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : rail.clientWidth;
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
    const i = atEnd ? items.length - 1 : Math.max(0, Math.min(items.length - 1, Math.round(rail.scrollLeft / Math.max(1, step))));
    rail.parentElement.querySelectorAll('.hv-dots i').forEach((dot, k) => dot.classList.toggle('on', k === i));
  }, true);

  const renderBeforeHomeV5 = render;
  render = function () {
    if (screen !== 'home') sheet = null;
    renderBeforeHomeV5();
    document.body?.classList?.toggle?.('hv-locked', Boolean(sheet) && screen === 'home');
    if (sheet && screen === 'home') document.querySelector?.('.hv-sheet button')?.focus?.({ preventScroll: true });
  };

  globalThis.HOME_V6_API = Object.freeze({ stats: studyStats, dday: ddayState, events: learningEvents });

  render();
})();
