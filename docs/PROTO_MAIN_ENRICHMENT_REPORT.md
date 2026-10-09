# 원삼국 본편 보강 및 프롤로그·엔딩 보존 보고

기준 커밋: 7fa6285e6ae0dbbed3cf09e29756dbb96c074865
작업일: 2026-10-09 (Asia/Seoul)

## 보존 결과

- CH.00 프롤로그 5씬 전체, CH.06 S09 문 앞 장면부터 S14까지, CH.07 8씬 전체를 보존했다. 원본 선택 결과, 배경, 표정, 캐릭터 상태, 퀴즈 및 전환 정보를 포함한 실행 데이터 22개(완료 별칭 포함)의 SHA-256 비교가 통과했다.
- 프롤로그 → 기존 CH.01 진입, 삼한 작업장에서 라온과 재회하는 결말, 이후 형제의 대화·선택 반영·작별·에필로그가 동일하다.
- 공통 UI, 프롤로그/엔딩 렌더러, 캐릭터·초상화·배경 정의, 기존 QUESTIONS 전체가 동일하다. 다른 시대의 스토리·문제·저장 흐름도 회귀 검사 대상이다.

## 본편 변경

기존 83씬과 챕터 ID를 유지했다. 새 원고의 어린아이 실종·나무패·부모 사망 설정은 적용하지 않았다. 기존 라온(19세), 반년 전 교역단 출발, 매듭과 편지, 철 기술을 배우려는 선택을 기준으로 목격담과 단의 감정선을 보강했다. 원고의 CH.01~05 학습 내용은 아래 기존 챕터에 맞추어 배치했다.

일반 대사는 390개에서 512개로 122개 늘었다. 선택 버튼은 기존 108개를 유지하며, 편집 가능한 본편의 행동 지시형 버튼을 완성된 발화로 바꾸고 추상적인 후속 설명을 실제 반응으로 보강했다. 보호된 프롤로그·엔딩 버튼의 문구는 그대로다. 선택 문장이 주인공 말풍선에 표시되는 기존 방식을 유지한다.

| 기존 챕터 | 제목 | 씬 | 학습 개념 |
|---|---|---:|---|
|CH.00|낯선 숲에서|5|원본 보존|
|CH.01|사라진 교역단|10|교역단·매듭·여러 나라의 위치와 교역|
|CH.02|겨울의 제사|12|5부족 연맹, 사출도, 마가·우가·저가·구가, 영고, 순장, 1책 12법|
|CH.03|알에서 태어난 왕|14|5부·제가의 지배·제가회의, 서옥제, 동맹, 1책 12법(부여에서 비교)|
|CH.04|바다에 남겨진 사람|10|민며느리제, 가족 공동 무덤, 소금·어물 공납, 고구려 지배|
|CH.05|넘지 말아야 할 경계|10|책화, 족외혼, 무천, 단궁·과하마·반어피|
|CH.06|철을 가진 사람들|14|마한·진한·변한, 여러 소국, 신지·읍차, 천군·소도, 제정 분리, 공동 노동·두레, 5월·10월, 변한의 철·낙랑·왜 교역|
|CH.07|마지막 갈림길|8|원본 보존|

영고를 본 뒤 겨울에 고구려, 봄에 동예로 이동하는 기존 계절 흐름을 유지했다. 동맹·무천은 행사 설명으로 다루며 여행 당일 축제로 바꾸지 않았다. 여행 순서가 건국 순서가 아니라는 대사와, 삼한 공동 노동을 후대 두레의 완성된 조직과 동일시하지 않는 설명을 추가했다.

## Q01~Q18 연결

기존 스토리 기출 23개·15개 체크포인트를 유지했다. 슬롯은 학습 개념과 기존 문제를 연결하는 메타데이터다. 각 슬롯 직후에 새 퀴즈를 18개 추가한 구현은 아니다. 같은 문항이 여러 개념을 함께 다루면 기존 복습 위치를 공유한다. 특히 Q18은 변한 철 교역이 자료에 포함된 기존 CH.01 비교 문항을 재사용 연결하며, 재회 직전에 퀴즈를 삽입하지 않는다. 족보 UI는 구현하지 않았다.

