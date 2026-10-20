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
assert.equal(g.run('JOKBO_API.linkedExamIds().length'),468,'실제 기출 중복 제거 연결 수');
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
assert.equal(css.includes('overflow-wrap: anywhere'),false,'상세·비교 화면 임의 글자 분리 제거');
console.log('PASS: 족보 156항목, 실제 기출 468개 연결, 보기 탭·시대 칩·시대별 저장, 행·타이포·하단 메뉴, 검색·상세·비교 및 원삼국 전용 스토리 공개 정책 검증');
