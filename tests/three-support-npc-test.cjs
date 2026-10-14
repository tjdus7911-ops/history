const assert = require('node:assert/strict');
const {load} = require('./proto-revision-harness.cjs');

const game = load();
const result = game.copy(`(()=>{
  const rows=[], failures=[];
  for(const source of Object.values(STORIES).filter(item=>item.threeStoryVersion===3)) {
    state.run=INITIAL_RUN(source.isPrologue?'THR-C01':source.chapterId);
    THREE_SAVE_V3.identifyRun(run(),true);
    run().storyId=source.sceneId;
    const cases=[
      {phase:'main',entries:source.dialogues},
      {phase:'join',entries:source.threeCommon,choiceIndex:source.choices?.length?0:null},
      ...(source.choices||[]).map((choice,index)=>({phase:'branch',entries:choice.resultDialogues,choiceIndex:index}))
    ];
    for(const item of cases) {
      Object.assign(THREE_COMPLETE_ACTIONS.phaseState(source),{phase:item.phase,choiceIndex:item.choiceIndex??null});
      for(let index=0;index<item.entries.length;index++) {
        const line=item.entries[index];
        if(line.speakerType!=='npc') continue;
        run().dialogueCursor=index+1;
        const html=characterStage(item.entries.slice(0,index+1),source,false,null,source.illustrationId,item.entries,index+1);
        const renderedNonSeoa=/data-character-id="(?!three_v3_seoa)[^"]+"/.test(html);
        rows.push({sceneId:source.sceneId,lineId:line.lineId,name:line.characterName,renderedNonSeoa});
        if(renderedNonSeoa) failures.push({sceneId:source.sceneId,lineId:line.lineId,name:line.characterName});
      }
    }
  }
  return {npcUtterances:rows.length,failures};
})()`);

assert(result.npcUtterances > 0, 'Archived script dialogue remains available as rewrite reference');
assert.deepEqual(result.failures, []);
assert.equal(game.run('THREE_STORY_RUNTIME.people.size'), 0);
console.log(`PASS: ${result.npcUtterances} archived NPC lines retain text without re-registering or rendering retired characters.`);
