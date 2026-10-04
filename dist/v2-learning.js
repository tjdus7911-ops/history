/* V2 adds dated learning events without changing the save key or run structure. */
function learningDay(value){if(value==null||value==='' )return null;const date=new Date(value);return Number.isNaN(date.getTime())?null:[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-')}
function appendLearningEvent(state,questionId,userAnswer){const q=QUESTIONS.find(q=>q.questionId===questionId);if(!q)return;const events=state.meta.learningEvents||(state.meta.learningEvents=[]);events.push({questionId,answer:userAnswer,correct:userAnswer===q.answer,answeredAt:new Date().toISOString()})}
const recordQuestionBeforeV2=recordQuestion;
recordQuestion=function(state,questionId,userAnswer){const result=recordQuestionBeforeV2(state,questionId,userAnswer);if(QUESTIONS.some(q=>q.questionId===questionId))appendLearningEvent(state,questionId,userAnswer);return result};
function learningConcepts(q){return q.historicalEvent?.trim()?[q.historicalEvent.trim()]:(q.examKeywords||[]).slice(0,1)}
function learningSummary(meta,now=new Date()){
 const records=meta.questionRecords||{},events=(meta.learningEvents||[]).filter(e=>learningDay(e.answeredAt)),today=learningDay(now),todayEvents=events.filter(e=>learningDay(e.answeredAt)===today);
 const attempts=Object.values(records).reduce((n,r)=>n+(r.attempts||0),0),correct=Object.values(records).reduce((n,r)=>n+(r.correctCount||0),0),days=new Set(events.map(e=>learningDay(e.answeredAt))),cursor=new Date(now);let streak=0;
 if(!days.has(today))cursor.setDate(cursor.getDate()-1);
 while(days.has(learningDay(cursor))){streak++;cursor.setDate(cursor.getDate()-1)}
 const concepts=new Map();let officialAttempts=0;
 for(const [id,r]of Object.entries(records)){const q=QUESTIONS.find(q=>q.questionId===id);if(!q)continue;if(q.isOfficial&&q.sourceVerified&&q.sourceQuestionImage)officialAttempts+=r.attempts||0;for(const concept of new Set(learningConcepts(q))){const item=concepts.get(concept)||{name:concept,attempts:0,correct:0,wrong:0,questionIds:[]};item.attempts+=r.attempts||0;item.correct+=r.correctCount||0;item.wrong+=(r.attempts||0)-(r.correctCount||0);item.questionIds.push(id);concepts.set(concept,item)}}
 const weak=[...concepts.values()].filter(c=>c.wrong>0).map(c=>({...c,accuracy:Math.round(c.correct/c.attempts*100)})).sort((a,b)=>b.wrong-a.wrong||a.accuracy-b.accuracy||a.name.localeCompare(b.name,'ko')).slice(0,5);
 return {attempts,correct,accuracy:attempts?Math.round(correct/attempts*100):null,officialAttempts,todayAttempts:todayEvents.length,todayAccuracy:todayEvents.length?Math.round(todayEvents.filter(e=>e.correct).length/todayEvents.length*100):null,streak,days:[...days],weak,events};
}
/* Recall artwork always follows the source story; asset replacements remain shared. */
const V2_RECALL_REPAIRS=[];
for(const q of QUESTIONS){
 const activeIds=new Set((CHAPTERS[q.chapterId]?.sceneIds||[]));
 const anchors=Object.values(STORIES).filter(s=>s.chapterId===q.chapterId&&s.sceneType!=='quiz'&&(s.quizId===q.questionId||s.linkedQuestionIds?.includes(q.questionId)||s.choices?.some(c=>c.questionIds?.includes(q.questionId))));
 const current=STORIES[q.relatedSceneId];
 const actual=anchors.find(s=>s.sceneId===q.relatedSceneId)||anchors.find(s=>activeIds.has(s.sceneId))||anchors[0];
 if(actual)q.relatedSceneId=actual.sceneId;
 const scene=STORIES[q.relatedSceneId];
 if(scene?.illustrationId&&q.relatedIllustrationId!==scene.illustrationId){V2_RECALL_REPAIRS.push({questionId:q.questionId,sceneId:q.relatedSceneId,from:q.relatedIllustrationId,to:scene.illustrationId});q.relatedIllustrationId=scene.illustrationId}
}
/* This early Gungye question retained a later Gongsan/distractor memory after the chapter split. */
const V2_GUNGYE_RECALL=QUESTIONS.find(q=>q.questionId==='ch01-official-79-advanced-09');
if(V2_GUNGYE_RECALL){V2_GUNGYE_RECALL.memoryPrompt='궁예가 물러나고 왕건이 새 나라를 세운 918년 장면을 떠올린다.';V2_GUNGYE_RECALL.gameMemory='918년, 궁예가 물러나고 왕건이 고려를 세웠습니다. 원본 자료의 철원·태봉·광평성 단서는 왕건 이전의 궁예를 가리킵니다.';V2_GUNGYE_RECALL.resumeStoryId=STORIES[V2_GUNGYE_RECALL.relatedSceneId].nextStoryId}
