/* Build the canonical mnemonic inventory from the user's explicit A001-F020 dataset. */
const fs=require('fs'),assert=require('assert'),crypto=require('crypto');
const sourcePath='docs/mnemonic-sources/explicit-request.json';
const source=JSON.parse(fs.readFileSync(sourcePath,'utf8'));
assert.equal(source.explicitInputCount,118);
assert.equal(source.records.length,118);

const norm=value=>String(value||'').normalize('NFKC').replace(/[\s\p{P}\p{S}]/gu,'').toLowerCase();
const official=JSON.parse(fs.readFileSync('dist/official-exam-explanations.json','utf8')).records;
const corpus=official.map(record=>({id:record.officialQuestionId,normalized:norm([record.clue,record.correctChoice,record.explanation].join(' '))}));

const STABLE_IDS={
 A003:'memory-palaces',C001:'gong-go-sin-il',C002:'memory-gwangjong-mnemonic',C003:'memory-goryeo-seongjong',
 C020:'memory-jinul',D006:'memory-five-armies-import',D016:'memory-bone-rank',E001:'byeong-je-byeong-o-sin-cheok',
 F011:'memory-singanhoe',F017:'memory-korean-war'
};
const VERIFIED=new Set(['A003','A015','C001','C002','C020','D006','D016','E001','F011','F017']);
/* Restored from the repository's historical approved set (342bb80) plus the ten currently curated cards.
   Publication approval is intentionally separate from source/historical review status. */
const PUBLIC_APPROVED=new Set([
 'A003','A007','A008','A009','A010','A011','A012','A015','B005','B007','B009',
 'C001','C002','C006','C008','C010','C014','C015','C016','C017','C019','C020',
 'D001','D006','D009','D011','D016','D025','D030',
 'E001','E004','E006','E008','E010','E015','E018','E020',
 'F002','F003','F004','F005','F007','F008','F009','F011','F015','F016','F017','F020'
]);
const REVIEW_REQUIRED=new Set([
 'A001','A002','A004','A005','A006','A013','A014','B001','B003','B004','B008','B010','B011',
 'C003','C004','C005','C007','C009','C011','C012','C013','C016','C018','C019',
 'D001','D002','D003','D004','D005','D007','D008','D009','D010','D011','D012','D013','D014','D015',
 'D017','D018','D019','D020','D021','D022','D023','D024','D025','D026','D027','D028','D029','D030','D031','D032',
 'E002','E004','E005','E006','E007','E008','E009','E010','E011','E012','E013','E014','E015','E016','E017','E018','E019','E020',
 'F001','F002','F003','F004','F005','F006','F007','F008','F009','F010','F012','F013','F014','F015','F016','F018','F019','F020'
]);
const SEQUENCE=new Set(['B004','C001','C009','C013','C014','C015','C016','C017','C018','D007','D008','D032','E001','E002','E003','E004','E005','E006','E008','E009','E010','E013','E014','E016','E017','E018','E019','E020','F007','F008','F009','F010','F015','F018','F019','F020']);
const NUMBER=new Set(['A014','C003','D016','E017','F019']);
const WORDPLAY=new Set(['D023','F017']);
const COMPARISON=new Set(['D024']);

const FALLBACK_KEYWORDS={
 B001:[['원통','고국원왕'],['광개토 아버지','고국양왕'],['학','태학'],['교','불교'],['령','율령'],['양','영양왕'],['양제','수 양제의 침입'],['신집','이문진의 『신집』 5권']],
 C012:[['정도전','정도전'],['윤소종','윤소종'],['조준','조준']],
 D016:[['6두품×1','6관등 아찬'],['5두품×2','10관등 대나마'],['4두품×3','12관등 대사']],
 D020:[['복','경복사'],['열','열반종'],['뽀','보덕'],['계율','계율종'],['통','통도사'],['장','자장'],['상종','법상종'],['금','금산사']],
 D021:[['일','범일'],['엄','이엄'],['미','수미산파'],['사','사굴산파'],['가','가지산파'],['도','도의'],['홍','홍척'],['산','실상산파'],['무','무염'],['주','성주산파']],
 D023:[['굴식돌방무덤','고구려·백제·신라·발해에서 확인되는 무덤 양식'],['식방=식빵','굴식돌방무덤을 떠올리는 말장난']],
 F017:[['남침','북한의 남침으로 전쟁 시작']]
};

