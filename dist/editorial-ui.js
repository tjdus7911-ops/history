/* Latest editorial UI. Story, scoring and chapter transitions remain in app.js. */
const LEARNING_ERAS=[
 {id:'goryeo',name:'고려',years:'918 — 1392',accent:'#95682e',description:'새 나라의 탄생을 지나,\n왕의 힘이 자라는 고려를\n살아갑니다.',available:true},
 {id:'joseon',name:'조선',years:'1392 — 1897',accent:'#963e34',description:'새 나라의 시작부터\n격변의 순간까지,\n조선 500년을 살아갑니다.'},
 {id:'empire',name:'대한제국',years:'1897 — 1910',accent:'#555774',description:'오래된 질서와 새로운 세계가\n만나는 격변의 시대를\n준비하고 있어요.'},
 {id:'occupation',name:'일제강점기',years:'1910 — 1945',accent:'#635343',description:'빼앗긴 일상 속에서도\n이어진 사람들의 이야기를\n준비하고 있어요.'},
 {id:'republic',name:'대한민국',years:'1945 — 현재',accent:'#36587b',description:'오늘의 대한민국을 만든\n변화와 선택의 순간들을\n준비하고 있어요.'}
];
const eraInfo=id=>LEARNING_ERAS.find(e=>e.id===id)||LEARNING_ERAS[0];
const chapterEra=id=>CHAPTERS[id]?.eraId||'goryeo';
const eraHero=id=>eraProtagonist(id)?.assetPaths.hero||'';
let selectedEra=eraInfo(meta().selectedLearningEra).id,eraTab='chapters',homeEraIndex=0,recordEra='all',recordPeriod='today',wrongEra='all';
const eraChapters=id=>chapterOrder().filter(ch=>chapterEra(ch.chapterId)===id);
const eraQuestions=id=>QUESTIONS.filter(q=>chapterEra(q.chapterId)===id&&!q.retired&&!q.reviewOnly);
function editorialChapterYears(ch){if(ch.years)return ch.years;const years=Object.values(STORIES).filter(s=>s.chapterId===ch.chapterId&&Number.isFinite(s.year)).map(s=>s.year);if(!years.length)return '';const start=Math.min(...years),end=Math.max(...years);return start===end?String(start):start+' — '+end}
function eraProgress(id){const chapters=eraChapters(id);return chapters.length?Math.round(chapters.reduce((n,ch)=>n+chapterProgress(ch.chapterId),0)/chapters.length):(meta().eraProgress?.[id]?.progress||0)}
function rememberEraProgress(){
 const id=chapterEra(mainRun().currentChapter),previous=meta().eraProgress?.[id];
 meta().eraProgress||={};
 meta().eraProgress[id]={...previous,lastChapter:mainRun().currentChapter,lastScene:mainRun().storyId,progress:eraProgress(id),resume:{run:JSON.parse(JSON.stringify(run())),mainRun:state.mainRun?JSON.parse(JSON.stringify(state.mainRun)):null},updatedAt:previous?.updatedAt||null};
 if(['game','quiz','complete'].includes(screen)&&mainRun().started){meta().eraProgress[id].updatedAt=new Date().toISOString();meta().lastLearningEra=id;}
}
const saveBeforeEditorial=save;
save=function(){const draft=meta().editorialAnswerDraft;if(draft&&draft.questionId===activeQuestion()?.questionId&&(quizMode==='story'?run().questionAnswer:reviewAnswer)!==null)delete meta().editorialAnswerDraft;rememberEraProgress();saveBeforeEditorial()};
rememberEraProgress();
function resumeEra(id){
 const era=eraInfo(id);if(!era.available)return;
 const current=chapterEra(mainRun().currentChapter);
 if(current!==id){rememberEraProgress();const resume=meta().eraProgress[id]?.resume;if(!resume)return;state.run=JSON.parse(JSON.stringify(resume.run));state.mainRun=resume.mainRun?JSON.parse(JSON.stringify(resume.mainRun)):null;}
 selectedEra=id;meta().selectedLearningEra=id;return playMain();
}
function periodLearning(m,period='today',era='all',now=new Date()){
 const matches=id=>era==='all'||chapterEra(QUESTIONS.find(q=>q.questionId===id)?.chapterId)===era;
 const boundary=new Date(now);boundary.setHours(0,0,0,0);boundary.setDate(boundary.getDate()-(period==='7'?6:period==='30'?29:0));
 const events=(m.learningEvents||[]).filter(e=>learningDay(e.answeredAt)&&new Date(e.answeredAt)<=now&&matches(e.questionId));
 let attempts=0,correct=0;
 if(period==='all'){for(const [id,r]of Object.entries(m.questionRecords||{}))if(matches(id)){attempts+=r.attempts||0;correct+=r.correctCount||0}}
 else{const selected=events.filter(e=>new Date(e.answeredAt)>=boundary);attempts=selected.length;correct=selected.filter(e=>e.correct).length;}
 const days=new Set(events.map(e=>learningDay(e.answeredAt))),cursor=new Date(now);let streak=0;if(!days.has(learningDay(now)))cursor.setDate(cursor.getDate()-1);while(days.has(learningDay(cursor))){streak++;cursor.setDate(cursor.getDate()-1)}
 return {attempts,correct,wrong:Math.max(0,attempts-correct),accuracy:attempts?Math.round(correct/attempts*100):null,streak};
}
/* A study index for the currently available curriculum, never a probability of passing. */
const READINESS_WEIGHTS={accuracy:.55,coverage:.25,chapters:.20,recentAnswers:30};
function learningReadiness(m,era='all'){
 const eligible=QUESTIONS.filter(q=>!q.retired&&!q.reviewOnly&&isVerifiedOfficialQuestion(q)&&q.examLevel==='심화'&&(era==='all'||chapterEra(q.chapterId)===era));
 const keys=new Set(),questions=eligible.filter(q=>{const key=[q.examRound,q.examLevel,q.questionNumber].join(':');if(keys.has(key))return false;keys.add(key);return true});
 const ids=new Set(eligible.map(q=>q.questionId)),records=eligible.map(q=>m.questionRecords?.[q.questionId]).filter(Boolean);
 const recent=(m.learningEvents||[]).filter(e=>ids.has(e.questionId)&&learningDay(e.answeredAt)&&new Date(e.answeredAt)<=new Date()).sort((a,b)=>a.answeredAt.localeCompare(b.answeredAt)).slice(-READINESS_WEIGHTS.recentAnswers);
 const attempts=recent.length||records.reduce((n,r)=>n+(r.attempts||0),0),correct=recent.length?recent.filter(e=>e.correct).length:records.reduce((n,r)=>n+(r.correctCount||0),0);
 const studied=new Set(eligible.filter(q=>m.questionRecords?.[q.questionId]?.attempts).map(q=>[q.examRound,q.examLevel,q.questionNumber].join(':'))).size;
 const chapters=chapterOrder().filter(ch=>ch.implemented&&(era==='all'||chapterEra(ch.chapterId)===era)),completed=chapters.filter(ch=>m.completedChapters.includes(ch.chapterId)).length;
 const accuracy=attempts?correct/attempts:0,coverage=questions.length?studied/questions.length:0,completion=chapters.length?completed/chapters.length:0;
 return {score:attempts?Math.round(100*(accuracy*READINESS_WEIGHTS.accuracy+coverage*READINESS_WEIGHTS.coverage+completion*READINESS_WEIGHTS.chapters)):null,attempts,studied,total:questions.length,completed,chapters:chapters.length,recent:recent.length>0};
}
function editorialIcon(name){const paths={profile:'<circle cx="12" cy="8" r="3.3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',book:'<path d="M3 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H3zM21 4h-6a3 3 0 0 0-3 3v14a4 4 0 0 1 4-2h5z"/>',note:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/>',target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="m12 12 8-8m-4 0h4v4"/>',fire:'<path d="M13 2c2 6-1 6 2 10 2-1 3-3 3-3 6 8 1 13-6 13S2 15 7 10c0 4 3 4 3 4-2-6 4-7 3-12Z"/>',cross:'<path d="m7 7 10 10M17 7 7 17"/>',home:'<path d="m3 11 9-8 9 8M6 9v12h5v-7h3v7h4V9"/>',records:'<path d="M5 21V10m5 11V4m5 17V7m5 14V1"/>'};return '<svg viewBox="0 0 24 24" class="ed-icon" aria-hidden="true">'+(paths[name]||paths.book)+'</svg>'}
function editorialHeader(title,tagline=''){return '<header class="ed-header"><div>'+(tagline?'<p>'+esc(tagline)+'</p>':'')+'<h1>'+esc(title)+'</h1></div><button class="ed-profile" data-action="status" aria-label="내 상태 보기">'+editorialIcon('profile')+'</button></header>'}
shell=function(content){const current=screen.startsWith('exam-')||(screen==='quiz'&&typeof librarySession!=='undefined'&&librarySession)?'exam-library':['era','game','quiz','complete','teaser','history'].includes(screen)?'home':screen;return '<div class="shell editorial-shell"><aside class="sidebar"><div class="brand">눈떠보니 한국사<small>역사를 살고, 기출로 기억하다</small></div><nav class="nav" aria-label="주 메뉴">'+[['home','홈','home'],['exam-library','기출문제','book'],['study','오답노트','note'],['records','내 기록','records']].map(([id,label,image])=>'<button data-nav="'+id+'" '+(current===id?'aria-current="page"':'')+' class="'+(current===id?'active':'')+'">'+editorialIcon(image)+'<span>'+label+'</span></button>').join('')+'</nav></aside><main class="main ed-screen ed-'+screen+'">'+content+'</main></div>'+(modal?modalHTML():'')};
function editorialMetrics(s){return '<div class="ed-metrics">'+[['fire',s.streak+'일','연속 학습'],['note',s.attempts,'푼 문제'],['target',percentText(s.accuracy),'정답률'],['cross',s.wrong,'오답']].map(([icon,value,label])=>'<div><span class="metric-icon '+icon+'">'+editorialIcon(icon)+'</span><strong>'+value+'</strong><small>'+label+'</small></div>').join('')+'</div>'}
function sectionHeading(title,action=''){return '<div class="ed-section-heading"><h2>'+title+'</h2>'+action+'</div>'}
function heroContent(e,detail=false){return '<img class="era-hero-art" data-protagonist-id="'+eraProtagonist(e.id).id+'" src="'+eraHero(e.id)+'" alt="'+esc(e.name)+'의 역사적 공간을 바라보는 주인공" '+(e.id!=='goryeo'?'loading="lazy"':'fetchpriority="high"')+'><div class="era-hero-shade"></div><div class="era-hero-copy"><h2><span>눈떠보니</span>'+e.name+'</h2><p class="era-years">'+e.years+'</p><p class="era-description">'+esc(e.description).replace(/\n/g,'<br>')+'</p>'+(detail?'':'<button class="era-study-cta" data-era-open="'+e.id+'">학습하기 <span>›</span></button>')+'</div>'}
home=function(){const today=periodLearning(meta()),recentEra=eraInfo(meta().lastLearningEra||chapterEra(mainRun().currentChapter)),r=recentEra.id===chapterEra(mainRun().currentChapter)?mainRun():meta().eraProgress?.[recentEra.id]?.resume?.run,ch=CHAPTERS[r?.currentChapter],s=STORIES[r?.pending?.sourceSceneId||r?.storyId]||STORIES[ch?.startStoryId];const wrong=[...new Set(meta().wrongQuestionIds)].map(id=>QUESTIONS.find(q=>q.questionId===id)).filter(q=>q&&isVerifiedOfficialQuestion(q)).sort((a,b)=>v2WrongTime(b).localeCompare(v2WrongTime(a)))[0],wr=wrong&&meta().questionRecords[wrong.questionId];return editorialHeader('눈떠보니 한국사','역사를 살고, 기출로 기억하다')+'<section class="era-carousel" aria-label="시대 선택"><div class="era-carousel-track" data-era-carousel tabindex="0" aria-label="옆으로 넘겨 시대 선택">'+LEARNING_ERAS.map(e=>'<article class="era-hero" data-era-slide="'+e.id+'" style="--era-accent:'+e.accent+'">'+heroContent(e)+'</article>').join('')+'</div><div class="era-dots" aria-label="시대 배너 위치">'+LEARNING_ERAS.map((e,i)=>'<button data-era-dot="'+i+'" aria-label="'+e.name+' 배너" aria-current="'+(i===homeEraIndex)+'"></button>').join('')+'</div></section><section class="ed-section">'+sectionHeading('오늘의 학습','<time>'+new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'short'})+'</time>')+editorialMetrics(today)+'</section><section class="ed-section">'+sectionHeading('최근 학습','<button class="ed-link" data-nav="era">전체 보기 ›</button>')+(r?.started&&s?'<button class="ed-activity" data-era-resume="'+recentEra.id+'"><img src="'+esc(ASSETS[s.illustrationId]?.src||ch.thumbnail)+'" alt=""><span><small>CH.'+ch.number+' '+esc(ch.title)+'</small><b>'+esc(s.title)+'</b><span class="ed-inline-progress"><i style="width:'+progressFor(r)+'%"></i></span><em>'+progressFor(r)+'%</em></span><span class="chevron">›</span></button>':'<div class="ed-empty">아직 시작한 이야기가 없어요.<br><button class="ed-link" data-era-open="goryeo">고려에서 첫 이야기를 시작해 보세요 ›</button></div>')+'</section><section class="ed-section">'+sectionHeading('최근 오답','<button class="ed-link" data-nav="study">전체 보기 ›</button>')+(wrong?'<button class="ed-activity recent-wrong" data-review="'+wrong.questionId+'"><img src="'+esc(wrong.sourceQuestionImage)+'" alt="실제 기출 문제 미리보기"><span><b>'+esc(wrong.sourceQuestionText||wrong.question.split('\n')[0])+'</b><span class="ed-tags"><small>'+wrong.examRound+'회 '+wrong.examLevel+'</small><small class="wrong-count">'+((wr?.attempts||0)-(wr?.correctCount||0))+'회 틀림</small></span></span><span class="chevron">›</span></button>':'<div class="ed-empty">아직 틀린 실제 기출이 없어요.<br>문제를 풀면 이곳에서 바로 다시 만날 수 있어요.</div>')+'</section>'};
function editorialChapterRow(ch){const status=chapterStatus(ch.chapterId);return '<article class="ed-chapter-row '+(status==='CURRENT'?'current':'')+'"><button data-chapter="'+ch.chapterId+'" aria-label="CH.'+ch.number+' '+esc(ch.title)+' '+(status==='LOCKED'?'잠금 안내':'상세 보기')+'"><img loading="lazy" src="'+esc(ch.thumbnail)+'" alt=""><span><small>CH.'+ch.number+'</small><b>'+esc(ch.title)+'</b><small>'+esc(editorialChapterYears(ch))+'</small></span><span class="ed-chapter-status '+status.toLowerCase()+'" aria-label="'+(status==='COMPLETED'?'완료':status==='CURRENT'?'진행 중':'잠금')+'">'+(status==='COMPLETED'?'✓':status==='CURRENT'?'›':icon('lock'))+'</span></button></article>'}
function experiencedConcepts(id){const visited=new Set([...(mainRun().visited||[]),...(run().visited||[])]),completed=new Set(meta().completedChapters),groups=new Map();for(const q of eraQuestions(id)){if(!visited.has(q.relatedSceneId)&&!completed.has(q.chapterId)&&!meta().questionRecords[q.questionId])continue;const title=learningConcepts(q)[0];if(!title||/^\d+$/.test(title))continue;if(!groups.has(title))groups.set(title,q)}return [...groups.entries()]}
function eraExamList(id){return '<div class="ed-exam-list">'+eraQuestions(id).filter(isVerifiedOfficialQuestion).map(q=>{const r=meta().questionRecords[q.questionId];return '<article class="ed-exam-row"><button data-practice="'+q.questionId+'"><img loading="lazy" src="'+esc(q.sourceQuestionImage)+'" alt="원본 문항 미리보기"><span><small>'+q.examRound+'회 '+q.examLevel+' · '+q.questionNumber+'번</small><b>'+esc(q.sourceQuestionText||q.question.split('\n')[0])+'</b><small class="'+(r?.lastCorrect?'last-correct':'')+'">'+(!r?'미풀이':r.lastCorrect?'최근 정답':'최근 오답')+'</small></span><span>›</span></button></article>'}).join('')+'</div>'}
eras=function(){const e=eraInfo(selectedEra),r=e.id===chapterEra(mainRun().currentChapter)?mainRun():meta().eraProgress?.[e.id]?.resume?.run,ch=CHAPTERS[r?.currentChapter],s=STORIES[r?.pending?.sourceSceneId||r?.storyId];return '<section class="era-detail-hero" style="--era-accent:'+e.accent+'">'+heroContent(e,true)+'<button class="era-back" data-nav="home" aria-label="홈으로 돌아가기">‹</button></section><div class="era-detail-body"><div class="era-total-progress"><b>전체 진행률</b><div class="progress"><span style="width:'+eraProgress(e.id)+'%"></span></div><strong>'+eraProgress(e.id)+'%</strong></div>'+(e.available?'<button class="era-resume" data-era-resume="'+e.id+'"><span class="resume-symbol">↻</span><span><b>'+(r?.started?'이어하기':'이야기 시작하기')+'</b><small>'+(ch?'CH.'+ch.number+' '+esc(ch.title)+' · '+esc(s?.title||'첫 장면'):'첫 이야기를 시작해요')+'</small></span><span>›</span></button>':'<div class="ed-empty"><b>'+e.name+' 이야기를 준비하고 있어요.</b><p>공개되면 시대별 진행 상황과 이어하기를 따로 저장합니다.</p></div>')+'<div class="ed-tabs" role="tablist" aria-label="시대 학습">'+[['chapters','챕터 목록'],['concepts','핵심 개념'],['exams','기출 모음']].map(([id,label])=>'<button role="tab" aria-selected="'+(eraTab===id)+'" data-era-tab="'+id+'">'+label+'</button>').join('')+'</div>'+(eraTab==='chapters'?(e.available?'<div class="ed-chapter-list">'+eraChapters(e.id).map(editorialChapterRow).join('')+'</div><button class="ed-link" data-action="restart-episode">고려 처음부터 다시하기</button>':'<p class="ed-empty">아직 공개된 챕터가 없습니다.</p>'):eraTab==='concepts'?(experiencedConcepts(e.id).length?experiencedConcepts(e.id).map(([title,q])=>'<button class="ed-concept-row" data-story-memory="'+q.questionId+'"><span><small>CH.'+CHAPTERS[q.chapterId].number+' · '+esc(STORIES[q.relatedSceneId]?.title)+'</small><b>'+esc(title)+'</b></span><span>›</span></button>').join(''):'<p class="ed-empty">이야기에서 경험한 개념이 이곳에 쌓입니다.</p>'):(e.available?eraExamList(e.id):'<p class="ed-empty">공개된 실제 기출이 없습니다.</p>'))+'</div>'};
function editorialEraRows(){return '<div class="ed-era-progress">'+LEARNING_ERAS.map(e=>'<button data-era-open="'+e.id+'"><img src="'+eraHero(e.id)+'" alt=""><b>'+e.name+'</b><div class="progress"><span style="width:'+eraProgress(e.id)+'%;background:'+e.accent+'"></span></div><small>'+eraProgress(e.id)+'%'+(!e.available?' · 준비중':'')+'</small></button>').join('')+'</div>'}
records=function(){const s=periodLearning(meta(),recordPeriod,recordEra),ready=learningReadiness(meta(),recordEra);return editorialHeader('나의 기록')+'<div class="ed-tabs record-era-tabs" aria-label="기록 시대">'+[{id:'all',name:'전체'},...LEARNING_ERAS].map(e=>'<button data-record-era="'+e.id+'" aria-pressed="'+(recordEra===e.id)+'">'+e.name+'</button>').join('')+'</div><section class="readiness"><h2>한능검 심화 예상 준비도 <button data-readiness-info="true" aria-label="예상 준비도 계산 기준">ⓘ</button></h2><div class="readiness-body"><div class="readiness-gauge" role="img" aria-label="예상 준비도 '+(ready.score===null?'학습 전':ready.score+'%')+'"><svg viewBox="0 0 160 90" aria-hidden="true"><path class="gauge-track" d="M15 78a65 65 0 0 1 130 0" pathLength="100"/><path class="gauge-value" d="M15 78a65 65 0 0 1 130 0" pathLength="100" stroke-dasharray="'+(ready.score||0)+' 100"/></svg><strong>'+percentText(ready.score)+'</strong></div><p>'+(ready.score===null?'실제 심화 기출을 풀면<br>나의 준비도가 쌓이기 시작해요.':ready.attempts<5?'아직은 학습 시작 단계예요.<br>기출을 더 풀며 확인해 보세요.':'기출과 이야기로 쌓아가는<br>나의 학습 준비도입니다.')+'</p></div><small>현재 제공되는 '+(recordEra==='all'?'고려':eraInfo(recordEra).name)+' 학습 기준 · 합격 확률이 아닙니다.</small></section><section class="ed-section">'+sectionHeading('학습 현황','<div class="period-tabs">'+[['today','오늘'],['7','7일'],['30','30일'],['all','전체']].map(([id,name])=>'<button data-record-period="'+id+'" aria-pressed="'+(recordPeriod===id)+'">'+name+'</button>').join('')+'</div>')+editorialMetrics(s)+'<p class="record-date-note">날짜별 집계는 날짜가 저장된 풀이만 포함합니다. 과거 누적 기록은 전체에서 유지됩니다.</p></section><section class="ed-section">'+sectionHeading('시대별 진행률')+editorialEraRows()+'</section>'+weakConcepts()+'<details class="ed-legacy-records"><summary>이야기와 수집 기록 보기</summary>'+recordsBeforeV2().replace(/<header[\s\S]*?<\/header>/,'')+'</details>'};
const studyBeforeEditorial=study,recordsBeforeEditorial=records;
function editorialWrongQuestions(){
 const recentBoundary=new Date();recentBoundary.setDate(recentBoundary.getDate()-6);recentBoundary.setHours(0,0,0,0);
 return [...new Set(meta().wrongQuestionIds)].map(id=>QUESTIONS.find(q=>q.questionId===id)).filter(q=>q&&(wrongEra==='all'||chapterEra(q.chapterId)===wrongEra)&&(wrongChapter==='all'||q.chapterId===wrongChapter)&&(wrongConcept==='all'||learningConcepts(q).includes(wrongConcept))&&(wrongFilter!=='official'||isVerifiedOfficialQuestion(q))&&(wrongFilter!=='repeated'||(meta().questionRecords[q.questionId]?.attempts||0)-(meta().questionRecords[q.questionId]?.correctCount||0)>1)&&(wrongFilter!=='recent'||new Date(v2WrongTime(q))>=recentBoundary)).sort((a,b)=>v2WrongTime(b).localeCompare(v2WrongTime(a)));
}
study=function(){
 if(studyTab!=='review')return studyBeforeEditorial();
 const visible=editorialWrongQuestions();
 return editorialHeader('오답노트','틀린 순간을 나의 지식으로')+'<div class="tabs v2-wrong-tabs">'+[['all','전체'],['recent','최근 7일'],['repeated','반복 오답'],['official','실제 기출']].map(([id,label])=>'<button data-wrong-filter="'+id+'" class="'+(wrongFilter===id?'selected':'')+'">'+label+'</button>').join('')+'</div><div class="v2-filters"><label>시대<select data-wrong-era><option value="all">전체 시대</option>'+LEARNING_ERAS.map(e=>'<option value="'+e.id+'" '+(wrongEra===e.id?'selected':'')+'>'+e.name+'</option>').join('')+'</select></label><label>챕터<select data-wrong-chapter><option value="all">전체 챕터</option>'+chapterOrder().filter(ch=>wrongEra==='all'||chapterEra(ch.chapterId)===wrongEra).map(ch=>'<option value="'+ch.chapterId+'" '+(wrongChapter===ch.chapterId?'selected':'')+'>CH.'+ch.number+' '+esc(ch.title)+'</option>').join('')+'</select></label><label>개념<select data-wrong-concept><option value="all">전체 개념</option>'+[...new Set(meta().wrongQuestionIds.map(id=>QUESTIONS.find(q=>q.questionId===id)).filter(Boolean).flatMap(learningConcepts))].map(name=>'<option '+(wrongConcept===name?'selected':'')+'>'+esc(name)+'</option>').join('')+'</select></label></div><section class="v2-section"><h2>최근 틀린 문제 · '+visible.length+'</h2>'+(visible.length?visible.map(v2QuestionRow).join(''):'<div class="ed-empty">선택한 조건에 맞는 오답이 없습니다.</div>')+'</section><button class="ed-link" data-study-jump="official">전체 실제 기출 보기 ›</button>';
};
document.addEventListener('change',e=>{if(e.target.matches('[data-wrong-era]')){wrongEra=e.target.value;wrongChapter='all';render()}});
function editorialWeakConcepts(){
 const filtered={...meta(),questionRecords:Object.fromEntries(Object.entries(meta().questionRecords).filter(([id])=>recordEra==='all'||chapterEra(QUESTIONS.find(q=>q.questionId===id)?.chapterId)===recordEra))},weak=learningSummary(filtered).weak;
 return '<section class="v2-section"><h2>자주 틀린 개념 TOP 5</h2>'+(!weak.length?'<p class="ed-empty">학습 기록이 쌓이면 약한 개념을 확인할 수 있어요.</p>':weak.map((c,i)=>'<button class="weak-row" data-editorial-weak="'+esc(c.name)+'"><span class="rank">'+(i+1)+'</span><b>'+esc(c.name)+'</b><small>'+c.wrong+'회 오답</small><span class="weak-meter"><i style="width:'+c.accuracy+'%"></i></span><em>'+c.accuracy+'%</em></button>').join(''))+'</section>';
}
function editorialCalendar(){const now=new Date(),first=new Date(now.getFullYear(),now.getMonth(),1),count=new Date(now.getFullYear(),now.getMonth()+1,0).getDate(),days=new Set((meta().learningEvents||[]).filter(e=>recordEra==='all'||chapterEra(QUESTIONS.find(q=>q.questionId===e.questionId)?.chapterId)===recordEra).map(e=>learningDay(e.answeredAt)));return '<details class="ed-legacy-records"><summary>학습 캘린더 · '+(now.getMonth()+1)+'월</summary><div class="v2-calendar">'+['일','월','화','수','목','금','토'].map(d=>'<small>'+d+'</small>').join('')+(first.getDay()?'<span style="grid-column:span '+first.getDay()+'"></span>':'')+Array.from({length:count},(_,i)=>'<span class="'+(days.has(learningDay(new Date(now.getFullYear(),now.getMonth(),i+1)))?'studied':'')+'">'+(i+1)+'</span>').join('')+'</div></details>'}
records=function(){return recordsBeforeEditorial().replace(weakConcepts(),editorialWeakConcepts()+editorialCalendar())};
const editorialQuizBase=quiz;
function quizDraft(){const q=activeQuestion(),d=meta().editorialAnswerDraft;return d&&d.questionId===q?.questionId&&d.mode===quizMode?d.answer:null}
function recallRow(q){const s=STORIES[q.relatedSceneId];return s?'<section class="ed-section quiz-recall"><h2>이 장면, 기억하시나요?</h2><button class="ed-activity" data-story-memory="'+q.questionId+'"><img src="'+esc(ASSETS[s.illustrationId]?.src||'')+'" alt="'+esc(s.title)+' 실제 스토리 장면"><span><small>CH.'+CHAPTERS[q.chapterId].number+' '+esc(CHAPTERS[q.chapterId].title)+'</small><b>'+esc(s.title)+'</b></span><span>›</span></button></section>':''}
quiz=function(){const q=activeQuestion();if(!q)return study();const r=run(),selected=quizMode==='story'?r.questionAnswer:reviewAnswer,done=selected!==null,draft=quizDraft(),original=isVerifiedOfficialQuestion(q),choices=quizChoices(q),queue=quizMode==='story'?r.questionQueue||[]:[],session=quizMode==='ch01-practice'?meta().ch01ReviewSession:null,total=queue.length||(session?(SPLIT_REVIEW_IDS[session.chapterId]||[]).length:1),index=queue.length?r.questionQueueIndex||0:session?.cursor||0,ch=CHAPTERS[q.chapterId];const old=editorialQuizBase(),feedback=done?old.slice(old.indexOf('<div class="feedback"'),old.lastIndexOf('</section>')):'';return '<section class="editorial-quiz"><header class="quiz-top"><button data-nav="era" aria-label="학습 화면으로 돌아가기">‹</button><span>CH.'+ch.number+' '+esc(ch.title)+'</span><button data-action="status" aria-label="내 상태 보기">'+editorialIcon('profile')+'</button></header><div class="quiz-progress"><div class="progress"><span style="width:'+Math.round((index+1)/total*100)+'%"></span></div><small>'+(index+1)+' / '+total+'</small></div><div class="exam-source-row"><span class="'+(original?'official-pill':'practice-pill')+'">'+(original?'실제 한능검 기출':'심화 연습 · 자체 제작')+'</span><span>'+(original?q.examRound+'회 '+q.examLevel+' · '+q.questionNumber+'번':'한능검 대비')+'</span><span class="sr-only">'+esc(questionSourceLabel(q))+'</span></div><h1 class="quiz-question-title">Q. '+esc(original?q.sourceQuestionText||q.question:q.question)+'</h1>'+officialQuestionFigure(q,questionSourceLabel(q))+(!original&&q.passage?'<div class="passage">'+esc(q.passage)+'</div>':'')+'<div class="ed-answer-options" role="group" aria-label="답 선택">'+choices.map((x,i)=>'<button class="choice '+(done&&i===q.answer?'correct':done&&i===selected?'wrong':!done&&draft===i?'picked':'')+'" data-pick-answer="'+i+'" aria-pressed="'+(!done&&draft===i)+'" '+(done?'disabled':'')+'><span class="answer-number">'+(i+1)+'</span><span>'+esc(x)+'</span>'+(done&&i===q.answer?'<b>✓</b>':'')+'</button>').join('')+'</div>'+(done?feedback:'<div class="quiz-submit-row"><button class="secondary" data-previous-question="true" '+(queue.length&&index>0?'':'disabled')+'>이전 문제</button><button class="confirm-answer" data-submit-answer="true" '+(draft===null?'disabled':'')+'>답 확인하기</button></div>')+recallRow(q)+'</section>'};
const modalBeforeEditorial=modalHTML;
modalHTML=function(){if(modal?.type==='readiness-info')return '<div class="modal-overlay"><section class="modal" role="dialog" aria-modal="true" aria-label="예상 준비도 계산 기준"><header><h2>예상 준비도 계산 기준</h2><button data-action="close">닫기</button></header><p>검증된 실제 심화 기출의 최근 30회 정답률 55% + 고유 기출 풀이 범위 25% + 완료 챕터 비율 20%로 계산합니다.</p><p>날짜 기록이 없는 이전 저장은 누적 기출 정답률을 사용합니다. 반복 오답은 정답률에 반영되고, 같은 기출을 여러 번 풀어도 학습 범위는 중복 증가하지 않습니다.</p><p>현재 제공되는 학습 범위 안의 참고 지표입니다. 실제 시험 전체의 합격 확률을 뜻하지 않습니다.</p></section></div>';if(modal?.type==='editorial-previous'){const q=QUESTIONS.find(q=>q.questionId===modal.questionId);return '<div class="modal-overlay"><section class="modal" role="dialog" aria-modal="true" aria-label="이전 문제 확인"><header><h2>이전 문제 확인</h2><button data-action="close">현재 문제로 돌아가기</button></header><p>'+esc(questionSourceLabel(q))+'</p>'+officialQuestionFigure(q,questionSourceLabel(q))+'<h3>'+esc(q.sourceQuestionText||q.question)+'</h3><p>정답 '+(q.answer+1)+' · '+esc(q.explanation)+'</p><p>제출한 기록은 유지됩니다.</p></section></div>'}return modalBeforeEditorial()};
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;const d=b.dataset;
 if(d.pickAnswer!==undefined){e.stopImmediatePropagation();const q=activeQuestion();if(!q||(quizMode==='story'?run().questionAnswer:reviewAnswer)!==null)return;meta().editorialAnswerDraft={questionId:q.questionId,mode:quizMode,answer:Number(d.pickAnswer)};save();render();return}
 if(d.submitAnswer){const answer=quizDraft();if(answer===null){e.stopImmediatePropagation();return}d.answer=String(answer);return}
 if(d.eraOpen){e.stopImmediatePropagation();selectedEra=eraInfo(d.eraOpen).id;meta().selectedLearningEra=selectedEra;eraTab='chapters';save();navigate('era');return}
 if(d.eraResume){e.stopImmediatePropagation();resumeEra(d.eraResume);return}
 if(d.eraTab){e.stopImmediatePropagation();eraTab=d.eraTab;render();return}
 if(d.editorialWeak){e.stopImmediatePropagation();wrongEra=recordEra;wrongChapter='all';wrongFilter='all';wrongConcept=d.editorialWeak;studyTab='review';navigate('study');return}
 if(d.recordEra){e.stopImmediatePropagation();recordEra=d.recordEra;render();return}
 if(d.recordPeriod){e.stopImmediatePropagation();recordPeriod=d.recordPeriod;render();return}
 if(d.readinessInfo){e.stopImmediatePropagation();modal={type:'readiness-info'};render();return}
 if(d.previousQuestion){e.stopImmediatePropagation();const r=run(),id=r.questionQueue?.[(r.questionQueueIndex||0)-1];if(id){modal={type:'editorial-previous',questionId:id};render()}return}
 if(d.eraDot!==undefined){e.stopImmediatePropagation();const track=document.querySelector('[data-era-carousel]'),slide=track?.querySelectorAll('[data-era-slide]')[Number(d.eraDot)];if(slide)track.scrollTo({left:slide.offsetLeft-track.offsetLeft,behavior:'smooth'});return}
 if(d.nav==='study')studyTab='review';
 if(d.practice||d.review){delete meta().editorialAnswerDraft;}
},true);
function bindEraCarousel(){const track=document.querySelector('[data-era-carousel]');if(!track)return;const slides=[...track.querySelectorAll('[data-era-slide]')],dots=[...document.querySelectorAll('[data-era-dot]')];const update=()=>{let closest=0,distance=Infinity;slides.forEach((s,i)=>{const d=Math.abs(s.offsetLeft-track.offsetLeft-track.scrollLeft);if(d<distance){distance=d;closest=i}});homeEraIndex=closest;dots.forEach((d,i)=>d.setAttribute('aria-current',String(i===closest)))};track.addEventListener('scroll',update,{passive:true});track.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const i=Math.max(0,Math.min(slides.length-1,homeEraIndex+(e.key==='ArrowRight'?1:-1)));track.scrollTo({left:slides[i].offsetLeft-track.offsetLeft,behavior:'smooth'})});if(slides[homeEraIndex])track.scrollLeft=slides[homeEraIndex].offsetLeft-track.offsetLeft;update()}
const renderBeforeEditorial=render;
render=function(){renderBeforeEditorial();bindEraCarousel()};
render();

