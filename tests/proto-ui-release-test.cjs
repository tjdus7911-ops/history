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

assert(/\.proto-revision-quiz \.quiz-submit-row\s*\{grid-template-columns:minmax\(0,1fr\)/.test(protoCss),'answer confirmation row is not full width');
assert(/\.proto-revision-quiz \.confirm-answer\s*\{[^}]*min-height:54px[^}]*width:100%/.test(protoCss),'answer confirmation button size is not normalized');
assert(/\.proto-scene-recap\s*\{[^}]*background:linear-gradient/.test(protoCss)&&/\.proto-scene-recap\s*\{[^}]*border-left:4px solid #c99a4d/.test(protoCss),'learning summary card did not receive the integrated dark treatment');
assert(ui.includes('LEARNING SUMMARY')&&ui.includes('proto-recap-heading'),'learning summary card structure is incomplete');

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

console.log('PASS: direct choices, Goryeo portrait composition, redesigned learning summary and full-width answer confirmation.');
