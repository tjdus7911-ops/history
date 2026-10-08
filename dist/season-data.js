/* Seven-season story foundation. Existing Goryeo/Joseon content stays in its
 * original files; this registry only connects independent season identities,
 * progress keys and replaceable presentation assets.
 */
const HISTORY_SEASON_STATUS={AVAILABLE:'AVAILABLE',COMING_SOON:'COMING_SOON'};
const historySeasonChapterIds=seasonId=>Object.values(CHAPTERS).filter(chapter=>(chapter.eraId||'goryeo')===seasonId).sort((a,b)=>Number(a.number)-Number(b.number)).map(chapter=>chapter.chapterId);
const historySeasonCharacterIds=(seasonId,protagonistId)=>{const chapterIds=new Set(historySeasonChapterIds(seasonId)),ids=new Set([protagonistId]);for(const story of Object.values(STORIES))if(chapterIds.has(story.chapterId))for(const line of story.dialogues||[])if(line.characterId&&line.characterId!=='narrator')ids.add(line.characterId);return [...ids]};
const historySeason=(config)=>({...config,chapterIds:historySeasonChapterIds(config.id),characterIds:historySeasonCharacterIds(config.id,config.protagonistId)});

const HISTORY_SEASONS=[
 historySeason({id:'proto-kingdoms',title:'눈떠보니 원삼국',name:'원삼국',era:'고조선 멸망 전후부터 삼국 성장 이전',years:'고조선 멸망 전후 — 삼국 성장 이전',order:1,description:'부여·초기 고구려·옥저·동예·삼한의 정치와 생활을 만나는 시즌입니다.',topics:['부여','초기 고구려','옥저','동예','삼한','정치 구조','경제·사회 풍습','제천 행사','삼국 성장의 기반'],protagonistId:'protagonist_proto_kingdoms',protagonistLabel:'새 주인공 · 설정 준비 중',bannerAsset:null,backgroundAssets:[],status:HISTORY_SEASON_STATUS.COMING_SOON,progressKey:'proto-kingdoms',accent:'#6f6041',placeholderMark:'原'}),
 historySeason({id:'three-kingdoms',title:'눈떠보니 삼국',name:'삼국',era:'삼국 성장부터 남북국 시대',years:'삼국 성장 — 남북국 시대',order:2,description:'고구려·백제·신라·가야의 경쟁과 통일신라·발해의 흐름을 잇는 시즌입니다.',topics:['고구려','백제','신라','가야','삼국 간 경쟁','주요 왕과 업적','삼국 통일','통일신라','발해','남북국 시대'],protagonistId:'protagonist_three_kingdoms',protagonistLabel:'새 주인공 · 설정 준비 중',bannerAsset:null,backgroundAssets:[],status:HISTORY_SEASON_STATUS.COMING_SOON,progressKey:'three-kingdoms',accent:'#46604f',placeholderMark:'三'}),
 historySeason({id:'goryeo',title:'눈떠보니 고려',name:'고려',era:'918~1392년',years:'918 — 1392',order:3,description:'새 나라의 탄생을 지나, 왕의 힘이 자라는 고려를 살아갑니다.',topics:[],protagonistId:'protagonist_goryeo',protagonistLabel:'고려편 주인공',bannerAsset:'assets/editorial/heroes/goryeo.webp',backgroundAssets:['assets/editorial/heroes/goryeo.webp'],status:HISTORY_SEASON_STATUS.AVAILABLE,progressKey:'goryeo',accent:'#95682e',placeholderMark:'高'}),
 historySeason({id:'joseon',title:'눈떠보니 조선',name:'조선',era:'1392~1897년 중심',years:'1392 — 1897',order:4,description:'새 나라의 시작부터 격변의 순간까지, 조선 500년을 살아갑니다.',topics:[],protagonistId:'protagonist_joseon',protagonistLabel:'조선편 여성 주인공',bannerAsset:'assets/editorial/heroes/joseon.webp',backgroundAssets:['assets/editorial/backgrounds/joseon-hanyang-1398.webp'],status:HISTORY_SEASON_STATUS.AVAILABLE,progressKey:'joseon',accent:'#963e34',placeholderMark:'朝'}),
 historySeason({id:'empire',title:'눈떠보니 대한제국',name:'대한제국',era:'1897~1910년',years:'1897 — 1910',order:5,description:'대한제국 수립과 광무개혁, 국권 피탈의 흐름을 다룰 시즌입니다.',topics:['대한제국 수립','광무개혁','국권 피탈'],protagonistId:'protagonist_korean_empire',protagonistLabel:'새 주인공 · 설정 준비 중',bannerAsset:'assets/editorial/heroes/empire.webp',backgroundAssets:['assets/editorial/backgrounds/empire-jeongdong-1905.webp'],status:HISTORY_SEASON_STATUS.COMING_SOON,progressKey:'empire',accent:'#555774',placeholderMark:'韓'}),
 historySeason({id:'occupation',title:'눈떠보니 일제강점기',name:'일제강점기',era:'1910~1945년',years:'1910 — 1945',order:6,description:'일제 통치 속 삶과 독립운동, 광복으로 이어지는 선택을 다룰 시즌입니다.',topics:['일제 통치','독립운동','광복'],protagonistId:'protagonist_occupation',protagonistLabel:'새 주인공 · 설정 준비 중',bannerAsset:'assets/editorial/heroes/occupation.webp',backgroundAssets:['assets/editorial/backgrounds/occupation-gyeongseong-1930.webp'],status:HISTORY_SEASON_STATUS.COMING_SOON,progressKey:'occupation',accent:'#635343',placeholderMark:'光'}),
 historySeason({id:'republic',title:'눈떠보니 대한민국',name:'대한민국',era:'광복 이후~현대',years:'1945 — 현재',order:7,description:'정부 수립과 6·25 전쟁, 민주화와 현대사의 변화를 다룰 시즌입니다.',topics:['정부 수립','6·25 전쟁','민주화','현대사'],protagonistId:'protagonist_republic',protagonistLabel:'새 주인공 · 설정 준비 중',bannerAsset:'assets/editorial/heroes/republic.webp',backgroundAssets:['assets/editorial/backgrounds/republic-seoul-2020.webp'],status:HISTORY_SEASON_STATUS.COMING_SOON,progressKey:'republic',accent:'#36587b',placeholderMark:'大'})
].sort((a,b)=>a.order-b.order);

const historySeasonInfo=id=>HISTORY_SEASONS.find(season=>season.id===id)||HISTORY_SEASONS.find(season=>season.id==='goryeo');
const historySeasonProgressKey=id=>historySeasonInfo(id).progressKey;
function ensureHistorySeasonProgress(m){
 m.eraProgress||={};
 m.seasonProgressVersion=Math.max(1,Number(m.seasonProgressVersion)||0);
 if(!HISTORY_SEASONS.some(season=>season.id===m.selectedLearningEra&&season.status===HISTORY_SEASON_STATUS.AVAILABLE))m.selectedLearningEra='goryeo';
 return m.eraProgress;
}

globalThis.HISTORY_SEASONS=HISTORY_SEASONS;
globalThis.HISTORY_SEASON_STATUS=HISTORY_SEASON_STATUS;
