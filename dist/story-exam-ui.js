/* A story queue belongs to the active run, never to cumulative review history. */
if(globalThis.CORE_APP_READY&&globalThis.STORY_EXAM_GROUPS){
 const mergeCuratedChoiceExplanations=(existing,fixes)=>(fixes||[]).map((explanation,index)=>{
  const current=existing?.[index];
  return current&&typeof current==='object'?{...current,explanation,verificationStatus:'CURATED_VERIFIED'}:explanation;
 });
 for(const fix of STORY_EXAM_POLICY.corrections||[]){
  for(const q of QUESTIONS)if(q.examRound===fix.examRound&&q.examLevel===fix.examLevel&&q.questionNumber===fix.questionNumber){q.explanation=fix.explanation;q.choiceExplanations=mergeCuratedChoiceExplanations(q.choiceExplanations,fix.choiceExplanations);}
  const stored=typeof OFFICIAL_EXPLANATION_BY_SOURCE_ID!=='undefined'?OFFICIAL_EXPLANATION_BY_SOURCE_ID.get(fix.officialQuestionId):null;if(stored){stored.explanation=fix.explanation;stored.choiceExplanations=mergeCuratedChoiceExplanations(stored.choiceExplanations,fix.choiceExplanations);}
 }
 const storyQuizBeforeChoiceDetails=quiz;
 quiz=function(){
  const markup=storyQuizBeforeChoiceDetails(),q=activeQuestion(),selected=quizMode==='story'?run().questionAnswer:reviewAnswer;
  if(!q||!isVerifiedOfficialQuestion(q)||!Number.isInteger(selected)||markup.includes('official-choice-explanations')||markup.includes('official-choice-load')||!globalThis.OFFICIAL_EXAM_UI?.choiceExplanations)return markup;
  const details=globalThis.OFFICIAL_EXAM_UI.choiceExplanations(q,selected);
  return details?markup.replace('<p class="feedback-reward">',details+'<p class="feedback-reward">'):markup;
 };
 // Existing Goryeo scenes keep their authored question sets. A future scene may
 // explicitly opt in to the policy queue without changing released story flow.
 const isGoryeo=s=>/^ch\d+$/.test(s?.chapterId||'')&&s?.enableBaseOfficialQuestionQueue===true;
 const current=()=>STORIES[run().pending?.sourceSceneId||run().storyId];
 function resume(source,afterChoice=false){
  const r=run();
  if(source.completeChapter&&!afterChoice){finishChapter(state);save();navigate('complete');return;}
  const next=afterChoice?r.storyId:source.nextStoryId;
  if(next){r.storyId=next;enterStory();save();navigate('game');}
  else if(source.completeChapter){finishChapter(state);save();navigate('complete');}
 }
 function queue(source,afterChoice=false){
  const r=run(),ids=(source.baseOfficialQuestionIds||[]).filter(id=>!Object.hasOwn(r.questionResults||{},id));
  if(!ids.length)return false;
  r.storyExamCheckpoint={sceneId:source.sceneId,afterChoice,resumeStoryId:afterChoice?r.storyId:source.nextStoryId};
  r.questionQueue=ids;r.questionQueueIndex=0;r.questionQueueResumeStoryId=source.sceneId;r.activeQuestionSetId=null;
  startQuestion(ids[0],true);return true;
 }
 const oldNext=nextStory;
 nextStory=function(){const s=current();if(!isGoryeo(s))return oldNext();if(!queue(s))resume(s);};
 const oldContinue=continueStoryQuestion;
 continueStoryQuestion=function(){
  const r=run(),point=r.storyExamCheckpoint;if(!point||quizMode!=='story')return oldContinue();if(r.questionAnswer===null)return;
  const next=(r.questionQueueIndex||0)+1;
  if(next<r.questionQueue.length){r.questionQueueIndex=next;startQuestion(r.questionQueue[next],true);return;}
  const source=STORIES[point.sceneId];
  Object.assign(r,{questionQueue:[],questionQueueIndex:0,questionQueueResumeStoryId:null,activeQuestionId:null,activeQuestionSetId:null,questionAnswer:null});delete r.storyExamCheckpoint;
  if(point.afterChoice)r.storyId=point.resumeStoryId;
  resume(source,point.afterChoice);
 };
 document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(button?.dataset.action!=='result-next'||screen!=='game'||!run().pending)return;
  const source=current();if(!isGoryeo(source))return;
  event.preventDefault();event.stopImmediatePropagation();run().pending=null;
  if(!queue(source,true))resume(source,true);
 },true);
 globalThis.STORY_EXAM_ACTIONS={queue,resume};
}
