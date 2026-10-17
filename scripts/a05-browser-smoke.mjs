import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium, devices } from 'playwright';

const baseUrl = 'http://127.0.0.1:4179/a05-preview.html';
const output = 'browser-evidence/m01';
await mkdir(output, { recursive: true });
const server = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '4179', '--strictPort'], {
  stdio: ['ignore', 'inherit', 'inherit'],
});
let browser;
const failures = [];
async function assert(label, fn) {
  try {
    await fn();
    console.log('PASS', label);
  } catch (error) {
    failures.push({ label, error: String(error) });
    console.error('FAIL', label, error);
  }
}
async function ready() {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(baseUrl)).ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw Error('Vite standalone A05 preview did not start');
}
async function choose(page, substring) {
  await page.locator('.a05-choice-set button').filter({ hasText: substring }).first().click();
}
async function checkViewport(page, label) {
  const width = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  if (width.scroll > width.client + 2) throw Error(label + ' overflow: ' + JSON.stringify(width));
}
try {
  await ready();
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desktop.newPage();
  page.on('pageerror', error => failures.push({ label: 'desktop JS page error', error: String(error) }));
  await assert('desktop initial prediction hides live measurements', async () => {
    await page.goto(baseUrl);
    if (await page.locator('.a05-readouts').count()) throw Error('pre-prediction measurement exposed');
    await page.screenshot({ path: output + '/01-predict-hidden-desktop.png', fullPage: true });
  });
  await assert('M01 S01 threshold and 3 state screenshots', async () => {
    await choose(page, '1.2 V');
    const slider = page.locator('#a05-voltage');
    for (const [value, label] of [['0.6', 'below'], ['0.7', 'boundary'], ['0.8', 'above']]) {
      await slider.fill(value);
      if (value === '0.7' && !await page.getByText('경계 (두께 0)').count()) throw Error('0.7 boundary not seen');
      await page.screenshot({ path: output + '/02-gate-' + label + '.png', fullPage: true });
    }
  });
  await assert('M01 S01 conceptual answer unlocks progression', async () => {
    await choose(page, '실리콘 표면에');
    await page.getByRole('button', { name: '관찰 결과 확인하기' }).click();
    if (!await page.getByText('원리를 연결했어요!').count()) throw Error('no correct feedback');
    await page.getByRole('button', { name: '다음 질문으로' }).click();
  });
  await assert('M01 S02 IV saturation and direction', async () => {
    await choose(page, '1 V에서는');
    await page.locator('#a05-voltage').fill('1.8');
    if (!await page.getByText('포화 이후에도 ID는 0이 아님').count()) throw Error('missing saturation annotation');
    await page.screenshot({ path: output + '/03-current-desktop.png', fullPage: true });
    await choose(page, '전압 차가 있어야');
    await page.getByRole('button', { name: '관찰 결과 확인하기' }).click();
    await page.getByRole('button', { name: '다음 질문으로' }).click();
  });
  await assert('M01 S03 0.45V is LOW not hard short', async () => {
    await choose(page, '출력 0');
    await page.getByRole('button', { name: '입력 5 V' }).click();
    if (!await page.getByText('0.45 V').count()) throw Error('finite 0.45V readout not present');
    await page.screenshot({ path: output + '/04-resistor-desktop.png', fullPage: true });
    await choose(page, '낮은 저항 경로');
    await page.getByRole('button', { name: '관찰 결과 확인하기' }).click();
    await page.getByRole('button', { name: '다음 질문으로' }).click();
  });
  await assert('M01 S04 distinct CMOS, partial error and full truth table', async () => {
    await choose(page, 'pMOS ON');
    await page.getByRole('button', { name: '입력 5 V' }).click();
    await page.getByRole('button', { name: '입력 0 V' }).click();
    await page.locator('.a05-truth-row').nth(0).getByRole('button', { name: '1' }).click();
    await page.locator('.a05-truth-row').nth(1).getByRole('button', { name: '1' }).click();
    await page.getByRole('button', { name: '관찰 결과 확인하기' }).click();
    if (!await page.getByText('어느 조건이 다른지').count()) throw Error('missing partial error state');
    await page.locator('.a05-truth-row').nth(1).getByRole('button', { name: '0' }).click();
    await page.getByRole('button', { name: '관찰 결과 확인하기' }).click();
    if (!await page.getByText('원리를 연결했어요!').count()) throw Error('CMOS did not validate');
    await page.screenshot({ path: output + '/05-cmos-desktop.png', fullPage: true });
    await checkViewport(page, 'desktop');
  });
  await assert('keyboard range ArrowRight + focus', async () => {
    await page.goto(baseUrl);
    await choose(page, '1.2 V');
    const slider = page.locator('#a05-voltage');
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    if (await slider.inputValue() !== '0.1') throw Error('keyboard ArrowRight failed');
  });
  await assert('reduced motion disables current animation', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(baseUrl);
    await choose(page, '1.2 V');
    const css = await page.evaluate(() => [...document.styleSheets].some(sheet => {
      try { return [...sheet.cssRules].some(rule => rule.cssText.includes('prefers-reduced-motion')); } catch { return false; }
    }));
    if (!css) throw Error('reduced motion rule missing');
  });
  await assert('desktop Korean voice request does not throw', async () => {
    await page.getByRole('button', { name: '한국어 질문 듣기' }).click();
  });
  const mobile = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 375, height: 812 } });
  const phone = await mobile.newPage();
  phone.on('pageerror', error => failures.push({ label: 'mobile JS page error', error: String(error) }));
  await assert('mobile prediction, touch and no overflow', async () => {
    await phone.goto(baseUrl);
    await choose(phone, '1.2 V');
    await phone.locator('#a05-voltage').fill('1.0');
    await phone.screenshot({ path: output + '/06-gate-mobile-375.png', fullPage: true });
    await checkViewport(phone, '375px mobile');
    await phone.setViewportSize({ width: 320, height: 700 });
    await phone.screenshot({ path: output + '/07-gate-mobile-320.png', fullPage: true });
    await checkViewport(phone, '320px mobile');
  });
  await desktop.close();
  await mobile.close();
} catch (error) {
  failures.push({ label: 'fatal browser QA error', error: String(error) });
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
if (failures.length) {
  console.log(JSON.stringify({ status: 'failed', failures }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ status: 'passed', artifacts: output }));
}
