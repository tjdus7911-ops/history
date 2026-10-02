/* 사용자 제공 한국사능력검정시험 문제지 연계 문항 — 기존 스토리/선택 데이터는 보존한다. */
const officialExamQuestion=data=>question({
  isOfficial:true,
  sourceVerified:true,
  sourceStatus:'verified_from_attached_pdf',
  supplementalExam:true,
  examType:`제${data.examRound}회 한국사능력검정시험 ${data.examLevel} 실제 기출`,
  source:`국사편찬위원회 한국사능력검정시험 제${data.examRound}회 ${data.examLevel} · 사용자 제공 문제지·정답표 기반 모바일 전사`,
  ...data
});
const practiceExamQuestion=data=>question({
  isOfficial:false,
  supplementalExam:true,
  examType:'실전 유형 연습 · 자체 제작',
  source:'첨부 한국사능력검정시험의 자료·선지 구성 유형과 해당 챕터 학습 내용을 바탕으로 자체 제작',
  ...data
});
const supplementalExamScene=({sceneId,chapterId,title,illustrationId,quizId,dialogue,historicalEventId,year})=>scene({
  sceneId,chapterId,title,illustrationId,quizId,historicalEventId,year,
  location:'역사 기억',timeOfDay:'memory',supplementalExam:true,
  dialogues:[dialogueLine('narrator','neutral',dialogue,'narration')]
});

