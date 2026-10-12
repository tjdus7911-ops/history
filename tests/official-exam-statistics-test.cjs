const fs=require('fs'),vm=require('vm'),assert=require('assert');

const source=JSON.parse(fs.readFileSync('docs/official-exams/round-statistics.json','utf8'));
const published=JSON.parse(fs.readFileSync('dist/official-exam-statistics.json','utf8'));
const catalog=JSON.parse(fs.readFileSync('dist/official-exam-catalog.json','utf8'));
const editionKeys=new Set(catalog.map(row=>`${row.examRound}-${row.examLevel==='심화'?'advanced':'basic'}`));

assert.equal(editionKeys.size,36);
assert.equal(source.records.length,34);
assert.equal(source.unavailableEditions.length,2);
assert.deepEqual(new Set([...Object.keys(published.byEdition),...published.unavailableEditions.map(row=>row.key)]),editionKeys);
assert.equal(published.byEdition['79-advanced'].passRateRaw,'63.60');
assert.equal(published.byEdition['79-advanced'].examinees,125510);
assert.equal(published.byEdition['79-advanced'].certified,79827);
assert.equal(published.byEdition['78-advanced'].passRateRaw,'55.41');
assert.equal(published.byEdition['57-advanced'].examinees,null);
assert.equal(published.byEdition['76-advanced'].verificationStatus,'OFFICIAL_VERIFIED_WITH_NOTE');
assert.equal(published.byEdition['59-advanced'].announcedAt,'2022-06-24');
assert.equal(published.byEdition['60-advanced'].announcedAt,'2022-08-19');
assert.equal(published.byEdition['61-basic'].announcedAt,'2022-11-04');
assert.equal(published.byEdition['62-advanced'].announcedAt,'2022-12-16');
assert.equal(published.byEdition['65-advanced'].announcedAt,'2023-06-30');
assert(!published.byEdition['63-advanced']);
assert(published.unavailableEditions.some(row=>row.key==='63-basic'&&row.verificationStatus==='SOURCE_NOT_FOUND'));
for(const row of Object.values(published.byEdition)){
  assert(/^https:\/\/www\.history\.go\.kr\//.test(row.sourceUrl),row.key+' official source URL');
  assert(/^\d{4}-\d{2}-\d{2}$/.test(row.announcedAt),row.key+' announcement date');
  assert.equal(row.passRateRaw,Number(row.passRate).toFixed(2),row.key+' original precision');
  assert(!Object.hasOwn(row,'applicants'),row.key+' must not mislabel actual examinees as applicants');
}

const context={};vm.createContext(context);
vm.runInContext(fs.readFileSync('dist/official-exam-statistics.js','utf8'),context);
assert.deepEqual(JSON.parse(JSON.stringify(context.OFFICIAL_EXAM_STATISTICS)),published);
console.log('PASS: 34 official edition pass rates are sourced and 2 unavailable 63rd-edition rates remain explicitly unreported.');
