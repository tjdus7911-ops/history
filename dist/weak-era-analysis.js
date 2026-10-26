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
    let summary;
    if (weakest && weakest.weak) summary = '가장 보완이 필요한 시대는 <b>' + escapeHtml(weakest.name) + '</b>예요. 최근 정답률 ' + weakest.accuracy + '%로 목표 ' + policy.targetAccuracy + '%보다 낮아요.';
    else if (weakest) summary = '모든 시대가 목표 정답률 ' + policy.targetAccuracy + '% 이상이에요. 상대적으로 낮은 시대는 <b>' + escapeHtml(weakest.name) + '</b>(' + weakest.accuracy + '%)예요.';
    else summary = '시대마다 ' + policy.minimumUniqueQuestions + '문항 이상 풀면 취약한 시대를 정확히 알려 드려요.';
    if (mostWrong && mostWrong.wrong) summary += '<br>오답이 가장 많은 시대: <b>' + escapeHtml(mostWrong.name) + '</b> ' + mostWrong.wrong + '문항';

    const ordered = rows.slice().sort((a, b) => Number(!!b.solved) - Number(!!a.solved) || Number(b.weak) - Number(a.weak) || (a.accuracy ?? 101) - (b.accuracy ?? 101) || a.index - b.index);
    const maxWrong = Math.max(1, ...rows.map((r) => r.wrong));
    const list = ordered.map((r) => {
      const [label, tone] = badge(r);
      const selected = wrongEra === r.id;
      return '<button type="button" class="wea-row ' + tone + (selected ? ' is-selected' : '') + '" data-wea-era="' + r.id + '" aria-pressed="' + selected + '"' + (r.solved ? '' : ' disabled') + '>'
        + '<span class="wea-name"><b>' + escapeHtml(r.name) + '</b><em>' + label + '</em></span>'
        + '<span class="wea-bars" aria-hidden="true"><i class="wea-acc" style="width:' + (r.accuracy || 0) + '%"></i><i class="wea-wrong" style="width:' + Math.round((r.wrong / maxWrong) * 100) + '%"></i></span>'
        + '<span class="wea-num"><b>' + (r.accuracy === null ? '—' : r.accuracy + '%') + '</b><small>오답 ' + r.wrong + (r.repeatedWrong ? ' · 반복 ' + r.repeatedWrong : '') + '</small></span>'
        + '</button>';
    }).join('');

    // 자주 틀린 개념: 선택한 시대, 없으면 가장 약한(또는 오답이 많은) 시대
    const focusId = wrongEra !== 'all' ? wrongEra : (weakest && weakest.wrong ? weakest.id : mostWrong?.wrong ? mostWrong.id : null);
    let focus = '';
    if (focusId) {
      const focusRow = rows.find((r) => r.id === focusId);
      const counts = new Map();
      for (const { entry, record } of wrongEntries()) {
        if (entry.primaryEra !== focusId) continue;
        const topic = topicOf(entry);
        if (!topic) continue;
        const item = counts.get(topic.id) || { topic, questions: 0, misses: 0 };
        item.questions += 1; item.misses += record.wrongCount;
        counts.set(topic.id, item);
      }
      const top = [...counts.values()].sort((a, b) => b.questions - a.questions || b.misses - a.misses).slice(0, 4);
      focus = '<div class="wea-focus"><h3>' + escapeHtml(focusRow?.name || '') + '에서 자주 틀린 개념</h3>'
        + (top.length
          ? '<div class="wea-topics">' + top.map((t) => '<button type="button" class="wea-topic" data-wea-jokbo="' + escapeHtml(t.topic.id) + '"><span>' + escapeHtml(t.topic.group ? t.topic.group + ' · ' + t.topic.label : t.topic.label) + '</span><em>' + t.questions + '문항</em></button>').join('') + '</div><p class="wea-hint">개념을 누르면 족보에서 핵심 내용을 바로 볼 수 있어요.</p>'
          : '<p class="wea-hint">이 시대에서 아직 틀린 문제가 없어요.</p>')
        + '</div>';
    }

    return '<section class="wea-panel" aria-labelledby="wea-title"><div class="wea-head"><h2 id="wea-title">시대별 취약점 분석</h2>'
      + (wrongEra !== 'all' ? '<button type="button" class="wea-all" data-wea-era="all">전체 시대 보기</button>' : '') + '</div>'
      + '<p class="wea-summary">' + summary + '</p>'
      + '<div class="wea-legend" aria-hidden="true"><span><i class="wea-acc"></i>최근 정답률</span><span><i class="wea-wrong"></i>복습할 오답 수</span></div>'
      + '<div class="wea-list">' + list + '</div>' + focus
      + '<small class="wea-policy">시대별 ' + policy.minimumUniqueQuestions + '문항 이상 풀고 정답률이 ' + policy.targetAccuracy + '% 미만이면 집중 복습으로 표시해요. 시대를 누르면 아래 오답 목록이 그 시대만 보여요.</small></section>';
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
