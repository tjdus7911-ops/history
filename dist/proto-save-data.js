/* Versioned Proto progress is validated before the common save migration. */
if(globalThis.PROTO_REVISION_RUNTIME?.version===3){
(function(){
 const runtime=globalThis.PROTO_REVISION_RUNTIME;
 const version=3,eraId='proto-kingdoms',progressKey='proto-kingdoms-v4',storageKey='lived-history-proto-kingdoms-v4',archiveStorageKey='lived-history-proto-kingdoms-archives-v4',contentVersion=runtime.contentVersion,legacyContentVersion=PROTO_LEGACY_CONTENT_VERSION,firstChapterId='proto-ch01';
 const copy=value=>value==null?value:JSON.parse(JSON.stringify(value)),object=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
 const ownsChapter=id=>typeof id==='string'&&id.startsWith('proto-ch'),ownsScene=id=>runtime.sources.has(id);
 const ownsQuestion=id=>ownsChapter(QUESTIONS.find(q=>q.questionId===id)?.chapterId);
 const familyRun=value=>!!value&&(ownsChapter(value.currentChapter)||value.contentEra===eraId);
 const questionIds={has:id=>ownsQuestion(id)},officialIds={has:id=>runtime.questionByOfficialId.has(id)||runtime.legacyOfficialIds.has(id)},lineIds=new Set(),commonIds=new Set(),learningIds=new Set(runtime.source.learning.map(item=>item.id));
 for(const source of runtime.sources.values()){
  for(const line of [...source.dialogues,...source.protoCommon]){lineIds.add(line.lineId);commonIds.add(line.lineId);}
  for(const choice of source.choices||[])for(const line of choice.resultDialogues)lineIds.add(line.lineId);
 }
 const stringArray=value=>Array.isArray(value)&&value.every(item=>typeof item==='string');
 const phases=new Set(['main','choice','branch','join','quiz','outro','finished']);
 function fingerprint(value){const text=JSON.stringify(value);let hash=2166136261;for(let index=0;index<text.length;index++)hash=Math.imul(hash^text.charCodeAt(index),16777619);return (hash>>>0).toString(16)+'-'+text.length;}
 function archive(m,reasonCode,sourceKey,payload){
  const previous=m.protoSaveArchives;
  if(!object(previous)||previous.schemaVersion!==1||!Array.isArray(previous.entries)||previous.entries.some(entry=>!object(entry))){
   m.protoSaveArchives={schemaVersion:1,entries:[]};
   if(previous!=null)archive(m,'unknown-archive-schema','meta.protoSaveArchives',previous);
  }
  const id=fingerprint({sourceKey,payload}),same=m.protoSaveArchives.entries.find(entry=>entry.id===id&&entry.sourceKey===sourceKey&&JSON.stringify(entry.payload)===JSON.stringify(payload));
  if(same)return same;
  const entry={id,reasonCode,sourceKey,capturedAt:new Date().toISOString(),payload:copy(payload)};
  m.protoSaveArchives.entries.push(entry);return entry;
 }
 function authoredQuestion(q,id){
  if(q?.protoExam)return q.protoExam;
  if(officialIds.has(id))return runtime.questionByOfficialId.get(id).protoExam;
  if(officialIds.has(q?.officialQuestionId))return runtime.questionByOfficialId.get(q.officialQuestionId).protoExam;
  return runtime.source.examPlan.questions.find(item=>item.examRound===q?.examRound&&item.examLevel===q?.examLevel&&item.questionNumber===q?.questionNumber);
 }
 function answeredFromRecords(m){
  const answered=[];
  for(const [id,record] of Object.entries(m?.questionRecords||{})){
   if(!object(record)||!(record.attempts>0))continue;
   const q=QUESTIONS.find(item=>item.questionId===id);
   if(!Number.isInteger(record.lastAnswer)||record.lastAnswer<0||(q&&record.lastAnswer>=q.choices.length))continue;
   const authored=authoredQuestion(q,id);
   if(authored&&record.lastAnswer<authored.choiceCount&&!answered.includes(authored.officialQuestionId))answered.push(authored.officialQuestionId);
  }
  return answered;
 }
 const emptyBook=(m={})=>({version,contentVersion,readSceneIds:[],readLineIds:[],learnedKeywordIds:[],openedQuestionIds:[],answeredQuestionIds:answeredFromRecords(m),choiceBySceneId:{}});
 function validBook(value){
  if(!object(value)||value.version!==version||value.contentVersion!==contentVersion||!object(value.choiceBySceneId)||!stringArray(value.learnedKeywordIds)||value.learnedKeywordIds.some(id=>!learningIds.has(id)))return false;
  for(const [key,known] of [['readSceneIds',runtime.sources],['readLineIds',commonIds],['openedQuestionIds',officialIds],['answeredQuestionIds',officialIds]])if(!stringArray(value[key])||value[key].some(id=>!known.has(id)))return false;
  if(Object.entries(value.choiceBySceneId).some(([id,index])=>!ownsScene(id)||!Number.isInteger(index)||index<0||index>=(runtime.sources.get(id).choices?.length||0)))return false;
  const read=new Set(value.readLineIds);
  if(value.readSceneIds.some(id=>[...runtime.sources.get(id).dialogues,...runtime.sources.get(id).protoCommon].some(line=>!read.has(line.lineId))))return false;
  if(value.readSceneIds.some(id=>runtime.sources.get(id).choices?.length&&!Number.isInteger(value.choiceBySceneId[id])))return false;
  return true;
 }
 function migrateLegacyBook(){return null;}
 function ensureBook(m){
  if(validBook(m.protoRevisionBook))return m.protoRevisionBook;
  const previous=m.protoRevisionBook,migrated=migrateLegacyBook(previous,m);
  if(migrated){archive(m,'content-revision-migration','meta.protoRevisionBook',previous);m.protoRevisionBook=migrated;return m.protoRevisionBook;}
  if(previous!=null)archive(m,'invalid-book','meta.protoRevisionBook',previous);
  m.protoRevisionBook=emptyBook(m);return m.protoRevisionBook;
 }
 function phaseEntries(source,current){if(current?.phase==='outro')return source.protoOutro;if(current?.phase==='branch')return source.choices?.[current.choiceIndex]?.resultDialogues||[];if(current?.phase==='join')return source.protoCommon;return source.dialogues;}
 function validRun(value){
  if(!object(value)||!ownsChapter(value.currentChapter)||value.contentVersion!==version||value.protoContentVersion!==contentVersion||!object(value.protoStoryState)||value.protoStoryState.version!==version||!object(value.protoStoryState.scenes))return false;
  for(const [id,item] of Object.entries(value.protoStoryState.scenes)){
   const source=runtime.sources.get(id);
   if(!source||!object(item)||!phases.has(item.phase))return false;
   if(item.choiceIndex!=null&&(!Number.isInteger(item.choiceIndex)||item.choiceIndex<0||item.choiceIndex>=(source.choices?.length||0)))return false;
   if(['choice','branch'].includes(item.phase)&&!source.choices?.length)return false;
   if(['branch','join','quiz','outro','finished'].includes(item.phase)&&source.choices?.length&&item.choiceIndex==null)return false;
  }
  const source=runtime.sources.get(value.pending?.sourceSceneId||value.storyId),current=value.protoStoryState.scenes[source?.sceneId];
  if(!source||source.chapterId!==value.currentChapter||!current||!ownsScene(value.storyId))return false;
  const entries=phaseEntries(source,current);
  if(!Number.isInteger(value.dialogueCursor)||value.dialogueCursor<1||value.dialogueCursor>entries.length)return false;
  if(current.phase==='choice'&&value.dialogueCursor!==source.dialogues.length)return false;
  if(current.phase==='branch'){
   const expected=source.choices[current.choiceIndex];
   if(!object(value.pending)||value.pending.sourceSceneId!==source.sceneId||value.pending.protoChoiceId!==expected.protoChoiceId||JSON.stringify(value.pending.resultDialogues)!==JSON.stringify(expected.resultDialogues))return false;
  }else if(value.pending!=null)return false;
  if(value.protoTypedLineId!=null&&!lineIds.has(value.protoTypedLineId))return false;
  if(!Array.isArray(value.questionQueue)||value.questionQueue.some(id=>!questionIds.has(id))||!Number.isInteger(value.questionQueueIndex)||value.questionQueueIndex<0||value.questionQueueIndex>value.questionQueue.length)return false;
  if(value.activeQuestionId!=null){
   if(current.phase!=='quiz'||!questionIds.has(value.activeQuestionId)||value.questionQueue[value.questionQueueIndex]!==value.activeQuestionId)return false;
   const q=QUESTIONS.find(item=>item.questionId===value.activeQuestionId);
   if(value.questionAnswer!=null&&(!Number.isInteger(value.questionAnswer)||value.questionAnswer<0||value.questionAnswer>=q.choices.length))return false;
  }
  if(value.protoAnswerDraft!=null&&(!Number.isInteger(value.protoAnswerDraft)||value.protoAnswerDraft<0||value.protoAnswerDraft>=(QUESTIONS.find(q=>q.questionId===value.activeQuestionId)?.choices.length||0)))return false;
  if(current.phase==='quiz'){
   const point=value.protoCheckpoint,queue=source.protoQueue;
   if(!queue||!object(point)||point.kind!=='first'||point.sceneId!==source.sceneId||value.questionQueue.length===0||value.activeQuestionId==null)return false;
   if(value.questionQueue.some(id=>!queue.officialQuestionIds.includes(QUESTIONS.find(q=>q.questionId===id)?.officialQuestionId)))return false;
  }else if(value.questionQueue.length||value.activeQuestionId!=null||value.protoCheckpoint!=null)return false;
  return true;
 }
 function validLearningCursor(value,learned){
  if(!validRun(value)||!validBook(learned))return false;
  const source=runtime.sources.get(value.pending?.sourceSceneId||value.storyId),current=value.protoStoryState.scenes[source.sceneId],read=new Set(learned.readLineIds);
  let required=[];
  if(current.phase==='main')required=source.dialogues.slice(0,value.dialogueCursor-1);
  if(['choice','branch'].includes(current.phase))required=source.dialogues;
  if(current.phase==='join')required=[...source.dialogues,...source.protoCommon.slice(0,value.dialogueCursor-1)];
  if(['quiz','outro','finished'].includes(current.phase))required=[...source.dialogues,...source.protoCommon];
  if(required.some(line=>!read.has(line.lineId)))return false;
  if(['quiz','outro','finished'].includes(current.phase)&&!learned.readSceneIds.includes(source.sceneId))return false;
  if(current.phase==='quiz'){
   if(value.protoCheckpoint.afterLineId!==source.protoQueue.afterLineId||!read.has(source.protoQueue.afterLineId))return false;
   // A freely entered scene authorises its own story queue; review gates remain separate.
   if(!learned.readSceneIds.includes(source.sceneId))return false;
  }
  return true;
 }
 function validResume(value,learned){if(!object(value)||!validRun(value.run)||value.mainRun&&!validRun(value.mainRun))return false;return learned===undefined||validLearningCursor(value.run,learned)&&(!value.mainRun||validLearningCursor(value.mainRun,learned));}
 function identifyRun(value,fresh=false){
  if(!value||!ownsChapter(value.currentChapter))return value;
  value.protoExamRevision=2;value.contentEra=eraId;value.contentVersion=version;value.protoContentVersion=contentVersion;value.flags||={};value.flags.protoStoryVersion=version;
  value.playerOutfit='modern';value.flags.wearingModernClothes=true;value.flags.hasModernClothes=true;delete value.flags.receivedGoryeoClothesFromDoyun;
  value.inventory=(value.inventory||[]).filter(item=>item.id!=='goryeo-commoner-clothes');
  const clothes=value.inventory.find(item=>item.id==='modern-clothes');if(clothes)clothes.status='equipped';else value.inventory.push({id:'modern-clothes',status:'equipped',source:'2026-seoul'});
  value.characterStates={...value.characterStates,proto_modern:{...value.characterStates?.proto_modern,characterAge:24,pose:'standing',outfit:'modern'},proto_naru:{isAlive:true},proto_sibling:{isAlive:true}};
  value.sharedEvents=(value.sharedEvents||[]).filter(event=>!['met_doyun_ch01','received_clothes_from_doyun'].includes(event));
  if(fresh||!value.protoStoryState)value.protoStoryState={version,scenes:{[value.storyId]:{phase:'main',choiceIndex:null}}};
  if(fresh){value.pending=null;value.dialogueSceneId=value.storyId;value.dialogueCursor=1;value.protoTypedLineId=null;value.protoCheckpoint=null;value.protoAnswerDraft=null;value.questionQueue=[];value.questionQueueIndex=0;value.questionQueueResumeStoryId=null;value.activeQuestionId=null;value.activeQuestionSetId=null;value.questionAnswer=null;delete value.protoNeedsResumeRecovery;}
  return value;
 }
 function freshRun(started=false,chapterId=firstChapterId){const value=INITIAL_RUN(chapterId);value.started=started;identifyRun(value,true);value.chapterStart=chapterSnapshot(value);return value;}
 function activeChapterIds(){return runtime.source.chapters.map(chapter=>'proto-ch'+String(chapter.chapterNumber).padStart(2,'0'));}
 function legacyResumeChapter(value,m){
  const active=activeChapterIds(),completed=new Set((m.completedChapters||[]).filter(id=>active.includes(id))),current=value?.currentChapter;
  if(active.includes(current)&&!completed.has(current))return current;
  return active.find(id=>!completed.has(id))||active.at(-1)||firstChapterId;
 }
 function upgradeLegacyRun(value,m){
  const target=freshRun(false);
  if(value)archive(m,'content-revision-migration','main-save.proto-run',value);
  return target;
 }
 function configureSeason(registry){const info=registry?.find(item=>item.id===eraId);if(info)Object.assign(info,{progressKey,contentVersion:version,contentRevision:contentVersion,years:'원삼국 시대 · 다섯 나라의 생활',description:'동생이 남긴 표식을 따라 부여·고구려·옥저·동예·삼한의 17장면을 여행합니다.',bannerAsset:'media/proto-v4/proto-thumbnail-back-view-v1.jpg',backgroundAssets:PROTO_SYMBOLIC_BACKGROUNDS.map(id=>'media/proto-v4/'+id+'.webp')});}
 const ownEntries=value=>Object.fromEntries(Object.entries(value||{}).filter(([id])=>ownsChapter(id)));
 // Exam-only revision preserves the manuscript cursor, choices, and completed chapters.
 function refreshExamQueue(value,book){
  if(!familyRun(value)||value.protoContentVersion!==contentVersion||value.protoExamRevision===2)return;
  const source=runtime.sources.get(value.storyId),current=value.protoStoryState?.scenes?.[value.storyId];
  if(source&&current?.phase==='quiz'){
   const allowed=source.protoQueue.officialQuestionIds.map(id=>'proto-v4-'+id),old=value.activeQuestionId;
   const prefix=(value.questionQueue||[]).slice(0,value.questionQueueIndex).filter(id=>allowed.includes(id));
   const remainder=allowed.filter(id=>!prefix.includes(id)&&id!==old);
   value.questionQueue=[...prefix,...(allowed.includes(old)?[old]:[]),...remainder];value.questionQueueIndex=prefix.length;
   value.activeQuestionId=value.questionQueue[prefix.length];
   if(value.activeQuestionId!==old){value.questionAnswer=null;value.protoAnswerDraft=null;}
  }
  value.protoExamRevision=2;
 }
 const beforeMigration=migrateSave;
 migrateSave=function(raw){
  if(typeof HISTORY_SEASONS!=='undefined')configureSeason(HISTORY_SEASONS);
  const preserved=copy(raw);
  for(const value of [preserved?.run,preserved?.mainRun,preserved?.meta?.eraProgress?.[progressKey]?.resume?.run,preserved?.meta?.eraProgress?.[progressKey]?.resume?.mainRun])refreshExamQueue(value,preserved?.meta?.protoRevisionBook);
  const result=beforeMigration(copy(preserved));
  if(!preserved?.run||!preserved.meta){ensureBook(result.meta);return result;}
  for(const collection of ['chapterRecords','chapterRuns']){result.meta[collection]||={};for(const [id,value] of Object.entries(preserved.meta[collection]||{}))if(ownsChapter(id))result.meta[collection][id]=copy(value);}
  if(preserved.meta.protoSaveArchives!=null)result.meta.protoSaveArchives=copy(preserved.meta.protoSaveArchives);
  const candidates=[preserved.run,preserved.mainRun].filter(familyRun),previousProgress=preserved.meta.eraProgress?.[progressKey];
  const oldBook=preserved.meta.protoRevisionBook?.contentVersion===legacyContentVersion?preserved.meta.protoRevisionBook:null;
  const legacyRun=candidates.some(value=>value.protoContentVersion===legacyContentVersion||value.contentVersion===version&&value.protoContentVersion!==contentVersion);
  const legacyUpgrade=Boolean(oldBook||legacyRun||previousProgress?.contentRevision===legacyContentVersion);
  const migratableBook=oldBook||legacyUpgrade?oldBook||{version,contentVersion:legacyContentVersion,readSceneIds:[],readLineIds:[],openedQuestionIds:[],answeredQuestionIds:[],choiceBySceneId:{}}:null;
  const convertedBook=migratableBook?migrateLegacyBook(migratableBook,preserved.meta):null;
  if(convertedBook){archive(result.meta,'content-revision-migration','meta.protoRevisionBook',migratableBook);result.meta.protoRevisionBook=convertedBook;}
  const trustedBook=validBook(result.meta.protoRevisionBook)||validBook(preserved.meta.protoRevisionBook);
  const hasRecords=(preserved.meta.completedChapters||[]).some(ownsChapter)||Object.keys(ownEntries(preserved.meta.chapterRecords)).length>0||Object.keys(ownEntries(preserved.meta.chapterRuns)).length>0;
  const untrustedContent=!trustedBook&&(candidates.length>0||hasRecords),untrusted=untrustedContent||candidates.some(value=>!validLearningCursor(value,preserved.meta.protoRevisionBook));
  if(untrusted){
   archive(result.meta,'legacy-or-invalid-progress','main-save.proto-current',{run:familyRun(preserved.run)?preserved.run:null,mainRun:familyRun(preserved.mainRun)?preserved.mainRun:null,completedChapters:(preserved.meta.completedChapters||[]).filter(ownsChapter),chapterRecords:ownEntries(preserved.meta.chapterRecords),chapterRuns:ownEntries(preserved.meta.chapterRuns),progress:preserved.meta.eraProgress?.[progressKey]||null,book:preserved.meta.protoRevisionBook||null});
   if(untrustedContent){result.meta.completedChapters=(result.meta.completedChapters||[]).filter(id=>!ownsChapter(id));for(const name of ['chapterRecords','chapterRuns'])result.meta[name]=Object.fromEntries(Object.entries(result.meta[name]||{}).filter(([id])=>!ownsChapter(id)));if(result.meta.eraProgress)delete result.meta.eraProgress[progressKey];}
  }
  for(const name of ['run','mainRun']){
   const value=preserved[name];if(!familyRun(value))continue;
   if(legacyUpgrade&&convertedBook)result[name]=upgradeLegacyRun(value,result.meta);
   else if(trustedBook&&validLearningCursor(value,result.meta.protoRevisionBook||preserved.meta.protoRevisionBook))result[name]=copy(value);
   else{archive(result.meta,value.contentVersion===version?'invalid-resume':'legacy-content','main-save.'+name,value);result[name]=name==='run'?freshRun(false):null;if(name==='run')result[name].protoNeedsResumeRecovery=true;}
  }
  if(familyRun(preserved.run)&&!validLearningCursor(preserved.run,preserved.meta.protoRevisionBook)&&preserved.mainRun&&!familyRun(preserved.mainRun)){result.run=result.mainRun;result.mainRun=null;}
  result.meta.eraProgress||={};
  if(previousProgress&&legacyUpgrade&&convertedBook){
   const resumeRun=[result.run,result.mainRun].find(value=>familyRun(value)&&validRun(value))||freshRun(true,legacyResumeChapter(preserved.run,preserved.meta));
   const resume={run:copy(resumeRun),mainRun:familyRun(result.mainRun)?copy(result.mainRun):null};
   const completedCount=activeChapterIds().filter(id=>result.meta.completedChapters?.includes(id)).length;
   result.meta.eraProgress[progressKey]={...previousProgress,contentVersion:version,contentRevision:contentVersion,lastChapter:resumeRun.currentChapter,lastScene:resumeRun.storyId,progress:Math.min(100,Math.max(Number(previousProgress.progress)||0,Math.round(completedCount/activeChapterIds().length*100))),completed:Boolean(previousProgress.completed||completedCount===activeChapterIds().length),resume,updatedAt:previousProgress.updatedAt||null};
  }else if(previousProgress&&(!trustedBook||!validResume(previousProgress.resume,result.meta.protoRevisionBook||preserved.meta.protoRevisionBook))){archive(result.meta,'invalid-resume','main-save.'+progressKey,previousProgress);delete result.meta.eraProgress[progressKey];}
  ensureBook(result.meta);return result;
 };
 for(const name of ['startChapter','restartChapter','beginReplay','resetRun']){
  const before=globalThis[name];if(typeof before!=='function')continue;
  globalThis[name]=function(target,...args){const old=target.run,result=before(target,...args);if(target.run!==old&&ownsChapter(target.run?.currentChapter)){identifyRun(target.run,true);ensureBook(target.meta);}return result;};
 }
 const beforeRestartEpisode=restartEpisodeMain;
 restartEpisodeMain=function(target){if(!ownsChapter((target.mainRun||target.run)?.currentChapter))return beforeRestartEpisode(target);target.mainRun=null;target.run=freshRun(true);ensureBook(target.meta);return target;};
 const beforeFinish=finishChapter;
 finishChapter=function(target){
  if(!ownsChapter(target.run?.currentChapter))return beforeFinish(target);
  const existed=Object.hasOwn(target.meta.eraProgress||{},eraId),legacy=copy(target.meta.eraProgress?.[eraId]),result=beforeFinish(target);
  target.meta.eraProgress||={};const legacyUpdate=target.meta.eraProgress[eraId];
  target.meta.eraProgress[progressKey]={...target.meta.eraProgress[progressKey],...legacyUpdate,contentVersion:version,contentRevision:contentVersion};
  if(existed)target.meta.eraProgress[eraId]=legacy;else delete target.meta.eraProgress[eraId];
  const record=target.meta.chapterRecords?.[target.run.currentChapter];if(record){record.contentVersion=version;record.protoContentVersion=contentVersion;}
  return result;
 };
 globalThis.PROTO_SAVE_V3={version,eraId,progressKey,storageKey,archiveStorageKey,contentVersion,legacyContentVersion,firstChapterId,copy,object,ownsChapter,ownsScene,ownsQuestion,familyRun,lineIds,commonIds,validBook,validRun,validLearningCursor,validResume,emptyBook,ensureBook,migrateLegacyBook,upgradeLegacyRun,activeChapterIds,identifyRun,freshRun,configureSeason,archive,fingerprint,answeredFromRecords,phaseEntries};
})();
}
