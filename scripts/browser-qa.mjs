// Optional browser QA: supply an installed Playwright module and Chromium/Edge.
// This is not a website runtime dependency.
import { pathToFileURL } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { LOOKS, COLORS, DEFAULT_OUTFIT } from '../looks-data.js';

const moduleName = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(moduleName ? pathToFileURL(moduleName).href : 'playwright');
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
const base = process.env.QA_URL || 'http://127.0.0.1:4173';
const localServer = process.argv.includes('--serve') ? (await import('./serve.mjs')).server : null;
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, permissions: ['clipboard-read', 'clipboard-write'], reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
const checks = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(base)) errors.push(`${response.status()} ${response.url()}`); });
await mkdir('docs/screenshots', { recursive: true });
const getOutfit = () => page.locator('#outfit-preview svg').evaluate(svg => Object.fromEntries(['top', 'trousers', 'shoes'].map(part => [part, svg.style.getPropertyValue(`--${part}`).toUpperCase()])));
try {
  await page.goto(`${base}/lab.html`);
  await page.locator('[data-color]').first().waitFor();
  assert.deepEqual(await getOutfit(), DEFAULT_OUTFIT);
  for (const part of ['top', 'trousers', 'shoes']) {
    await page.locator(`[data-part="${part}"]`).click();
    const before = await getOutfit();
    await page.locator('[data-color="#B9654D"]').click();
    assert.deepEqual(await getOutfit(), { ...before, [part]: '#B9654D' });
  }
  checks.push('All three garments independently change color and keep other parts unchanged.');
  for (const color of COLORS) {
    await page.locator(`[data-color="${color.hex}"]`).click();
    assert.equal((await getOutfit()).shoes, color.hex);
    assert.equal(await page.locator(`[data-color="${color.hex}"]`).getAttribute('aria-pressed'), 'true');
  }
  checks.push('All ten named colors update the illustration and selected swatch.');
  await page.locator('#custom-color').evaluate(input => { input.value = '#123456'; input.dispatchEvent(new Event('input', { bubbles: true })); });
  assert.equal((await getOutfit()).shoes, '#123456');
  assert.ok((await page.locator('#current-palette').textContent()).includes('Custom #123456'));
  await page.locator('#randomize').click();
  assert.notEqual((await getOutfit()).shoes, '#123456');
  await page.locator('#reset').click();
  assert.deepEqual(await getOutfit(), DEFAULT_OUTFIT);
  checks.push('Custom colors, randomization and reset keep preview and text in sync.');
  await page.locator('[data-garment="trousers"]').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('[data-part="trousers"]').getAttribute('aria-pressed'), 'true');
  checks.push('Garment selection works with the keyboard.');
  await page.locator('#copy-palette').click();
  assert.ok((await page.evaluate(() => navigator.clipboard.readText())).includes('Top: Light blue'));
  await page.locator('#copy-link').click();
  const sharedLink = await page.evaluate(() => navigator.clipboard.readText());
  assert.equal(new URL(sharedLink).searchParams.get('trousers'), DEFAULT_OUTFIT.trousers);
  const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#download-look').click()]);
  assert.equal(download.suggestedFilename(), 'outfit-color-lab.svg');
  checks.push('Copy palette, share URL and SVG download work.');
  for (const look of LOOKS) {
    await page.goto(`${base}/looks.html`);
    await page.locator(`a.text-link[href="lab.html?look=${look.id}"]`).click();
    assert.deepEqual(await getOutfit(), look.colors);
  }
  checks.push('Every one of the six gallery links loads the correct preset across pages.');
  await page.goto(`${base}/lab.html?look=unknown&top=%3Cscript%3E`);
  assert.deepEqual(await getOutfit(), DEFAULT_OUTFIT);
  await page.goto(`${base}/lab.html?${new URLSearchParams({ top: '#123456', trousers: '#ABCDEF', shoes: '#456789' })}`);
  assert.deepEqual(await getOutfit(), { top: '#123456', trousers: '#ABCDEF', shoes: '#456789' });
  checks.push('Malformed URLs fall back safely and shared custom palettes round-trip.');
  await page.goto(`${base}/looks.html`);
  for (const [filter, count] of [['neutral', 2], ['blue', 2], ['green', 1], ['statement', 1], ['all', 6]]) {
    await page.locator(`[data-filter="${filter}"]`).click();
    assert.equal(await page.locator('.look-card:visible').count(), count);
  }
  checks.push('All gallery filters show the expected look counts.');
  for (const [url, name] of [['index.html', 'desktop-home'], ['lab.html', 'desktop-lab'], ['guide.html', 'desktop-guide'], ['looks.html', 'desktop-gallery']]) {
    await page.goto(`${base}/${url}`);
    await page.evaluate(() => Promise.all([...document.images].map(image => image.decode().catch(() => {}))));
    await page.screenshot({ path: `docs/screenshots/${name}.png`, fullPage: true });
  }
  for (const width of [375, 390, 414, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const file of ['index.html', 'guide.html', 'lab.html', 'looks.html', 'project.html']) {
      await page.goto(`${base}/${file}`);
      await page.locator('.brand').first().waitFor();
      const layout = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, broken: [...document.images].filter(img => img.complete && !img.naturalWidth).map(img => img.src) }));
      assert.ok(layout.scroll <= layout.width + 1, `${file} overflows at ${width}px: ${layout.scroll}`);
      assert.deepEqual(layout.broken, [], `${file}: broken image`);
      assert.equal(await page.locator('main').count(), 1);
    }
  }
  checks.push('All five pages have no horizontal overflow or broken images at 375, 390, 414, 768 and 1440 px.');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/index.html`);
  await page.locator('.menu-toggle').click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
  await page.locator('#main-nav a[href="lab.html"]').click();
  await page.locator('[data-part="shoes"]').click();
  await page.locator('[data-color="#78866B"]').click();
  assert.equal((await getOutfit()).shoes, '#78866B');
  await page.locator('#reset').click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'docs/screenshots/mobile-lab.png', fullPage: true });
  await page.goto(`${base}/index.html`);
  await page.evaluate(() => Promise.all([...document.images].map(image => image.decode().catch(() => {}))));
  await page.screenshot({ path: 'docs/screenshots/mobile-home.png', fullPage: true });
  checks.push('Mobile menu navigation and lab recoloring work at 390 px; screenshots captured without browser chrome.');
  assert.deepEqual(errors, [], 'Browser errors / failed local resources');
  const report = `# Browser verification\n\nDate: 15 October 2026 (Asia/Shanghai).\n\nURL tested: ${base}\n\nBrowser: ${await browser.version()} (headless Chromium / Microsoft Edge).\n\n${checks.map(check => `- PASS: ${check}`).join('\n')}\n- PASS: No JavaScript page errors or failed local asset requests.\n\nDesktop screenshots: 1440 px wide. Mobile screenshots: 390 px wide.\n\nAll functional checks passed. Visual screenshots must also be inspected before delivery.\n`;
  await writeFile('docs/TESTING.md', report);
  console.log(report);
} finally { await browser.close(); localServer?.close(); }
