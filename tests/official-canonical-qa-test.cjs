const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const deploymentAssets=require('../scripts/prepare-vercel-output.cjs');
const repoRoot=path.resolve(__dirname,'..');

function webpDimensions(buffer){
  assert.equal(buffer.toString('ascii',0,4),'RIFF');
  assert.equal(buffer.toString('ascii',8,12),'WEBP');
  for(let offset=12;offset+8<=buffer.length;){
    const type=buffer.toString('ascii',offset,offset+4),size=buffer.readUInt32LE(offset+4),data=offset+8;
    if(type==='VP8X')return {width:1+buffer.readUIntLE(data+4,3),height:1+buffer.readUIntLE(data+7,3)};
    if(type==='VP8 '){
      assert.equal(buffer[data+3],0x9d);assert.equal(buffer[data+4],0x01);assert.equal(buffer[data+5],0x2a);
      return {width:buffer.readUInt16LE(data+6)&0x3fff,height:buffer.readUInt16LE(data+8)&0x3fff};
    }
    if(type==='VP8L'){
      assert.equal(buffer[data],0x2f);
      const bits=buffer.readUInt32LE(data+1);
      return {width:1+(bits&0x3fff),height:1+((bits>>>14)&0x3fff)};
    }
    offset=data+size+(size&1);
  }
  throw new Error('No WebP image chunk');
}
const fileSha256=buffer=>crypto.createHash('sha256').update(buffer).digest('hex');

const catalog=JSON.parse(fs.readFileSync('dist/official-exam-catalog.json','utf8'));
const inventory=JSON.parse(fs.readFileSync('dist/official-exam-inventory.json','utf8'));
const explanationPayload=JSON.parse(fs.readFileSync('dist/official-exam-explanations.json','utf8'));
const explanations=explanationPayload.records;
const explanationBootstrapContext={globalThis:{}};
vm.runInNewContext(fs.readFileSync('dist/official-exam-explanations.js','utf8'),explanationBootstrapContext);
const bootstrapExplanations=explanationBootstrapContext.globalThis.OFFICIAL_EXAM_EXPLANATION_RECORDS;
const bootstrapMeta=explanationBootstrapContext.globalThis.OFFICIAL_EXAM_EXPLANATION_META;
const curatedChoiceCorrections=JSON.parse(fs.readFileSync('docs/story-exams/explanation-corrections.json','utf8'));
const manuallyCuratedExplanationById=new Map(curatedChoiceCorrections
  .filter(item=>typeof item.explanation==='string'&&item.explanation.trim())
  .map(item=>[item.officialQuestionId,item.explanation]));
const expectedNewEditions=new Set([
  '61:심화','63:기본','64:기본','66:기본','67:심화',
  '71:기본','71:심화','73:심화','77:기본','79:기본'
]);
const labels=['①','②','③','④','⑤'];
const generic=/핵심 개념을 판별|핵심 단서|자료의 조건과 일치|다른 선택지는 구분해야|확인해야 합니다|자료의 사료·사진·지도 자체가|원문 문제는/;

assert.equal(catalog.length,1800);
assert.equal(inventory.canonicalQuestionCount,1800);
assert.equal(inventory.examEditionCount,36);
assert.deepEqual(inventory.lastImport,{editionCount:10,questionCount:500,existingCanonicalMatchCount:0,duplicateCanonicalKeyCount:0});
assert.equal(explanations.length,1800);
assert.equal(bootstrapExplanations.length,1800);
assert(bootstrapMeta,'core bootstrap metadata missing; regenerate official explanations');
assert.equal(bootstrapMeta.schemaVersion,explanationPayload.schemaVersion);
assert.equal(bootstrapMeta.canonicalQuestionCount,1800);
assert.equal(bootstrapMeta.canonicalChoiceCount,8350);
const bootstrapFields=[
  'officialQuestionId','question','clue','correctChoice','explanation','curated',
  'qualityTier','coreVerificationStatus','coreEvidenceSources',
];
for(const row of bootstrapExplanations){
  assert.deepEqual(Object.keys(row),bootstrapFields,row.officialQuestionId+' bootstrap core fields');
  for(const excluded of ['choices','choiceExplanations','choiceConfidences','choiceImageSha256','acceptedChoiceIndexes']){
    assert(!Object.hasOwn(row,excluded),row.officialQuestionId+' eager choice payload '+excluded);
  }
}
assert.equal(
  explanationPayload.qa.initialCoreRecordJsonBytes,
  Buffer.byteLength(JSON.stringify(bootstrapExplanations)),
);
assert.equal(
  explanationPayload.qa.fullRecordJsonBytes,
  Buffer.byteLength(JSON.stringify(explanations)),
);
assert(explanationPayload.qa.initialCoreRecordJsonBytes<explanationPayload.qa.fullRecordJsonBytes);
assert.equal(new Set(catalog.map(item=>`${item.examRound}:${item.examLevel}:${item.questionNumber}`)).size,1800,'duplicate exam key');
assert.equal(new Set(catalog.map(item=>item.officialQuestionId)).size,1800,'duplicate officialQuestionId');
assert.equal(new Set(explanations.map(item=>item.officialQuestionId)).size,1800,'duplicate explanation ID');

