/* OX quiz navigation, sessions, review, analytics, and learning records. */
(function(){
if(!globalThis.CORE_APP_READY||typeof globalThis.editorialIcon!=='function'||typeof globalThis.editorialHeader!=='function'||!Array.isArray(globalThis.OX_QUESTIONS)||!globalThis.OX_QUESTIONS.length)return;

const OX_BY_ID=new Map(OX_QUESTIONS.map(question=>[question.id,question]));
const OX_ICON='<svg viewBox="0 0 24 24" class="ed-icon ox-nav-icon" aria-hidden="true"><circle cx="7" cy="12" r="4"/><path d="m14 8 7 8m0-8-7 8"/></svg>';
const OX_ERA_DESCRIPTIONS={
 prehistoric:'선사 문화와 고조선의 핵심 흐름',
 kingdoms:'여러 나라부터 남북국까지의 변화',
 goryeo:'고려의 정치·사회·대외 관계',
 joseon:'조선의 제도·사회·문화와 변화',
 empire:'개항 이후 근대 국가 수립 과정',
 occupation:'일제 식민 통치와 독립운동',
 republic:'광복 이후 대한민국의 발전'
};
let oxView='home',oxAnalysisSort='weakest',oxHomeReviewEra='all',oxWrongReviewEra='all',oxMetaCache=null;

const oxInteger=value=>Math.max(0,Number.isFinite(Number(value))?Math.floor(Number(value)):0);
const oxAccuracy=(correct,total)=>total?Math.round(correct/total*100):0;
const oxEra=id=>OX_ERAS.find(era=>era.id===id)||{id:id||'unknown',name:'기타',shortName:'기타'};
const oxTopicLabel=question=>question?.topicName||question?.topicLabel||(Array.isArray(question?.tags)&&question.tags.length?question.tags.join(' · '):question?.topicId||`topic-${question?.id||'unknown'}`);
const oxTopicId=question=>question?.analysisTopicId||(Array.isArray(question?.tags)&&question.tags.length?`${question?.eraId||'unknown'}:${question.tags.join('|')}`:question?.topicId||`topic-${question?.id||'unknown'}`);
const oxClone=value=>JSON.parse(JSON.stringify(value));

function validOXSession(session,completed=false){
 return Boolean(session&&Array.isArray(session.questionIds)&&session.questionIds.length&&session.questionIds.every(id=>OX_BY_ID.has(id))&&Number.isInteger(session.index)&&session.index>=0&&session.index<session.questionIds.length&&(!completed||session.status==='completed'));
}
function normalizeOXRecord(record={}){
 const suppliedCorrect=oxInteger(record.correctCount),suppliedWrong=oxInteger(record.wrongCount),attempts=oxInteger(record.attempts)||suppliedCorrect+suppliedWrong,correctCount=Math.min(attempts,suppliedCorrect),wrongCount=Math.max(0,Number.isFinite(Number(record.wrongCount))?suppliedWrong:attempts-correctCount);
 return {...record,attempts,correctCount,wrongCount,lastCorrect:typeof record.lastCorrect==='boolean'?record.lastCorrect:null,lastAnsweredAt:record.lastAnsweredAt||null};
}
function ensureOXMeta(){
 const m=meta();
 if(!m.oxQuiz||typeof m.oxQuiz!=='object')m.oxQuiz={};
 const ox=m.oxQuiz;
 if(oxMetaCache===ox)return ox;
 ox.records=ox.records&&typeof ox.records==='object'?ox.records:{};
 for(const [id,record] of Object.entries(ox.records))ox.records[id]=normalizeOXRecord(record);
 const attemptNumbers={};
 ox.history=(Array.isArray(ox.history)?ox.history:[]).map(item=>{
  const question=OX_BY_ID.get(item?.questionId),questionId=item?.questionId||'',selectedAnswer=typeof item?.selectedAnswer==='boolean'?item.selectedAnswer:typeof item?.answer==='boolean'?item.answer:null,correctAnswer=typeof item?.correctAnswer==='boolean'?item.correctAnswer:typeof question?.answer==='boolean'?question.answer:null,isCorrect=typeof item?.isCorrect==='boolean'?item.isCorrect:typeof item?.correct==='boolean'?item.correct:selectedAnswer!==null&&correctAnswer!==null?selectedAnswer===correctAnswer:false;
  attemptNumbers[questionId]=(attemptNumbers[questionId]||0)+1;
  return {...item,questionId,eraId:item?.eraId||question?.eraId||null,topicId:item?.topicId||oxTopicId(question),selectedAnswer,correctAnswer,isCorrect,answeredAt:item?.answeredAt||null,sessionId:item?.sessionId||null,attemptNumber:oxInteger(item?.attemptNumber)||attemptNumbers[questionId],answer:selectedAnswer,correct:isCorrect};
 });
 const historyGroups=new Map();
 for(const event of ox.history){if(!OX_BY_ID.has(event.questionId))continue;const rows=historyGroups.get(event.questionId)||[];rows.push(event);historyGroups.set(event.questionId,rows);}
 for(const [id,events] of historyGroups){
  const last=events.at(-1),historyCorrect=events.filter(event=>event.isCorrect).length,stored=normalizeOXRecord(ox.records[id]||{}),storedTime=Date.parse(stored.lastAnsweredAt||''),historyTime=Date.parse(last.answeredAt||'');
  if(!stored.attempts||events.length>=stored.attempts){
   ox.records[id]={...stored,attempts:events.length,correctCount:historyCorrect,wrongCount:events.length-historyCorrect,lastAnswer:last.selectedAnswer,lastCorrect:last.isCorrect,lastAnsweredAt:last.answeredAt};
  }else if(stored.lastCorrect===null||!stored.lastAnsweredAt||(Number.isFinite(historyTime)&&(!Number.isFinite(storedTime)||historyTime>=storedTime))){
   ox.records[id]={...stored,lastAnswer:last.selectedAnswer,lastCorrect:last.isCorrect,lastAnsweredAt:last.answeredAt};
  }
 }
 ox.recentQuestionIds=(Array.isArray(ox.recentQuestionIds)?ox.recentQuestionIds:[]).filter(id=>OX_BY_ID.has(id)).slice(-100);
 const legacyWrong=(Array.isArray(ox.wrongIds)?ox.wrongIds:[]).filter(id=>OX_BY_ID.has(id));
 const latestWrong=Object.entries(ox.records).filter(([id,record])=>OX_BY_ID.has(id)&&record.lastCorrect===false).map(([id])=>id);
 ox.wrongIds=[...new Set([...legacyWrong,...latestWrong])].filter(id=>ox.records[id]?.lastCorrect!==true);
 ox.completedSessions=Array.isArray(ox.completedSessions)?ox.completedSessions:[];
 if(ox.activeSession&&!validOXSession(ox.activeSession))ox.activeSession=null;
 if(ox.lastSession&&!validOXSession(ox.lastSession,true))ox.lastSession=null;
 ox.schemaVersion=2;
 oxMetaCache=ox;
 return ox;
}
const oxMeta=()=>ensureOXMeta();
function oxRecord(id){
 const stored=oxMeta().records[id];
 if(stored)return normalizeOXRecord(stored);
 const attempts=oxMeta().history.filter(item=>item.questionId===id);
 if(!attempts.length)return null;
 const last=attempts.at(-1),correctCount=attempts.filter(item=>item.isCorrect).length;
 return {attempts:attempts.length,correctCount,wrongCount:attempts.length-correctCount,lastAnswer:last.selectedAnswer,lastCorrect:last.isCorrect,lastAnsweredAt:last.answeredAt};
}
function oxStats(eraId=null){
 const questions=OX_QUESTIONS.filter(question=>!eraId||question.eraId===eraId),records=questions.map(question=>({question,record:oxRecord(question.id)})).filter(item=>item.record&&item.record.attempts>0);
 const attempts=records.reduce((sum,item)=>sum+item.record.attempts,0),correct=records.reduce((sum,item)=>sum+item.record.correctCount,0),wrong=records.reduce((sum,item)=>sum+item.record.wrongCount,0),latestCorrect=records.filter(item=>item.record.lastCorrect===true).length,currentWrong=records.filter(item=>item.record.lastCorrect===false).length,completedReview=records.filter(item=>item.record.wrongCount>0&&item.record.lastCorrect===true).length;
 return {eraId,total:questions.length,attempts,correct,wrong,accuracy:attempts?oxAccuracy(correct,attempts):null,learned:records.length,latestCorrect,currentWrong,reviewNeeded:currentWrong,completedReview,latestAccuracy:records.length?oxAccuracy(latestCorrect,records.length):null};
}
function oxEraStats(){return OX_ERAS.map((era,index)=>{const row=oxStats(era.id),eligible=row.learned>=10;return {...row,id:era.id,name:era.name,shortName:era.shortName,index,eligible,dataStatus:eligible?'ranked':'insufficient',topics:oxTopicStats(era.id).slice(0,3)};});}
function oxWeaknessRows(sort='weakest'){
 const rows=oxEraStats();
 if(sort==='era')return rows;
 if(sort==='attempts')return rows.slice().sort((a,b)=>b.attempts-a.attempts||a.index-b.index);
 return rows.slice().sort((a,b)=>Number(b.eligible)-Number(a.eligible)||(a.eligible&&b.eligible?a.latestAccuracy-b.latestAccuracy||b.currentWrong-a.currentWrong||a.accuracy-b.accuracy:a.index-b.index));
}
function oxTopicStats(eraId=null){
 const topics=new Map();
 for(const question of OX_QUESTIONS){
  if(eraId&&question.eraId!==eraId)continue;
  const record=oxRecord(question.id);if(!record?.attempts)continue;
  const id=oxTopicId(question),key=`${question.eraId}\u0000${id}`,current=topics.get(key)||{topicId:id,label:oxTopicLabel(question),eraId:question.eraId,attempts:0,correct:0,wrong:0,learned:0,currentWrong:0};
  current.attempts+=record.attempts;current.correct+=record.correctCount;current.wrong+=record.wrongCount;current.learned++;if(record.lastCorrect===false)current.currentWrong++;topics.set(key,current);
 }
 return [...topics.values()].map(item=>({...item,accuracy:oxAccuracy(item.correct,item.attempts)})).sort((a,b)=>b.wrong-a.wrong||b.currentWrong-a.currentWrong||a.accuracy-b.accuracy||a.label.localeCompare(b.label,'ko'));
}
function oxCurrentWrongIds(eraId='all'){
 const topicWrong=new Map();
 for(const topic of oxTopicStats())topicWrong.set(`${topic.eraId}:${topic.topicId}`,topic.wrong);
 return [...new Set(oxMeta().wrongIds)].filter(id=>{const question=OX_BY_ID.get(id);return question&&(eraId==='all'||question.eraId===eraId)&&oxRecord(id)?.lastCorrect!==true;}).sort((a,b)=>{const qa=OX_BY_ID.get(a),qb=OX_BY_ID.get(b),ra=oxRecord(a),rb=oxRecord(b);return (topicWrong.get(`${qb.eraId}:${oxTopicId(qb)}`)||0)-(topicWrong.get(`${qa.eraId}:${oxTopicId(qa)}`)||0)||(rb?.wrongCount||0)-(ra?.wrongCount||0)||String(ra?.lastAnsweredAt||'').localeCompare(String(rb?.lastAnsweredAt||''));});
}
function oxCompletedReviewIds(eraId='all'){
 return OX_QUESTIONS.filter(question=>(eraId==='all'||question.eraId===eraId)&&oxRecord(question.id)?.wrongCount>0&&oxRecord(question.id)?.lastCorrect===true).sort((a,b)=>{const ra=oxRecord(a.id),rb=oxRecord(b.id);return (rb?.wrongCount||0)-(ra?.wrongCount||0)||String(rb?.lastAnsweredAt||'').localeCompare(String(ra?.lastAnsweredAt||''));}).map(question=>question.id);
}
function oxHash(value){let hash=2166136261;for(const char of String(value)){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619);}return hash>>>0;}
function oxAgeScore(record){if(!record?.lastAnsweredAt)return 200;const parsed=Date.parse(record.lastAnsweredAt);if(!Number.isFinite(parsed))return 120;return Math.min(120,Math.max(0,(Date.now()-parsed)/86400000));}
function oxQuestionScore(question,{onlyWrong=false}={}){
 const record=oxRecord(question.id),recentIndex=oxMeta().recentQuestionIds.lastIndexOf(question.id),recentPenalty=recentIndex<0?0:500+recentIndex;
 if(onlyWrong){const topic=oxTopicStats(question.eraId).find(item=>item.topicId===oxTopicId(question));return (topic?.wrong||0)*200+(record?.wrongCount||0)*80+oxAgeScore(record)-recentPenalty;}
 return (!record?10000:0)+(record?.lastCorrect===false?450:0)+oxAgeScore(record)+Math.min(60,oxInteger(question.frequency)*4)-recentPenalty;
}
function chooseOXQuestions(count,{eraId=null,onlyWrong=false,seed=''}={}){
 const unique=new Map(),wrongIds=onlyWrong?new Set(oxCurrentWrongIds(eraId||'all')):null;
 for(const question of OX_QUESTIONS){if((!eraId||question.eraId===eraId)&&(!onlyWrong||wrongIds.has(question.id)))unique.set(question.id,question);}
 const pool=[...unique.values()].sort((a,b)=>oxQuestionScore(b,{onlyWrong})-oxQuestionScore(a,{onlyWrong})||oxHash(`${a.id}:${seed}`)-oxHash(`${b.id}:${seed}`)),selected=[],target=Math.min(oxInteger(count),pool.length);
 let lastAnswer=null,streak=0;
 while(selected.length<target){
  let index=0;
  if(streak>=2){const opposite=pool.findIndex(question=>question.answer!==lastAnswer);if(opposite>=0)index=opposite;}
  const [question]=pool.splice(index,1);selected.push(question);
  if(question.answer===lastAnswer)streak++;else{lastAnswer=question.answer;streak=1;}
 }
 return selected;
}
function newOXSession(mode,count,eraId=null,questionIds=null){
 const ox=oxMeta(),canonicalMode=mode==='wrong'?'review':mode,seed=`${canonicalMode}:${eraId||'all'}:${Date.now()}:${ox.completedSessions.length}`,questions=questionIds?[...new Set(questionIds)].map(id=>OX_BY_ID.get(id)).filter(Boolean).slice(0,oxInteger(count)):chooseOXQuestions(count,{eraId,onlyWrong:canonicalMode==='review',seed});
 if(!questions.length){toast(canonicalMode==='review'?'선택한 시대에 복습할 OX 오답이 없습니다.':'선택한 시대의 OX 문제가 없습니다.');return false;}
 const now=new Date().toISOString();
 ox.activeSession={id:`ox-session-${Date.now()}-${oxHash(seed)}`,mode:canonicalMode,eraId,questionIds:questions.map(question=>question.id),index:0,answers:{},results:{},startedAt:now,completedAt:null,status:'active'};
 oxView='quiz';screen='ox';save();render();window.scrollTo(0,0);return true;
}
function activeOXSession(){return oxMeta().activeSession;}
function activeOXQuestion(){const session=activeOXSession();return session&&OX_BY_ID.get(session.questionIds[session.index]);}
function answerOX(answer){
 const session=activeOXSession(),question=activeOXQuestion();if(!session||!question||Object.hasOwn(session.answers,question.id))return;
 const correct=answer===question.answer,now=new Date().toISOString(),ox=oxMeta(),previous=oxRecord(question.id)||{attempts:0,correctCount:0,wrongCount:0},attemptNumber=previous.attempts+1;
 session.answers[question.id]=answer;session.results[question.id]=correct;
 ox.records[question.id]={...previous,eraId:question.eraId,topicId:oxTopicId(question),attempts:attemptNumber,correctCount:previous.correctCount+(correct?1:0),wrongCount:previous.wrongCount+(correct?0:1),lastAnswer:answer,lastCorrect:correct,lastAnsweredAt:now};
 ox.history.push({questionId:question.id,eraId:question.eraId,topicId:oxTopicId(question),selectedAnswer:answer,correctAnswer:question.answer,isCorrect:correct,answeredAt:now,sessionId:session.id,attemptNumber,answer,correct,mode:session.mode});
 ox.recentQuestionIds.push(question.id);ox.recentQuestionIds=ox.recentQuestionIds.slice(-100);
 if(correct)ox.wrongIds=ox.wrongIds.filter(id=>id!==question.id);else if(!ox.wrongIds.includes(question.id))ox.wrongIds.push(question.id);
 save();render();
}
function finishOXSession(){
 const ox=oxMeta(),session=ox.activeSession;if(!session)return;
 session.status='completed';session.completedAt=new Date().toISOString();
 const correct=Object.values(session.results).filter(Boolean).length,total=session.questionIds.length;
 session.summary={total,correct,wrong:total-correct,accuracy:oxAccuracy(correct,total),durationMs:Math.max(0,Date.parse(session.completedAt)-Date.parse(session.startedAt))};
 if(!ox.completedSessions.some(item=>item.id===session.id))ox.completedSessions.push({id:session.id,mode:session.mode,eraId:session.eraId,...session.summary,startedAt:session.startedAt,completedAt:session.completedAt});
 if(session.mode==='daily')ox.daily={date:new Date().toLocaleDateString('sv-SE'),completed:true,accuracy:session.summary.accuracy,sessionId:session.id};
 ox.lastSession=oxClone(session);ox.activeSession=null;oxView='result';save();render();window.scrollTo(0,0);
}
function nextOXQuestion(){const session=activeOXSession();if(!session||!Object.hasOwn(session.answers,session.questionIds[session.index]))return;if(session.index>=session.questionIds.length-1)return finishOXSession();session.index++;save();render();window.scrollTo(0,0);}
function oxDuration(milliseconds){const total=Math.max(0,Math.round(milliseconds/1000)),minutes=Math.floor(total/60),seconds=total%60;return `${minutes}분 ${String(seconds).padStart(2,'0')}초`;}
function oxHeader(title,subtitle,back='home'){return `<header class="ox-top"><button data-ox-back="${back}" aria-label="OX 퀴즈 뒤로가기">‹</button><div><small>한능검 심화 핵심 개념</small><h1>${esc(title)}</h1>${subtitle?`<p>${esc(subtitle)}</p>`:''}</div></header>`;}
function oxReviewOptions(selected,includeAll=true){return `${includeAll?`<option value="all" ${selected==='all'?'selected':''}>전체 시대</option>`:''}${OX_ERAS.map(era=>`<option value="${era.id}" ${selected===era.id?'selected':''}>${esc(era.name)} (${oxCurrentWrongIds(era.id).length})</option>`).join('')}`;}

function oxHome(){
 const stats=oxStats(),resume=oxMeta().activeSession,wrongCount=oxCurrentWrongIds(oxHomeReviewEra).length;
 return `<section class="ox-page ox-home">${editorialHeader('OX 퀴즈','한능검 심화 핵심 개념을 빠르게 확인해요.')}
 <section class="ox-learning-summary" aria-label="나의 OX 학습 요약"><div><span>누적 풀이 수</span><strong>${stats.attempts}</strong></div><div><span>전체 정답률</span><strong>${stats.accuracy===null?'—':stats.accuracy+'%'}</strong></div><div><span>누적 오답 수</span><strong>${stats.wrong}</strong></div></section>
 ${resume?`<button class="ox-resume" data-ox-resume="true"><span><b>진행 중인 퀴즈 이어하기</b><small>${resume.index+1} / ${resume.questionIds.length}문제</small></span><strong>이어하기 ›</strong></button>`:''}
 <section class="ox-main-section"><div class="ox-main-heading"><div><small>ERA QUIZ</small><h2>시대별 OX 퀴즈</h2></div><span>한 세션 20문제</span></div><div class="ox-era-list">${OX_ERAS.map(era=>{const row=oxStats(era.id);return `<button class="ox-era-card" data-ox-era="${era.id}"><span class="ox-era-copy"><b>${esc(era.name)}</b><small>${esc(OX_ERA_DESCRIPTIONS[era.id]||'핵심 개념을 확인해요.')}</small><span class="ox-era-metrics"><em>전체 ${row.total}</em><em>학습 ${row.learned}</em><em>${row.learned?`정답률 ${row.accuracy}%`:'아직 학습 전'}</em></span></span><i aria-hidden="true">›</i></button>`;}).join('')}</div></section>
 <section class="ox-main-section"><div class="ox-main-heading"><div><small>REVIEW & ANALYSIS</small><h2>복습과 분석</h2></div></div><div class="ox-tool-list"><article class="ox-tool-card"><div><h3>틀린 OX 다시 풀기</h3><p>현재 복습이 필요한 문제를 시대별로 골라 풀어요.</p></div><label>시대 선택<select data-ox-home-review-era>${oxReviewOptions(oxHomeReviewEra)}</select></label><button class="primary" data-ox-review="true" ${wrongCount?'':'disabled'}>${wrongCount?`${wrongCount}문제 중 복습 시작`:'복습할 문제가 없어요'}</button></article><button class="ox-tool-link" data-ox-analysis="true"><span><b>시대별 취약점 분석</b><small>누적 시도와 최신 정답 상태를 나누어 확인해요.</small></span><i>›</i></button></div></section></section>`;
}
function oxQuiz(){
 const session=activeOXSession(),question=activeOXQuestion();if(!session||!question){oxView='home';return oxHome();}
 const answered=Object.hasOwn(session.answers,question.id),selected=session.answers[question.id],correct=session.results[question.id],era=oxEra(question.eraId),percent=Math.round((session.index+(answered?1:0))/session.questionIds.length*100);
 const title=session.mode==='review'?`${session.eraId?era.shortName+' ':''}OX 오답 복습`:session.eraId?`${era.shortName} OX 퀴즈`:'OX 퀴즈';
 return `<section class="ox-page ox-play">${oxHeader(title,`${session.index+1} / ${session.questionIds.length}`,'home')}<div class="ox-progress" aria-label="퀴즈 진행률 ${percent}%"><span style="width:${percent}%"></span></div><div class="ox-progress-label"><b>현재 ${session.index+1}번</b><span>전체 ${session.questionIds.length}문제</span></div><article class="ox-question-card"><div class="ox-question-meta"><span>${esc(era.shortName)}</span><small>${answered?esc(oxTopicLabel(question)):'한능검 심화 핵심 개념'}</small></div><h2>${esc(question.statement)}</h2><div class="ox-answer-grid" role="group" aria-label="O 또는 X 선택"><button class="ox-answer o ${answered&&question.answer?'right':''} ${answered&&selected===true&&!correct?'wrong':''}" data-ox-answer="true" ${answered?'disabled':''}><b>O</b><span>맞다</span></button><button class="ox-answer x ${answered&&!question.answer?'right':''} ${answered&&selected===false&&!correct?'wrong':''}" data-ox-answer="false" ${answered?'disabled':''}><b>X</b><span>아니다</span></button></div>${answered?`<section class="ox-feedback ${correct?'correct':'incorrect'}" aria-live="polite"><strong>${correct?'정답입니다':'오답입니다 · 정답은 '+(question.answer?'O':'X')}</strong><p>${esc(question.explanation)}</p></section><button class="primary ox-next" data-ox-next="true">${session.index===session.questionIds.length-1?'결과 확인':'다음 문제'}</button>`:'<p class="ox-choice-guide">O 또는 X를 선택하면 바로 해설을 확인할 수 있어요.</p>'}</article></section>`;
}
function oxResultBreakdown(session,wrongIds){
 if(!wrongIds.length)return '';
 const eraIds=[...new Set(session.questionIds.map(id=>OX_BY_ID.get(id)?.eraId).filter(Boolean))],byTopic=eraIds.length===1,groups=new Map();
 for(const id of wrongIds){const question=OX_BY_ID.get(id);if(!question)continue;const key=byTopic?oxTopicId(question):question.eraId,label=byTopic?oxTopicLabel(question):oxEra(question.eraId).shortName,current=groups.get(key)||{label,count:0};current.count++;groups.set(key,current);}
 const rows=[...groups.values()].sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label,'ko')),max=Math.max(...rows.map(row=>row.count),1);
 return `<section class="ox-section ox-result-analysis"><div class="ox-section-title"><div><span>WRONG ANSWER ANALYSIS</span><h2>${byTopic?'세부 주제별 오답 분석':'시대별 오답 분석'}</h2></div></div><p class="ox-analysis-note">${byTopic?`${esc(oxEra(eraIds[0]).name)} 안에서 많이 틀린 주제예요.`:'오답이 나온 시대를 비교했어요.'}</p><div class="ox-bar-list">${rows.map(row=>`<div class="ox-bar-row"><span>${esc(row.label)}</span><div><i style="width:${Math.max(8,Math.round(row.count/max*100))}%"></i></div><b>${row.count}문제</b></div>`).join('')}</div></section>`;
}
function oxResult(){
 const session=oxMeta().lastSession;if(!session?.summary){oxView='home';return oxHome();}
 const summary=session.summary,wrongIds=session.questionIds.filter(id=>session.results[id]===false);
 return `<section class="ox-page ox-result">${oxHeader('학습 결과','한 문제씩 쌓인 오늘의 기록','home')}<section class="ox-result-score"><span>${summary.total}문제 중</span><strong>${summary.correct}문제 정답</strong><div>${summary.accuracy}%</div><p>오답 ${summary.wrong}개 · 소요 시간 ${oxDuration(summary.durationMs)}</p></section>${oxResultBreakdown(session,wrongIds)}${wrongIds.length?`<section class="ox-section"><div class="ox-section-title"><div><span>REVIEW</span><h2>틀린 문제 다시 보기</h2></div></div><div class="ox-result-wrongs">${wrongIds.map(id=>{const question=OX_BY_ID.get(id);return question?`<details><summary><span>${esc(oxEra(question.eraId).shortName)}</span>${esc(question.statement)}</summary><p><b>정답 ${question.answer?'O':'X'}</b><br>${esc(question.explanation)}</p></details>`:'';}).join('')}</div><button class="secondary ox-full" data-ox-retry-wrong="true">틀린 문제 다시 풀기</button></section>`:'<section class="ox-perfect"><b>모든 문제를 맞혔어요!</b><p>심화 핵심 개념을 정확히 기억하고 있습니다.</p></section>'}<div class="ox-result-actions"><button class="secondary" data-ox-retry="true">다시 풀기</button><button class="primary" data-ox-home="true">OX 퀴즈 메인</button></div></section>`;
}
function oxAnalysis(){
 const stats=oxStats(),rankedRows=oxWeaknessRows('weakest').filter(row=>row.eligible),rows=oxWeaknessRows(oxAnalysisSort),weakest=rankedRows[0];
 return `<section class="ox-page ox-analysis">${oxHeader('시대별 취약점 분석','서로 다른 문제를 10개 이상 학습한 시대부터 비교해요.','home')}<section class="ox-analysis-summary"><div><span>총 풀이 수</span><b>${stats.attempts}</b></div><div><span>전체 정답률</span><b>${stats.accuracy===null?'—':stats.accuracy+'%'}</b></div><div><span>가장 취약한 시대</span><b>${weakest?esc(weakest.shortName):'데이터 부족'}</b></div></section><div class="ox-analysis-toolbar"><div><h2>시대별 분석</h2><p>취약 순위는 문제별 최신 정답률 기준이며, 누적 시도도 함께 보여줘요.</p></div><div class="ox-sort-buttons" role="group" aria-label="분석 정렬"><button data-ox-analysis-sort="weakest" aria-pressed="${oxAnalysisSort==='weakest'}">취약 순</button><button data-ox-analysis-sort="era" aria-pressed="${oxAnalysisSort==='era'}">시대 순</button></div></div><div class="ox-weakness-list">${rows.map(row=>{const topics=oxTopicStats(row.id).filter(topic=>topic.wrong>0).slice(0,3),reviewCount=oxCurrentWrongIds(row.id).length,rank=rankedRows.findIndex(item=>item.id===row.id)+1;return `<article class="ox-weakness-card ox-analysis-row ox-weakness-row ${row.eligible?'':'insufficient'}"><header><div><small>${row.eligible?`취약 순위 ${rank}`:'데이터 부족 · 고유 문제 10개 필요'}</small><h3>${esc(row.name)}</h3></div><strong>${row.accuracy===null?'—':row.accuracy+'%'}</strong></header><div class="ox-accuracy-track ox-analysis-bar ox-weakness-meter" aria-label="${esc(row.name)} 누적 정답률 ${row.accuracy||0}%"><i style="width:${row.accuracy||0}%"></i></div><div class="ox-attempt-metrics"><span>풀이 <b>${row.attempts}</b></span><span>정답 <b>${row.correct}</b></span><span>오답 <b>${row.wrong}</b></span></div><p class="ox-latest-state"><b>문제별 최신 상태</b> ${row.learned?`정답률 ${row.latestAccuracy}% · ${row.latestCorrect}/${row.learned}개 정답 · 복습 필요 ${row.currentWrong}`:'아직 학습 전'}</p><div class="ox-weak-topics"><b>취약 세부 개념</b>${topics.length?`<ul>${topics.map(topic=>`<li><span>${esc(topic.label)}</span><em>누적 오답 ${topic.wrong}</em></li>`).join('')}</ul>`:'<p>아직 확인된 취약 개념이 없어요.</p>'}</div><button class="secondary" data-ox-review-era="${row.id}" ${reviewCount?'':'disabled'}>${reviewCount?`${reviewCount}문제 복습하기`:'복습할 오답 없음'}</button></article>`;}).join('')}</div></section>`;
}
function oxPage(){return oxView==='quiz'?oxQuiz():oxView==='result'?oxResult():oxView==='analysis'?oxAnalysis():oxHome();}

