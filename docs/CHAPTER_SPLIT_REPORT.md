# CH.01 / CH.02 구조 개편 완료 보고

기준 main: 4ffb4314145c9fec162c3a911ed228b3fba8ffd2. 기존 이야기를 930 / 935 경계로 분리했다. 새로운 역사 줄거리·문제·이미지는 추가하지 않았다. 프롤로그 여섯 장면 전체와 기존 대사·선택지·문제는 보호 검사로 대조했다. 분리 엔딩, 시작 소식, 화면 번호 안내만 연결에 필요한 만큼 추가·수정했다.

1. **CH.01 최종 범위:** 새로운 나라, 918 → 927 → 930. 고창 승리와 ‘우리가’ 대화를 보존하고 짧은 속마음 → BLACK → CHAPTER CLEAR로 마무리한다.

2. **CH.02 최종 범위:** 하나가 된 나라, 935 → 936 → 통일 이후 → 943. ‘그로부터 5년’ → 기존 장부 장면 → 견훤 귀순 소식 → 기존 935~943 이야기로 연결한다. 도윤상단 대화는 그대로 유지한다.

3. **전체 번호:**

| 번호 | chapterId | 제목 | 구현 |
| --- | --- | --- | --- |
| CH.01 | ch01 | 새로운 나라 | 플레이 가능 |
| CH.02 | ch02 | 하나가 된 나라 | 플레이 가능 |
| CH.03 | ch03 | 왕의 나라 | 플레이 가능 |
| CH.04 | ch04 | 나라의 틀 | 플레이 가능 |
| CH.05 | ch05 | 북쪽에서 온 적 | 준비 중 |
| CH.06 | ch06 | 귀족들의 나라 | 준비 중 |
| CH.07 | ch07 | 칼을 든 무신들 | 준비 중 |
| CH.08 | ch08 | 몽골이 온다 | 준비 중 |
| CH.09 | ch09 | 원의 그림자 | 준비 중 |
| CH.10 | ch10 | 왕의 반격 | 준비 중 |
| CH.11 | ch11 | 돌아선 장군 | 준비 중 |
| CH.12 | ch12 | 고려의 마지막 날 | 준비 중 |

4. **CH.01 → CH.02 이동 sceneId:**

| sceneId | 연도 | 장면 |
| --- | --- | --- |
| future_flow | 936 | 건국과 통일은 같은 해가 아니다 |
| complete | 943 | 새로운 나라 |
| ch01_exam_70_10 | 936 | 후삼국의 마지막 순서 |
| ch01_exam_73_10 | 936 | 견훤의 선택 |
| ch01_exam_74_10 | 936 | 신라가 고려에 들어온 뒤 |
| ch01_exam_76_10 | 936 | 일리천으로 향한 흐름 |
| ch01_jump_935 | 935 | 익숙해진 장부 |
| ch01_gyeonhwon | 935 | 적이 아군이 되다 |
| ch01_silla | 935 | 신라의 마지막 |
| ch01_jump_936 | 936 | 마지막 전쟁 앞에서 |
| ch01_war_choice | 936 | 평범한 사람의 몫 |
| ch01_war_supply | 936 | 돌아올 수레의 자리 |
| ch01_war_news | 936 | 소문과 소식 사이 |
| ch01_war_refugees | 936 | 머물 수 있는 자리 |
| ch01_victory | 936 | 끝났다는 소식 |
| ch01_unity | 936 | 후삼국 통일 |
| ch01_integration | 937 | 나라가 하나 된 다음 |
| ch01_sasimgwan | 937 | 김부와 경주를 잇는 이름 |
| ch01_giin | 937 | 수도에 머무는 자제 |
| ch01_refugee_family | 938 | 북쪽에서 온 손님 |
| ch01_north | 940 | 서경으로 보내는 짐 |
| ch01_welfare | 941 | 다시 밥을 지을 사람들 |
| ch01_jump_943 | 943 | 스물다섯 번째 해 |
| ch01_memory_943 | 943 | 평생 기억할 옷 |
| ch01_taejo_death | 943 | 나라를 연 왕이 떠나다 |
| ch01_hunyo | 943 | 열 가지 당부 |
| ch01_guild_seed | 943 | 도윤상단이라는 이름 |
| ch01_farewell | 943 | 하나가 된 나라 |

기존 sceneId의 ch01_* 접두사는 저장·이미지·문제 참조 호환성을 위해 그대로 유지했다. 소속 chapterId는 모두 ch02다. 기존 complete 같은 이전 버전 장면도 삭제하지 않고 보관한다. 새 경계 장면은 ch01_ending_930, ch01_clear_930, ch02_open_935, ch02_news_935다.

