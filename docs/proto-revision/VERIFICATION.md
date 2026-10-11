# 원삼국 개정본 검증

## 확인한 결과

| 검사 | 결과 |
| --- | --- |
| 원본 및 생성 파일 | 1,048,353바이트 원본 SHA 일치. 생성 JS 1,118,270바이트. 승인된 전체 JSON과 런타임 객체 일치 |
| 구조 | 8구간, 83씬, 36개 선택 장면, 108개 선택문, 모든 분기의 1,369개 발화 |
| 실제 VM 재생 | A/B/C 전 경로 각각 1,151개 발화의 ID·화자·본문·순서 일치. B 경로 23개 오답 제출도 끝까지 완료 |
| 공통 학습 | 공통 발화 1,042개와 학습 31개. 옛 방문·완료·문제 기록만으로 새 학습이 열리지 않음 |
| 실제 기출 | 원고의 23개 문항과 11개 큐, afterLineId 및 선행 장면, 4/5개 보기, 원본 이미지 23개 SHA, 정답 인덱스 대조 |
| 공통 UI | 모든 1,369개 발화 프레임과 108개 선택문. 최근 대사 3개/선택 화면 2개, 공통 버튼·화자, 원문 무축약 |
| 저장 | 본문·선택 직전·선택한 발화·반응·공통 대사·큐·답 임시 선택·오답 제출·마지막 정답 제출 직후 재접속 |
| 독립 복구 | 전용 키만 남은 경우 정확한 run과 학습 복구. 옛 키·다른 저장 키 보존 |
| 손상/이전 저장 | 불완전 JSON·미지 스키마·잘못된 보관 목록 원본 보관. 이전 버전 이력 보존, 새 완료 자동 승격 없음 |
| 유효 학습 + 손상 커서 | 학습·풀이·완료 기록 보존, 불가능한 커서만 복구 |
| 선택적 복습 | 저장/재접속 후에도 본편 run과 복귀 화면 보존 |
| 시대 격리 | 다른 시대 mainRun을 가진 원삼국 재플레이 종료/복귀. Three 테스트의 네 시대 재산·플래그·커서 왕복 |
| 기존 데이터 | 다른 시대 장면·챕터·문항·자산과 이전 원삼국 23개 문항 객체 개별 보존 비교 |
| 기존 스타일 | 공통 dialogue.css 및 원래 렌더러 해시. 고려·조선 game HTML 동일 |
| 기존 초상 검사 | 1,264개 가상 대화 프레임, 초상 태그 1,998개. 원문·문항·시스템 보존 |
| 기존 배경 검사 | 83개 경로와 19개 보호 장면. 남은 상징 SVG 배경 0개 |
| 모바일 검사 파일 | v2 전제 제거. v3 단계·읽기 증명·원문 이미지·실제 클릭·새로고침을 사용하는 360/390/430/1280px 검사로 복구. 구문 검사 통과 |

## 실행한 명령

~~~sh
python scripts/import-proto-revision.py --check
node tests/proto-revision-test.cjs
node tests/proto-save-v3-test.cjs
node tests/proto-story-test.cjs
node tests/proto-main-preservation-test.cjs
node tests/proto-art-test.cjs
node tests/proto-background-art-test.cjs
node tests/ancient-story-test.cjs
node tests/ancient-full-play-test.cjs
node tests/three-save-v3-test.cjs
node --check tests/proto-mobile-test.cjs
~~~

## 검증의 범위

위 결과는 승인 원본 대조와 실제 앱 스크립트를 사용하는 VM 재생·저장 검사이다. 모바일 테스트 파일은 이 작업에서 실제 Chromium으로 실행하지 않았다. 실제 브라우저에서 캐릭터 겹침·스크롤·선택 버튼·질문 이미지 확대를 확인하는 단계와 배포 확인은 통합 담당자가 수행한다.

원본은 4개 문서를 그대로 복구했고 이전 23개 문항 스냅샷은 고정 커밋에서 다시 추출해 이전 SHA와 일치함을 확인했다. 작업 공간 복구 후 위 검사를 다시 실행했다. 최종 파일별 바이트와 SHA는 implementation-manifest.json에 기록한다.
