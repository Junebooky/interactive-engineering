import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium, devices } from 'playwright';

const port = 4187;
const baseUrl = `http://127.0.0.1:${port}/`;
const output = 'browser-evidence/pn-app';
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

  // Scenario 1: Catalog -> PN Lesson Navigation
  await assert('Catalog to PN Lesson Navigation', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('.catalog-btn');
    await page.locator('.catalog-btn').click();
    await page.waitForSelector('.catalog-modal');

    // Click PN lesson chip in semiconductor course card
    const pnChip = page.locator('.course-lesson-chip').filter({ hasText: '반도체 밴드' });
    await pnChip.waitFor({ state: 'visible' });
    await pnChip.click();

    // Verify breadcrumb shows PN lesson title
    await page.waitForSelector('.lesson-title-text');
    const title = await page.locator('.lesson-title-text').textContent();
    if (!title?.includes('반도체') && !title?.includes('11')) throw Error(`Expected PN lesson breadcrumb, got: ${title}`);
    await page.screenshot({ path: `${output}/01-app-catalog-pn-entry.png`, fullPage: true });
  });

  // Scenario 2: Step 0 Concept Intro
  await assert('Step 0 PN concept intro and advance', async () => {
    await page.waitForSelector('.prompt-title');
    const title = await page.locator('.prompt-title').textContent();
    if (!title?.includes('에너지띠') && !title?.includes('반도체')) throw Error(`Unexpected step 0 title: ${title}`);

    // Voice button test
    const voiceBtn = page.locator('.voice-toggle-btn');
    if (await voiceBtn.count()) {
      await voiceBtn.click();
      await page.waitForTimeout(200);
    }
    await page.screenshot({ path: `${output}/02-app-s0-pn-intro.png`, fullPage: true });

    // Confirm & Advance
    await page.getByRole('button', { name: /이해했습니다/ }).click();
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Scenario 3: Step 1 11-S01 밴드갭 & 여기
  await assert('Step 1 11-S01 밴드갭과 여기 pass', async () => {
    await page.waitForSelector('.prompt-title');
    if (!await page.locator('.a05-veiled').count()) throw Error('Veiled state not visible before prediction');
    await page.screenshot({ path: `${output}/03-app-s1-pn-veiled.png`, fullPage: true });

    // Select prediction
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '유한한 에너지 틈' }).click();
    if (await page.locator('.a05-veiled').count()) throw Error('Veiled state still present after prediction');
    await page.screenshot({ path: `${output}/04-app-s1-pn-unveiled.png`, fullPage: true });

    // Switch material: metal -> insulator -> silicon
    await page.locator('#control-material .radio-option-btn').filter({ hasText: '금속' }).click();
    await page.waitForTimeout(100);
    await page.locator('#control-material .radio-option-btn').filter({ hasText: '절연체' }).click();
    await page.waitForTimeout(100);
    await page.locator('#control-material .radio-option-btn').filter({ hasText: '실리콘' }).click();
    await page.waitForTimeout(100);

    // Toggle light on
    await page.locator('#control-light .switch-button').click();
    await page.waitForTimeout(100);

    // Answer selection
    const ans1 = page.locator('#control-answer .radio-option-btn').filter({ hasText: '빠져나간 전자 자리' });
    await ans1.scrollIntoViewIfNeeded();
    await ans1.click();
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${output}/05-app-s1-pn-configured.png`, fullPage: true });

    // Check Answer
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/06-app-s1-pn-passed.png`, fullPage: true });

    // Advance
    await page.getByRole('button', { name: /계속하기/ }).click();
    await page.waitForFunction(() => document.querySelector('.prompt-title')?.textContent?.includes('2단계'));
  });

  // Scenario 4: Step 2 11-S02 실리콘 도핑
  await assert('Step 2 11-S02 실리콘 도핑 pass', async () => {
    // Prediction
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '중성을 유지하며' }).click();
    await page.waitForTimeout(150);

    // Toggle dopant: Donor P -> Acceptor B
    await page.locator('#control-dopant .radio-option-btn').filter({ hasText: '인(P)' }).click();
    await page.waitForTimeout(150);
    await page.locator('#control-dopant .radio-option-btn').filter({ hasText: '붕소(B)' }).click();
    await page.waitForTimeout(150);

    // Answer
    const ans2 = page.locator('#control-answer .radio-option-btn').filter({ hasText: '벌크는 거의 중성' });
    await ans2.scrollIntoViewIfNeeded();
    await ans2.click();
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${output}/07-app-s2-doping-configured.png`, fullPage: true });

    // Check Answer
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/08-app-s2-doping-passed.png`, fullPage: true });

    // Advance
    await page.getByRole('button', { name: /계속하기/ }).click();
    await page.waitForFunction(() => document.querySelector('.prompt-title')?.textContent?.includes('3단계'));
  });

  // Scenario 5: Step 3 11-S03 PN 접합 확산·드리프트 평형
  await assert('Step 3 11-S03 PN 접합 평형 pass', async () => {
    // Prediction
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '상쇄돼' }).click();
    await page.waitForTimeout(150);

    // Toggle phase: diffusion -> equilibrium
    await page.locator('#control-phase .radio-option-btn').filter({ hasText: '접촉 및 초기 확산' }).click();
    await page.waitForTimeout(150);
    await page.locator('#control-phase .radio-option-btn').filter({ hasText: '열평형 상태' }).click();
    await page.waitForTimeout(150);

    // Answer
    const ans3 = page.locator('#control-answer .radio-option-btn').filter({ hasText: '내장 E는 n→p' });
    await ans3.scrollIntoViewIfNeeded();
    await ans3.click();
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${output}/09-app-s3-equilibrium-configured.png`, fullPage: true });

    // Check Answer
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/10-app-s3-equilibrium-passed.png`, fullPage: true });

    // Advance
    await page.getByRole('button', { name: /계속하기/ }).click();
    await page.waitForFunction(() => document.querySelector('.prompt-title')?.textContent?.includes('4단계'));
  });

  // Scenario 6: Step 4 11-S04 공핍폭 W 바이어스 제어
  await assert('Step 4 11-S04 공핍폭 W 제어 pass', async () => {
    // Prediction
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '가장 넓고' }).click();
    await page.waitForTimeout(150);

    // Toggle bias: -1V -> 0V -> +0.2V
    await page.locator('#control-bias .radio-option-btn').filter({ hasText: '역바이어스' }).click();
    await page.waitForTimeout(150);
    await page.locator('#control-bias .radio-option-btn').filter({ hasText: '열평형' }).click();
    await page.waitForTimeout(150);
    await page.locator('#control-bias .radio-option-btn').filter({ hasText: '순바이어스' }).click();
    await page.waitForTimeout(150);

    // Answer
    const ans4 = page.locator('#control-answer .radio-option-btn').filter({ hasText: '장벽을 높여 W를 넓히고' });
    await ans4.scrollIntoViewIfNeeded();
    await ans4.click();
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${output}/11-app-s4-depletion-configured.png`, fullPage: true });

    // Check Answer
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/12-app-s4-depletion-passed.png`, fullPage: true });

    // Advance
    await page.getByRole('button', { name: /계속하기/ }).click();
    await page.waitForFunction(() => document.querySelector('.prompt-title')?.textContent?.includes('5단계'));
  });

  // Scenario 7: Step 5 11-S05 쇼클리 다이오드 vs MOS 절연 게이트
  await assert('Step 5 11-S05 다이오드 vs MOS pass', async () => {
    // Prediction
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '6.9배' }).click();
    await page.waitForTimeout(150);

    // Toggle diodeBias: 0.3V -> 0.4V -> -1V
    await page.locator('#control-diodeBias .radio-option-btn').filter({ hasText: '+0.3 V' }).click();
    await page.waitForTimeout(150);
    await page.locator('#control-diodeBias .radio-option-btn').filter({ hasText: '+0.4 V' }).click();
    await page.waitForTimeout(150);
    await page.locator('#control-diodeBias .radio-option-btn').filter({ hasText: '−1.0 V' }).click();
    await page.waitForTimeout(150);

    // Toggle gate: MOS
    await page.locator('#control-gate .radio-option-btn').filter({ hasText: 'MOS 절연 게이트' }).click();
    await page.waitForTimeout(150);

    // Answer
    const ans5 = page.locator('#control-answer .radio-option-btn').filter({ hasText: '0.7V 하드 스위치가 아니고' });
    await ans5.scrollIntoViewIfNeeded();
    await ans5.click();
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${output}/13-app-s5-diode-mos-configured.png`, fullPage: true });

    // Check Answer
    await page.getByRole('button', { name: /확인하기/ }).click();
    await page.waitForSelector('.pill-pass');
    await page.screenshot({ path: `${output}/14-app-s5-diode-mos-passed.png`, fullPage: true });

    // Advance to Review
    await page.getByRole('button', { name: /계속하기/ }).click();
    await page.waitForFunction(() => document.querySelector('.prompt-title')?.textContent?.includes('종합 정리'));
  });

  // Scenario 8: Step 6 11-REV Review & Mobile Viewport QA
  await assert('Step 6 11-REV Review completion and Mobile QA', async () => {
    await page.waitForSelector('.prompt-title');
    const title = await page.locator('.prompt-title').textContent();
    if (!title?.includes('종합 정리') && !title?.includes('MOS')) throw Error(`Unexpected review step title: ${title}`);
    await page.screenshot({ path: `${output}/15-app-s6-review.png`, fullPage: true });

    // Completion button
    await page.getByRole('button', { name: /이해했습니다/ }).click();
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${output}/16-app-s6-completed.png`, fullPage: true });

    // Mobile Viewport test
    const mobileContext = await browser.newContext({
      ...devices['iPhone 13'],
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(baseUrl);
    await mobilePage.waitForSelector('.catalog-btn');
    await mobilePage.locator('.catalog-btn').click();
    await mobilePage.waitForSelector('.catalog-modal');

    const pnChip = mobilePage.locator('.course-lesson-chip').filter({ hasText: '반도체 밴드' });
    await pnChip.waitFor({ state: 'visible' });
    await pnChip.click();

    await mobilePage.waitForSelector('.lesson-title-text');
    await mobilePage.screenshot({ path: `${output}/17-app-mobile-pn-entry.png`, fullPage: true });
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
    console.log('\nAll 8 PN App Browser QA scenarios PASSED successfully!');
    process.exit(0);
  }
}
