const assert=require('node:assert/strict');
const fs=require('node:fs');
const {load}=require('./proto-revision-harness.cjs');

const g=load();
assert.equal(g.run('JOKBO_API.count()'),196,'전 시대 학습 항목 수');
assert.deepEqual(g.copy('JOKBO_API.countsByEra()'),{
  prehistoric:10,proto:18,three:20,'north-south':19,goryeo:28,joseon:38,opening:21,colonial:21,modern:21
});
assert.equal(g.run('new Set(JOKBO_DATA.keywords.map(k=>k.id)).size'),196,'키워드 ID 중복 없음');
assert.equal(g.run('JOKBO_DATA.keywords.filter(k=>k.bullets.length<2||k.bullets.length>4).length'),0,'상세 핵심 학습 내용 2~4개');
assert.equal(g.run('JOKBO_DATA.eras.length'),9,'9개 시대 탭');
assert.equal(g.run('JOKBO_DATA.comparisons.length'),7,'비교 화면');
assert.equal(g.run('JOKBO_API.linkedExamIds().length'),596,'검증 연결 보강 뒤 실제 기출 중복 제거 연결 수');
assert.deepEqual(g.copy('JOKBO_DATA.keywords.filter(k=>!k.examIds.length).map(k=>k.id)'),['sataek','goryeo-status'],'직접 연결 문항이 없는 항목만 비활성');
assert(g.run("JOKBO_API.search('서옥제').some(k=>k.id==='seookje')"));
assert(g.run("JOKBO_API.search('박종철').some(k=>k.id==='june-flow')"));
assert.equal(g.run("JOKBO_API.searchResults('영고')[0].id"),'buyeo-festival','정확한 키워드를 관련도 최상단에 표시');
assert.equal(g.run("JOKBO_API.searchResults('노비 안검법')[0].id"),'gwangjong-goryeo','띄어쓰기 차이를 허용하는 부분 검색');
assert.deepEqual(g.copy("JOKBO_API.searchResults('과거제').map(row=>row.id).slice(0,2)"),['gwangjong-goryeo','joseon-education'],'전 시대의 같은 검색어 결과를 관련도순 표시');
assert.equal(g.run("JOKBO_API.searchResults('책화')[0].id"),'dongye-customs','동예 상세 키워드 검색');
assert.equal(g.run("JOKBO_API.searchResults('박종철')[0].id"),'june-flow','상세 설명에 포함된 용어 검색');
assert.equal(g.run("JOKBO_API.searchResults('   ').length"),0,'빈 검색어에서 전체 결과를 노출하지 않음');
assert.equal(g.run("(()=>{const rows=JOKBO_API.searchResults('과거제');return new Set(rows.map(row=>row.id)).size===rows.length})()"),true,'같은 족보 키워드 중복 결과 없음');
for(const id of ['salsu','baekje-revival','yuan-control','goryeo-money','late-merchants','hague-dokdo','secret-societies','wartime-labor','park-gov','kim-dj-gov','okjeo-products','samhan-festival','unification-flow','aristocratic-conflicts','goryeo-history-books','sejong-science','new-religions','sovereignty-loss','heroic-struggle','national-culture','coalition-negotiation']){
  assert(g.run(`JOKBO_DATA.keywords.some(k=>k.id==='${id}')`),id+' PDF 범위 보강');
}
assert.deepEqual(g.copy("JOKBO_DATA.comparisons.find(c=>c.id==='early-customs').topics.map(t=>t.label)"),['혼인','법률','제천 행사']);
assert(g.run("JOKBO_DATA.keywords.find(k=>k.id==='yiik').bullets.join(' ').includes('박지원')"),'한전론 구분');
assert(g.run("JOKBO_DATA.keywords.find(k=>k.id==='june-flow').bullets.join(' ').includes('7월 5일')"),'6월 항쟁 순서');
assert(g.run("JOKBO_DATA.keywords.find(k=>k.id==='sataek').definition.includes('불교')"),'사택지적비 불교 귀의');
assert.deepEqual(g.copy("JOKBO_DATA.keywords.find(k=>k.id==='taejo-jeongdojeon').summaryRows"),[
  {label:'태조',value:'조선 건국 · 한양 천도'},
  {label:'정도전',value:'재상 중심 정치 · 조선경국전'}
],'태조·정도전 인물별 요약 행');
assert.deepEqual(g.copy("JOKBO_DATA.keywords.find(k=>k.id==='true-view-landscape').summaryRows.map(row=>row.label)"),['정선','김홍도','신윤복','김정희'],'조선 후기 회화 인물별 요약 행');
assert.equal(g.run("JOKBO_DATA.keywords.filter(k=>k.summaryRows).every(k=>k.summaryRows.every(row=>row.label&&row.value))"),true,'전 시대 표시 행 이름·설명');
assert.equal(g.run('JOKBO_DATA.groups.length'),59,'전 시대 국가·왕·주제 그룹 수');
assert.equal(g.run('new Set(JOKBO_DATA.groups.map(group=>group.id)).size'),59,'그룹 ID 중복 없음');
assert.equal(g.run('JOKBO_DATA.groups.filter(group=>!group.keywords.length||group.keywords.some(keyword=>keyword.eraId&&keyword.eraId!==group.eraId)).length'),0,'빈 그룹·시대 불일치 없음');

