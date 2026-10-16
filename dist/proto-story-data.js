/* 원삼국 전용 설치 계층. 승인한 17장면 원본을 그대로 설치한다. */
const PROTO_STORY_VERSION=3;
const PROTO_CONTENT_VERSION=PROTO_REVISION_SOURCE.contentVersion;
const PROTO_LEGACY_CONTENT_VERSION=PROTO_REVISION_SOURCE.saveCompatibility.previousContentVersion;
const PROTO_LEGACY_STORY_SCENE_IDS=new Set(Object.keys(PROTO_REVISION_SOURCE.saveCompatibility.previousSceneCounts).flatMap(chapter=>{
 const count=PROTO_REVISION_SOURCE.saveCompatibility.previousSceneCounts[chapter];
 return Array.from({length:count},(_,index)=>`${chapter}_s${index+1}`);
}));
// Older saved question IDs retain their exact catalog objects, answers and review records.
QUESTIONS.push(...PROTO_LEGACY_STUDY_QUESTIONS.map(q=>JSON.parse(JSON.stringify(q))));
const PROTO_LEGACY_QUESTION_ART=new Map(QUESTIONS.filter(q=>q.chapterId?.startsWith('proto-')).map(q=>[q,q.relatedIllustrationId]));
const PROTO_CAST={'주인공':'proto_modern','동생':'proto_sibling','나루':'proto_naru','마을 사람':'proto_worker','마을 어른':'proto_elder','집안 어른':'proto_elder','노인':'proto_elder','상인':'proto_merchant','교역꾼':'proto_merchant','청년':'proto_worker','어민':'proto_worker','짐꾼':'proto_worker','행사 일꾼':'proto_worker','소녀':'proto_girl','아이':'proto_girl','여인':'proto_woman','천군':'proto_priest','관리자':'proto_elder','군장의 부하':'proto_worker','마을 군장':'proto_elder','짐 주인':'proto_merchant','창고지기':'proto_worker','혼인 당사자':'proto_woman'};
const PROTO_NAMES={proto_modern:['주인공',null],proto_sibling:['동생',null],proto_naru:['나루',null],proto_worker:['마을 사람',null],proto_elder:['마을 어른',null],proto_merchant:['상인',null],proto_girl:['아이',null],proto_woman:['마을 사람',null],proto_priest:['천군',null]};
const PROTO_PORTRAIT_ASSETS={proto_modern:'player-v2.png',proto_sibling:'sibling-v2.png',proto_naru:'naru-v2.png',proto_worker:'worker-v2.png',proto_elder:'elder-v2.png',proto_merchant:'merchant-v2.png',proto_girl:'girl-v2.png',proto_woman:'woman-v2.png',proto_priest:'priest-v2.png'};
for(const [id,[name,age]] of Object.entries(PROTO_NAMES)){
 CHARACTERS[id]={characterId:id,characterName:name,characterAge:age,speakerType:id==='proto_modern'?'player':'npc',position:id==='proto_modern'?'right':'left',show:true,presentation:'standing',portraitPrefix:id};
 for(const expression of ANCIENT_EXPRESSIONS)PORTRAITS[`${id}_${expression}`]={characterId:id,expression,label:name,src:`media/proto-v4/${PROTO_PORTRAIT_ASSETS[id]}`};
 CHARACTER_RENDER_PROFILES.characters[id]={tier:'MAIN',scale:1.06,anchorX:0,anchorY:6,framing:'upper-body',lockStateScale:true};
}
const protoLine=({speaker,text,lineId,learningKeywordIds=[],emphasis=[],stageDirection,blackout=false,expression:cue})=>{
 let line;
 const thought=speaker==='주인공(속마음)';
 if(speaker==='나레이션')line=aN(text);
 else{
  const id=thought?'proto_modern':PROTO_CAST[speaker];
  if(!id)throw Error(`원삼국 화자 누락: ${speaker}`);
  const expression=cue||(/미안|두렵|겁|후회|침묵|두려/.test(text)?'worried':/고맙|하하|ㅋㅋ|약속|마음에/.test(text)?'smile':/\?!|으악|알이라고/.test(text)?'surprised':'neutral');
  line=dialogueLine(id,expression,text,thought?'thought':id==='proto_modern'?'player':'npc',speaker==='단(???)'?'???':thought?'주인공 · 속마음':speaker==='주인공'?null:speaker);
 }
 return {...line,lineId,protoSpeaker:speaker,protoKind:speaker==='나레이션'?'narration':thought?'thought':'dialogue',learningKeywordIds:[...learningKeywordIds],protoEmphasis:emphasis,protoBlackout:blackout,stageDirection};
};
const PROTO_SYMBOLIC_BACKGROUNDS=[...new Set(PROTO_STORY_SCRIPT.flatMap(c=>c.scenes.map(s=>s.backgroundId)))];
for(const name of PROTO_SYMBOLIC_BACKGROUNDS){const id=`proto-v4-${name}`;ASSETS[id]={id,label:`원삼국 ${name}`,src:`media/proto-v4/${name}.webp`,imageKind:'story-background',embeddedCharacters:false,status:'ready'};}
function protoBackground(c,s){return `proto-v4-${s.backgroundId}`;}
const protoSceneId=(c,s)=>`proto_ch${String(c).padStart(2,'0')}_s${s}`;
// Physically uninstall the old era graph, while preserving all shared/other-era objects.
for(const [id,story] of Object.entries(STORIES))if(story.eraId==='proto-kingdoms')delete STORIES[id];
for(let i=QUESTIONS.length-1;i>=0;i--)if(QUESTIONS[i].chapterId?.startsWith('proto-'))QUESTIONS.splice(i,1);
for(const [id,set] of Object.entries(QUESTION_SETS))if(set.chapterId?.startsWith('proto-'))delete QUESTION_SETS[id];
for(const [id,chapter] of Object.entries(CHAPTERS))if(chapter.eraId==='proto-kingdoms')delete CHAPTERS[id];
for(const c of PROTO_STORY_SCRIPT){
 const id=ancientChapterId('proto',c.number),last=c.scenes.at(-1).sceneId;
 const first=c.scenes[0],firstBackground=protoBackground(c.number,first),year=Number(first.period.match(/\d{3}/)?.[0]||220);
 CHAPTERS[id]={chapterId:id,eraId:'proto-kingdoms',number:String(c.number).padStart(2,'0'),title:c.title,subtitle:c.arc,years:`${year}년 · 여러 나라의 성장`,startStoryId:first.sceneId,completeStoryId:last,thumbnail:ASSETS[firstBackground].src,questionCount:0,reviewQuestionCount:0,questionSetCount:0,storyVersion:PROTO_STORY_VERSION,contentVersion:PROTO_CONTENT_VERSION,implemented:true};
 for(const s of c.scenes){
  const sceneId=s.sceneId,next=s.sceneId===last?null:s.nextSceneId,bg=protoBackground(c.number,s),dialogues=s.main.map(protoLine),sceneYear=Number(s.period.match(/\d{3}/)?.[0]||year);
  const source=scene({sceneId,chapterId:id,eraId:'proto-kingdoms',year:sceneYear,location:s.location,title:s.title,sceneType:s.choices.length?'CHOICE':'STORY',illustrationId:bg,dialogues,nextStoryId:next,completeChapter:!next,storyActive:true,protoStoryVersion:PROTO_STORY_VERSION,contentVersion:PROTO_CONTENT_VERSION,sceneNumber:s.number,protoSource:s,protoCommon:s.join.map(protoLine),protoOutro:s.outro.map(protoLine),protoNextSceneId:s.nextSceneId,protoPeriod:s.period,protoCountry:s.country,protoPlace:s.place,protoLearningIds:s.learning.map(item=>item.id),protoQueue:s.quizAfter,fictionNotice:'동생을 찾는 여행은 여러 나라의 사료 속 특징을 배우는 허구 이야기입니다.',enterCharacterStates:Object.fromEntries(Object.keys(PROTO_NAMES).map(id=>[id,{isAlive:true}])),flashback:/회상/.test(s.location),timeOfDay:/밤|어두운|모닥불/.test(s.location)?'night':'day'});
  source.choices=s.choices.map((choice,index)=>({choiceId:choice.id,protoChoiceId:choice.id,label:choice.label,result:choice.reply.map(l=>l.text).join(' '),resultDialogues:[protoLine({speaker:'주인공',text:choice.label,lineId:choice.id+'-selected',emphasis:choice.emphasis}),...choice.reply.map(protoLine)],resultIllustrationId:bg,nextStoryId:next}));
  STORIES[sceneId]=source;
 }
}
const PROTO_CHECKPOINTS=PROTO_REVISION_SOURCE.examPlan.queues.map((queue,index)=>({
 ...queue,checkpointId:`proto-v3-${queue.sceneId}`,number:index+1,chapterId:STORIES[queue.sceneId].chapterId,
 learningTopics:STORIES[queue.sceneId].protoSource.learning.map(item=>item.id),questionIds:[...queue.officialQuestionIds],verified:true,missingQuestionCount:queue.missingQuestionCount
}));
const PROTO_STUDY_QUESTION_IDS=[];
for(const checkpoint of PROTO_CHECKPOINTS){
 const story=STORIES[checkpoint.sceneId],setId=`${story.sceneId}_questions`,linked=[];
 for(const officialId of checkpoint.questionIds){
  const authored=PROTO_REVISION_SOURCE.examPlan.questions.find(q=>q.officialQuestionId===officialId),source=authored,details={question:authored.question,clue:authored.clue,explanation:authored.proposed.playExplanation},questionId=`proto-v4-${officialId}`;
  if(!source||!details?.explanation||!authored||source.answer!==authored.answerIndex0)throw Error(`검증 데이터 누락: ${officialId}`);
  const learningIds=[...authored.learningKeywordIds],choices=[...authored.choices];
  const protoExam={...authored,label:`${authored.examRound}회 ${authored.examLevel} ${authored.questionNumber}번`,editorialFocusSummary:authored.proposed.editorialFocusSummary,proposed:{...authored.proposed,playExplanation:details.explanation}};
  const q=question({questionId,officialQuestionId:officialId,chapterId:checkpoint.chapterId,era:'원삼국',primaryEra:'ancient',relatedSceneId:story.sceneId,relatedHistoricalEventId:`proto-checkpoint-${checkpoint.number}`,historicalEventId:`proto-checkpoint-${checkpoint.number}`,historicalEvent:authored.proposed.editorialFocusSummary,relatedIllustrationId:story.illustrationId,questionType:'공식 원본 자료 분석형',difficulty:source.examLevel,question:details.question,sourceQuestionText:details.question,passage:details.clue,choices,sourceChoices:choices,answer:authored.answerIndex0,answerLabel:String(authored.answerNumber1),acceptedAnswers:[authored.answerIndex0],explanation:details.explanation,wrongFeedback:details.explanation,memoryPrompt:story.title,gameMemory:story.title,storyConnection:story.title,examKeywords:learningIds,concepts:learningIds,conceptIds:learningIds,rewardKnowledge:3,resumeStoryId:story.nextStoryId,isOfficial:true,sourceVerified:true,sourceStatus:'verified',sourceImageStatus:'verified',examRound:authored.examRound,examYear:authored.examYear,examLevel:authored.examLevel,questionNumber:authored.questionNumber,points:source.points,sourcePage:source.sourcePage,sourceFile:source.sourcePdf,answerFile:source.answerPdf,sourcePdf:source.sourcePdf,answerPdf:source.answerPdf,sourceQuestionImage:authored.questionImage,questionImage:authored.questionImage,questionImageSha256:authored.questionImageSha256,sourceImageWidth:authored.sourceImageWidth,sourceImageHeight:authored.sourceImageHeight,examType:'한능검 대비 · 실제 기출',source:'국사편찬위원회 한국사능력검정시험 공식 문제지·정답표',protoStoryVersion:PROTO_STORY_VERSION,contentVersion:PROTO_CONTENT_VERSION,protoExam,protoRequiredSceneIds:[...authored.proposed.requiresReadSceneIds],protoIndependentExplanation:details.explanation,protoLearningIds:learningIds});
  QUESTIONS.push(q);linked.push(questionId);PROTO_STUDY_QUESTION_IDS.push(questionId);
 }
 QUESTION_SETS[setId]={questionSetId:setId,checkpointId:checkpoint.checkpointId,chapterId:story.chapterId,afterSceneId:story.sceneId,afterLineId:checkpoint.afterLineId,resumeStoryId:story.nextStoryId,requiredCount:linked.length,targetCount:3,officialQuestionIds:linked,practiceQuestionIds:[],verifiedCount:linked.length,missingQuestionCount:checkpoint.missingQuestionCount,status:linked.length?'ready':'unfilled',sourceType:'official_verified',preserveQuestionOrder:true,verified:true};
 Object.assign(story,{checkpointId:checkpoint.checkpointId,questionSetId:setId,questionSetStatus:'ready',questionSetResumeStoryId:story.nextStoryId,linkedQuestionIds:linked,linkedOfficialQuestionIds:linked,linkedPracticeQuestionIds:[],questionSequenceMode:'queue'});
 if(story.choices)story.afterChoiceQuestionSetId=setId;
}
for(const c of PROTO_STORY_SCRIPT){
 const id=ancientChapterId('proto',c.number),ids=PROTO_STUDY_QUESTION_IDS.filter(qid=>QUESTIONS.find(q=>q.questionId===qid).chapterId===id);
 Object.assign(CHAPTERS[id],{questionCount:ids.length,reviewQuestionCount:ids.length,questionSetCount:PROTO_CHECKPOINTS.filter(cp=>cp.chapterId===id).length});
 if(typeof SPLIT_REVIEW_IDS!=='undefined')SPLIT_REVIEW_IDS[id]=ids;
}
const PROTO_LEGACY_OFFICIAL_IDS=new Set(PROTO_LEGACY_STUDY_QUESTIONS.map(q=>q.officialQuestionId).filter(Boolean));
globalThis.PROTO_CHECKPOINTS=PROTO_CHECKPOINTS;
globalThis.PROTO_STUDY_QUESTION_IDS=PROTO_STUDY_QUESTION_IDS;
globalThis.PROTO_LEGACY_OFFICIAL_IDS=PROTO_LEGACY_OFFICIAL_IDS;
globalThis.PROTO_STORY_SCOPE={contentVersion:PROTO_CONTENT_VERSION,storyScenes:17,chapterCount:5,checkpointCount:17,officialQuestionCount:PROTO_REVISION_SOURCE.examPlan.questions.length,missingQuestionCount:PROTO_REVISION_SOURCE.examPlan.unfilledSlots,choices:17,dialogues:PROTO_REVISION_SOURCE.counts.authoredUtterances,learningCount:PROTO_REVISION_SOURCE.learning.length};
Object.assign(globalThis.ANCIENT_STORY_SCOPE,{protoChapters:PROTO_STORY_SCRIPT.length,protoScenes:PROTO_STORY_SCOPE.storyScenes});
globalThis.protoActiveStoryQuestion=q=>!q.chapterId?.startsWith('proto-')||q.protoStoryVersion===PROTO_STORY_VERSION;
globalThis.PROTO_QUESTION_SLOTS=PROTO_REVISION_SOURCE.learning.map(item=>({questionSlotId:item.id,sceneId:item.firstSceneId,sceneIds:[...item.sceneIds],learningConcept:item.title,questionIds:item.questionIds.map(id=>`proto-v4-${id}`),officialQuestionIds:[...item.questionIds],sourceVerificationStatus:'official_original_and_answer_checked'}));
globalThis.PROTO_LEARNING_LINKS=PROTO_REVISION_SOURCE.learning.map(item=>({conceptId:item.id,learningConcept:item.title,sceneIds:[...item.sceneIds],questionSlotIds:[item.id],questionIds:item.questionIds.map(id=>`proto-v4-${id}`)}));
globalThis.PROTO_REVISION_RUNTIME={version:PROTO_STORY_VERSION,contentVersion:PROTO_CONTENT_VERSION,source:PROTO_REVISION_SOURCE,
 sources:new Map(Object.values(STORIES).filter(source=>source.protoStoryVersion===PROTO_STORY_VERSION&&source.storyActive!==false).map(source=>[source.sceneId,source])),
 questionByOfficialId:new Map(QUESTIONS.filter(q=>q.protoStoryVersion===PROTO_STORY_VERSION).map(q=>[q.officialQuestionId,q])),
 legacyOfficialIds:PROTO_LEGACY_OFFICIAL_IDS,
 learningById:new Map(PROTO_REVISION_SOURCE.learning.map(item=>[item.id,item]))};