function oxWrongCards(eraId=oxWrongReviewEra,status='needed'){
 const ids=status==='completed'?oxCompletedReviewIds(eraId):oxCurrentWrongIds(eraId);
 return ids.length?ids.map(id=>{const question=OX_BY_ID.get(id),record=oxRecord(id);return `<article class="ox-wrong-row ${status==='completed'?'completed':''}"><span>${esc(oxEra(question.eraId).shortName)}</span><div><h3>${esc(question.statement)}</h3><p>${esc(oxTopicLabel(question))} · 누적 오답 ${record?.wrongCount||1}회</p></div>${status==='completed'?'<span class="ox-review-state">복습 완료</span>':`<button class="primary" data-ox-review-one="${id}">다시 풀기</button>`}</article>`;}).join(''):`<div class="ed-empty">${status==='completed'?'아직 복습을 완료한 과거 오답이 없습니다.':'선택한 시대에 현재 복습할 OX 오답이 없습니다.'}</div>`;
}
const studyBeforeOX=study;
study=function(){
 if(studyTab!=='review')return studyBeforeOX();
 if(wrongFilter==='ox'){
  const visible=oxCurrentWrongIds(oxWrongReviewEra),completed=oxCompletedReviewIds(oxWrongReviewEra);
  return editorialHeader('오답노트','틀린 순간을 나의 지식으로')+'<div class="tabs v2-wrong-tabs"><button data-wrong-filter="all">전체</button><button data-wrong-filter="official">기출문제</button><button data-wrong-filter="ox" class="selected">OX 퀴즈 '+oxCurrentWrongIds('all').length+'</button></div><section class="v2-section ox-review-section"><div class="ox-review-heading"><div><h2>틀린 OX 다시 풀기</h2><p>이전 오답 이력은 남기고, 최신 정답 상태로 복습 대상을 관리해요.</p></div><label>시대<select data-ox-review-filter>'+oxReviewOptions(oxWrongReviewEra)+'</select></label></div><div class="ox-review-group"><h3>현재 복습 필요 <span>'+visible.length+'</span></h3>'+oxWrongCards(oxWrongReviewEra,'needed')+`<button class="primary ox-review-all" data-ox-review-era="${oxWrongReviewEra}" ${visible.length?'':'disabled'}>${visible.length?(visible.length>20?`${visible.length}문제 중 20문제 복습`:`${visible.length}문제 복습하기`):'복습할 문제가 없어요'}</button></div><details class="ox-completed-review" ${completed.length?'':'open'}><summary>복습 완료한 과거 오답 <span>${completed.length}</span></summary>${oxWrongCards(oxWrongReviewEra,'completed')}</details></section>`;
 }
 let html=studyBeforeOX();
 html=html.replace('</div><div class="v2-filters">',`<button data-wrong-filter="ox">OX 퀴즈 ${oxCurrentWrongIds('all').length}</button></div><div class="v2-filters">`);
 if(wrongFilter==='all'&&oxCurrentWrongIds('all').length)html=html.replace('<button class="ed-link" data-study-jump="official">',`<section class="v2-section ox-wrong-in-all"><h2>OX 퀴즈 오답 · ${oxCurrentWrongIds('all').length}</h2>${oxWrongCards('all')}</section><button class="ed-link" data-study-jump="official">`);
 return html;
};

