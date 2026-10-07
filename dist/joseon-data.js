/* 눈떠보니 조선 CH.00~CH.22
 * 실제 기출 매핑의 기준 문서: docs/JOSEON_OFFICIAL_QUESTION_MAPPING.md
 * 고려편의 기존 ID와 저장 구조를 건드리지 않도록 joseon-* 네임스페이스만 사용한다.
 */

const JOSEON_CHAPTER_PREFIX='joseon-ch';
const joseonChapterId=number=>JOSEON_CHAPTER_PREFIX+String(number).padStart(2,'0');
const joseonSceneId=(number,index)=>`joseon_ch${String(number).padStart(2,'0')}_s${index}`;
const joseonAssetId=name=>`joseon-bg-${name}`;

const JOSEON_BACKGROUND_PATHS={
  'early-hanyang':'early-hanyang.webp','palace':'palace.webp','market':'market.webp','office':'office.webp',
  'jiphyeonjeon':'jiphyeonjeon.webp','frontier':'frontier.webp','rural':'rural.webp','war-hanyang':'war-hanyang.webp',
  'refugee-route':'refugee-route.webp','navy-port':'navy-port.webp','namhansanseong':'namhansanseong.webp',
  'suwon-fortress':'suwon-fortress.webp','late-market':'late-market.webp','peasant-village':'peasant-village.webp',
  'ganghwa':'ganghwa.webp','unyo':'unyo.webp'
};
Object.entries(JOSEON_BACKGROUND_PATHS).forEach(([name,file])=>{
  ASSETS[joseonAssetId(name)]={id:joseonAssetId(name),label:`조선편 ${name} 역사 장면`,src:`assets/joseon/backgrounds/${file}`,imageKind:'story-background',embeddedCharacters:false};
});
ASSETS['joseon-modern-gyeongbokgung']={id:'joseon-modern-gyeongbokgung',label:'현대 경복궁 근처에 비가 내리는 밤',src:'seoul-night.png',imageKind:'story-background',embeddedCharacters:false};
if(typeof ERA_BACKGROUNDS!=='undefined')Object.assign(ERA_BACKGROUNDS,Object.fromEntries(Object.entries(JOSEON_BACKGROUND_PATHS).map(([name,file])=>[
  joseonAssetId(name),{id:joseonAssetId(name),era:'joseon',yearRange:[1392,1875],location:name,event:name,timeOfDay:'day',src:`assets/joseon/backgrounds/${file}`,usage:'story',includesProtagonist:false}
])));

const joseonPortraitFiles={
  neutral:'assets/editorial/protagonists/joseon-neutral.webp',smile:'assets/joseon/protagonist/smile.webp',
  laugh:'assets/joseon/protagonist/laugh.webp',surprised:'assets/joseon/protagonist/surprised.webp',
  shock:'assets/joseon/protagonist/shock.webp',worried:'assets/joseon/protagonist/worried.webp',
  fear:'assets/joseon/protagonist/fear.webp',sad:'assets/joseon/protagonist/sad.webp',
  crying:'assets/joseon/protagonist/crying.webp',angry:'assets/joseon/protagonist/angry.webp',
  determined:'assets/joseon/protagonist/determined.webp',thinking:'assets/joseon/protagonist/thinking.webp',
  confused:'assets/joseon/protagonist/confused.webp',relieved:'assets/joseon/protagonist/relieved.webp',
  tired:'assets/joseon/protagonist/tired.webp'
};
Object.entries(joseonPortraitFiles).forEach(([expression,src])=>{
  PORTRAITS[`joseon_player_${expression}`]={characterId:'joseon_player',expression,label:`조선편 여자 주인공 · ${expression}`,src};
});
const joseonNpcPortraits={
  minjun_j:'assets/joseon/npcs/minjun.webp',minjun_elder_j:'assets/joseon/npcs/minjun-elder.webp',
  joseon_scholar:'assets/joseon/npcs/scholar.webp',joseon_soldier:'assets/joseon/npcs/soldier.webp',
  joseon_naval:'assets/joseon/npcs/naval.webp',joseon_woman:'assets/joseon/npcs/woman.webp'
};
Object.entries(joseonNpcPortraits).forEach(([characterId,src])=>{
  ['neutral','smile','serious','worried','surprised','angry'].forEach(expression=>{
    PORTRAITS[`${characterId}_${expression}`]={characterId,expression,label:`조선편 NPC · ${characterId}`,src};
  });
});
Object.assign(CHARACTERS,{
  joseon_player:{characterId:'joseon_player',characterName:'나',speakerType:'player',position:'right',show:true,presentation:'standing',portraitPrefix:'joseon_player'},
  minjun_j:{characterId:'minjun_j',characterName:'민준',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'minjun_j'},
  minjun_elder_j:{characterId:'minjun_elder_j',characterName:'민준',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'minjun_elder_j'},
  joseon_scholar:{characterId:'joseon_scholar',characterName:'조선의 선비',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'joseon_scholar'},
  joseon_soldier:{characterId:'joseon_soldier',characterName:'조선의 군사',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'joseon_soldier'},
  joseon_naval:{characterId:'joseon_naval',characterName:'조선 수군',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'joseon_naval'},
  joseon_woman:{characterId:'joseon_woman',characterName:'조선의 백성',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'joseon_woman'}
});

/* Goryeo remains untouched; Joseon portraits deliberately overflow the stage below the waist. */
const JOSEON_CHARACTER_FRAMING={
  mode:'upper-body',lockDialogueStateScale:true,
  joseon_player:{scale:1.8,translateX:6,translateY:20},
  minjun_j:{scale:2,translateX:0,translateY:17},minjun_elder_j:{scale:1.9,translateX:0,translateY:17},
  joseon_scholar:{scale:1.95,translateX:0,translateY:17},joseon_soldier:{scale:1.77,translateX:0,translateY:17},
  joseon_naval:{scale:1.69,translateX:0,translateY:17},joseon_woman:{scale:1.86,translateX:0,translateY:17}
};
const joseonRenderProfile=characterId=>{const frame=JOSEON_CHARACTER_FRAMING[characterId];return{tier:'MAIN',scale:frame.scale,anchorX:frame.translateX,anchorY:frame.translateY,framing:JOSEON_CHARACTER_FRAMING.mode,lockStateScale:JOSEON_CHARACTER_FRAMING.lockDialogueStateScale}};
const JOSEON_CHARACTER_RENDER_PROFILES={
  joseon_player:joseonRenderProfile('joseon_player'),
  minjun_j:joseonRenderProfile('minjun_j'),minjun_elder_j:joseonRenderProfile('minjun_elder_j'),
  joseon_scholar:joseonRenderProfile('joseon_scholar'),joseon_soldier:joseonRenderProfile('joseon_soldier'),
  joseon_naval:joseonRenderProfile('joseon_naval'),joseon_woman:joseonRenderProfile('joseon_woman')
};
Object.assign(CHARACTER_RENDER_PROFILES.characters,JOSEON_CHARACTER_RENDER_PROFILES);

const jN=text=>dialogueLine('narrator','neutral',text,'narration');
const jP=(text,expression='thinking')=>dialogueLine('joseon_player',expression,text,'player');
const jT=(text,expression='thinking')=>dialogueLine('joseon_player',expression,text,'thought');
const jC=(id,text,expression='neutral',name=null)=>dialogueLine(id,expression,text,'npc',name);

