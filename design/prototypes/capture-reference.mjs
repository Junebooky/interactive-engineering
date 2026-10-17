// A03 DESIGN REFERENCE RENDERER — NOT a production E2E test.
// Usage (with Playwright available): node design/prototypes/capture-reference.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { mkdir } from 'node:fs/promises';
const target = new URL('./a03-mosfet-discovery-v2.html', import.meta.url).href;
const output = resolve(process.cwd(), 'design/reference-captures/a03-mosfet-v2');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const entry of [
    { name: 'desktop', width: 1440, height: 900, observation: true },
    { name: 'mobile', width: 390, height: 844, observation: true },
    { name: 'mobile-320', width: 320, height: 640, observation: false },
  ]) {
    const context = await browser.newContext({
      viewport: { width: entry.width, height: entry.height },
      deviceScaleFactor: entry.name === 'desktop' ? 1.5 : 2,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto(target);
    await page.evaluate(() => localStorage.removeItem('a03-mosfet-v2-demo'));
    await page.reload();
    await page.waitForSelector('#primary');
    const assertNoOverflow = async () => {
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      if (overflow) throw new Error('Horizontal overflow: ' + entry.name);
    };
    await assertNoOverflow();
    const predict = await page.evaluate(() => window.__a03?.getState());
    if (predict?.phase !== 'predict') throw Error('Expected predict state');
    if (await page.locator('#scene-signal').isVisible()) throw Error('Pre-prediction scene leak');
    await page.screenshot({ path: join(output, 'a03-v2-' + entry.name + '-predict.png'), fullPage: true });
    await page.getByRole('radio').nth(2).click();
    await page.locator('#primary').click();
    const phase = await page.evaluate(() => window.__a03?.getState()?.phase);
    if (phase !== 'observe') throw Error('Prediction submit failed');
    await page.locator('#voltage').evaluate((el) => { el.value = '1.2'; el.dispatchEvent(new Event('input', { bubbles: true })); });
    await assertNoOverflow();
    if (entry.observation) {
      await page.screenshot({ path: join(output, 'a03-v2-' + entry.name + '-observe.png'), fullPage: true });
    }
    await page.locator('#primary').click();
    await page.getByRole('radio').nth(1).click();
    await page.locator('#primary').click();
    const done = await page.evaluate(() => window.__a03?.getState()?.phase);
    if (done !== 'done') throw Error('Expected done state');
    await page.screenshot({ path: join(output, 'a03-v2-' + entry.name + '-done.png'), fullPage: true });
    console.log('A03 screenshots captured for ' + entry.name);
    await context.close();
  }
  console.log('Only the design prototype was captured, not the A02 app.');
} finally {
  await browser.close();
}
