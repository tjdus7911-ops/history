/* 족보: 시험 직전 세로 요약, 상세·비교·저장·검증 기출 연결. */
(function(){
 'use strict';
 if(!globalThis.JOKBO_DATA||!globalThis.REV7_OX_VIEWS||!globalThis.REV7_EXAM_VIEWS)return;
 const D=globalThis.JOKBO_DATA,routes=globalThis.REV7_OX_VIEWS,exams=globalThis.REV7_EXAM_VIEWS;
 const SAVE_KEY='history-jokbo:saved:v1',VIEW_KEY='history-jokbo:view:v1';
 const icon=(name)=>'<span class="jk-icon" aria-hidden="true"><img src="media/rev7/'+name+'.svg" alt=""></span>';
 const treeIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M12 7H7v4M12 10h5v4M7 11H4v4M7 11h3M17 14h-3M17 14h3v4"/><circle cx="12" cy="4" r="1.5"/><circle cx="4" cy="16" r="1.5"/><circle cx="10" cy="12" r="1.5"/><circle cx="14" cy="15" r="1.5"/><circle cx="20" cy="19" r="1.5"/></svg>';
 const backIcon='<svg class="jk-appbar-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M15.5 18 9.5 12l6-6"/></svg>';
 const quizIcon='<svg viewBox="0 0 24 24" class="ed-icon jk-nav-quiz" data-icon="answer-sheet" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="m8 9 1.5 1.5L12 7M15 8h2M8 14h4M15 13l3 3m0-3-3 3"/></svg>';
 const jokboIcon='<svg viewBox="0 0 24 24" class="ed-icon jk-nav-book" data-icon="summary-book" aria-hidden="true"><path d="M6 3.5h11.5A1.5 1.5 0 0 1 19 5v16H7a3 3 0 0 1 0-6h12"/><path d="M8 3.5V15M11 8h5M11 11h4"/></svg>';
 const memoryStore={data:new Map(),getItem(key){return this.data.get(key)||null},setItem(key,value){this.data.set(key,String(value))}};
 const localStore=typeof localStorage==='undefined'?memoryStore:localStorage,nativeStorage=globalThis.Capacitor?.isNativePlatform?.()===true,sessionStore=nativeStorage?localStore:typeof sessionStorage==='undefined'?memoryStore:sessionStorage;
 const readJSON=(storage,key,fallback)=>{try{return JSON.parse(storage.getItem(key))??fallback}catch{return fallback}};
 const storedSaved=readJSON(localStore,SAVE_KEY,[]),saved=new Set(Array.isArray(storedSaved)?storedSaved:[]);
 const initial=readJSON(sessionStore,VIEW_KEY,{});
 let activeEra=D.eras.some(e=>e.id===initial.activeEra)?initial.activeEra:'proto';
 let listScrollY=Number(initial.scrollY)||0;
 let mode=initial.mode==='saved'?'saved':'all',query=String(initial.query||''),searchOpen=Boolean(initial.searchOpen||query),groupId=null,groupScrollY=0,detailId=null,detailParentGroupId=null,compareId=null,compareTopic=0,restoringScroll=false,scrollRestoreToken=0;
 const norm=value=>String(value||'').toLocaleLowerCase('ko-KR').replace(/\s+/g,'');
 const eraSource={prehistoric:'ancient',proto:'ancient',three:'ancient','north-south':'ancient',goryeo:'goryeo',joseon:'joseon',opening:'empire',colonial:'occupation',modern:'republic'};
 const sourceById=new Map((globalThis.OFFICIAL_EXAM_SOURCE_RECORDS||[]).map(row=>[row.officialQuestionId,row]));
 const explanationById=new Map((globalThis.OFFICIAL_EXAM_EXPLANATION_RECORDS||[]).map(row=>[row.officialQuestionId,row]));
 const keywordById=new Map(D.keywords.map(k=>[k.id,k]));
 const groupById=new Map(D.groups.map(g=>[g.id,g]));
 const comparisonById=new Map(D.comparisons.map(c=>[c.id,c]));
 const eraById=new Map(D.eras.map(e=>[e.id,e]));
 const pageScrollY=()=>Number(document.scrollingElement?.scrollTop??window.scrollY)||0;
 const scrollPage=top=>{const y=Number(top)||0;window.scrollTo(0,y);if(document.scrollingElement&&Math.abs(document.scrollingElement.scrollTop-y)>1)document.scrollingElement.scrollTop=y;};
 function restorePageScroll(top){
  const y=Number(top)||0,token=++scrollRestoreToken;restoringScroll=true;
  const finish=()=>{if(token!==scrollRestoreToken)return;scrollPage(y);restoringScroll=false;};
  if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>{if(token!==scrollRestoreToken)return;scrollPage(y);requestAnimationFrame(finish);});
  else setTimeout(finish,0);
 }

 function saveView(extra={}){
  const previous=readJSON(sessionStore,VIEW_KEY,{});
  if(screen==='jokbo'&&!restoringScroll)listScrollY=pageScrollY();
  if(Object.hasOwn(extra,'scrollY'))listScrollY=Number(extra.scrollY)||0;
  const payload={...previous,activeEra,mode,query,searchOpen,...extra,scrollY:listScrollY};
  try{sessionStore.setItem(VIEW_KEY,JSON.stringify(payload))}catch{}
 }
 function restoreListScroll(){restorePageScroll(listScrollY);}
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
 function groupKeywords(group){return (group?.keywords||[]).map(keyword=>keywordById.get(keyword.id)).filter(Boolean);}
 function groupExamIds(group){
  const ids=[];for(const keyword of groupKeywords(group))for(const id of directExamMatches(keyword))if(!ids.includes(id))ids.push(id);
  return ids;
 }
 function examLabel(id){const s=sourceById.get(id),e=explanationById.get(id);return s&&e?{meta:'제 '+s.examRound+'회 '+s.examLevel+' · '+s.questionNumber+'번',title:e.question||e.clue||'실제 기출문제'}:null;}
 function startExamIds(ids,eraId){
  const entries=ids.map(id=>exams.entry(id)).filter(Boolean);if(!entries.length)return toast('연결된 기출을 준비하고 있어요.');
  saveView({returnFromExam:true});
  exams.start(entries,'learn',{examTab:'era',examEra:eraSource[eraId]||'ancient',examLevel:'all',scope:'jokbo'});
  routes.writeRoute('exam-library');
 }
 function appbar(title,back='jokbo'){return '<header class="jk-appbar"><button type="button" class="jk-appbar-back" data-jk-back="'+back+'" aria-label="뒤로가기">'+backIcon+'</button><h1>'+esc(title)+'</h1><span aria-hidden="true"></span></header>';}
 function searchButton(){return '<button class="jk-search-button" data-jk-search aria-label="족보 검색" aria-expanded="'+searchOpen+'">'+icon(searchOpen?'close':'search')+'</button>';}
 function searchBox(){return !searchOpen?'':'<div class="jk-search"><span>'+icon('search')+'</span><input data-jk-query type="search" value="'+esc(query)+'" placeholder="키워드·국가·왕·인물·대표 단서 검색" aria-label="족보 검색어"><button data-jk-search-clear aria-label="검색어 지우기">'+(query?'×':'')+'</button></div>';}
 function eraTabs(){return '<div class="jk-era-tabs" role="tablist" aria-label="시대 선택">'+D.eras.map(e=>'<button role="tab" data-jk-era="'+e.id+'" aria-selected="'+(activeEra===e.id)+'"><span>'+esc(e.label)+'</span></button>').join('')+'</div>';}
 function revealActiveEraTab(){
  const reveal=()=>{const tabs=document.querySelector('.jk-era-tabs'),selected=tabs?.querySelector('[data-jk-era][aria-selected="true"]');if(!tabs||!selected)return;const track=tabs.getBoundingClientRect(),chip=selected.getBoundingClientRect(),max=Math.max(0,tabs.scrollWidth-tabs.clientWidth);tabs.scrollLeft=Math.max(0,Math.min(max,tabs.scrollLeft+chip.left-track.left-(tabs.clientWidth-chip.width)/2));};
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
  return '<article class="jk-group"><header><div class="jk-group-title"><span class="jk-group-number">'+number+'</span><h3>'+esc(title)+'</h3>'+(searching?'<span class="jk-group-era">'+esc(era.label)+'</span>':'')+'</div><button class="jk-group-detail" data-jk-group="'+group.id+'" aria-label="'+esc(title)+' 전체 핵심 정리 보기"><span>자세히 보기</span><span class="jk-group-arrow" aria-hidden="true">→</span></button></header>'+(group.subtitle?'<p class="jk-group-subtitle">'+esc(group.subtitle)+'</p>':'')+'<div class="jk-keywords">'+keywordRows(group,items)+'</div></article>';
 }
 function emptyMarkup(){
  return '<div class="jk-empty"><span>'+icon('search')+'</span><h2>검색 결과가 없어요</h2><p>띄어쓰기를 바꾸거나 더 짧은 단어로 검색해 보세요.</p><button data-jk-search-clear>검색어 지우기</button></div>';
 }
 function savedEmptyMarkup(){const era=eraById.get(activeEra);return '<div class="jk-empty jk-saved-empty"><span>'+treeIcon+'</span><h2>'+esc(era.label)+'에 저장한 키워드가 없어요</h2><p>이 시대의 상세 화면에서 필요한 키워드를 저장하면<br>시험 직전 목록으로 모아 드려요.</p><button data-jk-mode="all">전체 요약 보기</button></div>';}
 function compareLinks(eraId){
  const rows=D.comparisons.filter(c=>c.eraIds.includes(eraId));if(!rows.length)return '';
  return '<section class="jk-links"><h2>헷갈리는 개념 비교</h2>'+rows.map(c=>'<button data-jk-compare="'+c.id+'"><span><b>'+esc(c.title)+'</b><small>차이를 한눈에 비교해요</small></span><i>›</i></button>').join('')+'</section>';
 }
 function savedList(){
  const eraItems=D.keywords.filter(k=>k.eraId===activeEra&&saved.has(k.id)),items=eraItems.filter(searchMatches);
  if(!items.length)return eraItems.length?emptyMarkup():savedEmptyMarkup();
  return '<div class="jk-saved-list">'+items.map(k=>'<article><button data-jk-detail="'+k.id+'"><span class="jk-tags"><em>'+esc(eraById.get(k.eraId).label)+'</em><em>'+esc(k.groupTitle.replace(/^\d+\s*/,''))+'</em><em>'+esc(k.label)+'</em></span><b>'+esc(k.value)+'</b><p>'+esc(k.definition)+'</p></button><button class="jk-unsave" data-jk-save="'+k.id+'" aria-label="'+esc(k.value)+' 저장 해제">'+icon('bookmark-filled')+'</button></article>').join('')+'</div>';
 }
 function mainPage(){
  const searching=Boolean(query.trim()),era=eraById.get(activeEra);
  const eraSavedCount=D.keywords.filter(k=>k.eraId===activeEra&&saved.has(k.id)).length;
  const pool=searching?D.groups:D.groups.filter(g=>g.eraId===activeEra),rows=[];
  for(const group of pool){const items=group.keywords.filter(k=>searchMatches({...k,groupTitle:group.title,eraId:group.eraId}));if(items.length)rows.push({group,items});}
  const related=eraExamIds(activeEra);
  return '<section class="jk-page jk-main" data-page="jokbo"><header class="jk-heading r7-menu-heading"><h1>족보</h1>'+searchButton()+'</header><p class="jk-heading-subtitle">시험 전에 필요한 것만</p>'+searchBox()
   +'<div class="jk-segment" role="tablist" aria-label="족보 보기"><button role="tab" data-jk-mode="all" aria-selected="'+(mode==='all')+'">전체 요약</button><button role="tab" data-jk-mode="saved" aria-selected="'+(mode==='saved')+'">저장한 키워드 <span class="jk-segment-count'+(eraSavedCount?'':' is-empty')+'">'+eraSavedCount+'</span></button></div>'+eraTabs()
   +(mode==='saved'?'<section class="jk-summary-head"><h2>'+esc(era.label)+' 저장 키워드</h2><p>이 시대에서 저장한 핵심 개념만 모았어요.</p></section>'+savedList():'<div class="jk-era-content" data-jk-swipe="'+(!searching)+'"><section class="jk-summary-head">'+(searching?'<small class="jk-summary-kicker">검색 결과</small>':'')+'<h2>'+esc(searching?'“'+query+'” 검색 결과':era.title)+'</h2><p>'+esc(searching?'전 시대의 국가·왕·인물·단서를 찾았어요.':era.subtitle)+'</p></section><div class="jk-groups">'+(rows.length?rows.map((row,i)=>groupMarkup(row.group,row.items,i,searching)).join(''):emptyMarkup())+'</div>'+(searching?'':compareLinks(activeEra))
   +(searching?'':'<section class="jk-exam-cta"><div><small>RELATED QUESTIONS</small><h2>이 시대 관련 기출 풀기</h2><p>'+related.length+'개의 검증된 실제 기출이 핵심 키워드와 연결되어 있어요.</p></div><button data-jk-era-exams="'+activeEra+'" '+(related.length?'':'disabled')+'>'+(related.length?'기출 '+Math.min(20,related.length)+'문제 풀기':'연결된 기출을 준비하고 있어요')+'</button></section>')+'</div>')+'</section>';
 }
 function groupKeywordMarkup(group,k){
  const rows=k.summaryRows?.length?k.summaryRows:[{label:k.label,value:k.value}],point=k.groupPoint||k.bullets?.[0]||k.definition;
  return '<article class="jk-group-keyword-card" data-jk-group-keyword-id="'+k.id+'"><div class="jk-group-keyword-facts">'+rows.map(row=>'<div class="jk-group-keyword-fact"><span>'+esc(row.label)+'</span><strong aria-label="'+esc(row.value)+'">'+semanticValue(row.value)+'</strong></div>').join('')+'</div><p class="jk-group-keyword-description">'+esc(k.definition)+'</p><div class="jk-group-keyword-point"><small>시험 포인트</small><p>'+esc(point)+'</p></div>'+(k.source?'<p class="jk-group-keyword-source">사실 확인: <a href="'+esc(k.source.url)+'" target="_blank" rel="noreferrer">'+esc(k.source.label)+' ↗</a></p>':'')+'<div class="jk-group-keyword-actions"><button class="jk-group-save '+(saved.has(k.id)?'is-saved':'')+'" data-jk-save="'+k.id+'" aria-label="'+esc(k.value)+' 키워드 '+(saved.has(k.id)?'저장 해제':'저장')+'">'+icon(saved.has(k.id)?'bookmark-filled':'bookmark')+' <span>'+(saved.has(k.id)?'저장됨':'키워드 저장')+'</span></button><button class="jk-group-concept" data-jk-detail="'+k.id+'" data-jk-detail-parent="'+group.id+'" aria-label="'+esc(k.value)+' 개념 상세 보기"><span>개념 상세</span><i aria-hidden="true">→</i></button></div></article>';
 }
 function groupPage(){
  const group=groupById.get(groupId);if(!group)return mainPage();const era=eraById.get(group.eraId),title=group.title.replace(/^\d+\s*/,''),keywords=groupKeywords(group),ids=groupExamIds(group);
  return '<section class="jk-page jk-group-page" data-page="jokbo-group">'+appbar('전체 핵심 정리')+'<header class="jk-group-overview"><small>'+esc(era.label)+'</small><h2>'+esc(title)+' 핵심 정리</h2><p>요약에 나온 핵심을 의미와 시험 단서까지 한 번에 확인해요.</p></header><div class="jk-group-keyword-list">'+keywords.map(k=>groupKeywordMarkup(group,k)).join('')+'</div><section class="jk-detail-section jk-related jk-group-related"><div><h2>관련 실제 기출</h2><small>이 그룹의 키워드와 직접 연결된 문제 · 중복 제외</small></div>'+(ids.length?ids.map(id=>{const row=examLabel(id);return row?'<article><span><small>'+esc(row.meta)+'</small><b>'+esc(row.title)+'</b></span></article>':'';}).join(''):'<div class="jk-empty-inline">연결된 기출을 준비하고 있어요</div>')+'<button class="jk-primary" data-jk-group-exams="'+group.id+'" '+(ids.length?'':'disabled')+'>'+(ids.length?'관련 기출 '+ids.length+'문제 풀기':'연결된 기출을 준비하고 있어요')+'</button></section></section>';
 }
 function detailPage(){
  const k=keywordById.get(detailId);if(!k)return mainPage();const era=eraById.get(k.eraId),ids=directExamMatches(k),comparison=comparisonById.get(k.comparisonId);
  return '<section class="jk-page jk-detail" data-page="jokbo-detail">'+appbar('개념 상세',detailParentGroupId?'group:'+detailParentGroupId:'jokbo')+'<header class="jk-detail-head"><div class="jk-detail-context jk-tags"><em>'+esc(era.label)+'</em><em>'+esc(k.groupTitle.replace(/^\d+\s*/,''))+'</em><em>'+esc(k.label)+'</em></div><h2 class="jk-detail-title">'+esc(k.value)+'</h2><p class="jk-detail-description">'+esc(k.definition)+'</p><button class="jk-save '+(saved.has(k.id)?'is-saved':'')+'" data-jk-save="'+k.id+'">'+icon(saved.has(k.id)?'bookmark-filled':'bookmark')+' '+(saved.has(k.id)?'저장됨':'키워드 저장')+'</button></header>'
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
  const nav=[['home','홈',editorialIcon('home')],['exam-library','기출문제',editorialIcon('book')],['ox','OX',quizIcon],['study','오답노트',editorialIcon('note')],['jokbo','족보',jokboIcon],['records','내 기록',editorialIcon('records')]];
  return '<div class="shell editorial-shell six-nav"><aside class="sidebar"><div class="brand">눈떠보니 한국사<small>역사를 살고, 기출로 기억하다</small></div><nav class="nav app-navigation" aria-label="주 메뉴">'+nav.map(([id,label,image])=>'<button data-nav="'+id+'" '+(current===id?'aria-current="page"':'')+' class="'+(current===id?'active':'')+'">'+image+'<span>'+label+'</span></button>').join('')+'</nav></aside><main class="main ed-screen ed-'+screen+'">'+content+'</main></div>'+(modal?modalHTML():'');
 };
 const contentBefore=renderContent;
 renderContent=function(){if(screen==='jokbo')return mainPage();if(screen==='jokbo-group')return groupPage();if(screen==='jokbo-detail')return detailPage();if(screen==='jokbo-compare')return comparePage();return contentBefore();};
 routes.addRoute('jokbo');
 for(const g of D.groups)routes.addRoute('jokbo/group/'+g.id);
 for(const k of D.keywords)routes.addRoute('jokbo/detail/'+k.id);
 for(const c of D.comparisons)routes.addRoute('jokbo/compare/'+c.id);
 const applyBefore=routes.applyRoute;
 routes.setApplyRoute(function(route=routes.readRoute()){
  if(route==='jokbo'){restoringScroll=true;screen='jokbo';groupId=null;detailId=null;detailParentGroupId=null;compareId=null;modal=null;render();revealActiveEraTab();restoreListScroll();return route;}
  if(route?.startsWith('jokbo/group/')){groupId=decodeURIComponent(route.slice('jokbo/group/'.length));const group=groupById.get(groupId);if(!group)return applyBefore('jokbo');activeEra=group.eraId;detailId=null;detailParentGroupId=null;compareId=null;screen='jokbo-group';modal=null;render();window.scrollTo(0,0);return route;}
  if(route?.startsWith('jokbo/detail/')){detailId=decodeURIComponent(route.slice('jokbo/detail/'.length));const parent=groupId&&groupById.get(groupId)?.keywords.some(k=>k.id===detailId)?groupId:null;detailParentGroupId=parent;screen='jokbo-detail';modal=null;render();window.scrollTo(0,0);return route;}
  if(route?.startsWith('jokbo/compare/')){compareId=decodeURIComponent(route.slice('jokbo/compare/'.length));compareTopic=0;screen='jokbo-compare';modal=null;render();window.scrollTo(0,0);return route;}
  return applyBefore(route);
 });
 const navigateBefore=navigate;
 navigate=function(to){if(to==='jokbo'){saveView();screen='jokbo';groupId=null;detailId=null;detailParentGroupId=null;compareId=null;modal=null;render();revealActiveEraTab();routes.writeRoute('jokbo');restoreListScroll();return;}return navigateBefore(to);};

 document.addEventListener('click',function(event){
  if(Date.now()<suppressSwipeClickUntil&&event.target.closest('.jk-era-content')){event.preventDefault();event.stopImmediatePropagation();return;}
  const b=event.target.closest('button');if(!b||b.disabled)return;const d=b.dataset;
  if(d.nav==='jokbo'){event.preventDefault();event.stopImmediatePropagation();navigate('jokbo');return;}
  if(d.jkSearch!==undefined){event.stopImmediatePropagation();searchOpen=!searchOpen;if(!searchOpen)query='';saveView({scrollY:0});render();revealActiveEraTab();setTimeout(()=>document.querySelector('[data-jk-query]')?.focus(),0);return;}
  if(d.jkSearchClear!==undefined){event.stopImmediatePropagation();query='';saveView({scrollY:0});render();revealActiveEraTab();setTimeout(()=>document.querySelector('[data-jk-query]')?.focus(),0);return;}
  if(d.jkEra){event.stopImmediatePropagation();activeEra=d.jkEra;query='';searchOpen=false;saveView({scrollY:0});render();revealActiveEraTab();window.scrollTo(0,0);return;}
  if(d.jkMode){event.stopImmediatePropagation();mode=d.jkMode;saveView({scrollY:0});render();revealActiveEraTab();window.scrollTo(0,0);return;}
  if(d.jkDetail){event.stopImmediatePropagation();if(screen==='jokbo')saveView({scrollY:pageScrollY()});detailParentGroupId=d.jkDetailParent||null;if(detailParentGroupId)groupScrollY=pageScrollY();detailId=d.jkDetail;screen='jokbo-detail';routes.writeRoute('jokbo/detail/'+encodeURIComponent(detailId));render();window.scrollTo(0,0);return;}
  if(d.jkGroup){event.stopImmediatePropagation();const group=groupById.get(d.jkGroup);if(group){saveView({scrollY:pageScrollY()});groupId=group.id;groupScrollY=0;detailId=null;detailParentGroupId=null;screen='jokbo-group';routes.writeRoute('jokbo/group/'+encodeURIComponent(groupId));render();window.scrollTo(0,0);}return;}
  if(d.jkSave){event.stopImmediatePropagation();saved.has(d.jkSave)?saved.delete(d.jkSave):saved.add(d.jkSave);saveKeywords();render();if(screen==='jokbo')revealActiveEraTab();return;}
  if(d.jkCompare){event.stopImmediatePropagation();saveView();compareId=d.jkCompare;compareTopic=0;screen='jokbo-compare';routes.writeRoute('jokbo/compare/'+compareId);render();window.scrollTo(0,0);return;}
  if(d.jkCompareTopic!==undefined){event.stopImmediatePropagation();compareTopic=Number(d.jkCompareTopic)||0;render();return;}
  if(d.jkBack){event.stopImmediatePropagation();if(d.jkBack.startsWith('group:')){groupId=d.jkBack.slice('group:'.length);detailId=null;detailParentGroupId=null;screen='jokbo-group';routes.writeRoute('jokbo/group/'+encodeURIComponent(groupId));render();restorePageScroll(groupScrollY);return;}if(d.jkBack==='jokbo'){restoringScroll=true;screen='jokbo';groupId=null;detailId=null;detailParentGroupId=null;compareId=null;routes.writeRoute('jokbo');render();revealActiveEraTab();restoreListScroll();}return;}
  if(d.jkKeywordExams){event.stopImmediatePropagation();const k=keywordById.get(d.jkKeywordExams);if(k)startExamIds(directExamMatches(k),k.eraId);return;}
  if(d.jkGroupExams){event.stopImmediatePropagation();const group=groupById.get(d.jkGroupExams);if(group)startExamIds(groupExamIds(group),group.eraId);return;}
  if(d.jkEraExams){event.stopImmediatePropagation();startExamIds(eraExamIds(d.jkEraExams).slice(0,20),d.jkEraExams);return;}
 },true);
 // Lock the gesture to its initial axis; vertical scrolling never changes eras.
 let eraGesture=null,suppressSwipeClickUntil=0;
 document.addEventListener('touchstart',event=>{
  eraGesture=null;suppressSwipeClickUntil=0;
  if(screen!=='jokbo'||mode!=='all'||query.trim()||event.touches.length!==1||!event.target.closest('[data-jk-swipe="true"]'))return;
  const t=event.touches[0];eraGesture={x:t.clientX,y:t.clientY,id:t.identifier,axis:null,era:activeEra};
 },{passive:true});
 document.addEventListener('touchmove',event=>{
  if(!eraGesture)return;if(event.touches.length!==1){eraGesture=null;return;}
  const t=event.touches[0],dx=t.clientX-eraGesture.x,dy=t.clientY-eraGesture.y;
  if(!eraGesture.axis&&Math.max(Math.abs(dx),Math.abs(dy))>10)eraGesture.axis=Math.abs(dx)>Math.abs(dy)*1.35?'x':'y';
  if(eraGesture.axis==='x'&&event.cancelable)event.preventDefault();
 },{passive:false});
 document.addEventListener('touchcancel',()=>{eraGesture=null;},{passive:true});
 document.addEventListener('touchend',event=>{
  const gesture=eraGesture;eraGesture=null;
  if(!gesture||gesture.axis!=='x'||screen!=='jokbo'||mode!=='all'||query.trim()||activeEra!==gesture.era)return;
  const t=Array.from(event.changedTouches).find(t=>t.identifier===gesture.id);if(!t)return;
  const dx=t.clientX-gesture.x,dy=t.clientY-gesture.y;
  if(Math.abs(dx)<56||Math.abs(dx)<Math.abs(dy)*1.35)return;
  suppressSwipeClickUntil=Date.now()+450;
  if(event.cancelable)event.preventDefault();
  const index=D.eras.findIndex(e=>e.id===activeEra),next=index+(dx<0?1:-1);
  if(next<0||next>=D.eras.length)return;
  const previousY=pageScrollY(),oldContent=document.querySelector('[data-jk-swipe="true"]'),contentTop=oldContent.getBoundingClientRect().top+previousY;
  activeEra=D.eras[next].id;saveView({scrollY:Math.min(previousY,contentTop)});render();revealActiveEraTab();
  // Keep the header in place at the top; when already scrolled, reveal the new summary start.
  restorePageScroll(Math.min(previousY,contentTop));
  const content=document.querySelector('[data-jk-swipe="true"]');
  if(!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)content?.animate?.([{opacity:.45,transform:'translateX('+(dx<0?28:-28)+'px)'},{opacity:1,transform:'translateX(0)'}],{duration:190,easing:'ease-out'});
 },{passive:false});
 document.addEventListener('input',event=>{if(event.target.matches('[data-jk-query]')){query=event.target.value;saveView({scrollY:0});render();revealActiveEraTab();const input=document.querySelector('[data-jk-query]');input?.focus();input?.setSelectionRange(query.length,query.length);}},true);
 let scrollTimer=0;if(typeof window?.addEventListener==='function')window.addEventListener('scroll',()=>{if(screen!=='jokbo'||restoringScroll)return;clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{if(screen==='jokbo'&&!restoringScroll)saveView({scrollY:pageScrollY()})},80)},{passive:true});
 const rawRoute=(globalThis.location?.hash||'').replace(/^#/,'');if(rawRoute==='jokbo'||rawRoute.startsWith('jokbo/'))routes.applyRoute(rawRoute);else render();
 globalThis.JOKBO_API=Object.freeze({
  count:()=>D.keywords.length,
  countsByEra:()=>Object.fromEntries(D.eras.map(e=>[e.id,D.keywords.filter(k=>k.eraId===e.id).length])),
  linkedExamIds:()=>[...new Set(D.keywords.flatMap(directExamMatches))],
  linkedByEra:()=>Object.fromEntries(D.eras.map(e=>[e.id,eraExamIds(e.id)])),
  groupKeywordIds:id=>groupKeywords(groupById.get(id)).map(k=>k.id),
  groupExamIds:id=>groupExamIds(groupById.get(id)),
  state:()=>({screen,activeEra,listScrollY,groupId,groupScrollY,detailId,detailParentGroupId}),
  view:()=>({...readJSON(sessionStore,VIEW_KEY,{})}),
  saved:()=>[...saved],
  search:value=>D.keywords.filter(k=>{const before=query;query=String(value||'');const result=searchMatches(k);query=before;return result;})
 });
})();