const JOSEON_BLUEPRINTS=[
  {n:1,title:'새 나라, 새 수도',subtitle:'태조·한양 천도·정도전',years:'1392 — 1398',beats:[
    ['새 나라의 길',1392,'개경에서 한양으로 향하는 길','early-hanyang',[jN('고려의 깃발이 내려가고 조선이라는 새 국호가 퍼졌다.'),jC('minjun_j','새 왕조는 수도까지 옮긴다더군요. 한양으로요.','surprised'),jP('나라의 이름만이 아니라 질서 전체를 바꾸려는 거야.','thinking')]],
    ['궁궐과 종묘·사직',1395,'한양 궁궐 공사장','palace',[jN('경복궁의 기둥이 오르고, 동쪽에는 종묘, 서쪽에는 사직이 자리를 잡았다.'),jC('joseon_scholar','궁궐은 왕의 집이지만 종묘와 사직은 왕조의 뿌리입니다.','serious','정도전의 문하 선비'),jP('도시의 배치 자체가 새 나라의 선언이구나.','determined')]],
    ['조선경국전',1397,'한양 관청','office',[jN('정도전은 재상 중심의 정치와 나라의 운영 원칙을 글로 정리했다.'),jC('joseon_scholar','사람이 제도를 만들고, 제도가 왕조를 오래 버티게 합니다.','serious','정도전'),jT('한 권의 책이 궁궐보다 오래 남을 수도 있다.','thinking')]]]},
  {n:2,title:'왕자의 밤',subtitle:'왕자의 난·정도전·이방원',years:'1398 — 1400',beats:[
    ['칼이 움직인 밤',1398,'한양 골목','palace',[jN('왕위 계승을 둘러싼 긴장이 한양의 밤을 갈랐다.'),jC('joseon_soldier','문을 잠그십시오. 왕자들의 군사가 움직였습니다.','worried'),jP('새 나라가 가장 먼저 맞은 적은 바깥이 아니라 안쪽이었어.','fear')]],
    ['정도전의 최후',1398,'도성 안 저택가','office',[jN('이방원의 군사는 정도전과 세자 방석의 세력을 제거했다.'),jC('minjun_j','나라의 설계도가 피 묻은 바닥에 흩어졌어요.','worried'),jP('제도를 둘러싼 생각이 권력을 둘러싼 싸움에 무너졌다.','sad')]],
    ['왕좌로 향한 길',1400,'개경과 한양 사이','early-hanyang',[jN('두 차례 왕자의 난 끝에 이방원이 권력을 장악했다.'),jC('joseon_scholar','방간의 군대까지 꺾였으니 이제 왕좌를 막을 이는 없습니다.','serious'),jT('다음 왕은 이 칼을 제도로 바꾸려 할 것이다.','thinking')]]]},
  {n:3,title:'강한 왕의 나라',subtitle:'태종·6조 직계제·호패·신문고',years:'1400 — 1418',beats:[
    ['사병을 거두다',1400,'한양 군영','palace',[jN('태종은 왕자와 공신이 거느리던 사병을 없애 군사권을 왕에게 모았다.'),jC('joseon_soldier','이제 군사는 사가가 아니라 나라의 명을 받습니다.','serious'),jP('왕자의 칼이 왕의 군대로 바뀌는 순간이네.','determined')]],
    ['여섯 부가 왕에게',1414,'육조 관청','office',[jN('의정부를 거치지 않고 6조가 왕에게 직접 보고하는 체제가 강화되었다.'),jC('joseon_scholar','보고가 빨라지는 만큼 왕의 책임과 힘도 커집니다.','serious'),jP('6조 직계제. 태종의 왕권 강화가 구조가 됐어.','thinking')]],
    ['호패와 신문고',1414,'도성 관청 앞','market',[jN('백성의 신분을 확인하는 호패가 시행되고, 억울함을 알릴 신문고가 마련되었다.'),jC('joseon_woman','패 하나가 사람을 기록하고, 북 하나가 억울함을 기록하는군요.','neutral'),jT('통제와 구제가 같은 왕의 손에서 나왔다.','thinking')]]]},
  {n:4,title:'세종의 시간',subtitle:'집현전·장영실·과학·농사직설',years:'1418 — 1450',beats:[
    ['집현전의 밤',1420,'경복궁 집현전','jiphyeonjeon',[jN('젊은 학자들의 등잔불이 새벽까지 꺼지지 않았다.'),jC('joseon_scholar','경연과 편찬, 연구가 모두 이 방에서 이어집니다.','smile','집현전 학사'),jP('세종은 사람을 모아 지식을 국가의 힘으로 바꾸고 있어.','smile')]],
    ['하늘과 시간을 재다',1434,'경복궁 과학 기구 제작소','jiphyeonjeon',[jN('장영실은 자격루와 앙부일구를 만들고, 강우량을 재는 측우기가 세워졌다.'),jC('joseon_scholar','백성이 시간을 알고 비의 양을 알면 농사와 행정이 달라집니다.','serious','장영실'),jP('과학이 궁궐의 장식이 아니라 생활의 도구가 됐어.','surprised')]],
    ['농사직설',1429,'도성 밖 농촌','rural',[jN('각 고장의 경험을 모아 우리 풍토에 맞는 농법이 농사직설에 담겼다.'),jC('joseon_woman','중국 책만 따라 하지 않고 우리 땅의 말을 들었다는 게 중요해요.','smile'),jT('정책이 논밭에 닿을 때 지식은 비로소 살아난다.','relieved')]]]},
  {n:5,title:'백성을 위한 글자',subtitle:'훈민정음 창제와 반포',years:'1443 — 1446',beats:[
    ['스물여덟 글자',1443,'경복궁 집현전','jiphyeonjeon',[jN('세종은 백성이 쉽게 익힐 새 글자 스물여덟 자를 만들었다.'),jC('joseon_scholar','소리를 본떠 누구나 제 뜻을 적게 하려는 문자입니다.','smile'),jP('말은 있었지만 적지 못하던 사람들에게 문이 열리는구나.','surprised')]],
    ['반대하는 상소',1444,'조정 회의','office',[jN('일부 신하는 중국 질서와 다르다며 새 글자를 반대했다.'),jC('joseon_scholar','새 글이 질서를 어지럽힌다는 상소가 거셉니다.','worried'),jP('배우기 쉬운 글자가 누군가에게는 권력의 흔들림이었겠지.','determined')]],
    ['훈민정음 반포',1446,'한양 장터','market',[jN('훈민정음이 반포되자 사람들은 자신의 말과 소리를 글로 옮기기 시작했다.'),jC('joseon_woman','내 아이 이름을 내 손으로 쓸 수 있다니 믿기지 않아요.','smile'),jP('문자는 기억을 지키는 가장 오래가는 도구야.','relieved')]]]},
  {n:6,title:'북방의 선',subtitle:'4군 6진·김종서·여진',years:'1433 — 1449',beats:[
    ['압록강의 네 군',1433,'압록강 북방 진영','frontier',[jN('최윤덕의 군대가 압록강 상류에 4군을 설치했다.'),jC('joseon_soldier','강을 경계로 삼아 백성이 머물 땅을 지키겠습니다.','serious'),jP('지도 위 선은 현장의 추위와 싸움으로 만들어졌어.','worried')]],
    ['두만강의 여섯 진',1437,'두만강 변경','frontier',[jN('김종서는 여진 세력을 몰아내고 두만강 일대에 6진을 개척했다.'),jC('joseon_soldier','성 하나를 세우려면 군사보다 먼저 사람이 살아야 합니다.','serious','김종서 휘하 군관'),jP('영토를 얻는 일과 삶의 터전을 만드는 일은 같지 않아.','thinking')]],
    ['사민 정책',1449,'북방 새 마을','rural',[jN('조정은 남쪽 백성을 이주시켜 북방의 고을을 채웠다.'),jC('joseon_woman','떠나온 집은 멀지만 아이가 자랄 땅은 여기예요.','worried'),jT('4군 6진은 지도만이 아니라 이주한 사람들의 시간으로 완성됐다.','sad')]]]},
  {n:7,title:'빼앗긴 왕좌',subtitle:'계유정난·단종·세조·사육신',years:'1453 — 1468',beats:[
    ['계유정난',1453,'한양 궁궐 문','palace',[jN('수양대군은 김종서 등을 제거하고 권력을 장악했다.'),jC('joseon_soldier','궁문이 닫혔습니다. 오늘부터 명령을 내리는 사람이 달라집니다.','serious'),jP('어린 왕의 자리를 지킨다던 칼이 왕좌를 향했어.','shock')]],
    ['단종과 사육신',1456,'한양 형장으로 가는 길','office',[jN('성삼문과 박팽년 등은 단종 복위를 꾀하다 처형되었다.'),jC('joseon_scholar','목숨을 버려도 임금을 바꿀 수 없다는 사람들이 있었습니다.','sad'),jP('충절이라는 말 뒤에 너무 많은 이름이 사라졌다.','crying')]],
    ['세조의 제도',1466,'조정 관청','office',[jN('세조는 6조 직계제를 강화하고 직전법을 시행했으며 불경 간행을 추진했다.'),jC('joseon_scholar','왕위를 얻은 방식과 나라를 다스린 제도는 함께 기억될 겁니다.','serious'),jT('강한 왕권은 질서를 만들었지만 상처를 지우지는 못했다.','thinking')]]]},
  {n:8,title:'법으로 다스리는 나라',subtitle:'성종·경국대전·홍문관·사림',years:'1469 — 1494',beats:[
    ['경국대전 완성',1485,'조정 법전 편찬소','office',[jN('성종 때 조선의 통치 규범을 모은 경국대전이 완성되었다.'),jC('joseon_scholar','왕이 바뀌어도 지켜야 할 기준을 한 법전에 담았습니다.','serious'),jP('이제 조선은 사람의 명령만이 아니라 법의 틀로 움직여.','determined')]],
    ['홍문관과 경연',1485,'경복궁 홍문관','jiphyeonjeon',[jN('홍문관은 경연과 문서 자문을 맡고 사헌부·사간원과 함께 언론 기능을 수행했다.'),jC('joseon_scholar','왕에게 바른 말을 하는 것도 관청의 임무입니다.','smile','홍문관 관리'),jP('권력을 견제하는 말까지 제도 안에 넣었구나.','thinking')]],
    ['훈구와 사림',1490,'지방 향촌과 도성','rural',[jN('공신 중심의 훈구와 지방에서 성장한 사림이 중앙 정치에서 마주쳤다.'),jC('joseon_scholar','향촌의 학문이 이제 조정의 논쟁이 되었습니다.','serious'),jT('다음 시대의 갈등은 칼보다 붓에서 시작될지도 몰라.','worried')]]]},
  {n:9,title:'붓이 죄가 된 시대',subtitle:'연산군·무오사화·갑자사화',years:'1498 — 1504',beats:[
    ['사초를 열다',1498,'춘추관 사고','office',[jN('김일손의 사초에 실린 조의제문이 문제 되며 무오사화가 시작되었다.'),jC('joseon_scholar','역사를 기록한 글이 오늘의 죄목이 되었습니다.','worried','사관'),jP('기록을 두려워하는 권력은 기록한 사람부터 없애려 해.','angry')]],
    ['무오사화',1498,'한양 의금부 앞','office',[jN('김종직의 제자와 사림이 화를 입고 언론은 얼어붙었다.'),jC('joseon_woman','어제까지 글을 가르치던 분이 오늘은 죄인이라니요.','sad'),jP('조용해진 조정이 평온한 조정은 아니야.','determined')]],
    ['갑자사화',1504,'연산군의 궁궐','palace',[jN('폐비 윤씨 사건을 빌미로 갑자사화가 일어나 훈구와 사림이 함께 숙청되었다.'),jC('minjun_j','왕의 개인적 원한이 나라의 형벌이 되어 버렸어요.','worried'),jT('제도가 멈추면 감정이 곧 법이 된다.','sad')]]]},
  {n:10,title:'개혁의 꿈, 사라진 이름',subtitle:'중종·조광조·기묘사화',years:'1506 — 1519',beats:[
    ['반정 뒤의 개혁',1506,'중종의 조정','palace',[jN('중종반정으로 연산군이 쫓겨났지만 공신 세력은 강했다.'),jC('joseon_scholar','왕을 바꾼 공신이 곧 새 왕의 울타리이자 벽입니다.','serious'),jP('반정은 시작일 뿐, 정치를 바꾸는 일은 더 어렵겠지.','thinking')]],
    ['조광조의 길',1518,'성균관과 조정','jiphyeonjeon',[jN('조광조는 현량과와 향약을 추진하고 소격서 폐지와 위훈 삭제를 주장했다.'),jC('joseon_scholar','사림의 도덕을 정치의 기준으로 세우려 합니다.','determined','조광조'),jP('빠른 개혁은 오래된 권력을 정면으로 건드렸어.','worried')]],
    ['기묘사화',1519,'훈련원 들판','office',[jN('훈구 세력의 반격으로 조광조와 사림이 숙청되었다.'),jC('joseon_woman','백성이 믿던 이름들이 하룻밤 사이 역적이 되었어요.','sad'),jT('개혁의 실패가 생각까지 사라졌다는 뜻은 아닐 거야.','determined')]]]},
  {n:11,title:'갈라진 조정',subtitle:'선조·동인과 서인·통신사',years:'1567 — 1591',beats:[
    ['동인과 서인',1575,'한양 조정','office',[jN('관리 임명 문제를 둘러싼 갈등이 동인과 서인으로 갈라졌다.'),jC('joseon_scholar','정책 논쟁이 사람과 가문의 편으로 굳어지고 있습니다.','worried'),jP('붕당은 의견의 차이로 시작했지만 권력 경쟁이 되어 가네.','thinking')]],
    ['북방의 경고',1583,'함경도 변경','frontier',[jN('니탕개가 이끄는 여진 세력이 북방을 침입했다.'),jC('joseon_soldier','남쪽만 바라볼 때가 아닙니다. 국경은 이미 흔들리고 있습니다.','serious'),jP('전쟁의 징후가 여러 방향에서 오고 있어.','worried')]],
    ['엇갈린 통신사 보고',1591,'한양 조정','office',[jN('일본에 다녀온 통신사들은 침략 가능성을 두고 서로 다른 보고를 올렸다.'),jC('joseon_scholar','같은 것을 보고도 당파에 따라 결론이 달랐습니다.','worried'),jP('판단이 늦어진 대가를 곧 백성이 치르게 될 거야.','fear')]]]},
  {n:12,title:'나라가 무너지는 날',subtitle:'임진왜란·피난·의병',years:'1592 — 1593',beats:[
    ['부산진이 무너지다',1592,'부산진과 동래','war-hanyang',[jN('일본군이 부산진과 동래성을 무너뜨리고 빠르게 북상했다.'),jC('joseon_soldier','화살을 다시 얹을 틈도 없이 적이 밀려옵니다.','fear'),jP('전쟁은 경고보다 훨씬 빨리 현실이 됐어.','shock')]],
    ['한양을 버린 밤',1592,'의주로 향하는 피난길','refugee-route',[jN('선조는 한양을 떠나 의주로 피난했고 도성은 혼란에 빠졌다.'),jC('joseon_woman','임금도 떠난 길에서 우리는 어디로 가야 하나요?','crying'),jP('나라가 사라질 것 같은 순간에도 사람들은 서로를 붙잡고 걷는다.','determined')]],
    ['의병이 일어나다',1592,'경상도 의병 진영','rural',[jN('곽재우·고경명 등 지역의 선비와 백성이 의병을 일으켰다.'),jC('joseon_soldier','관군이 닿지 못한 곳은 우리가 지키겠습니다.','determined','의병장'),jP('누가 명령해서가 아니라 살던 곳을 지키기 위해 모였어.','relieved')]]]},
  {n:13,title:'바다의 길을 지켜라',subtitle:'이순신·옥포·한산도·거북선',years:'1592 — 1593',beats:[
    ['옥포의 첫 승리',1592,'옥포 앞바다','navy-port',[jN('이순신이 이끄는 조선 수군이 옥포에서 첫 승리를 거두었다.'),jC('joseon_naval','적의 배가 아니라 보급로를 끊어야 전쟁을 바꿀 수 있습니다.','serious'),jP('바다를 지키는 일이 육지의 시간을 벌어 주는구나.','determined')]],
    ['거북선',1592,'전라좌수영 선소','navy-port',[jN('판옥선을 바탕으로 덮개와 돌격 구조를 갖춘 거북선이 전투에 나섰다.'),jC('joseon_naval','앞에서는 돌파하고, 뒤에서는 판옥선이 화포를 쏩니다.','smile'),jP('무기 하나보다 함대 전체의 전술이 핵심이야.','thinking')]],
    ['한산도 대첩',1592,'한산도 앞바다','navy-port',[jN('학익진으로 적을 넓은 바다에 끌어낸 조선 수군이 크게 승리했다.'),jC('joseon_naval','지금입니다. 양쪽 날개를 닫아 적선을 포위하라!','determined','이순신 휘하 군관'),jP('육지로 가던 적의 길이 바다에서 끊겼어.','relieved')]]]},
  {n:14,title:'열두 척의 바다',subtitle:'정유재란·명량·노량',years:'1597 — 1598',beats:[
    ['다시 시작된 전쟁',1597,'남해 피난 항구','navy-port',[jN('강화 협상이 깨지고 일본군이 다시 침입했다.'),jC('joseon_naval','수군은 무너졌고 남은 배는 열두 척뿐입니다.','worried'),jP('수보다 중요한 건 이 바다를 포기하지 않는 선택이야.','determined')]],
    ['명량의 물살',1597,'명량 해협','navy-port',[jN('이순신은 좁은 해협의 거센 물살을 이용해 일본 수군을 물리쳤다.'),jC('joseon_naval','물길이 바뀌기 전에 버텨야 합니다. 한 척도 물러서지 마라!','determined'),jP('지형과 시간까지 전술이 되는 전투야.','shock')]],
    ['노량의 마지막 밤',1598,'노량 앞바다','navy-port',[jN('철수하던 일본군을 추격한 노량 해전에서 이순신이 전사했다.'),jC('joseon_naval','장군의 죽음을 알리지 마라. 북을 계속 울려라.','crying'),jT('전쟁이 끝나는 순간까지 그는 바다를 놓지 않았다.','sad')]]]},
  {n:15,title:'두 개의 선택',subtitle:'광해군·중립 외교·인조반정',years:'1608 — 1623',beats:[
    ['전쟁 뒤의 왕',1608,'폐허가 남은 한양','war-hanyang',[jN('광해군은 전후 복구와 토지 장부 정비를 추진했다.'),jC('joseon_woman','무너진 집을 세우는 데는 전쟁보다 긴 시간이 드는군요.','tired'),jP('왕의 평가는 전쟁을 끝낸 뒤 무엇을 했는지도 봐야 해.','thinking')]],
    ['명과 후금 사이',1619,'조선 북방 군영','frontier',[jN('광해군은 명의 요청으로 군대를 보내면서도 후금과의 충돌을 피하려 했다.'),jC('joseon_soldier','두 강국 사이에서 한쪽만 고르면 전쟁이 됩니다.','serious'),jP('중립 외교는 비겁함이 아니라 살아남기 위한 계산이었어.','determined')]],
    ['인조반정',1623,'창덕궁의 밤','palace',[jN('서인이 광해군의 외교와 정치 운영을 비판하며 인조반정을 일으켰다.'),jC('minjun_elder_j','왕은 바뀌었지만 후금은 더 강해졌습니다.','worried'),jT('정권의 명분과 국제 정세가 서로 다른 방향으로 움직인다.','worried')]]]},
  {n:16,title:'성문 안의 겨울',subtitle:'정묘·병자호란·남한산성',years:'1627 — 1637',beats:[
    ['정묘호란',1627,'강화도로 향하는 길','refugee-route',[jN('후금이 침입하자 인조는 강화도로 피난했고 형제 관계를 맺고 전쟁을 끝냈다.'),jC('joseon_soldier','전쟁을 멈췄지만 약속은 오래가지 못할 겁니다.','worried'),jP('중립 외교를 버린 대가가 너무 빨리 돌아왔어.','sad')]],
    ['남한산성',1636,'남한산성','namhansanseong',[jN('청군이 빠르게 한양을 압박하자 인조와 조정은 남한산성에 갇혔다.'),jC('joseon_scholar','끝까지 싸우자는 말과 백성을 살리자는 말이 맞섭니다.','serious'),jP('어느 쪽을 택해도 상처가 남는 선택이야.','worried')]],
    ['삼전도의 굴욕',1637,'삼전도','namhansanseong',[jN('인조는 성을 나와 청에 항복했고 조선은 군신 관계를 맺었다.'),jC('joseon_woman','살아남았지만 오늘을 잊을 수는 없을 거예요.','sad'),jT('굴욕의 기억은 이후 북벌론과 새로운 외교를 낳았다.','thinking')]]]},
  {n:17,title:'뒤집히는 조정',subtitle:'숙종·환국·서인과 남인',years:'1680 — 1694',beats:[
    ['경신환국',1680,'숙종의 조정','palace',[jN('남인이 물러나고 서인이 정권을 잡는 경신환국이 일어났다.'),jC('joseon_scholar','정책보다 어느 편인가가 목숨을 가릅니다.','worried'),jP('왕이 붕당을 조정하는 게 아니라 교체하며 힘을 키우고 있어.','thinking')]],
    ['기사환국',1689,'한양 궁궐','palace',[jN('장희빈의 아들 문제로 서인이 밀려나고 남인이 집권했다.'),jC('joseon_woman','왕비가 폐위되자 조정의 사람도 모두 바뀌었어요.','worried'),jP('궁중의 일이 붕당 전체의 운명을 바꾼다.','sad')]],
    ['갑술환국',1694,'한양 조정','office',[jN('다시 남인이 물러나고 서인이 돌아오며 환국 정치가 이어졌다.'),jC('joseon_scholar','오늘의 승자가 내일의 죄인이 되는 세상입니다.','tired'),jT('정국은 안정되지 않았고 왕권만 더 강해졌다.','thinking')]]]},
  {n:18,title:'탕평의 길',subtitle:'영조·균역법·정조·수원 화성',years:'1724 — 1800',beats:[
    ['영조의 탕평',1729,'영조의 조정','palace',[jN('영조는 붕당의 인물을 고루 쓰는 탕평 정치를 내세웠다.'),jC('joseon_scholar','당색보다 능력을 보겠다는 뜻이지만 오래된 원한은 남아 있습니다.','serious'),jP('사람을 섞는 것만으로 갈등이 사라지진 않아.','thinking')]],
    ['균역법',1750,'도성 관청과 장터','market',[jN('군포를 2필에서 1필로 줄이고 결작 등으로 부족한 재정을 보충했다.'),jC('joseon_woman','한 필이 줄어도 가난한 집에는 큰 차이입니다.','relieved'),jP('개혁은 부담을 줄이는 동시에 새 재원을 찾아야 완성돼.','determined')]],
    ['정조와 수원 화성',1796,'수원 화성','suwon-fortress',[jN('정조는 규장각과 장용영을 두고 수원 화성을 건설했다.'),jC('joseon_soldier','배다리로 한강을 건너고 친위 부대가 행차를 지킵니다.','smile'),jP('학문, 군사, 도시를 묶어 왕권과 개혁을 함께 밀어붙였어.','relieved')]]]},
  {n:19,title:'새로운 눈으로 본 세계',subtitle:'실학·북학·박지원·박제가',years:'1750 — 1805',beats:[
    ['땅과 삶을 묻다',1755,'한양의 서재','jiphyeonjeon',[jN('실학자들은 토지와 제도, 백성의 실제 삶을 연구했다.'),jC('joseon_scholar','이름보다 쓸모를, 명분보다 백성의 삶을 먼저 보아야 합니다.','serious'),jP('학문이 현실의 문제를 해결하려고 방향을 바꾸고 있어.','thinking')]],
    ['열하로 가는 길',1780,'청으로 향하는 연행길','refugee-route',[jN('박지원은 열하에서 청의 상업과 기술을 관찰하고 열하일기에 기록했다.'),jC('joseon_scholar','수레와 벽돌, 시장의 움직임까지 배울 것이 많습니다.','smile','박지원'),jP('오랑캐라 부르며 외면하면 배울 기회도 사라져.','determined')]],
    ['북학의',1778,'한양 북학파 모임','office',[jN('박제가는 북학의에서 소비와 유통, 기술의 발전을 주장했다.'),jC('joseon_scholar','재물을 쓰지 않으면 생산도 기술도 자라지 않습니다.','serious','박제가'),jT('닫힌 문을 여는 건 군대보다 먼저 생각일지도 몰라.','thinking')]]]},
  {n:20,title:'움직이는 조선',subtitle:'대동법·공인·장시·화폐·상품 작물',years:'1608 — 1800',beats:[
    ['쌀로 내는 공물',1608,'경기도 관청','office',[jN('대동법이 시행되며 집집마다 바치던 공물을 토지 결수에 따라 쌀 등으로 냈다.'),jC('joseon_woman','방납업자에게 빚지지 않아도 되는 날이 왔군요.','relieved'),jP('세금 방식 하나가 백성의 삶과 시장을 동시에 바꿨어.','thinking')]],
    ['공인과 장시',1700,'조선 후기 장터','late-market',[jN('관청에 물품을 대는 공인과 전국의 장시를 오가는 사상이 성장했다.'),jC('joseon_woman','장날마다 다른 고을의 물건이 모여듭니다.','smile','시장 상인'),jP('시장은 행정의 결과이면서 새로운 경제의 출발점이야.','smile')]],
    ['상평통보',1700,'한양 시전 거리','market',[jN('상평통보가 널리 유통되며 물건과 노동의 값이 화폐로 오갔다.'),jC('joseon_scholar','쌀과 포목 대신 동전이 먼 거래를 이어 줍니다.','neutral'),jP('화폐가 사람과 지역을 더 빠르게 연결하고 있어.','thinking')]],
    ['상품 작물과 수공업',1780,'농촌과 민영 수공업장','rural',[jN('담배·면화 같은 상품 작물이 재배되고 민영 수공업과 광산 개발이 늘었다.'),jC('joseon_woman','먹을 곡식만이 아니라 팔 작물을 심는 집이 많아졌어요.','neutral'),jP('농촌도 자급만 하는 곳에서 시장과 이어진 생산지가 됐어.','determined')]],
    ['서민 문화의 무대',1800,'도성 장터 공연판','late-market',[jN('판소리·탈춤·한글 소설·민화가 장터와 도시에서 인기를 얻었다.'),jC('minjun_elder_j','왕과 양반을 웃음거리로 만드는 이야기에 사람들이 몰리는군요.','smile'),jP('경제가 움직이자 문화를 만드는 사람과 즐기는 사람도 넓어졌어.','laugh')]]]},
  {n:21,title:'무너진 질서',subtitle:'세도 정치·삼정 문란·농민 봉기',years:'1800 — 1862',beats:[
    ['세도 정치',1800,'안동 김씨 세력의 조정','palace',[jN('어린 왕을 대신해 외척 가문이 권력을 독점했다.'),jC('joseon_scholar','관직과 세금이 나라보다 가문의 이익을 위해 움직입니다.','worried'),jP('견제할 힘이 사라지자 행정 전체가 무너지고 있어.','angry')]],
    ['삼정의 문란',1850,'수탈에 지친 농촌','peasant-village',[jN('전정·군정·환곡이 문란해져 죽은 사람과 아이에게까지 군포가 부과되었다.'),jC('joseon_woman','갚은 곡식도 장부에서는 빚으로 남아 있어요.','crying'),jP('제도가 백성을 지키기는커녕 빚과 형벌이 됐어.','angry')]],
    ['홍경래에서 진주까지',1862,'진주 농민 봉기 현장','peasant-village',[jN('홍경래의 난 이후에도 저항은 이어졌고, 임술년 진주에서 농민 봉기가 크게 일어났다.'),jC('joseon_woman','더는 빼앗길 것도 없어 관아로 가는 겁니다.','determined'),jP('삼정이정청이 세워져도 삶이 바뀌지 않으면 분노는 멈추지 않아.','determined')]]]},
  {n:22,title:'닫힌 문 앞의 함포',subtitle:'흥선 대원군·병인양요·신미양요',years:'1863 — 1875',beats:[
    ['대원군의 개혁',1865,'경복궁 중건 현장','palace',[jN('흥선 대원군은 서원을 정리하고 호포제를 실시했으며 경복궁을 다시 지었다.'),jC('joseon_woman','양반에게도 군포를 걷는다지만 공사 부담은 백성에게 무겁습니다.','worried'),jP('왕권을 세우는 개혁과 백성의 부담이 한 장면에 함께 있어.','thinking')]],
    ['병인양요',1866,'강화도 정족산성','ganghwa',[jN('프랑스군이 강화도를 침입했으나 양헌수 부대가 정족산성에서 맞섰다.'),jC('joseon_soldier','외규장각의 책들이 불타고 약탈당하고 있습니다.','angry'),jP('막아 냈지만 잃어버린 기록과 상처가 너무 커.','sad')]],
    ['신미양요와 척화비',1871,'강화도 광성보','ganghwa',[jN('미군이 강화도를 침입해 어재연 부대와 격전이 벌어졌다.'),jC('joseon_soldier','물러선 적 뒤로 척화비가 세워졌습니다.','tired'),jP('전투는 끝났지만 바깥세상의 문까지 사라진 건 아니야.','worried')]]]},
];

