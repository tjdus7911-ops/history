const fs=require('node:fs'),assert=require('node:assert');
const catalog=require('../dist/official-exam-catalog.json');
const explanations=require('../dist/official-exam-explanations.json');
const report=require('../dist/ancient-exam-analysis.json');
const ids=new Set(catalog.map(record=>record.officialQuestionId));
assert.equal(catalog.length,1800);assert.equal(ids.size,1800);assert.equal(report.totals.catalogRows,1800);assert.equal(report.totals.uniqueOfficialQuestionIds,1800);assert.equal(report.totals.duplicateRows,0);assert.equal(report.totals.explanationRecords,1800);assert.equal(explanations.records.length,1800);
assert.equal(report.totals.ancientPrimaryEra,catalog.filter(record=>record.primaryEra==='ancient').length);assert.equal(report.totals.basicRelated+report.totals.advancedRelated,report.totals.ancientRelatedUnique);
for(const topic of ['proto-buyeo','proto-early-goguryeo','proto-okjeo','proto-dongye','proto-samhan','three-goguryeo','three-baekje','three-silla','three-gaya','unified-silla','balhae','jang-bogo']){const row=report.byTopic[topic];assert(row&&row.count>0,topic);assert.equal(row.basic+row.advanced,row.count);assert(row.ids.every(id=>ids.has(id)),topic+' invalid ID');}
assert(Object.keys(report.byType).length>=5);assert(Object.keys(report.byDifficulty).length===3);assert(fs.readFileSync('docs/ANCIENT_EXAM_ANALYSIS.md','utf8').includes(`원삼국·삼국 키워드 관련 고유 문항: **${report.totals.ancientRelatedUnique}**`));
console.log(`PASS: ${report.totals.catalogRows} rows / ${report.totals.uniqueOfficialQuestionIds} unique IDs / ${report.totals.ancientRelatedUnique} ancient-related questions analyzed without duplication.`);
