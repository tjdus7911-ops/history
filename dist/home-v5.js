/* Home v5 / Rev.7 — mobile-first home.
 * Loaded after every other UI layer so it only replaces home().
 * Story, scoring, exam sessions and saves are untouched: every button below
 * reuses an existing data-* action (data-era-resume, data-era-open, data-nav, data-review).
 * D-day: reads meta().examTargetDate ("YYYY-MM-DD") when the data provides it; there is no in-app date setting. */
(function () {
  'use strict';
  if (typeof document === 'undefined' || typeof window === 'undefined' || typeof setInterval !== 'function') return;
  if (typeof home !== 'function' || typeof render !== 'function' || typeof LEARNING_ERAS === 'undefined') return;

  let sheet = null; // null | 'seasons'

  const DAY = 86400000;
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const toKey = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const parseKey = (key) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key || '');
    if (!m) return null;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return Number.isNaN(d.getTime()) || d.getMonth() !== Number(m[2]) - 1 ? null : d;
  };

  /* ---------- derived state ---------- */
  function ddayState() {
    const target = parseKey(meta().examTargetDate);
    if (!target) return { kind: 'unset' };
    const days = Math.round((target - startOfDay(new Date())) / DAY);
    if (days < 0) return { kind: 'past', date: target };
    return { kind: days === 0 ? 'today' : 'set', days, date: target };
  }

  function cheerLine(d, hasActivity) {
    if (d.kind === 'today') return '오늘이 시험일이에요. 지금까지 쌓은 만큼이면 충분해요.';
    if (d.kind === 'set' && d.days <= 7) return '마지막 한 주, 기출로 감각만 지켜요.';
    if (d.kind === 'set' && d.days <= 30) return '시험이 한 달 안으로 다가왔어요. 기출로 감각을 가볍게 이어가요.';
    if (d.kind === 'set') return '차근차근, 오늘 몫만큼 쌓아가요.';
    if (d.kind === 'past') return '시험 보느라 수고했어요. 오늘도 한 문제씩 이어가요.';
    return hasActivity ? '오늘도 한 장면, 한 문제씩 이어가요.' : '오늘 한 장면이면 충분히 시작이에요.';
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

  /* ---------- Rev.7 derived numbers (all computed from saved learning events) ---------- */
  function studyStats() {
    const events = (meta().learningEvents || []).filter((e) => e && e.answeredAt);
    const days = new Set(events.map((e) => toKey(new Date(e.answeredAt))));
    const today = toKey(new Date());
    const todayCount = events.filter((e) => toKey(new Date(e.answeredAt)) === today).length;
    let streak = 0;
    const cursor = startOfDay(new Date());
    if (!days.has(toKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (days.has(toKey(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
    const recent = events.slice(-50);
    const accuracy = recent.length >= 5 ? Math.round((recent.filter((e) => e.correct).length / recent.length) * 100) : null;
    return { streak, todayCount, accuracy, any: events.length > 0 };
  }

  function examHistoryCount() {
    const r = meta().officialExamResults;
    return Array.isArray(r) ? r.length : r && typeof r === 'object' ? Object.keys(r).length : 0;
  }

  function oxState() {
    const ox = meta().ox || {};
    const a = ox.activeSession;
    if (a && Array.isArray(a.questionIds) && a.questionIds.length) {
      const idx = Math.min(a.questionIds.length, Number(a.index || 0) + 1);
      return { kind: 'active', text: 'OX 퀴즈 ' + idx + ' / ' + a.questionIds.length + '번째' };
    }
    const any = (ox.history && ox.history.length) || ox.lastSession || (ox.completedSessions && (Array.isArray(ox.completedSessions) ? ox.completedSessions.length : Number(ox.completedSessions)));
    return { kind: any ? 'done' : 'none' };
  }

  function ddayRow(d, cheerHtml) {
    const label = d.kind === 'today' ? 'D-DAY' : d.kind === 'set' ? 'D-' + d.days : '';
    const dateText = d.date ? (d.date.getMonth() + 1) + '월 ' + d.date.getDate() + '일 (' + '일월화수목금토'[d.date.getDay()] + ')' : '';
    return '<section class="hv-count" aria-label="시험 일정과 응원">'
      + (label ? '<div class="hv-count-row"><span class="hv-count-name">한능검</span><b class="hv-count-d">' + label + '</b><span class="hv-count-date">' + dateText + '</span></div>' : '')
      + '<p class="hv-cheer">' + cheerHtml + '</p></section>';
  }

  /* hero rail: one portrait card per era, ~1.5 cards visible */
  function eraCard(e, current) {
    const r = seasonRun(e), started = Boolean(r?.started), pct = e.available ? eraProgress(e.id) : 0;
    const ch = CHAPTERS[r?.currentChapter];
    const done = pct >= 100;
    const sub = !e.available ? esc(e.years) + ' · 준비 중'
      : started && ch ? 'CH.' + ch.number + ' ' + esc(ch.title) + (ch.sceneIds?.length ? ' · 장면 ' + Math.max(1, ch.sceneIds.indexOf(r.storyId) + 1) + ' / ' + ch.sceneIds.length : '') : esc(e.years);
    const tag = !e.available ? '준비 중' : started ? (done ? '완료' : '이어서 학습') : '시작하기';
    const action = !e.available ? 'disabled aria-disabled="true"' : started && !done ? 'data-r7-story-resume="' + e.id + '"' : 'data-era-open="' + e.id + '"';
    const label = !e.available ? '준비 중' : done ? '다시 보기' : started ? '이어하기' : '시작하기';
    const art = e.bannerAsset ? '<img class="hv-card-art" src="' + esc(e.bannerAsset) + '" alt="" ' + (current ? 'fetchpriority="high" ' : 'loading="lazy" ') + 'decoding="async" onerror="this.remove()">' : '';
    return '<article class="hv-era' + (e.available ? '' : ' is-soon') + (current ? ' is-current' : '') + '" style="--era-accent:' + esc(e.accent || '#169B8D') + '" aria-label="눈떠보니 ' + esc(e.name) + '">'
      + art + '<div class="hv-era-shade"></div>'
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
      + '<button class="hv-textbtn" data-hv-sheet="seasons">시대 전체</button></div></section>';
  }

  /* practice rows: pill = action in the row, chevron = plain link */
  const row = (kind, iconClass, icon, title, sub, attrs, pill) =>
    '<button class="hv-row hv-row-' + kind + '" ' + attrs + '><span class="hv-ico ' + iconClass + '">' + icon + '</span>'
    + '<span class="hv-row-text"><b>' + title + '</b><small>' + sub + '</small></span>'
    + (pill ? '<span class="hv-pill">' + pill + '</span>' : '<span class="hv-chev">' + ico.chevron + '</span>') + '</button>';

  function practiceHTML() {
    const a = activeExam(), pool = wrongPool(), ox = oxState();
    let exam;
    if (a) {
      exam = row('exam', 'coral', ico.paper, '기출문제 이어 풀기',
        esc(a.title) + ' · ' + a.answered + '/' + a.total + '문항' + (a.remaining != null ? ' · 남은 ' + (a.paused ? '시간 정지' : Math.ceil(a.remaining / 60000) + '분') : ''),
        'data-nav="exam-library"', '이어 풀기');
    } else if (examHistoryCount() > 0) {
      exam = row('exam', 'coral', ico.paper, '기출문제', '회차별·시대별 실제 기출로 실전 감각을 길러요', 'data-nav="exam-library"', '');
    } else {
      exam = row('exam', 'coral', ico.paper, '기출문제', '아직 기출 문제를 풀지 않았어요 : (', 'data-nav="exam-library"', '시작하기');
    }
    let oxRow;
    if (ox.kind === 'active') oxRow = row('ox', 'teal', ico.ox, 'OX 퀴즈 이어 풀기', esc(ox.text), 'data-nav="ox"', '이어 풀기');
    else if (ox.kind === 'done') oxRow = row('ox', 'teal', ico.ox, 'OX 퀴즈', '핵심 개념을 빠르게 확인해요', 'data-nav="ox"', '');
    else oxRow = row('ox', 'teal', ico.ox, 'OX 퀴즈', '아직 푼 OX 퀴즈가 없어요 : (', 'data-nav="ox"', 'OX 풀기');
    let wrong;
    if (pool.length) wrong = row('wrong', 'amber', ico.redo, '오답 복습', '틀린 문제 ' + pool.length + '개 · 최근에 틀린 것부터', 'data-review="' + esc(pool[0]) + '"', '');
    else {
      const hadAny = (meta().wrongQuestionIds || []).length > 0;
      wrong = '<div class="hv-row hv-row-wrong is-quiet" role="group" aria-label="오답 복습"><span class="hv-ico amber">' + ico.check + '</span><span class="hv-row-text"><b>' + (hadAny ? '오답을 모두 복습했어요' : '복습할 오답이 없어요') + '</b><small>' + (hadAny ? '새로 틀린 문제가 생기면 여기에 모여요' : '틀린 문제는 여기에 모여요') + '</small></span></div>';
    }
    return '<section class="hv-section" aria-label="실전 학습"><h2 class="hv-h">실전 학습</h2><div class="hv-list">' + exam + oxRow + wrong + '</div></section>';
  }

  function metricsHTML() {
    const s = studyStats();
    const cell = (l, v, u) => '<div class="hv-metric"><small>' + l + '</small><b>' + v + (u ? '<em>' + u + '</em>' : '') + '</b></div>';
    return '<section class="hv-metrics" aria-label="학습 현황">' + cell('연속 학습', s.streak, '일') + cell('오늘 푼 문제', s.todayCount, '문항') + cell('최근 정답률', s.accuracy == null ? '-' : s.accuracy, s.accuracy == null ? '' : '%') + '</section>';
  }
  function weakHTML() {
    const weak=globalThis.OFFICIAL_LEARNING_ANALYSIS?.rows?.().find(row=>row.weak);
    if(!weak)return '';
    return '<section class="hv-section hv-weak-section"><div class="hv-weak-heading"><h2 class="hv-h">보완이 필요한 시대</h2><button class="hv-textbtn" data-official-weak-era="'+esc(weak.id)+'">분석 보기</button></div><button class="hv-weak-card" data-official-weak-era="'+esc(weak.id)+'"><span><b>'+weak.accuracy+'</b><small>정답률 %</small></span><span><b>'+esc(weak.name)+'</b><small>최근 오답 '+weak.wrong+'문항 · 반복 오답 '+weak.repeatedWrong+'문항</small></span><em>풀기</em></button></section>';
  }

  function sheetHTML() {
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
  const WEEK = '일월화수목금토';
  home = function () {
    const e = heroEra(), d = ddayState();
    const hasActivity = Boolean(seasonRun(e)?.started) || (meta().learningEvents || []).length > 0;
    const now = new Date();
    return '<div class="hv">'
      + '<header class="hv-top"><div><p class="hv-date">' + (now.getMonth() + 1) + '월 ' + now.getDate() + '일 ' + WEEK[now.getDay()] + '요일</p><h1 class="hv-brand">눈떠보니 한국사</h1></div>'
      + '<button class="hv-icon-btn" data-action="status" aria-label="내 상태 보기">' + ico.user + '</button></header>'
      + railHTML(e)
      + ddayRow(d, cheerLine(d, hasActivity))
      + practiceHTML()
      + metricsHTML()
      + weakHTML()
      + sheetHTML() + '</div>';
  };

  /* ---------- interactions ---------- */
  document.addEventListener('click', (ev) => {
    const t = ev.target?.closest?.('[data-hv-sheet],[data-hv-close]');
    const d = t?.dataset || {};
    if (d.hvSheet || d.hvClose) {
      ev.stopImmediatePropagation();
      if(d.hvSheet==='seasons' && globalThis.REV7_STORY_VIEWS_READY){sheet=null;navigate('seasons');globalThis.APP_ROUTE?.push('seasons');return;}
      sheet = d.hvSheet || null; render(); return;
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

  render();
})();
