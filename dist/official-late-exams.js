/* Verified official questions for CH.06–12.
 * Every round, number, choice, and answer below was checked against the attached question/answer PDFs.
 * Self-authored questions remain in the same three-question set, but are never presented as official. */
const lateOfficialQuestion=data=>question({
  era:'고려',isOfficial:true,sourceVerified:true,exactTranscription:true,sourceType:'official_exam',sourceStatus:'verified_from_attached_pdf',
  questionAuditStatus:'VERIFIED_OFFICIAL',formatLabel:'실제 기출',examType:`제${data.examRound}회 한국사능력검정시험 ${data.examLevel} 실제 기출`,
  source:`한국사능력검정시험 제${data.examRound}회 ${data.examLevel} · 사용자 제공 문제지·정답표 기반`,
  storyConnection:data.storyConnection||data.gameMemory,historicalEventIds:[data.relatedHistoricalEventId],chapterCandidate:data.chapterId,
  reviewOnly:false,retired:false,...data
});

const OFFICIAL_LATE_EXAM_QUESTIONS=[
  lateOfficialQuestion({
    questionId:'ch06-official-77-advanced-11',chapterId:'ch06',year:1011,examRound:77,examYear:2026,examLevel:'심화',questionNumber:11,sourcePage:3,
    sourceFile:'77회 한국사_문제지(심화).pdf',answerFile:'77회 한국사_답지(심화).pdf',relatedSceneId:'ch06_rebuild',relatedIllustrationId:'ch06-gaegyeong-rebuild',relatedHistoricalEventId:'ch06-culture',historicalEvent:'거란 침입과 초조대장경',
    questionType:'대외 관계·문화 연결형',difficulty:'중상',
    passage:'현화사비의 앞면에는 송의 연호인 천희가, 뒷면에는 (가)의 연호인 태평이 새겨져 있다. 고려는 귀주 대첩에서 (가)을/를 격퇴하였지만 조공·책봉 관계를 수용하여 실리와 안정을 추구하였다.',
    question:'(가) 국가에 대한 고려의 대응으로 옳은 것은?',
    choices:['별무반을 편성하였다.','화통도감을 설치하였다.','진관 체제를 실시하였다.','초조대장경을 조판하였다.','동녕부의 반환을 요청하였다.'],answer:3,
    explanation:'(가)는 거란입니다. 고려는 거란의 침입을 물리치려는 염원을 담아 현종 때 초조대장경 조판을 시작했습니다.',
    gameMemory:'불탄 개경에서 나무판에 글자를 새기던 장면을 보았습니다. 거란 침입과 연결되는 대장경은 초조대장경이므로 정답은 ④입니다.',
    examKeywords:['거란','귀주대첩','현종','초조대장경'],conceptIds:['khitan','hyeonjong','first-tripitaka'],rewardKnowledge:3,resumeStoryId:'ch06_woodblocks'
  }),
  lateOfficialQuestion({
    questionId:'ch07-official-75-basic-17',chapterId:'ch07',year:1107,examRound:75,examYear:2025,examLevel:'기본',questionNumber:17,sourcePage:4,
    sourceFile:'75회 한국사_문제지(기본).pdf',answerFile:'75회 한국사_답지(기본).pdf',relatedSceneId:'ch07_special',relatedIllustrationId:'late-war',relatedHistoricalEventId:'ch07-byeolmuban',historicalEvent:'윤관의 여진 정벌',
    questionType:'인물 활동 판단형',difficulty:'중',
    passage:'「척경입비도」는 (가)이/가 여진을 정벌하고 동북 9성을 개척한 뒤 ‘고려의 경계’라고 새긴 비석을 세우는 장면을 담고 있다.',
    question:'(가) 인물의 활동으로 옳은 것은?',
    choices:['대마도를 정벌하였다.','강동 6주를 확보하였다.','별무반 설치를 건의하였다.','일리천 전투에서 승리하였다.'],answer:2,
    explanation:'동북 9성을 개척한 (가)는 윤관입니다. 윤관은 여진 기병에 대응하기 위해 별무반 설치를 건의했습니다.',
    gameMemory:'윤관이 신기군·신보군·항마군으로 별무반을 나누어 설명한 장면을 보았으므로 정답은 ③입니다.',
    examKeywords:['윤관','여진','별무반','동북 9성'],conceptIds:['yoon-gwan','byeolmuban','nine-fortresses'],rewardKnowledge:3,resumeStoryId:'ch07_nine_fortresses'
  }),
  lateOfficialQuestion({
    questionId:'ch08-official-77-advanced-17',chapterId:'ch08',year:1145,examRound:77,examYear:2026,examLevel:'심화',questionNumber:17,sourcePage:4,
    sourceFile:'77회 한국사_문제지(심화).pdf',answerFile:'77회 한국사_답지(심화).pdf',relatedSceneId:'ch08_record',relatedIllustrationId:'late-study',relatedHistoricalEventId:'ch08-sagi',historicalEvent:'김부식과 삼국사기',
    questionType:'인물·저술 연결형',difficulty:'중상',
    passage:'(가)는 삼국의 역사를 기전체로 정리한 『삼국사기』 편찬을 총괄하였다. (나)는 불교 중심의 설화와 단군 건국 이야기 등을 담은 『삼국유사』를 저술하였다.',
    question:'(가), (나) 인물에 대한 설명으로 옳은 것은?',
    choices:['(가) - 관군을 이끌고 묘청의 난을 진압하였다.','(가) - 시무 28조를 올려 국가 운영 방안을 제시하였다.','(나) - 법화 신앙을 바탕으로 백련 결사를 이끌었다.','(나) - 화폐 발행을 위해 주전도감 설치를 건의하였다.','(가), (나) - 심성 도야를 강조하고 유불 일치설을 주장하였다.'],answer:0,
    explanation:'(가)는 김부식, (나)는 일연입니다. 김부식은 관군을 이끌고 묘청의 난을 진압한 뒤 『삼국사기』 편찬을 총괄했습니다.',
    gameMemory:'서경의 포위전 뒤 김부식이 관군을 지휘하고, 이후 삼국사기를 편찬하는 흐름을 경험했으므로 정답은 ①입니다.',
    examKeywords:['김부식','묘청의 난','삼국사기','일연','삼국유사'],conceptIds:['kim-busik','myocheong','samguk-sagi'],rewardKnowledge:3,resumeStoryId:'ch08_after'
  }),
  lateOfficialQuestion({
    questionId:'ch09-official-77-advanced-16',chapterId:'ch09',year:1196,examRound:77,examYear:2026,examLevel:'심화',questionNumber:16,sourcePage:4,
    sourceFile:'77회 한국사_문제지(심화).pdf',answerFile:'77회 한국사_답지(심화).pdf',relatedSceneId:'ch09_bongsa',relatedIllustrationId:'ch09-choe-regime',relatedHistoricalEventId:'ch09-choe',historicalEvent:'최충헌의 집권',
    questionType:'인물 활동 판단형',difficulty:'중상',
    passage:'이의민을 제거하고 집권한 (가)이/가 스스로 교정별감이 되어 전횡하자, 희종은 그를 암살하려 하였으나 도방의 방해로 실패하였다.',
    question:'(가) 인물에 대한 설명으로 옳은 것은?',
    choices:['비담과 염종의 반란을 진압하였다.','만권당에서 원의 학자들과 교유하였다.','인사 행정을 담당하던 정방을 폐지하였다.','봉사 10조를 올려 시정 개혁을 건의하였다.','오월에 사신을 보내고 검교태보의 직을 받았다.'],answer:3,
    explanation:'(가)는 최충헌입니다. 최충헌은 봉사 10조를 올려 시정 개혁을 건의하고 교정도감을 통해 권력을 행사했습니다.',
    gameMemory:'교정도감 뜰에서 최충헌과 군사·문서가 한곳에 모인 장면을 보았으므로 정답은 ④입니다.',
    examKeywords:['최충헌','교정도감','도방','봉사 10조'],conceptIds:['choe-chungheon','gyojeong-dogam','dobang'],rewardKnowledge:3,resumeStoryId:'ch09_documents'
  }),
  lateOfficialQuestion({
    questionId:'ch10-official-75-basic-16',chapterId:'ch10',year:1232,examRound:75,examYear:2025,examLevel:'기본',questionNumber:16,sourcePage:4,
    sourceFile:'75회 한국사_문제지(기본).pdf',answerFile:'75회 한국사_답지(기본).pdf',relatedSceneId:'ch10_people',relatedIllustrationId:'ch10-cheoin-fortress',relatedHistoricalEventId:'ch10-cheoin',historicalEvent:'몽골 침입과 처인성 전투',
    questionType:'시기 판단형',difficulty:'중',
    passage:'고려는 몽골의 침입에 맞서 싸우던 시기 불교의 힘으로 외적을 물리치고자 팔만대장경을 만들었다.',
    question:'밑줄 그은 ‘시기’에 있었던 사실로 옳은 것은?',
    choices:['송시열이 북벌을 주장하였다.','허준이 동의보감을 저술하였다.','김윤후가 처인성 전투에서 활약하였다.','망이·망소이가 공주 명학소에서 봉기하였다.'],answer:2,
    explanation:'몽골 침입기 김윤후와 처인성 주민들은 몽골군을 물리쳤습니다. 팔만대장경 조판도 같은 대몽 항쟁기에 이루어졌습니다.',
    gameMemory:'처인성에서 김윤후와 여러 신분의 주민이 성벽을 지키는 장면을 경험했으므로 정답은 ③입니다.',
    examKeywords:['몽골 침입','김윤후','처인성','팔만대장경'],conceptIds:['mongol-invasion','kim-yunhu','cheoin'],rewardKnowledge:3,resumeStoryId:'ch10_wall'
  }),
  lateOfficialQuestion({
    questionId:'ch10-official-70-advanced-15',chapterId:'ch10',year:1270,examRound:70,examYear:2024,examLevel:'심화',questionNumber:15,sourcePage:4,
    sourceFile:'70회 한국사_문제지(심화).pdf',answerFile:'70회 한국사_정답지(심화).pdf',relatedSceneId:'ch10_return',relatedIllustrationId:'late-water',relatedHistoricalEventId:'ch10-return',historicalEvent:'강화 천도에서 삼별초 항쟁까지',
    questionType:'시기 판단형',difficulty:'상',
    passage:'(가) 최우가 재물을 강화도로 옮기고 여러 도의 백성을 산성과 섬으로 옮겼다. (나) 김방경 등이 진도의 삼별초를 격파하자 김통정은 남은 무리를 이끌고 탐라로 들어갔다.',
    question:'(가), (나) 사이의 시기에 있었던 사실로 옳은 것은?',
    choices:['양규가 곽주성을 급습하여 탈환하였다.','최무선이 진포에서 왜구를 격퇴하였다.','강조가 정변을 일으켜 국왕을 폐위하였다.','김윤후가 처인성에서 살리타를 사살하였다.','이자겸과 척준경이 반란을 일으켜 궁궐을 불태웠다.'],answer:3,
    explanation:'강화도 천도는 1232년, 진도 삼별초 진압은 1271년입니다. 그 사이 김윤후가 처인성에서 몽골 장수 살리타를 사살했습니다.',
    gameMemory:'강화 천도 뒤 처인성 항전, 그리고 개경 환도와 삼별초의 이동을 차례로 지나왔으므로 정답은 ④입니다.',
    examKeywords:['강화도 천도','최우','김윤후','처인성','삼별초'],conceptIds:['ganghwa-transfer','cheoin','sambyeolcho'],rewardKnowledge:3,resumeStoryId:'ch10_sambyeolcho'
  }),
  lateOfficialQuestion({
    questionId:'ch11-official-70-advanced-16',chapterId:'ch11',year:1300,examRound:70,examYear:2024,examLevel:'심화',questionNumber:16,sourcePage:4,
    sourceFile:'70회 한국사_문제지(심화).pdf',answerFile:'70회 한국사_정답지(심화).pdf',relatedSceneId:'ch11_yuan',relatedIllustrationId:'late-court',relatedHistoricalEventId:'ch11-yuan',historicalEvent:'원 간섭기의 사회',
    questionType:'사회 모습 판단형',difficulty:'중상',
    passage:'응방·겁령구 및 내수 등의 세력이 많은 사전을 받았고, 공주가 입조할 때 양가의 어린 여성을 선발하려 순군과 홀적 등이 인가를 수색하였다.',
    question:'자료에 나타난 시기의 사회 모습으로 적절한 것은?',
    choices:['최충이 9재 학당을 설립하였다.','만적이 개경에서 반란을 모의하였다.','지배층을 중심으로 변발과 호복이 유행하였다.','국난 극복을 기원하며 초조대장경이 조판되었다.','기근에 대비하기 위하여 구황촬요가 간행되었다.'],answer:2,
    explanation:'자료는 원 간섭기의 사회를 보여 줍니다. 이 시기 지배층을 중심으로 변발과 호복 등 몽골풍이 유행했습니다.',
    gameMemory:'왕실 혼인과 관제 격하 뒤 거리의 옷차림까지 몽골풍으로 달라진 장면을 보았으므로 정답은 ③입니다.',
    examKeywords:['원 간섭기','응방','공녀','변발','호복'],conceptIds:['yuan-interference','mongol-customs','eungbang'],rewardKnowledge:3,resumeStoryId:'ch11_customs'
  }),
  lateOfficialQuestion({
    questionId:'ch12-official-75-basic-14',chapterId:'ch12',year:1388,examRound:75,examYear:2025,examLevel:'기본',questionNumber:14,sourcePage:4,
    sourceFile:'75회 한국사_문제지(기본).pdf',answerFile:'75회 한국사_답지(기본).pdf',relatedSceneId:'ch12_wihwa',relatedIllustrationId:'ch12-wihwado-rain',relatedHistoricalEventId:'ch12-wihwa',historicalEvent:'최영과 요동 정벌',
    questionType:'인물 식별형',difficulty:'중',
    passage:'이 인물은 공민왕 때 홍건적을 물리치는 데 큰 공을 세웠고, 우왕 때 홍산에서 왜구를 격파하였다. 또한 우왕과 함께 요동 정벌을 추진하였다.',
    question:'학생들이 공통으로 이야기하는 인물로 옳은 것은?',
    choices:['최영','이규보','정도전','최무선'],answer:0,
    explanation:'홍건적·왜구 격퇴에 활약하고 우왕과 요동 정벌을 추진한 인물은 최영입니다.',
    gameMemory:'위화도의 젖은 진영에서 “요동 정벌을 추진한 이는 최영과 우왕”이라는 단서를 확인했으므로 정답은 ①입니다.',
    examKeywords:['최영','홍건적','홍산 대첩','요동 정벌'],conceptIds:['choe-yeong','liaodong-expedition','wihwa-retreat'],rewardKnowledge:3,resumeStoryId:'ch12_supplies'
  })
];

