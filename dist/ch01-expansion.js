/* CH.01 918–943. The completed prologue and first encounter are left intact. */
const CH01_SOURCES={
  chronology:'https://contents.history.go.kr/mobile/kc/view.do?levelId=kc_n206200',
  unification:'https://contents.history.go.kr/mobile/kc/view.do?code=kc_age_10&levelId=kc_i101800',
  policy:'https://contents.history.go.kr/front/ta/view.do?levelId=ta_h61_0050_0020_0010',
  regional:'https://contents.history.go.kr/mobile/hm/view.do?levelId=hm_046_0030',
  refugees:'https://contents.history.go.kr/mobile/hm/view.do?levelId=hm_045_0020',
  hunyo:'https://contents.history.go.kr/front/tg/view.do?ganada=&levelId=tg_002_0990&pageUnit=10&treeId=0200'
};
const CH01_HISTORY_CARDS=[
  {id:'goryeo-foundation-918',year:918,title:'고려 건국',body:'궁예를 축출한 세력이 왕건을 추대하여 고려가 출범했다. 신라와 후백제는 여전히 존재했다.',keywords:['918','궁예 → 왕건','후삼국'],source:CH01_SOURCES.chronology},
  {id:'ch01-gongsan',year:927,title:'공산 전투',body:'후백제의 신라 공격으로 경애왕이 죽었다. 신라를 돕던 왕건은 공산에서 패했고 신숭겸이 전사했다.',keywords:['927','왕건 패배','신숭겸'],source:CH01_SOURCES.chronology},
  {id:'ch01-gochang',year:930,title:'고창 전투',body:'왕건은 고창에서 후백제군을 격파했다. 지역 세력의 협력과 함께 고려 쪽으로 전세가 기울었다.',keywords:['930','왕건 승리','공산과 구분'],source:CH01_SOURCES.chronology},
  {id:'ch01-gyeonhwon',year:935,title:'견훤의 고려 귀순',body:'신검에게 밀려 금산사에 갇힌 견훤이 탈출하여 고려로 왔다. 후백제를 세운 아버지와 왕위를 차지한 아들을 구분한다.',keywords:['견훤','신검','금산사'],source:CH01_SOURCES.unification},
  {id:'ch01-silla',year:935,title:'경순왕 김부의 귀순',body:'신라 경순왕 김부가 나라를 고려에 넘겼다. 왕건은 김부를 우대하고 경주의 사심관으로 삼았다.',keywords:['경순왕 김부','신라 항복','사심관'],source:CH01_SOURCES.regional},
  {id:'ch01-illyecheon',year:936,title:'일리천과 후삼국 통일',body:'견훤이 고려 편에 선 가운데 왕건이 신검의 군대를 이겼다. 후백제가 멸망하고 후삼국 통일이 이루어졌다.',keywords:['936','왕건 vs 신검','후삼국 통일'],source:CH01_SOURCES.unification},
  {id:'ch01-integration',year:'태조 재위',title:'혼인과 호족 포섭',body:'태조는 혼인 관계와 우대를 통해 지방 호족을 끌어안았다. 통일 뒤에도 지방 세력과 협력하고 견제해야 했다.',keywords:['혼인 정책','호족 포섭','통합'],source:CH01_SOURCES.policy},
  {id:'ch01-sasimgwan',year:'태조 재위',title:'사심관',body:'출신 지역의 연고를 가진 유력자에게 그 지역을 감독하게 했다. 경순왕 김부와 경주의 연결이 대표적인 학습 단서다.',keywords:['김부 → 경주','연고 지역 감독','지방 통제'],source:CH01_SOURCES.regional},
  {id:'ch01-giin',year:'태조 재위',title:'기인',body:'지방 호족의 자제를 수도에 머물게 하여 지방 사정의 자문을 얻고 호족을 견제했다. 사심관과는 사람을 활용하는 방식이 다르다.',keywords:['호족 자제','수도 체류','자문·견제'],source:CH01_SOURCES.regional},
  {id:'ch01-north',year:'태조 재위',title:'발해 유민과 북진',body:'태조는 발해 유민을 받아들이고 고구려 계승을 표방했다. 옛 고구려의 중심지인 평양을 서경으로 중시하며 북진을 추진했다.',keywords:['발해 유민','고구려 계승','서경·북진'],source:CH01_SOURCES.refugees},
  {id:'ch01-welfare',year:'태조 재위',title:'민생 안정',body:'태조는 취민유도를 내세워 과도한 수취를 억제했다. 왕조의 기반에는 전쟁에서 살아남은 백성의 생업도 필요했다.',keywords:['취민유도','수취 억제','민생 안정'],source:CH01_SOURCES.policy},
  {id:'ch01-hunyo',year:943,title:'태조의 죽음과 훈요 10조',body:'태조는 943년에 사망했다. 후대 왕에게 남긴 훈요 10조에는 불교와 전통 의례, 서경 중시, 민생과 통치에 대한 당부가 담겼다.',keywords:['943','후대 왕의 지침','서경·연등회·팔관회'],source:CH01_SOURCES.hunyo}
];
CHARACTER_ASSET_MAP.doyun.ages.mature_935={defaultOutfit:'commoner',outfits:{commoner:DOYUN_949_PORTRAITS}};
CHARACTER_ASSET_MAP.doyun.ages.middle_943={defaultOutfit:'commoner',outfits:{commoner:DOYUN_949_PORTRAITS}};
const ch01Age=year=>({characterAge:24+year-918,ageVariant:year>=943?'middle_943':year>=935?'mature_935':'young',characterEraVariant:year>=935?'middle-merchant':'young-merchant',outfit:'commoner',isAlive:true});
const ch01Lines=rows=>rows.map(([who,expression,text,type])=>dialogueLine(who,expression,text,type));
function ch01Scene(id,year,title,art,rows,extra={}){
  const card=CH01_HISTORY_CARDS.find(item=>item.id===extra.cardId);
  const visitorNames={ch01_gongsan:'부상당한 상인',ch01_gochang:'고창 거래 상인',ch01_silla:'신라 출신 상인',ch01_refugee_family:'발해계 손님',ch01_victory:'전령'};
  const dialogues=ch01Lines(rows).map(line=>line.characterId==='merchant'&&visitorNames[id]?{...line,characterName:visitorNames[id]}:line);
  return scene({sceneId:id,year,title,location:extra.location||'개경 인근 · 도윤과 나',illustrationId:art,backgroundImage:ASSETS[art].src,dialogues:ch01Lines(rows),
    fictionNotice:'도윤·주인공·거래 일행의 이야기는 창작입니다.',stageCast:true,
    enterCharacterStates:{doyun:ch01Age(year),player:{characterAge:23,characterEraVariant:'unchanged',outfit:'goryeo_commoner'}},
    ...(card?{historicalEventId:card.id,historyCard:{title:card.title,body:card.body},historyDiscovery:{people:card.id==='ch01-gongsan'?['경애왕','신숭겸']:card.id==='ch01-silla'?['경순왕 김부']:card.id==='ch01-gyeonhwon'?['견훤','신검']:[],cards:[card.id],historicalEvents:[card.id]}}:{}),...extra,dialogues});
}
const CH01_NEW_SCENES=[
  ch01Scene('ch01_trade_start',918,'밥값부터 시작하는 장사','route-caravan',[
    ['doyun','neutral','갈 곳도 없다면서.'],['player','worried','……응.'],['doyun','serious','그럼 밥값이라도 하시오.'],['player','surprised','뭘 하면 되는데?'],['doyun','neutral','짐 나르고, 물건 팔고. 지금 하는 일이 있으면 함께 하면 되오.'],['player','worried','나 장사해본 적 없는데.'],['doyun','smile','나도 제대로 해본 적 없소.'],['player','surprised','…….'],['doyun','surprised','왜 그런 눈으로 보시오?'],['player','smile','아니. 잘해보자고.'],['narrator','neutral','서툰 두 사람은 작은 짐부터 함께 옮기기 시작했다.','narration']
  ],{location:'송악으로 가는 길목',nextStoryId:'ch01_jump_927',sharedEvent:'ch01_trade_partners'}),
  ch01Scene('ch01_jump_927',927,'아홉 해가 흘렀다','route-songak',[
    ['narrator','neutral','927년 — 고려에 온 지 아홉 해','narration'],['narrator','neutral','수레와 장부를 함께 붙들던 시간이 쌓였다. 몇 군데 거래처는 생겼지만, 큰 손실 한 번이면 흔들릴 작은 장사였다.','narration'],['player','thinking','처음에는 하루만 버티려고 했는데. 이제는 내일 받을 짐을 걱정하고 있었다.','thought']
  ],{nextStoryId:'ch01_missing_traders'}),
  ch01Scene('ch01_missing_traders',927,'돌아오지 않는 사람','route-caravan',[
    ['doyun','worried','늦네.'],['player','neutral','누가?'],['doyun','worried','남쪽으로 간 사람들이오. 약속한 날이 사흘이나 지났소.'],['player','worried','비 때문에 길이 막힌 거 아닐까?'],['doyun','serious','그랬으면 누구라도 소식을 보냈겠지.'],['narrator','neutral','도윤은 비워 둔 장부 칸을 덮지 못했다. 곡식값보다 사람들의 이름이 먼저 적힌 칸이었다.','narration']
  ],{nextStoryId:'ch01_gongsan'}),
  ch01Scene('ch01_gongsan',927,'공산에서 온 소식','thief-aftermath',[
    ['narrator','neutral','며칠 뒤, 다친 상인이 빈 수레를 끌고 돌아왔다.','narration'],['merchant','serious','후백제가 신라의 왕경까지 공격했소. 경애왕께서 돌아가셨다 하오.'],['player','surprised','왕까지……?'],['merchant','serious','왕건 임금이 신라를 도우러 나섰지만 공산에서 고려군이 크게 패했소. 신숭겸 장군도 전사했다더군.'],['doyun','worried','함께 갔던 사람들은?'],['merchant','serious','길에서 흩어졌소. 나는 돌아오지 못한 이들의 소식도 모르오.'],['player','thinking','신숭겸. 공산 전투. 분명 외웠던 이름인데. 여기서는 누군가의 죽음이었다.','thought'],['narrator','neutral','짐과 외상값은 사라졌고, 다음 거래 약속을 하던 목소리도 사라졌다.','narration']
  ],{cardId:'ch01-gongsan',quizId:'ch01-story-gongsan',enterStatChanges:{wealth:-7}}),
  ch01Scene('ch01_conflict',927,'잃을 것이 없다는 말','goryeo-house',[
    ['player','worried','다시 하면 되잖아.'],['doyun','serious','말은 쉽소.'],['player','serious','돈 좀 잃었다고 끝난 건 아니잖아.'],['doyun','serious','자네는 잃을 것이 없으니 그런 말을 하는 것이오.'],['narrator','neutral','대답이 끊겼다. 내가 함께 쌓은 아홉 해까지 지워진 것 같았다.','narration'],['player','worried','……잠깐 나갔다 올게.']
  ],{nextStoryId:'ch01_conflict_night'}),
  ch01Scene('ch01_conflict_night',927,'내가 화난 이유','route-songak',[
    ['narrator','neutral','밤. 익숙해진 길이 오늘은 낯설었다.','narration'],['player','thinking','나는 왜 화가 났을까. 틀린 말도 아니었는데.','thought'],['player','thinking','아니. 나도 잃을 게 생겼어. 이곳의 일, 함께 먹던 밥, 도윤과의 약속.','thought'],['player','thinking','돈만 잃은 게 아니라는 걸 먼저 들어줬어야 했는데.','thought']
  ],{timeOfDay:'night',nextStoryId:'ch01_reconcile'}),
  ch01Scene('ch01_reconcile',927,'다시 같은 편','goryeo-house',[
    ['doyun','worried','어제는 내가 심했소.'],['player','worried','나도. 돈만 생각하고 말했어.'],['doyun','neutral','같이 걱정해 준 사람에게 할 말은 아니었지.'],['player','neutral','다시 할 수 있는 일부터 찾자.'],['doyun','smile','그런데 돈을 잃은 건 정말 자네 때문이오.'],['player','surprised','야.'],['doyun','smile','농담이오.'],['player','smile','그 농담은 비싸게 받을 거야.'],['narrator','neutral','사라진 사람들의 몫을 잊지 않으면서, 둘은 장부의 다음 칸을 함께 열었다.','narration']
  ],{nextStoryId:'ch01_jump_930',sharedEvent:'ch01_first_reconciliation',enterRelationChanges:{doyun:2}}),
  ch01Scene('ch01_jump_930',930,'다시 시작','route-caravan',[
    ['narrator','neutral','930년 — 고창으로 이어지는 거래길','narration'],['narrator','neutral','몇 해 동안 작은 거래를 모아 다시 수레를 채웠다. 서두르지 않고 돌아올 수 있는 길을 골랐다.','narration'],['doyun','worried','또 전쟁이오. 고창 쪽 거래가 걸려 있소.'],['player','serious','이번에는 다를 수도 있어.'],['doyun','surprised','어떻게 아시오?'],['player','embarrassed','……그냥 느낌.'],['player','thinking','기억만으로 이 사람의 삶을 걸 수는 없어. 소식부터 확인하자.','thought']
  ],{nextStoryId:'ch01_gochang'}),
  ch01Scene('ch01_gochang',930,'이번에는 승리','route-context',[
    ['merchant','surprised','고창에서 왕건 임금의 군대가 후백제군을 크게 이겼소!'],['doyun','surprised','짐을 보낼 길도 다시 열리겠군.'],['merchant','neutral','고창의 지역 세력도 고려군을 도왔다 하오. 고려로 돌아서는 고을이 늘고 있소.'],['player','thinking','927년 공산은 패배. 930년 고창은 승리. 비슷한 이름인데, 사람들의 표정은 정반대였다.','thought']
  ],{cardId:'ch01-gochang',quizId:'ch01-story-gochang'}),
  ch01Scene('ch01_belonging',930,'우리가 이겼다는 말','route-songak',[
    ['doyun','smile','이번에는 우리가 이겼군.'],['player','surprised','우리가?'],['doyun','neutral','십 년 넘게 여기 살았으면 고려 사람 아니오?'],['player','neutral','…….'],['doyun','smile','수레 밀 때만 남의 나라 사람인 척하지 마시오.'],['player','smile','알았어. 내가 앞에서 끌게.'],['player','thinking','돌아갈 곳을 찾는 동안, 함께 살아갈 자리가 조금씩 생기고 있었다.','thought']
  ],{nextStoryId:'ch01_jump_935'}),
  ch01Scene('ch01_jump_935',935,'익숙해진 장부','ch02-doyun-shop-interior-949',[
    ['narrator','neutral','935년 — 둘의 장사는 조금 안정되었다.','narration'],['narrator','neutral','도윤은 주름이 늘었고, 거래 장부의 내 글씨는 더 익숙해졌다. 빌린 창고 한쪽이 우리의 물건으로 채워졌다.','narration'],['doyun','serious','그 자루는 남쪽으로 보낼 것이오. 섞지 마시오.'],['player','smile','아직도 날 초보 취급하네.'],['doyun','smile','처음 섞은 걸 기억하고 있으니 그렇지.']
  ],{nextStoryId:'ch01_gyeonhwon'}),
  ch01Scene('ch01_gyeonhwon',935,'적이 아군이 되다','ch02-doyun-shop-interior-949',[
    ['merchant','surprised','견훤이 고려로 왔답니다!'],['doyun','surprised','……누가 왔다고?'],['merchant','surprised','견훤 말입니다!'],['player','surprised','잠깐. 후백제를 세운 그 견훤?'],['merchant','serious','아들 신검에게 밀려 금산사에 갇혔다가 탈출했다 하오. 왕건 임금에게 귀순했다니 참…….'],['player','serious','자기가 만든 나라를 공격하게 생겼네.'],['doyun','neutral','인생이라는 게 참 모르는 일이오.'],['player','neutral','그건 인정.'],['player','thinking','견훤은 고려로. 후백제에는 신검. 이제 둘을 같은 편으로 기억하면 안 돼.','thought']
  ],{cardId:'ch01-gyeonhwon',quizId:'ch01-story-gyeonhwon'}),
  ch01Scene('ch01_silla',935,'신라의 마지막','ch02-doyun-shop-interior-949',[
    ['narrator','neutral','그해 늦가을, 신라 출신 거래 상인이 찾아왔다.','narration'],['doyun','worried','무슨 일이오?'],['merchant','serious','……우리 왕께서 나라를 고려에 넘기기로 하셨소. 경순왕 김부께서 말이오.'],['player','surprised','싸워서 빼앗긴 게 아니라……?'],['merchant','serious','더 싸우면 백성만 다친다 하셨소. 왕건 임금은 우리 왕을 우대한다 하오.'],['player','thinking','신라. 수백 년을 이어온 나라의 마지막을 이 사람은 자기 일로 말하고 있었다.','thought'],['doyun','neutral','오늘 묵을 곳은 있소? 거래 이야기는 내일 합시다.'],['player','thinking','사람을 죽이는 대신 자기편으로 만드는 선택. 나중에도 이 장면을 기억해야겠다.','thought']
  ],{cardId:'ch01-silla',quizId:'ch01-story-silla'}),
  ch01Scene('ch01_jump_936',936,'마지막 전쟁 앞에서','route-caravan',[
    ['narrator','neutral','936년 — 후백제와의 마지막 전쟁이 다가왔다.','narration'],['doyun','serious','견훤은 고려 편이고, 후백제군은 신검이 이끌고 있소.'],['player','serious','이번에는 놓고 갈 사람까지 먼저 확인하자.'],['doyun','neutral','칼을 드는 일은 군사들이 할 것이오. 우리는 살아갈 것을 준비합시다.']
  ],{nextStoryId:'ch01_war_choice'}),
  ch01Scene('ch01_war_choice',936,'평범한 사람의 몫','route-caravan',[
    ['doyun','serious','곡식과 천을 챙기려면 손이 필요하오.'],['player','worried','길이 끊기면 피난 오는 사람들도 곤란하겠네.'],['doyun','neutral','어디서 돕든, 소식을 놓치지 말고 다시 만납시다.']
  ],{choices:[
    choice('도윤과 함께 물자를 준비한다','ch01_war_supply',{wealth:3,health:-3},{doyun:5},'곡식 자루에 행선지를 적고 도윤과 함께 수레를 꾸렸다.',{importantChoice:'supplies',responseText:'이번에는 함께 장부를 맞춥시다.',resultSceneId:'ch01-war-supplies-result',resultIllustrationId:'route-caravan'}),
    choice('안전한 길목에서 전쟁 소식을 확인한다','ch01_war_news',{knowledge:2},{merchant:3},'전투에 들어가지 않고 오가는 전령의 소식을 거래 일행에게 전했다.',{importantChoice:'news',responseText:'소문과 확인된 소식은 구분하시오.',resultSceneId:'ch01-war-news-result',resultIllustrationId:'route-context'}),
    choice('개경에 남아 피난민을 돕는다','ch01_war_refugees',{wealth:-2},{citizens:5},'물과 먹을 것을 나누고 흩어진 가족들의 이름을 적었다.',{importantChoice:'refugees',responseText:'돌아올 자리를 마련하는 일도 필요하오.',resultSceneId:'ch01-war-refugees-result',resultIllustrationId:'route-village'})
  ]}),
  ch01Scene('ch01_war_supply',936,'돌아올 수레의 자리','route-caravan',[
    ['doyun','serious','나눠 실어야 하오. 한 수레에 전부 걸지 맙시다.'],['player','neutral','927년에 배운 거네.'],['doyun','worried','그때 이름을 적지 못한 사람들까지 기억해야지.'],['player','serious','이번 장부에는 돌아올 사람도 적을게.']
  ],{nextStoryId:'ch01_victory'}),
  ch01Scene('ch01_war_news',936,'소문과 소식 사이','route-context',[
    ['merchant','serious','승리했다는 말도 있고, 길이 막혔다는 말도 있소.'],['player','serious','누가 직접 확인했대? 확인된 것부터 전하자.'],['narrator','neutral','전투의 승패를 바꾸지는 못했다. 그래도 확인되지 않은 소문에 수레를 보내는 일은 막을 수 있었다.','narration'],['player','thinking','도윤에게도 무사하다고 먼저 전해야지.','thought']
  ],{nextStoryId:'ch01_victory'}),
  ch01Scene('ch01_war_refugees',936,'머물 수 있는 자리','route-village',[
    ['merchant','serious','집을 떠나오느라 짐도 놓고 왔소.'],['player','worried','일단 물부터 마셔. 찾는 사람이 있으면 이름도 적어줘.'],['doyun','neutral','곡식 한 자루는 여기 두고 가겠소.'],['player','smile','돈만 제대로 내면 손님이라며.'],['doyun','serious','오늘은 손님이 아니라 사람이 먼저지.']
  ],{nextStoryId:'ch01_victory'}),
  ch01Scene('ch01_victory',936,'끝났다는 소식','route-songak',[
    ['merchant','surprised','일리천에서 왕건 임금이 신검의 군대를 이겼습니다! 후백제군이 무너졌습니다!'],['merchant','surprised','신검이 항복했습니다!'],['doyun','surprised','그러면…….'],['player','neutral','끝난 거야.'],['player','thinking','견훤이 고려에 오고, 신라가 나라를 넘기고, 마지막으로 신검의 후백제가 무너졌다.','thought'],['narrator','neutral','우리는 전쟁의 영웅이 아니었다. 서로의 이름을 부를 사람이 남아 있다는 것이 먼저 기뻤다.','narration']
  ],{cardId:'ch01-illyecheon',nextStoryId:'ch01_unity'}),
  ch01Scene('ch01_unity',936,'후삼국 통일','future-flow',[
    ['narrator','neutral','936년','narration'],['narrator','neutral','후삼국 통일','narration']
  ],{sceneEffect:'blackout',cinematicSub:'전쟁이 끝났다. 우리가 살아갈 날은 계속된다.',continueLabel:'살아온 순서를 떠올린다',nextStoryId:'future_flow'}),
  ch01Scene('ch01_integration',937,'나라가 하나 된 다음','ch02-doyun-shop-interior-949',[
    ['player','smile','이제 전쟁도 끝났으니까 좀 조용해지겠네.'],['doyun','serious','나라가 하나 됐다고 일이 끝나는 줄 아시오?'],['merchant','serious','우리 고장 호족의 허락도 받아야 거래가 되오.'],['player','surprised','왕이 있어도 고장마다 힘센 사람이 따로 있구나.'],['doyun','neutral','임금도 그들과 혼인을 맺고 손을 잡아 왔소.'],['player','thinking','고려를 세우고 넓히던 포섭이 통일 뒤에도 나라를 묶는 일이 되는구나.','thought']
  ],{cardId:'ch01-integration',nextStoryId:'ch01_sasimgwan'}),
  ch01Scene('ch01_sasimgwan',937,'김부와 경주를 잇는 이름','route-context',[
    ['merchant','neutral','김부께서 경주의 사심관이 되셨다 하오. 경주 사람들의 사정을 아는 분이니.'],['player','surprised','그 김부? 신라의 마지막 왕?'],['doyun','neutral','자기 고장에 연고가 있는 사람을 통해 살피는 것이오.'],['player','thinking','아…… 그래서 김부를 이렇게 활용한 거구나. 죽이는 게 아니라 자기편으로 만드는구나.','thought'],['narrator','neutral','역사 연결 · 경순왕 김부 → 경주의 사심관 → 지방 세력 통제','narration']
  ],{cardId:'ch01-sasimgwan',nextStoryId:'ch01_giin'}),
  ch01Scene('ch01_giin',937,'수도에 머무는 자제','route-songak',[
    ['merchant','neutral','내 조카는 지방 호족 집안의 자제로 개경에 머물고 있소. 기인이라 부른다 하오.'],['player','surprised','고향을 떠나서?'],['merchant','serious','고장의 사정을 묻기도 하고, 집안이 함부로 움직이지 못하게 하는 뜻도 있지.'],['doyun','serious','손을 잡되, 마음 놓고 등을 돌리지는 않는 셈이오.'],['player','thinking','사심관은 연고 지역을 감독하는 유력자. 기인은 수도에 머무는 호족 자제. 비슷한 목적이지만 다른 방식이야.','thought']
  ],{cardId:'ch01-giin',quizId:'ch01-story-integration'}),
  ch01Scene('ch01_refugee_family',938,'북쪽에서 온 손님','ch02-doyun-shop-interior-949',[
    ['merchant','serious','발해에서 내려온 가족이오. 이 고장에서는 어디서 일을 구할 수 있소?'],['player','worried','먼 길을 왔겠네.'],['merchant','neutral','먼저 온 사람들이 왕께서 우리를 받아주셨다 했소. 가족이 머물 자리를 찾고 있소.'],['doyun','neutral','나라 잃은 사람에게 어디 출신인지가 뭐 그리 중요하겠소.'],['doyun','smile','돈만 제대로 내면 손님이지. 일을 찾는다면 짐 정리부터 함께 해보시오.'],['player','smile','너답다.'],['doyun','surprised','칭찬이오?'],['player','smile','반쯤.'],['narrator','neutral','북쪽에서 온 가족은 옮겨 온 짐을 풀고 다음날 함께 일하기로 했다.','narration']
  ],{nextStoryId:'ch01_north'}),
  ch01Scene('ch01_north',940,'서경으로 보내는 짐','route-caravan',[
    ['doyun','neutral','이번 짐은 서경으로 갑니다.'],['player','surprised','평양 말이지? 왜 그렇게 중요하게 여길까?'],['merchant','neutral','옛 고구려의 중심지이니 그렇소. 왕께서는 고구려를 잇는 나라를 세우고 북쪽으로 나아가려 하시오.'],['player','thinking','고려라는 이름, 발해 사람을 받아들인 일, 서경을 중시하는 일. 서로 따로 외울 게 아니었네.','thought'],['doyun','smile','그럼 이름만 생각하지 말고 짐도 같이 옮기시오.'],['player','smile','알았어. 그 고구려 계승 짐, 내가 들게.'],['doyun','surprised','……곡식 짐이오.']
  ],{cardId:'ch01-north',quizId:'ch01-story-north'}),
  ch01Scene('ch01_welfare',941,'다시 밥을 지을 사람들','route-village',[
    ['merchant','neutral','과도하게 거두지 말라는 임금의 뜻을 고장에서도 지켜야 한다 하오.'],['player','serious','살아남은 사람들이 다시 농사짓고 장사할 수 있어야 나라가 유지되겠지.'],['doyun','neutral','손님이 밥을 먹어야 우리 물건도 사는 것이오.'],['player','thinking','취민유도. 백성에게서 거두는 데에도 한도가 있다는 말이, 빈 솥 앞에서는 다르게 들렸다.','thought'],['narrator','neutral','태조의 민생 안정책은 건국 초기부터 이어졌다. 두 사람은 통일 뒤의 거래 속에서 그 의미를 다시 이해했다.','narration']
  ],{cardId:'ch01-welfare',nextStoryId:'ch01_jump_943'}),
  ch01Scene('ch01_jump_943',943,'스물다섯 번째 해','route-songak',[
    ['narrator','neutral','943년 — 고려에 온 지 스물다섯 해','narration'],['narrator','neutral','계절을 함께 넘긴 두 사람은 처음 만났던 길목으로 돌아왔다.','narration']
  ],{nextStoryId:'ch01_memory_943'}),
  ch01Scene('ch01_memory_943',943,'평생 기억할 옷','goryeo-house',[
    ['doyun','smile','저기 기억나시오?'],['player','neutral','뭐가?'],['doyun','smile','자네가 이상한 옷 입고 쓰러져 있던 곳.'],['player','embarrassed','그걸 아직 기억하냐?'],['doyun','smile','평생 놀려먹을 거라 하지 않았소.'],['player','smile','스물다섯 해면 이제 그만할 때도 됐지.'],['doyun','neutral','나는 좀 늙었고.'],['player','smile','좀?'],['doyun','serious','……나가시오.'],['narrator','neutral','웃던 도윤이 내 얼굴을 잠시 바라보았다.','narration'],['doyun','worried','그런데 자네는…….'],['player','surprised','왜?'],['doyun','neutral','아니오.']
  ],{nextStoryId:'ch01_taejo_death'}),
  ch01Scene('ch01_taejo_death',943,'나라를 연 왕이 떠나다','route-context',[
    ['merchant','serious','태조 임금께서 돌아가셨소.'],['doyun','worried','우리가 장사를 시작할 때 나라를 여셨는데…….'],['player','thinking','918년부터 943년까지. 책의 한 줄이 여기서는 스물다섯 해였다.','thought'],['doyun','serious','다음 임금도 사람들을 살피면 좋겠소.'],['player','neutral','그 마음을 남긴 말이 있대. 후대 왕들이 지킬 가르침.']
  ],{nextStoryId:'ch01_hunyo'}),
  ch01Scene('ch01_hunyo',943,'열 가지 당부','ch02-doyun-shop-interior-949',[
    ['merchant','neutral','태조께서 남긴 훈요 10조에는 서경을 중시하고, 연등회와 팔관회를 행하라는 당부가 있다 하오.'],['player','serious','나라를 어떻게 이어갈지 후대 왕에게 남긴 거네.'],['doyun','neutral','사람들이 살아온 믿음과 땅을 함부로 버리지 말라는 뜻도 있겠지.'],['player','thinking','지방의 힘을 모으고, 북쪽을 바라보고, 백성의 삶을 살폈던 왕. 그 방향을 다음 왕에게 건네는 거구나.','thought'],['narrator','neutral','훈요 10조는 태조의 유훈이다. 광종의 노비안검법·과거제, 성종 때 최승로의 시무 28조와 구분한다.','narration']
  ],{cardId:'ch01-hunyo',quizId:'ch01-story-hunyo'}),
  ch01Scene('ch01_guild_seed',943,'도윤상단이라는 이름','ch02-doyun-shop-interior-949',[
    ['doyun','neutral','스물다섯 해 동안 참 많은 일이 있었군.'],['player','neutral','그러게.'],['doyun','serious','전쟁도 끝났으니 이제 제대로 장사를 해보고 싶소.'],['player','surprised','가게 차리게?'],['doyun','neutral','언젠가는.'],['player','smile','그럼 이름은 도윤상단?'],['doyun','surprised','상단은 무슨. 가게 하나도 없는데.'],['player','smile','미리 정해놓는 거지.'],['doyun','neutral','……도윤상단.'],['player','smile','괜찮지?'],['doyun','smile','촌스럽소.'],['narrator','neutral','장부를 덮던 도윤이 잠시 뒤 덧붙였다.','narration'],['doyun','smile','그래도 기억은 해두겠소.']
  ],{timeOfDay:'night',nextStoryId:'ch01_farewell',sharedEvent:'doyun_guild_name_seed',doyunLegacy:{merchantGuild:false,plannedName:'도윤상단'}}),
  ch01Scene('ch01_farewell',943,'새로운 나라','future-flow',[
    ['narrator','neutral','CH.01 새로운 나라 · 918 — 943','narration'],['narrator','neutral','고려가 세워지고, 전쟁이 끝나고, 우리는 이곳에서 살아가기 시작했다.','narration']
  ],{sceneEffect:'blackout',cinematicSub:'스물다섯 해의 이야기를 기록합니다.',continueLabel:'CHAPTER CLEAR',completeChapter:true})
];
Object.assign(STORIES,Object.fromEntries(CH01_NEW_SCENES.map(item=>[item.sceneId,item])));
// Keep all early dialogue, effects, illustrations and choices. Only quiz routing changes.
for(const id of ['doyun','route_context','thief_aftermath']){delete STORIES[id].quizId;STORIES[id].nextStoryId={doyun:'status',route_context:'thief',thief_aftermath:'night'}[id]}
STORIES.night.nextStoryId='ch01_trade_start';
Object.assign(STORIES.future_flow,{year:936,location:'살아온 시간의 연결',fictionNotice:'주인공과 도윤의 경험은 창작이며 연표의 사건은 역사적 사실입니다.',dialogues:ch01Lines([
  ['narrator','neutral','918 고려 건국 → 927 공산 패배 → 930 고창 승리','narration'],
  ['narrator','neutral','935 견훤 귀순 → 같은 해 신라 항복 → 936 일리천 승리·후삼국 통일','narration'],
  ['player','thinking','순서가 헷갈리던 사건들이 우리가 기다리고, 잃고, 버틴 날들로 이어졌다.','thought']
])});
STORIES.complete.year=943;
Object.assign(CHAPTERS.ch01,{subtitle:'918–943, 함께 살아낸 새로운 나라',years:'918 — 943',questionCount:10,reviewQuestionCount:13});