5. **chapterId 변경:** ch01은 전반/후반 소속을 재배정하고, ch02 → ch03, ch03 → ch04, ch04 → ch05, ch05 → ch06, ch06 → ch07, ch07 → ch08, ch08 → ch09, ch09 → ch10, ch10 → ch11, ch11 → ch12. order/number/previousChapterId/nextChapterId, start/clear, 결과·티저·선택 UI·carry·unlock 참조를 함께 바꿨다. 광종·성종의 기존 scene/question/asset/event ID는 안정적인 콘텐츠 키로 보존했다.

6. **문제 재매핑:** 새 CH.01 스토리 4개·복습 5개, 새 CH.02 스토리 6개·복습 8개. 새 CH.03/04는 기존 10개씩. 총 47개 문항 ID·본문·선택지·정답을 유지한다. CH.04의 정책 순서 문항 안내에 있던 CH.01~03 범위만 CH.01~04로 바로잡았다. 여러 연도가 섞인 ch01-test-03은 936, 정책 문항 ch01-test-04는 통일 이후 CH.02에 둔다. 실제 기출 추가·추정·새 PDF 연결은 하지 않았다.

| questionId | 새 chapterId | 연도 | 역할 |
| --- | --- | --- | --- |
| ch01-test-01 | ch01 | 918 | 스토리 |
| ch01-test-02 | ch01 | 918 | 스토리 |
| ch01-test-03 | ch02 | 936 | 복습 |
| ch01-test-04 | ch02 | 937 | 기출 교체로 보관 |
| ch01-test-05 | ch01 | 918 | 복습 |
| ch01-boss | ch02 | 936 | 스토리 |
| ch02-test-01 | ch03 | 기존 장면 | 스토리 |
| ch02-test-02 | ch03 | 기존 장면 | 스토리 |
| ch02-test-03 | ch03 | 기존 장면 | 스토리 |
| ch02-test-04 | ch03 | 기존 장면 | 스토리 |
| ch02-test-05 | ch03 | 기존 장면 | 스토리 |
| ch03-official-75-basic-10 | ch04 | 기존 장면 | 스토리 |
| ch03-practice-02 | ch04 | 기존 장면 | 스토리 |
| ch03-practice-03 | ch04 | 기존 장면 | 스토리 |
| ch03-practice-04 | ch04 | 기존 장면 | 스토리 |
| ch01-official-69-basic-10 | ch01 | 918 | 검증 기출 복습 |
| ch01-official-79-advanced-09 | ch01 | 918 | 검증 기출 복습 |
| ch01-official-70-advanced-10 | ch02 | 936 | 검증 기출 복습 |
| ch01-official-73-basic-10 | ch02 | 936 | 검증 기출 복습 |
| ch01-official-74-advanced-10 | ch02 | 936 | 검증 기출 복습 |
| ch01-official-76-advanced-10 | ch02 | 936 | 검증 기출 복습 |
| ch02-official-69-advanced-10 | ch03 | 기존 장면 | 스토리 |
| ch02-official-74-advanced-11 | ch03 | 기존 장면 | 스토리 |
| ch02-official-76-advanced-50 | ch03 | 기존 장면 | 스토리 |
| ch02-official-77-advanced-14 | ch03 | 기존 장면 | 스토리 |
| ch02-official-78-advanced-11 | ch03 | 기존 장면 | 스토리 |
| ch03-official-75-basic-12 | ch04 | 기존 장면 | 스토리 |
| ch03-practice-05 | ch04 | 기존 장면 | 스토리 |
| ch03-practice-06 | ch04 | 기존 장면 | 스토리 |
| ch03-practice-07 | ch04 | 기존 장면 | 스토리 |
| ch03-practice-08 | ch04 | 기존 장면 | 스토리 |
| ch03-practice-09 | ch04 | 기존 장면 | 스토리 |
| ch01-story-gongsan | ch01 | 927 | 스토리 |
| ch01-story-gochang | ch01 | 930 | 스토리 |
| ch01-story-gyeonhwon | ch02 | 935 | 스토리 |
| ch01-story-silla | ch02 | 935 | 스토리 |
| ch01-story-integration | ch02 | 937 | 스토리 |
| ch01-story-north | ch02 | 940 | 스토리 |
| ch01-story-hunyo | ch02 | 943 | 스토리 |
| ch01-review-01 | ch01 | 918 | 복습 |
| ch01-review-02 | ch01 | 927 | 복습 |
| ch01-review-03 | ch02 | 936 | 복습 |
| ch01-review-04 | ch02 | 935 | 복습 |
| ch01-review-05 | ch01 | 930 | 복습 |
| ch01-review-06 | ch02 | 943 | 복습 |
| ch01-review-07 | ch02 | 937 | 복습 |
| ch01-review-08 | ch01 | 918 | 복습 |
| ch01-review-09 | ch02 | 935 | 복습 |
| ch01-review-10 | ch02 | 943 | 복습 |

