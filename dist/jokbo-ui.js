/* 족보: 시험 직전 세로 요약, 상세·비교·저장·검증 기출 연결. */
(function(){
 'use strict';
 if(!globalThis.JOKBO_DATA||!globalThis.REV7_OX_VIEWS||!globalThis.REV7_EXAM_VIEWS)return;
 const D=globalThis.JOKBO_DATA,routes=globalThis.REV7_OX_VIEWS,exams=globalThis.REV7_EXAM_VIEWS;
 const SAVE_KEY='history-jokbo:saved:v1',VIEW_KEY='history-jokbo:view:v1';
 const icon=(name)=>'<span class="jk-icon" aria-hidden="true"><img src="media/rev7/'+name+'.svg" alt=""></span>';
 const treeIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M12 7H7v4M12 10h5v4M7 11H4v4M7 11h3M17 14h-3M17 14h3v4"/><circle cx="12" cy="4" r="1.5"/><circle cx="4" cy="16" r="1.5"/><circle cx="10" cy="12" r="1.5"/><circle cx="14" cy="15" r="1.5"/><circle cx="20" cy="19" r="1.5"/></svg>';
 const memoryStore={data:new Map(),getItem(key){return this.data.get(key)||null},setItem(key,value){this.data.set(key,String(value))}};
 const localStore=typeof localStorage==='undefined'?memoryStore:localStorage,sessionStore=typeof sessionStorage==='undefined'?memoryStore:sessionStorage;
 const readJSON=(storage,key,fallback)=>{try{return JSON.parse(storage.getItem(key))??fallback}catch{return fallback}};
 const storedSaved=readJSON(localStore,SAVE_KEY,[]),saved=new Set(Array.isArray(storedSaved)?storedSaved:[]);
 const initial=readJSON(sessionStore,VIEW_KEY,{});
 let activeEra=D.eras.some(e=>e.id===initial.activeEra)?initial.activeEra:'proto';
 let mode=initial.mode==='saved'?'saved':'all',query=String(initial.query||''),searchOpen=Boolean(initial.searchOpen||query),detailId=null,compareId=null,compareTopic=0;
 const norm=value=>String(value||'').toLocaleLowerCase('ko-KR').replace(/\s+/g,'');
 const eraSource={prehistoric:'ancient',proto:'ancient',three:'ancient','north-south':'ancient',goryeo:'goryeo',joseon:'joseon',opening:'empire',colonial:'occupation',modern:'republic'};
 const sourceById=new Map((globalThis.OFFICIAL_EXAM_SOURCE_RECORDS||[]).map(row=>[row.officialQuestionId,row]));
 const explanationById=new Map((globalThis.OFFICIAL_EXAM_EXPLANATION_RECORDS||[]).map(row=>[row.officialQuestionId,row]));
 const keywordById=new Map(D.keywords.map(k=>[k.id,k]));
 const comparisonById=new Map(D.comparisons.map(c=>[c.id,c]));
 const eraById=new Map(D.eras.map(e=>[e.id,e]));

 function saveView(extra={}){
  const payload={activeEra,mode,query,searchOpen,scrollY:screen==='jokbo'?window.scrollY:Number(initial.scrollY||0),...extra};
  try{sessionStore.setItem(VIEW_KEY,JSON.stringify(payload))}catch{}
 }
 function saveKeywords(){try{localStore.setItem(SAVE_KEY,JSON.stringify([...saved]))}catch{toast('저장 공간을 사용할 수 없어요.')}}
 function fullText(k){
  const summary=(k.summaryRows||[]).flatMap(row=>[row.label,row.value]);
  return norm([k.value,k.definition,...k.bullets,k.groupTitle,eraById.get(k.eraId)?.label,k.label,...summary].join(' '));
 }
 function searchMatches(k){return !query||fullText(k).includes(norm(query));}
 function directExamMatches(keyword){
  if(keyword.examIds?.length)return keyword.examIds;
  const terms=(keyword.examTerms||[]).map(norm).filter(Boolean),primaryEra=eraSource[keyword.eraId];
  const rows=[];
  for(const [id,record] of explanationById){
   const source=sourceById.get(id);if(!source||source.primaryEra!==primaryEra)continue;
   const direct=norm([record.question,record.clue,record.correctChoice,record.explanation].join(' '));
   const hit=terms.reduce((score,term)=>score+(direct.includes(term)?1:0),0);if(!hit)continue;
   const specificity=Math.max(...terms.filter(term=>direct.includes(term)).map(term=>term.length),0);
   rows.push({id,score:hit*20+specificity+(record.curated?5:0),round:Number(source.examRound)||0,number:Number(source.questionNumber)||0});
  }
  keyword.examIds=rows.sort((a,b)=>b.score-a.score||b.round-a.round||a.number-b.number).slice(0,4).map(row=>row.id);
  return keyword.examIds;
 }
 function eraExamIds(eraId){
  const ids=[];for(const keyword of D.keywords.filter(k=>k.eraId===eraId))for(const id of directExamMatches(keyword))if(!ids.includes(id))ids.push(id);
  return ids;
 }
 function examLabel(id){const s=sourceById.get(id),e=explanationById.get(id);return s&&e?{meta:'제 '+s.examRound+'회 '+s.examLevel+' · '+s.questionNumber+'번',title:e.question||e.clue||'실제 기출문제'}:null;}
 function startExamIds(ids,eraId){
  const entries=ids.map(id=>exams.entry(id)).filter(Boolean);if(!entries.length)return toast('연결된 기출을 준비하고 있어요.');
  saveView({scrollY:window.scrollY,returnFromExam:true});
  exams.start(entries,'learn',{examTab:'era',examEra:eraSource[eraId]||'ancient',examLevel:'all',scope:'jokbo'});
  routes.writeRoute('exam-library');
 }
 function appbar(title,back='jokbo'){return '<header class="jk-appbar"><button data-jk-back="'+back+'" aria-label="뒤로 가기">'+icon('back')+'</button><h1>'+esc(title)+'</h1><span></span></header>';}
 function searchButton(){return '<button class="jk-search-button" data-jk-search aria-label="족보 검색" aria-expanded="'+searchOpen+'">'+icon(searchOpen?'close':'search')+'</button>';}
 function searchBox(){return !searchOpen?'':'<div class="jk-search"><span>'+icon('search')+'</span><input data-jk-query type="search" value="'+esc(query)+'" placeholder="키워드·국가·왕·인물·대표 단서 검색" aria-label="족보 검색어"><button data-jk-search-clear aria-label="검색어 지우기">'+(query?'×':'')+'</button></div>';}
 function eraTabs(){return '<div class="jk-era-tabs" role="tablist" aria-label="시대 선택">'+D.eras.map(e=>'<button role="tab" data-jk-era="'+e.id+'" aria-selected="'+(activeEra===e.id)+'">'+esc(e.label)+'</button>').join('')+'</div>';}
 function revealActiveEraTab(){
  const reveal=()=>{const tabs=document.querySelector('.jk-era-tabs'),selected=tabs?.querySelector('[data-jk-era][aria-selected="true"]');if(!tabs||!selected)return;const target=selected.offsetLeft-(tabs.clientWidth-selected.offsetWidth)/2,max=Math.max(0,tabs.scrollWidth-tabs.clientWidth);tabs.scrollLeft=Math.max(0,Math.min(max,target));};
  if(typeof requestAnimationFrame==='function')requestAnimationFrame(reveal);else setTimeout(reveal,0);
 }
 function semanticValue(value){
  const tokens=String(value||'').split(/\s+(·|→)\s+/),parts=[];
  for(let i=0;i<tokens.length;i+=2){
   const phrase=tokens[i].trim(),separator=tokens[i+1]||'';
   if(phrase)parts.push('<span class="jk-keyword-phrase" data-jk-phrase aria-hidden="true">'+esc(phrase)+(separator?'<span class="jk-keyword-separator"> '+esc(separator)+'</span>':'')+'</span>');
  }
  return parts.join('');
 }
 function keywordRows(group,items){return items.map(k=>{
  const rows=k.summaryRows?.length?k.summaryRows:[{label:k.label,value:k.value}];
  return '<button class="jk-keyword'+(rows.length>1?' is-split':'')+'" data-jk-detail="'+k.id+'" aria-label="'+esc(rows.map(row=>row.label+' '+row.value).join(', '))+'">'+rows.map((row,index)=>'<span class="jk-keyword-line" data-jk-fact-row data-jk-fact-index="'+index+'"><span class="jk-keyword-badge" data-jk-fact-name>'+esc(row.label)+'</span><strong class="jk-keyword-value" data-jk-fact-value aria-label="'+esc(row.value)+'">'+semanticValue(row.value)+'</strong></span>').join('')+'</button>';
 }).join('');}
 function groupMarkup(group,items,index,searching){
  const number=String(index+1).padStart(2,'0'),title=group.title.replace(/^\d+\s*/,''),era=eraById.get(group.eraId);
  return '<article class="jk-group"><header><div class="jk-group-title"><span class="jk-group-number">'+number+'</span><h3>'+esc(title)+'</h3>'+(searching?'<span class="jk-group-era">'+esc(era.label)+'</span>':'')+'</div><button class="jk-group-detail" data-jk-group="'+group.id+'"><span>자세히 보기</span><span class="jk-group-arrow" aria-hidden="true">→</span></button></header>'+(group.subtitle?'<p class="jk-group-subtitle">'+esc(group.subtitle)+'</p>':'')+'<div class="jk-keywords">'+keywordRows(group,items)+'</div></article>';
 }
 function emptyMarkup(){
  if(mode==='saved'&&!saved.size)return '<div class="jk-empty"><span>'+treeIcon+'</span><h2>저장한 키워드가 없어요</h2><p>상세 화면에서 필요한 키워드를 저장하면<br>시험 직전 목록으로 모아 드려요.</p><button data-jk-mode="all">전체 요약 보기</button></div>';
  return '<div class="jk-empty"><span>'+icon('search')+'</span><h2>검색 결과가 없어요</h2><p>띄어쓰기를 바꾸거나 더 짧은 단어로 검색해 보세요.</p><button data-jk-search-clear>검색어 지우기</button></div>';
 }
 function compareLinks(eraId){
  const rows=D.comparisons.filter(c=>c.eraIds.includes(eraId));if(!rows.length)return '';
  return '<section class="jk-links"><h2>헷갈리는 개념 비교</h2>'+rows.map(c=>'<button data-jk-compare="'+c.id+'"><span><b>'+esc(c.title)+'</b><small>차이를 한눈에 비교해요</small></span><i>›</i></button>').join('')+'</section>';
 }
 function savedList(){
  const items=D.keywords.filter(k=>saved.has(k.id)&&searchMatches(k));
  if(!items.length)return emptyMarkup();
  return '<div class="jk-saved-list">'+items.map(k=>'<article><button data-jk-detail="'+k.id+'"><span class="jk-tags"><em>'+esc(eraById.get(k.eraId).label)+'</em><em>'+esc(k.groupTitle.replace(/^\d+\s*/,''))+'</em><em>'+esc(k.label)+'</em></span><b>'+esc(k.value)+'</b><p>'+esc(k.definition)+'</p></button><button class="jk-unsave" data-jk-save="'+k.id+'" aria-label="'+esc(k.value)+' 저장 해제">'+icon('bookmark-filled')+'</button></article>').join('')+'</div>';
 }
 function mainPage(){
  const searching=Boolean(query.trim()),era=eraById.get(activeEra);
  const pool=searching?D.groups:D.groups.filter(g=>g.eraId===activeEra),rows=[];
  for(const group of pool){const items=group.keywords.filter(k=>searchMatches({...k,groupTitle:group.title,eraId:group.eraId}));if(items.length)rows.push({group,items});}
  const related=eraExamIds(activeEra);
  return '<section class="jk-page jk-main" data-page="jokbo"><header class="jk-heading"><div><h1>족보</h1><p>시험 전에 필요한 것만</p></div>'+searchButton()+'</header>'+searchBox()+eraTabs()
   +'<div class="jk-segment" role="tablist" aria-label="족보 보기"><button role="tab" data-jk-mode="all" aria-selected="'+(mode==='all')+'">전체 요약</button><button role="tab" data-jk-mode="saved" aria-selected="'+(mode==='saved')+'">저장한 키워드 <span>'+saved.size+'</span></button></div>'
   +(mode==='saved'?'<section class="jk-summary-head"><h2>시험 직전, 이것만</h2><p>저장한 핵심 개념을 시대와 주제까지 함께 확인해요.</p></section>'+savedList():'<section class="jk-summary-head">'+(searching?'<small class="jk-summary-kicker">검색 결과</small>':'')+'<h2>'+esc(searching?'“'+query+'” 검색 결과':era.title)+'</h2><p>'+esc(searching?'전 시대의 국가·왕·인물·단서를 찾았어요.':era.subtitle)+'</p></section><div class="jk-groups">'+(rows.length?rows.map((row,i)=>groupMarkup(row.group,row.items,i,searching)).join(''):emptyMarkup())+'</div>'+(searching?'':compareLinks(activeEra))
   +(searching?'':'<section class="jk-exam-cta"><div><small>RELATED QUESTIONS</small><h2>이 시대 관련 기출 풀기</h2><p>'+related.length+'개의 검증된 실제 기출이 핵심 키워드와 연결되어 있어요.</p></div><button data-jk-era-exams="'+activeEra+'" '+(related.length?'':'disabled')+'>'+(related.length?'기출 '+Math.min(20,related.length)+'문제 풀기':'연결된 기출을 준비하고 있어요')+'</button></section>'))+'</section>';
 }
 function detailPage(){
  const k=keywordById.get(detailId);if(!k)return mainPage();const era=eraById.get(k.eraId),ids=directExamMatches(k),comparison=comparisonById.get(k.comparisonId);
  return '<section class="jk-page jk-detail" data-page="jokbo-detail">'+appbar('개념 상세')+'<header class="jk-detail-head"><div class="jk-detail-context jk-tags"><em>'+esc(era.label)+'</em><em>'+esc(k.groupTitle.replace(/^\d+\s*/,''))+'</em><em>'+esc(k.label)+'</em></div><h2 class="jk-detail-title">'+esc(k.value)+'</h2><p class="jk-detail-description">'+esc(k.definition)+'</p><button class="jk-save '+(saved.has(k.id)?'is-saved':'')+'" data-jk-save="'+k.id+'">'+icon(saved.has(k.id)?'bookmark-filled':'bookmark')+' '+(saved.has(k.id)?'저장됨':'키워드 저장')+'</button></header>'
   +'<section class="jk-detail-section"><h2>핵심 학습 내용</h2><ol>'+k.bullets.map((b,i)=>'<li><span>'+String(i+1).padStart(2,'0')+'</span><p>'+esc(b)+'</p></li>').join('')+'</ol></section>'
   +'<section class="jk-clue"><small>대표 단서</small><p>'+esc((k.examTerms||[]).join(' · ')||k.value)+'</p></section>'
   +(comparison?'<section class="jk-detail-section"><h2>함께 구분할 개념</h2><button class="jk-compare-link" data-jk-compare="'+comparison.id+'"><span><b>'+esc(comparison.title)+'</b><small>비슷한 개념의 차이를 나란히 확인해요.</small></span><i>›</i></button></section>':'')
   +(k.source?'<p class="jk-source">사실 확인: <a href="'+esc(k.source.url)+'" target="_blank" rel="noreferrer">'+esc(k.source.label)+' ↗</a></p>':'')
   +'<section class="jk-detail-section jk-related"><div><h2>관련 실제 기출</h2><small>키워드를 직접 묻는 문제 우선 · 중복 제외</small></div>'+(ids.length?ids.map(id=>{const row=examLabel(id);return row?'<article><span><small>'+esc(row.meta)+'</small><b>'+esc(row.title)+'</b></span></article>':'';}).join(''):'<div class="jk-empty-inline">연결된 기출을 준비하고 있어요</div>')+'<button class="jk-primary" data-jk-keyword-exams="'+k.id+'" '+(ids.length?'':'disabled')+'>'+(ids.length?'관련 기출 '+ids.length+'문제 풀기':'연결된 기출을 준비하고 있어요')+'</button></section></section>';
 }
 function comparePage(){
  const c=comparisonById.get(compareId);if(!c)return mainPage();const topic=c.topics[Math.max(0,Math.min(compareTopic,c.topics.length-1))];
  return '<section class="jk-page jk-compare" data-page="jokbo-compare">'+appbar('개념 비교')+(c.topics.length>1?'<div class="jk-compare-tabs" role="tablist" aria-label="비교 주제">'+c.topics.map((t,i)=>'<button role="tab" data-jk-compare-topic="'+i+'" aria-selected="'+(i===compareTopic)+'">'+esc(t.label)+'</button>').join('')+'</div>':'')+'<header class="jk-compare-head"><h2>'+esc(c.title)+'</h2><p>시험에서 구분되는 단서만 짧게 비교해요.</p></header><div class="jk-compare-list">'+topic.entries.map(row=>'<article class="jk-compare-entry"><div><small class="jk-compare-heading">'+esc(row.heading)+'</small><h3 class="jk-compare-keyword">'+esc(row.keyword)+'</h3><p class="jk-compare-description">'+esc(row.description)+'</p></div></article>').join('')+'</div><section class="jk-test-point"><small class="jk-test-point-label">시험 포인트</small><p class="jk-test-point-text">'+esc(topic.point)+'</p></section></section>';
 }

 // Final navigation shell: retain every existing destination and add 족보 as an independent sixth menu.
 const shellBefore=shell;
 shell=function(content){
  const current=screen.startsWith('jokbo')?'jokbo':screen==='ox'?'ox':screen.startsWith('exam-')?'exam-library':['era','seasons','chapter-scenes','game','quiz','complete','teaser','history'].includes(screen)?'home':screen;
  const nav=[['home','홈',editorialIcon('home')],['exam-library','기출문제',editorialIcon('book')],['ox','OX',globalThis.OX_ICON||'<b>OX</b>'],['study','오답노트',editorialIcon('note')],['jokbo','족보',treeIcon],['records','내 기록',editorialIcon('records')]];
  return '<div class="shell editorial-shell six-nav"><aside class="sidebar"><div class="brand">눈떠보니 한국사<small>역사를 살고, 기출로 기억하다</small></div><nav class="nav" aria-label="주 메뉴">'+nav.map(([id,label,image])=>'<button data-nav="'+id+'" '+(current===id?'aria-current="page"':'')+' class="'+(current===id?'active':'')+'">'+image+'<span>'+label+'</span></button>').join('')+'</nav></aside><main class="main ed-screen ed-'+screen+'">'+content+'</main></div>'+(modal?modalHTML():'');
 };
 const contentBefore=renderContent;
 renderContent=function(){if(screen==='jokbo')return mainPage();if(screen==='jokbo-detail')return detailPage();if(screen==='jokbo-compare')return comparePage();return contentBefore();};
 routes.addRoute('jokbo');
 for(const k of D.keywords)routes.addRoute('jokbo/detail/'+k.id);
 for(const c of D.comparisons)routes.addRoute('jokbo/compare/'+c.id);
 const applyBefore=routes.applyRoute;
 routes.setApplyRoute(function(route=routes.readRoute()){
  if(route==='jokbo'){screen='jokbo';detailId=null;compareId=null;modal=null;render();revealActiveEraTab();setTimeout(()=>window.scrollTo(0,Number(readJSON(sessionStore,VIEW_KEY,{}).scrollY)||0),0);return route;}
  if(route?.startsWith('jokbo/detail/')){detailId=decodeURIComponent(route.slice('jokbo/detail/'.length));screen='jokbo-detail';modal=null;render();window.scrollTo(0,0);return route;}
  if(route?.startsWith('jokbo/compare/')){compareId=decodeURIComponent(route.slice('jokbo/compare/'.length));compareTopic=0;screen='jokbo-compare';modal=null;render();window.scrollTo(0,0);return route;}
  return applyBefore(route);
 });
 const navigateBefore=navigate;
 navigate=function(to){if(to==='jokbo'){saveView();screen='jokbo';detailId=null;compareId=null;modal=null;render();revealActiveEraTab();routes.writeRoute('jokbo');setTimeout(()=>window.scrollTo(0,Number(readJSON(sessionStore,VIEW_KEY,{}).scrollY)||0),0);return;}return navigateBefore(to);};

 document.addEventListener('click',function(event){
  const b=event.target.closest('button');if(!b||b.disabled)return;const d=b.dataset;
  if(d.nav==='jokbo'){event.preventDefault();event.stopImmediatePropagation();navigate('jokbo');return;}
  if(d.jkSearch!==undefined){event.stopImmediatePropagation();searchOpen=!searchOpen;if(!searchOpen)query='';saveView({scrollY:0});render();revealActiveEraTab();setTimeout(()=>document.querySelector('[data-jk-query]')?.focus(),0);return;}
  if(d.jkSearchClear!==undefined){event.stopImmediatePropagation();query='';saveView({scrollY:0});render();revealActiveEraTab();setTimeout(()=>document.querySelector('[data-jk-query]')?.focus(),0);return;}
  if(d.jkEra){event.stopImmediatePropagation();activeEra=d.jkEra;query='';searchOpen=false;saveView({scrollY:0});render();revealActiveEraTab();window.scrollTo(0,0);return;}
  if(d.jkMode){event.stopImmediatePropagation();mode=d.jkMode;saveView({scrollY:0});render();revealActiveEraTab();window.scrollTo(0,0);return;}
  if(d.jkDetail){event.stopImmediatePropagation();saveView({scrollY:window.scrollY});detailId=d.jkDetail;screen='jokbo-detail';routes.writeRoute('jokbo/detail/'+encodeURIComponent(detailId));render();window.scrollTo(0,0);return;}
  if(d.jkGroup){event.stopImmediatePropagation();const first=D.groups.find(g=>g.id===d.jkGroup)?.keywords[0];if(first){saveView({scrollY:window.scrollY});detailId=first.id;screen='jokbo-detail';routes.writeRoute('jokbo/detail/'+detailId);render();window.scrollTo(0,0);}return;}
  if(d.jkSave){event.stopImmediatePropagation();saved.has(d.jkSave)?saved.delete(d.jkSave):saved.add(d.jkSave);saveKeywords();render();return;}
  if(d.jkCompare){event.stopImmediatePropagation();saveView({scrollY:window.scrollY});compareId=d.jkCompare;compareTopic=0;screen='jokbo-compare';routes.writeRoute('jokbo/compare/'+compareId);render();window.scrollTo(0,0);return;}
  if(d.jkCompareTopic!==undefined){event.stopImmediatePropagation();compareTopic=Number(d.jkCompareTopic)||0;render();return;}
  if(d.jkBack){event.stopImmediatePropagation();if(d.jkBack==='jokbo'){screen='jokbo';detailId=null;compareId=null;routes.writeRoute('jokbo');render();revealActiveEraTab();setTimeout(()=>window.scrollTo(0,Number(readJSON(sessionStore,VIEW_KEY,{}).scrollY)||0),0);}return;}
  if(d.jkKeywordExams){event.stopImmediatePropagation();const k=keywordById.get(d.jkKeywordExams);if(k)startExamIds(directExamMatches(k),k.eraId);return;}
  if(d.jkEraExams){event.stopImmediatePropagation();startExamIds(eraExamIds(d.jkEraExams).slice(0,20),d.jkEraExams);return;}
 },true);
 document.addEventListener('input',event=>{if(event.target.matches('[data-jk-query]')){query=event.target.value;saveView({scrollY:0});render();revealActiveEraTab();const input=document.querySelector('[data-jk-query]');input?.focus();input?.setSelectionRange(query.length,query.length);}},true);
 let scrollTimer=0;if(typeof window?.addEventListener==='function')window.addEventListener('scroll',()=>{if(screen!=='jokbo')return;clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>saveView({scrollY:window.scrollY}),80)},{passive:true});
 const rawRoute=(globalThis.location?.hash||'').replace(/^#/,'');if(rawRoute==='jokbo'||rawRoute.startsWith('jokbo/'))routes.applyRoute(rawRoute);else render();
 globalThis.JOKBO_API=Object.freeze({
  count:()=>D.keywords.length,
  countsByEra:()=>Object.fromEntries(D.eras.map(e=>[e.id,D.keywords.filter(k=>k.eraId===e.id).length])),
  linkedExamIds:()=>[...new Set(D.keywords.flatMap(directExamMatches))],
  linkedByEra:()=>Object.fromEntries(D.eras.map(e=>[e.id,eraExamIds(e.id)])),
  saved:()=>[...saved],
  search:value=>D.keywords.filter(k=>{const before=query;query=String(value||'');const result=searchMatches(k);query=before;return result;})
 });
})();
