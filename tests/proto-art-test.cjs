const fs=require('fs'),assert=require('assert');
const {load}=require('./proto-harness.cjs');
const before=load({'proto-art.js':''}),after=load();
const normalize=value=>{
 if(Array.isArray(value))return value.map(normalize);
 if(!value||typeof value!=='object')return value;
 const out=Object.fromEntries(Object.entries(value).map(([k,v])=>[k,normalize(v)]));
 if(out.characterId==='proto_modern'&&out.characterName==='주인공')out.characterName='나';
 return out;
};
assert.deepEqual(normalize(after.copy('STORIES')),before.copy('STORIES'),'all story content, order, cues and branches preserved');
for(const key of ['CHAPTERS','QUESTIONS','QUESTION_SETS','ASSETS','PROTO_STORY_SCRIPT','PROTO_QUESTION_SLOTS'])assert.deepEqual(after.copy(key),before.copy(key),key+' preserved');
assert.deepEqual(normalize(after.copy('CHARACTERS')),before.copy('CHARACTERS'));
const old=before.copy('PORTRAITS'),current=after.copy('PORTRAITS'),art=after.copy('PROTO_CHARACTER_ART');
for(const [id,p] of Object.entries(current)){
 if(!art[p.characterId])assert.deepEqual(p,old[id],id+' unrelated portrait');
 else {assert.deepEqual({...p,src:old[id].src},old[id]);assert.equal(p.src,art[p.characterId][p.expression]||art[p.characterId].neutral);assert(fs.existsSync('dist/'+p.src),p.src);}
}
let frames=0,portraits=0;
const rows=[];
for(const source of after.copy("Object.values(STORIES).filter(s=>s.eraId==='proto-kingdoms'&&s.storyActive!==false)")){
 const backgrounds=after.copy(`ASSETS[${JSON.stringify(source.illustrationId)}]`);
 rows.push({sceneId:source.sceneId,chapterId:source.chapterId,title:source.title,location:source.location,background:backgrounds.src,symbolic:backgrounds.src.endsWith('.svg'),actualBrowserVerified:false});
 const sets=[source.dialogues,...(source.choices||[]).map(c=>c.resultDialogues)];
 for(const entries of sets){
  after.run(`state.run=INITIAL_RUN(${JSON.stringify(source.chapterId)})`);
  for(let i=0;i<entries.length;i++){
   const html=after.run(`characterStage([],STORIES[${JSON.stringify(source.sceneId)}],false,null,${JSON.stringify(source.illustrationId)},${JSON.stringify(entries)},${i+1})`);
   for(const match of html.matchAll(/<img[^>]+data-character-id="([^"]+)"[^>]+data-position="([^"]+)"[^>]+src="([^"]+)"/g)){
    const [,id,side,src]=match;assert(fs.existsSync('dist/'+src),source.sceneId+' '+src);
    if(art[id]){assert(Object.values(art[id]).includes(src),source.sceneId+' stale portrait');assert.equal(side,id==='proto_modern'?'right':'left');}
    portraits++;
   }
   frames++;
  }
 }
}
assert.equal(rows.length,83);assert(portraits>0);
fs.writeFileSync('docs/PROTO_ART_AUDIT.json',JSON.stringify({status:'incomplete',actualPCVerified:false,actualMobileVerified:false,frames,portraits,scenes:rows},null,2)+'\n');
console.log(`PASS: all content/questions/systems preserved; ${frames} virtual dialogue frames, ${portraits} portrait tags. NOT browser QA. ${rows.filter(r=>r.symbolic).length} scenes still use symbolic backgrounds.`);
