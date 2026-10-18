import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('browser-evidence/v3');
fs.mkdirSync(outDir, { recursive: true });

async function runQA() {
  const browser = await chromium.launch({ headless: true });
  console.log('🚀 Starting A03 V3 Automated Playwright QA & Screenshot Capture...');

  // --------------------------------------------------------------------------
  // Part 1: Course Catalog Discovery Modal (1440x900 & 390x844)
  // --------------------------------------------------------------------------
  console.log('\n--- Part 1: Course Catalog Discovery Modal ---');
  {
    // Desktop 1440x900
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await desktopContext.newPage();
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Click catalog open button in header
    const catalogBtn = page.locator('button:has-text("강좌 둘러보기"), button:has-text("카탈로그"), .catalog-btn, [title="강좌 목록"]').first();
    if (await catalogBtn.isVisible()) {
      await catalogBtn.click();
    } else {
      // Fallback: click button with text '강좌' or icon
      await page.locator('header button').first().click();
    }
    await page.waitForSelector('.a03-catalog-shell', { timeout: 8000 });
    await page.waitForTimeout(400);

    const desktopCatalogImg = path.join(outDir, 'catalog_1440x900_all.png');
    await page.screenshot({ path: desktopCatalogImg });
    console.log(`✅ Saved Desktop Catalog: ${desktopCatalogImg}`);

    // Click '반도체' filter chip
    await page.locator('.a03-filter-chip:has-text("반도체")').click();
    await page.waitForTimeout(300);
    const desktopFilterImg = path.join(outDir, 'catalog_1440x900_filter_semi.png');
    await page.screenshot({ path: desktopFilterImg });
    console.log(`✅ Saved Desktop Filtered Catalog: ${desktopFilterImg}`);

    // Test Esc key closing
    await page.keyboard.press('Escape');
    await page.waitForSelector('.a03-catalog-shell', { state: 'detached', timeout: 5000 });
    console.log('✅ Catalog closed successfully with Escape key');

    await desktopContext.close();

    // Mobile 390x844
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(500);

    // Open catalog on mobile
    const mCatalogBtn = mobilePage.locator('button:has-text("강좌 둘러보기"), button:has-text("카탈로그"), .catalog-btn, [title="강좌 목록"]').first();
    if (await mCatalogBtn.isVisible()) {
      await mCatalogBtn.click();
    } else {
      await mobilePage.locator('header button').first().click();
    }
    await mobilePage.waitForSelector('.a03-catalog-shell', { timeout: 8000 });
    await mobilePage.waitForTimeout(400);

    const mobileCatalogImg = path.join(outDir, 'catalog_390x844.png');
    await mobilePage.screenshot({ path: mobileCatalogImg });
    console.log(`✅ Saved Mobile Catalog: ${mobileCatalogImg}`);

    await mobileContext.close();
  }

  // --------------------------------------------------------------------------
  // Part 2: Visual Coverage Contract — Concept Intro Steps (No Blank Labs)
  // --------------------------------------------------------------------------
  console.log('\n--- Part 2: Visual Coverage Contract (Zero Blank Labs) ---');
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    // Test Concept Intro Step: DRAM step 0
    await page.goto('http://localhost:5173/?lesson=lesson-dram&step=0', { waitUntil: 'networkidle' });
    await page.waitForSelector('.a03-concept-visual', { timeout: 8000 });
    await page.waitForTimeout(400);

    // Verify exactly ONE primary action button
    const mainActionButtons = page.locator('.a03-main-action');
    const buttonCount = await mainActionButtons.count();
    console.log(`DRAM Step 0 .a03-main-action count: ${buttonCount}`);
    if (buttonCount !== 1) {
      throw new Error(`Expected exactly 1 primary action button on concept step, found ${buttonCount}`);
    }

    const dramConceptImg = path.join(outDir, 'concept_dram_step0_1440x900.png');
    await page.screenshot({ path: dramConceptImg });
    console.log(`✅ Saved DRAM Concept Visual: ${dramConceptImg}`);

    // Test Concept Intro Step: SRAM step 0
    await page.goto('http://localhost:5173/?lesson=lesson-sram&step=0', { waitUntil: 'networkidle' });
    await page.waitForSelector('.a03-concept-visual', { timeout: 8000 });
    await page.waitForTimeout(400);
    const sramConceptImg = path.join(outDir, 'concept_sram_step0_1440x900.png');
    await page.screenshot({ path: sramConceptImg });
    console.log(`✅ Saved SRAM Concept Visual: ${sramConceptImg}`);

    // Test Concept Intro Step: MOSFET step 0
    await page.goto('http://localhost:5173/?lesson=semiconductor-mosfet-fundamentals&step=0', { waitUntil: 'networkidle' });
    await page.waitForSelector('.a03-concept-visual', { timeout: 8000 });
    await page.waitForTimeout(400);
    const mosfetConceptImg = path.join(outDir, 'concept_mosfet_step0_1440x900.png');
    await page.screenshot({ path: mosfetConceptImg });
    console.log(`✅ Saved MOSFET Concept Visual: ${mosfetConceptImg}`);

    await context.close();
  }

  // --------------------------------------------------------------------------
  // Part 3: Mobile Non-Overlap Bounding Box Assertions (390x844 & 320x640)
  // --------------------------------------------------------------------------
  console.log('\n--- Part 3: Mobile Layout Non-Overlap Geometry & 44px Touch Targets ---');
  const mobileViewports = [
    { name: '390x844', width: 390, height: 844 },
    { name: '320x640', width: 320, height: 640 },
  ];

  for (const vp of mobileViewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    // Seed Lesson 12 Step 1 (predict phase)
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

    await page.goto('http://localhost:5173/?lesson=electricity-rc-foundations&step=1', { waitUntil: 'networkidle' });
    await page.waitForSelector('.a03-phase-predict', { timeout: 10000 });
    await page.waitForTimeout(400);

    // Geometric bounding box check: lab vs sheet
    const labBox = await page.locator('.a03-lab').boundingBox();
    const sheetBox = await page.locator('.a03-sheet').boundingBox();

    console.log(`[Viewport ${vp.name}] Lab bottom: ${labBox.y + labBox.height}, Sheet top: ${sheetBox.y}`);
    const overlap = (labBox.y + labBox.height) - sheetBox.y;
    console.log(`[Viewport ${vp.name}] Geometric overlap: ${overlap}px`);

    if (overlap > 1) {
      throw new Error(`[FAIL] Geometric overlap detected on ${vp.name}: ${overlap}px > 1px tolerance!`);
    } else {
      console.log(`✅ [PASS] Zero geometric collision on ${vp.name} (overlap: ${overlap}px)`);
    }

    // Touch target assertions:
    // 1. .a03-tool >= 44x44
    const toolBox = await page.locator('.a03-tool').first().boundingBox();
    console.log(`[Viewport ${vp.name}] Tool size: ${toolBox.width}x${toolBox.height}`);
    if (toolBox.width < 43.5 || toolBox.height < 43.5) {
      throw new Error(`[FAIL] .a03-tool touch target too small on ${vp.name}: ${toolBox.width}x${toolBox.height}`);
    }

    // 2. .a03-choice >= 44px height
    const choiceBox = await page.locator('.a03-choice').first().boundingBox();
    console.log(`[Viewport ${vp.name}] Choice height: ${choiceBox.height}px`);
    if (choiceBox.height < 43.5) {
      throw new Error(`[FAIL] .a03-choice touch target too small on ${vp.name}: ${choiceBox.height}px`);
    }

    // Capture Predict
    const predictImg = path.join(outDir, `mobile_${vp.name}_predict.png`);
    await page.screenshot({ path: predictImg });
    console.log(`✅ Saved ${vp.name} Predict: ${predictImg}`);

    // Select prediction and advance to observe
    await page.locator('.a03-choice').first().click();
    await page.waitForTimeout(200);
    await page.locator('.a03-main-action').click();
    await page.waitForSelector('.a03-phase-observe', { timeout: 8000 });
    await page.waitForTimeout(400);

    // Check dock buttons touch target: .a03-seg button >= 44px height
    const segBtnBox = await page.locator('.a03-seg button').first().boundingBox();
    console.log(`[Viewport ${vp.name}] Seg button height: ${segBtnBox.height}px`);
    if (segBtnBox.height < 43.5) {
      throw new Error(`[FAIL] .a03-seg button touch target too small on ${vp.name}: ${segBtnBox.height}px`);
    }

    // Capture Observe
    const observeImg = path.join(outDir, `mobile_${vp.name}_observe.png`);
    await page.screenshot({ path: observeImg });
    console.log(`✅ Saved ${vp.name} Observe: ${observeImg}`);

    await context.close();
  }

  await browser.close();
  console.log('\n🎉 ALL QA CHECKS PASSED SUCCESSFULLY!\n');
}

runQA().catch((err) => {
  console.error('❌ QA Execution Failed:', err);
  process.exit(1);
});
