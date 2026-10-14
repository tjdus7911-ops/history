/* Install the approved 23-chapter manuscript into the existing game registries. */
if (globalThis.THREE_ENABLE_CONTENT === true || globalThis.THREE_ENABLE_DEVELOPMENT_PREVIEW === true) {
  const script = globalThis.THREE_STORY_SCRIPT;
  const exams = globalThis.THREE_COMPLETE_EXAMS;
  if (!script || script.schemaVersion !== 3 || script.chapterCount !== 23 ||
      script.sceneCount !== 215 || script.playableSceneCount !== 218) {
    throw Error('삼국 전체 대본(23챕터·215씬·프롤로그 3씬)을 확인해 주세요.');
  }
  if (!exams || exams.answerBase !== 0 || exams.questions.length !== 91 || exams.schedule.length !== 99) {
    throw Error('삼국 기출 배치표와 정답 데이터가 일치하지 않습니다.');
  }
  const eraId = 'three-kingdoms', version = 3, protagonist = 'three_v3_seoa';
  const art = globalThis.THREE_COMPLETE_ART || {};
  const protagonistOnly = art.status === 'protagonist-only-roster-reset';
  const sources = new Map([...script.prologue.scenes, ...script.chapters.flatMap(c => c.scenes)].map(s => [s.sceneId, s]));
  const order = [...sources.keys()];
  const questionByOfficialId = new Map();
  const schedules = new Map([...exams.schedule, ...exams.additionalCandidates].map(s => [s.id, s]));
  // Keep old content addressable for archived saves, but exclude it from the new season.
  for (const chapter of Object.values(CHAPTERS)) {
    if (chapter.eraId === eraId) Object.defineProperty(CHAPTERS, chapter.chapterId,
      {value:chapter, writable:true, configurable:true, enumerable:false});
  }
  for (const s of Object.values(STORIES)) if (s.eraId === eraId) s.storyActive = false;
  CHARACTERS[protagonist] = {characterId:protagonist,characterName:'서아',speakerType:'player',
    position:'right',show:true,presentation:'standing',portraitPrefix:protagonist};
  const expressions = ['neutral','smile','surprised','embarrassed','suspicious','angry','sad','determined','fear','worried','relieved'];
  for (const expression of expressions) PORTRAITS[protagonist + '_' + expression] = {
    characterId:protagonist,expression,label:'서아',
    src:'assets/ancient/three-v2/characters/seoa-' + expression + '.png'
  };
  PORTRAITS[protagonist + '_modern'] = {characterId:protagonist,expression:'modern',label:'현대의 서아',
    src:'assets/ancient/characters/three-player-modern.png'};
  CHARACTER_RENDER_PROFILES.characters[protagonist] = {tier:'MAIN',scale:1.64,anchorX:0,anchorY:15,framing:'upper-body',lockStateScale:true};

  const people = new Map();
  function characterFor(source, name) {
    if (name === '서아') return protagonist;
    // Preserve the previous script as reference text without recreating its
    // retired cast in the live character registry.
    if (protagonistOnly) return 'narrator';
    const stableId = art.sceneCharacters?.[source.sceneId]?.[name] ||
      'three_v3_' + source.chapterId + '_' + name;
    if (!CHARACTERS[stableId]) {
      const portrait = art.characters?.[stableId];
      CHARACTERS[stableId] = {characterId:stableId,characterName:name,speakerType:'npc',
        position:'left',show:!!portrait?.neutral,presentation:portrait?.neutral?'standing':'dialogue',portraitPrefix:stableId};
      if (portrait?.neutral) PORTRAITS[stableId + '_neutral'] = {
        characterId:stableId,expression:'neutral',label:name,src:portrait.neutral,
        sprite:portrait.sprite||null,flipX:!!portrait.flipX
      };
      for (const [expression, src] of Object.entries(portrait?.expressions || {})) {
        PORTRAITS[stableId + '_' + expression] = {characterId:stableId,expression,label:name,src};
      }
      CHARACTER_RENDER_PROFILES.characters[stableId] = {tier:'MAIN',scale:portrait?.renderScale||1.60,
        anchorX:0,anchorY:15,framing:'upper-body',lockStateScale:true};
    }
    people.set(stableId, CHARACTERS[stableId]);
    return stableId;
  }
  const face = {tired_soft:'worried',wry:'embarrassed',thoughtful:'neutral',puzzled:'suspicious',
    startled:'surprised',uneasy:'worried',alarmed:'fear',dazed:'surprised',confused:'suspicious',
    determined_soft:'determined',concerned:'worried',soft:'relieved',serious:'determined'};
  function convert(source, entry) {
    const record = entry.kind === 'record' || entry.kind === 'narration';
    const characterId = record ? 'narrator' : characterFor(source, entry.speaker);
    let expression = face[entry.expression] || entry.expression || 'neutral';
    if (entry.speaker === '서아' && source.isPrologue && source.sceneId !== 'THR-PRO-S03') expression = 'modern';
    if (!record && !PORTRAITS[characterId + '_' + expression]) expression = 'neutral';
    return {...dialogueLine(characterId, expression, entry.text, record?'narration':entry.speaker==='서아'?'player':'npc', entry.speaker),
      lineId:entry.lineId,threeKind:entry.kind,presentationContext:entry.presentationContext||null,
      presentationLabel:entry.presentationLabel||null,presentationCue:entry.presentationCue||null,
      visualCue:entry.visualCue||null,sourceLine:entry.sourceLine,advance:'tap'};
  }
  for (const chapter of script.chapters) {
    const first = chapter.scenes[0], last = chapter.scenes.at(-1);
    CHAPTERS[chapter.chapterId] = {chapterId:chapter.chapterId,eraId,episode:'three',
      number:String(chapter.number).padStart(2,'0'),title:chapter.title,
      subtitle:chapter.storyArc,years:[...new Set(chapter.scenes.map(s=>s.year))].join(' · '),
      startStoryId:chapter.number===1?script.entrySceneId:first.sceneId,firstMainSceneId:first.sceneId,
      completeStoryId:last.sceneId,sceneIds:chapter.scenes.map(s=>s.sceneId),
      questionCount:0,reviewQuestionCount:0,questionSetCount:0,implemented:true,
      threeStoryVersion:version,contentVersion:script.contentVersion,contentStatus:'available'};
  }
  for (const source of sources.values()) {
    const artId = source.sceneId + '_background', background = art.backgrounds?.[source.sceneId];
    ASSETS[artId] = {id:artId,label:background?.label||source.sceneTitle,
      ...(background?.src?{src:background.src,status:'ready'}:{status:'ASSET_REQUIRED'}),
      imageKind:'story-background',embeddedCharacters:!!background?.embeddedCharacters};
    const main = source.main.map(e => convert(source,e));
    const common = source.join.map(e => convert(source,e));
    const last = !source.isPrologue && script.chapters.find(c=>c.chapterId===source.chapterId)?.scenes.at(-1)?.sceneId===source.sceneId;
    STORIES[source.sceneId] = scene({sceneId:source.sceneId,chapterId:source.chapterId,eraId,
      year:Number.parseInt(source.year,10)||null,threeDateLabel:source.year,
      location:source.location,title:source.sceneTitle,sceneNumber:source.number,
      illustrationId:artId,dialogues:main,threeCommon:common,
      nextStoryId:source.nextSceneId,completeChapter:!!last,storyActive:true,
      threeStoryVersion:version,threeSource:source,isPrologue:source.isPrologue,
      fictionNotice:script.fictionNotice,historicalEventId:source.sourceEventIds?.[0]||null,
      choices:source.choices.length?source.choices.map(branch=>choice(branch.label,source.sceneId,{}, {},'',{
        choiceId:branch.choiceId,threeChoiceId:branch.choiceId,
        resultIllustrationId:artId,resultDialogues:[branch.spokenLine,...branch.reply].map(e=>convert(source,e)),
        importantChoice:branch.choiceId
      })):null});
  }
  for (const chapter of script.chapters) CHAPTERS[chapter.chapterId].thumbnail=ASSETS[chapter.scenes[0].sceneId+'_background'].src||art.protagonist?.cover?.src;

  const firstScheduleFor = id => exams.schedule.find(s=>s.officialQuestionId===id&&s.playMode==='first') ||
    exams.additionalCandidates.find(s=>s.officialQuestionId===id) || exams.schedule.find(s=>s.officialQuestionId===id);
  for (const q of exams.questions) {
    const count = q.examLevel === '기본' ? 4 : 5;
    if (q.choiceCount !== count || !Number.isInteger(q.answer) || q.answer<0 || q.answer>=count ||
        q.answerNumber!==q.answer+1 || !q.questionImage || !q.sourceVerified ||
        !q.sourceValidation?.originalQuestionReviewed || !q.sourceValidation?.officialAnswerVerified ||
        !q.sourceValidation?.currentCropReviewed || !q.sourceValidation?.imageHashMatchesReview) throw Error('삼국 기출 데이터 불일치: '+q.officialQuestionId);
    const original = typeof ancientSourceById !== 'undefined' ? ancientSourceById.get(q.officialQuestionId) : null;
    if (!original || original.answer !== q.answer || original.examLevel !== q.examLevel)
      throw Error('공식 카탈로그 정답 불일치: '+q.officialQuestionId);
    const placed = firstScheduleFor(q.officialQuestionId), source = sources.get(placed?.quizAfterSceneId);
    if (!source) throw Error('삼국 기출 위치 누락: '+q.officialQuestionId);
    const questionId='THR-'+q.officialQuestionId;
    // Original choices are in the source image; do not regenerate or OCR them into invented options.
    const options=Array.from({length:count},(_,i)=>(i+1)+'번');
    const installed=question({...q,questionId,officialQuestionId:q.officialQuestionId,
      chapterId:source.chapterId,relatedSceneId:source.sceneId,resumeStoryId:source.sceneId,
      relatedHistoricalEventId:source.sourceEventIds?.[0]||null,historicalEventId:source.sourceEventIds?.[0]||null,
      relatedIllustrationId:source.sceneId+'_background',era:'삼국',primaryEra:'ancient',
      question:q.label||q.examRound+'회 '+q.examLevel+' '+q.questionNumber+'번',
      sourceQuestionText:q.label||q.examRound+'회 '+q.examLevel+' '+q.questionNumber+'번',
      choices:options,sourceChoices:options,answer:q.answer,acceptedAnswers:[q.answer],
      examYear:q.examYear||original.examYear,examType:'한국사능력검정시험 '+q.examLevel+' 기출',
      difficulty:q.examLevel,sourceQuestionImage:q.questionImage,
      sourceImageWidth:q.sourceImageWidth||original.sourceImageWidth||540,
      sourceImageHeight:q.sourceImageHeight||original.sourceImageHeight||null,
      sourceFile:q.sourceFile||original.sourceFile||original.sourcePdf,
      answerFile:q.answerFile||original.answerFile||original.answerPdf,
      sourcePdf:q.sourceUrl,answerPdf:q.officialAnswerUrl,sourcePage:q.sourcePage||original.sourcePage,
      source:'국사편찬위원회 한국사능력검정시험',sourceVerified:true,isOfficial:true,
      sourceImageStatus:'verified',explanation:placed.playExplanation||q.explanation,
      examKeywords:[],conceptIds:[],rewardKnowledge:0,threeStoryVersion:version,
      reviewOnly:placed.playMode!=='first',threeExam:q});
    QUESTIONS.push(installed);questionByOfficialId.set(q.officialQuestionId,installed);
  }
  for (const chapter of script.chapters) {
    const placements=exams.schedule.filter(s=>s.playMode==='first'&&sources.get(s.quizAfterSceneId)?.chapterId===chapter.chapterId);
    const ids=placements.map(s=>questionByOfficialId.get(s.officialQuestionId).questionId);
    Object.assign(CHAPTERS[chapter.chapterId],{questionCount:ids.length,reviewQuestionCount:ids.length,
      questionSetCount:new Set(placements.map(s=>s.quizAfterSceneId)).size});
    SPLIT_REVIEW_IDS[chapter.chapterId]=ids;
  }
  const runtime={version,contentVersion:script.contentVersion,eraId,protagonist,sources,order,people,
    exams,schedules,questionByOfficialId,convert,characterFor,firstScheduleFor,
    entrySceneId:script.entrySceneId,firstMainSceneId:script.firstMainSceneId};
  globalThis.THREE_STORY_RUNTIME=runtime;
  globalThis.THREE_PREVIEW_RUNTIME=runtime;
}
