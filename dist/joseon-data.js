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
  'ganghwa':'ganghwa.webp','unyo':'unyo.webp','hunminjeongeum-workshop':'hunminjeongeum-workshop.webp',
  'hansando-sea':'hansando-sea.webp','jinju-uprising':'jinju-uprising.webp',
  'gyeongbokgung-reconstruction':'gyeongbokgung-reconstruction.webp','jeongjoksanseong':'jeongjoksanseong.webp','gwangseongbo':'gwangseongbo.webp'
};
Object.entries(JOSEON_BACKGROUND_PATHS).forEach(([name,file])=>{
  ASSETS[joseonAssetId(name)]={id:joseonAssetId(name),label:`조선편 ${name} 역사 장면`,src:`assets/joseon/backgrounds/${file}`,imageKind:'story-background',embeddedCharacters:false};
});
ASSETS['joseon-modern-gyeongbokgung']={id:'joseon-modern-gyeongbokgung',label:'현대 경복궁 돌담길에 갑자기 비가 내리는 밤',src:'assets/joseon/backgrounds/modern-gyeongbokgung-rain.webp',imageKind:'story-background',embeddedCharacters:false};
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
  joseon_player:{scale:1.73,translateX:6,translateY:17},
  minjun_j:{scale:1.92,translateX:0,translateY:14},minjun_elder_j:{scale:1.82,translateX:0,translateY:14},
  joseon_scholar:{scale:1.87,translateX:0,translateY:14},joseon_soldier:{scale:1.7,translateX:0,translateY:14},
  joseon_naval:{scale:1.62,translateX:0,translateY:14},joseon_woman:{scale:1.79,translateX:0,translateY:14}
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
    ['스물여덟 글자',1443,'경복궁 집현전','hunminjeongeum-workshop',[jN('세종은 백성이 쉽게 익힐 새 글자 스물여덟 자를 만들었다.'),jC('joseon_scholar','소리를 본떠 누구나 제 뜻을 적게 하려는 문자입니다.','smile'),jP('말은 있었지만 적지 못하던 사람들에게 문이 열리는구나.','surprised')]],
    ['반대하는 상소',1444,'조정 회의','hunminjeongeum-workshop',[jN('일부 신하는 중국 질서와 다르다며 새 글자를 반대했다.'),jC('joseon_scholar','새 글이 질서를 어지럽힌다는 상소가 거셉니다.','worried'),jP('배우기 쉬운 글자가 누군가에게는 권력의 흔들림이었겠지.','determined')]],
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
    ['갑자사화',1504,'연산군의 궁궐','palace',[jN('폐비 윤씨 사건을 빌미로 갑자사화가 일어나 훈구와 사림이 함께 숙청되었다.'),jC('joseon_scholar','증조부 민준이 새 도성에서 보았던 조선이 이렇게 변할 줄은 몰랐습니다.','worried','민준의 증손 민석'),jT('민준은 떠났지만 그의 가족은 이 긴 시간을 살아 내고 있었다.','sad')]]]},
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
    ['한산도 대첩',1592,'한산도 앞바다','hansando-sea',[jN('학익진으로 적을 넓은 바다에 끌어낸 조선 수군이 크게 승리했다.'),jC('joseon_naval','지금입니다. 양쪽 날개를 닫아 적선을 포위하라!','determined','이순신 휘하 군관'),jP('육지로 가던 적의 길이 바다에서 끊겼어.','relieved')]]]},
  {n:14,title:'열두 척의 바다',subtitle:'정유재란·명량·노량',years:'1597 — 1598',beats:[
    ['다시 시작된 전쟁',1597,'남해 피난 항구','navy-port',[jN('강화 협상이 깨지고 일본군이 다시 침입했다.'),jC('joseon_naval','수군은 무너졌고 남은 배는 열두 척뿐입니다.','worried'),jP('수보다 중요한 건 이 바다를 포기하지 않는 선택이야.','determined')]],
    ['명량의 물살',1597,'명량 해협','navy-port',[jN('이순신은 좁은 해협의 거센 물살을 이용해 일본 수군을 물리쳤다.'),jC('joseon_naval','물길이 바뀌기 전에 버텨야 합니다. 한 척도 물러서지 마라!','determined'),jP('지형과 시간까지 전술이 되는 전투야.','shock')]],
    ['노량의 마지막 밤',1598,'노량 앞바다','navy-port',[jN('철수하던 일본군을 추격한 노량 해전에서 이순신이 전사했다.'),jC('joseon_naval','장군의 죽음을 알리지 마라. 북을 계속 울려라.','crying'),jT('전쟁이 끝나는 순간까지 그는 바다를 놓지 않았다.','sad')]]]},
  {n:15,title:'두 개의 선택',subtitle:'광해군·중립 외교·인조반정',years:'1608 — 1623',beats:[
    ['전쟁 뒤의 왕',1608,'폐허가 남은 한양','war-hanyang',[jN('광해군은 전후 복구와 토지 장부 정비를 추진했다.'),jC('joseon_woman','무너진 집을 세우는 데는 전쟁보다 긴 시간이 드는군요.','tired'),jP('왕의 평가는 전쟁을 끝낸 뒤 무엇을 했는지도 봐야 해.','thinking')]],
    ['명과 후금 사이',1619,'조선 북방 군영','frontier',[jN('광해군은 명의 요청으로 군대를 보내면서도 후금과의 충돌을 피하려 했다.'),jC('joseon_soldier','두 강국 사이에서 한쪽만 고르면 전쟁이 됩니다.','serious'),jP('중립 외교는 비겁함이 아니라 살아남기 위한 계산이었어.','determined')]],
    ['인조반정',1623,'창덕궁의 밤','palace',[jN('서인이 광해군의 외교와 정치 운영을 비판하며 인조반정을 일으켰다.'),jC('joseon_scholar','집안에 전해 온 민준의 기록에는 왕이 바뀌어도 백성의 전쟁은 끝나지 않는다고 적혀 있습니다.','worried','민준의 후손 민겸'),jT('민준의 글은 후손을 통해 전해졌지만 후금은 그때보다 훨씬 강해졌다.','worried')]]]},
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
    ['서민 문화의 무대',1800,'도성 장터 공연판','late-market',[jN('판소리·탈춤·한글 소설·민화가 장터와 도시에서 인기를 얻었다.'),jC('joseon_scholar','우리 집안의 민준 할아버지 기록보다 장터 이야기꾼의 말이 훨씬 재미있군요.','smile','민준의 후손 민서'),jP('한 사람의 기억이 집안 기록에서 장터의 목소리로 이어지고 있어.','laugh')]]]},
  {n:21,title:'무너진 질서',subtitle:'세도 정치·삼정 문란·농민 봉기',years:'1800 — 1862',beats:[
    ['세도 정치',1800,'안동 김씨 세력의 조정','palace',[jN('어린 왕을 대신해 외척 가문이 권력을 독점했다.'),jC('joseon_scholar','관직과 세금이 나라보다 가문의 이익을 위해 움직입니다.','worried'),jP('견제할 힘이 사라지자 행정 전체가 무너지고 있어.','angry')]],
    ['삼정의 문란',1850,'수탈에 지친 농촌','peasant-village',[jN('전정·군정·환곡이 문란해져 죽은 사람과 아이에게까지 군포가 부과되었다.'),jC('joseon_woman','갚은 곡식도 장부에서는 빚으로 남아 있어요.','crying'),jP('제도가 백성을 지키기는커녕 빚과 형벌이 됐어.','angry')]],
    ['홍경래에서 진주까지',1862,'진주 농민 봉기 현장','jinju-uprising',[jN('홍경래의 난 이후에도 저항은 이어졌고, 임술년 진주에서 농민 봉기가 크게 일어났다.'),jC('joseon_woman','더는 빼앗길 것도 없어 관아로 가는 겁니다.','determined'),jP('삼정이정청이 세워져도 삶이 바뀌지 않으면 분노는 멈추지 않아.','determined')]]]},
  {n:22,title:'닫힌 문 앞의 함포',subtitle:'흥선 대원군·병인양요·신미양요',years:'1863 — 1875',beats:[
    ['대원군의 개혁',1865,'경복궁 중건 현장','gyeongbokgung-reconstruction',[jN('흥선 대원군은 서원을 정리하고 호포제를 실시했으며 경복궁을 다시 지었다.'),jC('joseon_woman','양반에게도 군포를 걷는다지만 공사 부담은 백성에게 무겁습니다.','worried'),jP('왕권을 세우는 개혁과 백성의 부담이 한 장면에 함께 있어.','thinking')]],
    ['병인양요',1866,'강화도 정족산성','jeongjoksanseong',[jN('프랑스군이 강화도를 침입했으나 양헌수 부대가 정족산성에서 맞섰다.'),jC('joseon_soldier','외규장각의 책들이 불타고 약탈당하고 있습니다.','angry'),jP('막아 냈지만 잃어버린 기록과 상처가 너무 커.','sad')]],
    ['신미양요와 척화비',1871,'강화도 광성보','gwangseongbo',[jN('미군이 강화도를 침입해 어재연 부대와 격전이 벌어졌다.'),jC('joseon_soldier','물러선 적 뒤로 척화비가 세워졌습니다.','tired'),jP('전투는 끝났지만 바깥세상의 문까지 사라진 건 아니야.','worried')]]]},
];

