# 눈떠보니 한국사 V2 리뉴얼 검수 보고

기준 커밋: `92bd615daed24dbd021f9d33c9c8a3c68b859f75` (main).

## 변경 내용

- 홈·학습·오답노트·내 기록 공통 UI와 모바일 하단 메뉴를 리뉴얼했습니다. 기존 이야기·선택·진행·복습 로직을 사용합니다.
- 오늘 풀이·정답률·연속 학습·캘린더는 실제 V2 풀이 날짜로 계산합니다. 날짜가 없는 과거 누적 기록은 날짜를 만들어 채우지 않습니다.
- 고려 12챕터를 유지하고 미구현 시대는 준비중으로 표시합니다.
- 원본 PDF/정답표 확인 후 실제 기출 30문항을 추가하고, 기존 실제 기출 4문항의 누락 이미지를 복구했습니다. 문제 본문·자료·보기가 들어간 원본 crop과 게임 답 선택 UI를 함께 사용합니다.
- 신규 문항의 선택지는 원본 이미지의 번호를 선택하는 방식입니다. 이미지 보기를 임의로 텍스트로 재작성하지 않았습니다.
- 기존 스토리·대사·선택 결과·역사 흐름·캐릭터 정체성·자체 제작 문제·저장 버전 15를 보존했습니다.

## 기출과 이미지 수

- 전체 실제 기출 데이터: 85개 / 원본 이미지 연결: 85개 / 이미지 누락: 0개.
- 회차·급수·번호 기준 고유 원본 문항: 75개. 기존 복습/챕터 데이터에 동일 원본을 참조하는 레코드가 있어 데이터 수와 고유 문항 수가 다릅니다.
- 신규 실제 기출 30개, 복구 이미지 4개.

## 챕터별 활성 문제은행

| 챕터 | 제목 | 전체 | 실제 기출 | 심화 연습 |
|---|---|---:|---:|---:|
| ch01 | 새로운 나라 | 9 | 2 | 7 |
| ch03 | 왕의 나라 | 29 | 18 | 11 |
| ch04 | 나라의 틀 | 3 | 3 | 0 |
| ch05 | 말로 얻은 땅 | 16 | 7 | 9 |
| ch06 | 불타는 개경 | 22 | 8 | 14 |
| ch07 | 마지막 침입 | 14 | 3 | 11 |
| ch08 | 두 개의 수도 | 17 | 3 | 14 |
| ch09 | 칼을 든 자들 | 23 | 9 | 14 |
| ch10 | 섬으로 간 나라 | 24 | 11 | 13 |
| ch11 | 왕이지만 왕이 아닌 | 22 | 8 | 14 |
| ch12 | 고려의 마지막 | 17 | 3 | 14 |
| ch02 | 하나가 된 나라 | 15 | 10 | 5 |

활성 문제은행 수는 해당 챕터에서 사용할 수 있는 문항 수입니다. 선택 분기에 따라 실제 한 번의 플레이에서 만나는 문항은 달라집니다. 아래 로그는 세 경로의 실제 UI 이벤트 기반 자동 플레이 출제 순서를 기록합니다.

- `V2_PLAY_QUESTION_LOG_0.json`: 선택 경로 0, 전체 정답.
- `V2_PLAY_QUESTION_LOG_1_wrong.json`: 선택 경로 1, 전체 오답.
- `V2_PLAY_QUESTION_LOG_2.json`: 선택 경로 2, 전체 정답.

## 실제 기출 출처·연결 전체 목록

