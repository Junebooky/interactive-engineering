import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium, devices } from 'playwright';

const port = 4182;
const baseUrl = `http://127.0.0.1:${port}/`;
const output = 'browser-evidence/m01-app';
await mkdir(output, { recursive: true });

const server = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
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
    try {
      const res = await fetch(baseUrl);
      if (res.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw Error('Vite app server did not start');
}

async function checkViewport(page, label) {
  const width = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  if (width.scroll > width.client + 2) {
    throw Error(`${label} horizontal overflow: ${JSON.stringify(width)}`);
  }
}

try {
  await ready();
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

  // 1. Desktop Suite (1440x900)
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desktop.newPage();
  page.on('pageerror', (error) => failures.push({ label: 'Desktop Page Error', error: String(error) }));

  // Step 0: Concept Intro
  await assert('Step 0 Concept intro and voice toggle', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('.prompt-title');
    const title = await page.locator('.prompt-title').textContent();
    if (!title?.includes('스위치') && !title?.includes('MOSFET')) throw Error(`Unexpected step 0 title: ${title}`);

    // Voice toggle in header
    const voiceBtn = page.locator('.voice-toggle-btn');
    await voiceBtn.click(); // Toggle off/on
    await page.screenshot({ path: `${output}/01-app-step0-concept.png`, fullPage: true });

    // Click confirm then continue to Step 1
    await page.getByRole('button', { name: /이해했습니다/ }).click();
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 1: MOS Channel Formation
  await assert('Step 1 S01 veiled prediction, slider manipulation, misconception check, and pass', async () => {
    // Veiled state before prediction
    await page.waitForSelector('.prompt-title');
    if (!await page.locator('.a05-veiled').count()) throw Error('Veiled state not visible before prediction');
    await page.screenshot({ path: `${output}/02-app-s01-veiled.png`, fullPage: true });

    // Select prediction radio
    await page.locator('.radio-option-btn').filter({ hasText: '1.2 V' }).click();
    if (await page.locator('.a05-veiled').count()) throw Error('Veiled state still present after prediction');
    await page.screenshot({ path: `${output}/03-app-s01-unveiled.png`, fullPage: true });

    // Manipulate slider
    const slider = page.locator('input[type="range"]');
    await slider.waitFor({ state: 'visible' });
    await slider.evaluate((el) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, '0.6');
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await slider.evaluate((el) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, '1.2');
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Wrong misconception test
    await page.locator('.radio-option-btn').filter({ hasText: '전자들이 산화막을 뚫고' }).click();
    await page.getByRole('button', { name: /확인하기/ }).click();
    if (!await page.locator('.rule-pill.pill-fail').count()) throw Error('Misconception did not fail rule');
    await page.screenshot({ path: `${output}/04-app-s01-misconception.png`, fullPage: true });

    // View Hint
    await page.getByRole('button', { name: /힌트 보기/ }).click();
    await page.waitForSelector('.tutor-panel, .hint-card');

    // Correct Answer & Pass
    await page.locator('.radio-option-btn').filter({ hasText: '실리콘 표면에' }).click();
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/05-app-s01-pass.png`, fullPage: true });

    // Deep-dive Why modal
    await page.getByRole('button', { name: /Why\? 원리/ }).click();
    await page.waitForSelector('.why-modal, .modal-backdrop');
    await page.screenshot({ path: `${output}/06-app-s01-why-modal.png`, fullPage: true });
    await page.locator('.modal-close-btn').click();

    // Advance to Step 2
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 2: VDS Drift / Pinch-Off
  await assert('Step 2 S02 VDS drift exploration and pinch-off saturation pass', async () => {
    await page.waitForSelector('.prompt-title');
    // Prediction
    await page.locator('.radio-option-btn').filter({ hasText: '0 V에서는 0' }).click();

    // Slider
    const slider = page.locator('input[type="range"]');
    await slider.waitFor({ state: 'visible' });
    await slider.evaluate((el) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, '1.5');
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Concept answer
    await page.locator('.radio-option-btn').filter({ hasText: '전압 차가 있어야' }).click();
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/07-app-s02-pass.png`, fullPage: true });

    // Advance to Step 3
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 3: Resistor-Loaded nMOS Inverter
  await assert('Step 3 S03 resistor-loaded nMOS 0.45V pulldown reversal pass', async () => {
    await page.waitForSelector('.prompt-title');
    // Prediction
    await page.locator('.radio-option-btn').filter({ hasText: '출력 0' }).click();

    // Toggle vin to 5V (HIGH)
    const toggleBtn = page.locator('.switch-button');
    await toggleBtn.click();

    // Verify 0.45V readout in the circuit
    const readoutText = await page.locator('.a05-readouts').textContent();
    if (!readoutText?.includes('0.45')) throw Error(`Readout does not show 0.45V: ${readoutText}`);
    await page.screenshot({ path: `${output}/08-app-s03-inverter-045v.png`, fullPage: true });

    // Concept answer
    await page.locator('.radio-option-btn').filter({ hasText: '낮은 저항 경로' }).click();
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');

    // Advance to Step 4
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 4: Complementary CMOS NOT Gate
  await assert('Step 4 S04 CMOS NOT complementary switching and truth table completion', async () => {
    await page.waitForSelector('.prompt-title');
    // Prediction
    await page.locator('.radio-option-btn').filter({ hasText: 'pMOS ON' }).click();

    // Toggle vin between 0V and 5V
    const toggleBtn = page.locator('.switch-button');
    await toggleBtn.click();
    await toggleBtn.click();

    // Truth Table input: out0 = 1, out1 = 0
    const rows = page.locator('.truth-table-row');
    await rows.nth(0).getByRole('button', { name: /1 \(HIGH\)/ }).click();
    await rows.nth(1).getByRole('button', { name: /0 \(LOW\)/ }).click();

    await page.screenshot({ path: `${output}/09-app-s04-cmos-pass.png`, fullPage: true });
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');

    // Advance to completion
    await page.getByRole('button', { name: /계속하기/ }).click();
    await page.waitForSelector('.completion-card');
    await page.screenshot({ path: `${output}/10-app-completion-card.png`, fullPage: true });
  });

  // Storage Restoration & QA Lab Modal
  await assert('LocalStorage persistence restoration and standalone QA Lab launcher', async () => {
    // Reload page to test persistence
    await page.reload();
    await page.waitForSelector('.completion-card');

    // QA Lab launcher in header
    await page.locator('.qa-lab-toggle-btn').click();
    await page.waitForSelector('.qa-lab-overlay, .a05-lab-container');
    await page.screenshot({ path: `${output}/11-app-qa-lab-modal.png`, fullPage: true });

    // Close QA Lab
    await page.locator('.qa-lab-close-btn').click();
    await checkViewport(page, 'Desktop 1440');
  });

  await desktop.close();

  // 2. Mobile Suite (375x812 iPhone 13 & 320x600 small screen)
  const mobile = await browser.newContext({
    ...devices['iPhone 13'],
    viewport: { width: 375, height: 812 },
  });
  const phone = await mobile.newPage();
  phone.on('pageerror', (error) => failures.push({ label: 'Mobile Page Error', error: String(error) }));

  await assert('Mobile 375px & 320px responsive layout without horizontal overflow', async () => {
    await phone.goto(baseUrl);
    await phone.waitForSelector('.player-viewport');
    await phone.screenshot({ path: `${output}/12-app-mobile-375.png`, fullPage: true });
    await checkViewport(phone, 'Mobile 375');

    // Resize to 320px
    await phone.setViewportSize({ width: 320, height: 600 });
    await phone.screenshot({ path: `${output}/13-app-mobile-320.png`, fullPage: true });
    await checkViewport(phone, 'Mobile 320');
  });

  await mobile.close();
} catch (error) {
  failures.push({ label: 'Fatal Browser QA Error', error: String(error) });
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}

if (failures.length) {
  console.error(JSON.stringify({ status: 'failed', failures }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ status: 'passed', artifacts: output }, null, 2));
}
