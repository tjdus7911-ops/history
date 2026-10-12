# 전체 에셋 및 로딩 성능 최적화 보고서

- 기준 커밋: `ec2e2a760cc8e4c7342249bd6c2624a910a1d5d4` (`main`)
- 작업 브랜치: `perf/asset-loading-optimization`
- 측정일: 2026-10-12
- 브라우저: Chrome 154.0.8037.93
- 비교 조건: 로컬 정적 서버, 서비스워커 차단, PC 1280×900 / 모바일 390×844
- Slow 4G 조건: 1.6 Mbps down, 0.75 Mbps up, RTT 150 ms

## 결론

스토리·문제·선택지·저장 스키마·UI는 바꾸지 않고 삼국편 대용량 배경 11개를 동일 해상도 WebP로 교체하고, 현재 프레임 중심의 제한된 프리로드 스케줄러를 도입했다. 배포 이미지 용량은 795,303,398 B에서 752,513,970 B로 42,789,428 B(40.807 MiB, 5.38%) 감소했다. Slow 4G 모바일에서 삼국편 첫 장면 필수 에셋 완료 시간은 53.087초에서 8.944초로 44.143초(83.15%) 단축됐다.

| 항목 | 변경 전 | 변경 후 | 변화 |
|---|---:|---:|---:|
| 런타임 이미지 수 | 2,585 | 2,581 | -4 |
| 전체 런타임 이미지 용량 | 795,303,398 B | 752,513,970 B | -42,789,428 B |
| 삼국편 이미지 수 | 134 | 130 | -4 |
| 삼국편 이미지 용량 | 244,752,447 B | 201,963,019 B | -42,789,428 B |
| 최적화한 런타임 이미지 | - | 11 | +11 WebP |
| 런타임에서 제외한 source-only 이미지 | - | 4 | 원본은 문서 보관 |
| 확정 미사용 에셋 영구 삭제 | - | 0 | 없음 |
| 초기 JavaScript 실제 전송량 | 13,497,120 B | 13,503,294 B | +6,174 B |
| 초기 전체 실제 전송량 | 26,287,937 B | 16,410,426 B | -9,877,511 B (-37.57%) |
| PC cold FCP / DCL | 2.188 / 2.423초 | 2.132 / 2.367초 | 각각 -0.056초 |
| 모바일 cold FCP / DCL | 2.096 / 2.424초 | 2.040 / 2.334초 | -0.056 / -0.090초 |
| Slow 4G 모바일 FCP / DCL | 69.684 / 70.115초 | 66.668 / 67.186초 | -3.016 / -2.929초 |
| Slow 4G 삼국 첫 장면 필수 에셋 완료 | 53.087초 | 8.944초 | -44.143초 (-83.15%) |
| PRO-S01 → PRO-S02 화면 전환 | 미측정 | PC 72 ms / 모바일 43 ms / Slow 4G 64 ms | 네트워크 비차단 |

초기 JavaScript는 새 프리로드 스케줄러 때문에 6,174 B 늘었지만, 초기 이미지 전송이 약 10.30 MiB 줄어 전체 전송량은 크게 감소했다. Slow 4G 첫 화면의 남은 주 병목은 동기식 초기 JavaScript 13.50 MB다.

## 이미지 인벤토리

### 형식별 런타임 용량

| 형식 | 변경 전 | 변경 후 |
|---|---:|---:|
| PNG | 285 / 638,150,457 B | 270 / 590,577,843 B |
| WebP | 2,250 / 148,215,684 B | 2,261 / 152,998,870 B |
| JPG | 35 / 8,901,840 B | 35 / 8,901,840 B |
| SVG | 15 / 35,417 B | 15 / 35,417 B |

### 시대·경로별 런타임 용량

| 분류 | 변경 전 | 변경 후 |
|---|---:|---:|
| 고려 | 363 / 387,123,899 B | 동일 |
| 원삼국 | 69 / 73,306,807 B | 동일 |
| 삼국 | 134 / 244,752,447 B | 130 / 201,963,019 B |
| 원삼국·삼국 공통 박물관 | 1 / 237,883 B | 동일 |
| 조선 | 43 / 12,518,478 B | 동일 |
| 기출 이미지 | 1,957 / 73,875,034 B | 동일 |
| 공통 editorial | 13 / 3,395,334 B | 동일 |
| 아이콘 | 5 / 93,516 B | 동일 |

1,000,000 B 이상 이미지는 279개에서 264개로, 3,000,000 B 이상 이미지는 22개에서 12개로 줄었다.

