# MNEMONIC IMPORT REVIEW

## Summary

- Registered source records: **118**
- Imported records: **118**
- Additional records discovered: **0**
- Duplicate removed: **0**
- Inventory missing: **0**
- VERIFIED: **10**
- REVIEW_REQUIRED: **90**
- CANDIDATE: **18**
- Production published: **49**
- Excluded from publication: **69**
- UI visible canonical: **49**
- UI visible legacy: **2**
- UI visible total: **51**
- UI missing among approved records: **0**

- Published records by source review state: VERIFIED **10** / CANDIDATE **15** / REVIEW_REQUIRED **24**

`sourceMnemonic`은 사용자 입력을 그대로 보존합니다. `sourceReviewStatus`와 공개 승인(`publicationStatus`)은 독립적으로 관리하며, 검토 중인 원문을 공개 문자열로 사용하지 않습니다. 공개 화면은 승인된 레코드의 별도 `mnemonic`만 사용합니다.

## List exposure audit

- Root cause before this fix: the importer accepted only 10 `PUBLISHED` canonical records, so the runtime list contained those 10 plus 2 preserved legacy cards.
- Current publication gate: **present (expected)**; all 49 approved canonical records pass it.
- Mnemonic-list slice/limit 10: **not found**
- Mnemonic-list slice/limit 20: **not found**. The only `.slice(0,20)` is the intentionally separate official-exam session cap, not mnemonic-list pagination.
- `sourceReviewStatus === 'VERIFIED'` UI gate: **not found**
- Era and search filtering operate on the complete in-memory public set; no mnemonic pagination or initial-sample loader exists.
- Developer review route: `?mnemonicReview=1` renders all 118 inventory rows and their review/publication states.

## Source group counts

|그룹|개수|
|---|---:|
|A|15|
|B|11|
|C|20|
|D|32|
|E|20|
|F|20|

## UI era counts

|분류|개수|
|---|---:|
|선사·고대|36|
|고려|20|
|조선|22|
|개항기/대한제국|20|
|일제강점기|14|
|현대|6|

## Source preservation

|검사|결과|
|---|---|
|Exact source strings|PASS|
|Parentheses / punctuation|PASS|
|Numbers|PASS|
|English mnemonic (`UWOI`)|PASS|

## Source Review

