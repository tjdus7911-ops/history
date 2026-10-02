/* CH.05–12 — late Goryeo playable story, advanced-practice bank, and shared render profiles. */
const LATE_GORYEO_SOURCE_NOTE='국사편찬위원회 우리역사넷의 사실관계를 바탕으로 새로 쓴 심화 연습 문항';

const CHARACTER_RENDER_PROFILES={
  tiers:{MAIN:{scale:1,zIndex:3},SUPPORTING:{scale:.9,zIndex:2},EXTRA:{scale:.78,zIndex:1}},
  characters:{
    player:{tier:'MAIN'},doyun:{tier:'MAIN'},gilsang:{tier:'MAIN'},freed_man:{tier:'MAIN'},hyunwoo:{tier:'MAIN'},
    merchant:{tier:'SUPPORTING'},merchant_01:{tier:'SUPPORTING'},injured_merchant:{tier:'SUPPORTING'}
  },
  portraits:{
    doyun_935:{scale:1.8,anchorY:32},doyun_943:{scale:1.8,anchorY:32},
    doyun_935_neutral:{scale:1.8,anchorY:32},doyun_935_smile:{scale:1.8,anchorY:32},doyun_935_serious:{scale:1.8,anchorY:32},doyun_935_worried:{scale:1.8,anchorY:32},
    doyun_943_neutral:{scale:1.8,anchorY:32},doyun_943_smile:{scale:1.8,anchorY:32},doyun_943_serious:{scale:1.8,anchorY:32},doyun_943_worried:{scale:1.8,anchorY:32},
    merchant_918_neutral:{scale:1.35,anchorY:13},merchant_918_serious:{scale:1.35,anchorY:13},merchant_927_injured:{scale:1.35,anchorY:13},merchant_935_neutral:{scale:1.35,anchorY:13}
  }
};
for(const [id,profile] of Object.entries(CHARACTER_RENDER_PROFILES.characters))if(CHARACTERS[id])CHARACTERS[id].renderTier=profile.tier;

const lateArt=(id,sourceId,label)=>{const source=ASSETS[sourceId]||ASSETS['route-songak'];ASSETS[id]={...source,id,label,embeddedCharacters:false,embeddedCharacterIds:[]};return id};
lateArt('late-border','route-caravan','고려 북방의 성과 길');
lateArt('late-court','ch03-gukjagam','고려 궁궐과 관청 뜰');
lateArt('late-city','ch02-gaegyeong-market','고려의 수도 개경');
lateArt('late-night','ch02-purge-night','전란과 정변이 지나가는 밤');
lateArt('late-water','ch02-water-reflection-958','강과 나루, 섬으로 이어지는 물길');
lateArt('late-market','market-later-three-kingdoms','고려 시대의 장터');
lateArt('late-study','ch03-doyun-guild-interior','문서와 책이 놓인 실내');
lateArt('late-temple','ch03-doyun-courtyard','산사와 고요한 뜰');
lateArt('late-war','route-royal','전쟁을 앞둔 고려군의 길');
lateArt('late-ending','chapter-complete','고려 왕조의 마지막 새벽');
const lateDedicatedArt=(id,src,label)=>{ASSETS[id]={id,label,src,alt:label,status:'ready',embeddedCharacters:false,embeddedCharacterIds:[]};return id};
lateDedicatedArt('ch05-seohui-negotiation','assets/scenes/ch05-seohui-negotiation.png','993년 서희의 담판이 열린 북방 군영');
lateDedicatedArt('ch06-gaegyeong-rebuild','assets/scenes/ch06-gaegyeong-rebuild.png','거란군이 물러난 뒤 다시 일어서는 개경');
lateDedicatedArt('ch07-gwiju-battlefield','assets/scenes/ch07-gwiju-battlefield.png','1019년 귀주대첩의 북방 전장');
lateDedicatedArt('ch08-seogyeong-rebellion','assets/scenes/ch08-seogyeong-rebellion.png','1135년 묘청의 난이 벌어진 서경');
lateDedicatedArt('ch09-choe-regime','assets/scenes/ch09-choe-regime.png','최씨 무신 정권의 교정도감 뜰');
lateDedicatedArt('ch10-cheoin-fortress','assets/scenes/ch10-cheoin-fortress.png','1232년 주민들이 지킨 처인성');
lateDedicatedArt('ch11-ssangseong-recovery','assets/scenes/ch11-ssangseong-recovery.png','1356년 수복된 쌍성총관부');
lateDedicatedArt('ch12-wihwado-rain','assets/scenes/ch12-wihwado-rain.png','1388년 장마 속 위화도 진영');

const latePortraitSources={
  yeon:'assets/characters/hyunwoo_neutral.png',seon:'assets/characters/villager_female_01.png',muyeong:'assets/characters/laborer_01.png',harim:'assets/characters/villager_male_01.png',arin:'assets/characters/villager_female_01.png',junseo:'assets/characters/hyunwoo_neutral.png',
  seohui:'assets/characters/official_01.png',yanggyu:'assets/characters/soldier_01.png',ganggamchan:'assets/characters/official_01.png',yoon_gwan:'assets/characters/soldier_01.png',
  yi_jagyeom:'assets/characters/noble_01.png',myocheong:'assets/characters/villager_old_01.png',kim_busik:'assets/characters/official_01.png',choe_chungheon:'assets/characters/noble_01.png',
  kim_yunhu:'assets/characters/villager_old_01.png',gongmin:'assets/characters/noble_01.png',sindon:'assets/characters/villager_old_01.png',choe_yeong:'assets/characters/soldier_01.png',
  yi_seonggye:'assets/characters/soldier_01.png',jeong_mongju:'assets/characters/official_01.png'
};
const lateCharacterNames={yeon:'연',seon:'선',muyeong:'무영',harim:'하림',arin:'아린',junseo:'준서',seohui:'서희',yanggyu:'양규',ganggamchan:'강감찬',yoon_gwan:'윤관',yi_jagyeom:'이자겸',myocheong:'묘청',kim_busik:'김부식',choe_chungheon:'최충헌',kim_yunhu:'김윤후',gongmin:'공민왕',sindon:'신돈',choe_yeong:'최영',yi_seonggye:'이성계',jeong_mongju:'정몽주'};
const lateHistoricalIds=new Set(['seohui','yanggyu','ganggamchan','yoon_gwan','yi_jagyeom','myocheong','kim_busik','choe_chungheon','kim_yunhu','gongmin','sindon','choe_yeong','yi_seonggye','jeong_mongju']);
const lateAddCharacter=(id,position='left')=>{
  const name=lateCharacterNames[id],src=latePortraitSources[id];
  CHARACTERS[id]={characterId:id,characterName:name,speakerType:'npc',position,show:true,presentation:'standing',portraitPrefix:id,renderTier:'MAIN'};
  for(const expression of ['neutral','smile','serious','worried','surprised','angry','thinking'])PORTRAITS[`${id}_${expression}`]=portrait(id,expression,`${name} · ${expression}`,['#303b43','#8e7255'],src);
  CHARACTER_RENDER_PROFILES.characters[id]={tier:'MAIN',historical:lateHistoricalIds.has(id)};
};
for(const id of Object.keys(latePortraitSources))lateAddCharacter(id,'left');

const lLine=(id,text,expression='neutral',type=null,name=null)=>dialogueLine(id,expression,text,type,name);
const nLine=text=>lLine('narrator',text,'neutral','narration');
const tLine=text=>lLine('player',text,'thinking','thought');
const lQuiz=(key,title,items)=>({key,title,items});
const lItem=(question,answer,distractors,explanation,keywords)=>({question,answer,distractors,explanation,keywords});

