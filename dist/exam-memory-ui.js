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
 const candidates=[canonical,...aliases.map(aliasId=>QUESTIONS.find(item=>item.questionId===aliasId)).filter(Boolean)];
 const canonicalStored=officialStoredExplanation(canonical),reusable=candidates.map(question=>({question,stored:officialStoredExplanation(question)})).find(item=>item.stored),generated=OFFICIAL_EXPLANATION_BY_SOURCE_ID.get(source.officialQuestionId);
 const resolved=canonicalStored?.value||reusable?.stored?.value||generated?.explanation||'';
 officialExplanationStats.total++;
 if(canonicalStored)officialExplanationStats.preexisting++;
 else if(reusable?.stored){officialExplanationStats.restoredMappings++}
 else if(generated?.explanation){officialExplanationStats.supplemented++}
 if(resolved)officialExplanationStats.covered++;else officialExplanationStats.missing++;
 for(const aliasId of aliases){
  const question=QUESTIONS.find(item=>item.questionId===aliasId);if(!question)continue;
  if(officialExplanationPlaceholder(question.explanation))question.explanation=resolved;
  Object.assign(question,{officialQuestionId:canonicalQuestionId,examRound:source.examRound,examYear:source.examYear,examLevel:source.examLevel,questionNumber:source.questionNumber,answer:source.answer===null?0:source.answer,answerLabel:source.answerLabel,acceptedAnswers:source.acceptedAnswers?[...source.acceptedAnswers]:[source.answer],points:source.points,questionImage:source.questionImage,sourceQuestionImage:source.questionImage,sourceFile:source.sourcePdf,answerFile:source.answerPdf,sourcePdf:source.sourcePdf,answerPdf:source.answerPdf,sourcePage:source.sourcePage,primaryEra,concepts:[...(question.concepts||source.concepts||[])],isOfficial:true,sourceVerified:true,sourceStatus:'verified',sourceImageStatus:'verified',sourceImageReason:'',needsVerification:false,missingPdf:false,verificationNote:'첨부된 공식 문제지와 정답표 대조 완료'});
 }
 return {key,canonicalQuestionId,aliases,primaryEra,relatedEra:legacy?.relatedEra||[],needsVerification:false,verificationNote:'첨부된 공식 문제지와 정답표 대조 완료',libraryImage:source.questionImage,sourceRecord:source};
});
globalThis.OFFICIAL_EXAM_CATALOG=OFFICIAL_EXAM_CATALOG;
globalThis.OFFICIAL_EXPLANATION_COVERAGE={...officialExplanationStats};
globalThis.OFFICIAL_EXAM_IMPORT_STATS={canonicalQuestionCount:OFFICIAL_EXAM_CATALOG.length,existingMatchedQuestionCount:OFFICIAL_EXAM_CATALOG.filter(entry=>legacyExamEntries.has(entry.key)).length,newQuestionCount:OFFICIAL_EXAM_CATALOG.filter(entry=>!legacyExamEntries.has(entry.key)).length,mergedLegacyAliasCount:[...legacyExamEntries.values()].reduce((sum,entry)=>sum+Math.max(0,(entry.aliases||[]).length-1),0),imageConnectedCount:OFFICIAL_EXAM_CATALOG.filter(entry=>entry.libraryImage).length,answerConnectedCount:OFFICIAL_EXAM_CATALOG.filter(entry=>entry.sourceRecord.answer!==undefined).length,classifiedCount:OFFICIAL_EXAM_CATALOG.filter(entry=>entry.primaryEra).length};
globalThis.OFFICIAL_EXAM_RECOVERY_REPORT={legacyMissingPdfIds:[...LEGACY_MISSING_PDF_IDS],recoveredMissingPdfIds:LEGACY_MISSING_PDF_IDS.filter(id=>OFFICIAL_EXAM_CATALOG.some(entry=>entry.aliases.includes(id))),round70Advanced13:OFFICIAL_EXAM_CATALOG.find(entry=>entry.key==='70:심화:13')?.sourceRecord||null};
EXAM_LIBRARY_ENTRIES.splice(0,EXAM_LIBRARY_ENTRIES.length,...OFFICIAL_EXAM_CATALOG);
const OFFICIAL_ENTRY_BY_ID=new Map();
for(const entry of OFFICIAL_EXAM_CATALOG){OFFICIAL_ENTRY_BY_ID.set(entry.canonicalQuestionId,entry);for(const alias of entry.aliases)OFFICIAL_ENTRY_BY_ID.set(alias,entry)}
const officialEntry=value=>typeof value==='string'?OFFICIAL_ENTRY_BY_ID.get(value):OFFICIAL_ENTRY_BY_ID.get(value?.officialQuestionId||value?.questionId);
const officialQuestion=value=>{const entry=officialEntry(value);return entry&&QUESTIONS.find(question=>question.questionId===entry.canonicalQuestionId)};
const officialAnswerAccepted=(question,answer)=>Array.isArray(question?.acceptedAnswers)?question.acceptedAnswers.includes(answer):question?.answer===answer;
const officialAnswerLabel=question=>question?.answerLabel==='없음'?'모든 선택지':officialChoiceLabels[question?.answer]||String(question?.answerLabel||'');
const officialExplanation=question=>{const stored=officialStoredExplanation(question);if(!stored)throw new Error(`Missing official explanation: ${question?.questionId||'unknown'}`);return stored.value};
libraryStatus=()=> 'UNLOCKED';
libraryEligible=entry=>Boolean(entry&&!entry.needsVerification&&officialQuestion(entry.canonicalQuestionId)?.sourceQuestionImage);
libraryEntries=era=>OFFICIAL_EXAM_CATALOG.filter(entry=>entry.primaryEra===era&&libraryEligible(entry));

