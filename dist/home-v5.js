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
  /* 한국사능력검정시험 공식 시행 일정(historyexam.go.kr 공고 기준). 새 일정이 공고되면 여기에 추가한다.
   * 사용자가 직접 정한 시험일이 없거나 지났으면 오늘 이후 가장 가까운 공식 시험일로 D-day를 자동 계산한다. */
  const OFFICIAL_EXAM_SCHEDULE = Object.freeze([
    { round: 77, date: '2026-02-07', levels: '기본·심화' },
    { round: 78, date: '2026-05-23', levels: '심화' },
    { round: 79, date: '2026-08-09', levels: '기본·심화' },
    { round: 80, date: '2026-10-17', levels: '심화' },
    { round: 81, date: '2026-11-28', levels: '심화' }
  ]);
  function nextOfficialExam(now = new Date()) {
    const today = localDayNumber(now);
    return OFFICIAL_EXAM_SCHEDULE.map((e) => ({ ...e, target: parseKey(e.date) })).find((e) => e.target && localDayNumber(e.target) >= today) || null;
  }
  function ddayState(now = new Date()) {
    const target = parseKey(meta().examTargetDate);
    if (target) {
      const days = localDayNumber(target) - localDayNumber(now);
      if (days >= 0) return { kind: days === 0 ? 'today' : 'set', days, date: target, custom: true };
    }
    const next = nextOfficialExam(now);
    if (!next) return target ? { kind: 'past', date: target } : { kind: 'unset' };
    const days = localDayNumber(next.target) - localDayNumber(now);
    return { kind: days === 0 ? 'today' : 'set', days, date: next.target, auto: true, round: next.round, levels: next.levels };
  }
  const ddayLabelOf = (d) => {
    if (d.kind === 'unset') return '다음 시험 일정 공고 전이에요';
    if (d.kind === 'past') return '설정한 시험일이 지났어요';
    if (d.kind === 'today') return '수험생 여러분, 시험 잘 보세요!';
    if (d.auto) return '제' + d.round + '회 한능검(' + (d.date.getMonth() + 1) + '.' + d.date.getDate() + ')까지';
    return '한능검 시험일까지';
  };

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
    scroll: '<svg class="hv-mini-art" viewBox="0 0 24 24" aria-hidden="true"><path class="icon-line" d="M7 4.5h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a3 3 0 0 1 0-6h10"/><path class="icon-line" d="M7 4.5a3 3 0 0 0 0 6h10v4H7a3 3 0 0 0 0 6"/><path class="icon-accent" d="m15.5 9 1.5 1.5 3-3"/></svg>',
    calendar: '<svg class="hv-mini-art" viewBox="0 0 24 24" aria-hidden="true"><rect class="icon-line" x="3.5" y="5.5" width="17" height="15" rx="3"/><path class="icon-accent" d="M7.5 3.5v4m9-4v4M3.5 9.5h17"/><path class="icon-line" d="m8.5 15 2 2 5-5"/></svg>',
    fire: '<svg class="hv-mini-art" viewBox="0 0 24 24" aria-hidden="true"><path class="icon-line" d="M13.2 2.8c.4 3-2.2 4.3-1.2 7.1 1.7-.6 2.8-2.1 3.2-4 3.4 3.1 4.8 6 3.8 9.4a7.2 7.2 0 0 1-13.8-1.1c-.6-3.3 1-6.3 3.5-8.5-.3 2.7.7 4.3 2 5.1"/><path class="icon-accent" d="M12 19.8c-2.3-.5-3.2-2.8-1.7-4.7.2 1.1 1.2 1.6 1.8 1.7-.2-1.8 1.6-2.5 1.6-4.1 2.1 2.1 1.9 5.8-1.7 7.1Z"/></svg>',
    paper: '<svg class="hv-mini-art" viewBox="0 0 24 24" aria-hidden="true"><path class="icon-line" d="M6 3.5h8.5l3.5 3.6v13.4H6Z"/><path class="icon-line" d="M14.5 3.5v4H18M9 11.5h6m-6 3.5h4"/><path class="icon-accent" d="m14.8 18 1.5 1.5 3.2-3.5"/></svg>',
    target: '<svg class="hv-mini-art" viewBox="0 0 24 24" aria-hidden="true"><circle class="icon-line" cx="10.5" cy="13.5" r="7"/><circle class="icon-line" cx="10.5" cy="13.5" r="3"/><path class="icon-accent" d="m10.5 13.5 8-8m-3 0h3v3"/></svg>',
    ox: '<svg class="hv-mini-art" viewBox="0 0 24 24" aria-hidden="true"><circle class="icon-line" cx="7.5" cy="12" r="4.5"/><path class="icon-accent" d="m14.5 7.5 6 9m0-9-6 9"/></svg>',
    review: '<svg class="hv-mini-art" viewBox="0 0 24 24" aria-hidden="true"><path class="icon-line" d="M7 3.5h11v16H9.5A2.5 2.5 0 0 0 7 22Z"/><path class="icon-line" d="M10 8h5m-5 3h4"/><path class="icon-accent" d="M4 13.5a5.5 5.5 0 0 0 5.5 5.5M4 13.5v3.2m0-3.2h3.2"/></svg>'
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

  function examPassRate() {
    const raw = meta().officialExamResults;
    const records = Array.isArray(raw) ? raw : raw && typeof raw === 'object' ? Object.values(raw) : [];
    const certify = globalThis.OFFICIAL_CERTIFICATION;
    if (typeof certify !== 'function') return null;
    const official = records.filter((record) => record && record.mode !== 'learn'
      && record.examRound != null && Number.isFinite(Number(record.examRound))
      && ['심화', '기본'].includes(record.examLevel));
    const outcomes = official.map((record) => {
      const stored = record.summary || {};
      const summary = {
        score: stored.score ?? record.score,
        maxScore: stored.maxScore ?? record.maxScore
      };
      return certify(summary, record.examLevel, true);
    }).filter((result) => result?.eligible);
    return outcomes.length ? Math.round(outcomes.filter((result) => result.passed).length / outcomes.length * 100) : null;
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
    const tag = !e.available ? '준비 중' : started ? (done ? '완료' : '이어서 학습') : '시작 전';
    const action = !e.available ? 'disabled aria-disabled="true"' : started && !done ? 'data-r7-story-resume="' + e.id + '"' : 'data-era-open="' + e.id + '"';
    const label = !e.available ? '준비 중' : done ? '다시 보기' : started ? '이어서 보기' : '시작하기';
    const art = e.bannerAsset ? '<img class="hv-card-art" src="' + esc(e.bannerAsset) + '" alt="" ' + (current ? 'fetchpriority="high" ' : 'loading="lazy" ') + 'decoding="async" onerror="this.remove()">' : '';
    /* Rev.8: one readable season label (ink 55%), progress row only once the era is started. */
    return '<article class="hv-era' + (e.available ? '' : ' is-soon') + (current ? ' is-current' : '') + (started ? ' is-started' : '') + '" style="--era-accent:' + esc(e.accent || '#169B8D') + '" aria-label="눈떠보니 ' + esc(e.name) + ' · ' + tag + '">'
      + art + '<div class="hv-era-shade"></div>'
      + (e.available ? '<button class="hv-era-hit" data-era-open="' + e.id + '" aria-label="' + esc(e.name) + ' 스토리 목록 보기"></button>' : '')
      + '<div class="hv-era-body"><div class="hv-era-tags"><span class="hv-season-tag">SEASON ' + String(e.order).padStart(2,'0') + ' · ' + esc(e.name) + '</span></div>'
      + '<h2 class="hv-era-title">눈떠보니 ' + esc(e.name) + '</h2>'
      + '<p class="hv-era-sub">' + sub + '</p>'
      + (e.available && started ? '<div class="hv-progress-row"><div class="hv-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="' + esc(e.name) + ' 진행률"><i style="width:' + pct + '%"></i></div><span class="hv-progress-label">' + pct + '%</span></div>' : '')
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

  /* Shortcut cards keep the established full-card routes and use one shared layout. */
  const row = (kind, icon, title, sub, attrs) =>
    '<button type="button" class="hv-shortcut hv-shortcut-' + kind + '" ' + attrs + '><span class="hv-ico">' + icon + '</span>'
    + '<span class="hv-shortcut-copy"><b>' + title + '</b><small>' + sub + '</small></span></button>';

  function practiceHTML(currentEra) {
    const a = activeExam(), pool = wrongPool(), ox = oxState();
    const storyStarted = Boolean(seasonRun(currentEra)?.started);
    /* Rev.8 approved change: 2×2 large cards → one compact 1×4 row; every route is unchanged. */
    const exam = row('exam', illustrations.paper, '기출문제', '실전 대비', a ? 'data-r7-exam-open' : 'data-nav="exam-library"');
    const oxRow = row('ox', illustrations.ox, 'OX 퀴즈', '개념 점검', 'data-nav="ox"');
    const wrong = row('wrong', illustrations.review, '오답노트', pool.length ? '틀린 문제 ' + pool.length + '개' : '틀린 문제', 'data-nav="study"');
    const storyAction = storyStarted ? 'data-r7-story-resume="' + esc(currentEra.id) + '"' : 'data-era-open="' + esc(currentEra.id) + '"';
    const story = row('story', illustrations.scroll, '스토리', '시대별 이야기', storyAction);
    return '<section class="hv-section hv-shortcuts-section" aria-label="실전 학습"><div class="hv-section-head"><h2 class="hv-h">학습 바로가기</h2></div><div class="hv-shortcuts">'
      + story + exam + oxRow + wrong + '</div></section>';
  }

  function jokboPromoHTML() {
    const bookArt = '<svg class="hv-jokbo-art" viewBox="0 0 132 92" role="img" aria-label="색색의 책이 쌓인 그림">'
      + '<path d="m12 69 75-7 32 10-76 10z" fill="#e9a24d" stroke="#a95d36" stroke-width="2"/>'
      + '<path d="m12 69 1 9 30 10 76-8v-8l-76 8z" fill="#fff1d7" stroke="#a95d36" stroke-width="2"/>'
      + '<path d="m25 57 70-8 24 8-72 9z" fill="#4b9a9a" stroke="#2d7279" stroke-width="2"/>'
      + '<path d="m25 57 1 8 21 8 72-7v-9l-72 8z" fill="#d8eee8" stroke="#2d7279" stroke-width="2"/>'
      + '<path d="m39 43 58-7 24 8-60 8z" fill="#6e9c68" stroke="#4d714b" stroke-width="2"/>'
      + '<path d="m39 43 1 8 21 8 60-7v-8l-60 8z" fill="#f0e9c9" stroke="#4d714b" stroke-width="2"/>'
      + '<path d="m47 29 49-8 26 8-52 9z" fill="#ed6443" stroke="#ad4835" stroke-width="2"/>'
      + '<path d="m47 29 1 8 22 8 52-8v-8l-52 8z" fill="#ffdfbe" stroke="#ad4835" stroke-width="2"/>'
      + '<path d="m63 35 1 7m20-10 1 7m-56 25 1 7m20-10 1 7" stroke="#fff8eb" stroke-width="2" stroke-linecap="round"/>'
      + '<path d="m20 31 2 5 5 1-5 2-2 5-2-5-5-2 5-1zM111 15l2 4 4 1-4 2-2 4-2-4-4-2 4-1z" fill="#e98b42"/>'
      + '</svg>';
    return '<button type="button" class="hv-jokbo-banner" data-jk-open aria-label="족보 열기: 헷갈리는 개념은 족보로 한 번에 정리">'
      + '<span class="hv-jokbo-illustration">' + bookArt + '</span>'
      + '<span class="hv-jokbo-copy"><strong>헷갈리는 개념은 족보로 한 번에</strong><b>시대별 한 장 정리 · 키워드 저장</b></span>'
      + '<span class="hv-jokbo-arrow" aria-hidden="true">' + ico.chevron + '</span></button>';
  }

  /* Rev.8 approved change: the mascot cheer card moves into the mission card header. */
  function freshLearner() {
    const anyStory = LEARNING_ERAS.some((e) => e.available && seasonRun(e)?.started);
    return !anyStory && !studyStats().any && !examHistoryCount();
  }

  function metricsHTML(now = new Date()) {
    const s = studyStats(now), d = ddayState(now), passRate = examPassRate();
    const dday = d.kind === 'today' ? 'D-DAY' : d.kind === 'set' ? 'D-' + d.days : d.kind === 'past' ? '다시 설정' : '설정하기';
    const dateValue = d.date ? toKey(d.date) : '';
    /* Rev.8 approved change: D-day gets its own top row; the four metrics share one row in the same card.
     * Every metric (streak, today, accuracy, real-exam pass rate) is kept. */
    const cell = (kind, label, value, unit = '', hint = '') => '<article class="hv-metric hv-metric-' + kind + '"' + (hint ? ' title="' + hint + '"' : '') + '><small>' + label + '</small><b>' + value + (unit ? '<em>' + unit + '</em>' : '') + '</b></article>';
    const ddayLabel = ddayLabelOf(d);
    const ddayValue = d.kind === 'unset' ? '직접 정해 보세요' : d.kind === 'past' ? '다시 설정해 주세요' : dday;
    const ddayAction = d.kind === 'set' || d.kind === 'today' ? '시험일 변경' : '설정하기';
    const exam = '<div class="hv-dday hv-metric-exam' + (d.kind === 'set' || d.kind === 'today' ? ' is-set' : '') + (d.kind === 'today' ? ' is-today' : '') + '"><span class="hv-dday-art">' + illustrations.calendar + '</span>'
      + '<span class="hv-dday-copy"><small>' + ddayLabel + '</small><b>' + ddayValue + '</b></span>'
      + '<button type="button" class="hv-dday-action" data-hv-exam-open title="시험일 설정 또는 변경" aria-label="시험일 ' + (dateValue ? '변경' : '설정') + ' · 남은 시험일 ' + dday + '">' + ddayAction + '</button></div>';
    const metrics = '<div class="hv-metrics">' + cell('streak', '연속 학습', s.streak, '일') + cell('today', '오늘 푼 문제', s.todayCount, '문항')
      + cell('accuracy', '최근 정답률', s.accuracy == null ? '—' : s.accuracy, '%', '최근 완료한 문제 풀이 최대 20문항 기준')
      + cell('pass', '합격률', passRate == null ? '—' : passRate, '%', '실전 합격률 · 완료한 공식 회차 시험에서 기존 합격 기준으로 계산') + '</div>';
    return '<section class="hv-status" aria-labelledby="hv-status-title"><h2 class="hv-h" id="hv-status-title">학습 현황</h2><div class="hv-status-card">' + exam + '<hr class="hv-divider">' + metrics + '</div></section>';
  }

  /* Fix pass: the 학습 현황 section is removed from home; only the exam D-day moves into the goal card.
   * Statistics data is untouched (still used by 내 기록 and HOME_V6_API). */
  function ddayHTML(now = new Date()) {
    const d = ddayState(now), dday = d.kind === 'today' ? 'D-DAY' : d.kind === 'set' ? 'D-' + d.days : d.kind === 'past' ? '다시 설정' : '설정하기';
    const label = ddayLabelOf(d);
    const value = d.kind === 'unset' ? '직접 정해 보세요' : d.kind === 'past' ? '다시 설정해 주세요' : dday;
    const set = d.kind === 'set' || d.kind === 'today';
    return '<div class="hv-dday hv-metric-exam' + (set ? ' is-set' : '') + (d.kind === 'today' ? ' is-today' : '') + '"><span class="hv-dday-art">' + illustrations.calendar + '</span>'
      + '<span class="hv-dday-copy"><small>' + label + '</small><b>' + value + '</b></span>'
      + '<button type="button" class="hv-dday-action" data-hv-exam-open title="시험일 설정 또는 변경" aria-label="시험일 ' + (d.date ? '변경' : '설정') + ' · 남은 시험일 ' + dday + '">' + (set ? '시험일 변경' : '설정하기') + '</button></div>';
  }

  function cheerHTML() {
    return '<section class="hv-cheer-banner" aria-label="학습 응원"><p>오늘도 화이팅! 한 장면, 한 문제씩 이어가요.</p><span class="hv-cheer-avatar"><img src="icons/mascot-192.png" alt="" aria-hidden="true"></span></section>';
  }
  function weakHTML() {
    const weak=globalThis.OFFICIAL_LEARNING_ANALYSIS?.rows?.().find(row=>row.weak);
    if(!weak)return '';
    return '<section class="hv-section hv-weak-section"><div class="hv-weak-heading"><h2 class="hv-h">보완이 필요한 시대</h2><button class="hv-textbtn" data-weak-open="'+esc(weak.id)+'">분석 보기</button></div><button class="hv-weak-card" data-official-weak-era="'+esc(weak.id)+'"><span><b>'+weak.accuracy+'</b><small>정답률 %</small></span><span><b>'+esc(weak.name)+'</b><small>최근 오답 '+weak.wrong+'문항 · 반복 오답 '+weak.repeatedWrong+'문항</small></span><em>풀기</em></button></section>';
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
      + '<header class="hv-top"><h1 class="hv-brand" aria-label="눈떠보니 한국사"><i class="hv-brand-mark">' + illustrations.scroll + '</i><span>눈떠보니</span><em>한국사</em></h1>'
      + '</header>'
      + railHTML(e)
      + practiceHTML(e)
      + (globalThis.LEARNING_MISSIONS?.cardHTML?.(now, { fresh: freshLearner(), mascot: 'icons/mascot-192.png', ddayHTML: ddayHTML(now) }) || '<section class="hv-status">' + ddayHTML(now) + '</section>' + cheerHTML())
      + jokboPromoHTML()
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

  globalThis.HOME_V6_API = Object.freeze({ stats: studyStats, dday: ddayState, examSchedule: () => OFFICIAL_EXAM_SCHEDULE.slice(), nextExam: nextOfficialExam, events: learningEvents, passRate: examPassRate });

  render();
})();