| 챕터 | question ID | 회차 | 급수 | 번호 | 연결 scene | 이미지 | 원본 PDF / 정답표 |
|---|---|---:|---|---:|---|---|---|
| ch04 | ch03-official-75-basic-10 | 75 | 기본 | 10 | ch03_gukjagam | assets/exams/ch03/75-기본-10.jpg | 75회 한국사_문제지(기본).pdf / 75회 한국사_답지(기본).pdf |
| ch01 | ch01-official-69-basic-10 | 69 | 기본 | 10 | foundation | assets/exams/v2/69-basic-10.webp | 제69회 한국사능력검정시험 기본 문제지.pdf / 제69회 한국사능력검정시험 기본 정답표.pdf |
| ch01 | ch01-official-79-advanced-09 | 79 | 심화 | 9 | foundation | assets/exams/shared/79-advanced-09.webp | 79회 한국사_문제지(심화).pdf / 79회 한국사_답지(심화).pdf |
| ch02 | ch01-official-70-advanced-10 | 70 | 심화 | 10 | ch01_victory | assets/exams/shared/70-advanced-10.webp | 70회 한국사_문제지(심화).pdf / 70회 한국사_정답지(심화).pdf |
| ch02 | ch01-official-73-basic-10 | 73 | 기본 | 10 | ch01_gyeonhwon | assets/exams/v2/73-basic-10.webp | 제73회 한국사능력검정시험 기본 문제지.pdf / 제73회 한국사능력검정시험 기본 정답표.pdf |
| ch02 | ch01-official-74-advanced-10 | 74 | 심화 | 10 | ch01_gyeonhwon | assets/exams/shared/74-advanced-10.webp | 74회 한국사_문제지(심화).pdf / 74회 심화 정답표.pdf |
| ch02 | ch01-official-76-advanced-10 | 76 | 심화 | 10 | ch01_victory | assets/exams/shared/76-advanced-10.webp | 76회 한국사_문제지(심화).pdf / 76회 한국사_답지(심화)).pdf |
| ch02 | ch02-official-69-advanced-10 | 69 | 심화 | 10 | ch01_hunyo | assets/exams/ch03/69-심화-10.jpg | 69회 한국사_문제지(심화).pdf / 69회 한국사_정답표(심화).pdf |
| ch03 | ch02-official-74-advanced-11 | 74 | 심화 | 11 | ch02_policy_memory | assets/exams/ch03/74-심화-11.jpg | 74회 한국사_문제지(심화).pdf / 74회 심화 정답표.pdf |
| ch03 | ch02-official-76-advanced-50 | 76 | 심화 | 50 | ch02_reign_followup | assets/exams/ch03/76-심화-50.jpg | 76회 한국사_문제지(심화).pdf / 76회 한국사_답지(심화)).pdf |
| ch03 | ch02-official-77-advanced-14 | 77 | 심화 | 14 | ch02_reign_followup | assets/exams/ch03/77-심화-14.jpg | 77회 한국사_문제지(심화).pdf / 77회 한국사_답지(심화).pdf |
| ch03 | ch02-official-78-advanced-11 | 78 | 심화 | 11 | ch02_ssanggi | assets/exams/ch03/78-심화-11.jpg | 78회 한국사_문제지(심화).pdf / 78회 한국사_답지(심화).pdf |
| ch02 | ch03-official-75-basic-12 | 75 | 기본 | 12 | ch01_sasimgwan | assets/exams/ch03/75-기본-12.jpg | 75회 한국사_문제지(기본).pdf / 75회 한국사_답지(기본).pdf |
| ch03 | ch03-pdf-65-advanced-10 | 65 | 심화 | 10 | ch02_shop_956 | assets/exams/ch03/65-심화-10.jpg | 제65회 한국사능력검정시험 심화 문제지.pdf / 제65회 한국사능력검정시험 심화 정답표.pdf |
| ch03 | ch03-pdf-65-advanced-11 | 65 | 심화 | 11 | ch02_policy_reason | assets/exams/ch03/65-심화-11.jpg | 제65회 한국사능력검정시험 심화 문제지.pdf / 제65회 한국사능력검정시험 심화 정답표.pdf |
| ch03 | ch03-pdf-68-advanced-09 | 68 | 심화 | 9 | ch02_hyunwoo_official | assets/exams/ch03/68-심화-09.jpg | 68회 한국사_문제지(심화).pdf / 68회 한국사_정답표(심화).pdf |
| ch03 | ch03-pdf-69-advanced-10 | 69 | 심화 | 10 | ch02_reunion_949 | assets/exams/ch03/69-심화-10.jpg | 69회 한국사_문제지(심화).pdf / 69회 한국사_정답표(심화).pdf |
| ch03 | ch03-pdf-70-advanced-13 | 70 | 심화 | 13 | ch02_purge | assets/exams/ch03/70-심화-13.jpg | 70회 한국사_문제지(심화).pdf / 70회 한국사_정답지(심화).pdf |
| ch03 | ch03-pdf-72-advanced-11 | 72 | 심화 | 11 | ch02_complete | assets/exams/ch03/72-심화-11.jpg | 제72회 심화 문제지.pdf / 제72회 심화 정답표.pdf |
| ch03 | ch03-pdf-73-advanced-11 | 73 | 심화 | 11 | ch02_noble_night | assets/exams/ch03/73-심화-11.jpg | 73회 심화 문제지.pdf / 73회 심화 정답표.pdf |
| ch03 | ch03-pdf-75-basic-10 | 75 | 기본 | 10 | ch02_exam_day | assets/exams/ch03/75-기본-10.jpg | 75회 한국사_문제지(기본).pdf / 75회 한국사_답지(기본).pdf |
| ch03 | ch03-pdf-75-basic-12 | 75 | 기본 | 12 | ch02_reunion_949 | assets/exams/ch03/75-기본-12.jpg | 75회 한국사_문제지(기본).pdf / 75회 한국사_답지(기본).pdf |
| ch03 | ch03-pdf-76-advanced-11 | 76 | 심화 | 11 | ch02_exam_notice | assets/exams/ch03/76-심화-11.jpg | 76회 한국사_문제지(심화).pdf / 76회 한국사_답지(심화)).pdf |
| ch03 | ch03-pdf-76-advanced-18 | 76 | 심화 | 18 | ch02_hyunwoo_official | assets/exams/ch03/76-심화-18.jpg | 76회 한국사_문제지(심화).pdf / 76회 한국사_답지(심화)).pdf |
| ch03 | ch03-pdf-79-advanced-13 | 79 | 심화 | 13 | ch02_purge | assets/exams/ch03/79-심화-13.jpg | 79회 한국사_문제지(심화).pdf / 79회 한국사_답지(심화).pdf |
| ch02 | ch02-official-65-advanced-10 | 65 | 심화 | 10 | ch01_sasimgwan | assets/exams/ch03/65-심화-10.jpg | 제65회 한국사능력검정시험 심화 문제지.pdf / 제65회 한국사능력검정시험 심화 정답표.pdf |
| ch04 | ch04-official-65-advanced-11 | 65 | 심화 | 11 | ch03_gukjagam | assets/exams/ch03/65-심화-11.jpg | 제65회 한국사능력검정시험 심화 문제지.pdf / 제65회 한국사능력검정시험 심화 정답표.pdf |
| ch02 | ch02-official-66-advanced-09 | 66 | 심화 | 9 | ch01_gyeonhwon | assets/exams/shared/66-advanced-09.webp | 66회 한국사_문제지(심화).pdf / 66회 한국사_정답표(심화).pdf |
| ch02 | ch02-official-67-basic-10 | 67 | 기본 | 10 | ch01_sasimgwan | assets/exams/v2/67-basic-10.webp | 제67회 한국사능력검정시험 기본 문제지.pdf / 제67회 한국사능력검정시험 기본 정답표.pdf |
| ch02 | ch02-official-67-basic-11 | 67 | 기본 | 11 | ch01_refugee_family | assets/exams/v2/67-basic-11.webp | 제67회 한국사능력검정시험 기본 문제지.pdf / 제67회 한국사능력검정시험 기본 정답표.pdf |
| ch04 | ch04-official-68-advanced-09 | 68 | 심화 | 9 | ch03_gukjagam | assets/exams/ch03/68-심화-09.jpg | 68회 한국사_문제지(심화).pdf / 68회 한국사_정답표(심화).pdf |
| ch03 | ch03-official-68-advanced-11 | 68 | 심화 | 11 | ch02_night_discussion | assets/exams/ch03/68-심화-11.jpg | 68회 한국사_문제지(심화).pdf / 68회 한국사_정답표(심화).pdf |
| ch03 | ch03-official-71-advanced-11 | 71 | 심화 | 11 | ch02_exam_day | assets/exams/ch03/71-심화-11.jpg | 71회 한국사_문제지(심화).pdf / 제71회 심화 정답표.pdf |
| ch06 | ch06-official-77-advanced-11 | 77 | 심화 | 11 | ch06_woodblocks | assets/exams/shared/77-advanced-11.webp | 77회 한국사_문제지(심화).pdf / 77회 한국사_답지(심화).pdf |
| ch07 | ch07-official-75-basic-17 | 75 | 기본 | 17 | ch07_special | assets/exams/shared/75-basic-17.webp | 75회 한국사_문제지(기본).pdf / 75회 한국사_답지(기본).pdf |
| ch08 | ch08-official-77-advanced-17 | 77 | 심화 | 17 | ch08_record | assets/exams/shared/77-advanced-17.webp | 77회 한국사_문제지(심화).pdf / 77회 한국사_답지(심화).pdf |
| ch09 | ch09-official-77-advanced-16 | 77 | 심화 | 16 | ch09_bongsa | assets/exams/shared/77-advanced-16.webp | 77회 한국사_문제지(심화).pdf / 77회 한국사_답지(심화).pdf |
| ch10 | ch10-official-75-basic-16 | 75 | 기본 | 16 | ch10_people | assets/exams/shared/75-basic-16.webp | 75회 한국사_문제지(기본).pdf / 75회 한국사_답지(기본).pdf |
| ch10 | ch10-official-70-advanced-15 | 70 | 심화 | 15 | ch10_return | assets/exams/shared/70-advanced-15.webp | 70회 한국사_문제지(심화).pdf / 70회 한국사_정답지(심화).pdf |
| ch11 | ch11-official-70-advanced-16 | 70 | 심화 | 16 | ch11_yuan | assets/exams/shared/70-advanced-16.webp | 70회 한국사_문제지(심화).pdf / 70회 한국사_정답지(심화).pdf |
| ch12 | ch12-official-75-basic-14 | 75 | 기본 | 14 | ch12_wihwa | assets/exams/shared/75-basic-14.webp | 75회 한국사_문제지(기본).pdf / 75회 한국사_답지(기본).pdf |
| ch05 | ch05-official-73-basic-11 | 73 | 기본 | 11 | ch05_seohui | assets/exams/ch05/73-basic-11.webp | 73회 한국사_문제지(기본).pdf / 73회 한국사_정답표(기본).pdf |
| ch05 | ch05-official-67-basic-13 | 67 | 기본 | 13 | ch05_seohui | assets/exams/ch05/67-basic-13.webp | 67회 한국사_문제지(기본).pdf / 67회 한국사_정답표(기본).pdf |
| ch05 | ch05-official-77-basic-12 | 77 | 기본 | 12 | ch05_memory | assets/exams/ch05/77-basic-12.webp | 77회 한국사_문제지(기본).pdf / 77회 한국사_정답표(기본).pdf |
| ch05 | ch05-official-72-advanced-12 | 72 | 심화 | 12 | ch05_border | assets/exams/ch05/72-advanced-12.webp | 제72회 심화 문제지.pdf / 제72회 심화 정답표.pdf |
| ch05 | ch05-official-63-advanced-14 | 63 | 심화 | 14 | ch05_invasion | assets/exams/ch05/63-advanced-14.webp | 63회 한국사_문제지(심화).pdf / 63회 한국사_정답표(심화).pdf |
| ch05 | ch05-official-64-advanced-11 | 64 | 심화 | 11 | ch05_council | assets/exams/ch05/64-advanced-11.webp | 64회 한국사_문제지(심화).pdf / 64회 한국사_정답표(심화).pdf |
| ch05 | ch05-official-74-advanced-12 | 74 | 심화 | 12 | ch05_seohui | assets/exams/ch05/74-advanced-12.webp | 74회 한국사_문제지(심화).pdf / 74회 심화 정답표.pdf |
| ch06 | ch06-official-65-advanced-12 | 65 | 심화 | 12 | ch06_flight | assets/exams/ch06/65-advanced-12.webp | 제65회 한국사능력검정시험 심화 문제지.pdf / 제65회 한국사능력검정시험 심화 정답표.pdf |
| ch06 | ch06-official-66-advanced-11 | 66 | 심화 | 11 | ch06_warning | assets/exams/ch06/66-advanced-11.webp | 66회 한국사_문제지(심화).pdf / 66회 한국사_정답표(심화).pdf |
| ch06 | ch06-official-70-advanced-13 | 70 | 심화 | 13 | ch06_burned_market | assets/exams/ch06/70-advanced-13.webp | 70회 한국사_문제지(심화).pdf / 70회 한국사_정답지(심화).pdf |
| ch06 | ch06-official-72-advanced-12 | 72 | 심화 | 12 | ch06_march | assets/exams/ch05/72-advanced-12.webp | 제72회 심화 문제지.pdf / 제72회 심화 정답표.pdf |
| ch06 | ch06-official-74-advanced-12 | 74 | 심화 | 12 | ch06_memory | assets/exams/ch05/74-advanced-12.webp | 74회 한국사_문제지(심화).pdf / 74회 심화 정답표.pdf |
| ch06 | ch06-official-76-advanced-14 | 76 | 심화 | 14 | ch06_coup | assets/exams/ch06/76-advanced-14.webp | 76회 한국사_문제지(심화).pdf / 76회 한국사_답지(심화)).pdf |
| ch06 | ch06-official-79-advanced-13 | 79 | 심화 | 13 | ch06_woodblocks | assets/exams/ch06/79-advanced-13.webp | 79회 한국사_문제지(심화).pdf / 79회 한국사_답지(심화).pdf |
| ch08 | ch08-official-65-advanced-14 | 65 | 심화 | 14 | ch08_suppression | assets/exams/v2/65-advanced-14.webp | 제65회 한국사능력검정시험 심화 문제지.pdf / 제65회 한국사능력검정시험 심화 정답표.pdf |
| ch11 | ch11-official-65-advanced-15 | 65 | 심화 | 15 | ch11_customs | assets/exams/v2/65-advanced-15.webp | 제65회 한국사능력검정시험 심화 문제지.pdf / 제65회 한국사능력검정시험 심화 정답표.pdf |
| ch09 | ch09-official-65-advanced-16 | 65 | 심화 | 16 | ch09_economy | assets/exams/v2/65-advanced-16.webp | 제65회 한국사능력검정시험 심화 문제지.pdf / 제65회 한국사능력검정시험 심화 정답표.pdf |
| ch10 | ch10-official-65-advanced-17 | 65 | 심화 | 17 | ch10_celadon | assets/exams/v2/65-advanced-17.webp | 제65회 한국사능력검정시험 심화 문제지.pdf / 제65회 한국사능력검정시험 심화 정답표.pdf |
| ch12 | ch12-official-65-advanced-18 | 65 | 심화 | 18 | ch12_return | assets/exams/v2/65-advanced-18.webp | 제65회 한국사능력검정시험 심화 문제지.pdf / 제65회 한국사능력검정시험 심화 정답표.pdf |
| ch10 | ch10-official-68-advanced-15 | 68 | 심화 | 15 | ch10_sambyeolcho | assets/exams/v2/68-advanced-15.webp | 68회 한국사_문제지(심화).pdf / 68회 한국사_정답표(심화).pdf |
| ch11 | ch11-official-68-advanced-16 | 68 | 심화 | 16 | ch11_yuan | assets/exams/v2/68-advanced-16.webp | 68회 한국사_문제지(심화).pdf / 68회 한국사_정답표(심화).pdf |
| ch12 | ch12-official-68-advanced-17 | 68 | 심화 | 17 | ch12_jikji | assets/exams/v2/68-advanced-17.webp | 68회 한국사_문제지(심화).pdf / 68회 한국사_정답표(심화).pdf |
| ch10 | ch10-official-72-advanced-14 | 72 | 심화 | 14 | ch10_return | assets/exams/v2/72-advanced-14.webp | 제72회 심화 문제지.pdf / 제72회 심화 정답표.pdf |
| ch11 | ch11-official-72-advanced-15 | 72 | 심화 | 15 | ch11_offices | assets/exams/v2/72-advanced-15.webp | 제72회 심화 문제지.pdf / 제72회 심화 정답표.pdf |
| ch09 | ch09-official-72-advanced-16 | 72 | 심화 | 16 | ch09_economy | assets/exams/v2/72-advanced-16.webp | 제72회 심화 문제지.pdf / 제72회 심화 정답표.pdf |
| ch11 | ch11-official-72-advanced-17 | 72 | 심화 | 17 | ch11_culture | assets/exams/v2/72-advanced-17.webp | 제72회 심화 문제지.pdf / 제72회 심화 정답표.pdf |
| ch10 | ch10-official-74-advanced-13 | 74 | 심화 | 13 | ch10_celadon | assets/exams/v2/74-advanced-13.webp | 74회 한국사_문제지(심화).pdf / 74회 심화 정답표.pdf |
| ch10 | ch10-official-74-advanced-14 | 74 | 심화 | 14 | ch10_return | assets/exams/v2/74-advanced-14.webp | 74회 한국사_문제지(심화).pdf / 74회 심화 정답표.pdf |
| ch09 | ch09-official-74-advanced-16 | 74 | 심화 | 16 | ch09_jinul | assets/exams/v2/74-advanced-16.webp | 74회 한국사_문제지(심화).pdf / 74회 심화 정답표.pdf |
| ch11 | ch11-official-74-advanced-17 | 74 | 심화 | 17 | ch11_customs | assets/exams/v2/74-advanced-17.webp | 74회 한국사_문제지(심화).pdf / 74회 심화 정답표.pdf |
| ch10 | ch10-official-66-advanced-13 | 66 | 심화 | 13 | ch10_mainland | assets/exams/v2/66-advanced-13.webp | 66회 한국사_문제지(심화).pdf / 66회 한국사_정답표(심화).pdf |
| ch09 | ch09-official-66-advanced-14 | 66 | 심화 | 14 | ch09_choe | assets/exams/v2/66-advanced-14.webp | 66회 한국사_문제지(심화).pdf / 66회 한국사_정답표(심화).pdf |
| ch11 | ch11-official-66-advanced-15 | 66 | 심화 | 15 | ch11_reform | assets/exams/v2/66-advanced-15.webp | 66회 한국사_문제지(심화).pdf / 66회 한국사_정답표(심화).pdf |
| ch07 | ch07-official-69-advanced-13 | 69 | 심화 | 13 | ch07_nine | assets/exams/v2/69-advanced-13.webp | 69회 한국사_문제지(심화).pdf / 69회 한국사_정답표(심화).pdf |
| ch09 | ch09-official-69-advanced-14 | 69 | 심화 | 14 | ch09_other_revolts | assets/exams/v2/69-advanced-14.webp | 69회 한국사_문제지(심화).pdf / 69회 한국사_정답표(심화).pdf |
| ch11 | ch11-official-69-advanced-15 | 69 | 심화 | 15 | ch11_gongmin | assets/exams/v2/69-advanced-15.webp | 69회 한국사_문제지(심화).pdf / 69회 한국사_정답표(심화).pdf |
| ch10 | ch10-official-69-advanced-17 | 69 | 심화 | 17 | ch10_jeju | assets/exams/v2/69-advanced-17.webp | 69회 한국사_문제지(심화).pdf / 69회 한국사_정답표(심화).pdf |
| ch09 | ch09-official-70-advanced-14 | 70 | 심화 | 14 | ch09_rulers | assets/exams/v2/70-advanced-14.webp | 70회 한국사_문제지(심화).pdf / 70회 한국사_정답지(심화).pdf |
| ch09 | ch09-official-71-advanced-14 | 71 | 심화 | 14 | ch09_mangyi | assets/exams/v2/71-advanced-14.webp | 71회 한국사_문제지(심화).pdf / 제71회 심화 정답표.pdf |
| ch10 | ch10-official-71-advanced-15 | 71 | 심화 | 15 | ch10_island | assets/exams/v2/71-advanced-15.webp | 71회 한국사_문제지(심화).pdf / 제71회 심화 정답표.pdf |
| ch10 | ch10-official-71-advanced-16 | 71 | 심화 | 16 | ch10_celadon | assets/exams/v2/71-advanced-16.webp | 71회 한국사_문제지(심화).pdf / 제71회 심화 정답표.pdf |
| ch07 | ch07-official-69-basic-11 | 69 | 기본 | 11 | ch07_gwiju | assets/exams/v2/69-basic-11.webp | 69-basic-question.pdf / 69-basic-answer.pdf |
| ch09 | ch09-official-69-basic-12 | 69 | 기본 | 12 | ch09_economy | assets/exams/v2/69-basic-12.webp | 69-basic-question.pdf / 69-basic-answer.pdf |
| ch08 | ch08-official-73-basic-13 | 73 | 기본 | 13 | ch08_palace_ashes | assets/exams/v2/73-basic-13.webp | 73-question.pdf / 73-answer.pdf |

