import { colorName, validHex } from './looks-data.js';

// All garment paths are original vector artwork. Each garment inherits a CSS color.
export function outfitSVG(colors, { interactive = false, className = '' } = {}) {
  const safe = Object.fromEntries(Object.entries(colors).map(([part, hex]) => [part, validHex(hex) ? hex : '#F7F4EC']));
  const attrs = part => interactive ? `data-garment="${part}" role="button" tabindex="0" aria-label="Edit ${part}"` : '';
  return `<svg class="outfit-svg ${className}" viewBox="0 0 300 500" xmlns="http://www.w3.org/2000/svg" ${interactive ? 'role="group" aria-label="Outfit preview. Select a garment to edit its color."' : `role="img" aria-label="${colorName(safe.top)} top, ${colorName(safe.trousers)} trousers, ${colorName(safe.shoes)} shoes"`} style="--top:${safe.top};--trousers:${safe.trousers};--shoes:${safe.shoes}">
  <ellipse cx="150" cy="475" rx="104" ry="9" fill="#20382D" opacity=".05"/>
  <g ${attrs('top')} class="garment garment-top" fill="var(--top)" stroke="#29372F" stroke-opacity=".22" stroke-width="1.2" stroke-linejoin="round">
    <path d="M112 28 90 34 45 69 68 113 94 98 91 193 Q149 204 209 193 L206 98 232 113 255 69 210 34 188 28 Q172 39 150 39 Q128 39 112 28Z"/>
    <path d="M112 28 Q120 63 150 64 Q180 63 188 28 Q172 39 150 39 Q128 39 112 28Z" fill="#fff" fill-opacity=".17"/>
    <path d="M119 32 Q126 56 150 56 Q174 56 181 32M94 98 97 71M206 98 203 71M55 81 74 116M245 81 226 116M92 184 Q150 194 208 184" fill="none"/>
    <path d="M99 78 111 90 105 177M201 78 191 91 197 177" fill="none" stroke-opacity=".08" stroke-width="3"/>
  </g>
  <g ${attrs('trousers')} class="garment garment-trousers" fill="var(--trousers)" stroke="#29372F" stroke-opacity=".25" stroke-width="1.2" stroke-linejoin="round">
    <path d="M99 219 Q151 214 201 219 L210 424 Q188 431 161 425 L150 286 139 425 Q112 431 90 424Z"/>
    <path d="M99 230 Q150 225 202 230M150 220 150 271 157 278M113 231 Q113 252 97 261M189 231 Q189 252 205 261M120 274 113 416M180 274 187 416M92 414 Q115 420 140 414M160 414 Q184 420 208 414" fill="none"/>
    <path d="M105 220 105 231M129 218 129 229M173 218 173 229M196 220 196 231" fill="none" stroke-width="3"/>
    <circle cx="151" cy="226" r="2" fill="#eee" fill-opacity=".4" stroke="none"/>
  </g>
  <g ${attrs('shoes')} class="garment garment-shoes" fill="var(--shoes)" stroke="#29372F" stroke-opacity=".28" stroke-width="1.2" stroke-linejoin="round">
    <path d="M91 443 123 442 135 456 137 472 61 472 Q56 461 67 457 L88 451Z"/>
    <path d="M177 442 209 443 212 451 233 457 Q244 461 239 472 L163 472 165 456Z"/>
    <path d="M60 466 136 466M164 466 240 466M89 449 111 452M85 453 115 456M81 457 118 460M211 449 189 452M215 453 185 456M219 457 182 460" fill="none"/>
    <path d="M94 441 121 441 124 448 92 448ZM179 441 206 441 208 448 176 448Z" fill="#29372F" fill-opacity=".11"/>
  </g></svg>`;
}
export function swatchStrip(colors) {
  return `<div class="swatch-strip" aria-label="Outfit colors">${Object.entries(colors).map(([part, hex]) => `<span style="--swatch:${hex}" title="${part}: ${colorName(hex)} (${hex})"><i></i><span>${colorName(hex)}</span></span>`).join('')}</div>`;
}
