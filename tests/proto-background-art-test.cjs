const fs=require('fs'),assert=require('assert');
const {load}=require('./proto-harness.cjs');
const before=load({'proto-background-art.js':''}),after=load();
const original=before.copy('STORIES'),current=after.copy('STORIES');
const mappings=after.copy('PROTO_SCENE_BACKGROUND_ART');
for(const [id,source] of Object.entries(current)){
 const restored=JSON.parse(JSON.stringify(source));
 if(mappings[id]){
  restored.illustrationId=original[id].illustrationId;
  (restored.choices||[]).forEach((c,i)=>{if(c.resultIllustrationId)c.resultIllustrationId=original[id].choices[i].resultIllustrationId;});
 }
 assert.deepEqual(restored,original[id],id+' dialogue, choices, order and performance preserved');
}
const oldQuestions=before.copy('QUESTIONS');
for(const [i,q] of after.copy('QUESTIONS').entries()){
 if(q.relatedIllustrationId!==oldQuestions[i].relatedIllustrationId)assert(q.chapterId.startsWith('proto-')&&Object.values(mappings).some(name=>q.relatedIllustrationId===`proto-raster-${name}`),'only proto background reference may change');
 assert(JSON.stringify({...q,relatedIllustrationId:oldQuestions[i].relatedIllustrationId})===JSON.stringify(oldQuestions[i]),q.questionId+' question content unchanged');
}
for(const name of ['QUESTION_SETS','PROTO_STORY_SCRIPT','PORTRAITS','CHARACTERS'])assert.deepEqual(after.copy(name),before.copy(name),name+' unchanged');
const oldChapters=before.copy('CHAPTERS');
for(const [id,c] of Object.entries(after.copy('CHAPTERS')))assert.deepEqual({...c,thumbnail:oldChapters[id].thumbnail},oldChapters[id]);
const rows=[];
after.run("resumeEra('proto-kingdoms')");
for(const source of Object.values(current).filter(s=>s.eraId==='proto-kingdoms'&&s.storyActive!==false)){
 const asset=after.copy(`ASSETS[${JSON.stringify(source.illustrationId)}]`);
 assert(asset&&fs.existsSync('dist/'+asset.src),source.sceneId+' background exists');
 after.run(`run().currentChapter=${JSON.stringify(source.chapterId)};run().storyId=${JSON.stringify(source.sceneId)};run().pending=null;run().dialogueCursor=1`);
 const rendered=after.run('game()');
 if(source.sceneEffect!=='blackout')assert(rendered.includes(`background-image:url('${asset.src}')`),source.sceneId+' game renderer uses connected art');
 for(const c of source.choices||[])if(c.resultIllustrationId)assert(after.run(`assetStyle(${JSON.stringify(c.resultIllustrationId)})`).includes(asset.src),source.sceneId+' branch uses matching art');
 rows.push({sceneId:source.sceneId,title:source.title,background:asset.src,symbolic:asset.src.endsWith('.svg'),actualBrowserVerified:false});
}
const protectedIds=[...Array.from({length:5},(_,i)=>`proto_ch00_s${i+1}`),...Array.from({length:6},(_,i)=>`proto_ch06_s${i+9}`),...Array.from({length:8},(_,i)=>`proto_ch07_s${i+1}`)];
assert.equal(rows.filter(r=>r.symbolic).length,0,'all active proto scene backgrounds must be raster illustrations');
for(const id of protectedIds)assert(!rows.find(s=>s.sceneId===id).symbolic,id+' protected scene uses raster art');
const audit={status:'incomplete',actualPCVerified:false,actualMobileVerified:false,protectedScenesCompared:protectedIds.length,scenes:rows};
fs.writeFileSync('docs/PROTO_BACKGROUND_AUDIT.json',JSON.stringify(audit,null,2)+'\n');
console.log(`PASS: ${rows.length} scene paths checked, ${protectedIds.length} protected scenes retain dialogue/choices/performance. ${rows.filter(r=>r.symbolic).length} symbolic scenes remain. Browser QA pending.`);
