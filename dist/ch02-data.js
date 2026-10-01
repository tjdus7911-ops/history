/* CH.02 왕의 나라 — CH.01 데이터와 저장 구조를 확장하는 독립 모듈 */
const CHAPTERS={
  ch01:{chapterId:'ch01',number:'01',title:'새로운 나라',subtitle:'918년, 고려 건국과 후삼국',startStoryId:'prologue',completeStoryId:'complete',questionCount:6},
  ch02:{chapterId:'ch02',number:'02',title:'왕의 나라',subtitle:'왕은 왜 자신의 사람들을 풀어주었을까',startStoryId:'ch02_transition',completeStoryId:'ch02_complete',questionCount:5}
};

Object.assign(ASSETS,{
  'ch02-gaegyeong-market':sceneArt('ch02-gaegyeong-market','949년, 전쟁이 끝난 뒤 성장한 개경 시장',['#536359','#b08352']),
  'ch02-slave-dispute':sceneArt('ch02-slave-dispute','노비 신분을 둘러싸고 충돌하는 시장 사람들',['#55463b','#a87452'],true),
  'ch02-freed-citizen':sceneArt('ch02-freed-citizen','문서 조사 뒤 양인 신분을 되찾는 남자',['#443d35','#9a7655'],true),
  'ch02-nobles-night':sceneArt('ch02-nobles-night','도윤의 상점에서 왕의 정책에 분노하는 귀족들',['#171f29','#796047'],true),
  'ch02-exam-notice':sceneArt('ch02-exam-notice','과거제 시행 소식이 퍼지는 개경 거리',['#536054','#aa8556']),
  'ch02-exam-yard':sceneArt('ch02-exam-yard','958년 개경의 과거 시험장',['#46554f','#a98458']),
  'ch02-reign-titles':sceneArt('ch02-reign-titles','광덕과 준풍 연호가 적힌 관청 문서와 깃발',['#283843','#a27b49'],true),
  'ch02-reflection':sceneArt('ch02-reflection','세월이 흘러도 변하지 않은 얼굴을 물에 비춰 보는 주인공',['#172536','#9a6f49'],true),
  'ch02-purge-night':sceneArt('ch02-purge-night','군사들이 귀족의 집으로 들어가는 긴장된 밤',['#111923','#684d3f'],true),
  'ch02-complete':sceneArt('ch02-complete','왕권이 강해진 고려의 수도 개경과 챕터 엔딩',['#172832','#b08b53'],true),
  'ch03-teaser':sceneArt('ch03-teaser','최승로가 성종에게 시무 28조를 올리는 궁궐 장면',['#171d26','#826344'],true)
});

Object.assign(PORTRAITS,{
  hyunwoo_neutral:portrait('hyunwoo','neutral','현우 · 온화하고 학구적인 기본 표정',['#42504a','#9a7957'],'assets/characters/hyunwoo_neutral.png'),
  hyunwoo_worried:portrait('hyunwoo','worried','현우 · 시험을 앞두고 긴장한 표정',['#3c4947','#816957'],'assets/characters/hyunwoo_worried.png'),
  hyunwoo_smile:portrait('hyunwoo','smile','현우 · 격려를 받고 안도하는 미소',['#46534b','#a47f59'],'assets/characters/hyunwoo_smile.png'),
  freed_man_worried:portrait('freed_man','worried','양인 출신 남자 · 억울함을 호소하는 표정',['#4e4338','#8b7057']),
  freed_man_smile:portrait('freed_man','smile','양인 출신 남자 · 신분을 되찾고 안도하는 표정',['#51473b','#a17c58']),
  steward_angry:portrait('steward','angry','귀족 집안 관리인 · 노비라고 주장하며 화난 표정',['#4c352f','#8e5848']),
  steward_serious:portrait('steward','serious','귀족 집안 관리인 · 문서를 내미는 굳은 표정',['#443932','#7c624e']),
  official_serious:portrait('official','serious','고려 관리 · 왕명을 집행하는 엄정한 표정',['#263b43','#92734d']),
  noble_angry:portrait('noble','angry','고려 귀족 · 정책에 반발하는 권위적인 표정',['#49302f','#8d5949']),
  noble_suspicious:portrait('noble','suspicious','고려 귀족 · 왕을 경계하며 낮게 말하는 표정',['#403231','#755447']),
  citizen_surprised:portrait('citizen','surprised','개경 사람 · 새로운 시험 소식에 놀란 표정',['#4e493b','#937954']),
  citizen_neutral:portrait('citizen','neutral','개경 사람 · 시장 소문을 전하는 표정',['#4b473b','#867157']),
  soldier_serious:portrait('soldier','serious','고려 군사 · 왕명을 수행하는 굳은 표정',['#27343b','#6f5c4b'])
});

