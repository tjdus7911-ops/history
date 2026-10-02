/* CH.04 나라의 틀 — stable ch03_* scene/asset IDs */
Object.assign(CHAPTERS.ch04,{
  subtitle:'982년, 성종과 고려의 제도 정비',
  thumbnail:'assets/scenes/ch03-gaegyeong-982.png',
  startStoryId:'ch03_transition',
  completeStoryId:'ch03_legacy',
  questionCount:10,
  implemented:true
});
CHAPTERS.ch05.thumbnail='assets/scenes/ch04-khitan-teaser.png';

for(const expression of ['laugh','tired','weak_smile'])if(!EXPRESSIONS.includes(expression))EXPRESSIONS.push(expression);

Object.assign(ASSETS,{
  'ch03-gaegyeong-982':sceneArt('ch03-gaegyeong-982','982년, 더욱 성장한 수도 개경',['#263846','#b07d4e']),
  'ch03-doyun-guild-exterior':sceneArt('ch03-doyun-guild-exterior','꿈을 이룬 도윤의 상단 외관',['#30414a','#a9794d']),
  'ch03-doyun-guild-interior':sceneArt('ch03-doyun-guild-interior','도윤상단의 장부와 물품이 가득한 내부',['#252f38','#9b704b']),
  'ch03-returning-merchant':sceneArt('ch03-returning-merchant','물건을 빼앗긴 채 돌아온 상단 상인',['#3a4545','#a47148']),
  'ch03-provincial-strongman':sceneArt('ch03-provincial-strongman','지방 세력가가 상인의 길을 막는 현장',['#343d3f','#916748']),
  'ch03-gukjagam':sceneArt('ch03-gukjagam','성종 때 마련된 고려의 최고 교육 기관 국자감',['#304341','#a77a4d']),
  'ch03-doyun-courtyard':sceneArt('ch03-doyun-courtyard','늙은 도윤이 자신이 만든 상단을 바라보는 저녁',['#283944','#a67149'],true,'ch03-doyun-courtyard',['doyun']),
  'ch03-doyun-farewell':sceneArt('ch03-doyun-farewell','도윤과 주인공이 나누는 마지막 조용한 대화',['#171f29','#76543d'],true,'ch03-doyun-farewell',['doyun','player']),
  'ch03-guild-legacy':sceneArt('ch03-guild-legacy','도윤 사후에도 움직이는 도윤상단 앞의 주인공',['#1d2932','#7b6048'],true,'ch03-guild-legacy',['player']),
  'ch04-khitan-teaser':sceneArt('ch04-khitan-teaser','북쪽 국경에서 전해진 거란의 움직임',['#111a26','#6b4e38'],true)
});

Object.assign(PORTRAITS,{
  doyun_old_neutral:portrait('doyun','neutral','도윤 · 982년, 아흔에 가까운 상단주의 기본 표정',['#29313b','#8a6a52'],'assets/characters/doyun_old_neutral.png','guild_master'),
  doyun_old_smile:portrait('doyun','smile','도윤 · 982년, 오랜 친구를 보는 익숙한 미소',['#2d3540','#997357'],'assets/characters/doyun_old_smile.png','guild_master'),
  doyun_old_laugh:portrait('doyun','laugh','도윤 · 982년, 평생의 농담을 꺼내며 웃는 표정',['#303844','#a07a59'],'assets/characters/doyun_old_laugh.png','guild_master'),
  doyun_old_serious:portrait('doyun','serious','도윤 · 982년, 상단의 문제를 헤아리는 표정',['#252d37','#795f4c'],'assets/characters/doyun_old_serious.png','guild_master'),
  doyun_old_tired:portrait('doyun','tired','도윤 · 982년, 세월의 피로가 내려앉은 표정',['#252d36','#745e4d'],'assets/characters/doyun_old_tired.png','guild_master'),
  doyun_old_sad:portrait('doyun','sad','도윤 · 982년, 작별을 앞둔 담담한 슬픔',['#252e38','#705b4a'],'assets/characters/doyun_old_sad.png','guild_master'),
  doyun_old_weak_smile:portrait('doyun','weak_smile','도윤 · 982년, 마지막까지 남은 희미한 미소',['#29323b','#80644e'],'assets/characters/doyun_old_weak_smile.png','guild_master'),
  hyunwoo_middle_neutral:portrait('hyunwoo','neutral','현우 · 982년, 중년 관리의 차분한 기본 표정',['#36443f','#8e7357'],'assets/characters/hyunwoo_middle_neutral.png','official_scholar'),
  hyunwoo_middle_smile:portrait('hyunwoo','smile','현우 · 982년, 오랜 친구를 만난 절제된 미소',['#3b4942','#9c7b59'],'assets/characters/hyunwoo_middle_smile.png','official_scholar'),
  hyunwoo_middle_serious:portrait('hyunwoo','serious','현우 · 982년, 나라의 제도를 말하는 진지한 표정',['#303d3b','#786551'],'assets/characters/hyunwoo_middle_serious.png','official_scholar'),
  hyunwoo_middle_thinking:portrait('hyunwoo','thinking','현우 · 982년, 정책을 숙고하는 표정',['#33413e','#816a53'],'assets/characters/hyunwoo_middle_thinking.png','official_scholar'),
  doyun_laugh:portrait('doyun','laugh','도윤 · 노년의 웃음',['#303844','#a07a59'],'assets/characters/doyun_old_laugh.png','guild_master'),
  doyun_tired:portrait('doyun','tired','도윤 · 노년의 피로',['#252d36','#745e4d'],'assets/characters/doyun_old_tired.png','guild_master'),
  doyun_sad:portrait('doyun','sad','도윤 · 노년의 슬픔',['#252e38','#705b4a'],'assets/characters/doyun_old_sad.png','guild_master'),
  doyun_weak_smile:portrait('doyun','weak_smile','도윤 · 노년의 희미한 미소',['#29323b','#80644e'],'assets/characters/doyun_old_weak_smile.png','guild_master'),
  hyunwoo_serious:portrait('hyunwoo','serious','현우 · 중년의 진지한 표정',['#303d3b','#786551'],'assets/characters/hyunwoo_middle_serious.png','official_scholar'),
  hyunwoo_thinking:portrait('hyunwoo','thinking','현우 · 중년의 숙고하는 표정',['#33413e','#816a53'],'assets/characters/hyunwoo_middle_thinking.png','official_scholar')
});