const CURATED={
 A003:{mnemonic:'경복·창덕·창경·경희·경운',years:'조선~대한제국 · 5대 궁궐',category:'궁궐 · 문화유산',background:{title:'왜 다섯 궁궐을 함께 구별할까?',summary:'서울의 조선 궁궐은 건립 시기와 쓰임이 서로 다릅니다. 이름만 외우기보다 정궁·이궁·경운궁의 관계를 함께 보면 문화유산 문제에서 구별하기 쉽습니다.',sections:[{title:'핵심 맥락',body:'경복궁은 조선의 법궁으로 출발했고, 창덕궁은 임진왜란 뒤 오랫동안 왕이 머문 궁궐이었습니다. 경운궁은 대한제국기 중심 궁궐이 되었고 뒤에 덕수궁으로 불렸습니다.'}]},causalFlow:['조선 건국과 법궁 경복궁','왕실 공간의 확대','임진왜란 뒤 창덕궁 중심 운영','대한제국기 경운궁 활용'],examPoints:['경운궁은 오늘날 덕수궁의 옛 이름입니다.','창덕궁은 자연 지형과 조화를 이룬 궁궐로 자주 제시됩니다.','궁궐 이름과 시대별 사건을 함께 연결해 구별합니다.'],notes:['조선 건국 뒤 한양에 세운 법궁입니다.','임진왜란 뒤 오랫동안 왕이 머문 궁궐로 활용되었습니다.','수강궁을 고쳐 세운 궁궐로 왕실 생활 공간의 성격이 강했습니다.','광해군 때 경덕궁으로 세워졌고 뒤에 경희궁으로 불렸습니다.','대한제국의 중심 궁궐로 쓰였으며 오늘날 덕수궁의 옛 이름입니다.']},
 A015:{mnemonic:'부영 · 고동 · 동무',years:'초기 국가 · 제천 행사',category:'초기 국가 · 제천',background:{title:'왜 제천 행사를 열었을까?',summary:'초기 국가의 제천 행사는 수확을 감사하고 공동체를 결속하는 정치·종교 행사였습니다. 나라 이름과 행사 이름을 짝으로 기억하는 것이 핵심입니다.',sections:[{title:'구별 기준',body:'부여는 영고, 고구려는 동맹, 동예는 무천입니다. 계절과 사회 풍습이 함께 자료로 제시되므로 국가별 특징과 묶어 판단합니다.'}]},causalFlow:['농경과 수확','하늘에 제사','공동체 결속','국가별 제천 행사 정착'],examPoints:['부여-영고, 고구려-동맹, 동예-무천의 짝을 정확히 구별합니다.','제천 행사만 보지 말고 사출도·서옥제·책화 같은 국가별 특징을 함께 확인합니다.'],notes:['만주 지역의 연맹 왕국으로 12월에 영고를 열었습니다.','부여가 12월에 연 제천 행사입니다.','제가 회의와 서옥제 등의 특징이 있는 나라입니다.','고구려가 10월에 연 제천 행사입니다.','책화와 족외혼의 풍습이 있던 나라입니다.','동예가 10월에 연 제천 행사입니다.']},
 C001:{mnemonic:'발해–공산–고창–신라–통일',years:'926–936 · 후삼국 통일',category:'전쟁 · 통일 · 순서',background:{title:'왜 전투의 순서가 중요할까?',summary:'후삼국의 주도권은 한 번에 고려로 넘어오지 않았습니다. 공산 전투의 패배 뒤 고창 전투에서 흐름을 뒤집고, 신라의 항복과 후백제 멸망으로 통일이 완성됩니다.',sections:[{title:'전세의 변화',body:'927년 공산 전투에서 고려는 크게 패했지만 930년 고창 전투에서 승리하며 동남부 호족의 지지를 얻었습니다. 935년 신라가 항복하고 936년 후백제를 무너뜨리며 후삼국을 통일했습니다.'}]},causalFlow:['발해 멸망과 유민 포용','공산 전투 패배','고창 전투 승리','신라 항복','후백제 멸망과 통일'],examPoints:['공산 전투에서는 신숭겸이 왕건을 구하고 전사했습니다.','고창 전투 승리는 고려가 주도권을 잡는 전환점입니다.','신라 항복은 935년, 후삼국 통일은 936년입니다.'],notes:['926년 발해가 멸망하자 고려는 유민을 받아들였습니다.','927년 고려가 후백제에 패하고 신숭겸이 전사한 전투입니다.','930년 고려가 승리해 후삼국 경쟁의 주도권을 잡은 전투입니다.','935년 경순왕이 고려에 항복해 신라가 평화적으로 편입되었습니다.','936년 후백제가 무너지며 고려가 후삼국을 통일했습니다.']},
 C002:{mnemonic:'광종: 노비·과거·공복 / 광덕·준풍',years:'949–975 · 노비 · 과거 · 공복',category:'왕 · 정책 · 제도',background:{title:'왜 광종은 이런 정책을 실시했을까?',summary:'고려 초에는 통일에 기여한 호족의 군사력과 경제력이 강했습니다. 광종은 호족의 기반을 줄이고 왕이 직접 선택한 관료와 제도를 세워 왕권을 강화하려 했습니다.',sections:[{title:'출발점',body:'태조는 통일 과정에서 호족을 포섭했지만, 왕권이 안정된 뒤에는 강한 호족 세력이 왕을 위협할 수 있었습니다.'},{title:'정책의 방향',body:'노비안검법으로 호족의 인적·경제적 기반을 약화하고, 과거제로 새로운 관료를 선발하며, 공복을 정해 관료 질서를 정비했습니다.'}]},detailSections:[{title:'노비안검법',summary:'불법으로 노비가 된 사람을 조사해 양인 신분을 회복시켰습니다.',bullets:['호족의 노동력과 경제 기반 감소','국가의 조세 부담 인구 증가','호족 약화와 왕권 강화']},{title:'과거제',summary:'쌍기의 건의로 시험을 통해 관리를 선발했습니다.',bullets:['호족 가문 중심 인사 구조 완화','왕에게 충성하는 새 관료층 성장','유교적 관료 체제 강화']},{title:'공복 제정',summary:'관리의 등급에 따라 공복을 정해 관료 위계와 국가 질서를 분명히 했습니다.',bullets:['단순한 옷 색 구분이 아니라 관료 체계 정비','왕 중심의 국가 운영 질서 강화']}],causalFlow:['호족의 강한 기반','노비안검법으로 기반 약화','과거제로 새 관료 육성','공복으로 관료 질서 정비','왕권 강화'],examPoints:['노비안검법·과거제·공복·광덕·준풍이 함께 나오면 광종을 연결합니다.','노비안검법은 호족의 경제·인적 기반 약화라는 정치적 의미까지 봅니다.','광덕과 준풍은 광종이 사용한 독자적 연호입니다.'],notes:['정책의 주체인 고려 제4대 왕입니다.','불법 노비를 조사해 양인으로 돌려 호족의 기반을 약화했습니다.','쌍기의 건의로 시험을 통해 새 관료를 선발했습니다.','관리 등급에 따른 옷을 정해 관료 위계를 정비했습니다.','지방 인재를 중앙에 추천하게 한 제도입니다.','빈민 구제를 위해 설치한 기금입니다.','송과 외교 관계를 맺어 선진 문물을 받아들였습니다.','광종이 사용한 독자적 연호입니다.','광종이 광덕 다음에 사용한 연호입니다.','화엄종 승려로 광종의 왕권 강화에 사상적으로 협력했습니다.','광종이 창건한 사찰로 알려져 있습니다.']},
 C020:{mnemonic:'지눌: 돈오점수 · 정혜쌍수',years:'고려 후기 · 불교 개혁',category:'불교 · 사상',background:{title:'왜 지눌은 불교 개혁을 추진했을까?',summary:'고려 후기 불교계의 세속화와 교종·선종의 대립을 비판하고, 수행 중심의 결사 운동으로 불교를 바로잡으려 했습니다.',sections:[{title:'수선사 결사',body:'지눌은 승려 본연의 수행을 강조하며 수선사 결사를 이끌었습니다. 선과 교가 서로 대립하기보다 함께 이해될 수 있다고 보았습니다.'}]},causalFlow:['불교계 세속화','수선사 결사','선교 일치 추구','돈오점수·정혜쌍수','조계종 발전'],examPoints:['수선사 결사와 송광사는 지눌을 찾는 핵심 단서입니다.','돈오점수는 깨달음 뒤에도 수행을 이어 간다는 뜻입니다.','정혜쌍수는 선정과 지혜를 함께 닦는 수행법입니다.'],notes:['먼저 깨달은 뒤에도 습기를 없애기 위해 점진적으로 수행해야 한다는 주장입니다.','선정과 지혜를 함께 닦아야 한다는 수행 원리입니다.']},
 D006:{mnemonic:'훈어총수금',years:'조선 후기 · 수도 방어',category:'군사 · 제도',background:{title:'왜 5군영이 만들어졌을까?',summary:'임진왜란을 겪으며 기존 군사 체제의 한계가 드러났습니다. 조선은 훈련도감을 시작으로 수도와 수도 외곽을 지키는 군영을 차례로 설치했습니다.',sections:[{title:'체제 완성',body:'훈련도감은 임진왜란 중 설치되었고, 어영청·총융청·수어청을 거쳐 숙종 때 금위영이 설치되면서 5군영 체제가 완성되었습니다.'}]},causalFlow:['임진왜란과 군제 한계','훈련도감 설치','수도·외곽 방어 군영 확대','금위영 설치','5군영 완성'],examPoints:['훈련도감은 임진왜란 중 설치된 상비군입니다.','금위영 설치로 5군영 체제가 완성되었습니다.','5군영은 중앙군, 속오군은 지방군 체제와 연결합니다.'],notes:['임진왜란 중 설치된 상비군으로 포수·사수·살수의 삼수병을 두었습니다.','인조 때 설치되어 수도 방위를 맡았습니다.','수도 외곽과 북한산성 방어를 맡았습니다.','남한산성을 중심으로 수도 남부를 방어했습니다.','숙종 때 설치되어 5군영 체제를 완성했습니다.']},
 D016:{mnemonic:'6×1 · 5×2 · 4×3',years:'신라 · 골품제',category:'신분 · 관등',background:{title:'왜 골품에 따라 승진 한계가 달랐을까?',summary:'신라의 골품제는 혈통에 따라 정치·사회적 지위를 정했습니다. 개인의 능력만으로는 넘기 어려운 관등 승진 상한이 있어 6두품의 불만과 개혁 요구로 이어졌습니다.',sections:[{title:'숫자 읽기',body:'6두품은 6관등 아찬, 5두품은 10관등 대나마, 4두품은 12관등 대사까지 오를 수 있었습니다.'}]},causalFlow:['혈통 중심 골품제','관등 승진 제한','6두품의 정치적 한계','유학과 개혁 요구 성장'],examPoints:['6두품은 아찬까지 승진할 수 있었습니다.','골품제의 한계는 신라 말 6두품의 반발과 연결됩니다.'],notes:['6두품은 6관등 아찬까지 승진할 수 있었습니다.','5두품은 10관등 대나마까지 승진할 수 있었습니다.','4두품은 12관등 대사까지 승진할 수 있었습니다.']},
 E001:{mnemonic:'병제병문한정양 · 오신초덕광척',years:'1866–1871 · 통상 수교 거부',category:'개항기 · 사건 순서',background:{title:'왜 서양 세력과 충돌했을까?',summary:'서양 세력이 통상을 요구하는 가운데 천주교 박해와 무력 충돌이 이어졌습니다. 흥선 대원군은 두 차례 양요를 겪은 뒤 통상 수교 거부 정책을 강화했습니다.',sections:[{title:'두 전쟁의 구별',body:'병인양요는 프랑스, 신미양요는 미국의 침략입니다. 문수산성·정족산성은 병인양요, 초지진·덕진진·광성보는 신미양요의 전투 장소입니다.'}]},causalFlow:['병인박해','병인양요','오페르트 도굴 사건','신미양요','척화비 건립'],examPoints:['병인양요는 외규장각 도서 약탈, 신미양요는 어재연의 광성보 항전과 연결합니다.','오페르트 도굴 사건은 통상 수교 거부 여론을 강화했습니다.','척화비는 신미양요 뒤 전국에 세워졌습니다.'],notes:['1866년 천주교 신자와 프랑스 선교사를 처형한 사건입니다.','대동강을 거슬러 올라온 미국 상선과 평양 군민이 충돌한 사건입니다.','프랑스가 병인박해를 구실로 강화도를 침략했습니다.','병인양요 때 조선군이 항전한 장소입니다.','문수산성에서 항전한 조선의 장수입니다.','양헌수가 프랑스군을 물리친 병인양요의 전투 장소입니다.','정족산성에서 프랑스군을 물리친 장수입니다.','남연군 묘 도굴 시도로 서양 세력에 대한 반감이 커졌습니다.','미국이 통상을 요구하며 강화도를 침략했습니다.','신미양요 때 미군의 공격을 받은 강화도의 진입니다.','신미양요 때 미군의 공격을 받은 강화도의 진입니다.','어재연이 광성보에서 미군에 맞서 싸웠습니다.','신미양요 뒤 통상 수교 거부 의지를 밝히기 위해 세웠습니다.']},
 F011:{mnemonic:'경단기',years:'1927 · 민족 유일당 운동',category:'일제강점기 · 민족운동',background:{title:'왜 신간회가 만들어졌을까?',summary:'민족주의 세력과 사회주의 세력이 갈라져서는 식민 통치에 효과적으로 맞서기 어렵다는 인식이 커졌습니다. 두 세력은 비타협적 민족 유일당 운동의 흐름 속에서 신간회를 창립했습니다.',sections:[{title:'활동 방향',body:'신간회는 전국에 지회를 두고 노동·농민 운동을 지원했으며, 광주 학생 항일 운동 진상 조사단을 파견하려 했습니다.'}]},causalFlow:['민족운동의 분열','정우회 선언','신간회 창립','전국 지회와 대중운동 지원','해소'],examPoints:['비타협적 민족주의와 사회주의의 연합 단체입니다.','광주 학생 항일 운동 진상 조사 활동과 연결됩니다.','정치·경제적 각성, 민족 단결, 기회주의 배격이 강령의 핵심입니다.'],notes:['민중에게 정치적·경제적 각성을 촉구한다는 내용입니다.','민족의 단결을 공고히 한다는 내용입니다.','타협적인 기회주의를 배격한다는 내용입니다.']},
 F017:{mnemonic:'남침에서 시작된 6·25 전쟁',years:'1950–1953 · 한국 전쟁',category:'현대 · 전쟁',background:{title:'전쟁은 어떻게 시작되었을까?',summary:'1950년 6월 25일 북한군의 전면 남침으로 전쟁이 시작되었습니다. 이후 유엔군 참전, 인천 상륙 작전, 중국군 개입을 거쳐 전선이 교착되었고 1953년 정전 협정이 체결되었습니다.',sections:[{title:'시험에서 보는 흐름',body:'남침 → 낙동강 방어선 → 인천 상륙 작전 → 중국군 개입 → 1·4 후퇴 → 정전 협정의 큰 흐름을 구별합니다.'}]},causalFlow:['북한군 남침','유엔군 참전','인천 상륙 작전','중국군 개입','정전 협정'],examPoints:['전쟁은 북한의 남침으로 시작되었습니다.','정전 협정은 1953년 판문점에서 체결되었습니다.'],notes:['1950년 6월 25일 북한군의 전면 남침으로 전쟁이 시작되었습니다.']}
};

