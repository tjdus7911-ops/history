const fs=require('fs'),assert=require('assert');

const manifest=JSON.parse(fs.readFileSync('docs/official-exams/source-downloads.json','utf8'));
const catalog=JSON.parse(fs.readFileSync('dist/official-exam-catalog.json','utf8'));
const expected=new Set(catalog.map(row=>`${row.examRound}-${row.examLevel==='심화'?'advanced':'basic'}`));
const actual=new Set(manifest.editions.map(row=>row.key));
assert.equal(manifest.publisher,'국사편찬위원회 한국사능력검정시험');
const inventory=JSON.parse(fs.readFileSync('dist/official-exam-inventory.json','utf8'));
const official=manifest.editions.filter(row=>row.source!=='user-supplied');
const supplied=manifest.editions.filter(row=>row.source==='user-supplied');
assert.equal(manifest.editions.length,37);
assert.deepEqual(actual,expected);
assert.equal(official.length,36);
assert.equal(new Set(official.map(row=>row.questionFileId)).size,36);
assert.equal(new Set(official.map(row=>row.answerFileId)).size,36);
// Editions attached directly by the user before the publisher's file IDs are known are pinned by PDF hash.
for(const row of supplied){
  const exam=inventory.exams.find(item=>`${item.examRound}-${item.examLevel==='심화'?'advanced':'basic'}`===row.key);
  assert(exam,row.key+' inventory edition');
  assert.equal(row.questionPdfSha256,exam.questionPdfSha256,row.key+' question PDF hash');
  assert.equal(row.answerPdfSha256,exam.answerPdfSha256,row.key+' answer PDF hash');
}
for(const row of official){
  assert(/^\d{2}-(advanced|basic)$/.test(row.key),row.key);
  assert(/^B_\d+$/.test(row.questionFileId),row.key+' question file ID');
  assert(/^B_\d+$/.test(row.answerFileId),row.key+' answer file ID');
  assert(/^\d{10}$/.test(row.postId),row.key+' post ID');
}
assert(manifest.repositoryUrl.startsWith('https://www.historyexam.go.kr/'));
assert(manifest.downloadUrlTemplate.includes('{fileId}'));
console.log('PASS: all 37 active editions map to unique official PDF downloads or hash-pinned attached PDFs.');
