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
assert.equal(api.audit.variantCount,7);
assert.equal(api.audit.settingSurfaceCount,3);
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
has('THR-C18-S01','B2-R03','branch','B2','knot-drawing',false);
has('THR-C18-S01','J01','join','B2','knot-drawing',true);
has('THR-C18-S01','J01','join','B1','knot-drawing',false);

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

// The ox remains resting on both decisions, and the pagoda remains unfinished.
// These are physical settings from the first line, including choice/join/reload.
for(const [sceneId,assetId] of [['THR-C11-S01','silla-ox-field'],['THR-C13-S03','hwangnyongsa-construction']]) {
  const source=sources.get(sceneId),raw=source.threeSource;
  const frames=raw.main.map(line=>state(sceneId,line.lineId));
  if(raw.choices.length)frames.push(state(sceneId,raw.main.at(-1).lineId,'choice'));
  for(const choice of raw.choices.length?raw.choices:[null]) {
    if(choice)for(const line of [choice.spokenLine,...choice.reply])frames.push(state(sceneId,line.lineId,'branch',choice.choiceId));
    for(const line of raw.join)frames.push(state(sceneId,line.lineId,'join',choice?.choiceId||null));
  }
  for(const current of frames) {
    assert.equal(api.backgroundOverride(source,current).id,assetId);
    assert.equal(api.backgroundOverride(source,JSON.parse(JSON.stringify(current))).id,assetId);
  }
  const next=sources.get(raw.nextSceneId);
  assert.equal(api.backgroundOverride(next,state(next.sceneId,next.threeSource.main[0].lineId)),null,'Setting must not leak into the next scene');
}

// Authored settings persist through the selected response and join, while a
// present-day record switches back to its own background. The wood/stone/soil
// section is an explanation on exactly M03-M04, not a completed worksite.
for(const [sceneId,assetId] of [
  ['THR-C10-S03','silla-tomb-worksite'],
  ['THR-C17-S05','bulguksa-distinct-pagodas'],
  ['THR-C17-S06','seokguram-assembly'],
  ['THR-C18-S03','cheonghaejin-warehouse'],
  ['THR-C21-S04','balhae-jeongdangseong-office']
]) {
  const source=sources.get(sceneId),raw=source.threeSource;
  const frames=raw.main.map(line=>state(sceneId,line.lineId));
  if(raw.choices.length)frames.push(state(sceneId,raw.main.at(-1).lineId,'choice'));
  for(const choice of raw.choices.length?raw.choices:[null]) {
    if(choice)for(const line of [choice.spokenLine,...choice.reply])frames.push(state(sceneId,line.lineId,'branch',choice.choiceId));
    for(const line of raw.join)frames.push(state(sceneId,line.lineId,'join',choice?.choiceId||null));
  }
  for(const current of frames) {
    const background=api.backgroundOverride(source,current);
    assert.equal(background?.id||null,api.context(source,current)==='record'?null:assetId);
    assert.deepEqual(api.backgroundOverride(source,JSON.parse(JSON.stringify(current))),background);
    const ink=api.resolve(source,current).settingSurfaces;
    for(const art of ink)assert.equal(art.backgroundSrc,background.src,'Ink can only label the matching physical background');
    if(sceneId==='THR-C10-S03') {
      assert.equal(ink.length,current.phase==='main'&&['THR-C10-S03-M03','THR-C10-S03-M04'].includes(current.entry.lineId)?1:0);
    } else if(['THR-C18-S03','THR-C21-S04'].includes(sceneId)) {
      assert.equal(ink.length,1,'Physical map/chest/document labels are continuous across dialogue phases');
      const html=api.layers(source,current);
      assert(html.startsWith('<img class="three-setting-surface"'));
      assert.equal((html.match(/data-setting-surface=/g)||[]).length,1);
    } else assert.equal(ink.length,0);
  }
  const next=sources.get(raw.nextSceneId);
  const nextState=state(next.sceneId,next.threeSource.main[0].lineId);
  assert.notEqual(api.backgroundOverride(next,nextState)?.id||null,assetId,'Previous historical setting must not leak into the next scene');
  assert(!api.resolve(next,nextState).settingSurfaces.some(art=>art.sceneId===sceneId));
}
assert(api.backgroundOverride(sources.get('THR-C11-S01'),state('THR-C11-S01','THR-C11-S01-M02')).src.endsWith('silla-ox-field-readable-v3.png'));
has('THR-C18-S03','M01','main',null,'boat-tag',false); // now on actual chests
has('THR-C21-S04','M01','main',null,'contact-sheet',false); // now on actual bundles
{
  const surface=JSON.parse(fs.readFileSync(path.join(root,'docs/three-content/staging-setting-surface-generation.json'),'utf8')).surfaces;
  assert.equal(Object.keys(surface).length,3);
  const office=fs.readFileSync(path.join(root,'dist',surface['balhae-department-ink-v1'].src),'utf8');
  for(const name of ['中臺省','宣詔省','政堂省','忠部','仁部','義部','智部','禮部','信部'])assert(office.includes('>'+name+'</text>'));
  assert(!office.includes('正堂省'),'Use the primary original 政堂省 spelling');
  const warehouse=fs.readFileSync(path.join(root,'dist',surface['warehouse-map-and-tags-v1'].src),'utf8');
  for(const name of ['新羅坊','新羅所','新羅院','新羅村','赤山法華院'])assert(warehouse.includes('>'+name+'</text>'));
  const text=view('THR-C18-S03','M08').caption.label;
  assert(text.includes('건립')&&text.includes('839년 기록'),'Formation and surviving records remain distinct');
}