const LATE_CHAPTER_BLUEPRINTS={
  ch05:{number:'05',title:'말로 얻은 땅',subtitle:'993년 거란의 침입, 서희의 담판과 강동 6주',years:'993',start:'ch05_border',complete:'ch05_after',protagonist:'yeon',protagonistAge:19,beats:[
    {id:'ch05_border',year:993,location:'북방 장터',title:'닫히는 북쪽 길',art:'late-market',lines:[nLine('전쟁 소문이 퍼지자 북쪽 물건을 싣던 수레가 하나둘 멈췄다.'),lLine('yeon','거란군이 압록강을 넘어왔다고 합니다. 장사꾼들은 길을 돌리고요.','worried'),tLine('나라의 국경이 흔들리면 가장 먼저 평범한 삶의 길이 막힌다.')],choice:true},
    {id:'ch05_invasion',year:993,location:'청천강 이북',title:'80만이라는 외침',art:'late-war',lines:[nLine('거란의 소손녕은 대군을 이끌고 고려를 압박했다.'),lLine('yeon','숫자가 아무리 커도, 저들이 무엇을 원하는지 먼저 알아야 해요.','serious'),tLine('싸움의 크기만큼 외교의 이유도 살펴야 한다.')],quiz:lQuiz('invasion','거란의 1차 침입',[lItem('993년 고려를 침입한 나라는?','거란',['몽골','여진','왜'],'993년에는 거란의 소손녕이 고려를 침입했습니다.',['993년','거란','소손녕']),lItem('거란이 고려를 압박하며 내세운 명분과 관련 깊은 나라는?','송',['일본','신라','탐라'],'거란은 고려가 송과 관계를 맺고 있음을 문제 삼았습니다.',['거란','송','외교']),lItem('이 침입 때 고려가 택한 대응을 가장 잘 설명한 것은?','군사 방어와 외교 담판을 함께 진행했다',['즉시 수도를 버렸다','몽골과 연합했다','왜에 원군을 청했다'],'고려는 방어하는 한편 서희의 담판으로 돌파구를 만들었습니다.',['방어','담판','고려'])])},
    {id:'ch05_council',year:993,location:'고려 조정',title:'땅을 떼어 줄 것인가',art:'late-court',lines:[nLine('조정에서는 서경 이북을 내주자는 의견까지 나왔다.'),lLine('yeon','두려움 때문에 먼저 땅을 내놓으면, 다음 요구는 어디까지일까요?','worried'),tLine('위기 속 판단은 적의 주장과 실제 목적을 구분하는 데서 시작한다.')]},
    {id:'ch05_seohui',year:993,location:'거란 진영 앞',title:'서희가 읽은 판',art:'late-border',cast:['seohui'],lines:[lLine('seohui','고려는 고구려를 계승한 나라요. 거란과 왕래하지 못하는 까닭은 여진이 길을 막았기 때문이오.','serious'),nLine('서희는 상대의 논리를 뒤집어 북방 영토 확보의 근거로 삼았다.'),tLine('적의 요구를 그대로 받지 않고, 고려의 계승 의식과 현실을 함께 내세웠다.')],quiz:lQuiz('seohui','서희의 외교 담판',[lItem('소손녕과 담판한 고려의 관리는?','서희',['강감찬','윤관','김부식'],'서희가 소손녕과 담판하여 철군을 이끌었습니다.',['서희','소손녕','담판']),lItem('서희가 담판에서 강조한 고려의 계승 국가는?','고구려',['백제','신라','발해'],'서희는 고려가 고구려를 계승한 나라임을 강조했습니다.',['고구려 계승','고려']),lItem('서희가 거란과 직접 통교하기 어렵다고 든 이유는?','여진이 길을 막고 있어서',['왜구가 바다를 막아서','몽골이 개경을 점령해서','송이 압록강을 지배해서'],'서희는 여진 때문에 길이 막혔다고 설명하며 강동 지역 확보 논리를 폈습니다.',['여진','통교','강동'])])},
    {id:'ch05_withdraw',year:994,location:'북방 성문',title:'칼이 멈춘 자리',art:'late-border',lines:[nLine('거란군은 물러났고, 고려는 송과의 관계를 조절하며 북방을 정비했다.'),lLine('yeon','말로 끝냈다고 해서 아무 일도 없었던 건 아니군요. 이제 성을 쌓아야 하니까.','serious'),tLine('외교가 만든 시간은 국경을 실제로 다질 때 의미가 생긴다.')]},
    {id:'ch05_six',year:994,location:'압록강 동쪽',title:'강동 6주',art:'late-border',lines:[nLine('고려는 압록강 동쪽의 강동 6주에 성을 쌓아 북방 지배를 굳혔다.'),lLine('seohui','얻은 땅은 지켜 내야 비로소 국경이 됩니다.','serious'),tLine('담판의 결실은 강동 6주와 압록강 방면의 방어선이었다.')],quiz:lQuiz('six','강동 6주',[lItem('서희의 담판 뒤 고려가 확보한 지역은?','강동 6주',['동북 9성','쌍성총관부','탐라총관부'],'서희의 담판 결과 고려는 강동 6주를 확보했습니다.',['강동 6주','서희']),lItem('강동 6주 확보의 군사적 의미로 가장 적절한 것은?','압록강 방면의 방어 기반을 넓혔다',['한강 이남을 회복했다','대마도를 지배했다','요동 전체를 차지했다'],'강동 6주는 압록강 동쪽 북방 방어와 진출의 거점이었습니다.',['압록강','북방 방어']),lItem('강동 6주와 직접 관련된 사건은?','거란의 1차 침입',['몽골의 1차 침입','무신 정변','위화도 회군'],'993년 거란 1차 침입 때의 담판이 강동 6주 확보로 이어졌습니다.',['993년','거란 1차'])])},
    {id:'ch05_people',year:995,location:'새로 쌓은 성 아래',title:'국경에도 사람이 산다',art:'late-market',lines:[lLine('yeon','지도에는 선 하나지만, 여기에는 논과 집과 장터가 생기겠죠.','smile'),lLine('player','우리가 외워야 할 건 땅의 이름만이 아니라, 그 땅을 지킨 선택이야.','serious'),nLine('강동 6주는 담판의 문장과 성을 쌓은 사람들의 삶이 겹친 공간이 되었다.')]},
    {id:'ch05_memory',year:995,location:'압록강 길',title:'말이 국경이 된 날',art:'late-water',lines:[tLine('993년 거란 침입, 서희와 소손녕의 담판, 그리고 강동 6주.'),lLine('yeon','다음에 또 북쪽에서 군대가 오면, 오늘 만든 성들이 버텨 주겠지요.','worried'),nLine('첫 번째 위기는 끝났지만 거란과의 긴장은 끝나지 않았다.')]},
    {id:'ch05_bridge',year:1009,location:'개경으로 향하는 길',title:'평화 뒤의 균열',art:'late-night',lines:[nLine('십여 년 뒤, 위기는 국경이 아니라 고려 조정 안에서 먼저 시작되었다.'),lLine('yeon','개경에서 정변이 일어났다는 소식입니다.','serious'),tLine('밖의 적이 다시 움직이기 전에 나라 안의 질서가 흔들렸다.')]},
    {id:'ch05_after',year:1009,location:'어두운 개경',title:'두 번째 문 앞에서',art:'late-ending',lines:[nLine('서희가 얻은 시간과 땅은 다음 세대의 방패가 되었다.'),lLine('player','도윤이 떠난 뒤에도 고려는 계속 늙고, 나는 그대로다.','worried'),lLine('yeon','무슨 말씀이세요? 어서 갑시다. 개경이 심상치 않아요.','worried')],completeChapter:true}
  ]},
  ch06:{number:'06',title:'불타는 개경',subtitle:'1009–1011년, 정변과 거란의 2차 침입',years:'1009 — 1011',start:'ch06_coup',complete:'ch06_after',protagonist:'yeon',protagonistAge:36,beats:[
    {id:'ch06_coup',year:1009,location:'개경 궁성',title:'강조의 정변',art:'late-night',lines:[nLine('강조가 군사를 이끌고 목종을 폐위한 뒤 현종을 왕위에 올렸다.'),lLine('yeon','국경의 적은 이 일을 그냥 넘기지 않을 겁니다.','serious'),tLine('거란은 강조의 정변을 두 번째 침입의 명분으로 삼았다.')],quiz:lQuiz('coup','강조의 정변',[lItem('1009년 정변으로 폐위된 고려 왕은?','목종',['현종','성종','숙종'],'강조는 목종을 폐위하고 현종을 왕위에 올렸습니다.',['강조','목종','현종']),lItem('강조의 정변 뒤 왕위에 오른 인물은?','현종',['광종','의종','공민왕'],'현종은 강조의 정변 뒤 왕이 되었습니다.',['현종','1009년']),lItem('거란이 2차 침입 때 내세운 명분은?','강조의 정변을 문제 삼음',['서희의 귀순 요구','무신 정권 타도','쌍성총관부 회복'],'거란은 강조의 정변을 구실로 1010년 다시 침입했습니다.',['거란 2차','강조 정변'])])},
    {id:'ch06_march',year:1010,location:'압록강 남쪽',title:'성종이 직접 온다',art:'late-war',lines:[nLine('거란 성종이 대군을 이끌고 직접 고려로 들어왔다.'),lLine('yeon','이번에는 993년처럼 담판만 기다릴 수 없습니다.','worried'),tLine('정변의 책임을 묻는다는 명분 아래 전쟁은 수도를 향했다.')]},
    {id:'ch06_gangjo',year:1010,location:'통주 전선',title:'강조의 패배',art:'late-war',lines:[nLine('강조가 이끄는 고려군이 통주에서 패하고 강조는 포로가 되어 죽었다.'),lLine('player','정변으로 권력을 잡았던 사람이 전장에서 사라졌다.','serious'),lLine('yeon','하지만 전쟁은 그 사람 하나로 끝나지 않아요.','angry')],quiz:lQuiz('second','거란의 2차 침입',[lItem('1010년 거란의 2차 침입을 이끈 왕은?','거란 성종',['몽골 태종','금 태조','송 태조'],'거란 성종이 직접 군대를 이끌고 침입했습니다.',['1010년','거란 성종']),lItem('2차 침입 때 강조가 패한 전투 지역은?','통주',['귀주','처인성','진도'],'강조의 군대는 통주에서 패했습니다.',['강조','통주']),lItem('강조의 최후에 대한 설명으로 옳은 것은?','거란군의 포로가 된 뒤 죽었다',['위화도에서 회군했다','강화도에서 정권을 잡았다','서경에서 왕이 되었다'],'강조는 통주 패전 뒤 포로가 되어 죽었습니다.',['강조','거란 2차'])])},
    {id:'ch06_gaegyeong',year:1011,location:'개경',title:'불타는 수도',art:'late-night',lines:[nLine('현종이 남쪽으로 피난한 뒤 거란군이 개경에 들어와 궁궐과 시설을 불태웠다.'),lLine('yeon','평생 보던 거리가 잿더미가 됐습니다.','worried'),tLine('수도가 함락되어도 나라 전체가 곧바로 무너지는 것은 아니었다.')],choice:true},
    {id:'ch06_flight',year:1011,location:'나주로 향하는 길',title:'현종의 피난',art:'late-water',lines:[nLine('현종은 나주까지 내려가며 조정의 명맥을 이어 갔다.'),lLine('player','왕이 자리를 지키는 것보다 나라가 계속 움직이게 하는 일이 먼저였구나.','serious'),lLine('yeon','남쪽 길에서도 백성들이 왕의 행렬을 지켜보고 있습니다.','neutral')],quiz:lQuiz('flight','현종의 피난과 철군',[lItem('거란 2차 침입 때 현종이 피난한 곳은?','나주',['평양','강화도','제주'],'현종은 개경을 떠나 나주까지 피난했습니다.',['현종','나주']),lItem('개경을 점령한 거란군이 철수한 배경으로 가장 적절한 것은?','현종이 잡히지 않았고 후방 보급이 불안했다',['고려가 몽골과 동맹했다','왜군이 요를 공격했다','후백제가 개경을 탈환했다'],'거란은 왕을 붙잡지 못한 채 후방 공격과 보급 문제를 겪었습니다.',['철군','보급','현종']),lItem('2차 침입 이후 거란이 요구한 사항은?','현종의 친조와 강동 6주 반환',['삼별초 해산과 개경 환도','전민변정도감 폐지','과전법 시행'],'거란은 현종의 친조와 강동 6주 반환을 요구했습니다.',['친조','강동 6주'])])},
    {id:'ch06_yanggyu',year:1011,location:'흥화진과 퇴로',title:'돌아가는 적의 뒤에서',art:'late-border',cast:['yanggyu'],lines:[lLine('yanggyu','성을 지키는 것만이 전부가 아니다. 포로로 끌려가는 백성을 되찾는다.','serious'),nLine('양규는 흥화진을 지키고 거란군의 퇴로를 공격해 많은 포로를 구했다.'),tLine('전쟁의 결과는 왕과 장군뿐 아니라 돌아온 사람의 수로도 남는다.')]},
    {id:'ch06_rescue',year:1011,location:'거란군의 퇴로',title:'삼만여 명의 귀환',art:'late-war',lines:[nLine('양규와 부하들은 여러 차례 기습해 끌려가던 백성을 구출했다.'),lLine('yeon','개경은 탔지만, 돌아오는 사람이 있으면 다시 장터를 열 수 있습니다.','serious'),lLine('yanggyu','끝까지 지킨 것은 성벽만이 아니었다.','serious')],quiz:lQuiz('yanggyu','양규의 항전',[lItem('거란 2차 침입 때 흥화진을 지킨 장수는?','양규',['윤관','최영','이성계'],'양규는 흥화진을 지키고 퇴각하는 거란군을 공격했습니다.',['양규','흥화진']),lItem('양규의 활약으로 옳은 것은?','거란에 끌려가던 많은 백성을 구출했다',['강동 6주를 담판으로 얻었다','동북 9성을 쌓았다','왜구를 화포로 물리쳤다'],'양규는 거란군의 퇴로를 공격해 많은 포로를 구출했습니다.',['포로 구출','거란 2차']),lItem('양규가 활약한 침입 차수는?','거란의 2차 침입',['거란의 1차 침입','거란의 3차 침입','몽골의 1차 침입'],'양규의 항전은 1010~1011년 거란 2차 침입 때입니다.',['1010~1011','2차 침입'])])},
    {id:'ch06_loss',year:1011,location:'애전 전투 뒤',title:'돌아오지 못한 장수',art:'late-night',lines:[nLine('양규는 끝내 전사했지만, 그가 구한 사람들은 고향으로 돌아왔다.'),lLine('yeon','기억할 이름은 승리한 사람만이 아니군요.','worried'),tLine('패배와 피난 속에서도 항전은 다음 전쟁을 준비할 시간을 남겼다.')]},
    {id:'ch06_rebuild',year:1012,location:'다시 세우는 개경',title:'재조대장경의 시작',art:'late-temple',lines:[nLine('현종 때 거란 침입을 물리치려는 염원을 담아 초조대장경 조판이 시작되었다.'),lLine('yeon','불탄 도시에서 다시 나무판을 새기는군요.','surprised'),tLine('전쟁의 기억은 방어 시설뿐 아니라 불교 문화 사업에도 남았다.')],quiz:lQuiz('culture','현종과 초조대장경',[lItem('거란 침입을 물리치려는 염원으로 현종 때 시작된 것은?','초조대장경 조판',['팔만대장경 조판','직지 간행','삼국사기 편찬'],'현종 때 초조대장경 조판이 시작되었습니다.',['현종','초조대장경']),lItem('초조대장경과 팔만대장경의 관계로 옳은 것은?','초조대장경이 먼저 조판되었다',['둘 다 공민왕 때 만들었다','팔만대장경이 거란 침입 때 먼저 만들었다','둘 다 금속 활자로 인쇄했다'],'초조대장경은 거란 침입기, 팔만대장경은 몽골 침입기에 조판되었습니다.',['초조대장경','팔만대장경']),lItem('현종 때의 사실로 옳은 것은?','거란의 침입으로 나주까지 피난했다',['몽골 침입으로 강화도로 천도했다','위화도 회군을 명령했다','전민변정도감을 설치했다'],'현종은 거란 2차 침입 때 나주까지 피난했습니다.',['현종','나주'])])},
    {id:'ch06_memory',year:1012,location:'복구된 성문',title:'잿더미에서 남은 것',art:'late-city',lines:[tLine('강조의 정변, 현종의 피난, 불탄 개경, 양규가 되찾은 사람들.'),lLine('yeon','다음에는 수도까지 오기 전에 막아야 합니다.','serious'),nLine('고려는 외교 교섭을 이어 가면서도 또 올 전쟁을 준비했다.')]},
    {id:'ch06_warning',year:1018,location:'북방 봉수대',title:'세 번째 불빛',art:'late-border',lines:[nLine('친조와 강동 6주 반환 문제는 풀리지 않았고, 북방 봉수대에 다시 불이 올랐다.'),lLine('yeon','이번에는 강감찬이 군을 맡는다고 합니다.','serious'),tLine('세 번째 침입은 이전의 실패를 기억한 방어전이 될 것이다.')]},
    {id:'ch06_after',year:1018,location:'흥화진으로 가는 길',title:'물길을 막는 사람들',art:'late-water',lines:[nLine('고려군은 흥화진 앞의 물길을 살피며 적을 기다렸다.'),lLine('player','두 번의 침입에서 배운 것이 이번 전투의 준비가 된다.','serious'),lLine('yeon','이번에는 우리가 길을 정할 차례예요.','serious')],completeChapter:true}
  ]},
  ch07:{number:'07',title:'마지막 침입',subtitle:'1018–1019년, 흥화진과 귀주대첩',years:'1018 — 1109',start:'ch07_command',complete:'ch07_after',protagonist:'yeon',protagonistAge:45,beats:[
    {id:'ch07_command',year:1018,location:'개경 조정',title:'강감찬의 판단',art:'late-court',cast:['ganggamchan'],lines:[nLine('거란이 다시 쳐들어오자 강감찬이 상원수가 되어 방어를 맡았다.'),lLine('ganggamchan','적이 깊이 들어오게 두되, 돌아갈 길까지 계산해야 한다.','serious'),tLine('세 번째 침입의 방어는 앞선 두 전쟁의 경험 위에서 시작됐다.')],quiz:lQuiz('command','거란의 3차 침입',[lItem('1018년 거란의 3차 침입 때 고려군을 지휘한 인물은?','강감찬',['서희','양규','윤관'],'강감찬이 상원수로 고려군을 지휘했습니다.',['강감찬','1018년']),lItem('거란 3차 침입군의 지휘관은?','소배압',['소손녕','살리타','홍건적'],'소배압이 거란군을 이끌고 침입했습니다.',['소배압','거란 3차']),lItem('거란 3차 침입이 일어난 시기의 고려 왕은?','현종',['목종','의종','충렬왕'],'현종 때 거란의 2·3차 침입이 이어졌습니다.',['현종','거란'])])},
    {id:'ch07_heunghwa',year:1018,location:'흥화진 앞 냇물',title:'가죽으로 막은 물',art:'late-water',lines:[nLine('고려군은 소가죽을 엮어 물길을 막았다가 거란군이 건널 때 터뜨렸다.'),lLine('yeon','성벽만 보는 적에게 물이 공격해 오는 셈이군요.','surprised'),lLine('ganggamchan','지형을 아는 쪽이 전장의 시간을 정한다.','serious')]},
    {id:'ch07_ambush',year:1018,location:'흥화진 계곡',title:'첫 번째 타격',art:'late-war',lines:[nLine('물이 불어난 순간 매복한 고려군이 거란군을 공격했다.'),lLine('player','힘의 크기보다 준비한 장소가 먼저 움직였다.','serious'),lLine('yeon','993년에 얻은 북방의 성들이 이번에는 전장이 됐어요.','serious')],quiz:lQuiz('heunghwa','흥화진 전투',[lItem('흥화진 전투에서 고려군이 활용한 것은?','막아 두었던 물길',['화포를 실은 전함','코끼리 부대','철갑 기병'],'고려군은 물길을 막았다가 터뜨려 거란군을 공격했습니다.',['흥화진','수공']),lItem('흥화진 전투의 지휘와 관련된 인물은?','강감찬',['김윤후','정중부','신돈'],'강감찬이 거란 3차 침입 방어를 총지휘했습니다.',['강감찬','흥화진']),lItem('흥화진 전투를 포함한 전쟁은?','거란의 3차 침입',['여진 정벌','몽골의 1차 침입','왜구 토벌'],'흥화진 전투는 1018년 거란 3차 침입 때 일어났습니다.',['1018년','거란 3차'])])},
    {id:'ch07_gaegyeong',year:1018,location:'개경 북쪽',title:'비워 둔 수도 앞',art:'late-city',lines:[nLine('소배압은 개경 가까이 진출했지만 고려의 청야 전술과 압박 속에 물러났다.'),lLine('yeon','가져갈 곡식도, 머물 자리도 없게 만든 겁니다.','serious'),tLine('수도를 지키는 일은 성벽 앞 한 번의 싸움이 아니었다.')],choice:true},
    {id:'ch07_return',year:1019,location:'귀주로 향하는 퇴로',title:'돌아가는 길',art:'late-border',lines:[nLine('후퇴하는 거란군을 고려군이 끈질기게 추격했다.'),lLine('ganggamchan','적이 국경을 넘을 때까지 전쟁은 끝난 것이 아니다.','serious'),lLine('player','양규가 그랬듯, 퇴로가 마지막 전장이 된다.','serious')]},
    {id:'ch07_gwiju',year:1019,location:'귀주',title:'바람이 바뀐 순간',art:'late-war',lines:[nLine('귀주에서 두 군대가 맞붙었고, 귀주대첩에서 고려군은 거란군에 큰 승리를 거두었다.'),lLine('yeon','살아서 북쪽 길을 다시 걷게 될 줄 몰랐습니다.','worried'),lLine('ganggamchan','승리의 이름보다 다시는 이 길을 넘보지 못하게 한 결과를 기억하라.','serious')],quiz:lQuiz('gwiju','귀주대첩',[lItem('1019년 귀주대첩에서 승리한 고려 장군은?','강감찬',['양규','윤관','최영'],'강감찬이 이끄는 고려군이 귀주에서 크게 승리했습니다.',['1019년','귀주대첩','강감찬']),lItem('귀주대첩에서 패한 거란 지휘관은?','소배압',['소손녕','살리타','이자겸'],'소배압의 거란군이 귀주에서 큰 피해를 입었습니다.',['소배압','귀주']),lItem('귀주대첩의 결과로 가장 적절한 것은?','고려·거란·송 사이에 세력 균형이 형성되었다',['고려가 원의 부마국이 되었다','무신 정권이 성립했다','조선이 건국되었다'],'전쟁 뒤 동아시아에서 고려·거란·송의 균형이 자리 잡았습니다.',['세력 균형','고려·거란·송'])])},
    {id:'ch07_peace',year:1020,location:'다시 열린 북방 장터',title:'세 나라 사이의 평화',art:'late-market',lines:[nLine('고려는 거란과 외교 관계를 회복하고 송과도 교류하며 실리를 취했다.'),lLine('yeon','장부에는 어느 나라 물건인지 적혀도, 길은 하나로 이어집니다.','smile'),tLine('전쟁 뒤의 평화는 한쪽에 완전히 기대지 않은 외교로 유지되었다.')]},
    {id:'ch07_time',year:1104,location:'동북 변경',title:'이번에는 여진',art:'late-border',lines:[nLine('세월이 흐르자 동북 지역에서 여진 세력이 커졌고 고려군은 기병전에서 어려움을 겪었다.'),lLine('player','거란을 막은 기억만으로 다음 적을 상대할 수는 없다.','serious'),nLine('고려는 새로운 적에 맞는 군대를 준비했다.')]},
    {id:'ch07_special',year:1104,location:'군사 훈련장',title:'별무반',art:'late-war',cast:['yoon_gwan'],lines:[lLine('yoon_gwan','기병은 신기군, 보병은 신보군, 승려 부대는 항마군으로 나눈다.','serious'),nLine('윤관은 여진의 기병에 맞서 별무반을 조직했다.'),tLine('적의 강점에 맞춰 군대의 구조 자체를 바꾼 것이다.')],quiz:lQuiz('byeolmuban','윤관과 별무반',[lItem('여진 정벌을 위해 조직한 특수 부대는?','별무반',['삼별초','도방','훈련도감'],'윤관의 건의로 별무반이 조직되었습니다.',['별무반','윤관']),lItem('별무반의 기병 부대는?','신기군',['신보군','항마군','별기군'],'신기군은 기병, 신보군은 보병, 항마군은 승려 부대입니다.',['신기군','기병']),lItem('별무반의 승려 부대는?','항마군',['신기군','신보군','응양군'],'항마군은 승려로 구성된 부대였습니다.',['항마군','별무반'])])},
    {id:'ch07_nine',year:1107,location:'동북 지역',title:'동북 9성',art:'late-border',lines:[nLine('윤관이 여진을 몰아내고 동북 지역에 9성을 쌓았다.'),lLine('player','강동 6주와 동북 9성. 둘 다 북방이지만 과정과 상대가 다르다.','thinking'),lLine('yoon_gwan','성을 얻는 일과 오래 지키는 일은 또 다른 문제다.','serious')]},
    {id:'ch07_return_nine',year:1109,location:'동북 9성의 길',title:'돌려준 성',art:'late-border',lines:[nLine('여진의 거센 반격과 반환 요청 속에 고려는 동북 9성을 돌려주었다.'),lLine('player','서희의 강동 6주는 지켰지만 윤관의 동북 9성은 반환했다.','serious'),nLine('비슷해 보이는 북방 영토 문제는 시험에서 결과를 구분해야 한다.')]},
    {id:'ch07_after',year:1126,location:'개경 귀족가',title:'전쟁이 멀어진 수도',art:'late-ending',lines:[nLine('긴 평화 속에서 개경의 문벌 귀족 가문은 혼인과 관직으로 힘을 키웠다.'),lLine('player','국경의 칼이 잠잠해지자, 이번에는 수도 안의 권력이 흔들린다.','worried'),nLine('왕실과 가장 가까운 가문에서 균열이 시작되고 있었다.')],completeChapter:true}
  ]},
  ch08:{number:'08',title:'두 개의 수도',subtitle:'1126–1135년, 이자겸의 난과 묘청의 서경 천도 운동',years:'1126 — 1136',start:'ch08_aristocrats',complete:'ch08_after',protagonist:'seon',protagonistAge:24,beats:[
    {id:'ch08_aristocrats',year:1126,location:'개경 귀족가',title:'가문이 만든 권력',art:'late-city',lines:[nLine('문벌 귀족은 음서와 공음전, 왕실과의 혼인으로 지위를 이어 갔다.'),lLine('seon','실력만으로 관직에 오르는 길과 집안이 열어 주는 길이 따로 있어요.','serious'),tLine('문벌 귀족 사회는 제도와 혼인이 함께 받치는 구조였다.')],quiz:lQuiz('aristocrats','문벌 귀족 사회',[lItem('문벌 귀족이 관직을 세습하는 데 활용한 제도는?','음서',['과거','취재','무과'],'음서는 공신과 고위 관료 자손을 시험 없이 등용하는 제도였습니다.',['음서','문벌 귀족']),lItem('문벌 귀족의 경제 기반과 관련 깊은 것은?','공음전',['과전법','직전법','균역법'],'공음전은 일정 범위에서 세습이 가능한 토지로 문벌 귀족의 기반이었습니다.',['공음전','경제 기반']),lItem('문벌 귀족이 왕실과 권력을 연결한 방법은?','왕실과의 혼인',['신분 해방 운동','과전법 실시','별무반 조직'],'유력 가문은 왕실과 혼인 관계를 맺어 정치적 영향력을 키웠습니다.',['혼인','문벌 귀족'])])},
    {id:'ch08_uicheon',year:1126,location:'흥왕사 서고의 기록',title:'교장과 천태종',art:'late-temple',lines:[nLine('서고에는 앞선 세대 의천이 교종을 중심으로 선종을 통합하고 교장 간행을 추진한 기록이 남아 있었다.'),lLine('seon','책을 모아 새기는 일도 흩어진 생각을 잇는 방법이군요.','smile'),tLine('의천, 교장, 천태종은 고려 전기 불교의 한 묶음으로 기억한다.')],quiz:lQuiz('uicheon','의천과 불교 문화',[lItem('교장을 간행하고 천태종을 개창한 승려는?','의천',['지눌','일연','혜초'],'의천은 교장 간행과 천태종 개창을 추진했습니다.',['의천','교장','천태종']),lItem('의천의 불교 통합 방향은?','교종 중심으로 선종을 통합',['선종 중심으로 교종을 통합','밀교만을 인정','유교와 불교를 모두 폐지'],'의천은 교종을 중심으로 선종을 아우르려 했습니다.',['교종 중심','선종 통합']),lItem('의천과 관련 깊은 왕실 관계는?','문종의 아들',['공민왕의 스승','태조의 장군','의종의 무신'],'의천은 문종의 아들로 왕자 출신 승려였습니다.',['의천','문종'])])},
    {id:'ch08_yi_power',year:1126,location:'개경 궁성',title:'왕의 장인이자 외조부',art:'late-court',cast:['yi_jagyeom'],lines:[nLine('이자겸은 여러 대에 걸친 왕실 혼인으로 막강한 권력을 쥐었다.'),lLine('yi_jagyeom','왕실과 우리 가문은 이미 떼어 놓을 수 없다.','serious'),lLine('seon','가문이 왕보다 강해졌다는 말이 괜한 소문이 아니군요.','worried')]},
    {id:'ch08_rebellion',year:1126,location:'불타는 개경',title:'이자겸의 난',art:'late-night',lines:[nLine('인종이 이자겸 세력을 제거하려 하자 척준경과 이자겸이 반격해 궁궐이 불탔다.'),lLine('seon','왕의 외척이 왕을 가두는 지경까지 왔어요.','angry'),tLine('문벌 귀족 사회의 모순이 왕실과 외척의 충돌로 폭발했다.')],choice:true,quiz:lQuiz('yirebellion','이자겸의 난',[lItem('이자겸의 난이 일어난 고려 왕은?','인종',['의종','명종','고종'],'1126년 인종 때 이자겸의 난이 일어났습니다.',['인종','1126년']),lItem('이자겸과 함께 궁궐을 공격한 인물은?','척준경',['정중부','김부식','최충헌'],'척준경이 이자겸과 함께 왕을 압박했습니다.',['척준경','이자겸']),lItem('이자겸 세력의 기반으로 가장 적절한 것은?','왕실과의 중첩된 혼인 관계',['삼별초 지휘권','전민변정도감','화통도감'],'이자겸 가문은 왕실과 거듭 혼인하며 외척 권력을 키웠습니다.',['외척','왕실 혼인'])])},
    {id:'ch08_fall',year:1126,location:'무너진 귀족가',title:'서로 등을 돌린 동맹',art:'late-night',lines:[nLine('척준경이 왕의 편으로 돌아서며 이자겸의 세력은 무너졌다.'),lLine('seon','가장 강해 보인 권력도 한 사람의 배신으로 무너졌네요.','serious'),tLine('난은 진압됐지만 개경 중심 정치에 대한 불만은 남았다.')]},
    {id:'ch08_west',year:1135,location:'서경',title:'서경으로 옮기자',art:'late-border',cast:['myocheong'],lines:[lLine('myocheong','서경으로 수도를 옮기고 금을 정벌해야 나라의 기운이 살아납니다.','serious'),nLine('묘청과 서경 세력은 풍수지리와 칭제건원, 금국 정벌을 주장했다.'),lLine('seon','개경의 질서와 완전히 다른 길을 요구하는군요.','worried')]},
    {id:'ch08_revolt',year:1135,location:'서경 성안',title:'대위국',art:'late-war',lines:[nLine('천도가 받아들여지지 않자 묘청 세력은 서경에서 국호를 대위라 하고 반란을 일으켰다.'),lLine('player','수도 이전 논쟁이 무장 반란으로 바뀌었다.','serious'),lLine('seon','서경 백성에게는 다시 전쟁이 시작된 셈이에요.','worried')],quiz:lQuiz('myocheong','묘청의 서경 천도 운동',[lItem('묘청 세력이 천도를 주장한 곳은?','서경',['남경','동경','강화도'],'묘청은 서경 천도를 주장했습니다.',['묘청','서경 천도']),lItem('묘청 세력이 주장한 내용은?','칭제건원과 금국 정벌',['친원 정책과 개경 환도','과전법과 조선 건국','노비안검법과 과거제'],'묘청 세력은 황제 칭호와 독자 연호, 금 정벌을 주장했습니다.',['칭제건원','금국 정벌']),lItem('묘청이 반란 때 사용한 국호는?','대위',['후백제','대진','조선'],'묘청 세력은 서경에서 국호를 대위라 했습니다.',['대위국','서경'])])},
    {id:'ch08_suppression',year:1136,location:'서경 성밖',title:'김부식의 진압',art:'late-war',cast:['kim_busik'],lines:[lLine('kim_busik','반란을 끝내고 조정의 질서를 회복한다.','serious'),nLine('김부식이 이끈 관군은 약 1년 만에 서경의 반란을 진압했다.'),tLine('개경 문벌 귀족 세력이 승리했고 서경 세력은 크게 약해졌다.')]},
    {id:'ch08_record',year:1145,location:'개경 서고',title:'삼국의 역사를 쓰다',art:'late-study',cast:['kim_busik'],lines:[nLine('김부식은 왕명으로 기전체 역사서인 삼국사기를 편찬했다.'),lLine('kim_busik','지나간 나라의 일을 기록해 다음 정치의 거울로 삼는다.','neutral'),tLine('전쟁을 진압한 인물과 역사서를 편찬한 인물이 같은 김부식이다.')],quiz:lQuiz('sagi','김부식과 삼국사기',[lItem('김부식 등이 편찬한 역사서는?','삼국사기',['삼국유사','제왕운기','동국통감'],'삼국사기는 김부식 등이 왕명으로 편찬했습니다.',['김부식','삼국사기']),lItem('삼국사기의 서술 체제는?','기전체',['편년체','기사본말체','강목체'],'삼국사기는 본기·열전 등을 갖춘 기전체 역사서입니다.',['기전체','삼국사기']),lItem('김부식의 활동으로 옳은 것은?','묘청의 난을 진압했다',['별무반을 조직했다','전민변정도감을 설치했다','위화도에서 회군했다'],'김부식은 관군을 이끌고 묘청의 난을 진압했습니다.',['김부식','묘청의 난'])])},
    {id:'ch08_society',year:1146,location:'개경 시장',title:'화려함 아래의 틈',art:'late-market',lines:[nLine('귀족의 저택과 청자, 불교 의식이 화려해지는 동안 농민의 부담과 신분 차이는 커졌다.'),lLine('seon','같은 수도인데 담장 안과 밖의 삶이 너무 다릅니다.','worried'),tLine('문화의 화려함과 사회의 모순은 같은 시대에 함께 존재했다.')]},
    {id:'ch08_pressure',year:1170,location:'보현원으로 가는 길',title:'문신의 잔치, 무신의 분노',art:'late-night',lines:[nLine('문신 중심의 정치와 무신 차별이 오래 쌓였다.'),lLine('seon','군사를 부리면서도 무신을 업신여긴 대가가 곧 터질 것 같아요.','serious'),tLine('귀족 사회의 균열은 이번에는 무신들의 칼로 번졌다.')]},
    {id:'ch08_memory',year:1170,location:'개경 성문',title:'무너지는 문벌의 질서',art:'late-city',lines:[tLine('음서와 공음전, 이자겸의 난, 묘청의 서경 천도 운동, 김부식의 삼국사기.'),lLine('seon','이제 궁궐을 지키던 무신들이 궁궐을 향하고 있어요.','worried'),nLine('문벌 귀족의 시대가 끝나고 무신 정권의 시대가 열리려 했다.')]},
    {id:'ch08_after',year:1170,location:'보현원',title:'칼이 먼저 말한 날',art:'late-ending',lines:[nLine('정중부·이의방 등 무신들이 정변을 일으켰다.'),lLine('player','불공정한 대우가 바뀌어야 했지만, 칼이 권력을 잡는 순간 또 다른 억압이 시작된다.','serious'),nLine('고려의 권력은 왕과 문신에게서 무신에게 넘어갔다.')],completeChapter:true}
  ]},
  ch09:{number:'09',title:'칼을 든 자들',subtitle:'1170–1198년, 무신 정권과 민중의 저항',years:'1170 — 1198',start:'ch09_coup',complete:'ch09_after',protagonist:'muyeong',protagonistAge:28,beats:[
    {id:'ch09_coup',year:1170,location:'보현원',title:'무신 정변',art:'late-night',lines:[nLine('정중부·이의방 등 무신들이 문신을 제거하고 의종을 폐위했다.'),lLine('muyeong','무신을 업신여긴 질서가 무너졌지만, 백성에게 좋은 세상이 온 건 아닙니다.','serious'),tLine('차별에 대한 반발이 권력 장악으로 바뀐 순간이었다.')],quiz:lQuiz('coup','무신 정변',[lItem('1170년 무신 정변을 주도한 인물은?','정중부',['김부식','서희','신돈'],'정중부·이의방 등 무신이 정변을 주도했습니다.',['1170년','정중부']),lItem('무신 정변으로 폐위된 왕은?','의종',['명종','고종','공민왕'],'무신들은 의종을 폐위하고 명종을 세웠습니다.',['의종','무신 정변']),lItem('무신 정변의 배경으로 가장 적절한 것은?','문신 중심 정치와 무신 차별',['원 간섭기의 친원 정책','몽골의 강화도 천도 요구','과전법 시행'],'문신 중심 질서에서 누적된 무신 차별이 정변의 핵심 배경입니다.',['무신 차별','문신 우대'])])},
    {id:'ch09_puppet',year:1170,location:'개경 궁궐',title:'왕 위의 무신',art:'late-court',lines:[nLine('무신들은 명종을 세웠지만 실제 권력은 무신 집정자들이 차지했다.'),lLine('muyeong','왕은 그대로인데 명령을 내리는 사람은 달라졌군요.','worried'),tLine('왕조는 이어졌지만 정치 운영의 주체가 바뀌었다.')]},
    {id:'ch09_rulers',year:1196,location:'개경의 권력가',title:'정중부에서 이의민까지',art:'late-city',lines:[nLine('이의방·정중부·경대승·이의민이 차례로 권력을 잡았고, 권력 교체에는 폭력이 반복됐다.'),lLine('muyeong','어제의 집정자가 오늘은 제거되는 세상입니다.','serious'),tLine('무신 정권 초기의 권력자는 안정된 세습 체제를 만들지 못했다.')],quiz:lQuiz('rulers','무신 집권자의 흐름',[lItem('무신 정권 집권 순서로 옳은 것은?','이의방 → 정중부 → 경대승 → 이의민',['정중부 → 김부식 → 이의민 → 최영','이의민 → 경대승 → 정중부 → 이의방','경대승 → 이의방 → 최충헌 → 정중부'],'무신 정권 초기에는 이의방·정중부·경대승·이의민 순으로 권력이 이동했습니다.',['무신 집권자','순서']),lItem('도방을 처음 조직한 무신 집권자는?','경대승',['정중부','이의민','김사미'],'경대승은 신변 보호를 위해 도방을 조직했습니다.',['경대승','도방']),lItem('천민 출신으로 최고 권력에 오른 무신 집권자는?','이의민',['이자겸','최우','김부식'],'이의민은 천민 출신으로 무신 정권의 최고 권력자가 되었습니다.',['이의민','신분'])])},
    {id:'ch09_choe',year:1196,location:'개경 최씨 가문',title:'최충헌의 등장',art:'late-night',cast:['choe_chungheon'],lines:[nLine('최충헌이 이의민을 제거하고 권력을 장악했다.'),lLine('choe_chungheon','흔들리는 권력을 한 손에 모으고 질서를 세우겠다.','serious'),lLine('muyeong','누구의 질서인지가 문제겠지요.','worried')]},
    {id:'ch09_bongsa',year:1196,location:'고려 조정',title:'봉사 10조',art:'late-court',cast:['choe_chungheon'],lines:[nLine('최충헌은 사회 개혁안을 담은 봉사 10조를 올리고 명종을 폐위했다.'),lLine('choe_chungheon','폐단을 말하는 자가 권력을 잡아 고치겠다.','serious'),tLine('개혁안을 내세웠지만 최씨 정권은 사병과 독자 기구로 권력을 강화했다.')],quiz:lQuiz('choe','최충헌의 집권',[lItem('이의민을 제거하고 최씨 무신 정권을 연 인물은?','최충헌',['최우','경대승','정중부'],'최충헌이 이의민을 제거하고 장기 집권 체제를 열었습니다.',['최충헌','이의민']),lItem('최충헌이 올린 개혁안은?','봉사 10조',['시무 28조','훈요 10조','홍범 14조'],'최충헌은 사회 폐단을 지적한 봉사 10조를 올렸습니다.',['봉사 10조','최충헌']),lItem('최씨 무신 정권의 최고 권력 기구는?','교정도감',['도평의사사','식목도감','정동행성 이문소'],'최충헌은 교정도감을 설치해 권력을 행사했습니다.',['교정도감','최씨 정권'])])},
    {id:'ch09_mangyi',year:1196,location:'개경에 도착한 명학소 기록',title:'소의 사람들이 일어서다',art:'late-market',lines:[nLine('기록에는 1176년 공주 명학소에서 망이·망소이가 가혹한 수탈과 차별에 맞서 봉기한 일이 적혀 있었다.'),lLine('muyeong','나라를 지키는 물건을 만들면서도 사람 대접을 받지 못했군요.','angry'),tLine('무신들의 권력 다툼 아래에서 특수 행정 구역의 주민도 변화를 요구했다.')],choice:true},
    {id:'ch09_revolt',year:1196,location:'명학소 봉기 기록',title:'일반 군현을 요구하다',art:'late-war',lines:[nLine('망이·망소이 세력은 명학소를 일반 군현으로 승격하라고 요구하며 1177년까지 저항을 이어 갔다.'),lLine('muyeong','배고픔만이 아니라 신분과 지역 차별까지 바꾸려 한 겁니다.','serious'),tLine('농민·천민의 봉기는 무신 정권기 사회 모순을 드러냈다.')],quiz:lQuiz('people','망이·망소이의 난',[lItem('망이·망소이가 봉기한 곳은?','공주 명학소',['개경 만월대','강화도','서경 묘청 진영'],'망이·망소이는 공주 명학소에서 봉기했습니다.',['망이·망소이','명학소']),lItem('망이·망소이 세력의 요구와 관련 깊은 것은?','특수 행정 구역 차별의 완화',['왕실과의 혼인 확대','원 연호 사용','별무반 해산'],'소 주민에 대한 차별과 수탈이 봉기의 배경이었습니다.',['소','신분 차별']),lItem('망이·망소이의 난이 일어난 시기는?','무신 정권기',['고려 건국 직후','원 간섭기','조선 후기'],'1176년 무신 정권기에 일어났습니다.',['1176년','무신 정권'])])},
    {id:'ch09_other_revolts',year:1196,location:'경상도 봉기 기록',title:'김사미와 효심',art:'late-market',lines:[nLine('김사미와 효심 등 농민 세력이 1193년부터 각지에서 봉기했다는 보고가 이어졌다.'),lLine('muyeong','권력자는 바뀌었지만 세금과 수탈은 그대로입니다.','worried'),tLine('무신 정권기의 저항은 한 지역이나 한 신분에만 머물지 않았다.')]},
    {id:'ch09_manjeok',year:1198,location:'개경 북산',title:'왕후장상의 씨',art:'late-night',lines:[nLine('최충헌의 사노비 만적은 노비들을 모아 신분 해방을 꾀했다.'),lLine('muyeong','이의민도 천민에서 최고 권력자가 됐는데, 왜 우리는 안 되느냐는 말이 퍼집니다.','serious'),tLine('계획은 발각됐지만 신분 질서에 대한 근본적 질문을 남겼다.')]},
    {id:'ch09_jinul',year:1200,location:'송광사',title:'마음을 닦고 함께 일하다',art:'late-temple',lines:[nLine('지눌은 수선사 결사를 이끌며 선종을 중심으로 교종과의 조화를 추구했다.'),lLine('muyeong','권력 다툼에서 벗어나 수행 공동체를 다시 세우려는 사람들이군요.','neutral'),tLine('지눌의 정혜쌍수와 돈오점수는 고려 후기 불교 개혁의 핵심이다.')],quiz:lQuiz('jinul','지눌과 불교 개혁',[lItem('수선사 결사를 이끈 승려는?','지눌',['의천','일연','혜초'],'지눌은 수선사 결사를 이끌었습니다.',['지눌','수선사 결사']),lItem('지눌이 강조한 수행 원리는?','정혜쌍수와 돈오점수',['교관겸수와 천태종','화쟁 사상과 일심','불립문자만의 수행'],'지눌은 정혜쌍수와 돈오점수를 강조했습니다.',['정혜쌍수','돈오점수']),lItem('지눌의 통합 방향은?','선종 중심으로 교종을 포용',['교종 중심으로 선종을 통합','유교 중심으로 불교를 폐지','밀교 중심으로 도교를 통합'],'지눌은 선종을 중심으로 교종을 조화시키려 했습니다.',['선종 중심','교선 통합'])])},
    {id:'ch09_economy',year:1200,location:'개경과 지방의 장시',title:'화폐보다 곡식',art:'late-market',lines:[nLine('고려에서는 관청 수공업과 소의 생산, 시장 교역이 이어졌고 은병·동전도 쓰였지만 곡식과 포가 널리 유통됐다.'),lLine('muyeong','돈이 있어도 어느 물건을 어디서 바꾸는지가 더 중요합니다.','smile'),tLine('경제 생활은 화폐 한 종류만으로 설명되지 않는다.')]},
    {id:'ch09_memory',year:1200,location:'개경 성밖',title:'칼 아래의 목소리',art:'late-city',lines:[tLine('무신 정변, 집권자의 교체, 최충헌, 망이·망소이, 만적.'),lLine('muyeong','권력을 잡은 칼보다, 아래에서 올라온 목소리가 더 오래 남을지도 모릅니다.','serious'),nLine('최씨 정권은 안정됐지만 바깥에서는 더 거대한 군대가 다가오고 있었다.')]},
    {id:'ch09_after',year:1231,location:'압록강 방면',title:'몽골이 온다',art:'late-ending',lines:[nLine('몽골군이 고려 국경을 넘어왔다.'),lLine('player','이번 전쟁은 한 번의 침입으로 끝나지 않을 것이다.','worried'),nLine('고려는 육지와 섬, 조정과 백성 사이에서 긴 항전을 시작했다.')],completeChapter:true}
  ]},
  ch10:{number:'10',title:'섬으로 간 나라',subtitle:'1231–1273년, 몽골 침입과 삼별초',years:'1231 — 1273',start:'ch10_first',complete:'ch10_after',protagonist:'harim',protagonistAge:24,beats:[
    {id:'ch10_first',year:1231,location:'북방 성곽',title:'몽골의 1차 침입',art:'late-war',lines:[nLine('살리타가 이끄는 몽골군이 고려를 침입했다.'),lLine('harim','기병이 지나간 자리마다 마을이 비었다고 합니다.','worried'),tLine('몽골과의 전쟁은 1231년부터 수십 년 동안 이어졌다.')]},
    {id:'ch10_cheoin',year:1232,location:'처인성',title:'승려가 쏜 화살',art:'late-border',cast:['kim_yunhu'],lines:[nLine('처인성에서 김윤후가 이끄는 주민들이 몽골군을 막았다.'),lLine('kim_yunhu','성 안의 사람 모두가 이 성의 군사다.','serious'),nLine('몽골 장수 살리타가 전사하며 몽골군은 물러났다.')]},
    {id:'ch10_people',year:1232,location:'처인성 안',title:'이름 없는 방어자들',art:'late-war',lines:[lLine('harim','정규군만 싸운 게 아니군요. 농민과 천민도 성벽을 지켰어요.','surprised'),tLine('몽골 항전의 주체에는 지방민과 천민도 있었다.'),lLine('kim_yunhu','신분보다 먼저 살아남아야 할 사람들이 있었다.','serious')],quiz:lQuiz('cheoin','처인성 전투',[lItem('처인성 전투에서 활약한 인물은?','김윤후',['강감찬','윤관','최충헌'],'김윤후와 처인성 주민들이 몽골군을 물리쳤습니다.',['김윤후','처인성']),lItem('처인성에서 전사한 몽골 지휘관은?','살리타',['소배압','소손녕','나하추'],'살리타가 처인성에서 전사했습니다.',['살리타','처인성']),lItem('처인성 전투의 특징으로 옳은 것은?','지방민과 천민이 항전에 참여했다',['왕이 직접 기병을 지휘했다','강화도 수군이 원정을 떠났다','삼별초가 제주에서 처음 조직됐다'],'처인성 항전에는 다양한 신분의 주민이 참여했습니다.',['민중 항전','신분'])])},
    {id:'ch10_ganghwa',year:1232,location:'강화도 나루',title:'바다를 건넌 조정',art:'late-water',lines:[nLine('최우는 수도를 강화도로 옮겨 장기 항전을 선택했다.'),lLine('harim','권력자와 군사는 섬으로 가지만, 육지의 사람들은 어디로 가죠?','angry'),tLine('강화도 천도는 몽골 기병을 피하는 전략이면서 백성에게 큰 부담을 남겼다.')],choice:true},
    {id:'ch10_island',year:1233,location:'강화도',title:'섬의 궁궐, 육지의 전쟁',art:'late-water',lines:[nLine('강화도에는 궁궐과 관청이 세워졌지만 몽골군은 육지를 계속 공격했다.'),lLine('player','조정이 버틴 시간과 백성이 치른 대가를 함께 봐야 한다.','serious'),lLine('harim','둘 중 하나만 기억하면 이 전쟁을 제대로 본 게 아니겠네요.','serious')],quiz:lQuiz('ganghwa','강화도 천도',[lItem('몽골 침입 때 강화도 천도를 주도한 무신 집권자는?','최우',['최충헌','이의민','정중부'],'최우가 1232년 강화도 천도를 주도했습니다.',['최우','강화도 천도']),lItem('강화도 천도의 군사적 이유는?','몽골 기병이 바다를 건너기 어려웠기 때문',['송과 육로로 연결하기 위해','왜구의 화포를 피하기 위해','여진에게 동북 9성을 돌려주기 위해'],'섬의 지형을 이용해 몽골 기병의 공격을 피하려 했습니다.',['섬','몽골 기병']),lItem('강화도 천도 뒤의 상황으로 옳은 것은?','조정은 섬에서 버티고 육지 백성은 계속 피해를 입었다',['전쟁이 즉시 끝났다','몽골이 고려에 강동 6주를 주었다','개경의 궁궐이 모두 보존됐다'],'천도 뒤에도 육지 전쟁과 백성의 피해는 계속됐습니다.',['장기 항전','민중 피해'])])},
    {id:'ch10_tripitaka',year:1237,location:'대장도감',title:'다시 새기는 경전',art:'late-temple',lines:[nLine('초조대장경이 불탄 뒤 고려는 몽골을 물리치려는 염원을 담아 재조대장경을 조판했다.'),lLine('harim','한 글자씩 새기는 일이 전쟁만큼 길겠군요.','surprised'),tLine('팔만대장경은 전쟁 속 신앙과 인쇄·목판 기술이 함께 남은 유산이다.')]},
    {id:'ch10_haeinsa',year:1251,location:'강화도 대장도감',title:'팔만여 장의 목판',art:'late-study',lines:[nLine('완성된 재조대장경판은 훗날 합천 해인사에 보관되었다.'),lLine('player','초조대장경은 거란, 재조대장경은 몽골. 침입 상대를 구분해야 한다.','thinking'),lLine('harim','전쟁이 끝나도 글자는 남겠네요.','smile')],quiz:lQuiz('tripitaka','팔만대장경',[lItem('몽골 침입기에 조판한 대장경은?','재조대장경(팔만대장경)',['초조대장경','교장','직지'],'재조대장경은 몽골 침입기에 조판했습니다.',['팔만대장경','몽골 침입']),lItem('팔만대장경판이 보관된 곳은?','합천 해인사',['순천 송광사','개성 성균관','서울 종묘'],'팔만대장경판은 합천 해인사에 보관돼 있습니다.',['해인사','대장경판']),lItem('대장경의 시기 연결로 옳은 것은?','초조대장경-거란, 재조대장경-몽골',['초조대장경-왜구, 재조대장경-여진','초조대장경-몽골, 재조대장경-거란','둘 다 원 간섭기 이후'],'초조대장경은 거란, 재조대장경은 몽골 침입과 연결됩니다.',['초조','재조','침입'])])},
    {id:'ch10_celadon',year:1251,location:'강진 가마터',title:'상감청자의 무늬',art:'late-market',lines:[nLine('고려 장인들은 흙을 파낸 자리에 다른 색 흙을 넣는 상감 기법으로 청자를 만들었다.'),lLine('harim','전쟁 중에도 가마의 불은 꺼지지 않았군요.','neutral'),tLine('고려청자의 상감 기법과 비색은 고려 문화의 대표 단서다.')]},
    {id:'ch10_fall',year:1258,location:'개경과 강화도',title:'최씨 정권의 끝',art:'late-night',lines:[nLine('김준 등이 최의를 제거하면서 최씨 무신 정권이 무너졌다.'),lLine('harim','전쟁을 핑계로 섬에 머물던 권력도 끝났습니다.','serious'),tLine('무신 정권의 붕괴는 몽골과 강화하고 개경으로 돌아가는 길을 열었다.')]},
    {id:'ch10_return',year:1270,location:'강화도 나루',title:'개경 환도',art:'late-water',lines:[nLine('고려 조정은 몽골과 강화를 맺고 개경으로 돌아가기로 했다.'),lLine('harim','서른여덟 해가 지났습니다. 저는 늙었는데 당신은 그대로군요.','worried'),lLine('player','……이번에도 설명할 수 없어.','worried')],quiz:lQuiz('return','무신 정권의 종말과 환도',[lItem('최씨 무신 정권이 무너진 해는?','1258년',['1170년','1232년','1270년'],'1258년 최의가 제거되며 최씨 정권이 무너졌습니다.',['1258년','최의']),lItem('고려 조정이 개경으로 환도한 해는?','1270년',['1231년','1251년','1356년'],'고려는 1270년 개경 환도를 단행했습니다.',['1270년','개경 환도']),lItem('개경 환도에 반발한 군사 조직은?','삼별초',['별무반','훈련도감','신기군'],'삼별초는 개경 환도와 대몽 강화를 거부하고 항쟁했습니다.',['삼별초','환도 반대'])])},
    {id:'ch10_sambyeolcho',year:1270,location:'진도 앞바다',title:'삼별초의 항쟁',art:'late-water',lines:[nLine('삼별초는 배중손을 중심으로 진도로 옮겨 항쟁했고 이후 제주까지 이동했다.'),lLine('harim','조정은 돌아갔지만 전쟁을 끝내지 않겠다는 사람들도 남았습니다.','serious'),tLine('삼별초의 이동은 강화도에서 진도, 제주 순이다.')]},
    {id:'ch10_jeju',year:1273,location:'제주 항파두리',title:'마지막 성',art:'late-border',lines:[nLine('제주로 옮긴 삼별초는 김통정의 지휘 아래 항전했으나 1273년 진압되었다.'),lLine('player','오랜 대몽 항쟁이 섬에서 끝났다.','serious'),nLine('고려는 전쟁 뒤 원의 강한 간섭 아래 놓이게 되었다.')],quiz:lQuiz('sambyeolcho','삼별초의 항쟁',[lItem('삼별초의 항쟁 이동 순서는?','강화도 → 진도 → 제주',['개경 → 서경 → 동경','제주 → 진도 → 강화도','강화도 → 개경 → 나주'],'삼별초는 강화도에서 진도, 제주로 이동했습니다.',['강화도','진도','제주']),lItem('진도에서 삼별초를 이끈 인물은?','배중손',['김통정','김윤후','최우'],'배중손이 진도에서 삼별초 항쟁을 이끌었습니다.',['배중손','진도']),lItem('제주에서 삼별초를 이끈 인물은?','김통정',['배중손','살리타','홍다구'],'김통정이 제주 항쟁을 이끌었습니다.',['김통정','제주'])])},
    {id:'ch10_memory',year:1273,location:'개경으로 돌아온 길',title:'섬에서 돌아온 나라',art:'late-city',lines:[tLine('처인성, 강화도 천도, 팔만대장경, 개경 환도, 삼별초.'),lLine('harim','돌아온 수도는 예전과 같아 보여도 나라의 자리는 달라졌습니다.','worried'),nLine('고려 왕실은 곧 원 황실과 혼인하고 원의 제도와 요구를 받아야 했다.')]},
    {id:'ch10_after',year:1273,location:'원의 사신이 든 궁궐',title:'왕이지만 왕이 아닌',art:'late-ending',lines:[nLine('항쟁이 끝난 뒤 왕의 이름과 관제까지 원의 영향 아래 바뀌기 시작했다.'),lLine('player','전쟁은 끝났지만 간섭은 이제 시작이다.','serious'),nLine('고려는 원 간섭기라는 새로운 시간을 통과해야 했다.')],completeChapter:true}
  ]},
  ch11:{number:'11',title:'왕이지만 왕이 아닌',subtitle:'원 간섭기와 공민왕의 개혁',years:'1270 — 1370',start:'ch11_yuan',complete:'ch11_after',protagonist:'arin',protagonistAge:25,beats:[
    {id:'ch11_yuan',year:1280,location:'개경 궁궐',title:'원의 부마국',art:'late-court',lines:[nLine('고려 왕은 원 황실의 공주와 혼인하고 원의 황제에게 왕의 지위를 인정받았다.'),lLine('arin','왕인데도 이름 앞에 충 자를 쓰고 원의 눈치를 봅니다.','worried'),tLine('왕실 혼인과 왕명·관제 격하는 원 간섭기의 대표 특징이다.')],quiz:lQuiz('yuan','원 간섭기의 왕실',[lItem('원 간섭기 고려 왕실의 특징은?','원 황실과 혼인 관계를 맺었다',['송 황실의 지방관이 되었다','일본 막부와 혼인했다','왕위를 완전히 폐지했다'],'고려 왕은 원 황실의 공주와 혼인하는 부마가 되었습니다.',['원 황실','부마국']),lItem('원 간섭기 왕의 이름에 자주 붙은 글자는?','충',['태','세','조'],'충렬왕·충선왕처럼 충 자가 붙은 왕호가 이어졌습니다.',['충렬왕','왕호']),lItem('원 간섭기에 나타난 변화는?','관제와 왕실 호칭이 격하되었다',['황제국 체제가 강화되었다','강동 6주를 새로 얻었다','무신 정변이 일어났다'],'원의 압력으로 고려의 관제와 호칭이 낮아졌습니다.',['관제 격하','원 간섭'])])},
    {id:'ch11_offices',year:1280,location:'정동행성',title:'고려 안의 원 기구',art:'late-city',lines:[nLine('원은 일본 원정을 준비하며 정동행성을 두었고, 그 이문소는 고려의 내정에 간섭했다.'),lLine('arin','고려 땅의 문서를 고려 관리만 결정하지 못하는군요.','serious'),tLine('정동행성 이문소는 원의 내정 간섭을 보여 주는 단서다.')]},
    {id:'ch11_land',year:1300,location:'권문세족의 농장',title:'산과 강을 삼킨 문서',art:'late-market',lines:[nLine('권문세족은 원과의 관계를 바탕으로 권력을 키우고 대농장과 노비를 늘렸다.'),lLine('arin','문서 한 장 때문에 자유민이 노비가 되고 마을 전체가 농장에 들어갑니다.','angry'),tLine('불법 토지 겸병과 노비 증가는 후기 사회 개혁의 핵심 문제가 되었다.')],quiz:lQuiz('kwonmun','권문세족',[lItem('원 간섭기에 성장한 지배 세력은?','권문세족',['호족','신진 무인 세력','6두품'],'권문세족은 원과의 관계, 고위 관직, 대농장을 기반으로 성장했습니다.',['권문세족','원 간섭기']),lItem('권문세족의 경제 기반은?','대규모 농장과 많은 노비',['녹읍 없는 월급','과전법의 수신전만 보유','상평통보 유통'],'권문세족은 불법 토지 겸병으로 대농장을 확대했습니다.',['대농장','노비']),lItem('권문세족과 대립하며 성장한 세력은?','신진 사대부',['문벌 귀족','진골 귀족','후백제 호족'],'신진 사대부는 성리학을 수용하고 권문세족의 폐단을 비판했습니다.',['신진 사대부','성리학'])])},
    {id:'ch11_culture',year:1305,location:'개경의 인쇄 공방',title:'쇠로 찍은 글자',art:'late-study',lines:[nLine('고려에서는 금속 활자 인쇄가 발달해 글자를 골라 다시 쓰는 기술이 이어졌다.'),lLine('arin','나무판 전체를 새기지 않고 필요한 글자를 다시 쓸 수 있군요.','surprised'),tLine('이 기술은 훗날 1377년 청주 흥덕사에서 간행된 직지로 이어진다.')]},
    {id:'ch11_gongmin',year:1351,location:'개경 궁궐',title:'공민왕의 선택',art:'late-court',cast:['gongmin'],lines:[nLine('원 세력이 약해지자 공민왕은 원의 간섭과 권문세족의 폐단을 함께 개혁하려 했다.'),lLine('gongmin','원의 제도와 이름을 버리고 고려의 자리를 되찾겠다.','serious'),lLine('arin','밖의 간섭과 안의 기득권을 동시에 건드리는 개혁이군요.','serious')],choice:true},
    {id:'ch11_imunso',year:1356,location:'개경 관청',title:'정동행성 이문소를 없애다',art:'late-court',lines:[nLine('공민왕은 정동행성 이문소를 폐지하고 원의 연호 사용과 관제를 고쳤다.'),lLine('player','이름을 되찾는 일은 실제 내정 권한을 되찾는 일과 이어진다.','serious'),lLine('gongmin','문서의 마지막 결재가 고려 안에서 끝나야 한다.','serious')],quiz:lQuiz('anti_yuan','공민왕의 반원 개혁',[lItem('정동행성 이문소를 폐지한 왕은?','공민왕',['충렬왕','의종','성종'],'공민왕은 정동행성 이문소를 폐지했습니다.',['공민왕','이문소 폐지']),lItem('공민왕의 반원 정책으로 옳은 것은?','원의 연호와 관제를 고쳤다',['몽골풍을 더 강화했다','원 황실과 첫 혼인을 맺었다','쌍성총관부를 원에 설치해 주었다'],'공민왕은 원의 영향에서 벗어나 관제와 호칭을 복구했습니다.',['반원 정책','관제 복구']),lItem('공민왕 개혁의 대외적 배경은?','원의 세력이 약해졌다',['송이 고려를 병합했다','몽골 제국이 처음 성립했다','거란이 강동 6주를 반환했다'],'14세기 중반 원의 쇠퇴가 반원 개혁의 기회가 됐습니다.',['원 쇠퇴','14세기'])])},
    {id:'ch11_ssangseong',year:1356,location:'동북면',title:'쌍성총관부 수복',art:'late-border',lines:[nLine('공민왕은 유인우와 이자춘 등의 활약으로 쌍성총관부를 공격해 철령 이북의 영토를 회복했다.'),lLine('arin','원에게 빼앗긴 지 거의 백 년 만이라고 합니다.','surprised'),tLine('쌍성총관부 수복은 공민왕 반원 개혁의 영토 회복 성과다.')]},
    {id:'ch11_north',year:1356,location:'수복된 동북면',title:'되찾은 땅의 사람들',art:'late-border',lines:[nLine('이자춘과 그의 아들 이성계는 동북면에서 고려 편에 섰다.'),lLine('player','훗날 왕조를 바꿀 인물이 이 영토 수복 과정에서 모습을 드러낸다.','thinking'),lLine('arin','지금은 공민왕의 장수일 뿐이지만요.','neutral')],quiz:lQuiz('ssangseong','쌍성총관부 수복',[lItem('공민왕 때 수복한 원의 지배 기구는?','쌍성총관부',['동녕부','탐라총관부','정동행성 이문소'],'공민왕은 1356년 쌍성총관부를 공격해 영토를 회복했습니다.',['쌍성총관부','1356년']),lItem('쌍성총관부 수복에 협력한 인물은?','이자춘',['이자겸','정중부','김사미'],'이자춘이 고려에 협력해 동북면 수복에 기여했습니다.',['이자춘','동북면']),lItem('쌍성총관부 수복의 의미는?','원에게 빼앗긴 철령 이북 영토를 회복했다',['강동 6주를 처음 확보했다','제주에서 삼별초를 진압했다','동북 9성을 여진에 반환했다'],'원에 빼앗겼던 동북 지역을 되찾은 반원 정책의 성과입니다.',['영토 회복','반원'])])},
    {id:'ch11_sindon',year:1366,location:'전민변정도감',title:'빼앗긴 땅과 사람',art:'late-study',cast:['sindon'],lines:[nLine('공민왕은 신돈을 등용해 전민변정도감을 설치했다.'),lLine('sindon','빼앗은 토지는 본래 주인에게 돌리고, 억울하게 노비가 된 사람은 양인으로 되돌린다.','serious'),lLine('arin','권문세족의 힘을 뿌리부터 줄이려는 일이군요.','serious')]},
    {id:'ch11_reform',year:1366,location:'토지 문서 심사장',title:'문서를 다시 묻다',art:'late-market',lines:[nLine('전민변정도감은 불법으로 빼앗긴 토지와 노비 문제를 바로잡으려 했다.'),lLine('player','광종의 노비안검법과 닮아 보이지만 대상과 시대가 다르다.','thinking'),lLine('arin','이번에는 권문세족이 빼앗은 전민을 되찾는 개혁입니다.','serious')],quiz:lQuiz('jeonmin','신돈과 전민변정도감',[lItem('공민왕이 전민변정도감 운영을 맡긴 인물은?','신돈',['쌍기','최승로','묘청'],'공민왕은 신돈을 등용해 개혁을 추진했습니다.',['신돈','공민왕']),lItem('전민변정도감의 목적은?','불법 토지와 노비 문제를 바로잡는 것',['과거제를 처음 시행하는 것','강동 6주에 성을 쌓는 것','무신의 품계를 높이는 것'],'권문세족이 빼앗은 토지와 불법 노비를 바로잡으려 했습니다.',['전민변정도감','토지·노비']),lItem('전민변정도감이 견제하려 한 세력은?','권문세족',['지방 호족','무신 정변 세력만','신라 진골'],'권문세족의 경제 기반을 약화하는 개혁이었습니다.',['권문세족','개혁'])])},
    {id:'ch11_limits',year:1366,location:'개경 궁궐',title:'개혁을 둘러싼 벽',art:'late-night',lines:[nLine('노국 대장공주가 세상을 떠난 뒤 공민왕의 정치는 흔들렸고 신돈의 개혁도 반발에 부딪혔다.'),lLine('arin','제도를 만들었다고 오래된 권력이 바로 사라지지는 않네요.','worried'),tLine('공민왕의 개혁은 중요한 성과와 분명한 한계를 함께 남겼다.')]},
    {id:'ch11_history',year:1370,location:'개경 서고',title:'삼국유사와 제왕운기',art:'late-study',lines:[nLine('서고에는 원 간섭 초기에 나온 일연의 삼국유사와 이승휴의 제왕운기가 남아 있었다. 두 책은 단군을 우리 역사의 시작으로 서술했다.'),lLine('arin','나라가 흔들릴 때 오래된 역사의 뿌리를 다시 적었군요.','neutral'),tLine('두 책은 민족의 역사 의식을 보여 주는 고려 후기의 기록이다.')]},
    {id:'ch11_memory',year:1370,location:'개경 거리',title:'되찾으려 한 나라',art:'late-city',lines:[tLine('정동행성 이문소 폐지, 쌍성총관부 수복, 신돈과 전민변정도감.'),lLine('arin','개혁은 끝나지 않았고 왜구와 홍건적의 침입도 계속됩니다.','worried'),nLine('전쟁에서 성장한 새 무장과 성리학을 배운 신진 사대부가 다음 권력의 주역이 되었다.')]},
    {id:'ch11_after',year:1388,location:'요동 정벌군의 길',title:'압록강 앞에서',art:'late-ending',lines:[nLine('최영의 요동 정벌 명령을 받은 군대가 위화도에 도착했다.'),lLine('player','고려의 마지막을 결정할 선택이 강 한가운데서 내려진다.','serious'),nLine('이성계는 군대를 돌릴 것인지 명령을 따를 것인지 판단해야 했다.')],completeChapter:true}
  ]},
  ch12:{number:'12',title:'고려의 마지막',subtitle:'1388–1392년, 위화도 회군과 새 왕조',years:'1388 — 1392',start:'ch12_wihwa',complete:'ch12_after',protagonist:'junseo',protagonistAge:24,beats:[
    {id:'ch12_wihwa',year:1388,location:'위화도',title:'비가 내리는 섬',art:'late-water',cast:['yi_seonggye'],lines:[nLine('장마와 보급 문제 속에서 요동 정벌군이 위화도에 머물렀고, 이 선택은 위화도 회군으로 이어졌다.'),lLine('yi_seonggye','작은 나라가 큰 나라를 거스르는 일, 여름 출병, 왜구가 빈틈을 치는 일, 장마철 활이 상하는 일을 헤아려야 한다.','serious'),tLine('이성계는 이른바 4불가론을 들어 회군을 결정했다.')],quiz:lQuiz('wihwa','위화도 회군',[lItem('위화도 회군이 일어난 해는?','1388년',['1356년','1377년','1392년'],'위화도 회군은 1388년에 일어났습니다.',['1388년','위화도 회군']),lItem('요동 정벌을 추진한 인물은?','최영',['서희','김부식','최충헌'],'최영과 우왕이 요동 정벌을 추진했습니다.',['최영','요동 정벌']),lItem('위화도에서 군대를 돌린 인물은?','이성계',['정몽주','신돈','김윤후'],'이성계가 위화도에서 회군했습니다.',['이성계','회군'])])},
    {id:'ch12_return',year:1388,location:'개경 성문',title:'돌아온 군대',art:'late-war',cast:['yi_seonggye','choe_yeong'],lines:[nLine('회군한 이성계 세력은 개경을 장악하고 최영을 제거했다.'),lLine('choe_yeong','왕명을 거스른 군대가 나라의 주인이 되려 하는가.','serious'),lLine('junseo','전쟁을 피한 선택이 곧 권력 교체가 됐습니다.','worried')]},
    {id:'ch12_newpower',year:1388,location:'개경 관청',title:'신진 사대부의 두 길',art:'late-court',lines:[nLine('성리학을 배운 신진 사대부는 권문세족의 폐단을 비판했지만 개혁의 방향을 두고 갈라졌다.'),lLine('junseo','고려 안에서 고치자는 사람과 새 왕조가 필요하다는 사람이 나뉩니다.','serious'),tLine('정몽주와 정도전의 차이는 같은 신진 사대부 안의 선택이었다.')],quiz:lQuiz('sadaebu','신진 사대부',[lItem('신진 사대부가 주로 수용한 학문은?','성리학',['훈고학','양명학','실학'],'신진 사대부는 원에서 성리학을 수용해 개혁 논리를 세웠습니다.',['신진 사대부','성리학']),lItem('신진 사대부의 성장 배경으로 옳은 것은?','과거를 통해 관직에 진출했다',['음서만으로 세습했다','삼별초 군사로 성장했다','원 황실 공주와 혼인했다'],'신진 사대부는 지방 향리 출신 등이 과거를 통해 진출했습니다.',['과거','향리']),lItem('고려 왕조를 유지하며 개혁하려 한 인물은?','정몽주',['정도전','조준','이방원'],'정몽주는 고려 왕조 안에서의 개혁을 지향한 온건파로 분류됩니다.',['정몽주','온건파'])])},
    {id:'ch12_land',year:1391,location:'토지 문서 창고',title:'불타는 토지 문서',art:'late-study',lines:[nLine('조준 등은 권문세족의 토지 기반을 개혁하기 위해 과전법을 추진했다.'),lLine('junseo','기존 토지 문서를 불태우니 권력의 장부도 함께 사라지는군요.','surprised'),tLine('과전법은 경기 지방의 토지를 기준으로 새 관료의 경제 기반을 마련했다.')]},
    {id:'ch12_gwajeon',year:1391,location:'경기 들판',title:'새 권력의 토지',art:'late-market',lines:[nLine('과전법 시행으로 신진 사대부의 경제 기반이 강화되고 권문세족의 대농장은 타격을 받았다.'),lLine('player','왕조가 바뀌기 전에 경제 기반부터 바뀌었다.','serious'),lLine('junseo','정치의 주인이 바뀌는 일이 논밭의 문서에서 시작된 셈입니다.','serious')],quiz:lQuiz('gwajeon','과전법',[lItem('1391년 과전법 시행을 주장한 인물은?','조준',['쌍기','최승로','만적'],'조준 등 급진파 신진 사대부가 과전법을 추진했습니다.',['조준','과전법']),lItem('과전법이 지급 대상으로 삼은 지역은?','경기 지방의 토지',['전국의 모든 산과 바다','제주도의 목장만','강동 6주'],'과전법은 경기 지방의 토지를 전·현직 관리에게 지급했습니다.',['경기 지방','과전법']),lItem('과전법의 정치적 효과는?','신진 사대부의 경제 기반을 강화했다',['권문세족의 대농장을 확대했다','무신 정권을 부활시켰다','원 간섭을 강화했다'],'과전법은 새 관료층의 경제 기반을 마련했습니다.',['신진 사대부','경제 기반'])])},
    {id:'ch12_jikji',year:1391,location:'개경 서고',title:'직지가 남긴 증거',art:'late-study',lines:[nLine('서고에는 1377년 청주 흥덕사에서 금속 활자로 인쇄한 직지의 소식이 기록되어 있었다.'),lLine('junseo','나라가 끝나도 그 나라가 만든 기술과 책은 남습니다.','neutral'),tLine('고려의 마지막을 정치 사건만으로 기억하지 않는다.')]},
    {id:'ch12_poeun',year:1392,location:'개경 선죽교로 가는 길',title:'돌아오지 않을 사람',art:'late-night',cast:['jeong_mongju'],lines:[lLine('jeong_mongju','나라를 고칠 수는 있어도, 섬기던 왕조를 버릴 수는 없다.','serious'),nLine('정몽주는 고려 왕조를 지키려 했고 이성계 세력과 대립했다.'),lLine('junseo','같은 개혁 세력에서 시작했지만 마지막 선택은 달랐군요.','worried')]},
    {id:'ch12_bridge',year:1392,location:'선죽교',title:'선죽교의 밤',art:'late-night',lines:[nLine('정몽주는 이방원 쪽 세력에게 피살되었다.'),lLine('player','새 왕조를 막을 정치적 중심이 사라졌다.','serious'),lLine('junseo','한 사람의 죽음이 고려의 남은 시간을 더 짧게 만들었어요.','worried')],quiz:lQuiz('jeong','정몽주와 고려 말',[lItem('고려 왕조를 지키려다 선죽교에서 피살된 인물은?','정몽주',['정도전','조준','이방원'],'정몽주는 고려를 지키려다 선죽교에서 피살됐습니다.',['정몽주','선죽교']),lItem('정몽주의 정치적 입장으로 적절한 것은?','고려 왕조 안에서 개혁을 추진했다',['즉시 새 왕조를 세우려 했다','무신 정권을 부활시켰다','원 간섭을 회복하려 했다'],'정몽주는 온건파 신진 사대부로 고려 왕조 유지를 지향했습니다.',['온건파','고려 유지']),lItem('정몽주 제거 뒤의 흐름은?','이성계의 조선 건국이 이어졌다',['거란 3차 침입이 일어났다','삼별초가 제주로 이동했다','최씨 정권이 시작됐다'],'정몽주 피살 뒤 이성계 세력이 조선을 건국했습니다.',['1392년','조선 건국'])])},
    {id:'ch12_abdication',year:1392,location:'개경 궁궐',title:'마지막 왕의 자리',art:'late-court',lines:[nLine('공양왕이 폐위되고 고려 왕조의 왕위가 끝났다.'),lLine('junseo','474년을 이어 온 나라가 오늘 문서 한 장과 빈 어좌로 끝나는군요.','worried'),tLine('918년 왕건이 세운 고려는 1392년 막을 내렸다.')]},
    {id:'ch12_founding',year:1392,location:'새 왕조의 조정',title:'조선 건국',art:'late-city',cast:['yi_seonggye'],lines:[nLine('이성계가 왕위에 올라 새 왕조를 세웠다.'),lLine('yi_seonggye','낡은 질서를 거두고 새 나라의 기틀을 세운다.','serious'),tLine('1392년 조선 건국. 수도 한양 천도와 국가 체제 정비는 다음 이야기다.')],quiz:lQuiz('founding','고려 멸망과 조선 건국',[lItem('고려가 멸망하고 조선이 건국된 해는?','1392년',['918년','936년','1388년'],'1392년 고려가 멸망하고 조선이 건국됐습니다.',['1392년','조선 건국']),lItem('조선을 건국한 인물은?','이성계',['왕건','최영','정몽주'],'이성계가 왕위에 올라 조선을 건국했습니다.',['이성계','조선']),lItem('조선 건국 직전 폐위된 고려의 마지막 왕은?','공양왕',['우왕','창왕','충렬왕'],'공양왕이 폐위되며 고려 왕조가 끝났습니다.',['공양왕','고려 마지막 왕'])])},
    {id:'ch12_918',year:1392,location:'개경 장터 옛터',title:'처음 눈을 뜬 자리',art:'late-market',lines:[nLine('나는 918년 도윤을 처음 만났던 장터 자리에 섰다.'),lLine('player','도윤, 네가 보지 못한 세월까지 고려는 오래 버텼어.','worried'),nLine('사람도 가게도 모두 바뀌었지만 길의 굽이는 기억 속 그대로였다.')]},
    {id:'ch12_faces',year:1392,location:'기억의 길',title:'늙어 간 사람들',art:'late-water',lines:[nLine('도윤, 연, 하림과 수많은 사람은 나이를 먹고 떠났다.'),lLine('player','왜 나만 그대로인지 아직도 모른다. 하지만 그들이 겪은 시간을 잊지는 않겠다.','serious'),nLine('비노화의 답은 남았고, 고려의 이야기는 끝났다.')]},
    {id:'ch12_memory',year:1392,location:'개경의 새벽',title:'고려 474년',art:'late-ending',lines:[tLine('918 고려 건국에서 1392 고려 멸망까지.'),lLine('junseo','이제 사람들은 새 나라의 이름을 입에 올립니다. 조선.','neutral'),lLine('player','나라가 달라져도 살아가는 사람들의 기억은 이어질 거야.','serious')]},
    {id:'ch12_teaser',year:1394,location:'한양으로 향하는 길',title:'다음 시대의 문',art:'late-city',lines:[nLine('새 왕조는 도읍을 한양으로 옮길 준비를 시작했다.'),lLine('player','고려에서 배운 장면들을 안고, 다음 시대를 걷는다.','serious'),nLine('다음 이야기 · 눈떠보니 조선')],continueLabel:'고려의 마지막 장을 닫는다'},
    {id:'ch12_after',year:1394,location:'한양으로 향하는 길',title:'끝과 시작 사이',art:'late-ending',lines:[nLine('고려의 474년이 나의 기억 속에 한 시대가 되었다.'),lLine('player','도윤이 처음 건넨 평민복은 오래전에 닳았지만, 그날의 약속은 남아 있다.','worried'),nLine('조선에서 비노화의 비밀은 다시 움직이기 시작할 것이다.')],completeChapter:true}
  ]}
};

