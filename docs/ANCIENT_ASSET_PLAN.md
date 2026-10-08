# 원삼국·삼국 자산 계획 및 구현 기록

## 제작 결과

| 구분 | 원삼국 | 삼국 | 합계 |
| --- | ---: | ---: | ---: |
| 주인공 현대복 | 1 | 1 | 2 |
| 주인공 역사 복식 표정 | 11 | 11 | 22 |
| 조력자/NPC | 4 | 7 | 11 |
| 현대 박물관 공용 배경 | 1 | 1 | 1 |
| 사건 배경 | 6 | 7 | 13 |
| 시즌 배너 | 1 | 1 | 2 |

모든 인물은 기존 고려 주인공과 다른 신규 정체성으로 제작했다. 원삼국 주인공은 남성, 삼국 주인공은 여성이다. 두 주인공의 표정 세트는 `neutral`, `smile`, `surprised`, `embarrassed`, `suspicious`, `angry`, `sad`, `determined`, `fear`, `worried`, `relieved` 11종이다.

## 저장 위치

- 주인공·NPC: `dist/assets/ancient/characters/`
- 사건 배경: `dist/assets/ancient/backgrounds/`
- 시즌 배너: `dist/assets/ancient/heroes/`
- 런타임 등록: `dist/ancient-data.js`, `dist/era-visuals.js`

주인공과 NPC는 투명 ARGB PNG로 유지했다. 배경과 배너는 1,672×941 JPEG(품질 84)로 변환해 16개 합계 약 8MB로 최적화했다.

## 배경과 챕터 연결

| 배경 | 주요 사용 범위 |
| --- | --- |
| `ancient-modern-museum.jpg` | 원삼국·삼국 CH.00 현대 도입부 |
| `proto-forest-road.jpg` | 원삼국 CH.00·01·07, 북방 교역로와 비교 정리 |
| `proto-buyeo-village.jpg` | 원삼국 CH.02 부여 |
| `proto-goguryeo-fortress.jpg` | 원삼국 CH.03·07, 삼국 CH.01 |
| `proto-okjeo-coast.jpg` | 원삼국 CH.04 옥저 |
| `proto-dongye-boundary.jpg` | 원삼국 CH.05 동예 |
| `proto-samhan-market.jpg` | 원삼국 CH.06·07 삼한과 전환 |
| `three-border-market.jpg` | 삼국 CH.00·01·06, 경계와 동맹 |
| `three-han-river.jpg` | 삼국 CH.02·03·04·06·10, 한강 유역 경쟁 |
| `three-gaya-workshop.jpg` | 삼국 CH.05 가야 철 생산과 교역 |
| `three-sabi-fortress.jpg` | 삼국 CH.03·08 백제 수도와 멸망 |
| `three-pyongyang-fortress.jpg` | 삼국 CH.02·07·09 고구려 전쟁과 멸망 |
| `three-unified-capitals.jpg` | 삼국 CH.04·11 신라와 통일 신라 |
| `three-balhae-harbor.jpg` | 삼국 CH.12·13 발해와 청해진 |

재사용은 같은 공간·사건 계열에만 한정했다. 대사 상단에는 매 장면 연도와 장소를 표시한다. `proto_guide`와 `three_companion`은 역사 인물이 아니라 기억의 길을 함께 이동하는 명시적 창작 안내자다. 그 밖의 지원 인물은 고유 이름을 주지 않고 ‘그 시대의 군관/기록관/전령’으로 표시해 같은 인물이 수백 년을 산다는 오해를 막았다.

## 생성 방식과 프롬프트 세트

OpenAI 기본 이미지 생성 도구를 사용했다. 기존 고려/조선 자산은 **렌더링 스타일 참조**에만 사용했고 얼굴·의상·정체성은 복제하지 않았다.

1. 주인공 앵커: “polished Korean educational 2D anime/cel-shaded, clean fine linework, modest realistic proportions, full-body transparent portrait”를 공통 스타일로 사용했다.
2. 표정 변형: 중립 앵커를 입력으로 사용해 “keep exact identity, face, hair, proportions, clothing; change only expression and subtle posture”를 적용했다.
3. 현대복: 동일 정체성을 유지한 채 복식만 현대의 재킷·청바지·운동화로 변경했다.
4. NPC: “brand-new, clearly distinct character identity; reference only for rendering style”을 명시하고 시대·직업별 도구와 복식을 지정했다.
5. 배경: “wide 16:9 visual-novel background, no people, no text, no modern objects, historically cautious reconstruction”을 공통 조건으로 사용했다.
6. 배너: 주인공 앵커와 해당 시즌 배경을 함께 참조해 오른쪽 인물/왼쪽 UI 여백의 16:9 구도로 제작했다.
7. 현대 도입 배경: “contemporary Korean national history museum ancient-history gallery after closing, no people, no readable text, subtle blue-gold time-slip atmosphere”로 두 시즌 CH.00 공용 공간을 제작했다.

시각 자료는 학습 장면을 돕는 교육용 재구성이다. 고고학적 실측 복원이나 특정 실존 인물의 초상으로 제시하지 않는다.