Object.assign(CHARACTERS,{
  hyunwoo:{characterId:'hyunwoo',characterName:'현우',speakerType:'npc',portraitPrefix:'hyunwoo',characterAge:23,characterEraVariant:'exam-candidate',longTermGoal:'과거에 급제해 원칙을 지키는 관리가 되기'},
  freed_man:{characterId:'freed_man',characterName:'길상',speakerType:'npc',portraitPrefix:'freed_man'},
  steward:{characterId:'steward',characterName:'귀족 집안 관리인',speakerType:'npc',portraitPrefix:'steward'},
  official:{characterId:'official',characterName:'관리',speakerType:'npc',portraitPrefix:'official'},
  noble:{characterId:'noble',characterName:'귀족',speakerType:'npc',portraitPrefix:'noble'},
  citizen:{characterId:'citizen',characterName:'개경 사람',speakerType:'npc',portraitPrefix:'citizen'},
  soldier:{characterId:'soldier',characterName:'군사',speakerType:'npc',portraitPrefix:'soldier'}
});

QUESTIONS.push(
  question({questionId:'ch02-test-01',chapterId:'ch02',relatedSceneId:'ch02_policy_memory',relatedHistoricalEventId:'gwangjong-956-nobi',historicalEvent:'노비안검법과 왕권 강화',relatedIllustrationId:'ch02-freed-citizen',questionType:'사료·연계 정책형',difficulty:'중상',passage:'“본래 양인이었으나 전쟁과 혼란 속에서 억울하게 노비가 되었다고 호소하는 자들의 신분을 조사하도록 하라.”',question:'이 상황을 추진한 왕의 다른 정책으로 옳은 것은?',choices:['사심관 제도를 실시하였다.','과거제를 시행하였다.','12목에 지방관을 파견하였다.','전민변정도감을 설치하였다.','별무반을 조직하였다.'],answer:1,explanation:'자료는 광종의 노비안검법을 보여 줍니다. 광종은 쌍기의 건의를 받아들여 과거제를 시행해 새로운 관료를 선발했습니다.',examKeywords:['광종','노비안검법','과거제','왕권 강화'],rewardKnowledge:2,resumeStoryId:'ch02_noble_night'}),
  question({questionId:'ch02-test-02',chapterId:'ch02',relatedSceneId:'ch02_ssanggi',relatedHistoricalEventId:'gwangjong-958-gwageo',historicalEvent:'958년 과거제 시행',relatedIllustrationId:'ch02-exam-notice',questionType:'인물·정책 연결형',difficulty:'중',passage:'후주에서 고려로 온 인물이 광종에게 재능 있는 사람을 시험으로 뽑자고 건의하였다.',question:'이 인물과 정책의 연결로 옳은 것은?',choices:['쌍기 — 과거제','최승로 — 노비안검법','서희 — 과거제','강감찬 — 노비안검법','신돈 — 과거제'],answer:0,explanation:'후주 출신 쌍기는 광종에게 과거제 시행을 건의했습니다. 고려의 과거제는 958년에 처음 시행되었습니다.',examKeywords:['쌍기','과거제','958년','광종'],rewardKnowledge:2,resumeStoryId:'ch02_exam_eve'}),
  question({questionId:'ch02-test-03',chapterId:'ch02',relatedSceneId:'ch02_reign_titles',relatedHistoricalEventId:'gwangjong-reign-titles',historicalEvent:'광덕·준풍 연호',relatedIllustrationId:'ch02-reign-titles',questionType:'단서로 왕 판단형',difficulty:'중',passage:'노비안검법 · 광덕 · 준풍',question:'위 단서를 통해 알 수 있는 고려의 왕은?',choices:['태조','광종','성종','현종','공민왕'],answer:1,explanation:'노비안검법과 독자적 연호 광덕·준풍은 모두 광종을 가리키는 대표 단서입니다.',examKeywords:['광종','광덕','준풍','노비안검법'],rewardKnowledge:2,resumeStoryId:'ch02_reign_followup'}),
  question({questionId:'ch02-test-04',chapterId:'ch02',relatedSceneId:'ch02_reign_followup',relatedHistoricalEventId:'gwangjong-authority',historicalEvent:'광종의 왕권 강화 정책',relatedIllustrationId:'ch02-reign-titles',questionType:'왕 업적 구분형',difficulty:'중상',passage:'광종은 호족 세력을 견제하고 왕권을 강화하기 위한 여러 정책을 추진하였다.',question:'다음 중 광종의 정책에 해당하지 않는 것은?',choices:['노비안검법 시행','과거제 시행','광덕 연호 사용','준풍 연호 사용','12목에 지방관 파견'],answer:4,explanation:'12목에 지방관을 파견한 왕은 성종입니다. 노비안검법·과거제·광덕·준풍은 광종과 연결됩니다.',examKeywords:['광종과 성종 구분','12목','광덕','준풍'],rewardKnowledge:2,resumeStoryId:'ch02_unchanged'}),
  question({questionId:'ch02-test-05',chapterId:'ch02',relatedSceneId:'ch02_purge',relatedHistoricalEventId:'goryeo-early-kings',historicalEvent:'태조·광종·성종 업적 비교',relatedIllustrationId:'ch02-purge-night',questionType:'왕별 정책 연결형',difficulty:'상',passage:'고려 초기에는 왕조의 기반 마련, 왕권 강화, 유교 정치 체제 정비가 차례로 추진되었다.',question:'태조 → 광종 → 성종의 정책을 바르게 연결한 것은?',choices:['사심관 → 노비안검법 → 12목 지방관 파견','노비안검법 → 사심관 → 시무 28조 수용','12목 지방관 파견 → 과거제 → 기인 제도','과거제 → 시무 28조 수용 → 사심관','기인 제도 → 12목 지방관 파견 → 광덕 연호 사용'],answer:0,explanation:'태조는 사심관·기인 제도를 실시했고, 광종은 노비안검법·과거제를 시행했으며, 성종은 최승로의 건의를 받아들이고 12목에 지방관을 파견했습니다.',examKeywords:['태조 사심관','광종 노비안검법','성종 12목','왕별 업적'],rewardKnowledge:3,resumeStoryId:'ch02_complete'})
);

