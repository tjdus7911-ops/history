/* 족보 단톡방 (route: chat, chat/<roomId>)
 * - 홈의 족보 FAB 위에 '단톡방' FAB를 하나 더 쌓는다(홈에서만).
 * - 목록: 시대 칩(전체·시대별·유물)으로 거르고, 안 읽은 방에는 점을 찍는다.
 * - 방: 처음 들어가면 메시지가 읽는 속도에 맞춰 자동으로 올라온다('전체 보기'로 한 번에).
 *        한 번 끝까지 본 방은 다음부터 전부 펼친 상태로 열린다('다시 재생' 가능). */
(function () {
  'use strict';
  const ROOMS = globalThis.JOKBO_CHAT_ROOMS;
  const views = globalThis.REV7_OX_VIEWS;
  if (!Array.isArray(ROOMS) || !ROOMS.length || typeof renderContent !== 'function' || typeof shell !== 'function' || !views?.addRoute) return;

  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const byId = new Map(ROOMS.map((r) => [r.id, r]));
  const ERAS = (globalThis.JOKBO_DATA?.eras || []).filter((e) => ROOMS.some((r) => r.era === e.id && r.kind !== 'artifact'));
  const CHIPS = [{ id: 'all', label: '전체' }, ...ERAS.map((e) => ({ id: e.id, label: e.label })), { id: 'artifact', label: '유물' }];
  const READ_KEY = 'jokbo-chat-read-v1';
  const store = (() => { try { return globalThis.localStorage || null; } catch { return null; } })();
  const readSet = new Set((() => { try { const v = JSON.parse(store?.getItem(READ_KEY) || '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []; } catch { return []; } })());
  const saveRead = () => { try { store?.setItem(READ_KEY, JSON.stringify([...readSet])); } catch {} };
  const reduceMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

  const chatIcon = '<svg viewBox="0 0 24 24" class="jkc-ico" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z"/><path d="M8 8.5h8M8 11.5h5"/></svg>';
  const backIcon = '<svg viewBox="0 0 24 24" class="jkc-back-ico" aria-hidden="true"><path d="M15.5 18 9.5 12l6-6"/></svg>';

  let chip = 'all';
  let roomId = null;
  let listScroll = 0;
  let pushedFromHome = false;
  // 재생 상태
  let shown = 0;
  let timer = null;
  let playing = false;

  const memoOf = (room) => {
    const memo = [...room.msgs].reverse().find((m) => m[0] === 's' && m[2].startsWith('📌'));
    return memo ? memo[2].replace(/^📌\s*암기:\s*/, '') : room.subtitle;
  };
  const plain = (html) => String(html || '').replace(/<[^>]+>/g, '');
  const unreadCount = () => ROOMS.filter((r) => !readSet.has(r.id)).length;

  function avatar(room, name, size) {
    const m = room.members.find((x) => x.name === name);
    if (m?.photo) return '<span class="jkc-av' + (size ? ' is-' + size : '') + '"><img src="media/people/' + esc(m.photo) + '.webp" alt="" loading="lazy" decoding="async"></span>';
    return '<span class="jkc-av is-emoji' + (size ? ' is-' + size : '') + '" style="background:' + esc(m?.color || '#ffe3dc') + '">' + esc(m?.emoji || String(name || '').slice(0, 1)) + '</span>';
  }
  function roomCover(room) {
    const ms = room.members.slice(0, 2);
    return '<span class="jkc-cover' + (ms.length > 1 ? ' is-pair' : '') + '">' + ms.map((m) => avatar(room, m.name, 'sm')).join('') + '</span>';
  }

  function listHTML() {
    const rooms = ROOMS.filter((r) => chip === 'all' || (chip === 'artifact' ? r.kind === 'artifact' : r.era === chip && r.kind !== 'artifact'));
    const head = '<header class="jkc-appbar"><button type="button" class="jkc-iconbtn" data-chat-back aria-label="홈으로 돌아가기">' + backIcon + '</button><h1>단톡방</h1><span class="jkc-appbar-space"></span></header>'
      + '<p class="jkc-lead">인물들의 단톡방을 구경하며 기출 핵심을 외워요</p>'
      + '<div class="jkc-chips" role="tablist" aria-label="시대 선택">' + CHIPS.map((c) => '<button type="button" role="tab" data-chat-chip="' + c.id + '" aria-selected="' + (c.id === chip) + '">' + esc(c.label) + '</button>').join('') + '</div>';
    const items = rooms.map((r) => {
      const unread = !readSet.has(r.id);
      return '<button type="button" class="jkc-row" data-chat-room="' + esc(r.id) + '">' + roomCover(r)
        + '<span class="jkc-row-body"><span class="jkc-row-top"><b>' + esc(r.title) + '</b><small>' + (r.members.length + 1) + '</small></span>'
        + '<span class="jkc-row-preview">' + esc(memoOf(r)) + '</span></span>'
        + (unread ? '<i class="jkc-new" aria-label="안 읽음">N</i>' : '<i class="jkc-read" aria-hidden="true"></i>') + '</button>';
    }).join('');
    return '<section class="jkc-page jkc-list" data-page="chat">' + head + '<div class="jkc-rows">' + items + '</div></section>';
  }

  function msgHTML(room, m, i) {
    const [side, who, text] = m, on = i < shown ? ' is-shown' : '';
    const fmt = (t) => esc(t).replace(/@(\S+)/g, '<i class="jkc-at">@$1</i>');
    if (side === 's') return '<div class="jkc-msg is-sys' + (text.startsWith('📌') ? ' is-memo' : '') + on + '" data-i="' + i + '"><span>' + fmt(text) + '</span></div>';
    if (side === 'me') return '<div class="jkc-msg is-me' + on + '" data-i="' + i + '"><div class="jkc-bub">' + fmt(text) + '</div></div>';
    const body = text.startsWith('img:')
      ? '<div class="jkc-bub is-photo"><img src="media/chat/' + esc(text.slice(4).split('|')[0]) + '.webp" alt="' + esc(who) + '이(가) 보낸 유물 사진" loading="lazy" decoding="async"></div>'
      : '<div class="jkc-bub">' + fmt(text) + '</div>';
    return '<div class="jkc-msg' + on + '" data-i="' + i + '">' + avatar(room, who) + '<div class="jkc-msg-col"><b class="jkc-name">' + esc(who) + '</b>' + body + '</div></div>';
  }

  function roomHTML() {
    const room = byId.get(roomId);
    if (!room) return listHTML();
    const idx = ROOMS.indexOf(room), next = ROOMS[idx + 1];
    const all = room.msgs.map((m, i) => msgHTML(room, m, i)).join(''), done = shown >= room.msgs.length;
    return '<section class="jkc-page jkc-room" data-page="chat-room">'
      + '<header class="jkc-appbar is-room"><button type="button" class="jkc-iconbtn" data-chat-back aria-label="단톡방 목록으로">' + backIcon + '</button><h1>' + esc(room.title) + ' <small>' + (room.members.length + 1) + '</small></h1>'
      + '<button type="button" class="jkc-textbtn" data-chat-skip' + (done ? ' hidden' : '') + '>전체 보기</button></header>'
      + '<div class="jkc-thread" data-chat-thread aria-live="polite">' + all + '</div>'
      + '<div class="jkc-end" data-chat-end' + (done ? '' : ' hidden') + '><p>' + esc(plain(room.subtitle)) + '</p><div class="jkc-end-actions"><button type="button" class="jkc-secondary" data-chat-replay>다시 재생</button>'
      + (next ? '<button type="button" class="jkc-primary" data-chat-room="' + esc(next.id) + '">다음 방 · ' + esc(next.title) + '</button>' : '<button type="button" class="jkc-primary" data-chat-back>목록으로</button>') + '</div></div>'
      + '</section>';
  }

  // ---------- 재생 ----------
  const delayOf = (m) => m[2].startsWith('img:') ? 1900 : (m[0] === 's' && !m[2].startsWith('📌')) ? 800 : 1000 + [...m[2]].length * 56;
  function stop() { clearTimeout(timer); timer = null; playing = false; }
  function thread() { return document.querySelector('[data-chat-thread]'); }
  function reveal(n, smooth) {
    const t = thread(); if (!t) return;
    const nodes = t.children;
    for (let i = 0; i < nodes.length; i += 1) nodes[i].classList.toggle('is-shown', i < n);
    shown = n;
    const room = byId.get(roomId), done = room && n >= room.msgs.length;
    const end = document.querySelector('[data-chat-end]'), skip = document.querySelector('[data-chat-skip]');
    if (end) end.hidden = !done;
    if (skip) skip.hidden = done;
    if (done && room && !readSet.has(room.id)) { readSet.add(room.id); saveRead(); }
    const last = n > 0 ? nodes[n - 1] : null;
    if (last && !done) {
      const rect = last.getBoundingClientRect(), limit = (globalThis.innerHeight || 800) - 120;
      if (rect.bottom > limit) window.scrollBy({ top: rect.bottom - limit, behavior: smooth && !reduceMotion() ? 'smooth' : 'auto' });
    } else if (done && smooth) {
      document.querySelector('[data-chat-end]')?.scrollIntoView({ block: 'end', behavior: reduceMotion() ? 'auto' : 'smooth' });
    }
  }
  function step() {
    const room = byId.get(roomId); if (!room) return stop();
    if (shown >= room.msgs.length) return stop();
    reveal(shown + 1, true);
    if (shown >= room.msgs.length) return stop();
    timer = setTimeout(step, delayOf(room.msgs[shown - 1]));
  }
  function play(fromStart) {
    stop(); playing = true;
    if (fromStart) { reveal(0, false); window.scrollTo(0, 0); }
    timer = setTimeout(step, 350);
  }
  function showAll(smooth) { stop(); const room = byId.get(roomId); if (room) reveal(room.msgs.length, smooth); }

  // ---------- 화면 연결 ----------
  const renderBefore = renderContent;
  renderContent = function () {
    if (screen === 'jokbo-chat') return listHTML();
    if (screen === 'jokbo-chat-room') return roomHTML();
    return renderBefore.apply(this, arguments);
  };
  const shellBefore = shell;
  shell = function (content) {
    const html = shellBefore.apply(this, arguments);
    if (screen !== 'home' || typeof html !== 'string' || !html.includes('class="jk-fab-dock"')) return html;
    const badge = unreadCount() ? '<i class="jkc-fab-dot" aria-hidden="true"></i>' : '';
    return html.replace('app-nav-shell has-jk-fab', 'app-nav-shell has-jk-fab has-chat-fab')
      .replace('<div class="jk-fab-dock">', '<div class="jk-fab-dock" data-has-chat><button type="button" class="jkc-fab" data-chat-open aria-label="단톡방 열기">' + chatIcon + badge + '</button>');
  };

  views.addRoute('chat');
  for (const r of ROOMS) views.addRoute('chat/' + r.id);
  const applyBefore = views.applyRoute;
  views.setApplyRoute(function (route = views.readRoute()) {
    if (route === 'chat') { stop(); screen = 'jokbo-chat'; roomId = null; modal = null; render(); window.scrollTo(0, listScroll); return route; }
    if (route?.startsWith('chat/') && byId.has(route.slice(5))) { openRoom(route.slice(5), false); return route; }
    stop();
    return applyBefore(route);
  });

  function openList() {
    pushedFromHome = screen === 'home'; listScroll = 0; stop();
    screen = 'jokbo-chat'; roomId = null; modal = null; views.writeRoute('chat'); render(); window.scrollTo(0, 0);
  }
  function openRoom(id, push) {
    if (!byId.has(id)) return;
    if (screen === 'jokbo-chat') listScroll = globalThis.scrollY || 0;
    stop(); roomId = id; screen = 'jokbo-chat-room'; modal = null;
    const replayed = !(readSet.has(id) || reduceMotion());
    shown = replayed ? 0 : byId.get(id).msgs.length;
    if (push) views.writeRoute('chat/' + id);
    render(); window.scrollTo(0, 0);
    if (replayed) play(false);
  }
  function goBack() {
    stop();
    const state = globalThis.history?.state;
    if (state?.appRoute && String(state.appRoute).startsWith('chat') && globalThis.history.length > 1 && (screen === 'jokbo-chat-room' || pushedFromHome)) { globalThis.history.back(); return; }
    const target = screen === 'jokbo-chat-room' ? 'chat' : 'home';
    views.writeRoute(target, true); views.applyRoute(target);
  }

  document.addEventListener('click', (event) => {
    const b = event.target.closest('button');
    if (b) {
      const d = b.dataset;
      if ('chatOpen' in d) { event.preventDefault(); event.stopImmediatePropagation(); openList(); return; }
      if (!screen.startsWith('jokbo-chat')) return;
      if ('chatBack' in d) { event.stopImmediatePropagation(); goBack(); return; }
      if (d.chatChip) { event.stopImmediatePropagation(); chip = d.chatChip; render(); window.scrollTo(0, 0); return; }
      if (d.chatRoom) { event.stopImmediatePropagation(); openRoom(d.chatRoom, true); return; }
      if ('chatSkip' in d) { event.stopImmediatePropagation(); showAll(true); return; }
      if ('chatReplay' in d) { event.stopImmediatePropagation(); play(true); return; }
      return;
    }
  }, true);

  globalThis.JOKBO_CHAT_API = Object.freeze({ rooms: () => ROOMS.map((r) => ({ id: r.id, era: r.era, kind: r.kind, title: r.title, read: readSet.has(r.id) })), open: openList, openRoom: (id) => openRoom(id, true), unread: unreadCount });
})();
