const fs=require('fs'),assert=require('assert');

const catalog=require('../dist/official-exam-catalog.json');
const full=require('../dist/official-exam-explanations.json');
const choices=require('../dist/official-exam-choices.json');
const media=require('../docs/official-exams/question-choice-media.json');
const audit=require('../docs/official-exams/choice-source-text-audit.json');
const corrections=require('../config/official-choice-source-corrections.json');
const byFull=new Map(full.records.map(record=>[record.officialQuestionId,record]));
const byMedia=new Map(media.records.map(record=>[record.officialQuestionId,record]));
const correctionById=new Map(corrections.records.map(record=>[record.officialQuestionId,record]));

assert.equal(choices.schemaVersion,3);
assert.equal(choices.answerDataIncluded,false);
assert.equal(choices.canonicalQuestionCount,1800);
assert.equal(choices.canonicalChoiceCount,8350);
assert.equal(choices.records.length,catalog.length);
assert.equal(media.canonicalQuestionCount,1800);
assert.equal(media.contentImageAssetCount,1800);
assert.equal(media.choiceMediaAssetCount,498);
assert.deepEqual(media.presentationCounts,{text:1687,image:105,mixed:8});
assert.equal(media.records.length,1800);
assert.equal(audit.auditedQuestionCount,1800);
assert.equal(audit.sourceHashMatchedQuestionCount,1800);
assert.equal(audit.freshOcrQuestionCount,1800);
assert.equal(audit.unverifiedQuestionCount,0);
assert.equal(audit.sourceTextCorrectionQuestionCount,corrections.records.length);
assert.equal(audit.imageChoiceProseSuppressedQuestionCount,media.presentationCounts.image);
assert.equal(audit.originalMismatchQuestionCount,corrections.records.length+media.presentationCounts.image);
assert.equal(choices.sourceTextCorrectionCount,corrections.records.length);
assert.equal(choices.imageChoiceProseSuppressedQuestionCount,media.presentationCounts.image);

let choiceCount=0;
for(const [index,record] of choices.records.entries()){
 const source=catalog[index],fullRecord=byFull.get(record.officialQuestionId),visual=byMedia.get(record.officialQuestionId),expected=source.examLevel==='기본'?4:5;
 assert.equal(record.officialQuestionId,source.officialQuestionId,'choice bundle order drifted from catalog');
 assert.deepEqual(Object.keys(record),['officialQuestionId','question','choices','contentImage','contentImageWidth','contentImageHeight','contentImageSha256','choicePresentation','choiceMedia'],'answer-bearing field leaked into pre-grade bundle');
 assert.equal(record.question,fullRecord.question);
 const expectedChoices=visual.presentation==='image'?Array(expected).fill(''):correctionById.get(record.officialQuestionId)?.originalChoices||fullRecord.choices;
 assert.deepEqual(record.choices,expectedChoices);
 assert.equal(record.choices.length,expected);
 assert(record.choices.every(value=>typeof value==='string'));
 if(visual.presentation!=='image')assert(record.choices.every(value=>value.trim().length>0));
 assert.equal(record.contentImage,visual.contentImage.path);
 assert.equal(record.contentImageWidth,visual.contentImage.width);
 assert.equal(record.contentImageHeight,visual.contentImage.height);
 assert.equal(record.contentImageSha256,visual.contentImage.sha256);
 assert.equal(record.choicePresentation,visual.presentation);
 assert.equal(record.choiceMedia.length,visual.presentation==='text'?0:expected);
 assert.deepEqual(record.choiceMedia.map(item=>item.choiceIndex),visual.choiceMedia.map(item=>item.choiceIndex));
 assert.equal(visual.sourceDetailSha256,source.detailImageSha256);
 choiceCount+=record.choices.length;
}
assert.equal(choiceCount,8350);
assert.deepEqual(choices.records.find(record=>record.officialQuestionId==='official-79-advanced-17').choices,['(가)','(나)','(다)','(라)','(마)']);
assert(choices.records.filter(record=>record.choicePresentation==='image').every(record=>record.choices.every(choice=>choice==='')),'pure image choices must not leak explanatory identity prose before grading');

const index=fs.readFileSync('dist/index.html','utf8'),ui=fs.readFileSync('dist/exam-memory-ui.js','utf8'),v2=fs.readFileSync('dist/v2-app.js','utf8'),css=fs.readFileSync('dist/exam-memory.css','utf8'),sw=fs.readFileSync('dist/sw.js','utf8');
assert(index.indexOf('official-exam-choices.js')<index.indexOf('exam-memory-ui.js'),'choice text must load before official UI construction');
assert(sw.includes("'/official-exam-choices.js'"),'answer-free choice data is missing from the offline shell');
assert(ui.includes('function officialChoiceSelector')&&(ui.match(/officialChoiceSelector\(/g)||[]).length>=3,'learning, exam, and review must share the text-choice component');
assert(ui.includes("delete officialExamSession.answers[id]"),'selected option cannot be cleared');
assert(ui.includes('role="radio"')&&ui.includes('aria-checked'),'choice component is not radio-style accessible');
assert(ui.includes('officialContentImage')&&ui.includes('official-modal-content-crop'),'physical question image is not shared by inline and fullscreen views');
assert(!ui.includes('officialContentCrop'),'retired CSS crop helper remains');
assert(ui.includes('official-choice-media'),'image choices are not connected to the shared selector');
assert(ui.includes('const sourceChoices=OFFICIAL_CHOICE_UI_BY_SOURCE_ID.get(record.officialQuestionId)?.choices'),'explanation hydration can overwrite source-faithful pre-grade choices');
assert(v2.includes('v2OfficialQuestionImage')&&v2.includes("OFFICIAL_EXAM_UI?.imageOpen?.(q"),'wrong-note detail must reuse the question-only crop');
for(const contract of ['min-height:64px','overflow-wrap:anywhere','.official-choice-label','.official-content-image'])assert(css.includes(contract),`missing choice UI CSS contract: ${contract}`);

console.log('PASS: 1,800 answer-free choice records, 1,800 physical content images, 498 choice images, and shared radio interaction contracts.');