QUESTIONS.push(...OFFICIAL_LATE_EXAM_QUESTIONS);

const LATE_OFFICIAL_SET_REPLACEMENTS={
  'ch06-culture':'ch06-official-77-advanced-11',
  'ch07-byeolmuban':'ch07-official-75-basic-17',
  'ch08-sagi':'ch08-official-77-advanced-17',
  'ch09-choe':'ch09-official-77-advanced-16',
  'ch10-cheoin':'ch10-official-75-basic-16',
  'ch10-return':'ch10-official-70-advanced-15',
  'ch11-yuan':'ch11-official-70-advanced-16',
  'ch12-wihwa':'ch12-official-75-basic-14'
};

for(const [setId,officialId] of Object.entries(LATE_OFFICIAL_SET_REPLACEMENTS)){
  const set=QUESTION_SETS[setId],scene=STORIES[set?.afterSceneId],pool=set&&QUESTION_POOLS[set.questionPoolId];
  if(!set||!scene||!pool)throw new Error(`Missing official replacement target: ${setId}`);
  const displacedId=set.practiceQuestionIds.shift(),displaced=QUESTIONS.find(item=>item.questionId===displacedId);
  if(displaced)Object.assign(displaced,{retired:true,reviewOnly:true,sourceStatus:'replaced_by_verified_official',questionAuditStatus:'SELF_AUTHORED_RETIRED'});
  set.officialQuestionIds=[officialId];
  Object.assign(set,{verifiedCount:1,practiceCount:set.practiceQuestionIds.length,sourceType:'mixed_official_and_practice'});
  pool.questionIds=[officialId,...set.practiceQuestionIds];pool.sourceType='mixed_official_and_practice';
  Object.assign(scene,{linkedQuestionIds:[officialId,...set.practiceQuestionIds],linkedOfficialQuestions:[officialId],linkedPracticeQuestionIds:[...set.practiceQuestionIds],
    officialQuestionSlot:{conceptIds:[...set.conceptIds],linkedOfficialQuestions:[officialId],requiredCount:1,verifiedCount:1,missingQuestionCount:0,officialQuestionStatus:'ready'},
    practiceQuestionSlot:{conceptIds:[...set.conceptIds],linkedPracticeQuestions:[...set.practiceQuestionIds],requiredCount:set.practiceQuestionIds.length,practiceCount:set.practiceQuestionIds.length,status:'ready'}});
  for(const list of [SPLIT_STORY_QUESTION_IDS[set.chapterId],SPLIT_REVIEW_IDS[set.chapterId]]){
    const index=list.indexOf(displacedId);if(index>=0)list.splice(index,1,officialId);
  }
}

for(const chapterId of Object.keys(CHAPTERS)){
  const active=QUESTIONS.filter(item=>item.chapterId===chapterId&&!item.reviewOnly&&!item.retired);
  if(active.length)Object.assign(CHAPTERS[chapterId],{questionCount:active.length,reviewQuestionCount:(SPLIT_REVIEW_IDS[chapterId]||[]).length});
}
for(const key of Object.keys(CONCEPT_QUESTION_INDEX))delete CONCEPT_QUESTION_INDEX[key];
for(const item of QUESTIONS.filter(question=>!question.retired))for(const conceptId of item.conceptIds||[])(CONCEPT_QUESTION_INDEX[conceptId]||(CONCEPT_QUESTION_INDEX[conceptId]=[])).push(item.questionId);
