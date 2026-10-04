# CH.06 배경 수정 검수 보고

기준 main: 0dd1ebca5d3277ac4aadfb4970f2adf92a9e2f67

14개 scene 전체를 읽고 연도·장소·시간대·사건을 확인했다. 기존 대사, 문제 15개(실제 기출 1개 + 심화 연습 14개), 정답/해설, 캐릭터, UI, 진행/저장 데이터는 변경하지 않았다. 새 전용 overlay는 backgroundImage / illustrationId / 선택 결과 resultIllustrationId만 수정한다. 모든 기존 에셋 파일과 기존 ASSETS 항목을 그대로 보존했다.

## 장면별 배경

아래 파일은 모두 `dist/assets/scenes/`에 있다.

| scene ID | 연도 | 장소 · 시간대 | 기존 배경 | 새 배경 |
|---|---:|---|---|---|
| ch06_coup | 1009 | 개경 궁성 · day | ch02-purge-night.png | ch06-palace-coup.webp |
| ch06_march | 1010 | 압록강 남쪽 · day | route-royal.png | ch06-khitan-crossing.webp |
| ch06_gangjo | 1010 | 통주 전선 · day | route-royal.png | ch06-tongju-defeat.webp |
| ch06_gaegyeong | 1011 | 개경 · day | ch06-gaegyeong-rebuild.png | ch06-gaegyeong-fire.webp |
| ch06_burned_market | 1011 | 불탄 개경 장터 · dawn | ch06-gaegyeong-rebuild.png | ch06-burned-market.webp |
| ch06_flight | 1011 | 나주로 향하는 길 · day | ch02-water-reflection-958.png | ch06-naju-flight.webp |
| ch06_yanggyu | 1011 | 흥화진과 퇴로 · day | route-caravan.png | ch06-yanggyu-rescue.webp |
| ch06_rescue | 1011 | 거란군의 퇴로 · day | route-royal.png | ch06-yanggyu-rescue.webp |
| ch06_loss | 1011 | 애전 전투 뒤 · day | ch02-purge-night.png | ch06-aejeon-loss.webp |
| ch06_rebuild | 1012 | 다시 세우는 개경 · day | ch06-gaegyeong-rebuild.png | ch06-city-reconstruction.webp |
| ch06_woodblocks | 1012 | 개경 인근 사찰 작업장 · morning | ch06-gaegyeong-rebuild.png | ch06-tripitaka-workshop.webp |
| ch06_memory | 1012 | 복구된 성문 · dawn | ch02-gaegyeong-market.png | ch06-restored-gate.webp |
| ch06_warning | 1018 | 북방 봉수대 · day | route-caravan.png | ch06-northern-beacon.webp |
| ch06_after | 1018 | 흥화진으로 가는 길 · dawn | ch02-water-reflection-958.png | ch06-heunghwajin-dam.webp |

양규의 두 구출 장면은 같은 사건·퇴로·낮 시간대이므로 한 배경을 공유한다. 그 외 정변, 국경 침입, 통주 패전, 수도 방화, 장터 폐허, 남쪽 피난, 애전 전투 뒤, 재건, 목판 제작, 복구 성문, 1018년 봉수, 흥화진 준비는 구분한다. CH.06 실제 내용에 없는 귀주대첩 장면을 추가하지 않았다.

## 제작 / 최적화

내장 imagegen으로 서로 다른 배경 13장을 제작했다. 주인공 고려 캐릭터와 기존 개경 배경을 참고하되 2D 선화와 부드러운 채색, 초기 고려의 목조/석조 공간, 세로 2:3 비율을 지정했다. 현대 시설·조선/일본풍·실사/3D·읽을 수 있는 글자·고정 주인공 그림을 제외했다. 구체적 프롬프트의 사건·공간·시간대는 위 표 및 생성 기록에 보관했다. 원본 PNG는 작업 공간 밖 생성 폴더에 보존하고, 게임에는 768×1152 WebP(quality 84)만 추가했다.

- 새 배경: 13장
- 총 용량: 3281334 bytes (3.13 MiB)
- 평균: 246 KiB
- 기존 배경/캐릭터 이미지 덮어쓰기 없음
- 이미지 로딩/캐시/표시 방식은 기존 공통 UI 사용, 서비스 워커 shell 버전만 갱신

흥화진의 소가죽·동아줄을 이용한 물길 준비는 [국사편찬위원회 고려사 강감찬 열전](https://db.history.go.kr/id/kr_094r_0010_0030_0060)을 참고했다. 이미지는 역사 스토리용 해석 일러스트이며 특정 유적의 고증 복원도는 아니다.

## 검증

- npm test: PASS (기존 전체 검사 + CH.06 배경 전용 회귀 검사)
- npm run build: PASS (346개 ready 이미지 존재 확인)
- CH.06 두 선택 분기 전체 14개 scene, 문제 15개 정답/오답/해설/스토리 복귀, 저장 migration, CH.07 진입: PASS
- overlay 전후 모든 다른 챕터 scene 전체 deep equality: PASS
- 모든 QUESTIONS / QUESTION_SETS / QUESTION_POOLS / CHAPTERS / CHARACTERS / PORTRAITS / CHARACTER_ASSET_MAP / SAVE_VERSION 및 기존 ASSETS 항목 동일: PASS
- 모바일 실브라우저 390×844 전체 플레이: 77회 진행/답변 조작으로 CHAPTER 06 CLEAR 도달, 13개 새 배경 모두 표시 확인
- 375×844 / 430×844: 각각 전체 14개 scene(총 28개 화면)에서 가로 넘침 없음, 장소/사건별 배경 및 발화 캐릭터 위치 확인
- 초기 로딩이 진행 중인 캐릭터 이미지는 로딩 완료 후 다시 확인/촬영, 전부 정상 로드됨
- 전체 장면 비교 이미지와 피난/불탄 수도/목판 작업장/흥화진 개별 화면에서 대사와 캐릭터 가독성 확인
- 브라우저 오류 로그: 없음

## 수정 파일

- dist/ch06-backgrounds.js: CH.06 배경만 연결
- dist/assets/scenes/ch06-*.webp: 위 표의 신규 13장
- dist/index.html: overlay script 로딩
- dist/sw.js: overlay cache 등록/버전 갱신
- tests/ch06-background-test.cjs: 전체 콘텐츠 보존과 진행 검증
- tests/build.cjs, tests/late-goryeo-ui-test.cjs, package.json: 새 데이터 파일 포함 검증
- docs/CH06_BACKGROUND_REPORT.md, docs/ch06-background-prompts.json: 매핑/제작/검수 기록
