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
const OFFICIAL_CHOICE_UI_BY_SOURCE_ID=new Map((globalThis.OFFICIAL_EXAM_CHOICE_RECORDS||[]).map(record=>[record.officialQuestionId,record]));
const OFFICIAL_ANALYSIS_ERAS=Object.freeze([
 {id:'prehistoric-gogojoseon',name:'선사·고조선',shortName:'선사·고조선',color:'#8a6d3b'},
 {id:'early-states',name:'여러 나라의 성장(원삼국 포함)',shortName:'여러 나라',color:'#b07a45'},
 {id:'three-gaya',name:'삼국·가야',shortName:'삼국·가야',color:'#b85e4f'},
 {id:'north-south',name:'남북국',shortName:'남북국',color:'#8b5f83'},
 {id:'goryeo',name:'고려',shortName:'고려',color:'#586f9b'},
 {id:'joseon-early',name:'조선 전기',shortName:'조선 전기',color:'#477f78'},
 {id:'joseon-late',name:'조선 후기',shortName:'조선 후기',color:'#5f8a54'},
 {id:'empire',name:'개항기·대한제국',shortName:'개항기',color:'#9b7850'},
 {id:'occupation',name:'일제강점기',shortName:'일제강점기',color:'#6f7885'},
 {id:'modern',name:'현대',shortName:'현대',color:'#415d78'}
]);
globalThis.OFFICIAL_ANALYSIS_ERAS=OFFICIAL_ANALYSIS_ERAS;
const officialAnalysisText=(source,record)=>[record?.question,record?.clue,record?.correctChoice,record?.explanation].filter(Boolean).join(' ');
const officialAnalysisHits=(text,pattern)=>(String(text).match(pattern)||[]).length;
function officialAnalysisEraForSource(source,record=OFFICIAL_EXPLANATION_BY_SOURCE_ID.get(source?.officialQuestionId)){
 const number=Number(source?.questionNumber)||0,text=officialAnalysisText(source,record);
 const prehistoric=officialAnalysisHits(text,/구석기|신석기|청동기|고조선|단군왕검|왕검성|위만|우거왕|범금\s*8조|고인돌|비파형 동검|반달 돌칼|민무늬 토기|빗살무늬 토기|뗀석기|주먹도끼|철기 시대/g);
 const earlyStates=officialAnalysisHits(text,/부여|옥저|동예|삼한|마한|진한|변한|책화|서옥제|민며느리제|골장제|영고|무천|사출도|천군|소도|읍군|삼로|신지|읍차|1책\s*12법|형사취수제|계루부/g);
 const threeGaya=officialAnalysisHits(text,/고구려|백제|신라|가야|광개토|장수왕|근초고왕|성왕|진흥왕|법흥왕|수로왕|대가야|금관가야|연개소문|황산벌|살수 대첩|안시성/g);
 const northSouth=officialAnalysisHits(text,/남북국|통일 신라|발해|후삼국|후백제|태봉|견훤|궁예|청해진|장보고|김헌창|9주\s*5소경|9서당|10정|관료전|녹읍|원종과 애노|진성 여왕|신문왕|문무왕|원성왕|독서삼품과|해동성국/g);
 if(number===1)return 'prehistoric-gogojoseon';
 if(number<=3){const scores=[['prehistoric-gogojoseon',prehistoric],['early-states',earlyStates],['three-gaya',threeGaya],['north-south',northSouth]].sort((a,b)=>b[1]-a[1]);if(scores[0][1])return scores[0][0];return number===2?'early-states':'three-gaya'}
 if(number<=6)return northSouth>threeGaya+1?'north-south':'three-gaya';
 if(number<=10)return threeGaya>northSouth+1?'three-gaya':'north-south';
 const goryeo=officialAnalysisHits(text,/고려|태조 왕건|광종|성종|문종|공민왕|충렬왕|충선왕|우왕|이색|정몽주|최영|최우|무신 집권|문벌|전시과|음서|벽란도|팔만대장경|고려청자|고려 청자|직지|삼국사기|삼국유사|의천|지눌|대각국사/g);
 const joseonEarly=officialAnalysisHits(text,/조선 건국|이성계|태조|태종|세종|세조|성종|연산군|중종|명종|선조|집현전|훈민정음|경국대전|삼강행실도|사화|훈구|사림|조광조|이황|이이|임진왜란|정유재란|이순신|한산도|행주 대첩|진주성|승정원|현량과/g);
 const joseonLate=officialAnalysisHits(text,/조선 후기|인조|효종|현종|숙종|경종|영조|정조|순조|헌종|철종|병자호란|정묘호란|삼전도|대동법|균역법|탕평|환국|예송|세도 정치|실학|유형원|이익|홍대용|박지원|박제가|정약용|김정희|김홍도|신윤복|상평통보|공인|상품 작물|장시|판소리|한글 소설|천주교|훈련도감|5군영|오군영/g);
 if(number<=17)return number>=16&&joseonEarly>goryeo+1?'joseon-early':'goryeo';
 if(number<=30){if(number<=19&&goryeo>Math.max(joseonEarly,joseonLate))return 'goryeo';if(joseonEarly!==joseonLate)return joseonEarly>joseonLate?'joseon-early':'joseon-late';return number<=22?'joseon-early':'joseon-late'}
 if(number<=35)return 'empire';
 if(number<=45)return 'occupation';
 if(number<=49)return 'modern';
 const occupation=officialAnalysisHits(text,/일제강점기|독립운동|의열단|한인 애국단|대한민국 임시 정부|소작 쟁의|조선 총독부|광복군|3·1 운동/g),empire=officialAnalysisHits(text,/개항|대한제국|대한 제국|갑오개혁|을사늑약|국권|통리기무아문|동학 농민/g),modern=officialAnalysisHits(text,/대한민국|정부|대통령|남북|민주|6·25|총선거|제주 4·3|유신|올림픽/g);
 const finalScores=[['modern',modern],['occupation',occupation],['empire',empire],['joseon-late',joseonLate],['joseon-early',joseonEarly],['goryeo',goryeo],['north-south',northSouth],['three-gaya',threeGaya],['early-states',earlyStates],['prehistoric-gogojoseon',prehistoric]].sort((a,b)=>b[1]-a[1]);
 return finalScores[0][1]?finalScores[0][0]:'modern';
}
globalThis.OFFICIAL_ANALYSIS_ERA_FOR_SOURCE=officialAnalysisEraForSource;
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
 const canonicalStored=officialStoredExplanation(canonical),reusable=candidates.map(question=>({question,stored:officialStoredExplanation(question)})).find(item=>item.stored),generated=OFFICIAL_EXPLANATION_BY_SOURCE_ID.get(source.officialQuestionId),choiceUi=OFFICIAL_CHOICE_UI_BY_SOURCE_ID.get(source.officialQuestionId),choiceExplanations=generated?.choiceExplanations||candidates.find(question=>Array.isArray(question.choiceExplanations)&&question.choiceExplanations.length)?.choiceExplanations,officialChoices=choiceUi?.choices||generated?.choices||source.choiceTexts||source.officialChoices||candidates.find(question=>Array.isArray(question.officialChoices)&&question.officialChoices.length)?.officialChoices;
 const analysisEra=officialAnalysisEraForSource(source,generated);
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
 Object.assign(question,{officialQuestionId:canonicalQuestionId,examRound:source.examRound,examYear:source.examYear,examLevel:source.examLevel,questionNumber:source.questionNumber,answer:source.answer===null?0:source.answer,answerLabel:source.answerLabel,acceptedAnswers:source.acceptedAnswers?[...source.acceptedAnswers]:[source.answer],points:source.points,thumbnailImage,detailImage,thumbnailImageWidth,thumbnailImageHeight,detailImageWidth,detailImageHeight,questionText:choiceUi?.question||question.question,sourceQuestionText:choiceUi?.question||question.sourceQuestionText||question.question,questionImage:source.questionImage||detailImage,sourceQuestionImage:detailImage,sourceImageWidth:detailImageWidth,sourceImageHeight:detailImageHeight,sourceFile:source.sourcePdf,answerFile:source.answerPdf,sourcePdf:source.sourcePdf,answerPdf:source.answerPdf,sourcePage:source.sourcePage,primaryEra,analysisEra,concepts:[...(question.concepts||source.concepts||[])],coreVerificationStatus:generated?.coreVerificationStatus||question.coreVerificationStatus||null,isOfficial:true,sourceVerified:true,sourceStatus:'verified',sourceImageStatus:'verified',sourceImageReason:'',needsVerification:false,missingPdf:false,verificationNote:'첨부된 공식 문제지와 정답표 대조 완료'});
 }
 return {key,canonicalQuestionId,aliases,primaryEra,analysisEra,relatedEra:legacy?.relatedEra||[],needsVerification:false,verificationNote:'첨부된 공식 문제지와 정답표 대조 완료',thumbnailImage,detailImage,thumbnailImageWidth,thumbnailImageHeight,detailImageWidth,detailImageHeight,contentImage:choiceUi?.contentImage||detailImage,contentImageWidth:choiceUi?.contentImageWidth||detailImageWidth,contentImageHeight:choiceUi?.contentImageHeight||detailImageHeight,contentImageSha256:choiceUi?.contentImageSha256||'',choicePresentation:choiceUi?.choicePresentation||'text',choiceMedia:(choiceUi?.choiceMedia||[]).map(item=>({...item})),libraryImage:thumbnailImage||detailImage,sourceRecord:source};
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
 const records=(Array.isArray(payload?.records)?payload.records:[]).map(record=>globalThis.OFFICIAL_EXAM_REPAIRS?.[record.officialQuestionId]?{...record,...globalThis.OFFICIAL_EXAM_REPAIRS[record.officialQuestionId]}:record);
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
   const sourceChoices=OFFICIAL_CHOICE_UI_BY_SOURCE_ID.get(record.officialQuestionId)?.choices;
   if(Array.isArray(sourceChoices))question.officialChoices=[...sourceChoices];
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


/* Match the OX sample floor; weakness means below the advanced level-3 (60%) target. */
const OFFICIAL_WEAKNESS_POLICY=Object.freeze({minimumUniqueQuestions:10,targetAccuracy:60,recentDays:7});
let officialEventIndex=null,officialEventArray=null,officialEventLength=-1,officialEventTail=null;
function officialSubmittedEvents(){
 const events=meta().learningEvents||[];
 if(officialEventArray===events&&officialEventLength===events.length&&officialEventTail===events.at(-1))return officialEventIndex;
 const index=new Map(),questionsById=new Map(QUESTIONS.map(q=>[q.questionId,q]));
 for(const event of events){const id=officialEntry(event.questionId)?.canonicalQuestionId||event.questionId;if(!index.has(id))index.set(id,{missing:0,last:null});const row=index.get(id),question=questionsById.get(id),count=question?.choices?.length||5;
  if(Object.hasOwn(event,'answer')&&(!Number.isInteger(event.answer)||event.answer<0||event.answer>=count))row.missing++;
  else if(Number.isInteger(event.answer)&&(!row.last||!event.answeredAt||!row.last.answeredAt||event.answeredAt>=row.last.answeredAt))row.last=event;
 }
 officialEventArray=events;officialEventLength=events.length;officialEventTail=events.at(-1);officialEventIndex=index;return index;
}
function officialLearningRecord(value){
 const entry=officialEntry(value),id=entry?.canonicalQuestionId||(typeof value==='string'?value:value?.questionId),runtimeId=typeof value==='string'?value:value?.questionId,record=meta().questionRecords?.[id]||meta().questionRecords?.[runtimeId];
 if(!record)return {id,attempts:0,wrongCount:0,correctCount:0,lastCorrect:null,lastAnsweredAt:null};
 const events=officialSubmittedEvents().get(id),missing=Math.min(Number(record.attempts)||0,events?.missing||0),attempts=Math.max(0,(Number(record.attempts)||0)-missing),correctCount=Math.min(attempts,Math.max(0,Number(record.correctCount)||0));
 const latestSubmitted=events?.last,recordHasAnswer=Number.isInteger(record.lastAnswer),lastCorrect=recordHasAnswer?record.lastCorrect:latestSubmitted?latestSubmitted.correct:missing?null:record.lastCorrect;
 return {id,attempts,correctCount,wrongCount:Math.max(0,attempts-correctCount),lastCorrect:typeof lastCorrect==='boolean'?lastCorrect:null,lastAnsweredAt:recordHasAnswer?record.lastAttempt||latestSubmitted?.answeredAt||null:latestSubmitted?.answeredAt||null};
}
function officialWeaknessRows(){
 const rows=OFFICIAL_ERA_TAXONOMY.map((era,index)=>({...era,index,solved:0,known:0,correct:0,wrong:0,unknown:0,attempts:0,wrongCount:0,repeatedWrong:0,recentWrong:false,lastWrongAt:null})),byEra=new Map(rows.map(row=>[row.id,row])),recent=Date.now()-OFFICIAL_WEAKNESS_POLICY.recentDays*86400000,wrongTimes=new Map((meta().wrongAnswers||[]).map(item=>[item.questionId,item.answeredAt]));
 for(const entry of OFFICIAL_EXAM_CATALOG){const record=officialLearningRecord(entry.canonicalQuestionId);if(!record.attempts)continue;const row=byEra.get(entry.primaryEra);if(!row)continue;row.solved++;row.attempts+=record.attempts;row.wrongCount+=record.wrongCount;row.repeatedWrong+=Math.max(0,record.wrongCount-1);
  if(record.lastCorrect===true){row.correct++;row.known++}else if(record.lastCorrect===false){row.wrong++;row.known++}else row.unknown++;
  const time=wrongTimes.get(entry.canonicalQuestionId);if(record.wrongCount&&time&&Number.isFinite(Date.parse(time))){if(!row.lastWrongAt||time>row.lastWrongAt)row.lastWrongAt=time;if(Date.parse(time)>=recent)row.recentWrong=true;}
 }
 return rows.map(row=>({...row,accuracy:row.known?Math.round(row.correct/row.known*100):null,errorRate:row.known?Math.round(row.wrong/row.known*100):null,eligible:row.known>=OFFICIAL_WEAKNESS_POLICY.minimumUniqueQuestions,weak:row.known>=OFFICIAL_WEAKNESS_POLICY.minimumUniqueQuestions&&row.correct/row.known*100<OFFICIAL_WEAKNESS_POLICY.targetAccuracy})).sort((a,b)=>Number(b.weak)-Number(a.weak)||Number(b.eligible)-Number(a.eligible)||(a.eligible&&b.eligible?(a.accuracy??100)-(b.accuracy??100)||b.repeatedWrong-a.repeatedWrong||Number(b.recentWrong)-Number(a.recentWrong):a.index-b.index));
}
function officialWeaknessSection(){
 const rows=officialWeaknessRows(),hasData=rows.some(row=>row.solved);
 return '<section class="official-weakness" aria-label="시대별 기출 취약점"><h2>시대별 취약점</h2><p>문항별 최근 제출 답안 기준 정답률 · 누적 오답 횟수는 별도 집계</p>'+(!hasData?'<div class="ed-empty">기출문제를 제출하면 시대별 학습 기록이 쌓여요.</div>':'')+'<div class="official-weakness-list">'+rows.map(row=>'<button class="official-weakness-row '+(row.weak?'weak':'')+'" data-official-weak-era="'+row.id+'"><span class="official-weakness-title"><b>'+row.name+'</b><small>'+(!row.solved?'학습 전':!row.eligible?'표본 부족 · '+row.known+'/'+OFFICIAL_WEAKNESS_POLICY.minimumUniqueQuestions+'문항':row.weak?'집중 복습':'학습 중')+'</small></span><span class="official-weakness-rate"><b>'+(row.accuracy===null?'—':row.accuracy+'%')+'</b><small>최근 정답률</small></span><span class="official-weakness-meter" role="img" aria-label="'+row.name+' 정답률 '+(row.accuracy===null?'기록 없음':row.accuracy+'%')+'"><i style="width:'+(row.accuracy||0)+'%"></i></span><span class="official-weakness-detail">'+row.solved+'문항 중 최근 오답 '+row.wrong+'문항 · 오답률 '+(row.errorRate===null?'—':row.errorRate+'%')+'<br>누적 '+row.wrongCount+'회 틀림 · 반복 '+row.repeatedWrong+'회'+(row.recentWrong?' · 최근 7일 오답 있음':'')+(row.unknown?' · 최근 답안 미확인 '+row.unknown+'문항':'')+'</span><span class="official-weakness-chevron" aria-hidden="true">›</span></button>').join('')+'</div><small class="official-weakness-policy">고유 '+OFFICIAL_WEAKNESS_POLICY.minimumUniqueQuestions+'문항 이상, 최근 정답률 '+OFFICIAL_WEAKNESS_POLICY.targetAccuracy+'% 미만일 때 집중 복습으로 표시합니다. 같은 정답률이면 반복·최근 오답을 함께 봅니다.</small></section>';
}
function officialWrongTitle(question){
 const original=String(question?.sourceQuestionText||question?.question||'').split('\n')[0].trim();
 if(original&&!/원문 이미지|문제와 선택지를 확인|^제\d+회.*\d+번$/.test(original))return original;
 const entry=officialEntry(question),record=entry&&OFFICIAL_EXPLANATION_BY_SOURCE_ID.get(entry.sourceRecord.officialQuestionId),clue=String(record?.clue||'').trim();
 if(clue.length<=110&&/[다요][.!?]$/.test(clue))return clue;
 const sentence=String(record?.explanation||question?.explanation||'').split(/(?<=[다요][.!?])\s+/)[0];
 if(sentence.length<=160&&/[다요][.!?]$/.test(sentence))return sentence;
 return (question?.examKeywords||[]).filter(Boolean).join(' · ')||'기출문제';
}
globalThis.OFFICIAL_LEARNING_ANALYSIS=Object.freeze({title:officialWrongTitle,rows:officialWeaknessRows,record:officialLearningRecord,era:value=>officialEntry(value)?.primaryEra||null,policy:OFFICIAL_WEAKNESS_POLICY});

