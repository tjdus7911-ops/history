# CH.06 문제 흐름 수정 검증 (2026-10-05)

기준 main: `63f46da271ec3a1b751838e12acc4ec8642ca318`.
CH.06의 문제 연결과 회상 배경만 수정했다. 기존 14개 스토리의 대사, 선택지, 연도, 다음 스토리, 캐릭터, 배경 파일은 그대로다. 다른 챕터의 스토리/문제/캐릭터/에셋과 SAVE_VERSION은 전후 데이터 비교로 동일함을 확인했다.

## 원인

1. `ch06-backgrounds.js`는 스토리 배경만 새 에셋으로 연결했으나 문제의 `relatedIllustrationId`는 이전 `late-war`, `late-water` 등을 가리켰다. 기존 활성 15문항 모두 관련 스토리의 실제 배경과 달랐다. 활성 문제와 이전 저장에서 등장할 수 있는 제외된 문제까지 실제 `STORIES[relatedSceneId].illustrationId`에 맞췄다.
2. 최신 main의 새 게임에서 77회 심화 11번은 출제되었지만 13번째였다. 그 앞 12문항은 모두 심화 연습이었다. 데이터 전체에 기출이 없다는 문제는 아니었다.
3. 이전 저장의 `ch06-practice-culture-01`은 기출로 교체되어 `retired`인 문항이다. 공통 저장 복원은 이 문항이 활성 문제이면 큐를 비우고 `resumeStoryId`로 건너뛰었다. 이전 배치에서는 이 과정으로 `ch06_rebuild`의 기출을 못 만나고 `ch06_woodblocks`로 이동할 수 있었다. CH.06의 유효한 진행 중 큐·정답/오답 피드백·원래 복귀 위치는 보존한다. 이미 푼 문제는 새 배치에서 중복하지 않고, 비어 있는 새 세트는 다음 스토리로 이동한다. 다른 챕터의 복원 동작은 그대로다.

## 집계

| 구분 | 수정 전 | 수정 후 |
|---|---:|---:|
| 실제 플레이 문제 | 15 | 22 |
| 실제 기출 | 1 | 8 |
| 심화 연습 | 14 | 14 |
| 원본 이미지 연결 기출 | 1 | 8 |
| 실제 출제 세트 | 5 | 13 |

새 CH.06 기출 연결 7개, 새 crop 5개, 기존 crop 재사용 3개(72/74/77회). 제외 상태의 이전 연습 1문항은 삭제하지 않았다. 그러므로 원시 데이터에는 23문항이 있지만 실제 신규 플레이에는 22문항이다.

## 실제 모바일 플레이 순서

390×844에서 대화/선택/문제/해설 버튼으로 처음부터 끝까지 플레이했다. 전 문항 회상 배경이 이미 플레이한 관련 장면의 배경과 일치했다. 79회 심화 13번은 일부러 오답을 선택해 정답 ①, 해설, 오답노트 및 다음 스토리 복귀를 확인했다. 나머지 21문항은 정답을 선택했다. 77회 문항에서 새로고침 후 같은 문제와 큐가 복원되었다.

