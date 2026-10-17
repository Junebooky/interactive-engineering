import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium, devices } from 'playwright';

const port = 4183;
const baseUrl = `http://127.0.0.1:${port}/`;
const output = 'browser-evidence/d02-app';
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

  // Catalog -> DRAM Lesson Entry
  await assert('Catalog to DRAM Lesson Navigation', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('.catalog-btn');
    await page.locator('.catalog-btn').click();
    await page.waitForSelector('.catalog-modal');

    // Click DRAM lesson chip in course card
    const dramChip = page.locator('.course-lesson-chip').filter({ hasText: 'DRAM 1T1C' });
    await dramChip.waitFor({ state: 'visible' });
    await dramChip.click();

    // Verify breadcrumb shows DRAM lesson title
    await page.waitForSelector('.lesson-title-text');
    const title = await page.locator('.lesson-title-text').textContent();
    if (!title?.includes('DRAM')) throw Error(`Expected DRAM lesson breadcrumb, got: ${title}`);
    await page.screenshot({ path: `${output}/01-app-catalog-dram-entry.png`, fullPage: true });
  });

  // Step 0: Concept Intro
  await assert('Step 0 DRAM concept intro and voice toggle', async () => {
    await page.waitForSelector('.prompt-title');
    const title = await page.locator('.prompt-title').textContent();
    if (!title?.includes('트랜지스터') && !title?.includes('커패시터') && !title?.includes('DRAM')) throw Error(`Unexpected step 0 title: ${title}`);

    // Voice toggle
    const voiceBtn = page.locator('.voice-toggle-btn');
    await voiceBtn.click();
    await page.screenshot({ path: `${output}/02-app-d02-step0-concept.png`, fullPage: true });

    // Confirm & Advance
    await page.getByRole('button', { name: /이해했습니다/ }).click();
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 1: Write & Isolation (step-dram-s1-write)
  await assert('Step 1 S01 veiled prediction, WL/BL physical toggles, isolation check, and pass', async () => {
    await page.waitForSelector('.prompt-title');
    // Veiled state
    if (!await page.locator('.a05-veiled').count()) throw Error('Veiled state not visible before prediction');
    await page.screenshot({ path: `${output}/03-app-d02-s01-veiled.png`, fullPage: true });

    // Select prediction
    await page.locator('.radio-option-btn').filter({ hasText: 'WL을 열어 충전한 뒤' }).click();
    if (await page.locator('.a05-veiled').count()) throw Error('Veiled state still present after prediction');
    await page.screenshot({ path: `${output}/04-app-d02-s01-unveiled.png`, fullPage: true });

    // Actual UI toggles for WL and BL
    const wlSwitch = page.locator('#control-wl button[role="switch"]');
    const blSwitch = page.locator('#control-bl button[role="switch"]');

    // Turn WL ON (WL=1, BL=1 -> cell charged to 1.0)
    await wlSwitch.click();
    // Turn WL OFF (WL=0 -> cell held at 1.0)
    await wlSwitch.click();
    // Turn BL OFF (BL=0, cell remains held at 1.0)
    await blSwitch.click();

    // Verify cell voltage readout shows 1.00 × VDD
    const readoutText = await page.locator('.a05-readouts').textContent();
    if (!readoutText?.includes('1.00')) throw Error(`Readout does not show 1.00 VDD held cell: ${readoutText}`);

    // Misconception test
    await page.locator('.radio-option-btn').filter({ hasText: '영구적으로 전하를 생성' }).click();
    await page.getByRole('button', { name: /확인하기/ }).click();
    if (!await page.locator('.rule-pill.pill-fail').count()) throw Error('Misconception did not fail rule');
    await page.screenshot({ path: `${output}/05-app-d02-s01-misconception.png`, fullPage: true });

    // View Hint
    await page.getByRole('button', { name: /힌트 보기/ }).click();
    await page.waitForSelector('.tutor-panel, .hint-card');

    // Correct Answer & Pass
    await page.locator('.radio-option-btn').filter({ hasText: 'WL=0으로 트랜지스터를 끄면' }).click();
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/06-app-d02-s01-pass.png`, fullPage: true });

    // Deep-dive Why modal
    await page.getByRole('button', { name: /Why\? 원리/ }).click();
    await page.waitForSelector('.why-modal, .modal-backdrop');
    await page.screenshot({ path: `${output}/07-app-d02-s01-why-modal.png`, fullPage: true });
    await page.locator('.modal-close-btn').click();

    // Advance to Step 2
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 2: Sense & Restore (step-dram-s2-sense-restore)
  await assert('Step 2 S02 sense and restore dual-bit cycle, 0.55V / 0.45V dynamic readouts, and pass', async () => {
    await page.waitForSelector('.prompt-title');
    // Prediction
    await page.locator('.radio-option-btn').filter({ hasText: '전하가 섞여' }).click();

    // Phase 1 -> 2 -> 3 -> 4 on Bit 1
    await page.locator('.radio-option-btn').filter({ hasText: '1. 사전충전' }).click();
    await page.locator('.radio-option-btn').filter({ hasText: '2. 전하 공유' }).click();
    let readouts = await page.locator('.a05-readouts').textContent();
    if (!readouts?.includes('0.55')) throw Error(`Bit 1 share did not produce 0.55 VDD readout: ${readouts}`);

    await page.locator('.radio-option-btn').filter({ hasText: '3. 센스 증폭' }).click();
    await page.locator('.radio-option-btn').filter({ hasText: '4. 재충전 복원' }).click();
    readouts = await page.locator('.a05-readouts').textContent();
    if (!readouts?.includes('복원 완료')) throw Error(`Phase 4 did not complete restore: ${readouts}`);

    // Test Bit 0 dynamic 0.45V readout (A07 EDU-09 requirement)
    await page.locator('.radio-option-btn').filter({ hasText: '비트 0 (0V 방전)' }).click();
    await page.locator('.radio-option-btn').filter({ hasText: '2. 전하 공유' }).click();
    readouts = await page.locator('.a05-readouts').textContent();
    if (!readouts?.includes('0.45')) throw Error(`Bit 0 share did not produce 0.45 VDD readout: ${readouts}`);
    await page.locator('.radio-option-btn').filter({ hasText: '4. 재충전 복원' }).click();

    await page.screenshot({ path: `${output}/08-app-d02-s02-sense-restore.png`, fullPage: true });

    // Correct Answer
    await page.locator('.radio-option-btn').filter({ hasText: '전하 공유로 원래 셀 데이터가 훼손' }).click();
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/09-app-d02-s02-pass.png`, fullPage: true });

    // Advance to Step 3
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 3: Leakage & Refresh (step-dram-s3-leak-refresh)
  await assert('Step 3 S03 leakage time slider, refresh button atomic restore, and pass', async () => {
    await page.waitForSelector('.prompt-title');
    // Prediction
    await page.locator('.radio-option-btn').filter({ hasText: '미세한 누설 전류 때문에' }).click();

    // Elapsed slider manipulation
    const slider = page.locator('input[type="range"]');
    await slider.waitFor({ state: 'visible' });
    await slider.evaluate((el) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, '1.5');
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Check voltage decreased
    let readouts = await page.locator('.a05-readouts').textContent();
    if (!readouts?.includes('0.70')) throw Error(`Leakage at t=1.5 did not reduce voltage to 0.70 VDD: ${readouts}`);

    // Refresh button toggle
    const refreshSwitch = page.locator('#control-refresh button[role="switch"]');
    await refreshSwitch.click();

    // Voltage restored to 1.00
    readouts = await page.locator('.a05-readouts').textContent();
    if (!readouts?.includes('1.00')) throw Error(`Refresh did not restore voltage to 1.00 VDD: ${readouts}`);
    await page.screenshot({ path: `${output}/10-app-d02-s03-leak-refresh.png`, fullPage: true });

    // Concept answer
    await page.locator('.radio-option-btn').filter({ hasText: '누설로 전압 마진이 줄어들어' }).click();
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/11-app-d02-s03-pass.png`, fullPage: true });

    // Advance to Step 4
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Step 4: Row Bank Parallelism (step-dram-s4-row-bank)
  await assert('Step 4 S04 bank parallelism timeline comparison, conditional overlap, and completion', async () => {
    await page.waitForSelector('.prompt-title');
    // Prediction
    await page.locator('.radio-option-btn').filter({ hasText: '내부 동작을 일부 겹쳐서' }).click();

    // Bank 1 selection
    await page.locator('.radio-option-btn').filter({ hasText: '1개 뱅크' }).click();
    let readouts = await page.locator('.a05-readouts').textContent();
    if (!readouts?.includes('불가')) throw Error(`Bank 1 did not indicate overlap impossible: ${readouts}`);

    // Bank 2 selection
    await page.locator('.radio-option-btn').filter({ hasText: '2개 뱅크' }).click();
    readouts = await page.locator('.a05-readouts').textContent();
    if (!readouts?.includes('가능')) throw Error(`Bank 2 did not indicate overlap possible: ${readouts}`);

    await page.screenshot({ path: `${output}/12-app-d02-s04-banks-parallel.png`, fullPage: true });

    // Concept answer
    await page.locator('.radio-option-btn').filter({ hasText: '외부 공유 버스 제약이 있지만' }).click();
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');

    // Advance to Completion Card
    await page.getByRole('button', { name: /계속하기/ }).click();
    await page.waitForSelector('.completion-card');
    await page.screenshot({ path: `${output}/13-app-d02-completion-card.png`, fullPage: true });
  });

  // LocalStorage persistence restoration
  await assert('LocalStorage persistence restoration of completed DRAM lesson', async () => {
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
    await phone.screenshot({ path: `${output}/14-app-d02-mobile-375.png`, fullPage: true });
    await checkViewport(phone, 'Mobile 375');

    // Resize to 320px
    await phone.setViewportSize({ width: 320, height: 600 });
    await phone.screenshot({ path: `${output}/15-app-d02-mobile-320.png`, fullPage: true });
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
