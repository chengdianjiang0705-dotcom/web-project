import { LOOKS } from './looks-data.js';
import { outfitSVG, swatchStrip } from './outfit.js';

export function lookCard(look, index) {
  return `<article class="look-card" data-category="${look.category}"><a class="look-art" style="--card-bg:${look.background}" href="lab.html?look=${look.id}" aria-label="Try ${look.name}"><span class="look-index">LOOK / ${String(index + 1).padStart(2, '0')}</span><span class="look-category">${look.category === 'neutral' ? 'Neutral notes' : look.category === 'statement' ? 'Color story' : look.category + ' notes'}</span>${outfitSVG(look.colors)}</a><h3>${look.name}</h3><div class="look-cn" lang="zh-CN">${look.zh}</div>${swatchStrip(look.colors)}<p class="look-description">${look.description}</p><a href="lab.html?look=${look.id}" class="text-link">Try this look <span aria-hidden="true">↗</span></a></article>`;
}
const gallery = document.querySelector('#gallery');
if (gallery) {
  gallery.innerHTML = LOOKS.map(lookCard).join('');
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      const filter = button.dataset.filter;
      let visible = 0;
      gallery.querySelectorAll('.look-card').forEach(card => {
        card.hidden = filter !== 'all' && card.dataset.category !== filter;
        if (!card.hidden) visible++;
      });
      document.querySelector('#gallery-count').textContent = `${visible} ${visible === 1 ? 'look' : 'looks'} to explore`;
    });
  });
}
