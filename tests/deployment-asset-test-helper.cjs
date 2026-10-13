'use strict';

const assert = require('node:assert');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const deploymentAssets = require('../scripts/prepare-vercel-output.cjs');

const repoRoot = path.resolve(__dirname, '..');

function repoPath(file) {
  const absolute = path.resolve(repoRoot, file);
  const relative = path.relative(repoRoot, absolute);
  assert(!relative.startsWith('..') && !path.isAbsolute(relative), `asset test path escaped repository: ${file}`);
  return { absolute, relative };
}

function assetExists(file) {
  const target = repoPath(file);
  return deploymentAssets.assetExists(repoRoot, target.relative);
}

function assetInfo(file) {
  const target = repoPath(file);
  return deploymentAssets.externalAssetInfo(repoRoot, target.relative);
}

function assertAsset(file, message = `missing deployment asset: ${file}`) {
  assert(assetExists(file), message);
  return assetInfo(file);
}

function assetFingerprint(file, algorithm = 'sha256') {
  const target = repoPath(file);
  const info = assertAsset(file);
  if (fs.existsSync(target.absolute)) {
    return crypto.createHash(algorithm).update(fs.readFileSync(target.absolute)).digest('hex');
  }
  return `git-${info.blob}`;
}

function assertSha256IfLocal(file, expected, message) {
  const target = repoPath(file);
  assertAsset(file, message || `missing deployment asset: ${file}`);
  if (fs.existsSync(target.absolute)) {
    assert.equal(
      crypto.createHash('sha256').update(fs.readFileSync(target.absolute)).digest('hex'),
      expected,
      message,
    );
  }
}

function assertGitBlobSha1(file, expected, message) {
  const target = repoPath(file);
  const info = assertAsset(file, message || `missing deployment asset: ${file}`);
  if (!fs.existsSync(target.absolute)) {
    assert.equal(info.blob, expected, message);
    return;
  }
  const bytes = fs.readFileSync(target.absolute);
  const actual = crypto.createHash('sha1')
    .update(Buffer.from(`blob ${bytes.length}\0`))
    .update(bytes)
    .digest('hex');
  assert.equal(actual, expected, message);
}

function listedAssets(prefix) {
  const normalized = String(prefix).replace(/\\/g, '/').replace(/^\.\//, '').replace(/^dist\//, '').replace(/^\//, '').replace(/\/?$/, '/');
  return deploymentAssets.loadExternalAssetIndex(repoRoot).entries
    .filter((entry) => entry.path.startsWith(normalized))
    .map((entry) => entry.path.slice(normalized.length))
    .filter((name) => name && !name.includes('/'));
}

module.exports = {
  assetExists,
  assetFingerprint,
  assetInfo,
  assertAsset,
  assertGitBlobSha1,
  assertSha256IfLocal,
  listedAssets,
  repoRoot,
};
