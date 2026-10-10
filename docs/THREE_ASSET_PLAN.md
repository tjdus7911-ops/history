# 씬별 에셋 요구 목록

기준: `55609d66afc269394ad604b47bde18aebf5d0ae3`.

상태: 제작 전 기획 제안. 운영 데이터로 로드하지 않는다. 기존 30챕터·90씬 원본과 모든 서비스 파일을 보존한다.

신규 이미지 생성0개. 아래 ID는 제작 요구이며 이미지가 존재한다는 의미가 아니다. 배경은 같은 국가·장소 키를 공유하며 시간·계절이 달라질 때는 별도 변형 검수를 거친다.

배경·인물·학습도판 요구 438세트 중 기존 파일 연결 후보 5세트, 신규 433세트. 캐릭터는 기본·웃음·놀람3파일, 기타1파일로 계산하여 신규 래스터/도판 파일 추정 831개(기존 인물 추가 표정 4개 포함). 확정 발주 수량이 아니며 연령·복식 변형 승인 시 늘어난다. 서아 기존12파일은 별도 재사용 후보로 집계한다.

서아는 `dist/assets/ancient/characters/three-player-*.png`의 기존12파일을 보존하고 디자인을 유지한다. 기존12종의 표정·현대복/시대복 용도는 매니페스트와 실제 파일을 다시 대조한 뒤 선정한다. 이번 단계의 파일 존재 확인은 PC·모바일 렌더링 검증이 아니다. 원삼국 남자 주인공·단·라온과 고려·조선 인물 파일을 바꾸지 않는다.

고국천왕·을파소 기본 파일은 같은 인물에만 재사용한다. 허구 NPC를 역사 왕의 얼굴로 대체하지 않는다. 같은 장에서 반복되는 NPC는 동일 세트를 쓴다. 장이 다른 이름은 장별 ID로 분리하며 여울 등 장기간 등장 후보는 후손/노년을 대본 확정 전에 결정한다. 2D 선화·셀 채색, 같은 얼굴·체형·복식·팔을 내린 기본 자세를 규격으로 삼는다.

