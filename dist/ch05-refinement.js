/* CH.05 content and CH.05/06 portrait participation. Preserve legacy IDs and other chapters. */
const CH05_BACKGROUND_MAP={
  ch05_border:['route-caravan','993년 전쟁 소식으로 멈춘 북방 장터'],
  ch05_invasion:['ch05-frontier-invasion','청천강 이북, 남하하는 거란군과 고려 방어선'],
  ch05_council:['ch05-council-crisis','영토 할양을 논의하는 긴장한 고려 조정'],
  ch05_seohui:['ch05-seohui-negotiation','거란 군영에서 열린 서희의 담판'],
  ch05_terms:['ch05-seohui-negotiation','담판 직후 거란 군영'],
  ch05_withdraw:['ch05-khitan-withdrawal','거란군이 물러나는 북방 성문'],
  ch05_six:['ch05-gangdong-fortifications','압록강 동쪽에 확보한 강동 6주'],
  ch05_builders:['ch05-gangdong-fortifications','강동 6주 성벽과 목책 공사'],
  ch05_people:['ch05-gangdong-fortifications','새 성 아래 다시 살아나는 북방 마을'],
  ch05_memory:['ch05-gangdong-fortifications','확보된 압록강 동쪽 길'],
  ch05_bridge:['late-night','1009년 정변 소식, 개경으로 향하는 어두운 길'],
  ch05_after:['late-night','1009년 정변으로 어두운 개경']
};
for(const id of ['ch05-frontier-invasion','ch05-council-crisis','ch05-khitan-withdrawal','ch05-gangdong-fortifications'])lateDedicatedArt(id,'assets/scenes/'+id+'.webp',Object.values(CH05_BACKGROUND_MAP).find(pair=>pair[0]===id)[1]);
// One shared Yeon identity for CH.05 and CH.06; no new character images.
for(const expression of ['neutral','smile','serious','worried','surprised','angry','thinking']){
  const assetExpression=['angry','thinking'].includes(expression)?'serious':expression;
  PORTRAITS['ch05_yeon_'+expression]=portrait('yeon',expression,'연 · CH.05/06 공통 여행자',['#303b43','#8e7255'],'assets/characters/ch05-yeon-'+assetExpression+'-v2.webp');
}
for(const [sceneId,[illustrationId]] of Object.entries(CH05_BACKGROUND_MAP)){
  const s=STORIES[sceneId];s.illustrationId=illustrationId;s.backgroundImage=ASSETS[illustrationId].src;s.characterSlots='player-partner';
  for(const c of s.choices||[])c.resultIllustrationId=illustrationId;
  for(const q of QUESTIONS.filter(q=>q.chapterId==='ch05'&&q.relatedSceneId===sceneId))q.relatedIllustrationId=illustrationId;
}
CHAPTERS.ch05.thumbnail=ASSETS[STORIES.ch05_border.illustrationId].src;

// Add an entry scene; legacy scene IDs and saved positions remain valid.
lateDedicatedArt('ch05-empty-guild-dusk','assets/scenes/ch05-empty-guild-dusk.webp','도윤이 떠난 뒤, 해 질 무렵의 빈 상단 마당');
STORIES.ch05_prologue=scene({sceneId:'ch05_prologue',chapterId:'ch05',year:993,location:'도윤상단 · 시간이 흐른 마당',title:'남겨진 시간',illustrationId:'ch05-empty-guild-dusk',backgroundImage:ASSETS['ch05-empty-guild-dusk'].src,timeOfDay:'sunset',weather:'clear',sceneType:'thought',readingMode:'narration-blocks',characterStageMode:'hidden',visibleCharacters:[],characterPortraitIds:[],dialogues:[
  tLine('도윤이 죽고 난 뒤,'),
  tLine('나는 더 이상 누구와도 인연을 쌓지 않기로 했다.')
],nextStoryId:'ch05_border',continueLabel:'993년 — 거란의 침입'});
CHAPTERS.ch05.startStoryId='ch05_prologue';
for(const s of Object.values(STORIES).filter(s=>s.chapterId==='ch06'))s.characterSlots='player-partner';

