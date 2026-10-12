const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DIST = path.resolve('dist');
const IMAGE_ROOT = path.join(DIST, 'assets', 'exams', 'catalog');
const DETAIL_ROOT = path.join(IMAGE_ROOT, 'detail');
const THUMBNAIL_ROOT = path.join(IMAGE_ROOT, 'thumbnail');
const REVISION = 'official-exam-hq-v2-240dpi';
const FLAT_IMAGE_PATTERN = /assets\/exams\/catalog\/(\d+-(?:advanced|basic)-\d{2}\.webp)/g;
const GENERATED_CATALOG_NAMES = new Set([
  'official-exam-catalog.js',
  'official-exam-catalog.json',
  'official-exam-inventory.json',
]);

function listFiles(root, predicate = () => true) {
  return fs.readdirSync(root, { withFileTypes: true })
    .filter(entry => entry.isFile() && predicate(entry.name))
    .map(entry => path.join(root, entry.name));
}

function walkFiles(root) {
  const result = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const filePath = path.join(root, entry.name);
    if (entry.isDirectory()) result.push(...walkFiles(filePath));
    else if (entry.isFile()) result.push(filePath);
  }
  return result;
}

function webpDimensions(buffer) {
  assert.equal(buffer.toString('ascii', 0, 4), 'RIFF');
  assert.equal(buffer.toString('ascii', 8, 12), 'WEBP');
  for (let offset = 12; offset + 8 <= buffer.length;) {
    const type = buffer.toString('ascii', offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (type === 'VP8X') {
      return {
        width: 1 + buffer.readUIntLE(data + 4, 3),
        height: 1 + buffer.readUIntLE(data + 7, 3),
      };
    }
    if (type === 'VP8 ') {
      assert.equal(buffer[data + 3], 0x9d);
      assert.equal(buffer[data + 4], 0x01);
      assert.equal(buffer[data + 5], 0x2a);
      return {
        width: buffer.readUInt16LE(data + 6) & 0x3fff,
        height: buffer.readUInt16LE(data + 8) & 0x3fff,
      };
    }
    if (type === 'VP8L') {
      assert.equal(buffer[data], 0x2f);
      const bits = buffer.readUInt32LE(data + 1);
      return {
        width: 1 + (bits & 0x3fff),
        height: 1 + ((bits >>> 14) & 0x3fff),
      };
    }
    offset = data + size + (size & 1);
  }
  throw new Error('No WebP image chunk');
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function assetPath(assetUrl) {
  return path.join(DIST, ...assetUrl.split('/'));
}

function liveFlatReferences() {
  const references = new Set();
  const readableExtensions = new Set(['.js', '.mjs', '.cjs', '.json', '.html', '.css', '.svg', '.xml', '.txt', '.webmanifest']);
  for (const filePath of walkFiles(DIST)) {
    if (GENERATED_CATALOG_NAMES.has(path.basename(filePath))) continue;
    if (!readableExtensions.has(path.extname(filePath).toLowerCase())) continue;
    const text = fs.readFileSync(filePath, 'utf8');
    for (const match of text.matchAll(FLAT_IMAGE_PATTERN)) references.add(match[1]);
  }
  return references;
}

const catalog = JSON.parse(fs.readFileSync(path.join(DIST, 'official-exam-catalog.json'), 'utf8'));
const inventory = JSON.parse(fs.readFileSync(path.join(DIST, 'official-exam-inventory.json'), 'utf8'));
const jsContext = { globalThis: {} };
vm.runInNewContext(fs.readFileSync(path.join(DIST, 'official-exam-catalog.js'), 'utf8'), jsContext);
const jsCatalog = jsContext.globalThis.OFFICIAL_EXAM_SOURCE_RECORDS;

assert.equal(catalog.length, 1800, 'canonical question count');
assert.equal(inventory.canonicalQuestionCount, 1800, 'inventory question count');
assert.equal(inventory.examEditionCount, 36, 'inventory edition count');
assert.equal(jsCatalog.length, catalog.length, 'JS/JSON catalog count');
assert.deepEqual(
  JSON.parse(JSON.stringify(jsCatalog)),
  catalog,
  'JS/JSON catalogs must contain the same records',
);
assert.equal(new Set(catalog.map(item => item.officialQuestionId)).size, 1800, 'question IDs must be unique');

const detailFiles = listFiles(DETAIL_ROOT, name => name.endsWith('.webp'));
const thumbnailFiles = listFiles(THUMBNAIL_ROOT, name => name.endsWith('.webp'));
const flatFiles = listFiles(IMAGE_ROOT, name => /^\d+-(?:advanced|basic)-\d{2}\.webp$/.test(name));
assert.equal(detailFiles.length, 1800, 'detail file count');
assert.equal(thumbnailFiles.length, 1800, 'thumbnail file count');
assert.equal(flatFiles.length, 130, 'live compatibility flat file count');

let detailBytes = 0;
let thumbnailBytes = 0;
const catalogDetailPaths = new Set();
const catalogThumbnailPaths = new Set();
for (const item of catalog) {
  assert.equal(item.imageRevision, REVISION, `${item.officialQuestionId} revision`);
  assert.equal(item.imageFormat, 'webp', `${item.officialQuestionId} format`);
  assert.equal(item.questionImage, item.detailImage, `${item.officialQuestionId} legacy detail alias`);
  assert.equal(item.cropValidation?.status, 'passed', `${item.officialQuestionId} crop validation`);
  assert(item.detailImage.includes(`/detail/${item.officialQuestionId}.`), `${item.officialQuestionId} detail path`);
  assert(item.thumbnailImage.includes(`/thumbnail/${item.officialQuestionId}.`), `${item.officialQuestionId} thumbnail path`);
  catalogDetailPaths.add(item.detailImage);
  catalogThumbnailPaths.add(item.thumbnailImage);

  for (const [kind, imageUrl] of [['detail', item.detailImage], ['thumbnail', item.thumbnailImage]]) {
    const imagePath = assetPath(imageUrl);
    assert(fs.existsSync(imagePath), `${item.officialQuestionId} ${kind} exists`);
    const payload = fs.readFileSync(imagePath);
    const hash = sha256(payload);
    const dimensions = webpDimensions(payload);
    const prefix = kind === 'detail' ? 'detailImage' : 'thumbnailImage';
    assert.equal(hash, item[`${prefix}Sha256`], `${item.officialQuestionId} ${kind} hash`);
    assert.equal(payload.length, item[`${prefix}Bytes`], `${item.officialQuestionId} ${kind} bytes`);
    assert.deepEqual(
      dimensions,
      { width: item[`${prefix}Width`], height: item[`${prefix}Height`] },
      `${item.officialQuestionId} ${kind} dimensions`,
    );
    assert(imageUrl.includes(hash.slice(0, 12)), `${item.officialQuestionId} ${kind} hashed filename`);
    if (kind === 'detail') detailBytes += payload.length;
    else thumbnailBytes += payload.length;
  }
  assert(item.detailImageWidth >= 1000, `${item.officialQuestionId} 240dpi detail width`);
  assert(item.thumbnailImageWidth >= 318 && item.thumbnailImageWidth <= 320,
    `${item.officialQuestionId} thumbnail width`);
  assert(item.thumbnailImageHeight < item.detailImageHeight,
    `${item.officialQuestionId} thumbnail must be downscaled`);
}
assert.equal(catalogDetailPaths.size, 1800, 'unique detail image paths');
assert.equal(catalogThumbnailPaths.size, 1800, 'unique thumbnail image paths');

assert.deepEqual(inventory.imagePipeline, {
  revision: REVISION,
  format: 'webp',
  detectionDpi: 120,
  detailDpi: 240,
  detailQuality: 88,
  thumbnailWidth: 320,
  thumbnailQuality: 68,
  detailImageCount: 1800,
  thumbnailImageCount: 1800,
  detailImageBytes: detailBytes,
  thumbnailImageBytes: thumbnailBytes,
  cropValidationPassedCount: 1800,
}, 'inventory pipeline summary');

for (const id of [
  'official-57-advanced-06',
  'official-57-advanced-07',
  'official-71-basic-04',
  'official-71-basic-05',
]) {
  const item = catalog.find(record => record.officialQuestionId === id);
  assert(item, `${id} record`);
  assert(item.cropValidation.cropHeightRatio >= 0.10, `${id} crop height ratio`);
  assert(item.detailImageHeight >= 300, `${id} non-truncated detail height`);
}

assert.equal(inventory.imageCleanup.performed, true, 'cleanup performed');
assert.equal(inventory.imageCleanup.staleDetailRemoved, 0, 'no stale detail files after finalization');
assert.equal(inventory.imageCleanup.staleThumbnailRemoved, 0, 'no stale thumbnail files after finalization');
const retained = new Set(inventory.imageCleanup.compatibilityFlatRetained);
const actualFlatUrls = new Set(flatFiles.map(filePath =>
  path.relative(DIST, filePath).split(path.sep).join('/')));
assert.deepEqual(retained, actualFlatUrls, 'inventory retained-flat list must match disk');
const liveReferences = liveFlatReferences();
for (const imageUrl of actualFlatUrls) {
  const filename = path.basename(imageUrl);
  assert(liveReferences.has(filename), `${imageUrl} is an unreferenced canonical flat duplicate`);
}
for (const filename of liveReferences) {
  const imageUrl = `assets/exams/catalog/${filename}`;
  assert(actualFlatUrls.has(imageUrl), `${imageUrl} is referenced but missing from disk`);
  assert(fs.existsSync(assetPath(imageUrl)), `${imageUrl} live compatibility reference does not resolve`);
}
for (const removedUrl of inventory.imageCleanup.legacyFlatRemoved) {
  assert(!fs.existsSync(assetPath(removedUrl)), `${removedUrl} cleanup record still exists`);
}

console.log(
  `official image pipeline PASS: ${detailFiles.length} detail (${detailBytes} bytes), ` +
  `${thumbnailFiles.length} thumbnail (${thumbnailBytes} bytes), ` +
  `${flatFiles.length} referenced compatibility flat images`,
);