function oxRecordSection(){
 const stats=oxStats(),rows=oxEraStats().map(row=>`<div class="official-record-era"><b>${esc(row.name)}</b><span>${row.accuracy===null?'—':row.accuracy+'%'}</span><small>${row.attempts}회 · ${row.learned}/${row.total}개</small><div class="progress"><span style="width:${row.accuracy||0}%"></span></div></div>`).join(''),recent=oxMeta().history.filter(item=>OX_BY_ID.has(item.questionId)).slice(-5).reverse();
 return `<section class="ox-records"><h2>OX 퀴즈 학습 통계</h2><div class="official-record-overview"><div><small>총 OX 풀이</small><strong>${stats.attempts}</strong></div><div><small>OX 정답률</small><strong>${stats.accuracy===null?'—':stats.accuracy+'%'}</strong></div><div><small>학습 개념</small><strong>${stats.learned}</strong></div><div><small>복습할 OX</small><strong>${stats.currentWrong}</strong></div></div><div class="ox-record-era">${rows}</div>${recent.length?`<details class="ox-recent-records"><summary>최근 OX 학습 기록</summary>${recent.map(item=>{const question=OX_BY_ID.get(item.questionId);return `<p><span>${item.isCorrect?'정답':'오답'}</span>${esc(question.statement)}<small>${item.answeredAt?new Date(item.answeredAt).toLocaleString('ko-KR'):'기록 시간 없음'}</small></p>`;}).join('')}</details>`:''}</section>`;
}

