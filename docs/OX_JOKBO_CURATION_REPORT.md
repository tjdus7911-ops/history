# OX 족보 기반 큐레이션 이행 보고서

## 결과 요약

기존 810문항을 전수 분류해 297문항을 그대로 유지하고, 판단 의미와 정답을 보존한 채 해설·시대 태그·핵심 항목 연결·검증 근거를 바로잡은 9문항을 수정했으며, 504문항을 퇴역 처리했다. 원자료의 중요한 공백 20개는 기존 최대번호 뒤의 새 ID로 추가했다. 기존 ID의 판단 의미나 정답을 바꾼 문항은 0개이다.

| 시대 | 기존 검수 | 유지 | 수정 | 신규 | 활성 | 퇴역 ID |
|---|---:|---:|---:|---:|---:|---:|
| 선사·고조선·초기 국가 | 100 | 59 | 2 | 4 | 65 | 39 |
| 삼국·남북국·후삼국 | 120 | 81 | 2 | 0 | 83 | 37 |
| 고려 | 120 | 33 | 3 | 0 | 36 | 84 |
| 조선 | 150 | 52 | 0 | 5 | 57 | 98 |
| 개항기·대한 제국 | 100 | 35 | 2 | 4 | 41 | 63 |
| 일제 강점기 | 120 | 25 | 0 | 5 | 30 | 95 |
| 광복 이후 | 100 | 12 | 0 | 2 | 14 | 88 |

## 원자료와 사용 범위

- 삼국·남북국: `genealogy-01.png`~`03.png` 원본 3장과 `complete-manuscript.md` 부록 A의 89개 직접 전사 묶음.
- 부여·고구려·옥저·동예·삼한: `눈떠보니원삼국_83씬_족보_기출배치표.xlsx` `족보반영!A6:H37`. 사진 직접 표기 22개와 공신력 보충 9개를 구분했다.
- 선사부터 현대까지의 보충 범위: `primary-reference.txt` 핵심 주제와 `cue-facts.txt` topic 1~111. 문항은 전사 목록을 출발점으로 삼되 역사적으로 명확한 판단만 남겼다.
- 확인 불가: 요약노트 PDF와 원본 암기 스크린샷은 저장소와 현재 첨부에 없다. `raw-source.txt`도 22쪽 중 1~17쪽까지만 있어, 없는 부분을 추측해 복원하지 않았다.

## 핵심 학습 항목