// Major events use dedicated art; quieter travel, market, court, and study scenes keep reusable backgrounds.
const LATE_DEDICATED_SCENES={
  ch05_seohui:'ch05-seohui-negotiation',ch06_gaegyeong:'ch06-gaegyeong-rebuild',ch06_rebuild:'ch06-gaegyeong-rebuild',
  ch07_gwiju:'ch07-gwiju-battlefield',ch08_revolt:'ch08-seogyeong-rebellion',ch09_bongsa:'ch09-choe-regime',
  ch10_people:'ch10-cheoin-fortress',ch11_north:'ch11-ssangseong-recovery',ch12_wihwa:'ch12-wihwado-rain'
};

const LATE_INSERTS={
  ch05:[
    ['ch05_seohui',{id:'ch05_terms',year:993,location:'거란 진영 · 담판 직후',title:'말로 바꾼 조건',art:'ch05-seohui-negotiation',timeOfDay:'dawn',weather:'cold',lines:[nLine('서희는 고려가 고구려를 계승했다는 점과 여진이 길을 막았다는 현실을 한 논리로 묶었다.'),lLine('seohui','송과의 관계만 끊으라는 요구가 영토를 내주라는 뜻일 수는 없소. 길을 열 땅이 필요하오.','serious'),lLine('yeon','전쟁을 멈추는 말이 오히려 국경을 앞으로 밀어 냈군요.','surprised'),tLine('서희의 담판은 단순한 철군 약속이 아니라 강동 지역 확보의 근거가 되었다.')]},
    ],
    ['ch05_six',{id:'ch05_builders',year:994,location:'강동 6주 · 성벽 공사장',title:'지도 위의 선을 성으로',art:'late-border',timeOfDay:'afternoon',weather:'windy',lines:[nLine('군사와 백성은 새로 확보한 지역에 흙을 다지고 목책을 세웠다.'),lLine('yeon','담판에서 얻은 땅도 사람이 살고 길을 지켜야 우리 땅이 되는군요.','serious'),lLine('player','강동 6주는 서희의 말과 이 사람들의 노동이 함께 만든 결과야.','serious'),nLine('외교의 성과는 압록강 동쪽의 실제 방어 거점으로 굳어졌다.')]}]
  ],
  ch06:[
    ['ch06_gaegyeong',{id:'ch06_burned_market',year:1011,location:'불탄 개경 장터',title:'왕이 떠난 뒤 남은 사람들',art:'ch06-gaegyeong-rebuild',timeOfDay:'dawn',weather:'smoke',lines:[nLine('무너진 지붕 사이에서 사람들은 물독을 나르고 가족의 이름을 불렀다.'),lLine('yeon','수도가 함락됐다는 한 줄 뒤에는 집을 다시 세워야 하는 사람이 이렇게 많습니다.','worried'),lLine('player','현종의 피난과 백성의 피해를 같은 장면으로 기억해야 해.','serious'),nLine('전쟁은 조정의 이동과 평범한 사람의 상실을 동시에 남겼다.')]},
    ],
    ['ch06_rebuild',{id:'ch06_woodblocks',year:1012,location:'개경 인근 사찰 작업장',title:'한 글자씩 다시 세우다',art:'ch06-gaegyeong-rebuild',timeOfDay:'morning',weather:'clear',lines:[nLine('장인은 고른 나무판에 경전의 글자를 거꾸로 새기기 시작했다.'),lLine('yeon','칼이 지나간 자리에 글자를 새기는군요.','neutral'),lLine('player','거란 침입 때의 초조대장경. 몽골 침입 때의 재조대장경과 구분하자.','thinking'),nLine('재건의 기억은 성벽뿐 아니라 대장경 조판에도 남았다.')]}]
  ],
  ch07:[
    ['ch07_gwiju',{id:'ch07_retreat',year:1019,location:'귀주 · 거란군 퇴로',title:'승리 뒤에 열린 길',art:'ch07-gwiju-battlefield',timeOfDay:'afternoon',weather:'clearing',lines:[nLine('패한 거란군이 북쪽으로 물러나자 얼어붙었던 길에 고려의 깃발이 다시 섰다.'),lLine('yeon','이제야 수레가 북쪽으로 갈 수 있겠어요.','smile'),lLine('ganggamchan','싸움은 끝났지만 방비를 늦추면 오늘의 승리가 내일의 방심이 된다.','serious'),tLine('귀주대첩은 전투의 승리이자 고려·거란·송 사이 질서가 안정되는 계기였다.')]},
    ],
    ['ch07_special',{id:'ch07_nine_fortresses',year:1107,location:'동북면 · 새 성 아래',title:'동북 9성의 무게',art:'late-border',timeOfDay:'sunset',weather:'windy',lines:[nLine('별무반은 여진을 몰아내고 동북 9성을 쌓았지만, 먼 성을 지키는 부담도 커졌다.'),lLine('yoon_gwan','성을 얻는 일과 오래 지키는 일은 다르다.','serious'),lLine('player','결국 9성은 여진에게 돌려주지만, 별무반과 윤관의 정벌은 남아.','thinking'),nLine('영토의 확대와 유지 비용을 함께 보아야 사건의 끝이 보였다.')]}]
  ],
  ch08:[
    ['ch08_rebellion',{id:'ch08_palace_ashes',year:1126,location:'개경 궁성 밖',title:'혼인이 불태운 궁궐',art:'late-night',timeOfDay:'night',weather:'smoke',lines:[nLine('궁궐에서 번진 불빛을 보며 백성들은 왕과 외척의 싸움이 언제 끝날지 몰랐다.'),lLine('seon','왕실과 혼인해 커진 권력이 왕실을 위협하고 있어요.','worried'),lLine('player','이자겸의 난은 문벌 귀족 사회의 모순이 폭발한 사건이야.','serious'),nLine('척준경이 돌아서며 난은 끝났지만 개경의 상처는 남았다.')]},
    ],
    ['ch08_revolt',{id:'ch08_divided_city',year:1135,location:'서경 · 닫힌 시장',title:'천도 논쟁이 전쟁이 되다',art:'ch08-seogyeong-rebellion',timeOfDay:'afternoon',weather:'overcast',lines:[nLine('대위국의 깃발 아래 시장 문이 닫히고 성 밖에는 김부식의 관군이 모였다.'),lLine('seon','개경과 서경 중 어디가 옳은지 다투던 일이 이제 사람들의 생사를 가릅니다.','worried'),lLine('player','묘청의 서경 천도 운동과 묘청의 난을 이어 보되, 같은 말로 뭉개지 말자.','thinking'),nLine('정치 노선의 충돌은 서경 백성이 견뎌야 할 포위전으로 바뀌었다.')]}]
  ],
  ch09:[
    ['ch09_bongsa',{id:'ch09_documents',year:1196,location:'교정도감 뜰',title:'칼 옆의 인사 문서',art:'ch09-choe-regime',timeOfDay:'dusk',weather:'clear',lines:[nLine('교정도감의 문서와 사병의 창이 한 뜰에 놓였다.'),lLine('muyeong','왕의 관청이 있는데도 여기에서 나라의 일이 결정되는군요.','angry'),lLine('choe_chungheon','질서를 세우려면 권한이 한곳에 모여야 한다.','serious'),tLine('최씨 정권은 교정도감과 도방을 통해 정치와 군사를 장악했다.')]},
    ],
    ['ch09_people',{id:'ch09_whisper',year:1198,location:'개경 북산의 밤길',title:'노비들이 나눈 말',art:'late-night',timeOfDay:'night',weather:'clear',lines:[nLine('만적과 노비들은 신분의 굴레를 끊을 계획을 낮은 목소리로 나눴다.'),lLine('muyeong','왕후장상의 씨가 따로 있느냐는 말이 사람들 사이를 돕니다.','serious'),lLine('player','무신 집권은 지배층만 바꾼 일이 아니야. 아래에서 신분 해방 요구도 터져 나왔어.','thinking'),nLine('계획은 실패했지만 만적의 외침은 고려의 신분 질서가 흔들리고 있음을 보여 주었다.')]}]
  ],
  ch10:[
    ['ch10_people',{id:'ch10_wall',year:1232,location:'처인성 성벽',title:'누가 성을 지켰는가',art:'ch10-cheoin-fortress',timeOfDay:'late-afternoon',weather:'dusty',lines:[nLine('군현의 정규군만이 아니라 농민과 천민까지 돌과 화살을 날랐다.'),lLine('harim','역사책의 승리 한 줄에 이 사람들의 신분은 잘 보이지 않겠지요.','worried'),lLine('kim_yunhu','오늘 성 위에서는 누구의 집안인지보다 누가 끝까지 서 있는지가 중요하다.','serious'),tLine('처인성 승리는 김윤후와 지역 주민의 공동 항전으로 기억해야 한다.')]},
    ],
    ['ch10_island',{id:'ch10_mainland',year:1235,location:'강화도 건너 육지 마을',title:'섬 밖에서 치른 값',art:'late-war',timeOfDay:'sunset',weather:'smoke',lines:[nLine('강화도 조정은 바다를 방패로 삼았지만 몽골군은 육지의 마을을 계속 짓밟았다.'),lLine('harim','조정이 버틴 시간만큼 육지 사람들의 피난도 길어집니다.','worried'),lLine('player','강화 천도를 항전의 전략으로만 외우면 이 피해를 놓쳐.','serious'),nLine('대몽 항쟁은 장기 저항의 성과와 백성의 희생을 함께 남겼다.')]}]
  ],
  ch11:[
    ['ch11_yuan',{id:'ch11_customs',year:1280,location:'개경 큰길',title:'거리까지 내려온 원의 풍속',art:'late-city',timeOfDay:'afternoon',weather:'clear',lines:[nLine('관료와 귀족 사이에서 변발과 호복이 유행하고 몽골식 이름이 낯설지 않게 들렸다.'),lLine('arin','왕실의 혼인과 관제 격하가 거리의 옷차림까지 바꾸었어요.','worried'),lLine('player','원 간섭기는 정치 제도와 생활 풍속이 함께 변한 시기야.','thinking'),nLine('간섭은 궁궐 안 문서에만 머물지 않았다.')]},
    ],
    ['ch11_north',{id:'ch11_returning',year:1356,location:'수복된 동북면 성문',title:'돌아오는 수레',art:'ch11-ssangseong-recovery',timeOfDay:'morning',weather:'clear',lines:[nLine('원의 관리가 물러난 성문으로 피란했던 가족과 장터 수레가 조심스럽게 돌아왔다.'),lLine('arin','땅을 되찾았다는 말이 사람들에게는 집으로 돌아가는 길이군요.','smile'),lLine('player','쌍성총관부 수복은 반원 정책이면서 실제 영토 회복이었어.','serious'),nLine('이 과정에서 이자춘과 이성계 같은 동북면 세력도 고려 정치에 가까워졌다.')]}]
  ],
  ch12:[
    ['ch12_wihwa',{id:'ch12_supplies',year:1388,location:'위화도 · 젖은 군량 창고',title:'진군할 수 없는 밤',art:'ch12-wihwado-rain',timeOfDay:'night',weather:'heavy-rain',lines:[nLine('장맛비에 군량은 젖고 병사들은 탈영 소식을 숨기지 못했다.'),lLine('junseo','요동보다 먼저 이 진영이 무너지겠습니다.','worried'),lLine('yi_seonggye','명분만으로 강을 건널 수는 없다. 군사와 백성을 모두 잃을 수 있다.','serious'),tLine('4불가론은 외교 명분뿐 아니라 계절·왜구·군사 현실을 함께 따진 판단이었다.')]},
    ],
    ['ch12_abdication',{id:'ch12_registry',year:1392,location:'개경 관청의 빈 서고',title:'고려라는 이름을 접다',art:'late-study',timeOfDay:'night',weather:'clear',lines:[nLine('관리들은 고려의 마지막 문서를 묶고 새 왕조의 장부를 펼쳤다.'),lLine('junseo','나라의 끝은 북소리보다 장부의 제목이 바뀌는 순간에 더 선명하군요.','worried'),lLine('player','918년에 시작한 이름이 1392년에 여기서 닫힌다.','serious'),nLine('왕조의 교체는 궁궐뿐 아니라 세금·토지·사람을 기록하는 모든 문서에 닿았다.')]}]
  ]
};