const officialProgress=entries=>{const attempted=entries.filter(entry=>(meta().questionRecords[entry.canonicalQuestionId]?.attempts||0)>0).length;return {attempted,total:entries.length,percent:entries.length?Math.round(attempted/entries.length*100):0}};
const officialEntryOrder=(a,b)=>b.sourceRecord.examRound-a.sourceRecord.examRound||a.sourceRecord.questionNumber-b.sourceRecord.questionNumber||(a.sourceRecord.examLevel==='심화'?-1:1);
const officialEntriesForEra=(era,level='all')=>OFFICIAL_EXAM_CATALOG.filter(entry=>entry.primaryEra===era&&(level==='all'||entry.sourceRecord.examLevel===level)).sort(officialEntryOrder);
const officialEntriesForRound=(round,level='all')=>OFFICIAL_EXAM_CATALOG.filter(entry=>entry.sourceRecord.examRound===Number(round)&&(level==='all'||entry.sourceRecord.examLevel===level)).sort((a,b)=>a.sourceRecord.questionNumber-b.sourceRecord.questionNumber);
globalThis.OFFICIAL_ENTRIES_FOR_ERA=officialEntriesForEra;
globalThis.OFFICIAL_ENTRIES_FOR_ROUND=officialEntriesForRound;
const officialRounds=()=>[...new Set(OFFICIAL_EXAM_CATALOG.map(entry=>entry.sourceRecord.examRound))].sort((a,b)=>b-a);
const OFFICIAL_ROUND_LEVELS=['기본','심화'].filter(level=>OFFICIAL_EXAM_CATALOG.some(entry=>entry.sourceRecord.examLevel===level));
const OFFICIAL_ROUND_FILTERS=['all',...OFFICIAL_ROUND_LEVELS];
const officialEditions=(level='all')=>{const groups=new Map();for(const entry of OFFICIAL_EXAM_CATALOG){if(level!=='all'&&entry.sourceRecord.examLevel!==level)continue;const key=entry.sourceRecord.examRound+':'+entry.sourceRecord.examLevel;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(entry)}return [...groups.values()].sort((a,b)=>b[0].sourceRecord.examRound-a[0].sourceRecord.examRound||(a[0].sourceRecord.examLevel==='심화'?-1:1))};
/* Published annual schedules from the National Institute of Korean History. */
const OFFICIAL_EXAM_DATES_BY_ROUND=Object.freeze({57:'2022-02-12',58:'2022-04-10',59:'2022-06-11',60:'2022-08-06',61:'2022-10-22',62:'2022-12-03',63:'2023-02-11',64:'2023-04-15',65:'2023-06-17',66:'2023-08-13',67:'2023-10-21',68:'2023-12-02',69:'2024-02-17',70:'2024-05-25',71:'2024-08-10',72:'2024-10-20',73:'2025-02-16',74:'2025-05-24',75:'2025-08-09',76:'2025-10-18',77:'2026-02-07',78:'2026-05-23',79:'2026-08-09'});
const officialExamDate=source=>source?.examDate||OFFICIAL_EXAM_DATES_BY_ROUND[Number(source?.examRound)]||'';
const officialExamDateLabel=source=>{const date=officialExamDate(source),parts=date.split('-').map(Number);return parts.length===3&&parts.every(Number.isFinite)?`${parts[0]}. ${parts[1]}. ${parts[2]}.`:`${source?.examYear||''}년`};
globalThis.OFFICIAL_EXAM_DATES_BY_ROUND=OFFICIAL_EXAM_DATES_BY_ROUND;
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

