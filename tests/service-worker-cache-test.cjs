const fs=require('fs'),vm=require('vm'),assert=require('assert');

const cached={ok:true,status:200,source:'cache'};
let fetchResponse={ok:false,status:503},putResolve=null,putFinished=false;
const context=vm.createContext({
  URL,
  self:{location:{origin:'https://history.example'},clients:{claim:()=>Promise.resolve()},skipWaiting:()=>Promise.resolve(),addEventListener(){}},
  fetch:async()=>fetchResponse,
  caches:{
    open:async()=>({addAll:async()=>{},put:()=>new Promise(resolve=>{putResolve=()=>{putFinished=true;resolve()}})}),
    keys:async()=>[],delete:async()=>true,
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
  console.log('PASS: service-worker explanation payload uses 5xx cache fallback and awaited cache writes.');
})().catch(error=>{console.error(error);process.exitCode=1});
