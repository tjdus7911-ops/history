/* 원삼국·삼국 시즌. 공식 문항 연결 근거는 docs/ANCIENT_EXAM_ANALYSIS.md에 있다.
 * 기존 고려/조선 네임스페이스와 저장 데이터는 수정하지 않는다.
 */
const ANCIENT_EXPRESSIONS=['neutral','smile','surprised','embarrassed','suspicious','angry','sad','determined','fear','worried','relieved'];
const ancientAssetId=name=>`ancient-bg-${name}`;
const ANCIENT_BACKGROUNDS={
 'ancient-modern-museum':'ancient-modern-museum.jpg',
 'proto-forest-road':'proto-forest-road.jpg','proto-buyeo-village':'proto-buyeo-village.jpg','proto-goguryeo-fortress':'proto-goguryeo-fortress.jpg',
 'proto-okjeo-coast':'proto-okjeo-coast.jpg','proto-dongye-boundary':'proto-dongye-boundary.jpg','proto-samhan-market':'proto-samhan-market.jpg',
 'three-border-market':'three-border-market.jpg','three-han-river':'three-han-river.jpg','three-gaya-workshop':'three-gaya-workshop.jpg',
 'three-sabi-fortress':'three-sabi-fortress.jpg','three-pyongyang-fortress':'three-pyongyang-fortress.jpg',
 'three-unified-capitals':'three-unified-capitals.jpg','three-balhae-harbor':'three-balhae-harbor.jpg'
};
Object.entries(ANCIENT_BACKGROUNDS).forEach(([name,file])=>{
 ASSETS[ancientAssetId(name)]={id:ancientAssetId(name),label:`고대편 ${name} 역사 장면`,src:`assets/ancient/backgrounds/${file}`,imageKind:'story-background',embeddedCharacters:false};
});

const ancientPlayerFiles={proto:'proto-player',three:'three-player'};
Object.entries(ancientPlayerFiles).forEach(([season,prefix])=>{
 PORTRAITS[`${season}_modern_neutral`]={characterId:`${season}_modern`,expression:'neutral',label:`${season}편 주인공 · 현대복`,src:`assets/ancient/characters/${prefix}-modern.png`};
 ANCIENT_EXPRESSIONS.forEach(expression=>PORTRAITS[`${season}_player_${expression}`]={characterId:`${season}_player`,expression,label:`${season}편 주인공 · ${expression}`,src:`assets/ancient/characters/${prefix}-${expression}.png`});
});
const ancientNpcFiles={
 proto_guide:'proto-guide-neutral.png',proto_warrior:'proto-warrior-neutral.png',proto_villager:'proto-villager-neutral.png',proto_priest:'proto-priest-neutral.png',
 three_companion:'three-companion-neutral.png',three_goguryeo:'three-goguryeo-neutral.png',three_baekje:'three-baekje-neutral.png',three_silla:'three-silla-neutral.png',three_gaya:'three-gaya-neutral.png',three_balhae:'three-balhae-neutral.png',three_cheonghae:'three-cheonghae-neutral.png'
};
Object.entries(ancientNpcFiles).forEach(([characterId,file])=>ANCIENT_EXPRESSIONS.forEach(expression=>{
 PORTRAITS[`${characterId}_${expression}`]={characterId,expression,label:`고대편 조력자 · ${characterId}`,src:`assets/ancient/characters/${file}`};
}));
Object.assign(CHARACTERS,{
 proto_modern:{characterId:'proto_modern',characterName:'나',speakerType:'player',position:'right',show:true,presentation:'standing',portraitPrefix:'proto_modern'},
 proto_player:{characterId:'proto_player',characterName:'나',speakerType:'player',position:'right',show:true,presentation:'standing',portraitPrefix:'proto_player'},
 proto_guide:{characterId:'proto_guide',characterName:'기억 안내자 단',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'proto_guide'},
 proto_warrior:{characterId:'proto_warrior',characterName:'고구려 수비대 청년',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'proto_warrior'},
 proto_villager:{characterId:'proto_villager',characterName:'동해안 마을 사람',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'proto_villager'},
 proto_priest:{characterId:'proto_priest',characterName:'삼한의 천군',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'proto_priest'},
 three_modern:{characterId:'three_modern',characterName:'나',speakerType:'player',position:'right',show:true,presentation:'standing',portraitPrefix:'three_modern'},
 three_player:{characterId:'three_player',characterName:'나',speakerType:'player',position:'right',show:true,presentation:'standing',portraitPrefix:'three_player'},
 three_companion:{characterId:'three_companion',characterName:'기록 안내자 해솔',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'three_companion'},
 three_goguryeo:{characterId:'three_goguryeo',characterName:'그 시대의 고구려 군관',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'three_goguryeo'},
 three_baekje:{characterId:'three_baekje',characterName:'그 시대의 백제 기록관',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'three_baekje'},
 three_silla:{characterId:'three_silla',characterName:'그 시대의 신라 전령',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'three_silla'},
 three_gaya:{characterId:'three_gaya',characterName:'가야의 철 장인',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'three_gaya'},
 three_balhae:{characterId:'three_balhae',characterName:'발해의 기록관',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'three_balhae'},
 three_cheonghae:{characterId:'three_cheonghae',characterName:'청해진의 상인',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'three_cheonghae'}
});

const ancientMainProfiles={proto_modern:1.68,proto_player:1.68,three_modern:1.68,three_player:1.68,proto_guide:1.62,proto_warrior:1.6,proto_villager:1.62,proto_priest:1.62,three_companion:1.66,three_goguryeo:1.58,three_baekje:1.62,three_silla:1.64,three_gaya:1.6,three_balhae:1.62,three_cheonghae:1.62};
if(typeof CHARACTER_RENDER_PROFILES!=='undefined')Object.assign(CHARACTER_RENDER_PROFILES.characters,Object.fromEntries(Object.entries(ancientMainProfiles).map(([id,scale])=>[id,{tier:'MAIN',scale,anchorX:0,anchorY:15,framing:'upper-body',lockStateScale:true}])));

