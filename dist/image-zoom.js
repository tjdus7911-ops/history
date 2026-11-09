/* 기출 문제 이미지 확대 보기: 직접 배율 조절
 * - 기본 100%(화면 맞춤) ~ 최대 300%, 두 손가락 핀치·버튼·슬라이더로 조절하고, 확대 상태에서는 끌어서 이동한다.
 * - '원래 크기'로 100%에 돌아간다. 배율은 열린 확대 창(modal) 안에서만 유지되고 문제 풀이 상태는 건드리지 않는다.
 * - 이미지가 있는 문제에서만 확대 창이 열리므로(기존 동작), 이미지가 없으면 조절 도구도 없다. */
(function () {
  'use strict';
  if (typeof modalHTML !== 'function') return;
  const MIN = 1, MAX = 3, STEP = 0.25;
  const clamp = (v) => Math.min(MAX, Math.max(MIN, Math.round(v * 100) / 100));
  const pct = (s) => Math.round(s * 100) + '%';
  const current = () => clamp(Number(modal?.scale) || 1);

  function toolsHTML(scale) {
    return '<div class="official-image-tools iz-tools" role="group" aria-label="이미지 배율">'
      + '<button type="button" class="iz-btn" data-iz-step="-1" aria-label="축소"' + (scale <= MIN ? ' disabled' : '') + '>−</button>'
      + '<input class="iz-range" type="range" min="' + MIN * 100 + '" max="' + MAX * 100 + '" step="5" value="' + Math.round(scale * 100) + '" aria-label="이미지 배율" data-iz-range>'
      + '<button type="button" class="iz-btn" data-official-image-zoom="true" data-iz-step="1" aria-label="확대"' + (scale >= MAX ? ' disabled' : '') + '>+</button>'
      + '<output class="iz-value" data-iz-value>' + pct(scale) + '</output>'
      + '<button type="button" class="iz-reset" data-iz-reset' + (scale === 1 ? ' disabled' : '') + '>원래 크기</button>'
      + '<span class="iz-hint">두 손가락으로 벌리거나 오므려서 크기를 바꾸고, 확대한 뒤에는 끌어서 움직여요.</span></div>';
  }

  const before = modalHTML;
  modalHTML = function () {
    const html = before.apply(this, arguments);
    if (modal?.type !== 'official-image' || typeof html !== 'string' || !html.includes('official-image-scroll')) return html;
    const scale = current();
    return html
      .replace(/<div class="official-image-tools">[\s\S]*?<\/div>/, toolsHTML(scale))
      .replace(/class="official-image-scroll[^"]*"/, 'class="official-image-scroll iz-scroll' + (scale > 1 ? ' zoomed' : '') + '"')
      .replace('<div class="official-modal-content-crop">', '<div class="official-modal-content-crop" style="width:' + scale * 100 + '%">');
  };

  // 다시 그리지 않고 배율만 바꾼다(스크롤 위치를 초점 기준으로 유지).
  function apply(next, focusX, focusY) {
    const box = document.querySelector('.official-image-modal .official-image-scroll');
    const crop = box?.querySelector('.official-modal-content-crop');
    if (!box || !crop || modal?.type !== 'official-image') return;
    const prev = current(), scale = clamp(next);
    const rect = box.getBoundingClientRect();
    const fx = focusX ?? rect.left + rect.width / 2, fy = focusY ?? rect.top + rect.height / 2;
    const contentX = (box.scrollLeft + fx - rect.left) / prev, contentY = (box.scrollTop + fy - rect.top) / prev;
    modal.scale = scale; modal.zoomed = scale > 1;
    crop.style.width = scale * 100 + '%';
    box.classList.toggle('zoomed', scale > 1);
    box.scrollLeft = contentX * scale - (fx - rect.left);
    box.scrollTop = contentY * scale - (fy - rect.top);
    const tools = document.querySelector('.iz-tools');
    if (tools) {
      tools.querySelector('[data-iz-range]').value = String(Math.round(scale * 100));
      tools.querySelector('[data-iz-value]').textContent = pct(scale);
      tools.querySelector('[data-iz-step="-1"]').disabled = scale <= MIN;
      tools.querySelector('[data-iz-step="1"]').disabled = scale >= MAX;
      tools.querySelector('[data-iz-reset]').disabled = scale === 1;
    }
  }

  // 기존 '글자 크게 보기' 토글보다 먼저 받아서 단계 확대로 바꾼다.
  window.addEventListener('click', (event) => {
    const button = event.target.closest?.('.iz-tools button');
    if (!button || modal?.type !== 'official-image') return;
    event.stopImmediatePropagation(); event.preventDefault();
    if ('izReset' in button.dataset) apply(1);
    else if (button.dataset.izStep) apply(current() + Number(button.dataset.izStep) * STEP);
  }, true);
  document.addEventListener('input', (event) => {
    if (event.target.matches?.('[data-iz-range]')) apply(Number(event.target.value) / 100);
  });

  // 두 손가락 핀치
  let pinch = null;
  const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  document.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 2 || !event.target.closest?.('.official-image-modal .official-image-scroll')) return;
    pinch = { d: dist(event.touches), scale: current() };
  }, { passive: true });
  document.addEventListener('touchmove', (event) => {
    if (!pinch || event.touches.length !== 2) return;
    if (event.cancelable) event.preventDefault();
    const t = event.touches, mid = { x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 };
    apply(pinch.scale * dist(t) / pinch.d, mid.x, mid.y);
  }, { passive: false });
  const endPinch = (event) => { if (pinch && event.touches.length < 2) pinch = null; };
  document.addEventListener('touchend', endPinch);
  document.addEventListener('touchcancel', endPinch);
  // 트랙패드 핀치(ctrl + 휠)
  document.addEventListener('wheel', (event) => {
    if (!event.ctrlKey || !event.target.closest?.('.official-image-modal .official-image-scroll')) return;
    event.preventDefault();
    apply(current() * Math.exp(-event.deltaY / 200), event.clientX, event.clientY);
  }, { passive: false });

  globalThis.OFFICIAL_IMAGE_ZOOM = Object.freeze({ apply, range: { min: MIN, max: MAX } });
})();