const chapterBackground=n=>JOSEON_BLUEPRINTS.find(ch=>ch.n===n)?.beats[0][3]||'early-hanyang';
Object.assign(CHAPTERS,{
  [joseonChapterId(0)]:{chapterId:joseonChapterId(0),eraId:'joseon',episode:'joseon',number:'00',title:'또 다른 세상',subtitle:'경복궁의 비, 1390년대 한양으로',years:'2026 → 1394',thumbnail:'assets/joseon/backgrounds/early-hanyang.webp',startStoryId:'joseon_ch00_s1',completeStoryId:'joseon_ch00_complete',questionCount:0,reviewQuestionCount:0,implemented:true}
});

STORIES.joseon_ch00_s1=scene({sceneId:'joseon_ch00_s1',chapterId:joseonChapterId(0),eraId:'joseon',year:2026,location:'현대 경복궁 서쪽 돌담길',title:'경복궁의 비',illustrationId:'joseon-modern-gyeongbokgung',dialogues:[jN('현대 서울. 경복궁 근처 답사를 마치자 맑던 하늘에서 갑자기 굵은 비가 쏟아졌다.'),jT('일기 예보에는 비가 없었는데…… 우선 처마 아래로.','worried'),jN('돌담 위로 번개가 갈라졌고, 천둥보다 먼저 세상의 빛이 꺼졌다.')],nextStoryId:'joseon_ch00_s2'});
STORIES.joseon_ch00_s2=scene({sceneId:'joseon_ch00_s2',chapterId:joseonChapterId(0),eraId:'joseon',year:1394,location:'1390년대 한양 밖 흙길',title:'번개 뒤의 흙길',illustrationId:joseonAssetId('rural'),sceneEffect:'blackout',dialogues:[jN('젖은 아스팔트 대신 진흙 냄새가 올라왔다. 산 아래에는 낯선 초가와 공사 행렬이 이어졌다.'),jC('minjun_j','정신이 드십니까? 한양 가는 길 한복판에 쓰러져 계셨습니다.','worried'),jP('한양…… 지금이 몇 년이죠?','confused')],nextStoryId:'joseon_ch00_s3'});
STORIES.joseon_ch00_s3=scene({sceneId:'joseon_ch00_s3',chapterId:joseonChapterId(0),eraId:'joseon',year:1394,location:'한양으로 가는 길',title:'태조라는 단서',illustrationId:joseonAssetId('early-hanyang'),dialogues:[jC('minjun_j','저는 민준입니다. 태조 전하께서 정하신 새 도성으로 글 심부름을 가는 길이지요.','smile'),jP('태조…… 새 도성 한양…… 설마.','shock'),jN('스물넷의 얼굴, 긴 땋은 머리와 낯선 치마. 거울 속 나부터 달라져 있었다.')],nextStoryId:'joseon_ch00_s4'});
STORIES.joseon_ch00_s4=scene({sceneId:'joseon_ch00_s4',chapterId:joseonChapterId(0),eraId:'joseon',year:1394,location:'새 수도 한양',title:'눈떠보니 조선',illustrationId:joseonAssetId('early-hanyang'),dialogues:[jN('산 아래 새 길이 뚫리고 궁궐을 지을 나무와 돌이 끝없이 들어왔다.'),jC('minjun_j','고려는 끝났습니다. 이제 조선의 수도가 이곳에 세워집니다.','serious'),jP('1390년대 한양. 나는 조선 500년의 시작에 떨어졌어.','determined')],nextStoryId:'joseon_ch00_complete'});
STORIES.joseon_ch00_complete=scene({sceneId:'joseon_ch00_complete',chapterId:joseonChapterId(0),eraId:'joseon',year:1394,location:'한양 도성 터',title:'새 시대의 첫날',illustrationId:joseonAssetId('early-hanyang'),dialogues:[jN('문제 없이 시작된 첫 장은 오직 시간 여행과 민준, 그리고 새 도성의 기억으로 남았다.'),jP('이번에도 직접 보고, 듣고, 기억하자.','determined')],completeChapter:true});