const aN=text=>dialogueLine('narrator','neutral',text,'narration');
const aP=(season,text,expression='neutral')=>dialogueLine(`${season}_player`,expression,text,'player');
const aC=(id,text,expression='neutral',name=null)=>dialogueLine(id,expression,text,'npc',name);
const ancientChapterId=(season,n)=>`${season}-ch${String(n).padStart(2,'0')}`;
const ancientSceneId=(season,n,i)=>`${season}_ch${String(n).padStart(2,'0')}_s${i}`;

const PROTO_BLUEPRINTS=[
 {n:1,title:'다섯 나라의 길',subtitle:'연맹 왕국과 읍락 사회',years:'기원전 1세기 — 1세기',beats:[
  ['나라가 하나가 아니었다',-50,'북방 교역로','proto-forest-road','proto_guide','한나라 군현 주변의 여러 집단은 각자의 군장과 읍락을 중심으로 움직였다.','왜 같은 시대인데 나라의 모습이 이렇게 다르죠?','왕 아래 여러 세력이 나뉘어 다스리는 연맹 왕국과 읍락 사회가 함께 존재했다.'],
  ['환경이 만든 생활',20,'압록강과 동해안으로 갈라지는 길','proto-forest-road','proto_guide','북쪽 평야·산간·해안·남쪽 논농사 지대의 환경이 생산과 교역 방식을 달리했다.','풍습만 외우면 자꾸 섞였는데, 삶의 터전부터 봐야겠네요.','부여·고구려·옥저·동예·삼한은 정치 구조뿐 아니라 경제와 혼인·장례 풍습도 달랐다.'],
  ['기억의 지도',50,'여러 나라로 이어지는 갈림길','proto-forest-road','proto_guide','길잡이는 다섯 갈래 길에 제천 행사와 특산물, 정치 구조를 표시했다.','나라 이름과 단서를 한 장면씩 연결해 볼게요.','이후 챕터는 북쪽 부여에서 남쪽 삼한까지 공간 순서로 이어진다.']]},
 {n:2,title:'부여, 넓은 들의 나라',subtitle:'사출도·영고·순장',years:'1세기',beats:[
  ['왕과 네 갈래 땅',50,'부여의 넓은 평야 마을','proto-buyeo-village','proto_guide','왕 아래 마가·우가·저가·구가가 있었고, 여러 가는 사출도를 따로 다스렸다.','왕이 있어도 각 가의 힘이 컸던 거군요.','부여는 왕권이 강한 중앙 집권 국가가 아니라 여러 세력이 결합한 연맹 왕국이었다.'],
  ['겨울의 영고',50,'부여의 제천 행사 준비터','proto-buyeo-village','proto_guide','12월이면 하늘에 제사를 지내는 영고를 열어 공동체의 결속을 다졌다.','12월 영고, 부여. 장소와 계절까지 같이 기억할게요.','부여의 영고·고구려의 동맹·동예의 무천은 나라별 제천 행사를 가르는 핵심 단서다.'],
  ['풍습과 계층',50,'부여 취락의 장례 준비터','proto-buyeo-village','proto_guide','형사취수제와 순장 풍습은 당시 가족 질서와 지배층의 권력을 보여 주었다.','풍습을 현대 기준으로 꾸미지 말고 사료의 단서로 봐야겠어요.','소를 죽여 굽으로 점을 치는 우제점법도 부여를 식별하는 단서다.']]},
 {n:3,title:'초기 고구려, 산성의 나라',subtitle:'제가 회의·서옥제·동맹',years:'1세기',beats:[
  ['산과 골짜기의 선택',60,'압록강 중류 산성 아래','proto-goguryeo-fortress','proto_warrior','산지가 많은 고구려는 부족한 곡식을 주변 지역과의 교역·정복으로 보완했다.','환경이 대외 활동의 방향에도 영향을 주었군요.','초기 고구려는 졸본에서 국내성으로 중심을 옮기며 압록강 유역에서 성장했다.'],
  ['제가 회의',60,'고구려 성 안 회의터','proto-goguryeo-fortress','proto_warrior','왕과 대가들이 함께 중대한 일을 논의하는 제가 회의가 열렸다.','왕 혼자 결정하는 중앙 집권 체제와는 다르네요.','제가 회의는 여러 집단의 결합이라는 초기 국가의 성격을 보여 준다.'],
  ['서옥제와 동맹',60,'고구려 취락과 제천 터','proto-goguryeo-fortress','proto_warrior','혼인 뒤 신랑이 신부 집 뒤 서옥에서 지내는 풍습과 10월 동맹이 이어졌다.','서옥제와 10월 동맹을 같은 장면으로 기억할게요.','가족 풍습과 제천 행사는 고구려를 다른 초기 국가와 구별하는 대표 단서다.']]},
 {n:4,title:'옥저, 바다와 산 사이',subtitle:'민며느리제·가족 공동 무덤·공납',years:'1세기',beats:[
  ['해산물과 소금',70,'함경도 동해안의 옥저 마을','proto-okjeo-coast','proto_villager','바다와 비옥한 땅에서 소금·해산물·곡식이 났지만 강한 왕권은 형성되지 못했다.','풍요로운 생산과 정치적 힘은 꼭 같지 않았군요.','옥저의 읍락들은 고구려의 압력을 받아 특산물을 공납하기도 했다.'],
  ['민며느리제',70,'옥저 마을의 혼인 약속 자리','proto-okjeo-coast','proto_villager','어린 신부가 될 아이를 미리 신랑 집에서 길러 혼인하는 민며느리제가 있었다.','현대의 기준으로 미화하지 않고 당시 혼인 풍습으로 구분할게요.','민며느리제는 옥저를 식별하는 대표 혼인 풍습이다.'],
  ['가족 공동 무덤',70,'옥저 마을 밖 장례 터','proto-okjeo-coast','proto_villager','시신을 임시로 묻었다가 뼈를 추려 가족 공동 무덤에 함께 안치했다.','한 가족의 뼈를 한 곽에 모셨다는 단서군요.','골장제와 가족 공동 무덤은 옥저의 장례 풍습을 보여 준다.']]},
 {n:5,title:'동예, 경계를 지키는 마을',subtitle:'책화·무천·특산물',years:'1세기',beats:[
  ['읍락의 경계',80,'동예의 들과 산 경계','proto-dongye-boundary','proto_villager','다른 읍락의 경계를 침범하면 노비·소·말로 갚게 하는 책화가 적용됐다.','경계를 중시한 생활 질서가 법에 드러났네요.','책화는 읍락의 독립성과 공동체 영역을 중시한 동예의 풍습이다.'],
  ['10월의 무천',80,'동예의 제천 행사 터','proto-dongye-boundary','proto_villager','10월이면 무천을 열어 하늘에 제사하고 노래와 춤으로 결속을 다졌다.','10월 동맹은 고구려, 10월 무천은 동예로 구분할게요.','행사 달이 같아도 이름과 나라를 함께 묶어야 한다.'],
  ['단궁·과하마·반어피',80,'동예 교역 길목','proto-dongye-boundary','proto_villager','작은 말 과하마, 단궁, 바다표범 가죽 반어피가 교역품으로 모였다.','특산물 세 가지가 동예 문제의 빠른 단서가 되겠어요.','단궁·과하마·반어피는 동예와 연결되는 대표 특산물이다.']]},
 {n:6,title:'삼한, 소도와 철의 길',subtitle:'마한·진한·변한·천군',years:'2세기',beats:[
  ['쉰네 나라의 연맹',150,'삼한의 논과 시장','proto-samhan-market','proto_priest','마한·진한·변한의 여러 소국은 큰 연맹을 이루었지만 통일된 왕권은 없었다.','삼한 안에도 다시 여러 소국이 있었군요.','마한의 목지국이 연맹을 주도했고, 진한·변한에도 여러 소국이 있었다.'],
  ['천군과 소도',150,'삼한의 소도 경계','proto-samhan-market','proto_priest','정치 지도자와 별개로 천군이 제사를 맡았고 소도는 신성 지역으로 보호됐다.','정치와 제사가 분리된 모습이 핵심이네요.','천군·소도는 삼한의 제정 분리를 보여 주는 대표 단서다.'],
  ['철과 벼농사',150,'변한과 낙랑을 잇는 시장','proto-samhan-market','proto_priest','벼농사가 발달했고 변한의 철은 낙랑과 왜로 수출되며 덩이쇠가 교환 수단으로 쓰였다.','경제 단서까지 붙이니 삼한의 모습이 선명해져요.','두레 같은 공동 노동과 계절제도 농경 사회의 특징을 보여 준다.']]},
 {n:7,title:'연맹에서 삼국으로',subtitle:'비교 정리·백제·신라·가야의 성장',years:'2세기 — 4세기',beats:[
  ['다섯 나라 비교',180,'남북 교역로의 기록소','proto-forest-road','proto_guide','영고·동맹·무천, 민며느리제·책화·소도를 한 장의 비교표에 놓았다.','비슷한 단서를 나라·계절·생활과 함께 구분하겠어요.','환경·정치 구조·제천 행사·혼인과 장례를 같은 기준으로 비교하면 혼동이 줄어든다.'],
  ['소국의 재편',250,'한강과 낙동강으로 이어지는 길','proto-samhan-market','proto_guide','마한에서는 백제가, 진한에서는 신라가, 변한에서는 가야 연맹이 성장했다.','작은 나라들의 변화가 다음 시즌의 세 나라와 가야로 이어지는군요.','여러 소국은 경쟁과 통합을 거치며 삼국과 가야의 기반이 됐다.'],
  ['다음 시대의 문',350,'산성과 강이 만나는 시간의 경계','proto-goguryeo-fortress','proto_guide','고구려·백제·신라는 율령과 관등, 군사 조직을 정비하며 중앙 집권 국가로 성장했다.','연맹의 길을 지나 이제 왕들이 영토를 다투는 시대로 가요.','원삼국의 사회 구조를 이해하면 삼국 성장의 출발점을 연결할 수 있다.']]}
];

