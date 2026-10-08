const fs=require('fs'),assert=require('assert'),crypto=require('crypto');
function validate(data,runtime){
 const cards=data.cards,source=JSON.parse(fs.readFileSync('docs/mnemonic-sources/explicit-request.json','utf8'));
 assert.equal(data.explicitInputCount,118,'wrong explicit input count');
 assert.equal(cards.length,118,'missing explicit mnemonic record');
 assert.equal(source.records.length,118,'source dataset must contain 118 records');
 assert.deepEqual(cards.reduce((out,card)=>(out[card.sourceId[0]]=(out[card.sourceId[0]]||0)+1,out),{}),{A:15,B:11,C:20,D:32,E:20,F:20});
 assert.deepEqual(cards.map(card=>card.sourceId),source.records.map(record=>record.id),'source order changed');
 const expectedIds=[...Array(15)].map((_,index)=>`A${String(index+1).padStart(3,'0')}`).concat(...['B','C','D','E','F'].map((group,groupIndex)=>[...Array([11,20,32,20,20][groupIndex])].map((_,index)=>`${group}${String(index+1).padStart(3,'0')}`)));
 assert.deepEqual(cards.map(card=>card.sourceId),expectedIds);
 const sourceHash=crypto.createHash('sha256').update(fs.readFileSync('docs/mnemonic-sources/explicit-request.json','utf8').replace(/\r\n/g,'\n')).digest('hex');
 assert.equal(data.sourceHashes['explicit-request.json'],sourceHash,'stale explicit source hash');
 const official=new Set(runtime.official),scenes=new Set(runtime.scenes),ids=new Set();
 const eras=new Set(['ancient','goryeo','joseon','empire','occupation','republic']);
 const types=new Set(['ACROSTIC','SENTENCE_ASSOCIATION','WORDPLAY','SEQUENCE','RHYTHM','NUMBER','COMPARISON']);
 const statuses=new Set(['VERIFIED','REVIEW_REQUIRED','CANDIDATE']);
 const sourceById=new Map(source.records.map(record=>[record.id,record]));
 for(const card of cards){
  assert(card.id&&!ids.has(card.id),'duplicate/empty app id '+card.id);ids.add(card.id);
  assert.equal(card.sourceMnemonic,sourceById.get(card.sourceId).sourceMnemonic,'changed sourceMnemonic '+card.sourceId);
  assert(card.title&&card.era&&eras.has(card.era));assert(types.has(card.memoryType),card.sourceId+' invalid memoryType');
  assert(statuses.has(card.status),card.sourceId+' invalid review status');
  assert(Array.isArray(card.keywords)&&card.keywords.length&&card.cueCount===card.keywords.length,card.sourceId+' missing keywords');
  assert(card.keywords.every((keyword,index)=>keyword.order===index+1&&keyword.cue&&keyword.title&&keyword.shortExplanation),card.sourceId+' incomplete keywords');
  assert(card.normalizedSearchText.includes(card.title.normalize('NFKC').replace(/[\s\p{P}\p{S}]/gu,'').toLowerCase()),card.sourceId+' title not searchable');
  if(card.publicationStatus==='PUBLISHED'){
   assert.equal(card.status,'VERIFIED',card.sourceId+' unverified record published');
   assert(card.mnemonic&&card.rightsStatus!=='USER_SUPPLIED_INTERNAL_REVIEW_ONLY',card.sourceId+' public mnemonic rights status missing');
   assert(card.background?.summary&&card.causalFlow.length&&card.examPoints.length,card.sourceId+' incomplete learning detail');
  }else assert.notEqual(card.status,'VERIFIED',card.sourceId+' verified record unexpectedly excluded');
  if(card.status==='REVIEW_REQUIRED')assert.equal(card.publicationStatus,'EXCLUDED');
  assert.deepEqual(card.relatedOfficialQuestionIds,runtime.cards.find(item=>item.id===card.id).relatedOfficialQuestionIds,'stale official links '+card.sourceId);
  assert.deepEqual(card.relatedSceneIds,runtime.cards.find(item=>item.id===card.id).relatedSceneIds,'stale Story links '+card.sourceId);
  for(const id of card.relatedOfficialQuestionIds)assert(official.has(id),'invalid officialQuestionId '+id);
  for(const id of card.relatedSceneIds)assert(scenes.has(id),'invalid relatedSceneId '+id);
 }
 const protectedSamples=['복덕(방) 경희(가) 운(다)','광노(안)과 공복 주제(에) 송광풍 여사~','(2개의) 흥수똥 달제양','효심(에는) 이의있삼?','병(이)제 병문한 정양 오신 초덕광 척','원(산에서) 동경(까지) 배(타고) 26(km)','UWOI'];
 for(const sample of protectedSamples)assert(cards.some(card=>card.sourceMnemonic===sample),'protected source string changed: '+sample);
 assert.equal(new Set(cards.map(card=>card.sourceMnemonic)).size,118,'duplicate sourceMnemonic');
 assert.deepEqual(runtime.cards.map(card=>card.sourceId),cards.map(card=>card.sourceId),'stale generated JS');
 return cards.length;
}
module.exports=validate;
if(require.main===module){
 const data=JSON.parse(fs.readFileSync('dist/mnemonic-inventory.json','utf8')),runtime=require('../scripts/mnemonic-runtime.cjs')();
 const count=validate(data,runtime);
 assert.throws(()=>validate({...data,cards:data.cards.filter(card=>card.sourceId!=='F020')},runtime),/missing explicit mnemonic record/,'missing explicit record must fail the build gate');
 console.log(`PASS: ${count} explicit mnemonic records, exact source strings, review gates, structured detail, canonical question IDs and Story IDs.`);
}