const shellBeforeOX=shell;
shell=function(content){
 const current=screen==='ox'?'ox':screen.startsWith('exam-')?'exam-library':['era','game','quiz','complete','teaser','history'].includes(screen)?'home':screen;
 return `<div class="shell editorial-shell five-nav"><aside class="sidebar"><div class="brand">눈떠보니 한국사<small>역사를 살고, 기출로 기억하다</small></div><nav class="nav" aria-label="주 메뉴">${[['home','홈',editorialIcon('home')],['exam-library','기출문제',editorialIcon('book')],['ox','OX 퀴즈',OX_ICON],['study','오답노트',editorialIcon('note')],['records','내 기록',editorialIcon('records')]].map(([id,label,image])=>`<button data-nav="${id}" ${current===id?'aria-current="page"':''} class="${current===id?'active':''}">${image}<span>${label}</span></button>`).join('')}</nav></aside><main class="main ed-screen ed-${screen}">${content}</main></div>${modal?modalHTML():''}`;
};
const renderContentBeforeOX=renderContent;
renderContent=function(){
 if(screen==='ox')return oxPage();
 let html=renderContentBeforeOX();
 if(screen==='records')html=html.replace('<section><h2>시대별 기출 기록</h2>',oxRecordSection()+'<section><h2>시대별 기출 기록</h2>');
 return html;
};
if(typeof v2QuestionRow==='function'){
 const v2QuestionRowBeforeOX=v2QuestionRow;
 v2QuestionRow=function(question){return v2QuestionRowBeforeOX(question).replace(/<button class="text-btn" data-association-for="[^"]+">[\s\S]*?<\/button>/g,'');};
}

document.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button||button.disabled)return;const data=button.dataset;
 if(data.nav==='ox'){event.stopImmediatePropagation();screen='ox';modal=null;oxView=activeOXSession()?'quiz':'home';render();window.scrollTo(0,0);return;}
 if(data.oxEra){event.stopImmediatePropagation();newOXSession('era',20,data.oxEra);return;}
 if(data.oxReview){event.stopImmediatePropagation();newOXSession('review',20,oxHomeReviewEra==='all'?null:oxHomeReviewEra);return;}
 if(data.oxReviewEra){event.stopImmediatePropagation();const eraId=data.oxReviewEra==='all'?null:data.oxReviewEra;newOXSession('review',20,eraId);return;}
 if(data.oxAnalysis){event.stopImmediatePropagation();oxView='analysis';screen='ox';render();window.scrollTo(0,0);return;}
 if(data.oxAnalysisSort){event.stopImmediatePropagation();oxAnalysisSort=data.oxAnalysisSort;render();return;}
 if(data.oxStart){event.stopImmediatePropagation();newOXSession(data.oxStart,Number(data.count)||20);return;}
 if(data.oxResume){event.stopImmediatePropagation();oxView='quiz';screen='ox';render();window.scrollTo(0,0);return;}
 if(data.oxAnswer!==undefined){event.stopImmediatePropagation();answerOX(data.oxAnswer==='true');return;}
 if(data.oxNext){event.stopImmediatePropagation();nextOXQuestion();return;}
 if(data.oxBack){event.stopImmediatePropagation();oxView=data.oxBack==='analysis'?'analysis':'home';screen='ox';render();window.scrollTo(0,0);return;}
 if(data.oxHome){event.stopImmediatePropagation();oxView='home';screen='ox';render();window.scrollTo(0,0);return;}
 if(data.oxRetry){event.stopImmediatePropagation();const last=oxMeta().lastSession;newOXSession(last.mode,last.questionIds.length,last.eraId,last.questionIds);return;}
 if(data.oxRetryWrong){event.stopImmediatePropagation();const last=oxMeta().lastSession,ids=last.questionIds.filter(id=>last.results[id]===false);newOXSession('review',ids.length,last.eraId,ids);return;}
 if(data.oxReviewOne){event.stopImmediatePropagation();newOXSession('review',1,OX_BY_ID.get(data.oxReviewOne)?.eraId||null,[data.oxReviewOne]);return;}
},true);
document.addEventListener('change',event=>{
 if(event.target.matches('[data-ox-home-review-era]')){oxHomeReviewEra=event.target.value;render();return;}
 if(event.target.matches('[data-ox-review-filter]')){oxWrongReviewEra=event.target.value;render();}
});

const initialOX=ensureOXMeta();
if(initialOX.activeSession){screen='ox';oxView='quiz';}
globalThis.OX_QUIZ_API=Object.freeze({
 stats:eraId=>oxClone(oxStats(eraId||null)),
 eraStats:()=>oxClone(oxEraStats()),
 weaknessRows:(sort='weakest')=>oxClone(oxWeaknessRows(sort)),
 topicStats:eraId=>oxClone(oxTopicStats(eraId||null)),
 choose:(count,options={})=>chooseOXQuestions(count,options).map(question=>question.id),
 startSession:(mode='era',eraId=null,filter={})=>newOXSession(mode,oxInteger(filter?.count)||20,eraId==='all'?null:eraId,Array.isArray(filter?.questionIds)?filter.questionIds:null),
 snapshot:()=>oxClone({view:oxView,homeReviewEra:oxHomeReviewEra,wrongReviewEra:oxWrongReviewEra,meta:oxMeta()})
});
globalThis.OX_QUIZ_UI_READY=true;
render();
})();
