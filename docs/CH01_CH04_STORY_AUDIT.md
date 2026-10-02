# CH.01–CH.04 런타임 스토리 감사 (수정 전)

- 기준 커밋: `b26ef23` (2026-10-02 확인 당시 최신 `main`)
- 세이브 버전: `13`
- 범위: 파일명이 아니라 `chapterId → startStoryId → nextStoryId/choice → completeStoryId`를 따라 실제 플레이 가능한 장면만 집계
- 판정은 수정 전 상태에 대한 계획이다. `MOVE/REMOVE`는 장면의 역사·감정 내용을 버리는 뜻이 아니라 실제 기출 세트 재배치 또는 반복 래퍼 제거를 뜻한다.

## 핵심 발견

- CH.01의 927년 장면에 연결된 79회 심화 9번은 궁예 문제라 공산 전투 학습과 불일치한다.
- 사용자 후보인 66회 심화 9번은 PDF 대조 결과 궁예가 아니라 견훤·금산사·신검 문제이므로 CH.02가 맞다.
- CH.03과 CH.04의 메인 경로에 자체 제작 문제가 남아 있어, 메인 스토리에서는 제거하고 검증된 실제 기출만 사용해야 한다.
- CH.04는 자체 제작 문제 래퍼가 도윤의 노화·작별 감정선 직전까지 이어져 리듬을 끊는다. 성종 기출 세트를 정책 체험 직후로 모으고 이후 감정 구간에는 문제를 두지 않는다.
- 현재 문제 연속 큐는 존재하지만 “3문항 세트 완료 점수” 화면/요약이 없다.
- 제공된 검증 기출 수가 부족한 블록은 3개를 인위적으로 채우지 않고 `waiting_for_source`로 남겨야 한다.

## CH01 · 새로운 나라

- 수정 전: 전체 정의 35, 활성 16, 실제 도달 16

| CHAPTER | YEAR | SCENE ID | SCENE TITLE | HISTORICAL CONCEPT | STORY PURPOSE | CHARACTERS | QUESTION | ACTION |
|---|---:|---|---|---|---|---|---|---|
| CH01 | 2026 | `prologue` | 순서가 자꾸 헷갈린다 | goryeo-foundation-918 | 관계·태도 선택 및 인물 성격 강화 | player | 없음 | **KEEP** |
| CH01 | 2026 | `sleep` | 책장 너머로 | goryeo-foundation-918 | 서사 연결 및 시대 분위기 전달 | player | 없음 | **KEEP** |
| CH01 | 918 | `voice` | (무제) | goryeo-foundation-918 | 서사 연결 및 시대 분위기 전달 | unknown | 없음 | **KEEP** |
| CH01 | 918 | `house` | 처음 눈에 들어온 고려 | goryeo-foundation-918 | 관계 발전·복선·감정 회수 | doyun, player | 없음 | **SHORTEN** |
| CH01 | 918 | `outfit_gift` | 갈 곳부터 정합시다 | goryeo-foundation-918 | 관계 발전·복선·감정 회수 | doyun, player | 없음 | **SHORTEN** |
| CH01 | 918 | `rumor` | 왕건이 왕이 되었다 | 궁예_왕건, 후고구려, 고려건국, 918_936, goryeo-foundation-918 | 핵심 역사 개념을 사건·생활로 체험 | resident_a, resident_b, player | 없음 | **ENHANCE** |
| CH01 | 918 | `foundation` | 918년 · 고려 건국 | 918_936, goryeo-foundation-918 | 핵심 역사 개념을 사건·생활로 체험 | player | ch01-official-69-basic-10 | **ENHANCE** |
| CH01 | 918 | `ch01_trade_start` | 둘이 장사꾼이 되어 가는 동안 | goryeo-foundation-918 | 관계 발전·복선·감정 회수 | merchant_01, player, doyun | 없음 | **ENHANCE** |
| CH01 | 927 | `ch01_jump_927` | 아홉 해가 쌓인 뒤 | goryeo-foundation-918 | 연도 전환 및 시간 경과 체감 | player | 없음 | **ENHANCE** |
| CH01 | 927 | `ch01_gongsan` | 남쪽으로 가지 마시오 | 공산전투_고창전투, 신숭겸, ch01-gongsan | 핵심 역사 개념을 사건·생활로 체험 | doyun, player, merchant_01 | ch01-official-79-advanced-09 | **ENHANCE** |
| CH01 | 927 | `ch01_conflict` | 잃을 것이 없다는 말 | goryeo-foundation-918 | 관계 발전·복선·감정 회수 | player, doyun | 없음 | **KEEP** |
| CH01 | 927 | `ch01_reconcile` | 다시 같은 편 | goryeo-foundation-918 | 관계 발전·복선·감정 회수 | doyun, player | 없음 | **KEEP** |
| CH01 | 930 | `ch01_jump_930` | 다시 수레를 채우다 | goryeo-foundation-918 | 연도 전환 및 시간 경과 체감 | doyun, player | 없음 | **ENHANCE** |
| CH01 | 930 | `ch01_gochang` | 다시 열린 길 | 공산전투_고창전투, 고창전투, ch01-gochang | 핵심 역사 개념을 사건·생활로 체험 | merchant, player | 없음 | **ENHANCE** |
| CH01 | 930 | `ch01_belonging` | 우리가 이겼다는 말 | goryeo-foundation-918 | 관계 발전·복선·감정 회수 | doyun, player | 없음 | **ENHANCE** |
| CH01 | 930 | `ch01_clear_930` | 새로운 나라 | goryeo-foundation-918 | 챕터 감정 결산 및 클리어 | 없음 | 없음 | **KEEP** |

