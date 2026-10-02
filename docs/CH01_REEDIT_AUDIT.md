# CH.01 전체 재편집 감사 기록

## 범위와 기준

- 범위: 2026년 프롤로그부터 930년 고창 전투와 `CHAPTER CLEAR`까지.
- 기존 스토리 데이터 35개는 저장 호환을 위해 삭제하지 않았다. 실제 본편 경로(`storyActive`)는 23개에서 16개로 줄였다.
- 문제는 첨부 문제지와 정답표에서 회차·등급·번호·지문·선지·정답을 직접 확인한 것만 `VERIFIED_OFFICIAL`로 활성화했다.
- 기존 `isOfficial:false` 문항은 기록 호환용으로 보존하되 전부 `retired: true`, `reviewOnly: true`, `SELF_AUTHORED`로 분류했다.

## 장면 분류

| 분류 | 장면 | 처리 |
|---|---|---|
| KEEP | `prologue`, `sleep`, `voice` | 2026 → 암전 2회 → 도윤 등장 훅을 그대로 유지 |
| SHORTEN | `house`, `outfit_gift`, `ch01_reconcile`, `ch01_jump_930` | 장소·옷·생계의 반복 설명과 장황한 감정 대화를 압축 |
| MERGE | `outfit_question` → `outfit_gift`, `market` → `ch01_trade_start`, `ch01_missing_traders` → `ch01_gongsan`, `ch01_conflict_night` → `ch01_reconcile`, `ch01_ending_930` → `ch01_clear_930` | 옛 ID는 리디렉션으로 보존하고 활성 경로에서 제외 |
| REMOVE | 별도 물리 삭제 없음 | 저장 데이터 보호 때문에 병합 장면은 남기되 `storyActive: false` 처리 |
| ENHANCE | `rumor`, `foundation`, `ch01_trade_start`, `ch01_jump_927`, `ch01_gongsan`, `ch01_conflict`, `ch01_reconcile`, `ch01_gochang`, `ch01_belonging`, `ch01_clear_930` | 918 훅, 9년 몽타주, 전쟁 피해, 갈등·화해, 공산/고창 대비, “우리가?” 엔딩 강화 |
| EXAM | `foundation`, `ch01_gongsan`, `ch01_gochang` | 검증된 실제 기출 3개를 기억 UI로 연결 |

## 새 활성 흐름

1. `prologue` → `sleep` → `voice` → `house`: 기존 암전과 첫 만남 보존.
2. `outfit_gift`: 현대 옷 지적, 갈 곳 없음, 평민복, 작은 장사, 첫 농담을 한 장면에 통합.
3. `rumor` → `foundation`: 익명 주민의 궁예·왕건·고려 소문 뒤 918년 타이틀과 69회 기본 10번.
4. `ch01_trade_start` → `ch01_jump_927`: 장사와 관계의 9년을 짧은 몽타주로 압축.
5. `ch01_gongsan`: 부상당한 상인을 예외 스탠딩으로 보여 준 뒤 거래 단절, 왕건 패배, 신숭겸 전사를 경험하고 79회 심화 9번.
6. `ch01_conflict` → `ch01_reconcile`: 사업 손실로 갈등하고 짧은 사과와 농담으로 화해.
7. `ch01_jump_930` → `ch01_gochang`: 미래 지식에 대한 의심과 공산의 어둠/고창의 희망을 대비한 뒤 70회 심화 10번.
8. `ch01_belonging` → `ch01_clear_930`: “이번에는 우리가 이겼군.” → “우리가?” → “십 년 가까이 여기 살았으면 고려 사람 아니오?”와 918/927/930 요약.

## 문제 전수 감사

재편집 전 CH.01 등록 문항은 16개였다. 활성 본편 7개는 모두 자체 제작이었고, 완료 후 복습 5개 중 실제 기출은 2개였다. 재편집 후 활성 본편과 완료 후 복습은 아래 3개의 검증 기출로 동일하게 구성한다.

| questionId | 판정 | 원본 | 장면 | conceptIds |
|---|---|---|---|---|
| `ch01-official-69-basic-10` | `VERIFIED_OFFICIAL` | 69회 기본 10번, 정답 ③ | `foundation` | `gungye`, `taebong`, `goryeo-foundation-918` |
| `ch01-official-79-advanced-09` | `VERIFIED_OFFICIAL` | 79회 심화 9번, 정답 ⑤ | `ch01_gongsan` | `gungye`, `taebong`, `gongsan-battle`, `shin-sung-gyeom` |
| `ch01-official-70-advanced-10` | `VERIFIED_OFFICIAL` | 70회 심화 10번, 정답 ③ | `ch01_gochang` | `gongsan-battle`, `gochang-battle`, `later-three-kingdoms-chronology` |

CH.01의 모든 자체 제작 문항은 비활성화했고 활성 `UNKNOWN` 문항은 없다. 79회 9번은 궁예·광평성이 정답인 실제 기출이므로 공산 장면에서 신숭겸 오답과 구분하는 문맥형 연결이다. 첨부 원본 안에서 공산 전투·신숭겸만을 직접 묻는 검증 문항은 찾지 못했으므로 `ch01_gongsan.officialQuestionSlot`은 `source_required` 상태를 함께 유지한다. 70회 10번은 공산→고창→견훤 귀순→김부 사심관→일리천 순서를 묻는 원문 그대로이며, 아직 플레이하지 않은 김부·사심관은 다음 장의 실제 역사라고 해설에서 구분한다.

## 원본 대조 결과

- 69회 기본 10번: 문제지 지문·4개 선지와 정답표 ③을 대조했다.
- 79회 심화 9번: 두 사료·5개 선지와 정답표 ⑤를 대조했다.
- 70회 심화 10번: 영상 계획안·5개 선지와 정답표 ③을 대조했다. 기존 데이터의 선지는 원문이 아니어서 원본 문구로 교정했다.

## 저장 호환과 오답 데이터

- 저장 버전을 13으로 올렸다.
- 병합된 장면 ID는 새 장면으로 리디렉션한다.
- 진행 중이던 퇴역 자체 제작 문제는 `foundation`, `ch01_gongsan`, `ch01_gochang` 중 대응 장면으로 복귀시킨다.
- 기존 `questionRecords`, `wrongQuestionIds`, 완료 챕터, 챕터 기록은 삭제하지 않는다.
- 기존 오답은 가능한 메타데이터로 `wrongAnswers` 상세 항목을 보충한다.
- 새 오답에는 `examRound`, `examLevel`, `questionNumber`, `conceptIds`, `chapterId`, `historicalEventId`, `userAnswer`, `correctAnswer`, `answeredAt`을 저장한다.

## 에셋 정책

- 주민·일반 상인·행인·군중은 기존 규칙대로 scene illustration과 이름표만 사용한다.
- `injured_merchant`만 전쟁 피해를 몸으로 보여 주는 927년 예외 스탠딩이다.
- `assets/characters/injured_merchant_01.png`을 세 표정 ID(`neutral`, `serious`, `worried`)가 공유하며, 위치는 왼쪽으로 고정한다.
- 고창은 새 인물 스탠딩 없이 `route-caravan.png`을 밝은 길·군중 장면으로 재사용한다.