// Only interpersonal turns are adjusted; historical narration and all questions stay intact.
STORIES.ch05_border.dialogues.push(
  lLine('yeon','북쪽으로 가시는 길인가요? 저는 연이라고 합니다. 함께 가시겠어요?','neutral'),
  lLine('player','아뇨. 혼자 가겠습니다.','serious'),
  lLine('yeon','알겠습니다. 길이 막힌 곳만 알려 드릴게요. 조심해서 가세요.','smile'),
  tLine('이름을 되묻지는 않았다. 다시 누군가와 가까워지고 싶지 않았다.')
);
for(const [i,c] of STORIES.ch05_border.choices.entries()){
  c.resultDialogues[0]=lLine('player',i===0?'다친 사람이 있는지만 확인하고 가겠습니다.':'길이 막힌 곳은 적어 두겠습니다. 알려 주셔서 감사합니다.','serious');
  c.resultDialogues[1]=lLine('yeon',i===0?'저도 사람들을 살피고 있었어요. 저쪽부터 확인해 볼게요.':'도움이 됐다니 다행이에요. 더 붙잡지는 않을게요.',i===0?'neutral':'smile');
}
STORIES.ch05_withdraw.dialogues.push(
  lLine('yeon','성으로 옮길 짐이 아직 남았어요. 저는 조금 더 있다 가려고요.','worried'),
  lLine('player','저쪽 수레는 제가 옮기겠습니다. 혼자 들기엔 무거워 보이네요.','serious'),
  lLine('yeon','고맙습니다. 그럼 저는 앞에서 길을 볼게요.','smile'),
  tLine('잠깐 돕는 것뿐이라고 생각했다. 그래도 이번에는 먼저 발길을 돌리지 않았다.')
);
STORIES.ch05_builders.dialogues.find(d=>d.characterId==='player').dialogue='강동 6주는 서희의 말과 이 사람들의 노동이 함께 만든 결과네요.';
STORIES.ch05_people.dialogues.find(d=>d.characterId==='player').dialogue='땅의 이름만이 아니라, 그 땅을 지킨 선택도 기억해야겠네요.';
STORIES.ch05_people.dialogues.push(
  lLine('yeon','장터까지 가 보려고요. 혼자 걷고 싶으시면 먼저 가셔도 돼요.','neutral'),
  lLine('player','오늘은 같이 가도 될까요?','neutral'),
  lLine('yeon','물론이죠. 저는 길에 있는 가게도 좀 둘러보고 싶어요.','smile'),
  tLine('도윤과 걷던 길을 잊은 건 아니었다. 그 기억을 품은 채, 이번에는 연의 걸음 옆에 내 걸음을 놓았다.')
);