const THREE_BLUEPRINTS=[
 {n:1,title:'성장하는 고구려',subtitle:'진대법·불교·율령·태학',years:'194 — 4세기',beats:[
  ['진대법',194,'고구려 국내성 부근','three-border-market','three_goguryeo','고국천왕 때 을파소의 건의로 봄에 곡식을 빌려 주고 가을에 갚는 진대법이 시행됐다.','백성을 구제하면서 왕권과 국가 질서도 강화한 제도군요.','진대법은 빈민 구제와 농민 생활 안정에 목적이 있었다.'],
  ['소수림왕의 정비',372,'고구려 국내성','proto-goguryeo-fortress','three_goguryeo','소수림왕은 불교를 받아들이고 태학을 세우며 율령을 반포했다.','사상·교육·법을 함께 정비했네요.','불교 공인·태학 설립·율령 반포는 중앙 집권 체제 정비의 핵심이다.'],
  ['광개토 대왕',400,'고구려 남쪽 군영','proto-goguryeo-fortress','three_goguryeo','광개토 대왕은 영락 연호를 쓰고 영토를 넓혔으며 신라를 도와 왜를 물리쳤다.','영락과 신라 구원군을 같은 인물에 연결할게요.','광개토 대왕릉비는 고구려의 팽창과 신라 구원 내용을 전한다.']]},
 {n:2,title:'장수왕의 남진',subtitle:'평양 천도·한성 함락',years:'427 — 475',beats:[
  ['평양 천도',427,'고구려 평양성','three-pyongyang-fortress','three_goguryeo','장수왕은 국내성에서 평양으로 수도를 옮겼다.','수도 이동이 남진 정책의 기반이 되었군요.','평양 천도는 국내성 귀족 세력을 약화하고 남쪽 진출을 강화하려는 선택이었다.'],
  ['한성 함락',475,'백제 한성 북쪽','three-han-river','three_goguryeo','고구려군이 한성을 공격해 개로왕이 전사하고 백제는 웅진으로 수도를 옮겼다.','한강을 둘러싼 경쟁이 백제의 수도까지 바꿨어요.','장수왕의 남진으로 고구려는 한강 유역까지 세력을 넓혔다.'],
  ['충주 고구려비',480,'충주 남한강 길목','three-han-river','three_companion','남한강 길목의 비석은 고구려가 신라를 아래에 두고 남쪽까지 영향력을 미쳤음을 보여 줬다.','비석이 당시 세력 관계를 기록한 증거네요.','충주 고구려비는 고구려의 남진과 신라와의 관계를 보여 주는 문화유산이다.']]},
 {n:3,title:'백제의 선택',subtitle:'근초고왕·웅진·무령왕·성왕',years:'4세기 — 6세기',beats:[
  ['근초고왕의 바다',371,'백제 한성의 강나루','three-han-river','three_baekje','근초고왕은 마한의 남은 지역을 확보하고 고구려 평양성을 공격했으며 중국·왜와 교류했다.','한강과 바다가 백제 성장의 통로였군요.','근초고왕 때 백제는 영토 확장과 해상 교류를 활발히 했다.'],
  ['웅진의 재건',501,'백제 웅진','three-sabi-fortress','three_baekje','무령왕은 지방에 22담로를 두고 왕족을 보내 통제를 강화했다.','무령왕릉의 지석 덕분에 왕의 이름과 연대를 정확히 알 수 있죠.','무령왕은 중국 남조와 교류하며 약해진 왕권을 회복했다.'],
  ['사비와 남부여',538,'백제 사비','three-sabi-fortress','three_baekje','성왕은 사비로 천도하고 국호를 남부여로 고쳐 중흥을 꾀했다.','수도와 국호를 함께 바꾼 개혁이었네요.','성왕은 중앙 관청과 지방 제도를 정비했지만 관산성 전투에서 전사했다.']]},
 {n:4,title:'신라가 나라의 틀을 세우다',subtitle:'내물·지증·법흥·진흥왕',years:'4세기 — 6세기',beats:[
  ['김씨 왕위와 마립간',400,'신라 금성','three-unified-capitals','three_silla','내물왕 때 김씨 왕위 세습이 자리 잡고 왕의 칭호로 마립간이 쓰였다.','왕위 계승과 칭호 변화가 성장의 단서네요.','내물왕은 광개토 대왕의 도움으로 왜의 침입을 물리쳤다.'],
  ['국호와 율령',520,'신라 금성 관청','three-unified-capitals','three_silla','지증왕은 국호를 신라로 정하고 왕 칭호를 사용했으며, 법흥왕은 율령·불교·골품제를 정비했다.','지증왕과 법흥왕의 업적을 순서로 묶어야겠어요.','법흥왕은 금관가야를 복속하고 병부를 설치해 국가 체제를 강화했다.'],
  ['진흥왕의 순수비',568,'한강 유역과 북한산','three-han-river','three_silla','진흥왕은 화랑도를 국가 조직으로 정비하고 한강 유역을 차지한 뒤 순수비를 세웠다.','비석의 위치가 신라 영토 확대를 보여 주네요.','진흥왕은 대가야를 복속해 낙동강 서쪽으로도 세력을 넓혔다.']]},
 {n:5,title:'가야, 철과 강의 연맹',subtitle:'금관가야·대가야·철 교역',years:'3세기 — 562',beats:[
  ['덩이쇠의 시장',350,'낙동강 유역 가야 공방','three-gaya-workshop','three_gaya','풍부한 철을 생산한 가야는 덩이쇠를 교환 수단으로 쓰고 낙랑·왜와 교역했다.','철이 무기이자 교역품, 화폐 역할까지 했군요.','가야의 철제 갑옷과 말갖춤은 발달한 철기 문화를 보여 준다.'],
  ['연맹의 중심 이동',450,'낙동강 유역 가야 연맹','three-gaya-workshop','three_gaya','초기에는 금관가야가, 후기에는 고령의 대가야가 연맹을 이끌었다.','연맹의 중심이 한 번 바뀌었다는 흐름이 중요해요.','가야는 하나의 통일 왕국이 아니라 여러 소국의 연맹이었다.'],
  ['두 번의 복속',562,'대가야 성 밖','three-gaya-workshop','three_gaya','금관가야는 법흥왕 때, 대가야는 진흥왕 때 신라에 복속됐다.','왕 이름과 복속 대상을 짝지어 기억할게요.','가야 연맹은 중앙 집권 국가로 통합되지 못하고 차례로 신라에 편입됐다.']]},
 {n:6,title:'나제 동맹과 한강',subtitle:'동맹·관산성·한강 유역',years:'433 — 553',beats:[
  ['함께 막은 남진',433,'백제와 신라의 경계 시장','three-border-market','three_baekje','백제와 신라는 고구려의 남진에 맞서 나제 동맹을 맺었다.','공동의 적이 두 나라를 묶었군요.','나제 동맹은 5세기 고구려의 압박에 대응한 군사 동맹이었다.'],
  ['한강을 되찾다',551,'한강 상류의 연합 진영','three-han-river','three_silla','백제와 신라는 함께 고구려를 밀어내 한강 유역을 회복했다.','그런데 동맹의 성과를 두고 갈등이 생기겠네요.','백제는 한강 하류, 신라는 상류를 차지했다.'],
  ['동맹의 끝',553,'한강 하류의 신라 진영','three-han-river','three_silla','신라가 백제의 한강 하류 지역까지 차지했고, 성왕은 관산성에서 전사했다.','동맹이 깨지고 삼국 관계가 다시 뒤집혔어요.','한강 확보로 신라는 중국과 직접 교류할 길을 얻었다.']]},
 {n:7,title:'수·당과 맞선 고구려',subtitle:'살수 대첩·안시성',years:'612 — 645',beats:[
  ['수의 침공',612,'고구려 서북 변경','three-pyongyang-fortress','three_goguryeo','수 양제의 대군이 고구려를 침공하자 을지문덕은 거짓 항복과 후퇴로 적을 깊숙이 끌어들였다.','힘의 크기보다 보급과 지형을 읽은 전략이었군요.','을지문덕은 살수에서 수군을 크게 물리쳤다.'],
  ['천리장성과 권력',642,'고구려 국경 방어선','three-pyongyang-fortress','three_goguryeo','연개소문은 천리장성 축조를 감독한 뒤 정변으로 권력을 장악했다.','대외 전쟁과 내부 권력 변화가 동시에 진행됐어요.','연개소문 집권 뒤 고구려는 당과 긴장 관계를 이어 갔다.'],
  ['안시성',645,'고구려 안시성','three-pyongyang-fortress','three_goguryeo','안시성 군사와 백성은 당 태종의 공격을 막아 냈다.','성 하나의 방어가 대군의 진격을 멈췄네요.','안시성 전투는 고구려가 당의 대규모 침공을 물리친 대표 사례다.']]},
 {n:8,title:'백제의 마지막 날',subtitle:'나당 연합·황산벌·사비성',years:'660',beats:[
  ['나당 연합군',660,'백제 사비성 밖','three-sabi-fortress','three_companion','신라는 당과 연합해 백제를 공격했고, 당 수군과 신라 육군이 사비로 향했다.','외교 동맹이 전쟁의 판도를 바꿨군요.','김춘추의 외교와 김유신의 군사 지휘가 나당 연합 형성에 연결됐다.'],
  ['황산벌',660,'황산벌로 향하는 길','three-sabi-fortress','three_baekje','계백의 결사대가 황산벌에서 신라군을 막았지만 수적 열세를 이기지 못했다.','충절 이야기만이 아니라 전쟁 전체의 조건도 봐야겠어요.','황산벌 전투 뒤 신라군은 사비성으로 진격했다.'],
  ['사비성 함락',660,'백제 사비성','three-sabi-fortress','three_baekje','의자왕이 항복하며 백제는 멸망했고, 복신·도침·부여풍 등이 부흥 운동을 일으켰다.','멸망 뒤에도 저항은 끝나지 않았군요.','백제 부흥 운동은 백강 전투 패배 뒤 약화됐다.']]},
 {n:9,title:'고구려의 마지막 날',subtitle:'연개소문 사후·평양성',years:'668',beats:[
  ['갈라진 지배층',666,'고구려 평양성 안','three-pyongyang-fortress','three_goguryeo','연개소문이 죽은 뒤 아들들의 권력 다툼으로 지배층이 갈라졌다.','외부 공격보다 내부 분열이 먼저 성벽을 약하게 했군요.','고구려는 거듭된 전쟁과 내분으로 방어력이 약해졌다.'],
  ['평양성 함락',668,'고구려 평양성','three-pyongyang-fortress','three_companion','나당 연합군이 평양성을 함락하며 고구려가 멸망했다.','수와 당의 침략을 오래 막았지만 결국 무너졌어요.','당은 옛 고구려 땅을 지배하려 안동도호부를 두었다.'],
  ['부흥과 이동',670,'고구려 옛 땅','three-pyongyang-fortress','three_companion','검모잠·안승 등이 부흥 운동을 벌였고, 일부 유민은 뒤에 발해 건국 세력으로 이어졌다.','멸망이 사람과 문화의 끝은 아니었군요.','고구려 유민의 이동은 신라의 삼국 통일과 발해 건국에 모두 영향을 주었다.']]},
 {n:10,title:'신라와 당의 전쟁',subtitle:'매소성·기벌포·삼국 통일',years:'670 — 676',beats:[
  ['동맹에서 전쟁으로',670,'한반도 중부 전선','three-han-river','three_silla','당이 옛 백제·고구려 땅과 신라까지 지배하려 하자 신라는 고구려·백제 유민을 지원하며 맞섰다.','공동의 적을 무너뜨린 뒤 곧바로 이해가 충돌했군요.','신라는 당의 웅진도독부·안동도호부 설치에 맞서 나당 전쟁을 벌였다.'],
  ['매소성',675,'매소성 전선','three-han-river','three_silla','신라군은 매소성에서 당군을 물리치고 많은 군마와 무기를 얻었다.','육지 전투의 전환점이었군요.','매소성 승리는 당군을 북쪽으로 밀어내는 데 중요했다.'],
  ['기벌포',676,'금강 하구 기벌포','three-han-river','three_silla','신라 수군이 기벌포에서 당 수군을 격퇴했다.','676년 기벌포, 나당 전쟁의 마무리로 기억할게요.','기벌포 승리 뒤 신라는 대동강 이남을 중심으로 통일을 완성했다.']]},
 {n:11,title:'통일 신라의 나라 운영',subtitle:'신문왕·9주 5소경·9서당 10정',years:'681 — 9세기',beats:[
  ['신문왕의 개혁',689,'통일 신라 금성','three-unified-capitals','three_silla','신문왕은 김흠돌의 난을 진압하고 관료전을 지급한 뒤 녹읍을 폐지했다.','귀족의 경제 기반을 줄여 왕권을 강화했군요.','신문왕은 국학을 정비하고 왕권 중심의 통치 체제를 강화했다.'],
  ['9주 5소경과 군대',700,'통일 신라 지방 거점','three-unified-capitals','three_companion','전국을 9주로 나누고 5소경을 두었으며 중앙군 9서당과 지방군 10정을 운영했다.','행정과 군사 조직이 통일 영역에 맞게 재편됐어요.','9서당에는 고구려·백제·말갈 출신도 포함돼 통합을 꾀했다.'],
  ['촌락 문서와 독서삼품과',815,'통일 신라 관청과 마을','three-unified-capitals','three_companion','촌락 문서로 인구·토지·가축을 파악했고 원성왕 때 독서삼품과를 실시했다.','국가가 마을과 인재를 기록으로 관리했군요.','독서삼품과는 유교 경전 이해 수준으로 인재를 추천하려 한 제도였다.']]},
 {n:12,title:'해동성국 발해',subtitle:'대조영·3성 6부·상경',years:'698 — 926',beats:[
  ['동모산의 나라',698,'동모산과 발해 초기 터전','three-balhae-harbor','three_balhae','고구려 유민 대조영이 말갈인과 함께 동모산에서 나라를 세웠다.','고구려 계승과 여러 집단의 결합을 함께 봐야겠어요.','처음 국호는 진이었고 뒤에 발해로 바뀌었다.'],
  ['무왕과 문왕',755,'발해 상경으로 향하는 길','three-balhae-harbor','three_balhae','무왕은 장문휴를 보내 당의 산둥을 공격했고, 문왕은 당과 교류하며 상경으로 천도했다.','무왕의 대외 팽창, 문왕의 제도 정비로 구분할게요.','문왕 때 3성 6부를 운영하고 주자감에서 인재를 길렀다.'],
  ['해동성국',830,'발해 상경성','three-balhae-harbor','three_balhae','선왕 때 영토를 넓히고 5경 15부 62주의 지방 제도를 갖춰 해동성국이라 불렸다.','선왕과 해동성국을 바로 연결할 수 있겠어요.','정혜 공주·정효 공주 묘는 고구려 전통과 당 문화의 영향을 함께 보여 준다.']]},
 {n:13,title:'장보고와 청해진',subtitle:'해상 무역·신라 하대',years:'828 — 846',beats:[
  ['바다의 길',828,'완도 청해진','three-balhae-harbor','three_cheonghae','장보고는 완도에 청해진을 설치해 해적을 소탕하고 신라·당·일본을 잇는 해상 무역을 장악했다.','군사 거점이 국제 무역의 중심이 되었군요.','청해진은 남해와 서해 항로를 통제하는 중요한 해상 기지였다.'],
  ['사람과 물자의 이동',830,'청해진 항구','three-balhae-harbor','three_cheonghae','상인·승려·유학생과 도자기·비단·약재가 바닷길을 오갔다.','교류의 흔적이 신라와 당, 일본 곳곳에 남았겠어요.','신라방·신라소·신라원은 당에 거주한 신라인의 활동을 보여 준다.'],
  ['흔들리는 왕조',846,'청해진의 저녁','three-balhae-harbor','three_companion','왕위 다툼에 개입한 장보고는 피살되고 청해진도 폐지됐다.','바다를 장악한 힘도 중앙 정치의 갈등에서 자유롭지 못했군요.','신라 하대에는 왕위 다툼과 농민 봉기가 이어지고 지방 호족이 성장했다.']]}
];