/* 각 핵심 사건을 이름으로 먼저 설명하지 않고, 주인공이 현장에서 행동하고 묻고 결과를 보게 한다. */
const JOSEON_EXPERIENCE_DETAILS={
  1:[
    ['개경을 떠난 수레가 진흙에 빠져 민준과 함께 바퀴를 밀었다. 길 위 사람들은 새 국호보다 당장 어디서 살지가 더 걱정이었다.','나라를 세운 지 얼마 되지도 않았는데 수도까지 옮기는 이유가 뭐예요?','한양은 한반도 중앙에 가깝고 한강 수운을 이용할 수 있어 새 왕조의 정치 중심지로 선택되었다.'],
    ['궁궐 목재를 나르다 동쪽의 종묘 터와 서쪽의 사직단 터에 꽂힌 표식을 보았다.','왕이 사는 궁보다 조상과 땅에 제사 지낼 곳을 따로 먼저 정하는 건가요?','종묘와 사직은 왕조의 정통성과 국가의 토지·곡식을 상징해 도성 계획의 기준이 되었다.'],
    ['관청 바닥에 흩어진 초고를 주워 순서대로 묶었다. 표지에는 조선경국전이라 적혀 있었다.','궁궐도 다 안 지어졌는데 나라 운영 규칙부터 책으로 만드는 이유가 있어요?','정도전은 재상 중심의 통치 원리를 정리해 새 왕조가 개인의 명령이 아니라 제도로 움직이게 하려 했다.']
  ],
  2:[
    ['통행금지를 알리는 징이 울리고 군사들이 골목의 등불을 하나씩 껐다. 민준과 나는 닫힌 가게 문 뒤에 숨었다.','외적도 아닌데 왜 왕자들의 군대가 서로 도성을 막는 거예요?','태조의 후계 문제와 정도전의 왕자 세력 억제가 충돌하면서 제1차 왕자의 난이 벌어졌다.'],
    ['새벽이 밝자 관청 문 앞에는 주인을 잃은 문서와 부러진 붓이 남아 있었다.','정도전은 새 나라를 만든 사람인데 왜 가장 먼저 제거된 거죠?','이방원은 세자 방석과 정도전 세력을 제거해 왕위 계승과 정치 주도권을 장악했다.'],
    ['검문소를 지날 때마다 어느 왕자의 군대인지 다른 깃발이 세워져 있었다.','한 번 끝난 싸움이 왜 또 벌어진 거예요?','1400년 방간이 일으킨 제2차 왕자의 난까지 진압한 이방원은 정종의 뒤를 이어 태종이 되었다.']
  ],
  3:[
    ['개인의 군사 명부를 관청 장부로 옮기는 일을 도왔다. 이름 옆에는 왕명에 따르는 군사라는 새 표시가 찍혔다.','왕자들이 자기 군대를 갖지 못하게 하면 지난번 같은 싸움도 막을 수 있겠네요?','태종은 사병을 혁파하고 의금부를 왕에게 직속시켜 군사권과 사법권을 국왕에게 집중했다.'],
    ['여섯 관청의 보고 상자가 의정부가 아니라 궁궐 문으로 곧장 들어갔다. 승정원 관리는 왕명을 받아 적느라 손을 멈추지 못했다.','모든 보고와 왕의 명령이 이렇게 왕에게 바로 오가면 일이 너무 몰리지 않아요?','6조 직계제와 왕명 출납을 맡은 승정원은 태종의 강한 왕권을 행정 절차로 만들었다.'],
    ['호패를 받으려는 줄과 신문고를 치려는 줄이 같은 관청 마당에서 엇갈렸다.','사람을 빠짐없이 기록하면서 억울한 말도 직접 듣겠다는 건가요?','호패법은 인구와 신분을 파악하는 통제책이었고 신문고는 제한적이지만 백성의 호소 통로였다.']
  ],
  4:[
    ['밤새 책을 베껴 나르자 학사들이 번갈아 경연 자료를 검토했다. 휴가를 받아 절에서 공부하는 학사도 있다는 말을 들었다.','왕이 학자들에게 연구할 시간과 장소까지 따로 주는 이유가 뭐예요?','세종은 집현전을 키우고 사가독서를 시행해 학문 연구와 국가 편찬 사업을 뒷받침했다.'],
    ['자격루의 물항아리를 채우고 앙부일구의 그림자를 따라 시간을 맞췄다. 별의 위치를 계산한 표에는 칠정산이라는 이름이 적혀 있었다.','하늘을 재는 계산이 농사짓는 사람에게도 정말 도움이 되나요?','칠정산은 한양을 기준으로 천체 운동을 계산한 역법서였고 자격루·앙부일구·측우기는 시간과 농정에 쓰였다.'],
    ['농부들이 고장마다 다른 씨 뿌리는 때와 논 손질법을 말하면 관리가 빠짐없이 받아 적었다.','중국 농서가 있는데 왜 각 고을 사람들에게 다시 묻는 거예요?','농사직설은 전국의 경험을 모아 조선의 기후와 토질에 맞는 농법을 정리한 책이다.']
  ],
  5:[
    ['학사가 혀와 입 모양을 보여 주며 낯선 글자 조각을 맞추게 했다. 소리를 내자 글자의 짜임이 달라졌다.','한자를 배우지 못한 사람도 이 글자는 자기 말을 그대로 적을 수 있나요?','세종은 말하고 싶은 뜻이 있어도 한자로 적기 어려운 백성을 위해 1443년 새 문자 스물여덟 자를 만들었다.'],
    ['상소를 옮기는 동안 새 문자가 중국의 제도를 거스른다는 문장이 몇 번이나 반복되었다.','배우기 쉬운 글자가 왜 나라의 질서를 흔든다고 생각한 거죠?','일부 신하는 새 문자가 성리학적 국제 질서와 양반의 문자 권위를 해칠 수 있다며 반대했다.'],
    ['장터에서 아이가 어머니의 이름을 새 글자로 또박또박 써 주었다. 사람들은 소리와 글자를 맞춰 보며 웃었다.','만든 글자가 궁궐 밖 사람들에게 실제로 전해진 건 언제예요?','1446년 훈민정음이 반포되고 해례본이 글자의 원리와 사용법을 설명했다.']
  ],
  6:[
    ['압록강 바람 속에서 돌과 흙을 날라 새 보루의 벽을 쌓았다. 군사들은 지도보다 강의 물길을 먼저 살폈다.','추운 강 북쪽에 성을 세우는 게 왜 이렇게 중요한가요?','최윤덕은 압록강 상류의 여진 세력을 물리치고 4군을 설치해 서북방 방어선을 넓혔다.'],
    ['두만강을 건넌 정찰대가 돌아오자 김종서 휘하 군관이 여섯 고을의 위치를 나무판에 표시했다.','네 군과 여섯 진은 같은 곳에 만든 게 아니었어요?','4군은 압록강 상류, 6진은 김종서가 개척한 두만강 유역으로 서로 다른 북방 전선이었다.'],
    ['남쪽에서 온 가족의 짐을 새 마을 집까지 옮겼다. 아이는 처음 보는 눈밭에서 고향을 찾았다.','군사가 땅을 차지했다고 바로 우리 영토가 되는 건 아니군요?','조정은 사민 정책으로 백성을 이주시켜 경작지와 고을을 유지했고 압록강·두만강 국경을 굳혔다.']
  ],
  7:[
    ['궁문이 닫히자 수양대군의 군사들이 김종서의 집과 조정으로 동시에 움직였다.','어린 단종을 돕는다면서 왜 대신들을 칼로 없애는 거예요?','1453년 계유정난으로 수양대군은 김종서 등을 제거하고 정권을 장악한 뒤 단종에게 왕위를 넘겨받았다.'],
    ['옥에 갇힌 이들의 이름 사이에 성삼문·박팽년과 금성대군이 보였다. 서로 다른 곳에서 단종을 되돌리려 한 사람들이었다.','왕위를 돌리려는 계획이 들키면 가족까지 벌을 받는다고요?','사육신의 단종 복위 운동과 금성대군의 거사는 실패했고 관련 인물과 많은 사람이 처형되었다.'],
    ['관리의 녹봉 장부 옆에는 현직자에게만 수조지를 준다는 새 규정과 간경도감의 불경 판목 목록이 놓였다.','왕위를 빼앗은 뒤에는 어떤 제도로 자기 권력을 굳힌 거죠?','세조는 6조 직계제와 직전법을 시행하고 간경도감을 설치해 불경을 간행했다.']
  ],
  8:[
    ['완성된 법전 묶음을 여섯 관청에 나누어 보내고 도화서 화원이 국가 행사 그림을 정리하는 모습을 보았다.','왕이 바뀌어도 같은 규칙으로 움직이게 하려는 건가요?','성종 때 경국대전이 완성되어 중앙 관청과 지방 통치의 기본 규범이 정착했고 도화서는 국가의 회화를 맡았다.'],
    ['경연 자리에서 홍문관 관리가 왕의 말에 곧바로 반론을 적었다. 사헌부와 사간원의 상소도 함께 들어왔다.','왕에게 틀렸다고 말하는 일이 정말 관리의 임무예요?','홍문관은 경연과 자문을 맡았고 사헌부·사간원과 함께 3사의 언론 기능으로 권력을 견제했다.'],
    ['향촌의 유향소 명단과 도성의 경재소 문서가 함께 오갔다. 지방 사림은 향약과 교육을 통해 세력을 넓혔다.','서울의 관리가 아닌 지방 양반도 고을 운영에 참여했나요?','유향소는 지방 사족의 자치 기구였고 중앙의 경재소와 연결되어 수령을 보좌하거나 견제했다.']
  ],
  9:[
    ['사관의 붓끝이 멈추자 방 안의 종이 넘기는 소리까지 크게 들렸다. 사초를 밖에 보이는 일은 본래 금기였다.','죽은 스승이 쓴 글 때문에 제자들까지 죄인이 된다고요?','김종직의 조의제문이 김일손의 사초에 실린 사실을 문제 삼아 1498년 무오사화가 일어났다.'],
    ['의금부 앞에서 이름이 불릴 때마다 가족 한 명이 주저앉았다. 조정의 빈자리는 빠르게 훈구 관리로 채워졌다.','글을 기록한 것만으로 이렇게 많은 사람이 잡혀갈 수 있어요?','연산군과 훈구 세력은 사초 사건을 이용해 사림을 제거했고 언론과 역사 기록을 위축시켰다.'],
    ['폐비 윤씨와 관련된 오래된 문서가 다시 꺼내지자 왕의 분노가 생존한 대신과 가족에게 번졌다.','이번에는 정치 의견이 아니라 왕의 개인적인 원한 때문에 숙청하는 건가요?','1504년 갑자사화는 연산군이 생모 폐비 윤씨 사건을 계기로 훈구와 사림을 함께 대규모로 숙청한 사건이다.']
  ],
  10:[
    ['연산군을 몰아낸 공신 명단이 벽을 가득 채웠다. 새 왕조차 그 이름을 함부로 지우지 못했다.','폭군을 몰아냈는데 왜 정치는 바로 달라지지 않는 거죠?','중종반정의 공신들은 권력을 나누어 가졌고 이후 개혁 세력과 충돌했다.'],
    ['향약을 베껴 마을에 나눠 주고 현량과로 뽑힌 젊은 관리들의 행렬을 보았다.','조광조는 사람을 바꾸면 정치도 한꺼번에 바뀔 거라고 믿은 건가요?','조광조는 현량과·향약·소격서 폐지·위훈 삭제를 추진해 사림의 도덕 정치를 빠르게 실현하려 했다.'],
    ['조광조의 이름이 죄인 명부로 옮겨진 뒤, 살아남은 사림은 향촌의 서원으로 물러났다. 을사년에는 외척 대윤과 소윤의 싸움이 또 숙청을 낳았다.','조광조가 죽은 뒤에도 사림의 학문은 어떻게 이어진 거예요?','기묘사화와 을사사화를 겪은 사림은 서원과 향약을 기반으로 성장했고 이황 같은 학자가 성리학 논의를 깊게 했다.']
  ],
  11:[
    ['관리 한 자리의 추천을 둘러싼 말다툼이 동쪽 집과 서쪽 집 사람의 대립으로 번졌다.','처음부터 나라를 둘로 나누려 했던 건 아니었죠?','동인과 서인은 이조 전랑 임명 문제와 정치 노선 차이에서 갈라졌고 점차 붕당으로 굳어졌다.'],
    ['북방에서 온 부상병의 신발에는 얼어붙은 흙이 묻어 있었다. 조정의 논쟁과 달리 국경의 위기는 이미 현실이었다.','니탕개의 군대가 들어왔는데도 남쪽 침략 준비까지 할 수 있었나요?','1583년 니탕개의 난은 선조 대 북방 방어의 약점을 드러냈고 조선은 여러 국경 위기에 동시에 대응해야 했다.'],
    ['일본 사행 기록인 해동제국기와 최근 통신사의 보고서가 같은 책상에 놓였지만 결론은 서로 달랐다.','같은 일본을 보고 온 사람들이 왜 침략 가능성을 반대로 말한 거예요?','대일 정보는 축적되어 있었지만 1590년 통신사들의 엇갈린 판단과 붕당 대립 속에서 전쟁 대비가 늦어졌다.']
  ],
  12:[
    ['성벽 안으로 화살과 조총 소리가 겹쳤다. 부산에서 올라온 패잔병은 남원과 진주의 방어선도 위험하다고 했다.','성 하나가 무너지면 왜 적이 이렇게 빨리 다음 고을까지 가는 거예요?','일본군은 조총과 빠른 북상으로 관군을 압박했고 남원성·진주성 같은 요충지에서 치열한 전투가 이어졌다.'],
    ['피란 행렬의 짐수레를 밀며 명에 보낼 사절 문서를 품은 관리를 만났다.','임금이 도성을 떠난 뒤에도 다른 나라에 군대를 보내 달라고 요청한 건가요?','선조는 의주로 피란했고 조선은 명에 원군을 요청해 전쟁을 국제전으로 확대했다.'],
    ['붉은 옷을 입은 곽재우의 의병 진영에서 화살을 나르고, 고경명 부대가 금산으로 향한다는 소식을 들었다.','관군도 아닌 사람들이 자기 농기구와 활을 들고 모인 이유가 뭐예요?','곽재우·고경명 등 의병장은 향토 지리와 지역 조직을 이용해 일본군의 이동과 보급을 방해했다.']
  ],
  13:[
    ['불탄 포구에서 수군은 적선보다 바닷길에 표시된 보급 거점을 먼저 지웠다.','육지 전쟁인데 바다의 보급로를 끊는 게 그렇게 중요한가요?','옥포 승리 이후 조선 수군은 일본군의 해상 보급과 서해 진출을 막아 전쟁의 흐름을 바꾸었다.'],
    ['선소에서 판옥선의 높은 선체와 거북선의 덮개에 쇠못을 박는 일을 도왔다.','거북선 한 척이 모든 적선을 무찌르는 무기였던 건 아니죠?','거북선은 돌격 임무를 맡았고 판옥선 중심의 함대와 화포 전술 속에서 운용되었다.'],
    ['좁은 견내량에서 적을 넓은 한산도 앞바다로 유인하자 양쪽에 숨은 판옥선이 학의 날개처럼 펼쳐졌다.','도망치는 것처럼 보였던 움직임이 처음부터 포위 계획이었어요?','이순신은 학익진으로 일본 수군을 포위해 한산도 대첩을 이끌고 해상 주도권을 지켰다.']
  ],
  14:[
    ['칠천량 패전 뒤 빈 포구에서 남은 배의 이름을 하나씩 확인했다. 장부 끝에는 열두 척만 남았다.','배도 병사도 부족한데 다시 바다로 나가는 게 가능한가요?','정유재란 때 수군 지휘권을 되찾은 이순신은 남은 함선으로 서해 진출로를 지키기로 했다.'],
    ['명량의 빠른 물살에 밧줄을 잡고 서 있기도 어려웠다. 좁은 길목으로 들어온 적선들은 서로 방향을 바꾸지 못했다.','물살이 바뀌는 짧은 시간을 기다렸다가 공격한 건가요?','이순신은 울돌목의 좁은 지형과 조류를 이용해 열세인 함대로 명량 해전을 승리로 이끌었다.'],
    ['철수하는 적선을 쫓는 노량의 밤, 북소리가 멈추지 않도록 부상자들까지 북채를 넘겨받았다.','장군이 쓰러졌는데도 왜 죽음을 알리지 않은 거예요?','이순신은 지휘 혼란을 막으려 자신의 죽음을 알리지 말라 했고 노량 해전은 전쟁의 마지막 대규모 해전이 되었다.']
  ],
  15:[
    ['불탄 호적과 토지 장부를 다시 적는 관청에서 전쟁 전 주인을 찾지 못한 논밭이 쌓여 갔다.','전쟁이 끝났다고 사람들의 삶도 바로 돌아오는 건 아니네요?','광해군은 양전과 호적 정비, 궁궐·도성 복구를 추진하며 전쟁 뒤 국가 재정을 회복하려 했다.'],
    ['명군과 함께 출병하는 병사에게 후금과 정면으로 싸우지 말라는 비밀 지시가 전달되었다.','명나라를 돕는다면서 후금과도 싸우지 말라는 게 가능해요?','광해군은 강홍립 부대를 파견하면서 상황에 따라 후금과 화친하도록 해 두 강국 사이 충돌을 피하려 했다.'],
    ['반정군이 궁궐을 장악한 뒤 얼마 지나지 않아 이괄의 군대가 다시 한양을 점령했다는 소식이 들렸다.','왕을 바꾼 세력도 자기들끼리 갈라진 거예요?','인조반정 뒤 논공행상에 불만을 품은 이괄이 1624년 난을 일으켜 새 정권의 취약함을 드러냈다.']
  ],
  16:[
    ['강화도로 향하는 배에 피란민과 궁중 짐이 한꺼번에 실렸다. 바닷길 뒤로 후금군의 봉화가 가까워졌다.','전쟁을 끝내려고 형제 관계를 맺었는데 왜 다시 침입한 거예요?','정묘호란 뒤 조선은 후금과 형제 관계를 맺었지만 친명 정책과 청의 군신 관계 요구가 다시 충돌했다.'],
    ['얼어붙은 남한산성에서 군량을 세는 손가락이 줄었다. 성 안에서는 척화와 주화의 상소가 밤새 오갔다.','싸우자는 말과 항복하자는 말 중 어느 쪽이 백성을 위한 선택이었을까요?','김상헌 등 척화파와 최명길 등 주화파가 맞섰지만 고립과 식량 부족 속에서 항복이 결정되었다.'],
    ['삼전도 뒤 끌려간 왕자와 삼학사의 소식을 들었다. 세월이 흐른 뒤 효종의 조정에서는 북벌 지도와 나선 정벌 명령이 함께 놓였다.','청을 치자고 준비하면서 왜 청의 요청을 받아 러시아와 싸운 거예요?','병자호란의 굴욕은 북벌론을 낳았지만 조선군은 현실 외교 속에서 청의 요청으로 나선 정벌에 참여했다.']
  ],
  17:[
    ['어제 남인의 이름이 적힌 방에서 오늘은 서인 관리들이 같은 자리에 앉았다.','왕이 한 당파를 통째로 바꾸면 정책도 한꺼번에 뒤집히는 건가요?','1680년 경신환국으로 남인이 밀려나고 서인이 집권하면서 숙종의 환국 정치가 본격화했다.'],
    ['왕비 인현 왕후가 궁을 나가는 길과 장희빈의 아들이 세자로 책봉되는 장면이 같은 날의 소문이 되었다.','왕실 가족의 일이 왜 조정의 남인과 서인 운명까지 바꾸는 거예요?','기사환국은 원자 책봉 문제와 왕비 교체를 둘러싸고 서인이 실각하고 남인이 집권한 정국 전환이었다.'],
    ['갑술년 다시 남인 관리의 명패가 내려지고 서인이 돌아왔다. 궁궐 수비에는 금위영의 깃발이 늘었다.','당파는 계속 바뀌는데 왕의 힘만 더 커지는 것 같아요.','숙종은 갑술환국까지 집권 세력을 교체하고 금위영을 설치해 5군영 체제를 완성하며 왕권을 강화했다.']
  ],
  18:[
    ['탕평비 앞에서 서로 다른 당색의 관리들이 한 줄로 입궐했다. 도성 밖에서는 청계천 흙을 퍼내는 인부가 모였다.','당파를 고르게 쓰고 하천을 파내는 일이 모두 같은 개혁인가요?','영조는 탕평 정치를 펴는 한편 청계천을 준설하고 신문고를 부활시켜 도성과 민생 문제를 다루었다.'],
    ['군포 한 필을 덜 내게 된 집에서는 안도했지만 토지를 가진 집 장부에는 결작이 새로 적혔다.','부담을 줄인 만큼 모자란 군사 비용은 어디서 채운 거예요?','1750년 균역법은 군포를 2필에서 1필로 줄이고 결작·선무군관포 등으로 부족한 재정을 보충했다.'],
    ['정조의 행차를 위해 배다리를 놓고 장용영 군사가 수원 화성 성문을 지켰다.','새 성과 친위 부대를 함께 만든 이유가 뭐예요?','정조는 규장각과 장용영을 기반으로 왕권을 강화하고 수원 화성을 개혁 정치의 거점으로 삼았다.']
  ],
  19:[
    ['논의 크기를 재는 자와 산천을 직접 그린 화첩, 별의 움직임을 적은 책이 한 서재에 함께 놓였다.','학자들이 경전 해석보다 실제 땅과 하늘을 보기 시작한 건가요?','실학의 문제의식은 정선의 진경산수화, 홍대용의 과학적 세계관, 김정희의 학예처럼 현실과 자주적 문화에 대한 관심으로 넓어졌다.'],
    ['연행길의 수레바퀴와 벽돌 성벽을 박지원이 유심히 적었다. 시장에서는 조선보다 훨씬 많은 물건이 빠르게 오갔다.','청을 오랑캐라 부르면서도 이런 기술은 배워야 한다고 생각한 거죠?','박지원은 열하일기에 청의 상공업과 기술을 기록하며 이용후생을 강조했다.'],
    ['박제가는 낡은 그릇도 아끼느라 새 물건을 만들지 않는 풍경을 지적하며 장부에 유통 경로를 그렸다.','아껴 쓰는 게 늘 좋은 일은 아니라는 뜻인가요?','북학의는 적절한 소비가 생산과 기술 발전을 이끈다고 보고 청의 선진 문물을 받아들이자고 주장했다.']
  ],
  20:[
    ['집마다 제각각 토산물을 마련하느라 빚지는 모습을 본 뒤, 토지 결수에 따라 쌀을 내는 새 장부를 확인했다.','공물을 쌀로 통일하면 중간에서 값을 부풀리던 사람도 줄어들겠네요?','대동법은 가호 기준 공납을 토지 결수 기준의 쌀·동전·포목 납부로 바꾸어 방납의 폐단을 줄였다.'],
    ['장시에서 공인과 사상이 물품을 흥정했고 큰 도고는 여러 고을 물건을 사들여 값을 좌우했다.','장날 상인이 관청 물품까지 맡게 된 건 대동법과 연결된 변화예요?','대동법 뒤 관수품을 조달하는 공인이 성장했고 장시·포구를 잇는 사상과 도고가 상업을 확대했다.'],
    ['상평통보 꾸러미를 세는 사이 신분이 다른 사람들도 같은 값으로 물건과 노동을 거래했다.','동전이 퍼지면 신분 질서도 예전처럼 고정돼 있기는 어렵겠어요.','상품 화폐 경제가 발달하면서 부유한 상민과 몰락 양반이 나타나고 신분 이동이 활발해졌다.'],
    ['담배와 면화를 실은 수레 옆에서 역관과 기술직 중인이 청에서 들여온 책과 기구를 거래했다.','농촌과 기술자도 이제 도성 시장과 외국 정보에 바로 이어지는군요?','상품 작물·민영 수공업·광업이 성장했고 역관을 비롯한 중인이 기술과 대외 정보를 전달했다.'],
    ['장터 한복판에서 광대의 탈춤과 판소리에 웃음이 터지고 전기수 주변에는 한글 소설을 듣는 사람이 모였다.','양반만 즐기던 문화가 아니라 장사하고 일하는 사람들의 이야기가 무대에 오른 거네요?','도시와 시장의 성장으로 판소리·탈춤·민화·풍속화·한글 소설 같은 서민 문화가 널리 퍼졌다.']
  ],
  21:[
    ['임금보다 외척 가문의 사랑채로 먼저 들어가는 인사 문서를 보았다. 신유박해로 잡혀간 사람들의 빈집도 늘었다.','나라의 관직과 형벌이 한 집안의 이익에 따라 움직이는 건가요?','순조 대 안동 김씨 등 외척의 세도 정치가 시작되고 신유박해 속에서 정치·사회 통제가 강화되었다.'],
    ['이미 갚은 환곡이 다시 빚으로 적히고 죽은 사람의 이름에도 군포가 붙었다. 장부를 읽지 못하는 백성은 항의할 길이 없었다.','전정·군정·환곡이 모두 백성을 돕는 제도였다는데 왜 수탈이 된 거예요?','수령과 향리의 부정 속에 삼정이 문란해지고 기존 유향소 중심의 향촌 질서도 무너졌다.'],
    ['진주 관아로 향하는 농민들이 빈 곡식 자루와 잘못된 장부를 들었다. 오래전 평안도의 홍경래 봉기 이야기도 다시 퍼졌다.','벌을 받을 걸 알면서도 사람들이 관아로 모인 이유가 뭐예요?','세도 정치와 지역 차별·삼정 수탈은 홍경래의 난과 1862년 진주 농민 봉기를 비롯한 전국적 저항으로 이어졌다.']
  ],
  22:[
    ['경복궁 중건 목재를 나르는 백성 옆으로 철폐된 서원의 현판이 실려 갔다. 양반 집에도 호포 장부가 전달되었다.','개혁으로 왕권을 세우는 비용을 결국 백성이 감당하는 건가요?','흥선 대원군은 서원을 대폭 철폐하고 호포제를 실시했지만 경복궁 중건을 위한 원납전과 부역은 큰 부담이 되었다.'],
    ['정족산성으로 탄약을 나르던 길에 프랑스군이 외규장각 도서를 약탈했다는 소식이 전해졌다.','침입을 물리쳐도 빼앗긴 책과 불탄 건물은 돌아오지 않는 거죠?','1866년 병인양요에서 양헌수 부대가 정족산성 전투를 승리했지만 외규장각 도서 등 문화재가 약탈되었다.'],
    ['광성보의 포연 속에서 어재연 부대가 미군과 맞섰고, 전투 뒤 전국 길목에 척화비가 세워졌다.','비석을 세우면 다시 오는 군함까지 막을 수 있을까요?','1871년 신미양요 뒤 통상 수교 거부 의지를 담은 척화비가 세워졌지만 1875년 운요호가 다시 강화도에 나타났다.']
  ]
};

