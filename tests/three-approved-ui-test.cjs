'use strict';
// Production HTML/input through the VM harness. Geometry and pixels are
// separately checked in the browser at PC and 360/390/430px widths.
const assert=require('node:assert/strict');
const {load}=require('./proto-revision-harness.cjs');
let h=load({}, {typing:true});
const q=JSON.stringify;
function attrs(tag){return Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));}
function dataset(tag){return Object.fromEntries(Object.entries(attrs(tag)).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v]));}
function buttons(){return [...h.html().matchAll(/<button\b[^>]*>/g)].map(m=>m[0]);}
function tap(){const matches=buttons().filter(tag=>(attrs(tag).class||'').split(/\s+/).includes('advance-dialogue'));assert.equal(matches.length,1);h.click(dataset(matches[0]));}
function position(){return h.copy('({story:run().storyId,cursor:run().dialogueCursor,phase:THREE_COMPLETE_ACTIONS.phaseState(THREE_COMPLETE_ACTIONS.currentSource())})');}
function phase(name){h.run('THREE_COMPLETE_ACTIONS.switchPhase(THREE_COMPLETE_ACTIONS.currentSource(),'+q(name)+')');}
function entries(){return h.copy('THREE_COMPLETE_ACTIONS.phaseEntries(THREE_COMPLETE_ACTIONS.currentSource())');}
function cursor(n){h.run('run().dialogueCursor='+n+';render()');}
function setup(source){h.run('state.mainRun=null;state.run=INITIAL_RUN('+q(source.chapterId)+');THREE_SAVE_V3.identifyRun(run(),true);run().started=true;run().storyId='+q(source.sceneId)+';screen="game";modal=null;THREE_COMPLETE_ACTIONS.switchPhase(STORIES['+q(source.sceneId)+'],"main");render()');}
let frames=0,choiceCount=0,taps=0,narrationFrames=0,npcFrames=0,playerFrames=0;
const lineIds=new Set();
function frame(list,n,limit,label){
 const html=h.html(),visible=list.slice(0,n).slice(-limit);
 assert(html.includes('data-three-ui="approved-messenger-v1"'),label+' approved UI');
 assert.equal(h.run('typingLine===null&&typingTimer===null'),true,label+' no typewriter');
 assert(!/\b(?:NaN|Infinity)(?:px|%|[;,)])/.test(html),label+' finite layout');
 const mode=h.run('THREE_COMPLETE_ACTIONS.phaseState(THREE_COMPLETE_ACTIONS.currentSource()).phase');
 if(mode!=='choice'){
  const controls=buttons().filter(tag=>['advance-dialogue','next','result-next'].includes(attrs(tag)['data-action']));
  assert.equal(controls.length,1,label+' one progress control');
  assert((attrs(controls[0]).class||'').split(/\s+/).includes(n<list.length?'advance-dialogue':'next'),label+' shared intermediate/terminal button');
 }
 const ids=[...html.matchAll(/data-line-id="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(ids,visible.map(line=>line.lineId),label+' ordered recent '+limit);
 // Strip only the metadata added around the unchanged common renderer.
 const shared=html.replace(/\sdata-(?:line-id|character-id|position|presentation-context)="[^"]*"/g,'');
 for(let i=0;i<visible.length;i++){
  const line=visible[i],index=n-visible.length+i;
  const expected=h.run('dialogueBubble('+q(line)+','+index+')');
  assert(shared.includes(expected),label+' exact whole shared bubble '+line.lineId);
  lineIds.add(line.lineId);
 }
 const actors=[...html.matchAll(/<(?:div|img)\b[^>]*\bclass="stage-character [^"]*"[^>]*>/g)].map(m=>attrs(m[0]));
 const current=list[n-1];
 const displayContext=h.run('THREE_STAGING.context(THREE_COMPLETE_ACTIONS.currentSource(),{phase:'+q(mode)+',entry:'+q(current)+'})');
 if(current&&((mode!=='choice'&&['narration','thought'].includes(current.speakerType))||displayContext==='record')){
  assert.equal(actors.length,0,label+' narrative/record has no standing actors');narrationFrames++;
 }
 for(const actor of actors){
  const player=actor['data-character-id']==='three_v3_seoa';
  assert.equal(actor['data-position'],player?'right':'left',label+' actor side');
  if(player)playerFrames++;else npcFrames++;
 }
 frames++;
}
function inspectPhase(name,label){
 phase(name);const list=entries();
 for(let n=1;n<=list.length;n++){cursor(n);frame(list,n,3,label+'/'+name+'/'+n);}
 if(list.length>1){
  cursor(1);const before=position();tap();const after=position();
  assert.equal(after.story,before.story,label+' same scene');assert.equal(after.cursor,2,label+' single tap');
  const settled=position();h.tick();assert.deepEqual(position(),settled,label+' no auto advance');
  frame(list,2,3,label+'/'+name+'/tap');taps++;
 }
 return list;
}
h.run("resumeEra('three-kingdoms')");
const sources=h.copy('Object.values(STORIES).filter(s=>s.threeStoryVersion===3).map(s=>({sceneId:s.sceneId,chapterId:s.chapterId,choiceCount:(s.choices||[]).length}))');
assert.equal(sources.length,218);
for(const source of sources){
 setup(source);const main=inspectPhase('main',source.sceneId);
 if(source.choiceCount){
  for(let index=0;index<source.choiceCount;index++){
   setup(source);phase('choice');frame(main,main.length,2,source.sceneId+'/choice');
   const matches=buttons().filter(tag=>attrs(tag)['data-choice']===String(index));assert.equal(matches.length,1);
   h.click(dataset(matches[0]));assert.equal(h.run('run().dialogueCursor'),1,'choice does not skip spoken line');
   assert.equal(h.run('THREE_COMPLETE_ACTIONS.phaseState(THREE_COMPLETE_ACTIONS.currentSource()).phase'),'branch');
   frame(entries(),1,3,source.sceneId+'/selected');const settled=position();h.tick();assert.deepEqual(position(),settled,'choice/timer does not advance');
   inspectPhase('branch',source.sceneId+'/B'+index);inspectPhase('join',source.sceneId+'/B'+index);choiceCount++;
  }
 }else inspectPhase('join',source.sceneId);
}
setup(sources[0]);h.run('run().threeTypedLineId="legacy-field";render()');assert.equal(h.run('run().threeTypedLineId'),'legacy-field','render preserves compatible saved field');
const source=sources.find(s=>s.sceneId==='THR-C01-S04');setup(source);
const actorStyles=()=>Object.fromEntries([...h.html().matchAll(/<(?:div|img)\b[^>]*\bclass="stage-character [^"]*"[^>]*>/g)].map(m=>{const a=attrs(m[0]);return [a['data-character-id'],a.style]}));
const firstStyles=actorStyles();tap();assert.deepEqual(actorStyles(),firstStyles,'speaker/listener changes keep face position and uniform scale');h.run('save()');const saved=position();
h=load(Object.fromEntries(h.storage),{typing:true});h.run("resumeEra('three-kingdoms')");assert.deepEqual(position(),saved,'resume current position');frame(entries(),2,3,'reload');
for(const [id,n] of [['THR-C01-S06',6],['THR-C07-S04',2]]){
 setup(sources.find(s=>s.sceneId===id));cursor(n);
 assert(!h.html().includes('class="stage-character three-scaled-character stage-right'),'NPC conversation does not insert a character on the player side: '+id);
}
assert.equal(choiceCount,142);assert.equal(lineIds.size,2777);assert(narrationFrames>0);
// bb4f507 ("reset Three Kingdoms cast to Seoa") deliberately retired the NPC standing roster: NPC lines stay in the
// script but only the protagonist is staged. If a roster is restored, NPC actors must be staged again.
const protagonistOnlyRoster=h.run("typeof THREE_COMPLETE_ART!=='undefined'?THREE_COMPLETE_ART.status==='protagonist-only-roster-reset':false");
if(protagonistOnlyRoster)assert.equal(npcFrames,0,'protagonist-only roster must not stage NPC actors');else assert(npcFrames>0);assert(playerFrames>0);assert(taps>0);
console.log('PASS approved Three messenger VM: '+sources.length+' scenes, '+frames+' rendered frames, '+lineIds.size+' exact line IDs, '+choiceCount+' spoken choices, '+taps+' single-tap transitions, '+narrationFrames+' narrative/record frames, correct actor sides, immediate text and full-line reload. Browser screenshots remain separate.');
