/* Three-only phase controller. Intro -> mid quiz -> choice -> result -> common -> end quiz. */
if(globalThis.CORE_APP_READY===true&&globalThis.THREE_PREVIEW_RUNTIME){
  const runtime=globalThis.THREE_PREVIEW_RUNTIME;
  runtime.installQuestionBank(globalThis.THREE_VERIFIED_REVIEW_RECORDS||[]);
  const isThree=source=>source?.threeStoryVersion===2;
  const phaseState=source=>{
    const r=run();r.threeStoryState||={version:2,scenes:{}};
    return r.threeStoryState.scenes[source.sceneId]||=( {phase:'intro',choiceIndex:null,completedCheckpoints:[]} );
  };
  const beforeEntries=conversationEntries;
  conversationEntries=function(source,p){
    if(!isThree(source)||p)return beforeEntries(source,p);
    return phaseState(source).phase==='common'?source.threeCommon:beforeEntries(source,p);
  };
  const beforeButtons=choiceButtons;
  choiceButtons=function(source,r){
    if(!isThree(source))return beforeButtons(source,r);
    const phase=phaseState(source).phase;
    if(phase==='intro')return '<button class="primary next" data-action="three-mid">현장에서 본 단서를 확인한다</button>';
    if(phase==='common')return '<button class="primary next" data-action="three-end">기록을 남기고 길을 잇는다</button>';
    return beforeButtons(source,r);
  };
  const beforeStage=characterStage;
  characterStage=function(visible,source,complete,p,assetId,allEntries,cursor){
    if(!isThree(source))return beforeStage(visible,source,complete,p,assetId,allEntries,cursor);
    const entries=allEntries||conversationEntries(source,p),index=Math.max(0,Math.min((cursor||run().dialogueCursor||1)-1,entries.length-1));
    const active=entries[index],npc=entries.slice(0,index+1).findLast(entry=>entry.speakerType==='npc')||source.dialogues.find(entry=>entry.speakerType==='npc');
    const player=entries.slice(0,index+1).findLast(entry=>entry.speakerType==='player')||source.dialogues.find(entry=>entry.speakerType==='player');
    const cast=[...(npc?[{...npc,position:'left'}]:[]),...(player?[{...player,position:'right'}]:[])];
    return `<div class="character-stage" data-slot-mode="three-conversation" aria-hidden="true">${cast.map(entry=>stagePortrait({...entry,show:true,presentation:'standing'},entry.position,entry.characterId===active?.characterId)).join('')}</div>`;
  };
  function switchPhase(source,phase){
    phaseState(source).phase=phase;run().storyId=source.sceneId;run().dialogueSceneId=source.sceneId;
    run().dialogueCursor=phase==='choice'?source.dialogues.length:1;save();screen='game';render();
  }
  function advanceScene(source){
    const current=phaseState(source);current.phase='finished';
    if(source.completeChapter){finishChapter(state);save();navigate('complete');}
    else{run().storyId=source.nextStoryId;enterStory();save();screen='game';render();}
  }
  function checkpoint(source,which){
    const current=phaseState(source),ids=chapterQuestions(source.chapterId).filter(question=>question.relatedSceneId===source.sceneId).map(question=>question.questionId);
    const selected=which==='mid'?(ids.length>=2?ids.slice(0,1):[]):ids.slice(ids.length>=2?1:0);
    if(!selected.length){current.completedCheckpoints.push({which,status:'unavailable'});which==='mid'?switchPhase(source,'choice'):advanceScene(source);return;}
    current.phase=`quiz-${which}`;
    run().threeCheckpoint={sceneId:source.sceneId,which};
    run().questionQueue=selected;run().questionQueueIndex=0;run().questionQueueResumeStoryId=source.sceneId;
    startQuestion(selected[0],true);
  }
  const beforeContinue=continueStoryQuestion;
  continueStoryQuestion=function(){
    const checkpointState=run().threeCheckpoint;
    if(!checkpointState||activeQuestion()?.threeStoryVersion!==2)return beforeContinue();
    const queue=run().questionQueue||[],next=(run().questionQueueIndex||0)+1;
    if(next<queue.length){run().questionQueueIndex=next;startQuestion(queue[next],true);return;}
    const source=STORIES[checkpointState.sceneId],current=phaseState(source);
    current.completedCheckpoints.push({which:checkpointState.which,status:'answered'});
    delete run().threeCheckpoint;
    Object.assign(run(),{activeQuestionId:null,questionAnswer:null,questionQueue:[],questionQueueIndex:0,questionQueueResumeStoryId:null,activeQuestionSetId:null});
    checkpointState.which==='mid'?switchPhase(source,'choice'):advanceScene(source);
  };
  const beforeComplete=complete;
  complete=function(){
    const id=resultChapterId||run().currentChapter;
    if(CHAPTERS[id]?.threeStoryVersion!==2)return beforeComplete();
    const info=CHAPTERS[id],questions=chapterQuestions(id);
    return `<section class="complete ancient-complete"><div class="eyebrow">개발 중인 삼국편 미리보기</div><h1>${esc(info.title)}</h1><p>3씬의 분기를 확인했습니다. 배경·NPC·기출 추가 배치·PC 및 모바일 실기 검증은 아직 완료되지 않았습니다.</p><p>연결된 검증 기출 ${questions.length}문항</p>${resultFooter(id)}</section>`;
  };
  const beforeGame=game;
  game=function(){
    const source=run().pending?STORIES[run().pending.sourceSceneId]:STORIES[run().storyId];
    const html=beforeGame();
    if(!isThree(source))return html;
    return '<p role="status" class="three-preview-notice">개발 미리보기 · 배경/NPC 에셋, 추가 기출, 대사 확장 및 화면 QA 진행 중</p>'+html.replace(`${storyYearLabel(source.year)}년`,esc(source.threeDateLabel));
  };
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button||button.disabled||screen!=='game')return;
    const source=run().pending?STORIES[run().pending.sourceSceneId]:STORIES[run().storyId];if(!isThree(source))return;
    const action=button.dataset.action;
    if(button.dataset.choice!==undefined){
      if(phaseState(source).phase!=='choice'){event.stopImmediatePropagation();return;}
      if(Date.now()<inputLockedUntil)return;
      phaseState(source).choiceIndex=Number(button.dataset.choice);phaseState(source).phase='result';
      // The existing choice handler saves both the branch and this phase.
      return;
    }
    if(!['three-mid','three-end','result-next'].includes(action))return;
    event.stopImmediatePropagation();event.preventDefault?.();
    if(action==='three-mid'&&phaseState(source).phase!=='intro')return;
    if(action==='three-end'&&phaseState(source).phase!=='common')return;
    if(action==='result-next'){run().pending=null;switchPhase(source,'common');}
    else checkpoint(source,action==='three-mid'?'mid':'end');
  },true);
  globalThis.THREE_STORY_UI_READY=true;
  globalThis.THREE_PREVIEW_ACTIONS={phaseState,switchPhase,checkpoint,advanceScene};
}
