/* Rev.7 story entry layouts. Chapter scripts, scene order, gates and replay remain owned by the existing runtime. */
(function(){
 'use strict';
 if(!globalThis.REV7_OX_VIEWS||!globalThis.CHAPTER_ACCESS)return;
 const routes=globalThis.REV7_OX_VIEWS;
 const icon=name=>'<span class="r7-icon" aria-hidden="true"><img src="media/rev7/'+name+'.svg" alt=""></span>';
 let sceneChapterId=null;
 routes.addRoute('seasons');routes.addRoute('chapter-scenes');
  for(const era of LEARNING_ERAS){routes.addRoute('era/'+encodeURIComponent(era.id));routes.addRoute('era/'+encodeURIComponent(era.id)+'/chapters');}
 const originalEras=eras,originalChapterDetail=chapterDetailModal;
 const sceneIds=id=>chapterScenes(id).map(scene=>scene.sceneId);
 const resumeFor=id=>seasonRun(eraInfo(chapterEra(id)));
 function appbar(title,attrs){return '<header class="r7-appbar"><button '+attrs+' aria-label="뒤로 가기">'+icon('back')+'</button><h1>'+esc(title)+'</h1><span></span></header>';}
 function seasonSelect(){
  /* Rev.8 S-01: one grouped list — thumbnail · SEASON label · title · short meta · progress · one status badge. */
  return '<section class="r7-page r7-season-select" data-figma-frame="S-01">'+appbar('시대별 스토리','data-nav="home"')+'<header class="r7-timeline-heading"><small class="rv8-sr">THE TIMELINE</small><p>시대를 골라 그 시대 사람으로 살아보세요.</p></header><div class="r7-timeline">'+LEARNING_ERAS.slice().sort((a,b)=>a.order-b.order).map(e=>{
   const progress=eraProgress(e.id),started=Boolean(seasonRun(e)?.started),label=!e.available?'준비 중':progress>=100?'완료':started?'진행 '+progress+'%':'새 시즌';
   const tone=!e.available?'idle-soft':progress>=100?'success':started?'brand':'neutral',badge=!e.available?'준비 중':progress>=100?'완료':started?'진행 중':'학습 전';
   const count=e.available?eraChapters(e.id).length:0,meta=esc(e.years)+(count?' · '+count+'챕터':e.available?'':' · 준비 중');
   return '<button class="r7-season-row'+(e.available?'':' is-soon')+'" '+(e.available?'data-era-open="'+e.id+'"':'data-r7-era-preview="'+e.id+'"')+' aria-label="눈떠보니 '+esc(e.name)+' · '+esc(label)+'">'+(e.bannerAsset?'<img class="r7-season-thumb" src="'+esc(e.bannerAsset)+'" alt="" loading="lazy">':'<span class="r7-season-thumb r7-season-placeholder" aria-hidden="true">'+esc(e.placeholderMark||'')+'</span>')+'<span class="r7-season-copy"><span class="rv8-season-kicker"><small>SEASON '+String(e.order).padStart(2,'0')+'</small><em class="rv8-sr">'+label+'</em></span><span class="rv8-season-name">눈떠보니 <b>'+esc(e.name)+'</b></span><span class="rv8-season-meta">'+meta+'</span>'+(started&&e.available?'<span class="rv8-season-progress" role="img" aria-label="진행률 '+progress+'%"><i style="width:'+progress+'%"></i></span>':'')+'<p class="rv8-sr">'+esc(e.description)+'</p></span><span class="rv8-badge rv8-badge-'+tone+'" aria-hidden="true">'+badge+'</span></button>';
  }).join('')+'</div></section>';
 }
 eras=function(){
  const e=eraInfo(selectedEra),chapters=eraChapters(e.id),r=seasonRun(e),ch=CHAPTERS[r?.currentChapter],scene=STORIES[r?.pending?.sourceSceneId||r?.storyId],progress=eraProgress(e.id);
  if(!e.available)return '<section class="r7-page r7-season-coming" data-figma-frame="S-03">'+appbar(e.title||'눈떠보니 '+e.name,'data-r7-seasons')+'<div class="r7-coming-art">'+(e.bannerAsset?'<img src="'+esc(e.bannerAsset)+'" alt="">':'<span>'+esc(e.placeholderMark||e.name)+'</span>')+'</div><div class="r7-empty"><h2>아직 준비 중인 시즌이에요</h2><p>'+esc(e.description)+'</p></div><button class="r7-primary" data-r7-seasons>다른 시즌 둘러보기</button></section>';
  const stat=(label,value,unit)=>'<div><small>'+label+'</small><strong>'+value+'<em>'+unit+'</em></strong></div>';
  const connected=eraQuestions(e.id).filter(isVerifiedOfficialQuestion).length;
  const chaptersHTML=chapters.map(info=>{
   const status=chapterStatus(info.chapterId),pct=chapterProgress(info.chapterId),started=Boolean(resumeFor(info.chapterId)?.started&&resumeFor(info.chapterId).currentChapter===info.chapterId),complete=meta().completedChapters.includes(info.chapterId);
   const label=!info.implemented?'준비 중':status==='LOCKED'?'잠금':complete?'완료':started?'진행 중 · '+pct+'%':'시작하기';
   return '<button class="r7-chapter-row" data-chapter="'+esc(info.chapterId)+'"><span class="r7-chapter-number">'+String(info.number).padStart(2,'0')+'</span><span><b>'+esc(info.title)+'</b><small>'+esc(editorialChapterYears(info))+' · '+sceneIds(info.chapterId).length+'장면</small></span><em class="'+(complete?'complete':'')+'">'+label+'</em></button>';
  }).join('');
  const inPrologue=Boolean(scene?.isPrologue),currentSceneIds=inPrologue&&globalThis.PROTO_REVISION_RUNTIME?globalThis.PROTO_REVISION_RUNTIME.prologueSceneIds:ch?sceneIds(ch.chapterId):[];
  const index=ch?Math.max(1,currentSceneIds.indexOf(r?.storyId)+1):1;
  const resumeSection=inPrologue?'원삼국 프롤로그':ch?'CH.'+ch.number+' '+esc(ch.title):'';
  return '<section class="r7-page r7-era-view" data-figma-frame="S-02"><div class="r7-era-hero">'+(e.bannerAsset?'<img src="'+esc(e.bannerAsset)+'" alt="">':'')+'<div class="r7-era-shade"></div><button class="r7-era-thumbnail" data-r7-era-chapters="'+e.id+'" aria-label="'+esc(e.name)+' 챕터 목록 보기"></button><button class="r7-era-back" data-r7-seasons aria-label="시대 선택으로">'+icon('back')+'</button><div><small>SEASON '+String(e.order).padStart(2,'0')+'</small><h1>'+esc(e.name)+'</h1><p>'+esc(e.years)+' · '+esc(e.description)+'</p><span class="r7-thumbnail-hint">챕터 목록 보기 ›</span></div></div><div class="r7-metrics r7-era-metrics">'+stat('진행률',progress,'%')+stat('완료 챕터',chapters.filter(info=>meta().completedChapters.includes(info.chapterId)).length,' / '+chapters.length)+stat('연결 기출',connected,'문항')+'</div>'
   +'<button class="r7-resume r7-era-resume" data-era-resume="'+e.id+'"><span><small>'+(r?.started&&ch?'이어서 · '+resumeSection:'새로운 이야기')+'</small><b>'+(r?.started&&ch?'장면 '+index+' / '+currentSceneIds.length+' · '+esc(scene?.title||ch.title):'이야기 시작하기')+'</b></span><span class="r7-era-play">▷</span></button><div class="r7-tabs" role="tablist" aria-label="시대 학습"><button role="tab" data-era-tab="chapters" aria-selected="'+(eraTab!=='exams')+'">챕터</button><button role="tab" data-era-tab="exams" aria-selected="'+(eraTab==='exams')+'">기출 모음</button></div>'
   +(eraTab==='exams'?eraExamList(e.id):'<div class="r7-chapter-list" id="r7-era-chapters" tabindex="-1" aria-label="'+esc(e.name)+' 챕터 목록">'+chaptersHTML+'</div>')+'<details class="r7-legacy"><summary>핵심 개념과 학습 메뉴</summary>'+originalEras()+'</details></section>';
 };
 chapterDetailModal=function(id){
  const info=CHAPTERS[id];if(!info)return originalChapterDetail(id);
  const ids=sceneIds(id),r=resumeFor(id),index=r?.currentChapter===id?Math.max(1,ids.indexOf(r.storyId)+1):1,complete=meta().completedChapters.includes(id);
  const existing=originalChapterDetail(id),actions=(existing.match(/<button[^>]*data-action="(?:start-chapter|continue-chapter|restart-current|request-replay|view-chapter-result)"[^>]*>[\s\S]*?<\/button>/g)||[]).join('').replace('이어서 플레이','이어하기 · 장면 '+index);
  return '<div class="modal-overlay chapter-sheet-overlay r7-chapter-overlay"><section class="modal chapter-sheet r7-chapter-sheet" role="dialog" aria-modal="true" aria-labelledby="r7-chapter-title"><div class="sheet-handle"></div><header><small>CHAPTER '+String(info.number).padStart(2,'0')+'</small><span>'+(!info.implemented?'준비 중':complete?'완료':r?.started&&r.currentChapter===id?'진행 중':'시작 전')+'</span><button class="close" data-action="close" aria-label="닫기">×</button></header><h2 id="r7-chapter-title">'+esc(info.title)+'</h2><p>'+esc(editorialChapterYears(info))+' · '+esc(info.subtitle||'')+'</p><div class="r7-chapter-stats"><div><small>장면 진행</small><b>'+index+' / '+ids.length+'</b></div><div><small>연결 기출</small><b>'+chapterQuestions(id).filter(isVerifiedOfficialQuestion).length+'문항</b></div><div><small>예상 시간</small><b>기록 없음</b></div></div><button class="r7-scene-link" data-r7-chapter-scenes="'+esc(id)+'">장면 목록 '+icon('chevron')+'</button><div class="r7-chapter-actions">'+actions+'</div></section></div>';
 };
 function scenesPage(){
  const id=sceneChapterId||run().currentChapter,info=CHAPTERS[id],ids=sceneIds(id);if(!info)return seasonSelect();
  const r=resumeFor(id),index=r?.currentChapter===id?Math.max(0,ids.indexOf(r.storyId)):0,visited=new Set(r?.visited||[]);
  return '<section class="r7-page r7-scenes" data-figma-frame="S-04B">'+appbar('CH.'+String(info.number).padStart(2,'0'),'data-r7-scenes-back')+'<img class="r7-scenes-art" src="'+esc(info.thumbnail)+'" alt=""><h1>'+esc(info.title)+'</h1><p>'+esc(info.subtitle||'')+'</p><ol>'+ids.map((sceneId,i)=>'<li '+(i===index?'aria-current="step"':'')+'><span>'+String(i+1)+'</span><div><b>'+esc(STORIES[sceneId].title||'장면 '+(i+1))+'</b><small>'+(visited.has(sceneId)?'완료':i===index?'여기서 이어 읽어요':'아직 읽지 않은 장면')+'</small></div></li>').join('')+'</ol><button class="r7-primary" data-r7-chapter-continue="'+esc(id)+'">'+(r?.started&&r.currentChapter===id?'장면 '+(index+1)+'부터 이어 읽기':'챕터 시작하기')+'</button></section>';
 }
 const contentBefore=renderContent;
 function showChapterList(id,write=true){selectedEra=id;eraTab='chapters';screen='era';modal=null;if(write)routes.writeRoute('era/'+encodeURIComponent(id)+'/chapters');render();document.querySelector('#r7-era-chapters')?.scrollIntoView?.({block:'start'});document.querySelector('#r7-era-chapters')?.focus?.({preventScroll:true});}
 renderContent=function(){if(screen==='seasons')return seasonSelect();if(screen==='chapter-scenes')return scenesPage();return contentBefore();};
 document.addEventListener('click',function(event){
  const button=event.target.closest('button');if(!button)return;const d=button.dataset;
  if(d.r7EraChapters){event.stopImmediatePropagation();showChapterList(d.r7EraChapters);return;}
  if('r7Seasons' in d||d.nav==='seasons'){event.stopImmediatePropagation();screen='seasons';modal=null;routes.writeRoute('seasons');render();window.scrollTo(0,0);return;}
  if(d.r7EraPreview){event.stopImmediatePropagation();selectedEra=d.r7EraPreview;screen='era';modal=null;routes.writeRoute('era/'+encodeURIComponent(selectedEra));render();window.scrollTo(0,0);return;}
  if(d.r7ChapterScenes){event.stopImmediatePropagation();sceneChapterId=d.r7ChapterScenes;screen='chapter-scenes';modal=null;const route='chapter-scenes/'+encodeURIComponent(sceneChapterId);routes.addRoute(route);routes.writeRoute(route);render();window.scrollTo(0,0);return;}
  if('r7ScenesBack' in d){event.stopImmediatePropagation();selectedEra=chapterEra(sceneChapterId||run().currentChapter);screen='era';modal=null;routes.writeRoute('era/'+encodeURIComponent(selectedEra));render();return;}
  if(d.r7ChapterContinue){event.stopImmediatePropagation();const r=resumeFor(d.r7ChapterContinue);if(r?.started&&r.currentChapter===d.r7ChapterContinue)resumeEra(chapterEra(d.r7ChapterContinue));else CHAPTER_ACCESS.begin(d.r7ChapterContinue);return;}
 },true);
 const applyBefore=routes.applyRoute;
 routes.setApplyRoute(function(route=routes.readRoute()){
  const listRoute=/^era\/([^/]+)\/chapters$/.exec(route||'');if(listRoute){showChapterList(decodeURIComponent(listRoute[1]),false);return route;}
  if(route?.startsWith('era/')){selectedEra=decodeURIComponent(route.slice(4));screen='era';modal=null;render();window.scrollTo(0,0);return route;}
  if(route?.startsWith('chapter-scenes/')){sceneChapterId=decodeURIComponent(route.slice(15));screen='chapter-scenes';modal=null;render();window.scrollTo(0,0);return route;}
  return applyBefore(route);
 });
 const navigateBefore=navigate;
 navigate=function(to){const result=navigateBefore(to);if(to==='era')routes.writeRoute('era/'+encodeURIComponent(selectedEra));if(to==='seasons')routes.writeRoute('seasons');return result;};
 const initialRoute=(globalThis.location?.hash||'').replace(/^#/,'');
 if(initialRoute==='seasons'){screen='seasons';}
 if(initialRoute.startsWith('era/')){selectedEra=decodeURIComponent(initialRoute.slice(4).split('/')[0]);screen='era';if(initialRoute.endsWith('/chapters'))eraTab='chapters';}
 if(initialRoute.startsWith('chapter-scenes/')){sceneChapterId=decodeURIComponent(initialRoute.slice(15));routes.addRoute(initialRoute);screen='chapter-scenes';}
 globalThis.REV7_STORY_VIEWS_READY=true;
 render();
})();