/* Merge legacy duplicate IDs once, then make all future attempts use one canonical ID. */
for(const entry of OFFICIAL_EXAM_CATALOG){
 const records=entry.aliases.filter(id=>id!==entry.canonicalQuestionId).map(id=>[id,meta().questionRecords[id]]).filter(([,record])=>record);
 for(const [alias,record] of records){
  const current=meta().questionRecords[entry.canonicalQuestionId]||{attempts:0,correctCount:0,everCorrect:false};
  meta().questionRecords[entry.canonicalQuestionId]={...current,...record,attempts:(current.attempts||0)+(record.attempts||0),correctCount:(current.correctCount||0)+(record.correctCount||0),everCorrect:Boolean(current.everCorrect||record.everCorrect)};
  delete meta().questionRecords[alias];
 }
}
meta().wrongQuestionIds=[...new Set((meta().wrongQuestionIds||[]).map(id=>officialEntry(id)?.canonicalQuestionId||id))];
meta().reviewedQuestionIds=[...new Set((meta().reviewedQuestionIds||[]).map(id=>officialEntry(id)?.canonicalQuestionId||id))];
meta().wrongAnswers=(meta().wrongAnswers||[]).map(item=>({...item,questionId:officialEntry(item.questionId)?.canonicalQuestionId||item.questionId}));
meta().learningEvents=(meta().learningEvents||[]).map(item=>({...item,questionId:officialEntry(item.questionId)?.canonicalQuestionId||item.questionId}));

const recordQuestionBeforeOfficialCatalog=recordQuestion;
recordQuestion=function(currentState,questionId,userAnswer){
 const entry=officialEntry(questionId);if(!entry)return recordQuestionBeforeOfficialCatalog(currentState,questionId,userAnswer);
 const question=officialQuestion(entry.canonicalQuestionId);if(!question)return false;
 const right=officialAnswerAccepted(question,userAnswer),originalAnswer=question.answer;
 question.answer=right?userAnswer:originalAnswer;
 let result;
 try{result=recordQuestionBeforeOfficialCatalog(currentState,entry.canonicalQuestionId,userAnswer)}finally{question.answer=originalAnswer}
 const record=currentState.meta.questionRecords[entry.canonicalQuestionId];if(record){record.solved=true;record.selectedAnswer=userAnswer;record.lastAttempt=new Date().toISOString()}
 return right;
};

const officialProgress=entries=>{const attempted=entries.filter(entry=>(meta().questionRecords[entry.canonicalQuestionId]?.attempts||0)>0).length;return {attempted,total:entries.length,percent:entries.length?Math.round(attempted/entries.length*100):0}};
const officialEntriesForEra=(era,level='all')=>OFFICIAL_EXAM_CATALOG.filter(entry=>entry.primaryEra===era&&(level==='all'||entry.sourceRecord.examLevel===level));
const officialEntriesForRound=(round,level='all')=>OFFICIAL_EXAM_CATALOG.filter(entry=>entry.sourceRecord.examRound===Number(round)&&(level==='all'||entry.sourceRecord.examLevel===level)).sort((a,b)=>a.sourceRecord.questionNumber-b.sourceRecord.questionNumber);
const officialRounds=()=>[...new Set(OFFICIAL_EXAM_CATALOG.map(entry=>entry.sourceRecord.examRound))].sort((a,b)=>b-a);
const officialEditions=()=>{const groups=new Map();for(const entry of OFFICIAL_EXAM_CATALOG){const key=entry.sourceRecord.examRound+':'+entry.sourceRecord.examLevel;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(entry)}return [...groups.values()].sort((a,b)=>b[0].sourceRecord.examRound-a[0].sourceRecord.examRound||(a[0].sourceRecord.examLevel==='심화'?-1:1))};
const examSourceLabel=entry=>`${entry.sourceRecord.examRound}회 ${entry.sourceRecord.examLevel} · ${entry.sourceRecord.questionNumber}번`;

