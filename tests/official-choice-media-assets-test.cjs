const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert');

const root=path.resolve(__dirname,'..');
const ledger=require('../docs/official-exams/question-choice-media.json');
const expectedByLevel=id=>id.includes('-basic-')?4:5;
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const seen=new Set();
let contentCount=0,choiceCount=0;

assert.equal(ledger.schemaVersion,1);
assert.equal(ledger.canonicalQuestionCount,1800);
assert.deepEqual(ledger.presentationCounts,{text:1687,image:105,mixed:8});
for(const record of ledger.records){
  assert(!seen.has(record.officialQuestionId),`duplicate record: ${record.officialQuestionId}`);seen.add(record.officialQuestionId);
  assert(['text','image','mixed'].includes(record.presentation),`unknown presentation: ${record.officialQuestionId}`);
  const content=path.join(root,'dist',record.contentImage.path),source=path.join(root,'dist',record.sourceDetailImage);
  assert(fs.existsSync(source),`missing canonical detail source: ${record.sourceDetailImage}`);
  assert(fs.existsSync(content),`missing physical content image: ${record.contentImage.path}`);
  assert.equal(sha(source),record.sourceDetailSha256,`stale canonical detail source: ${record.officialQuestionId}`);
  assert.equal(sha(content),record.contentImage.sha256,`stale physical content image: ${record.officialQuestionId}`);
  assert(record.contentImage.width>0&&record.contentImage.height>0&&record.contentImage.bytes>0,`invalid content dimensions: ${record.officialQuestionId}`);
  const expected=record.presentation==='text'?0:expectedByLevel(record.officialQuestionId);
  assert.equal(record.choiceMedia.length,expected,`choice media count: ${record.officialQuestionId}`);
  assert.deepEqual(record.choiceMedia.map(item=>item.choiceIndex),Array.from({length:expected},(_,index)=>index),`choice order: ${record.officialQuestionId}`);
  for(const item of record.choiceMedia){
    const file=path.join(root,'dist',item.path);assert(fs.existsSync(file),`missing choice image: ${item.path}`);
    assert.equal(sha(file),item.sha256,`stale choice image: ${record.officialQuestionId}/${item.choiceIndex+1}`);
    assert(item.width>0&&item.height>0&&item.bytes>0,`invalid choice image dimensions: ${record.officialQuestionId}/${item.choiceIndex+1}`);
    choiceCount++;
  }
  contentCount++;
}
assert.equal(contentCount,ledger.contentImageAssetCount);
assert.equal(choiceCount,ledger.choiceMediaAssetCount);

for(const id of ['official-79-basic-01','official-79-basic-03','official-79-basic-07']){
  const record=ledger.records.find(item=>item.officialQuestionId===id);assert(record,`missing required QA record: ${id}`);
  assert.equal(record.contentImage.pdfPageRects240Dpi.length,1,`missing original PDF coordinates: ${id}`);
}
assert.equal(ledger.records.find(item=>item.officialQuestionId==='official-79-basic-01').choiceMedia.length,0);
assert.equal(ledger.records.find(item=>item.officialQuestionId==='official-79-basic-03').choiceMedia.length,4);
assert.equal(ledger.records.find(item=>item.officialQuestionId==='official-79-basic-07').choiceMedia.length,4);

console.log('PASS: 1,800 physical question images and 498 ordered choice images match their source hashes.');