const groupGame=load(),groupIds=groupGame.copy('JOKBO_DATA.groups.map(group=>group.id)');
for(const id of groupIds){
  const serialized=JSON.stringify(id);
  assert(groupGame.run(`(()=>{const group=JOKBO_DATA.groups.find(row=>row.id===${serialized});REV7_OX_VIEWS.applyRoute('jokbo/group/'+group.id);const html=renderContent(),keywords=JOKBO_DATA.keywords.filter(keyword=>keyword.groupId===group.id);return keywords.length===group.keywords.length&&keywords.every(keyword=>{const rows=keyword.summaryRows?.length?keyword.summaryRows:[{label:keyword.label,value:keyword.value}];return html.includes('data-jk-group-keyword-id="'+keyword.id+'"')&&rows.every(row=>html.includes('>'+esc(row.label)+'</span>')&&html.includes('aria-label="'+esc(row.value)+'"'));})})()`),id+' 그룹 전체 상세 키워드·표시 행 누락 없음');
}
assert.deepEqual(groupGame.copy("JOKBO_API.groupKeywordIds('buyeo')"),['buyeo-politics','buyeo-festival','buyeo-law'],'부여 전체 상세는 세 핵심 항목을 같은 그룹 데이터에서 사용');
assert.deepEqual(groupGame.copy("JOKBO_API.groupExamIds('buyeo')"),[
  'official-60-advanced-02','official-62-advanced-02','official-68-advanced-03',
  'official-61-basic-03','official-64-advanced-02','official-66-basic-02',
  'official-73-basic-02','official-71-advanced-02'
],'부여 관련 기출 8문항 검증 연결·중복 제외');
assert.equal(groupGame.run("new Set(JOKBO_API.groupExamIds('buyeo')).size"),8,'부여 그룹 기출 중복 없음');
assert.equal(groupGame.run("JOKBO_API.groupExamIds('buyeo').every(id=>REV7_EXAM_VIEWS.entry(id))"),true,'부여 그룹 기출 전부 실제 학습 화면 연결 가능');
groupGame.click({nav:'jokbo'});
groupGame.click({jkEra:'proto'});
groupGame.run("window.scrollY=640;window.scrollTo=(x,y)=>{window.scrollY=Number(y)||0;window.lastScrollY=window.scrollY}");
groupGame.click({jkGroup:'buyeo'});
assert.equal(groupGame.run('screen'),'jokbo-group','국가 자세히 보기는 그룹 전체 상세로 이동');
assert(groupGame.run("renderContent().includes('부여 핵심 정리')"));
for(const text of ['정치','5부족 연맹','사출도','제천 행사','영고','12월','법률','1책 12법','시험 포인트'])assert(groupGame.run(`renderContent().includes(${JSON.stringify(text)})`),'부여 그룹 상세 '+text);
assert(groupGame.run("renderContent().includes('부여의 제가와 사출도')&&renderContent().includes('부여의 제천의례 영고')&&renderContent().includes('부여의 법률')"),'부여 공식 확인 자료');
assert.equal(groupGame.run("JOKBO_API.view().scrollY"),640,'그룹 진입 전 목록 스크롤 저장');
groupGame.click({jkSave:'buyeo-festival'});
assert.deepEqual(groupGame.copy('JOKBO_API.saved()'),['buyeo-festival'],'그룹 전체 상세에서도 저장 대상이 명확함');
groupGame.run('window.scrollY=380');
groupGame.click({jkDetail:'buyeo-festival',jkDetailParent:'buyeo'});
assert.equal(groupGame.run('screen'),'jokbo-detail','그룹 전체 상세에서 개별 개념 상세 이동');
assert(groupGame.run("renderContent().includes('data-jk-back=\"group:buyeo\"')"),'개별 상세의 그룹 복귀 경로');
assert(groupGame.run("renderContent().includes('aria-label=\"뒤로가기\"')"),'개념 상세 뒤로가기 접근성 이름');
assert.equal(groupGame.run("JOKBO_API.view().scrollY"),640,'그룹 스크롤이 목록 스크롤을 덮어쓰지 않음');
groupGame.click({jkBack:'group:buyeo'});groupGame.tick();
assert.equal(groupGame.run('screen'),'jokbo-group');
assert.equal(groupGame.run('window.lastScrollY'),380,'그룹 상세 스크롤 복원');
groupGame.click({jkBack:'jokbo'});groupGame.tick();
assert.equal(groupGame.run('screen'),'jokbo');
assert.equal(groupGame.run('JOKBO_API.state().activeEra'),'proto','목록의 선택 시대 복원');
assert.equal(groupGame.run('window.lastScrollY'),640,'목록 스크롤 위치 복원');
groupGame.run("REV7_OX_VIEWS.applyRoute('jokbo/group/goguryeo-kings')");
assert.equal(groupGame.run('screen'),'jokbo-group','그룹 전체 상세 직접 URL');
assert.equal(groupGame.run('JOKBO_API.state().activeEra'),'three','그룹 직접 URL 시대 정렬');
assert(groupGame.run("renderContent().includes('고구려의 성장 핵심 정리')"));

