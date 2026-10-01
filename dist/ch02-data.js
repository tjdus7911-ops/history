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
  hyunwoo:{characterId:'hyunwoo',characterName:'현우',speakerType:'npc',portraitPrefix:'hyunwoo'},
  freed_man:{characterId:'freed_man',characterName:'남자',speakerType:'npc',portraitPrefix:'freed_man'},
  steward:{characterId:'steward',characterName:'귀족 집안 관리인',speakerType:'npc',portraitPrefix:'steward'},
  official:{characterId:'official',characterName:'관리',speakerType:'npc',portraitPrefix:'official'},
  noble:{characterId:'noble',characterName:'귀족',speakerType:'npc',portraitPrefix:'noble'},
  citizen:{characterId:'citizen',characterName:'개경 사람',speakerType:'npc',portraitPrefix:'citizen'},
  soldier:{characterId:'soldier',characterName:'군사',speakerType:'npc',portraitPrefix:'soldier'}
});

QUESTIONS.push(
  question({questionId:'ch02-test-01',chapterId:'ch02',relatedSceneId:'ch02_policy_memory',relatedHistoricalEventId:'gwangjong-956-nobi',historicalEvent:'노비안검법과 왕권 강화',relatedIllustrationId:'ch02-freed-citizen',questionType:'사료·연계 정책형',difficulty:'중상',passage:'“본래 양인이었으나 전쟁과 혼란 속에서 억울하게 노비가 되었다고 호소하는 자들의 신분을 조사하도록 하라.”',question:'이 상황을 추진한 왕의 다른 정책으로 옳은 것은?',choices:['사심관 제도를 실시하였다.','과거제를 시행하였다.','12목에 지방관을 파견하였다.','전민변정도감을 설치하였다.','별무반을 조직하였다.'],answer:1,explanation:'자료는 광종의 노비안검법을 보여 줍니다. 광종은 쌍기의 건의를 받아들여 과거제를 시행해 새로운 관료를 선발했습니다.',examKeywords:['광종','노비안검법','과거제','왕권 강화'],rewardKnowledge:2,resumeStoryId:'ch02_noble_night'}),
  question({questionId:'ch02-test-02',chapterId:'ch02',relatedSceneId:'ch02_ssanggi',relatedHistoricalEventId:'gwangjong-958-gwageo',historicalEvent:'958년 과거제 시행',relatedIllustrationId:'ch02-exam-notice',questionType:'인물·정책 연결형',difficulty:'중',passage:'후주에서 고려로 온 인물이 광종에게 재능 있는 사람을 시험으로 뽑자고 건의하였다.',question:'이 인물과 정책의 연결로 옳은 것은?',choices:['쌍기 — 과거제','최승로 — 노비안검법','서희 — 과거제','강감찬 — 노비안검법','신돈 — 과거제'],answer:0,explanation:'후주 출신 쌍기는 광종에게 과거제 시행을 건의했습니다. 고려의 과거제는 958년에 처음 시행되었습니다.',examKeywords:['쌍기','과거제','958년','광종'],rewardKnowledge:2,resumeStoryId:'ch02_exam_day'}),
  question({questionId:'ch02-test-03',chapterId:'ch02',relatedSceneId:'ch02_reign_titles',relatedHistoricalEventId:'gwangjong-reign-titles',historicalEvent:'광덕·준풍 연호',relatedIllustrationId:'ch02-reign-titles',questionType:'단서로 왕 판단형',difficulty:'중',passage:'노비안검법 · 광덕 · 준풍',question:'위 단서를 통해 알 수 있는 고려의 왕은?',choices:['태조','광종','성종','현종','공민왕'],answer:1,explanation:'노비안검법과 독자적 연호 광덕·준풍은 모두 광종을 가리키는 대표 단서입니다.',examKeywords:['광종','광덕','준풍','노비안검법'],rewardKnowledge:2,resumeStoryId:'ch02_reign_followup'}),
  question({questionId:'ch02-test-04',chapterId:'ch02',relatedSceneId:'ch02_reign_followup',relatedHistoricalEventId:'gwangjong-authority',historicalEvent:'광종의 왕권 강화 정책',relatedIllustrationId:'ch02-reign-titles',questionType:'왕 업적 구분형',difficulty:'중상',passage:'광종은 호족 세력을 견제하고 왕권을 강화하기 위한 여러 정책을 추진하였다.',question:'다음 중 광종의 정책에 해당하지 않는 것은?',choices:['노비안검법 시행','과거제 시행','광덕 연호 사용','준풍 연호 사용','12목에 지방관 파견'],answer:4,explanation:'12목에 지방관을 파견한 왕은 성종입니다. 노비안검법·과거제·광덕·준풍은 광종과 연결됩니다.',examKeywords:['광종과 성종 구분','12목','광덕','준풍'],rewardKnowledge:2,resumeStoryId:'ch02_purge'}),
  question({questionId:'ch02-test-05',chapterId:'ch02',relatedSceneId:'ch02_purge',relatedHistoricalEventId:'goryeo-early-kings',historicalEvent:'태조·광종·성종 업적 비교',relatedIllustrationId:'ch02-purge-night',questionType:'왕별 정책 연결형',difficulty:'상',passage:'고려 초기에는 왕조의 기반 마련, 왕권 강화, 유교 정치 체제 정비가 차례로 추진되었다.',question:'태조 → 광종 → 성종의 정책을 바르게 연결한 것은?',choices:['사심관 → 노비안검법 → 12목 지방관 파견','노비안검법 → 사심관 → 시무 28조 수용','12목 지방관 파견 → 과거제 → 기인 제도','과거제 → 시무 28조 수용 → 사심관','기인 제도 → 12목 지방관 파견 → 광덕 연호 사용'],answer:0,explanation:'태조는 사심관·기인 제도를 실시했고, 광종은 노비안검법·과거제를 시행했으며, 성종은 최승로의 건의를 받아들이고 12목에 지방관을 파견했습니다.',examKeywords:['태조 사심관','광종 노비안검법','성종 12목','왕별 업적'],rewardKnowledge:3,resumeStoryId:'ch02_complete'})
);