| coreId | 시대 | 주제 | 핵심 사실 | 원자료 |
|---|---|---|---|---|
| ox-core-prehistoric-paleolithic-life | 선사·고조선·초기 국가 | 구석기의 이동 생활과 사냥·채집 | 동굴과 강가의 막집 생활 / 뗀석기를 이용한 사냥·채집 | dist/assets/ancient/three-complete/source-photos/genealogy-01.png<br>docs/mnemonic-sources/primary-reference.txt#A004 |
| ox-core-prehistoric-a004-early-sites | 선사·고조선·초기 국가 | 구석기 전기 유적 | 연천 전곡리의 아슐리안형 주먹도끼 / 공주 석장리는 구석기 유적 | docs/mnemonic-sources/primary-reference.txt#A004<br>docs/mnemonic-sources/cue-facts.txt#topic-4<br>dist/assets/ancient/three-complete/source-photos/genealogy-01.png |
| ox-core-prehistoric-a005-middle-sites | 선사·고조선·초기 국가 | 구석기 중기 유적 | 덕천 승리산 동굴의 구석기 인골 | docs/mnemonic-sources/primary-reference.txt#A005<br>docs/mnemonic-sources/cue-facts.txt#topic-5<br>우리역사넷 `nh_002_0020_0020_0010_0020_0020` |
| ox-core-prehistoric-a006-late-tools | 선사·고조선·초기 국가 | 구석기 후기의 결합식 도구 | 슴베찌르개를 자루에 끼워 사용 | docs/mnemonic-sources/primary-reference.txt#A006<br>docs/mnemonic-sources/cue-facts.txt#topic-6 |
| ox-core-prehistoric-neolithic-transition | 선사·고조선·초기 국가 | 신석기의 농경·정착·의생활 | 농경과 목축의 시작 / 가락바퀴와 뼈바늘을 이용한 직조 | docs/mnemonic-sources/primary-reference.txt#A007<br>docs/mnemonic-sources/cue-facts.txt#topic-7<br>docs/mnemonic-sources/primary-reference.txt#A009<br>docs/mnemonic-sources/cue-facts.txt#topic-9 |
| ox-core-prehistoric-a007-neolithic-sites | 선사·고조선·초기 국가 | 신석기 대표 유적 | 서울 암사동과 제주 고산리는 신석기 유적 / 부산 동삼동 패총은 식생활과 교류를 보여 줌 | docs/mnemonic-sources/primary-reference.txt#A007<br>docs/mnemonic-sources/cue-facts.txt#topic-7 |
| ox-core-prehistoric-a008-a009-neolithic-food-pottery | 선사·고조선·초기 국가 | 신석기 토기와 초기 농경 | 빗살무늬 토기 / 조·피·수수 등 잡곡 재배 | docs/mnemonic-sources/primary-reference.txt#A008<br>docs/mnemonic-sources/cue-facts.txt#topic-8<br>docs/mnemonic-sources/primary-reference.txt#A009<br>docs/mnemonic-sources/cue-facts.txt#topic-9 |
| ox-core-prehistoric-a010-bronze-rice | 선사·고조선·초기 국가 | 청동기 농경과 반달 돌칼 | 벼농사의 발달 / 반달 돌칼은 이삭을 거두는 농기구 | docs/mnemonic-sources/primary-reference.txt#A010<br>docs/mnemonic-sources/cue-facts.txt#topic-10 |
| ox-core-prehistoric-bronze-society | 선사·고조선·초기 국가 | 청동기 계급 사회와 무덤 | 고인돌과 돌널무덤 / 사유 재산과 계급의 발생 | dist/assets/ancient/three-complete/source-photos/genealogy-01.png<br>docs/mnemonic-sources/primary-reference.txt#A010 |
| ox-core-prehistoric-a011-bronze-pottery | 선사·고조선·초기 국가 | 청동기 토기와 송국리 유적 | 민무늬 토기 / 부여 송국리는 청동기 농경 유적 | docs/mnemonic-sources/primary-reference.txt#A011<br>docs/mnemonic-sources/cue-facts.txt#topic-11 |
| ox-core-prehistoric-a012-iron-culture | 선사·고조선·초기 국가 | 철기 시대의 토기와 교류 | 덧띠 토기와 검은 간토기 / 명도전·오수전이 보여 주는 대외 교류 | docs/mnemonic-sources/primary-reference.txt#A012<br>docs/mnemonic-sources/cue-facts.txt#topic-12 |
| ox-core-prehistoric-a013-gojoseon-range | 선사·고조선·초기 국가 | 고조선의 문화 범위 | 비파형 동검·거친무늬 거울·미송리식 토기·북방식 고인돌 / 잔무늬 거울은 청동제 의기 | docs/mnemonic-sources/primary-reference.txt#A013<br>docs/mnemonic-sources/cue-facts.txt#topic-13<br>우리역사넷 `km_005_0060_0010_0020` |
| ox-core-prehistoric-gojoseon-state | 선사·고조선·초기 국가 | 고조선의 건국·위만 조선·멸망 | 단군왕검의 건국 이야기 / 위만의 준왕 축출과 왕검성 / 중계 무역 통제와 한 무제의 침공 | dist/assets/ancient/three-complete/source-photos/genealogy-01.png<br>docs/mnemonic-sources/primary-reference.txt#A014 |
| ox-core-prehistoric-a014-eight-laws | 선사·고조선·초기 국가 | 고조선의 8조법 | 상해에 곡식으로 배상 / 절도자를 노비로 삼고 속죄는 큰돈으로 허용 / 노동력과 사유 재산의 중시 | docs/mnemonic-sources/primary-reference.txt#A014<br>docs/mnemonic-sources/cue-facts.txt#topic-14 |
| ox-core-prehistoric-a015-festivals | 선사·고조선·초기 국가 | 초기 국가의 제천 행사 | 부여의 12월 영고 / 고구려의 10월 동맹 / 동예의 10월 무천 / 삼한의 5월·10월 계절제 | docs/mnemonic-sources/primary-reference.txt#A015<br>docs/mnemonic-sources/cue-facts.txt#topic-15<br>docs/proto-revision/눈떠보니원삼국_83씬_족보_기출배치표.xlsx#족보반영!A9:H36 |
| ox-core-prehistoric-proto-buyeo | 선사·고조선·초기 국가 | 부여의 정치·법·풍습 | 마가·우가·저가·구가의 사출도 / 1책12법 / 순장·형사취수제·우제점법 / 재해 때 왕에게 책임을 물음 | docs/proto-revision/눈떠보니원삼국_83씬_족보_기출배치표.xlsx#족보반영!A9:H15 |
| ox-core-prehistoric-proto-goguryeo | 선사·고조선·초기 국가 | 초기 고구려의 정치·경제·혼인 | 5부와 제가 회의 / 서옥제 / 부경 / 압록강 지류 동가강 유역에서 성장 | docs/proto-revision/눈떠보니원삼국_83씬_족보_기출배치표.xlsx#족보반영!A16:H21 |
| ox-core-prehistoric-proto-okjeo | 선사·고조선·초기 국가 | 옥저의 통치·혼인·장례 | 왕 없이 읍군·삼로가 통치 / 민며느리제 / 가족 공동 무덤 / 고구려에 소금·어물 공납 | docs/proto-revision/눈떠보니원삼국_83씬_족보_기출배치표.xlsx#족보반영!A22:H25 |
| ox-core-prehistoric-proto-dongye | 선사·고조선·초기 국가 | 동예의 사회·풍습·특산물 | 책화 / 족외혼 / 단궁·과하마·반어피 / 왕 없이 읍군·삼로가 통치 | docs/proto-revision/눈떠보니원삼국_83씬_족보_기출배치표.xlsx#족보반영!A26:H30 |
| ox-core-prehistoric-proto-samhan | 선사·고조선·초기 국가 | 삼한의 정치·제사·생업 | 신지·읍차 등의 군장 / 천군과 소도의 제정 분리 / 두레의 공동 노동 / 변한의 철 생산과 낙랑·왜 교역 | docs/proto-revision/눈떠보니원삼국_83씬_족보_기출배치표.xlsx#족보반영!A31:H37 |
| ox-core-kingdoms-goguryeo-state | 삼국·남북국·후삼국 | 고구려의 중앙 집권 체제 정비 | 고국천왕의 5부 개편과 진대법 / 미천왕의 낙랑군 축출 / 고국원왕 전사 / 소수림왕의 불교·태학·율령 | docs/three-content/complete-manuscript.md#appendix-a-P1G02-P1G05<br>dist/assets/ancient/three-complete/source-photos/genealogy-01.png |
| ox-core-kingdoms-goguryeo-expansion | 삼국·남북국·후삼국 | 광개토 대왕과 장수왕의 대외 확장 | 영락 연호와 신라 구원 / 광개토 대왕릉비는 장수왕이 건립 / 평양 천도와 남진 / 충주 고구려비 | docs/three-content/complete-manuscript.md#appendix-a-P1G06-P1G09<br>dist/assets/ancient/three-complete/source-photos/genealogy-01.png |
| ox-core-kingdoms-goguryeo-wars | 삼국·남북국·후삼국 | 고구려의 수·당 전쟁 | 을지문덕의 살수 대첩 / 연개소문의 정변 / 안시성 전투와 당 태종의 철수 | docs/three-content/complete-manuscript.md#appendix-a-P1G10-P1G12<br>dist/assets/ancient/three-complete/source-photos/genealogy-01.png |
| ox-core-kingdoms-goguryeo-culture | 삼국·남북국·후삼국 | 고구려 고분과 벽화 | 생활 풍속과 사후관을 보여 주는 고분 벽화 / 강서대묘의 사신도 | docs/three-content/complete-manuscript.md#appendix-a-P2G01-P2G03<br>dist/assets/ancient/three-complete/source-photos/genealogy-02.png |
| ox-core-kingdoms-baekje-state | 삼국·남북국·후삼국 | 백제의 중앙 집권과 전성기 | 고이왕의 체제 정비 / 근초고왕의 부자 상속과 대외 교류 / 칠지도와 왜의 교류 / 침류왕의 불교 수용 / 무령왕의 22담로 / 성왕의 22부·5방 | docs/three-content/complete-manuscript.md#appendix-a-P1B01-P1B06<br>docs/three-content/complete-manuscript.md#appendix-a-P1B07-P2B05<br>dist/assets/ancient/three-complete/source-photos/genealogy-01.png<br>dist/assets/ancient/three-complete/source-photos/genealogy-02.png |
| ox-core-kingdoms-baekje-fall-culture | 삼국·남북국·후삼국 | 백제의 웅진·사비 문화와 멸망 | 무령왕릉의 벽돌무덤과 지석 / 의자왕과 황산벌 전투 / 흑치상지·복신·도침의 부흥 운동 / 익산 미륵사 / 정림사지 오층 석탑 / 무령왕릉 금속 공예 | docs/three-content/complete-manuscript.md#appendix-a-P1B01-P1B06<br>docs/three-content/complete-manuscript.md#appendix-a-P1B07-P2B05<br>dist/assets/ancient/three-complete/source-photos/genealogy-01.png<br>dist/assets/ancient/three-complete/source-photos/genealogy-02.png |
| ox-core-kingdoms-silla-state | 삼국·남북국·후삼국 | 신라의 체제 정비와 한강 진출 | 내물마립간의 김씨 왕위 세습 / 지증왕의 국호·왕호·우산국 / 법흥왕의 율령·병부·불교 공인 / 진흥왕의 한강 진출과 대가야 정벌 | docs/three-content/complete-manuscript.md#appendix-a-P1S01-P1S04<br>dist/assets/ancient/three-complete/source-photos/genealogy-01.png |
| ox-core-kingdoms-silla-unification | 삼국·남북국·후삼국 | 나당 동맹과 신라의 삼국 통일 | 나당 동맹 / 황산벌 전투 / 매소성·기벌포 전투로 당군 축출 | docs/three-content/complete-manuscript.md#appendix-a-P1S05-P1S06<br>dist/assets/ancient/three-complete/source-photos/genealogy-01.png |
| ox-core-kingdoms-unified-silla-institutions | 삼국·남북국·후삼국 | 통일 신라의 정치·군사·지방 제도 | 상수리·외사정 / 국학과 독서삼품과 / 9주 5소경과 9서당 10정 / 민정 문서 / 골품제와 화백 회의 | docs/three-content/complete-manuscript.md#appendix-a-P3S01-P3S13<br>dist/assets/ancient/three-complete/source-photos/genealogy-03.png |
| ox-core-kingdoms-unified-silla-late | 삼국·남북국·후삼국 | 신라 하대의 호족·선종·농민 봉기 | 호족과 선종·풍수지리설의 성장 / 진성 여왕 때 원종과 애노의 난 / 진골 귀족의 왕위 다툼 | docs/three-content/complete-manuscript.md#appendix-a-P3S08-P3S11<br>dist/assets/ancient/three-complete/source-photos/genealogy-03.png |
| ox-core-kingdoms-unified-silla-trade | 삼국·남북국·후삼국 | 장보고와 통일 신라의 해상 교류 | 청해진을 중심으로 한 해상 무역 / 법화원과 신라방·신라소·신라원 | docs/three-content/complete-manuscript.md#appendix-a-P3S14-P3S16<br>dist/assets/ancient/three-complete/source-photos/genealogy-03.png |
| ox-core-kingdoms-unified-silla-culture | 삼국·남북국·후삼국 | 통일 신라의 불교·예술 문화 | 원효의 화쟁과 무애가 / 의상의 화엄 사상 / 혜초의 왕오천축국전 / 불국사 다보탑·석굴암·성덕대왕신종 | docs/three-content/complete-manuscript.md#appendix-a-P3C01-P3C09<br>dist/assets/ancient/three-complete/source-photos/genealogy-03.png |
| ox-core-kingdoms-balhae-kings | 삼국·남북국·후삼국 | 발해의 건국·전성·멸망 | 대조영의 동모산 건국 / 무왕의 인안과 대당 강경책 / 문왕의 대흥과 신라도 / 선왕의 해동성국 / 거란의 침입으로 멸망 | docs/three-content/complete-manuscript.md#appendix-a-P3B01-P3B05<br>dist/assets/ancient/three-complete/source-photos/genealogy-03.png |
| ox-core-kingdoms-balhae-government-culture | 삼국·남북국·후삼국 | 발해의 통치 제도·고분·상경 | 3성 6부와 정당성의 대내상 / 감찰 기구 중정대 / 정혜공주묘와 정효공주묘의 양식 차이 / 당 장안성을 본떠 조성한 상경성 | docs/three-content/complete-manuscript.md#appendix-a-P3B09-P3B15<br>dist/assets/ancient/three-complete/source-photos/genealogy-03.png |
| ox-core-kingdoms-later-three-foundation | 삼국·남북국·후삼국 | 후백제·후고구려·고려의 성립 | 견훤의 완산주 후백제 / 궁예의 국호 변경과 광평성 / 왕건의 고려 건국 | docs/three-content/complete-manuscript.md#appendix-a-P3L01-P3L03<br>dist/assets/ancient/three-complete/source-photos/genealogy-03.png |
| ox-core-kingdoms-later-three-unification | 삼국·남북국·후삼국 | 후삼국 통일 과정 | 공산 전투의 견훤 승리 / 신라 경순왕의 귀부 / 고창·일리천 전투와 936년 통일 | docs/three-content/complete-manuscript.md#appendix-a-P3L04-P3L06<br>dist/assets/ancient/three-complete/source-photos/genealogy-03.png |
| ox-core-kingdoms-gaya | 삼국·남북국·후삼국 | 가야 연맹의 성장과 철 문화 | 금관가야에서 대가야로 중심 이동 / 덩이쇠와 철제 갑옷 / 고령 지산동 고분군의 순장 / 김해 대성동 고분군 | docs/three-content/complete-manuscript.md#appendix-a-P1Y01-P2Y02<br>dist/assets/ancient/three-complete/source-photos/genealogy-01.png<br>dist/assets/ancient/three-complete/source-photos/genealogy-02.png |
| ox-core-goryeo-c001-unification | 고려 | 고려 건국과 태조의 통합 정책 | 918년 왕건의 고려 건국 / 서경 중시와 북진 / 발해 유민 포용 / 기인 제도와 흑창 | docs/mnemonic-sources/primary-reference.txt#C001<br>docs/mnemonic-sources/cue-facts.txt#topic-26<br>dist/assets/ancient/three-complete/source-photos/genealogy-03.png |
| ox-core-goryeo-c002-gwangjong | 고려 | 광종의 왕권 강화 | 노비안검법과 과거제 / 광덕·준풍 연호 / 쌍기의 건의 | docs/mnemonic-sources/primary-reference.txt#C002<br>docs/mnemonic-sources/cue-facts.txt#topic-27 |
| ox-core-goryeo-c003-seongjong | 고려 | 성종의 통치 체제 정비 | 12목과 향리 제도 / 고려식 2성 6부 / 5도 양계 | docs/mnemonic-sources/primary-reference.txt#C003<br>docs/mnemonic-sources/cue-facts.txt#topic-29 |
| ox-core-goryeo-c004-munjong | 고려 | 문종대의 경정 전시과 | 경정 전시과는 현직 관리에게만 수조권을 지급 / 문종대 문벌 사회의 제도적 정비 | docs/mnemonic-sources/primary-reference.txt#C004<br>docs/mnemonic-sources/cue-facts.txt#topic-28 |
| ox-core-goryeo-c005-hyeonjong | 고려 | 현종대 거란 침입과 북방 방어 | 거란의 2차·3차 침입 / 나성과 천리장성 | docs/mnemonic-sources/primary-reference.txt#C005<br>docs/mnemonic-sources/cue-facts.txt#topic-29 |
| ox-core-goryeo-c006-sukjong | 고려 | 숙종의 화폐 발행 | 주전도감 / 해동통보·삼한통보 / 은병 | docs/mnemonic-sources/primary-reference.txt#C006<br>docs/mnemonic-sources/cue-facts.txt#topic-30 |
| ox-core-goryeo-c007-yejong | 고려 | 예종의 관학 진흥 | 국자감의 7재 / 양현고 / 사학 12도와의 관계 | docs/mnemonic-sources/primary-reference.txt#C007<br>docs/mnemonic-sources/cue-facts.txt#topic-31 |
| ox-core-goryeo-c008-chungseon | 고려 | 충선왕과 만권당 | 원의 대도에 만권당 설치 / 이제현 등의 문화 교류 | docs/mnemonic-sources/primary-reference.txt#C008<br>docs/mnemonic-sources/cue-facts.txt#topic-32 |
| ox-core-goryeo-c009-gongmin | 고려 | 공민왕의 반원 개혁과 홍건적 침입 | 기철 등 친원 세력 숙청 / 성균관 중영과 성리학 진흥 / 홍건적 침입과 복주 피란 | docs/mnemonic-sources/primary-reference.txt#C009<br>docs/mnemonic-sources/cue-facts.txt#topic-33 |
| ox-core-goryeo-c010-waegu | 고려 | 고려 말의 왜구 격퇴 | 최무선의 진포 대첩 / 이성계의 황산 대첩 / 박위의 쓰시마섬 정벌 | docs/mnemonic-sources/primary-reference.txt#C010<br>docs/mnemonic-sources/cue-facts.txt#topic-34 |
| ox-core-goryeo-c011-military-regime | 고려 | 최씨 무신 정권 | 최충헌의 교정도감 / 최우의 정방 / 도방은 집권자의 사병 조직 | docs/mnemonic-sources/primary-reference.txt#C011<br>docs/mnemonic-sources/cue-facts.txt#topic-35 |
| ox-core-goryeo-c012-radical-reformers | 고려 | 급진파 신진 사대부와 과전법 | 정도전·조준 등의 새 왕조 건설 / 과전법과 토지 제도 개혁 | docs/mnemonic-sources/primary-reference.txt#C012<br>docs/mnemonic-sources/cue-facts.txt#topic-36 |
| ox-core-goryeo-c013-c017-uprisings | 고려 | 무신 집권기의 농민·천민 봉기 | 만적의 노비 해방 주장 / 망이·망소이의 명학소 봉기 / 김사미·효심의 난 / 최광수의 고구려 부흥 운동 | docs/mnemonic-sources/primary-reference.txt#C013-C017<br>docs/mnemonic-sources/cue-facts.txt#topic-37-41 |
| ox-core-goryeo-c018-c019-land | 고려 | 고려의 전시과와 세습전 | 역분전은 통일 공로와 충성도를 기준으로 지급 / 개정 전시과는 관직 중시 / 공음전은 일정 범위의 세습 허용 | docs/mnemonic-sources/primary-reference.txt#C018<br>docs/mnemonic-sources/cue-facts.txt#topic-68<br>docs/mnemonic-sources/primary-reference.txt#C019<br>docs/mnemonic-sources/cue-facts.txt#topic-69 |
| ox-core-goryeo-c020-jinul | 고려 | 지눌의 수선사 결사 | 돈오점수 / 정혜쌍수 / 수선사 결사를 통한 불교 개혁 | docs/mnemonic-sources/primary-reference.txt#C020<br>docs/mnemonic-sources/cue-facts.txt#topic-53 |
| ox-core-joseon-a003-palaces | 조선 | 조선의 5대 궁궐 | 태조대 경복궁 / 태종대 창덕궁 / 창경궁·경희궁·경운궁 | docs/mnemonic-sources/primary-reference.txt#A003<br>docs/mnemonic-sources/cue-facts.txt#topic-3 |
| ox-core-joseon-d001-jeong-dojeon | 조선 | 정도전의 저술과 통치 구상 | 조선경국전 / 재상 중심 정치 | docs/mnemonic-sources/primary-reference.txt#D001<br>docs/mnemonic-sources/cue-facts.txt#topic-54 |
| ox-core-joseon-d002-taejong | 조선 | 태종의 왕권 강화와 제도 정비 | 6조 직계제 / 호패법·양전·신문고 | docs/mnemonic-sources/primary-reference.txt#D002<br>docs/mnemonic-sources/cue-facts.txt#topic-55 |
| ox-core-joseon-d003-sejong | 조선 | 세종대의 제도·문화·과학 | 집현전과 의정부 서사제 / 훈민정음 / 농사직설 / 자격루·앙부일구·측우기 / 공법의 전분 6등법·연분 9등법 | docs/mnemonic-sources/primary-reference.txt#D003<br>docs/mnemonic-sources/cue-facts.txt#topic-56 |
| ox-core-joseon-d004-sejo | 조선 | 세조의 왕권 강화 정책 | 직전법 / 집현전·경연 폐지 / 간경도감 / 유향소 폐지 | docs/mnemonic-sources/primary-reference.txt#D004<br>docs/mnemonic-sources/cue-facts.txt#topic-57 |
| ox-core-joseon-d005-seongjong | 조선 | 성종대의 통치 체제와 편찬 사업 | 홍문관과 3사 / 관수 관급제 / 국조오례의·동국통감 등 편찬 | docs/mnemonic-sources/primary-reference.txt#D005<br>docs/mnemonic-sources/cue-facts.txt#topic-58 |
| ox-core-joseon-d006-five-armies | 조선 | 조선 후기의 5군영 | 훈련도감·어영청·총융청·수어청·금위영 / 임진왜란 중 훈련도감 설치 | docs/mnemonic-sources/primary-reference.txt#D006<br>docs/mnemonic-sources/cue-facts.txt#topic-59 |
| ox-core-joseon-d007-japan-relations | 조선 | 왜란 전후의 대일 관계 | 쓰시마섬 정벌 / 계해약조 / 임진왜란 후 통신사 파견 | docs/mnemonic-sources/primary-reference.txt#D007<br>docs/mnemonic-sources/cue-facts.txt#topic-60 |
| ox-core-joseon-d008-hwanguk | 조선 | 숙종대의 환국 | 경신환국·기사환국·갑술환국 / 서인·남인의 정국 교체 | docs/mnemonic-sources/primary-reference.txt#D008<br>docs/mnemonic-sources/cue-facts.txt#topic-61 |
| ox-core-joseon-d009-jeongjo-books | 조선 | 정조대의 편찬 사업과 일성록 | 무예도보통지 / 일성록은 정조의 일기에서 출발한 국정 기록 | docs/mnemonic-sources/primary-reference.txt#D009<br>docs/mnemonic-sources/cue-facts.txt#topic-62 |
| ox-core-joseon-d010-jeongjo-policies | 조선 | 정조의 개혁 정치 | 규장각·초계문신제·장용영 / 수원 화성 건설 / 신해통공으로 육의전 제외 금난전권 폐지 | docs/mnemonic-sources/primary-reference.txt#D010<br>docs/mnemonic-sources/cue-facts.txt#topic-63 |
| ox-core-joseon-d011-yeongjo | 조선 | 영조의 탕평책과 균역법 | 완론 탕평 / 균역법으로 군포 2필을 1필로 감축 / 선무군관포·결작 등으로 재정 보전 | docs/mnemonic-sources/primary-reference.txt#D011<br>docs/mnemonic-sources/cue-facts.txt#topic-64 |
| ox-core-joseon-d012-catholic-persecutions | 조선 | 조선 후기 천주교 박해 | 신유박해·기해박해·병오박해·병인박해의 순서 | docs/mnemonic-sources/primary-reference.txt#D012<br>docs/mnemonic-sources/cue-facts.txt#topic-65 |
| ox-core-joseon-d015-commerce | 조선 | 조선 후기의 상업과 대외 무역 | 대동법과 공인 / 개성의 송상 / 의주의 만상과 대청 무역 / 동래의 내상과 대일 무역 | docs/mnemonic-sources/primary-reference.txt#D015<br>docs/mnemonic-sources/cue-facts.txt#topic-70 |
| ox-core-joseon-d027-printing | 조선 | 조선 전기의 금속 활자 | 태종대 주자소와 계미자 / 세종대 갑인자 | docs/mnemonic-sources/primary-reference.txt#D027<br>docs/mnemonic-sources/cue-facts.txt#topic-49 |
| ox-core-joseon-d028-painting | 조선 | 조선 후기의 진경 산수화 | 정선의 인왕제색도와 금강전도 / 우리 산천을 직접 관찰한 진경 산수화 | docs/mnemonic-sources/primary-reference.txt#D028<br>docs/mnemonic-sources/cue-facts.txt#topic-50 |
| ox-core-joseon-d029-hong-daeyong | 조선 | 홍대용의 과학 사상 | 지전설 / 무한 우주론 / 의산문답 | docs/mnemonic-sources/primary-reference.txt#D029<br>docs/mnemonic-sources/cue-facts.txt#topic-51 |
| ox-core-joseon-d030-architecture | 조선 | 조선 후기 목조 건축 | 법주사 팔상전은 현존하는 대표적 목조탑 / 임진왜란 후 재건 | docs/mnemonic-sources/primary-reference.txt#D030<br>docs/mnemonic-sources/cue-facts.txt#topic-52 |
| ox-core-joseon-d031-jo-gwangjo | 조선 | 조광조의 개혁과 기묘사화 | 현량과·소격서 폐지·위훈 삭제·향약 보급 / 1519년 기묘사화 | docs/mnemonic-sources/primary-reference.txt#D031<br>docs/mnemonic-sources/cue-facts.txt#topic-71 |
| ox-core-joseon-d032-imjin-war | 조선 | 임진왜란의 전개와 군사 제도 | 곽재우 등 의병의 활동 / 권율의 행주 대첩 / 노량 해전 / 속오군 편성 | docs/mnemonic-sources/primary-reference.txt#D032<br>docs/mnemonic-sources/cue-facts.txt#topic-72 |
| ox-core-joseon-user-iik | 조선 | 이익의 한전론과 성호사설 | 이익은 조선 후기 실학자 / 성호사설은 백과사전식 저술이지 왕조 실록이 아님 | user-request#이익-성호사설-OX-개선-예시 |
| ox-core-empire-73-western-incursions | 개항기·대한 제국 | 통상 수교 거부 정책과 서양 세력의 침입 | 병인박해와 제너럴 셔먼호 사건 / 병인양요와 문수산성·정족산성 전투 / 오페르트 도굴 사건 / 신미양요와 광성보 전투 / 척화비 건립 | docs/mnemonic-sources/primary-reference.txt (topic 73)<br>docs/mnemonic-sources/cue-facts.txt (topic 73) |
| ox-core-empire-74-opening-treaties | 개항기·대한 제국 | 강화도 조약 이후의 조약 체계 | 조일 수호 조규 / 조미 수호 통상 조약 / 임오군란 뒤 제물포 조약 / 조청 상민 수륙 무역 장정 / 조일 통상 장정 | docs/mnemonic-sources/primary-reference.txt (topic 74)<br>docs/mnemonic-sources/cue-facts.txt (topic 74) |
| ox-core-empire-75-opening-order | 개항기·대한 제국 | 서양 각국과의 수교 순서 | 미국과의 수교 / 영국·독일과의 수교 / 이탈리아·러시아·프랑스와의 수교 순서 | docs/mnemonic-sources/primary-reference.txt (topic 75)<br>docs/mnemonic-sources/cue-facts.txt (topic 75) |
| ox-core-empire-76-post-gapsin-sequence | 개항기·대한 제국 | 갑신정변 이후 정세의 전개 | 한성 조약과 톈진 조약 / 거문도 사건과 방곡령 사건 / 교조 신원 운동 / 동학 농민 운동과 갑오개혁 / 청일 전쟁 | docs/mnemonic-sources/primary-reference.txt (topic 76)<br>docs/mnemonic-sources/cue-facts.txt (topic 76) |
| ox-core-empire-77-gapsin-fourteen | 개항기·대한 제국 | 갑신정변 14개조 개혁 정강 | 문벌 폐지와 인민 평등 / 혜상공국·환곡·내시부 폐지 / 지조법 개혁 / 재정의 호조 일원화 / 규장각 폐지와 근위대 설치 | docs/mnemonic-sources/primary-reference.txt (topic 77; mnemonic transcript)<br>docs/mnemonic-sources/cue-facts.txt (topic 77)<br>우리역사넷 `hm_116_0100` |
| ox-core-empire-78-donghak-sequence | 개항기·대한 제국 | 동학 농민 운동의 전개 | 고부 농민 봉기와 백산 봉기 / 황토현·황룡촌 전투 / 전주 화약과 집강소 / 공주 우금치 전투 | docs/mnemonic-sources/primary-reference.txt (topic 78)<br>docs/mnemonic-sources/cue-facts.txt (topic 78) |
| ox-core-empire-79-peasant-reform-program | 개항기·대한 제국 | 동학 농민군의 폐정 개혁안 | 탐관오리와 부호의 횡포 시정 / 노비 문서 소각과 천인 차별 개선 / 무명 잡세 폐지 / 과부 재가 허용 | docs/mnemonic-sources/primary-reference.txt (topic 79; mnemonic transcript)<br>docs/mnemonic-sources/cue-facts.txt (topic 79)<br>우리역사넷 `hm_117_0030` |
| ox-core-empire-80-first-gabo | 개항기·대한 제국 | 제1차 갑오개혁 | 군국기무처 중심 개혁 / 은본위제와 금납화 / 신분제·노비제·과거제 폐지 / 경무청과 탁지아문 설치 / 왕실 사무와 정부 사무 분리 | docs/mnemonic-sources/primary-reference.txt (topic 80)<br>docs/mnemonic-sources/cue-facts.txt (topic 80) |
| ox-core-empire-81-second-gabo | 개항기·대한 제국 | 제2차 갑오개혁 | 홍범 14조 / 재판소 설치 / 교육 입국 조서 / 8아문을 7부로 개편 / 8도에서 23부로 지방 제도 개편 / 훈련대·시위대 설치 | docs/mnemonic-sources/primary-reference.txt (topic 81)<br>docs/mnemonic-sources/cue-facts.txt (topic 81) |
| ox-core-empire-82-eulmi-reform | 개항기·대한 제국 | 을미개혁 | 우체사 업무 재개 / 친위대·진위대 설치 / 소학교 설치 / 건양 연호와 태양력 / 단발령과 종두법 | docs/mnemonic-sources/primary-reference.txt (topic 82)<br>docs/mnemonic-sources/cue-facts.txt (topic 82) |
| ox-core-empire-83-hongbeom-fourteen | 개항기·대한 제국 | 홍범 14조의 원칙 | 청에 의존하지 않는 자주 독립 / 왕실 사무와 정부 사무 분리 / 인재 등용과 유학생 파견 / 재정의 탁지아문 관할 / 제1차 개혁 내용 재확인 | docs/mnemonic-sources/primary-reference.txt (topic 83)<br>docs/mnemonic-sources/cue-facts.txt (topic 83) |
| ox-core-empire-84-heonui-six | 개항기·대한 제국 | 헌의 6조와 관민 공동회 | 자주 국권 수호 / 중추원 개편과 의회 설립 운동 / 입헌 군주제 지향 / 피고의 인권 존중 / 칙임관 임명에 대한 중의 활용 | docs/mnemonic-sources/primary-reference.txt (topic 84)<br>docs/mnemonic-sources/cue-facts.txt (topic 84) |
| ox-core-empire-85-reign-titles | 개항기·대한 제국 | 개항기와 대한 제국의 연호 | 개국 / 건양 / 광무 / 융희 / 청의 광서 연호와 구별 | docs/mnemonic-sources/primary-reference.txt (topic 85)<br>docs/mnemonic-sources/cue-facts.txt (topic 85) |
| ox-core-empire-86-eulmi-righteous-armies | 개항기·대한 제국 | 을미의병의 지역별 지도자 | 경상도의 허위 / 전라도의 기우만 / 충청도의 유인석 / 강원도의 이소응 / 명성 황후 시해와 단발령에 대한 반발 | docs/mnemonic-sources/primary-reference.txt (topic 86)<br>docs/mnemonic-sources/cue-facts.txt (topic 86) |
| ox-core-empire-87-patriotic-enlightenment-organizations | 개항기·대한 제국 | 애국 계몽 단체 | 보안회의 황무지 개간권 반대 / 헌정 연구회의 입헌 정치 연구 / 대한 자강회와 대한 협회 / 신민회의 비밀 결사·공화정 지향·독립운동 기지 건설 | docs/mnemonic-sources/primary-reference.txt (topic 87)<br>docs/mnemonic-sources/cue-facts.txt (topic 87)<br>docs/mnemonic-sources/cue-facts.txt (topic 94, 신민회 국외 기지의 세부 사실) |
| ox-core-empire-88-modern-newspapers | 개항기·대한 제국 | 근대 신문의 발행과 역할 | 한성순보 / 독립신문 / 황성신문 / 제국신문 / 대한매일신보 / 만세보·경향신문·매일신문 | docs/mnemonic-sources/primary-reference.txt (topic 88)<br>docs/mnemonic-sources/cue-facts.txt (topic 88) |
| ox-core-empire-89-modern-education-1880s | 개항기·대한 제국 | 1880년대 근대 교육 기관 | 원산 학사 / 동문학 / 경신 학교 / 배재 학당 / 이화 학당 / 육영 공원 | docs/mnemonic-sources/primary-reference.txt (topic 89)<br>docs/mnemonic-sources/cue-facts.txt (topic 89) |
| ox-core-empire-90-modern-education-1890s | 개항기·대한 제국 | 1890년대 근대 교육 제도 | 교육 입국 조서 / 소학교와 사범 학교 / 외국어 학교 / 중학교 | docs/mnemonic-sources/primary-reference.txt (topic 90)<br>docs/mnemonic-sources/cue-facts.txt (topic 90) |
| ox-core-empire-91-modern-education-1900s | 개항기·대한 제국 | 1900년대 민족 교육 기관 | 흥화 학교와 점진 학교 / 보성 학교와 양정 학교 / 숙명 여학교와 휘문 의숙 / 오산 학교와 대성 학교 | docs/mnemonic-sources/primary-reference.txt (topic 91)<br>docs/mnemonic-sources/cue-facts.txt (topic 91) |
| ox-core-empire-92-loss-of-sovereignty | 개항기·대한 제국 | 국권 피탈 과정 | 한일 의정서 / 제1차 한일 협약 / 을사늑약 / 헤이그 특사 / 한일 신협약과 군대 해산 / 기유각서·간도 협약·한일 병합 조약 | docs/mnemonic-sources/primary-reference.txt (topic 92)<br>docs/mnemonic-sources/cue-facts.txt (topic 92) |
| ox-core-occupation-93-secret-societies | 일제 강점기 | 1910년대 국내 비밀 결사 | 독립 의군부 / 대한 광복회 / 조선 산직 장려계와 자립관 / 송죽회와 기성단 | docs/mnemonic-sources/primary-reference.txt (topic 93)<br>docs/mnemonic-sources/cue-facts.txt (topic 93) |
| ox-core-occupation-94-south-manchuria | 일제 강점기 | 1910년대 서간도 독립운동 기지 | 삼원보 / 경학사와 부민단 / 신흥 강습소·신흥 무관 학교 / 서로 군정서 | docs/mnemonic-sources/primary-reference.txt (topic 94)<br>docs/mnemonic-sources/cue-facts.txt (topic 94) |
| ox-core-occupation-95-china-mainland | 일제 강점기 | 1910년대 중국 관내 독립운동 | 상하이 동제사 / 신규식·박은식·김규식·여운형의 활동 / 신한청년당 / 대한민국 임시 정부 | docs/mnemonic-sources/primary-reference.txt (topic 95)<br>docs/mnemonic-sources/cue-facts.txt (topic 95) |
| ox-core-occupation-96-north-gando | 일제 강점기 | 1910년대 북간도 독립운동 기지 | 간민회 / 서전서숙과 명동 학교 / 중광단 / 북로 군정서 | docs/mnemonic-sources/primary-reference.txt (topic 96)<br>docs/mnemonic-sources/cue-facts.txt (topic 96) |
| ox-core-occupation-97-maritime-province | 일제 강점기 | 1910년대 연해주 독립운동 | 신한촌 / 13도 의군과 성명회 / 권업회 / 전로 한족회 중앙 총회와 대한 국민 의회 / 대한 광복군 정부 | docs/mnemonic-sources/primary-reference.txt (topic 97)<br>docs/mnemonic-sources/cue-facts.txt (topic 97) |
| ox-core-occupation-98-americas | 일제 강점기 | 1910년대 미주 독립운동 | 샌프란시스코의 흥사단·공립 협회·대한인 국민회 / 하와이의 대조선 국민 군단 | docs/mnemonic-sources/primary-reference.txt (topic 98)<br>docs/mnemonic-sources/cue-facts.txt (topic 98) |
| ox-core-occupation-99-manchuria-1920s | 일제 강점기 | 1920년대 만주 독립전쟁과 재편 | 삼둔자·봉오동 전투 / 훈춘 사건과 청산리 대첩 / 간도 참변과 자유시 참변 / 3부 성립과 미쓰야 협정 / 민족 유일당 운동 | docs/mnemonic-sources/primary-reference.txt (topic 99)<br>docs/mnemonic-sources/cue-facts.txt (topic 99) |
| ox-core-occupation-100-cheongsanri | 일제 강점기 | 청산리 대첩의 주요 전투 | 백운평 전투 / 천수평 전투 / 어랑촌 전투 / 고동하 전투 / 독립군 연합 부대의 대일 승리 | docs/mnemonic-sources/primary-reference.txt (topic 100)<br>docs/mnemonic-sources/cue-facts.txt (topic 100) |
| ox-core-occupation-101-korean-independence-army | 일제 강점기 | 한국 독립군의 한중 연합 작전 | 북만주 활동 / 중국 호로군과 연합 / 쌍성보·사도하자·대전자령·동경성 전투 | docs/mnemonic-sources/primary-reference.txt (topic 101)<br>docs/mnemonic-sources/cue-facts.txt (topic 101) |
| ox-core-occupation-102-korean-revolutionary-army | 일제 강점기 | 국민부와 조선 혁명군 | 남만주의 국민부 / 양세봉이 이끈 조선 혁명군 / 중국 의용군과 연합 / 영릉가·흥경성 전투 | docs/mnemonic-sources/primary-reference.txt (topic 102)<br>docs/mnemonic-sources/cue-facts.txt (topic 102) |
| ox-core-occupation-103-singanhoe | 일제 강점기 | 신간회의 강령과 활동 | 정치·경제적 각성 촉구 / 민족의 단결 / 기회주의 배격 / 광주 학생 항일 운동 진상 조사와 민중 대회 계획 | docs/mnemonic-sources/primary-reference.txt (topic 103)<br>docs/mnemonic-sources/cue-facts.txt (topic 103) |
| ox-core-occupation-104-shin-chaeho | 일제 강점기 | 신채호의 민족주의 사학과 의열 투쟁론 | 『조선상고사』 / 역사를 아와 비아의 투쟁으로 파악 / 낭가 사상 / 『조선 혁명 선언』과 민중 직접 혁명론 | docs/mnemonic-sources/primary-reference.txt (topic 104)<br>docs/mnemonic-sources/cue-facts.txt (topic 104) |
| ox-core-occupation-105-park-eunsik | 일제 강점기 | 박은식의 민족주의 사학 | 국혼 강조 / 『한국통사』 / 『한국독립운동지혈사』 | docs/mnemonic-sources/primary-reference.txt (topic 105)<br>docs/mnemonic-sources/cue-facts.txt (topic 105) |
| ox-core-occupation-106-joseonhak | 일제 강점기 | 조선학 운동과 민족주의 역사 연구 | 문일평의 조선심 / 정인보의 조선의 얼 / 안재홍의 조선상고사감 / 다산 정약용 기념 사업을 계기로 한 조선학 운동 | docs/mnemonic-sources/primary-reference.txt (topic 106)<br>docs/mnemonic-sources/cue-facts.txt (topic 106) |
| ox-core-occupation-107-liberation-diplomacy | 일제 강점기 | 국제 회담과 광복 준비 | 카이로 회담 / 얄타 회담 / 포츠담 선언 / 8·15 광복 / 조선 건국 동맹과 건국 준비 위원회 / 모스크바 3국 외상 회의 | docs/mnemonic-sources/primary-reference.txt (topic 107)<br>docs/mnemonic-sources/cue-facts.txt (topic 107) |
| ox-core-republic-108-liberation-groups | 광복 이후 | 광복 직후 정당·단체와 정부 수립 논의 | 한국 독립당 / 조선 인민당 / 국민당 / 한국 민주당 / 조선 공산당 / 독립 촉성 중앙 협의회 / 건국 준비 위원회와 남북 협상 | docs/mnemonic-sources/primary-reference.txt (topic 108)<br>docs/mnemonic-sources/cue-facts.txt (topic 108)<br>docs/mnemonic-sources/cue-facts.txt (topic 107, 광복 직후 이행 맥락) |
| ox-core-republic-109-roh-taewoo | 광복 이후 | 노태우 정부의 북방 외교와 남북 관계 | 7·7 선언 / 남북 고위급 회담 / 남북한 유엔 동시 가입 / 남북 기본 합의서 / 한반도 비핵화 공동 선언 | docs/mnemonic-sources/primary-reference.txt (topic 109)<br>docs/mnemonic-sources/cue-facts.txt (topic 109) |
| ox-core-republic-110-kim-daejung | 광복 이후 | 김대중 정부의 경제·사회·대북 정책 | 햇볕 정책 / 중학교 의무 교육 / 금강산 해로 관광 / 노사정 위원회 / 6·15 남북 공동 선언 / 이산가족 상봉 / 개성 공단 사업 합의 | docs/mnemonic-sources/primary-reference.txt (topic 110)<br>docs/mnemonic-sources/cue-facts.txt (topic 110) |
| ox-core-republic-111-kim-youngsam | 광복 이후 | 김영삼 정부의 세계화와 외환 위기 | 우루과이 라운드 협정 / 세계 무역 기구 출범과 가입 / 경제 협력 개발 기구 가입 / 1997년 외환 위기와 국제 통화 기금 구제 금융 요청 | docs/mnemonic-sources/primary-reference.txt (topic 111)<br>docs/mnemonic-sources/cue-facts.txt (topic 111) |