/* Standalone exam library. Metadata references existing question IDs; it never rewrites story questions. */
const EXAM_LIBRARY_ENTRIES=[
 {
  "key": "75:기본:10",
  "canonicalQuestionId": "ch03-official-75-basic-10",
  "aliases": [
   "ch03-official-75-basic-10",
   "ch03-pdf-75-basic-10"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "69:기본:10",
  "canonicalQuestionId": "ch01-official-69-basic-10",
  "aliases": [
   "ch01-official-69-basic-10"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "79:심화:9",
  "canonicalQuestionId": "ch01-official-79-advanced-09",
  "aliases": [
   "ch01-official-79-advanced-09"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "70:심화:10",
  "canonicalQuestionId": "ch01-official-70-advanced-10",
  "aliases": [
   "ch01-official-70-advanced-10"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "73:기본:10",
  "canonicalQuestionId": "ch01-official-73-basic-10",
  "aliases": [
   "ch01-official-73-basic-10"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "74:심화:10",
  "canonicalQuestionId": "ch01-official-74-advanced-10",
  "aliases": [
   "ch01-official-74-advanced-10"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "76:심화:10",
  "canonicalQuestionId": "ch01-official-76-advanced-10",
  "aliases": [
   "ch01-official-76-advanced-10"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "69:심화:10",
  "canonicalQuestionId": "ch02-official-69-advanced-10",
  "aliases": [
   "ch02-official-69-advanced-10",
   "ch03-pdf-69-advanced-10"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "74:심화:11",
  "canonicalQuestionId": "ch02-official-74-advanced-11",
  "aliases": [
   "ch02-official-74-advanced-11"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "76:심화:50",
  "canonicalQuestionId": "ch02-official-76-advanced-50",
  "aliases": [
   "ch02-official-76-advanced-50"
  ],
  "primaryEra": "empire",
  "relatedEra": [
   "goryeo"
  ],
  "needsVerification": false,
  "verificationNote": "",
  "libraryImage": "assets/exams/library/76-advanced-50.webp",
  "sourcePage": 12
 },
 {
  "key": "77:심화:14",
  "canonicalQuestionId": "ch02-official-77-advanced-14",
  "aliases": [
   "ch02-official-77-advanced-14"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "78:심화:11",
  "canonicalQuestionId": "ch02-official-78-advanced-11",
  "aliases": [
   "ch02-official-78-advanced-11"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "75:기본:12",
  "canonicalQuestionId": "ch03-official-75-basic-12",
  "aliases": [
   "ch03-official-75-basic-12",
   "ch03-pdf-75-basic-12"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "65:심화:10",
  "canonicalQuestionId": "ch02-official-65-advanced-10",
  "aliases": [
   "ch03-pdf-65-advanced-10",
   "ch02-official-65-advanced-10"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "65:심화:11",
  "canonicalQuestionId": "ch04-official-65-advanced-11",
  "aliases": [
   "ch03-pdf-65-advanced-11",
   "ch04-official-65-advanced-11"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "68:심화:9",
  "canonicalQuestionId": "ch04-official-68-advanced-09",
  "aliases": [
   "ch03-pdf-68-advanced-09",
   "ch04-official-68-advanced-09"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "70:심화:13",
  "canonicalQuestionId": "ch06-official-70-advanced-13",
  "aliases": [
   "ch03-pdf-70-advanced-13",
   "ch06-official-70-advanced-13"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": true,
  "verificationNote": "기존 ID 간 정답 충돌: 숙종 문항을 현종 문항으로 연결한 데이터가 있어 목록에서 제외."
 },
 {
  "key": "72:심화:11",
  "canonicalQuestionId": "ch03-pdf-72-advanced-11",
  "aliases": [
   "ch03-pdf-72-advanced-11"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "73:심화:11",
  "canonicalQuestionId": "ch03-pdf-73-advanced-11",
  "aliases": [
   "ch03-pdf-73-advanced-11"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "76:심화:11",
  "canonicalQuestionId": "ch03-pdf-76-advanced-11",
  "aliases": [
   "ch03-pdf-76-advanced-11"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "76:심화:18",
  "canonicalQuestionId": "ch03-pdf-76-advanced-18",
  "aliases": [
   "ch03-pdf-76-advanced-18"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "79:심화:13",
  "canonicalQuestionId": "ch06-official-79-advanced-13",
  "aliases": [
   "ch03-pdf-79-advanced-13",
   "ch06-official-79-advanced-13"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "66:심화:9",
  "canonicalQuestionId": "ch02-official-66-advanced-09",
  "aliases": [
   "ch02-official-66-advanced-09"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "67:기본:10",
  "canonicalQuestionId": "ch02-official-67-basic-10",
  "aliases": [
   "ch02-official-67-basic-10"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "67:기본:11",
  "canonicalQuestionId": "ch02-official-67-basic-11",
  "aliases": [
   "ch02-official-67-basic-11"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "68:심화:11",
  "canonicalQuestionId": "ch03-official-68-advanced-11",
  "aliases": [
   "ch03-official-68-advanced-11"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "71:심화:11",
  "canonicalQuestionId": "ch03-official-71-advanced-11",
  "aliases": [
   "ch03-official-71-advanced-11"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "77:심화:11",
  "canonicalQuestionId": "ch06-official-77-advanced-11",
  "aliases": [
   "ch06-official-77-advanced-11"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "75:기본:17",
  "canonicalQuestionId": "ch07-official-75-basic-17",
  "aliases": [
   "ch07-official-75-basic-17"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "77:심화:17",
  "canonicalQuestionId": "ch08-official-77-advanced-17",
  "aliases": [
   "ch08-official-77-advanced-17"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "77:심화:16",
  "canonicalQuestionId": "ch09-official-77-advanced-16",
  "aliases": [
   "ch09-official-77-advanced-16"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "75:기본:16",
  "canonicalQuestionId": "ch10-official-75-basic-16",
  "aliases": [
   "ch10-official-75-basic-16"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "70:심화:15",
  "canonicalQuestionId": "ch10-official-70-advanced-15",
  "aliases": [
   "ch10-official-70-advanced-15"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "70:심화:16",
  "canonicalQuestionId": "ch11-official-70-advanced-16",
  "aliases": [
   "ch11-official-70-advanced-16"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "75:기본:14",
  "canonicalQuestionId": "ch12-official-75-basic-14",
  "aliases": [
   "ch12-official-75-basic-14"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "73:기본:11",
  "canonicalQuestionId": "ch05-official-73-basic-11",
  "aliases": [
   "ch05-official-73-basic-11"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "67:기본:13",
  "canonicalQuestionId": "ch05-official-67-basic-13",
  "aliases": [
   "ch05-official-67-basic-13"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "77:기본:12",
  "canonicalQuestionId": "ch05-official-77-basic-12",
  "aliases": [
   "ch05-official-77-basic-12"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "72:심화:12",
  "canonicalQuestionId": "ch05-official-72-advanced-12",
  "aliases": [
   "ch05-official-72-advanced-12",
   "ch06-official-72-advanced-12"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "63:심화:14",
  "canonicalQuestionId": "ch05-official-63-advanced-14",
  "aliases": [
   "ch05-official-63-advanced-14"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "64:심화:11",
  "canonicalQuestionId": "ch05-official-64-advanced-11",
  "aliases": [
   "ch05-official-64-advanced-11"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "74:심화:12",
  "canonicalQuestionId": "ch05-official-74-advanced-12",
  "aliases": [
   "ch05-official-74-advanced-12",
   "ch06-official-74-advanced-12"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "65:심화:12",
  "canonicalQuestionId": "ch06-official-65-advanced-12",
  "aliases": [
   "ch06-official-65-advanced-12"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "66:심화:11",
  "canonicalQuestionId": "ch06-official-66-advanced-11",
  "aliases": [
   "ch06-official-66-advanced-11"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "76:심화:14",
  "canonicalQuestionId": "ch06-official-76-advanced-14",
  "aliases": [
   "ch06-official-76-advanced-14"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "65:심화:14",
  "canonicalQuestionId": "ch08-official-65-advanced-14",
  "aliases": [
   "ch08-official-65-advanced-14"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "65:심화:15",
  "canonicalQuestionId": "ch11-official-65-advanced-15",
  "aliases": [
   "ch11-official-65-advanced-15"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "65:심화:16",
  "canonicalQuestionId": "ch09-official-65-advanced-16",
  "aliases": [
   "ch09-official-65-advanced-16"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "65:심화:17",
  "canonicalQuestionId": "ch10-official-65-advanced-17",
  "aliases": [
   "ch10-official-65-advanced-17"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "65:심화:18",
  "canonicalQuestionId": "ch12-official-65-advanced-18",
  "aliases": [
   "ch12-official-65-advanced-18"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "68:심화:15",
  "canonicalQuestionId": "ch10-official-68-advanced-15",
  "aliases": [
   "ch10-official-68-advanced-15"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "68:심화:16",
  "canonicalQuestionId": "ch11-official-68-advanced-16",
  "aliases": [
   "ch11-official-68-advanced-16"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "68:심화:17",
  "canonicalQuestionId": "ch12-official-68-advanced-17",
  "aliases": [
   "ch12-official-68-advanced-17"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "72:심화:14",
  "canonicalQuestionId": "ch10-official-72-advanced-14",
  "aliases": [
   "ch10-official-72-advanced-14"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "72:심화:15",
  "canonicalQuestionId": "ch11-official-72-advanced-15",
  "aliases": [
   "ch11-official-72-advanced-15"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "72:심화:16",
  "canonicalQuestionId": "ch09-official-72-advanced-16",
  "aliases": [
   "ch09-official-72-advanced-16"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "72:심화:17",
  "canonicalQuestionId": "ch11-official-72-advanced-17",
  "aliases": [
   "ch11-official-72-advanced-17"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "74:심화:13",
  "canonicalQuestionId": "ch10-official-74-advanced-13",
  "aliases": [
   "ch10-official-74-advanced-13"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "74:심화:14",
  "canonicalQuestionId": "ch10-official-74-advanced-14",
  "aliases": [
   "ch10-official-74-advanced-14"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "74:심화:16",
  "canonicalQuestionId": "ch09-official-74-advanced-16",
  "aliases": [
   "ch09-official-74-advanced-16"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "74:심화:17",
  "canonicalQuestionId": "ch11-official-74-advanced-17",
  "aliases": [
   "ch11-official-74-advanced-17"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "66:심화:13",
  "canonicalQuestionId": "ch10-official-66-advanced-13",
  "aliases": [
   "ch10-official-66-advanced-13"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "66:심화:14",
  "canonicalQuestionId": "ch09-official-66-advanced-14",
  "aliases": [
   "ch09-official-66-advanced-14"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "66:심화:15",
  "canonicalQuestionId": "ch11-official-66-advanced-15",
  "aliases": [
   "ch11-official-66-advanced-15"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "69:심화:13",
  "canonicalQuestionId": "ch07-official-69-advanced-13",
  "aliases": [
   "ch07-official-69-advanced-13"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "69:심화:14",
  "canonicalQuestionId": "ch09-official-69-advanced-14",
  "aliases": [
   "ch09-official-69-advanced-14"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "69:심화:15",
  "canonicalQuestionId": "ch11-official-69-advanced-15",
  "aliases": [
   "ch11-official-69-advanced-15"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "69:심화:17",
  "canonicalQuestionId": "ch10-official-69-advanced-17",
  "aliases": [
   "ch10-official-69-advanced-17"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "70:심화:14",
  "canonicalQuestionId": "ch09-official-70-advanced-14",
  "aliases": [
   "ch09-official-70-advanced-14"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "71:심화:14",
  "canonicalQuestionId": "ch09-official-71-advanced-14",
  "aliases": [
   "ch09-official-71-advanced-14"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "71:심화:15",
  "canonicalQuestionId": "ch10-official-71-advanced-15",
  "aliases": [
   "ch10-official-71-advanced-15"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "71:심화:16",
  "canonicalQuestionId": "ch10-official-71-advanced-16",
  "aliases": [
   "ch10-official-71-advanced-16"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "69:기본:11",
  "canonicalQuestionId": "ch07-official-69-basic-11",
  "aliases": [
   "ch07-official-69-basic-11"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "69:기본:12",
  "canonicalQuestionId": "ch09-official-69-basic-12",
  "aliases": [
   "ch09-official-69-basic-12"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 },
 {
  "key": "73:기본:13",
  "canonicalQuestionId": "ch08-official-73-basic-13",
  "aliases": [
   "ch08-official-73-basic-13"
  ],
  "primaryEra": "goryeo",
  "relatedEra": [],
  "needsVerification": false,
  "verificationNote": ""
 }
];
var librarySession=null;
let libraryEra='goryeo',libraryLevel='all';
const saveBeforeLibrary=save;
save=function(){if(librarySession&&screen==='quiz'){if(reviewAnswer!==null)delete meta().editorialAnswerDraft;saveBeforeEditorial()}else saveBeforeLibrary()};
function libraryQuestion(entry){return QUESTIONS.find(q=>q.questionId===entry.canonicalQuestionId)}
function libraryImage(entry){return entry.libraryImage||libraryQuestion(entry)?.sourceQuestionImage}
function libraryEligible(entry){const q=libraryQuestion(entry);return !entry.needsVerification&&q?.isOfficial===true&&q.sourceVerified===true&&q.examRound&&q.examYear&&q.examLevel&&q.questionNumber&&q.sourceFile&&q.answerFile&&libraryImage(entry)}
function libraryEntries(era){return EXAM_LIBRARY_ENTRIES.filter(e=>e.primaryEra===era&&libraryEligible(e))}
function libraryStatus(era){const chapters=eraChapters(era);if(!eraInfo(era).available||!chapters.length||chapters.some(ch=>!ch.implemented))return 'COMING_SOON';return chapters.every(ch=>meta().completedChapters.includes(ch.chapterId))?'UNLOCKED':'LOCKED'}
function libraryResult(entry){
 const records=entry.aliases.map(id=>({id,record:meta().questionRecords[id]})).filter(x=>x.record?.attempts);
 if(!records.length)return null;
 const events=(meta().learningEvents||[]).filter(e=>entry.aliases.includes(e.questionId)&&e.answeredAt).sort((a,b)=>a.answeredAt.localeCompare(b.answeredAt));
 const last=events[events.length-1];
 // Legacy saves have no answer timestamp: retain their known last result without inventing chronology.
 return last?{correct:last.correct,recent:true}:{correct:(records.find(x=>x.id===entry.canonicalQuestionId)||records[records.length-1]).record.lastCorrect,recent:false};
}
function librarySummary(era){const entries=libraryEntries(era),results=entries.map(libraryResult).filter(Boolean);return {total:entries.length,attempted:results.length,correct:results.filter(r=>r.correct).length,wrong:results.filter(r=>!r.correct).length}}
function examLibraryHome(){return '<section class="exam-library"><h1>기출문제</h1><p class="library-subtitle">시대를 선택해 실제 한능검 기출을 풀어보세요.</p>'+LEARNING_ERAS.map(e=>{const status=libraryStatus(e.id);return '<button class="library-era" data-library-era="'+e.id+'" data-state="'+status+'"><div><h2>'+e.name+'</h2><p>'+e.years+'</p><small>'+(status==='UNLOCKED'?'실제 한능검 기출 '+libraryEntries(e.id).length+'문제':status==='LOCKED'?'🔒 '+e.name+'편 전체 챕터 완료 후 열림':'준비 중 · '+e.name+'편 이야기 공개 후 열림')+'</small></div><span aria-hidden="true">›</span></button>'}).join('')+'</section>'}
function examLibraryList(){if(libraryStatus(libraryEra)!=='UNLOCKED')return examLibraryHome();const era=eraInfo(libraryEra),s=librarySummary(libraryEra),entries=libraryEntries(libraryEra).filter(e=>libraryLevel==='all'||libraryQuestion(e).examLevel===libraryLevel);return '<section class="exam-library"><header class="library-top"><button data-library-back="home" aria-label="시대 선택으로 돌아가기">‹</button><div><h1>'+era.name+' 기출문제</h1><p>'+era.years+'</p></div></header><div class="library-summary">'+[['전체 문제',s.total,''],['푼 문제',s.attempted,''],['정답',s.correct,'right'],['오답',s.wrong,'wrong']].map(([label,value,style])=>'<div class="'+style+'"><small>'+label+'</small><b>'+value+'</b></div>').join('')+'</div><div class="library-filters">'+[['all','전체'],['심화','심화'],['기본','기본']].map(([id,label])=>'<button data-library-level="'+id+'" aria-pressed="'+(libraryLevel===id)+'">'+label+'</button>').join('')+'</div>'+entries.map(entry=>{const q=libraryQuestion(entry),r=libraryResult(entry);return '<button class="library-question" data-library-question="'+q.questionId+'"><img loading="lazy" src="'+esc(libraryImage(entry))+'" alt="'+q.examRound+'회 '+q.examLevel+' '+q.questionNumber+'번 원본 문제"><span><small>'+q.examRound+'회 '+q.examLevel+' · '+q.questionNumber+'번</small><b>'+esc(q.sourceQuestionText||q.question)+'</b><em class="'+(r?r.correct?'right':'wrong':'')+'">'+(r?(r.recent?'최근 ':'')+(r.correct?'정답':'오답'):'미풀이')+'</em></span><span aria-hidden="true">›</span></button>'}).join('')+(!entries.length?'<p class="ed-empty">아직 등록된 기출문제가 없어요.</p>':'')+'</section>'}
const renderContentBeforeLibrary=renderContent;
renderContent=function(){if(screen==='exam-library')return examLibraryHome();if(screen==='exam-era')return examLibraryList();return renderContentBeforeLibrary()};
const quizBeforeLibrary=quiz;
quiz=function(){let html=quizBeforeLibrary();if(!librarySession)return html;html=html.replace('오답노트로 돌아가기','기출문제 목록으로 돌아가기').replace(/정답 · 지식 \+\d+/g,'정답 · 풀이 기록에 반영했습니다.').replace('오답노트 +1 · 이야기는 계속됩니다.','오답노트에 기록했습니다.');if(reviewAnswer!==null)html=html.replace('<div class="feedback"','<p class="library-selected-answer">선택한 답: '+(reviewAnswer+1)+'번</p><div class="feedback"');return html.replace('class="editorial-quiz"','class="editorial-quiz library-quiz"').replace(/<header class="quiz-top">[\s\S]*?<\/header>/,'<header class="quiz-top"><button data-library-back="list" aria-label="기출문제 목록으로 돌아가기">‹</button><span>기출문제 풀기</span></header>')};
const figureBeforeLibrary=officialQuestionFigure;
officialQuestionFigure=function(q,label){const html=figureBeforeLibrary(q,label),entry=librarySession&&EXAM_LIBRARY_ENTRIES.find(e=>e.canonicalQuestionId===q.questionId);return entry?.libraryImage?html.split(q.sourceQuestionImage).join(entry.libraryImage):html};
const modalBeforeLibrary=modalHTML;
modalHTML=function(){if(modal?.type==='library-lock'){const era=eraInfo(modal.era),status=libraryStatus(era.id);return '<div class="modal-overlay"><section class="modal" role="dialog" aria-modal="true" aria-label="기출문제 이용 안내"><header><h2>'+era.name+' 기출문제</h2><button data-action="close">닫기</button></header><p>'+(status==='COMING_SOON'?'이 시대의 이야기를 준비하고 있습니다. 이야기 공개 후 전체 챕터를 완료하면 기출문제가 열립니다.':era.name+'편의 모든 챕터를 완료하면 실제 기출을 자유롭게 풀 수 있습니다.')+'</p>'+(status==='LOCKED'?'<button class="primary" data-era-resume="'+era.id+'">'+era.name+'편 이어하기</button>':'')+'</section></div>'}const html=modalBeforeLibrary(),entry=librarySession&&EXAM_LIBRARY_ENTRIES.find(e=>e.canonicalQuestionId===reviewQuestionId);return entry?.libraryImage?html.split(libraryQuestion(entry).sourceQuestionImage).join(entry.libraryImage):html};
function submitLibraryAnswer(answer){
 const q=activeQuestion();if(!q||reviewAnswer!==null||libraryStatus(libraryEra)!=='UNLOCKED'||!Number.isInteger(answer)||answer<0||answer>=quizChoices(q).length)return;
 const savedRun=JSON.parse(JSON.stringify(state.run)),savedMain=state.mainRun?JSON.parse(JSON.stringify(state.mainRun)):state.mainRun;
 try{recordQuestion(state,q.questionId,answer)}finally{state.run=savedRun;state.mainRun=savedMain}
 reviewAnswer=answer;save();render();
}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;const d=b.dataset;
 if(d.libraryEra){e.stopImmediatePropagation();librarySession=null;libraryEra=eraInfo(d.libraryEra).id;libraryLevel='all';if(libraryStatus(libraryEra)==='UNLOCKED')navigate('exam-era');else{modal={type:'library-lock',era:libraryEra};render()}return}
 if(d.libraryLevel){e.stopImmediatePropagation();libraryLevel=d.libraryLevel;render();return}
 if(d.libraryQuestion){e.stopImmediatePropagation();const entry=EXAM_LIBRARY_ENTRIES.find(x=>x.canonicalQuestionId===d.libraryQuestion);if(!entry||!libraryEligible(entry)||entry.primaryEra!==libraryEra||libraryStatus(libraryEra)!=='UNLOCKED')return;librarySession={era:libraryEra};reviewQuestionId=entry.canonicalQuestionId;reviewAnswer=null;quizMode='review';delete meta().editorialAnswerDraft;navigate('quiz');return}
 if(d.libraryBack||(librarySession&&d.action==='quiz-next')){e.stopImmediatePropagation();librarySession=null;delete meta().editorialAnswerDraft;navigate(d.libraryBack==='home'?'exam-library':'exam-era');return}
 if(librarySession&&d.answer!==undefined){e.stopImmediatePropagation();submitLibraryAnswer(Number(d.answer));return}
 if(d.nav||d.review||d.practice){librarySession=null;}
},true);
render();
