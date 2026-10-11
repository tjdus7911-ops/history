/* Keep the approved Three Kingdoms saves separate from every older era/version. */
if (globalThis.CORE_APP_READY === true && globalThis.EDITORIAL_UI_READY === true && globalThis.THREE_SAVE_V3) {
  const api = globalThis.THREE_SAVE_V3, runtime = globalThis.THREE_STORY_RUNTIME;
  const {eraId,progressKey,storageKey,contentVersion,copy,ownsChapter,ownsQuestion,
    familyRun,validRun,validResume,validBook,ensureBook,identifyRun,archive} = api;
  const archiveStorageKey = 'lived-history-three-kingdoms-archives-v3';
  const legacyStorageKeys = ['lived-history-three-kingdoms-v2','lived-history-three-kingdoms'];
  for (const registry of [HISTORY_SEASONS,LEARNING_ERAS]) {
    const info = registry.find(item => item.id === eraId);
    if (info) Object.assign(info,{progressKey,protagonistId:runtime.protagonist,
      protagonistLabel:'삼국편 여성 주인공 · 서아',years:'삼국 성장 — 후삼국',
      description:'서아의 기록책으로 만나는 삼국·가야·통일신라·발해·후삼국의 23개 이야기.',
      chapterIds:eraChapters(eraId).filter(chapter => ownsChapter(chapter.chapterId)).map(chapter => chapter.chapterId),
      characterIds:[...new Set([runtime.protagonist,...runtime.people.keys()])],
      contentVersion:3,contentRevision:contentVersion});
  }
  function readStorage(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function writeStorage(key, value) {
    try { localStorage.setItem(key,JSON.stringify(value)); return true; }
    catch { if (typeof toast === 'function') toast('저장 공간을 사용할 수 없습니다. 브라우저 설정을 확인해 주세요.'); return false; }
  }
  function restoreArchives() {
    const text = readStorage(archiveStorageKey);
    if (!text) return;
    let stored;
    try { stored = JSON.parse(text); }
    catch { archive(meta(),'unreadable-json',archiveStorageKey,{raw:text}); return; }
    if (stored?.schemaVersion !== 1 || !Array.isArray(stored.entries)) {
      archive(meta(),'unknown-schema',archiveStorageKey,stored); return;
    }
    for (const entry of stored.entries) {
      if (!entry || typeof entry.sourceKey !== 'string' || !Object.hasOwn(entry,'payload')) continue;
      const recovered = archive(meta(),entry.reasonCode,entry.sourceKey,entry.payload);
      if (entry.capturedAt) recovered.capturedAt = entry.capturedAt;
    }
  }
  let persistedArchiveSignature = null;
  function persistArchives() {
    const archives = meta().threeSaveArchives;
    if (!archives?.entries?.length) return true;
    // archive() copies immutable source payloads and adds each distinct source
    // only once. Repeated dialogue saves need not serialize those originals.
    const signature = JSON.stringify(archives.entries.map(({id,sourceKey,capturedAt,reasonCode}) => [id,sourceKey,capturedAt,reasonCode]));
    if (signature === persistedArchiveSignature) return true;
    if (!writeStorage(archiveStorageKey,archives)) return false;
    persistedArchiveSignature = signature;
    return true;
  }
  function preserveLegacySources() {
    for (const key of legacyStorageKeys) {
      const text = readStorage(key);
      if (!text) continue;
      try { archive(meta(),'legacy-content',key,JSON.parse(text)); }
      catch { archive(meta(),'unreadable-json',key,{raw:text}); }
    }
    for (const key of [eraId,'three-kingdoms-v2']) {
      const value = meta().eraProgress?.[key];
      if (value) archive(meta(),'legacy-content','eraProgress.' + key,value);
    }
  }
  function scopedMeta() {
    const m = meta(), select = (value, predicate) => Object.fromEntries(Object.entries(value || {}).filter(([id]) => predicate(id)));
    return {
      completedChapters:(m.completedChapters || []).filter(ownsChapter),
      chapterRecords:select(m.chapterRecords,ownsChapter),chapterRuns:select(m.chapterRuns,ownsChapter),
      questionRecords:select(m.questionRecords,ownsQuestion),
      wrongQuestionIds:(m.wrongQuestionIds || []).filter(ownsQuestion),
      wrongAnswers:(m.wrongAnswers || []).filter(item => ownsQuestion(item.questionId)),
      reviewedQuestionIds:(m.reviewedQuestionIds || []).filter(ownsQuestion),
      learningEvents:(m.learningEvents || []).filter(item => ownsQuestion(item.questionId)),
      threeCompleteBook:ensureBook(m)
    };
  }
  function persistIndependentResume() {
    const progress = meta().eraProgress?.[progressKey];
    if (!validResume(progress?.resume)) return false;
    // Never overwrite an unknown v3 recovery record before its original bytes
    // have been durably archived. Older v1/v2 keys are never rewritten.
    if (!persistArchives()) return false;
    return writeStorage(storageKey,{schemaVersion:3,eraId,contentVersion:3,
      contentRevision:contentVersion,progress,meta:scopedMeta()});
  }
  function mergeRecoveryMeta(stored) {
    const m = meta();
    for (const name of ['completedChapters','wrongQuestionIds','reviewedQuestionIds']) {
      const predicate = name === 'completedChapters' ? ownsChapter : ownsQuestion;
      m[name] = [...new Set([...(m[name] || []),...(stored[name] || []).filter(predicate)])];
    }
    m.questionRecords ||= {};
    for (const [id, record] of Object.entries(stored.questionRecords || {})) {
      if (!ownsQuestion(id)) continue;
      if (!m.questionRecords[id] || (record.attempts || 0) > (m.questionRecords[id].attempts || 0)) m.questionRecords[id] = copy(record);
    }
    m.chapterRecords ||= {}; m.chapterRuns ||= {};
    for (const [id, record] of Object.entries(stored.chapterRecords || {})) {
      if (!ownsChapter(id)) continue;
      if (!m.chapterRecords[id] || (record.runsCount || 0) > (m.chapterRecords[id].runsCount || 0)) m.chapterRecords[id] = copy(record);
    }
    for (const [id, records] of Object.entries(stored.chapterRuns || {})) {
      if (!ownsChapter(id) || !Array.isArray(records)) continue;
      const combined = [...(m.chapterRuns[id] || [])], ids = new Set(combined.map(item => item.runId + ':' + item.completedAt));
      for (const record of records) if (!ids.has(record.runId + ':' + record.completedAt)) combined.push(copy(record));
      m.chapterRuns[id] = combined;
    }
    const wrong = new Map((m.wrongAnswers || []).map(item => [item.questionId,item]));
    for (const item of stored.wrongAnswers || []) {
      if (!ownsQuestion(item.questionId)) continue;
      if (!wrong.has(item.questionId) || String(item.answeredAt || '') > String(wrong.get(item.questionId).answeredAt || '')) wrong.set(item.questionId,copy(item));
    }
    m.wrongAnswers = [...wrong.values()];
    const events = [...(m.learningEvents || [])], eventIds = new Set(events.map(item => api.fingerprint(item)));
    for (const event of stored.learningEvents || []) {
      if (!ownsQuestion(event.questionId)) continue;
      const key = api.fingerprint(event);
      if (!eventIds.has(key)) { events.push(copy(event)); eventIds.add(key); }
    }
    m.learningEvents = events;
    const book = ensureBook(m), recovered = stored.threeCompleteBook;
    if (validBook(recovered)) {
      for (const key of ['readSceneIds','answeredQuestionIds','unlockedQuestionIds','hintReadIds']) book[key] = [...new Set([...book[key],...recovered[key]])];
      book.choiceBySceneId = {...recovered.choiceBySceneId,...book.choiceBySceneId};
    }
  }
  function recoverIndependentResume() {
    const previous = meta().eraProgress?.[progressKey];
    if (validResume(previous?.resume) && !previous.resume.run.threeNeedsResumeRecovery) return false;
    if (previous && !validResume(previous.resume)) {
      archive(meta(),'invalid-resume','eraProgress.' + progressKey,previous);
      delete meta().eraProgress[progressKey];
    }
    const text = readStorage(storageKey);
    if (!text) return false;
    let stored;
    try { stored = JSON.parse(text); }
    catch { archive(meta(),'unreadable-json',storageKey,{raw:text}); persistArchives(); return false; }
    if (stored?.schemaVersion !== 3 || stored.eraId !== eraId || stored.contentVersion !== 3) {
      archive(meta(),'unknown-schema',storageKey,stored); persistArchives(); return false;
    }
    if (stored.contentRevision !== contentVersion) {
      archive(meta(),'content-revision',storageKey,stored); persistArchives(); return false;
    }
    if (!validResume(stored.progress?.resume) || !validBook(stored.meta?.threeCompleteBook)) {
      archive(meta(),'invalid-resume',storageKey,stored); persistArchives(); return false;
    }
    meta().eraProgress ||= {};
    meta().eraProgress[progressKey] = copy(stored.progress);
    mergeRecoveryMeta(stored.meta);
    return true;
  }

  const beforeRemember = rememberEraProgress;
  rememberEraProgress = function() {
    if (!familyRun(mainRun())) return beforeRemember();
    if (!validRun(mainRun())) {
      archive(meta(),'invalid-resume','active-three-run',{run:copy(run()),mainRun:copy(state.mainRun)});
      return;
    }
    const m = meta(), previous = m.eraProgress?.[progressKey] || {};
    // In a cross-era replay the actual Three Kingdoms main run remains its
    // recovery target; the other era's active replay stays in the shared save.
    const resume = ownsChapter(run().currentChapter)
      ? {run:copy(run()),mainRun:copy(state.mainRun)}
      : {run:copy(mainRun()),mainRun:null};
    if (!validResume(resume)) return;
    m.eraProgress ||= {};
    m.eraProgress[progressKey] = {...previous,contentVersion:3,contentRevision:contentVersion,
      lastChapter:mainRun().currentChapter,lastScene:mainRun().storyId,progress:eraProgress(eraId),
      resume,updatedAt:previous.updatedAt || null};
    if (['game','quiz','complete'].includes(screen) && mainRun().started) {
      m.eraProgress[progressKey].updatedAt = new Date().toISOString(); m.lastLearningEra = eraId;
    }
  };
  const beforeSave = save;
  save = function() {
    identifyRun(run()); identifyRun(state.mainRun); ensureBook(meta());
    beforeSave();
    persistIndependentResume();
  };
  const beforeFinish = finishChapter;
  finishChapter = function(target) {
    if (!ownsChapter(target.run.currentChapter)) return beforeFinish(target);
    target.meta.eraProgress ||= {};
    const existed = Object.hasOwn(target.meta.eraProgress,eraId), legacy = copy(target.meta.eraProgress[eraId]);
    delete target.meta.eraProgress[eraId];
    try {
      const result = beforeFinish(target), completed = target.meta.eraProgress[eraId], own = target.meta.eraProgress[progressKey] || {};
      target.meta.eraProgress[progressKey] = {...own,contentVersion:3,contentRevision:contentVersion,
        completed:!!completed?.completed,progress:completed?.progress || 0,
        ...(completed?.completedAt?{completedAt:completed.completedAt}:{})};
      return result;
    } finally {
      if (existed) target.meta.eraProgress[eraId] = legacy; else delete target.meta.eraProgress[eraId];
    }
  };
  const beforeResume = resumeEra;
  resumeEra = function(id) {
    if (id !== eraId) return beforeResume(id);
    const current = mainRun();
    if (!ownsChapter(current.currentChapter) || !validRun(current)) rememberEraProgress();
    recoverIndependentResume();
    const saved = meta().eraProgress?.[progressKey]?.resume;
    if (!validRun(mainRun()) || !ownsChapter(mainRun().currentChapter)) {
      if (validResume(saved)) { state.run = copy(saved.run); state.mainRun = copy(saved.mainRun); }
      else { state.mainRun = null; state.run = api.freshRun(true); }
    }
    delete run().threeNeedsResumeRecovery;
    selectedEra = eraId; meta().selectedLearningEra = eraId;
    save();
    return playMain();
  };
  function restartFromPrologue() {
    rememberEraProgress();
    state.mainRun = null; state.run = api.freshRun(true); ensureBook(meta());
    selectedEra = eraId; meta().selectedLearningEra = eraId;
    save();
    return playMain();
  }
  function archiveNotices() {
    return (meta().threeSaveArchives?.entries || []).map(entry => ({
      id:entry.id,reason:entry.reason,reasonCode:entry.reasonCode,sourceKey:entry.sourceKey,
      chapterId:entry.payload?.currentChapter || entry.payload?.run?.currentChapter || entry.payload?.progress?.lastChapter || null,
      sceneId:entry.payload?.storyId || entry.payload?.run?.storyId || entry.payload?.progress?.lastScene || null
    }));
  }
  restoreArchives(); preserveLegacySources();
  const recoveryPending = run().threeNeedsResumeRecovery;
  recoverIndependentResume();
  if (recoveryPending && validResume(meta().eraProgress?.[progressKey]?.resume) &&
      !meta().eraProgress[progressKey].resume.run.threeNeedsResumeRecovery) {
    state.run = copy(meta().eraProgress[progressKey].resume.run);
    state.mainRun = copy(meta().eraProgress[progressKey].resume.mainRun);
  }
  delete run().threeNeedsResumeRecovery;
  ensureBook(meta()); identifyRun(run()); identifyRun(state.mainRun);
  persistArchives();
  globalThis.THREE_ERA_ISOLATION = {eraId,progressKey,storageKey,archiveStorageKey,
    validResume,recoverIndependentResume,persistIndependentResume,archiveNotices,restartFromPrologue};
}
