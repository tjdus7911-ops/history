# 삼국편 기출 데이터 가져오기

`exam-mapping.xlsx`의 세 시트와 `complete-manuscript.md`의 기출 연결 블록을 실행용 데이터로 변환한다. 엑셀에서 선정 여부, 정답, 해설, 302개 연결과 실제 출제 순서를 읽고, 대본에서 정확한 마지막 발화와 추가 연결의 이유를 대조한다. 작업 당시의 별도 연구 JSON 파일은 빌드에 필요하지 않다.

```sh
python3 scripts/import-three-complete-exams.py
python3 scripts/import-three-complete-exams.py --check
```

첫 명령은 `dist/three-exam-data.json`, `dist/three-exam-data.js`와 `exam-import-audit.json`을 생성한다. 두 번째 명령은 같은 입력을 다시 읽고 생성물이 일치하는지 검사하며 파일을 수정하지 않는다. 파이썬 표준 라이브러리만 사용하며 네트워크에 접근하지 않는다.

## 원본과 검증 자료

| 파일 | 역할 |
|---|---|
| `exam-mapping.xlsx` | 사용자 확정 배치표. 선정·정답·해설·출제 위치의 기준 |
| `complete-manuscript.md` | 원고. 삽입 기준 발화와 302개 연결의 대조 기준 |
| `exam-source-evidence.json` | 원문·공식 정답 확인 이력, 완전한 보기 전사본, 현재 원문 이미지의 검토 해시 |
| `../../dist/official-exam-catalog.json` | 기존 공식 문항의 원본 파일명·회차·연도·쪽·이미지 경로·0기반 정답 |
| `exam-import-audit.json` | 가져오기에서 재계산한 전체 수량, 원문 이미지 해시·크기, 검사 결과 |
| `exam-reference-comparison.json` | 최초 변환물을 기존 검증 자료와 별도로 대조한 결과와 오류 입력 거부 검사 |

출처 URL과 공식 정답 URL은 문항마다 보존된다. `exam-source-evidence.json`은 문항을 선정하거나 엑셀의 정답을 덮어쓰지 못한다. 엑셀 정답은 이 자료의 1기반 정답과 기존 카탈로그의 0기반 정답에 모두 일치해야 한다.

이미지는 기존 `dist/assets/exams/catalog/`의 원문 바이트를 그대로 사용한다. 91개 이미지의 발문, 자료, 선지, 문항 번호와 마지막 선지 경계를 모아 보기로 시각 확인했다. 기존 연구 자료의 `repoImageVisuallyReviewedThisTurn` 값은 바꾸지 않고, 이번 원문 이미지 확인을 별도 `runtimeImageReview`에 기록했다. 이미지 해시가 변경되면 가져오기가 실패한다. 새 원문을 실제로 확인한 뒤 검토 근거를 갱신해야 한다.

## 실행 데이터

브라우저 전역은 `globalThis.THREE_COMPLETE_EXAMS`이다.

- `questions`: 선정된 서로 다른 91문항. 기본 31개는 4지, 심화 60개는 5지다.
- `scenes`: 본편 215씬과 대표 연결 215건·추가 연결 87건. `learningFocus`, `component`, `reason`, `sceneNote`는 제작 자료다.
- `schedule`: 대표 배치 99행. `playMode: first` 77문항만 기본 진행에서 열며, `review` 22회는 선택 재풀이이다.
- `additionalCandidates`: 대표 배치와 겹치지 않는 문항·도착 씬 묶음 26개. `playMode: additional`이며 선택 복습으로 개방한다.
- `ledger`: 선정 91개와 검토만 한 31개를 합한 122개 원장. 검토만 한 문항을 기본 문제 목록에 설치하지 않는다.

런타임 `answer`는 **0기반**이며 `answerNumber`는 출처의 **1기반** 번호다. `choiceCount`와 `negative`를 유지한다. 원문 보기를 온전히 전사한 선정 문항은 9개뿐이므로 나머지 82개에는 빈 `options`를 두었다. 이를 임의로 채우지 않는다. 모든 문제는 원문 전체 이미지와 순서대로 된 번호 선택으로 풀 수 있다. `summary`, `clue`, `correctChoice`, 정답과 해설을 답변 전에 공개하면 안 된다.

`officialQuestionId`가 문항의 동일성을 정한다. `schedule[].id`는 특정 도착 씬에서의 출제 기회를 식별하며, 이를 풀이 완료 문항의 ID로 사용하면 같은 공식 기출이 중복 강제 출제될 수 있다. 다른 선택 복습에서 먼저 답한 문항은 나중 기본 큐에서 건너뛰고, 명시적으로 복습을 선택했을 때에는 다시 풀 수 있어야 한다.

모든 출제 기회에는 `quizAfterSceneId`, `sourceSceneIds`, `anchorSpeaker`, `anchorText`가 있다. 본선·선택 분기·공통 연결·정식 기록책 발화가 모두 끝난 뒤 `insertPhase: after_join`에서 처리한다. `preQuizHints`는 그 문항을 실제로 사용할 때에만 기록책으로 표시하며 NPC 발화로 섞지 않는다.

해설은 답변 뒤 해당 출제 기회의 `playExplanation`을 우선 사용한다. 79회 심화 9번은 CH23 S05의 간단한 해설과 CH23 S10 이후의 확장 해설을 구분한다. 문항과 일정에 저장된 `fullExplanationAfterSceneId`가 충족되기 전에는 원장의 전체 `explanation`을 기록책이나 복습 화면에서도 공개하지 않는다.

## 검사 범위와 화면 검증

가져오기는 전체 수량, 공식 문항 ID 중복, 모든 출제 위치와 발화, 연결·정답 대조, 조건부 기록책 문구, 지연 해설, 이미지 존재·형식·크기·해시를 검사한다. 원래 배치표에서 다른 씬으로 옮기거나 같은 문항을 두 번 첫출제로 표시하면 실패한다.

이 검사는 실제 모바일 UI의 확대·스크롤·선택 동작을 대신하지 않는다. 원문 이미지 폭은 531~552px이므로 런타임에서는 전체 보기를 유지하고 확대 기능을 제공해야 한다. 실제 플레이와 저장 복원 검사는 게임 런타임의 검증 결과에서 확인한다.
