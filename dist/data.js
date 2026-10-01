const SAVE_VERSION=2;
const ERAS=[['고려','918 — 1392'],['조선','1392 — 1897'],['대한제국','1897 — 1910'],['일제강점기','1910 — 1945'],['대한민국','1945 —']];

const HISTORY={
  historicalEventId:'goryeo-foundation-918',era:'고려',year:918,title:'새로운 나라',
  summary:'견훤은 900년 후백제를, 궁예는 901년 후고구려를 세웠습니다. 궁예의 세력에서 성장한 왕건은 신하들의 추대를 받아 918년 고려를 건국했습니다. 고려는 신라·후백제와 경쟁했고, 935년 신라의 항복을 받은 뒤 936년 후삼국을 통일했습니다.',
  examKeywords:['견훤 → 후백제','궁예 → 후고구려','왕건 → 고려','918년 고려 건국','935년 신라 항복','936년 후삼국 통일'],
  relatedPeople:['왕건','궁예','견훤'],relatedQuestions:['ch01-test-01','ch01-test-02','ch01-test-03','ch01-test-04','ch01-test-05','ch01-boss']
};

const ASSETS={
  'home-goryeo':{status:'ready',src:'goryeo.png',label:'고려 시대 전경',palette:['#203944','#9a6c45']},
  'prologue-study':{status:'ready',src:'seoul-night.png',label:'2026년 서울, 한국사 공부를 하는 밤',palette:['#17283d','#9b673c']},
  'prologue-sleep':{status:'ASSET_REQUIRED',label:'책상에 엎드려 잠든 주인공',palette:['#172238','#704d39']},
  'timeslip-voice':{status:'ASSET_REQUIRED',label:'검은 화면과 낯선 목소리',palette:['#080b10','#303b45']},
  'goryeo-house':{status:'ASSET_REQUIRED',label:'918년 민가에서 눈을 뜬 주인공과 낯선 청년',palette:['#3c2c22','#927051']},
  'goryeo-house-question':{status:'ASSET_REQUIRED',label:'낯선 집 안을 경계하며 살피는 주인공',palette:['#443126','#aa815d']},
  'village-reveal':{status:'ASSET_REQUIRED',label:'초가집과 흙길이 있는 10세기 마을',palette:['#506348','#aa8b5d']},
  'village-rumor':{status:'ASSET_REQUIRED',label:'왕건의 건국 소문에 모여든 주민들',palette:['#4f5a40','#9b744d']},
  'memory-wanggeon':{status:'ASSET_REQUIRED',label:'현대 교재와 왕건의 기억이 겹치는 순간',palette:['#1d3242','#a9824f']},
  'title-foundation':{status:'ASSET_REQUIRED',label:'918년 고려 건국 타이틀 장면',palette:['#111b24','#9b7640']},
  'market-later-three-kingdoms':{status:'ASSET_REQUIRED',label:'후삼국의 소문이 오가는 918년 장터',palette:['#66513a','#b09063']},
  'doyun-intro':{status:'ASSET_REQUIRED',label:'장터에서 처음 만난 젊은 상인 도윤',palette:['#503f32','#9e7452']},
  'status-first':{status:'ASSET_REQUIRED',label:'무일푼인 현실을 깨닫는 주인공',palette:['#273840','#77614a']},
  'life-choice':{status:'ASSET_REQUIRED',label:'갈림길에서 송악을 가리키는 도윤',palette:['#394d45','#99764e']},
  'route-songak':{status:'ASSET_REQUIRED',label:'송악으로 향하는 산길과 상인 행렬',palette:['#40594c','#9d8156']},
  'route-songak-carry':{status:'ASSET_REQUIRED',label:'짐을 들고 상단과 걷는 주인공',palette:['#3e5141','#8f6e45']},
  'route-songak-talk':{status:'ASSET_REQUIRED',label:'길 위에서 송악 이야기를 나누는 주인공과 도윤',palette:['#4b5c4c','#9b7d54']},
  'route-village':{status:'ASSET_REQUIRED',label:'사람들이 빠져나간 조용한 마을과 넘어진 수레',palette:['#5a5543','#9b815e']},
  'route-village-help':{status:'ASSET_REQUIRED',label:'주민과 함께 수레를 세우는 주인공',palette:['#565e46','#a08158']},
  'route-village-call':{status:'ASSET_REQUIRED',label:'도움을 청해 사람들이 모이는 장면',palette:['#4c5947','#967852']},
  'route-village-leave':{status:'ASSET_REQUIRED',label:'곤란한 주민을 뒤로하고 떠나는 주인공',palette:['#4c4942','#75634d']},
  'route-caravan':{status:'ASSET_REQUIRED',label:'수레에 짐을 싣는 상단 사람들',palette:['#584735','#9d7650']},
  'route-caravan-work':{status:'ASSET_REQUIRED',label:'상단의 짐을 빠르게 나르는 주인공',palette:['#524334','#96704a']},
  'route-caravan-negotiate':{status:'ASSET_REQUIRED',label:'상인과 품삯을 협상하는 주인공',palette:['#443b32','#8d6a48']},
  'route-caravan-goods':{status:'ASSET_REQUIRED',label:'상단의 직물과 물품을 살피는 주인공',palette:['#5c4634','#a4774c']},
  'route-royal':{status:'ASSET_REQUIRED',label:'왕건을 찾겠다는 말에 모두가 돌아보는 장면',palette:['#423a35','#8b664c']},
  'route-context':{status:'ASSET_REQUIRED',label:'송악 주변에 모인 호족과 상인, 백성의 움직임',palette:['#3a4b48','#8b744f']},
  'thief-start':{status:'ASSET_REQUIRED',label:'시장 물건을 훔쳐 달아나는 도둑',palette:['#51483a','#8f6844']},
  'thief-chase':{status:'ASSET_REQUIRED',label:'골목으로 달아나는 도둑을 직접 쫓는 주인공',palette:['#374347','#76583f']},
  'thief-block':{status:'ASSET_REQUIRED',label:'사람들이 골목길을 막아서는 장면',palette:['#41504a','#846b4d']},
  'thief-alley':{status:'ASSET_REQUIRED',label:'지름길 골목에서 도둑을 가로막는 주인공',palette:['#293a3c','#73553e']},
  'thief-ignore':{status:'ASSET_REQUIRED',label:'도둑이 사라지고 도윤이 주인공을 바라보는 장면',palette:['#383a39','#675844']},
  'thief-aftermath':{status:'ASSET_REQUIRED',label:'소란이 가라앉은 918년 시장',palette:['#48514a','#8d7452']},
  'first-night':{status:'ASSET_REQUIRED',label:'918년 밤, 멀리 불빛을 바라보는 주인공의 뒷모습',palette:['#121d2b','#6d583f']},
  'future-flow':{status:'ASSET_REQUIRED',label:'918·935·936년의 흐름이 기억처럼 겹치는 장면',palette:['#172635','#8a7045']},
  'chapter-complete':{status:'ASSET_REQUIRED',label:'새 나라의 새벽과 챕터 완료 장면',palette:['#192a32','#b08b53']},
  'chapter-02-teaser':{status:'ASSET_REQUIRED',label:'광종의 명으로 노비 기록을 조사하는 관리들',palette:['#151b24','#765841']}
};