for(const chapter of JOSEON_BLUEPRINTS){
  chapter.beats.forEach((beat,index)=>{
    const detail=JOSEON_EXPERIENCE_DETAILS[chapter.n]?.[index];
    if(!detail)return;
    const [situation,questionPrompt,historicalResult]=detail,[opening,npc,reflection]=beat[4];
    beat[4]=[jN(situation),opening,jP(questionPrompt,chapter.n>=12&&chapter.n<=16?'worried':'confused'),npc,jN(historicalResult),reflection];
  });
}

const chapterBackground=n=>JOSEON_BLUEPRINTS.find(ch=>ch.n===n)?.beats[0][3]||'early-hanyang';
Object.assign(CHAPTERS,{
  [joseonChapterId(0)]:{chapterId:joseonChapterId(0),eraId:'joseon',episode:'joseon',number:'00',title:'또 다른 세상',subtitle:'경복궁의 비, 1390년대 한양으로',years:'2026 → 1394',thumbnail:'assets/joseon/backgrounds/early-hanyang.webp',startStoryId:'joseon_ch00_s1',completeStoryId:'joseon_ch00_complete',questionCount:0,reviewQuestionCount:0,implemented:true}
});

STORIES.joseon_ch00_s1=scene({sceneId:'joseon_ch00_s1',chapterId:joseonChapterId(0),eraId:'joseon',year:2026,location:'현대 경복궁 서쪽 돌담길',title:'갑자기 쏟아진 비',illustrationId:'joseon-modern-gyeongbokgung',dialogues:[jN('현대 서울. 친구를 만나러 경복궁 돌담길을 지나던 평범한 오후였다.'),jN('맑던 하늘에서 굵은 빗방울이 떨어지자 사람들은 우산을 펴고 뛰기 시작했다.'),jT('일기 예보에는 비가 없었는데…… 저 처마 밑에서 잠깐 피하자.','worried'),jN('돌담 처마 아래 몸을 붙이고 젖은 휴대전화를 꺼냈다.'),jT('친구한테 늦는다고 연락부터 해야지.','thinking'),jN('그 순간 돌담 위로 번개가 갈라졌고, 천둥보다 먼저 화면과 거리의 빛이 함께 꺼졌다.')],nextStoryId:'joseon_ch00_s2'});
STORIES.joseon_ch00_s2=scene({sceneId:'joseon_ch00_s2',chapterId:joseonChapterId(0),eraId:'joseon',year:1394,location:'1390년대 한양 밖 흙길',title:'번개 뒤의 흙길',illustrationId:joseonAssetId('rural'),sceneEffect:'blackout',dialogues:[jN('눈을 뜨자 젖은 보도블록 대신 흙길의 진흙 냄새가 올라왔다. 산 아래에는 초가와 수레 행렬이 이어졌다.'),jT('경복궁 야간 촬영장인가? 그런데 세트가 왜 이렇게 넓어……?','confused'),jN('휴대전화에는 안테나도, 와이파이도 잡히지 않았다.'),jC('minjun_j','정신이 드십니까? 한양 가는 길 한복판에 쓰러져 계셨습니다.','worried'),jP('여기 촬영장 맞죠? 스태프 부르면 되는데…… 제 말 알아들으세요?','confused'),jC('minjun_j','촬영장이 무엇입니까? 우선 비를 피해야 합니다.','confused'),jT('말투도, 옷도, 길도 이상하다. 장난이라고 하기엔 흙이 너무 차갑다.','fear')],nextStoryId:'joseon_ch00_s3'});
STORIES.joseon_ch00_s3=scene({sceneId:'joseon_ch00_s3',chapterId:joseonChapterId(0),eraId:'joseon',year:1394,location:'한양으로 가는 길',title:'새 도성의 단서',illustrationId:joseonAssetId('early-hanyang'),dialogues:[jC('minjun_j','저는 민준입니다. 새 도성에 궁궐 지을 나무와 문서를 나르는 심부름꾼이지요.','smile'),jP('새 도성이라면…… 지금 여기가 한양이라는 뜻이에요?','surprised'),jC('minjun_j','아직 공사가 한창이지만 전하께서 도읍으로 정하셨습니다.','neutral'),jN('산 아래 새 길이 뚫리고, 궁궐을 지을 나무와 돌을 실은 수레가 끝없이 들어왔다.'),jP('그럼 지금 임금은 누구예요?','worried'),jC('minjun_j','태조 전하시지요. 그것도 모르십니까?','surprised')],nextStoryId:'joseon_ch00_s4'});
STORIES.joseon_ch00_s4=scene({sceneId:'joseon_ch00_s4',chapterId:joseonChapterId(0),eraId:'joseon',year:1394,location:'새 수도 한양',title:'눈떠보니 조선',illustrationId:joseonAssetId('early-hanyang'),dialogues:[jT('태조, 새 수도 한양, 궁궐 공사…… 설마 1390년대?','shock'),jN('꺼진 휴대전화 화면에는 긴 땋은 머리와 낯선 치마를 입은 스물넷의 얼굴이 비쳤다.'),jC('minjun_j','고려는 끝났습니다. 이제 조선의 수도가 이곳에 세워집니다.','serious'),jP('잠깐만요. 조선이라고요?','shock'),jT('눈떠보니 조선. 나는 조선 500년의 시작에 떨어졌다.','determined')],nextStoryId:'joseon_ch00_complete'});
STORIES.joseon_ch00_complete=scene({sceneId:'joseon_ch00_complete',chapterId:joseonChapterId(0),eraId:'joseon',year:1394,location:'한양 도성 터',title:'새 시대의 첫날',illustrationId:joseonAssetId('early-hanyang'),dialogues:[jN('민준이 건넨 짚신은 젖은 운동화보다 거칠었다. 멀리서는 새 궁궐의 기둥을 다듬는 망치 소리가 들렸다.'),jP('아는 척하다 들키지 말자. 우선 민준을 따라가며 직접 확인해야 해.','determined'),jN('그렇게 평범했던 하루가 조선의 첫날이 되었다.')],completeChapter:true});

