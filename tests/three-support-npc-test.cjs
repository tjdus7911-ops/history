const fs=require('node:fs'),assert=require('node:assert/strict'),{load}=require('./proto-revision-harness.cjs');
const g=load();
const result=g.copy(`(()=>{
 const rows=[],failures=[],skipped=[];
 for(const source of Object.values(STORIES).filter(s=>s.threeStoryVersion===3)){
  state.run=INITIAL_RUN(source.isPrologue?'THR-C01':source.chapterId);THREE_SAVE_V3.identifyRun(run(),true);run().storyId=source.sceneId;
  const cases=[{phase:'main',entries:source.dialogues},{phase:'join',entries:source.threeCommon,choiceIndex:source.choices?.length?0:null},...(source.choices||[]).map((c,i)=>({phase:'branch',entries:c.resultDialogues,choiceIndex:i}))];
  for(const c of cases){Object.assign(THREE_COMPLETE_ACTIONS.phaseState(source),{phase:c.phase,choiceIndex:c.choiceIndex??null});
   for(let i=0;i<c.entries.length;i++){
    const line=c.entries[i];run().dialogueCursor=i+1;
    const context=THREE_STAGING.context(source,{phase:c.phase,entry:line,choiceId:source.choices?.[c.choiceIndex]?.choiceId});
    const html=characterStage(c.entries.slice(0,i+1),source,false,null,source.illustrationId,c.entries,i+1);
    if(context==='record'){if(html)failures.push({sceneId:source.sceneId,lineId:line.lineId,reason:'record-must-not-show-stage'});skipped.push(line.lineId);continue;}
    if(line.speakerType!=='npc')continue;
    const mapped=THREE_STORY_RUNTIME.people.get?.(line.characterId)||null;
    const expected='data-character-id="'+line.characterId+'"';
    const ok=html.includes(expected)&&html.includes('stage-left active');
    const row={sceneId:source.sceneId,lineId:line.lineId,name:line.characterName,characterId:line.characterId,rendered:ok};rows.push(row);if(!ok)failures.push({...row,reason:'active-NPC-not-left-or-missing'});
   }
  }
 }
 return {npcUtterances:rows.length,recordLines:skipped.length,failures,rows};
})()`);
const original=JSON.parse(fs.readFileSync('docs/three-content/support-npc-before.json','utf8'));
result.repaired=original.map(item=>({sceneId:item.scene,characterId:item.id,name:item.speaker,cause:'unregistered supporting portrait; characterFor show:false',matchingChecks:result.rows.filter(row=>row.characterId===item.id&&row.sceneId===item.scene).length})).filter((r,i,a)=>a.findIndex(v=>v.sceneId===r.sceneId&&v.characterId===r.characterId)===i);
fs.writeFileSync('docs/three-content/support-npc-audit.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({npcUtterances:result.npcUtterances,recordLines:result.recordLines,failures:result.failures.length,examples:result.failures.slice(0,10)}));assert.equal(result.failures.length,0);
