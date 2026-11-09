/* 최초 실행 기능 안내(코치 마크)
 * - 처음 홈에 들어왔을 때 한 번만 자동으로 보여 준다(저장 키: history-coach:v1).
 * - 반투명 오버레이 위에 설명할 버튼만 밝게 비추고, 짧은 말풍선으로 설명한다. 다음 / 건너뛰기 / 완료.
 * - 내 기록 › '앱 사용법 다시 보기'에서 언제든 다시 볼 수 있다.
 * - 이 앱에는 별도 온보딩 화면이 없어서 역할이 겹치지 않는다(스토리 프롤로그는 이야기 도입부).
 * - 자동화 테스트 브라우저(navigator.webdriver)에서는 자동으로 띄우지 않는다. ?coach=1 로 강제 실행 가능. */
(function () {
  'use strict';
  if (typeof render !== 'function') return;
  const KEY = 'history-coach:v1';
  const store = (() => { try { return globalThis.localStorage; } catch { return null; } })();
  const seen = () => { try { return store?.getItem(KEY) === 'done'; } catch { return true; } };
  const markSeen = () => { try { store?.setItem(KEY, 'done'); } catch {} };
  const forced = /(?:^|[?&])coach=1(?:&|$)/.test(globalThis.location?.search || '');

  const STEPS = [
    { target: '.hv-shortcut-story, .hv-era-btn', title: '스토리 학습', text: '시대 속으로 들어가 이야기를 읽으며 핵심 개념을 배워요.' },
    { target: 'nav [data-nav="exam-library"]', title: '기출문제', text: '실제 한능검 기출을 시험처럼, 또는 해설을 보며 풀어요.' },
    { target: 'nav [data-nav="ox"]', title: 'OX 퀴즈', text: '핵심 개념을 O·X로 빠르게 확인해요. 카드를 좌우로 밀어도 돼요.' },
    { target: 'nav [data-nav="study"]', title: '오답노트', text: '틀린 문제가 모여요. 다시 풀면서 약한 부분을 채워요.' },
    { target: '[data-jk-open]', title: '족보', text: '시대별 핵심 정리를 한 장씩 넘겨 봐요. 저장도 할 수 있어요.' },
    { target: 'nav [data-nav="records"]', title: '내 기록', text: '학습 기록과 취약한 시대 분석을 확인해요.' }
  ];
  let index = -1, layer = null;

  const visible = (el) => { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  function target(step) { return [...document.querySelectorAll(step.target)].find(visible) || null; }

  function close(done = true) {
    if (done) markSeen();
    index = -1; layer?.remove(); layer = null;
    document.body.classList.remove('coach-open');
    window.removeEventListener('resize', place);
  }
  function place() {
    if (index < 0 || !layer) return;
    const step = STEPS[index], el = target(step);
    if (!el) { next(); return; }
    el.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    const r = el.getBoundingClientRect(), pad = 6;
    const spot = layer.querySelector('.coach-spot'), bubble = layer.querySelector('.coach-bubble');
    Object.assign(spot.style, { left: r.left - pad + 'px', top: r.top - pad + 'px', width: r.width + pad * 2 + 'px', height: r.height + pad * 2 + 'px' });
    const below = r.top < innerHeight / 2;
    const width = Math.min(320, innerWidth - 32);
    const left = Math.max(16, Math.min(innerWidth - width - 16, r.left + r.width / 2 - width / 2));
    bubble.style.width = width + 'px'; bubble.style.left = left + 'px';
    bubble.style.top = below ? r.bottom + pad + 12 + 'px' : ''; bubble.style.bottom = below ? '' : innerHeight - r.top + pad + 12 + 'px';
    bubble.dataset.side = below ? 'below' : 'above';
    bubble.querySelector('.coach-arrow').style.left = Math.max(16, Math.min(width - 16, r.left + r.width / 2 - left)) + 'px';
  }
  function show(i) {
    index = i;
    const step = STEPS[i], last = i === STEPS.length - 1;
    layer.querySelector('.coach-bubble').innerHTML = '<i class="coach-arrow" aria-hidden="true"></i><small>' + (i + 1) + ' / ' + STEPS.length + '</small><h2 id="coach-title">' + step.title + '</h2><p>' + step.text + '</p>'
      + '<div class="coach-actions">' + (last ? '' : '<button type="button" class="coach-skip" data-coach-skip>건너뛰기</button>') + '<button type="button" class="coach-next" data-coach-next>' + (last ? '완료' : '다음') + '</button></div>';
    place();
    layer.querySelector('[data-coach-next]')?.focus({ preventScroll: true });
  }
  function next() {
    for (let i = index + 1; i < STEPS.length; i++) if (target(STEPS[i])) return show(i);
    close(true);
  }
  function start() {
    if (layer || typeof screen === 'undefined' || screen !== 'home' || modal) return false;
    if (!STEPS.some((s) => target(s))) return false;
    layer = document.createElement('div');
    layer.className = 'coach-layer';
    layer.setAttribute('role', 'dialog'); layer.setAttribute('aria-modal', 'true'); layer.setAttribute('aria-labelledby', 'coach-title');
    layer.innerHTML = '<div class="coach-spot" aria-hidden="true"></div><section class="coach-bubble"></section>';
    document.body.appendChild(layer); document.body.classList.add('coach-open');
    window.addEventListener('resize', place);
    index = -1; next();
    return true;
  }

  document.addEventListener('click', (event) => {
    const b = event.target.closest?.('button');
    if (b && 'coachReplay' in b.dataset) { event.stopImmediatePropagation(); if (typeof navigate === 'function') navigate('home'); setTimeout(start, 120); return; }
    if (!layer) return;
    if (!event.target.closest('.coach-bubble')) { event.stopImmediatePropagation(); event.preventDefault(); return; } // 안내 중에는 뒤 화면을 누르지 않게
    if (b && 'coachNext' in b.dataset) { event.stopImmediatePropagation(); index === STEPS.length - 1 ? close(true) : next(); }
    if (b && 'coachSkip' in b.dataset) { event.stopImmediatePropagation(); close(true); }
  }, true);
  document.addEventListener('keydown', (event) => { if (layer && event.key === 'Escape') { event.stopImmediatePropagation(); close(true); } }, true);

  // 내 기록에 '앱 사용법 다시 보기'
  const contentBefore = renderContent;
  renderContent = function () {
    const html = contentBefore.apply(this, arguments);
    if (typeof screen !== 'undefined' && screen === 'records' && typeof html === 'string' && html.includes('data-figma-frame="M-01"') && !html.includes('data-coach-replay')) {
      const chevron = (html.match(/<button data-nav="study"><span>[\s\S]*?<\/span>([\s\S]*?)<\/button>/) || [])[1] || '';
      return html.replace(/(<div class="r7-my-links">[\s\S]*?)(<\/div><\/section>)$/, (all, links, end) => links + '<button data-coach-replay><span><b>앱 사용법 다시 보기</b><small>스토리 · 기출 · OX · 오답노트 · 족보 · 내 기록</small></span>' + chevron + '</button>' + end);
    }
    return html;
  };

  function autoStart() {
    if (seen() && !forced) return;
    if (globalThis.navigator?.webdriver && !forced) return;
    setTimeout(() => { if (!start()) setTimeout(start, 800); }, 600);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoStart); else autoStart();

  globalThis.COACH_TOUR = Object.freeze({ start, close, steps: STEPS.map((s) => s.title), seen });
})();
