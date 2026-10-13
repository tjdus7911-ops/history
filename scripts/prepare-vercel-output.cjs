'use strict';

const assert = require('node:assert');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const childProcess = require('node:child_process');

const ORIGIN_FILE = path.join('config', 'deployment-asset-origin.json');
const MANIFEST_FILE = path.join('config', 'deployment-assets-manifest.json');
const PUBLIC_PREFIX = 'assets/';
const cache = new Map();

function compareUtf8(left, right) {
  return Buffer.compare(Buffer.from(left, 'utf8'), Buffer.from(right, 'utf8'));
}

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function assetSetDigest(entries) {
  const payload = entries
    .map((entry) => `${entry.path}\t${entry.blob}\t${entry.bytes}`)
    .sort(compareUtf8)
    .join('\n') + '\n';
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function git(repoRoot, args) {
  return childProcess.spawnSync('git', ['-c', 'core.quotepath=false', ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });
}

function readGitAssetTree(repoRoot, revision, sourcePath = 'dist/assets') {
  const result = git(repoRoot, ['ls-tree', '-rl', revision, '--', sourcePath]);
  if (result.status !== 0) return null;
  const entries = [];
  let totalBytes = 0;
  for (const line of result.stdout.split(/\r?\n/).filter(Boolean)) {
    const match = line.match(/^100644 blob ([0-9a-f]{40})\s+(\d+)\t(.+)$/);
    assert(match, `unexpected asset snapshot entry: ${line}`);
    const bytes = Number(match[2]);
    const repositoryPath = match[3];
    assert(repositoryPath.startsWith('dist/assets/'), `asset escaped dist/assets: ${repositoryPath}`);
    entries.push({ path: repositoryPath.slice('dist/'.length), blob: match[1], bytes });
    totalBytes += bytes;
  }
  entries.sort((left, right) => compareUtf8(left.path, right.path));
  return { entries, totalBytes };
}

function loadExternalAssetIndex(repoRoot) {
  const root = path.resolve(repoRoot);
  if (cache.has(root)) return cache.get(root);
  const origin = loadJson(path.join(root, ORIGIN_FILE));
  const manifest = loadJson(path.join(root, MANIFEST_FILE));

  assert.equal(origin.schemaVersion, 1, 'unsupported deployment asset origin schema');
  assert.equal(manifest.schemaVersion, 1, 'unsupported deployment asset manifest schema');
  assert.equal(origin.provider, 'github-raw', 'unsupported deployment asset provider');
  assert.match(origin.repository, /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/, 'invalid GitHub repository');
  assert.match(origin.commit, /^[0-9a-f]{40}$/, 'deployment assets must use a full commit SHA');
  assert.match(origin.tree, /^[0-9a-f]{40}$/, 'deployment assets must pin an immutable Git tree');
  assert.equal(origin.sourcePath, 'dist/assets', 'unexpected deployment asset source path');
  assert.equal(origin.publicPath, '/assets', 'unexpected deployment asset public path');
  assert.equal(manifest.commit, origin.commit, 'asset manifest commit mismatch');
  assert.equal(manifest.tree, origin.tree, 'asset manifest tree mismatch');
  assert(Array.isArray(manifest.files), 'asset manifest files must be an array');

  const entries = [];
  const index = new Map();
  let totalBytes = 0;
  for (const row of manifest.files) {
    assert(Array.isArray(row) && row.length === 3, 'invalid deployment asset manifest row');
    const [assetPath, blob, bytes] = row;
    assert.equal(typeof assetPath, 'string', 'invalid deployment asset path');
    assert(assetPath.startsWith(PUBLIC_PREFIX), `asset escaped public prefix: ${assetPath}`);
    assert(!assetPath.includes('..') && !path.isAbsolute(assetPath), `unsafe deployment asset path: ${assetPath}`);
    assert.match(blob, /^[0-9a-f]{40}$/, `${assetPath}: invalid Git blob SHA-1`);
    assert(Number.isSafeInteger(bytes) && bytes > 0, `${assetPath}: invalid byte count`);
    assert(!index.has(assetPath), `duplicate deployment asset path: ${assetPath}`);
    const entry = { path: assetPath, blob, bytes };
    entries.push(entry);
    index.set(assetPath, entry);
    totalBytes += bytes;
  }

  assert.equal(entries.length, origin.assetCount, 'deployment asset count is stale');
  assert.equal(totalBytes, origin.totalBytes, 'deployment asset byte count is stale');
  assert.equal(assetSetDigest(entries), origin.assetSetSha256, 'deployment asset-set digest is stale');
  const value = { entries, index, manifest, origin, totalBytes };
  cache.set(root, value);
  return value;
}

function externalAssetInfo(repoRoot, file) {
  const relative = String(file).replace(/\\/g, '/').replace(/^\.\//, '').replace(/^dist\//, '').replace(/^\//, '');
  if (!relative.startsWith(PUBLIC_PREFIX)) return null;
  return loadExternalAssetIndex(repoRoot).index.get(relative) || null;
}

function assetExists(repoRoot, file) {
  const absolute = path.resolve(repoRoot, file);
  const root = path.resolve(repoRoot);
  const relation = path.relative(root, absolute);
  assert(!relation.startsWith('..') && !path.isAbsolute(relation), `unsafe asset lookup: ${file}`);
  const normalized = relation.replace(/\\/g, '/').replace(/^dist\//, '');
  // Runtime assets are deployable only when the immutable manifest contains
  // them. An ignored local file must never mask a missing production object.
  if (normalized.startsWith(PUBLIC_PREFIX)) return Boolean(externalAssetInfo(root, relation));
  return fs.existsSync(absolute);
}

function validateDeploymentContract(repoRoot) {
  const root = path.resolve(repoRoot);
  const assets = loadExternalAssetIndex(root);
  const vercel = loadJson(path.join(root, 'vercel.json'));
  const expectedDestination = `https://raw.githubusercontent.com/${assets.origin.repository}/${assets.origin.commit}/${assets.origin.sourcePath}/:path*`;
  const rewrite = (vercel.rewrites || []).find((rule) => rule.source === `${assets.origin.publicPath}/:path*`);
  assert(rewrite, 'missing immutable deployment asset rewrite');
  assert.equal(rewrite.destination, expectedDestination, 'deployment asset rewrite does not match the pinned origin');
  const cacheRule = (vercel.headers || []).find((rule) => rule.source === `${assets.origin.publicPath}/:path*`);
  assert(cacheRule?.headers?.some((header) => header.key.toLowerCase() === 'x-vercel-enable-rewrite-caching' && header.value === '1'), 'external asset rewrite caching is not enabled');

  const catalog = loadJson(path.join(root, 'dist', 'official-exam-catalog.json'));
  assert.equal(catalog.length, 1800, 'official exam catalog count changed');
  for (const record of catalog) {
    for (const [assetPath, expectedBytes] of [[record.detailImage, record.detailImageBytes], [record.thumbnailImage, record.thumbnailImageBytes]]) {
      const entry = assets.index.get(assetPath);
      assert(entry, `${record.officialQuestionId}: deployment snapshot is missing ${assetPath}`);
      assert.equal(entry.bytes, expectedBytes, `${record.officialQuestionId}: deployment snapshot byte mismatch for ${assetPath}`);
    }
  }
  return { ...assets, expectedDestination };
}

function validatePinnedSnapshot(repoRoot) {
  const root = path.resolve(repoRoot);
  const assets = loadExternalAssetIndex(root);

  const verifySourceSnapshot = (source, label) => {
    const sourceAssets = readGitAssetTree(root, source.commit, source.sourcePath || 'dist/assets');
    if (!sourceAssets) return null;
    assert.equal(sourceAssets.entries.length, source.assetCount, `${label} asset source count mismatch`);
    assert.equal(sourceAssets.totalBytes, source.totalBytes, `${label} asset source byte count mismatch`);
    for (const entry of sourceAssets.entries) {
      assert.deepEqual(assets.index.get(entry.path), entry, `${label} asset missing from deployment snapshot: ${entry.path}`);
    }
    return sourceAssets;
  };

  const current = assets.origin.currentSnapshot;
  if (current) {
    const currentTreeResult = git(root, ['rev-parse', `${current.commit}:dist/assets`]);
    if (currentTreeResult.status === 0) {
      assert.equal(currentTreeResult.stdout.trim(), current.tree, 'current asset source tree mismatch');
      verifySourceSnapshot(current, 'current');
    }
  }

  for (const legacy of assets.origin.legacySnapshots || []) verifySourceSnapshot(legacy, 'legacy');

  const treeResult = git(root, ['rev-parse', `${assets.origin.commit}^{tree}`]);
  if (treeResult.status !== 0) return { available: false, ...assets };
  assert.equal(treeResult.stdout.trim(), assets.origin.tree, 'pinned deployment snapshot tree mismatch');
  const snapshot = readGitAssetTree(root, assets.origin.commit, assets.origin.sourcePath);
  assert(snapshot, 'pinned deployment asset snapshot is unavailable');
  assert.equal(snapshot.entries.length, assets.entries.length, 'pinned deployment snapshot count mismatch');
  assert.equal(snapshot.totalBytes, assets.totalBytes, 'pinned deployment snapshot byte count mismatch');
  const snapshotIndex = new Map(snapshot.entries.map((entry) => [entry.path, entry]));
  for (const entry of assets.entries) assert.deepEqual(snapshotIndex.get(entry.path), entry, `pinned deployment asset changed: ${entry.path}`);

  return { available: true, snapshot, ...assets };
}

function runtimeChoicePayload(payload) {
  assert.equal(payload.schemaVersion, 3);
  assert.equal(payload.records.length, 1800);
  const records = payload.records.map(record => ({
    officialQuestionId: record.officialQuestionId,
    explanation: record.explanation,
    coreVerificationStatus: record.coreVerificationStatus,
    choices: record.choices,
    choiceExplanations: record.choiceExplanations.map(choice => ({
      choiceIndex: choice.choiceIndex,
      choiceText: choice.choiceText,
      meaning: choice.meaning,
      // Legacy explanations remain available only when a summary is absent.
      ...(!choice.meaning ? { correctedFact: choice.correctedFact, explanation: choice.explanation } : {}),
    })),
  }));
  const count = records.reduce((sum, record) => sum + record.choiceExplanations.length, 0);
  assert.equal(count, payload.canonicalChoiceCount);
  return { schemaVersion: 3, canonicalChoiceCount: count, records };
}

function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const result = validateDeploymentContract(repoRoot);
  const pinned = validatePinnedSnapshot(repoRoot);
  // Package only the learner-facing data after canonical source QA has passed.
  // The repository's complete explanation file is never changed by this step
  // outside the disposable Vercel build checkout.
  if (process.env.VERCEL === '1') {
    const file = path.join(repoRoot, 'dist', 'official-exam-explanations.json');
    const original = fs.readFileSync(file, 'utf8');
    const compact = JSON.stringify(runtimeChoicePayload(JSON.parse(original)));
    fs.writeFileSync(file, compact);
    console.log(`PASS: packaged official choice summaries: ${Buffer.byteLength(original)} -> ${Buffer.byteLength(compact)} bytes.`);
  }
  console.log(`PASS: verified ${result.origin.assetCount} immutable deployment assets (${result.totalBytes} bytes); pinned snapshot ${pinned.available ? 'available' : 'not present in this shallow checkout'}.`);
}

if (require.main === module) main();

module.exports = {
  runtimeChoicePayload,
  assetExists,
  assetSetDigest,
  externalAssetInfo,
  loadExternalAssetIndex,
  readGitAssetTree,
  validateDeploymentContract,
  validatePinnedSnapshot,
};
