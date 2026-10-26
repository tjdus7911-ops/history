const fs=require('fs');
const path=require('path');

const root=path.resolve(__dirname,'..');
const readJson=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const catalog=readJson('dist/official-exam-catalog.json');
const explanations=readJson('dist/official-exam-explanations.json');
const media=readJson('docs/official-exams/question-choice-media.json');
const sourceTextAudit=readJson('docs/official-exams/choice-source-text-audit.json');
const sourceTextCorrections=readJson('config/official-choice-source-corrections.json');
const check=process.argv.includes('--check');

if(catalog.length!==1850)throw new Error(`expected 1850 catalog records, received ${catalog.length}`);
if(explanations.schemaVersion!==3||explanations.records?.length!==catalog.length)throw new Error('official explanation source is incomplete');
if(media.schemaVersion!==1||media.records?.length!==catalog.length||media.contentImageAssetCount!==catalog.length)throw new Error('official choice media ledger is incomplete');
if(sourceTextAudit.schemaVersion!==1||sourceTextAudit.auditedQuestionCount!==catalog.length)throw new Error('official source-text audit is incomplete');
if(sourceTextCorrections.schemaVersion!==1||!Array.isArray(sourceTextCorrections.records))throw new Error('official source-text corrections are invalid');
if(sourceTextAudit.sourceHashMatchedQuestionCount!==catalog.length||sourceTextAudit.freshOcrQuestionCount+(sourceTextAudit.pdfTextLayerQuestionCount||0)!==catalog.length||sourceTextAudit.unverifiedQuestionCount!==0||sourceTextAudit.potentialUncorrectedHintQuestionIds?.length)throw new Error('official source-text audit has unresolved records');
if(sourceTextAudit.sourceTextCorrectionQuestionCount!==sourceTextCorrections.records.length||sourceTextAudit.imageChoiceProseSuppressedQuestionCount!==media.presentationCounts.image)throw new Error('official source-text audit counts are stale');

const explanationById=new Map(explanations.records.map(record=>[record.officialQuestionId,record]));
const mediaById=new Map(media.records.map(record=>[record.officialQuestionId,record]));
const correctionById=new Map(sourceTextCorrections.records.map(record=>[record.officialQuestionId,record]));
if(correctionById.size!==sourceTextCorrections.records.length)throw new Error('duplicate official source-text correction ID');
const records=catalog.map(source=>{
 const explanation=explanationById.get(source.officialQuestionId),visual=mediaById.get(source.officialQuestionId),expected=source.examLevel==='기본'?4:5;
 if(!explanation||!visual)throw new Error(`missing choice UI source: ${source.officialQuestionId}`);
 if(explanation.choices?.length!==expected||explanation.choices.some(choice=>!String(choice||'').trim()))throw new Error(`invalid explanation choice text: ${source.officialQuestionId}`);
 if(visual.sourceDetailSha256!==source.detailImageSha256)throw new Error(`stale media source hash: ${source.officialQuestionId}`);
 if(!visual.contentImage?.path||!Number.isInteger(visual.contentImage.width)||!Number.isInteger(visual.contentImage.height))throw new Error(`invalid physical content image: ${source.officialQuestionId}`);
 if(!['text','image','mixed'].includes(visual.presentation))throw new Error(`invalid choice presentation: ${source.officialQuestionId}`);
 if(visual.presentation==='text'&&visual.choiceMedia.length!==0)throw new Error(`text choice unexpectedly has image assets: ${source.officialQuestionId}`);
 if(visual.presentation!=='text'&&visual.choiceMedia.length!==expected)throw new Error(`incomplete choice image assets: ${source.officialQuestionId}`);
 const correction=correctionById.get(source.officialQuestionId);
 if(correction&&correction.sourceDetailSha256!==source.detailImageSha256)throw new Error(`stale source-text correction: ${source.officialQuestionId}`);
 const sourceChoices=visual.presentation==='image'?Array(expected).fill(''):correction?.originalChoices||explanation.choices;
 if(sourceChoices.length!==expected||visual.presentation!=='image'&&sourceChoices.some(choice=>!String(choice||'').trim()))throw new Error(`invalid original choice text: ${source.officialQuestionId}`);
 return {officialQuestionId:source.officialQuestionId,question:String(explanation.question||'').trim(),choices:sourceChoices.map(choice=>String(choice).trim()),contentImage:visual.contentImage.path,contentImageWidth:visual.contentImage.width,contentImageHeight:visual.contentImage.height,contentImageSha256:visual.contentImage.sha256,choicePresentation:visual.presentation,choiceMedia:visual.choiceMedia.map(item=>({choiceIndex:item.choiceIndex,path:item.path,width:item.width,height:item.height,sha256:item.sha256}))};
});
const choiceCount=records.reduce((sum,record)=>sum+record.choices.length,0);
if(choiceCount!==8600)throw new Error(`expected 8600 choices, received ${choiceCount}`);
const payload={schemaVersion:3,canonicalQuestionCount:records.length,canonicalChoiceCount:choiceCount,contentImageAssetCount:media.contentImageAssetCount,choiceMediaAssetCount:media.choiceMediaAssetCount,presentationCounts:media.presentationCounts,sourceTextCorrectionCount:correctionById.size,imageChoiceProseSuppressedQuestionCount:media.presentationCounts.image,answerDataIncluded:false,source:'official-exam-explanations.json + question-choice-media.json + choice-source-text-audit.json',records};
const json=JSON.stringify(payload,null,2)+'\n';
const js='/* Verified choice text and answer-free physical question/choice media. */\n'+
 `globalThis.OFFICIAL_EXAM_CHOICE_RECORDS=${JSON.stringify(records)};\n`+
 `globalThis.OFFICIAL_EXAM_CHOICE_META=${JSON.stringify({...payload,records:undefined},(key,value)=>value===undefined?undefined:value)};\n`;
const outputs=[['dist/official-exam-choices.json',json],['dist/official-exam-choices.js',js]];
if(check){
 for(const [file,content] of outputs)if(!fs.existsSync(path.join(root,file))||fs.readFileSync(path.join(root,file),'utf8')!==content)throw new Error(`stale generated choice UI data: ${file}`);
 console.log(`OK ${records.length} answer-free question records and ${choiceCount} choices`);
}else{
 for(const [file,content] of outputs)fs.writeFileSync(path.join(root,file),content,'utf8');
 console.log(`WROTE ${records.length} answer-free question records and ${choiceCount} choices`);
}
