/* CH.03 왕의 나라 — stable ch02_* scene/asset IDs */
const CHAPTERS={
  ch01:{chapterId:'ch01',episode:'goryeo',number:'01',title:'새로운 나라',subtitle:'918년, 고려 건국과 후삼국',thumbnail:'goryeo.png',startStoryId:'prologue',completeStoryId:'complete',questionCount:10,implemented:true},
  ch03:{chapterId:'ch03',episode:'goryeo',number:'03',title:'왕의 나라',subtitle:'왕은 왜 자신의 사람들을 풀어주었을까',years:'949 — 960',thumbnail:'assets/scenes/ch02-complete.png',startStoryId:'ch02_transition',completeStoryId:'ch02_chapter_clear',questionCount:12,reviewQuestionCount:5,implemented:true},
  ch04:{chapterId:'ch04',episode:'goryeo',number:'04',title:'나라의 틀',subtitle:'최승로의 시무 28조와 성종',thumbnail:'assets/scenes/ch03-teaser.png',questionCount:0,implemented:false},
  ch05:{chapterId:'ch05',episode:'goryeo',number:'05',title:'북쪽에서 온 적',subtitle:'거란의 침입과 고려의 대응',thumbnail:'goryeo.png',questionCount:0,implemented:false},
  ch06:{chapterId:'ch06',episode:'goryeo',number:'06',title:'귀족들의 나라',subtitle:'문벌 귀족 사회와 갈등',thumbnail:'goryeo.png',questionCount:0,implemented:false},
  ch07:{chapterId:'ch07',episode:'goryeo',number:'07',title:'칼을 든 무신들',subtitle:'무신 정변과 권력의 변화',thumbnail:'goryeo.png',questionCount:0,implemented:false},
  ch08:{chapterId:'ch08',episode:'goryeo',number:'08',title:'몽골이 온다',subtitle:'몽골의 침입과 강화도 천도',thumbnail:'goryeo.png',questionCount:0,implemented:false},
  ch09:{chapterId:'ch09',episode:'goryeo',number:'09',title:'원의 그림자',subtitle:'원 간섭기의 고려',thumbnail:'goryeo.png',questionCount:0,implemented:false},
  ch10:{chapterId:'ch10',episode:'goryeo',number:'10',title:'왕의 반격',subtitle:'공민왕의 개혁',thumbnail:'goryeo.png',questionCount:0,implemented:false},
  ch11:{chapterId:'ch11',episode:'goryeo',number:'11',title:'돌아선 장군',subtitle:'위화도 회군과 권력의 이동',thumbnail:'goryeo.png',questionCount:0,implemented:false},
  ch12:{chapterId:'ch12',episode:'goryeo',number:'12',title:'고려의 마지막 날',subtitle:'고려의 멸망과 새 왕조',thumbnail:'goryeo.png',questionCount:0,implemented:false}
};

Object.assign(ASSETS,{
  'ch02-gaegyeong-market':sceneArt('ch02-gaegyeong-market','949년, 전쟁이 끝난 뒤 성장한 개경 시장',['#536359','#b08352']),
  'ch02-market-949':sceneArt('ch02-market-949','949년, 왕조와 함께 자라난 개경 시장',['#4e5b52','#b78a55']),
  'ch02-doyun-shop-exterior-949':sceneArt('ch02-doyun-shop-exterior-949','949년, 도윤이 일군 작은 가게',['#5b5143','#b78451']),
  'ch02-doyun-shop-interior-949':sceneArt('ch02-doyun-shop-interior-949','949년, 도윤의 가게 안쪽',['#29313a','#a9794e']),
  'ch02-doyun-shop-956':sceneArt('ch02-doyun-shop-956','956년, 일곱 해 동안 조금 더 자란 도윤의 가게',['#554b3e','#b6814d']),
  'ch02-water-reflection-958':sceneArt('ch02-water-reflection-958','958년, 개경 밖 달빛 어린 물가',['#0d1828','#5b6b83'],true,'ch02-water-reflection-958',['player']),
  'ch02-slave-dispute':sceneArt('ch02-slave-dispute','노비 신분을 둘러싸고 충돌하는 시장 사람들',['#55463b','#a87452'],true),
  'ch02-freed-citizen':sceneArt('ch02-freed-citizen','문서 조사 뒤 양인 신분을 되찾는 남자',['#443d35','#9a7655'],true),
  'ch02-nobles-night':sceneArt('ch02-nobles-night','도윤의 상점에서 왕의 정책에 분노하는 귀족들',['#171f29','#796047'],true),
  'ch02-exam-notice':sceneArt('ch02-exam-notice','과거제 시행 소식이 퍼지는 개경 거리',['#536054','#aa8556']),
  'ch02-exam-yard':sceneArt('ch02-exam-yard','958년 개경의 과거 시험장',['#46554f','#a98458']),
  'ch02-reign-titles':sceneArt('ch02-reign-titles','서로 다른 공복을 입은 관리들이 지나가는 960년 개경 거리',['#283843','#a27b49'],true,'ch02-official-robes-street-960'),
  'ch02-purge-night':sceneArt('ch02-purge-night','군사들이 귀족의 집으로 들어가는 긴장된 밤',['#111923','#684d3f'],true),
  'ch02-complete':sceneArt('ch02-complete','왕권이 강해진 고려의 수도 개경과 챕터 엔딩',['#172832','#b08b53'],true),
  'ch03-teaser':sceneArt('ch03-teaser','최승로가 성종에게 시무 28조를 올리는 궁궐 장면',['#171d26','#826344'],true)
});

Object.assign(PORTRAITS,{
  doyun_949_neutral:portrait('doyun','neutral','도윤 · 949년, 가게를 일군 쉰일곱 살의 기본 표정',['#2e3540','#9a7658'],'assets/characters/doyun_949_neutral.png'),
  doyun_949_smile:portrait('doyun','smile','도윤 · 949년, 오랜 친구를 놀리는 미소',['#323945','#aa805b'],'assets/characters/doyun_949_smile.png'),
  doyun_949_surprised:portrait('doyun','surprised','도윤 · 949년, 뜻밖의 말에 놀란 표정',['#303743','#9e7557'],'assets/characters/doyun_949_surprised.png'),
  doyun_949_serious:portrait('doyun','serious','도윤 · 949년, 장사와 세상을 헤아리는 굳은 표정',['#29313c','#84674f'],'assets/characters/doyun_949_serious.png'),
  doyun_949_worried:portrait('doyun','worried','도윤 · 949년, 친구를 염려하는 표정',['#2b333e','#8a6b53'],'assets/characters/doyun_949_worried.png'),
  doyun_956_neutral:portrait('doyun','neutral','도윤 · 956년 이후, 세월이 내려앉은 기본 표정',['#2d3440','#927155'],'assets/characters/doyun_956_neutral.png'),
  doyun_956_smile:portrait('doyun','smile','도윤 · 956년 이후, 여전한 장난기 어린 미소',['#313945','#9f7958'],'assets/characters/doyun_956_smile.png'),
  doyun_956_surprised:portrait('doyun','surprised','도윤 · 956년 이후, 눈을 크게 뜬 표정',['#303743','#977256'],'assets/characters/doyun_956_surprised.png'),
  doyun_956_serious:portrait('doyun','serious','도윤 · 956년 이후, 노련하고 엄정한 표정',['#29313b','#80634e'],'assets/characters/doyun_956_serious.png'),
  doyun_956_worried:portrait('doyun','worried','도윤 · 956년 이후, 세월 어린 걱정스러운 표정',['#2b333e','#866650'],'assets/characters/doyun_956_worried.png'),
  hyunwoo_neutral:portrait('hyunwoo','neutral','현우 · 온화하고 학구적인 기본 표정',['#42504a','#9a7957'],'assets/characters/hyunwoo_neutral.png'),
  hyunwoo_worried:portrait('hyunwoo','worried','현우 · 시험을 앞두고 긴장한 표정',['#3c4947','#816957'],'assets/characters/hyunwoo_worried.png'),
  hyunwoo_smile:portrait('hyunwoo','smile','현우 · 격려를 받고 안도하는 미소',['#46534b','#a47f59'],'assets/characters/hyunwoo_smile.png'),
  freed_man_worried:portrait('freed_man','worried','양인 출신 남자 · 억울함을 호소하는 표정',['#4e4338','#8b7057'],'assets/characters/laborer_01.png'),
  freed_man_smile:portrait('freed_man','smile','양인 출신 남자 · 신분을 되찾고 안도하는 표정',['#51473b','#a17c58'],'assets/characters/laborer_01.png'),
  steward_angry:portrait('steward','angry','귀족 집안 관리인 · 노비라고 주장하며 화난 표정',['#4c352f','#8e5848'],'assets/characters/steward_01.png'),
  steward_serious:portrait('steward','serious','귀족 집안 관리인 · 문서를 내미는 굳은 표정',['#443932','#7c624e'],'assets/characters/steward_01.png'),
  official_serious:portrait('official','serious','고려 관리 · 왕명을 집행하는 엄정한 표정',['#263b43','#92734d'],'assets/characters/official_01.png'),
  noble_angry:portrait('noble','angry','고려 귀족 · 정책에 반발하는 권위적인 표정',['#49302f','#8d5949'],'assets/characters/noble_01.png'),
  noble_suspicious:portrait('noble','suspicious','고려 귀족 · 왕을 경계하며 낮게 말하는 표정',['#403231','#755447'],'assets/characters/noble_01.png'),
  citizen_surprised:portrait('citizen','surprised','개경 사람 · 새로운 시험 소식에 놀란 표정',['#4e493b','#937954'],'assets/characters/villager_female_01.png'),
  citizen_neutral:portrait('citizen','neutral','개경 사람 · 시장 소문을 전하는 표정',['#4b473b','#867157'],'assets/characters/villager_male_01.png'),
  soldier_serious:portrait('soldier','serious','고려 군사 · 왕명을 수행하는 굳은 표정',['#27343b','#6f5c4b'],'assets/characters/soldier_01.png')
});

