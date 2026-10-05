/* Era identities are independent. Goryeo's legacy IDs/save data remain unchanged.
 * Future chapters must opt into an era and an explicit event background;
 * a hero is a cover illustration, never a default background for every scene.
 */
const ERA_PROTAGONISTS = {
  protagonist_goryeo: {
    id:'protagonist_goryeo', era:'goryeo', gender:'male', legacyCharacterId:'player',
    baseAppearance:'기존 고려편 남성 주인공: 검은 헝클어진 머리, 기존 얼굴과 여행자 복식 유지',
    outfits:{goryeo:'기존 고려편 여행자 복식', modern:'기존 프롤로그 현대 복식'},
    expressions:['neutral'],
    legacyExpressionPortraits:Object.keys(PORTRAITS).filter(id=>id.startsWith('player_goryeo_')),
    ageState:{kind:'existing-story',description:'기존 불로 설정과 저장 상태 유지'},
    assetPaths:{neutral:PORTRAITS.player_goryeo_neutral.src, hero:'assets/editorial/heroes/goryeo.webp'},
    status:'playable'
  },
  protagonist_joseon: {
    id:'protagonist_joseon',era:'joseon',gender:'female',
    baseAppearance:'타원형 얼굴, 따뜻하고 가는 눈매, 짙은 갈색의 긴 땋은 머리와 소박한 붉은 댕기',
    outfits:{earlyJoseon:'수수한 긴 소색 저고리와 적갈색 치마, 글과 종이를 담는 작은 보따리 가방'},
    expressions:['neutral'],ageState:{kind:'concept',age:24},
    assetPaths:{neutral:'assets/editorial/protagonists/joseon-neutral.webp',hero:'assets/editorial/heroes/joseon.webp'},
    role:'글을 읽고 쓰는 평민 여성의 시선으로 역사를 경험하는 기록자',status:'preview'
  },
  protagonist_korean_empire: {
    id:'protagonist_korean_empire',era:'empire',gender:'male',
    baseAppearance:'긴 각진 얼굴, 곧은 콧날, 깔끔한 가르마의 짧은 검은 머리',
    outfits:{jeongdong1905:'남색 근대식 양복과 높은 흰 옷깃, 차분한 넥타이, 가죽 서류 가방'},
    expressions:['neutral'],ageState:{kind:'concept',age:27},
    assetPaths:{neutral:'assets/editorial/protagonists/empire-neutral.webp',hero:'assets/editorial/heroes/empire.webp'},
    role:'근대화와 외세 사이의 변화를 기록하는 청년',status:'preview'
  },
  protagonist_occupation: {
    id:'protagonist_occupation',era:'occupation',gender:'female',
    baseAppearance:'부드러운 사각형 얼굴과 곧은 눈썹, 귀 뒤로 넘긴 턱 길이의 단발',
    outfits:{gyeongseong1930:'크림색 블라우스, 차분한 회청색 긴 치마, 책가방과 수첩'},
    expressions:['neutral'],ageState:{kind:'concept',age:25},
    assetPaths:{neutral:'assets/editorial/protagonists/occupation-neutral.webp',hero:'assets/editorial/heroes/occupation.webp'},
    role:'일상의 억압 속에서도 삶과 시대를 기록하는 여성',status:'preview'
  },
  protagonist_republic: {
    id:'protagonist_republic',era:'republic',gender:'male',
    baseAppearance:'넓은 얼굴, 무쌍 눈매, 옆머리가 짧게 정돈된 짧은 검은 머리',
    outfits:{seoul2020:'회청색 현대 재킷, 회색 티셔츠, 검은 현대식 배낭'},
    expressions:['neutral'],ageState:{kind:'concept',age:22},
    assetPaths:{neutral:'assets/editorial/protagonists/republic-neutral.webp',hero:'assets/editorial/heroes/republic.webp'},
    role:'변화하는 대한민국의 일상과 역사를 만나는 청년',status:'preview'
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