## OX 문항 매핑

기출 ID는 키워드로 붙이지 않았다. 이번 이행에서는 1:1로 수동 검증한 기출 ID가 없으므로 모든 `sourceQuestionIds`와 수동 승인 목록 `official-link-allowlist.json`을 비워 두었다.

| 문항 ID | coreId | 정답 | 기출 ID |
|---|---|:---:|---|
| ox-prehistoric-001 | ox-core-prehistoric-paleolithic-life | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-003 | ox-core-prehistoric-paleolithic-life | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-005 | ox-core-prehistoric-neolithic-transition | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-007 | ox-core-prehistoric-a010-bronze-rice | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-008 | ox-core-prehistoric-bronze-society | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-009 | ox-core-prehistoric-bronze-society | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-011 | ox-core-prehistoric-gojoseon-state | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-013 | ox-core-prehistoric-gojoseon-state | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-014 | ox-core-prehistoric-gojoseon-state | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-015 | ox-core-prehistoric-a015-festivals | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-016 | ox-core-prehistoric-a013-gojoseon-range | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-017 | ox-core-prehistoric-a015-festivals | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-018 | ox-core-prehistoric-proto-goguryeo | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-019 | ox-core-prehistoric-proto-okjeo | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-020 | ox-core-prehistoric-a015-festivals | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-021 | ox-core-prehistoric-proto-dongye | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-022 | ox-core-prehistoric-proto-samhan | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-023 | ox-core-prehistoric-a015-festivals | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-025 | ox-core-prehistoric-a013-gojoseon-range | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-026 | ox-core-prehistoric-a010-bronze-rice | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-027 | ox-core-prehistoric-a008-a009-neolithic-food-pottery | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-029 | ox-core-prehistoric-a012-iron-culture | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-030 | ox-core-prehistoric-gojoseon-state | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-031 | ox-core-prehistoric-a004-early-sites | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-032 | ox-core-prehistoric-a004-early-sites | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-033 | ox-core-prehistoric-a006-late-tools | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-039 | ox-core-prehistoric-neolithic-transition | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-041 | ox-core-prehistoric-a008-a009-neolithic-food-pottery | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-044 | ox-core-prehistoric-a007-neolithic-sites | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-045 | ox-core-prehistoric-a007-neolithic-sites | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-046 | ox-core-prehistoric-a007-neolithic-sites | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-047 | ox-core-prehistoric-a011-bronze-pottery | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-051 | ox-core-prehistoric-a013-gojoseon-range | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-052 | ox-core-prehistoric-a011-bronze-pottery | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-057 | ox-core-prehistoric-a012-iron-culture | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-065 | ox-core-prehistoric-gojoseon-state | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-067 | ox-core-prehistoric-gojoseon-state | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-069 | ox-core-prehistoric-a014-eight-laws | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-070 | ox-core-prehistoric-proto-buyeo | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-071 | ox-core-prehistoric-a014-eight-laws | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-072 | ox-core-prehistoric-a014-eight-laws | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-073 | ox-core-prehistoric-proto-buyeo | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-074 | ox-core-prehistoric-proto-buyeo | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-075 | ox-core-prehistoric-proto-buyeo | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-076 | ox-core-prehistoric-proto-buyeo | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-077 | ox-core-prehistoric-proto-goguryeo | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-078 | ox-core-prehistoric-proto-buyeo | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-079 | ox-core-prehistoric-proto-goguryeo | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-080 | ox-core-prehistoric-proto-goguryeo | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-083 | ox-core-prehistoric-proto-okjeo | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-084 | ox-core-prehistoric-proto-okjeo | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-085 | ox-core-prehistoric-proto-okjeo | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-087 | ox-core-prehistoric-proto-dongye | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-088 | ox-core-prehistoric-proto-dongye | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-089 | ox-core-prehistoric-proto-dongye | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-091 | ox-core-prehistoric-proto-samhan | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-093 | ox-core-prehistoric-proto-samhan | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-094 | ox-core-prehistoric-proto-samhan | X | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-095 | ox-core-prehistoric-proto-samhan | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-097 | ox-core-prehistoric-proto-samhan | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-099 | ox-core-prehistoric-a015-festivals | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-101 | ox-core-prehistoric-a005-middle-sites | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-102 | ox-core-prehistoric-proto-goguryeo | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-103 | ox-core-prehistoric-proto-buyeo | O | 없음(미검증 자동 연결 금지) |
| ox-prehistoric-104 | ox-core-prehistoric-proto-samhan | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-032 | ox-core-kingdoms-goguryeo-state | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-033 | ox-core-kingdoms-goguryeo-state | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-034 | ox-core-kingdoms-goguryeo-state | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-035 | ox-core-kingdoms-goguryeo-state | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-036 | ox-core-kingdoms-goguryeo-expansion | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-037 | ox-core-kingdoms-goguryeo-expansion | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-038 | ox-core-kingdoms-goguryeo-expansion | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-039 | ox-core-kingdoms-goguryeo-expansion | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-040 | ox-core-kingdoms-goguryeo-wars | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-041 | ox-core-kingdoms-goguryeo-wars | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-042 | ox-core-kingdoms-goguryeo-wars | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-044 | ox-core-kingdoms-goguryeo-culture | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-045 | ox-core-kingdoms-goguryeo-culture | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-046 | ox-core-kingdoms-goguryeo-culture | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-047 | ox-core-kingdoms-baekje-state | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-048 | ox-core-kingdoms-baekje-state | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-050 | ox-core-kingdoms-baekje-state | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-051 | ox-core-kingdoms-unified-silla-institutions | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-052 | ox-core-kingdoms-baekje-fall-culture | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-053 | ox-core-kingdoms-baekje-fall-culture | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-054 | ox-core-kingdoms-baekje-state | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-055 | ox-core-kingdoms-baekje-state | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-056 | ox-core-kingdoms-baekje-fall-culture | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-058 | ox-core-kingdoms-baekje-fall-culture | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-059 | ox-core-kingdoms-baekje-fall-culture | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-060 | ox-core-kingdoms-baekje-fall-culture | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-061 | ox-core-kingdoms-baekje-fall-culture | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-062 | ox-core-kingdoms-baekje-state | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-063 | ox-core-kingdoms-silla-state | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-064 | ox-core-kingdoms-silla-state | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-065 | ox-core-kingdoms-silla-state | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-066 | ox-core-kingdoms-silla-state | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-068 | ox-core-kingdoms-silla-state | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-069 | ox-core-kingdoms-silla-state | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-071 | ox-core-kingdoms-silla-unification | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-072 | ox-core-kingdoms-silla-unification | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-073 | ox-core-kingdoms-silla-unification | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-074 | ox-core-kingdoms-silla-unification | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-075 | ox-core-kingdoms-unified-silla-institutions | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-076 | ox-core-kingdoms-unified-silla-institutions | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-077 | ox-core-kingdoms-unified-silla-institutions | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-078 | ox-core-kingdoms-unified-silla-institutions | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-079 | ox-core-kingdoms-unified-silla-institutions | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-080 | ox-core-kingdoms-unified-silla-institutions | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-081 | ox-core-kingdoms-unified-silla-institutions | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-082 | ox-core-kingdoms-unified-silla-institutions | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-083 | ox-core-kingdoms-unified-silla-culture | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-084 | ox-core-kingdoms-unified-silla-culture | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-085 | ox-core-kingdoms-unified-silla-culture | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-086 | ox-core-kingdoms-unified-silla-late | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-087 | ox-core-kingdoms-unified-silla-late | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-088 | ox-core-kingdoms-unified-silla-culture | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-089 | ox-core-kingdoms-unified-silla-culture | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-090 | ox-core-kingdoms-unified-silla-culture | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-091 | ox-core-kingdoms-unified-silla-late | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-092 | ox-core-kingdoms-unified-silla-late | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-093 | ox-core-kingdoms-unified-silla-trade | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-094 | ox-core-kingdoms-balhae-kings | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-095 | ox-core-kingdoms-balhae-kings | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-096 | ox-core-kingdoms-balhae-kings | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-097 | ox-core-kingdoms-balhae-government-culture | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-098 | ox-core-kingdoms-balhae-government-culture | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-100 | ox-core-kingdoms-balhae-government-culture | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-101 | ox-core-kingdoms-balhae-government-culture | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-102 | ox-core-kingdoms-balhae-government-culture | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-103 | ox-core-kingdoms-balhae-kings | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-104 | ox-core-kingdoms-balhae-kings | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-105 | ox-core-kingdoms-later-three-foundation | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-106 | ox-core-kingdoms-later-three-foundation | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-107 | ox-core-kingdoms-later-three-foundation | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-108 | ox-core-kingdoms-later-three-unification | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-109 | ox-core-kingdoms-later-three-unification | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-110 | ox-core-kingdoms-later-three-unification | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-111 | ox-core-kingdoms-later-three-unification | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-112 | ox-core-kingdoms-gaya | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-113 | ox-core-kingdoms-gaya | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-114 | ox-core-kingdoms-gaya | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-115 | ox-core-kingdoms-gaya | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-116 | ox-core-kingdoms-gaya | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-117 | ox-core-kingdoms-unified-silla-institutions | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-118 | ox-core-kingdoms-unified-silla-institutions | O | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-119 | ox-core-kingdoms-unified-silla-institutions | X | 없음(미검증 자동 연결 금지) |
| ox-kingdoms-120 | ox-core-kingdoms-baekje-fall-culture | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-001 | ox-core-goryeo-c001-unification | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-003 | ox-core-goryeo-c001-unification | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-005 | ox-core-goryeo-c002-gwangjong | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-008 | ox-core-goryeo-c007-yejong | X | 없음(미검증 자동 연결 금지) |
| ox-goryeo-010 | ox-core-goryeo-c003-seongjong | X | 없음(미검증 자동 연결 금지) |
| ox-goryeo-012 | ox-core-goryeo-c003-seongjong | X | 없음(미검증 자동 연결 금지) |
| ox-goryeo-020 | ox-core-goryeo-c011-military-regime | X | 없음(미검증 자동 연결 금지) |
| ox-goryeo-021 | ox-core-goryeo-c013-c017-uprisings | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-027 | ox-core-goryeo-c020-jinul | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-031 | ox-core-goryeo-c001-unification | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-033 | ox-core-goryeo-c001-unification | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-035 | ox-core-goryeo-c001-unification | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-037 | ox-core-goryeo-c001-unification | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-039 | ox-core-goryeo-c002-gwangjong | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-043 | ox-core-goryeo-c003-seongjong | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-057 | ox-core-goryeo-c018-c019-land | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-059 | ox-core-goryeo-c018-c019-land | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-060 | ox-core-goryeo-c004-munjong | X | 없음(미검증 자동 연결 금지) |
| ox-goryeo-061 | ox-core-goryeo-c018-c019-land | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-075 | ox-core-goryeo-c005-hyeonjong | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-077 | ox-core-goryeo-c005-hyeonjong | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-084 | ox-core-goryeo-c013-c017-uprisings | X | 없음(미검증 자동 연결 금지) |
| ox-goryeo-085 | ox-core-goryeo-c011-military-regime | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-087 | ox-core-goryeo-c011-military-regime | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-089 | ox-core-goryeo-c013-c017-uprisings | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-090 | ox-core-goryeo-c013-c017-uprisings | X | 없음(미검증 자동 연결 금지) |
| ox-goryeo-091 | ox-core-goryeo-c013-c017-uprisings | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-096 | ox-core-goryeo-c008-chungseon | X | 없음(미검증 자동 연결 금지) |
| ox-goryeo-101 | ox-core-goryeo-c009-gongmin | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-103 | ox-core-goryeo-c009-gongmin | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-105 | ox-core-goryeo-c009-gongmin | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-107 | ox-core-goryeo-c010-waegu | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-108 | ox-core-goryeo-c010-waegu | X | 없음(미검증 자동 연결 금지) |
| ox-goryeo-111 | ox-core-goryeo-c012-radical-reformers | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-113 | ox-core-goryeo-c012-radical-reformers | O | 없음(미검증 자동 연결 금지) |
| ox-goryeo-115 | ox-core-goryeo-c006-sukjong | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-002 | ox-core-joseon-d001-jeong-dojeon | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-004 | ox-core-joseon-d002-taejong | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-006 | ox-core-joseon-d003-sejong | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-007 | ox-core-joseon-d003-sejong | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-008 | ox-core-joseon-d004-sejo | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-010 | ox-core-joseon-d005-seongjong | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-011 | ox-core-joseon-d005-seongjong | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-014 | ox-core-joseon-d031-jo-gwangjo | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-016 | ox-core-joseon-d032-imjin-war | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-022 | ox-core-joseon-d011-yeongjo | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-023 | ox-core-joseon-d010-jeongjo-policies | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-024 | ox-core-joseon-d010-jeongjo-policies | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-025 | ox-core-joseon-d010-jeongjo-policies | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-026 | ox-core-joseon-d015-commerce | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-027 | ox-core-joseon-d007-japan-relations | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-032 | ox-core-joseon-d001-jeong-dojeon | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-033 | ox-core-joseon-d004-sejo | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-036 | ox-core-joseon-d002-taejong | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-037 | ox-core-joseon-d027-printing | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-038 | ox-core-joseon-d002-taejong | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-040 | ox-core-joseon-d003-sejong | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-042 | ox-core-joseon-d007-japan-relations | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-043 | ox-core-joseon-d007-japan-relations | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-044 | ox-core-joseon-d003-sejong | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-046 | ox-core-joseon-d003-sejong | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-048 | ox-core-joseon-d003-sejong | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-050 | ox-core-joseon-d004-sejo | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-051 | ox-core-joseon-d005-seongjong | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-052 | ox-core-joseon-d004-sejo | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-053 | ox-core-joseon-d005-seongjong | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-054 | ox-core-joseon-d005-seongjong | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-076 | ox-core-joseon-d031-jo-gwangjo | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-079 | ox-core-joseon-d031-jo-gwangjo | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-086 | ox-core-joseon-d032-imjin-war | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-090 | ox-core-joseon-d032-imjin-war | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-091 | ox-core-joseon-d006-five-armies | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-092 | ox-core-joseon-d032-imjin-war | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-097 | ox-core-joseon-d006-five-armies | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-100 | ox-core-joseon-d008-hwanguk | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-102 | ox-core-joseon-d008-hwanguk | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-103 | ox-core-joseon-d008-hwanguk | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-104 | ox-core-joseon-d011-yeongjo | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-106 | ox-core-joseon-d011-yeongjo | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-107 | ox-core-joseon-d010-jeongjo-policies | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-108 | ox-core-joseon-d009-jeongjo-books | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-110 | ox-core-joseon-d010-jeongjo-policies | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-120 | ox-core-joseon-d015-commerce | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-122 | ox-core-joseon-d015-commerce | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-127 | ox-core-joseon-user-iik | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-129 | ox-core-joseon-d029-hong-daeyong | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-133 | ox-core-joseon-d028-painting | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-149 | ox-core-joseon-d009-jeongjo-books | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-151 | ox-core-joseon-d015-commerce | X | 없음(미검증 자동 연결 금지) |
| ox-joseon-152 | ox-core-joseon-a003-palaces | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-153 | ox-core-joseon-d006-five-armies | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-154 | ox-core-joseon-d012-catholic-persecutions | O | 없음(미검증 자동 연결 금지) |
| ox-joseon-155 | ox-core-joseon-d030-architecture | O | 없음(미검증 자동 연결 금지) |
| ox-empire-005 | ox-core-empire-74-opening-treaties | O | 없음(미검증 자동 연결 금지) |
| ox-empire-007 | ox-core-empire-74-opening-treaties | O | 없음(미검증 자동 연결 금지) |
| ox-empire-011 | ox-core-empire-76-post-gapsin-sequence | O | 없음(미검증 자동 연결 금지) |
| ox-empire-013 | ox-core-empire-78-donghak-sequence | O | 없음(미검증 자동 연결 금지) |
| ox-empire-015 | ox-core-empire-80-first-gabo | O | 없음(미검증 자동 연결 금지) |
| ox-empire-017 | ox-core-empire-82-eulmi-reform | O | 없음(미검증 자동 연결 금지) |
| ox-empire-021 | ox-core-empire-85-reign-titles | O | 없음(미검증 자동 연결 금지) |
| ox-empire-025 | ox-core-empire-92-loss-of-sovereignty | O | 없음(미검증 자동 연결 금지) |
| ox-empire-027 | ox-core-empire-92-loss-of-sovereignty | O | 없음(미검증 자동 연결 금지) |
| ox-empire-030 | ox-core-empire-91-modern-education-1900s | X | 없음(미검증 자동 연결 금지) |
| ox-empire-031 | ox-core-empire-74-opening-treaties | O | 없음(미검증 자동 연결 금지) |
| ox-empire-035 | ox-core-empire-74-opening-treaties | O | 없음(미검증 자동 연결 금지) |
| ox-empire-036 | ox-core-empire-74-opening-treaties | X | 없음(미검증 자동 연결 금지) |
| ox-empire-051 | ox-core-empire-77-gapsin-fourteen | O | 없음(미검증 자동 연결 금지) |
| ox-empire-053 | ox-core-empire-76-post-gapsin-sequence | O | 없음(미검증 자동 연결 금지) |
| ox-empire-054 | ox-core-empire-76-post-gapsin-sequence | X | 없음(미검증 자동 연결 금지) |
| ox-empire-055 | ox-core-empire-78-donghak-sequence | O | 없음(미검증 자동 연결 금지) |
| ox-empire-057 | ox-core-empire-78-donghak-sequence | O | 없음(미검증 자동 연결 금지) |
| ox-empire-058 | ox-core-empire-78-donghak-sequence | X | 없음(미검증 자동 연결 금지) |
| ox-empire-059 | ox-core-empire-79-peasant-reform-program | O | 없음(미검증 자동 연결 금지) |
| ox-empire-061 | ox-core-empire-78-donghak-sequence | O | 없음(미검증 자동 연결 금지) |
| ox-empire-063 | ox-core-empire-81-second-gabo | O | 없음(미검증 자동 연결 금지) |
| ox-empire-064 | ox-core-empire-80-first-gabo | X | 없음(미검증 자동 연결 금지) |
| ox-empire-065 | ox-core-empire-80-first-gabo | O | 없음(미검증 자동 연결 금지) |
| ox-empire-066 | ox-core-empire-83-hongbeom-fourteen | X | 없음(미검증 자동 연결 금지) |
| ox-empire-067 | ox-core-empire-82-eulmi-reform | O | 없음(미검증 자동 연결 금지) |
| ox-empire-068 | ox-core-empire-86-eulmi-righteous-armies | X | 없음(미검증 자동 연결 금지) |
| ox-empire-073 | ox-core-empire-84-heonui-six | O | 없음(미검증 자동 연결 금지) |
| ox-empire-082 | ox-core-empire-92-loss-of-sovereignty | X | 없음(미검증 자동 연결 금지) |
| ox-empire-083 | ox-core-empire-92-loss-of-sovereignty | O | 없음(미검증 자동 연결 금지) |
| ox-empire-084 | ox-core-empire-92-loss-of-sovereignty | X | 없음(미검증 자동 연결 금지) |
| ox-empire-085 | ox-core-empire-88-modern-newspapers | O | 없음(미검증 자동 연결 금지) |
| ox-empire-087 | ox-core-empire-92-loss-of-sovereignty | O | 없음(미검증 자동 연결 금지) |
| ox-empire-094 | ox-core-empire-87-patriotic-enlightenment-organizations | X | 없음(미검증 자동 연결 금지) |
| ox-empire-095 | ox-core-empire-87-patriotic-enlightenment-organizations | O | 없음(미검증 자동 연결 금지) |
| ox-empire-097 | ox-core-empire-87-patriotic-enlightenment-organizations | O | 없음(미검증 자동 연결 금지) |
| ox-empire-099 | ox-core-empire-87-patriotic-enlightenment-organizations | O | 없음(미검증 자동 연결 금지) |
| ox-empire-101 | ox-core-empire-73-western-incursions | O | 없음(미검증 자동 연결 금지) |
| ox-empire-102 | ox-core-empire-89-modern-education-1880s | O | 없음(미검증 자동 연결 금지) |
| ox-empire-103 | ox-core-empire-90-modern-education-1890s | O | 없음(미검증 자동 연결 금지) |
| ox-empire-104 | ox-core-empire-75-opening-order | X | 없음(미검증 자동 연결 금지) |
| ox-occupation-008 | ox-core-occupation-99-manchuria-1920s | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-010 | ox-core-occupation-99-manchuria-1920s | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-022 | ox-core-occupation-101-korean-independence-army | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-032 | ox-core-occupation-93-secret-societies | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-056 | ox-core-occupation-95-china-mainland | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-057 | ox-core-occupation-95-china-mainland | X | 없음(미검증 자동 연결 금지) |
| ox-occupation-058 | ox-core-occupation-93-secret-societies | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-059 | ox-core-occupation-95-china-mainland | X | 없음(미검증 자동 연결 금지) |
| ox-occupation-060 | ox-core-occupation-95-china-mainland | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-067 | ox-core-occupation-104-shin-chaeho | X | 없음(미검증 자동 연결 금지) |
| ox-occupation-072 | ox-core-occupation-99-manchuria-1920s | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-073 | ox-core-occupation-100-cheongsanri | X | 없음(미검증 자동 연결 금지) |
| ox-occupation-074 | ox-core-occupation-99-manchuria-1920s | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-076 | ox-core-occupation-99-manchuria-1920s | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-077 | ox-core-occupation-99-manchuria-1920s | X | 없음(미검증 자동 연결 금지) |
| ox-occupation-078 | ox-core-occupation-94-south-manchuria | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-079 | ox-core-occupation-101-korean-independence-army | X | 없음(미검증 자동 연결 금지) |
| ox-occupation-080 | ox-core-occupation-102-korean-revolutionary-army | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-081 | ox-core-occupation-102-korean-revolutionary-army | X | 없음(미검증 자동 연결 금지) |
| ox-occupation-090 | ox-core-occupation-107-liberation-diplomacy | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-094 | ox-core-occupation-103-singanhoe | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-098 | ox-core-occupation-103-singanhoe | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-110 | ox-core-occupation-104-shin-chaeho | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-112 | ox-core-occupation-106-joseonhak | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-118 | ox-core-occupation-96-north-gando | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-121 | ox-core-occupation-105-park-eunsik | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-122 | ox-core-occupation-106-joseonhak | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-123 | ox-core-occupation-107-liberation-diplomacy | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-124 | ox-core-occupation-97-maritime-province | O | 없음(미검증 자동 연결 금지) |
| ox-occupation-125 | ox-core-occupation-98-americas | O | 없음(미검증 자동 연결 금지) |
| ox-republic-030 | ox-core-republic-111-kim-youngsam | X | 없음(미검증 자동 연결 금지) |
| ox-republic-031 | ox-core-republic-108-liberation-groups | O | 없음(미검증 자동 연결 금지) |
| ox-republic-035 | ox-core-republic-108-liberation-groups | O | 없음(미검증 자동 연결 금지) |
| ox-republic-037 | ox-core-republic-108-liberation-groups | O | 없음(미검증 자동 연결 금지) |
| ox-republic-041 | ox-core-republic-108-liberation-groups | O | 없음(미검증 자동 연결 금지) |
| ox-republic-091 | ox-core-republic-109-roh-taewoo | O | 없음(미검증 자동 연결 금지) |
| ox-republic-092 | ox-core-republic-109-roh-taewoo | X | 없음(미검증 자동 연결 금지) |
| ox-republic-093 | ox-core-republic-109-roh-taewoo | O | 없음(미검증 자동 연결 금지) |
| ox-republic-094 | ox-core-republic-109-roh-taewoo | X | 없음(미검증 자동 연결 금지) |
| ox-republic-097 | ox-core-republic-110-kim-daejung | O | 없음(미검증 자동 연결 금지) |
| ox-republic-098 | ox-core-republic-110-kim-daejung | X | 없음(미검증 자동 연결 금지) |
| ox-republic-100 | ox-core-republic-110-kim-daejung | X | 없음(미검증 자동 연결 금지) |
| ox-republic-101 | ox-core-republic-108-liberation-groups | O | 없음(미검증 자동 연결 금지) |
| ox-republic-102 | ox-core-republic-111-kim-youngsam | O | 없음(미검증 자동 연결 금지) |

