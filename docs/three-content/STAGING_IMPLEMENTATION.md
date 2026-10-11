# 삼국 상세 연출 연결 및 검증 기록

작성일: 2026-10-11 (UTC)

## 현재 적용 범위

확정 대본의 218개 씬과 2,777개 작성 발화를 읽어, 발화 ID와 선택 ID에 따라 현재 장면의 소품·초상 동작·배경·기록책 표시를 결정하는 `THREE_STAGING`을 연결했다. 대사 원문, 발화 순서, 선택 결과, 저장 데이터, 기출 데이터는 이 모듈의 수정 대상이 아니다. 화면을 다시 그리거나 같은 저장 위치로 복귀하면 같은 결과를 반환한다.

첫 상세 연출 체크포인트에는 명시 연출 조건 246개, 독립 소품 27종, 서아의 손 동작 2종, 동일 인물의 동작 초상 3종, 배경 상태 2종이 들어 있다. 새 이미지 파일은 8개이며, 아틀라스의 개별 그림을 중복 파일로 세지 않았다. 프롤로그 3장의 후속 작업으로 책·족보 위치 변화와 서아의 책 포즈 2종, 연우 부축 포즈 1종을 추가해 현재 254조건·동작 초상 6종·새 파일 10개다. 최신 생성 수량은 `staging-runtime-audit.json`을 기준으로 확인한다.

이 문서는 61개 독립 인물 제작과 기존 29개 모습의 몸 보완에 대한 별도 결과를 상세 연출 완료로 대신 세지 않는다. 초상 90개는 `fullbody-portrait-generation.json`과 `three-complete-art.json`에, 상세 연출은 아래 파일에 기록한다.

## 연결 파일

| 파일 | 역할 |
|---|---|
| `scripts/three-staging-runtime.js` | 현재 발화·선택에서 표시 결과를 계산하는 순수 함수 원본 |
| `scripts/build-three-staging.py` | 원문 ID·원본 해시·이미지 경로·아틀라스 범위를 검증하고 런타임 생성 |
| `docs/three-content/staging-cues.json` | 정확한 시작·끝 발화, 현재 선택과 이전 선택에 따른 연출 조건 |
| `docs/three-content/staging-prop-generation.json` | 소품 27종의 이미지 범위·원본 해시·생성 지시문 |
| `docs/three-content/staging-acting-generation.json` | 손 동작·동일 인물의 초상 변형·배경 상태와 생성 근거 |
| `docs/three-content/staging-extra-generation.json` | 소품 연속성·해명 손·배급 줄 변경의 보조 생성 기록 |
| `docs/three-content/staging-prologue-generation-inputs.json` | 프롤로그의 연우 부축·서아 책 포즈 3종, 얼굴·사진 면의 원본 좌표와 생성 지시문 |
| `docs/three-content/staging-runtime-audit.json` | 전체 218씬의 원문 연출, 연결 조건, 기록 발화와 검증 제한 |
| `docs/three-content/staging-completion-ledger.json` | 자동·원본 파일·실제 화면 검증의 구분 및 후속 연출 작업 |
| `dist/three-staging.js` | 실제 서비스가 읽는 생성 결과 |
| `dist/three-staging.css` | 삼국 화면 안의 비상호작용 소품·손·미세 자세 표시 |
| `tests/three-staging-test.cjs` | 모든 작성 발화와 선택 연속성, 반복 렌더·불변성 검사 |

`dist/three-story-ui.js`의 연결부는 `context`, `resolve`, `layers`, `actorVisibility`, `backgroundOverride`, `portraitOverride`를 호출한다. `index.html`, 서비스 워커와 빌드의 로딩은 통합 담당이 연결한다.

```js
const presentation = {
  phase: "branch",
  entry: { lineId: "THR-C17-S04-B1-R03", speakerType: "npc" },
  choiceId: "THR-C17-S04-B1",
  choicesByScene: { "THR-C07-S01": "THR-C07-S01-B2" }
};
const scene = STORIES["THR-C17-S04"]; // scene.threeSource is the approved source
const view = THREE_STAGING.resolve(scene, presentation);
const background = THREE_STAGING.backgroundOverride(scene, presentation);
const portrait = THREE_STAGING.portraitOverride(scene, presentation, characterId);
```