Object.assign(CHARACTERS,{
  hyunwoo:{characterId:'hyunwoo',characterName:'현우',speakerType:'npc',position:'right',show:true,presentation:'standing',portraitPrefix:'hyunwoo',characterAge:23,characterEraVariant:'exam-candidate',longTermGoal:'과거에 급제해 원칙을 지키는 관리가 되기'},
  freed_man:{characterId:'freed_man',characterName:'길상',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'freed_man'},
  steward:{characterId:'steward',characterName:'귀족 집안 관리인',speakerType:'npc',position:'right',show:false,presentation:'ambient',portraitPrefix:'steward'},
  official:{characterId:'official',characterName:'관리',speakerType:'npc',position:'right',show:false,presentation:'ambient',portraitPrefix:'official'},
  noble:{characterId:'noble',characterName:'귀족',speakerType:'npc',position:'right',show:false,presentation:'ambient',portraitPrefix:'noble'},
  citizen:{characterId:'citizen',characterName:'개경 사람',speakerType:'npc',position:'right',show:false,presentation:'ambient',portraitPrefix:'citizen'},
  soldier:{characterId:'soldier',characterName:'군사',speakerType:'npc',position:'right',show:false,presentation:'ambient',portraitPrefix:'soldier'}
});

QUESTIONS.push(
  question({questionId:'ch02-test-01',chapterId:'ch03',relatedSceneId:'ch02_policy_memory',relatedHistoricalEventId:'gwangjong-956-nobi',historicalEvent:'노비안검법과 왕권 강화',relatedIllustrationId:'ch02-freed-citizen',questionType:'사료·연계 정책형',difficulty:'중상',passage:'“본래 양인이었으나 전쟁과 혼란 속에서 억울하게 노비가 되었다고 호소하는 자들의 신분을 조사하도록 하라.”',question:'이 상황을 추진한 왕의 다른 정책으로 옳은 것은?',choices:['사심관 제도를 실시하였다.','과거제를 시행하였다.','12목에 지방관을 파견하였다.','전민변정도감을 설치하였다.','별무반을 조직하였다.'],answer:1,explanation:'자료는 광종의 노비안검법을 보여 줍니다. 광종은 쌍기의 건의를 받아들여 과거제를 시행해 새로운 관료를 선발했습니다.',examKeywords:['광종','노비안검법','과거제','왕권 강화'],rewardKnowledge:2,resumeStoryId:'ch02_noble_night'}),
  question({questionId:'ch02-test-02',chapterId:'ch03',relatedSceneId:'ch02_ssanggi',relatedHistoricalEventId:'gwangjong-958-gwageo',historicalEvent:'958년 과거제 시행',relatedIllustrationId:'ch02-exam-notice',questionType:'인물·정책 연결형',difficulty:'중',passage:'후주에서 고려로 온 인물이 광종에게 재능 있는 사람을 시험으로 뽑자고 건의하였다.',question:'이 인물과 정책의 연결로 옳은 것은?',choices:['쌍기 — 과거제','최승로 — 노비안검법','서희 — 과거제','강감찬 — 노비안검법','신돈 — 과거제'],answer:0,explanation:'후주 출신 쌍기는 광종에게 과거제 시행을 건의했습니다. 고려의 과거제는 958년에 처음 시행되었습니다.',examKeywords:['쌍기','과거제','958년','광종'],rewardKnowledge:2,resumeStoryId:'ch02_exam_eve'}),
  question({questionId:'ch02-test-03',chapterId:'ch03',relatedSceneId:'ch02_reign_titles',relatedHistoricalEventId:'gwangjong-reign-titles',historicalEvent:'광덕·준풍 연호',relatedIllustrationId:'ch02-reign-titles',questionType:'단서로 왕 판단형',difficulty:'중',passage:'노비안검법 · 광덕 · 준풍',question:'위 단서를 통해 알 수 있는 고려의 왕은?',choices:['태조','광종','성종','현종','공민왕'],answer:1,explanation:'노비안검법과 독자적 연호 광덕·준풍은 모두 광종을 가리키는 대표 단서입니다.',examKeywords:['광종','광덕','준풍','노비안검법'],rewardKnowledge:2,resumeStoryId:'ch02_reign_followup'}),
  question({questionId:'ch02-test-04',chapterId:'ch03',relatedSceneId:'ch02_reign_followup',relatedHistoricalEventId:'gwangjong-authority',historicalEvent:'광종의 왕권 강화 정책',relatedIllustrationId:'ch02-reign-titles',questionType:'왕 업적 구분형',difficulty:'중상',passage:'광종은 호족 세력을 견제하고 왕권을 강화하기 위한 여러 정책을 추진하였다.',question:'다음 중 광종의 정책에 해당하지 않는 것은?',choices:['노비안검법 시행','과거제 시행','광덕 연호 사용','준풍 연호 사용','12목에 지방관 파견'],answer:4,explanation:'12목에 지방관을 파견한 왕은 성종입니다. 노비안검법·과거제·광덕·준풍은 광종과 연결됩니다.',examKeywords:['광종과 성종 구분','12목','광덕','준풍'],rewardKnowledge:2,resumeStoryId:'ch02_purge'}),
  question({questionId:'ch02-test-05',chapterId:'ch03',relatedSceneId:'ch02_purge',relatedHistoricalEventId:'goryeo-early-kings',historicalEvent:'태조·광종·성종 업적 비교',relatedIllustrationId:'ch02-purge-night',questionType:'왕별 정책 연결형',difficulty:'상',passage:'고려 초기에는 왕조의 기반 마련, 왕권 강화, 유교 정치 체제 정비가 차례로 추진되었다.',question:'태조 → 광종 → 성종의 정책을 바르게 연결한 것은?',choices:['사심관 → 노비안검법 → 12목 지방관 파견','노비안검법 → 사심관 → 시무 28조 수용','12목 지방관 파견 → 과거제 → 기인 제도','과거제 → 시무 28조 수용 → 사심관','기인 제도 → 12목 지방관 파견 → 광덕 연호 사용'],answer:0,explanation:'태조는 사심관·기인 제도를 실시했고, 광종은 노비안검법·과거제를 시행했으며, 성종은 최승로의 건의를 받아들이고 12목에 지방관을 파견했습니다.',examKeywords:['태조 사심관','광종 노비안검법','성종 12목','왕별 업적'],rewardKnowledge:3,resumeStoryId:'ch02_complete'})
);

const ch02QuestionById=id=>QUESTIONS.find(item=>item.questionId===id);
Object.assign(ch02QuestionById('ch02-test-01'),{historicalEventId:'gwangjong-956-nobi',sourceType:'exam_style',concepts:['노비안검법','광종_왕권강화'],conceptIds:['노비안검법','광종_왕권강화']});
Object.assign(ch02QuestionById('ch02-test-02'),{historicalEventId:'gwangjong-958-gwageo',sourceType:'exam_style',concepts:['쌍기_과거제','광종_왕권강화'],conceptIds:['쌍기_과거제','광종_왕권강화']});
Object.assign(ch02QuestionById('ch02-test-03'),{
  relatedSceneId:'ch02_reign_titles',relatedHistoricalEventId:'gwangjong-reign-titles',historicalEventId:'gwangjong-reign-titles',historicalEvent:'광덕 연호',relatedIllustrationId:'ch02-gaegyeong-market',questionType:'연호 의미 판단형',formatLabel:'기억 확인',difficulty:'하',
  passage:'시장의 상인이 오래된 장부를 펼치며 “이것은 광덕 때 적은 기록”이라고 말했다.',question:'광덕에 대한 설명으로 옳은 것은?',choices:['광종이 사용한 독자적 연호이다.','태조가 남긴 유훈의 이름이다.','성종이 세운 교육 기관이다.','후백제의 수도 이름이다.'],answer:0,
  explanation:'광덕은 광종이 사용한 독자적 연호입니다. 뒤이어 준풍도 사용했습니다.',choiceExplanations:['광종과 연결되는 연호입니다.','태조의 유훈은 훈요 10조입니다.','성종의 교육 기관은 국자감입니다.','후백제의 수도는 완산주였습니다.'],examKeywords:['광덕','광종','독자적 연호'],concepts:['광덕_준풍','광종_왕권강화'],conceptIds:['광덕_준풍','광종_왕권강화'],sourceType:'exam_style',resumeStoryId:'ch02_reign_followup'
});
Object.assign(ch02QuestionById('ch02-test-04'),{
  relatedSceneId:'ch02_reign_followup',relatedHistoricalEventId:'gwangjong-reign-titles',historicalEventId:'gwangjong-reign-titles',historicalEvent:'광덕·준풍 연호',relatedIllustrationId:'ch02-gaegyeong-market',questionType:'연호 순서 판단형',formatLabel:'직접 확인',difficulty:'중',
  passage:'광덕\n↓\n준풍',question:'위 두 연호를 차례로 사용한 왕은?',choices:['태조','광종','성종','공민왕'],answer:1,
  explanation:'광종은 독자적 연호로 광덕을 사용한 뒤 준풍을 사용했습니다.',choiceExplanations:['태조의 연호가 아닙니다.','광덕과 준풍을 사용한 왕입니다.','성종은 유교 통치 체제를 정비했습니다.','공민왕은 고려 후기의 왕입니다.'],examKeywords:['광덕 → 준풍','광종','독자적 연호'],concepts:['광덕_준풍','광종_왕권강화'],conceptIds:['광덕_준풍','광종_왕권강화'],sourceType:'exam_style',resumeStoryId:'ch02_purge'
});
Object.assign(ch02QuestionById('ch02-test-05'),{
  relatedSceneId:'ch02_night_discussion',relatedHistoricalEventId:'gwangjong-authority',historicalEventId:'gwangjong-authority',historicalEvent:'광종의 왕권 강화',relatedIllustrationId:'ch02-doyun-shop-956',questionType:'공통 방향 판단형',formatLabel:'핵심 방향',difficulty:'중',
  passage:'길상은 신분을 되찾았고, 현우는 과거를 거쳐 관리가 되었다. 한편 오래된 유력 가문의 힘은 약해졌다.',question:'이 변화들이 공통으로 향한 정치적 방향은?',choices:['왕권 강화','호족 연합 정치 강화','무신 정권 성립','원 간섭 확대'],answer:0,
  explanation:'노비안검법·과거제·공복·독자적 연호와 호족 견제는 모두 광종의 왕권 강화로 연결됩니다.',choiceExplanations:['새 인재와 제도를 왕 중심으로 묶는 방향입니다.','광종은 기존 호족의 힘을 줄였습니다.','무신 정권은 12세기의 일입니다.','원 간섭기는 훨씬 뒤입니다.'],examKeywords:['광종','호족 견제','왕권 강화'],concepts:['광종_왕권강화','호족_견제'],conceptIds:['광종_왕권강화','호족_견제'],sourceType:'exam_style',resumeStoryId:'ch02_complete'
});

