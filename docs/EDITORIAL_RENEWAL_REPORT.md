# 최신 UI 및 시대별 주인공 적용 보고

기준 main: `9d82c86f04cfba3f2901c80bf37646a756bce0b4`. 2026-10-05 작업.

## 적용 범위

홈의 Hero Carousel / 오늘의 학습 / 최근 학습 / 최근 오답 / 4개 하단 탐색 구조를 유지하면서 최신 레퍼런스의 밝은 편집형 화면을 적용했다. 시대 학습, 문제, 오답노트, 기록 화면도 같은 디자인을 사용한다. 이후 받은 시대별 인물 레퍼런스를 최종 기준으로 삼아 고려 주인공을 나머지 네 시대에서 재사용하던 임시 배너를 교체했다.

**조선 이후 스토리와 챕터는 아직 저장소에 구현되어 있지 않다.** 이번 작업은 해당 시대의 독립된 캐릭터·복식·배경·Hero 및 향후 연결 구조를 준비한 것이며, 가짜 진행률·챕터·이어하기를 만들지 않았다. 미공개 시대는 준비중으로 표시한다. 조선 학습 화면도 조선 여성 Hero를 그대로 사용한다.

## 시대별 인물 및 경로

아래 경로는 `dist/` 기준이다. 각 Hero와 캐릭터 파일은 서로 다른 실제 이미지 파일이다.

| 시대 | protagonist ID | 성별 / 정체성 | 캐릭터 asset | Hero asset |
|---|---|---|---|---|
| 고려 | `protagonist_goryeo` | 남성 / 기존 주인공 | `assets/v2/characters/player-goryeo-neutral.webp` | `assets/editorial/heroes/goryeo.webp` |
| 조선 | `protagonist_joseon` | 여성 / 붉은 댕기와 땋은 머리, 평민 기록자 | `assets/editorial/protagonists/joseon-neutral.webp` | `assets/editorial/heroes/joseon.webp` |
| 대한제국 | `protagonist_korean_empire` | 남성 / 가르마와 남색 근대 양복, 서류 가방 | `assets/editorial/protagonists/empire-neutral.webp` | `assets/editorial/heroes/empire.webp` |
| 일제강점기 | `protagonist_occupation` | 여성 / 단발과 블라우스, 긴 치마와 책가방 | `assets/editorial/protagonists/occupation-neutral.webp` | `assets/editorial/heroes/occupation.webp` |
| 대한민국 | `protagonist_republic` | 남성 / 짧은 머리와 현대 재킷, 현대식 배낭 | `assets/editorial/protagonists/republic-neutral.webp` | `assets/editorial/heroes/republic.webp` |

기존 고려편의 `player`, 도윤 청년/중년/노년, 현우, 연 및 기타 캐릭터 파일·매핑을 변경하지 않았다. 고려 저장 데이터의 성별·나이·관계 설정도 그대로다. `protagonist_goryeo`는 신규 비주얼 카탈로그에서 기존 `player`를 참조하는 별칭이며 저장 ID를 교체하지 않는다.

## 배경과 일관성

| 배경 ID | 신규 배경 asset | 대표 시대 / 장소 / 시간 |
|---|---|---|
| `joseon-hanyang-1398` | `assets/editorial/backgrounds/joseon-hanyang-1398.webp` | 초기 한양 거리와 궁궐 주변 / 낮 |
| `empire-jeongdong-1905` | `assets/editorial/backgrounds/empire-jeongdong-1905.webp` | 대한제국 정동, 전차와 근대 건축 / 해질녘 |
| `occupation-gyeongseong-1930` | `assets/editorial/backgrounds/occupation-gyeongseong-1930.webp` | 1930년대 경성의 학교·생활 거리 / 낮 |
| `republic-seoul-2020` | `assets/editorial/backgrounds/republic-seoul-2020.webp` | 현대 서울 한강 / 저녁 |

이 배경들은 시대 대표 **콘셉트**다. 특정 건축물의 실측 복원 자료 또는 모든 연도의 공용 배경으로 취급하지 않는다. 고려의 기존 사건별 배경 파일과 연결은 모두 유지했다.

`era-visuals.js`는 `era`, `yearRange`, `location`, `event`, `timeOfDay`, 용도를 기록한다. 신규 시대의 `eraSceneVisuals()`는 다른 시대, 다른 연도 범위·장소·사건, 미등록 복식, 미등록 표정, 표지/콘셉트 배경을 실제 스토리 배경으로 자동 대체하지 않는다. 향후 장면별 배경이 검수된 후에만 `usage:'story'`로 등록한다. 새 인물은 현재 필요한 기본 표정만 제작했으며, 이후 표정·복식도 이 캐릭터 참조를 기준으로 추가한다.

최종 신규 에셋은 총 **13개 / 3,203,132 bytes (약 3.05 MiB)**: Hero 5개, 독립 투명 캐릭터 4개, 별도 배경 4개. 최신 인물 수정에서 Hero 4개를 교체했고 캐릭터 4개·배경 4개를 추가했다. Hero 780×1040, 캐릭터 최대 640×960, 배경 1280×720 WebP를 사용한다. 기본 제공 image_gen 도구로 생성했고 투명 알파를 보존했다. 전체 프롬프트, 입력 참조, 원본 출력, 최종 경로와 용량은 `EDITORIAL_HERO_MANIFEST.json`, `ERA_VISUAL_MANIFEST.json`에 기록했다.

