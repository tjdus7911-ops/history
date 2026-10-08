/* Era identities are independent. Goryeo's legacy IDs/save data remain unchanged.
 * Future chapters must opt into an era and an explicit event background;
 * a hero is a cover illustration, never a default background for every scene.
 */
const ERA_PROTAGONISTS = {
  protagonist_proto_kingdoms: {
    id:'protagonist_proto_kingdoms',era:'proto-kingdoms',gender:'UNSPECIFIED',
    baseAppearance:null,outfits:{},expressions:[],assetPaths:{},
    displayName:null,defaultTitle:'원삼국편 주인공',basePose:null,dialogueStyle:null,relationshipIds:[],
    role:null,status:'asset-pending',appearanceLocked:false
  },
  protagonist_three_kingdoms: {
    id:'protagonist_three_kingdoms',era:'three-kingdoms',gender:'UNSPECIFIED',
    baseAppearance:null,outfits:{},expressions:[],assetPaths:{},
    displayName:null,defaultTitle:'삼국편 주인공',basePose:null,dialogueStyle:null,relationshipIds:[],
    role:null,status:'asset-pending',appearanceLocked:false
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
  'goryeo-gaegyeong-cover':{id:'goryeo-gaegyeong-cover',era:'goryeo',yearRange:[1000,1099],location:'gaegyeong',event:'era-cover',timeOfDay:'day',src:'assets/editorial/heroes/goryeo.webp',usage:'cover',includesProtagonist:true},
  'joseon-hanyang-1398':{id:'joseon-hanyang-1398',era:'joseon',yearRange:[1395,1398],location:'hanyang-market-palace',event:'early-hanyang',timeOfDay:'late-morning',src:'assets/editorial/backgrounds/joseon-hanyang-1398.webp',usage:'concept',includesProtagonist:false},
  'empire-jeongdong-1905':{id:'empire-jeongdong-1905',era:'empire',yearRange:[1899,1905],location:'jeongdong',event:'modern-city-life',timeOfDay:'sunset',src:'assets/editorial/backgrounds/empire-jeongdong-1905.webp',usage:'concept',includesProtagonist:false},
  'occupation-gyeongseong-1930':{id:'occupation-gyeongseong-1930',era:'occupation',yearRange:[1926,1935],location:'gyeongseong-school-street',event:'daily-life-under-occupation',timeOfDay:'day',src:'assets/editorial/backgrounds/occupation-gyeongseong-1930.webp',usage:'concept',includesProtagonist:false},
  'republic-seoul-2020':{id:'republic-seoul-2020',era:'republic',yearRange:[2020,2026],location:'seoul-han-river',event:'contemporary-daily-life',timeOfDay:'blue-hour',src:'assets/editorial/backgrounds/republic-seoul-2020.webp',usage:'concept',includesProtagonist:false}
};
const ERA_VISUALS = {
  'proto-kingdoms':{protagonistId:'protagonist_proto_kingdoms',backgroundId:null},
  'three-kingdoms':{protagonistId:'protagonist_three_kingdoms',backgroundId:null},
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
