const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert');
const crypto=require('node:crypto');
const script=JSON.parse(fs.readFileSync('dist/three-story-script.json','utf8'));
assert.equal(script.chapters.length,30);assert.equal(script.chapters.flatMap(ch=>ch.scenes).length,90);
const scenes=script.chapters.flatMap(ch=>ch.scenes),choices=scenes.flatMap(s=>s.choices);
assert.equal(choices.length,270);assert.equal(new Set(choices.map(choice=>choice.label)).size,270);
assert.equal(new Set(choices.map(choice=>choice.reaction)).size,270);
assert.equal(new Set(scenes.map(scene=>scene.dialogues[1].text)).size,90);
assert(scenes.every(scene=>scene.common.length&&scene.choices.every(choice=>choice.dialogues.length>=2)));
const art=JSON.parse(fs.readFileSync('dist/three-art-manifest.json','utf8'));
assert.equal(art.protagonist.files.length,11);
for(const file of art.protagonist.files){
  assert(file.src.startsWith('assets/ancient/three-v2/'));
  const hash=path=>crypto.createHash('sha256').update(fs.readFileSync('dist/'+path)).digest('hex');
  assert.equal(hash(file.src),hash(file.source),'Independent heroine copy must preserve the approved source artwork');
}
const sourceHtml=fs.readFileSync('tests/fixtures/pre-three-service-index.html','utf8'),previewHtml=fs.readFileSync('dist/three-preview.html','utf8'),serviceHtml=fs.readFileSync('dist/index.html','utf8');
assert(!sourceHtml.includes('three-story-data.js'));assert(!previewHtml.includes('src="pwa.js"'));
assert(fs.readFileSync('dist/three-preview-app.js','utf8').includes("KEY='lived-history-three-development-v2'"));
function load(mode,saved=null){
  const preview=mode===true,service=mode==='service';
  let html='';const handlers=[];
  const primaryKey=preview?'lived-history-three-development-v2':'lived-history-v1';
  const storage=new Map(typeof saved==='string'?[[primaryKey,saved]]:Object.entries(saved||{}));
  const context=vm.createContext({Date,console,document:{querySelector:s=>s==='#app'?{set innerHTML(value){html=value}}:null,querySelectorAll:()=>[],
    addEventListener:(type,handler,capture)=>{if(type==='click')handlers.push({handler,capture})},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},
    localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>1,clearInterval(){}});
  const htmlSource=service?serviceHtml:preview?previewHtml:sourceHtml;
  if(preview)vm.runInContext('globalThis.THREE_ENABLE_DEVELOPMENT_PREVIEW=true',context);
  const files=[...htmlSource.matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]).filter(file=>file!=='pwa.js');
  vm.runInContext(files.map(file=>fs.readFileSync('dist/'+file,'utf8')).join('\n'),context);
  const run=source=>vm.runInContext(source,context),copy=source=>JSON.parse(run('JSON.stringify('+source+')'));
  return{run,copy,handlers,saved:()=>storage.get(primaryKey),storage:()=>Object.fromEntries(storage),html:()=>html};
}
assert(serviceHtml.includes('three-content-config.js')&&serviceHtml.includes('three-service-ui.js')&&serviceHtml.includes('src="app.js"'));
assert(!serviceHtml.includes('three-preview-app.js'));
const baseline=load(false),preview=load('service');
assert.equal(preview.run('THREE_SERVICE_ENTRY_READY'),true);
assert.equal(preview.run('THREE_CONTENT_STATUS.all().length'),90);
assert.equal(preview.run('THREE_CONTENT_STATUS.all().filter(s=>s.complete).length'),0);
assert.equal(preview.run('THREE_CONTENT_STATUS.all().filter(s=>s.expanded).length'),6);
preview.run("selectedEra='three-kingdoms';screen='eras';render()");
assert(preview.html().includes('제작 중'));
assert(preview.html().includes('완성 0'));

