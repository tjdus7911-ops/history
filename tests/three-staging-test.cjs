'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname,'..');
const story = JSON.parse(fs.readFileSync(path.join(root,'dist/three-story-script.json'),'utf8'));
const all = [...story.prologue.scenes,...story.chapters.flatMap(chapter=>chapter.scenes)];
const sources = new Map(all.map(raw=>[raw.sceneId,{sceneId:raw.sceneId,threeSource:raw}]));
const timers = () => {throw new Error('Staging must not schedule automatic work');};
const box = {setTimeout:timers,setInterval:timers,requestAnimationFrame:timers};
vm.createContext(box);
vm.runInContext(fs.readFileSync(path.join(root,'dist/three-staging.js'),'utf8'),box);
const api = box.THREE_STAGING;
assert.equal(api.audit.sceneCount,218);
assert.equal(api.audit.propCount,27);
assert.equal(api.audit.variantCount,3);
const before = JSON.stringify(story);

function state(sceneId,lineId,phase='main',choiceId=null,choicesByScene={}) {
  const source=sources.get(sceneId),raw=source.threeSource;
  const line=[...raw.main,...raw.join,...raw.choices.flatMap(choice=>[choice.spokenLine,...choice.reply])].find(line=>line.lineId===lineId);
  assert(line,`Missing authored test line: ${lineId}`);
  return {phase,choiceId,choicesByScene,entry:{...line,speakerType:line.kind==='dialogue'?(line.speaker==='서아'?'player':'npc'):line.kind}};
}
function view(sceneId,suffix,phase='main',choiceId=null,history={}) {
  const id=sceneId+'-'+suffix,chosen=choiceId?sceneId+'-'+choiceId:null;
  return api.resolve(sources.get(sceneId),state(sceneId,id,phase,chosen,history));
}
function propIds(view) {return Array.from(view.props,prop=>prop.id);}
function has(scene,suffix,phase,choice,prop,expected,history={}) {
  assert.equal(propIds(view(scene,suffix,phase,choice,history)).includes(prop),expected,`${scene}/${suffix}: ${prop}`);
}
function freeze(value) {
  if(value && typeof value==='object' && !Object.isFrozen(value)) {Object.freeze(value);for(const child of Object.values(value))freeze(child);}
  return value;
}

// Toolbox remains physically present until it is left, and the old decision
// cannot prohibit Haein's independently acquired tools seventeen years later.
has('THR-C07-S01','M02','main',null,'toolbox',false);
has('THR-C07-S01','M03','main',null,'toolbox',true);
has('THR-C07-S01','B1-LABEL','branch','B1','toolbox',true);
has('THR-C07-S01','B1-R01','branch','B1','toolbox',false);
has('THR-C07-S01','J01','join','B1','toolbox',false);
has('THR-C07-S01','B2-R01','branch','B2','toolbox',true);
has('THR-C07-S01','B2-R02','branch','B2','toolbox',true);
has('THR-C07-S01','J01','join','B2','toolbox',true);
for(const choice of ['B1','B2'])has('THR-C07-S06','M01','main',null,'toolbox',true,{'THR-C07-S01':'THR-C07-S01-'+choice});

// A missing or legacy choice must never invent a keepsake. The route sheet is
// from C22 S04; the needle case is independently from C22 S02.
for(const family of [null,'B1','B2'])for(const travel of [null,'B1','B2']) {
  const history={};if(family)history['THR-C22-S02']='THR-C22-S02-'+family;if(travel)history['THR-C22-S04']='THR-C22-S04-'+travel;
  has('THR-C22-S06','M01','main',null,'contact-sheet',travel==='B1',history);
  has('THR-C22-S06','M01','main',null,'route-note',travel==='B2',history);
  has('THR-C22-S06','M01','main',null,'needle-case',family==='B2',history);
}
has('THR-C22-S02','M08','main',null,'needle-case',false);
has('THR-C22-S02','B1-R03','branch','B1','needle-case',false);
has('THR-C22-S02','B2-R01','branch','B2','needle-case',true);
for(const clue of [null,'B1','B2']) {
  const history=clue?{'THR-C18-S01':'THR-C18-S01-'+clue}:{};
  has('THR-C18-S07','M01','main',null,'contact-sheet',clue==='B1',history);
  has('THR-C18-S07','M01','main',null,'knot-drawing',clue==='B2',history);
  has('THR-C18-S07','M01','main',null,'letter',true,history);
}

