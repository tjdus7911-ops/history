const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const guide = 'docs/CHARACTER_ART_STYLE_GUIDE.md';
assert(fs.existsSync(guide), `missing character style guide: ${guide}`);

const expressionFiles = {
  neutral: 'dist/assets/editorial/protagonists/joseon-neutral.webp',
  confused: 'dist/assets/joseon/protagonist/confused.webp',
  surprised: 'dist/assets/joseon/protagonist/surprised.webp',
  smile: 'dist/assets/joseon/protagonist/smile.webp',
  laugh: 'dist/assets/joseon/protagonist/laugh.webp',
  worried: 'dist/assets/joseon/protagonist/worried.webp',
  sad: 'dist/assets/joseon/protagonist/sad.webp',
  crying: 'dist/assets/joseon/protagonist/crying.webp',
  angry: 'dist/assets/joseon/protagonist/angry.webp',
  determined: 'dist/assets/joseon/protagonist/determined.webp',
  fear: 'dist/assets/joseon/protagonist/fear.webp',
  shock: 'dist/assets/joseon/protagonist/shock.webp',
  thinking: 'dist/assets/joseon/protagonist/thinking.webp',
  tired: 'dist/assets/joseon/protagonist/tired.webp',
  relieved: 'dist/assets/joseon/protagonist/relieved.webp'
};

const npcFiles = [
  'dist/assets/joseon/npcs/minjun.webp',
  'dist/assets/joseon/npcs/minjun-elder.webp',
  'dist/assets/joseon/npcs/scholar.webp',
  'dist/assets/joseon/npcs/soldier.webp',
  'dist/assets/joseon/npcs/naval.webp',
  'dist/assets/joseon/npcs/woman.webp'
];

function assertWebp(file) {
  assert(fs.existsSync(file), `missing character asset: ${file}`);
  const buffer = fs.readFileSync(file);
  assert(buffer.length > 250_000, `high-DPI character asset is unexpectedly small: ${file}`);
  assert.equal(buffer.subarray(0, 4).toString(), 'RIFF', `${file} is not a RIFF WebP`);
  assert.equal(buffer.subarray(8, 12).toString(), 'WEBP', `${file} is not WebP`);
  let dimensions = null;
  for (let offset = 12; offset + 8 <= buffer.length;) {
    const chunk = buffer.subarray(offset, offset + 4).toString();
    const size = buffer.readUInt32LE(offset + 4);
    if (chunk === 'VP8X') {
      dimensions = {
        width: buffer.readUIntLE(offset + 12, 3) + 1,
        height: buffer.readUIntLE(offset + 15, 3) + 1,
        hasAlpha: Boolean(buffer[offset + 8] & 0x10)
      };
      break;
    }
    offset += 8 + size + (size % 2);
  }
  assert.deepEqual(dimensions, { width: 1280, height: 1920, hasAlpha: true }, `${file} must keep a transparent 1280x1920 high-DPI canvas`);
  assert(buffer.length * 8 / (dimensions.width * dimensions.height) >= 0.8, `${file} WebP bitrate is too low for character line art`);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

const finalFiles = [...Object.values(expressionFiles), ...npcFiles];
const hashes = finalFiles.map(assertWebp);
assert.equal(new Set(hashes).size, hashes.length, 'duplicate Joseon character assets detected');

const expectedExpressionFiles = new Set(Object.values(expressionFiles).slice(1).map(file => path.basename(file)));
const actualExpressionFiles = fs.readdirSync('dist/assets/joseon/protagonist');
assert.deepEqual(new Set(actualExpressionFiles), expectedExpressionFiles, 'unexpected or missing Joseon expression asset');
assert(!actualExpressionFiles.includes('neutral.webp'), 'neutral must use the canonical editorial protagonist asset');

const expectedNpcFiles = new Set(npcFiles.map(file => path.basename(file)));
const actualNpcFiles = fs.readdirSync('dist/assets/joseon/npcs');
assert.deepEqual(new Set(actualNpcFiles), expectedNpcFiles, 'unexpected or missing Joseon NPC asset');

const textExtensions = new Set(['.js', '.cjs', '.mjs', '.html', '.css', '.json', '.webmanifest']);
const referencedAssets = new Set();
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (textExtensions.has(path.extname(entry.name))) {
      const source = fs.readFileSync(target, 'utf8');
      const pattern = /(?:^|["'`(=:\s])\/?((?:\.\/)?assets\/[A-Za-z0-9_.\-/]+\.(?:png|webp|jpg|jpeg|svg|gif))/gi;
      for (const match of source.matchAll(pattern)) referencedAssets.add(match[1].replace(/^\.\//, ''));
    }
  }
}
walk('dist');
for (const asset of referencedAssets) {
  assert(fs.existsSync(path.join('dist', asset)), `broken asset reference: ${asset}`);
}

console.log(`PASS: character art contract (${Object.keys(expressionFiles).length} Joseon expressions, ${npcFiles.length} NPCs, ${referencedAssets.size} asset references).`);
