# 살아본 한국사 — 눈떠보니 한국사

## 눈떠보니 삼국: 확정 원고 적용

삼국편의 실제 진입점인 `dist/index.html`은 첨부 확정 원고와 기출 배치표를 변환한 v3 콘텐츠를 읽습니다. 본편 23챕터·215씬과 프롤로그 3씬, 작성 발화 2,777개, 대사 선택 71곳·142개, 선정 기출 91문항을 연결했습니다. 원삼국·고려·조선은 별도 콘텐츠와 저장 상태를 유지합니다.

삼국편의 새 게임은 `THR-PRO-S01`에서 시작합니다. 선택한 서아의 대사와 해당 분기만 재생하고, 공통 연결을 읽은 다음 배치표의 필수 기출을 엽니다. 기본 진행은 첫출제 77문항이며, 대표 배치의 복습 22회와 추가 후보는 기록책에서 선택합니다. 이어하기는 대사 단계·커서·선택 분기·기출 큐를 복원합니다.

```bash
npm run import:three   # 보관한 MD/XLSX와 자산 매니페스트에서 런타임 데이터 재생성
npm run check:three    # 원본과 생성 결과의 일치 여부 검사
npm run test:three     # 전체 A/B 경로, 저장 복원, 기출 개방 조건 검사
npm run test:three:ui  # Playwright + Chromium이 있는 환경에서 실제 화면 검사
```

`npm test`와 `npm run build`에도 새 삼국편 검사가 포함됩니다. 브라우저 검사는 별도 명령이며, 실행 환경에 Playwright와 Chromium이 필요합니다. 이번 작업 환경에서는 브라우저 설치와 관리형 미리보기가 실행되지 않아 **데스크톱·모바일의 실제 화면 검증은 미확인**입니다. 주요 반복 조연 29개 모습은 연결했으며, 아직 독립 초상이 없는 인물과 세부 연출의 한계는 [구현·검증 보고서](docs/three-content/IMPLEMENTATION_REPORT.md)에 정확히 기록했습니다.

원고·기출 원본, 재생성 방법, 검증 결과와 남은 항목은 [삼국편 보고서](docs/three-content/IMPLEMENTATION_REPORT.md), [기출 가져오기 기준](docs/three-content/EXAM_IMPORT.md), [대본 대조 결과](docs/three-content/manuscript-import-audit.json), [기출 대조 결과](docs/three-content/exam-import-audit.json)에서 확인할 수 있습니다.

## 눈떠보니 고려

기존 스토리를 보존한 모바일 우선 역사 게임입니다.

- CH.01 **새로운 나라**: 918–930. 고려 건국, 공산 패배, 고창 승리와 도윤과의 생활.
- CH.02 **하나가 된 나라**: 935–943. 견훤·경순왕 귀순, 후삼국 통일, 태조 정책, 훈요 10조와 도윤상단 복선.
- CH.03 **왕의 나라**: 기존 광종 이야기, 949–958.
- CH.04 **나라의 틀**: 기존 성종 이야기, 982.
- CH.05~12: 거란 침입부터 1392년 고려 멸망까지 103개 장면과 111개 `[심화 연습]` 문항으로 완결했습니다.

## 실행과 검증

외부 패키지가 필요 없는 정적 앱입니다.

```bash
npm start
npm test
npm run build
```

npm start는 http://127.0.0.1:4173 에서 dist를 제공합니다. 기본 테스트는 프롤로그 보존, CH.01~12 장면 도달성, 문제·복습·카드·오답, 구 세이브 변환, 재플레이와 완료 결과를 검사합니다.

CH.01~04의 검증 완료 실제 기출 흐름은 유지합니다. CH.05~12는 출처를 확인하지 않은 문항을 기출로 오인하지 않도록 전부 `[심화 연습]`으로 분리하며, 37개 학습 블록마다 장면 직후 세 문제와 해설을 이어서 제공합니다.

## 저장과 콘텐츠 ID

SAVE_VERSION 15 / chapterSplitVersion 1에서 기존 저장을 보존하며 후기 고려 챕터를 추가합니다. 장편 CH.01 완료 기록은 분리하되 원래 기록을 chapterSplitArchive에 보관합니다. scene/question/asset/event ID는 기존 콘텐츠 키를 유지합니다. 따라서 ch02_* 장면은 광종 CH.03, ch03_* 장면은 성종 CH.04에 속합니다. 저장 키·오답·카드·업적을 삭제하지 않습니다.

자세한 이동표와 migration은 [구조 개편 보고서](docs/CHAPTER_SPLIT_REPORT.md), [매핑 CSV](docs/CHAPTER_SPLIT_MAPPING.csv)에 기록했습니다. CH01_EXPANSION_* 문서는 분리 전 작업의 보관 문서입니다.

## 화면 연출

프롤로그 현대 → 잠듦 → 검은 화면 두 목소리 → 첫 만남은 그대로 유지합니다. 일반 장면은 `characterId`의 공통 `position`/`show`와 `MAIN / SUPPORTING / EXTRA` 렌더 등급을 사용합니다. 초상별 구도 보정은 공통 scale/anchor 프로필에 두어 935년 전신 도윤처럼 원본 구도가 다른 경우에도 주요 인물 크기를 맞춥니다. `thought`/`narration`은 배경과 대사 UI만 사용합니다.

## 선택적 실제 모바일 검증

```bash
npm install --no-save --package-lock=false playwright@1.62.1
npx playwright install chromium
npm run test:mobile
```

390×844에서 CH.01~12 전체 흐름과 복습을 검사하고 CH.05~12는 375/390/430px overflow, 중간 새로고침, 조선 예고까지 확인합니다. `BROWSER_CHANNEL=chrome` 또는 `BROWSER_CHANNEL=msedge`로 설치된 브라우저를 사용할 수 있습니다.

## PWA

Vercel 정적 결과물은 dist이며 manifest와 루트 scope service worker를 제공합니다. Android 브라우저 메뉴의 앱 설치/홈 화면 추가, iPhone Safari 공유 메뉴의 홈 화면 추가를 사용할 수 있습니다. 앱 shell은 network-first로 갱신하며 이전 cache만 정리합니다. 게임 안 설치 UI는 추가하지 않습니다.