function ancientBeatDialogues(season,beat){
 const [title,year,location,,npc,situation,prompt,result]=beat;
 return [aN(`TIME SHIFT · ${year<0?`기원전 ${Math.abs(year)}년`:year+'년'} · ${location}`),aN(situation),aP(season,prompt,/무너|전사|멸망|피살/.test(situation)?'sad':/전쟁|공격|침공/.test(situation)?'worried':'surprised'),aC(npc,result,'neutral'),aP(season,`${title}의 단서를 원본 기출에서도 찾아볼게요.`,'determined')];
}

function createAncientIntro(season,title,year,location,background,npc){
 const id=ancientChapterId(season,0),modern=`${season}_modern`,player=`${season}_player`,prefix=`${season}_ch00`;
 CHAPTERS[id]={chapterId:id,eraId:season==='proto'?'proto-kingdoms':'three-kingdoms',episode:season,number:'00',title:'시간의 문',subtitle:title,years:`2026 → ${year}`,thumbnail:ASSETS[ancientAssetId(background)].src,startStoryId:`${prefix}_s1`,completeStoryId:`${prefix}_complete`,questionCount:0,reviewQuestionCount:0,questionSetCount:0,implemented:true};
 STORIES[`${prefix}_s1`]=scene({sceneId:`${prefix}_s1`,chapterId:id,eraId:CHAPTERS[id].eraId,year:2026,location:'현대 국립중앙박물관 고대관',title:'닫히지 않는 전시실',illustrationId:ancientAssetId('ancient-modern-museum'),dialogues:[aN('폐관 안내 방송 뒤에도 고대 국가 지도가 희미하게 빛났다.'),dialogueLine(modern,'neutral','부여, 옥저, 동예, 삼한…… 이름은 아는데 자꾸 섞여.','player'),aN('유리 진열장에 손을 대는 순간 지도 위 강줄기가 실제 물소리로 바뀌었다.')],nextStoryId:`${prefix}_s2`});
 STORIES[`${prefix}_s2`]=scene({sceneId:`${prefix}_s2`,chapterId:id,eraId:CHAPTERS[id].eraId,year,location,title:'낯선 땅의 옷',illustrationId:ancientAssetId(background),sceneEffect:'wake-reveal',dialogues:[aN(`눈을 뜬 곳은 ${location}. 휴대전화는 꺼져 있었고 옷은 그 시대의 여행복으로 바뀌어 있었다.`),dialogueLine(player,'surprised','전시실이 아니라…… 정말 과거라고?','player'),aC(npc,'여기서 혼자 서 있으면 위험합니다. 길과 시대부터 확인하지요.','worried'),dialogueLine(player,'determined','좋아요. 이름을 외우는 대신, 직접 보고 기록하겠어요.','player')],nextStoryId:`${prefix}_s3`});
 STORIES[`${prefix}_s3`]=scene({sceneId:`${prefix}_s3`,chapterId:id,eraId:CHAPTERS[id].eraId,year,location,title:`눈떠보니 ${season==='proto'?'원삼국':'삼국'}`,illustrationId:ancientAssetId(background),dialogues:[aN('화면 상단의 연도와 장소가 바뀔 때마다 시간도 함께 이동한다. 역사 속 사람은 자신의 시대에만 남고, 기록 안내자와 주인공만 기억의 길을 건넌다.'),dialogueLine(player,'relieved',`이제 ${season==='proto'?'여러 초기 나라의 삶':'삼국과 남북국의 선택'}을 차례로 따라가 보자.`,'player')],nextStoryId:`${prefix}_complete`});
 STORIES[`${prefix}_complete`]=scene({sceneId:`${prefix}_complete`,chapterId:id,eraId:CHAPTERS[id].eraId,year,location,title:'첫 기록 완료',illustrationId:ancientAssetId(background),dialogues:[aN('현재 위치와 시대, 이동 규칙을 확인했다.'),dialogueLine(player,'determined','첫 번째 역사 장면으로 간다.','player')],completeChapter:true});
}

