import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

const isNative = Capacitor.isNativePlatform();

function isVisible(element) {
  if (!element || element.disabled || element.getAttribute('aria-hidden') === 'true') return false;
  const style = globalThis.getComputedStyle?.(element);
  return style?.display !== 'none' && style?.visibility !== 'hidden' && element.getClientRects().length > 0;
}

function clickFirstVisible(selectors) {
  for (const selector of selectors) {
    const target = [...document.querySelectorAll(selector)].find(isVisible);
    if (target) {
      target.click();
      return true;
    }
  }
  return false;
}

function openLayerCount() {
  return [...document.querySelectorAll([
    '[role="dialog"]',
    '.modal-overlay',
    '.hv-sheet',
    '[data-r7-filter-sheet]',
    '[data-r7-ox-sheet]'
  ].join(','))].filter(isVisible).length;
}

function closeTopLayer() {
  const closers = [
    '[data-official-question-list-close="button"]',
    '[data-official-image-close]',
    '[data-hv-close]',
    '[data-r7-filter-close]',
    '[data-r7-ox-sheet-close]',
    '[data-action="close"]',
    '.modal [aria-label*="닫기"]'
  ];
  if (clickFirstVisible(closers)) return true;

  const before = openLayerCount();
  if (!before) return false;
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  return openLayerCount() < before;
}

function blurTextInput() {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement)) return false;
  if (!active.matches('input, textarea, select, [contenteditable="true"]')) return false;
  active.blur();
  return true;
}

function currentRoute() {
  const route = globalThis.APP_ROUTE?.current?.();
  if (route) return route;
  return String(globalThis.location?.hash || '').replace(/^#\/?/, '') || 'home';
}

async function handleBackButton() {
  if (blurTextInput()) return;
  if (closeTopLayer()) return;

  if (clickFirstVisible(['[data-r7-story-exit]', '[data-r7-exam-pause-exit]'])) return;

  const route = currentRoute();
  if (route !== 'home') {
    if (globalThis.history?.length > 1) globalThis.history.back();
    else globalThis.APP_ROUTE?.replace?.('home');
    return;
  }

  // iOS는 앱을 스스로 종료하면 안 된다(App Store 심사 기준). 홈에서는 아무것도 하지 않는다.
  if (Capacitor.getPlatform() === 'ios') return;

  // Android: 홈에서 뒤로 버튼을 한 번 누르면 안내만 하고, 2초 안에 한 번 더 누르면 종료한다.
  const now = Date.now();
  if (now - lastHomeBackAt > EXIT_CONFIRM_MS) {
    lastHomeBackAt = now;
    showExitToast();
    return;
  }
  lastHomeBackAt = 0;
  await App.exitApp();
}

const EXIT_CONFIRM_MS = 2000;
let lastHomeBackAt = 0;
function showExitToast() {
  const message = '‘뒤로’ 버튼을 한 번 더 누르면 앱이 종료됩니다.';
  if (typeof globalThis.toast === 'function') {
    globalThis.toast(message);
    return;
  }
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.textContent = message;
  document.body.append(el);
  setTimeout(() => el.remove(), EXIT_CONFIRM_MS);
}

// iOS에는 뒤로 버튼이 없으니, 화면 왼쪽 끝에서 오른쪽으로 미는 동작을 뒤로 가기로 쓴다.
function installEdgeSwipeBack() {
  const EDGE = 24;
  let swipe = null;
  const indicator = document.createElement('div');
  indicator.className = 'native-edge-back';
  indicator.setAttribute('aria-hidden', 'true');
  indicator.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>';
  const show = (dx) => {
    if (!indicator.isConnected) document.body.appendChild(indicator);
    const k = Math.min(1, dx / 90);
    indicator.style.opacity = String(k);
    indicator.style.transform = `translate(${Math.round(-44 + 56 * k)}px, -50%)`;
    indicator.classList.toggle('is-ready', dx >= 72);
  };
  const hide = () => {
    indicator.style.opacity = '0';
    indicator.style.transform = 'translate(-44px, -50%)';
    indicator.classList.remove('is-ready');
  };

  document.addEventListener('touchstart', (event) => {
    swipe = null;
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    if (touch.clientX > EDGE) return;
    swipe = { x: touch.clientX, y: touch.clientY, dx: 0, t: event.timeStamp, active: false };
  }, { passive: true, capture: true });

  document.addEventListener('touchmove', (event) => {
    if (!swipe || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const dx = touch.clientX - swipe.x;
    const dy = touch.clientY - swipe.y;
    if (!swipe.active) {
      if (Math.abs(dy) > 14 && Math.abs(dy) > dx) { swipe = null; hide(); return; }
      if (dx > 10 && dx > Math.abs(dy)) swipe.active = true;
    }
    if (!swipe.active) return;
    swipe.dx = dx;
    if (event.cancelable) event.preventDefault();
    show(dx);
  }, { passive: false, capture: true });

  const finish = (cancelled) => {
    const done = swipe && swipe.active && !cancelled && swipe.dx >= 72;
    swipe = null;
    hide();
    if (done) handleBackButton();
  };
  document.addEventListener('touchend', () => finish(false), { capture: true });
  document.addEventListener('touchcancel', () => finish(true), { capture: true });
}

if (isNative) {
  document.documentElement.classList.add('capacitor-native');
  document.documentElement.dataset.nativePlatform = Capacitor.getPlatform();

  App.addListener('backButton', handleBackButton);
  if (Capacitor.getPlatform() === 'ios') installEdgeSwipeBack();
  const saveProgress = () => {
    try {
      globalThis.save?.();
    } catch (error) {
      console.warn('Native background save failed.', error);
    }
  };
  // Save on WebView lifecycle events as well as the native app callback.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) saveProgress();
  });
  globalThis.addEventListener('pagehide', saveProgress);
  App.addListener('appStateChange', ({ isActive }) => {
    if (!isActive) {
      saveProgress();
      return;
    }

    globalThis.OFFICIAL_EXAM_TIMER?.tick?.();
    globalThis.dispatchEvent(new Event('resize'));
  });
}

globalThis.HISTORY_NATIVE_RUNTIME = Object.freeze({
  isNative,
  platform: Capacitor.getPlatform(),
  closeTopLayer,
  handleBackButton
});