const ch02Scene=data=>scene({chapterId:'ch02',historicalEventId:'gwangjong-reforms',year:949,...data});
const CH02_STORIES={
  ch02_transition:ch02Scene({sceneId:'ch02_transition',location:'시간의 흐름',title:'그리고 새로운 왕이 즉위했다',illustrationId:'ch02-gaegyeong-market',timeOfDay:'dawn',sceneEffect:'fade-in',enterCharacterStates:{player:{characterAge:23,characterEraVariant:'unchanged'},doyun:{characterAge:30,characterEraVariant:'established-young-merchant'}},dialogue:'고려가 후삼국을 통일한 뒤, 시간이 흘렀다.\n왕건이 세상을 떠나고 왕위는 몇 차례 바뀌었다.\n그리고 새로운 왕이 즉위했다.\n\n949년 · 개경\nCH.02 왕의 나라',nextStoryId:'ch02_market'}),
  ch02_market:ch02Scene({sceneId:'ch02_market',location:'개경 · 시장',title:'몇 년을 함께 산 사이',illustrationId:'ch02-gaegyeong-market',timeOfDay:'afternoon',ambientSound:'market',dialogue:'개경에서 도윤과 부딪치며 살아온 세월이 쌓였다. 도윤은 이제 자기 상단을 꿈꾼다.',choices:[
    choice('광종','ch02_life_path',{knowledge:1},{},'맞아. 광종. 기억이 선명해졌다.',{flags:{ch02KingMemory:'gwangjong'},memoryKey:'ch02-king-after-taejo',memoryValue:{answer:'광종',correct:true},playerResponse:'광종.',playerExpression:'thinking',responseText:'그래. 지금 왕은 광종이야.',responseCharacterId:'doyun',responseExpression:'neutral',resultSceneId:'ch02-memory-gwangjong',resultIllustrationId:'ch02-gaegyeong-market',hint:'기억 +1'}),
    choice('성종','ch02_life_path',{}, {},'이름이 비슷하게 섞인다. 조금 더 지켜보자.',{flags:{ch02KingMemory:'seongjong'},memoryKey:'ch02-king-after-taejo',memoryValue:{answer:'성종',correct:false},playerResponse:'성종……?',playerExpression:'worried',responseText:'표정을 보니 확신은 없어 보이는데.',responseCharacterId:'doyun',responseExpression:'suspicious',resultSceneId:'ch02-memory-seongjong',resultIllustrationId:'ch02-gaegyeong-market'}),
    choice('공민왕','ch02_life_path',{}, {},'아직 훨씬 뒤의 왕이다. 조금 더 지켜보자.',{flags:{ch02KingMemory:'gongmin'},memoryKey:'ch02-king-after-taejo',memoryValue:{answer:'공민왕',correct:false},playerResponse:'공민왕……?',playerExpression:'worried',responseText:'처음 듣는 이름인데.',responseCharacterId:'doyun',responseExpression:'surprised',resultSceneId:'ch02-memory-gongmin',resultIllustrationId:'ch02-gaegyeong-market'}),
    choice('현종','ch02_life_path',{}, {},'순서가 조금 섞였다. 눈앞의 사건을 더 살펴보자.',{flags:{ch02KingMemory:'hyeonjong'},memoryKey:'ch02-king-after-taejo',memoryValue:{answer:'현종',correct:false},playerResponse:'현종……?',playerExpression:'worried',responseText:'그런 이름의 왕은 아직 없었어.',responseCharacterId:'doyun',responseExpression:'surprised',resultSceneId:'ch02-memory-hyeonjong',resultIllustrationId:'ch02-gaegyeong-market'})
  ]}),
  ch02_life_path:ch02Scene({sceneId:'ch02_life_path',location:'개경 · 도윤의 가게 앞',title:'고려에서 나의 자리',illustrationId:'ch02-gaegyeong-market',timeOfDay:'afternoon',dialogue:'도윤은 상단을 만들 준비를 시작했다. 주인공도 이 시대에서 어떤 기반을 만들지 정해야 한다.',choices:[
    choice('도윤의 장사를 계속 돕는다','ch02_dispute',{wealth:4},{doyun:4},'함께 장부와 짐을 맡으며 도윤의 작은 가게를 키우기로 했다.',{lifePath:'doyun-merchant-partner',trustChanges:{doyun:3},sharedEvents:['helped_doyun_business'],importantChoice:'merchant-partner',playerResponse:'네 상단이 생길 때까지 같이 해볼게.',playerExpression:'smile',responseText:'말 바꾸기 없기다.',responseCharacterId:'doyun',responseExpression:'smile',resultSceneId:'ch02-life-merchant',resultIllustrationId:'ch02-gaegyeong-market',hint:'재산 +4 · 도윤 +4 · 신뢰 +3'}),
    choice('독립해서 내 일을 찾는다','ch02_dispute',{wealth:2,fame:2},{doyun:1},'도윤의 곁을 떠나지는 않되, 스스로 품삯을 구하고 이름을 알리기로 했다.',{lifePath:'independent-worker',trustChanges:{doyun:1},importantChoice:'independent',playerResponse:'나도 내 힘으로 할 일을 찾아볼래.',playerExpression:'serious',responseText:'그래. 대신 굶으면 바로 와.',responseCharacterId:'doyun',responseExpression:'neutral',resultSceneId:'ch02-life-independent',resultIllustrationId:'ch02-gaegyeong-market',hint:'재산 +2 · 명성 +2'}),
    choice('글과 제도를 더 공부한다','ch02_dispute',{knowledge:2},{doyun:1},'장터 일 사이사이에 글을 배우며 관청과 제도를 이해하기 시작했다.',{lifePath:'learning',importantChoice:'learning',playerResponse:'나는 공부를 좀 더 해볼게.',playerExpression:'thinking',responseText:'장부도 더 잘 봐주겠네.',responseCharacterId:'doyun',responseExpression:'smile',resultSceneId:'ch02-life-learning',resultIllustrationId:'ch02-gaegyeong-market',hint:'지식 +2'})
  ]}),
  ch02_dispute:ch02Scene({sceneId:'ch02_dispute',year:956,location:'개경 · 시장 한복판',title:'도윤이 아는 사람',illustrationId:'ch02-slave-dispute',timeOfDay:'afternoon',dialogue:'시장 한쪽에서 길상과 귀족 집안의 관리인이 거칠게 맞선다. 도윤은 아버지와 거래하던 집안 사람을 알아본다.',nextStoryId:'ch02_trust'}),
  ch02_trust:ch02Scene({sceneId:'ch02_trust',year:956,location:'개경 · 시장 한복판',title:'그냥 두고 갈 수는 없어',illustrationId:'ch02-slave-dispute',timeOfDay:'afternoon',dialogue:'도윤은 길상을 돕겠다고 한다. 선택은 역사적 결과가 아니라 두 사람의 관계와 위험을 바꾼다.',choices:[
    choice('알겠어. 같이 도와주자','ch02_inspection',{health:-5,fame:2},{doyun:7,citizens:3},'위험을 감수하고 증언자를 직접 찾아 나섰다.',{trustChanges:{doyun:6},sharedEvents:['helped_doyun_friend'],importantChoice:'helped-directly',flags:{nobiIncidentApproach:'direct'},resultDialogues:[dialogueLine('player','serious','알겠어. 같이 도와주자.'),dialogueLine('doyun','worried','고맙다. 그런데 무작정 뛰어들지는 마.'),dialogueLine('player','surprised','도와주자며.'),dialogueLine('doyun','serious','죽으라고 한 적은 없어.'),dialogueLine('narrator','neutral','둘은 길상의 고향 사람을 찾아 증언을 모았다.','narration')],resultSceneId:'ch02-trust-help',resultIllustrationId:'ch02-slave-dispute',hint:'위험 감수 · 도윤 +7 · 신뢰 +6'}),
    choice('잠깐. 먼저 증거부터 찾아보자','ch02_inspection',{knowledge:2},{doyun:3},'감정보다 기록을 앞세워 오래된 거래 장부와 호적의 흔적을 찾았다.',{trustChanges:{doyun:4},sharedEvents:['helped_doyun_friend'],importantChoice:'investigated-evidence',flags:{nobiIncidentApproach:'evidence'},resultDialogues:[dialogueLine('player','thinking','잠깐. 먼저 증거부터 찾아보자.'),dialogueLine('doyun','serious','답답하긴 해도…… 네 말이 맞아. 저쪽도 문서를 들고 올 테니까.'),dialogueLine('narrator','neutral','도윤 아버지의 옛 거래 장부가 길상의 신분을 밝힐 단서가 되었다.','narration')],resultSceneId:'ch02-trust-evidence',resultIllustrationId:'chapter-02-teaser',hint:'지식 +2 · 신뢰 +4'}),
    choice('괜히 귀족 집안과 엮이면 위험해','ch02_inspection',{wealth:2},{doyun:-4},'가게를 지키며 멀리서 상황을 관찰했지만 둘 사이에는 어색한 침묵이 남았다.',{trustChanges:{doyun:-5},importantChoice:'watched-safely',flags:{nobiIncidentApproach:'safe'},resultDialogues:[dialogueLine('player','worried','괜히 귀족 집안과 엮이면 위험해.'),dialogueLine('doyun','angry','넌 가끔 이상할 정도로 사람 일에 무심해.'),dialogueLine('player','serious','죽을 수도 있는 일이야.'),dialogueLine('doyun','serious','그래서 모른 척하자고?'),dialogueLine('narrator','neutral','둘은 한동안 말없이 조사처까지 걸었다.','narration')],resultSceneId:'ch02-trust-safe',resultIllustrationId:'ch02-slave-dispute',hint:'안전 관찰 · 재산 +2 · 도윤 −4'}),
  ]}),
  ch02_inspection:ch02Scene({sceneId:'ch02_inspection',year:956,location:'개경 · 신분 조사처',title:'폐하의 명이다',illustrationId:'chapter-02-teaser',timeOfDay:'evening',dialogue:'관리가 오래된 호적과 증언을 대조한다.',nextStoryId:'ch02_policy_reason'}),
  ch02_policy_reason:ch02Scene({sceneId:'ch02_policy_reason',year:956,location:'개경 · 신분 조사처 앞',title:'양인으로 돌아가다',illustrationId:'ch02-freed-citizen',timeOfDay:'sunset',dialogue:'조사 끝에 남자가 본래 양인이었다는 사실이 확인되었다.',choices:[
    choice('호족들이 거느리는 사람이 줄어든다','ch02_policy_memory',{knowledge:2},{citizens:3},'노비를 풀어 주면 호족의 경제·군사 기반은 약해지고 국가가 파악하는 양인은 늘어난다.',{flags:{understandsNobi:true},memoryKey:'ch02-nobi-purpose',memoryValue:{answer:'호족 기반 약화',correct:true},playerResponse:'호족들이 거느리는 사람이 줄어들어.',playerExpression:'thinking',resultSceneId:'ch02-reason-correct',resultIllustrationId:'ch02-freed-citizen',hint:'핵심 이해 · 지식 +2'}),
    choice('호족들의 군사력이 더 강해진다','ch02_policy_memory',{}, {},'노비가 줄어들면 호족이 동원할 노동력과 사병 기반도 약해진다.',{memoryKey:'ch02-nobi-purpose',memoryValue:{answer:'호족 군사력 강화',correct:false},playerResponse:'호족들의 군사력이 더 강해지나?',playerExpression:'worried',resultSceneId:'ch02-reason-wrong-power',resultIllustrationId:'ch02-freed-citizen'}),
    choice('왕의 힘이 약해진다','ch02_policy_memory',{}, {},'귀족은 반발하지만 정책의 방향은 왕권을 약화시키는 쪽이 아니었다.',{memoryKey:'ch02-nobi-purpose',memoryValue:{answer:'왕권 약화',correct:false},playerResponse:'왕의 힘이 약해지는 건가?',playerExpression:'worried',resultSceneId:'ch02-reason-wrong-king',resultIllustrationId:'ch02-freed-citizen'})
  ]}),
  ch02_policy_memory:ch02Scene({sceneId:'ch02_policy_memory',year:956,location:'역사 기억',title:'노비안검법',illustrationId:'ch02-freed-citizen',timeOfDay:'memory',dialogue:'억울하게 노비가 된 사람을 조사해 양인으로 회복시켰다.\n호족의 경제·군사 기반은 약해지고 세금·역 부담 대상인 양인은 늘었다.\n결과적으로 왕권 강화에 도움이 되었다.',quizId:'ch02-test-01'}),
  ch02_noble_night:ch02Scene({sceneId:'ch02_noble_night',year:956,location:'개경 · 도윤의 상점',title:'귀족의 분노',illustrationId:'ch02-nobles-night',timeOfDay:'night',ambientSound:'night-market',dialogue:'밤이 되자 도윤의 상점 안쪽에서 낮은 목소리가 새어 나왔다.',nextStoryId:'ch02_exam_notice'}),
  ch02_exam_notice:ch02Scene({sceneId:'ch02_exam_notice',year:958,location:'개경 · 관청 앞 거리',title:'새로운 시험, 현우의 꿈',illustrationId:'ch02-exam-notice',timeOfDay:'morning',dialogue:'지방 출신 현우는 큰 가문 배경 없이 공부로 관리가 되려 한다.',nextStoryId:'ch02_three_way'}),
  ch02_three_way:ch02Scene({sceneId:'ch02_three_way',year:958,location:'개경 · 도윤의 가게',title:'세 사람이 처음 웃은 날',illustrationId:'ch02-exam-notice',timeOfDay:'afternoon',sharedEvent:'three_friends_met',dialogue:'현실적인 도윤과 원칙적인 현우가 첫 만남부터 부딪히지만 금세 말이 통한다.',nextStoryId:'ch02_ssanggi'}),
  ch02_ssanggi:ch02Scene({sceneId:'ch02_ssanggi',year:958,location:'개경 · 관청 앞 거리',title:'후주에서 온 사람, 쌍기',illustrationId:'ch02-exam-notice',timeOfDay:'morning',dialogue:'과거제를 건의한 사람이 후주에서 온 쌍기라는 소문이 퍼졌다.',quizId:'ch02-test-02'}),
  ch02_exam_eve:ch02Scene({sceneId:'ch02_exam_eve',year:958,location:'개경 · 시험 전날 밤',title:'잠들지 못하는 현우',illustrationId:'ch02-nobles-night',timeOfDay:'night',dialogue:'시험 전날, 현우는 긴장해서 잠을 이루지 못한다.',choices:[
    choice('넌 충분히 준비했어','ch02_exam_day',{}, {hyunwoo:5},'현우는 자신이 해온 공부를 믿어 보기로 했다.',{trustChanges:{hyunwoo:5},sharedEvents:['supported_hyunwoo_exam'],importantChoice:'confidence',playerResponse:'넌 충분히 준비했어.',playerExpression:'smile',responseText:'그 말을 믿고 끝까지 써 보겠습니다.',responseCharacterId:'hyunwoo',responseExpression:'smile',resultSceneId:'ch02-exam-confidence',resultIllustrationId:'ch02-exam-yard',hint:'현우 +5 · 신뢰 +5'}),
    choice('떨어져도 다시 보면 되잖아','ch02_exam_day',{fame:1},{hyunwoo:3},'한 번의 결과가 인생의 전부가 아니라는 말에 현우의 숨이 고르게 돌아왔다.',{trustChanges:{hyunwoo:3},sharedEvents:['supported_hyunwoo_exam'],importantChoice:'perspective',playerResponse:'떨어져도 다시 보면 되잖아.',playerExpression:'neutral',responseText:'위로인지 자극인지 모르겠지만…… 마음은 편해졌습니다.',responseCharacterId:'hyunwoo',responseExpression:'smile',resultSceneId:'ch02-exam-perspective',resultIllustrationId:'ch02-exam-yard',hint:'명성 +1 · 현우 +3'}),
    choice('시험 전에 문제 하나 풀어볼래?','ch02_exam_day',{knowledge:1},{hyunwoo:4},'짧은 문답을 주고받으며 현우는 마지막으로 생각을 정리했다.',{trustChanges:{hyunwoo:4},sharedEvents:['supported_hyunwoo_exam'],importantChoice:'practice',playerResponse:'시험 전에 문제 하나 풀어볼래?',playerExpression:'thinking',responseText:'좋습니다. 마지막으로 머리를 깨워 보죠.',responseCharacterId:'hyunwoo',responseExpression:'smile',resultSceneId:'ch02-exam-practice',resultIllustrationId:'ch02-exam-yard',hint:'지식 +1 · 현우 +4'})
  ]}),
  ch02_exam_day:ch02Scene({sceneId:'ch02_exam_day',year:958,location:'개경 · 과거 시험장',title:'현우의 시험',illustrationId:'ch02-exam-yard',timeOfDay:'morning',dialogue:'수많은 응시자가 시험장으로 들어간다. 현우는 자신의 꿈을 걸고 문을 넘는다.',nextStoryId:'ch02_reign_titles'}),
  ch02_reign_titles:ch02Scene({sceneId:'ch02_reign_titles',year:960,location:'개경 · 관청 거리',title:'왕의 이름',illustrationId:'ch02-reign-titles',timeOfDay:'afternoon',dialogue:'관청 앞 깃발과 새 문서에 준풍이라는 연호가 쓰이기 시작했다.',quizId:'ch02-test-03'}),
  ch02_reign_followup:ch02Scene({sceneId:'ch02_reign_followup',year:960,location:'역사 기억',title:'광덕에서 준풍으로',illustrationId:'ch02-reign-titles',timeOfDay:'memory',dialogue:'광종은 독자적인 연호인 광덕과 준풍을 사용했다.\n왕의 권위를 높이고 왕권 강화를 드러내는 대표적인 단서다.',quizId:'ch02-test-04'}),
  ch02_unchanged:ch02Scene({sceneId:'ch02_unchanged',year:960,location:'개경 · 해 질 무렵',title:'너만 그대로야',illustrationId:'ch02-reign-titles',timeOfDay:'sunset',dialogue:'도윤은 오래 보아 온 주인공의 얼굴에서 이상한 점을 발견한다.',nextStoryId:'ch02_reflection'}),
  ch02_reflection:ch02Scene({sceneId:'ch02_reflection',year:960,location:'개경 · 고요한 물가',title:'알 수 없는 기억',illustrationId:'ch02-reflection',timeOfDay:'dusk',sceneEffect:'mystery-reflection',mysteryKey:'unknown-aging',sharedEvent:'noticed_unchanged_appearance',dialogue:'물에 비친 얼굴은 처음 고려에 떨어졌던 날과 다르지 않다. 이유는 아직 알 수 없다.',nextStoryId:'ch02_purge'}),
  ch02_purge:ch02Scene({sceneId:'ch02_purge',year:960,location:'개경 · 어두운 골목',title:'왕이 두려워지기 시작했다',illustrationId:'ch02-purge-night',timeOfDay:'night',ambientSound:'heavy-knocking',sceneEffect:'shake',dialogue:'깊은 밤, 군사들이 귀족의 집 문을 두드린다.',quizId:'ch02-test-05'}),
  ch02_complete:ch02Scene({sceneId:'ch02_complete',year:960,location:'CHAPTER 02 COMPLETE',title:'왕의 나라',illustrationId:'ch02-complete',timeOfDay:'dawn',dialogue:'두 번째 고려 생활을 마쳤습니다.'})
};
Object.assign(STORIES,CH02_STORIES);

