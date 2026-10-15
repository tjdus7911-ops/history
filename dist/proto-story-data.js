/* 원삼국 전용 설치 계층. 승인한 다섯 장면 원본을 그대로 설치한다. */
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
const PROTO_CAST={
 '주인공':'proto_modern','단':'proto_guide','단(???)':'proto_guide','현재 단':'proto_guide','과거의 단':'proto_guide',
 '라온':'proto_raon','어린 라온':'proto_raon','아린':'proto_arin','무진':'proto_warrior','소하':'proto_villager',
 '해루':'proto_haeru','비류':'proto_biryu','상인':'proto_merchant','교역상':'proto_merchant','이야기꾼':'proto_storyteller'
};
const PROTO_NAMES={proto_modern:['나',24],proto_guide:['단',27],proto_raon:['라온',19],proto_arin:['아린',null],proto_warrior:['무진',null],proto_villager:['소하',null],proto_haeru:['해루',null],proto_biryu:['비류',null],proto_merchant:['상인',null],proto_storyteller:['이야기꾼',null]};
for(const [id,[name,age]] of Object.entries(PROTO_NAMES)){
 if(CHARACTERS[id])Object.assign(CHARACTERS[id],{characterName:name,characterAge:age});
 else CHARACTERS[id]={characterId:id,characterName:name,characterAge:age,speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:id};
 if(!['proto_modern','proto_guide','proto_warrior','proto_villager'].includes(id))ANCIENT_EXPRESSIONS.forEach(expression=>{
  PORTRAITS[`${id}_${expression}`]={characterId:id,expression,label:name,src:`assets/ancient/characters/${id.replace('_','-')}-neutral.png`};
 });
 if(id==='proto_modern')ANCIENT_EXPRESSIONS.forEach(expression=>PORTRAITS[`${id}_${expression}`]={...PORTRAITS.proto_modern_neutral,expression});
 if(typeof CHARACTER_RENDER_PROFILES!=='undefined')CHARACTER_RENDER_PROFILES.characters[id]={tier:'MAIN',scale:1.62,anchorX:0,anchorY:15,framing:'upper-body',lockStateScale:true};
}
for(const expression of ['smile','sad','determined'])PORTRAITS[`proto_guide_${expression}`]={...PORTRAITS[`proto_guide_${expression}`],src:`assets/ancient/characters/proto-guide-${expression}.png`};
const protoLine=({speaker,text,lineId,learningKeywordIds=[]})=>{
 let line;
 const thought=speaker==='주인공(속마음)';
 if(speaker==='나레이션')line=aN(text);
 else{
  const id=thought?'proto_modern':PROTO_CAST[speaker];
  if(!id)throw Error(`원삼국 화자 누락: ${speaker}`);
  const expression=/미안|두렵|겁|후회|침묵|두려/.test(text)?'worried':/고맙|하하|ㅋㅋ|약속|마음에/.test(text)?'smile':/\?!|으악|알이라고/.test(text)?'surprised':'neutral';
  line=dialogueLine(id,expression,text,thought?'thought':id==='proto_modern'?'player':'npc',speaker==='단(???)'?'???':thought?'주인공 · 속마음':speaker==='주인공'?null:speaker);
 }
 return {...line,lineId,protoSpeaker:speaker,protoKind:speaker==='나레이션'?'narration':thought?'thought':'dialogue',learningKeywordIds:[...learningKeywordIds]};
};
const PROTO_SYMBOLIC_BACKGROUNDS=['camp','wagon','village','ritual','jumong-birth','jolbon','grave','workshop','sodo','crossroads','map'];
for(const name of PROTO_SYMBOLIC_BACKGROUNDS){const id=`proto-story-${name}`;ASSETS[id]={id,label:`원삼국 ${name} 장면 · 상징 삽화`,src:`assets/ancient/story/${name}.svg`,imageKind:'story-background',embeddedCharacters:false,status:'ready'};}
function protoBackground(c,s){
 const b=s.background;
 if(/지도/.test(b))return 'proto-story-map';
 if(/주몽 탄생/.test(b))return 'proto-story-jumong-birth';
 if(/졸본|주몽의 이동/.test(b))return 'proto-story-jolbon';
 if(/무덤/.test(b))return 'proto-story-grave';
 if(/작업장/.test(b)&&c===6)return 'proto-story-workshop';
 if(/신성|소도/.test(b))return 'proto-story-sodo';
 if(/갈림길|세 갈래/.test(b))return 'proto-story-crossroads';
 if(/제사|광장/.test(b)&&c===2)return 'proto-story-ritual';
 if(/모닥불|야영/.test(b))return 'proto-story-camp';
 if(/수레|교역로/.test(b)&&c===1&&s.number<=3)return 'proto-story-wagon';
 if(c===2)return ancientAssetId('proto-buyeo-village');
 if(c===3)return ancientAssetId('proto-goguryeo-fortress');
 if(c===4)return /회상/.test(b)?'proto-story-workshop':/집|마을|작업/.test(b)?'proto-story-village':ancientAssetId('proto-okjeo-coast');
 if(c===5)return ancientAssetId('proto-dongye-boundary');
 if(c===6)return ancientAssetId('proto-samhan-market');
 return ancientAssetId('proto-forest-road');
}
const protoSceneId=(c,s)=>`proto_ch${String(c).padStart(2,'0')}_s${s}`;
for(const story of Object.values(STORIES))if(story.eraId==='proto-kingdoms')story.storyActive=false;
for(const chapterId of ['proto-ch00','proto-ch01','proto-ch07'])if(CHAPTERS[chapterId])CHAPTERS[chapterId].implemented=false;
for(const c of PROTO_STORY_SCRIPT){
 const id=ancientChapterId('proto',c.number),last=c.scenes.at(-1).sceneId;
 const first=c.scenes[0],firstBackground=protoBackground(c.number,first),year=Number(first.period.match(/\d{3}/)?.[0]||220);
 Object.assign(CHAPTERS[id],{title:c.title,subtitle:c.arc,years:`${year}년 · 여러 나라의 성장`,startStoryId:first.sceneId,completeStoryId:last,thumbnail:ASSETS[firstBackground].src,questionCount:0,reviewQuestionCount:0,questionSetCount:0,storyVersion:PROTO_STORY_VERSION,contentVersion:PROTO_CONTENT_VERSION,implemented:true});
 for(const s of c.scenes){
  const sceneId=s.sceneId,next=s.sceneId===last?null:s.nextSceneId,bg=protoBackground(c.number,s),dialogues=s.main.map(protoLine),sceneYear=Number(s.period.match(/\d{3}/)?.[0]||year);
  const source=scene({sceneId,chapterId:id,eraId:'proto-kingdoms',year:sceneYear,location:s.location,title:s.title,sceneType:s.choices.length?'CHOICE':'STORY',illustrationId:bg,dialogues,nextStoryId:next,completeChapter:!next,storyActive:true,protoStoryVersion:PROTO_STORY_VERSION,contentVersion:PROTO_CONTENT_VERSION,sceneNumber:s.number,protoSource:s,protoCommon:s.join.map(protoLine),protoNextSceneId:s.nextSceneId,protoPeriod:s.period,protoCountry:s.country,protoPlace:s.place,protoLearningIds:s.learning.map(item=>item.id),protoQueue:s.quizAfter,fictionNotice:'단과 라온의 여행은 여러 나라의 사료 속 특징을 배우는 허구 이야기입니다.',enterCharacterStates:{proto_modern:{characterAge:24},proto_guide:{characterAge:27,isAlive:true},proto_raon:{characterAge:19,isAlive:true}},flashback:/회상/.test(s.location),timeOfDay:/밤|어두운|모닥불/.test(s.location)?'night':'day'});
  STORIES[sceneId]=source;
 }
 const alias=`proto_ch${String(c.number).padStart(2,'0')}_complete`;
 STORIES[alias]={...STORIES[last],sceneId:alias,storyActive:false,legacyAliasFor:last};
}
const PROTO_CHECKPOINTS=PROTO_REVISION_SOURCE.examPlan.queues.map((queue,index)=>({
 ...queue,checkpointId:`proto-v3-${queue.sceneId}`,number:index+1,chapterId:STORIES[queue.sceneId].chapterId,
 learningTopics:STORIES[queue.sceneId].protoSource.learning.map(item=>item.id),questionIds:[...queue.officialQuestionIds],verified:true,missingQuestionCount:0
}));
const PROTO_STUDY_QUESTION_IDS=[];
for(const checkpoint of PROTO_CHECKPOINTS){
 const story=STORIES[checkpoint.sceneId],setId=`${story.sceneId}_questions`,linked=[];
 for(const officialId of checkpoint.questionIds){
  const source=ancientSourceById.get(officialId),details=ancientExplanationById.get(officialId),authored=PROTO_REVISION_SOURCE.examPlan.questions.find(q=>q.officialQuestionId===officialId),questionId=`proto-v3-${officialId}`;
  if(!source||!details?.explanation||!authored||source.answer!==authored.answerIndex0)throw Error(`검증 데이터 누락: ${officialId}`);
  const learningIds=[...authored.learningKeywordIds],choices=Array.from({length:authored.choiceCount},(_,index)=>`${index+1}번`);
  const protoExam={...authored,label:`${authored.examRound}회 ${authored.examLevel} ${authored.questionNumber}번`,editorialFocusSummary:authored.proposed.editorialFocusSummary,proposed:{...authored.proposed,playExplanation:details.explanation}};
  const q=question({questionId,officialQuestionId:officialId,chapterId:checkpoint.chapterId,era:'원삼국',primaryEra:'ancient',relatedSceneId:story.sceneId,relatedHistoricalEventId:`proto-checkpoint-${checkpoint.number}`,historicalEventId:`proto-checkpoint-${checkpoint.number}`,historicalEvent:authored.proposed.editorialFocusSummary,relatedIllustrationId:story.illustrationId,questionType:'공식 원본 자료 분석형',difficulty:source.examLevel,question:details.question,sourceQuestionText:details.question,passage:details.clue,choices,sourceChoices:choices,answer:authored.answerIndex0,answerLabel:String(authored.answerNumber1),acceptedAnswers:[authored.answerIndex0],explanation:details.explanation,wrongFeedback:details.explanation,memoryPrompt:story.title,gameMemory:story.title,storyConnection:story.title,examKeywords:learningIds,concepts:learningIds,conceptIds:learningIds,rewardKnowledge:3,resumeStoryId:story.nextStoryId,isOfficial:true,sourceVerified:true,sourceStatus:'verified',sourceImageStatus:'verified',examRound:authored.examRound,examYear:authored.examYear,examLevel:authored.examLevel,questionNumber:authored.questionNumber,points:source.points,sourcePage:source.sourcePage,sourceFile:source.sourcePdf,answerFile:source.answerPdf,sourcePdf:source.sourcePdf,answerPdf:source.answerPdf,sourceQuestionImage:authored.questionImage,questionImage:authored.questionImage,questionImageSha256:authored.questionImageSha256,examType:'한능검 대비 · 실제 기출',source:'국사편찬위원회 한국사능력검정시험 공식 문제지·정답표',protoStoryVersion:PROTO_STORY_VERSION,contentVersion:PROTO_CONTENT_VERSION,protoExam,protoRequiredSceneIds:[...authored.proposed.requiresReadSceneIds],protoIndependentExplanation:details.explanation,protoLearningIds:learningIds});
  QUESTIONS.push(q);linked.push(questionId);PROTO_STUDY_QUESTION_IDS.push(questionId);
 }
 QUESTION_SETS[setId]={questionSetId:setId,checkpointId:checkpoint.checkpointId,chapterId:story.chapterId,afterSceneId:story.sceneId,afterLineId:checkpoint.afterLineId,resumeStoryId:story.nextStoryId,requiredCount:linked.length,targetCount:linked.length,officialQuestionIds:linked,practiceQuestionIds:[],verifiedCount:linked.length,missingQuestionCount:0,status:'ready',sourceType:'official_verified',preserveQuestionOrder:true,verified:true};
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
globalThis.PROTO_STORY_SCOPE={contentVersion:PROTO_CONTENT_VERSION,storyScenes:5,chapterCount:5,checkpointCount:5,officialQuestionCount:15,missingQuestionCount:0,choices:0,dialogues:PROTO_REVISION_SOURCE.counts.authoredUtterances,learningCount:31};
Object.assign(globalThis.ANCIENT_STORY_SCOPE,{protoChapters:PROTO_STORY_SCRIPT.length,protoScenes:PROTO_STORY_SCOPE.storyScenes});
globalThis.protoActiveStoryQuestion=q=>!q.chapterId?.startsWith('proto-')||q.protoStoryVersion===PROTO_STORY_VERSION;
globalThis.PROTO_QUESTION_SLOTS=PROTO_REVISION_SOURCE.learning.map(item=>({questionSlotId:item.id,sceneId:item.firstSceneId,sceneIds:[...item.sceneIds],learningConcept:item.title,questionIds:item.questionIds.map(id=>`proto-v3-${id}`),officialQuestionIds:[...item.questionIds],sourceVerificationStatus:'official_original_and_answer_checked'}));
globalThis.PROTO_LEARNING_LINKS=PROTO_REVISION_SOURCE.learning.map(item=>({conceptId:item.id,learningConcept:item.title,sceneIds:[...item.sceneIds],questionSlotIds:[item.id],questionIds:item.questionIds.map(id=>`proto-v3-${id}`)}));
globalThis.PROTO_REVISION_RUNTIME={version:PROTO_STORY_VERSION,contentVersion:PROTO_CONTENT_VERSION,source:PROTO_REVISION_SOURCE,
 sources:new Map(Object.values(STORIES).filter(source=>source.protoStoryVersion===PROTO_STORY_VERSION&&source.storyActive!==false).map(source=>[source.sceneId,source])),
 questionByOfficialId:new Map(QUESTIONS.filter(q=>q.protoStoryVersion===PROTO_STORY_VERSION).map(q=>[q.officialQuestionId,q])),
 legacyOfficialIds:PROTO_LEGACY_OFFICIAL_IDS,
 learningById:new Map(PROTO_REVISION_SOURCE.learning.map(item=>[item.id,item]))};