## 수정·신규 문항 감사

기존 ID의 문장과 정답은 306개 모두 유지했다. 아래 9개는 사실 정확도나 출처 추적성을 높이기 위해 해설 또는 메타데이터를 수정했다.

| 문항 ID | 수정 범위 | 수정 이유 |
|---|---|---|
| ox-prehistoric-018 | 해설 | 부경의 설치 주체를 일부 지배층으로 제한한 표현 교정 |
| ox-prehistoric-022 | 해설 | 대대로는 고구려 관직, 사출도는 부여 제도라는 X 판단 근거 보강 |
| ox-kingdoms-051 | 해설 | 외사정 설치 주체를 신문왕에서 673년 문무왕으로 교정 |
| ox-kingdoms-062 | core·topic·tag | 근초고왕 때 칠지도를 사비기 묶음에서 백제 전성기·대외 교류 항목으로 이동 |
| ox-goryeo-001 | 해설 | 918년 철원 건국과 919년 송악 천도를 구분 |
| ox-goryeo-107 | tag | 박위의 1389년 쓰시마섬 정벌을 포함하도록 우왕대에서 고려 말로 범위 교정 |
| ox-goryeo-108 | tag | 같은 왜구 격퇴 묶음의 시대 범위 교정 |
| ox-empire-051 | sourceRefs | 갑신정변 정강의 호조 일원화·지조법 개혁 공식 사료 근거 추가 |
| ox-empire-059 | core·sourceRefs | 논쟁적인 토지 평균 분작을 필수 핵심에서 제외하고 폐정 개혁안 공식 검토 자료 추가 |

