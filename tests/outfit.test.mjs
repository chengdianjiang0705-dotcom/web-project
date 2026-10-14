import test from 'node:test';
import assert from 'node:assert/strict';
import { COLORS, LOOKS, DEFAULT_OUTFIT, resolveOutfit, validHex, randomOutfit } from '../looks-data.js';
import { outfitSVG } from '../outfit.js';

test('all six gallery presets resolve to editable palette colors', () => {
  assert.equal(LOOKS.length, 6);
  assert.equal(new Set(LOOKS.map(look => look.id)).size, 6);
  for (const look of LOOKS) {
    assert.deepEqual(resolveOutfit(`?look=${look.id}`).outfit, look.colors);
    for (const hex of Object.values(look.colors)) assert.ok(COLORS.some(color => color.hex === hex));
  }
});
test('unknown presets and malformed shared colors fall back safely', () => {
  assert.deepEqual(resolveOutfit('?look=unknown&top=red&shoes=%3Cscript%3E').outfit, DEFAULT_OUTFIT);
  assert.equal(validHex('#fff'), false);
  assert.equal(validHex('#aabbcc'), true);
  assert.equal(validHex(null), false);
});
test('a share link preserves each custom color', () => {
  const shared = { top: '#123456', trousers: '#AABBCC', shoes: '#F1E2D3' };
  assert.deepEqual(resolveOutfit(`?${new URLSearchParams(shared)}`).outfit, shared);
});
test('randomization produces a palette and changes an identical random draw', () => {
  const previous = { top: COLORS[0].hex, trousers: COLORS[0].hex, shoes: COLORS[0].hex };
  const result = randomOutfit(previous, () => 0);
  assert.notDeepEqual(result, previous);
  for (const hex of Object.values(result)) assert.ok(COLORS.some(color => color.hex === hex));
});
test('artwork never interpolates untrusted color values into the SVG', () => {
  const svg = outfitSVG({ ...DEFAULT_OUTFIT, top: '"><script>alert(1)</script>' });
  assert.ok(!svg.includes('<script>'));
  assert.ok(svg.includes('--top:#F7F4EC'));
});
