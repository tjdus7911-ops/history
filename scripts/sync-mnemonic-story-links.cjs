/* Keep generated mnemonic metadata in sync when a newly implemented story starts
 * using an already-linked canonical officialQuestionId. Source mnemonic text and
 * publication/review state are never changed here.
 */
const fs=require('node:fs');
const runtime=require('./mnemonic-runtime.cjs')();
const inventoryPath='dist/mnemonic-inventory.json';
const data=JSON.parse(fs.readFileSync(inventoryPath,'utf8'));
const runtimeById=new Map(runtime.cards.map(card=>[card.id,card]));
let changed=0;
for(const card of data.cards){
 const linked=runtimeById.get(card.id)?.relatedSceneIds||[];
 if(JSON.stringify(card.relatedSceneIds)!==JSON.stringify(linked)){card.relatedSceneIds=[...linked];changed++;}
}
fs.writeFileSync(inventoryPath,JSON.stringify(data,null,2)+'\n');
fs.writeFileSync('dist/mnemonic-data.js','/* Generated from docs/mnemonic-sources/explicit-request.json. */\n'+`globalThis.MNEMONIC_INVENTORY=${JSON.stringify(data.cards)};\nglobalThis.MNEMONIC_IMPORT_BASELINE=globalThis.MNEMONIC_INVENTORY;\nglobalThis.MNEMONIC_IMPORT_CARDS=globalThis.MNEMONIC_INVENTORY;\nglobalThis.MNEMONIC_IMPORT_CANDIDATES=globalThis.MNEMONIC_INVENTORY.filter(card=>card.publicationStatus!=='PUBLISHED');\n`);
console.log(JSON.stringify({cards:data.cards.length,updatedStoryLinks:changed}));
