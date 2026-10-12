const assert=require('node:assert/strict');
const {load}=require('./proto-revision-harness.cjs');
const h=load();

const rows=h.copy(`(()=>{
 const rows=[];
 const add=(source,entries,phase)=>{for(const entry of entries||[])if(['player','npc','thought'].includes(entry?.speakerType))rows.push({
  sceneId:source.sceneId,chapterId:source.chapterId,eraId:source.eraId||'goryeo',phase,
  speakerType:entry.speakerType,characterId:entry.characterId,characterName:entry.characterName,escapedCharacterName:esc(entry.characterName),
  dialogue:entry.dialogue,escapedDialogue:esc(entry.dialogue),html:dialogueBubble(entry,0)
 })};
 for(const source of Object.values(STORIES)){
  add(source,source.dialogues,'main');add(source,source.protoCommon,'join');add(source,source.threeCommon,'join');
  for(const choice of source.choices||[])add(source,choice.resultDialogues,'choice');
 }
 return rows;
})()`);

assert(rows.length>3000,'complete story dialogue corpus must be checked');
const counts={goryeo:0,joseon:0,'proto-kingdoms':0,'three-kingdoms':0},playerNames=new Set();
for(const row of rows){
 const count=(row.html.match(/class="character-name"/g)||[]).length;
 assert(row.html.includes(row.escapedDialogue),`${row.sceneId}/${row.phase}: dialogue text changed`);
 if(row.speakerType==='player'){
  assert(row.html.includes('class="message-row player"'),`${row.sceneId}/${row.phase}: player side changed`);
  assert(row.html.includes('<div class="bubble-stack"><p class="speech-bubble">'),`${row.sceneId}/${row.phase}: empty nameplate gap remains`);
  assert.equal(count,0,`${row.sceneId}/${row.phase}: player nameplate remains`);
  playerNames.add(row.characterName);counts[row.eraId]++;
 }else if(row.speakerType==='npc'){
  assert(row.html.includes('class="message-row npc"'),`${row.sceneId}/${row.phase}: NPC side changed`);
  assert.equal(count,1,`${row.sceneId}/${row.phase}: NPC nameplate missing`);
  assert(row.html.includes(`<span class="character-name">${row.escapedCharacterName}</span>`),`${row.sceneId}/${row.phase}: NPC name changed`);
 }else{
  assert(row.html.includes('class="narration-line"'),`${row.sceneId}/${row.phase}: thought presentation changed`);
  assert.equal(count,0,`${row.sceneId}/${row.phase}: protagonist thought nameplate remains`);
 }
}
for(const [eraId,count] of Object.entries(counts))assert(count>0,`${eraId}: no protagonist dialogue audited`);
for(const name of ['나','주인공','서아'])assert(playerNames.has(name),`${name}: protagonist label data must remain present`);

const identities=h.copy(`Object.fromEntries(['player','joseon_player','proto_modern','proto_player','three_modern','three_player','three_v3_seoa'].map(id=>[id,CHARACTERS[id]&&{characterId:CHARACTERS[id].characterId,characterName:CHARACTERS[id].characterName,speakerType:CHARACTERS[id].speakerType}]))`);
assert.deepEqual(identities,{
 player:{characterId:'player',characterName:'나',speakerType:'player'},
 joseon_player:{characterId:'joseon_player',characterName:'나',speakerType:'player'},
 proto_modern:{characterId:'proto_modern',characterName:'주인공',speakerType:'player'},
 proto_player:{characterId:'proto_player',characterName:'나',speakerType:'player'},
 three_modern:{characterId:'three_modern',characterName:'나',speakerType:'player'},
 three_player:{characterId:'three_player',characterName:'나',speakerType:'player'},
 three_v3_seoa:{characterId:'three_v3_seoa',characterName:'서아',speakerType:'player'}
});

console.log(`PASS: ${rows.length} story dialogue records; ${Object.values(counts).reduce((sum,count)=>sum+count,0)} protagonist bubbles across Goryeo/Joseon/Proto/Three omit nameplates, NPC labels and protagonist identity data remain intact.`);
