const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),childProcess=require('node:child_process');
const deploymentAssets=require('../scripts/prepare-vercel-output.cjs');
const repoRoot=path.resolve(__dirname,'..');
function resolvePython(){
  const configured=process.env.PYTHON?.trim();
  const candidates=configured?[[configured,[]]]:(process.platform==='win32'?[['python',[]],['py',['-3']]]:[['python3',[]],['python',[]]]);
  for(const [command,prefix] of candidates){
    const probe=childProcess.spawnSync(command,[...prefix,'--version'],{stdio:'ignore'});
    if(!probe.error&&probe.status===0)return {command,prefix};
  }
  throw new Error('Python 3 is required. Set PYTHON to a Python 3 executable.');
}
const python=resolvePython();
const runPython=(script,...args)=>childProcess.execFileSync(python.command,[...python.prefix,'scripts/'+script,...args],{stdio:'pipe'});
const runPythonTest=(script,...args)=>childProcess.execFileSync(python.command,[...python.prefix,'tests/'+script,...args],{stdio:'pipe'});
const hasLocalAssetSources=fs.existsSync(path.join(repoRoot,'dist','assets'));
const deploymentContract=deploymentAssets.validateDeploymentContract(repoRoot);
runPython('import-three-complete-manuscript.py','--check');
runPython('import-proto-revision.py','--check');
if(hasLocalAssetSources){
  for(const script of ['import-proto-revision.py','import-three-complete-exams.py','build-three-complete-art.py'])runPython(script,'--check');
}
runPython('build-official-exam-statistics.py','--check');
runPythonTest('official-explanation-builder-unit-test.py');
runPython('polish-official-choice-prose.py','--check');
if(hasLocalAssetSources)require('node:child_process').execFileSync(process.execPath,['scripts/build-story-exam-policy.cjs','--check'],{stdio:'pipe'});
require('node:child_process').execFileSync(process.execPath,['scripts/build-ox-quiz-curation.cjs','--check'],{stdio:'pipe'});
require('./mnemonic-data-test.cjs')(JSON.parse(fs.readFileSync('dist/mnemonic-inventory.json','utf8')),require('../scripts/mnemonic-runtime.cjs')());
const required=['dist/index.html','dist/editorial.css','dist/editorial-ui.js','dist/era-visuals.js','dist/joseon-data.js','dist/season-data.js','dist/joseon-ui.js','dist/official-exam-catalog.js','dist/official-exam-catalog.json','dist/official-exam-explanations.js','dist/official-exam-explanations.json','dist/official-exam-statistics.js','dist/official-exam-statistics.json','dist/official-exam-inventory.json','dist/exam-memory-ui.js','dist/exam-memory.css','dist/exam-memory-results.css','dist/exam-memory-nav.css','dist/ox-quiz-curation.js','dist/ox-quiz-data.js','dist/ox-quiz-ui.js','dist/ox-quiz.css','dist/style.css','dist/renewal.css','dist/v2-learning.js','dist/v2-app.js','dist/v2-exam-restoration.js','dist/v2-exam-additions.js','dist/v2-art.js','dist/v2-backgrounds.js','dist/v2.css','dist/dialogue.css','dist/pwa.css','dist/data.js','dist/ch02-data.js','dist/ch03-data.js','dist/exam-data.js','dist/ch01-expansion.js','dist/chapter-split.js','dist/late-goryeo.js','dist/official-late-exams.js','dist/official-exam-images.js','dist/ch05-refinement.js','dist/ch06-backgrounds.js','dist/ch06-quiz-refinement.js','dist/app.js','dist/pwa.js','dist/sw.js','dist/manifest.webmanifest','dist/goryeo.png','dist/seoul-night.png','dist/icons/icon-192.png','dist/icons/icon-512.png','dist/icons/icon-maskable-512.png','dist/icons/apple-touch-icon.png','vercel.json'];
for(const file of required)assert(fs.existsSync(file),`missing build asset: ${file}`);
const html=fs.readFileSync('dist/index.html','utf8');
for(const name of ['three-story-script','three-exam-data','three-complete-art','three-story-data','three-story-ui','three-save-data','three-era-isolation','three-service-ui','three-learning-boundary']){assert(html.includes(name+'.js'),'missing Three entry '+name);new vm.Script(fs.readFileSync('dist/'+name+'.js','utf8'),{filename:name});}
for(const name of ['proto-story-script','proto-story-data','proto-save-data','proto-story-ui']){assert(html.includes(name+'.js'),'missing Proto entry '+name);new vm.Script(fs.readFileSync('dist/'+name+'.js','utf8'),{filename:name});}
assert(html.includes('proto-revision.css'));assert(fs.existsSync('dist/proto-revision.css'));
const protoData=JSON.parse(fs.readFileSync('dist/proto-story-script.json','utf8'));assert.equal(protoData.chapters.flatMap(c=>c.scenes).length,17);assert.equal(protoData.learning.length,85);assert.equal(protoData.examPlan.questions.length,26);
const threeData=JSON.parse(fs.readFileSync('dist/three-story-script.json','utf8'));assert.equal(threeData.playableSceneCount,218);assert.equal(threeData.authoredUtteranceCount,2777);

