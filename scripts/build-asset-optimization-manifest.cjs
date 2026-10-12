#!/usr/bin/env node
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),sourceDir='docs/three-content/source-assets/backgrounds',runtimeDir='dist/assets/ancient/three-complete/backgrounds';
const quality={
  'baekje-letter-relay-post':[2.8073,36.635],
  'balhae-office-readable-labels-v3':[2.0882,39.101],
  'bulguksa-distinct-pagodas-v1':[3.0858,35.502],
  'cheonghaejin-warehouse-v1':[2.611,37.193],
  'goguryeo-spring-queue-after-collapse':[2.2703,38.377],
  'goguryeo-spring-queue-before-collapse':[2.3057,38.289],
  'goguryeo-spring-queue-mother-in-pair-v1':[2.2542,38.451],
  'hwangnyongsa-construction-v1':[3.1629,35.367],
  'seokguram-assembly-v1':[2.8142,36.713],
  'silla-ox-field-readable-v3':[2.8429,36.69],
  'silla-tomb-worksite-v1':[2.9186,36.242]
};
const sourceOnly={
  'balhae-jeongdangseong-office-v1':'superseded generation source; final v3 is the runtime background',
  'balhae-office-readable-shelf-v2':'intermediate reference for the final readable-labels v3 background',
  'silla-ox-field-rest-portrait-v2':'intermediate reference for the final readable v3 background',
  'silla-ox-field-rest-v1':'superseded generation source; not referenced by a runtime scene'
};
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function pngSize(bytes){assert.equal(bytes.subarray(1,4).toString(),'PNG');return {width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),colorType:bytes[25]}}
function webpSize(bytes){
  assert.equal(bytes.subarray(0,4).toString(),'RIFF');assert.equal(bytes.subarray(8,12).toString(),'WEBP');
  const kind=bytes.subarray(12,16).toString(),offset=20;
  if(kind==='VP8 ')return {width:bytes.readUInt16LE(offset+6)&0x3fff,height:bytes.readUInt16LE(offset+8)&0x3fff,kind};
  if(kind==='VP8X')return {width:1+bytes.readUIntLE(offset+4,3),height:1+bytes.readUIntLE(offset+7,3),kind};
  if(kind==='VP8L')return {width:1+bytes[offset+1]+((bytes[offset+2]&0x3f)<<8),height:1+(bytes[offset+2]>>6)+(bytes[offset+3]<<2)+((bytes[offset+4]&0x0f)<<10),kind};
  throw Error('Unsupported WebP chunk '+kind);
}
function file(relative){const bytes=fs.readFileSync(path.join(root,relative));return {bytes,byteLength:bytes.length,sha256:hash(bytes)}}
const optimizedAssets=Object.entries(quality).sort(([a],[b])=>a.localeCompare(b)).map(([name,[meanAbsoluteError,psnrDb]])=>{
  const sourcePath=`${sourceDir}/${name}.png`,runtimePath=`${runtimeDir}/${name}.webp`,source=file(sourcePath),runtime=file(runtimePath),before=pngSize(source.bytes),after=webpSize(runtime.bytes);
  assert.deepEqual({width:after.width,height:after.height},{width:before.width,height:before.height},name+' dimensions changed');
  assert.equal(before.colorType,2,name+' source alpha/color model changed unexpectedly');
  return {name,sourcePath,runtimePath,width:before.width,height:before.height,sourceBytes:source.byteLength,runtimeBytes:runtime.byteLength,savedBytes:source.byteLength-runtime.byteLength,reductionPercent:Number(((1-runtime.byteLength/source.byteLength)*100).toFixed(2)),sourceSha256:source.sha256,runtimeSha256:runtime.sha256,meanAbsoluteError,psnrDb};
});
const archivedSourceOnly=Object.entries(sourceOnly).sort(([a],[b])=>a.localeCompare(b)).map(([name,reason])=>{const sourcePath=`${sourceDir}/${name}.png`,source=file(sourcePath),size=pngSize(source.bytes);return {name,sourcePath,width:size.width,height:size.height,byteLength:source.byteLength,sha256:source.sha256,reason}});
const sourceBytes=optimizedAssets.reduce((n,row)=>n+row.sourceBytes,0),runtimeBytes=optimizedAssets.reduce((n,row)=>n+row.runtimeBytes,0),archivedBytes=archivedSourceOnly.reduce((n,row)=>n+row.byteLength,0);
const manifest={schemaVersion:1,contentVersion:'2026-10-12-three-background-webp-v1',encoder:{format:'webp',quality:86,effort:6,smartSubsample:true,dimensionsPreserved:true},optimizedAssetCount:optimizedAssets.length,archivedSourceOnlyCount:archivedSourceOnly.length,totals:{optimizedSourceBytes:sourceBytes,optimizedRuntimeBytes:runtimeBytes,optimizedSavedBytes:sourceBytes-runtimeBytes,archivedSourceOnlyBytes:archivedBytes,distSavedBytes:sourceBytes-runtimeBytes+archivedBytes},qualityGate:{minimumPsnrDb:35,maximumMeanAbsoluteError:3.2},optimizedAssets,archivedSourceOnly};
assert(manifest.optimizedAssets.every(row=>row.psnrDb>=manifest.qualityGate.minimumPsnrDb&&row.meanAbsoluteError<=manifest.qualityGate.maximumMeanAbsoluteError),'quality gate failed');
const output=JSON.stringify(manifest,null,2)+'\n',target=path.join(root,'docs/performance/asset-optimization-manifest.json');
if(process.argv.includes('--check')){assert.equal(fs.readFileSync(target,'utf8'),output,'stale asset optimization manifest')}else{fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,output)}
console.log(JSON.stringify({optimizedAssetCount:manifest.optimizedAssetCount,archivedSourceOnlyCount:manifest.archivedSourceOnlyCount,...manifest.totals}));
