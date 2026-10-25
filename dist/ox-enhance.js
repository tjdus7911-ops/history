/* OX 퀴즈 개선: 오늘의 10문제, 시대별 진행 막대, 스피드 모드(문제당 10초), 연속 정답, 큰 O/X 결과 도장,
 * 해설 핵심 문장 강조, '족보에서 개념 보기' 연결, 결과 화면의 '족보에 저장'·최고 연속 정답.
 * 기존 OX 기록·세션·라우트는 그대로 쓰고 화면만 덧입힌다. */
(function(){
 'use strict';
 const views=globalThis.REV7_OX_VIEWS,api=globalThis.OX_QUIZ_API;if(!views||!api)return;
 const LINKS=globalThis.OX_JOKBO_LINKS||{},jokbo=()=>globalThis.JOKBO_API;
 const SPEED_KEY='history-ox:speed:v1',SPEED_SECONDS=10;
 const store=(()=>{try{return globalThis.localStorage||null}catch{return null}})();
 let speed=false;try{speed=store?.getItem(SPEED_KEY)==='1'}catch{}
 const timedOut=new Set();
 const chevron='<span class="r7-icon" aria-hidden="true"><img alt="" src="media/rev7/chevron.svg"></span>';
 const today=()=>new Date().toLocaleDateString('sv-SE');
 const byId=id=>views.questionById(id);

 // ── 홈: 오늘의 10문제 + 시대별 진행 막대 + 스피드 모드 ──
 function todayCard(){
  const wrong=views.wrongIds('all').length,daily=views.meta().daily,done=daily&&daily.date===today()&&daily.completed;
  return '<section class="ox-today'+(done?' is-done':'')+'"><div class="ox-today-copy"><small>오늘의 OX</small><h2>'+(done?'오늘 10문제 완료!':'하루 10문제로 감 잡기')+'</h2><p>'+(done?'정답률 <b>'+daily.accuracy+'%</b> · 한 번 더 풀면 다른 문제가 나와요.':wrong?'틀렸던 문제 <b>'+Math.min(wrong,5)+'개</b>를 먼저, 이어서 아직 안 푼 문제를 섞어 드려요.':'아직 안 푼 문제부터 골라 드려요. 시대를 고르지 않아도 돼요.')+'</p></div><button class="r7-primary" data-ox-today>'+(done?'한 번 더 풀기':'오늘의 10문제 시작')+'</button></section>';
 }
 function eraRows(){
  const session=views.active(),eras=[{id:'all',name:'전체 시대',description:'한 번에 섞어서 풀어요'},...globalThis.OX_ERAS.map(e=>({id:e.id,name:e.name,description:views.descriptions[e.id]||'핵심 개념을 확인해요.'}))];
  return eras.map(e=>{
   const st=views.stats(e.id==='all'?null:e.id),inProgress=session&&(e.id==='all'?!session.eraId&&session.mode!=='daily':session.eraId===e.id&&session.mode!=='review');
   const pct=st.total?Math.round(st.learned/st.total*100):0;
   const action=inProgress?'data-ox-resume="true"':e.id==='all'?'data-ox-start="all"':'data-ox-era="'+e.id+'"';
   const meta=st.learned?'<b>'+st.learned+'</b>/'+st.total+'문제 · 정답률 <b class="'+(st.accuracy<70?'is-low':'is-good')+'">'+st.accuracy+'%</b>':'전체 '+st.total+'문제 · 아직 안 풀었어요';
   return '<button class="r7-ox-row ox-era-row" '+action+' aria-label="'+esc(e.name+', '+(st.learned?st.learned+'/'+st.total+'문제 학습, 정답률 '+st.accuracy+'%':'아직 안 풀었어요')+(inProgress?', 풀던 중':''))+'"><span><b>'+esc(e.name)+(inProgress?' <em class="ox-row-live">풀던 중 '+(session.index+1)+'/'+session.questionIds.length+'</em>':'')+'</b><small>'+esc(e.description)+'</small><span class="ox-row-progress" aria-hidden="true"><i style="width:'+pct+'%"></i></span><small class="ox-row-meta">'+meta+'</small></span>'+chevron+'</button>';
  }).join('');
 }
 const homeBefore=views.home();
 views.setHome(function(){
  let html=homeBefore();
  html=html.replace(/(<p class="r7-intro">[\s\S]*?<\/p>)/,'$1'+todayCard());
  const start=html.indexOf('<div class="r7-section-title"><h2>시대 골라 풀기</h2>'),end=Math.min(...['<button class="r7-analysis-link"','<details class="r7-legacy">'].map(m=>{const i=html.indexOf(m,start);return i<0?Infinity:i;}));
  if(start>=0&&Number.isFinite(end))html=html.slice(0,start)+'<div class="r7-section-title"><h2>시대 골라 풀기</h2><button type="button" class="ox-speed-toggle" data-ox-speed aria-pressed="'+speed+'"><span class="ox-speed-dot" aria-hidden="true"></span>스피드 모드 '+SPEED_SECONDS+'초</button></div>'+eraRows()+html.slice(end);
  return html;
 });

 // ── 문제 화면 ──
 function streakNow(session){
  let n=0;for(let i=session.index;i>=0;i--){const id=session.questionIds[i];if(!Object.hasOwn(session.results,id))continue;if(session.results[id])n++;else break;}return n;
 }
 function firstSentence(text){const t=String(text||'').trim(),m=t.match(/^(.+?[.!?])(\s+|$)/);return m?[m[1],t.slice(m[0].length).trim()]:[t,''];}
 function jokboLink(question){
  const id=LINKS[question.id],k=id&&jokbo()?.keyword?.(id);if(!k)return '';
  return '<button type="button" class="ox-jokbo-link" data-ox-jokbo="'+esc(id)+'" aria-label="족보에서 '+esc(k.label+' '+k.value)+' 개념 보기"><span><small>족보에서 개념 보기</small><b>'+esc(k.group)+' · '+esc(k.value)+'</b></span><i aria-hidden="true">›</i></button>';
 }
 function enhanceQuiz(html){
  const session=views.active(),question=views.question();if(!session||!question||!html.includes('r7-ox-play'))return html;
  const answered=Object.hasOwn(session.answers,question.id),correct=session.results[question.id],picked=session.answers[question.id];
  if(session.mode==='daily')html=html.replace(/<b>OX 퀴즈<\/b>/,'<b>오늘의 OX</b>');
  const streak=streakNow(session);
  if(streak>=2)html=html.replace('<span class="r7-ox-left">','<span class="ox-streak" aria-label="'+streak+'연속 정답">'+streak+'연속 정답</span><span class="r7-ox-left">');
  if(!answered){
   html=html.replace('class="r7-page r7-ox-play','class="r7-page ox-compact r7-ox-play');
   if(speed)html=html.replace('<div class="r7-ox-deck">','<div class="ox-timer" role="timer" aria-label="문제당 '+SPEED_SECONDS+'초"><i data-ox-timer="'+esc(question.id)+'" style="animation-duration:'+SPEED_SECONDS+'s"></i></div><div class="r7-ox-deck">');
   return html;
  }
  const mark=v=>v?'O':'X',late=timedOut.has(session.id+':'+question.id);
  html=html.replace(/<div class="r7-ox-verdict[^"]*">[\s\S]*?<\/div>/,'<div class="r7-ox-verdict ox-verdict '+(correct?'correct':'incorrect')+'"><span class="ox-big-stamp is-'+(question.answer?'o':'x')+'" aria-hidden="true">'+mark(question.answer)+'</span><span class="ox-verdict-copy"><strong>'+(late?'시간 초과':correct?'맞혔어요':'틀렸어요')+'</strong><span>정답은 <b>'+mark(question.answer)+'</b>'+(late?'':' · 내 선택 '+mark(picked))+'</span></span></div>');
  const [key,rest]=firstSentence(question.explanation);
  html=html.replace(/<div class="r7-ox-explain"><small>해설<\/small><p>[\s\S]*?<\/p><\/div>/,'<div class="r7-ox-explain"><small>해설</small><p class="ox-key">'+esc(key)+'</p>'+(rest?'<p>'+esc(rest)+'</p>':'')+'</div>'+jokboLink(question));
  return html;
 }
 globalThis.__OX_ENHANCE_QUIZ__=enhanceQuiz;

 // 렌더 결과를 덧입힌다: 퀴즈·결과 화면.
 const contentBefore=renderContent;
 renderContent=function(){
  let html=contentBefore();
  if(screen!=='ox')return html;
  if(html.includes('r7-ox-play'))return enhanceQuiz(html);
  if(html.includes('ox-result-score'))return enhanceResult(html);
  return html;
 };

 // ── 결과 화면 ──
 function bestStreak(session){let best=0,n=0;for(const id of session.questionIds){if(session.results[id]){n++;best=Math.max(best,n);}else n=0;}return best;}
 function enhanceResult(html){
  const last=views.meta().lastSession;if(!last?.summary)return html;
  const best=bestStreak(last);
  html=html.replace(/(<section class="ox-result-score">[\s\S]*?<p>[^<]*)(<\/p>)/,'$1 · 최고 '+best+'연속 정답$2'+(last.mode==='daily'?'<p class="ox-daily-done">오늘의 OX 완료!</p>':''));
  const wrongIds=last.questionIds.filter(id=>last.results[id]===false);let i=0;
  html=html.replace(/<\/p><\/details>/g,m=>{
   const q=byId(wrongIds[i++]);const id=q&&LINKS[q.id];if(!id||!jokbo())return m;
   const k=jokbo().keyword(id),saved=jokbo().isSaved(id);
   return '</p><div class="ox-result-links"><button type="button" class="ox-mini" data-ox-save-jokbo="'+esc(id)+'" aria-pressed="'+saved+'">'+(saved?'족보에 저장됨':'족보에 저장')+'</button><button type="button" class="ox-mini" data-ox-jokbo="'+esc(id)+'">'+esc(k.value)+' 보기 ›</button></div></details>';
  });
  return html;
 }

 // ── 동작 ──
 function startToday(){
  const wrong=views.wrongIds('all').slice().sort(()=>Math.random()-.5).slice(0,5);
  const rest=api.choose(20,{seed:'daily:'+today()+':'+Date.now()}).filter(id=>!wrong.includes(id)).slice(0,10-wrong.length);
  const ids=[...wrong,...rest].slice(0,10);
  for(let i=ids.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}
  api.startSession('daily',null,{count:ids.length,questionIds:ids});
 }
 document.addEventListener('click',event=>{
  const b=event.target.closest?.('button');if(!b)return;const d=b.dataset;
  if(d.oxToday!==undefined){event.stopImmediatePropagation();startToday();return;}
  if(d.oxSpeed!==undefined){event.stopImmediatePropagation();speed=!speed;try{store?.setItem(SPEED_KEY,speed?'1':'0')}catch{}const y=scrollY;render();scrollTo(0,y);toast(speed?'스피드 모드: 문제마다 '+SPEED_SECONDS+'초 안에 답해요.':'스피드 모드를 껐어요.');return;}
  if(d.oxJokbo){event.stopImmediatePropagation();const route=views.readRoute()||'ox';if(!jokbo()?.openDetail(d.oxJokbo,route))toast('족보를 열 수 없어요.');return;}
  if(d.oxSaveJokbo){event.stopImmediatePropagation();const on=jokbo()?.toggleSave(d.oxSaveJokbo);b.setAttribute('aria-pressed',String(Boolean(on)));b.textContent=on?'족보에 저장됨':'족보에 저장';toast(on?'족보의 저장한 키워드에 담았어요.':'저장을 해제했어요.');return;}
 },true);
 // 스피드 모드: 막대가 다 줄어들면(10초) 아직 답하지 않은 문제는 시간 초과로 오답 처리한다.
 document.addEventListener('animationend',event=>{
  const bar=event.target;if(!bar?.matches?.('[data-ox-timer]'))return;
  const session=views.active(),question=views.question();if(!session||!question||question.id!==bar.dataset.oxTimer||Object.hasOwn(session.answers,question.id))return;
  timedOut.add(session.id+':'+question.id);
  document.querySelector('[data-ox-answer="'+(!question.answer)+'"]')?.click();
 });
 globalThis.OX_ENHANCE_API=Object.freeze({speed:()=>speed,setSpeed:v=>{speed=Boolean(v);try{store?.setItem(SPEED_KEY,speed?'1':'0')}catch{}},startToday,links:()=>LINKS});
 if(screen==='ox')render();
})();
