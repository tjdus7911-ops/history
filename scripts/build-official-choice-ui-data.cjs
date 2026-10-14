const fs=require('fs');
const path=require('path');

const root=path.resolve(__dirname,'..');
const readJson=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const catalog=readJson('dist/official-exam-catalog.json');
const explanations=readJson('dist/official-exam-explanations.json');
const crops=readJson('docs/official-exams/question-content-crops.json');
const check=process.argv.includes('--check');

if(catalog.length!==1800)throw new Error(`expected 1800 catalog records, received ${catalog.length}`);
if(explanations.schemaVersion!==3||explanations.records?.length!==catalog.length)throw new Error('official explanation source is incomplete');
if(crops.schemaVersion!==1||crops.failureCount!==0||crops.records?.length!==catalog.length)throw new Error('official content crop ledger is incomplete');

const explanationById=new Map(explanations.records.map(record=>[record.officialQuestionId,record]));
const cropById=new Map(crops.records.map(record=>[record.officialQuestionId,record]));
const records=catalog.map(source=>{
 const explanation=explanationById.get(source.officialQuestionId),crop=cropById.get(source.officialQuestionId),expected=source.examLevel==='기본'?4:5;
 if(!explanation||!crop)throw new Error(`missing choice UI source: ${source.officialQuestionId}`);
 if(explanation.choices?.length!==expected||explanation.choices.some(choice=>!String(choice||'').trim()))throw new Error(`invalid choice text: ${source.officialQuestionId}`);
 if(crop.sourceImageSha256!==source.detailImageSha256)throw new Error(`stale crop image hash: ${source.officialQuestionId}`);
 const ratio=Number(crop.contentCropRatio);
 if(!Number.isFinite(ratio)||ratio<0.2||ratio>0.985)throw new Error(`invalid crop ratio: ${source.officialQuestionId}`);
 return {officialQuestionId:source.officialQuestionId,question:String(explanation.question||'').trim(),choices:explanation.choices.map(choice=>String(choice).trim()),contentCropRatio:ratio};
});
const choiceCount=records.reduce((sum,record)=>sum+record.choices.length,0);
if(choiceCount!==8350)throw new Error(`expected 8350 choices, received ${choiceCount}`);
const payload={schemaVersion:1,canonicalQuestionCount:records.length,canonicalChoiceCount:choiceCount,answerDataIncluded:false,source:'official-exam-explanations.json + question-content-crops.json',records};
const json=JSON.stringify(payload,null,2)+'\n';
const js='/* Verified choice text and answer-free content crop metadata. */\n'+
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