const CH01_STORY_QUESTION_IDS=['ch01-test-01','ch01-test-02','ch01-story-gongsan','ch01-story-gochang','ch01-story-gyeonhwon','ch01-story-silla','ch01-boss','ch01-story-integration','ch01-story-north','ch01-story-hunyo'];
const ch01Question=data=>question({chapterId:'ch01',isOfficial:false,sourceVerified:false,historicalSourceVerified:true,examName:'한국사능력검정시험',examType:'기출 유형 · 자체 제작',questionType:'exam_style',source:'국사편찬위원회 우리역사넷의 확인된 사실관계에 기반한 자체 제작',rewardKnowledge:2,...data});
const CH01_STORY_QUESTIONS=[
  ch01Question({questionId:'ch01-story-gongsan',year:927,relatedSceneId:'ch01_gongsan',relatedIllustrationId:'thief-aftermath',relatedHistoricalEventId:'ch01-gongsan',formatLabel:'사건·결과 연결',difficulty:'중',
    passage:'신라를 공격한 후백제군과 맞선 고려군이 공산에서 크게 패했다. 왕건은 탈출했지만 가까운 장수를 잃었다.',question:'이 전투와 관련된 설명으로 옳은 것은?',choices:['신숭겸이 전사하였다.','신검이 항복하여 후삼국이 통일되었다.','경순왕 김부가 고려에 귀순하였다.','왕건이 고창에서 후백제군을 격파하였다.'],answer:0,
    explanation:'927년 공산 전투에서 왕건이 패하고 신숭겸이 전사했습니다. 고창 승리는 930년입니다.',choiceExplanations:['공산 전투의 인물과 결과입니다.','936년 일리천 전투 뒤의 일입니다.','935년 신라의 항복입니다.','930년 고창 전투입니다.'],examKeywords:['927 공산','왕건 패배','신숭겸'],concepts:['공산전투_고창전투'],resumeStoryId:'ch01_conflict',sourceUrls:[CH01_SOURCES.chronology]}),
  ch01Question({questionId:'ch01-story-gochang',year:930,relatedSceneId:'ch01_gochang',relatedIllustrationId:'route-context',relatedHistoricalEventId:'ch01-gochang',formatLabel:'비교 자료',difficulty:'중',
    passage:'927년에는 돌아오지 않는 거래 일행을 기다렸다. 930년에는 후백제군을 격파했다는 소식을 듣고 거래길을 다시 열었다.',question:'두 전투의 결과를 바르게 연결한 것은?',choices:['공산 승리 — 고창 패배','공산 패배 — 고창 승리','공산 패배 — 고창 패배','공산 승리 — 고창 승리'],answer:1,
    explanation:'왕건은 공산(927)에서 패배하고 고창(930)에서 승리했습니다.',choiceExplanations:['두 결과를 모두 뒤바꿨습니다.','연도와 결과가 맞습니다.','고창에서는 고려가 승리했습니다.','공산에서는 고려가 패배했습니다.'],examKeywords:['927 공산 패배','930 고창 승리'],concepts:['공산전투_고창전투'],resumeStoryId:'ch01_belonging',sourceUrls:[CH01_SOURCES.chronology]}),
  ch01Question({questionId:'ch01-story-gyeonhwon',year:935,relatedSceneId:'ch01_gyeonhwon',relatedIllustrationId:'ch02-doyun-shop-interior-949',relatedHistoricalEventId:'ch01-gyeonhwon',formatLabel:'인물 식별',difficulty:'중',
    passage:'아들 신검에게 왕위를 빼앗기고 금산사에 갇혔다. 탈출한 뒤 왕건의 고려에 귀순하였다.',question:'자료의 인물은?',choices:['궁예','경순왕 김부','견훤','신숭겸'],answer:2,
    explanation:'견훤은 후백제의 건국자입니다. 그를 밀어낸 신검은 후백제를 이끌었고, 견훤은 고려로 귀순했습니다.',choiceExplanations:['궁예는 후고구려를 세운 인물입니다.','김부는 신라의 마지막 왕입니다.','금산사 탈출과 고려 귀순의 인물입니다.','신숭겸은 927년 공산에서 전사했습니다.'],examKeywords:['935 견훤','금산사','신검'],concepts:['견훤_신검','견훤귀순_경순왕귀순'],resumeStoryId:'ch01_silla',sourceUrls:[CH01_SOURCES.unification]}),
  ch01Question({questionId:'ch01-story-silla',year:935,relatedSceneId:'ch01_silla',relatedIllustrationId:'ch02-doyun-shop-interior-949',relatedHistoricalEventId:'ch01-silla',formatLabel:'인물·사건 연결',difficulty:'중',
    passage:'신라의 마지막 왕이 백성의 피해를 우려하여 나라를 고려에 넘겼다. 왕건은 그를 우대하였다.',question:'이 인물과 이후 연결되는 제도로 옳은 것은?',choices:['견훤 — 노비안검법','신검 — 과거제','궁예 — 12목','경순왕 김부 — 경주의 사심관'],answer:3,
    explanation:'935년 신라의 귀순을 결정한 왕은 경순왕 김부입니다. 김부와 경주의 사심관을 연결해 기억합니다.',choiceExplanations:['견훤은 후백제 건국자이며 노비안검법은 광종 정책입니다.','신검은 후백제의 마지막 왕입니다.','12목은 성종 때의 제도입니다.','김부의 지역 연고를 활용한 사심관의 대표 사례입니다.'],examKeywords:['935 신라 항복','김부','사심관'],concepts:['견훤귀순_경순왕귀순','사심관_기인'],resumeStoryId:'ch01_jump_936',sourceUrls:[CH01_SOURCES.policy]}),
  ch01Question({questionId:'ch01-story-integration',year:937,relatedSceneId:'ch01_giin',relatedIllustrationId:'route-songak',relatedHistoricalEventId:'ch01-giin',formatLabel:'정책 구별',difficulty:'중상',
    passage:'(가) 출신 지역의 연고를 가진 유력자에게 그 지역을 감독하게 했다.\n(나) 지방 호족의 자제를 수도에 머물게 했다.',question:'(가), (나)에 해당하는 제도를 바르게 연결한 것은?',choices:['기인 — 사심관','사심관 — 기인','과거제 — 노비안검법','12목 — 기인'],answer:1,
    explanation:'(가)는 사심관, (나)는 기인입니다. 태조는 호족을 포섭하면서 동시에 지방 세력을 견제했습니다.',choiceExplanations:['두 제도의 방식을 뒤바꿨습니다.','연고 지역 감독과 자제의 수도 체류를 구분했습니다.','두 정책은 광종의 왕권 강화 정책입니다.','12목 지방관 파견은 성종 때의 제도입니다.'],examKeywords:['사심관','기인','혼인·포섭·견제'],concepts:['사심관_기인','태조_광종'],resumeStoryId:'ch01_refugee_family',sourceUrls:[CH01_SOURCES.policy]}),
  ch01Question({questionId:'ch01-story-north',year:940,relatedSceneId:'ch01_north',relatedIllustrationId:'route-caravan',relatedHistoricalEventId:'ch01-north',formatLabel:'왕의 정책',difficulty:'중',
    passage:'고려는 발해 유민을 받아들였고, 옛 고구려의 중심지인 평양을 서경으로 중시하였다.',question:'자료와 가장 밀접한 통치 방향은?',choices:['신라의 골품제 유지','광종의 과거제 시행','고구려 계승 의식과 북진 정책','조선의 한양 천도'],answer:2,
    explanation:'태조의 발해 유민 포용과 서경 중시는 고구려 계승 의식 및 북진 정책과 연결됩니다.',choiceExplanations:['고려가 신라 골품제를 유지한 것은 아닙니다.','광종은 이후 왕이며 자료의 북방 정책과 다릅니다.','유민 포용·서경·북진의 공통 방향입니다.','조선의 수도 정책으로 시대가 다릅니다.'],examKeywords:['발해 유민','고구려 계승','서경','북진'],concepts:['서경_북진','태조_광종'],resumeStoryId:'ch01_welfare',sourceUrls:[CH01_SOURCES.refugees,CH01_SOURCES.policy]}),
  ch01Question({questionId:'ch01-story-hunyo',year:943,relatedSceneId:'ch01_hunyo',relatedIllustrationId:'ch02-doyun-shop-interior-949',relatedHistoricalEventId:'ch01-hunyo',formatLabel:'사료 해석',difficulty:'중상',
    passage:'[유훈의 내용을 학습용으로 요약]\n서경을 중시하며 연등회와 팔관회를 행하고, 후대 왕들이 나라를 다스리는 데 마음을 다하도록 당부하였다.',question:'이 유훈을 남긴 왕과 문서의 연결로 옳은 것은?',choices:['광종 — 시무 28조','성종 — 훈요 10조','태조 — 훈요 10조','태조 — 경국대전'],answer:2,
    explanation:'943년에 사망한 태조 왕건은 후대 왕들에게 훈요 10조를 남겼습니다. 시무 28조는 최승로가 성종에게 올린 건의입니다.',choiceExplanations:['시무 28조는 최승로가 성종에게 올렸습니다.','훈요 10조를 남긴 왕은 태조입니다.','왕과 문서의 연결이 맞습니다.','경국대전은 조선의 법전입니다.'],examKeywords:['943 태조 사망','훈요 10조','서경','연등회·팔관회'],concepts:['훈요10조_시무28조','태조_광종'],resumeStoryId:'ch01_guild_seed',sourceUrls:[CH01_SOURCES.hunyo,CH01_SOURCES.chronology]})
];
QUESTIONS.push(...CH01_STORY_QUESTIONS);
const ch01ById=id=>QUESTIONS.find(q=>q.questionId===id);
// The original early questions remain available, but only two are mandatory in 918.
for(const id of ['ch01-test-01','ch01-test-02']){const q=ch01ById(id);q.resumeStoryId=q.originalResumeStoryId||q.resumeStoryId;Object.assign(q,{year:918,questionType:'exam_style',formatLabel:id.endsWith('01')?'인물·자료 추론':'시대 상황',examType:'기출 유형 · 자체 제작',sourceVerified:false,concepts:['918_936','궁예_왕건'],sourceUrls:[CH01_SOURCES.chronology]})}
for(const id of ['ch01-test-03','ch01-test-04','ch01-test-05'])Object.assign(ch01ById(id),{reviewOnly:true,resumeStoryId:ch01ById(id).originalResumeStoryId||ch01ById(id).resumeStoryId,examType:'기출 유형 · 자체 제작',sourceVerified:false});
Object.assign(ch01ById('ch01-boss'),{year:936,resumeStoryId:'ch01_integration',questionType:'exam_style',formatLabel:'복합 선택지',examType:'기출 유형 · 자체 제작',sourceVerified:false,concepts:['918_936','후삼국_사건순서'],sourceUrls:[CH01_SOURCES.unification]});
// The attached problem and answer PDFs verify these transcriptions. They replace
// six self-made review slots without changing the chapter's story-test cadence.
const VERIFIED_CH01_OFFICIAL_IDS=['ch01-official-69-basic-10','ch01-official-79-advanced-09','ch01-official-70-advanced-10','ch01-official-73-basic-10','ch01-official-74-advanced-10','ch01-official-76-advanced-10'];
for(const id of VERIFIED_CH01_OFFICIAL_IDS){const q=ch01ById(id);Object.assign(q,{retired:false,reviewOnly:true,isOfficial:true,sourceVerified:true,sourceStatus:'verified_from_attached_pdf'})}

