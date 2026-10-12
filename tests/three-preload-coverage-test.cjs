const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),story=JSON.parse(fs.readFileSync(path.join(root,'dist/three-story-script.json'),'utf8'));
const rawScenes=[...story.prologue.scenes,...story.chapters.flatMap(chapter=>chapter.scenes)],sources=new Map(rawScenes.map(raw=>[raw.sceneId,{sceneId:raw.sceneId,threeSource:raw}]));
const box={};vm.createContext(box);vm.runInContext(fs.readFileSync(path.join(root,'dist/three-staging.js'),'utf8'),box);
const api=box.THREE_STAGING;assert.equal(typeof api.assetUrls,'function');

const cues=JSON.parse(fs.readFileSync(path.join(root,'docs/three-content/staging-cues.json'),'utf8')),histories=[{}];
for(const scene of Object.values(cues.scenes))for(const rules of Object.values(scene))for(const rule of rules||[])if(rule.requiresChoices){
  const choices={};for(const [sceneId,value] of Object.entries(rule.requiresChoices))choices[sceneId]=Array.isArray(value)?value[0]:value;
  if(!histories.some(item=>JSON.stringify(item)===JSON.stringify(choices)))histories.push(choices);
}
function state(raw,line,phase='main',choiceId=null,choicesByScene={}){
  const speakerType=line.kind==='dialogue'?(line.speaker==='서아'?'player':'npc'):line.kind;
  return {phase,choiceId,choicesByScene,entry:{...line,speakerType}};
}
function verify(source,current,label,urls){
  const expected=[],background=api.backgroundOverride(source,current),view=api.resolve(source,current),presence=api.actorPresence(source,current);
  if(background?.src)expected.push(background.src);
  for(const art of [...view.props,...view.settingSurfaces,view.hand].filter(Boolean))if(art.src)expected.push(art.src);
  const raw=source.threeSource,choice=raw.choices.find(item=>item.choiceId===current.choiceId);
  const entries=current.phase==='branch'&&choice?[choice.spokenLine,...choice.reply]:current.phase==='join'?raw.join:raw.main,index=entries.findIndex(line=>line.lineId===current.entry?.lineId),entry=entries[index];
  const playerLike=line=>['player','thought'].includes(line?.speakerType)||(line?.kind==='dialogue'&&line.speaker==='서아'),wantsNpc=playerLike(current.entry),wantsPlayer=current.entry?.speakerType==='npc';
  const peer=(wantsNpc||wantsPlayer)?entries.map((line,peerIndex)=>({line,distance:Math.abs(peerIndex-index)})).filter(item=>wantsNpc?(item.line.kind==='dialogue'&&item.line.speaker!=='서아'):playerLike(item.line)).sort((a,b)=>a.distance-b.distance)[0]?.line:null;
  const ids=[current.entry?.characterId,peer?.characterId,...presence.map(actor=>actor.characterId)].filter(Boolean);
  for(const id of ids){const variant=api.portraitOverride(source,current,id);if(variant?.src)expected.push(variant.src)}
  const actual=api.assetUrls(source,current,ids);for(const src of expected)assert(actual.includes(src),`${label} preload misses ${src}`);
  for(const src of actual){assert(fs.existsSync(path.join(root,'dist',src)),`${label} preload path missing: ${src}`);assert(!src.includes('/source-photos/'),'archived genealogy source photo must not be preloaded');urls.add(src)}
  const before=JSON.stringify(current);api.assetUrls(source,current,ids);assert.equal(JSON.stringify(current),before,`${label} planner mutated its input`);
}

let frameCount=0;const urls=new Set();
for(const raw of rawScenes){
  const source=sources.get(raw.sceneId);
  for(const history of histories){
    for(const line of raw.main){verify(source,state(raw,line,'main',null,history),`${raw.sceneId}/${line.lineId}`,urls);frameCount++}
    if(raw.choices.length){const line=raw.main.at(-1);verify(source,state(raw,line,'choice',null,history),`${raw.sceneId}/choice`,urls);frameCount++}
    for(const choice of raw.choices){
      for(const line of [choice.spokenLine,...choice.reply]){verify(source,state(raw,line,'branch',choice.choiceId,history),`${raw.sceneId}/${line.lineId}`,urls);frameCount++}
      for(const line of raw.join){verify(source,state(raw,line,'join',choice.choiceId,history),`${raw.sceneId}/${line.lineId}`,urls);frameCount++}
    }
    if(!raw.choices.length)for(const line of raw.join){verify(source,state(raw,line,'join',null,history),`${raw.sceneId}/${line.lineId}`,urls);frameCount++}
  }
}
// The raw manuscript intentionally carries speaker names only; the runtime
// adapter attaches stable character IDs. Exercise the C15 choice-specific
// portrait override with that runtime identity so this audit covers all 19
// dynamic staging URLs, including the empty-hands portrait.
const c15=sources.get('THR-C15-S07'),c15Raw=c15.threeSource,c15Choice=c15Raw.choices.find(choice=>choice.choiceId==='THR-C15-S07-B1');
const c15Entry=c15Choice.reply[0],c15State=state(c15Raw,c15Entry,'branch',c15Choice.choiceId,{}),c15CharacterId='civilian-c15-dadbb6670e--initial';
c15State.entry.characterId=c15CharacterId;
const c15Urls=api.assetUrls(c15,c15State,[c15CharacterId]);
assert(c15Urls.some(src=>src.endsWith('yeoul-c15-empty-hands-v1.png')),'choice-specific Yeoul portrait must be preloaded');
for(const src of c15Urls){assert(fs.existsSync(path.join(root,'dist',src)),`C15 preload path missing: ${src}`);urls.add(src)}
assert.equal(rawScenes.length,218);assert(frameCount>2777,'all choice/join frames must be covered');
assert.equal(urls.size,19,'all distinct dynamic staging URLs must be covered');
for(const suffix of ['goguryeo-spring-queue-after-collapse.webp','baekje-letter-relay-post.webp','silla-tomb-worksite-v1.webp','seokguram-assembly-v1.webp','staging-props-records-v1.png','tomb-section-ink-v1.svg','yeoul-c15-empty-hands-v1.png'])assert([...urls].some(src=>src.endsWith(suffix)),`dynamic preload audit did not exercise ${suffix}`);
const ui=fs.readFileSync(path.join(root,'dist/three-story-ui.js'),'utf8');
for(const contract of ['THREE_PRELOAD_PLAN','preloadThreeAssets','staging.assetUrls',"'high'","'near'","'idle'"])assert(ui.includes(contract),`Three preload planner missing ${contract}`);
if(process.env.PRINT_PRELOAD_URLS)console.log([...urls].sort().join('\n'));
console.log(`PASS Three preload coverage: ${frameCount} frame/history states across 218 scenes; ${urls.size} dynamic URLs validated.`);
