const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const catalog=require(path.join(root,'dist','official-exam-catalog.json'));
const explanationBundle=require(path.join(root,'dist','official-exam-explanations.json'));
const explanationById=new Map(explanationBundle.records.map(record=>[record.officialQuestionId,record]));
const textFor=record=>{
  const explanation=explanationById.get(record.officialQuestionId)||{};
  return [explanation.question,explanation.clue,explanation.correctChoice,explanation.explanation,...(record.concepts||[])].filter(Boolean).join(' ');
};

const topicDefinitions=[
  {id:'proto-buyeo',label:'부여',season:'원삼국',re:/사출도|영고|형사취수제|부여[^.]{0,60}(순장|제가|가축 이름)/},
  {id:'proto-early-goguryeo',label:'초기 고구려',season:'원삼국',re:/서옥제|제가 회의|동맹이라는 제천|고구려[^.]{0,80}(동맹|서옥|제가)|압록강[^.]{0,60}(졸본|국내성)/},
  {id:'proto-okjeo',label:'옥저',season:'원삼국',re:/옥저|민며느리제|가족 공동 무덤/},
  {id:'proto-dongye',label:'동예',season:'원삼국',re:/동예|책화|무천|단궁.{0,30}과하마|과하마.{0,30}반어피/},
  {id:'proto-samhan',label:'삼한',season:'원삼국',re:/삼한|소도|천군|마한|진한|변한|계절제|두레/},
  {id:'three-goguryeo',label:'고구려',season:'삼국',re:/고구려|광개토|장수왕|고국천왕|소수림왕|을지문덕|연개소문|안시성|살수 대첩|평양 천도/},
  {id:'three-baekje',label:'백제',season:'삼국',re:/백제|근초고왕|무령왕|성왕|의자왕|계백|사비성|황산벌|웅진 천도|사비 천도/},
  {id:'three-silla',label:'신라',season:'삼국',re:/신라|내물왕|지증왕|법흥왕|진흥왕|선덕 여왕|김춘추|김유신|화백 회의|화랑도/},
  {id:'three-gaya',label:'가야',season:'삼국',re:/가야|금관가야|대가야|김수로|덩이쇠|철제 판갑옷/},
  {id:'unified-silla',label:'통일 신라',season:'삼국',re:/통일 신라|신문왕|원성왕|독서삼품과|국학|9주.{0,20}5소경|9서당.{0,20}10정|관료전|녹읍|촌락 문서|감은사지/},
  {id:'balhae',label:'발해',season:'삼국',re:/발해|대조영|무왕|문왕|선왕|해동성국|정혜 공주|정효 공주|주자감|상경성|3성.{0,20}6부|5경.{0,20}15부/},
  {id:'jang-bogo',label:'장보고·청해진',season:'삼국',re:/장보고|청해진/}
];

const typeDefinitions=[
  ['연표·순서형',/연표|순서|사이의 시기|이후에|이전에|전개된 사실/],
  ['지도·지역형',/지도|지역|영토|도읍|수도|천도|강 유역/],
  ['문화유산·이미지형',/문화유산|유적|유물|탑|불상|고분|무덤|벽화|사진|전시회/],
  ['인물·업적형',/인물|왕의 활동|업적|재위 시기|누구|설명으로 옳은/],
  ['사료·자료형',/자료|사료|밑줄|대화|일기|기사|정책|제도/]
];

const figureDefinitions=[
  ['주몽',/주몽/],['고국천왕',/고국천왕/],['소수림왕',/소수림왕/],['광개토 대왕',/광개토 대왕/],['장수왕',/장수왕/],
  ['근초고왕',/근초고왕/],['무령왕',/무령왕/],['백제 성왕',/(?:백제|사비|남부여|관산성).{0,100}성왕|성왕.{0,100}(?:백제|사비|남부여|관산성)/],['의자왕',/의자왕/],['계백',/계백/],
  ['내물왕',/내물왕/],['지증왕',/지증왕/],['법흥왕',/법흥왕/],['진흥왕',/진흥왕/],['선덕 여왕',/선덕 여왕/],['김춘추',/김춘추/],['김유신',/김유신/],
  ['을지문덕',/을지문덕/],['연개소문',/연개소문/],['대조영',/대조영/],['발해 무왕',/(?:발해|인안|흑수 말갈).{0,100}무왕|무왕.{0,100}(?:발해|인안|흑수 말갈)/],
  ['발해 문왕',/(?:발해|대흥|상경|신라도).{0,100}문왕|문왕.{0,100}(?:발해|대흥|상경|신라도)/],['발해 선왕',/(?:발해|건흥|해동성국).{0,100}선왕|선왕.{0,100}(?:발해|건흥|해동성국)/],
  ['원효',/원효/],['의상',/의상/],['혜초',/혜초/],['장보고',/장보고/]
];

