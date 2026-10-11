# 삼국 승인 UI 복원 및 실제 화면 검증 기록

작성일: 2026-10-11 (UTC) · 상태: PR9 운영 반영·원본 보존·승인 공통 UI와 아래에 기록한 실제 경로의 검증 완료. 네 자동 검사 통과, 대표 인물·나이 변형·긴 선택문·기록 대사·선택부터 기출과 본편 복귀·정식 주소의 이어하기 및 기존 조선 저장 유지 확인. 상세 연출의 실제 확인 범위는 해당 장면과 너비에 한정

삼국은 기존 원삼국·고려·조선에서 승인된 대화 UI를 사용한다. 원문 대사와 선택·기출·저장 진행은 보존하며, 공통 말풍선의 최근 대사 누적, 화자 좌우, 공통 버튼과 PC 게임 폭을 기준으로 확인했다. 이 문서는 원본 대조, 앱 스크립트의 자동 검사, 실제 브라우저 확인을 구분해서 기록한다.

## 1. 반영 기준과 현재 단계

| 구분 | 코드 기준 | 확인된 상태 | 아직 확인할 사항 |
| --- | --- | --- | --- |
| PR4 | main 5443603 | 승인 공통 UI 복원 후 아래 실제 브라우저 표의 화면·상호작용 확인 | 이 결과를 후속 PR의 새 화면 검증으로 대신 사용하지 않음 |
| PR5 | main 361835ac330677eb835bc06776b3fc3023874438 | Vercel 77QwYTu8ceVhnk46Mupzr4M3PZeF success. 새 QA 항목, 인물 머리·얼굴, 기록·선택 전환과 기록책 모달 확인 | 당시 발견한 하단 잘림·소품 위치 문제는 후속 상태에서 추적 |
| PR6 | main c88355a | Vercel 6xC2KLzq2N7ep7pUmTRUkHmP8hRi success. 실제 DOM의 인물 무대 overflow: visible, 을파소·연우 4너비 재확인. 원삼국 연속 플레이와 PRO3 L03/L04도 실제 확인 | 당시 한결 원본 크롭 손실과 PRO3 L01/L06 문제 발견. 각각 후속 상태에서 추적 |
| PR7 | main c032fc2badb339bf73fbc933e518d656bbf3e5df | [Vercel 배포 성공](https://vercel.com/tjdus7911-3014s-projects/history/3gcRLCWm7Gt1FVqRAkxS4WbCaBzZ). C13 미완성 공정 배경, PRO3 바닥 책과 단일 탭, 편지 합류·재접속 실제 확인 | C11 모바일 배경에서 소 머리·다리와 쟁기가 잘리는 문제를 발견해 후속 보완 대상에 포함 |
| PR8 인물 크롭 교정 | main 98c2462f969b0b6648e16613e460853fc0db7655 | [Vercel 배포 성공](https://vercel.com/tjdus7911-3014s-projects/history/CubJjVK76wMMoSaAP9phi6dDx9BX). 63개 하단 크롭 복원. 해당 교정 시점의 독립 검사에서 90개 원본 실루엣·최종 CSS 클립 손실 0, 이웃 알파 유입 0, 원본 PNG 15개·얼굴 좌표 90개 불변. 운영 390px에서 한결 양다리·신발 복원 확인 | 한결의 얼굴 기준점에 머리·목이 포함되는 별도 문제를 PR9에서 교정하고 실제 화면 확인. 인물 90개 전체의 픽셀 QA 완료를 뜻하지 않음 |
| [PR9 후속 연출·얼굴 기준점](https://github.com/tjdus7911-ops/history/pull/9) | head 0b096ae41a89b252711974e5a80e3afbb7d164a9 → main c6d402873114bb8f315a5f40454301427df0a1fb | [Vercel 운영 배포 성공](https://vercel.com/tjdus7911-3014s-projects/history/GAxRkaWXH1pXHE5YZsvHUkUvahWW). 실제 QA 49개 항목으로 새 버전 확인. 90개 얼굴 기준점·연출 연결과 네 자동 검사 통과. 대표 인물·나이 변형·긴 선택문 4너비·가장 긴 기록 대사·연속 플레이·상세 연출, 정식 주소의 삼국 이어하기와 기존 조선 저장 유지 확인 | 기록한 실제 장면과 너비의 공통 UI 검증 완료. 전체 상세 연출이나 90개 초상의 픽셀 전수 확인으로 확대하지 않음 |

PR9까지 코드 병합과 배포 성공을 확인했다. 공통 말풍선·단일 탭·배우 위치·버튼의 확인 결과와 책·소품·행동 접점을 포함하는 상세 연출 결과를 각각 기록한다. 원본 크롭으로 인물 하단이 드러나는 문제도 핵심 UI의 완료 기준에 포함한다. 확인을 마친 장면·너비는 아래 표에 한정하며, 원본 사진 표시나 일부 인물 화면을 인물 초상 90개 전체의 실제 검증 완료로 확대하지 않는다.

과거 버전의 일부 캡처는 이전 작업 공간에만 있었으므로 아래에서 재확보 대기로 표시했다. 이는 해당 시점의 사진이 남아 있지 않다는 표시다. 직접 관찰한 상호작용 보고와 잔존 캡처를 구분하고, 없는 그림을 확인 증거로 연결하지 않는다. 최신 운영본의 완료 근거는 PR9 실제 확인 표와 정식 주소의 일반 메뉴 검증에 기록했다.

## 2. 원본과 승인 공통 UI 보존

[보존 기준 파일](../../tests/fixtures/three-ui-preservation.json)과 [보존 검사](../../tests/three-ui-preservation-test.cjs)는 콘텐츠의 ID·개수와 원본 파일 해시를 함께 대조한다.

| 보호 대상 | 확인 수량과 기준 |
| --- | --- |
| 삼국 챕터·장면 | 본편 23챕터, 본편 215씬 + 프롤로그 3씬 = 218씬. 고유 scene ID 218개 |
| 삼국 전체 원문 | 고유 line ID 2,777개. 본문·고른 선택의 발화·개별 반응·공통 합류를 포함 |
| 삼국 선택 | 71개 선택 장면의 작성 선택문 142개. 선택 장면 수와 선택문 수를 구분 |
| 삼국 공식 기출 | 문항 91개와 원본 문제 이미지 91개의 SHA-256 대조 |
| 기존 이미지·자산 | 기존 자산 2,481개를 Git blob SHA-1로 대조. 일반 파일의 SHA-256과 다른 해시 방식임 |
| 승인 공통 UI | 7개 공통 파일의 SHA-256 일치. `dialogue.css`, `editorial.css`, `style.css`, `renewal.css`, `v2.css`, `editorial-ui.js`, `joseon-ui.js` |
| 다른 시대 데이터 | 보존 기준에 기록된 원삼국·고려·조선 데이터 및 기존 원삼국 그림 연결 파일을 파일별 SHA-256으로 대조 |

주요 승인 원본의 해시는 다음과 같다. 개별 이미지·공통 UI·기존 자산의 전체 해시 목록은 위 보존 기준 파일에 있다.

| 원본 | 바이트 | SHA-256 |
| --- | ---: | --- |
| [삼국 대본](../../dist/three-story-script.json) | 1,620,184 | `a2b0454b84dd7b2543ea41f8cb3c518e4a10d1f7db29f855b9324d5ab57fa6f0` |
| [삼국 기출](../../dist/three-exam-data.json) | 814,244 | `323e167f88250cc72b8ecc5787c2746552402cd1d068048e81d043eb881621ea` |
| [원삼국 개정 대본](../../dist/proto-story-script.json) | 1,048,353 | `d9e183fedd783fee7f7792dcb19c71a5a09d6c8188e266ea932b7361d1f0bed2` |

삼국 콘텐츠 버전은 `three-complete-23-v1`, 원삼국 개정 콘텐츠 버전은 `proto-revision-83-v1`이다. 새 연출 이미지를 추가하는 것과 기존 자산을 바꾸는 것을 구분해 검사한다.

## 3. 자동 검사 결과

아래는 실제 서비스의 스크립트 또는 상세 연출 API를 실행한 검사 결과다. VM에서 만든 HTML의 구조·원문·상태를 검사한 결과이며, 브라우저의 픽셀 배치·손과 물건의 접점·터치 영역 확인은 다음 절에 별도로 기록한다.

PR9 최종 컴파일 후 콘텐츠 보존·승인 UI·순수 연출 API·실제 HTML 연결의 네 명령을 각각 한 번 실행했다. 네 종료 코드는 모두 0이며, [전체 출력·정확한 개수·입력 파일 해시](./three-final-automated-verification.json)에 기록했다. 2026-10-11 10:53:02–10:54:44 UTC의 검사 전후 입력 260개가 동일했다. 아래 저장·QA fixture·원삼국 전체 경로 행은 앞선 완료 결과이며, 이 네 명령 묶음에서 다시 실행한 것으로 표기하지 않는다. 원삼국 승인 원본 파일의 SHA-256은 이번 묶음에서도 재대조했다.

| 검사 | 기록된 결과 | 검증 범위 |
| --- | --- | --- |
| [승인 공통 UI 회귀](../../tests/three-approved-ui-test.cjs) | 최종 후보 3,841개 표시 프레임, 637회 단일 탭, 기록·내레이션 308개 프레임 통과 | 전체 218씬의 2,777개 발화·142개 선택문, 공통 말풍선 일치, 일반 최근 3개/선택 화면 최근 2개 대사, 진행 버튼, 화자 좌우, 기록·내레이션 배우 규칙. 삼국 대사는 즉시 전체 표시 |
| [상세 연출 순수 API](../../tests/three-staging-test.cjs) | 2,919개 표시 프레임 통과 | 현재 발화 ID·선택 ID·이전 선택에 따른 소품·배경·초상, 같은 입력의 동일 결과, 원문·입력·저장 불변 |
| [상세 연출 실제 HTML 연결](../../tests/three-staging-integration-test.cjs) | 첫 완료 묶음 62개 HTML 프레임, 새 VM 복원 17회 통과 | 기록책에서 선택 화면으로 배우 복귀, 해인 도구 상자 분기, 편지 전달 배경과 합류 복귀, 해명 손/붕대와 다음 씬, 여울 망치 내려놓기, 과거 선택 소품. 전체 원문과 커서 불변 |
| 프롤로그·해명 후속 HTML 연결 — 같은 검사 파일 | 프롤로그 11개 HTML 프레임·4회 복원, 해명 수신 인물 1개 프레임·1회 복원을 더해 최종 후보 총 74개 프레임·22회 복원 통과 | L01–L02 바닥 책, L03 들어 올림, L04–L06 품에 안음, 원본 사진 3장 중복 없이 이동. L01–L05 원래 배경 → L06 동일 연우 왼쪽의 어머니 부축 페어·서아 오른쪽 및 중복 어머니 제거 배경 → 재접속 → C01-S01 붕괴 배경과 기존 배우 복귀. 해명 C17-S04 B1-R03의 정확한 왼쪽 수신 인물·붕대 초상과 재접속. 한 번의 실제 클릭으로 한 대사 진행하며 다음 씬 첫 대사를 건너뛰지 않음 |
| [90개 크롭 교정 기록](../three-content/fullbody-crop-repair-audit.json)과 독립 알파·CSS 검사 | PR8 크롭 교정 시점에서 90개 원본 연결 요소 및 최종 CSS 손실 0, 이웃 opaque 픽셀 유입 0 | 해당 시점의 원본 PNG 15개 SHA, faceBounds 90개, sourceRect x·y·width 90개 불변. 높이만 63개 확장. 최종 직렬화된 CSS polygon의 원본 픽셀 중심 포함 여부를 별도 재계산. PR9 얼굴 기준점 교정과 구분하며 상세 방법·결과는 7절 |
| [삼국 v3 저장](../../tests/three-save-v3-test.cjs) | 통과 | 정상 단계·독립 저장 키 복구·답 임시 선택·다른 시대 왕복. 손상 분기/불일치 pending은 원본 보관 후 복구하며 유효 이력과 다른 시대 저장 유지 |
| [QA fixture 검사](../../tests/browser-review-fixtures-test.cjs) | 원삼국 4개 fixture 통과 | 본문/선택 시작, v3 읽기·선택 증명, 정확한 재접속, 관련 없는 저장 보존, 첫 실제 기출 진입 |
| [원삼국 개정 검사](../../tests/proto-revision-test.cjs) 및 [원삼국 저장 검사](../../tests/proto-save-v3-test.cjs) | 통과 | 83씬·108개 선택문·31개 학습·23개 공식 기출, 전체 분기와 v3 저장. 상세 결과는 아래 별도 기록 참조 |

3,841개와 2,919개는 선택 메뉴와 분기별 합류 등을 포함한 검사 프레임 수다. 이를 고유 발화 수 2,777개와 합산하거나 동일한 수량으로 해석하지 않는다. 62개 HTML/17회 복원은 PR5 첫 상세 연출 묶음의 결과다. 프롤로그 후속 검사 11개 프레임/4회 복원과 해명 수신 인물 검사 1개 프레임/1회 복원을 더한 최종 결과는 74개/22회다. 이 검사는 L06 새 페어의 배경·인물·복귀 조건도 대조한다. 네 명령 모두 PR9 최종 컴파일에서 재실행해 통과했으며, 코드 검사를 실제 배포·픽셀 확인으로 해석하지 않는다.

최종 연출 자료에는 146개 씬의 명시적 cue 270개, 배경 상태 이미지 10개, 정확한 문자를 담은 표면 3개가 있다. 이는 컴파일된 연결 수이며 모든 연기·소품 접점·배경 구도가 실제 화면에서 검증됐다는 뜻은 아니다. 검사 전후 260개 입력의 합계 SHA-256은 `5e553c61a2cd8cc3cc2143ec3a147c3921f7170c7c04edf2f86e706a5ee97e7e`이며, 구성 파일별 SHA-256과 합계 계산 방법은 위 JSON에 있다.

통합 담당이 PR9 최종본에서 실행한 [빌드 로그](./three-final-build.log)와 [크롭 회귀 로그](./three-final-crop.log)도 그대로 보관했다. 정적 PWA 빌드, 원본 전체 포함·오목한 팔다리 사이·닫힌 윤곽선·잘린 크롭 거부 검사가 통과했다. 이 두 파일은 이미 완료한 로그를 복사한 것이며, 보고서 마감 시 검사를 추가 실행한 것으로 집계하지 않는다.

주요 재현 명령:

```sh
node tests/three-ui-preservation-test.cjs
node tests/three-approved-ui-test.cjs
node tests/three-staging-test.cjs
node tests/three-staging-integration-test.cjs
node tests/three-save-v3-test.cjs
node tests/browser-review-fixtures-test.cjs
node tests/proto-revision-test.cjs
node tests/proto-save-v3-test.cjs
```

## 4. 실제 브라우저 확인

이 표는 통합 담당이 실제 브라우저에서 확인했다고 보고한 범위만 기록한다. 캡처는 해당 화면의 증거이며, 선택·복귀·재접속은 같은 검증에서 수행한 상호작용 보고에 근거한다. 너비는 별도 표기가 없으면 검증용 화면의 CSS 픽셀 기준이다. 같은 파일명의 일부 그림은 후속 배포에서 재촬영됐다. 특히 삼국 기출 390px·PC, 해설 390px, 기록책 360/390/430px 캡처는 최신 연속 플레이 검증에서 다시 확보됐다. 과거 표가 같은 파일을 연결하는 경우에도 새 캡처를 과거 버전의 촬영물로 해석하지 않는다.

연우 PC·360/390/430px, 한결 편지 전달 390px, 을파소 NPC PC·390px와 주인공 PC·360/430px, 해명 붕대·합류와 C11 소·쟁기, 긴 선택문 PC·360/390/430px, 가장 긴 기록 대사 PC·360px 및 순도·해인 두 나이·가람·하람의 파일은 PR9에서 다시 촬영됐다. 아래 과거 PR4/PR5/PR6/PR7/PR8의 상호작용과 실패 관찰은 해당 시점의 보고로 남기고, 현재 파일은 PR9 화면의 증거로 사용한다.

### PR4 반영 화면

| 대상 | 화면/경로 | 확인 내용 | 캡처 |
| --- | --- | --- | --- |
| 연우 | 모바일 390px | 승인된 누적 말풍선과 캐릭터 배치 | [변경 후](./after-three-yeonwoo-390.jpg), [변경 전 참고](./before-three-yeonwoo-390.jpg) |
| 을파소 ↔ 서아 | 모바일 390px / PC | NPC와 주인공 발화가 전환될 때 좌우와 공통 대화 UI | [NPC 390](./after-three-eulpaso-npc-390.jpg), [주인공 390](./after-three-eulpaso-player-390.jpg), [PC](./after-three-eulpaso-pc.jpg) |
| 긴 선택문 | 모바일 360/390/430px | 원문 전체 선택지와 공통 선택 버튼 표시 | 당시 실제 관찰 보고. 같은 이름의 캡처는 최신 PR9 네 너비 검증으로 교체됐으며 아래 표에 따로 기록 |
| 긴 본문 | 모바일 360px | 긴 대사를 전체 표시하고 진행 UI 확인 | [360](./after-three-long-line-360.jpg) |
| NPC ↔ NPC | 390px, C01-S06의 여섯 번째 대사 | 화자 전환과 동료 NPC 배치. 기존 공통 peer 규칙 확인 | [NPC 교환](./after-three-npc-to-npc-390.jpg) |
| 첫 선택 B1 → 기출 → 복귀 | 모바일 390px | 64회 심화 3번 원본 문제 전체, 답·해설, 본편 복귀와 새로고침 후 진행 확인 | [기출](./after-three-official-question-390.jpg), [해설](./after-three-answer-explanation-390.jpg), [분기 재접속](./after-three-branch-resume-390.jpg) |
| 첫 선택 B2 → 기출 → 복귀 | PC | 선택 후 모진 반응 4대사 → 공통 합류 2대사 → 족보 hint → 64회 심화 3번. 원본 이미지 자연 크기 552×601, 로드 완료, 표시 너비 740px 확인. 3번 답 제출 → 정답 해설 → C01-S07 cursor 1 복귀 | 선택 — 캡처 재확보 대기: `after-three-choices-pc.jpg`, 분기 — 캡처 재확보 대기: `after-three-branch-pc.jpg`. [최신 재촬영 PC 기출](./after-three-official-question-pc.jpg)은 PR9에서 세로 스크롤로 확인한 화면이며 PR4 전체 경로의 촬영물로 사용하지 않음 |
| 정상 삼국 메뉴 | PC, 일반 메뉴에서 진입 | 새 게임과 이어하기로 프롤로그 진입·복귀 | [메뉴 진입](./after-three-menu-prologue-pc.jpg), [이어하기](./after-three-prologue-resume-pc.jpg) |
| 정상 원삼국 메뉴 | PC, 일반 메뉴에서 진입 | 개정본 새 게임·이어하기 정상 진입 | [원삼국 진입](./after-proto-menu-prologue-pc.jpg) |
| 조선 저장 보존 | 일반 메뉴에서 시대 왕복 | 통합 담당이 실제 조선 저장 유지 확인. 링크한 그림은 승인 UI의 기준 캡처이며 저장 결과를 새로 촬영한 사진으로 해석하지 않음 | [조선 기준 화면](./baseline-joseon-pc.jpg) |

승인 UI 비교 기준: [원삼국 주인공 PC](./baseline-proto-player-pc.jpg), [원삼국 두 인물 PC](./baseline-proto-pair-pc.jpg), [원삼국 선택 PC](./baseline-proto-choices-pc.jpg), [고려 PC](./baseline-goryeo-pc.jpg). 기존 공통 UI의 PC 게임 폭 430px, 말풍선·버튼·캐릭터 배치를 기준으로 삼았다.

### PR5 운영 반영 후 추가 확인

아래는 production `361835ac`에서 수행한 실제 확인이다. 얼굴 크기와 머리가 화면 안에 들어오는지 확인한 결과를 인물 하단·모든 소품까지 완료된 결과로 확대하지 않는다.

| 대상 | 화면/원문 위치 | 확인한 결과와 남은 문제 | 캡처 |
| --- | --- | --- | --- |
| 기록 대사 마지막 줄 | 360px, C16-S03 main cursor 10 | 배우 0명, 최근 긴 대사 3개 전체 표시, `10 / 10` 한 줄 표시, 진행·나가기 버튼이 화면 안에 들어옴. 실제 확인 보고에 근거하며 다음 열은 후속 선택 화면 캡처 | 선택 복귀 화면 — 캡처 재확보 대기: `after-three-record-to-choice-360.jpg` |
| 기록 → 선택 전환 | 360px, C16-S03 | 기록 마지막 줄에서 선택 버튼을 누르면 수인 왼쪽·서아 오른쪽으로 현장 배우 복귀 | 기록에서 선택으로 — 캡처 재확보 대기: `after-three-record-to-choice-360.jpg` |
| 기록책 모달 | 360/390/430px | 닫기, 탭 전환, 화면 너비 안의 표시 확인. 링크는 최신 재촬영본 | [360](./after-three-recordbook-360.jpg), [390](./after-three-recordbook-390.jpg), [430](./after-three-recordbook-430.jpg) |
| 원본 사진 1 확대 | 360px, 기록책에서 사진 열기 | 확대 사진의 좌우 스크롤이 내부에서 동작하고, 돌아가기·닫기 버튼이 화면 안에 들어옴 | 원본 사진 확대 — 캡처 재확보 대기: `after-three-source-photo-360.jpg` |
| 순도 | 390px, C03-S01 main cursor 2 | 실제 NPC 발화의 얼굴 크기·머리 표시 확인. 최초 이미지 로드 대기 후 로드 완료 상태로 재촬영했으며 영구 이미지 누락은 아님 | 당시 실제 관찰 보고. 현재 사진은 아래 PR9 재촬영 결과 |
| 해인 — 젊은 시절 | 390px, C07-S04 main cursor 2 | 얼굴 크기·머리 표시 확인. NPC ↔ NPC 대화에서 주인공을 표시하지 않는 공통 배우 규칙 확인 | 당시 실제 관찰 보고. 현재 사진은 아래 PR9 재촬영 결과 |
| 해인 — 나이 든 시절 | 390px, C07-S06 main cursor 1 | 얼굴 크기·머리 표시 확인. 당시 도구 상자가 바닥에서 떠 보이는 문제 발견. 소품 위치 보완 후 실제 재검증은 후속 상태에서 추적 | 당시 실제 관찰 보고. 현재 사진은 아래 PR9 재촬영 결과 |
| 가람 | 390px, C10-S04 main cursor 2 | 실제 NPC 발화의 얼굴 크기·머리 표시 확인 | 당시 실제 관찰 보고. 현재 사진은 아래 PR9 재촬영 결과 |
| 하람 | 390px / PC, C12-S01 main cursor 1 | 얼굴 크기·머리 표시 확인. 당시 하람과 기존 서아의 인물 무대 하단에서 수평으로 잘리는 경계 발견. 공통 CSS 보완은 PR6에 반영, 직접 재확인한 범위는 아래 표 참조 | 당시 실제 관찰 보고. 현재 사진은 아래 PR9 재촬영 결과 |

하단 잘림은 기존 인물 앵커를 유지하면서 삼국의 .character-stage에 overflow: visible을 적용해 PR6에 반영했고 실제 DOM 값도 확인했다. 순도·하람 등도 같은 CSS를 사용한다. 한결에서 별도로 드러난 원본 크롭 단면은 이 CSS 변경만으로 해결되지 않아 7절의 후속 교정으로 추적한다.

### PR6 운영 반영 후 공통 UI 재확인

| 대상 | 화면/경로 | 실제 확인 결과 | 캡처 |
| --- | --- | --- | --- |
| 을파소 → 서아 단일 탭 | 360px, NPC cursor 1 → 주인공 cursor 2 | 한 번의 탭으로 다음 대사만 표시. 전후 두 배우 스타일이 동일함을 실제 DOM 비교로 확인(true). 기존 위치·크기 유지 | 360 — 캡처 재확보 대기: `after-three-eulpaso-360.jpg` |
| 을파소·서아 전신 표시 | 360/390/430px / PC | 무대 하단의 수평 잘림 경계 제거, 대사 전체와 버튼 표시 확인 | 360 — 캡처 재확보 대기: `after-three-eulpaso-360.jpg`, [390 NPC](./after-three-eulpaso-npc-390.jpg), [390 주인공](./after-three-eulpaso-player-390.jpg), 430 — 캡처 재확보 대기: `after-three-eulpaso-430.jpg`, [PC](./after-three-eulpaso-pc.jpg) |
| 연우 NPC 발화 | NPC cursor 2, 360/390/430px / PC | 전신 하단의 수평 잘림 경계 제거, 머리·얼굴 크기 적합. 연우 왼쪽 아이보리 말풍선과 오른쪽에서 흐리게 표시되는 서아 확인 | 360 — 캡처 재확보 대기: `after-three-yeonwoo-360.jpg`, [390](./after-three-yeonwoo-390.jpg), 430 — 캡처 재확보 대기: `after-three-yeonwoo-430.jpg`, PC — 캡처 재확보 대기: `after-three-yeonwoo-pc.jpg` |

공통 CSS가 적용된 다른 인물도 실제 확인을 계속한다. 위 결과는 해당 장면·너비의 확인이며, 인물 90개를 모두 실제 화면에서 전수 검증했다는 뜻으로 사용하지 않는다.

### PRO3 상세 연출 — 확인된 동작과 발견한 문제

| 원문 위치 | 실제 확인 결과 | 상태 | 캡처 |
| --- | --- | --- | --- |
| PRO-S03 L03 | 서아가 책을 들어 올리는 모습, 원본 사진 3장, 손과 책의 접점 확인 | 해당 동작 확인 | L03 390 — 캡처 재확보 대기: `after-three-prologue-lift-book-390.jpg` |
| PRO-S03 L04 | 책을 품에 안은 모습과 원본 사진 3장, 손과 책의 접점 확인 | 통합 담당 실제 확인 보고 | 별도 L04 캡처 없음 |
| PRO-S03 L01 | PR6에서 허리 높이로 떠 보이던 책을 PR7 390px에서 하단·발 근처로 이동한 상태로 확인. L01 → L02 한 탭에서 완성 문장 표시 | PR7 해당 화면·진행 확인 | [L01 390](./after-three-prologue-ground-book-390.jpg) |
| PRO-S03 L06 | 기존 연우의 부축 팔이 허공을 받치는 문제를 발견한 뒤 같은 연우·어머니 페어 초상과 중복 어머니를 제외한 배경으로 연결. PR9 PC·390px에서 할머니 1명, 양팔의 실제 부축 접점, 서아의 책을 안은 활성 상태와 듣는 인물의 흐림 확인 | 새 페어 실제 접점 확인. 새로고침 L06 유지 → C01-S01 cursor 1 복귀 확인 | [390](./after-three-grandmother-support-390.jpg), [PC](./after-three-grandmother-support-pc.jpg) |

PRO3와 해명 수신 인물을 포함한 최종 74개 HTML 프레임·22회 복원 검사는 원문·배우·사진 레이어·커서·복원 상태의 검사다. ground 상태가 반환되는 것만으로 책이 실제 화면의 바닥에 놓였다고 판정하지 않는다.

### 편지 전달 분기에서 공통 장면 복귀

통합 담당은 C08-S08의 B1 분기 4대사를 진행한 뒤 join cursor 1에서 “여울의 대기처로 돌아온다”라는 표시와 원래 배경 assets/ancient/backgrounds/rebuild-jumong-birth.webp로 돌아오는 것을 확인했다. 같은 위치에서 새로고침한 뒤 진행과 원래 배경을 유지하는 것까지 확인했다. [복귀·재접속 화면](./after-three-letter-return-resume-390.jpg)은 이 완료 보고에 대응하는 새 캡처다.

### PR7·PR8 운영 화면과 당시 연속 플레이

| 대상 | 화면/원문 위치 | 실제 확인 결과 | 캡처 |
| --- | --- | --- | --- |
| 미완성 목탑 공정 | PR7, 360px, C13-S03 main cursor 2 | 완성 건축물 대신 미완성 골조·비계·목재가 보이는 해당 배경 확인 | [공정 360](./after-three-pagoda-build-360.jpg) |
| 소·쟁기 농경지 | PR7, 390px, C11-S01 main cursor 2 | 당시 소 몸통만 보이고 머리·다리·쟁기가 잘리는 문제를 발견해 후속 구도 보완 요청 | 통합 담당의 PR7 실패 관찰. 같은 파일명은 아래 PR9의 수정 후 실제 화면으로 교체됐으므로 과거 실패 사진으로 사용하지 않음 |
| 첫 선택 B1 → 합류 | PR8 당시 운영 확인, C01-S06 | 고른 발화 첫 줄 cursor 1부터 반응 4대사 → join 1·2 → 족보 hint로 진행. 대사와 단계 건너뜀 없음 | 통합 담당 연속 플레이 보고 |
| 원본 기출·모바일 헤더 | 390px, 64회 심화 3번 | 원본 이미지 자연 크기 552×601, 로드 완료. 기록책을 포함한 헤더가 한 줄로 표시됨 | [최신 재촬영 기출 390](./after-three-official-question-390.jpg), [PC 기출 — 세로 스크롤](./after-three-official-question-pc.jpg) |
| 답 임시 선택·재접속·제출 | 같은 연속 플레이 | 답 3번을 선택하고 제출 전 새로고침 → 선택 3번 유지 → 정답과 해설 확인 | [정답 해설 390](./after-three-answer-explanation-390.jpg) |
| 본편 복귀·기록책 | C01-S07 cursor 1 | 정답 해설을 마치고 본편 첫 대사로 복귀, 지식 2 확인. 기록책에서 풀이 기록 1개 확인 | [기록책 360](./after-three-recordbook-360.jpg), [390](./after-three-recordbook-390.jpg), [430](./after-three-recordbook-430.jpg) |

이 경로의 전체 성공은 통합 담당의 당시 실제 조작·재접속 보고에 근거한다. 기출·해설 캡처는 이후 PR9에서 재촬영됐다. PC 기출 화면은 세로 스크롤로 확인했으므로 문항 전체가 한 화면에 동시에 들어온 증거로 사용하지 않는다.

### PR8 운영본 추가 확인 — 긴 기록 대사·크롭·분기 소품

| 대상 | 실제 화면/위치 | 확인 결과 | 캡처 |
| --- | --- | --- | --- |
| 가장 긴 기록 대사 | C16-S03-M10, PC 뷰포트 1,363px / 모바일 360px | 배우 0명, 현재 문장 전체와 최근 남색 말풍선 3개, 응답 고르기 및 하단 진행 UI 확인. 360px의 게임 영역은 345×774, 대사 영역 높이와 scrollHeight가 모두 450px로 내부 잘림 없음 | [PC](./after-three-long-line-pc.jpg), [360](./after-three-long-line-360.jpg) |
| PC의 콘텐츠에 따른 높이 증가 | 같은 C16-S03-M10 | 공통 최소 높이 규칙에 따라 게임 영역이 430×951로 자연스럽게 늘어남. 다음 버튼을 확인했고 하단은 페이지 세로 스크롤로 접근 가능. PC 폭 430px를 유지하며 높이를 780px로 고정하지 않음 | [PC 긴 대사](./after-three-long-line-pc.jpg) |
| 을파소 ↔ 서아 | PC, NPC cursor 1 → 주인공 cursor 2. 주인공 화면 PC·360/390/430px | 한 번 클릭할 때 다음 대사로만 진행. 전후 두 배우의 실제 box JSON이 정확히 같음(true). 해당 너비의 하단·전체 대사·버튼 확인 | [PC NPC](./after-three-eulpaso-npc-pc.jpg), [PC 주인공](./after-three-eulpaso-pc.jpg), [390 주인공](./after-three-eulpaso-player-390.jpg). 360/430 재촬영 파일 연결 대기 |
| 한결 하단 크롭 | PR8 390px, C08-S08 B1 branch cursor 2 | 표시 높이 327.75px → 380.98px, 양다리와 신발 복원 및 수평 절단선 제거 확인. 당시 서아보다 체구가 작아 보이는 별도 얼굴 기준점 문제를 발견 | 통합 담당의 PR8 실제 보고. 같은 이름의 390px 캡처는 아래 PR9 결과로 다시 촬영됐으므로 PR8 사진으로 사용하지 않음 |
| 도구 상자 분기 | 390px, C07-S01 B1 branch cursor 2 / B2 branch cursor 3 | 잃어버리는 분기에는 상자가 없고, 보존하는 분기에는 상자가 있음. 보존 분기에서는 말풍선 뒤로 일부가 보임. 바닥 접점까지 모두 완료했다는 판정은 보류 | [상자 없음](./after-three-tools-lost-390.jpg), [상자 있음](./after-three-tools-kept-390.jpg) |
| 해명 손·붕대 | PR8 390px, C17-S04 숨긴 손 / B1 branch cursor 4 / join cursor 1 | 숨긴 손 초상과 합류의 붕대 초상은 확인. B1-R03에서 해명 수신 인물이 빠지는 문제를 발견해 해당 줄에만 presence를 추가. 후속 PR9 운영 반영 및 실제 확인 상태는 아래에서 추적 | [숨긴 손](./after-three-hand-hidden-390.jpg), [합류의 붕대](./after-three-hand-bandage-join-390.jpg) |

이 표는 PR8 운영본에 대한 보고다. PR9의 얼굴 기준점·새 페어·정확한 붕대 수신 인물·설정 배경은 아래 후속 확인 범위로 따로 기록하며, PR8 결과만으로 성공 처리하지 않는다.

### PR9 운영 반영 후 실제 확인

| 대상 | 실제 화면/위치 | 확인한 결과 | 캡처 |
| --- | --- | --- | --- |
| 한결 얼굴 크기·전신 크롭 | C08-S08 B1 branch, 390px cursor 2 | 한결 표시 높이 599.71875px. 이전 PR8 380.984px에서 실제 피부 얼굴 기준에 맞게 배율이 바뀐 상태 확인. source crop 전체는 유지되고 인물은 말풍선 아래까지 이어져 중간의 수평 절단선이 없음. 머리·얼굴은 화면에 들어옴 | [390](./after-three-letter-delivered-390.jpg) |
| 분기 단일 탭·화자·재접속 | 같은 B1 cursor 2 → 3 → 4, cursor 4 재접속 | 각 한 번의 탭으로 다음 완성 문장만 표시. 화자 좌우·흐림 전환과 cursor 4 새로고침 복원 확인 | [PC cursor 4](./after-three-letter-delivered-pc.jpg), [360 cursor 4](./after-three-letter-delivered-360.jpg) |
| 배우 위치·크기 유지 | 같은 분기 cursor 3 → 4 | 처음 절대 좌표가 2px 다른 것은 iframe 문서의 scrollTop 2에 따른 전체 스크롤이었다. 게임 영역을 기준으로 정규화한 좌표와 크기는 전후 정확히 같음(true) | 통합 담당의 실제 DOM 재비교 보고 |
| PC·모바일 근접 구도 | PC 뷰포트 1,363px, 모바일 360/390px | 해당 게임 영역은 PC 430×780, 모바일 각각 345×774·375×774. 머리·얼굴·대사·진행 UI를 확인. 바깥 팔뚝과 옷 가장자리는 공통 프레임에서 일부 벗어나는 근접 구도이며, 몸 전체가 화면 안에 들어온 결과로 표현하지 않음 | 위 한결 PC·360·390 캡처 |
| 연우 NPC 화면 | C01-S01 main cursor 2, PC 뷰포트 1,363px·모바일 360/390/430px | 전신은 공통 말풍선·버튼 뒤로 이어지며 공중에 뜬 몸통 단면이 없음. NPC는 왼쪽 아이보리 말풍선, 서아는 오른쪽 흐림 상태. 모바일 3너비의 바깥 페이지에 수평 넘침이 없고 공통 탐색·진행 버튼이 들어옴 | [PC](./after-three-yeonwoo-pc.jpg), [360](./after-three-yeonwoo-360.jpg), [390](./after-three-yeonwoo-390.jpg), [430](./after-three-yeonwoo-430.jpg) |
| 연우 → 서아 단일 탭 | 같은 씬 cursor 2 → 3 | 한 번의 실제 탭으로 서아 문장 전체가 오른쪽 남색 말풍선에 표시되고 연우는 흐림 상태로 바뀜. 게임 기준 두 배우의 좌표·크기가 정확히 동일함을 실제 DOM에서 확인(sameActorGeometry true) | [서아 발화 430](./after-three-yeonwoo-player-430.jpg) |
| 을파소 ↔ 서아 | NPC cursor 1, PC·390px / 주인공 cursor 2, PC·360/430px 재촬영 | 한 번의 실제 탭으로 서아의 남색 말풍선에 완성 문장 표시. 얼굴 크기의 시각적 균형, 수평 넘침 없음, 공통 진행·탐색 버튼 표시 확인. 모바일 360/390/430px의 기존 공통 폭 규칙 유지 | [NPC PC](./after-three-eulpaso-npc-pc.jpg), [NPC 390](./after-three-eulpaso-npc-390.jpg), [주인공 PC](./after-three-eulpaso-pc.jpg), [주인공 360](./after-three-eulpaso-player-360.jpg), [주인공 430](./after-three-eulpaso-player-430.jpg) |

### PR9 긴 선택문과 대표 나이·인물 화면

| 대상 | 실제 화면/위치 | 확인한 결과 | 새 캡처 |
| --- | --- | --- | --- |
| 긴 선택문 2개 | C22-S06 선택 단계, PC·360/390/430px | 대사형 선택문 2개 전체와 최근 말풍선 2개 표시. 네 너비 모두 선택 버튼 잘림과 수평 넘침이 없음 | [PC](./after-three-long-choices-pc.jpg), [360](./after-three-long-choices-360.jpg), [390](./after-three-long-choices-390.jpg), [430](./after-three-long-choices-430.jpg) |
| 가장 긴 기록 대사 | C16-S03-M10, PC·360px | 360px에서 남색 말풍선 3개와 모든 문장 전체, 배우 0명. 대화 영역 clientHeight 450px/scrollHeight 450px로 내부 잘림 없음. PC 게임 영역은 430×951이며 페이지의 세로 스크롤로 모든 문장과 응답 버튼을 확인 | [PC](./after-three-long-line-pc.jpg), [360](./after-three-long-line-360.jpg) |
| 순도 | C03-S01 main cursor 2, 390px | 얼굴·몸 비율, 머리 표시와 공통 말풍선 확인. 공중에서 끝나는 수평 몸통 단면 없음 | [390](./after-three-sundo-390.jpg) |
| 해인 — 젊은 시절 | C07-S04 main cursor 2, 390px | 실제 배우 ID `civilian-c07-cf158c9e21--initial`을 확인. NPC ↔ NPC 구간에서 왼쪽 해인만 표시하고 서아를 표시하지 않음. 얼굴·몸 비율과 공통 말풍선 확인 | [390](./after-three-haein-young-390.jpg) |
| 해인 — 나이 든 시절 | C07-S06 main cursor 1, 390px | 나이 든 해인과 오른쪽의 흐린 서아, 얼굴·몸 비율과 도구 손잡이·소품의 하단 배치 확인. 몸통의 수평 절단선 없음. 말풍선 뒤에 가려진 상자 전체의 바닥 접점까지 노출된 결과로 표현하지 않음 | [390](./after-three-haein-older-390.jpg) |
| 가람 | C10-S04 main cursor 2, 390px | 성인 학자 모습의 얼굴·몸 비율과 공통 말풍선, 몸통의 수평 절단선 없음 확인 | [390](./after-three-garam-390.jpg) |
| 하람 | C12-S01 main cursor 1, PC·390px | 얼굴·몸 비율과 공통 말풍선 확인. 앞서 드러났던 인물 무대 하단의 수평 몸통 단면이 보이지 않음 | [PC](./after-three-haram-pc.jpg), [390](./after-three-haram-390.jpg) |

이 표는 최신 운영본에서 실제 확인하고 다시 촬영한 장면과 너비에 한정한다. 한결·연우·을파소 및 위 대표 나이·인물의 확인을 90개 인물 전체의 화면 확인으로 확대하지 않는다. 긴 콘텐츠가 있는 PC 화면의 높이는 자연스럽게 늘어나며 항상 780px로 고정되지 않는다.

### PR9의 NPC 전환·선택·기출·복귀 전체 경로

다음 경로는 통합 담당이 최신 운영본에서 실제 버튼을 눌러 확인했다. 이 표의 진행과 재접속은 VM 상태 주입 결과를 실제 조작으로 바꿔 적은 것이 아니다.

| 단계 | 실제 확인 내용 | 새 캡처 |
| --- | --- | --- |
| NPC와 주인공 전환 | C01-S06 main 1 → 2 서아 → 3 을파소 → 4 서아 → 5 연우 → 6 모진을 실제 한 번씩, 총 5회 눌러 진행. 6번에서는 NPC가 왼쪽에 있고 서아를 표시하지 않음 | [을파소 전환 390](./after-three-npc-switch-eulpaso-390.jpg), [모진 전환 390](./after-three-npc-switch-mojin-390.jpg) |
| 선택 화면·고른 발화 | main 7·8 → 응답 고르기 → “옆집 분도…”로 시작하는 첫 선택. branch cursor 1에서 고른 서아 발화 전체를 먼저 표시하며 건너뛰지 않음 | [선택 390](./after-three-choice-390.jpg), [고른 첫 발화 390](./after-three-chosen-line-390.jpg) |
| 선택 반응·재접속 | 한 번 눌러 branch 2의 연우 반응 전체 → 새로고침 후 같은 cursor 2의 완성 문장 복원 → 3 서아 → 4 을파소 | [반응 390](./after-three-branch-response-390.jpg) |
| 공통 합류·족보 | join 1·2 → hint 1로 진행. 기록 단계에서는 배우 0명 | 통합 담당 실제 연속 조작 보고 |
| 첫 실제 기출 | 64회 심화 3번, 원본 이미지 자연 크기 552×601, 로드 완료. 모바일 390px 캡처에서 문항 전체 확인. PC의 헤더·이미지는 세로 스크롤을 사용해 확인 | [기출 전체 390](./after-three-official-question-390.jpg), [PC 기출 — 세로 스크롤](./after-three-official-question-pc.jpg) |
| 답 임시 선택·재접속·제출 | 3번 선택 후 제출 전 새로고침 → 선택 3번 유지 → 답 확인으로 정답 3번 확인. 390px에서 해설 전체 확인 | [해설 390](./after-three-answer-explanation-390.jpg) |
| 본편 복귀 | 해설 종료 후 C01-S07 cursor 1로 복귀, 지식 2 확인 | [기출 뒤 본편 복귀 390](./after-three-exam-return-390.jpg) |

이 검증은 본문에서 고른 발화·반응·합류·족보·기출·해설·다음 씬으로 이어지는 실제 경로와 두 재접속 지점을 포함한다. PC 이미지를 세로 스크롤해 읽은 결과를 문항 전체가 한 장의 PC 캡처에 동시에 들어온 결과로 확대하지 않는다.

### PR9 PC에서 별도로 진행한 전체 경로와 기록책

PC 뷰포트 1,363px에서도 C01-S06 본문부터 기출을 마친 뒤 C01-S07로 돌아오기까지 실제 클릭으로 연속 진행했다.

| 단계 | 실제 확인 내용 | 새 PC 캡처 |
| --- | --- | --- |
| 본문·NPC 전환 | main 1에서 한 번씩 눌러 2 서아 → 3 을파소 → 4 서아 → 5 연우 → 6 모진. 모진은 왼쪽에만 표시하고 서아는 표시하지 않음 | [모진 전환](./after-three-npc-switch-mojin-pc.jpg) |
| 선택·반응·재접속 | main 7·8 → 첫 대사형 선택문 → branch 1의 고른 발화 전체를 건너뛰지 않고 표시 → 2 연우. 새로고침 뒤 같은 2번 문장 전체를 복원하고 3·4로 진행 | [연우 반응](./after-three-branch-response-pc.jpg) |
| 공통 합류·족보 | join 1·2 → hint 1. 족보 기록 단계의 배우 0명 확인 | 통합 담당의 실제 연속 조작 보고 |
| 기출·정답·본편 복귀 | 64회 심화 3번 원본 → 답 3번 제출 → 정답 해설 전체 → C01-S07 cursor 1 복귀, 지식 2 확인 | [정답 해설](./after-three-answer-explanation-pc.jpg), [본편 복귀](./after-three-exam-return-pc.jpg) |
| 기록책·기출 복습 | 기록책의 읽은 이야기 6/215 확인. 실제 기출 복습 탭에서 학습 문항 1개·풀이 완료 1개와 64회 심화 3번 표시 확인 | [읽은 이야기](./after-three-recordbook-pc.jpg), [기출 복습](./after-three-recordbook-exams-pc.jpg) |

[기록책 390px](./after-three-recordbook-390.jpg)도 이번 PC 경로를 마친 뒤 같은 최신 기록 상태에서 다시 촬영했다. 모바일 390px와 PC 1,363px에서 각각 본문·선택·분기·합류·기출·해설·본편 복귀를 확인했으며, 제출 전 답 임시 선택의 새로고침 보존은 앞의 모바일 경로에 기록한 결과다.

### PR9 상세 연출 — 실제 확인한 수정

| 대상 | 실제 확인 범위와 결과 | 캡처 |
| --- | --- | --- |
| PRO3 L06 연우·어머니 부축 | PC·390px에서 같은 할머니가 한 번만 보이고, 양팔이 부축 상대에 닿는 접점 확인. 듣는 인물은 흐림, 서아는 책을 안은 활성 상태. 새로고침 뒤 L06을 유지하고 C01-S01 cursor 1로 이어짐 | [390](./after-three-grandmother-support-390.jpg), [PC](./after-three-grandmother-support-pc.jpg) |
| 해명 B1-R03 수신 인물·붕대 | C17-S04 B1-R03 390px에서 왼쪽 해명 수신 인물이 표시되고 새로고침 뒤에도 서아와 해명 유지. join 1에서 흰 붕대가 손에 붙어 있는 모습을 명확히 확인 | [B1-R03 390](./after-three-hand-bandage-390.jpg), [합류 390](./after-three-hand-bandage-join-390.jpg) |
| 소·쟁기 농경지 구도 | C11-S01-M02 390px. 첫 이미지 로딩 순간에는 비어 보였으나 로드 후 새 캡처에서 소의 머리·다리와 쟁기가 인물 얼굴 위쪽에 보이는 구도 확인. PR7에서 잘렸던 필수 요소의 해당 모바일 표시 문제를 보완 | [로드 완료 후 390](./after-three-ox-field-390.jpg) |
| 무덤 내부 구조 | C10-S03-M03 390px에서 단면과 열린 방이 보임. 실제 한 번씩 눌러 M04에서도 해당 표면 유지, M05에서는 제거되는 것 확인 | [단면 390](./after-three-tomb-section-390.jpg) |
| 불국사 두 탑 | C17-S05-M02 390px에서 서로 다른 두 탑이 인물 위쪽에 보이는 모습 확인 | [불국사 390](./after-three-bulguksa-390.jpg) |
| 석굴암 구성 | C17-S06-M03 360px에서 석재 블록의 조립 구성·불상·옆면 조각 확인 | [석굴암 360](./after-three-seokguram-360.jpg) |
| 청해진·법화원 지도와 시대 안내 | C18-S03-M07 → M08 390px에서 벽의 지도, 장소의 역할 및 시대 안내 문구가 대사에 맞게 달라지는 상태와 문장 전체 확인 | [청해진 390](./after-three-cheonghaejin-390.jpg), [법화원 390](./after-three-cheonghaejin-beophwawon-390.jpg) |
| 발해 관서의 서류 묶음 | C21-S04-M05 390px에서 이름이 있는 큰 묶음 3개와 작은 묶음 6개 확인 | [발해 관서 390](./after-three-balhae-office-390.jpg) |

추가 다섯 설정의 화면에는 수평 넘침이 없고 버튼·탐색 UI가 들어오는 것을 확인했다. 일반 조각가·상인·관리 화자에게 개별 인물 초상이 있다는 결과로 기록하지 않으며, 해당 화면에서는 서아가 오른쪽에 표시됐다. 이 표는 위 수정과 설정의 실제 확인 범위다. 모든 원고의 상세 동작·소품·음향 구현 완료 여부는 별도로 유지한다.

### PR9 정식 주소의 일반 메뉴·이어하기

[정식 운영 주소](https://history-iota-one.vercel.app/)의 일반 메뉴에서 다음을 확인했다.

| 대상 | 실제 확인 내용 | 캡처 |
| --- | --- | --- |
| 삼국 이어하기·재접속 | 이어하기로 PRO-S01 cursor 2/4에 진입, 서아 문장 2개 전체 표시. 브라우저 탭 새로고침 → 홈 → 삼국 이어하기를 거친 뒤 같은 cursor와 문장 전체가 정확히 같음(true) | [정식 삼국 이어하기 PC](./after-production-three-resume-pc.jpg) |
| 조선의 기존 저장 | 삼국을 저장한 뒤 조선 이어하기에서 기존 3/6 위치와 “갑자기 쏟아진 비” 문장이 유지됨을 실제 DOM 대조로 확인 | [저장 유지 PC — DOM 대조한 위치](./after-production-joseon-preserved-pc.jpg) |
| 현재 고려 공통 UI 기준 | 고려 NPC 화면을 PC·390px에서 새로 촬영해 현재 승인 공통 UI 비교 자료로 확보 | [PC](./baseline-goryeo-npc-pc-final.jpg), [390](./baseline-goryeo-npc-390-final.jpg) |
| 현재 조선의 일반 대화 | 검은 도입부 `joseon_ch00_s2` cursor 4에서 실제 한 번씩 눌러 5·6·7로 진행 → “탭하여 눈을 뜬다” → `joseon_ch00_s3` cursor 1 진입. PC·390px에서 민준 NPC는 왼쪽 아이보리 말풍선, 주인공은 오른쪽 흐림 상태의 승인 공통 대화 화면 확인 | [PC](./baseline-joseon-messenger-pc-final.jpg), [390](./baseline-joseon-messenger-390-final.jpg) |

조선의 `baseline-joseon-npc-*-final` 파일은 검은 배경의 도입부 4번을 담는다. 일반 누적 말풍선은 도입부에서 실제로 진행한 뒤 별도 촬영한 `baseline-joseon-messenger-*-final` 파일로 확인했다. 시대 저장 유지의 DOM 대조와 일반 대화의 육안 확인은 각각 위 행의 범위에 해당한다.

## 5. 원삼국 개정본의 별도 보존 범위

원삼국은 승인된 전체 원고를 8구간·83씬으로 연결했다. 선택 장면 36개에 선택문 108개가 있으며, 모든 분기의 작성 발화는 1,369개다. 학습 31개, 공식 기출 23개, 기출 큐 11개를 원문의 선행 학습과 발화 위치에 연결했다. A/B/C 전체 VM 경로는 각각 1,151개 발화의 ID·화자·본문·순서를 대조했다.

공통 UI의 일반 최근 3개/선택 화면 최근 2개 말풍선과 원삼국의 기존 타이핑 동작을 유지했다. 이전 기록은 보관하고 개정본 공통 학습으로 자동 완료시키지 않는다. 본문 → 고른 선택 발화 1회 → 반응 → 공통 합류 → 해당 기출 → 다음 씬 순서와 단계별 재접속을 검사했다.

전체 근거와 명령은 [원삼국 개정본 검증 기록](../proto-revision/VERIFICATION.md)에 있다. 원삼국 모바일 자동 검사 파일은 해당 작업에서 실제 Chromium으로 실행하지 않았다. 통합 담당은 아래 경로를 실제 운영 브라우저에서 별도로 플레이했으며, 이 결과를 전체 83씬의 픽셀 검증으로 확대하지 않는다.

### 실제 원삼국 선택·분기·기출·재접속·복귀

PR6 운영 확인 중 C02-S03에서 C02-S04까지 다음 흐름을 연속 플레이했다. PC와 390px에서 확인한 해당 화면과 두 재접속 지점을 함께 기록한다.

| 단계 | 실제 확인 내용 | 캡처 |
| --- | --- | --- |
| 선택 | C02-S03 choice cursor 10에서 “북쪽 길…”로 시작하는 첫 선택문 선택 | PC — 캡처 재확보 대기: `after-proto-choices-pc.jpg`, 390 — 캡처 재확보 대기: `after-proto-choices-390.jpg` |
| 고른 발화·반응·재접속 | 분기 1/3에서 주인공 → 2/3에서 아린 → 새로고침 후 같은 2/3 복원 → 3/3 진행 | 390 분기 — 캡처 재확보 대기: `after-proto-branch-390.jpg`, PC 반응 재접속 — 캡처 재확보 대기: `after-proto-reply-resume-pc.jpg` |
| 공통 합류 | 선택 반응 뒤 공통 합류 대사 3개를 차례로 진행 | 통합 담당 연속 플레이 확인 |
| 60회 심화 2번 원본 | 원본 이미지 자연 크기 546×624. PC와 390px에서 로드 완료 확인 | PC 기출 — 캡처 재확보 대기: `after-proto-official-question-pc.jpg`, 390 기출 — 캡처 재확보 대기: `after-proto-official-question-390.jpg` |
| 답 임시 선택·재접속 | 3번 답을 선택하고 제출 전에 새로고침. 같은 선택 보존 확인 후 제출 | 통합 담당 재접속 확인 |
| 정답·다음 기출 | 60회 심화 2번 정답 3번과 해설 → 62회 심화 2번 → 정답 2번과 해설 확인 | 390 해설 — 캡처 재확보 대기: `after-proto-answer-explanation-390.jpg` |
| 본편 복귀 | 두 기출을 마친 뒤 C02-S04 cursor 1로 복귀, 지식 6 확인 | 통합 담당 연속 플레이 확인 |

이 경로에서는 고른 선택 발화, 반응 도중 재접속, 공통 합류, 답 제출 전 임시 선택 복원, 연속 기출 후 본편 복귀를 실제 브라우저에서 확인했다.

### 첫 선택 화면 추가 확인

일반 원삼국 화면의 `proto_ch00_s2`, choice cursor 8을 PC와 390px에서 다시 확인했다. 대사형 선택문 3개, 최근 대사 2개, 인물 2명과 하단 탐색 버튼이 표시됐다. 해당 게임 영역의 실제 측정값은 PC 430×780, 390px 프레임 안에서 375×774였다. [PC 첫 선택](./after-proto-choices-pc.jpg)과 [390 첫 선택](./after-proto-choices-390.jpg)은 PR9 최신 운영본에서 다시 촬영한 이 장면의 캡처다. 위 C02-S03 연속 플레이의 선택 화면을 촬영한 것으로 사용하지 않는다.

## 6. 최신 확인 범위와 후속 검증 상태

| 항목 | 코드·자동 검사 상태 | 실제 화면 상태 | 후속 확인 |
| --- | --- | --- | --- |
| PR9 운영 반영 | main c6d402873114bb8f315a5f40454301427df0a1fb, Vercel success. 최종 네 검사 통과 | 실제 QA 49개 항목, 대표 인물·나이 변형·긴 선택문 4너비·가장 긴 기록 대사·연속 플레이·상세 연출과 정식 주소의 삼국 이어하기 확인 | 기록한 공통 UI·진행 범위 완료. 상세 연출 전체 완료 여부는 아래 장부와 구분 |
| 정식 주소·다른 시대 저장 | 삼국 v3 시대 격리·재접속 자동 검사 통과 | 실제 일반 메뉴의 삼국 PRO-S01 cursor 2/4 재접속 동일, 삼국 저장 후 조선의 이전 3/6 위치와 문장 유지. 고려·조선의 일반 대화 화면 PC·390px 확인 | 저장 유지는 실제 DOM 대조, 승인 일반 대화는 별도 육안 확인. 검은 조선 도입부를 일반 말풍선 화면으로 사용하지 않음 |
| PR8 운영 반영 | main 98c2462f969b0b6648e16613e460853fc0db7655, Vercel success | 한결 하단 복원, 을파소 전환, 긴 기록 대사 등 위 표의 장면 확인 | 배포 성공과 전체 인물 픽셀 QA를 구분 |
| 긴 기록 대사와 카운터 | 공통 UI 유지, PR9 운영본 재확인 | C16-S03-M10 PC·모바일 360px에서 최근 남색 말풍선 3개 전체·배우 0명·응답 버튼 확인 | 360px의 log clientHeight 450/scrollHeight 450. PC 폭 430px·높이 951px 자연 확장과 페이지 세로 스크롤. 10/10 한 줄과 해당 모바일 게임 345×774는 앞선 실제 측정에서도 확인 |
| 모바일 기출 헤더 | PR5 변경 이후 최신 운영본 | 삼국 64회 심화 3번 390px 확인 | 원본 이미지 552×601 로드 완료, 기록책을 포함한 한 줄 헤더 |
| 기록책 모달 | PR5 반영 | 360/390/430px 확인 | 닫기·탭·너비, 360px 원본 사진 1 내부 좌우 스크롤·복귀·닫기 |
| 공통 무대 하단 잘림 | PR6 반영, 기존 앵커 유지 | PR9 을파소·연우의 PC·모바일, 순도·해인 두 나이·가람 390px 및 하람 PC·390px에서 몸통의 수평 절단선 없음 확인 | 해당 대표 인물·너비에서 확인. 전체 초상 90개 전수 확인으로 확대하지 않음 |
| 한결 및 같은 원본 크롭 문제 | PR8 반영. 교정 전 63개 손실을 복원, 독립 재검사에서 90개 전체 원본 알파·최종 CSS 손실 0 | 390px 한결 양다리·신발 복원, 수평 절단선 제거 확인 | 크롭 교정 당시 PNG 15개·faceBounds 90개 불변. 이후 드러난 얼굴 기준점 문제는 별도 PR9 작업 |
| 얼굴 기준점·화면 체구 균형 | PR9 90개 원본 픽셀 계측·메타데이터 적용·최종 컴파일과 보존 검사 완료 | 한결·연우·을파소와 순도·해인 두 나이·가람·하람의 얼굴·몸 비율, 해당 말풍선·배우 규칙과 하단 표시 확인 | 프레임 밖으로 일부 나가는 팔·옷이나 말풍선 뒤의 몸을 전체 몸 화면 안 표시로 과장하지 않음. 관찰한 구도와 너비는 4절 참조 |
| 해인 도구 상자 | 분기 보존과 소품 하단 위치 보완 | C07-S01 B1 상자 없음 / B2 상자 있음, PR9 C07-S06 cursor 1의 도구 손잡이·소품 하단 배치 확인 | 소품은 일부 말풍선 뒤에 이어짐. 상자 전체의 바닥 접점 노출을 확인한 결과로 확대하지 않음. 분기·합류·재접속 보존은 실제 HTML 검사 범위 참조 |
| 편지 분기 배경 복귀 | 실제 HTML·복원 자동 검사 통과 | B1 네 대사 후 join 1의 대기처 배경 복귀와 같은 위치 새로고침 확인 | 원래 배경·진행 유지 |
| PRO3 L03/L04 | HTML·복원 검사 통과 | 해당 동작 확인 | 원본 사진 3장과 손·책 접점 |
| PRO3 L01 바닥 책 | PR7 좌표 보완 반영 | 390px 하단·발 근처 책과 L01 → L02 단일 탭 확인 | 해당 화면 완료. 다른 너비나 접점을 전수 확인했다는 뜻은 아님 |
| PRO3 L06 부축 | PR9 새 연우·어머니 페어와 배경 연결, 최종 74개 HTML·22회 복원 검사에 포함 | PC·390px의 양팔 접점·할머니 1명·듣는 인물 흐림·서아 책 안은 활성 상태, reload L06 유지·C01-S01 cursor 1 확인 | 해당 수정 실제 확인. 다른 동작 전수 확인으로 확대하지 않음 |
| 해명 B1-R03 수신 인물 | PR9 해당 줄에만 왼쪽 해명과 붕대 초상 연결. 최종 실제 HTML·복원 검사 통과 | 390px 수신 인물 표시·재접속의 두 인물 유지·join 1 흰 붕대 접점 확인 | 해당 줄과 합류 실제 확인. B2 등 다른 줄 보존은 자동 검사 범위 참조 |
| 새 설정 배경·표지 | PR9 배경 상태 10개·정확한 표면 3개 컴파일, 순수 API 검사 통과 | 다섯 실제 장면의 구조·탑·조각·지도/시대 안내·3/6 서류 묶음, 수평 넘침 없음과 버튼 표시 확인 | 무덤 단면 M03 → M04 유지 → M05 해제, 지도 M07 → M08 전환 확인. 전체 상세 연출 완료와 구분 |
| 원삼국 C02-S03 → S04 | v3 원문·저장·기출 연결 유지 | 실제 연속 플레이 확인 | 반응·답 임시 선택 재접속, 두 정답·해설, cursor 1 복귀·지식 6 |
| PR7 미완성 목탑 배경 | main c032fc2, Vercel success | C13-S03 main 2, 360px 확인 | 미완성 골조·비계·목재 표시 |
| 소·쟁기 배경 | PR7에서 발견한 구도 문제를 PR9에서 보완 | C11-S01-M02 390px 로드 완료 후 소 머리·다리와 쟁기가 인물 얼굴 위쪽에 보임 | 해당 모바일 구도 수정 확인. 초기 로드 중 빈 표시를 영구 이미지 누락으로 기록하지 않음 |
| 삼국 C01-S06 → S07 | v3 원문·분기·기출·임시 선택 보존 유지 | PR9 모바일 390px와 PC 1,363px에서 각각 NPC 전환부터 선택·반응 재접속·합류·hint·기출·해설·본편 복귀까지 실제 클릭으로 확인 | 두 경로 모두 고른 첫 발화·branch 2 복원·정답 해설·cursor 1 복귀·지식 2 확인. 답 3번 임시 선택 복원은 모바일 경로, 읽은 이야기 6/215·학습 문항 1개·풀이 완료 1개는 PC 경로 뒤 기록책 확인 |

상세 연출의 정확한 완료·미완 범위는 [연출 연결 기록](../three-content/STAGING_IMPLEMENTATION.md)과 [완료 항목 장부](../three-content/staging-completion-ledger.json)에 유지한다. 일반 배경이나 소품의 존재로 정밀한 손동작·건축 구조·군중·음향까지 완료로 판정하지 않는다.

## 7. 인물 90개 원본 크롭 감사 — 교정 전 기준과 결과

### 측정 기준과 핵심 원인

교정 전 PR7 main c032fc2의 전체 인물 생성 메타데이터는 복구 백업과 파일 SHA-256이 같았다: `32d630886eecc72d0c9f92e43aa6b167dac10c48dab6265f8780f53ae945402f`. 이 절은 PR8 크롭 교정 당시의 전후 비교다. [생성 메타데이터](../three-content/fullbody-portrait-generation.json)는 이후 PR9 얼굴 기준점 교정에서 다시 생성됐으므로 아래의 시점별 해시와 구분한다. 각 시트의 이미지 SHA를 확인하고 원본 alpha > 32의 연결 요소를 다시 계산해, originalAlphaBounds 및 실제 런타임 sourceRect와 대조했다. 기존 메타데이터의 “검토 완료” 표시를 통과 근거로 사용하지 않았다.

교정 전 90개 중 **63개는 원본의 하단 알파를 잘라 썼고, 27개는 원본 연결 요소 손실이 없었다.** 잘린 63개는 모두 당시 배치 설정의 displayHeightFraction=0.86에 해당한다. [현재 배치 설정](../three-content/fullbody-portrait-layout.json)은 전체 실루엣을 포함하도록 교정됐다. 누락 높이는 61–111 원본 픽셀이고, 누락됐던 alpha > 32 픽셀은 합계 **428,165개**다. 손실 방향은 모두 하단이며 위·좌·우 손실은 없었다.

portraitFraming은 head-to-knees 88개·full-body 2개였으나, 이 표기만으로 크롭 손실을 판단하면 안 된다. head-to-knees 88개 중 25개는 이미 전체 알파를 포함한다. 실제 손실 없는 27개를 재생성 대상으로 세지 않는다.

원인은 교정 전 측정 스크립트가 실제 연결 요소의 높이에 0.86을 곱해 sourceRect를 만들고 그 잘린 영역 안에서만 clipPath를 검사한 데 있었다. completeSolidSilhouetteInsideClip=true는 잘린 sourceRect 바깥의 원본 픽셀을 검사하지 못해 전신 보존을 증명하지 않았다. [현재 측정 스크립트](../../scripts/measure-three-fullbody-art.py)는 전체 동일 연결 요소를 기준으로 rect 밖 픽셀 수 0을 검증한다.

### 한결의 실제 관찰과 얼굴 유지

- 대상: `civilian-c08-654ff58ca5--initial`, C08-S08 B1 branch cursor 2.
- 실제 DOM: left −3px, top 241px, width 180px, height 327.75px, bottom 568.75px. 컨테이너 overflow가 visible인 상태에서도 하단의 평평한 단면이 공중에 보였다.
- 원본 `principal-fullbody-atlas-05.png`에는 신발까지 존재한다. 원본 연결 요소는 x400/y525/236×504, 아래 끝 y1029다.
- 교정 전 sourceRect는 x398/y523/240×437, 아래 끝 y960이었다. 하단 69픽셀과 alpha > 32 픽셀 5,435개를 제외했다.
- 교정된 sourceRect는 x398/y523/240×508이다. 얼굴 좌표 x486/y556/83×85와 sourceRect의 x·y·width가 이전과 같다. 원본 연결 요소의 78,851개 알파 픽셀을 모두 포함한다.
- 교정 전후 90개 전체의 faceBounds와 sourceRect x·y·width를 대조해 일치를 확인했다. 63개는 높이만 확장했으며, 얼굴 좌표와 기존 앵커의 근거를 유지했다. 실제 화면에서의 발 위치·크기·겹침은 별도 재확인 대상이다.

이 수치는 원본 크롭 문제를 설명한다. 원본 이미지 자체가 상반신뿐이라거나 새 인물 63명을 다시 그려야 한다는 결론으로 사용하지 않는다. 한결의 원본 신발은 실제 이미지를 열어 확인했고, 전체 90개에는 동일 알파 계산을 적용했다. 이는 90개 모두의 실제 게임 화면을 확인했다는 의미가 아니다.

### 영향 시트

| 시트 | 영향 인물 수 | 하단 누락 높이(px) |
| --- | ---: | ---: |
| `principal-fullbody-01` | 9 | 68–71 |
| `principal-fullbody-02` | 9 | 68–73 |
| `principal-fullbody-03-spaced` | 9 | 67–74 |
| `principal-fullbody-05` | 9 | 69–73 |
| `recurring-fullbody-01` | 7 | 61–78 |
| `recurring-fullbody-02-selected` | 5 | 79–83 |
| `recurring-fullbody-03-spaced` | 6 | 80–82 |
| `recurring-fullbody-04-spaced` | 5 | 72–85 |
| `recurring-fullbody-05` | 4 | 99–111 |

### 실제 손실 63개 전체 목록

아래 높이와 픽셀 수는 교정 전 PR7 main의 원본 알파와 sourceRect 대조값이다. 원문 인물 ID와 초기/후기 변형을 구분했다.

| 인물 | 원문 인물 ID | 시트 | 누락 높이(px) | 누락 알파 픽셀 |
| --- | --- | --- | ---: | ---: |
| CH03 순도 | `history-sundo--initial` | `principal-fullbody-01` | 68 | 4,957 |
| CH03 광개토대왕 | `history-gwanggaeto--initial` | `principal-fullbody-01` | 71 | 6,336 |
| CH04 장수왕 | `history-jangsu--initial` | `principal-fullbody-01` | 71 | 6,612 |
| CH05 을지문덕 | `history-euljimundeok--initial` | `principal-fullbody-01` | 70 | 6,366 |
| CH06 마라난타 | `history-marananta--initial` | `principal-fullbody-01` | 69 | 5,652 |
| CH07 문주왕 | `history-munju--initial` | `principal-fullbody-01` | 71 | 7,555 |
| CH08 무령왕 | `history-muryeong--initial` | `principal-fullbody-01` | 70 | 6,400 |
| CH08 성왕 | `history-seong--initial` | `principal-fullbody-01` | 70 | 6,456 |
| CH11 법흥왕 | `history-beopheung--initial` | `principal-fullbody-01` | 70 | 7,187 |
| CH13 자장 | `history-jajang--initial` | `principal-fullbody-02` | 71 | 5,529 |
| CH13 김춘추 | `history-kimchunchu--initial` | `principal-fullbody-02` | 70 | 6,315 |
| CH13 김유신 (older) | `history-kimyusin--older` | `principal-fullbody-02` | 72 | 6,039 |
| CH15 우륵 | `history-ureuk--initial` | `principal-fullbody-02` | 73 | 6,164 |
| CH16 신문왕 | `history-sinmun--initial` | `principal-fullbody-02` | 73 | 7,351 |
| CH17 원효 | `history-wonhyo--initial` | `principal-fullbody-02` | 72 | 6,213 |
| CH17 의상 | `history-uisang--initial` | `principal-fullbody-02` | 68 | 5,352 |
| CH18 장보고 | `history-jangbogo--initial` | `principal-fullbody-02` | 69 | 5,955 |
| CH19 최치원 | `history-choechiwon--initial` | `principal-fullbody-02` | 69 | 5,631 |
| CH20 대조영 | `history-daejoyeong--initial` | `principal-fullbody-03-spaced` | 74 | 6,889 |
| CH23 왕건 | `history-wanggeon--initial` | `principal-fullbody-03-spaced` | 74 | 12,160 |
| CH01 해솔 | `civilian-c01-e46c301472--initial` | `principal-fullbody-03-spaced` | 71 | 9,181 |
| CH02 하준 | `civilian-c02-4d5f80821a--initial` | `principal-fullbody-03-spaced` | 70 | 9,256 |
| CH02 기록관 소정 | `civilian-c02-9b1f1302f8--initial` | `principal-fullbody-03-spaced` | 69 | 11,132 |
| CH02 전령 태수 | `civilian-c02-cb385fcd2e--initial` | `principal-fullbody-03-spaced` | 70 | 10,178 |
| CH02 기록관 연진 | `civilian-c02-55738cfbf1--initial` | `principal-fullbody-03-spaced` | 70 | 9,979 |
| CH03 규림 | `civilian-c03-c4d6a1921b--initial` | `principal-fullbody-03-spaced` | 67 | 5,843 |
| CH03 기록관 가현 | `civilian-c03-df0b7cedbc--initial` | `principal-fullbody-03-spaced` | 68 | 7,148 |
| CH05 초연 | `civilian-c05-f39ddef04b--initial` | `principal-fullbody-05` | 73 | 5,045 |
| CH06 솔아 | `civilian-c06-06c13888f0--initial` | `principal-fullbody-05` | 70 | 5,623 |
| CH06 유솔 | `civilian-c06-a57fc4150e--initial` | `principal-fullbody-05` | 72 | 5,261 |
| CH07 다솔 | `civilian-c07-e5bc0b19d9--initial` | `principal-fullbody-05` | 69 | 4,830 |
| CH08 한결 | `civilian-c08-654ff58ca5--initial` | `principal-fullbody-05` | 69 | 5,435 |
| CH09 도연 | `civilian-c09-a249e6df49--initial` | `principal-fullbody-05` | 69 | 5,658 |
| CH09 다은 | `civilian-c09-030d6d22c0--initial` | `principal-fullbody-05` | 70 | 4,603 |
| CH09 설 | `civilian-c09-10ee4060ed--initial` | `principal-fullbody-05` | 70 | 4,950 |
| CH10 미솔 | `civilian-c10-0eeeeba617--initial` | `principal-fullbody-05` | 70 | 4,628 |
| CH01 모진 | `civilian-c01-de48dcbf5b--initial` | `recurring-fullbody-01` | 78 | 5,457 |
| CH02 도림 | `civilian-c02-dc712ed4d6--initial` | `recurring-fullbody-01` | 78 | 5,533 |
| CH02 소운 | `civilian-c02-f88710b136--initial` | `recurring-fullbody-01` | 78 | 5,604 |
| CH04 다은 | `civilian-c04-030d6d22c0--initial` | `recurring-fullbody-01` | 73 | 4,881 |
| CH05 윤서 | `civilian-c05-f0f456bbbe--initial` | `recurring-fullbody-01` | 75 | 5,306 |
| CH05 태문 | `civilian-c05-0b1fbc16b0--initial` | `recurring-fullbody-01` | 75 | 5,109 |
| CH07 해인 | `civilian-c07-cf158c9e21--initial` | `recurring-fullbody-01` | 61 | 5,987 |
| CH08 여울 | `civilian-c08-dadbb6670e--initial` | `recurring-fullbody-02-selected` | 80 | 6,403 |
| CH08 여울 (later) | `civilian-c08-dadbb6670e--later` | `recurring-fullbody-02-selected` | 80 | 6,792 |
| CH14 아라 | `civilian-c14-a432ade2f8--initial` | `recurring-fullbody-02-selected` | 79 | 6,260 |
| CH14 해들 | `civilian-c14-0dd939f957--initial` | `recurring-fullbody-02-selected` | 83 | 7,040 |
| CH17 보라 | `civilian-c17-96b6ef53a4--initial` | `recurring-fullbody-02-selected` | 82 | 5,956 |
| CH17 해명 | `civilian-c17-439b052a1f--initial` | `recurring-fullbody-05` | 109 | 9,703 |
| CH20 해루 (later) | `civilian-c20-4d6a648490--later` | `recurring-fullbody-05` | 111 | 10,251 |
| CH23 시온 | `civilian-c23-3943a3c0de--initial` | `recurring-fullbody-05` | 99 | 9,444 |
| CH23 시온 (later) | `civilian-c23-3943a3c0de--later` | `recurring-fullbody-05` | 100 | 10,078 |
| CH18 나래 | `civilian-c18-3b7989e4fe--initial` | `recurring-fullbody-03-spaced` | 81 | 6,713 |
| CH18 나래 (later) | `civilian-c18-3b7989e4fe--later` | `recurring-fullbody-03-spaced` | 81 | 6,803 |
| CH19 재인 | `civilian-c19-b25411c7fa--initial` | `recurring-fullbody-03-spaced` | 82 | 7,105 |
| CH19 재인 (later) | `civilian-c19-b25411c7fa--later` | `recurring-fullbody-03-spaced` | 81 | 7,037 |
| CH19 지우 | `civilian-c19-c8f92f89ce--initial` | `recurring-fullbody-03-spaced` | 80 | 6,713 |
| CH20 해루 | `civilian-c20-4d6a648490--initial` | `recurring-fullbody-03-spaced` | 81 | 7,065 |
| CH20 누리 | `civilian-c20-5dd3802c4d--initial` | `recurring-fullbody-04-spaced` | 85 | 7,595 |
| CH22 은서 | `civilian-c22-c9e48fc48e--initial` | `recurring-fullbody-04-spaced` | 85 | 8,556 |
| CH22 은서 (later) | `civilian-c22-c9e48fc48e--later` | `recurring-fullbody-04-spaced` | 85 | 8,323 |
| CH22 은서의 딸 | `civilian-c22-c56eca783f--initial` | `recurring-fullbody-04-spaced` | 72 | 5,783 |
| CH22 은서의 딸 (later) | `civilian-c22-c56eca783f--later` | `recurring-fullbody-04-spaced` | 80 | 6,799 |

### 교정 반영 결과

교정은 PR8 main 98c2462f969b0b6648e16613e460853fc0db7655에 반영됐고 Vercel 배포 성공을 확인했다. 초상 담당의 [90개 전후 기록](../three-content/fullbody-crop-repair-audit.json)과 별도로 원본 PNG의 연결 요소를 다시 계산했다. 이어서 실제 런타임이 사용하는 직렬화된 CSS percentage 좌표를 파싱하고, evenodd 다각형을 원본의 모든 픽셀 중심에 대해 다시 래스터화해 원본 실루엣과 대조했다. 최종 CSS의 반올림 오차와 신발 사이의 이웃 인물 혼입도 이 비교에 포함된다.

| 독립 재검사 항목 | 결과 |
| --- | ---: |
| 대조한 인물 변형 | 90개 |
| 원본 PNG SHA 불변 | 15개 / 15개 |
| faceBounds 불변 | 90개 / 90개 |
| sourceRect의 x·y·width 불변 | 90개 / 90개 |
| sourceRect 높이 확장 | 63개 |
| 원본 연결 요소의 sourceRect 바깥 손실 | 0픽셀 |
| 최종 CSS 클립에서 누락된 원본 알파 | 0픽셀 |
| 최종 CSS 안으로 유입된 이웃 인물 알파 | 0픽셀 |
| 최종 CSS 마스크와 원본 연결 요소가 정확히 일치 | 90개 / 90개 |

PR8 크롭 교정 당시 생성 메타데이터 SHA-256은 `70a716b0bdaa460495196bd68073bed0b58790c51c5faab1c16b2d0b137de724`다. 전체 실루엣의 오목한 부분과 구멍까지 보존한 clipPath를 사용하며, 이 크롭 교정에서 원본 PNG 자체를 다시 그리거나 얼굴 좌표를 이동하지 않았다. 아래 후속 얼굴 기준점 교정은 이 작업과 범위·시점을 구분한다.

이 결과로 크롭 교정 코드와 원본 보존의 독립 검사를 완료했다. 이후 운영 390px의 한결에서 양다리와 신발 복원·수평 절단선 제거를 확인했다. 원본 픽셀 손실이 없다는 결과만으로 모든 인물의 게임 화면 내 배치·발 접점·대사와의 겹침을 검증했다고 기록하지 않는다.

### 후속 얼굴 기준점 교정 — PR9 적용과 한결 실제 확인

한결의 원본 실루엣을 복원한 뒤에도 서아보다 체구가 작아 보여, 원본 그림의 실제 얼굴과 기존 faceBounds를 별도로 대조했다. 기존 `{x:486, y:556, width:83, height:85}`는 머리 부분과 턱 아래 목까지 포함했다. 적용한 `{x:493, y:566, width:70, height:54}`는 이마의 유효 경계부터 턱까지, 귀를 포함하는 기준이다. 같은 얼굴 표시 크기를 목표로 할 때 균일 배율의 예상 변화는 85/54 = 약 1.574배다. 이후 PR9 운영 390px에서 한결의 표시 높이가 PR8 380.984px에서 599.71875px로 바뀐 실제 결과를 확인했으며, 진행·복원·게임 기준 배우 좌표와 구도의 제한은 4절에 따로 기록했다.

[주요 인물 61개 얼굴 기준점 계측](../three-content/principal-face-anchor-audit.json)은 실제 사용하는 principal 01–07 시트와 가람·하람 별도 시트, 원본 PNG 8개를 대조했다. 원본 픽셀 좌표 위에 새 상자를 겹쳐 61개를 검토했고 PNG·전신 실루엣·sourceRect·원문은 수정하지 않았다. 33개는 보이는 경계를 기준으로 ±2px, 28개는 수염·앞머리·삭발된 이마의 해석을 포함해 ±3–4px의 수동 계측 불확실성을 기록했다. 머리카락·모자 높이·턱 아래 목을 얼굴 높이로 사용하지 않으며, 수염 아래로 가려진 턱 등은 추정 항목으로 표시했다. 기존 서아의 승인 기준 `{x:416, y:86, width:140, height:143}`는 유지했다.

활성 측정 스크립트는 layout의 faceBounds를 복사하며, 몸 높이의 0.17을 곱하는 계산은 해당 경로에서 발견하지 못했다. 과거 고정 좌표가 만들어진 방법은 이 코드만으로 확정하지 않는다. 주요 인물 61개 감사 파일의 SHA-256은 `55c39a0a3bfd2d6af0a2a29a8b8e10ad66ff2610ce044d42167e522bfc891538`이다.

반복 인물 27개는 [recurring 01의 7개](../three-content/recurring01-face-anchor-audit.json), [recurring 04의 5개](../three-content/recurring-face-skin-review-root.json), [recurring 02·03·05의 15개](../three-content/recurring-face-skin-review-b.json)를 계측해 합쳤다. 추가 15개는 원본 PNG 3개 위에서 검토했으며, 12개는 ±2px, 머리띠·머릿수건·짧은 턱수염이 있는 3개는 ±3px로 기록했다. 나래 등 기존 상자에서 귀나 턱이 누락된 인물은 상자를 필요한 방향으로 넓혔다. 모든 상자의 높이를 일정 비율로 줄이는 방식은 사용하지 않았다. 별도 기본 인물 2개와 행동 초상은 [해당 계측 기록](../three-content/standalone-face-skin-review.json)에 있다.

[90개 합본 적용 감사](../three-content/portrait-face-application-audit.json)는 원본 시트 15개의 전신 인물 90개 모두에 계측 좌표가 적용됐음을 확인한다. 얼굴 기준점 교정 동안 PNG SHA 15개, 전신 sourceRect·clip·alpha·상체 bounds 90개, 나머지 캐릭터 항목 154개, 승인 서아와 원본 사진은 유지했다. 행동 변형 7개의 원본 크롭·alpha도 유지했다. 최종 generation SHA-256은 `d9d6b84d60f534483f8c538c0e00f3e6323956bb1eabc9a00cd9438430a9ee9a`, 런타임 three-complete-art.js SHA-256은 `161346951e632860c51a7139108c4f21e88c69c67cad8c34d6f1a21fe1a2ca4b`다. [최종 연출·인물 파일 목록](../three-content/pr9-art-staging-checkpoint.json)의 런타임 해시는 이번 네 검사 입력과 일치한다. 이 결과는 좌표 적용과 원본 보존 결과다. 한결은 새 기준점의 실제 화면을 확인했고, 나머지 대표 인물·연출의 확인 범위는 별도로 누적한다.

## 8. 최종 갱신과 완료 범위

PR9 배포 성공, 90개 크롭 교정의 독립 검사와 새 얼굴 기준점 적용, 대표 인물·나이 변형의 새 화면과 네 너비의 긴 선택문, 단일 탭·배우 위치·복원, 가장 긴 기록 대사 PC·360px 표시, 표에 기록한 원삼국·삼국의 연속 플레이 경로를 확인했다. 새 부축 페어·해명 수신 인물과 붕대·소와 쟁기 및 다섯 설정도 각각 기록한 장면·너비에서 확인했다. PR7의 PRO3 바닥 책 390px와 C13 공정 360px도 해당 화면에서 확인했다. 정식 주소의 삼국 이어하기는 새로고침 뒤에도 같은 cursor와 문장을 복원했고, 삼국 저장 뒤 기존 조선의 3/6 위치와 문장도 유지했다. 고려·조선의 일반 대화는 PC·390px에서 확인했다.

PC의 게임 폭은 430px이며 긴 콘텐츠에서 높이 951px까지 자연스럽게 늘어나고 페이지 세로 스크롤을 사용할 수 있다. 해당 한결·원삼국 첫 선택 화면의 PC 실측 430×780을 모든 장면의 고정 높이로 사용하지 않는다. 확인한 인물의 몸은 공통 말풍선 뒤로 이어지고 프레임 가장자리에서 일부 벗어날 수 있으므로 몸 전체가 한 화면 안에 들어왔다고 표현하지 않는다.

최종 컴파일 후 보존·승인 UI·순수 연출 API·실제 HTML 연출 검사를 한 번씩 실행해 모두 통과했고, 로그와 변하지 않은 입력 260개의 해시를 묶었다. 통합 담당의 실제 QA 보고에서 확인한 장면·너비·접점·복원 결과만 추가한다. 모든 원본 사진·인물 초상 90개·세부 행동을 실제 화면에서 전수 검증했다고 기록하지 않는다.