QUESTIONS.push(
  question({questionId:'ch02-test-robes',chapterId:'ch03',relatedSceneId:'ch02_hyunwoo_official',relatedHistoricalEventId:'gwangjong-official-robes',historicalEventId:'gwangjong-official-robes',historicalEvent:'공복 제정',relatedIllustrationId:'ch02-reign-titles',questionType:'정책·왕 연결형',formatLabel:'기억 확인',difficulty:'하',passage:'현우는 관리들의 옷 색깔이 품계에 따라 구분되는 공복 제도를 설명하였다.',question:'공복을 제정한 고려의 왕은?',choices:['태조','광종','성종','현종'],answer:1,explanation:'광종은 관리의 공복을 제정해 품계에 따른 질서를 드러냈습니다.',choiceExplanations:['태조는 고려를 세우고 통합 정책을 폈습니다.','공복 제정의 왕입니다.','성종은 12목에 지방관을 파견했습니다.','현종은 거란 침입 시기의 왕입니다.'],examKeywords:['광종','공복 제정','관리 등급'],concepts:['광종_공복','광종_왕권강화'],conceptIds:['광종_공복','광종_왕권강화'],sourceType:'exam_style',examType:'기출 유형 · 자체 제작',isOfficial:false,rewardKnowledge:2,resumeStoryId:'ch02_reign_titles'}),
  question({questionId:'ch02-test-06',chapterId:'ch03',relatedSceneId:'ch02_memory_retrieval',relatedHistoricalEventId:'gwangjong-authority',historicalEventId:'gwangjong-authority',historicalEvent:'광종 개혁의 흐름',relatedIllustrationId:'ch02-complete',questionType:'정책 흐름 종합형',formatLabel:'챕터 기억 회수',difficulty:'중상',passage:'길상의 신분 회복 → 현우의 과거 급제 → 품계별 공복 → 광덕·준풍',question:'이 장면들을 하나의 흐름으로 가장 잘 정리한 것은?',choices:['태조가 호족과 혼인하여 나라의 기반을 마련하였다.','광종이 새 질서와 인재를 왕 중심으로 묶어 왕권을 강화하였다.','성종이 12목에 지방관을 파견하였다.','현종이 거란의 침입을 물리쳤다.'],answer:1,explanation:'노비안검법·과거제·공복 제정·광덕과 준풍은 광종의 왕권 강화 정책 흐름입니다.',choiceExplanations:['태조의 통합 정책과 구분합니다.','CH.03에서 경험한 네 장면을 모두 설명합니다.','성종의 지방 통치 정책입니다.','현종 시기의 대외 항쟁입니다.'],examKeywords:['노비안검법','과거제','공복','광덕·준풍','왕권 강화'],concepts:['광종_개혁종합','광종_왕권강화'],conceptIds:['광종_개혁종합','광종_왕권강화'],sourceType:'exam_style',examType:'기출 유형 · 자체 제작',isOfficial:false,rewardKnowledge:3,resumeStoryId:'ch02_realization'})
);

const CH03_REVIEW_IDS=['ch02-review-01','ch02-review-02','ch02-review-03','ch02-review-04','ch02-review-05'];
const ch03ReviewQuestion=data=>question({chapterId:'ch03',reviewOnly:true,isOfficial:false,sourceType:'exam_style',sourceVerified:false,examType:'실전 유형 연습 · 자체 제작',source:'스토리에서 확인한 고려 광종의 정책과 검증된 역사 사실을 바탕으로 자체 제작',rewardKnowledge:2,resumeStoryId:'ch02_chapter_clear',...data});
QUESTIONS.push(
  ch03ReviewQuestion({questionId:'ch02-review-01',relatedSceneId:'ch02_policy_memory',relatedHistoricalEventId:'gwangjong-956-nobi',historicalEventId:'gwangjong-956-nobi',historicalEvent:'노비안검법',relatedIllustrationId:'ch02-freed-citizen',questionType:'정책 목적 판단형',difficulty:'중',passage:'본래 양인이었으나 억울하게 노비가 된 사람의 신분을 조사해 회복시켰다.',question:'이 정책의 효과로 가장 적절한 것은?',choices:['호족의 경제·군사 기반 약화와 왕권 강화','지방관 파견을 통한 직접 통치','무신의 정치 참여 확대','원의 내정 간섭 약화'],answer:0,explanation:'노비안검법은 호족의 노비를 줄이고 양인을 늘려 호족을 견제하고 왕권을 강화했습니다.',choiceExplanations:['정책의 핵심 효과입니다.','12목 지방관 파견과 관련됩니다.','무신 정권기의 변화입니다.','고려 후기의 상황입니다.'],examKeywords:['노비안검법','호족 견제','왕권 강화'],concepts:['노비안검법','광종_왕권강화'],conceptIds:['노비안검법','광종_왕권강화']}),
  ch03ReviewQuestion({questionId:'ch02-review-02',relatedSceneId:'ch02_memory_retrieval',relatedHistoricalEventId:'gwangjong-authority',historicalEventId:'gwangjong-authority',historicalEvent:'광종의 정책',relatedIllustrationId:'ch02-complete',questionType:'옳지 않은 정책형',difficulty:'중',passage:'광종은 왕 중심의 새 질서를 만들기 위해 여러 정책을 추진하였다.',question:'광종의 정책으로 옳지 않은 것은?',choices:['노비안검법 시행','과거제 시행','공복 제정','광덕·준풍 사용','12목 지방관 파견'],answer:4,explanation:'12목에 지방관을 파견한 왕은 성종입니다.',choiceExplanations:['광종의 정책입니다.','광종이 쌍기의 건의를 받아 시행했습니다.','광종이 품계 질서를 드러내기 위해 제정했습니다.','광종의 독자적 연호입니다.','성종의 정책입니다.'],examKeywords:['광종 정책','12목','성종과 구분'],concepts:['광종_성종','광종_개혁종합'],conceptIds:['광종_성종','광종_개혁종합']}),
  ch03ReviewQuestion({questionId:'ch02-review-03',relatedSceneId:'ch02_night_discussion',relatedHistoricalEventId:'goryeo-early-kings',historicalEventId:'goryeo-early-kings',historicalEvent:'태조·광종 정책 비교',relatedIllustrationId:'ch02-doyun-shop-956',questionType:'왕별 정책 비교형',difficulty:'중상',passage:'고려 초기에는 나라의 기반을 마련한 정책과 왕권을 강화한 정책이 이어졌다.',question:'왕과 정책의 연결로 옳은 것은?',choices:['태조 — 노비안검법','태조 — 광덕 연호','광종 — 사심관 제도','광종 — 과거제 시행'],answer:3,explanation:'과거제는 광종이 쌍기의 건의를 받아 958년에 시행했습니다. 사심관은 태조의 정책입니다.',choiceExplanations:['노비안검법은 광종의 정책입니다.','광덕은 광종의 연호입니다.','사심관은 태조의 지방 통제 정책입니다.','왕과 정책의 연결이 맞습니다.'],examKeywords:['태조','광종','과거제','사심관'],concepts:['태조_광종','쌍기_과거제'],conceptIds:['태조_광종','쌍기_과거제']}),
  ch03ReviewQuestion({questionId:'ch02-review-04',relatedSceneId:'ch02_reign_followup',relatedHistoricalEventId:'goryeo-early-kings',historicalEventId:'goryeo-early-kings',historicalEvent:'광종·성종 정책 비교',relatedIllustrationId:'ch02-gaegyeong-market',questionType:'왕별 정책 비교형',difficulty:'중상',passage:'(가) 독자적 연호 광덕·준풍을 사용하였다. (나) 최승로의 건의를 받아 12목에 지방관을 파견하였다.',question:'(가), (나)에 해당하는 왕을 바르게 연결한 것은?',choices:['태조 — 광종','광종 — 성종','성종 — 현종','현종 — 공민왕'],answer:1,explanation:'광덕·준풍은 광종, 최승로·12목은 성종의 단서입니다.',choiceExplanations:['첫 왕은 광종입니다.','광종과 성종의 대표 단서를 구분했습니다.','두 왕 모두 맞지 않습니다.','고려 중·후기의 왕입니다.'],examKeywords:['광덕·준풍','최승로','12목','광종·성종'],concepts:['광종_성종','광덕_준풍'],conceptIds:['광종_성종','광덕_준풍']}),
  ch03ReviewQuestion({questionId:'ch02-review-05',relatedSceneId:'ch02_memory_retrieval',relatedHistoricalEventId:'gwangjong-authority',historicalEventId:'gwangjong-authority',historicalEvent:'광종 개혁의 흐름',relatedIllustrationId:'ch02-complete',questionType:'사건 흐름 배열형',difficulty:'상',passage:'ㄱ. 쌍기의 건의로 과거제 시행\nㄴ. 노비안검법 시행\nㄷ. 품계에 따른 공복 제정\nㄹ. 준풍 연호 사용',question:'일어난 흐름을 바르게 나열한 것은?',choices:['ㄱ → ㄴ → ㄹ → ㄷ','ㄴ → ㄱ → ㄷ → ㄹ','ㄴ → ㄷ → ㄱ → ㄹ','ㄹ → ㄴ → ㄱ → ㄷ'],answer:1,explanation:'노비안검법(956) → 과거제(958) → 공복 제정(960)과 준풍 연호 사용의 흐름으로 기억합니다.',choiceExplanations:['노비안검법이 과거제보다 먼저입니다.','스토리와 연대의 흐름에 맞습니다.','공복 제정이 과거제보다 뒤입니다.','준풍은 뒤의 연호입니다.'],examKeywords:['956 노비안검법','958 과거제','960 공복','준풍'],concepts:['광종_정책순서','광종_개혁종합'],conceptIds:['광종_정책순서','광종_개혁종합']})
);