for(const [chapterId,blueprint] of Object.entries(LATE_CHAPTER_BLUEPRINTS)){
  for(const beat of blueprint.beats){
    if(LATE_DEDICATED_SCENES[beat.id])beat.art=LATE_DEDICATED_SCENES[beat.id];
    beat.timeOfDay=beat.timeOfDay||(/night|밤|불타/.test(`${beat.id} ${beat.location}`)?'night':/after|memory|기억/.test(`${beat.id} ${beat.location}`)?'dawn':'day');
    beat.weather=beat.weather||(/water|island|wihwa/.test(`${beat.art} ${beat.id}`)?'river-mist':'clear');
  }
  for(const [afterId,newBeat] of LATE_INSERTS[chapterId]||[]){
    const index=blueprint.beats.findIndex(beat=>beat.id===afterId);
    if(index>=0)blueprint.beats.splice(index+1,0,newBeat);
  }
}

// Identity and age are separate: changing ageState never changes MAIN/SUPPORTING scale.
const lateExpressionMap=(prefix)=>Object.fromEntries(['neutral','smile','serious','worried','surprised','angry','thinking'].map(expression=>[expression,`${prefix}_${expression}`]));
for(const expression of Object.keys(lateExpressionMap('yeon_middle')))PORTRAITS[`yeon_middle_${expression}`]=portrait('yeon',expression,`연 · 중년 ${expression}`,['#303b43','#8e7255'],`assets/characters/hyunwoo_middle_${['neutral','serious','smile','thinking'].includes(expression)?expression:'neutral'}.png`);
for(const expression of Object.keys(lateExpressionMap('harim_older')))PORTRAITS[`harim_older_${expression}`]=portrait('harim',expression,`하림 · 노년 ${expression}`,['#303b43','#8e7255'],'assets/characters/villager_old_01.png');
CHARACTER_ASSET_MAP.yeon={defaultAge:'young_993',ages:{young_993:{defaultOutfit:'traveler',outfits:{traveler:lateExpressionMap('yeon')}},mature_1009:{defaultOutfit:'traveler',outfits:{traveler:lateExpressionMap('yeon_middle')}},older_1018:{defaultOutfit:'traveler',outfits:{traveler:lateExpressionMap('yeon_middle')}}}};
CHARACTER_ASSET_MAP.harim={defaultAge:'adult_1231',ages:{adult_1231:{defaultOutfit:'commoner',outfits:{commoner:lateExpressionMap('harim')}},older_1270:{defaultOutfit:'commoner',outfits:{commoner:lateExpressionMap('harim_older')}}}};

