const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');

const context=vm.createContext({setTimeout,clearTimeout,Promise,navigator:{connection:{effectiveType:'4g',saveData:false}}});
vm.runInContext(fs.readFileSync('dist/image-preloader.js','utf8'),context,{filename:'dist/image-preloader.js'});
const create=context.createImagePreloader;
assert.equal(typeof create,'function');

class ControlledImage{
  static started=[];
  static instances=new Map();
  set src(value){this._src=value;const Type=this.constructor;Type.started.push(value);Type.instances.set(value,this)}
  static finish(src,ok=true){const image=this.instances.get(src);assert(image,`image did not start: ${src}`);(ok?image.onload:image.onerror)?.()}
}

(async()=>{
  const loader=create({Image:ControlledImage,maxConcurrent:4,maxSpeculative:2,timeoutMs:1000,retryBaseMs:10,maxEntries:20});
  const idle1=loader.load('idle-1',{priority:'idle'}),duplicate=loader.load('idle-1',{priority:'near'});
  assert.strictEqual(idle1,duplicate,'duplicate URL must share one request');
  const idle2=loader.load('idle-2',{priority:'idle'}),idle3=loader.load('idle-3',{priority:'idle'});
  assert.deepEqual(ControlledImage.started,['idle-1','idle-2'],'speculative requests must stay below their own limit');
  const high1=loader.load('high-1',{priority:'high'}),high2=loader.load('high-2',{priority:'high'}),high3=loader.load('high-3',{priority:'high'});
  assert.deepEqual(ControlledImage.started,['idle-1','idle-2','high-1','high-2'],'two slots must remain available for current-frame requests');
  ControlledImage.finish('idle-1');
  assert.equal(ControlledImage.started.at(-1),'high-3','queued current-frame work must beat speculative work');
  ControlledImage.finish('idle-2');
  ControlledImage.finish('high-1');ControlledImage.finish('high-2');ControlledImage.finish('high-3');
  assert.equal(ControlledImage.started.at(-1),'idle-3');ControlledImage.finish('idle-3');
  await Promise.all([idle1,idle2,idle3,high1,high2,high3]);
  assert.equal(loader.stats().active,0);

  let clock=0;
  class RetryImage extends ControlledImage{static started=[];static instances=new Map()}
  const retry=create({Image:RetryImage,maxConcurrent:1,maxSpeculative:1,timeoutMs:1000,retryBaseMs:10,now:()=>clock});
  const failed=retry.load('retry-me',{priority:'high'});RetryImage.finish('retry-me',false);
  assert.equal((await failed).ok,false);assert.equal(retry.status('retry-me').status,'failed');
  assert.equal((await retry.load('retry-me',{priority:'high'})).reason,'retry-cooldown');
  assert.equal(RetryImage.started.length,1,'cooldown must not spin requests');
  clock=11;const retried=retry.load('retry-me',{priority:'high'});assert.equal(RetryImage.started.length,2);
  RetryImage.finish('retry-me',true);assert.equal((await retried).ok,true);assert.equal(retry.status('retry-me').status,'loaded');

  class HangingImage{set src(value){this._src=value}}
  const hanging=create({Image:HangingImage,maxConcurrent:1,maxSpeculative:1,timeoutMs:10,retryBaseMs:1});
  const timed=await hanging.load('hang',{priority:'high'});
  assert.equal(timed.reason,'timeout');assert.equal(hanging.stats().active,0,'timeout must release its network slot');

  class AutoImage{set src(value){this._src=value;queueMicrotask(()=>this.onload?.())}}
  const lru=create({Image:AutoImage,maxConcurrent:1,maxSpeculative:1,maxEntries:3,timeoutMs:1000});
  for(let index=0;index<6;index++)await lru.load('asset-'+index,{priority:'high'});
  assert(lru.stats().entries<=3,'settled preload metadata must be bounded');
  console.log('PASS image preloader: dedupe, priority lanes, bounded concurrency, retry, timeout, and LRU metadata.');
})().catch(error=>{console.error(error);process.exitCode=1});