## UI 구성 및 실제 데이터

- `editorial-ui.js`: 공통 헤더/탐색, `heroContent`, `editorialChapterRow`, 실제 기출 목록, 문제/회상, 오답 필터, 기록 표시.
- `editorial.css`: 밝은 종이색, 절제한 갈색 강조, 기존 Gowun Batang/Noto Sans KR 두 글꼴, 작은 시대 점 표시, 모바일 safe area.
- Carousel은 CSS scroll snap과 가로 스크롤을 사용한다. 점 버튼·키보드도 지원하며 모든 Hero는 `eraProtagonist(era).assetPaths.hero`를 참조한다. 홈과 시대 상세 화면이 같은 시대 이미지를 공유한다.
- 시대별 저장은 기존 저장 키·버전을 유지하며 `meta.eraProgress[era]`에 메인/리플레이 스냅샷을 구분하여 보관한다. 시대를 구경하는 것만으로 고려 진행이 바뀌지 않는다.
- 오늘의 학습은 실제 날짜가 저장된 제출 이벤트로 집계한다. 날짜가 없는 과거 누적 기록을 오늘의 기록으로 꾸미지 않는다.
- 최근 학습은 마지막 학습 시대/장면으로 연결한다. 오답은 문항 ID로 중복 제거하고 누적 오답 횟수 및 최근 날짜를 표시한다. 전체·최근 7일·반복 오답·실제 기출·시대·챕터·개념 필터를 제공한다. 정답 재풀이 후에도 과거 오답 이력은 유지한다.
- 준비도는 검증된 심화 기출의 최근 30회 정답률 55% + 중복 없는 기출 풀이 범위 25% + 완료 챕터 비율 20%다. 날짜 없는 저장은 누적 정답률을 사용한다. 표본 없음은 `—`이며 현재 제공 범위의 학습 지표임을 표시한다.
- 시대 진행률은 해당 시대의 실제 챕터 진행률 평균이다. 미공개 시대는 실제로 0%/준비중이며 샘플 수치를 사용하지 않는다.
- 답 선택과 제출을 분리했다. 선택만으로 정답·해설·보상을 공개하지 않는다. 기존 채점/보상/세트 결과/스토리 복귀를 재사용한다. 원본 문항 이미지는 기존 확대 UI를 사용하고 회상 링크는 실제 연결 장면의 현재 배경을 참조한다.
- 기존 학습 캘린더와 이야기·수집 기록은 기록 화면의 펼침 영역에 유지했다.

## 검증

- `npm test`: PASS. 기존 콘텐츠·캐릭터·분기·저장 호환성 검사 및 신규 UI/에셋 검사를 모두 통과했다.
- `npm run build`: PASS. 38개 필수 파일, 기존 ready 이미지 447개 및 시대별 신규 에셋 경로 검증.
- 새 UI로 CH.01~12 전체 자동 플레이: 정답 경로·오답 경로 PASS. 기본 경로에서 **208문제 / 실제 기출 85회 노출**을 기록했다. 세트, 해설, 스토리 복귀, 챕터 해금, 재접속, 리플레이 검사 포함. `EDITORIAL_PLAY_QUESTION_LOG_0.json`, `EDITORIAL_PLAY_QUESTION_LOG_1_wrong.json` 참조.
- 실제 인앱 브라우저 375×844 / 390×844 / 430×844 뷰포트에서 검수했다. 가로 문서 넘침 없음, 5개 Hero 모두 로드, 시대 점 버튼·가로 스크롤·키보드 전환, 조선 여성 Hero의 학습 화면 유지 확인.
- 모바일 기출 원본 전체 표시/확대, 53px 선택 버튼, 선택 후 제출 전 해설 미노출, 제출 후 정답/해설, 이전 문제 조회, 오답노트 복귀 및 이력 보존, CH.02 문제 세트 완료 후 기존 936년 스토리 복귀를 확인했다.
- 기록의 시대·기간 필터와 준비도 설명을 확인했다. 조선은 학습 기록 없음/0회로 표시되며 고려 값이 섞이지 않는다.
- 브라우저 모바일 뷰포트 검수이며 실제 휴대전화 기기 테스트는 아니다. 미구현 시대의 실제 챕터 플레이는 검수 대상으로 보고하지 않는다.
- `git diff --check`: PASS. 기존 고려 스토리/문제/캐릭터/배경 파일의 내용 변경 없음.

## 변경 파일

- `dist/editorial-ui.js`, `dist/editorial.css`, `dist/era-visuals.js` 신규
- `dist/index.html`, `dist/sw.js` 로드 순서 및 캐시 갱신
- `dist/assets/editorial/` 신규 최종 WebP 13개
- `package.json`, `tests/editorial-ui-test.cjs`, `tests/build.cjs`, `tests/v2-full-play-test.cjs`
- 기존 데이터 검사 로더 6개: `ch05-refinement`, `ch06-background`, `ch06-quiz`, `official-image-ui`, `v2-preservation`, `v2-renewal` (표현 레이어 분리)
- 본 보고서, 생성 manifest 2개, 새 UI 전체 플레이 로그 2개
