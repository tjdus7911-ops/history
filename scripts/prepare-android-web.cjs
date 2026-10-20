const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { buildSync } = require('esbuild');
const { runtimeChoicePayload } = require('./prepare-vercel-output.cjs');

const repoRoot = path.resolve(__dirname, '..');
const sourceRoot = path.join(repoRoot, 'dist');
const outputRoot = path.join(repoRoot, 'android-web');
const sourceAssetRoot = path.join(sourceRoot, 'assets');
const nativeExcludedFiles = new Set([
  'three-preview.html',
  'three-preview-app.js',
  'three-preview-editorial-ui.js',
  'ui-review.html',
  'ui-review-game.html',
  'ui-review-storage.js',
  'ui-review-fixtures.js'
].map((name) => path.join(sourceRoot, name)));
const originConfigPath = path.join(repoRoot, 'config', 'deployment-asset-origin.json');
const runtimeEntry = path.join(repoRoot, 'src', 'capacitor-runtime.js');

assert(fs.existsSync(path.join(sourceRoot, 'index.html')), 'Run the web build before preparing Android assets.');
assert(fs.existsSync(originConfigPath), 'Missing immutable deployment asset origin config.');
assert(outputRoot.startsWith(repoRoot + path.sep), 'Android web output must stay inside the repository.');

const origin = JSON.parse(fs.readFileSync(originConfigPath, 'utf8'));
assert.equal(origin.provider, 'github-raw');
assert.match(origin.repository, /^[\w.-]+\/[\w.-]+$/);
assert.match(origin.commit, /^[0-9a-f]{40}$/);
assert.equal(origin.sourcePath, 'dist/assets');

const remoteAssetBase = `https://raw.githubusercontent.com/${origin.repository}/${origin.commit}/${origin.sourcePath}`;
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.svg', '.webmanifest', '.txt']);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function rewriteRuntimeAssetPaths(source) {
  return source
    .replace(/(["'`(=,:;\s])\/assets\//g, `$1${remoteAssetBase}/`)
    .replace(/(["'`(=,:;\s])assets\//g, `$1${remoteAssetBase}/`);
}

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.cpSync(sourceRoot, outputRoot, {
  recursive: true,
  // The complete media library is published separately as an immutable,
  // pinned snapshot. Never duplicate a developer's optional 1+ GB authoring
  // checkout in the native bundle; runtime references are rewritten below.
  filter(source) {
    return !nativeExcludedFiles.has(source)
      && source !== sourceAssetRoot
      && !source.startsWith(sourceAssetRoot + path.sep);
  }
});
assert(!fs.existsSync(path.join(outputRoot, 'assets')), 'Remote media must not be copied into the Android bundle.');
for (const file of nativeExcludedFiles) {
  assert(!fs.existsSync(path.join(outputRoot, path.basename(file))), `${path.basename(file)} must not ship in Android.`);
}

// Match the learner-facing Vercel payload. The canonical QA/source fields stay
// in the repository, while the WebView receives only the runtime explanations.
const explanationPath = path.join(outputRoot, 'official-exam-explanations.json');
const explanationSourceBytes = fs.statSync(explanationPath).size;
const explanationPayload = JSON.parse(fs.readFileSync(explanationPath, 'utf8'));
const explanationSummaries = JSON.parse(fs.readFileSync(path.join(repoRoot, 'config', 'official-choice-summary-corrections.json'), 'utf8'));
const runtimeExplanations = JSON.stringify(runtimeChoicePayload(explanationPayload, explanationSummaries));
fs.writeFileSync(explanationPath, runtimeExplanations);
const explanationPackagedBytes = fs.statSync(explanationPath).size;
assert(explanationPackagedBytes < explanationSourceBytes, 'Android explanation payload was not compacted.');

let rewrittenFiles = 0;
let rewrittenReferences = 0;
for (const file of walk(outputRoot)) {
  if (!textExtensions.has(path.extname(file).toLowerCase())) continue;
  const before = fs.readFileSync(file, 'utf8');
  const after = rewriteRuntimeAssetPaths(before);
  if (after === before) continue;
  rewrittenFiles += 1;
  rewrittenReferences += (after.match(new RegExp(remoteAssetBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
    - (before.match(new RegExp(remoteAssetBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  fs.writeFileSync(file, after);
}

const nativeIndexPath = path.join(outputRoot, 'index.html');
let nativeIndex = fs.readFileSync(nativeIndexPath, 'utf8');
nativeIndex = nativeIndex
  .replace('<head>', '<head>\n  <meta name="capacitor-native" content="true">')
  .replace('href="/manifest.webmanifest"', 'href="manifest.webmanifest"')
  .replace('href="/icons/', 'href="icons/')
  .replace(/\s*<script src="pwa\.js"><\/script>/, '\n  <script src="capacitor-runtime.js"></script>');
assert(nativeIndex.includes('<script src="capacitor-runtime.js"></script>'), 'Native runtime injection failed.');
assert(!nativeIndex.includes('<script src="pwa.js"></script>'), 'The PWA service worker must not register inside the native app.');
fs.writeFileSync(nativeIndexPath, nativeIndex);

buildSync({
  entryPoints: [runtimeEntry],
  outfile: path.join(outputRoot, 'capacitor-runtime.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['chrome120'],
  legalComments: 'none',
  sourcemap: false
});

fs.writeFileSync(path.join(outputRoot, 'android-build-info.json'), JSON.stringify({
  schemaVersion: 1,
  uiRelease: '2026-10-20-menu-design-qa',
  uiFiles: Object.fromEntries(['rev7-layouts.js','jokbo-ui.js','jokbo.css','story-mobile-qa.css','app-navigation.css'].map(name=>[name,crypto.createHash('sha256').update(fs.readFileSync(path.join(outputRoot,name))).digest('hex')])),
  sourceRevision: process.env.HISTORY_SOURCE_REVISION || null,
  webSource: 'dist',
  remoteAssetBase,
  assetSnapshot: {
    commit: origin.commit,
    assetCount: origin.assetCount,
    totalBytes: origin.totalBytes,
    assetSetSha256: origin.assetSetSha256
  },
  serviceWorkerEnabled: false,
  rewrittenFiles,
  rewrittenReferences,
  officialExplanations: {
    sourceBytes: explanationSourceBytes,
    packagedBytes: explanationPackagedBytes
  }
}, null, 2) + '\n');

console.log(`Prepared Android web bundle (${rewrittenFiles} files, ${rewrittenReferences} asset references -> immutable remote snapshot).`);
