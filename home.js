import { LOOKS, PARTS, colorName } from './looks-data.js';
import { outfitSVG } from './outfit.js';
import { lookCard } from './gallery.js';

const featured = document.querySelector('[data-featured-looks]');
if (featured) featured.innerHTML = LOOKS.slice(0, 3).map(lookCard).join('');
document.querySelectorAll('[data-guide-look]').forEach(element => {
  const look = LOOKS.find(item => item.id === element.dataset.guideLook);
  element.innerHTML = `${outfitSVG(look.colors)}<div class="guide-color-story">${Object.entries(look.colors).map(([part, hex]) => `<div class="story-color"><i style="--swatch:${hex}" aria-hidden="true"></i><span>${colorName(hex)}<small>${PARTS[part]} · ${hex}</small></span></div>`).join('')}</div><div class="guide-art-caption">${look.name.toUpperCase()} / A STARTING POINT, NOT A RULE</div>`;
});
