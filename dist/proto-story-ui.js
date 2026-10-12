/* Proto revision flow uses the approved shared messenger renderer. */
if(globalThis.CORE_APP_READY===true&&globalThis.ANCIENT_UI_READY===true&&globalThis.PROTO_SAVE_V3){
(function(){
 const runtime=globalThis.PROTO_REVISION_RUNTIME,api=globalThis.PROTO_SAVE_V3;
 const {version,eraId,progressKey,storageKey,archiveStorageKey,contentVersion,copy,object,ownsChapter,ownsQuestion,familyRun,validRun,validLearningCursor,validBook,validResume,identifyRun,ensureBook,archive,answeredFromRecords}=api;
 const isProto=source=>source?.protoStoryVersion===version;
 const currentSource=()=>STORIES[run().pending?.sourceSceneId||run().storyId];
 const book=(model=state)=>ensureBook(model.meta);
 const phaseState=(source=currentSource(),model=state)=>{
  const value=model.run;
  value.protoStoryState||={version,scenes:{}};
  return value.protoStoryState.scenes[source.sceneId]||=( {phase:'main',choiceIndex:null} );
 };
 const phaseEntries=(source=currentSource(),current=phaseState(source))=>api.phaseEntries(source,current);
 function show(to='game'){screen=to;save();render();window.scrollTo(0,0);}
 function resetReading(source,phase){
  const current=phaseState(source);current.phase=phase;run().dialogueSceneId=phase==='branch'?'result:'+source.sceneId:source.sceneId;
  run().dialogueCursor=phase==='choice'?source.dialogues.length:1;run().protoTypedLineId=null;
 }
 function switchPhase(source,phase){resetReading(source,phase);show();return true;}
 function readCurrent(source){
  const current=phaseState(source),line=phaseEntries(source,current)[run().dialogueCursor-1];
  if(line&&['main','join'].includes(current.phase)&&!book().readLineIds.includes(line.lineId))book().readLineIds.push(line.lineId);
 }
 function markRead(source=currentSource()){
  const learned=book(),read=new Set(learned.readLineIds);
  if([...source.dialogues,...source.protoCommon].some(line=>!read.has(line.lineId)))return false;
  if(source.choices?.length&&!Number.isInteger(learned.choiceBySceneId[source.sceneId]))return false;
  if(!learned.readSceneIds.includes(source.sceneId))learned.readSceneIds.push(source.sceneId);return true;
 }
 function clearQueue(){
  Object.assign(run(),{questionQueue:[],questionQueueIndex:0,questionQueueResumeStoryId:null,activeQuestionId:null,activeQuestionSetId:null,questionAnswer:null,protoCheckpoint:null,protoAnswerDraft:null});
 }
 function advanceScene(source=currentSource()){
  if(!markRead(source))return false;
  phaseState(source).phase='finished';run().pending=null;clearQueue();
  if(source.completeChapter){finishChapter(state);save();navigate('complete');return true;}
  run().storyId=source.nextStoryId;resetReading(STORIES[run().storyId],'main');enterStory();show();return true;
 }
 function sourceForQuestion(q){
  if(q?.protoExam)return q.protoExam;
  if(runtime.questionByOfficialId.has(q?.officialQuestionId))return runtime.questionByOfficialId.get(q.officialQuestionId).protoExam;
  return runtime.source.examPlan.questions.find(item=>item.examRound===q?.examRound&&item.examLevel===q?.examLevel&&item.questionNumber===q?.questionNumber);
 }
 function questionFrom(value){return typeof value==='string'?QUESTIONS.find(q=>q.questionId===value)||runtime.questionByOfficialId.get(value):value;}
 function canPractice(value){
  const q=questionFrom(value),authored=sourceForQuestion(q);
  if(!authored)return !ownsChapter(q?.chapterId);
  return authored.proposed.requiresReadSceneIds.every(id=>book().readSceneIds.includes(id));
 }
 function canRecall(value){
  if(typeof value==='string'&&runtime.sources.has(value))return book().readSceneIds.includes(value);
  const q=questionFrom(value);
  if(!q)return false;
  if(!ownsChapter(q.chapterId))return true;
  return book().readSceneIds.includes(q.relatedSceneId)&&canPractice(q);
 }
 function openQuestion(id){
  run().activeQuestionId=id;run().questionAnswer=null;run().protoAnswerDraft=null;
  const officialId=QUESTIONS.find(q=>q.questionId===id).officialQuestionId;
  if(!book().openedQuestionIds.includes(officialId))book().openedQuestionIds.push(officialId);
 }
 function checkpoint(source=currentSource()){
  const point=source.protoQueue;
  if(!point||!markRead(source)||!book().readLineIds.includes(point.afterLineId))return false;
  book().answeredQuestionIds=[...new Set([...book().answeredQuestionIds,...answeredFromRecords(meta())])];
  const answered=run().mode==='replay'?new Set():new Set(book().answeredQuestionIds);
  const unanswered=point.officialQuestionIds.filter(id=>!answered.has(id)&&!Object.hasOwn(run().questionResults||{},runtime.questionByOfficialId.get(id)?.questionId)).map(id=>runtime.questionByOfficialId.get(id));
  if(!unanswered.length)return false;
  // Story queues are authorised by this scene; optional review still uses canPractice().
  run().pending=null;phaseState(source).phase='quiz';run().dialogueCursor=Math.min(source.dialogues.length,run().dialogueCursor);
  run().protoCheckpoint={kind:'first',sceneId:source.sceneId,afterLineId:point.afterLineId};
  run().questionQueue=unanswered.map(q=>q.questionId);run().questionQueueIndex=0;run().questionQueueResumeStoryId=source.nextStoryId;run().activeQuestionSetId=source.questionSetId;
  openQuestion(run().questionQueue[0]);quizMode='story';show('quiz');return true;
 }
 function endCommon(source){if(!markRead(source))return false;if(checkpoint(source))return true;return advanceScene(source);}
 function advance(){
  const source=currentSource();if(!isProto(source)||screen!=='game'||modal)return false;
  if(finishOpeningTyping())return true;
  const current=phaseState(source),entries=phaseEntries(source,current);
  if(current.phase==='choice')return false;
  readCurrent(source);
  if(run().dialogueCursor<entries.length){run().dialogueCursor++;show();return true;}
  if(current.phase==='main'){
   if(source.choices?.length)return switchPhase(source,'choice');
   if(source.protoCommon.length)return switchPhase(source,'join');
   return endCommon(source);
  }
  if(current.phase==='branch'){run().pending=null;if(source.protoCommon.length)return switchPhase(source,'join');return endCommon(source);}
  if(current.phase==='join')return endCommon(source);
  return false;
 }
 function choose(index){
  const source=currentSource();if(!isProto(source)||phaseState(source).phase!=='choice'||!Number.isInteger(index)||!source.choices?.[index])return false;
  if(finishOpeningTyping())return false;
  phaseState(source).choiceIndex=index;book().choiceBySceneId[source.sceneId]=index;applyChoice(state,source.sceneId,index);return switchPhase(source,'branch');
 }
 const beforeEntries=conversationEntries;
 conversationEntries=function(source,p){return isProto(source)?phaseEntries(source,phaseState(source)):beforeEntries(source,p);};
 const beforeNext=nextStory;nextStory=function(){return isProto(currentSource())?advance():beforeNext();};
 const beforeSequence=startQuestionSequence;startQuestionSequence=function(source){return isProto(source)?checkpoint(source):beforeSequence(source);};
 const beforeContinue=continueStoryQuestion;
 continueStoryQuestion=function(){
  const source=currentSource();if(!isProto(source)||phaseState(source).phase!=='quiz')return beforeContinue();
  if(run().questionAnswer===null)return false;
  if(run().questionQueueIndex+1<run().questionQueue.length){run().questionQueueIndex++;openQuestion(run().questionQueue[run().questionQueueIndex]);show('quiz');return true;}
  return advanceScene(source);
 };
 const beforeRecord=recordQuestion;
 recordQuestion=function(model,id,answer){
  const q=QUESTIONS.find(q=>q.questionId===id);
  if(isProto(q)&&(!Number.isInteger(answer)||answer<0||answer>=q.choices.length))return false;
  const result=beforeRecord(model,id,answer),authored=sourceForQuestion(q);
  if(authored&&Number.isInteger(answer)&&answer>=0&&answer<authored.choiceCount){
   if(!book(model).openedQuestionIds.includes(authored.officialQuestionId))book(model).openedQuestionIds.push(authored.officialQuestionId);
   if(!book(model).answeredQuestionIds.includes(authored.officialQuestionId))book(model).answeredQuestionIds.push(authored.officialQuestionId);
  }
  return result;
 };
 for(const [q,art] of PROTO_LEGACY_QUESTION_ART)q.relatedIllustrationId=art;
 for(const q of runtime.questionByOfficialId.values()){
  q.answer=q.protoExam.answerIndex0;q.choices=Array.from({length:q.protoExam.choiceCount},(_,index)=>(index+1)+'번');
  q.explanation=q.protoExam.proposed.playExplanation;q.wrongFeedback=q.protoExam.proposed.playExplanation;
 }
 api.configureSeason(HISTORY_SEASONS);api.configureSeason(LEARNING_ERAS);
 function readStorage(key){try{return localStorage.getItem(key);}catch{return null;}}
 function writeStorage(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{toast('저장 공간을 사용할 수 없습니다. 브라우저 설정을 확인해 주세요.');return false;}}
 let persistedArchiveSignature=null;
 function persistArchives(){
  const archives=meta().protoSaveArchives;if(!archives?.entries?.length)return true;
  const signature=JSON.stringify(archives.entries.map(({id,sourceKey,capturedAt,reasonCode})=>[id,sourceKey,capturedAt,reasonCode]));
  if(signature===persistedArchiveSignature)return true;
  if(!writeStorage(archiveStorageKey,archives))return false;persistedArchiveSignature=signature;return true;
 }
 function restoreArchives(){
  const text=readStorage(archiveStorageKey);if(!text)return;
  let value;try{value=JSON.parse(text);}catch{archive(meta(),'unreadable-json',archiveStorageKey,{raw:text});return;}
  if(!object(value)||value.schemaVersion!==1||!Array.isArray(value.entries)||value.entries.some(entry=>!object(entry))){archive(meta(),'unknown-schema',archiveStorageKey,value);return;}
  for(const entry of value.entries)if(typeof entry.sourceKey==='string'&&Object.hasOwn(entry,'payload')){const recovered=archive(meta(),entry.reasonCode,entry.sourceKey,entry.payload);if(entry.capturedAt)recovered.capturedAt=entry.capturedAt;}
 }
 function scopedMeta(){
  const m=meta(),select=(value,predicate)=>Object.fromEntries(Object.entries(value||{}).filter(([id])=>predicate(id)));
  return {completedChapters:(m.completedChapters||[]).filter(ownsChapter),chapterRecords:select(m.chapterRecords,ownsChapter),chapterRuns:select(m.chapterRuns,ownsChapter),questionRecords:select(m.questionRecords,ownsQuestion),wrongQuestionIds:(m.wrongQuestionIds||[]).filter(ownsQuestion),wrongAnswers:(m.wrongAnswers||[]).filter(item=>ownsQuestion(item.questionId)),reviewedQuestionIds:(m.reviewedQuestionIds||[]).filter(ownsQuestion),learningEvents:(m.learningEvents||[]).filter(item=>ownsQuestion(item.questionId)),protoRevisionBook:book()};
 }
 function persistIndependentResume(){
  const progress=meta().eraProgress?.[progressKey];if(!validResume(progress?.resume,book()))return false;
  if(!persistArchives())return false;
  return writeStorage(storageKey,{schemaVersion:3,eraId,contentVersion:3,contentRevision:contentVersion,progress,meta:scopedMeta()});
 }
 function mergeRecoveryMeta(stored){
  const m=meta();
  for(const key of ['completedChapters','wrongQuestionIds','reviewedQuestionIds']){const predicate=key==='completedChapters'?ownsChapter:ownsQuestion;m[key]=[...new Set([...(m[key]||[]),...(stored[key]||[]).filter(predicate)])];}
  for(const key of ['questionRecords','chapterRecords']){m[key]||={};for(const [id,record] of Object.entries(stored[key]||{})){if(!(key==='questionRecords'?ownsQuestion(id):ownsChapter(id)))continue;const field=key==='questionRecords'?'attempts':'runsCount';if(!m[key][id]||(record[field]||0)>(m[key][id][field]||0))m[key][id]=copy(record);}}
  m.chapterRuns||={};for(const [id,records] of Object.entries(stored.chapterRuns||{})){if(!ownsChapter(id)||!Array.isArray(records))continue;const combined=[...(m.chapterRuns[id]||[])],ids=new Set(combined.map(item=>item.runId+':'+item.completedAt));for(const record of records)if(!ids.has(record.runId+':'+record.completedAt))combined.push(copy(record));m.chapterRuns[id]=combined;}
  const wrong=new Map((m.wrongAnswers||[]).map(item=>[item.questionId,item]));for(const item of stored.wrongAnswers||[])if(ownsQuestion(item.questionId)&&(!wrong.has(item.questionId)||String(item.answeredAt||'')>String(wrong.get(item.questionId).answeredAt||'')))wrong.set(item.questionId,copy(item));m.wrongAnswers=[...wrong.values()];
  const events=[...(m.learningEvents||[])],ids=new Set(events.map(api.fingerprint));for(const item of stored.learningEvents||[])if(ownsQuestion(item.questionId)&&!ids.has(api.fingerprint(item))){events.push(copy(item));ids.add(api.fingerprint(item));}m.learningEvents=events;
  if(validBook(stored.protoRevisionBook)){const learned=book(),recovered=stored.protoRevisionBook;for(const key of ['readSceneIds','readLineIds','openedQuestionIds','answeredQuestionIds'])learned[key]=[...new Set([...learned[key],...recovered[key]])];learned.choiceBySceneId={...recovered.choiceBySceneId,...learned.choiceBySceneId};}
 }
 function recoverIndependentResume(){
  const previous=meta().eraProgress?.[progressKey];if(validResume(previous?.resume,book())&&!previous.resume.run.protoNeedsResumeRecovery)return false;
  if(previous){archive(meta(),'invalid-resume','eraProgress.'+progressKey,previous);delete meta().eraProgress[progressKey];}
  const text=readStorage(storageKey);if(!text)return false;let stored;
  try{stored=JSON.parse(text);}catch{archive(meta(),'unreadable-json',storageKey,{raw:text});persistArchives();return false;}
  if(!object(stored)||stored.schemaVersion!==3||stored.eraId!==eraId||stored.contentVersion!==3||stored.contentRevision!==contentVersion){archive(meta(),'unknown-schema',storageKey,stored);persistArchives();return false;}
  if(!validBook(stored.meta?.protoRevisionBook)||!validResume(stored.progress?.resume,stored.meta.protoRevisionBook)){archive(meta(),'invalid-resume',storageKey,stored);persistArchives();return false;}
  meta().eraProgress||={};meta().eraProgress[progressKey]=copy(stored.progress);mergeRecoveryMeta(stored.meta);return true;
 }
 const beforeRemember=rememberEraProgress;
 rememberEraProgress=function(){
  if(!familyRun(mainRun()))return beforeRemember();
  if(!validRun(mainRun()))return;
  const resume=ownsChapter(run().currentChapter)?{run:copy(run()),mainRun:copy(state.mainRun)}:{run:copy(mainRun()),mainRun:null};
  if(!validResume(resume))return;
  const m=meta(),previous=m.eraProgress?.[progressKey]||{};m.eraProgress||={};
  m.eraProgress[progressKey]={...previous,contentVersion:3,contentRevision:contentVersion,lastChapter:mainRun().currentChapter,lastScene:mainRun().storyId,progress:eraProgress(eraId),resume,updatedAt:previous.updatedAt||null};
  if(['game','quiz','complete'].includes(screen)&&mainRun().started){m.eraProgress[progressKey].updatedAt=new Date().toISOString();m.lastLearningEra=eraId;}
 };
 const beforeSave=save;
 save=function(){
  for(const value of [run(),state.mainRun])if(familyRun(value)){const pristine=!value.protoStoryState&&!value.visited?.length&&!value.pending&&!value.activeQuestionId&&(value.dialogueCursor||1)===1;identifyRun(value,pristine);}
  book();beforeSave();persistIndependentResume();
 };
 const beforeEnter=enterStory;
 enterStory=function(){
  if(!familyRun(run()))return beforeEnter();
  const value=run(),source=STORIES[value.storyId];if(source?.legacyAliasFor)value.storyId=source.legacyAliasFor;
  identifyRun(value);phaseState(currentSource());
  const savedCursor=value.dialogueCursor;value.dialogueSceneId=value.pending?'result:'+value.pending.sourceSceneId:value.storyId;
  const result=beforeEnter();value.dialogueCursor=savedCursor;return result;
 };
 const beforeResume=resumeEra;
 resumeEra=function(id){
  if(id!==eraId)return beforeResume(id);
  if(familyRun(run())&&validRun(run())&&state.mainRun&&!familyRun(state.mainRun)){selectedEra=id;meta().selectedLearningEra=id;save();return play();}
  if(!familyRun(mainRun())||!validRun(mainRun()))rememberEraProgress();
  recoverIndependentResume();const saved=meta().eraProgress?.[progressKey]?.resume;
  if(!familyRun(mainRun())||!validLearningCursor(mainRun(),book())){
   if(validResume(saved,book())){state.run=copy(saved.run);state.mainRun=copy(saved.mainRun);}
   else{state.run=api.freshRun(true);state.mainRun=null;}
  }
  delete run().protoNeedsResumeRecovery;selectedEra=id;meta().selectedLearningEra=id;save();return playMain();
 };
 restoreArchives();
 for(const key of ['lived-history-proto-kingdoms-v2','lived-history-proto-kingdoms']){const text=readStorage(key);if(text){try{archive(meta(),'legacy-content',key,JSON.parse(text));}catch{archive(meta(),'unreadable-json',key,{raw:text});}}}
 for(const key of [eraId,'proto-kingdoms-v2'])if(meta().eraProgress?.[key])archive(meta(),'legacy-content','eraProgress.'+key,meta().eraProgress[key]);
 const recoveryPending=run().protoNeedsResumeRecovery;recoverIndependentResume();
 if(recoveryPending&&validResume(meta().eraProgress?.[progressKey]?.resume,book())&&!meta().eraProgress[progressKey].resume.run.protoNeedsResumeRecovery){state.run=copy(meta().eraProgress[progressKey].resume.run);state.mainRun=copy(meta().eraProgress[progressKey].resume.mainRun);}
 delete run().protoNeedsResumeRecovery;book();identifyRun(run());identifyRun(state.mainRun);persistArchives();
 const beforeCharacterStage=characterStage;
 characterStage=function(visible,source,complete,p,assetId,allEntries,cursor){
  if(!isProto(source))return beforeCharacterStage(visible,source,complete,p,assetId,allEntries,cursor);
  if(source.flashback)return '';
  const entries=allEntries||conversationEntries(source,p),index=Math.max(0,Math.min((cursor||run().dialogueCursor||1)-1,entries.length-1)),active=entries[index];
  if(!active||active.speakerType==='narration')return '';
  const standing=(entry,position)=>({...entry,position,show:true,presentation:'standing'}),spoken=entry=>['player','thought','npc'].includes(entry?.speakerType);
  const nearby=[];for(let distance=1;distance<entries.length;distance++){if(index-distance>=0&&spoken(entries[index-distance]))nearby.push(entries[index-distance]);if(index+distance<entries.length&&spoken(entries[index+distance]))nearby.push(entries[index+distance]);}
  let cast;if(active.speakerType==='npc'){const peer=nearby[0];cast=[standing(active,'left')];if(peer&&['player','thought'].includes(peer.speakerType))cast.push(standing(peer,'right'));}
  else{const peer=nearby.find(entry=>entry.speakerType==='npc')||(p?(source.dialogues||[]).findLast(entry=>entry.speakerType==='npc'):null);cast=[...(peer?[standing(peer,'left')]:[]),standing(active,'right')];}
  const portraits=cast.map(entry=>stagePortrait(entry,entry.position,entry.characterId===active.characterId)).join('');
  return portraits?'<div class="character-stage" data-slot-mode="proto-conversation" aria-hidden="true">'+portraits+'</div>':'';
 };
 const beforeGame=game;
 game=function(){
  const source=currentSource();if(!isProto(source))return beforeGame();
  const current=phaseState(source),continueLabel=current.phase==='main'&&source.choices?.length?'응답 고르기':source.protoQueue&&['main','join'].includes(current.phase)?'🧠 기억을 더듬는다':'다음 이야기';
  // A temporary view feeds the shared renderer; the complete immutable source stays installed.
  const view={...source,choices:['choice','branch'].includes(current.phase)?source.choices:null,continueLabel};
  STORIES[source.sceneId]=view;
  try{return beforeGame().replace('class="game conversation-game ','class="game conversation-game proto-revision-game ').replace('data-illustration=','data-proto-scene="'+esc(source.sceneId)+'" data-proto-phase="'+current.phase+'" data-illustration=');}
  finally{STORIES[source.sceneId]=source;}
 };
 const beforeSourceLabel=questionSourceLabel;
 questionSourceLabel=function(q){return isProto(q)?'한능검 대비 · 실제 기출':beforeSourceLabel(q);};
 const beforeFigure=officialQuestionFigure;
 officialQuestionFigure=function(q,label){
  if(!isProto(q))return beforeFigure(q,label);
  return beforeFigure(q,label).replace(
   'class="official-source-question"',
   'class="official-source-question proto-original-question"'
  );
 };
 function safeExplanation(q){const authored=sourceForQuestion(q);return authored?authored.proposed.playExplanation:q?.explanation||'';}
 const comparisonUnlocked=()=>book().readSceneIds.includes('proto_ch06_s7');
 function startReview(id){
  const q=questionFrom(id);if(!isProto(q)||!canPractice(q))return false;
  if(!meta().protoReviewSession)meta().protoReviewSession={questionId:q.questionId,draft:null,answer:null,returnTo:{screen,quizMode,reviewQuestionId,reviewAnswer,modal:copy(modal)}};
  else Object.assign(meta().protoReviewSession,{questionId:q.questionId,draft:null,answer:null});
  reviewQuestionId=q.questionId;reviewAnswer=null;quizMode='review';modal=null;show('quiz');return true;
 }
 function finishReview(){
  const session=meta().protoReviewSession;if(!session)return false;
  const target=session.returnTo;delete meta().protoReviewSession;
  screen=target.screen;quizMode=target.quizMode;reviewQuestionId=target.reviewQuestionId;reviewAnswer=target.reviewAnswer;modal=copy(target.modal);save();render();return true;
 }
 function submitAnswer(){
  const session=meta().protoReviewSession,q=session?QUESTIONS.find(q=>q.questionId===session.questionId):activeQuestion();
  if(!isProto(q))return false;
  const answer=session?session.draft:run().protoAnswerDraft,done=session?session.answer:run().questionAnswer;
  if(done!==null||!Number.isInteger(answer)||answer<0||answer>=q.choices.length)return false;
  if(session){recordQuestion({...state,run:copy(run())},q.questionId,answer);session.answer=answer;reviewAnswer=answer;}
  else recordQuestion(state,q.questionId,answer);
  save();render();return true;
 }
 const beforeQuiz=quiz;
 quiz=function(){
  const q=activeQuestion();if(!isProto(q))return beforeQuiz();
  const session=meta().protoReviewSession,answer=session?session.answer:run().questionAnswer,draft=session?session.draft:run().protoAnswerDraft,done=answer!==null;
  const total=session?1:run().questionQueue.length,index=session?0:run().questionQueueIndex,ch=CHAPTERS[q.chapterId];
  const options=q.choices.map((label,i)=>'<button class="choice '+(done&&i===q.answer?'correct':done&&i===answer?'wrong':!done&&draft===i?'picked':'')+'" data-proto-answer="'+i+'" aria-pressed="'+(!done&&draft===i)+'" '+(done?'disabled':'')+'><span class="answer-number">'+(i+1)+'</span><span>'+esc(label)+'</span>'+(done&&i===q.answer?'<b>✓</b>':'')+'</button>').join('');
  const choiceDetails=done&&globalThis.OFFICIAL_EXAM_UI?.choiceExplanations?globalThis.OFFICIAL_EXAM_UI.choiceExplanations(q,answer):'';
  const feedback=done?'<div class="feedback"><h2>'+(answer===q.answer?'✓ 정답입니다.':'✕ 오답입니다.')+'</h2><p>선택한 답 '+(answer+1)+'번 · 정답 '+(q.answer+1)+'번</p><p>'+esc(safeExplanation(q))+'</p>'+choiceDetails+(comparisonUnlocked()?'<button class="text-btn" data-proto-comparison="'+esc(q.officialQuestionId)+'">여러 나라 비교 해설</button>':'')+'<button class="primary next" data-action="proto-quiz-next">'+(session?'기록책으로 돌아가기':index+1<total?'다음 문제':'이야기 계속')+'</button></div>':'<div class="quiz-submit-row"><button class="confirm-answer" data-action="proto-submit" '+(draft==null?'disabled':'')+'>답 확인하기</button></div>';
  return '<section class="editorial-quiz proto-revision-quiz"><header class="quiz-top"><button '+(session?'data-action="proto-review-close"':'data-nav="era"')+' aria-label="학습 화면으로 돌아가기">‹</button><span>CH.'+ch.number+' '+esc(ch.title)+'</span><button data-action="status" aria-label="내 상태 보기">'+editorialIcon('profile')+'</button></header><div class="quiz-progress"><div class="progress"><span style="width:'+Math.round((index+1)/total*100)+'%"></span></div><small>'+(index+1)+' / '+total+'</small></div><div class="exam-source-row"><span class="official-pill">실제 한능검 기출</span><span>'+esc(q.protoExam.label)+'</span></div><p class="proto-answer-instruction">원본 이미지의 지문과 보기를 모두 읽고, 같은 번호를 선택해 주세요.</p>'+officialQuestionFigure(q)+'<div class="ed-answer-options" role="group" aria-label="답 선택">'+options+'</div>'+feedback+'<p class="proto-source">출처: 국사편찬위원회 한국사능력검정시험</p></section>';
 };
 function learnedTopics(){return runtime.source.learning.filter(item=>book().readSceneIds.includes(item.firstSceneId));}
 function allowLegacyAction(dataset){
  const id=dataset?.review||dataset?.practice;if(id){const q=questionFrom(id);if((ownsChapter(q?.chapterId)||sourceForQuestion(q))&&!canPractice(q))return false;}
  const memory=dataset?.storyMemory;if(memory){const q=questionFrom(memory);if(ownsChapter(q?.chapterId)&&!canRecall(q))return false;}
  return true;
 }
 globalThis.PROTO_LEARNING_BOUNDARY={canPractice,canRecall,allowLegacyAction,explanation:safeExplanation,contextualExplanation:safeExplanation};
 const beforeRow=v2QuestionRow;v2QuestionRow=function(q){return beforeRow(sourceForQuestion(q)?{...q,explanation:safeExplanation(q)}:q);};
 const beforeFeedback=officialFeedbackBlock;officialFeedbackBlock=function(q,right,selected){return beforeFeedback(sourceForQuestion(q)?{...q,explanation:safeExplanation(q)}:q,right,selected);};
 const beforeExperienced=experiencedConcepts;
 experiencedConcepts=function(id){
  if(id!==eraId)return beforeExperienced(id);
  return learnedTopics().map(item=>[item.title,{questionId:'proto-learning-'+item.id,chapterId:STORIES[item.firstSceneId].chapterId,relatedSceneId:item.firstSceneId,concepts:[item.title],conceptIds:[item.id],protoLearningId:item.id,question:item.title}]);
 };
 const beforeEras=eras;
 eras=function(){const html=beforeEras();if(selectedEra!==eraId)return html;return html.replace(/data-story-memory="proto-learning-([^"]+)"/g,'data-proto-learning="$1"')+'<button class="secondary full proto-book-link" data-action="proto-recordbook">원삼국 기록책</button>';};
 const beforeExamList=eraExamList;
 eraExamList=function(id){if(id!==eraId)return beforeExamList(id);const questions=[...runtime.questionByOfficialId.values()].filter(canPractice);return '<div class="ed-exam-list">'+(questions.length?questions.map(q=>{const thumbnail=globalThis.OFFICIAL_EXAM_UI?.thumbnail?.(q)||q.sourceQuestionImage;return '<article class="ed-exam-row"><button data-proto-review="'+q.questionId+'"><img loading="lazy" decoding="async" src="'+esc(thumbnail)+'" alt="원본 문항 미리보기"><span><small>'+esc(q.protoExam.label)+'</small><b>'+esc(q.protoExam.editorialFocusSummary)+'</b><small>'+(book().answeredQuestionIds.includes(q.officialQuestionId)?'풀이 완료':'미풀이')+'</small></span><span>›</span></button></article>'}).join(''):'<p class="ed-empty">이야기에서 공통 학습을 마치면 관련 기출이 열립니다.</p>')+'</div>';};
 const beforeComplete=complete;
 complete=function(){
  const id=resultChapterId||run().currentChapter;if(!ownsChapter(id))return beforeComplete();
  const info=CHAPTERS[id],r=resultRun(id),questions=[...runtime.questionByOfficialId.values()].filter(q=>q.chapterId===id),attempted=questions.filter(q=>Object.hasOwn(r.questionResults||{},q.questionId)),correct=attempted.filter(q=>r.questionResults[q.questionId]).length;
  return '<section class="complete late-complete ancient-complete"><div class="seal">原</div><div class="eyebrow complete-label">CHAPTER '+info.number+' CLEAR</div><h1>'+esc(info.title)+'</h1><p>단과 함께 걸은 길, 사람들에게 배운 역사</p><div class="chapter-learning"><div><small>이야기</small><strong>'+chapterScenes(id).length+'씬</strong></div><div><small>실제 기출</small><strong>'+questions.length+'문항</strong></div><div><small>복습 정답</small><strong>'+correct+' / '+attempted.length+'</strong></div></div><button class="secondary full" data-action="proto-recordbook">원삼국 기록책</button>'+resultFooter(id)+'</section>';
 };
 function bubble(line){return '<div class="proto-book-bubble '+(line.speaker==='주인공'?'player':line.speaker==='나레이션'?'narration':'npc')+'"><strong>'+esc(line.speaker)+'</strong><p>'+esc(line.text)+'</p></div>';}
 function recordbook(){
  const tab=modal?.tab||'learning',learned=book();
  let body='';
  if(tab==='learning')body=learnedTopics().map(item=>'<details class="proto-topic"><summary>'+esc(item.title)+'</summary>'+item.facts.map(fact=>'<p>'+esc(fact)+'</p>').join('')+'<button class="text-btn" data-proto-recall="'+item.firstSceneId+'">그 장면 다시 읽기</button></details>').join('')||'<p>공통 대사를 읽으며 배운 내용이 이곳에 모입니다.</p>';
  if(tab==='choices')body=Object.entries(learned.choiceBySceneId).map(([id,index])=>{const source=runtime.sources.get(id),choice=source.protoSource.choices[index];return '<article class="proto-choice-memory"><h3>'+esc(source.title)+'</h3><blockquote>'+esc(choice.label)+'</blockquote>'+choice.reply.map(bubble).join('')+'<button class="text-btn" data-proto-recall="'+id+'" '+(learned.readSceneIds.includes(id)?'':'disabled')+'>공통 장면 다시 읽기</button></article>';}).join('')||'<p>고른 말과 그에 대한 반응이 이곳에 남습니다.</p>';
  if(tab==='questions')body=eraExamList(eraId);
  const archives=meta().protoSaveArchives?.entries?.length||0;
  return '<div class="modal-overlay"><section class="modal proto-recordbook" role="dialog" aria-modal="true" aria-label="원삼국 기록책"><header><div><small>원삼국 기록책</small><h2>함께 읽고 고른 기억</h2></div><button data-action="close">닫기</button></header><div class="proto-book-counts"><span>읽은 장면 '+learned.readSceneIds.length+' / 83</span><span>배운 내용 '+learnedTopics().length+' / 31</span><span>푼 기출 '+learned.answeredQuestionIds.length+' / 23</span></div><nav class="proto-book-tabs">'+[['learning','배운 내용'],['choices','내가 고른 말'],['questions','실제 기출']].map(([id,label])=>'<button data-proto-book-tab="'+id+'" aria-current="'+(id===tab)+'">'+label+'</button>').join('')+'</nav>'+body+(archives?'<p class="proto-archive-note">이전 버전의 기록 '+archives+'개를 보관했습니다. 이전 풀이 기록은 누적 학습 기록에 남아 있습니다.</p>':'')+'</section></div>';
 }
 const beforeModal=modalHTML;
 modalHTML=function(){
  if(modal?.type==='proto-recordbook')return recordbook();
  if(modal?.type==='proto-learning'){
   const item=runtime.learningById.get(modal.learningId);if(!item||!book().readSceneIds.includes(item.firstSceneId))return '';
   return '<div class="modal-overlay"><section class="modal proto-recordbook" role="dialog" aria-modal="true" aria-label="배운 내용"><header><h2>'+esc(item.title)+'</h2><button data-action="close">닫기</button></header>'+item.facts.map(fact=>'<p>'+esc(fact)+'</p>').join('')+'<button class="secondary full" data-proto-recall="'+item.firstSceneId+'">그 장면 다시 읽기</button></section></div>';
  }
  if(modal?.type==='proto-recall'){
   const source=runtime.sources.get(modal.sceneId);if(!source||!book().readSceneIds.includes(source.sceneId))return '';
   return '<div class="modal-overlay"><section class="modal proto-recordbook" role="dialog" aria-modal="true" aria-label="읽은 장면"><header><h2>'+esc(source.title)+'</h2><button data-action="proto-recordbook">기록책</button></header>'+[...source.protoSource.main,...source.protoSource.join].map(bubble).join('')+'</section></div>';
  }
  if(modal?.type==='proto-comparison'||modal?.type==='proto-independent'){
   const q=runtime.questionByOfficialId.get(modal.officialId),allowed=q&&book().answeredQuestionIds.includes(q.officialQuestionId)&&comparisonUnlocked();
   let content='<p>삼한에서 여러 나라의 공통 학습을 마친 뒤 비교 해설이 열립니다.</p>';
   if(allowed)content=modal.type==='proto-independent'?'<p class="proto-independent-notice">이곳은 이야기 진행과 별도로 여는 독립 학습입니다. 본편 밖 보기의 설명을 포함할 수 있습니다.</p><p>'+esc(q.protoIndependentExplanation)+'</p>':runtime.source.learning.filter(item=>q.protoLearningIds.includes(item.id)).map(item=>'<h3>'+esc(item.title)+'</h3>'+item.facts.map(fact=>'<p>'+esc(fact)+'</p>').join('')).join('')+'<button class="secondary full" data-proto-independent="'+q.officialQuestionId+'">독립 학습에서 전체 해설 보기</button>';
   return '<div class="modal-overlay"><section class="modal proto-recordbook" role="dialog" aria-modal="true" aria-label="원삼국 기출 해설"><header><h2>'+esc(q?.protoExam.label||'기출 해설')+'</h2><button data-action="proto-recordbook">기록책</button></header>'+content+'</section></div>';
  }
  return beforeModal();
 };
 document.addEventListener('click',event=>{
  const button=event.target.closest('button'),dataset=button?.dataset;
  const handled=callback=>{event.stopImmediatePropagation();event.preventDefault?.();if(button?.disabled)return;callback();};
  if(dataset?.action==='proto-recordbook')return handled(()=>{modal={type:'proto-recordbook',tab:'learning'};render();});
  if(dataset?.protoBookTab)return handled(()=>{modal={type:'proto-recordbook',tab:dataset.protoBookTab};render();});
  if(dataset?.protoLearning)return handled(()=>{modal={type:'proto-learning',learningId:dataset.protoLearning};render();});
  if(dataset?.protoRecall)return handled(()=>{if(book().readSceneIds.includes(dataset.protoRecall)){modal={type:'proto-recall',sceneId:dataset.protoRecall};render();}});
  if(dataset?.protoComparison)return handled(()=>{modal={type:'proto-comparison',officialId:dataset.protoComparison};render();});
  if(dataset?.protoIndependent)return handled(()=>{modal={type:'proto-independent',officialId:dataset.protoIndependent};render();});
  if(dataset?.protoReview)return handled(()=>startReview(dataset.protoReview));
  if(dataset?.review||dataset?.practice){const q=questionFrom(dataset.review||dataset.practice);if(ownsChapter(q?.chapterId))return handled(()=>{const current=sourceForQuestion(q);if(current)startReview(runtime.questionByOfficialId.get(current.officialQuestionId).questionId);});}
  if(dataset?.action==='proto-review-close')return handled(finishReview);
  if(dataset?.protoAnswer!==undefined)return handled(()=>{const q=activeQuestion(),value=Number(dataset.protoAnswer);if(!isProto(q)||!Number.isInteger(value)||value<0||value>=q.choices.length)return;const session=meta().protoReviewSession;if(session){if(session.answer!==null)return;session.draft=value;}else{if(run().questionAnswer!==null)return;run().protoAnswerDraft=value;}save();render();});
  if(dataset?.action==='proto-submit')return handled(submitAnswer);
  if(dataset?.action==='proto-quiz-next')return handled(()=>meta().protoReviewSession?finishReview():continueStoryQuestion());
  if(screen!=='game'||!isProto(currentSource())||modal)return;
  if(dataset?.choice!==undefined)return handled(()=>choose(Number(dataset.choice)));
  if(['advance-dialogue','next','result-next'].includes(dataset?.action)||!button&&event.target.closest('.conversation-game'))return handled(advance);
 },true);
 if(meta().protoReviewSession){const session=meta().protoReviewSession;if(isProto(QUESTIONS.find(q=>q.questionId===session.questionId))&&canPractice(session.questionId)){reviewQuestionId=session.questionId;reviewAnswer=session.answer;quizMode='review';screen='quiz';modal=null;}}
 globalThis.PROTO_REVISION_ACTIONS={book,phaseState,phaseEntries,advance,choose,checkpoint,markRead,advanceScene,canPractice,canRecall,learnedTopics,safeExplanation,comparisonUnlocked,submitAnswer,startReview,finishReview,currentSource,switchPhase};
 globalThis.PROTO_ERA_ISOLATION={progressKey,storageKey,archiveStorageKey,validResume,recoverIndependentResume,persistIndependentResume};
 globalThis.PROTO_STORY_UI_READY=true;render();
})();
}
