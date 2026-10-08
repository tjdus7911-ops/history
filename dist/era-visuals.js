/* Era identities are independent. Goryeo's legacy IDs/save data remain unchanged.
 * Future chapters must opt into an era and an explicit event background;
 * a hero is a cover illustration, never a default background for every scene.
 */
const ERA_PROTAGONISTS = {
  protagonist_proto_kingdoms: {
    id:'protagonist_proto_kingdoms',era:'proto-kingdoms',gender:'male',
    baseAppearance:'짧게 넘긴 검은 머리와 차분한 인상의 20대 남성 시간 여행자',outfits:{modern:'남색 재킷과 후드, 청바지, 운동화',historical:'이끼색·갈색·먹색의 초기 국가 시대 여행복'},
    expressions:['neutral','smile','surprised','embarrassed','suspicious','angry','sad','determined','fear','worried','relieved'],
    assetPaths:Object.fromEntries(['neutral','smile','surprised','embarrassed','suspicious','angry','sad','determined','fear','worried','relieved'].map(expression=>[expression,`assets/ancient/characters/proto-player-${expression}.png`]).concat([['modern','assets/ancient/characters/proto-player-modern.png'],['hero','assets/ancient/heroes/proto-kingdoms.jpg']])),
    displayName:'나',defaultTitle:'원삼국편 남성 주인공',basePose:'standing',dialogueStyle:'관찰한 생활 풍습을 공간과 이유로 연결한다',relationshipIds:['proto_guide','proto_warrior','proto_villager','proto_priest'],
    ageState:{kind:'time-traveler',age:24,description:'현대에서 이동한 같은 인물. 역사 속 NPC는 자기 시대에만 등장한다.'},role:'여러 초기 국가의 생활과 정치 구조를 기록하는 여행자',status:'playable',appearanceLocked:true
  },
  protagonist_three_kingdoms: {
    id:'protagonist_three_kingdoms',era:'three-kingdoms',gender:'female',
    baseAppearance:'높게 땋아 묶은 검은 머리와 또렷한 눈매의 20대 여성 시간 여행자',outfits:{modern:'청록색 필드 재킷과 청바지, 운동화',historical:'청록·벽돌색·소색의 삼국 시대 여행복'},
    expressions:['neutral','smile','surprised','embarrassed','suspicious','angry','sad','determined','fear','worried','relieved'],
    assetPaths:Object.fromEntries(['neutral','smile','surprised','embarrassed','suspicious','angry','sad','determined','fear','worried','relieved'].map(expression=>[expression,`assets/ancient/characters/three-player-${expression}.png`]).concat([['modern','assets/ancient/characters/three-player-modern.png'],['hero','assets/ancient/heroes/three-kingdoms.jpg']])),
    displayName:'나',defaultTitle:'삼국편 여성 주인공',basePose:'standing',dialogueStyle:'정책과 전쟁의 원인·전개·결과를 기록한다',relationshipIds:['three_companion','three_goguryeo','three_baekje','three_silla','three_gaya','three_balhae','three_cheonghae'],
    ageState:{kind:'time-traveler',age:23,description:'현대에서 이동한 같은 인물. 해솔은 기억의 길 안내자이며 역사 속 NPC가 아니다.'},role:'삼국 경쟁에서 남북국과 바닷길까지 연결하는 기록자',status:'playable',appearanceLocked:true
  },
  protagonist_goryeo: {
    id:'protagonist_goryeo', era:'goryeo', gender:'male', legacyCharacterId:'player',
    baseAppearance:'기존 고려편 남성 주인공: 검은 헝클어진 머리, 기존 얼굴과 여행자 복식 유지',
    outfits:{goryeo:'기존 고려편 여행자 복식', modern:'기존 프롤로그 현대 복식'},
    expressions:['neutral'],
    legacyExpressionPortraits:Object.keys(PORTRAITS).filter(id=>id.startsWith('player_goryeo_')),
    ageState:{kind:'existing-story',description:'기존 불로 설정과 저장 상태 유지'},displayName:'나',defaultTitle:'고려편 주인공',basePose:'standing',dialogueStyle:'기존 고려편 대사 유지',relationshipIds:['doyun','village','merchant','royal','citizens','hyunwoo'],
    assetPaths:{neutral:PORTRAITS.player_goryeo_neutral.src, hero:'assets/editorial/heroes/goryeo.webp'},
    status:'playable'
  },
  protagonist_joseon: {
    id:'protagonist_joseon',era:'joseon',gender:'female',
    baseAppearance:'타원형 얼굴, 따뜻하고 가는 눈매, 짙은 갈색의 긴 땋은 머리와 소박한 붉은 댕기',
    outfits:{earlyJoseon:'수수한 긴 소색 저고리와 적갈색 치마, 글과 종이를 담는 작은 보따리 가방'},
    expressions:['neutral','smile','laugh','surprised','shock','worried','fear','sad','crying','angry','determined','thinking','confused','relieved','tired'],ageState:{kind:'persistent',age:24,description:'CH.00부터 CH.22까지 같은 얼굴과 나이를 유지하는 시간 여행자'},displayName:'나',defaultTitle:'조선편 주인공',basePose:'standing',dialogueStyle:'기존 조선편 대사 유지',relationshipIds:[],
    assetPaths:{neutral:'assets/editorial/protagonists/joseon-neutral.webp',smile:'assets/joseon/protagonist/smile.webp',laugh:'assets/joseon/protagonist/laugh.webp',surprised:'assets/joseon/protagonist/surprised.webp',shock:'assets/joseon/protagonist/shock.webp',worried:'assets/joseon/protagonist/worried.webp',fear:'assets/joseon/protagonist/fear.webp',sad:'assets/joseon/protagonist/sad.webp',crying:'assets/joseon/protagonist/crying.webp',angry:'assets/joseon/protagonist/angry.webp',determined:'assets/joseon/protagonist/determined.webp',thinking:'assets/joseon/protagonist/thinking.webp',confused:'assets/joseon/protagonist/confused.webp',relieved:'assets/joseon/protagonist/relieved.webp',tired:'assets/joseon/protagonist/tired.webp',hero:'assets/editorial/heroes/joseon.webp'},
    role:'글을 읽고 쓰는 평민 여성의 시선으로 역사를 경험하는 기록자',status:'playable'
  },
  protagonist_korean_empire: {
    id:'protagonist_korean_empire',era:'empire',gender:'UNSPECIFIED',
    baseAppearance:null,outfits:{},expressions:[],ageState:{kind:'undecided'},displayName:null,defaultTitle:'대한제국편 주인공',basePose:null,dialogueStyle:null,relationshipIds:[],
    assetPaths:{},conceptAssetPaths:{neutral:'assets/editorial/protagonists/empire-neutral.webp'},
    role:null,status:'concept-pending',appearanceLocked:false
  },
  protagonist_occupation: {
    id:'protagonist_occupation',era:'occupation',gender:'UNSPECIFIED',
    baseAppearance:null,outfits:{},expressions:[],ageState:{kind:'undecided'},displayName:null,defaultTitle:'일제강점기편 주인공',basePose:null,dialogueStyle:null,relationshipIds:[],
    assetPaths:{},conceptAssetPaths:{neutral:'assets/editorial/protagonists/occupation-neutral.webp'},
    role:null,status:'concept-pending',appearanceLocked:false
  },
  protagonist_republic: {
    id:'protagonist_republic',era:'republic',gender:'UNSPECIFIED',
    baseAppearance:null,outfits:{},expressions:[],ageState:{kind:'undecided'},displayName:null,defaultTitle:'대한민국편 주인공',basePose:null,dialogueStyle:null,relationshipIds:[],
    assetPaths:{},conceptAssetPaths:{neutral:'assets/editorial/protagonists/republic-neutral.webp'},
    role:null,status:'concept-pending',appearanceLocked:false
  }
};
const ERA_BACKGROUNDS = {
  'proto-forest-road':{id:'proto-forest-road',era:'proto-kingdoms',yearRange:[-100,350],location:'early-states-route',event:'early-states',timeOfDay:'day',src:'assets/ancient/backgrounds/proto-forest-road.jpg',usage:'story',includesProtagonist:false},
  'proto-buyeo-village':{id:'proto-buyeo-village',era:'proto-kingdoms',yearRange:[-100,200],location:'buyeo',event:'buyeo-life',timeOfDay:'day',src:'assets/ancient/backgrounds/proto-buyeo-village.jpg',usage:'story',includesProtagonist:false},
  'proto-goguryeo-fortress':{id:'proto-goguryeo-fortress',era:'proto-kingdoms',yearRange:[-37,400],location:'early-goguryeo',event:'early-goguryeo',timeOfDay:'day',src:'assets/ancient/backgrounds/proto-goguryeo-fortress.jpg',usage:'story',includesProtagonist:false},
  'proto-okjeo-coast':{id:'proto-okjeo-coast',era:'proto-kingdoms',yearRange:[-100,250],location:'okjeo',event:'okjeo-life',timeOfDay:'day',src:'assets/ancient/backgrounds/proto-okjeo-coast.jpg',usage:'story',includesProtagonist:false},
  'proto-dongye-boundary':{id:'proto-dongye-boundary',era:'proto-kingdoms',yearRange:[-100,250],location:'dongye',event:'dongye-life',timeOfDay:'day',src:'assets/ancient/backgrounds/proto-dongye-boundary.jpg',usage:'story',includesProtagonist:false},
  'proto-samhan-market':{id:'proto-samhan-market',era:'proto-kingdoms',yearRange:[-100,350],location:'samhan',event:'samhan-life',timeOfDay:'day',src:'assets/ancient/backgrounds/proto-samhan-market.jpg',usage:'story',includesProtagonist:false},
  'three-border-market':{id:'three-border-market',era:'three-kingdoms',yearRange:[194,676],location:'three-kingdoms-border',event:'competition',timeOfDay:'day',src:'assets/ancient/backgrounds/three-border-market.jpg',usage:'story',includesProtagonist:false},
  'three-han-river':{id:'three-han-river',era:'three-kingdoms',yearRange:[371,700],location:'han-river',event:'han-river',timeOfDay:'day',src:'assets/ancient/backgrounds/three-han-river.jpg',usage:'story',includesProtagonist:false},
  'three-gaya-workshop':{id:'three-gaya-workshop',era:'three-kingdoms',yearRange:[250,562],location:'gaya',event:'iron-trade',timeOfDay:'day',src:'assets/ancient/backgrounds/three-gaya-workshop.jpg',usage:'story',includesProtagonist:false},
  'three-sabi-fortress':{id:'three-sabi-fortress',era:'three-kingdoms',yearRange:[475,663],location:'baekje',event:'baekje',timeOfDay:'day',src:'assets/ancient/backgrounds/three-sabi-fortress.jpg',usage:'story',includesProtagonist:false},
  'three-pyongyang-fortress':{id:'three-pyongyang-fortress',era:'three-kingdoms',yearRange:[427,670],location:'goguryeo',event:'goguryeo',timeOfDay:'day',src:'assets/ancient/backgrounds/three-pyongyang-fortress.jpg',usage:'story',includesProtagonist:false},
  'three-unified-capitals':{id:'three-unified-capitals',era:'three-kingdoms',yearRange:[400,900],location:'silla',event:'silla-state',timeOfDay:'day',src:'assets/ancient/backgrounds/three-unified-capitals.jpg',usage:'story',includesProtagonist:false},
  'three-balhae-harbor':{id:'three-balhae-harbor',era:'three-kingdoms',yearRange:[698,926],location:'north-south-sea',event:'balhae-maritime',timeOfDay:'day',src:'assets/ancient/backgrounds/three-balhae-harbor.jpg',usage:'story',includesProtagonist:false},
  'goryeo-gaegyeong-cover':{id:'goryeo-gaegyeong-cover',era:'goryeo',yearRange:[1000,1099],location:'gaegyeong',event:'era-cover',timeOfDay:'day',src:'assets/editorial/heroes/goryeo.webp',usage:'cover',includesProtagonist:true},
  'joseon-hanyang-1398':{id:'joseon-hanyang-1398',era:'joseon',yearRange:[1395,1398],location:'hanyang-market-palace',event:'early-hanyang',timeOfDay:'late-morning',src:'assets/editorial/backgrounds/joseon-hanyang-1398.webp',usage:'concept',includesProtagonist:false},
  'empire-jeongdong-1905':{id:'empire-jeongdong-1905',era:'empire',yearRange:[1899,1905],location:'jeongdong',event:'modern-city-life',timeOfDay:'sunset',src:'assets/editorial/backgrounds/empire-jeongdong-1905.webp',usage:'concept',includesProtagonist:false},
  'occupation-gyeongseong-1930':{id:'occupation-gyeongseong-1930',era:'occupation',yearRange:[1926,1935],location:'gyeongseong-school-street',event:'daily-life-under-occupation',timeOfDay:'day',src:'assets/editorial/backgrounds/occupation-gyeongseong-1930.webp',usage:'concept',includesProtagonist:false},
  'republic-seoul-2020':{id:'republic-seoul-2020',era:'republic',yearRange:[2020,2026],location:'seoul-han-river',event:'contemporary-daily-life',timeOfDay:'blue-hour',src:'assets/editorial/backgrounds/republic-seoul-2020.webp',usage:'concept',includesProtagonist:false}
};
const ERA_VISUALS = {
  'proto-kingdoms':{protagonistId:'protagonist_proto_kingdoms',backgroundId:'proto-forest-road'},
  'three-kingdoms':{protagonistId:'protagonist_three_kingdoms',backgroundId:'three-border-market'},
  goryeo:{protagonistId:'protagonist_goryeo',backgroundId:'goryeo-gaegyeong-cover'},
  joseon:{protagonistId:'protagonist_joseon',backgroundId:'joseon-hanyang-1398'},
  empire:{protagonistId:'protagonist_korean_empire',backgroundId:'empire-jeongdong-1905'},
  occupation:{protagonistId:'protagonist_occupation',backgroundId:'occupation-gyeongseong-1930'},
  republic:{protagonistId:'protagonist_republic',backgroundId:'republic-seoul-2020'}
};
function eraProtagonist(era){return ERA_PROTAGONISTS[ERA_VISUALS[era]?.protagonistId]||null}
/* Strict lookup prevents cross-era fallbacks and reuse across unrelated events.
 * New story assets must be explicitly marked usage:'story' after scene review.
 */
function eraSceneVisuals(era,{backgroundId,year,location,event,expression='neutral',outfit}={}){
  const character=eraProtagonist(era),background=ERA_BACKGROUNDS[backgroundId];
  if(!character||!background||background.era!==era||background.usage!=='story')return null;
  if(!Number.isFinite(year)||year<background.yearRange[0]||year>background.yearRange[1]||location!==background.location||event!==background.event)return null;
  if(!Object.hasOwn(character.outfits,outfit)||!character.expressions.includes(expression))return null;
  return {protagonistId:character.id,portrait:character.assetPaths[expression],background:background.src};
}