JOSEON_BLUEPRINTS.forEach(ch=>{
  const id=joseonChapterId(ch.n),completeId=`joseon_ch${String(ch.n).padStart(2,'0')}_complete`;
  CHAPTERS[id]={chapterId:id,eraId:'joseon',episode:'joseon',number:String(ch.n).padStart(2,'0'),title:ch.title,subtitle:ch.subtitle,years:ch.years,thumbnail:`assets/joseon/backgrounds/${JOSEON_BACKGROUND_PATHS[chapterBackground(ch.n)]}`,startStoryId:joseonSceneId(ch.n,1),completeStoryId:completeId,questionCount:0,reviewQuestionCount:0,implemented:true};
  ch.beats.forEach((beat,index)=>{
    const sceneId=joseonSceneId(ch.n,index+1),next=index<ch.beats.length-1?joseonSceneId(ch.n,index+2):completeId;
    STORIES[sceneId]=scene({sceneId,chapterId:id,eraId:'joseon',year:beat[1],location:beat[2],title:beat[0],illustrationId:joseonAssetId(beat[3]),dialogues:beat[4],nextStoryId:next,readingMode:'narration-blocks'});
  });
  STORIES[completeId]=scene({sceneId:completeId,chapterId:id,eraId:'joseon',year:Number(ch.years.slice(-4))||ch.beats.at(-1)[1],location:ch.beats.at(-1)[2],title:`CH.${String(ch.n).padStart(2,'0')} 기억 완료`,illustrationId:joseonAssetId(ch.beats.at(-1)[3]),dialogues:[jN(`${ch.title}의 사건과 인물, 제도가 하나의 흐름으로 이어졌다.`),jP('이 장면을 실제 기출의 단서와 함께 기억해 두자.','relieved')],completeChapter:true});
});