g.click({nav:'jokbo'});
assert.equal(g.run('screen'),'jokbo');
assert(g.run('renderContent()').includes('원삼국 한 장 정리'));
assert(g.run("(()=>{const html=renderContent();return html.indexOf('jk-heading')<html.indexOf('jk-segment')&&html.indexOf('jk-segment')<html.indexOf('jk-era-tabs')&&html.indexOf('jk-era-tabs')<html.indexOf('jk-summary-head')})()"),'제목·보기 탭·시대 칩·학습 내용 순서');
assert(g.run("renderContent().includes('<span class=\"jk-segment-count is-empty\">0</span>')"),'선택 시대 저장 0 중립 배지 마크업');
assert(g.run("renderContent().includes('data-jk-era=\"proto\" aria-selected=\"true\"><span>원삼국</span>')"),'시대 선택 독립 칩 마크업');
assert(g.run("(()=>{const before=screen;screen='home';const html=shell(renderContent());screen=before;return html.includes('data-icon=\"answer-sheet\"')})()"),'일반 화면 하단 메뉴 OX 답안지 아이콘');
assert.equal(g.run("shell(renderContent()).includes('data-nav=\"jokbo\"')"),false,'족보는 하단 메뉴에 추가하지 않음');
assert.deepEqual(g.copy("[...shell(renderContent()).matchAll(/data-nav=\"([^\"]+)\"/g)].map(m=>m[1])"),[],'족보 전용 전체 화면에서는 하단 메뉴 숨김');
assert(g.run("shell(renderContent()).includes('class=\"shell editorial-shell jk-fullscreen-shell\"')"),'족보 전용 전체 화면 셸');
assert.equal(g.run("shell(renderContent()).includes('<b>OX</b>')"),false,'OX 텍스트 중복 제거');
g.click({jkMode:'saved'});
assert(g.run("renderContent().includes('원삼국 저장 키워드')"),'저장 보기 선택 시대 제목');
assert(g.run("renderContent().includes('아직 저장한 키워드가 없어요')"),'선택 시대 저장 빈 상태 문구');
assert(g.run("renderContent().includes('중요한 키워드를 저장하면')"),'저장 빈 상태 설명 문구');
assert(g.run("renderContent().includes('M7.25 4.75h9.5')"),'저장 빈 상태 책갈피 아이콘');
g.click({jkMode:'all'});
g.click({jkEra:'joseon'});
assert(g.run('renderContent()').includes('조선 한 장 정리'));
assert(g.run("renderContent().includes('data-jk-fact-name>태조</span>')"),'태조 독립 행 렌더');
assert(g.run("renderContent().includes('data-jk-fact-name>정도전</span>')"),'정도전 독립 행 렌더');
assert(g.run("renderContent().includes('data-jk-fact-name>정선</span>')"),'정선 독립 행 렌더');
assert.equal(g.run("renderContent().includes('data-jk-fact-name>태조·정도전</span>')"),false,'결합 인물명 배지 제거');
assert(g.run("renderContent().includes('data-jk-phrase aria-hidden=\"true\">재상 중심 정치<span class=\"jk-keyword-separator\"> ·</span>')"),'의미 묶음 줄바꿈 마크업');
g.click({jkDetail:'yiik'});
assert.equal(g.run('screen'),'jokbo-detail');
assert(g.run('renderContent()').includes('영업전'));
g.click({jkSave:'yiik'});
assert.deepEqual(g.copy('JOKBO_API.saved()'),['yiik']);
g.run("REV7_OX_VIEWS.applyRoute('jokbo')");
g.click({jkMode:'saved'});
assert(g.run("renderContent().includes('조선 저장 키워드')"),'조선 저장 보기 제목');
assert(g.run("renderContent().includes('영업전')"),'선택 시대 저장 키워드 표시');
assert(g.run("renderContent().includes('<span class=\"jk-segment-count\">1</span>')"),'선택 시대 저장 개수');
g.click({jkEra:'proto'});
assert.equal(g.run("renderContent().includes('영업전')"),false,'다른 시대 저장 키워드 제외');
assert(g.run("renderContent().includes('아직 저장한 키워드가 없어요')"),'다른 시대 저장 존재 시에도 저장 빈 상태');
assert.equal(g.run("renderContent().includes('검색 결과가 없어요')"),false,'저장 빈 상태와 검색 빈 상태 구분');
g.click({jkEra:'joseon'});
g.run("REV7_OX_VIEWS.applyRoute('jokbo/detail/yiik')");
assert.equal(g.run('screen'),'jokbo-detail','상세 직접 URL');
assert(g.run('renderContent()').includes('영업전'),'상세 직접 URL 내용 복원');
g.run("REV7_OX_VIEWS.applyRoute('jokbo/compare/land-reform')");
assert.equal(g.run('screen'),'jokbo-compare','비교 직접 URL');
assert(g.run('renderContent()').includes('한전론'),'비교 직접 URL 내용 복원');