| 순서 | 문제를 만나는 scene ID | 종류/출처 | question ID | 실제 회상 배경 |
|---:|---|---|---|---|
| 1 | `ch06_coup` | 실제 기출 76회 심화 14번 + 원본 이미지 | `ch06-official-76-advanced-14` | `assets/scenes/ch06-palace-coup.webp` |
| 2 | `ch06_coup` | 심화 연습 | `ch06-practice-coup-01` | `assets/scenes/ch06-palace-coup.webp` |
| 3 | `ch06_march` | 실제 기출 72회 심화 12번 + 원본 이미지 | `ch06-official-72-advanced-12` | `assets/scenes/ch06-khitan-crossing.webp` |
| 4 | `ch06_march` | 심화 연습 | `ch06-practice-coup-02` | `assets/scenes/ch06-palace-coup.webp` |
| 5 | `ch06_gangjo` | 심화 연습 | `ch06-practice-second-01` | `assets/scenes/ch06-tongju-defeat.webp` |
| 6 | `ch06_gangjo` | 심화 연습 | `ch06-practice-coup-03` | `assets/scenes/ch06-palace-coup.webp` |
| 7 | `ch06_gaegyeong` | 심화 연습 | `ch06-practice-second-02` | `assets/scenes/ch06-tongju-defeat.webp` |
| 8 | `ch06_burned_market` | 실제 기출 70회 심화 13번 + 원본 이미지 | `ch06-official-70-advanced-13` | `assets/scenes/ch06-burned-market.webp` |
| 9 | `ch06_burned_market` | 심화 연습 | `ch06-practice-second-03` | `assets/scenes/ch06-tongju-defeat.webp` |
| 10 | `ch06_flight` | 실제 기출 65회 심화 12번 + 원본 이미지 | `ch06-official-65-advanced-12` | `assets/scenes/ch06-naju-flight.webp` |
| 11 | `ch06_flight` | 심화 연습 | `ch06-practice-flight-01` | `assets/scenes/ch06-naju-flight.webp` |
| 12 | `ch06_yanggyu` | 심화 연습 | `ch06-practice-flight-02` | `assets/scenes/ch06-naju-flight.webp` |
| 13 | `ch06_rescue` | 심화 연습 | `ch06-practice-yanggyu-01` | `assets/scenes/ch06-yanggyu-rescue.webp` |
| 14 | `ch06_rescue` | 심화 연습 | `ch06-practice-yanggyu-02` | `assets/scenes/ch06-yanggyu-rescue.webp` |
| 15 | `ch06_rescue` | 심화 연습 | `ch06-practice-yanggyu-03` | `assets/scenes/ch06-yanggyu-rescue.webp` |
| 16 | `ch06_loss` | 심화 연습 | `ch06-practice-flight-03` | `assets/scenes/ch06-naju-flight.webp` |
| 17 | `ch06_rebuild` | 심화 연습 | `ch06-practice-culture-02` | `assets/scenes/ch06-city-reconstruction.webp` |
| 18 | `ch06_woodblocks` | 실제 기출 77회 심화 11번 + 원본 이미지 | `ch06-official-77-advanced-11` | `assets/scenes/ch06-tripitaka-workshop.webp` |
| 19 | `ch06_woodblocks` | 심화 연습 | `ch06-practice-culture-03` | `assets/scenes/ch06-city-reconstruction.webp` |
| 20 | `ch06_woodblocks` | 실제 기출 79회 심화 13번 + 원본 이미지 | `ch06-official-79-advanced-13` | `assets/scenes/ch06-tripitaka-workshop.webp` |
| 21 | `ch06_memory` | 실제 기출 74회 심화 12번 + 원본 이미지 | `ch06-official-74-advanced-12` | `assets/scenes/ch06-restored-gate.webp` |
| 22 | `ch06_warning` | 실제 기출 66회 심화 11번 + 원본 이미지 | `ch06-official-66-advanced-11` | `assets/scenes/ch06-northern-beacon.webp` |

## 기출 원본 검증

모든 아래 문항은 제공된 D: 문제지와 정답표에 대조했다. 원문 문항 번호/문제/보기/정답을 유지하고, 지도·사진·사료·보기까지 포함한 원본 crop을 기존 공통 UI로 표시한다. 검증 해시는 `tests/fixtures/ch06-official-exam-sources.json` 및 기존 원본 이미지 데이터에 저장했다.

| 회차 | 급수 | 번호 | 정답 | 개념 | 배치 scene | 이미지 | 원본 PDF/쪽 | 결과 |
|---:|---|---:|---:|---|---|---|---|---|
| 65 | 심화 | 12 | 3 | 현종·나주 피난·거란 2차 침입·나성 | `ch06_flight` | `assets/exams/ch06/65-advanced-12.webp` | 제65회 한국사능력검정시험 심화 문제지.pdf / 3쪽 | 문제·정답표·crop 확인 |
| 66 | 심화 | 11 | 2 | 광군·서희·강감찬·거란·사건 순서 | `ch06_warning` | `assets/exams/ch06/66-advanced-11.webp` | 66회 한국사_문제지(심화).pdf / 3쪽 | 문제·정답표·crop 확인 |
| 70 | 심화 | 13 | 4 | 현종·거란 2차 침입·나성 | `ch06_burned_market` | `assets/exams/ch06/70-advanced-13.webp` | 70회 한국사_문제지(심화).pdf / 3쪽 | 문제·정답표·crop 확인 |
| 72 | 심화 | 12 | 3 | 거란·현종·초조대장경·광군 | `ch06_march` | `assets/exams/ch05/72-advanced-12.webp` | 제72회 심화 문제지.pdf / 3쪽 | 문제·정답표·crop 확인 |
| 74 | 심화 | 12 | 3 | 만부교 사건·현종·나주 피난·서희·강동 6주·사건 순서 | `ch06_memory` | `assets/exams/ch05/74-advanced-12.webp` | 74회 한국사_문제지(심화).pdf / 3쪽 | 문제·정답표·crop 확인 |
| 76 | 심화 | 14 | 4 | 강조의 정변·왕규의 난·이자겸의 난·사건 순서 | `ch06_coup` | `assets/exams/ch06/76-advanced-14.webp` | 76회 한국사_문제지(심화).pdf / 4쪽 | 문제·정답표·crop 확인 |
| 77 | 심화 | 11 | 4 | 거란·귀주대첩·현종·초조대장경 | `ch06_woodblocks` | `assets/exams/shared/77-advanced-11.webp` | 77회 한국사_문제지(심화).pdf / 3쪽 | 문제·정답표·crop 확인 |
| 79 | 심화 | 13 | 1 | 현종·강조의 정변·나주 피난·초조대장경·귀주 대첩 | `ch06_woodblocks` | `assets/exams/ch06/79-advanced-13.webp` | 79회 한국사_문제지(심화).pdf / 3쪽 | 문제·정답표·crop 확인 |