const CH05_OFFICIAL_CONTENT=[
  {examRound:73,questionNumber:11,sceneId:'ch05_terms',question:'(가)에 해당하는 인물로 옳은 것은?',choices:['서희','윤관','최영','정도전'],answer:0,
    passage:'이곳은 고려의 외교가이자 문신이었던 (가)의 무덤으로 부인의 묘도 함께 있습니다. 그는 대군을 이끌고 온 거란 장수 소손녕과 외교 담판을 벌여 강동 6주를 확보하는 성과를 올렸습니다.',
    explanation:'소손녕과 담판해 고려의 고구려 계승 의식을 강조하고 강동 6주 확보의 근거를 마련한 인물은 서희입니다. 윤관은 여진 정벌과 동북 9성, 최영은 홍건적·왜구 격퇴, 정도전은 조선 건국과 연결됩니다.',concepts:['서희','소손녕','외교 담판','강동 6주']},
  {examRound:67,questionNumber:13,sceneId:'ch05_builders',question:'다음 사건이 일어난 시기를 연표에서 옳게 고른 것은?',choices:['(가)','(나)','(다)','(라)'],answer:0,
    passage:'우리 거란과 국경을 맞대고 있는데도 너희 고려가 바다 건너 송을 섬기는 까닭에 군사를 일으킨 것이다. / 여진이 압록강 안팎을 차지하고 있기 때문에 거란과 통하는 길이 막혔다. 여진을 내쫓고 우리 옛 땅을 돌려준다면 어찌 교류하지 않겠는가? / 연표: 936 후삼국 통일, 1019 귀주 대첩, 1104 별무반 설치, 1232 처인성 전투, 1359 홍건적 침입.',
    explanation:'자료는 993년 거란 1차 침입 당시 서희와 소손녕의 담판입니다. 후삼국 통일(936년) 이후, 귀주 대첩(1019년) 이전인 (가)에 해당합니다.',concepts:['993년','거란 1차 침입','서희','송','여진','사건 순서']},
  {examRound:77,questionNumber:12,sceneId:'ch05_memory',question:'다음 상황 이후에 일어난 사실로 옳은 것은?',choices:['김흠돌이 반란을 도모하였다.','장문휴가 등주를 공격하였다.','계백이 황산벌에서 항전하였다.','강감찬이 귀주에서 대승을 거두었다.'],answer:3,
    passage:'서희는 거란군 진영으로 가 소손녕과 만났어요. 서희는 고려가 고구려를 계승한 나라임을 주장했어요. 또한 여진을 몰아내고 우리 옛 땅을 돌려준다면 거란과 교류할 수 있다고 말했어요. 이러한 주장이 일리가 있다고 판단한 거란은 일주일 동안 서희를 위해 잔치를 열고, 많은 선물을 주어 보냈어요. 이에 왕은 기뻐하며 강가에 나가 서희를 맞이했어요.',
    explanation:'993년 서희의 담판 이후에는 1019년 강감찬의 귀주 대첩이 일어났습니다. 김흠돌의 난(681년), 장문휴의 등주 공격(732년), 계백의 황산벌 항전(660년)은 모두 이전입니다.',concepts:['서희','거란','고구려 계승','여진','귀주 대첩','사건 순서']}
];
// Original PDF crops, answer keys and provenance are attached below. No other bank is reprocessed.
const CH05_PDF_SOURCES = [
  {
    "examRound": 67,
    "examYear": 2023,
    "examLevel": "기본",
    "questionNumber": 13,
    "sourcePage": 4,
    "sourceFile": "67회 한국사_문제지(기본).pdf",
    "answerFile": "67회 한국사_정답표(기본).pdf",
    "sourceQuestionImage": "assets/exams/ch05/67-basic-13.webp",
    "sourceImageWidth": 580,
    "sourceImageHeight": 777,
    "sourceQuestionBounds": [
      0.06,
      0.075,
      0.49,
      0.47
    ],
    "sourceImageHash": "ab7a3e3176b0b4a76a97d4223914b51f4949096175137e13b23e3c82b3f17c7c",
    "sourcePdfHash": "641980cef3a53061cc6eb677d15def23663ed381b594b7d58377dcd116df606b",
    "answerPdfHash": "baedd11e1b5365c8c56a3c77a7a6013afbd8035fa6322e9cac51cd6d0d719ed6",
    "answer": 0,
    "sourceAnswerPage": 1,
    "sourceUrl": "https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000029979"
  },
  {
    "examRound": 73,
    "examYear": 2025,
    "examLevel": "기본",
    "questionNumber": 11,
    "sourcePage": 3,
    "sourceFile": "73회 한국사_문제지(기본).pdf",
    "answerFile": "73회 한국사_정답표(기본).pdf",
    "sourceQuestionImage": "assets/exams/ch05/73-basic-11.webp",
    "sourceImageWidth": 572,
    "sourceImageHeight": 613,
    "sourceQuestionBounds": [
      0.055,
      0.598,
      0.491,
      0.928
    ],
    "sourceImageHash": "6b51879fe3aa139f08e2cc7eb7eb3e7e8772a7027fcdb74a06d0690c9a67f2d7",
    "sourcePdfHash": "f7298700bf31c5a423de5de5d4fe433d68ff0a945c8b872097e9b6673f3f4e7d",
    "answerPdfHash": "a70ecf88728e4423f6cb880f27f469caba38a3a61a8ce97082a4610aec40ec4f",
    "answer": 0,
    "sourceAnswerPage": 1,
    "sourceUrl": "https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000030051"
  },
  {
    "examRound": 77,
    "examYear": 2026,
    "examLevel": "기본",
    "questionNumber": 12,
    "sourcePage": 3,
    "sourceFile": "77회 한국사_문제지(기본).pdf",
    "answerFile": "77회 한국사_정답표(기본).pdf",
    "sourceQuestionImage": "assets/exams/ch05/77-basic-12.webp",
    "sourceImageWidth": 582,
    "sourceImageHeight": 684,
    "sourceQuestionBounds": [
      0.512,
      0.067,
      0.956,
      0.435
    ],
    "sourceImageHash": "4df4555eabfdd2cd82d230a01e6b3ad04fb8801c6d254343630e0ca2b3990fb6",
    "sourcePdfHash": "6f1c581280de0369fd7a060cc8e9ef40648eaa630d7da3d5f838e88bfa755563",
    "answerPdfHash": "a5c299275098c3559bfb86075bad164ff6e57f3fab4bdbd59f8bddce6f7f9f75",
    "answer": 3,
    "sourceAnswerPage": 1,
    "sourceUrl": "https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000030109"
  }
];
for(const item of CH05_OFFICIAL_CONTENT){
  const source=CH05_PDF_SOURCES.find(q=>q.examRound===item.examRound&&q.questionNumber===item.questionNumber);
  if(!source)throw new Error('Missing CH.05 PDF source: '+item.examRound);
  const s=STORIES[item.sceneId],id='ch05-official-'+item.examRound+'-basic-'+item.questionNumber;
  const q=officialExamQuestion({...source,...item,questionId:id,chapterId:'ch05',year:s.year,difficulty:'중',questionType:'실제 기출',relatedSceneId:s.sceneId,relatedIllustrationId:s.illustrationId,relatedHistoricalEventId:s.historicalEventId,historicalEvent:'서희의 담판과 강동 6주',resumeStoryId:s.nextStoryId,examKeywords:item.concepts,conceptIds:item.concepts,rewardKnowledge:3,memoryPrompt:s.title+'에서 경험한 서희의 담판을 떠올린다',gameMemory:s.title+'에서 본 담판과 북방 확보의 흐름을 문제의 자료와 연결한다.'});
  Object.assign(q,{sourceImageStatus:'verified',sourceImageVerified:true,sourceAnswerVerified:true,sourceCheckedAt:'2026-10-04',sourceQuestionText:item.question,sourceChoices:[...item.choices]});delete q.sourceImageReason;
  QUESTIONS.push(q);
  const setId='ch05-official-'+item.examRound,poolId='pool-'+setId;
  QUESTION_POOLS[poolId]={questionPoolId:poolId,chapterId:'ch05',conceptIds:item.concepts,questionIds:[id],sourceType:'official_exam'};
  QUESTION_SETS[setId]={questionSetId:setId,chapterId:'ch05',afterSceneId:s.sceneId,resumeStoryId:s.nextStoryId,questionPoolId:poolId,conceptIds:item.concepts,requiredCount:1,officialQuestionIds:[id],practiceQuestionIds:[],verifiedCount:1,practiceCount:0,missingQuestionCount:0,status:'ready',sourceType:'official_exam'};
  Object.assign(s,{questionSetId:setId,questionSetStatus:'ready',questionSetResumeStoryId:s.nextStoryId,linkedQuestionIds:[id],linkedPracticeQuestionIds:[],questionSequenceMode:'queue'});
  SPLIT_STORY_QUESTION_IDS.ch05.push(id);SPLIT_REVIEW_IDS.ch05.push(id);lateQuestionIdsByChapter.ch05.push(id);lateQuestionSetsByChapter.ch05.push(setId);
  for(const concept of item.concepts)(CONCEPT_QUESTION_INDEX[concept]||(CONCEPT_QUESTION_INDEX[concept]=[])).push(id);
}
Object.assign(CHAPTERS.ch05,{questionCount:12,reviewQuestionCount:12,questionSetCount:6});
Object.assign(LATE_GORYEO_REPORT.ch05,{scenes:13,questions:12,questionSets:6});