const editionGroups=new Map;
for(const item of catalog){
  const editionKey=`${item.examRound}:${item.examLevel}`;
  if(!editionGroups.has(editionKey))editionGroups.set(editionKey,[]);
  editionGroups.get(editionKey).push(item);
  assert.equal(item.officialQuestionId,`official-${item.examRound}-${item.examLevel==='심화'?'advanced':'basic'}-${String(item.questionNumber).padStart(2,'0')}`);
  assert.equal(item.answerLabel,item.answer===null?'없음':labels[item.answer]);
  assert(item.sourcePage>=1&&item.sourcePage<=12);
  assert.equal(item.imageRevision,'official-exam-hq-v3-240dpi-q80');
  assert.equal(item.imageFormat,'webp');
  assert.equal(item.questionImage,item.detailImage,'legacy questionImage must alias detailImage');
  assert(item.detailImage.includes(`/detail/${item.officialQuestionId}.`),item.detailImage);
  assert(item.thumbnailImage.includes(`/thumbnail/${item.officialQuestionId}.`),item.thumbnailImage);
  assert.equal(item.cropValidation?.status,'passed',item.officialQuestionId+' crop QA');
  const detailPath=path.join('dist',item.detailImage),thumbnailPath=path.join('dist',item.thumbnailImage);
  for(const [kind,imagePath,expectedHash,expectedWidth,expectedHeight,expectedBytes] of [
    ['detail',detailPath,item.detailImageSha256,item.detailImageWidth,item.detailImageHeight,item.detailImageBytes],
    ['thumbnail',thumbnailPath,item.thumbnailImageSha256,item.thumbnailImageWidth,item.thumbnailImageHeight,item.thumbnailImageBytes],
  ]){
    const external=deploymentAssets.externalAssetInfo(repoRoot,imagePath);
    assert(fs.existsSync(imagePath)||external,imagePath);
    if(fs.existsSync(imagePath)){
      const payload=fs.readFileSync(imagePath),dimensions=webpDimensions(payload);
      assert.equal(payload.length,expectedBytes,`${imagePath} byte metadata`);
      assert.equal(fileSha256(payload),expectedHash,`${imagePath} sha256 metadata`);
      assert.deepEqual(dimensions,{width:expectedWidth,height:expectedHeight},`${imagePath} intrinsic dimensions`);
    }else{
      assert.equal(external.bytes,expectedBytes,`${imagePath} external byte metadata`);
    }
    assert(item[kind+'Image'].includes(expectedHash.slice(0,12)),`${imagePath} content hash filename`);
  }
  assert(item.detailImageWidth>=1000,item.officialQuestionId+' detail width is below 240dpi target');
  assert(item.thumbnailImageWidth>=318&&item.thumbnailImageWidth<=320,item.officialQuestionId+' thumbnail width');
  assert(item.thumbnailImageHeight<item.detailImageHeight,item.officialQuestionId+' thumbnail was not downscaled');
}
for(const [key,items] of editionGroups){
  items.sort((a,b)=>a.questionNumber-b.questionNumber);
  assert.deepEqual(items.map(item=>item.questionNumber),Array.from({length:50},(_,index)=>index+1),key+' question sequence');
  for(let index=1;index<items.length;index++){
    assert(items[index-1].sourcePage<=items[index].sourcePage,key+' source page order');
  }
  assert.equal(items.reduce((sum,item)=>sum+item.points,0),100,key+' point total');
  assert.equal(items.length,50,key+' question count');
}
assert.deepEqual(new Set([...expectedNewEditions].filter(key=>editionGroups.has(key))),expectedNewEditions,'missing imported edition');
assert.equal([...expectedNewEditions].reduce((sum,key)=>sum+editionGroups.get(key).length,0),500);