const SUPPLEMENTAL_EXAM_QUESTIONS=[
  officialExamQuestion({
    questionId:'ch01-official-69-basic-10',chapterId:'ch01',relatedSceneId:'ch01_exam_69_basic_10',relatedHistoricalEventId:'gungye-taebong',historicalEvent:'궁예의 태봉 통치',relatedIllustrationId:'memory-wanggeon',questionType:'인물·국가 판단형',difficulty:'중',reviewOnly:true,
    passage:'(가)은/는 수도를 송악에서 철원으로 옮기고 광평성 등 여러 관서를 새로 설치하였다.',
    question:'(가) 인물에 대한 설명으로 옳은 것은?',
    choices:['우산국을 복속하였다.','백제 계승을 내세웠다.','국호를 태봉으로 바꾸었다.','중앙군으로 9서당을 설치하였다.'],answer:2,
    explanation:'철원을 수도로 삼고 광평성을 둔 인물은 궁예입니다. 궁예는 국호를 후고구려에서 마진, 다시 태봉으로 바꾸었습니다.',
    storyConnection:'건국 직전 장면에서 들은 ‘궁예가 철원에서 태봉을 다스렸다’는 소식이 정답 ③의 단서입니다.',
    examKeywords:['궁예','철원','광평성','태봉'],rewardKnowledge:2,resumeStoryId:'ch01_clear_930',
    examRound:69,examYear:2024,examLevel:'기본',questionNumber:10,sourcePage:3,sourceFile:'69회 한국사 문제지(기본).pdf',answerFile:'69회 한국사 정답표(기본).pdf'
  }),
  officialExamQuestion({
    questionId:'ch01-official-79-advanced-09',chapterId:'ch01',relatedSceneId:'ch01_exam_79_09',relatedHistoricalEventId:'gungye-taebong',historicalEvent:'궁예와 태봉',relatedIllustrationId:'memory-wanggeon',questionType:'인물 업적형',difficulty:'중상',reviewOnly:true,
    passage:'양길의 부하였던 (가)은/는 북원 동쪽의 여러 군현을 공략하였다. 신라가 쇠퇴하자 철원에 도읍하고 국호를 태봉이라 하였다.',
    question:'(가) 인물에 대한 설명으로 옳은 것은?',
    choices:['공산 전투에서 전사하였다.','경주의 사심관으로 임명되었다.','후당과 오월에 사신을 파견하였다.','일리천에서 신검의 군대를 물리쳤다.','광평성 등의 정치 기구를 설치하였다.'],answer:4,
    explanation:'자료의 인물은 궁예입니다. 궁예는 철원을 도읍으로 태봉을 세우고 광평성 등 정치 기구를 설치했습니다.',
    storyConnection:'왕건이 궁예 휘하에서 성장했다는 장면과 ‘철원·태봉’ 단서를 함께 떠올리면 정답은 ⑤입니다.',
    examKeywords:['궁예','양길','철원','태봉','광평성'],rewardKnowledge:3,resumeStoryId:'ch01_clear_930',
    examRound:79,examYear:2026,examLevel:'심화',questionNumber:9,sourcePage:2,sourceFile:'79회 한국사_문제지(심화).pdf',answerFile:'79회 한국사_답지(심화).pdf'
  }),
  officialExamQuestion({
    questionId:'ch01-official-70-advanced-10',chapterId:'ch01',relatedSceneId:'ch01_exam_70_10',relatedHistoricalEventId:'later-three-kingdoms',historicalEvent:'후삼국 통일 과정',relatedIllustrationId:'future-flow',questionType:'사건 순서형',difficulty:'상',
    passage:'[후삼국 통일 영화 장면]\n#1 신숭겸이 공산 전투에서 전사하다.\n#2 왕건이 고창 전투에서 승리하다.\n#3 견훤이 금산사를 탈출하여 고려에 귀부하다.\n#4 (가)\n#5 왕건이 일리천 전투에서 승리하다.',
    question:'(가)에 들어갈 내용으로 가장 적절한 것은?',
    choices:['장보고, 청해진을 설치하다.','원종과 애노, 사벌주에서 봉기하다.','경순왕 김부, 경주의 사심관이 되다.','궁예, 국호를 마진으로 바꾸다.','견훤, 완산주에 도읍을 정하다.'],answer:2,
    explanation:'신라 경순왕 김부는 935년 고려에 항복했고, 뒤에 경주의 사심관이 되었습니다. 이 사건은 936년 일리천 전투와 후삼국 통일보다 앞섭니다.',
    storyConnection:'공산 패배 → 고창 승리 → 견훤·신라의 귀순 → 일리천 승리로 이어진 장면 순서가 정답 ③을 가리킵니다.',
    examKeywords:['공산 전투','고창 전투','경순왕 항복','일리천 전투'],rewardKnowledge:3,resumeStoryId:'foundation',
    examRound:70,examYear:2024,examLevel:'심화',questionNumber:10,sourcePage:3,sourceFile:'70회 한국사_문제지(심화).pdf',answerFile:'70회 한국사_정답지(심화).pdf'
  }),
  officialExamQuestion({
    questionId:'ch01-official-73-basic-10',chapterId:'ch01',relatedSceneId:'ch01_exam_73_10',relatedHistoricalEventId:'later-three-kingdoms',historicalEvent:'견훤과 후백제',relatedIllustrationId:'market-later-three-kingdoms',questionType:'인물 업적형',difficulty:'중',
    passage:'아들 신검에 의해 금산사에 갇힌 (가)은/는 금산사를 탈출하여 고려의 왕건에게 귀순하였다.',
    question:'(가) 인물에 대한 설명으로 옳은 것은?',
    choices:['신라를 침략하여 대야성을 함락하였다.','청해진을 중심으로 해상 무역을 전개하였다.','완산주에서 후백제를 세웠다.','서경 천도를 주장하며 난을 일으켰다.'],answer:2,
    explanation:'견훤은 완산주를 도읍으로 후백제를 세웠습니다. 뒤에 아들 신검에게 금산사에 갇혔다가 탈출해 왕건에게 귀순했습니다.',
    storyConnection:'상인이 전한 ‘금산사를 탈출한 후백제의 건국자’라는 장면 속 단서가 정답 ③과 연결됩니다.',
    examKeywords:['견훤','완산주','후백제','금산사'],rewardKnowledge:2,resumeStoryId:'status',
    examRound:73,examYear:2025,examLevel:'기본',questionNumber:10,sourcePage:3,sourceFile:'73회 한국사_문제지(기본).pdf',answerFile:'73회 한국사_답지(기본).pdf'
  }),
  officialExamQuestion({
    questionId:'ch01-official-74-advanced-10',chapterId:'ch01',relatedSceneId:'ch01_exam_74_10',relatedHistoricalEventId:'later-three-kingdoms',historicalEvent:'신라의 항복과 후삼국 통일',relatedIllustrationId:'future-flow',questionType:'시기 판단형',difficulty:'중상',
    passage:'왕건: 신라왕 김부가 나라를 들어 우리에게 귀부하였소.\n신숭겸: 경주에 있는 신라의 백성들도 이제 우리 고려의 백성이 되었군요.',
    question:'이 대화 이후에 있었던 사실로 옳은 것은?',
    choices:['궁예가 왕건을 시켜 나주를 점령하였다.','견훤이 완산주에 도읍을 정하였다.','신숭겸이 공산 전투에서 전사하였다.','왕건이 일리천에서 신검의 군대를 물리쳤다.','신라군이 매소성에서 당군을 격파하였다.'],answer:3,
    explanation:'신라 경순왕이 고려에 항복한 것은 935년이고, 왕건이 일리천에서 신검의 군대를 물리쳐 후삼국을 통일한 것은 936년입니다.',
    storyConnection:'신라 상인이 떠난 뒤에도 전쟁이 끝나지 않았고, 다음 해 일리천 소식이 왔던 장면 때문에 정답은 ④입니다.',
    examKeywords:['935년 신라 항복','936년 일리천','신검','후삼국 통일'],rewardKnowledge:3,resumeStoryId:'thief',
    examRound:74,examYear:2025,examLevel:'심화',questionNumber:10,sourcePage:3,sourceFile:'74회 한국사_문제지(심화).pdf',answerFile:'74회 심화 정답표.pdf'
  }),
  officialExamQuestion({
    questionId:'ch01-official-76-advanced-10',chapterId:'ch01',relatedSceneId:'ch01_exam_76_10',relatedHistoricalEventId:'later-three-kingdoms',historicalEvent:'후삼국 통일 직전',relatedIllustrationId:'future-flow',questionType:'시기 판단형',difficulty:'중상',
    passage:'견훤이 금산사에서 탈출하여 고려에 도착하였다. 왕건은 견훤이 도착했다는 말을 듣고 버선발로 뛰어나가 맞이하였다.',
    question:'자료에 나타난 사건 이후에 있었던 사실로 옳은 것은?',
    choices:['신라가 당과 연합군을 결성하였다.','신검의 군대가 일리천 전투에서 패배하였다.','장보고가 청해진을 설치하였다.','궁예가 국호를 태봉으로 바꾸었다.','견훤이 완산주에 후백제를 세웠다.'],answer:1,
    explanation:'견훤이 고려에 귀순한 뒤 왕건은 일리천 전투에서 신검의 후백제군을 물리치고 936년 후삼국 통일을 이루었습니다.',
    storyConnection:'견훤이 고려에 온 장면 다음에 신검의 군대가 일리천에서 패했다는 소식을 경험했으므로 정답은 ②입니다.',
    examKeywords:['견훤 귀순','신검','일리천 전투','936년'],rewardKnowledge:3,resumeStoryId:'complete',
    examRound:76,examYear:2025,examLevel:'심화',questionNumber:10,sourcePage:3,sourceFile:'76회 한국사_문제지(심화).pdf',answerFile:'76회 한국사_답지(심화)).pdf'
  }),

  officialExamQuestion({
    questionId:'ch02-official-69-advanced-10',chapterId:'ch03',relatedSceneId:'ch02_exam_69_10',relatedHistoricalEventId:'goryeo-early-kings',historicalEvent:'태조 왕건의 정책',relatedIllustrationId:'ch02-reign-titles',questionType:'왕의 업적 판단형',difficulty:'중상',
    passage:'논산 개태사지 석조여래삼존입상은 후삼국을 통일한 뒤 개태사를 세운 (가)의 모습을 본떠 만들었다고 전해진다.',
    question:'(가) 왕에 대한 설명으로 옳은 것은?',
    choices:['관학 진흥을 위해 양현고를 설치하였다.','쌍기의 건의를 받아들여 과거제를 시행하였다.','전국의 12목에 지방관을 파견하였다.','전시과 제도를 마련하여 관리에게 토지를 지급하였다.','후대 왕들이 지켜야 할 정책 방향을 담은 훈요 10조를 남겼다.'],answer:4,
    explanation:'개태사를 세운 왕은 고려 태조 왕건입니다. 태조는 후대 왕에게 훈요 10조를 남겼습니다.',
    examKeywords:['개태사','태조 왕건','훈요 10조'],rewardKnowledge:3,resumeStoryId:'ch02_noble_night',
    examRound:69,examYear:2024,examLevel:'심화',questionNumber:10,sourcePage:3,sourceFile:'69회 한국사_문제지(심화).pdf',answerFile:'69회 한국사_정답표(심화).pdf'
  }),
  officialExamQuestion({
    questionId:'ch02-official-74-advanced-11',chapterId:'ch03',relatedSceneId:'ch02_exam_74_11',relatedHistoricalEventId:'gwangjong-authority',historicalEvent:'광종의 왕권 강화',relatedIllustrationId:'ch02-freed-citizen',questionType:'왕의 정책 판단형',difficulty:'중상',
    passage:'이 왕은 호족 세력을 숙청하고 왕권을 강화하였다. 억울하게 노비가 된 사람을 양인으로 풀어 주는 법을 시행하고, 후주와 사신을 왕래하였다.',
    question:'이 왕이 추진한 정책으로 옳은 것은?',
    choices:['정치도감을 설치하였다.','광덕, 준풍이라는 독자적 연호를 사용하였다.','개국 공신에게 역분전을 지급하였다.','12목에 지방관을 파견하였다.','전·현직 관리에게 전지와 시지를 지급하였다.'],answer:1,
    explanation:'노비안검법으로 호족의 기반을 약화한 왕은 광종입니다. 광종은 광덕과 준풍이라는 독자적 연호도 사용했습니다.',
    examKeywords:['광종','노비안검법','광덕','준풍'],rewardKnowledge:3,resumeStoryId:'ch02_exam_eve',
    examRound:74,examYear:2025,examLevel:'심화',questionNumber:11,sourcePage:3,sourceFile:'74회 한국사_문제지(심화).pdf',answerFile:'74회 심화 정답표.pdf'
  }),
  officialExamQuestion({
    questionId:'ch02-official-76-advanced-50',chapterId:'ch03',relatedSceneId:'ch02_exam_76_50',relatedHistoricalEventId:'gwangjong-reign-titles',historicalEvent:'한국사의 연호',relatedIllustrationId:'ch02-reign-titles',questionType:'연호·정책 연결형',difficulty:'상',
    passage:'한국사 속 연호: 영락 · 건원 · 인안 · 광덕 · 건양. 이 가운데 광덕은 고려 광종이 사용한 독자적 연호이다.',
    question:'각 연호가 사용된 시기에 있었던 사실에 대한 설명으로 옳지 않은 것은?',
    choices:['영락 연간에 신라에 침입한 왜를 격퇴하였다.','건원 연간에 금관가야를 병합하였다.','인안 연간에 장문휴가 산둥 지방을 공격하였다.','광덕 연간에 노비안검법을 실시하여 호족 세력을 견제하였다.','건양 연간에 대한국 국제를 반포하였다.'],answer:4,
    explanation:'대한국 국제는 광무 연호를 사용하던 1899년에 반포되었습니다. 광덕은 광종의 연호이며 이 시기 노비안검법으로 호족을 견제했습니다.',
    examKeywords:['광덕','광종','노비안검법','연호'],rewardKnowledge:3,resumeStoryId:'ch02_reign_followup',
    examRound:76,examYear:2025,examLevel:'심화',questionNumber:50,sourcePage:12,sourceFile:'76회 한국사_문제지(심화).pdf',answerFile:'76회 한국사_답지(심화)).pdf'
  }),
  officialExamQuestion({
    questionId:'ch02-official-77-advanced-14',chapterId:'ch03',relatedSceneId:'ch02_exam_77_14',relatedHistoricalEventId:'gwangjong-reign-titles',historicalEvent:'고려의 황제국 표방',relatedIllustrationId:'ch02-reign-titles',questionType:'탐구 주제 판단형',difficulty:'상',
    passage:'황제가 쓰는 통천관을 착용한 태조 왕건상과, 광종의 독자적 연호 준풍이 새겨진 청주 용두사지 철당간을 함께 살펴보았다.',
    question:'이 문화유산을 활용한 탐구 주제로 가장 적절한 것은?',
    choices:['신해통공을 단행한 배경','명 멸망 이후 소중화 의식의 대두','골품제가 일상생활에 끼친 영향','울산항을 통한 아라비아 상인과의 교역','황제국 표방 사례를 통해 본 외왕내제 의식'],answer:4,
    explanation:'왕건의 통천관과 광종의 준풍 연호는 고려가 황제국을 표방한 사례로, 외왕내제 의식과 연결됩니다.',
    examKeywords:['통천관','준풍','황제국 표방','외왕내제'],rewardKnowledge:3,resumeStoryId:'ch02_purge',
    examRound:77,examYear:2026,examLevel:'심화',questionNumber:14,sourcePage:4,sourceFile:'77회 한국사_문제지(심화).pdf',answerFile:'77회 한국사_답지(심화).pdf'
  }),
  officialExamQuestion({
    questionId:'ch02-official-78-advanced-11',chapterId:'ch03',relatedSceneId:'ch02_exam_78_11',relatedHistoricalEventId:'gwangjong-958-gwageo',historicalEvent:'광종의 과거제 도입',relatedIllustrationId:'ch02-exam-notice',questionType:'왕의 업적 판단형',difficulty:'중상',
    passage:'고려 태조는 학교를 세웠으나 과거는 시행하지 못하였다. (가)은/는 쌍기의 건의를 받아 과거로 선비를 뽑으니 문풍이 비로소 일어났다.',
    question:'(가) 왕에 대한 설명으로 옳은 것은?',
    choices:['광군사를 설치하여 거란의 침입에 대비하였다.','12목을 설치하고 지방관을 파견하였다.','국학에 양현고를 두어 장학 기금을 마련하였다.','노비안검법을 실시하여 호족 세력을 견제하였다.','정계와 계백료서를 지어 관리의 규범을 제시하였다.'],answer:3,
    explanation:'쌍기의 건의를 받아 과거제를 시행한 왕은 광종입니다. 광종은 노비안검법을 실시하여 호족 세력도 견제했습니다.',
    examKeywords:['쌍기','과거제','광종','노비안검법'],rewardKnowledge:3,resumeStoryId:'ch02_complete',
    examRound:78,examYear:2026,examLevel:'심화',questionNumber:11,sourcePage:3,sourceFile:'78회 한국사_문제지(심화).pdf',answerFile:'78회 한국사_답지(심화).pdf'
  }),

  officialExamQuestion({
    questionId:'ch03-official-75-basic-12',chapterId:'ch04',relatedSceneId:'ch03_exam_75_12',relatedHistoricalEventId:'goryeo-early-kings',historicalEvent:'태조의 통치 정책',relatedIllustrationId:'ch03-gaegyeong-982',questionType:'왕의 업적 판단형',difficulty:'중',
    passage:'개태사는 (가)이/가 후삼국을 통일하고 창건한 유서 깊은 사찰로, 나라를 연 태조 왕건과 밀접한 관련이 있다.',
    question:'(가) 왕에 대한 설명으로 옳은 것은?',
    choices:['과거제를 도입하였다.','농사직설을 편찬하였다.','사심관 제도를 시행하였다.','북한산에 순수비를 건립하였다.'],answer:2,
    explanation:'후삼국을 통일하고 개태사를 창건한 왕은 태조 왕건입니다. 태조는 지방 호족을 통제하기 위해 사심관 제도를 시행했습니다.',
    examKeywords:['태조 왕건','개태사','사심관 제도'],rewardKnowledge:2,resumeStoryId:'ch03_policy_effect',
    examRound:75,examYear:2025,examLevel:'기본',questionNumber:12,sourcePage:3,sourceFile:'75회 한국사_문제지(기본).pdf',answerFile:'75회 한국사_답지(기본).pdf'
  }),
  practiceExamQuestion({
    questionId:'ch03-practice-05',chapterId:'ch04',relatedSceneId:'ch03_exam_practice_05',relatedHistoricalEventId:'seongjong-twelve-mok',historicalEvent:'12목 지방관 파견',relatedIllustrationId:'ch03-returning-merchant',questionType:'상황·정책 연결형',difficulty:'중',
    passage:'상단 사람들은 지방 세력가가 길을 막아도 중앙의 명령을 집행할 관리가 없다고 호소하였다.',question:'성종 때 이 문제를 해결하는 방향과 가장 가까운 정책은?',
    choices:['12목에 지방관을 파견한다.','노비안검법을 실시한다.','별무반을 조직한다.','정동행성 이문소를 폐지한다.'],answer:0,
    explanation:'성종은 12목에 지방관을 파견하여 중앙 정부가 지방을 직접 통치하는 기반을 마련했습니다.',examKeywords:['성종','12목','지방관','중앙 집권'],rewardKnowledge:2,resumeStoryId:'ch03_three_friends'
  }),
  practiceExamQuestion({
    questionId:'ch03-practice-06',chapterId:'ch04',relatedSceneId:'ch03_exam_practice_06',relatedHistoricalEventId:'choe-seungro-simu-28',historicalEvent:'최승로의 시무 28조',relatedIllustrationId:'ch03-doyun-guild-interior',questionType:'인물·건의 연결형',difficulty:'중',
    passage:'유교를 바탕으로 나라의 제도를 정비하고 지방관을 파견할 것을 왕에게 건의하였다.',question:'이 건의를 시무 28조에 담아 성종에게 올린 인물은?',
    choices:['쌍기','최승로','서희','강감찬','김부식'],answer:1,
    explanation:'최승로는 성종에게 시무 28조를 올려 유교 정치 질서와 지방 제도의 정비 방향을 제시했습니다.',examKeywords:['최승로','시무 28조','성종'],rewardKnowledge:2,resumeStoryId:'ch03_exam_practice_07'
  }),
  practiceExamQuestion({
    questionId:'ch03-practice-07',chapterId:'ch04',relatedSceneId:'ch03_exam_practice_07',relatedHistoricalEventId:'seongjong-gukjagam',historicalEvent:'국자감 설치',relatedIllustrationId:'ch03-gukjagam',questionType:'교육 기관 판단형',difficulty:'중',
    passage:'개경에서 관리 후보와 학생들이 유교 경전을 배우는 국가 교육 기관이 운영되었다.',question:'성종 때 설치된 이 교육 기관은?',
    choices:['경당','국자감','성균관','주자감','향교'],answer:1,
    explanation:'국자감은 성종 때 설치된 고려의 최고 교육 기관입니다.',examKeywords:['국자감','성종','고려 교육'],rewardKnowledge:2,resumeStoryId:'ch03_history_reflection'
  }),
  practiceExamQuestion({
    questionId:'ch03-practice-08',chapterId:'ch04',relatedSceneId:'ch03_exam_practice_08',relatedHistoricalEventId:'seongjong-state-system',historicalEvent:'성종의 제도 정비',relatedIllustrationId:'ch03-gaegyeong-982',questionType:'통치 체제 판단형',difficulty:'중상',
    passage:'왕은 최승로의 건의를 받아들이고 중앙과 지방의 제도를 정비하며 유교적 통치 질서를 세웠다.',question:'이 왕의 통치 방향으로 가장 적절한 것은?',
    choices:['호족과 혼인 관계를 넓혀 연합 정치를 강화하였다.','불교 교단을 통합하고 천태종을 개창하였다.','유교 이념을 바탕으로 중앙 집권 체제를 정비하였다.','무신을 우대하여 문신 중심의 관료제를 폐지하였다.'],answer:2,
    explanation:'성종은 유교 정치 이념을 바탕으로 중앙 관제와 지방 제도를 정비했습니다.',examKeywords:['성종','유교 정치','중앙 집권'],rewardKnowledge:2,resumeStoryId:'ch03_courtyard'
  }),
  practiceExamQuestion({
    questionId:'ch03-practice-09',chapterId:'ch04',relatedSceneId:'ch03_exam_practice_09',relatedHistoricalEventId:'goryeo-early-kings',historicalEvent:'태조·광종·성종 정책 비교',relatedIllustrationId:'ch03-gaegyeong-982',questionType:'왕별 정책 비교형',difficulty:'상',
    passage:'고려 초기 세 왕은 나라의 기반 마련, 왕권 강화, 통치 체제 정비를 차례로 추진하였다.',question:'왕과 정책의 연결로 옳지 않은 것은?',
    choices:['태조 — 사심관 제도','광종 — 노비안검법','광종 — 과거제','성종 — 12목 지방관 파견','성종 — 훈요 10조'],answer:4,
    explanation:'훈요 10조를 남긴 왕은 태조입니다. 성종은 최승로의 시무 28조를 받아들이고 12목에 지방관을 파견했습니다.',examKeywords:['태조','광종','성종','정책 비교'],rewardKnowledge:3,resumeStoryId:'ch03_courtyard'
  })
];