assert.deepEqual(g.copy('STORY_RELEASE_POLICY.availableEraIds'),['proto-kingdoms']);
assert.deepEqual(g.copy('LEARNING_ERAS.filter(e=>e.available).map(e=>e.id)'),['proto-kingdoms']);
assert.equal(g.run("CHAPTER_ACCESS.available('proto-ch01')"),true,'원삼국 챕터 공개');
assert.equal(g.run("CHAPTER_ACCESS.available('ch01')"),false,'고려 챕터 차단');
assert.equal(g.run("resumeEra('goryeo')"),false,'기존 저장 이어하기 우회 차단');
assert.equal(g.run('screen'),'era');
assert.equal(g.run("CHAPTER_ACCESS.begin('ch01')"),false,'챕터 직접 시작 우회 차단');
g.run("REV7_OX_VIEWS.applyRoute('era/goryeo')");
assert.equal(g.run('screen'),'era');
assert(g.run('renderContent()').includes('스토리 준비 중'));

// 카드형 개편: 홈 진입점, 시대·나라 칩, 요약 행 전체 노출
const card=load();
card.run("screen='home'");
assert(card.run("renderContent().includes('data-jk-open')&&renderContent().includes('헷갈리는 개념은 족보로 한 번에')"),'홈 족보 소개 배너에서 전체 화면 진입');
assert(card.run("shell(renderContent()).includes('class=\"jk-fab-dock\"')"),'홈 공통 족보 FAB');
assert.deepEqual(card.copy("[...(shell(renderContent()).match(/<nav class=\"nav app-navigation\"[\\s\\S]*?<\\/nav>/)||[''])[0].matchAll(/data-nav=\"([^\"]+)\"/g)].map(m=>m[1])"),['home','exam-library','ox','study','records'],'일반 화면의 하단 메뉴 5개 유지');
card.click({jkOpen:''});
assert.equal(card.run('screen'),'jokbo','홈에서 족보 진입');
assert(card.run("renderContent().includes('data-jk-back=\"origin\"')"),'족보 첫 화면에서 직전 화면으로 돌아가기');
assert(card.run("renderContent().includes('2 / 9')"),'시대 위치 표시');
assert.deepEqual(card.copy("JOKBO_API.countries('proto')"),['부여','고구려','옥저','동예','삼한'],'원삼국 나라 칩');
assert.deepEqual(card.copy("JOKBO_API.countries('three')"),['고구려','백제','신라','가야'],'삼국 나라 칩');
assert.deepEqual(card.copy("JOKBO_API.countries('north-south')"),['신라','발해','후삼국'],'남북국 나라 칩');
assert.deepEqual(card.copy("JOKBO_API.countries('goryeo')"),[],'단일 국가 시대는 나라 칩 숨김');
card.click({jkEra:'three'});
card.click({jkCountry:'백제'});
assert.equal(card.run('JOKBO_API.state().country'),'백제');
assert(card.run("(()=>{const h=renderContent();return h.includes('data-jk-fact-name>고흥</span>')&&h.includes('data-jk-fact-name>사택지적</span>')&&!h.includes('data-jk-fact-name>소수림왕</span>')})()"),'백제 칩: 백제 행만 표시');
card.click({jkEra:'proto'});
assert.equal(card.run('JOKBO_API.state().country'),'all','시대를 바꾸면 나라 칩 초기화');
const factMarkup=(html,k)=>k.every(row=>html.includes('data-jk-fact-name>'+row.label+'</span>'));
for(const k of card.copy('JOKBO_DATA.keywords.map(k=>({id:k.id,rows:(k.summaryRows||[{label:k.label,value:k.value}]).map(r=>({label:r.label}))}))')){
  card.run(`REV7_OX_VIEWS.applyRoute('jokbo/detail/${k.id}')`);
  assert(factMarkup(card.run('renderContent()'),k.rows),'개념 상세 요약 키워드 전부: '+k.id);
}
card.run("REV7_OX_VIEWS.applyRoute('jokbo')");card.click({jkMode:'saved'});card.click({jkEra:'three'});
card.click({jkSave:'geunchogo'});
assert(card.run("(()=>{const h=renderContent();return h.includes('data-jk-fact-name>근초고왕</span>')&&h.includes('data-jk-fact-name>고흥</span>')})()"),'저장 카드도 요약 행 전부');

