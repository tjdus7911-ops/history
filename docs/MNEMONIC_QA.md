# 연상기억법 구현 QA

2026-10-08 확인.

- 전체 기준 111개 + 추가 원문 15개 = 126개. RAW에 없는 fact title을 거부하는 검사를 포함한다.
- 기존 정상 암기법 4개와 저장 ID 유지. 신규 3개만 PUBLISHED, 66개 REVIEW_REQUIRED, 57개 CANDIDATE. sourceFacts 전사는 전체 완료했으며 후보의 역사 검증 완료를 주장하지 않는다.
- 누락 fixture에서 111번 제거 시 검증 실패. build가 동일 검사를 사용한다.
- 실제 등록 기출 canonical ID와 기존 Story 장면만 연결. source official ID가 기존 alias로 합쳐진 경우 canonical ID로 변환한다.
- Story/문제 DB 및 저장 데이터 초기화 코드 변경 없음.
- 목록의 암기 문구, cue별 상세 아코디언, 정답 전 문구 비노출/정답 후 cue→fact 복원 확인.
- 앱 브라우저에서 320px 연속 `abc` 입력, `경운궁` fact 검색 및 2개 아코디언 열기 확인. 검색 입력 노드를 유지하도록 수정하여 입력 중 초점 손실 해결.
- 앱 브라우저 320/390/430px Recall 화면에서 document scrollWidth = viewport width 확인. 430px 화면 시각 확인 완료.
- 전체 npm test 통과. 수정된 암기 UI 및 데이터 검증 재실행 통과. npm run build 통과.
- 별도 Playwright 모바일 테스트를 추가했으나 이 환경의 shell 브라우저 실행은 Chromium 미설치/Edge spawn EPERM으로 실행 불가했다. 위 모바일 QA는 앱 브라우저 도구로 수행했다.

공식 fact 검수 근거는 `docs/mnemonic-sources/verified-facts.json`, 전체 검토 사유는 `docs/MNEMONIC_IMPORT_REVIEW.md`에 기록한다.