## 아트 및 배경

- 캐릭터 WebP 103개: 11.73 MiB. 기존 portrait ID 230개의 연결을 유지합니다.
- 신규 배경 WebP 101개: 23.51 MiB. 기존 223개 scene의 장소·시간·사건에 맞게 매핑했습니다. CH.06의 적합한 기존 전용 배경은 유지했습니다.
- 캐릭터는 640×960 투명 WebP, 배경은 720×1080 WebP입니다. 원본 PNG는 프로젝트에 중복 포함하지 않습니다.
- `V2_ART_MANIFEST.json`, `V2_BACKGROUND_MANIFEST.json`에 파일·크기·hash·제작 원본을 기록했습니다.
- 기존 에셋은 저장/구현 호환성을 위해 삭제하지 않았습니다. 이번 신규 후보 중 사용하지 않는 에셋 4개는 배포에서 제외했습니다.

| scene | 이전 illustration | 신규 illustration | 연도 | 장소 | 시간 |
|---|---|---|---:|---|---|
| prologue | prologue-study | v2-modern-study-night | 2026 | 서울 · 나의 방 | night |
| sleep | prologue-sleep | v2-modern-study-night | 2026 | 서울 · 늦은 밤 | night |
| voice | timeslip-voice | v2-modern-study-night | 918 |  | unknown |
| house | goryeo-house | v2-goryeo-house-918 | 918 | 송악으로 가는 길목 · 민가 | morning |
| outfit_gift | goryeo-house | v2-goryeo-house-918 | 918 | 송악으로 가는 길목 · 민가 | morning |
| rumor | village-rumor | v2-songak-village-918 | 918 | 마을 · 흙길 | morning |
| foundation | title-foundation | v2-early-capital-930 | 918 | 기억과 현실의 경계 | day |
| ch07_command | late-court | v2-court-war-council-1018 | 1018 | 개경 조정 | day |
| ch07_heunghwa | late-water | ch06-heunghwajin-dam | 1018 | 흥화진 앞 냇물 | day |
| ch07_ambush | late-war | v2-heunghwa-release | 1018 | 흥화진 계곡 | day |
| ch07_gaegyeong | late-city | v2-gaegyeong-empty-1018 | 1018 | 개경 북쪽 | day |
| ch07_return | late-border | v2-khitan-retreat-road-1019 | 1019 | 귀주로 향하는 퇴로 | day |
| ch07_gwiju | ch07-gwiju-battlefield | v2-gwiju-battle-1019 | 1019 | 귀주 | day |
| ch07_retreat | ch07-gwiju-battlefield | v2-gwiju-aftermath | 1019 | 귀주 · 거란군 퇴로 | afternoon |
| ch07_peace | late-market | v2-northern-market-1020 | 1020 | 다시 열린 북방 장터 | day |
| ch07_time | late-border | v2-jurchen-frontier-1104 | 1104 | 동북 변경 | day |
| ch07_special | late-war | v2-byeolmuban-muster | 1104 | 군사 훈련장 | day |
| ch07_nine_fortresses | late-border | v2-nine-fortresses-1107 | 1107 | 동북면 · 새 성 아래 | sunset |
| ch07_nine | late-border | v2-nine-fortresses-1107 | 1107 | 동북 지역 | day |
| ch07_return_nine | late-border | v2-nine-fortresses-1107 | 1109 | 동북 9성의 길 | day |
| ch07_after | late-ending | v2-gaegyeong-aristocrats-1126 | 1126 | 개경 귀족가 | dawn |
| ch08_aristocrats | late-city | v2-gaegyeong-aristocrats-1126 | 1126 | 개경 귀족가 | day |
| ch08_uicheon | late-temple | v2-uicheon-library | 1126 | 흥왕사 서고의 기록 | day |
| ch08_yi_power | late-court | v2-aristocratic-court-1126 | 1126 | 개경 궁성 | day |
| ch08_rebellion | late-night | v2-palace-fire-1126 | 1126 | 불타는 개경 | night |
| ch08_palace_ashes | late-night | v2-palace-fire-1126 | 1126 | 개경 궁성 밖 | night |
| ch08_fall | late-night | v2-palace-ashes-1126 | 1126 | 무너진 귀족가 | day |
| ch08_west | late-border | v2-seogyeong-1135 | 1135 | 서경 | day |
| ch08_revolt | ch08-seogyeong-rebellion | v2-seogyeong-closed-market-1135 | 1135 | 서경 성안 | day |
| ch08_divided_city | ch08-seogyeong-rebellion | v2-seogyeong-closed-market-1135 | 1135 | 서경 · 닫힌 시장 | afternoon |
| ch08_suppression | late-war | v2-seogyeong-siege-1136 | 1136 | 서경 성밖 | day |
| ch08_record | late-study | v2-historian-study-1145 | 1145 | 개경 서고 | day |
| ch08_society | late-market | v2-gaegyeong-aristocrats-1126 | 1146 | 개경 시장 | day |
| ch08_pressure | late-night | v2-bohyeon-road-1170 | 1170 | 보현원으로 가는 길 | day |
| ch08_memory | late-city | v2-gaegyeong-gate-1170 | 1170 | 개경 성문 | dawn |
| ch08_after | late-ending | v2-bohyeon-coup-1170 | 1170 | 보현원 | dawn |
| ch09_coup | late-night | v2-bohyeon-coup-1170 | 1170 | 보현원 | day |
| ch09_puppet | late-court | v2-military-regime-1196 | 1170 | 개경 궁궐 | day |
| ch09_rulers | late-city | v2-military-regime-1196 | 1196 | 개경의 권력가 | day |
| ch09_choe | late-night | v2-military-regime-1196 | 1196 | 개경 최씨 가문 | day |
| ch09_bongsa | ch09-choe-regime | v2-military-regime-1196 | 1196 | 고려 조정 | day |
| ch09_documents | ch09-choe-regime | v2-military-regime-1196 | 1196 | 교정도감 뜰 | dusk |
| ch09_mangyi | late-market | v2-peasant-rebellion-1176 | 1196 | 개경에 도착한 명학소 기록 | day |
| ch09_revolt | late-war | v2-peasant-rebellion-1176 | 1196 | 명학소 봉기 기록 | day |
| ch09_other_revolts | late-market | v2-gyeongsang-rebellion | 1196 | 경상도 봉기 기록 | day |
| ch09_manjeok | late-night | v2-manjeok-north-hill | 1198 | 개경 북산 | day |
| ch09_jinul | late-temple | v2-meditation-temple-1200 | 1200 | 송광사 | day |
| ch09_economy | late-market | v2-goryeo-grain-market | 1200 | 개경과 지방의 장시 | day |
| ch09_memory | late-city | v2-gaegyeong-gate-1170 | 1200 | 개경 성밖 | dawn |
| ch09_after | late-ending | v2-mongol-invasion-1231 | 1231 | 압록강 방면 | dawn |
| ch10_first | late-war | v2-mongol-invasion-1231 | 1231 | 북방 성곽 | day |
| ch10_cheoin | late-border | v2-cheoin-defense-1232 | 1232 | 처인성 | day |
| ch10_people | ch10-cheoin-fortress | v2-cheoin-defense-1232 | 1232 | 처인성 안 | day |
| ch10_wall | ch10-cheoin-fortress | v2-cheoin-defense-1232 | 1232 | 처인성 성벽 | late-afternoon |
| ch10_ganghwa | late-water | v2-ganghwa-ferry | 1232 | 강화도 나루 | day |
| ch10_island | late-water | v2-ganghwa-palace-1232 | 1233 | 강화도 | day |
| ch10_mainland | late-war | v2-mainland-devastation-1237 | 1235 | 강화도 건너 육지 마을 | sunset |
| ch10_tripitaka | late-temple | v2-tripitaka-carving-1237 | 1237 | 대장도감 | day |
| ch10_haeinsa | late-study | v2-tripitaka-repository-1251 | 1251 | 강화도 대장도감 | day |
| ch10_celadon | late-market | v2-celadon-workshop-1250 | 1251 | 강진 가마터 | day |
| ch10_fall | late-night | v2-ganghwa-palace-1232 | 1258 | 개경과 강화도 | day |
| ch10_return | late-water | v2-ganghwa-ferry | 1270 | 강화도 나루 | day |
| ch10_sambyeolcho | late-water | v2-sambyeolcho-jindo-1270 | 1270 | 진도 앞바다 | day |
| ch10_jeju | late-border | v2-jeju-hangpaduri | 1273 | 제주 항파두리 | day |
| ch10_memory | late-city | v2-gaegyeong-return-1273 | 1273 | 개경으로 돌아온 길 | dawn |
| ch10_after | late-ending | v2-yuan-royal-palace | 1273 | 원의 사신이 든 궁궐 | dawn |
| ch11_yuan | late-court | v2-yuan-royal-palace | 1280 | 개경 궁궐 | day |
| ch11_customs | late-city | v2-yuan-gaegyeong-1300 | 1280 | 개경 큰길 | afternoon |
| ch11_offices | late-city | v2-yuan-office-1300 | 1280 | 정동행성 | day |
| ch11_land | late-market | v2-estate-registers-1350 | 1300 | 권문세족의 농장 | day |
| ch11_culture | late-study | v2-metal-type-workshop-1305 | 1305 | 개경의 인쇄 공방 | day |
| ch11_gongmin | late-court | v2-gongmin-court-1356 | 1351 | 개경 궁궐 | day |
| ch11_imunso | late-court | v2-yuan-office-1300 | 1356 | 개경 관청 | day |
| ch11_ssangseong | late-border | v2-ssangseong-1356 | 1356 | 동북면 | day |
| ch11_north | ch11-ssangseong-recovery | v2-ssangseong-1356 | 1356 | 수복된 동북면 | day |
| ch11_returning | ch11-ssangseong-recovery | v2-returned-families-1356 | 1356 | 수복된 동북면 성문 | morning |
| ch11_sindon | late-study | v2-land-reform-1366 | 1366 | 전민변정도감 | day |
| ch11_reform | late-market | v2-land-reform-1366 | 1366 | 토지 문서 심사장 | day |
| ch11_limits | late-night | v2-gongmin-court-1356 | 1366 | 개경 궁궐 | day |
| ch11_history | late-study | v2-late-history-books | 1370 | 개경 서고 | day |
| ch11_memory | late-city | v2-yuan-gaegyeong-1300 | 1370 | 개경 거리 | dawn |
| ch11_after | late-ending | v2-wihwa-rain-1388 | 1388 | 요동 정벌군의 길 | dawn |
| ch12_wihwa | ch12-wihwado-rain | v2-wihwa-rain-1388 | 1388 | 위화도 | day |
| ch12_supplies | ch12-wihwado-rain | v2-wihwa-supplies-night-1388 | 1388 | 위화도 · 젖은 군량 창고 | night |
| ch12_return | late-war | v2-gaegyeong-army-return-1388 | 1388 | 개경 성문 | day |
| ch12_newpower | late-court | v2-late-goryeo-court | 1388 | 개경 관청 | day |
| ch12_land | late-study | v2-land-registry-1391 | 1391 | 토지 문서 창고 | day |
| ch12_gwajeon | late-market | v2-gwajeon-fields | 1391 | 경기 들판 | day |
| ch12_jikji | late-study | v2-royal-archive | 1391 | 개경 서고 | day |
| ch12_poeun | late-night | v2-poeun-road | 1392 | 개경 선죽교로 가는 길 | day |
| ch12_bridge | late-night | v2-seonjuk-bridge-1392 | 1392 | 선죽교 | day |
| ch12_abdication | late-court | v2-late-goryeo-court | 1392 | 개경 궁궐 | day |
| ch12_registry | late-study | v2-royal-archive | 1392 | 개경 관청의 빈 서고 | night |
| ch12_founding | late-city | v2-dynasty-capital-1392 | 1392 | 새 왕조의 조정 | day |
| ch12_918 | late-market | v2-gaegyeong-old-market-1392 | 1392 | 개경 장터 옛터 | day |
| ch12_faces | late-water | v2-gaegyeong-dawn-1392 | 1392 | 기억의 길 | dawn |
| ch12_memory | late-ending | v2-gaegyeong-dawn-1392 | 1392 | 개경의 새벽 | dawn |
| ch12_teaser | late-city | v2-hanyang-road-1394 | 1394 | 한양으로 향하는 길 | day |
| ch12_after | late-ending | v2-hanyang-road-1394 | 1394 | 한양으로 향하는 길 | dawn |
| ch05_prologue | ch05-empty-guild-dusk | v2-empty-guild-993 | 993 | 도윤상단 · 시간이 흐른 마당 | sunset |
| ch05_border | route-caravan | v2-frontier-market-993 | 993 | 북방 장터 | day |
| ch05_invasion | ch05-frontier-invasion | v2-khitan-invasion-993 | 993 | 청천강 이북 | day |
| ch05_council | ch05-council-crisis | v2-council-crisis-993 | 993 | 고려 조정 | day |
| ch05_seohui | ch05-seohui-negotiation | v2-negotiation-camp-993 | 993 | 거란 진영 앞 | day |
| ch05_terms | ch05-seohui-negotiation | v2-negotiation-camp-993 | 993 | 거란 진영 · 담판 직후 | dawn |
| ch05_withdraw | ch05-khitan-withdrawal | v2-khitan-withdrawal-994 | 994 | 북방 성문 | day |
| ch05_six | ch05-gangdong-fortifications | v2-gangdong-builders-994 | 994 | 압록강 동쪽 | day |
| ch05_builders | ch05-gangdong-fortifications | v2-gangdong-builders-994 | 994 | 강동 6주 · 성벽 공사장 | afternoon |
| ch05_people | ch05-gangdong-fortifications | v2-gangdong-settlement-995 | 995 | 새로 쌓은 성 아래 | day |
| ch05_memory | ch05-gangdong-fortifications | v2-gangdong-settlement-995 | 995 | 압록강 길 | dawn |
| ch05_bridge | late-night | v2-gaegyeong-unease-1009 | 1009 | 개경으로 향하는 길 | day |
| ch05_after | late-night | v2-gaegyeong-unease-1009 | 1009 | 어두운 개경 | dawn |
| outfit_question | goryeo-house-question | v2-goryeo-house-918 | 918 | 송악으로 가는 길목 · 민가 | morning |
| village | village-reveal | v2-songak-village-918 | 918 | 송악으로 가는 길목 · 마을 | morning |
| market | market-later-three-kingdoms | v2-early-songak-market | 918 | 마을 · 장터 | afternoon |
| doyun | doyun-intro | v2-early-songak-market | 918 | 마을 · 장터 | afternoon |
| status | status-first | v2-early-songak-market | 918 | 마을 · 장터 어귀 | afternoon |
| life_choice | life-choice | v2-songak-village-918 | 918 | 마을 밖 · 갈림길 | afternoon |
| route_songak | route-songak | v2-caravan-peace-930 | 918 | 송악으로 향하는 길 | afternoon |
| route_village | route-village | v2-refugee-village-936 | 918 | 사람들이 빠져나간 마을 | afternoon |
| route_caravan | route-caravan | v2-caravan-peace-930 | 918 | 마을 밖 · 상단 집결지 | afternoon |
| route_royal | route-royal | v2-caravan-peace-930 | 918 | 송악으로 난 길 | afternoon |
| route_context | route-context | v2-caravan-peace-930 | 918 | 송악 인근 · 큰길 | late-afternoon |
| thief | thief-start | v2-early-songak-market | 918 | 송악 인근 · 시장 길목 | late-afternoon |
| thief_aftermath | thief-aftermath | v2-early-songak-market | 918 | 송악 인근 · 시장 | sunset |
| ch01_trade_start | route-caravan | v2-early-songak-market | 918 | 송악 장터 | day |
| ch01_jump_927 | route-songak | v2-early-songak-market | 927 | 개경 인근 · 도윤과 나 | day |
| ch01_gongsan | thief-aftermath | v2-caravan-warning-927 | 927 | 개경 인근 · 도윤과 나 | day |
| ch01_conflict | goryeo-house | v2-goryeo-house-918 | 927 | 개경 인근 · 도윤과 나 | day |
| ch01_reconcile | goryeo-house | v2-goryeo-house-918 | 927 | 개경 인근 · 도윤과 나 | day |
| ch01_jump_930 | route-caravan | v2-caravan-peace-930 | 930 | 개경 인근 · 도윤과 나 | day |
| ch01_gochang | ch01-gochang-open-road | v2-caravan-peace-930 | 930 | 개경 인근 · 도윤과 나 | day |
| ch01_belonging | route-songak | v2-early-capital-930 | 930 | 개경 인근 · 도윤과 나 | day |
| ch01_ending_930 | route-songak | v2-early-capital-930 | 930 | 개경 인근 · 도윤과 나 | day |
| ch01_clear_930 | future-flow | v2-early-capital-930 | 930 | 개경 인근 · 도윤과 나 | day |
| ch01_jump_935 | ch02-trade-room-935 | v2-trade-room-935 | 935 | 개경 인근 · 도윤과 나 | day |
| ch01_gyeonhwon | ch02-trade-room-935 | v2-trade-room-935 | 935 | 개경 인근 · 도윤과 나 | day |
| ch01_silla | ch02-trade-room-935 | v2-trade-room-935 | 935 | 개경 인근 · 도윤과 나 | day |
| ch01_jump_936 | route-caravan | v2-caravan-warning-927 | 936 | 개경 인근 · 도윤과 나 | day |
| ch01_war_choice | route-caravan | v2-caravan-warning-927 | 936 | 개경 인근 · 도윤과 나 | day |
| ch01_war_supply | route-caravan | v2-caravan-warning-927 | 936 | 개경 인근 · 도윤과 나 | day |
| ch01_war_news | route-context | v2-caravan-warning-927 | 936 | 개경 인근 · 도윤과 나 | day |
| ch01_war_refugees | route-village | v2-refugee-village-936 | 936 | 개경 인근 · 도윤과 나 | day |
| ch01_victory | route-songak | v2-early-capital-930 | 936 | 개경 인근 · 도윤과 나 | day |
| ch01_unity | future-flow | v2-early-capital-930 | 936 | 개경 인근 · 도윤과 나 | day |
| ch01_integration | ch02-trade-room-935 | v2-trade-room-935 | 937 | 개경 인근 · 도윤과 나 | day |
| ch01_sasimgwan | ch02-trade-room-935 | v2-trade-room-935 | 937 | 개경 인근 · 도윤과 나 | day |
| ch01_giin | route-songak | v2-early-capital-930 | 937 | 개경 인근 · 도윤과 나 | day |
| ch01_refugee_family | ch02-trade-room-935 | v2-trade-room-935 | 938 | 개경 인근 · 도윤과 나 | day |
| ch01_north | route-caravan | v2-caravan-peace-930 | 940 | 개경 인근 · 도윤과 나 | day |
| ch01_welfare | route-village | v2-refugee-village-936 | 941 | 개경 인근 · 도윤과 나 | day |
| ch01_jump_943 | route-songak | v2-early-capital-930 | 943 | 개경 인근 · 도윤과 나 | day |
| ch01_memory_943 | goryeo-house | v2-goryeo-house-918 | 943 | 개경 인근 · 도윤과 나 | day |
| ch01_taejo_death | route-context | v2-early-capital-930 | 943 | 개경 인근 · 도윤과 나 | day |
| ch01_hunyo | ch02-trade-room-935 | v2-trade-room-935 | 943 | 개경 인근 · 도윤과 나 | day |
| ch01_guild_seed | ch02-trade-room-935 | v2-trade-room-night-943 | 943 | 개경 인근 · 도윤과 나 | night |
| ch01_farewell | future-flow | v2-early-capital-930 | 943 | 개경 인근 · 도윤과 나 | day |
| ch02_open_935 | future-flow | v2-trade-room-935 | 935 | 개경 인근 · 도윤과 나 | day |
| ch02_news_935 | ch02-trade-room-935 | v2-trade-room-935 | 935 | 개경 인근 · 도윤과 나 | day |
| ch02_transition | ch02-market-949 | v2-shop-exterior-949 | 949 | 시간의 흐름 | dawn |
| ch02_shop_exterior_949 | ch02-doyun-shop-exterior-949 | v2-shop-exterior-949 | 949 | 949년 · 개경 시장 | afternoon |
| ch02_reunion_949 | ch02-doyun-shop-interior-949 | v2-shop-interior-949 | 949 | 개경 · 도윤의 가게 | afternoon |
| ch02_market | ch02-doyun-shop-interior-949 | v2-shop-interior-949 | 949 | 개경 · 도윤의 가게 | afternoon |
| ch02_life_path | ch02-doyun-shop-exterior-949 | v2-shop-exterior-949 | 949 | 개경 · 도윤의 가게 앞 | afternoon |
| ch02_jump_956 | ch02-doyun-shop-956 | v2-shop-exterior-956 | 956 | 시간의 흐름 | dawn |
| ch02_shop_956 | ch02-doyun-shop-956 | v2-shop-interior-956 | 956 | 개경 · 도윤의 가게 | afternoon |
| ch02_dispute | ch02-slave-dispute | v2-slave-dispute-956 | 956 | 개경 · 시장 한복판 | afternoon |
| ch02_trust | ch02-slave-dispute | v2-slave-dispute-956 | 956 | 개경 · 시장 한복판 | afternoon |
| ch02_inspection | chapter-02-teaser | v2-status-inspection-956 | 956 | 개경 · 신분 조사처 | evening |
| ch02_policy_reason | ch02-freed-citizen | v2-status-inspection-956 | 956 | 개경 · 신분 조사처 앞 | sunset |
| ch02_policy_memory | ch02-freed-citizen | v2-status-inspection-956 | 956 | 역사 기억 | memory |
| ch02_noble_night | ch02-nobles-night | v2-shop-interior-night-960 | 956 | 개경 · 도윤의 상점 | night |
| ch02_jump_958 | ch02-exam-notice | v2-exam-notice-958 | 958 | 시간의 흐름 | dawn |
| ch02_exam_notice | ch02-exam-notice | v2-exam-notice-958 | 958 | 개경 · 관청 앞 거리 | morning |
| ch02_three_way | ch02-exam-notice | v2-shop-interior-956 | 958 | 개경 · 도윤의 가게 | afternoon |
| ch02_ssanggi | ch02-exam-notice | v2-exam-notice-958 | 958 | 개경 · 관청 앞 거리 | morning |
| ch02_exam_eve | ch02-nobles-night | v2-shop-interior-night-960 | 958 | 개경 · 시험 전날 밤 | night |
| ch02_exam_day | ch02-exam-yard | v2-exam-yard-958 | 958 | 개경 · 과거 시험장 | morning |
| ch02_official_robes_walk | ch02-reign-titles | v2-exam-notice-958 | 960 | 개경 · 관청 거리 | afternoon |
| ch02_hyunwoo_official | ch02-gaegyeong-market | v2-exam-notice-958 | 960 | 개경 · 관청 거리 | afternoon |
| ch02_reign_titles | ch02-gaegyeong-market | v2-shop-exterior-956 | 960 | 개경 · 상인 거리 | afternoon |
| ch02_reign_followup | ch02-gaegyeong-market | v2-shop-exterior-956 | 960 | 개경 · 같은 상인 거리 | afternoon |
| ch02_purge | ch02-doyun-shop-956 | v2-shop-interior-956 | 960 | 개경 · 도윤의 가게 | evening |
| ch02_night_discussion | ch02-doyun-shop-956 | v2-shop-interior-night-960 | 960 | 개경 · 도윤의 가게 | night |
| ch02_complete | ch02-doyun-shop-956 | v2-shop-interior-956 | 960 | 개경 · 도윤의 가게 | sunset |
| ch02_night_reflection | ch02-water-reflection-958 | v2-river-reflection-960 | 960 | 개경 밖 · 물가 | night |
| ch02_mystery | ch02-water-reflection-958 | v2-river-reflection-960 | 960 | 알 수 없는 기억 | night |
| ch02_memory_retrieval | ch02-complete | v2-shop-interior-956 | 960 | 살아온 기억 | memory |
| ch02_realization | ch02-complete | v2-shop-interior-956 | 960 | 살아온 기억 | memory |
| ch02_chapter_clear | ch02-complete | v2-shop-interior-night-960 | 960 | 역사 기록 | night |
| ch03_transition | ch03-gaegyeong-982 | v2-guild-exterior-982 | 982 | 시간의 흐름 | dawn |
| ch03_gaegyeong | ch03-gaegyeong-982 | v2-gaegyeong-capital-982 | 982 | 982년 · 개경 | morning |
| ch03_guild_exterior | ch03-doyun-guild-exterior | v2-guild-exterior-982 | 982 | 개경 · 도윤상단 | afternoon |
| ch03_dream_realized | ch03-doyun-guild-interior | v2-guild-interior-982 | 982 | 도윤상단 · 안채 | afternoon |
| ch03_unchanged | ch03-doyun-guild-interior | v2-guild-interior-982 | 982 | 도윤상단 · 안채 | late-afternoon |
| ch03_returning_merchant | ch03-returning-merchant | v2-guild-courtyard-982 | 982 | 도윤상단 · 마당 | afternoon |
| ch03_provincial_problem | ch03-provincial-strongman | v2-provincial-road-982 | 982 | 지방으로 향하는 길 · 기억 | memory |
| ch03_policy_choice | ch03-doyun-guild-interior | v2-guild-interior-982 | 982 | 도윤상단 · 안채 | evening |
| ch03_hyunwoo_return | ch03-doyun-guild-interior | v2-guild-interior-982 | 982 | 도윤상단 · 안채 | evening |
| ch03_seongjong_news | ch03-doyun-guild-interior | v2-guild-interior-982 | 982 | 도윤상단 · 안채 | evening |
| ch03_choe_reform | ch03-doyun-guild-interior | v2-guild-interior-night-982 | 982 | 도윤상단 · 안채 | night |
| ch03_twelve_mok | ch03-returning-merchant | v2-guild-courtyard-982 | 982 | 도윤상단 · 마당 | morning |
| ch03_gukjagam | ch03-gukjagam | v2-gukjagam-982 | 982 | 개경 · 국자감 | morning |
| ch03_exam_75 | ch03-gukjagam | v2-gukjagam-982 | 982 | 역사 기억 | memory |
| ch03_policy_effect | ch03-returning-merchant | v2-guild-courtyard-982 | 982 | 도윤상단 · 마당 | afternoon |
| ch03_trade_practice | ch03-provincial-strongman | v2-provincial-road-982 | 982 | 역사 기억 | memory |
| ch03_three_friends | ch03-doyun-guild-interior | v2-guild-interior-982 | 982 | 도윤상단 · 안채 | evening |
| ch03_choe_practice | ch03-doyun-guild-interior | v2-guild-interior-night-982 | 982 | 역사 기억 | memory |
| ch03_doyun_soliloquy | ch03-doyun-guild-interior | v2-empty-merchant-room-982 | 982 | 도윤상단 · 안채 | late-night |
| ch03_history_reflection | ch03-gaegyeong-982 | v2-guild-interior-982 | 982 | 982년 · 개경 거리 | sunset |
| ch03_timeline_practice | ch03-gaegyeong-982 | v2-guild-interior-982 | 982 | 역사 기억 | memory |
| ch03_courtyard | ch03-doyun-courtyard | v2-guild-courtyard-982 | 982 | 도윤상단 · 마당 | sunset |
| ch03_weakening | ch03-doyun-guild-interior | v2-guild-interior-982 | 982 | 도윤상단 · 안채 | late-afternoon |
| ch03_farewell | ch03-doyun-farewell | v2-empty-merchant-room-982 | 982 | 도윤상단 · 안채 | night |
| ch03_death | ch03-doyun-farewell | v2-empty-merchant-room-982 | 982 | 시간의 흐름 | night |
| ch03_legacy | ch03-guild-legacy | v2-guild-courtyard-982 | 982 | 개경 · 도윤상단 앞 | dawn |
| ch03_exam_75_12 | ch03-gaegyeong-982 | v2-guild-interior-982 | 982 | 역사 기억 | memory |
| ch03_exam_practice_05 | ch03-returning-merchant | v2-guild-interior-982 | 982 | 역사 기억 | memory |
| ch03_exam_practice_06 | ch03-doyun-guild-interior | v2-guild-interior-982 | 982 | 역사 기억 | memory |
| ch03_exam_practice_07 | ch03-gukjagam | v2-guild-interior-982 | 982 | 역사 기억 | memory |
| ch03_exam_practice_08 | ch03-gaegyeong-982 | v2-guild-interior-982 | 982 | 역사 기억 | memory |
| ch03_exam_practice_09 | ch03-gaegyeong-982 | v2-guild-interior-982 | 982 | 역사 기억 | memory |
| night | first-night | v2-goryeo-first-night-918 | 918 | 마을 또는 송악 · 밤 | night |