JOSEON_BLUEPRINTS.forEach(ch=>{
  const id=joseonChapterId(ch.n),completeId=`joseon_ch${String(ch.n).padStart(2,'0')}_complete`;
  CHAPTERS[id]={chapterId:id,eraId:'joseon',episode:'joseon',number:String(ch.n).padStart(2,'0'),title:ch.title,subtitle:ch.subtitle,years:ch.years,thumbnail:`assets/joseon/backgrounds/${JOSEON_BACKGROUND_PATHS[chapterBackground(ch.n)]}`,startStoryId:joseonSceneId(ch.n,1),completeStoryId:completeId,questionCount:0,reviewQuestionCount:0,implemented:true};
  ch.beats.forEach((beat,index)=>{
    const sceneId=joseonSceneId(ch.n,index+1),next=index<ch.beats.length-1?joseonSceneId(ch.n,index+2):completeId;
    STORIES[sceneId]=scene({sceneId,chapterId:id,eraId:'joseon',year:beat[1],location:beat[2],title:beat[0],illustrationId:joseonAssetId(beat[3]),dialogues:beat[4],nextStoryId:next,readingMode:'narration-blocks'});
  });
  STORIES[completeId]=scene({sceneId:completeId,chapterId:id,eraId:'joseon',year:Number(ch.years.slice(-4))||ch.beats.at(-1)[1],location:ch.beats.at(-1)[2],title:`CH.${String(ch.n).padStart(2,'0')} 기억 완료`,illustrationId:joseonAssetId(ch.beats.at(-1)[3]),dialogues:[jN(`${ch.title}의 사건과 인물, 제도가 하나의 흐름으로 이어졌다.`),jP('이 장면을 실제 기출의 단서와 함께 기억해 두자.','relieved')],completeChapter:true});
});