const CH05_ADDED_PDF_SOURCES=[
  {
    "examRound": 63,
    "examYear": 2023,
    "examLevel": "심화",
    "questionNumber": 14,
    "sourcePage": 4,
    "sourceFile": "63회 한국사_문제지(심화).pdf",
    "answerFile": "63회 한국사_정답표(심화).pdf",
    "sourceQuestionImage": "assets/exams/ch05/63-advanced-14.webp",
    "sourceImageWidth": 656,
    "sourceImageHeight": 679,
    "sourceQuestionBounds": [
      0.055,
      0.09,
      0.493,
      0.401
    ],
    "sourceImageHash": "adf36c73e3fa9aeedfe7329ffa00a10fb51bfc43121ed105a9ebee81652cc955",
    "sourcePdfHash": "42f3f331ce2fb5fb4ff267b18ab255bb4370f5f187f6464ca63f681c9ce38b14",
    "answerPdfHash": "8fd315a7e3b1b371ccebaa491a98bea369bd3005c813c069352ba369609f3274",
    "answer": 1,
    "sourceAnswerPage": 1,
    "sourceImageStatus": "verified",
    "sourceImageVerified": true,
    "sourceAnswerVerified": true,
    "sourceCheckedAt": "2026-10-04"
  },
  {
    "examRound": 64,
    "examYear": 2023,
    "examLevel": "심화",
    "questionNumber": 11,
    "sourcePage": 3,
    "sourceFile": "64회 한국사_문제지(심화).pdf",
    "answerFile": "64회 한국사_정답표(심화).pdf",
    "sourceQuestionImage": "assets/exams/ch05/64-advanced-11.webp",
    "sourceImageWidth": 653,
    "sourceImageHeight": 784,
    "sourceQuestionBounds": [
      0.513,
      0.092,
      0.949,
      0.451
    ],
    "sourceImageHash": "04931d53c5ec4cd49c3a8e0d2632c9bdf70525aa731d28b52e58434ac3ee1057",
    "sourcePdfHash": "483dbf4e35c9888d6d36cbd0495db34c506ef06f2b1f64f31c3931b2f07332a0",
    "answerPdfHash": "ea6742c2dec57e129b87ebba734a73e4527126390a84ed2923ed0a24d67d3280",
    "answer": 0,
    "sourceAnswerPage": 1,
    "sourceImageStatus": "verified",
    "sourceImageVerified": true,
    "sourceAnswerVerified": true,
    "sourceCheckedAt": "2026-10-04"
  },
  {
    "examRound": 72,
    "examYear": 2024,
    "examLevel": "심화",
    "questionNumber": 12,
    "sourcePage": 3,
    "sourceFile": "제72회 심화 문제지.pdf",
    "answerFile": "제72회 심화 정답표.pdf",
    "sourceQuestionImage": "assets/exams/ch05/72-advanced-12.webp",
    "sourceImageWidth": 647,
    "sourceImageHeight": 654,
    "sourceQuestionBounds": [
      0.51,
      0.063,
      0.954,
      0.38
    ],
    "sourceImageHash": "86a5f9edf59f7595401bbd344f05606637aa8c1bd647e2585192ee3ff4207108",
    "sourcePdfHash": "87307e726a2605000a087b3c97ec2bae8e4c079ca2a2ef2b567cc9a4a415b9b5",
    "answerPdfHash": "9f71656a1dfa110393e5097d3712c708e498470b3355ce680543ea959a59bfc7",
    "answer": 2,
    "sourceAnswerPage": 1,
    "sourceImageStatus": "verified",
    "sourceImageVerified": true,
    "sourceAnswerVerified": true,
    "sourceCheckedAt": "2026-10-04"
  },
  {
    "examRound": 74,
    "examYear": 2025,
    "examLevel": "심화",
    "questionNumber": 12,
    "sourcePage": 3,
    "sourceFile": "74회 한국사_문제지(심화).pdf",
    "answerFile": "74회 심화 정답표.pdf",
    "sourceQuestionImage": "assets/exams/ch05/74-advanced-12.webp",
    "sourceImageWidth": 643,
    "sourceImageHeight": 838,
    "sourceQuestionBounds": [
      0.508,
      0.53,
      0.949,
      0.936
    ],
    "sourceImageHash": "2285dcd9bea7d66cc78eec1dc5ed226b5b2cb38a5069557e621d3c73dc3bcc4d",
    "sourcePdfHash": "7d7322d680119d7b7b89c7465edc1dd8d0f06e8180594aff69b7d34502a44c79",
    "answerPdfHash": "db21586adfbe6df757b51a87eb0824cb414379cbe8f984c8fe1709e5b3643b46",
    "answer": 2,
    "sourceAnswerPage": 1,
    "sourceImageStatus": "verified",
    "sourceImageVerified": true,
    "sourceAnswerVerified": true,
    "sourceCheckedAt": "2026-10-04"
  }
];

