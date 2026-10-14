export const COLORS = Object.freeze([
  { name: 'Off-white', zh: '米白', hex: '#F7F4EC' },
  { name: 'Charcoal', zh: '深灰', hex: '#30343B' },
  { name: 'Gray', zh: '灰色', hex: '#92989E' },
  { name: 'Light blue', zh: '浅蓝', hex: '#7AA5C6' },
  { name: 'Olive', zh: '橄榄绿', hex: '#78866B' },
  { name: 'Beige', zh: '米色', hex: '#C7AD8A' },
  { name: 'Navy', zh: '藏蓝', hex: '#354B63' },
  { name: 'Terracotta', zh: '砖红', hex: '#B9654D' },
  { name: 'Cocoa', zh: '可可棕', hex: '#765A47' },
  { name: 'Black', zh: '黑色', hex: '#242625' }
]);
export const DEFAULT_OUTFIT = Object.freeze({ top: '#7AA5C6', trousers: '#30343B', shoes: '#F7F4EC' });
export const PARTS = Object.freeze({ top: 'Top', trousers: 'Trousers', shoes: 'Shoes' });
export const LOOKS = Object.freeze([
  { id: 'campus-morning', name: 'Campus Morning', zh: '校园清晨', category: 'blue', tag: 'A fresh start', colors: { ...DEFAULT_OUTFIT }, description: 'A soft blue top, grounded by charcoal trousers. Off-white shoes keep the finish light.', background: '#E8EDF0' },
  { id: 'warm-neutrals', name: 'Warm Neutrals', zh: '温暖中性色', category: 'neutral', tag: 'Quietly put together', colors: { top: '#C7AD8A', trousers: '#30343B', shoes: '#F7F4EC' }, description: 'Beige and charcoal bring warm and cool neutrals together, with a soft off-white finish.', background: '#EDE8DF' },
  { id: 'olive-weekend', name: 'Olive Weekend', zh: '橄榄绿周末', category: 'green', tag: 'Take the scenic route', colors: { top: '#78866B', trousers: '#C7AD8A', shoes: '#F7F4EC' }, description: 'Earthy olive meets easy beige. A relaxed combination for a slower kind of day.', background: '#E7EBE1' },
  { id: 'simple-contrast', name: 'Simple Contrast', zh: '简单对比', category: 'neutral', tag: 'Less, but considered', colors: { top: '#F7F4EC', trousers: '#30343B', shoes: '#F7F4EC' }, description: 'An off-white top and dark trousers create a clear light-dark contrast. Simple feels good.', background: '#EAE9E5' },
  { id: 'blue-hour', name: 'Blue Hour', zh: '蓝色时刻', category: 'blue', tag: 'Stay in your element', colors: { top: '#7AA5C6', trousers: '#354B63', shoes: '#92989E' }, description: 'Two depths of blue create a tonal look, with gray shoes to gently break up the color.', background: '#E3EAF0' },
  { id: 'a-little-rust', name: 'A Little Rust', zh: '一点砖红', category: 'statement', tag: 'One color, a little louder', colors: { top: '#B9654D', trousers: '#30343B', shoes: '#F7F4EC' }, description: 'Let a terracotta top be the focal point. Charcoal and off-white give it room to stand out.', background: '#F0E5DE' }
]);
export function colorName(hex) { return COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase())?.name || `Custom ${hex.toUpperCase()}`; }
export function validHex(value) { return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value); }
export function resolveOutfit(search = '') {
  const params = new URLSearchParams(search);
  const look = LOOKS.find(l => l.id === params.get('look'));
  const outfit = { ...(look?.colors || DEFAULT_OUTFIT) };
  let custom = false;
  for (const part of Object.keys(PARTS)) {
    if (validHex(params.get(part))) { outfit[part] = params.get(part).toUpperCase(); custom = true; }
  }
  return { outfit, name: custom ? 'Your shared palette' : look?.name || 'Your everyday canvas' };
}
export function randomOutfit(previous, random = Math.random) {
  const result = Object.fromEntries(Object.keys(PARTS).map(part => [part, COLORS[Math.min(COLORS.length - 1, Math.floor(random() * COLORS.length))].hex]));
  if (Object.keys(PARTS).every(part => result[part] === previous[part])) {
    result.top = COLORS[(COLORS.findIndex(c => c.hex === result.top) + 1) % COLORS.length].hex;
  }
  return result;
}
