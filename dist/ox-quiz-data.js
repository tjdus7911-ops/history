/* Advanced Korean History Proficiency Test fact-judgement OX question bank. */
(function(){
const OX_CONTENT_REVISION='2026-10-jokbo-core-v1';
const CURATED_ROWS=globalThis.OX_QUIZ_CURATION;
const CORE_ITEMS=globalThis.OX_QUIZ_CORE_ITEMS;
if(!Array.isArray(CURATED_ROWS))throw new Error('OX curated question data must load before ox-quiz-data.js');
if(!Array.isArray(CORE_ITEMS))throw new Error('OX core-item data must load before ox-quiz-data.js');

const OX_ERAS=[
 {id:'prehistoric',name:'선사·고조선',shortName:'선사·고조선'},
 {id:'kingdoms',name:'여러 나라의 성장·삼국·남북국',shortName:'삼국·남북국'},
 {id:'goryeo',name:'고려',shortName:'고려'},
 {id:'joseon',name:'조선',shortName:'조선'},
 {id:'empire',name:'개항기·대한제국',shortName:'개항기'},
 {id:'occupation',name:'일제강점기',shortName:'일제강점기'},
 {id:'republic',name:'대한민국',shortName:'대한민국'}
];
const ERA_IDS=new Set(OX_ERAS.map(era=>era.id));
const CORE_BY_ID=new Map(CORE_ITEMS.map(item=>[item.id,item]));
if(CORE_BY_ID.size!==CORE_ITEMS.length)throw new Error('OX core ids must be unique');

const SOURCE_RECORDS=(globalThis.OFFICIAL_EXAM_SOURCE_RECORDS||[]).filter(record=>record.examLevel==='심화');
const SOURCE_BY_ID=new Map(SOURCE_RECORDS.map(record=>[record.officialQuestionId,record]));
const ids=new Set();
const OX_QUESTIONS=CURATED_ROWS.map(row=>{
 if(!row||typeof row!=='object')throw new Error('OX curated rows must be objects');
 if(ids.has(row.id))throw new Error(`OX curated question id must be unique: ${row.id}`);
 ids.add(row.id);
 const match=/^ox-([a-z]+)-(\d{3,})$/.exec(row.id);
 if(!match||!ERA_IDS.has(match[1]))throw new Error(`OX curated question has invalid id: ${row.id}`);
 const core=CORE_BY_ID.get(row.coreId);
 if(!core)throw new Error(`OX curated question ${row.id} has missing coreId ${row.coreId}`);
 if(core.eraId!==match[1])throw new Error(`OX curated question ${row.id} and core ${row.coreId} disagree on era`);
 if(typeof row.answer!=='boolean')throw new Error(`OX curated answer missing: ${row.id}`);
 if(!/^sha256:[0-9a-f]{64}$/.test(row.contentFingerprint||''))throw new Error(`OX curated content fingerprint missing: ${row.id}`);
 const sourceQuestionIds=Array.isArray(row.sourceQuestionIds)?[...row.sourceQuestionIds]:[];
 const sources=sourceQuestionIds.map(officialQuestionId=>{
  const source=SOURCE_BY_ID.get(officialQuestionId);
  if(!source)throw new Error(`OX curated question ${row.id} has unknown 심화 source ${officialQuestionId}`);
  return source;
 });
 const sourceRounds=[...new Set(sources.map(source=>source.examRound))].sort((a,b)=>a-b);
 return Object.freeze({
  id:row.id,
  eraId:match[1],
  coreId:row.coreId,
  topicId:row.topicId,
  statement:row.statement,
  answer:row.answer,
  explanation:row.explanation,
  difficulty:row.difficulty,
  tags:[...row.tags],
  sourceRefs:[...row.sourceRefs],
  sourceQuestionIds,
  sourceRounds,
  frequency:sourceRounds.length,
  contentFingerprint:row.contentFingerprint,
  contentRevision:OX_CONTENT_REVISION
 });
});

const roundNumbers=[...new Set(SOURCE_RECORDS.map(record=>record.examRound))].sort((a,b)=>a-b);
const eraCounts=Object.fromEntries(OX_ERAS.map(era=>[era.id,OX_QUESTIONS.filter(question=>question.eraId===era.id).length]));
const coreEraCounts=Object.fromEntries(OX_ERAS.map(era=>[era.id,CORE_ITEMS.filter(item=>item.eraId===era.id).length]));
const coverageCounts=Object.fromEntries(CORE_ITEMS.map(item=>[item.id,0]));
for(const question of OX_QUESTIONS)coverageCounts[question.coreId]++;
const uncoveredCoreIds=CORE_ITEMS.filter(item=>!coverageCounts[item.id]).map(item=>item.id);
const duplicateCount=values=>values.length-new Set(values).size;
const topConcepts=CORE_ITEMS.map(core=>{
 const questions=OX_QUESTIONS.filter(question=>question.coreId===core.id);
 const sourceRounds=[...new Set(questions.flatMap(question=>question.sourceRounds))].sort((a,b)=>a-b);
 return {coreId:core.id,label:core.title,questionCount:questions.length,sourceRounds};
}).sort((left,right)=>right.questionCount-left.questionCount||left.coreId.localeCompare(right.coreId)).slice(0,20);

globalThis.OX_ERAS=Object.freeze(OX_ERAS);
globalThis.OX_QUESTIONS=Object.freeze(OX_QUESTIONS);
globalThis.OX_CONTENT_REVISION=OX_CONTENT_REVISION;
globalThis.OX_ANALYSIS_REPORT=Object.freeze({
 contentRevision:OX_CONTENT_REVISION,
 sourcePolicy:'explicit-reviewed-only',
 examLevel:'심화',
 roundCount:roundNumbers.length,
 rounds:roundNumbers,
 questionCount:SOURCE_RECORDS.length,
 generatedQuestionCount:OX_QUESTIONS.length,
 curatedQuestionCount:CURATED_ROWS.length,
 coreItemCount:CORE_ITEMS.length,
 coveredCoreItemCount:CORE_ITEMS.length-uncoveredCoreIds.length,
 uncoveredCoreIds,
 eraCounts,
 coreEraCounts,
 answerBalance:{o:OX_QUESTIONS.filter(question=>question.answer).length,x:OX_QUESTIONS.filter(question=>!question.answer).length},
 linkedQuestionCount:OX_QUESTIONS.filter(question=>question.sourceQuestionIds.length).length,
 unlinkedQuestionCount:OX_QUESTIONS.filter(question=>!question.sourceQuestionIds.length).length,
 officialSourceLinkCount:OX_QUESTIONS.reduce((sum,question)=>sum+question.sourceQuestionIds.length,0),
 statementDuplicateCount:duplicateCount(OX_QUESTIONS.map(question=>question.statement.normalize('NFKC').replace(/\s+/g,''))),
 fingerprintDuplicateCount:duplicateCount(OX_QUESTIONS.map(question=>question.contentFingerprint)),
 topConcepts
});
})();