원본 보존본까지 포함한 저장소 전체 이미지는 2,674개/801,329,479 B에서 2,685개/806,112,665 B로 11개/4,783,186 B 증가했다. 이는 원본 PNG 15개를 `docs/three-content/source-assets/backgrounds/`로 이동해 보존하고, 배포용 WebP 11개를 추가했기 때문이다. 배포 산출물인 `dist`는 42,789,428 B 감소했다.

## 대용량 TOP 10

| 순위 | 변경 전 | 바이트 | 변경 후 | 바이트 |
|---:|---|---:|---|---:|
| 1 | `genealogy-03.png` | 5,838,036 | `genealogy-03.png` | 5,838,036 |
| 2 | `genealogy-01.png` | 5,825,347 | `genealogy-01.png` | 5,825,347 |
| 3 | `genealogy-02.png` | 5,468,198 | `genealogy-02.png` | 5,468,198 |
| 4 | `silla-ox-field-rest-portrait-v2.png` | 3,790,881 | `assets/scenes/life-choice.png` | 3,398,077 |
| 5 | `silla-tomb-worksite-v1.png` | 3,703,246 | `assets/scenes/route-songak.png` | 3,314,422 |
| 6 | `seokguram-assembly-v1.png` | 3,617,184 | `assets/scenes/ch12-wihwado-rain.png` | 3,300,611 |
| 7 | `silla-ox-field-readable-v3.png` | 3,541,663 | `assets/scenes/ch02-complete.png` | 3,190,329 |
| 8 | `silla-ox-field-rest-v1.png` | 3,501,520 | `assets/scenes/ch06-gaegyeong-rebuild.png` | 3,135,764 |
| 9 | `bulguksa-distinct-pagodas-v1.png` | 3,444,023 | `goryeo.png` | 3,121,798 |
| 10 | `baekje-letter-relay-post.png` | 3,421,360 | `assets/scenes/status-first.png` | 3,039,193 |

`genealogy-01~03.png`은 삼국편 원본 자료 화면이자 데이터의 provenance 경로로 노출되는 B 유형 에셋이므로 이번 작업에서 이동·삭제하지 않았다.

## 변환 결과와 품질 검증

WebP 인코딩은 quality 86, effort 6, smart subsampling으로 통일했다. 11개 모두 원본 가로·세로 크기와 RGB 표현을 유지했고, 자동 품질 게이트는 PSNR 35 dB 이상, 평균 절대 오차 3.2 이하로 설정했다.

| 배경 | PNG | WebP | 절감률 | PSNR |
|---|---:|---:|---:|---:|
| `baekje-letter-relay-post` | 3,421,360 B | 484,072 B | 85.85% | 36.635 dB |
| `balhae-office-readable-labels-v3` | 2,302,367 B | 232,492 B | 89.90% | 39.101 dB |
| `bulguksa-distinct-pagodas-v1` | 3,444,023 B | 512,454 B | 85.12% | 35.502 dB |
| `cheonghaejin-warehouse-v1` | 3,046,754 B | 387,228 B | 87.29% | 37.193 dB |
| `goguryeo-spring-queue-after-collapse` | 2,931,966 B | 362,508 B | 87.64% | 38.377 dB |
| `goguryeo-spring-queue-before-collapse` | 3,031,815 B | 370,780 B | 87.77% | 38.289 dB |
| `goguryeo-spring-queue-mother-in-pair-v1` | 2,917,357 B | 361,638 B | 87.60% | 38.451 dB |
| `hwangnyongsa-construction-v1` | 3,246,307 B | 486,116 B | 85.03% | 35.367 dB |
| `seokguram-assembly-v1` | 3,617,184 B | 523,370 B | 85.53% | 36.713 dB |
| `silla-ox-field-readable-v3` | 3,541,663 B | 512,174 B | 85.54% | 36.690 dB |
| `silla-tomb-worksite-v1` | 3,703,246 B | 550,354 B | 85.14% | 36.242 dB |

원본 합계 35,204,042 B가 런타임 4,783,186 B로 줄어 30,420,856 B를 절감했다. 원본/변환본의 대기열·신라 고분·석굴암 표본을 원본 해상도로 비교했고, 실제 PC·모바일 렌더에서도 구도, 인물, 색상, 글자, 크롭 이상이 없었다. 캐릭터 아틀라스는 변환하거나 크기를 바꾸지 않았다.

## 미사용·중복 에셋 판단

정적 경로뿐 아니라 HTML/CSS/JS/JSON, 장면·표정 매핑, 동적 staging 경로, 생성 스크립트, 저장 호환 경로와 문서 provenance를 함께 조사했다.

- A(현재 사용): 그대로 유지했다.
- B(동적 참조·저장 호환·자료 provenance·생성 소스): 삭제하지 않았다.
- C(미사용 확정): 0개였다. 영구 삭제한 원본은 없다.

