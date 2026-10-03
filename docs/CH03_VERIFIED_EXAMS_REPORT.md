> 이전 작업의 기록입니다. 현재 문제 수와 NPC 대화 규칙은 [CH03_PDF_SURVEY.md](CH03_PDF_SURVEY.md)를 기준으로 확인하세요.

# CH.03 공식 기출 및 캐릭터 검수 결과

기준 main: 26d0a74b4fcb6e18a2039032a0f1a2d9d94c5ff8

## 분석과 변경

요청한 7개 파일과 README의 migration/save 규칙을 확인했습니다. CH.01·CH.02의 문제 큐 → 정오답 판정 → 해설 → 원래 스토리 복귀 방식을 재사용합니다. CH.03 광종의 ch02_* ID는 그대로 유지합니다.

변경 전 메인 17문제(공식 2, 자체 제작 15), 변경 후 메인 17문제(공식 6, 자체 제작 11), 9개 학습 구간입니다. 복습은 기존 순서 그대로 24문제(공식 6, 연습 18)를 유지합니다. CH.03 은행 28문제와 전체 은행 215문제 ID를 모두 보존했습니다. 새 문제는 만들지 않았습니다.

CH.03 등록 scene 총 54개: 기존 비퀴즈 scene 36개와 quiz scene 18개입니다. 신규 플레이의 메인 문제는 17개이며, 이전 저장용 synthesis-quiz-3을 별도 보존합니다. storyActive=false는 기존 ch02_realization과 저장 호환용 synthesis-quiz-3 두 개입니다. 등록 수는 실제 경로 방문 수와 다릅니다.

## 공식 기출 배치

| 기출 | 등장 scene | 해설 후 복귀 scene |
|---|---|---|
| 제74회 심화 11번 | ch02_policy_memory | ch02_noble_night |
| 제78회 심화 11번 | ch02_ssanggi | ch02_exam_eve |
| 제71회 심화 11번 | ch02_exam_day | ch02_official_robes_walk |
| 제76회 심화 50번 | ch02_reign_followup | ch02_purge |
| 제77회 심화 14번 | ch02_reign_followup | ch02_purge |
| 제68회 심화 11번 | ch02_night_discussion | ch02_complete |

74회는 노비안검법 정리, 78회는 쌍기·과거제 설명, 71회는 시험 당일, 76·77회는 연호·공복·왕권 정리, 68회는 개혁 종합 정리에서 나옵니다. 해당 등록 문제의 지문·보기·정답·해설·출처 필드는 해시 비교로 보존을 확인했습니다. 69회 심화 10번은 현재 CH.02 태조 학습에 연결되어 있어 이동하지 않았습니다.

공식 표시는 isOfficial/sourceVerified, 회차·연도·급수·문항 번호, sourceFile/answerFile이 모두 유효할 때만 허용합니다. 하나라도 누락한 8개 음성 검사에서 공식 라벨이 표시되지 않습니다. 연습은 [심화 연습] 자체 제작으로 표시합니다.

## 캐릭터 및 기존 콘텐츠

허용 standing 캐릭터 ID: player, doyun, hyunwoo. player와 대화하면 player 오른쪽, 상대 왼쪽입니다. 도윤↔현우 직접 대화는 도윤 왼쪽, 현우 오른쪽입니다. 발화자는 선명하고 상대는 흐리게 표시하며 두 명을 유지합니다. narration/thought/history/description은 캐릭터 레이어 0개입니다.

CH.03에서 steward, freed_man, official, noble, citizen, merchant는 설명 표시로 전환했습니다. 대사 문장과 원래 characterId는 보존하되 standing 초상화는 표시하지 않습니다. 선택 결과 대사에도 같은 규칙을 적용합니다. 기존 배경·캐릭터 이미지 파일은 삭제하거나 교체하지 않았습니다.

스토리 문장, 선택·분기·관계 변화, 역사 카드, 상태 보상과 기존 이미지 38개를 보존했습니다. CH.01·CH.02 scene/question 전체 해시 일치, v15 저장 migration, 기존 문제 큐·오답·복습 기록 보존을 확인했습니다.

## 검증

- npm test: 전체 통과. CH.03 전체 정답/전체 오답 흐름, 모든 문제 표시·선택·해설·보상·reload·스토리 복귀·챕터 완료와 다음 챕터 진입을 VM 렌더링/실제 앱 핸들러로 검사했습니다.
- CH.03 134개 발화/선택 결과 프레임의 슬롯·강조 및 설명 레이어 검사 통과.
- 공식 원문 데이터 보존, 출처 조건 누락 검사, CH.01·CH.02 데이터 불변 검사 통과.
- npm run build: 통과. 정적 PWA 24파일, 준비 이미지 321개, manifest/service worker 확인.
- git diff --check: 통과.
- 모바일 브라우저 검수 스크립트는 375/390/430px 및 390×844 전체 흐름에 맞춰 갱신하고 문법 검사했습니다.

**미완료 검수:** 이번 수정본의 실제 브라우저 수동 플레이와 390×844 화면 검수는 실행하지 못했습니다. 내장 브라우저 Node 런타임은 kernel asset 경로 오류(os error 3), Chrome Playwright는 spawn EPERM으로 차단됐습니다. 자동 렌더링 검사를 실제 모바일 화면 확인으로 보고하지 않습니다. 이전 수정본의 스크린샷도 이번 결과로 사용하지 않았습니다.

## 수정 파일

- dist/app.js: CH.03 제한 캐스트, 내레이션 처리, 엄격한 공식 기출 표시
- dist/chapter-split.js: 기존 공식 기출 학습 배치, 연결 메타데이터, 저장용 ID 보존
- dist/sw.js: 캐시 버전 갱신
- package.json: 공식 데이터 보존 검사를 테스트에 추가
- tests/ch02-ui-test.cjs, ch03-sourced-quiz-test.cjs, ch03-character-slots-test.cjs, ch03-character-mobile-test.cjs, mobile-full-play-test.cjs, story-audit-test.cjs: 현재 큐와 캐스트 규칙 검증
- tests/ch03-verified-contract-test.cjs 및 fixtures/ch03-verified-contract.json: 출처·원문·기존 챕터·저장 호환성 검사
- tests/fixtures/ch03-original-question-hashes.json: 최신 정상 기준의 원문 보존 해시
- docs/CH03_VERIFIED_EXAMS_REPORT.md: 본 검수 보고서