const question=data=>({chapterId:'ch01',era:'고려',historicalEventId:'goryeo-foundation-918',image:null,userAnswer:null,isCorrect:null,isOfficial:false,examRound:null,examYear:null,questionNumber:null,examType:'한국사능력검정시험 유형 자체 제작',source:'국사편찬위원회 우리역사넷의 사실관계를 바탕으로 자체 제작',...data});
const QUESTIONS=[
  question({questionId:'ch01-test-01',relatedSceneId:'rumor',relatedHistoricalEventId:'goryeo-foundation-918',relatedIllustrationId:'memory-wanggeon',questionType:'인물·자료 추론형',difficulty:'중',passage:'마을 사람들이 “왕건 장군께서 새 나라를 세우셨다”고 말한다. 현대에서 보았던 궁예·견훤·왕건의 관계를 떠올려 보자.',question:'왕건에 대한 기억으로 옳은 것은?',choices:['궁예의 휘하에서 성장한 뒤 고려를 세운 인물이다.','견훤을 몰아내고 후백제를 세운 인물이다.','신라 왕실의 추대를 받아 왕이 된 인물이다.','잘 기억나지 않는다.'],answer:0,explanation:'왕건은 궁예의 휘하에서 성장한 뒤 신하들의 추대를 받아 918년 고려를 세웠습니다. 견훤은 후백제를 세운 인물입니다.',examKeywords:['왕건','궁예','신하의 추대','고려 건국'],rewardKnowledge:2,resumeStoryId:'foundation'}),
  question({questionId:'ch01-test-02',relatedSceneId:'foundation',relatedHistoricalEventId:'goryeo-foundation-918',relatedIllustrationId:'title-foundation',questionType:'시대 상황 판단형',difficulty:'중상',passage:'지금은 918년이다. 왕건이 국호를 고려라 하고 왕위에 올랐다는 소식이 퍼지고 있다.',question:'이 시기의 상황으로 가장 적절한 것은?',choices:['신라가 고려에 항복하여 후삼국이 통일되었다.','후백제가 이미 멸망하고 고려와 신라만 남았다.','고려·후백제·신라가 경쟁하는 후삼국의 구도가 이어졌다.','광종이 노비안검법을 시행하여 왕권을 강화했다.','거란의 침입을 강감찬이 귀주에서 물리쳤다.'],answer:2,explanation:'918년 고려가 건국된 뒤에도 신라와 후백제가 존재했습니다. 신라는 935년에 항복하고, 고려는 936년에 후삼국을 통일합니다.',examKeywords:['918년','후삼국','신라','후백제','고려'],rewardKnowledge:2,resumeStoryId:'market'}),
  question({questionId:'ch01-test-03',relatedSceneId:'doyun',relatedHistoricalEventId:'later-three-kingdoms',relatedIllustrationId:'doyun-intro',questionType:'사건 순서형',difficulty:'중상',passage:'ㄱ. 궁예가 후고구려를 세웠다.\nㄴ. 왕건이 고려를 건국했다.\nㄷ. 견훤이 후백제를 세웠다.\nㄹ. 고려가 후삼국을 통일했다.',question:'사건을 일어난 순서대로 바르게 나열한 것은?',choices:['ㄱ → ㄷ → ㄴ → ㄹ','ㄷ → ㄱ → ㄴ → ㄹ','ㄷ → ㄴ → ㄱ → ㄹ','ㄴ → ㄷ → ㄱ → ㄹ','ㄱ → ㄴ → ㄷ → ㄹ'],answer:1,explanation:'견훤의 후백제 건국(900) → 궁예의 후고구려 건국(901) → 왕건의 고려 건국(918) → 후삼국 통일(936) 순입니다.',examKeywords:['900년 후백제','901년 후고구려','918년 고려','936년 통일'],rewardKnowledge:2,resumeStoryId:'status'}),
  question({questionId:'ch01-test-04',relatedSceneId:'route_context',relatedHistoricalEventId:'goryeo-foundation-918',relatedIllustrationId:'route-context',questionType:'자료 해석형',difficulty:'중상',passage:'“새 왕조가 막 출범하였다. 각지의 유력 세력은 자기 근거지와 군사력을 지니고 있고, 새 임금은 이들의 협조를 얻어야 한다.”',question:'자료의 상황에서 왕건이 추진한 통치 방식으로 가장 적절한 것은?',choices:['전국의 호족을 즉시 제거하고 중앙군만 남겼다.','호족과 혼인 관계를 맺고 포섭하여 기반을 넓혔다.','골품제를 강화하여 신라 귀족만 등용했다.','권문세족의 농장을 몰수하고 과전법을 실시했다.','무신을 배제하고 문벌 귀족만으로 관료제를 운영했다.'],answer:1,explanation:'고려 건국의 주체에는 지방 호족이 포함되어 있었습니다. 왕건은 혼인과 성씨 하사 등 포섭 정책으로 호족과의 결속을 강화했습니다.',examKeywords:['왕건','호족','혼인 정책','포섭'],rewardKnowledge:2,resumeStoryId:'thief'}),
  question({questionId:'ch01-test-05',relatedSceneId:'thief_aftermath',relatedHistoricalEventId:'later-three-kingdoms',relatedIllustrationId:'thief-aftermath',questionType:'시대 상황 판단형',difficulty:'상',passage:'왕건이 새 나라를 세운 직후, 장터 사람들은 신라의 쇠퇴와 견훤의 군대를 걱정하고 있다.',question:'이 시기를 배경으로 한 설명으로 옳지 않은 것은?',choices:['견훤의 후백제가 고려와 경쟁하고 있었다.','신라는 국력이 약해졌지만 아직 존재하고 있었다.','왕건은 궁예의 세력에서 성장한 경험이 있었다.','후삼국의 통일은 이미 끝나 전국이 안정되어 있었다.','지방의 호족 세력은 정치·군사적으로 중요한 존재였다.'],answer:3,explanation:'918년은 고려 건국의 해이지 후삼국 통일의 해가 아닙니다. 통일은 936년에 이루어졌습니다.',examKeywords:['고려 건국 초기','후삼국','918년과 936년 구분'],rewardKnowledge:2,resumeStoryId:'night'}),
  question({questionId:'ch01-boss',relatedSceneId:'future_flow',relatedHistoricalEventId:'later-three-kingdoms-unification',relatedIllustrationId:'future-flow',questionType:'종합 자료 분석형',difficulty:'상',passage:'(가) 견훤이 완산주를 중심으로 나라를 세웠다.\n(나) 궁예의 신하들이 왕건을 추대하였다.\n(다) 신라의 경순왕이 고려에 항복하였다.\n(라) 고려가 후백제를 무너뜨리고 후삼국을 통일하였다.',question:'자료에 대한 분석으로 옳은 것을 모두 고른 것은?\nㄱ. (가)의 나라는 후백제이다.\nㄴ. (나)는 918년의 일이다.\nㄷ. (다)는 (라)보다 먼저 일어났다.\nㄹ. (라)는 고려 건국과 같은 해의 일이다.',choices:['ㄱ, ㄴ','ㄱ, ㄹ','ㄴ, ㄷ','ㄱ, ㄴ, ㄷ','ㄱ, ㄴ, ㄷ, ㄹ'],answer:3,explanation:'ㄱ·ㄴ·ㄷ이 옳습니다. 견훤은 후백제를 세웠고, 왕건은 918년 추대되어 고려를 건국했습니다. 신라는 935년에 항복했고 후삼국 통일은 936년이므로 ㄹ은 틀립니다.',examKeywords:['후백제','왕건 추대','918년','935년','936년'],rewardKnowledge:3,resumeStoryId:'complete'})
];