for(const collection of ['CHAPTERS','STORIES','QUESTIONS']){
  const filter=collection==='QUESTIONS'?"q=>!q.chapterId?.startsWith('three-')":"q=>q.eraId!=='three-kingdoms'";
  assert.deepEqual(preview.copy(`Object.values(${collection}).filter(${filter})`),baseline.copy(`Object.values(${collection}).filter(${filter})`),`Protected ${collection}`);
}
assert.equal(preview.run("eraChapters('three-kingdoms').length"),30);
assert.equal(preview.run("Object.values(STORIES).filter(s=>s.threeStoryVersion===2).length"),90);
assert.equal(preview.run("historySeasonProgressKey('three-kingdoms')"),'three-kingdoms-v2');
assert.equal(preview.run("eraProtagonist('three-kingdoms').id"),'three_v2_seoa');
assert.equal(preview.run("eraProtagonist('three-kingdoms').gender"),'female');
for(const id of ['goryeo','proto-kingdoms','joseon'])assert.deepEqual(preview.copy(`eraProtagonist(${JSON.stringify(id)})`),baseline.copy(`eraProtagonist(${JSON.stringify(id)})`));
assert.equal(preview.run("eraQuestions('three-kingdoms').length"),13);
assert(preview.run("eraQuestions('three-kingdoms').every(q=>q.threeStoryVersion===2)"));
for(const id of ['goryeo','proto-kingdoms','joseon'])assert.deepEqual(preview.copy(`eraQuestions(${JSON.stringify(id)})`),baseline.copy(`eraQuestions(${JSON.stringify(id)})`));
assert.equal(preview.run("historySeasonProgressKey('proto-kingdoms')"),baseline.run("historySeasonProgressKey('proto-kingdoms')"));
for(const chapter of script.chapters){
  const id=chapter.scenes[0].chapterId,previous=preview.run(`previousChapterId(${JSON.stringify(id)})`);
  assert.equal(previous,chapter.number===1?null:`three-v2-ch${String(chapter.number-1).padStart(2,'0')}`,'Three chapter prerequisites must never reference another era');
}
for(const name of ['CHARACTERS','PORTRAITS','ASSETS']){
  for(const [id,value] of Object.entries(baseline.copy(name))){
    assert.deepEqual(preview.copy(`${name}[${JSON.stringify(id)}]`),value,`Existing ${name}.${id} must remain intact`);
  }
}
// Visit each era through the real era resume function, then return in reverse order.
const boundary=load('service'),expected=new Map();
const eraIds=['goryeo','proto-kingdoms','joseon','three-kingdoms'];
assert(boundary.run('home()').includes('data-era-slide="proto-kingdoms"'));
assert(boundary.run('home()').includes('data-era-slide="three-kingdoms"'));
for(const [index,id] of eraIds.entries()){
  boundary.run(`resumeEra(${JSON.stringify(id)});run().started=true;run().dialogueCursor=2;run().flags.isolationProbe=${JSON.stringify(id)};run().stats.wealth=${100+index};
    (()=>{const q=eraQuestions(${JSON.stringify(id)})[0];if(q){recordQuestion(state,q.questionId,q.answer);run().questionAnswer=null;}})();save()`);
  assert.equal(boundary.run('chapterEra(run().currentChapter)'),id);
  if(id==='three-kingdoms'){
    assert.equal(boundary.run('run().protagonistId'),'three_v2_seoa');
    assert(!boundary.run("Object.hasOwn(run().characterStates,'doyun')||Object.hasOwn(run().characterStates,'hyunwoo')"));
    assert(boundary.run("Object.keys(run().questionResults).every(id=>id.startsWith('three_v2_'))"));
  }
  assert(boundary.copy('STORIES[run().storyId].dialogues').filter(line=>line.speakerType==='player').every(line=>id==='three-kingdoms'?line.characterId==='three_v2_seoa':!line.characterId.startsWith('three_v2')));
  expected.set(id,boundary.copy('({chapter:run().currentChapter,scene:run().storyId,cursor:run().dialogueCursor,flags:run().flags,stats:run().stats,answers:run().questionResults})'));
}
for(const id of [...eraIds].reverse()){
  boundary.run(`resumeEra(${JSON.stringify(id)});save()`);
  assert.deepEqual(boundary.copy('({chapter:run().currentChapter,scene:run().storyId,cursor:run().dialogueCursor,flags:run().flags,stats:run().stats,answers:run().questionResults})'),expected.get(id),`${id} resume must keep its own progress`);
}
const protectedSaved=Object.fromEntries(eraIds.filter(id=>id!=='three-kingdoms').map(id=>[id,boundary.copy(`meta().eraProgress[historySeasonProgressKey(${JSON.stringify(id)})]`)]));
const separate=JSON.parse(boundary.storage()['lived-history-three-kingdoms-v2']);
assert.equal(separate.eraId,'three-kingdoms');assert(separate.progress.resume.run.currentChapter.startsWith('three-v2-'));
assert(Object.keys(separate.meta.questionRecords).every(id=>id.startsWith('three_v2_')));
assert(Object.hasOwn(boundary.storage(),'lived-history-v1'),'Official entry must save through the main shell');assert(!Object.hasOwn(boundary.storage(),'lived-history-three-development-v2'));
boundary.run("resumeEra('three-kingdoms');meta().eraProgress['three-kingdoms']={legacySentinel:'keep-old-three-record'};meta().completedChapters.push('ch01');save()");
const namespaceReload=load('service',boundary.storage());
assert.equal(namespaceReload.run('run().playerOutfit'),'three_traveler','A completed Goryeo chapter must not change the Three heroine outfit on reload');
assert(!namespaceReload.run("run().inventory.some(item=>item.id==='goryeo-commoner-clothes')"));
assert(!namespaceReload.run("run().sharedEvents.includes('met_doyun_ch01')"));
assert.deepEqual(namespaceReload.copy("meta().eraProgress['three-kingdoms']"),{legacySentinel:'keep-old-three-record'},'Startup must install the v2 key before any progress is remembered');
namespaceReload.run('finishChapter(state);save()');
assert.deepEqual(namespaceReload.copy("meta().eraProgress['three-kingdoms']"),{legacySentinel:'keep-old-three-record'},'Completing a v2 chapter must not write the old progress bucket');
assert(namespaceReload.run("meta().eraProgress['three-kingdoms-v2'].progress>0"));
// Reject an old-version/foreign-era resume without altering other era records.
boundary.run("meta().eraProgress['three-kingdoms-v2']={resume:{run:INITIAL_RUN('ch01'),mainRun:null}};resumeEra('three-kingdoms')");
assert.equal(boundary.run('chapterEra(run().currentChapter)'),'three-kingdoms');
for(const [id,record] of Object.entries(protectedSaved)){
  const actual=boundary.copy(`meta().eraProgress[historySeasonProgressKey(${JSON.stringify(id)})]`);
  delete actual.updatedAt;delete record.updatedAt; // Leaving the active era legitimately refreshes its timestamp.
  assert.deepEqual(actual,record,`${id} record preserved during three-only recovery`);
}
// Recover Three independently even when the aggregate preview save is unavailable.
const recovered=load('service',{'lived-history-three-kingdoms-v2':JSON.stringify(separate)});
recovered.run("resumeEra('three-kingdoms')");
assert.equal(recovered.run('run().flags.isolationProbe'),'three-kingdoms');
assert.equal(recovered.run('run().stats.wealth'),103);
assert.equal(preview.run("QUESTIONS.filter(q=>q.threeStoryVersion===2).length"),13);
for(const q of preview.copy('QUESTIONS.filter(q=>q.threeStoryVersion===2)')){
  assert.equal(q.relatedIllustrationId,`${q.relatedSceneId}_background`,'Quiz must use its own scene background');
  assert.equal(q.historicalEventId,`${q.relatedSceneId}_history`);
  assert.equal(q.relatedHistoricalEventId,q.historicalEventId);
  assert(q.conceptIds.every(id=>id.startsWith('three-v2:')));
  assert.equal(q.difficulty,'심화');
}
assert(preview.copy("sceneAssetUrls('three_v2_ch01_s1')").includes('assets/ancient/three-v2/backgrounds/goguryeo-hungry-village-spring.webp'));
assert(preview.copy("sceneAssetUrls('three_v2_ch01_s1')").includes('assets/ancient/three-v2/characters/gogukcheon-neutral.webp'));
preview.run("state.run=INITIAL_RUN('three-v2-ch01');screen='game';enterStory();run().dialogueCursor=4;render()");
assert(preview.html().includes('goguryeo-hungry-village-spring.webp'));assert(preview.html().includes('gogukcheon-neutral.webp'));
// A common passage must resume at the saved line rather than the intro or next scene.
preview.run("THREE_PREVIEW_ACTIONS.switchPhase(STORIES[run().storyId],'common');run().dialogueCursor=3;save()");
const commonReload=load('service',preview.saved());
commonReload.run("screen='game';enterStory();render()");
assert.equal(commonReload.run('run().dialogueCursor'),3);
assert.equal(commonReload.run("THREE_PREVIEW_ACTIONS.phaseState(STORIES[run().storyId]).phase"),'common');
assert(commonReload.html().includes(script.chapters[0].scenes[0].common[2].text));
// Exercise the capture handler that guards real choice clicks.
const clicks=load('service');clicks.run("state.run=INITIAL_RUN('three-v2-ch01');screen='game';enterStory()");
const guard=clicks.handlers.filter(item=>item.capture).at(-1).handler;
let stopped=false;
const event={target:{closest:()=>({disabled:false,dataset:{choice:'1'}})},stopImmediatePropagation(){stopped=true},preventDefault(){}};
guard(event);assert(stopped,'Choice click during intro must be blocked');
clicks.run("THREE_PREVIEW_ACTIONS.switchPhase(STORIES[run().storyId],'choice');inputLockedUntil=0");
stopped=false;guard(event);assert(!stopped);
assert.equal(clicks.run("THREE_PREVIEW_ACTIONS.phaseState(STORIES[run().storyId]).phase"),'result');
assert.equal(clicks.run("THREE_PREVIEW_ACTIONS.phaseState(STORIES[run().storyId]).choiceIndex"),1);
// Test-only queue fixtures exercise both checkpoints without adding unreviewed topic assignments.
const queues=load('service');
queues.run(`state.run=INITIAL_RUN('three-v2-ch01');screen='game';enterStory();
  QUESTIONS.push(...QUESTIONS.filter(q=>q.threeStoryVersion===2).slice(0,2).map((q,i)=>({...q,questionId:'test-only-checkpoint-'+i,chapterId:'three-v2-ch01',relatedSceneId:'three_v2_ch01_s1'})));
  THREE_PREVIEW_ACTIONS.checkpoint(STORIES[run().storyId],'mid')`);
