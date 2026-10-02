# CH.03 문제 배치 개선 결과

기준 main: `197ada051c1a2c7ed13db064b08f61506299935c`

본편 12 → 17문제, 복습 12 → 24문제. 기존 24개 문항을 먼저 조사한 뒤 기존 13개와 새 워밍업/기억 확인 4개를 본편에 사용했다. 기존 7개 문항은 복습에 계속 제공하며, 비활성 문항 8개를 재활성화했다. 기존 실제 기출 6개 모두 보존했다. 기존 스토리 36장면의 대사·선택지·효과·연결과 캐릭터 표시, 기존 이미지 38개가 보존 검사에서 통과했다.

## 사건별 문제 배치

| 사건 이후 | 문제 수 | 문항 | 복귀 장면 |
|---|---:|---|---|
| ch02_market 선택 결과 이후 | 2 | ch03-practice-king-949, ch03-practice-kings-flow | ch02_life_path |
| ch02_jump_956 | 1 | ch03-practice-king-956 | ch02_shop_956 |
| ch02_policy_memory | 3 | ch03-practice-nobi-basic, ch02-review-01, ch02-test-01 | ch02_noble_night |
| ch02_noble_night | 1 | ch03-practice-nobi-power | ch02_jump_958 |
| ch02_ssanggi | 3 | ch02-test-02, ch03-practice-gwageo-king, ch03-practice-gwageo-purpose | ch02_exam_eve |
| ch02_hyunwoo_official | 1 | ch02-test-robes | ch02_reign_titles |
| ch02_reign_followup | 3 | ch02-test-03, ch02-test-04, ch02-official-77-advanced-14 | ch02_purge |
| ch02_night_discussion | 3 | ch02-test-05, ch02-test-06, ch03-official-68-advanced-11 | ch02_complete |

연호와 최종 종합 구간은 쉬운 기존 연습 2개 뒤 검증된 기출 1개를 배치해 각 3문제로 구성했다. 시간 범위가 넓은 71·76회 문항 등은 복습으로 옮겨 초반 난이도를 낮췄다. 같은 questionId를 본편에서 중복 출제하지 않는다. 문제/선택지/정답/해설을 재작성하지 않고 학습 연결·활성화·표시 필드만 조정했다. 새 문제는 현재 왕 949년, 세 왕의 앞뒤 흐름, 956년 기억 꺼내기, 과거제를 처음 시행한 왕 등 기존 은행에 없던 4개다.

## 전체 플레이 순서

삶의 선택은 세 경로 모두 동일한 역사 사건과 문제로 합류한다. 아래는 첫 선택 경로 기준이며, 실제 선택지는 모두 유지했다.