const CH01_REVIEW_QUESTIONS=[
  ch01Question({questionId:'ch01-review-01',formatLabel:'사료 해석',year:918,relatedSceneId:'rumor',relatedIllustrationId:'memory-wanggeon',relatedHistoricalEventId:'goryeo-foundation-918',difficulty:'중',passage:'[역사 사실의 학습용 요약] 궁예를 몰아낸 신하들이 새 왕을 추대하였고, 새 왕은 국호를 고려로 정하였다.',question:'이 사건이 일어난 연도는?',choices:['900년','901년','918년','936년'],answer:2,explanation:'왕건의 고려 건국은 918년입니다.',choiceExplanations:['후백제 건국입니다.','궁예의 후고구려 건국입니다.','고려 건국의 해입니다.','후삼국 통일의 해입니다.'],examKeywords:['918','왕건 추대'],concepts:['918_936'],sourceUrls:[CH01_SOURCES.chronology]}),
  ch01Question({questionId:'ch01-review-02',formatLabel:'인물 식별',year:927,relatedSceneId:'ch01_gongsan',relatedIllustrationId:'thief-aftermath',relatedHistoricalEventId:'ch01-gongsan',difficulty:'중',passage:'후백제의 신라 왕경 공격으로 사망한 신라 왕.',question:'이 인물은?',choices:['경애왕','경순왕','태조','신검'],answer:0,explanation:'927년 후백제의 신라 공격 때 경애왕이 사망했습니다.',choiceExplanations:['927년 사건의 인물입니다.','935년 신라의 항복을 결정한 왕입니다.','고려를 세운 왕건입니다.','후백제의 마지막 왕입니다.'],examKeywords:['927','경애왕','신라 공격'],concepts:['경애왕_경순왕'],sourceUrls:[CH01_SOURCES.chronology]}),
  ch01Question({questionId:'ch01-review-03',formatLabel:'사건 순서',year:936,relatedSceneId:'future_flow',relatedIllustrationId:'future-flow',relatedHistoricalEventId:'ch01-illyecheon',difficulty:'상',passage:'ㄱ. 고창 전투\nㄴ. 신라의 항복\nㄷ. 공산 전투\nㄹ. 일리천 전투',question:'일어난 순서대로 나열한 것은?',choices:['ㄱ → ㄷ → ㄴ → ㄹ','ㄷ → ㄱ → ㄴ → ㄹ','ㄷ → ㄴ → ㄱ → ㄹ','ㄴ → ㄷ → ㄹ → ㄱ'],answer:1,explanation:'공산(927) → 고창(930) → 신라 항복(935) → 일리천(936)입니다.',choiceExplanations:['공산이 고창보다 먼저입니다.','시간순으로 맞습니다.','고창이 신라 항복보다 먼저입니다.','신라 항복은 공산과 고창 뒤입니다.'],examKeywords:['927','930','935','936'],concepts:['후삼국_사건순서','공산전투_고창전투'],sourceUrls:[CH01_SOURCES.unification,CH01_SOURCES.chronology]}),
  ch01Question({questionId:'ch01-review-04',formatLabel:'사건 이후',year:935,relatedSceneId:'ch01_gyeonhwon',relatedIllustrationId:'ch02-doyun-shop-interior-949',relatedHistoricalEventId:'ch01-gyeonhwon',difficulty:'중상',passage:'견훤이 금산사에서 벗어나 고려의 왕건에게 귀순하였다.',question:'이 사건 이후에 일어난 일은?',choices:['왕건이 고려를 건국하였다.','신숭겸이 공산에서 전사하였다.','왕건이 고창에서 승리하였다.','신검의 군대가 일리천에서 패하였다.'],answer:3,explanation:'935년 견훤 귀순 뒤 936년 일리천 전투가 일어났습니다.',choiceExplanations:['918년으로 이전입니다.','927년으로 이전입니다.','930년으로 이전입니다.','936년으로 이후입니다.'],examKeywords:['935 견훤 귀순','936 일리천'],concepts:['견훤_신검','후삼국_사건순서'],sourceUrls:[CH01_SOURCES.unification]}),
  ch01Question({questionId:'ch01-review-05',formatLabel:'사건 이전',year:930,relatedSceneId:'ch01_gochang',relatedIllustrationId:'route-context',relatedHistoricalEventId:'ch01-gochang',difficulty:'중',passage:'고창에서 고려가 승리하여 후삼국의 전세가 기울었다.',question:'이보다 앞서 일어난 사건은?',choices:['경순왕이 고려에 귀순하였다.','태조가 사망하였다.','공산에서 왕건이 패하였다.','신검이 항복하였다.'],answer:2,explanation:'고창(930)보다 먼저 공산(927)에서 고려가 패했습니다.',choiceExplanations:['935년으로 이후입니다.','943년으로 이후입니다.','927년으로 이전입니다.','936년으로 이후입니다.'],examKeywords:['공산 → 고창'],concepts:['공산전투_고창전투'],sourceUrls:[CH01_SOURCES.chronology]}),
  ch01Question({questionId:'ch01-review-06',formatLabel:'왕의 업적',year:943,relatedSceneId:'ch01_hunyo',relatedIllustrationId:'route-context',relatedHistoricalEventId:'ch01-hunyo',difficulty:'중',passage:'후삼국을 통일하고, 후대 왕에게 나라의 통치 방향을 당부하였다.',question:'이 왕의 정책으로 옳은 것은?',choices:['12목에 지방관을 파견하였다.','호족과 혼인 관계를 맺었다.','쌍기의 건의를 받아 과거제를 시행하였다.','노비안검법을 시행하였다.'],answer:1,explanation:'태조는 호족과 혼인 관계를 맺어 정치 기반을 넓혔습니다.',choiceExplanations:['성종의 정책입니다.','태조의 포섭 정책입니다.','958년 광종의 정책입니다.','956년 광종의 정책입니다.'],examKeywords:['태조','혼인 정책','광종과 구별'],concepts:['태조_광종'],sourceUrls:[CH01_SOURCES.policy]}),
  ch01Question({questionId:'ch01-review-07',formatLabel:'정책 구별',year:937,relatedSceneId:'ch01_giin',relatedIllustrationId:'route-songak',relatedHistoricalEventId:'ch01-giin',difficulty:'중상',passage:'태조는 지방 유력자에게 연고 지역 감독을 맡기고, 지방 호족의 자제를 수도에 머물게 하였다.',question:'두 제도에 대한 설명으로 옳지 않은 것은?',choices:['사심관은 광종의 과거 합격자를 지방관으로 파견하는 제도였다.','김부와 경주는 사심관의 대표적인 연결이다.','기인은 지방 호족 자제의 수도 체류와 관련된다.','두 제도는 지방 세력 통제와 관련된다.'],answer:0,explanation:'사심관은 과거 합격 지방관 파견 제도가 아닙니다. 태조가 지역 연고를 활용한 통제 방식입니다.',choiceExplanations:['시기와 제도의 성격이 모두 잘못되었습니다.','옳은 연결입니다.','기인의 방식입니다.','공통 목적입니다.'],examKeywords:['사심관','기인','태조'],concepts:['사심관_기인','태조_광종'],sourceUrls:[CH01_SOURCES.policy]}),
  ch01Question({questionId:'ch01-review-08',formatLabel:'시대 상황',year:918,relatedSceneId:'foundation',relatedIllustrationId:'title-foundation',relatedHistoricalEventId:'goryeo-foundation-918',difficulty:'중',passage:'새로 고려가 출범했지만 전쟁과 지방 세력의 경쟁은 이어졌다.',question:'918년의 상황으로 옳은 것은?',choices:['신라와 후백제가 이미 모두 사라졌다.','광종이 왕권 강화를 위한 과거제를 시행 중이었다.','성종이 12목 지방관을 파견하였다.','고려·후백제·신라가 함께 존재하였다.'],answer:3,explanation:'고려 건국(918)과 후삼국 통일(936)은 같은 사건이 아닙니다.',choiceExplanations:['신라는 935, 후백제는 936년에 멸망합니다.','광종은 뒤의 왕입니다.','성종도 뒤의 왕입니다.','후삼국 구도가 이어졌습니다.'],examKeywords:['918','후삼국','936과 구분'],concepts:['918_936'],sourceUrls:[CH01_SOURCES.unification]}),
  ch01Question({questionId:'ch01-review-09',formatLabel:'인물·사건 연결',year:935,relatedSceneId:'ch01_silla',relatedIllustrationId:'ch02-doyun-shop-interior-949',relatedHistoricalEventId:'ch01-silla',difficulty:'중상',passage:'같은 해인 935년에 견훤과 경순왕 김부가 고려로 왔다.',question:'인물과 사건의 연결로 옳은 것은?',choices:['견훤 — 신라를 나라째 고려에 넘겼다.','김부 — 신검에게 밀려 금산사에 갇혔다.','견훤 — 금산사를 탈출하여 고려로 귀순했다.','신검 — 고려 편에서 후백제를 공격했다.'],answer:2,explanation:'견훤은 금산사 탈출 후 귀순했고, 경순왕 김부는 신라를 고려에 넘겼습니다. 신검은 후백제 편입니다.',choiceExplanations:['김부의 사건입니다.','견훤의 사건입니다.','견훤의 사건입니다.','견훤과 신검의 진영을 바꿨습니다.'],examKeywords:['견훤','김부','신검'],concepts:['견훤귀순_경순왕귀순','견훤_신검'],sourceUrls:[CH01_SOURCES.unification]}),
  ch01Question({questionId:'ch01-review-10',formatLabel:'복합 선택지',year:943,relatedSceneId:'ch01_hunyo',relatedIllustrationId:'ch02-doyun-shop-interior-949',relatedHistoricalEventId:'ch01-hunyo',difficulty:'상',passage:'ㄱ. 서경 중시\nㄴ. 연등회·팔관회 존중\nㄷ. 과거제의 최초 시행\nㄹ. 후대 왕의 통치 방향에 대한 당부',question:'태조의 훈요 10조와 관련된 내용을 모두 고른 것은?',choices:['ㄱ, ㄷ','ㄴ, ㄷ','ㄱ, ㄴ, ㄷ, ㄹ','ㄱ, ㄴ, ㄹ'],answer:3,explanation:'ㄱ·ㄴ·ㄹ이 훈요 10조의 학습 단서입니다. 과거제의 최초 시행은 광종 때입니다.',choiceExplanations:['ㄷ이 틀리고 ㄴ·ㄹ이 빠졌습니다.','ㄷ이 틀리고 ㄱ·ㄹ이 빠졌습니다.','ㄷ이 포함되어 틀렸습니다.','서경·의례·후대 통치 지침의 연결입니다.'],examKeywords:['훈요 10조','서경','연등회·팔관회'],concepts:['훈요10조_시무28조','태조_광종'],sourceUrls:[CH01_SOURCES.hunyo]})
];
for(const q of CH01_REVIEW_QUESTIONS){q.reviewOnly=true;q.resumeStoryId='complete'}
QUESTIONS.push(...CH01_REVIEW_QUESTIONS);
const REPLACED_SELF_MADE_REVIEW_IDS=['ch01-review-01','ch01-review-08','ch01-review-03','ch01-review-04','ch01-review-09','ch01-test-04'];
for(const id of REPLACED_SELF_MADE_REVIEW_IDS)Object.assign(ch01ById(id),{retired:true,sourceStatus:'superseded_by_verified_exam'});
const CH01_REVIEW_IDS=['ch01-official-69-basic-10','ch01-official-79-advanced-09','ch01-review-02','ch01-review-05','ch01-test-05','ch01-official-70-advanced-10','ch01-official-73-basic-10','ch01-official-74-advanced-10','ch01-official-76-advanced-10','ch01-review-06','ch01-review-07','ch01-review-10','ch01-test-03'];
HISTORY.relatedQuestions=[...CH01_STORY_QUESTION_IDS,...CH01_REVIEW_IDS];

