const crypto=require('crypto');
const fs=require('fs');
const path=require('path');

const ROOT=path.resolve(__dirname,'..');
const SOURCE_DIR=path.join(ROOT,'docs','ox-quiz-curation');
const OUTPUT=path.join(ROOT,'dist','ox-quiz-curation.js');
const CORE_ITEMS_FILE=path.join(SOURCE_DIR,'core-items.json');
const ID_HISTORY_FILE=path.join(SOURCE_DIR,'id-history.json');
const DECISION_LEDGER_FILE=path.join(SOURCE_DIR,'decision-ledger.json');
const OFFICIAL_LINK_ALLOWLIST_FILE=path.join(SOURCE_DIR,'official-link-allowlist.json');
const OFFICIAL_CATALOG_FILE=path.join(ROOT,'dist','official-exam-catalog.json');
const ERA_IDS=['prehistoric','kingdoms','goryeo','joseon','empire','occupation','republic'];
const ROW_KEYS=['answer','coreId','difficulty','explanation','id','sourceQuestionIds','sourceRefs','statement','tags','topicId'];
const CORE_KEYS=['eraId','id','keyFacts','sourceRefs','title'];
const DIFFICULTIES=new Set(['easy','medium','hard']);
const BANNED_STATEMENT=/(?:다음 설명에 해당하는 역사 용어|이 문장이 (?:직접 )?설명하는 핵심 개념|위 설명은 .+로 분류|이 내용의 학습 주제|→|\?)/;
const BANNED_EXPLANATION=/(?:이 사실은 당시의 역사적 배경을 보여 줍니다|이는 .+의 특징입니다|위 설명은 올바른 역사적 사실입니다|제시된 답이 틀렸고 올바른 답은)/;
const normalize=value=>String(value||'').normalize('NFKC').replace(/[\s.,!?·'"“”‘’():;~\-『』〈〉《》]/g,'');
const normalizeFingerprintText=value=>String(value||'').normalize('NFKC').replace(/\s+/g,' ').trim();
const sentenceCount=value=>(String(value).match(/[.!?](?=\s|$)/g)||[]).length;
const tokens=value=>(String(value).match(/[가-힣A-Za-z0-9·]+/g)||[]).map(token=>token.replace(/[은는이가을를의에에서와과로으로도만부터까지께서]+$/,'')).filter(token=>token.length>=2);

function fail(message){throw new Error(`OX curation: ${message}`)}
function loadJson(file,label){
 if(!fs.existsSync(file))fail(`missing ${path.relative(ROOT,file)}`);
 try{return JSON.parse(fs.readFileSync(file,'utf8'))}catch(error){fail(`${label} is not valid JSON: ${error.message}`)}
}
function hasExactKeys(value,keys){return value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).sort().join(',')===keys.join(',')}
function nonEmptyString(value){return typeof value==='string'&&value.trim().length>0}
function validateStringArray(value,label,{allowEmpty=false}={}){
 if(!Array.isArray(value)||(!allowEmpty&&!value.length))fail(`${label} must be ${allowEmpty?'an':'a non-empty'} array of strings`);
 const seen=new Set();
 for(const item of value){
  if(!nonEmptyString(item))fail(`${label} must contain only non-empty strings`);
  if(seen.has(item))fail(`${label} contains duplicate value ${item}`);
  seen.add(item);
 }
 return value;
}
function contentFingerprint(row){
 const content=[normalizeFingerprintText(row.statement),row.answer];
 return `sha256:${crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex')}`;
}
function parseQuestionId(id,label){
 const match=/^ox-([a-z]+)-(\d{3,})$/.exec(id);
 if(!match||!ERA_IDS.includes(match[1]))fail(`${label} has invalid OX id ${id}`);
 const number=Number(match[2]);
 if(!Number.isSafeInteger(number)||number<1)fail(`${label} has invalid OX sequence ${id}`);
 const canonicalId=`ox-${match[1]}-${String(number).padStart(3,'0')}`;
 if(id!==canonicalId)fail(`${label} must use canonical OX id ${canonicalId} (actual ${id})`);
 return {eraId:match[1],number};
}

const officialCatalog=loadJson(OFFICIAL_CATALOG_FILE,'official-exam-catalog.json');
if(!Array.isArray(officialCatalog))fail('official-exam-catalog.json must be an array');
const officialIds=new Set(officialCatalog.filter(item=>item&&item.examLevel==='심화'&&nonEmptyString(item.officialQuestionId)).map(item=>item.officialQuestionId));
const officialLinkAllowlist=loadJson(OFFICIAL_LINK_ALLOWLIST_FILE,'official-link-allowlist.json');
if(!hasExactKeys(officialLinkAllowlist,['links'])||!Array.isArray(officialLinkAllowlist.links))fail('official-link-allowlist.json must contain only a links array');
const approvedOfficialPairs=new Set();
for(const [index,link] of officialLinkAllowlist.links.entries()){
 const label=`official-link-allowlist.json row ${index+1}`;
 if(!hasExactKeys(link,['evidence','officialQuestionId','questionId']))fail(`${label} must use only evidence, officialQuestionId, and questionId`);
 parseQuestionId(link.questionId,label);
 if(!officialIds.has(link.officialQuestionId))fail(`${label} refers to missing 심화 officialQuestionId ${link.officialQuestionId}`);
 if(!nonEmptyString(link.evidence))fail(`${label} must record the manual comparison evidence`);
 const pair=`${link.questionId}\u0000${link.officialQuestionId}`;
 if(approvedOfficialPairs.has(pair))fail(`${label} duplicates ${link.questionId} -> ${link.officialQuestionId}`);
 approvedOfficialPairs.add(pair);
}

const coreItems=loadJson(CORE_ITEMS_FILE,'core-items.json');
if(!Array.isArray(coreItems)||!coreItems.length)fail('core-items.json must be a non-empty array');
const coreById=new Map();
for(const [index,item] of coreItems.entries()){
 const label=`core-items.json row ${index+1}`;
 if(!hasExactKeys(item,CORE_KEYS))fail(`${label} must use only ${CORE_KEYS.join(', ')}`);
 if(!nonEmptyString(item.id))fail(`${label} id must be a non-empty string`);
 if(coreById.has(item.id))fail(`duplicate core id ${item.id}`);
 if(!ERA_IDS.includes(item.eraId))fail(`${item.id} has unknown eraId ${item.eraId}`);
 if(!nonEmptyString(item.title))fail(`${item.id} title must be a non-empty string`);
 validateStringArray(item.keyFacts,`${item.id} keyFacts`);
 validateStringArray(item.sourceRefs,`${item.id} sourceRefs`);
 coreById.set(item.id,item);
}

const idHistory=loadJson(ID_HISTORY_FILE,'id-history.json');
if(!hasExactKeys(idHistory,['eraMaxIssued','retiredIds']))fail('id-history.json must use only eraMaxIssued and retiredIds');
if(!idHistory.eraMaxIssued||typeof idHistory.eraMaxIssued!=='object'||Array.isArray(idHistory.eraMaxIssued))fail('id-history.json eraMaxIssued must be an object');
if(Object.keys(idHistory.eraMaxIssued).sort().join(',')!==ERA_IDS.slice().sort().join(','))fail(`id-history.json eraMaxIssued must contain exactly ${ERA_IDS.join(', ')}`);
for(const eraId of ERA_IDS){
 const max=idHistory.eraMaxIssued[eraId];
 if(!Number.isSafeInteger(max)||max<0)fail(`id-history.json eraMaxIssued.${eraId} must be a non-negative integer`);
}
validateStringArray(idHistory.retiredIds,'id-history.json retiredIds',{allowEmpty:true});
const retiredIds=new Set();
for(const id of idHistory.retiredIds){
 const parsed=parseQuestionId(id,'id-history.json retiredIds');
 if(parsed.number>idHistory.eraMaxIssued[parsed.eraId])fail(`${id} is above the recorded maximum for ${parsed.eraId}`);
 retiredIds.add(id);
}
const decisionLedger=loadJson(DECISION_LEDGER_FILE,'decision-ledger.json');
if(!decisionLedger||typeof decisionLedger!=='object'||Array.isArray(decisionLedger)||!Array.isArray(decisionLedger.decisions))fail('decision-ledger.json must contain a decisions array');
const decisionById=new Map(),allowedDecisions=new Set(['keep','modify','exclude','new']);
for(const [index,decision] of decisionLedger.decisions.entries()){
 const label=`decision-ledger.json row ${index+1}`;
 if(!decision||typeof decision!=='object'||Array.isArray(decision))fail(`${label} must be an object`);
 if(!nonEmptyString(decision.id)||decisionById.has(decision.id))fail(`${label} has a missing or duplicate id ${decision.id}`);
 const parsed=parseQuestionId(decision.id,label);
 if(parsed.number>idHistory.eraMaxIssued[parsed.eraId])fail(`${decision.id} is above the recorded maximum for ${parsed.eraId}`);
 if(decision.eraId!==parsed.eraId)fail(`${decision.id} ledger eraId must be ${parsed.eraId}`);
 if(!allowedDecisions.has(decision.decision))fail(`${decision.id} has unsupported decision ${decision.decision}`);
 decisionById.set(decision.id,decision);
}

const eras={};
const all=[];
const allIds=new Set();
const activeNumbers=Object.fromEntries(ERA_IDS.map(eraId=>[eraId,new Set()]));
const statementKeys=new Map();
const explanationKeys=new Map();
const usedOfficialPairs=new Set();
for(const eraId of ERA_IDS){
 const file=path.join(SOURCE_DIR,`${eraId}.json`);
 const rows=loadJson(file,`${eraId}.json`);
 if(!Array.isArray(rows))fail(`${eraId}.json must be an array`);
 eras[eraId]=rows.map((row,index)=>{
  const label=`${eraId}.json row ${index+1}`;
  if(!hasExactKeys(row,ROW_KEYS))fail(`${label} must use only ${ROW_KEYS.join(', ')}`);
  if(!nonEmptyString(row.id))fail(`${label} id must be a non-empty string`);
  const parsed=parseQuestionId(row.id,label);
  if(parsed.eraId!==eraId)fail(`${row.id} belongs in ${parsed.eraId}.json, not ${eraId}.json`);
  if(parsed.number>idHistory.eraMaxIssued[eraId])fail(`${row.id} is above id-history maximum ${idHistory.eraMaxIssued[eraId]}`);
  if(retiredIds.has(row.id))fail(`${row.id} reuses a retired id`);
  if(allIds.has(row.id))fail(`duplicate question id ${row.id}`);
  allIds.add(row.id);
  activeNumbers[eraId].add(parsed.number);

  if(!nonEmptyString(row.coreId)||!coreById.has(row.coreId))fail(`${row.id} refers to missing coreId ${row.coreId}`);
  const core=coreById.get(row.coreId);
  if(core.eraId!==eraId)fail(`${row.id} coreId ${row.coreId} belongs to ${core.eraId}`);
  if(!nonEmptyString(row.topicId))fail(`${row.id} topicId must be a non-empty string`);
  if(typeof row.answer!=='boolean')fail(`${row.id} answer must be a historically reviewed Boolean`);
  if(!DIFFICULTIES.has(row.difficulty))fail(`${row.id} difficulty must be easy, medium, or hard`);
  validateStringArray(row.tags,`${row.id} tags`);
  validateStringArray(row.sourceRefs,`${row.id} sourceRefs`);
  validateStringArray(row.sourceQuestionIds,`${row.id} sourceQuestionIds`,{allowEmpty:true});
  const coreSourceRefs=new Set(core.sourceRefs);
  for(const ref of row.sourceRefs)if(!coreSourceRefs.has(ref))fail(`${row.id} sourceRef ${ref} is not declared by core ${row.coreId}`);
  for(const officialId of row.sourceQuestionIds){
   if(!officialIds.has(officialId))fail(`${row.id} refers to missing 심화 officialQuestionId ${officialId}`);
   const pair=`${row.id}\u0000${officialId}`;
   if(!approvedOfficialPairs.has(pair))fail(`${row.id} -> ${officialId} is not in the manually reviewed official-link allowlist`);
   usedOfficialPairs.add(pair);
  }

  if(typeof row.statement!=='string'||row.statement.length<12||!/\.$/.test(row.statement))fail(`${row.id} needs a complete declarative statement`);
  if(BANNED_STATEMENT.test(row.statement))fail(`${row.id} contains a question, arrow, or classification template`);
  if(sentenceCount(row.statement)!==1)fail(`${row.id} must test one declarative sentence`);
  const statementKey=normalize(row.statement);
  if(statementKeys.has(statementKey))fail(`${row.id} duplicates statement from ${statementKeys.get(statementKey)}`);
  statementKeys.set(statementKey,row.id);

  if(typeof row.explanation!=='string'||/^[OX]입니다\./.test(row.explanation))fail(`${row.id} explanation must contain only the learning explanation; the runtime adds the answer label`);
  const explanationSentences=sentenceCount(row.explanation);
  if(explanationSentences<2||explanationSentences>4)fail(`${row.id} explanation must contain 2-4 sentences (actual ${explanationSentences})`);
  if(BANNED_EXPLANATION.test(row.explanation))fail(`${row.id} uses a banned generic explanation`);
  if(!row.answer&&!/틀|아니|잘못|반대/.test(row.explanation))fail(`${row.id} is X but does not identify the incorrect part`);
  const explanationKey=normalize(row.explanation),statementBody=normalize(row.statement);
  if(explanationKey===statementBody||explanationKey.startsWith(statementBody))fail(`${row.id} explanation merely repeats the statement`);
  const statementTokens=new Set(tokens(row.statement));
  const newTokens=new Set(tokens(row.explanation).filter(token=>!statementTokens.has(token)));
  if(newTokens.size<5)fail(`${row.id} explanation must add historical context or a judging basis (new tokens ${newTokens.size}/5)`);
  if(explanationKeys.has(explanationKey))fail(`${row.id} duplicates explanation from ${explanationKeys.get(explanationKey)}`);
  explanationKeys.set(explanationKey,row.id);

  const generated={...row,contentFingerprint:contentFingerprint(row)};
  all.push(generated);
  return generated;
 });
}

for(const pair of approvedOfficialPairs)if(!usedOfficialPairs.has(pair))fail(`official-link-allowlist.json contains an unused approved pair ${pair.replace('\u0000',' -> ')}`);

for(const eraId of ERA_IDS){
 const max=idHistory.eraMaxIssued[eraId];
 for(let number=1;number<=max;number++){
  const id=`ox-${eraId}-${String(number).padStart(3,'0')}`;
  if(!activeNumbers[eraId].has(number)&&!retiredIds.has(id))fail(`${id} is neither active nor listed in retiredIds`);
 }
}

const ledgerRetiredIds=new Set([...decisionById.values()].filter(item=>item.decision==='exclude').map(item=>item.id));
if(ledgerRetiredIds.size!==retiredIds.size||[...ledgerRetiredIds].some(id=>!retiredIds.has(id))||[...retiredIds].some(id=>!ledgerRetiredIds.has(id)))fail('decision-ledger exclude ids must exactly match id-history retiredIds');
for(const row of all){
 const decision=decisionById.get(row.id);
 if(!decision||decision.decision==='exclude')fail(`${row.id} must have an active keep, modify, or new decision in decision-ledger.json`);
 if(decision.coreId!==row.coreId)fail(`${row.id} coreId differs between its source row and decision ledger`);
}
for(const [id,decision] of decisionById)if(decision.decision!=='exclude'&&!allIds.has(id))fail(`${id} is active in decision-ledger.json but missing from the era source files`);
for(const eraId of ERA_IDS)for(let number=1;number<=idHistory.eraMaxIssued[eraId];number++){
 const id=`ox-${eraId}-${String(number).padStart(3,'0')}`;
 if(!decisionById.has(id))fail(`${id} is missing from decision-ledger.json`);
}
const decisionCounts={keep:0,modify:0,exclude:0,new:0};
for(const decision of decisionById.values())decisionCounts[decision.decision]++;
const summary=decisionLedger.summary||{};
if(summary.keptExisting!==decisionCounts.keep||summary.modifiedExisting!==decisionCounts.modify||summary.excludedExisting!==decisionCounts.exclude||summary.newQuestions!==decisionCounts.new||summary.activeQuestions!==all.length||summary.auditedExisting!==decisionCounts.keep+decisionCounts.modify+decisionCounts.exclude)fail('decision-ledger summary does not match its decisions and active source rows');

const coverageCounts=Object.fromEntries(coreItems.map(item=>[item.id,0]));
for(const row of all)coverageCounts[row.coreId]++;
const uncoveredCoreIds=coreItems.filter(item=>coverageCounts[item.id]===0).map(item=>item.id);
if(uncoveredCoreIds.length)fail(`core items without an active OX question: ${uncoveredCoreIds.join(', ')}`);

const explanationCounts=all.map(row=>sentenceCount(row.explanation));
const fingerprintCount=new Set(all.map(row=>row.contentFingerprint)).size;
if(fingerprintCount!==all.length)fail('duplicate statement/answer content fingerprint');
const report={
 questionCount:all.length,
 coreItemCount:coreItems.length,
 coveredCoreItemCount:coreItems.length-uncoveredCoreIds.length,
 uncoveredCoreIds,
 eraCounts:Object.fromEntries(ERA_IDS.map(eraId=>[eraId,eras[eraId].length])),
 coreEraCounts:Object.fromEntries(ERA_IDS.map(eraId=>[eraId,coreItems.filter(item=>item.eraId===eraId).length])),
 answerBalance:{o:all.filter(row=>row.answer).length,x:all.filter(row=>!row.answer).length},
 sourceReferencedQuestionCount:all.filter(row=>row.sourceRefs.length).length,
 officialLinkedQuestionCount:all.filter(row=>row.sourceQuestionIds.length).length,
 officialSourceLinkCount:all.reduce((sum,row)=>sum+row.sourceQuestionIds.length,0),
 retiredQuestionCount:retiredIds.size,
 eraMaxIssued:{...idHistory.eraMaxIssued},
 declarativeStatementCount:all.filter(row=>!row.statement.includes('?')).length,
 explanationSentenceRange:explanationCounts.length?[Math.min(...explanationCounts),Math.max(...explanationCounts)]:[0,0],
 genericTemplateCount:all.filter(row=>BANNED_STATEMENT.test(row.statement)||BANNED_EXPLANATION.test(row.explanation)).length,
 statementDuplicateCount:all.length-statementKeys.size,
 explanationDuplicateCount:all.length-explanationKeys.size,
 fingerprintDuplicateCount:all.length-fingerprintCount
};
const output=`/* Generated by scripts/build-ox-quiz-curation.cjs from reviewed source files. */\n(function(){\nconst coreItems=${JSON.stringify(coreItems,null,2)};\nconst eras=${JSON.stringify(eras,null,2)};\nglobalThis.OX_QUIZ_CORE_ITEMS=Object.freeze(coreItems);\nglobalThis.OX_QUIZ_CURATION=Object.freeze(Object.values(eras).flat());\nglobalThis.OX_CURATION_REPORT=Object.freeze(${JSON.stringify(report)});\n})();\n`;
if(process.argv.includes('--check')){
 if(!fs.existsSync(OUTPUT)||fs.readFileSync(OUTPUT,'utf8')!==output)fail('dist/ox-quiz-curation.js is stale; run node scripts/build-ox-quiz-curation.cjs');
 console.log(`PASS: ${report.questionCount} reviewed OX questions across ${report.coreItemCount} core items are valid and generated output is current.`);
}else{
 fs.writeFileSync(OUTPUT,output);
 console.log(`WROTE: ${path.relative(ROOT,OUTPUT)} (${report.questionCount} reviewed questions; ${report.coreItemCount} core items)`);
}