const DOYUN_OLD_PORTRAITS={neutral:'doyun_old_neutral',smile:'doyun_old_smile',laugh:'doyun_old_laugh',serious:'doyun_old_serious',tired:'doyun_old_tired',sad:'doyun_old_sad',weak_smile:'doyun_old_weak_smile',worried:'doyun_old_sad',surprised:'doyun_old_neutral',suspicious:'doyun_old_serious',angry:'doyun_old_serious'};
const HYUNWOO_YOUNG_PORTRAITS={neutral:'hyunwoo_neutral',smile:'hyunwoo_smile',worried:'hyunwoo_worried',serious:'hyunwoo_neutral',thinking:'hyunwoo_neutral'};
const HYUNWOO_MIDDLE_PORTRAITS={neutral:'hyunwoo_middle_neutral',smile:'hyunwoo_middle_smile',serious:'hyunwoo_middle_serious',thinking:'hyunwoo_middle_thinking',worried:'hyunwoo_middle_serious'};
CHARACTER_ASSET_MAP.doyun.ages.elder_982={defaultOutfit:'guild_master',outfits:{guild_master:DOYUN_OLD_PORTRAITS}};
CHARACTER_ASSET_MAP.hyunwoo={canonicalId:'HYUNWOO_CANONICAL',defaultAge:'young',ages:{young:{defaultOutfit:'scholar',outfits:{scholar:HYUNWOO_YOUNG_PORTRAITS,young_official:HYUNWOO_YOUNG_PORTRAITS}},middle_982:{defaultOutfit:'official_scholar',outfits:{official_scholar:HYUNWOO_MIDDLE_PORTRAITS}}}};
Object.assign(CHARACTERS.hyunwoo,{canonicalId:'HYUNWOO_CANONICAL',ageVariant:'young',outfit:'scholar'});

