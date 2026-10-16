/* Home v5 — mobile-first home.
 * Loaded after every other UI layer so it only replaces home().
 * Story, scoring, exam sessions and saves are untouched: every button below
 * reuses an existing data-* action (data-era-resume, data-era-open, data-nav, data-review).
 * New persisted field: meta().examTargetDate ("YYYY-MM-DD"), set by the user. */
(function () {
  'use strict';
  if (typeof document === 'undefined' || typeof window === 'undefined' || typeof setInterval !== 'function') return;
  if (typeof home !== 'function' || typeof render !== 'function' || typeof LEARNING_ERAS === 'undefined') return;

  let sheet = null; // null | 'dday' | 'seasons'

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
    if (d.kind === 'today') return '오늘이 시험일이에요.<br>지금까지 쌓은 만큼이면 충분해요.';
    if (d.kind === 'set' && d.days <= 7) return '마지막 한 주,<br>기출로 감각만 지켜요.';
    if (d.kind === 'set' && d.days <= 30) return '시험이 한 달 안으로 다가왔어요.<br>기출로 감각을 가볍게 이어가요.';
    if (d.kind === 'set') return '차근차근,<br>오늘 몫만큼 쌓아가요.';
    if (d.kind === 'past') return '시험 보느라 수고했어요.<br>다음 시험일을 정해 볼까요?';
    return hasActivity ? '오늘도 한 장면,<br>한 문제씩 이어가요.' : '오늘 한 장면이면<br>충분히 시작이에요.';
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
    cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>',
    paper: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h8l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7 3.5Z"/><path d="M14.5 3.5V8H19M9.5 12.5h6M9.5 16h4"/></svg>',
    redo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5"/><path d="M4 4v4.5h4.5"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    swap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h13l-3-3M19 16H6l3 3"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  };

  function ddayChip(d) {
    if (d.kind === 'set') return '<button class="hv-chip hv-chip-dday" data-hv-sheet="dday" aria-label="시험일 변경, ' + (d.date.getMonth() + 1) + '월 ' + d.date.getDate() + '일, ' + d.days + '일 남음">' + ico.cal + '<b>D-' + d.days + '</b></button>';
    if (d.kind === 'today') return '<button class="hv-chip hv-chip-dday today" data-hv-sheet="dday" aria-label="시험일 변경">' + ico.cal + '<b>D-DAY</b></button>';
    return '<button class="hv-chip hv-chip-ghost" data-hv-sheet="dday" aria-label="시험일 설정">' + ico.cal + '<span>' + (d.kind === 'past' ? '시험일 다시 설정' : '시험일 설정') + '</span></button>';
  }

  function heroHTML(e) {
    const r = seasonRun(e), started = Boolean(r?.started), pct = eraProgress(e.id);
    const ch = CHAPTERS[r?.currentChapter];
    const scene = STORIES[r?.pending?.sourceSceneId || r?.storyId];
    const done = pct >= 100;
    const where = started && ch ? 'CH.' + ch.number + ' ' + esc(ch.title) + (scene?.title ? ' · ' + esc(scene.title) : '') : '';
    const action = started && !done ? 'data-era-resume="' + e.id + '"' : 'data-era-open="' + e.id + '"';
    const label = done ? '챕터 다시 보기' : started ? '이어하기' : '이야기 시작하기';
    const art = e.bannerAsset ? '<img class="hv-hero-art" src="' + esc(e.bannerAsset) + '" alt="" fetchpriority="high" decoding="async">' : '';
    return '<section class="hv-hero" style="--era-accent:' + esc(e.accent || '#3450e4') + '" aria-label="' + esc(e.title) + '">'
      + art + '<div class="hv-hero-shade"></div>'
      + '<div class="hv-hero-top"><span class="hv-tag">' + (started ? (done ? '완료' : '진행 중') : '새 이야기') + '</span>'
      + '<button class="hv-glass" data-hv-sheet="seasons" aria-label="시대 바꾸기">' + ico.swap + '<span>시대 바꾸기</span></button></div>'
      + '<div class="hv-hero-body"><p class="hv-years">' + esc(e.years) + '</p>'
      + '<h2 class="hv-title"><span>눈떠보니</span> ' + esc(e.name) + '</h2>'
      + (started
        ? (where ? '<p class="hv-where">' + where + '</p>' : '')
          + '<div class="hv-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="' + esc(e.name) + ' 진행률"><i style="width:' + pct + '%"></i></div><p class="hv-pct">전체 ' + pct + '% 진행</p>'
        : '<p class="hv-where hv-desc">' + esc(e.description) + '</p>')
      + '<div class="hv-actions"><button class="hv-btn hv-btn-primary" ' + action + '>' + label + '</button>'
      + (started ? '<button class="hv-btn hv-btn-glass" data-era-open="' + e.id + '">챕터</button>' : '')
      + '</div></div></section>';
  }

  function examHTML() {
    const a = activeExam();
    if (a) {
      const pct = Math.round((a.answered / a.total) * 100);
      return '<section class="hv-card hv-exam is-active" aria-label="진행 중인 시험">'
        + '<div class="hv-card-head"><span class="hv-icon blue">' + ico.paper + '</span><div class="hv-card-text">'
        + '<p class="hv-eyebrow">시험 이어하기</p><h3>' + esc(a.title) + '</h3></div></div>'
        + '<p class="hv-meta">' + a.answered + ' / ' + a.total + '문항 답변'
        + (a.remaining != null ? ' · 남은 시간 ' + clock(a.remaining) + (a.paused ? ' (일시정지)' : '') : '') + '</p>'
        + '<div class="hv-progress slim" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="시험 답변 진행률"><i style="width:' + pct + '%"></i></div>'
        + '<button class="hv-btn hv-btn-tonal" data-nav="exam-library">이어서 풀기</button></section>';
    }
    return '<button class="hv-card hv-row" data-nav="exam-library"><span class="hv-icon blue">' + ico.paper + '</span>'
      + '<span class="hv-card-text"><h3>기출문제 풀기</h3><small>회차별·시대별 실제 기출로 실전 감각을 길러요</small></span>'
      + '<span class="hv-chev">' + ico.chevron + '</span></button>';
  }

  function reviewHTML() {
    const pool = wrongPool();
    if (pool.length) {
      return '<button class="hv-card hv-row" data-review="' + esc(pool[0]) + '"><span class="hv-icon rose">' + ico.redo + '</span>'
        + '<span class="hv-card-text"><h3>오답 복습</h3><small>틀린 문제 ' + pool.length + '개 · 최근에 틀린 것부터</small></span>'
        + '<span class="hv-chev">' + ico.chevron + '</span></button>';
    }
    const hadAny = (meta().wrongQuestionIds || []).length > 0;
    return '<section class="hv-card hv-row is-quiet" aria-label="오답 복습"><span class="hv-icon mint">' + ico.check + '</span>'
      + '<span class="hv-card-text"><h3>' + (hadAny ? '오답을 모두 복습했어요' : '복습할 오답이 없어요') + '</h3>'
      + '<small>' + (hadAny ? '새로 틀린 문제가 생기면 여기에 모여요' : '기출을 풀다 틀린 문제는 여기에 모여요') + '</small></span></section>';
  }

  function sheetHTML(d) {
    if (sheet === 'dday') {
      const today = toKey(new Date()), cur = d.kind === 'set' || d.kind === 'today' ? meta().examTargetDate : '';
      return '<div class="hv-scrim" data-hv-close="1"></div><section class="hv-sheet" role="dialog" aria-modal="true" aria-labelledby="hv-sheet-title">'
        + '<div class="hv-sheet-grip" aria-hidden="true"></div>'
        + '<div class="hv-sheet-head"><h2 id="hv-sheet-title">시험일 설정</h2><button class="hv-x" data-hv-close="1" aria-label="닫기">' + ico.close + '</button></div>'
        + '<p class="hv-sheet-desc">공식 시험 공고에서 확인한 응시 예정일을 입력해 주세요. 입력한 날짜는 이 기기에만 저장돼요.</p>'
        + '<label class="hv-field"><span>응시 예정일</span><input type="date" id="hv-dday-input" min="' + today + '" value="' + esc(cur) + '"></label>'
        + '<button class="hv-btn hv-btn-primary hv-full" data-hv-save-dday="1">저장</button>'
        + (cur ? '<button class="hv-btn hv-btn-text hv-full" data-hv-clear-dday="1">시험일 삭제</button>' : '')
        + '</section>';
    }
    if (sheet === 'seasons') {
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
    return '';
  }

  /* ---------- home() ---------- */
  home = function () {
    const e = heroEra(), d = ddayState();
    const hasActivity = Boolean(seasonRun(e)?.started) || (meta().learningEvents || []).length > 0;
    return '<div class="hv">'
      + '<header class="hv-top"><div class="hv-top-row"><span class="hv-brand">눈떠보니 한국사</span>'
      + '<div class="hv-top-actions">' + ddayChip(d)
      + '<button class="hv-icon-btn" data-action="status" aria-label="내 상태 보기">' + ico.user + '</button></div></div>'
      + '<h1 class="hv-cheer">' + cheerLine(d, hasActivity) + '</h1></header>'
      + heroHTML(e)
      + '<div class="hv-stack">' + examHTML() + reviewHTML() + '</div>'
      + sheetHTML(d) + '</div>';
  };

  /* ---------- interactions ---------- */
  document.addEventListener('click', (ev) => {
    const t = ev.target?.closest?.('[data-hv-sheet],[data-hv-close],[data-hv-save-dday],[data-hv-clear-dday]');
    const d = t?.dataset || {};
    if (d.hvSheet || d.hvClose || d.hvSaveDday || d.hvClearDday) {
      ev.stopImmediatePropagation();
      if (d.hvSheet) { sheet = d.hvSheet; render(); return; }
      if (d.hvClose) { sheet = null; render(); return; }
      if (d.hvSaveDday) {
        const input = document.getElementById('hv-dday-input');
        const day = parseKey(input?.value);
        if (!day) { input?.focus(); return; }
        if (day < startOfDay(new Date())) { toast('오늘 이후 날짜를 선택해 주세요.'); return; }
        meta().examTargetDate = toKey(day);
        save(); sheet = null; render(); return;
      }
      delete meta().examTargetDate; save(); sheet = null; render(); return;
    }
    // leaving through a sheet row (data-era-open) must close the sheet; other handlers still run
    if (sheet && ev.target?.closest?.('.hv-sheet [data-era-open]')) sheet = null;
  }, true);

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && sheet) { sheet = null; render(); }
  });

  const renderBeforeHomeV5 = render;
  render = function () {
    if (screen !== 'home') sheet = null;
    renderBeforeHomeV5();
    document.body?.classList?.toggle?.('hv-locked', Boolean(sheet) && screen === 'home');
    if (sheet && screen === 'home') document.querySelector?.('.hv-sheet input, .hv-sheet button')?.focus?.({ preventScroll: true });
  };

  // The countdown only ticks while the home is visible with a running timed exam.
  let ticker = null;
  const stopTicker = () => { if (ticker !== null) { clearInterval(ticker); ticker = null; } };
  function syncTicker() {
    const a = screen === 'home' && !sheet ? activeExam() : null;
    if (!a || a.remaining == null || a.paused || meta().officialExamActiveSession?.timerState !== 'RUNNING') { stopTicker(); return; }
    if (ticker !== null) return;
    ticker = setInterval(() => {
      const cur = screen === 'home' && !sheet ? activeExam() : null;
      if (!cur || cur.remaining == null) { stopTicker(); return; }
      const m = document.querySelector?.('.hv-exam .hv-meta');
      if (m) m.textContent = cur.answered + ' / ' + cur.total + '문항 답변 · 남은 시간 ' + clock(cur.remaining);
    }, 1000);
  }
  const renderWithTicker = render;
  render = function () { renderWithTicker(); syncTicker(); };

  render();
})();