const ch02Scene=data=>scene({chapterId:'ch03',historicalEventId:'gwangjong-reforms',year:949,...data});
const CH02_STORIES={
  ch02_transition:ch02Scene({sceneId:'ch02_transition',location:'시간의 흐름',title:'삼십일 년',illustrationId:'ch02-market-949',timeOfDay:'dawn',sceneEffect:'blackout',autoAdvanceDelays:[900,1100,1100,1200,1450],continueLabel:'949년의 개경으로',cinematicStatus:'세월이 흐르는 중…',cinematicSub:'계절과 왕이 바뀌어도, 삶은 계속되었다.',enterCharacterStates:{player:{characterAge:23,characterEraVariant:'unchanged'},doyun:{characterAge:57,characterEraVariant:'established-shop-owner',ageVariant:'middle_aged_949',outfit:'shop_owner'}},dialogue:'918년 — 고려 건국\n계절이 수십 번 바뀌었다.\n왕이 바뀌고, 거리의 지붕이 늘어났다.\n그리고 나는 아직 고려에 있다.\n949년 — 개경',nextStoryId:'ch02_shop_exterior_949'}),
  ch02_shop_exterior_949:ch02Scene({sceneId:'ch02_shop_exterior_949',location:'949년 · 개경 시장',title:'도윤의 가게',illustrationId:'ch02-doyun-shop-exterior-949',timeOfDay:'afternoon',ambientSound:'market',dialogue:'시장의 한쪽에 도윤이 수십 년 동안 일군 가게가 자리를 잡았다.',nextStoryId:'ch02_reunion_949'}),
  ch02_reunion_949:ch02Scene({sceneId:'ch02_reunion_949',location:'개경 · 도윤의 가게',title:'여전한 두 사람',illustrationId:'ch02-doyun-shop-interior-949',timeOfDay:'afternoon',ambientSound:'market',dialogue:'가게는 커졌고 도윤의 머리에는 희끗한 빛이 늘었다. 그래도 두 사람의 말다툼은 예전 그대로였다.',nextStoryId:'ch02_market'}),
  ch02_market:ch02Scene({sceneId:'ch02_market',location:'개경 · 도윤의 가게',title:'왕이 바뀐 나라',illustrationId:'ch02-doyun-shop-interior-949',timeOfDay:'afternoon',ambientSound:'market',dialogue:'왕건이 세상을 떠난 뒤 왕위가 몇 차례 바뀌었다. 지금 고려를 다스리는 왕의 이름이 기억 끝에 걸렸다.',choices:[
    choice('광종','ch02_life_path',{knowledge:1},{},'맞아. 광종. 기억이 선명해졌다.',{flags:{ch02KingMemory:'gwangjong'},memoryKey:'ch02-king-after-taejo',memoryValue:{answer:'광종',correct:true},playerResponse:'광종.',playerExpression:'thinking',responseText:'그렇소. 지금 왕은 광종이오.',responseCharacterId:'doyun',responseExpression:'neutral',resultSceneId:'ch02-memory-gwangjong',resultIllustrationId:'ch02-gaegyeong-market',hint:'기억 +1'}),
    choice('성종','ch02_life_path',{}, {},'이름이 비슷하게 섞인다. 조금 더 지켜보자.',{flags:{ch02KingMemory:'seongjong'},memoryKey:'ch02-king-after-taejo',memoryValue:{answer:'성종',correct:false},playerResponse:'성종……?',playerExpression:'worried',responseText:'표정을 보니 확신은 없는 모양이오.',responseCharacterId:'doyun',responseExpression:'suspicious',resultSceneId:'ch02-memory-seongjong',resultIllustrationId:'ch02-gaegyeong-market'}),
    choice('공민왕','ch02_life_path',{}, {},'아직 훨씬 뒤의 왕이다. 조금 더 지켜보자.',{flags:{ch02KingMemory:'gongmin'},memoryKey:'ch02-king-after-taejo',memoryValue:{answer:'공민왕',correct:false},playerResponse:'공민왕……?',playerExpression:'worried',responseText:'처음 듣는 이름이오.',responseCharacterId:'doyun',responseExpression:'surprised',resultSceneId:'ch02-memory-gongmin',resultIllustrationId:'ch02-gaegyeong-market'}),
    choice('현종','ch02_life_path',{}, {},'순서가 조금 섞였다. 눈앞의 사건을 더 살펴보자.',{flags:{ch02KingMemory:'hyeonjong'},memoryKey:'ch02-king-after-taejo',memoryValue:{answer:'현종',correct:false},playerResponse:'현종……?',playerExpression:'worried',responseText:'그런 이름의 왕은 아직 없소.',responseCharacterId:'doyun',responseExpression:'surprised',resultSceneId:'ch02-memory-hyeonjong',resultIllustrationId:'ch02-gaegyeong-market'})
  ]}),
  ch02_life_path:ch02Scene({sceneId:'ch02_life_path',location:'개경 · 도윤의 가게 앞',title:'고려에서 나의 자리',illustrationId:'ch02-doyun-shop-exterior-949',timeOfDay:'afternoon',dialogue:'도윤은 작은 가게를 일구었지만, 여러 지역을 잇는 자기 상단의 꿈은 아직 진행 중이다. 주인공도 이 시대에서 어떤 기반을 만들지 정해야 한다.',choices:[
    choice('도윤의 장사를 계속 돕는다','ch02_jump_956',{wealth:4},{doyun:4},'함께 장부와 짐을 맡으며 도윤의 작은 가게를 키우기로 했다.',{lifePath:'doyun-merchant-partner',trustChanges:{doyun:3},sharedEvents:['helped_doyun_business'],importantChoice:'merchant-partner',playerResponse:'네 상단이 생길 때까지 같이 해볼게.',playerExpression:'smile',responseText:'나중에 말을 바꾸지는 마시오.',responseCharacterId:'doyun',responseExpression:'smile',resultSceneId:'ch02-life-merchant',resultIllustrationId:'ch02-gaegyeong-market',hint:'재산 +4 · 도윤 +4 · 신뢰 +3'}),
    choice('독립해서 내 일을 찾는다','ch02_jump_956',{wealth:2,fame:2},{doyun:1},'도윤의 곁을 떠나지는 않되, 스스로 품삯을 구하고 이름을 알리기로 했다.',{lifePath:'independent-worker',trustChanges:{doyun:1},importantChoice:'independent',playerResponse:'나도 내 힘으로 할 일을 찾아볼래.',playerExpression:'serious',responseText:'좋소. 대신 굶게 되면 바로 오시오.',responseCharacterId:'doyun',responseExpression:'neutral',resultSceneId:'ch02-life-independent',resultIllustrationId:'ch02-gaegyeong-market',hint:'재산 +2 · 명성 +2'}),
    choice('글과 제도를 더 공부한다','ch02_jump_956',{knowledge:2},{doyun:1},'장터 일 사이사이에 글을 배우며 관청과 제도를 이해하기 시작했다.',{lifePath:'learning',importantChoice:'learning',playerResponse:'나는 공부를 좀 더 해볼게.',playerExpression:'thinking',responseText:'그럼 장부도 더 잘 보겠구려.',responseCharacterId:'doyun',responseExpression:'smile',resultSceneId:'ch02-life-learning',resultIllustrationId:'ch02-gaegyeong-market',hint:'지식 +2'})
  ]}),
  ch02_jump_956:ch02Scene({sceneId:'ch02_jump_956',year:956,location:'시간의 흐름',title:'일곱 해 뒤',illustrationId:'ch02-doyun-shop-956',timeOfDay:'dawn',sceneEffect:'blackout',autoAdvanceDelays:[900,1150,1350],continueLabel:'956년의 개경으로',cinematicStatus:'일곱 해가 흐르는 중…',cinematicSub:'가게와 사람, 나라의 질서가 조금씩 달라졌다.',enterCharacterStates:{doyun:{characterAge:64,characterEraVariant:'established-merchant',ageVariant:'elder_956',outfit:'established_merchant'}},dialogue:'도윤의 가게에서 다시 일곱 번의 겨울을 보냈다.\n가게는 조금 더 자랐고, 도윤의 머리는 더 희어졌다.\n956년 — 개경',nextStoryId:'ch02_shop_956'}),
  ch02_shop_956:ch02Scene({sceneId:'ch02_shop_956',year:956,location:'개경 · 도윤의 가게',title:'조금 더 커진 가게',illustrationId:'ch02-doyun-shop-956',timeOfDay:'afternoon',ambientSound:'market',dialogue:'가게에는 일손과 물건이 늘었다. 그러나 도윤은 여전히 상단이라는 더 큰 꿈을 입에 올렸다.',nextStoryId:'ch02_dispute'}),
  ch02_dispute:ch02Scene({sceneId:'ch02_dispute',year:956,location:'개경 · 시장 한복판',title:'도윤이 아는 사람',illustrationId:'ch02-slave-dispute',timeOfDay:'afternoon',dialogue:'시장 한쪽에서 길상과 귀족 집안의 관리인이 거칠게 맞선다. 도윤은 아버지와 거래하던 집안 사람을 알아본다.',nextStoryId:'ch02_trust'}),
  ch02_trust:ch02Scene({sceneId:'ch02_trust',year:956,location:'개경 · 시장 한복판',title:'그냥 두고 갈 수는 없어',illustrationId:'ch02-slave-dispute',timeOfDay:'afternoon',dialogue:'도윤은 길상을 돕겠다고 한다. 선택은 역사적 결과가 아니라 두 사람의 관계와 위험을 바꾼다.',choices:[
    choice('알겠어. 같이 도와주자','ch02_inspection',{health:-5,fame:2},{doyun:7,citizens:3},'위험을 감수하고 증언자를 직접 찾아 나섰다.',{trustChanges:{doyun:6},sharedEvents:['helped_doyun_friend'],importantChoice:'helped-directly',flags:{nobiIncidentApproach:'direct'},resultDialogues:[dialogueLine('player','serious','알겠어. 같이 도와주자.'),dialogueLine('doyun','worried','고맙소. 허나 무작정 뛰어들지는 마시오.'),dialogueLine('player','surprised','도와주자며.'),dialogueLine('doyun','serious','죽으라고 한 적은 없소.'),dialogueLine('narrator','neutral','둘은 길상의 고향 사람을 찾아 증언을 모았다.','narration')],resultSceneId:'ch02-trust-help',resultIllustrationId:'ch02-slave-dispute',hint:'위험 감수 · 도윤 +7 · 신뢰 +6'}),
    choice('잠깐. 먼저 증거부터 찾아보자','ch02_inspection',{knowledge:2},{doyun:3},'감정보다 기록을 앞세워 오래된 거래 장부와 호적의 흔적을 찾았다.',{trustChanges:{doyun:4},sharedEvents:['helped_doyun_friend'],importantChoice:'investigated-evidence',flags:{nobiIncidentApproach:'evidence'},resultDialogues:[dialogueLine('player','thinking','잠깐. 먼저 증거부터 찾아보자.'),dialogueLine('doyun','serious','답답하긴 해도…… 자네 말이 옳소. 저쪽도 문서를 들고 올 테니까.'),dialogueLine('narrator','neutral','도윤 아버지의 옛 거래 장부가 길상의 신분을 밝힐 단서가 되었다.','narration')],resultSceneId:'ch02-trust-evidence',resultIllustrationId:'chapter-02-teaser',hint:'지식 +2 · 신뢰 +4'}),
    choice('괜히 귀족 집안과 엮이면 위험해','ch02_inspection',{wealth:2},{doyun:-4},'가게를 지키며 멀리서 상황을 관찰했지만 둘 사이에는 어색한 침묵이 남았다.',{trustChanges:{doyun:-5},importantChoice:'watched-safely',flags:{nobiIncidentApproach:'safe'},resultDialogues:[dialogueLine('player','worried','괜히 귀족 집안과 엮이면 위험해.'),dialogueLine('doyun','angry','자네는 가끔 이상할 만큼 남의 일에 무심하군.'),dialogueLine('player','serious','죽을 수도 있는 일이야.'),dialogueLine('doyun','serious','그래서 모른 척하자는 게요?'),dialogueLine('narrator','neutral','둘은 한동안 말없이 조사처까지 걸었다.','narration')],resultSceneId:'ch02-trust-safe',resultIllustrationId:'ch02-slave-dispute',hint:'안전 관찰 · 재산 +2 · 도윤 −4'}),
  ]}),
  ch02_inspection:ch02Scene({sceneId:'ch02_inspection',year:956,location:'개경 · 신분 조사처',title:'폐하의 명이다',illustrationId:'chapter-02-teaser',timeOfDay:'evening',dialogue:'관리가 오래된 호적과 증언을 대조한다.',nextStoryId:'ch02_policy_reason'}),
  ch02_policy_reason:ch02Scene({sceneId:'ch02_policy_reason',year:956,location:'개경 · 신분 조사처 앞',title:'양인으로 돌아가다',illustrationId:'ch02-freed-citizen',timeOfDay:'sunset',dialogue:'조사 끝에 남자가 본래 양인이었다는 사실이 확인되었다.',choices:[
    choice('호족들이 거느리는 사람이 줄어든다','ch02_policy_memory',{knowledge:2},{citizens:3},'노비를 풀어 주면 호족의 경제·군사 기반은 약해지고 국가가 파악하는 양인은 늘어난다.',{flags:{understandsNobi:true},memoryKey:'ch02-nobi-purpose',memoryValue:{answer:'호족 기반 약화',correct:true},playerResponse:'호족들이 거느리는 사람이 줄어들어.',playerExpression:'thinking',resultSceneId:'ch02-reason-correct',resultIllustrationId:'ch02-freed-citizen',hint:'핵심 이해 · 지식 +2'}),
    choice('호족들의 군사력이 더 강해진다','ch02_policy_memory',{}, {},'노비가 줄어들면 호족이 동원할 노동력과 사병 기반도 약해진다.',{memoryKey:'ch02-nobi-purpose',memoryValue:{answer:'호족 군사력 강화',correct:false},playerResponse:'호족들의 군사력이 더 강해지나?',playerExpression:'worried',resultSceneId:'ch02-reason-wrong-power',resultIllustrationId:'ch02-freed-citizen'}),
    choice('왕의 힘이 약해진다','ch02_policy_memory',{}, {},'귀족은 반발하지만 정책의 방향은 왕권을 약화시키는 쪽이 아니었다.',{memoryKey:'ch02-nobi-purpose',memoryValue:{answer:'왕권 약화',correct:false},playerResponse:'왕의 힘이 약해지는 건가?',playerExpression:'worried',resultSceneId:'ch02-reason-wrong-king',resultIllustrationId:'ch02-freed-citizen'})
  ]}),
  ch02_policy_memory:ch02Scene({sceneId:'ch02_policy_memory',year:956,location:'역사 기억',title:'노비안검법',illustrationId:'ch02-freed-citizen',timeOfDay:'memory',dialogue:'억울하게 노비가 된 사람을 조사해 양인으로 회복시켰다.\n호족의 경제·군사 기반은 약해지고 세금·역 부담 대상인 양인은 늘었다.\n결과적으로 왕권 강화에 도움이 되었다.',quizId:'ch02-test-01'}),
  ch02_noble_night:ch02Scene({sceneId:'ch02_noble_night',year:956,location:'개경 · 도윤의 상점',title:'귀족의 분노',illustrationId:'ch02-nobles-night',timeOfDay:'night',ambientSound:'night-market',dialogue:'밤이 되자 도윤의 상점 안쪽에서 낮은 목소리가 새어 나왔다.',nextStoryId:'ch02_jump_958'}),
  ch02_jump_958:ch02Scene({sceneId:'ch02_jump_958',year:958,location:'시간의 흐름',title:'두 해 뒤',illustrationId:'ch02-exam-notice',timeOfDay:'dawn',sceneEffect:'blackout',autoAdvanceDelays:[900,1150,1400],continueLabel:'958년의 개경으로',cinematicStatus:'두 해가 흐르는 중…',cinematicSub:'왕은 새로운 사람을 찾았고, 한 청년은 그 문을 기다렸다.',enterCharacterStates:{doyun:{characterAge:66,characterEraVariant:'established-merchant',ageVariant:'elder_956',outfit:'established_merchant'},hyunwoo:{characterAge:23,characterEraVariant:'exam-candidate'}},dialogue:'노비안검법이 시행된 뒤 두 해가 흘렀다.\n왕은 집안이 아닌 실력으로 사람을 뽑을 준비를 했다.\n958년 — 개경',nextStoryId:'ch02_exam_notice'}),
  ch02_exam_notice:ch02Scene({sceneId:'ch02_exam_notice',year:958,location:'개경 · 관청 앞 거리',title:'새로운 시험, 현우의 꿈',illustrationId:'ch02-exam-notice',timeOfDay:'morning',dialogue:'지방 출신 현우는 큰 가문 배경 없이 공부로 관리가 되려 한다.',nextStoryId:'ch02_three_way'}),
  ch02_three_way:ch02Scene({sceneId:'ch02_three_way',year:958,location:'개경 · 도윤의 가게',title:'세 사람이 처음 웃은 날',illustrationId:'ch02-exam-notice',timeOfDay:'afternoon',sharedEvent:'three_friends_met',dialogue:'현실적인 도윤과 원칙적인 현우가 첫 만남부터 부딪히지만 금세 말이 통한다.',nextStoryId:'ch02_ssanggi'}),
  ch02_ssanggi:ch02Scene({sceneId:'ch02_ssanggi',year:958,location:'개경 · 관청 앞 거리',title:'후주에서 온 사람, 쌍기',illustrationId:'ch02-exam-notice',timeOfDay:'morning',dialogue:'과거제를 건의한 사람이 후주에서 온 쌍기라는 소문이 퍼졌다.',quizId:'ch02-test-02'}),
  ch02_exam_eve:ch02Scene({sceneId:'ch02_exam_eve',year:958,location:'개경 · 시험 전날 밤',title:'잠들지 못하는 현우',illustrationId:'ch02-nobles-night',timeOfDay:'night',dialogue:'시험 전날, 현우는 긴장해서 잠을 이루지 못한다.',choices:[
    choice('넌 충분히 준비했어','ch02_exam_day',{}, {hyunwoo:5},'현우는 자신이 해온 공부를 믿어 보기로 했다.',{trustChanges:{hyunwoo:5},sharedEvents:['supported_hyunwoo_exam'],importantChoice:'confidence',playerResponse:'넌 충분히 준비했어.',playerExpression:'smile',responseText:'그 말을 믿고 끝까지 써 보겠습니다.',responseCharacterId:'hyunwoo',responseExpression:'smile',resultSceneId:'ch02-exam-confidence',resultIllustrationId:'ch02-exam-yard',hint:'현우 +5 · 신뢰 +5'}),
    choice('떨어져도 다시 보면 되잖아','ch02_exam_day',{fame:1},{hyunwoo:3},'한 번의 결과가 인생의 전부가 아니라는 말에 현우의 숨이 고르게 돌아왔다.',{trustChanges:{hyunwoo:3},sharedEvents:['supported_hyunwoo_exam'],importantChoice:'perspective',playerResponse:'떨어져도 다시 보면 되잖아.',playerExpression:'neutral',responseText:'위로인지 자극인지 모르겠지만…… 마음은 편해졌습니다.',responseCharacterId:'hyunwoo',responseExpression:'smile',resultSceneId:'ch02-exam-perspective',resultIllustrationId:'ch02-exam-yard',hint:'명성 +1 · 현우 +3'}),
    choice('시험 전에 문제 하나 풀어볼래?','ch02_exam_day',{knowledge:1},{hyunwoo:4},'짧은 문답을 주고받으며 현우는 마지막으로 생각을 정리했다.',{trustChanges:{hyunwoo:4},sharedEvents:['supported_hyunwoo_exam'],importantChoice:'practice',playerResponse:'시험 전에 문제 하나 풀어볼래?',playerExpression:'thinking',responseText:'좋습니다. 마지막으로 머리를 깨워 보죠.',responseCharacterId:'hyunwoo',responseExpression:'smile',resultSceneId:'ch02-exam-practice',resultIllustrationId:'ch02-exam-yard',hint:'지식 +1 · 현우 +4'})
  ]}),
  ch02_exam_day:ch02Scene({sceneId:'ch02_exam_day',year:958,location:'개경 · 과거 시험장',title:'현우의 시험',illustrationId:'ch02-exam-yard',timeOfDay:'morning',dialogue:'수많은 응시자가 시험장으로 들어간다. 현우는 자신의 꿈을 걸고 문을 넘는다.',learningConceptIds:['쌍기_과거제','광종_왕권강화'],nextStoryId:'ch02_official_robes_walk'}),
  ch02_official_robes_walk:ch02Scene({sceneId:'ch02_official_robes_walk',year:960,location:'개경 · 관청 거리',title:'서로 다른 빛깔의 옷',illustrationId:'ch02-reign-titles',timeOfDay:'afternoon',enterCharacterStates:{doyun:{characterAge:68,characterEraVariant:'established-merchant',ageVariant:'elder_956',outfit:'established_merchant'}},dialogue:'과거 시험 뒤 다시 찾은 관청 거리. 관리들이 서로 다른 색의 옷을 입고 지나갔다.',learningConceptIds:['광종_공복'],nextStoryId:'ch02_hyunwoo_official'}),
  ch02_hyunwoo_official:ch02Scene({sceneId:'ch02_hyunwoo_official',year:960,location:'개경 · 관청 거리',title:'관리의 옷을 입은 현우',illustrationId:'ch02-gaegyeong-market',timeOfDay:'afternoon',enterCharacterStates:{hyunwoo:{characterAge:25,characterEraVariant:'young-official',ageVariant:'young',outfit:'young_official'}},historyDiscovery:{people:['현우'],cards:['gwangjong-official-robes'],historicalEvents:['gwangjong-official-robes']},historyCard:{title:'광종 — 공복 제정',body:'광종은 관리의 품계에 따라 공복의 색을 구분해 관료 질서를 드러냈다.'},dialogue:'관리의 옷을 입은 현우가 뒤에서 주인공을 불렀다.',learningConceptIds:['광종_공복','광종_왕권강화'],quizId:'ch02-test-robes'}),
  ch02_reign_titles:ch02Scene({sceneId:'ch02_reign_titles',year:960,location:'개경 · 상인 거리',title:'거리에서 들은 새 연호',illustrationId:'ch02-gaegyeong-market',timeOfDay:'afternoon',visibleCharacters:[],sceneType:'ambient-rumor',historyDiscovery:{cards:['gwangjong-gwangdeok'],historicalEvents:['gwangjong-reign-titles']},historyCard:{title:'광종 — 광덕',body:'광덕은 광종이 사용한 독자적 연호이다. 이후 준풍을 사용했다.'},dialogue:'개경의 상인들이 새 연호 광덕을 이야기한다.',learningConceptIds:['광덕_준풍','광종_왕권강화'],quizId:'ch02-test-03'}),
  ch02_reign_followup:ch02Scene({sceneId:'ch02_reign_followup',year:960,location:'개경 · 같은 상인 거리',title:'광덕에서 준풍으로',illustrationId:'ch02-gaegyeong-market',timeOfDay:'afternoon',visibleCharacters:[],sceneType:'ambient-rumor',historyDiscovery:{cards:['gwangjong-reign-titles'],historicalEvents:['gwangjong-reign-titles']},historyCard:{title:'광덕 → 준풍',body:'광종은 광덕에 이어 준풍이라는 독자적 연호를 사용해 왕의 권위를 드러냈다.'},dialogue:'같은 거리에서 연호가 준풍으로 바뀌었다는 이야기를 듣는다.',learningConceptIds:['광덕_준풍','광종_왕권강화'],quizId:'ch02-test-04'}),
  ch02_purge:ch02Scene({sceneId:'ch02_purge',year:960,location:'개경 · 도윤의 가게',title:'사라진 큰손',illustrationId:'ch02-doyun-shop-956',timeOfDay:'evening',fictionNotice:'길상·도윤·현우와 거래처 인물은 창작입니다. 광종이 호족과 공신 세력을 억누른 역사적 흐름을 학습 장면으로 구성했습니다.',dialogue:'길상이 찾아온 저녁, 도윤은 오래 거래하던 큰손 하나가 붙잡혀 갔다는 소식을 전했다.',learningConceptIds:['호족_견제','광종_왕권강화'],nextStoryId:'ch02_night_discussion'}),
  ch02_night_discussion:ch02Scene({sceneId:'ch02_night_discussion',year:960,location:'개경 · 도윤의 가게',title:'세 사람에게 일어난 변화',illustrationId:'ch02-doyun-shop-956',timeOfDay:'night',historyDiscovery:{cards:['gwangjong-authority'],historicalEvents:['gwangjong-authority']},historyCard:{title:'광종 — 왕권 강화',body:'노비안검법·과거제·공복·독자적 연호와 호족 견제는 왕권 강화라는 공통 방향으로 이어졌다.'},dialogue:'문을 닫은 뒤 길상과 현우, 도윤은 자신들의 삶이 어떻게 바뀌었는지 차례로 돌아보았다.',learningConceptIds:['광종_왕권강화','호족_견제'],quizId:'ch02-test-05'}),
  ch02_complete:ch02Scene({sceneId:'ch02_complete',year:960,location:'개경 · 도윤의 가게',title:'사십 년이 넘는 세월',illustrationId:'ch02-doyun-shop-956',timeOfDay:'sunset',dialogue:'왕의 개혁을 지나온 어느 저녁, 도윤이 처음 만난 날을 헤아렸다.',nextStoryId:'ch02_night_reflection'}),
  ch02_night_reflection:ch02Scene({sceneId:'ch02_night_reflection',year:960,location:'개경 밖 · 물가',title:'물에 비친 얼굴',illustrationId:'ch02-water-reflection-958',timeOfDay:'night',ambientSound:'water',dialogue:'도윤과 헤어진 뒤, 주인공은 달빛이 고인 물가에 홀로 앉았다.',nextStoryId:'ch02_mystery'}),
  ch02_mystery:ch02Scene({sceneId:'ch02_mystery',year:960,location:'알 수 없는 기억',title:'???',illustrationId:'ch02-water-reflection-958',timeOfDay:'night',sceneEffect:'blackout',continueLabel:'지나온 장면을 떠올린다',cinematicStatus:'기억을 더듬는 중…',cinematicSub:'답을 찾을 수 없는 질문 뒤로, 살아낸 역사가 떠올랐다.',mysteryKey:'unknown-aging',sharedEvent:'noticed_unchanged_appearance',dialogue:'사십 년이 넘었는데도, 내 얼굴은 그날과 같았다.\n이유는 떠오르지 않았다.\n다만 질문 하나가 남았다.\n나는 왜 변하지 않는 걸까.',nextStoryId:'ch02_memory_retrieval'}),
  ch02_memory_retrieval:ch02Scene({sceneId:'ch02_memory_retrieval',year:960,location:'살아온 기억',title:'각자의 삶을 바꾼 장면',illustrationId:'ch02-complete',timeOfDay:'memory',sceneEffect:'memory-overlay',dialogue:'길상과 노비안검법, 현우와 과거제·쌍기, 관청 거리의 공복, 시장의 광덕과 준풍이 차례로 떠올랐다.',learningConceptIds:['노비안검법','쌍기_과거제','광종_공복','광덕_준풍','광종_왕권강화'],quizId:'ch02-test-06'}),
  ch02_realization:ch02Scene({sceneId:'ch02_realization',year:960,location:'살아온 기억',title:'한 방향으로 이어진 정책',illustrationId:'ch02-complete',timeOfDay:'memory',dialogue:'법과 시험, 관리의 옷과 왕의 연호. 서로 다른 장면이 광종의 왕권 강화라는 한 방향으로 이어졌다.',learningConceptIds:['광종_개혁종합','광종_왕권강화'],nextStoryId:'ch02_chapter_clear'}),
  ch02_chapter_clear:ch02Scene({sceneId:'ch02_chapter_clear',year:960,location:'역사 기록',title:'왕의 나라',illustrationId:'ch02-complete',timeOfDay:'night',sceneEffect:'blackout',continueLabel:'CHAPTER CLEAR',cinematicStatus:'기억을 기록하는 중…',cinematicSub:'살아본 장면이 시험의 답으로 이어집니다.',completeChapter:true,dialogue:'CH.03 왕의 나라\n노비안검법 · 과거제 · 공복 · 광덕과 준풍\n광종 → 왕권 강화'})
};
Object.assign(STORIES,CH02_STORIES);
Object.assign(STORIES.ch02_policy_memory,{learningConceptIds:['노비안검법','광종_왕권강화'],historyDiscovery:{cards:['nobi-inspection'],historicalEvents:['gwangjong-956-nobi']},historyCard:{title:'광종 — 노비안검법',body:'억울하게 노비가 된 사람을 조사해 양인으로 회복시키고, 호족의 기반을 줄여 왕권 강화에 도움을 준 정책.'}});
Object.assign(STORIES.ch02_ssanggi,{learningConceptIds:['쌍기_과거제','광종_왕권강화'],historyDiscovery:{people:['쌍기'],cards:['gwageo-exam'],historicalEvents:['gwangjong-958-gwageo']},historyCard:{title:'광종 — 과거제',body:'광종은 쌍기의 건의를 받아 958년에 과거제를 시행해 새로운 관료를 선발했다.'}});

