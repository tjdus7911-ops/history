const fs=require('fs'),vm=require('vm'),assert=require('assert');

const scriptNames=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)]
 .map(match=>match[1]).filter(name=>name!=='pwa.js');
const source=scriptNames.map(name=>fs.readFileSync('dist/'+name,'utf8')).join('\n');

function cloneStorage(storage){return new Map(storage);}

function createBrowser(initialHash=''){
 const listeners={},base='https://history.test/',initial=new URL(initialHash||'',base);
 let current=initial,cursor=0;
 const entries=[{url:current.href,state:null}];
 const window={scrollTo(){}};
 const emit=(type,event={})=>{
  const value={type,...event};
  for(const handler of [...(listeners[type]||[])])handler(value);
  if(typeof window['on'+type]==='function')window['on'+type](value);
 };
 window.addEventListener=(type,handler)=>{(listeners[type]||=[]).push(handler)};
 window.removeEventListener=(type,handler)=>{listeners[type]=(listeners[type]||[]).filter(item=>item!==handler)};
 window.dispatchEvent=event=>{emit(event.type,event);return true};
 const resolve=value=>new URL(value||current.href,current.href);
 const moveTo=(url,state,withEvents=true)=>{
  const oldURL=current.href,oldHash=current.hash;current=resolve(url);
  if(withEvents){emit('popstate',{state});if(oldHash!==current.hash)emit('hashchange',{oldURL,newURL:current.href})}
 };
 const location={
  assign(value){location.href=value},
  replace(value){const next=resolve(value);entries[cursor]={url:next.href,state:entries[cursor].state};moveTo(next,entries[cursor].state,false)},
  reload(){}
 };
 Object.defineProperties(location,{
  href:{get:()=>current.href,set:value=>{const next=resolve(value),oldURL=current.href,oldHash=current.hash;entries.splice(cursor+1);entries.push({url:next.href,state:null});cursor=entries.length-1;current=next;if(oldHash!==current.hash)emit('hashchange',{oldURL,newURL:current.href})}},
  hash:{get:()=>current.hash,set:value=>{const next=resolve(current.href);next.hash=value;location.href=next.href}},
  pathname:{get:()=>current.pathname},search:{get:()=>current.search},origin:{get:()=>current.origin}
 });
 const history={
  get length(){return entries.length},get state(){return entries[cursor].state},
  pushState(state,title,url){const next=resolve(url||current.href);entries.splice(cursor+1);entries.push({url:next.href,state});cursor=entries.length-1;moveTo(next,state,false)},
  replaceState(state,title,url){const next=resolve(url||current.href);entries[cursor]={url:next.href,state};moveTo(next,state,false)},
  back(){history.go(-1)},forward(){history.go(1)},
  go(delta){const next=Math.max(0,Math.min(entries.length-1,cursor+Number(delta||0)));if(next===cursor)return;cursor=next;moveTo(entries[cursor].url,entries[cursor].state,true)}
 };
 window.location=location;window.history=history;window.window=window;
 return {window,location,history,emit,setHash(value){location.hash=value}};
}

function boot(hash='',storage=new Map()){
 let html='';const handlers={},browser=createBrowser(hash);
 const root={set innerHTML(value){html=value},get innerHTML(){return html}};
 const document={
  visibilityState:'visible',activeElement:null,
  querySelector:selector=>selector==='#app'?root:null,
  querySelectorAll:()=>[],
  addEventListener:(type,handler,capture)=>{(handlers[type]||=[]).push({handler,capture})},
  removeEventListener:(type,handler)=>{handlers[type]=(handlers[type]||[]).filter(item=>item.handler!==handler)},
  createElement:()=>({set innerHTML(value){this.value=value},querySelector:()=>null,setAttribute(){},remove(){},focus(){}}),
  body:{append(){}}
 };
 const localStorage={
  get length(){return storage.size},
  key:index=>[...storage.keys()][index]??null,
  getItem:key=>storage.has(String(key))?storage.get(String(key)):null,
  setItem:(key,value)=>storage.set(String(key),String(value)),
  removeItem:key=>storage.delete(String(key)),clear:()=>storage.clear()
 };
 browser.window.document=document;browser.window.localStorage=localStorage;
 const context=vm.createContext({
  Date,URL,console,document,localStorage,location:browser.location,history:browser.history,
  window:browser.window,navigator:{},
  addEventListener:browser.window.addEventListener,removeEventListener:browser.window.removeEventListener,
  setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){}
 });
 vm.runInContext(source,context);
 const run=code=>vm.runInContext(code,context);
 function click(dataset){
  run('inputLockedUntil=0');let stopped=false;
  const control={dataset,disabled:false,value:''};
  const target={dataset,closest:selector=>selector==='button'?control:null,matches:()=>false};
  const event={target,preventDefault(){},stopPropagation(){},stopImmediatePropagation(){stopped=true}};
  for(const item of [...(handlers.click||[])].sort((a,b)=>Number(Boolean(b.capture))-Number(Boolean(a.capture)))){
   item.handler(event);if(stopped)break;
  }
 }
 return {browser,click,context,html:()=>html,run,storage};
}

