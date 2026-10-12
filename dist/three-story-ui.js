/* Approved Three manuscript: every authored line is advanced by the reader.
   main -> choice -> spoken choice/reply -> join -> hints -> official quiz -> next scene. */
if (globalThis.CORE_APP_READY === true && globalThis.THREE_STORY_RUNTIME?.version === 3) {
  const runtime = globalThis.THREE_STORY_RUNTIME;
  let prologueCutPending = false;
  const isThree = source => source?.threeStoryVersion === 3;
  const currentSource = () => STORIES[run().pending?.sourceSceneId || run().storyId];
  const clone = value => JSON.parse(JSON.stringify(value));
  const unique = values => [...new Set(values)];
  function book(model = state) {
    const value = model.meta.threeCompleteBook ||= {};
    Object.assign(value, {version:3, contentVersion:runtime.contentVersion});
    for (const key of ['readSceneIds','answeredQuestionIds','unlockedQuestionIds','hintReadIds']) value[key] ||= [];
    value.choiceBySceneId ||= {};
    return value;
  }
  function phaseState(source) {
    run().threeStoryState ||= {version:3, scenes:{}};
    run().threeStoryState.scenes ||= {};
    return run().threeStoryState.scenes[source.sceneId] ||= {phase:'main', choiceIndex:null};
  }
  function phaseEntries(source) {
    const current = phaseState(source);
    if (current.phase === 'branch') return source.choices[current.choiceIndex]?.resultDialogues || [];
    if (current.phase === 'join') return source.threeCommon;
    if (current.phase === 'hints') return run().threeHintEntries || [];
    return source.dialogues;
  }
  const beforeEntries = conversationEntries;
  conversationEntries = function(source, pending) {
    if (!isThree(source)) return beforeEntries(source, pending);
    // Read-only story recall from the study page must not create phase data in another era's run.
    if (currentSource()?.sceneId !== source.sceneId || !isThree(currentSource())) return source.dialogues;
    return phaseEntries(source);
  };
  function resetReading(source, phase) {
    phaseState(source).phase = phase;
    run().storyId = source.sceneId;
    run().dialogueSceneId = phase === 'branch' ? 'result:' + source.sceneId : source.sceneId;
    run().dialogueCursor = phase === 'choice' ? source.dialogues.length : 1;
    run().threeTypedLineId = null;
  }
  function showGame() { screen = 'game'; preloadThreeAssets(); save(); render(); }
  function switchPhase(source, phase) { resetReading(source, phase); showGame(); }
  function unlockLearnedQuestions() {
    const value = book(), read = new Set(value.readSceneIds);
    const ready = [...runtime.exams.schedule, ...runtime.exams.additionalCandidates]
      .filter(row => read.has(row.quizAfterSceneId)).map(row => row.officialQuestionId);
    value.unlockedQuestionIds = unique([...value.unlockedQuestionIds, ...ready]);
  }
  function markRead(source) {
    const value = book();
    if (!value.readSceneIds.includes(source.sceneId)) value.readSceneIds.push(source.sceneId);
    unlockLearnedQuestions();
  }
  function clearQueue() {
    Object.assign(run(), {activeQuestionId:null, questionAnswer:null, questionQueue:[],
      questionQueueIndex:0, questionQueueResumeStoryId:null, activeQuestionSetId:null});
    delete run().threeAnswerDraft;
    delete run().threeHintEntries;
  }
  function advanceScene(source) {
    markRead(source);
    phaseState(source).phase = 'finished';
    run().pending = null;
    clearQueue();
    delete run().threeCheckpoint;
    if (source.completeChapter) {
      finishChapter(state); save(); navigate('complete');
    } else if (source.nextStoryId) {
      run().storyId = source.nextStoryId;
      resetReading(STORIES[source.nextStoryId], 'main');
      prologueCutPending = source.sceneId === 'THR-PRO-S02' && source.nextStoryId === 'THR-PRO-S03';
      enterStory(); showGame();
    }
  }
  function openQueuedQuestion() {
    const r = run(), checkpointState = r.threeCheckpoint;
    const id = r.questionQueue[r.questionQueueIndex || 0];
    if (!id || !checkpointState) throw Error('삼국 기출 큐가 비어 있습니다.');
    phaseState(STORIES[checkpointState.sceneId]).phase = 'quiz';
    r.threeAnswerDraft = null;
    startQuestion(id, true);
  }
  function startQueue(source, rows, kind = 'first', returnTo = null) {
    const r = run();
    r.pending = null;
    resetReading(source, 'quiz');
    r.threeCheckpoint = {sceneId:source.sceneId, kind, scheduleIds:rows.map(row => row.id), ...(returnTo ? {returnTo} : {})};
    r.questionQueue = rows.map(row => runtime.questionByOfficialId.get(row.officialQuestionId).questionId);
    r.questionQueueIndex = 0;
    r.questionQueueResumeStoryId = source.sceneId;
    // These workbook hints are a separate, tap-only record-book phase.
    r.threeHintEntries = unique(rows.flatMap(row => row.preQuizHints || [])).map((text, index) => ({
      characterId:'narrator',characterName:'기록책',speakerType:'narration',dialogue:text.replace(/^기록책\s*[:：]\s*/,''),
      lineId:rows.map(row=>row.id).join('|')+'-hint-'+index,threeKind:'record',presentationContext:'record',advance:'tap'
    }));
    if (r.threeHintEntries.length) {
      // A review keeps the interrupted scene's phase intact in its return snapshot.
      resetReading(source, 'hints'); showGame();
    } else openQueuedQuestion();
  }
  function checkpoint(source) {
    markRead(source);
    const answered = new Set(Object.keys(run().questionResults || {}).map(id => QUESTIONS.find(q=>q.questionId===id)?.officialQuestionId));
    const rows = runtime.exams.schedule.filter(row => row.quizAfterSceneId === source.sceneId && row.playMode === 'first' && !answered.has(row.officialQuestionId));
    if (!rows.length) return advanceScene(source);
    startQueue(source, rows);
  }
  function afterMain(source) {
    if (source.choices?.length) return switchPhase(source, 'choice');
    if (source.threeCommon.length) return switchPhase(source, 'join');
    checkpoint(source);
  }
  function afterBranch(source) {
    run().pending = null;
    if (source.threeCommon.length) return switchPhase(source, 'join');
    checkpoint(source);
  }
  function advance() {
    const source = currentSource();
    if (!isThree(source) || screen !== 'game' || modal) return false;
    const current = phaseState(source), entries = phaseEntries(source), cursor = run().dialogueCursor || 1;
    if (current.phase === 'choice') return false;
    if (current.phase === 'hints' && entries[cursor - 1]) {
      const id = entries[cursor - 1].lineId;
      if (!book().hintReadIds.includes(id)) book().hintReadIds.push(id);
    }
    if (cursor < entries.length) {
      run().dialogueCursor = cursor + 1; run().threeTypedLineId = null; save(); render(); return true;
    }
    if (current.phase === 'main') afterMain(source);
    else if (current.phase === 'branch') afterBranch(source);
    else if (current.phase === 'join') checkpoint(source);
    else if (current.phase === 'hints') openQueuedQuestion();
    return true;
  }
  function choose(index) {
    const source = currentSource();
    if (!isThree(source) || phaseState(source).phase !== 'choice' || !Number.isInteger(index) || !source.choices?.[index]) return false;
    const current = phaseState(source);
    current.choiceIndex = index;
    book().choiceBySceneId[source.sceneId] = index;
    // Empty stat/relationship changes: authored dialogue choices are never marked right or wrong.
    applyChoice(state, source.sceneId, index);
    resetReading(source, 'branch'); showGame();
    return true;
  }
  const beforeRecord = recordQuestion;
  recordQuestion = function(model, id, answer) {
    const q = QUESTIONS.find(item => item.questionId === id);
    if (q?.threeStoryVersion !== 3) return beforeRecord(model, id, answer);
    if (!Number.isInteger(answer) || answer < 0 || answer >= q.choices.length) return false;
    const result = beforeRecord(model, id, answer), value = book(model);
    if (!value.answeredQuestionIds.includes(q.officialQuestionId)) value.answeredQuestionIds.push(q.officialQuestionId);
    return result;
  };
  function currentSchedule(q = activeQuestion()) {
    const checkpointState = run().threeCheckpoint;
    const rowId = checkpointState?.scheduleIds?.[run().questionQueueIndex || 0];
    const queued = runtime.schedules.get(rowId);
    if (queued?.officialQuestionId === q?.officialQuestionId) return queued;
    const read = new Set(book().readSceneIds);
    return [...runtime.exams.schedule, ...runtime.exams.additionalCandidates]
      .filter(row => row.officialQuestionId === q?.officialQuestionId && read.has(row.quizAfterSceneId)).at(-1) || runtime.firstScheduleFor(q?.officialQuestionId);
  }
  function safeExplanation(q, row = currentSchedule(q)) {
    const gate = q.threeExam?.fullExplanationAfterSceneId || row?.fullExplanationAfterSceneId;
    if (gate && !book().readSceneIds.includes(gate)) return row?.playExplanation || runtime.firstScheduleFor(q.officialQuestionId)?.playExplanation || '';
    return gate ? q.threeExam.explanation : row?.playExplanation || q.threeExam?.explanation || q.explanation;
  }
  function reviewSnapshot() {
    const r = run(), keys = ['storyId','currentChapter','pending','dialogueSceneId','dialogueCursor','threeTypedLineId',
      'activeQuestionId','questionAnswer','questionQueue','questionQueueIndex','questionQueueResumeStoryId','activeQuestionSetId','threeCheckpoint','threeHintEntries','threeAnswerDraft','threeStoryState'];
    const values = {}; for (const key of keys) if (r[key] !== undefined) values[key] = clone(r[key]);
    return {values, keys, screen, quizMode, resultChapterId, reopenBook:modal?.type === 'three-recordbook'};
  }
  function startReview(officialId, placementId = null) {
    unlockLearnedQuestions();
    if (!book().unlockedQuestionIds.includes(officialId) || run().activeQuestionId || run().threeCheckpoint) return false;
    const rows = [...runtime.exams.schedule, ...runtime.exams.additionalCandidates].filter(row => row.officialQuestionId === officialId && book().readSceneIds.includes(row.quizAfterSceneId));
    const row = rows.find(item => item.id === placementId) || rows.at(-1);
    if (!row || !isThree(currentSource())) return false;
    const returnTo = reviewSnapshot(); modal = null;
    startQueue(STORIES[row.quizAfterSceneId], [row], 'review', returnTo);
    return true;
  }
  const beforeContinue = continueStoryQuestion;
  continueStoryQuestion = function() {
    const checkpointState = run().threeCheckpoint;
    if (!checkpointState || activeQuestion()?.threeStoryVersion !== 3) return beforeContinue();
    if (run().questionAnswer === null) return;
    const next = (run().questionQueueIndex || 0) + 1;
    if (next < run().questionQueue.length) {
      run().questionQueueIndex = next; openQueuedQuestion(); return;
    }
    const source = STORIES[checkpointState.sceneId], returnTo = checkpointState.returnTo;
    clearQueue(); delete run().threeCheckpoint;
    if (returnTo) {
      for (const key of returnTo.keys) delete run()[key];
      Object.assign(run(), returnTo.values);
      screen = returnTo.screen; quizMode = returnTo.quizMode; resultChapterId = returnTo.resultChapterId;
      modal = returnTo.reopenBook ? {type:'three-recordbook',tab:'questions'} : null;
      save(); render(); return;
    }
    advanceScene(source);
  };
  const beforeNext = nextStory;
  nextStory = function() { return isThree(currentSource()) ? advance() : beforeNext(); };

  // Measure the actual face in original sheet pixels. The image and its crop
  // receive one uniform scale; transparent margins never determine body size.
  function stagingState(source,entry,current=phaseState(source)) {
    const choicesByScene={};
    for(const [sceneId,index] of Object.entries(meta().threeCompleteBook?.choiceBySceneId||{})) {
      const choiceId=runtime.sources.get(sceneId)?.choices?.[index]?.choiceId;
      if(choiceId) choicesByScene[sceneId]=choiceId;
    }
    const selected=source.choices?.[current.choiceIndex];
    return {phase:current.phase,entry,choiceId:selected?.threeChoiceId||selected?.choiceId||null,choicesByScene};
  }
  function entriesForState(source,current) {
    if(current.phase==='branch')return source.choices[current.choiceIndex]?.resultDialogues||[];
    if(current.phase==='join')return source.threeCommon||[];
    if(current.phase==='hints')return run().threeHintEntries||[];
    return source.dialogues||[];
  }
  function frameCast(source,current,entries,index) {
    const entry=entries[index],presentation=stagingState(source,entry,current),context=stagingContext(source,entry,current);
    const lineContext=line=>stagingContext(source,line,{...current,phase:current.phase==='choice'?'main':current.phase});
    let active=entry;
    if(current.phase==='choice'&&(lineContext(active)==='record'||['narration','thought'].includes(active?.speakerType))) {
      active=[...entries.slice(0,index+1)].reverse().find(line=>['player','npc'].includes(line.speakerType)&&lineContext(line)!=='record');
    }
    if(!active||['narration','thought'].includes(active.speakerType)||context==='record')return {presentation,context,active,cast:[]};
    const history=[...(current.phase==='branch'||current.phase==='join'?source.dialogues:[]),
      ...(current.phase==='join'&&current.choiceIndex!==null?source.choices[current.choiceIndex]?.resultDialogues||[]:[]),...entries.slice(0,index+1)];
    const spoken=line=>['player','thought','npc'].includes(line?.speakerType)&&lineContext(line)!=='record',nearby=[];
    for(let distance=1;distance<entries.length;distance++){
      if(index-distance>=0&&spoken(entries[index-distance]))nearby.push(entries[index-distance]);
      if(index+distance<entries.length&&spoken(entries[index+distance]))nearby.push(entries[index+distance]);
    }
    const standing=(line,position)=>({...line,position});let cast;
    if(active.speakerType==='npc'){
      const peer=nearby.find(line=>line.speakerType==='player')||[...history].reverse().find(line=>line.speakerType==='player');
      cast=[standing(active,'left'),...(peer&&['player','thought'].includes(peer.speakerType)?[standing(peer,'right')]:[])];
    }else{
      const peer=[...history].reverse().find(line=>line.speakerType==='npc'&&lineContext(line)!=='record')||nearby.find(line=>line.speakerType==='npc');
      cast=[...(peer?[standing(peer,'left')]:[]),standing(active,'right')];
    }
    for(const presence of globalThis.THREE_STAGING?.actorPresence(source,presentation)||[]){
      const position=presence.speakerType==='player'?'right':'left';
      if(active.speakerType==='npc'&&position==='left'&&presence.characterId!==active.characterId)continue;
      cast=cast.filter(line=>line.characterId!==presence.characterId&&line.position!==position);cast.push(standing(presence,position));
    }
    const hidden=globalThis.THREE_STAGING?.actorVisibility(source,presentation)||{};
    cast=cast.filter(line=>line.characterId===active.characterId||!(line.position==='left'?hidden.hideNpc:hidden.hidePlayer));
    return {presentation,context,active,cast};
  }
  function frameAssetUrls(source,current,entries,index) {
    const entry=entries[index];if(!source||!entry)return[];
    const frame=frameCast(source,current,entries,index),presentation=frame.presentation,staging=globalThis.THREE_STAGING,urls=[];
    const background=staging?.backgroundOverride(source,presentation),base=ASSETS[source.illustrationId];
    if(background?.src)urls.push(background.src);else if(base?.src&&source.sceneEffect!=='blackout')urls.push(base.src);
    const characterIds=[];
    for(const line of frame.cast){
      characterIds.push(line.characterId);
      const setup=portraitPresentation(line,source,presentation);if(setup?.portrait?.src)urls.push(setup.portrait.src);
    }
    if(typeof staging?.assetUrls==='function')urls.push(...staging.assetUrls(source,presentation,characterIds));
    return unique(urls.filter(Boolean));
  }
  function preloadFrame(source,current,entries,index,priority) {
    const urls=frameAssetUrls(source,current,entries,index);
    urls.forEach(src=>preloadImage(src,priority));return urls;
  }
  function preloadThreeAssets(sceneId=currentSource()?.sceneId) {
    const source=STORIES[sceneId];if(!isThree(source))return Promise.resolve([]);
    const active=currentSource()?.sceneId===source.sceneId;
    const current=active?(run().threeStoryState?.scenes?.[source.sceneId]||{phase:'main',choiceIndex:null}):{phase:'main',choiceIndex:null};
    const entries=entriesForState(source,current),cursor=active?Math.max(1,Math.min(run().dialogueCursor||1,Math.max(1,entries.length))):1,index=cursor-1;
    const currentUrls=preloadFrame(source,current,entries,index,'high');
    if(index+1<entries.length)preloadFrame(source,current,entries,index+1,'near');
    const shouldPrepareChoices=(current.phase==='choice')||(current.phase==='main'&&index>=entries.length-2);
    if(shouldPrepareChoices)for(let choiceIndex=0;choiceIndex<(source.choices||[]).length;choiceIndex++){
      const branch={phase:'branch',choiceIndex},branchEntries=entriesForState(source,branch);preloadFrame(source,branch,branchEntries,0,'near');
    }
    if(index>=entries.length-1&&current.phase==='main'&&!source.choices?.length&&source.threeCommon?.length){const join={phase:'join',choiceIndex:current.choiceIndex};preloadFrame(source,join,entriesForState(source,join),0,'near')}
    if(index>=entries.length-1&&current.phase==='branch'&&source.threeCommon?.length){const join={phase:'join',choiceIndex:current.choiceIndex};preloadFrame(source,join,entriesForState(source,join),0,'near')}
    const next=STORIES[source.nextStoryId];if(isThree(next)){const first={phase:'main',choiceIndex:null},nextEntries=entriesForState(next,first);preloadFrame(next,first,nextEntries,0,'idle')}
    return Promise.all(currentUrls.map(src=>preloadImage(src,'high')));
  }
  function stagingContext(source,entry,current) {
    return globalThis.THREE_STAGING?.context(source,stagingState(source,entry,current))
      ||entry?.presentationContext||source.threeSource?.presentationContext||'scene';
  }
  function portraitPresentation(line,source,presentation) {
    const portraitId=resolvedPortraitId(line),original=PORTRAITS[portraitId];
    const variant=globalThis.THREE_STAGING?.portraitOverride(source,presentation,line.characterId);
    const portrait=variant?{...original,...variant}:original;
    if(!portrait?.src) return null;
    const art=globalThis.THREE_COMPLETE_ART||{};
    const originalAuthored=line.speakerType==='player'
      ?(art.protagonist?.files||[]).find(item=>item.src===portrait.src)||{}
      :art.characters?.[line.characterId]||{};
    const authored=variant?{...originalAuthored,...variant}:originalAuthored;
    const geometry=portrait.portraitGeometry||authored.portraitGeometry
      ||art.approvedGeometry?.files?.[portrait.src]
      ||(line.speakerType==='player'&&portrait.src===art.protagonist?.modernSrc?art.protagonist?.modernGeometry:null)
      ||(line.speakerType==='player'?art.protagonist?.geometryByExpression?.[portrait.expression]:null);
    const sprite=portrait.sprite||authored.sprite;
    if(!geometry?.faceBounds) return {portraitId,portrait,authored};
    const width=geometry.sheetWidth||sprite?.sheetWidth,height=geometry.sheetHeight||sprite?.sheetHeight;
    const rect=sprite?.sourceRect||{x:0,y:0,width,height};
    const face=geometry.faceBounds;
    if(![width,height,rect.width,rect.height,face.width,face.height].every(value=>Number.isFinite(value)&&value>0)) return {portraitId,portrait,authored};
    return {portraitId,portrait,authored,geometry,sprite,width,height,rect};
  }
  function threePortrait(line, active, source, presentation) {
    const setup=portraitPresentation(line,source,presentation);
    if(!setup) return '';
    if(!setup.geometry) return stagePortrait({...line,show:true,presentation:'standing'},line.position,active);
    const {portraitId,portrait,authored,geometry,sprite,width,height,rect}=setup;
    const face=geometry.faceBounds,flip=Boolean(portrait.flipX||authored.flipX);
    const age=String(authored.ageEvidence||'')+' '+String(authored.ageLabel||'');
    const teen=/(teen|청소년)/i.test(age),child=!teen&&/(child|어린이|아동|소년|소녀)/i.test(age);
    const scale=geometry.faceScale||(child ? 0.88 : teen ? 0.96 : 1);
    const faceX=face.x+face.width/2-rect.x,faceY=face.y+face.height/2-rect.y;
    const x=(flip?rect.width-faceX:faceX)/face.height*scale,y=faceY/face.height*scale;
    const centerX=line.position==='left'?25:75,centerY=child?49:teen?41:37;
    const round=value=>Number(value.toFixed(5));
    const style='width:calc(var(--three-face-height) * '+round(rect.width/face.height*scale)+');height:calc(var(--three-face-height) * '+round(rect.height/face.height*scale)+');left:calc('+centerX+'% - var(--three-face-height) * '+round(x)+');top:calc('+centerY+'% - var(--three-face-height) * '+round(y)+')';
    const imageStyle="background-image:url('"+portrait.src+"');background-size:"+round(width/rect.width*100)+'% '+round(height/rect.height*100)+'%;background-position:'+round(width===rect.width?0:rect.x/(width-rect.width)*100)+'% '+round(height===rect.height?0:rect.y/(height-rect.height)*100)+'%;transform:scaleX('+(flip?-1:1)+')'+(sprite?.clipPath?';clip-path:'+sprite.clipPath:'');
    const portraitLayers=globalThis.THREE_STAGING?.portraitLayers(source,presentation,line.characterId)||'';
    return '<div class="stage-character three-scaled-character stage-'+line.position+' '+(active?'active':'listening')+'" data-character-id="'+esc(line.characterId)+'" data-position="'+line.position+'" data-portrait="'+esc(portraitId)+'" data-character-framing="'+esc(geometry.framing||'full-body')+'" data-portrait-source="'+(sprite?.columns>1?'atlas':'file')+'" data-face-scale="'+scale+'" style="'+esc(style)+'" role="img" aria-label="'+esc(line.characterName)+'"><span class="three-portrait-image '+(sprite?.columns>1?'three-atlas-image':'')+'" style="'+esc(imageStyle)+'">'+portraitLayers+'</span></div>';
  }
  const beforeStage = characterStage;
  characterStage = function(visible, source, complete, pending, assetId, allEntries, cursor) {
    if (!isThree(source)) return beforeStage(visible, source, complete, pending, assetId, allEntries, cursor);
    const entries=allEntries||phaseEntries(source),index=Math.max(0,Math.min((cursor||run().dialogueCursor||1)-1,entries.length-1));
    const current=phaseState(source),frame=frameCast(source,current,entries,index),{presentation,context,active,cast}=frame;
    if(!cast.length)return '';
    return cast.length?'<div class="character-stage" data-slot-mode="three-conversation" data-presentation-context="'+esc(context)+'" aria-hidden="true">'+cast.map(line=>threePortrait(line,line.characterId===active.characterId,source,presentation)).join('')+'</div>':'';
  };
  // Use the approved messenger renderer verbatim; add only stable scene metadata.
  function bubble(entry, index, source, current) {
    const context=stagingContext(source,entry,{...current,phase:current.phase==='choice'?'main':current.phase});
    const metadata = 'data-line-id="'+esc(entry.lineId)+'" data-character-id="'+esc(entry.characterId)+'" data-position="'+(entry.speakerType==='player'?'right':'left')+'" data-presentation-context="'+esc(context)+'"';
    return dialogueBubble(entry,index).replace('<div ', '<div '+metadata+' ');
  }
  function compactThreeDate(value) {
    const text=String(value||'').replace(/\s*[（(][^）)]*[）)]/g,'').trim();
    const years=[...text.matchAll(/(\d{3,4})(?:년|(?=\s*[~～–—→]))/g)].map(match=>match[1]);
    if(years.length) return [...new Set(years)].join('·')+'년';
    const century=text.match(/(?:\d{1,2}~)?\d{1,2}세기(?:\s*(?:초|중엽|중반|말))?/);
    if(century) return century[0];
    return text.split(/[·,—→]|\s[—–-]\s/)[0].trim();
  }
  globalThis.THREE_COMPACT_DATE=compactThreeDate;
  const beforeGame = game;
  game = function() {
    const source = currentSource(); if (!isThree(source)) return beforeGame();
    const r=run(),current=phaseState(source),entries=phaseEntries(source);
    preloadThreeAssets(source.sceneId);
    const cursor=Math.max(1,Math.min(r.dialogueCursor||1,entries.length)),entry=entries[cursor-1];
    const raw=source.threeSource,presentation=stagingState(source,entry,current),context=stagingContext(source,entry,current);
    const staging=globalThis.THREE_STAGING,stagedView=staging?.resolve(source,presentation);
    const background=staging?.backgroundOverride(source,presentation);
    const sceneStyle=background?.src?"background-image:url('"+esc(background.src)+"')":assetStyle(source.illustrationId);
    const stagingLayers=staging?.layers(source,presentation)||'';
    const first=source.sceneId==='THR-PRO-S03',cut=first&&cursor===1&&prologueCutPending;
    prologueCutPending=false;
    const choices=current.phase==='choice',visibleStart=Math.max(0,cursor-(choices?2:3));
    const visible=entries.slice(visibleStart,cursor),info=CHAPTERS[source.chapterId];
    const action=current.phase==='branch'&&cursor>=entries.length?'result-next':cursor>=entries.length?'next':'advance-dialogue';
    const label=cursor<entries.length?'탭하여 계속':current.phase==='hints'?'기출 펼치기':current.phase==='main'&&source.choices?.length?'응답 고르기':source.completeChapter&&current.phase==='join'?'기록을 마친다':'이야기 계속';
    const date=String(source.threeDateLabel||'');
    const headerDate=compactThreeDate(date);
    const chapterLabel=source.isPrologue?'프롤로그':'CH.'+info.number+' &nbsp; '+esc(headerDate);
    const count=source.isPrologue?3:chapterScenes(source.chapterId).length;
    const readCount=book().readSceneIds.filter(id=>source.isPrologue?id.startsWith('THR-PRO-'):runtime.sources.get(id)?.chapterId===source.chapterId).length;
    const contextLabel=stagedView?.caption?.label||entry?.presentationLabel||(context==='record'?(raw.presentationLabel||'기록책 속의 자료'):'');
    const notice=source.isPrologue&&source.sceneId==='THR-PRO-S01'?'화면을 누르면 서아의 이야기가 이어집니다.':context==='record'?'서아가 기록책에서 확인하는 내용입니다.':'최근 대화만 남겨 장면에 집중할 수 있어요.';
    const stage=characterStage(visible,source,cursor>=entries.length,r.pending,source.illustrationId,entries,cursor);
    const choiceMarkup=choices?choiceButtons(source,r).replace('class="choices"','class="choices three-dialogue-choices" role="group" aria-label="서아가 할 말"'):'';
    const advancing=!choices&&cursor<entries.length?'<button class="advance-dialogue" data-action="'+action+'">'+label+' <b>›</b></button>':'';
    const continuing=!choices&&cursor>=entries.length?'<button class="primary next" data-action="'+action+'">'+label+'</button>':'';
    return '<section class="game conversation-game three-complete-game has-art layered-art '+(first?'three-wake ':'')+(cut?'three-prologue-cut ':'')+(first&&cursor>=5?'three-queue-focus ':'')+(context==='record'?'three-record-context':'')+'" data-three-scene="'+esc(source.sceneId)+'" data-three-phase="'+current.phase+'" data-three-ui="approved-messenger-v1" style="'+sceneStyle+'"><div class="scene-scrim"></div>'+'<div class="game-header"><button class="glass" data-nav="era">‹ &nbsp; 이야기 나가기</button><span class="glass">'+chapterLabel+'</span><button class="glass" data-action="three-recordbook">기록책</button></div><div class="game-stats"><span>♡ &nbsp; 체력 '+r.stats.health+'</span><span>◇ &nbsp; 지식 '+r.stats.knowledge+'</span><span>◉ &nbsp; '+r.stats.wealth+'냥</span></div><div class="scene-title"><small>'+(raw.showDateAndLocation===false?'':esc(source.location))+'</small><h2>'+esc(source.title)+'</h2>'+'</div>'+stage+stagingLayers+'<section class="conversation-panel" aria-label="대화">'+(contextLabel?'<div class="three-context-label">'+esc(contextLabel)+'</div>':'')+'<div class="dialogue-log">'+visible.map((line,index)=>bubble(line,visibleStart+index,source,current)).join('')+'</div><div class="dialogue-step"><span>'+cursor+' / '+entries.length+'</span>'+advancing+'</div>'+continuing+choiceMarkup+'<div class="conversation-sub">'+notice+'</div></section><div class="chapter-progress" aria-label="읽은 장면 '+readCount+' / '+count+'">'+Array.from({length:count},(_,i)=>'<i class="'+(i<readCount?'on':'')+'"></i>').join('')+'</div></section>';
  };
  // Three lines are complete when rendered. Older saves may retain their
  // threeTypedLineId field, but it never gates input or schedules characters.
  const beforeTyping = syncOpeningTyping;
  syncOpeningTyping = function() {
    if (!isThree(currentSource())) return beforeTyping();
    if (typingTimer) clearTimeout(typingTimer);
    typingTimer=null;typingLine=null;
  };

  const beforeQuiz = quiz;
  quiz = function() {
    const q = activeQuestion(); if (q?.threeStoryVersion !== 3) return beforeQuiz();
    const selected = quizMode === 'story' ? run().questionAnswer : reviewAnswer;
    const done = Number.isInteger(selected), draft = meta().threeAnswerDraft?.questionId === q.questionId ? meta().threeAnswerDraft.answer : null;
    const row = currentSchedule(q), queue = run().threeCheckpoint ? run().questionQueue || [] : [], index = run().questionQueueIndex || 0;
    return '<section class="editorial-quiz three-complete-quiz" data-three-question="'+esc(q.officialQuestionId)+'"><header class="quiz-top"><button data-nav="era" aria-label="시대 선택으로">‹</button><span>삼국 · 기록에서 기출로</span><button data-action="three-recordbook">기록책</button></header><div class="exam-source-row"><span class="official-pill">실제 한능검 기출</span><span>'+esc(q.threeExam.label)+'</span>'+(queue.length>1?'<span>'+(index+1)+' / '+queue.length+'</span>':'')+'</div><h1 class="quiz-question-title">'+esc(q.threeExam.label)+'</h1>'+officialQuestionFigure(q,q.threeExam.label)+'<p class="three-answer-instruction">원문 이미지의 보기를 읽고 번호를 골라 주세요.</p><div class="ed-answer-options three-number-options" role="group" aria-label="답 번호 선택">'+q.choices.map((_,i)=>'<button class="choice '+(done&&i===q.answer?'correct':done&&i===selected?'wrong':!done&&draft===i?'picked':'')+'" data-three-answer="'+i+'" aria-pressed="'+(!done&&draft===i)+'" '+(done?'disabled':'')+'><span class="answer-number">'+(i+1)+'</span><span>'+(i+1)+'번</span>'+(done&&i===q.answer?'<b>✓</b>':'')+'</button>').join('')+'</div>'+(done?'<div class="feedback" role="status"><h2>'+(selected===q.answer?'기억이 이어졌다.':'다시 기록해 둘 순간.')+'</h2><p><b>정답 '+(q.answer+1)+'번</b></p><p class="three-safe-explanation">'+esc(safeExplanation(q,row))+'</p>'+((q.threeExam.fullExplanationAfterSceneId&&!book().readSceneIds.includes(q.threeExam.fullExplanationAfterSceneId))?'<p class="three-delayed-explanation">아직 만나지 않은 사건의 비교 해설은 뒤의 기록을 읽은 후 열립니다.</p>':'')+'</div><button class="primary next" data-action="quiz-next">'+(queue.length>index+1?'다음 문제':run().threeCheckpoint?.kind==='review'?'기록책으로 돌아가기':'이야기 계속')+'</button>':'<button class="confirm-answer" data-action="three-submit" '+(draft===null?'disabled':'')+'>답 확인하기</button>')+'<details class="three-exam-source"><summary>문항 출처</summary><p>국사편찬위원회 한국사능력검정시험 · '+esc((q.threeExam.sourceFilename||q.sourceFile))+' · '+q.threeExam.sourcePage+'쪽</p><a href="'+esc(q.threeExam.originalQuestionPdfUrl||'https://www.historyexam.go.kr/pst/list.do?bbs=dat')+'" target="_blank" rel="noopener">원본 문제지</a> · <a href="'+esc(q.threeExam.officialAnswerUrl||'https://www.historyexam.go.kr/pst/list.do?bbs=dat')+'" target="_blank" rel="noopener">공식 정답표</a></details></section>';
  };
  function submitAnswer() {
    const q = activeQuestion(), draft = meta().threeAnswerDraft;
    if (q?.threeStoryVersion !== 3 || draft?.questionId !== q.questionId || !Number.isInteger(draft.answer)) return false;
    if (quizMode === 'story') {
      if (run().questionAnswer !== null) return false;
      recordQuestion(state, q.questionId, draft.answer);
    } else {
      if (reviewAnswer !== null) return false;
      reviewAnswer = draft.answer;
      // A library review must not add a Three question to a different era's active run.
      const reviewRun = isThree(currentSource()) ? {...run(), questionResults:{...run().questionResults}, stats:{...run().stats}} : INITIAL_RUN('THR-C01');
      recordQuestion({...state, run:reviewRun}, q.questionId, draft.answer);
    }
    delete meta().threeAnswerDraft;
    save(); render(); return true;
  }
  const beforeComplete = complete;
  complete = function() {
    const id = resultChapterId || run().currentChapter, info = CHAPTERS[id];
    if (info?.threeStoryVersion !== 3) return beforeComplete();
    const read = book().readSceneIds.filter(sceneId => runtime.sources.get(sceneId)?.chapterId === id).length;
    const questions = runtime.exams.schedule.filter(row=>row.playMode==='first'&&runtime.sources.get(row.quizAfterSceneId)?.chapterId===id);
    const answered = questions.filter(row=>book().answeredQuestionIds.includes(row.officialQuestionId)).length;
    return '<section class="complete ancient-complete three-complete-result"><div class="eyebrow">CHAPTER '+info.number+'</div><h1>'+esc(info.title)+'</h1><p>'+read+'개의 장면을 읽고, '+answered+'개의 기출을 기록했습니다.</p><button class="secondary" data-action="three-recordbook">기록책과 선택 복습</button>'+resultFooter(id)+'</section>';
  };

  document.addEventListener('click', event => {
    const button = event.target.closest('button'), source = currentSource();
    if (button?.dataset.threeAnswer !== undefined && activeQuestion()?.threeStoryVersion === 3) {
      event.stopImmediatePropagation(); event.preventDefault?.();
      if (button.disabled) return;
      const answer = Number(button.dataset.threeAnswer), q = activeQuestion();
      if (!Number.isInteger(answer) || answer < 0 || answer >= q.choices.length) return;
      meta().threeAnswerDraft = {questionId:q.questionId,answer}; save(); render(); return;
    }
    if (button?.dataset.action === 'three-submit') {
      event.stopImmediatePropagation(); event.preventDefault?.(); if (!button.disabled) submitAnswer(); return;
    }
    if (button?.dataset.action === 'quiz-next' && run().threeCheckpoint && activeQuestion()?.threeStoryVersion === 3) {
      event.stopImmediatePropagation(); event.preventDefault?.(); continueStoryQuestion(); return;
    }
    if (!isThree(source) || screen !== 'game' || modal || button?.disabled) return;
    if (button?.dataset.choice !== undefined) {
      event.stopImmediatePropagation(); event.preventDefault?.(); if (lockInput()) choose(Number(button.dataset.choice)); return;
    }
    if (button && !['advance-dialogue','next','result-next'].includes(button.dataset.action)) return;
    if (!button && !event.target.closest('.conversation-game')) return;
    event.stopImmediatePropagation(); event.preventDefault?.();
    if (lockInput()) advance();
  }, true);
  globalThis.THREE_STORY_UI_READY = true;
  globalThis.THREE_PRELOAD_PLAN = preloadThreeAssets;
  globalThis.THREE_COMPLETE_ACTIONS = {book,phaseState,phaseEntries,advance,choose,checkpoint,advanceScene,switchPhase,startReview,
    unlockLearnedQuestions,currentSchedule,safeExplanation,submitAnswer,openQueuedQuestion,currentSource};
  globalThis.THREE_PREVIEW_ACTIONS = globalThis.THREE_COMPLETE_ACTIONS;
}
