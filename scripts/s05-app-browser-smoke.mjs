import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium, devices } from 'playwright';

const port = 4184;
const baseUrl = `http://127.0.0.1:${port}/`;
const output = 'browser-evidence/s05-app';
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

  // Catalog -> SRAM Lesson Navigation
  await assert('Catalog to SRAM Lesson Navigation', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('.catalog-btn');
    await page.locator('.catalog-btn').click();
    await page.waitForSelector('.catalog-modal');

    // Click SRAM lesson chip in course card
    const sramChip = page.locator('.course-lesson-chip').filter({ hasText: 'SRAM' });
    await sramChip.waitFor({ state: 'visible' });
    await sramChip.click();

    // Verify breadcrumb shows SRAM lesson title
    await page.waitForSelector('.lesson-title-text');
    const title = await page.locator('.lesson-title-text').textContent();
    if (!title?.includes('SRAM')) throw Error(`Expected SRAM lesson breadcrumb, got: ${title}`);
    await page.screenshot({ path: `${output}/01-app-catalog-sram-entry.png`, fullPage: true });
  });

  // Step 0: Concept Intro
  await assert('Step 0 SRAM concept intro and voice toggle', async () => {
    await page.waitForSelector('.prompt-title');
    const title = await page.locator('.prompt-title').textContent();
    if (!title?.includes('SRAM') && !title?.includes('정적 메모리')) throw Error(`Unexpected step 0 title: ${title}`);

    // Voice toggle
    const voiceBtn = page.locator('.voice-toggle-btn');
    await voiceBtn.click();
    await page.screenshot({ path: `${output}/02-app-s05-step0-concept.png`, fullPage: true });

    // Confirm & Advance
    await page.getByRole('button', { name: /이해했습니다/ }).click();
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 1: Cross-Coupled Inverters (step-sram-s1-cross-coupled)
  await assert('Step 1 S01 cross-coupled inverters, Q0/Q1 toggling, supply volatility check, and pass', async () => {
    await page.waitForSelector('.prompt-title');
    // Veiled state
    if (!await page.locator('.a05-veiled').count()) throw Error('Veiled state not visible before prediction');
    await page.screenshot({ path: `${output}/03-app-s05-s01-veiled.png`, fullPage: true });

    // Select prediction
    await page.locator('.radio-option-btn').filter({ hasText: '서로 반대되는 논리값' }).click();
    if (await page.locator('.a05-veiled').count()) throw Error('Veiled state still present after prediction');
    await page.screenshot({ path: `${output}/04-app-s05-s01-unveiled.png`, fullPage: true });

    // Actual UI toggles for Q and Supply
    const qSwitch = page.locator('#control-q button[role="switch"]');
    const supplySwitch = page.locator('#control-supply button[role="switch"]');

    // Toggle Q to 0 (records 'q0')
    await qSwitch.click();
    // Toggle Q back to 1 (records 'q1')
    await qSwitch.click();
    // Turn Supply OFF (records 'volatile')
    await supplySwitch.click();

    // Verify SVG reflects power OFF / uncertainty
    const svgText = await page.locator('.a05-sram-visual').textContent();
    if (!svgText?.includes('전원 OFF') && !svgText?.includes('?')) throw Error(`Visual does not show volatile state: ${svgText}`);

    // Restore supply
    await supplySwitch.click();

    // Misconception test
    await page.locator('.radio-option-btn').filter({ hasText: '플래시 메모리처럼' }).click();
    await page.getByRole('button', { name: /확인하기/ }).click();
    if (!await page.locator('.rule-pill.pill-fail').count()) throw Error('Misconception did not fail rule');
    await page.screenshot({ path: `${output}/05-app-s05-s01-misconception.png`, fullPage: true });

    // View Hint
    await page.getByRole('button', { name: /힌트 보기/ }).click();
    await page.waitForSelector('.tutor-panel, .hint-card');

    // Correct Answer & Pass
    await page.locator('.radio-option-btn').filter({ hasText: '상보적인 값을 지탱하지만' }).click();
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/06-app-s05-s01-pass.png`, fullPage: true });

    // Deep-dive Why modal
    await page.getByRole('button', { name: /Why\? 원리/ }).click();
    await page.waitForSelector('.why-modal, .modal-backdrop');
    await page.screenshot({ path: `${output}/07-app-s05-s01-why-modal.png`, fullPage: true });
    await page.locator('.modal-close-btn').click();

    // Advance to Step 2
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 2: 6T SRAM Access (step-sram-s2-6t-access)
  await assert('Step 2 S02 6T SRAM wordline isolation, write/read mode toggles, and pass', async () => {
    await page.waitForSelector('.prompt-title');
    // Prediction
    await page.locator('.radio-option-btn').filter({ hasText: '격리 보존' }).click();

    const wlSwitch = page.locator('#control-wl button[role="switch"]');
    // WL is initially OFF (records 'isolated')
    // Turn WL ON (records 'wrote')
    await wlSwitch.click();

    // Switch to Read Mode (records 'read')
    await page.locator('.radio-option-btn').filter({ hasText: '읽기 모드' }).click();

    // Verify read disturbance warning in SVG
    const svgText = await page.locator('.a05-sram-visual').textContent();
    if (!svgText?.includes('read disturb') && !svgText?.includes('읽기')) throw Error(`Visual does not indicate read mode: ${svgText}`);

    // Turn WL OFF
    await wlSwitch.click();
    await page.screenshot({ path: `${output}/08-app-s05-s02-6t-access.png`, fullPage: true });

    // Correct Answer
    await page.locator('.radio-option-btn').filter({ hasText: '4개의 래치 트랜지스터와 2개의 접근 nMOS' }).click();
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/09-app-s05-s02-pass.png`, fullPage: true });

    // Advance to Step 3
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 3: CPU Cache vs DRAM (step-sram-s3-cpu-cache)
  await assert('Step 3 S03 CPU cache 1-line (41) vs 2-line (32) toy LRU comparison, and pass', async () => {
    await page.waitForSelector('.prompt-title');
    // Prediction
    await page.locator('.radio-option-btn').filter({ hasText: '다시 쓰이는 데이터가 캐시에 남아 있으면' }).click();

    // Run 1-line simulation
    const runSwitch = page.locator('#control-cacheRun button[role="switch"]');
    await runSwitch.click();

    let visualText = await page.locator('.a05-sram-visual').textContent();
    if (!visualText?.includes('41')) throw Error(`1-line cache did not produce 41 toy units: ${visualText}`);

    // Switch to 2-line cache
    await page.locator('.radio-option-btn').filter({ hasText: '2라인 캐시' }).click();
    visualText = await page.locator('.a05-sram-visual').textContent();
    if (!visualText?.includes('32')) throw Error(`2-line cache did not produce 32 toy units: ${visualText}`);

    await page.screenshot({ path: `${output}/10-app-s05-s03-cpu-cache.png`, fullPage: true });

    // Concept answer
    await page.locator('.radio-option-btn').filter({ hasText: '지역성을 활용하여 반복 접근 지연을 줄이며' }).click();
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/11-app-s05-s03-pass.png`, fullPage: true });

    // Advance to Step 4
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 4: Data Locality (step-sram-s4-data-locality)
  await assert('Step 4 S04 GPU weights residency, continuous input movement, and completion', async () => {
    await page.waitForSelector('.prompt-title');
    // Prediction
    await page.locator('.radio-option-btn').filter({ hasText: '가중치는 GPU 메모리에서 재사용하므로' }).click();

    // Toggle residency OFF (records 'not-resident')
    const residentSwitch = page.locator('#control-resident button[role="switch"]');
    // Toggle ON (records 'resident')
    await residentSwitch.click();

    // Toggle sendInput (records 'input')
    const inputSwitch = page.locator('#control-sendInput button[role="switch"]');
    await inputSwitch.click();

    await page.screenshot({ path: `${output}/12-app-s05-s04-data-locality.png`, fullPage: true });

    // Concept answer
    await page.locator('.radio-option-btn').filter({ hasText: '모델 가중치는 GPU 메모리에 상주시켜' }).click();
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');

    // Advance to Completion Card
    await page.getByRole('button', { name: /계속하기/ }).click();
    await page.waitForSelector('.completion-card');
    await page.screenshot({ path: `${output}/13-app-s05-completion-card.png`, fullPage: true });
  });

  // LocalStorage persistence restoration
  await assert('LocalStorage persistence restoration of completed SRAM lesson', async () => {
    await page.reload();
    await page.waitForSelector('.completion-card');
    const completedItems = await page.locator('.milestone-item').count();
    if (completedItems < 4) throw Error(`Expected at least 4 milestones, found: ${completedItems}`);
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
    await phone.waitForSelector('.player-viewport, .app-container');
    await phone.screenshot({ path: `${output}/14-app-s05-mobile-375.png`, fullPage: true });
    await checkViewport(phone, 'Mobile 375');

    // Resize to 320px
    await phone.setViewportSize({ width: 320, height: 600 });
    await phone.screenshot({ path: `${output}/15-app-s05-mobile-320.png`, fullPage: true });
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
