/* Official exam catalog, two exam modes, association memory, and canonical records. */
if(typeof EXAM_LIBRARY_ENTRIES!=='undefined'&&typeof editorialHeader==='function'&&Array.isArray(globalThis.OFFICIAL_EXAM_SOURCE_RECORDS)){
const OFFICIAL_ERA_TAXONOMY=[
 {id:'ancient',name:'선사·고대',years:'선사 — 후삼국'},
 {id:'goryeo',name:'고려',years:'918 — 1392'},
 {id:'joseon',name:'조선',years:'1392 — 1897'},
 {id:'empire',name:'개항기·대한제국',years:'1863 — 1910'},
 {id:'occupation',name:'일제강점기',years:'1910 — 1945'},
 {id:'republic',name:'대한민국',years:'1945 — 현재'}
];
globalThis.OFFICIAL_ERA_TAXONOMY=OFFICIAL_ERA_TAXONOMY;
const officialEraInfo=id=>OFFICIAL_ERA_TAXONOMY.find(item=>item.id===id)||OFFICIAL_ERA_TAXONOMY[0];
for(const era of OFFICIAL_ERA_TAXONOMY){
 const chapterId='official-'+era.id;
 if(!Object.hasOwn(CHAPTERS,chapterId))Object.defineProperty(CHAPTERS,chapterId,{value:{chapterId,eraId:era.id,number:'',title:era.name,implemented:false,sceneIds:[]},enumerable:false});
}

const legacyExamEntries=new Map(EXAM_LIBRARY_ENTRIES.map(entry=>[entry.key,entry]));
const LEGACY_MISSING_PDF_IDS=typeof V2_RESTORED_EXAM_SOURCES!=='undefined'?V2_RESTORED_EXAM_SOURCES.map(source=>source.questionId):QUESTIONS.filter(question=>question.sourceStatus==='missing_pdf'||question.sourceImageStatus==='missing_pdf'||question.missingPdf).map(question=>question.questionId);
const officialKey=record=>[record.examRound,record.examLevel,record.questionNumber].join(':');
const officialSlug=level=>level==='심화'?'advanced':'basic';
const officialChoiceLabels=['①','②','③','④','⑤'];
const OFFICIAL_EXPLANATION_BY_SOURCE_ID=new Map((globalThis.OFFICIAL_EXAM_EXPLANATION_RECORDS||[]).map(record=>[record.officialQuestionId,record]));
const officialExplanationPlaceholder=value=>{const text=String(value||'').trim();return !text||/^공식 정답은 [①②③④⑤1-5]입니다[.]$/.test(text)||text==='공식 정답표의 정정 결과 모든 선택지가 정답으로 인정됩니다.'};
const officialStoredExplanation=question=>{if(!question)return null;for(const field of ['explanation','solution','commentary','answerExplanation']){const value=question[field];if(typeof value==='string'&&!officialExplanationPlaceholder(value))return {field,value:value.trim()}}return null};
const officialExplanationStats={total:0,preexisting:0,restoredMappings:0,supplemented:0,covered:0,missing:0};
const OFFICIAL_EXAM_CATALOG=(globalThis.OFFICIAL_EXAM_SOURCE_RECORDS||[]).map(source=>{
 const key=officialKey(source),legacy=legacyExamEntries.get(key),canonicalQuestionId=legacy?.canonicalQuestionId||source.officialQuestionId;
 const aliases=[...new Set([canonicalQuestionId,...(legacy?.aliases||[])])];
 let canonical=QUESTIONS.find(question=>question.questionId===canonicalQuestionId);
 if(!canonical){
  canonical={questionId:canonicalQuestionId,chapterId:'official-'+source.primaryEra,question:`${source.examRound}회 ${source.examLevel} ${source.questionNumber}번`,sourceQuestionText:'원문 이미지에서 문제와 선택지를 확인하세요.',choices:officialChoiceLabels.slice(0,source.examLevel==='기본'?4:5),explanation:source.answer===null?'공식 정답표의 정정 결과 모든 선택지가 정답으로 인정됩니다.':`공식 정답은 ${source.answerLabel}입니다.`,examKeywords:[officialEraInfo(source.primaryEra).name],conceptIds:[source.primaryEra],difficulty:source.examLevel==='심화'?'심화':'기본',rewardKnowledge:2};
  QUESTIONS.push(canonical);
 }
 const primaryEra=legacy?.primaryEra||source.primaryEra;
 const thumbnailImage=source.thumbnailImage||legacy?.thumbnailImage||source.questionImage||legacy?.libraryImage||'';
 const detailImage=source.detailImage||legacy?.detailImage||source.questionImage||legacy?.libraryImage||thumbnailImage;
 const thumbnailImageWidth=source.thumbnailImageWidth||legacy?.thumbnailImageWidth||source.questionImageWidth||canonical.sourceImageWidth||null,thumbnailImageHeight=source.thumbnailImageHeight||legacy?.thumbnailImageHeight||source.questionImageHeight||canonical.sourceImageHeight||null;
 const detailImageWidth=source.detailImageWidth||legacy?.detailImageWidth||source.questionImageWidth||canonical.sourceImageWidth||thumbnailImageWidth,detailImageHeight=source.detailImageHeight||legacy?.detailImageHeight||source.questionImageHeight||canonical.sourceImageHeight||thumbnailImageHeight;
 const candidates=[canonical,...aliases.map(aliasId=>QUESTIONS.find(item=>item.questionId===aliasId)).filter(Boolean)];
 const canonicalStored=officialStoredExplanation(canonical),reusable=candidates.map(question=>({question,stored:officialStoredExplanation(question)})).find(item=>item.stored),generated=OFFICIAL_EXPLANATION_BY_SOURCE_ID.get(source.officialQuestionId),choiceExplanations=generated?.choiceExplanations||candidates.find(question=>Array.isArray(question.choiceExplanations)&&question.choiceExplanations.length)?.choiceExplanations,officialChoices=generated?.choices||source.choiceTexts||source.officialChoices||candidates.find(question=>Array.isArray(question.officialChoices)&&question.officialChoices.length)?.officialChoices;
 const resolved=generated?.explanation||canonicalStored?.value||reusable?.stored?.value||'';
 officialExplanationStats.total++;
 if(generated?.explanation)officialExplanationStats.supplemented++;
 else if(canonicalStored)officialExplanationStats.preexisting++;
 else if(reusable?.stored){officialExplanationStats.restoredMappings++}
 if(resolved)officialExplanationStats.covered++;else officialExplanationStats.missing++;
 for(const aliasId of aliases){
  const question=QUESTIONS.find(item=>item.questionId===aliasId);if(!question)continue;
  if(resolved)question.explanation=resolved;
  if(Array.isArray(choiceExplanations)&&choiceExplanations.length)question.choiceExplanations=[...choiceExplanations];
  if(Array.isArray(officialChoices)&&officialChoices.length)question.officialChoices=[...officialChoices];
  Object.assign(question,{officialQuestionId:canonicalQuestionId,examRound:source.examRound,examYear:source.examYear,examLevel:source.examLevel,questionNumber:source.questionNumber,answer:source.answer===null?0:source.answer,answerLabel:source.answerLabel,acceptedAnswers:source.acceptedAnswers?[...source.acceptedAnswers]:[source.answer],points:source.points,thumbnailImage,detailImage,thumbnailImageWidth,thumbnailImageHeight,detailImageWidth,detailImageHeight,questionImage:source.questionImage||detailImage,sourceQuestionImage:detailImage,sourceImageWidth:detailImageWidth,sourceImageHeight:detailImageHeight,sourceFile:source.sourcePdf,answerFile:source.answerPdf,sourcePdf:source.sourcePdf,answerPdf:source.answerPdf,sourcePage:source.sourcePage,primaryEra,concepts:[...(question.concepts||source.concepts||[])],coreVerificationStatus:generated?.coreVerificationStatus||question.coreVerificationStatus||null,isOfficial:true,sourceVerified:true,sourceStatus:'verified',sourceImageStatus:'verified',sourceImageReason:'',needsVerification:false,missingPdf:false,verificationNote:'첨부된 공식 문제지와 정답표 대조 완료'});
 }
 return {key,canonicalQuestionId,aliases,primaryEra,relatedEra:legacy?.relatedEra||[],needsVerification:false,verificationNote:'첨부된 공식 문제지와 정답표 대조 완료',thumbnailImage,detailImage,thumbnailImageWidth,thumbnailImageHeight,detailImageWidth,detailImageHeight,libraryImage:thumbnailImage||detailImage,sourceRecord:source};
});
globalThis.OFFICIAL_EXAM_CATALOG=OFFICIAL_EXAM_CATALOG;
globalThis.OFFICIAL_EXPLANATION_COVERAGE={...officialExplanationStats};
globalThis.OFFICIAL_EXAM_IMPORT_STATS={canonicalQuestionCount:OFFICIAL_EXAM_CATALOG.length,existingMatchedQuestionCount:OFFICIAL_EXAM_CATALOG.filter(entry=>legacyExamEntries.has(entry.key)).length,newQuestionCount:OFFICIAL_EXAM_CATALOG.filter(entry=>!legacyExamEntries.has(entry.key)).length,mergedLegacyAliasCount:[...legacyExamEntries.values()].reduce((sum,entry)=>sum+Math.max(0,(entry.aliases||[]).length-1),0),imageConnectedCount:OFFICIAL_EXAM_CATALOG.filter(entry=>entry.libraryImage).length,answerConnectedCount:OFFICIAL_EXAM_CATALOG.filter(entry=>entry.sourceRecord.answer!==undefined).length,classifiedCount:OFFICIAL_EXAM_CATALOG.filter(entry=>entry.primaryEra).length};
globalThis.OFFICIAL_EXAM_RECOVERY_REPORT={legacyMissingPdfIds:[...LEGACY_MISSING_PDF_IDS],recoveredMissingPdfIds:LEGACY_MISSING_PDF_IDS.filter(id=>OFFICIAL_EXAM_CATALOG.some(entry=>entry.aliases.includes(id))),round70Advanced13:OFFICIAL_EXAM_CATALOG.find(entry=>entry.key==='70:심화:13')?.sourceRecord||null};
EXAM_LIBRARY_ENTRIES.splice(0,EXAM_LIBRARY_ENTRIES.length,...OFFICIAL_EXAM_CATALOG);
const OFFICIAL_ENTRY_BY_SOURCE_ID=new Map(OFFICIAL_EXAM_CATALOG.map(entry=>[entry.sourceRecord.officialQuestionId,entry]));
const OFFICIAL_ENTRY_BY_ID=new Map();
for(const entry of OFFICIAL_EXAM_CATALOG){OFFICIAL_ENTRY_BY_ID.set(entry.canonicalQuestionId,entry);for(const alias of entry.aliases)OFFICIAL_ENTRY_BY_ID.set(alias,entry)}
for(const question of QUESTIONS){const entry=OFFICIAL_ENTRY_BY_ID.get(question.officialQuestionId)||OFFICIAL_ENTRY_BY_SOURCE_ID.get(question.officialQuestionId);if(entry)OFFICIAL_ENTRY_BY_ID.set(question.questionId,entry)}
const officialEntry=value=>typeof value==='string'?(OFFICIAL_ENTRY_BY_ID.get(value)||OFFICIAL_ENTRY_BY_SOURCE_ID.get(value)):(OFFICIAL_ENTRY_BY_ID.get(value?.questionId)||OFFICIAL_ENTRY_BY_ID.get(value?.officialQuestionId)||OFFICIAL_ENTRY_BY_SOURCE_ID.get(value?.officialQuestionId));
const officialQuestion=value=>{const entry=officialEntry(value);return entry&&QUESTIONS.find(question=>question.questionId===entry.canonicalQuestionId)};
const OFFICIAL_RUNTIME_QUESTIONS_BY_SOURCE_ID=new Map();
for(const question of QUESTIONS){const entry=OFFICIAL_ENTRY_BY_ID.get(question.questionId);if(!entry)continue;const sourceId=entry.sourceRecord.officialQuestionId;if(!OFFICIAL_RUNTIME_QUESTIONS_BY_SOURCE_ID.has(sourceId))OFFICIAL_RUNTIME_QUESTIONS_BY_SOURCE_ID.set(sourceId,[]);OFFICIAL_RUNTIME_QUESTIONS_BY_SOURCE_ID.get(sourceId).push(question)}
for(const entry of OFFICIAL_EXAM_CATALOG){for(const question of OFFICIAL_RUNTIME_QUESTIONS_BY_SOURCE_ID.get(entry.sourceRecord.officialQuestionId)||[]){Object.assign(question,{thumbnailImage:entry.thumbnailImage,detailImage:entry.detailImage,thumbnailImageWidth:entry.thumbnailImageWidth,thumbnailImageHeight:entry.thumbnailImageHeight,detailImageWidth:entry.detailImageWidth,detailImageHeight:entry.detailImageHeight,questionImage:entry.detailImage,sourceQuestionImage:entry.detailImage,sourceImageWidth:entry.detailImageWidth,sourceImageHeight:entry.detailImageHeight})}}
let officialChoicePayloadState=OFFICIAL_EXPLANATION_BY_SOURCE_ID.size===OFFICIAL_EXAM_CATALOG.length&&[...OFFICIAL_EXPLANATION_BY_SOURCE_ID.values()].every(record=>Array.isArray(record.choiceExplanations)&&record.choiceExplanations.length)?'ready':'idle',officialChoicePayloadPromise=null,officialChoicePayloadError='';
function hydrateOfficialChoiceExplanations(payload){
 const records=Array.isArray(payload?.records)?payload.records:[];
 if(Number(payload?.schemaVersion)!==3)throw new Error(`Unsupported official explanation schema: ${payload?.schemaVersion??'missing'}`);
 if(Number(payload?.canonicalChoiceCount)!==8350)throw new Error(`Expected 8350 official choices, received ${payload?.canonicalChoiceCount??'missing'}`);
 if(records.length!==OFFICIAL_EXAM_CATALOG.length)throw new Error(`Expected ${OFFICIAL_EXAM_CATALOG.length} official explanation records, received ${records.length}`);
 const byId=new Map();for(const record of records){if(byId.has(record.officialQuestionId))throw new Error(`Duplicate official explanation ID: ${record.officialQuestionId}`);byId.set(record.officialQuestionId,record)}
 for(const entry of OFFICIAL_EXAM_CATALOG){const record=byId.get(entry.sourceRecord.officialQuestionId),expected=entry.sourceRecord.examLevel==='기본'?4:5;if(!record)throw new Error(`Unknown or missing official explanation ID: ${entry.sourceRecord.officialQuestionId}`);if(record.choices?.length!==expected||record.choiceExplanations?.length!==expected)throw new Error(`Invalid choice payload: ${entry.sourceRecord.officialQuestionId}`);if(record.choiceExplanations.some((choice,index)=>choice?.choiceIndex!==index))throw new Error(`Invalid choice order: ${entry.sourceRecord.officialQuestionId}`)}
 for(const record of records){
  const entry=OFFICIAL_ENTRY_BY_SOURCE_ID.get(record.officialQuestionId);if(!entry)continue;
  OFFICIAL_EXPLANATION_BY_SOURCE_ID.set(record.officialQuestionId,record);
  for(const question of OFFICIAL_RUNTIME_QUESTIONS_BY_SOURCE_ID.get(record.officialQuestionId)||[]){
   if(record.explanation)question.explanation=record.explanation;
   question.coreVerificationStatus=record.coreVerificationStatus||null;
   if(Array.isArray(record.choices))question.officialChoices=[...record.choices];
   if(Array.isArray(record.choiceExplanations))question.choiceExplanations=record.choiceExplanations.map(item=>({...item}));
  }
 }
 officialChoicePayloadState='ready';officialChoicePayloadError='';
 return records;
}
function ensureOfficialChoiceExplanations(){
 if(officialChoicePayloadState==='ready')return Promise.resolve(true);
 if(officialChoicePayloadPromise)return officialChoicePayloadPromise;
 if(typeof fetch!=='function'){officialChoicePayloadState='error';officialChoicePayloadError='이 환경에서는 상세 선지 해설 데이터를 불러올 수 없습니다.';return Promise.resolve(false)}
 officialChoicePayloadState='loading';officialChoicePayloadError='';
 officialChoicePayloadPromise=fetch('/official-exam-explanations.json',{cache:'no-cache'}).then(response=>{if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.json()}).then(payload=>{hydrateOfficialChoiceExplanations(payload);return true}).catch(error=>{officialChoicePayloadState='error';officialChoicePayloadError=String(error?.message||error);return false}).finally(()=>{officialChoicePayloadPromise=null;if(typeof render==='function')render()});
 return officialChoicePayloadPromise;
}
globalThis.OFFICIAL_EXAM_EXPLANATION_LOADER={ensure:ensureOfficialChoiceExplanations,hydrate:hydrateOfficialChoiceExplanations,get state(){return officialChoicePayloadState},get error(){return officialChoicePayloadError}};
const officialThumbnailImage=value=>{const entry=officialEntry(value)||value;return entry?.thumbnailImage||entry?.sourceRecord?.thumbnailImage||entry?.libraryImage||entry?.sourceRecord?.questionImage||entry?.sourceQuestionImage||entry?.questionImage||officialQuestion(entry)?.thumbnailImage||officialQuestion(entry)?.questionImage||''};
const officialDetailImage=value=>{const entry=officialEntry(value)||value;return entry?.detailImage||entry?.sourceRecord?.detailImage||entry?.sourceQuestionImage||entry?.questionImage||officialQuestion(entry)?.detailImage||officialQuestion(entry)?.sourceQuestionImage||entry?.sourceRecord?.questionImage||entry?.libraryImage||officialThumbnailImage(entry)};
const officialImageDimensions=(value,kind='detail')=>{const entry=officialEntry(value)||value,question=entry?.canonicalQuestionId?officialQuestion(entry.canonicalQuestionId):officialQuestion(value),prefix=kind==='thumbnail'?'thumbnail':'detail',width=Number(entry?.[`${prefix}ImageWidth`]||entry?.sourceRecord?.[`${prefix}ImageWidth`]||entry?.sourceImageWidth||question?.[`${prefix}ImageWidth`]||question?.sourceImageWidth),height=Number(entry?.[`${prefix}ImageHeight`]||entry?.sourceRecord?.[`${prefix}ImageHeight`]||entry?.sourceImageHeight||question?.[`${prefix}ImageHeight`]||question?.sourceImageHeight);return {width:Number.isFinite(width)&&width>0?Math.round(width):null,height:Number.isFinite(height)&&height>0?Math.round(height):null}};
const officialImageDimensionAttributes=(value,kind)=>{const {width,height}=officialImageDimensions(value,kind);return `${width?` width="${width}"`:''}${height?` height="${height}"`:''}`};
globalThis.OFFICIAL_EXAM_UI={...(globalThis.OFFICIAL_EXAM_UI||{}),thumbnail:officialThumbnailImage,detail:officialDetailImage,dimensions:officialImageDimensions};
const officialAnswerAccepted=(question,answer)=>Array.isArray(question?.acceptedAnswers)?question.acceptedAnswers.includes(answer):question?.answer===answer;
const officialAnswerLabel=question=>question?.answerLabel==='없음'?'모든 선택지':officialChoiceLabels[question?.answer]||String(question?.answerLabel||'');
const officialExplanation=question=>{const stored=officialStoredExplanation(question);if(!stored)throw new Error(`Missing official explanation: ${question?.questionId||'unknown'}`);return globalThis.THREE_LEARNING_BOUNDARY?.explanation(question,stored.value,{kind:'catalog',explicitEra:officialExamTab==='era'?officialExamEra:null})??stored.value};
libraryStatus=()=> 'UNLOCKED';
libraryEligible=entry=>Boolean(entry&&!entry.needsVerification&&officialDetailImage(entry));
libraryEntries=era=>OFFICIAL_EXAM_CATALOG.filter(entry=>entry.primaryEra===era&&libraryEligible(entry));

/* Merge persistence IDs without replacing the story question used for gameplay effects. */
function mergeOfficialQuestionRecord(data,entry,runtimeQuestionId){
 const records=data.questionRecords||(data.questionRecords={}),canonicalId=entry.canonicalQuestionId;
 if(runtimeQuestionId===canonicalId)return records[canonicalId];
 const runtimeRecord=records[runtimeQuestionId];if(!runtimeRecord)return records[canonicalId];
 const current=records[canonicalId]||{attempts:0,correctCount:0,everCorrect:false},rewardedRuntimeQuestionIds=new Set(current.rewardedRuntimeQuestionIds||[]);
 if(runtimeRecord.everCorrect)rewardedRuntimeQuestionIds.add(runtimeQuestionId);
 records[canonicalId]={...current,...runtimeRecord,attempts:(current.attempts||0)+(runtimeRecord.attempts||0),correctCount:(current.correctCount||0)+(runtimeRecord.correctCount||0),everCorrect:Boolean(current.everCorrect||runtimeRecord.everCorrect)};
 if(rewardedRuntimeQuestionIds.size)records[canonicalId].rewardedRuntimeQuestionIds=[...rewardedRuntimeQuestionIds];
 delete records[runtimeQuestionId];
 return records[canonicalId];
}
function canonicalizeOfficialMetaIds(data){
 const canonicalId=id=>officialEntry(id)?.canonicalQuestionId||id;
 data.wrongQuestionIds=[...new Set((data.wrongQuestionIds||[]).map(canonicalId))];
 data.reviewedQuestionIds=[...new Set((data.reviewedQuestionIds||[]).map(canonicalId))];
 const wrongAnswers=new Map();
 for(const item of data.wrongAnswers||[]){
  const mappedQuestionId=canonicalId(item.questionId),runtimeQuestionId=item.runtimeQuestionId||item.questionId,mapped={...item,questionId:mappedQuestionId},previous=wrongAnswers.get(mapped.questionId),previousTime=Date.parse(previous?.answeredAt||''),mappedTime=Date.parse(mapped.answeredAt||'');
  if(runtimeQuestionId&&runtimeQuestionId!==mappedQuestionId)mapped.runtimeQuestionId=runtimeQuestionId;
  if(!previous||!Number.isFinite(previousTime)||(Number.isFinite(mappedTime)&&mappedTime>=previousTime))wrongAnswers.set(mapped.questionId,mapped);
 }
 data.wrongAnswers=[...wrongAnswers.values()];
 data.learningEvents=(data.learningEvents||[]).map(item=>({...item,questionId:canonicalId(item.questionId)}));
 data.officialExamResults=(data.officialExamResults||[]).map(result=>({...result,questionIds:(result.questionIds||[]).map(canonicalId),answers:Object.fromEntries(Object.entries(result.answers||{}).map(([id,answer])=>[canonicalId(id),answer])),graded:Object.fromEntries(Object.entries(result.graded||{}).map(([id,right])=>[canonicalId(id),right])),questionResults:(result.questionResults||[]).map(item=>({...item,questionId:canonicalId(item.questionId)}))}));
 for(const mistake of Object.values(data.conceptMistakes||{})){
  if(Array.isArray(mistake.questionIds))mistake.questionIds=[...new Set(mistake.questionIds.map(canonicalId))];
  if(mistake.lastQuestionId)mistake.lastQuestionId=canonicalId(mistake.lastQuestionId);
 }
}
/* Merge legacy duplicate IDs once, then make all future persistence use one canonical ID. */
for(const entry of OFFICIAL_EXAM_CATALOG){
 const records=(OFFICIAL_RUNTIME_QUESTIONS_BY_SOURCE_ID.get(entry.sourceRecord.officialQuestionId)||[]).map(question=>question.questionId).filter((id,index,items)=>id!==entry.canonicalQuestionId&&items.indexOf(id)===index).map(id=>[id,meta().questionRecords[id]]).filter(([,record])=>record);
 for(const [alias] of records)mergeOfficialQuestionRecord(meta(),entry,alias);
}
canonicalizeOfficialMetaIds(meta());

const recordQuestionBeforeOfficialCatalog=recordQuestion;
recordQuestion=function(currentState,questionId,userAnswer){
 const entry=officialEntry(questionId);if(!entry)return recordQuestionBeforeOfficialCatalog(currentState,questionId,userAnswer);
 const canonicalQuestion=officialQuestion(entry.canonicalQuestionId),runtimeQuestion=QUESTIONS.find(question=>question.questionId===questionId)||canonicalQuestion;if(!canonicalQuestion||!runtimeQuestion)return false;
 const records=currentState.meta.questionRecords||(currentState.meta.questionRecords={}),right=officialAnswerAccepted(canonicalQuestion,userAnswer),originalAnswer=runtimeQuestion.answer,canonicalRecord=records[entry.canonicalQuestionId];
 if(questionId!==entry.canonicalQuestionId&&!records[questionId]&&canonicalRecord?.rewardedRuntimeQuestionIds?.includes(questionId))records[questionId]={attempts:0,correctCount:0,everCorrect:true};
 runtimeQuestion.answer=right?userAnswer:originalAnswer;
 try{recordQuestionBeforeOfficialCatalog(currentState,runtimeQuestion.questionId,userAnswer)}finally{runtimeQuestion.answer=originalAnswer}
 if(questionId!==runtimeQuestion.questionId&&currentState.run?.questionResults)currentState.run.questionResults[questionId]=right;
 mergeOfficialQuestionRecord(currentState.meta,entry,runtimeQuestion.questionId);
 canonicalizeOfficialMetaIds(currentState.meta);
 const canonicalId=entry.canonicalQuestionId;
 if(right){if(currentState.meta.wrongQuestionIds.includes(canonicalId)&&!currentState.meta.reviewedQuestionIds.includes(canonicalId))currentState.meta.reviewedQuestionIds.push(canonicalId)}
 else{if(!currentState.meta.wrongQuestionIds.includes(canonicalId))currentState.meta.wrongQuestionIds.push(canonicalId);currentState.meta.reviewedQuestionIds=currentState.meta.reviewedQuestionIds.filter(id=>id!==canonicalId)}
 const record=currentState.meta.questionRecords[canonicalId];if(record){record.solved=true;record.selectedAnswer=userAnswer;record.lastAttempt=new Date().toISOString()}
 return right;
};

const officialProgress=entries=>{const attempted=entries.filter(entry=>(meta().questionRecords[entry.canonicalQuestionId]?.attempts||0)>0).length;return {attempted,total:entries.length,percent:entries.length?Math.round(attempted/entries.length*100):0}};
const officialEntryOrder=(a,b)=>b.sourceRecord.examRound-a.sourceRecord.examRound||a.sourceRecord.questionNumber-b.sourceRecord.questionNumber||(a.sourceRecord.examLevel==='심화'?-1:1);
const officialEntriesForEra=(era,level='all')=>OFFICIAL_EXAM_CATALOG.filter(entry=>entry.primaryEra===era&&(level==='all'||entry.sourceRecord.examLevel===level)).sort(officialEntryOrder);
const officialEntriesForRound=(round,level='all')=>OFFICIAL_EXAM_CATALOG.filter(entry=>entry.sourceRecord.examRound===Number(round)&&(level==='all'||entry.sourceRecord.examLevel===level)).sort((a,b)=>a.sourceRecord.questionNumber-b.sourceRecord.questionNumber);
globalThis.OFFICIAL_ENTRIES_FOR_ERA=officialEntriesForEra;
globalThis.OFFICIAL_ENTRIES_FOR_ROUND=officialEntriesForRound;
const officialRounds=()=>[...new Set(OFFICIAL_EXAM_CATALOG.map(entry=>entry.sourceRecord.examRound))].sort((a,b)=>b-a);
const OFFICIAL_ROUND_LEVELS=['기본','심화'].filter(level=>OFFICIAL_EXAM_CATALOG.some(entry=>entry.sourceRecord.examLevel===level));
const officialEditions=(level='all')=>{const groups=new Map();for(const entry of OFFICIAL_EXAM_CATALOG){if(level!=='all'&&entry.sourceRecord.examLevel!==level)continue;const key=entry.sourceRecord.examRound+':'+entry.sourceRecord.examLevel;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(entry)}return [...groups.values()].sort((a,b)=>b[0].sourceRecord.examRound-a[0].sourceRecord.examRound||(a[0].sourceRecord.examLevel==='심화'?-1:1))};
const examSourceLabel=entry=>`${entry.sourceRecord.examRound}회 ${entry.sourceRecord.examLevel} · ${entry.sourceRecord.questionNumber}번`;
const officialStatisticForEdition=(round,level)=>{const record=globalThis.OFFICIAL_EXAM_STATISTICS?.byEdition?.[`${Number(round)}-${officialSlug(level)}`],verified=String(record?.verificationStatus||'').startsWith('OFFICIAL_VERIFIED');return verified&&Number.isFinite(Number(record.passRate))?record:null};
function officialPassRateDisplay(record){
 const raw=String(record?.passRateRaw??record?.passRate??'').trim(),match=/^(\d+)(?:[.](\d+))?$/.exec(raw);
 if(match){const fraction=match[2]||'',tenths=Number(match[1])*10+Number(fraction[0]||0)+(Number(fraction[1]||0)>=5?1:0);return (tenths/10).toFixed(1)}
 return (Math.round(Number(record?.passRate)*10)/10).toFixed(1);
}
function officialStatisticMarkup(source,context='detail'){
 const record=officialStatisticForEdition(source?.examRound,source?.examLevel);
 const key=`${Number(source?.examRound)}-${officialSlug(source?.examLevel)}`,unavailable=(globalThis.OFFICIAL_EXAM_STATISTICS?.unavailableEditions||[]).find(item=>item.key===key||(Number(item.examRound)===Number(source?.examRound)&&item.examLevel===source?.examLevel));
 if(context==='card')return record?`<span class="official-pass-rate-badge" data-official-pass-rate="${esc(record.key||key)}">합격률 ${esc(officialPassRateDisplay(record))}%</span>`:'';
 if(!record&&unavailable)return `<section class="official-pass-rate unavailable ${context}" aria-label="공식 합격률 정보 없음"><strong>공식 합격률 정보 없음</strong>${unavailable.reason?`<span>${esc(unavailable.reason)}</span>`:''}</section>`;
 if(!record)return `<section class="official-pass-rate pending ${context}" aria-label="공식 합격률 확인 중"><strong>공식 합격률 확인 중</strong><span>공식 발표 자료가 확인된 회차만 수치를 제공합니다.</span></section>`;
 const rate=officialPassRateDisplay(record),announced=record.announcedAt?`발표일 ${esc(record.announcedAt)}`:'',sourceLabel=record.sourceLabel||globalThis.OFFICIAL_EXAM_STATISTICS?.sourceLabel||'공식 발표 자료',sourceUrl=/^https?:\/\//.test(String(record.sourceUrl||''))?record.sourceUrl:'';
 return `<section class="official-pass-rate verified ${context}" data-official-pass-rate="${esc(record.key||`${source.examRound}-${officialSlug(source.examLevel)}`)}"><div><small>공식 합격률</small><strong>${esc(rate)}%</strong></div><div class="official-pass-rate-source">${announced?`<span>${announced}</span>`:''}${sourceUrl?`<a href="${esc(sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(sourceLabel)} 출처 ↗</a>`:`<span>${esc(sourceLabel)}</span>`}</div></section>`;
}
globalThis.OFFICIAL_STATISTIC_FOR_EDITION=officialStatisticForEdition;

let officialExamTab='era',officialExamView='home',officialExamEra='ancient',officialExamRound=officialRounds()[0]||79,officialExamLevel='all',officialExamSession=null,officialSuspendedSession=null,officialResultReturnView='list',officialAttemptSequence=0;
const OFFICIAL_EXAM_DURATION_MS=80*60*1000;
const OFFICIAL_TIMER_STATES={READY:'READY',RUNNING:'RUNNING',PAUSED:'PAUSED'};
let officialTimerInterval=null,officialSubmitting=false;
globalThis.OFFICIAL_EXAM_DURATION_MS=OFFICIAL_EXAM_DURATION_MS;
const officialTimedSession=(session=officialExamSession)=>Boolean(session?.timed&&session.mode==='exam');
const officialTimerState=(session=officialExamSession)=>officialTimedSession(session)?session.timerState||OFFICIAL_TIMER_STATES.RUNNING:null;
const officialRemainingMs=(session=officialExamSession,now=Date.now())=>{if(!officialTimedSession(session))return 0;return officialTimerState(session)===OFFICIAL_TIMER_STATES.RUNNING?Math.max(0,Number(session.endTimeMs)-now):Math.max(0,Number(session.remainingMs)||0)};
const officialFormatDuration=milliseconds=>{const seconds=Math.max(0,Math.ceil(milliseconds/1000)),hours=Math.floor(seconds/3600),minutes=Math.floor(seconds%3600/60),rest=seconds%60;return [hours,minutes,rest].map(value=>String(value).padStart(2,'0')).join(':')};
const officialTimerTone=milliseconds=>milliseconds<=5*60*1000?'critical':milliseconds<=10*60*1000?'warning':'normal';
function officialResultEdition(result){
 if(result?.examRound&&result?.examLevel)return {examRound:Number(result.examRound),examLevel:result.examLevel};
 const entries=(result?.questionIds||[]).map(id=>officialEntry(id)).filter(Boolean),rounds=new Set(entries.map(entry=>entry.sourceRecord.examRound)),levels=new Set(entries.map(entry=>entry.sourceRecord.examLevel));
 return entries.length&&rounds.size===1&&levels.size===1?{examRound:entries[0].sourceRecord.examRound,examLevel:entries[0].sourceRecord.examLevel}:null;
}
const officialAttemptId=()=>`official-${Date.now().toString(36)}-${(++officialAttemptSequence).toString(36)}-${Math.random().toString(36).slice(2,8)}`;
function normalizeOfficialExamResults(){
 const results=meta().officialExamResults||(meta().officialExamResults=[]);
 results.forEach((result,index)=>{result.attemptId||=`legacy-${index}-${String(result.completedAt||'unknown').replace(/[^0-9A-Za-z]/g,'').slice(0,20)}`;result.questionIds=(result.questionIds||[]).map(id=>officialEntry(id)?.canonicalQuestionId||id)});
 return results;
}
const officialExamResults=()=>normalizeOfficialExamResults().filter(result=>result.mode==='exam').sort((a,b)=>Date.parse(b.completedAt||0)-Date.parse(a.completedAt||0));
const officialResultById=id=>normalizeOfficialExamResults().find(result=>result.attemptId===id)||null;
const officialResultForEdition=(round,level)=>officialExamResults().filter(result=>{const edition=officialResultEdition(result);return edition?.examRound===Number(round)&&edition?.examLevel===level});
function officialResultSnapshot(session,entry,answer,right){
 const question=officialQuestion(entry.canonicalQuestionId),acceptedAnswers=Array.isArray(question?.acceptedAnswers)?[...question.acceptedAnswers]:Number.isInteger(question?.answer)?[question.answer]:[];
 return {questionId:entry.canonicalQuestionId,officialQuestionId:entry.sourceRecord.officialQuestionId,sourceLabel:examSourceLabel(entry),examRound:entry.sourceRecord.examRound,examLevel:entry.sourceRecord.examLevel,questionNumber:entry.sourceRecord.questionNumber,selectedAnswer:Number.isInteger(answer)?answer:null,unanswered:!Number.isInteger(answer),right:Boolean(right),acceptedAnswers,answerLabel:question?.answerLabel==='없음'?'모든 선택지':acceptedAnswers.map(index=>officialChoiceLabels[index]).filter(Boolean).join(', ')||null,points:Number(entry.sourceRecord.points)||0,earnedPoints:right?(Number(entry.sourceRecord.points)||0):0};
}
function officialStoredQuestionResult(session,questionId){return session?.resultRecord?.questionResults?.find(item=>item.questionId===questionId)||null}
function officialResultSummary(result,entries=[],graded={},sessionAnswers={}){
 if(result?.summary)return result.summary;
 const known=entries.filter(entry=>Object.hasOwn(graded,entry.canonicalQuestionId)),correct=known.filter(entry=>graded[entry.canonicalQuestionId]===true).length,answerSource=result?.answers||sessionAnswers,answeredIds=new Set(Object.entries(answerSource||{}).filter(([,answer])=>Number.isInteger(answer)).map(([id])=>id)),answered=answeredIds.size,wrong=known.filter(entry=>answeredIds.has(entry.canonicalQuestionId)&&graded[entry.canonicalQuestionId]===false).length;
 const liveScore=result?null:known.reduce((sum,entry)=>sum+(graded[entry.canonicalQuestionId]?Number(entry.sourceRecord.points)||0:0),0),liveMax=result?null:entries.reduce((sum,entry)=>sum+(Number(entry.sourceRecord.points)||0),0);
 return {total:(result?.questionIds||entries).length,correct,wrong,unanswered:Math.max(0,(result?.questionIds||entries).length-answered),answered,score:liveScore,maxScore:liveMax};
}
function officialEditionExamState(entries){
 const source=entries[0]?.sourceRecord;if(!source)return '미응시';
 const active=meta().officialExamActiveSession;if(active?.examRound===source.examRound&&active?.examLevel===source.examLevel)return '응시 중';
 return (meta().officialExamResults||[]).some(result=>{const edition=officialResultEdition(result);return result.mode==='exam'&&edition?.examRound===source.examRound&&edition?.examLevel===source.examLevel})?'응시 완료':'미응시';
}
function officialTimerMarkup(session){if(!officialTimedSession(session))return '';const remaining=officialRemainingMs(session),timerState=officialTimerState(session),status=timerState===OFFICIAL_TIMER_STATES.READY?'시작 전':timerState===OFFICIAL_TIMER_STATES.PAUSED?'일시정지':'진행 중';return `<section class="official-exam-timer-panel"><div class="official-exam-timer ${officialTimerTone(remaining)}" data-official-timer role="timer"><span>남은 시간</span><b data-official-timer-value>${officialFormatDuration(remaining)}</b><em>${status}</em></div><div class="official-timer-controls" aria-label="시험 타이머 조작"><button class="primary" data-official-timer-start="true" ${timerState===OFFICIAL_TIMER_STATES.RUNNING?'disabled':''}>시작</button><button class="secondary" data-official-timer-pause="true" ${timerState!==OFFICIAL_TIMER_STATES.RUNNING?'disabled':''}>일시정지</button><button class="secondary" data-official-timer-restart="true">재시작</button></div></section>`}
function stopOfficialTimer(){if(officialTimerInterval!==null&&typeof clearInterval==='function')clearInterval(officialTimerInterval);officialTimerInterval=null}
function serializedOfficialSession(session){return {version:3,attemptId:session.attemptId,mode:session.mode,timed:Boolean(session.timed),examTab:session.examTab,examEra:session.examEra,examRound:session.examRound,examLevel:session.examLevel,questionIds:session.entries.map(entry=>entry.canonicalQuestionId),index:session.index,answers:{...session.answers},startedAtMs:session.startedAtMs,endTimeMs:session.endTimeMs,durationMs:session.durationMs,timerState:officialTimerState(session),remainingMs:officialTimedSession(session)?officialRemainingMs(session):null,passedQuestionIds:[...(session.passedQuestionIds||[])],initialPassComplete:Boolean(session.initialPassComplete)}}
globalThis.OFFICIAL_EXAM_TIMER={durationMs:OFFICIAL_EXAM_DURATION_MS,remainingMs:()=>officialRemainingMs(),tick:()=>officialTimerTick(),snapshot:()=>officialExamSession?{...serializedOfficialSession(officialExamSession),graded:officialExamSession.graded?{...officialExamSession.graded}:null,submissionReason:officialExamSession.submissionReason,running:officialTimerInterval!==null}:null,editionState:(round,level)=>officialEditionExamState(officialEntriesForRound(round,level))};
function persistOfficialSession(){if(officialExamSession?.mode!=='exam'||officialExamSession.graded)return;meta().officialExamActiveSession=serializedOfficialSession(officialExamSession);save()}
function clearOfficialStoredSession(){delete meta().officialExamActiveSession}
function officialTimerTick(){
 if(!officialTimedSession()||officialExamSession.graded||officialTimerState()!==OFFICIAL_TIMER_STATES.RUNNING){stopOfficialTimer();return}
 const remaining=officialRemainingMs(),timer=document.querySelector('[data-official-timer]'),value=timer?.querySelector?.('[data-official-timer-value]');
 if(value)value.textContent=officialFormatDuration(remaining);
 if(timer?.classList){timer.classList.remove('normal','warning','critical');timer.classList.add(officialTimerTone(remaining))}
 if(remaining<=0)gradeOfficialSession('TIME_EXPIRED');
}
function startOfficialTimer(){stopOfficialTimer();if(!officialTimedSession()||officialTimerState()!==OFFICIAL_TIMER_STATES.RUNNING)return;if(typeof setInterval==='function')officialTimerInterval=setInterval(officialTimerTick,1000);officialTimerTick()}
function beginOrResumeOfficialTimer(){if(!officialTimedSession()||officialExamSession.graded||officialTimerState()===OFFICIAL_TIMER_STATES.RUNNING)return;const remaining=officialRemainingMs();if(remaining<=0){gradeOfficialSession('TIME_EXPIRED');return}officialExamSession.startedAtMs??=Date.now();officialExamSession.timerState=OFFICIAL_TIMER_STATES.RUNNING;officialExamSession.remainingMs=remaining;officialExamSession.endTimeMs=Date.now()+remaining;persistOfficialSession();startOfficialTimer();render()}
function pauseOfficialTimer(){if(!officialTimedSession()||officialTimerState()!==OFFICIAL_TIMER_STATES.RUNNING)return;const remaining=officialRemainingMs();if(remaining<=0){gradeOfficialSession('TIME_EXPIRED');return}officialExamSession.remainingMs=remaining;officialExamSession.endTimeMs=null;officialExamSession.timerState=OFFICIAL_TIMER_STATES.PAUSED;stopOfficialTimer();persistOfficialSession();modal=null;render()}
function resetOfficialAttempt(){if(!officialTimedSession())return;stopOfficialTimer();officialExamSession.index=0;officialExamSession.answers={};officialExamSession.feedback={};officialExamSession.passedQuestionIds=[];officialExamSession.initialPassComplete=false;officialExamSession.startedAtMs=null;officialExamSession.endTimeMs=null;officialExamSession.remainingMs=OFFICIAL_EXAM_DURATION_MS;officialExamSession.timerState=OFFICIAL_TIMER_STATES.READY;officialExamSession.submissionReason=null;modal=null;persistOfficialSession();render();window.scrollTo(0,0)}
function officialExamInteractionAvailable(){if(!officialTimedSession())return true;if(officialTimerState()!==OFFICIAL_TIMER_STATES.RUNNING)return false;if(officialRemainingMs()>0)return true;gradeOfficialSession('TIME_EXPIRED');return false}
function officialAnsweredIds(session=officialExamSession){return new Set(session?.entries.filter(entry=>Number.isInteger(session.answers[entry.canonicalQuestionId])).map(entry=>entry.canonicalQuestionId)||[])}
function officialPassedIds(session=officialExamSession){const answered=officialAnsweredIds(session),valid=new Set(session?.entries.map(entry=>entry.canonicalQuestionId)||[]);return (session?.passedQuestionIds||[]).filter((id,index,items)=>valid.has(id)&&!answered.has(id)&&items.indexOf(id)===index)}
function officialUnansweredIds(session=officialExamSession){if(!session)return [];const answered=officialAnsweredIds(session),passed=officialPassedIds(session),passedSet=new Set(passed);return [...passed,...session.entries.map(entry=>entry.canonicalQuestionId).filter(id=>!answered.has(id)&&!passedSet.has(id))]}
function officialSetCurrentQuestion(questionId){const index=officialExamSession?.entries.findIndex(entry=>entry.canonicalQuestionId===questionId);if(index>=0){officialExamSession.index=index;persistOfficialSession();render();window.scrollTo(0,0)}}
function officialPreviousQuestion(){const session=officialExamSession;if(!session||session.index<=0||session.mode==='exam'&&!officialExamInteractionAvailable())return;session.index--;persistOfficialSession();render();window.scrollTo(0,0)}
function officialAdvanceQuestion({pass=false}={}){const session=officialExamSession,entry=officialSessionQuestion();if(!session||!entry||!officialExamInteractionAvailable())return;const id=entry.canonicalQuestionId,picked=session.answers[id];if(pass&&!Number.isInteger(picked))session.passedQuestionIds=[...officialPassedIds(session).filter(item=>item!==id),id];else if(!pass&&!Number.isInteger(picked))return;if(!session.initialPassComplete&&session.index<session.entries.length-1){session.index++;persistOfficialSession();render();window.scrollTo(0,0);return}session.initialPassComplete=true;const unanswered=officialUnansweredIds(session);if(unanswered.length){officialSetCurrentQuestion(unanswered[0]);return}persistOfficialSession();render()}
function requestOfficialSubmission(){if(officialExamSession?.mode!=='exam'||!officialExamInteractionAvailable())return;const unanswered=officialUnansweredIds();modal={type:'official-submit-confirm',unansweredCount:unanswered.length,continueToUnanswered:unanswered.length>0};render()}
function officialExamHome(){
 const tab='<div class="official-tabs" role="tablist">'+[['era','시대별'],['round','회차별']].map(([id,label])=>`<button data-official-tab="${id}" aria-selected="${officialExamTab===id}">${label}</button>`).join('')+'</div>';
 const roundLevels=officialExamTab==='round'?`<div class="official-round-levels" role="tablist" aria-label="회차별 시험 유형">${OFFICIAL_ROUND_LEVELS.map(level=>`<button data-official-round-level="${level}" aria-selected="${officialExamLevel===level}">${level}</button>`).join('')}</div>`:'';
 const cards=officialExamTab==='era'?OFFICIAL_ERA_TAXONOMY.map(era=>{const entries=officialEntriesForEra(era.id),progress=officialProgress(entries);return `<button class="official-card" data-official-era="${era.id}"><span class="open-pill">OPEN</span><h2>${era.name}</h2><p>${era.years}</p><small>실제 기출 ${entries.length}문항</small><div class="official-card-progress"><i style="width:${progress.percent}%"></i></div><b>${progress.attempted} / ${progress.total} · ${progress.percent}%</b></button>`}).join(''):officialEditions(officialExamLevel).map(entries=>{const source=entries[0].sourceRecord,progress=officialProgress(entries),examState=officialEditionExamState(entries);return `<article class="official-card round"><button class="official-card-open" data-official-round="${source.examRound}" data-official-edition-level="${source.examLevel}">${officialStatisticMarkup(source,'card')}<h2>제${source.examRound}회 · ${source.examLevel}</h2><p>${source.examYear}</p><small>실제 기출 ${entries.length}문항</small><div class="official-personal-progress"><small>나의 진행</small><div class="official-card-progress"><i style="width:${progress.percent}%"></i></div><b>진행 ${progress.attempted} / ${progress.total} · ${progress.percent}% · 시험 ${examState}</b></div></button></article>`}).join('');
 return `<section class="official-exams">${editorialHeader('기출문제','공식 문제지 그대로, 잠금 없이 학습')}<div class="official-history-entry"><button class="secondary" data-official-results-list="true">시험 기록 · 결과지 다시 보기</button></div>${tab}${roundLevels}<div class="official-notice">등록이 완료된 공식 기출은 모두 바로 풀 수 있습니다. 스토리 진행도와 기출 이용 여부는 분리되어 있습니다.</div><div class="official-grid">${cards}</div></section>`;
}
function officialSelectionEntries(){return officialExamTab==='era'?officialEntriesForEra(officialExamEra,officialExamLevel):officialEntriesForRound(officialExamRound,officialExamLevel)}
function officialExamListPage(){
 const entries=officialSelectionEntries(),title=officialExamTab==='era'?officialEraInfo(officialExamEra).name:`제${officialExamRound}회 · ${officialExamLevel}`,progress=officialProgress(entries);
 const filters=officialExamTab==='era'?`<div class="library-filters">${[['all','전체'],['심화','심화'],['기본','기본']].map(([id,label])=>`<button data-official-level="${id}" aria-pressed="${officialExamLevel===id}">${label}</button>`).join('')}</div>`:`<div class="library-filters"><button aria-pressed="true">${officialExamLevel}</button></div>`;
 const statistic=officialExamTab==='round'&&entries.length?officialStatisticMarkup(entries[0].sourceRecord,'detail'):'';
 const editionResults=officialExamTab==='round'?officialResultForEdition(officialExamRound,officialExamLevel):[],latest=editionResults[0];
 return `<section class="official-exams"><header class="official-subhead"><button data-official-back="home" aria-label="기출 메인으로">‹</button><div><small>${officialExamTab==='era'?'시대별 기출':'회차별 기출'}</small><h1>${title}</h1></div></header><div class="library-summary" aria-label="나의 기출 진행률"><div><small>전체</small><b>${progress.total}</b></div><div><small>푼 문제</small><b>${progress.attempted}</b></div><div><small>나의 진행률</small><b>${progress.percent}%</b></div></div>${statistic}${filters}<div class="official-mode-actions"><button class="primary" data-official-start="learn" ${entries.length?'':'disabled'}>학습하며 풀기</button><button class="secondary" data-official-start="exam" ${entries.length?'':'disabled'}>시험처럼 풀기</button></div>${latest?`<div class="official-previous-results"><button class="secondary" data-official-result-open="${esc(latest.attemptId)}">최근 결과 보기</button><button class="text-btn" data-official-results-list="true">이전 결과 ${editionResults.length}건</button></div>`:''}<p class="mode-description">학습 모드는 답을 고른 뒤 정답 확인 버튼을 누르면 정답과 해설을 표시합니다. 시험 모드는 ${officialExamTab==='round'?'회차 전체':'최근 문항 최대 20개'}를 모두 푼 뒤 채점합니다.</p><div class="official-question-list">${entries.map(entry=>{const record=meta().questionRecords[entry.canonicalQuestionId];return `<button data-official-study-from="${entry.canonicalQuestionId}"><img src="${esc(officialThumbnailImage(entry))}"${officialImageDimensionAttributes(entry,'thumbnail')} loading="lazy" decoding="async" alt="${examSourceLabel(entry)} 원문"><span><small>${examSourceLabel(entry)}</small><b>${officialEraInfo(entry.primaryEra).name}</b><em class="${record?.lastCorrect?'right':record?'wrong':''}">${record?(record.lastCorrect?'최근 정답':'최근 오답'):'미풀이'}</em></span><span>›</span></button>`}).join('')}</div></section>`;
}
function officialSessionQuestion(){return officialExamSession?.entries[officialExamSession.index]}
function recordOfficialAttempt(questionId,answer){
 const savedRun=JSON.parse(JSON.stringify(state.run)),savedMain=state.mainRun?JSON.parse(JSON.stringify(state.mainRun)):state.mainRun;let right=false;
 try{right=recordQuestion(state,questionId,answer)}finally{state.run=savedRun;state.mainRun=savedMain}
 globalThis.THREE_LEARNING_BOUNDARY?.recordOfficialAttempt(officialEntry(questionId)?.sourceRecord?.officialQuestionId,answer);
 return right;
}
function officialImageOpenMarkup(value,{className='official-paper-open',alt='',loading='eager',priority='high'}={}){
 const entry=officialEntry(value)||value,image=officialDetailImage(entry);if(!entry?.canonicalQuestionId||!image)return '';
 const label=examSourceLabel(entry),load=loading==='lazy'?'lazy':'eager',fetchPriority=priority==='high'?' fetchpriority="high"':'';
 return `<button type="button" class="${esc(className)}" data-official-image-open="${entry.canonicalQuestionId}" aria-label="${esc(label)} 상세 이미지 전체화면으로 보기"><img src="${esc(image)}"${officialImageDimensionAttributes(entry,'detail')} loading="${load}" decoding="async"${fetchPriority} alt="${esc(alt||`${label} 실제 문제`)}"></button>`;
}
function officialPaperFigure(entry){
 return `<figure class="official-paper">${officialImageOpenMarkup(entry)}<figcaption>${esc(entry.sourceRecord.sourcePdf)} · ${entry.sourceRecord.sourcePage}쪽 · 이미지를 누르면 확대합니다.</figcaption></figure>`;
}
function officialChoiceExplanationBlock(question,selectedAnswer){
 const inlineSupplement=Boolean(question?.isOfficial&&question?.sourceVerified&&!officialEntry(question)&&Array.isArray(question.choiceExplanations)&&question.choiceExplanations.length);
 if(officialChoicePayloadState!=='ready'&&!inlineSupplement){
  if(officialChoicePayloadState==='idle')ensureOfficialChoiceExplanations();
  return officialChoicePayloadState==='error'?`<section class="official-choice-load error" role="alert"><b>선지별 상세 해설을 불러오지 못했습니다.</b><span>${esc(officialChoicePayloadError||'네트워크 상태를 확인해 주세요.')}</span><button class="text-btn" data-official-explanations-retry="true">다시 불러오기</button></section>`:'<section class="official-choice-load" role="status" aria-live="polite"><b>선지별 상세 해설을 불러오는 중입니다.</b><span>문제 원문과 연결된 전체 선지를 준비하고 있습니다.</span></section>';
 }
 const explanations=question?.choiceExplanations;
 if(!Array.isArray(explanations)||!explanations.length)return '<section class="official-choice-load error" role="alert"><b>이 문항의 선지별 상세 해설을 연결하지 못했습니다.</b><span>문항 ID와 해설 데이터 연결을 다시 확인해 주세요.</span></section>';
 const count=Math.max(explanations.length,question.officialChoices?.length||0,question.choices?.length||0,question.examLevel==='기본'?4:5),selected=Number.isInteger(selectedAnswer)?selectedAnswer:null;
 const choices=Array.from({length:count},(_,index)=>{
  const item=explanations[index],structured=typeof item==='object'&&item!==null,text=typeof item==='string'?item:item?.explanation||item?.text||'선지 해설을 확인 중입니다.',choiceText=structured&&item.choiceText?item.choiceText:question.officialChoices?.[index]||question.choices?.[index],verification=structured&&item.verificationStatus,textVerified=structured&&item.choiceTextVerificationStatus==='VISUALLY_REVIEWED',textReview=structured&&item.choiceTextVerificationStatus==='DATA_REVIEW_REQUIRED',hashMismatch=structured&&item.sourceImageHashVerified===false,hasStructuredDetails=Boolean(structured&&(item.meaning||item.judgmentReason||item.correctedFact));
  const verificationBadge=verification==='CURATED_VERIFIED'?'<span class="official-choice-badge verified">출처 근거 검수 완료</span>':verification==='CURATED_REVIEWED'?'<span class="official-choice-badge reviewed">수기 해설 검토</span>':verification==='KNOWLEDGE_RULE'?'<span class="official-choice-badge rule">역사 규칙 대조</span>':verification==='DATA_REVIEW_REQUIRED'?'<span class="official-choice-badge review">해설 추가 검수 필요</span>':'';
  const sourceBadges=`${textVerified?'<span class="official-choice-badge source-verified">선지 원문 육안 대조</span>':''}${textReview?'<span class="official-choice-badge review">선지 원문 추가 검수 필요</span>':''}${hashMismatch?'<span class="official-choice-badge review">원본 연결 재확인 필요</span>':''}`;
  const badges=`${officialAnswerAccepted(question,index)?'<span class="official-choice-badge answer">정답</span>':''}${selected===index?'<span class="official-choice-badge selected">내 선택</span>':''}${verificationBadge}${sourceBadges}`,needsReview=verification==='DATA_REVIEW_REQUIRED'||textReview||hashMismatch;
  return `<li class="${officialAnswerAccepted(question,index)?'answer ':''}${selected===index?'selected':''}${needsReview?' review':''}"><div class="official-choice-heading"><b>${officialChoiceLabels[index]||index+1}</b>${choiceText?`<span class="official-choice-text">${esc(choiceText)}</span>`:''}<span class="official-choice-badges">${badges}</span></div>${structured&&item.meaning?`<p class="official-choice-meaning"><small>핵심 요약</small><span>${esc(item.meaning)}</span></p>`:''}${structured&&item.judgmentReason?`<p class="official-choice-judgment"><small>판단 이유</small><span>${esc(item.judgmentReason)}</span></p>`:''}${structured&&item.correctedFact?`<p class="official-choice-correction"><small>바로잡기</small><span>${esc(item.correctedFact)}</span></p>`:''}${hasStructuredDetails?'':`<p class="official-choice-reason"><small>해설</small><span>${esc(text)}</span></p>`}</li>`;
 }).join('');
 return `<section class="official-choice-explanations" aria-label="선지별 해설"><h3>[선지별 해설]</h3><ol>${choices}</ol></section>`;
}
Object.assign(globalThis.OFFICIAL_EXAM_UI,{choiceExplanations:officialChoiceExplanationBlock,imageOpen:officialImageOpenMarkup,paper:officialPaperFigure});
function officialCoreVerificationBadge(question){
 const status=question?.coreVerificationStatus;
 if(status==='CURATED_VERIFIED')return '<span class="official-choice-badge verified">출처 근거 검수 완료</span>';
 if(status==='CURATED_REVIEWED')return '<span class="official-choice-badge reviewed">수기 해설 검토</span>';
 if(status==='KNOWLEDGE_RULE')return '<span class="official-choice-badge rule">역사 규칙 대조</span>';
 if(status==='DATA_REVIEW_REQUIRED')return '<span class="official-choice-badge review">핵심 해설 추가 검수 필요</span>';
 return '';
}
function officialFeedbackBlock(question,right,selectedAnswer,storedResult=null){
 const memories=memoryForQuestion(question),selected=Number.isInteger(selectedAnswer)?officialChoiceLabels[selectedAnswer]||String(selectedAnswer+1):'선택하지 않음';
 const answerLabel=storedResult?.answerLabel||(!storedResult?officialAnswerLabel(question):'저장 당시 정답 정보 없음');
 return `<div class="official-feedback ${right?'correct':'wrong'}" role="status"><h2>${right?'✓ 정답입니다.':'✕ 오답입니다.'}</h2><p class="official-selected-answer">내가 선택한 답 <b>${selected}</b></p><p class="official-answer-line"><b>정답 ${esc(answerLabel)}</b></p><div class="official-explanation"><h3><span>[문제 핵심 해설]</span>${officialCoreVerificationBadge(question)}</h3><p>${esc(officialExplanation(question))}</p>${memories.length?`<button class="text-btn" data-association-for="${memories[0].id}">암기법 보기 · ${esc(memories[0].title)} ›</button>`:''}</div>${officialChoiceExplanationBlock(question,selectedAnswer)}</div>`;
}
function officialPracticePage(){
 const session=officialExamSession,entry=officialSessionQuestion();if(!session||!entry)return officialExamHome();
 const question=officialQuestion(entry.canonicalQuestionId),picked=session.answers[entry.canonicalQuestionId],feedback=session.feedback[entry.canonicalQuestionId],done=session.mode==='learn'&&feedback!==undefined,count=question.choices?.length||(question.examLevel==='기본'?4:5),timed=officialTimedSession(session),timerState=officialTimerState(session),interactionAllowed=!timed||timerState===OFFICIAL_TIMER_STATES.RUNNING,paused=timed&&timerState===OFFICIAL_TIMER_STATES.PAUSED;
 const answered=officialAnsweredIds(session).size,unanswered=session.entries.length-answered,passed=officialPassedIds(session).length,questionNumber=entry.sourceRecord.questionNumber||session.index+1;
 const status=timed?`<div class="official-exam-status" aria-label="시험 진행 상태"><strong>현재 ${questionNumber}번 / 전체 ${session.entries.length}문제</strong><span>답변 완료 <b>${answered}</b></span><span>미응답 <b>${unanswered}</b></span><span>패스 <b>${passed}</b></span></div>`:'';
 const questionBody=paused?'<div class="official-pause-cover" role="status"><b>시험이 일시정지되었습니다.</b><p>다시 시작하면 남은 시간부터 문제를 이어서 풀 수 있습니다.</p></div>':`${officialPaperFigure(entry)}<div class="official-choice-grid" role="group" aria-label="정답 선택">${officialChoiceLabels.slice(0,count).map((label,index)=>{const selected=picked===index,correct=done&&officialAnswerAccepted(question,index),stateLabel=correct&&selected?'정답·내답':correct?'정답':selected?'내 선택':'';return `<button data-official-pick="${index}" class="${selected?'picked ':''}${correct?'correct':done&&selected?'wrong':''}" aria-pressed="${selected}" aria-label="${label}${stateLabel?' '+stateLabel.replace('·',' 및 '):''}" ${done||!interactionAllowed?'disabled':''}><span aria-hidden="true">${label}</span>${stateLabel?`<small aria-hidden="true">${stateLabel}</small>`:''}</button>`}).join('')}</div>${done?officialFeedbackBlock(question,feedback,picked):''}`;
 const previous=`<button class="secondary" data-official-previous="true" ${session.index===0||!interactionAllowed?'disabled':''}>이전 문제</button>`,hasNext=session.index<session.entries.length-1;
 const actions=session.mode==='learn'&&!done?`<div class="official-learning-actions">${previous}<button class="primary" data-official-submit="true" ${picked===undefined?'disabled':''}>정답 확인</button></div>`:session.mode==='learn'?`<div class="official-learning-actions">${previous}<button class="primary" data-official-next="true">${hasNext?'다음 문제':'학습 결과 보기'}</button></div>`:`<div class="official-question-actions">${previous}${timed?`<button class="secondary" data-official-pass="true" ${!interactionAllowed?'disabled':''}>패스하기</button>`:''}<button class="secondary" data-official-next="true" ${!interactionAllowed||!hasNext||(timed&&!Number.isInteger(picked))?'disabled':''}>다음 문제</button></div><button class="official-manual-submit primary" data-official-request-submit="true" ${!interactionAllowed?'disabled':''}>시험 제출</button>`;
 return `<section class="official-practice"><header class="official-subhead"><button data-official-exit="true" aria-label="목록으로">‹</button><div><small>${session.mode==='learn'?'학습 모드':'시험 모드'} · ${examSourceLabel(entry)}</small><h1>${session.index+1} / ${session.entries.length}</h1></div></header>${officialTimerMarkup(session)}${status}<div class="quiz-progress"><div class="progress"><span style="width:${Math.round((answered||session.index+1)/session.entries.length*100)}%"></span></div></div>${questionBody}<div class="official-practice-actions">${actions}</div></section>`;
}
const officialResultDate=value=>{const date=new Date(value);return Number.isNaN(date.getTime())?'일시 정보 없음':date.toLocaleString('ko-KR')};
const officialResultDuration=value=>{if(!Number.isFinite(Number(value)))return '기록 없음';const seconds=Math.max(0,Math.round(Number(value)/1000)),minutes=Math.floor(seconds/60),rest=seconds%60;return `${minutes}분 ${String(rest).padStart(2,'0')}초`};
function officialExamHistoryPage(){
 const results=officialExamResults(),rows=results.map(result=>{const edition=officialResultEdition(result),entries=(result.questionIds||[]).map(id=>officialEntry(id)).filter(Boolean),summary=officialResultSummary(result,entries,result.graded||{}),title=edition?`제${edition.examRound}회 · ${edition.examLevel}`:result.examEra?officialEraInfo(result.examEra).name:'기출 시험',score=summary.score==null?'점수 기록 없음':`${summary.score} / ${summary.maxScore}`;return `<article class="official-exam-history-row"><div><small>${esc(officialResultDate(result.completedAt))}</small><h2>${esc(title)}</h2><p>${score} · 정답 ${summary.correct} / ${summary.total} · ${officialResultDuration(result.elapsedMs)}</p></div><button class="primary" data-official-result-open="${esc(result.attemptId)}">결과지 보기</button></article>`}).join('');
 return `<section class="official-exam-history"><header class="official-subhead"><button data-official-results-back="true" aria-label="기출문제로">‹</button><div><small>OFFICIAL EXAM HISTORY</small><h1>시험 기록</h1></div></header>${rows||'<div class="ed-empty"><b>완료한 시험이 아직 없습니다.</b><p>기출문제에서 시험처럼 풀기를 완료하면 응시별 결과가 여기에 저장됩니다.</p><button class="primary" data-official-results-back="true">기출문제 풀러 가기</button></div>'}</section>`;
}
function officialResultPage(){
 const session=officialExamSession;if(!session)return officialExamHome();const graded=session.graded||{},result=session.resultRecord||null,summary=officialResultSummary(result,session.entries,graded,session.answers),correct=summary.correct,total=summary.total,points=summary.score,maxPoints=summary.maxScore;
 const eraStats=OFFICIAL_ERA_TAXONOMY.map(era=>{const rows=session.entries.filter(entry=>entry.primaryEra===era.id),known=rows.filter(entry=>Object.hasOwn(graded,entry.canonicalQuestionId)),count=known.filter(entry=>graded[entry.canonicalQuestionId]===true).length;return {era,rows:known,count,accuracy:known.length?Math.round(count/known.length*100):null}}).filter(item=>item.rows.length);
 const eras=eraStats.map(item=>`<div><b>${item.era.name}</b><span>${item.count} / ${item.rows.length}</span><div class="progress"><span style="width:${item.accuracy}%"></span></div></div>`).join(''),weak=[...eraStats].sort((a,b)=>a.accuracy-b.accuracy||b.rows.length-a.rows.length)[0];
 const wrong=session.entries.filter(entry=>{const id=entry.canonicalQuestionId,snapshot=officialStoredQuestionResult(session,id),selected=snapshot?snapshot.selectedAnswer:session.answers[id];return Number.isInteger(selected)&&graded[id]===false}),scoreLabel=points==null?'기록 없음':`${points} / ${maxPoints}`;
 const reviewRows=session.entries.map(entry=>{const id=entry.canonicalQuestionId,known=Object.hasOwn(graded,id),right=graded[id]===true,snapshot=officialStoredQuestionResult(session,id),answer=snapshot?.answerLabel||(!result?officialAnswerLabel(officialQuestion(id)):'저장 정보 없음'),status=known?(right?'정답':snapshot?.unanswered?'미응답':'오답'):'상세 기록 없음';return `<button class="official-wrong-row ${known?(right?'right':'wrong'):'unknown'}" data-official-review="${id}"><img src="${esc(officialThumbnailImage(entry))}"${officialImageDimensionAttributes(entry,'thumbnail')} loading="lazy" decoding="async" alt=""><span><b>${esc(snapshot?.sourceLabel||examSourceLabel(entry))}</b><small>${status} · 정답 ${esc(answer)} · 해설 보기</small></span><span>›</span></button>`}).join('');
 const retry=wrong.length&&!officialSuspendedSession?'<button class="primary" data-official-retry="true">틀린 문제 다시 학습</button>':'',retake=session.mode==='exam'&&!officialSuspendedSession?'<button class="secondary" data-official-retake="true">다시 시험 보기</button>':'',back=officialSuspendedSession?'<button class="primary" data-official-resume-active="true">진행 중 시험으로 돌아가기</button>':session.readOnlyResult?'<button class="secondary" data-official-results-list="true">시험 기록으로</button>':'<button class="secondary" data-official-back="list">목록으로</button>';
 return `<section class="official-results"><p class="eyebrow">OFFICIAL EXAM RESULT</p>${session.submissionReason==='TIME_EXPIRED'?'<p class="official-timeout-notice" role="status">시간 종료로 자동 제출되었습니다</p>':''}<h1>${correct} / ${total}</h1><div class="official-result-summary">${[['총 문제',total],['정답',correct],['오답',summary.wrong],['미응답',summary.unanswered],['점수',scoreLabel],['정답률',(total?Math.round(correct/total*100):0)+'%']].map(([label,value])=>`<div><small>${label}</small><b>${value}</b></div>`).join('')}</div><p class="weak-era">취약 시대 · <b>${weak&&weak.accuracy<100?weak.era.name:'없음'}</b></p><div class="official-result-actions">${retry}${retake}${back}</div><section><h2>시대별 정답률</h2><div class="official-era-results">${eras||'<p>저장된 시대별 상세 기록이 없습니다.</p>'}</div></section><section><h2>문제별 해설 · 오답 ${wrong.length}</h2>${reviewRows}</section></section>`;
}
function officialReviewPage(){
 const session=officialExamSession,entry=session?.entries.find(item=>item.canonicalQuestionId===session.reviewQuestionId);if(!session||!entry)return officialResultPage();
 const question=officialQuestion(entry.canonicalQuestionId),snapshot=officialStoredQuestionResult(session,entry.canonicalQuestionId),selected=snapshot?snapshot.selectedAnswer:session.answers[entry.canonicalQuestionId],right=snapshot?snapshot.right:Boolean(session.graded?.[entry.canonicalQuestionId]),index=session.entries.indexOf(entry),previous=session.entries[index-1],next=session.entries[index+1],points=snapshot?`<p class="official-review-score">배점 ${snapshot.points}점 · 획득 ${snapshot.earnedPoints}점${snapshot.unanswered?' · 미응답':''}</p>`:'';
 return `<section class="official-practice official-review"><header class="official-subhead"><button data-official-review-back="true" aria-label="시험 결과로">‹</button><div><small>채점 후 문제 다시 보기 · ${esc(snapshot?.sourceLabel||examSourceLabel(entry))}</small><h1>${index+1} / ${session.entries.length}</h1></div></header>${officialPaperFigure(entry)}${points}${officialFeedbackBlock(question,right,selected,snapshot||session.resultRecord&&{})}<div class="official-review-actions"><button class="secondary" data-official-review="${previous?.canonicalQuestionId||''}" ${previous?'':'disabled'}>이전 문제</button><button class="secondary" data-official-review="${next?.canonicalQuestionId||''}" ${next?'':'disabled'}>다음 문제</button></div></section>`;
}
function officialExamPage(){if(officialExamView==='list')return officialExamListPage();if(officialExamView==='practice')return officialPracticePage();if(officialExamView==='result')return officialResultPage();if(officialExamView==='review')return officialReviewPage();if(officialExamView==='history')return officialExamHistoryPage();return officialExamHome()}

const ASSOCIATION_MEMORIES=[
 {id:'gong-go-sin-il',status:'published',era:'ancient',type:'전투 흐름',title:'후삼국 통일의 흐름',mnemonic:'공고신일',description:'후삼국 통일까지 네 장면을 한 줄로 잇습니다.',steps:[
  {title:'공산 전투',cue:'공',shortExplanation:'927년, 후백제 견훤과 고려 왕건이 맞붙은 전투입니다. 고려가 크게 패하고 신숭겸이 왕건을 대신해 전사했습니다.'},
  {title:'고창 전투',cue:'고',shortExplanation:'930년, 지금의 안동 일대에서 고려가 후백제군을 크게 물리친 전투입니다. 이 승리로 경상도 북부의 호족들이 고려에 호응했습니다.'},
  {title:'신라 항복',cue:'신',shortExplanation:'935년, 신라 경순왕이 고려 왕건에게 나라를 넘기며 항복했습니다. 신라는 큰 전쟁 없이 고려에 편입되었습니다.'},
  {title:'일리천 전투',cue:'일',shortExplanation:'936년, 고려군이 일리천에서 신검이 이끄는 후백제군을 격파했습니다. 후백제가 멸망하면서 후삼국 통일이 완성되었습니다.'}
 ],searchTerms:['공산','고창','신라 항복','일리천']},
 {id:'mu-gap-gi-eul',status:'published',era:'joseon',type:'사화',title:'조선 전기 네 사화',mnemonic:'무갑기을',description:'조선 전기 네 사화의 순서를 기억합니다.',steps:[
  {title:'무오사화',cue:'무',shortExplanation:'1498년, 김종직의 「조의제문」이 문제가 되어 김일손을 비롯한 사림이 피해를 입은 사화입니다.'},
  {title:'갑자사화',cue:'갑',shortExplanation:'1504년, 연산군이 생모 폐비 윤씨 사건을 계기로 관련 인물과 사림을 대대적으로 숙청했습니다.'},
  {title:'기묘사화',cue:'기',shortExplanation:'1519년, 중종 때 조광조의 개혁에 반발한 훈구 세력이 조광조를 비롯한 사림을 제거했습니다.'},
  {title:'을사사화',cue:'을',shortExplanation:'1545년, 명종 즉위 뒤 외척인 대윤과 소윤의 대립 과정에서 사림이 큰 피해를 입었습니다.'}
 ],searchTerms:['무오사화','갑자사화','기묘사화','을사사화']},
 {id:'byeong-je-byeong-o-sin-cheok',status:'published',era:'joseon',type:'개항 사건',title:'흥선 대원군 시기 사건',mnemonic:'병제병오신척',description:'흥선 대원군 시기 통상 수교 거부의 흐름입니다.',steps:[
  {title:'병인박해',cue:'병',shortExplanation:'1866년, 흥선 대원군이 천주교를 탄압해 프랑스 선교사와 조선인 신자들을 처형했습니다. 이는 프랑스가 병인양요를 일으킨 구실이 되었습니다.'},
  {title:'제너럴셔먼호 사건',cue:'제',shortExplanation:'1866년, 미국 상선 제너럴셔먼호가 대동강을 거슬러 올라와 통상을 요구하며 충돌했습니다. 평양 군민은 배를 불태워 격퇴했습니다.'},
  {title:'병인양요',cue:'병',shortExplanation:'1866년, 프랑스군이 병인박해를 구실로 강화도를 침략했습니다. 양헌수가 정족산성에서 프랑스군을 물리쳤지만 외규장각 도서가 약탈되었습니다.'},
  {title:'오페르트 도굴 사건',cue:'오',shortExplanation:'1868년, 독일 상인 오페르트가 통상을 강요하려고 남연군 묘 도굴을 시도했습니다. 이 사건으로 서양 세력에 대한 반감이 커졌습니다.'},
  {title:'신미양요',cue:'신',shortExplanation:'1871년, 미국이 통상을 요구하며 강화도를 침략했습니다. 어재연이 광성보에서 항전했으나 미군에 점령되었습니다.'},
  {title:'척화비',cue:'척',shortExplanation:'1871년, 흥선 대원군은 신미양요 뒤 서양과의 통상을 거부한다는 뜻을 담은 척화비를 전국에 세웠습니다.'}
 ],searchTerms:['병인박해','제너럴셔먼호','병인양요','오페르트','신미양요','척화비']},
 {id:'joseon-kings',status:'published',era:'joseon',type:'왕 계보',title:'조선 왕 순서',mnemonic:'태정태세문단세 · 예성연중인명선 · 광인효현숙경영 · 정순헌철고순',description:'태조부터 순종까지 왕의 흐름을 네 묶음으로 외웁니다.',steps:[
  {title:'태조·정종·태종·세종·문종·단종·세조',cue:'태정태세문단세',recallTitle:'태정태세문단세',shortExplanation:'태조가 조선을 건국하고 태종이 왕권을 강화했으며, 세종은 훈민정음을 창제했습니다. 문종·단종을 거쳐 세조가 계유정난으로 집권했습니다.'},
  {title:'예종·성종·연산군·중종·인종·명종·선조',cue:'예성연중인명선',recallTitle:'예성연중인명선',shortExplanation:'성종 때 『경국대전』이 완성되었고 연산군의 폭정은 중종반정으로 끝났습니다. 인종·명종을 거쳐 선조 때 임진왜란이 일어났습니다.'},
  {title:'광해군·인조·효종·현종·숙종·경종·영조',cue:'광인효현숙경영',recallTitle:'광인효현숙경영',shortExplanation:'광해군의 중립 외교 뒤 인조 때 정묘호란과 병자호란을 겪었습니다. 효종의 북벌론 이후 현종 때 예송, 숙종 때 환국이 이어졌고 경종을 거쳐 영조가 탕평책을 폈습니다.'},
  {title:'정조·순조·헌종·철종·고종·순종',cue:'정순헌철고순',recallTitle:'정순헌철고순',shortExplanation:'정조는 규장각을 중심으로 개혁 정치를 추진했습니다. 순조·헌종·철종 때 세도 정치가 이어졌고, 고종 때 대한제국이 선포된 뒤 순종 때 국권을 빼앗겼습니다.'}
 ],searchTerms:['태조','세종','선조','정조','고종','순종']}
];
const LEGACY_ASSOCIATION_DETAILS={
 'mu-gap-gi-eul':{years:'1498–1545 · 사림의 성장과 피해',category:'조선 · 사화 · 순서',background:{title:'왜 사화가 반복되었을까?',summary:'성종 때 중앙 정치에 진출한 사림은 훈구 세력과 정치 운영을 두고 충돌했습니다. 연산군의 보복 정치와 중종·명종 시기 권력 다툼이 겹치며 사림이 여러 차례 큰 피해를 입었습니다.',sections:[{title:'결과',body:'사화로 사림이 피해를 입었지만 향촌의 서원과 향약을 기반으로 세력을 넓혔고, 선조 때 중앙 정치의 주도권을 잡았습니다.'}]},causalFlow:['사림의 중앙 진출','훈구·외척과 갈등','네 차례 사화','향촌에서 세력 확대','선조 때 정국 주도'],examPoints:['무오사화는 김종직의 조의제문, 갑자사화는 폐비 윤씨 사건과 연결합니다.','기묘사화는 조광조의 개혁, 을사사화는 대윤·소윤의 외척 대립이 핵심입니다.']},
 'joseon-kings':{years:'1392–1910 · 조선 왕조의 흐름',category:'조선 · 왕 계보 · 순서',background:{title:'왜 왕의 순서를 먼저 잡아야 할까?',summary:'조선의 제도·전쟁·개혁은 왕의 재위 시기와 함께 출제됩니다. 왕 계보를 네 묶음으로 나누면 사건을 시대 순서에 놓기 쉬워집니다.',sections:[{title:'학습 방법',body:'왕 이름만 외우지 말고 세종-문화, 선조-임진왜란, 숙종-환국, 영조·정조-탕평 정치처럼 대표 사건을 함께 붙여 기억합니다.'}]},causalFlow:['조선 건국과 왕권 정비','통치 체제 완성','사림 정치와 전쟁','탕평 정치와 세도 정치','개항과 국권 피탈'],examPoints:['왕의 재위 순서를 묻는 문제는 대표 사건의 앞뒤를 함께 비교합니다.','태종·세조의 왕권 강화와 영조·정조의 탕평 정치를 구별합니다.','고종 때 대한제국 선포, 순종 때 국권 피탈의 흐름을 확인합니다.']}
};
for(const memory of ASSOCIATION_MEMORIES)if(LEGACY_ASSOCIATION_DETAILS[memory.id])Object.assign(memory,LEGACY_ASSOCIATION_DETAILS[memory.id]);
for(const memory of ASSOCIATION_MEMORIES)memory.sequence=memory.steps.map(step=>step.recallTitle||step.title);
globalThis.ASSOCIATION_MEMORIES=ASSOCIATION_MEMORIES;
/* Merge reviewed canonical cards into stable legacy IDs; unreviewed source text stays internal. */
for(const card of (globalThis.MNEMONIC_IMPORT_CARDS||[])){
 if(card.publicationStatus!=='PUBLISHED')continue;
 const steps=card.facts.map(f=>({title:f.title,cue:f.cue,shortExplanation:f.shortExplanation}));
 const imported={...card,verificationStatus:card.status,status:'published',era:card.era,type:card.category,memoryType:card.memoryType,category:card.category,originalMnemonic:card.sourceMnemonic,publicMnemonic:card.mnemonic,sourceFacts:card.sourceFacts||card.facts,verifiedFacts:card.verifiedFacts||card.facts,title:card.title,mnemonic:card.mnemonic,description:card.background?.summary||card.period,steps,sequence:steps.map(step=>step.title),searchTerms:card.searchTerms||[card.title,...card.topicTags]};
 const existing=ASSOCIATION_MEMORIES.find(memory=>memory.id===card.id);
 if(existing)Object.assign(existing,imported);else ASSOCIATION_MEMORIES.push(imported);
}
const ASSOCIATION_MEMORY_CANDIDATES=(globalThis.MNEMONIC_IMPORT_CANDIDATES||[]);
globalThis.ASSOCIATION_MEMORY_CANDIDATES=ASSOCIATION_MEMORY_CANDIDATES;
for(const memory of ASSOCIATION_MEMORIES){memory.memoryType=memory.memoryType||'ACROSTIC';memory.category=memory.category||memory.type;memory.originalMnemonic=memory.originalMnemonic||memory.mnemonic;memory.publicMnemonic=memory.publicMnemonic||memory.mnemonic;memory.moderationStatus=memory.moderationStatus||'CLEAR';memory.sourceReviewStatus=memory.sourceReviewStatus||'LEGACY_PRESERVED';memory.facts=memory.facts||memory.steps.map((step,index)=>({...step,order:index+1}));memory.sourceFacts=memory.sourceFacts||memory.facts;memory.verifiedFacts=memory.verifiedFacts||memory.facts}
let associationEra='all',associationType='all',associationMemoryType='all',associationSearch='',associationDetailId=null,associationRecall=null,associationExpandedSteps=new Set();
const MNEMONIC_REVIEW_MODE=/(?:^|[?&])mnemonicReview=1(?:&|$)/.test(globalThis.location?.search||'');
globalThis.MNEMONIC_REVIEW_MODE=MNEMONIC_REVIEW_MODE;
const associationStatus=id=>meta().associationMemoryStatus?.[id]||'NEW';
const setAssociationStatus=(id,status)=>{meta().associationMemoryStatus||(meta().associationMemoryStatus={});meta().associationMemoryStatus[id]=status};
function associationRelated(memory){
 const normalized=value=>String(value||'').replace(/\s+/g,'');
 if(Array.isArray(memory.linkEvidence))return [...new Set(memory.linkEvidence.map(e=>(officialEntry(e.officialQuestionId)||OFFICIAL_EXAM_CATALOG.find(entry=>entry.sourceRecord.officialQuestionId===e.officialQuestionId))?.canonicalQuestionId).filter(Boolean))];
 // Legacy cards link only when their actual facts appear in an official explanation.
 const terms=memory.searchTerms.filter(term=>normalized(term).length>=3);
 return OFFICIAL_EXAM_CATALOG.filter(entry=>{const question=officialQuestion(entry.canonicalQuestionId),hay=normalized([question.question,question.historicalEvent,question.explanation,...(question.examKeywords||[])].join(' '));return terms.some(term=>hay.includes(normalized(term)))}).slice(0,12).map(entry=>entry.canonicalQuestionId);
}
for(const memory of [...ASSOCIATION_MEMORIES,...(globalThis.MNEMONIC_INVENTORY||[])]){
 memory.relatedOfficialQuestionIds=associationRelated(memory);
 memory.relatedSceneIds=[...new Set(memory.relatedOfficialQuestionIds.flatMap(id=>{const entry=officialEntry(id),aliases=entry?.aliases||[id];return [...aliases.map(alias=>QUESTIONS.find(q=>q.questionId===alias)?.relatedSceneId),...Object.entries(STORIES).filter(([,scene])=>(scene.linkedQuestionIds||[]).some(qid=>officialEntry(qid)?.canonicalQuestionId===id)).map(([sceneId])=>sceneId)]}).filter(id=>id&&typeof STORIES!=='undefined'&&STORIES[id]))];
}
const memoryForQuestion=question=>ASSOCIATION_MEMORIES.filter(memory=>memory.relatedOfficialQuestionIds.includes(question?.officialQuestionId||question?.questionId));
const associationEraMatches=(filter,era)=>filter==='all'||filter===era||(filter==='modern'&&['empire','occupation','republic'].includes(era));
const associationEraTabs=[['all','전체'],['ancient','선사·고대'],['goryeo','고려'],['joseon','조선'],['modern','근현대']];
function associationReviewPanel(){
 if(!MNEMONIC_REVIEW_MODE)return '';
 const inventory=globalThis.MNEMONIC_INVENTORY||[],published=inventory.filter(card=>card.publicationStatus==='PUBLISHED').length;
 const statusCounts=inventory.reduce((out,card)=>(out[card.sourceReviewStatus]=(out[card.sourceReviewStatus]||0)+1,out),{});
 return `<section class="mnemonic-review" data-mnemonic-review><header><p class="eyebrow">DEVELOPER REVIEW</p><h2>암기법 원문 검수 목록</h2><p>전체 ${inventory.length} · 공개 승인 ${published} · VERIFIED ${statusCounts.VERIFIED||0} · CANDIDATE ${statusCounts.CANDIDATE||0} · REVIEW_REQUIRED ${statusCounts.REVIEW_REQUIRED||0}</p></header><div class="mnemonic-review-list">${inventory.map(card=>`<article data-mnemonic-review-row="${card.sourceId}"><div><b>${card.sourceId} · ${esc(card.title)}</b><span>${card.sourceReviewStatus} · ${card.publicationStatus}</span></div><code>${esc(card.sourceMnemonic)}</code></article>`).join('')}</div></section>`;
}
function associationHome(){
 const labels={ACROSTIC:'두문자',SENTENCE:'문장연상',SENTENCE_ASSOCIATION:'문장연상',WORDPLAY:'말장난',SEQUENCE:'순서',NUMBER:'숫자',STORY:'스토리',RHYTHM:'리듬',COMPARE:'비교',COMPARISON:'비교'};
 const needle=associationSearch.normalize('NFKC').toLowerCase().replace(/[\s()·,.!?/–—-]/g,'');
 const visible=ASSOCIATION_MEMORIES.filter(memory=>{const hay=[memory.title,memory.mnemonic,memory.type,memory.category,memory.era,officialEraInfo(memory.era).name,memory.normalizedSearchText,...memory.searchTerms,...memory.facts.flatMap(f=>[f.cue,f.title])].join('').normalize('NFKC').toLowerCase().replace(/[\s()·,.!?/–—-]/g,'');return memory.status==='published'&&associationEraMatches(associationEra,memory.era)&&(!needle||hay.includes(needle))});
 return `<section class="association-memory"><header class="association-page-head"><div><p class="eyebrow">MEMORY LAB</p><h1>암기법</h1><p>한국사를 더 오래, 더 쉽게 기억하는 방법</p></div></header><div class="association-search"><label><span class="sr-only">인물·사건·암기 문장 검색</span><input data-association-search value="${esc(associationSearch)}" placeholder="인물·사건·암기 문장 검색"></label></div><div class="association-era-tabs" role="group" aria-label="시대 필터">${associationEraTabs.map(([id,label])=>`<button data-association-era="${id}" aria-pressed="${associationEra===id}">${label}</button>`).join('')}</div><div class="association-grid">${visible.map(memory=>`<button class="association-card" data-association-open="${memory.id}"><span class="association-card-meta">${officialEraInfo(memory.era).name} · ${esc(memory.category||memory.type)} · ${labels[memory.memoryType]||memory.memoryType}</span><h2>${esc(memory.title)}</h2><p class="association-card-years">${esc(memory.years||memory.description||memory.period)}</p><div class="association-card-mnemonic"><small>💡 암기 문장</small><strong>${esc(memory.mnemonic)}</strong></div><footer><small>관련 실제 기출 ${memory.relatedOfficialQuestionIds.length}문제</small><span>${associationStatus(memory.id)} <b aria-hidden="true">›</b></span></footer></button>`).join('')}</div>${visible.length?'':`<div class="ed-empty">조건에 맞는 암기법이 없습니다.</div>`}${associationReviewPanel()}</section>`;
}
function storyExperienced(question){if(!question?.relatedSceneId)return false;const visited=new Set([...(run().visited||[]),...(mainRun().visited||[])]);return visited.has(question.relatedSceneId)||meta().completedChapters.includes(question.chapterId)}
const associationStepNumber=index=>['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩'][index]||String(index+1);
const memoryTypeLabel=type=>({ACROSTIC:'두문자',SENTENCE:'문장연상',SENTENCE_ASSOCIATION:'문장연상',WORDPLAY:'말장난',SEQUENCE:'순서연상',NUMBER:'숫자연상',STORY:'스토리연상',RHYTHM:'리듬연상',COMPARE:'비교연상',COMPARISON:'비교연상'})[type]||type||'암기법';
function associationStepTitle(step){
 const title=String(step.title),cue=String(step.cue||''),at=cue?title.indexOf(cue):-1;
 if(at>=0)return `${esc(title.slice(0,at))}<span class="association-cue">${esc(cue)}</span>${esc(title.slice(at+cue.length))}`;
 return `<span class="association-cue association-cue-word">${esc(cue)}</span><span class="association-cue-arrow" aria-hidden="true">→</span>${esc(title)}`;
}
function associationDetailPage(){
 const memory=ASSOCIATION_MEMORIES.find(item=>item.id===associationDetailId);if(!memory)return associationHome();const related=memory.relatedOfficialQuestionIds;
 const background=memory.background||{title:'먼저 맥락을 이해해요',summary:memory.description||'핵심 사건의 흐름을 확인한 뒤 암기 문장을 연결해 보세요.',sections:[]};
 const detailSections=memory.detailSections||[],flow=memory.causalFlow||[],examPoints=memory.examPoints||[],sectionOffset=detailSections.length?0:-1,sectionNumber=value=>String(value+sectionOffset).padStart(2,'0');
 return `<section class="association-detail"><header class="official-subhead association-detail-head"><button data-association-back="true" aria-label="암기법 목록으로">‹</button><div><small>${officialEraInfo(memory.era).name} · ${memoryTypeLabel(memory.memoryType)} · ${esc(memory.category||memory.type)}</small><h1>${esc(memory.title)}</h1><p>${esc(memory.years||memory.period||'')}</p></div></header><section class="association-meaning"><small>💡 암기 문장</small><h2 class="association-mnemonic">${esc(memory.publicMnemonic||memory.mnemonic||memory.title)}</h2><p class="association-tags">${memoryTypeLabel(memory.memoryType)} · ${esc(memory.category||memory.type)}</p></section><section class="association-keywords"><div class="association-section-title"><span>01</span><div><small>암기</small><h2>키워드 분석</h2></div></div><ol class="association-sequence">${memory.steps.map((step,index)=>{const key=`${memory.id}:${index}`,open=associationExpandedSteps.has(key),panelId=`association-step-${memory.id}-${index}`;return `<li class="association-step ${open?'open':''}"><button class="association-step-toggle" data-association-step="${index}" aria-expanded="${open}" aria-controls="${panelId}"><span class="association-step-number">${associationStepNumber(index)}</span><b>${associationStepTitle(step)}</b><span class="association-chevron" aria-hidden="true">⌄</span></button><div class="association-step-panel" id="${panelId}" aria-hidden="${!open}"><div><p>${esc(step.shortExplanation)}</p></div></div></li>`}).join('')}</ol></section><section class="association-context"><div class="association-section-title"><span>02</span><div><small>이해</small><h2>${esc(background.title)}</h2></div></div><p>${esc(background.summary)}</p>${(background.sections||[]).map(section=>`<article><h3>${esc(section.title)}</h3><p>${esc(section.body)}</p></article>`).join('')}</section>${detailSections.length?`<section class="association-details"><div class="association-section-title"><span>03</span><div><small>핵심 내용</small><h2>정책·사건별 의미</h2></div></div>${detailSections.map((section,index)=>`<details ${index===0?'open':''}><summary>${esc(section.title)}</summary><p>${esc(section.summary)}</p>${section.bullets?.length?`<ul>${section.bullets.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`:''}</details>`).join('')}</section>`:''}${flow.length?`<section class="association-flow"><div class="association-section-title"><span>${sectionNumber(4)}</span><div><small>결과</small><h2>핵심 흐름</h2></div></div><ol>${flow.map((item,index)=>`<li><span>${index+1}</span><b>${esc(item)}</b></li>`).join('')}</ol></section>`:''}${examPoints.length?`<section class="association-exam-points"><div class="association-section-title"><span>${sectionNumber(5)}</span><div><small>시험 적용</small><h2>시험 포인트</h2></div></div><ul>${examPoints.map(point=>`<li>${esc(point)}</li>`).join('')}</ul></section>`:''}${memory.steps.length>1?`<button class="primary association-recall-start" data-association-recall="${memory.id}">Recall Test 시작</button>`:''}<section class="association-official"><div class="association-section-title"><span>${sectionNumber(6)}</span><div><small>실전 확인</small><h2>관련 실제 기출</h2></div></div>${related.length?related.map(id=>{const entry=officialEntry(id),question=officialQuestion(id);return `<article class="association-question"><img src="${esc(officialThumbnailImage(entry))}"${officialImageDimensionAttributes(entry,'thumbnail')} loading="lazy" decoding="async" alt="${esc(examSourceLabel(entry))} 문제 미리보기"><span><small>${examSourceLabel(entry)}</small><b>${officialEraInfo(entry.primaryEra).name}</b></span><button data-official-single="${id}">문제 풀기</button>${storyExperienced(question)?`<button class="text-btn" data-story-memory="${id}">이 장면 기억하시나요?</button>`:''}</article>`}).join(''):'<div class="ed-empty">연결할 수 있는 등록 기출을 검토 중입니다.</div>'}</section></section>`;
}
const associationRecallItems=memory=>memory.steps.map(step=>step.title);
function associationRecallOptions(memory,index){
 const items=associationRecallItems(memory),correct=items[index],options=[correct,...items.filter((_,itemIndex)=>itemIndex!==index)].slice(0,4);let seed=[...`${memory.id}:${index}`].reduce((value,char)=>(Math.imul(value,31)+char.charCodeAt(0))>>>0,2166136261);
 for(let optionIndex=options.length-1;optionIndex>0;optionIndex--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const swapIndex=seed%(optionIndex+1);[options[optionIndex],options[swapIndex]]=[options[swapIndex],options[optionIndex]]}
 return options;
}
const newAssociationRecall=(memory,index=1,allCorrect=true)=>({memoryId:memory.id,index,options:associationRecallOptions(memory,index),selected:null,answered:false,allCorrect});
function associationRecallQuestion(memory,previous){
 const ending=memory.type==='사화'?'다음에 이어지는 사화는?':memory.type==='왕 계보'?'다음에 이어지는 왕의 흐름은?':'다음에 이어지는 것은?';
 return `<b>${esc(previous)}</b> ${ending}`;
}
function associationRecallPage(){
 const recall=associationRecall,memory=ASSOCIATION_MEMORIES.find(item=>item.id===recall?.memoryId);if(!memory)return associationHome();const items=associationRecallItems(memory),index=recall.index,correct=items[index],previous=items[index-1];
 if(recall.answered){const right=recall.selected===correct,cues=memory.steps.map(step=>step.cue).join(' · ');return `<section class="association-recall association-recall-result"><p class="eyebrow">RECALL TEST · ${index} / ${items.length-1}</p><div class="association-recall-feedback ${right?'right':'wrong'}" role="status"><h1>${right?'✓ 정답입니다.':'✕ 아쉬워요.'}</h1><p class="association-recall-answer">${right?`${esc(previous)} <span aria-hidden="true">→</span> ${esc(correct)}`:`정답: <b>${esc(correct)}</b>`}</p></div><section class="association-recall-review"><small>${esc(memory.title)} · 암기 문구</small><h2>${esc(memory.publicMnemonic||memory.mnemonic||memory.title)}</h2><strong>${esc(cues)}</strong><ol>${memory.steps.map((step,stepIndex)=>`<li><span>${associationStepNumber(stepIndex)}</span>${esc(step.cue)} → ${esc(step.title)}</li>`).join('')}</ol></section><button class="primary association-recall-next" data-association-next="true">${index===items.length-1?'테스트 마치기':'다음 문제'}</button><button class="text-btn" data-association-cancel="true">암기 카드로 돌아가기</button></section>`}
 return `<section class="association-recall"><p class="eyebrow">RECALL TEST · ${index} / ${items.length-1}</p><p class="association-recall-question">${associationRecallQuestion(memory,previous)}</p><div class="association-recall-options">${recall.options.map(option=>`<button data-association-answer="${esc(option)}">${esc(option)}</button>`).join('')}</div><button class="text-btn" data-association-cancel="true">암기 카드로 돌아가기</button></section>`;
}
function associationPage(){if(associationRecall)return associationRecallPage();if(associationDetailId)return associationDetailPage();return associationHome()}

const recordsBeforeExamMemory=records;
function officialRecordsPage(){
 const records=OFFICIAL_EXAM_CATALOG.map(entry=>({entry,record:meta().questionRecords[entry.canonicalQuestionId]})).filter(item=>item.record?.attempts),attempts=records.reduce((sum,item)=>sum+item.record.attempts,0),correct=records.reduce((sum,item)=>sum+item.record.correctCount,0);
 const eraRows=OFFICIAL_ERA_TAXONOMY.map(era=>{const entries=officialEntriesForEra(era.id),attempted=entries.filter(entry=>meta().questionRecords[entry.canonicalQuestionId]?.attempts),eraAttempts=attempted.reduce((sum,entry)=>sum+meta().questionRecords[entry.canonicalQuestionId].attempts,0),eraCorrect=attempted.reduce((sum,entry)=>sum+meta().questionRecords[entry.canonicalQuestionId].correctCount,0),accuracy=eraAttempts?Math.round(eraCorrect/eraAttempts*100):null;return `<div class="official-record-era"><b>${era.name}</b><span>${accuracy===null?'—':accuracy+'%'}</span><small>${attempted.length} / ${entries.length}문항 학습</small><div class="progress"><span style="width:${entries.length?Math.round(attempted.length/entries.length*100):0}%"></span></div></div>`}).join('');
 const examCount=officialExamResults().length;
 return `<section class="official-records">${editorialHeader('나의 기록','스토리와 기출을 하나의 기록으로')}<div class="official-record-overview"><div><small>누적 풀이</small><strong>${attempts}</strong></div><div><small>누적 정답</small><strong>${correct}</strong></div><div><small>정답률</small><strong>${attempts?Math.round(correct/attempts*100)+'%':'—'}</strong></div><div><small>학습 문항</small><strong>${records.length}</strong></div></div><section class="official-record-exams"><div><h2>시험 기록</h2><p>완료한 시험 ${examCount}건의 점수와 전체 결과지를 다시 볼 수 있습니다.</p></div><button class="secondary" data-official-results-list="true">시험 결과 보기</button></section><section><h2>시대별 기출 기록</h2>${eraRows}</section><section><h2>이야기 기록</h2>${recordsBeforeExamMemory().replace(/<header[\s\S]*?<\/header>/,'')}</section></section>`;
}

const shellBeforeExamMemory=shell;
shell=function(content){
 const current=screen==='association'?'association':screen.startsWith('exam-')?'exam-library':['era','game','quiz','complete','teaser','history'].includes(screen)?'home':screen;
 return `<div class="shell editorial-shell five-nav"><aside class="sidebar"><div class="brand">눈떠보니 한국사<small>역사를 살고, 기출로 기억하다</small></div><nav class="nav" aria-label="주 메뉴">${[['home','홈','home'],['exam-library','기출문제','book'],['association','암기법','target'],['study','오답노트','note'],['records','내 기록','records']].map(([id,label,image])=>`<button data-nav="${id}" ${current===id?'aria-current="page"':''} class="${current===id?'active':''}">${editorialIcon(image)}<span>${label}</span></button>`).join('')}</nav></aside><main class="main ed-screen ed-${screen}">${content}</main></div>${modal?modalHTML():''}`;
};
const renderContentBeforeExamMemory=renderContent;
renderContent=function(){if(screen==='exam-library')return officialExamPage();if(screen==='association')return associationPage();if(screen==='records')return officialRecordsPage();return renderContentBeforeExamMemory()};

const v2QuestionRowBeforeAssociation=v2QuestionRow;
v2QuestionRow=function(question){
 const storyQuestion=typeof v2WrongStoryQuestion==='function'?v2WrongStoryQuestion(question):question;let html=v2QuestionRowBeforeAssociation(question);if(!storyExperienced(storyQuestion))html=html.replace(/<button class="text-btn" data-story-memory="[^"]+">[\s\S]*?<\/button>/,'');
 const memories=memoryForQuestion(question);if(memories.length)html=html.replace('</div></article>',`<button class="text-btn" data-association-for="${memories[0].id}">암기법 보기 · ${esc(memories[0].title)} ›</button></div></article>`);return html;
};

const modalHTMLBeforeOfficialSubmit=modalHTML;
let officialImageReturnFocusId=null;
modalHTML=function(){
 if(modal?.type==='official-image'){
  const entry=officialEntry(modal.questionId),image=officialDetailImage(entry),label=entry?examSourceLabel(entry):'공식 기출문제';if(!entry||!image)return '';
  return `<div class="modal-overlay official-image-modal-overlay"><section class="modal official-image-modal" role="dialog" aria-modal="true" aria-labelledby="official-image-title"><header><div><small>상세 문제 이미지</small><h2 id="official-image-title">${esc(label)}</h2></div><button class="secondary" data-official-image-close="true" aria-label="확대 이미지 닫기">닫기</button></header><div class="official-image-tools"><button class="secondary" data-official-image-zoom="true" aria-pressed="${Boolean(modal.zoomed)}">${modal.zoomed?'화면에 맞추기':'글자 크게 보기'}</button><span>이미지를 위·아래로 스크롤하여 선지까지 확인하세요.</span></div><div class="official-image-scroll ${modal.zoomed?'zoomed':''}" tabindex="0"><img src="${esc(image)}"${officialImageDimensionAttributes(entry,'detail')} loading="eager" decoding="async" fetchpriority="high" alt="${esc(label)} 실제 문제 상세"></div></section></div>`;
 }
 if(modal?.type==='official-submit-confirm'){const count=Number(modal.unansweredCount)||0,title=count?`아직 답하지 않은 문제가 ${count}개 있습니다. 그래도 제출하시겠어요?`:'모든 문제를 확인했습니다. 시험을 제출하시겠어요?';return `<div class="modal-overlay"><section class="modal official-submit-modal" role="dialog" aria-modal="true" aria-labelledby="official-submit-title"><h2 id="official-submit-title">${title}</h2><p>제출 후에는 답안을 수정할 수 없으며, 채점 결과를 확인할 수 있습니다.</p><div><button class="secondary" data-official-submit-cancel="true">계속 풀기</button><button class="primary" data-official-submit-confirm="true">제출하기</button></div></section></div>`}
 if(modal?.type==='official-restart-confirm')return '<div class="modal-overlay"><section class="modal official-submit-modal" role="dialog" aria-modal="true" aria-labelledby="official-restart-title"><h2 id="official-restart-title">시험을 처음부터 다시 시작하시겠어요?</h2><p>현재 답안과 진행 시간이 초기화됩니다.</p><div><button class="secondary" data-official-restart-cancel="true">취소</button><button class="primary" data-official-restart-confirm="true">재시작</button></div></section></div>';
 return modalHTMLBeforeOfficialSubmit();
};
function suspendOfficialActiveSession(){if(officialExamSession?.mode==='exam'&&!officialExamSession.graded){persistOfficialSession();officialSuspendedSession=officialExamSession;stopOfficialTimer();return true}return false}
function resumeOfficialActiveSession(){if(!officialSuspendedSession)return false;officialExamSession=officialSuspendedSession;officialSuspendedSession=null;officialExamView='practice';screen='exam-library';modal=null;if(officialTimedSession()&&officialTimerState()===OFFICIAL_TIMER_STATES.RUNNING)startOfficialTimer();globalThis.APP_ROUTE?.push('exam-library');render();window.scrollTo(0,0);return true}
function startOfficialSession(entries,mode,options={}){
 const sessionTab=options.examTab||officialExamTab;let selected=[...entries].filter((entry,index,items)=>entry&&items.findIndex(item=>item.canonicalQuestionId===entry.canonicalQuestionId)===index),startId=options.startQuestionId;
 if(mode==='learn'&&startId){const startIndex=selected.findIndex(entry=>entry.canonicalQuestionId===startId);if(startIndex>=0)selected=options.single?[selected[startIndex]]:selected.slice(startIndex)}
 if(mode==='exam'&&sessionTab==='era')selected=selected.slice().sort((a,b)=>b.sourceRecord.examRound-a.sourceRecord.examRound||a.sourceRecord.questionNumber-b.sourceRecord.questionNumber).slice(0,20);
 if(!selected.length)return;
 if(mode==='learn')suspendOfficialActiveSession();else{stopOfficialTimer();clearOfficialStoredSession();officialSuspendedSession=null}officialSubmitting=false;
 const timed=mode==='exam'&&(options.timed??sessionTab==='round'),now=Date.now();
 officialExamSession={attemptId:mode==='exam'?officialAttemptId():null,mode,entries:selected,index:0,answers:{},feedback:{},graded:null,reviewQuestionId:null,timed,examTab:sessionTab,examEra:sessionTab==='era'?(options.examEra||officialExamEra):null,examRound:sessionTab==='round'?(Number(options.examRound)||officialExamRound):null,examLevel:options.examLevel||officialExamLevel,startedAtMs:mode==='exam'&&!timed?now:null,endTimeMs:null,durationMs:timed?OFFICIAL_EXAM_DURATION_MS:null,remainingMs:timed?OFFICIAL_EXAM_DURATION_MS:null,timerState:timed?OFFICIAL_TIMER_STATES.READY:null,passedQuestionIds:[],initialPassComplete:false,submissionReason:null,scope:options.scope||'selection',readOnlyResult:false,resultRecord:null};officialExamView='practice';officialResultReturnView='list';screen='exam-library';modal=null;
 if(mode==='exam')persistOfficialSession();render();window.scrollTo(0,0);
}
function gradeOfficialSession(submissionReason='MANUAL'){
 const session=officialExamSession;if(!session||session.mode!=='exam'||session.graded||officialSubmitting)return;const existing=officialResultById(session.attemptId);if(existing){openOfficialResult(existing.attemptId);return}officialSubmitting=true;stopOfficialTimer();modal=null;
 const remainingAtSubmission=officialTimedSession(session)?officialRemainingMs(session):null,graded={},questionResults=[];for(const entry of session.entries){const id=entry.canonicalQuestionId,answer=session.answers[id],submittedAnswer=Number.isInteger(answer)?answer:null;if(answer===undefined)session.answers[id]=null;const right=recordOfficialAttempt(id,submittedAnswer);graded[id]=right;questionResults.push(officialResultSnapshot(session,entry,submittedAnswer,right))}session.graded=graded;session.submissionReason=submissionReason;session.completedAtMs=Date.now();session.remainingMs=remainingAtSubmission;
 const score=questionResults.reduce((sum,item)=>sum+item.earnedPoints,0),maxScore=questionResults.reduce((sum,item)=>sum+item.points,0),correct=questionResults.filter(item=>item.right).length,answered=questionResults.filter(item=>!item.unanswered).length,wrong=questionResults.filter(item=>!item.unanswered&&!item.right).length,elapsedMs=officialTimedSession(session)?Math.max(0,session.durationMs-remainingAtSubmission):session.startedAtMs?Math.max(0,session.completedAtMs-session.startedAtMs):null,result={version:2,attemptId:session.attemptId,mode:'exam',timed:Boolean(session.timed),examTab:session.examTab,examEra:session.examEra,examRound:session.examRound,examLevel:session.examLevel,questionIds:session.entries.map(entry=>entry.canonicalQuestionId),answers:{...session.answers},graded:{...graded},questionResults,summary:{total:questionResults.length,answered,unanswered:questionResults.length-answered,correct,wrong,score,maxScore},startedAt:session.startedAtMs?new Date(session.startedAtMs).toISOString():null,completedAt:new Date(session.completedAtMs).toISOString(),elapsedMs,submissionReason,dataVersion:'official-result-v2'};
 clearOfficialStoredSession();meta().officialExamResults||(meta().officialExamResults=[]);if(!meta().officialExamResults.some(item=>item.attemptId===result.attemptId))meta().officialExamResults.push(result);meta().officialExamLastResultId=result.attemptId;session.resultRecord=result;session.readOnlyResult=false;save();officialExamView='result';officialResultReturnView='list';screen='exam-library';globalThis.APP_ROUTE?.push(`exam-library/results/${encodeURIComponent(result.attemptId)}`);officialSubmitting=false;render();window.scrollTo(0,0);
}
function abandonOfficialSession(){stopOfficialTimer();if(officialExamSession?.mode==='exam'&&!officialExamSession.graded)clearOfficialStoredSession();officialExamSession=null;officialSubmitting=false;save()}
function openOfficialResult(attemptId,{route=true}={}){
 const result=officialResultById(attemptId);if(!result)return false;suspendOfficialActiveSession();const entries=(result.questionIds||[]).map(id=>officialEntry(id)).filter(Boolean),graded={...(result.graded||{})};for(const item of result.questionResults||[])if(!Object.hasOwn(graded,item.questionId)&&typeof item.right==='boolean')graded[item.questionId]=item.right;
 officialExamSession={attemptId:result.attemptId,mode:'exam',entries,index:0,answers:{...(result.answers||{})},feedback:{},graded,reviewQuestionId:null,timed:Boolean(result.timed),examTab:result.examTab||(result.examRound?'round':'era'),examEra:result.examEra||null,examRound:result.examRound==null?null:Number(result.examRound),examLevel:result.examLevel||'all',startedAtMs:result.startedAt?Date.parse(result.startedAt):null,endTimeMs:null,durationMs:null,remainingMs:null,timerState:null,passedQuestionIds:[],initialPassComplete:true,submissionReason:result.submissionReason||null,completedAtMs:result.completedAt?Date.parse(result.completedAt):null,readOnlyResult:true,resultRecord:result};officialExamView='result';officialResultReturnView='history';screen='exam-library';modal=null;if(route)globalThis.APP_ROUTE?.push(`exam-library/results/${encodeURIComponent(result.attemptId)}`);render();window.scrollTo(0,0);return true;
}
function restoreOfficialSession(){
 const stored=meta().officialExamActiveSession;if(!stored)return false;
 const entries=(stored.questionIds||[]).map(id=>officialEntry(id)).filter(Boolean),timed=stored.timed===true,legacy=timed&&!stored.timerState,timerState=timed?(legacy?OFFICIAL_TIMER_STATES.RUNNING:stored.timerState):null,validTimerState=!timed||Object.values(OFFICIAL_TIMER_STATES).includes(timerState),runningTimesValid=!timed||timerState!==OFFICIAL_TIMER_STATES.RUNNING||(Number.isFinite(Number(stored.endTimeMs))&&Number(stored.endTimeMs)>0),restingTimeValid=!timed||timerState===OFFICIAL_TIMER_STATES.RUNNING||Number.isFinite(Number(stored.remainingMs)),valid=stored.mode==='exam'&&entries.length===stored.questionIds?.length&&entries.length>0&&validTimerState&&runningTimesValid&&restingTimeValid&&(!timed||OFFICIAL_ROUND_LEVELS.includes(stored.examLevel)&&entries.every(entry=>entry.sourceRecord.examRound===Number(stored.examRound)&&entry.sourceRecord.examLevel===stored.examLevel));
 if(!valid){clearOfficialStoredSession();save();return false}
 const validIds=new Set(entries.map(entry=>entry.canonicalQuestionId)),answers=Object.fromEntries(Object.entries(stored.answers||{}).filter(([id,answer])=>validIds.has(id)&&Number.isInteger(answer))),passedQuestionIds=(stored.passedQuestionIds||[]).filter((id,index,items)=>validIds.has(id)&&!Number.isInteger(answers[id])&&items.indexOf(id)===index);
 officialExamTab=stored.examTab||(timed?'round':'era');if(officialExamTab==='round'){officialExamRound=Number(stored.examRound);officialExamLevel=stored.examLevel}else{officialExamEra=stored.examEra||entries[0].primaryEra;officialExamLevel=stored.examLevel||'all'}officialExamSession={attemptId:stored.attemptId||officialAttemptId(),mode:'exam',entries,index:Math.max(0,Math.min(entries.length-1,Number(stored.index)||0)),answers,feedback:{},graded:null,reviewQuestionId:null,timed,examTab:officialExamTab,examEra:stored.examEra||null,examRound:stored.examRound==null?null:Number(stored.examRound),examLevel:stored.examLevel||'all',startedAtMs:stored.startedAtMs==null?null:Number(stored.startedAtMs),endTimeMs:timed&&timerState===OFFICIAL_TIMER_STATES.RUNNING?Number(stored.endTimeMs):null,durationMs:timed?(Number(stored.durationMs)||OFFICIAL_EXAM_DURATION_MS):null,remainingMs:timed?(timerState===OFFICIAL_TIMER_STATES.RUNNING?Math.max(0,Number(stored.endTimeMs)-Date.now()):Math.max(0,Number(stored.remainingMs))):null,timerState,passedQuestionIds,initialPassComplete:Boolean(stored.initialPassComplete),submissionReason:null,readOnlyResult:false,resultRecord:null};officialExamView='practice';screen='exam-library';
 if(timed&&timerState===OFFICIAL_TIMER_STATES.RUNNING){if(officialRemainingMs()<=0)gradeOfficialSession('TIME_EXPIRED');else startOfficialTimer()}return true;
}
document.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button||button.disabled)return;const data=button.dataset;
 if(data.officialExplanationsRetry){event.stopImmediatePropagation();officialChoicePayloadState='idle';officialChoicePayloadError='';ensureOfficialChoiceExplanations();render();return}
 if(data.officialImageOpen){event.stopImmediatePropagation();const entry=officialEntry(data.officialImageOpen);if(!entry||!officialDetailImage(entry))return;officialImageReturnFocusId=entry.canonicalQuestionId;modal={type:'official-image',questionId:entry.canonicalQuestionId,zoomed:false};render();return}
 if(data.officialImageZoom){event.stopImmediatePropagation();if(modal?.type!=='official-image')return;modal.zoomed=!modal.zoomed;render();return}
 if(data.officialImageClose){event.stopImmediatePropagation();if(modal?.type!=='official-image')return;const returnId=officialImageReturnFocusId;officialImageReturnFocusId=null;modal=null;render();if(returnId)setTimeout(()=>document.querySelector(`[data-official-image-open="${returnId}"]`)?.focus(),0);return}
 if(data.nav==='exam-library'||data.nav==='association'){event.stopImmediatePropagation();librarySession=null;if(data.nav==='exam-library'){if(officialSuspendedSession){resumeOfficialActiveSession();return}if(officialExamSession?.mode==='exam'&&!officialExamSession.graded)officialExamView='practice';else{officialExamView='home';officialExamSession=null}}else{associationDetailId=null;associationRecall=null;associationExpandedSteps=new Set()}screen=data.nav;modal=null;if(data.nav==='exam-library')globalThis.APP_ROUTE?.push('exam-library');render();window.scrollTo(0,0);return}
 if(data.officialTab){event.stopImmediatePropagation();officialExamTab=data.officialTab;officialExamView='home';officialExamLevel=data.officialTab==='round'?(OFFICIAL_ROUND_LEVELS[0]||'all'):'all';render();return}
 if(data.officialRoundLevel){event.stopImmediatePropagation();if(!OFFICIAL_ROUND_LEVELS.includes(data.officialRoundLevel))return;officialExamLevel=data.officialRoundLevel;render();return}
 if(data.officialEra){event.stopImmediatePropagation();officialExamTab='era';officialExamEra=data.officialEra;officialExamLevel='all';officialExamView='list';render();window.scrollTo(0,0);return}
 if(data.officialRound){event.stopImmediatePropagation();officialExamTab='round';officialExamRound=Number(data.officialRound);officialExamLevel=data.officialEditionLevel||'all';officialExamView='list';render();window.scrollTo(0,0);return}
 if(data.officialLevel){event.stopImmediatePropagation();officialExamLevel=data.officialLevel;render();return}
 if(data.officialBack){event.stopImmediatePropagation();officialExamSession=null;officialExamView=data.officialBack==='home'?'home':'list';globalThis.APP_ROUTE?.push('exam-library');render();window.scrollTo(0,0);return}
 if(data.officialStart){event.stopImmediatePropagation();startOfficialSession(officialSelectionEntries(),data.officialStart);return}
 if(data.officialResultsList){event.stopImmediatePropagation();suspendOfficialActiveSession();officialExamSession=null;officialExamView='history';screen='exam-library';modal=null;globalThis.APP_ROUTE?.push('exam-library/results');render();window.scrollTo(0,0);return}
 if(data.officialResultsBack){event.stopImmediatePropagation();if(resumeOfficialActiveSession())return;officialExamSession=null;officialExamView='home';screen='exam-library';modal=null;globalThis.APP_ROUTE?.push('exam-library');render();window.scrollTo(0,0);return}
 if(data.officialResumeActive){event.stopImmediatePropagation();resumeOfficialActiveSession();return}
 if(data.officialResultOpen){event.stopImmediatePropagation();openOfficialResult(data.officialResultOpen);return}
 if(data.officialTimerStart){event.stopImmediatePropagation();beginOrResumeOfficialTimer();return}
 if(data.officialTimerPause){event.stopImmediatePropagation();pauseOfficialTimer();return}
 if(data.officialTimerRestart){event.stopImmediatePropagation();if(!officialTimedSession())return;modal={type:'official-restart-confirm'};render();return}
 if(data.officialRestartCancel){event.stopImmediatePropagation();modal=null;render();return}
 if(data.officialRestartConfirm){event.stopImmediatePropagation();resetOfficialAttempt();return}
 if(data.officialSubmitCancel){event.stopImmediatePropagation();const move=Boolean(modal?.continueToUnanswered),target=move?officialUnansweredIds()[0]:null;modal=null;if(target){officialExamSession.initialPassComplete=true;officialSetCurrentQuestion(target)}else render();return}
 if(data.officialSubmitConfirm){event.stopImmediatePropagation();if(!officialExamInteractionAvailable())return;gradeOfficialSession('MANUAL');return}
 if(data.officialReview){event.stopImmediatePropagation();if(!officialExamSession?.graded)return;officialExamSession.reviewQuestionId=data.officialReview;officialExamView='review';render();window.scrollTo(0,0);return}
 if(data.officialReviewBack){event.stopImmediatePropagation();officialExamView='result';render();window.scrollTo(0,0);return}
 if(data.officialStudyFrom){event.stopImmediatePropagation();const entries=officialSelectionEntries(),entry=officialEntry(data.officialStudyFrom);if(entry)startOfficialSession(entries,'learn',{startQuestionId:entry.canonicalQuestionId,scope:'selection-from-list'});return}
 if(data.officialSingle){event.stopImmediatePropagation();const entry=officialEntry(data.officialSingle);if(entry)startOfficialSession([entry],'learn',{startQuestionId:entry.canonicalQuestionId,single:true,scope:'single-review'});return}
 if(data.officialPick!==undefined){event.stopImmediatePropagation();if(!officialExamInteractionAvailable())return;const entry=officialSessionQuestion();if(!entry||officialExamSession.mode==='learn'&&Object.hasOwn(officialExamSession.feedback,entry.canonicalQuestionId))return;officialExamSession.answers[entry.canonicalQuestionId]=Number(data.officialPick);if(officialExamSession.mode==='exam'){officialExamSession.passedQuestionIds=officialPassedIds(officialExamSession);persistOfficialSession()}render();return}
 if(data.officialSubmit){event.stopImmediatePropagation();const entry=officialSessionQuestion(),id=entry?.canonicalQuestionId,answer=officialExamSession?.answers[id];if(!entry||answer===undefined||Object.hasOwn(officialExamSession.feedback,id))return;officialExamSession.feedback[id]=recordOfficialAttempt(id,answer);save();render();return}
 if(data.officialPrevious){event.stopImmediatePropagation();officialPreviousQuestion();return}
 if(data.officialPass){event.stopImmediatePropagation();officialAdvanceQuestion({pass:true});return}
 if(data.officialRequestSubmit){event.stopImmediatePropagation();requestOfficialSubmission();return}
 if(data.officialNext){event.stopImmediatePropagation();if(officialTimedSession()){officialAdvanceQuestion();return}if(officialExamSession.mode==='exam'){if(!officialExamInteractionAvailable()||officialExamSession.index>=officialExamSession.entries.length-1)return;officialExamSession.index++;persistOfficialSession();render();window.scrollTo(0,0);return}const id=officialSessionQuestion()?.canonicalQuestionId;if(!id||!Object.hasOwn(officialExamSession.feedback,id))return;if(officialExamSession.index===officialExamSession.entries.length-1){officialExamSession.graded={...officialExamSession.feedback};officialExamView='result';render();window.scrollTo(0,0);return}officialExamSession.index++;render();window.scrollTo(0,0);return}
 if(data.officialExit){event.stopImmediatePropagation();abandonOfficialSession();officialExamView='list';render();window.scrollTo(0,0);return}
 if(data.officialRetry){event.stopImmediatePropagation();const wrong=officialExamSession.entries.filter(entry=>{const id=entry.canonicalQuestionId,snapshot=officialStoredQuestionResult(officialExamSession,id),selected=snapshot?snapshot.selectedAnswer:officialExamSession.answers[id];return Number.isInteger(selected)&&officialExamSession.graded?.[id]===false});if(wrong.length)startOfficialSession(wrong,'learn',{scope:'wrong-only'});return}
 if(data.officialRetake){event.stopImmediatePropagation();const result=officialExamSession?.resultRecord,entries=officialExamSession?.entries||[];if(!entries.length)return;const tab=result?.examTab||(result?.examRound?'round':'era');officialExamTab=tab;if(tab==='round'){officialExamRound=Number(result?.examRound||entries[0].sourceRecord.examRound);officialExamLevel=result?.examLevel||entries[0].sourceRecord.examLevel}else{officialExamEra=result?.examEra||entries[0].primaryEra;officialExamLevel=result?.examLevel||'all'}startOfficialSession(entries,'exam',{examTab:tab,examEra:officialExamEra,examRound:officialExamRound,examLevel:officialExamLevel,timed:Boolean(result?.timed)});return}
 if(data.associationEra){event.stopImmediatePropagation();associationEra=data.associationEra;render();return}
 if(data.associationOpen||data.associationFor){event.stopImmediatePropagation();associationDetailId=data.associationOpen||data.associationFor;associationRecall=null;associationExpandedSteps=new Set();screen='association';render();window.scrollTo(0,0);return}
 if(data.associationStep!==undefined){event.stopImmediatePropagation();const key=`${associationDetailId}:${Number(data.associationStep)}`;if(associationExpandedSteps.has(key))associationExpandedSteps.delete(key);else associationExpandedSteps.add(key);const row=button.closest?.('.association-step'),panel=row?.querySelector?.('.association-step-panel'),open=associationExpandedSteps.has(key);if(row&&panel){row.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open));panel.setAttribute('aria-hidden',String(!open))}else render();return}
 if(data.associationBack){event.stopImmediatePropagation();associationDetailId=null;associationRecall=null;associationExpandedSteps=new Set();render();return}
 if(data.associationRecall){event.stopImmediatePropagation();const memory=ASSOCIATION_MEMORIES.find(item=>item.id===data.associationRecall);if(!memory)return;setAssociationStatus(memory.id,'LEARNING');associationRecall=newAssociationRecall(memory);save();render();return}
 if(data.associationAnswer){event.stopImmediatePropagation();const memory=ASSOCIATION_MEMORIES.find(item=>item.id===associationRecall?.memoryId);if(!memory||associationRecall.answered)return;const correct=associationRecallItems(memory)[associationRecall.index];associationRecall.selected=data.associationAnswer;associationRecall.answered=true;if(data.associationAnswer!==correct){associationRecall.allCorrect=false;setAssociationStatus(memory.id,'LEARNING')}save();render();return}
 if(data.associationNext){event.stopImmediatePropagation();const memory=ASSOCIATION_MEMORIES.find(item=>item.id===associationRecall?.memoryId);if(!memory||!associationRecall.answered)return;if(associationRecall.index>=associationRecallItems(memory).length-1){setAssociationStatus(memory.id,associationRecall.allCorrect?'MEMORIZED':'LEARNING');const completed=associationRecall.allCorrect;associationRecall=null;save();toast(completed?'암기 완료로 기록했습니다.':'복습 후 다시 도전해 보세요.');render()}else{associationRecall=newAssociationRecall(memory,associationRecall.index+1,associationRecall.allCorrect);render();window.scrollTo(0,0)}return}
 if(data.associationCancel){event.stopImmediatePropagation();associationRecall=null;render();return}
},true);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')officialTimerTick()});
document.addEventListener('change',event=>{if(event.target.matches('[data-association-era]')){associationEra=event.target.value;render()}if(event.target.matches('[data-association-type]')){associationType=event.target.value;render()}if(event.target.matches('[data-association-memory-type]')){associationMemoryType=event.target.value;render()}});
function applyAssociationSearch(event){
 if(!event.target.matches('[data-association-search]')||event.isComposing)return;
 associationSearch=event.target.value;
 // Retain the input node throughout typing and Korean composition.
 const view=document.createElement('div');view.innerHTML=associationHome();
 const grid=document.querySelector('.association-grid'),next=view.querySelector('.association-grid');
 if(grid&&next)grid.innerHTML=next.innerHTML||'<div class="ed-empty">조건에 맞는 암기법이 없습니다.</div>';
}
document.addEventListener('input',applyAssociationSearch);
document.addEventListener('compositionend',applyAssociationSearch);

