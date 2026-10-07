/* Source import: no text generation, no guessed cue meanings. */
const fs=require('fs'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const root='docs/mnemonic-sources/';
const primary=fs.readFileSync(root+'primary-reference.txt','utf8');
const section=primary.slice(primary.indexOf('01. 세계기록유산'),primary.indexOf('C. 별도 구조'));
const refs=[...section.matchAll(/^(\d{2,3})\. ([^\r\n]+)\r?\n([\s\S]*?)(?=^\d{2,3}\. |$(?![\s\S]))/gm)].map(m=>{
 const lines=m[3].split(/\r?\n/),words=[];
 for(const line of lines){if(!line.trim()&&words.length)break;if(line.startsWith('※'))break;if(line.trim())words.push(line.trim())}
 return {number:Number(m[1]),title:m[2],originalMnemonic:words.join('\n')};
});
assert.equal(refs.length,111);
const sourceRows=new Map(fs.readFileSync(root+'cue-facts.txt','utf8').split(/\r?\n/).filter(x=>/^\d+\|/.test(x)).map(line=>{
 const [n,page,rows]=line.split('|');return [Number(n),{page:Number(page),facts:rows.split(';').map((row,i)=>{const at=row.indexOf('=');return {order:i+1,cue:row.slice(0,at),title:row.slice(at+1)}})}];
}));
const raw=fs.readFileSync(root+'raw-source.txt','utf8');
const norm=s=>String(s||'').normalize('NFKC').replace(/[\s\p{P}\p{S}]/gu,'').toLowerCase();
const canonical=JSON.parse(fs.readFileSync('dist/official-exam-explanations.json','utf8')).records;
// Inspect only explanation/clue/answer text; never manufacture a link from era alone.
const corpus=canonical.map(r=>({id:r.officialQuestionId,text:[r.clue,r.correctChoice,r.explanation].join(' '),normalized:norm([r.clue,r.correctChoice,r.explanation].join(' '))}));
const ids={3:'memory-palaces',4:'memory-paleolithic-early',5:'memory-paleolithic-middle',6:'memory-paleolithic-late',7:'memory-neolithic-sites',8:'memory-neolithic-pottery',9:'memory-neolithic-millet',10:'memory-bronze-farming',11:'memory-bronze-pottery',12:'memory-iron-pottery',13:'memory-gunjosun-range',14:'memory-eight-laws',15:'memory-early-states',16:'memory-silla-soji',17:'memory-silla-jinheung',18:'memory-silla-rebellions-import',19:'memory-balhae-kings',24:'memory-nine-seodang',26:'memory-gong-go-sin-il-import',27:'memory-gwangjong-mnemonic',29:'memory-hyeonjong',30:'memory-sukjong',31:'memory-yejong',32:'memory-choongseon',33:'memory-gongmin',34:'memory-woowang',43:'memory-wonhyo-mnemonic',44:'memory-uisang',45:'memory-five-schools',47:'memory-calendars',49:'memory-sejong-printing',50:'memory-paintings-import',51:'memory-hongdaeyong',54:'memory-jeongdojeon-books',55:'memory-taejong-sejong',59:'memory-five-armies-import',61:'memory-four-purges',62:'memory-jeongjo-books',63:'memory-jeongjo-reforms',64:'memory-yeongjo-reforms',67:'memory-land-systems',71:'memory-jo-gwangjo',74:'memory-treaties',75:'memory-opening-order',76:'memory-gapshin-after',78:'memory-donghak-import',80:'memory-gapoh-reforms',92:'memory-sovereignty-import',93:'memory-secret-societies',94:'memory-manchuria-1910',99:'memory-cheongsanri',103:'memory-singan-import',104:'memory-historians-import',108:'memory-gwangbok-parties',109:'memory-roh-import',1:'memory-world-records',2:'memory-world-heritage'};
const review={1:'해인사·승정원 등 기관명과 기록유산명이 혼재. 전체 목록의 등재 대상 검증 필요.',2:'PRIMARY 참과 RAW 창(창덕궁)의 cue 차이.',4:'PRIMARY (검)검(도종)과 RAW (점)검(도중)이 다름. 최초 인골의 시기 분류 검증 필요.',5:'PRIMARY 별점과 RAW 빌점의 cue 차이.',6:'PRIMARY 동과 RAW 똥의 표기 차이.',13:'PRIMARY 특과 RAW 북의 cue 차이.',14:'노비50만 배상 표기의 단위·의미 검증 필요.',16:'6촌→6부 정비의 왕별 귀속 검증 필요.',17:'PRIMARY 거와 RAW 개(개국)의 cue 차이.',18:'96각간 등 인물·사건 OCR 검증 필요.',20:'PRIMARY 고고천진동과 RAW 고천진동 차이.',22:'PRIMARY 살과 RAW 상(상경) 차이.',24:'PRIMARY 적백·백(관)백과 RAW 적벽·백(군)빽 차이.',25:'원문의 무대는 무태 여부 검증 필요. 연호 목록이며 일반 후삼국 사건 목록이 아님.',27:'PRIMARY 역사와 RAW 여사(균여·귀법사)의 cue 차이.',28:'PRIMARY 문종·경종/나비엔 남대문과 RAW 문종/경동 나비엔 남대문 차이.',29:'군·창 등의 법령명과 제도 귀속 검증 필요.',31:'PRIMARY 7자와 RAW 7재 차이.',33:'웅/몽·흥/홍·전신변정도감 등 원문 차이와 오타.',35:'홍/흥, 최이/최우와 흥녕부·진양부 대응 검증 필요.',36:'PRIMARY 윤소충과 RAW 윤소종 표기 차이.',37:'종부/중부/중정부와 사건별 연도 1174의 적용 범위 검증 필요.',42:'개원필경·해인사묘질 상탑비 등 서명 OCR 검증 필요.',43:'금강삼매경로·십문화쟁론의 서명 검증 필요.',44:'화엄승법계도의 정확한 서명 검증 필요.',45:'뿔/보덕·겨울/계율 등 PRIMARY와 RAW cue 차이.',46:'흑/홍·성산주파 등 승려와 산문 대응 OCR 검증 필요.',48:'PRIMARY 통과 RAW 봉(봉정사)이 충돌.',49:'PRIMARY 조자와 RAW 소자(주자소)가 충돌.',50:'PRIMARY 동과 RAW 몽, 몽유동원도·금강진도 등의 서명 검증 필요.',51:'담헌전 등 서명 OCR 검증 필요.',55:'PRIMARY 계창사의훈과 RAW 계창사양호 차이.',56:'PRIMARY 감·양과 RAW 갑·앙의 차이.',57:'육정상정소·경극대전 등 명칭 OCR 검증 필요.',58:'PRIMARY 둥과 RAW 동의 cue 차이.',60:'목록의 삼·을 누락과 조약·왜변의 시간 순서 확인 필요.',61:'원문의 신사환국-노론 및 갑술환국-소론 대응은 역사 검증 필요. 그대로 공개하지 않음.',63:'기/거, 검사관/검서관, 수령향역 등 OCR과 정책 귀속 검증 필요.',65:'박해 목록에 신해통공·기유박해가 혼재. 원문 보존 후 공개 보류.',66:'민정문서는 통일 신라로 분류. 1/10 징수 등 해석 검증 필요.',67:'구구려 오타 보존. 측량법 명칭 검증 필요.',68:'제목 역분전과 내용 전시과가 다름. PRIMARY 개국과 RAW 개목 차이.',70:'PRIMARY 돈대상과 RAW 동대상(동래·대일·내상) 차이.',71:'PRIMARY 위험 경험과 RAW 위헌 경향 차이.',72:'PRIMARY와 RAW 문장 차이가 큼. 당=포 등 잘린 풀이와 전투 인물·시점 검증 필요.',74:'조일수호조규속양·조일통상상정 등 조약명 OCR 검증 필요.',75:'PRIMARY 명독과 RAW 명동, 이탈리아 항목이 RAW에서 연도만 남음.',77:'기준 목록은 축약형. RAW 전체 문구는 rawMnemonic에 보존; 누락 조항과 표현 검토 필요.',79:'욕설 포함. 원문은 보존하고 publicMnemonic은 비워 공개 보류.',81:'시위대 설치의 시기 귀속 검증 필요.',83:'징병제 등 홍범14조 원문과 대조 필요.',84:'탁 cue의 원문 풀이가 누락; 황권전제·입헌군주제 혼재.',85:'광서·개국·건양·광무·융희를 모두 고종 연호로 볼 수 없는 문제 검증 필요.',86:'허위의 의병 시기와 유인석 지역 표기의 의미 검증 필요.',88:'PRIMARY 대마와 RAW 대만(만세보) 차이.',89:'원학사와 경신학교의 시기·명칭 검증 필요.',91:'1900 묶음에 1890년대 학교가 포함되어 연대 분류 검증 필요.',93:'자립관 등 단체명 검증 필요.',98:'PRIMARY 미소홍 공대한과 RAW 미스흥 공대의 cue 차이.',102:'혁명조선군 명칭 OCR 검증 필요.',103:'PRIMARY 정과 RAW 경의 cue 차이.',104:'조선사 연구회·모창극찬 등 원문 오류 검증 필요.',105:'혼식·혼백 cue와 박훈식/박혼식 차이; 저서명 교정 검토 필요.',106:'문신평/문심평과 일편단심, 호암·얼 등 대응 검증 필요.',109:'NO 핵을 비핵화 공동선언으로 해석할 근거 확인 필요.',110:'PRIMARY 금사정과 RAW 급사정, 2차 상봉의 귀속 검증 필요.'};
const approved=new Set([3,7,8,9,10,11,12,15,19,21,23,26,30,32,34,38,39,40,41,47,52,53,54,59,62,64,69,73,76,78,80,82,87,90,92,94,95,96,97,99,100,101,107,108,111]);
const era=n=>n===3?'joseon':n<=24?'ancient':n<=41?'goryeo':n<=46?'ancient':n===48||n===53||n===68||n===69?'goryeo':n===66||n===67?'ancient':n<=72?'joseon':n<=92?'empire':n<=106?'occupation':'republic';
const sequence=new Set([17,18,19,26,37,38,39,40,41,60,61,65,68,73,74,75,76,78,80,81,82,85,87,88,89,90,91,92,99,107,111]);
const numbers=new Set([14,24,25,37,38,39,40,41,89,110]);
const aliases={ '경운궁':['경운궁','덕수궁'],'국민당':['국민당'],'공산전투':['공산 전투'],'고창전투':['고창 전투'],'신라멸망':['경순왕','신라 항복'],'발해멸망':['발해 멸망'],'통일':['후삼국 통일'], '굴식돌방무덤':['굴식 돌방무덤'],'정혜공주':['정혜 공주'], '돌사자상':['돌사자'], '팔만대장경':['팔만대장경'], 'UR협정체결':['우루과이 라운드','UR'], 'IMF 위기':['IMF'], '전로한족회 중앙총회':['전로 한족회 중앙 총회'], '흥녕부':['흥녕부'], '경정전시과':['경정 전시과'] };
function evidence(f){
 const terms=aliases[f.title]||[f.title];
 const hits=corpus.filter(r=>terms.some(term=>norm(term).length>=2&&r.normalized.includes(norm(term))));
 return hits.slice(0,3).map(r=>({source:'dist/official-exam-explanations.json',officialQuestionId:r.id,matchTerms:terms}));
}
const cards=refs.map(r=>{
 const s=sourceRows.get(r.number);assert(s,`Missing source ${r.number}`);
 const sourceFacts=s.facts.map(f=>({...f,evidence:[{source:root+'raw-source.txt',page:s.page,cue:f.cue,quote:f.title}]}));
 const verifiedFacts=sourceFacts.map(f=>({...f,evidence:evidence(f),verificationStatus:'CANONICAL_TEXT_MATCH'})).filter(f=>f.evidence.length);
 const sourceMismatch=review[r.number];
 const allCovered=verifiedFacts.length===sourceFacts.length;
 const status=sourceMismatch?'REVIEW_REQUIRED':approved.has(r.number)&&allCovered?'PUBLISHED':'CANDIDATE';
 return {...r,id:ids[r.number]||`memory-baseline-${String(r.number).padStart(3,'0')}`,era:era(r.number),period:r.title,category:r.number<=12?'유적·문화':r.number<=41?'왕·정책':r.number<=72?'제도·문화':r.number<=92?'개항·개혁':r.number<=106?'독립운동':'현대사',mnemonic:r.originalMnemonic,publicMnemonic:r.number===79?'':r.originalMnemonic,memoryType:sequence.has(r.number)?'SEQUENCE':numbers.has(r.number)?'NUMBER':r.originalMnemonic.includes('(')?'SENTENCE':'ACROSTIC',sourceUnits:[`P${s.page}`],sourceFacts,verifiedFacts,facts:sourceFacts,status,sourceReviewStatus:sourceMismatch?'SOURCE_CONFLICT':'RAW_MAPPING_TRANSCRIBED',moderationStatus:r.number===79?'REVIEW_REQUIRED':'REVIEWED',rightsStatus:'USER_SUPPLIED_SOURCE_ATTRIBUTED_NO_LICENSE_CLAIM',reviewReason:sourceMismatch||(allCovered?'cue별 canonical 텍스트 대조 완료; 뜻을 새로 만들지 않음.':`canonical 근거 미확보 ${sourceFacts.length-verifiedFacts.length}/${sourceFacts.length}개. sourceFacts 전사 완료, 공개 보류.`),relatedOfficialQuestionIds:[],relatedSceneIds:[],linkEvidence:[],topicTags:[r.title],searchTerms:[r.title,...sourceFacts.map(f=>f.title)],recall:{chronological:sequence.has(r.number)},baselineNumber:r.number};
});
cards.find(c=>c.number===77).rawMnemonic='순(수한) 근혜 환(갑까지) 지조(지키니) 내시(들이) 호(시)탐(탐) (사)귀(자고) (매달린다)';
const extras=[
 ['memory-tombs','ancient','정혜공주 무덤','식혜 6(개) 사자','NUMBER','58','식=굴식돌방무덤;혜=정혜공주;6=돈화현 육정산;사자=돌사자상'],
 ['memory-tomb-bread','ancient','굴식 돌방무덤 말장난','굴(식)돌(방)무덤 = 식방= 식빵','WORDPLAY','58','식방=굴식돌방무덤;식빵=굴식돌방무덤'],
 ['memory-tomb-goguryeo','ancient','고구려 후기 무덤','고구려는 후식으로 식빵 먹음','STORY','58','후식=고구려 후기;식빵=굴식돌방무덤'],
 ['memory-tomb-baekje','ancient','백제 사비 무덤','백제는 사비로 식빵 사먹음','STORY','58','사비=백제 사비 시대;식빵=굴식돌방무덤'],
 ['memory-tomb-silla','ancient','통일 신라 무덤','신라는 통후추 식빵 먹음','STORY','58','통후추=신라 통일 후;식빵=굴식돌방무덤'],
 ['memory-tomb-balhae','ancient','발해 무덤 이야기','발해 사자에게 돈육 식빵','STORY','58','사자=돌사자상;돈육=돈화현 육정산;식빵=굴식돌방무덤'],
 ['memory-tomb-stone-goguryeo','ancient','고구려 초기 무덤','고구려는 초무무','WORDPLAY','58','초=초기;무무=돌무지무덤'],
 ['memory-tomb-stone-baekje','ancient','백제 한성 무덤','백제는 한계무무','WORDPLAY','58','한=한성시대;계=계단식;무무=돌무지무덤'],
 ['memory-goryeo-seongjong','goryeo','고려 성종','2612(원) 의상비 수건향 분유향 노문국','NUMBER','22','2=2성;6=6부;12=12목 지방관파견;의=의창;상=상평창;비=비서성(도서관);수=수서원(도서관);건=건원중보;향=향리제도;분=분사제도정비;유=유교정치;향=향교설치;노=노비환천법;문=문신월과법;국=국자감'],
 ['memory-bone-rank','ancient','신라 골품 관등','6두품*1=6관등\n5두품*2=10관등\n4두품*3=12관등','NUMBER','50','6두품*1=6관등;5두품*2=10관등;4두품*3=12관등'],
 ['memory-goguryeo-kings','ancient','고국원왕','원통하게 활맞아 죽은 고국원왕','WORDPLAY','12','원통=고국원왕'],
 ['memory-goguryeo-yang','ancient','고국양왕','광개토 아버지 고국양왕','SENTENCE','12','광개토 아버지=고국양왕'],
 ['memory-sosurim','ancient','소수림왕','학(태학)교(불교)령(율령)','ACROSTIC','12','학=태학;교=불교;령=율령'],
 ['memory-yeongyang','ancient','영양왕','양(영양왕)양(양제침입)신집(이문진 신집 5권)','ACROSTIC','12','양=영양왕;양=양제침입;신집=이문진 신집 5권'],
 ['memory-korean-war','republic','6·25 전쟁','똥침->남침 북한이 남한한테 똥침가격을 하였다.','WORDPLAY','110','남침=북한이 남한한테 똥침가격을 하였다.']
];
for(const [id,e,title,mnemonic,memoryType,page,rows] of extras){
 const sourceFacts=rows.split(';').map((row,i)=>{const at=row.indexOf('=');return {order:i+1,cue:row.slice(0,at),title:row.slice(at+1),evidence:[{source:root+'raw-source.txt',page:Number(page),quote:row.slice(at+1)}]}});
 cards.push({id,number:null,title,era:e,period:title,category:'추가 원문',mnemonic,originalMnemonic:mnemonic,publicMnemonic:mnemonic,memoryType,sourceUnits:[`P${page}`],sourceFacts,facts:sourceFacts,verifiedFacts:sourceFacts.map(f=>({...f,evidence:evidence(f),verificationStatus:'CANONICAL_TEXT_MATCH'})).filter(f=>f.evidence.length),status:'CANDIDATE',sourceReviewStatus:'RAW_MAPPING_TRANSCRIBED',moderationStatus:'REVIEWED',rightsStatus:'USER_SUPPLIED_SOURCE_ATTRIBUTED_NO_LICENSE_CLAIM',reviewReason:'기준 목록 외 원문 기억 장치. cue 매핑은 보존; 사실·표현 공개 검토 대기.',relatedOfficialQuestionIds:[],relatedSceneIds:[],linkEvidence:[],topicTags:['문화'],searchTerms:[title,...sourceFacts.map(f=>f.title)],recall:{chronological:false}});
}
for(const card of cards){
 for(const f of card.facts)f.shortExplanation=`${f.title}.`;
 card.cueCount=card.sourceFacts.length;
 // Canonical matches are auditable candidates for a connection, not fabricated era fallbacks.
 const matches=card.verifiedFacts.flatMap(f=>f.evidence.filter(e=>norm(f.title).length>=3).map(e=>({...e,cue:f.cue,fact:f.title})));
 card.linkEvidence=matches;
 card.relatedOfficialQuestionIds=[...new Set(matches.map(e=>e.officialQuestionId))];
}
// Explicitly reviewed facts. Original cue mappings and mnemonic text remain intact.
const curated=JSON.parse(fs.readFileSync(root+'verified-facts.json','utf8'));
for(const entry of curated){
 const card=cards.find(c=>c.number===entry.number);assert(card);
 assert.deepEqual(entry.facts.map(f=>[f.cue,f.title]),card.sourceFacts.map(f=>[f.cue,f.title]));
 card.verifiedFacts=entry.facts.map((f,i)=>({...f,order:i+1,evidence:[{source:f.source||entry.source}],verificationStatus:'PRIMARY_SOURCE_REVIEWED'}));
 card.facts=card.verifiedFacts;
 card.status='PUBLISHED';card.sourceReviewStatus='REVIEWED';card.reviewReason='원문 cue 대응과 공식 역사 자료 대조 완료. 암기 문구는 원문 유지.';
}
const jinul=cards.find(c=>c.number===53);
if(jinul.status==='PUBLISHED')jinul.facts.forEach((f,i)=>f.shortExplanation=i===0?'깨달음을 얻은 뒤에도 점진적으로 수행해야 한다는 지눌의 수행론입니다.':'선정과 지혜를 함께 닦아야 한다는 지눌의 수행론입니다.');
const data={schemaVersion:3,baselineCount:111,sourceHashes:Object.fromEntries(['primary-reference.txt','raw-source.txt','cue-facts.txt'].map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(root+file,'utf8').replace(/\r\n/g,'\n')).digest('hex')])),cards};
fs.writeFileSync('dist/mnemonic-inventory.json',JSON.stringify(data,null,2)+'\n');
fs.writeFileSync('dist/mnemonic-data.js','/* Generated by scripts/rebuild-mnemonics.cjs; edit the source inventory instead. */\n'+`globalThis.MNEMONIC_INVENTORY=${JSON.stringify(cards)};\nglobalThis.MNEMONIC_IMPORT_BASELINE=globalThis.MNEMONIC_INVENTORY.filter(c=>c.number!==null);\nglobalThis.MNEMONIC_IMPORT_CARDS=globalThis.MNEMONIC_INVENTORY;\nglobalThis.MNEMONIC_IMPORT_CANDIDATES=globalThis.MNEMONIC_INVENTORY.filter(c=>c.status!=='PUBLISHED');\n`);
console.log(JSON.stringify({baseline:refs.length,total:cards.length,statuses:cards.reduce((s,c)=>(s[c.status]=(s[c.status]||0)+1,s),{}),facts:cards.reduce((n,c)=>n+c.facts.length,0)}));
