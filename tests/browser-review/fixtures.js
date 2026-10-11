/* Preview-only scenario controls exercise the shipped renderer/controller. */
(() => {
  const scenario=new URLSearchParams(location.search).get('case')||'menus';
  function diagnostic(){
    const game=document.querySelector('.conversation-game'),question=document.querySelector('.editorial-quiz'),source=typeof run==='function'?STORIES[run().pending?.sourceSceneId||run().storyId]:null;
    const rect=game?.getBoundingClientRect(),text=[`프레임 ${innerWidth}×${innerHeight}`,source?.sceneId||'',game?'대화':question?'기출':screen,rect?`게임 ${Math.round(rect.width)}×${Math.round(rect.height)}`:'',`가로 넘침 ${document.documentElement.scrollWidth>innerWidth+1?'있음':'없음'}`,`대사 위치 ${typeof run==='function'?run().dialogueCursor||1:1}`].filter(Boolean).join(' · ');
    parent.postMessage({kind:'history-ui-review',text},location.origin);
  }
  function chooseScene(era,sceneId,kind='npc',details={}){
    const source=STORIES[sceneId];if(!source)throw Error('Unknown review scene '+sceneId);
    const chapterId=era==='three-kingdoms'&&source.isPrologue?THREE_SAVE_V3.firstChapterId:source.chapterId;
    state.mainRun=null;state.run=INITIAL_RUN(chapterId);run().started=true;run().storyId=sceneId;
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
      for(const [id,choiceIndex] of Object.entries(details.savedChoices||{})){
        if(!Number.isInteger(choiceIndex)||!STORIES[id]?.choices?.[choiceIndex])throw Error('Unknown review choice '+id);
        book.choiceBySceneId[id]=choiceIndex;
        run().threeStoryState.scenes[id]={phase:'finished',choiceIndex};
      }
      if(kind==='branch'||kind==='join'){
        api.switchPhase(source,'choice');
        if(!api.choose(details.choiceIndex))throw Error('Unknown review branch '+sceneId);
        if(kind==='join'){run().dialogueCursor=api.phaseEntries(source).length;api.advance();}
        index=0;
      }else{
        api.switchPhase(source,kind==='choice'?'choice':'main');
        if(kind==='choice')index=entries.length-1;
      }
    }else if(era==='proto-kingdoms'&&globalThis.PROTO_REVISION_ACTIONS){
      const api=PROTO_REVISION_ACTIONS,book=api.book(),runtime=PROTO_REVISION_RUNTIME;
      const order=PROTO_STORY_SCRIPT.flatMap(chapter=>chapter.scenes.map(scene=>scene.sceneId)),position=order.indexOf(sceneId);
      book.readSceneIds=order.slice(0,Math.max(0,position));
      book.readLineIds=book.readSceneIds.flatMap(id=>{const s=runtime.sources.get(id);return [...s.dialogues,...s.protoCommon].map(line=>line.lineId);});
      for(const id of book.readSceneIds)if(runtime.sources.get(id).choices?.length&&!Number.isInteger(book.choiceBySceneId[id]))book.choiceBySceneId[id]=0;
      if(kind==='choice'){
        book.readLineIds.push(...source.dialogues.map(line=>line.lineId));api.switchPhase(source,'choice');index=entries.length-1;
      }else{
        const target=Number.isInteger(details.cursor)?details.cursor-1:Math.max(0,index);
        book.readLineIds.push(...source.dialogues.slice(0,target).map(line=>line.lineId));api.switchPhase(source,'main');
      }
    }else if(kind==='choice')index=entries.length-1;
    if(Number.isInteger(details.cursor))index=details.cursor-1;
    run().dialogueCursor=Math.max(1,index+1);save();render();
  }
  function initial(){
    if(scenario==='menus')return;
    if(scenario.startsWith('three-')){
      const scenes=Object.values(STORIES).filter(s=>s.threeStoryVersion===3&&s.storyActive!==false);
      if(scenario==='three-prologue'){resumeEra('three-kingdoms');return;}
      if(scenario==='three-long-line'){const source=scenes.reduce((a,b)=>Math.max(...b.dialogues.map(l=>l.dialogue.length))>Math.max(...a.dialogues.map(l=>l.dialogue.length))?b:a);chooseScene('three-kingdoms',source.sceneId,'long');return;}
      if(scenario==='three-long-choice'){const source=scenes.filter(s=>s.choices?.length).reduce((a,b)=>b.choices.reduce((n,c)=>n+c.label.length,0)>a.choices.reduce((n,c)=>n+c.label.length,0)?b:a);chooseScene('three-kingdoms',source.sceneId,'choice');return;}
      const mapping={
        'three-yeonwoo':['THR-C01-S01','yeonwoo'],
        'three-eulpaso':['THR-C01-S04','eulpaso'],
        'three-npc-switch':['THR-C01-S06','npc'],
        'three-choice-quiz':['THR-C01-S06','choice'],
        'three-sundo':['THR-C03-S01','npc',{cursor:2}],
        'three-haein-young':['THR-C07-S04','npc',{cursor:2}],
        'three-haein-older':['THR-C07-S06','npc',{cursor:1}],
        'three-garam':['THR-C10-S04','npc',{cursor:2}],
        'three-haram':['THR-C12-S01','npc',{cursor:1}],
        'three-record-line':['THR-C16-S03','main',{cursor:10}],
        'three-record-choice':['THR-C16-S03','choice'],
        'three-stage-grandmother-before':['THR-PRO-S03','main',{cursor:1}],
        'three-stage-grandmother-after':['THR-C01-S01','main',{cursor:1}],
        'three-stage-tools-lost':['THR-C07-S01','branch',{choiceIndex:0,cursor:2}],
        'three-stage-tools-kept':['THR-C07-S01','branch',{choiceIndex:1,cursor:3}],
        'three-stage-tools-lost-join':['THR-C07-S01','join',{choiceIndex:0,cursor:1}],
        'three-stage-tools-kept-join':['THR-C07-S01','join',{choiceIndex:1,cursor:1}],
        'three-stage-letter-delivered':['THR-C08-S08','branch',{choiceIndex:0,cursor:2}],
        'three-stage-letter-return':['THR-C08-S08','join',{choiceIndex:0,cursor:1}],
        'three-stage-letter-wait':['THR-C08-S08','branch',{choiceIndex:1,cursor:2}],
        'three-stage-letter-wait-join':['THR-C08-S08','join',{choiceIndex:1,cursor:1}],
        'three-stage-ox-field':['THR-C11-S01','main',{cursor:2}],
        'three-stage-pagoda-build':['THR-C13-S03','main',{cursor:2}],
        'three-stage-hammer-down':['THR-C15-S07','branch',{choiceIndex:0,cursor:2}],
        'three-stage-hammer-join':['THR-C15-S07','join',{choiceIndex:0,cursor:1}],
        'three-stage-hand-hidden':['THR-C17-S04','main',{cursor:2}],
        'three-stage-hand-bandage':['THR-C17-S04','branch',{choiceIndex:0,cursor:4}],
        'three-stage-bandage-continues':['THR-C17-S05','main',{cursor:1,savedChoices:{'THR-C17-S04':0}}],
        'three-stage-reunion-names':['THR-C22-S06','main',{cursor:1,savedChoices:{'THR-C22-S04':0,'THR-C22-S02':0}}],
        'three-stage-reunion-tools':['THR-C22-S06','main',{cursor:1,savedChoices:{'THR-C22-S04':1,'THR-C22-S02':1}}]
      };const [id,kind,details]=mapping[scenario];chooseScene('three-kingdoms',id,kind,details);return;
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