const idCounts=new Map();
for(const record of catalog)idCounts.set(record.officialQuestionId,(idCounts.get(record.officialQuestionId)||0)+1);
const unique=[...new Map(catalog.map(record=>[record.officialQuestionId,record])).values()];
const duplicateRows=catalog.length-unique.length;
const classified=unique.map(record=>{
  const text=textFor(record);
  const topics=topicDefinitions.filter(topic=>topic.re.test(text)).map(topic=>topic.id);
  const questionType=(typeDefinitions.find(([,re])=>re.test(text))||['기타 사실 판단형'])[0];
  const difficulty=record.examLevel==='기본'?'기본':/연표|사이의 시기|순서|모두 고른|옳지 않은/.test(text)?'심화-복합':'심화-개념';
  return {...record,topics,questionType,difficulty};
});
const related=classified.filter(record=>record.topics.length);
const byTopic=Object.fromEntries(topicDefinitions.map(topic=>{
  const items=classified.filter(record=>record.topics.includes(topic.id));
  return [topic.id,{label:topic.label,season:topic.season,count:items.length,basic:items.filter(item=>item.examLevel==='기본').length,advanced:items.filter(item=>item.examLevel==='심화').length,rounds:new Set(items.map(item=>item.examRound)).size,ids:items.map(item=>item.officialQuestionId)}];
}));
const byType=Object.fromEntries([...new Set(related.map(record=>record.questionType))].sort().map(type=>[type,related.filter(record=>record.questionType===type).length]));
const byDifficulty=Object.fromEntries([...new Set(related.map(record=>record.difficulty))].sort().map(level=>[level,related.filter(record=>record.difficulty===level).length]));
const namedFigures=Object.fromEntries(figureDefinitions.map(([name,re])=>[name,related.filter(record=>re.test(textFor(record))).length]).filter(([,count])=>count));
const countries=Object.fromEntries(topicDefinitions.map(topic=>[topic.label,byTopic[topic.id].count]));

const report={
  generatedAt:new Date().toISOString(),sourceFiles:['dist/official-exam-catalog.json','dist/official-exam-explanations.json'],
  totals:{catalogRows:catalog.length,uniqueOfficialQuestionIds:unique.length,duplicateRows,explanationRecords:explanationBundle.records.length,ancientPrimaryEra:unique.filter(record=>record.primaryEra==='ancient').length,ancientRelatedUnique:related.length,basicRelated:related.filter(record=>record.examLevel==='기본').length,advancedRelated:related.filter(record=>record.examLevel==='심화').length,distinctRounds:new Set(related.map(record=>record.examRound)).size},
  byTopic,byType,byDifficulty,namedFigures,countries,
  classified:classified.filter(record=>record.topics.length).map(record=>({officialQuestionId:record.officialQuestionId,examRound:record.examRound,examLevel:record.examLevel,questionNumber:record.questionNumber,primaryEra:record.primaryEra,topics:record.topics,questionType:record.questionType,difficulty:record.difficulty}))
};

fs.writeFileSync(path.join(root,'dist','ancient-exam-analysis.json'),JSON.stringify(report,null,2)+'\n');

const rows=topicDefinitions.map(topic=>{const value=byTopic[topic.id];return `| ${topic.season} | ${topic.label} | ${value.count} | ${value.basic} | ${value.advanced} | ${value.rounds} |`;}).join('\n');
const typeRows=Object.entries(byType).map(([name,count])=>`| ${name} | ${count} |`).join('\n');
const difficultyRows=Object.entries(byDifficulty).map(([name,count])=>`| ${name} | ${count} |`).join('\n');
const md=`# 원삼국·삼국 공식 기출 1,800문항 분석\n\n- 생성 기준: \`scripts/analyze-ancient-exams.cjs\`가 두 공식 데이터 파일을 직접 순회한 결과\n- 원본 행: **${catalog.length}**\n- 고유 \`officialQuestionId\`: **${unique.length}**\n- 중복 행: **${duplicateRows}**\n- 해설 레코드: **${explanationBundle.records.length}**\n- \`primaryEra === "ancient"\`: **${report.totals.ancientPrimaryEra}**\n- 원삼국·삼국 키워드 관련 고유 문항: **${related.length}** (기본 ${report.totals.basicRelated}, 심화 ${report.totals.advancedRelated}, ${report.totals.distinctRounds}개 회차)\n\n> 주제 수는 한 문항이 여러 나라·사건을 비교할 수 있어 서로 겹친다. ‘관련 고유 문항’은 이 겹침을 제거한 수다. 단순히 \`primaryEra\`만 보지 않고 문제·자료 단서·정답·해설·개념을 함께 검색했다.\n\n## 국가·주제별 출제 수\n\n| 시즌 | 주제 | 관련 문항 | 기본 | 심화 | 출제 회차 수 |\n| --- | ---: | ---: | ---: | ---: | ---: |\n${rows}\n\n## 문제 유형\n\n| 유형 | 문항 수 |\n| --- | ---: |\n${typeRows}\n\n## 난이도 신호\n\n| 구분 | 문항 수 |\n| --- | ---: |\n${difficultyRows}\n\n기본은 사실·용어 확인 비중이 높고, 심화는 사료 식별에 연표·선후 관계·비교 판단을 결합하는 비중이 높았다. 따라서 스토리는 ‘장면에서 단서를 먼저 경험 → 원본 이미지 문제에서 같은 단서를 회수’하는 순서로 구성한다.\n\n## 반복 출제 인물\n\n${Object.entries(namedFigures).sort((a,b)=>b[1]-a[1]).map(([name,count])=>`- ${name}: ${count}`).join('\n')}\n\n## 반복 출제 국가·집단\n\n${Object.entries(countries).sort((a,b)=>b[1]-a[1]).map(([name,count])=>`- ${name}: ${count}`).join('\n')}\n\n## 구현 원칙\n\n1. 스토리 문제는 위 고유 ID 중 챕터 주제와 일치하는 공식 문항만 연결한다.\n2. 원본 이미지, 정답, 해설, \`officialQuestionId\`는 공식 카탈로그 값을 그대로 쓴다.\n3. 자체 제작 문제로 공식 문제 수를 부풀리지 않는다. 자체 제작 문항이 생기면 반드시 ‘심화 연습 · 자체 제작’으로 표시한다.\n4. 시간 이동 장면에는 연도·장소·사건 맥락을 노출하고, 역사 인물·일반 NPC를 세기 너머로 재사용하지 않는다.\n`;
fs.writeFileSync(path.join(root,'docs','ANCIENT_EXAM_ANALYSIS.md'),md);
console.log(JSON.stringify(report.totals,null,2));
