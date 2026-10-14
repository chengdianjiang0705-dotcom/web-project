// Optional asset-authoring step. Requires sharp; not needed by the website build.
import { pathToFileURL } from 'node:url';
import { mkdir, copyFile, writeFile, stat, access } from 'node:fs/promises';
import { outfitSVG } from '../outfit.js';
import { LOOKS } from '../looks-data.js';
const { default: sharp } = await import(process.env.SHARP_MODULE ? pathToFileURL(process.env.SHARP_MODULE).href : 'sharp');
await mkdir('docs/design', { recursive: true });
try { await access('docs/design/cover-v1.jpg'); } catch { await copyFile('images/og-image.jpg', 'docs/design/cover-v1.jpg'); }
const outfits = [LOOKS[0], LOOKS[2], LOOKS[5]];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#F8F8F3"/>
${['#78866B','#C7AD8A','#7AA5C6','#B9654D'].map((color,i)=>`<rect x="${66+i%2*16}" y="${58+Math.floor(i/2)*16}" width="12" height="12" rx="2" fill="${color}"/>`).join('')}
<text x="110" y="77" font-family="Arial, sans-serif" font-size="15" fill="#6A736A" letter-spacing="1">A LITTLE THEORY. A LOT OF YOU.</text>
<text x="63" y="250" font-family="Georgia, serif" font-size="79" fill="#263E34">Outfit</text>
<text x="63" y="340" font-family="Georgia, serif" font-size="79" fill="#263E34">Color Lab</text>
<text x="67" y="411" font-family="Arial, sans-serif" font-size="24" fill="#4E5951">Explore colors before</text>
<text x="67" y="445" font-family="Arial, sans-serif" font-size="24" fill="#4E5951">you get dressed.</text>
<path d="M67 511h393" stroke="#D8DED1"/>
<text x="67" y="552" font-family="Arial, sans-serif" font-size="14" letter-spacing="1" fill="#6A736A">YOUR WARDROBE, REMIXED.</text>
${outfits.map((look,i)=>{const x=526+i*213;return `<rect x="${x}" y="108" width="195" height="414" rx="7" fill="${look.background}"/><text x="${x+17}" y="140" font-family="Arial, sans-serif" font-size="10" fill="#6A736A" letter-spacing="1">LOOK / 0${i+1}</text>${outfitSVG(look.colors).replace('<svg ',`<svg x="${x+2}" y="157" width="191" height="320" `).replace(/var\(--(top|trousers|shoes)\)/g,(_,part)=>look.colors[part])}${Object.values(look.colors).map((color,j)=>`<circle cx="${x+75+j*20}" cy="500" r="6" fill="${color}" stroke="#BBC2B4" stroke-width=".5"/>`).join('')}`}).join('')}
</svg>`;
await writeFile('images/og-image.svg', svg);
await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile('images/og-image.jpg');
const size=(await stat('images/og-image.jpg')).size;
if(size>=100000) throw new Error('Cover exceeds 100 KB');
console.log(`Refined the cover using the website's original SVG garments: ${size} bytes.`);
