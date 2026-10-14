'use strict';

const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  assetExists,
  assetSetDigest,
  externalAssetInfo,
  validateDeploymentContract,
  validatePinnedSnapshot,
} = require('../scripts/prepare-vercel-output.cjs');

const repoRoot = path.resolve(__dirname, '..');
const live = validateDeploymentContract(repoRoot);
assert.equal(live.origin.assetCount, 8592);
assert.equal(live.origin.totalBytes, 1288473206);
assert.equal(live.origin.currentSnapshot.assetCount, 4494);
assert.equal(live.origin.currentSnapshot.totalBytes, 918201788);
assert.equal(live.index.size, 8592);
assert(externalAssetInfo(repoRoot, 'dist/assets/exams/catalog/detail/official-79-advanced-01.0a4f704ec51c.webp'));
assert(externalAssetInfo(repoRoot, 'dist/assets/exams/catalog/detail/official-79-advanced-01.ca7342c3fb31.webp'));
assert(externalAssetInfo(repoRoot, 'dist/assets/ancient/backgrounds/ancient-modern-museum.jpg'));
assert(externalAssetInfo(repoRoot, 'dist/assets/exams/catalog/content/official-79-basic-01-content.1d87f3ae2330.webp'));
const pinned = validatePinnedSnapshot(repoRoot);
// A full maintainer clone verifies every pinned Git blob. Vercel and CI use a
// branch-scoped shallow checkout, so the sibling asset-snapshot commit may not
// be present there; the checked-in manifest remains the deployment contract.
if (pinned.available) {
  assert.equal(pinned.snapshot.entries.length, 8592);
  assert.equal(pinned.snapshot.totalBytes, 1288473206);
}

const vercel = JSON.parse(fs.readFileSync(path.join(repoRoot, 'vercel.json'), 'utf8'));
assert.equal(vercel.buildCommand, 'npm run build && node scripts/prepare-vercel-output.cjs');
const assetHeaders = vercel.headers.find((rule) => rule.source === '/assets/:path*');
assert(assetHeaders, 'missing external asset cache headers');
assert(assetHeaders.headers.some((header) => header.key === 'x-vercel-enable-rewrite-caching' && header.value === '1'));
assert(assetHeaders.headers.some((header) => header.key === 'CDN-Cache-Control' && header.value === 'public, max-age=31536000, immutable'));
for (const file of ['balhae-department-ink-v1.svg', 'tomb-section-ink-v1.svg', 'warehouse-map-and-tags-v1.svg']) {
  const rule = vercel.headers.find((item) => item.source === `/assets/ancient/three-complete/overlays/${file}`);
  assert(rule?.headers?.some((header) => header.key === 'Content-Type' && header.value === 'image/svg+xml; charset=utf-8'), `${file}: missing SVG response type`);
}

const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'history-external-assets-test-'));
try {
  fs.mkdirSync(path.join(fixtureRoot, 'config'), { recursive: true });
  fs.mkdirSync(path.join(fixtureRoot, 'dist'), { recursive: true });
  const detail = { path: 'assets/exams/catalog/detail/fixture.aaaaaaaaaaaa.webp', blob: 'a'.repeat(40), bytes: 23 };
  const thumbnail = { path: 'assets/exams/catalog/thumbnail/fixture.bbbbbbbbbbbb.webp', blob: 'b'.repeat(40), bytes: 11 };
  const entries = [detail, thumbnail];
  const origin = {
    schemaVersion: 1,
    provider: 'github-raw',
    repository: 'owner/repository',
    commit: 'c'.repeat(40),
    tree: 'd'.repeat(40),
    sourcePath: 'dist/assets',
    publicPath: '/assets',
    assetCount: entries.length,
    totalBytes: entries.reduce((sum, entry) => sum + entry.bytes, 0),
    assetSetSha256: assetSetDigest(entries),
    currentSnapshot: null,
    legacySnapshots: [],
  };
  const manifest = {
    schemaVersion: 1,
    commit: origin.commit,
    tree: origin.tree,
    files: entries.map((entry) => [entry.path, entry.blob, entry.bytes]),
  };
  const catalog = Array.from({ length: 1800 }, (_, index) => ({
    officialQuestionId: `fixture-${index + 1}`,
    detailImage: detail.path,
    detailImageBytes: detail.bytes,
    thumbnailImage: thumbnail.path,
    thumbnailImageBytes: thumbnail.bytes,
  }));
  fs.writeFileSync(path.join(fixtureRoot, 'config', 'deployment-asset-origin.json'), JSON.stringify(origin));
  fs.writeFileSync(path.join(fixtureRoot, 'config', 'deployment-assets-manifest.json'), JSON.stringify(manifest));
  fs.writeFileSync(path.join(fixtureRoot, 'dist', 'official-exam-catalog.json'), JSON.stringify(catalog));
  fs.writeFileSync(path.join(fixtureRoot, 'vercel.json'), JSON.stringify({
    rewrites: [{
      source: '/assets/:path*',
      destination: `https://raw.githubusercontent.com/${origin.repository}/${origin.commit}/${origin.sourcePath}/:path*`,
    }],
    headers: [{ source: '/assets/:path*', headers: [{ key: 'x-vercel-enable-rewrite-caching', value: '1' }] }],
  }));

  const fixture = validateDeploymentContract(fixtureRoot);
  assert.equal(fixture.index.size, 2);
  assert(assetExists(fixtureRoot, path.join('dist', detail.path)), 'manifest-backed detail must resolve without a local file');
  assert(assetExists(fixtureRoot, path.join('dist', thumbnail.path)), 'manifest-backed thumbnail must resolve without a local file');
  assert(!assetExists(fixtureRoot, path.join('dist', 'assets', 'missing.webp')), 'unknown external asset must not resolve');
  assert.equal(validatePinnedSnapshot(fixtureRoot).available, false, 'fixture Git snapshot should be unavailable');
} finally {
  fs.rmSync(fixtureRoot, { recursive: true, force: true });
}

console.log('PASS: immutable external deployment assets and manifest-backed builds are safe.');
