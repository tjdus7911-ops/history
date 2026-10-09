/* Proto-only visual wiring. Story text, expression cues, choices and saves stay intact. */
const PROTO_CHARACTER_ART={
 proto_modern:{neutral:'assets/ancient/characters/proto-player-modern.png',smile:'assets/ancient/characters/proto-consistent-player-smile.png',surprised:'assets/ancient/characters/proto-consistent-player-surprised.png'},
 proto_guide:{neutral:'assets/ancient/characters/proto-consistent-dan-neutral.png',smile:'assets/ancient/characters/proto-consistent-dan-smile.png',surprised:'assets/ancient/characters/proto-consistent-dan-surprised.png'}
};
for(const [id,art] of Object.entries(PROTO_CHARACTER_ART)){
 for(const expression of ANCIENT_EXPRESSIONS){
  const portrait=PORTRAITS[`${id}_${expression}`];
  if(portrait)portrait.src=art[expression]||art.neutral;
 }
}
CHARACTERS.proto_modern.characterName='주인공';
for(const source of Object.values(STORIES)){
 if(source.eraId!=='proto-kingdoms')continue;
 const lines=[...(source.dialogues||[]),...(source.choices||[]).flatMap(c=>c.resultDialogues||[])];
 for(const line of lines)if(line.characterId==='proto_modern'&&line.characterName==='나')line.characterName='주인공';
}