7. **역사 카드 재매핑:**

| 카드 ID | 소속 | 이름 |
| --- | --- | --- |
| goryeo-foundation-918 | ch01 | 고려 건국 |
| ch01-gongsan | ch01 | 공산 전투 |
| ch01-gochang | ch01 | 고창 전투 |
| ch01-gyeonhwon | ch02 | 견훤의 고려 귀순 |
| ch01-silla | ch02 | 경순왕 김부의 귀순 |
| ch01-illyecheon | ch02 | 일리천과 후삼국 통일 |
| ch01-integration | ch02 | 혼인과 호족 포섭 |
| ch01-sasimgwan | ch02 | 사심관 |
| ch01-giin | ch02 | 기인 |
| ch01-north | ch02 | 발해 유민과 북진 |
| ch01-welfare | ch02 | 민생 안정 |
| ch01-hunyo | ch02 | 태조의 죽음과 훈요 10조 |

카드·오답·업적·discovered event ID는 바꾸거나 삭제하지 않는다. 문항/카드의 chapterId를 기준으로 소속을 표시한다. 새 CH.02 완료 업적과 엔딩은 ch02-unified-country다. 기존 광종·성종 업적의 키는 콘텐츠 키로 유지하여 보유 기록이 사라지지 않는다.

8. **상인 거리 배경 파일:** market-later-three-kingdoms.png. 기존 위치 dist/assets/scenes/market-later-three-kingdoms.png. a1d58d8c7736c925d8d1cc7065d281612d67bb83에서 추가되었고 파일은 삭제되지 않았다. 이후 ASSETS 매핑이 doyun-intro.png를 향해 원래 이미지가 노출되지 않았다. 파일을 직접 열어 거리 상인 장면임을 확인했다.

9. **복구 sceneId:** market. ASSETS['market-later-three-kingdoms'].src와 장면 backgroundImage를 원래 파일로 연결했다. 인물이 포함된 기존 일러스트이므로 별도 standing 캐릭터를 겹쳐 띄우지 않는다. 새 이미지 생성·다른 이미지 대체 없음.

10. **캐릭터 표시 수정:** scene.visibleCharacters / sceneType을 명시하고 현재 줄의 speakerType이 thought/narration이면 standing 이미지를 숨긴다. 실제 spoken 대화에서만 대화하는 인물을 표시하며 NPC 두 명의 위치도 좌우로 나눈다. 프롤로그 여섯 장면은 원래 연출을 그대로 적용한다.

배경만 사용하는 전체 장면: `thief_aftermath`, `future_flow`, `complete`, `ch02_transition`, `ch02_shop_exterior_949`, `ch02_jump_956`, `ch02_policy_memory`, `ch02_jump_958`, `ch02_reign_followup`, `ch02_night_reflection`, `ch02_mystery`, `ch03_transition`, `ch03_gaegyeong`, `ch03_guild_exterior`, `ch03_exam_75`, `ch03_trade_practice`, `ch03_choe_practice`, `ch03_timeline_practice`, `ch03_death`, `ch03_legacy`, `ch01_exam_70_10`, `ch01_exam_73_10`, `ch01_exam_74_10`, `ch01_exam_76_10`, `ch02_exam_69_10`, `ch02_exam_74_11`, `ch02_exam_76_50`, `ch02_exam_77_14`, `ch02_exam_78_11`, `ch03_exam_75_12`, `ch03_exam_practice_05`, `ch03_exam_practice_06`, `ch03_exam_practice_07`, `ch03_exam_practice_08`, `ch03_exam_practice_09`, `ch01_jump_927`, `ch01_conflict_night`, `ch01_unity`, `ch01_jump_943`, `ch01_farewell`, `ch01_ending_930`, `ch01_clear_930`, `ch02_open_935`.