const CH05_ADDED_OFFICIAL_CONTENT=[
  {examRound:72,questionNumber:12,sceneId:'ch05_border',question:'(가)에 대한 고려의 대응으로 옳은 것은?',
    passage:'이 자료는 초조대장경의 일부입니다. (가)의 침입으로 현종이 피란을 가고 개경이 함락되자 부처의 힘으로 나라를 지키려는 마음을 담아 조판하기 시작하였습니다.',
    choices:['윤관을 보내 동북 9성을 개척하였다.','화통도감을 두어 화포를 제작하였다.','광군을 조직하여 침입에 대비하였다.','박위를 파견하여 근거지를 토벌하였다.','철령위 설치에 반발해 요동 정벌을 추진하였다.'],
    explanation:'자료의 (가)는 거란입니다. 고려는 정종 때 거란의 침입에 대비하여 광군을 조직했습니다. 자료에 보이는 초조대장경은 이후 현종 때 조판을 시작했지만, 문항은 거란에 대한 대응을 묻습니다.',concepts:['거란','광군','정종','고려의 대외 관계']},
  {examRound:63,questionNumber:14,sceneId:'ch05_invasion',question:'(가) 국가에 대한 고려의 대응으로 옳은 것은?',
    passage:'○ (가)의 임금이 개경으로 침입하여 궁궐을 불사르고 퇴각하였다. …… 양규는 (가)의 군대를 무로대에서 습격하여 2,000여 급을 베고, 포로가 되었던 남녀 3,000여 명을 되찾았다. 다시 이수에서 전투를 벌이고 추격하여 석령까지 가서 2,500여 급을 베고, 포로가 되었던 1,000여 명을 되찾았다.\n○ (가)의 병사들이 귀주를 지나가자 강감찬 등이 동쪽 교외에서 전투를 벌였다. …… 적병이 북쪽으로 달아나자 아군이 그 뒤를 쫓아가서 공격하였는데, 석천을 건너 반령에 이르기까지 시신이 들에 가득하였다.',
    choices:['강화도로 도읍을 옮겨 항전하였다.','광군을 조직하여 침입에 대비하였다.','박위를 파견하여 근거지를 토벌하였다.','압록강 상류 지역을 개척하여 4군을 설치하였다.','신기군, 신보군, 항마군으로 구성된 별무반을 편성하였다.'],
    explanation:'개경 침입, 양규의 포로 구출, 강감찬의 귀주 전투는 거란과 관련됩니다. 그 나라에 대비해 정종 때 조직한 군대는 광군입니다. 양규와 강감찬의 구체적인 전투는 다음 침입 이야기에서 이어집니다.',concepts:['거란','광군','고려의 대외 관계']},
  {examRound:64,questionNumber:11,sceneId:'ch05_council',question:'(가), (나) 사이의 시기에 있었던 사실로 옳은 것은?',
    passage:'(가) 거란에서 사신을 파견하며 낙타 50필을 보냈다. 왕은 거란이 일찍이 발해와 지속적으로 화목하다가 갑자기 의심하여 맹약을 어기고 멸망시켰으니, 이는 매우 무도하여 친선 관계를 맺어 이웃으로 삼을 수 없다고 생각하였다. 드디어 교빙을 끊고 사신 30인을 섬으로 유배 보냈으며, 낙타는 만부교 아래에 매어두니 모두 굶어 죽었다.\n(나) 양규가 흥화진으로부터 군사 7백여 명을 이끌고 통주까지 와서 군사 1천여 명을 수습하였다. 밤중에 곽주로 들어가서 지키고 있던 적들을 급습하여 모조리 죽인 후 성 안에 있던 남녀 7천여 명을 통주로 옮겼다.',
    choices:['외침에 대비하여 광군이 조직되었다.','강감찬이 귀주에서 대승을 거두었다.','화통도감이 설치되어 화포를 제작하였다.','김윤후가 처인성에서 살리타를 사살하였다.','철령위 설치에 반발하여 요동 정벌이 추진되었다.'],
    explanation:'(가)는 태조 때의 만부교 사건(942년), (나)는 거란 2차 침입 때 양규의 활약(1010~1011년)입니다. 정종 때 광군을 조직한 947년은 그 사이입니다. 귀주 대첩은 1019년으로 (나) 이후입니다.',concepts:['광군','만부교 사건','거란','사건 순서']},
  {examRound:74,questionNumber:12,sceneId:'ch05_seohui',question:'(가), (나) 사이의 시기에 있었던 사실로 옳은 것은?',
    passage:'(가) 거란에서 사신을 파견하며 낙타 50필을 보냈다. 왕은 거란이 일찍이 발해와 지속적으로 화목하다가 갑자기 의심을 일으켜 맹약을 어기고 멸망시켰으니, 이는 매우 무도하여 친선 관계를 맺을 이웃으로 삼을 수 없다고 생각하였다. 드디어 교빙을 끊고 사신 30인을 섬으로 유배 보냈으며, 낙타는 만부교 아래에 매어두니 모두 굶어 죽었다.\n(나) 왕이 나주로 들어갔는데, 밤에 척후병이 잘못 보고하기를, “거란 군사들이 이르렀습니다.”라고 하였다. 왕이 크게 놀라서 밖으로 달려 나오자 지채문이 아뢰어 이르기를, “주상께서 밤중에 행차하시면 백성들이 놀라 혼란하게 되니, 바라옵건대 행궁으로 돌아가십시오. 제가 염탐하여 알아보고 나서, 그 후에 움직이셔도 됩니다.”라고 하였다.',
    choices:['묘청이 칭제 건원을 주장하였다.','강감찬이 흥화진 전투에서 승리하였다.','서희의 활약으로 강동 6주를 획득하였다.','최우가 강화도로 도읍을 옮겨 항전하였다.','윤관이 별무반을 이끌고 동북 9성을 개척하였다.'],
    explanation:'태조의 만부교 사건은 942년, 현종의 나주 피란은 거란 2차 침입이 있었던 1010~1011년입니다. 방금 경험한 서희의 담판과 강동 6주 확보(993년)는 그 사이에 해당합니다.',concepts:['서희','강동 6주','993년','사건 순서']}
];
for(const item of CH05_ADDED_OFFICIAL_CONTENT){
  const source=CH05_ADDED_PDF_SOURCES.find(q=>q.examRound===item.examRound),s=STORIES[item.sceneId],id='ch05-official-'+item.examRound+'-advanced-'+item.questionNumber;
  const q=officialExamQuestion({...source,...item,questionId:id,chapterId:'ch05',year:993,difficulty:'중상',questionType:'실제 기출',relatedSceneId:s.sceneId,relatedIllustrationId:s.illustrationId,relatedHistoricalEventId:s.historicalEventId,resumeStoryId:s.nextStoryId,examKeywords:item.concepts,conceptIds:item.concepts,rewardKnowledge:3,gameMemory:item.examRound===74?'서희가 고려의 고구려 계승과 여진 문제를 함께 주장해 강동 6주 확보로 연결한 장면을 떠올립니다.':'거란의 침입 소식과, 정종 때 거란에 대비해 광군을 조직했다는 설명을 떠올립니다.'});
  Object.assign(q,source,{sourceQuestionText:item.question,sourceChoices:[...item.choices]});delete q.sourceImageReason;
  if(item.examRound===63||item.examRound===64)q.sourceUrl='https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno='+({63:'1000029944',64:'1000029951'}[item.examRound]);
  QUESTIONS.push(q);SPLIT_STORY_QUESTION_IDS.ch05.push(id);SPLIT_REVIEW_IDS.ch05.push(id);lateQuestionIdsByChapter.ch05.push(id);
  for(const concept of item.concepts)(CONCEPT_QUESTION_INDEX[concept]||(CONCEPT_QUESTION_INDEX[concept]=[])).push(id);
}
// Learn the past policy before it is tested. Later-invasion excerpts identify
// the country; their later dates are supplied rather than silently pre-tested.
STORIES.ch05_border.dialogues.splice(3,0,nLine('고려는 이미 정종 때 거란의 침입에 대비해 광군을 조직했다. 그 경계가 이어진 끝에, 993년 소손녕의 군대가 국경을 넘었다.'));
STORIES.ch05_council.dialogues.push(nLine('태조의 만부교 사건은 942년이었다. 그 뒤 정종은 947년 광군을 조직했다. 지금의 993년 침입 다음에는 1010년 또 한 번의 거란 침입이 이어진다.'));
STORIES.ch05_seohui.dialogues.push(nLine('993년 서희의 담판은 거란군 철수와 강동 6주 확보로 이어진다. 태조의 만부교 사건(942년) 뒤, 현종의 나주 피란(1010~1011년) 전의 일이다.'));
STORIES.ch05_memory.dialogues.push(nLine('오늘은 서희의 담판이 있었던 993년. 거란과의 전쟁은 이후에도 이어져 1019년 강감찬의 귀주 대첩으로 연결된다.'));

