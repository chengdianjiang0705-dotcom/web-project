import { readFile, access, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
const pages = ['index.html', 'guide.html', 'lab.html', 'looks.html', 'project.html'];
let count = 0;
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  for (const expected of ['<main ', '<header ', '<footer ', '<title>', 'name="viewport"', 'property="og:image"', 'apple-touch-icon', 'favicon-32.png']) {
    if (!html.includes(expected)) throw new Error(`${page}: missing ${expected}`);
  }
  if (!/<meta property="og:image" content="https:\/\//.test(html)) throw new Error(`${page}: OG image needs full HTTPS URL`);
  const paths = [...html.matchAll(/(?:href|src)="([^"#]+)"/g)].map(match => match[1]).filter(path => !/^(?:https?:|mailto:|data:)/.test(path));
  for (const path of paths) {
    await access(resolve(dirname(page), path.split(/[?#]/)[0]));
    count++;
  }
}
const cover = await stat('images/og-image.jpg');
if (cover.size >= 100_000) throw new Error('Share cover must be below 100 KB');
const pngSize = async file => { const bytes = await readFile(file); return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)]; };
for (const [file, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['favicon-192.png', 192], ['icon-512.png', 512]]) {
  if ((await pngSize(file)).some(dimension => dimension !== size)) throw new Error(`${file}: expected ${size}px square`);
}
console.log(`Checked ${pages.length} pages, ${count} local references, required icons and cover size.`);
