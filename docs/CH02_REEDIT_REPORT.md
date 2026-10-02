# CH.02 935–943 재편집 및 반복 상인·노화 시스템 보고서

기준 브랜치: `main` / 작업 시작 HEAD: `484b761`

## 장면 감사

1. 기존 CH.02 장면은 데이터상 30개, 플레이 가능 30개, 주 스토리에서 도달 가능한 장면 25개였다.
2. 장면 데이터·대사·연결·퀴즈 슬롯을 실제로 수정한 CH.02 장면은 16개다. 전 장면 25개를 감사했고, 병합 뒤 도달 가능한 장면은 23개다. 별도로 CH.01의 반복 상인 장면 2개를 캐릭터 연속성에 맞게 수정했다.
3. KEEP: `ch02_open_935`, `ch01_jump_935`, `ch01_jump_936`, `ch01_war_choice`, `ch01_war_supply`, `ch01_war_news`, `ch01_war_refugees`, `ch01_unity`, `ch01_jump_943`, `ch01_memory_943`, `ch01_taejo_death`, `ch01_guild_seed`.
4. SHORTEN: `ch01_gyeonhwon`, `ch01_integration`, `ch01_hunyo`.
5. MERGE: `ch01_sasimgwan`+`ch01_giin`, `ch01_refugee_family`+`ch01_north`.
6. REMOVE: 실제 데이터 삭제는 없다. `ch01_giin`, `ch01_north`만 주 경로에서 비활성화하고 저장 호환용 리디렉션으로 유지했다. `complete`와 기출 wrapper 장면도 레거시 호환 때문에 보관한다.
7. ENHANCE: `ch02_news_935`, `ch01_silla`, `ch01_victory`, `future_flow`, `ch01_welfare`, `ch01_farewell`.

## 스토리·학습 흐름

8. 견훤: 935년의 나이 든 동일 상인이 소식을 급히 전하고, 금산사 감금→탈출→왕건 귀순→신검과의 구분을 짧은 대화와 생각으로 연결했다.
9. 신라 항복: 경순왕 김부의 선택을 제도 설명보다 “내일부터 나는 어느 나라 사람이 되는 것이오?”라는 신라 상인의 생활 감정으로 경험하게 했다.
10. 936년 선택: 전쟁 영웅이 아닌 주인공 일행이 보급, 소식 판별, 피란민 자리 마련 중 하나를 선택하는 기존 구조는 유지했다.
11. 일리천: 전령의 승전보 뒤 도윤의 “그러면…….”, 주인공의 “끝난 거야.”를 유지하고 견훤·김부·신검의 순서를 바로 회상하게 했다.
12. 통일 뒤 설명은 네 개의 장기 강의 대신 세 묶음의 생활 장면으로 압축했다.
13. 사심관·기인: 김부가 경주를 맡는 장면과 호족 자제가 개경에 머무는 장면을 한 거래 대화로 묶고, 두 제도의 기능 차이를 주인공의 생각으로 정리했다.
14. 발해·북방: 발해 유민 가족의 정착, 고구려 계승 의식, 서경 중시, 북진 방향을 한 가족의 이동과 상단 물류 변화로 묶었다.
15. 943년: 태조의 죽음, 짧아진 훈요 10조, 도윤상단의 씨앗, 도윤의 노화와 주인공의 비노화를 한 결말 흐름으로 연결했다.
16. 비노화 복선은 유지·강화했다. 943년 결말에서 “모두가 나이를 먹는 동안, 나는 여전히 같은 얼굴이었다.”고 시각 변화와 함께 확인한다.
17. 도윤상단 복선은 `ch01_guild_seed`에 그대로 유지했다.

## 문제 감사