15슬롯은 공식 PDF 문제지와 정답표를 시각 대조했다. 9개 서로 다른 문항을 연결했고, 나머지 기존 14문항은 원본 그대로 유지했다. Q03·Q13·Q17은 기출 검증 대기로 보고한다. 회차·번호·정답을 임의 생성하지 않았다. 데이터의 correctAnswer는 1부터 시작하는 보기 번호이고 answerIndex는 기존 0-based 값이다.

| 슬롯 | 학습 씬 | 학습 개념 | 연결 기출 | 정답 | 실제 복습 씬 |
|---|---|---|---|---:|---|
|Q01|proto_ch02_s2|5부족 연맹·사출도|68회 심화 3번|3|proto_ch02_s11|
|Q02|proto_ch02_s3|마가·우가·저가·구가·사출도|68회 심화 3번|3|proto_ch02_s11|
|Q03|proto_ch02_s5|부여·고구려의 1책 12법|기출 검증 대기|-|-|
|Q04|proto_ch02_s10|영고·12월 제천 행사|64회 심화 2번|1|proto_ch02_s6|
|Q05|proto_ch02_s6|순장·영고·사출도 종합|68회 심화 3번|3|proto_ch02_s11|
|Q06|proto_ch03_s9|5부·제가회의·제가의 지배|76회 심화 2번|2|proto_ch03_s14|
|Q07|proto_ch03_s10|서옥제|76회 심화 2번|2|proto_ch03_s14|
|Q08|proto_ch03_s11|동맹·10월·영고 비교|76회 심화 2번|2|proto_ch03_s14|
|Q09|proto_ch04_s4|민며느리제·서옥제 비교|66회 심화 2번|2|proto_ch04_s5|
|Q10|proto_ch04_s5|가족 공동 무덤|66회 심화 2번|2|proto_ch04_s5|
|Q11|proto_ch04_s3|소금·어물 공납·고구려 지배|73회 심화 4번|3|proto_ch04_s5|
|Q12|proto_ch05_s2|책화|77회 심화 3번|2|proto_ch05_s5|
|Q13|proto_ch05_s5|족외혼|기출 검증 대기|-|-|
|Q14|proto_ch05_s7|무천·단궁·과하마·반어피|77회 심화 3번|2|proto_ch05_s5|
|Q15|proto_ch06_s2|마한·진한·변한·소국·신지·읍차|77회 기본 2번|4|proto_ch06_s4|
|Q16|proto_ch06_s6|소도·천군·제정 분리|78회 심화 3번|1|proto_ch06_s7|
|Q17|proto_ch06_s7|공동 노동·두레·5월과 10월 제천 행사|기출 검증 대기|-|-|
|Q18|proto_ch06_s5|변한의 철 생산·낙랑과 왜 교역|70회 심화 2번|3|proto_ch01_s9|

Q03 후보인 71회 심화 2번은 공식 원본에서 12배 배상과 정답 ④를 확인했으나 저장소 이미지가 지문 중간에서 잘려 보기가 표시되지 않으며 기존 해설에도 다른 시대 내용이 섞여 있어 연결하지 않았다. Q13은 족외혼 직접 문항, Q17은 두레 직접 문항을 확보하지 못했다. Q05 연결 문제는 사출도·영고 중심의 부여 종합, Q11은 옥저·삼한 비교, Q18은 철 교역이 포함된 여러 나라 비교이며 모든 세부 개념이 각각 정답으로 출제된 문항이라고 표시하지 않는다.

공식 문제지·정답표 URL, 파일 SHA-256, 정답 대조 결과는 PROTO_MAIN_OFFICIAL_SOURCES.json에 저장했다.