let officialExamTab='era',officialExamView='home',officialExamEra='ancient',officialExamRound=officialRounds()[0]||79,officialExamLevel='all',officialExamSession=null;
function officialExamHome(){
 const tab='<div class="official-tabs" role="tablist">'+[['era','시대별'],['round','회차별']].map(([id,label])=>`<button data-official-tab="${id}" aria-selected="${officialExamTab===id}">${label}</button>`).join('')+'</div>';
 const cards=officialExamTab==='era'?OFFICIAL_ERA_TAXONOMY.map(era=>{const entries=officialEntriesForEra(era.id),progress=officialProgress(entries);return `<button class="official-card" data-official-era="${era.id}"><span class="open-pill">OPEN</span><h2>${era.name}</h2><p>${era.years}</p><small>실제 기출 ${entries.length}문항</small><div class="official-card-progress"><i style="width:${progress.percent}%"></i></div><b>${progress.attempted} / ${progress.total} · ${progress.percent}%</b></button>`}).join(''):officialEditions().map(entries=>{const source=entries[0].sourceRecord,progress=officialProgress(entries);return `<button class="official-card round" data-official-round="${source.examRound}" data-official-edition-level="${source.examLevel}"><span class="open-pill">OPEN</span><h2>제${source.examRound}회 · ${source.examLevel}</h2><p>${source.examYear}</p><small>실제 기출 ${entries.length}문항</small><div class="official-card-progress"><i style="width:${progress.percent}%"></i></div><b>진행 ${progress.attempted} / ${progress.total} · ${progress.percent}%</b></button>`}).join('');
 return `<section class="official-exams">${editorialHeader('기출문제','공식 문제지 그대로, 잠금 없이 학습')} ${tab}<div class="official-notice">등록이 완료된 공식 기출은 모두 바로 풀 수 있습니다. 스토리 진행도와 기출 이용 여부는 분리되어 있습니다.</div><div class="official-grid">${cards}</div></section>`;
}
function officialSelectionEntries(){return officialExamTab==='era'?officialEntriesForEra(officialExamEra,officialExamLevel):officialEntriesForRound(officialExamRound,officialExamLevel)}
function officialExamListPage(){
 const entries=officialSelectionEntries(),title=officialExamTab==='era'?officialEraInfo(officialExamEra).name:`제${officialExamRound}회 · ${officialExamLevel}`,progress=officialProgress(entries);
 const filters=officialExamTab==='era'?`<div class="library-filters">${[['all','전체'],['심화','심화'],['기본','기본']].map(([id,label])=>`<button data-official-level="${id}" aria-pressed="${officialExamLevel===id}">${label}</button>`).join('')}</div>`:`<div class="library-filters"><button aria-pressed="true">${officialExamLevel}</button></div>`;
 return `<section class="official-exams"><header class="official-subhead"><button data-official-back="home" aria-label="기출 메인으로">‹</button><div><small>${officialExamTab==='era'?'시대별 기출':'회차별 기출'}</small><h1>${title}</h1></div></header><div class="library-summary"><div><small>전체</small><b>${progress.total}</b></div><div><small>푼 문제</small><b>${progress.attempted}</b></div><div><small>진행률</small><b>${progress.percent}%</b></div></div>${filters}<div class="official-mode-actions"><button class="primary" data-official-start="learn" ${entries.length?'':'disabled'}>학습하며 풀기</button><button class="secondary" data-official-start="exam" ${entries.length?'':'disabled'}>시험처럼 풀기</button></div><p class="mode-description">학습 모드는 답을 고른 즉시 정답과 해설을 확인합니다. 시험 모드는 ${officialExamTab==='round'?'회차 전체':'최근 문항 최대 20개'}를 모두 푼 뒤 채점합니다.</p><div class="official-question-list">${entries.map(entry=>{const record=meta().questionRecords[entry.canonicalQuestionId];return `<button data-official-single="${entry.canonicalQuestionId}"><img loading="lazy" src="${esc(entry.libraryImage)}" alt="${examSourceLabel(entry)} 원문"><span><small>${examSourceLabel(entry)}</small><b>${officialEraInfo(entry.primaryEra).name}</b><em class="${record?.lastCorrect?'right':record?'wrong':''}">${record?(record.lastCorrect?'최근 정답':'최근 오답'):'미풀이'}</em></span><span>›</span></button>`}).join('')}</div></section>`;
}
function officialSessionQuestion(){return officialExamSession?.entries[officialExamSession.index]}
function recordOfficialAttempt(questionId,answer){
 const savedRun=JSON.parse(JSON.stringify(state.run)),savedMain=state.mainRun?JSON.parse(JSON.stringify(state.mainRun)):state.mainRun;let right=false;
 try{right=recordQuestion(state,questionId,answer)}finally{state.run=savedRun;state.mainRun=savedMain}
 return right;
}
function officialFeedbackBlock(question,right,selectedAnswer){
 const memories=memoryForQuestion(question),selected=selectedAnswer===undefined?'선택하지 않음':officialChoiceLabels[selectedAnswer]||String(selectedAnswer+1);
 return `<div class="official-feedback ${right?'correct':'wrong'}" role="status"><h2>${right?'✓ 정답입니다.':'✕ 오답입니다.'}</h2><p class="official-selected-answer">내가 선택한 답 <b>${selected}</b></p><p class="official-answer-line"><b>정답 ${officialAnswerLabel(question)}</b></p><div class="official-explanation"><h3>[해설]</h3><p>${esc(officialExplanation(question))}</p>${memories.length?`<button class="text-btn" data-association-for="${memories[0].id}">연상기억법 보기 · ${esc(memories[0].title)} ›</button>`:''}</div></div>`;
}
function officialPracticePage(){
 const session=officialExamSession,entry=officialSessionQuestion();if(!session||!entry)return officialExamHome();
 const question=officialQuestion(entry.canonicalQuestionId),picked=session.answers[entry.canonicalQuestionId],feedback=session.feedback[entry.canonicalQuestionId],done=session.mode==='learn'&&feedback!==undefined,count=question.choices?.length||(question.examLevel==='기본'?4:5);
 return `<section class="official-practice"><header class="official-subhead"><button data-official-exit="true" aria-label="목록으로">‹</button><div><small>${session.mode==='learn'?'학습 모드':'시험 모드'} · ${examSourceLabel(entry)}</small><h1>${session.index+1} / ${session.entries.length}</h1></div></header><div class="quiz-progress"><div class="progress"><span style="width:${Math.round((session.index+1)/session.entries.length*100)}%"></span></div></div><figure class="official-paper"><img src="${esc(entry.libraryImage)}" alt="${examSourceLabel(entry)} 실제 문제"><figcaption>${esc(entry.sourceRecord.sourcePdf)} · ${entry.sourceRecord.sourcePage}쪽</figcaption></figure><div class="official-choice-grid" role="group" aria-label="정답 선택">${officialChoiceLabels.slice(0,count).map((label,index)=>`<button data-official-pick="${index}" class="${picked===index?'picked ':''}${done&&officialAnswerAccepted(question,index)?'correct':done&&picked===index?'wrong':''}" ${done?'disabled':''}>${label}</button>`).join('')}</div>${done?officialFeedbackBlock(question,feedback,picked):''}<div class="official-practice-actions">${session.mode==='learn'&&!done?`<button class="primary" data-official-submit="true" ${picked===undefined?'disabled':''}>정답 확인</button>`:session.mode==='exam'?`<button class="primary" data-official-next="true" ${picked===undefined?'disabled':''}>${session.index===session.entries.length-1?'채점하기':'다음 문제'}</button>`:`<button class="primary" data-official-next="true">${session.index===session.entries.length-1?'학습 결과 보기':'다음 문제'}</button>`}</div></section>`;
}
function officialResultPage(){
 const session=officialExamSession;if(!session)return officialExamHome();const graded=session.graded||{};
 const correct=session.entries.filter(entry=>graded[entry.canonicalQuestionId]).length,total=session.entries.length,points=session.entries.reduce((sum,entry)=>sum+(graded[entry.canonicalQuestionId]?entry.sourceRecord.points:0),0),maxPoints=session.entries.reduce((sum,entry)=>sum+entry.sourceRecord.points,0);
 const eraStats=OFFICIAL_ERA_TAXONOMY.map(era=>{const rows=session.entries.filter(entry=>entry.primaryEra===era.id),count=rows.filter(entry=>graded[entry.canonicalQuestionId]).length;return {era,rows,count,accuracy:rows.length?Math.round(count/rows.length*100):null}}).filter(item=>item.rows.length);
 const eras=eraStats.map(item=>`<div><b>${item.era.name}</b><span>${item.count} / ${item.rows.length}</span><div class="progress"><span style="width:${item.accuracy}%"></span></div></div>`).join(''),weak=[...eraStats].sort((a,b)=>a.accuracy-b.accuracy||b.rows.length-a.rows.length)[0];
 const wrong=session.entries.filter(entry=>!graded[entry.canonicalQuestionId]);
 const reviewRows=session.entries.map(entry=>{const right=Boolean(graded[entry.canonicalQuestionId]);return `<button class="official-wrong-row ${right?'right':'wrong'}" data-official-review="${entry.canonicalQuestionId}"><img src="${esc(entry.libraryImage)}" alt=""><span><b>${examSourceLabel(entry)}</b><small>${right?'정답':'오답'} · 정답 ${officialAnswerLabel(officialQuestion(entry.canonicalQuestionId))} · 해설 보기</small></span><span>›</span></button>`}).join('');
 return `<section class="official-results"><p class="eyebrow">OFFICIAL EXAM RESULT</p><h1>${correct} / ${total}</h1><div class="official-result-summary">${[['총 문제',total],['정답',correct],['오답',total-correct],['점수',points+' / '+maxPoints],['정답률',(total?Math.round(correct/total*100):0)+'%']].map(([label,value])=>`<div><small>${label}</small><b>${value}</b></div>`).join('')}</div><p class="weak-era">취약 시대 · <b>${weak&&weak.accuracy<100?weak.era.name:'없음'}</b></p><div class="official-result-actions"><button class="primary" data-official-retry="true">틀린 문제 다시 학습</button><button class="secondary" data-official-back="list">목록으로</button></div><section><h2>시대별 정답률</h2><div class="official-era-results">${eras}</div></section><section><h2>문제별 해설 · 오답 ${wrong.length}</h2>${reviewRows}</section></section>`;
}
function officialReviewPage(){
 const session=officialExamSession,entry=session?.entries.find(item=>item.canonicalQuestionId===session.reviewQuestionId);if(!session||!entry)return officialResultPage();
 const question=officialQuestion(entry.canonicalQuestionId),selected=session.answers[entry.canonicalQuestionId],right=Boolean(session.graded?.[entry.canonicalQuestionId]),index=session.entries.indexOf(entry),previous=session.entries[index-1],next=session.entries[index+1];
 return `<section class="official-practice official-review"><header class="official-subhead"><button data-official-review-back="true" aria-label="시험 결과로">‹</button><div><small>채점 후 문제 다시 보기 · ${examSourceLabel(entry)}</small><h1>${index+1} / ${session.entries.length}</h1></div></header><figure class="official-paper"><img src="${esc(entry.libraryImage)}" alt="${examSourceLabel(entry)} 실제 문제"><figcaption>${esc(entry.sourceRecord.sourcePdf)} · ${entry.sourceRecord.sourcePage}쪽</figcaption></figure>${officialFeedbackBlock(question,right,selected)}<div class="official-review-actions"><button class="secondary" data-official-review="${previous?.canonicalQuestionId||''}" ${previous?'':'disabled'}>이전 문제</button><button class="secondary" data-official-review="${next?.canonicalQuestionId||''}" ${next?'':'disabled'}>다음 문제</button></div></section>`;
}
function officialExamPage(){if(officialExamView==='list')return officialExamListPage();if(officialExamView==='practice')return officialPracticePage();if(officialExamView==='result')return officialResultPage();if(officialExamView==='review')return officialReviewPage();return officialExamHome()}

