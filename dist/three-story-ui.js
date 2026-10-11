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
  function showGame() { screen = 'game'; save(); render(); }
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
    const answered = new Set(book().answeredQuestionIds);
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
    if (finishOpeningTyping()) return true;
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
    if (finishOpeningTyping()) return false;
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

  // Retain the protagonist and the last present NPC; record voices never become a live standing character.
  function threePortrait(line, active) {
    const portraitId = resolvedPortraitId(line), portrait = PORTRAITS[portraitId], sprite = portrait?.sprite;
    if (!sprite?.sourceRect) return stagePortrait({...line,show:true,presentation:'standing'},line.position,active);
    const rect = sprite.sourceRect, width = sprite.sheetWidth, height = sprite.sheetHeight;
    const size = (width / rect.width * 100) + '% ' + (height / rect.height * 100) + '%';
    const position = (rect.x / (width - rect.width) * 100) + '% ' + (rect.y / (height - rect.height) * 100) + '%';
    const imageStyle = "background-image:url('"+portrait.src+"');background-size:"+size+";background-position:"+position+";transform:scaleX("+(portrait.flipX?-1:1)+")";
    return '<div class="stage-character three-atlas-character stage-'+line.position+' '+(active?'active':'listening')+'" data-character-id="'+esc(line.characterId)+'" data-position="'+line.position+'" data-portrait="'+esc(portraitId)+'" data-character-framing="upper-body" style="aspect-ratio:'+rect.width+'/'+rect.height+'" role="img" aria-label="'+esc(line.characterName)+'"><span class="three-atlas-image" style="'+imageStyle+'"></span></div>';
  }
  const beforeStage = characterStage;
  characterStage = function(visible, source, complete, pending, assetId, allEntries, cursor) {
    if (!isThree(source)) return beforeStage(visible, source, complete, pending, assetId, allEntries, cursor);
    const entries = allEntries || phaseEntries(source), index = Math.max(0, Math.min((cursor || run().dialogueCursor || 1) - 1, entries.length - 1));
    const active = entries[index], current = phaseState(source), authored = source.threeSource;
    const context = active?.presentationContext || authored.presentationContext || 'scene';
    const history = [...(current.phase === 'branch' || current.phase === 'join' ? source.dialogues : []),
      ...(current.phase === 'join' && current.choiceIndex !== null ? source.choices[current.choiceIndex]?.resultDialogues || [] : []), ...entries.slice(0,index+1)];
    let npc = [...history].reverse().find(line => line.speakerType === 'npc' && line.presentationContext !== 'record');
    if (!npc && !source.isPrologue && context !== 'record') npc = source.dialogues.find(line => line.speakerType === 'npc' && line.presentationContext !== 'record');
    let player = [...history].reverse().find(line => line.speakerType === 'player');
    if (!player && authored.cast.includes('서아')) player = runtime.convert(authored, {speaker:'서아',text:'',kind:'dialogue',expression:'neutral'});
    if (context === 'record') npc = null;
    const cast = [...(npc ? [{...npc, position:'left'}] : []), ...(player ? [{...player, position:'right'}] : [])];
    return '<div class="character-stage" data-slot-mode="three-conversation" data-presentation-context="'+esc(context)+'" aria-hidden="true">' + cast.map(line => threePortrait(line, line.characterId === active?.characterId)).join('') + '</div>';
  };
  function bubble(entry, index) {
    const record = entry.threeKind === 'record' || entry.presentationContext === 'record';
    const side = entry.speakerType === 'player' ? 'right' : 'left';
    return '<article class="speech-bubble three-bubble '+(record?'three-record-line':entry.speakerType==='narration'?'three-narration':side)+'" data-dialogue-index="'+index+'" data-line-id="'+esc(entry.lineId)+'" data-speaker-type="'+esc(entry.speakerType)+'" data-character-id="'+esc(entry.characterId)+'" data-position="'+side+'" data-presentation-context="'+esc(entry.presentationContext||'scene')+'"><small class="three-speaker">'+esc(entry.characterName)+'</small><p>'+esc(entry.dialogue)+'</p></article>';
  }
  function prologueBook(source, cursor) {
    if (!['THR-PRO-S01','THR-PRO-S02'].includes(source.sceneId)) return '';
    const photos = globalThis.THREE_COMPLETE_ART?.sourcePhotos || [];
    const wind = source.sceneId === 'THR-PRO-S02' && cursor >= 3;
    return '<div class="three-prologue-book '+(source.sceneId==='THR-PRO-S02'?'closeup ':'')+(wind?'wind':'')+'" aria-hidden="true"><div class="three-book-leaf left-leaf"></div><div class="three-book-leaf right-leaf">'+(source.sceneId==='THR-PRO-S02'?'<span class="three-ink-trace"></span>':'')+'</div>'+photos.map((p,i)=>'<img class="three-genealogy-leaf leaf-'+i+'" src="'+esc(p.src)+'" alt="">').join('')+'</div>';
  }
  const beforeGame = game;
  game = function() {
    const source = currentSource(); if (!isThree(source)) return beforeGame();
    const current = phaseState(source), entries = phaseEntries(source), cursor = Math.max(1,Math.min(run().dialogueCursor||1,entries.length));
    const entry = entries[cursor-1], context = entry?.presentationContext || source.threeSource.presentationContext || 'scene';
    const prologue = source.isPrologue, first = source.sceneId === 'THR-PRO-S03';
    // Only the explicit last tap in PRO-S02 requests this one-render cut.
    // Re-rendering, advancing another line, or resuming PRO-S03 cannot repeat it.
    const cut = first && cursor === 1 && prologueCutPending;
    prologueCutPending = false;
    const phaseLabels = {main:'대화',choice:'서아의 대사',branch:'이어지는 대화',join:'함께 남긴 기록',hints:'기록책',quiz:'기출',finished:'이야기'};
    const raw = source.threeSource, choices = current.phase === 'choice';
    const action = current.phase === 'branch' && cursor >= entries.length ? 'result-next' : cursor >= entries.length ? 'next' : 'advance-dialogue';
    const label = cursor < entries.length ? '탭하여 계속' : current.phase === 'hints' ? '기출 펼치기' : current.phase === 'main' && source.choices?.length ? '응답 고르기' : source.completeChapter && current.phase === 'join' ? '기록을 마친다' : '이야기 계속';
    const chapterInfo = CHAPTERS[source.chapterId];
    const contextLabel = entry?.presentationLabel || (context === 'record' ? (raw.presentationLabel || '기록책 속의 자료') : '');
    const count = chapterInfo ? chapterScenes(source.chapterId).length : 3;
    const readCount = prologue ? book().readSceneIds.filter(id=>id.startsWith('THR-PRO-')).length : book().readSceneIds.filter(id=>runtime.sources.get(id)?.chapterId === source.chapterId).length;
    return '<section class="game conversation-game three-complete-game has-art layered-art '+(first?'three-wake ':'')+(cut?'three-prologue-cut ':'')+(first&&cursor>=5?'three-queue-focus ':'')+(context==='record'?'three-record-context':'')+'" data-three-scene="'+esc(source.sceneId)+'" data-three-phase="'+current.phase+'" style="'+assetStyle(source.illustrationId)+'"><div class="scene-scrim"></div>'+prologueBook(source,cursor)+'<header class="game-header"><button class="glass" data-nav="era">‹ 이야기 나가기</button><span class="glass">'+(prologue?'프롤로그':'CH.'+chapterInfo.number)+'</span><button class="glass" data-action="three-recordbook">기록책</button></header><div class="scene-title"><small>'+(raw.showDateAndLocation===false?'':esc(source.location))+'</small><h2>'+esc(source.title)+'</h2>'+(!prologue?'<p class="three-date">'+esc(source.threeDateLabel)+'</p>':'')+'</div>'+characterStage(entries.slice(0,cursor),source,cursor>=entries.length,run().pending,source.illustrationId,entries,cursor)+'<section class="conversation-panel" aria-label="대화"><div class="three-context-label" '+(contextLabel?'':'hidden')+'>'+esc(contextLabel)+'</div><div class="dialogue-log">'+(entry?bubble(entry,cursor-1):'')+'</div><div class="dialogue-step"><span>'+phaseLabels[current.phase]+' · '+cursor+' / '+entries.length+'</span></div>'+(choices?'<div class="three-dialogue-choices" role="group" aria-label="서아가 할 말">'+source.choices.map((choice,index)=>'<button class="choice" data-choice="'+index+'"><span>'+esc(choice.label)+'</span></button>').join('')+'</div>':'<button class="primary next advance-dialogue" data-action="'+action+'">'+label+' <b>›</b></button>')+'<p class="conversation-sub">'+(prologue&&source.sceneId==='THR-PRO-S01'?'화면을 누르면 서아의 이야기가 이어집니다.':context==='record'?'서아가 기록책에서 확인하는 내용입니다.':'')+'</p></section><div class="chapter-progress" aria-label="읽은 장면 '+readCount+' / '+count+'">'+Array.from({length:count},(_,i)=>'<i class="'+(i<readCount?'on':'')+'"></i>').join('')+'</div></section>';
  };
  const beforeTyping = syncOpeningTyping;
  syncOpeningTyping = function() {
    const source = currentSource(); if (!isThree(source)) return beforeTyping();
    if (typingTimer) clearTimeout(typingTimer); typingLine = null;
    if (screen !== 'game' || modal || phaseState(source).phase === 'choice') return;
    const entries = phaseEntries(source), index = Math.max(0,Math.min(run().dialogueCursor||1,entries.length)-1), entry = entries[index];
    const element = document.querySelector('[data-dialogue-index="'+index+'"] p');
    if (!entry || !element || run().threeTypedLineId === entry.lineId) return;
    typingLine = {element, text:entry.dialogue, threeLineId:entry.lineId};
    element.textContent = '';
    let count = 0;
    const tick = () => {
      if (!typingLine || typingLine.element !== element) return;
      element.textContent = entry.dialogue.slice(0,++count);
      if (count >= entry.dialogue.length) { finishOpeningTyping(); return; }
      typingTimer = setTimeout(tick, 22);
    };
    tick();
  };
  const beforeFinishTyping = finishOpeningTyping;
  finishOpeningTyping = function() {
    const lineId = typingLine?.threeLineId;
    const result = beforeFinishTyping();
    if (lineId && isThree(currentSource())) { run().threeTypedLineId = lineId; save(); }
    return result;
  };

  const beforeQuiz = quiz;
  quiz = function() {
    const q = activeQuestion(); if (q?.threeStoryVersion !== 3) return beforeQuiz();
    const selected = quizMode === 'story' ? run().questionAnswer : reviewAnswer;
    const done = Number.isInteger(selected), draft = meta().threeAnswerDraft?.questionId === q.questionId ? meta().threeAnswerDraft.answer : null;
    const row = currentSchedule(q), queue = run().threeCheckpoint ? run().questionQueue || [] : [], index = run().questionQueueIndex || 0;
    return '<section class="editorial-quiz three-complete-quiz" data-three-question="'+esc(q.officialQuestionId)+'"><header class="quiz-top"><button data-nav="era" aria-label="시대 선택으로">‹</button><span>삼국 · 기록에서 기출로</span><button data-action="three-recordbook">기록책</button></header><div class="exam-source-row"><span class="official-pill">실제 한능검 기출</span><span>'+esc(q.threeExam.label)+'</span>'+(queue.length>1?'<span>'+(index+1)+' / '+queue.length+'</span>':'')+'</div><h1 class="quiz-question-title">'+esc(q.threeExam.label)+'</h1>'+officialQuestionFigure(q,q.threeExam.label)+'<p class="three-answer-instruction">원문 이미지의 보기를 읽고 번호를 골라 주세요.</p><div class="ed-answer-options three-number-options" role="group" aria-label="답 번호 선택">'+q.choices.map((_,i)=>'<button class="choice '+(done&&i===q.answer?'correct':done&&i===selected?'wrong':!done&&draft===i?'picked':'')+'" data-three-answer="'+i+'" aria-pressed="'+(!done&&draft===i)+'" '+(done?'disabled':'')+'><span class="answer-number">'+(i+1)+'</span><span>'+(i+1)+'번</span>'+(done&&i===q.answer?'<b>✓</b>':'')+'</button>').join('')+'</div>'+(done?'<div class="feedback" role="status"><h2>'+(selected===q.answer?'기억이 이어졌다.':'다시 기록해 둘 순간.')+'</h2><p><b>정답 '+(q.answer+1)+'번</b></p><p class="three-safe-explanation">'+esc(safeExplanation(q,row))+'</p>'+((q.threeExam.fullExplanationAfterSceneId&&!book().readSceneIds.includes(q.threeExam.fullExplanationAfterSceneId))?'<p class="three-delayed-explanation">아직 만나지 않은 사건의 비교 해설은 뒤의 기록을 읽은 후 열립니다.</p>':'')+'</div><button class="primary next" data-action="quiz-next">'+(queue.length>index+1?'다음 문제':run().threeCheckpoint?.kind==='review'?'기록책으로 돌아가기':'이야기 계속')+'</button>':'<button class="confirm-answer" data-action="three-submit" '+(draft===null?'disabled':'')+'>답 확인하기</button>')+'<details class="three-exam-source"><summary>문항 출처</summary><p>국사편찬위원회 한국사능력검정시험 · '+esc(q.threeExam.sourceFilename)+' · '+q.threeExam.sourcePage+'쪽</p><a href="'+esc(q.threeExam.originalQuestionPdfUrl)+'" target="_blank" rel="noopener">원본 문제지</a> · <a href="'+esc(q.threeExam.officialAnswerUrl)+'" target="_blank" rel="noopener">공식 정답표</a></details></section>';
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
    if (typingLine) { finishOpeningTyping(); return; }
    if (lockInput()) advance();
  }, true);
  globalThis.THREE_STORY_UI_READY = true;
  globalThis.THREE_COMPLETE_ACTIONS = {book,phaseState,phaseEntries,advance,choose,checkpoint,advanceScene,switchPhase,startReview,
    unlockLearnedQuestions,currentSchedule,safeExplanation,submitAnswer,openQueuedQuestion,currentSource};
  globalThis.THREE_PREVIEW_ACTIONS = globalThis.THREE_COMPLETE_ACTIONS;
}
