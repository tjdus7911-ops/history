const CACHE_PREFIX='lived-history-shell-';
const CACHE_VERSION='2026-10-12-asset-loading-v1';
const CACHE_NAME=CACHE_PREFIX+CACHE_VERSION;
const APP_SHELL=[
  '/',
  '/index.html',
  '/chapter-access-ui.js',
  '/story-exam-policy.js',
  '/story-exam-runtime.js',
  '/story-exam-ui.js',
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
  '/editorial.css', '/exam-library.css', '/exam-memory.css', '/exam-memory-results.css', '/exam-memory-nav.css', '/ox-quiz.css',
  '/editorial-ui.js', '/era-visuals.js', '/joseon-data.js', '/ancient-data.js', '/proto-story-script.js', '/proto-story-data.js', '/proto-save-data.js', '/proto-revision.css', '/proto-art.js', '/proto-background-art.js', '/proto-story-ui.js', '/season-data.js', '/official-exam-catalog.js', '/official-exam-explanations.js', '/ox-quiz-curation.js', '/ox-quiz-data.js', '/v2-learning.js', '/v2-app.js',
  '/joseon-ui.js', '/ancient-ui.js', '/mnemonic-data.js', '/exam-memory-ui.js', '/ox-quiz-ui.js',
  '/app.js',
  '/three-content-config.js','/three-story-script.js','/three-complete-art.js','/three-exam-data.js','/three-story-data.js',
  '/three-season-data.js','/three-save-data.js','/three-story-ui.js',
  '/three-era-isolation.js','/three-service-ui.js','/three-learning-boundary.js','/three-service.css',
  '/three-staging.js','/three-staging.css',
  '/image-preloader.js',
  '/pwa.js',
  '/manifest.webmanifest',
  '/goryeo.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png'
];
const CORE_SHELL=APP_SHELL.filter(path=>path==='/'||path==='/index.html'||path.endsWith('.css')||path.endsWith('.webmanifest')||path.startsWith('/icons/')||path==='/image-preloader.js'||path==='/pwa.js');
const DEFERRED_SHELL=APP_SHELL.filter(path=>!CORE_SHELL.includes(path));
const SHELL_PATHS=new Set(APP_SHELL.map(path=>new URL(path,self.location.origin).pathname));

async function warmDeferredShell(cache){
  let cursor=0;
  async function worker(){
    while(cursor<DEFERRED_SHELL.length){
      const path=DEFERRED_SHELL[cursor++];
      await cache.add(path);
    }
  }
  const results=await Promise.allSettled([worker(),worker()]);
  const failure=results.find(result=>result.status==='rejected');
  if(failure)throw failure.reason;
}

async function installShell(){
  const cache=await caches.open(CACHE_NAME);
  try{
    await cache.addAll(CORE_SHELL);
    await warmDeferredShell(cache);
  }catch(error){
    await caches.delete(CACHE_NAME);
    throw error;
  }
}

self.addEventListener('install',event=>{
  // Registration starts after window.load. Warm the large dependency set with
  // bounded concurrency, then activate only when a complete offline shell is
  // ready. A failed install keeps the previous worker/cache authoritative.
  event.waitUntil(installShell().then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE_NAME).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

function writeThrough(event,cachePromise,request,response){
  let copy;try{copy=response.clone()}catch{return Promise.resolve()}
  const write=Promise.resolve(cachePromise).then(cache=>cache.put(request,copy)).catch(()=>undefined);
  event?.waitUntil?.(write);return write;
}

async function networkFirst(request,fallbackPath,event){
  try{
    const response=await fetch(request);
    if(response.ok)writeThrough(event,caches.open(CACHE_NAME),request,response);
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

async function staleWhileRevalidate(event,request){
  const network=fetch(request).then(response=>({response}),error=>({error}));
  const cachePromise=caches.open(CACHE_NAME);
  const cached=cachePromise.then(cache=>cache.match(request)).catch(()=>undefined);
  const winner=await Promise.race([network,cached.then(response=>response?{cached:response}:network)]);
  if(winner.cached){
    const update=network.then(result=>result.response?.ok?cachePromise.then(cache=>cache.put(request,result.response.clone())):undefined).catch(()=>undefined);
    event?.waitUntil?.(update);return winner.cached;
  }
  if(winner.response){
    if(winner.response.ok){writeThrough(event,cachePromise,request,winner.response);return winner.response}
    const fallback=await cached;return fallback||winner.response;
  }
  const fallback=await cached;if(fallback)return fallback;throw winner.error;
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    event.respondWith(networkFirst(request,'/index.html',event));
    return;
  }
  if(SHELL_PATHS.has(url.pathname))event.respondWith(staleWhileRevalidate(event,request));
});
