# CH.01 캐릭터·의상 연속성 감사

## 기준 캐릭터

- 도윤의 단일 기준은 `DOYUN_CANONICAL`이며 기준 이미지는 `dist/assets/characters/doyun_neutral.png`입니다.
- 표정은 `doyun_neutral`, `doyun_smile`, `doyun_surprised`, `doyun_suspicious`, `doyun_serious`, `doyun_worried` 여섯 장만 사용합니다.
- 첫 민가 장면에서도 데이터의 `characterId`는 `doyun`입니다. 이름을 모르는 서사를 위해 화면에만 `낯선 청년`으로 표시합니다.
- `stranger_*` 포트레이트는 레거시 확장용이며 현재 CH.01 플로우에서 도윤 대신 사용하지 않습니다.

## CH.01 도윤 등장 감사

| sceneId | illustrationId / 실제 배경 | 도윤 표현 |
|---|---|---|
| `house` | `goryeo-house` / `goryeo-house-empty.png` | `doyun_worried`, `doyun_neutral`; 화면 이름만 `낯선 청년` |
| `outfit_question` | `goryeo-house-question` / `goryeo-house-empty.png` | `doyun_neutral`, `doyun_suspicious`, `doyun_serious`; 네 선택 결과도 `doyun_*` |
| `outfit_gift` | `goryeo-house` / `goryeo-house-empty.png` | `doyun_serious`, `doyun_neutral`, `doyun_smile` |
| `doyun` | `doyun-intro.png` | `doyun_serious`, `doyun_suspicious` |
| `status` | `status-first.png` | `doyun_neutral`, `doyun_surprised` |
| `life_choice` | `life-choice.png` | `doyun_neutral`, `doyun_serious`; 네 선택 결과도 `doyun_*` |
| `route_songak` | `route-songak.png` | `doyun_smile` |
| `route_royal` | `route-royal.png` | `doyun_surprised` |
| `route_context` | `route-context.png` | `doyun_serious` |
| `night` | `first-night-goryeo.png` | 배경 속 주인공은 고려복, 도윤은 `doyun_neutral` 레이어 |

장면 속에 다른 얼굴의 남성이 박혀 있던 기존 `goryeo-house.png`, `goryeo-house-question.png`는 현재 매핑에서 제외했습니다. 두 민가 장면은 인물을 제거한 단일 배경 위에 같은 도윤 포트레이트를 합성합니다.

## 주인공 의상 상태

`playerOutfit`은 표정·포즈와 분리된 저장 필드입니다.

- 시작: `modern`; `modern-clothes`는 `equipped`.
- `outfit_gift` 대사 1~6: 계속 `modern`.
- 대사 7 `아이템 획득 · 고려 평민복`: `goryeo_commoner`로 전환.
- 전환 후: `goryeo-commoner-clothes`는 `equipped`, `modern-clothes`는 `stored`.
- 이후 CH.01과 CH.02: 대사 표정에 맞춰 `CHARACTER_ASSET_MAP.player.outfits.goryeo_commoner`에서만 선택.
- 저장/새로고침: `playerOutfit`, 인벤토리, 호환 플래그를 함께 복원.
- v6 이하 세이브: 현재 장면과 대사 커서를 기준으로 의상을 보정하며 현대복 아이템은 삭제하지 않음.

## 교체·재사용한 오류 장면

현대복 주인공이 배경에 박혀 있던 아래 장면은 같은 역사적 공간의 깨끗한 배경과 고려복 캐릭터 레이어 조합으로 변경했습니다.

- `village-reveal` → `route-village.png`
- `village-rumor` → `status-first.png`
- `memory-wanggeon` → `title-foundation.png`
- `market-later-three-kingdoms` → `doyun-intro.png`
- `route-songak-carry`, `route-songak-talk` → `route-songak.png`
- `route-village-help`, `route-village-call`, `route-village-leave` → `route-village.png`
- `route-caravan-work`, `route-caravan-negotiate`, `route-caravan-goods` → `route-caravan.png`
- `thief-chase`, `thief-block`, `thief-alley` → `thief-start.png`
- `thief-ignore` → `thief-aftermath.png`
- `future-flow` → `title-foundation.png`
- `chapter-complete` → `route-songak.png`

`first-night`만 장면 구도를 보존하기 위해 주인공의 현대복을 고려 평민복으로 직접 수정한 `first-night-goryeo.png`를 사용합니다. `embeddedCharacterIds: ['player']`로 표시해 플레이어 포트레이트가 중복되지 않게 하고 도윤 포트레이트는 정상 표시합니다.

## 미래 확장 규칙

`CHARACTER_ASSET_MAP`은 `characterId → ageVariant → outfit → expression`을 기준으로 확장합니다. 도윤의 나이 변화나 다른 복식이 필요할 때는 기존 `young/commoner` 매핑을 덮지 말고 새 `ageVariant` 또는 `outfit` 묶음을 추가합니다. 스토리는 `characterId`와 `expression`만 지정하고 화면 좌우 및 실제 파일 선택은 렌더러가 상태에서 결정합니다.