const lateAgeState=(id,age,year)=>{
  if(id==='yeon')return year>=1018?'older_1018':year>=1009?'mature_1009':'young_993';
  if(id==='harim')return year>=1260?'older_1270':'adult_1231';
  if(age>=60)return'elderly';if(age>=45)return'older';if(age>=32)return'mature';return'adult';
};
const lateCardSource='https://contents.history.go.kr/';
const lateQuestionIdsByChapter={};
const lateQuestionSetsByChapter={};
const lateCards=[];
const latePeopleByChapter={};

for(const [chapterId,blueprint] of Object.entries(LATE_CHAPTER_BLUEPRINTS)){
  Object.assign(CHAPTERS[chapterId],{
    chapterId,episode:'goryeo',number:blueprint.number,title:blueprint.title,subtitle:blueprint.subtitle,years:blueprint.years,
    thumbnail:ASSETS[blueprint.beats[0].art].src,startStoryId:blueprint.start,completeStoryId:blueprint.complete,implemented:true
  });
  const chapterQuestionIds=lateQuestionIdsByChapter[chapterId]=[];
  const chapterSetIds=lateQuestionSetsByChapter[chapterId]=[];
  const people=latePeopleByChapter[chapterId]=new Set([lateCharacterNames[blueprint.protagonist]]);
  const startYear=blueprint.beats[0].year;
  blueprint.beats.forEach((beat,index)=>{
    const next=blueprint.beats[index+1]?.id||null;
    const age=Math.max(blueprint.protagonistAge,blueprint.protagonistAge+Math.max(0,beat.year-startYear));
    const visibleCharacters=[...new Set((beat.lines||[]).filter(line=>['npc','player'].includes(line.speakerType)).map(line=>line.characterId).filter(id=>CHARACTERS[id]?.show!==false&&CHARACTERS[id]?.presentation!=='ambient'))];
    for(const id of visibleCharacters)if(lateCharacterNames[id])people.add(lateCharacterNames[id]);
    const story=scene({sceneId:beat.id,chapterId,year:beat.year,location:beat.location,title:beat.title,illustrationId:beat.art,backgroundImage:ASSETS[beat.art].src,timeOfDay:beat.timeOfDay,weather:beat.weather,ambientSound:beat.ambientSound||null,
      historicalEventId:`${chapterId}-${beat.id.replace(`${chapterId}_`,'')}`,dialogues:beat.lines,nextStoryId:next,completeChapter:Boolean(beat.completeChapter),continueLabel:beat.continueLabel,
      visibleCharacters,sceneType:visibleCharacters.length?'dialogue':beat.lines?.some(line=>line.speakerType==='thought')?'thought':'narration',
      enterCharacterStates:{player:{characterAge:23,ageState:'unchanged',ageVariant:'unchanged',outfit:'goryeo_commoner'},[blueprint.protagonist]:{characterAge:age,ageState:lateAgeState(blueprint.protagonist,age,beat.year),ageVariant:lateAgeState(blueprint.protagonist,age,beat.year),variant:'normal',pose:'standing',outfit:blueprint.protagonist==='yeon'?'traveler':'commoner'}}
    });
    if(beat.choice){
      story.choices=[
        choice('사람들의 안전을 먼저 확인한다',next,{knowledge:1},{citizens:2},'눈앞의 삶을 먼저 살피기로 했다.',{
          importantChoice:`${chapterId}-people-first`,resultSceneId:`${beat.id}-people-first`,resultIllustrationId:beat.art,
          resultDialogues:[lLine('player','역사의 큰 흐름 속에서도 먼저 사람을 보자.','serious'),lLine(blueprint.protagonist,'그 선택은 기록보다 오래 기억될 겁니다.','neutral'),nLine('선택은 역사적 결과를 바꾸지 않지만, 그 시간을 바라보는 태도로 남았다.')]
        }),
        choice('상황을 기록해 다음 판단에 대비한다',next,{knowledge:2},{citizens:1},'보고 들은 단서를 차분히 기록했다.',{
          importantChoice:`${chapterId}-record-first`,resultSceneId:`${beat.id}-record-first`,resultIllustrationId:beat.art,
          resultDialogues:[lLine('player','다음 장면에서 같은 실수를 반복하지 않도록 적어 두자.','serious'),lLine(blueprint.protagonist,'그 기록이 누군가에게 길이 되겠지요.','smile'),nLine('선택은 역사적 결과를 바꾸지 않지만, 기억을 남기는 방식이 되었다.')]
        })
      ];
    }
    if(beat.quiz){
      const cardId=`${chapterId}-card-${beat.quiz.key}`;
      const keywords=[...new Set(beat.quiz.items.flatMap(item=>item.keywords||[]))];
      const card={id:cardId,chapterId,year:beat.year,title:beat.quiz.title,body:beat.quiz.items.map(item=>item.explanation).join(' '),keywords,source:lateCardSource};
      lateCards.push(card);
      story.historyCard=card;
      story.historyDiscovery={people:[...people],cards:[cardId],historicalEvents:[`${chapterId}-${beat.quiz.key}`]};
      const ids=beat.quiz.items.map((item,itemIndex)=>{
        const questionId=`${chapterId}-practice-${beat.quiz.key}-${String(itemIndex+1).padStart(2,'0')}`;
        const raw=[item.answer,...item.distractors];
        const offset=(index+itemIndex)%raw.length,choices=[...raw.slice(offset),...raw.slice(0,offset)],answer=choices.indexOf(item.answer);
        const q=question({questionId,chapterId,year:beat.year,relatedSceneId:beat.id,relatedHistoricalEventId:`${chapterId}-${beat.quiz.key}`,historicalEventId:`${chapterId}-${beat.quiz.key}`,historicalEvent:beat.quiz.title,relatedIllustrationId:beat.art,
          questionType:'사료·개념 연결형',formatLabel:'[심화 연습]',difficulty:itemIndex===2?'상':'중상',passage:`${beat.year}년 무렵, 플레이어가 ‘${beat.title}’ 장면에서 얻은 단서를 바탕으로 판단하시오.`,question:item.question,choices,answer,
          explanation:item.explanation,choiceExplanations:choices.map(choiceText=>choiceText===item.answer?item.explanation:`이 장면의 핵심인 ‘${item.answer}’와 연결되지 않습니다.`),examKeywords:item.keywords,concepts:item.keywords,conceptIds:item.keywords,
          gameMemory:`‘${beat.title}’ 장면에서 ${item.explanation}`,memoryPrompt:`${beat.title}에서 본 단서를 떠올린다`,rewardKnowledge:2,resumeStoryId:next,
          sourceType:'original_advanced_practice',sourceVerified:false,sourceStatus:'self_authored_from_verified_history',questionAuditStatus:'SELF_AUTHORED_ADVANCED_PRACTICE',examType:'[심화 연습] · 한능검 심화 대비',examName:'한능검 심화 대비',examRound:null,examYear:null,questionNumber:null,source:LATE_GORYEO_SOURCE_NOTE,sourceReference:lateCardSource,isOfficial:false,requiresOriginalImage:false,assetStatus:'not_required_text_only',reviewOnly:false,retired:false,chapterCandidate:chapterId,historicalEventIds:[`${chapterId}-${beat.quiz.key}`]
        });
        QUESTIONS.push(q);chapterQuestionIds.push(questionId);return questionId;
      });
      const poolId=`pool-${chapterId}-${beat.quiz.key}`,setId=`${chapterId}-${beat.quiz.key}`;
      QUESTION_POOLS[poolId]={questionPoolId:poolId,chapterId,conceptIds:keywords,questionIds:[...ids],sourceType:'original_advanced_practice'};
      QUESTION_SETS[setId]={questionSetId:setId,chapterId,afterSceneId:beat.id,resumeStoryId:next,questionPoolId:poolId,conceptIds:keywords,requiredCount:3,officialQuestionIds:[],practiceQuestionIds:[...ids],verifiedCount:0,practiceCount:3,missingQuestionCount:0,status:'ready',sourceType:'original_advanced_practice'};
      Object.assign(story,{questionSetId:setId,questionSetStatus:'ready',questionSetResumeStoryId:next,linkedQuestionIds:[...ids],linkedPracticeQuestionIds:[...ids],questionSequenceMode:'queue',practiceQuestionSlot:{conceptIds:keywords,linkedPracticeQuestions:[...ids],requiredCount:3,practiceCount:3,status:'ready'}});
      chapterSetIds.push(setId);
    }
    STORIES[beat.id]=story;
  });
  SPLIT_STORY_QUESTION_IDS[chapterId]=[...chapterQuestionIds];
  SPLIT_REVIEW_IDS[chapterId]=[...chapterQuestionIds];
  Object.assign(CHAPTERS[chapterId],{questionCount:chapterQuestionIds.length,reviewQuestionCount:chapterQuestionIds.length,questionSetCount:chapterSetIds.length});
}
CH01_HISTORY_CARDS.push(...lateCards);

