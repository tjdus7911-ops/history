/* Development installer. The published index does not load unfinished content. */
if (globalThis.THREE_ENABLE_DEVELOPMENT_PREVIEW === true) {
  const script = globalThis.THREE_STORY_SCRIPT;
  if (!script || script.chapterCount !== 30 || script.sceneCount !== 90) throw Error('삼국 30챕터·90씬 대본 누락');
  const eraId = 'three-kingdoms';
  for (const chapter of Object.values(CHAPTERS)) {
    if (chapter.eraId !== eraId) continue;
    Object.defineProperty(CHAPTERS, chapter.chapterId, {value: chapter, writable: true, configurable: true, enumerable: false});
  }
  for (const story of Object.values(STORIES)) if (story.eraId === eraId) story.storyActive = false;
  const protagonist = 'three_v2_seoa';
  CHARACTERS[protagonist] = {characterId: protagonist, characterName:'서아', speakerType:'player', position:'right', show:true, presentation:'standing', portraitPrefix:protagonist};
  for (const expression of ANCIENT_EXPRESSIONS) PORTRAITS[`${protagonist}_${expression}`] = {
    characterId: protagonist, expression, label:`서아 · ${expression}`, src:`assets/ancient/three-v2/characters/seoa-${expression}.png`
  };
  CHARACTER_RENDER_PROFILES.characters[protagonist] = {tier:'MAIN',scale:1.64,anchorX:0,anchorY:15,framing:'upper-body',lockStateScale:true};
  const sources = new Map(script.chapters.flatMap(chapter=>chapter.scenes.map(source=>[source.sceneId,source])));
  for (const chapter of script.chapters) {
    const first = chapter.scenes[0], last = chapter.scenes.at(-1);
    CHAPTERS[first.chapterId] = {chapterId:first.chapterId, eraId, episode:'three', number:String(chapter.number).padStart(2,'0'),
      title:chapter.title, subtitle:`서아의 기록책 · ${chapter.country}`, years:[...new Set(chapter.scenes.map(source=>source.dateLabel))].join(' · '),
      startStoryId:first.sceneId, completeStoryId:last.sceneId, questionCount:0, reviewQuestionCount:0, questionSetCount:0,
      implemented:true, threeStoryVersion:2, developmentPreview:true};
    for (let index=0;index<chapter.scenes.length;index++) {
      const source=chapter.scenes[index], artId=`${source.sceneId}_background`;
      ASSETS[artId] = {id:artId, label:`제작·검증 대기: ${source.country} ${source.title}`, status:'ASSET_REQUIRED', imageKind:'story-background',embeddedCharacters:false};
      const background=globalThis.THREE_ART_MANIFEST?.backgrounds?.[source.sceneId];
      if(background?.visualFileReview)Object.assign(ASSETS[artId],{src:background.src,label:background.label,status:'ready',desktopRenderReview:false,mobileRenderReview:false});
      CHARACTERS[source.npcId]={characterId:source.npcId,characterName:source.npcName,speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:source.npcId};
      const characterArt=globalThis.THREE_ART_MANIFEST?.characters?.[source.npcId];
      if(characterArt?.neutral)PORTRAITS[`${source.npcId}_neutral`]={characterId:source.npcId,expression:'neutral',label:source.npcName,src:characterArt.neutral};
      CHARACTER_RENDER_PROFILES.characters[source.npcId]={tier:'MAIN',scale:characterArt?.renderScale||1.62,anchorX:0,anchorY:15,framing:'upper-body',lockStateScale:true};
      const convert = entry => {
        if(entry.speaker==='나레이션')return aN(entry.text);
        const player=entry.speaker==='서아', expression=entry.expression||'neutral';
        // Neutral-only development sprites remain visible until face variants are reviewed.
        const visibleExpression=player||PORTRAITS[`${source.npcId}_${expression}`]?expression:'neutral';
        return dialogueLine(player?protagonist:source.npcId,visibleExpression,entry.text,player?'player':'npc');
      };
      const next=chapter.scenes[index+1]?.sceneId || null;
      STORIES[source.sceneId]=scene({sceneId:source.sceneId,chapterId:source.chapterId,eraId,
        year:parseInt(source.dateLabel,10),threeDateLabel:source.dateLabel,location:`${source.country} · ${source.title}`,
        title:source.title,sceneNumber:source.number,illustrationId:artId,dialogues:source.dialogues.map(convert),
        threeCommon:source.common.map(convert),nextStoryId:next,completeChapter:!next,storyActive:true,threeStoryVersion:2,
        fictionNotice:script.fictionNotice,threeCheckpoint:source.learningCheckpoint,
        choices:source.choices.map((branch,choiceIndex)=>choice(branch.label,next||source.sceneId,{}, {},'',{
          resultIllustrationId:artId,resultDialogues:branch.dialogues.map(convert),flags:branch.flags,importantChoice:`three-v2-${choiceIndex}`,
          threeChoiceIndex:choiceIndex}))});
    }
    CHAPTERS[first.chapterId].thumbnail=ASSETS[`${first.sceneId}_background`].src;
  }
  globalThis.THREE_PREVIEW_RUNTIME={version:2,protagonist,sources,installQuestionBank(records){
    for(const record of records){
      if(!record.visualQuestionReview||!record.visualAnswerReview||!record.catalogImageReview)throw Error(`미검증 문항: ${record.officialQuestionId}`);
      const original=ancientSourceById.get(record.officialQuestionId);
      if(!original||original.examLevel!=='심화'||original.answer!==record.answer||record.optionExplanations.length!==5)throw Error(`기출 검증 계약 불일치: ${record.officialQuestionId}`);
      for(const source of sources.values()){
        if(!source.learningCheckpoint.verifiedQuestionIds.includes(record.officialQuestionId))continue;
        const questionId=`${source.sceneId}_${record.officialQuestionId}`;
        if(QUESTIONS.some(item=>item.questionId===questionId))continue;
        QUESTIONS.push(question({questionId,officialQuestionId:record.officialQuestionId,chapterId:source.chapterId,relatedSceneId:source.sceneId,
          era:'삼국',primaryEra:'ancient',historicalEvent:record.topicTags.join(' · '),
          historicalEventId:`${source.sceneId}_history`,relatedHistoricalEventId:`${source.sceneId}_history`,
          relatedIllustrationId:STORIES[source.sceneId].illustrationId,conceptIds:record.topicTags.map(tag=>`three-v2:${tag}`),
          difficulty:'심화',examType:'한국사능력검정시험 심화 기출',
          memoryPrompt:`${source.title}에서 만난 ${source.npcName}의 이야기를 떠올려 보세요.`,
          storyConnection:source.originalTopic,question:`공식 ${original.examRound}회 심화 ${original.questionNumber}번`,
          passage:record.clue,choices:record.options,sourceChoices:record.options,answer:record.answer,answerLabel:original.answerLabel,
          acceptedAnswers:[record.answer],explanation:[record.clue,...record.optionExplanations.map((text,index)=>`${'①②③④⑤'[index]} ${text}`)].join('\n'),
          rewardKnowledge:3,isOfficial:true,sourceVerified:true,sourceStatus:'verified',sourceImageStatus:'verified',
          examRound:original.examRound,examYear:original.examYear,examLevel:'심화',questionNumber:original.questionNumber,sourcePage:record.sourcePage,
          sourcePdf:original.sourcePdf,answerPdf:original.answerPdf,sourceFile:original.sourcePdf,answerFile:original.answerPdf,
          sourceQuestionImage:original.questionImage,questionImage:original.questionImage,source:'국사편찬위원회 공식 문제지·정답표',threeStoryVersion:2}));
      }
    }
    for(const chapter of Object.values(CHAPTERS).filter(chapter=>chapter.threeStoryVersion===2)){
      const ids=QUESTIONS.filter(question=>question.chapterId===chapter.chapterId).map(question=>question.questionId);
      chapter.questionCount=ids.length;chapter.reviewQuestionCount=ids.length;SPLIT_REVIEW_IDS[chapter.chapterId]=ids;
    }
  }};
}