|ID|title|sourceMnemonic|historical verification|copyright/publication status|appMnemonic status|
|---|---|---|---|---|---|
|A001|세계기록유산|오일팔(에) 난새 (영웅) 조조(가) 승훈(이) 해직(에) 동의(하였다)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|A002|세계문화유산|불경해석 창조남(이) 고종수 안경 백|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|A003|조선시대 궁궐|복덕(방) 경희(가) 운(다)|VERIFIED|APP_REWRITTEN_FROM_FACT_STRUCTURE|경복·창덕·창경·경희·경운|
|A004|전기 유적지|금연석 (점)검(도중) 최초 그늘|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|A005|중기 유적지|굴역심 상승(중) 빌점|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|A006|후기 유적지|(2개의) 흥수똥 달제양|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|A007|유적지|고수(는) 암오동(가서) 미궁(에 빠졌다)|CANDIDATE|APP_REWRITTEN_FROM_FACT_STRUCTURE|고 · 수 · 암 · 오 · 동 · 미 · 궁|
|A008|토기|이른 덧(니를) 눌러(서) 빗(자)|CANDIDATE|APP_REWRITTEN_FROM_FACT_STRUCTURE|이른 · 덧 · 눌러 · 빗|
|A009|좁쌀|타고 남은 봉지|CANDIDATE|APP_REWRITTEN_FROM_FACT_STRUCTURE|남 · 봉|
|A010|벼농사|송흔(이) 화남|CANDIDATE|APP_REWRITTEN_FROM_FACT_STRUCTURE|송 · 흔 · 화 · 남|
|A011|토기|부여(로) 간~ 김송민|CANDIDATE|APP_REWRITTEN_FROM_FACT_STRUCTURE|부여 · 간 · 김 · 송 · 민|
|A012|토기|철민(이는) 검은 띠|CANDIDATE|APP_REWRITTEN_FROM_FACT_STRUCTURE|민 · 검은 · 띠|
|A013|세력 범위|송파 거북(이)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|A014|8조법|살사 상곡 절노|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|A015|제천행사|부영(이와) 고동(어는) 동무(다)|VERIFIED|APP_REWRITTEN_FROM_FACT_STRUCTURE|부영 · 고동 · 동무|
|B001|왕과 업적|원통하게 활맞아 죽은 고국원왕 광개토 아버지 고국양왕 학(태학)교(불교)령(율령) 소수림왕 양(영양왕)양(양제침입)신집(이문진 신집 5권)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|B002|소지왕|소(시) 우시 결백행|CANDIDATE|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|B003|진흥왕|진(짜) 개대홍 단! 나성북창 대황마|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|B004|반란사|비염김(씨), 대구김(씨) 헌범(이가) 장원(할) 견적(이 나온다)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|B005|연호|건대인천|CANDIDATE|APP_REWRITTEN_FROM_FACT_STRUCTURE|건 · 대 · 인 · 천|
|B006|고왕|고천진동|CANDIDATE|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|B007|무왕|무인당장 요(기)서|CANDIDATE|APP_REWRITTEN_FROM_FACT_STRUCTURE|무 · 인 · 당 · 장 · 요|
|B008|문왕|문대 중살 신주자|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|B009|선왕|선건 해북남서 지방|CANDIDATE|APP_REWRITTEN_FROM_FACT_STRUCTURE|선 · 건 · 해 · 북 · 남 · 서 · 지방|
|B010|9서당|9고황 적벽 청(군)백(군)빽 흑(수)말(이다)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|B011|후삼국 성립|무성수정|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|C001|고려 건국과 민족 재통일|발해 공고(애들이) 신통(하다)|VERIFIED|APP_REWRITTEN_FROM_FACT_STRUCTURE|발해–공산–고창–신라–통일|
|C002|광종의 왕권 강화|광노(안)과 공복 주제(에) 송광풍 여사~|VERIFIED|APP_REWRITTEN_FROM_FACT_STRUCTURE|광종: 노비·과거·공복 / 광덕·준풍|
|C003|성종|2612(원) 의상비 수건향 분유향 노문국|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|C004|문종|경동 나비엔 남대문 기사|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|C005|현종|오~ 현창군 거칠(게) 대화(하고) 공정(하게) 관등(하자)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|C006|숙종|화난 숙종은 벌써 3회독|CANDIDATE|APP_REWRITTEN_FROM_FACT_STRUCTURE|화 · 난 · 은 · 벌 · 써 · 삼 · 회 · 독|
|C007|예종|얘 7재야(양) 감(좋은) 보청기 구해도 얘(예)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|C008|충선왕|이제(부터) 소금만 사(자)|CANDIDATE|APP_REWRITTEN_FROM_FACT_STRUCTURE|이제 · 소금 · 만 · 사|
|C009|공민왕|곧 몽정기 관쌍 홍복흥 전(효)성요동(치네) 곧(공)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|C010|우왕|최홍(만)남 최진철(강) 이황|CANDIDATE|APP_REWRITTEN_FROM_FACT_STRUCTURE|최 · 홍 · 남 · 최 · 진 · 철 · 이 · 황|
|C011|무신정권|최충흥 최이진|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|C012|급진개혁파|정도전(이) 윤소총-종(으로) (고려를) 조준!|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|C013|무신 반란|중부 포위망 총싸|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|C014|무신 반란|전관(에서) (변호사) 빨리 승|CANDIDATE|APP_REWRITTEN_FROM_FACT_STRUCTURE|전 · 관 · 빨리 · 승|
|C015|무신 반란|효심(에는) 이의있삼?|CANDIDATE|APP_REWRITTEN_FROM_FACT_STRUCTURE|효심 · 이의 · 있삼|
|C016|최충헌 시기|(똘끼)충만 광수구이|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|충 · 만 · 광수 · 구이|
|C017|최우 시기|나란히 (태어난) 연년생의 우(정)|CANDIDATE|APP_REWRITTEN_FROM_FACT_STRUCTURE|나란히 · 연년생 · 우|
|C018|전시과의 변화|(성)시경 개목(걸이) (김)경문껀데...|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|C019|세습전|신음장인(이)여|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|신 · 음 · 장 · 인 · 여|
|C020|지눌|돈오(가) 점수(를 잘 받아서 여자친구), 정혜(가)쌍수(를 들고 환영한다)|VERIFIED|APP_REWRITTEN_FROM_FACT_STRUCTURE|지눌: 돈오점수 · 정혜쌍수|
|D001|정도전 저서|삼진경고불조심|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|삼 · 진 · 경 · 고 · 불 · 조 · 심|
|D002|태종|6조 신사의계 창사 양호|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D003|세종|조공왕 갑칠(이는) 내집(에서) 혼자 농삼향의 총여정(을) 앙측(했다)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D004|세조|보육원 간 유경이 집세 진(짜) 오직 6(원)?|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D005|성종|홍경사(가) 관사(에서) 국악(을) 동동동|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D006|5군영|훈어총수금|VERIFIED|COMMON_SHORT_FORM_REVIEWED|훈어총수금|
|D007|왜란 전후|왜! 쓰삼계삼 사정을(해서) 임신(했다)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D008|환국|경기갑신 서남소노|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D009|정조 편찬사업|정일 홍대 동무 고추탁|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|정 · 일 · 홍 · 대 · 동 · 무 · 고 · 추 · 탁|
|D010|정조의 정책|서초구 거상 윤건 화장대 만행 수공!|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D011|영조의 정책|동서! 청계산 노모탕 사랑균 신속(하)군|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|동 · 서 · 청 · 산 · 노 · 모 · 탕 · 사 · 랑 · 균 · 신 · 속 · 군|
|D012|천주교 박해|(박)신(혜는)신기(해)오(지랖도)병(인가)?|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D013|민정문서|민정(이)삼촌(이) 내연관(계인) 서원경(씨에게) 십일조(라니) 사람(이) 호구(네)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D014|토지측량 단위|백두 고경 신결|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D015|상업사|지방 한선경(이) 대만주(를 먹고) 개인방송(을 해서) 동대상(탔다)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D016|골품과 관등 제한|6두품*1=6관등 / 5두품*2=10관등 / 4두품*3=12관등|VERIFIED|APP_REWRITTEN_FROM_FACT_STRUCTURE|6×1 · 5×2 · 4×3|
|D017|최치원|난 제사(라면), 개토해|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D018|원효|원 아(바타) 일심 금화십대|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D019|의상|(그녀의) 의상 관음 화 엄(청 낸다)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D020|5교|복사 열(받아) 뽀(드득) 계율 통(닭 사)장 상종(해선 안되네)금|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D021|9산|일(용)엄(니는) 미사(를 찍으러 거기)가도 (조폭)홍산파, 무주파(가 있어서 못찍었다)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D022|정혜공주묘|식혜 6(개) 사자|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D023|무덤 양식|굴(식)돌(방)무덤 = 식방= 식빵|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D024|돌무지무덤|고구려 초무무 / 백제 한계무무|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D025|역법|당선(되고) 원수(됬다) (이)명(박) 대(통령)|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|당 · 선 · 원 · 수 · 명 · 대|
|D026|목조건축|(안동가서) 봉(사하면) 극락(가고) 예수(된다)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D027|활자인쇄술|(태종때는) 소자 (세종때는) 대자|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D028|그림|몽고임금|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D029|홍대용|홍대 중상학(부) (수학과) 주담임 (이)균전(을) 의지(가) 무한(하다)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D030|건축|금미 화각 법팔 논쌍 부개 안석|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|금 · 미 · 화 · 각 · 법 · 팔 · 논 · 쌍 · 부 · 개 · 안 · 석|
|D031|조광조|소방소도 위헌 경향이있다|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|D032|임진왜란 전개|충신선의 옥사당한 이순신 진주에서 양주를 피토하며 명량하게 마신다|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|E001|통상수교거부|병(이)제 병문한 정양 오신 초덕광 척|VERIFIED|APP_REWRITTEN_FROM_FACT_STRUCTURE|병제병문한정양 · 오신초덕광척|
|E002|강화도조약 이후|수일(이는) 미수(다) 이 규약(은) 무역 통일(이다)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|E003|개항 순서|미 명동 이너프|CANDIDATE|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|E004|갑신정변 이후|갑한톈 거방 교동갑청|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|갑 · 한 · 톈 · 거 · 방 · 교 · 동 · 갑 · 청|
|E005|갑신정변 14개조|순(수한) 근혜 환(갑까지) 지조(지키니) 내시(들이) 호(시)탐(탐) (사)귀(자고) (매달린다)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|E006|동학농민운동|고백(을) 장황(하게) (하기)전 고집(있는) 공주(인지) (확인해라)|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|고 · 백 · 장 · 황 · 전 · 교 · 집 · 공주|
|E007|폐정개혁안|왜노무(새끼가) 과부(의) 토지 천평(을) (공)사(함)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|E008|갑오개혁 1차|은경(이)의 궁금(증은) 노비(가) 딱(했냐는거야)|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|은 · 경 · 의 · 궁 · 금 · 노비 · 탁|
|E009|갑오개혁 2차|홍재교 부부훈시|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|E010|갑오개혁 3차|우친소 건진 단태종|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|우 · 친 · 소 · 건 · 진 · 단 · 태 · 종|
|E011|홍범14조|홍병일(은) 자아(가) 분리 유인|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|E012|헌의6조|환자중의 입(을) 탁(치자) 피(가) 척|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|E013|고종 연호|강국양광희|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|E014|을미의병|허기(진)유이|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|E015|애국계몽단체|보안(팀) 헌정(이는) 한자협회 신민(아다)|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|보안 · 헌정 · 한자 · 협회 · 신민|
|E016|신문|한(국의) 독(한) 황제(는) 대만(을) 경매(했다)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|E017|근대교육 1880년대|원(산에서) 동경(까지) 배(타고) 26(km)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|E018|근대교육 1890년대|교육(받는) 소사(범은) 외국어 중(급)|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|교육 · 소 · 사 · 외국어 · 중|
|E019|근대교육 1900년대|흥화점(에) 보양(식은) 명문오댕|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|E020|국권피탈 과정|의정(부) 12(사단에는) 해신 기간병(있다)|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|의정 · 1 · 2 · 해 · 신 · 기 · 간 · 병|
|F001|비밀결사|독(서)광 여자 송(중)기|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|F002|1910년대 남만주|남산경(치) 부흥(한건) 서로(의 덕)|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|남 · 삼/산 · 경 · 부 · 흥 · 서로|
|F003|중국 본토|하이(네) 동(네) 새로운 음식(맛있어) 귀여(운) 청년(들은) 상해(도 먹는다)|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|하이 · 동 · 신 · 은식 · 규 · 여 · 청년 · 상해|
|F004|북간도|북한 서명(하면) 종북|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|북 · 간 · 서 · 명 · 중/종 · 북|
|F005|연해주|신한(은행) 의성업(은) 전한(길) 정부(로부터 시작되었다)|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|신한 · 의 · 성 · 업 · 전 · 한 · 정부|
|F006|미국|미스흥 공대의 국민|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|F007|1920년대 만주|삼봉 춘천 경유시 3미 운동|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|삼 · 봉 · 춘 · 천 · 경 · 유시 · 3 · 미 · 운동|
|F008|청산리대첩|청산리 고(등)어 천 백(원)|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|청산리 · 고 · 어 · 천 · 백|
|F009|1930년대|대전(에) 쌍사(자) 동(물원은) 북(이) 독립|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|대전 · 쌍 · 사 · 동 · 북 · 독립|
|F010|국민부·조선혁명군|국민 남(편) (양세봉) 영흥(에서) 혁명(하다 죽었다)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|F011|신간회 강령|경 단 기|VERIFIED|APP_REWRITTEN_FROM_FACT_STRUCTURE|경단기|
|F012|신채호|신생아 사청가|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|F013|박은식|박혼식 지혈(이) 통(안돼)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|F014|문일평·정인보·안재홍|문심평 정얼보 감홍시|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|F015|국제회의와 광복|카얄포 광 건모|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|카 · 얄 · 포 · 광 · 건 · 모|
|F016|광복 직후 정당·단체|한국독립(에) 조인(한) 국민(에게) 한민(관이) 조공(을) 독촉(한다.)|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|한국독립 · 조인 · 국민 · 한민 · 조공 · 독촉|
|F017|6·25 전쟁|똥침 → 남침|VERIFIED|APP_REWRITTEN_FROM_FACT_STRUCTURE|남침에서 시작된 6·25 전쟁|
|F018|노태우 정부|칙칙(한) 고위급 (노태우는) 유기농 핵|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|F019|김대중 정부|햇병아리 중딩 급사정(하여) (소금) 62개(받아오다)|REVIEW_REQUIRED|USER_SUPPLIED_INTERNAL_REVIEW_ONLY|EXCLUDED|
|F020|김영삼 정부|UWOI|REVIEW_REQUIRED|APP_REWRITTEN_FROM_FACT_STRUCTURE|U · W · O · I|

