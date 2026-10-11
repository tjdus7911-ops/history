/* UI changes must preserve the released Three content and other eras. */
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const baseline=JSON.parse(fs.readFileSync('tests/fixtures/three-ui-preservation.json'));
const sha256=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
for(const [path,item] of Object.entries(baseline))if(path.startsWith('dist/'))assert.equal(sha256(fs.readFileSync(path)),item.sha256,'protected content changed: '+path);
for(const [path,sha] of Object.entries(baseline.shared_ui))assert.equal(sha256(fs.readFileSync(path)),sha,'approved common UI changed: '+path);
for(const [path,source] of Object.entries(baseline.three_exam_images))assert.equal(sha256(fs.readFileSync('dist/'+path)),typeof source==='string'?source:source.sha256,'official image changed: '+path);
for(const [path,sha] of Object.entries(baseline.original_asset_blobs)){
 const bytes=fs.readFileSync(path),hash=crypto.createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
 assert.equal(hash,sha,'original asset changed: '+path);
}
const manuscript=JSON.parse(fs.readFileSync('dist/three-story-script.json'));
const exams=JSON.parse(fs.readFileSync('dist/three-exam-data.json'));
const scenes=[...manuscript.prologue.scenes,...manuscript.chapters.flatMap(chapter=>chapter.scenes)];
const lines=scenes.flatMap(scene=>[...scene.main,...scene.choices.flatMap(choice=>[choice.spokenLine,...choice.reply]),...scene.join]);
assert.equal(manuscript.chapters.length,23);assert.equal(scenes.length,218);assert.equal(lines.length,2777);
assert.equal(scenes.reduce((count,scene)=>count+scene.choices.length,0),142);assert.equal(exams.questions.length,91);
assert.equal(new Set(scenes.map(scene=>scene.sceneId)).size,218);assert.equal(new Set(lines.map(line=>line.lineId)).size,2777);
console.log('PASS Three UI preservation: exact content/image hashes; 23 chapters, 218 scenes, 2,777 line IDs, 142 spoken choices, 91 official questions; '+Object.keys(baseline.original_asset_blobs).length+' original assets and '+Object.keys(baseline.shared_ui).length+' approved shared UI files unchanged.');