대화와 속마음/서술이 섞여 해당 줄에서만 standing을 숨기는 장면: `village`, `rumor`, `foundation`, `market`, `doyun`, `status`, `route_songak`, `route_village`, `route_caravan`, `route_royal`, `route_context`, `thief`, `night`, `ch02_reunion_949`, `ch02_market`, `ch02_life_path`, `ch02_shop_956`, `ch02_policy_reason`, `ch02_noble_night`, `ch02_ssanggi`, `ch02_exam_eve`, `ch02_exam_day`, `ch02_reign_titles`, `ch02_purge`, `ch02_complete`, `ch03_dream_realized`, `ch03_unchanged`, `ch03_provincial_problem`, `ch03_choe_reform`, `ch03_gukjagam`, `ch03_policy_effect`, `ch03_history_reflection`, `ch03_courtyard`, `ch03_weakening`, `ch03_farewell`, `ch01_trade_start`, `ch01_missing_traders`, `ch01_gongsan`, `ch01_conflict`, `ch01_reconcile`, `ch01_jump_930`, `ch01_gochang`, `ch01_belonging`, `ch01_jump_935`, `ch01_gyeonhwon`, `ch01_silla`, `ch01_jump_936`, `ch01_war_news`, `ch01_victory`, `ch01_integration`, `ch01_sasimgwan`, `ch01_giin`, `ch01_refugee_family`, `ch01_north`, `ch01_welfare`, `ch01_memory_943`, `ch01_taejo_death`, `ch01_hunyo`, `ch01_guild_seed`, `ch02_news_935`.

11. **세이브 migration:** SAVE_VERSION 9 → 10, chapterSplitVersion=1로 한 번만 변환한다. 기존 CH.02~11의 currentChapter/replayChapterId/completedChapters/chapterRuns/chapterRecords/playthroughs/선택 소속을 +1 이동한다. run과 별도 mainRun을 함께 처리하되 sceneId·대사 cursor·active question·답안·재산·관계는 그대로 둔다. 이전 CH.01 후반 진행은 현재 장면에서 CH.02로 이어지고 CH.01은 완료 처리한다. 장편 CH.01 완료 기록은 두 챕터별 문제 결과로 분리하며 원래 통합 회차·점수·복습 기록은 meta.chapterSplitArchive에 원본 보관한다. 과거 스탯을 930년 시점별로 저장하지 않았던 세이브에서는 기존 스탯을 보존하고 새 경계 연령/소속을 적용한 migratedFromCombinedChapter 기록을 사용한다. 기존 초기 버전의 짧은 CH.01 완료는 유지하고 새 CH.02를 열어 이어갈 수 있다. 누적 오답·카드·업적·선택 횟수는 초기화하지 않는다. 재시작/재플레이는 새 경계에서 시작한다.

12. **기존 세이브 테스트:** 10개 변환 사례와 반복 migration 검사 통과: 초기/후반 진행, 문제 답변 중, 장편 완료 회차, 기존 광종 완료·성종 진행, 재플레이와 mainRun, 확장 전 짧은 CH.01 완료, 회차 누락 완료, 별도 currentMainProgress 참조, 실제 chapterSnapshot과 회차별 선택 기록 분리 저장. 본문·선택지·정답·기존 대사 전체와 프롤로그 SHA-256 검사 통과.

13. **CH.01 → CH.02:** 자동 UI 이벤트 전체 플레이 통과. 918 → 927 → 930 → CLEAR → 새 티저 → 935 진입, 도윤 36세 → 41세, 기존 스탯·관계·직업 전달. CH.02 전쟁 세 분기와 943 CLEAR까지 통과. 4+6개 스토리 문항, 5+8개 독립 복습, 중간 reload, 오답 개념 재출제, 12개 카드 해금 통과.

14. **CH.02 → CH.03:** 943 → CLEAR → ‘왕의 나라’ 949 광종 티저 → 기존 ch02_transition을 새 chapterId ch03으로 시작, 도윤 57세. 기존 광종 324개 경로·성종 3개 경로, 번호·결과·다음 티저·재플레이·저장 검사 통과.

15. **npm test:** 7개 기본 테스트 통과. **실제 모바일 화면은 미검증**: 내장 Browser 연결이 kernel assets 경로 오류로 초기화되지 않았고, 별도 390px Playwright 실행도 spawn EPERM으로 브라우저 시작 전에 차단됐다. npm run test:mobile은 CH.01/02 전체 플레이, 5+8 복습, CH.03 진입, 320/390/760px overflow 검사로 갱신했지만 실제 화면·탭·레이아웃 통과를 주장하지 않는다.

16. **npm run build:** 통과. 22개 정적/PWA 필수 파일, 115개 기존 준비 에셋 참조, JavaScript 구문 검사. 새 chapter-split.js를 HTML/PWA shell에 포함하고 cache를 갱신했다. localStorage 저장 키는 유지한다. git diff --check 통과.

17. **commit hash:** 최종 hash는 outputs 보고서에 기록한다.

18. **push:** 최종 main 반영 확인은 outputs 보고서에 기록한다.