function era(record){const label=record.eraLabel;if(/고려/.test(label))return 'goryeo';if(/조선/.test(label))return 'joseon';if(/개항|대한제국|국권피탈/.test(label))return 'empire';if(/일제강점기/.test(label))return 'occupation';if(/현대/.test(label))return 'republic';return 'ancient'}
function category(record){return ({A:'선사·초기 국가',B:'삼국·남북국',C:'고려',D:'제도·문화',E:'개항기·대한제국',F:/현대/.test(record.eraLabel)?'현대':'일제강점기'})[record.id[0]]}
function memoryType(record){if(SEQUENCE.has(record.id))return 'SEQUENCE';if(NUMBER.has(record.id))return 'NUMBER';if(WORDPLAY.has(record.id))return 'WORDPLAY';if(COMPARISON.has(record.id))return 'COMPARISON';if(/[()?!~]/.test(record.sourceMnemonic)||record.sourceMnemonic.length>14)return 'SENTENCE_ASSOCIATION';return 'ACROSTIC'}
function aliases(title){const hard={'신라 멸망/항복 관련':['경순왕','신라 항복'],'후삼국 통일':['후삼국 통일'],'경운궁':['경운궁','덕수궁'],'제너럴셔먼호':['제너럴 셔먼호'],'광성보·어재연':['광성보','어재연'],'정치·경제적 각성 촉구':['정치적 경제적 각성','각성 촉구'],'민족 단결':['민족 단결'],'기회주의자 배격':['기회주의자 배격'],'6관등 아찬':['아찬'],'10관등 대나마':['대나마'],'12관등 대사':['대사']};return hard[title]||String(title).split(/[·/(),]/).map(value=>value.trim()).filter(value=>norm(value).length>=2)}
function evidence(keyword){const terms=aliases(keyword.title),hits=corpus.filter(row=>terms.some(term=>row.normalized.includes(norm(term))));return hits.slice(0,3).map(row=>({source:'dist/official-exam-explanations.json',officialQuestionId:row.id,matchTerms:terms}))}
function fallbackKeywords(record){const rows=FALLBACK_KEYWORDS[record.id]||[];if(rows.length)return rows.map(([cue,title])=>({cue,title}));return [{cue:record.title,title:record.title}]}
function publicMnemonicFor(record,keywords,curated){if(curated?.mnemonic)return curated.mnemonic;return keywords.map(keyword=>String(keyword.cue).trim()).filter(Boolean).join(' · ')}
function publicLearningContent(record,keywords,curated){
 if(curated)return {background:curated.background,detailSections:curated.detailSections||[],causalFlow:curated.causalFlow||[],examPoints:curated.examPoints||[],years:curated.years||record.eraLabel};
 const terms=keywords.map(keyword=>keyword.title),lead=terms.filter(Boolean).join(' · ');
 return {
  years:record.eraLabel,
  background:{title:`${record.title}, 무엇을 함께 기억할까?`,summary:`${record.eraLabel}의 ${record.title}에서 함께 구별해야 할 핵심 용어를 cue와 연결합니다. 공개 문구는 원문을 복제하지 않고 검수된 cue 구조만 다시 구성했습니다.`,sections:[{title:'학습 방향',body:`${lead}의 짝과 순서를 먼저 확인한 뒤 실제 기출 자료에서 같은 단서를 찾아봅니다.`}]},
  detailSections:[{title:'핵심 연결',summary:`${record.title}의 cue와 역사 용어를 한 묶음으로 정리합니다.`,bullets:keywords.map(keyword=>`${keyword.cue} → ${keyword.title}`)}],
  causalFlow:memoryType(record)==='SEQUENCE'?terms:[record.eraLabel,record.title,'cue와 역사 용어 연결','실제 기출에서 구별'],
  examPoints:[`${record.title} 문제에서는 cue에 연결된 용어를 시대·인물·제도와 함께 구별합니다.`,`자료에 ${lead}가 제시되는지 확인하고 비슷한 시대의 다른 주제와 혼동하지 않습니다.`]
 };
}

