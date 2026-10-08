# 회차별 기출 유형 분리 및 시험 타이머 QA

2026-10-08 확인.

## 회차별 분류

- 공식 기출 DB의 `examLevel`을 기준으로 회차별 화면을 기본/심화 탭으로 분리했다.
- 기본 13회차, 심화 23회차이며 각 시험은 50문항이다.
- 선택한 유형에 실제 데이터가 있는 회차만 표시한다.
- 문제 진행률은 유형별 canonical `officialQuestionId` 집합에서 계산한다.
- 응시 상태는 회차+유형 복합 키로 구분한다. 기존 결과에 `examRound`/`examLevel`이 없으면 해당 결과의 questionIds가 모두 같은 회차·유형일 때만 안전하게 식별한다.
- 시대별 기출 UI와 필터는 변경하지 않았다.

## 80분 타이머

- 회차별 시험 모드만 80분 제한을 사용한다. 학습 모드와 시대별 시험 모드는 기존 동작을 유지한다.
- `startedAtMs`와 `endTimeMs`를 저장하고 `Date.now()`와 종료 예정 시각의 차이로 남은 시간을 계산한다.
- 답안 선택·수정과 문제 이동마다 active session을 저장한다.
- 새로고침 시 문제 위치, 선택 답안, 시작/종료 시각을 복원한다.
- 10분 이하는 warning, 5분 이하는 critical 색상을 사용하며 숫자는 tabular-nums와 고정 최소 너비를 사용한다.
- 시간 종료 시 미응답을 포함한 50문항을 한 번만 채점하고, 답안·오답노트·결과를 함께 저장한 뒤 결과 화면에 `시간 종료로 자동 제출`을 표시한다.
- 수동 제출은 확인 모달의 `계속 풀기`/`제출하기`를 거친다. 제출·명시적 시험 종료 시 active timer를 제거한다.

## 자동 검증

- `tests/exam-library-test.cjs`: 기본/심화 탭, 실제 회차 수, 수동 제출 확인, 유형 포함 결과 저장, Story 격리.
- `tests/official-exam-timer-test.cjs`: 80분 deadline, 답안 수정, 이동, 새로고침 복원, 10분/5분 경고, 시간 종료 자동 제출, 50문항 채점, 오답노트, legacy 결과 식별.
- `tests/official-exam-timer-mobile-test.cjs`: 360/390/412px 탭·타이머·새로고침·경고·제출 모달·overflow.
- 전체 `npm test`, `npm run test:mobile`, `npm run build`로 기존 기출, Story, 암기법, 기록, 저장/이어하기 회귀를 확인한다.
