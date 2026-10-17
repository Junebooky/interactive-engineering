import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('browser-evidence/lesson12');
fs.mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '390x844', width: 390, height: 844 },
  { name: '320x640', width: 320, height: 640 },
];

async function capture() {
  const browser = await chromium.launch({ headless: true });
  console.log('Capturing real Lesson 12 app screenshots from http://127.0.0.1:5173/?lesson=electricity-rc-foundations&step=1 ...');

  for (const vp of viewports) {
    console.log(`Processing viewport ${vp.name}...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    // Clear local storage and seed lesson 12 step 1
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('ie_last_active_lesson', JSON.stringify({
        courseId: 'course-semiconductor',
        lessonId: 'electricity-rc-foundations',
      }));
      localStorage.setItem('ie_progress_course-semiconductor_electricity-rc-foundations', JSON.stringify({
        courseId: 'course-semiconductor',
        lessonId: 'electricity-rc-foundations',
        currentStepIndex: 1,
        completedStepIds: ['step-elec-s0-intro'],
        simulatorInputs: {
          'step-elec-s1-ohms-law': { closed: false, direction: 'conventional', history: ['open'], prediction: null, answer: null }
        },
        lastUpdated: Date.now()
      }));
    });

    await page.goto('http://127.0.0.1:5173/?lesson=electricity-rc-foundations&step=1', { waitUntil: 'networkidle' });
    await page.waitForSelector('.a03-phase-predict', { timeout: 10000 });
    await page.waitForTimeout(500);

    // 1. Screenshot: PREDICT
    const predictPath = path.join(outDir, `app_l12_${vp.name}_predict.png`);
    await page.screenshot({ path: predictPath, fullPage: false });
    console.log(`Saved: ${predictPath}`);

    // Click prediction choice "v5-i0" (first choice)
    await page.locator('.a03-choice').first().click();
    await page.waitForTimeout(300);

    // Click "예측 기록하고 회로 열기"
    await page.locator('.a03-main-action').click();
    await page.waitForSelector('.a03-phase-observe', { timeout: 10000 });
    await page.waitForTimeout(500);

    // 2. Screenshot: OBSERVE
    const observePath = path.join(outDir, `app_l12_${vp.name}_observe.png`);
    await page.screenshot({ path: observePath, fullPage: false });
    console.log(`Saved: ${observePath}`);

    // Interact with dock: switch to "닫힘" then "열림"
    await page.locator('#close-switch').click();
    await page.waitForTimeout(400);

    await page.locator('#open-switch').click();
    await page.waitForTimeout(400);

    // Wait until main action is enabled and click to advance to CHECK
    const mainAction = page.locator('.a03-main-action');
    await mainAction.waitFor({ state: 'visible' });
    await mainAction.click();

    await page.waitForSelector('.a03-phase-check', { timeout: 10000 });
    await page.waitForTimeout(400);

    // Select correct concept choice "v-not-current" (first choice)
    await page.locator('.a03-choice').first().click();
    await page.waitForTimeout(300);

    // Click "원리 확인 완료"
    await page.locator('.a03-main-action').click();
    await page.waitForSelector('.a03-phase-done', { timeout: 10000 });
    await page.waitForTimeout(600);

    // 3. Screenshot: DONE
    const donePath = path.join(outDir, `app_l12_${vp.name}_done.png`);
    await page.screenshot({ path: donePath, fullPage: false });
    console.log(`Saved: ${donePath}`);

    await context.close();
  }

  await browser.close();
  console.log('All 9 Lesson 12 screenshots captured successfully!');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