`choicesByScene`의 값은 숫자 인덱스가 아니라 원문의 정확한 선택 ID다. 현재 씬의 선택은 `choiceId`로 따로 전달한다. 선택 기록이 없거나 이전 형식의 숫자만 있는 경우에는 그 선택에서만 얻는 소품을 추측해 만들지 않는다.

프롤로그 후속 연결에 쓰는 `actorPresence(source, presentation)`는 PRO-S03 L06에서만 같은 연우 ID의 왼쪽 시각 배우를 반환한다. 이 결과는 발화 배열에 넣지 않고 기존 배우 목록에만 병합한다. `portraitLayers(source, presentation, characterId)`는 L03 이후 서아의 책에 끼운 원본 사진 세 장을 반환하며, `three-portrait-image` 안에 삽입한다. 사진 면은 원본 시트 절대 좌표에서 해당 초상 범위의 백분율로 계산한다. 새 초상과 사진은 함께 동일 비율로 표시한다.

## 원문과 연결한 주요 조건

| 장면 | 구현한 경계 |
|---|---|
| CH07 S01 | 본선 M03부터 도구 상자 표시. B1 R01에서 두고 간 뒤 제거. B2 R02부터 건져 낸 상자로 유지. 선택 메뉴에서 과거 선택을 미리 재생하지 않음 |
| CH07 S06 | 17년 뒤 새로 마련한 상자는 과거 CH07 S01의 A/B에 관계없이 등장 |
| CH08 S08 | B1 R01–R03에서만 편지 전달소 배경. 공통 합류에서 원래 기다리던 장소로 복귀. B2에는 전달소를 표시하지 않음 |
| CH15 S07 | 여울이 망치를 내려놓는 B1 R01 또는 B2 R03부터 같은 얼굴·옷의 빈손 초상. 합류에서도 유지 |
| CH17 S04–S05 | S04 본선과 B2 R03까지 숨긴 손. B1 R03부터 붕대. 합류와 S05는 두 선택 모두 붕대 상태 |
| CH18 S01·S07 | 아이 신발·배 표시는 공통. B2 R03의 ‘그려 두면’ 제안에는 완성된 그림을 미리 표시하지 않고 J01 합류부터 표시. 후속 목격 기록 또는 매듭 그림은 실제 이전 선택에 따름. 후속 편지는 원문상 공통 지급 |
| CH22 S02·S04·S06 | 가족 연락표와 경로 기록은 S04의 실제 선택을 읽음. 바늘함은 S02 B2에서 독립적으로 이어짐. 이전 선택이 없으면 해당 소품 없음 |
| CH01 S08 | 작별 발화까지 연우 표시. J01의 118년 뒤 전환부터 퇴장. 기록/내레이션에 과거 인물이 남지 않음 |
| CH16 S03 | M09·M10 두 줄만 기록책 표시로 보정. 승인 JSON의 `presentationContext`와 대사 원문은 수정하지 않음. 선택 메뉴·분기·합류는 현장으로 복귀 |
| 프롤로그→CH01 S01 | 프롤로그의 기존 배경 파일 보존. CH01 첫 발화에는 아직 구조되지 않은 쓰러진 어머니의 후속 상태를 별도 경로로 연결 |

소품은 그림으로 장면 안에 표시하고 별도 카드, 둥근 패널, 아이템 이름 UI를 만들지 않는다. 의미명은 `data-*`·`aria-label`에 남긴다. 원고가 명시한 시대 전환·기록 비교 문구는 기존 맥락 표시 영역으로 반환한다. 대사 탭과 자동 진행은 상세 연출 모듈에서 호출하지 않는다.

CH07 S06의 실제 390px 화면에서 공통 소품을 `bottom:42%`에 놓으면 상자가 인물 가슴 높이에 떠 보이는 문제가 확인됐다. 일반 현장 소품의 바닥을 기존 `character-stage`의 바닥과 맞추어 PC 128px·모바일 116px 하단 여백에 고정하고 접촉 그림자를 추가했다. 대사 패널보다 낮은 레이어를 유지해 말풍선과 버튼을 덮지 않는다. 발화 길이에 따라 물건 위치를 다시 계산하지 않는다. 이 변경의 실제 화면 재검증은 별도로 필요하다.

## 검증 결과의 구분

