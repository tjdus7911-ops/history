/* 내 기록 › 취약점 분석 화면 (route: records/weakness)
 * - 지금까지 푼 기출(최근 풀이 기준)로 가장 취약한 시대와 그 시대에서 취약한 개념을 보여 준다.
 * - 시대별 취약 순위를 누르면 그 시대의 분석으로 바뀐다. 개념을 누르면 족보 상세로 간다.
 * - 홈 '보완이 필요한 시대'의 '분석 보기'와 내 기록 메뉴에서 연다. 오답노트는 오답 목록만 유지한다. */
(function () {
  'use strict';
  if (typeof renderContent !== 'function' || !globalThis.OFFICIAL_LEARNING_ANALYSIS) return;
  const A = globalThis.OFFICIAL_LEARNING_ANALYSIS;
  const JOKBO_ERA = { prehistoric: 'ancient', proto: 'ancient', three: 'ancient', 'north-south': 'ancient', goryeo: 'goryeo', joseon: 'joseon', opening: 'empire', colonial: 'occupation', modern: 'republic' };
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const GENERIC = new Set(['정치', '경제', '사회', '문화', '생활', '도구', '풍습', '제도', '특징', '대외', '건국', '통치']);
  const norm = (value) => String(value || '').normalize('NFKC').replace(/\s+/g, '').toLowerCase();

  let focusEra = null;
  let coreById = null;
  function coreRecord(id) {
    if (!coreById) coreById = new Map((globalThis.OFFICIAL_EXAM_EXPLANATION_RECORDS || []).map((r) => [r.officialQuestionId, r]));
    return coreById.get(id);
  }
  let keywordsByEra = null;
  function eraKeywords(eraId) {
    if (!keywordsByEra) {
      keywordsByEra = new Map();
      for (const k of globalThis.JOKBO_DATA?.keywords || []) {
        const era = JOKBO_ERA[k.eraId];
        const terms = (k.examTerms || []).map(norm).filter((t) => t.length >= 2);
        if (!era || !terms.length) continue;
        if (!keywordsByEra.has(era)) keywordsByEra.set(era, []);
        keywordsByEra.get(era).push({ id: k.id, label: k.label, group: String(k.groupTitle || '').replace(/^\d+\s*/, ''), terms });
      }
    }
    return keywordsByEra.get(eraId) || [];
  }
  const topicCache = new Map();
  function topicOf(entry) {
    const id = entry.sourceRecord?.officialQuestionId;
    if (topicCache.has(id)) return topicCache.get(id);
    const r = coreRecord(id);
    let best = null;
    if (r) {
      const exp = String(r.explanation || ''), cut = exp.search(/따라서\s*[①②③④⑤]?\s*[이가]?\s*정답/);
      const text = norm([r.question, r.clue, r.correctChoice, cut > 0 ? exp.slice(0, cut) : exp].join(' '));
      for (const k of eraKeywords(entry.primaryEra)) {
        let score = 0;
        for (const t of k.terms) if (text.includes(t)) score += 10 + t.length;
        if (score && (!best || score > best.score)) best = { ...k, score };
      }
    }
    topicCache.set(id, best);
    return best;
  }

  // 아직 복습이 필요한(마지막 풀이가 오답인) 기출 문항
  function wrongEntries() {
    const out = [];
    for (const entry of globalThis.OFFICIAL_EXAM_CATALOG || []) {
      const record = A.record(entry.canonicalQuestionId);
      if (record.attempts && record.wrongCount) out.push({ entry, record });
    }
    return out;
  }

  function badge(row) {
    if (!row.solved) return ['학습 전', 'is-idle'];
    if (!row.eligible) return ['표본 ' + row.known + '/' + A.policy.minimumUniqueQuestions, 'is-sample'];
    if (row.weak) return ['집중 복습', 'is-weak'];
    return ['양호', 'is-good'];
  }

  // 시대 안에서 푼 문항을 개념별로 묶어 최근 풀이 기준 오답 비율을 낸다.
  function topicStats(eraId) {
    const map = new Map();
    for (const entry of globalThis.OFFICIAL_EXAM_CATALOG || []) {
      if (entry.primaryEra !== eraId) continue;
      const record = A.record(entry.canonicalQuestionId);
      if (!record.attempts || typeof record.lastCorrect !== 'boolean') continue;
      const topic = topicOf(entry);
      if (!topic) continue;
      const item = map.get(topic.id) || { topic, solved: 0, wrong: 0, misses: 0 };
      item.solved += 1; if (!record.lastCorrect) item.wrong += 1; item.misses += record.wrongCount;
      map.set(topic.id, item);
    }
    return [...map.values()].filter((t) => t.wrong).sort((a, b) => b.wrong - a.wrong || b.wrong / b.solved - a.wrong / a.solved || b.misses - a.misses);
  }
  const topicName = (t) => GENERIC.has(t.label) && t.group ? t.group.replace(/\s*시대$/, '') + ' ' + t.label : t.label;

  const icon = (name) => '<span class="r7-icon" aria-hidden="true"><img src="media/rev7/' + name + '.svg" alt=""></span>';
  let weakView = false;

  function pageHTML() {
    const rows = A.rows();
    const known = rows.filter((r) => r.known);
    const policy = A.policy;
    const top = '<section class="r7-page wea-page"><header class="r7-appbar"><button data-weak-back aria-label="내 기록으로 돌아가기">' + icon('back') + '</button><h1>취약점 분석</h1><span></span></header>';
    if (!known.length) {
      return top + '<div class="r7-empty"><span class="r7-empty-icon">' + icon('empty-wrong') + '</span><h2>아직 분석할 풀이 기록이 없어요</h2><p>기출문제를 풀면 어떤 시대와 개념이 약한지 알려 드려요.</p></div><button class="r7-primary" data-nav="exam-library">기출문제 풀러 가기</button></section>';
    }
    // 취약 순위: 표본이 충분한 시대 먼저(정답률 낮은 순), 그다음 표본이 적은 시대
    const ranked = known.slice().sort((a, b) => Number(b.eligible) - Number(a.eligible) || a.accuracy - b.accuracy || b.wrong - a.wrong || a.index - b.index);
    const weakest = ranked[0];
    const focus = (focusEra && known.find((r) => r.id === focusEra)) || weakest;
    const [label, tone] = badge(focus);
    const caption = focus.id === weakest.id ? '가장 취약한 시대' : '선택한 시대';
    const hero = '<section class="wea-card"><div class="wea-hero ' + tone + '">'
      + '<div class="wea-hero-copy"><small>' + caption + '</small><strong>' + escapeHtml(focus.name) + '</strong>'
      + '<span><span class="wea-nw">푼 ' + focus.known + '문제 중 <b>' + focus.wrong + '문제</b> 틀림</span>' + (focus.repeatedWrong ? ' <span class="wea-nw">· 반복 ' + focus.repeatedWrong + '회</span>' : '') + '</span>'
      + '<em>' + label + '</em></div>'
      + '<div class="wea-gauge" style="--wea-acc:' + focus.accuracy + '" role="img" aria-label="최근 정답률 ' + focus.accuracy + '%"><b>' + focus.accuracy + '<i>%</i></b><small>정답률</small></div></div>'
      + (focus.eligible ? '' : '<p class="wea-hint">아직 ' + policy.minimumUniqueQuestions + '문항보다 적게 풀어서(' + focus.known + '문항) 결과가 바뀔 수 있어요.</p>')
      + (focus.wrong ? '<div class="wea-actions"><button class="r7-primary" data-weak-retry="' + focus.id + '">' + escapeHtml(focus.name) + ' 오답 ' + focus.wrong + '개 다시 풀기</button><button class="r7-secondary" data-weak-notes="' + focus.id + '">오답노트에서 보기</button></div>' : '')
      + '</section>';

    const topics = topicStats(focus.id).slice(0, 5);
    const topicBlock = '<section class="wea-card"><h2>' + escapeHtml(focus.name) + '에서 취약한 개념</h2>'
      + (topics.length
        ? '<div class="wea-topics">' + topics.map((t) => '<button type="button" class="wea-topic" data-wea-jokbo="' + escapeHtml(t.topic.id) + '">'
          + '<span class="wea-topic-name"><b>' + escapeHtml(topicName(t.topic)) + '</b><small>' + escapeHtml(t.topic.group) + '</small></span>'
          + '<span class="wea-topic-rate"><b>' + t.solved + '문제 중 ' + t.wrong + '개 틀림</b><i style="--wea-err:' + Math.round(t.wrong / t.solved * 100) + '"></i></span></button>').join('') + '</div>'
          + '<p class="wea-hint">개념을 누르면 족보에서 핵심 정리를 볼 수 있어요.</p>'
        : '<p class="wea-hint">이 시대에서 최근에 틀린 문제가 없어요.</p>')
      + '</section>';

    const rankBlock = '<section class="wea-card"><h2>시대별 취약 순위</h2><ol class="wea-rank">' + ranked.map((r, i) => '<li><button type="button" class="wea-rank-row' + (r.id === focus.id ? ' is-selected' : '') + '" data-wea-focus="' + r.id + '" aria-pressed="' + (r.id === focus.id) + '">'
      + '<span class="wea-rank-no">' + (i + 1) + '</span><span class="wea-rank-name"><b>' + escapeHtml(r.name) + '</b><small>' + (r.eligible ? '오답 ' + r.wrong + ' / ' + r.known + '문제' : '표본 부족 · ' + r.known + '문제') + '</small></span>'
      + '<span class="wea-rank-bar" aria-hidden="true"><i style="width:' + r.accuracy + '%"></i></span><b>' + r.accuracy + '%</b></button></li>').join('') + '</ol>'
      + '<p class="wea-policy">최근 풀이 기준 정답률이에요. 시대별 ' + policy.minimumUniqueQuestions + '문항 이상 풀고 정답률이 ' + policy.targetAccuracy + '% 미만이면 집중 복습으로 표시해요.</p></section>';

    return top + hero + topicBlock + rankBlock + '</section>';
  }

  const renderBefore = renderContent;
  renderContent = function () {
    if (screen === 'records' && weakView) return pageHTML();
    if (screen !== 'records') weakView = false;
    const html = renderBefore.apply(this, arguments);
    // 내 기록 메뉴에 '취약점 분석' 추가
    if (screen === 'records' && typeof html === 'string' && html.includes('data-figma-frame="M-01"') && !html.includes('data-weak-open')) {
      const link = html.match(/<button data-r7-record-learning>[\s\S]*?<\/button>/);
      if (link) {
        const chevronMarkup = (link[0].match(/<\/span>([\s\S]*)<\/button>$/) || [])[1] || '';
        return html.replace(link[0], link[0] + '<button data-weak-open><span><b>취약점 분석</b><small>가장 약한 시대와 개념</small></span>' + chevronMarkup + '</button>');
      }
    }
    return html;
  };

  const ROUTE = 'records/weakness';
  const views = globalThis.REV7_OX_VIEWS;
  if (views?.addRoute) views.addRoute(ROUTE);
  const applyBefore = views?.applyRoute;
  if (views?.setApplyRoute && applyBefore) views.setApplyRoute(function (route = views.readRoute()) {
    if (route === ROUTE) { weakView = true; screen = 'records'; modal = null; render(); window.scrollTo(0, 0); return route; }
    weakView = false;
    return applyBefore(route);
  });
  const writeRoute = (route) => { try { views?.writeRoute?.(route); } catch {} };

  function open(eraId) {
    weakView = true; focusEra = eraId || null; screen = 'records'; modal = null;
    writeRoute(ROUTE); render(); window.scrollTo(0, 0);
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const d = button.dataset;
    if ('weakOpen' in d) { event.stopImmediatePropagation(); open(d.weakOpen || null); return; }
    if (d.nav) { weakView = false; return; }
    if (!weakView) return;
    if ('weakBack' in d) { event.stopImmediatePropagation(); weakView = false; writeRoute('records'); render(); window.scrollTo(0, 0); return; }
    if (d.weaFocus) { event.stopImmediatePropagation(); focusEra = d.weaFocus; render(); document.querySelector('.wea-hero')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
    if (d.weaJokbo) { event.stopImmediatePropagation(); weakView = false; if (!globalThis.JOKBO_API?.openDetail?.(d.weaJokbo) && typeof toast === 'function') toast('족보를 열 수 없어요.'); return; }
    if (d.weakRetry) {
      event.stopImmediatePropagation();
      const entries = (globalThis.OFFICIAL_EXAM_CATALOG || []).filter((e) => e.primaryEra === d.weakRetry && A.record(e.canonicalQuestionId).lastCorrect === false);
      if (entries.length) { weakView = false; startOfficialSession(entries, 'learn', { scope: 'wrong-only' }); }
      return;
    }
    if (d.weakNotes) { event.stopImmediatePropagation(); weakView = false; wrongEra = d.weakNotes; wrongChapter = 'all'; wrongConcept = 'all'; wrongFilter = 'official'; studyTab = 'review'; navigate('study'); }
  }, true);

  // 홈 배너용 요약: 가장 취약한 시대와 그 시대의 대표 취약 개념
  function summary() {
    const known = A.rows().filter((r) => r.known);
    if (!known.length) return null;
    const weakest = known.slice().sort((a, b) => Number(b.eligible) - Number(a.eligible) || a.accuracy - b.accuracy || b.wrong - a.wrong || a.index - b.index)[0];
    const topics = topicStats(weakest.id);
    return { id: weakest.id, name: weakest.name, accuracy: weakest.accuracy, wrong: weakest.wrong, known: weakest.known, eligible: weakest.eligible, weak: weakest.weak, topic: topics[0] ? topicName(topics[0].topic) : '', topicCount: topics.length };
  }

  globalThis.WEAK_ERA_ANALYSIS = Object.freeze({ open, pageHTML, topicOf, summary });
})();
