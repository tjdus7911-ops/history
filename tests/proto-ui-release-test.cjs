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
  const relative=`media/proto-v4/${name}-v2.png`,file=`dist/${relative}`,png=fs.readFileSync(file);
  assert(fs.statSync(file).size>2_000_000,`${name} portrait is not the production-quality source asset`);
  assert.equal(png.toString('ascii',1,4),'PNG',`${name} portrait is not PNG`);
  assert.equal(png.readUInt32BE(16),1024,`${name} portrait width`);
  assert.equal(png.readUInt32BE(20),1536,`${name} portrait height`);
  assert.equal(png[25],6,`${name} portrait must retain RGBA transparency`);
  assert(fs.readFileSync('dist/proto-story-data.js','utf8').includes(`${name}-v2.png`),`${name} v2 portrait is not wired to Proto`);
  portraitHashes.push(require('node:crypto').createHash('sha256').update(png).digest('hex'));
}
assert.equal(new Set(portraitHashes).size,portraitNames.length,'Proto characters reuse the same portrait art');
const protoData=fs.readFileSync('dist/proto-story-data.js','utf8');
assert(/scale:1\.06,anchorX:0,anchorY:6,framing:'upper-body',lockStateScale:true/.test(protoData),'Proto portraits do not share the enlarged, face-safe Goryeo-aligned render profile');

assert(/\.proto-revision-quiz \.quiz-submit-row\s*\{grid-template-columns:minmax\(0,1fr\)/.test(protoCss),'answer confirmation row is not full width');
assert(/\.proto-revision-quiz \.confirm-answer\s*\{[^}]*min-height:54px[^}]*width:100%/.test(protoCss),'answer confirmation button size is not normalized');
assert(/\.proto-scene-recap\s*\{[^}]*background:linear-gradient/.test(protoCss)&&/\.proto-scene-recap\s*\{[^}]*border-left:4px solid #c99a4d/.test(protoCss),'learning summary card did not receive the integrated dark treatment');
assert(ui.includes('LEARNING SUMMARY')&&ui.includes('proto-recap-heading'),'learning summary card structure is incomplete');
assert(ui.includes("proto-revision-game proto-recap-ready ")&&/\.proto-recap-ready \.dialogue-log\s*\{display:none/.test(protoCss),'completed-scene dialogue history can still cover portrait faces');

const game=load();game.run("resumeEra('proto-kingdoms')");
let guard=0;
while(!(game.run("PROTO_REVISION_ACTIONS.phaseState().phase==='main'&&run().dialogueCursor>=PROTO_REVISION_ACTIONS.phaseEntries().length&&PROTO_REVISION_ACTIONS.currentSource().choices.length"))){
  game.click({action:'advance-dialogue'});assert(++guard<80,'first Proto choice did not become ready');
}
const choiceHtml=game.html();
assert(!choiceHtml.includes('응답 고르기'),'legacy response button rendered at the first choice boundary');
assert.equal((choiceHtml.match(/data-choice=/g)||[]).length,2,'both authored choices were not rendered immediately');
game.click({choice:'0'});
assert.equal(game.run('PROTO_REVISION_ACTIONS.phaseState().phase'),'branch');
assert.equal(game.run('PROTO_REVISION_ACTIONS.book().choiceBySceneId[run().storyId]'),0);

console.log('PASS: direct choices, nine distinct transparent high-resolution portraits, Goryeo-aligned character composition, redesigned learning summary and full-width answer confirmation.');
