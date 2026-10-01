# 살아본 한국사 — 눈떠보니 고려

선택한 삶을 2D 스토리 장면으로 경험하고, 방금 만난 역사적 의미를 한국사 시험형 문제로 확인하는 모바일 우선 게임입니다. CH.01 **새로운 나라**는 918년 고려 건국과 후삼국, CH.02 **왕의 나라**는 광종의 노비안검법·과거제·광덕·준풍과 왕권 강화를 다룹니다.

## 실행과 검증

별도 패키지 설치가 필요 없는 정적 앱입니다.

```bash
npm start
npm run build
npm test
```

- `npm start`: `http://127.0.0.1:4173`에서 `dist/` 실행
- `npm run build`: HTML, CSS, JavaScript 구문과 실제 에셋 참조 검증
- `npm test`: CH.01·CH.02 전체 스토리 그래프, 108개 CH.02 조합 경로, 11개 문제, 저장·챕터 재시작·v4 마이그레이션, UI 이벤트 플로우 검증

## 모바일 대화 시스템

- NPC는 왼쪽, 플레이어는 오른쪽에 이름·개별 말풍선으로 표시되고, 인물은 배경 위 투명 상반신 레이어로 크게 등장합니다.
- `speakerType`(`npc`, `player`, `thought`, `narration`)이 정렬과 표현을 자동 결정합니다.
- 장면 데이터의 `expression`으로 `neutral`, `smile`, `surprised`, `worried`, `thinking`, `suspicious`, `serious`, `embarrassed`, `angry`, `sad` 표정을 선택합니다.
- 대사는 터치할 때 한 줄씩 나타나며 최근 2~3개만 남습니다. 독백과 서술은 별도 중앙 레이어로 표현됩니다.
- 선택 장면은 `NPC 대사 → 선택지 → 플레이어 대사 → NPC 반응 → 결과` 순서로 진행됩니다.
- 주인공은 현대 짙은 재킷·회색 후드(가방 없음) 차림의 9개 표정, 도윤은 고려 전기 상인 복식의 6개 표정을 사용합니다. 이후 의상 전환을 위해 `modern`/`goryeo` 포트레이트 맵을 분리했습니다.

## CH.01 플레이 플로우

1. 2026년 서울에서 918·936·900년 중 첫 기억 선택
2. 잠이 들고 918년 송악 길목의 민가에서 깨어남
3. 왕건의 건국 소문과 `STORY TEST 01`
4. 918년 고려 건국 확인과 `STORY TEST 02`
5. 장터에서 견훤·궁예·신라·왕건의 관계 경험과 `STORY TEST 03`
6. 송악·마을·상단·왕건 특수 선택으로 갈라지는 첫 인생 선택
7. 왕건과 호족의 관계를 다루는 `STORY TEST 04`
8. 도둑 공통 사건과 선택별 결과 일러스트
9. 후삼국 시대 상황을 구분하는 `STORY TEST 05`
10. 918·935·936년을 연결하는 `BOSS QUESTION`
11. 챕터 결과, 오답 요약, CH.02 광종 티저

