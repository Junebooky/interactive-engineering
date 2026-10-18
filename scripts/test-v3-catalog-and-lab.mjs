import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const outDir = path.resolve('browser-evidence/v3');
await mkdir(outDir, { recursive: true });

let spawnedServer = null;

async function getOrStartServer() {
  // 1. Try reusing existing local dev server on port 5173
  const candidates = ['http://127.0.0.1:5173', 'http://localhost:5173'];
  for (const url of candidates) {
    try {
      const res = await fetch(`${url}/`);
      if (res.ok) {
        console.log(`✅ Using active dev server on ${url}`);
        return url;
      }
    } catch {}
  }

  // 2. Start isolated preview server on port 4193
  const port = 4193;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Starting isolated test server on ${baseUrl}...`);
  spawnedServer = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  const start = Date.now();
  while (Date.now() - start < 30000) {
    try {
      const res = await fetch(`${baseUrl}/`);
      if (res.ok) {
        console.log(`✅ Test server successfully started on ${baseUrl}`);
        return baseUrl;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Failed to start test server on ${baseUrl} within 30s`);
}

async function runQA() {
  const baseUrl = await getOrStartServer();
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  console.log('🚀 Running A03 V3 Comprehensive Playwright QA across Viewports & Phases...\n');

  try {
    // ========================================================================
    // Part 1: Course Catalog Discovery Modal (Desktop 1440, Mobile 390, Small 320)
    // ========================================================================
    console.log('--- Part 1: Course Catalog Discovery & Category Filtering QA ---');

    // 1-1. Desktop 1440x900
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      // Open catalog
      const catalogBtn = page.locator('.a03-back, button:has-text("나가기")').first();
      await catalogBtn.click();
      await page.waitForSelector('.a03-catalog-shell', { timeout: 8000 });

      // Check header and brand
      const title = await page.locator('#a03-catalog-heading').innerText();
      if (!title.includes('오늘은 무엇을 발견해 볼까요?')) {
        throw new Error(`Unexpected catalog title: ${title}`);
      }
      console.log('✅ Catalog header title verified');

      // Verify "이어서 배우기" hero card
      const hero = page.locator('.a03-catalog-hero');
      if (await hero.isVisible()) {
        const heroTitle = await page.locator('.a03-hero-title').innerText();
        console.log(`✅ Active lesson resume hero card verified: ${heroTitle}`);
      }

      // Check initial total cards (10)
      const allCards = page.locator('.a03-course-card');
      const totalCardCount = await allCards.count();
      if (totalCardCount !== 10) {
        throw new Error(`Expected 10 total catalog cards, found ${totalCardCount}`);
      }
      console.log(`✅ All 10 published course cards displayed`);

      await page.screenshot({ path: path.join(outDir, 'catalog_1440x900_all.png') });

      // Test category filter switching
      const testFilters = [
        { name: '반도체', expected: 3 },
        { name: '메모리', expected: 3 },
        { name: '전기회로', expected: 2 },
        { name: '컴퓨팅', expected: 1 },
        { name: '기계공학', expected: 1 },
        { name: '전체', expected: 10 },
      ];

      for (const f of testFilters) {
        const chip = page.locator(`.a03-filter-chip:has-text("${f.name}")`);
        await chip.click();
        await page.waitForTimeout(200);
        const count = await page.locator('.a03-course-card').count();
        if (count !== f.expected) {
          throw new Error(`Category ${f.name} expected ${f.expected} cards, got ${count}`);
        }
        console.log(`✅ Category filter '${f.name}' verified: ${count} cards`);
      }

      await page.locator('.a03-filter-chip:has-text("반도체")').click();
      await page.screenshot({ path: path.join(outDir, 'catalog_1440x900_filter_semi.png') });

      // Test Escape key closing
      await page.keyboard.press('Escape');
      await page.waitForSelector('.a03-catalog-shell', { state: 'detached', timeout: 5000 });
      console.log('✅ Catalog Escape key focus dismissal verified');

      await context.close();
    }

    // 1-2. Mobile 390x844 & 320x640 Catalog Responsive Checks
    for (const [vpName, w, h] of [['390x844', 390, 844], ['320x640', 320, 640]]) {
      const context = await browser.newContext({ viewport: { width: w, height: h } });
      const page = await context.newPage();
      await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      const catalogBtn = page.locator('.a03-back, button:has-text("나가기")').first();
      await catalogBtn.click();
      await page.waitForSelector('.a03-catalog-shell', { timeout: 8000 });

      // Assert zero horizontal overflow
      const hasHOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      if (hasHOverflow) {
        throw new Error(`Horizontal scroll overflow detected in Catalog on ${vpName}!`);
      }
      console.log(`✅ Zero horizontal overflow on Catalog ${vpName}`);

      if (w === 390) {
        await page.screenshot({ path: path.join(outDir, 'catalog_390x844.png') });
      }

      // Close catalog via close button
      await page.locator('.a03-catalog-close-btn').click();
      await page.waitForSelector('.a03-catalog-shell', { state: 'detached', timeout: 5000 });
      await context.close();
    }

    // ========================================================================
    // Part 2: Mobile Zero Collision & 44px Touch Targets (390x844 & 320x640)
    // ========================================================================
    console.log('\n--- Part 2: Mobile Non-Overlap Geometry & 44px Touch Targets QA ---');

    for (const [vpName, w, h] of [['390x844', 390, 844], ['320x640', 320, 640]]) {
      const context = await browser.newContext({ viewport: { width: w, height: h } });
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

      await page.goto(`${baseUrl}/?lesson=electricity-rc-foundations&step=1`, { waitUntil: 'networkidle' });
      await page.waitForSelector('.a03-phase-predict', { timeout: 10000 });
      await page.waitForTimeout(400);

      // Geometric bounding box check: lab vs sheet
      const labBox = await page.locator('.a03-lab').boundingBox();
      const sheetBox = await page.locator('.a03-sheet').boundingBox();

      const overlap = (labBox.y + labBox.height) - sheetBox.y;
      console.log(`[${vpName}] Lab bottom: ${labBox.y + labBox.height}, Sheet top: ${sheetBox.y}, Overlap: ${overlap}px`);

      if (overlap > 1) {
        throw new Error(`[FAIL] Geometric collision on ${vpName}: ${overlap}px > 1px tolerance!`);
      }
      console.log(`✅ [PASS] Zero geometric collision on ${vpName}`);

      // Touch target assertions (>= 44x44px):
      // 1. Tool buttons
      const toolBox = await page.locator('.a03-tool').first().boundingBox();
      console.log(`[${vpName}] Camera tool size: ${toolBox.width}x${toolBox.height}`);
      if (toolBox.width < 43.5 || toolBox.height < 43.5) {
        throw new Error(`[FAIL] Tool target too small on ${vpName}: ${toolBox.width}x${toolBox.height}`);
      }

      // 2. Prediction choices
      const choiceBox = await page.locator('.a03-choice').first().boundingBox();
      console.log(`[${vpName}] Choice min-height: ${choiceBox.height}px`);
      if (choiceBox.height < 43.5) {
        throw new Error(`[FAIL] Choice target too small on ${vpName}: ${choiceBox.height}px`);
      }

      // Save Predict screenshot
      await page.screenshot({ path: path.join(outDir, `mobile_${vpName}_predict.png`) });

      // Step forward to OBSERVE phase
      await page.locator('.a03-choice').first().click();
      await page.waitForTimeout(200);
      await page.locator('.a03-main-action').click();
      await page.waitForSelector('.a03-phase-observe', { timeout: 8000 });
      await page.waitForTimeout(400);

      // Check dock switch button touch targets (>= 44px)
      const segBtnBox = await page.locator('.a03-seg button').first().boundingBox();
      console.log(`[${vpName}] Dock switch button height: ${segBtnBox.height}px`);
      if (segBtnBox.height < 43.5) {
        throw new Error(`[FAIL] Seg button target too small on ${vpName}: ${segBtnBox.height}px`);
      }

      // Save Observe screenshot
      await page.screenshot({ path: path.join(outDir, `mobile_${vpName}_observe.png`) });

      // Complete full 4-phase walkthrough on 390
      if (w === 390) {
        // Toggle switches to complete exploration
        await page.locator('#close-switch').click();
        await page.waitForTimeout(300);
        await page.locator('#open-switch').click();
        await page.waitForTimeout(300);

        // Advance to CHECK phase
        await page.locator('.a03-main-action').click();
        await page.waitForSelector('.a03-phase-check', { timeout: 8000 });
        console.log('✅ Advanced to CHECK phase');

        // Select explanation and advance to DONE
        await page.locator('.a03-choice').first().click();
        await page.waitForTimeout(200);
        await page.locator('.a03-main-action').click();
        await page.waitForSelector('.a03-phase-done', { timeout: 8000 });
        console.log('✅ Advanced to DONE phase (Core discovery complete)');
      }

      await context.close();
    }

    // ========================================================================
    // Part 3: Visual Coverage Contract & Cross-Lesson Isolation QA
    // ========================================================================
    console.log('\n--- Part 3: Visual Coverage & Cross-Lesson Isolation QA ---');
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();

      const conceptCases = [
        {
          name: 'DRAM Step 0',
          url: `${baseUrl}/?lesson=lesson-dram&step=0`,
          checkSelector: '.a03-concept-visual',
          imgName: 'concept_dram_step0_1440x900.png',
          forbidText: 'MOSFET',
        },
        {
          name: 'SRAM Step 0',
          url: `${baseUrl}/?lesson=lesson-sram&step=0`,
          checkSelector: '.a03-concept-visual',
          imgName: 'concept_sram_step0_1440x900.png',
          forbidText: 'MOSFET',
        },
        {
          name: 'MOSFET Step 0',
          url: `${baseUrl}/?lesson=semiconductor-mosfet-fundamentals&step=0`,
          checkSelector: '.a03-concept-visual',
          imgName: 'concept_mosfet_step0_1440x900.png',
          forbidText: null,
        },
        {
          name: 'Electricity Step 0',
          url: `${baseUrl}/?lesson=electricity-rc-foundations&step=0`,
          checkSelector: '.a03-concept-visual',
          imgName: 'concept_elec_step0_1440x900.png',
          forbidText: 'MOSFET',
        },
      ];

      for (const item of conceptCases) {
        await page.goto(item.url, { waitUntil: 'networkidle' });
        await page.waitForSelector(item.checkSelector, { timeout: 8000 });
        await page.waitForTimeout(300);

        // Verify exactly ONE primary action button
        const mainActionCount = await page.locator('.a03-main-action').count();
        if (mainActionCount !== 1) {
          throw new Error(`[FAIL] ${item.name} has ${mainActionCount} primary CTA buttons (expected 1)`);
        }
        console.log(`✅ ${item.name}: exactly 1 primary CTA button verified`);

        // Check for cross-lesson copy leakage
        if (item.forbidText) {
          const labName = await page.locator('.a03-lab-name').innerText();
          const labAria = await page.locator('.a03-lab').getAttribute('aria-label');
          if (labName.includes(item.forbidText) || (labAria && labAria.includes(item.forbidText))) {
            throw new Error(`[FAIL] Cross-lesson copy leak! '${item.forbidText}' found in ${item.name} (${labName})`);
          }
          console.log(`✅ ${item.name}: strictly isolated (zero '${item.forbidText}' copy leak)`);
        }

        await page.screenshot({ path: path.join(outDir, item.imgName) });
      }

      await context.close();
    }

    console.log('\n🎉 ALL CI/PLAYWRIGHT QA CHECKS PASSED WITH 100% SUCCESS!\n');
  } finally {
    await browser.close();
    if (spawnedServer) {
      console.log('Terminating isolated test server...');
      spawnedServer.kill('SIGTERM');
    }
  }
}

runQA().catch((err) => {
  console.error('\n❌ QA Run Failed with error:\n', err);
  if (spawnedServer) {
    spawnedServer.kill('SIGTERM');
  }
  process.exit(1);
});
