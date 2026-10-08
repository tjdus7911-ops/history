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
 const resolved=generated?.explanation||canonicalStored?.value||reusable?.stored?.value||'';
 officialExplanationStats.total++;
 if(generated?.explanation)officialExplanationStats.supplemented++;
 else if(canonicalStored)officialExplanationStats.preexisting++;
 else if(reusable?.stored){officialExplanationStats.restoredMappings++}
 if(resolved)officialExplanationStats.covered++;else officialExplanationStats.missing++;
 for(const aliasId of aliases){
  const question=QUESTIONS.find(item=>item.questionId===aliasId);if(!question)continue;
  if(resolved)question.explanation=resolved;
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
const officialEntryOrder=(a,b)=>b.sourceRecord.examRound-a.sourceRecord.examRound||a.sourceRecord.questionNumber-b.sourceRecord.questionNumber||(a.sourceRecord.examLevel==='심화'?-1:1);
const officialEntriesForEra=(era,level='all')=>OFFICIAL_EXAM_CATALOG.filter(entry=>entry.primaryEra===era&&(level==='all'||entry.sourceRecord.examLevel===level)).sort(officialEntryOrder);
const officialEntriesForRound=(round,level='all')=>OFFICIAL_EXAM_CATALOG.filter(entry=>entry.sourceRecord.examRound===Number(round)&&(level==='all'||entry.sourceRecord.examLevel===level)).sort((a,b)=>a.sourceRecord.questionNumber-b.sourceRecord.questionNumber);
globalThis.OFFICIAL_ENTRIES_FOR_ERA=officialEntriesForEra;
globalThis.OFFICIAL_ENTRIES_FOR_ROUND=officialEntriesForRound;
const officialRounds=()=>[...new Set(OFFICIAL_EXAM_CATALOG.map(entry=>entry.sourceRecord.examRound))].sort((a,b)=>b-a);
const OFFICIAL_ROUND_LEVELS=['기본','심화'].filter(level=>OFFICIAL_EXAM_CATALOG.some(entry=>entry.sourceRecord.examLevel===level));
const officialEditions=(level='all')=>{const groups=new Map();for(const entry of OFFICIAL_EXAM_CATALOG){if(level!=='all'&&entry.sourceRecord.examLevel!==level)continue;const key=entry.sourceRecord.examRound+':'+entry.sourceRecord.examLevel;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(entry)}return [...groups.values()].sort((a,b)=>b[0].sourceRecord.examRound-a[0].sourceRecord.examRound||(a[0].sourceRecord.examLevel==='심화'?-1:1))};
const examSourceLabel=entry=>`${entry.sourceRecord.examRound}회 ${entry.sourceRecord.examLevel} · ${entry.sourceRecord.questionNumber}번`;

let officialExamTab='era',officialExamView='home',officialExamEra='ancient',officialExamRound=officialRounds()[0]||79,officialExamLevel='all',officialExamSession=null;
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
function officialEditionExamState(entries){
 const source=entries[0]?.sourceRecord;if(!source)return '미응시';
 const active=meta().officialExamActiveSession;if(active?.examRound===source.examRound&&active?.examLevel===source.examLevel)return '응시 중';
 return (meta().officialExamResults||[]).some(result=>{const edition=officialResultEdition(result);return result.mode==='exam'&&edition?.examRound===source.examRound&&edition?.examLevel===source.examLevel})?'응시 완료':'미응시';
}
function officialTimerMarkup(session){if(!officialTimedSession(session))return '';const remaining=officialRemainingMs(session),timerState=officialTimerState(session),status=timerState===OFFICIAL_TIMER_STATES.READY?'시작 전':timerState===OFFICIAL_TIMER_STATES.PAUSED?'일시정지':'진행 중';return `<section class="official-exam-timer-panel"><div class="official-exam-timer ${officialTimerTone(remaining)}" data-official-timer role="timer"><span>남은 시간</span><b data-official-timer-value>${officialFormatDuration(remaining)}</b><em>${status}</em></div><div class="official-timer-controls" aria-label="시험 타이머 조작"><button class="primary" data-official-timer-start="true" ${timerState===OFFICIAL_TIMER_STATES.RUNNING?'disabled':''}>시작</button><button class="secondary" data-official-timer-pause="true" ${timerState!==OFFICIAL_TIMER_STATES.RUNNING?'disabled':''}>일시정지</button><button class="secondary" data-official-timer-restart="true">재시작</button></div></section>`}
function stopOfficialTimer(){if(officialTimerInterval!==null&&typeof clearInterval==='function')clearInterval(officialTimerInterval);officialTimerInterval=null}
function serializedOfficialSession(session){return {version:2,mode:session.mode,timed:true,examRound:session.examRound,examLevel:session.examLevel,questionIds:session.entries.map(entry=>entry.canonicalQuestionId),index:session.index,answers:{...session.answers},startedAtMs:session.startedAtMs,endTimeMs:session.endTimeMs,durationMs:session.durationMs,timerState:officialTimerState(session),remainingMs:officialRemainingMs(session),passedQuestionIds:[...(session.passedQuestionIds||[])],initialPassComplete:Boolean(session.initialPassComplete)}}
globalThis.OFFICIAL_EXAM_TIMER={durationMs:OFFICIAL_EXAM_DURATION_MS,remainingMs:()=>officialRemainingMs(),tick:()=>officialTimerTick(),snapshot:()=>officialExamSession?{...serializedOfficialSession(officialExamSession),graded:officialExamSession.graded?{...officialExamSession.graded}:null,submissionReason:officialExamSession.submissionReason,running:officialTimerInterval!==null}:null,editionState:(round,level)=>officialEditionExamState(officialEntriesForRound(round,level))};
function persistOfficialSession(){if(!officialTimedSession()||officialExamSession.graded)return;meta().officialExamActiveSession=serializedOfficialSession(officialExamSession);save()}
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
function officialAdvanceQuestion({pass=false}={}){const session=officialExamSession,entry=officialSessionQuestion();if(!session||!entry||!officialExamInteractionAvailable())return;const id=entry.canonicalQuestionId,picked=session.answers[id];if(pass&&!Number.isInteger(picked))session.passedQuestionIds=[...officialPassedIds(session).filter(item=>item!==id),id];else if(!pass&&!Number.isInteger(picked))return;if(!session.initialPassComplete&&session.index<session.entries.length-1){session.index++;persistOfficialSession();render();window.scrollTo(0,0);return}session.initialPassComplete=true;const unanswered=officialUnansweredIds(session);if(unanswered.length){officialSetCurrentQuestion(unanswered[0]);return}modal={type:'official-submit-confirm',unansweredCount:0,continueToUnanswered:false};persistOfficialSession();render()}
function requestOfficialSubmission(){if(!officialTimedSession()||!officialExamInteractionAvailable())return;const unanswered=officialUnansweredIds();modal={type:'official-submit-confirm',unansweredCount:unanswered.length,continueToUnanswered:unanswered.length>0};render()}
function officialExamHome(){
 const tab='<div class="official-tabs" role="tablist">'+[['era','시대별'],['round','회차별']].map(([id,label])=>`<button data-official-tab="${id}" aria-selected="${officialExamTab===id}">${label}</button>`).join('')+'</div>';
 const roundLevels=officialExamTab==='round'?`<div class="official-round-levels" role="tablist" aria-label="회차별 시험 유형">${OFFICIAL_ROUND_LEVELS.map(level=>`<button data-official-round-level="${level}" aria-selected="${officialExamLevel===level}">${level}</button>`).join('')}</div>`:'';
 const cards=officialExamTab==='era'?OFFICIAL_ERA_TAXONOMY.map(era=>{const entries=officialEntriesForEra(era.id),progress=officialProgress(entries);return `<button class="official-card" data-official-era="${era.id}"><span class="open-pill">OPEN</span><h2>${era.name}</h2><p>${era.years}</p><small>실제 기출 ${entries.length}문항</small><div class="official-card-progress"><i style="width:${progress.percent}%"></i></div><b>${progress.attempted} / ${progress.total} · ${progress.percent}%</b></button>`}).join(''):officialEditions(officialExamLevel).map(entries=>{const source=entries[0].sourceRecord,progress=officialProgress(entries),examState=officialEditionExamState(entries);return `<button class="official-card round" data-official-round="${source.examRound}" data-official-edition-level="${source.examLevel}"><span class="open-pill">OPEN</span><h2>제${source.examRound}회 · ${source.examLevel}</h2><p>${source.examYear}</p><small>실제 기출 ${entries.length}문항</small><div class="official-card-progress"><i style="width:${progress.percent}%"></i></div><b>진행 ${progress.attempted} / ${progress.total} · ${progress.percent}% · 시험 ${examState}</b></button>`}).join('');
 return `<section class="official-exams">${editorialHeader('기출문제','공식 문제지 그대로, 잠금 없이 학습')} ${tab}${roundLevels}<div class="official-notice">등록이 완료된 공식 기출은 모두 바로 풀 수 있습니다. 스토리 진행도와 기출 이용 여부는 분리되어 있습니다.</div><div class="official-grid">${cards}</div></section>`;
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
 const memories=memoryForQuestion(question),selected=Number.isInteger(selectedAnswer)?officialChoiceLabels[selectedAnswer]||String(selectedAnswer+1):'선택하지 않음';
 return `<div class="official-feedback ${right?'correct':'wrong'}" role="status"><h2>${right?'✓ 정답입니다.':'✕ 오답입니다.'}</h2><p class="official-selected-answer">내가 선택한 답 <b>${selected}</b></p><p class="official-answer-line"><b>정답 ${officialAnswerLabel(question)}</b></p><div class="official-explanation"><h3>[해설]</h3><p>${esc(officialExplanation(question))}</p>${memories.length?`<button class="text-btn" data-association-for="${memories[0].id}">암기법 보기 · ${esc(memories[0].title)} ›</button>`:''}</div></div>`;
}
function officialPracticePage(){
 const session=officialExamSession,entry=officialSessionQuestion();if(!session||!entry)return officialExamHome();
 const question=officialQuestion(entry.canonicalQuestionId),picked=session.answers[entry.canonicalQuestionId],feedback=session.feedback[entry.canonicalQuestionId],done=session.mode==='learn'&&feedback!==undefined,count=question.choices?.length||(question.examLevel==='기본'?4:5),timed=officialTimedSession(session),timerState=officialTimerState(session),interactionAllowed=!timed||timerState===OFFICIAL_TIMER_STATES.RUNNING,paused=timed&&timerState===OFFICIAL_TIMER_STATES.PAUSED;
 const answered=officialAnsweredIds(session).size,unanswered=session.entries.length-answered,passed=officialPassedIds(session).length,questionNumber=entry.sourceRecord.questionNumber||session.index+1;
 const status=timed?`<div class="official-exam-status" aria-label="시험 진행 상태"><strong>현재 ${questionNumber}번 / 전체 ${session.entries.length}문제</strong><span>답변 완료 <b>${answered}</b></span><span>미응답 <b>${unanswered}</b></span><span>패스 <b>${passed}</b></span></div>`:'';
 const questionBody=paused?'<div class="official-pause-cover" role="status"><b>시험이 일시정지되었습니다.</b><p>다시 시작하면 남은 시간부터 문제를 이어서 풀 수 있습니다.</p></div>':`<figure class="official-paper"><img src="${esc(entry.libraryImage)}" alt="${examSourceLabel(entry)} 실제 문제"><figcaption>${esc(entry.sourceRecord.sourcePdf)} · ${entry.sourceRecord.sourcePage}쪽</figcaption></figure><div class="official-choice-grid" role="group" aria-label="정답 선택">${officialChoiceLabels.slice(0,count).map((label,index)=>`<button data-official-pick="${index}" class="${picked===index?'picked ':''}${done&&officialAnswerAccepted(question,index)?'correct':done&&picked===index?'wrong':''}" ${done||!interactionAllowed?'disabled':''}>${label}</button>`).join('')}</div>${done?officialFeedbackBlock(question,feedback,picked):''}`;
 const actions=session.mode==='learn'&&!done?`<button class="primary" data-official-submit="true" ${picked===undefined?'disabled':''}>정답 확인</button>`:timed?`<div class="official-question-actions"><button class="secondary" data-official-pass="true" ${!interactionAllowed?'disabled':''}>패스하기</button><button class="primary" data-official-next="true" ${!interactionAllowed||!Number.isInteger(picked)?'disabled':''}>다음 문제</button></div><button class="official-manual-submit secondary" data-official-request-submit="true" ${!interactionAllowed?'disabled':''}>시험 제출</button>`:session.mode==='exam'?`<button class="primary" data-official-next="true" ${picked===undefined?'disabled':''}>${session.index===session.entries.length-1?'시험 제출':'다음 문제'}</button>`:`<button class="primary" data-official-next="true">${session.index===session.entries.length-1?'학습 결과 보기':'다음 문제'}</button>`;
 return `<section class="official-practice"><header class="official-subhead"><button data-official-exit="true" aria-label="목록으로">‹</button><div><small>${session.mode==='learn'?'학습 모드':'시험 모드'} · ${examSourceLabel(entry)}</small><h1>${session.index+1} / ${session.entries.length}</h1></div></header>${officialTimerMarkup(session)}${status}<div class="quiz-progress"><div class="progress"><span style="width:${Math.round((answered||session.index+1)/session.entries.length*100)}%"></span></div></div>${questionBody}<div class="official-practice-actions">${actions}</div></section>`;
}
function officialResultPage(){
 const session=officialExamSession;if(!session)return officialExamHome();const graded=session.graded||{};
 const correct=session.entries.filter(entry=>graded[entry.canonicalQuestionId]).length,total=session.entries.length,points=session.entries.reduce((sum,entry)=>sum+(graded[entry.canonicalQuestionId]?entry.sourceRecord.points:0),0),maxPoints=session.entries.reduce((sum,entry)=>sum+entry.sourceRecord.points,0);
 const eraStats=OFFICIAL_ERA_TAXONOMY.map(era=>{const rows=session.entries.filter(entry=>entry.primaryEra===era.id),count=rows.filter(entry=>graded[entry.canonicalQuestionId]).length;return {era,rows,count,accuracy:rows.length?Math.round(count/rows.length*100):null}}).filter(item=>item.rows.length);
 const eras=eraStats.map(item=>`<div><b>${item.era.name}</b><span>${item.count} / ${item.rows.length}</span><div class="progress"><span style="width:${item.accuracy}%"></span></div></div>`).join(''),weak=[...eraStats].sort((a,b)=>a.accuracy-b.accuracy||b.rows.length-a.rows.length)[0];
 const wrong=session.entries.filter(entry=>!graded[entry.canonicalQuestionId]);
 const reviewRows=session.entries.map(entry=>{const right=Boolean(graded[entry.canonicalQuestionId]);return `<button class="official-wrong-row ${right?'right':'wrong'}" data-official-review="${entry.canonicalQuestionId}"><img src="${esc(entry.libraryImage)}" alt=""><span><b>${examSourceLabel(entry)}</b><small>${right?'정답':'오답'} · 정답 ${officialAnswerLabel(officialQuestion(entry.canonicalQuestionId))} · 해설 보기</small></span><span>›</span></button>`}).join('');
 return `<section class="official-results"><p class="eyebrow">OFFICIAL EXAM RESULT</p>${session.submissionReason==='TIME_EXPIRED'?'<p class="official-timeout-notice" role="status">시간 종료로 자동 제출되었습니다</p>':''}<h1>${correct} / ${total}</h1><div class="official-result-summary">${[['총 문제',total],['정답',correct],['오답',total-correct],['점수',points+' / '+maxPoints],['정답률',(total?Math.round(correct/total*100):0)+'%']].map(([label,value])=>`<div><small>${label}</small><b>${value}</b></div>`).join('')}</div><p class="weak-era">취약 시대 · <b>${weak&&weak.accuracy<100?weak.era.name:'없음'}</b></p><div class="official-result-actions"><button class="primary" data-official-retry="true">틀린 문제 다시 학습</button><button class="secondary" data-official-back="list">목록으로</button></div><section><h2>시대별 정답률</h2><div class="official-era-results">${eras}</div></section><section><h2>문제별 해설 · 오답 ${wrong.length}</h2>${reviewRows}</section></section>`;
}
function officialReviewPage(){
 const session=officialExamSession,entry=session?.entries.find(item=>item.canonicalQuestionId===session.reviewQuestionId);if(!session||!entry)return officialResultPage();
 const question=officialQuestion(entry.canonicalQuestionId),selected=session.answers[entry.canonicalQuestionId],right=Boolean(session.graded?.[entry.canonicalQuestionId]),index=session.entries.indexOf(entry),previous=session.entries[index-1],next=session.entries[index+1];
 return `<section class="official-practice official-review"><header class="official-subhead"><button data-official-review-back="true" aria-label="시험 결과로">‹</button><div><small>채점 후 문제 다시 보기 · ${examSourceLabel(entry)}</small><h1>${index+1} / ${session.entries.length}</h1></div></header><figure class="official-paper"><img src="${esc(entry.libraryImage)}" alt="${examSourceLabel(entry)} 실제 문제"><figcaption>${esc(entry.sourceRecord.sourcePdf)} · ${entry.sourceRecord.sourcePage}쪽</figcaption></figure>${officialFeedbackBlock(question,right,selected)}<div class="official-review-actions"><button class="secondary" data-official-review="${previous?.canonicalQuestionId||''}" ${previous?'':'disabled'}>이전 문제</button><button class="secondary" data-official-review="${next?.canonicalQuestionId||''}" ${next?'':'disabled'}>다음 문제</button></div></section>`;
}
function officialExamPage(){if(officialExamView==='list')return officialExamListPage();if(officialExamView==='practice')return officialPracticePage();if(officialExamView==='result')return officialResultPage();if(officialExamView==='review')return officialReviewPage();return officialExamHome()}

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
 return `<section class="association-detail"><header class="official-subhead association-detail-head"><button data-association-back="true" aria-label="암기법 목록으로">‹</button><div><small>${officialEraInfo(memory.era).name} · ${memoryTypeLabel(memory.memoryType)} · ${esc(memory.category||memory.type)}</small><h1>${esc(memory.title)}</h1><p>${esc(memory.years||memory.period||'')}</p></div></header><section class="association-meaning"><small>💡 암기 문장</small><h2 class="association-mnemonic">${esc(memory.publicMnemonic||memory.mnemonic||memory.title)}</h2><p class="association-tags">${memoryTypeLabel(memory.memoryType)} · ${esc(memory.category||memory.type)}</p></section><section class="association-keywords"><div class="association-section-title"><span>01</span><div><small>암기</small><h2>키워드 분석</h2></div></div><ol class="association-sequence">${memory.steps.map((step,index)=>{const key=`${memory.id}:${index}`,open=associationExpandedSteps.has(key),panelId=`association-step-${memory.id}-${index}`;return `<li class="association-step ${open?'open':''}"><button class="association-step-toggle" data-association-step="${index}" aria-expanded="${open}" aria-controls="${panelId}"><span class="association-step-number">${associationStepNumber(index)}</span><b>${associationStepTitle(step)}</b><span class="association-chevron" aria-hidden="true">⌄</span></button><div class="association-step-panel" id="${panelId}" aria-hidden="${!open}"><div><p>${esc(step.shortExplanation)}</p></div></div></li>`}).join('')}</ol></section><section class="association-context"><div class="association-section-title"><span>02</span><div><small>이해</small><h2>${esc(background.title)}</h2></div></div><p>${esc(background.summary)}</p>${(background.sections||[]).map(section=>`<article><h3>${esc(section.title)}</h3><p>${esc(section.body)}</p></article>`).join('')}</section>${detailSections.length?`<section class="association-details"><div class="association-section-title"><span>03</span><div><small>핵심 내용</small><h2>정책·사건별 의미</h2></div></div>${detailSections.map((section,index)=>`<details ${index===0?'open':''}><summary>${esc(section.title)}</summary><p>${esc(section.summary)}</p>${section.bullets?.length?`<ul>${section.bullets.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`:''}</details>`).join('')}</section>`:''}${flow.length?`<section class="association-flow"><div class="association-section-title"><span>${sectionNumber(4)}</span><div><small>결과</small><h2>핵심 흐름</h2></div></div><ol>${flow.map((item,index)=>`<li><span>${index+1}</span><b>${esc(item)}</b></li>`).join('')}</ol></section>`:''}${examPoints.length?`<section class="association-exam-points"><div class="association-section-title"><span>${sectionNumber(5)}</span><div><small>시험 적용</small><h2>시험 포인트</h2></div></div><ul>${examPoints.map(point=>`<li>${esc(point)}</li>`).join('')}</ul></section>`:''}${memory.steps.length>1?`<button class="primary association-recall-start" data-association-recall="${memory.id}">Recall Test 시작</button>`:''}<section class="association-official"><div class="association-section-title"><span>${sectionNumber(6)}</span><div><small>실전 확인</small><h2>관련 실제 기출</h2></div></div>${related.length?related.map(id=>{const entry=officialEntry(id),question=officialQuestion(id);return `<article class="association-question"><img src="${esc(entry.libraryImage)}" alt="${esc(examSourceLabel(entry))} 문제 미리보기"><span><small>${examSourceLabel(entry)}</small><b>${officialEraInfo(entry.primaryEra).name}</b></span><button data-official-single="${id}">문제 풀기</button>${storyExperienced(question)?`<button class="text-btn" data-story-memory="${id}">이 장면 기억하시나요?</button>`:''}</article>`}).join(''):'<div class="ed-empty">연결할 수 있는 등록 기출을 검토 중입니다.</div>'}</section></section>`;
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
 return `<section class="official-records">${editorialHeader('나의 기록','스토리와 기출을 하나의 기록으로')}<div class="official-record-overview"><div><small>누적 풀이</small><strong>${attempts}</strong></div><div><small>누적 정답</small><strong>${correct}</strong></div><div><small>정답률</small><strong>${attempts?Math.round(correct/attempts*100)+'%':'—'}</strong></div><div><small>학습 문항</small><strong>${records.length}</strong></div></div><section><h2>시대별 기출 기록</h2>${eraRows}</section><section><h2>이야기 기록</h2>${recordsBeforeExamMemory().replace(/<header[\s\S]*?<\/header>/,'')}</section></section>`;
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
 let html=v2QuestionRowBeforeAssociation(question);if(!storyExperienced(question))html=html.replace(/<button class="text-btn" data-story-memory="[^"]+">[\s\S]*?<\/button>/,'');
 const memories=memoryForQuestion(question);if(memories.length)html=html.replace('</div></article>',`<button class="text-btn" data-association-for="${memories[0].id}">암기법 보기 · ${esc(memories[0].title)} ›</button></div></article>`);return html;
};

const modalHTMLBeforeOfficialSubmit=modalHTML;
modalHTML=function(){
 if(modal?.type==='official-submit-confirm'){const count=Number(modal.unansweredCount)||0,title=count?`아직 답하지 않은 문제가 ${count}개 있습니다. 그래도 제출하시겠어요?`:'모든 문제를 확인했습니다. 시험을 제출하시겠어요?';return `<div class="modal-overlay"><section class="modal official-submit-modal" role="dialog" aria-modal="true" aria-labelledby="official-submit-title"><h2 id="official-submit-title">${title}</h2><p>제출 후에는 답안을 수정할 수 없으며, 채점 결과를 확인할 수 있습니다.</p><div><button class="secondary" data-official-submit-cancel="true">계속 풀기</button><button class="primary" data-official-submit-confirm="true">제출하기</button></div></section></div>`}
 if(modal?.type==='official-restart-confirm')return '<div class="modal-overlay"><section class="modal official-submit-modal" role="dialog" aria-modal="true" aria-labelledby="official-restart-title"><h2 id="official-restart-title">시험을 처음부터 다시 시작하시겠어요?</h2><p>현재 답안과 진행 시간이 초기화됩니다.</p><div><button class="secondary" data-official-restart-cancel="true">취소</button><button class="primary" data-official-restart-confirm="true">재시작</button></div></section></div>';
 return modalHTMLBeforeOfficialSubmit();
};
function startOfficialSession(entries,mode){
 let selected=[...entries];if(mode==='exam'&&officialExamTab==='era')selected=selected.slice().sort((a,b)=>b.sourceRecord.examRound-a.sourceRecord.examRound||a.sourceRecord.questionNumber-b.sourceRecord.questionNumber).slice(0,20);
 stopOfficialTimer();clearOfficialStoredSession();officialSubmitting=false;
 const timed=mode==='exam'&&officialExamTab==='round';
 officialExamSession={mode,entries:selected,index:0,answers:{},feedback:{},graded:null,reviewQuestionId:null,timed,examRound:timed?officialExamRound:null,examLevel:timed?officialExamLevel:null,startedAtMs:null,endTimeMs:null,durationMs:timed?OFFICIAL_EXAM_DURATION_MS:null,remainingMs:timed?OFFICIAL_EXAM_DURATION_MS:null,timerState:timed?OFFICIAL_TIMER_STATES.READY:null,passedQuestionIds:[],initialPassComplete:false,submissionReason:null};officialExamView='practice';screen='exam-library';modal=null;
 if(timed)persistOfficialSession();render();window.scrollTo(0,0);
}
function gradeOfficialSession(submissionReason='MANUAL'){
 const session=officialExamSession;if(!session||session.graded||officialSubmitting)return;officialSubmitting=true;stopOfficialTimer();modal=null;
 const remainingAtSubmission=officialTimedSession(session)?officialRemainingMs(session):null,graded={};for(const entry of session.entries){const id=entry.canonicalQuestionId,answer=session.answers[id],submittedAnswer=Number.isInteger(answer)?answer:null;if(answer===undefined)session.answers[id]=null;graded[id]=recordOfficialAttempt(id,submittedAnswer)}session.graded=graded;session.submissionReason=submissionReason;session.completedAtMs=Date.now();session.remainingMs=remainingAtSubmission;
 clearOfficialStoredSession();meta().officialExamResults||(meta().officialExamResults=[]);meta().officialExamResults.push({mode:session.mode,timed:Boolean(session.timed),examRound:session.examRound,examLevel:session.examLevel,questionIds:session.entries.map(entry=>entry.canonicalQuestionId),answers:{...session.answers},graded:{...graded},startedAt:session.startedAtMs?new Date(session.startedAtMs).toISOString():null,completedAt:new Date(session.completedAtMs).toISOString(),elapsedMs:officialTimedSession(session)?Math.max(0,session.durationMs-remainingAtSubmission):session.startedAtMs?Math.max(0,session.completedAtMs-session.startedAtMs):null,submissionReason});save();officialExamView='result';screen='exam-library';globalThis.APP_ROUTE?.push('exam-library');officialSubmitting=false;render();window.scrollTo(0,0);
}
function abandonOfficialSession(){stopOfficialTimer();if(officialTimedSession())clearOfficialStoredSession();officialExamSession=null;officialSubmitting=false;save()}
function restoreOfficialSession(){
 const stored=meta().officialExamActiveSession;if(!stored)return false;
 const entries=(stored.questionIds||[]).map(id=>officialEntry(id)).filter(Boolean),legacy=!stored.timerState,timerState=legacy?OFFICIAL_TIMER_STATES.RUNNING:stored.timerState,validTimerState=Object.values(OFFICIAL_TIMER_STATES).includes(timerState),runningTimesValid=timerState!==OFFICIAL_TIMER_STATES.RUNNING||(Number.isFinite(Number(stored.endTimeMs))&&Number(stored.endTimeMs)>0),restingTimeValid=timerState===OFFICIAL_TIMER_STATES.RUNNING||Number.isFinite(Number(stored.remainingMs)),valid=stored.mode==='exam'&&stored.timed===true&&entries.length===stored.questionIds?.length&&entries.length>0&&validTimerState&&runningTimesValid&&restingTimeValid&&OFFICIAL_ROUND_LEVELS.includes(stored.examLevel)&&entries.every(entry=>entry.sourceRecord.examRound===Number(stored.examRound)&&entry.sourceRecord.examLevel===stored.examLevel);
 if(!valid){clearOfficialStoredSession();save();return false}
 const validIds=new Set(entries.map(entry=>entry.canonicalQuestionId)),answers=Object.fromEntries(Object.entries(stored.answers||{}).filter(([id,answer])=>validIds.has(id)&&Number.isInteger(answer))),passedQuestionIds=(stored.passedQuestionIds||[]).filter((id,index,items)=>validIds.has(id)&&!Number.isInteger(answers[id])&&items.indexOf(id)===index);
 officialExamTab='round';officialExamRound=Number(stored.examRound);officialExamLevel=stored.examLevel;officialExamSession={mode:'exam',entries,index:Math.max(0,Math.min(entries.length-1,Number(stored.index)||0)),answers,feedback:{},graded:null,reviewQuestionId:null,timed:true,examRound:Number(stored.examRound),examLevel:stored.examLevel,startedAtMs:stored.startedAtMs==null?null:Number(stored.startedAtMs),endTimeMs:timerState===OFFICIAL_TIMER_STATES.RUNNING?Number(stored.endTimeMs):null,durationMs:Number(stored.durationMs)||OFFICIAL_EXAM_DURATION_MS,remainingMs:timerState===OFFICIAL_TIMER_STATES.RUNNING?Math.max(0,Number(stored.endTimeMs)-Date.now()):Math.max(0,Number(stored.remainingMs)),timerState,passedQuestionIds,initialPassComplete:Boolean(stored.initialPassComplete),submissionReason:null};officialExamView='practice';screen='exam-library';
 if(timerState===OFFICIAL_TIMER_STATES.RUNNING){if(officialRemainingMs()<=0)gradeOfficialSession('TIME_EXPIRED');else startOfficialTimer()}return true;
}
document.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button||button.disabled)return;const data=button.dataset;
 if(data.nav==='exam-library'||data.nav==='association'){event.stopImmediatePropagation();librarySession=null;if(data.nav==='exam-library'){if(officialTimedSession()&&!officialExamSession.graded)officialExamView='practice';else{officialExamView='home';officialExamSession=null}}else{associationDetailId=null;associationRecall=null;associationExpandedSteps=new Set()}screen=data.nav;modal=null;if(data.nav==='exam-library')globalThis.APP_ROUTE?.push('exam-library');render();window.scrollTo(0,0);return}
 if(data.officialTab){event.stopImmediatePropagation();officialExamTab=data.officialTab;officialExamView='home';officialExamLevel=data.officialTab==='round'?(OFFICIAL_ROUND_LEVELS[0]||'all'):'all';render();return}
 if(data.officialRoundLevel){event.stopImmediatePropagation();if(!OFFICIAL_ROUND_LEVELS.includes(data.officialRoundLevel))return;officialExamLevel=data.officialRoundLevel;render();return}
 if(data.officialEra){event.stopImmediatePropagation();officialExamTab='era';officialExamEra=data.officialEra;officialExamLevel='all';officialExamView='list';render();window.scrollTo(0,0);return}
 if(data.officialRound){event.stopImmediatePropagation();officialExamTab='round';officialExamRound=Number(data.officialRound);officialExamLevel=data.officialEditionLevel||'all';officialExamView='list';render();window.scrollTo(0,0);return}
 if(data.officialLevel){event.stopImmediatePropagation();officialExamLevel=data.officialLevel;render();return}
 if(data.officialBack){event.stopImmediatePropagation();officialExamSession=null;officialExamView=data.officialBack==='home'?'home':'list';render();window.scrollTo(0,0);return}
 if(data.officialStart){event.stopImmediatePropagation();startOfficialSession(officialSelectionEntries(),data.officialStart);return}
 if(data.officialTimerStart){event.stopImmediatePropagation();beginOrResumeOfficialTimer();return}
 if(data.officialTimerPause){event.stopImmediatePropagation();pauseOfficialTimer();return}
 if(data.officialTimerRestart){event.stopImmediatePropagation();if(!officialTimedSession())return;modal={type:'official-restart-confirm'};render();return}
 if(data.officialRestartCancel){event.stopImmediatePropagation();modal=null;render();return}
 if(data.officialRestartConfirm){event.stopImmediatePropagation();resetOfficialAttempt();return}
 if(data.officialSubmitCancel){event.stopImmediatePropagation();const move=Boolean(modal?.continueToUnanswered),target=move?officialUnansweredIds()[0]:null;modal=null;if(target){officialExamSession.initialPassComplete=true;officialSetCurrentQuestion(target)}else render();return}
 if(data.officialSubmitConfirm){event.stopImmediatePropagation();if(!officialExamInteractionAvailable())return;gradeOfficialSession('MANUAL');return}
 if(data.officialReview){event.stopImmediatePropagation();if(!officialExamSession?.graded)return;officialExamSession.reviewQuestionId=data.officialReview;officialExamView='review';render();window.scrollTo(0,0);return}
 if(data.officialReviewBack){event.stopImmediatePropagation();officialExamView='result';render();window.scrollTo(0,0);return}
 if(data.officialSingle){event.stopImmediatePropagation();const entry=officialEntry(data.officialSingle);if(entry)startOfficialSession([entry],'learn');return}
 if(data.officialPick!==undefined){event.stopImmediatePropagation();if(!officialExamInteractionAvailable())return;const entry=officialSessionQuestion();if(!entry)return;officialExamSession.answers[entry.canonicalQuestionId]=Number(data.officialPick);if(officialTimedSession()){officialExamSession.passedQuestionIds=officialPassedIds(officialExamSession);persistOfficialSession()}render();return}
 if(data.officialSubmit){event.stopImmediatePropagation();const entry=officialSessionQuestion(),answer=officialExamSession.answers[entry.canonicalQuestionId];if(answer===undefined)return;officialExamSession.feedback[entry.canonicalQuestionId]=recordOfficialAttempt(entry.canonicalQuestionId,answer);save();render();return}
 if(data.officialPass){event.stopImmediatePropagation();officialAdvanceQuestion({pass:true});return}
 if(data.officialRequestSubmit){event.stopImmediatePropagation();requestOfficialSubmission();return}
 if(data.officialNext){event.stopImmediatePropagation();if(officialTimedSession()){officialAdvanceQuestion();return}if(officialExamSession.mode==='exam'&&officialExamSession.index===officialExamSession.entries.length-1){gradeOfficialSession('MANUAL');return}if(officialExamSession.mode==='learn'&&officialExamSession.index===officialExamSession.entries.length-1){officialExamSession.graded={...officialExamSession.feedback};officialExamView='result';render();window.scrollTo(0,0);return}officialExamSession.index++;render();window.scrollTo(0,0);return}
 if(data.officialExit){event.stopImmediatePropagation();abandonOfficialSession();officialExamView='list';render();window.scrollTo(0,0);return}
 if(data.officialRetry){event.stopImmediatePropagation();const wrong=officialExamSession.entries.filter(entry=>!officialExamSession.graded?.[entry.canonicalQuestionId]);startOfficialSession(wrong.length?wrong:officialExamSession.entries,'learn');return}
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

globalThis.EXAM_MEMORY_UI_READY=true;
restoreOfficialSession();
render();
}
