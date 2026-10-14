import { readFile, writeFile } from 'node:fs/promises';
const base = process.argv[2]?.replace(/\/$/, '');
if (!base || !/^https:\/\/[a-z0-9.-]+(?:\/[a-z0-9/_-]+)?$/i.test(base)) throw new Error('Pass a valid public HTTPS base URL.');
for (const file of ['index.html', 'guide.html', 'lab.html', 'looks.html', 'project.html']) {
  const url = `${base}/${file === 'index.html' ? '' : file}`;
  let html = await readFile(file, 'utf8');
  html = html.replace(/(<meta property="og:url" content=")[^"]+/, `$1${url}`)
    .replace(/(<link rel="canonical" href=")[^"]+/, `$1${url}`)
    .replace(/(<meta (?:property="og:image"|name="twitter:image") content=")[^"]+/g, `$1${base}/images/og-image.jpg`);
  await writeFile(file, html);
}
console.log(`Updated metadata for ${base}/`);