## CH02 · 하나가 된 나라

- 수정 전: 전체 정의 30, 활성 28, 실제 도달 23

| CHAPTER | YEAR | SCENE ID | SCENE TITLE | HISTORICAL CONCEPT | STORY PURPOSE | CHARACTERS | QUESTION | ACTION |
|---|---:|---|---|---|---|---|---|---|
| CH02 | 935 | `ch02_open_935` | 그로부터 5년 | goryeo-foundation-918 | 서사 연결 및 시대 분위기 전달 | 없음 | 없음 | **KEEP** |
| CH02 | 935 | `ch01_jump_935` | 익숙해진 장부 | goryeo-foundation-918 | 연도 전환 및 시간 경과 체감 | doyun, player | 없음 | **KEEP** |
| CH02 | 935 | `ch02_news_935` | 고려의 문을 두드린 사람 | goryeo-foundation-918 | 서사 연결 및 시대 분위기 전달 | merchant_01, doyun, player | 없음 | **ENHANCE** |
| CH02 | 935 | `ch01_gyeonhwon` | 적이 아군이 되다 | 견훤_신검, 금산사, ch01-gyeonhwon | 핵심 역사 개념을 사건·생활로 체험 | merchant_01, player, doyun | ch01-official-73-basic-10 | **ENHANCE** |
| CH02 | 935 | `ch01_silla` | 신라의 마지막 | 견훤귀순_경순왕귀순, ch01-silla | 핵심 역사 개념을 사건·생활로 체험 | merchant, player, doyun | ch01-official-74-advanced-10 | **ENHANCE** |
| CH02 | 936 | `ch01_jump_936` | 마지막 전쟁 앞에서 | goryeo-foundation-918 | 연도 전환 및 시간 경과 체감 | doyun, player | 없음 | **KEEP** |
| CH02 | 936 | `ch01_war_choice` | 평범한 사람의 몫 | goryeo-foundation-918 | 관계·태도 선택 및 인물 성격 강화 | doyun, player | 없음 | **KEEP** |
| CH02 | 936 | `ch01_war_supply` | 돌아올 수레의 자리 | goryeo-foundation-918 | 서사 연결 및 시대 분위기 전달 | doyun, player | 없음 | **KEEP** |
| CH02 | 936 | `ch01_victory` | 끝났다는 소식 | 일리천_후삼국통일, ch01-illyecheon | 핵심 역사 개념을 사건·생활로 체험 | merchant, doyun, player | ch01-official-76-advanced-10 | **ENHANCE** |
| CH02 | 936 | `ch01_unity` | 후삼국 통일 | 일리천_후삼국통일, goryeo-foundation-918 | 서사 연결 및 시대 분위기 전달 | 없음 | 없음 | **KEEP** |
| CH02 | 936 | `future_flow` | 우리가 지나온 다섯 장면 | 후삼국_사건순서, goryeo-foundation-918 | 핵심 역사 개념을 사건·생활로 체험 | player | ch01-official-70-advanced-10 | **MOVE** |
| CH02 | 937 | `ch01_integration` | 나라가 하나 된 다음 | ch01-integration | 핵심 역사 개념을 사건·생활로 체험 | player, doyun | 없음 | **ENHANCE** |
| CH02 | 937 | `ch01_sasimgwan` | 김부가 맡은 고장, 개경에 머문 아들 | 사심관_기인, 사심관, ch01-sasimgwan | 핵심 역사 개념을 사건·생활로 체험 | merchant, doyun, player | ch03-official-75-basic-12 | **ENHANCE** |
| CH02 | 938 | `ch01_refugee_family` | 북쪽에서 온 손님 | 발해유민, 서경_북진, goryeo-foundation-918 | 핵심 역사 개념을 사건·생활로 체험 | merchant, player, doyun | 없음 | **ENHANCE** |
| CH02 | 941 | `ch01_welfare` | 비어 가는 장바구니 | 취민유도, ch01-welfare | 핵심 역사 개념을 사건·생활로 체험 | merchant, doyun, player | 없음 | **ENHANCE** |
| CH02 | 943 | `ch01_jump_943` | 스물다섯 번째 해 | goryeo-foundation-918 | 연도 전환 및 시간 경과 체감 | 없음 | 없음 | **ENHANCE** |
| CH02 | 943 | `ch01_memory_943` | 평생 기억할 옷 | goryeo-foundation-918 | 관계 발전·복선·감정 회수 | doyun, player | 없음 | **ENHANCE** |
| CH02 | 943 | `ch01_taejo_death` | 나라를 연 왕이 떠나다 | goryeo-foundation-918 | 핵심 역사 개념을 사건·생활로 체험 | merchant, doyun, player | 없음 | **KEEP** |
| CH02 | 943 | `ch01_hunyo` | 열 가지 당부 | 훈요10조_시무28조, ch01-hunyo | 핵심 역사 개념을 사건·생활로 체험 | doyun, player | 없음 | **ENHANCE** |
| CH02 | 943 | `ch01_guild_seed` | 도윤상단이라는 이름 | goryeo-foundation-918 | 관계 발전·복선·감정 회수 | doyun, player | 없음 | **KEEP** |
| CH02 | 943 | `ch01_farewell` | 하나가 된 나라 | goryeo-foundation-918 | 챕터 감정 결산 및 클리어 | 없음 | 없음 | **KEEP** |
| CH02 | 936 | `ch01_war_news` | 소문과 소식 사이 | goryeo-foundation-918 | 서사 연결 및 시대 분위기 전달 | merchant, player | 없음 | **KEEP** |
| CH02 | 936 | `ch01_war_refugees` | 머물 수 있는 자리 | goryeo-foundation-918 | 서사 연결 및 시대 분위기 전달 | merchant, player, doyun | 없음 | **KEEP** |

