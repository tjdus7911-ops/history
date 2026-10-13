'use strict';

const assert = require('node:assert');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const childProcess = require('node:child_process');

const DETAIL_PREFIX = 'assets/exams/catalog/detail/';

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function gitBlobSha1File(file) {
  const contents = fs.readFileSync(file);
  return crypto.createHash('sha1').update(`blob ${contents.length}\0`).update(contents).digest('hex');
}

function assetSetDigest(records) {
  const payload = records
    .map((record) => [record.detailImage, record.detailImageSha256, record.detailImageBytes].join('\t'))
    .sort()
    .join('\n') + '\n';
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function resolveInside(root, relativePath) {
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(root, relativePath);
  const relation = path.relative(resolvedRoot, resolved);
  assert(relation && !relation.startsWith('..') && !path.isAbsolute(relation), `unsafe path outside ${resolvedRoot}: ${resolved}`);
  return resolved;
}

function validateDeploymentContract(repoRoot, options = {}) {
  const verifyFileHashes = options.verifyFileHashes !== false;
  const configFile = path.join(repoRoot, 'config', 'official-exam-detail-origin.json');
  const vercelFile = path.join(repoRoot, 'vercel.json');
  const catalogFile = path.join(repoRoot, 'dist', 'official-exam-catalog.json');
  const origin = loadJson(configFile);
  const vercel = loadJson(vercelFile);
  const catalog = loadJson(catalogFile);

  assert.equal(origin.schemaVersion, 1, 'unsupported detail-origin schema');
  assert.match(origin.repository, /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/, 'invalid GitHub repository');
  assert.match(origin.commit, /^[0-9a-f]{40}$/, 'detail origin must use an immutable full commit SHA');
  assert.equal(origin.sourcePath, 'dist/assets/exams/catalog/detail', 'unexpected detail source path');
  assert.equal(origin.publicPath, '/assets/exams/catalog/detail', 'unexpected detail public path');
  assert(Array.isArray(catalog) && catalog.length > 0, 'official exam catalog is empty');

  assert.equal(origin.provider, 'github-raw', 'unsupported detail origin provider');
  assert.match(origin.tree, /^[0-9a-f]{40}$/, 'detail origin must pin an immutable Git tree');
  assert(Number.isSafeInteger(origin.snapshotAssetCount) && origin.snapshotAssetCount >= origin.assetCount, 'invalid snapshot asset count');
  assert(Number.isSafeInteger(origin.snapshotTotalBytes) && origin.snapshotTotalBytes >= origin.totalBytes, 'invalid snapshot byte count');
  assert(Array.isArray(origin.legacySnapshots), 'legacy snapshot metadata is missing');
  const expectedDestination = `https://raw.githubusercontent.com/${origin.repository}/${origin.commit}/${origin.sourcePath}/:path*`;
  const rewrite = (vercel.rewrites || []).find((rule) => rule.source === `${origin.publicPath}/:path*`);
  assert(rewrite, 'missing immutable official-detail rewrite');
  assert.equal(rewrite.destination, expectedDestination, 'official-detail rewrite does not match the pinned origin');

  const detailRoot = resolveInside(repoRoot, origin.sourcePath);
  assert.equal(detailRoot, path.resolve(repoRoot, 'dist', 'assets', 'exams', 'catalog', 'detail'), 'refusing unexpected detail root');
  assert(fs.statSync(detailRoot).isDirectory(), 'official detail directory is missing');

  const seen = new Set();
  let totalBytes = 0;
  for (const record of catalog) {
    assert.equal(typeof record.detailImage, 'string', `${record.officialQuestionId}: missing detail path`);
    assert(record.detailImage.startsWith(DETAIL_PREFIX), `${record.officialQuestionId}: detail path escaped the catalog root`);
    assert(!record.detailImage.includes('..'), `${record.officialQuestionId}: unsafe detail path`);
    assert.match(record.detailImageSha256, /^[0-9a-f]{64}$/, `${record.officialQuestionId}: invalid detail hash`);
    assert(Number.isSafeInteger(record.detailImageBytes) && record.detailImageBytes > 0, `${record.officialQuestionId}: invalid detail byte count`);
    assert(!seen.has(record.detailImage), `${record.officialQuestionId}: duplicate detail path`);
    seen.add(record.detailImage);

    const detailFile = resolveInside(path.join(repoRoot, 'dist'), record.detailImage);
    const stat = fs.statSync(detailFile);
    assert(stat.isFile(), `${record.officialQuestionId}: detail asset is not a file`);
    assert.equal(stat.size, record.detailImageBytes, `${record.officialQuestionId}: detail byte count mismatch`);
    assert(path.basename(detailFile).includes(`.${record.detailImageSha256.slice(0, 12)}.`), `${record.officialQuestionId}: filename hash mismatch`);
    if (verifyFileHashes) {
      assert.equal(sha256File(detailFile), record.detailImageSha256, `${record.officialQuestionId}: detail SHA-256 mismatch`);
    }
    totalBytes += stat.size;
  }

  assert.equal(seen.size, origin.assetCount, 'detail origin asset count is stale');
  assert.equal(totalBytes, origin.totalBytes, 'detail origin total byte count is stale');
  assert.equal(assetSetDigest(catalog), origin.assetSetSha256, 'detail origin asset-set digest is stale');

  const diskFiles = fs.readdirSync(detailRoot, { withFileTypes: true });
  assert(diskFiles.every((entry) => entry.isFile()), 'detail directory must contain files only');
  assert.equal(diskFiles.length, origin.assetCount, 'detail directory contains stale or missing files');

  return { catalog, detailRoot, expectedDestination, origin, totalBytes };
}

function git(repoRoot, args, options = {}) {
  return childProcess.spawnSync('git', args, {
    cwd: repoRoot,
    encoding: options.encoding || 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
}

function readGitDetailTree(repoRoot, revision) {
  const result = git(repoRoot, ['ls-tree', '-rl', revision, '--', 'dist/assets/exams/catalog/detail']);
  if (result.status !== 0) return null;
  const entries = new Map();
  let totalBytes = 0;
  for (const line of result.stdout.split(/\r?\n/).filter(Boolean)) {
    const match = line.match(/^100644 blob ([0-9a-f]{40})\s+(\d+)\t(dist\/assets\/exams\/catalog\/detail\/.+\.webp)$/);
    assert(match, `unexpected detail snapshot entry: ${line}`);
    const bytes = Number(match[2]);
    entries.set(match[3], { blob: match[1], bytes });
    totalBytes += bytes;
  }
  return { entries, totalBytes };
}

function validatePinnedSnapshot(repoRoot) {
  const origin = loadJson(path.join(repoRoot, 'config', 'official-exam-detail-origin.json'));
  const treeResult = git(repoRoot, ['rev-parse', `${origin.commit}^{tree}`]);
  if (treeResult.status !== 0) return { available: false, origin };
  assert.equal(treeResult.stdout.trim(), origin.tree, 'pinned detail snapshot tree mismatch');
  const snapshot = readGitDetailTree(repoRoot, origin.commit);
  assert(snapshot, 'pinned detail snapshot is unavailable');
  assert.equal(snapshot.entries.size, origin.snapshotAssetCount, 'pinned snapshot asset count mismatch');
  assert.equal(snapshot.totalBytes, origin.snapshotTotalBytes, 'pinned snapshot byte count mismatch');

  const catalog = loadJson(path.join(repoRoot, 'dist', 'official-exam-catalog.json'));
  for (const record of catalog) {
    const snapshotPath = `dist/${record.detailImage}`;
    const entry = snapshot.entries.get(snapshotPath);
    assert(entry, `${record.officialQuestionId}: current detail is absent from pinned snapshot`);
    assert.equal(entry.bytes, record.detailImageBytes, `${record.officialQuestionId}: pinned detail byte mismatch`);
    assert.equal(entry.blob, gitBlobSha1File(path.join(repoRoot, 'dist', record.detailImage)), `${record.officialQuestionId}: pinned detail blob mismatch`);
  }

  for (const legacy of origin.legacySnapshots) {
    assert.match(legacy.commit, /^[0-9a-f]{40}$/, 'legacy snapshot must use a full commit SHA');
    const legacyTree = readGitDetailTree(repoRoot, legacy.commit);
    assert(legacyTree, `legacy snapshot ${legacy.commit} is unavailable`);
    assert.equal(legacyTree.entries.size, legacy.assetCount, 'legacy snapshot asset count mismatch');
    assert.equal(legacyTree.totalBytes, legacy.totalBytes, 'legacy snapshot byte count mismatch');
    for (const [legacyPath, legacyEntry] of legacyTree.entries) {
      const pinnedEntry = snapshot.entries.get(legacyPath);
      assert(pinnedEntry, `legacy detail is absent from pinned snapshot: ${legacyPath}`);
      assert.deepEqual(pinnedEntry, legacyEntry, `legacy detail changed in pinned snapshot: ${legacyPath}`);
    }
  }
  return { available: true, origin, snapshot };
}

function pruneDetailAssets(repoRoot, options = {}) {
  const validation = validateDeploymentContract(repoRoot, options);
  const expectedRoot = path.resolve(repoRoot, 'dist', 'assets', 'exams', 'catalog', 'detail');
  assert.equal(validation.detailRoot, expectedRoot, 'refusing to remove an unexpected directory');
  assert.equal(path.basename(validation.detailRoot), 'detail', 'refusing to remove a non-detail directory');
  fs.rmSync(validation.detailRoot, { recursive: true, force: false });
  assert(!fs.existsSync(validation.detailRoot), 'detail output directory was not removed');
  return validation;
}

function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const shouldApply = process.argv.includes('--apply');
  if (shouldApply) {
    const result = pruneDetailAssets(repoRoot);
    console.log(`PASS: pruned ${result.origin.assetCount} pinned detail assets (${result.totalBytes} bytes) from the Vercel output; ${result.expectedDestination}`);
  } else {
    const result = validateDeploymentContract(repoRoot);
    console.log(`PASS: verified ${result.origin.assetCount} pinned detail assets (${result.totalBytes} bytes); no files removed.`);
  }
}

if (require.main === module) main();

module.exports = { assetSetDigest, pruneDetailAssets, validateDeploymentContract, validatePinnedSnapshot };