STORIES.joseon_ch03_complete.dialogues=[jN('1418년, 태종이 세종에게 왕위를 넘기던 날 민준도 오래 맡았던 도성 심부름을 내려놓았다.'),jP('나는 그대로인데 민준의 머리에는 흰빛이 번졌다. 이 시대의 시간은 모두에게 같은 속도로 흐르지 않았다.','sad'),jN('민준은 후손에게 새 도성과 낯선 벗의 이야기를 기록으로 남기겠다고 약속했다.'),jC('minjun_elder_j','처음 흙길에서 만난 뒤 스물네 해가 흘렀군요. 이제 가족 곁에서 살겠습니다.','smile'),jP('잘 가요, 민준. 당신의 다음 시간은 기록으로 만나게 될 것 같아요.','sad')];
const JOSEON_CHAPTER_ENDINGS={
  1:[jN('해 질 무렵 종묘와 사직, 궁궐 공사장의 불이 차례로 켜졌다. 한양은 왕조의 생각을 돌과 길로 옮기고 있었다.'),jP('새 나라의 시작은 이름 하나가 아니라 수도와 제도를 함께 만드는 일이었어.','relieved')],
  2:[jN('두 번째 싸움이 끝난 새벽에도 골목의 문은 쉽게 열리지 않았다. 왕좌는 한 사람에게 가까워졌지만 도성에는 죽은 이들의 자리가 남았다.'),jP('권력을 얻은 사람이 이 피 묻은 칼을 어떤 나라로 바꿀지가 더 무서워.','sad')],
  4:[jN('집현전의 불빛과 농촌의 모내기 소리가 같은 시대에 이어졌다. 지식은 책상에서 끝나지 않고 시간·하늘·논밭을 바꾸었다.'),jP('세종의 업적은 발명품 이름보다 그것이 사람들의 하루에 닿았다는 데 있었구나.','relieved')],
  5:[jN('장터 아이가 새 글자로 쓴 이름표를 품에 넣었다. 작은 종이 한 장이 이전에는 없던 목소리를 지켜 주었다.'),jP('내가 아는 글자가 누군가에게는 처음 자기 말을 남기는 방법이었어.','smile')],
  6:[jN('북방 마을 굴뚝에서 처음 연기가 올랐다. 성벽의 지도 위 선은 그곳에 남기로 한 가족들의 삶으로 굳어졌다.'),jP('영토를 넓혔다는 한 줄 뒤에 추위와 이주를 견딘 사람이 있었어.','sad')],
  7:[jN('새 법과 불경 판목이 쌓인 관청 밖에서 단종을 기억하는 목소리는 낮게 이어졌다.'),jP('세조의 제도와 왕위를 얻은 과정은 어느 한쪽만으로 설명할 수 없겠어.','thinking')],
  8:[jN('경국대전 묶음이 지방 관아로 떠나고 홍문관의 등잔은 다시 켜졌다. 법과 비판의 말이 함께 왕조의 틀을 만들었다.'),jP('오래가는 나라는 왕 한 사람보다 제도와 견제가 버티는 나라일 거야.','relieved')],
  9:[jN('의금부 문이 닫힌 뒤에도 사관은 빈 종이 한 장을 숨겨 두었다. 기록을 없애려는 권력 때문에 기록의 의미는 더 선명해졌다.'),jP('말하지 못하게 만든 시대일수록 누군가는 끝까지 적어야 했어.','determined')],
  10:[jN('조광조의 이름은 조정에서 지워졌지만 향촌의 서원에서는 다시 읽혔다. 숙청은 사람을 없앴어도 질문까지 없애지는 못했다.'),jP('빠른 개혁이 무너진 뒤에도 다음 세대는 그 실패에서 다시 시작했구나.','determined')],
  11:[jN('통신사의 두 보고서가 같은 서랍에 들어갔다. 바다 건너에서는 이미 침략 준비가 끝나 가고 있었다.'),jP('정답 없는 논쟁처럼 보여도 결정을 미룬 시간은 결국 누군가의 피해가 돼.','worried')],
  12:[jN('피란길 끝에서 의병의 봉화가 하나둘 이어졌다. 무너진 관군의 빈자리를 고향을 지키려는 사람들이 메웠다.'),jP('나라가 먼저 지켜 주지 못한 사람들까지 나라를 포기하지 않았어.','crying')],
  13:[jN('한산도 바다에 부서진 적선이 떠다니고 육지로 향하던 보급선은 끊겼다. 포구의 피란민들이 처음으로 안도의 숨을 쉬었다.'),jP('한 번의 영웅담보다 바닷길 전체를 읽은 준비와 전술이 승리를 만들었어.','relieved')],
  14:[jN('노량의 북소리가 잦아들자 긴 전쟁도 끝났다. 돌아오는 배마다 살아남은 사람과 돌아오지 못한 사람의 이름이 함께 실렸다.'),jP('승리라는 말로는 이 마지막 밤의 대가를 다 설명할 수 없어.','sad')],
  15:[jN('반정의 새 깃발이 궁궐에 걸렸지만 북쪽 국경의 봉화는 꺼지지 않았다. 정권의 명분과 국제 정세는 서로 기다려 주지 않았다.'),jP('왕을 바꾸는 일보다 나라가 전쟁을 피할 선택을 지키는 일이 더 어려웠어.','worried')],
  16:[jN('삼전도에서 돌아온 행렬은 말이 없었다. 그 침묵은 북벌을 외치는 다음 세대와 청의 요청에 군사를 보내는 현실 사이에 오래 남았다.'),jP('치욕을 기억하는 마음과 살아남아야 하는 선택이 계속 부딪혔구나.','sad')],
  17:[jN('조정의 명패는 세 번 뒤집혔고 그때마다 유배길의 사람이 바뀌었다. 움직이지 않은 것은 그 교체를 결정하는 왕의 자리였다.'),jP('붕당을 바꿔 쓰는 방식은 갈등을 풀지 못하고 왕에게 힘만 모았어.','thinking')],
  18:[jN('청계천 물길에서 수원 화성 성벽까지 개혁의 흔적이 이어졌다. 군포 한 필의 차이도, 배다리 한 칸도 사람들의 삶과 왕의 구상을 함께 바꾸었다.'),jP('탕평과 개혁은 구호보다 부담을 실제로 줄이고 제도를 움직일 때 의미가 생겨.','relieved')],
  19:[jN('연행길에서 가져온 책과 조선의 산천을 그린 화첩이 한 서가에 놓였다. 새로운 시선은 바깥을 배우면서 자기 현실을 더 자세히 보게 했다.'),jP('실학은 외운 답이 아니라 지금 사는 세상을 다시 묻는 방법이었어.','thinking')],
  20:[jN('장터가 파한 뒤에도 전기수의 이야기와 상평통보 부딪히는 소리가 골목에 남았다. 경제의 변화는 문화와 신분의 경계까지 흔들었다.'),jP('세금과 화폐의 변화가 결국 누가 만들고 사고 말할 수 있는지를 넓혔구나.','smile')],
  21:[jN('진주 관아 앞의 함성은 진압되었지만 잘못된 장부는 전국에서 불탔다. 삼정이정청의 약속만으로 쌓인 분노를 되돌릴 수는 없었다.'),jP('백성이 제도를 믿지 못하게 된 순간, 왕조의 오래된 질서도 함께 무너지고 있었어.','sad')]
};
for(const [number,dialogues]of Object.entries(JOSEON_CHAPTER_ENDINGS))STORIES[`joseon_ch${String(number).padStart(2,'0')}_complete`].dialogues=dialogues;

