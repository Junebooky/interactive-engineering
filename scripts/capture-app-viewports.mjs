import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('browser-evidence/mosfet-v2');
fs.mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '390x844', width: 390, height: 844 },
  { name: '320x640', width: 320, height: 640 },
];

async function capture() {
  const browser = await chromium.launch({ headless: true });
  console.log('Capturing real MOSFET app screenshots from http://127.0.0.1:5173/ ...');

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    // 1. PREDICT phase (Step 1 M01-S01)
    await page.addInitScript(() => {
      localStorage.setItem('ie_last_active_lesson', JSON.stringify({
        courseId: 'course-semiconductor',
        lessonId: 'semiconductor-mosfet-fundamentals',
      }));
      localStorage.setItem('ie_progress_course-semiconductor_semiconductor-mosfet-fundamentals', JSON.stringify({
        courseId: 'course-semiconductor',
        lessonId: 'semiconductor-mosfet-fundamentals',
        currentStepIndex: 1,
        completedStepIds: ['step-mosfet-s0-concept'],
        simulatorInputs: {
          'step-mosfet-s1-channel': { vgs: 0, vds: 0, visited: [0], prediction: null, answer: null }
        },
        lastUpdated: Date.now()
      }));
    });

    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    await page.waitForSelector('.a03-phase-predict');

    // Screenshot 1: PREDICT
    const predictPath = path.join(outDir, `app_${vp.name}_predict.png`);
    await page.screenshot({ path: predictPath, fullPage: false });
    console.log(`Saved: ${predictPath}`);

    // Click prediction choice "1.2 V" and advance to observe
    await page.evaluate(() => {
      document.querySelectorAll('.a03-choice')[2].click();
      document.querySelector('.a03-main-action').click();
    });
    await page.waitForSelector('.a03-phase-observe');
    await page.waitForTimeout(400);

    // Screenshot 2: OBSERVE
    const observePath = path.join(outDir, `app_${vp.name}_observe.png`);
    await page.screenshot({ path: observePath, fullPage: false });
    console.log(`Saved: ${observePath}`);

    // Manipulate gate slider to 1.2V
    await page.evaluate(() => {
      const input = document.querySelector('input[type="range"]');
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(input, '1.2');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(300);

    // Click "비교 완료 · 설명해 보기" to advance to CHECK
    await page.evaluate(() => {
      document.querySelector('.a03-main-action').click();
    });
    await page.waitForSelector('.a03-phase-check');
    await page.waitForTimeout(300);

    // Click correct answer in CHECK and submit
    await page.evaluate(() => {
      document.querySelectorAll('.a03-choice')[1].click();
    });
    await page.waitForTimeout(200);

    await page.evaluate(() => {
      document.querySelector('.a03-main-action').click();
    });
    await page.waitForSelector('.a03-phase-done');
    await page.waitForTimeout(500);

    // Screenshot 3: DONE
    const donePath = path.join(outDir, `app_${vp.name}_done.png`);
    await page.screenshot({ path: donePath, fullPage: false });
    console.log(`Saved: ${donePath}`);

    await context.close();
  }

  await browser.close();
  console.log('All 9 real app MOSFET screenshots captured successfully!');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