const ASSOCIATION_MEMORIES=[
 {id:'gong-go-sin-il',status:'published',era:'ancient',type:'전투 흐름',title:'공고신일',description:'후삼국 통일까지 네 장면을 한 줄로 잇습니다.',sequence:['공산 전투','고창 전투','신라 항복','일리천 전투'],searchTerms:['공산','고창','신라 항복','일리천']},
 {id:'mu-gap-gi-eul',status:'published',era:'joseon',type:'사화',title:'무갑기을',description:'조선 전기 네 사화의 순서를 기억합니다.',sequence:['무오사화','갑자사화','기묘사화','을사사화'],searchTerms:['무오사화','갑자사화','기묘사화','을사사화']},
 {id:'byeong-je-byeong-o-sin-cheok',status:'published',era:'joseon',type:'개항 사건',title:'병제병오신척',description:'흥선 대원군 시기 통상 수교 거부의 흐름입니다.',sequence:['병인박해','제너럴셔먼호 사건','병인양요','오페르트 도굴 사건','신미양요','척화비'],searchTerms:['병인박해','제너럴셔먼호','병인양요','오페르트','신미양요','척화비']},
 {id:'joseon-kings',status:'published',era:'joseon',type:'왕 계보',title:'조선 왕 순서',description:'태조부터 순종까지 왕의 흐름을 네 묶음으로 외웁니다.',sequence:['태정태세문단세','예성연중인명선','광인효현숙경영','정순헌철고순'],expanded:['태조·정종·태종·세종·문종·단종·세조','예종·성종·연산군·중종·인종·명종·선조','광해군·인조·효종·현종·숙종·경종·영조','정조·순조·헌종·철종·고종·순종'],searchTerms:['태조','세종','선조','정조','고종','순종']}
];
globalThis.ASSOCIATION_MEMORIES=ASSOCIATION_MEMORIES;
const ASSOCIATION_MEMORY_CANDIDATES=[
 {id:'three-kingdom-kings',status:'candidate',topic:'삼국 왕 계보'},{id:'goryeo-kings',status:'candidate',topic:'고려 왕 계보'},{id:'land-systems',status:'candidate',topic:'전시과·과전법'},
 {id:'joseon-foreign-wars',status:'candidate',topic:'조선 왜란·호란 순서'},{id:'yesong-hwanguk',status:'candidate',topic:'예송과 환국'},{id:'tax-systems',status:'candidate',topic:'조선 수취 제도'},
 {id:'peasant-uprisings',status:'candidate',topic:'농민 봉기'},{id:'open-port-sequence',status:'candidate',topic:'개항 순서'},{id:'gabo-reforms',status:'candidate',topic:'갑오개혁'},
 {id:'eulmi-reforms',status:'candidate',topic:'을미개혁'},{id:'patriotic-armies',status:'candidate',topic:'의병 항쟁'},{id:'independence-groups',status:'candidate',topic:'독립운동 단체'},
 {id:'independence-battles',status:'candidate',topic:'독립군 전투'},{id:'provisional-government',status:'candidate',topic:'대한민국 임시 정부'},{id:'inter-korean-dialogue',status:'candidate',topic:'남북 대화'}
];
globalThis.ASSOCIATION_MEMORY_CANDIDATES=ASSOCIATION_MEMORY_CANDIDATES;
let associationEra='all',associationType='all',associationDetailId=null,associationRecall=null;
const associationStatus=id=>meta().associationMemoryStatus?.[id]||'NEW';
const setAssociationStatus=(id,status)=>{meta().associationMemoryStatus||(meta().associationMemoryStatus={});meta().associationMemoryStatus[id]=status};
function associationRelated(memory){
 const normalized=value=>String(value||'').replace(/\s+/g,'');
 return OFFICIAL_EXAM_CATALOG.map(entry=>({entry,question:officialQuestion(entry.canonicalQuestionId)})).filter(({question})=>{const hay=normalized([question.question,question.sourceQuestionText,question.historicalEvent,...(question.examKeywords||[]),...(question.concepts||[])].join(' '));return memory.searchTerms.some(term=>hay.includes(normalized(term)))}).slice(0,12).map(item=>item.entry.canonicalQuestionId);
}
for(const memory of ASSOCIATION_MEMORIES)memory.relatedOfficialQuestionIds=associationRelated(memory);
const memoryForQuestion=question=>ASSOCIATION_MEMORIES.filter(memory=>memory.relatedOfficialQuestionIds.includes(question?.officialQuestionId||question?.questionId));
function associationHome(){
 const types=[...new Set(ASSOCIATION_MEMORIES.map(memory=>memory.type))],visible=ASSOCIATION_MEMORIES.filter(memory=>memory.status==='published'&&(associationEra==='all'||memory.era===associationEra)&&(associationType==='all'||memory.type===associationType));
 return `<section class="association-memory">${editorialHeader('연상기억법','헷갈리는 한국사, 짧게 연결해서 기억하세요.')}<div class="association-filters"><label>시대별<select data-association-era><option value="all">전체</option>${OFFICIAL_ERA_TAXONOMY.map(era=>`<option value="${era.id}" ${associationEra===era.id?'selected':''}>${era.name}</option>`).join('')}</select></label><label>유형별<select data-association-type><option value="all">전체</option>${types.map(type=>`<option ${associationType===type?'selected':''}>${type}</option>`).join('')}</select></label></div><div class="association-grid">${visible.map(memory=>`<button data-association-open="${memory.id}"><span>${officialEraInfo(memory.era).name} · ${memory.type}</span><h2>${memory.title}</h2><p>${memory.description}</p><small>관련 실제 기출 ${memory.relatedOfficialQuestionIds.length}문제</small><b>${associationStatus(memory.id)} · 연상기억 시작</b></button>`).join('')}</div></section>`;
}
function storyExperienced(question){if(!question?.relatedSceneId)return false;const visited=new Set([...(run().visited||[]),...(mainRun().visited||[])]);return visited.has(question.relatedSceneId)||meta().completedChapters.includes(question.chapterId)}
function associationDetailPage(){
 const memory=ASSOCIATION_MEMORIES.find(item=>item.id===associationDetailId);if(!memory)return associationHome();const related=memory.relatedOfficialQuestionIds;
 return `<section class="association-detail"><header class="official-subhead"><button data-association-back="true" aria-label="연상암기 목록으로">‹</button><div><small>${officialEraInfo(memory.era).name} · ${memory.type}</small><h1>${memory.title}</h1></div></header><section class="association-meaning"><small>연상어</small><h2>${memory.title}</h2><small>뜻</small><p class="association-description">${memory.description}</p></section><h2>단계별 확장</h2><ol class="association-sequence">${memory.sequence.map((item,index)=>`<li><span>${index+1}</span><div><b>${item}</b>${memory.expanded?.[index]?`<small>${memory.expanded[index]}</small>`:''}</div></li>`).join('')}</ol><button class="primary association-recall-start" data-association-recall="${memory.id}">Recall Test 시작</button><section><h2>연결된 실제 기출</h2>${related.length?related.map(id=>{const entry=officialEntry(id),question=officialQuestion(id);return `<article class="association-question"><img src="${esc(entry.libraryImage)}" alt=""><span><small>${examSourceLabel(entry)}</small><b>${officialEraInfo(entry.primaryEra).name}</b></span><button data-official-single="${id}">문제 풀기</button>${storyExperienced(question)?`<button class="text-btn" data-story-memory="${id}">이 장면 기억하시나요?</button>`:''}</article>`}).join(''):'<div class="ed-empty">연결할 수 있는 등록 기출을 검토 중입니다.</div>'}</section></section>`;
}
function associationRecallPage(){
 const recall=associationRecall,memory=ASSOCIATION_MEMORIES.find(item=>item.id===recall?.memoryId);if(!memory)return associationHome();const index=recall.index,correct=memory.sequence[index],previous=memory.sequence[index-1],options=[correct,...memory.sequence.filter((_,i)=>i!==index)].slice(0,4).sort((a,b)=>a.localeCompare(b,'ko'));
 return `<section class="association-recall"><p class="eyebrow">RECALL TEST · ${index} / ${memory.sequence.length-1}</p><h1>${memory.title}</h1><p><b>${previous}</b> 다음에 이어지는 것은?</p><div>${options.map(option=>`<button data-association-answer="${esc(option)}">${option}</button>`).join('')}</div><button class="text-btn" data-association-cancel="true">암기 카드로 돌아가기</button></section>`;
}
function associationPage(){if(associationRecall)return associationRecallPage();if(associationDetailId)return associationDetailPage();return associationHome()}