/* CH.22 고정 엔딩: 신미양요 → 강화도 해안 → 1875 운요호. */
STORIES[joseonSceneId(22,3)].nextStoryId='joseon_ch22_shore';
STORIES.joseon_ch22_shore=scene({sceneId:'joseon_ch22_shore',chapterId:joseonChapterId(22),eraId:'joseon',year:1871,location:'강화도 해안',title:'물러난 함대',illustrationId:joseonAssetId('ganghwa'),dialogues:[jN('포연이 걷힌 바다를 바라보며 살아남은 사람들이 숨을 골랐다.'),jN('무너진 광성보 성벽에는 조선군과 미군이 남긴 탄흔이 함께 박혀 있었다.'),jC('joseon_woman','이제 외국 놈들도 다시는 오지 않겠지요.','relieved','강화도 주민'),jP('...글쎄.','worried'),jN('전국 길목에 세운 척화비는 문을 닫겠다는 의지를 보였지만 바다는 닫을 수 없었다.'),jT('다음 배는 전쟁만 하러 오지 않을지도 몰라.','worried')],nextStoryId:'joseon_ch22_unyo'});
STORIES.joseon_ch22_unyo=scene({sceneId:'joseon_ch22_unyo',chapterId:joseonChapterId(22),eraId:'joseon',year:1875,location:'강화도 앞바다',title:'...또 왔네',illustrationId:joseonAssetId('unyo'),sceneEffect:'blackout',dialogues:[jN('1875년. 강화도 초지진의 군사들이 낯선 일본 군함을 발견했다.'),jN('측량을 구실로 해안에 접근한 증기선의 포문이 성을 향해 열렸다.'),jC('joseon_soldier','국기를 알 수 없는 배가 아니라 일본의 운요호입니다!','fear'),jN('1875년. 어둠 너머로 다시 함포와 증기선의 그림자가 다가왔다.'),jT('...또 왔네.','shock'),jN('운요호.')],nextStoryId:'joseon_ch22_complete'});
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