| ID | 종류 | 요구 내용 | 상태·기존 경로 | 사용 씬 |
|---|---|---|---|---|
| BG-1f556df310 | background | 고구려 / 고구려 농촌 | EXISTS_REVIEW_REQUIRED / dist/assets/ancient/three-v2/backgrounds/goguryeo-hungry-village-spring.webp | THR-C01-S01 |
| NPC-C01-6cb6a1d | character-set | 농민 연우; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C01-S01, THR-C01-S07, THR-C01-S08 |
| BG-07f831f7ac | background | 고구려 / 관곡 창고 | EXISTS_REVIEW_REQUIRED / dist/assets/ancient/three-v2/backgrounds/goguryeo-granary-office.webp | THR-C01-S02, THR-C01-S06 |
| NPC-C01-e1cbb8b | character-set | 창고지기 모진; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C01-S02 |
| BG-c03a2aaf5b | background | 고구려 / 지방 관청 | NEEDS_PRODUCTION | THR-C01-S03 |
| NPC-C01-ac97b81 | character-set | 관리 해솔; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C01-S03 |
| BG-76652a0920 | background | 고구려 / 국상 집무처 | NEEDS_PRODUCTION | THR-C01-S04 |
| NPC-C01-c3faab0 | character-set | 을파소; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | EXISTS_REVIEW_REQUIRED / dist/assets/ancient/three-v2/characters/eulpaso-neutral.webp | THR-C01-S04, THR-C01-S06 |
| BG-499ae33b7f | background | 고구려 / 왕의 구휼 논의처 | NEEDS_PRODUCTION | THR-C01-S05 |
| NPC-C01-7be02d0 | character-set | 고국천왕; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | EXISTS_REVIEW_REQUIRED / dist/assets/ancient/three-v2/characters/gogukcheon-neutral.webp | THR-C01-S05 |
| BG-7081558dd8 | background | 고구려 / 상환 마당 | EXISTS_REVIEW_REQUIRED / dist/assets/ancient/three-v2/backgrounds/goguryeo-grain-return-autumn.webp | THR-C01-S07 |
| BG-c587569a84 | background | 고구려 / 창고 문 앞·기록책 전환 | NEEDS_PRODUCTION | THR-C01-S08 |
| BG-ef3258b479 | background | 고구려 / 낙랑 접경길 | NEEDS_PRODUCTION | THR-C02-S01 |
| NPC-C02-98998f0 | character-set | 수레꾼 도림; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C02-S01 |
| BG-220422abdb | background | 고구려 / 군현 관청 밖 | NEEDS_PRODUCTION | THR-C02-S02 |
| NPC-C02-25f6a2e | character-set | 서리 하준; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C02-S02 |
| BG-369226d02f | background | 고구려 / 군영 | NEEDS_PRODUCTION | THR-C02-S03 |
| NPC-C02-e0a4c46 | character-set | 고구려 장교; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C02-S03 |
| BG-2fd18795a2 | background | 고구려 / 낙랑 옛 거주지 | NEEDS_PRODUCTION | THR-C02-S04 |
| NPC-C02-1f549b9 | character-set | 피란민 소운; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C02-S04 |
| BG-0f375a8ddb | background | 고구려 / 교역 나루 | NEEDS_PRODUCTION | THR-C02-S05 |
| NPC-C02-401251e | character-set | 상인 도림; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C02-S05 |
| BG-1d7e8a86dc | background | 고구려 / 왕실 기록실 | NEEDS_PRODUCTION | THR-C02-S06, THR-C03-S04 |
| NPC-C02-b1116b8 | character-set | 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C02-S06, THR-C02-S08 |
| BG-f6ec00df22 | background | 고구려 / 평양 방어선 뒤 | NEEDS_PRODUCTION | THR-C02-S07 |
| NPC-C02-41ff692 | character-set | 전령; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C02-S07 |
| BG-981ee47a0a | background | 고구려 / 왕도 회복 현장 | NEEDS_PRODUCTION | THR-C02-S08 |
| BG-9c57fa3769 | background | 고구려 / 불교 수용 현장 | NEEDS_PRODUCTION | THR-C03-S01 |
| NPC-C03-82b7fd3 | character-set | 승려 순도; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C03-S01 |
| BG-ef6689c16f | background | 고구려 / 태학 | NEEDS_PRODUCTION | THR-C03-S02 |
| NPC-C03-dd193df | character-set | 학생 규림; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C03-S02 |
| BG-c2c153840b | background | 고구려 / 재판 관청 | NEEDS_PRODUCTION | THR-C03-S03 |
| NPC-C03-e32a15f | character-set | 율령 담당관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C03-S03 |
| NPC-C03-b1116b8 | character-set | 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C03-S04 |
| BG-31fca47bb5 | background | 고구려 / 광개토왕 군영 | NEEDS_PRODUCTION | THR-C03-S05 |
| NPC-C03-99dc902 | character-set | 광개토대왕; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C03-S05 |
| BG-19d2202b3b | background | 고구려 / 국경 지도실 | NEEDS_PRODUCTION | THR-C03-S06 |
| NPC-C03-bfe9dd8 | character-set | 장교; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C03-S06 |
| BG-e58da864f3 | background | 고구려 / 신라 구원군 집결지 | NEEDS_PRODUCTION | THR-C03-S07 |
| NPC-C03-fb59915 | character-set | 신라 사신; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C03-S07 |
| BG-ea13170e93 | background | 고구려 / 낙동강 교역로 | NEEDS_PRODUCTION | THR-C03-S08 |
| NPC-C03-12d07f3 | character-set | 가야 상인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C03-S08 |
| BG-ed19201d6d | background | 고구려 / 광개토대왕릉비 건립터 | NEEDS_PRODUCTION | THR-C03-S09 |
| NPC-C03-ac2753a | character-set | 비석 석공; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C03-S09 |
| BG-d4a97044d3 | background | 고구려 / 고분 외부·단면 자료 | NEEDS_PRODUCTION | THR-C03-S10 |
| NPC-C03-88403d9 | character-set | 장례 장인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C03-S10 |
| BG-65dfa5638b | background | 고구려 / 국내성 출발길 | NEEDS_PRODUCTION | THR-C04-S01 |
| NPC-C04-37e44ec | character-set | 이주민 다은; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C04-S01, THR-C04-S03 |
| BG-6e7943e7c7 | background | 고구려 / 평양행 나루 | NEEDS_PRODUCTION | THR-C04-S02 |
| NPC-C04-83c3da4 | character-set | 뱃사공; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C04-S02 |
| BG-1019325c7b | background | 고구려 / 평양 거주지 | NEEDS_PRODUCTION | THR-C04-S03 |
| BG-85a7e8b9dd | background | 고구려 / 평양 정책 논의처 | NEEDS_PRODUCTION | THR-C04-S04 |
| NPC-C04-bc9df33 | character-set | 장수왕; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C04-S04 |
| BG-d6d99a551f | background | 고구려 / 백제 외교문서의 기록 공간 | NEEDS_PRODUCTION | THR-C04-S05 |
| NPC-C04-689626e | character-set | 백제 서리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C04-S05 |
| BG-f2e8a48fe3 | background | 고구려 / 한성 외곽 | NEEDS_PRODUCTION | THR-C04-S06 |
| NPC-C04-3833d59 | character-set | 고구려 보급병; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C04-S06 |
| BG-8109474e75 | background | 고구려 / 한성 후방 피란길 | NEEDS_PRODUCTION | THR-C04-S07 |
| NPC-C04-ea0c35e | character-set | 백제 피란민; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C04-S07 |
| BG-d0d4fba3b5 | background | 고구려 / 충주 고구려비 관련 기록 | NEEDS_PRODUCTION | THR-C04-S08 |
| NPC-C04-5be65f4 | character-set | 비문 조사자; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C04-S08 |
| BG-1df1c6fd76 | background | 고구려 / 고구려·백제 기록 대조 | NEEDS_PRODUCTION | THR-C04-S09 |
| NPC-C04-4c7d74c | character-set | 이주민 다은의 기록; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C04-S09 |
| BG-9bfaa60bb9 | background | 고구려 / 평양 강가·시간 전환 | NEEDS_PRODUCTION | THR-C04-S10 |
| NPC-C04-b1116b8 | character-set | 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C04-S10 |
| BG-6c9f3da43d | background | 고구려 / 살수로 이어지는 보급로 | NEEDS_PRODUCTION | THR-C05-S01 |
| NPC-C05-573d268 | character-set | 보급병 온달수(허구); 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C05-S01 |
| BG-f7943789bd | background | 고구려 / 고구려 지휘소 | NEEDS_PRODUCTION | THR-C05-S02 |
| NPC-C05-8f56cba | character-set | 을지문덕; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C05-S02 |
| BG-19e731b936 | background | 고구려 / 전투 뒤 강변 | NEEDS_PRODUCTION | THR-C05-S03 |
| NPC-C05-7a5b293 | character-set | 의료 보조 민서; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C05-S03 |
| BG-310732e4cb | background | 고구려 / 천리장성 공사장 | NEEDS_PRODUCTION | THR-C05-S04 |
| NPC-C05-c2e7de5 | character-set | 축성 인부; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C05-S04 |
| BG-85b8a83e8d | background | 고구려 / 평양 소문이 모이는 거리 | NEEDS_PRODUCTION | THR-C05-S05 |
| NPC-C05-220a3a6 | character-set | 궁중 서리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C05-S05 |
| BG-e7ad2124e8 | background | 고구려 / 요동 방어선 | NEEDS_PRODUCTION | THR-C05-S06 |
| NPC-C05-0c8147a | character-set | 고구려 전령; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C05-S06 |
| BG-3d3e3bfb3e | background | 고구려 / 안시성 | NEEDS_PRODUCTION | THR-C05-S07 |
| NPC-C05-d6075ef | character-set | 성민 윤서; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C05-S07, THR-C05-S08 |
| BG-0a5ec8979a | background | 고구려 / 안시성 성문 | NEEDS_PRODUCTION | THR-C05-S08 |
| BG-0a9c7ffe67 | background | 고구려 / 평양 왕실 주변 | NEEDS_PRODUCTION | THR-C05-S09 |
| NPC-C05-64a6cc9 | character-set | 서리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C05-S09 |
| BG-b7d78c2fff | background | 고구려 / 평양 피란길 | NEEDS_PRODUCTION | THR-C05-S10 |
| NPC-C05-2cabf4f | character-set | 피란민 태문; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C05-S10 |
| BG-423231542b | background | 고구려 / 유민 임시 거처 | NEEDS_PRODUCTION | THR-C05-S11 |
| NPC-C05-97d7585 | character-set | 유민 태문; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C05-S11 |
| BG-4b6fd36265 | background | 고구려 / 기록책·한성 관청 | NEEDS_PRODUCTION | THR-C05-S12 |
| NPC-C05-b1116b8 | character-set | 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C05-S12 |
| BG-b36368b390 | background | 백제 / 한성 관청 | NEEDS_PRODUCTION | THR-C06-S01 |
| NPC-C06-16452d5 | character-set | 재봉 장인 솔아; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C06-S01 |
| BG-e0e98cfdc4 | background | 백제 / 좌평 집무처 | NEEDS_PRODUCTION | THR-C06-S02 |
| NPC-C06-689626e | character-set | 백제 서리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C06-S02 |
| BG-a77685f239 | background | 백제 / 한성 교역장 | NEEDS_PRODUCTION | THR-C06-S03 |
| NPC-C06-a331598 | character-set | 마한 상인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C06-S03 |
| BG-e32d14a4fe | background | 백제 / 백제 출정 나루 | NEEDS_PRODUCTION | THR-C06-S04 |
| NPC-C06-ae9530b | character-set | 군량 담당 솔아의 후손; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C06-S04 |
| BG-28e7748d9c | background | 백제 / 한성 거리 | NEEDS_PRODUCTION | THR-C06-S05 |
| NPC-C06-8db71c5 | character-set | 백제 전령; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C06-S05 |
| BG-2df83cfeb8 | background | 백제 / 외교 공방 | NEEDS_PRODUCTION | THR-C06-S06 |
| NPC-C06-889cfea | character-set | 칠지도 장인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C06-S06 |
| BG-d0bf51274e | background | 백제 / 한성 외교 나루 | NEEDS_PRODUCTION | THR-C06-S07 |
| NPC-C06-55800e6 | character-set | 통역관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C06-S07 |
| BG-9692d1bd58 | background | 백제 / 백제 왕도 | NEEDS_PRODUCTION | THR-C06-S08 |
| NPC-C06-4300caf | character-set | 마라난타; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C06-S08 |
| BG-af1b0090bd | background | 백제 / 한강 나루·시간 전환 | NEEDS_PRODUCTION | THR-C06-S09 |
| NPC-C06-b1116b8 | character-set | 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C06-S09 |
| BG-787d1d8e12 | background | 백제 / 한성 피란문 | NEEDS_PRODUCTION | THR-C07-S01 |
| NPC-C07-0993611 | character-set | 피란민 해인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C07-S01 |
| BG-4df9d8e8c9 | background | 백제 / 피란 나루 | NEEDS_PRODUCTION | THR-C07-S02 |
| NPC-C07-8db71c5 | character-set | 백제 전령; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C07-S02 |
| BG-e43f3766f6 | background | 백제 / 금강 주변 | NEEDS_PRODUCTION | THR-C07-S03 |
| NPC-C07-7a6bab8 | character-set | 문주왕; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C07-S03 |
| BG-3e06d4492d | background | 백제 / 웅진 거주지 | NEEDS_PRODUCTION | THR-C07-S04 |
| NPC-C07-3522e87 | character-set | 현지 주민 다솔; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C07-S04 |
| BG-00c7d6eefe | background | 백제 / 웅진 기록실 | NEEDS_PRODUCTION | THR-C07-S05 |
| NPC-C07-64a6cc9 | character-set | 서리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C07-S05 |
| BG-944fbaa85a | background | 백제 / 웅진 장터 | NEEDS_PRODUCTION | THR-C07-S06 |
| NPC-C07-15dbbce | character-set | 상인 해인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C07-S06, THR-C07-S08 |
| BG-e16ed0282a | background | 백제 / 백제·신라 사절 숙소 | NEEDS_PRODUCTION | THR-C07-S07 |
| NPC-C07-fb59915 | character-set | 신라 사신; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C07-S07 |
| BG-7ce6eb6595 | background | 백제 / 웅진 나루 | NEEDS_PRODUCTION | THR-C07-S08 |
| BG-b049fc97cc | background | 백제 / 웅진 관청·시간 전환 | NEEDS_PRODUCTION | THR-C07-S09 |
| NPC-C07-b1116b8 | character-set | 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C07-S09 |
| BG-7b24f8c41a | background | 백제 / 웅진 관청 | NEEDS_PRODUCTION | THR-C08-S01 |
| NPC-C08-0c70a4d | character-set | 무령왕; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C08-S01 |
| BG-74eb53d27f | background | 백제 / 지방 담로 관청 | NEEDS_PRODUCTION | THR-C08-S02 |
| NPC-C08-58d257c | character-set | 지방 서리 여울; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C08-S02 |
| BG-89a202a9a0 | background | 백제 / 무령왕릉 자료 공간 | NEEDS_PRODUCTION | THR-C08-S03 |
| NPC-C08-49bec74 | character-set | 유물 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C08-S03 |
| BG-dba8971bc3 | background | 백제 / 사비 이주 준비처 | NEEDS_PRODUCTION | THR-C08-S04 |
| NPC-C08-2c70974 | character-set | 성왕; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C08-S04 |
| BG-d0dae2d83d | background | 백제 / 사비 관청 | NEEDS_PRODUCTION | THR-C08-S05 |
| NPC-C08-689626e | character-set | 백제 서리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C08-S05 |
| BG-f3dae449a6 | background | 백제 / 한강 회복 지역 | NEEDS_PRODUCTION | THR-C08-S06 |
| NPC-C08-ba45dbb | character-set | 백제 병사; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C08-S06 |
| BG-95aad585e6 | background | 백제 / 사비 군영 | NEEDS_PRODUCTION | THR-C08-S07, THR-C09-S05 |
| NPC-C08-07f470d | character-set | 백제 사신; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C08-S07 |
| BG-9577a90cb2 | background | 백제 / 관산성 후방 | NEEDS_PRODUCTION | THR-C08-S08 |
| NPC-C08-5fbdd59 | character-set | 병사 가족 여울; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C08-S08 |
| BG-d681fd0748 | background | 백제 / 백제 후방 구호소 | NEEDS_PRODUCTION | THR-C08-S09 |
| NPC-C08-41ff692 | character-set | 전령; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C08-S09 |
| BG-4b849812e1 | background | 백제 / 접경 장터 | NEEDS_PRODUCTION | THR-C08-S10 |
| NPC-C08-61d5ad2 | character-set | 백제·신라 상인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C08-S10 |
| BG-695b23c87b | background | 백제 / 사비·익산 전환 | NEEDS_PRODUCTION | THR-C08-S11 |
| NPC-C08-b1116b8 | character-set | 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C08-S11 |
| BG-45a41a006e | background | 백제 / 미륵사 조성 현장 | NEEDS_PRODUCTION | THR-C09-S01 |
| NPC-C09-4d96475 | character-set | 백제 장인 도연; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C09-S01 |
| BG-4f5b8221d1 | background | 백제 / 사비 공방 재현 | NEEDS_PRODUCTION | THR-C09-S02 |
| NPC-C09-82720d5 | character-set | 금속 장인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C09-S02 |
| BG-f9299488dd | background | 백제 / 고분 단면 자료실 | NEEDS_PRODUCTION | THR-C09-S03 |
| NPC-C09-fdefb9a | character-set | 장례 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C09-S03 |
| BG-fda605ae85 | background | 백제 / 백제 교류 나루 | NEEDS_PRODUCTION | THR-C09-S04 |
| NPC-C09-b365b3e | character-set | 승려·기술자; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C09-S04 |
| NPC-C09-8db71c5 | character-set | 백제 전령; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C09-S05 |
| BG-646c0a9f9d | background | 백제 / 황산벌 후방 | NEEDS_PRODUCTION | THR-C09-S06 |
| NPC-C09-36a576c | character-set | 부상병·계백의 전령; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C09-S06 |
| BG-bd51c78d43 | background | 백제 / 사비 피란길 | NEEDS_PRODUCTION | THR-C09-S07 |
| NPC-C09-f46f175 | character-set | 도연의 후손; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C09-S07 |
| BG-dfb645fae6 | background | 백제 / 부흥군 거점 | NEEDS_PRODUCTION | THR-C09-S08 |
| NPC-C09-59b6690 | character-set | 복신·도침의 연락관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C09-S08 |
| BG-9a35eaceb9 | background | 백제 / 백강 후방 나루 | NEEDS_PRODUCTION | THR-C09-S09 |
| NPC-C09-84a4d6e | character-set | 피란 가족; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C09-S09 |
| BG-c533e7a11b | background | 백제 / 바닷가·기록책 전환 | NEEDS_PRODUCTION | THR-C09-S10 |
| NPC-C09-20c0f48 | character-set | 피란 가족의 기록; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C09-S10 |
| BG-29e2da07d9 | background | 신라 / 서라벌 시장 | NEEDS_PRODUCTION | THR-C10-S01 |
| NPC-C10-82e1587 | character-set | 장터 주민 미솔; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C10-S01 |
| BG-8b323133bb | background | 신라 / 왕실 공방 | NEEDS_PRODUCTION | THR-C10-S02 |
| NPC-C10-82720d5 | character-set | 금속 장인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C10-S02 |
| BG-0cb0ee227f | background | 신라 / 돌무지덧널무덤 축조터 | NEEDS_PRODUCTION | THR-C10-S03 |
| NPC-C10-19f4ff0 | character-set | 인부 다함; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C10-S03 |
| BG-1f78e1bc41 | background | 신라 / 귀족 가옥 문 앞 | NEEDS_PRODUCTION | THR-C10-S04 |
| NPC-C10-4d5d6ec | character-set | 6두품 청년 가람; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C10-S04 |
| BG-211bfc6779 | background | 신라 / 화백회의 외부 | NEEDS_PRODUCTION | THR-C10-S05 |
| NPC-C10-52fdc19 | character-set | 귀족 연락관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C10-S05 |
| BG-0354dbfb2a | background | 신라 / 서라벌 교역장 | NEEDS_PRODUCTION | THR-C10-S06 |
| NPC-C10-2320f60 | character-set | 신라 상인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C10-S06 |
| BG-8cff65cf94 | background | 신라 / 신라 사절 숙소 | NEEDS_PRODUCTION | THR-C10-S07 |
| NPC-C10-19db818 | character-set | 눌지왕의 사신; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C10-S07 |
| BG-cd8894718e | background | 신라 / 왕실 기록·시간 전환 | NEEDS_PRODUCTION | THR-C10-S08 |
| NPC-C10-b1116b8 | character-set | 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C10-S08 |
| BG-8cc66c6199 | background | 신라 / 신라 농경 마을 | NEEDS_PRODUCTION | THR-C11-S01 |
| NPC-C11-5c24feb | character-set | 농민 보리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C11-S01 |
| BG-f0696d4e3f | background | 신라 / 서라벌 관청 | NEEDS_PRODUCTION | THR-C11-S02 |
| NPC-C11-09c3568 | character-set | 지증왕의 서리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C11-S02 |
| BG-991021402b | background | 신라 / 동해 출항지 | NEEDS_PRODUCTION | THR-C11-S03 |
| NPC-C11-70911d1 | character-set | 이사부의 전령; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C11-S03 |
| BG-94dc2c888d | background | 신라 / 법 집행 관청 | NEEDS_PRODUCTION | THR-C11-S04 |
| NPC-C11-e32a15f | character-set | 율령 담당관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C11-S04 |
| BG-0eaacc7fc9 | background | 신라 / 서라벌 천경림 주변 | NEEDS_PRODUCTION | THR-C11-S05 |
| NPC-C11-ff9b1b5 | character-set | 신앙을 지키는 주민; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C11-S05 |
| BG-38904a9df1 | background | 신라 / 처형 소식이 전해진 거리 | NEEDS_PRODUCTION | THR-C11-S06 |
| NPC-C11-241c368 | character-set | 이차돈의 지인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C11-S06 |
| BG-3d6bacbcf7 | background | 신라 / 신라 관청 | NEEDS_PRODUCTION | THR-C11-S07 |
| NPC-C11-af215bc | character-set | 법흥왕; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C11-S07 |
| BG-0e2dfe94b2 | background | 신라 / 신라 편입 등록처 | NEEDS_PRODUCTION | THR-C11-S08 |
| NPC-C11-f5c69ed | character-set | 가야 가족 아라; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C11-S08 |
| BG-fe8c505bac | background | 신라 / 가야 왕족 정착지 | NEEDS_PRODUCTION | THR-C11-S09 |
| NPC-C11-ec9c17a | character-set | 가야계 청년; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C11-S09 |
| BG-9aacc6a2eb | background | 신라 / 신라 왕계·시간 전환 | NEEDS_PRODUCTION | THR-C11-S10 |
| NPC-C11-b1116b8 | character-set | 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C11-S10 |
| BG-a9e7dad446 | background | 신라 / 한강 전선 후방 | NEEDS_PRODUCTION | THR-C12-S01 |
| NPC-C12-09c6b9f | character-set | 신라 병사 하람; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C12-S01 |
| BG-306fe00bea | background | 신라 / 한강 나루 | NEEDS_PRODUCTION | THR-C12-S02 |
| NPC-C12-2ce3fd0 | character-set | 나루 주인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C12-S02 |
| BG-59f159e6b1 | background | 신라 / 한강 유역 관청 | NEEDS_PRODUCTION | THR-C12-S03 |
| NPC-C12-c29fba5 | character-set | 관리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C12-S03 |
| BG-17df4743ef | background | 신라 / 신라 장터 | NEEDS_PRODUCTION | THR-C12-S04 |
| NPC-C12-4466ef4 | character-set | 백제 출신 상인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C12-S04 |
| BG-34db4de8c0 | background | 신라 / 단양 적성 | NEEDS_PRODUCTION | THR-C12-S05 |
| NPC-C12-6d6e635 | character-set | 비문을 새기는 서리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C12-S05 |
| BG-c8fc641856 | background | 신라 / 창녕·북한산·황초령·마운령 비교 공간 | NEEDS_PRODUCTION | THR-C12-S06 |
| NPC-C12-b1116b8 | character-set | 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C12-S06, THR-C12-S10 |
| BG-c31817369f | background | 신라 / 신라 산길 | NEEDS_PRODUCTION | THR-C12-S07 |
| NPC-C12-52c0054 | character-set | 화랑 청년; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C12-S07 |
| BG-604801f634 | background | 신라 / 대가야 병합 뒤 길 | NEEDS_PRODUCTION | THR-C12-S08 |
| NPC-C12-d99292b | character-set | 가야 피란민; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C12-S08 |
| BG-68edbe646e | background | 신라 / 편입 지역 장터 | NEEDS_PRODUCTION | THR-C12-S09 |
| NPC-C12-843e6c1 | character-set | 신라 관리·가야 장인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C12-S09 |
| BG-921584f83f | background | 신라 / 서라벌·시간 전환 | NEEDS_PRODUCTION | THR-C12-S10 |
| BG-ceb0970a16 | background | 신라 / 분황사 주변 | NEEDS_PRODUCTION | THR-C13-S01 |
| NPC-C13-c384ff8 | character-set | 선덕여왕의 서리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C13-S01 |
| BG-1df32074a1 | background | 신라 / 첨성대 주변 | NEEDS_PRODUCTION | THR-C13-S02 |
| NPC-C13-09a4896 | character-set | 관측 보조; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C13-S02 |
| BG-a1b4ae9f07 | background | 신라 / 황룡사 목탑 공사터 | NEEDS_PRODUCTION | THR-C13-S03 |
| NPC-C13-31f64b8 | character-set | 자장·백제 장인 관련 기록; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C13-S03 |
| BG-ec43d9a871 | background | 신라 / 대당 사절 출항지 | NEEDS_PRODUCTION | THR-C13-S04 |
| NPC-C13-c2726f9 | character-set | 김춘추; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C13-S04 |
| BG-9ba07482c9 | background | 신라 / 서라벌 집사부 | NEEDS_PRODUCTION | THR-C13-S05 |
| NPC-C13-9999a21 | character-set | 행정 서리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C13-S05 |
| BG-c255b1448b | background | 신라 / 신라 왕실 기록 공간 | NEEDS_PRODUCTION | THR-C13-S06 |
| NPC-C13-0b87a3a | character-set | 김유신; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C13-S06 |
| BG-6be6f48e86 | background | 신라 / 덕물도 연결 군영 | NEEDS_PRODUCTION | THR-C13-S07 |
| NPC-C13-6dbc9a3 | character-set | 신라 수군; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C13-S07, THR-C13-S11 |
| BG-4715c09621 | background | 신라 / 고구려 멸망 뒤 행정 거점 | NEEDS_PRODUCTION | THR-C13-S08 |
| NPC-C13-01ac619 | character-set | 고구려 유민; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C13-S08 |
| BG-b7401781be | background | 신라 / 보덕국 관련 거점 | NEEDS_PRODUCTION | THR-C13-S09 |
| NPC-C13-732509d | character-set | 고구려 유민 연락관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C13-S09 |
| BG-00b2806926 | background | 신라 / 매소성 후방 | NEEDS_PRODUCTION | THR-C13-S10 |
| NPC-C13-873aa7a | character-set | 신라 보급병; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C13-S10 |
| BG-e2df755b55 | background | 신라 / 기벌포 | NEEDS_PRODUCTION | THR-C13-S11 |
| BG-270ca4cd26 | background | 신라 / 전쟁 뒤 피란 거처·시간 전환 | NEEDS_PRODUCTION | THR-C13-S12 |
| NPC-C13-5a9917e | character-set | 유민 가족; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C13-S12 |
| BG-30e08a3d79 | background | 가야 / 금관가야 항구 | NEEDS_PRODUCTION | THR-C14-S01 |
| NPC-C14-41277f5 | character-set | 상인 아라1; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C14-S01, THR-C14-S04 |
| BG-45df8986b8 | background | 가야 / 연맹 교역 회합 | NEEDS_PRODUCTION | THR-C14-S02 |
| NPC-C14-898a446 | character-set | 연맹 연락관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C14-S02 |
| BG-8503e7c719 | background | 가야 / 금관가야 제철소 | NEEDS_PRODUCTION | THR-C14-S03 |
| NPC-C14-c1a9f7b | character-set | 장인 해들; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C14-S03, THR-C14-S05 |
| BG-1bc6491ae2 | background | 가야 / 철 교역장 | NEEDS_PRODUCTION | THR-C14-S04 |
| BG-6e8b723668 | background | 가야 / 철제 농기구 공방 | NEEDS_PRODUCTION | THR-C14-S05 |
| BG-220b45c900 | background | 가야 / 가야 출항 나루 | NEEDS_PRODUCTION | THR-C14-S06 |
| NPC-C14-2dc7aa1 | character-set | 왜의 교역 상대; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C14-S06 |
| BG-a1065144df | background | 가야 / 무기·갑옷 공방 | NEEDS_PRODUCTION | THR-C14-S07 |
| NPC-C14-c1d6f7d | character-set | 갑옷 장인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C14-S07 |
| BG-ac349c18c1 | background | 가야 / 금관가야 교역항 | NEEDS_PRODUCTION | THR-C14-S08 |
| NPC-C14-cf12455 | character-set | 아라1의 후손; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C14-S08 |
| BG-003bb444b3 | background | 가야 / 대가야 교역로 | NEEDS_PRODUCTION | THR-C15-S01 |
| NPC-C15-4579521 | character-set | 상인 아라2; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C15-S01 |
| BG-dacf03a564 | background | 가야 / 대가야 외교 회합 | NEEDS_PRODUCTION | THR-C15-S02 |
| NPC-C15-898a446 | character-set | 연맹 연락관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C15-S02 |
| BG-27f46d4dae | background | 가야 / 토기 가마 | NEEDS_PRODUCTION | THR-C15-S03 |
| NPC-C15-0a0d7a1 | character-set | 도공; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C15-S03 |
| BG-dc44c42893 | background | 가야 / 지산동 고분군 관련 관찰 공간 | NEEDS_PRODUCTION | THR-C15-S04 |
| NPC-C15-88403d9 | character-set | 장례 장인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C15-S04 |
| BG-572d58e609 | background | 가야 / 악기 공방 | NEEDS_PRODUCTION | THR-C15-S05 |
| NPC-C15-3124441 | character-set | 우륵; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C15-S05 |
| BG-52406b6c96 | background | 가야 / 금관가야 항복 기록 공간 | NEEDS_PRODUCTION | THR-C15-S06 |
| NPC-C15-b1116b8 | character-set | 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C15-S06 |
| BG-1b051defcf | background | 가야 / 대가야 후방 피란길 | NEEDS_PRODUCTION | THR-C15-S07 |
| NPC-C15-e700dc7 | character-set | 가야 가족 아라2; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C15-S07 |
| BG-d25b4aa214 | background | 가야 / 가야 음악의 전승·시간 전환 | NEEDS_PRODUCTION | THR-C15-S08 |
| NPC-C15-bdd151f | character-set | 아라2의 기록; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C15-S08 |
| BG-3305d37b92 | background | 통일신라 / 서라벌 거리 | NEEDS_PRODUCTION | THR-C16-S01 |
| NPC-C16-8b23c6c | character-set | 왕실 연락관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C16-S01 |
| BG-294bf51030 | background | 통일신라 / 신문왕 집무처 | NEEDS_PRODUCTION | THR-C16-S02 |
| NPC-C16-51a9148 | character-set | 신문왕; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C16-S02 |
| BG-cfc61f913c | background | 통일신라 / 국학 | NEEDS_PRODUCTION | THR-C16-S03 |
| NPC-C16-33994b9 | character-set | 학생 수인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C16-S03 |
| BG-8a5466f52a | background | 통일신라 / 지방 행정실 | NEEDS_PRODUCTION | THR-C16-S04 |
| NPC-C16-70cb29c | character-set | 지방 서리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C16-S04, THR-C16-S10 |
| BG-272a558ddc | background | 통일신라 / 소경 이주 거점 | NEEDS_PRODUCTION | THR-C16-S05 |
| NPC-C16-bb2abd3 | character-set | 이주민 온유; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C16-S05 |
| BG-05fdf9587d | background | 통일신라 / 9서당 편성 거점 | NEEDS_PRODUCTION | THR-C16-S06 |
| NPC-C16-fe06027 | character-set | 가야계·고구려계 군인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C16-S06 |
| BG-17d13c3249 | background | 통일신라 / 토지 장부실 | NEEDS_PRODUCTION | THR-C16-S07 |
| NPC-C16-b917d33 | character-set | 관리·농민; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C16-S07 |
| BG-a2bd04fd89 | background | 통일신라 / 녹읍 장부 이관처 | NEEDS_PRODUCTION | THR-C16-S08 |
| NPC-C16-53f294b | character-set | 귀족 대리인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C16-S08 |
| BG-192a348bed | background | 통일신라 / 성덕왕대 농촌 | NEEDS_PRODUCTION | THR-C16-S09 |
| NPC-C16-199b982 | character-set | 농민 온유의 후손; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C16-S09 |
| BG-bbeeadc2b7 | background | 통일신라 / 경덕왕대 관청·시간 전환 | NEEDS_PRODUCTION | THR-C16-S10 |
| BG-98b800a9e0 | background | 통일신라 / 마을 설법터 | NEEDS_PRODUCTION | THR-C17-S01 |
| NPC-C17-40bd5a8 | character-set | 원효; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C17-S01 |
| BG-1feff7d7bf | background | 통일신라 / 신라 마을 | NEEDS_PRODUCTION | THR-C17-S02 |
| NPC-C17-e5212f2 | character-set | 원효·마을 주민; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C17-S02 |
| BG-31f04e3a92 | background | 통일신라 / 부석사 관련 현장 | NEEDS_PRODUCTION | THR-C17-S03 |
| NPC-C17-3cfe280 | character-set | 의상·제자; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C17-S03 |
| BG-f6f267cfe1 | background | 통일신라 / 불국사 조성 현장 | NEEDS_PRODUCTION | THR-C17-S04 |
| NPC-C17-9b221c2 | character-set | 석공 해명; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C17-S04, THR-C17-S05 |
| BG-c5ebc2f8a2 | background | 통일신라 / 불국사 탑 조성 기록 | NEEDS_PRODUCTION | THR-C17-S05 |
| BG-5abe7e00bc | background | 통일신라 / 석굴암 조성 관련 현장 | NEEDS_PRODUCTION | THR-C17-S06 |
| NPC-C17-f954a2c | character-set | 조각 장인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C17-S06 |
| BG-c3dc83d281 | background | 통일신라 / 당의 여행 기록 공간 | NEEDS_PRODUCTION | THR-C17-S07 |
| NPC-C17-f6169e3 | character-set | 혜초의 기록·필사자; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C17-S07 |
| BG-83a4396b28 | background | 통일신라 / 성덕대왕신종 관찰 공간 | NEEDS_PRODUCTION | THR-C17-S08 |
| NPC-C17-8376e93 | character-set | 주조 장인 기록; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C17-S08 |
| BG-be7396c2b8 | background | 통일신라 / 사찰의 교류 지도·시간 전환 | NEEDS_PRODUCTION | THR-C17-S09 |
| NPC-C17-00f2fb6 | character-set | 필사자; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C17-S09 |
| BG-c4e076266f | background | 통일신라 / 완도 해안 | NEEDS_PRODUCTION | THR-C18-S01 |
| NPC-C18-bc2a50b | character-set | 상인 나래; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C18-S01, THR-C18-S04 |
| BG-5f0d452ba5 | background | 통일신라 / 신라 조정 관련 기록 | NEEDS_PRODUCTION | THR-C18-S02 |
| NPC-C18-246eccf | character-set | 장보고; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C18-S02 |
| BG-f01744239e | background | 통일신라 / 청해진 창고 | NEEDS_PRODUCTION | THR-C18-S03 |
| NPC-C18-5c4988c | character-set | 통역 상인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C18-S03 |
| BG-6f02a1fa14 | background | 통일신라 / 청해진 출항 나루 | NEEDS_PRODUCTION | THR-C18-S04 |
| BG-949ddf6ca4 | background | 통일신라 / 청해진 연락소 | NEEDS_PRODUCTION | THR-C18-S05 |
| NPC-C18-301a1ae | character-set | 장보고의 연락관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C18-S05 |
| BG-b6a715b08c | background | 통일신라 / 장보고 사망 기록 공간 | NEEDS_PRODUCTION | THR-C18-S06 |
| NPC-C18-00f2fb6 | character-set | 필사자; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C18-S06 |
| BG-fa821dc2c5 | background | 통일신라 / 청해진 폐지·이주 출발지 | NEEDS_PRODUCTION | THR-C18-S07 |
| NPC-C18-9a462c2 | character-set | 나래의 가족; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C18-S07 |
| BG-84cb2f5354 | background | 통일신라 / 해상 세력 지도·시간 전환 | NEEDS_PRODUCTION | THR-C18-S08 |
| NPC-C18-b1116b8 | character-set | 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C18-S08 |
| BG-4dfce3323d | background | 통일신라 / 웅천주 관련 거점 | NEEDS_PRODUCTION | THR-C19-S01 |
| NPC-C19-70cb29c | character-set | 지방 서리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C19-S01 |
| BG-25896d5f3c | background | 통일신라 / 6두품 학자의 집 | NEEDS_PRODUCTION | THR-C19-S02 |
| NPC-C19-3f9fb17 | character-set | 학자 재인; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C19-S02 |
| BG-2714125545 | background | 통일신라 / 호족의 지방 성 | NEEDS_PRODUCTION | THR-C19-S03 |
| NPC-C19-30572d7 | character-set | 성주 연락관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C19-S03 |
| BG-66b669aa43 | background | 통일신라 / 선종 산문 | NEEDS_PRODUCTION | THR-C19-S04 |
| NPC-C19-d9df471 | character-set | 승려; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C19-S04 |
| BG-aa43ec60ef | background | 통일신라 / 지방 산길 | NEEDS_PRODUCTION | THR-C19-S05 |
| NPC-C19-a8231c8 | character-set | 풍수에 밝은 승려; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C19-S05 |
| BG-a2206df32a | background | 통일신라 / 상주 지역 농촌 | NEEDS_PRODUCTION | THR-C19-S06 |
| NPC-C19-f9d7965 | character-set | 농민 지우; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C19-S06 |
| BG-5e5ae1693f | background | 통일신라 / 사벌주 봉기 주변 | NEEDS_PRODUCTION | THR-C19-S07 |
| NPC-C19-77a3eeb | character-set | 원종·애노 관련 주민; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C19-S07 |
| BG-4140e1e4d3 | background | 통일신라 / 최치원의 개혁 건의 기록 | NEEDS_PRODUCTION | THR-C19-S08 |
| NPC-C19-2c3341b | character-set | 최치원; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C19-S08 |
| BG-0ff63372c7 | background | 통일신라 / 호족 세력 지도·시간 전환 | NEEDS_PRODUCTION | THR-C19-S09 |
| NPC-C19-b1116b8 | character-set | 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C19-S09 |
| BG-a773b089a9 | background | 발해 / 영주 탈출·동쪽 길 | NEEDS_PRODUCTION | THR-C20-S01 |
| NPC-C20-65a8468 | character-set | 유민 해루; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C20-S01 |
| BG-08a9896f17 | background | 발해 / 유민 야영지 | NEEDS_PRODUCTION | THR-C20-S02 |
| NPC-C20-5971343 | character-set | 말갈 출신 동료 누리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C20-S02 |
| BG-7bbf5ff8f2 | background | 발해 / 전투 후방 | NEEDS_PRODUCTION | THR-C20-S03 |
| NPC-C20-ab0d574 | character-set | 대조영의 전령; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C20-S03 |
| BG-8868d51c7d | background | 발해 / 동모산 일대 | NEEDS_PRODUCTION | THR-C20-S04 |
| NPC-C20-1d7b830 | character-set | 대조영; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C20-S04 |
| BG-184d0d5e43 | background | 발해 / 발해 초기 기록처 | NEEDS_PRODUCTION | THR-C20-S05 |
| NPC-C20-6cc86cc | character-set | 서리 해루; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C20-S05 |
| BG-1c4fa8e7b7 | background | 발해 / 초기 발해 마을 | NEEDS_PRODUCTION | THR-C20-S06 |
| NPC-C20-10b9755 | character-set | 도공 누리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C20-S06 |
| BG-b07ca62f63 | background | 발해 / 사절 접견처 | NEEDS_PRODUCTION | THR-C20-S07 |
| NPC-C20-828bb53 | character-set | 발해 사신; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C20-S07 |
| BG-fa7739b44a | background | 발해 / 왕계·시간 전환 | NEEDS_PRODUCTION | THR-C20-S08, THR-C21-S10 |
| NPC-C20-b1116b8 | character-set | 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C20-S08 |
| BG-f7c101d051 | background | 발해 / 발해 왕실 연락처 | NEEDS_PRODUCTION | THR-C21-S01 |
| NPC-C21-9a512f9 | character-set | 대문예 관련 연락관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C21-S01 |
| BG-f0972e429e | background | 발해 / 발해 출항지 | NEEDS_PRODUCTION | THR-C21-S02 |
| NPC-C21-7f1c6c4 | character-set | 장문휴의 부하; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C21-S02 |
| BG-e5e6377ea2 | background | 발해 / 문왕대 사절 숙소 | NEEDS_PRODUCTION | THR-C21-S03 |
| NPC-C21-828bb53 | character-set | 발해 사신; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C21-S03 |
| BG-b81f115c78 | background | 발해 / 정당성 관련 관청 | NEEDS_PRODUCTION | THR-C21-S04 |
| NPC-C21-c29fba5 | character-set | 관리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C21-S04 |
| BG-be72fd0be0 | background | 발해 / 상경 용천부 | NEEDS_PRODUCTION | THR-C21-S05 |
| NPC-C21-23fab0e | character-set | 이주민 해루의 후손; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C21-S05 |
| BG-7e93aaa7eb | background | 발해 / 선왕대 지도실 | NEEDS_PRODUCTION | THR-C21-S06 |
| NPC-C21-242f09e | character-set | 발해 장교; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C21-S06 |
| BG-2ac664352f | background | 발해 / 지방 행정·역참 | NEEDS_PRODUCTION | THR-C21-S07 |
| NPC-C21-62f901a | character-set | 역참 관리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C21-S07 |
| BG-eb93595c75 | background | 발해 / 정혜·정효공주묘 자료 공간 | NEEDS_PRODUCTION | THR-C21-S08 |
| NPC-C21-cc2ccd6 | character-set | 묘지 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C21-S08 |
| BG-2e5a03773a | background | 발해 / 발해 가옥·사찰 기록 | NEEDS_PRODUCTION | THR-C21-S09 |
| NPC-C21-54f8897 | character-set | 주민 누리의 후손; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C21-S09 |
| NPC-C21-b1116b8 | character-set | 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C21-S10 |
| BG-2dc4ced86a | background | 발해 / 발해 국경 마을 | NEEDS_PRODUCTION | THR-C22-S01 |
| NPC-C22-41ff692 | character-set | 전령; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C22-S01 |
| BG-43d25899c5 | background | 발해 / 상경 피란길 | NEEDS_PRODUCTION | THR-C22-S02 |
| NPC-C22-085015e | character-set | 주민 은서; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C22-S02 |
| BG-da6059417c | background | 발해 / 멸망 원인 자료 공간 | NEEDS_PRODUCTION | THR-C22-S03 |
| NPC-C22-b1116b8 | character-set | 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C22-S03, THR-C22-S07 |
| BG-1f5ffe060c | background | 발해 / 유민 이동로 | NEEDS_PRODUCTION | THR-C22-S04 |
| NPC-C22-70b8af2 | character-set | 유민 안내자; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C22-S04 |
| BG-61cf972bf0 | background | 발해 / 고려 귀부 행렬 | NEEDS_PRODUCTION | THR-C22-S05 |
| NPC-C22-2234311 | character-set | 대광현 관련 연락관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C22-S05 |
| BG-d76abf60f2 | background | 발해 / 고려의 유민 접수처 | NEEDS_PRODUCTION | THR-C22-S06 |
| NPC-C22-52ebc8b | character-set | 유민 은서의 기록·후대 가족; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C22-S06 |
| BG-20827ace42 | background | 발해 / 유민 기록 모임 | NEEDS_PRODUCTION | THR-C22-S07 |
| BG-746b6429b6 | background | 발해 / 시간 이동 기록 공간 | NEEDS_PRODUCTION | THR-C22-S08 |
| NPC-C22-ee5fec6 | character-set | 서아의 독백; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C22-S08 |
| BG-91af0664b5 | background | 후삼국 / 완산주 | NEEDS_PRODUCTION | THR-C23-S01 |
| NPC-C23-7dbaef0 | character-set | 견훤의 연락관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C23-S01 |
| BG-bb3266bfe9 | background | 후삼국 / 완산주 장터 | NEEDS_PRODUCTION | THR-C23-S02 |
| NPC-C23-55a02f2 | character-set | 상인 시온; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C23-S02, THR-C23-S09 |
| BG-3860cb2142 | background | 후삼국 / 송악 군영 | NEEDS_PRODUCTION | THR-C23-S03 |
| NPC-C23-faf0a66 | character-set | 왕건의 부하; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C23-S03 |
| BG-2d29adbe5b | background | 후삼국 / 국호 변경 기록 공간 | NEEDS_PRODUCTION | THR-C23-S04 |
| NPC-C23-45f76cf | character-set | 태봉 서리; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C23-S04 |
| BG-4875fd5126 | background | 후삼국 / 철원 공사장 | NEEDS_PRODUCTION | THR-C23-S05 |
| NPC-C23-2c92d47 | character-set | 인부 시온의 친척; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C23-S05 |
| BG-10c10599ae | background | 후삼국 / 태봉 거리 | NEEDS_PRODUCTION | THR-C23-S06 |
| NPC-C23-ab78281 | character-set | 불교 신자; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C23-S06 |
| BG-4d3e7f9b59 | background | 후삼국 / 철원 정변 뒤 연락소 | NEEDS_PRODUCTION | THR-C23-S07 |
| NPC-C23-621e113 | character-set | 왕건·장수 연락관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C23-S07 |
| BG-df71c40459 | background | 후삼국 / 고려 건국 뒤 서신 공간 | NEEDS_PRODUCTION | THR-C23-S08 |
| NPC-C23-b1116b8 | character-set | 기록관; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C23-S08 |
| BG-07e0ebe07d | background | 후삼국 / 송악 이주로 | NEEDS_PRODUCTION | THR-C23-S09 |
| BG-ef117cab32 | background | 후삼국 / 송악 나루·기록책 마감 | NEEDS_PRODUCTION | THR-C23-S10 |
| NPC-C23-ee5fec6 | character-set | 서아의 독백; 기본·웃음·놀람 3표정. 장별 신체·복식·연령 고정 | NEEDS_PRODUCTION | THR-C23-S10 |
| territory-map-1 | territory-map | 고구려 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| genealogy-diagram-1 | genealogy-diagram | 고구려 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| heritage-sheet-1 | heritage-sheet | 고구려 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| source-record-sheet-1 | source-record-sheet | 고구려 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| territory-map-2 | territory-map | 백제 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| genealogy-diagram-2 | genealogy-diagram | 백제 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| heritage-sheet-2 | heritage-sheet | 백제 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| source-record-sheet-2 | source-record-sheet | 백제 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| territory-map-3 | territory-map | 신라 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| genealogy-diagram-3 | genealogy-diagram | 신라 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| heritage-sheet-3 | heritage-sheet | 신라 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| source-record-sheet-3 | source-record-sheet | 신라 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| territory-map-4 | territory-map | 가야 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| genealogy-diagram-4 | genealogy-diagram | 가야 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| heritage-sheet-4 | heritage-sheet | 가야 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| source-record-sheet-4 | source-record-sheet | 가야 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| territory-map-5 | territory-map | 통일신라 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| genealogy-diagram-5 | genealogy-diagram | 통일신라 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| heritage-sheet-5 | heritage-sheet | 통일신라 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| source-record-sheet-5 | source-record-sheet | 통일신라 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| territory-map-6 | territory-map | 발해 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| genealogy-diagram-6 | genealogy-diagram | 발해 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| heritage-sheet-6 | heritage-sheet | 발해 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| source-record-sheet-6 | source-record-sheet | 발해 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| territory-map-7 | territory-map | 후삼국 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| genealogy-diagram-7 | genealogy-diagram | 후삼국 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| heritage-sheet-7 | heritage-sheet | 후삼국 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |
| source-record-sheet-7 | source-record-sheet | 후삼국 학습 도판; 출처·촬영권 확인 후 제작 | NEEDS_PRODUCTION | 왕·사건 선택 학습 패널 |

## 재사용 검토·납품 기준

기존 `three-border-market.jpg` 등 JPG와 SVG는 파일 존재만으로 적합 판정하지 않았다. 건축·시기·화풍·도형 배경 여부를 검수하기 전에는 신규 씬에 확정 연결하지 않는다. 역사적 지도는 현대 국경을 그대로 투영하지 않고 시점·불확실 경계를 표시한다. 문화유산은 제작 당시와 현대 발굴 모습을 구별하며 가짜 문자·간판을 생성하지 않는다.

배경 주요 행동은 모바일 중앙 안전영역에 둔다. PC/모바일에서 캐릭터 오른쪽·왼쪽 고정, 발화 상대 흐림, NPC 교체, 투명 가장자리·경로 대소문자·네트워크 오류를 검수한다. 기출 이미지와 사료 사진은 출처·이용조건 확인 기록을 남긴다. 3D·실사·상이한 화풍은 승인하지 않는다.