```text
ch02_transition — 삼십일 년
→ ch02_shop_exterior_949 — 도윤의 가게
→ ch02_reunion_949 — 여전한 두 사람
→ ch02_market — 왕이 바뀐 나라
→ CHOICE — 광종 / 성종 / 공민왕 / 현종
→ QUIZ ch03-practice-king-949 — 949년 현재 고려를 다스리고 있는 왕은?
→ QUIZ ch03-practice-kings-flow — 위 세 왕의 순서를 바르게 정리한 것은?
→ ch02_life_path — 고려에서 나의 자리
→ CHOICE — 도윤의 장사를 계속 돕는다 / 독립해서 내 일을 찾는다 / 글과 제도를 더 공부한다
→ ch02_jump_956 — 일곱 해 뒤
→ QUIZ ch03-practice-king-956 — 7년이 지나 956년이 되었다. 우리가 지금 살고 있는 고려의 왕은?
→ ch02_shop_956 — 조금 더 커진 가게
→ ch02_dispute — 도윤이 아는 사람
→ ch02_trust — 그냥 두고 갈 수는 없어
→ CHOICE — 알겠어. 같이 도와주자 / 잠깐. 먼저 증거부터 찾아보자 / 괜히 귀족 집안과 엮이면 위험해
→ ch02_inspection — 폐하의 명이다
→ ch02_policy_reason — 양인으로 돌아가다
→ CHOICE — 호족들이 거느리는 사람이 줄어든다 / 호족들의 군사력이 더 강해진다 / 왕의 힘이 약해진다
→ ch02_policy_memory — 노비안검법
→ QUIZ ch03-practice-nobi-basic — 광종이 실시한 노비안검법의 내용으로 옳은 것은?
→ QUIZ ch02-review-01 — 이 정책의 효과로 가장 적절한 것은?
→ QUIZ ch02-test-01 — 이 상황을 추진한 왕의 다른 정책으로 옳은 것은?
→ ch02_noble_night — 귀족의 분노
→ QUIZ ch03-practice-nobi-power — 노비안검법으로 호족이 반발한 이유를 가장 적절하게 설명한 것은?
→ ch02_jump_958 — 두 해 뒤
→ ch02_exam_notice — 새로운 시험, 현우의 꿈
→ ch02_three_way — 세 사람이 처음 웃은 날
→ ch02_ssanggi — 후주에서 온 사람, 쌍기
→ QUIZ ch02-test-02 — 이 인물과 정책의 연결로 옳은 것은?
→ QUIZ ch03-practice-gwageo-king — 쌍기의 건의를 받아 고려에서 과거제를 처음 시행한 왕은?
→ QUIZ ch03-practice-gwageo-purpose — 광종이 과거제를 시행하여 기대한 정치적 효과로 가장 적절한 것은?
→ ch02_exam_eve — 잠들지 못하는 현우
→ CHOICE — 넌 충분히 준비했어 / 떨어져도 다시 보면 되잖아 / 시험 전에 문제 하나 풀어볼래?
→ ch02_exam_day — 현우의 시험
→ ch02_official_robes_walk — 서로 다른 빛깔의 옷
→ ch02_hyunwoo_official — 관리의 옷을 입은 현우
→ QUIZ ch02-test-robes — 공복을 제정한 고려의 왕은?
→ ch02_reign_titles — 거리에서 들은 새 연호
→ ch02_reign_followup — 광덕에서 준풍으로
→ QUIZ ch02-test-03 — 광덕에 대한 설명으로 옳은 것은?
→ QUIZ ch02-test-04 — 위 두 연호를 차례로 사용한 왕은?
→ QUIZ ch02-official-77-advanced-14 — 이 문화유산을 활용한 탐구 주제로 가장 적절한 것은?
→ ch02_purge — 사라진 큰손
→ ch02_night_discussion — 세 사람에게 일어난 변화
→ QUIZ ch02-test-05 — 이 변화들이 공통으로 향한 정치적 방향은?
→ QUIZ ch02-test-06 — 이 장면들을 하나의 흐름으로 가장 잘 정리한 것은?
→ QUIZ ch03-official-68-advanced-11 — (가) 왕의 재위 시기에 있었던 사실로 옳은 것은?
→ ch02_complete — 사십 년이 넘는 세월
→ ch02_night_reflection — 물에 비친 얼굴
→ ch02_mystery — ???
→ ch02_memory_retrieval — 각자의 삶을 바꾼 장면
→ ch02_chapter_clear — 왕의 나라
→ CHAPTER 03 CLEAR
```

## 변경 전 CH.03 전체 문제 조사