let officialExamTab='round',officialExamView='home',officialExamEra='ancient',officialExamRound=officialRounds()[0]||79,officialExamLevel='심화',officialExamSession=null,officialSuspendedSession=null,officialResultReturnView='list',officialAttemptSequence=0,officialResultAnalysisScope='attempt',officialResultSelectedEra=null;
const OFFICIAL_EXAM_AUTO_ADVANCE_MS=400;
let officialExamAdvanceTimer=null,officialExamChoiceLocked=false,officialExamPendingQuestionId=null,officialExamSlideDirection='none',officialExamSwipeGesture=null;
let officialSwipeLockedUntil=0,officialSwipeClickUntil=0;
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
 if(result?.summary){const stored=result.summary,questionResults=result.questionResults||[],total=Number(stored.total??result.questionIds?.length??entries.length)||0,correct=Number(stored.correct??questionResults.filter(item=>item.right).length)||0,answered=Number(stored.answered??questionResults.filter(item=>!item.unanswered).length)||0,wrong=Number(stored.wrong??Math.max(0,answered-correct))||0,unanswered=Number(stored.unanswered??Math.max(0,total-answered))||0,derivedScore=questionResults.length?questionResults.reduce((sum,item)=>sum+(Number(item.earnedPoints)||0),0):entries.reduce((sum,entry)=>sum+(graded[entry.canonicalQuestionId]?Number(entry.sourceRecord.points)||0:0),0),score=stored.score??derivedScore,storedMax=stored.maxScore??questionResults.reduce((sum,item)=>sum+(Number(item.points)||0),0),maxScore=Number(storedMax)||entries.reduce((sum,entry)=>sum+(Number(entry.sourceRecord.points)||0),0);return {total,correct,answered,wrong,unanswered,score:Number(score),maxScore:Number(maxScore)}}
 const known=entries.filter(entry=>Object.hasOwn(graded,entry.canonicalQuestionId)),correct=known.filter(entry=>graded[entry.canonicalQuestionId]===true).length,answerSource=result?.answers||sessionAnswers,answeredIds=new Set(Object.entries(answerSource||{}).filter(([,answer])=>Number.isInteger(answer)).map(([id])=>id)),answered=answeredIds.size,wrong=known.filter(entry=>answeredIds.has(entry.canonicalQuestionId)&&graded[entry.canonicalQuestionId]===false).length;
 const liveScore=result?null:known.reduce((sum,entry)=>sum+(graded[entry.canonicalQuestionId]?Number(entry.sourceRecord.points)||0:0),0),liveMax=result?null:entries.reduce((sum,entry)=>sum+(Number(entry.sourceRecord.points)||0),0);
 return {total:(result?.questionIds||entries).length,correct,wrong,unanswered:Math.max(0,(result?.questionIds||entries).length-answered),answered,score:liveScore,maxScore:liveMax};
}
function officialCertification(summary,examLevel,eligible=true){
 const score=Number(summary?.score),maxScore=Number(summary?.maxScore),known=Number.isFinite(score)&&Number.isFinite(maxScore)&&maxScore>0,score100=known?Math.round(score/maxScore*1000)/10:null,type=examLevel==='심화'?'advanced':examLevel==='기본'?'basic':null;
 const criteria=type==='advanced'?'1급 80점 이상 · 2급 70점 이상 · 3급 60점 이상':type==='basic'?'4급 80점 이상 · 5급 70점 이상 · 6급 60점 이상':'';
 if(!eligible||!type||!known)return {eligible:false,score100,passed:null,grade:null,label:'등급 판정 대상 아님',criteria};
 const passed=score100>=60,grade=!passed?null:type==='advanced'?(score100>=80?1:score100>=70?2:3):(score100>=80?4:score100>=70?5:6);
 return {eligible:true,score100,passed,grade,label:passed?`${examLevel} ${grade}급`:'불합격',criteria};
}
globalThis.OFFICIAL_CERTIFICATION=officialCertification;
const officialAnalysisStatus=row=>row.total===0?{id:'none',label:'분석 데이터 없음'}:row.accuracy<60?{id:'focus',label:'집중 학습 필요'}:row.accuracy<80?{id:'review',label:'복습 권장'}:{id:'good',label:'양호'};
function officialResultEraAnalysis(session,scope='attempt'){
 const rows=OFFICIAL_ANALYSIS_ERAS.map((era,index)=>({...era,index,total:0,correct:0,wrong:0,unanswered:0,wrongEntries:[]})),byEra=new Map(rows.map(row=>[row.id,row]));
 if(scope==='cumulative'){
  for(const entry of OFFICIAL_EXAM_CATALOG){const record=officialLearningRecord(entry.canonicalQuestionId);if(typeof record.lastCorrect!=='boolean')continue;const row=byEra.get(entry.analysisEra);if(!row)continue;row.total++;if(record.lastCorrect)row.correct++;else{row.wrong++;row.wrongEntries.push({entry,unanswered:false,lastAnsweredAt:record.lastAnsweredAt})}}
 }else{
  for(const entry of session?.entries||[]){const id=entry.canonicalQuestionId;if(typeof session?.graded?.[id]!=='boolean')continue;const row=byEra.get(entry.analysisEra);if(!row)continue;const snapshot=officialStoredQuestionResult(session,id),selected=snapshot?snapshot.selectedAnswer:session.answers?.[id],unanswered=!Number.isInteger(selected);row.total++;if(session.graded[id])row.correct++;else{row.wrong++;if(unanswered)row.unanswered++;row.wrongEntries.push({entry,unanswered,lastAnsweredAt:snapshot?.answeredAt||null})}}
 }
 for(const row of rows){row.accuracy=row.total?Math.round(row.correct/row.total*100):null;row.sampleLimited=row.total>0&&row.total<3;row.status=officialAnalysisStatus(row)}
 const ranked=rows.filter(row=>row.total).sort((a,b)=>a.accuracy-b.accuracy||b.wrong-a.wrong||b.total-a.total||a.index-b.index),wrongTotal=rows.reduce((sum,row)=>sum+row.wrong,0);
 for(const row of rows)row.wrongShare=wrongTotal?Math.round(row.wrong/wrongTotal*1000)/10:0;
 return {scope,rows,ranked,top3:ranked.filter(row=>row.wrong>0).slice(0,3),wrongTotal,total:rows.reduce((sum,row)=>sum+row.total,0),correct:rows.reduce((sum,row)=>sum+row.correct,0)};
}
function officialAnalysisDonut(rows,wrongTotal){
 if(!wrongTotal)return '#e3e7e5 0 100%';let cursor=0;return rows.filter(row=>row.wrong).map(row=>{const start=cursor,end=cursor+=row.wrong/wrongTotal*100;return `${row.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`}).join(',');
}
function officialAnalysisWrongRows(row,scope,session){
 if(!row?.wrongEntries.length)return '<div class="official-analysis-empty">선택한 시대의 오답 문항이 없습니다.</div>';
 const sorted=[...row.wrongEntries].sort((a,b)=>scope==='cumulative'?Date.parse(b.lastAnsweredAt||0)-Date.parse(a.lastAnsweredAt||0):a.entry.sourceRecord.questionNumber-b.entry.sourceRecord.questionNumber),visible=scope==='cumulative'?sorted.slice(0,20):sorted;
 return `<div class="official-selected-wrongs">${visible.map(item=>{const entry=item.entry,id=entry.canonicalQuestionId,action=scope==='attempt'?`data-official-review="${id}"`:`data-official-single="${id}"`;return `<button ${action}><span><b>${esc(examSourceLabel(entry))}</b><small>${item.unanswered?'미응답':'오답'} · ${scope==='attempt'?'해설 확인':'다시 학습'}</small></span><span aria-hidden="true">›</span></button>`}).join('')}</div>${sorted.length>visible.length?`<small class="official-analysis-limit">최근 오답 ${visible.length}문항을 표시합니다.</small>`:''}`;
}
function officialResultAnalysisMarkup(session){
 const analysis=officialResultEraAnalysis(session,"attempt"),hasSelection=Boolean(officialResultSelectedEra),selected=analysis.rows.find(row=>row.id===officialResultSelectedEra),rows=analysis.rows.filter(row=>row.total>0);
 const detail=rows.map(row=>{
  const active=hasSelection&&selected?.id===row.id,accuracy=row.accuracy===null?"—":row.accuracy+"%",sample=row.total+"문항"+(row.sampleLimited?" · 표본 부족":""),statusClass=row.sampleLimited?"sample-limited":row.status.id,statusLabel=row.sampleLimited?"표본 부족":row.status.label;
  return "<button class=\"official-era-detail-row "+(active?"selected ":"")+statusClass+"\" data-official-analysis-era=\""+row.id+"\" aria-pressed=\""+active+"\"><span class=\"official-era-detail-name\"><b>"+esc(row.name)+"</b><small>"+sample+" · "+row.correct+"문항 정답</small></span><span class=\"official-era-detail-score\"><b>"+accuracy+"</b><small>"+row.correct+" / "+row.total+" 정답</small></span><span class=\"official-analysis-status "+statusClass+"\">"+esc(statusLabel)+"</span><span class=\"official-era-detail-meter\" role=\"img\" aria-label=\""+esc(row.name+" 정답률 "+accuracy)+"\"><i style=\"width:"+(row.accuracy||0)+"%\" aria-hidden=\"true\"></i></span></button>";
 }).join("");
 const selectedPanel=hasSelection&&selected?"<div class=\"official-selected-era\"><header><div><small>선택한 시대</small><h3>"+esc(selected.name)+"</h3></div><strong>"+(selected.accuracy===null?"—":selected.accuracy+"%")+"</strong></header><p>"+(selected.total?selected.correct+"문항 정답 · "+selected.wrong+"문항 오답"+(selected.unanswered?" (미응답 "+selected.unanswered+"문항)":""):"분석 데이터 없음")+(selected.sampleLimited?" · 표본이 적어 참고용으로 확인해 주세요.":"")+"</p>"+officialAnalysisWrongRows(selected,"attempt",session)+"</div>":rows.length?"<p class=\"official-era-select-hint\">시대를 선택하면 오답 문항과 해설을 확인할 수 있어요.</p>":"<div class=\"official-analysis-empty\">이번 시험에서 확인할 시대별 문항이 없습니다.</div>";
 return "<section class=\"official-result-analysis\" aria-label=\"시대별 취약점 분석\"><div class=\"official-analysis-heading\"><div><small>이번 시험</small><h2>시대별 취약점 분석</h2></div></div><p class=\"official-analysis-description\">이번 시험의 시대별 정답률과 오답을 정리했습니다. 미응답은 오답에 포함됩니다.</p><div class=\"official-era-detail-list\">"+detail+"</div>"+selectedPanel+"</section>";
}
globalThis.OFFICIAL_RESULT_ANALYSIS=Object.freeze({analyze:officialResultEraAnalysis,current:scope=>officialResultEraAnalysis(officialExamSession,scope||officialResultAnalysisScope),certification:officialCertification});
function officialEditionExamState(entries){
 const source=entries[0]?.sourceRecord;if(!source)return '미응시';
 const active=meta().officialExamActiveSession;if(active?.examRound===source.examRound&&active?.examLevel===source.examLevel)return '응시 중';
 return (meta().officialExamResults||[]).some(result=>{const edition=officialResultEdition(result);return result.mode==='exam'&&edition?.examRound===source.examRound&&edition?.examLevel===source.examLevel})?'응시 완료':'미응시';
}
function officialEditionActivity(entries){
 const source=entries[0]?.sourceRecord,progress=officialProgress(entries),active=meta().officialExamActiveSession;
 const activeForEdition=Boolean(source&&active?.examRound===source.examRound&&active?.examLevel===source.examLevel),activeAnswered=activeForEdition?Object.values(active.answers||{}).filter(Number.isInteger).length:0;
 const latest=source?officialResultForEdition(source.examRound,source.examLevel)[0]||null:null,summary=latest?officialResultSummary(latest,entries,latest.graded||{},latest.answers||{}):null;
 const state=activeForEdition?'응시 중':latest?'응시 완료':progress.attempted?'학습 중':'미응시';
 return {progress,activeForEdition,activeAnswered,latest,summary,state,stateClass:activeForEdition?'active':latest?'complete':progress.attempted?'learning':'idle'};
}
function officialTimerMarkup(session){if(!officialTimedSession(session))return '';const remaining=officialRemainingMs(session),timerState=officialTimerState(session),status=timerState===OFFICIAL_TIMER_STATES.READY?'시작 전':timerState===OFFICIAL_TIMER_STATES.PAUSED?'일시정지':'진행 중',pause=timerState===OFFICIAL_TIMER_STATES.RUNNING?'<button class="official-timer-inline-action" data-official-timer-pause="true">일시정지</button>':'';return `<span class="official-exam-timer-inline ${officialTimerTone(remaining)}" data-official-timer role="timer">남은 시간 <b data-official-timer-value>${officialFormatDuration(remaining)}</b><span class="sr-only">${status}</span></span>${pause}`}
function stopOfficialTimer(){if(officialTimerInterval!==null&&typeof clearInterval==='function')clearInterval(officialTimerInterval);officialTimerInterval=null}
function serializedOfficialSession(session){return {version:4,attemptId:session.attemptId,mode:session.mode,timed:Boolean(session.timed),examTab:session.examTab,examEra:session.examEra,examRound:session.examRound,examLevel:session.examLevel,questionIds:session.entries.map(entry=>entry.canonicalQuestionId),index:session.index,answers:{...session.answers},startedAtMs:session.startedAtMs,endTimeMs:session.endTimeMs,durationMs:session.durationMs,timerState:officialTimerState(session),remainingMs:officialTimedSession(session)?officialRemainingMs(session):null,passedQuestionIds:[...(session.passedQuestionIds||[])],initialPassComplete:Boolean(session.initialPassComplete),unansweredNavigation:Boolean(session.unansweredNavigation)}}
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
function pauseOfficialTimer(){if(!officialTimedSession()||officialTimerState()!==OFFICIAL_TIMER_STATES.RUNNING)return;const remaining=officialRemainingMs();if(remaining<=0){gradeOfficialSession('TIME_EXPIRED');return}cancelOfficialAutoAdvance();officialExamSession.remainingMs=remaining;officialExamSession.endTimeMs=null;officialExamSession.timerState=OFFICIAL_TIMER_STATES.PAUSED;stopOfficialTimer();persistOfficialSession();modal=null;render()}
function resetOfficialAttempt(){if(!officialTimedSession())return;cancelOfficialAutoAdvance();stopOfficialTimer();officialExamSession.index=0;officialExamSession.answers={};officialExamSession.feedback={};officialExamSession.passedQuestionIds=[];officialExamSession.initialPassComplete=false;officialExamSession.unansweredNavigation=false;officialExamSession.startedAtMs=null;officialExamSession.endTimeMs=null;officialExamSession.remainingMs=OFFICIAL_EXAM_DURATION_MS;officialExamSession.timerState=OFFICIAL_TIMER_STATES.READY;officialExamSession.submissionReason=null;modal=null;persistOfficialSession();render();window.scrollTo(0,0)}
function officialExamInteractionAvailable(){if(!officialTimedSession())return true;if(officialTimerState()!==OFFICIAL_TIMER_STATES.RUNNING)return false;if(officialRemainingMs()>0)return true;gradeOfficialSession('TIME_EXPIRED');return false}
function officialAnsweredIds(session=officialExamSession){return new Set(session?.entries.filter(entry=>Number.isInteger(session.answers[entry.canonicalQuestionId])).map(entry=>entry.canonicalQuestionId)||[])}
function officialPassedIds(session=officialExamSession){const answered=officialAnsweredIds(session),valid=new Set(session?.entries.map(entry=>entry.canonicalQuestionId)||[]);return (session?.passedQuestionIds||[]).filter((id,index,items)=>valid.has(id)&&!answered.has(id)&&items.indexOf(id)===index)}
function officialUnansweredIds(session=officialExamSession){if(!session)return [];const answered=officialAnsweredIds(session),passed=officialPassedIds(session),passedSet=new Set(passed);return [...passed,...session.entries.map(entry=>entry.canonicalQuestionId).filter(id=>!answered.has(id)&&!passedSet.has(id))]}
function cancelOfficialAutoAdvance(){if(officialExamAdvanceTimer!==null&&typeof clearTimeout==='function')clearTimeout(officialExamAdvanceTimer);officialExamAdvanceTimer=null;officialExamChoiceLocked=false;officialExamPendingQuestionId=null}
function officialQuestionScrollTop(){if(typeof window?.scrollTo==='function')window.scrollTo(0,0)}
function officialGoToQuestionIndex(index,direction=null){const session=officialExamSession;if(!session||!session.entries.length)return false;const next=Math.max(0,Math.min(session.entries.length-1,Number(index)));if(!Number.isInteger(next)||next===session.index)return false;cancelOfficialAutoAdvance();officialExamSlideDirection=direction||(next>session.index?'next':'previous');session.index=next;persistOfficialSession();render();officialExamSlideDirection='none';officialQuestionScrollTop();return true}
function officialUnansweredIndexes(session=officialExamSession){if(!session)return [];return session.entries.map((entry,index)=>Number.isInteger(session.answers[entry.canonicalQuestionId])?-1:index).filter(index=>index>=0)}
function officialSetCurrentQuestion(questionId,direction=null){const index=officialExamSession?.entries.findIndex(entry=>entry.canonicalQuestionId===questionId);if(index>=0)officialGoToQuestionIndex(index,direction)}
function officialPreviousQuestion(){const session=officialExamSession;if(!session||session.index<=0||session.mode==='exam'&&!officialExamInteractionAvailable())return;officialGoToQuestionIndex(session.index-1,'previous')}
function officialAdvanceQuestion({pass=false}={}){cancelOfficialAutoAdvance();const session=officialExamSession,entry=officialSessionQuestion();if(!session||!entry||!officialExamInteractionAvailable())return;const id=entry.canonicalQuestionId,picked=session.answers[id];if(pass&&!Number.isInteger(picked))session.passedQuestionIds=[...officialPassedIds(session).filter(item=>item!==id),id];else if(!pass&&!Number.isInteger(picked))return;if(!session.initialPassComplete&&session.index<session.entries.length-1){officialGoToQuestionIndex(session.index+1,'next');return}session.initialPassComplete=true;const unanswered=officialUnansweredIds(session);if(unanswered.length){officialSetCurrentQuestion(unanswered[0]);return}persistOfficialSession();render()}
function requestOfficialSubmission(){if(officialExamSession?.mode!=='exam'||!officialExamInteractionAvailable())return;cancelOfficialAutoAdvance();const unanswered=officialUnansweredIndexes();modal={type:'official-submit-confirm',unansweredCount:unanswered.length};render()}
function officialMoveToFirstUnanswered(){const session=officialExamSession,index=officialUnansweredIndexes(session)[0];if(!session||index===undefined)return false;session.unansweredNavigation=true;modal=null;if(index===session.index){persistOfficialSession();render();officialQuestionScrollTop();return true}return officialGoToQuestionIndex(index,index>session.index?'next':'previous')}
function scheduleOfficialAutoAdvance(questionId,index){cancelOfficialAutoAdvance();officialExamChoiceLocked=true;officialExamPendingQuestionId=questionId;officialExamAdvanceTimer=setTimeout(()=>{officialExamAdvanceTimer=null;officialExamChoiceLocked=false;officialExamPendingQuestionId=null;const session=officialExamSession;if(!session||session.mode!=='exam'||session.graded||session.index!==index||session.entries[index]?.canonicalQuestionId!==questionId||!Number.isInteger(session.answers[questionId]))return;if(session.unansweredNavigation){const nextUnanswered=officialUnansweredIndexes(session)[0];if(nextUnanswered!==undefined){officialGoToQuestionIndex(nextUnanswered,nextUnanswered>index?'next':'previous');return}session.unansweredNavigation=false;persistOfficialSession();requestOfficialSubmission();return}if(index<session.entries.length-1){officialGoToQuestionIndex(index+1,'next');return}requestOfficialSubmission()},OFFICIAL_EXAM_AUTO_ADVANCE_MS)}
function officialRoundCard(entries){
 const source=entries[0].sourceRecord,activity=officialEditionActivity(entries),{summary}=activity;
 const answered=activity.activeForEdition?activity.activeAnswered:activity.latest?entries.length-summary.unanswered:activity.progress.attempted,percent=entries.length?Math.round(answered/entries.length*100):0;
 const state=activity.activeForEdition?'active':activity.latest?'complete':'idle',label=activity.activeForEdition?'진행 중':activity.latest?'응시 완료':'미응시';
 const action=activity.activeForEdition?'<button class="official-round-action primary" data-official-home-resume="true">이어 풀기 <span aria-hidden="true">›</span></button>':activity.latest?`<button class="official-round-action secondary" data-official-result-open="${esc(activity.latest.attemptId)}">결과 보기 <span aria-hidden="true">›</span></button>`:`<button class="official-round-action primary" data-official-round-start="${source.examRound}" data-official-edition-level="${source.examLevel}">시험 시작 <span aria-hidden="true">›</span></button>`;
 return `<article class="official-round-row" data-state="${state}"><div class="official-round-overview"><button class="official-round-title" data-official-round="${source.examRound}" data-official-edition-level="${source.examLevel}"><h2><span class="rn-pre">제</span><span class="rn-num">${source.examRound}</span><span class="rn-suf">회</span></h2><small>${source.examLevel} · ${entries.length}문항</small></button><span class="official-edition-status ${state}">${label}</span></div><div class="official-round-meta"><time datetime="${esc(officialExamDate(source))}">${esc(officialExamDateLabel(source))} 시행</time>${officialStatisticMarkup(source,'card')}</div><div class="official-round-footer"><div class="official-personal-progress"><div class="official-card-progress" role="progressbar" aria-label="제${source.examRound}회 풀이 진행률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><i style="width:${percent}%"></i></div><p>${answered} / ${entries.length}문항 (${percent}%)${summary?.score==null?'':`<strong>최근 ${summary.score}점</strong>`}</p></div>${action}</div></article>`;
}
function officialExamHome(){
 const tab='<div class="official-tabs" role="tablist" aria-label="기출문제 보기 방식">'+[['round','회차별'],['era','시대별']].map(([id,label])=>`<button data-official-tab="${id}" aria-selected="${officialExamTab===id}">${label}</button>`).join('')+'</div>';
 const roundLevels=officialExamTab==='round'?`<div class="official-round-levels" role="tablist" aria-label="회차별 시험 유형">${['심화','기본'].map(id=>`<button data-official-round-level="${id}" aria-selected="${officialExamLevel===id}">${id}</button>`).join('')}</div>`:'';
 const roundHeading=officialExamTab==='round'?'<div class="official-round-heading"><div><small>한국사능력검정시험</small><h2>회차별 기출문제</h2></div><span>최신 회차순</span></div>':'';
 const cards=officialExamTab==='era'?OFFICIAL_ERA_TAXONOMY.map(era=>{const entries=officialEntriesForEra(era.id),progress=officialProgress(entries);return `<button class="official-card" data-official-era="${era.id}"><span class="open-pill">OPEN</span><h2>${era.name}</h2><p>${era.years}</p><small>실제 기출 ${entries.length}문항</small><div class="official-card-progress"><i style="width:${progress.percent}%"></i></div><b>${progress.attempted} / ${progress.total} · ${progress.percent}%</b></button>`}).join(''):officialEditions(officialExamLevel).map(officialRoundCard).join('');
 return `<section class="official-exams"><header class="official-home-header"><div class="official-home-service"><span>눈떠보니 한국사</span><button data-official-results-list="true">시험 기록</button></div><h1>기출문제</h1><p>실전처럼, 더 단단한 오늘을 만듭니다.</p></header>${tab}${roundLevels}${roundHeading}<div class="official-grid ${officialExamTab==='round'?'official-round-grid':'official-era-grid'}">${cards}</div><details class="official-home-insights"><summary>누적 취약점 보기</summary>${officialWeaknessSection()}</details></section>`;
}
function officialSelectionEntries(){return officialExamTab==='era'?officialEntriesForEra(officialExamEra,officialExamLevel):officialEntriesForRound(officialExamRound,officialExamLevel)}
function officialExamListPage(){
 const entries=officialSelectionEntries(),title=officialExamTab==='era'?officialEraInfo(officialExamEra).name:`제${officialExamRound}회 · ${officialExamLevel}`,progress=officialProgress(entries);
 const filters=officialExamTab==='era'?`<div class="library-filters">${[['all','전체'],['심화','심화'],['기본','기본']].map(([id,label])=>`<button data-official-level="${id}" aria-pressed="${officialExamLevel===id}">${label}</button>`).join('')}</div>`:`<div class="library-filters"><button aria-pressed="true">${officialExamLevel}</button></div>`;
 const statistic=officialExamTab==='round'&&entries.length?officialStatisticMarkup(entries[0].sourceRecord,'detail'):'';
 const editionResults=officialExamTab==='round'?officialResultForEdition(officialExamRound,officialExamLevel):[],latest=editionResults[0];
 return `<section class="official-exams official-edition-detail"><header class="official-subhead"><button data-official-back="home" aria-label="기출 메인으로">‹</button><div><small>${officialExamTab==='era'?'시대별 기출':'회차별 기출'}</small><h1>${title}</h1></div></header><div class="library-summary" aria-label="나의 기출 진행률"><div><small>전체</small><b>${progress.total}</b></div><div><small>푼 문제</small><b>${progress.attempted}</b></div><div><small>나의 진행률</small><b>${progress.percent}%</b></div></div>${statistic}${filters}<div class="official-mode-actions"><button class="primary" data-official-start="learn" ${entries.length?'':'disabled'}>학습하며 풀기</button><button class="secondary" data-official-start="exam" ${entries.length?'':'disabled'}>시험처럼 풀기</button></div><div class="official-detail-list-heading"><h2>수록 문항</h2><span>${entries.length}문항</span></div><div class="official-question-list">${entries.map(entry=>{const record=meta().questionRecords[entry.canonicalQuestionId];return `<button data-official-study-from="${entry.canonicalQuestionId}"><img src="${esc(officialThumbnailImage(entry))}"${officialImageDimensionAttributes(entry,'thumbnail')} loading="lazy" decoding="async" alt="${examSourceLabel(entry)} 원문"><span><small>${examSourceLabel(entry)}</small><b>${officialEraInfo(entry.primaryEra).name}</b><em class="${record?.lastCorrect?'right':record?'wrong':''}">${record?(record.lastCorrect?'최근 정답':'최근 오답'):'미풀이'}</em></span><span>›</span></button>`}).join('')}</div></section>`;
}
function officialSessionQuestion(){return officialExamSession?.entries[officialExamSession.index]}
function recordOfficialAttempt(questionId,answer){
 const savedRun=JSON.parse(JSON.stringify(state.run)),savedMain=state.mainRun?JSON.parse(JSON.stringify(state.mainRun)):state.mainRun;let right=false;
 try{right=recordQuestion(state,questionId,answer)}finally{state.run=savedRun;state.mainRun=savedMain}
 globalThis.THREE_LEARNING_BOUNDARY?.recordOfficialAttempt(officialEntry(questionId)?.sourceRecord?.officialQuestionId,answer);
 return right;
}
const officialContentImage=value=>{const entry=officialEntry(value)||value;return entry?.contentImage||officialQuestion(entry)?.contentImage||officialDetailImage(entry)};
const officialContentDimensions=value=>{const entry=officialEntry(value)||value,question=entry?.canonicalQuestionId?officialQuestion(entry.canonicalQuestionId):officialQuestion(value),width=Number(entry?.contentImageWidth||question?.contentImageWidth),height=Number(entry?.contentImageHeight||question?.contentImageHeight);return {width:Number.isFinite(width)&&width>0?Math.round(width):null,height:Number.isFinite(height)&&height>0?Math.round(height):null}};
const officialContentDimensionAttributes=value=>{const {width,height}=officialContentDimensions(value);return `${width?` width="${width}"`:''}${height?` height="${height}"`:''}`};
function officialImageOpenMarkup(value,{className='official-paper-open',alt='',loading='eager',priority='high'}={}){
 const entry=officialEntry(value)||value,image=officialContentImage(entry);if(!entry?.canonicalQuestionId||!image)return '';
 const label=examSourceLabel(entry),load=loading==='lazy'?'lazy':'eager',fetchPriority=priority==='high'?' fetchpriority="high"':'';
 return `<button type="button" class="${esc(className)} official-content-image" data-official-image-open="${entry.canonicalQuestionId}" aria-label="${esc(label)} 문제 본문과 자료 확대 보기"><img src="${esc(image)}"${officialContentDimensionAttributes(entry)} loading="${load}" decoding="async"${fetchPriority} alt="${esc(alt||`${label} 문제 본문과 자료`)}"></button>`;
}
function officialPaperFigure(entry){
 return `<figure class="official-paper">${officialImageOpenMarkup(entry)}<figcaption><span>문제 본문 · 자료 영역</span><small>${esc(entry.sourceRecord.sourcePdf)} · ${entry.sourceRecord.sourcePage}쪽</small><em>선지는 아래 버튼에서 선택하세요.</em></figcaption></figure>`;
}
function officialChoiceSelector(question,selectedAnswer,{disabled=false,reveal=false,exam=false}={}){
 const choices=Array.isArray(question?.officialChoices)&&question.officialChoices.length?question.officialChoices:question?.choices||[],selected=Number.isInteger(selectedAnswer)?selectedAnswer:null,entry=officialEntry(question),media=Array.isArray(entry?.choiceMedia)?entry.choiceMedia:Array.isArray(question?.officialChoiceMedia)?question.officialChoiceMedia:[],presentation=entry?.choicePresentation||question?.officialChoicePresentation||(media.length?'image':'text'),averageRatio=media.length?media.reduce((sum,item)=>sum+Number(item.width||1)/Math.max(1,Number(item.height||1)),0)/media.length:0,longMixed=presentation==='mixed'&&choices.some(choice=>String(choice||'').length>38),singleColumn=media.length&&(averageRatio>=1.9||longMixed),panelClass=media.length?`has-media is-${presentation} ${singleColumn?'media-one-column':'media-two-column'}`:'';
 return `<section class="official-choice-panel ${panelClass}" aria-label="선지 선택"><header><div><small>선지 선택</small><h2>${reveal?'채점 결과':'정답을 하나 선택하세요'}</h2></div>${!reveal?`<p>${exam?'선택하면 저장 후 다음 문제로 이동합니다.':'선택한 답을 다시 누르면 해제할 수 있어요.'}</p>`:''}</header><div class="official-choice-grid ${singleColumn?'media-one-column':media.length?'media-two-column':''}" role="radiogroup" aria-label="정답 선택">${choices.map((choice,index)=>{const picked=selected===index,correct=reveal&&officialAnswerAccepted(question,index),wrong=reveal&&picked&&!correct,stateLabel=correct&&picked?'정답 · 내 선택':correct?'정답':wrong?'내 선택 · 오답':picked?'내 선택':'',choiceMedia=media.find(item=>Number(item.choiceIndex)===index),visibleChoice=presentation==='image'&&choiceMedia?'':String(choice||''),accessibleChoice=visibleChoice||'이미지 선지',mediaMarkup=choiceMedia?`<span class="official-choice-media"><img src="${esc(choiceMedia.path)}" width="${Number(choiceMedia.width)}" height="${Number(choiceMedia.height)}" loading="eager" decoding="async" alt=""></span>`:'';return `<button type="button" role="radio" data-official-pick="${index}" class="${choiceMedia?'has-media ':''}${picked?'picked ':''}${correct?'correct ':''}${wrong?'wrong':''}" aria-checked="${picked}" aria-label="${esc(`${officialChoiceLabels[index]||index+1} ${accessibleChoice}${stateLabel?` ${stateLabel}`:''}`)}" ${disabled?'disabled':''}>${mediaMarkup}<span class="official-choice-number" aria-hidden="true">${officialChoiceLabels[index]||index+1}</span>${visibleChoice?`<span class="official-choice-label">${esc(visibleChoice)}</span>`:''}<span class="official-choice-indicator" aria-hidden="true">${correct?'✓':wrong?'!':picked?'✓':''}</span>${stateLabel?`<small>${stateLabel}</small>`:''}</button>`}).join('')}</div></section>`;
}
function officialChoiceExplanationBlock(question,selectedAnswer){
 const displayExplanations=globalThis.OFFICIAL_SUPPLEMENTAL_CHOICE_PROSE?.[question?.questionId||question?.id]||question?.choiceExplanations;
 const inlineSupplement=Boolean(question?.isOfficial&&question?.sourceVerified&&(!officialEntry(question)||Boolean(globalThis.OFFICIAL_SUPPLEMENTAL_CHOICE_PROSE?.[question?.questionId||question?.id]))&&Array.isArray(displayExplanations)&&displayExplanations.length);
 if(officialChoicePayloadState!=='ready'&&!inlineSupplement){
  if(officialChoicePayloadState==='idle')ensureOfficialChoiceExplanations();
  return officialChoicePayloadState==='error'?`<section class="official-choice-load error" role="alert"><b>선지별 상세 해설을 불러오지 못했습니다.</b><span>${esc(officialChoicePayloadError||'네트워크 상태를 확인해 주세요.')}</span><button class="text-btn" data-official-explanations-retry="true">다시 불러오기</button></section>`:'<section class="official-choice-load" role="status" aria-live="polite"><b>선지별 상세 해설을 불러오는 중입니다.</b><span>문제 원문과 연결된 전체 선지를 준비하고 있습니다.</span></section>';
 }
 const explanations=displayExplanations;
 if(!Array.isArray(explanations)||!explanations.length)return '<section class="official-choice-load error" role="alert"><b>이 문항의 선지별 상세 해설을 연결하지 못했습니다.</b><span>문항 ID와 해설 데이터 연결을 다시 확인해 주세요.</span></section>';
 const count=Math.max(explanations.length,question.officialChoices?.length||0,question.choices?.length||0,question.examLevel==='기본'?4:5),selected=Number.isInteger(selectedAnswer)?selectedAnswer:null;
 const choices=Array.from({length:count},(_,index)=>{
  const item=explanations[index],structured=typeof item==='object'&&item!==null,text=typeof item==='string'?item:item?.explanation||item?.text||'',rawChoiceText=question.officialChoices?.[index]||question.choices?.[index]||structured&&item.choiceText||'',unresolved=!rawChoiceText||rawChoiceText.includes('OCR 전사 필요'),choiceText=unresolved?'이미지 원문 선지':rawChoiceText;
  const internalText=value=>/OCR 원문 확인|추가 검수 필요|검수가 끝나지|추가 대조가 필요|확정할 수 없/.test(String(value||'')),meaning=structured&&!internalText(item.meaning)?item.meaning:'',correction=structured&&!internalText(item.correctedFact)?item.correctedFact:'',safeText=!internalText(text)?text:'';
  const summary=meaning||correction||safeText;
  const reason=structured&&!internalText(item.judgmentReason)&&item.judgmentReason!==summary?item.judgmentReason:'';
  const badges=`${officialAnswerAccepted(question,index)?'<span class="official-choice-badge answer">정답</span>':''}${selected===index?'<span class="official-choice-badge selected">내 선택</span>':''}`;
  return `<li class="${officialAnswerAccepted(question,index)?'answer ':''}${selected===index?'selected':''}"><div class="official-choice-heading"><b>${officialChoiceLabels[index]||index+1}</b><span class="official-choice-text">${esc(choiceText)}</span>${badges?`<span class="official-choice-badges">${badges}</span>`:''}</div>${summary?`<p class="official-choice-meaning"><small>핵심 요약</small><span>${esc(summary)}</span></p>`:unresolved?'<p class="official-choice-pending">원문 확인 중</p>':''}${reason?`<p class="official-choice-reason">${esc(reason)}</p>`:''}</li>`;
 }).join('');
 return `<section class="official-choice-explanations" aria-label="선지별 해설"><h3>[선지별 해설]</h3><ol>${choices}</ol></section>`;
}
Object.assign(globalThis.OFFICIAL_EXAM_UI,{detail:officialContentImage,dimensions:(value,kind='detail')=>kind==='thumbnail'?officialImageDimensions(value,'thumbnail'):officialContentDimensions(value),choiceExplanations:officialChoiceExplanationBlock,choiceSelector:officialChoiceSelector,imageOpen:officialImageOpenMarkup,paper:officialPaperFigure});
function officialCoreVerificationBadge(question){
 return '';
}
const officialVisibleExplanation=question=>{const value=officialExplanation(question);return /OCR 전사|OCR 원문 확인|추가 검수|추가 대조|검수 전까지|검수가 끝나지|확정 사실로 사용하지/.test(value)?'원문 확인 중':value};
globalThis.OFFICIAL_EXAM_UI.visibleExplanation=officialVisibleExplanation;
function officialFeedbackBlock(question,right,selectedAnswer,storedResult=null){
 const memories=memoryForQuestion(question),selected=Number.isInteger(selectedAnswer)?officialChoiceLabels[selectedAnswer]||String(selectedAnswer+1):'선택하지 않음';
 const answerLabel=storedResult?.answerLabel||(!storedResult?officialAnswerLabel(question):'저장 당시 정답 정보 없음');
 return `<div class="official-feedback ${right?'correct':'wrong'}" role="status"><h2>${right?'✓ 정답입니다.':'✕ 오답입니다.'}</h2><p class="official-selected-answer">내가 선택한 답 <b>${selected}</b></p><p class="official-answer-line"><b>정답 ${esc(answerLabel)}</b></p><div class="official-explanation"><h3><span>[문제 핵심 해설]</span>${officialCoreVerificationBadge(question)}</h3><p>${esc(officialVisibleExplanation(question))}</p>${memories.length?`<button class="text-btn" data-association-for="${memories[0].id}">암기법 보기 · ${esc(memories[0].title)} ›</button>`:''}</div>${officialChoiceExplanationBlock(question,selectedAnswer)}</div>`;
}
function officialPracticePage(){
 const session=officialExamSession,entry=officialSessionQuestion();if(!session||!entry)return officialExamHome();
 const question=officialQuestion(entry.canonicalQuestionId),picked=session.answers[entry.canonicalQuestionId],feedback=session.feedback[entry.canonicalQuestionId],done=session.mode==='learn'&&feedback!==undefined,timed=officialTimedSession(session),timerState=officialTimerState(session),interactionAllowed=!timed||timerState===OFFICIAL_TIMER_STATES.RUNNING,paused=timed&&timerState===OFFICIAL_TIMER_STATES.PAUSED,blocked=timed&&!interactionAllowed;
 const answered=officialAnsweredIds(session).size,total=session.entries.length,unanswered=total-answered,progress=total?Math.round(answered/total*100):0,questionNumber=entry.sourceRecord.questionNumber||session.index+1,isExam=session.mode==='exam',pending=isExam&&officialExamChoiceLocked&&officialExamPendingQuestionId===entry.canonicalQuestionId;
 const examTitle=session.examTab==='round'&&session.examRound?`제${session.examRound}회 ${session.examLevel}`:'기출 시험';
 const status=isExam?`<header class="official-exam-intro" data-official-exam-intro="true"><button class="official-exam-back" data-official-exit="true" aria-label="목록으로">‹</button><div class="official-exam-intro-copy"><div class="official-exam-intro-title"><strong><span class="sr-only">시험 모드 · </span>${esc(examTitle)} · ${session.index+1}/${total}번</strong><button class="official-exam-map-link" data-official-question-list="true">문제 목록</button></div><p>응답 완료 <b>${answered}</b>문항 · 미응답 <b>${unanswered}</b>문항</p>${timed?`<div class="official-exam-clock">${officialTimerMarkup(session)}</div>`:''}<div class="official-exam-progress-bar" role="progressbar" aria-label="답안 선택 진행률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><i style="width:${progress}%"></i></div></div></header>`:'';
 const blockedLabel=paused?'시험이 일시정지되었습니다.':'시험을 시작해 주세요.';
 const blockedDescription=paused?'계속하기를 누르면 남은 시간부터 문제를 이어서 풀 수 있습니다.':'시험을 시작하면 타이머가 작동하고 답안을 선택할 수 있습니다.';
 const questionBody=blocked?`<div class="official-pause-cover" role="status"><b>${blockedLabel}</b><p>${blockedDescription}</p><div><button class="primary" data-official-timer-start="true">${paused?'시험 계속하기':'시험 시작'}</button></div></div>`:`${officialPaperFigure(entry)}${officialChoiceSelector(question,picked,{disabled:done||!interactionAllowed||pending,reveal:done,exam:isExam})}${pending?'<p class="official-auto-advance-status" role="status">답안을 저장했습니다. 다음 문제로 이동합니다.</p>':''}${done?officialFeedbackBlock(question,feedback,picked):''}`;
 const previous=`<button class="secondary" data-official-previous="true" ${session.index===0||!interactionAllowed?'disabled':''}>이전 문제</button>`,hasNext=session.index<session.entries.length-1,forward=isExam&&hasNext&&interactionAllowed?'<div class="official-exam-forward-row"><button class="text-btn" data-official-forward="true" aria-label="다음 문제로 이동">다음 문제 <span aria-hidden="true">›</span></button></div>':'';
 const actions=session.mode==='learn'&&!done?`<div class="official-learning-actions">${previous}<button class="primary" data-official-submit="true" ${picked===undefined?'disabled':''}>정답 확인</button></div>`:session.mode==='learn'?`<div class="official-learning-actions">${previous}<button class="primary" data-official-next="true">${hasNext?'다음 문제':'학습 결과 보기'}</button></div>`:`<div class="official-exam-bottom-actions">${previous}<button class="primary" data-official-request-submit="true" ${!interactionAllowed?'disabled':''}>시험 제출</button></div>`;
 const header=`<header class="official-subhead"><button data-official-exit="true" aria-label="목록으로">‹</button><div><small>${session.mode==='learn'?'학습 모드':'시험 모드'} · ${examSourceLabel(entry)}</small><h1>${session.index+1} / ${session.entries.length}</h1></div></header>`;
 const top=isExam?status:`${header}<div class="quiz-progress"><div class="progress"><span style="width:${Math.round((session.index+1)/session.entries.length*100)}%"></span></div></div>`;
 return `<section class="official-practice ${isExam?'official-exam-practice':''}">${top}<div class="official-question-stage slide-${officialExamSlideDirection}" data-official-question-stage="true" data-question-index="${session.index}"><div class="official-question-kicker"><span>${questionNumber}번</span></div>${questionBody}</div>${forward}<div class="official-practice-actions">${actions}</div></section>`;
}
const officialResultDate=value=>{const date=new Date(value);return Number.isNaN(date.getTime())?'일시 정보 없음':date.toLocaleString('ko-KR')};
const officialResultDuration=value=>{if(!Number.isFinite(Number(value)))return '기록 없음';const seconds=Math.max(0,Math.round(Number(value)/1000)),minutes=Math.floor(seconds/60),rest=seconds%60;return `${minutes}분 ${String(rest).padStart(2,'0')}초`};
function officialExamHistoryPage(){
 const results=officialExamResults(),rows=results.map(result=>{
  const edition=officialResultEdition(result),entries=(result.questionIds||[]).map(id=>officialEntry(id)).filter(Boolean),summary=officialResultSummary(result,entries,result.graded||{}),title=edition?"제"+edition.examRound+"회 · "+edition.examLevel:result.examEra?officialEraInfo(result.examEra).name:"기출 시험",certification=officialCertification(summary,edition?.examLevel,Boolean(edition)),status=certification.eligible?(certification.passed?"합격":"불합격"):"미판정",grade=certification.eligible&&certification.grade?edition.examLevel+" "+certification.grade+"급":certification.eligible?"등급 없음":"공식 등급 기준 미적용",score=summary.score==null?"—":summary.score+"점";
  return "<article class=\"official-exam-history-row\"><div class=\"official-history-copy\"><div class=\"official-history-date\"><span>응시 완료</span><time>"+esc(officialResultDate(result.completedAt))+"</time></div><h2>"+esc(title)+"</h2><div class=\"official-history-stats\"><span><small>최종 점수</small><b>"+score+" / "+summary.maxScore+"점</b></span><span class=\"official-history-grade "+(certification.eligible?(certification.passed?"pass":"fail"):"learning")+"\"><small>등급</small><b>"+status+"</b><em>"+esc(grade)+"</em></span><span><small>정답</small><b>"+summary.correct+" / "+summary.total+"문항</b></span><span><small>응시 시간</small><b>"+esc(officialResultDuration(result.elapsedMs))+"</b></span></div></div><button class=\"secondary\" data-official-result-open=\""+esc(result.attemptId)+"\" aria-label=\""+esc(title)+" 결과지 보기\">결과지 보기 <span aria-hidden=\"true\">›</span></button></article>";
 }).join("");
 return "<section class=\"official-exam-history\"><header class=\"official-subhead\"><button data-official-results-back=\"true\" aria-label=\"기출문제로\">‹</button><div><small>OFFICIAL EXAM HISTORY</small><h1>시험 기록</h1></div></header>"+(rows||"<div class=\"official-history-empty ed-empty\"><b>완료한 시험이 아직 없습니다.</b><p>시험처럼 풀기를 마치면 응시별 점수와 등급이 여기에 저장됩니다.</p><button class=\"primary\" data-official-results-back=\"true\">기출문제 풀러 가기</button></div>")+"</section>";
}
function officialResultPage(){
 const session=officialExamSession;if(!session)return officialExamHome();
 const graded=session.graded||{},result=session.resultRecord||null,summary=officialResultSummary(result,session.entries,graded,session.answers),correct=summary.correct,total=summary.total,points=summary.score,maxPoints=summary.maxScore,accuracy=total?Math.round(correct/total*100):0,isOfficialRound=session.mode==="exam"&&session.examTab==="round"&&["심화","기본"].includes(session.examLevel),certification=officialCertification(summary,session.examLevel,isOfficialRound);
 const wrong=session.entries.filter(entry=>graded[entry.canonicalQuestionId]===false);
 const retry=wrong.length&&!officialSuspendedSession?"<button class=\"secondary\" data-official-retry=\"true\">오답 다시 풀기</button>":"<button class=\"secondary\" disabled>오답 다시 풀기</button>",firstReview=wrong[0]||session.entries[0],explanation=firstReview?"<button class=\"secondary\" data-official-review=\""+firstReview.canonicalQuestionId+"\">해설 보기</button>":"<button class=\"secondary\" disabled>해설 보기</button>",retake=session.mode==="exam"&&!officialSuspendedSession?"<button class=\"official-result-retake\" data-official-retake=\"true\">재시험 보기</button>":"",resume=officialSuspendedSession?"<button class=\"text-btn\" data-official-resume-active=\"true\">진행 중 시험으로 돌아가기</button>":"";
 const passMarkup=certification.eligible?"<div class=\"official-certification "+(certification.passed?"pass":"fail")+"\" aria-label=\""+(certification.passed?"합격":"불합격")+" "+(certification.grade?session.examLevel+" "+certification.grade+"급":"등급 없음")+"\"><span>"+(certification.passed?"합격":"불합격")+"</span><b>"+(certification.grade?session.examLevel+" "+certification.grade+"급":"등급 없음")+"</b><small>"+(certification.passed?"꾸준한 노력이 만든 값진 결과입니다.":"합격선까지 필요한 부분을 다시 점검해 보세요.")+"</small></div>":"<div class=\"official-certification learning\" aria-label=\"학습 완료, 등급 판정 없음\"><span>학습 완료</span><b>등급 판정 없음</b><small>학습 모드는 공식 등급을 판정하지 않습니다.</small></div>";
 const criteria=certification.eligible?"<details class=\"official-grade-criteria\"><summary>"+esc(session.examLevel)+" 등급별 합격 기준</summary><p>"+esc(certification.criteria)+"</p><small>문항별 공식 배점 합계로 산출하며 60점 미만은 불합격입니다.</small></details>":"";
 const resultTitle=session.examRound?"제"+session.examRound+"회 · "+session.examLevel+" 결과":"기출 학습 결과",timeout=session.submissionReason==="TIME_EXPIRED"?"<p class=\"official-timeout-notice\" role=\"status\">시간 종료로 자동 제출되었습니다</p>":"",stats=[["정답",correct+"문항"],["오답",(total-correct)+"문항"],["정답률",accuracy+"%"]].map(([label,value])=>"<div><small>"+label+"</small><b>"+value+"</b></div>").join("");
 return "<section class=\"official-results\"><p class=\"sr-only\">OFFICIAL EXAM RESULT</p><header class=\"official-result-head\"><button data-official-result-home=\"true\" aria-label=\"기출문제 메인으로\">‹</button><h1>"+esc(resultTitle)+"</h1><button data-official-results-list=\"true\" aria-label=\"시험 기록\">···</button></header>"+timeout+"<div class=\"official-result-hero\" aria-label=\"정답 "+correct+"문항, 오답 "+(total-correct)+"문항\"><div><small>최종 점수</small><h1>"+(points==null?"—":points)+"<span>점</span></h1><p>"+(maxPoints||100)+"점 만점</p></div>"+passMarkup+"</div><div class=\"official-result-summary\" aria-label=\"정답 "+correct+"문항, 오답 "+(total-correct)+"문항, 미응답 "+summary.unanswered+"문항, 정답률 "+accuracy+"%\">"+stats+"</div><div class=\"official-result-actions\">"+retry+explanation+retake+"</div>"+criteria+officialResultAnalysisMarkup(session)+"<div class=\"official-result-utilities\">"+resume+"<button class=\"text-btn\" data-official-results-list=\"true\">시험 기록</button></div></section>";
}
function officialReviewPage(){
 const session=officialExamSession,entry=session?.entries.find(item=>item.canonicalQuestionId===session.reviewQuestionId);if(!session||!entry)return officialResultPage();
 const question=officialQuestion(entry.canonicalQuestionId),snapshot=officialStoredQuestionResult(session,entry.canonicalQuestionId),selected=snapshot?snapshot.selectedAnswer:session.answers[entry.canonicalQuestionId],right=snapshot?snapshot.right:Boolean(session.graded?.[entry.canonicalQuestionId]),index=session.entries.indexOf(entry),total=session.entries.length,previous=session.entries[index-1],next=session.entries[index+1],source=entry.sourceRecord,title=session.examRound?`제${session.examRound}회 · ${session.examLevel}`:session.examEra?officialEraInfo(session.examEra).name:'기출문제 해설',questionNumber=source?.questionNumber||index+1,progress=total?Math.round((index+1)/total*100):0,selectedLabel=Number.isInteger(selected)?officialChoiceLabels[selected]||String(selected+1):'미응답',answerLabel=snapshot?.answerLabel||officialAnswerLabel(question),resultLabel=snapshot?.unanswered?'미응답':right?'정답':'오답',points=snapshot?`<span class="official-review-points">획득 ${snapshot.earnedPoints} / ${snapshot.points}점</span>`:'';
 const memories=memoryForQuestion(question),verdict=snapshot?.unanswered?'미응답':right?'✓ 정답입니다.':'✕ 오답입니다.',outcome=`<div class="official-review-outcome ${snapshot?.unanswered?'unanswered':right?'correct':'wrong'}" role="status"><h2>${verdict}</h2><div><p>내가 선택한 답 <b>${esc(selectedLabel)}</b></p><p><b>정답 ${esc(answerLabel)}</b></p></div>${snapshot?.unanswered?'<small>답안을 선택하지 않았습니다.</small>':''}</div>`,explanation=`<section class="official-review-explanation" aria-label="문제 해설"><small>PROBLEM EXPLANATION</small><h2>[문제 핵심 해설]</h2><p>${esc(officialVisibleExplanation(question))}</p>${memories.length?`<button class="text-btn" data-association-for="${memories[0].id}">암기법 보기 · ${esc(memories[0].title)} ›</button>`:''}${officialChoiceExplanationBlock(question,selected)}</section>`;
 return `<section class="official-review slide-${officialExamSlideDirection}" data-official-review-surface="true" aria-label="문제 해설 슬라이드"><header class="official-review-header"><div class="official-review-title"><small>채점 후 문제 다시 보기</small><h1>${esc(title)}</h1><p>${esc(snapshot?.sourceLabel||examSourceLabel(entry))}</p></div><div class="official-review-header-actions"><strong aria-label="${index+1} / ${total}번">${index+1}<span>/${total}</span></strong><button class="official-review-close" data-official-review-back="true" aria-label="결과 화면으로 닫기"><span>닫기</span><b aria-hidden="true">×</b></button></div></header><div class="official-review-progress" role="progressbar" aria-label="해설 진행률" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${index+1}"><i style="width:${progress}%"></i></div><div class="official-review-kicker"><span>문항 ${questionNumber}</span><span>문제 · 정답 · 해설</span></div><div class="official-review-paper">${officialPaperFigure(entry)}</div><section class="official-review-answer" aria-label="선택 답안과 정답"><header><div><small>ANSWER REVIEW</small><h2>선택 답안과 정답</h2></div>${points}</header>${officialChoiceSelector(question,selected,{disabled:true,reveal:true})}${outcome}${explanation}</section><nav class="official-review-actions" aria-label="문제 이동"><button class="secondary" data-official-review="${previous?.canonicalQuestionId||''}" ${previous?'':'disabled'}><span aria-hidden="true">‹</span> 이전 문제</button><button class="secondary" data-official-review="${next?.canonicalQuestionId||''}" ${next?'':'disabled'}>다음 문제 <span aria-hidden="true">›</span></button></nav></section>`;
}
function officialExamPage(){if(officialExamView==='cover')return officialCoverPage();if(officialExamView==='list')return officialExamListPage();if(officialExamView==='practice')return officialPracticePage();if(officialExamView==='result')return officialResultPage();if(officialExamView==='review')return officialReviewPage();if(officialExamView==='history')return officialExamHistoryPage();return officialExamHome()}

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
 const records=OFFICIAL_EXAM_CATALOG.map(entry=>({entry,record:meta().questionRecords[entry.canonicalQuestionId]})).filter(item=>item.record?.attempts),attempts=records.reduce((sum,item)=>sum+item.record.attempts,0),correct=records.reduce((sum,item)=>sum+item.record.correctCount,0),results=officialExamResults(),examCount=results.length;
 const eraRows=OFFICIAL_ERA_TAXONOMY.map(era=>{
  const entries=officialEntriesForEra(era.id),attempted=entries.filter(entry=>meta().questionRecords[entry.canonicalQuestionId]?.attempts),eraAttempts=attempted.reduce((sum,entry)=>sum+meta().questionRecords[entry.canonicalQuestionId].attempts,0),eraCorrect=attempted.reduce((sum,entry)=>sum+meta().questionRecords[entry.canonicalQuestionId].correctCount,0),accuracy=eraAttempts?Math.round(eraCorrect/eraAttempts*100):null,coverage=entries.length?Math.round(attempted.length/entries.length*100):0;
  return "<div class=\"official-record-era\"><b>"+esc(era.name)+"</b><strong>"+(accuracy===null?"—":accuracy+"%")+"</strong><small>"+attempted.length+" / "+entries.length+"문항</small><div class=\"progress\" role=\"img\" aria-label=\""+esc(era.name+" 학습 "+coverage+"%")+"\" aria-valuenow=\""+coverage+"\"><span style=\"width:"+coverage+"%\"></span></div></div>";
 }).join("");
 const latest=results.reduce((best,item)=>!best||(item.completedAt||"")>(best.completedAt||"")?item:best,null);
 let latestMarkup="",historyAction="";
 if(latest){
  const edition=officialResultEdition(latest),entries=(latest.questionIds||[]).map(id=>officialEntry(id)).filter(Boolean),summary=officialResultSummary(latest,entries,latest.graded||{},latest.answers||{}),title=edition?"제"+edition.examRound+"회 · "+edition.examLevel:latest.examEra?officialEraInfo(latest.examEra).name:"기출 시험",certification=officialCertification(summary,edition?.examLevel,Boolean(edition)),status=certification.eligible?(certification.passed?"합격":"불합격"):"미판정",grade=certification.eligible&&certification.grade?edition.examLevel+" "+certification.grade+"급":certification.eligible?"등급 없음":"공식 등급 기준 미적용",gradeClass=certification.eligible?(certification.passed?"pass":"fail"):"learning";
  latestMarkup="<article class=\"official-latest-result\"><div class=\"official-latest-result-copy\"><small>최근 응시 · "+esc(officialResultDate(latest.completedAt))+"</small><h3>"+esc(title)+"</h3><p>정답 "+summary.correct+" / "+summary.total+"문항 · "+esc(officialResultDuration(latest.elapsedMs))+"</p></div><div class=\"official-latest-result-score\"><small>최종 점수</small><strong>"+(summary.score==null?"—":summary.score+"점")+"</strong><span>"+summary.maxScore+"점 만점</span></div><div class=\"official-latest-result-grade "+gradeClass+"\"><small>등급 판정</small><strong>"+status+"</strong><span>"+esc(grade)+"</span></div></article>";
  historyAction="<button class=\"secondary\" data-official-results-list=\"true\">전체 기록 보기 <span aria-hidden=\"true\">›</span></button>";
 }else{
  latestMarkup="<div class=\"official-record-empty\"><div><small>시험 결과 없음</small><h3>첫 시험을 마치면 여기에 기록돼요.</h3><p>회차를 선택해 실제 기출을 시험처럼 풀어보세요.</p></div><button class=\"primary\" data-nav=\"exam-library\">기출문제 풀기 <span aria-hidden=\"true\">›</span></button></div>";
 }
 return "<section class=\"official-records\"><header class=\"ed-header\"><div><p>기출 풀이와 시험 성과를 한눈에</p><h1>나의 기록</h1></div><button class=\"ed-profile\" data-action=\"status\" aria-label=\"내 상태 보기\">"+editorialIcon("profile")+"</button></header><div class=\"official-record-overview\" aria-label=\"기출 학습 요약\"><div><small>누적 풀이</small><strong>"+attempts+"</strong></div><div><small>누적 정답</small><strong>"+correct+"</strong></div><div><small>정답률</small><strong>"+(attempts?Math.round(correct/attempts*100)+"%":"—")+"</strong></div><div><small>학습 문항</small><strong>"+records.length+"</strong></div></div>"+(!records.length?"<div class=\"official-record-learning-empty\"><p>아직 기출 풀이 기록이 없습니다. 문제를 풀면 정답률과 시대별 학습 흐름을 볼 수 있어요.</p><button class=\"ed-link\" data-nav=\"exam-library\">기출문제 풀기 ›</button></div>":"")+"<section class=\"official-record-exams\"><div class=\"official-record-section-heading\"><div><small>"+(examCount?examCount+"회 응시":"응시 기록 없음")+"</small><h2>시험 기록</h2><p>완료한 시험의 점수와 등급을 확인하세요.</p></div>"+historyAction+"</div>"+latestMarkup+"</section>"+officialWeaknessSection()+"<section class=\"official-record-era-section\"><div class=\"official-record-section-heading\"><div><h2>시대별 기출 기록</h2><p>시대별로 푼 문제와 정답률을 모았습니다.</p></div></div><div class=\"official-record-era-list\">"+eraRows+"</div></section></section>";
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
  const entry=officialEntry(modal.questionId),image=officialContentImage(entry),label=entry?examSourceLabel(entry):'공식 기출문제';if(!entry||!image)return '';
  return `<div class="modal-overlay official-image-modal-overlay"><section class="modal official-image-modal" role="dialog" aria-modal="true" aria-labelledby="official-image-title"><header><div><small>문제 본문 · 자료 확대</small><h2 id="official-image-title">${esc(label)}</h2></div><button class="secondary" data-official-image-close="true" aria-label="확대 이미지 닫기">닫기</button></header><div class="official-image-tools"><button class="secondary" data-official-image-zoom="true" aria-pressed="${Boolean(modal.zoomed)}">${modal.zoomed?'화면에 맞추기':'글자 크게 보기'}</button><span>원본 PDF에서 분리한 문제 본문과 자료입니다. 선지는 문제 화면의 선택 카드에서 확인합니다.</span></div><div class="official-image-scroll ${modal.zoomed?'zoomed':''}" tabindex="0"><div class="official-modal-content-crop"><img src="${esc(image)}"${officialContentDimensionAttributes(entry)} loading="eager" decoding="async" fetchpriority="high" alt="${esc(label)} 문제 본문과 자료 상세"></div></div></section></div>`;
 }
 if(modal?.type==='official-question-sheet'){
  const session=officialExamSession;if(!session||session.mode!=='exam')return '';
  const answered=officialAnsweredIds(session).size,total=session.entries.length,unanswered=total-answered,items=session.entries.map((entry,index)=>{const complete=Number.isInteger(session.answers[entry.canonicalQuestionId]),current=index===session.index;return `<button class="official-question-number ${complete?'answered':'unanswered'} ${current?'current':''}" data-official-question-jump="${index}" aria-label="${index+1}번 ${complete?'답안 선택 완료':'미응답'}${current?' 현재 문항':''}" ${current?'aria-current="step"':''}><span>${index+1}</span><small>${complete?'완료':'미응답'}</small></button>`}).join('');
  const timerTools=officialTimedSession(session)?`<div class="official-question-sheet-tools"><span>타이머와 답안을 초기화하려면 시험을 처음부터 다시 시작하세요.</span><button class="secondary" data-official-timer-restart="true">시험 처음부터</button></div>`:'';
  return `<div class="modal-overlay official-question-sheet-overlay" data-official-question-list-close="overlay"><section class="modal official-question-sheet" role="dialog" aria-modal="true" aria-labelledby="official-question-sheet-title"><div class="official-sheet-handle" aria-hidden="true"></div><header><div><small>QUESTION MAP</small><h2 id="official-question-sheet-title">문제 목록</h2></div><button class="secondary" data-official-question-list-close="button" aria-label="문제 목록 닫기">닫기</button></header><div class="official-question-sheet-summary"><span>답변 완료 <b>${answered}</b></span><span>미응답 <b>${unanswered}</b></span><span>전체 <b>${total}</b></span></div><div class="official-question-number-grid">${items}</div><p class="official-question-sheet-help"><i></i> 답안 선택 완료 <i></i> 현재 문항</p>${timerTools}</section></div>`;
 }
 if(modal?.type==='official-submit-confirm'){const count=Number(modal.unansweredCount)||0,title=count?`아직 풀지 않은 문제가 ${count}개 있습니다.`:'시험을 제출하시겠습니까?',description=count?'미응답 문항은 오답으로 처리됩니다. 먼저 남은 문제로 이동하거나 그대로 제출할 수 있습니다.':'제출 후에는 답안을 수정할 수 없으며 채점 결과 화면으로 이동합니다.',actions=count?'<button class="secondary" data-official-submit-cancel="true">취소</button><button class="secondary official-unanswered-jump" data-official-submit-unanswered="true">미응답 문제로 이동</button><button class="primary" data-official-submit-confirm="true">그대로 제출</button>':'<button class="secondary" data-official-submit-cancel="true">취소</button><button class="primary" data-official-submit-confirm="true">제출</button>';return `<div class="modal-overlay"><section class="modal official-submit-modal ${count?'has-unanswered':''}" role="dialog" aria-modal="true" aria-labelledby="official-submit-title"><h2 id="official-submit-title">${title}</h2><p>${description}</p><div>${actions}</div></section></div>`}
 if(modal?.type==='official-cover-replace')return '<div class="modal-overlay"><section class="modal official-submit-modal" role="dialog" aria-modal="true" aria-labelledby="official-cover-replace-title"><h2 id="official-cover-replace-title">진행 중인 시험을 새로 시작하시겠어요?</h2><p>기존 미완료 답안과 진행 시간은 초기화됩니다. 완료한 시험 결과는 보존됩니다.</p><div><button class="secondary" data-official-restart-cancel="true">취소</button><button class="primary" data-official-cover-replace="'+esc(modal.token)+'">시험 시작</button></div></section></div>';
 if(modal?.type==='official-retake-confirm')return '<div class="modal-overlay"><section class="modal official-submit-modal official-retake-modal" role="dialog" aria-modal="true" aria-labelledby="official-retake-title"><h2 id="official-retake-title">재시험을 보시겠습니까?</h2><p>새로운 시험을 시작합니다. 이전 시험 결과와 학습 기록은 유지됩니다.</p><div><button class="secondary" data-official-retake-cancel="true">취소</button><button class="primary" data-official-retake-confirm="true">재시험 보기</button></div></section></div>';
 if(modal?.type==='official-restart-confirm')return '<div class="modal-overlay"><section class="modal official-submit-modal" role="dialog" aria-modal="true" aria-labelledby="official-restart-title"><h2 id="official-restart-title">시험을 처음부터 다시 시작하시겠어요?</h2><p>현재 답안과 진행 시간이 초기화됩니다.</p><div><button class="secondary" data-official-restart-cancel="true">취소</button><button class="primary" data-official-restart-confirm="true">재시작</button></div></section></div>';
 return modalHTMLBeforeOfficialSubmit();
};
function suspendOfficialActiveSession(){if(officialExamSession?.mode==='exam'&&!officialExamSession.graded){cancelOfficialAutoAdvance();persistOfficialSession();officialSuspendedSession=officialExamSession;stopOfficialTimer();return true}return false}
function resumeOfficialActiveSession(){if(!officialSuspendedSession)return false;officialExamSession=officialSuspendedSession;officialSuspendedSession=null;officialExamView='practice';screen='exam-library';modal=null;if(officialTimedSession()&&officialTimerState()===OFFICIAL_TIMER_STATES.RUNNING)startOfficialTimer();globalThis.APP_ROUTE?.push('exam-library');render();window.scrollTo(0,0);return true}

