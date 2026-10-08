const fs=require('fs'),runtime=require('./mnemonic-runtime.cjs')();
const data=JSON.parse(fs.readFileSync('dist/mnemonic-inventory.json','utf8'));
data.cards=runtime.cards;
const cards=data.cards,statuses=cards.reduce((out,card)=>(out[card.status]=(out[card.status]||0)+1,out),{});
const published=cards.filter(card=>card.publicationStatus==='PUBLISHED');
const officialIds=new Set(cards.flatMap(card=>card.relatedOfficialQuestionIds));
const sceneIds=new Set(cards.flatMap(card=>card.relatedSceneIds));
const source=JSON.parse(fs.readFileSync('docs/mnemonic-sources/explicit-request.json','utf8'));
const exact=cards.every(card=>card.sourceMnemonic===source.records.find(record=>record.id===card.sourceId)?.sourceMnemonic);
const protectedSamples=['복덕(방) 경희(가) 운(다)','광노(안)과 공복 주제(에) 송광풍 여사~','(2개의) 흥수똥 달제양','효심(에는) 이의있삼?','병(이)제 병문한 정양 오신 초덕광 척','원(산에서) 동경(까지) 배(타고) 26(km)','UWOI'];
const samplesPreserved=protectedSamples.every(value=>cards.some(card=>card.sourceMnemonic===value));
const stats={
 explicitInput:118,additionalSourceRecords:0,total:cards.length,statuses,
 productionPublished:published.length,excluded:cards.length-published.length,duplicate:cards.length-new Set(cards.map(card=>card.sourceId)).size,
 facts:cards.reduce((sum,card)=>sum+card.facts.length,0),mnemonicTopicsLinked:cards.filter(card=>card.relatedOfficialQuestionIds.length).length,
 officialLinks:cards.reduce((sum,card)=>sum+card.relatedOfficialQuestionIds.length,0),uniqueOfficialQuestions:officialIds.size,
 unlinkedTopics:cards.filter(card=>!card.relatedOfficialQuestionIds.length).length,sceneLinks:cards.reduce((sum,card)=>sum+card.relatedSceneIds.length,0),uniqueScenes:sceneIds.size,
 sourcePreservation:{exact,protectedSamples:samplesPreserved,parentheses:exact,numbers:exact,english:cards.some(card=>card.sourceMnemonic==='UWOI')}
};
fs.writeFileSync('dist/mnemonic-inventory.json',JSON.stringify(data,null,2)+'\n');
fs.writeFileSync('dist/mnemonic-data.js','/* Generated from docs/mnemonic-sources/explicit-request.json. */\n'+`globalThis.MNEMONIC_INVENTORY=${JSON.stringify(cards)};\nglobalThis.MNEMONIC_IMPORT_BASELINE=globalThis.MNEMONIC_INVENTORY;\nglobalThis.MNEMONIC_IMPORT_CARDS=globalThis.MNEMONIC_INVENTORY;\nglobalThis.MNEMONIC_IMPORT_CANDIDATES=globalThis.MNEMONIC_INVENTORY.filter(card=>card.publicationStatus!=='PUBLISHED');\n`);
require('../tests/mnemonic-data-test.cjs')(data,runtime);
fs.writeFileSync('docs/mnemonic-sources/import-stats.json',JSON.stringify(stats,null,2)+'\n');

const cell=value=>String(value??'').replace(/\|/g,'\\|').replace(/\r?\n/g,'<br>');
const eraCounts={
 '통합/선사':cards.filter(card=>card.era==='ancient').length,
 '삼국/남북국':cards.filter(card=>card.sourceId.startsWith('B')).length,
 '고려':cards.filter(card=>card.era==='goryeo').length,
 '조선':cards.filter(card=>card.era==='joseon').length,
 '개항기/대한제국':cards.filter(card=>card.era==='empire').length,
 '일제강점기':cards.filter(card=>card.era==='occupation').length,
 '현대':cards.filter(card=>card.era==='republic').length
};
let out='# MNEMONIC IMPORT REVIEW\n\n## Summary\n\n';
out+=`- Explicit input records: **118**\n- Additional records discovered: **0**\n- Total inventory: **${cards.length}**\n- VERIFIED: **${statuses.VERIFIED||0}**\n- REVIEW_REQUIRED: **${statuses.REVIEW_REQUIRED||0}**\n- CANDIDATE: **${statuses.CANDIDATE||0}**\n- Production published: **${published.length}**\n- Excluded: **${cards.length-published.length}**\n- Duplicate: **${stats.duplicate}**\n\n`;
out+='`sourceMnemonic`은 사용자 입력을 그대로 보존합니다. 공개 화면은 별도로 작성한 `mnemonic`이 있고 역사 검수가 끝난 `VERIFIED + PUBLISHED` 레코드만 사용합니다.\n\n';
out+='## Era counts\n\n|분류|개수|\n|---|---:|\n'+Object.entries(eraCounts).map(([label,count])=>`|${label}|${count}|`).join('\n')+'\n\n';
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
out+=`- Duplicate: ${stats.duplicate}\n- Copyright review: ${cards.filter(card=>card.rightsStatus==='USER_SUPPLIED_INTERNAL_REVIEW_ONLY').length}\n- Missing official questions: ${stats.unlinkedTopics}\n`;
fs.writeFileSync('docs/MNEMONIC_IMPORT_REVIEW.md',out);
console.log(stats);