런타임에서만 제외한 source-only PNG는 다음 4개다. 모두 최종 배경에 대체된 생성 중간물이며 원본은 문서 source archive에 보존했다.

- `balhae-jeongdangseong-office-v1.png` — 최종 readable-labels v3로 대체
- `balhae-office-readable-shelf-v2.png` — v3 생성 참고 원본
- `silla-ox-field-rest-portrait-v2.png` — readable v3 생성 참고 원본
- `silla-ox-field-rest-v1.png` — 장면에서 사용하지 않는 이전 생성본

SHA-256 기준 동일 파일은 12그룹/24개, 잠재 중복 18,293,445 B였다. 11그룹은 레거시 삼국 주인공 경로와 현재 서아 경로, 1그룹은 호환용 hero 경로다. 캐릭터 ID, 매니페스트와 기존 저장 경로가 달라 안전한 통합 근거가 부족하므로 B 유형으로 유지했다.

## JavaScript와 프리로드 구조

초기 문서에는 전역 실행 순서에 의존하는 classic script가 56개 있었다. 변경 후 `image-preloader.js`가 추가되어 57개이며, 데이터와 UI 전역 객체의 초기화 순서 및 저장 마이그레이션 의존성이 높아 이번 성능 패치에서 시대별 번들 분할은 수행하지 않았다.

| JavaScript 합계 | 변경 전 | 변경 후 |
|---|---:|---:|
| raw | 13,480,320 B | 13,493,516 B |
| gzip level 9 추정 | 2,210,287 B | 2,214,186 B |
| Brotli level 11 추정 | 1,529,580 B | 1,532,918 B |

대신 초기 화면에서 고려편 전체 이미지를 무조건 프리로드하던 호출과 챕터 전체 초상화를 한꺼번에 순회하던 로직을 제거했다. 새 스케줄러는 다음을 보장한다.

- `high`: 현재 배경·현재 표시 인물·현재 동적 소품
- `near`: 다음 대사 표정·가까운 선택 결과
- `idle`: 다음 장면 첫 배경
- 총 동시 요청 4개, speculative 요청 최대 2개; 제약 네트워크에서는 총 2개
- URL 중복 제거, 성공/실패 상태, 재시도 cooldown/backoff, 15초 timeout과 fail-open
- 완료 메타데이터 LRU 최대 160개, 완료 후 `Image` 참조 해제
- 선택 결과, 대사 중 동적 배경, 표정, 소품, 손 동작, setting surface, 저장 후 분기 재개 포함

삼국편에서는 실제 렌더러와 프리로더가 동일한 `frameCast` 계산을 사용한다. 218개 장면의 main/choice/branch/join 및 저장 이력 17,940개 상태와 동적 URL 19종을 자동 검증했다. 선택 결과가 표시되는 동안 이미 다음 scene ID로 진행된 저장 구조도 `pending.sourceSceneId`를 사용해 현재 결과 이미지를 우선 준비한다.

서비스워커는 `window.load` 뒤 등록된다. 작은 core와 나머지 dependency를 분리하되, install에서 2개 worker로 전체 79개 shell 항목을 완성한 뒤에만 새 버전을 활성화한다. 하나라도 실패하면 새 버전 캐시를 지우고 기존 worker/cache를 유지한다. Cache Storage 열기·쓰기 지연이나 quota 실패는 정상 네트워크 응답을 막지 않는다. 이미지 전체를 Cache Storage에 복제하지 않아 모바일 저장공간과 이중 캐시를 피했다.

## 실제 브라우저 측정과 QA

### 최초 방문과 재방문

- PC cold: FCP 2.132초, DCL 2.367초, load 2.391초, 16,410,426 B, 오류 0
- 모바일 cold: FCP 2.040초, DCL 2.334초, load 2.361초, 16,410,422 B, 오류 0
- 모바일 warm: FCP 2.036초, DCL 2.341초, 15,861,485 B, cache hit 36
- Slow 4G 모바일 cold: FCP 66.668초, DCL 67.186초, load 79.271초

PC warm 단일 샘플 FCP는 2.288초로 baseline 1.856초보다 느렸고, 이는 cold와 반대 방향의 단일 측정 변동이다. 캐시 성능 개선으로 과장하지 않았다.

### 삼국편 장면