// Seoa and the record are separate from the contemporary people, with the
// response menu and chosen branch explicitly returning to the scene.
for(const suffix of ['M09','M10']) {
  const source=sources.get('THR-C16-S03'),current=state(source.sceneId,source.sceneId+'-'+suffix);
  assert.equal(api.context(source,current),'record');
  assert.equal(api.actorVisibility(source,current).hideNpc,true);
  assert.equal(api.actorVisibility(source,current).hidePlayer,true);
  assert.equal(source.threeSource.main.find(line=>line.lineId===current.entry.lineId).presentationContext,'scene','Canonical JSON stays unchanged');
}
for(const sceneId of ['THR-C06-S03','THR-C16-S03']) {
  const source=sources.get(sceneId),last=source.threeSource.main.at(-1).lineId;
  const menu=state(sceneId,last,'choice');
  assert.equal(api.context(source,menu),'scene');
  assert.equal(api.actorVisibility(source,menu).hideNpc,false);
  const firstChoice=source.threeSource.choices[0];
  const returning=firstChoice
    ? state(sceneId,firstChoice.spokenLine.lineId,'branch',firstChoice.choiceId)
    : state(sceneId,source.threeSource.join[0].lineId,'join');
  assert.equal(api.context(source,returning),'scene');
}
assert.equal(api.actorVisibility(sources.get('THR-C01-S08'),state('THR-C01-S08','THR-C01-S08-M08')).hideNpc,false);
assert.equal(api.actorVisibility(sources.get('THR-C01-S08'),state('THR-C01-S08','THR-C01-S08-J01','join')).hideNpc,true);

// The letter relay is a different place only for the delivered-letter branch.
for(const selected of ['B1','B2']) {
  const source=sources.get('THR-C08-S08');
  const branch=state(source.sceneId,source.sceneId+'-'+selected+'-R01','branch',source.sceneId+'-'+selected);
  assert.equal(api.backgroundOverride(source,branch)?.id || null,selected==='B1'?'letter-relay-post':null);
  assert.equal(api.backgroundOverride(source,state(source.sceneId,source.sceneId+'-J01','join',source.sceneId+'-'+selected)),null);
}
assert.equal(api.backgroundOverride(sources.get('THR-PRO-S03'),state('THR-PRO-S03','THR-PRO-S03-L01')),null);
assert.equal(api.backgroundOverride(sources.get('THR-C01-S01'),state('THR-C01-S01','THR-C01-S01-M01')).id,'collapsed-queue');

const art=JSON.parse(fs.readFileSync(path.join(root,'dist/three-complete-art.json'),'utf8'));
const haemyeong=Object.values(art.characters).find(person=>person.name==='해명').characterId;
const yeoul=Object.values(art.characters).find(person=>person.name==='여울'&&person.characterId.startsWith('civilian-c15-')).characterId;
function acting(sceneId,suffix,phase,choice,characterId) {
  return api.portraitOverride(sources.get(sceneId),state(sceneId,sceneId+'-'+suffix,phase,choice?sceneId+'-'+choice:null),characterId);
}
assert.equal(acting('THR-C17-S04','M02','main',null,haemyeong).id,'haemyeong-hidden');
assert.equal(acting('THR-C17-S04','B1-R02','branch','B1',haemyeong).id,'haemyeong-hidden');
assert.equal(acting('THR-C17-S04','B1-R03','branch','B1',haemyeong).id,'haemyeong-bandaged');
assert.equal(acting('THR-C17-S04','B2-R03','branch','B2',haemyeong).id,'haemyeong-hidden');
assert.equal(acting('THR-C17-S04','J01','join','B2',haemyeong).id,'haemyeong-bandaged');
assert.equal(acting('THR-C17-S05','M01','main',null,haemyeong).id,'haemyeong-bandaged');
assert.equal(acting('THR-C17-S04','M02','main',null,yeoul),null,'Never borrow another character face');
assert.equal(acting('THR-C15-S07','M08','main',null,yeoul),null);
assert.equal(acting('THR-C15-S07','B1-R01','branch','B1',yeoul).id,'yeoul-empty');
assert.equal(acting('THR-C15-S07','J01','join','B1',yeoul).id,'yeoul-empty');

// Exercise every source utterance through a frozen frame; repeated rendering
// must produce identical markup without changing input, saves, or timers.
let frames=0;
for(const source of sources.values()) {
  const raw=source.threeSource,branches=raw.choices.length?raw.choices:[null];
  const framesToCheck=raw.main.map(line=>({line,phase:'main',choiceId:null}));
  for(const selected of branches) {
    if(selected)for(const line of [selected.spokenLine,...selected.reply])framesToCheck.push({line,phase:'branch',choiceId:selected.choiceId});
    for(const line of raw.join)framesToCheck.push({line,phase:'join',choiceId:selected?.choiceId||null});
  }
  freeze(source);
  for(const frame of framesToCheck) {
    const current=freeze(state(source.sceneId,frame.line.lineId,frame.phase,frame.choiceId));
    const saved=JSON.stringify(current),html=api.layers(source,current);
    assert.equal(api.layers(source,current),html);
    assert.equal(JSON.stringify(current),saved);
    assert(!/<(?:button|input|select|figcaption)\b/.test(html),'Artwork adds no input or inventory labels');
    assert(!/(?:NaN|Infinity)/.test(html),'Finite atlas geometry');
    frames++;
  }
}
assert.equal(JSON.stringify(story),before);
assert.equal(api.layers({sceneId:'GOR-01'},{}),'','Other eras remain untouched');
console.log(`PASS: Three staging — ${sources.size} scenes, ${frames} immutable presentation frames, exact branch continuity, no automatic work.`);
