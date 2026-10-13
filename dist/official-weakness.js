/* Derived official-exam analysis and read-only wrong-answer navigation. */
(() => {
 if(!globalThis.CORE_APP_READY||typeof renderContent!=='function')return;
 const catalog=globalThis.OFFICIAL_EXAM_CATALOG||[],eras=globalThis.OFFICIAL_ERA_TAXONOMY||[];
 const questions=new Map(QUESTIONS.map(q=>[q.questionId,q]));
 const entries=new Map();for(const entry of catalog)for(const id of [entry.canonicalQuestionId,entry.sourceRecord.officialQuestionId,...entry.aliases])entries.set(id,entry);
 const oxQuestions=new Map((globalThis.OX_QUESTIONS||[]).map(q=>[q.id,q]));
 const oxEras=globalThis.OX_QUIZ_API?.eraStats()||[];
 const oxEraLabel=id=>oxEras.find(e=>e.id===id)?.shortName||id;
 const cores=new Map((globalThis.OFFICIAL_EXAM_EXPLANATION_RECORDS||[]).map(r=>[r.officialQuestionId,r]));
 // Match OX's ten-unique-question minimum. A majority-sized 40% latest
 // error rate, or 25% plus three repeat errors, warrants focused review.
 const policy=Object.freeze({minimumQuestions:10,highWrongRate:40,repeatWrongRate:25,repeatErrors:3,recentDays:7});
 const integer=v=>Math.max(0,Math.floor(Number(v)||0));
 let detailId=null,detailKind=null,reviewStatus='all',retryIds=[];
 function records(data=meta()){
  const eventById=new Map(),wrongById=new Map();
  for(const event of data.learningEvents||[]){const id=entries.get(event.questionId)?.canonicalQuestionId||event.questionId;if(!eventById.has(id))eventById.set(id,[]);eventById.get(id).push(event);}
  for(const event of data.wrongAnswers||[])wrongById.set(entries.get(event.questionId)?.canonicalQuestionId||event.questionId,event);
  const rows=new Map();
  for(const [id,record]of Object.entries(data.questionRecords||{})){
   const canonical=entries.get(id)?.canonicalQuestionId||id;if(rows.has(canonical))continue;
   const events=eventById.get(canonical)||[],submitted=events.filter(e=>Number.isInteger(e.answer)),unanswered=events.filter(e=>e.answer===null).length;
   const attempts=Math.max(0,integer(record.attempts)-unanswered);
   if(!attempts&&!submitted.length)continue;
   const latest=submitted[submitted.length-1],lastCorrect=latest?Boolean(latest.correct):typeof record.lastCorrect==='boolean'&&(!events.length||Number.isInteger(record.lastAnswer))?record.lastCorrect:null;
   const wrongCount=Math.max(0,integer(record.attempts)-integer(record.correctCount)-unanswered);
   const wrongEvents=submitted.filter(e=>e.correct===false),wrongEvent=wrongEvents[wrongEvents.length-1],legacyWrong=wrongById.get(canonical);
   rows.set(canonical,{id:canonical,attempts:Math.max(attempts,submitted.length),wrongCount,lastCorrect,lastAnswer:latest?.answer??record.lastAnswer,lastAnsweredAt:latest?.answeredAt||record.lastAttempt||null,lastWrongAt:wrongEvent?.answeredAt||legacyWrong?.answeredAt||null});
  }
  return rows;
 }
 function analysis(data=meta(),now=Date.now()){
  const all=records(data),since=now-policy.recentDays*86400000;
  return eras.map(era=>{
   const rows=catalog.filter(e=>e.primaryEra===era.id).map(e=>all.get(e.canonicalQuestionId)).filter(Boolean);
   const known=rows.filter(r=>typeof r.lastCorrect==='boolean'),wrong=known.filter(r=>!r.lastCorrect).length,correct=known.length-wrong;
   const wrongCount=rows.reduce((n,r)=>n+r.wrongCount,0),repeatErrors=rows.reduce((n,r)=>n+Math.max(0,r.wrongCount-1),0),wrongRate=known.length?Math.round(wrong/known.length*100):null;
   const eligible=known.length>=policy.minimumQuestions,weak=eligible&&(wrongRate>=policy.highWrongRate||(wrongRate>=policy.repeatWrongRate&&repeatErrors>=policy.repeatErrors));
   return {...era,solved:rows.length,known:known.length,wrong,correct,accuracy:known.length?Math.round(correct/known.length*100):null,wrongRate,wrongCount,repeatErrors,recentWrong:rows.some(r=>r.wrongCount>0&&Date.parse(r.lastWrongAt)>=since),eligible,weak};
  });
 }
 function analysisHTML(){
  const rows=analysis(),total=rows.reduce((n,r)=>n+r.solved,0),ranked=rows.slice().sort((a,b)=>Number(b.weak)-Number(a.weak)||Number(b.eligible)-Number(a.eligible)||(b.wrongRate||0)-(a.wrongRate||0)||b.repeatErrors-a.repeatErrors);
  return '<section class="official-weakness" aria-label="기출문제 시대별 취약점"><header><div><small>기출문제 분석</small><h2>시대별 취약점</h2></div></header><p class="notebook-note">정답률은 문항별 최근 제출 답안 기준 · 오답 횟수는 누적 기록입니다. OX 기록은 포함하지 않습니다.</p>'+(!total?'<div class="ed-empty">아직 제출한 기출 답안이 없어요. 문제를 풀면 시대별 분석이 쌓입니다.</div>':'')+'<div class="official-weakness-grid">'+ranked.map(r=>'<button class="official-weakness-card '+(r.weak?'weak':'')+'" data-official-weak-era="'+r.id+'" aria-label="'+esc(r.name)+' 기출 오답 보기"><span class="weakness-card-title"><b>'+esc(r.name)+'</b><span class="notebook-chip '+(r.weak?'wrong':'')+'">'+(!r.solved?'학습 전':!r.eligible?'표본 부족':r.weak?'집중 복습':'학습 중')+'</span></span><span class="weakness-accuracy"><strong>'+(r.accuracy===null?'—':r.accuracy+'%')+'</strong><small>최근 정답률</small></span><span class="progress"><span style="width:'+(r.accuracy||0)+'%"></span></span><span class="weakness-counts">'+r.solved+'문항 풀이 · 최근 오답 '+r.wrong+'문항</span><span class="weakness-counts">오답률 '+(r.wrongRate===null?'—':r.wrongRate+'%')+' · 누적 '+r.wrongCount+'회 틀림'+(r.recentWrong?' · 최근 7일 오답':'')+'</span><span class="weakness-link">오답 복습 <span aria-hidden="true">›</span></span></button>').join('')+'</div><details class="weakness-policy"><summary>분석 기준</summary><p>최근 답안을 확인할 수 있는 서로 다른 기출 10문항 이상부터 판단합니다. 최근 오답률 40% 이상, 또는 오답률 25% 이상이면서 반복 오답이 3회 이상이면 집중 복습으로 표시합니다. 반복 오답은 문항별 첫 오답 이후의 추가 오답 횟수입니다. 날짜가 없는 과거 기록은 최근 7일 판단에서 제외합니다.</p></details></section>';
 }
 const priorContent=renderContent;
 renderContent=function(){let html=priorContent();if(screen==='exam-library'&&html.includes('<div class="official-grid">'))html=html.replace('<div class="official-grid">',analysisHTML()+'<div class="official-grid">');if(screen==='records')html+=analysisHTML();return html;};
 function title(q){const source=entries.get(q.questionId),core=cores.get(source?.sourceRecord.officialQuestionId);return core?.question||(!/원문 이미지에서|원문 확인/.test(q.sourceQuestionText||'')?q.sourceQuestionText:null)||q.question.split('\n')[0];}
 function eraOf(q){return entries.get(q.questionId)?.primaryEra||chapterEra(q.chapterId);}
 function eraName(id){return eras.find(e=>e.id===id)?.name||LEARNING_ERAS.find(e=>e.id===id)?.name||id;}
 function card(q,r){
  const official=Boolean(entries.get(q.questionId)||isVerifiedOfficialQuestion(q)),era=eraOf(q),label=official?String(q.examRound)+'회 '+q.examLevel+' · '+q.questionNumber+'번':questionSourceLabel(q);
  return '<article class="notebook-row"><button class="notebook-card" data-wrong-open="'+esc(q.questionId)+'"><span class="notebook-copy"><span class="notebook-chips"><span class="notebook-chip">'+(official?'기출문제':esc(questionKind(q)))+'</span><span class="notebook-chip wrong">'+r.wrongCount+'회 틀림</span><span class="notebook-chip">'+esc(eraName(era))+'</span></span><small>'+esc(label)+'</small><strong>'+esc(title(q))+'</strong><span class="notebook-state '+(r.lastCorrect===true?'completed':'')+'">'+(r.lastCorrect===true?'최근 정답 · 복습 완료':'최근 오답 · 복습 필요')+'</span></span><span class="notebook-chevron" aria-hidden="true">›</span></button></article>';
 }
 function oxRows(){const saved=globalThis.OX_QUIZ_API?.snapshot().meta||{},times=new Map();for(const e of saved.history||[])if(e.isCorrect===false)times.set(e.questionId,e.answeredAt);return Object.entries(saved.records||{}).filter(([,r])=>r.wrongCount>0).map(([id,r])=>({id,q:oxQuestions.get(id),r:{...r,lastWrongAt:times.get(id)||(r.lastCorrect===false?r.lastAnsweredAt:null)}})).filter(x=>x.q);}
 function oxCard({id,q,r}){
  return '<article class="notebook-row"><button class="notebook-card" data-wrong-ox-open="'+esc(id)+'"><span class="notebook-copy"><span class="notebook-chips"><span class="notebook-chip">OX 퀴즈</span><span class="notebook-chip wrong">'+integer(r.wrongCount)+'회 틀림</span><span class="notebook-chip">'+esc(oxEraLabel(q.eraId))+'</span></span><strong>'+esc(q.statement)+'</strong><span class="notebook-state '+(r.lastCorrect?'completed':'')+'">'+(r.lastCorrect?'최근 정답 · 복습 완료':'최근 오답 · 복습 필요')+'</span></span><span class="notebook-chevron" aria-hidden="true">›</span></button></article>';
 }
 function statusMatches(r){return reviewStatus==='all'||(reviewStatus==='completed'?r.lastCorrect===true:r.lastCorrect===false);}
 function notebook(){
  const allRecords=records(),since=Date.now()-policy.recentDays*86400000;
  const officialOnly=wrongFilter==='official',oxOnly=wrongFilter==='ox',allIds=new Set([...(meta().wrongQuestionIds||[]),...Array.from(allRecords.values()).filter(r=>r.wrongCount>0).map(r=>r.id)]);
  const list=Array.from(allIds).map(id=>({q:questions.get(id),r:allRecords.get(id)})).filter(x=>x.q&&x.r&&x.r.wrongCount>0&&(globalThis.THREE_LEARNING_BOUNDARY?.canPractice(x.q)??true)&&(globalThis.PROTO_LEARNING_BOUNDARY?.canPractice(x.q)??true));
  const visible=list.filter(({q,r})=>!oxOnly&&(!officialOnly||entries.has(q.questionId)||isVerifiedOfficialQuestion(q))&&(wrongEra==='all'||eraOf(q)===wrongEra)&&(wrongChapter==='all'||q.chapterId===wrongChapter)&&(wrongConcept==='all'||learningConcepts(q).includes(wrongConcept))&&(wrongFilter!=='repeated'||r.wrongCount>1)&&(wrongFilter!=='recent'||Date.parse(r.lastWrongAt)>=since)&&statusMatches(r)).sort((a,b)=>String(b.r.lastWrongAt||'').localeCompare(String(a.r.lastWrongAt||'')));
  const ox=oxRows().filter(x=>!officialOnly&&(wrongEra==='all'||x.q.eraId===wrongEra)&&(wrongFilter!=='repeated'||x.r.wrongCount>1)&&(wrongFilter!=='recent'||Date.parse(x.r.lastWrongAt)>=since)&&statusMatches(x.r)&&(wrongChapter==='all'&&wrongConcept==='all'));
  const eraOptions=oxOnly?oxEras.map(e=>({id:e.id,name:e.name})):Array.from(new Map([...LEARNING_ERAS,...eras].map(e=>[e.id,e])).values());
  retryIds=visible.filter(x=>x.r.lastCorrect===false&&entries.has(x.q.questionId)).map(x=>x.q.questionId);
  const count=visible.length+ox.length;
  return editorialHeader('오답노트','틀린 순간을 나의 지식으로')+'<section class="notebook"><div class="tabs v2-wrong-tabs">'+[['all','전체'],['official','기출문제'],['ox','OX 퀴즈'],['recent','최근 7일'],['repeated','반복 오답']].map(([id,label])=>'<button data-notebook-filter="'+id+'" aria-pressed="'+(wrongFilter===id)+'" class="'+(wrongFilter===id?'selected':'')+'">'+label+'</button>').join('')+'</div><div class="v2-filters notebook-filters"><label>시대<select data-notebook-era><option value="all">전체 시대</option>'+eraOptions.map(e=>'<option value="'+e.id+'" '+(wrongEra===e.id?'selected':'')+'>'+esc(e.name)+'</option>').join('')+'</select></label><label>복습 상태<select data-notebook-status>'+[['all','전체 이력'],['needed','복습 필요'],['completed','복습 완료']].map(([id,label])=>'<option value="'+id+'" '+(reviewStatus===id?'selected':'')+'>'+label+'</option>').join('')+'</select></label>'+(oxOnly?'':'<label>챕터<select data-wrong-chapter><option value="all">전체 챕터</option>'+chapterOrder().filter(ch=>wrongEra==='all'||chapterEra(ch.chapterId)===wrongEra).map(ch=>'<option value="'+ch.chapterId+'" '+(wrongChapter===ch.chapterId?'selected':'')+'>CH.'+ch.number+' '+esc(ch.title)+'</option>').join('')+'</select></label><label>개념<select data-wrong-concept><option value="all">전체 개념</option>'+[...new Set(list.flatMap(x=>learningConcepts(x.q)))].map(c=>'<option '+(wrongConcept===c?'selected':'')+'>'+esc(c)+'</option>').join('')+'</select></label>')+'</div><p class="notebook-note">누적 오답 횟수는 다시 맞혀도 유지됩니다.</p><section class="notebook-list" aria-label="오답 목록"><h2>오답 기록 · '+count+'</h2>'+(count?visible.map(x=>card(x.q,x.r)).join('')+ox.map(oxCard).join(''):'<div class="ed-empty">선택한 조건에 맞는 오답이 없습니다.</div>')+'</section><button class="secondary notebook-all" data-notebook-retry-all="true" '+(retryIds.length?'':'disabled')+'>기출 오답 전체 풀기</button><button class="ed-link" data-nav="exam-library">전체 기출문제 보기 ›</button></section>';
 }
 function detail(){
  const back='<button class="secondary notebook-back" data-notebook-back="true">‹ 오답 목록</button>';
  if(detailKind==='ox'){
   const q=oxQuestions.get(detailId),r=globalThis.OX_QUIZ_API?.snapshot().meta.records[detailId];if(!q||!r)return back+'<div class="ed-empty">오답 기록을 찾을 수 없습니다.</div>';
   return back+'<section class="notebook-detail"><span class="notebook-chip">OX 퀴즈</span><span class="notebook-chip wrong">'+r.wrongCount+'회 틀림</span><h1>'+esc(q.statement)+'</h1><p>내 최근 답 '+(r.lastAnswer?'O':'X')+' · 정답 '+(q.answer?'O':'X')+'</p><p>'+esc(q.explanation||q.correctExplanation||'')+'</p><p class="notebook-state">'+(r.lastCorrect?'최근 정답 · 복습 완료':'최근 오답 · 복습 필요')+'</p><button class="primary" data-ox-review-one="'+esc(q.id)+'">다시 풀기</button></section>';
  }
  const q=questions.get(detailId);if(!q)return back+'<div class="ed-empty">문제를 찾을 수 없습니다.</div>';
  v2OpenWrongDetails.add(q.questionId);
  return back+'<section class="notebook-detail">'+v2QuestionRow(q).replace('다시 풀기 · 해설','다시 풀기').replace('내가 선택한 답','마지막 오답에서 선택한 답')+'</section>';
 }
 const priorStudy=study;
 study=function(){if(studyTab!=='review')return priorStudy();return detailId?detail():notebook();};
 function openNotebook(era){wrongFilter='official';wrongEra=era;wrongChapter='all';wrongConcept='all';reviewStatus='all';detailId=null;studyTab='review';navigate('study');}
 document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button||button.disabled)return;const d=button.dataset;
  if(d.nav||d.wrongFilter||d.studyJump)detailId=null;
  if(d.officialWeakEra){event.stopImmediatePropagation();openNotebook(d.officialWeakEra);return;}
  if(d.notebookFilter){event.stopImmediatePropagation();wrongFilter=d.notebookFilter;wrongEra='all';wrongChapter='all';wrongConcept='all';detailId=null;render();return;}
  if(d.wrongOpen||d.wrongOxOpen){event.stopImmediatePropagation();detailId=d.wrongOpen||d.wrongOxOpen;detailKind=d.wrongOxOpen?'ox':'official';render();window.scrollTo(0,0);return;}
  if(d.notebookBack){event.stopImmediatePropagation();detailId=null;render();window.scrollTo(0,0);return;}
  if(d.notebookRetryAll){event.stopImmediatePropagation();if(retryIds.length)globalThis.OFFICIAL_EXAM_UI.startLearning(retryIds,{scope:'wrong-review'});return;}
 },true);
 document.addEventListener('change',event=>{
  const el=event.target;
  if(el.matches('[data-notebook-era]')){wrongEra=el.value;wrongChapter='all';wrongConcept='all';detailId=null;render();}
  if(el.matches('[data-notebook-status]')){reviewStatus=el.value;render();}
 });
 globalThis.OFFICIAL_WEAKNESS_API=Object.freeze({policy,analysis:(data,now)=>analysis(data,now),records:data=>Array.from(records(data).values()),open:openNotebook});
 render();
})();
