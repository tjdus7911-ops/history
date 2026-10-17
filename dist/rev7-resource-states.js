/* Resource loading/retry presentation only. Stored content and learning records are never changed. */
(function(){
 'use strict';
 if(typeof document==='undefined'||typeof Image==='undefined')return;
 const loaded=new Map();let currentSceneUrl=null;
 function offlineFallback(){
  if(navigator.onLine!==false||globalThis.CORE_APP_READY)return;
  const root=document.getElementById('app');if(!root)return;
  root.innerHTML='<main class="r7-page r7-offline" data-figma-frame="C-01"><span class="r7-empty-icon"><img src="media/rev7/offline.svg" alt=""></span><h1>인터넷에 연결되어 있지 않아요</h1><p>저장된 이야기와 기출은 그대로 볼 수 있어요. 새로 받아야 하는 화면만 연결 후 열려요.</p><button class="r7-primary" data-r7-offline-retry>다시 시도</button></main>';
 }
 function storyState(game,url,state){
  game.querySelector('.r7-story-resource')?.remove();if(state==='ready')return;
  const overlay=document.createElement('section');overlay.className='r7-page r7-story-resource';overlay.setAttribute('data-figma-frame',state==='loading'?'S-17':'S-18');overlay.setAttribute('role',state==='loading'?'status':'alert');
  overlay.innerHTML=state==='loading'?'<span class="r7-loading-icon" aria-hidden="true"><img src="media/rev7/story-loading.svg" alt=""></span><h2>이야기를 불러오고 있어요</h2><p>잠시만 기다려 주세요</p>':'<span class="r7-empty-icon"><img src="media/rev7/story-offline.svg" alt=""></span><h2>이야기를 불러오지 못했어요</h2><p>인터넷 연결을 확인한 뒤 다시 시도해 주세요. 읽던 기록은 그대로 남아 있어요.</p><button class="r7-primary" data-r7-story-retry>다시 시도</button><button class="r7-secondary" data-nav="era">챕터 목록으로</button>';
  game.append(overlay);
 }
 function inspectStory(){
  const game=document.querySelector('.r7-story-play');if(!game)return;
  const style=getComputedStyle(game).backgroundImage,url=/url\(["']?(.+?)["']?\)/.exec(style)?.[1];if(!url)return;
  currentSceneUrl=url;
  if(loaded.has(url)){storyState(game,url,loaded.get(url));return;}
  loaded.set(url,'loading');storyState(game,url,'loading');const preload=new Image();
  const finish=state=>{loaded.set(url,state);const current=document.querySelector('.r7-story-play');if(current&&currentSceneUrl===url)storyState(current,url,state);};
  preload.onload=()=>finish('ready');preload.onerror=()=>finish('failed');preload.src=url;
 }
 document.addEventListener('error',function(event){
  const target=event.target;
  if(target?.tagName==='SCRIPT'){offlineFallback();return;}
  if(target?.tagName!=='IMG'||!target.closest('.official-paper'))return;
  const figure=target.closest('.official-paper');if(figure.querySelector('.r7-paper-error'))return;
  target.dataset.r7RetrySource=target.currentSrc||target.src;target.hidden=true;
  const error=document.createElement('div');error.className='r7-paper-error';error.setAttribute('role','alert');error.setAttribute('data-figma-frame','E-18');error.innerHTML='<p>문제 이미지를 불러오지 못했어요</p><button type="button" data-r7-paper-retry>이미지 다시 불러오기</button>';figure.append(error);
 },true);
 document.addEventListener('click',function(event){
  const button=event.target.closest('button');if(!button)return;
  if(button.hasAttribute('data-r7-offline-retry')){event.stopImmediatePropagation();location.reload();}
  if(button.hasAttribute('data-r7-story-retry')){event.stopImmediatePropagation();loaded.delete(currentSceneUrl);inspectStory();}
  if(button.hasAttribute('data-r7-paper-retry')){event.stopImmediatePropagation();const figure=button.closest('.official-paper'),img=figure?.querySelector('img[data-r7-retry-source]');if(!img)return;figure.querySelector('.r7-paper-error')?.remove();img.hidden=false;const src=img.dataset.r7RetrySource;img.removeAttribute('src');img.src=src;}
 },true);
 // This hook is attached after the app scripts have initialized their final renderer.
 document.addEventListener('DOMContentLoaded',function(){if(typeof render==='function'){const before=render;render=function(){before();inspectStory();};inspectStory();}});
  // Paint the real boot interval without delaying the synchronous saved-note reader.
  if((location.hash||'').replace(/^#\/?/,'')==='study'){
    const root=document.getElementById('app');
    if(root&&!root.textContent)root.innerHTML='<main class="r7-page r7-notes-loading" data-figma-frame="W-09" aria-busy="true"><header class="r7-heading"><h1>오답노트</h1></header>'+Array.from({length:5},()=>'<div class="r7-skeleton-row"><i></i><i></i><i></i></div>').join('')+'</main>';
  }
})();