/* CH.22 고정 엔딩: 신미양요 → 강화도 해안 → 1875 운요호. */
STORIES[joseonSceneId(22,3)].nextStoryId='joseon_ch22_shore';
STORIES.joseon_ch22_shore=scene({sceneId:'joseon_ch22_shore',chapterId:joseonChapterId(22),eraId:'joseon',year:1871,location:'강화도 해안',title:'물러난 함대',illustrationId:joseonAssetId('ganghwa'),dialogues:[jN('포연이 걷힌 바다를 바라보며 살아남은 사람들이 숨을 골랐다.'),jC('joseon_woman','이제 외국 놈들도 다시는 오지 않겠지요.','relieved','강화도 주민'),jP('...글쎄.','worried')],nextStoryId:'joseon_ch22_unyo'});
STORIES.joseon_ch22_unyo=scene({sceneId:'joseon_ch22_unyo',chapterId:joseonChapterId(22),eraId:'joseon',year:1875,location:'강화도 앞바다',title:'...또 왔네',illustrationId:joseonAssetId('unyo'),sceneEffect:'blackout',dialogues:[jN('1875년. 어둠 너머로 다시 함포와 증기선의 그림자가 다가왔다.'),jT('...또 왔네.','shock'),jN('운요호.')],nextStoryId:'joseon_ch22_complete'});
STORIES.joseon_ch22_complete=scene({sceneId:'joseon_ch22_complete',chapterId:joseonChapterId(22),eraId:'joseon',year:1875,location:'시간의 경계',title:'END · 새로운 시대',illustrationId:joseonAssetId('unyo'),dialogues:[jN('END'),jN('새로운 시대가 다가오고 있습니다.'),jP('조선의 끝은 아직 아니지만, 이전과 같은 조선으로는 돌아갈 수 없어.','determined')],completeChapter:true});
CHAPTERS[joseonChapterId(22)].completeStoryId='joseon_ch22_complete';