const recordsBeforeExamMemory=records;
function officialRecordsPage(){
 const records=OFFICIAL_EXAM_CATALOG.map(entry=>({entry,record:meta().questionRecords[entry.canonicalQuestionId]})).filter(item=>item.record?.attempts),attempts=records.reduce((sum,item)=>sum+item.record.attempts,0),correct=records.reduce((sum,item)=>sum+item.record.correctCount,0);
 const eraRows=OFFICIAL_ERA_TAXONOMY.map(era=>{const entries=officialEntriesForEra(era.id),attempted=entries.filter(entry=>meta().questionRecords[entry.canonicalQuestionId]?.attempts),eraAttempts=attempted.reduce((sum,entry)=>sum+meta().questionRecords[entry.canonicalQuestionId].attempts,0),eraCorrect=attempted.reduce((sum,entry)=>sum+meta().questionRecords[entry.canonicalQuestionId].correctCount,0),accuracy=eraAttempts?Math.round(eraCorrect/eraAttempts*100):null;return `<div class="official-record-era"><b>${era.name}</b><span>${accuracy===null?'—':accuracy+'%'}</span><small>${attempted.length} / ${entries.length}문항 학습</small><div class="progress"><span style="width:${entries.length?Math.round(attempted.length/entries.length*100):0}%"></span></div></div>`}).join('');
 return `<section class="official-records">${editorialHeader('나의 기록','스토리와 기출을 하나의 기록으로')}<div class="official-record-overview"><div><small>누적 풀이</small><strong>${attempts}</strong></div><div><small>누적 정답</small><strong>${correct}</strong></div><div><small>정답률</small><strong>${attempts?Math.round(correct/attempts*100)+'%':'—'}</strong></div><div><small>학습 문항</small><strong>${records.length}</strong></div></div><section><h2>시대별 기출 기록</h2>${eraRows}</section><section><h2>이야기 기록</h2>${recordsBeforeExamMemory().replace(/<header[\s\S]*?<\/header>/,'')}</section></section>`;
}