QUESTIONS.push(
  question({questionId:'ch03-official-75-basic-10',chapterId:'ch04',relatedSceneId:'ch03_exam_75',relatedHistoricalEventId:'seongjong-state-system',historicalEvent:'성종의 제도 정비',relatedIllustrationId:'ch03-gukjagam',questionType:'왕의 업적 판단형',difficulty:'중',passage:'○ 신 최승로가 시무 28조를 기록하여 장계와 함께 왕께 올립니다.\n○ 왕이 교서를 내려 서재와 학사를 세우고 국자감을 창설하도록 하였다.',question:'다음 자료에 나타난 왕의 업적으로 옳은 것은?',choices:['노비안검법을 실시하였다.','쌍성총관부를 공격하였다.','12목에 지방관을 파견하였다.','공산 전투를 승리로 이끌었다.'],answer:2,explanation:'최승로의 시무 28조를 받아들이고, 12목에 지방관을 파견하며, 국자감을 설치한 왕은 성종이다. ① 노비안검법은 광종, ② 쌍성총관부 공격·수복은 공민왕 시대, ④ 공산 전투는 태조 왕건과 후백제 견훤이 대립하던 시기의 일이다.',examKeywords:['최승로','시무 28조','국자감','성종','12목 지방관'],rewardKnowledge:3,resumeStoryId:'ch03_policy_effect',isOfficial:true,examRound:75,examYear:2025,examLevel:'기본',questionNumber:10,sourcePage:3,sourceFile:'75회 한국사_문제지(기본).pdf',answerFile:'75회 한국사_답지(기본).pdf',examType:'제75회 한국사능력검정시험 기본 실제 기출',source:'국사편찬위원회 한국사능력검정시험 제75회 기본 · 사용자 제공 문제지·정답표 기반 모바일 전사'}),
  question({questionId:'ch03-practice-02',chapterId:'ch04',relatedSceneId:'ch03_trade_practice',relatedHistoricalEventId:'seongjong-twelve-mok',historicalEvent:'12목 지방관 파견',relatedIllustrationId:'ch03-provincial-strongman',questionType:'실전 유형 연습 · 상황 판단형',difficulty:'중',passage:'지방의 세력가들이 중앙의 명령을 따르지 않고 백성과 상인의 활동에 영향력을 행사하고 있었다.',question:'다음 상황 이후 실시된 정책으로 가장 적절한 것은?',choices:['노비안검법','12목 지방관 파견','사심관 제도','쌍성총관부 공격'],answer:1,explanation:'성종은 지방에 대한 중앙의 통치를 강화하기 위해 12목에 지방관을 파견하였다.',examKeywords:['성종','12목','지방관','중앙 집권'],rewardKnowledge:2,resumeStoryId:'ch03_three_friends',examType:'한능검 기출 유형',source:'스토리에서 경험한 성종의 지방 통치 정책을 바탕으로 자체 제작'}),
  question({questionId:'ch03-practice-03',chapterId:'ch04',relatedSceneId:'ch03_choe_practice',relatedHistoricalEventId:'choe-seungro-simu-28',historicalEvent:'최승로와 시무 28조',relatedIllustrationId:'ch03-doyun-guild-interior',questionType:'실전 유형 연습 · 인물 연결형',difficulty:'중',passage:'왕에게 시무 28조를 올려 유교적 통치 체제의 정비를 건의하였다.',question:'다음 인물과 관련된 왕으로 옳은 것은?',choices:['태조','광종','성종','공민왕'],answer:2,explanation:'최승로는 성종에게 시무 28조를 올렸고, 성종은 이를 받아들여 유교 정치 질서와 중앙 집권 체제를 정비하였다.',examKeywords:['최승로','시무 28조','성종','유교 정치'],rewardKnowledge:2,resumeStoryId:'ch03_history_reflection',examType:'한능검 기출 유형',source:'최승로와 성종의 관계를 바탕으로 자체 제작'}),
  question({questionId:'ch03-practice-04',chapterId:'ch04',relatedSceneId:'ch03_timeline_practice',relatedHistoricalEventId:'goryeo-early-kings',historicalEvent:'태조·광종·성종 정책 순서',relatedIllustrationId:'ch03-gaegyeong-982',questionType:'실전 유형 연습 · 시대 순서형',difficulty:'중상',passage:'ㄱ. 사심관 제도 실시\nㄴ. 노비안검법 실시\nㄷ. 12목에 지방관 파견',question:'다음 정책을 시대 순으로 옳게 나열한 것은?',choices:['ㄱ → ㄴ → ㄷ','ㄱ → ㄷ → ㄴ','ㄴ → ㄱ → ㄷ','ㄴ → ㄷ → ㄱ'],answer:0,explanation:'태조의 사심관 제도 → 광종의 노비안검법 → 성종의 12목 지방관 파견 순이다. CH.01부터 CH.04까지의 흐름이 태조 → 광종 → 성종으로 이어진다.',examKeywords:['태조 사심관','광종 노비안검법','성종 12목','왕별 업적'],rewardKnowledge:3,resumeStoryId:'ch03_courtyard',examType:'실전 유형 연습',source:'CH.01~04의 고려 초기 정책 흐름을 바탕으로 자체 제작'})
);