const JOSEON_OFFICIAL_QUESTIONS=[
  [73,20,1,'01','정도전·조선경국전','joseon-foundation'],[73,21,3,'04','세종·칠정산','sejong-science'],[73,22,2,'12','명과의 외교·사절','imjin-diplomacy'],[73,23,5,'09','연산군·사화','yeonsangun-purges'],[73,24,4,'16','병자호란·남한산성','byeongja-horan'],[73,25,4,'08','유향소·향촌 자치','local-governance'],[73,26,1,'19','정선·진경산수화','late-culture'],[73,27,5,'17','숙종·환국','sukjong-hwanguk'],[73,28,2,'18','영조·균역법','gyunyeok'],[73,29,1,'14','정유재란','jeongyu-war'],[73,30,1,'20','조선 후기 신분·경제 변화','late-economy'],[73,31,4,'21','홍경래·진주 농민 봉기','peasant-uprisings'],
  [74,20,1,'15','인조·이괄의 난 이후','injo-politics'],[74,21,3,'13','임진왜란·이순신','yi-sunsin'],[74,22,4,'17','숙종·인현 왕후·남인','sukjong-hwanguk'],[74,23,4,'10','이황·서원·사림','sarim-seowon'],[74,24,3,'18','정조·장용영','jeongjo-reforms'],[74,25,5,'21','순조·신유박해','sedo-society'],[74,26,2,'20','탈춤·판소리·민화','popular-culture'],[74,27,2,'20','도성 시장·난전','late-markets'],
  [75,20,5,'08','도화서·관청 조직','joseon-offices'],[75,21,2,'11','선조·니탕개의 난','northern-crisis'],[75,22,2,'10','을사사화·외척 정치','eulsa-purge'],[75,23,2,'16','병자호란·삼학사','byeongja-horan'],[75,24,3,'15','인조반정','injo-coup'],[75,25,1,'20','도성 상업·서민 문화','popular-culture'],[75,26,1,'20','대동법·상품 화폐 경제','daedong-economy'],[75,27,4,'21','세도 정치·김좌근','sedo-politics'],
  [76,20,5,'10','조광조·기묘사화','gimyo-purge'],[76,21,1,'12','임진왜란·남원성','imjin-war'],[76,22,2,'08','홍문관·언론 3사','hongmungwan'],[76,23,5,'20','공납·대동법','daedong-law'],[76,24,4,'19','박지원·열하일기','park-jiwon'],[76,25,2,'18','영조·청계천·신문고','yeongjo-reforms'],[76,26,3,'20','조선 후기 경제·문화','late-economy'],[76,27,3,'20','신윤복·풍속화','genre-painting'],[76,28,2,'22','흥선 대원군 개혁','daewongun-reforms'],[76,29,5,'18','균역법·결작','gyunyeok'],
  [77,20,5,'07','세조·간경도감','sejo-rule'],[77,21,4,'10','이황·사단칠정','sarim-learning'],[77,22,5,'16','병자호란·남한산성','byeongja-horan'],[77,23,1,'20','조선 후기 풍속화·탈춤','popular-culture'],[77,24,3,'17','숙종·보사공신·금위영','sukjong-rule'],[77,25,3,'20','도고·대동법 이후 상업','late-commerce'],[77,26,4,'19','박제가·북학의','park-jega'],[77,28,3,'21','진주 농민 봉기','jinju-uprising'],[77,29,4,'22','병인양요·정족산성','byeongin-yangyo'],
  [78,19,1,'07','단종 복위 운동·금성대군','danjong-restoration'],[78,20,5,'03','의금부·왕권','royal-justice'],[78,21,1,'11','신숙주·해동제국기','japan-diplomacy'],[78,22,4,'12','임진왜란·진주성','jinju-battle'],[78,23,1,'16','효종·북벌·나선 정벌','hyojong-northern-policy'],[78,24,5,'18','정조·배다리·수원 화성','jeongjo-reforms'],[78,25,1,'20','상품 화폐 경제','commodity-economy'],[78,26,5,'19','김정희·추사체','late-culture'],[78,27,2,'21','향촌 질서의 동요','local-disorder'],
  [79,19,5,'04','세종·사가독서','sejong-learning'],[79,20,4,'07','세조·직전법','jikjeon-law'],[79,21,2,'20','장터·전기수·광대','popular-culture'],[79,22,4,'16','임진왜란 이후·병자호란','war-transition'],[79,23,4,'18','영조·청계천 준설','yeongjo-reforms'],[79,24,3,'03','승정원·유지','royal-secretariat'],[79,25,1,'19','홍대용·의산문답','hong-daeyong'],[79,26,3,'20','역관·중인','middle-people'],[79,27,1,'12','임진왜란·고경명 의병','righteous-army']
];

