/* 족보: 시대별 키워드 카드 요약(좌우 스와이프·시대/나라 칩), 상세·비교·저장·검증 기출 연결. 하단 메뉴는 기존 5개를 유지하고 홈에서 진입한다. */
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
 let country=String(initial.country||'all');
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
  const payload={...previous,activeEra,country,mode,query,searchOpen,...extra,scrollY:listScrollY};
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
 // 나라 칩: 그룹(국가·왕 묶음)과 행 이름(삼국 문화 비교 등)에서만 도출한다. 데이터는 바꾸지 않는다.
 const GROUP_COUNTRY={gojoseon:'고조선',buyeo:'부여','early-goguryeo':'고구려',okjeo:'옥저',dongye:'동예',samhan:'삼한','goguryeo-kings':'고구려','baekje-kings':'백제','silla-kings':'신라',gaya:'가야','unification-war':'신라','unified-silla':'신라','unified-culture':'신라',balhae:'발해','later-three':'후삼국'};
 const KEYWORD_COUNTRY={sataek:'백제','silla-late':'신라'};
 const COUNTRY_NAMES=new Set(Object.values(GROUP_COUNTRY));
 const factRows=k=>k.summaryRows?.length?k.summaryRows:[{label:k.label,value:k.value}];
 function rowCountry(group,k,row){if(group.eraId!=='prehistoric'&&COUNTRY_NAMES.has(row.label))return row.label;return KEYWORD_COUNTRY[k.id]||GROUP_COUNTRY[group.id]||'';}
 function eraCountries(eraId){
  const list=[];for(const group of D.groups.filter(g=>g.eraId===eraId))for(const k of group.keywords)for(const row of factRows(k)){const c=rowCountry(group,k,row);if(c&&!list.includes(c))list.push(c);}
  return list.length>1?list:[];
 }
 const activeCountry=()=>{const list=eraCountries(activeEra);return list.includes(country)?country:'all';};
 const countryMatch=(group,k,row)=>{const c=activeCountry();return c==='all'||rowCountry(group,k,row)===c;};
 const chevron='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="m9 6 6 6-6 6"/></svg>';
 const chevronLeft='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M15 6 9 12l6 6"/></svg>';

 function appbar(title,back='jokbo'){return '<header class="jk-appbar"><button type="button" class="jk-appbar-back" data-jk-back="'+back+'" aria-label="뒤로가기">'+backIcon+'</button><h1>'+esc(title)+'</h1><span aria-hidden="true"></span></header>';}
 function searchButton(){return '<button class="jk-search-button" data-jk-search aria-label="족보 검색" aria-expanded="'+searchOpen+'">'+icon(searchOpen?'close':'search')+'</button>';}
 function searchBox(){return !searchOpen?'':'<div class="jk-search"><span>'+icon('search')+'</span><input data-jk-query type="search" value="'+esc(query)+'" placeholder="키워드·국가·왕·인물·대표 단서 검색" aria-label="족보 검색어"><button data-jk-search-clear aria-label="검색어 지우기">'+(query?'×':'')+'</button></div>';}
 function eraTabs(){return '<div class="jk-chiprow"><span class="jk-chiprow-label" aria-hidden="true">시대</span><div class="jk-era-tabs jk-chips" role="tablist" aria-label="시대 선택">'+D.eras.map(e=>'<button role="tab" data-jk-era="'+e.id+'" aria-selected="'+(activeEra===e.id)+'"><span>'+esc(e.label)+'</span></button>').join('')+'</div></div>';}
 function countryChips(){
  const list=eraCountries(activeEra);if(!list.length||query.trim())return '';const current=activeCountry();
  return '<div class="jk-chiprow"><span class="jk-chiprow-label" aria-hidden="true">나라</span><div class="jk-chips jk-country-chips" role="tablist" aria-label="나라 선택">'+['all',...list].map(c=>'<button role="tab" data-jk-country="'+esc(c)+'" aria-selected="'+(current===c)+'"><span>'+esc(c==='all'?'전체':c)+'</span></button>').join('')+'</div></div>';
 }
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
 // 요약 카드·자세히 보기·저장 목록·개념 상세가 같은 행 마크업을 써서 키워드가 빠지지 않게 한다.
 function factLine(row,index){
  const long=[...String(row.label)].length>7;
  return '<span class="jk-keyword-line jk-fact'+(long?' is-long-label':'')+'" data-jk-fact-row data-jk-fact-index="'+index+'"><span class="jk-keyword-badge jk-fact-label" data-jk-fact-name>'+esc(row.label)+'</span><strong class="jk-keyword-value jk-fact-value" data-jk-fact-value aria-label="'+esc(row.value)+'">'+semanticValue(row.value)+'</strong></span>';
 }
 function keywordRows(group,items,filtered=true){return items.map(k=>{
  const rows=factRows(k).map((row,index)=>({row,index})).filter(({row})=>!filtered||countryMatch(group,k,row));if(!rows.length)return '';
  return '<button class="jk-keyword'+(rows.length>1?' is-split':'')+'" data-jk-detail="'+k.id+'" aria-label="'+esc(rows.map(({row})=>row.label+' '+row.value).join(', '))+', 개념 상세 보기">'+rows.map(({row,index})=>factLine(row,index)).join('')+'</button>';
 }).join('');}
 function groupMarkup(group,items,index,searching){
  const number=String(index+1).padStart(2,'0'),title=group.title.replace(/^\d+\s*/,''),era=eraById.get(group.eraId),total=groupKeywords(group).reduce((sum,k)=>sum+factRows(k).length,0);
  return '<article class="jk-group jk-card" data-jk-card="'+group.id+'"><header class="jk-card-head"><span class="jk-group-number">'+number+'</span><h3>'+esc(title)+'</h3>'+(searching?'<span class="jk-group-era">'+esc(era.label)+'</span>':'')+'</header>'+(group.subtitle?'<p class="jk-group-subtitle">'+esc(group.subtitle)+'</p>':'')+'<div class="jk-keywords">'+keywordRows(group,items,!searching)+'</div><button class="jk-group-detail jk-card-more" data-jk-group="'+group.id+'" aria-label="'+esc(title)+' 자세히 보기, 키워드 '+total+'개 전체"><span>자세히 보기</span><small>키워드 '+total+'개 전체</small><i aria-hidden="true">'+chevron+'</i></button></article>';
 }
 function emptyMarkup(){
  return '<div class="jk-empty"><span>'+icon('search')+'</span><h2>검색 결과가 없어요</h2><p>띄어쓰기를 바꾸거나 더 짧은 단어로 검색해 보세요.</p><button data-jk-search-clear>검색어 지우기</button></div>';
 }
 function savedEmptyMarkup(){const era=eraById.get(activeEra),c=activeCountry();return '<div class="jk-empty jk-saved-empty"><span>'+treeIcon+'</span><h2>'+esc(era.label)+(c==='all'?'':' · '+esc(c))+'에 저장한 키워드가 없어요</h2><p>자세히 보기에서 필요한 키워드를 저장하면<br>시험 직전 목록으로 모아 드려요.</p><button data-jk-mode="all">전체 요약 보기</button></div>';}
 function compareLinks(eraId){
  const rows=D.comparisons.filter(c=>c.eraIds.includes(eraId));if(!rows.length)return '';
  return '<section class="jk-links"><h2>헷갈리는 개념 비교</h2>'+rows.map(c=>'<button data-jk-compare="'+c.id+'"><span><b>'+esc(c.title)+'</b><small>차이를 한눈에 비교해요</small></span><i>›</i></button>').join('')+'</section>';
 }
 function savedList(){
  const eraItems=D.keywords.filter(k=>k.eraId===activeEra&&saved.has(k.id)),items=eraItems.filter(searchMatches).filter(k=>{const g=groupById.get(k.groupId);return g&&factRows(k).some(row=>countryMatch(g,k,row));});
  if(!items.length)return eraItems.length&&query.trim()?emptyMarkup():savedEmptyMarkup();
  return '<div class="jk-saved-list">'+items.map(k=>{const g=groupById.get(k.groupId);return '<article class="jk-card jk-saved-card"><header class="jk-card-head"><span class="jk-tags"><em>'+esc(k.groupTitle.replace(/^\d+\s*/,''))+'</em></span><button class="jk-unsave" data-jk-save="'+k.id+'" aria-label="'+esc(k.value)+' 저장 해제">'+icon('bookmark-filled')+'</button></header><div class="jk-keywords">'+keywordRows(g,[k])+'</div><p class="jk-saved-definition">'+esc(k.definition)+'</p></article>';}).join('')+'</div>';
 }
 function eraPager(era,index){
  const prev=D.eras[index-1],next=D.eras[index+1];
  const step=(item,dir)=>item?'<button class="jk-pager-step" data-jk-era="'+item.id+'" data-jk-pager="'+dir+'" aria-label="'+(dir<0?'이전':'다음')+' 시대: '+esc(item.label)+'">'+(dir<0?chevronLeft:chevron)+'<span>'+esc(item.label)+'</span></button>':'<span class="jk-pager-step is-empty" aria-hidden="true"></span>';
  return '<section class="jk-summary-head jk-era-pager">'+step(prev,-1)+'<div class="jk-pager-title"><small class="jk-pager-count">'+(index+1)+' / '+D.eras.length+'</small><h2>'+esc(era.title)+'</h2><p>'+esc(era.subtitle)+'</p></div>'+step(next,1)+'</section><div class="jk-pager-dots" aria-hidden="true">'+D.eras.map((e,i)=>'<i class="'+(i===index?'is-active':'')+'"></i>').join('')+'</div><p class="jk-swipe-hint" aria-hidden="true">카드를 좌우로 밀면 시대가 바뀌어요</p>';
 }
 function mainPage(){
  const searching=Boolean(query.trim()),era=eraById.get(activeEra),eraIndex=D.eras.findIndex(e=>e.id===activeEra);
  const eraSavedCount=D.keywords.filter(k=>k.eraId===activeEra&&saved.has(k.id)).length;
  const pool=searching?D.groups:D.groups.filter(g=>g.eraId===activeEra),rows=[];
  for(const group of pool){const items=group.keywords.filter(k=>searchMatches({...k,groupTitle:group.title,eraId:group.eraId})&&(searching||factRows(k).some(row=>countryMatch(group,k,row))));if(items.length)rows.push({group,items});}
  const related=eraExamIds(activeEra);
  const filters='<div class="jk-filterbar"><div class="jk-segment" role="tablist" aria-label="족보 보기"><button role="tab" data-jk-mode="all" aria-selected="'+(mode==='all')+'">전체 요약</button><button role="tab" data-jk-mode="saved" aria-selected="'+(mode==='saved')+'">저장한 키워드 <span class="jk-segment-count'+(eraSavedCount?'':' is-empty')+'">'+eraSavedCount+'</span></button></div>'+eraTabs()+countryChips()+'</div>';
  return '<section class="jk-page jk-main" data-page="jokbo"><header class="jk-heading r7-menu-heading"><button type="button" class="jk-heading-back" data-jk-back="home" aria-label="홈으로 돌아가기">'+backIcon+'</button><h1>족보</h1>'+searchButton()+'</header><p class="jk-heading-subtitle">시험 전에 필요한 키워드만 카드로</p>'+searchBox()+filters
   +(mode==='saved'?'<div class="jk-era-content" data-jk-swipe="'+(!searching)+'"><section class="jk-summary-head jk-saved-head"><small class="jk-pager-count">'+(eraIndex+1)+' / '+D.eras.length+'</small><h2>'+esc(era.label)+' 저장 키워드</h2><p>이 시대에서 저장한 핵심 개념만 모았어요.</p></section>'+savedList()+'</div>'
   :'<div class="jk-era-content" data-jk-swipe="'+(!searching)+'">'+(searching?'<section class="jk-summary-head"><small class="jk-summary-kicker">검색 결과</small><h2>'+esc('“'+query+'” 검색 결과')+'</h2><p>전 시대의 국가·왕·인물·단서를 찾았어요.</p></section>':eraPager(era,eraIndex))+'<div class="jk-groups">'+(rows.length?rows.map((row,i)=>groupMarkup(row.group,row.items,i,searching)).join(''):emptyMarkup())+'</div>'+(searching?'':compareLinks(activeEra))
   +(searching?'':'<section class="jk-exam-cta"><div><small>RELATED QUESTIONS</small><h2>이 시대 관련 기출 풀기</h2><p>'+related.length+'개의 검증된 실제 기출이 핵심 키워드와 연결되어 있어요.</p></div><button data-jk-era-exams="'+activeEra+'" '+(related.length?'':'disabled')+'>'+(related.length?'기출 '+Math.min(20,related.length)+'문제 풀기':'연결된 기출을 준비하고 있어요')+'</button></section>')+'</div>')+'</section>';
 }
 function groupKeywordMarkup(group,k){
  const rows=factRows(k),point=k.groupPoint||k.bullets?.[0]||k.definition;
  return '<article class="jk-group-keyword-card jk-card" data-jk-group-keyword-id="'+k.id+'"><div class="jk-group-keyword-facts">'+rows.map((row,index)=>factLine(row,index)).join('')+'</div><p class="jk-group-keyword-description">'+esc(k.definition)+'</p><div class="jk-group-keyword-point"><small>시험 포인트</small><p>'+esc(point)+'</p></div>'+(k.source?'<p class="jk-group-keyword-source">사실 확인: <a href="'+esc(k.source.url)+'" target="_blank" rel="noreferrer">'+esc(k.source.label)+' ↗</a></p>':'')+'<div class="jk-group-keyword-actions"><button class="jk-group-save '+(saved.has(k.id)?'is-saved':'')+'" data-jk-save="'+k.id+'" aria-label="'+esc(k.value)+' 키워드 '+(saved.has(k.id)?'저장 해제':'저장')+'">'+icon(saved.has(k.id)?'bookmark-filled':'bookmark')+' <span>'+(saved.has(k.id)?'저장됨':'키워드 저장')+'</span></button><button class="jk-group-concept" data-jk-detail="'+k.id+'" data-jk-detail-parent="'+group.id+'" aria-label="'+esc(k.value)+' 개념 상세 보기"><span>개념 상세</span><i aria-hidden="true">'+chevron+'</i></button></div></article>';
 }
 function groupPage(){
  const group=groupById.get(groupId);if(!group)return mainPage();const era=eraById.get(group.eraId),title=group.title.replace(/^\d+\s*/,''),keywords=groupKeywords(group),ids=groupExamIds(group),total=keywords.reduce((sum,k)=>sum+factRows(k).length,0);
  return '<section class="jk-page jk-group-page" data-page="jokbo-group">'+appbar('자세히 보기')+'<header class="jk-group-overview"><span class="jk-tags"><em>'+esc(era.label)+'</em>'+(GROUP_COUNTRY[group.id]&&GROUP_COUNTRY[group.id]!==title?'<em>'+esc(GROUP_COUNTRY[group.id])+'</em>':'')+'</span><h2>'+esc(title)+' 핵심 정리</h2><p>요약 카드의 키워드 <b>'+total+'개</b>를 모두 펼쳐 의미와 시험 단서까지 확인해요.</p></header><div class="jk-group-keyword-list">'+keywords.map(k=>groupKeywordMarkup(group,k)).join('')+'</div><section class="jk-detail-section jk-related jk-group-related"><div><h2>관련 실제 기출</h2><small>이 그룹의 키워드와 직접 연결된 문제 · 중복 제외</small></div>'+(ids.length?ids.map(id=>{const row=examLabel(id);return row?'<article><span><small>'+esc(row.meta)+'</small><b>'+esc(row.title)+'</b></span></article>':'';}).join(''):'<div class="jk-empty-inline">연결된 기출을 준비하고 있어요</div>')+'<button class="jk-primary" data-jk-group-exams="'+group.id+'" '+(ids.length?'':'disabled')+'>'+(ids.length?'관련 기출 '+ids.length+'문제 풀기':'연결된 기출을 준비하고 있어요')+'</button></section></section>';
 }
 function detailPage(){
  const k=keywordById.get(detailId);if(!k)return mainPage();const era=eraById.get(k.eraId),ids=directExamMatches(k),comparison=comparisonById.get(k.comparisonId),rows=factRows(k);
  return '<section class="jk-page jk-detail" data-page="jokbo-detail">'+appbar('개념 상세',detailParentGroupId?'group:'+detailParentGroupId:'jokbo')+'<header class="jk-detail-head"><div class="jk-detail-context jk-tags"><em>'+esc(era.label)+'</em><em>'+esc(k.groupTitle.replace(/^\d+\s*/,''))+'</em><em>'+esc(k.label)+'</em></div><h2 class="jk-detail-title">'+esc(k.value)+'</h2><p class="jk-detail-description">'+esc(k.definition)+'</p><button class="jk-save '+(saved.has(k.id)?'is-saved':'')+'" data-jk-save="'+k.id+'">'+icon(saved.has(k.id)?'bookmark-filled':'bookmark')+' '+(saved.has(k.id)?'저장됨':'키워드 저장')+'</button></header>'
   +'<section class="jk-detail-section jk-detail-facts"><h2>요약 카드 키워드 <small>'+rows.length+'개</small></h2><div class="jk-card jk-keywords">'+rows.map((row,index)=>factLine(row,index)).join('')+'</div></section>'
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
 // 홈 진입점: '실전 학습' 목록의 족보 줄과 홈 하단 플로팅 버튼. 하단 메뉴는 기존 5개 그대로 둔다.
 function homeEntryRow(){return '<button class="hv-row hv-row-jokbo" data-jk-open="home"><span class="hv-ico coral">'+jokboIcon+'</span><span class="hv-row-text"><b>족보</b><small>시대별 핵심 키워드를 카드로 정리해요</small></span><span class="hv-chev">'+chevron+'</span></button>';}
 function withHomeEntry(html){
  if(html.includes('data-jk-open="home"'))return html;
  const at=html.indexOf('aria-label="실전 학습"');if(at<0)return html;
  const wrong=html.indexOf('<div class="hv-row hv-row-wrong',at),wrongButton=html.indexOf('<button class="hv-row hv-row-wrong',at),end=html.indexOf('</div></section>',at);
  const candidates=[wrong,wrongButton].filter(i=>i>at&&(end<0||i<end));const insertAt=candidates.length?Math.min(...candidates):end;
  return insertAt<0?html:html.slice(0,insertAt)+homeEntryRow()+html.slice(insertAt);
 }
 const homeFab='<div class="jk-home-dock"><button type="button" class="jk-home-fab" data-jk-open="home" aria-label="족보 열기, 시대별 핵심 키워드 카드">'+jokboIcon+'<span><b>족보</b><small>시대별 핵심 키워드 한눈에 보기</small></span><i aria-hidden="true">'+chevron+'</i></button></div>';

 // Final navigation shell: the five existing destinations only. 족보 screens belong to 홈.
 const shellBefore=shell;
 shell=function(content){
  const current=screen.startsWith('jokbo')?'home':screen==='ox'?'ox':screen.startsWith('exam-')?'exam-library':['era','seasons','chapter-scenes','game','quiz','complete','teaser','history'].includes(screen)?'home':screen;
  const nav=[['home','홈',editorialIcon('home')],['exam-library','기출문제',editorialIcon('book')],['ox','OX',quizIcon],['study','오답노트',editorialIcon('note')],['records','내 기록',editorialIcon('records')]];
  return '<div class="shell editorial-shell app-nav-shell"><aside class="sidebar"><div class="brand">눈떠보니 한국사<small>역사를 살고, 기출로 기억하다</small></div><nav class="nav app-navigation" aria-label="주 메뉴">'+nav.map(([id,label,image])=>'<button data-nav="'+id+'" '+(current===id?'aria-current="page"':'')+' class="'+(current===id?'active':'')+'">'+image+'<span>'+label+'</span></button>').join('')+'</nav></aside><main class="main ed-screen ed-'+screen+'">'+content+'</main>'+(screen==='home'?homeFab:'')+'</div>'+(modal?modalHTML():'');
 };
 const contentBefore=renderContent;
 renderContent=function(){if(screen==='jokbo')return mainPage();if(screen==='jokbo-group')return groupPage();if(screen==='jokbo-detail')return detailPage();if(screen==='jokbo-compare')return comparePage();const html=contentBefore();return screen==='home'?withHomeEntry(html):html;};
 routes.addRoute('jokbo');
 for(const g of D.groups)routes.addRoute('jokbo/group/'+g.id);
 for(const k of D.keywords)routes.addRoute('jokbo/detail/'+k.id);
 for(const c of D.comparisons)routes.addRoute('jokbo/compare/'+c.id);
 // 앞으로 이동할 때만 기록을 쌓고 부모 경로를 남긴다. 화면 안 뒤로가기는 그 기록을 되돌려 시스템 뒤로가기와 같은 결과가 된다.
 const historyObject=()=>typeof globalThis.history==='object'?globalThis.history:null;
 function pushRoute(route,parent){
  routes.writeRoute(route);const h=historyObject();
  try{if(h&&typeof h.replaceState==='function'&&globalThis.location)h.replaceState({...(h.state||{}),appRoute:route,jkParent:parent},'',globalThis.location.href);}catch{}
 }
 function popToParent(parent){const h=historyObject();if(h&&h.state?.jkParent===parent&&h.length>1&&typeof h.back==='function'){h.back();return true;}return false;}
 const applyBefore=routes.applyRoute;
 routes.setApplyRoute(function(route=routes.readRoute()){
  if(route==='jokbo'){restoringScroll=true;screen='jokbo';groupId=null;detailId=null;detailParentGroupId=null;compareId=null;modal=null;render();revealActiveEraTab();restoreListScroll();return route;}
  if(route?.startsWith('jokbo/group/')){const id=decodeURIComponent(route.slice('jokbo/group/'.length)),group=groupById.get(id);if(!group)return applyBefore('jokbo');const returning=screen==='jokbo-detail'&&detailParentGroupId===id;groupId=id;activeEra=group.eraId;detailId=null;detailParentGroupId=null;compareId=null;screen='jokbo-group';modal=null;render();if(returning)restorePageScroll(groupScrollY);else window.scrollTo(0,0);return route;}
  if(route?.startsWith('jokbo/detail/')){detailId=decodeURIComponent(route.slice('jokbo/detail/'.length));const parent=groupId&&groupById.get(groupId)?.keywords.some(k=>k.id===detailId)?groupId:null;detailParentGroupId=parent;screen='jokbo-detail';modal=null;render();window.scrollTo(0,0);return route;}
  if(route?.startsWith('jokbo/compare/')){compareId=decodeURIComponent(route.slice('jokbo/compare/'.length));compareTopic=0;screen='jokbo-compare';modal=null;render();window.scrollTo(0,0);return route;}
  return applyBefore(route);
 });
 function openJokbo(fromHome){saveView();screen='jokbo';groupId=null;detailId=null;detailParentGroupId=null;compareId=null;modal=null;if(fromHome){listScrollY=0;saveView({scrollY:0});}render();revealActiveEraTab();if(fromHome)pushRoute('jokbo','home');else routes.writeRoute('jokbo');restoreListScroll();}
 const navigateBefore=navigate;
 navigate=function(to){if(to==='jokbo'){openJokbo(false);return;}return navigateBefore(to);};
 function selectEra(id,direction=0){
  if(!eraById.has(id))return;activeEra=id;country='all';saveView({scrollY:0});render();revealActiveEraTab();window.scrollTo(0,0);
  const content=document.querySelector('[data-jk-swipe="true"]');
  if(direction&&!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)content?.animate?.([{opacity:.4,transform:'translateX('+(direction>0?36:-36)+'px)'},{opacity:1,transform:'translateX(0)'}],{duration:200,easing:'ease-out'});
 }

 document.addEventListener('click',function(event){
  if(Date.now()<suppressSwipeClickUntil&&event.target.closest('.jk-era-content')){event.preventDefault();event.stopImmediatePropagation();return;}
  const b=event.target.closest('button');if(!b||b.disabled)return;const d=b.dataset;
  if(d.jkOpen!==undefined){event.preventDefault();event.stopImmediatePropagation();openJokbo(true);return;}
  if(d.nav==='jokbo'){event.preventDefault();event.stopImmediatePropagation();navigate('jokbo');return;}
  if(d.jkSearch!==undefined){event.stopImmediatePropagation();searchOpen=!searchOpen;if(!searchOpen)query='';saveView({scrollY:0});render();revealActiveEraTab();setTimeout(()=>document.querySelector('[data-jk-query]')?.focus(),0);return;}
  if(d.jkSearchClear!==undefined){event.stopImmediatePropagation();query='';saveView({scrollY:0});render();revealActiveEraTab();setTimeout(()=>document.querySelector('[data-jk-query]')?.focus(),0);return;}
  if(d.jkEra){event.stopImmediatePropagation();const from=D.eras.findIndex(e=>e.id===activeEra),to=D.eras.findIndex(e=>e.id===d.jkEra);query='';searchOpen=false;selectEra(d.jkEra,d.jkPager!==undefined?Math.sign(to-from):0);return;}
  if(d.jkCountry){event.stopImmediatePropagation();country=d.jkCountry;saveView({scrollY:0});render();revealActiveEraTab();const bar=document.querySelector('.jk-era-content');if(bar&&bar.getBoundingClientRect().top<0)window.scrollTo(0,Math.max(0,bar.getBoundingClientRect().top+pageScrollY()-(document.querySelector('.jk-filterbar')?.offsetHeight||0)));return;}
  if(d.jkMode){event.stopImmediatePropagation();mode=d.jkMode;saveView({scrollY:0});render();revealActiveEraTab();window.scrollTo(0,0);return;}
  if(d.jkDetail){event.stopImmediatePropagation();const from=screen==='jokbo'?'jokbo':screen==='jokbo-group'?'jokbo/group/'+groupId:screen==='jokbo-compare'?'jokbo/compare/'+compareId:'jokbo';if(screen==='jokbo')saveView({scrollY:pageScrollY()});detailParentGroupId=d.jkDetailParent||null;if(detailParentGroupId)groupScrollY=pageScrollY();detailId=d.jkDetail;screen='jokbo-detail';pushRoute('jokbo/detail/'+encodeURIComponent(detailId),from);render();window.scrollTo(0,0);return;}
  if(d.jkGroup){event.stopImmediatePropagation();const group=groupById.get(d.jkGroup);if(group){saveView({scrollY:pageScrollY()});groupId=group.id;groupScrollY=0;detailId=null;detailParentGroupId=null;screen='jokbo-group';pushRoute('jokbo/group/'+encodeURIComponent(groupId),'jokbo');render();window.scrollTo(0,0);}return;}
  if(d.jkSave){event.stopImmediatePropagation();const y=pageScrollY();saved.has(d.jkSave)?saved.delete(d.jkSave):saved.add(d.jkSave);saveKeywords();render();if(screen==='jokbo')revealActiveEraTab();scrollPage(y);return;}
  if(d.jkCompare){event.stopImmediatePropagation();const from=screen==='jokbo-detail'?'jokbo/detail/'+detailId:'jokbo';saveView();compareId=d.jkCompare;compareTopic=0;screen='jokbo-compare';pushRoute('jokbo/compare/'+compareId,from);render();window.scrollTo(0,0);return;}
  if(d.jkCompareTopic!==undefined){event.stopImmediatePropagation();compareTopic=Number(d.jkCompareTopic)||0;render();return;}
  if(d.jkBack){event.stopImmediatePropagation();
   if(d.jkBack==='home'){if(!popToParent('home'))navigateBefore('home');return;}
   if(d.jkBack.startsWith('group:')){const id=d.jkBack.slice('group:'.length);if(popToParent('jokbo/group/'+id))return;groupId=id;detailId=null;detailParentGroupId=null;screen='jokbo-group';routes.writeRoute('jokbo/group/'+encodeURIComponent(groupId),true);render();restorePageScroll(groupScrollY);return;}
   if(screen==='jokbo-compare'&&detailId&&popToParent('jokbo/detail/'+detailId))return;
   if(d.jkBack==='jokbo'){if(popToParent('jokbo'))return;restoringScroll=true;screen='jokbo';groupId=null;detailId=null;detailParentGroupId=null;compareId=null;routes.writeRoute('jokbo',true);render();revealActiveEraTab();restoreListScroll();}return;}
  if(d.jkKeywordExams){event.stopImmediatePropagation();const k=keywordById.get(d.jkKeywordExams);if(k)startExamIds(directExamMatches(k),k.eraId);return;}
  if(d.jkGroupExams){event.stopImmediatePropagation();const group=groupById.get(d.jkGroupExams);if(group)startExamIds(groupExamIds(group),group.eraId);return;}
  if(d.jkEraExams){event.stopImmediatePropagation();startExamIds(eraExamIds(d.jkEraExams).slice(0,20),d.jkEraExams);return;}
 },true);
 // 시대 스와이프: 처음 움직인 방향으로 축을 고정하고, 가로일 때만 카드가 손가락을 따라 움직인다. 세로 스크롤은 시대를 바꾸지 않는다.
 let eraGesture=null,suppressSwipeClickUntil=0;
 const swipeContent=()=>document.querySelector('[data-jk-swipe="true"]');
 function resetDrag(content,animate){if(!content)return;content.classList.remove('is-dragging');if(animate&&content.animate)content.animate([{transform:content.style.transform||'translateX(0)'},{transform:'translateX(0)'}],{duration:160,easing:'ease-out'});content.style.transform='';content.style.opacity='';}
 document.addEventListener('touchstart',event=>{
  eraGesture=null;suppressSwipeClickUntil=0;
  if(screen!=='jokbo'||query.trim()||event.touches.length!==1||!event.target.closest('[data-jk-swipe="true"]'))return;
  const t=event.touches[0];eraGesture={x:t.clientX,y:t.clientY,id:t.identifier,axis:null,era:activeEra};
 },{passive:true});
 document.addEventListener('touchmove',event=>{
  if(!eraGesture)return;if(event.touches.length!==1){resetDrag(swipeContent(),true);eraGesture=null;return;}
  const t=event.touches[0],dx=t.clientX-eraGesture.x,dy=t.clientY-eraGesture.y;
  if(!eraGesture.axis&&Math.max(Math.abs(dx),Math.abs(dy))>10)eraGesture.axis=Math.abs(dx)>Math.abs(dy)*1.35?'x':'y';
  if(eraGesture.axis!=='x')return;
  if(event.cancelable)event.preventDefault();
  const index=D.eras.findIndex(e=>e.id===activeEra),edge=(dx>0&&index===0)||(dx<0&&index===D.eras.length-1),shift=edge?dx*.18:dx*.55,content=swipeContent();
  if(content&&!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches){content.classList.add('is-dragging');content.style.transform='translateX('+shift.toFixed(1)+'px)';content.style.opacity=String(Math.max(.55,1-Math.abs(shift)/520));}
 },{passive:false});
 document.addEventListener('touchcancel',()=>{if(eraGesture)resetDrag(swipeContent(),true);eraGesture=null;},{passive:true});
 document.addEventListener('touchend',event=>{
  const gesture=eraGesture;eraGesture=null;
  if(!gesture||gesture.axis!=='x'||screen!=='jokbo'||query.trim()||activeEra!==gesture.era){if(gesture?.axis==='x')resetDrag(swipeContent(),true);return;}
  const t=Array.from(event.changedTouches).find(t=>t.identifier===gesture.id);if(!t){resetDrag(swipeContent(),true);return;}
  const dx=t.clientX-gesture.x,dy=t.clientY-gesture.y;
  suppressSwipeClickUntil=Date.now()+450;
  if(Math.abs(dx)<56||Math.abs(dx)<Math.abs(dy)*1.35){resetDrag(swipeContent(),true);return;}
  if(event.cancelable)event.preventDefault();
  const index=D.eras.findIndex(e=>e.id===activeEra),next=index+(dx<0?1:-1);
  if(next<0||next>=D.eras.length){resetDrag(swipeContent(),true);return;}
  const previousY=pageScrollY(),oldContent=swipeContent(),filterHeight=document.querySelector('.jk-filterbar')?.offsetHeight||0,contentTop=Math.max(0,oldContent.getBoundingClientRect().top+previousY-filterHeight);
  activeEra=D.eras[next].id;country='all';saveView({scrollY:Math.min(previousY,contentTop)});render();revealActiveEraTab();
  // 이미 내려 본 상태라면 새 시대 카드의 처음이 필터 바로 아래에 오도록 맞춘다.
  restorePageScroll(Math.min(previousY,contentTop));
  const content=swipeContent();
  if(!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)content?.animate?.([{opacity:.45,transform:'translateX('+(dx<0?48:-48)+'px)'},{opacity:1,transform:'translateX(0)'}],{duration:210,easing:'ease-out'});
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
  countries:eraId=>eraCountries(eraId||activeEra),
  state:()=>({screen,activeEra,country:activeCountry(),mode,listScrollY,groupId,groupScrollY,detailId,detailParentGroupId}),
  view:()=>({...readJSON(sessionStore,VIEW_KEY,{})}),
  saved:()=>[...saved],
  search:value=>D.keywords.filter(k=>{const before=query;query=String(value||'');const result=searchMatches(k);query=before;return result;})
 });
})();
