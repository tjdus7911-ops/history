const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');

const catalog=JSON.parse(fs.readFileSync('dist/official-exam-catalog.json','utf8'));
const inventory=JSON.parse(fs.readFileSync('dist/official-exam-inventory.json','utf8'));
const explanationPayload=JSON.parse(fs.readFileSync('dist/official-exam-explanations.json','utf8'));
const explanations=explanationPayload.records;
const expectedNewEditions=new Set([
  '61:심화','63:기본','64:기본','66:기본','67:심화',
  '71:기본','71:심화','73:심화','77:기본','79:기본'
]);
const labels=['①','②','③','④','⑤'];
const generic=/핵심 개념을 판별|핵심 단서|자료의 조건과 일치|다른 선택지는 구분해야|확인해야 합니다|자료의 사료·사진·지도 자체가|원문 문제는/;

assert.equal(catalog.length,1800);
assert.equal(inventory.canonicalQuestionCount,1800);
assert.equal(inventory.examEditionCount,36);
assert.deepEqual(inventory.lastImport,{editionCount:10,questionCount:500,existingCanonicalMatchCount:0,duplicateCanonicalKeyCount:0});
assert.equal(explanations.length,1800);
assert.equal(new Set(catalog.map(item=>`${item.examRound}:${item.examLevel}:${item.questionNumber}`)).size,1800,'duplicate exam key');
assert.equal(new Set(catalog.map(item=>item.officialQuestionId)).size,1800,'duplicate officialQuestionId');
assert.equal(new Set(explanations.map(item=>item.officialQuestionId)).size,1800,'duplicate explanation ID');

const editionGroups=new Map;
for(const item of catalog){
  const editionKey=`${item.examRound}:${item.examLevel}`;
  if(!editionGroups.has(editionKey))editionGroups.set(editionKey,[]);
  editionGroups.get(editionKey).push(item);
  assert.equal(item.officialQuestionId,`official-${item.examRound}-${item.examLevel==='심화'?'advanced':'basic'}-${String(item.questionNumber).padStart(2,'0')}`);
  assert.equal(item.answerLabel,item.answer===null?'없음':labels[item.answer]);
  assert(item.sourcePage>=1&&item.sourcePage<=12);
  const imagePath=path.join('dist',item.questionImage);
  assert(fs.existsSync(imagePath)&&fs.statSync(imagePath).size>500,imagePath);
}
for(const [key,items] of editionGroups){
  items.sort((a,b)=>a.questionNumber-b.questionNumber);
  assert.deepEqual(items.map(item=>item.questionNumber),Array.from({length:50},(_,index)=>index+1),key+' question sequence');
  for(let index=1;index<items.length;index++){
    assert(items[index-1].sourcePage<=items[index].sourcePage,key+' source page order');
  }
  assert.equal(items.reduce((sum,item)=>sum+item.points,0),100,key+' point total');
  assert.equal(items.length,50,key+' question count');
}
assert.deepEqual(new Set([...expectedNewEditions].filter(key=>editionGroups.has(key))),expectedNewEditions,'missing imported edition');
assert.equal([...expectedNewEditions].reduce((sum,key)=>sum+editionGroups.get(key).length,0),500);

