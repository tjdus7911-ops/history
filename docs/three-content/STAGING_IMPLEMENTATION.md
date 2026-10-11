# 삼국 상세 연출 연결 및 검증 기록

작성일: 2026-10-11 (UTC)

## 현재 적용 범위

확정 대본의 218개 씬과 2,777개 작성 발화를 읽어, 발화 ID와 선택 ID에 따라 현재 장면의 소품·초상 동작·배경·기록책 표시를 결정하는 `THREE_STAGING`을 연결했다. 대사 원문, 발화 순서, 선택 결과, 저장 데이터, 기출 데이터는 바꾸지 않는다. 화면을 다시 그리거나 같은 저장 위치로 복귀하면 같은 표시 결과를 반환하며, 자동으로 다음 대사를 읽거나 본문 커서를 바꾸지 않는다.

현재 생성 결과는 명시 조건 **270개**, 독립 소품 **27종**, 손 동작 **2종**, 저장된 동작 초상 **7종**, 장면 배경 **10상태**, 정확한 글자·구조를 표시하는 SVG **3개**다. 동작 초상 중 최초의 연우 단독 부축 포즈 1종은 파일과 제작 기록만 보존되며, 현재 장면에서는 신체 접점이 있는 연우·어머니 페어를 사용한다. 상세 연출 생성 기록에 포함된 고유 래스터 파일은 21개이며, 이미 교체된 배경·포즈도 원본 보존을 위해 이 수량에 포함된다. 최신 수량의 기준 파일은 `staging-runtime-audit.json`이다.

61개 독립 인물 제작과 기존 29개 모습의 몸 보완은 별도 작업이다. 90개 모습이 있다는 사실을 상세 연출 완료로 바꾸어 세지 않는다. 초상 정보는 `fullbody-portrait-generation.json`과 `three-complete-art.json`, 수동 피부 얼굴 계측은 `principal-face-anchor-audit.json` 및 별도 반복 인물·독립 포즈 감사에 기록한다. 몸의 전체 실루엣 crop과 얼굴 크기용 영역은 서로 다른 메타데이터다.

## 연결 파일과 API

| 파일 | 역할 |
|---|---|
| `scripts/three-staging-runtime.js` | 현재 발화·선택에서 표시 결과를 계산하는 순수 함수 원본 |
| `scripts/build-three-staging.py` | 원문 ID·원본 해시·이미지 경로·범위·배경과 표면 좌표를 검증하고 런타임 생성 |
| `docs/three-content/staging-cues.json` | 정확한 시작·끝 발화, 현재 선택과 이전 선택에 따른 연출 조건 |
| `docs/three-content/staging-prop-generation.json` | 소품 27종의 이미지 범위·원본 해시·생성 지시문 |
| `docs/three-content/staging-acting-generation.json` | 손 동작·동일 인물의 초상 변형·배경 상태와 생성 근거 |
| `docs/three-content/prologue-support-pair-generation.json` | 연우·어머니의 실제 접점이 있는 페어와 중복 어머니를 뺀 한 줄 전용 배경 |
| `docs/three-content/staging-detailed-setting-inputs.json` | 무덤·불국사·석굴암·창고·관청의 다섯 상세 배경 생성 지시문과 보존 해시 |
| `docs/three-content/staging-setting-composition-retries.json` | C11 소·쟁기와 C21 문서 표지의 세로 화면 구도 보완 |
| `scripts/build-three-setting-surfaces.py` | 원본 배경을 수정하지 않고 정확한 구조·표지 SVG를 생성 |
| `docs/three-content/staging-setting-surface-inputs.json` | 배경 절대 좌표와 표지 글자, 공식 근거 출처 |
| `docs/three-content/staging-setting-surface-generation.json` | SVG·해당 배경 해시와 좌표계, 실제 화면 검증 대기 상태 |
| `docs/three-content/portrait-face-application-audit.json` | 90개 얼굴 계측의 실제 적용, 15 PNG·전체 crop·clip 보존 및 7 동작 포즈 검증 |
| `docs/three-content/staging-runtime-audit.json` | 전체 218씬의 원문 연출, 연결 조건, 기록 발화와 검증 제한 |
| `docs/three-content/staging-completion-ledger.json` | 자동·원본 파일·실제 화면 검증의 구분 및 후속 연출 작업 |
| `dist/three-staging.js`, `dist/three-staging.css` | 실제 서비스가 읽는 생성 결과와 삼국 안의 비상호작용 표시 |
| `tests/three-staging-test.cjs` | 모든 작성 발화, 분기 연속성, 반복 렌더·불변성 검사 |
| `tests/three-staging-integration-test.cjs` | 실제 HTML에 배우·포즈·배경이 연결되는지와 새 VM 복원 검사 |

