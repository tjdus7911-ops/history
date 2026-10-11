'use strict';
// Preview controls run against the actual entry and isolated in-memory storage.
// Each scenario is reloaded into a fresh VM with its persisted v3 records.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {load}=require('./proto-revision-harness.cjs');
const code=fs.readFileSync('tests/browser-review/fixtures.js','utf8');
function environment(h,name){
 Object.assign(h.context,{URLSearchParams,location:{search:'?case='+name,origin:'https://review.invalid'},innerWidth:390,innerHeight:844,parent:{postMessage(){}},MutationObserver:class{observe(){}}});
 h.context.window.addEventListener=()=>{};h.context.document.documentElement={scrollWidth:390};
}
const position='({scene:run().storyId,cursor:run().dialogueCursor,dialogueSceneId:run().dialogueSceneId,pending:run().pending,phase:PROTO_REVISION_ACTIONS.phaseState(),book:meta().protoRevisionBook})';
for(const [name,scene,kind] of [['proto-player','proto_ch00_s1','player'],['proto-npc','proto_ch00_s2','npc'],['proto-choice','proto_ch00_s2','choice'],['proto-choice-quiz','proto_ch02_s3','choice']]){
 let h=load({unrelated:'retain'},{typing:true});environment(h,name);h.run(code);
 assert.equal(h.run('screen'),'game',name);assert.equal(h.run('run().storyId'),scene);
 const source=h.copy('PROTO_REVISION_ACTIONS.currentSource()');
 const expected=kind==='choice'?source.dialogues.length:Math.max(1,source.dialogues.findIndex(line=>line.speakerType===kind)+1);
 assert.equal(h.run('run().dialogueCursor'),expected,name+' authored cursor');
 assert.equal(h.run('PROTO_REVISION_ACTIONS.phaseState().phase'),kind==='choice'?'choice':'main');
 assert(h.run('PROTO_SAVE_V3.validRun(run())'),name+' valid run');
 assert(h.run('PROTO_SAVE_V3.validBook(meta().protoRevisionBook)'),name+' valid read book');
 assert(h.run('PROTO_SAVE_V3.validResume({run:run(),mainRun:null},meta().protoRevisionBook)'),name+' valid continuation');
 const before=h.copy(position),storage=Object.fromEntries(h.storage);
 assert(storage['lived-history-proto-kingdoms-v3'],name+' independent save');
 h=load(storage,{typing:true});environment(h,name);h.run(code);
 assert.deepEqual(h.copy(position),before,name+' exact fresh-VM continuation');
 assert.equal(h.storage.get('unrelated'),'retain');
 if(name==='proto-choice-quiz'){
  for(let guard=0;h.run('screen')!=='quiz';guard++){
   assert(guard<200,'Proto choice/quiz fixture reaches an actual question');
   assert.equal(h.run('screen'),'game');
   if(h.run('PROTO_REVISION_ACTIONS.phaseState().phase')==='choice')h.click({choice:'0'});
   else h.click({action:'advance-dialogue'});
  }
  assert(h.run('PROTO_SAVE_V3.validResume({run:run(),mainRun:null},meta().protoRevisionBook)'),'question has valid learning proof');
  console.log(name+' => '+scene+' / choice / '+expected+' -> quiz '+h.run('run().activeQuestionId'));
 }else console.log(name+' => '+scene+' / '+(kind==='choice'?'choice':'main')+' / '+expected);
}
console.log('PASS four Proto QA fixtures: correct main/choice start, all required read/choice evidence, valid v3 saves, exact fresh-VM resume, unrelated storage preservation and actual first quiz.');