- 첫 장면 cold PC: DOM +50 ms, 필수 배경·주인공 완료 +55 ms
- 첫 장면 cold 모바일: DOM +51 ms, 필수 에셋 완료 +53 ms
- 첫 장면 warm PC/모바일: 필수 에셋 완료 +26 / +31 ms
- Slow 4G 모바일: DOM +53 ms, 필수 에셋 완료 +8.944초
- 첫 장면 요청: `modern-study-night.webp` 135,021 B + `three-player-modern.png` 1,629,795 B와 폰트 3개; 이전 고려편 약 12.5 MB 프리로드 경쟁 제거
- PRO-S01→S02는 새 필수 이미지가 없어 네트워크를 기다리지 않았고, S03 이미지는 낮은 우선순위로 백그라운드 요청했다.

### 기능·화면

PC와 390×844 viewport에서 다음을 실제 확인했다.

- 프롤로그, 장면 전환, 연속 대사, 선택 분기와 선택 결과
- 저장 후 reload/resume와 콜드 분기 인물 복원
- 동적 배경, 캐릭터 표정, 소품과 atlas 렌더
- 4지선다·5지선다 기출 선택, 제출, 피드백
- 가로 overflow 없음, 이미지 decode 성공, HTTP 4xx/5xx·requestfailed·pageerror 0

최종 서비스워커에서는 기대 APP_SHELL 79개 중 79개가 캐시에 들어간 것을 확인했다. 온라인 controlled reload에서 CSS 14개와 script 57개가 서비스워커 응답으로 제공됐고, 서버를 종료한 뒤 CDP offline까지 적용한 reload에서도 문서·CSS·JS가 복구되어 앱 shell과 기능 코드가 부팅됐다. 의도적으로 shell에 넣지 않은 홈 일러스트와 외부 폰트는 완전 오프라인에서 표시되지 않는다.

## 자동화 검증

통과:

- `npm run test:performance`
  - 프리로드 우선순위·동시성·중복 제거·재시도·timeout·LRU
  - WebP 해상도/해시/품질/용량 매니페스트
  - 삼국 17,940개 상태와 19개 동적 URL
  - 선택 결과 및 콜드 분기 실제 DOM 프리로드 일치
  - 원자적 SW install, 실패 시 구 캐시 보존, 비차단 cache open/write
- `npm run test:three`
  - 218개 장면 A/B 전체 경로, 71개 선택, 98개 최초 문제, 99개 unlock, 저장 연속성, 추가 복습 재개
- `three-staging-test.cjs`, `character-art-style-test.cjs`, 저장/학습 경계 테스트
- Three art/staging/setting surface 생성기 `--check`
- 정적 PWA build assertions: 55개 필수 파일, 682개 ready illustration, manifest/SW 검증

환경 또는 기존 fixture 불일치:

- `npm run build`는 WindowsApps의 `python3` 실행에서 `EACCES`로 중단된다. 번들 Python으로 개별 Three 생성기와 신규 asset check는 통과했다.
- 전체 build의 원삼국 승인 SHA, Three exam output, story-policy check는 Windows CRLF checkout에서 기존과 같은 불일치가 있다. LF 정규화 SHA는 승인값과 일치한다.
- `three-staging-integration-test.cjs`의 기존 `bookState` fixture, `three-ui-preservation-test.cjs`의 기존 script SHA fixture가 현재 main과 이미 불일치한다.
- 기존 `test:mobile` 첫 테스트는 `questionResults` 0 대 기대 9로 실패하며, 변경 전 HEAD 파일로 동일 실행해도 같은 결과다.
- 기존 `three-complete-ui-test.cjs`에는 현 DOM과 다른 선택자 두 곳 및 모바일 진행 버튼 42 px 대 테스트 최소 44 px 불일치가 있다. 이번 변경은 CSS를 수정하지 않았다.

실제 물리 Android Chrome은 이 환경에서 실행하지 못했다. Chrome 모바일 viewport·touch 흐름·Slow 4G·cold/warm/offline은 실제 브라우저로 검증했지만, 물리 Android 확인으로 표기하지 않는다.

## 후속 개선 후보

1. 초기 13.50 MB JavaScript를 시대별로 분할하려면 전역 데이터/런타임/UI 초기화 계약과 저장 마이그레이션을 먼저 모듈 경계로 고정해야 한다.
2. 남아 있는 3 MB 이상 고려 배경과 삼국 genealogy 자료는 각 사용 맥락·텍스트 판독성을 별도로 검수한 뒤 최적화할 수 있다.
3. 오프라인에서 홈 일러스트까지 필요하다면 고정 핵심 이미지 소수만 별도 cache allowlist로 추가하고 저장공간 상한을 측정해야 한다.
4. main에 이미 존재하는 Windows CRLF·모바일 fixture·stale selector 문제는 성능 변경과 분리된 유지보수 작업으로 고치는 것이 안전하다.

이 브랜치는 `main`에 병합하거나 운영 배포하지 않는다.