// Refresh chapter links after CH.05–12 became playable.
const lateChapterOrder=Object.values(CHAPTERS).sort((a,b)=>Number(a.number)-Number(b.number));
lateChapterOrder.forEach((info,index)=>Object.assign(info,{order:index+1,previousChapterId:lateChapterOrder[index-1]?.chapterId||null,nextChapterId:lateChapterOrder[index+1]?.chapterId||null}));
for(const key of Object.keys(CONCEPT_QUESTION_INDEX))delete CONCEPT_QUESTION_INDEX[key];
for(const q of QUESTIONS.filter(item=>!item.retired))for(const conceptId of q.conceptIds||[])(CONCEPT_QUESTION_INDEX[conceptId]||(CONCEPT_QUESTION_INDEX[conceptId]=[])).push(q.questionId);

const prepareBeforeLateGoryeo=prepareChapterCarry;
prepareChapterCarry=function(run,chapterId){
  prepareBeforeLateGoryeo(run,chapterId);
  if(!LATE_CHAPTER_BLUEPRINTS[chapterId]||!run)return run;
  ensureGoryeoOutfit(run);
  const blueprint=LATE_CHAPTER_BLUEPRINTS[chapterId],id=blueprint.protagonist,age=blueprint.protagonistAge,ageState=lateAgeState(id,age,Number(blueprint.years.slice(0,4)));
  run.characterStates={...(run.characterStates||{}),player:{...(run.characterStates?.player||{}),characterAge:23,ageState:'unchanged',ageVariant:'unchanged',outfit:'goryeo_commoner'},doyun:{...(run.characterStates?.doyun||{}),isAlive:false},[id]:{...(run.characterStates?.[id]||{}),characterAge:age,ageState,ageVariant:ageState,variant:'normal',pose:'standing',outfit:id==='yeon'?'traveler':'commoner'}};
  return run;
};

