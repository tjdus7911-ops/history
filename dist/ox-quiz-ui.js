/* OX quiz navigation, sessions, review, and learning records. */
(function(){
if(!globalThis.CORE_APP_READY||typeof globalThis.editorialIcon!=='function'||typeof globalThis.editorialHeader!=='function'||!Array.isArray(globalThis.OX_QUESTIONS)||!globalThis.OX_QUESTIONS.length)return;
const OX_BY_ID=new Map(OX_QUESTIONS.map(question=>[question.id,question]));
const OX_DATE=()=>new Date().toLocaleDateString('sv-SE');
const OX_ICON='<svg viewBox="0 0 24 24" class="ed-icon ox-nav-icon" aria-hidden="true"><circle cx="7" cy="12" r="4"/><path d="m14 8 7 8m0-8-7 8"/></svg>';
let oxView='home';

function ensureOXMeta(){
 const m=meta();
 if(!m.oxQuiz||typeof m.oxQuiz!=='object')m.oxQuiz={};
 const ox=m.oxQuiz;
 ox.records=ox.records&&typeof ox.records==='object'?ox.records:{};
 ox.wrongIds=Array.isArray(ox.wrongIds)?ox.wrongIds.filter(id=>OX_BY_ID.has(id)):[];
 ox.history=Array.isArray(ox.history)?ox.history.slice(-1000):[];
 ox.recentQuestionIds=Array.isArray(ox.recentQuestionIds)?ox.recentQuestionIds.filter(id=>OX_BY_ID.has(id)).slice(-60):[];
 ox.completedSessions=Array.isArray(ox.completedSessions)?ox.completedSessions.slice(-100):[];
 if(ox.activeSession&&!validOXSession(ox.activeSession))ox.activeSession=null;
 if(ox.lastSession&&!validOXSession(ox.lastSession,true))ox.lastSession=null;
 return ox;
}
function validOXSession(session,completed=false){return Boolean(session&&Array.isArray(session.questionIds)&&session.questionIds.length&&session.questionIds.every(id=>OX_BY_ID.has(id))&&Number.isInteger(session.index)&&session.index>=0&&session.index<session.questionIds.length&&(!completed||session.status==='completed'))}
const oxMeta=()=>ensureOXMeta();
const oxRecord=id=>oxMeta().records[id]||null;
const oxEra=id=>OX_ERAS.find(era=>era.id===id)||OX_ERAS[0];
const oxAccuracy=(correct,total)=>total?Math.round(correct/total*100):0;
function oxStats(){
 const ox=oxMeta(),records=Object.values(ox.records),attempts=records.reduce((sum,record)=>sum+(record.attempts||0),0),correct=records.reduce((sum,record)=>sum+(record.correctCount||0),0);
 return {attempts,correct,wrong:attempts-correct,accuracy:attempts?oxAccuracy(correct,attempts):null,learned:records.length};
}
function oxHash(value){let hash=2166136261;for(const char of String(value)){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619)}return hash>>>0}
function oxAgeScore(record){if(!record?.lastAnsweredAt)return 60;const days=Math.max(0,(Date.now()-Date.parse(record.lastAnsweredAt))/86400000);return Math.min(40,days)}
function oxQuestionScore(question){const record=oxRecord(question.id),wrong=oxMeta().wrongIds.includes(question.id);return (wrong?120:0)+(!record?80:0)+oxAgeScore(record)+Math.min(40,question.frequency*3)-(oxMeta().recentQuestionIds.includes(question.id)?65:0)}
function chooseOXQuestions(count,{eraId=null,onlyWrong=false,seed=''}={}){
 let pool=OX_QUESTIONS.filter(question=>(!eraId||question.eraId===eraId)&&(!onlyWrong||oxMeta().wrongIds.includes(question.id)));
 pool=pool.sort((a,b)=>oxQuestionScore(b)-oxQuestionScore(a)||(oxHash(a.id+seed)-oxHash(b.id+seed)));
 const yes=pool.filter(question=>question.answer),no=pool.filter(question=>!question.answer),selected=[];let streak=0,last=null;
 while(selected.length<count&&(yes.length||no.length)){
  const prefer=(oxHash(seed+selected.length)%2===0),force=streak>=2?!last:null;let answer=force===null?prefer:force;
  let bucket=answer?yes:no;if(!bucket.length){answer=!answer;bucket=answer?yes:no}const question=bucket.shift();if(!question)break;
  selected.push(question);if(last===answer)streak++;else{last=answer;streak=1}
 }
 return selected;
}
function newOXSession(mode,count,eraId=null,questionIds=null){
 const ox=oxMeta(),seed=`${mode}:${eraId||'all'}:${OX_DATE()}:${ox.completedSessions.length}`,questions=questionIds?questionIds.map(id=>OX_BY_ID.get(id)).filter(Boolean):chooseOXQuestions(count,{eraId,onlyWrong:mode==='wrong',seed});
 if(!questions.length){toast(mode==='wrong'?'복습할 OX 오답이 없습니다.':'선택한 조건에 맞는 OX 문제가 없습니다.');return false}
 const now=new Date().toISOString();ox.activeSession={id:`ox-session-${Date.now()}-${oxHash(seed)}`,mode,eraId,questionIds:questions.map(question=>question.id),index:0,answers:{},results:{},startedAt:now,completedAt:null,status:'active'};oxView='quiz';screen='ox';save();render();window.scrollTo(0,0);return true;
}
function activeOXSession(){return oxMeta().activeSession}
function activeOXQuestion(){const session=activeOXSession();return session&&OX_BY_ID.get(session.questionIds[session.index])}
function answerOX(answer){
 const session=activeOXSession(),question=activeOXQuestion();if(!session||!question||Object.hasOwn(session.answers,question.id))return;
 const correct=answer===question.answer,now=new Date().toISOString(),ox=oxMeta(),previous=ox.records[question.id]||{attempts:0,correctCount:0,wrongCount:0};
 session.answers[question.id]=answer;session.results[question.id]=correct;
 ox.records[question.id]={attempts:previous.attempts+1,correctCount:previous.correctCount+(correct?1:0),wrongCount:previous.wrongCount+(correct?0:1),lastAnswer:answer,lastCorrect:correct,lastAnsweredAt:now};
 ox.history.push({questionId:question.id,answer,correct,answeredAt:now,sessionId:session.id,mode:session.mode});ox.history=ox.history.slice(-1000);
 ox.recentQuestionIds.push(question.id);ox.recentQuestionIds=ox.recentQuestionIds.slice(-60);
 if(correct)ox.wrongIds=ox.wrongIds.filter(id=>id!==question.id);else if(!ox.wrongIds.includes(question.id))ox.wrongIds.push(question.id);
 save();render();
}
function finishOXSession(){
 const ox=oxMeta(),session=ox.activeSession;if(!session)return;
 session.status='completed';session.completedAt=new Date().toISOString();const correct=Object.values(session.results).filter(Boolean).length,total=session.questionIds.length;
 session.summary={total,correct,wrong:total-correct,accuracy:oxAccuracy(correct,total),durationMs:Math.max(0,Date.parse(session.completedAt)-Date.parse(session.startedAt))};
 if(!ox.completedSessions.some(item=>item.id===session.id))ox.completedSessions.push({id:session.id,mode:session.mode,eraId:session.eraId,...session.summary,startedAt:session.startedAt,completedAt:session.completedAt});
 if(session.mode==='daily')ox.daily={date:OX_DATE(),completed:true,accuracy:session.summary.accuracy,sessionId:session.id};
 ox.lastSession=JSON.parse(JSON.stringify(session));ox.activeSession=null;oxView='result';save();render();window.scrollTo(0,0);
}
function nextOXQuestion(){const session=activeOXSession();if(!session)return;if(!Object.hasOwn(session.answers,session.questionIds[session.index]))return;if(session.index>=session.questionIds.length-1)return finishOXSession();session.index++;save();render();window.scrollTo(0,0)}
function oxDuration(milliseconds){const total=Math.max(0,Math.round(milliseconds/1000)),minutes=Math.floor(total/60),seconds=total%60;return `${minutes}분 ${String(seconds).padStart(2,'0')}초`}
function oxHeader(title,subtitle,back='home'){return `<header class="ox-top"><button data-ox-back="${back}" aria-label="OX 퀴즈 뒤로가기">‹</button><div><small>한능검 심화 핵심 개념</small><h1>${esc(title)}</h1>${subtitle?`<p>${esc(subtitle)}</p>`:''}</div></header>`}
function oxHome(){
 const ox=oxMeta(),stats=oxStats(),today=ox.daily?.date===OX_DATE()?ox.daily:null,resume=ox.activeSession,wrongCount=ox.wrongIds.length;
 return `<section class="ox-page ox-home">${editorialHeader('OX 퀴즈','실제 심화 기출 개념을 짧고 정확하게')}<section class="ox-daily-card"><span class="ox-kicker">TODAY'S OX · 10문제</span><h2>오늘의 심화 핵심 개념</h2><p>${today?.completed?`오늘 완료 · 정답률 ${today.accuracy}%`:'반복 출제 개념과 내 오답을 우선으로 추천해요.'}</p><button class="primary" data-ox-start="daily" data-count="10">${today?.completed?'오늘의 OX 다시 풀기':'시작하기'}</button></section>${resume?`<button class="ox-resume" data-ox-resume="true"><span><b>진행 중인 퀴즈 이어하기</b><small>${resume.index+1} / ${resume.questionIds.length}문제</small></span><strong>이어하기 ›</strong></button>`:''}<section class="ox-section"><div class="ox-section-title"><div><span>QUICK START</span><h2>빠른 OX 퀴즈</h2></div><small>문제 수 선택</small></div><div class="ox-quick-grid">${[10,20,30].map(count=>`<button data-ox-start="quick" data-count="${count}"><b>${count}</b><span>문제</span></button>`).join('')}</div></section><section class="ox-section"><div class="ox-section-title"><div><span>ERA</span><h2>시대별 OX 퀴즈</h2></div></div><div class="ox-era-grid">${OX_ERAS.map(era=>{const rows=OX_QUESTIONS.filter(question=>question.eraId===era.id),done=rows.filter(question=>ox.records[question.id]).length;return `<button data-ox-era="${era.id}"><span><b>${esc(era.name)}</b><small>${rows.length}개 핵심 개념 · 학습 ${done}</small></span><i>›</i></button>`}).join('')}</div></section><section class="ox-section ox-wrong-card"><div><span class="ox-kicker">REVIEW</span><h2>틀린 OX 다시 풀기</h2><p>${wrongCount?`복습할 문제가 ${wrongCount}개 있어요.`:'현재 복습할 OX 오답이 없어요.'}</p></div><button data-ox-start="wrong" data-count="30" ${wrongCount?'':'disabled'}>복습 시작</button></section><section class="ox-mini-stats"><div><b>${stats.attempts}</b><span>총 풀이</span></div><div><b>${stats.accuracy===null?'—':stats.accuracy+'%'}</b><span>정답률</span></div><div><b>${stats.learned}</b><span>학습 개념</span></div></section></section>`;
}
function oxQuiz(){
 const session=activeOXSession(),question=activeOXQuestion();if(!session||!question){oxView='home';return oxHome()}
 const answered=Object.hasOwn(session.answers,question.id),selected=session.answers[question.id],correct=session.results[question.id],era=oxEra(question.eraId),percent=Math.round((session.index+(answered?1:0))/session.questionIds.length*100);
 return `<section class="ox-page ox-play">${oxHeader('OX 퀴즈',`${session.index+1} / ${session.questionIds.length}`,'home')}<div class="ox-progress" aria-label="퀴즈 진행률 ${percent}%"><span style="width:${percent}%"></span></div><div class="ox-progress-label"><b>현재 ${session.index+1}번</b><span>전체 ${session.questionIds.length}문제</span></div><article class="ox-question-card"><div class="ox-question-meta"><span>${esc(era.shortName)}</span><small>${question.frequency>1?`심화 ${question.frequency}개 회차 연계`:'심화 기출 개념'}</small></div><h2>${esc(question.statement)}</h2><div class="ox-answer-grid" role="group" aria-label="O 또는 X 선택"><button class="ox-answer o ${answered&&question.answer?'right':''} ${answered&&selected===true&&!correct?'wrong':''}" data-ox-answer="true" ${answered?'disabled':''}><b>O</b><span>맞다</span></button><button class="ox-answer x ${answered&&!question.answer?'right':''} ${answered&&selected===false&&!correct?'wrong':''}" data-ox-answer="false" ${answered?'disabled':''}><b>X</b><span>아니다</span></button></div>${answered?`<section class="ox-feedback ${correct?'correct':'incorrect'}" aria-live="polite"><strong>${correct?'정답입니다':'오답입니다 · 정답은 '+(question.answer?'O':'X')}</strong><p>${esc(question.explanation)}</p><small>연계 심화 기출 ${question.sourceRounds.map(round=>`제${round}회`).join(' · ')}</small></section><button class="primary ox-next" data-ox-next="true">${session.index===session.questionIds.length-1?'결과 확인':'다음 문제'}</button>`:'<p class="ox-choice-guide">O 또는 X를 선택하면 바로 해설을 확인할 수 있어요.</p>'}</article></section>`;
}
function oxResult(){
 const session=oxMeta().lastSession;if(!session?.summary){oxView='home';return oxHome()}const summary=session.summary,wrongIds=session.questionIds.filter(id=>session.results[id]===false);
 return `<section class="ox-page ox-result">${oxHeader('학습 결과','한 문제씩 쌓인 오늘의 기록','home')}<section class="ox-result-score"><span>${summary.total}문제 중</span><strong>${summary.correct}문제 정답</strong><div>${summary.accuracy}%</div><p>오답 ${summary.wrong}개 · 소요 시간 ${oxDuration(summary.durationMs)}</p></section>${wrongIds.length?`<section class="ox-section"><div class="ox-section-title"><div><span>REVIEW</span><h2>틀린 문제 다시 보기</h2></div></div><div class="ox-result-wrongs">${wrongIds.map(id=>{const question=OX_BY_ID.get(id);return `<details><summary><span>${esc(oxEra(question.eraId).shortName)}</span>${esc(question.statement)}</summary><p><b>정답 ${question.answer?'O':'X'}</b><br>${esc(question.explanation)}</p></details>`}).join('')}</div><button class="secondary ox-full" data-ox-retry-wrong="true">틀린 문제 다시 풀기</button></section>`:'<section class="ox-perfect"><b>모든 문제를 맞혔어요!</b><p>심화 핵심 개념을 정확히 기억하고 있습니다.</p></section>'}<div class="ox-result-actions"><button class="secondary" data-ox-retry="true">다시 풀기</button><button class="primary" data-ox-home="true">OX 퀴즈 메인</button></div></section>`;
}
function oxPage(){return oxView==='quiz'?oxQuiz():oxView==='result'?oxResult():oxHome()}

function oxWrongCards(){const ox=oxMeta(),ids=ox.wrongIds;return ids.length?ids.map(id=>{const question=OX_BY_ID.get(id),record=ox.records[id];return `<article class="ox-wrong-row"><span>${esc(oxEra(question.eraId).shortName)}</span><div><h3>${esc(question.statement)}</h3><p>${esc(question.tags.join(' · '))} · 누적 오답 ${record?.wrongCount||1}회</p></div><button class="primary" data-ox-review-one="${id}">다시 풀기</button></article>`}).join(''):'<div class="ed-empty">아직 OX 오답이 없습니다.</div>'}
const studyBeforeOX=study;
study=function(){
 if(studyTab!=='review')return studyBeforeOX();
 if(wrongFilter==='ox')return editorialHeader('오답노트','틀린 순간을 나의 지식으로')+'<div class="tabs v2-wrong-tabs"><button data-wrong-filter="all">전체</button><button data-wrong-filter="official">기출문제</button><button data-wrong-filter="ox" class="selected">OX 퀴즈 '+oxMeta().wrongIds.length+'</button></div><section class="v2-section"><h2>OX 퀴즈 오답</h2>'+oxWrongCards()+'</section>';
 let html=studyBeforeOX();
 html=html.replace('</div><div class="v2-filters">',`<button data-wrong-filter="ox">OX 퀴즈 ${oxMeta().wrongIds.length}</button></div><div class="v2-filters">`);
 if(wrongFilter==='all'&&oxMeta().wrongIds.length)html=html.replace('<button class="ed-link" data-study-jump="official">',`<section class="v2-section ox-wrong-in-all"><h2>OX 퀴즈 오답 · ${oxMeta().wrongIds.length}</h2>${oxWrongCards()}</section><button class="ed-link" data-study-jump="official">`);
 return html;
};

function oxRecordSection(){
 const stats=oxStats(),rows=OX_ERAS.map(era=>{const history=oxMeta().history.filter(item=>OX_BY_ID.get(item.questionId)?.eraId===era.id),correct=history.filter(item=>item.correct).length;return `<div class="official-record-era"><b>${esc(era.name)}</b><span>${history.length?oxAccuracy(correct,history.length)+'%':'—'}</span><small>${history.length}회 풀이</small><div class="progress"><span style="width:${history.length?oxAccuracy(correct,history.length):0}%"></span></div></div>`}).join(''),recent=oxMeta().history.slice(-5).reverse();
 return `<section class="ox-records"><h2>OX 퀴즈 학습 통계</h2><div class="official-record-overview"><div><small>총 OX 풀이</small><strong>${stats.attempts}</strong></div><div><small>OX 정답률</small><strong>${stats.accuracy===null?'—':stats.accuracy+'%'}</strong></div><div><small>학습 개념</small><strong>${stats.learned}</strong></div><div><small>복습할 OX</small><strong>${oxMeta().wrongIds.length}</strong></div></div><div class="ox-record-era">${rows}</div>${recent.length?`<details class="ox-recent-records"><summary>최근 OX 학습 기록</summary>${recent.map(item=>{const question=OX_BY_ID.get(item.questionId);return `<p><span>${item.correct?'정답':'오답'}</span>${esc(question.statement)}<small>${new Date(item.answeredAt).toLocaleString('ko-KR')}</small></p>`}).join('')}</details>`:''}</section>`;
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
 v2QuestionRow=function(question){return v2QuestionRowBeforeOX(question).replace(/<button class="text-btn" data-association-for="[^"]+">[\s\S]*?<\/button>/g,'')};
}

document.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button||button.disabled)return;const data=button.dataset;
 if(data.nav==='ox'){event.stopImmediatePropagation();screen='ox';modal=null;oxView=activeOXSession()?'quiz':'home';render();window.scrollTo(0,0);return}
 if(data.oxStart){event.stopImmediatePropagation();newOXSession(data.oxStart,Number(data.count)||10);return}
 if(data.oxEra){event.stopImmediatePropagation();newOXSession('era',Math.min(30,OX_QUESTIONS.filter(question=>question.eraId===data.oxEra).length),data.oxEra);return}
 if(data.oxResume){event.stopImmediatePropagation();oxView='quiz';screen='ox';render();window.scrollTo(0,0);return}
 if(data.oxAnswer!==undefined){event.stopImmediatePropagation();answerOX(data.oxAnswer==='true');return}
 if(data.oxNext){event.stopImmediatePropagation();nextOXQuestion();return}
 if(data.oxBack){event.stopImmediatePropagation();oxView='home';screen='ox';render();window.scrollTo(0,0);return}
 if(data.oxHome){event.stopImmediatePropagation();oxView='home';screen='ox';render();window.scrollTo(0,0);return}
 if(data.oxRetry){event.stopImmediatePropagation();const last=oxMeta().lastSession;newOXSession(last.mode,last.questionIds.length,last.eraId,last.questionIds);return}
 if(data.oxRetryWrong){event.stopImmediatePropagation();const last=oxMeta().lastSession,ids=last.questionIds.filter(id=>last.results[id]===false);newOXSession('wrong',ids.length,null,ids);return}
 if(data.oxReviewOne){event.stopImmediatePropagation();newOXSession('wrong',1,null,[data.oxReviewOne]);return}
},true);

const initialOX=ensureOXMeta();
if(initialOX.activeSession){screen='ox';oxView='quiz'}
globalThis.OX_QUIZ_UI_READY=true;
render();
})();