const explanationById=new Map(explanations.map(item=>[item.officialQuestionId,item]));
for(const item of catalog){
  const row=explanationById.get(item.officialQuestionId);
  assert(row&&row.explanation.trim(),item.officialQuestionId+' missing explanation');
  assert(!generic.test(row.explanation),item.officialQuestionId+' generic explanation');
  assert((row.explanation.match(/[.!?](?:[’'\"]|$|\s)/g)||[]).length>=3,item.officialQuestionId+' short explanation');
}
assert.equal(explanationPayload.qa.forbiddenGenericCount,0);
assert.equal(explanationPayload.qa.qaDeferredCount,0);
assert.equal(explanationPayload.qa.newExplanationCount,500);
assert.equal(explanationPayload.qa.modifiedExistingCount,1300);
assert.equal(explanationPayload.qa.metadataMismatchFixedCount,32);
assert.equal(explanationPayload.qa.knowledgeRuleCount,1800);
assert.equal(explanationPayload.qa.evidenceFallbackCount,0);

const sharedGroups=inventory.exams.flatMap(exam=>(exam.sharedStimulusGroups||[]).map(group=>({round:exam.examRound,level:exam.examLevel,...group})));
assert.deepEqual(sharedGroups,[
  {round:57,level:'심화',start:35,end:36},
  {round:61,level:'심화',start:29,end:30},
  {round:62,level:'심화',start:49,end:50},
  {round:63,level:'심화',start:47,end:48},
  {round:66,level:'심화',start:30,end:31},
  {round:67,level:'심화',start:47,end:48},
]);
for(const group of sharedGroups)for(let number=group.start;number<=group.end;number++){
  const slug=group.level==='심화'?'advanced':'basic';
  const imagePath=path.join('dist','assets','exams','catalog',`${group.round}-${slug}-${String(number).padStart(2,'0')}.webp`);
  assert(fs.statSync(imagePath).size>20000,imagePath+' shared source missing');
}

const fixedSource=catalog.find(item=>item.officialQuestionId==='official-57-basic-20');
const fixedExplanation=explanationById.get('official-57-basic-20');
assert(fixedSource&&fixedExplanation);
assert.equal(fixedSource.answer,2);assert.equal(fixedSource.answerLabel,'③');assert.equal(fixedSource.primaryEra,'goryeo');
assert.equal(fixedExplanation.question,'밑줄 그은 ‘탑’으로 옳은 것은?');
for(const phrase of ['오대산','월정사','고려 시대','팔각 구층 석탑','③'])assert(fixedExplanation.explanation.includes(phrase),phrase);
assert(!fixedExplanation.explanation.includes('밑줄 그은 ‘법’'));

const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]).filter(name=>name!=='pwa.js');
let html='',saved=null,handlers={};
const context=vm.createContext({Date,console,document:{querySelector:selector=>selector==='#app'?{set innerHTML(value){html=value}}:null,querySelectorAll:()=>[],addEventListener:(type,handler,capture)=>{(handlers[type]||=[]).push({handler,capture})},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){}});
const run=code=>vm.runInContext(code,context),copy=code=>JSON.parse(run('JSON.stringify('+code+')'));
run(scripts.map(name=>fs.readFileSync('dist/'+name,'utf8')).join('\n'));

const beforeStoryOrder=copy('Object.fromEntries(Object.entries(QUESTION_SETS).map(([id,set])=>[id,{practice:[...(set.practiceQuestionIds||[])],official:[...(set.officialQuestionIds||[])]}]))');
for(const era of ['ancient','goryeo','joseon','empire','occupation','republic'])for(const level of ['all','심화','기본']){
  const rows=copy(`globalThis.OFFICIAL_ENTRIES_FOR_ERA(${JSON.stringify(era)},${JSON.stringify(level)})`);
  for(let index=1;index<rows.length;index++){
    const previous=rows[index-1].sourceRecord,current=rows[index].sourceRecord;
    assert(previous.examRound>current.examRound||previous.examRound===current.examRound&&previous.questionNumber<=current.questionNumber,`${era}/${level} order`);
  }
}
for(const [key,items] of editionGroups){
  const [round,level]=key.split(':');
  const numbers=copy(`globalThis.OFFICIAL_ENTRIES_FOR_ROUND(${round},${JSON.stringify(level)}).map(entry=>entry.sourceRecord.questionNumber)`);
  assert.deepEqual(numbers,Array.from({length:50},(_,index)=>index+1),key+' runtime order');
}
const goryeoBefore=copy("globalThis.OFFICIAL_ENTRIES_FOR_ERA('goryeo','all').map(entry=>entry.canonicalQuestionId)");
run(`state.meta.questionRecords={};for(const [index,id] of ${JSON.stringify(goryeoBefore.slice(0,20))}.entries())state.meta.questionRecords[id]={attempts:index+1,lastCorrect:index%2===0};`);
assert.deepEqual(copy("globalThis.OFFICIAL_ENTRIES_FOR_ERA('goryeo','all').map(entry=>entry.canonicalQuestionId)"),goryeoBefore,'solved/wrong state changed order');
assert.deepEqual(copy('Object.fromEntries(Object.entries(QUESTION_SETS).map(([id,set])=>[id,{practice:[...(set.practiceQuestionIds||[])],official:[...(set.officialQuestionIds||[])]}]))'),beforeStoryOrder,'Story order changed');

for(const entry of copy('globalThis.OFFICIAL_EXAM_CATALOG')){
  const expected=explanationById.get(entry.sourceRecord.officialQuestionId).explanation;
  for(const alias of entry.aliases){
    const actual=run(`QUESTIONS.find(question=>question.questionId===${JSON.stringify(alias)})?.explanation`);
    assert.equal(actual,expected,alias+' does not use canonical explanation');
  }
}
const runtimeFixed=copy("globalThis.OFFICIAL_EXAM_CATALOG.find(entry=>entry.sourceRecord.officialQuestionId==='official-57-basic-20')");
assert.equal(runtimeFixed.primaryEra,'goryeo');

console.log('PASS: 1,800 canonical questions; 500 attached imports; no duplicate/missing keys; official answers, images, explanations, newest-first era order, round order, stable solved/wrong order, Story preservation, shared canonical explanations, and 57-basic-20 correction verified.');