// 공통 FAB 노출 정책과 직전 화면 복귀. 학습 콘텐츠·저장 키는 건드리지 않는다.
const fab=load();
const hasFab=()=>fab.run("shell(renderContent()).includes('class=\"jk-fab-dock\"')");
fab.run("screen='home'");assert.equal(hasFab(),true,'홈 FAB');
fab.run("screen='exam-library';globalThis.__examState=REV7_EXAM_VIEWS.state;REV7_EXAM_VIEWS.state=()=>({view:'home'})");assert.equal(hasFab(),true,'기출 홈 FAB');
fab.run("REV7_EXAM_VIEWS.state=()=>({view:'list'})");assert.equal(hasFab(),true,'기출 목록 FAB');
for(const view of ['cover','practice','result','review','history']){fab.run(`REV7_EXAM_VIEWS.state=()=>({view:'${view}'})`);assert.equal(hasFab(),false,'기출 '+view+' FAB 미노출');}
fab.run("REV7_EXAM_VIEWS.state=globalThis.__examState");
fab.run("globalThis.location={hash:'#ox',pathname:'',search:'',href:'#ox'};screen='ox';oxView='home'");assert.equal(hasFab(),true,'OX 목록 FAB');
fab.run("globalThis.location.hash='#ox/quiz';globalThis.location.href='#ox/quiz';oxView='quiz'");assert.equal(hasFab(),false,'OX 실제 풀이 FAB 미노출');
fab.run("globalThis.location.hash='#ox';globalThis.location.href='#ox';globalThis.__oxApi=OX_QUIZ_API;globalThis.OX_QUIZ_API={snapshot:()=>({view:'result'})}");assert.equal(hasFab(),false,'OX 결과 FAB 미노출');fab.run("globalThis.OX_QUIZ_API=globalThis.__oxApi");
fab.run("screen='study'");assert.equal(hasFab(),true,'오답노트 목록·상세 FAB');
for(const hidden of ['records','era','game','quiz','complete','jokbo']){fab.run(`screen='${hidden}'`);assert.equal(hasFab(),false,hidden+' FAB 미노출');}
fab.run("globalThis.location=undefined;screen='study';window.scrollY=284;window.scrollTo=(x,y)=>{window.scrollY=Number(y)||0;window.lastScrollY=window.scrollY}");fab.click({jkOpen:''});assert.equal(fab.run('screen'),'jokbo','오답노트에서 족보 진입');fab.click({jkBack:'origin'});fab.tick();assert.equal(fab.run('screen'),'study','족보 뒤로가기 시 직전 오답노트 복귀');assert.equal(fab.run('window.lastScrollY'),284,'직전 화면 스크롤 복원');
assert.equal(fab.run("localStorage.getItem('history-jokbo:saved:v1')"),null,'FAB 이동은 저장 키워드 데이터를 초기화하지 않음');