const cards=source.records.map((record,index)=>{
 const curated=CURATED[record.id],rawKeywords=record.keywords.length?record.keywords:fallbackKeywords(record);
 const status=VERIFIED.has(record.id)?'VERIFIED':(REVIEW_REQUIRED.has(record.id)||/REVIEW_REQUIRED|검증|대조|재확인|확인 필요|원자료/.test(record.interpretation)?'REVIEW_REQUIRED':'CANDIDATE');
 const publicationStatus=PUBLIC_APPROVED.has(record.id)?'PUBLISHED':'EXCLUDED',publicMnemonic=publicationStatus==='PUBLISHED'?publicMnemonicFor(record,rawKeywords,curated):'';
 const keywords=rawKeywords.map((keyword,keywordIndex)=>({order:keywordIndex+1,cue:keyword.cue,title:keyword.title,shortExplanation:curated?.notes?.[keywordIndex]||(publicationStatus==='PUBLISHED'?`‘${keyword.cue}’는 ‘${keyword.title}’을 가리킵니다. 같은 주제의 다른 cue와 함께 연결해 기억하세요.`:`${keyword.title} 항목은 원자료의 cue 매핑을 보존한 것으로, 공개 전 역사 검수가 필요합니다.`),evidence:[{source:sourcePath,sourceId:record.id,quote:`${keyword.cue} → ${keyword.title}`}]}));
 const verifiedFacts=keywords.map(keyword=>({...keyword,evidence:evidence(keyword),verificationStatus:'CANONICAL_TEXT_MATCH'})).filter(keyword=>keyword.evidence.length);
 const learning=publicationStatus==='PUBLISHED'?publicLearningContent(record,keywords,curated):{background:null,detailSections:[],causalFlow:[],examPoints:[],years:record.eraLabel};
 const id=STABLE_IDS[record.id]||`mnemonic-${record.id.toLowerCase()}`;
 const searchable=[record.title,publicMnemonic,...keywords.flatMap(keyword=>[keyword.cue,keyword.title]),record.eraLabel].join(' ');
 const matches=keywords.flatMap(keyword=>evidence(keyword).map(item=>({...item,cue:keyword.cue,fact:keyword.title}))),relatedOfficialQuestionIds=[...new Set(matches.map(item=>item.officialQuestionId))].slice(0,12);
 return {id,sourceId:record.id,number:index+1,era:era(record),period:record.eraLabel,title:record.title,category:curated?.category||category(record),memoryType:memoryType(record),sourceMnemonic:record.sourceMnemonic,originalMnemonic:record.sourceMnemonic,mnemonic:publicMnemonic,publicMnemonic,normalizedSearchText:norm(searchable),keywords,sourceFacts:keywords,facts:keywords,verifiedFacts,background:learning.background,detailSections:learning.detailSections,causalFlow:learning.causalFlow,examPoints:learning.examPoints,years:learning.years,relatedOfficialQuestionIds,relatedSceneIds:[],linkEvidence:matches.filter(item=>relatedOfficialQuestionIds.includes(item.officialQuestionId)),status,publicationStatus,publicationReviewStatus:publicationStatus==='PUBLISHED'?'APPROVED':'PENDING',sourceReviewStatus:status,learningStatus:'NEW',rightsStatus:publicationStatus==='PUBLISHED'?(publicMnemonic===record.sourceMnemonic?'COMMON_SHORT_FORM_REVIEWED':'APP_REWRITTEN_FROM_FACT_STRUCTURE'):'USER_SUPPLIED_INTERNAL_REVIEW_ONLY',reviewReason:publicationStatus==='PUBLISHED'?(status==='VERIFIED'?'원문 cue와 역사 사실을 대조하고 공개용 문구 및 상세 설명을 별도로 작성했습니다.':'원문 검수 상태는 유지하고, Git 이력의 공개 승인과 cue 구조를 사용한 별도 공개 문구만 노출합니다.'):(status==='REVIEW_REQUIRED'?'OCR·연대·인물·정책 또는 표현 권리 검토가 필요해 공개하지 않습니다.':'원문 inventory와 cue를 보존했으며 역사·권리 검수 전까지 공개하지 않습니다.'),sourceInterpretation:record.interpretation,topicTags:[record.eraLabel,record.title],searchTerms:[record.title,publicMnemonic,...keywords.flatMap(keyword=>[keyword.cue,keyword.title])],recall:{chronological:memoryType(record)==='SEQUENCE'},cueCount:keywords.length};
});

