# CH.03 네 학습 구간과 설명 화면 수정

2026-10-03 · 기준 main `74df8f67494d941fe47cbf3e5071279ceaf3df75`

## 문제 수와 장면 수

수정 전 코드에는 기존 스토리 출제 6문항이 연결되어 있었다. 기존 일반 scene을 하나도 삭제하지 않고, 실제 문제 진행 상태를 저장하는 quiz scene 레코드 12개를 추가했다.

| 구분 | 수정 전 | 수정 후 |
|---|---:|---:|
| 일반 scene (기존 비활성 scene 포함) | 36 | 36 |
| 독립 quiz scene 레코드 | 0 | 12 |
| CH.03 전체 scene 레코드 | 36 | 48 |
| 스토리 출제 문항 | 6 | 12 |
| 복습 문항 | 6 | 12 |
| 전체 CH.03 QUESTIONS 항목 (retired 포함) | 18 | 24 |

새 문항 6개, 기존 기출 6개 재사용. 추가 quiz 단계 12개. 별도의 퀴즈 UI는 만들지 않았다.

| 주요 학습 구간 | 출제 위치 | 새 문항 | 기존 기출 | 합계 | 복귀 장면 |
|---|---|---:|---:|---:|---|
| 노비안검법 | `ch02_policy_memory` 뒤 | 3 | 0 | 3 | `ch02_noble_night` |
| 과거제·쌍기 | `ch02_ssanggi` 뒤 | 2 | 1 | 3 | `ch02_exam_eve` |
| 공복·광덕·준풍 | `ch02_reign_followup` 뒤 | 1 | 2 | 3 | `ch02_purge` |
| 광종의 왕권 강화 종합 | `ch02_night_discussion` 뒤 | 0 | 3 | 3 | `ch02_complete` |

새 문제는 기본 개념 → 제도/정책 효과 구분 → 자료 적용 순서로 구성했다. 기존 실제 기출 71회 11번, 76회 50번, 77회 14번, 74회 11번, 68회 11번, 78회 11번의 문제·정답·해설·출처는 그대로 유지했다. 기출 회차가 없는 새 문항은 모두 ‘한능검 대비 문제’로 표시하고 examRound/examYear/questionNumber는 null로 유지했다.

