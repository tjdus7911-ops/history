const fs=require('fs');
const path=require('path');

const root=path.resolve(__dirname,'..');
const readJson=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const catalog=readJson('dist/official-exam-catalog.json');
const explanations=readJson('dist/official-exam-explanations.json');
const media=readJson('docs/official-exams/question-choice-media.json');
const check=process.argv.includes('--check');

if(catalog.length!==1800)throw new Error(`expected 1800 catalog records, received ${catalog.length}`);
if(explanations.schemaVersion!==3||explanations.records?.length!==catalog.length)throw new Error('official explanation source is incomplete');
if(media.schemaVersion!==1||media.records?.length!==catalog.length||media.contentImageAssetCount!==catalog.length)throw new Error('official choice media ledger is incomplete');

const explanationById=new Map(explanations.records.map(record=>[record.officialQuestionId,record]));
const mediaById=new Map(media.records.map(record=>[record.officialQuestionId,record]));
const records=catalog.map(source=>{
 const explanation=explanationById.get(source.officialQuestionId),visual=mediaById.get(source.officialQuestionId),expected=source.examLevel==='기본'?4:5;
 if(!explanation||!visual)throw new Error(`missing choice UI source: ${source.officialQuestionId}`);
 if(explanation.choices?.length!==expected||explanation.choices.some(choice=>!String(choice||'').trim()))throw new Error(`invalid choice text: ${source.officialQuestionId}`);
 if(visual.sourceDetailSha256!==source.detailImageSha256)throw new Error(`stale media source hash: ${source.officialQuestionId}`);
 if(!visual.contentImage?.path||!Number.isInteger(visual.contentImage.width)||!Number.isInteger(visual.contentImage.height))throw new Error(`invalid physical content image: ${source.officialQuestionId}`);
 if(!['text','image','mixed'].includes(visual.presentation))throw new Error(`invalid choice presentation: ${source.officialQuestionId}`);
 if(visual.presentation==='text'&&visual.choiceMedia.length!==0)throw new Error(`text choice unexpectedly has image assets: ${source.officialQuestionId}`);
 if(visual.presentation!=='text'&&visual.choiceMedia.length!==expected)throw new Error(`incomplete choice image assets: ${source.officialQuestionId}`);
 return {officialQuestionId:source.officialQuestionId,question:String(explanation.question||'').trim(),choices:explanation.choices.map(choice=>String(choice).trim()),contentImage:visual.contentImage.path,contentImageWidth:visual.contentImage.width,contentImageHeight:visual.contentImage.height,contentImageSha256:visual.contentImage.sha256,choicePresentation:visual.presentation,choiceMedia:visual.choiceMedia.map(item=>({choiceIndex:item.choiceIndex,path:item.path,width:item.width,height:item.height,sha256:item.sha256}))};
});
const choiceCount=records.reduce((sum,record)=>sum+record.choices.length,0);
if(choiceCount!==8350)throw new Error(`expected 8350 choices, received ${choiceCount}`);
const payload={schemaVersion:2,canonicalQuestionCount:records.length,canonicalChoiceCount:choiceCount,contentImageAssetCount:media.contentImageAssetCount,choiceMediaAssetCount:media.choiceMediaAssetCount,presentationCounts:media.presentationCounts,answerDataIncluded:false,source:'official-exam-explanations.json + question-choice-media.json',records};
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
