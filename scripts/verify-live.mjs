// Verify public availability without authentication or cookies.
import assert from 'node:assert/strict';
const base = (process.argv[2] || 'https://chengdianjiang0705-dotcom.github.io/web-project').replace(/\/$/, '');
async function get(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      assert.equal(response.status, 200, `${url}: HTTP ${response.status}`);
      return response;
    } catch (error) { if (attempt === 2) throw error; }
  }
}
for (const file of ['index.html', 'guide.html', 'lab.html', 'looks.html', 'project.html']) {
  const response = await get(`${base}/${file}`);
  const html = await response.text();
  assert.ok(html.includes('Outfit Color Lab'), `${file}: wrong content`);
  assert.ok(html.includes(`${base}/images/og-image.jpg`), `${file}: wrong OG URL`);
  console.log(`PASS public page: ${file}`);
}
for (const file of ['nav.js', 'looks-data.js', 'lab.js', 'style.css', 'images/og-image.jpg', 'images/wardrobe-flatlay.jpg', 'favicon-32.png', 'apple-touch-icon.png']) {
  const response = await get(`${base}/${file}`);
  await response.arrayBuffer();
  console.log(`PASS public asset: ${file}`);
}
const repository = await (await get('https://api.github.com/repos/chengdianjiang0705-dotcom/web-project')).json();
assert.equal(repository.private, false);
console.log(`PASS repository is accessible without authentication: ${repository.html_url}`);
