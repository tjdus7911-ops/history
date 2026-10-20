const assert=require('node:assert/strict'),fs=require('node:fs');
const {load}=require('./proto-revision-harness.cjs');

const ui=fs.readFileSync('dist/proto-story-ui.js','utf8');
const protoCss=fs.readFileSync('dist/proto-revision.css','utf8');
const sharedCss=fs.readFileSync('dist/dialogue.css','utf8');

assert(!ui.includes("'응답 고르기'"),'legacy response-button label remains in the Proto renderer');
assert(ui.includes("choiceReady||['choice','branch'].includes(current.phase)?source.choices:null"),'choices are not rendered with the last main dialogue');
assert(ui.includes("current.phase==='main')readCurrent(source)"),'choosing directly from the final main dialogue does not mark that dialogue read');

assert(!/\.proto-revision-game \.character-stage\s*\{/.test(protoCss),'Proto still overrides the shared Goryeo portrait stage');
assert(!/\.proto-revision-game \.stage-character\s*\{/.test(protoCss),'Proto still overrides the shared Goryeo portrait sizing');
assert(/\.character-stage\{[^}]*inset:92px 0 128px/.test(sharedCss),'shared desktop portrait stage contract changed');
assert(/\.stage-character\{[^}]*height:min\(68vh,610px\)/.test(sharedCss),'shared portrait size contract changed');
assert(/@media\(max-width:760px\)[\s\S]*\.character-stage\{inset:86px 0 116px\}[\s\S]*\.stage-character\{bottom:0;height:min\(61vh,515px\)/.test(sharedCss),'shared mobile portrait composition changed');

const portraitNames=['player','naru','sibling','worker','elder','merchant','girl','woman','priest'];
const portraitHashes=[];
for(const name of portraitNames){
  const relative=`media/proto-v4/${name}-v3.png`,file=`dist/${relative}`,png=fs.readFileSync(file);
  assert(fs.statSync(file).size>2_000_000,`${name} portrait is not the production-quality source asset`);
  assert.equal(png.toString('ascii',1,4),'PNG',`${name} portrait is not PNG`);
  assert.equal(png.readUInt32BE(16),1024,`${name} portrait width`);
  assert.equal(png.readUInt32BE(20),1536,`${name} portrait height`);
  assert.equal(png[25],6,`${name} portrait must retain RGBA transparency`);
  assert(fs.readFileSync('dist/proto-story-data.js','utf8').includes(`${name}-v3.png`),`${name} v3 portrait is not wired to Proto`);
  portraitHashes.push(require('node:crypto').createHash('sha256').update(png).digest('hex'));
}
assert.equal(new Set(portraitHashes).size,portraitNames.length,'Proto characters reuse the same portrait art');
const protoData=fs.readFileSync('dist/proto-story-data.js','utf8');
assert(/const PROTO_CHARACTER_LAYOUT=Object\.freeze\(\{tier:'MAIN',scale:1\.18,anchorX:0,anchorY:6,framing:'upper-body',lockStateScale:true\}\)/.test(protoData),'Proto portraits do not share one enlarged, face-safe Goryeo-aligned render profile');
assert(/facing:id==='proto_modern'\?'left':'right'/.test(protoData),'Proto conversation-facing contract is missing');

assert(/\.proto-revision-quiz \.quiz-submit-row\s*\{grid-template-columns:minmax\(0,1fr\)/.test(protoCss),'answer confirmation row is not full width');
assert(/\.proto-revision-quiz \.confirm-answer\s*\{[^}]*min-height:54px[^}]*width:100%/.test(protoCss),'answer confirmation button size is not normalized');
assert(/\.proto-scene-recap\s*\{[^}]*background:linear-gradient/.test(protoCss)&&/\.proto-scene-recap\s*\{[^}]*border-left:4px solid #c99a4d/.test(protoCss),'learning summary card did not receive the integrated dark treatment');
assert(ui.includes('LEARNING SUMMARY')&&ui.includes('proto-recap-heading'),'learning summary card structure is incomplete');
assert(ui.includes("proto-revision-game proto-recap-ready ")&&/\.proto-recap-ready \.dialogue-log\s*\{display:none/.test(protoCss),'completed-scene dialogue history can still cover portrait faces');

const game=load();game.run("resumeEra('proto-kingdoms')");
const stageCharacters=()=>[...game.html().matchAll(/<img class="stage-character[^>]*data-character-id="([^"]+)"/g)].map(match=>match[1]);
assert.equal(game.run('run().storyId'),'proto_prologue_museum');
assert(game.html().includes('data-illustration="proto-v4-modern-museum"'),'the first rendered screen must use the museum illustration');
assert(game.html().includes('PROLOGUE · SCENE 01/04'),'the museum scene is not labelled as the prologue');
assert(!game.html().includes('proto-scene-recap'),'history learning recap leaked into the museum prologue');
assert.deepEqual(stageCharacters(),['proto_sibling','proto_modern'],'the protagonist and sibling must begin together in the museum');
game.run("run().storyId='proto_prologue_separation';run().dialogueSceneId='proto_prologue_separation';run().dialogueCursor=1;run().protoStoryState.scenes.proto_prologue_separation={phase:'main',choiceIndex:null};screen='game';render()");
assert.deepEqual(stageCharacters(),['proto_modern'],'the sibling must no longer be on stage after the separation');
game.run("run().storyId='proto_prologue_timeslip';run().dialogueSceneId='proto_prologue_timeslip';run().dialogueCursor=1;run().protoStoryState.scenes.proto_prologue_timeslip={phase:'main',choiceIndex:null};render()");
assert.deepEqual(stageCharacters(),[],'the blackout time-slip should not display a portrait');
game.run("run().storyId='proto_prologue_buyeo_field';run().dialogueSceneId='proto_prologue_buyeo_field';run().dialogueCursor=1;run().protoStoryState.scenes.proto_prologue_buyeo_field={phase:'main',choiceIndex:null};render()");
assert(game.html().includes('data-illustration="proto-v4-buyeo-village"'),'the first historical backdrop must be the Buyeo winter field');
assert.deepEqual(stageCharacters(),['proto_modern'],'the protagonist must wake alone in the field');
game.run('run().dialogueCursor=5;render()');
assert.deepEqual(stageCharacters(),['proto_naru','proto_modern'],'Naru must enter only on the first NPC dialogue');
assert.equal(game.run('CHARACTER_RENDER_PROFILES.characters.proto_modern.scale'),1.18);
assert(Object.keys(game.copy('PROTO_NAMES')).every(id=>game.run(`CHARACTER_RENDER_PROFILES.characters[${JSON.stringify(id)}].scale`)===1.18),'every Proto protagonist and NPC must use the same scale');
game.run("state.run=PROTO_SAVE_V3.freshRun(true);screen='game';enterStory();render()");
let guard=0,enteredMain=false;
while(!(game.run("PROTO_REVISION_ACTIONS.phaseState().phase==='main'&&run().dialogueCursor>=PROTO_REVISION_ACTIONS.phaseEntries().length&&PROTO_REVISION_ACTIONS.currentSource().choices?.length"))){
  game.click({action:'advance-dialogue'});if(game.run("run().storyId==='proto_ch01_s1'")&&!enteredMain){assert.equal(game.run('run().dialogueCursor'),10,'the prologue did not hand off at the first historical CH.01 line');enteredMain=true;}assert(++guard<80,'first Proto choice did not become ready');
}
assert(enteredMain,'the prologue never reached Buyeo CH.01');
const choiceHtml=game.html();
assert(!choiceHtml.includes('응답 고르기'),'legacy response button rendered at the first choice boundary');
assert.equal((choiceHtml.match(/data-choice=/g)||[]).length,2,'both authored choices were not rendered immediately');
game.click({choice:'0'});
assert.equal(game.run('PROTO_REVISION_ACTIONS.phaseState().phase'),'branch');
assert.equal(game.run('PROTO_REVISION_ACTIONS.book().choiceBySceneId[run().storyId]'),0);

console.log('PASS: direct choices, nine distinct transparent high-resolution portraits, Goryeo-aligned character composition, redesigned learning summary and full-width answer confirmation.');