## Official Questions

|topic|relatedOfficialQuestionIds|question count|
|---|---|---:|
|A001 세계기록유산|official-57-basic-46, official-57-advanced-27, official-57-advanced-39, official-57-basic-26, official-57-advanced-26, official-73-advanced-19, official-57-basic-15, official-61-basic-15, official-64-basic-13, official-57-basic-49, official-57-advanced-49, official-58-basic-44|12|
|A002 세계문화유산|official-61-basic-08, official-67-basic-09, official-59-advanced-24, joseon-official-73-advanced-22, official-74-advanced-19, official-57-advanced-21, official-58-basic-23, official-63-basic-24, official-57-advanced-01, official-60-advanced-01, official-61-basic-01|11|
|A003 조선시대 궁궐|official-57-basic-34, official-59-advanced-26, official-61-basic-19, official-59-advanced-24, joseon-official-73-advanced-22, official-74-advanced-19, official-60-advanced-32, official-61-basic-35, official-72-advanced-35|9|
|A004 전기 유적지|official-75-basic-01, official-76-advanced-01, official-66-advanced-01|3|
|A005 중기 유적지||0|
|A006 후기 유적지||0|
|A007 유적지|official-74-advanced-01, official-61-advanced-01, official-58-advanced-01, official-67-basic-49, official-69-advanced-01|5|
|A008 토기|official-61-advanced-01, official-58-advanced-01, official-63-basic-01|3|
|A009 좁쌀||0|
|A010 벼농사|official-61-basic-01, official-65-advanced-01, official-73-advanced-01, official-72-advanced-01, official-77-advanced-01|5|
|A011 토기|official-61-basic-01, official-62-advanced-01, official-73-advanced-01|3|
|A012 토기|official-61-basic-01, official-62-advanced-01, official-73-advanced-01|3|
|A013 세력 범위|official-58-basic-01, official-62-advanced-01, official-64-basic-01|3|
|A014 8조법|official-59-advanced-45, official-69-advanced-45, official-71-advanced-19|3|
|A015 제천행사|official-57-basic-09, official-57-advanced-46, official-58-basic-04, official-58-advanced-06, official-60-advanced-02, official-57-basic-04, official-57-basic-05, official-57-basic-06, official-57-advanced-03, official-57-basic-02, official-63-advanced-02, official-64-basic-02|12|
|B001 왕과 업적|official-61-advanced-06, official-62-advanced-04, official-68-advanced-08, official-63-advanced-03, official-65-advanced-07, official-67-advanced-17, official-57-advanced-04, official-57-advanced-36, official-58-basic-15, official-65-advanced-05|10|
|B002 소지왕|official-57-basic-04, official-57-basic-05, official-57-basic-09|3|
|B003 진흥왕|official-58-basic-04, official-63-advanced-07, official-63-advanced-27, official-57-basic-22, official-60-advanced-30, official-64-advanced-30, official-64-advanced-27, official-67-basic-28|8|
|B004 반란사|official-57-advanced-08, official-58-basic-09, official-58-advanced-07, official-67-advanced-08, official-79-advanced-10, official-73-advanced-07, official-75-advanced-06, official-58-basic-16, official-59-advanced-08, official-62-advanced-09, official-57-basic-38, official-59-advanced-29|12|
|B005 연호|official-64-basic-09, official-78-advanced-09, official-65-advanced-07, official-79-advanced-07, official-75-advanced-08|5|
|B006 고왕|official-57-basic-05, official-57-advanced-12, official-57-advanced-14, official-57-basic-29, official-61-basic-47, official-75-advanced-18, official-58-basic-08, official-64-basic-09, official-73-basic-09|9|
|B007 무왕|official-57-basic-08, official-61-advanced-10, official-63-basic-06, official-65-advanced-07, official-75-advanced-08, official-79-advanced-07|6|
|B008 문왕|official-57-advanced-08, official-58-basic-09, official-58-advanced-07, official-65-advanced-07, official-71-basic-09, official-78-advanced-09, official-57-advanced-09, official-58-advanced-08, official-59-advanced-09|9|
|B009 선왕|official-57-basic-07, official-57-basic-26, official-57-advanced-09, official-64-basic-09, official-78-advanced-09, official-59-advanced-09|6|
|B010 9서당|official-57-advanced-08, official-58-basic-09, official-58-advanced-07, official-57-basic-04, official-57-basic-05, official-57-basic-06, official-57-basic-09, official-61-advanced-10|8|
|B011 후삼국 성립|official-60-advanced-43, official-72-advanced-32, official-75-basic-31, official-63-basic-11, official-75-basic-11, official-77-basic-31, official-57-advanced-10, official-67-basic-29|8|
|C001 고려 건국과 민족 재통일|official-57-advanced-10, official-58-advanced-49, official-61-basic-50, official-58-basic-11, official-64-advanced-50, official-71-advanced-18, official-58-advanced-09, ch01-official-70-advanced-10, official-78-advanced-10|9|
|C002 광종의 왕권 강화|official-57-advanced-12, official-58-basic-12, official-62-advanced-49, official-64-basic-10, official-71-basic-11, official-58-advanced-12, joseon-official-73-advanced-30, official-78-advanced-15, official-63-advanced-12, ch03-official-68-advanced-11, official-63-advanced-09|11|
|C003 성종|official-61-advanced-07, official-77-basic-21, official-57-basic-07, official-57-advanced-09, official-61-basic-09, ch04-official-65-advanced-11, official-66-basic-13, ch04-official-68-advanced-09, official-61-basic-49, official-62-advanced-41, official-71-basic-07, official-58-basic-18|12|
|C004 문종|official-58-advanced-12, joseon-official-73-advanced-30, official-74-advanced-15, official-63-advanced-18, official-65-advanced-13, official-77-advanced-37, official-68-advanced-12, ch06-official-70-advanced-13, official-58-basic-13, official-59-advanced-10, official-64-advanced-12, official-63-basic-13|12|
|C005 현종|official-64-advanced-43, official-58-advanced-43, official-60-advanced-14, official-63-basic-21, ch06-official-65-advanced-12, official-67-advanced-12, official-71-basic-13, ch06-official-77-advanced-11, official-71-basic-17, official-77-basic-18|10|
|C006 숙종|official-57-basic-28, official-58-basic-17, official-59-advanced-11, official-64-basic-50, official-71-advanced-13, official-60-advanced-28, official-62-advanced-12, official-66-basic-13, ch09-official-69-basic-12, official-72-advanced-27|10|
|C007 예종|official-57-basic-12, official-57-basic-50, official-57-advanced-16, official-60-advanced-27, official-64-basic-50, official-63-advanced-13, ch03-pdf-76-advanced-11, official-70-advanced-48, official-58-advanced-12, joseon-official-73-advanced-30, official-74-advanced-15|11|
|C008 충선왕|official-58-basic-16, official-71-advanced-17, official-74-advanced-09|3|
|C009 공민왕|official-57-advanced-15, official-58-advanced-38, official-59-advanced-13, official-64-advanced-50, ch12-official-75-basic-14, official-75-advanced-15, official-64-advanced-15, official-57-basic-12, official-60-advanced-27, official-62-advanced-18, official-61-basic-18, official-63-advanced-17|12|
|C010 우왕|official-61-basic-18, official-63-advanced-17, official-64-basic-17, official-68-advanced-48, official-57-basic-19, official-61-advanced-19, official-67-basic-17, official-58-basic-19|8|
|C011 무신정권|official-61-basic-10, official-61-advanced-13, ch09-official-66-advanced-14, official-60-advanced-15, official-61-advanced-17, official-62-advanced-17|6|
|C012 급진개혁파|official-57-basic-22, official-57-advanced-35, official-67-basic-31, official-58-advanced-17, official-71-advanced-19, official-75-advanced-19|6|
|C013 무신 반란|official-61-basic-48, official-66-advanced-47, official-69-basic-45, official-61-basic-16, official-67-basic-49, official-71-basic-15, official-57-advanced-43|7|
|C014 무신 반란|official-57-basic-33, official-57-advanced-39, official-58-advanced-29, ch09-official-66-advanced-14|4|
|C015 무신 반란|ch09-official-66-advanced-14, ch10-official-72-advanced-14, ch10-official-74-advanced-14|3|
|C016 최충헌 시기|official-61-basic-10, official-61-advanced-13, ch09-official-66-advanced-14, official-64-basic-14|4|
|C017 최우 시기|official-60-advanced-15, official-61-advanced-17, official-62-advanced-17|3|
|C018 전시과의 변화|official-72-advanced-47, official-58-basic-13, official-59-advanced-10, official-64-advanced-12|4|
|C019 세습전|official-66-advanced-10, official-67-advanced-18|2|
|C020 지눌|official-63-advanced-16, ch09-official-74-advanced-16, official-70-advanced-12, official-77-basic-17|4|
|D001 정도전 저서|joseon-official-73-advanced-20, official-57-basic-22, official-67-basic-31, official-68-advanced-18|4|
|D002 태종|official-57-basic-23, official-57-advanced-17, official-57-advanced-20, official-68-advanced-24, official-59-advanced-19, official-61-basic-22, official-64-basic-19, official-66-basic-19, official-67-advanced-28, official-65-advanced-28, official-72-advanced-18, joseon-official-74-advanced-26|12|
|D003 세종|official-68-advanced-22, official-75-basic-29, official-64-advanced-17, official-58-basic-20, official-64-basic-18, official-66-basic-22, official-60-advanced-20, official-62-advanced-21, official-57-advanced-09, official-62-advanced-26, official-66-advanced-10, official-63-basic-18|12|
|D004 세조|official-57-basic-23, official-57-advanced-20, official-63-advanced-21, official-57-advanced-24, official-58-advanced-24, official-60-advanced-20, official-62-advanced-21, official-64-advanced-17, official-57-advanced-18, official-66-basic-20, official-61-basic-20, official-57-advanced-17|12|
|D005 성종|official-60-advanced-20, official-61-basic-22, official-63-basic-19, official-57-advanced-24, official-58-advanced-24, official-64-advanced-22, official-70-advanced-19, official-67-basic-18, official-61-advanced-20, official-73-advanced-03, official-61-advanced-29|11|
|D006 5군영|official-58-advanced-21, official-61-basic-21, official-63-basic-25, official-63-advanced-24, official-67-advanced-26, official-69-basic-06, official-69-advanced-47, joseon-official-77-advanced-24|8|
|D007 왜란 전후|joseon-official-77-advanced-23, official-59-advanced-26|2|
|D008 환국|official-57-advanced-35, official-61-basic-23, official-61-basic-40, official-61-advanced-23, official-72-advanced-26, joseon-official-74-advanced-22|6|
|D009 정조 편찬사업|official-57-basic-17, official-57-advanced-24, official-59-advanced-24, official-57-basic-26, official-57-advanced-26, official-73-advanced-19, official-64-advanced-26, official-72-advanced-28, joseon-official-77-advanced-26|9|
|D010 정조의 정책|official-57-basic-17, official-59-advanced-27, official-62-advanced-27, official-63-basic-28, official-64-advanced-27, official-66-basic-29, official-57-advanced-24, official-59-advanced-24, official-65-advanced-24|9|
|D011 영조의 정책|joseon-official-79-advanced-23, official-57-advanced-12, official-58-basic-12, official-61-basic-10, official-69-basic-27, official-58-basic-25, official-66-basic-26, official-68-advanced-24, official-58-advanced-24, official-63-advanced-19, official-66-advanced-23|11|
|D012 천주교 박해|joseon-official-77-advanced-29, official-79-advanced-28|2|
|D013 민정문서|official-63-basic-08, official-60-advanced-16, official-61-basic-30, official-63-basic-50, official-57-basic-05, official-57-basic-10, official-57-basic-11|7|
|D014 토지측량 단위|official-57-basic-04, official-57-basic-05, official-57-basic-09, official-57-basic-06|4|
|D015 상업사|official-58-basic-04, official-58-advanced-03, official-61-basic-02, official-60-advanced-35, official-67-advanced-30, official-68-advanced-32, official-78-advanced-14, official-58-advanced-23, official-70-advanced-25, official-58-basic-32, official-58-basic-41, official-58-advanced-12|12|
|D016 골품과 관등 제한|official-57-advanced-08, official-64-advanced-43, official-69-advanced-02, official-61-basic-11, official-61-basic-17, official-61-advanced-22|6|
|D017 최치원|official-64-advanced-09, official-69-basic-48, official-76-advanced-08|3|
|D018 원효|official-61-advanced-05, official-64-basic-49, official-71-basic-08, official-69-basic-07|4|
|D019 의상|official-57-basic-47, official-57-advanced-34, official-58-basic-18, official-61-advanced-15, official-67-advanced-06, official-60-advanced-07, official-63-basic-22|7|
|D020 5교|official-60-advanced-04, official-71-advanced-08, official-77-basic-39, official-64-basic-08, ch02-official-66-advanced-09, official-67-advanced-10|6|
|D021 9산|official-57-advanced-13, official-57-advanced-25, official-58-basic-48|3|
|D022 정혜공주묘|official-66-advanced-03, official-72-advanced-07, official-64-basic-09, official-71-basic-09|4|
|D023 무덤 양식|official-57-basic-04, official-57-basic-05, official-57-basic-06|3|
|D024 돌무지무덤||0|
|D025 역법|official-73-advanced-02, joseon-official-76-advanced-22, official-64-advanced-25|3|
|D026 목조건축|official-57-advanced-15, official-73-basic-12, ch10-official-65-advanced-17, official-75-advanced-37, official-58-basic-10, official-59-advanced-15, official-63-basic-16|7|
|D027 활자인쇄술|official-60-advanced-46, official-65-advanced-28, official-72-advanced-18, joseon-official-74-advanced-26, official-64-advanced-17|5|
|D028 그림|official-65-advanced-22, official-58-advanced-08, official-62-advanced-07, official-63-advanced-03, official-59-advanced-25, joseon-official-73-advanced-26|6|
|D029 홍대용|joseon-official-79-advanced-25, official-63-basic-27|2|
|D030 건축|official-64-basic-08, ch02-official-66-advanced-09, official-67-advanced-10, official-57-advanced-34, official-60-advanced-07, official-63-basic-22, official-57-basic-27, official-70-advanced-22, official-58-advanced-29, official-67-advanced-16, official-67-advanced-32, official-57-basic-33|12|
|D031 조광조|official-57-basic-21, official-61-basic-32, official-64-advanced-23, official-64-advanced-33, official-65-advanced-40, official-76-advanced-37, official-58-basic-50, official-58-advanced-28, official-63-basic-20|9|
|D032 임진왜란 전개|official-59-advanced-48, official-60-advanced-25, official-57-advanced-09, official-58-basic-50, official-58-advanced-28, official-57-basic-25, official-58-basic-03, official-62-advanced-04, official-64-basic-03, official-71-basic-23|10|
|E001 통상수교거부|joseon-official-77-advanced-29, official-79-advanced-28, official-67-basic-32, official-69-advanced-29, joseon-official-76-advanced-29, official-60-advanced-31, official-61-basic-28, official-61-advanced-31, official-64-advanced-28, official-66-basic-30, official-62-advanced-30, official-63-basic-29|12|
|E002 강화도조약 이후|official-62-advanced-33, official-63-basic-31, official-64-advanced-49, official-61-basic-29, official-71-basic-27, official-76-advanced-30, official-61-advanced-25, official-67-advanced-30, official-71-advanced-29, official-57-advanced-34|10|
|E003 개항 순서|official-57-basic-32, official-57-basic-37, official-57-advanced-46, official-58-advanced-50, official-65-advanced-32, official-66-basic-34, official-65-advanced-29, official-72-advanced-43, official-57-basic-34, official-59-advanced-30, official-61-basic-28, official-63-advanced-28|12|
|E004 갑신정변 이후|official-59-advanced-32, official-64-advanced-30, official-66-basic-33, official-57-advanced-27, official-63-advanced-30, official-66-advanced-29, official-66-basic-34, official-69-advanced-38, official-63-basic-38, official-62-advanced-32, official-79-basic-31, official-63-basic-33|12|
|E005 갑신정변 14개조||0|
|E006 동학농민운동|official-79-basic-31, official-57-basic-33, official-61-basic-31, official-62-advanced-32, official-66-basic-37, official-73-basic-32|6|
|E007 폐정개혁안||0|
|E008 갑오개혁 1차|official-63-advanced-32, official-58-basic-24, official-59-advanced-19, official-63-advanced-26, official-57-advanced-27, official-63-basic-33, official-64-advanced-31|7|
|E009 갑오개혁 2차|official-59-advanced-49, official-60-advanced-27, official-72-advanced-32, official-64-advanced-43, official-60-advanced-34, official-68-advanced-35, official-74-advanced-32|7|
|E010 갑오개혁 3차|official-71-advanced-31, official-77-advanced-30, official-64-advanced-33, official-65-advanced-40, official-76-advanced-37, official-58-advanced-32, official-73-basic-37, official-72-advanced-32, official-79-advanced-33|9|
|E011 홍범14조|official-63-basic-34, official-75-advanced-38, official-77-basic-33, official-58-basic-24, official-59-advanced-19, official-63-advanced-26, official-66-advanced-39, official-67-advanced-43, official-77-basic-36|9|
|E012 헌의6조|official-57-advanced-31, official-58-basic-32, official-61-basic-33, official-62-advanced-36, official-65-advanced-36, official-67-advanced-34, official-60-advanced-37, official-60-advanced-47|8|
|E013 고종 연호|official-57-basic-22, official-60-advanced-30, official-64-advanced-30, official-58-advanced-32, official-71-advanced-31, official-57-basic-34, official-59-advanced-37, official-61-basic-35|8|
|E014 을미의병|official-65-advanced-33, official-78-advanced-33, official-61-basic-16|3|
|E015 애국계몽단체|official-57-advanced-40, official-65-advanced-35, official-66-advanced-33, official-59-advanced-33, official-61-basic-27, official-61-advanced-36|6|
|E016 신문|official-61-advanced-34, official-72-advanced-29, official-57-basic-37, official-61-basic-33, official-73-basic-34, official-60-advanced-36, official-61-advanced-35, official-62-advanced-34, official-59-advanced-39|9|
|E017 근대교육 1880년대|official-67-advanced-33, official-78-advanced-30, official-60-advanced-32, official-61-advanced-42, official-65-advanced-39, official-61-basic-27, official-60-advanced-27, official-62-advanced-35, official-63-basic-32|9|
|E018 근대교육 1890년대|official-60-advanced-27, official-72-advanced-32, official-64-advanced-33, official-65-advanced-40, official-76-advanced-37, official-59-advanced-33|6|
|E019 근대교육 1900년대|official-61-advanced-36, official-63-basic-36, official-64-advanced-33, official-59-advanced-33, official-61-basic-27|5|
|E020 국권피탈 과정|official-65-advanced-32, official-58-advanced-31, official-60-advanced-34, official-65-advanced-33, official-64-advanced-35, official-69-advanced-34|6|
|F001 비밀결사|official-63-advanced-35, official-69-basic-32, official-75-basic-39|3|
|F002 1910년대 남만주|official-70-advanced-34, official-73-advanced-36, official-76-advanced-41, official-62-advanced-39|4|
|F003 중국 본토|official-57-basic-37, official-58-basic-34, official-60-advanced-40, official-63-advanced-10, official-57-advanced-35, official-57-basic-44, official-58-basic-41, official-58-advanced-39, official-60-advanced-41, official-64-basic-42, official-67-advanced-44|11|
|F004 북간도|official-57-advanced-44, official-67-basic-35, official-68-advanced-40, official-70-advanced-37, official-72-advanced-37, official-61-basic-37, official-61-advanced-44, official-64-basic-35|8|
|F005 연해주|official-72-advanced-38, official-75-basic-40|2|
|F006 미국|official-57-basic-32, official-57-basic-37, official-57-advanced-46, official-79-basic-43, official-77-basic-34, official-78-advanced-35, official-75-basic-34, official-58-advanced-33, official-62-advanced-38, official-74-advanced-33|10|
|F007 1920년대 만주|official-58-basic-36, official-59-advanced-36, official-64-basic-35, official-61-basic-37, official-69-advanced-36, official-61-basic-03, official-64-advanced-43, official-67-basic-14, official-57-advanced-42, official-58-basic-39|10|
|F008 청산리대첩|official-61-basic-37, official-64-basic-35|2|
|F009 1930년대|official-57-basic-41, official-62-advanced-39, official-63-basic-41, official-63-advanced-36, official-75-basic-43, official-67-advanced-39, official-74-advanced-42|7|
|F010 국민부·조선혁명군|official-63-advanced-36, official-77-advanced-41, official-69-basic-34, official-75-basic-43, official-63-basic-41, official-62-advanced-39|6|
|F011 신간회 강령||0|
|F012 신채호|official-66-advanced-30, official-67-advanced-42, official-72-advanced-42, official-60-advanced-35|4|
|F013 박은식|official-57-advanced-35|1|
|F014 문일평·정인보·안재홍|official-67-advanced-42|1|
|F015 국제회의와 광복|official-58-basic-41, official-63-basic-43, official-69-basic-36, official-61-basic-44, official-69-basic-41|5|
|F016 광복 직후 정당·단체|official-64-advanced-42, official-67-advanced-39, official-70-advanced-41, official-65-advanced-43, official-69-advanced-41|5|
|F017 6·25 전쟁||0|
|F018 노태우 정부|official-70-advanced-43, official-61-basic-46, official-67-basic-45, official-73-basic-50|4|
|F019 김대중 정부|official-69-basic-45, official-74-advanced-49, official-78-advanced-49, official-61-advanced-50, official-74-advanced-48, official-73-advanced-50, official-57-basic-48, official-59-advanced-50, official-62-advanced-47|9|
|F020 김영삼 정부||0|

