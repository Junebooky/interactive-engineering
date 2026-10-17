import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium, devices } from 'playwright';

const port = 4188;
const baseUrl = `http://127.0.0.1:${port}/`;
const output = 'browser-evidence/mos-cap-app';
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

  // Scenario 1: Catalog -> MOS Capacitor Lesson Navigation
  await assert('Catalog to MOS Capacitor Lesson Navigation', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('.catalog-btn');
    await page.locator('.catalog-btn').click();
    await page.waitForSelector('.catalog-modal');

    // Click MOS Capacitor lesson chip in semiconductor course card
    const mosChip = page.locator('.course-lesson-chip').filter({ hasText: 'MOS 커패시터' });
    await mosChip.waitFor({ state: 'visible' });
    await mosChip.click();

    // Verify breadcrumb shows MOS Capacitor lesson title
    await page.waitForSelector('.lesson-title-text');
    const title = await page.locator('.lesson-title-text').textContent();
    if (!title?.includes('MOS') || !title?.includes('14')) throw Error(`Expected MOS Capacitor lesson breadcrumb, got: ${title}`);
    await page.screenshot({ path: `${output}/01-app-catalog-mos-cap-entry.png`, fullPage: true });
  });

  // Scenario 2: Voice Settings Modal and Audition QA (Issue #41)
  await assert('Voice Settings Modal, Audition & Neural TTS comparison QA (Issue #41)', async () => {
    const settingsBtn = page.locator('.voice-settings-btn');
    await settingsBtn.waitFor({ state: 'visible' });
    await settingsBtn.click();

    await page.waitForSelector('.voice-settings-modal');
    await page.screenshot({ path: `${output}/02-app-voice-settings-modal.png`, fullPage: true });

    try {
      // Speed option adjustment: select 1.1x
      const speed11 = page.locator('.speed-option-btn').filter({ hasText: '1.1x' });
      await speed11.scrollIntoViewIfNeeded();
      await speed11.click();
      await page.waitForTimeout(100);

      // Audition preview listening
      const previewBtn = page.locator('.btn-preview-voice');
      await previewBtn.scrollIntoViewIfNeeded();
      await previewBtn.click();
      await page.waitForTimeout(200);

      // Switch to Neural TTS comparison tab
      const neuralTab = page.locator('.voice-tab-btn').filter({ hasText: 'Neural TTS' });
      await neuralTab.scrollIntoViewIfNeeded();
      await neuralTab.click();
      await page.waitForSelector('.neural-comparison-table');
      await page.screenshot({ path: `${output}/03-app-neural-tts-comparison.png`, fullPage: true });
    } finally {
      // Close modal
      const closeBtn = page.locator('.btn-modal-done');
      if (await closeBtn.count()) {
        await closeBtn.click();
      } else {
        await page.locator('.modal-close-btn').click();
      }
      await page.waitForSelector('.voice-settings-modal', { state: 'detached' });
    }
  });

  // Scenario 3: Step 0 Concept Intro
  await assert('Step 0 MOS Capacitor concept intro and advance', async () => {
    await page.waitForSelector('.prompt-title');
    const title = await page.locator('.prompt-title').textContent();
    if (!title?.includes('전기장') && !title?.includes('MOS')) throw Error(`Unexpected step 0 title: ${title}`);

    // Voice button test
    const voiceBtn = page.locator('.voice-toggle-btn');
    if (await voiceBtn.count()) {
      await voiceBtn.click();
      await page.waitForTimeout(200);
    }
    await page.screenshot({ path: `${output}/04-app-s0-mos-intro.png`, fullPage: true });

    // Confirm & Advance
    await page.getByRole('button', { name: /이해했습니다/ }).click();
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Scenario 4: Step 1 14-S01 Oxide Field & Charging Current (with negative test)
  await assert('Step 1 14-S01 Oxide field pass & negative test', async () => {
    await page.waitForSelector('.prompt-title');
    if (!await page.locator('.a05-veiled').count()) throw Error('Veiled state not visible before prediction');
    await page.screenshot({ path: `${output}/05-app-s1-veiled.png`, fullPage: true });

    // Select prediction
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '직접 전자가 통과하지 않아도' }).click();
    if (await page.locator('.a05-veiled').count()) throw Error('Veiled state still present after prediction');

    // Negative Test: select misconception m1
    const wrongAns = page.locator('#control-answer .radio-option-btn').filter({ hasText: '전기장도 절대로 실리콘에 닿지 않아요' });
    await wrongAns.scrollIntoViewIfNeeded();
    await wrongAns.click();
    await page.getByRole('button', { name: /확인하기/ }).click();

    // Verify rejection
    await page.waitForSelector('.status-badge.incorrect, .fail-banner, .btn-retry');
    await page.screenshot({ path: `${output}/06-app-s1-negative-fail.png`, fullPage: true });

    // Retry
    await page.locator('.btn-retry').click();

    // Operate controls: gateV -0.5V -> +0.3V, phase switching -> steady
    await page.locator('#control-gateV .radio-option-btn').filter({ hasText: '−0.5V' }).click();
    await page.waitForTimeout(100);
    await page.locator('#control-gateV .radio-option-btn').filter({ hasText: '+0.3V' }).click();
    await page.waitForTimeout(100);
    await page.locator('#control-phase .radio-option-btn').filter({ hasText: '전압 변경 순간' }).click();
    await page.waitForTimeout(100);
    await page.locator('#control-phase .radio-option-btn').filter({ hasText: '정착 후' }).click();
    await page.waitForTimeout(100);

    // Select correct answer
    const ans1 = page.locator('#control-answer .radio-option-btn').filter({ hasText: '절연막 속 정상 DC 전도와 전기장 효과는 달라요' });
    await ans1.scrollIntoViewIfNeeded();
    await ans1.click();

    // Check Answer
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/07-app-s1-passed.png`, fullPage: true });

    // Advance
    await page.getByRole('button', { name: /계속하기/ }).click();
    await page.waitForFunction(() => document.querySelector('.prompt-title')?.textContent?.includes('2단계'));
  });

  // Scenario 5: Step 2 14-S02 Accumulation, Depletion, Inversion
  await assert('Step 2 14-S02 Accumulation, Depletion, Inversion pass', async () => {
    // Prediction
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '도핑 원자는 그대로이고' }).click();
    await page.waitForTimeout(150);

    // Operate all 4 gate biases: -0.5V -> 0V -> +0.3V -> +1.1V
    await page.locator('#control-gateV .radio-option-btn').filter({ hasText: '−0.5V' }).click();
    await page.waitForTimeout(100);
    await page.locator('#control-gateV .radio-option-btn').filter({ hasText: '0V' }).click();
    await page.waitForTimeout(100);
    await page.locator('#control-gateV .radio-option-btn').filter({ hasText: '+0.3V' }).click();
    await page.waitForTimeout(100);
    await page.locator('#control-gateV .radio-option-btn').filter({ hasText: '+1.1V' }).click();
    await page.waitForTimeout(100);

    // Correct Answer
    const ans2 = page.locator('#control-answer .radio-option-btn').filter({ hasText: 'p형 bulk와 고정 acceptor' });
    await ans2.scrollIntoViewIfNeeded();
    await ans2.click();

    // Check Answer
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/08-app-s2-passed.png`, fullPage: true });

    // Advance
    await page.getByRole('button', { name: /계속하기/ }).click();
    await page.waitForFunction(() => document.querySelector('.prompt-title')?.textContent?.includes('3단계'));
  });

  // Scenario 6: Step 3 14-S03 Oxide Capacitance & C-V
  await assert('Step 3 14-S03 Oxide Capacitance & C-V pass', async () => {
    // Prediction
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '절반' }).click();
    await page.waitForTimeout(150);

    // Operate oxideNm: 5nm -> 10nm
    await page.locator('#control-oxideNm .radio-option-btn').filter({ hasText: '10nm' }).click();
    await page.waitForTimeout(100);
    await page.locator('#control-oxideNm .radio-option-btn').filter({ hasText: '5nm' }).click();
    await page.waitForTimeout(100);

    // Toggle showCv
    await page.locator('#control-showCv .switch-button').click();
    await page.waitForTimeout(100);

    // Correct Answer
    const ans3 = page.locator('#control-answer .radio-option-btn').filter({ hasText: '기하학적 C′ox=εox/tox는 두께에 반비례하고' });
    await ans3.scrollIntoViewIfNeeded();
    await ans3.click();

    // Check Answer
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/09-app-s3-passed.png`, fullPage: true });

    // Advance
    await page.getByRole('button', { name: /계속하기/ }).click();
    await page.waitForFunction(() => document.querySelector('.prompt-title')?.textContent?.includes('4단계'));
  });

  // Scenario 7: Step 4 14-S04 Bridge to MOSFET
  await assert('Step 4 14-S04 Bridge to MOSFET pass', async () => {
    // Prediction
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '드레인 단자가 있어야 하고' }).click();
    await page.waitForTimeout(150);

    // Operate controls: device capacitor -> nmos, vds 0V -> 0.5V
    await page.locator('#control-device .radio-option-btn').filter({ hasText: '2단자 MOS 커패시터' }).click();
    await page.waitForTimeout(100);
    await page.locator('#control-device .radio-option-btn').filter({ hasText: 'n+ S/D 부착 nMOS' }).click();
    await page.waitForTimeout(100);
    await page.locator('#control-vds .radio-option-btn').filter({ hasText: '0V' }).click();
    await page.waitForTimeout(100);
    await page.locator('#control-vds .radio-option-btn').filter({ hasText: '+0.5V' }).click();
    await page.waitForTimeout(100);

    // Correct Answer
    const ans4 = page.locator('#control-answer .radio-option-btn').filter({ hasText: '커패시터엔 ID가 정의되지 않아요' });
    await ans4.scrollIntoViewIfNeeded();
    await ans4.click();

    // Check Answer
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/10-app-s4-passed.png`, fullPage: true });

    // Advance to Review
    await page.getByRole('button', { name: /계속하기/ }).click();
    await page.waitForFunction(() => document.querySelector('.prompt-title')?.textContent?.includes('종합 정리'));
  });

  // Scenario 8: Step 5 Synthesis Review & Progress Restore Across Page Reload
  await assert('Step 5 Review completion and Progress Reload QA', async () => {
    await page.waitForSelector('.prompt-title');
    const title = await page.locator('.prompt-title').textContent();
    if (!title?.includes('종합 정리') && !title?.includes('MOSFET')) throw Error(`Unexpected review step title: ${title}`);
    await page.screenshot({ path: `${output}/11-app-s5-synthesis-completed.png`, fullPage: true });

    // Confirm completion
    await page.getByRole('button', { name: /이해했습니다/ }).click();
    await page.waitForTimeout(200);

    // Reload page to test progress persistence
    await page.reload();
    await page.waitForSelector('.completion-card, .prompt-title');
    await page.screenshot({ path: `${output}/12-app-progress-restored.png`, fullPage: true });

    // Verify completed step dots
    const completedDots = await page.locator('.step-dot.completed').count();
    if (completedDots < 4) throw Error(`Expected at least 4 completed step dots after reload, found ${completedDots}`);
  });

  // Scenario 9: Mobile Viewport QA (iPhone 13 & 320px)
  await assert('Mobile Viewport (iPhone 13 & 320px) QA', async () => {
    const mobileContext = await browser.newContext({
      ...devices['iPhone 13'],
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(baseUrl);
    await mobilePage.waitForSelector('.catalog-btn');
    await mobilePage.locator('.catalog-btn').click();
    await mobilePage.waitForSelector('.catalog-modal');

    const mosChip = mobilePage.locator('.course-lesson-chip').filter({ hasText: 'MOS 커패시터' });
    await mosChip.waitFor({ state: 'visible' });
    await mosChip.click();

    await mobilePage.waitForSelector('.lesson-title-text');
    await mobilePage.screenshot({ path: `${output}/13-app-mobile-iphone13.png`, fullPage: true });

    // Narrow 320px check
    await mobilePage.setViewportSize({ width: 320, height: 640 });
    await mobilePage.waitForTimeout(200);
    await mobilePage.screenshot({ path: `${output}/14-app-mobile-320px.png`, fullPage: true });

    await mobileContext.close();
  });

} catch (error) {
  failures.push({ label: 'Fatal Execution Error', error: String(error) });
  console.error('FATAL', error);
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
  if (failures.length > 0) {
    console.error(`\nCompleted with ${failures.length} failures:`);
    for (const f of failures) {
      console.error(`- ${f.label}: ${f.error}`);
    }
    process.exit(1);
  } else {
    console.log('\nAll 9 MOS Capacitor App Browser QA scenarios PASSED successfully!');
    process.exit(0);
  }
}