const choice=(label,nextStoryId,statChanges={},relationshipChanges={},result='',extra={})=>({label,nextStoryId,statChanges,relationshipChanges,result,...extra});
const scene=data=>({chapterId:'ch01',historicalEventId:'goryeo-foundation-918',backgroundImage:null,characterImage:null,characterExpression:'neutral',foregroundImage:null,sceneEffect:null,timeOfDay:'day',music:null,ambientSound:null,...data});

const STORIES={
  prologue:scene({sceneId:'prologue',year:2026,location:'서울 · 나의 방',speaker:'나',title:'순서가 자꾸 헷갈린다',illustrationId:'prologue-study',timeOfDay:'night',ambientSound:'clock',dialogue:'하…….\n궁예, 견훤, 왕건.\n이름은 아는데 자꾸 순서가 헷갈리네.\n왕건이 고려를 세운 게…….',choices:[
    choice('918년','sleep',{},{} ,'답을 마음속에 적어 두었다.',{initialMemory:'918',resultSceneId:'prologue-answer-918',resultIllustrationId:'prologue-study'}),
    choice('936년','sleep',{},{} ,'답을 마음속에 적어 두었다.',{initialMemory:'936',resultSceneId:'prologue-answer-936',resultIllustrationId:'prologue-study'}),
    choice('900년','sleep',{},{} ,'답을 마음속에 적어 두었다.',{initialMemory:'900',resultSceneId:'prologue-answer-900',resultIllustrationId:'prologue-study'}),
    choice('잘 모르겠다','sleep',{},{} ,'책장을 다시 바라봤지만 기억은 흐릿했다.',{initialMemory:'unknown',resultSceneId:'prologue-answer-unknown',resultIllustrationId:'prologue-study'})
  ]}),
  sleep:scene({sceneId:'sleep',year:2026,location:'서울 · 늦은 밤',speaker:'나',title:'책장 너머로',illustrationId:'prologue-sleep',timeOfDay:'night',sceneEffect:'fade-out',ambientSound:'clock',dialogue:'“진짜 직접 살아보면…….\n안 까먹을 텐데.”\n시계 초침이 멀어진다. 책의 마지막 페이지 제목만 희미하게 남는다.\n후삼국과 고려의 성립',nextStoryId:'voice'}),
  voice:scene({sceneId:'voice',year:918,location:'어딘지 알 수 없는 곳',speaker:'???',title:'누군가의 목소리',illustrationId:'timeslip-voice',timeOfDay:'unknown',sceneEffect:'blackout',dialogue:'“이보시오.”\n“……정신이 드시오?”\n\n“으…….”\n\n“죽은 줄 알았네.”',nextStoryId:'house'}),
  house:scene({sceneId:'house',year:918,location:'송악으로 가는 길목 · 민가',speaker:'낯선 청년',title:'낯선 집',illustrationId:'goryeo-house',timeOfDay:'morning',ambientSound:'village-distant',dialogue:'“정신이 드시오?”\n\n“……네? 여기가 어디예요?”\n\n“송악으로 가는 길목이오.”\n\n“……송악?”',choices:[
    choice('“지금이 언제예요?”','village',{},{} ,'“무슨 말을 하는 거요?” 청년의 눈에 의심이 어렸다.',{flags:{npcSuspicion:1},resultSceneId:'house-result-time',resultIllustrationId:'goryeo-house-question'}),
    choice('“제 휴대폰 못 봤어요?”','village',{},{} ,'“휴…… 무엇?” 청년이 한 걸음 물러섰다.',{flags:{npcSuspicion:2},resultSceneId:'house-result-phone',resultIllustrationId:'goryeo-house-question'}),
    choice('말없이 주변을 살펴본다','village',{knowledge:1},{} ,'전기가 없어. 옷도, 가구도 전부 이상해. 설마…….',{flags:{observation:true},resultSceneId:'house-result-observe',resultIllustrationId:'goryeo-house-question',hint:'관찰 +1'})
  ]}),
  village:scene({sceneId:'village',year:918,location:'송악으로 가는 길목 · 마을',speaker:'나',title:'촬영장이 아니야',illustrationId:'village-reveal',timeOfDay:'morning',ambientSound:'village',dialogue:'초가집, 흙길, 말과 수레. 멀리 산이 보인다.\n현대 물건은 하나도 없다.\n\n“…….”\n촬영장이 아니야.',nextStoryId:'rumor'}),
  rumor:scene({sceneId:'rumor',year:918,location:'마을 · 흙길',speaker:'주민',title:'왕건 장군이 새 나라를 세웠다',illustrationId:'village-rumor',timeOfDay:'morning',dialogue:'“들었나?”\n“무슨 일인데?”\n“왕건 장군께서 새 나라를 세우셨다네!”\n\n“……왕건?”',quizId:'ch01-test-01'}),
  foundation:scene({sceneId:'foundation',year:918,location:'기억과 현실의 경계',speaker:'나',title:'918년 · 고려 건국',illustrationId:'title-foundation',timeOfDay:'day',sceneEffect:'title-reveal',dialogue:'“나라 이름은 고려라고 한다더군.”\n\n……고려.\n\n918년. 고려 건국.\n눈떠보니 고려.',quizId:'ch01-test-02'}),
  market:scene({sceneId:'market',year:918,location:'마을 · 장터',speaker:'장터 사람들',title:'아직 통일된 게 아니야',illustrationId:'market-later-three-kingdoms',timeOfDay:'afternoon',ambientSound:'market',dialogue:'“견훤의 군대가 만만치 않다던데.”\n“신라는 힘이 예전 같지 않고.”\n“궁예가 물러났다고 세상이 바로 조용해지겠나.”\n\n견훤. 신라. 왕건.\n잠깐…… 아직 통일된 게 아니야.',nextStoryId:'doyun'}),
  doyun:scene({sceneId:'doyun',year:918,location:'마을 · 장터',speaker:'도윤 · 젊은 상인',title:'궁예를 모르는 사람이 어디 있소',illustrationId:'doyun-intro',timeOfDay:'afternoon',characterExpression:'curious',dialogue:'“궁예가 그렇게 될 줄 누가 알았겠소.”\n\n“궁예를 알아요?”\n\n“모르는 사람이 어디 있소. 한때는 세상이 모두 그의 것이 될 것 같았지.”\n\n궁예 → 후고구려. 견훤 → 후백제. 왕건 → 고려.',quizId:'ch01-test-03'}),
  status:scene({sceneId:'status',year:918,location:'마을 · 장터 어귀',speaker:'도윤',title:'그런데 자네, 갈 곳은 있소?',illustrationId:'status-first',timeOfDay:'afternoon',dialogue:'“갈 곳은 있소?”\n\n“……없는데요.”\n\n“돈은?”\n\n“…….”\n\n고려에 떨어진 것도 문제인데. 나 지금 무일푼이잖아.',nextStoryId:'life_choice'}),
  life_choice:scene({sceneId:'life_choice',year:918,location:'마을 밖 · 갈림길',speaker:'도윤',title:'첫 번째 큰 인생 선택',illustrationId:'life-choice',timeOfDay:'afternoon',dialogue:'“나는 송악으로 갈 생각이오. 새 나라가 들어섰으니 사람이 몰릴 테고, 사람이 몰리면 장사가 되겠지.”\n\n“자네는 어떻게 할 건가?”',choices:[
    choice('송악으로 간다','route_songak',{}, {doyun:5},'도윤과 함께 새로운 나라의 중심으로 향했다.',{route:'songak',flags:{songakRoute:1},resultSceneId:'life-choice-songak',resultIllustrationId:'route-songak',hint:'송악 루트 +1 · 도윤 +5'}),
    choice('마을에 남는다','route_village',{}, {village:10},'사람들이 떠난 마을에 남아 살아갈 방법을 찾기로 했다.',{route:'village',flags:{lifeRoute:1},resultSceneId:'life-choice-village',resultIllustrationId:'route-village',hint:'생활 루트 +1 · 마을 +10'}),
    choice('상단에 일을 부탁한다','route_caravan',{}, {merchant:10},'먹고살 돈부터 벌기 위해 상단의 수레로 향했다.',{route:'merchant',flags:{merchantRoute:1},resultSceneId:'life-choice-caravan',resultIllustrationId:'route-caravan',hint:'상인 루트 +1 · 상단 +10'}),
    choice('왕건을 찾아간다','route_royal',{fame:-2},{royal:3},'“……왕을? 자네가?” 주변 사람들이 이상하다는 듯 돌아보았다.',{route:'royal',flags:{wanggeonSpecial:true},condition:{stat:'knowledge',min:4},resultSceneId:'life-choice-royal',resultIllustrationId:'route-royal',hint:'지식 4 필요 · 왕건 특수 플래그'})
  ]}),
  route_songak:scene({sceneId:'route_songak',year:918,location:'송악으로 향하는 길',speaker:'도윤',title:'상인 행렬',illustrationId:'route-songak',timeOfDay:'afternoon',ambientSound:'cart',dialogue:'“공짜로 따라올 생각은 아니겠지?”\n수레와 사람들의 행렬이 산길을 따라 길게 이어진다.',choices:[
    choice('짐을 나른다','route_context',{health:-5,wealth:5},{doyun:5},'짐을 들고 상단과 걸었다. 팔은 저렸지만 첫 품삯이 손에 들어왔다.',{job:'상단 일꾼',resultSceneId:'songak-result-carry',resultIllustrationId:'route-songak-carry',hint:'체력 −5 · 재산 +5 · 도윤 +5'}),
    choice('송악 이야기를 묻는다','route_context',{knowledge:1},{doyun:2},'도윤은 송악의 호족과 새 나라에 모여드는 사람들 이야기를 들려주었다.',{job:'상단 견습',resultSceneId:'songak-result-talk',resultIllustrationId:'route-songak-talk',hint:'지식 +1'})
  ]}),
  route_village:scene({sceneId:'route_village',year:918,location:'사람들이 빠져나간 마을',speaker:'아이',title:'넘어진 수레',illustrationId:'route-village',timeOfDay:'afternoon',dialogue:'조용한 마을 한가운데 수레가 넘어져 있다. 노인과 아이가 쏟아진 짐 앞에서 곤란해한다.\n\n“도와주세요!”',choices:[
    choice('수레를 들어준다','route_context',{health:-7},{village:10},'주민과 힘을 합쳐 수레를 바로 세웠다. 아이가 환하게 웃었다.',{job:'마을 일꾼',resultSceneId:'village-result-help',resultIllustrationId:'route-village-help',hint:'체력 −7 · 마을 +10'}),
    choice('다른 사람을 부른다','route_context',{fame:2},{village:3},'근처 사람들을 불러 함께 수레를 세웠다. 혼자 힘보다 빠르고 안전했다.',{job:'마을 심부름꾼',resultSceneId:'village-result-call',resultIllustrationId:'route-village-call',hint:'명성 +2'}),
    choice('지나친다','route_context',{}, {village:-5},'뒤에서 곤란해하는 주민들의 목소리를 남겨 둔 채 걸음을 옮겼다.',{job:'없음',resultSceneId:'village-result-leave',resultIllustrationId:'route-village-leave',hint:'마을 −5'})
  ]}),
  route_caravan:scene({sceneId:'route_caravan',year:918,location:'마을 밖 · 상단 집결지',speaker:'상단 상인',title:'손이 빨라야 해',illustrationId:'route-caravan',timeOfDay:'afternoon',ambientSound:'cart',dialogue:'상인들이 수레에 직물과 곡식 자루를 싣고 있다.\n\n“일하려면 손이 빨라야 해.”',choices:[
    choice('무슨 일이든 하겠다','route_context',{health:-5,wealth:10},{merchant:5},'해가 기울 때까지 짐을 날랐다. 약속한 품삯을 받았다.',{job:'상단 일꾼',resultSceneId:'caravan-result-work',resultIllustrationId:'route-caravan-work',hint:'재산 +10'}),
    choice('품삯부터 협상한다','route_context',{wealth:7,fame:1},{merchant:3},'할 일을 먼저 확인하고 품삯을 조금 올렸다. 도윤이 흥미롭다는 듯 웃었다.',{job:'상단 견습',resultSceneId:'caravan-result-negotiate',resultIllustrationId:'route-caravan-negotiate',hint:'협상 성공 · 재산 +7'}),
    choice('물건을 살펴본다','route_context',{knowledge:2,wealth:4},{merchant:4},'직물의 산지와 쓰임을 구분해 정리했다. 상인이 장부 일을 맡겼다.',{job:'상단 장부 보조',resultSceneId:'caravan-result-goods',resultIllustrationId:'route-caravan-goods',hint:'상업 지식 +2'})
  ]}),
  route_royal:scene({sceneId:'route_royal',year:918,location:'송악으로 난 길',speaker:'도윤',title:'왕을 찾아가겠다고?',illustrationId:'route-royal',timeOfDay:'afternoon',dialogue:'“새 왕이 막 즉위한 때요. 이름도 연고도 없는 자가 당장 만날 수 있을 리 없지.”\n왕건을 직접 만날 수는 없었지만, 그 이름을 입에 올린 순간은 특별한 표식처럼 남았다.',nextStoryId:'route_context'}),
  route_context:scene({sceneId:'route_context',year:918,location:'송악 인근 · 큰길',speaker:'도윤',title:'새 나라를 움직이는 사람들',illustrationId:'route-context',timeOfDay:'late-afternoon',dialogue:'길에는 상인과 백성뿐 아니라 각지의 유력자들이 보낸 사람들도 오갔다.\n\n“새 임금도 혼자서 나라를 세울 수는 없소. 자기 고장을 지키는 세력들과 손을 잡아야지.”\n\n왕건과 호족. 새 나라의 기반은 한 사람만의 힘이 아니었다.',quizId:'ch01-test-04'}),
  thief:scene({sceneId:'thief',year:918,location:'송악 인근 · 시장 길목',speaker:'상인',title:'도둑이야!',illustrationId:'thief-start',timeOfDay:'late-afternoon',sceneEffect:'shake',dialogue:'한 사람이 상인의 물건을 낚아채 골목으로 달아난다.\n\n“도둑이야!”',choices:[
    choice('직접 쫓는다','thief_aftermath',{health:-10,fame:5},{doyun:2},'숨이 턱까지 차올랐지만 끝내 도둑을 붙잡았다. 사람들이 몰려들었다.',{resultSceneId:'thief-result-chase',resultIllustrationId:'thief-chase',hint:'체력 −10 · 명성 +5'}),
    choice('사람들에게 길을 막으라고 외친다','thief_aftermath',{fame:3},{village:2},'외침을 들은 사람들이 골목 입구를 막았다. 도둑은 갈 곳을 잃었다.',{resultSceneId:'thief-result-block',resultIllustrationId:'thief-block',hint:'명성 +3'}),
    choice('골목으로 돌아간다','thief_aftermath',{fame:7},{doyun:3},'아침에 살펴둔 골목을 기억했다. 지름길로 돌아가 도둑 앞을 막았다.',{condition:{flag:'observation'},resultSceneId:'thief-result-alley',resultIllustrationId:'thief-alley',hint:'관찰 선택으로 해금 · 명성 +7'}),
    choice('모른 척한다','thief_aftermath',{}, {doyun:-3},'도둑은 골목 너머로 사라졌다. 함께 있던 도윤이 말없이 나를 바라보았다.',{resultSceneId:'thief-result-ignore',resultIllustrationId:'thief-ignore',hint:'도윤 −3'})
  ]}),
  thief_aftermath:scene({sceneId:'thief_aftermath',year:918,location:'송악 인근 · 시장',speaker:'나',title:'소란이 지나간 자리',illustrationId:'thief-aftermath',timeOfDay:'sunset',dialogue:'잠시 뒤 시장은 다시 움직이기 시작했다.\n나라의 이름이 바뀌어도 사람들은 물건을 지키고, 품삯을 벌고, 전쟁의 소문 속에서 하루를 살아간다.\n나는 이제 후삼국 시대의 생활 한가운데 서 있다.',quizId:'ch01-test-05'}),
  night:scene({sceneId:'night',year:918,location:'마을 또는 송악 · 밤',speaker:'나',title:'고려의 첫날 밤',illustrationId:'first-night',timeOfDay:'night',ambientSound:'night-insects',dialogue:'“새 나라가 세워졌으니 세상도 달라지겠지.”\n\n나는 멀리 보이는 불빛을 바라본다.\n나는 알고 있다. 이 나라가 결국 후삼국을 통일한다는 걸.\n하지만…… 내가 여기서 어떻게 살아야 하는지는 모른다.',nextStoryId:'future_flow'}),
  future_flow:scene({sceneId:'future_flow',year:918,location:'기억 속의 연표',speaker:'나 · 역사 기억',title:'건국과 통일은 같은 해가 아니다',illustrationId:'future-flow',timeOfDay:'memory',sceneEffect:'memory-overlay',dialogue:'견훤 → 후백제.\n궁예 → 후고구려.\n왕건 → 궁예 세력에서 성장.\n\n918년 고려 건국.\n935년 신라의 항복.\n936년 고려의 후삼국 통일.\n\n처음에 헷갈렸던 흐름이 하나로 이어진다.',quizId:'ch01-boss'}),
  complete:scene({sceneId:'complete',year:918,location:'CHAPTER 01 COMPLETE',speaker:'시스템',title:'새로운 나라',illustrationId:'chapter-complete',timeOfDay:'dawn',dialogue:'첫 번째 고려 생활을 마쳤습니다.'})
};

