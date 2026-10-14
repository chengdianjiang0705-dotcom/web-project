import { mkdir, copyFile, cp } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'guide.html', 'lab.html', 'looks.html', 'project.html', 'style.css', 'nav.js', 'looks-data.js', 'outfit.js', 'lab.js', 'gallery.js', 'home.js', 'favicon-32.png', 'favicon-192.png', 'apple-touch-icon.png', 'icon-512.png', 'favicon.svg', 'robots.txt']) {
  await copyFile(file, `dist/${file}`);
}
await cp('images', 'dist/images', { recursive: true });
console.log('Built static website in dist/.');