신규 20문항은 기존 시대별 최대 ID 뒤에서만 발급했다. 선사·초기 국가 4개, 조선 5개, 개항기 4개, 일제 강점기 5개, 광복 이후 2개이며, 삼국·남북국과 고려는 기존 유효 문항으로 핵심 항목이 모두 덮여 추가하지 않았다. 전체 정답 분포는 O 214개, X 112개이며 수량이나 비율을 맞추기 위한 보충 문항은 만들지 않았다.

대표 보완 사례는 승리산 동굴 인골·서옥제의 설치 위치·삼한의 철 교역, 내상과 만상의 교역 상대 구분, 서양 각국과의 수교 순서, 미주·연해주 독립운동 조직, 광복 직후 정당과 김영삼 정부의 외환 위기이다.

## ID와 학습 기록 안전성

- 유지 297문항은 기존 ID·문장·정답·해설을 바꾸지 않았다. 수정 9문항도 판단 문장과 정답은 유지해 기존 풀이 의미가 달라지지 않는다.
- 퇴역 ID 504개는 `id-history.json`의 tombstone으로 남겨 재사용을 빌드에서 차단한다.
- 신규 문항은 기존 시대별 최대번호 뒤에서만 발급했다.
- 런타임은 ID뿐 아니라 핵심 필드의 SHA-256 핑거프린트를 함께 저장해, 미래에 같은 ID의 내용이 바뀌면 예전 학습 기록이 새 문항에 잘못 적용되지 않도록 분리한다.

