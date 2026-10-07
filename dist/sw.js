const CACHE_PREFIX='lived-history-shell-';
const CACHE_VERSION='2026-10-07-joseon-story-learning-v38';
const CACHE_NAME=CACHE_PREFIX+CACHE_VERSION;
const APP_SHELL=[
  '/',
  '/index.html',
  '/style.css',
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
  '/editorial.css', '/exam-library.css', '/exam-memory.css', '/exam-memory-results.css', '/exam-memory-nav.css',
  '/editorial-ui.js', '/era-visuals.js', '/joseon-data.js', '/official-exam-catalog.js', '/official-exam-explanations.js', '/v2-learning.js', '/v2-app.js',
  '/joseon-ui.js', '/mnemonic-data.js', '/exam-memory-ui.js',
  '/app.js',
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
      cache.put(request,response.clone());
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
  if(SHELL_PATHS.has(url.pathname))event.respondWith(networkFirst(request));
});
