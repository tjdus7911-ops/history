/* Reader-facing record book for the complete Three manuscript. */
if (globalThis.CORE_APP_READY === true && globalThis.EDITORIAL_UI_READY === true && globalThis.THREE_STORY_RUNTIME?.version === 3) {
  const runtime = globalThis.THREE_STORY_RUNTIME, actions = globalThis.THREE_COMPLETE_ACTIONS;
  const manuscript = globalThis.THREE_STORY_SCRIPT;
  const beforeModal = modalHTML;
  function questionRows() {
    actions.unlockLearnedQuestions();
    const value = actions.book(), read = new Set(value.readSceneIds), byId = new Map();
    for (const row of [...runtime.exams.schedule, ...runtime.exams.additionalCandidates]) {
      if (read.has(row.quizAfterSceneId)) byId.set(row.officialQuestionId, row);
    }
    return [...byId.values()].sort((a,b)=>runtime.order.indexOf(a.quizAfterSceneId)-runtime.order.indexOf(b.quizAfterSceneId));
  }
  function sceneTranscript(source) {
    const index = actions.book().choiceBySceneId[source.sceneId];
    return [...source.main, ...(Number.isInteger(index) ? [source.choices[index].spokenLine,...source.choices[index].reply] : []), ...source.join];
  }
  function recordBook() {
    const value = actions.book(), tab = ['scenes','questions','notes'].includes(modal.tab) ? modal.tab : 'scenes';
    const read = new Set(value.readSceneIds), mainRead = manuscript.chapters.flatMap(ch=>ch.scenes).filter(s=>read.has(s.sceneId));
    const questions = questionRows();
    const mnemonics = manuscript.mnemonics.filter(item=>item.sceneIds.every(id=>read.has(id)));
    const tabs = [['scenes','읽은 이야기'],['questions','기출 복습'],['notes','암기 기록']];
    let content = '';
    if (tab === 'scenes') {
      const source = runtime.sources.get(modal.sceneId);
      if (source && read.has(source.sceneId)) {
        content = '<button class="text-btn" data-three-book-tab="scenes">‹ 장면 목록</button><h3>'+esc(source.sceneTitle)+'</h3><div class="three-read-transcript">'+sceneTranscript(source).map(line=>'<article class="'+(line.kind==='record'?'record':'')+'"><b>'+esc(line.speaker)+'</b><p>'+esc(line.text)+'</p></article>').join('')+'</div>';
      } else {
        content = '<p>읽은 장면 '+mainRead.length+' / 215 · 선택했던 대사와 함께 다시 읽을 수 있어요.</p>'+(mainRead.length?manuscript.chapters.map(ch=>{
          const scenes = ch.scenes.filter(scene=>read.has(scene.sceneId));
          return scenes.length?'<details class="three-book-chapter"><summary>CH.'+String(ch.number).padStart(2,'0')+' '+esc(ch.title)+' · '+scenes.length+'장면</summary>'+scenes.map(scene=>'<button class="three-book-row" data-three-book-scene="'+scene.sceneId+'"><span>'+scene.number+'. '+esc(scene.sceneTitle)+'</span><b>›</b></button>').join('')+'</details>':'';
        }).join(''):'<p class="three-empty">이야기를 읽으면 장면의 기록이 여기에 남습니다.</p>');
      }
    } else if (tab === 'questions') {
      const playable = Boolean(STORIES[run().storyId]?.threeStoryVersion === 3) && !run().activeQuestionId && !run().threeCheckpoint;
      content = '<p>배운 장면의 문제 '+questions.length+'개 · 풀이를 마친 문제 '+value.answeredQuestionIds.length+'개</p><p>같은 문항은 한 번만 모입니다. 다시 풀 문제를 직접 골라 주세요.</p>'+(questions.length?questions.map(row=>{
        const q = runtime.questionByOfficialId.get(row.officialQuestionId), answered = value.answeredQuestionIds.includes(row.officialQuestionId);
        return '<article class="three-book-question"><div><b>'+esc(q.threeExam.label)+'</b><small>'+esc(runtime.sources.get(row.quizAfterSceneId).sceneTitle)+' · '+(answered?'풀이 기록 있음':'추가로 풀 수 있는 문제')+'</small></div><button class="secondary" data-three-review="'+q.officialQuestionId+'" data-three-placement="'+row.id+'" '+(playable?'':'disabled')+'>'+(answered?'다시 풀기':'풀어 보기')+'</button></article>';
      }).join(''):'<p class="three-empty">기출에 필요한 장면을 읽은 뒤 문제가 열립니다.</p>')+(!playable&&questions.length?'<p>이야기 화면으로 돌아오면 선택 복습을 시작할 수 있어요.</p>':'');
    } else if (tab === 'notes') {
      content = '<p>배운 내용을 모은 암기 기록 '+mnemonics.length+' / '+manuscript.mnemonics.length+'</p>'+mnemonics.map(item=>'<article class="three-mnemonic"><h3>'+esc(item.title)+'</h3><blockquote>'+esc(item.originalText)+'</blockquote><p>'+esc(item.explanation)+'</p></article>').join('')+(mnemonics.length?'':'<p class="three-empty">연결된 장면을 모두 읽으면 원래의 암기 문구와 설명이 열립니다.</p>');
    }
    return '<div class="modal-overlay three-modal-overlay"><section class="modal three-recordbook-modal" role="dialog" aria-modal="true" aria-labelledby="three-book-title"><header><div><small>서아의 기록</small><h2 id="three-book-title">함께 지나온 시간</h2></div><button data-action="close">닫기</button></header><nav class="three-book-tabs" aria-label="기록책">'+tabs.map(([id,label])=>'<button data-three-book-tab="'+id+'" aria-pressed="'+(tab===id)+'">'+label+'</button>').join('')+'</nav><div class="three-book-content">'+content+'</div></section></div>';
  }
  modalHTML = function() {
    if (modal?.type === 'three-recordbook') return recordBook();
    return beforeModal();
  };
  const beforeHero = heroContent;
  heroContent = function(era, detail = false) {
    let html = beforeHero(era,detail); if (era.id !== runtime.eraId) return html;
    return html.replace('진행률','읽은 진행도');
  };
  const beforeYears = editorialChapterYears;
  editorialChapterYears = function(chapter) {
    if(chapter.threeStoryVersion !== 3) return beforeYears(chapter);
    const dates=chapter.sceneIds.map(id=>runtime.sources.get(id)?.year||'');
    const years=dates.flatMap(date=>[...String(date).replace(/\([^)]*\)/g,'').matchAll(/(\d{3,4})년/g)].map(match=>Number(match[1])));
    if(!years.length) return globalThis.THREE_COMPACT_DATE(dates[0]);
    const first=Math.min(...years),last=Math.max(...years);
    return first===last?first+'년':first+'–'+last+'년';
  };
  const beforeChapterDetail = chapterDetailModal;
  chapterDetailModal = function(id) {
    const html=beforeChapterDetail(id),chapter=CHAPTERS[id];
    if(chapter?.threeStoryVersion !== 3) return html;
    return html.replace('<h2>'+esc(chapter.subtitle)+'</h2>','<h2>'+esc(chapter.title)+'</h2><p>'+esc(editorialChapterYears(chapter))+'</p>');
  };
  const beforeTeaser = teaser;
  teaser = function() {
    const html=beforeTeaser(),chapter=CHAPTERS[run().currentChapter];
    if(chapter?.threeStoryVersion !== 3) return html;
    const order=eraChapters(runtime.eraId),next=order[order.findIndex(item=>item.chapterId===chapter.chapterId)+1];
    return html.replace(/(<h2>[\s\S]*?<\/h2>)<p>[\s\S]*?<\/p>/,'$1<p>'+esc(editorialChapterYears(next||chapter))+'</p>');
  };
  function archiveNotice() {
    const notices = globalThis.THREE_ERA_ISOLATION?.archiveNotices?.() || [];
    if (!notices.length || actions.book().archiveNoticeDismissed) return '';
    return '<aside class="three-save-notice" role="status"><h2>삼국 이야기가 새로 이어집니다.</h2><p>이전 초안의 진행 기록은 보관했습니다. 새 23챕터는 프롤로그에서 시작하고, 다른 시대의 이어하기는 그대로 유지됩니다.</p><button class="secondary" data-action="three-dismiss-archive">확인했어요</button></aside>';
  }
  const beforeEras = eras;
  eras = function() {
    const html = beforeEras(); return selectedEra === runtime.eraId ? archiveNotice()+html : html;
  };
  document.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button || button.disabled) return;
    const data = button.dataset;
    if (data.action === 'three-recordbook') {
      event.stopImmediatePropagation(); finishOpeningTyping(); modal = {type:'three-recordbook',tab:'scenes'}; save(); render();
    } else if (data.threeBookTab !== undefined) {
      event.stopImmediatePropagation(); modal = {type:'three-recordbook',tab:data.threeBookTab}; render();
    } else if (data.threeBookScene) {
      event.stopImmediatePropagation(); if (!actions.book().readSceneIds.includes(data.threeBookScene)) return;
      modal = {type:'three-recordbook',tab:'scenes',sceneId:data.threeBookScene}; render();
    } else if (data.threeReview) {
      event.stopImmediatePropagation(); actions.startReview(data.threeReview,data.threePlacement);
    } else if (data.action === 'three-dismiss-archive') {
      event.stopImmediatePropagation(); actions.book().archiveNoticeDismissed = true; save(); render();
    }
  }, true);
  globalThis.THREE_SERVICE_ENTRY_READY = true;
  globalThis.THREE_RECORD_BOOK = {questionRows,sceneTranscript};
  render();
}