/* 회차 순환 배치가 아니라, 각 원본 문항의 실제 개념을 경험한 직후 장면에 고정한다. */
const JOSEON_OFFICIAL_STORY_MAP={
  '73-20':3,'73-21':2,'73-22':2,'73-23':3,'73-24':2,'73-25':3,'73-26':1,'73-27':1,'73-28':2,'73-29':1,'73-30':3,'73-31':3,
  '74-20':3,'74-21':3,'74-22':2,'74-23':3,'74-24':3,'74-25':1,'74-26':5,'74-27':2,
  '75-20':1,'75-21':2,'75-22':3,'75-23':3,'75-24':3,'75-25':2,'75-26':1,'75-27':1,
  '76-20':2,'76-21':1,'76-22':2,'76-23':1,'76-24':2,'76-25':1,'76-26':4,'76-27':4,'76-28':1,'76-29':2,
  '77-20':3,'77-21':3,'77-22':2,'77-23':5,'77-24':3,'77-25':2,'77-26':3,'77-28':3,'77-29':2,
  '78-19':2,'78-20':1,'78-21':3,'78-22':1,'78-23':3,'78-24':3,'78-25':3,'78-26':1,'78-27':2,
  '79-19':1,'79-20':3,'79-21':5,'79-22':1,'79-23':1,'79-24':2,'79-25':1,'79-26':4,'79-27':3
};

const JOSEON_EVENT_EXPLANATIONS={
  'joseon-foundation':'정도전은 조선경국전에서 재상 중심의 통치 원리와 새 왕조의 운영 기준을 제시했습니다.',
  'sejong-science':'세종 대에는 한양을 기준으로 천체 운동을 계산한 칠정산이 편찬되고 자격루·앙부일구·측우기 등 과학 기술이 발달했습니다.',
  'sejong-learning':'세종은 집현전을 학문 연구와 정책 자문의 중심으로 삼고, 젊은 관리에게 사가독서의 기회를 주어 국가 편찬 사업을 뒷받침했습니다.',
  'imjin-diplomacy':'임진왜란 때 선조가 의주로 피란한 뒤 명에 원군을 요청하면서 전쟁은 조선·일본·명이 얽힌 국제전으로 전개되었습니다.',
  'yeonsangun-purges':'연산군 때 무오사화와 갑자사화가 일어나 사림과 훈구가 큰 피해를 입었고 언론 활동도 위축되었습니다.',
  'byeongja-horan':'청군의 침입으로 인조는 남한산성에 고립되었고, 주화론과 척화론이 맞선 끝에 삼전도에서 항복했습니다.',
  'local-governance':'유향소는 지방 사족이 수령을 보좌하고 향리를 규찰한 향촌 자치 기구이며, 중앙의 경재소와 연결되었습니다.',
  'late-culture':'조선 후기에는 정선의 진경산수화와 김정희의 추사체처럼 현실의 산천과 독자적 미감을 담은 문화가 발달했습니다.',
  'sukjong-hwanguk':'숙종은 경신·기사·갑술환국으로 집권 붕당을 교체하며 왕권을 강화했습니다.',
  'gyunyeok':'영조의 균역법은 군포를 2필에서 1필로 줄이고 결작 등으로 부족한 재정을 보충했습니다.',
  'jeongyu-war':'정유재란 때 이순신은 명량에서 열세를 뒤집었고, 노량 해전에서 철수하는 일본군을 추격하다 전사했습니다.',
  'late-economy':'조선 후기에는 상품 화폐 경제가 성장해 장시·사상·공인이 활약하고 신분 이동도 활발해졌습니다.',
  'peasant-uprisings':'세도 정치와 삼정 문란, 지역 차별은 홍경래의 난과 1862년 진주 농민 봉기로 이어졌습니다.',
  'injo-politics':'인조반정 뒤 논공행상에 불만을 품은 이괄이 난을 일으켜 한양을 점령하면서 새 정권의 취약함이 드러났습니다.',
  'yi-sunsin':'이순신의 수군은 옥포와 한산도에서 승리해 일본군의 해상 보급로와 서해 진출을 막았습니다.',
  'sarim-seowon':'사림은 여러 사화를 겪은 뒤 서원과 향약을 기반으로 향촌 사회와 성리학 연구에서 세력을 넓혔습니다.',
  'jeongjo-reforms':'정조는 규장각과 장용영을 설치하고 수원 화성을 건설해 개혁 정치와 왕권 강화의 기반으로 삼았습니다.',
  'sedo-society':'순조 대 신유박해가 일어나 천주교 신자들이 처벌되었고 외척 가문의 세도 정치가 시작되었습니다.',
  'popular-culture':'시장과 도시가 성장하면서 판소리·탈춤·한글 소설·민화·풍속화 등 서민 문화가 널리 퍼졌습니다.',
  'late-markets':'조선 후기 한양에서는 시전 상인과 난전 상인이 경쟁했고 장시와 포구를 잇는 유통망이 확대되었습니다.',
  'joseon-offices':'도화서는 국가의 회화 업무를 맡은 관청으로 의궤·어진·지도와 같은 기록 그림 제작에 참여했습니다.',
  'northern-crisis':'선조 때 니탕개가 이끄는 여진 세력이 함경도를 침입해 북방 방어의 약점을 드러냈습니다.',
  'eulsa-purge':'명종 즉위 뒤 외척 대윤과 소윤의 권력 다툼 속에서 을사사화가 일어나 사림이 다시 피해를 입었습니다.',
  'injo-coup':'서인은 광해군의 외교와 폐모살제를 명분으로 인조반정을 일으켜 정권을 바꾸었습니다.',
  'daedong-economy':'대동법은 공물을 토지 결수에 따라 쌀·동전·포목으로 내게 했고 관수품을 조달하는 공인의 성장을 이끌었습니다.',
  'sedo-politics':'세도 정치기에는 안동 김씨 같은 외척 가문이 인사와 행정을 장악해 매관매직과 지방 수탈이 심해졌습니다.',
  'gimyo-purge':'조광조가 현량과·향약·위훈 삭제 등을 추진하자 훈구 세력이 반격했고 1519년 기묘사화로 사림이 숙청되었습니다.',
  'imjin-war':'임진왜란과 정유재란에는 남원성 등 주요 성곽에서 조선·명 연합군과 일본군이 치열하게 싸웠습니다.',
  'hongmungwan':'홍문관은 왕의 경연과 자문을 맡았고 사헌부·사간원과 함께 3사의 언론 기능을 수행했습니다.',
  'daedong-law':'대동법은 가호마다 토산물을 내던 공납을 토지 결수 기준의 쌀·동전·포목 납부로 바꾸었습니다.',
  'park-jiwon':'박지원은 열하일기에 청의 상공업과 기술을 기록하고 이용후생을 강조했습니다.',
  'yeongjo-reforms':'영조는 탕평 정치를 펴고 청계천을 준설했으며 신문고를 부활해 도성·민생 문제를 정비했습니다.',
  'genre-painting':'신윤복을 비롯한 풍속화가들은 조선 후기 도시와 서민의 생활 모습을 생생하게 그렸습니다.',
  'daewongun-reforms':'흥선 대원군은 서원을 철폐하고 호포제를 실시했지만 경복궁 중건의 원납전과 부역은 백성에게 부담이 되었습니다.',
  'sejo-rule':'세조는 간경도감을 설치해 불경을 간행하고 6조 직계제 등으로 왕권을 강화했습니다.',
  'sarim-learning':'이황은 사단칠정 논쟁 등 성리학 연구를 심화했고 서원은 사림의 학문과 향촌 활동의 기반이 되었습니다.',
  'sukjong-rule':'숙종은 환국으로 정국을 주도하고 금위영을 설치해 5군영 체제를 완성했습니다.',
  'late-commerce':'대동법 이후 공인과 사상이 성장하고 일부 도고 상인은 상품을 매점해 가격과 유통을 좌우했습니다.',
  'park-jega':'박제가는 북학의에서 청의 기술 수용과 소비·유통의 확대를 주장했습니다.',
  'jinju-uprising':'1862년 진주 농민 봉기는 백낙신 등의 수탈과 삼정 문란에 항의해 일어났고 전국 농민 봉기로 확산되었습니다.',
  'byeongin-yangyo':'병인양요 때 양헌수 부대가 정족산성에서 프랑스군을 물리쳤지만 외규장각 도서가 약탈되었습니다.',
  'danjong-restoration':'세조 즉위 뒤 성삼문·박팽년 등 사육신과 금성대군이 단종 복위를 꾀했으나 실패했습니다.',
  'royal-justice':'의금부는 왕명에 따라 중대한 범죄와 반역 사건을 다룬 국왕 직속 사법 기관입니다.',
  'japan-diplomacy':'신숙주의 해동제국기는 일본의 지리·국정·교빙 절차를 정리한 대일 외교 자료입니다.',
  'jinju-battle':'김시민은 임진왜란 때 진주성에서 일본군을 물리쳐 전라도 진출을 저지했습니다.',
  'hyojong-northern-policy':'효종은 병자호란의 치욕을 씻기 위해 북벌을 추진했지만 현실적으로는 청의 요청을 받아 나선 정벌에 군대를 보냈습니다.',
  'commodity-economy':'상평통보가 널리 유통되고 공인·사상·장시가 성장하면서 상품 화폐 경제가 발달했습니다.',
  'local-disorder':'세도 정치기 수령과 향리의 수탈이 심해지고 기존 향촌 지배 질서가 흔들리면서 농민 저항이 커졌습니다.',
  'jikjeon-law':'세조의 직전법은 현직 관리에게만 수조지를 지급해 국가의 토지 지배를 강화하려 한 제도입니다.',
  'war-transition':'임진왜란 뒤 명이 쇠퇴하고 후금이 성장했으며, 친명 정책을 택한 인조 대 병자호란이 일어났습니다.',
  'royal-secretariat':'승정원은 왕명을 출납한 국왕의 비서 기관이며 승지가 왕의 유지와 명령을 각 관청에 전달했습니다.',
  'hong-daeyong':'홍대용은 의산문답에서 지전설과 우주 무한론을 제시하며 성리학적 세계관을 비판했습니다.',
  'middle-people':'역관·의관·기술관 같은 중인은 전문 지식과 대외 정보를 바탕으로 조선 후기 문화·경제 변화에 참여했습니다.',
  'righteous-army':'고경명은 임진왜란 때 의병을 이끌고 금산에서 일본군과 싸웠으며, 지역 의병은 관군이 미치지 못한 곳을 지켰습니다.'
};