const explanationById=new Map(explanations.map(item=>[item.officialQuestionId,item]));
let canonicalChoiceCount=0;
for(const item of catalog){
  const row=explanationById.get(item.officialQuestionId);
  assert(row&&row.explanation.trim(),item.officialQuestionId+' missing explanation');
  assert(!generic.test(row.explanation),item.officialQuestionId+' generic explanation');
  assert((row.explanation.match(/[.!?](?:[’'\"]|$|\s)/g)||[]).length>=3,item.officialQuestionId+' short explanation');
  const choiceCount=item.examLevel==='심화'?5:4;
  const accepted=Array.isArray(item.acceptedAnswers)?[...new Set(item.acceptedAnswers)].sort((a,b)=>a-b):item.answer===null?[]:[item.answer];
  assert.equal(row.choiceCount,choiceCount,item.officialQuestionId+' choiceCount');
  assert.equal(row.choices.length,choiceCount,item.officialQuestionId+' choices length');
  assert.equal(row.choiceConfidences.length,choiceCount,item.officialQuestionId+' choice confidence length');
  assert.equal(row.choiceImageSha256.length,choiceCount,item.officialQuestionId+' choice image hash length');
  assert.equal(row.choiceExplanations.length,choiceCount,item.officialQuestionId+' choice explanations length');
  assert.deepEqual(row.acceptedChoiceIndexes,accepted,item.officialQuestionId+' accepted answer indexes');
  assert(['CURATED_VERIFIED','CURATED_REVIEWED','KNOWLEDGE_RULE','DATA_REVIEW_REQUIRED'].includes(row.verificationStatus),item.officialQuestionId+' verification status');
  assert(['CURATED_VERIFIED','CURATED_REVIEWED','KNOWLEDGE_RULE','DATA_REVIEW_REQUIRED'].includes(row.coreVerificationStatus),item.officialQuestionId+' core verification status');
  for(let index=0;index<choiceCount;index++){
    const choice=row.choiceExplanations[index];
    assert.equal(choice.choiceIndex,index,item.officialQuestionId+' choice index');
    assert.equal(choice.label,labels[index],item.officialQuestionId+' choice label');
    assert.equal(choice.choiceText,row.choices[index],item.officialQuestionId+' choice text link');
    assert.equal(choice.isCorrect,accepted.includes(index),item.officialQuestionId+' official answer link');
    assert.equal(choice.ocrConfidence,row.choiceConfidences[index],item.officialQuestionId+' OCR confidence link');
    assert.equal(choice.sourceImageSha256,row.choiceImageSha256[index],item.officialQuestionId+' image hash link');
    assert.equal(
      choice.sourceImageHashVerified,
      choice.sourceImageSha256&&item.detailImageSha256
        ?choice.sourceImageSha256===item.detailImageSha256.toLowerCase()
        :null,
      item.officialQuestionId+' image hash verification',
    );
    assert(choice.explanation&&choice.explanation.trim(),item.officialQuestionId+' empty choice explanation');
    assert(['CURATED_VERIFIED','CURATED_REVIEWED','KNOWLEDGE_RULE','DATA_REVIEW_REQUIRED'].includes(choice.verificationStatus),item.officialQuestionId+' choice verification status');
    assert(['VISUALLY_REVIEWED','OCR_EXTRACTED','DATA_REVIEW_REQUIRED'].includes(choice.choiceTextVerificationStatus),item.officialQuestionId+' source-text verification status');
    for(const key of ['relatedEra','relatedTarget','coreConcept','meaning','judgmentReason','evidenceSources'])assert(Object.hasOwn(choice,key),item.officialQuestionId+' missing '+key);
    assert.equal((choice.meaning.match(/[.!?](?=\s|$|[가-힣A-Za-z])/g)||[]).length,1,item.officialQuestionId+' choice summary must be one sentence');
    assert([1,2].includes((choice.judgmentReason.match(/[.!?](?=\s|$|[가-힣A-Za-z])/g)||[]).length),item.officialQuestionId+' judgment must be one or two sentences');
    assert(!/[\r\n]/.test(choice.meaning),item.officialQuestionId+' choice summary must stay one prose sentence');
    assert(!/공식 정답표|공식 정답으로 인정/.test(choice.judgmentReason),item.officialQuestionId+' judgment cites answer table instead of evidence');
    assert.notEqual(choice.meaning.trim(),choice.judgmentReason.trim(),item.officialQuestionId+' summary repeats judgment');
  }
  canonicalChoiceCount+=choiceCount;
}
assert.equal(canonicalChoiceCount,8350);
assert.equal(explanationPayload.schemaVersion,3);
assert.equal(explanationPayload.canonicalChoiceCount,8350);
assert.equal(explanationPayload.qa.forbiddenGenericCount,0);
assert.equal(explanationPayload.qa.newExplanationCount,500);
assert.equal(explanationPayload.qa.modifiedExistingCount,1300);
assert.equal(explanationPayload.qa.metadataMismatchFixedCount,32);
assert.equal(explanationPayload.qa.knowledgeRuleCount,explanations.filter(item=>['curated','knowledge'].includes(item.qualityTier)).length);
assert.equal(explanationPayload.qa.evidenceFallbackCount,explanations.filter(item=>item.qualityTier==='evidence').length);
assert.equal(explanationPayload.qa.choiceCount,8350);
assert.equal(explanationPayload.qa.choiceExplanationCount,8350);
const curatedChoiceCount=curatedChoiceCorrections.reduce((sum,item)=>sum+item.choiceExplanations.length,0);
const allChoiceExplanations=explanations.flatMap(item=>item.choiceExplanations);
const computedChoiceOrderMismatchCount=explanations.filter(row=>
  row.choiceExplanations.length!==row.choiceCount||
  row.choiceExplanations.some((choice,index)=>
    choice.choiceIndex!==index||choice.label!==labels[index]||choice.choiceText!==row.choices[index]
  )
).length;
const computedCorrectChoiceIndexMismatchCount=catalog.filter(item=>{
  const row=explanationById.get(item.officialQuestionId);
  const accepted=Array.isArray(item.acceptedAnswers)?[...new Set(item.acceptedAnswers)].sort((a,b)=>a-b):item.answer===null?[]:[item.answer];
  if(JSON.stringify(row.acceptedChoiceIndexes)!==JSON.stringify(accepted))return true;
  if(row.choiceExplanations.some((choice,index)=>choice.isCorrect!==accepted.includes(index)))return true;
  if(accepted.length!==1||!row.correctChoice)return false;
  const indexed=row.choices[accepted[0]];
  return indexed!=='[원문 이미지 선택지 — OCR 전사 필요]'&&indexed!==row.correctChoice;
}).length;
assert.equal(explanationPayload.qa.curatedChoiceExplanationCount,102);
assert.equal(explanationPayload.qa.curatedChoiceQuestionCount,21);
assert.equal(explanationPayload.qa.sourceVerifiedChoiceExplanationCount,24);
assert.equal(explanationPayload.qa.sourceVerifiedChoiceQuestionCount,5);
assert.equal(explanationPayload.qa.editorialReviewedChoiceExplanationCount,78);
assert.equal(explanationPayload.qa.editorialReviewedChoiceQuestionCount,16);
assert.equal(explanationPayload.qa.curatedRegistryChoiceExplanationCount,158);
assert.equal(explanationPayload.qa.curatedRegistryQuestionCount,35);
assert.equal(explanationPayload.qa.skippedNonCanonicalCuratedChoiceExplanationCount,56);
assert.equal(explanationPayload.qa.skippedNonCanonicalCuratedQuestionCount,14);
assert.equal(explanationPayload.qa.curatedSourceChoiceTextCount,88);
const schoolRename=explanationById.get('official-79-advanced-40');
assert(schoolRename.explanation.includes('1941년')&&schoolRename.explanation.includes('소학교')&&schoolRename.explanation.includes('국민학교'));
assert(!schoolRename.explanation.includes('1996년')&&!schoolRename.explanation.includes("'국민학교' 명칭이 '초등학교'"));
assert.equal(schoolRename.coreVerificationStatus,'CURATED_VERIFIED');
const haedongTongbo=explanationById.get('official-69-basic-12');
assert(haedongTongbo.explanation.includes('해동통보')&&haedongTongbo.explanation.includes('고려 숙종'));
const extractionAudit=JSON.parse(fs.readFileSync('docs/official-exams/choice-extraction-audit.json','utf8'));
const computedPlaceholderEntries=explanations.map(row=>[
  row.officialQuestionId,
  row.choices.flatMap((choice,index)=>choice==='[원문 이미지 선택지 — OCR 전사 필요]'?[index+1]:[])
]).filter(([,indexes])=>indexes.length);
assert.equal(extractionAudit.placeholderChoiceCount,computedPlaceholderEntries.reduce((sum,[,indexes])=>sum+indexes.length,0));
assert.equal(extractionAudit.questionsWithPlaceholderCount,computedPlaceholderEntries.length);
assert.deepEqual(extractionAudit.placeholderChoiceIndexesByOfficialQuestionId,Object.fromEntries(computedPlaceholderEntries));
assert.deepEqual([...extractionAudit.allPlaceholderQuestionIds].sort(),computedPlaceholderEntries.filter(([id,indexes])=>indexes.length===explanationById.get(id).choiceCount).map(([id])=>id).sort());
assert.deepEqual([...extractionAudit.partialPlaceholderQuestionIds].sort(),computedPlaceholderEntries.filter(([id,indexes])=>indexes.length<explanationById.get(id).choiceCount).map(([id])=>id).sort());
assert.equal(explanationPayload.qa.choiceOrderMismatchCount,computedChoiceOrderMismatchCount);
assert.equal(explanationPayload.qa.correctChoiceIndexMismatchCount,computedCorrectChoiceIndexMismatchCount);
assert.equal(explanationPayload.qa.missingChoiceTextCount,allChoiceExplanations.filter(choice=>choice.choiceText==='[원문 이미지 선택지 — OCR 전사 필요]').length);
assert.equal(explanationPayload.qa.uncertainChoiceTextCount,allChoiceExplanations.filter(choice=>choice.choiceText!=='[원문 이미지 선택지 — OCR 전사 필요]'&&choice.choiceTextVerificationStatus==='DATA_REVIEW_REQUIRED').length);
assert.equal(explanationPayload.qa.dataReviewRequiredChoiceCount,allChoiceExplanations.filter(choice=>choice.verificationStatus==='DATA_REVIEW_REQUIRED'||choice.choiceTextVerificationStatus==='DATA_REVIEW_REQUIRED').length);
assert.equal(explanationPayload.qa.dataReviewRequiredQuestionCount,explanations.filter(row=>row.verificationStatus==='DATA_REVIEW_REQUIRED').length);
assert.equal(explanationPayload.qa.missingChoiceConfidenceCount,allChoiceExplanations.filter(choice=>choice.ocrConfidence===null).length);
assert.equal(explanationPayload.qa.missingChoiceImageHashCount,allChoiceExplanations.filter(choice=>!choice.sourceImageSha256).length);
assert.equal(explanationPayload.qa.choiceImageHashMismatchCount,explanations.reduce((sum,row)=>{
  const expected=catalog.find(item=>item.officialQuestionId===row.officialQuestionId).detailImageSha256;
  return sum+row.choiceExplanations.filter(choice=>choice.sourceImageSha256&&expected&&choice.sourceImageSha256!==expected.toLowerCase()).length;
},0));
assert.equal(explanationPayload.qa.choiceSummaryOneSentenceViolationCount,0);
assert.equal(explanationPayload.qa.choiceJudgmentSentenceOverflowCount,0);
assert.equal(explanationPayload.qa.choiceJudgmentAnswerTablePhraseCount,0);
assert.equal(explanationPayload.qa.choiceSummaryJudgmentDuplicateCount,0);
assert.equal(explanationPayload.qa.allAcceptedChoiceQuestionCount,1);
assert.equal(explanationPayload.qa.qaDeferredCount,explanationPayload.qa.dataReviewRequiredQuestionCount);
assert.equal(Object.values(explanationPayload.qa.choiceVerificationStatusCounts).reduce((sum,count)=>sum+count,0),8350);
assert.equal(explanationPayload.qa.choiceVerificationStatusCounts.CURATED_VERIFIED,curatedChoiceCount);
assert.equal(explanationPayload.qa.choiceVerificationStatusCounts.CURATED_REVIEWED,78);
assert(curatedChoiceCorrections.length>=3);
assert(curatedChoiceCount>=14);
for(const correction of curatedChoiceCorrections){
  const row=explanationById.get(correction.officialQuestionId);
  assert(row,correction.officialQuestionId+' curated choice record missing');
  assert.deepEqual(row.choiceExplanations.map(item=>item.explanation),correction.choiceExplanations,correction.officialQuestionId+' curated explanations changed');
  assert(row.choiceExplanations.every(item=>item.verificationStatus==='CURATED_VERIFIED'),correction.officialQuestionId+' curated status');
}
const allAccepted=explanationById.get('official-63-advanced-42');
assert.deepEqual(allAccepted.acceptedChoiceIndexes,[0,1,2,3,4]);
assert(allAccepted.choiceExplanations.every(item=>item.isCorrect),'official-63-advanced-42 must accept every choice');

const sharedGroups=inventory.exams.flatMap(exam=>(exam.sharedStimulusGroups||[]).map(group=>({round:exam.examRound,level:exam.examLevel,...group})));
assert.deepEqual(sharedGroups,[
  {round:57,level:'심화',start:35,end:36},
  {round:61,level:'심화',start:29,end:30},
  {round:62,level:'심화',start:49,end:50},
  {round:63,level:'심화',start:47,end:48},
  {round:66,level:'심화',start:30,end:31},
  {round:67,level:'심화',start:47,end:48},
]);
for(const group of sharedGroups)for(let number=group.start;number<=group.end;number++){
  const slug=group.level==='심화'?'advanced':'basic';
  const record=catalog.find(item=>item.officialQuestionId===`official-${group.round}-${slug}-${String(number).padStart(2,'0')}`);
  assert(record,`${group.round}/${group.level}/${number} shared record`);
  const imagePath=path.join('dist',record.detailImage);
  assert(deploymentAssets.assetExists(repoRoot,imagePath),imagePath+' shared source missing');
  assert(record.detailImageBytes>20000,imagePath+' shared source is unexpectedly small');
}

assert.equal(inventory.schemaVersion,2);
assert.deepEqual(inventory.imagePipeline,{
  revision:'official-exam-hq-v3-240dpi-q80',format:'webp',detectionDpi:120,detailDpi:240,
  detailQuality:80,thumbnailWidth:320,thumbnailQuality:68,
  detailImageCount:1800,thumbnailImageCount:1800,
  detailImageBytes:catalog.reduce((sum,item)=>sum+item.detailImageBytes,0),
  thumbnailImageBytes:catalog.reduce((sum,item)=>sum+item.thumbnailImageBytes,0),
  cropValidationPassedCount:1800,
});
for(const id of ['official-57-advanced-06','official-57-advanced-07','official-71-basic-04','official-71-basic-05']){
  const item=catalog.find(record=>record.officialQuestionId===id);
  assert(item,id);
  assert(item.cropValidation.cropHeightRatio>=.10,id+' regression crop remains truncated');
  assert(item.detailImageHeight>=300,id+' detail image remains truncated');
}

const fixedSource=catalog.find(item=>item.officialQuestionId==='official-57-basic-20');
const fixedExplanation=explanationById.get('official-57-basic-20');
assert(fixedSource&&fixedExplanation);
assert.equal(fixedSource.answer,2);assert.equal(fixedSource.answerLabel,'③');assert.equal(fixedSource.primaryEra,'goryeo');
assert.equal(fixedExplanation.question,'밑줄 그은 ‘탑’으로 옳은 것은?');
for(const phrase of ['오대산','월정사','고려 시대','팔각 구층 석탑','③'])assert(fixedExplanation.explanation.includes(phrase),phrase);
assert(!fixedExplanation.explanation.includes('밑줄 그은 ‘법’'));

const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]).filter(name=>name!=='pwa.js');
let html='',saved=null,handlers={};
const context=vm.createContext({Date,console,document:{querySelector:selector=>selector==='#app'?{set innerHTML(value){html=value}}:null,querySelectorAll:()=>[],addEventListener:(type,handler,capture)=>{(handlers[type]||=[]).push({handler,capture})},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){}});
const run=code=>vm.runInContext(code,context),copy=code=>JSON.parse(run('JSON.stringify('+code+')'));
run(scripts.map(name=>fs.readFileSync('dist/'+name,'utf8')).join('\n'));

const beforeStoryOrder=copy('Object.fromEntries(Object.entries(QUESTION_SETS).map(([id,set])=>[id,{practice:[...(set.practiceQuestionIds||[])],official:[...(set.officialQuestionIds||[])]}]))');
for(const era of ['ancient','goryeo','joseon','empire','occupation','republic'])for(const level of ['all','심화','기본']){
  const rows=copy(`globalThis.OFFICIAL_ENTRIES_FOR_ERA(${JSON.stringify(era)},${JSON.stringify(level)})`);
  for(let index=1;index<rows.length;index++){
    const previous=rows[index-1].sourceRecord,current=rows[index].sourceRecord;
    assert(previous.examRound>current.examRound||previous.examRound===current.examRound&&previous.questionNumber<=current.questionNumber,`${era}/${level} order`);
  }
}
for(const [key,items] of editionGroups){
  const [round,level]=key.split(':');
  const numbers=copy(`globalThis.OFFICIAL_ENTRIES_FOR_ROUND(${round},${JSON.stringify(level)}).map(entry=>entry.sourceRecord.questionNumber)`);
  assert.deepEqual(numbers,Array.from({length:50},(_,index)=>index+1),key+' runtime order');
}
const goryeoBefore=copy("globalThis.OFFICIAL_ENTRIES_FOR_ERA('goryeo','all').map(entry=>entry.canonicalQuestionId)");
run(`state.meta.questionRecords={};for(const [index,id] of ${JSON.stringify(goryeoBefore.slice(0,20))}.entries())state.meta.questionRecords[id]={attempts:index+1,lastCorrect:index%2===0};`);
assert.deepEqual(copy("globalThis.OFFICIAL_ENTRIES_FOR_ERA('goryeo','all').map(entry=>entry.canonicalQuestionId)"),goryeoBefore,'solved/wrong state changed order');
assert.deepEqual(copy('Object.fromEntries(Object.entries(QUESTION_SETS).map(([id,set])=>[id,{practice:[...(set.practiceQuestionIds||[])],official:[...(set.officialQuestionIds||[])]}]))'),beforeStoryOrder,'Story order changed');

for(const entry of copy('globalThis.OFFICIAL_EXAM_CATALOG')){
  const officialQuestionId=entry.sourceRecord.officialQuestionId;
  // Runtime policy intentionally gives the manual correction ledger precedence
  // over regenerated OCR explanations.  The canonical alias assertion must
  // verify that same precedence rather than treating curation as stale data.
  const expected=manuallyCuratedExplanationById.get(officialQuestionId)||explanationById.get(officialQuestionId).explanation;
  for(const alias of entry.aliases){
    const actual=run(`QUESTIONS.find(question=>question.questionId===${JSON.stringify(alias)})?.explanation`);
    assert.equal(actual,expected,alias+' does not use canonical explanation');
  }
}
const runtimeFixed=copy("globalThis.OFFICIAL_EXAM_CATALOG.find(entry=>entry.sourceRecord.officialQuestionId==='official-57-basic-20')");
assert.equal(runtimeFixed.primaryEra,'goryeo');

console.log('PASS: 1,800 canonical questions; 500 attached imports; no duplicate/missing keys; official answers, images, explanations, newest-first era order, round order, stable solved/wrong order, Story preservation, shared canonical explanations, and 57-basic-20 correction verified.');