## CH03 · 왕의 나라

- 수정 전: 전체 정의 36, 활성 36, 실제 도달 31

| CHAPTER | YEAR | SCENE ID | SCENE TITLE | HISTORICAL CONCEPT | STORY PURPOSE | CHARACTERS | QUESTION | ACTION |
|---|---:|---|---|---|---|---|---|---|
| CH03 | 949 | `ch02_transition` | 삼십일 년 | gwangjong-reforms | 연도 전환 및 시간 경과 체감 | player | 없음 | **KEEP** |
| CH03 | 949 | `ch02_shop_exterior_949` | 도윤의 가게 | gwangjong-reforms | 서사 연결 및 시대 분위기 전달 | player | 없음 | **KEEP** |
| CH03 | 949 | `ch02_reunion_949` | 여전한 두 사람 | gwangjong-reforms | 관계 발전·복선·감정 회수 | doyun, player | 없음 | **KEEP** |
| CH03 | 949 | `ch02_market` | 왕이 바뀐 나라 | gwangjong-reforms | 관계·태도 선택 및 인물 성격 강화 | doyun, player | 없음 | **KEEP** |
| CH03 | 949 | `ch02_life_path` | 고려에서 나의 자리 | gwangjong-reforms | 관계·태도 선택 및 인물 성격 강화 | doyun, player | 없음 | **KEEP** |
| CH03 | 956 | `ch02_jump_956` | 일곱 해 뒤 | gwangjong-reforms | 연도 전환 및 시간 경과 체감 | 없음 | 없음 | **KEEP** |
| CH03 | 956 | `ch02_shop_956` | 조금 더 커진 가게 | gwangjong-reforms | 서사 연결 및 시대 분위기 전달 | doyun, player | 없음 | **KEEP** |
| CH03 | 956 | `ch02_dispute` | 도윤이 아는 사람 | gwangjong-reforms | 관계 발전·복선·감정 회수 | steward, freed_man, doyun, player | 없음 | **KEEP** |
| CH03 | 956 | `ch02_trust` | 그냥 두고 갈 수는 없어 | gwangjong-reforms | 관계·태도 선택 및 인물 성격 강화 | doyun, player | 없음 | **KEEP** |
| CH03 | 956 | `ch02_inspection` | 폐하의 명이다 | gwangjong-reforms | 핵심 역사 개념을 사건·생활로 체험 | official, steward, freed_man, player | 없음 | **KEEP** |
| CH03 | 956 | `ch02_policy_reason` | 양인으로 돌아가다 | gwangjong-reforms | 역사 속 행동 선택과 결과 체험 | official, freed_man, steward, doyun, player | 없음 | **KEEP** |
| CH03 | 956 | `ch02_policy_memory` | 노비안검법 | 노비안검법, 광종_왕권강화, gwangjong-reforms | 핵심 역사 개념을 사건·생활로 체험 | player | ch02-test-01, ch02-official-69-advanced-10 | **MOVE** |
| CH03 | 956 | `ch02_noble_night` | 귀족의 분노 | gwangjong-reforms | 서사 연결 및 시대 분위기 전달 | noble, doyun, player | 없음 | **KEEP** |
| CH03 | 958 | `ch02_jump_958` | 두 해 뒤 | gwangjong-reforms | 연도 전환 및 시간 경과 체감 | 없음 | 없음 | **KEEP** |
| CH03 | 958 | `ch02_exam_notice` | 새로운 시험, 현우의 꿈 | gwangjong-reforms | 서사 연결 및 시대 분위기 전달 | citizen, hyunwoo, player | 없음 | **KEEP** |
| CH03 | 958 | `ch02_three_way` | 세 사람이 처음 웃은 날 | gwangjong-reforms | 서사 연결 및 시대 분위기 전달 | hyunwoo, doyun, player | 없음 | **KEEP** |
| CH03 | 958 | `ch02_ssanggi` | 후주에서 온 사람, 쌍기 | 쌍기_과거제, 광종_왕권강화, gwangjong-reforms | 핵심 역사 개념을 사건·생활로 체험 | citizen, doyun, player | ch02-test-02, ch02-official-74-advanced-11 | **ENHANCE** |
| CH03 | 958 | `ch02_exam_eve` | 잠들지 못하는 현우 | gwangjong-reforms | 관계·태도 선택 및 인물 성격 강화 | hyunwoo, doyun, player | 없음 | **KEEP** |
| CH03 | 958 | `ch02_exam_day` | 현우의 시험 | 쌍기_과거제, 광종_왕권강화, gwangjong-reforms | 핵심 역사 개념을 사건·생활로 체험 | hyunwoo, doyun, player | 없음 | **KEEP** |
| CH03 | 960 | `ch02_official_robes_walk` | 서로 다른 빛깔의 옷 | 광종_공복, gwangjong-reforms | 핵심 역사 개념을 사건·생활로 체험 | player | 없음 | **KEEP** |
| CH03 | 960 | `ch02_hyunwoo_official` | 관리의 옷을 입은 현우 | 광종_공복, 광종_왕권강화, gwangjong-reforms | 핵심 역사 개념을 사건·생활로 체험 | hyunwoo, player | ch02-test-robes | **ENHANCE** |
| CH03 | 960 | `ch02_reign_titles` | 거리에서 들은 새 연호 | 광덕_준풍, 광종_왕권강화, gwangjong-reforms | 핵심 역사 개념을 사건·생활로 체험 | merchant, player | ch02-test-03, ch02-official-76-advanced-50 | **ENHANCE** |
| CH03 | 960 | `ch02_reign_followup` | 광덕에서 준풍으로 | 광덕_준풍, 광종_왕권강화, gwangjong-reforms | 핵심 역사 개념을 사건·생활로 체험 | merchant, player | ch02-test-04, ch02-official-77-advanced-14 | **ENHANCE** |
| CH03 | 960 | `ch02_purge` | 사라진 큰손 | 호족_견제, 광종_왕권강화, gwangjong-reforms | 핵심 역사 개념을 사건·생활로 체험 | freed_man, doyun, player, hyunwoo | 없음 | **KEEP** |
| CH03 | 960 | `ch02_night_discussion` | 세 사람에게 일어난 변화 | 광종_왕권강화, 호족_견제, gwangjong-reforms | 핵심 역사 개념을 사건·생활로 체험 | doyun, freed_man, hyunwoo, player | ch02-test-05, ch02-official-78-advanced-11 | **ENHANCE** |
| CH03 | 960 | `ch02_complete` | 사십 년이 넘는 세월 | gwangjong-reforms | 서사 연결 및 시대 분위기 전달 | doyun, player | 없음 | **KEEP** |
| CH03 | 960 | `ch02_night_reflection` | 물에 비친 얼굴 | gwangjong-reforms | 관계 발전·복선·감정 회수 | player | 없음 | **KEEP** |
| CH03 | 960 | `ch02_mystery` | ??? | gwangjong-reforms | 관계 발전·복선·감정 회수 | player | 없음 | **KEEP** |
| CH03 | 960 | `ch02_memory_retrieval` | 각자의 삶을 바꾼 장면 | 노비안검법, 쌍기_과거제, 광종_공복, 광덕_준풍, 광종_왕권강화, gwangjong-reforms | 관계 발전·복선·감정 회수 | player | ch02-test-06 | **ENHANCE** |
| CH03 | 960 | `ch02_realization` | 한 방향으로 이어진 정책 | 광종_개혁종합, 광종_왕권강화, gwangjong-reforms | 관계 발전·복선·감정 회수 | player | 없음 | **MERGE** |
| CH03 | 960 | `ch02_chapter_clear` | 왕의 나라 | gwangjong-reforms | 챕터 감정 결산 및 클리어 | 없음 | 없음 | **KEEP** |