- [64회 심화 2번 공식 게시글](https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000029951) · [문제지](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202304150208567920) · [정답표](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202304150208571061)
- [66회 심화 2번 공식 게시글](https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000029966) · [문제지](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202308131157406580) · [정답표](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202308131157407821)
- [68회 심화 3번 공식 게시글](https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000029984) · [문제지](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202312021231272410) · [정답표](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202312021231274741)
- [70회 심화 2번 공식 게시글](https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000030012) · [문제지](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202405251204104430) · [정답표](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202405251205112771)
- [73회 심화 4번 공식 게시글](https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000030052) · [문제지](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202502161203255660) · [정답표](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202502161203256681)
- [76회 심화 2번 공식 게시글](https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000030098) · [문제지](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202510180138534030) · [정답표](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202510180138535251)
- [77회 심화 3번 공식 게시글](https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000030110) · [문제지](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202602071228075140) · [정답표](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202602071050519721)
- [77회 기본 2번 공식 게시글](https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000030109) · [문제지](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202602071226588770) · [정답표](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202602071226590111)
- [78회 심화 3번 공식 게시글](https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000030119) · [문제지](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202605230140467170) · [정답표](https://www.historyexam.go.kr/atchFile/FileDown.do?atch_file_id=B_202605230140467941)

[공식 시험 자료실](https://www.historyexam.go.kr/pst/list.do?bbs=dat)은 사진 등의 권리가 원저작자에게 있음을 안내한다. [국사편찬위원회 저작권 정책](https://www.history.go.kr/contents/contentsPage.do?groupId=000000000571&menuId=000000000574&pageId=000000000213)을 확인했으며, 이번에는 기존 이미지·출처 표기를 재사용했다. 별도 상업적 이용권이 확보되었다고 판정하지 않는다. 역사 설명은 [우리역사넷 여러 나라의 발전](https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m61_0030_0030) 등을 대조했다.

## 변경 파일

- dist/proto-story-script.js, dist/proto-story-script.json: 본편 대사·선택·반응 보강. 보호 구간 동일.
- dist/proto-story-data.js: Q 슬롯 및 학습 링크 메타데이터 추가. 기존 스토리 퀴즈 객체·큐는 동일.
- docs/PROTO_MAIN_CHOICE_EDITS.json: 수정한 본편 선택 문구 기록.
- docs/PROTO_QUESTION_SLOTS.json, docs/PROTO_MAIN_OFFICIAL_SOURCES.json: 슬롯·원본 검증 기록.
- tests/proto-story-test.cjs: 이전 본편 원고 고정 검사 대신 이번 요청의 보호 구간 고정 검사 적용.
- tests/proto-harness.cjs, tests/proto-main-preservation-test.cjs, tests/fixtures/proto-opening-ending.json, tests/fixtures/proto-runtime-preservation.json: 보존·개념·실제 대사 렌더링·슬롯 테스트.
- package.json: 보존 테스트를 기본 테스트와 원삼국 테스트 명령에 추가.
- docs/PROTO_MAIN_ENRICHMENT_REPORT.md: 본 보고서.

## 검증

- 원삼국 세 선택 경로 전체 플레이, 정답·오답·오답노트, 저장 큐 복원, 구 저장 호환 검사 통과.
- 83씬 대사 화면 512개 및 선택 결과 108개 전부 HTML 렌더링 검사 통과. 선택한 문장과 표시된 첫 주인공 대사의 동일성 확인.
- 보호 구간 실행 데이터 22개, 기존 문제 전체, 캐릭터·초상화·배경 데이터, 공통 렌더러 파일 해시 동일. 모든 필수 개념이 본편 실제 대사에 포함됨을 검사.
- 원삼국 CH.00~07 및 삼국 CH.00~13 전체 진행 검사 통과.
- 전체 기본 테스트 스위트의 48개 명령을 package.json 순서대로 실행해 모두 통과했다. 정적 PWA 빌드도 통과했다(필수 파일 53개, 준비된 일러스트 458개).
- 실제 브라우저 시각 검수는 미완료. Playwright는 설치된 Chrome 실행 시 spawn EPERM, 연결된 브라우저 도구는 초기화 경로 오류가 발생했다. HTML 렌더링 검사를 실제 브라우저/모바일 시각 검수로 보고하지 않는다. 기존 이미지 파일 및 새 이미지가 없는 점은 정적 검사로 확인한다.