새 이미지 5개 합계: 437,662바이트 (427.4 KiB), 평균 85.5 KiB. CH.06 기출 이미지 8개 합계: 655,648바이트, 평균 80.0 KiB. 동일 원본 이미지 중복 저장 없음.

## 검증

- `npm test`: 전체 회귀 테스트 통과.
- `npm run build`: 정적 PWA 빌드 통과.
- `tests/ch06-quiz-test.cjs`: 22문항 전부 정답/오답 두 경로, 순서, 관련 장면을 실제 먼저 보았는지, 렌더링 이미지, 정답표와 crop hash, 저장/복원, 이전 제외 문항 큐, 중복 방지, 빈 세트 이동, CH.07 연결 검증.
- `tests/ch06-background-test.cjs`: 두 선택 분기, 14개 스토리/13개 배경 및 22문항, 모든 기존 배경과 비문제 콘텐츠 보존 검증.
- 모바일 브라우저: 390×844 전체 플레이 22문항/8기출 확인, 양규 구출 회상 배경, 77회 새로고침/이미지 확대, 79회 오답 해설 및 CH.07 진입 확인. 긴 사료형 76회 14번과 그림형 77회 11번은 375/390/430px에서 가로 넘침·원본 이미지 비율·선택 UI를 추가 검증했다. 전체 22문항의 세 폭 반복 검사는 브라우저 연결 시간 초과로 끝내지 못했으며, 완료했다고 집계하지 않았다.
- 서비스 워커 셸에 새 CH.06 연결 스크립트 등록, 버전 v26으로 갱신. 저장 키/버전과 다른 챕터의 UI·콘텐츠는 변경하지 않음.
- CH.06 완료 화면의 문항 수와 세트 설명도 실제 1–3문항 배치에 맞게 표시.

CH.06 스토리는 1018년 흥화진 준비까지이며 귀주대첩 본편은 CH.07이다. 66회 사건 순서 문제와 79회 원본 자료에 제시된 1019년 귀주대첩은 그대로 유지하고, CH.06 스토리를 재작성하거나 CH.07을 옮기지 않았다.

## 변경 파일

- `dist/ch06-quiz-refinement.js`: CH.06만의 검증 문제, 큐/장면 연결, 회상 배경, 저장 큐 보존.
- `dist/app.js`: CH.06의 검증 기출 선택, 이미 답한 문제 중복 방지/빈 큐 이동, CH.06 완료 문항 집계 설명. 다른 챕터 분기는 기존 동작 유지.
- `dist/index.html`, `dist/sw.js`: 새 연결 스크립트 등록과 셸 캐시 갱신.
- `dist/assets/exams/ch06/{65-advanced-12,66-advanced-11,70-advanced-13,76-advanced-14,79-advanced-13}.webp`: 5개 원본 crop.
- `tests/fixtures/ch06-official-exam-sources.json`: PDF·정답표·crop 해시 및 원문/정답/출처.
- `tests/ch06-quiz-test.cjs`: 새 회귀 검증.
- `tests/ch06-background-test.cjs`, `tests/late-goryeo-ui-test.cjs`, `tests/official-image-ui-test.cjs`, `tests/build.cjs`, `package.json`: 실제 새 연결을 포함한 테스트/빌드.
- `docs/CH06_QUIZ_REPORT.md`: 이 검증 보고서.