// 전 시대 통합 검색: 전용 화면·상세 이동·검색 상태와 원래 카드 위치 복원.
const searchGame=load();
searchGame.run("globalThis.location=undefined;screen='home';window.scrollY=0;window.scrollTo=(x,y)=>{window.scrollY=Number(y)||0;window.lastScrollY=window.scrollY}");
searchGame.click({jkOpen:''});searchGame.click({jkEra:'three'});searchGame.click({jkCountry:'백제'});
searchGame.run('window.scrollY=412');searchGame.click({jkSearch:''});
assert.equal(searchGame.run('screen'),'jokbo-search','돋보기로 전용 검색 화면 진입');
assert(searchGame.run("renderContent().includes('placeholder=\"왕, 사건, 제도, 키워드 검색\"')"),'검색창 플레이스홀더');
assert(searchGame.run("renderContent().includes('족보 전체에서 찾아보세요')"),'빈 검색어 안내');
assert.equal(searchGame.run("renderContent().includes('data-jk-search-result')"),false,'빈 검색어는 전체 결과 미노출');
searchGame.input({jkQuery:''},'노비 안검법');searchGame.run('window.scrollY=233');
assert(searchGame.run("renderContent().includes('검색 결과 <b>1</b>개')"),'실시간 검색 결과 개수');
assert(searchGame.run("renderContent().includes('data-jk-search-result=\"gwangjong-goryeo\"')"),'현재 시대와 무관한 고려 결과 표시');
assert(searchGame.run("renderContent().includes('<mark>노비안검법</mark>')"),'띄어쓰기 차이가 있는 일치 부분 강조');
searchGame.click({jkSearchResult:'gwangjong-goryeo'});
assert.equal(searchGame.run('screen'),'jokbo-detail','검색 결과에서 해당 키워드 상세로 이동');
assert.equal(searchGame.run('JOKBO_API.state().activeEra'),'goryeo','검색 결과의 정확한 시대로 이동');
assert(searchGame.run("renderContent().includes('data-jk-back=\"search\"')"),'상세에서 검색 결과로 돌아가는 경로');
assert(searchGame.run("renderContent().includes('<mark>노비안검법</mark>')"),'상세 화면의 검색 위치 강조');
searchGame.click({jkSave:'gwangjong-goryeo'});
assert.deepEqual(searchGame.copy('JOKBO_API.saved()'),['gwangjong-goryeo'],'검색 결과 상세에서도 키워드 저장');
searchGame.click({jkBack:'search'});searchGame.tick();
assert.equal(searchGame.run('screen'),'jokbo-search','상세 뒤로가기 시 검색 결과 복귀');
assert.equal(searchGame.run('JOKBO_API.state().query'),'노비 안검법','검색어 유지');
assert.equal(searchGame.run('window.lastScrollY'),233,'검색 결과 스크롤 위치 복원');
searchGame.click({jkBack:'search-exit'});searchGame.tick();
assert.equal(searchGame.run('screen'),'jokbo','검색 종료 시 기존 족보 복귀');
assert.equal(searchGame.run('JOKBO_API.state().activeEra'),'three','검색 전 시대 복원');
assert.equal(searchGame.run('JOKBO_API.state().country'),'백제','검색 전 나라 칩 복원');
assert.equal(searchGame.run('JOKBO_API.state().query'),'','검색 종료 시 검색어 정리');
assert.equal(searchGame.run('window.lastScrollY'),412,'검색 전 카드 스크롤 위치 복원');

