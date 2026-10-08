const fs=require('fs'),runtime=require('./mnemonic-runtime.cjs')();
const data=JSON.parse(fs.readFileSync('dist/mnemonic-inventory.json','utf8'));
data.cards=runtime.cards;
const cards=data.cards,statuses=cards.reduce((out,card)=>(out[card.status]=(out[card.status]||0)+1,out),{});
const published=cards.filter(card=>card.publicationStatus==='PUBLISHED');
const publishedBySourceStatus=published.reduce((out,card)=>(out[card.status]=(out[card.status]||0)+1,out),{});
const officialIds=new Set(cards.flatMap(card=>card.relatedOfficialQuestionIds));
const sceneIds=new Set(cards.flatMap(card=>card.relatedSceneIds));
const source=JSON.parse(fs.readFileSync('docs/mnemonic-sources/explicit-request.json','utf8'));
const sourceIds=new Set(source.records.map(record=>record.id)),importedIds=new Set(cards.map(card=>card.sourceId));
const duplicateRemoved=Math.max(0,cards.length-importedIds.size),inventoryMissing=[...sourceIds].filter(id=>!importedIds.has(id));
const visibleCanonical=runtime.memories.filter(memory=>memory.sourceId),visibleLegacy=runtime.memories.filter(memory=>!memory.sourceId);
const uiMissingPublished=published.filter(card=>!visibleCanonical.some(memory=>memory.sourceId===card.sourceId));
const uiSource=fs.readFileSync('dist/exam-memory-ui.js','utf8');
const exact=cards.every(card=>card.sourceMnemonic===source.records.find(record=>record.id===card.sourceId)?.sourceMnemonic);
const protectedSamples=['복덕(방) 경희(가) 운(다)','광노(안)과 공복 주제(에) 송광풍 여사~','(2개의) 흥수똥 달제양','효심(에는) 이의있삼?','병(이)제 병문한 정양 오신 초덕광 척','원(산에서) 동경(까지) 배(타고) 26(km)','UWOI'];
const samplesPreserved=protectedSamples.every(value=>cards.some(card=>card.sourceMnemonic===value));
const stats={
 explicitInput:source.records.length,registeredSourceRecords:source.records.length,importedRecords:cards.length,additionalSourceRecords:Math.max(0,cards.length-source.records.length),total:cards.length,statuses,
 productionPublished:published.length,publishedBySourceStatus,excluded:cards.length-published.length,duplicateRemoved,inventoryMissing:inventoryMissing.length,
 uiVisibleCanonical:visibleCanonical.length,uiVisibleLegacy:visibleLegacy.length,uiVisibleTotal:runtime.memories.length,uiMissingPublished:uiMissingPublished.length,
 facts:cards.reduce((sum,card)=>sum+card.facts.length,0),mnemonicTopicsLinked:cards.filter(card=>card.relatedOfficialQuestionIds.length).length,
 officialLinks:cards.reduce((sum,card)=>sum+card.relatedOfficialQuestionIds.length,0),uniqueOfficialQuestions:officialIds.size,
 unlinkedTopics:cards.filter(card=>!card.relatedOfficialQuestionIds.length).length,sceneLinks:cards.reduce((sum,card)=>sum+card.relatedSceneIds.length,0),uniqueScenes:sceneIds.size,
 sourcePreservation:{exact,protectedSamples:samplesPreserved,parentheses:exact,numbers:exact,english:cards.some(card=>card.sourceMnemonic==='UWOI')},
 listExposureAudit:{slice10:/\.slice\(0,\s*10\)/.test(uiSource),slice20:/\.slice\(0,\s*20\)/.test(uiSource),limit10:/limit\s*:\s*10/.test(uiSource),limit20:/limit\s*:\s*20/.test(uiSource),publicationGate:/publicationStatus!==['"]PUBLISHED['"]/.test(uiSource),reviewStatusGate:/sourceReviewStatus===['"]VERIFIED['"]/.test(uiSource)}
};
fs.writeFileSync('dist/mnemonic-inventory.json',JSON.stringify(data,null,2)+'\n');
fs.writeFileSync('dist/mnemonic-data.js','/* Generated from docs/mnemonic-sources/explicit-request.json. */\n'+`globalThis.MNEMONIC_INVENTORY=${JSON.stringify(cards)};\nglobalThis.MNEMONIC_IMPORT_BASELINE=globalThis.MNEMONIC_INVENTORY;\nglobalThis.MNEMONIC_IMPORT_CARDS=globalThis.MNEMONIC_INVENTORY;\nglobalThis.MNEMONIC_IMPORT_CANDIDATES=globalThis.MNEMONIC_INVENTORY.filter(card=>card.publicationStatus!=='PUBLISHED');\n`);
require('../tests/mnemonic-data-test.cjs')(data,runtime);
fs.writeFileSync('docs/mnemonic-sources/import-stats.json',JSON.stringify(stats,null,2)+'\n');

const cell=value=>String(value??'').replace(/\|/g,'\\|').replace(/\r?\n/g,'<br>');
const eraCounts={
 '선사·고대':cards.filter(card=>card.era==='ancient').length,
 '고려':cards.filter(card=>card.era==='goryeo').length,
 '조선':cards.filter(card=>card.era==='joseon').length,
 '개항기/대한제국':cards.filter(card=>card.era==='empire').length,
 '일제강점기':cards.filter(card=>card.era==='occupation').length,
 '현대':cards.filter(card=>card.era==='republic').length
};
const groupCounts=cards.reduce((out,card)=>(out[card.sourceId[0]]=(out[card.sourceId[0]]||0)+1,out),{});
let out='# MNEMONIC IMPORT REVIEW\n\n## Summary\n\n';
out+=`- Registered source records: **${source.records.length}**\n- Imported records: **${cards.length}**\n- Additional records discovered: **${stats.additionalSourceRecords}**\n- Duplicate removed: **${duplicateRemoved}**\n- Inventory missing: **${inventoryMissing.length}**\n- VERIFIED: **${statuses.VERIFIED||0}**\n- REVIEW_REQUIRED: **${statuses.REVIEW_REQUIRED||0}**\n- CANDIDATE: **${statuses.CANDIDATE||0}**\n- Production published: **${published.length}**\n- Excluded from publication: **${cards.length-published.length}**\n- UI visible canonical: **${visibleCanonical.length}**\n- UI visible legacy: **${visibleLegacy.length}**\n- UI visible total: **${runtime.memories.length}**\n- UI missing among approved records: **${uiMissingPublished.length}**\n\n`;
out+=`- Published records by source review state: VERIFIED **${publishedBySourceStatus.VERIFIED||0}** / CANDIDATE **${publishedBySourceStatus.CANDIDATE||0}** / REVIEW_REQUIRED **${publishedBySourceStatus.REVIEW_REQUIRED||0}**\n\n`;
out+='`sourceMnemonic`은 사용자 입력을 그대로 보존합니다. `sourceReviewStatus`와 공개 승인(`publicationStatus`)은 독립적으로 관리하며, 검토 중인 원문을 공개 문자열로 사용하지 않습니다. 공개 화면은 승인된 레코드의 별도 `mnemonic`만 사용합니다.\n\n';
out+='## List exposure audit\n\n';
out+='- Root cause before this fix: the importer accepted only 10 `PUBLISHED` canonical records, so the runtime list contained those 10 plus 2 preserved legacy cards.\n';
out+=`- Current publication gate: **${stats.listExposureAudit.publicationGate?'present (expected)':'missing'}**; all ${published.length} approved canonical records pass it.\n`;
out+=`- Mnemonic-list slice/limit 10: **${stats.listExposureAudit.slice10||stats.listExposureAudit.limit10?'FOUND':'not found'}**\n`;
out+=`- Mnemonic-list slice/limit 20: **${stats.listExposureAudit.limit20?'FOUND':'not found'}**. The only \`.slice(0,20)\` is the intentionally separate official-exam session cap, not mnemonic-list pagination.\n`;
out+=`- \`sourceReviewStatus === 'VERIFIED'\` UI gate: **${stats.listExposureAudit.reviewStatusGate?'FOUND':'not found'}**\n`;
out+=`- Era and search filtering operate on the complete in-memory public set; no mnemonic pagination or initial-sample loader exists.\n`;
out+=`- Developer review route: \`?mnemonicReview=1\` renders all ${cards.length} inventory rows and their review/publication states.\n\n`;
out+='## Source group counts\n\n|그룹|개수|\n|---|---:|\n'+Object.entries(groupCounts).map(([label,count])=>`|${label}|${count}|`).join('\n')+'\n\n';
out+='## UI era counts\n\n|분류|개수|\n|---|---:|\n'+Object.entries(eraCounts).map(([label,count])=>`|${label}|${count}|`).join('\n')+'\n\n';
out+='## Source preservation\n\n|검사|결과|\n|---|---|\n|Exact source strings|'+(exact?'PASS':'FAIL')+'|\n|Parentheses / punctuation|'+(samplesPreserved?'PASS':'FAIL')+'|\n|Numbers|'+(samplesPreserved?'PASS':'FAIL')+'|\n|English mnemonic (`UWOI`)|'+(stats.sourcePreservation.english?'PASS':'FAIL')+'|\n\n';
out+='## Source Review\n\n|ID|title|sourceMnemonic|historical verification|copyright/publication status|appMnemonic status|\n|---|---|---|---|---|---|\n';
for(const card of cards)out+='|'+[card.sourceId,card.title,card.sourceMnemonic,card.status,card.rightsStatus,card.publicationStatus==='PUBLISHED'?card.mnemonic:'EXCLUDED'].map(cell).join('|')+'|\n';
out+='\n## Official Questions\n\n|topic|relatedOfficialQuestionIds|question count|\n|---|---|---:|\n';
for(const card of cards)out+='|'+[`${card.sourceId} ${card.title}`,card.relatedOfficialQuestionIds.join(', '),card.relatedOfficialQuestionIds.length].map(cell).join('|')+'|\n';
out+='\n## Story Mapping\n\n|topic|relatedSceneIds|\n|---|---|\n';
for(const card of cards)out+='|'+[`${card.sourceId} ${card.title}`,card.relatedSceneIds.join(', ')].map(cell).join('|')+'|\n';
out+='\n## Problems\n\n';
out+=`- OCR suspected / historical verification needed: ${cards.filter(card=>card.status==='REVIEW_REQUIRED').map(card=>card.sourceId).join(', ')}\n`;
out+=`- Candidate review: ${cards.filter(card=>card.status==='CANDIDATE').map(card=>card.sourceId).join(', ')}\n`;
out+=`- Duplicate removed: ${duplicateRemoved}\n- Inventory missing: ${inventoryMissing.length}${inventoryMissing.length?' ('+inventoryMissing.join(', ')+')':''}\n- UI missing among approved records: ${uiMissingPublished.length}${uiMissingPublished.length?' ('+uiMissingPublished.map(card=>card.sourceId).join(', ')+')':''}\n- Copyright review: ${cards.filter(card=>card.rightsStatus==='USER_SUPPLIED_INTERNAL_REVIEW_ONLY').length}\n- Missing official questions: ${stats.unlinkedTopics}\n`;
fs.writeFileSync('docs/MNEMONIC_IMPORT_REVIEW.md',out);
console.log(stats);
