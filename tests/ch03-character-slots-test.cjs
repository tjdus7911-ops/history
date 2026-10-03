const fs=require('fs'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const data=['data','ch02-data','ch03-data','exam-data','ch01-expansion','chapter-split','late-goryeo','official-late-exams'].map(x=>fs.readFileSync(`dist/${x}.js`,'utf8')).join('\n'),app=fs.readFileSync('dist/app.js','utf8');
let html='',saved=null,context,handler;
function boot(){context=vm.createContext({Date,navigator:{},window:{scrollTo(){}},document:{querySelector:s=>s==='#app'?{set innerHTML(v){html=v}}:null,querySelectorAll:()=>[],addEventListener:(event,fn)=>{if(event==='click')handler=fn},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},setTimeout:()=>1,clearTimeout(){}});vm.runInContext(data+'\n'+app,context)}
const evaluate=code=>vm.runInContext(code,context);
const click=dataset=>{evaluate('inputLockedUntil=0');handler({target:{closest:()=>({dataset,disabled:false})}})};
boot();
const scenes=evaluate('Object.values(STORIES).filter(s=>s.chapterId==="ch03"&&!s.quizOnly)'),fixture=JSON.parse(fs.readFileSync('tests/fixtures/ch03-stage-protected.json','utf8'));
const hash=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
for(const scene of scenes){const content=JSON.parse(JSON.stringify(scene));for(const key of fixture.ignoredPresentationAndLearningFields)delete content[key];for(const line of content.dialogues||[])delete line.presentation;assert.equal(hash(content),fixture.scenes[scene.sceneId],`story/choice/quiz preservation: ${scene.sceneId}`)}
for(const[path,digest]of Object.entries(fixture.images))assert.equal(crypto.createHash('sha256').update(fs.readFileSync('dist/'+path)).digest('hex'),digest,`existing image unchanged: ${path}`);
const portraits=()=>[...html.matchAll(/<img class="stage-character ([^"]+)"[^>]*data-character-id="([^"]+)"[^>]*data-position="([^"]+)"[^>]*src="([^"]+)"/g)].map(m=>({classes:m[1],id:m[2],position:m[3],src:m[4]}));
let checked=0;const repaired=new Set();
function check(line,expectedPartner,scene){const cast=portraits();if((['thought','narration'].includes(line.speakerType)||['description','history','result'].includes(line.presentation)||scene.characterStageMode==='hidden')||scene.sceneEffect==='blackout'||!expectedPartner){assert.equal(cast.length,0,scene.sceneId);return}
  const allowed=new Set(['player','doyun','hyunwoo']);
  assert(cast.every(c=>allowed.has(c.id)),scene.sceneId+': only the approved cast');
  if(!allowed.has(expectedPartner)){assert.equal(cast.length,0);return}
  assert.equal(cast.length,2,scene.sceneId);
  const player=cast.find(c=>c.id==='player');
  if(player){assert.equal(player.position,'right');const partner=cast.find(c=>c.id!=='player');assert.equal(partner.position,'left');assert.equal(partner.id,expectedPartner)}
  else {assert.equal(cast.find(c=>c.id==='doyun').position,'left');assert.equal(cast.find(c=>c.id==='hyunwoo').position,'right')}
  assert.equal(cast.filter(c=>c.classes.split(' ').includes('active')).length,1);
  assert(cast.find(c=>c.id===line.characterId).classes.split(' ').includes('active'));
  for(const listener of cast.filter(c=>c.id!==line.characterId))assert(listener.classes.split(' ').includes('listening'));
  for(const c of cast)assert(fs.existsSync('dist/'+c.src),c.src);
  repaired.add(scene.sceneId);checked++;
}
for(const scene of scenes){
  evaluate(`state=INITIAL();state.run.currentChapter='ch03';state.run.started=true;state.run.storyId=${JSON.stringify(scene.sceneId)};screen='game';enterStory()`);
  let lastPartner=null;
  for(let i=0;i<scene.dialogues.length;i++){
    const line=scene.dialogues[i];if(line.speakerType==='npc')lastPartner=line.characterId;
    const expected=lastPartner||scene.dialogues.find(l=>l.speakerType==='npc')?.characterId;
    evaluate(`run().dialogueCursor=${i+1};render()`);check(line,expected,scene);
  }
  for(let choiceIndex=0;choiceIndex<(scene.choices||[]).length;choiceIndex++){
    evaluate(`state=INITIAL();state.run.currentChapter='ch03';state.run.started=true;state.run.storyId=${JSON.stringify(scene.sceneId)};screen='game';enterStory();applyChoice(state,run().storyId,${choiceIndex})`);
    const lines=evaluate('conversationEntries(STORIES[run().pending.sourceSceneId],run().pending)');let resultPartner=null;
    for(let i=0;i<lines.length;i++){
      if(lines[i].speakerType==='npc')resultPartner=lines[i].characterId;
      const expected=resultPartner||lines.find(l=>l.speakerType==='npc')?.characterId||[...scene.dialogues].reverse().find(l=>l.speakerType==='npc')?.characterId;
      evaluate(`run().dialogueCursor=${i+1};render()`);check(lines[i],expected,scene);
      if(i===0){evaluate('save()');const before=JSON.parse(saved);boot();click({action:'play'});check(lines[i],expected,scene);assert.deepEqual(JSON.parse(saved).run.stats,before.run.stats)}
    }
  }
}
// The reported result must keep Doyun while the player speaks, and vice versa.
evaluate("state=INITIAL();state.run.currentChapter='ch03';state.run.started=true;state.run.storyId='ch02_trust';screen='game';enterStory();applyChoice(state,'ch02_trust',0);render()");
assert(html.includes('알겠어. 같이 도와주자.'));assert.equal(portraits().find(c=>c.id==='doyun').position,'left');
click({action:'advance-dialogue'});assert(html.includes('고맙소. 허나 무작정 뛰어들지는 마시오.'));assert(portraits().find(c=>c.id==='doyun').classes.includes('active'));
// Scene cast declarations may include several NPCs; slots must still be two.
evaluate("state=INITIAL();state.run.currentChapter='ch03';state.run.storyId='ch02_three_way';screen='game';enterStory();run().dialogueCursor=1;render()");assert.deepEqual(portraits().map(c=>c.id),['doyun','hyunwoo']);assert(portraits().find(c=>c.id==='hyunwoo').classes.includes('active'));
evaluate('run().dialogueCursor=2;render()');assert.equal(portraits()[0].id,'doyun');
evaluate('run().dialogueCursor=3;render()');assert.deepEqual(portraits().map(c=>c.id),['doyun','hyunwoo']);assert(portraits().find(c=>c.id==='hyunwoo').classes.includes('active'));
// The official's ruling is a description, then a genuine reply restores slots.
evaluate("state=INITIAL();state.run.currentChapter='ch03';state.run.started=true;state.run.storyId='ch02_policy_reason';screen='game';enterStory();render()");
assert.equal(portraits().length,0);assert(html.includes('이 자는 본래 양인이었음이 확인되었다. 양인으로 돌아간다.'));assert(html.includes('narration-line'));
click({action:'advance-dialogue'});assert.equal(portraits().length,0);assert(html.includes('narration-line'));
evaluate('run().dialogueCursor=6;render()');assert.equal(portraits().length,0);
click({choice:'0'});assert.equal(portraits().length,2);click({action:'advance-dialogue'});assert.equal(portraits().length,0);click({action:'result-next'});assert.equal(portraits().length,0);
click({action:'advance-dialogue'});click({action:'next'});assert.equal(evaluate('screen'),'quiz');assert.equal(portraits().length,0);
console.log(`PASS: ${scenes.length} CH.03 scenes, ${checked} spoken frames/choice results, dialogue slots, hidden description/history layers, active/listening emphasis, reload, unchanged content and ${Object.keys(fixture.images).length} images. Repaired dialogue scenes: ${[...repaired].join(', ')}`);
