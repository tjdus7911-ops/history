/* 오답노트(기출 오답) 위에 시대별 취약점 분석을 보여 준다.
 * - 시대별 최근 정답률·오답 수·반복 오답을 막대로 비교하고, 가장 보완이 필요한 시대를 한 줄로 알려 준다.
 * - 선택한 시대(또는 가장 약한 시대)에서 자주 틀린 개념을 족보 키워드로 묶어 보여 주고, 누르면 족보 상세로 간다.
 * - 시대 행을 누르면 아래 오답 목록이 그 시대로 걸러진다. 기존 오답 목록·필터·데이터는 그대로 둔다. */
(function () {
  'use strict';
  if (typeof study !== 'function' || !globalThis.OFFICIAL_LEARNING_ANALYSIS) return;
  const A = globalThis.OFFICIAL_LEARNING_ANALYSIS;
  const JOKBO_ERA = { prehistoric: 'ancient', proto: 'ancient', three: 'ancient', 'north-south': 'ancient', goryeo: 'goryeo', joseon: 'joseon', opening: 'empire', colonial: 'occupation', modern: 'republic' };
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const GENERIC = new Set(['정치', '경제', '사회', '문화', '생활', '도구', '풍습', '제도', '특징', '대외', '건국', '통치']);
  const norm = (value) => String(value || '').normalize('NFKC').replace(/\s+/g, '').toLowerCase();

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
      const text = norm([r.question, r.clue, r.correctChoice, r.explanation].join(' '));
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

  function panelHTML() {
    const rows = A.rows();
    const solvedRows = rows.filter((r) => r.solved);
    if (!solvedRows.length) return '';
    const policy = A.policy;
    const weakest = rows.find((r) => r.weak) || rows.filter((r) => r.eligible && r.accuracy !== null).sort((a, b) => a.accuracy - b.accuracy)[0];
    const mostWrong = solvedRows.slice().sort((a, b) => b.wrong - a.wrong || b.wrongCount - a.wrongCount)[0];
    const ordered = solvedRows.slice().sort((a, b) => Number(b.weak) - Number(a.weak) || (a.accuracy ?? 101) - (b.accuracy ?? 101) || a.index - b.index);
    const focusRow = (wrongEra !== 'all' && rows.find((r) => r.id === wrongEra && r.solved)) || weakest || mostWrong || ordered[0];
    const [focusLabel, focusTone] = badge(focusRow);
    const acc = focusRow.accuracy;
    const caption = weakest && weakest.weak && focusRow.id === weakest.id ? '가장 보완이 필요한 시대' : wrongEra !== 'all' ? '선택한 시대' : weakest && weakest.weak ? '가장 보완이 필요한 시대' : weakest ? '정답률이 가장 낮은 시대' : '가장 많이 틀린 시대';
    const hero = '<div class="wea-hero ' + focusTone + '">'
      + '<div class="wea-hero-copy"><small>' + caption + '</small><strong>' + escapeHtml(focusRow.name) + '</strong>'
      + '<span>오답 ' + focusRow.wrong + '문항' + (focusRow.repeatedWrong ? ' · 반복 ' + focusRow.repeatedWrong + '회' : '') + ' · <em>' + focusLabel + '</em></span></div>'
      + '<div class="wea-gauge" style="--wea-acc:' + (acc || 0) + '" role="img" aria-label="최근 정답률 ' + (acc === null ? '기록 없음' : acc + '%') + '"><b>' + (acc === null ? '—' : acc + '<i>%</i>') + '</b><small>정답률</small></div></div>';

    const chip = (id, name, sub, tone, selected) => '<button type="button" class="wea-chip ' + tone + (selected ? ' is-selected' : '') + '" data-wea-era="' + id + '" aria-pressed="' + selected + '"><b>' + escapeHtml(name) + '</b><small>' + sub + '</small></button>';
    const chips = chip('all', '전체', '오답 ' + rows.reduce((n, r) => n + r.wrong, 0), 'is-all', wrongEra === 'all')
      + ordered.map((r) => chip(r.id, r.name, (r.accuracy === null ? '—' : r.accuracy + '%') + ' · 오답 ' + r.wrong, badge(r)[1], wrongEra === r.id)).join('');

    const counts = new Map();
    for (const { entry, record } of wrongEntries()) {
      if (entry.primaryEra !== focusRow.id) continue;
      const topic = topicOf(entry);
      if (!topic) continue;
      const item = counts.get(topic.id) || { topic, questions: 0, misses: 0 };
      item.questions += 1; item.misses += record.wrongCount;
      counts.set(topic.id, item);
    }
    const top = [...counts.values()].sort((a, b) => b.questions - a.questions || b.misses - a.misses).slice(0, 3);
    const topics = top.length
      ? '<div class="wea-focus"><h3>자주 틀린<br>개념</h3><div class="wea-topics">' + top.map((t) => '<button type="button" class="wea-topic" data-wea-jokbo="' + escapeHtml(t.topic.id) + '"><span>' + escapeHtml(GENERIC.has(t.topic.label) && t.topic.group ? t.topic.group.replace(/\s*시대$/, '') + ' ' + t.topic.label : t.topic.label) + '</span><small>' + escapeHtml(t.topic.group) + '</small></button>').join('') + '</div></div>'
      : '';

    return '<section class="wea-panel" aria-labelledby="wea-title"><h2 id="wea-title" class="wea-title">시대별 취약점</h2>' + hero
      + '<div class="wea-chips" role="group" aria-label="시대 선택">' + chips + '</div>' + topics
      + '<p class="wea-policy">시대별 ' + policy.minimumUniqueQuestions + '문항 이상 · 정답률 ' + policy.targetAccuracy + '% 미만이면 집중 복습</p></section>'
      + '<h2 class="wea-list-head">' + (wrongEra === 'all' ? '전체' : escapeHtml(rows.find((r) => r.id === wrongEra)?.name || '')) + ' 오답 목록</h2>';
  }

  const previousStudy = study;
  study = function () {
    const html = previousStudy.apply(this, arguments);
    if (studyTab !== 'review' || wrongFilter === 'ox' || typeof html !== 'string' || !html.includes('data-figma-frame="W-01"')) return html;
    const panel = panelHTML();
    if (!panel) return html;
    const marker = '<div class="r7-metrics">';
    return html.includes(marker) ? html.replace(marker, panel + marker) : html;
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-wea-era],[data-wea-jokbo]');
    if (!button) return;
    event.stopImmediatePropagation();
    if (button.dataset.weaJokbo) {
      if (!globalThis.JOKBO_API?.openDetail?.(button.dataset.weaJokbo) && typeof toast === 'function') toast('족보를 열 수 없어요.');
      return;
    }
    wrongEra = button.dataset.weaEra;
    render();
    document.querySelector('.r7-wrong-list, .r7-empty')?.scrollIntoView({ block: 'nearest' });
  }, true);

  globalThis.WEAK_ERA_ANALYSIS = Object.freeze({ panelHTML, topicOf });
})();