## 검증

- `npm test`: PASS. 기존 전체 회귀 테스트와 V2 통계·기출 표시·정확한 회상 매핑·저장 호환성·콘텐츠 보존 검사를 통과했습니다.
- CH.01~12 전체 UI 이벤트 기반 자동 플레이: 세 선택 경로, 정답/오답, 문제→해설→스토리 복귀, 재실행 저장 복원, 챕터 해금, 엔딩, 리플레이 PASS. 신규 30기출 모두 실제 출제됨을 각 경로에서 검증했습니다.
- `npm run build`: PASS (35 필수 파일, 447 ready illustrations, manifest/service worker).
- 모바일 브라우저 직접 검수: 홈/시대 선택/스토리/기출 원본 이미지/정답·오답 해설/오답 재풀이/내 기록. CH.01 완료→CH.02 진입 및 도윤·주인공 좌우 active/listening 표시를 확인했습니다.
- 375/390/430×844 브라우저 뷰포트에서 가로 overflow 및 깨진 이미지 없음. 데스크톱 스크롤바로 실제 내용 폭은 각각 360/375/415px였습니다.
- 원본 문제 이미지 30개와 캐릭터·배경 전체 contact sheet를 시각 검수했습니다. 모든 보기와 자료가 crop 안에 보이는 것을 확인했습니다.
- 12챕터 전부를 모바일에서 사람이 수동으로 끝까지 플레이한 결과는 아닙니다. 전체 경로는 자동 UI 이벤트 검사로, 주요 모바일 흐름은 브라우저 직접 조작으로 검증했습니다.

## 수정 파일

- `dist/app.js` (회상 제목/문구만), `dist/index.html`, `dist/renewal.css`, `dist/manifest.webmanifest`, `dist/sw.js`.
- `dist/v2-app.js`, `dist/v2-learning.js`, `dist/v2-art.js`, `dist/v2-backgrounds.js`, `dist/v2-exam-restoration.js`, `dist/v2-exam-additions.js`.
- `dist/assets/v2/characters/`, `dist/assets/v2/backgrounds/`, `dist/assets/exams/v2/`.
- `package.json`, `tests/build.cjs`, 기존 CH05/CH06/기출 이미지 회귀 테스트의 baseline loader, V2 테스트 3개와 원본 fixture 3개.
- `docs/V2_*` 계획·제작 manifest·출제 로그·본 보고서.
