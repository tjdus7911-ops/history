import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

const isNative = Capacitor.isNativePlatform();
let appActive = true;

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

  await App.exitApp();
}

if (isNative) {
  document.documentElement.classList.add('capacitor-native');
  document.documentElement.dataset.nativePlatform = Capacitor.getPlatform();

  App.addListener('backButton', handleBackButton);
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
    appActive = isActive;
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
  get isActive() { return appActive; },
  platform: Capacitor.getPlatform(),
  closeTopLayer,
  handleBackButton
});
