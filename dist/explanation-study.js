/* 기출 해설의 '핵심 키워드'와 '암기법' 영역.
 * - 해설 구성: 정답 → 정답인 이유 → 선지 분석 → 핵심 키워드 → 암기법(있을 때만)
 * - 암기법 출처
 *   1) 검수를 마치고 공개된 암기법 카드(ASSOCIATION_MEMORIES, status 'published')
 *   2) 아래 COMPARE_MNEMONICS: 여러 나라를 비교해 외우는 초기 국가 암기법(사실 확인 완료)
 * - 문제와 암기법은 문제의 단서·정답 선지·해설에 실제로 나오는 낱말로만 연결한다.
 *   억지로 모든 문제에 붙이지 않으며, 연결된 암기법이 없으면 '암기법' 제목도 그리지 않는다. */
(function () {
  'use strict';
  const catalog = globalThis.OFFICIAL_EXAM_CATALOG;
  if (!Array.isArray(catalog)) return;

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const flat = (value) => String(value || '').normalize('NFKC').replace(/\s+/g, '');
  const has = (text, ...terms) => terms.some((t) => text.includes(flat(t)));
  const all = (text, ...terms) => terms.every((t) => text.includes(flat(t)));

  // 사실 확인: 교과서·우리역사넷(국사편찬위원회) 초기 국가 서술 기준.
  const COMPARE_MNEMONICS = Object.freeze([
    {
      id: 'cmp-jecheon', title: '여러 나라의 제천 행사', type: '비교 암기',
      mnemonic: '부여는 12월 영고, 고구려는 10월 동맹, 동예는 10월 무천, 삼한은 5월 수릿날·10월 계절제!',
      tip: '부여만 한겨울(12월)이고, 고구려·동예는 추수가 끝난 10월이에요.',
      match: (t) => /영고(?!탑)/.test(t) || has(t, '무천', '수릿날', '계절제') || (has(t, '동맹') && has(t, '제천'))
    },
    {
      id: 'cmp-marriage', title: '고구려 서옥제 vs 옥저 민며느리제', type: '비교 암기',
      mnemonic: '서옥제는 신랑이 신부 집(서옥)으로, 민며느리제는 어린 신부가 신랑 집으로 — 방향이 반대!',
      tip: '고구려 = 데릴사위(서옥제), 옥저 = 민며느리제. 옥저는 가족 공동 무덤(뼈를 추려 한 목곽에 안치)도 함께 기억해요.',
      match: (t, answer) => answer === '옥저' || has(t, '서옥제', '데릴사위', '민며느리', '가족공동무덤', '골장제')
    },
    {
      id: 'cmp-buyeo', title: '부여의 사출도와 법', type: '연상 암기',
      mnemonic: '마·우·저·구 = 말·소·돼지·개! 가축 이름을 딴 가(加)들이 사출도를 다스렸어요.',
      tip: '도둑질하면 12배로 갚는 1책 12법, 소 발굽으로 점치는 우제점법, 형이 죽으면 동생이 형수와 혼인하는 형사취수제도 부여의 특징이에요.',
      match: (t, answer) => answer === '부여' || has(t, '사출도', '우제점') || (has(t, '1책12법') && has(t, '부여'))
    },
    {
      id: 'cmp-dongye', title: '동예의 풍습과 특산물', type: '두문자 암기',
      mnemonic: '동예 특산물은 "단·과·반" — 단궁, 과하마, 반어피!',
      tip: '다른 부족의 경계를 침범하면 노비·소·말로 갚는 책화, 같은 씨족끼리 혼인하지 않는 족외혼, 10월 무천도 동예예요.',
      match: (t, answer) => answer === '동예' || has(t, '책화', '단궁', '과하마', '반어피')
    },
    {
      id: 'cmp-samhan', title: '삼한의 정치와 제사', type: '비교 암기',
      mnemonic: '정치는 신지·읍차, 제사는 천군·소도 — 정치와 제사가 나뉜 제정 분리 사회!',
      tip: '소도에는 죄인이 도망쳐 들어가도 잡아갈 수 없었어요. 변한은 철이 많이 나서 낙랑과 왜에 수출했어요.',
      match: (t, answer) => /^삼한(지역)?$/.test(answer) || has(t, '천군', '신지', '읍차') || (has(t, '소도') && has(t, '삼한', '마한', '진한', '변한'))
    }
  ]);

  // 문항 ↔ 카탈로그 항목
  const byId = new Map();
  for (const entry of catalog) {
    byId.set(entry.canonicalQuestionId, entry);
    if (entry.sourceRecord?.officialQuestionId) byId.set(entry.sourceRecord.officialQuestionId, entry);
    for (const alias of entry.aliases || []) if (!byId.has(alias)) byId.set(alias, entry);
  }
  const entryOf = (value) => (typeof value === 'object' && value?.canonicalQuestionId && byId.get(value.canonicalQuestionId))
    || byId.get(typeof value === 'string' ? value : value?.officialQuestionId || value?.questionId || value?.canonicalQuestionId) || null;

  let recordById = null;
  function record(entry) {
    if (!recordById) recordById = new Map((globalThis.OFFICIAL_EXAM_EXPLANATION_RECORDS || []).map((r) => [r.officialQuestionId, r]));
    return recordById.get(entry?.sourceRecord?.officialQuestionId) || null;
  }
  // 정답과 직접 연결된 근거(문제 단서와 정답 선지)만 본다. 해설 본문은 오답 선지 설명이 섞여 있어 쓰지 않는다.
  function evidence(entry) {
    const r = record(entry);
    if (!r) return null;
    return { text: flat([r.clue, r.correctChoice].join(' ')), answer: flat(r.correctChoice).replace(/^\([가-힣]\)-?/, '') };
  }

  const cache = new Map();
  function mnemonicsFor(value) {
    const entry = entryOf(value);
    if (!entry) return [];
    if (cache.has(entry.canonicalQuestionId)) return cache.get(entry.canonicalQuestionId);
    const ids = new Set([entry.canonicalQuestionId, entry.sourceRecord?.officialQuestionId, ...(entry.aliases || [])].filter(Boolean));
    const cards = (globalThis.ASSOCIATION_MEMORIES || [])
      .filter((m) => m.status === 'published' && (m.publicMnemonic || m.mnemonic) && (m.relatedOfficialQuestionIds || []).some((id) => ids.has(id)))
      .map((m) => ({ id: m.id, title: m.title, type: '두문자·연상', mnemonic: m.publicMnemonic || m.mnemonic, steps: (m.steps || []).filter((s) => s.cue && s.title).map((s) => ({ cue: s.cue, title: s.title })), detail: true }));
    const ev = evidence(entry);
    const compares = ev ? COMPARE_MNEMONICS.filter((c) => c.match(ev.text, ev.answer)).map((c) => ({ id: c.id, title: c.title, type: c.type, mnemonic: c.mnemonic, tip: c.tip })) : [];
    const list = [...compares, ...cards].slice(0, 2);
    cache.set(entry.canonicalQuestionId, list);
    return list;
  }

  function keywordsFor(value) {
    const entry = entryOf(value);
    if (!entry) return { topic: null, clue: '' };
    const topic = globalThis.WEAK_ERA_ANALYSIS?.topicOf?.(entry) || null;
    const clue = String(record(entry)?.clue || '').trim();
    return { topic, clue };
  }

  function keywordHTML(value) {
    const { topic, clue } = keywordsFor(value);
    if (!topic && !clue) return '';
    return '<section class="xs-section xs-keywords" aria-label="핵심 키워드"><h2>핵심 키워드</h2>'
      + (topic ? '<button type="button" class="xs-chip" data-xs-jokbo="' + esc(topic.id) + '"><b>' + esc(topic.label) + '</b><small>족보에서 보기 ›</small></button>' : '')
      + (clue ? '<p class="xs-clue"><span>문제 단서</span>' + esc(clue) + '</p>' : '')
      + '</section>';
  }

  function mnemonicHTML(value) {
    const list = mnemonicsFor(value);
    if (!list.length) return '';
    return '<section class="xs-section xs-mnemonic" aria-label="암기법"><h2>암기법</h2>' + list.map((m) => '<article class="xs-card">'
      + '<header><small>' + esc(m.type) + '</small><b>' + esc(m.title) + '</b></header>'
      + '<p class="xs-quote">' + esc(m.mnemonic) + '</p>'
      + (m.steps?.length ? '<ol class="xs-steps">' + m.steps.slice(0, 8).map((s) => '<li><i>' + esc(s.cue) + '</i>' + esc(s.title) + '</li>').join('') + '</ol>' : '')
      + (m.tip ? '<p class="xs-tip">' + esc(m.tip) + '</p>' : '')
      + (m.detail ? '<button type="button" class="xs-more" data-association-for="' + esc(m.id) + '">암기법 자세히 보기 ›</button>' : '')
      + '</article>').join('') + '</section>';
  }

  const sectionsHTML = (value) => keywordHTML(value) + mnemonicHTML(value);

  document.addEventListener('click', (event) => {
    const chip = event.target.closest?.('[data-xs-jokbo]');
    if (!chip) return;
    event.stopImmediatePropagation();
    if (!globalThis.JOKBO_API?.openDetail?.(chip.dataset.xsJokbo) && typeof toast === 'function') toast('족보를 열 수 없어요.');
  }, true);

  globalThis.EXPLANATION_STUDY = Object.freeze({ mnemonicsFor, keywordsFor, sectionsHTML, keywordHTML, mnemonicHTML, compareMnemonics: COMPARE_MNEMONICS });
})();