const finishBeforeLateGoryeo=finishChapter;
finishChapter=function(state){
  const chapterId=state.run.currentChapter;
  finishBeforeLateGoryeo(state);
  if(!LATE_CHAPTER_BLUEPRINTS[chapterId])return state;
  const add=(list,value)=>{if(!list.includes(value))list.push(value)};
  for(const id of lateQuestionSetsByChapter[chapterId])add(state.meta.historicalEvents,id);
  for(const card of lateCards.filter(card=>card.chapterId===chapterId))add(state.meta.cards,card.id);
  for(const name of latePeopleByChapter[chapterId])add(state.meta.people,name);
  add(state.meta.achievements,`${chapterId}-witness`);add(state.meta.endings,`${chapterId}-complete`);
  state.run.characterStates.doyun={...(state.run.characterStates.doyun||{}),isAlive:false};
  return state;
};

const migrateBeforeLateGoryeo=migrateSave;
migrateSave=function(raw){
  const migrated=migrateBeforeLateGoryeo(raw),repair=run=>{
    if(!run)return;
    run.characterStates={...(run.characterStates||{}),player:{...(run.characterStates?.player||{}),characterAge:23,ageState:'unchanged',ageVariant:'unchanged'}};
    if(Number(run.currentChapter?.slice(2))>=5)run.characterStates.doyun={...(run.characterStates.doyun||{}),isAlive:false};
  };
  repair(migrated.run);repair(migrated.mainRun);
  for(const record of Object.values(migrated.meta?.chapterRecords||{})){repair(record?.finalRun);repair(record?.firstRun?.finalRun);repair(record?.latestRun?.finalRun)}
  migrated.version=SAVE_VERSION;return migrated;
};

const LATE_GORYEO_REPORT=Object.fromEntries(Object.keys(LATE_CHAPTER_BLUEPRINTS).map(chapterId=>[chapterId,{
  scenes:LATE_CHAPTER_BLUEPRINTS[chapterId].beats.length,
  dialogues:LATE_CHAPTER_BLUEPRINTS[chapterId].beats.reduce((sum,beat)=>sum+(beat.lines?.length||0),0),
  questionSets:lateQuestionSetsByChapter[chapterId].length,
  questions:lateQuestionIdsByChapter[chapterId].length
}]));
