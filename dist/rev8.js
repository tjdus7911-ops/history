/* Rev.8 behaviour layer — presentation only.
 * Jokbo FAB: shrinks to the compact 48px circle while the page scrolls down and
 * expands again when scrolling up or after any screen change (Figma "Floating Jokbo Button").
 * Routes, saves and the FAB visibility rules in jokbo-ui.js are unchanged. */
(function () {
  'use strict';
  if (typeof document === 'undefined' || typeof window === 'undefined' || typeof render !== 'function') return;
  if (typeof window.addEventListener !== 'function') return; // headless test harnesses provide a minimal window
  const body = () => document.body;
  let lastY = window.scrollY || 0;
  const setCompact = (on) => body()?.classList?.toggle?.('rv8-fab-compact', Boolean(on));

  window.addEventListener('scroll', () => {
    const y = window.scrollY || 0, delta = y - lastY;
    if (Math.abs(delta) < 8) return;
    setCompact(delta > 0 && y > 120);
    lastY = y;
  }, { passive: true });

  const renderBeforeRev8 = render;
  render = function () {
    const result = renderBeforeRev8.apply(this, arguments);
    if ((window.scrollY || 0) < 120) setCompact(false);
    lastY = window.scrollY || 0;
    return result;
  };

  globalThis.REV8_UI_READY = true;
})();
