const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');

const listeners={};
const shellAdds=[];
const deleted=[];
let activeAdds=0,maxActiveAdds=0,claimed=false,skipped=false;
let failPath=null;
let cachePut=()=>Promise.resolve();
let openCache=async()=>cache;
const stored=new Map();
const cache={
  async addAll(paths){shellAdds.push({kind:'core',paths:[...paths]})},
  async add(path){
    activeAdds++;maxActiveAdds=Math.max(maxActiveAdds,activeAdds);
    shellAdds.push({kind:'deferred',path});
    try{
      await new Promise(resolve=>setTimeout(resolve,1));
      if(path===failPath)throw new Error('offline shell fetch failed');
      stored.set(path,{url:path});
    }finally{activeAdds--}
  },
  async match(request){return stored.get(typeof request==='string'?request:request.url)},
  put(request,response){return cachePut(request,response)}
};
const caches={
  open(...args){return openCache(...args)},
  async keys(){return ['lived-history-shell-old','unrelated-cache']},
  async delete(key){deleted.push(key);return true},
  async match(request){return cache.match(request)}
};
const self={
  location:{origin:'https://history.test'},
  clients:{async claim(){claimed=true}},
  async skipWaiting(){skipped=true},
  addEventListener(type,listener){listeners[type]=listener}
};
const context=vm.createContext({self,caches,fetch:async()=>{throw new Error('fetch not configured')},URL,Promise,setTimeout,clearTimeout,console});
const source=fs.readFileSync('dist/sw.js','utf8')+'\n;this.__swTest={CACHE_NAME,APP_SHELL,CORE_SHELL,DEFERRED_SHELL,warmDeferredShell,installShell,networkFirst,staleWhileRevalidate};';
vm.runInContext(source,context,{filename:'dist/sw.js'});

function dispatch(type,event={}){
  const waits=[];
  listeners[type]({...event,waitUntil(promise){waits.push(Promise.resolve(promise))}});
  return Promise.all(waits);
}

(async()=>{
  failPath='/data.js';
  await assert.rejects(dispatch('install'),/offline shell fetch failed/);
  assert(!skipped,'an incomplete offline shell must not activate');
  assert(deleted.includes(context.__swTest.CACHE_NAME),'a partial version cache must be discarded');
  assert(!deleted.includes('lived-history-shell-old'),'a failed install must retain the previous offline cache');
  failPath=null;shellAdds.length=0;
  await dispatch('install');
  assert(skipped,'install must finish with skipWaiting');
  const core=shellAdds.find(entry=>entry.kind==='core')?.paths||[];
  assert(core.includes('/index.html')&&core.includes('/image-preloader.js'));
  assert(!core.includes('/data.js'),'large scripts belong to the bounded post-load install lane');

  const deferred=shellAdds.filter(entry=>entry.kind==='deferred').map(entry=>entry.path);
  assert(deferred.includes('/data.js')&&deferred.includes('/three-story-script.js'),'offline install must include the application data and Three story');
  assert.equal(deferred.length,context.__swTest.DEFERRED_SHELL.length,'every deferred shell dependency must be cached before activation');
  assert(maxActiveAdds<=2,'offline install concurrency must stay bounded');

  await dispatch('activate');
  assert(claimed,'activate must claim clients');
  assert(deleted.includes('lived-history-shell-old'),'activate must remove the superseded complete app cache');
  assert(!deleted.includes('unrelated-cache'),'unrelated caches must remain untouched');

  const response={ok:true,clone(){return {cloneOf:this}}};
  openCache=()=>new Promise(()=>{});
  context.fetch=async()=>response;
  const delayedOpenWaits=[];
  const delayedOpen=context.__swTest.networkFirst({url:'https://history.test/index.html'},null,{waitUntil(promise){delayedOpenWaits.push(promise)}});
  const openRace=await Promise.race([delayedOpen,new Promise(resolve=>setTimeout(()=>resolve('blocked'),25))]);
  assert.strictEqual(openRace,response,'opening Cache Storage must not block a successful navigation response');
  assert.equal(delayedOpenWaits.length,1,'the pending cache open should stay outside the response path');

  openCache=async()=>cache;
  let releasePut,rejectPut;
  cachePut=()=>new Promise((resolve,reject)=>{releasePut=resolve;rejectPut=reject});
  context.fetch=async()=>response;
  const writeWaits=[];
  const event={waitUntil(promise){writeWaits.push(Promise.resolve(promise))}};
  const request={url:'https://history.test/data.js'};
  const networkPromise=context.__swTest.networkFirst(request,null,event);
  const raced=await Promise.race([networkPromise,new Promise(resolve=>setTimeout(()=>resolve('blocked'),25))]);
  assert.strictEqual(raced,response,'Cache Storage writes must not block a successful network response');
  assert.equal(writeWaits.length,1,'cache writes should be kept alive by waitUntil');
  rejectPut(new Error('quota exceeded'));
  await Promise.all(writeWaits);

  openCache=async()=>{throw new Error('Cache Storage unavailable')};
  const degraded=await context.__swTest.staleWhileRevalidate({waitUntil(){}},{url:'https://history.test/app.js'});
  assert.strictEqual(degraded,response,'shell requests must fall back to the network when Cache Storage is unavailable');

  openCache=async()=>cache;
  const originalMatch=cache.match.bind(cache),cachedShell={ok:true,source:'cache'};
  cache.match=async()=>{await new Promise(resolve=>setTimeout(resolve,10));return cachedShell};
  context.fetch=async()=>({ok:false,status:503,clone(){return this}});
  const recovered=await context.__swTest.staleWhileRevalidate({waitUntil(){}},{url:'https://history.test/app.js'});
  assert.strictEqual(recovered,cachedShell,'a fast HTTP error must not beat a slightly slower valid shell cache');
  cache.match=originalMatch;context.fetch=async()=>response;

  cachePut=()=>new Promise(resolve=>{releasePut=resolve});
  const missWaits=[];
  const missEvent={waitUntil(promise){missWaits.push(Promise.resolve(promise))}};
  const missPromise=context.__swTest.staleWhileRevalidate(missEvent,{url:'https://history.test/app.js'});
  const missRace=await Promise.race([missPromise,new Promise(resolve=>setTimeout(()=>resolve('blocked'),25))]);
  assert.strictEqual(missRace,response,'stale-while-revalidate misses must stream the network response before cache persistence');
  releasePut();await Promise.all(missWaits);

  console.log('PASS service worker cache: atomic bounded offline install and non-blocking failure-safe writes.');
})().catch(error=>{console.error(error);process.exitCode=1});
