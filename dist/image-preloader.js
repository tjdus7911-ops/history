(function(root){
  'use strict';
  const PRIORITY={high:0,near:1,idle:2};

  function createImagePreloader(options={}){
    const connection=options.connection||root.navigator?.connection;
    const constrained=connection?.saveData||/^(slow-)?2g$/.test(connection?.effectiveType||'');
    const maxConcurrent=options.maxConcurrent|| (constrained?2:4);
    const maxSpeculative=Math.min(options.maxSpeculative||2,Math.max(1,maxConcurrent-1));
    const timeoutMs=options.timeoutMs||15000;
    const retryBaseMs=options.retryBaseMs||1200;
    const maxEntries=options.maxEntries||160;
    const ImageCtor=options.Image||root.Image;
    const now=options.now||Date.now;
    const setTimer=options.setTimeout||root.setTimeout?.bind(root)||(()=>0);
    const clearTimer=options.clearTimeout||root.clearTimeout?.bind(root)||(()=>{});
    const entries=new Map(),queue=[];
    let active=0,speculativeActive=0,sequence=0;

    const priorityOf=value=>Object.hasOwn(PRIORITY,value)?PRIORITY[value]:PRIORITY.near;
    const publicStatus=entry=>entry?{src:entry.src,status:entry.status,failures:entry.failures||0,retryAt:entry.retryAt||0,lastUsed:entry.lastUsed||0}:null;

    function prune(){
      if(entries.size<=maxEntries)return;
      const settled=[...entries.values()].filter(entry=>entry.status==='loaded'||entry.status==='failed').sort((a,b)=>a.lastUsed-b.lastUsed);
      while(entries.size>maxEntries&&settled.length)entries.delete(settled.shift().src);
    }

    function finish(job,ok,reason){
      if(job.done)return;
      job.done=true;
      if(job.timer)clearTimer(job.timer);
      if(job.image){job.image.onload=null;job.image.onerror=null;job.image=null}
      active=Math.max(0,active-1);
      if(job.startedPriority>PRIORITY.high)speculativeActive=Math.max(0,speculativeActive-1);
      const entry=entries.get(job.src);
      if(entry===job.entry){
        entry.lastUsed=now();
        if(ok){entry.status='loaded';entry.failures=0;entry.retryAt=0}
        else{
          entry.status='failed';entry.failures=(entry.failures||0)+1;
          entry.retryAt=now()+Math.min(30000,retryBaseMs*(2**Math.min(4,entry.failures-1)));
        }
      }
      job.resolve({src:job.src,ok,reason:reason||null,status:ok?'loaded':'failed'});
      prune();pump();
    }

    function start(job){
      if(job.entry.status!=='queued')return;
      job.startedPriority=job.priority;
      job.entry.status='loading';job.entry.lastUsed=now();
      active++;
      if(job.startedPriority>PRIORITY.high)speculativeActive++;
      if(typeof ImageCtor!=='function'){finish(job,true,'image-api-unavailable');return}
      try{
        const image=new ImageCtor();job.image=image;
        image.decoding='async';
        try{image.fetchPriority=job.startedPriority===PRIORITY.high?'high':'low'}catch{}
        image.onload=()=>finish(job,true,'load');
        image.onerror=()=>finish(job,false,'error');
        job.timer=setTimer(()=>finish(job,false,'timeout'),job.timeoutMs);
        image.src=job.src;
      }catch(error){finish(job,false,'exception')}
    }

    function nextJob(){
      let bestIndex=-1,best=null;
      for(let index=0;index<queue.length;index++){
        const job=queue[index];
        if(job.entry.status!=='queued')continue;
        if(job.priority>PRIORITY.high&&speculativeActive>=maxSpeculative)continue;
        if(!best||job.priority<best.priority||(job.priority===best.priority&&job.sequence<best.sequence)){best=job;bestIndex=index}
      }
      if(bestIndex<0)return null;
      queue.splice(bestIndex,1);return best;
    }

    function pump(){
      while(active<maxConcurrent){const job=nextJob();if(!job)break;start(job)}
    }

    function load(src,settings={}){
      if(!src)return Promise.resolve({src,ok:false,reason:'empty',status:'skipped'});
      if(typeof settings==='string')settings={priority:settings};
      const requestedPriority=priorityOf(settings.priority),stamp=now();
      let entry=entries.get(src);
      if(entry?.status==='loaded'){entry.lastUsed=stamp;return Promise.resolve({src,ok:true,reason:'memory-cache',status:'loaded'})}
      if(entry?.status==='queued'||entry?.status==='loading'){
        entry.lastUsed=stamp;
        if(entry.status==='queued'&&requestedPriority<entry.job.priority)entry.job.priority=requestedPriority;
        pump();return entry.promise;
      }
      if(entry?.status==='failed'&&!settings.force&&stamp<entry.retryAt){
        entry.lastUsed=stamp;
        return Promise.resolve({src,ok:false,reason:'retry-cooldown',status:'failed',retryAt:entry.retryAt});
      }
      entry={src,status:'queued',failures:entry?.failures||0,retryAt:0,lastUsed:stamp,promise:null,job:null};
      let resolve;
      entry.promise=new Promise(done=>{resolve=done});
      const job={src,entry,priority:requestedPriority,sequence:sequence++,timeoutMs:settings.timeoutMs||timeoutMs,resolve,image:null,timer:null,done:false,startedPriority:null};
      entry.job=job;entries.set(src,entry);queue.push(job);pump();return entry.promise;
    }

    function loadMany(urls,settings={}){return Promise.all([...new Set((urls||[]).filter(Boolean))].map(src=>load(src,settings)))}
    function status(src){return publicStatus(entries.get(src))}
    function stats(){return {active,speculativeActive,queued:queue.filter(job=>job.entry.status==='queued').length,entries:entries.size,maxConcurrent,maxSpeculative}}
    return Object.freeze({load,loadMany,status,stats,priorities:Object.freeze({...PRIORITY})});
  }

  root.createImagePreloader=createImagePreloader;
  root.IMAGE_PRELOADER=createImagePreloader();
})(globalThis);
