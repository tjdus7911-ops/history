const CACHE_PREFIX='lived-history-shell-';
const CACHE_VERSION='2026-10-22-jokbo-pretendard-ui-1';
const CACHE_NAME=CACHE_PREFIX+CACHE_VERSION;
const APP_SHELL=[
  '/',
  '/index.html',
  '/chapter-access-ui.js',
  '/story-exam-policy.js',
  '/story-exam-runtime.js',
  '/story-exam-ui.js',
  '/style.css',
  '/fonts/PretendardVariable.woff2',
  '/v2.css',
  '/dialogue.css',
  '/pwa.css',
  '/data.js',
  '/ch02-data.js',
  '/ch03-data.js',
  '/exam-data.js',
  '/ch01-expansion.js','/chapter-split.js','/late-goryeo.js','/official-late-exams.js',
  '/official-exam-images.js','/ch05-refinement.js','/ch06-backgrounds.js','/ch06-quiz-refinement.js',
  '/v2-exam-restoration.js', '/v2-exam-additions.js', '/v2-art.js','/v2-backgrounds.js', '/renewal.css',
  '/editorial.css', '/exam-library.css', '/exam-memory.css', '/exam-memory-results.css', '/exam-memory-nav.css', '/exam-mobile.css', '/ox-quiz.css',
  '/editorial-ui.js', '/era-visuals.js', '/joseon-data.js', '/ancient-data.js', '/proto-story-script.js', '/proto-story-data.js', '/proto-save-data.js', '/proto-revision.css', '/proto-story-ui.js', '/season-data.js', '/official-exam-catalog.js', '/official-exam-choices.js', '/official-exam-explanations.js', '/official-exam-statistics.js', '/ox-quiz-curation.js', '/ox-quiz-data.js', '/v2-learning.js', '/v2-app.js',
  '/joseon-ui.js', '/ancient-ui.js', '/mnemonic-data.js', '/exam-memory-ui.js', '/ox-quiz-ui.js',
  '/app.js',
  '/three-content-config.js','/three-story-script.js','/three-complete-art.js','/three-exam-data.js','/three-story-data.js',
  '/three-season-data.js','/three-save-data.js','/three-story-ui.js',
  '/three-era-isolation.js','/three-service-ui.js','/three-learning-boundary.js','/three-service.css',
  '/three-staging.js','/three-staging.css',
  '/home-v5.js','/home-v5.css','/rev7-theme.css','/rev7-auto.css','/rev7-screens.css',
  '/rev7-layouts.css','/rev7-layouts.js','/rev7-ox-layouts.js','/rev7-story-layouts.js','/rev7-story-player.js','/rev7-exam-layouts.js',
  '/story-mobile-qa.css',
  '/app-navigation.css','/ui-refresh.css',
  '/jokbo.css','/jokbo-data.js','/jokbo-ui.js','/story-release-policy.js',
  '/rev7-resource-states.js',
  '/media/rev7/user.svg','/media/rev7/chevron.svg','/media/rev7/chart.svg','/media/rev7/back.svg','/media/rev7/check.svg','/media/rev7/down.svg','/media/rev7/empty-wrong.svg','/media/rev7/close.svg',
  '/media/rev7/timeline-rail.svg','/media/rev7/timeline-rail-next.svg','/media/rev7/story-back.svg','/media/rev7/story-more.svg','/media/rev7/exam-close.svg','/media/rev7/exam-paused-clock.svg', '/media/rev7/exam-empty-chart.svg', '/media/rev7/exam-clock.svg','/media/rev7/exam-pause.svg','/media/rev7/exam-list.svg',
  '/media/rev7/story-loading.svg','/media/rev7/story-offline.svg','/media/rev7/offline.svg',
  '/media/rev7/search.svg','/media/rev7/bookmark.svg','/media/rev7/bookmark-filled.svg',
  '/media/proto-v4/ancient-modern-museum.jpg','/media/proto-v4/buyeo-village.webp','/media/proto-v4/player-v3.png','/media/proto-v4/sibling-v3.png','/media/proto-v4/naru-v3.png',
  '/pwa.js',
  '/manifest.webmanifest',
  '/goryeo.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png'
];
const SHELL_PATHS=new Set(APP_SHELL.map(path=>new URL(path,self.location.origin).pathname));

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE_NAME).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

async function networkFirst(request,fallbackPath){
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(response.ok){
      const cache=await caches.open(CACHE_NAME);
      await cache.put(request,response.clone());
      return response;
    }
    const cached=await caches.match(request);
    if(cached)return cached;
    if(fallbackPath){
      const fallback=await caches.match(fallbackPath);
      if(fallback)return fallback;
    }
    return response;
  }catch(error){
    const cached=await caches.match(request);
    if(cached)return cached;
    if(fallbackPath){
      const fallback=await caches.match(fallbackPath);
      if(fallback)return fallback;
    }
    throw error;
  }
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    event.respondWith(networkFirst(request,'/index.html'));
    return;
  }
  if(url.pathname==='/official-exam-explanations.json'){
    event.respondWith(networkFirst(request));
    return;
  }
  if(SHELL_PATHS.has(url.pathname))event.respondWith(networkFirst(request));
});