| 검사 | 결과 | 의미 |
|---|---|---|
| `node tests/three-staging-test.cjs` | 통과 | 218씬·2,919개 불변 표시 프레임. 모든 작성 발화 및 선택별 공통 합류, 정확한 선택 연속성, 재렌더 동일성, 입력/저장 불변성 검사 |
| `python scripts/build-three-staging.py --check` | 통과 | 218씬·2,777발화·254조건과 27소품/2손/6초상/2배경, 원본 사진 3장의 연결·경로·SHA·범위 검사 |
| PNG 원본 파일 및 개별 셀 확인 | 실시 | 실제 그림, 동일 인물, 복식, 나이, 알파와 개별 범위 확인. 원본 픽셀 직접 편집 없음 |
| `npm run test:three:ui` | 통합 담당 통과 보고 | 연결 후 218씬·3,841프레임·2,777발화·142선택·637단일탭·308기록 프레임 검사. 이 결과를 실제 픽셀 배치 검사로 바꾸어 쓰지 않음 |
| `HISTORY_UI_REVIEW=1 npm run build` | 통합 담당 통과 보고 | 실제 서비스 로더와 테스트 미리보기 빌드 검사 |
| 새 상세 연출의 실제 브라우저 합성 | 확인 대기 | 모바일/PC 소품 위치, 손과 책 접점, 배경 분기 복귀, 초상 동작이 대사·선택지를 가리지 않는지 확인 필요 |

`2,919`와 `3,841`은 각 검사에서 반복 합류와 선택 메뉴를 포함하는 방식이 다르므로 작성 발화 수가 아니다. 원문 작성 발화는 2,777개다. 실제 화면 검증을 끝내기 전에는 감사 파일의 시각 검증 상태를 완료로 바꾸지 않는다.

## 후속 상세 연출

다음 항목은 이미 있는 일반 배경·소품 또는 조건 개수만으로 완료 처리하지 않는다. 정확한 미완 항목과 확인 범위는 `staging-completion-ledger.json`에서 유지한다.

1. PRO-S03 L01–L02 바닥의 책·족보, L03 들어 올림, L04 이후 품에 안은 책, L06 연우 부축의 실제 합성. 순수 API·이미지·조건과 실제 배우·사진 레이어 hook이 연결됐고, 통합 자동 검사를 통과했다. 배경 속 어머니를 두 번 그리지 않도록 연우만 별도 포즈로 만들었으며, 부축 손과 배경 어머니의 접점은 실제 화면 검증 대상이다.
2. 원고에서 특정 구조를 구분하는 장면 삽화: 무덤의 층별 구조, 서로 다른 석탑, 건설 전후의 목탑, 석굴 조립 과정, 관청 문서의 구체적 구분. 기존 일반 배경의 존재만으로 이 구조가 표현됐다고 판정하지 않는다.
3. 농기구를 실제 사용하거나 특정 물건을 건네고 받는 정밀한 손·몸 접점과 군중 배치. 작은 소품 그림을 표시한 것과 전체 행동 삽화는 별도로 확인한다.
4. 원문이 명시한 종이 스침·바람·멀어지는 소리 등의 음향. 현재 모듈은 음향 자산을 추가하거나 자동 재생하지 않는다.

미완 항목을 후보 또는 취소로 바꾸지 않으며, 다음 작업·검증 대상으로 유지한다. 최종 완료 여부는 원고의 해당 연출과 실제 화면을 함께 대조한 결과로 판단한다.


## Added physical settings after PR6

Two separately generated backgrounds now replace the generic setting only in their approved scene. `THR-C11-S01` uses `silla-ox-field` from M01 through the choice, both branches and join: the ox is resting, with a yoke, plough and tilled ground, and no treatment or recovery is implied. `THR-C13-S03` uses `hwangnyongsa-construction` from M01 through join: the wooden pagoda frame remains unfinished. The next scene resolves its ordinary background again.

The generator validates both immutable PNG hashes through `staging-acting-generation.json`; complete generation prompts and source reference hashes remain in `staging-setting-generation-inputs.json`. The regression test checks every line in these two scenes, both ox branches, the menu, join, JSON round-trip reload, and the following scene. Pure staging validation passes for 218 scenes and 2,919 immutable frames, with 256 explicit cues and four background states. These counts do not establish that the remaining authored architecture, crowd, hand or audio details are complete.

The generated source files were viewed. Actual browser crop/composition review for these two added settings remains pending; `runtimeVisualReviewComplete` stays false. The ox and plough must both remain readable in the vertical game crop. No canonical dialogue, exam, source-photo pixel or other-era changes were made.
