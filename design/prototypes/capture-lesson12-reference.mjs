// A03 Lesson 12 DESIGN prototype QA and screenshots; NOT the A02 production app.
// Run where Playwright is available: node design/prototypes/capture-lesson12-reference.mjs
import { chromium } from 'playwright';
import { resolve, join } from 'node:path';
import { mkdir } from 'node:fs/promises';
const target = new URL('./a03-lesson12-switch-layout-reference.html', import.meta.url).href;
const output = resolve(process.cwd(), 'design/reference-captures/a03-lesson12');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const t of [
    { key: 'desktop', width: 1440, height: 900 },
    { key: 'mobile', width: 390, height: 844 },
    { key: 'mobile-320', width: 320, height: 640 }
  ]) {
    const context = await browser.newContext({
      viewport: { width: t.width, height: t.height },
      deviceScaleFactor: t.key === 'desktop' ? 1.5 : 2,
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    page.on('pageerror', e => { throw Error('Page error: ' + e); });
    await page.goto(target);
    await page.locator('#primary').waitFor();
    const noOverflow = async () => {
      const h = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
      if (!h) throw Error('Document horizontal overflow ' + t.key);
    };
    const shot = async label => {
      await noOverflow();
      await page.screenshot({ path: join(output, 'a03-l12-' + t.key + '-' + label + '.png'), fullPage: true });
    };
    if ((await page.locator('#experiment-dock').isVisible())) throw Error('Switch before prediction!');
    if ((await page.locator('#readouts').isVisible())) throw Error('Pre-prediction readout leak!');
    await shot('predict');
    await page.locator('input[name="predict"]').first().check();
    await page.locator('#primary').click();
    if ((await page.evaluate(() => window.__a03l12?.get()?.phase)) !== 'experiment') throw Error('No experiment phase');
    if (!(await page.locator('#experiment-dock').isVisible())) throw Error('Missing lab control dock!');
    await page.locator('#open-switch').click();
    await page.locator('#close-switch').click();
    const state = await page.evaluate(() => window.__a03l12?.get());
    if (!(state.visited.includes('open') && state.visited.includes('closed'))) throw Error('No both visit history');
    if (!(await page.locator('#amp').textContent()).includes('5 mA')) throw Error('Incorrect closed readout');
    await shot('experiment');
    await page.locator('#primary').click();
    await page.locator('input[name="explain"][value="correct"]').check();
    await page.locator('#primary').click();
    if ((await page.evaluate(() => window.__a03l12?.get()?.phase)) !== 'done') throw Error('Done missing');
    await shot('done');
    await context.close();
    console.log('A03 L12 visual reference PASS: ' + t.key);
  }
} finally {
  await browser.close();
}
