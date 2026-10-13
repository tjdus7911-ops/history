'use strict';

const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { assetSetDigest, loadExternalAssetIndex, readGitAssetTree } = require('./prepare-vercel-output.cjs');

const repoRoot = path.resolve(__dirname, '..');
const originFile = path.join(repoRoot, 'config', 'deployment-asset-origin.json');
const manifestFile = path.join(repoRoot, 'config', 'deployment-assets-manifest.json');
const origin = JSON.parse(fs.readFileSync(originFile, 'utf8'));
const snapshot = readGitAssetTree(repoRoot, origin.commit, origin.sourcePath);
if (!snapshot && process.argv.includes('--check')) {
  const embedded = loadExternalAssetIndex(repoRoot);
  assert.equal(embedded.entries.length, origin.assetCount);
  assert.equal(embedded.totalBytes, origin.totalBytes);
  console.log(`PASS: embedded deployment asset manifest ${embedded.entries.length} files, ${embedded.totalBytes} bytes; pinned Git object is unavailable in this checkout.`);
  process.exit(0);
}
assert(snapshot, `deployment asset snapshot is unavailable: ${origin.commit}`);
const treeResult = require('node:child_process').spawnSync('git', ['rev-parse', `${origin.commit}^{tree}`], {
  cwd: repoRoot,
  encoding: 'utf8',
});
assert.equal(treeResult.status, 0, `deployment asset tree is unavailable: ${origin.commit}`);
assert.equal(treeResult.stdout.trim(), origin.tree, 'deployment snapshot tree mismatch');
assert.equal(snapshot.entries.length, origin.assetCount, 'deployment snapshot asset count mismatch');
assert.equal(snapshot.totalBytes, origin.totalBytes, 'deployment snapshot byte count mismatch');
const digest = assetSetDigest(snapshot.entries);
assert.equal(digest, origin.assetSetSha256, 'deployment snapshot digest mismatch');
const manifest = {
  schemaVersion: 1,
  commit: origin.commit,
  tree: origin.tree,
  files: snapshot.entries.map((entry) => [entry.path, entry.blob, entry.bytes]),
};
const output = `${JSON.stringify(manifest, null, 2)}\n`;

if (process.argv.includes('--check')) {
  assert(fs.existsSync(manifestFile), 'deployment asset manifest is missing');
  assert.equal(fs.readFileSync(manifestFile, 'utf8').replace(/\r\n/g, '\n'), output, 'deployment asset manifest is stale');
} else {
  fs.writeFileSync(manifestFile, output);
}

console.log(`PASS: deployment asset manifest ${snapshot.entries.length} files, ${snapshot.totalBytes} bytes, sha256 ${digest}.`);