createAncientIntro('proto','고조선 멸망 전후의 여러 나라',-50,'북방 교역로','proto-forest-road','proto_guide');
createAncientIntro('three','삼국이 성장하던 길목',194,'삼국의 경계 시장','three-border-market','three_companion');

function installAncientBlueprints(season,eraId,blueprints){
 blueprints.forEach(ch=>{
  const id=ancientChapterId(season,ch.n),completeId=`${season}_ch${String(ch.n).padStart(2,'0')}_complete`,firstBg=ch.beats[0][3];
  CHAPTERS[id]={chapterId:id,eraId,episode:season,number:String(ch.n).padStart(2,'0'),title:ch.title,subtitle:ch.subtitle,years:ch.years,thumbnail:ASSETS[ancientAssetId(firstBg)].src,startStoryId:ancientSceneId(season,ch.n,1),completeStoryId:completeId,questionCount:0,reviewQuestionCount:0,questionSetCount:0,implemented:true};
  ch.beats.forEach((beat,index)=>{
   const sceneId=ancientSceneId(season,ch.n,index+1),next=index<ch.beats.length-1?ancientSceneId(season,ch.n,index+2):completeId;
   STORIES[sceneId]=scene({sceneId,chapterId:id,eraId,year:beat[1],location:beat[2],title:beat[0],illustrationId:ancientAssetId(beat[3]),dialogues:ancientBeatDialogues(season,beat),nextStoryId:next,readingMode:'narration-blocks'});
  });
  const last=ch.beats.at(-1);
  STORIES[completeId]=scene({sceneId:completeId,chapterId:id,eraId,year:last[1],location:last[2],title:`CH.${String(ch.n).padStart(2,'0')} 기억 완료`,illustrationId:ancientAssetId(last[3]),dialogues:[aN(`${ch.title}의 원인·전개·결과와 시험 단서를 한 흐름으로 연결했다.`),aP(season,'원본 기출 이미지의 자료와 선택지를 다시 확인해 두자.','relieved')],completeChapter:true});
 });
}
installAncientBlueprints('proto','proto-kingdoms',PROTO_BLUEPRINTS);
installAncientBlueprints('three','three-kingdoms',THREE_BLUEPRINTS);