// A cover is navigation state only: it never allocates an attempt or writes learning records.
let officialExamCover=null,officialCoverSequence=0,officialCoverStarting=false;
globalThis.OFFICIAL_EXAM_COVER={snapshot:()=>officialExamCover?{token:officialExamCover.token,questionIds:officialExamCover.entries.map(e=>e.canonicalQuestionId),options:{...officialExamCover.options}}:null};
function officialCoverRoute(cover){return 'exam-library/cover/'+cover.options.examTab+'/'+encodeURIComponent(cover.options.examTab==='round'?cover.options.examRound:cover.options.examEra)+'/'+encodeURIComponent(cover.options.examLevel)}
function openOfficialExamCover(entries,options={},route=true){
 const examTab=options.examTab||officialExamTab,selected=entries.filter(Boolean);if(!selected.length)return false;
 suspendOfficialActiveSession();officialExamSession=null;
 officialExamCover={token:String(++officialCoverSequence),entries:selected,options:{examTab,examEra:options.examEra||officialExamEra,examRound:options.examRound||officialExamRound,examLevel:options.examLevel||officialExamLevel,timed:options.timed??examTab==='round'}};
 officialCoverStarting=false;officialExamView='cover';screen='exam-library';modal=null;
 if(route)globalThis.APP_ROUTE?.push(officialCoverRoute(officialExamCover));render();window.scrollTo(0,0);return true;
}
function officialCoverActive(){return officialSuspendedSession||(!officialExamSession?.graded&&officialExamSession?.mode==='exam'?officialExamSession:null)}
function officialCoverPage(){
 const cover=officialExamCover;if(!cover)return officialExamListPage();
 const {entries,options}=cover,source=entries[0].sourceRecord,count=options.examTab==='era'?Math.min(20,entries.length):entries.length,selected=options.examTab==='era'?entries.slice().sort((a,b)=>b.sourceRecord.examRound-a.sourceRecord.examRound||a.sourceRecord.questionNumber-b.sourceRecord.questionNumber).slice(0,20):entries,maxScore=selected.reduce((sum,e)=>sum+(Number(e.sourceRecord.points)||0),0),active=officialCoverActive(),level=options.examLevel==='all'?'전체 유형':options.examLevel;
 return '<section class="official-cover-page"><header class="official-subhead"><button data-official-cover-back="true" aria-label="시험 목록으로">‹</button><div><small>시험 시작 전</small><h1>시험 안내</h1></div></header><article class="official-exam-cover"><p class="official-cover-name">한국사능력검정시험</p><h2>'+(options.examTab==='round'?'제'+options.examRound+'회':esc(officialEraInfo(options.examEra).name))+'</h2><span class="official-cover-level">'+esc(level)+'</span><h3>시험처럼 풀기</h3><p class="official-cover-facts">'+count+'문항 · '+(options.timed?OFFICIAL_EXAM_DURATION_MS/60000+'분':'시간 제한 없음')+'<br><strong>총점 '+maxScore+'점</strong></p><ul><li>제출 전까지 답안을 수정할 수 있어요.</li><li>시험 중 정답과 해설은 표시되지 않아요.</li>'+(options.timed?'<li>시간이 끝나면 자동 제출돼요.</li>':'')+'</ul>'+(active?'<div class="official-cover-active"><strong>진행 중인 시험이 있습니다.</strong><p>'+esc(active.examTab==='round'?'제'+active.examRound+'회 '+active.examLevel:officialEraInfo(active.examEra).name)+' · '+(active.index+1)+'번 문항</p><button class="primary" data-official-cover-resume="'+cover.token+'">이어하기</button><button class="secondary" data-official-cover-new="'+cover.token+'">새로 시작하기</button></div>':'<button class="primary official-cover-start" data-official-cover-start="'+cover.token+'">시험 시작</button>')+'</article></section>';
}
function beginOfficialCover(token,replace=false){
 const cover=officialExamCover;if(!cover||officialExamView!=='cover'||cover.token!==String(token)||officialCoverStarting)return;
 if(officialCoverActive()&&!replace){modal={type:'official-cover-replace',token:cover.token};render();return}
 officialCoverStarting=true;officialExamCover=null;
 startOfficialSession(cover.entries,'exam',{...cover.options,startImmediately:true});
 if(officialTimedSession())beginOrResumeOfficialTimer();
 globalThis.APP_ROUTE?.push('exam-library');
}