통합 UI는 `context`, `resolve`, `layers`, `actorVisibility`, `actorPresence`, `backgroundOverride`, `portraitOverride`, `portraitLayers`를 호출한다. 상세 배경의 글자와 단면은 기존 `layers()` 결과 안에 있으므로 추가 UI hook은 필요 없다. 서비스 로더·워커·빌드는 통합 담당이 관리한다.

```js
const source = STORIES["THR-C17-S04"]; // source.threeSource is the approved source
const presentation = {
  phase: "branch",
  entry: { lineId: "THR-C17-S04-B1-R03", speakerType: "player" },
  choiceId: "THR-C17-S04-B1",
  choicesByScene: { "THR-C07-S01": "THR-C07-S01-B2" }
};
const view = THREE_STAGING.resolve(source, presentation);
const background = THREE_STAGING.backgroundOverride(source, presentation);
const visualCast = THREE_STAGING.actorPresence(source, presentation);
const portrait = THREE_STAGING.portraitOverride(source, presentation, characterId);
```

`choicesByScene`의 값은 숫자 인덱스가 아니라 정확한 원문 선택 ID다. 현재 씬의 선택은 `choiceId`로 따로 전달한다. 이전 선택이 없거나 이전 형식의 숫자만 있다면 선택에서 얻는 물건을 추측하지 않는다. `actorPresence`는 발화를 추가하지 않는 시각 배우 목록이다. 같은 인물·같은 좌우 자리를 정리한 뒤 공통 기록/내레이션 숨김 규칙을 적용한다.

## 원문과 연결한 주요 조건

| 장면 | 구현한 경계 |
|---|---|
| CH07 S01 | M03부터 상자. B1 LABEL까지 유지, B1 R01에서 두고 간 뒤 제거. B2 R01에도 계속 있고 R02부터 보존한 상자로 유지. 선택 메뉴에서 이전 선택 결과를 미리 재생하지 않음 |
| CH07 S06 | 17년 뒤 새로 마련한 상자는 과거 CH07 S01의 두 선택과 관계없이 등장 |
| CH08 S08 | B1 R01–R03에서만 편지 전달소. 합류에서 기다리던 장소로 복귀. B2에는 전달소를 표시하지 않음 |
| CH15 S07 | B1 R01 또는 B2 R03에서 여울이 망치를 내려놓은 뒤 동일 얼굴·옷의 빈손 포즈. 합류에도 유지 |
| CH17 S04–S05 | S04 본선과 B2 R03까지 숨긴 손. B1 R03부터 붕대. 합류와 S05는 두 선택 모두 붕대 상태 |
| CH17 S04 B1 R03 | 앞선 미지정 동료 석공 때문에 듣는 해명이 빠지지 않도록 정확히 이 한 줄에만 왼쪽 시각 배우를 명시. B2·이전 발화·다른 씬에는 같은 presence를 강제하지 않음 |
| CH18 S01·S07 | B2 R03의 ‘그려 두면’ 제안에 완성된 그림을 미리 표시하지 않고 J01부터 표시. 후속 목격 기록/매듭 그림은 실제 이전 선택에 따름. 후속 편지는 원문상 공통 |
| CH22 S02·S04·S06 | 연락표·경로 기록은 S04 선택, 바늘함은 S02 B2에서 독립적으로 이어짐. 이전 선택이 없으면 그 소품 없음 |
| CH01 S08 | 작별 발화까지 연우 표시. J01의 118년 뒤 전환부터 퇴장. 기록·내레이션에 과거 인물이 남지 않음 |
| CH16 S03 | M09·M10만 기록책으로 표시 보정. 승인 JSON의 context와 대사 원문은 그대로. 선택 메뉴·분기·합류는 현장으로 복귀 |
| PRO-S03 | L01–L02 바닥의 책·원본 족보, L03 들어 올림, L04–L06 품에 든 책. L06만 연우·어머니 페어와 중복 어머니를 뺀 배경 |
| CH01 S01 | 아직 구조되지 않은 쓰러진 어머니의 후속 배경으로 돌아감. L06 페어 초상과 프롤로그 전용 배경이 남지 않음 |