// Keep every existing practice/set ID for saves, but distribute its questions
// across the actual story. A set's explicit order also survives replay history.
const CH05_QUESTION_PACING={
  ch05_border:['ch05-official-72-advanced-12'],
  ch05_invasion:['ch05-official-63-advanced-14','ch05-practice-invasion-01'],
  ch05_council:['ch05-official-64-advanced-11','ch05-practice-invasion-02','ch05-practice-invasion-03'],
  ch05_seohui:['ch05-official-73-basic-11','ch05-official-74-advanced-12','ch05-official-67-basic-13'],
  ch05_terms:['ch05-practice-seohui-01','ch05-practice-seohui-02'],
  ch05_withdraw:['ch05-practice-seohui-03'],
  ch05_six:['ch05-practice-six-01'],
  ch05_builders:['ch05-practice-six-02'],
  ch05_people:['ch05-practice-six-03'],
  ch05_memory:['ch05-official-77-basic-12']
};
for(const [sceneId,ids]of Object.entries(CH05_QUESTION_PACING)){
  const s=STORIES[sceneId],setId='ch05-paced-'+sceneId.replace('ch05_',''),poolId='pool-'+setId;
  const official=ids.filter(id=>QUESTIONS.find(q=>q.questionId===id).isOfficial),practice=ids.filter(id=>!official.includes(id));
  QUESTION_POOLS[poolId]={questionPoolId:poolId,chapterId:'ch05',conceptIds:[],questionIds:[...ids],sourceType:'mixed'};
  QUESTION_SETS[setId]={questionSetId:setId,chapterId:'ch05',afterSceneId:sceneId,resumeStoryId:s.nextStoryId,questionPoolId:poolId,requiredCount:ids.length,officialQuestionIds:official,practiceQuestionIds:practice,verifiedCount:official.length,practiceCount:practice.length,missingQuestionCount:0,status:'ready',preserveQuestionOrder:true};
  Object.assign(s,{questionSetId:setId,questionSetStatus:'ready',questionSetResumeStoryId:s.nextStoryId,linkedQuestionIds:[...ids],linkedPracticeQuestionIds:practice,questionSequenceMode:'queue'});
  if(s.choices?.length)s.afterChoiceQuestionSetId=setId;
  for(const id of ids){const q=QUESTIONS.find(q=>q.questionId===id);Object.assign(q,{relatedSceneId:sceneId,relatedIllustrationId:s.illustrationId,resumeStoryId:s.nextStoryId});}
}
lateQuestionSetsByChapter.ch05=Object.values(STORIES).filter(s=>s.chapterId==='ch05'&&s.questionSetId).map(s=>s.questionSetId);
Object.assign(CHAPTERS.ch05,{questionCount:16,reviewQuestionCount:16,questionSetCount:10});
Object.assign(LATE_GORYEO_REPORT.ch05,{scenes:13,questions:16,questionSets:10});
