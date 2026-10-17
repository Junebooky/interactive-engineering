import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium, devices } from 'playwright';

const port = 4185;
const baseUrl = `http://127.0.0.1:${port}/`;
const output = 'browser-evidence/g03-app';
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
  throw Error('Vite app server did not start on port ' + port);
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

  // Catalog -> GPU Lesson Navigation
  await assert('Catalog to GPU Lesson Navigation', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('.catalog-btn');
    await page.locator('.catalog-btn').click();
    await page.waitForSelector('.catalog-modal');

    // Click GPU lesson chip in course card
    const gpuChip = page.locator('.course-lesson-chip').filter({ hasText: 'GPU' });
    await gpuChip.waitFor({ state: 'visible' });
    await gpuChip.click();

    // Verify breadcrumb shows GPU lesson title
    await page.waitForSelector('.lesson-title-text');
    const title = await page.locator('.lesson-title-text').textContent();
    if (!title?.includes('GPU')) throw Error(`Expected GPU lesson breadcrumb, got: ${title}`);
    await page.screenshot({ path: `${output}/01-app-catalog-gpu-entry.png`, fullPage: true });
  });

  // Step 0: Concept Intro
  await assert('Step 0 GPU concept intro and voice toggle', async () => {
    await page.waitForSelector('.prompt-title');
    const title = await page.locator('.prompt-title').textContent();
    if (!title?.includes('GPU') && !title?.includes('줄다리기')) throw Error(`Unexpected step 0 title: ${title}`);

    // Voice button test
    const voiceBtn = page.locator('.voice-toggle-btn');
    await voiceBtn.click();
    await page.screenshot({ path: `${output}/02-app-g03-step0-concept.png`, fullPage: true });

    // Confirm & Advance
    await page.getByRole('button', { name: /이해했습니다/ }).click();
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 1: Compute vs Feeding (step-gpu-s1-feeding)
  await assert('Step 1 G03-S01 compute feeding bottleneck discovery and pass', async () => {
    await page.waitForSelector('.prompt-title');
    // Veiled state before prediction
    if (!await page.locator('.a05-veiled').count()) throw Error('Veiled state not visible before prediction');
    await page.screenshot({ path: `${output}/03-app-g03-s01-veiled.png`, fullPage: true });

    // Select prediction
    await page.locator('.radio-option-btn').filter({ hasText: '시간은 8초 그대로' }).click();
    if (await page.locator('.a05-veiled').count()) throw Error('Veiled state still present after prediction');
    await page.screenshot({ path: `${output}/04-app-g03-s01-unveiled.png`, fullPage: true });

    // 1) Test compute 16 at feed 8
    const computeSlider = page.locator('#control-compute input[type="range"]');
    const feedSlider = page.locator('#control-feed input[type="range"]');

    await computeSlider.fill('16');
    await computeSlider.dispatchEvent('input');
    await feedSlider.fill('8');
    await feedSlider.dispatchEvent('input');
    await page.waitForTimeout(200);

    // 2) Test compute 32 at feed 8 (bottleneck observed)
    await computeSlider.fill('32');
    await computeSlider.dispatchEvent('input');
    await page.waitForTimeout(200);

    // 3) Relieve bottleneck: feed 32
    await feedSlider.fill('32');
    await feedSlider.dispatchEvent('input');
    await page.waitForTimeout(200);

    // Select answer: supply-limits
    await page.locator('.radio-option-btn').filter({ hasText: '공급 속도가 전체 처리율을 제한' }).click();
    await page.screenshot({ path: `${output}/05-app-g03-s01-answered.png`, fullPage: true });

    // Evaluate
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/06-app-g03-s01-pass.png`, fullPage: true });

    // Deep-dive Why modal
    await page.getByRole('button', { name: /Why\? 원리/ }).click();
    await page.waitForSelector('.why-modal, .modal-backdrop');
    await page.screenshot({ path: `${output}/07-app-g03-s01-why-modal.png`, fullPage: true });
    await page.locator('.modal-close-btn').click();

    // Advance to Step 2
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 2: DRAM Family Roles (step-gpu-s2-families)
  await assert('Step 2 G03-S02 memory family roles and placements exploration and pass', async () => {
    await page.waitForSelector('.prompt-title');
    // Prediction
    await page.locator('.radio-option-btn').filter({ hasText: '모두 DRAM 셀 기반' }).click();

    // Explore 3 placements
    // 1) DDR/RDIMM -> cpu-dimm
    await page.locator('.radio-option-btn').filter({ hasText: 'DDR / RDIMM' }).click();
    await page.locator('.radio-option-btn').filter({ hasText: 'CPU DIMM 소켓' }).click();
    await page.waitForTimeout(150);

    // 2) GDDR6/GDDR7 -> gpu-board
    await page.locator('.radio-option-btn').filter({ hasText: 'GDDR6 / GDDR7' }).click();
    await page.locator('.radio-option-btn').filter({ hasText: 'GPU 보드 기판' }).click();
    await page.waitForTimeout(150);

    // 3) HBM -> gpu-package
    await page.locator('.radio-option-btn').filter({ hasText: 'HBM (고대역폭' }).click();
    await page.locator('.radio-option-btn').filter({ hasText: 'GPU 실리콘 패키지' }).click();
    await page.waitForTimeout(150);

    // Select answer: all-dram-roles
    await page.locator('.radio-option-btn').filter({ hasText: '설계 목적에 따라 소켓·보드·패키지' }).click();
    await page.screenshot({ path: `${output}/08-app-g03-s02-answered.png`, fullPage: true });

    // Evaluate
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/09-app-g03-s02-pass.png`, fullPage: true });

    // Advance to Step 3
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 3: GDDR Width & Rate (step-gpu-s3-width-rate)
  await assert('Step 3 G03-S03 theoretical bandwidth calculation and PAM3 pass', async () => {
    await page.waitForSelector('.prompt-title');
    // Prediction
    await page.locator('.radio-option-btn').filter({ hasText: '24Gbps는 384 GB/s' }).click();

    // Slider pinRate 24 -> 32
    const pinSlider = page.locator('#control-pinRate input[type="range"]');
    await pinSlider.fill('24');
    await pinSlider.dispatchEvent('input');
    await page.waitForTimeout(150);

    await pinSlider.fill('32');
    await pinSlider.dispatchEvent('input');
    await page.waitForTimeout(150);

    // Select PAM3 modulation
    await page.locator('#control-signal .radio-option-btn').filter({ hasText: 'PAM3' }).click();
    await page.waitForTimeout(150);

    // Select answer
    await page.locator('#control-answer .radio-option-btn').filter({ hasText: '대역폭은 폭×속도÷8' }).click();
    await page.screenshot({ path: `${output}/10-app-g03-s03-answered.png`, fullPage: true });

    // Evaluate
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/11-app-g03-s03-pass.png`, fullPage: true });

    // Advance to Step 4
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 4: HBM Tradeoffs (step-gpu-s4-hbm)
  await assert('Step 4 G03-S04 HBM TSV/interposer topology and tradeoffs pass to completion', async () => {
    await page.waitForSelector('.prompt-title');
    // Prediction
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '고비용과 발열 집적' }).click();

    // 1) Observe GDDR board
    await page.locator('#control-topology .radio-option-btn').filter({ hasText: '보드 GDDR' }).click();
    await page.waitForTimeout(150);

    // 2) Observe HBM stack
    await page.locator('#control-topology .radio-option-btn').filter({ hasText: '패키지 HBM' }).click();
    await page.waitForTimeout(150);

    // 3) Toggle constraints display
    const constraintSwitch = page.locator('#control-showConstraints button[role="switch"]');
    await constraintSwitch.click();
    await page.waitForTimeout(150);

    // Select answer: relative-tradeoffs
    await page.locator('#control-answer .radio-option-btn').filter({ hasText: '초광대역 I/O의 이점 뒤에' }).click();
    await page.screenshot({ path: `${output}/12-app-g03-s04-answered.png`, fullPage: true });

    // Evaluate
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/13-app-g03-s04-pass.png`, fullPage: true });

    // Advance to Completion Card
    await page.getByRole('button', { name: /계속하기/ }).click();
    await page.waitForSelector('.completion-card');
    await page.screenshot({ path: `${output}/14-app-g03-completion-card.png`, fullPage: true });
  });

  // LocalStorage Persistence
  await assert('LocalStorage persistence restoration of completed GPU lesson', async () => {
    await page.reload();
    await page.waitForSelector('.completion-card');
    const completedItems = await page.locator('.milestone-item').count();
    if (completedItems < 4) throw Error(`Expected at least 4 milestones, found: ${completedItems}`);
    await checkViewport(page, 'Desktop 1440');
    await page.screenshot({ path: `${output}/15-app-g03-persistence-restored.png`, fullPage: true });
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
    await phone.waitForSelector('.player-viewport, .app-container');
    await phone.screenshot({ path: `${output}/16-app-g03-mobile-375.png`, fullPage: true });
    await checkViewport(phone, 'Mobile 375px');

    await phone.setViewportSize({ width: 320, height: 600 });
    await phone.waitForTimeout(200);
    await phone.screenshot({ path: `${output}/17-app-g03-mobile-320.png`, fullPage: true });
    await checkViewport(phone, 'Mobile 320px');
  });

  await mobile.close();
} finally {
  if (browser) await browser.close();
  server.kill();
}

if (failures.length) {
  console.error('Chromium QA Failures:', failures);
  process.exit(1);
}

console.log(JSON.stringify({ status: 'passed', artifacts: output }, null, 2));