## 검증 결과

- 생성·정적 검증: `npm run build:ox`, `npm run check:ox`, `git diff --check` 통과.
- 깨끗한 LF 체크아웃의 전체 PWA 빌드: `npm run build` 통과(54개 정적 파일, 준비된 일러스트 682개, manifest·service worker 검증).
- 논리·라우팅: 326문항, 112개 core 전부 커버, 최대 20문항 동적 세션, 20개 미만 시대 완주, 퇴역 ID와 내용 핑거프린트 마이그레이션, 오답노트·이어하기·재풀이·취약점 기록을 검증했다.
- 실제 Chromium: 1440px 데스크톱과 360·390·412px 모바일에서 O/X 선택 전 정답 비노출, 선택 후 정답·해설 노출, 다음 문제 이동, 진행률·결과, 가로 넘침 없음을 확인했다.
- 콘텐츠: 금지된 분류형 문구·질문형·정규화 중복·동일 해설·2~4문장 위반·미승인 기출 연결이 모두 0개이다. X 112문항은 틀린 부분과 올바른 사실을 함께 설명한다.
- 전체 `npm test`의 53개 명령을 중단 없이 개별 실행하면 42개가 통과한다. 실패한 11개(`official-image-ui`, `ch05-refinement`, `ch06-background`, `ch06-quiz`, `v2-renewal`, `v2-preservation`, `editorial-ui`, `ancient-story`, `official-canonical-qa`, `test:proto:revision`, `proto-main-preservation`)는 기준 `main` 커밋에서도 같은 목록으로 재현되어 이번 OX 변경의 신규 회귀가 아니다.
