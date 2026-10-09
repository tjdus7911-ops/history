/* 원삼국 전용 설치 계층. 다른 시대 및 공식 원본 객체는 변경하지 않는다. */
const PROTO_STORY_VERSION=2;
const PROTO_LEGACY_QUESTION_ART=new Map(QUESTIONS.filter(q=>q.chapterId?.startsWith('proto-')).map(q=>[q,q.relatedIllustrationId]));
const PROTO_CAST={
 '주인공':'proto_modern','단':'proto_guide','단(???)':'proto_guide','현재 단':'proto_guide','과거의 단':'proto_guide',
 '라온':'proto_raon','어린 라온':'proto_raon','아린':'proto_arin','무진':'proto_warrior','소하':'proto_villager','해루':'proto_haeru','비류':'proto_biryu','상인':'proto_merchant','교역상':'proto_merchant','이야기꾼':'proto_storyteller'
};
const PROTO_NAMES={proto_modern:['나',24],proto_guide:['단',27],proto_raon:['라온',19],proto_arin:['아린',null],proto_warrior:['무진',null],proto_villager:['소하',null],proto_haeru:['해루',null],proto_biryu:['비류',null],proto_merchant:['상인',null],proto_storyteller:['이야기꾼',null]};
for(const [id,[name,age]] of Object.entries(PROTO_NAMES)){
 if(CHARACTERS[id])Object.assign(CHARACTERS[id],{characterName:name,characterAge:age});
 else CHARACTERS[id]={characterId:id,characterName:name,characterAge:age,speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:id};
 if(!['proto_modern','proto_guide','proto_warrior','proto_villager'].includes(id))ANCIENT_EXPRESSIONS.forEach(expression=>{
  PORTRAITS[`${id}_${expression}`]={characterId:id,expression,label:name,src:`assets/ancient/characters/${id.replace('_','-')}-neutral.png`};
 });
 // The player keeps the modern clothes of the supplied opening throughout this journey.
 if(id==='proto_modern')ANCIENT_EXPRESSIONS.forEach(expression=>PORTRAITS[`${id}_${expression}`]={...PORTRAITS.proto_modern_neutral,expression});
 if(typeof CHARACTER_RENDER_PROFILES!=='undefined')CHARACTER_RENDER_PROFILES.characters[id]={tier:'MAIN',scale:1.62,anchorX:0,anchorY:15,framing:'upper-body',lockStateScale:true};
}
for(const expression of ['smile','sad','determined'])PORTRAITS[`proto_guide_${expression}`]={...PORTRAITS[`proto_guide_${expression}`],src:`assets/ancient/characters/proto-guide-${expression}.png`};
const protoLine=({speaker,text})=>{
 if(speaker==='나레이션')return aN(text);
 const thought=speaker==='주인공(속마음)',id=thought?'proto_modern':PROTO_CAST[speaker];
 if(!id)throw Error(`원삼국 화자 누락: ${speaker}`);
 const expression=/미안|두렵|겁|후회|침묵|두려/.test(text)?'worried':/고맙|하하|ㅋㅋ|약속|마음에/.test(text)?'smile':/\?!|으악|알이라고/.test(text)?'surprised':'neutral';
 return dialogueLine(id,expression,text,thought?'thought':id==='proto_modern'?'player':'npc',speaker==='단(???)'?'???':speaker==='어린 라온'?'라온 · 과거 회상':speaker==='과거의 단'?'단 · 과거 회상':speaker==='주인공(속마음)'?'나 · 속마음':null);
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
// Existing proto-only scene IDs remain addressable through completion aliases.
for(const story of Object.values(STORIES))if(story.eraId==='proto-kingdoms')story.storyActive=false;
for(const c of PROTO_STORY_SCRIPT){
 const id=ancientChapterId('proto',c.number),last=protoSceneId(c.number,c.scenes.length);
 Object.assign(CHAPTERS[id],{title:c.title,subtitle:c.number===0?'낯선 시대에서 시작된 동행':'라온의 흔적을 따라 배우는 여러 나라',years:c.number<=2?'220년 늦가을 — 겨울':'221년 겨울 — 늦봄',startStoryId:protoSceneId(c.number,1),completeStoryId:last,thumbnail:ASSETS[protoBackground(c.number,c.scenes[0])].src,questionCount:0,reviewQuestionCount:0,questionSetCount:0,storyVersion:PROTO_STORY_VERSION});
 for(const s of c.scenes){
  const sceneId=protoSceneId(c.number,s.number),next=s.number<c.scenes.length?protoSceneId(c.number,s.number+1):null,bg=protoBackground(c.number,s),dialogues=s.dialogues.map(protoLine);
  const source=scene({sceneId,chapterId:id,eraId:'proto-kingdoms',year:c.number<=2?220:221,location:s.background,title:s.title,sceneType:s.choices.length?'CHOICE':s.type,illustrationId:bg,dialogues,nextStoryId:next,completeChapter:!next,storyActive:true,protoStoryVersion:PROTO_STORY_VERSION,sceneNumber:s.number,fictionNotice:'단과 라온의 여행은 여러 나라의 사료 속 특징을 배우는 허구 이야기입니다.',enterCharacterStates:{proto_modern:{characterAge:24},proto_guide:{characterAge:27,isAlive:true},proto_raon:{characterAge:19,isAlive:true}},flashback:/회상/.test(s.background),timeOfDay:/밤|어두운|모닥불/.test(s.background)?'night':'day'});
  if(c.number===3&&s.number>=4&&s.number<=6)source.fictionNotice='주몽의 건국 전승을 듣는 회상입니다. 현재 여행에서 주몽을 직접 만나지 않습니다.';
  if(c.number===4&&s.number===8)source.fictionNotice='현재보다 앞선 형제의 기억입니다. 과거 회상 속 모습을 상징적으로 보여 줍니다.';
  if(s.choices.length)source.choices=s.choices.map((v,index)=>choice(v.label,next||sceneId,{}, {proto_guide:index===1?1:0},'',{
   resultIllustrationId:bg,resultDialogues:[protoLine({speaker:'주인공',text:v.label}),...v.dialogues.map(protoLine)],importantChoice:`proto-${index}`,flags:{[`protoChoice_${c.number}_${s.number}`]:index}
  }));
  if(c.number===7&&s.number===7)source.choices.forEach((v,index)=>{for(const line of v.resultDialogues)if(line.characterId==='proto_guide'){line.expression=['smile','sad','determined'][index];line.portrait=`proto_guide_${line.expression}`;}});
  STORIES[sceneId]=source;
 }
 const alias=`proto_ch${String(c.number).padStart(2,'0')}_complete`;
 STORIES[alias]={...STORIES[last],sceneId:alias,storyActive:false,legacyAliasFor:last};
}
const PROTO_CHECKPOINTS=PROTO_EXAM_ASSIGNMENTS.map(([c,s,ids],i)=>{
 const script=PROTO_STORY_SCRIPT[c].scenes[s-1];
 return {checkpointId:`proto-ch${String(c).padStart(2,'0')}-s${String(s).padStart(2,'0')}`,number:i+1,chapterId:ancientChapterId('proto',c),sceneId:protoSceneId(c,s),learningTopics:[script.checkpoint.topic],questionIds:ids.map(id=>'official-'+id),verified:ids.length>0,missingQuestionCount:3-ids.length};
});
const PROTO_STUDY_QUESTION_IDS=[];
for(const checkpoint of PROTO_CHECKPOINTS){
 const story=STORIES[checkpoint.sceneId],setId=`${story.sceneId}_questions`,linked=[];
 for(const officialId of checkpoint.questionIds){
  const source=ancientSourceById.get(officialId),details=ancientExplanationById.get(officialId),questionId=`proto-study-${officialId}`;
  if(!source||!details||source.answer===null)throw Error(`검증 데이터 누락: ${officialId}`);
  const choices=Array.from({length:source.examLevel==='심화'?5:4},(_,i)=>'①②③④⑤'[i]);
  const q=question({questionId,officialQuestionId:officialId,chapterId:checkpoint.chapterId,era:'원삼국',primaryEra:'ancient',relatedSceneId:story.sceneId,relatedHistoricalEventId:`proto-checkpoint-${checkpoint.number}`,historicalEventId:`proto-checkpoint-${checkpoint.number}`,historicalEvent:checkpoint.learningTopics[0],relatedIllustrationId:story.illustrationId,questionType:'공식 원본 자료 분석형',difficulty:source.examLevel,question:details.question,sourceQuestionText:details.question,passage:details.clue,choices,sourceChoices:choices,answer:source.answer,answerLabel:source.answerLabel,acceptedAnswers:source.acceptedAnswers||[source.answer],explanation:details.explanation,wrongFeedback:'원본 자료와 여행에서 배운 단서를 다시 연결해 보세요.',memoryPrompt:story.title,gameMemory:story.title,storyConnection:story.title,examKeywords:checkpoint.learningTopics,concepts:checkpoint.learningTopics,conceptIds:[`proto-checkpoint-${checkpoint.number}`],rewardKnowledge:3,resumeStoryId:story.nextStoryId,isOfficial:true,sourceVerified:true,sourceStatus:'verified',sourceImageStatus:'verified',examRound:source.examRound,examYear:source.examYear,examLevel:source.examLevel,questionNumber:source.questionNumber,points:source.points,sourcePage:source.sourcePage,sourceFile:source.sourcePdf,answerFile:source.answerPdf,sourcePdf:source.sourcePdf,answerPdf:source.answerPdf,sourceQuestionImage:source.questionImage,questionImage:source.questionImage,examType:'한능검 대비 · 실제 기출',source:'국사편찬위원회 한국사능력검정시험 공식 문제지·정답표',protoStoryVersion:PROTO_STORY_VERSION});
  QUESTIONS.push(q);linked.push(questionId);PROTO_STUDY_QUESTION_IDS.push(questionId);
 }
 QUESTION_SETS[setId]={questionSetId:setId,checkpointId:checkpoint.checkpointId,chapterId:story.chapterId,afterSceneId:story.sceneId,resumeStoryId:story.nextStoryId,requiredCount:linked.length,targetCount:3,officialQuestionIds:linked,practiceQuestionIds:[],verifiedCount:linked.length,missingQuestionCount:checkpoint.missingQuestionCount,status:linked.length?'ready':'missing',sourceType:'official_verified',preserveQuestionOrder:true,verified:checkpoint.verified};
 Object.assign(story,{checkpointId:checkpoint.checkpointId,questionSetId:setId,questionSetStatus:linked.length?'ready':'missing',questionSetResumeStoryId:story.nextStoryId,linkedQuestionIds:linked,linkedOfficialQuestionIds:linked,linkedPracticeQuestionIds:[],questionSequenceMode:linked.length?'queue':null});
 if(story.choices&&linked.length)story.afterChoiceQuestionSetId=setId;
}
for(const c of PROTO_STORY_SCRIPT){
 const id=ancientChapterId('proto',c.number),ids=PROTO_STUDY_QUESTION_IDS.filter(qid=>QUESTIONS.find(q=>q.questionId===qid).chapterId===id);
 Object.assign(CHAPTERS[id],{questionCount:ids.length,reviewQuestionCount:ids.length,questionSetCount:PROTO_CHECKPOINTS.filter(cp=>cp.chapterId===id&&cp.questionIds.length).length});
 if(typeof SPLIT_REVIEW_IDS!=='undefined')SPLIT_REVIEW_IDS[id]=ids;
}
globalThis.PROTO_CHECKPOINTS=PROTO_CHECKPOINTS;
globalThis.PROTO_STORY_SCOPE={storyScenes:83,checkpointCount:15,officialQuestionCount:23,missingQuestionCount:22,choices:PROTO_STORY_SCRIPT.reduce((n,c)=>n+c.scenes.reduce((m,s)=>m+s.choices.length,0),0),dialogues:PROTO_STORY_SCRIPT.reduce((n,c)=>n+c.scenes.reduce((m,s)=>m+s.dialogues.length+s.choices.reduce((k,v)=>k+v.dialogues.length+1,0),0),0)};
Object.assign(globalThis.ANCIENT_STORY_SCOPE,{protoScenes:83});
// Old official objects remain in the bank for saved scores, but are no longer story anchors.
globalThis.protoActiveStoryQuestion=q=>!q.chapterId?.startsWith('proto-')||q.protoStoryVersion===PROTO_STORY_VERSION;

// Q01-Q18 describe learning links, not duplicate question objects. Several concepts
// share an existing review checkpoint so the search/reunion keeps its original rhythm.
const PROTO_MAIN_SLOT_DEFINITIONS=[
 ['Q01',2,2,'부여','5부족 연맹·사출도','68-advanced-03'],
 ['Q02',2,3,'부여','마가·우가·저가·구가·사출도','68-advanced-03'],
 ['Q03',2,5,'부여','부여·고구려의 1책 12법',null],
 ['Q04',2,10,'부여','영고·12월 제천 행사','64-advanced-02'],
 ['Q05',2,6,'부여','순장·영고·사출도 종합','68-advanced-03'],
 ['Q06',3,9,'고구려','5부·제가회의·제가의 지배','76-advanced-02'],
 ['Q07',3,10,'고구려','서옥제','76-advanced-02'],
 ['Q08',3,11,'고구려','동맹·10월·영고 비교','76-advanced-02'],
 ['Q09',4,4,'옥저','민며느리제·서옥제 비교','66-advanced-02'],
 ['Q10',4,5,'옥저','가족 공동 무덤','66-advanced-02'],
 ['Q11',4,3,'옥저','소금·어물 공납·고구려 지배','73-advanced-04'],
 ['Q12',5,2,'동예','책화','77-advanced-03'],
 ['Q13',5,5,'동예','족외혼',null],
 ['Q14',5,7,'동예','무천·단궁·과하마·반어피','77-advanced-03'],
 ['Q15',6,2,'삼한','마한·진한·변한·소국·신지·읍차','77-basic-02'],
 ['Q16',6,6,'삼한','소도·천군·제정 분리','78-advanced-03'],
 ['Q17',6,7,'삼한','공동 노동·두레·5월과 10월 제천 행사',null],
 ['Q18',6,5,'삼한','변한의 철 생산·낙랑과 왜 교역','70-advanced-02']
];
globalThis.PROTO_QUESTION_SLOTS=PROTO_MAIN_SLOT_DEFINITIONS.map(([questionSlotId,c,s,country,learningConcept,sourceId])=>{
 const q=sourceId?QUESTIONS.find(q=>q.questionId===`proto-study-official-${sourceId}`):null;
 const reviewCheckpoint=q?PROTO_CHECKPOINTS.find(cp=>cp.questionIds.includes(q.officialQuestionId)):null;
 const slot={questionSlotId,chapterId:ancientChapterId('proto',c),sceneId:protoSceneId(c,s),country,learningConcept,
  examRound:q?.examRound??null,examLevel:q?.examLevel??null,examQuestionNumber:q?.questionNumber??null,
  correctAnswer:q?q.answer+1:null,answerIndex:q?.answer??null,explanation:q?.explanation??null,
  sourceVerificationStatus:q?'official_original_and_answer_checked':'기출 검증 대기',
  questionId:q?.questionId??null,officialQuestionId:q?.officialQuestionId??null,
  reviewSceneId:reviewCheckpoint?.sceneId??null,placement:'existing_checkpoint',
  sourceVerificationDate:q?'2026-10-09':null,
  verificationNote:questionSlotId==='Q03'?'71회 심화 2번의 공식 문제지·정답은 확인했으나 기존 잘린 이미지의 완전성 검증 및 연결은 대기':questionSlotId==='Q13'?'족외혼을 직접 다루는 원본 문항 미확보':questionSlotId==='Q17'?'두레를 직접 다루는 원본 문항 미확보':null};
 // Attach metadata only to editable main-story scenes. No opening/ending/UI mutations.
 (STORIES[slot.sceneId].questionSlotIds??=[]).push(questionSlotId);
 return slot;
});
globalThis.PROTO_LEARNING_LINKS=PROTO_QUESTION_SLOTS.map(slot=>({
 conceptId:`proto-main-${slot.questionSlotId.toLowerCase()}`,country:slot.country,
 learningConcept:slot.learningConcept,sceneIds:[slot.sceneId],questionSlotIds:[slot.questionSlotId],
 questionIds:slot.questionId?[slot.questionId]:[],reviewSceneId:slot.reviewSceneId
}));