const CH02_DIALOGUES={
  ch02_transition:[
    dialogueLine('narrator','neutral','918년 — 고려 건국','narration'),
    dialogueLine('narrator','neutral','계절이 수십 번 바뀌었다.','narration'),
    dialogueLine('narrator','neutral','왕이 바뀌고, 거리의 지붕이 늘어났다.','narration'),
    dialogueLine('player','thinking','그리고 나는 아직 고려에 있다.','thought'),
    dialogueLine('narrator','neutral','949년 — 개경','narration')
  ],
  ch02_shop_exterior_949:[
    dialogueLine('narrator','neutral','전쟁의 흔적 위로 상점과 기와지붕이 빼곡하게 들어섰다.','narration'),
    dialogueLine('narrator','neutral','장터 한쪽에는 도윤이 수십 년 동안 일군 가게가 자리를 잡고 있었다.','narration'),
    dialogueLine('player','thinking','작은 좌판에서 시작했는데, 진짜 자기 가게를 만들었네.','thought')
  ],
  ch02_reunion_949:[
    dialogueLine('doyun','neutral','거기 멍하니 서 있지 말고 이 자루부터 옮기시오.'),
    dialogueLine('player','embarrassed','내가 네 일꾼이냐?'),
    dialogueLine('doyun','smile','내 가게에서 밥을 얻어먹은 세월이 얼마인데 새삼 그러시오?'),
    dialogueLine('player','embarrassed','……내가 도와준 것도 많거든.'),
    dialogueLine('doyun','smile','처음 보았을 때는 괴상한 옷을 입고 길바닥에 쓰러져 있던 사람이 말은 잘하는구려.'),
    dialogueLine('player','worried','진짜 그 얘기로 평생 놀릴 거야?'),
    dialogueLine('doyun','surprised','진짜?'),
    dialogueLine('player','embarrassed','아…… 정말로 그럴 거냐고.'),
    dialogueLine('doyun','smile','그럼 처음부터 정말이라고 하면 될 것을. 평생 놀릴 생각이오.'),
    dialogueLine('player','thinking','도윤의 머리에는 희끗한 빛이 늘었다. 웃는 얼굴만은 오래전 그대로였다.','thought')
  ],
  ch02_market:[
    dialogueLine('doyun','neutral','태조께서 돌아가신 뒤로 왕이 몇 번이나 바뀌었소.'),
    dialogueLine('player','neutral','세월이 정말 많이 흘렀네.'),
    dialogueLine('doyun','serious','이번 임금은 오래된 집안들을 그냥 두고 볼 분이 아닌 듯하오.'),
    dialogueLine('player','thinking','태조 왕건 다음 시대, 지금 고려의 왕은…….','thought')
  ],
  ch02_life_path:[
    dialogueLine('doyun','serious','가게 하나를 얻었다고 다 이룬 것은 아니오. 송악과 서경, 더 먼 곳의 물길까지 잇는 내 상단을 만들 것이오.'),
    dialogueLine('player','smile','여전히 꿈이 크네.'),
    dialogueLine('doyun','smile','꿈이 작아서야 장부를 펼칠 맛이 나겠소?'),
    dialogueLine('doyun','neutral','내 상단 이야기는 그렇다 치고, 자네는 앞으로 어떻게 살고 싶소?'),
    dialogueLine('player','thinking','나는 이제 이 시대의 구경꾼이 아니다. 고려에서 내 생활 기반을 만들어야 한다.','thought')
  ],
  ch02_jump_956:[
    dialogueLine('narrator','neutral','도윤의 가게에서 다시 일곱 번의 겨울을 보냈다.','narration'),
    dialogueLine('narrator','neutral','가게는 조금 더 자랐고, 도윤의 머리는 더 희어졌다.','narration'),
    dialogueLine('narrator','neutral','956년 — 개경','narration')
  ],
  ch02_shop_956:[
    dialogueLine('narrator','neutral','새로 들인 수레와 물건이 가게 앞을 채웠다.','narration'),
    dialogueLine('doyun','neutral','이 정도로는 상단이라 부르기도 민망하오.'),
    dialogueLine('player','smile','그 말, 칠 년 전에도 했어.'),
    dialogueLine('doyun','smile','그러니 아직 이루지 못한 게 아니겠소?'),
    dialogueLine('player','thinking','도윤은 나이를 먹었지만 꿈은 조금도 늙지 않았다.','thought')
  ],
  ch02_dispute:[
    dialogueLine('steward','angry','이 자는 우리 집 노비다!'),
    dialogueLine('freed_man','worried','아닙니다! 저는 원래 양인이었습니다!'),
    dialogueLine('doyun','surprised','잠깐 기다리시오.'),
    dialogueLine('player','surprised','왜?'),
    dialogueLine('doyun','worried','저 사람…… 아는 사람이오.'),
    dialogueLine('player','surprised','아는 사람이야?'),
    dialogueLine('doyun','serious','예전에 우리 아버지와 장사를 하던 집 사람이오. 전쟁 통에 가족과 헤어졌다고 들었는데…….'),
    dialogueLine('freed_man','worried','전쟁 중 붙잡혀 억울하게 노비가 되었습니다!'),
    dialogueLine('steward','angry','거짓말이다!')
  ],
  ch02_trust:[
    dialogueLine('doyun','serious','저 사람을 그냥 두고 갈 수는 없소.'),
    dialogueLine('player','worried','귀족 집안과 엮이는 일이야.'),
    dialogueLine('doyun','serious','그래도 어찌할지는 정해야 하오.')
  ],
  ch02_inspection:[
    dialogueLine('official','serious','폐하의 명이다.'),
    dialogueLine('official','serious','억울하게 노비가 된 자가 있는지 조사한다.'),
    dialogueLine('steward','serious','우리 집안의 문서가 여기 있소.'),
    dialogueLine('freed_man','worried','제 고향 사람들의 증언도 들어 주십시오.'),
    dialogueLine('player','surprised','왕이 직접 이런 걸?')
  ],
  ch02_policy_reason:[
    dialogueLine('official','serious','이 자는 본래 양인이었음이 확인되었다. 양인으로 돌아간다.'),
    dialogueLine('freed_man','smile','감사합니다…….'),
    dialogueLine('steward','angry','우리 집안의 사람을 왕이 마음대로 빼앗는단 말인가!'),
    dialogueLine('doyun','worried','아버지가 이 일을 보셨다면 마음을 놓으셨을 텐데.'),
    dialogueLine('player','neutral','그래도 네가 끝까지 와서 봤잖아.'),
    dialogueLine('player','thinking','잠깐. 노비가 줄어들면…….','thought')
  ],
  ch02_policy_memory:[
    dialogueLine('narrator','neutral','역사 기억 획득 · 노비안검법','narration'),
    dialogueLine('player','thinking','억울한 사람의 신분을 되찾게 하면서, 호족의 기반을 줄이고 왕의 힘을 키운 정책이구나.','thought')
  ],
  ch02_noble_night:[
    dialogueLine('noble','angry','왕이 우리 집안의 노비까지 건드리고 있다.'),
    dialogueLine('noble','suspicious','선왕 때부터 공을 세운 집안인데…… 우리를 믿지 않는다는 뜻인가?'),
    dialogueLine('doyun','serious','못 들은 척하시오.'),
    dialogueLine('player','surprised','왜?'),
    dialogueLine('doyun','worried','요즘 왕과 오래된 집안들 사이가 좋지 않소. 거래처 하나가 벌써 문을 닫았소.'),
    dialogueLine('player','worried','네가 만들려는 상단도 영향을 받겠네.'),
    dialogueLine('doyun','serious','그러니 더 버텨야지 않겠소.'),
    dialogueLine('player','thinking','노비를 풀어주는 것만이 목적이 아니구나. 기존 호족의 힘을 줄이려는 거야.','thought')
  ],
  ch02_jump_958:[
    dialogueLine('narrator','neutral','노비안검법이 시행된 뒤 두 해가 흘렀다.','narration'),
    dialogueLine('narrator','neutral','왕은 집안이 아닌 실력으로 사람을 뽑을 준비를 했다.','narration'),
    dialogueLine('narrator','neutral','958년 — 개경','narration')
  ],
  ch02_exam_notice:[
    dialogueLine('citizen','surprised','시험으로 관리를 뽑는다고?'),
    dialogueLine('citizen','surprised','집안이 아니라 시험으로?'),
    dialogueLine('hyunwoo','worried','저도 시험을 보려고 합니다. 지방 출신이라 기대어 볼 큰 집안은 없습니다.'),
    dialogueLine('player','surprised','무슨 시험?'),
    dialogueLine('hyunwoo','neutral','과거입니다.'),
    dialogueLine('player','thinking','……과거.'),
    dialogueLine('hyunwoo','neutral','왕께서 재주 있는 사람을 시험으로 뽑겠다고 하셨습니다. 관리가 되어 원칙을 지키는 것이 제 꿈입니다.')
  ],
  ch02_three_way:[
    dialogueLine('hyunwoo','neutral','저도 과거를 보려고 합니다.'),
    dialogueLine('doyun','surprised','붙으면 관리가 되는 게요?'),
    dialogueLine('hyunwoo','neutral','그렇겠지요.'),
    dialogueLine('doyun','smile','그럼 우리 같은 장사꾼 세금이나 좀 덜 걷게 해주시오.'),
    dialogueLine('hyunwoo','neutral','붙기도 전에 청탁입니까?'),
    dialogueLine('doyun','smile','미리 친해져 두자는 뜻이오.'),
    dialogueLine('player','smile','둘이 벌써 친해졌네.'),
    dialogueLine('hyunwoo','worried','친해졌다고요? 저는 방금 청탁을 거절한 것입니다.'),
    dialogueLine('doyun','smile','거절하면서도 웃었으니 절반은 된 셈이오.'),
    dialogueLine('player','smile','도윤아, 그 계산법으로 장사해도 괜찮은 거야?'),
    dialogueLine('doyun','surprised','도윤아?'),
    dialogueLine('player','embarrassed','친하면 그렇게 부르기도 해.'),
    dialogueLine('hyunwoo','smile','두 분은 참 오래된 벗인 듯합니다.'),
    dialogueLine('doyun','neutral','오래되기는 했소. 말버릇은 아직도 낯설지만.'),
    dialogueLine('player','smile','앞으로 셋이 자주 보자. 시험 붙고 모른 척하기 없기.'),
    dialogueLine('hyunwoo','smile','그 약속이라면 기꺼이 하겠습니다.')
  ],
  ch02_ssanggi:[
    dialogueLine('citizen','neutral','후주에서 온 쌍기라는 사람이 건의했다더군.'),
    dialogueLine('doyun','surprised','다른 나라에서 온 사람이 말이오?'),
    dialogueLine('citizen','neutral','그래. 시험으로 관리를 뽑자고 했다던데.'),
    dialogueLine('player','thinking','쌍기……. 이 이름도 시험에서 봤던 것 같다.','thought')
  ],
  ch02_exam_eve:[
    dialogueLine('narrator','neutral','시험 전날 밤, 현우의 방에는 늦도록 불이 꺼지지 않았다.','narration'),
    dialogueLine('hyunwoo','worried','눈을 감으면 외운 글이 전부 달아나는 것 같습니다.'),
    dialogueLine('doyun','neutral','시험 하나를 두고 무엇을 그리 떠는 게요.'),
    dialogueLine('hyunwoo','worried','장사만 하신 분이 제 마음을 어찌 아시겠소.'),
    dialogueLine('doyun','serious','장사는 날마다 치르는 시험이오.'),
    dialogueLine('player','thinking','현우에게 무슨 말을 해줘야 할까?','thought')
  ],
  ch02_exam_day:[
    dialogueLine('narrator','neutral','958년 · 개경 과거 시험장','narration'),
    dialogueLine('hyunwoo','worried','다녀오겠습니다.'),
    dialogueLine('doyun','smile','관리 나리 되더라도 우리 모른 척하면 안 되오.'),
    dialogueLine('hyunwoo','smile','붙기도 전에 또 청탁입니까?'),
    dialogueLine('player','thinking','호족 집안 출신이 아니어도 시험으로 관리가 될 수 있다. 왕은 자신에게 충성할 새로운 관료를 만들 수도 있겠구나.','thought'),
    dialogueLine('narrator','neutral','역사 기억 획득 · 958년 과거제 · 쌍기의 건의','narration')
  ],
  ch02_official_robes_walk:[
    dialogueLine('narrator','neutral','과거 시험이 끝난 뒤, 나는 혼자 개경 관청 거리를 걸었다.','narration'),
    dialogueLine('narrator','neutral','앞을 지나는 관리들의 옷은 같은 모양이 아니었다.','narration'),
    dialogueLine('player','thinking','색이 다르네. 장식도 조금씩 다르고.','thought'),
    dialogueLine('narrator','neutral','푸른빛과 붉은빛이 섞인 관복 행렬이 계단 아래를 지나갔다.','narration')
  ],
  ch02_hyunwoo_official:[
    dialogueLine('hyunwoo','smile','그렇게 빤히 보면 관리들이 부담스러워합니다.'),
    dialogueLine('player','surprised','현우? 그 옷은…….'),
    dialogueLine('hyunwoo','neutral','운이 좋았습니다. 과거를 거쳐 관직을 받았습니다.'),
    dialogueLine('player','smile','정말 관리가 됐구나.'),
    dialogueLine('hyunwoo','serious','그리고 저 옷의 색도 아무렇게나 정한 것이 아닙니다. 광종께서 품계에 따라 공복을 구분하셨습니다.'),
    dialogueLine('player','thinking','시험으로 사람을 뽑고, 옷으로 관리의 등급을 드러냈다. 새 관료 질서를 눈에 보이게 만든 거구나.','thought'),
    dialogueLine('narrator','neutral','[HISTORY DISCOVERED] 광종 — 공복 제정','narration')
  ],
  ch02_reign_titles:[
    dialogueLine('merchant','neutral','들었소?','npc','상인 A'),
    dialogueLine('merchant','neutral','무엇을 말이오?','npc','상인 B'),
    dialogueLine('merchant','serious','새 연호 말이오.','npc','상인 A'),
    dialogueLine('merchant','neutral','광덕이라던가?','npc','상인 B'),
    dialogueLine('player','thinking','광덕.','thought'),
    dialogueLine('player','thinking','광종…….','thought'),
    dialogueLine('narrator','neutral','[HISTORY DISCOVERED] 광종 — 광덕','narration')
  ],
  ch02_reign_followup:[
    dialogueLine('merchant','neutral','연호가 또 바뀌었다더군.','npc','상인 A'),
    dialogueLine('merchant','neutral','이번에는 준풍이랍니다.','npc','상인 B'),
    dialogueLine('player','thinking','준풍.','thought'),
    dialogueLine('player','thinking','광덕…… 준풍.','thought'),
    dialogueLine('player','thinking','둘 다 광종.','thought'),
    dialogueLine('narrator','neutral','[HISTORY DISCOVERED] 광덕 → 준풍','narration')
  ],
  ch02_purge:[
    dialogueLine('narrator','neutral','가게 문을 닫을 무렵, 길상이 조심스럽게 안으로 들어왔다.','narration'),
    dialogueLine('freed_man','worried','도윤 어른. 요즘 큰 집안 사람들이 붙잡혀 간다는 말이 사실입니까?'),
    dialogueLine('doyun','serious','오래 거래하던 큰손 하나도 문을 닫았소. 왕의 군사들이 데려갔다더군.'),
    dialogueLine('player','worried','정말 반역을 했대?'),
    dialogueLine('doyun','worried','그 속을 누가 알겠소. 다만 선왕 때부터 힘을 쥔 집안들이 예전 같지 않은 것은 분명하오.'),
    dialogueLine('hyunwoo','serious','길상, 당분간은 예전 주인집 근처에 가지 마십시오.'),
    dialogueLine('freed_man','worried','제가 자유를 되찾은 일 때문에 그 집안이 더 미움을 받는 것은 아닐까요?'),
    dialogueLine('hyunwoo','neutral','당신이 잘못한 것이 아닙니다. 억울하게 빼앗긴 신분을 되찾은 것이니까요.'),
    dialogueLine('player','thinking','길상이 풀려난 일과 큰 집안이 약해지는 일이 같은 방향으로 이어지고 있었다.','thought')
  ],
  ch02_night_discussion:[
    dialogueLine('doyun','neutral','가게 문은 잠갔소. 이제 천천히 이야기합시다.'),
    dialogueLine('freed_man','smile','저는 노비안검법 덕분에 다시 제 이름으로 살게 되었습니다.'),
    dialogueLine('hyunwoo','neutral','저는 과거 덕분에 집안이 아니라 시험을 거쳐 이 옷을 입었습니다.'),
    dialogueLine('doyun','serious','그 사이 오래된 큰 집안들은 사람과 재산을 잃고 힘이 줄었소.'),
    dialogueLine('player','thinking','길상의 자유, 현우의 관직, 약해진 호족. 따로 보였던 변화가 한곳을 향한다.','thought'),
    dialogueLine('hyunwoo','serious','왕께서는 오래된 세력에 기대지 않는 나라를 만들고 계십니다.'),
    dialogueLine('doyun','worried','힘이 한쪽으로 모이면 질서가 서기도 하지만, 두려워지는 사람도 생기지.'),
    dialogueLine('freed_man','worried','그래도 저는 되찾은 이름으로 조심히 살아가겠습니다.'),
    dialogueLine('narrator','neutral','[HISTORY DISCOVERED] 광종 — 왕권 강화','narration')
  ],
  ch02_complete:[
    dialogueLine('narrator','neutral','광종의 개혁이 나라를 흔든 어느 저녁, 장터가 드물게 조용했다.','narration'),
    dialogueLine('doyun','neutral','자네와 처음 만난 지도 사십 년이 넘었소.'),
    dialogueLine('player','surprised','벌써 그렇게 됐어?'),
    dialogueLine('doyun','smile','내 머리는 이리 희어지고 주름도 늘었는데, 자네는 참 변하질 않는군.'),
    dialogueLine('player','embarrassed','원래 좀 동안이야.'),
    dialogueLine('doyun','surprised','동안?'),
    dialogueLine('player','embarrassed','아무것도 아니야.'),
    dialogueLine('doyun','worried','……농으로 넘길 말은 아닌 듯하오.'),
    dialogueLine('player','thinking','도윤의 시선이 오래 내 얼굴에 머물렀다.','thought')
  ],
  ch02_night_reflection:[
    dialogueLine('narrator','neutral','그날 밤, 나는 달빛이 고인 물가에 홀로 앉았다.','narration'),
    dialogueLine('player','thinking','도윤은 늙었다. 시장의 아이들은 어른이 되었고, 왕도 여러 번 바뀌었다.','thought'),
    dialogueLine('player','thinking','그런데 물에 비친 내 얼굴은 사십 년 전 그날과 같았다.','thought'),
    dialogueLine('player','worried','……이게 말이 돼?','thought')
  ],
  ch02_mystery:[
    dialogueLine('player','thinking','기억 속 어디에도 답은 없었다.','thought'),
    dialogueLine('player','worried','나는 왜 변하지 않는 걸까.','thought'),
    dialogueLine('narrator','neutral','아직은 이름 붙일 수 없는 의문만 남았다.','narration')
  ],
  ch02_memory_retrieval:[
    dialogueLine('narrator','neutral','길상이 조사처에서 자기 이름을 되찾던 순간.','narration'),
    dialogueLine('narrator','neutral','현우가 쌍기의 이름을 되뇌며 과거 시험장으로 들어가던 순간.','narration'),
    dialogueLine('narrator','neutral','품계에 따라 달라진 관리의 공복.','narration'),
    dialogueLine('narrator','neutral','상인 거리에서 들은 광덕과 준풍.','narration'),
    dialogueLine('player','thinking','책에서 따로 외웠던 말들이 이제 사람의 얼굴과 장소로 돌아온다.','thought')
  ],
  ch02_realization:[
    dialogueLine('player','thinking','노비를 풀어 호족의 기반을 줄였다.','thought'),
    dialogueLine('player','thinking','과거로 새 관료를 뽑고, 공복으로 질서를 세웠다.','thought'),
    dialogueLine('player','thinking','광덕과 준풍으로 왕의 권위를 드러냈다.','thought'),
    dialogueLine('player','serious','광종 → 왕권 강화.','thought')
  ],
  ch02_chapter_clear:[
    dialogueLine('narrator','neutral','CH.03 왕의 나라','narration'),
    dialogueLine('narrator','neutral','노비안검법 · 과거제 · 공복 · 광덕과 준풍','narration'),
    dialogueLine('narrator','neutral','광종 → 왕권 강화','narration')
  ]
};
Object.assign(DIALOGUES,CH02_DIALOGUES);
Object.entries(CH02_DIALOGUES).forEach(([sceneId,dialogues])=>{STORIES[sceneId].dialogues=dialogues});
Object.values(CH02_STORIES).forEach(s=>{const asset=ASSETS[s.illustrationId]||ASSETS['home-goryeo'];s.backgroundImage=asset.src||null});