const joseonPageFor=(round,number)=>round===73?(number===20?5:number<=24?6:number<=29?7:8):round===74?(number<=22?5:number<=26?6:7):round===75?(number<=21?5:number<=25?6:7):round===76?(number<=21?5:number<=26?6:7):round===77?(number<=21?5:number<=25?6:7):round===78?(number<=20?5:number<=25?6:7):(number<=21?5:number<=25?6:7);
const joseonExamYear=round=>round===79?2026:2025;
const joseonOptionLabels=['원본 선택지 1','원본 선택지 2','원본 선택지 3','원본 선택지 4','원본 선택지 5'];
const JOSEON_SOURCE_PDF_HASHES={73:'d6ad706f1bd7ce3a0b18d7b7cdda9439d10b7b712121428b21af2c31268c4836',74:'7d7322d680119d7b7b89c7465edc1dd8d0f06e8180594aff69b7d34502a44c79',75:'2af5466f3be54d75eb65098f042f5f9c56de01fd213a71dfbe460ea222cc137e',76:'b25c8617eb817711a54e69c09040298bf1b102f59fe29aebaad3558981e834f3',77:'c3ff51d9273f7812a2b84d7fac4e8e1cb9aa642e80a4f53ebfc2a8afc5503e88',78:'7d96d41c1686c5b3ea3c533d76fbb23235c44d8e55f53e81a320e31cf914fba0',79:'fa82e6c8977670c1b55778b061e33ee367c55cd3f8707806f63d70d8353453d7'};
const JOSEON_ANSWER_PDF_HASHES={73:'0dfeee4af303493e95a3a30c7f7cd890377f067789bdb7c00a9cc90af15c6347',74:'db21586adfbe6df757b51a87eb0824cb414379cbe8f984c8fe1709e5b3643b46',75:'9ecff7c82b2f0343d3e6fd9dec389431411257e00fd8a53b11d519cb58c5dad1',76:'9da8824061aa649e0c1246edc70bf86cb29273cbe24eabf11b636123d3c9e98b',77:'71b9b6ef633f0e70b6a9b3c4565ec2f02a1ba2ef5f805f34d77d41427913b304',78:'a8e8513c5d73ae81594460354a7b8a83ddaec9894001ff66cecae40f4d280638',79:'ea380c4a1f4f24ebd4c95ad171aa7ace3fc0654284fbe2d7be4d5b1f675ec393'};
const JOSEON_IMAGE_HEIGHTS={73:{20:960,21:900,22:1030,23:760,24:1175,25:775,26:1160,27:580,28:465,29:880,30:900,31:1040},74:{20:615,21:465,22:845,23:810,24:1130,25:905,26:1035,27:1020},75:{20:1004,21:931,22:1059,23:876,24:930,25:1005,26:519,27:731},76:{20:1024,21:911,22:627,23:609,24:697,25:1115,26:820,27:1119,28:815,29:1163},77:{20:1064,21:871,22:985,23:950,24:1165,25:770,26:947,28:605,29:643},78:{19:890,20:1050,21:490,22:805,23:620,24:980,25:960,26:1000,27:940},79:{19:1070,20:790,21:1150,22:890,23:1050,24:970,25:970,26:830,27:1110}};
const joseonQuestionCounts={};
const joseonChapterQuestionIndex={};
JOSEON_OFFICIAL_QUESTIONS.forEach(row=>{
  const [round,number,answer,chapterNumber,concept,event]=row,chapterId=joseonChapterId(chapterNumber),blueprint=JOSEON_BLUEPRINTS.find(ch=>String(ch.n).padStart(2,'0')===chapterNumber);
  const cursor=joseonChapterQuestionIndex[chapterId]||0,sceneIndex=cursor%blueprint.beats.length+1,relatedSceneId=joseonSceneId(Number(chapterNumber),sceneIndex),story=STORIES[relatedSceneId];
  joseonChapterQuestionIndex[chapterId]=cursor+1;
  const questionId=`joseon-official-${round}-advanced-${number}`;
  QUESTIONS.push(question({
    questionId,officialQuestionId:questionId,chapterId,era:'조선',primaryEra:'joseon',relatedSceneId,
    relatedHistoricalEventId:event,historicalEventId:event,historicalEvent:concept,relatedIllustrationId:story.illustrationId,
    questionType:'원본 자료 분석형',difficulty:'심화',question:`${concept}에 관한 원본 자료를 보고 옳은 답을 고르세요.`,
    sourceQuestionText:`${concept} · 원본 자료 분석`,choices:[...joseonOptionLabels],sourceChoices:[...joseonOptionLabels],answer:answer-1,
    explanation:`이 문항은 ${concept}을(를) 실제 한능검 자료와 선택지로 구분하는 문제입니다. 이야기의 ‘${story.title}’ 장면에서 경험한 인물·제도·사건의 연결을 다시 확인합니다.`,
    wrongFeedback:`${concept}의 시기와 관련 제도를 장면의 기억과 다시 연결해 보세요.`,memoryPrompt:`${story.title} 장면을 떠올린다`,
    gameMemory:`${story.year}년 ${story.location}에서 ${story.title}을(를) 직접 경험했습니다.`,examKeywords:concept.split('·'),concepts:concept.split('·'),conceptIds:[event,...concept.split('·')],
    rewardKnowledge:3,resumeStoryId:story.nextStoryId,isOfficial:true,sourceVerified:true,sourceImageStatus:'verified',
    examRound:round,examYear:joseonExamYear(round),examLevel:'심화',questionNumber:number,sourcePage:joseonPageFor(round,number),
    sourceFile:`제${round}회 한국사능력검정시험 심화 문제지.pdf`,answerFile:`제${round}회 한국사능력검정시험 심화 정답표.pdf`,
    sourcePdf:`제${round}회 한국사능력검정시험 심화 문제지.pdf`,sourcePdfHash:JOSEON_SOURCE_PDF_HASHES[round],answerPdfHash:JOSEON_ANSWER_PDF_HASHES[round],
    sourceQuestionImage:`assets/exams/joseon/${round}-advanced-${number}.webp`,questionImage:`assets/exams/joseon/${round}-advanced-${number}.webp`,sourceImageWidth:714,sourceImageHeight:JOSEON_IMAGE_HEIGHTS[round][number],examType:`제${round}회 한국사능력검정시험 심화 실제 기출`,
    source:`국사편찬위원회 한국사능력검정시험 제${round}회 심화 문제지·정답표 대조`
  }));
  joseonQuestionCounts[chapterId]=(joseonQuestionCounts[chapterId]||0)+1;
});