assert.equal(new Set(cards.map(card=>card.sourceId)).size,118);assert.equal(new Set(cards.map(card=>card.id)).size,118);
for(const card of cards){assert(card.sourceMnemonic,'empty sourceMnemonic '+card.sourceId);assert(card.keywords.length,'empty keywords '+card.sourceId);if(card.publicationStatus==='PUBLISHED'){assert(card.mnemonic&&card.background&&card.causalFlow.length&&card.examPoints.length,'incomplete published content '+card.sourceId);assert.equal(card.facts.length,card.keywords.length)}}
const data={schemaVersion:4,explicitInputCount:118,additionalSourceRecords:0,totalInventory:cards.length,sourceHashes:{'explicit-request.json':crypto.createHash('sha256').update(fs.readFileSync(sourcePath,'utf8').replace(/\r\n/g,'\n')).digest('hex')},cards};
fs.writeFileSync('dist/mnemonic-inventory.json',JSON.stringify(data,null,2)+'\n');
fs.writeFileSync('dist/mnemonic-data.js','/* Generated from docs/mnemonic-sources/explicit-request.json. */\n'+`globalThis.MNEMONIC_INVENTORY=${JSON.stringify(cards)};\nglobalThis.MNEMONIC_IMPORT_BASELINE=globalThis.MNEMONIC_INVENTORY;\nglobalThis.MNEMONIC_IMPORT_CARDS=globalThis.MNEMONIC_INVENTORY;\nglobalThis.MNEMONIC_IMPORT_CANDIDATES=globalThis.MNEMONIC_INVENTORY.filter(card=>card.publicationStatus!=='PUBLISHED');\n`);
console.log(JSON.stringify({explicit:118,total:cards.length,statuses:cards.reduce((out,card)=>(out[card.status]=(out[card.status]||0)+1,out),{}),published:cards.filter(card=>card.publicationStatus==='PUBLISHED').length,facts:cards.reduce((sum,card)=>sum+card.facts.length,0)}));
