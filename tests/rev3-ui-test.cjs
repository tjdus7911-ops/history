const fs=require('node:fs'),assert=require('node:assert/strict');
const manifest=JSON.parse(fs.readFileSync('config/figma-rev3-ui.json','utf8'));
const html=fs.readFileSync('dist/index.html','utf8'),css=fs.readFileSync('dist/rev3.css','utf8'),ui=fs.readFileSync('dist/rev3-ui.js','utf8');
assert.equal(manifest.revision,3);assert.equal(manifest.screens.length,32);assert.equal(new Set(manifest.screens.map(s=>s.nodeId)).size,32);assert.equal(manifest.componentFamilies.length,22);
assert.equal(manifest.font,'Malgun Gothic');assert.deepEqual(manifest.palette,{primary:'#2D5BE3',accent:'#F2A516',error:'#E5484D',canvas:'#FFFFFF'});
assert(html.lastIndexOf('rev3.css')>html.lastIndexOf('proto-revision.css'));assert(html.indexOf('rev3-ui.js')>html.indexOf('chapter-access-ui.js'));assert(html.indexOf('rev3-ui.js')<html.indexOf('pwa.js'));
assert(!ui.includes('https://www.figma.com/api/mcp/asset/'),'temporary Figma URLs cannot ship');
for(const a of manifest.assets){const file='dist/'+a.path;assert(fs.existsSync(file),file);assert(fs.statSync(file).size>0,file);if(file.endsWith('.svg')){const svg=fs.readFileSync(file,'utf8');assert(/<svg\b/.test(svg));assert(/\bwidth="[^"\n]+"/.test(svg)&&/\bheight="[^"\n]+"/.test(svg),'original SVG dimensions missing '+file);}}
for(const token of ['--r3-primary:#2d5be3','--r3-accent:#f2a516','--r3-error:#e5484d','--ed-paper:#fff'])assert(css.includes(token),token);
const game=require('./proto-revision-harness.cjs').load();assert.equal(game.run('REV3_UI.version'),3);
const protectedRun=game.run('JSON.stringify({run:state.run,mainRun:state.mainRun})');
for(const view of ['loading','network'])game.run('REV3_UI.states.'+view+'()');game.run('REV3_UI.states.clear()');
assert.equal(game.run('JSON.stringify({run:state.run,mainRun:state.mainRun})'),protectedRun,'view states changed story data');
assert.equal(game.run("REV3_UI.eraEntries('prehistory').length+REV3_UI.eraEntries('kingdoms').length"),game.run("OFFICIAL_ENTRIES_FOR_ERA('ancient','심화').length"),'ancient presentation subsets must partition the unchanged primary era');
game.run("selectedEra='goryeo';screen='era';openChapterCard('ch01')");assert(game.html().includes('r3-chapter-station')&&game.html().includes('data-action="start-chapter"'),'chapter sheet must preserve its original start action');
game.run("modal=null;screen='home';render()");assert(game.html().includes('data-nav="association"'),'mnemonic entry removed');
const data=game.run('JSON.stringify(meta().questionRecords)');game.run("REV3_UI.views.analysis()");assert.equal(game.run('JSON.stringify(meta().questionRecords)'),data,'analysis view mutated records');
console.log('PASS: all 32 Rev.3 screens/22 components indexed, local original assets, CSS/script authority, palette/font, chapter action and read-only presentation state.');