const JOSEON_PRACTICE_QUESTIONS=[
  ['02',2,'왕자의 난','왕자의 난 이후 이방원이 왕권을 장악하게 된 흐름으로 옳은 것은?',['정도전이 왕권을 장악하였다.','이방원이 두 차례 왕자의 난을 거쳐 권력을 장악하였다.','세종이 사병을 혁파하였다.','성종이 6조 직계제를 처음 시행하였다.'],1,'이방원은 두 차례 왕자의 난을 거쳐 권력을 장악했고 뒤에 태종이 되었습니다.'],
  ['02',3,'정도전과 이방원','왕자의 난에서 제거된 인물로 조선경국전을 저술한 이는?',['정도전','김종서','조광조','박지원'],0,'정도전은 조선의 통치 체제를 설계했으나 제1차 왕자의 난 때 제거되었습니다.'],
  ['05',2,'훈민정음 창제','훈민정음 창제의 가장 직접적인 목적은?',['불경만을 번역하기 위해서','백성이 쉽게 자신의 뜻을 적게 하기 위해서','과거 시험을 폐지하기 위해서','한자를 없애기 위해서'],1,'세종은 백성이 쉽게 익혀 자신의 뜻을 표현할 수 있도록 훈민정음을 만들었습니다.'],
  ['05',3,'훈민정음 반포','훈민정음이 반포된 해는?',['1418년','1429년','1443년','1446년'],3,'훈민정음은 1443년에 창제되고 1446년에 반포되었습니다.'],
  ['06',2,'4군 6진','두만강 일대 6진 개척을 지휘한 인물은?',['최윤덕','김종서','이순신','강홍립'],1,'김종서는 두만강 일대에 6진을 개척했습니다.'],
  ['06',3,'북방 개척','세종 대 북방 개척의 결과로 가장 적절한 것은?',['압록강과 두만강을 경계로 하는 영토가 확보되었다.','강화도로 수도를 옮겼다.','대마도를 정벌해 영토로 삼았다.','요동을 완전히 차지하였다.'],0,'4군 6진 개척으로 압록강과 두만강을 경계로 하는 오늘날의 국경선이 자리 잡았습니다.']
];
JOSEON_PRACTICE_QUESTIONS.forEach(([chapterNumber,sceneIndex,concept,text,choices,answer,explanation],index)=>{
  const chapterId=joseonChapterId(chapterNumber),relatedSceneId=joseonSceneId(Number(chapterNumber),sceneIndex),story=STORIES[relatedSceneId],questionId=`joseon-practice-${chapterNumber}-${index+1}`;
  QUESTIONS.push(question({questionId,chapterId,era:'조선',primaryEra:'joseon',relatedSceneId,relatedHistoricalEventId:`practice-${chapterNumber}-${sceneIndex}`,historicalEventId:`practice-${chapterNumber}-${sceneIndex}`,historicalEvent:concept,relatedIllustrationId:story.illustrationId,questionType:'핵심 개념 확인형',difficulty:'중',question:text,choices,answer,explanation,wrongFeedback:`${concept} 장면을 다시 떠올려 보세요.`,examKeywords:[concept],concepts:[concept],conceptIds:[concept],rewardKnowledge:2,resumeStoryId:story.nextStoryId,isOfficial:false,sourceType:'original_advanced_practice',examType:'심화 연습 · 자체 제작',source:'조선편 스토리 사실관계 기반 자체 제작'}));
  joseonQuestionCounts[chapterId]=(joseonQuestionCounts[chapterId]||0)+1;
});

/* 장면마다 연결된 문제를 같은 ID로 스토리, 기출 모음, 오답노트가 공유한다. */
JOSEON_BLUEPRINTS.forEach(ch=>{
  const chapterId=joseonChapterId(ch.n),chapterQuestionIds=[];
  ch.beats.forEach((beat,index)=>{
    const story=STORIES[joseonSceneId(ch.n,index+1)],linked=QUESTIONS.filter(q=>q.chapterId===chapterId&&q.relatedSceneId===story.sceneId).map(q=>q.questionId);
    if(!linked.length)return;
    const setId=`${story.sceneId}_questions`,officialIds=linked.filter(id=>QUESTIONS.find(q=>q.questionId===id)?.isOfficial),practiceIds=linked.filter(id=>!QUESTIONS.find(q=>q.questionId===id)?.isOfficial);
    QUESTION_SETS[setId]={questionSetId:setId,chapterId,afterSceneId:story.sceneId,resumeStoryId:story.nextStoryId,questionPoolId:`${chapterId}-official-practice`,conceptIds:linked.flatMap(id=>QUESTIONS.find(q=>q.questionId===id)?.conceptIds||[]),requiredCount:linked.length,officialQuestionIds:officialIds,practiceQuestionIds:practiceIds,verifiedCount:officialIds.length,practiceCount:practiceIds.length,missingQuestionCount:0,status:'ready',sourceType:practiceIds.length?'mixed':'official_verified',preserveQuestionOrder:true};
    Object.assign(story,{questionSetId:setId,questionSetStatus:'ready',questionSetResumeStoryId:story.nextStoryId,linkedQuestionIds:[...linked],linkedOfficialQuestionIds:[...officialIds],linkedPracticeQuestionIds:[...practiceIds],questionSequenceMode:'queue'});
    chapterQuestionIds.push(...linked);
  });
  CHAPTERS[chapterId].questionCount=chapterQuestionIds.length;
  CHAPTERS[chapterId].reviewQuestionCount=chapterQuestionIds.length;
  CHAPTERS[chapterId].questionSetCount=ch.beats.filter((_,i)=>STORIES[joseonSceneId(ch.n,i+1)].questionSetId).length;
  if(typeof SPLIT_REVIEW_IDS!=='undefined')SPLIT_REVIEW_IDS[chapterId]=[...chapterQuestionIds];
});

const JOSEON_OFFICIAL_QUESTION_IDS=JOSEON_OFFICIAL_QUESTIONS.map(([round,number])=>`joseon-official-${round}-advanced-${number}`);
const JOSEON_QUESTION_SCOPE={rounds:[73,74,75,76,77,78,79],officialCount:JOSEON_OFFICIAL_QUESTION_IDS.length,practiceCount:JOSEON_PRACTICE_QUESTIONS.length,firstYear:1392,lastYear:1875};