## CH04 · 나라의 틀

- 수정 전: 전체 정의 31, 활성 30, 실제 도달 30

| CHAPTER | YEAR | SCENE ID | SCENE TITLE | HISTORICAL CONCEPT | STORY PURPOSE | CHARACTERS | QUESTION | ACTION |
|---|---:|---|---|---|---|---|---|---|
| CH04 | 982 | `ch03_transition` | 스물두 번의 겨울 | seongjong-state-system | 연도 전환 및 시간 경과 체감 | 없음 | 없음 | **KEEP** |
| CH04 | 982 | `ch03_gaegyeong` | 커진 수도 | seongjong-state-system | 서사 연결 및 시대 분위기 전달 | player | 없음 | **KEEP** |
| CH04 | 982 | `ch03_guild_exterior` | 이름을 건 상단 | seongjong-state-system | 서사 연결 및 시대 분위기 전달 | player | 없음 | **KEEP** |
| CH04 | 982 | `ch03_dream_realized` | 결국 만들었네 | seongjong-state-system | 관계 발전·복선·감정 회수 | player, doyun | 없음 | **KEEP** |
| CH04 | 982 | `ch03_unchanged` | 흐른 사람, 멈춘 사람 | seongjong-state-system | 관계 발전·복선·감정 회수 | doyun, player | 없음 | **KEEP** |
| CH04 | 982 | `ch03_returning_merchant` | 절반만 돌아온 짐 | seongjong-state-system | 서사 연결 및 시대 분위기 전달 | merchant, doyun | 없음 | **KEEP** |
| CH04 | 982 | `ch03_provincial_problem` | 왕이 닿지 않는 곳 | seongjong-state-system | 서사 연결 및 시대 분위기 전달 | player, merchant, doyun | 없음 | **KEEP** |
| CH04 | 982 | `ch03_policy_choice` | 상단의 대응 | seongjong-state-system | 관계·태도 선택 및 인물 성격 강화 | doyun | 없음 | **KEEP** |
| CH04 | 982 | `ch03_hyunwoo_return` | 말하면 나타나는 사람 | seongjong-state-system | 서사 연결 및 시대 분위기 전달 | hyunwoo, player, doyun | 없음 | **KEEP** |
| CH04 | 982 | `ch03_seongjong_news` | 새 왕의 정비 | seongjong-state-system | 핵심 역사 개념을 사건·생활로 체험 | hyunwoo, player | 없음 | **KEEP** |
| CH04 | 982 | `ch03_choe_reform` | 스물여덟 가지 건의 | seongjong-state-system | 핵심 역사 개념을 사건·생활로 체험 | hyunwoo, player | 없음 | **ENHANCE** |
| CH04 | 982 | `ch03_twelve_mok` | 지방에 내려간 관리 | seongjong-state-system | 핵심 역사 개념을 사건·생활로 체험 | merchant, doyun, hyunwoo, player | 없음 | **ENHANCE** |
| CH04 | 982 | `ch03_gukjagam` | 나라가 사람을 가르치는 곳 | seongjong-state-system | 핵심 역사 개념을 사건·생활로 체험 | hyunwoo, player | 없음 | **ENHANCE** |
| CH04 | 982 | `ch03_exam_75` | 성종을 가리키는 세 단서 | seongjong-state-system | 학습 검증 후 이야기 복귀 | player | ch03-official-75-basic-10 | **MOVE** |
| CH04 | 982 | `ch03_policy_effect` | 제도가 길에 닿을 때 | seongjong-state-system | 핵심 역사 개념을 사건·생활로 체험 | merchant, doyun, player | 없음 | **KEEP** |
| CH04 | 982 | `ch03_trade_practice` | 상단이 겪은 지방의 문제 | seongjong-state-system | 학습 검증 후 이야기 복귀 | player | ch03-practice-02 | **REMOVE** |
| CH04 | 982 | `ch03_exam_practice_05` | 지방까지 닿는 왕의 명령 | seongjong-twelve-mok | 학습 검증 후 이야기 복귀 | 없음 | ch03-practice-05 | **REMOVE** |
| CH04 | 982 | `ch03_three_friends` | 세 사람의 저녁 | seongjong-state-system | 관계 발전·복선·감정 회수 | player, doyun, hyunwoo | 없음 | **KEEP** |
| CH04 | 982 | `ch03_choe_practice` | 개혁안을 올린 사람 | seongjong-state-system | 학습 검증 후 이야기 복귀 | player | ch03-practice-03 | **REMOVE** |
| CH04 | 982 | `ch03_exam_practice_06` | 스물여덟 가지 건의 | choe-seungro-simu-28 | 학습 검증 후 이야기 복귀 | 없음 | ch03-practice-06 | **REMOVE** |
| CH04 | 982 | `ch03_exam_practice_07` | 국가가 세운 교육 기관 | seongjong-gukjagam | 학습 검증 후 이야기 복귀 | 없음 | ch03-practice-07 | **REMOVE** |
| CH04 | 982 | `ch03_history_reflection` | 세 왕이 만든 흐름 | seongjong-state-system | 서사 연결 및 시대 분위기 전달 | hyunwoo, player | 없음 | **KEEP** |
| CH04 | 982 | `ch03_timeline_practice` | 태조에서 성종까지 | seongjong-state-system | 학습 검증 후 이야기 복귀 | player | ch03-practice-04 | **REMOVE** |
| CH04 | 982 | `ch03_exam_practice_08` | 성종의 통치 방향 | seongjong-state-system | 학습 검증 후 이야기 복귀 | 없음 | ch03-practice-08 | **REMOVE** |
| CH04 | 982 | `ch03_exam_practice_09` | 세 왕의 정책 구분 | goryeo-early-kings | 학습 검증 후 이야기 복귀 | 없음 | ch03-practice-09 | **REMOVE** |
| CH04 | 982 | `ch03_courtyard` | 처음에는 가게 하나였소 | seongjong-state-system | 관계 발전·복선·감정 회수 | doyun, player | 없음 | **KEEP** |
| CH04 | 982 | `ch03_weakening` | 느려진 하루 | seongjong-state-system | 관계 발전·복선·감정 회수 | doyun, player | 없음 | **KEEP** |
| CH04 | 982 | `ch03_farewell` | 오래 산 사람의 마지막 농담 | seongjong-state-system | 관계 발전·복선·감정 회수 | doyun, player | 없음 | **ENHANCE** |
| CH04 | 982 | `ch03_death` | 먼저 간 사람 | seongjong-state-system | 관계 발전·복선·감정 회수 | 없음 | 없음 | **KEEP** |
| CH04 | 982 | `ch03_legacy` | 남겨진 것 | seongjong-state-system | 챕터 감정 결산 및 클리어 | player | 없음 | **KEEP** |

## 수정 전 질문/에셋 요약

- 전체 질문: 66
- 활성 검증 기출: 13
- 활성 자체 제작: 20
- 등록 에셋: 64, 초상화 매핑: 89, 캐릭터 정의: 19
- 개별 캐릭터 매핑이 확인된 ID: player, doyun, hyunwoo, merchant_01
- 다인 주민·관리·피난민은 배경 연출을 우선하고, 반복 주요 인물 및 CH.01 부상 상인만 개별 스프라이트를 유지한다.

## 예정 구조 변경

- `QUESTION_POOLS`: 사건·왕·제도별 검증 기출 보관 및 개념/시대/연도/챕터 후보 재분류
- `QUESTION_SETS`: `afterSceneId`, `requiredCount`, `verifiedCount`, `missingQuestionCount`, `status`를 명시
- 준비된 세트는 미응시 기출 우선으로 3문항을 연속 출제하고, 부족 세트는 `waiting_for_source`로 기록하되 스토리를 막지 않는다.
- 마지막 문제 해설 뒤 `이번 기억 N / 3 정답`과 `이야기 계속`을 표시한다.
- 기존 scene ID를 최대한 유지하고, CH.04 도윤 독백만 새 안정 ID로 추가한다.
