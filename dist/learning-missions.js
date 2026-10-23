(function () {
  'use strict';
  if (typeof document === 'undefined' || typeof meta !== 'function' || typeof renderContent !== 'function') return;

  const STORAGE_KEY = 'history-learning-missions-v1';
  const SETTINGS_ROUTE = 'missions/settings';
  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;
  const definitions = [
    { id: 'exam', title: '기출문제 풀기', description: '시험을 제출하면 완료 횟수에 반영돼요.', unit: '회', targets: [1, 2, 3], defaultTarget: 1, icon: 'exam', route: 'exam-library' },
    { id: 'story', title: '스토리 챕터 보기', description: '챕터 마지막 장면을 마치면 완료돼요.', unit: '개', targets: [1, 2, 3], defaultTarget: 1, icon: 'story', route: 'seasons' },
    { id: 'ox', title: 'OX 퀴즈 풀기', description: '정답과 오답 모두 실제 답변으로 집계해요.', unit: '문제', targets: [5, 10, 20, 30], defaultTarget: 10, icon: 'ox', route: 'ox' },
    { id: 'jokbo', title: '족보 키워드 살펴보기', description: '키워드 상세 내용을 열면 한 개로 집계돼요.', unit: '개', targets: [3, 5, 10], defaultTarget: 5, icon: 'jokbo', route: 'jokbo' },
  ];
  const byId = new Map(definitions.map((item) => [item.id, item]));
  const kstFormatter = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' });
  const localFormatter = new Intl.DateTimeFormat('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });

  function defaultSettings() {
    return Object.fromEntries(definitions.map((item) => [item.id, { enabled: true, target: item.defaultTarget }]));
  }

  function normalizeSettings(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    return Object.fromEntries(definitions.map((item) => {
      const value = source[item.id] && typeof source[item.id] === 'object' ? source[item.id] : {};
      const target = item.targets.includes(Number(value.target)) ? Number(value.target) : item.defaultTarget;
      return [item.id, { enabled: value.enabled !== false, target }];
    }));
  }

  function normalizeVisits(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
    const result = {};
    for (const [day, ids] of Object.entries(raw)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !Array.isArray(ids)) continue;
      result[day] = [...new Set(ids.filter((id) => typeof id === 'string' && id.length > 0))];
    }
    return result;
  }

  function readStore() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return {
        version: 1,
        settings: normalizeSettings(raw?.settings),
        keywordVisits: normalizeVisits(raw?.keywordVisits),
      };
    } catch {
      return { version: 1, settings: defaultSettings(), keywordVisits: {} };
    }
  }

  let store = readStore();
  let draft = null;
  let settingsOpen = false;
  let expanded = false;

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      return true;
    } catch {
      if (typeof toast === 'function') toast('학습 미션 설정을 저장하지 못했어요. 저장 공간을 확인해 주세요.');
      return false;
    }
  }

  function dayKey(input = new Date()) {
    const date = input instanceof Date ? input : new Date(input);
    if (!Number.isFinite(date.getTime())) return null;
    try { return kstFormatter.format(date); }
    catch { return localFormatter.format(date); }
  }

  function eventDay(value, now) {
    const timestamp = Date.parse(value || '');
    if (!Number.isFinite(timestamp) || timestamp > now.getTime()) return null;
    return dayKey(new Date(timestamp));
  }

  function flattenRecords(value) {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') return Object.values(value).flatMap((item) => Array.isArray(item) ? item : item && typeof item === 'object' ? [item] : []);
    return [];
  }

  function examCount(today, now) {
    const seen = new Set();
    for (const result of flattenRecords(meta().officialExamResults)) {
      if (result?.mode && result.mode !== 'exam') continue;
      if (eventDay(result?.completedAt, now) !== today) continue;
      const identity = result.attemptId || [result.completedAt, result.examRound || '', result.examLevel || '', (result.questionIds || []).join(',')].join('|');
      if (identity) seen.add(String(identity));
    }
    return seen.size;
  }

  function storyCount(today, now) {
    const completed = new Set();
    const add = (chapterId, record) => {
      const completedAt = record?.completedAt || record?.latestRun?.completedAt || record?.finalRun?.completedAt;
      if (chapterId && eventDay(completedAt, now) === today) completed.add(String(chapterId));
    };
    for (const [chapterId, rows] of Object.entries(meta().chapterRuns || {})) {
      for (const record of Array.isArray(rows) ? rows : []) add(chapterId, record);
    }
    for (const [chapterId, record] of Object.entries(meta().chapterRecords || {})) add(chapterId, record);
    return completed.size;
  }

  function oxCount(today, now) {
    const model = meta().oxQuiz || {};
    const completedQuestions = new Set();
    for (const event of Array.isArray(model.history) ? model.history : []) {
      if (eventDay(event?.answeredAt, now) !== today || !event?.questionId) continue;
      completedQuestions.add(String(event.questionId));
    }
    return completedQuestions.size;
  }

  function snapshot(now = new Date()) {
    const date = now instanceof Date ? now : new Date(now);
    const today = dayKey(date);
    const counts = {
      exam: examCount(today, date),
      story: storyCount(today, date),
      ox: oxCount(today, date),
      jokbo: (store.keywordVisits[today] || []).length,
    };
    const missions = definitions.map((definition) => {
      const setting = store.settings[definition.id];
      const progress = counts[definition.id];
      return { ...definition, ...setting, progress, completed: setting.enabled && progress >= setting.target };
    });
    const selected = missions.filter((mission) => mission.enabled);
    const completed = selected.filter((mission) => mission.completed).length;
    return { date: today, counts, missions, selected, completed, total: selected.length, percent: selected.length ? Math.round(completed / selected.length * 100) : 0, allComplete: selected.length > 0 && completed === selected.length };
  }

  function recordJokboKeyword(keywordId, now = new Date()) {
    const id = String(keywordId || '').trim(), today = dayKey(now);
    if (!id || !today) return false;
    const ids = store.keywordVisits[today] || (store.keywordVisits[today] = []);
    if (ids.includes(id)) return false;
    ids.push(id);
    persist();
    return true;
  }

  function saveSettings(next) {
    store.settings = normalizeSettings(next);
    return persist();
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  const icons = {
    exam: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h8l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7 3.5Z"/><path d="M14.5 3.5V8H19M9 12h6m-6 3.5h4"/><path class="lm-accent" d="m14.5 18 1.5 1.5 3-3"/></svg>',
    story: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 5.5h5a3 3 0 0 1 3 3v11a3 3 0 0 0-3-3h-5zM19.5 5.5h-5a3 3 0 0 0-3 3v11a3 3 0 0 1 3-3h5z"/><path class="lm-accent" d="M7 9h2m6 0h2"/></svg>',
    ox: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="4"/><path d="m14 14 6 6m0-6-6 6"/></svg>',
    jokbo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h11A1.5 1.5 0 0 1 18.5 5v16H7a3 3 0 0 1 0-6h11.5M8 3.5V15m3-7h4m-4 3h4"/><path class="lm-accent" d="M8.5 18h7"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  };

  function statusIcon(mission) {
    return mission.completed
      ? '<span class="lm-status lm-status-done" aria-label="완료">' + icons.check + '</span>'
      : '<span class="lm-status lm-status-pending" aria-label="미완료"><i></i></span>';
  }

  function progressLabel(mission) {
    return Math.min(mission.progress, mission.target) + ' / ' + mission.target + mission.unit;
  }

  /* Rev.8 checklist row: status circle on the left, progress as the caption, "완료" or "하러 가기" on the right. */
  function missionRow(mission) {
    return '<button type="button" class="lm-row' + (mission.completed ? ' is-complete' : '') + '" data-mission-go="' + mission.id + '">'
      + statusIcon(mission)
      + '<span class="lm-row-copy"><strong>' + escapeHtml(mission.title) + '</strong><small>' + escapeHtml(progressLabel(mission)) + '</small></span>'
      + (mission.completed
        ? '<span class="lm-row-action is-done">완료</span>'
        : '<span class="lm-row-action">하러 가기<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></span>')
      + '</button>';
  }

  /* options.mascot: image shown in the card header (Rev.8 merges the home cheer card here).
   * options.fresh: true when the learner has no study history yet. */
  function cardHTML(now = new Date(), options = {}) {
    const model = snapshot(now), shown = expanded ? model.selected : model.selected.slice(0, 2);
    const headline = model.allComplete ? '오늘의 목표 달성!'
      : options.fresh ? '첫 이야기를 시작해 볼까요?' : '오늘도 한 장면, 한 문제씩!';
    const caption = model.allComplete ? '정말 잘했어요. 내일도 함께 이어가요.'
      : options.fresh ? '오늘의 미션 ' + model.total + '개 · 하루 15분이면 충분해요'
      : model.total + '개 중 ' + model.completed + '개 완료 · ' + (model.completed ? '조금만 더 하면 끝나요' : '하나씩 시작해 볼까요?');
    const mascot = options.mascot ? '<span class="lm-mascot"><img src="' + escapeHtml(options.mascot) + '" alt="" aria-hidden="true"></span>' : '';
    const intro = '<div class="lm-intro' + (model.allComplete ? ' lm-achievement' : '') + '">' + mascot + '<div><strong>' + headline + '</strong><small>' + escapeHtml(caption) + '</small></div></div>';
    const body = model.total
      ? intro
        + '<div class="lm-progress-summary"><strong>' + model.completed + ' / ' + model.total + ' 완료</strong><span>' + model.percent + '%</span></div>'
        + '<div class="lm-progress-track" role="progressbar" aria-label="오늘의 미션 달성률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + model.percent + '"><i style="width:' + model.percent + '%"></i></div>'
        + '<div class="lm-list">' + shown.map(missionRow).join('') + '</div>'
        + (model.selected.length > 2 ? '<button type="button" class="lm-expand" data-mission-expand aria-expanded="' + expanded + '">' + (expanded ? '접기' : '전체 보기') + '</button>' : '')
      : '<div class="lm-empty">' + mascot + '<p>오늘 실천할 미션을 선택해 주세요.</p><button type="button" data-mission-settings>목표 설정하기</button></div>';
    /* options.ddayHTML: the exam D-day row (with 시험일 설정/변경) shown at the top of the goal card. */
    const dday = options.ddayHTML ? '<div class="lm-dday">' + options.ddayHTML + '</div>' : '';
    return '<section class="lm-card" aria-labelledby="lm-card-title"><header class="lm-card-head"><div><h2 id="lm-card-title">오늘의 학습 미션</h2><p>하루에 조금씩, 꾸준히 공부해요.</p></div><button type="button" class="lm-settings-link" data-mission-settings>목표 설정</button></header><div class="lm-panel">' + dday + body + '</div></section>';
  }

  function settingsHTML() {
    if (!draft) draft = normalizeSettings(store.settings);
    const cards = definitions.map((item) => {
      const setting = draft[item.id], index = item.targets.indexOf(setting.target);
      const value = setting.target + item.unit;
      return '<section class="lm-setting-card' + (setting.enabled ? ' is-enabled' : '') + '">'
        + '<label class="lm-setting-toggle" for="lm-enabled-' + item.id + '"><input id="lm-enabled-' + item.id + '" type="checkbox" data-mission-enabled="' + item.id + '" ' + (setting.enabled ? 'checked' : '') + '><span class="lm-checkmark" aria-hidden="true"></span><span class="lm-setting-title">' + escapeHtml(item.title) + '</span></label>'
        + '<p class="lm-setting-description">' + escapeHtml(item.description) + '</p>'
        + '<div class="lm-target-control"><span>하루 목표</span><div><button type="button" data-mission-adjust="' + item.id + '" data-direction="-1" aria-label="' + escapeHtml(item.title) + ' 목표 줄이기" ' + (index <= 0 ? 'disabled' : '') + '>−</button><strong>' + escapeHtml(value) + '</strong><button type="button" data-mission-adjust="' + item.id + '" data-direction="1" aria-label="' + escapeHtml(item.title) + ' 목표 늘리기" ' + (index >= item.targets.length - 1 ? 'disabled' : '') + '>+</button></div></div>'
        + '</section>';
    }).join('');
    return '<section class="lm-settings" aria-labelledby="lm-settings-title">'
      + '<header class="lm-settings-header"><button type="button" class="lm-back" data-mission-back aria-label="뒤로가기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button><div><h1 id="lm-settings-title">목표 설정하기</h1><p>오늘 실천할 학습 미션과 목표량을 선택해 주세요.</p></div></header>'
      + '<div class="lm-settings-list">' + cards + '</div>'
      + '<div class="lm-save-wrap"><button type="button" class="lm-save" data-mission-save>설정 완료</button></div>'
      + '</section>';
  }

  function render() {
    if (typeof globalThis.render === 'function') globalThis.render();
  }

  function openSettings() {
    draft = normalizeSettings(store.settings);
    expanded = false;
    globalThis.APP_ROUTE?.push(SETTINGS_ROUTE);
    globalThis.APP_ROUTE?.apply(SETTINGS_ROUTE);
  }

  function returnHome(replace = true) {
    settingsOpen = false;
    draft = null;
    if (replace) globalThis.APP_ROUTE?.replace('home');
    globalThis.APP_ROUTE?.apply('home');
  }

  function enterMission(missionId) {
    const mission = byId.get(missionId);
    if (!mission) return;
    settingsOpen = false;
    draft = null;
    if (mission.route === 'seasons') {
      if (typeof navigate === 'function') navigate('seasons');
      globalThis.APP_ROUTE?.push('seasons');
      return;
    }
    const nav = document.querySelector?.('.app-navigation [data-nav="' + mission.route + '"]');
    if (nav && typeof nav.click === 'function') nav.click();
    else if (typeof navigate === 'function') {
      navigate(mission.route);
      globalThis.APP_ROUTE?.push(mission.route);
    }
  }

  document.addEventListener('click', (event) => {
    const button = event.target?.closest?.('[data-mission-settings],[data-mission-back],[data-mission-save],[data-mission-expand],[data-mission-adjust],[data-mission-go]');
    if (!button) return;
    if (button.hasAttribute('data-mission-settings')) {
      event.preventDefault(); event.stopImmediatePropagation(); openSettings(); return;
    }
    if (button.hasAttribute('data-mission-back')) {
      event.preventDefault(); event.stopImmediatePropagation(); returnHome(); return;
    }
    if (button.hasAttribute('data-mission-save')) {
      event.preventDefault(); event.stopImmediatePropagation();
      if (!draft || !saveSettings(draft)) return;
      expanded = false; returnHome(); return;
    }
    if (button.hasAttribute('data-mission-expand')) {
      event.preventDefault(); event.stopImmediatePropagation(); expanded = !expanded; render(); return;
    }
    if (button.hasAttribute('data-mission-adjust')) {
      event.preventDefault(); event.stopImmediatePropagation();
      const item = byId.get(button.dataset.missionAdjust), setting = draft?.[button.dataset.missionAdjust];
      if (!item || !setting) return;
      const current = item.targets.indexOf(setting.target), next = Math.max(0, Math.min(item.targets.length - 1, current + Number(button.dataset.direction || 0)));
      setting.target = item.targets[next]; render();
      document.querySelector?.('[data-mission-adjust="' + item.id + '"][data-direction="' + button.dataset.direction + '"]')?.focus?.({ preventScroll: true });
      return;
    }
    if (button.hasAttribute('data-mission-go')) {
      event.preventDefault(); event.stopImmediatePropagation(); enterMission(button.dataset.missionGo); return;
    }
  }, true);

  document.addEventListener('change', (event) => {
    const input = event.target?.closest?.('[data-mission-enabled]');
    if (!input || !draft?.[input.dataset.missionEnabled]) return;
    draft[input.dataset.missionEnabled].enabled = Boolean(input.checked);
    render();
    document.querySelector?.('#lm-enabled-' + input.dataset.missionEnabled)?.focus?.({ preventScroll: true });
  }, true);

  const contentBefore = renderContent;
  renderContent = function () {
    if (settingsOpen) return settingsHTML();
    const content = contentBefore();
    if (screen === 'jokbo-detail') {
      const route = globalThis.APP_ROUTE?.current?.() || '';
      if (route.startsWith('jokbo/detail/')) {
        let keywordId = route.slice('jokbo/detail/'.length);
        try { keywordId = decodeURIComponent(keywordId); } catch {}
        recordJokboKeyword(keywordId);
      }
    }
    return content;
  };

  const applyRouteBefore = globalThis.REV7_OX_VIEWS?.applyRoute;
  globalThis.REV7_OX_VIEWS?.addRoute?.(SETTINGS_ROUTE);
  globalThis.REV7_OX_VIEWS?.setApplyRoute?.((route = globalThis.APP_ROUTE?.current?.()) => {
    if (route === SETTINGS_ROUTE) {
      settingsOpen = true; draft ||= normalizeSettings(store.settings); screen = 'seasons'; modal = null;
      render(); window.scrollTo?.(0, 0); return route;
    }
    if (settingsOpen) { settingsOpen = false; draft = null; }
    return typeof applyRouteBefore === 'function' ? applyRouteBefore(route) : route;
  });

  let renderedDay = dayKey(new Date());
  function refreshOnDateChange() {
    const currentDay = dayKey(new Date());
    if (currentDay !== renderedDay) {
      renderedDay = currentDay;
      if (screen === 'home' && !settingsOpen) render();
    }
  }
  function scheduleNextDay() {
    const current = new Date(), shifted = new Date(current.getTime() + 9 * HOUR);
    const nextKst = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate() + 1) - 9 * HOUR;
    setTimeout(() => { refreshOnDateChange(); scheduleNextDay(); }, Math.max(1000, nextKst - current.getTime() + 250));
  }
  if (typeof setTimeout === 'function') scheduleNextDay();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshOnDateChange(); });

  globalThis.LEARNING_MISSIONS = Object.freeze({
    snapshot,
    cardHTML,
    settingsHTML,
    recordJokboKeyword,
    saveSettings,
    state: () => ({ settings: normalizeSettings(store.settings), keywordVisits: normalizeVisits(store.keywordVisits) }),
  });
  render();
})();
