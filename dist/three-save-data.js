/* Preserve versioned Three Kingdoms runs before the core save migration runs. */
if (globalThis.THREE_STORY_RUNTIME?.version === 3) {
  const runtime = globalThis.THREE_STORY_RUNTIME;
  const version = 3, eraId = 'three-kingdoms', progressKey = 'three-kingdoms-v3';
  const storageKey = 'lived-history-three-kingdoms-v3';
  const contentVersion = runtime.contentVersion;
  const firstChapterId = 'THR-C01';
  const phases = new Set(['main','choice','branch','join','hints','quiz','finished']);
  const copy = value => value == null ? value : JSON.parse(JSON.stringify(value));
  const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
  const ownsChapter = id => CHAPTERS[id]?.threeStoryVersion === version;
  const ownsScene = id => runtime.sources.has(id);
  const questionIds = new Set([...runtime.questionByOfficialId.values()].map(question => question.questionId));
  const ownsQuestion = id => questionIds.has(id);
  const ownsOfficialQuestion = id => runtime.questionByOfficialId.has(id);
  const familyChapter = id => ownsChapter(id) || CHAPTERS[id]?.eraId === eraId ||
    /^(?:three[-_](?:v\d+[-_])?ch\d+|THR-C\d{2})$/.test(String(id || ''));
  const familyRun = value => !!value && (familyChapter(value.currentChapter) || value.contentEra === eraId);
  const emptyBook = () => ({version,contentVersion,readSceneIds:[],answeredQuestionIds:[],unlockedQuestionIds:[],hintReadIds:[],choiceBySceneId:{}});
  const stringArray = value => Array.isArray(value) && value.every(item => typeof item === 'string');
  const validBook = value => object(value) && value.version === version && value.contentVersion === contentVersion &&
    stringArray(value.readSceneIds) && value.readSceneIds.every(ownsScene) &&
    stringArray(value.answeredQuestionIds) && value.answeredQuestionIds.every(ownsOfficialQuestion) &&
    stringArray(value.unlockedQuestionIds) && value.unlockedQuestionIds.every(ownsOfficialQuestion) && stringArray(value.hintReadIds);
  function validStoryState(value) {
    if (!object(value) || value.version !== version || !object(value.scenes)) return false;
    return Object.entries(value.scenes).every(([id, item]) => {
      if (!ownsScene(id) || !object(item) || !phases.has(item.phase)) return false;
      const choices = runtime.sources.get(id).choices || [];
      const hasChoice = Number.isInteger(item.choiceIndex) && item.choiceIndex >= 0 && item.choiceIndex < choices.length;
      if (item.choiceIndex != null && !hasChoice) return false;
      if (item.phase === 'choice' && !choices.length) return false;
      return item.phase !== 'branch' || hasChoice;
    });
  }
  function validRun(value) {
    if (!object(value) || !ownsChapter(value.currentChapter) || value.contentVersion !== version ||
        value.threeContentVersion !== contentVersion || !validStoryState(value.threeStoryState)) return false;
    const source = runtime.sources.get(value.pending?.sourceSceneId || value.storyId);
    const review = value.threeCheckpoint?.kind === 'review' &&
      value.threeCheckpoint.sceneId === source?.sceneId &&
      value.threeCheckpoint.returnTo?.values?.currentChapter === value.currentChapter;
    if (!source || (source.isPrologue ? value.currentChapter !== firstChapterId : source.chapterId !== value.currentChapter && !review)) return false;
    if (!ownsScene(value.storyId) || value.pending && !ownsScene(value.pending.sourceSceneId)) return false;
    const current = value.threeStoryState.scenes[source.sceneId];
    if (current?.phase === 'branch') {
      const selected = STORIES[source.sceneId]?.choices?.[current.choiceIndex];
      // A branch resumes only the spoken line and replies actually selected.
      // Invalid source evidence is archived by migration before a safe restart.
      if (!selected || !object(value.pending) || value.storyId !== source.sceneId ||
          value.pending.sourceSceneId !== source.sceneId || value.pending.choiceId !== selected.choiceId ||
          value.pending.threeChoiceId !== selected.threeChoiceId || value.pending.nextStoryId !== selected.nextStoryId ||
          !Array.isArray(value.pending.resultDialogues) || !value.pending.resultDialogues.length ||
          JSON.stringify(value.pending.resultDialogues) !== JSON.stringify(selected.resultDialogues) ||
          value.dialogueCursor > selected.resultDialogues.length) return false;
    } else if (value.pending != null) return false;
    if (value.activeQuestionId != null && !ownsQuestion(value.activeQuestionId)) return false;
    if (!Array.isArray(value.questionQueue) || value.questionQueue.some(id => !ownsQuestion(id))) return false;
    if (!Number.isInteger(value.questionQueueIndex) || value.questionQueueIndex < 0 || value.questionQueueIndex > value.questionQueue.length) return false;
    if (!Number.isInteger(value.dialogueCursor) || value.dialogueCursor < 1) return false;
    if (value.threeHintEntries != null && !Array.isArray(value.threeHintEntries)) return false;
    if (value.threeCheckpoint) {
      const point = value.threeCheckpoint;
      if (!object(point) || !ownsScene(point.sceneId) || !['first','review'].includes(point.kind) ||
          !Array.isArray(point.scheduleIds) || point.scheduleIds.some(id => !runtime.schedules.has(id))) return false;
    }
    return true;
  }
  const validResume = value => object(value) && validRun(value.run) && (!value.mainRun || validRun(value.mainRun));
  const archiveReasons = {
    'legacy-content':'이전 삼국편의 진행 기록을 보관했습니다. 새 대본은 프롤로그부터 시작합니다.',
    'content-revision':'이전 대본 버전의 진행 기록을 보관했습니다. 현재 대본의 완료 상태로 옮기지 않았습니다.',
    'unknown-schema':'확인할 수 없는 삼국편 저장 형식을 원본 그대로 보관했습니다.',
    'invalid-resume':'연결할 수 없는 삼국편 이어하기 기록을 보관했습니다.',
    'invalid-book':'현재 대본과 맞지 않는 기록책 상태를 보관했습니다.',
    'unreadable-json':'읽을 수 없는 삼국편 저장 문자열을 원본 그대로 보관했습니다.'
  };
  function fingerprint(value) {
    const text = JSON.stringify(value); let hash = 2166136261;
    for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
    return (hash >>> 0).toString(16) + '-' + text.length;
  }
  function archive(m, reasonCode, sourceKey, payload) {
    m.threeSaveArchives ||= {schemaVersion:1,entries:[]};
    if (!Array.isArray(m.threeSaveArchives.entries)) m.threeSaveArchives = {schemaVersion:1,entries:[]};
    const id = fingerprint({sourceKey,payload});
    let entry = m.threeSaveArchives.entries.find(item => item.id === id && item.sourceKey === sourceKey && JSON.stringify(item.payload) === JSON.stringify(payload));
    if (!entry) {
      entry = {id,reasonCode,reason:archiveReasons[reasonCode] || reasonCode,sourceKey,
        capturedAt:new Date().toISOString(),payload:copy(payload)};
      m.threeSaveArchives.entries.push(entry);
    }
    return entry;
  }
  function ensureBook(m) {
    if (!validBook(m.threeCompleteBook)) {
      if (m.threeCompleteBook != null) archive(m,'invalid-book','meta.threeCompleteBook',m.threeCompleteBook);
      m.threeCompleteBook = emptyBook();
    }
    return m.threeCompleteBook;
  }
  function identifyRun(value, fresh = false) {
    if (!value || !ownsChapter(value.currentChapter)) return value;
    value.contentEra = eraId; value.contentVersion = version; value.threeContentVersion = contentVersion;
    value.protagonistId = runtime.protagonist;
    value.flags ||= {}; value.relations ||= {}; value.trust ||= {};
    const modern = value.storyId === 'THR-PRO-S01' || value.storyId === 'THR-PRO-S02';
    value.playerOutfit = modern ? 'three_modern' : 'three_traveler';
    for (const key of ['receivedGoryeoClothesFromDoyun','wearingModernClothes']) delete value.flags[key];
    value.flags.threeRecordbook = true;
    for (const key of ['doyun','hyunwoo']) { delete value.relations[key]; delete value.trust[key]; }
    delete value.doyunLegacy;
    value.characterStates = {
      ...Object.fromEntries(Object.entries(value.characterStates || {}).filter(([key]) => key.startsWith('three_v3_'))),
      player:{...(value.characterStates?.player || {}),characterId:runtime.protagonist,characterAge:23,pose:'standing',outfit:value.playerOutfit}
    };
    value.inventory = (value.inventory || []).filter(item => !['modern-clothes','goryeo-commoner-clothes','three-v2-recordbook'].includes(item.id));
    if (!value.inventory.some(item => item.id === 'three-v3-recordbook')) value.inventory.push({id:'three-v3-recordbook',status:'carried',source:runtime.entrySceneId});
    value.sharedEvents = (value.sharedEvents || []).filter(event => !['met_doyun_ch01','received_clothes_from_doyun'].includes(event));
    if (fresh || !value.threeStoryState) value.threeStoryState = {version,scenes:{}};
    if (fresh) { value.threeCheckpoint = null; value.threeHintEntries = []; delete value.threeNeedsResumeRecovery; delete value.threeTypedLineId; }
    return value;
  }
  function freshRun(started = false) {
    const value = INITIAL_RUN(firstChapterId);
    value.started = started;
    identifyRun(value, true);
    value.chapterStart = chapterSnapshot(value);
    return value;
  }
  const ownEntries = value => Object.fromEntries(Object.entries(value || {}).filter(([id]) => ownsChapter(id)));
  function removeUntrustedCurrentProgress(m) {
    m.completedChapters = (m.completedChapters || []).filter(id => !ownsChapter(id));
    for (const name of ['chapterRecords','chapterRuns']) m[name] = Object.fromEntries(Object.entries(m[name] || {}).filter(([id]) => !ownsChapter(id)));
    if (m.eraProgress) delete m.eraProgress[progressKey];
  }
  const beforeMigration = migrateSave;
  migrateSave = function(raw) {
    const preserved = copy(raw), result = beforeMigration(copy(raw));
    if (!preserved?.run || !preserved.meta) { ensureBook(result.meta); return result; }
    // The base migrator repairs Goryeo clothing and old chapter records. Preserve
    // this era's source records exactly, including older hidden namespaces.
    for (const collection of ['chapterRecords','chapterRuns']) {
      result.meta[collection] ||= {};
      for (const [id, value] of Object.entries(preserved.meta[collection] || {})) if (familyChapter(id)) result.meta[collection][id] = copy(value);
    }
    if (preserved.meta.threeSaveArchives) result.meta.threeSaveArchives = copy(preserved.meta.threeSaveArchives);
    const candidates = [preserved.run,preserved.mainRun].filter(familyRun);
    const hasCurrentRecords = (preserved.meta.completedChapters || []).some(ownsChapter) || Object.keys(ownEntries(preserved.meta.chapterRecords)).length > 0;
    const trustedBook = validBook(preserved.meta.threeCompleteBook);
    const untrustedCurrent = candidates.some(value => ownsChapter(value.currentChapter) && (!validRun(value) || !trustedBook)) || (hasCurrentRecords && !trustedBook);
    if (untrustedCurrent) {
      archive(result.meta,'unknown-schema','main-save.three-current',{
        run:familyRun(preserved.run)?preserved.run:null,mainRun:familyRun(preserved.mainRun)?preserved.mainRun:null,
        completedChapters:(preserved.meta.completedChapters || []).filter(ownsChapter),
        chapterRecords:ownEntries(preserved.meta.chapterRecords),chapterRuns:ownEntries(preserved.meta.chapterRuns),
        progress:preserved.meta.eraProgress?.[progressKey] || null,book:preserved.meta.threeCompleteBook || null
      });
      removeUntrustedCurrentProgress(result.meta);
    }
    for (const name of ['run','mainRun']) {
      const value = preserved[name];
      if (!familyRun(value)) continue;
      if (validRun(value) && !untrustedCurrent) result[name] = copy(value);
      else {
        archive(result.meta,value.contentVersion === version ? (value.threeContentVersion !== contentVersion?'content-revision':'unknown-schema') : 'legacy-content','main-save.' + name,value);
        result[name] = name === 'run' ? freshRun(false) : null;
        if (name === 'run') result[name].threeNeedsResumeRecovery = true;
      }
    }
    // A replay may have originated in another era. Keep that original run intact.
    if (familyRun(preserved.run) && !validRun(preserved.run) && preserved.mainRun && !familyRun(preserved.mainRun)) {
      result.run = result.mainRun; result.mainRun = null;
    }
    result.meta.eraProgress ||= {};
    const previousProgress = preserved.meta.eraProgress?.[progressKey];
    if (previousProgress && !validResume(previousProgress.resume)) {
      archive(result.meta,'invalid-resume','main-save.' + progressKey,previousProgress);
      delete result.meta.eraProgress[progressKey];
    }
    ensureBook(result.meta);
    return result;
  };

  // New/restarted runs always receive a new story cursor, while accumulated
  // question results, read records and all other eras remain in meta.
  for (const name of ['startChapter','restartChapter','beginReplay','resetRun']) {
    const before = globalThis[name];
    if (typeof before !== 'function') continue;
    globalThis[name] = function(target, ...args) {
      const old = target.run, result = before(target, ...args);
      if (target.run !== old && ownsChapter(target.run?.currentChapter)) { identifyRun(target.run,true); ensureBook(target.meta); }
      return result;
    };
  }
  const beforeRestartEpisode = restartEpisodeMain;
  restartEpisodeMain = function(target) {
    if (!ownsChapter((target.mainRun || target.run)?.currentChapter)) return beforeRestartEpisode(target);
    target.mainRun = null; target.run = freshRun(true); ensureBook(target.meta);
    return target;
  };
  globalThis.THREE_SAVE_V3 = {version,eraId,progressKey,storageKey,contentVersion,firstChapterId,
    copy,ownsChapter,ownsScene,ownsQuestion,ownsOfficialQuestion,familyChapter,familyRun,
    validBook,validRun,validResume,emptyBook,ensureBook,identifyRun,freshRun,archive,fingerprint};
}
