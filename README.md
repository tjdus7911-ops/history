# 살아본 한국사 — 눈떠보니 고려

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
