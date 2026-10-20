const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  DEVELOPMENT_PREVIEW_FILES,
  removeDevelopmentPreviews,
} = require('../scripts/prepare-vercel-output.cjs');

const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'history-production-entrypoints-'));
try {
  for (const name of DEVELOPMENT_PREVIEW_FILES) fs.writeFileSync(path.join(temporaryRoot, name), 'development only');
  fs.writeFileSync(path.join(temporaryRoot, 'index.html'), 'production');
  removeDevelopmentPreviews(temporaryRoot);
  for (const name of DEVELOPMENT_PREVIEW_FILES) {
    assert(!fs.existsSync(path.join(temporaryRoot, name)), `${name} must be removed from production output.`);
  }
  assert.equal(fs.readFileSync(path.join(temporaryRoot, 'index.html'), 'utf8'), 'production');
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}

console.log('PASS: development-only story entrypoints are excluded from Vercel and Android production bundles.');
