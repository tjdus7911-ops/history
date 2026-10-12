const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');

const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]).filter(file=>file!=='pwa.js');
let html='',store={},listeners=[];
const root={set innerHTML(value){html=value},get innerHTML(){return html}};
const context=vm.createContext({Date,console,URL,Map,Set,Promise,document:{querySelector:selector=>selector==='#app'?root:null,querySelectorAll:()=>[],addEventListener:(type,listener,options)=>{if(type==='click')listeners.push({listener,capture:options===true})},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:key=>store[key]||null,setItem:(key,value)=>{store[key]=value},removeItem:key=>{delete store[key]}},window:{scrollTo(){},addEventListener(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){}});
for(const file of scripts)vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context,{filename:file});
const run=source=>vm.runInContext(source,context),calls=[];
context.IMAGE_PRELOADER={load(src,settings={}){calls.push({src,priority:settings.priority||'near'});return Promise.resolve({src,ok:true,status:'loaded'})}};

// A choice result remains visually attached to its source scene even though
// applyChoice has already advanced run.storyId to the following scene.
run("state.mainRun=null;state.run=INITIAL_RUN();run().currentChapter='ch02';run().storyId='ch02_life_path';run().pending=null;run().dialogueCursor=1");
const choiceResult=run("ASSETS[STORIES['ch02_life_path'].choices[0].resultIllustrationId].src");
run("applyChoice(state,'ch02_life_path',0);preloadScene('ch02_life_path')");
assert.equal(run("run().pending.sourceSceneId"),'ch02_life_path');
assert(calls.some(call=>call.src===choiceResult&&call.priority==='high'),`choice result background was not high priority: ${choiceResult}`);
calls.length=0;run("enterStory()");
assert(calls.some(call=>call.src===choiceResult&&call.priority==='high'),`resumed choice result background was not high priority: ${choiceResult}`);

// Cold-resume a Three branch. Every portrait actually emitted by the shared
// stage renderer must be part of the exact current-frame high-priority plan.
run("resumeEra('three-kingdoms');run().storyId='THR-C01-S06';run().dialogueSceneId='THR-C01-S06';THREE_COMPLETE_ACTIONS.switchPhase(STORIES['THR-C01-S06'],'choice');THREE_COMPLETE_ACTIONS.choose(0)");
calls.length=0;run("screen='game';render()");
assert(html.includes('aria-label="을파소"'),'regression fixture must render Eulpaso in the branch history slot');
const portraitIds=[...html.matchAll(/data-portrait="([^"]+)"/g)].map(match=>match[1]);
assert(portraitIds.length>=2,'branch frame must render both character slots');
for(const portraitId of portraitIds){
  const src=run(`PORTRAITS[${JSON.stringify(portraitId)}].src`);
  assert(calls.some(call=>call.src===src&&call.priority==='high'),`displayed portrait was not high priority: ${src}`);
}

console.log('PASS preload integration: pending choice result and rendered Three branch cast use current-frame high priority.');