function startOfficialSession(entries,mode,options={}){
 const sessionTab=options.examTab||officialExamTab;let selected=[...entries].filter((entry,index,items)=>entry&&items.findIndex(item=>item.canonicalQuestionId===entry.canonicalQuestionId)===index),startId=options.startQuestionId;
 if(mode==='learn'&&startId){const startIndex=selected.findIndex(entry=>entry.canonicalQuestionId===startId);if(startIndex>=0)selected=options.single?[selected[startIndex]]:selected.slice(startIndex)}
 if(mode==='exam'&&sessionTab==='era')selected=selected.slice().sort((a,b)=>b.sourceRecord.examRound-a.sourceRecord.examRound||a.sourceRecord.questionNumber-b.sourceRecord.questionNumber).slice(0,20);
 if(!selected.length)return;officialResultAnalysisScope='attempt';officialResultSelectedEra=null;
 if(mode==='learn')suspendOfficialActiveSession();else{cancelOfficialAutoAdvance();stopOfficialTimer();clearOfficialStoredSession();officialSuspendedSession=null}officialSubmitting=false;
 const timed=mode==='exam'&&(options.timed??sessionTab==='round'),now=Date.now();
 officialExamSession={attemptId:mode==='exam'?officialAttemptId():null,mode,entries:selected,index:0,answers:{},feedback:{},graded:null,reviewQuestionId:null,timed,examTab:sessionTab,examEra:sessionTab==='era'?(options.examEra||officialExamEra):null,examRound:sessionTab==='round'?(Number(options.examRound)||officialExamRound):null,examLevel:options.examLevel||officialExamLevel,startedAtMs:mode==='exam'&&(!timed||options.startImmediately)?now:null,endTimeMs:timed&&options.startImmediately?now+OFFICIAL_EXAM_DURATION_MS:null,durationMs:timed?OFFICIAL_EXAM_DURATION_MS:null,remainingMs:timed?OFFICIAL_EXAM_DURATION_MS:null,timerState:timed?(options.startImmediately?OFFICIAL_TIMER_STATES.RUNNING:OFFICIAL_TIMER_STATES.READY):null,passedQuestionIds:[],initialPassComplete:false,unansweredNavigation:false,submissionReason:null,scope:options.scope||'selection',readOnlyResult:false,resultRecord:null};officialExamView='practice';officialResultReturnView='list';screen='exam-library';modal=null;
 if(mode==='exam'){persistOfficialSession();if(timed&&options.startImmediately)startOfficialTimer()}render();window.scrollTo(0,0);
}
function gradeOfficialSession(submissionReason='MANUAL'){
 const session=officialExamSession;if(!session||session.mode!=='exam'||session.graded||officialSubmitting)return;const existing=officialResultById(session.attemptId);if(existing){openOfficialResult(existing.attemptId);return}officialSubmitting=true;cancelOfficialAutoAdvance();stopOfficialTimer();modal=null;
 const remainingAtSubmission=officialTimedSession(session)?officialRemainingMs(session):null,graded={},questionResults=[];for(const entry of session.entries){const id=entry.canonicalQuestionId,answer=session.answers[id],submittedAnswer=Number.isInteger(answer)?answer:null;if(answer===undefined)session.answers[id]=null;const right=recordOfficialAttempt(id,submittedAnswer);graded[id]=right;questionResults.push(officialResultSnapshot(session,entry,submittedAnswer,right))}session.graded=graded;session.submissionReason=submissionReason;session.completedAtMs=Date.now();session.remainingMs=remainingAtSubmission;
 const score=questionResults.reduce((sum,item)=>sum+item.earnedPoints,0),maxScore=questionResults.reduce((sum,item)=>sum+item.points,0),correct=questionResults.filter(item=>item.right).length,answered=questionResults.filter(item=>!item.unanswered).length,wrong=questionResults.filter(item=>!item.unanswered&&!item.right).length,elapsedMs=officialTimedSession(session)?Math.max(0,session.durationMs-remainingAtSubmission):session.startedAtMs?Math.max(0,session.completedAtMs-session.startedAtMs):null,result={version:2,attemptId:session.attemptId,mode:'exam',timed:Boolean(session.timed),examTab:session.examTab,examEra:session.examEra,examRound:session.examRound,examLevel:session.examLevel,questionIds:session.entries.map(entry=>entry.canonicalQuestionId),answers:{...session.answers},graded:{...graded},questionResults,summary:{total:questionResults.length,answered,unanswered:questionResults.length-answered,correct,wrong,score,maxScore},startedAt:session.startedAtMs?new Date(session.startedAtMs).toISOString():null,completedAt:new Date(session.completedAtMs).toISOString(),elapsedMs,submissionReason,dataVersion:'official-result-v2'};
 clearOfficialStoredSession();meta().officialExamResults||(meta().officialExamResults=[]);if(!meta().officialExamResults.some(item=>item.attemptId===result.attemptId))meta().officialExamResults.push(result);meta().officialExamLastResultId=result.attemptId;session.resultRecord=result;session.readOnlyResult=false;officialResultAnalysisScope='attempt';officialResultSelectedEra=null;save();officialExamView='result';officialResultReturnView='list';screen='exam-library';globalThis.APP_ROUTE?.push(`exam-library/results/${encodeURIComponent(result.attemptId)}`);officialSubmitting=false;render();window.scrollTo(0,0);
}
function abandonOfficialSession(){cancelOfficialAutoAdvance();stopOfficialTimer();if(officialExamSession?.mode==='exam'&&!officialExamSession.graded)clearOfficialStoredSession();officialExamSession=null;officialSubmitting=false;save()}
function openOfficialResult(attemptId,{route=true}={}){
 const result=officialResultById(attemptId);if(!result)return false;suspendOfficialActiveSession();const entries=(result.questionIds||[]).map(id=>officialEntry(id)).filter(Boolean),graded={...(result.graded||{})},edition=officialResultEdition(result);for(const item of result.questionResults||[])if(!Object.hasOwn(graded,item.questionId)&&typeof item.right==='boolean')graded[item.questionId]=item.right;
 officialExamSession={attemptId:result.attemptId,mode:'exam',entries,index:0,answers:{...(result.answers||{})},feedback:{},graded,reviewQuestionId:null,timed:Boolean(result.timed),examTab:result.examTab||(edition?'round':'era'),examEra:result.examEra||null,examRound:result.examRound==null?(edition?.examRound??null):Number(result.examRound),examLevel:result.examLevel||edition?.examLevel||'all',startedAtMs:result.startedAt?Date.parse(result.startedAt):null,endTimeMs:null,durationMs:null,remainingMs:null,timerState:null,passedQuestionIds:[],initialPassComplete:true,submissionReason:result.submissionReason||null,completedAtMs:result.completedAt?Date.parse(result.completedAt):null,readOnlyResult:true,resultRecord:result};officialResultAnalysisScope='attempt';officialResultSelectedEra=null;officialExamView='result';officialResultReturnView='history';screen='exam-library';modal=null;if(route)globalThis.APP_ROUTE?.push(`exam-library/results/${encodeURIComponent(result.attemptId)}`);render();window.scrollTo(0,0);return true;
}
function beginOfficialRetake(){
 const previous=officialExamSession,result=previous?.resultRecord,entries=previous?.entries||[];if(previous?.mode!=='exam'||!previous.graded||!entries.length||officialSuspendedSession)return false;
 const tab=result?.examTab||(result?.examRound?'round':'era'),round=Number(result?.examRound||entries[0].sourceRecord.examRound),level=result?.examLevel||entries[0].sourceRecord.examLevel,era=result?.examEra||entries[0].primaryEra;
 officialExamTab=tab;if(tab==='round'){officialExamRound=round;officialExamLevel=level}else{officialExamEra=era;officialExamLevel=result?.examLevel||'all'}
 startOfficialSession(entries,'exam',{examTab:tab,examEra:era,examRound:round,examLevel:officialExamLevel,timed:Boolean(result?.timed),startImmediately:true,scope:'retake'});
 globalThis.APP_ROUTE?.push('exam-library');return true;
}
function restoreOfficialSession(){
 const stored=meta().officialExamActiveSession;if(!stored)return false;
 const entries=(stored.questionIds||[]).map(id=>officialEntry(id)).filter(Boolean),timed=stored.timed===true,legacy=timed&&!stored.timerState,timerState=timed?(legacy?OFFICIAL_TIMER_STATES.RUNNING:stored.timerState):null,validTimerState=!timed||Object.values(OFFICIAL_TIMER_STATES).includes(timerState),runningTimesValid=!timed||timerState!==OFFICIAL_TIMER_STATES.RUNNING||(Number.isFinite(Number(stored.endTimeMs))&&Number(stored.endTimeMs)>0),restingTimeValid=!timed||timerState===OFFICIAL_TIMER_STATES.RUNNING||Number.isFinite(Number(stored.remainingMs)),valid=stored.mode==='exam'&&entries.length===stored.questionIds?.length&&entries.length>0&&validTimerState&&runningTimesValid&&restingTimeValid&&(!timed||OFFICIAL_ROUND_LEVELS.includes(stored.examLevel)&&entries.every(entry=>entry.sourceRecord.examRound===Number(stored.examRound)&&entry.sourceRecord.examLevel===stored.examLevel));
 if(!valid){clearOfficialStoredSession();save();return false}
 const validIds=new Set(entries.map(entry=>entry.canonicalQuestionId)),answers=Object.fromEntries(Object.entries(stored.answers||{}).filter(([id,answer])=>validIds.has(id)&&Number.isInteger(answer))),passedQuestionIds=(stored.passedQuestionIds||[]).filter((id,index,items)=>validIds.has(id)&&!Number.isInteger(answers[id])&&items.indexOf(id)===index);
 officialExamTab=stored.examTab||(timed?'round':'era');if(officialExamTab==='round'){officialExamRound=Number(stored.examRound);officialExamLevel=stored.examLevel}else{officialExamEra=stored.examEra||entries[0].primaryEra;officialExamLevel=stored.examLevel||'all'}officialExamSession={attemptId:stored.attemptId||officialAttemptId(),mode:'exam',entries,index:Math.max(0,Math.min(entries.length-1,Number(stored.index)||0)),answers,feedback:{},graded:null,reviewQuestionId:null,timed,examTab:officialExamTab,examEra:stored.examEra||null,examRound:stored.examRound==null?null:Number(stored.examRound),examLevel:stored.examLevel||'all',startedAtMs:stored.startedAtMs==null?null:Number(stored.startedAtMs),endTimeMs:timed&&timerState===OFFICIAL_TIMER_STATES.RUNNING?Number(stored.endTimeMs):null,durationMs:timed?(Number(stored.durationMs)||OFFICIAL_EXAM_DURATION_MS):null,remainingMs:timed?(timerState===OFFICIAL_TIMER_STATES.RUNNING?Math.max(0,Number(stored.endTimeMs)-Date.now()):Math.max(0,Number(stored.remainingMs))):null,timerState,passedQuestionIds,initialPassComplete:Boolean(stored.initialPassComplete),unansweredNavigation:Boolean(stored.unansweredNavigation),submissionReason:null,readOnlyResult:false,resultRecord:null};officialExamView='practice';screen='exam-library';
 if(timed&&timerState===OFFICIAL_TIMER_STATES.RUNNING){if(officialRemainingMs()<=0)gradeOfficialSession('TIME_EXPIRED');else startOfficialTimer()}return true;
}
document.addEventListener('click',event=>{
 if(Date.now()<officialSwipeClickUntil&&(event.target?.closest?.('[data-official-question-stage]')||event.target?.closest?.('[data-official-review-surface]')&&!event.target?.closest?.('[data-official-review],[data-official-review-back]'))){event.preventDefault();event.stopImmediatePropagation();return}
 if(event.target?.dataset?.officialQuestionListClose==='overlay'&&modal?.type==='official-question-sheet'){modal=null;render();return}
 const button=event.target.closest('button');if(!button||button.disabled)return;const data=button.dataset;
 if(data.officialWrongRetry){event.stopImmediatePropagation();const entries=editorialWrongQuestions().filter(q=>officialLearningRecord(q).lastCorrect===false).map(q=>officialEntry(q)).filter(Boolean);if(entries.length)startOfficialSession(entries,'learn',{scope:'wrong-only'});return}
 if(data.officialWeakEra){event.stopImmediatePropagation();wrongEra=data.officialWeakEra;wrongChapter='all';wrongConcept='all';wrongFilter='official';studyTab='review';navigate('study');return}
 if(data.officialExplanationsRetry){event.stopImmediatePropagation();officialChoicePayloadState='idle';officialChoicePayloadError='';ensureOfficialChoiceExplanations();render();return}
 if(data.officialImageOpen){event.stopImmediatePropagation();const entry=officialEntry(data.officialImageOpen);if(!entry||!officialDetailImage(entry))return;officialImageReturnFocusId=entry.canonicalQuestionId;modal={type:'official-image',questionId:entry.canonicalQuestionId,zoomed:false};render();return}
 if(data.officialImageZoom){event.stopImmediatePropagation();if(modal?.type!=='official-image')return;modal.zoomed=!modal.zoomed;render();return}
 if(data.officialImageClose){event.stopImmediatePropagation();if(modal?.type!=='official-image')return;const returnId=officialImageReturnFocusId;officialImageReturnFocusId=null;modal=null;render();if(returnId)setTimeout(()=>document.querySelector(`[data-official-image-open="${returnId}"]`)?.focus(),0);return}
 if(data.nav==='exam-library'||data.nav==='association'){event.stopImmediatePropagation();librarySession=null;if(data.nav==='exam-library'){if(officialSuspendedSession){resumeOfficialActiveSession();return}if(officialExamSession?.mode==='exam'&&!officialExamSession.graded)officialExamView='practice';else{officialExamTab='round';officialExamLevel='심화';officialExamView='home';officialExamSession=null}}else{associationDetailId=null;associationRecall=null;associationExpandedSteps=new Set()}screen=data.nav;modal=null;if(data.nav==='exam-library')globalThis.APP_ROUTE?.push('exam-library');render();window.scrollTo(0,0);return}
 if(data.officialTab){event.stopImmediatePropagation();officialExamTab=data.officialTab;officialExamView='home';officialExamLevel=data.officialTab==='round'?'심화':'all';render();return}
 if(data.officialRoundLevel){event.stopImmediatePropagation();if(!OFFICIAL_ROUND_FILTERS.includes(data.officialRoundLevel))return;officialExamLevel=data.officialRoundLevel;render();return}
 if(data.officialEra){event.stopImmediatePropagation();officialExamTab='era';officialExamEra=data.officialEra;officialExamLevel='all';officialExamView='list';globalThis.APP_ROUTE?.push('exam-library/list/era/'+encodeURIComponent(officialExamEra)+'/'+encodeURIComponent(officialExamLevel));render();window.scrollTo(0,0);return}
 if(data.officialRound){event.stopImmediatePropagation();officialExamTab='round';officialExamRound=Number(data.officialRound);officialExamLevel=data.officialEditionLevel||'all';officialExamView='list';globalThis.APP_ROUTE?.push('exam-library/list/round/'+officialExamRound+'/'+encodeURIComponent(officialExamLevel));render();window.scrollTo(0,0);return}
 if(data.officialLevel){event.stopImmediatePropagation();officialExamLevel=data.officialLevel;render();return}
 if(data.officialBack){event.stopImmediatePropagation();officialExamSession=null;officialExamView=data.officialBack==='home'?'home':'list';globalThis.APP_ROUTE?.push('exam-library');render();window.scrollTo(0,0);return}
 if(data.officialCoverBack){event.stopImmediatePropagation();officialExamCover=null;officialExamView='list';modal=null;globalThis.APP_ROUTE?.push('exam-library/list/'+officialExamTab+'/'+encodeURIComponent(officialExamTab==='round'?officialExamRound:officialExamEra)+'/'+encodeURIComponent(officialExamLevel));render();return}
 if(data.officialCoverResume){event.stopImmediatePropagation();if(officialExamCover?.token!==data.officialCoverResume)return;officialExamCover=null;resumeOfficialActiveSession();return}
 if(data.officialCoverNew){event.stopImmediatePropagation();beginOfficialCover(data.officialCoverNew);return}
 if(data.officialCoverReplace){event.stopImmediatePropagation();if(modal?.type!=='official-cover-replace')return;beginOfficialCover(data.officialCoverReplace,true);return}
 if(data.officialCoverStart){event.stopImmediatePropagation();button.disabled=true;beginOfficialCover(data.officialCoverStart);return}
 if(data.officialStart){event.stopImmediatePropagation();if(data.officialStart==='exam')openOfficialExamCover(officialSelectionEntries());else startOfficialSession(officialSelectionEntries(),data.officialStart);return}
 if(data.officialRoundStart){event.stopImmediatePropagation();officialExamTab='round';officialExamRound=Number(data.officialRoundStart);officialExamLevel=data.officialEditionLevel||'심화';const entries=officialEntriesForRound(officialExamRound,officialExamLevel);if(entries.length)openOfficialExamCover(entries,{examTab:'round',examRound:officialExamRound,examLevel:officialExamLevel,timed:true});return}
 if(data.officialHomeResume){event.stopImmediatePropagation();if(resumeOfficialActiveSession())return;if(officialExamSession?.mode==='exam'&&!officialExamSession.graded){officialExamView='practice';screen='exam-library';globalThis.APP_ROUTE?.push('exam-library');render();window.scrollTo(0,0);return}restoreOfficialSession();if(officialExamSession?.mode==='exam'&&!officialExamSession.graded){screen='exam-library';globalThis.APP_ROUTE?.push('exam-library');render();window.scrollTo(0,0)}return}
 if(data.officialResultsList){event.stopImmediatePropagation();suspendOfficialActiveSession();officialExamSession=null;officialExamView='history';screen='exam-library';modal=null;globalThis.APP_ROUTE?.push('exam-library/results');render();window.scrollTo(0,0);return}
 if(data.officialResultsBack){event.stopImmediatePropagation();if(resumeOfficialActiveSession())return;officialExamSession=null;officialExamView='home';screen='exam-library';modal=null;globalThis.APP_ROUTE?.push('exam-library');render();window.scrollTo(0,0);return}
 if(data.officialResumeActive){event.stopImmediatePropagation();resumeOfficialActiveSession();return}
 if(data.officialResultOpen){event.stopImmediatePropagation();openOfficialResult(data.officialResultOpen);return}
 if(data.officialResultHome){event.stopImmediatePropagation();if(resumeOfficialActiveSession())return;officialExamSession=null;officialExamView='home';officialExamTab='round';officialExamLevel=['심화','기본'].includes(officialExamLevel)?officialExamLevel:'심화';screen='exam-library';modal=null;globalThis.APP_ROUTE?.push('exam-library');render();window.scrollTo(0,0);return}
 if(data.officialAnalysisScope){event.stopImmediatePropagation();if(!['attempt','cumulative'].includes(data.officialAnalysisScope))return;officialResultAnalysisScope=data.officialAnalysisScope;officialResultSelectedEra=null;render();return}
 if(data.officialAnalysisEra){event.stopImmediatePropagation();if(!OFFICIAL_ANALYSIS_ERAS.some(era=>era.id===data.officialAnalysisEra))return;officialResultSelectedEra=data.officialAnalysisEra;render();return}
 if(data.officialTimerStart){event.stopImmediatePropagation();beginOrResumeOfficialTimer();return}
 if(data.officialTimerPause){event.stopImmediatePropagation();pauseOfficialTimer();return}
 if(data.officialTimerRestart){event.stopImmediatePropagation();if(!officialTimedSession())return;modal={type:'official-restart-confirm'};render();return}
 if(data.officialRestartCancel){event.stopImmediatePropagation();modal=null;render();return}
 if(data.officialRestartConfirm){event.stopImmediatePropagation();resetOfficialAttempt();return}
 if(data.officialRetakeCancel){event.stopImmediatePropagation();if(modal?.type!=='official-retake-confirm')return;modal=null;render();return}
 if(data.officialRetakeConfirm){event.stopImmediatePropagation();if(modal?.type!=='official-retake-confirm')return;beginOfficialRetake();return}
 if(data.officialQuestionList){event.stopImmediatePropagation();if(officialExamSession?.mode!=='exam'||officialExamView!=='practice')return;cancelOfficialAutoAdvance();modal={type:'official-question-sheet'};render();return}
 if(data.officialQuestionListClose){event.stopImmediatePropagation();if(modal?.type!=='official-question-sheet')return;modal=null;render();return}
 if(data.officialQuestionJump!==undefined){event.stopImmediatePropagation();if(modal?.type!=='official-question-sheet'||!officialExamInteractionAvailable())return;const target=Number(data.officialQuestionJump);modal=null;if(target===officialExamSession.index)render();else officialGoToQuestionIndex(target,target>officialExamSession.index?'next':'previous');return}
 if(data.officialSubmitCancel){event.stopImmediatePropagation();if(officialExamSession)officialExamSession.unansweredNavigation=false;modal=null;persistOfficialSession();render();return}
 if(data.officialSubmitUnanswered){event.stopImmediatePropagation();officialMoveToFirstUnanswered();return}
 if(data.officialSubmitConfirm){event.stopImmediatePropagation();if(!officialExamInteractionAvailable())return;gradeOfficialSession('MANUAL');return}
 if(data.officialReview){event.stopImmediatePropagation();if(!officialExamSession?.graded)return;const currentIndex=officialExamSession.entries.findIndex(entry=>entry.canonicalQuestionId===officialExamSession.reviewQuestionId),targetIndex=officialExamSession.entries.findIndex(entry=>entry.canonicalQuestionId===data.officialReview);officialExamSlideDirection=officialExamView==='review'&&targetIndex!==currentIndex?(targetIndex>currentIndex?'next':'previous'):'none';officialExamSession.reviewQuestionId=data.officialReview;officialExamView='review';render();window.scrollTo(0,0);return}
 if(data.officialReviewBack){event.stopImmediatePropagation();officialExamView='result';officialExamSlideDirection='none';render();window.scrollTo(0,0);return}
 if(data.officialStudyFrom){event.stopImmediatePropagation();const entries=officialSelectionEntries(),entry=officialEntry(data.officialStudyFrom);if(entry)startOfficialSession(entries,'learn',{startQuestionId:entry.canonicalQuestionId,scope:'selection-from-list'});return}
 if(data.officialSingle){event.stopImmediatePropagation();const entry=officialEntry(data.officialSingle);if(entry)startOfficialSession([entry],'learn',{startQuestionId:entry.canonicalQuestionId,single:true,scope:'single-review'});return}
 if(data.officialPick!==undefined){event.stopImmediatePropagation();if(!officialExamInteractionAvailable())return;const entry=officialSessionQuestion();if(!entry||officialExamSession.mode==='learn'&&Object.hasOwn(officialExamSession.feedback,entry.canonicalQuestionId))return;const picked=Number(data.officialPick),id=entry.canonicalQuestionId;if(officialExamSession.mode==='exam'){if(officialExamChoiceLocked&&button.isConnected!==undefined)return;officialExamSession.answers[id]=picked;officialExamSession.passedQuestionIds=officialPassedIds(officialExamSession);persistOfficialSession();scheduleOfficialAutoAdvance(id,officialExamSession.index)}else if(officialExamSession.answers[id]===picked)delete officialExamSession.answers[id];else officialExamSession.answers[id]=picked;render();return}
 if(data.officialSubmit){event.stopImmediatePropagation();const entry=officialSessionQuestion(),id=entry?.canonicalQuestionId,answer=officialExamSession?.answers[id];if(!entry||answer===undefined||Object.hasOwn(officialExamSession.feedback,id))return;officialExamSession.feedback[id]=recordOfficialAttempt(id,answer);save();render();return}
 if(data.officialPrevious){event.stopImmediatePropagation();officialPreviousQuestion();return}
 if(data.officialForward){event.stopImmediatePropagation();if(officialExamSession?.mode!=='exam'||!officialExamInteractionAvailable())return;const session=officialExamSession;if(session.index<session.entries.length-1)officialGoToQuestionIndex(session.index+1,'next');else requestOfficialSubmission();return}
 if(data.officialPass){event.stopImmediatePropagation();officialAdvanceQuestion({pass:true});return}
 if(data.officialRequestSubmit){event.stopImmediatePropagation();requestOfficialSubmission();return}
 if(data.officialNext){event.stopImmediatePropagation();if(officialExamSession.mode==='exam'){officialAdvanceQuestion();return}const id=officialSessionQuestion()?.canonicalQuestionId;if(!id||!Object.hasOwn(officialExamSession.feedback,id))return;if(officialExamSession.index===officialExamSession.entries.length-1){officialExamSession.graded={...officialExamSession.feedback};officialExamView='result';render();window.scrollTo(0,0);return}officialExamSession.index++;render();window.scrollTo(0,0);return}
 if(data.officialExit){event.stopImmediatePropagation();abandonOfficialSession();officialExamView='list';render();window.scrollTo(0,0);return}
 if(data.officialRetry){event.stopImmediatePropagation();const wrong=officialExamSession.entries.filter(entry=>officialExamSession.graded?.[entry.canonicalQuestionId]===false);if(wrong.length)startOfficialSession(wrong,'learn',{scope:'wrong-only'});return}
 if(data.officialRetake){event.stopImmediatePropagation();if(officialExamSession?.mode!=='exam'||!officialExamSession.graded||officialSuspendedSession)return;modal={type:'official-retake-confirm'};render();return}
 if(data.associationEra){event.stopImmediatePropagation();associationEra=data.associationEra;render();return}
 if(data.associationOpen||data.associationFor){event.stopImmediatePropagation();associationDetailId=data.associationOpen||data.associationFor;associationRecall=null;associationExpandedSteps=new Set();screen='association';render();window.scrollTo(0,0);return}
 if(data.associationStep!==undefined){event.stopImmediatePropagation();const key=`${associationDetailId}:${Number(data.associationStep)}`;if(associationExpandedSteps.has(key))associationExpandedSteps.delete(key);else associationExpandedSteps.add(key);const row=button.closest?.('.association-step'),panel=row?.querySelector?.('.association-step-panel'),open=associationExpandedSteps.has(key);if(row&&panel){row.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open));panel.setAttribute('aria-hidden',String(!open))}else render();return}
 if(data.associationBack){event.stopImmediatePropagation();associationDetailId=null;associationRecall=null;associationExpandedSteps=new Set();render();return}
 if(data.associationRecall){event.stopImmediatePropagation();const memory=ASSOCIATION_MEMORIES.find(item=>item.id===data.associationRecall);if(!memory)return;setAssociationStatus(memory.id,'LEARNING');associationRecall=newAssociationRecall(memory);save();render();return}
 if(data.associationAnswer){event.stopImmediatePropagation();const memory=ASSOCIATION_MEMORIES.find(item=>item.id===associationRecall?.memoryId);if(!memory||associationRecall.answered)return;const correct=associationRecallItems(memory)[associationRecall.index];associationRecall.selected=data.associationAnswer;associationRecall.answered=true;if(data.associationAnswer!==correct){associationRecall.allCorrect=false;setAssociationStatus(memory.id,'LEARNING')}save();render();return}
 if(data.associationNext){event.stopImmediatePropagation();const memory=ASSOCIATION_MEMORIES.find(item=>item.id===associationRecall?.memoryId);if(!memory||!associationRecall.answered)return;if(associationRecall.index>=associationRecallItems(memory).length-1){setAssociationStatus(memory.id,associationRecall.allCorrect?'MEMORIZED':'LEARNING');const completed=associationRecall.allCorrect;associationRecall=null;save();toast(completed?'암기 완료로 기록했습니다.':'복습 후 다시 도전해 보세요.');render()}else{associationRecall=newAssociationRecall(memory,associationRecall.index+1,associationRecall.allCorrect);render();window.scrollTo(0,0)}return}
 if(data.associationCancel){event.stopImmediatePropagation();associationRecall=null;render();return}
},true);
// Delegate through the shared stage so choices, media and the spaces between them behave alike.
function officialExamSwipeBlocked(target){
 return !target?.closest?.('[data-official-question-stage]')||Boolean(target.closest('button:not([data-official-pick]):not(.official-content-image),a,input,select,textarea,.official-image-modal,.official-question-sheet'));
}
function officialReviewSwipeBlocked(target){
 return !target?.closest?.('[data-official-review-surface]')||Boolean(target.closest('a,input,select,textarea,.official-image-modal,.official-question-sheet,[data-official-review],[data-official-review-back]'));
}
document.addEventListener('touchstart',event=>{
 officialExamSwipeGesture=null;
 const review=officialExamView==='review',practice=officialExamView==='practice';if((!review&&!practice)||!officialExamSession||modal||event.touches?.length!==1||(review?officialReviewSwipeBlocked(event.target):officialExamSwipeBlocked(event.target)))return;
 const touch=event.touches[0];
 if(Date.now()<officialSwipeLockedUntil||touch.clientX<24||touch.clientX>window.innerWidth-24)return;
 officialSwipeClickUntil=0;
 const index=review?officialExamSession.entries.findIndex(entry=>entry.canonicalQuestionId===officialExamSession.reviewQuestionId):officialExamSession.index;if(index<0)return;
 officialExamSwipeGesture={x:touch.clientX,y:touch.clientY,index,session:officialExamSession,view:officialExamView,horizontal:false};
},{passive:true});
document.addEventListener('touchmove',event=>{
 const gesture=officialExamSwipeGesture;
 if(!gesture)return;
 if(event.touches?.length!==1||modal){officialExamSwipeGesture=null;return}
 const touch=event.touches[0],dx=touch.clientX-gesture.x,dy=touch.clientY-gesture.y;
 if(!gesture.horizontal&&Math.abs(dy)>12&&Math.abs(dy)>=Math.abs(dx)){officialExamSwipeGesture=null;return}
 if(Math.abs(dx)>18&&Math.abs(dx)>Math.abs(dy)*1.5){
  gesture.horizontal=true;officialSwipeClickUntil=Date.now()+600;
  if(event.cancelable)event.preventDefault();
 }
},{passive:false});
document.addEventListener('touchend',event=>{
 const gesture=officialExamSwipeGesture,touch=event.changedTouches?.[0];officialExamSwipeGesture=null;
 if(!gesture||!touch||!gesture.horizontal)return;
 if(event.cancelable)event.preventDefault();
 officialSwipeClickUntil=Date.now()+600;
 const session=officialExamSession,dx=touch.clientX-gesture.x,dy=touch.clientY-gesture.y;
 const review=gesture.view==='review',index=review?session?.entries.findIndex(entry=>entry.canonicalQuestionId===session.reviewQuestionId):session?.index;
 if(modal||session!==gesture.session||officialExamView!==gesture.view||(!review&&!officialExamInteractionAvailable())||index!==gesture.index||Math.abs(dx)<58||Math.abs(dx)<=Math.abs(dy)*1.5)return;
 const next=index+(dx<0?1:-1);
 if(next<0||next>=session.entries.length)return;
 officialSwipeLockedUntil=Date.now()+260;
 if(review){officialExamSlideDirection=dx<0?'next':'previous';session.reviewQuestionId=session.entries[next].canonicalQuestionId;render();window.scrollTo(0,0)}else officialGoToQuestionIndex(next,dx<0?'next':'previous');
},{passive:false});
document.addEventListener('touchcancel',()=>{officialExamSwipeGesture=null},{passive:true});
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
 const coverMatch=/^exam-library\/(cover|list)\/(round|era)\/([^/]+)\/([^/]+)$/.exec(normalized);if(coverMatch){let value,level;try{value=decodeURIComponent(coverMatch[3]);level=decodeURIComponent(coverMatch[4])}catch{return false}const tab=coverMatch[2];if(tab==='round'&&!OFFICIAL_ROUND_LEVELS.includes(level))return false;if(tab==='era'&&!OFFICIAL_ERA_TAXONOMY.some(e=>e.id===value))return false;officialExamTab=tab;officialExamLevel=level;if(tab==='round')officialExamRound=Number(value);else officialExamEra=value;const entries=officialSelectionEntries();if(!entries.length)return false;if(coverMatch[1]==='cover')return openOfficialExamCover(entries,{},false);officialExamCover=null;suspendOfficialActiveSession();officialExamSession=null;officialExamView='list';screen='exam-library';modal=null;return true}
 if(normalized==='exam-library/results'){suspendOfficialActiveSession();officialExamSession=null;officialExamView='history';screen='exam-library';modal=null;return true}
 const match=/^exam-library\/results\/([^/]+)$/.exec(normalized);if(match){let attemptId=match[1];try{attemptId=decodeURIComponent(attemptId)}catch{}return openOfficialResult(attemptId,{route:false})}
 if(normalized==='exam-library'){if(officialSuspendedSession){officialExamSession=officialSuspendedSession;officialSuspendedSession=null;officialExamView='practice';if(officialTimedSession()&&officialTimerState()===OFFICIAL_TIMER_STATES.RUNNING)startOfficialTimer()}else if(officialExamSession?.mode==='exam'&&!officialExamSession.graded)officialExamView='practice';else{officialExamTab='round';officialExamLevel='심화';officialExamSession=null;officialExamView='home'}screen='exam-library';modal=null;return true}
 return false;
}
Object.assign(globalThis.OFFICIAL_EXAM_UI,{applyRoute:applyOfficialExamRoute,openResult:attemptId=>openOfficialResult(attemptId),results:()=>JSON.parse(JSON.stringify(officialExamResults())),startLearning:(questionIds,options={})=>startOfficialSession((questionIds||[]).map(id=>officialEntry(id)).filter(Boolean),'learn',options),startExam:(questionIds,options={})=>startOfficialSession((questionIds||[]).map(id=>officialEntry(id)).filter(Boolean),'exam',options),snapshot:()=>officialExamSession?JSON.parse(JSON.stringify({attemptId:officialExamSession.attemptId,mode:officialExamSession.mode,questionIds:officialExamSession.entries.map(entry=>entry.canonicalQuestionId),index:officialExamSession.index,answers:officialExamSession.answers,feedback:officialExamSession.feedback,graded:officialExamSession.graded,scope:officialExamSession.scope,view:officialExamView,readOnlyResult:officialExamSession.readOnlyResult,unansweredNavigation:Boolean(officialExamSession.unansweredNavigation),answered:officialAnsweredIds(officialExamSession).size,unanswered:officialUnansweredIndexes(officialExamSession).length})):null,autoAdvanceMs:OFFICIAL_EXAM_AUTO_ADVANCE_MS});
globalThis.EXAM_MEMORY_UI_READY=true;
// View adapter for the Rev.7 presentation layer. Runtime grading and persistence stay here.
globalThis.REV7_EXAM_VIEWS={catalog:OFFICIAL_EXAM_CATALOG,eras:OFFICIAL_ERA_TAXONOMY,entry:officialEntry,question:officialQuestion,record:officialLearningRecord,eraInfo:officialEraInfo,results:officialExamResults,recordsPage:officialRecordsPage,start:startOfficialSession};
Object.assign(globalThis.REV7_EXAM_VIEWS,{state:()=>({view:officialExamView,tab:officialExamTab,level:officialExamLevel,session:officialExamSession,cover:officialExamCover}),editions:officialEditions,entriesForRound:officialEntriesForRound,editionActivity:officialEditionActivity,openCover:openOfficialExamCover,coverActive:officialCoverActive,canRetry:()=>!officialSuspendedSession,statistic:officialStatisticMarkup,summary:officialResultSummary,certification:officialCertification,analysis:officialResultEraAnalysis,timerMarkup:officialTimerMarkup,duration:officialResultDuration,date:officialResultDate,weakness:officialWeaknessSection,setHome:view=>{officialExamHome=view},home:()=>officialExamHome,setCover:view=>{officialCoverPage=view},setResult:view=>{officialResultPage=view},result:()=>officialResultPage,setHistory:view=>{officialExamHistoryPage=view},history:()=>officialExamHistoryPage,review:()=>officialReviewPage,setReview:view=>{officialReviewPage=view},storedResult:officialStoredQuestionResult,paper:officialPaperFigure,choiceExplanations:officialChoiceExplanationBlock,visibleExplanation:officialVisibleExplanation,answerLabel:officialAnswerLabel,setPractice:view=>{officialPracticePage=view},practice:()=>officialPracticePage,pause:pauseOfficialTimer,leaveToHome:()=>{suspendOfficialActiveSession();officialExamView='home';screen='exam-library';modal=null;render();globalThis.APP_ROUTE?.push('exam-library')},resume:()=>{if(resumeOfficialActiveSession())return;if(!officialExamSession)restoreOfficialSession();if(officialExamSession){officialExamView='practice';screen='exam-library';modal=null;render();globalThis.APP_ROUTE?.push('exam-library')}}});
normalizeOfficialExamResults();
restoreOfficialSession();
globalThis.REV7_EXAM_VIEWS.formatTimer=officialFormatDuration;
render();
}


