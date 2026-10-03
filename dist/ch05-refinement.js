/* CH.05 only. Preserve every legacy story, practice ID, save and other chapter. */
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
for(const expression of ['neutral','smile','serious','worried','surprised','angry','thinking'])PORTRAITS['ch05_yeon_'+expression]=portrait('yeon',expression,'연 · CH.05 여행자',['#303b43','#8e7255'],'assets/characters/ch05-yeon-traveler.webp');
for(const [sceneId,[illustrationId]] of Object.entries(CH05_BACKGROUND_MAP)){
  const s=STORIES[sceneId];s.illustrationId=illustrationId;s.backgroundImage=ASSETS[illustrationId].src;s.characterSlots='player-partner';
  for(const c of s.choices||[])c.resultIllustrationId=illustrationId;
  for(const q of QUESTIONS.filter(q=>q.chapterId==='ch05'&&q.relatedSceneId===sceneId))q.relatedIllustrationId=illustrationId;
}
CHAPTERS.ch05.thumbnail=ASSETS[STORIES.ch05_border.illustrationId].src;

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
Object.assign(LATE_GORYEO_REPORT.ch05,{questions:12,questionSets:6});
