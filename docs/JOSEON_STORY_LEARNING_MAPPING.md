# 조선 Story 학습 매핑

이 문서는 CH.00~CH.22의 스토리를 실제 한능검 기출 문항에서 역설계하기 위한 구현 기준이다. 원본 문항·정답·`officialQuestionId`는 변경하지 않고, 문제를 풀기 직전에 해당 단서를 장면으로 경험하도록 `relatedSceneId`와 `resumeStoryId`만 명시적으로 연결한다. 자체 제작 문항은 실제 기출로 표시하지 않고 `심화 연습 · 자체 제작`으로 유지한다.

| CH | 핵심 사건 | 기출이 요구하는 개념 | officialQuestionId | Story block / 상황 | 주요 NPC | 배경 | Question block | 복귀 장면 |
|---|---|---|---|---|---|---|---|---|
| 00 | 현대 서울 → 1394 한양 | 문제 없음 | — | 갑작스러운 비 → 돌담 처마 → 번개·암전 → 흙길·통신 두절 → 태조와 새 도성 단서 | 민준 | `modern-gyeongbokgung-rain`, rural, early-hanyang | 없음 | CH.01 |
| 01 | 태조·한양 천도·정도전 | 조선경국전, 재상 중심 정치 | `joseon-official-73-advanced-20` | 새 국호와 천도 → 종묘·사직 공사 → 정도전의 국가 설계 | 민준, 선비 | early-hanyang, palace, office | S3 뒤 1문항 | CH.01 완료 |
| 02 | 왕자의 난 | 정도전 제거, 이방원의 권력 장악 | — | 궁문 봉쇄 → 피 묻은 설계도 → 두 차례 왕자의 난 | 민준, 군사 | palace, office | S2·S3 뒤 심화 연습 각 1 | CH.02 완료 |
| 03 | 태종의 왕권 강화 | 의금부, 승정원, 6조 직계제 | `joseon-official-78-advanced-20`, `joseon-official-79-advanced-24` | 사병 혁파·의금부 → 육조와 승정원 → 호패·신문고 | 군사, 선비, 백성 | palace, office, market | S1·S2 뒤 각 1 | 다음 Story block |
| 04 | 세종의 학문·과학 | 사가독서, 칠정산·과학 기술 | `joseon-official-73-advanced-21`, `joseon-official-79-advanced-19` | 집현전의 밤 → 천문·시간 관측 → 우리 풍토의 농법 | 집현전 학사, 장영실, 농민 | jiphyeonjeon, rural | S1·S2 뒤 각 1 | 다음 Story block |
| 05 | 훈민정음 창제·반포 | 창제 목적, 1446년 반포 | — | 소리를 글자로 → 반대 상소 → 장터의 첫 글 | 학사, 백성 | hunminjeongeum-workshop, market | S1·S3 뒤 심화 연습 각 1 | 다음 Story block |
| 06 | 4군 6진 | 김종서, 압록강·두만강 국경 | — | 4군 → 6진 → 사민 정책의 삶 | 군사, 이주민 | frontier, rural | S2·S3 뒤 심화 연습 각 1 | 다음 Story block |
| 07 | 계유정난·단종·세조 | 단종 복위, 간경도감, 직전법 | `joseon-official-77-advanced-20`, `joseon-official-78-advanced-19`, `joseon-official-79-advanced-20` | 닫힌 궁문 → 사육신·금성대군 → 세조의 제도 | 군사, 선비 | palace, office | S2 뒤 1, S3 뒤 2 | CH.07 완료 |
| 08 | 성종·경국대전 | 도화서, 홍문관·3사, 유향소 | `joseon-official-73-advanced-25`, `joseon-official-75-advanced-20`, `joseon-official-76-advanced-22` | 법전·관청 → 경연과 언론 → 향촌의 사림 | 관리, 선비 | office, jiphyeonjeon, rural | S1·S2·S3 뒤 각 1 | 다음 Story block |
| 09 | 무오·갑자사화 | 연산군과 사화 | `joseon-official-73-advanced-23` | 사초가 죄목이 됨 → 사림 체포 → 개인의 원한이 형벌이 됨 | 사관, 백성, 민준 | office, palace | S3 뒤 1 | CH.09 완료 |
| 10 | 조광조와 사림 | 기묘사화, 을사사화, 이황·서원 | `joseon-official-74-advanced-23`, `joseon-official-75-advanced-22`, `joseon-official-76-advanced-20`, `joseon-official-77-advanced-21` | 반정 공신의 벽 → 현량과·향약 → 숙청 뒤 향촌 학문 | 조광조, 선비, 백성 | palace, jiphyeonjeon, office | S2 뒤 1, S3 뒤 3 | CH.10 완료 |
| 11 | 붕당과 전쟁 전야 | 니탕개의 난, 해동제국기·대일 정보 | `joseon-official-75-advanced-21`, `joseon-official-78-advanced-21` | 동인·서인 → 북방 경고 → 일본 사행과 엇갈린 보고 | 선비, 군사 | office, frontier | S2·S3 뒤 각 1 | CH.11 완료 |
| 12 | 임진왜란·의병 | 명 외교, 남원성·진주성, 고경명 | `joseon-official-73-advanced-22`, `joseon-official-76-advanced-21`, `joseon-official-78-advanced-22`, `joseon-official-79-advanced-27` | 부산·남원·진주 전선 → 임금의 피난과 원군 → 지역 의병 | 군사, 피란민, 의병 | war-hanyang, refugee-route, rural | S1 뒤 2, S2 뒤 1, S3 뒤 1 | 다음 Story block |
| 13 | 이순신과 수군 | 옥포·거북선·한산도 | `joseon-official-74-advanced-21` | 보급로를 끊는 첫 승리 → 선소 → 학익진 | 수군 | navy-port, hansando-sea | S3 뒤 1 | CH.13 완료 |
| 14 | 정유재란 | 재침, 명량, 노량 | `joseon-official-73-advanced-29` | 무너진 수군 → 열두 척과 물살 → 마지막 북소리 | 수군 | navy-port | S1 뒤 1 | 다음 Story block |
| 15 | 광해군·인조반정 | 인조반정, 이괄의 난 이후 정국 | `joseon-official-74-advanced-20`, `joseon-official-75-advanced-24` | 전후 복구 → 명·후금 사이 → 반정과 다시 흔들린 한양 | 백성, 군사, 노년 민준 | war-hanyang, frontier, palace | S3 뒤 2 | CH.15 완료 |
| 16 | 정묘·병자호란 | 남한산성, 삼학사, 효종 북벌·나선 정벌 | `joseon-official-73-advanced-24`, `joseon-official-75-advanced-23`, `joseon-official-77-advanced-22`, `joseon-official-78-advanced-23`, `joseon-official-79-advanced-22` | 강화도 피란 → 남한산성의 주화·척화 논쟁 → 항복과 후대의 북벌론 | 군사, 선비, 백성 | refugee-route, namhansanseong | S1 뒤 1, S2 뒤 2, S3 뒤 2 | CH.16 완료 |
| 17 | 숙종과 환국 | 경신·기사·갑술환국, 금위영 | `joseon-official-73-advanced-27`, `joseon-official-74-advanced-22`, `joseon-official-77-advanced-24` | 남인 축출 → 왕비 교체 → 서인 복귀와 왕권 강화 | 선비, 백성 | palace, office | S1·S2·S3 뒤 각 1 | 다음 Story block |
| 18 | 영조·정조 | 탕평, 청계천, 균역법·결작, 장용영·화성 | `joseon-official-73-advanced-28`, `joseon-official-74-advanced-24`, `joseon-official-76-advanced-25`, `joseon-official-76-advanced-29`, `joseon-official-78-advanced-24`, `joseon-official-79-advanced-23` | 탕평과 도성 정비 → 군포 부담 → 화성 행차 | 선비, 백성, 군사 | palace, market, suwon-fortress | S1·S2·S3 뒤 각 2 | CH.18 완료 |
| 19 | 실학·북학 | 정선·김정희, 박지원, 박제가, 홍대용 | `joseon-official-73-advanced-26`, `joseon-official-76-advanced-24`, `joseon-official-77-advanced-26`, `joseon-official-78-advanced-26`, `joseon-official-79-advanced-25` | 현실을 보는 학문과 문화 → 연행길 → 소비·기술론 | 실학자 | jiphyeonjeon, refugee-route, office | S1 뒤 3, S2 뒤 1, S3 뒤 1 | CH.19 완료 |
| 20 | 후기 경제·문화 | 대동법, 공인·도고·장시·화폐, 중인, 풍속화·판소리 | `joseon-official-73-advanced-30`, `joseon-official-74-advanced-26`, `joseon-official-74-advanced-27`, `joseon-official-75-advanced-25`, `joseon-official-75-advanced-26`, `joseon-official-76-advanced-23`, `joseon-official-76-advanced-26`, `joseon-official-76-advanced-27`, `joseon-official-77-advanced-23`, `joseon-official-77-advanced-25`, `joseon-official-78-advanced-25`, `joseon-official-79-advanced-21`, `joseon-official-79-advanced-26` | 공물 개혁 → 장시·도고 → 화폐 → 상품 생산·중인 → 서민 문화 | 상인, 백성, 노년 민준 | office, late-market, market, rural | 5개 Story block 뒤 2~3문항 | 다음 Story block |
| 21 | 세도·삼정·농민 봉기 | 신유박해, 안동 김씨, 향촌 동요, 홍경래·진주 | `joseon-official-73-advanced-31`, `joseon-official-74-advanced-25`, `joseon-official-75-advanced-27`, `joseon-official-77-advanced-28`, `joseon-official-78-advanced-27` | 외척 권력 → 장부 속 수탈 → 관아로 향한 농민 | 선비, 백성 | palace, peasant-village, jinju-uprising | S1 뒤 2, S2 뒤 1, S3 뒤 2 | CH.21 완료 |
| 22 | 대원군·양요·운요호 | 대원군 개혁, 병인양요·정족산성 | `joseon-official-76-advanced-28`, `joseon-official-77-advanced-29` | 중건과 개혁의 부담 → 프랑스군 → 미군·척화비 → 1875 운요호 | 백성, 군사 | gyeongbokgung-reconstruction, jeongjoksanseong, gwangseongbo, unyo | S1·S2 뒤 각 1 | 강화도 해안 → 운요호 → END |

## 구현 불변 조건

- 공식 65문항의 `officialQuestionId`, 원본 이미지, 정답, 풀이 기록 키는 유지한다.
- 각 문제 세트는 한 장면에 1~3문항만 연결하고, 마지막 문항의 `resumeStoryId`는 다음 Story block을 가리킨다.
- CH.02·05·06의 6문항만 `심화 연습 · 자체 제작`이며 실제 기출 배지를 사용하지 않는다.
- 조선 캐릭터의 scale·X/Y·상반신 framing은 변경하지 않는다.
- 고려 Story 데이터·자산·렌더러는 변경하지 않는다.