| questionId | relatedSceneId | resumeStoryId | historicalEventId | isOfficial | sourceType |
|---|---|---|---|---|---|
| ch02-test-01 | ch02_policy_memory | ch02_exam_69_10 | gwangjong-956-nobi | false | exam_style |
| ch02-test-02 | ch02_ssanggi | ch02_exam_74_11 | gwangjong-958-gwageo | false | exam_style |
| ch02-test-03 | ch02_reign_titles | ch02_exam_76_50 | gwangjong-reign-titles | false | exam_style |
| ch02-test-04 | ch02_reign_followup | ch02_exam_77_14 | gwangjong-reign-titles | false | exam_style |
| ch02-test-05 | ch02_night_discussion | ch02_exam_78_11 | gwangjong-authority | false | exam_style |
| ch02-test-robes | ch02_hyunwoo_official | ch02_reign_titles | gwangjong-official-robes | false | exam_style |
| ch02-test-06 | ch02_memory_retrieval | ch02_realization | gwangjong-authority | false | exam_style |
| ch02-review-01 | ch02_policy_memory | ch02_chapter_clear | gwangjong-956-nobi | false | exam_style |
| ch02-review-02 | ch02_memory_retrieval | ch02_chapter_clear | gwangjong-authority | false | exam_style |
| ch02-review-03 | ch02_night_discussion | ch02_chapter_clear | goryeo-early-kings | false | exam_style |
| ch02-review-04 | ch02_reign_followup | ch02_chapter_clear | goryeo-early-kings | false | exam_style |
| ch02-review-05 | ch02_memory_retrieval | ch02_chapter_clear | gwangjong-authority | false | exam_style |
| ch02-official-74-advanced-11 | ch02_exam_74_11 | ch02_exam_eve | goryeo-foundation-918 | true | official_exam |
| ch02-official-76-advanced-50 | ch02_exam_76_50 | ch02_reign_followup | goryeo-foundation-918 | true | official_exam |
| ch02-official-77-advanced-14 | ch02_exam_77_14 | ch02_purge | goryeo-foundation-918 | true | official_exam |
| ch02-official-78-advanced-11 | ch02_exam_78_11 | ch02_complete | goryeo-foundation-918 | true | official_exam |
| ch03-official-68-advanced-11 | ch02_night_discussion | ch02_complete | goryeo-foundation-918 | true | official_exam |
| ch03-official-71-advanced-11 | ch02_ssanggi | ch02_exam_eve | goryeo-foundation-918 | true | official_exam |
| ch03-practice-nobi-basic | ch02_policy_memory | ch02_noble_night | gwangjong-956-nobi | false | original_advanced_practice |
| ch03-practice-nobi-power | ch02_policy_memory | ch02_noble_night | gwangjong-956-nobi | false | original_advanced_practice |
| ch03-practice-nobi-source | ch02_policy_memory | ch02_noble_night | gwangjong-956-nobi | false | original_advanced_practice |
| ch03-practice-gwageo-basic | ch02_ssanggi | ch02_exam_eve | gwangjong-958-gwageo | false | original_advanced_practice |
| ch03-practice-gwageo-purpose | ch02_ssanggi | ch02_exam_eve | gwangjong-958-gwageo | false | original_advanced_practice |
| ch03-practice-symbols-basic | ch02_reign_followup | ch02_purge | gwangjong-reign-titles | false | original_advanced_practice |

## 실제 기출 보존

- ch02-official-74-advanced-11: 제74회 심화 11번 — 복습
- ch02-official-76-advanced-50: 제76회 심화 50번 — 복습
- ch02-official-77-advanced-14: 제77회 심화 14번 — 본편 및 복습
- ch02-official-78-advanced-11: 제78회 심화 11번 — 복습
- ch03-official-68-advanced-11: 제68회 심화 11번 — 본편 및 복습
- ch03-official-71-advanced-11: 제71회 심화 11번 — 복습

## 검증

- `npm test`: 기존 CH.01~12 자동 검사 통과.
- `npm run build`: 정적 PWA 24파일, 준비된 이미지 321개 검사 통과.
- CH.03 선택 경로 324개 및 선택지 16개 연결 확인.
- CH.03 실제 클릭 핸들러로 17문제 전부 정답/전부 오답의 두 흐름과 매 문항 답변 전후 저장 복원, 해설, 지식 보상, 복귀, CHAPTER CLEAR 확인.
- 복습 24문제, 오답노트, 재플레이, 다음 챕터 이동 확인.
- 앱 내 브라우저 390px에서 CH.03 전체 UI 플레이. 375·390·430px 문제 화면에 가로 넘침·깨진 이미지 없음. 새로고침 후 문제 이어하기 확인. 실제 첫 문제는 오답으로, 이후 16문제는 정답으로 검수.
- 배포 후 기존 기기의 캐시 갱신을 위해 서비스워커 캐시 버전 증가.

## 수정 파일

제품: `dist/chapter-split.js`, `dist/app.js`, `dist/sw.js`. 테스트: `tests/ch02-ui-test.cjs`, `tests/ch03-sourced-quiz-test.cjs`, `tests/verify.cjs`, `tests/story-audit-test.cjs`, `tests/exam-bank-test.cjs`, `tests/ch01-expansion-test.cjs`, `tests/mobile-full-play-test.cjs`, `tests/ch03-character-mobile-test.cjs`, 문항/스토리 보존 fixture 2개. 보고서: `docs/CH03_QUIZ_PACING_REPORT.md`.
