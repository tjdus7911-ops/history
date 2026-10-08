# 7개 시대 시즌 기반 및 QA

2026-10-08 확인.

## 시즌 등록 상태

| 순서 | ID | 시즌 | 상태 | 주인공 ID | 진행률 키 |
|---:|---|---|---|---|---|
| 01 | `proto-kingdoms` | 눈떠보니 원삼국 | `COMING_SOON` | `protagonist_proto_kingdoms` | `proto-kingdoms` |
| 02 | `three-kingdoms` | 눈떠보니 삼국 | `COMING_SOON` | `protagonist_three_kingdoms` | `three-kingdoms` |
| 03 | `goryeo` | 눈떠보니 고려 | `AVAILABLE` | `protagonist_goryeo` | `goryeo` |
| 04 | `joseon` | 눈떠보니 조선 | `AVAILABLE` | `protagonist_joseon` | `joseon` |
| 05 | `empire` | 눈떠보니 대한제국 | `COMING_SOON` | `protagonist_korean_empire` | `empire` |
| 06 | `occupation` | 눈떠보니 일제강점기 | `COMING_SOON` | `protagonist_occupation` | `occupation` |
| 07 | `republic` | 눈떠보니 대한민국 | `COMING_SOON` | `protagonist_republic` | `republic` |

`dist/season-data.js`가 시즌명, 시대 범위, 순서, 소개, 학습 주제, 주인공 ID, 캐릭터 ID, 배너·배경 참조, 챕터 ID, 공개 상태와 진행률 키를 관리한다. 기존 고려 12개 챕터와 조선 23개 챕터는 원본 `CHAPTERS`에서 연결하며 콘텐츠를 복제하지 않는다.

## 캐릭터와 에셋 원칙

- 7개 시즌의 주인공 ID는 모두 다르다.
- 고려의 기존 `player` 호환 ID와 캐릭터·표정·의상 자산은 변경하지 않는다.
- 조선 여성 주인공의 기존 캐릭터·표정·의상 자산은 변경하지 않는다.
- 원삼국·삼국 주인공은 외형, 성별, 의상과 표정을 확정하지 않은 `asset-pending` 상태다. 고려 주인공 이미지를 대체 자산으로 사용하지 않는다.
- 대한제국·일제강점기·대한민국의 기존 배너 콘셉트는 유지하되, 주인공 프로필은 `concept-pending`, `appearanceLocked: false`로 관리한다.
- 홈은 현재 선택된 배너 한 장만 높은 우선순위로 요청한다. 다른 배너는 `loading="lazy"`이며 시즌 탐색만으로 표정 자산을 요청하지 않는다.

## 저장 호환성

- 기존 `meta.eraProgress.goryeo`와 `meta.eraProgress.joseon` 키를 그대로 사용한다.
- 신규 시즌은 서로 다른 `progressKey`를 사용하며 진행률을 공유하지 않는다.
- `seasonProgressVersion`을 부가 메타데이터로 추가하되 기존 `run`, `mainRun`, 완료 챕터, 기출·오답·암기 기록은 변경하지 않는다.
- 이전 저장에 선택 시즌 정보가 없거나 준비 중 시즌을 가리키면 고려를 안전한 기본값으로 사용한다.

## 자동 검증

- `tests/season-framework-test.cjs`: 정확한 7개 순서, 시즌별 독립 주인공·진행률 키, 준비 중 진입 차단, 배너 지연 로딩, 기존 저장 마이그레이션, 고려·조선 챕터 보존.
- `tests/editorial-ui-test.cjs`: 기존 고려·조선 UI, 진행률·이어하기, 캐릭터 자산 분리와 기존 학습 기능 회귀.
- `tests/season-mobile-test.cjs`: 360/390/412px 좌우 슬라이드·화살표·플레이스홀더·오버플로·지연 로딩·고려/조선 상세 진입.
- 전체 `npm test`, `npm run test:mobile`, `npm run build`에서 Story, 기출문제, 암기법, 타이머, 패스, 저장/이어하기 회귀를 확인한다.
