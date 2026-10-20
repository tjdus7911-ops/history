const assert=require('node:assert/strict');
const fs=require('node:fs');
const {load}=require('./proto-revision-harness.cjs');

const g=load();
assert.equal(g.run('JOKBO_API.count()'),156,'전 시대 학습 항목 수');
assert.deepEqual(g.copy('JOKBO_API.countsByEra()'),{
  prehistoric:10,proto:18,three:17,'north-south':15,goryeo:21,joseon:28,opening:17,colonial:16,modern:14
});
assert.equal(g.run('new Set(JOKBO_DATA.keywords.map(k=>k.id)).size'),156,'키워드 ID 중복 없음');
assert.equal(g.run('JOKBO_DATA.keywords.filter(k=>k.bullets.length<2||k.bullets.length>4).length'),0,'상세 핵심 학습 내용 2~4개');
assert.equal(g.run('JOKBO_DATA.eras.length'),9,'9개 시대 탭');
assert.equal(g.run('JOKBO_DATA.comparisons.length'),7,'비교 화면');
assert.equal(g.run('JOKBO_API.linkedExamIds().length'),472,'검증 연결 보강 뒤 실제 기출 중복 제거 연결 수');
assert.deepEqual(g.copy('JOKBO_DATA.keywords.filter(k=>!k.examIds.length).map(k=>k.id)'),['sataek','goryeo-status','goryeo-women'],'직접 연결 문항이 없는 항목만 비활성');
assert(g.run("JOKBO_API.search('서옥제').some(k=>k.id==='seookje')"));
assert(g.run("JOKBO_API.search('박종철').some(k=>k.id==='june-flow')"));
for(const id of ['okjeo-products','samhan-festival','unification-flow','aristocratic-conflicts','goryeo-history-books','sejong-science','new-religions','sovereignty-loss','heroic-struggle','national-culture','coalition-negotiation']){
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
assert.equal(g.run('JOKBO_DATA.groups.length'),49,'전 시대 국가·왕·주제 그룹 수');
assert.equal(g.run('new Set(JOKBO_DATA.groups.map(group=>group.id)).size'),49,'그룹 ID 중복 없음');
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
assert(g.run("shell(renderContent()).includes('data-icon=\"answer-sheet\"')"),'OX 답안지 아이콘');
assert(g.run("shell(renderContent()).includes('data-icon=\"summary-book\"')"),'족보 요약집 아이콘');
assert.equal(g.run("shell(renderContent()).includes('<b>OX</b>')"),false,'OX 텍스트 중복 제거');
g.click({jkMode:'saved'});
assert(g.run("renderContent().includes('원삼국 저장 키워드')"),'저장 보기 선택 시대 제목');
assert(g.run("renderContent().includes('원삼국에 저장한 키워드가 없어요')"),'선택 시대 저장 빈 상태');
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
assert(g.run("renderContent().includes('원삼국에 저장한 키워드가 없어요')"),'다른 시대 저장 존재 시에도 시대별 빈 상태');
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

const index=fs.readFileSync('dist/index.html','utf8'),worker=fs.readFileSync('dist/sw.js','utf8'),css=fs.readFileSync('dist/jokbo.css','utf8');
for(const file of ['jokbo.css','jokbo-data.js','jokbo-ui.js','story-release-policy.js'])assert(index.includes(file),file+' index 연결');
for(const file of ['/jokbo.css','/jokbo-data.js','/jokbo-ui.js','/story-release-policy.js'])assert(worker.includes(file),file+' 오프라인 캐시');
assert(css.includes('repeat(6,minmax(0,1fr))'),'6개 하단 메뉴');
assert(css.includes('@media(max-width:370px)'),'360px 대응');
assert(css.includes('--jk-label-col: clamp(96px, 27%, 108px)'),'읽을 수 있는 이름 열 너비');
assert(css.includes('--jk-label-gap: 14px'),'배지와 키워드 간격');
assert(css.includes('.jk-segment button[aria-selected=true]::after'),'보기 방식 선택 밑줄');
assert(css.includes('.jk-segment-count'),'중립 저장 개수 배지');
assert(css.includes('.jk-era-tabs button > span'),'시대 독립 칩');
assert(css.includes('border-radius: 999px'),'시대 칩 둥근 형태');
assert(css.includes('scroll-snap-type: x proximity'),'시대 칩 한 줄 가로 스크롤');
assert(css.includes('justify-self: end'),'짧은 배지를 키워드 가까이 정렬');
assert(css.includes('font-size: 20px'),'국가·주제 제목 위계');
assert(css.includes('.jk-keyword-phrase'),'의미 묶음 줄바꿈 스타일');
assert(css.includes('.jk-appbar-chevron')&&css.includes('stroke-width: 1.75'),'앱바 전용 얇은 chevron');
assert(css.includes('min-height: calc(56px + env(safe-area-inset-top, 0px))'),'Android 상태 표시줄 안전 영역');
assert(css.includes('.jk-group-keyword-card'),'그룹 전체 핵심 정리 전용 범위 스타일');
assert.equal(css.includes('overflow-wrap: anywhere'),false,'상세·비교 화면 임의 글자 분리 제거');
console.log('PASS: 족보 49그룹·156항목, 전체 상세 누락 0, 실제 기출 472개 연결, 저장·복원·검색·상세·비교 및 원삼국 전용 스토리 공개 정책 검증');