const ANCIENT_OFFICIAL_MAP=[
 ['proto',1,2,'official-60-advanced-02','연맹 왕국·사출도'],['proto',2,3,'official-57-advanced-03','서옥제'],['proto',3,3,'official-66-advanced-02','옥저·민며느리제'],['proto',4,2,'official-63-advanced-02','동예·무천'],['proto',5,2,'official-61-advanced-02','삼한·소도'],['proto',6,1,'official-69-advanced-03','초기 국가 비교'],['proto',7,2,'official-58-basic-04','삼국 성장과 한강'],
 ['three',1,2,'official-65-advanced-05','소수림왕'],['three',2,2,'official-58-advanced-03','장수왕의 남진'],['three',3,2,'official-61-basic-05','백제·22담로'],['three',4,3,'official-67-basic-05','진흥왕·화랑도'],['three',5,1,'official-62-advanced-03','가야·덩이쇠'],['three',6,1,'official-57-basic-05','나제 동맹'],['three',7,3,'official-68-advanced-05','안시성'],['three',8,3,'official-59-advanced-03','백제 멸망'],['three',9,1,'official-69-advanced-05','연개소문'],['three',10,3,'official-58-basic-07','기벌포 전투'],['three',11,3,'official-58-advanced-07','촌락 문서'],['three',12,1,'official-58-basic-08','발해 건국'],['three',13,1,'official-62-advanced-09','장보고·청해진']
];
const ancientSourceById=new Map((globalThis.OFFICIAL_EXAM_SOURCE_RECORDS||[]).map(record=>[record.officialQuestionId,record]));
const ancientExplanationById=new Map((globalThis.OFFICIAL_EXAM_EXPLANATION_RECORDS||[]).map(record=>[record.officialQuestionId,record]));
const ancientQuestionCounts={};
for(const [season,chapterNumber,sceneIndex,officialQuestionId,concept] of ANCIENT_OFFICIAL_MAP){
 const source=ancientSourceById.get(officialQuestionId),details=ancientExplanationById.get(officialQuestionId),chapterId=ancientChapterId(season,chapterNumber),relatedSceneId=ancientSceneId(season,chapterNumber,sceneIndex),story=STORIES[relatedSceneId];
 if(!source||!details||!story)throw new Error(`고대 공식 문항 연결 누락: ${officialQuestionId}`);
 if(!QUESTIONS.some(item=>item.questionId===officialQuestionId))QUESTIONS.push(question({
  questionId:officialQuestionId,officialQuestionId,chapterId,era:season==='proto'?'원삼국':'삼국',primaryEra:'ancient',relatedSceneId,relatedHistoricalEventId:`ancient-${season}-${chapterNumber}`,historicalEventId:`ancient-${season}-${chapterNumber}`,historicalEvent:concept,relatedIllustrationId:story.illustrationId,
  questionType:'공식 원본 자료 분석형',difficulty:source.examLevel,question:details.question||`${source.examRound}회 ${source.examLevel} ${source.questionNumber}번`,sourceQuestionText:details.question||'원문 이미지에서 문제와 선택지를 확인하세요.',passage:details.clue||'',
  choices:['①','②','③','④',...(source.examLevel==='심화'?['⑤']:[])],sourceChoices:['①','②','③','④',...(source.examLevel==='심화'?['⑤']:[])],answer:source.answer===null?0:source.answer,answerLabel:source.answerLabel,acceptedAnswers:source.acceptedAnswers||[source.answer],
  explanation:details.explanation,wrongFeedback:`${concept}의 장면과 원본 자료의 단서를 다시 연결해 보세요.`,memoryPrompt:`${story.title} 장면을 떠올린다`,gameMemory:`${story.year}년 ${story.location}에서 ${story.title}을 경험했습니다.`,storyConnection:`${story.title} 장면의 단서와 공식 문항 원본을 연결했습니다.`,examKeywords:[concept],concepts:[concept],conceptIds:[`ancient-${season}-${chapterNumber}`,concept],rewardKnowledge:3,resumeStoryId:story.nextStoryId,
  isOfficial:true,sourceVerified:true,sourceStatus:'verified',sourceImageStatus:'verified',examRound:source.examRound,examYear:source.examYear,examLevel:source.examLevel,questionNumber:source.questionNumber,points:source.points,sourcePage:source.sourcePage,
  sourceFile:source.sourcePdf,answerFile:source.answerPdf,sourcePdf:source.sourcePdf,answerPdf:source.answerPdf,sourceQuestionImage:source.questionImage,questionImage:source.questionImage,examType:`제${source.examRound}회 한국사능력검정시험 ${source.examLevel} 실제 기출`,source:'국사편찬위원회 한국사능력검정시험 공식 문제지·정답표'
 }));
 const setId=`${relatedSceneId}_questions`,officialIds=[officialQuestionId];
 QUESTION_SETS[setId]={questionSetId:setId,chapterId,afterSceneId:relatedSceneId,resumeStoryId:story.nextStoryId,questionPoolId:`${chapterId}-official`,conceptIds:[`ancient-${season}-${chapterNumber}`,concept],requiredCount:1,officialQuestionIds:officialIds,practiceQuestionIds:[],verifiedCount:1,practiceCount:0,missingQuestionCount:0,status:'ready',sourceType:'official_verified',preserveQuestionOrder:true};
 Object.assign(story,{questionSetId:setId,questionSetStatus:'ready',questionSetResumeStoryId:story.nextStoryId,linkedQuestionIds:officialIds,linkedOfficialQuestionIds:officialIds,linkedPracticeQuestionIds:[],questionSequenceMode:'queue'});
 ancientQuestionCounts[chapterId]=(ancientQuestionCounts[chapterId]||0)+1;
}
for(const chapter of Object.values(CHAPTERS).filter(ch=>['proto-kingdoms','three-kingdoms'].includes(ch.eraId))){
 const ids=QUESTIONS.filter(q=>q.chapterId===chapter.chapterId).map(q=>q.questionId);
 chapter.questionCount=ids.length;chapter.reviewQuestionCount=ids.length;chapter.questionSetCount=Object.values(STORIES).filter(story=>story.chapterId===chapter.chapterId&&story.questionSetId).length;
 if(typeof SPLIT_REVIEW_IDS!=='undefined')SPLIT_REVIEW_IDS[chapter.chapterId]=ids;
}

globalThis.ANCIENT_OFFICIAL_QUESTION_IDS=ANCIENT_OFFICIAL_MAP.map(row=>row[3]);
globalThis.ANCIENT_STORY_SCOPE={
 officialQuestionCount:new Set(globalThis.ANCIENT_OFFICIAL_QUESTION_IDS).size,questionLinks:ANCIENT_OFFICIAL_MAP.length,practiceQuestionCount:0,
 protoChapters:Object.values(CHAPTERS).filter(ch=>ch.eraId==='proto-kingdoms').length,threeChapters:Object.values(CHAPTERS).filter(ch=>ch.eraId==='three-kingdoms').length,
 protoScenes:Object.values(STORIES).filter(story=>story.eraId==='proto-kingdoms').length,threeScenes:Object.values(STORIES).filter(story=>story.eraId==='three-kingdoms').length,
 protagonistPortraits:{proto:12,three:12},npcAssets:Object.keys(ancientNpcFiles).length,backgroundAssets:Object.keys(ANCIENT_BACKGROUNDS).length,heroAssets:2
};