const shellBeforeExamMemory=shell;
shell=function(content){
 const current=screen==='association'?'association':screen.startsWith('exam-')?'exam-library':['era','game','quiz','complete','teaser','history'].includes(screen)?'home':screen;
 return `<div class="shell editorial-shell five-nav"><aside class="sidebar"><div class="brand">눈떠보니 한국사<small>역사를 살고, 기출로 기억하다</small></div><nav class="nav" aria-label="주 메뉴">${[['home','홈','home'],['exam-library','기출문제','book'],['association','연상기억법','target'],['study','오답노트','note'],['records','내 기록','records']].map(([id,label,image])=>`<button data-nav="${id}" ${current===id?'aria-current="page"':''} class="${current===id?'active':''}">${editorialIcon(image)}<span>${label}</span></button>`).join('')}</nav></aside><main class="main ed-screen ed-${screen}">${content}</main></div>${modal?modalHTML():''}`;
};
const renderContentBeforeExamMemory=renderContent;
renderContent=function(){if(screen==='exam-library')return officialExamPage();if(screen==='association')return associationPage();if(screen==='records')return officialRecordsPage();return renderContentBeforeExamMemory()};

const v2QuestionRowBeforeAssociation=v2QuestionRow;
v2QuestionRow=function(question){
 let html=v2QuestionRowBeforeAssociation(question);if(!storyExperienced(question))html=html.replace(/<button class="text-btn" data-story-memory="[^"]+">[\s\S]*?<\/button>/,'');
 const memories=memoryForQuestion(question);if(memories.length)html=html.replace('</div></article>',`<button class="text-btn" data-association-for="${memories[0].id}">연상기억법 보기 · ${esc(memories[0].title)} ›</button></div></article>`);return html;
};

