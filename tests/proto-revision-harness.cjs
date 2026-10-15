const fs=require('node:fs'),vm=require('node:vm');
function load(initial={},options={}){
 const storage=new Map(Object.entries(initial)),handlers=[],timers=new Map(),bubbles=new Map();let html='',timerId=0;
 const app={set innerHTML(value){html=value;bubbles.clear();for(const match of value.matchAll(/data-dialogue-index="(\d+)"/g))bubbles.set(match[1],{textContent:''});},get innerHTML(){return html;}};
 const document={querySelector(selector){if(selector==='#app')return app;const match=selector.match(/^\[data-dialogue-index="(\d+)"\] p$/);return options.typing&&match?bubbles.get(match[1])||null:null;},querySelectorAll:()=>[],addEventListener(type,handler,capture){if(type==='click')handlers.push({handler,capture});},createElement:()=>({setAttribute(){},remove(){},click(){}}),body:{append(){}}};
 const context=vm.createContext({Date,console,document,localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,String(value)),removeItem:key=>storage.delete(key)},window:{scrollTo(){}},navigator:{},setTimeout:(callback)=>{timers.set(++timerId,callback);return timerId;},clearTimeout:id=>timers.delete(id),setInterval:()=>1,clearInterval(){}});
 const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]).filter(file=>file!=='pwa.js');
 vm.runInContext(scripts.map(file=>options.overrides?.[file]??fs.readFileSync('dist/'+file,'utf8')).join('\n'),context);
 const run=source=>vm.runInContext(source,context),copy=source=>JSON.parse(run('JSON.stringify('+source+')'));
 function click(dataset={},background=false){
  run('inputLockedUntil=0');let stopped=false;
  const button={dataset,disabled:false,closest(selector){return selector==='button'?this:null;}};
  const target={closest(selector){if(selector==='button')return background?null:button;if(selector==='.conversation-game')return background?{}:null;return null;}};
  const event={target,preventDefault(){},stopPropagation(){},stopImmediatePropagation(){stopped=true;}};
  for(const item of handlers.slice().sort((a,b)=>Number(Boolean(b.capture))-Number(Boolean(a.capture)))){item.handler(event);if(stopped)break;}
 }
 return {run,copy,click,context,html:()=>html,storage,tick(){const entry=[...timers.entries()].at(-1);if(entry){timers.delete(entry[0]);entry[1]();}}};
}
function step(game,branch=0,wrong=false){
 const {run,click}=game,screen=run('screen');
 if(screen==='game'){const phase=run('globalThis.PROTO_REVISION_ACTIONS.phaseState().phase');return phase==='choice'?click({choice:String(branch)}):click({action:'advance-dialogue'});}
 if(screen==='quiz'){if(run('run().questionAnswer===null')){const q=game.copy('activeQuestion()');click({protoAnswer:String(wrong?(q.answer+1)%q.choices.length:q.answer)});return click({action:'proto-submit'});}return click({action:'proto-quiz-next'});}
 if(screen==='complete'){const number=run('Number(CHAPTERS[run().currentChapter].number)');if(number<5)return click({action:'start-chapter',chapter:'proto-ch0'+(number+1)});return;}
 throw Error('Unexpected screen: '+screen);
}
function until(game,predicate,branch=0,wrong=false,limit=2200){for(let index=0;index<limit;index++){if(predicate(game))return;step(game,branch,wrong);}throw Error('Did not reach target: '+game.run('screen')+' '+game.run('run().storyId'));}
module.exports={load,step,until};