18. 수정 전 CH.02 주 스토리 문제 11개: `ch01-story-gyeonhwon`, `ch02-story-geumsansa`, `ch01-story-silla`, `ch02-story-illyecheon`, `ch01-boss`, `ch02-story-sasimgwan`, `ch01-story-integration`, `ch02-story-balhae-refugees`, `ch01-story-north`, `ch02-story-welfare`, `ch01-story-hunyo`. 복습 문제 4개: `ch01-official-73-basic-10`, `ch01-official-74-advanced-10`, `ch01-official-76-advanced-10`, `ch01-review-10`.
19. 수정 후 CH.02 주 스토리와 복습은 같은 검증 기출 5개만 사용한다: `ch01-official-73-basic-10`, `ch01-official-74-advanced-10`, `ch01-official-76-advanced-10`, `ch01-official-70-advanced-10`, `ch03-official-75-basic-12`.
20. VERIFIED_OFFICIAL: 위 5개 모두 첨부 문제지와 답지의 지문·보기·정답을 대조했다.
21. 출처·정답: 73회 기본 10번 ③, 74회 심화 10번 ④, 76회 심화 10번 ②, 70회 심화 10번 ③, 75회 기본 12번 ③.
22. 퇴역 처리한 CH.02 자체 제작 문제 19개: `ch01-test-03`, `ch01-test-04`, `ch01-boss`, `ch01-story-gyeonhwon`, `ch02-story-geumsansa`, `ch01-story-silla`, `ch02-story-illyecheon`, `ch01-story-integration`, `ch02-story-sasimgwan`, `ch02-story-balhae-refugees`, `ch01-story-north`, `ch02-story-welfare`, `ch01-story-hunyo`, `ch01-review-03`, `ch01-review-04`, `ch01-review-06`, `ch01-review-07`, `ch01-review-09`, `ch01-review-10`.
23. CH.02에 활성 상태로 남은 자체 제작 문제는 0개다.
24. 70회 심화 10번은 `future_flow` 누적 연표 직후에 배치했다.
25. 76회 심화 10번은 `ch01_victory`의 일리천 승전보 직후에 배치했다.
26. 75회 기본 12번은 기존 CH.04 보충 wrapper에서 분리해 `ch01_sasimgwan` 직후에 배치했다. 기존 CH.04 진행 연결은 `ch03_policy_effect`로 복원했다.
27. 첨부 기출과 직접 매칭하지 못해 `source_required`로 남긴 개념: 호족 포섭·혼인 정책, 발해 유민 수용·고구려 계승·서경·북진 정책, 취민유도, 훈요 10조.

## 배경·캐릭터·저장

28. 935–943 장면에 잘못 쓰이던 949년 가게 배경을 제거하고 `ch02-trade-room-935`(소박한 창고방)으로 교체했다.
29. 도윤은 894년생 달력 나이로 통일했다: 918년 24세, 935년 41세, 943년 49세, 949년 55세, 956년 62세, 958년 64세, 960년 66세, 982년 88세. 주인공만 23세 외형을 유지한다.
30. 저장 마이그레이션 버전 1을 추가했다. 비활성 장면, 퇴역 문제, 진행 중 문제 큐를 새 경로로 복구하고 CH.02의 연령 상태를 재계산한다. 기존 수집·업적 키는 삭제하지 않았다.

반복 상인은 `MERCHANT_01_CANONICAL` / `characterId: merchant_01` 하나로 관리한다. `adult_918 + normal`, `mature_927 + injured`, `older_935 + normal`을 분리했으며, 과거의 `injured_merchant` ID는 비표시 레거시 별칭이다.

## 검증

31. 모바일 전체 흐름을 320px, 390px, 760px에서 자동 플레이하고 CH.01–03, CH.02 공식 기출 전용 흐름, 상인 동일성·노화, 새로고침 저장 복구, 가로 넘침을 검사했다.
32. `npm test`: 전체 통과.
33. `npm run build`: 통과. 정적 PWA 22개 파일과 준비된 일러스트 149개를 확인했다.
34. 커밋 해시는 최종 커밋 뒤 이 문서의 Git 기록에서 확인한다.
35. `main` 푸시는 최종 검증 뒤 수행한다.