// The restored original must also replace the shared library's truncated 71/심화/2 record.
{
 const restored=PROTO_REVISION_SOURCE.examPlan.questions.find(q=>q.officialQuestionId==='official-71-advanced-02');
 const original=(globalThis.OFFICIAL_EXAM_SOURCE_RECORDS||[]).find(q=>q.officialQuestionId===restored.officialQuestionId);
 if(original)Object.assign(original,{questionImage:restored.questionImage,detailImage:restored.questionImage,thumbnailImage:restored.questionImage,detailImageSha256:restored.questionImageSha256,detailImageWidth:restored.sourceImageWidth,detailImageHeight:restored.sourceImageHeight,thumbnailImageWidth:restored.sourceImageWidth,thumbnailImageHeight:restored.sourceImageHeight});
 const choice=(globalThis.OFFICIAL_EXAM_CHOICE_RECORDS||[]).find(q=>q.officialQuestionId===restored.officialQuestionId);
 if(choice)Object.assign(choice,{question:restored.question,choices:[...restored.choices],contentImage:restored.questionImage,contentImageWidth:restored.sourceImageWidth,contentImageHeight:restored.sourceImageHeight,contentImageSha256:restored.questionImageSha256,choicePresentation:'text',choiceMedia:[]});
 const repairedExplanation={question:restored.question,clue:restored.clue,choices:[...restored.choices],choiceExplanations:restored.choiceExplanations.map((text,i)=>({choiceIndex:i,label:'①②③④⑤'[i],choiceText:restored.choices[i],isCorrect:i===restored.answerIndex0,meaning:text,judgmentReason:text,explanation:text,sourceImageSha256:restored.questionImageSha256,verificationStatus:'ORIGINAL_PDF_REVIEWED'})),explanation:restored.proposed.playExplanation,correctChoice:restored.choices[restored.answerIndex0]};
 globalThis.OFFICIAL_EXAM_REPAIRS={...(globalThis.OFFICIAL_EXAM_REPAIRS||{}),[restored.officialQuestionId]:repairedExplanation};
 const explanation=(globalThis.OFFICIAL_EXAM_EXPLANATION_RECORDS||[]).find(q=>q.officialQuestionId===restored.officialQuestionId);
 if(explanation)Object.assign(explanation,repairedExplanation);
}
