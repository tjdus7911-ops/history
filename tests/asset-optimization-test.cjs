const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');

execFileSync(process.execPath,['scripts/build-asset-optimization-manifest.cjs','--check'],{stdio:'pipe'});
const manifest=JSON.parse(fs.readFileSync('docs/performance/asset-optimization-manifest.json','utf8'));
assert.equal(manifest.optimizedAssetCount,11);assert.equal(manifest.archivedSourceOnlyCount,4);
assert.equal(manifest.totals.distSavedBytes,42789428);
assert(manifest.optimizedAssets.every(row=>row.runtimeBytes<=800000),'optimized detailed background exceeds the 800 KB target');
assert(manifest.optimizedAssets.every(row=>row.psnrDb>=35),'objective image quality gate failed');
assert(manifest.optimizedAssets.every(row=>row.width>0&&row.height>0&&fs.existsSync(row.sourcePath)&&fs.existsSync(row.runtimePath)));

const runtimeDir='dist/assets/ancient/three-complete/backgrounds';
assert.equal(fs.readdirSync(runtimeDir).filter(name=>name.endsWith('.webp')).length,11);
assert.equal(fs.readdirSync(runtimeDir).filter(name=>name.endsWith('.png')).length,0,'source PNG leaked into the deployment directory');
const acting=JSON.parse(fs.readFileSync('docs/three-content/staging-acting-generation.json','utf8'));
for(const asset of Object.values(acting.backgrounds)){
  assert(asset.src.endsWith('.webp'));assert(asset.repoSrc.startsWith('docs/three-content/source-assets/backgrounds/'));
  assert(fs.existsSync(path.join('dist',asset.src)));assert(fs.existsSync(asset.repoSrc));
}
const surfaces=JSON.parse(fs.readFileSync('docs/three-content/staging-setting-surface-generation.json','utf8'));
for(const surface of Object.values(surfaces.surfaces))assert(surface.backgroundSrc.endsWith('.webp'));
const art=JSON.parse(fs.readFileSync('dist/three-complete-art.json','utf8'));
assert(art.backgroundCatalog.queue.src.endsWith('goguryeo-spring-queue-before-collapse.webp'));
for(const generated of ['dist/three-complete-art.js','dist/three-complete-art.json','dist/three-staging.js']){
  const text=fs.readFileSync(generated,'utf8');
  assert(!/"src"\s*:\s*"assets\/ancient\/three-complete\/backgrounds\/[^"]+\.png/.test(text),`stale runtime PNG reference: ${generated}`);
}
console.log('PASS asset optimization: 11 same-dimension WebP backgrounds, 4 source-only PNGs archived, 42,789,428 deployment bytes removed.');