/* Build one genuine persisted active session. Route restoration must never discard it
   or let it hijack a different current URL. */
const seed=boot('#home');
assert.equal(seed.run('typeof OX_QUIZ_API.startSession'),'function');
assert.equal(seed.run("OX_QUIZ_API.startSession('era','goryeo',{count:20})"),true);
assert(seed.run('Boolean(meta().oxQuiz.activeSession)'),'active OX fixture was not persisted');
const activeStorage=cloneStorage(seed.storage);
for(const key of ['lastScreen','last-screen','activeTab','lived-history-last-route'])activeStorage.set(key,'ox');

/* No route means home, even if a resumable OX session exists and old last-screen
   values say OX. A valid URL is authoritative on every fresh boot. */
let app=boot('',cloneStorage(activeStorage));
assert.equal(app.run('screen'),'home','a URL without screen information must default to home');
assert.equal(app.browser.location.hash,'','defaulting home must not require an OX redirect');

for(const [hash,expected] of [['#home','home'],['#exam-library','exam-library'],['#study','study'],['#records','records']]){
 app=boot(hash,cloneStorage(activeStorage));
 assert.equal(app.run('screen'),expected,`${hash} must survive reload`);
 assert.equal(app.browser.location.hash,hash,`${hash} must remain the authoritative URL`);
}

app=boot('#ox',cloneStorage(activeStorage));
assert.equal(app.run('screen'),'ox','#ox must restore the OX screen');
assert.equal(app.run('OX_QUIZ_API.snapshot().view'),'home','#ox must restore the OX main, not force the active quiz');
assert(app.html().includes('진행 중인 퀴즈 이어하기'),'OX main must offer the saved session as an explicit resume action');
assert(!app.html().includes('class="ox-page ox-play"'),'OX main reload unexpectedly entered the quiz');
app.click({oxAnalysis:'true'});assert.equal(app.run('OX_QUIZ_API.snapshot().view'),'analysis');
app.browser.history.pushState({appRoute:'ox'},'','#ox');app.browser.history.back();
assert.equal(app.run('OX_QUIZ_API.snapshot().view'),'home','popstate must restore the URL view even when adjacent history entries share the same hash');

app=boot('#ox/quiz',cloneStorage(activeStorage));
assert.equal(app.run('screen'),'ox','#ox/quiz must restore the OX screen');
assert.equal(app.run('OX_QUIZ_API.snapshot().view'),'quiz','#ox/quiz must restore the active quiz explicitly');
assert(app.html().includes('class="ox-page ox-play"'),'explicit OX quiz route did not render the active quiz');

app=boot('#not-a-real-screen',cloneStorage(activeStorage));
assert.equal(app.run('screen'),'home','an invalid route must safely fall back to home');

app=boot('#home',cloneStorage(activeStorage));app.click({studyJump:'official'});
assert.equal(app.run('screen'),'study','direct wrong-note links must enter study');
assert.equal(app.browser.location.hash,'#study','direct wrong-note links must synchronize the URL');

/* Main-nav changes must write navigable history. Back/forward and an external hash
   change then apply the URL without resurrecting the active OX quiz. */
app=boot('#home',cloneStorage(activeStorage));
app.click({nav:'exam-library'});
assert.equal(app.run('screen'),'exam-library');
assert.equal(app.browser.location.hash,'#exam-library','exam navigation must synchronize the URL');
app.click({nav:'ox'});
assert.equal(app.run('screen'),'ox');
assert.equal(app.run('OX_QUIZ_API.snapshot().view'),'home','selecting OX must land on its main/resume screen');
assert.equal(app.browser.location.hash,'#ox','OX navigation must synchronize the URL');
app.browser.history.back();
assert.equal(app.run('screen'),'exam-library','browser Back must restore the previous main screen');
assert.equal(app.browser.location.hash,'#exam-library');
app.browser.history.back();
assert.equal(app.run('screen'),'home','a second Back must restore home');
app.browser.history.forward();
assert.equal(app.run('screen'),'exam-library','browser Forward must restore the next main screen');
app.browser.setHash('#records');
assert.equal(app.run('screen'),'records','a valid external hash change must apply its screen');

/* Direct official-exam grading also owns a main-screen transition and must not
   leave a stale URL behind when the timer/session completes off-screen. */
app=boot('#home',new Map());app.click({nav:'exam-library'});app.click({officialTab:'round'});app.click({officialRoundLevel:'심화'});app.click({officialRound:'57',officialEditionLevel:'심화'});app.click({officialStart:'exam'});app.click({officialTimerStart:'true'});app.click({nav:'home'});
assert.equal(app.run('screen'),'home');assert.equal(app.browser.location.hash,'#home');
app.click({officialRequestSubmit:'true'});app.click({officialSubmitConfirm:'true'});
assert.equal(app.run('screen'),'exam-library','completed official exam must enter its result screen');
assert.equal(app.browser.location.hash,'#exam-library','completed official exam must synchronize its result route');

console.log('PASS: URL-first refresh routing, OX main/resume isolation, explicit quiz restoration, invalid fallback, and browser navigation.');
