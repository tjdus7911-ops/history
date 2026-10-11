/* Apply the approved Three learning gates at the older study entry points.
   Independent official exams remain open; only their Three-context explanation
   can be delayed, and fresh official attempts share the same question identity. */
if (globalThis.CORE_APP_READY === true && globalThis.THREE_STORY_RUNTIME?.version === 3 &&
    globalThis.THREE_COMPLETE_ACTIONS && globalThis.THREE_SAVE_V3) {
  const runtime = globalThis.THREE_STORY_RUNTIME, actions = globalThis.THREE_COMPLETE_ACTIONS;
  const placements = [...runtime.exams.schedule,...runtime.exams.additionalCandidates];
  const officialIdByEdition = new Map([...runtime.questionByOfficialId].map(([id,q]) =>
    [[q.examRound,q.examLevel,q.questionNumber].join(':'),id]));
  const read = () => new Set(actions.book().readSceneIds);
  const isThreeQuestion = q => q?.threeStoryVersion === 3;
  function officialId(question) {
    if (!question) return null;
    return officialIdByEdition.get([question.examRound,question.examLevel,question.questionNumber].join(':')) || null;
  }
  function canPractice(question) {
    if (!isThreeQuestion(question)) return true;
    const learned = read(), id = question.officialQuestionId;
    return placements.some(row => row.officialQuestionId === id && learned.has(row.quizAfterSceneId));
  }
  function canRecall(question) {
    return !isThreeQuestion(question) || read().has(question.relatedSceneId);
  }
  function allowLegacyAction(data) {
    const id = data?.practice || data?.review || data?.storyMemory;
    if (!id) return true;
    const question = QUESTIONS.find(q => q.questionId === id);
    return data.storyMemory ? canRecall(question) : canPractice(question);
  }
  function threeContext(context) {
    // An explicit independent era filter takes precedence over the last story
    // the learner opened. Other eras retain their existing complete solutions.
    if (context?.explicitEra && !['all','ancient',runtime.eraId].includes(context.explicitEra)) return false;
    if (typeof selectedEra === 'string') return selectedEra === runtime.eraId;
    const current = typeof mainRun === 'function' ? mainRun() : run();
    return CHAPTERS[current?.currentChapter]?.threeStoryVersion === 3;
  }
  function explanation(question, fallback, context = {}) {
    const id = officialId(question), installed = runtime.questionByOfficialId.get(id);
    if (!installed) return fallback;
    if (isThreeQuestion(question)) return actions.safeExplanation(installed);
    const gate = installed.threeExam?.fullExplanationAfterSceneId;
    if (gate && !read().has(gate) && threeContext(context)) return actions.safeExplanation(installed);
    return fallback;
  }
  function recordOfficialAttempt(id, answer) {
    const question = runtime.questionByOfficialId.get(id);
    if (!question || !Number.isInteger(answer) || answer < 0 || answer >= question.choices.length) return;
    // This is called only after a new independent attempt was recorded. Old
    // counters never imply that the approved manuscript has been completed.
    const value = globalThis.THREE_SAVE_V3.ensureBook(meta());
    if (!value.answeredQuestionIds.includes(id)) value.answeredQuestionIds.push(id);
  }
  globalThis.THREE_LEARNING_BOUNDARY = {officialId,canPractice,canRecall,allowLegacyAction,explanation,recordOfficialAttempt};

  if (typeof eraExamList === 'function') {
    const previous = eraExamList;
    eraExamList = function(id) {
      if (id !== runtime.eraId) return previous(id);
      actions.unlockLearnedQuestions();
      const questions = [...runtime.questionByOfficialId.values()].filter(canPractice);
      if (!questions.length) return '<p class="ed-empty">기출에 필요한 장면을 읽으면 문제가 열립니다.</p>';
      return '<div class="ed-exam-list">'+questions.map(q => {
        const record = meta().questionRecords[q.questionId];
        return '<article class="ed-exam-row"><button data-practice="'+q.questionId+'"><img loading="lazy" src="'+esc(q.sourceQuestionImage)+'" alt="원본 문항 미리보기"><span><small>'+esc(q.threeExam.label)+'</small><b>'+esc(q.sourceQuestionText||q.question)+'</b><small class="'+(record?.lastCorrect?'last-correct':'')+'">'+(!record?'미풀이':record.lastCorrect?'최근 정답':'최근 오답')+'</small></span><span>›</span></button></article>';
      }).join('')+'</div>';
    };
  }
}