const SUPPLEMENTAL_EXAM_SCENES=[
  supplementalExamScene({sceneId:'ch01_exam_69_basic_10',chapterId:'ch01',title:'철원에 세운 태봉',illustrationId:'memory-wanggeon',quizId:'ch01-official-69-basic-10',dialogue:'왕건이 몸담았던 궁예의 나라는 철원을 도읍으로 삼고 광평성을 두었으며, 국호를 태봉이라 바꾸었다.',historicalEventId:'gungye-taebong',year:918}),
  supplementalExamScene({sceneId:'ch01_exam_79_09',chapterId:'ch01',title:'궁예를 가리키는 단서',illustrationId:'memory-wanggeon',quizId:'ch01-official-79-advanced-09',dialogue:'양길의 부하, 철원, 태봉, 광평성이라는 단서가 한 인물에게 모였다.',historicalEventId:'gungye-taebong',year:918}),
  supplementalExamScene({sceneId:'ch01_exam_70_10',chapterId:'ch01',title:'후삼국의 마지막 순서',illustrationId:'future-flow',quizId:'ch01-official-70-advanced-10',dialogue:'공산과 고창, 신라의 항복과 일리천. 후삼국의 마지막 장면들이 순서대로 이어졌다.',historicalEventId:'later-three-kingdoms',year:936}),
  supplementalExamScene({sceneId:'ch01_exam_73_10',chapterId:'ch01',title:'견훤의 선택',illustrationId:'market-later-three-kingdoms',quizId:'ch01-official-73-basic-10',dialogue:'후백제를 세운 견훤의 시작과, 금산사를 벗어나 왕건에게 향한 마지막 선택을 떠올렸다.',historicalEventId:'later-three-kingdoms',year:936}),
  supplementalExamScene({sceneId:'ch01_exam_74_10',chapterId:'ch01',title:'신라가 고려에 들어온 뒤',illustrationId:'future-flow',quizId:'ch01-official-74-advanced-10',dialogue:'935년 신라의 항복 뒤에도 후백제와의 마지막 전투가 남아 있었다.',historicalEventId:'later-three-kingdoms',year:936}),
  supplementalExamScene({sceneId:'ch01_exam_76_10',chapterId:'ch01',title:'일리천으로 향한 흐름',illustrationId:'future-flow',quizId:'ch01-official-76-advanced-10',dialogue:'견훤의 귀순 뒤 신검의 후백제군과 맞선 일리천 전투가 이어졌다.',historicalEventId:'later-three-kingdoms',year:936}),
  supplementalExamScene({sceneId:'ch02_exam_69_10',chapterId:'ch03',title:'나라를 연 왕의 유산',illustrationId:'ch02-reign-titles',quizId:'ch02-official-69-advanced-10',dialogue:'광종의 개혁을 이해하려면 그보다 앞서 나라의 기틀을 세운 태조의 정책도 구분해야 했다.',historicalEventId:'goryeo-early-kings',year:949}),
  supplementalExamScene({sceneId:'ch02_exam_74_11',chapterId:'ch03',title:'광종을 가리키는 단서',illustrationId:'ch02-freed-citizen',quizId:'ch02-official-74-advanced-11',dialogue:'노비안검법과 독자적 연호가 한 왕의 개혁으로 모였다.',historicalEventId:'gwangjong-authority',year:956}),
  supplementalExamScene({sceneId:'ch02_exam_76_50',chapterId:'ch03',title:'연호 속 광종',illustrationId:'ch02-reign-titles',quizId:'ch02-official-76-advanced-50',dialogue:'광덕이라는 두 글자가 광종의 왕권 강화 정책과 이어졌다.',historicalEventId:'gwangjong-reign-titles',year:958}),
  supplementalExamScene({sceneId:'ch02_exam_77_14',chapterId:'ch03',title:'황제국을 표방한 흔적',illustrationId:'ch02-reign-titles',quizId:'ch02-official-77-advanced-14',dialogue:'왕건의 관과 준풍 연호에 담긴 고려의 자주적 의식을 살펴보았다.',historicalEventId:'gwangjong-reign-titles',year:958}),
  supplementalExamScene({sceneId:'ch02_exam_78_11',chapterId:'ch03',title:'시험으로 사람을 뽑다',illustrationId:'ch02-exam-notice',quizId:'ch02-official-78-advanced-11',dialogue:'쌍기의 건의로 시작된 과거제가 광종의 다른 개혁과 연결되었다.',historicalEventId:'gwangjong-958-gwageo',year:958}),
  supplementalExamScene({sceneId:'ch03_exam_75_12',chapterId:'ch04',title:'태조의 지방 통치',illustrationId:'ch03-gaegyeong-982',quizId:'ch03-official-75-basic-12',dialogue:'성종의 지방 제도를 이해하려면 태조의 사심관 제도와 무엇이 달랐는지 구분해야 했다.',historicalEventId:'goryeo-early-kings',year:982}),
  supplementalExamScene({sceneId:'ch03_exam_practice_05',chapterId:'ch04',title:'지방까지 닿는 왕의 명령',illustrationId:'ch03-returning-merchant',quizId:'ch03-practice-05',dialogue:'상단이 겪은 지방의 문제와 12목 지방관 파견을 연결해 보았다.',historicalEventId:'seongjong-twelve-mok',year:982}),
  supplementalExamScene({sceneId:'ch03_exam_practice_06',chapterId:'ch04',title:'스물여덟 가지 건의',illustrationId:'ch03-doyun-guild-interior',quizId:'ch03-practice-06',dialogue:'성종에게 개혁안을 올린 인물의 이름을 다시 떠올렸다.',historicalEventId:'choe-seungro-simu-28',year:982}),
  supplementalExamScene({sceneId:'ch03_exam_practice_07',chapterId:'ch04',title:'국가가 세운 교육 기관',illustrationId:'ch03-gukjagam',quizId:'ch03-practice-07',dialogue:'책을 읽던 학생들과 관리 후보가 있던 교육 기관의 이름이 기억났다.',historicalEventId:'seongjong-gukjagam',year:982}),
  supplementalExamScene({sceneId:'ch03_exam_practice_08',chapterId:'ch04',title:'성종의 통치 방향',illustrationId:'ch03-gaegyeong-982',quizId:'ch03-practice-08',dialogue:'최승로의 건의가 성종의 유교 정치와 중앙 집권 정비로 이어졌다.',historicalEventId:'seongjong-state-system',year:982}),
  supplementalExamScene({sceneId:'ch03_exam_practice_09',chapterId:'ch04',title:'세 왕의 정책 구분',illustrationId:'ch03-gaegyeong-982',quizId:'ch03-practice-09',dialogue:'태조와 광종, 성종의 정책이 서로 다른 역할로 고려의 기틀을 만들었다.',historicalEventId:'goryeo-early-kings',year:982})
];

