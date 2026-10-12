const fs=require('fs'),assert=require('assert');

const manifest=JSON.parse(fs.readFileSync('docs/official-exams/source-downloads.json','utf8'));
const catalog=JSON.parse(fs.readFileSync('dist/official-exam-catalog.json','utf8'));
const expected=new Set(catalog.map(row=>`${row.examRound}-${row.examLevel==='심화'?'advanced':'basic'}`));
const actual=new Set(manifest.editions.map(row=>row.key));
assert.equal(manifest.publisher,'국사편찬위원회 한국사능력검정시험');
assert.equal(manifest.editions.length,36);
assert.deepEqual(actual,expected);
assert.equal(new Set(manifest.editions.map(row=>row.questionFileId)).size,36);
assert.equal(new Set(manifest.editions.map(row=>row.answerFileId)).size,36);
for(const row of manifest.editions){
  assert(/^\d{2}-(advanced|basic)$/.test(row.key),row.key);
  assert(/^B_\d+$/.test(row.questionFileId),row.key+' question file ID');
  assert(/^B_\d+$/.test(row.answerFileId),row.key+' answer file ID');
  assert(/^\d{10}$/.test(row.postId),row.key+' post ID');
}
assert(manifest.repositoryUrl.startsWith('https://www.historyexam.go.kr/'));
assert(manifest.downloadUrlTemplate.includes('{fileId}'));
console.log('PASS: all 36 active editions map to unique official problem and answer PDF downloads.');