const ch02Scene=data=>scene({chapterId:'ch02',historicalEventId:'gwangjong-reforms',year:949,...data});
const CH02_STORIES={
  ch02_transition:ch02Scene({sceneId:'ch02_transition',location:'시간의 흐름',title:'그리고 새로운 왕이 즉위했다',illustrationId:'ch02-gaegyeong-market',timeOfDay:'dawn',sceneEffect:'fade-in',dialogue:'고려가 후삼국을 통일한 뒤, 시간이 흘렀다.\n왕건이 세상을 떠나고 왕위는 몇 차례 바뀌었다.\n그리고 새로운 왕이 즉위했다.\n\n949년 · 개경\nCH.02 왕의 나라',nextStoryId:'ch02_market'}),
  ch02_market:ch02Scene({sceneId:'ch02_market',location:'개경 · 시장',title:'몇 년 뒤의 개경',illustrationId:'ch02-gaegyeong-market',timeOfDay:'afternoon',ambientSound:'market',dialogue:'전쟁이 끝난 뒤 개경은 더 크고 분주한 도시가 되었다.',choices:[
    choice('광종','ch02_dispute',{knowledge:1},{},'맞아. 광종. 기억이 선명해졌다.',{flags:{ch02KingMemory:'gwangjong'},memoryKey:'ch02-king-after-taejo',memoryValue:{answer:'광종',correct:true},playerResponse:'광종.',playerExpression:'thinking',responseText:'그래. 지금 왕은 광종이오.',responseCharacterId:'doyun',responseExpression:'neutral',resultSceneId:'ch02-memory-gwangjong',resultIllustrationId:'ch02-gaegyeong-market',hint:'기억 +1'}),
    choice('성종','ch02_dispute',{}, {},'이름이 비슷하게 섞인다. 조금 더 지켜보자.',{flags:{ch02KingMemory:'seongjong'},memoryKey:'ch02-king-after-taejo',memoryValue:{answer:'성종',correct:false},playerResponse:'성종……?',playerExpression:'worried',responseText:'글쎄. 자네 표정을 보니 확신은 없어 보이는군.',responseCharacterId:'doyun',responseExpression:'suspicious',resultSceneId:'ch02-memory-seongjong',resultIllustrationId:'ch02-gaegyeong-market'}),
    choice('공민왕','ch02_dispute',{}, {},'아직 훨씬 뒤의 왕이다. 조금 더 지켜보자.',{flags:{ch02KingMemory:'gongmin'},memoryKey:'ch02-king-after-taejo',memoryValue:{answer:'공민왕',correct:false},playerResponse:'공민왕……?',playerExpression:'worried',responseText:'처음 듣는 이름이오.',responseCharacterId:'doyun',responseExpression:'surprised',resultSceneId:'ch02-memory-gongmin',resultIllustrationId:'ch02-gaegyeong-market'}),
    choice('현종','ch02_dispute',{}, {},'순서가 조금 섞였다. 눈앞의 사건을 더 살펴보자.',{flags:{ch02KingMemory:'hyeonjong'},memoryKey:'ch02-king-after-taejo',memoryValue:{answer:'현종',correct:false},playerResponse:'현종……?',playerExpression:'worried',responseText:'그런 이름의 왕은 아직 없었소.',responseCharacterId:'doyun',responseExpression:'surprised',resultSceneId:'ch02-memory-hyeonjong',resultIllustrationId:'ch02-gaegyeong-market'})
  ]}),
  ch02_dispute:ch02Scene({sceneId:'ch02_dispute',year:956,location:'개경 · 시장 한복판',title:'시장의 소란',illustrationId:'ch02-slave-dispute',timeOfDay:'afternoon',dialogue:'시장 한쪽에서 한 남자와 귀족 집안의 관리인이 거칠게 맞서고 있다.',nextStoryId:'ch02_trust'}),
  ch02_trust:ch02Scene({sceneId:'ch02_trust',year:956,location:'개경 · 시장 한복판',title:'누구의 말을 믿을 것인가',illustrationId:'ch02-slave-dispute',timeOfDay:'afternoon',dialogue:'사람들의 시선이 두 사람 사이에 모인다.',choices:[
    choice('저 사람의 이야기를 들어보자','ch02_inspection',{}, {citizens:5},'남자는 전쟁 중 붙잡혀 억울하게 노비가 된 과거를 털어놓았다.',{playerResponse:'먼저 저 사람의 이야기를 들어보죠.',playerExpression:'serious',resultSceneId:'ch02-trust-listen',resultIllustrationId:'ch02-slave-dispute',hint:'평민 관계 +5'}),
    choice('문서부터 확인해야 하지 않을까?','ch02_inspection',{knowledge:1},{},'말보다 기록을 먼저 확인해야 한다는 판단에 사람들이 길을 열었다.',{playerResponse:'문서부터 확인해야 하지 않을까요?',playerExpression:'thinking',resultSceneId:'ch02-trust-records',resultIllustrationId:'chapter-02-teaser',hint:'지식 +1'}),
    choice('괜히 끼어들지 말자','ch02_inspection',{}, {doyun:2},'도윤과 함께 한발 물러서 사건이 어떻게 처리되는지 지켜보았다.',{playerResponse:'괜히 끼어들지 말고 지켜봐요.',playerExpression:'worried',responseText:'그게 안전하긴 하지.',responseCharacterId:'doyun',responseExpression:'neutral',resultSceneId:'ch02-trust-watch',resultIllustrationId:'ch02-slave-dispute',hint:'도윤 +2'})
  ]}),
  ch02_inspection:ch02Scene({sceneId:'ch02_inspection',year:956,location:'개경 · 신분 조사처',title:'폐하의 명이다',illustrationId:'chapter-02-teaser',timeOfDay:'evening',dialogue:'관리가 오래된 호적과 증언을 대조한다.',nextStoryId:'ch02_policy_reason'}),
  ch02_policy_reason:ch02Scene({sceneId:'ch02_policy_reason',year:956,location:'개경 · 신분 조사처 앞',title:'양인으로 돌아가다',illustrationId:'ch02-freed-citizen',timeOfDay:'sunset',dialogue:'조사 끝에 남자가 본래 양인이었다는 사실이 확인되었다.',choices:[
    choice('호족들이 거느리는 사람이 줄어든다','ch02_policy_memory',{knowledge:2},{citizens:3},'노비를 풀어 주면 호족의 경제·군사 기반은 약해지고 국가가 파악하는 양인은 늘어난다.',{flags:{understandsNobi:true},memoryKey:'ch02-nobi-purpose',memoryValue:{answer:'호족 기반 약화',correct:true},playerResponse:'호족들이 거느리는 사람이 줄어들어.',playerExpression:'thinking',resultSceneId:'ch02-reason-correct',resultIllustrationId:'ch02-freed-citizen',hint:'핵심 이해 · 지식 +2'}),
    choice('호족들의 군사력이 더 강해진다','ch02_policy_memory',{}, {},'노비가 줄어들면 호족이 동원할 노동력과 사병 기반도 약해진다.',{memoryKey:'ch02-nobi-purpose',memoryValue:{answer:'호족 군사력 강화',correct:false},playerResponse:'호족들의 군사력이 더 강해지나?',playerExpression:'worried',resultSceneId:'ch02-reason-wrong-power',resultIllustrationId:'ch02-freed-citizen'}),
    choice('왕의 힘이 약해진다','ch02_policy_memory',{}, {},'귀족은 반발하지만 정책의 방향은 왕권을 약화시키는 쪽이 아니었다.',{memoryKey:'ch02-nobi-purpose',memoryValue:{answer:'왕권 약화',correct:false},playerResponse:'왕의 힘이 약해지는 건가?',playerExpression:'worried',resultSceneId:'ch02-reason-wrong-king',resultIllustrationId:'ch02-freed-citizen'})
  ]}),
  ch02_policy_memory:ch02Scene({sceneId:'ch02_policy_memory',year:956,location:'역사 기억',title:'노비안검법',illustrationId:'ch02-freed-citizen',timeOfDay:'memory',dialogue:'억울하게 노비가 된 사람을 조사해 양인으로 회복시켰다.\n호족의 경제·군사 기반은 약해지고 세금·역 부담 대상인 양인은 늘었다.\n결과적으로 왕권 강화에 도움이 되었다.',quizId:'ch02-test-01'}),
  ch02_noble_night:ch02Scene({sceneId:'ch02_noble_night',year:956,location:'개경 · 도윤의 상점',title:'귀족의 분노',illustrationId:'ch02-nobles-night',timeOfDay:'night',ambientSound:'night-market',dialogue:'밤이 되자 도윤의 상점 안쪽에서 낮은 목소리가 새어 나왔다.',nextStoryId:'ch02_exam_notice'}),
  ch02_exam_notice:ch02Scene({sceneId:'ch02_exam_notice',year:958,location:'개경 · 관청 앞 거리',title:'새로운 시험',illustrationId:'ch02-exam-notice',timeOfDay:'morning',dialogue:'사람들이 새 공고 앞에 모여 웅성거린다.',nextStoryId:'ch02_ssanggi'}),
  ch02_ssanggi:ch02Scene({sceneId:'ch02_ssanggi',year:958,location:'개경 · 관청 앞 거리',title:'후주에서 온 사람, 쌍기',illustrationId:'ch02-exam-notice',timeOfDay:'morning',dialogue:'과거제를 건의한 사람이 후주에서 온 쌍기라는 소문이 퍼졌다.',quizId:'ch02-test-02'}),
  ch02_exam_day:ch02Scene({sceneId:'ch02_exam_day',year:958,location:'개경 · 과거 시험장',title:'시험의 날',illustrationId:'ch02-exam-yard',timeOfDay:'morning',dialogue:'수많은 응시자가 시험장으로 들어간다. 현우는 문 앞에서 숨을 고른다.',choices:[
    choice('넌 할 수 있어','ch02_reign_titles',{}, {hyunwoo:5},'현우는 굳었던 어깨를 펴고 시험장으로 들어갔다.',{playerResponse:'넌 할 수 있어.',playerExpression:'smile',responseText:'고맙습니다. 끝까지 해 보겠습니다.',responseCharacterId:'hyunwoo',responseExpression:'smile',resultSceneId:'ch02-exam-cheer',resultIllustrationId:'ch02-exam-yard',hint:'현우 +5'}),
    choice('시험이 인생의 전부는 아니잖아','ch02_reign_titles',{}, {hyunwoo:2},'결과보다 도전 자체를 기억하라는 말에 현우가 천천히 고개를 끄덕였다.',{playerResponse:'시험이 인생의 전부는 아니잖아.',playerExpression:'neutral',responseText:'그래도 오늘만큼은 제 모든 걸 걸어 보겠습니다.',responseCharacterId:'hyunwoo',responseExpression:'worried',resultSceneId:'ch02-exam-perspective',resultIllustrationId:'ch02-exam-yard',hint:'현우 +2'}),
    choice('문제 하나 내볼까?','ch02_reign_titles',{knowledge:1},{hyunwoo:3},'짧은 문답이 끝나자 현우의 긴장이 조금 풀렸다.',{playerResponse:'들어가기 전에 문제 하나 내볼까?',playerExpression:'thinking',responseText:'좋습니다. 마지막으로 머리를 깨워 보죠.',responseCharacterId:'hyunwoo',responseExpression:'smile',resultSceneId:'ch02-exam-question',resultIllustrationId:'ch02-exam-yard',hint:'지식 +1 · 현우 +3'})
  ]}),
  ch02_reign_titles:ch02Scene({sceneId:'ch02_reign_titles',year:960,location:'개경 · 관청 거리',title:'왕의 이름',illustrationId:'ch02-reign-titles',timeOfDay:'afternoon',dialogue:'관청 앞 깃발과 새 문서에 준풍이라는 연호가 쓰이기 시작했다.',quizId:'ch02-test-03'}),
  ch02_reign_followup:ch02Scene({sceneId:'ch02_reign_followup',year:960,location:'역사 기억',title:'광덕에서 준풍으로',illustrationId:'ch02-reign-titles',timeOfDay:'memory',dialogue:'광종은 독자적인 연호인 광덕과 준풍을 사용했다.\n왕의 권위를 높이고 왕권 강화를 드러내는 대표적인 단서다.',quizId:'ch02-test-04'}),
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
    dialogueLine('doyun','smile','세상 많이 달라졌지?'),
    dialogueLine('player','neutral','처음 여기 왔을 때보다는.'),
    dialogueLine('doyun','neutral','전쟁이 끝났으니까.'),
    dialogueLine('player','thinking','후삼국이 통일되고 시간이 흘렀다. 그리고 지금 고려의 왕은…….','thought')
  ],
  ch02_dispute:[
    dialogueLine('steward','angry','이 자는 우리 집 노비다!'),
    dialogueLine('freed_man','worried','아닙니다! 저는 원래 양인이었습니다!'),
    dialogueLine('player','surprised','무슨 일이에요?'),
    dialogueLine('doyun','serious','요즘 저런 일이 많아.'),
    dialogueLine('player','surprised','왜?'),
    dialogueLine('doyun','serious','왕이 노비들의 신분을 다시 조사하라고 했거든.'),
    dialogueLine('freed_man','worried','전쟁 중에 붙잡혀 억울하게 노비가 되었습니다!'),
    dialogueLine('steward','angry','거짓말이다!')
  ],
  ch02_trust:[dialogueLine('narrator','neutral','사람들의 시선이 두 사람 사이에 모인다.','narration')],
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
    dialogueLine('doyun','worried','요즘 왕과 오래된 집안들 사이가 좋지 않아.'),
    dialogueLine('player','thinking','노비를 풀어주는 것만이 목적이 아니구나. 기존 호족의 힘을 줄이려는 거야.','thought')
  ],
  ch02_exam_notice:[
    dialogueLine('citizen','surprised','시험으로 관리를 뽑는다고?'),
    dialogueLine('citizen','surprised','집안이 아니라 시험으로?'),
    dialogueLine('hyunwoo','worried','저도 시험을 보려고 합니다.'),
    dialogueLine('player','surprised','무슨 시험?'),
    dialogueLine('hyunwoo','neutral','과거입니다.'),
    dialogueLine('player','thinking','……과거.'),
    dialogueLine('hyunwoo','neutral','왕께서 재주 있는 사람을 시험으로 뽑겠다고 하셨습니다.')
  ],
  ch02_ssanggi:[
    dialogueLine('citizen','neutral','후주에서 온 쌍기라는 사람이 건의했다더군.'),
    dialogueLine('doyun','surprised','외국에서 온 사람이?'),
    dialogueLine('citizen','neutral','그래. 시험으로 관리를 뽑자고 했다던데.'),
    dialogueLine('player','thinking','쌍기……. 이 이름도 시험에서 봤던 것 같다.','thought')
  ],
  ch02_exam_day:[
    dialogueLine('narrator','neutral','958년 · 개경 과거 시험장','narration'),
    dialogueLine('hyunwoo','worried','여기까지 왔는데…… 갑자기 머리가 하얘졌습니다.'),
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