const ch03Scene=data=>scene({chapterId:'ch04',historicalEventId:'seongjong-state-system',year:982,...data});
const CH03_STORIES={
  ch03_transition:ch03Scene({sceneId:'ch03_transition',location:'시간의 흐름',title:'스물두 번의 겨울',illustrationId:'ch03-gaegyeong-982',timeOfDay:'dawn',sceneEffect:'blackout',autoAdvanceDelays:[900,1150,1250,1450],continueLabel:'982년의 개경으로',cinematicStatus:'세월이 흐르는 중…',cinematicSub:'도시는 커졌고, 사람의 시간은 멈추지 않았다.',enterCharacterStates:{player:{characterAge:23,characterEraVariant:'unchanged'},doyun:{characterAge:90,characterEraVariant:'guild-founder',ageVariant:'elder_982',outfit:'guild_master',isAlive:true},hyunwoo:{characterAge:47,characterEraVariant:'middle-official',ageVariant:'middle_982',outfit:'official_scholar'}},doyunLegacy:{merchantGuild:true,name:'도윤상단'},dialogue:'계절이 또 수십 번 바뀌었다.\n거리에는 처음 보는 얼굴들이 늘어났고,\n익숙했던 얼굴들은 하나둘 사라졌다.\n982년 — 개경',nextStoryId:'ch03_gaegyeong'}),
  ch03_gaegyeong:ch03Scene({sceneId:'ch03_gaegyeong',location:'982년 · 개경',title:'커진 수도',illustrationId:'ch03-gaegyeong-982',timeOfDay:'morning',dialogue:'궁궐과 관청, 기와지붕과 상점이 늘어난 개경에는 새 왕의 제도 정비 소문이 번지고 있었다.',nextStoryId:'ch03_guild_exterior'}),
  ch03_guild_exterior:ch03Scene({sceneId:'ch03_guild_exterior',location:'개경 · 도윤상단',title:'이름을 건 상단',illustrationId:'ch03-doyun-guild-exterior',timeOfDay:'afternoon',doyunLegacy:{merchantGuild:true,name:'도윤상단'},dialogue:'한때 작은 좌판과 가게였던 자리에, 도윤의 이름을 건 상단이 들어서 있었다.',nextStoryId:'ch03_dream_realized'}),
  ch03_dream_realized:ch03Scene({sceneId:'ch03_dream_realized',location:'도윤상단 · 안채',title:'결국 만들었네',illustrationId:'ch03-doyun-guild-interior',timeOfDay:'afternoon',sharedEvent:'doyun_guild_dream_realized',dialogue:'도윤이 평생 품었던 꿈은 장부와 물품, 분주한 사람들의 발걸음이 되어 눈앞에 남았다.',nextStoryId:'ch03_unchanged'}),
  ch03_unchanged:ch03Scene({sceneId:'ch03_unchanged',location:'도윤상단 · 안채',title:'흐른 사람, 멈춘 사람',illustrationId:'ch03-doyun-guild-interior',timeOfDay:'late-afternoon',dialogue:'잠시 웃음이 멎자, 도윤은 아주 오래 주인공의 얼굴을 바라보았다.',nextStoryId:'ch03_returning_merchant'}),
  ch03_returning_merchant:ch03Scene({sceneId:'ch03_returning_merchant',location:'도윤상단 · 마당',title:'절반만 돌아온 짐',illustrationId:'ch03-returning-merchant',timeOfDay:'afternoon',dialogue:'지방으로 떠났던 상인이 먼지투성이가 된 수레와 함께 돌아왔다.',nextStoryId:'ch03_provincial_problem'}),
  ch03_provincial_problem:ch03Scene({sceneId:'ch03_provincial_problem',location:'지방으로 향하는 길 · 기억',title:'왕이 닿지 않는 곳',illustrationId:'ch03-provincial-strongman',timeOfDay:'memory',dialogue:'중앙에서 내려온 관리가 없는 고을에서는 지방 세력가가 길과 장사를 자기 뜻대로 막고 있었다.',nextStoryId:'ch03_policy_choice'}),
  ch03_policy_choice:ch03Scene({sceneId:'ch03_policy_choice',location:'도윤상단 · 안채',title:'상단의 대응',illustrationId:'ch03-doyun-guild-interior',timeOfDay:'evening',dialogue:'도윤이 상단의 앞날을 두고 주인공의 생각을 물었다.',choices:[
    choice('왕이 직접 관리하는 사람을 지방에 보내야 하지 않을까?','ch03_hyunwoo_return',{knowledge:1},{merchant:1},'중앙의 관리가 지방까지 내려가야 한다는 생각을 남겼다.',{trustChanges:{hyunwoo:1},importantChoice:'royal-local-officials',sharedEvents:['proposed_local_officials'],playerResponse:'왕이 직접 관리하는 사람을 지방에 보내야 하지 않을까?',playerExpression:'serious',responseText:'왕의 손이 지방까지 닿아야 한다는 말이군. 그리되면 우리도 숨통이 트이겠소.',responseCharacterId:'doyun',responseExpression:'serious',resultSceneId:'ch03-choice-officials',resultIllustrationId:'ch03-doyun-guild-interior'}),
    choice('그 지역 세력가와 적당히 타협하는 게 현실적이지.','ch03_hyunwoo_return',{wealth:2},{merchant:2,doyun:1},'당장의 거래를 지키는 현실적인 방법을 택했다.',{importantChoice:'local-compromise',sharedEvents:['compromised_with_local_power'],playerResponse:'그 지역 세력가와 적당히 타협하는 게 현실적이지.',playerExpression:'thinking',responseText:'장사만 보면 가장 빠른 길이오. 다만 매번 값을 치러야 하겠지.',responseCharacterId:'doyun',responseExpression:'tired',resultSceneId:'ch03-choice-compromise',resultIllustrationId:'ch03-doyun-guild-interior'}),
    choice('상단에서 사람을 고용해서 직접 지키자.','ch03_hyunwoo_return',{wealth:-2,fame:2},{merchant:2,doyun:1},'상단 스스로 교역로를 지키는 방법을 준비했다.',{importantChoice:'guild-guards',sharedEvents:['hired_guild_guards'],playerResponse:'상단에서 사람을 고용해서 직접 지키자.',playerExpression:'serious',responseText:'돈은 들겠지만 물건과 사람을 지킬 수는 있겠소. 준비해 보리다.',responseCharacterId:'doyun',responseExpression:'neutral',resultSceneId:'ch03-choice-guards',resultIllustrationId:'ch03-returning-merchant'})
  ]}),
  ch03_hyunwoo_return:ch03Scene({sceneId:'ch03_hyunwoo_return',location:'도윤상단 · 안채',title:'말하면 나타나는 사람',illustrationId:'ch03-doyun-guild-interior',timeOfDay:'evening',sharedEvent:'reunited_with_hyunwoo_982',dialogue:'상단의 소식을 들은 현우가 중년의 관리가 되어 다시 문을 넘었다.',nextStoryId:'ch03_seongjong_news'}),
  ch03_seongjong_news:ch03Scene({sceneId:'ch03_seongjong_news',location:'도윤상단 · 안채',title:'새 왕의 정비',illustrationId:'ch03-doyun-guild-interior',timeOfDay:'evening',historyDiscovery:{people:['성종'],cards:['seongjong-government'],historicalEvents:['seongjong-state-system']},historyCard:{title:'성종',body:'고려의 유교 정치 질서와 지방 통치 제도를 정비한 왕.'},dialogue:'현우는 새 왕 성종이 나라의 제도를 다시 세우려 한다고 전했다.',nextStoryId:'ch03_choe_reform'}),
  ch03_choe_reform:ch03Scene({sceneId:'ch03_choe_reform',location:'도윤상단 · 안채',title:'스물여덟 가지 건의',illustrationId:'ch03-doyun-guild-interior',timeOfDay:'night',historyDiscovery:{people:['최승로'],cards:['choe-seungro','simu-28'],historicalEvents:['choe-seungro-simu-28']},historyCard:{title:'최승로 · 시무 28조',body:'최승로가 성종에게 올린 개혁안. 유교 정치 질서와 중앙 집권 체제 정비에 영향을 주었다.'},dialogue:'최승로가 성종에게 올린 시무 28조는 고려를 다스릴 제도의 방향을 담고 있었다.',nextStoryId:'ch03_twelve_mok'}),
  ch03_twelve_mok:ch03Scene({sceneId:'ch03_twelve_mok',location:'도윤상단 · 마당',title:'지방에 내려간 관리',illustrationId:'ch03-returning-merchant',timeOfDay:'morning',historyDiscovery:{cards:['twelve-mok-governors'],historicalEvents:['seongjong-twelve-mok']},historyCard:{title:'12목 지방관 파견',body:'성종은 12목에 지방관을 파견해 지방 통치를 강화했다.'},dialogue:'며칠 뒤, 상단의 교역로에도 중앙에서 파견한 관리가 내려온다는 소식이 도착했다.',nextStoryId:'ch03_gukjagam'}),
  ch03_gukjagam:ch03Scene({sceneId:'ch03_gukjagam',location:'개경 · 국자감',title:'나라가 사람을 가르치는 곳',illustrationId:'ch03-gukjagam',timeOfDay:'morning',historyDiscovery:{cards:['gukjagam'],historicalEvents:['seongjong-gukjagam']},historyCard:{title:'국자감',body:'고려의 최고 교육 기관. 성종 때 설치되었다.'},dialogue:'현우는 주인공을 학생과 관리 후보들이 책을 읽는 교육 기관으로 데려갔다.',nextStoryId:'ch03_exam_75'}),
  ch03_exam_75:ch03Scene({sceneId:'ch03_exam_75',location:'역사 기억',title:'성종을 가리키는 세 단서',illustrationId:'ch03-gukjagam',timeOfDay:'memory',dialogue:'최승로, 시무 28조, 국자감. 세 단서가 한 왕의 이름으로 이어졌다.',quizId:'ch03-official-75-basic-10'}),
  ch03_policy_effect:ch03Scene({sceneId:'ch03_policy_effect',location:'도윤상단 · 마당',title:'제도가 길에 닿을 때',illustrationId:'ch03-returning-merchant',timeOfDay:'afternoon',dialogue:'중앙의 관리가 내려간다는 소식은 상단 사람들에게 장부 밖의 현실적인 안도가 되었다.',nextStoryId:'ch03_trade_practice'}),
  ch03_trade_practice:ch03Scene({sceneId:'ch03_trade_practice',location:'역사 기억',title:'상단이 겪은 지방의 문제',illustrationId:'ch03-provincial-strongman',timeOfDay:'memory',dialogue:'길을 막던 지방 세력과, 그곳에 없었던 중앙 관리의 모습이 겹쳐졌다.',quizId:'ch03-practice-02'}),
  ch03_three_friends:ch03Scene({sceneId:'ch03_three_friends',location:'도윤상단 · 안채',title:'세 사람의 저녁',illustrationId:'ch03-doyun-guild-interior',timeOfDay:'evening',dialogue:'정책 이야기가 끝난 뒤에도 세 사람의 오래된 말다툼은 쉽게 끝나지 않았다.',nextStoryId:'ch03_choe_practice'}),
  ch03_choe_practice:ch03Scene({sceneId:'ch03_choe_practice',location:'역사 기억',title:'개혁안을 올린 사람',illustrationId:'ch03-doyun-guild-interior',timeOfDay:'memory',dialogue:'성종에게 스물여덟 가지 개혁안을 올린 사람의 이름을 다시 떠올렸다.',quizId:'ch03-practice-03'}),
  ch03_history_reflection:ch03Scene({sceneId:'ch03_history_reflection',location:'982년 · 개경 거리',title:'세 왕이 만든 흐름',illustrationId:'ch03-gaegyeong-982',timeOfDay:'sunset',dialogue:'태조가 나라의 문을 열고, 광종이 왕의 힘을 세우고, 성종은 그 나라를 움직일 제도를 갖추었다.',nextStoryId:'ch03_timeline_practice'}),
  ch03_timeline_practice:ch03Scene({sceneId:'ch03_timeline_practice',location:'역사 기억',title:'태조에서 성종까지',illustrationId:'ch03-gaegyeong-982',timeOfDay:'memory',dialogue:'사심관, 노비안검법, 12목 지방관. 살아온 장면들이 시대의 순서로 나란히 놓였다.',quizId:'ch03-practice-04'}),
  ch03_courtyard:ch03Scene({sceneId:'ch03_courtyard',location:'도윤상단 · 마당',title:'처음에는 가게 하나였소',illustrationId:'ch03-doyun-courtyard',timeOfDay:'sunset',dialogue:'도윤은 상단 마당에 앉아 젊은 상인들이 물건을 옮기는 모습을 오래 바라보았다.',nextStoryId:'ch03_weakening'}),
  ch03_weakening:ch03Scene({sceneId:'ch03_weakening',location:'도윤상단 · 안채',title:'느려진 하루',illustrationId:'ch03-doyun-guild-interior',timeOfDay:'late-afternoon',enterCharacterStates:{doyun:{healthState:'frail',successorAssigned:true}},dialogue:'도윤은 상단의 일을 후계자에게 하나씩 넘겼다. 쓰러지거나 다친 것은 아니었다. 다만 하루를 건너는 일이 조금씩 느려졌다.',nextStoryId:'ch03_farewell'}),
  ch03_farewell:ch03Scene({sceneId:'ch03_farewell',location:'도윤상단 · 안채',title:'오래 산 사람의 마지막 농담',illustrationId:'ch03-doyun-farewell',timeOfDay:'night',sharedEvent:'doyun_final_conversation',dialogue:'깊은 저녁, 도윤과 주인공은 문이 열린 안채에서 상단의 불빛을 바라보았다.',nextStoryId:'ch03_death'}),
  ch03_death:ch03Scene({sceneId:'ch03_death',location:'시간의 흐름',title:'먼저 간 사람',illustrationId:'ch03-doyun-farewell',timeOfDay:'night',sceneEffect:'blackout',autoAdvanceDelays:[1000,1350,1600],continueLabel:'남겨진 곳으로',cinematicStatus:'밤이 깊어지는 중…',cinematicSub:'도윤은 긴 삶을 마치고 노환으로 조용히 눈을 감았다.',enterCharacterStates:{doyun:{isAlive:false,healthState:'deceased',deathCause:'old_age'}},doyunLegacy:{merchantGuild:true,name:'도윤상단'},dialogue:'그날 밤, 상단의 등불은 오래 꺼지지 않았다.\n도윤은 자신이 만든 것들 곁에서 긴 삶을 마쳤다.\n전쟁도 정치도 아닌, 오래 살아낸 사람의 마지막이었다.',nextStoryId:'ch03_legacy'}),
  ch03_legacy:ch03Scene({sceneId:'ch03_legacy',location:'개경 · 도윤상단 앞',title:'남겨진 것',illustrationId:'ch03-guild-legacy',timeOfDay:'dawn',continueLabel:'CHAPTER 결과 보기',enterCharacterStates:{doyun:{isAlive:false,healthState:'deceased',deathCause:'old_age'}},doyunLegacy:{merchantGuild:true,name:'도윤상단'},sharedEvent:'doyun_guild_legacy',completeChapter:true,dialogue:'도윤의 장례 뒤에도 도윤상단의 문은 열렸고, 사람들은 여전히 물건을 옮겼다.'})
};
Object.assign(STORIES,CH03_STORIES);

