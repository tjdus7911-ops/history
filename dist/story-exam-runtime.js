/* Base story placements are separate from the preserved question library and learning records. */
if(globalThis.STORY_EXAM_POLICY&&globalThis.THREE_STORY_RUNTIME){
 const policy=globalThis.STORY_EXAM_POLICY,three=globalThis.THREE_STORY_RUNTIME,proto=globalThis.PROTO_REVISION_RUNTIME;
 const groups=new Map();for(const row of policy.placements){const rows=groups.get(row.sceneId)||[];rows.push(row);groups.set(row.sceneId,rows);}
 const placementQuestion=row=>QUESTIONS.find(q=>q.questionId===row.questionId)||(row.era==='proto'?proto?.questionByOfficialId?.get(row.officialQuestionId):row.era==='three'?three.questionByOfficialId?.get(row.officialQuestionId):QUESTIONS.find(q=>q.officialQuestionId===row.officialQuestionId));
 for(const item of policy.supplements){
  const placement=policy.placements.find(row=>row.officialQuestionId===item.officialQuestionId&&row.questionId===item.questionId);if(!placement)continue;
  const source=STORIES[placement.sceneId],isThree=placement.era==='three',options=Array.from({length:item.choiceCount},(_,i)=>(i+1)+'번');
  const q=question({...item,questionId:item.questionId,chapterId:source.chapterId,relatedSceneId:source.sceneId,relatedIllustrationId:source.illustrationId,resumeStoryId:source.sceneId,
   question:item.question,sourceQuestionText:item.question,choices:options,sourceChoices:options,acceptedAnswers:[item.answer],examType:'한국사능력검정시험 '+item.examLevel+' 기출',difficulty:item.examLevel,
   sourceQuestionImage:item.questionImage.replace(/^dist\//,''),questionImage:item.questionImage.replace(/^dist\//,''),source:'국사편찬위원회 한국사능력검정시험',sourceFile:item.sourcePdf,answerFile:item.answerPdf,
   sourceImageHash:item.sourceImageSha256,sourcePdfHash:item.sourceQuestionSha256,answerPdfHash:item.sourceAnswerSha256,sourceImageStatus:'verified',sourceImageVerified:true,sourceAnswerVerified:true,sourceStatus:'verified',sourceType:'official_exam',isOfficial:true,sourceVerified:true,
   examKeywords:[],conceptIds:[],rewardKnowledge:isThree?0:3,gameMemory:item.topic,storyConnection:item.topic,
   ...(isThree?{threeStoryVersion:3,threeExam:{...item,label:item.question,fullExplanationAfterSceneId:null}}:{})});
  QUESTIONS.push(q);if(isThree)three.questionByOfficialId.set(q.officialQuestionId,q);
 }
 for(const q of QUESTIONS)if(q.threeStoryVersion===3)q.reviewOnly=true;
 // Keep former schedule IDs available for an already saved in-flight checkpoint.
 for(const row of three.exams.schedule)if(row.playMode==='first')row.playMode='review';
 for(const row of policy.placements){
  if(row.era==='goryeo')continue;
  if(row.era==='proto'&&proto)continue;
  const q=placementQuestion(row),source=STORIES[row.sceneId];if((!q||!source)&&row.era==='proto'&&!proto)continue;if(!q||!source)throw Error('Missing story exam placement '+row.questionId);
  Object.assign(q,{chapterId:source.chapterId,relatedSceneId:source.sceneId,relatedIllustrationId:source.illustrationId,storyPlacementId:row.officialQuestionId,reviewOnly:false});
  if(row.era==='three'){
   const original=[...three.exams.schedule,...three.exams.additionalCandidates].find(p=>p.officialQuestionId===row.officialQuestionId&&p.quizAfterSceneId===row.sceneId);
   const scheduled={...original,id:'base-'+row.sceneId+'-'+row.officialQuestionId,officialQuestionId:row.officialQuestionId,quizAfterSceneId:row.sceneId,playMode:'first',insertPhase:'after_join',preQuizHints:original?.preQuizHints||[],playExplanation:original?.playExplanation||q.threeExam?.explanation||q.explanation,sourceSceneIds:[row.sceneId],primarySourceSceneIds:[row.sceneId],additionalSourceSceneIds:[],sequence:1};
   three.exams.schedule.push(scheduled);three.schedules.set(scheduled.id,scheduled);
  }
 }
 for(const spec of policy.scenes){
  if(spec.era==='goryeo')continue;
  const source=STORIES[spec.sceneId],placements=groups.get(spec.sceneId)||[],ids=placements.map(p=>placementQuestion(p)?.questionId||p.questionId);if(!source&&spec.era==='proto'&&!proto)continue;if(!source)throw Error('Missing story scene '+spec.sceneId);
  if(spec.era==='proto'&&proto){source.baseOfficialQuestionIds=placements.map(p=>p.questionId);source.legacyProtoQueue=source.protoQueue;continue;}
  source.baseOfficialQuestionIds=ids;
  if(spec.era==='proto'){
   source.legacyProtoQueue=source.protoQueue;
   const last=[...(source.dialogues||[]),...(source.protoCommon||[])].at(-1);
   source.protoQueue=ids.length?{...(source.protoQueue||{}),sceneId:source.sceneId,officialQuestionIds:placements.map(p=>p.officialQuestionId),afterLineId:last.lineId,count:ids.length}:null;
  }
 }
 for(const chapter of Object.values(CHAPTERS)){
  const rows=policy.placements.filter(p=>p.chapterId===chapter.chapterId);if(!policy.scenes.some(s=>s.chapterId===chapter.chapterId))continue;
  if(rows.some(row=>row.era==='goryeo'))continue;
  if(proto&&rows.some(row=>row.era==='proto')){chapter.questionCount=rows.length;chapter.questionSetCount=new Set(rows.map(p=>p.sceneId)).size;chapter.storyExamShortage=policy.audit.filter(s=>s.chapterId===chapter.chapterId).reduce((n,s)=>n+s.missing,0);chapter.baseOfficialQuestionIds=rows.map(p=>p.questionId);continue;}
  chapter.questionCount=rows.length;chapter.questionSetCount=new Set(rows.map(p=>p.sceneId)).size;
  chapter.storyExamShortage=policy.audit.filter(s=>s.chapterId===chapter.chapterId).reduce((n,s)=>n+s.missing,0);
  // Keep review aliases and past records; this list represents base questions only.
  chapter.baseOfficialQuestionIds=rows.map(p=>placementQuestion(p)?.questionId||p.questionId);
 }
 globalThis.STORY_EXAM_GROUPS=groups;
}