Object.assign(STORIES,Object.fromEntries(SUPPLEMENTAL_EXAM_SCENES.map(item=>[item.sceneId,item])));
QUESTIONS.push(...SUPPLEMENTAL_EXAM_QUESTIONS);
for(const q of QUESTIONS.filter(item=>item.isOfficial))Object.assign(q,{sourceVerified:true,sourceStatus:'verified_from_attached_pdf'});
const VERIFIED_EXAM_STORY_CONNECTIONS={
  'ch02-official-69-advanced-10':'도윤과 함께 태조가 남긴 나라의 기틀과 훈요 10조를 확인했으므로 정답은 ⑤입니다.',
  'ch02-official-74-advanced-11':'길상이 양인 신분을 되찾는 장면에서 노비안검법을 경험했고, 광덕·준풍도 광종의 정책이므로 정답은 ②입니다.',
  'ch02-official-76-advanced-50':'상인 거리의 오래된 장부에서 들은 광덕 연호와 길상의 노비안검법 장면을 함께 떠올리면 ⑤의 대한국 국제가 잘못된 설명입니다.',
  'ch02-official-77-advanced-14':'통천관을 쓴 왕건상과 준풍 연호를 함께 살핀 장면이 고려의 황제국 표방, 즉 정답 ⑤로 이어집니다.',
  'ch02-official-78-advanced-11':'현우가 쌍기의 건의로 열린 과거를 준비한 장면과 길상의 노비안검법 경험을 합치면 정답은 ④입니다.',
  'ch03-official-75-basic-10':'최승로의 건의가 실제로 12목 지방관 파견으로 이어진 장면을 경험했으므로 정답은 ③입니다.',
  'ch03-official-75-basic-12':'태조의 사심관과 성종의 12목을 비교한 장면에서 태조의 정책을 고르면 정답은 ③입니다.'
};
for(const [id,storyConnection] of Object.entries(VERIFIED_EXAM_STORY_CONNECTIONS)){const q=QUESTIONS.find(item=>item.questionId===id);if(q)q.storyConnection=storyConnection}