const joseonPageFor=(round,number)=>round===73?(number===20?5:number<=24?6:number<=29?7:8):round===74?(number<=22?5:number<=26?6:7):round===75?(number<=21?5:number<=25?6:7):round===76?(number<=21?5:number<=26?6:7):round===77?(number<=21?5:number<=25?6:7):round===78?(number<=20?5:number<=25?6:7):(number<=21?5:number<=25?6:7);
const joseonExamYear=round=>round===79?2026:2025;
const joseonOptionLabels=['원본 선택지 1','원본 선택지 2','원본 선택지 3','원본 선택지 4','원본 선택지 5'];
const joseonQuestionTypeFor=(event,concept)=>/culture|painting|popular/.test(event)?'문화·자료 분석형':/transition|hwanguk|reforms/.test(event)?'시기·정책 연결형':/war|battle|uprising|purge|restoration/.test(event)?'사료·사건 판단형':/인물|이순신|박지원|박제가|홍대용|조광조|세종|세조|숙종|정조|영조/.test(concept)?'인물·업적 판단형':'제도·사회 판단형';
const JOSEON_SOURCE_PDF_HASHES={73:'d6ad706f1bd7ce3a0b18d7b7cdda9439d10b7b712121428b21af2c31268c4836',74:'7d7322d680119d7b7b89c7465edc1dd8d0f06e8180594aff69b7d34502a44c79',75:'2af5466f3be54d75eb65098f042f5f9c56de01fd213a71dfbe460ea222cc137e',76:'b25c8617eb817711a54e69c09040298bf1b102f59fe29aebaad3558981e834f3',77:'c3ff51d9273f7812a2b84d7fac4e8e1cb9aa642e80a4f53ebfc2a8afc5503e88',78:'7d96d41c1686c5b3ea3c533d76fbb23235c44d8e55f53e81a320e31cf914fba0',79:'fa82e6c8977670c1b55778b061e33ee367c55cd3f8707806f63d70d8353453d7'};
const JOSEON_ANSWER_PDF_HASHES={73:'0dfeee4af303493e95a3a30c7f7cd890377f067789bdb7c00a9cc90af15c6347',74:'db21586adfbe6df757b51a87eb0824cb414379cbe8f984c8fe1709e5b3643b46',75:'9ecff7c82b2f0343d3e6fd9dec389431411257e00fd8a53b11d519cb58c5dad1',76:'9da8824061aa649e0c1246edc70bf86cb29273cbe24eabf11b636123d3c9e98b',77:'71b9b6ef633f0e70b6a9b3c4565ec2f02a1ba2ef5f805f34d77d41427913b304',78:'a8e8513c5d73ae81594460354a7b8a83ddaec9894001ff66cecae40f4d280638',79:'ea380c4a1f4f24ebd4c95ad171aa7ace3fc0654284fbe2d7be4d5b1f675ec393'};
const JOSEON_IMAGE_HEIGHTS={73:{20:960,21:900,22:1030,23:760,24:1175,25:775,26:1160,27:580,28:465,29:880,30:900,31:1040},74:{20:615,21:465,22:845,23:810,24:1130,25:905,26:1035,27:1020},75:{20:1004,21:931,22:1059,23:876,24:930,25:1005,26:519,27:731},76:{20:1024,21:911,22:627,23:609,24:697,25:1115,26:820,27:1119,28:815,29:1163},77:{20:1064,21:871,22:985,23:950,24:1165,25:770,26:947,28:605,29:643},78:{19:890,20:1050,21:490,22:805,23:620,24:980,25:960,26:1000,27:940},79:{19:1070,20:790,21:1150,22:890,23:1050,24:970,25:970,26:830,27:1110}};
const joseonQuestionCounts={};
JOSEON_OFFICIAL_QUESTIONS.forEach(row=>{
  const [round,number,answer,chapterNumber,concept,event]=row,chapterId=joseonChapterId(chapterNumber),blueprint=JOSEON_BLUEPRINTS.find(ch=>String(ch.n).padStart(2,'0')===chapterNumber);
  const sceneIndex=JOSEON_OFFICIAL_STORY_MAP[`${round}-${number}`],relatedSceneId=joseonSceneId(Number(chapterNumber),sceneIndex),story=STORIES[relatedSceneId];
  if(!sceneIndex||!story)throw new Error(`조선 기출 스토리 매핑 누락: ${round}회 ${number}번`);
  const questionId=`joseon-official-${round}-advanced-${number}`;
  QUESTIONS.push(question({
    questionId,officialQuestionId:questionId,chapterId,era:'조선',primaryEra:'joseon',relatedSceneId,
    relatedHistoricalEventId:event,historicalEventId:event,historicalEvent:concept,relatedIllustrationId:story.illustrationId,
    questionType:joseonQuestionTypeFor(event,concept),difficulty:'심화',question:`${concept}에 관한 원본 자료를 보고 옳은 답을 고르세요.`,
    sourceQuestionText:`${concept} · 원본 자료 분석`,choices:[...joseonOptionLabels],sourceChoices:[...joseonOptionLabels],answer:answer-1,
    explanation:`${JOSEON_EVENT_EXPLANATIONS[event]} 이야기의 ‘${story.title}’에서 본 상황과 원본 자료의 단서를 연결하면 정답은 ${['①','②','③','④','⑤'][answer-1]}입니다.`,
    wrongFeedback:`${concept}의 시기와 관련 제도를 장면의 기억과 다시 연결해 보세요.`,memoryPrompt:`${story.title} 장면을 떠올린다`,
    gameMemory:`${story.year}년 ${story.location}에서 ${story.title}을(를) 직접 경험했습니다.`,storyConnection:`${story.title} 장면에서 ${concept}의 원인·전개·결과를 먼저 경험했습니다.`,examKeywords:concept.split('·'),concepts:concept.split('·'),conceptIds:[event,...concept.split('·')],
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
const joseonLegacySceneCursor={};
const JOSEON_RELATED_SCENE_REMAP_COUNT=JOSEON_OFFICIAL_QUESTIONS.reduce((count,[round,number])=>{
  const questionId=`joseon-official-${round}-advanced-${number}`,q=QUESTIONS.find(item=>item.questionId===questionId),cursor=joseonLegacySceneCursor[q.chapterId]||0,beatCount=JOSEON_BLUEPRINTS.find(ch=>joseonChapterId(ch.n)===q.chapterId).beats.length,legacySceneId=joseonSceneId(Number(q.chapterId.slice(-2)),cursor%beatCount+1);
  joseonLegacySceneCursor[q.chapterId]=cursor+1;
  return count+(q.relatedSceneId===legacySceneId?0:1);
},0);
const JOSEON_QUESTION_SCOPE={rounds:[73,74,75,76,77,78,79],officialCount:JOSEON_OFFICIAL_QUESTION_IDS.length,practiceCount:JOSEON_PRACTICE_QUESTIONS.length,storyBlockCount:JOSEON_BLUEPRINTS.reduce((sum,ch)=>sum+ch.beats.length,0),relatedSceneRemapCount:JOSEON_RELATED_SCENE_REMAP_COUNT,firstYear:1392,lastYear:1875};