const CH03_DIALOGUES={
  ch03_transition:[
    dialogueLine('narrator','neutral','계절이 또 수십 번 바뀌었다.','narration'),
    dialogueLine('narrator','neutral','거리에는 처음 보는 얼굴들이 늘어났고,','narration'),
    dialogueLine('narrator','neutral','익숙했던 얼굴들은 하나둘 사라졌다.','narration'),
    dialogueLine('narrator','neutral','982년 — 개경','narration')
  ],
  ch03_gaegyeong:[dialogueLine('narrator','neutral','개경은 처음 보았던 송악의 거리보다 훨씬 크고 단단한 수도가 되어 있었다.','narration'),dialogueLine('player','thinking','또 이렇게 시간이 흘렀네.','thought')],
  ch03_guild_exterior:[dialogueLine('narrator','neutral','수레와 상인들이 드나드는 큰 문 위에 도윤상단이라는 이름이 걸려 있었다.','narration'),dialogueLine('player','smile','진짜 해냈구나.','thought')],
  ch03_dream_realized:[
    dialogueLine('player','smile','결국 만들었네.'),dialogueLine('doyun','neutral','뭘 말이오?'),dialogueLine('player','smile','네 상단.'),dialogueLine('doyun','smile','……삼십 년 걸렸다고 놀리던 놈이 누구였더라.'),dialogueLine('player','surprised','그걸 아직도 기억해?'),dialogueLine('doyun','laugh','늙었다고 기억까지 없어지는 줄 아시오?'),dialogueLine('player','embarrassed','아니, 그건 아닌데.'),dialogueLine('doyun','serious','그러면 쓸데없는 소리 말고 앉으시오.'),dialogueLine('narrator','neutral','주인공이 웃었다. 도윤은 결국 평생의 목표를 이루었다.','narration')
  ],
  ch03_unchanged:[
    dialogueLine('doyun','tired','나는 이렇게 늙었는데…….'),dialogueLine('player','worried','갑자기 왜 그래.'),dialogueLine('doyun','serious','자네는 정말 그대로군.'),dialogueLine('narrator','neutral','주인공은 대답하지 않았다.','narration'),dialogueLine('doyun','sad','처음 만났을 때도 그 얼굴이었소.'),dialogueLine('narrator','neutral','잠시 침묵이 흘렀다.','narration'),dialogueLine('doyun','serious','내가 죽고 나면 자네는 어쩔 생각이오?'),dialogueLine('player','worried','…….'),dialogueLine('player','worried','나는 도대체 언제까지 여기서 살아야 하지?','thought')
  ],
  ch03_returning_merchant:[dialogueLine('merchant','serious','주인어른, 이번에도 물건을 절반밖에 가져오지 못했습니다.','npc','상단 상인'),dialogueLine('doyun','serious','이번에는 또 무슨 일이오?'),dialogueLine('merchant','serious','고을의 세력가가 길을 막았습니다. 자기 허락 없이는 장사를 할 수 없다며 물건 일부를 내놓으라 했습니다.','npc','상단 상인')],
  ch03_provincial_problem:[dialogueLine('player','serious','관리는?'),dialogueLine('merchant','neutral','그 고을에는 중앙에서 내려온 관리가 없습니다.','npc','상단 상인'),dialogueLine('doyun','tired','왕이 개경에 있어도 지방에서는 여전히 제멋대로인 자들이 많소.'),dialogueLine('player','thinking','왕이 있어도 지방까지 닿지 않으면 상인의 길 하나도 지키기 어렵다.','thought')],
  ch03_policy_choice:[dialogueLine('doyun','serious','자네라면 어떻게 하겠소?')],
  ch03_hyunwoo_return:[dialogueLine('hyunwoo','serious','그 문제 때문에 조정에서도 말이 많습니다.'),dialogueLine('player','surprised','현우?'),dialogueLine('doyun','smile','양반은 말만 하면 나타나는 재주가 있소?'),dialogueLine('hyunwoo','neutral','상단에서 사람이 왔다기에 들렀을 뿐입니다.'),dialogueLine('player','smile','둘이 아직도 저러네.'),dialogueLine('doyun','laugh','나는 친해진 적 없다니까.'),dialogueLine('hyunwoo','smile','저도 마찬가지입니다.')],
  ch03_seongjong_news:[dialogueLine('hyunwoo','serious','새 왕께서 나라의 제도를 다시 정비하려 하고 있습니다.'),dialogueLine('player','thinking','성종?'),dialogueLine('hyunwoo','neutral','그렇습니다.')],
  ch03_choe_reform:[dialogueLine('hyunwoo','thinking','최승로라는 사람이 왕에게 여러 개혁안을 올렸습니다.'),dialogueLine('narrator','neutral','[HISTORY DISCOVERED] 최승로 · 시무 28조','narration'),dialogueLine('hyunwoo','serious','유교적 통치 질서를 세우고, 중앙에서 나라를 더 고르게 다스리자는 뜻이 담겼습니다.'),dialogueLine('player','thinking','상단이 겪은 문제랑도 이어지네.','thought')],
  ch03_twelve_mok:[dialogueLine('merchant','neutral','주인어른, 그 지역에도 이제 중앙에서 관리가 내려온답니다.','npc','상단 상인'),dialogueLine('doyun','surprised','정말이오?'),dialogueLine('hyunwoo','serious','12목에 지방관을 파견하기 시작한 것입니다.'),dialogueLine('player','thinking','왕이 지방까지 직접 관리하기 시작한 거구나.'),dialogueLine('hyunwoo','neutral','그렇습니다. 지방 세력에게만 맡겨 두었던 나라를 중앙에서 직접 다스리려는 것이지요.'),dialogueLine('doyun','smile','우리 상단에는 좋은 소식이군.')],
  ch03_gukjagam:[dialogueLine('hyunwoo','serious','나라가 사람을 뽑는 것만으로는 부족합니다.'),dialogueLine('hyunwoo','thinking','그 사람들을 가르칠 곳도 필요하지요.'),dialogueLine('player','thinking','국자감…….'),dialogueLine('hyunwoo','smile','앞으로 고려를 이끌 사람들이 공부하게 될 곳입니다.'),dialogueLine('narrator','neutral','[HISTORY DISCOVERED] 국자감 · 고려의 최고 교육 기관','narration')],
  ch03_exam_75:[dialogueLine('player','serious','최승로, 시무 28조, 국자감. 이건 성종을 가리키는 단서야.','thought')],
  ch03_policy_effect:[dialogueLine('merchant','neutral','길목에 관리가 오면 함부로 물건을 빼앗기도 어려워질 겁니다.','npc','상단 상인'),dialogueLine('doyun','weak_smile','종이 위의 제도가 장사꾼의 길까지 닿는 날도 오는군.'),dialogueLine('player','thinking','12목 지방관 파견이 왜 필요했는지, 이제 장면으로 기억난다.','thought')],
  ch03_trade_practice:[dialogueLine('player','serious','중앙 관리가 없던 지방과 12목. 두 장면을 이어 보자.','thought')],
  ch03_three_friends:[dialogueLine('player','smile','이제 둘이 좀 친해졌다고 인정하지?'),dialogueLine('doyun','serious','쓸데없는 소리 마시오.'),dialogueLine('hyunwoo','smile','그리 단순한 문제는 아니오.'),dialogueLine('player','embarrassed','정책 얘기도 아닌데 왜 그렇게 진지해.'),dialogueLine('doyun','laugh','저 양반은 원래 저렇소.')],
  ch03_choe_practice:[dialogueLine('player','serious','시무 28조를 올린 최승로와 그 제안을 받아들인 왕을 연결해 보자.','thought')],
  ch03_history_reflection:[dialogueLine('hyunwoo','serious','태조께서 나라의 기반을 마련하고, 광종께서 왕권을 세웠다면, 성종께서는 제도를 갖추려는 것이오.'),dialogueLine('player','thinking','내가 지나온 시간이 그대로 시험의 흐름이 됐네.','thought')],
  ch03_timeline_practice:[dialogueLine('player','serious','태조, 광종, 성종. 사심관, 노비안검법, 12목을 순서대로 놓자.','thought')],
  ch03_courtyard:[dialogueLine('doyun','tired','처음에는 가게 하나였소.'),dialogueLine('player','neutral','알아.'),dialogueLine('doyun','smile','자네가 삼십 년이나 걸렸다고 놀렸지.'),dialogueLine('player','embarrassed','그 얘기를 죽을 때까지 할 거야?'),dialogueLine('doyun','laugh','죽을 때까지 할 생각이었는데.'),dialogueLine('narrator','neutral','잠시 침묵이 흘렀다.','narration'),dialogueLine('doyun','weak_smile','아무래도 정말 그렇게 됐군.')],
  ch03_weakening:[dialogueLine('narrator','neutral','도윤은 후계자에게 장부와 사람을 맡기고, 마당에 앉아 보내는 시간이 길어졌다.','narration'),dialogueLine('doyun','tired','이제는 내가 없어도 상단이 잘 돌아가겠소.'),dialogueLine('player','worried','그런 말 하지 마.'),dialogueLine('doyun','weak_smile','해야 할 말은 제때 해 두는 것이 장사꾼의 버릇이오.')],
  ch03_farewell:[dialogueLine('doyun','tired','처음 봤을 때는 이상한 옷을 입고 쓰러져 있더니…….'),dialogueLine('player','worried','또 그 얘기야?'),dialogueLine('doyun','weak_smile','이제는 마지막일지도 모르는데 들어주시오.'),dialogueLine('narrator','neutral','주인공은 아무 말도 하지 않았다.','narration'),dialogueLine('doyun','sad','결국 내가 먼저 가는군.'),dialogueLine('player','sad','…….'),dialogueLine('doyun','serious','그 표정 하지 마시오. 나는 꽤 오래 살았소.'),dialogueLine('doyun','weak_smile','가게도 만들었고. 상단도 만들었고. 먹고 싶은 것도 많이 먹었고.'),dialogueLine('player','sad','그게 마지막에 할 말이냐.'),dialogueLine('doyun','laugh','중요한 일이오.'),dialogueLine('doyun','sad','그런데 자네는……. 얼마나 더 살아야 하는 거요?'),dialogueLine('player','worried','…….')],
  ch03_death:[dialogueLine('narrator','neutral','그날 밤, 상단의 등불은 오래 꺼지지 않았다.','narration'),dialogueLine('narrator','neutral','도윤은 자신이 만든 것들 곁에서 긴 삶을 마쳤다.','narration'),dialogueLine('narrator','neutral','전쟁도 정치도 아닌, 오래 살아낸 사람의 마지막이었다.','narration')],
  ch03_legacy:[dialogueLine('player','sad','도윤은 사라졌지만.','thought'),dialogueLine('player','serious','도윤이 만든 것은 남아 있었다.','thought'),dialogueLine('narrator','neutral','사람들은 여전히 물건을 옮겼고, 도윤상단은 계속 움직였다.','narration'),dialogueLine('player','worried','그리고 나는…….','thought'),dialogueLine('player','worried','여전히 그대로였다.','thought')]
};
Object.entries(CH03_DIALOGUES).forEach(([sceneId,dialogues])=>{STORIES[sceneId].dialogues=dialogues});
Object.values(CH03_STORIES).forEach(s=>{const asset=ASSETS[s.illustrationId];s.backgroundImage=asset?.src||null});