Object.values(STORIES).forEach(s=>{const asset=ASSETS[s.illustrationId]||ASSETS['home-goryeo'];s.backgroundImage=asset.src||null});

const INITIAL_RUN=()=>({storyId:'prologue',started:false,completed:false,status:'평민',stats:{health:100,knowledge:0,fame:0,wealth:0},relations:{doyun:0,village:0,merchant:0,royal:0},job:'없음',route:null,visited:[],choices:[],flags:{},initialMemory:null,pending:null,activeQuestionId:null,questionAnswer:null,questionResults:{},peakWealth:0});
const INITIAL_META=()=>({questionRecords:{},wrongQuestionIds:[],reviewedQuestionIds:[],historicalEvents:[],cards:[],people:[],achievements:[],endings:[],playthroughs:[],completedRuns:0,totalChoices:0});
const INITIAL=()=>({version:SAVE_VERSION,run:INITIAL_RUN(),meta:INITIAL_META()});

function choiceAvailable(run,c){if(!c.condition)return true;if(c.condition.stat)return(run.stats[c.condition.stat]||0)>=c.condition.min;if(c.condition.flag)return Boolean(run.flags[c.condition.flag]);return true}
function applyChoice(state,sceneId,index){const run=state.run||state,c=STORIES[sceneId].choices[index];if(!choiceAvailable(run,c))return run;for(const[k,v]of Object.entries(c.statChanges||{}))run.stats[k]=Math.max(0,run.stats[k]+v);for(const[k,v]of Object.entries(c.relationshipChanges||{}))run.relations[k]=Math.max(-100,Math.min(100,run.relations[k]+v));if(c.route)run.route=c.route;if(c.job!==undefined)run.job=c.job;if(c.initialMemory)run.initialMemory=c.initialMemory;if(c.flags)Object.assign(run.flags,c.flags);run.peakWealth=Math.max(run.peakWealth,run.stats.wealth);run.choices.push({scene:sceneId,label:c.label,resultSceneId:c.resultSceneId});run.pending={...c,sourceSceneId:sceneId};run.storyId=c.nextStoryId;if(state.meta)state.meta.totalChoices+=1;return run}
function migrateSave(raw){if(raw&&raw.version===SAVE_VERSION&&raw.run&&raw.meta)return raw;const fresh=INITIAL();if(!raw||typeof raw!=='object')return fresh;if(raw.started){fresh.run.started=Boolean(raw.started);fresh.run.completed=Boolean(raw.completed);fresh.run.storyId=STORIES[raw.storyId]?raw.storyId:(raw.completed?'complete':'prologue');fresh.run.stats={...fresh.run.stats,...raw.stats};fresh.run.relations={...fresh.run.relations,doyun:raw.relations?.merchant||0,...raw.relations};fresh.run.job=raw.job||'없음';fresh.run.route=raw.route||null;fresh.run.visited=raw.visited||[];fresh.run.choices=raw.choices||[];fresh.run.peakWealth=raw.peakWealth||fresh.run.stats.wealth}for(const[id,correct]of Object.entries(raw.answers||{}))fresh.meta.questionRecords[id]={attempts:1,correctCount:correct?1:0,lastAnswer:null,lastCorrect:Boolean(correct),everCorrect:Boolean(correct)};fresh.meta.wrongQuestionIds=[...(raw.wrong||[])];fresh.meta.reviewedQuestionIds=[...(raw.reviewed||[])];fresh.meta.cards=[...(raw.cards||[])];if(raw.completed)fresh.meta.completedRuns=1;return fresh}
function resetRun(state){state.run=INITIAL_RUN();return state}
function recordQuestion(state,questionId,userAnswer){const q=QUESTIONS.find(item=>item.questionId===questionId);if(!q)return false;const right=userAnswer===q.answer,previous=state.meta.questionRecords[questionId]||{attempts:0,correctCount:0,everCorrect:false};state.meta.questionRecords[questionId]={attempts:previous.attempts+1,correctCount:previous.correctCount+(right?1:0),lastAnswer:userAnswer,lastCorrect:right,everCorrect:previous.everCorrect||right};state.run.questionResults[questionId]=right;if(right){if(!previous.everCorrect)state.run.stats.knowledge+=q.rewardKnowledge||2;if(state.meta.wrongQuestionIds.includes(questionId)&&!state.meta.reviewedQuestionIds.includes(questionId))state.meta.reviewedQuestionIds.push(questionId)}else{if(!state.meta.wrongQuestionIds.includes(questionId))state.meta.wrongQuestionIds.push(questionId);state.meta.reviewedQuestionIds=state.meta.reviewedQuestionIds.filter(id=>id!==questionId)}state.run.questionAnswer=userAnswer;return right}
function finishChapter(state){const run=state.run;run.completed=true;run.storyId='complete';run.activeQuestionId=null;run.questionAnswer=null;const add=(list,value)=>{if(!list.includes(value))list.push(value)};add(state.meta.historicalEvents,'goryeo-foundation-918');add(state.meta.cards,'goryeo-foundation-918');['왕건','궁예','견훤'].forEach(name=>add(state.meta.people,name));add(state.meta.achievements,'ch01-first-witness');add(state.meta.endings,`ch01-${run.route||'wanderer'}`);state.meta.completedRuns+=1;state.meta.playthroughs.push({chapterId:'ch01',route:run.route,job:run.job,stats:{...run.stats},choices:run.choices.length,completedAt:new Date().toISOString()});return state}