const index=fs.readFileSync('dist/index.html','utf8'),worker=fs.readFileSync('dist/sw.js','utf8'),css=fs.readFileSync('dist/jokbo.css','utf8'),uiCss=fs.readFileSync('dist/ui-refresh.css','utf8'),baseCss=fs.readFileSync('dist/style.css','utf8');
for(const file of ['jokbo.css','jokbo-data.js','jokbo-people.js','jokbo-people-stats.js','jokbo-people-photos.js','jokbo-choice-facts.js','jokbo-ui.js','story-release-policy.js'])assert(index.includes(file),file+' index 연결');
for(const file of ['/jokbo.css','/jokbo-data.js','/jokbo-people.js','/jokbo-people-stats.js','/jokbo-people-photos.js','/jokbo-choice-facts.js','/jokbo-ui.js','/story-release-policy.js'])assert(worker.includes(file),file+' 오프라인 캐시');
assert(css.includes('repeat(5,minmax(0,1fr))'),'5개 하단 메뉴');
assert(!css.includes('repeat(6,minmax(0,1fr))'),'6칸 하단 메뉴 제거');
assert(css.includes('@media(max-width:370px)'),'360px 대응');
assert(css.includes('.jk-segment button[aria-selected=true]::after'),'보기 방식 선택 밑줄');
assert(css.includes('.jk-segment-count'),'중립 저장 개수 배지');
assert(css.includes('.jk-era-tabs button > span'),'시대 독립 칩');
assert(css.includes('border-radius: 999px'),'시대 칩 둥근 형태');
assert(css.includes('scroll-snap-type: x proximity'),'시대 칩 한 줄 가로 스크롤');
assert(css.includes('.jk-keyword-phrase'),'의미 묶음 줄바꿈 스타일');
assert(css.includes('.jk-appbar-chevron')&&css.includes('stroke-width: 1.75'),'앱바 전용 얇은 chevron');
assert(css.includes('min-height: calc(56px + env(safe-area-inset-top, 0px))'),'Android 상태 표시줄 안전 영역');
assert(css.includes('.jk-group-keyword-card'),'그룹 전체 핵심 정리 전용 범위 스타일');
assert(css.includes('.jk-search-page')&&css.includes('.jk-search-result'),'전 시대 검색 전용 화면·리스트 스타일');
assert(css.includes('.jk-search-page mark, .jk-detail-search-hit mark'),'검색 결과와 상세 일치 부분 강조');
assert(css.includes('grid-template-columns: 72px minmax(0, 1fr)'),'왕 이름·키워드 2열 정렬');
assert(css.includes('html body .jk-fact-value { font-size: 15px'),'카드 키워드 크기 축소');
assert(css.includes('.jk-fab-dock')&&css.includes('bottom: calc(84px + env(safe-area-inset-bottom, 0px))'),'공통 FAB 바텀 메뉴·Safe Area 간격');
assert(css.includes('.jk-fullscreen-shell > .main')&&css.includes('margin-left: 0'),'족보 전용 전체 화면 셸');
assert(!g.run("renderContent().includes('카드를 좌우로 밀면 시대가 바뀌어요')"),'반복 스와이프 안내 제거');
assert(baseCss.includes("fonts/PretendardVariable.woff2"),'로컬 Pretendard 연결');
assert(uiCss.includes("--app-font: 'Pretendard Variable'")&&uiCss.includes('html body #app *'),'앱 전체 Pretendard 통일');
assert(worker.includes('/fonts/PretendardVariable.woff2'),'Pretendard 오프라인 캐시');
console.log('PASS: 족보 59그룹·196항목, 전체 상세 누락 0, 실제 기출 596개 연결, 저장·복원·검색·상세·비교 및 원삼국 전용 스토리 공개 정책 검증');
