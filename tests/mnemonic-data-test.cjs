const fs=require('fs'),assert=require('assert'),crypto=require('crypto');
function validate(data,runtime){
 const cards=data.cards,baseline=cards.filter(c=>c.number!==null);
 assert.equal(baseline.length,111,'missing baseline mnemonic');
 assert.deepEqual(baseline.map(c=>c.number).sort((a,b)=>a-b),Array.from({length:111},(_,i)=>i+1));
 for(const [file,hash] of Object.entries(data.sourceHashes))assert.equal(crypto.createHash('sha256').update(fs.readFileSync('docs/mnemonic-sources/'+file,'utf8').replace(/\r\n/g,'\n')).digest('hex'),hash,'stale source '+file);
 const primary=fs.readFileSync('docs/mnemonic-sources/primary-reference.txt','utf8');
 const normalize=s=>s.normalize('NFKC').replace(/[\s\p{P}\p{S}]/gu,'');
 const raw=normalize(fs.readFileSync('docs/mnemonic-sources/raw-source.txt','utf8'));
 const official=new Set(runtime.official),scenes=new Set(runtime.scenes),ids=new Set(),phrases=new Set();
 const eras=new Set(['ancient','goryeo','joseon','empire','occupation','republic']),types=new Set(['ACROSTIC','SENTENCE','WORDPLAY','SEQUENCE','NUMBER','STORY','RHYTHM','COMPARE']);
 for(const c of cards){
  assert(c.id&&!ids.has(c.id),'duplicate/empty id '+c.id);ids.add(c.id);
  const phrase=c.originalMnemonic.replace(/\s+/g,'');assert(phrase&&!phrases.has(phrase),'duplicate/empty mnemonic '+c.id);phrases.add(phrase);
  assert.notEqual(phrase,c.title.replace(/\s+/g,''));assert(eras.has(c.era));assert(types.has(c.memoryType));
  if(c.number!==null)assert(primary.replace(/\r/g,'').includes(c.originalMnemonic),'changed primary text '+c.number);
  assert(c.sourceFacts.length&&c.facts.length&&c.cueCount===c.sourceFacts.length);
  for(const f of c.sourceFacts){assert(f.cue&&f.title&&f.evidence.length,'empty source fact '+c.id);assert(raw.includes(normalize(f.title)),'fact absent from RAW '+c.id+': '+f.title);}
  assert(['PUBLISHED','CANDIDATE','REVIEW_REQUIRED'].includes(c.status));
  if(c.status==='PUBLISHED'){assert(c.publicMnemonic);assert.equal(c.verifiedFacts.length,c.sourceFacts.length);assert(c.verifiedFacts.every(f=>f.evidence.length));}
  const live=runtime.cards.find(x=>x.id===c.id);assert(live);
  assert.deepEqual(c.relatedOfficialQuestionIds,live.relatedOfficialQuestionIds,'stale canonical links '+c.id);
  assert.deepEqual(c.relatedSceneIds,live.relatedSceneIds,'stale scene links '+c.id);
  for(const id of live.relatedOfficialQuestionIds)assert(official.has(id),'invalid official id '+id);
  for(const id of live.relatedSceneIds)assert(scenes.has(id),'invalid scene id '+id);
 }
 assert.deepEqual(runtime.cards.map(c=>c.id),cards.map(c=>c.id),'stale generated JS');
 return cards.length;
}
module.exports=validate;
if(require.main===module){
 const data=JSON.parse(fs.readFileSync('dist/mnemonic-inventory.json','utf8')),runtime=require('../scripts/mnemonic-runtime.cjs')();
 const count=validate(data,runtime);
 assert.throws(()=>validate({...data,cards:data.cards.filter(c=>c.number!==111)},runtime),/missing baseline/,'missing baseline must fail the build gate');
 console.log(`PASS: ${count} source mnemonics, all 111 baseline entries, unique IDs/text, fact cues and canonical/Story link validation; missing-entry fixture rejected.`);
}
