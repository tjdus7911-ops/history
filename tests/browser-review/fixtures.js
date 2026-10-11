/* Preview-only scenario controls exercise the shipped renderer/controller. */
(() => {
  const scenario=new URLSearchParams(location.search).get('case')||'menus';
  function diagnostic(){
    const game=document.querySelector('.conversation-game'),question=document.querySelector('.editorial-quiz'),source=typeof run==='function'?STORIES[run().pending?.sourceSceneId||run().storyId]:null;
    const rect=game?.getBoundingClientRect(),text=[`프레임 ${innerWidth}×${innerHeight}`,source?.sceneId||'',game?'대화':question?'기출':screen,rect?`게임 ${Math.round(rect.width)}×${Math.round(rect.height)}`:'',`가로 넘침 ${document.documentElement.scrollWidth>innerWidth+1?'있음':'없음'}`,`대사 위치 ${typeof run==='function'?run().dialogueCursor||1:1}`].filter(Boolean).join(' · ');
    parent.postMessage({kind:'history-ui-review',text},location.origin);
  }
  function chooseScene(era,sceneId,kind='npc'){
    const source=STORIES[sceneId];if(!source)throw Error('Unknown review scene '+sceneId);
    state.mainRun=null;state.run=INITIAL_RUN(source.chapterId);run().started=true;run().storyId=sceneId;
    if(era==='three-kingdoms')THREE_SAVE_V3.identifyRun(run(),true);
    if(era==='proto-kingdoms'&&globalThis.PROTO_SAVE_V3)PROTO_SAVE_V3.identifyRun(run(),true);
    run().storyId=sceneId;run().dialogueSceneId=sceneId;selectedEra=era;meta().selectedLearningEra=era;screen='game';modal=null;
    const entries=source.dialogues;
    let index=kind==='player'?entries.findIndex(e=>e.speakerType==='player'):entries.findIndex(e=>e.speakerType==='npc');
    if(kind==='long')index=entries.reduce((best,e,i)=>e.dialogue.length>entries[best].dialogue.length?i:best,0);
    if(kind==='eulpaso'||kind==='yeonwoo')index=entries.findIndex(e=>e.characterName?.includes(kind==='eulpaso'?'을파소':'연우'));
    if(era==='three-kingdoms'){
      const api=THREE_COMPLETE_ACTIONS,book=api.book(),order=[...THREE_STORY_RUNTIME.sources.keys()],position=order.indexOf(sceneId);
      book.readSceneIds=order.slice(0,Math.max(0,position));
      api.switchPhase(source,kind==='choice'?'choice':'main');
      if(kind==='choice')index=entries.length-1;
    }else if(era==='proto-kingdoms'&&globalThis.PROTO_REVISION_ACTIONS){
      const api=PROTO_REVISION_ACTIONS,book=api.book(),order=PROTO_REVISION_RUNTIME.order,position=order.indexOf(sceneId);
      book.readSceneIds=order.slice(0,Math.max(0,position));book.readLineIds=book.readSceneIds.flatMap(id=>{const s=PROTO_REVISION_RUNTIME.sources.get(id);return [...s.main,...s.join].map(l=>l.lineId);});
      if(kind==='choice'){book.readLineIds.push(...source.dialogues.map(l=>l.lineId));api.switchPhase(source,'choice');index=entries.length-1;}else api.switchPhase(source,'main');
    }else if(kind==='choice')index=entries.length-1;
    run().dialogueCursor=Math.max(1,index+1);save();render();
  }
  function initial(){
    if(scenario==='menus')return;
    if(scenario.startsWith('three-')){
      const scenes=Object.values(STORIES).filter(s=>s.threeStoryVersion===3&&s.storyActive!==false);
      if(scenario==='three-prologue'){resumeEra('three-kingdoms');return;}
      if(scenario==='three-long-line'){const source=scenes.reduce((a,b)=>Math.max(...b.dialogues.map(l=>l.dialogue.length))>Math.max(...a.dialogues.map(l=>l.dialogue.length))?b:a);chooseScene('three-kingdoms',source.sceneId,'long');return;}
      if(scenario==='three-long-choice'){const source=scenes.filter(s=>s.choices?.length).reduce((a,b)=>b.choices.reduce((n,c)=>n+c.label.length,0)>a.choices.reduce((n,c)=>n+c.label.length,0)?b:a);chooseScene('three-kingdoms',source.sceneId,'choice');return;}
      const mapping={'three-yeonwoo':['THR-C01-S01','yeonwoo'],'three-eulpaso':['THR-C01-S04','eulpaso'],'three-npc-switch':['THR-C01-S06','npc'],'three-choice-quiz':['THR-C01-S06','choice']};const [id,kind]=mapping[scenario];chooseScene('three-kingdoms',id,kind);return;
    }
    if(scenario.startsWith('proto-')){const mapping={'proto-player':['proto_ch00_s1','player'],'proto-npc':['proto_ch00_s2','npc'],'proto-choice':['proto_ch00_s2','choice'],'proto-choice-quiz':['proto_ch02_s3','choice']};const [id,kind]=mapping[scenario];chooseScene('proto-kingdoms',id,kind);return;}
    if(scenario==='goryeo-player'){chooseScene('goryeo','prologue','player');return;}
    if(scenario==='goryeo-npc'){chooseScene('goryeo','house','npc');return;}
    if(scenario==='joseon-npc'){const s=Object.values(STORIES).find(s=>s.eraId==='joseon'&&s.storyActive!==false&&s.dialogues?.some(l=>l.speakerType==='npc'));chooseScene('joseon',s.sceneId,'npc');}
  }
  try{
    if(!localStorage.getItem('review-initialized')){initial();localStorage.setItem('review-initialized','1');}
    else if(scenario!=='menus')resumeEra(scenario.startsWith('three-')?'three-kingdoms':scenario.startsWith('proto-')?'proto-kingdoms':scenario.startsWith('joseon-')?'joseon':'goryeo');
    new MutationObserver(diagnostic).observe(document.querySelector('#app'),{subtree:true,childList:true});window.addEventListener('resize',diagnostic);diagnostic();
  }catch(error){parent.postMessage({kind:'history-ui-review',text:'검증 장면 오류: '+error.message},location.origin);throw error;}
})();
