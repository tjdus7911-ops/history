# CH.01 확장 완료 보고

1. **수정 파일**: dist/ch01-expansion.js(신규 장면·문제·카드·노화·호환), dist/app.js(실전 복습·개념 재출제·카드·결과), dist/data.js(스토리 점수에서 복습 제외), dist/dialogue.css(모바일 복습 레이아웃), dist/index.html·dist/sw.js(확장 모듈과 shell 버전), package.json(테스트 명령), README.md, docs/EXAM_QUESTION_SOURCES.md, docs/CH01_EXPANSION_PLAN.md, docs/CH01_ASSET_INVENTORY.csv, 이 보고서, tests/*.cjs 및 tests/fixtures/ch01-protected.json. 이미지·CH.02/03 데이터 파일은 변경하지 않았다.

2. **최종 흐름**: 기존 현대 프롤로그 → 잠 → 두 검은 화면 → 첫 만남 → 옷/생활 분기 → 첫날 밤 → 장사 동행 → 927 공산/갈등/화해 → 930 고창/소속감 → 935 견훤/신라 → 936 전쟁 3분기/통일 → 태조 통합 정책 → 발해계 가족/북진/민생 → 943 회상/태조 사망/훈요/도윤상단 이름 → BLACK/CHAPTER CLEAR. 기존 장면 ID와 전사 문항 ID는 세이브 호환을 위해 삭제하지 않았다.

3. **연도별 신규 장면**:

| 연도 | sceneId |
|---|---|
| 918 | ch01_trade_start |
| 927 | ch01_jump_927 → ch01_missing_traders → ch01_gongsan → ch01_conflict → ch01_conflict_night → ch01_reconcile |
| 930 | ch01_jump_930 → ch01_gochang → ch01_belonging |
| 935 | ch01_jump_935 → ch01_gyeonhwon → ch01_silla |
| 936 | future_flow → ch01_jump_936 → ch01_war_choice → ch01_war_supply → ch01_war_news → ch01_war_refugees → ch01_victory → ch01_unity |
| 937 | ch01_integration → ch01_sasimgwan → ch01_giin |
| 938 | ch01_refugee_family |
| 940 | ch01_north |
| 941 | ch01_welfare |
| 943 | ch01_jump_943 → ch01_memory_943 → ch01_taejo_death → ch01_hunyo → ch01_guild_seed → ch01_farewell |

   937~941년의 거래·대화는 창작의 시간표다. 사심관·기인·민생 정책이 그해 처음 도입된 것이라는 의미가 아니다. 938년 방문한 발해계 가족도 창작 인물이며 역사적 대광현 귀순과 구분한다.

4. **도윤 ageState와 에셋**:

| 연도 | 나이 | ageVariant | 포트레이트 |
|---|---:|---|---|
| 918 | 24 | young | doyun_* |
| 927 | 33 | young | doyun_* |
| 930 | 36 | young | doyun_* |
| 935 | 41 | mature_935 | doyun_949_* 재사용 |
| 936 | 42 | mature_935 | doyun_949_* 재사용 |
| 943 | 49 | middle_943 | doyun_949_* 재사용 |
| CH.02 949/956 | 57/64 | 기존 middle_aged_949/elder_956 | 기존 에셋 그대로 |

   주인공은 고려복·23세 외형을 유지한다. 도윤의 얼굴 차이는 기존 프로젝트 연령별 에셋을 따른다. 별도의 927/930/935 전용 그림과 전투 그림은 생성하지 않았으며, 기존 길·수레·가게·민가 배경으로 경험을 표현했다. 생성되지 않은 일반 NPC 포트레이트는 기존 방식의 이름·텍스트 UI를 사용한다.

5. **스토리 필수 문제 10개**:

| ID | 연도 | 유형 | 연결 장면 |
|---|---|---|---|
| ch01-test-01 | 918 | 인물·자료 추론 | rumor |
| ch01-test-02 | 918 | 시대 상황 | foundation |
| ch01-story-gongsan | 927 | 사건·결과 연결 | ch01_gongsan |
| ch01-story-gochang | 930 | 비교 자료 | ch01_gochang |
| ch01-story-gyeonhwon | 935 | 인물 식별 | ch01_gyeonhwon |
| ch01-story-silla | 935 | 인물·사건 연결 | ch01_silla |
| ch01-boss | 936 | 복합 선택지 | future_flow |
| ch01-story-integration | 937 | 정책 구별 | ch01_giin |
| ch01-story-north | 940 | 왕의 정책 | ch01_north |
| ch01-story-hunyo | 943 | 사료 해석 | ch01_hunyo |

6. **이번 작업에서 원문 확인한 실제 기출**: 없음. 원본 PDF가 현재 저장소·첨부·Codex 작업 폴더에 없었다. 제70회 심화 10번, 제76회 심화 10번, 제75회 기본 12번, 제77회 심화 9번을 실제 기출로 새로 구현하지 않았다. 기존 CH.01의 70/73/74/76회 전사 4개는 비활성 이전 기록으로 유지한다. 기존 CH.02/03의 기출 데이터는 미변경이다.

7. **자체 제작 기출 유형**: 필수 10개와 실전 복습 13개, 총 23개. 스토리 필수 문제와 별도 복습은 모두 [기출 유형]으로 표시한다. 복습의 처음 10개는 사료·인물·순서·이후/이전·업적·정책·상황·연결·복합 선택지로 구성하고, 기존 자체 제작 문제 3개도 복습에 보존했다.

| ID | 연도 | 유형 | 연결 장면 |
|---|---|---|---|
| ch01-review-01 | 918 | 사료 해석 | rumor |
| ch01-review-02 | 927 | 인물 식별 | ch01_gongsan |
| ch01-review-03 | 936 | 사건 순서 | future_flow |
| ch01-review-04 | 935 | 사건 이후 | ch01_gyeonhwon |
| ch01-review-05 | 930 | 사건 이전 | ch01_gochang |
| ch01-review-06 | 943 | 왕의 업적 | ch01_hunyo |
| ch01-review-07 | 937 | 정책 구별 | ch01_giin |
| ch01-review-08 | 918 | 시대 상황 | foundation |
| ch01-review-09 | 935 | 인물·사건 연결 | ch01_silla |
| ch01-review-10 | 943 | 복합 선택지 | ch01_hunyo |
| ch01-test-03 | 918 | 사건 순서형 | doyun |
| ch01-test-04 | 918 | 자료 해석형 | route_context |
| ch01-test-05 | 918 | 시대 상황 판단형 | thief_aftermath |

8. **역사 발견 카드 12개**: 고려 건국 / 공산 전투 / 고창 전투 / 견훤의 고려 귀순 / 경순왕 김부의 귀순 / 일리천과 후삼국 통일 / 혼인과 호족 포섭 / 사심관 / 기인 / 발해 유민과 북진 / 민생 안정 / 태조의 죽음과 훈요 10조. 장면에서 발견 → 도감 해금 → 카드별 연결·출처 열람으로 이어진다.

9. **오답 연동**: 정답·선택지별 이유·핵심 키워드·관련 사건·연도를 표시하고 wrongQuestionIds/questionRecords에 저장한다. conceptMistakes와 confusedConcepts에는 혼동한 개념과 문항 ID를 기록하여 공부 탭의 개념 버튼으로 재출제한다. 정답 복습 후 해당 문항은 reviewed 상태가 되며 해결된 개념은 목록에서 빠진다. 별도 실전 복습은 cursor/answers/results를 저장하고 완료 회차·점수를 ch01ReviewAttempts에 기록한다. 메인 스탯·스토리 문제 결과·챕터 회차 점수는 바꾸지 않는다.

10. **프롤로그 미변경**: prologue/sleep/voice/house/outfit_question/outfit_gift 전체 장면 SHA-256과 첫날 밤까지의 모든 기존 대사 해시를 기준 main에 대조하여 통과했다. 두 검은 화면, 탭 진행, 400ms fade, 첫 만남 타이핑·표정·의상은 보존했다.

11. **CH.02 미손상**: CH.02 및 CH.03 전체 장면·문제 데이터 해시 통과, 기존 324개 CH.02 경로·10문제·노화·이어하기·다시하기·재플레이 테스트 통과. CH.01 종료에서 CH.02 진입 및 CH.01 복습 중 CH.02 상태 보존도 통과했다. 완료된 옛 CH.01은 초기화하지 않고 완료·점수를 유지하며 재플레이로 확장 이야기를 연다. 옛 마지막 회상에서 미완료인 저장은 확장 시작으로 안전하게 연결한다.

12. **테스트 결과**: npm test 전체 통과. CH.01 전쟁 3분기 전체 UI 이벤트 진행, 연도 순서, 필수 10개 도달, 13개 복습, 개념 재출제, 연령·의상, 각 연도 새로고침과 옛 세이브, 보호 데이터 검사 통과. **실제 모바일 화면 플레이는 미확인**: 내장 브라우저 도구가 kernel assets 경로 오류로 초기화되지 않았고, 별도 모바일 테스트도 browserType.launch: spawn EPERM으로 브라우저 실행 전에 차단됐다. tests/ch01-mobile-test.cjs와 npm run test:mobile을 남겼으며 실제 화면·이미지 flash·레이아웃을 통과했다고 주장하지 않는다.

13. **빌드 결과**: npm run build 통과. JavaScript 구문·21개 정적/PWA 파일·기존 115개 준비된 에셋 연결을 검증했다. PWA shell에 새 모듈을 포함하고 cache 버전을 올렸으며 localStorage는 삭제하지 않는다.

14. **커밋**: 완료 후 outputs 보고서에 최종 hash를 기록한다.

15. **push**: 완료 후 outputs 보고서에 최종 main 반영 결과를 기록한다.

역사 검증 출처는 장면/문항/카드별 링크와 CH01_EXPANSION_PLAN.md에 기록했다. 주요 근거는 [태조 왕건](https://contents.history.go.kr/mobile/kc/view.do?levelId=kc_n206200), [후삼국 통일](https://contents.history.go.kr/mobile/kc/view.do?code=kc_age_10&levelId=kc_i101800), [사심관·기인 사료](https://contents.history.go.kr/mobile/hm/view.do?levelId=hm_046_0030), [태조의 정책](https://contents.history.go.kr/front/ta/view.do?levelId=ta_h61_0050_0020_0010), [발해 유민](https://contents.history.go.kr/mobile/hm/view.do?levelId=hm_045_0020), [훈요 10조](https://contents.history.go.kr/front/tg/view.do?ganada=&levelId=tg_002_0990&pageUnit=10&treeId=0200)이다.