소품은 실제 장면 그림으로 표시하고 카드·둥근 패널·아이템 이름 UI를 만들지 않는다. 의미명은 `data-*`와 접근성 속성에 남긴다. 시대 전환·기록 비교·구조 설명은 기존 맥락 표시 영역을 쓴다. 공통 소품은 기존 인물 바닥과 맞춘 PC 128px·모바일 116px 하단 여백과 접촉 그림자를 사용한다. 대사 패널보다 낮은 레이어를 유지하고, 대사 길이 때문에 물건 위치를 바꾸지 않는다.

## PRO-S03 L06의 물리적 부축과 얼굴 기준

최초 연우 단독 포즈는 실제 390px·PC 화면에서 배경 어머니와 손이 닿지 않았다. 새 `yeonwoo-mother-support-pair-v1.png`에는 같은 연우와 같은 어머니, 양팔의 접점과 두 사람의 발이 함께 들어 있다. 원본 PNG는 보존하며, 이 페어를 표시하는 L06 파생 배경에서만 앞쪽 어머니를 제거했다. 소녀·배급 줄·마을은 이어진다.

페어의 전체 원본 범위는 `{x:41,y:12,width:951,height:1489}`다. 얼굴 크기 기준은 연우의 피부 얼굴 `{x:329,y:119,width:146,height:117}`만 사용하며, 어머니의 아래쪽 얼굴은 공통 배우 크기 계산에 섞지 않는다. 같은 피부 기준으로 독립 전신과 책·부상·빈손 포즈도 따로 점검했다. 좌표는 원본 PNG 절대 좌표이며, 세로 늘이기나 이미지 픽셀 편집은 하지 않는다.

L01–L05에는 원래 배경, L06에는 페어 전용 배경, 다음 CH01에는 쓰러진 상태 배경과 평상시 연우가 나온다. L06에서 새로고침해도 같은 페어·배경을 반환한다. 서아의 책에 표시하는 족보 세 장은 원본 사진 그대로이며, 사진 면에서 원본 crop 원점을 한 번만 빼서 초상 안 상대 좌표를 계산한다.

## 추가 장면 배경과 정확한 표면

| 장면·대표 발화 | 현재 연결 | 범위와 검증 제한 |
|---|---|---|
| CH10 S03 M03 | 축조 중인 나무 덧널과 관, 설명용 층별 단면 SVG | 배경은 전체 씬. 단면은 main M03·M04만. M05부터 단면 제거. 현장을 완공 상태로 바꾸지 않음 |
| CH11 S01 M02 | 쉬고 있는 소·멍에·쟁기·밭의 세로 구도 v3 | 처음부터 두 선택·합류까지. 치료나 회복을 암시하지 않음. 실제 세로 화면에서 소 전체와 쟁기 읽힘 재확인 필요 |
| CH13 S03 M02 | 645년 목탑의 미완성 기둥·골조·비계·목재 | 기존 연결 배경 유지. 완성된 9층 탑을 보여 주지 않음. 통합 담당은 360px 실제 화면을 확인했으며 자세한 증거는 UI 검증 문서에서 관리 |
| CH17 S05 M02 | 다른 두 탑의 형태와 공사 중인 불국사 | 현장 대사부터 분기까지. J01·J02의 현대 기록에서는 이 배경 override 제거 |
| CH17 S06 M03 | 석재를 짜 맞추는 인공 석굴, 제작 중인 본존·둘레 조각 | 현장 전체에서 유지. 현대 유리·보호 시설 없음. 등불을 낮추는 정확한 손 동작은 이 배경만으로 완료되지 않음 |
| CH18 S03 M07·M08 | 청해진 창고의 지도·화물 표지와 거점 기능·시기 설명 | 지도는 개략도, 표지는 실제 상자의 종이에 표시. 형성 시기와 839년 활동 기록을 구분. 모든 거점의 동시 창설을 단정하지 않음 |
| CH21 S04 M05 | 3성·6부의 실제 문서 묶음 아홉 개와 정확한 한자 표지 | 실제 종이 좌표에 잉크만 추가. 원문에 없는 상세 직무나 관청 내부의 고고학적 배치를 주장하지 않음 |

정확한 표면 SVG는 1024×1536 배경 전체와 같은 좌표계다. UI에는 배경과 같은 `cover` 투영으로 표시하고, 인물·기존 말풍선보다 아래인 z-index 0과 `pointer-events:none`을 적용한다. SVG와 해당 배경의 해시를 함께 검증하며, 현재 배경이 다르면 표지를 그리지 않는다. 창고와 관청의 물건이 이미 배경에 있으므로 종전의 일반 화물 표지·연락 문서 소품을 중복해서 바닥에 띄우지 않는다. 원본 PNG 픽셀에 글자를 그리거나 다시 압축하지 않는다.