function chainSupplementalQuestions(anchorId,extraIds){
  const anchor=QUESTIONS.find(item=>item.questionId===anchorId);
  if(!anchor)throw new Error(`Missing quiz anchor: ${anchorId}`);
  const originalResumeStoryId=anchor.originalResumeStoryId||anchor.resumeStoryId;
  anchor.originalResumeStoryId=originalResumeStoryId;
  anchor.resumeStoryId=QUESTIONS.find(item=>item.questionId===extraIds[0]).relatedSceneId;
  extraIds.forEach((questionId,index)=>{
    const current=QUESTIONS.find(item=>item.questionId===questionId);
    const next=QUESTIONS.find(item=>item.questionId===extraIds[index+1]);
    current.resumeStoryId=next?next.relatedSceneId:originalResumeStoryId;
  });
}

chainSupplementalQuestions('ch01-test-01',['ch01-official-70-advanced-10']);
chainSupplementalQuestions('ch01-test-03',['ch01-official-73-basic-10']);
chainSupplementalQuestions('ch01-test-04',['ch01-official-74-advanced-10']);
chainSupplementalQuestions('ch01-boss',['ch01-official-76-advanced-10']);
chainSupplementalQuestions('ch02-test-01',['ch02-official-69-advanced-10']);
chainSupplementalQuestions('ch02-test-02',['ch02-official-74-advanced-11']);
chainSupplementalQuestions('ch02-test-03',['ch02-official-76-advanced-50']);
chainSupplementalQuestions('ch02-test-04',['ch02-official-77-advanced-14']);
chainSupplementalQuestions('ch02-test-05',['ch02-official-78-advanced-11']);
chainSupplementalQuestions('ch03-official-75-basic-10',['ch03-official-75-basic-12']);
chainSupplementalQuestions('ch03-practice-02',['ch03-practice-05']);
chainSupplementalQuestions('ch03-practice-03',['ch03-practice-06','ch03-practice-07']);
chainSupplementalQuestions('ch03-practice-04',['ch03-practice-08','ch03-practice-09']);

for(const chapterId of ['ch01','ch03','ch04'])CHAPTERS[chapterId].questionCount=10;
HISTORY.relatedQuestions=QUESTIONS.filter(item=>item.chapterId==='ch01').map(item=>item.questionId);
