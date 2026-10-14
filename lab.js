import { COLORS, PARTS, DEFAULT_OUTFIT, colorName, validHex, resolveOutfit, randomOutfit } from './looks-data.js';
import { outfitSVG } from './outfit.js';

let { outfit, name: lookName } = resolveOutfit(window.location.search);
let selectedPart = 'top';
const preview = document.querySelector('#outfit-preview');
const status = document.querySelector('#lab-status');
preview.innerHTML = outfitSVG(outfit, { interactive: true });
const svg = preview.querySelector('svg');
document.querySelector('#color-options').innerHTML = COLORS.map(color => {
  const dark = ['#30343B', '#354B63', '#765A47', '#242625', '#B9654D'].includes(color.hex);
  return `<button class="color-option" type="button" data-color="${color.hex}" style="--swatch:${color.hex};--check-color:${dark ? '#FFFFFF' : '#263E34'}" aria-label="${color.name}, ${color.zh}, ${color.hex}" aria-pressed="false" title="${color.name} · ${color.zh} · ${color.hex}"><span class="color-dot" aria-hidden="true"></span><span class="color-name">${color.name}</span></button>`;
}).join('');

function announce(message) { status.textContent = message; }
function render() {
  for (const part of Object.keys(PARTS)) {
    svg.style.setProperty(`--${part}`, outfit[part]);
    const garment = svg.querySelector(`[data-garment="${part}"]`);
    garment.classList.toggle('is-selected', part === selectedPart);
    garment.setAttribute('aria-pressed', String(part === selectedPart));
    garment.setAttribute('aria-label', `Edit ${PARTS[part]}: ${colorName(outfit[part])}`);
  }
  document.querySelectorAll('[data-part]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.part === selectedPart)));
  document.querySelectorAll('[data-color]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.color.toLowerCase() === outfit[selectedPart].toLowerCase())));
  document.querySelector('#editing-label').textContent = `Editing: ${PARTS[selectedPart]}`;
  document.querySelector('#custom-color').value = outfit[selectedPart];
  document.querySelector('#custom-hex').textContent = outfit[selectedPart].toUpperCase();
  document.querySelector('#current-palette').innerHTML = Object.entries(PARTS).map(([part, label]) => `<div class="current-palette-part"><i style="--swatch:${outfit[part]}" aria-hidden="true"></i><span><small>${label}</small><strong>${colorName(outfit[part])}</strong><small>${outfit[part].toUpperCase()}</small></span></div>`).join('');
}
function selectPart(part) {
  if (!Object.hasOwn(PARTS, part)) return;
  selectedPart = part;
  render();
  announce(`Editing ${PARTS[part].toLowerCase()}. Current color: ${colorName(outfit[part])}.`);
}
function setColor(hex) {
  if (!validHex(hex)) return;
  outfit[selectedPart] = hex.toUpperCase();
  lookName = 'Your own combination';
  render();
  announce(`${PARTS[selectedPart]} changed to ${colorName(hex)}.`);
}
document.querySelectorAll('[data-part]').forEach(button => button.addEventListener('click', () => selectPart(button.dataset.part)));
document.querySelectorAll('[data-color]').forEach(button => button.addEventListener('click', () => setColor(button.dataset.color)));
document.querySelectorAll('[data-garment]').forEach(garment => {
  garment.addEventListener('click', () => selectPart(garment.dataset.garment));
  garment.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectPart(garment.dataset.garment); }
  });
});
document.querySelector('#custom-color').addEventListener('input', event => setColor(event.target.value));
document.querySelector('#randomize').addEventListener('click', () => {
  outfit = randomOutfit(outfit);
  lookName = 'A little happy accident';
  render();
  announce(`A random combination to explore: ${colorName(outfit.top)} top, ${colorName(outfit.trousers)} trousers, ${colorName(outfit.shoes)} shoes.`);
});
document.querySelector('#reset').addEventListener('click', () => {
  outfit = { ...DEFAULT_OUTFIT };
  selectedPart = 'top';
  lookName = 'Your everyday canvas';
  // Remove stale preset/share parameters so refreshing preserves the fresh start.
  window.history.replaceState(null, '', window.location.pathname);
  render();
  announce('A fresh start: Light blue top, Charcoal trousers, Off-white shoes.');
});

async function copy(text, success) {
  try {
    if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
    else {
      const temporary = document.createElement('textarea');
      temporary.value = text;
      temporary.style.cssText = 'position:fixed;top:0;left:-9999px';
      document.body.append(temporary);
      temporary.select();
      const copied = document.execCommand('copy');
      temporary.remove();
      if (!copied) throw new Error('Clipboard unavailable');
    }
    announce(success);
  } catch { announce('Clipboard unavailable. Your color names and HEX codes are shown above; you can copy them manually.'); }
}
document.querySelector('#copy-palette').addEventListener('click', () => copy(`Outfit Color Lab\n${Object.entries(PARTS).map(([part, label]) => `${label}: ${colorName(outfit[part])} (${outfit[part]})`).join('\n')}`, 'Palette copied. A little inspiration, ready to take with you.'));
document.querySelector('#copy-link').addEventListener('click', () => {
  const link = new URL('lab.html', window.location.href);
  for (const part of Object.keys(PARTS)) link.searchParams.set(part, outfit[part]);
  copy(link.href, 'Look link copied. Anyone with the link can open this exact palette.');
});
document.querySelector('#download-look').addEventListener('click', () => {
  const illustration = outfitSVG(outfit).replace(/var\(--(top|trousers|shoes)\)/g, (_, part) => outfit[part]);
  const file = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${illustration}`], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'outfit-color-lab.svg';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  announce('Your illustrated outfit has been saved as an SVG.');
});
render();
if (window.location.search) announce(`${lookName} loaded. Make it your own.`);