const CH02_DIALOGUES={
  ch02_transition:[
    dialogueLine('narrator','neutral','고려가 후삼국을 통일한 뒤, 시간이 흘렀다.','narration'),
    dialogueLine('narrator','neutral','왕건이 세상을 떠나고 왕위는 몇 차례 바뀌었다.','narration'),
    dialogueLine('narrator','neutral','그리고 새로운 왕이 즉위했다.','narration'),
    dialogueLine('narrator','neutral','949년 · 개경\nCH.02 왕의 나라','narration')
  ],
  ch02_market:[
    dialogueLine('doyun','neutral','거기 멍하니 서 있지 말고 이것 좀 들어.'),
    dialogueLine('player','embarrassed','내가 네 일꾼이냐?'),
    dialogueLine('doyun','smile','내 집에서 밥 얻어먹은 게 몇 년인데?'),
    dialogueLine('player','embarrassed','……그건 그렇지.'),
    dialogueLine('doyun','smile','처음 봤을 때는 무슨 괴상한 옷을 입고 쓰러져 있더니.'),
    dialogueLine('player','worried','또 그 얘기야?'),
    dialogueLine('doyun','smile','평생 놀려먹을 건데?'),
    dialogueLine('doyun','serious','그래도 장난만 치고 살 순 없지. 언젠가는 내 이름을 건 상단을 만들 거야.'),
    dialogueLine('player','smile','그래서 요즘 그렇게 돈을 모으는 거구나.'),
    dialogueLine('player','thinking','후삼국이 통일되고 시간이 흘렀다. 그리고 지금 고려의 왕은…….','thought')
  ],
  ch02_life_path:[
    dialogueLine('doyun','neutral','내 상단 이야기는 그렇고, 넌 어떻게 살고 싶은데?'),
    dialogueLine('player','thinking','나는 이제 이 시대의 구경꾼이 아니다. 고려에서 내 생활 기반을 만들어야 한다.','thought')
  ],
  ch02_dispute:[
    dialogueLine('steward','angry','이 자는 우리 집 노비다!'),
    dialogueLine('freed_man','worried','아닙니다! 저는 원래 양인이었습니다!'),
    dialogueLine('doyun','surprised','잠깐.'),
    dialogueLine('player','surprised','왜?'),
    dialogueLine('doyun','worried','저 사람…… 알아.'),
    dialogueLine('player','surprised','아는 사람이야?'),
    dialogueLine('doyun','serious','예전에 우리 아버지와 장사를 하던 집 사람이야. 전쟁 통에 가족과 헤어졌다고 들었는데…….'),
    dialogueLine('freed_man','worried','전쟁 중 붙잡혀 억울하게 노비가 되었습니다!'),
    dialogueLine('steward','angry','거짓말이다!')
  ],
  ch02_trust:[
    dialogueLine('doyun','serious','저 사람을 그냥 두고 갈 수는 없어.'),
    dialogueLine('player','worried','귀족 집안과 엮이는 일이야.'),
    dialogueLine('doyun','serious','그래도 선택해야 해.')
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
    dialogueLine('doyun','worried','아버지가 이걸 봤으면 마음을 놓았을 텐데.'),
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
    dialogueLine('doyun','serious','못 들은 척해.'),
    dialogueLine('player','surprised','왜?'),
    dialogueLine('doyun','worried','요즘 왕과 오래된 집안들 사이가 좋지 않아. 거래처 하나가 벌써 문을 닫았어.'),
    dialogueLine('player','worried','네가 만들려는 상단도 영향을 받겠네.'),
    dialogueLine('doyun','serious','그러니까 더 버텨야지.'),
    dialogueLine('player','thinking','노비를 풀어주는 것만이 목적이 아니구나. 기존 호족의 힘을 줄이려는 거야.','thought')
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
    dialogueLine('doyun','surprised','붙으면 관리 되는 거요?'),
    dialogueLine('hyunwoo','neutral','그렇겠지요.'),
    dialogueLine('doyun','smile','그럼 우리 같은 장사꾼 세금이나 좀 덜 걷게 해주시오.'),
    dialogueLine('hyunwoo','neutral','붙기도 전에 청탁입니까?'),
    dialogueLine('doyun','smile','미리 친해져 두자는 거지.'),
    dialogueLine('player','smile','둘이 벌써 친해졌네.')
  ],
  ch02_ssanggi:[
    dialogueLine('citizen','neutral','후주에서 온 쌍기라는 사람이 건의했다더군.'),
    dialogueLine('doyun','surprised','외국에서 온 사람이?'),
    dialogueLine('citizen','neutral','그래. 시험으로 관리를 뽑자고 했다던데.'),
    dialogueLine('player','thinking','쌍기……. 이 이름도 시험에서 봤던 것 같다.','thought')
  ],
  ch02_exam_eve:[
    dialogueLine('narrator','neutral','시험 전날 밤, 현우의 방에는 늦도록 불이 꺼지지 않았다.','narration'),
    dialogueLine('hyunwoo','worried','눈을 감으면 외운 글이 전부 달아나는 것 같습니다.'),
    dialogueLine('doyun','neutral','시험 하나 가지고 뭘 그렇게 떨어.'),
    dialogueLine('hyunwoo','worried','장사밖에 모르는 사람이 뭘 압니까.'),
    dialogueLine('doyun','serious','장사는 매일 시험이야.'),
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
  ch02_reign_titles:[
    dialogueLine('citizen','neutral','이번에는 준풍이라는 연호를 쓴다더군.'),
    dialogueLine('player','surprised','준풍?'),
    dialogueLine('doyun','neutral','그전에는 광덕이었지.'),
    dialogueLine('player','thinking','광종 → 광덕 → 준풍. 왕권 강화를 보여 주는 단서야.','thought'),
    dialogueLine('narrator','neutral','역사 기억 획득 · 광덕 · 준풍','narration')
  ],
  ch02_reign_followup:[
    dialogueLine('narrator','neutral','광종은 독자적인 연호 광덕과 준풍을 사용했다.','narration'),
    dialogueLine('player','serious','왕의 권위를 스스로 드러낸 것이구나.','thought')
  ],
  ch02_unchanged:[
    dialogueLine('doyun','suspicious','근데 너 이상한 거 알아?'),
    dialogueLine('player','surprised','뭐가?'),
    dialogueLine('doyun','serious','너 처음 만났을 때랑 똑같이 생겼어.'),
    dialogueLine('player','smile','너도 별로 안 변했거든?'),
    dialogueLine('doyun','worried','난 변했어.'),
    dialogueLine('narrator','neutral','짧은 정적이 흘렀다.','narration'),
    dialogueLine('doyun','serious','너만 그대로야.')
  ],
  ch02_reflection:[
    dialogueLine('narrator','neutral','사람들이 잠든 뒤, 물가에 홀로 앉았다.','narration'),
    dialogueLine('player','thinking','그러고 보니…….','thought'),
    dialogueLine('player','worried','몇 년이 지났는데.','thought'),
    dialogueLine('player','serious','나는 왜 그대로지?','thought'),
    dialogueLine('narrator','neutral','[ 알 수 없는 기억 · ??? ]','narration')
  ],
  ch02_purge:[
    dialogueLine('soldier','serious','문을 열어라!'),
    dialogueLine('doyun','worried','……보지 마.'),
    dialogueLine('player','surprised','무슨 일이야?'),
    dialogueLine('doyun','serious','왕에게 반역을 꾀했다는 사람들이 잡혀가고 있어.'),
    dialogueLine('player','worried','저 사람들이 정말 반역을 했어?'),
    dialogueLine('doyun','worried','……누가 알겠어.'),
    dialogueLine('player','thinking','왕은 호족을 견제하고 권력을 강화했다. 하지만 그 과정이 항상 평온했던 것은 아니다.','thought')
  ],
  ch02_complete:[dialogueLine('narrator','neutral','두 번째 고려 생활을 마쳤습니다.','narration')]
};
Object.assign(DIALOGUES,CH02_DIALOGUES);
Object.entries(CH02_DIALOGUES).forEach(([sceneId,dialogues])=>{STORIES[sceneId].dialogues=dialogues});
Object.values(CH02_STORIES).forEach(s=>{const asset=ASSETS[s.illustrationId]||ASSETS['home-goryeo'];s.backgroundImage=asset.src||null});
