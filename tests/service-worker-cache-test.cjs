const fs=require('fs'),vm=require('vm'),assert=require('assert');

const cached={ok:true,status:200,source:'cache'};
let fetchResponse={ok:false,status:503},putResolve=null,putFinished=false;
const listeners={},deletedCaches=[],cacheNames=['lived-history-shell-2026-10-14-mobile-exam-actions-v5','unrelated-cache'];
let shellFiles=[],skipWaitingCalled=false,clientsClaimed=false;
const context=vm.createContext({
  URL,
  self:{location:{origin:'https://history.example'},clients:{claim:()=>{clientsClaimed=true;return Promise.resolve()}},skipWaiting:()=>{skipWaitingCalled=true;return Promise.resolve()},addEventListener(name,listener){listeners[name]=listener}},
  fetch:async()=>fetchResponse,
  caches:{
    open:async()=>({addAll:async(files)=>{shellFiles=files},put:()=>new Promise(resolve=>{putResolve=()=>{putFinished=true;resolve()}})}),
    keys:async()=>cacheNames,delete:async(key)=>{deletedCaches.push(key);return true},
    match:async()=>cached,
  },
});
vm.runInContext(fs.readFileSync('dist/sw.js','utf8'),context);

(async()=>{
  const fallback=await vm.runInContext("networkFirst('/official-exam-explanations.json')",context);
  assert.equal(fallback.source,'cache','HTTP 5xx must fall back to the last good cached explanation payload');

  fetchResponse={ok:true,status:200,clone(){return this}};
  context.caches.match=async()=>null;
  const pending=vm.runInContext("networkFirst('/official-exam-explanations.json')",context);
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(putFinished,false);
  assert(putResolve,'successful network response did not schedule a cache write');
  let resolved=false;pending.then(()=>{resolved=true});await new Promise(resolve=>setImmediate(resolve));
  assert.equal(resolved,false,'networkFirst returned before the service-worker cache write completed');
  putResolve();
  assert.equal(await pending,fetchResponse);
  assert.equal(putFinished,true);
  let installPromise;listeners.install({waitUntil(promise){installPromise=promise}});await installPromise;
  assert.equal(skipWaitingCalled,true,'new service worker skips the waiting phase');
  assert(shellFiles.includes('/index.html')&&shellFiles.includes('/app.js')&&shellFiles.includes('/proto-story-data.js')&&shellFiles.includes('/learning-missions.js')&&shellFiles.includes('/learning-missions.css'),'install preloads the current app shell');
  assert(shellFiles.includes('/product-redesign.css'),'install preloads the redesign theme');
  const activeVersion=vm.runInContext('CACHE_VERSION',context);assert.equal(activeVersion,'2026-10-23-rev8-ui-1');
  let activatePromise;listeners.activate({waitUntil(promise){activatePromise=promise}});await activatePromise;
  assert(deletedCaches.includes('lived-history-shell-2026-10-14-mobile-exam-actions-v5'),'activation removes the installed app’s stale shell');
  assert(!deletedCaches.includes('unrelated-cache'),'activation keeps caches owned by other apps');
  assert.equal(clientsClaimed,true,'the refreshed worker controls installed app clients immediately');
  console.log('PASS: service-worker explanation fallback, awaited cache writes, new shell install and stale-version cleanup.');
})().catch(error=>{console.error(error);process.exitCode=1});
