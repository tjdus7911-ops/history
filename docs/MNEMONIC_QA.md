# 암기법 통합 구현 QA

2026-10-08 확인.

## Data

- 명시 입력 A001–F020 **118개**를 모두 `docs/mnemonic-sources/explicit-request.json`에 inventory 했다.
- 그룹별 개수: A 15 / B 11 / C 20 / D 32 / E 20 / F 20.
- 상태: VERIFIED 10 / REVIEW_REQUIRED 90 / CANDIDATE 18.
- 공개: VERIFIED 10개만 PUBLISHED. 나머지 108개는 내부 검수 inventory로 보존하고 앱에서 제외했다.
- `sourceMnemonic`과 공개용 `mnemonic`을 분리했다. 괄호, `~`, `?`, 숫자, 영문을 포함한 보호 문자열 7개 exact-string 회귀 테스트를 추가했다.
- 중복 source ID, 앱 ID, sourceMnemonic은 0개다.
- 109개 topic에 canonical 기출 연결 후보가 있으며, 533개의 고유 canonical officialQuestionId를 참조한다. UI의 문제 수는 유효 ID 배열에서 계산한다.

## UI / learning flow

- 메뉴명은 `암기법`을 유지했다.
- 목록 → 통합 상세의 2 Depth이며 중간 주제 목록 화면이 없다.
- 목록 카드에 시대·유형, 주제, 연도/키워드, 공개용 암기 문장, 실제 기출 수, NEW/LEARNING/MEMORIZED 상태를 표시한다.
- 검색은 제목, 공개용 mnemonic, cue, 인물·정책·사건·제도를 대상으로 한다.
- 시대 필터는 전체 / 선사·고대 / 고려 / 조선 / 근현대다.
- 상세는 암기 문장 → 키워드 분석 → 배경 이해 → 정책·사건별 의미 → 핵심 흐름 → 시험 포인트 → 실제 기출 순서다.
- 상세 진입만으로 학습 상태를 변경하지 않는다. Recall Test 시작 시 LEARNING, 전 문항 정답 완료 시 MEMORIZED가 된다.
- Recall 제출 전 공개 mnemonic과 전체 cue 순서를 숨기고, 제출 뒤에만 cue→fact를 공개한다.
- Story 회상 버튼은 연결 장면을 이미 경험한 경우에만 표시한다.

## Mobile

- Playwright + Microsoft Edge로 **360 / 390 / 412px** 암기법 목록·상세·Recall을 검증했다.
- 긴 텍스트 줄바꿈, 검색 입력 초점 유지, 시대 필터, 독립 아코디언, Recall 비노출/공개, `scrollWidth <= innerWidth + 1`을 모두 통과했다.
- 전체 모바일 회귀 묶음도 통과했다: CH01–04, 후기 고려 CH05–12, 조선 CH00–22, 공식 기출 이미지 36회차, 캐릭터 framing, 저장/재개, 오답노트.

## Regression / build

- `npm test`: PASS.
- `npm run test:mobile`: PASS.
- `npm run build`: PASS.
- 고려 Story, 조선 Story CH00–22, 공식 기출 1,800문항, 공식 정답/이미지, 오답노트, 학습 기록, save/resume에 대한 기존 테스트가 모두 통과했다.

상세 inventory와 record별 검토·기출·Story 연결 결과는 `docs/MNEMONIC_IMPORT_REVIEW.md`에 기록한다.