새 문항에는 선택지·정답·선택지별 해설·정답 해설·역사 개념·게임 기억·지식 보상·오답 피드백·원래 스토리 복귀 정보가 있다. 사실관계 근거는 [우리역사넷 노비안검법](https://contents.history.go.kr/mobile/kc/view.do?code=kc_age_20&levelId=kc_i200500), [우리역사넷 과거제](https://contents.history.go.kr/front/nh/print.do?levelId=nh_013_0050_0020&whereStr=), [우리역사넷 광종의 왕권 강화](https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_h71_0040_0020_0020_0020)이며 문항 데이터에 sourceReference를 저장했다.

기존 질문 큐를 재사용해 1/3 → 2/3 → 3/3 → 해설 → 원래 스토리로 진행한다. 각 문제에서 run.storyId와 visited가 해당 quiz scene ID를 기록한다. 저장/재로드에도 현재 문제를 유지한다. 다른 챕터의 큐 동작은 그대로이며 CH.03은 기본부터 응용으로 고정 순서를 사용한다.

## 캐릭터 원인과 수정

이전 표시 로직은 조연 초상을 필터링한 뒤에도 주인공 초상을 듣는 상태로 남겼다. 관리의 결과 설명도 npc 대사로 분류되어 있어 비활성 주인공이 남을 수 있었다. 이전 scene의 DOM을 상속하는 문제는 아니었다. 매번 재구성하는 캐릭터 목록의 표시 조건이 원인이었다.

명시적인 presentation/characterStageMode로 설명과 대화를 구분했다. 대사 본문이나 speakerType/characterId는 삭제·변경하지 않았다.

- `ch02_policy_reason` ‘양인으로 돌아가다’: 관리의 신분 판정 문장에 `presentation='description'`. 배경+기존 내레이션 UI만 표시. 다음 길상·도윤·주인공 대화는 정상 표시.
- `ch02_inspection`: 관리의 조사 취지 설명 문장에 같은 설명 표시. 다른 실제 발화는 정상 표시.
- `ch02_reign_titles`, `ch02_reign_followup`: 기존 ambient-rumor 연출에는 `characterStageMode='hidden'`. 연호 소문/역사 설명에 캐릭터 레이어를 만들지 않음.
- CH.03 전체의 narration/description/history/result 및 내적 독백: 현재 문장과 표시 정보를 기준으로 캐릭터 레이어 숨김. `stageCast`로 명시한 특수 연출은 scene 수준 숨김의 예외로 유지.
- 실제 도윤/NPC 대화: 상대 왼쪽, 주인공 오른쪽, 발화자 선명/청자 흐림. 최신 요청의 NPC 대화 규칙에 따라 앞선 ‘주연만 표시’ 제한을 제거.
- 새 quiz scene: 대화 캐릭터 미표시. 문제 진행 로직은 캐릭터 필터와 독립.

관리 판정 → 길상 대화 → 속마음 → 선택 반응 → 결과 설명 → 역사 정리 → 퀴즈의 실제 클릭 이벤트 순서로 캐릭터 숨김/복원을 추가 검증했다.

## 보존·검증

- `npm test`: 전체 통과. CH.03 모든 분기 324경로의 문제 연결, 네 구간 각 3문항 확인.
- 전체 이벤트 처리 기반 CH.03 플레이에서 12문항 모두 정답 / 모두 오답 각각 완료. 선택·판정·해설·지식 보상·답변 전후 재로드·원래 스토리 복귀·다음 챕터 해금·복습 확인.
- 기존 일반 scene 36개의 스토리·대사·선택·결과·분기·배경을 SHA-256 비교로 보존 확인. 변경 허용 필드는 학습 연결/캐릭터 표시 메타데이터만이다.
- CH.01·CH.02·CH.03의 기존 문제 데이터 75항목 전체 SHA-256 보존 확인.
- CH.03 154개 실제 대화/선택 결과 프레임에서 좌우 슬롯·발화 강조·숨김 및 저장 검증. 숨겨야 하는 설명 프레임도 별도 검사. 기존 이미지 38개 해시 동일.
- `npm run build`: 통과. 필수 파일 24개, 준비 이미지 321개.
- `git diff --check` 및 모바일 스크립트 문법 검사 통과.
- 실제 모바일 Chrome 시각 검수는 `spawn EPERM`으로 차단되어 미완료. 실제 브라우저에서 플레이했다고 주장하지 않는다.

## 변경 파일

- `dist/chapter-split.js`: 여섯 대비 문항, 네 학습 세트, 12 quiz scene, 설명 표시 메타데이터.
- `dist/app.js`: 설명의 내레이션 UI/캐릭터 숨김, quiz 단계 기록, CH.03 고정 문제 순서.
- `dist/sw.js`: 최신 캐시 버전.
- `tests/ch02-ui-test.cjs`, `tests/ch03-sourced-quiz-test.cjs`: CH.03 전체 플레이/출제/저장/복습.
- `tests/ch03-character-slots-test.cjs`: 전체 캐릭터 및 실제 숨김→재등장 순서.
- `tests/ch03-character-mobile-test.cjs`, `tests/mobile-full-play-test.cjs`: 모바일 검증 기대값.
- `tests/verify.cjs`, `tests/story-audit-test.cjs`, `tests/ch01-expansion-test.cjs`, `tests/exam-bank-test.cjs`: 새 scene/문항 수, 기존 콘텐츠 보존.
- `tests/fixtures/ch03-stage-protected.json`, `tests/fixtures/ch03-original-question-hashes.json`: 수정 전 보호 기준.
- `docs/CH03_LEARNING_BLOCKS_REPORT.md`: 이 보고서.