// Arrival book continuity is a line-bound physical pose, not a new dialogue
// step or an inventory panel. The original three photographs travel with it.
for(let number=1;number<=6;number++) {
  const source=sources.get('THR-PRO-S03'),current=state(source.sceneId,source.sceneId+'-L0'+number);
  const view=api.resolve(source,current),presence=api.actorPresence(source,current);
  assert.equal(view.book.state,number<=2?'ground':number===3?'lifting':'held');
  assert.equal(view.book.sourcePhotos.length,3);
  assert(view.book.sourcePhotos.every(photo=>photo.sourceKind==='user-original-photo'));
  assert.equal(api.backgroundOverride(source,current)?.id||null,number===6?'queue-mother-in-pair':null,'Only L06 removes the duplicate background mother');
  const ground=api.layers(source,current),photoLayers=api.portraitLayers(source,current,'three_v3_seoa');
  assert.equal(ground.includes('data-book-location="ground"'),false);
  assert.equal((ground.match(/data-source-photo=/g)||[]).length,0);
  assert.equal((photoLayers.match(/data-source-photo=/g)||[]).length,0);
  assert.equal(api.portraitOverride(source,current,'three_v3_seoa')?.id||null,number<=2?null:number===3?'seoa-book-lifting':'seoa-book-held');
  assert.equal(presence.length,number===6?1:0);
  if(number===6) {
    assert.equal(presence[0].characterId,'civilian-c01-0e375c4533--initial');
    assert.equal(presence[0].position,'left');
    assert.equal(presence[0].visualOnly,true);
    const pair=api.portraitOverride(source,current,presence[0].characterId);
    assert.equal(pair.id,'yeonwoo-mother-support-pair');
    assert.equal(pair.interaction.anchorCharacterId,presence[0].characterId);
    assert.equal(pair.interaction.completeFeetPresent,true);
    assert.equal(api.portraitLayers(source,current,presence[0].characterId),'');
  }
  const reloaded=JSON.parse(JSON.stringify(current));
  assert.deepEqual(api.backgroundOverride(source,reloaded),api.backgroundOverride(source,current));
  assert.deepEqual(api.actorPresence(source,reloaded),presence);
}
{
  const source=sources.get('THR-PRO-S03'),menu=state(source.sceneId,source.sceneId+'-L06','choice');
  assert.equal(api.backgroundOverride(source,menu),null);
  assert.equal(api.portraitOverride(source,menu,'civilian-c01-0e375c4533--initial'),null);
  assert.equal(api.actorPresence(source,menu).length,0);
}
assert.equal(api.actorPresence(sources.get('THR-C01-S01'),state('THR-C01-S01','THR-C01-S01-M01')).length,0);
assert.equal(api.portraitOverride(sources.get('THR-C01-S01'),state('THR-C01-S01','THR-C01-S01-M01'),'civilian-c01-0e375c4533--initial'),null);
assert.equal(api.portraitLayers(sources.get('THR-C01-S01'),state('THR-C01-S01','THR-C01-S01-M01'),'three_v3_seoa'),'');

// Seoa is binding Haemyeong's hand in this exact line. A preceding unnamed
// mason must not make the recipient of that physical action disappear.
{
  const source=sources.get('THR-C17-S04'),sid=source.sceneId;
  const current=state(sid,sid+'-B1-R03','branch',sid+'-B1');
  const cast=api.actorPresence(source,current);
  assert.equal(cast.length,1);
  assert.equal(cast[0].characterId,'civilian-c17-439b052a1f--initial');
  assert.equal(cast[0].position,'left');
  assert.equal(api.portraitOverride(source,current,cast[0].characterId).id,'haemyeong-bandaged');
  assert.deepEqual(api.actorPresence(source,JSON.parse(JSON.stringify(current))),cast);
  for(const [line,phase,choice] of [['M08','main',null],['B1-R02','branch','B1'],['B2-R03','branch','B2'],['J01','join','B1']]) {
    assert.equal(api.actorPresence(source,state(sid,sid+'-'+line,phase,choice?sid+'-'+choice:null)).length,0,'Presence is limited to the missing B1 recipient');
  }
}

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
    assert.equal(api.portraitLayers(source,current,'three_v3_seoa'),api.portraitLayers(source,current,'three_v3_seoa'));
    assert.equal(JSON.stringify(api.actorPresence(source,current)),JSON.stringify(api.actorPresence(source,current)));
    assert.equal(JSON.stringify(current),saved);
    assert(!/<(?:button|input|select|figcaption)\b/.test(html),'Artwork adds no input or inventory labels');
    assert(!/(?:NaN|Infinity)/.test(html),'Finite atlas geometry');
    frames++;
  }
}
assert.equal(JSON.stringify(story),before);
assert.equal(api.layers({sceneId:'GOR-01'},{}),'','Other eras remain untouched');
console.log(`PASS: Three staging — ${sources.size} scenes, ${frames} immutable presentation frames, exact branch continuity, no automatic work.`);
