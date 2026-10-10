/* Official-shell presentation for playable but explicitly unfinished Three content. */
if(globalThis.CORE_APP_READY===true&&globalThis.THREE_STORY_RUNTIME){
  const runtime=globalThis.THREE_STORY_RUNTIME;
  function sceneStatus(id){
    const source=runtime.sources.get(id),art=globalThis.THREE_ART_MANIFEST;
    const production=source.production;
    const questions=QUESTIONS.filter(q=>q.threeStoryVersion===2&&q.relatedSceneId===id);
    const background=!!art.backgrounds[id]?.visualFileReview,npc=!!art.characters[source.npcId]?.visualFileReview;
    const expanded=production.dialogue==='expanded-needs-editorial-review'||production.dialogue==='ready';
    const complete=production.dialogue==='ready'&&background&&npc&&art.characters[source.npcId].expressionVariantsReady&&
      questions.length>=2&&production.desktopQA==='passed'&&production.mobileQA==='passed';
    return {id,title:source.title,chapterId:source.chapterId,complete,expanded,background,npc,questionCount:questions.length,
      label:complete?'완성':'제작 중',missing:[...(production.dialogue!=='ready'?['대사 검수']:[]),...(!background?['배경']:[]),
        ...(!npc?['인물']:[]),...(questions.length<2?['추가 기출']:[]),...(production.desktopQA!=='passed'||production.mobileQA!=='passed'?['화면 검증']:[])]};
  }
  const statuses=()=>[...runtime.sources.keys()].map(sceneStatus);
  const beforeHero=heroContent;
  heroContent=function(era,detail=false){
    const html=beforeHero(era,detail);if(era.id!=='three-kingdoms')return html;
    return html.replace('<em class="available">공개</em>','<em class="available">제작 중</em>').replace('진행률','읽은 진행도')
      .replace('<p class="era-description">','<p class="era-description">90씬 초안 공개 · 완성 '+statuses().filter(row=>row.complete).length+'씬. ');
  };
  const beforeRow=editorialChapterRow;
  editorialChapterRow=function(chapter){
    let html=beforeRow(chapter);if(chapter.threeStoryVersion!==2)return html;
    const rows=statuses().filter(row=>row.chapterId===chapter.chapterId),ready=rows.filter(row=>row.complete).length;
    if(!chapter.thumbnail)html=html.replace(/<img[^>]*>/,'<span class="three-card-art-pending">배경 준비 중</span>');
    return html.replace('</b>','</b><small class="three-content-state">'+(ready===rows.length?'콘텐츠 완성':`제작 중 · 완성 ${ready}/${rows.length}씬`)+'</small>')
      .replace('aria-label="완료"','aria-label="초안 읽음"');
  };
  const beforeEras=eras;
  eras=function(){
    const html=beforeEras();if(selectedEra!=='three-kingdoms')return html;
    const rows=statuses(),complete=rows.filter(row=>row.complete).length;
    return html+`<details class="three-content-report"><summary>90씬 제작 상태 · 완성 ${complete} / 미완성 ${90-complete}</summary><p>챕터 진행률은 읽은 위치입니다. 콘텐츠 제작 완료율과 다릅니다.</p><ul>${rows.map(row=>`<li data-three-scene-status="${row.id}"><b>CH.${CHAPTERS[row.chapterId].number} ${esc(row.title)}</b><span>${row.label} · ${row.expanded?'대사 보강됨':'대사 초안'} · ${esc(row.missing.join('·'))} 준비 중</span></li>`).join('')}</ul></details>`;
  };
  const beforeGame=game;
  game=function(){
    const html=beforeGame(),id=run().pending?.sourceSceneId||run().storyId;
    if(!runtime.sources.has(id))return html;
    const row=sceneStatus(id),notice=`<aside class="three-scene-notice" role="status"><strong>삼국시대 · ${row.label}</strong><span>${row.expanded?'대사 보강됨':'대사 초안'} · ${row.background?'배경 연결됨':'배경 준비 중'} · ${row.npc?'인물 연결됨':'인물 준비 중'} · 검증 기출 ${row.questionCount}문항</span><small>미완성 장면을 플레이 중입니다. 진행 내용은 별도로 저장됩니다.</small></aside>`;
    return notice+html.replace(/<p role="status" class="three-preview-notice">.*?<\/p>/,'');
  };
  const beforeComplete=complete;
  complete=function(){
    const id=resultChapterId||run().currentChapter;
    if(CHAPTERS[id]?.threeStoryVersion!==2)return beforeComplete();
    return `<section class="complete ancient-complete"><div class="eyebrow">삼국시대 · 제작 중</div><h1>${esc(CHAPTERS[id].title)}</h1><p>이 챕터의 초안 3씬을 읽었습니다. 콘텐츠 제작 완료를 의미하지 않습니다.</p><p>추가 기출·이미지·대사 검수·화면 검증이 남아 있습니다.</p>${resultFooter(id)}</section>`;
  };
  globalThis.THREE_CONTENT_STATUS={scene:sceneStatus,all:statuses};
  globalThis.THREE_SERVICE_ENTRY_READY=true;
  render();
}