function startOfficialSession(entries,mode){
 let selected=[...entries];if(mode==='exam'&&officialExamTab==='era')selected=selected.slice().sort((a,b)=>b.sourceRecord.examRound-a.sourceRecord.examRound||a.sourceRecord.questionNumber-b.sourceRecord.questionNumber).slice(0,20);
 officialExamSession={mode,entries:selected,index:0,answers:{},feedback:{},graded:null,reviewQuestionId:null};officialExamView='practice';screen='exam-library';render();window.scrollTo(0,0);
}
function gradeOfficialSession(){
 const session=officialExamSession,graded={};for(const entry of session.entries){const answer=session.answers[entry.canonicalQuestionId];if(answer===undefined)continue;graded[entry.canonicalQuestionId]=recordOfficialAttempt(entry.canonicalQuestionId,answer)}session.graded=graded;
 meta().officialExamResults||(meta().officialExamResults=[]);meta().officialExamResults.push({mode:session.mode,questionIds:session.entries.map(entry=>entry.canonicalQuestionId),answers:{...session.answers},graded:{...graded},completedAt:new Date().toISOString()});save();officialExamView='result';render();window.scrollTo(0,0);
}
document.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button||button.disabled)return;const data=button.dataset;
 if(data.nav==='exam-library'||data.nav==='association'){event.stopImmediatePropagation();librarySession=null;if(data.nav==='exam-library'){officialExamView='home';officialExamSession=null}else{associationDetailId=null;associationRecall=null}screen=data.nav;modal=null;render();window.scrollTo(0,0);return}
 if(data.officialTab){event.stopImmediatePropagation();officialExamTab=data.officialTab;officialExamView='home';officialExamLevel='all';render();return}
 if(data.officialEra){event.stopImmediatePropagation();officialExamTab='era';officialExamEra=data.officialEra;officialExamLevel='all';officialExamView='list';render();window.scrollTo(0,0);return}
 if(data.officialRound){event.stopImmediatePropagation();officialExamTab='round';officialExamRound=Number(data.officialRound);officialExamLevel=data.officialEditionLevel||'all';officialExamView='list';render();window.scrollTo(0,0);return}
 if(data.officialLevel){event.stopImmediatePropagation();officialExamLevel=data.officialLevel;render();return}
 if(data.officialBack){event.stopImmediatePropagation();officialExamSession=null;officialExamView=data.officialBack==='home'?'home':'list';render();window.scrollTo(0,0);return}
 if(data.officialStart){event.stopImmediatePropagation();startOfficialSession(officialSelectionEntries(),data.officialStart);return}
 if(data.officialReview){event.stopImmediatePropagation();if(!officialExamSession?.graded)return;officialExamSession.reviewQuestionId=data.officialReview;officialExamView='review';render();window.scrollTo(0,0);return}
 if(data.officialReviewBack){event.stopImmediatePropagation();officialExamView='result';render();window.scrollTo(0,0);return}
 if(data.officialSingle){event.stopImmediatePropagation();const entry=officialEntry(data.officialSingle);if(entry)startOfficialSession([entry],'learn');return}
 if(data.officialPick!==undefined){event.stopImmediatePropagation();const entry=officialSessionQuestion();if(!entry)return;officialExamSession.answers[entry.canonicalQuestionId]=Number(data.officialPick);render();return}
 if(data.officialSubmit){event.stopImmediatePropagation();const entry=officialSessionQuestion(),answer=officialExamSession.answers[entry.canonicalQuestionId];if(answer===undefined)return;officialExamSession.feedback[entry.canonicalQuestionId]=recordOfficialAttempt(entry.canonicalQuestionId,answer);save();render();return}
 if(data.officialNext){event.stopImmediatePropagation();if(officialExamSession.mode==='exam'&&officialExamSession.index===officialExamSession.entries.length-1){gradeOfficialSession();return}if(officialExamSession.mode==='learn'&&officialExamSession.index===officialExamSession.entries.length-1){officialExamSession.graded={...officialExamSession.feedback};officialExamView='result';render();window.scrollTo(0,0);return}officialExamSession.index++;render();window.scrollTo(0,0);return}
 if(data.officialExit){event.stopImmediatePropagation();officialExamSession=null;officialExamView='list';render();window.scrollTo(0,0);return}
 if(data.officialRetry){event.stopImmediatePropagation();const wrong=officialExamSession.entries.filter(entry=>!officialExamSession.graded?.[entry.canonicalQuestionId]);startOfficialSession(wrong.length?wrong:officialExamSession.entries,'learn');return}
 if(data.associationOpen||data.associationFor){event.stopImmediatePropagation();associationDetailId=data.associationOpen||data.associationFor;associationRecall=null;setAssociationStatus(associationDetailId,associationStatus(associationDetailId)==='MEMORIZED'?'MEMORIZED':'LEARNING');screen='association';save();render();window.scrollTo(0,0);return}
 if(data.associationBack){event.stopImmediatePropagation();associationDetailId=null;associationRecall=null;render();return}
 if(data.associationRecall){event.stopImmediatePropagation();setAssociationStatus(data.associationRecall,'LEARNING');associationRecall={memoryId:data.associationRecall,index:1};save();render();return}
 if(data.associationAnswer){event.stopImmediatePropagation();const memory=ASSOCIATION_MEMORIES.find(item=>item.id===associationRecall?.memoryId);if(!memory)return;if(data.associationAnswer===memory.sequence[associationRecall.index]){associationRecall.index++;if(associationRecall.index>=memory.sequence.length){setAssociationStatus(memory.id,'MEMORIZED');associationRecall=null;save();toast('암기 완료로 기록했습니다.');render()}else render()}else{setAssociationStatus(memory.id,'LEARNING');save();toast('순서를 다시 떠올려 보세요.')}return}
 if(data.associationCancel){event.stopImmediatePropagation();associationRecall=null;render();return}
},true);
document.addEventListener('change',event=>{if(event.target.matches('[data-association-era]')){associationEra=event.target.value;render()}if(event.target.matches('[data-association-type]')){associationType=event.target.value;render()}});

globalThis.EXAM_MEMORY_UI_READY=true;
render();
}
