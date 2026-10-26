const assert=require('assert');
const {assertAsset,assertSha256IfLocal}=require('./deployment-asset-test-helper.cjs');
const ledger=require('../docs/official-exams/question-choice-media.json');
const expectedByLevel=id=>id.includes('-basic-')?4:5;
const seen=new Set();
let contentCount=0,choiceCount=0;

assert.equal(ledger.schemaVersion,1);
assert.equal(ledger.canonicalQuestionCount,1850);
assert.deepEqual(ledger.presentationCounts,{text:1735,image:107,mixed:8});
for(const record of ledger.records){
  assert(!seen.has(record.officialQuestionId),`duplicate record: ${record.officialQuestionId}`);seen.add(record.officialQuestionId);
  assert(['text','image','mixed'].includes(record.presentation),`unknown presentation: ${record.officialQuestionId}`);
  const content='dist/'+record.contentImage.path,source='dist/'+record.sourceDetailImage;
  assertAsset(source,`missing canonical detail source: ${record.sourceDetailImage}`);
  assertAsset(content,`missing physical content image: ${record.contentImage.path}`);
  assertSha256IfLocal(source,record.sourceDetailSha256,`stale canonical detail source: ${record.officialQuestionId}`);
  assertSha256IfLocal(content,record.contentImage.sha256,`stale physical content image: ${record.officialQuestionId}`);
  assert(record.contentImage.width>0&&record.contentImage.height>0&&record.contentImage.bytes>0,`invalid content dimensions: ${record.officialQuestionId}`);
  const expected=record.presentation==='text'?0:expectedByLevel(record.officialQuestionId);
  assert.equal(record.choiceMedia.length,expected,`choice media count: ${record.officialQuestionId}`);
  assert.deepEqual(record.choiceMedia.map(item=>item.choiceIndex),Array.from({length:expected},(_,index)=>index),`choice order: ${record.officialQuestionId}`);
  for(const item of record.choiceMedia){
    const file='dist/'+item.path;assertAsset(file,`missing choice image: ${item.path}`);
    assertSha256IfLocal(file,item.sha256,`stale choice image: ${record.officialQuestionId}/${item.choiceIndex+1}`);
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

console.log('PASS: 1,850 physical question images and 508 ordered choice images match their source hashes.');
