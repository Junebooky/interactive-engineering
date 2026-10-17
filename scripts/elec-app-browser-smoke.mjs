import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium, devices } from 'playwright';

const port = 4186;
const baseUrl = `http://127.0.0.1:${port}/`;
const output = 'browser-evidence/elec-app';
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

async function ready(timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(baseUrl);
      if (res.ok) return;
    } catch {
      // wait
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Server failed to start on ${baseUrl} within ${timeoutMs}ms`);
}

try {
  await ready();
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desktop.newPage();
  page.on('pageerror', (error) => failures.push({ label: 'Desktop Page Error', error: String(error) }));

  // Catalog -> Electricity Lesson Navigation
  await assert('Catalog to Electricity Lesson Navigation', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('.catalog-btn');
    await page.locator('.catalog-btn').click();
    await page.waitForSelector('.catalog-modal');

    // Click Electricity lesson chip in course card
    const elecChip = page.locator('.course-lesson-chip').filter({ hasText: '전기' });
    await elecChip.waitFor({ state: 'visible' });
    await elecChip.click();

    // Verify breadcrumb shows Electricity lesson title
    await page.waitForSelector('.lesson-title-text');
    const title = await page.locator('.lesson-title-text').textContent();
    if (!title?.includes('전기') && !title?.includes('12')) throw Error(`Expected Electricity lesson breadcrumb, got: ${title}`);
    await page.screenshot({ path: `${output}/01-app-catalog-elec-entry.png`, fullPage: true });
  });

  // Step 0: Concept Intro
  await assert('Step 0 Electricity concept intro and voice toggle', async () => {
    await page.waitForSelector('.prompt-title');
    const title = await page.locator('.prompt-title').textContent();
    if (!title?.includes('전압') && !title?.includes('전류')) throw Error(`Unexpected step 0 title: ${title}`);

    // Voice button test
    const voiceBtn = page.locator('.voice-toggle-btn');
    if (await voiceBtn.count()) {
      await voiceBtn.click();
      await page.waitForTimeout(200);
    }
    await page.screenshot({ path: `${output}/02-app-s0-elec-intro.png`, fullPage: true });

    // Confirm & Advance
    await page.getByRole('button', { name: /이해했습니다/ }).click();
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 1: 12-S01 옴의 법칙과 스위치 개폐
  await assert('Step 1 12-S01 옴의 법칙과 스위치 개폐 pass', async () => {
    await page.waitForSelector('.prompt-title');
    if (!await page.locator('.a05-veiled').count()) throw Error('Veiled state not visible before prediction');
    await page.screenshot({ path: `${output}/03-app-s1-elec-veiled.png`, fullPage: true });

    // Select prediction
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '전압은 5V로 유지되지만' }).click();
    if (await page.locator('.a05-veiled').count()) throw Error('Veiled state still present after prediction');
    await page.screenshot({ path: `${output}/04-app-s1-elec-unveiled.png`, fullPage: true });

    // Toggle switch: Closed (5mA) then Open (0mA)
    const switchBtn = page.locator('#control-closed .switch-button');
    await switchBtn.click();
    await page.waitForTimeout(200);

    // Toggle direction: electron then conventional
    const electronBtn = page.locator('#control-direction .radio-option-btn').filter({ hasText: '전자의 실제 이동' });
    await electronBtn.click();
    await page.waitForTimeout(200);

    const conventionalBtn = page.locator('#control-direction .radio-option-btn').filter({ hasText: '관습전류' });
    await conventionalBtn.click();
    await page.waitForTimeout(200);

    // Toggle switch back to open
    await switchBtn.click();
    await page.waitForTimeout(200);

    // Select answer
    await page.locator('#control-answer .radio-option-btn').filter({ hasText: '전압은 양단 전위차이므로' }).click();
    await page.screenshot({ path: `${output}/05-app-s1-elec-answered.png`, fullPage: true });

    // Evaluate
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/06-app-s1-elec-pass.png`, fullPage: true });

    // Why modal
    await page.getByRole('button', { name: /Why\? 원리/ }).click();
    await page.waitForSelector('.why-modal, .modal-backdrop');
    await page.screenshot({ path: `${output}/07-app-s1-elec-why-modal.png`, fullPage: true });
    await page.locator('.modal-close-btn').click();

    // Advance to Step 2
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 2: 12-S02 직렬/병렬 KCL
  await assert('Step 2 12-S02 직렬/병렬 KCL pass', async () => {
    await page.waitForSelector('.prompt-title');

    // Prediction
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '직렬은 2kΩ에 2.5mA, 병렬은 500Ω' }).click();
    await page.waitForTimeout(200);

    // Toggle topology: parallel then series
    const parallelBtn = page.locator('#control-topology .radio-option-btn').filter({ hasText: '병렬 연결' });
    await parallelBtn.click();
    await page.waitForTimeout(200);

    const seriesBtn = page.locator('#control-topology .radio-option-btn').filter({ hasText: '직렬 연결' });
    await seriesBtn.click();
    await page.waitForTimeout(200);

    // Answer
    await page.locator('#control-answer .radio-option-btn').filter({ hasText: '전하 보존법칙에 의해 유입 전류의 합과' }).click();
    await page.screenshot({ path: `${output}/08-app-s2-elec-answered.png`, fullPage: true });

    // Evaluate
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/09-app-s2-elec-pass.png`, fullPage: true });

    // Advance to Step 3
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 3: 12-S03 RC 시간상수 충·방전
  await assert('Step 3 12-S03 RC 시간상수 충·방전 pass', async () => {
    await page.waitForSelector('.prompt-title');

    // Prediction
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '약 63%에 도달하여 약 3.16V' }).click();
    await page.waitForTimeout(200);

    // Move slider to 10ms in charge mode
    const timeSlider = page.locator('#control-timeMs input[type="range"]');
    await timeSlider.fill('10');
    await timeSlider.dispatchEvent('input');
    await page.waitForTimeout(200);

    // Switch to discharge mode and move slider to 10ms
    const dischargeBtn = page.locator('#control-mode .radio-option-btn').filter({ hasText: '방전' });
    await dischargeBtn.click();
    await page.waitForTimeout(200);
    await timeSlider.fill('10');
    await timeSlider.dispatchEvent('input');
    await page.waitForTimeout(200);

    // Change R to 2kΩ
    const r2kBtn = page.locator('#control-rOhms .radio-option-btn').filter({ hasText: '2 kΩ' });
    await r2kBtn.click();
    await page.waitForTimeout(200);

    // Answer
    await page.locator('#control-answer .radio-option-btn').filter({ hasText: '시간상수 τ=R·C에 따라 지수적으로' }).click();
    await page.screenshot({ path: `${output}/10-app-s3-elec-answered.png`, fullPage: true });

    // Evaluate
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/11-app-s3-elec-pass.png`, fullPage: true });

    // Advance to Step 4
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 4: 12-S04 전력과 에너지, 커패시터 정전에너지
  await assert('Step 4 12-S04 전력과 에너지, 커패시터 정전에너지 pass to completion', async () => {
    await page.waitForSelector('.prompt-title');

    // Prediction
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '전력은 50mW, 10초 에너지는 0.5J' }).click();
    await page.waitForTimeout(200);

    // Select 5V, 10mA, 10s
    await page.locator('#control-powerVolts .radio-option-btn').filter({ hasText: '5 V' }).click();
    await page.locator('#control-loadMilliAmps .radio-option-btn').filter({ hasText: '10 mA' }).click();
    await page.locator('#control-seconds .radio-option-btn').filter({ hasText: '10 초' }).click();
    await page.waitForTimeout(200);

    // Select 10V
    await page.locator('#control-powerVolts .radio-option-btn').filter({ hasText: '10 V' }).click();
    await page.waitForTimeout(200);

    // Answer
    await page.locator('#control-answer .radio-option-btn').filter({ hasText: '전력(W)은 단위 시간당 에너지 변환율' }).click();
    await page.screenshot({ path: `${output}/12-app-s4-elec-answered.png`, fullPage: true });

    // Evaluate
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/13-app-s4-elec-pass.png`, fullPage: true });

    // Complete lesson
    await page.getByRole('button', { name: /계속하기/ }).click();
    await page.waitForSelector('.completion-card', { timeout: 10000 });
    await page.screenshot({ path: `${output}/14-app-elec-completion-card.png`, fullPage: true });
  });

  // Scenario 7: LocalStorage persistence
  await assert('LocalStorage persistence restoration of completed Electricity lesson', async () => {
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.completion-card', { timeout: 10000 });
    await page.screenshot({ path: `${output}/15-app-elec-persistence-restored.png`, fullPage: true });
  });

  // Scenario 8: Mobile 375px & 320px responsive layout
  await assert('Mobile 375px & 320px responsive layout without horizontal overflow', async () => {
    const mobileContext = await browser.newContext({
      ...devices['iPhone 13'],
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(baseUrl);
    await mobilePage.waitForLoadState('networkidle');

    const hasHOverflow = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    if (hasHOverflow) throw new Error('Mobile 375px has horizontal scroll overflow!');
    await mobilePage.screenshot({ path: `${output}/16-app-elec-mobile-375.png` });

    await mobilePage.setViewportSize({ width: 320, height: 568 });
    await mobilePage.waitForTimeout(300);
    const hasHOverflow320 = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    if (hasHOverflow320) throw new Error('Mobile 320px has horizontal scroll overflow!');
    await mobilePage.screenshot({ path: `${output}/17-app-elec-mobile-320.png` });

    await mobileContext.close();
  });

} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}

if (failures.length > 0) {
  console.error(`Total failures: ${failures.length}`);
  for (const f of failures) {
    console.error(`- ${f.label}: ${f.error}`);
  }
  process.exit(1);
} else {
  console.log(JSON.stringify({ status: 'passed', artifacts: output }, null, 2));
}