구조·표지의 근거는 생성 입력에 각각 기록했다. 무덤의 층별 관계는 [우리역사넷 고분 자료](https://contents.history.go.kr/data/pdf/eh/eh_r0080_0010.pdf), 발해 관서의 표기는 [『신당서』 발해전 원문](https://contents.history.go.kr/front/hm/print.do?levelId=hm_030_0080&tabId=01&treeId=010301&whereStr=)을 대조했다. 정당성은 원문 `政堂省`을 사용한다. 창고 거점의 기능은 [우리역사넷 교과서 자료](https://contents.history.go.kr/front/ta/view.do?levelId=ta_h71_0050_0010_0020_0020), 법화원의 활동 기록은 [839년 『입당구법순례행기』 발췌](https://contents.history.go.kr/front/hm/print.do?levelId=hm_034_0060&tabId=01&treeId=010302&whereStr=)와 [신라인 촌락·법화원 해설](https://contents.history.go.kr/mobile/km/view.do?levelId=km_030_0030_0030)을 대조했다. 원본 그림을 베낀 도식이나 당시 실물 문서의 복제로 제시하지 않는다.

## 검증 결과의 구분

| 검사 | 결과 | 의미 |
|---|---|---|
| `node tests/three-staging-test.cjs` | 통과 | 218씬·2,919개 불변 프레임, 선택별 합류, 정확한 소품·배경 연속성, 재렌더 동일성, 입력·저장 불변성 |
| `python scripts/build-three-staging.py --check` | 통과 | 218씬·2,777발화·270조건, 27소품·2손·7포즈·10배경·3정확표면·원본 사진 3장 검증 |
| `python scripts/build-three-setting-surfaces.py --check` | 통과 | 각 SVG와 원본 배경의 해시, 표면 크기·글자 범위·생성 결과의 동일성 |
| 신규 PNG 원본·알파·개별 범위 | 확인 | 인물 정체성, 실제 접점, 파일 존재, 전체 실루엣, 원본 픽셀 보존. 실제 합성의 완료와 구별 |
| 정확 표면의 글자·구조 원본 렌더 | 확인 | 한자 누락·다른 정당성 표기·무덤 층 관계·범례 구분 점검. 실제 배경 위 합성은 별도 확인 |
| 실제 HTML 통합 테스트 | 별도 담당 통과 보고 | 해명 B1 R03·재접속·합류 및 PRO3 페어·배경 복귀를 포함한 74프레임·22개 새 VM 복원. 최종 통합 후 다시 검사 |
| 전체 UI 자동검사·빌드 | 통합 담당 | 218씬·3,841프레임·2,777발화·142선택·637단일탭·308기록 프레임의 기준을 유지하고 최종 snapshot을 검사 |
| 최신 상세 연출 실제 브라우저 합성 | 확인 대기 | 모바일·PC의 인물 크기, 신체 접점, 소·쟁기, 표지 위치와 배경/기록 복귀를 통합 담당이 확인 |

2,919와 3,841은 각 검사에서 반복 합류·선택 메뉴를 포함하는 방식이 다르므로 작성 발화 수가 아니다. 작성 발화는 2,777개다. 실제 화면 검증이 끝나기 전에는 시각 검증이나 원고 전체 연출의 완료 상태를 true로 바꾸지 않는다. 완료 ledger의 일곱 상세 장면 검토 상태는 통합 담당의 이번 실제 QA 뒤 갱신한다.

## 계속 남겨 두는 후속 작업

새 배경과 정적 소품의 수량으로 다음 행동을 완료 처리하지 않는다.

- PRO2의 종이 스침·바람, CH06 S05의 전사자 호명 때 작아지는 북소리 등 원문 음향. 목소리·새 대사·자동 대사 진행은 추가하지 않는다.
- CH17 S06의 등불 내리기처럼 물건과 손이 실제로 닿는 동작, 정밀한 주고받기·농기구 사용, 원고가 특정한 군중 배치. 소품 하나가 있다는 사실과 구체 행동은 분리한다.
- 최신 얼굴 계측을 반영한 배우와 PRO3 페어, 세로 배경·표지의 실제 합성. 전체 실루엣을 보존한 메타데이터 검사와 실제 화면 크기·가림 검사는 별개다.

미완 항목은 취소나 후보로 바꾸지 않고 다음 작업·검증 대상으로 유지한다. 전체 218개 원문 staging은 감사 JSON에 남아 있으며, 대표 일곱 장면만으로 나머지 모든 상세 행동이 완료되었다고 주장하지 않는다.
