'use strict';

const assert = require('node:assert');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { assetSetDigest, pruneDetailAssets, validateDeploymentContract, validatePinnedSnapshot } = require('../scripts/prepare-vercel-output.cjs');

const repoRoot = path.resolve(__dirname, '..');
const live = validateDeploymentContract(repoRoot);
assert.equal(live.origin.assetCount, 1800);
assert.equal(live.catalog.length, 1800);
assert.equal(live.origin.totalBytes, 161084204);
const pinned = validatePinnedSnapshot(repoRoot);
assert(pinned.available, 'the local release checkout must contain the pinned detail snapshot for verification');
assert.equal(pinned.snapshot.entries.size, 3600);
assert.equal(pinned.snapshot.totalBytes, 370141486);

const vercel = JSON.parse(fs.readFileSync(path.join(repoRoot, 'vercel.json'), 'utf8'));
assert.equal(vercel.buildCommand, 'npm run build && node scripts/prepare-vercel-output.cjs --apply');
const detailHeaders = vercel.headers.find((rule) => rule.source === '/assets/exams/catalog/detail/:path*');
assert(detailHeaders, 'missing detail cache headers');
assert.deepEqual(detailHeaders.headers, [{ key: 'x-vercel-enable-rewrite-caching', value: '1' }]);

const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'history-vercel-detail-test-'));
try {
  const detailDir = path.join(fixtureRoot, 'dist', 'assets', 'exams', 'catalog', 'detail');
  const thumbnailDir = path.join(fixtureRoot, 'dist', 'assets', 'exams', 'catalog', 'thumbnail');
  fs.mkdirSync(detailDir, { recursive: true });
  fs.mkdirSync(thumbnailDir, { recursive: true });
  fs.mkdirSync(path.join(fixtureRoot, 'config'), { recursive: true });
  const bytes = Buffer.from('official-detail-fixture');
  const hash = crypto.createHash('sha256').update(bytes).digest('hex');
  const detailImage = `assets/exams/catalog/detail/fixture.${hash.slice(0, 12)}.webp`;
  fs.writeFileSync(path.join(fixtureRoot, 'dist', detailImage), bytes);
  fs.writeFileSync(path.join(thumbnailDir, 'keep.webp'), 'thumbnail');
  const catalog = [{ officialQuestionId: 'fixture-01', detailImage, detailImageSha256: hash, detailImageBytes: bytes.length }];
  fs.writeFileSync(path.join(fixtureRoot, 'dist', 'official-exam-catalog.json'), JSON.stringify(catalog));
  const origin = {
    schemaVersion: 1,
    provider: 'github-raw',
    repository: 'owner/repository',
    commit: 'a'.repeat(40),
    tree: 'b'.repeat(40),
    sourcePath: 'dist/assets/exams/catalog/detail',
    publicPath: '/assets/exams/catalog/detail',
    assetCount: 1,
    totalBytes: bytes.length,
    assetSetSha256: assetSetDigest(catalog),
    snapshotAssetCount: 1,
    snapshotTotalBytes: bytes.length,
    legacySnapshots: [],
  };
  fs.writeFileSync(path.join(fixtureRoot, 'config', 'official-exam-detail-origin.json'), JSON.stringify(origin));
  fs.writeFileSync(path.join(fixtureRoot, 'vercel.json'), JSON.stringify({
    rewrites: [{
      source: '/assets/exams/catalog/detail/:path*',
      destination: `https://raw.githubusercontent.com/${origin.repository}/${origin.commit}/${origin.sourcePath}/:path*`,
    }],
  }));

  pruneDetailAssets(fixtureRoot);
  assert(!fs.existsSync(detailDir), 'fixture detail directory should be pruned');
  assert(fs.existsSync(path.join(thumbnailDir, 'keep.webp')), 'thumbnail directory must be preserved');
  assert(fs.existsSync(path.join(fixtureRoot, 'dist', 'official-exam-catalog.json')), 'catalog must be preserved');
} finally {
  fs.rmSync(fixtureRoot, { recursive: true, force: true });
}

console.log('PASS: immutable official-detail origin and Vercel-only pruning are safe.');
