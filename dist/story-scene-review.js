/* 스토리 '장면 목록'과 이전 장면 다시 보기 (원삼국)
 * - 스토리 화면 위 '장면 목록' 버튼 → 현재 챕터(또는 프롤로그)의 장면을 완료 / 진행 중 / 잠금으로 보여 준다.
 * - 완료한 장면만 열 수 있고, 다시 보기는 대본을 읽기 전용으로 보여 주는 별도 화면이다.
 *   run()·저장 데이터를 바꾸지 않으므로 진행률이 초기화되거나 완료 기록·보상이 중복되지 않는다.
 * - '마지막 학습 위치로 돌아가기'는 화면만 닫아 원래 진행 중이던 대사로 돌아간다. */
(function () {
  'use strict';
  if (typeof modalHTML !== 'function' || typeof STORIES !== 'object') return;
  const R = globalThis.PROTO_REVISION_RUNTIME;
  if (!R) return;

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const listIcon = '<svg class="ssr-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2"/><circle cx="4.5" cy="12" r="1.2"/><circle cx="4.5" cy="18" r="1.2"/></svg>';

  const currentSource = () => { try { return STORIES[run().pending?.sourceSceneId || run().storyId]; } catch { return null; } };
  const available = () => { const s = currentSource(); return Boolean(s && (s.isPrologue || s.protoStoryVersion) && typeof screen !== 'undefined' && screen === 'game'); };
  function sceneIdsFor(source) {
    if (!source) return [];
    if (source.isPrologue) return R.prologueSceneIds.slice();
    return typeof chapterScenes === 'function' ? chapterScenes(source.chapterId).map((scene) => scene.sceneId) : [];
  }
  function readScenes() {
    try { return new Set(meta().protoRevisionBook?.readSceneIds || []); } catch { return new Set(); }
  }
  function status(sceneId, current, read) {
    if (sceneId === current) return 'current';
    return read.has(sceneId) ? 'done' : 'locked';
  }

  function listHTML() {
    const source = currentSource(), ids = sceneIdsFor(source), read = readScenes();
    const rows = ids.map((id, i) => {
      const s = status(id, source.sceneId, read), title = STORIES[id]?.title || '장면 ' + (i + 1), no = 'SCENE ' + String(i + 1).padStart(2, '0');
      const label = s === 'done' ? '완료' : s === 'current' ? '현재 진행 중' : '잠금';
      const inner = '<span class="ssr-no">' + no + '</span><span class="ssr-title"><b>' + esc(title) + '</b><small class="is-' + s + '">' + label + '</small></span>';
      if (s === 'done') return '<li><button type="button" class="ssr-row is-done" data-ssr-review="' + esc(id) + '" aria-label="' + esc(no + ' ' + title + ' 다시 보기') + '">' + inner + '<span class="ssr-go" aria-hidden="true">다시 보기 ›</span></button></li>';
      if (s === 'current') return '<li><button type="button" class="ssr-row is-current" data-action="close" aria-current="step">' + inner + '<span class="ssr-go" aria-hidden="true">이어 읽기</span></button></li>';
      return '<li><div class="ssr-row is-locked" aria-disabled="true">' + inner + '<span class="ssr-lock" aria-hidden="true">🔒</span></div></li>';
    }).join('');
    const label = source.isPrologue ? '원삼국 프롤로그' : 'CH.' + String(CHAPTERS[source.chapterId]?.number || '').padStart(2, '0') + ' ' + (CHAPTERS[source.chapterId]?.title || '');
    return '<div class="modal-overlay chapter-sheet-overlay r7-chapter-overlay"><section class="modal chapter-sheet r7-player-menu ssr-sheet" role="dialog" aria-modal="true" aria-labelledby="ssr-title"><div class="sheet-handle"></div><header><h2 id="ssr-title">장면 목록</h2><button class="close" data-action="close" aria-label="장면 목록 닫기">×</button></header>'
      + '<p class="ssr-caption">' + esc(label) + ' · 완료한 장면은 다시 볼 수 있어요. 다시 봐도 진행 위치와 기록은 그대로예요.</p><ol class="ssr-list">' + rows + '</ol></section></div>';
  }

  function lineHTML(line) {
    const who = line.protoSpeaker || line.characterName || '';
    let text = esc(line.dialogue || line.text || '');
    for (const word of line.protoEmphasis || []) if (word) text = text.split(esc(word)).join('<mark>' + esc(word) + '</mark>');
    const narration = /나레이션|^$/.test(who) || line.protoKind === 'narration';
    const thought = line.protoKind === 'thought';
    return '<li class="ssr-line' + (narration ? ' is-narration' : '') + (thought ? ' is-thought' : '') + '">' + (narration ? '' : '<b>' + esc(who.replace('(속마음)', ' · 속마음')) + '</b>') + '<p>' + text + '</p></li>';
  }
  function reviewHTML(sceneId) {
    const scene = STORIES[sceneId], source = currentSource();
    if (!scene) return listHTML();
    const ids = sceneIdsFor(source), read = readScenes(), done = ids.filter((id) => status(id, source.sceneId, read) === 'done');
    const at = done.indexOf(sceneId), prev = done[at - 1], next = done[at + 1], number = ids.indexOf(sceneId) + 1;
    const assets = typeof ASSETS === 'object' && ASSETS ? ASSETS : globalThis.ASSETS, bg = assets?.[scene.illustrationId]?.src || '';
    const choices = (scene.choices || []).filter((c) => c && (c.text || c.label));
    let picked = null;
    try { const chosen = meta().protoRevisionBook?.choiceBySceneId?.[sceneId]; picked = choices.find((c) => c.choiceId === chosen || c.protoChoiceId === chosen) || null; } catch {}
    const choiceBlock = picked ? (picked.resultDialogues || []).map(lineHTML).join('')
      : choices.length ? '<li class="ssr-line is-choice"><b>선택지</b><p>' + choices.map((c, i) => String.fromCharCode(65 + i) + '. ' + esc(c.text || c.label)).join('<br>') + '</p></li>' : '';
    const lines = [...(scene.dialogues || [])].map(lineHTML).join('') + choiceBlock
      + [...(scene.protoCommon || []), ...(scene.protoOutro || [])].map(lineHTML).join('');
    const learned = (scene.protoLearningIds || []).map((id) => R.learningById?.get?.(id)?.keyword).filter(Boolean);
    return '<div class="modal-overlay ssr-review-overlay"><section class="modal ssr-review" role="dialog" aria-modal="true" aria-labelledby="ssr-review-title">'
      + '<header class="ssr-review-head"' + (bg ? ' style="background-image:linear-gradient(rgba(8,14,20,.15),rgba(8,14,20,.85)),url(\'' + esc(bg) + '\')"' : '') + '><button type="button" class="ssr-back" data-ssr-list aria-label="장면 목록으로">‹</button><div><small>SCENE ' + String(number).padStart(2, '0') + ' · 다시 보기</small><h2 id="ssr-review-title">' + esc(scene.title || '') + '</h2></div></header>'
      + (learned.length ? '<p class="ssr-keywords"><span>이 장면의 키워드</span>' + [...new Set(learned)].map((k) => '<i>' + esc(k) + '</i>').join('') + '</p>' : '')
      + '<ol class="ssr-script">' + lines + '</ol>'
      + '<nav class="ssr-nav"><button type="button" class="ssr-btn" data-ssr-review="' + esc(prev || '') + '"' + (prev ? '' : ' disabled') + '>‹ 이전 장면</button><button type="button" class="ssr-btn" data-ssr-review="' + esc(next || '') + '"' + (next ? '' : ' disabled') + '>다음 장면 ›</button></nav>'
      + '<button type="button" class="ssr-return" data-action="close">마지막 학습 위치로 돌아가기</button></section></div>';
  }

  const modalBefore = modalHTML;
  modalHTML = function () {
    if (modal?.type === 'ssr-list') return available() ? listHTML() : '';
    if (modal?.type === 'ssr-review') return available() ? reviewHTML(modal.sceneId) : '';
    return modalBefore.apply(this, arguments);
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest?.('button');
    if (!button) return;
    const d = button.dataset;
    if ('ssrOpen' in d || 'ssrList' in d) { event.stopImmediatePropagation(); modal = { type: 'ssr-list' }; render(); return; }
    if (d.ssrReview) {
      event.stopImmediatePropagation();
      const source = currentSource();
      if (status(d.ssrReview, source?.sceneId, readScenes()) !== 'done') return; // 잠금·현재 장면은 열지 않는다
      modal = { type: 'ssr-review', sceneId: d.ssrReview }; render();
      document.querySelector('.ssr-review')?.scrollTo?.(0, 0);
    }
  }, true);

  globalThis.STORY_SCENE_REVIEW = Object.freeze({ available, button: () => '<button type="button" class="ssr-open" data-ssr-open aria-label="장면 목록">' + listIcon + '</button>', sceneIdsFor, status: (id) => status(id, currentSource()?.sceneId, readScenes()) });
})();