## Story Mapping

|topic|relatedSceneIds|
|---|---|
|A001 세계기록유산||
|A002 세계문화유산|joseon_ch12_s2|
|A003 조선시대 궁궐|joseon_ch12_s2|
|A004 전기 유적지||
|A005 중기 유적지||
|A006 후기 유적지||
|A007 유적지||
|A008 토기||
|A009 좁쌀||
|A010 벼농사||
|A011 토기||
|A012 토기||
|A013 세력 범위||
|A014 8조법||
|A015 제천행사||
|B001 왕과 업적||
|B002 소지왕||
|B003 진흥왕||
|B004 반란사||
|B005 연호||
|B006 고왕||
|B007 무왕||
|B008 문왕||
|B009 선왕||
|B010 9서당||
|B011 후삼국 성립||
|C001 고려 건국과 민족 재통일|ch01_victory|
|C002 광종의 왕권 강화|joseon_ch20_s3, ch02_night_discussion|
|C003 성종|ch03_gukjagam, ch02_policy_reason, ch02_hyunwoo_official|
|C004 문종|joseon_ch20_s3, ch06_burned_market, ch02_purge|
|C005 현종|ch06_flight, ch06_woodblocks|
|C006 숙종|ch09_economy|
|C007 예종|ch02_exam_notice, joseon_ch20_s3|
|C008 충선왕||
|C009 공민왕|ch12_wihwa|
|C010 우왕||
|C011 무신정권|ch09_choe|
|C012 급진개혁파||
|C013 무신 반란||
|C014 무신 반란|ch09_choe|
|C015 무신 반란|ch09_choe, ch10_return|
|C016 최충헌 시기|ch09_choe|
|C017 최우 시기||
|C018 전시과의 변화||
|C019 세습전||
|C020 지눌|ch09_jinul|
|D001 정도전 저서|joseon_ch01_s3|
|D002 태종|joseon_ch20_s5|
|D003 세종||
|D004 세조||
|D005 성종||
|D006 5군영|joseon_ch17_s3|
|D007 왜란 전후|joseon_ch20_s5|
|D008 환국|joseon_ch17_s2|
|D009 정조 편찬사업|joseon_ch19_s3|
|D010 정조의 정책||
|D011 영조의 정책|joseon_ch18_s1|
|D012 천주교 박해|joseon_ch22_s2|
|D013 민정문서||
|D014 토지측량 단위||
|D015 상업사||
|D016 골품과 관등 제한||
|D017 최치원||
|D018 원효||
|D019 의상||
|D020 5교|ch01_gyeonhwon|
|D021 9산||
|D022 정혜공주묘||
|D023 무덤 양식||
|D024 돌무지무덤||
|D025 역법|joseon_ch08_s2|
|D026 목조건축|ch10_celadon|
|D027 활자인쇄술|joseon_ch20_s5|
|D028 그림|joseon_ch19_s1|
|D029 홍대용|joseon_ch19_s1|
|D030 건축|ch01_gyeonhwon|
|D031 조광조||
|D032 임진왜란 전개||
|E001 통상수교거부|joseon_ch22_s2, joseon_ch18_s2|
|E002 강화도조약 이후||
|E003 개항 순서||
|E004 갑신정변 이후||
|E005 갑신정변 14개조||
|E006 동학농민운동||
|E007 폐정개혁안||
|E008 갑오개혁 1차||
|E009 갑오개혁 2차||
|E010 갑오개혁 3차||
|E011 홍범14조||
|E012 헌의6조||
|E013 고종 연호||
|E014 을미의병||
|E015 애국계몽단체||
|E016 신문||
|E017 근대교육 1880년대||
|E018 근대교육 1890년대||
|E019 근대교육 1900년대||
|E020 국권피탈 과정||
|F001 비밀결사||
|F002 1910년대 남만주||
|F003 중국 본토||
|F004 북간도||
|F005 연해주||
|F006 미국||
|F007 1920년대 만주||
|F008 청산리대첩||
|F009 1930년대||
|F010 국민부·조선혁명군||
|F011 신간회 강령||
|F012 신채호||
|F013 박은식||
|F014 문일평·정인보·안재홍||
|F015 국제회의와 광복||
|F016 광복 직후 정당·단체||
|F017 6·25 전쟁||
|F018 노태우 정부||
|F019 김대중 정부||
|F020 김영삼 정부||

## Problems

- OCR suspected / historical verification needed: A001, A002, A004, A005, A006, A013, A014, B001, B003, B004, B008, B010, B011, C003, C004, C005, C007, C009, C011, C012, C013, C016, C018, C019, D001, D002, D003, D004, D005, D007, D008, D009, D010, D011, D012, D013, D014, D015, D017, D018, D019, D020, D021, D022, D023, D024, D025, D026, D027, D028, D029, D030, D031, D032, E002, E004, E005, E006, E007, E008, E009, E010, E011, E012, E013, E014, E015, E016, E017, E018, E019, E020, F001, F002, F003, F004, F005, F006, F007, F008, F009, F010, F012, F013, F014, F015, F016, F018, F019, F020
- Candidate review: A007, A008, A009, A010, A011, A012, B002, B005, B006, B007, B009, C006, C008, C010, C014, C015, C017, E003
- Duplicate removed: 0
- Inventory missing: 0
- UI missing among approved records: 0
- Copyright review: 69
- Missing official questions: 9
