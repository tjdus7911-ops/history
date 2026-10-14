const fs=require('fs'),assert=require('assert');

const catalog=require('../dist/official-exam-catalog.json');
const full=require('../dist/official-exam-explanations.json');
const choices=require('../dist/official-exam-choices.json');
const crops=require('../docs/official-exams/question-content-crops.json');
const byFull=new Map(full.records.map(record=>[record.officialQuestionId,record]));
const byCrop=new Map(crops.records.map(record=>[record.officialQuestionId,record]));

assert.equal(choices.schemaVersion,1);
assert.equal(choices.answerDataIncluded,false);
assert.equal(choices.canonicalQuestionCount,1800);
assert.equal(choices.canonicalChoiceCount,8350);
assert.equal(choices.records.length,catalog.length);
assert.equal(crops.failureCount,0);
assert.equal(crops.detectedQuestionCount,1800);
assert.equal(crops.records.length,1800);

let choiceCount=0;
for(const [index,record] of choices.records.entries()){
 const source=catalog[index],fullRecord=byFull.get(record.officialQuestionId),crop=byCrop.get(record.officialQuestionId),expected=source.examLevel==='기본'?4:5;
 assert.equal(record.officialQuestionId,source.officialQuestionId,'choice bundle order drifted from catalog');
 assert.deepEqual(Object.keys(record),['officialQuestionId','question','choices','contentCropRatio','contentCropY'],'answer-bearing field leaked into pre-grade bundle');
 assert.equal(record.question,fullRecord.question);
 assert.deepEqual(record.choices,fullRecord.choices);
 assert.equal(record.choices.length,expected);
 assert(record.choices.every(value=>typeof value==='string'&&value.trim().length>0));
 assert(record.contentCropRatio>=.2&&record.contentCropRatio<=.985);
 assert.equal(record.contentCropRatio,crop.contentCropRatio);
 assert.equal(record.contentCropY,crop.contentCropY);
 assert.equal(record.contentCropY,Math.round(crop.imageHeight*record.contentCropRatio));
 assert(crop.choiceStartY-record.contentCropY>=Math.min(31,crop.cropGuardPixels-.6),'first choice clearance is too small');
 assert.equal(crop.sourceImageSha256,source.detailImageSha256);
 choiceCount+=record.choices.length;
}
assert.equal(choiceCount,8350);

const index=fs.readFileSync('dist/index.html','utf8'),ui=fs.readFileSync('dist/exam-memory-ui.js','utf8'),v2=fs.readFileSync('dist/v2-app.js','utf8'),css=fs.readFileSync('dist/exam-memory.css','utf8'),sw=fs.readFileSync('dist/sw.js','utf8');
assert(index.indexOf('official-exam-choices.js')<index.indexOf('exam-memory-ui.js'),'choice text must load before official UI construction');
assert(sw.includes("'/official-exam-choices.js'"),'answer-free choice data is missing from the offline shell');
assert(ui.includes('function officialChoiceSelector')&&(ui.match(/officialChoiceSelector\(/g)||[]).length>=3,'learning, exam, and review must share the text-choice component');
assert(ui.includes("delete officialExamSession.answers[id]"),'selected option cannot be cleared');
assert(ui.includes('role="radio"')&&ui.includes('aria-checked'),'choice component is not radio-style accessible');
assert(ui.includes('officialContentCrop')&&ui.includes('official-modal-content-crop'),'question-only crop is not shared by inline and fullscreen views');
assert(v2.includes('v2OfficialQuestionImage')&&v2.includes("OFFICIAL_EXAM_UI?.imageOpen?.(q"),'wrong-note detail must reuse the question-only crop');
for(const contract of ['min-height:64px','overflow-wrap:anywhere','.official-choice-label','.official-content-image'])assert(css.includes(contract),`missing choice UI CSS contract: ${contract}`);

console.log('PASS: 1,800 answer-free choice records, 8,350 reviewed text options, image-hash crop boundaries, and shared radio interaction contracts.');
