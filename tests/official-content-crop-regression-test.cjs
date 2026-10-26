'use strict';

const assert = require('node:assert');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { assetExists, externalAssetInfo } = require('../scripts/prepare-vercel-output.cjs');

const root = path.resolve(__dirname, '..');
const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const crops = readJson('docs/official-exams/question-content-crops.json');
const media = readJson('docs/official-exams/question-choice-media.json');
const audit = readJson('docs/official-exams/content-crop-audit-2026-10-14.json');

assert.equal(crops.canonicalQuestionCount, 1850);
assert.equal(crops.detectedQuestionCount, 1850);
assert.equal(crops.failureCount, 0);
assert.equal(crops.records.length, 1850);
assert.equal(media.records.length, 1850);
assert.equal(audit.changedCandidateVisualReview.reviewedQuestionCount, 105);
assert.equal(audit.changedCandidateVisualReview.remainingIssueCount, 0);

const cropById = new Map(crops.records.map(record => [record.officialQuestionId, record]));
const mediaById = new Map(media.records.map(record => [record.officialQuestionId, record]));
const targetCrop = cropById.get('official-65-advanced-12');
const targetMedia = mediaById.get('official-65-advanced-12');
assert(targetCrop);
assert(targetMedia);
assert.equal(targetCrop.contentCropY, 821);
assert.equal(targetCrop.choiceStartY, 862.2);
assert.equal(targetCrop.markerCount, 5);
assert.equal(targetMedia.presentation, 'text');
assert.equal(targetMedia.contentImage.path, 'assets/exams/catalog/content/official-65-advanced-12-content.0cff75445baf.webp');
assert.deepEqual([targetMedia.contentImage.width, targetMedia.contentImage.height], [1103, 821]);
assert.equal(targetMedia.choiceMedia.length, 0);

const targetFile = path.join(root, 'dist', targetMedia.contentImage.path);
assert(assetExists(root, path.join('dist', targetMedia.contentImage.path)), '65회 심화 12번 교정 본문 이미지가 배포 스냅샷에 누락됨');
const deployedAsset = externalAssetInfo(root, path.join('dist', targetMedia.contentImage.path));
assert.equal(deployedAsset.bytes, targetMedia.contentImage.bytes);
if (fs.existsSync(targetFile)) {
  const sha256 = crypto.createHash('sha256').update(fs.readFileSync(targetFile)).digest('hex');
  assert.equal(sha256, targetMedia.contentImage.sha256);
  assert.equal(fs.statSync(targetFile).size, targetMedia.contentImage.bytes);
}

for (const record of crops.records) {
  assert(record.contentCropY > 0 && record.contentCropY <= record.imageHeight, `${record.officialQuestionId}: invalid crop boundary`);
  assert.equal(record.sourceImageSha256.length, 64, `${record.officialQuestionId}: invalid source hash`);
}

console.log('PASS: 1,800 crop records and the 65회 심화 12번 1103x821 regression asset are verified.');