for(const ref of ['manifest.webmanifest','style.css','v2.css','dialogue.css','pwa.css','data.js','ch02-data.js','ch03-data.js','exam-data.js','ch01-expansion.js','chapter-split.js','late-goryeo.js','official-late-exams.js','official-exam-images.js','joseon-data.js','season-data.js','official-exam-catalog.js','official-exam-explanations.js','official-exam-statistics.js','ox-quiz-curation.js','ox-quiz-data.js','ox-quiz-ui.js','ox-quiz.css','editorial-ui.js','joseon-ui.js','exam-memory-ui.js','exam-memory.css','exam-memory-results.css','exam-memory-nav.css','app.js','pwa.js','apple-touch-icon.png'])assert(html.includes(ref),`index.html does not reference ${ref}`);
for(const meta of ['viewport-fit=cover','apple-mobile-web-app-capable','apple-mobile-web-app-status-bar-style','mobile-web-app-capable'])assert(html.includes(meta),`index.html is missing ${meta}`);
new vm.Script(fs.readFileSync('dist/data.js','utf8'),{filename:'dist/data.js'});
new vm.Script(fs.readFileSync('dist/ch02-data.js','utf8'),{filename:'dist/ch02-data.js'});
new vm.Script(fs.readFileSync('dist/ch03-data.js','utf8'),{filename:'dist/ch03-data.js'});
new vm.Script(fs.readFileSync('dist/exam-data.js','utf8'),{filename:'dist/exam-data.js'});
new vm.Script(fs.readFileSync('dist/ch01-expansion.js','utf8')+'\n'+fs.readFileSync('dist/chapter-split.js','utf8'),{filename:'dist/ch01-expansion.js'});
new vm.Script(fs.readFileSync('dist/late-goryeo.js','utf8'),{filename:'dist/late-goryeo.js'});
new vm.Script(fs.readFileSync('dist/official-exam-images.js','utf8'),{filename:'dist/official-exam-images.js'});
new vm.Script(fs.readFileSync('dist/ch05-refinement.js','utf8'),{filename:'dist/ch05-refinement.js'});
new vm.Script(fs.readFileSync('dist/joseon-data.js','utf8'),{filename:'dist/joseon-data.js'});
new vm.Script(fs.readFileSync('dist/season-data.js','utf8'),{filename:'dist/season-data.js'});
new vm.Script(fs.readFileSync('dist/joseon-ui.js','utf8'),{filename:'dist/joseon-ui.js'});
new vm.Script(fs.readFileSync('dist/official-exam-catalog.js','utf8'),{filename:'dist/official-exam-catalog.js'});
new vm.Script(fs.readFileSync('dist/official-exam-explanations.js','utf8'),{filename:'dist/official-exam-explanations.js'});
new vm.Script(fs.readFileSync('dist/official-exam-statistics.js','utf8'),{filename:'dist/official-exam-statistics.js'});
new vm.Script(fs.readFileSync('dist/ox-quiz-curation.js','utf8'),{filename:'dist/ox-quiz-curation.js'});
new vm.Script(fs.readFileSync('dist/ox-quiz-data.js','utf8'),{filename:'dist/ox-quiz-data.js'});
new vm.Script(fs.readFileSync('dist/exam-memory-ui.js','utf8'),{filename:'dist/exam-memory-ui.js'});
new vm.Script(fs.readFileSync('dist/ox-quiz-ui.js','utf8'),{filename:'dist/ox-quiz-ui.js'});
new vm.Script(fs.readFileSync('dist/app.js','utf8'),{filename:'dist/app.js'});
new vm.Script(fs.readFileSync('dist/pwa.js','utf8'),{filename:'dist/pwa.js'});
new vm.Script(fs.readFileSync('dist/sw.js','utf8'),{filename:'dist/sw.js'});
const manifest=JSON.parse(fs.readFileSync('dist/manifest.webmanifest','utf8'));
assert.equal(manifest.name,'눈떠보니 한국사');assert.equal(manifest.short_name,'눈떠보니 한국사');assert.equal(manifest.start_url,'/');assert.equal(manifest.scope,'/');assert.equal(manifest.display,'standalone');assert.equal(manifest.orientation,'portrait');assert.equal(manifest.lang,'ko-KR');
const iconBySize=new Map(manifest.icons.map(icon=>[icon.sizes,icon]));assert(iconBySize.has('192x192'));assert(iconBySize.has('512x512'));assert(manifest.icons.some(icon=>icon.purpose==='maskable'));
function pngSize(file){const buffer=fs.readFileSync(file);assert.equal(buffer.subarray(1,4).toString(),'PNG',`${file} is not PNG`);return [buffer.readUInt32BE(16),buffer.readUInt32BE(20)]}
assert.deepEqual(pngSize('dist/icons/icon-192.png'),[192,192]);assert.deepEqual(pngSize('dist/icons/icon-512.png'),[512,512]);assert.deepEqual(pngSize('dist/icons/icon-maskable-512.png'),[512,512]);assert.deepEqual(pngSize('dist/icons/apple-touch-icon.png'),[180,180]);
const registration=fs.readFileSync('dist/pwa.js','utf8'),worker=fs.readFileSync('dist/sw.js','utf8'),safeArea=fs.readFileSync('dist/pwa.css','utf8');
assert(registration.includes("register('/sw.js'"));assert(registration.includes("scope:'/'"));assert(registration.includes("updateViaCache:'none'"));assert(!registration.includes('beforeinstallprompt'));
assert(worker.includes("cache:'no-store'"));assert(worker.includes('caches.delete'));assert(worker.includes('/pwa.css'));assert(worker.includes('/joseon-data.js'));assert(worker.includes('/joseon-ui.js'));assert(!worker.includes('/assets/scenes/'));assert(!worker.includes('localStorage'));
assert(worker.includes("url.pathname==='/official-exam-explanations.json'"),'full choice payload must use runtime network-first caching');
assert(!worker.slice(worker.indexOf('const APP_SHELL=['),worker.indexOf('];',worker.indexOf('const APP_SHELL=['))).includes('/official-exam-explanations.json'),'full choice payload must not preload in the app shell');
for(const file of ['/proto-save-data.js','/proto-revision.css','/season-data.js','/official-exam-catalog.js','/official-exam-explanations.js','/official-exam-statistics.js','/exam-memory-ui.js','/exam-memory.css','/exam-memory-results.css','/exam-memory-nav.css','/ox-quiz-curation.js','/ox-quiz-data.js','/ox-quiz-ui.js','/ox-quiz.css'])assert(worker.includes(file),`service worker missing ${file}`);
assert(safeArea.includes('env(safe-area-inset-top)'));assert(safeArea.includes('env(safe-area-inset-bottom)'));assert(safeArea.includes('@media(display-mode:standalone)'));
const vercel=JSON.parse(fs.readFileSync('vercel.json','utf8'));assert.equal(vercel.outputDirectory,'dist');assert(vercel.headers.some(rule=>rule.source==='/sw.js'));assert(vercel.headers.some(rule=>rule.source==='/manifest.webmanifest'));
assert.equal(vercel.buildCommand,'npm run build && node scripts/prepare-vercel-output.cjs');
assert(vercel.rewrites?.some(rule=>rule.source==='/assets/:path*'&&rule.destination.includes('/'+deploymentContract.origin.commit+'/'+deploymentContract.origin.sourcePath+'/:path*')),'runtime assets must use the immutable deployment snapshot');
assert(vercel.headers.some(rule=>rule.source==='/assets/:path*'&&rule.headers?.some(header=>header.key==='x-vercel-enable-rewrite-caching'&&header.value==='1')),'external asset rewrite caching must be enabled');
assert(vercel.headers.some(rule=>rule.source==='/assets/:path*'&&rule.headers?.some(header=>header.key==='CDN-Cache-Control'&&header.value.includes('max-age=31536000'))),'immutable deployment assets need durable CDN caching');
for(const file of ['balhae-department-ink-v1.svg','tomb-section-ink-v1.svg','warehouse-map-and-tags-v1.svg'])assert(vercel.headers.some(rule=>rule.source===`/assets/ancient/three-complete/overlays/${file}`&&rule.headers?.some(header=>header.key==='Content-Type'&&header.value.startsWith('image/svg+xml'))),`${file} needs an SVG response type`);
const context=vm.createContext({});
const dataScripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(n=>!['editorial-ui.js','app.js','v2-app.js','pwa.js'].includes(n));
vm.runInContext(dataScripts.map(n=>fs.readFileSync('dist/'+n,'utf8')).join('\n')+';this.readyAssets=[...Object.values(ASSETS),...Object.values(PORTRAITS)].filter(a=>a.status==="ready"&&a.src).map(a=>a.src);',context);
for(const name of [...dataScripts,'v2-app.js','editorial-ui.js'])new vm.Script(fs.readFileSync('dist/'+name,'utf8'),{filename:name});
for(const file of context.readyAssets)assert(deploymentAssets.assetExists(repoRoot,path.join('dist',file)),`missing ready illustration: ${file}`);
vm.runInContext('this.eraAssets=[...Object.values(ERA_PROTAGONISTS).flatMap(c=>Object.values(c.assetPaths)),...Object.values(ERA_BACKGROUNDS).map(b=>b.src)]',context);
for(const file of context.eraAssets)assert(deploymentAssets.assetExists(repoRoot,path.join('dist',file)),`missing era visual: ${file}`);
// Production builds must reject stale or incomplete official-exam outputs.
// These checks cover all 1,800 detail/thumbnail files, their hashes and dimensions,
// as well as every structured choice explanation and its spoiler-safe rendering.
childProcess.execFileSync(process.execPath,['tests/official-canonical-qa-test.cjs'],{stdio:'inherit'});
childProcess.execFileSync(process.execPath,['tests/official-catalog-enrichment-ui-test.cjs'],{stdio:'inherit'});
childProcess.execFileSync(process.execPath,['tests/official-weakness-review-test.cjs'],{stdio:'inherit'});
childProcess.execFileSync(process.execPath,['tests/official-exam-cover-test.cjs'],{stdio:'inherit'});
childProcess.execFileSync(process.execPath,['tests/official-era-result-test.cjs'],{stdio:'inherit'});
// Only preview builds expose the responsive review harness. It uses the same
// game scripts and styles, with an isolated storage prefix for test fixtures.
const reviewFiles=['ui-review.html','ui-review-game.html','ui-review-storage.js','ui-review-fixtures.js'];
for(const name of ['storage.js','fixtures.js'])new vm.Script(fs.readFileSync('tests/browser-review/'+name,'utf8'),{filename:name});
if(process.env.VERCEL_ENV==='preview'||process.env.HISTORY_UI_REVIEW==='1'){
  fs.copyFileSync('tests/browser-review/review.html','dist/ui-review.html');
  fs.copyFileSync('tests/browser-review/storage.js','dist/ui-review-storage.js');
  fs.copyFileSync('tests/browser-review/fixtures.js','dist/ui-review-fixtures.js');
  const reviewGame=html.replace('<script src="data.js">','<script src="ui-review-storage.js"></script>\n  <script src="data.js">').replace(/\s*<script src="pwa\.js"><\/script>/,'').replace('</body>','  <script src="ui-review-fixtures.js"></script>\n</body>');
  fs.writeFileSync('dist/ui-review-game.html',reviewGame);
}else{
  for(const name of reviewFiles)if(fs.existsSync('dist/'+name))fs.unlinkSync('dist/'+name);
}
console.log(`PASS: static PWA build verified (${required.length} files, ${context.readyAssets.length} ready illustrations, install manifest and service worker).`);
