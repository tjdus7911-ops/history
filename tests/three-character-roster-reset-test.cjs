const assert = require('node:assert/strict');
const art = require('../dist/three-complete-art.json');
const legacyArt = require('../dist/three-art-manifest.json');
const {load} = require('./proto-revision-harness.cjs');

assert.equal(art.status, 'protagonist-only-roster-reset');
assert.deepEqual(art.characters, {});
assert.deepEqual(art.sceneCharacters, {});
assert.deepEqual(art.recordVoices, {});
assert.deepEqual(art.relationships, []);
assert.deepEqual(art.portraitAtlases, {});
assert.equal(art.protagonist.identityId, 'three-seoa');
assert.equal(art.protagonist.name, '서아');
assert.equal(art.protagonist.files.length, 12);
assert(Object.keys(art.approvedGeometry.files).every(src =>
  src.includes('/seoa-') || src.endsWith('/three-player-modern.png')));

assert.equal(legacyArt.status, 'protagonist-only-roster-reset');
assert.deepEqual(legacyArt.characters, {});
assert.equal(legacyArt.protagonist.characterId, 'three_v2_seoa');

const game = load();
const registeredThreeIds = game.copy("Object.keys(CHARACTERS).filter(id=>id.startsWith('three_'))");
assert.deepEqual(registeredThreeIds.sort(), ['three_modern', 'three_player', 'three_v3_seoa']);
assert.equal(game.run('THREE_STORY_RUNTIME.people.size'), 0);
assert.equal(game.run('THREE_STAGING.audit.variantCount'), 2);
assert(!game.run("Object.keys(PORTRAITS).some(id=>/^three_(?:companion|goguryeo|baekje|silla|gaya|balhae|cheonghae)_/.test(id))"));

console.log('PASS: Three Kingdoms runtime roster contains Seoa only; 236 previous identities are retired.');