assert.equal(queues.run('screen'),'quiz');
assert.equal(queues.run('run().questionQueue.length'),1);
assert.equal(queues.run('activeQuestion().questionId'),'test-only-checkpoint-0');
queues.run('recordQuestion(state,activeQuestion().questionId,activeQuestion().answer);continueStoryQuestion()');
assert.equal(queues.run("THREE_PREVIEW_ACTIONS.phaseState(STORIES[run().storyId]).phase"),'choice');
queues.run("THREE_PREVIEW_ACTIONS.switchPhase(STORIES[run().storyId],'common');THREE_PREVIEW_ACTIONS.checkpoint(STORIES[run().storyId],'end')");
assert.equal(queues.run('activeQuestion().questionId'),'test-only-checkpoint-1');
queues.run('recordQuestion(state,activeQuestion().questionId,(activeQuestion().answer+1)%5);continueStoryQuestion()');
assert.equal(queues.run('run().storyId'),'three_v2_ch01_s2');
for(const selected of [0,1,2]){
  const game=load('service');let totalScenes=0,totalQuestions=0;
  for(let chapterNumber=1;chapterNumber<=30;chapterNumber++){
    const chapterId=`three-v2-ch${String(chapterNumber).padStart(2,'0')}`;
    game.run(`state.run=INITIAL_RUN(${JSON.stringify(chapterId)});screen='game';enterStory()`);
    for(let sceneNumber=1;sceneNumber<=3;sceneNumber++){
      totalScenes++;
      const sourceId=game.run('run().storyId');
      assert.equal(sourceId,`three_v2_ch${String(chapterNumber).padStart(2,'0')}_s${sceneNumber}`);
      game.run("THREE_PREVIEW_ACTIONS.checkpoint(STORIES[run().storyId],'mid')");
      assert.equal(game.run("THREE_PREVIEW_ACTIONS.phaseState(STORIES[run().storyId]).phase"),'choice');
      const reaction=script.chapters[chapterNumber-1].scenes[sceneNumber-1].choices[selected].reaction;
      game.run(`applyChoice(state,run().storyId,${selected});run().dialogueCursor=run().pending.resultDialogues.findIndex(line=>line.dialogue===${JSON.stringify(reaction)})+1;save();render()`);
      assert.equal(game.run(`run().flags.threeChoice_${chapterNumber}_${sceneNumber}`),selected);
      assert(game.html().includes(reaction));
      // Reload a pending branch exactly as a browser would after save.
      if(chapterNumber===1&&sceneNumber===1){const restored=load('service',game.saved());assert.deepEqual(restored.copy('run().pending'),game.copy('run().pending'));}
      game.run(`(()=>{const s=STORIES[run().pending.sourceSceneId];run().pending=null;THREE_PREVIEW_ACTIONS.switchPhase(s,'common')})()`);
      assert.equal(game.run('run().storyId'),sourceId,'Common dialogue must stay in the chosen scene before end quiz');
      assert.equal(game.run('conversationEntries(STORIES[run().storyId],null).length'),script.chapters[chapterNumber-1].scenes[sceneNumber-1].common.length);
      game.run("THREE_PREVIEW_ACTIONS.checkpoint(STORIES[run().storyId],'end')");
      if(game.run('screen')==='quiz'){
        totalQuestions++;
        const q=game.copy('activeQuestion()');
        const answer=selected===1?(q.answer+1)%5:q.answer;
        game.run(`recordQuestion(state,${JSON.stringify(q.questionId)},${answer});save()`);
        if(totalQuestions===1){const savedQuiz=load('service',game.saved());assert.deepEqual(savedQuiz.copy('run().threeCheckpoint'),game.copy('run().threeCheckpoint'));assert.equal(savedQuiz.run('run().questionAnswer'),answer);}
        game.run('continueStoryQuestion()');
      }
      if(sceneNumber<3)assert.equal(game.run('screen'),'game');
    }
    assert.equal(game.run('screen'),'complete');
  }
  assert.equal(totalScenes,90);assert.equal(totalQuestions,13);
}
console.log('PASS official service entry (content incomplete): 30 chapters / 90 scene transitions / 270 distinct branches; four-era switching and independent save recovery; pending-branch/common-dialogue/quiz save round trips; 13 verified-question placements; original characters, portraits, assets and protected eras unchanged. Artwork, full exam coverage and browser QA remain pending.');