문제는 공식 기출 문장이나 사료 이미지를 복제하지 않은 자체 제작형입니다. 사실관계는 [국사편찬위원회 우리역사넷의 후삼국 통일 자료](https://contents.history.go.kr/mobile/kc/view.do?code=kc_age_10&levelId=kc_i101800)를 기준으로 검토했습니다.

## CH.02 플레이 플로우

1. CH.01에서 얻은 직업·스탯·재산·도윤 관계를 이어받아 949년 개경으로 이동
2. 현재 왕을 떠올리는 4개 선택과 개경 시장의 노비 신분 분쟁
3. 956년 노비안검법의 개인적 결과와 호족 기반 약화·왕권 강화 연결
4. 이야기 직후 `STORY TEST 01`, 귀족의 반발과 야간 장면
5. 958년 쌍기의 건의와 과거제, 현우의 시험 선택 분기와 `STORY TEST 02`
6. 광덕·준풍 연호와 광종 구분 `STORY TEST 03·04`
7. 호족 숙청의 긴장과 태조·광종·성종 비교 `STORY TEST 05`
8. CH.02 결과와 오답 요약, 최승로·시무 28조·성종의 CH.03 티저

## 저장 구조

브라우저 저장 키는 기존과 동일한 `lived-history-v1`이며 내부 스키마 버전은 4입니다. 기존 v1·v2·v3 저장 데이터는 첫 로드에서 자동으로 마이그레이션합니다.

```text
state
├─ run   현재 플레이 회차
│  ├─ currentChapter, storyId, route, choices, flags
│  ├─ stats, wealth, job, relations
│  ├─ visited, pending, initialMemory
│  ├─ dialogueSceneId, dialogueCursor
│  └─ activeQuestionId, questionResults
└─ meta  누적 학습·수집 기록
   ├─ questionRecords, wrongQuestionIds, reviewedQuestionIds
   ├─ historicalEvents, cards, people
   ├─ achievements, endings, playthroughs, knowledgeMemory
   └─ completedRuns, completedChapters, chapterRecords
```

CH.02 다시하기는 CH.01 완료 기록과 이어받은 직업·스탯·관계를 보존한 채 CH.02의 선택·문제 진행만 초기화합니다. 문제 풀이 기록, 오답, 발견 사건·카드·인물, 업적과 완료 챕터는 `meta`에 남습니다.

## 일러스트 데이터

스토리 UI는 이미지 경로를 직접 하드코딩하지 않고 다음 연결을 사용합니다.

```text
story.sceneId → story.illustrationId → ASSETS[illustrationId]
choice.resultSceneId → choice.resultIllustrationId → ASSETS[resultIllustrationId]
question.relatedIllustrationId → ASSETS[relatedIllustrationId]
```

각 장면에는 `backgroundImage`, `characterImage`, `characterExpression`, `foregroundImage`, `sceneEffect`, `timeOfDay`, `music`, `ambientSound` 필드가 준비되어 있습니다. CH.01의 35개 장면·분기·퀴즈 연계 일러스트는 각각 별도 세로형 이미지로 연결되어 있으며 같은 배경을 무관한 장면에 반복하지 않습니다.

CH.01 제작 에셋은 [`docs/ASSET_REQUIRED.md`](docs/ASSET_REQUIRED.md), CH.02 신규·재사용 에셋은 [`docs/CH02_ASSETS.md`](docs/CH02_ASSETS.md)에 정리했습니다. 실제 생성에 사용한 웹툰 일러스트 공통 프롬프트는 [`docs/IMAGE_GENERATION_PROMPTS.md`](docs/IMAGE_GENERATION_PROMPTS.md)에 남겼습니다.

대사는 `characterId`, `characterName`, `speakerType`, `portrait`, `expression`, `dialogue`, `alignment` 구조를 사용합니다. 제작 완료된 주인공·도윤 표정과 추후 필요한 단역 NPC 에셋, 캐릭터 일관성 기준은 [`docs/CHARACTER_ASSET_REQUIRED.md`](docs/CHARACTER_ASSET_REQUIRED.md)에 정리했습니다.

## 파일 구조

- `dist/data.js`: CH.01 데이터, v4 다중 챕터 저장 모델과 변경 함수
- `dist/ch02-data.js`: CH.02 장면·대화·선택·문제·에셋 데이터
- `dist/app.js`: 두 챕터 공용 순차 대화/선택 렌더링, 결과·누적 기록·챕터 재시작
- `dist/style.css`: 기존 반응형 디자인
- `dist/v2.css`: 다시하기, 분산 문제, 챕터 결과 UI
- `dist/dialogue.css`: 모바일 메신저형 좌우 말풍선, 비주얼노벨 캐릭터 레이어, 독백, 선택지 UI
- `dist/assets/scenes/`: CH.01·CH.02 장면용 세로형 2D 웹툰 일러스트
- `dist/assets/characters/`: 주인공 9표정·도윤 6표정·현우 3표정 투명 PNG
- `dist/goryeo.png`: 홈/시대 선택용 고려 대표 이미지
- `dist/seoul-night.png`: 2026년 프롤로그 공부 장면
- `docs/ASSET_REQUIRED.md`: 실제 게임 일러스트 제작 결과·명세
- `docs/CHARACTER_ASSET_REQUIRED.md`: 캐릭터·표정 에셋 현황과 확장 명세
- `docs/CH02_ASSETS.md`: CH.02 에셋 사용·재사용 명세
- `docs/IMAGE_GENERATION_PROMPTS.md`: 최종 이미지 생성 프롬프트 기록
- `tests/verify.cjs`: 데이터/분기/저장 정책 검증
- `tests/ui-test.cjs`: 실제 클릭 이벤트 기반 전체 플레이 플로우 검증
- `tests/ch02-ui-test.cjs`: CH.02 이어받기·대화·선택·문제·완료·재시작 UI 검증
- `tests/build.cjs`: 정적 빌드 산출물 검증

현재 저장은 해당 브라우저와 주소에만 유지됩니다. 로컬 파일, localhost, 배포 주소의 세이브는 서로 별개입니다.