// Add diagnostics to legacy practice items without changing their wording or answer.
const CH01_LEGACY_EXPLANATIONS={
  'ch01-test-01':['궁예 휘하에서 성장한 왕건의 설명입니다.','후백제의 건국자는 견훤입니다.','왕건을 추대한 것은 궁예 휘하의 세력입니다.','기억 여부가 아니라 역사적 사실을 고르는 문제입니다.'],
  'ch01-test-02':['신라 항복은 935년, 통일은 936년입니다.','후백제는 936년까지 존재합니다.','918년에는 세 나라가 함께 존재합니다.','노비안검법은 956년 광종의 정책입니다.','귀주 대첩은 1019년입니다.'],
  'ch01-test-03':['후백제(900)가 후고구려(901)보다 먼저입니다.','900 → 901 → 918 → 936 순서입니다.','후고구려(901)가 고려(918)보다 먼저입니다.','고려(918)는 두 후삼국 국가보다 늦습니다.','후백제(900)가 먼저입니다.'],
  'ch01-test-04':['호족을 즉시 없애기보다 포섭과 견제를 병행했습니다.','혼인을 통한 호족 포섭은 태조의 정책입니다.','신라 골품제의 강화는 고려의 정책이 아닙니다.','과전법은 고려 말의 제도입니다.','태조의 건국 기반을 후대 문벌 귀족 중심으로만 설명할 수 없습니다.'],
  'ch01-test-05':['후백제의 경쟁은 사실이므로 부정형 문제의 답이 아닙니다.','918년에 신라가 존재했다는 것은 사실입니다.','왕건은 궁예 세력에서 성장했습니다.','918년에는 통일이 끝나지 않았으므로 이 설명이 틀렸습니다.','지방 호족의 중요성은 사실입니다.'],
  'ch01-boss':['ㄷ도 옳으므로 빠뜨렸습니다.','ㄹ은 건국과 통일을 혼동한 설명입니다.','ㄱ도 옳으므로 빠뜨렸습니다.','ㄱ·ㄴ·ㄷ이 옳고 ㄹ이 틀립니다.','ㄹ은 918년과 936년을 같은 해로 보아 틀렸습니다.']
};
for(const q of QUESTIONS.filter(q=>q.chapterId==='ch01'&&!q.retired)){
  q.year??=918;q.relatedHistoricalEventId??='goryeo-foundation-918';
  q.choiceExplanations??=CH01_LEGACY_EXPLANATIONS[q.questionId]||q.choices.map((_,index)=>index===q.answer?'이 선택지가 자료와 일치합니다.':q.explanation);
  q.concepts??=q.questionId==='ch01-test-04'?['태조_광종','호족_포섭']:q.questionId==='ch01-test-05'?['918_936']:['후삼국_사건순서'];
}
for(const q of QUESTIONS.filter(q=>!q.retired)){
  const related=STORIES[q.relatedSceneId],answerMark=['①','②','③','④','⑤'][q.answer]||String(q.answer+1);
  q.storyConnection??=`‘${related?.title||q.historicalEvent||'이야기'}’ 장면에서 확인한 ${q.examKeywords?.[0]||'역사'} 단서를 떠올리면 정답은 ${answerMark}입니다.`;
}
const migrateBeforeCh01Expansion=migrateSave;
migrateSave=function(raw){
  const migrated=migrateBeforeCh01Expansion(raw);
  for(const r of [migrated.run,migrated.mainRun].filter(Boolean)){
    if(r.currentChapter!=='ch01')continue;
    if(raw&&!r.ch01ExpansionVersion&&!r.completed&&!r.pending&&['future_flow','complete'].includes(r.storyId)){
      if(r.activeQuestionId)r.resumeAfterLegacyQuiz='ch01_trade_start';
      else{r.storyId='ch01_trade_start';r.dialogueSceneId=null;r.dialogueCursor=1}
    }
    r.ch01ExpansionVersion=1;
  }
  return migrated;
};
const recordBeforeCh01Expansion=recordQuestion;
recordQuestion=function(state,id,answer){
  const right=recordBeforeCh01Expansion(state,id,answer),q=QUESTIONS.find(item=>item.questionId===id);
  if(!['ch01','ch02'].includes(q?.chapterId)||q.retired)return right;
  const mistakes=state.meta.conceptMistakes||(state.meta.conceptMistakes={});
  if(!right)for(const concept of q.concepts||[]){const previous=mistakes[concept]||{count:0,questionIds:[]};mistakes[concept]={count:previous.count+1,questionIds:[...new Set([...previous.questionIds,id])],lastQuestionId:id,year:q.year}}
  state.meta.confusedConcepts=Object.keys(mistakes).filter(concept=>mistakes[concept].questionIds.some(questionId=>state.meta.wrongQuestionIds.includes(questionId)&&!state.meta.reviewedQuestionIds.includes(questionId)));
  return right;
};
const enterBeforeCh01Expansion=applySceneEntry;
applySceneEntry=function(state,id){
  const r=state.run||state,already=r.entryEffectsApplied?.includes(id),result=enterBeforeCh01Expansion(state,id),s=STORIES[id];
  if(!already&&['ch01','ch02'].includes(s?.chapterId)){
    for(const [stat,change] of Object.entries(s.enterStatChanges||{}))r.stats[stat]=Math.max(0,(r.stats[stat]||0)+change);
    for(const [person,change] of Object.entries(s.enterRelationChanges||{}))r.relations[person]=Math.max(-100,Math.min(100,(r.relations[person]||0)+change));
  }
  return result;
};