function applyOfficialExamRoute(route){
 const normalized=String(route||'').replace(/^#\/?/,'').replace(/^\/+|\/+$/g,'');
 if(normalized==='exam-library/results'){suspendOfficialActiveSession();officialExamSession=null;officialExamView='history';screen='exam-library';modal=null;return true}
 const match=/^exam-library\/results\/([^/]+)$/.exec(normalized);if(match){let attemptId=match[1];try{attemptId=decodeURIComponent(attemptId)}catch{}return openOfficialResult(attemptId,{route:false})}
 if(normalized==='exam-library'){if(officialSuspendedSession){officialExamSession=officialSuspendedSession;officialSuspendedSession=null;officialExamView='practice';if(officialTimedSession()&&officialTimerState()===OFFICIAL_TIMER_STATES.RUNNING)startOfficialTimer()}else if(officialExamSession?.mode==='exam'&&!officialExamSession.graded)officialExamView='practice';else{officialExamSession=null;officialExamView='home'}screen='exam-library';modal=null;return true}
 return false;
}
Object.assign(globalThis.OFFICIAL_EXAM_UI,{applyRoute:applyOfficialExamRoute,openResult:attemptId=>openOfficialResult(attemptId),results:()=>JSON.parse(JSON.stringify(officialExamResults())),startLearning:(questionIds,options={})=>startOfficialSession((questionIds||[]).map(id=>officialEntry(id)).filter(Boolean),'learn',options),snapshot:()=>officialExamSession?JSON.parse(JSON.stringify({attemptId:officialExamSession.attemptId,mode:officialExamSession.mode,questionIds:officialExamSession.entries.map(entry=>entry.canonicalQuestionId),index:officialExamSession.index,answers:officialExamSession.answers,feedback:officialExamSession.feedback,graded:officialExamSession.graded,scope:officialExamSession.scope,view:officialExamView,readOnlyResult:officialExamSession.readOnlyResult})):null});
globalThis.EXAM_MEMORY_UI_READY=true;
normalizeOfficialExamResults();
restoreOfficialSession();
render();
}
