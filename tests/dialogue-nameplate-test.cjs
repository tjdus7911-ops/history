const assert=require('node:assert/strict');
const {load}=require('./proto-revision-harness.cjs');
const h=load();

const rows=h.copy(`(()=>{
 const rows=[];
 const add=(source,entries,phase)=>{for(const entry of entries||[])if(['player','npc','thought'].includes(entry?.speakerType)){
  const asset=PORTRAITS[resolvedPortraitId(entry)];rows.push({
   sceneId:source.sceneId,chapterId:source.chapterId,eraId:source.eraId||'goryeo',phase,
   speakerType:entry.speakerType,characterId:entry.characterId,characterName:entry.characterName,escapedCharacterName:esc(entry.characterName),
   dialogue:entry.dialogue,escapedDialogue:esc(entry.dialogue),avatarExpected:Boolean(asset?.src&&!asset.sprite),html:dialogueBubble(entry,0)
  })}};
 for(const source of Object.values(STORIES)){
  add(source,source.dialogues,'main');add(source,source.protoCommon,'join');add(source,source.threeCommon,'join');
  for(const choice of source.choices||[])add(source,choice.resultDialogues,'choice');
 }
 return rows;
})()`);

assert(rows.length>3000,'complete story dialogue corpus must be checked');
const counts={goryeo:0,joseon:0,'proto-kingdoms':0,'three-kingdoms':0},avatarCounts={goryeo:0,joseon:0,'proto-kingdoms':0,'three-kingdoms':0},playerNames=new Set();
for(const row of rows){
 const count=(row.html.match(/class="character-name"/g)||[]).length;
 const avatarCount=(row.html.match(/class="dialogue-avatar"/g)||[]).length;
 const textPreservingMarkup=row.html.replace(/<strong class="proto-keyword">([\s\S]*?)<\/strong>/g,'$1');
 assert(textPreservingMarkup.includes(row.escapedDialogue),`${row.sceneId}/${row.phase}: dialogue text changed`);
 if(row.speakerType==='player'){
  assert(row.html.includes('class="message-row player'),`${row.sceneId}/${row.phase}: player side changed`);
  assert(row.html.includes('<div class="bubble-stack"><p class="speech-bubble">'),`${row.sceneId}/${row.phase}: empty nameplate gap remains`);
  assert.equal(count,0,`${row.sceneId}/${row.phase}: player nameplate remains`);
  assert.equal(avatarCount,row.avatarExpected?1:0,`${row.sceneId}/${row.phase}: player avatar fallback changed`);
  if(row.avatarExpected){assert(row.html.indexOf('bubble-stack')<row.html.indexOf('dialogue-avatar'),`${row.sceneId}/${row.phase}: player avatar is not on the right`);avatarCounts[row.eraId]++;}
  playerNames.add(row.characterName);counts[row.eraId]++;
 }else if(row.speakerType==='npc'){
  assert(row.html.includes('class="message-row npc'),`${row.sceneId}/${row.phase}: NPC side changed`);
  assert.equal(count,1,`${row.sceneId}/${row.phase}: NPC nameplate missing`);
  assert(row.html.includes(`<span class="character-name">${row.escapedCharacterName}</span>`),`${row.sceneId}/${row.phase}: NPC name changed`);
  assert.equal(avatarCount,row.avatarExpected?1:0,`${row.sceneId}/${row.phase}: NPC avatar fallback changed`);
  if(row.avatarExpected)assert(row.html.indexOf('dialogue-avatar')<row.html.indexOf('bubble-stack'),`${row.sceneId}/${row.phase}: NPC avatar is not on the left`);
 }else{
  assert(row.html.includes('class="narration-line"'),`${row.sceneId}/${row.phase}: thought presentation changed`);
  assert.equal(count,0,`${row.sceneId}/${row.phase}: protagonist thought nameplate remains`);
  assert.equal(avatarCount,0,`${row.sceneId}/${row.phase}: thought unexpectedly received an avatar`);
 }
}
for(const [eraId,count] of Object.entries(counts))assert(count>0,`${eraId}: no protagonist dialogue audited`);
for(const [eraId,count] of Object.entries(avatarCounts))assert(count>0,`${eraId}: no protagonist avatar audited`);
for(const name of ['나','주인공','서아'])assert(playerNames.has(name),`${name}: protagonist label data must remain present`);

const identities=h.copy(`Object.fromEntries(['player','joseon_player','proto_modern','three_modern','three_player','three_v3_seoa'].map(id=>[id,CHARACTERS[id]&&{characterId:CHARACTERS[id].characterId,characterName:CHARACTERS[id].characterName,speakerType:CHARACTERS[id].speakerType}]))`);
assert.deepEqual(identities,{
 player:{characterId:'player',characterName:'나',speakerType:'player'},
 joseon_player:{characterId:'joseon_player',characterName:'나',speakerType:'player'},
 proto_modern:{characterId:'proto_modern',characterName:'주인공',speakerType:'player'},
 three_modern:{characterId:'three_modern',characterName:'나',speakerType:'player'},
 three_player:{characterId:'three_player',characterName:'나',speakerType:'player'},
 three_v3_seoa:{characterId:'three_v3_seoa',characterName:'서아',speakerType:'player'}
});

console.log(`PASS: ${rows.length} story dialogue records; ${Object.values(counts).reduce((sum,count)=>sum+count,0)} protagonist bubbles across Goryeo/Joseon/Proto/Three omit nameplates, NPC labels and protagonist identity data remain intact.`);
