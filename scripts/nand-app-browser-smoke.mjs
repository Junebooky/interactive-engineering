import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium, devices } from 'playwright';

const port = 4192;
const baseUrl = `http://127.0.0.1:${port}/`;
const output = 'browser-evidence/nand-app';
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

  // Scenario 1: Catalog -> Lesson 04 NAND/eSSD Navigation
  await assert('Catalog to Lesson 04 NAND eSSD Navigation', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('.catalog-btn');
    await page.locator('.catalog-btn').click();
    await page.waitForSelector('.catalog-modal');

    // Click NAND/eSSD lesson chip in semiconductor course card
    const nandChip = page.locator('.course-lesson-chip').filter({ hasText: 'NAND' });
    await nandChip.waitFor({ state: 'visible' });
    await nandChip.click();

    // Verify breadcrumb shows NAND lesson title
    await page.waitForSelector('.lesson-title-text');
    const title = await page.locator('.lesson-title-text').textContent();
    if (!title?.includes('NAND') || !title?.includes('04')) {
      throw Error(`Expected Lesson 04 NAND breadcrumb, got: ${title}`);
    }
    await page.screenshot({ path: `${output}/01-app-catalog-nand-entry.png`, fullPage: true });
  });

  // Scenario 2: Voice Settings Audition Check (Issue #41)
  await assert('Voice Settings Modal and Audition QA', async () => {
    const settingsBtn = page.locator('.voice-settings-btn');
    await settingsBtn.waitFor({ state: 'visible' });
    await settingsBtn.click();

    await page.waitForSelector('.voice-settings-modal');
    await page.screenshot({ path: `${output}/02-app-voice-settings-modal.png`, fullPage: true });

    try {
      // Select 1.0x rate
      const speed10 = page.locator('.speed-option-btn').filter({ hasText: '1.0x' });
      await speed10.scrollIntoViewIfNeeded();
      await speed10.click();

      // Audition preview
      const previewBtn = page.locator('.btn-preview-voice');
      await previewBtn.scrollIntoViewIfNeeded();
      await previewBtn.click();
      await page.waitForTimeout(150);
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
  await assert('Step 0 NAND concept intro and advance', async () => {
    await page.waitForSelector('.prompt-title');
    const title = await page.locator('.prompt-title').textContent();
    if (!title?.includes('플래시') && !title?.includes('비휘발성')) {
      throw Error(`Unexpected step 0 title: ${title}`);
    }

    await page.screenshot({ path: `${output}/03-app-s0-nand-intro.png`, fullPage: true });

    // Confirm & Advance
    await page.getByRole('button', { name: /이해했습니다/ }).click();
    await page.getByRole('button', { name: /계속하기/ }).click();
  });

  // Scenario 4: Step 1 04-S01 Threshold & Retention (with negative test)
  await assert('Step 1 04-S01 Threshold pass & negative test', async () => {
    await page.waitForSelector('.prompt-title');
    if (!await page.locator('.a05-veiled').count()) throw Error('Veiled state not visible before prediction');
    await page.screenshot({ path: `${output}/04-app-s1-veiled.png`, fullPage: true });

    // Select prediction
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '전원을 껐다 켜도 저장된 전하에 따라' }).click();
    if (await page.locator('.a05-veiled').count()) throw Error('Veiled state still present after prediction');

    // Negative Test: select misconception m1
    const wrongAns = page.locator('#control-answer .radio-option-btn').filter({ hasText: '배터리·전원이 없을 때도 언제나 직접 읽을 수 있어요' });
    await wrongAns.scrollIntoViewIfNeeded();
    await wrongAns.click();
    await page.getByRole('button', { name: /확인하기/ }).click();

    // Verify rejection
    await page.waitForSelector('.status-badge.incorrect, .fail-banner, .btn-retry');
    await page.screenshot({ path: `${output}/05-app-s1-negative-fail.png`, fullPage: true });

    // Retry
    await page.locator('.btn-retry').click();

    // Operate controls: cell low -> high, power off -> on
    await page.locator('#control-cell .radio-option-btn').filter({ hasText: 'Low 전하 상태' }).click();
    await page.waitForTimeout(50);
    await page.locator('#control-cell .radio-option-btn').filter({ hasText: 'High 전하 상태' }).click();
    await page.waitForTimeout(50);
    await page.locator('#control-power .radio-option-btn').filter({ hasText: '전원 OFF' }).click();
    await page.waitForTimeout(50);
    await page.locator('#control-power .radio-option-btn').filter({ hasText: '전원 ON' }).click();
    await page.waitForTimeout(50);

    // Select correct answer
    const ans1 = page.locator('#control-answer .radio-option-btn').filter({ hasText: '저장 전하가 셀 문턱 상태에 영향을 주고' });
    await ans1.scrollIntoViewIfNeeded();
    await ans1.click();
    await page.getByRole('button', { name: /확인하기/ }).click();

    await page.waitForSelector('.status-badge.correct, .btn-continue');
    await page.screenshot({ path: `${output}/06-app-s1-pass.png`, fullPage: true });
    await page.locator('.btn-continue').click();
  });

  // Scenario 5: Step 2 04-S02 Page Program & Block Erase (with negative test)
  await assert('Step 2 04-S02 Page-Block pass & negative test', async () => {
    await page.waitForSelector('.prompt-title');
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '새로운 빈 물리 페이지에 기록해야 해요' }).click();

    // Negative Test: select misconception m1
    const wrongAns = page.locator('#control-answer .radio-option-btn').filter({ hasText: '제자리에서 무한히 쓰고 지울 수 있어요' });
    await wrongAns.scrollIntoViewIfNeeded();
    await wrongAns.click();
    await page.getByRole('button', { name: /확인하기/ }).click();

    await page.waitForSelector('.status-badge.incorrect, .fail-banner, .btn-retry');
    await page.locator('.btn-retry').click();

    // Operate controls: initial -> updated -> collected
    await page.locator('#control-pageStage .radio-option-btn').filter({ hasText: '1. 초기 기록' }).click();
    await page.waitForTimeout(50);
    await page.locator('#control-pageStage .radio-option-btn').filter({ hasText: '2. 데이터 갱신' }).click();
    await page.waitForTimeout(50);
    await page.locator('#control-pageStage .radio-option-btn').filter({ hasText: '3. 가비지 컬렉션' }).click();
    await page.waitForTimeout(50);

    // Select correct answer
    const ans2 = page.locator('#control-answer .radio-option-btn').filter({ hasText: '프로그램은 페이지 단위, 지우기는 블록 단위여서' });
    await ans2.scrollIntoViewIfNeeded();
    await ans2.click();
    await page.getByRole('button', { name: /확인하기/ }).click();

    await page.waitForSelector('.status-badge.correct, .btn-continue');
    await page.screenshot({ path: `${output}/07-app-s2-pass.png`, fullPage: true });
    await page.locator('.btn-continue').click();
  });

  // Scenario 6: Step 3 04-S03 FTL & Reliability (with negative test)
  await assert('Step 3 04-S03 FTL reliability pass & negative test', async () => {
    await page.waitForSelector('.prompt-title');
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '설계와 제품 사양에 따라' }).click();

    // Negative Test: select ssd-plp-universal
    const wrongAns = page.locator('#control-answer .radio-option-btn').filter({ hasText: '모든 eSSD에는 반드시 PLP가 장착돼 있고' });
    await wrongAns.scrollIntoViewIfNeeded();
    await wrongAns.click();
    await page.getByRole('button', { name: /확인하기/ }).click();

    await page.waitForSelector('.status-badge.incorrect, .fail-banner, .btn-retry');
    await page.locator('.btn-retry').click();

    // Operate controls: hot, cold, ecc true, plp true
    await page.locator('#control-writePattern .radio-option-btn').filter({ hasText: 'Hot 쓰기' }).click();
    await page.waitForTimeout(50);
    await page.locator('#control-writePattern .radio-option-btn').filter({ hasText: 'Cold 쓰기' }).click();
    await page.waitForTimeout(50);
    await page.locator('#control-ecc .radio-option-btn').filter({ hasText: 'ECC 활성화' }).click();
    await page.waitForTimeout(50);
    await page.locator('#control-plp .radio-option-btn').filter({ hasText: 'PLP 탑재' }).click();
    await page.waitForTimeout(50);

    // Select correct answer
    const ans3 = page.locator('#control-answer .radio-option-btn').filter({ hasText: 'FTL은 LBA→물리 위치를 바꿀 수 있고' });
    await ans3.scrollIntoViewIfNeeded();
    await ans3.click();
    await page.getByRole('button', { name: /확인하기/ }).click();

    await page.waitForSelector('.status-badge.correct, .btn-continue');
    await page.screenshot({ path: `${output}/08-app-s3-pass.png`, fullPage: true });
    await page.locator('.btn-continue').click();
  });

  // Scenario 7: Step 4 04-S04 NVMe & PCIe DMA (with negative test)
  await assert('Step 4 04-S04 NVMe DMA pass & negative test', async () => {
    await page.waitForSelector('.prompt-title');
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '출발점 및 이동 방향을 각각 따져보아야 해요' }).click();

    // Negative Test: select misconception m1
    const wrongAns = page.locator('#control-answer .radio-option-btn').filter({ hasText: 'NVMe는 SSD를 꽂는 물리 케이블 이름 자체예요' });
    await wrongAns.scrollIntoViewIfNeeded();
    await wrongAns.click();
    await page.getByRole('button', { name: /확인하기/ }).click();

    await page.waitForSelector('.status-badge.incorrect, .fail-banner, .btn-retry');
    await page.locator('.btn-retry').click();

    // Operate controls: command -> read-data -> to-gpu
    await page.locator('#control-transport .radio-option-btn').filter({ hasText: '1. NVMe READ 명령' }).click();
    await page.waitForTimeout(50);
    await page.locator('#control-transport .radio-option-btn').filter({ hasText: '2. READ 데이터' }).click();
    await page.waitForTimeout(50);
    await page.locator('#control-transport .radio-option-btn').filter({ hasText: '3. GPU 메모리 전달' }).click();
    await page.waitForTimeout(50);

    // Select correct answer
    const ans4 = page.locator('#control-answer .radio-option-btn').filter({ hasText: 'NVMe는 명령·큐 인터페이스, PCIe는 연결이고' });
    await ans4.scrollIntoViewIfNeeded();
    await ans4.click();
    await page.getByRole('button', { name: /확인하기/ }).click();

    await page.waitForSelector('.status-badge.correct, .btn-continue');
    await page.screenshot({ path: `${output}/09-app-s4-pass.png`, fullPage: true });
    await page.locator('.btn-continue').click();
  });

  // Scenario 8: Step 5 04-S05 AI Data Center Storage Pipeline (with negative test)
  await assert('Step 5 04-S05 AI Data Center pass & negative test', async () => {
    await page.waitForSelector('.prompt-title');
    await page.locator('#control-prediction .radio-option-btn').filter({ hasText: '올라와 있는 상태와 처음 적재할 때의 경로를 구분해야 해요' }).click();

    // Negative Test: select misconception m1
    const wrongAns = page.locator('#control-answer .radio-option-btn').filter({ hasText: '토큰 하나를 생성할 때마다 SSD에서 모델 전체를 언제나 다시 로드해요' });
    await wrongAns.scrollIntoViewIfNeeded();
    await wrongAns.click();
    await page.getByRole('button', { name: /확인하기/ }).click();

    await page.waitForSelector('.status-badge.incorrect, .fail-banner, .btn-retry');
    await page.locator('.btn-retry').click();

    // Operate controls: cold-load -> resident-infer -> checkpoint, servers 2
    await page.locator('#control-ai .radio-option-btn').filter({ hasText: '1. 초기 콜드 로딩' }).click();
    await page.waitForTimeout(50);
    await page.locator('#control-ai .radio-option-btn').filter({ hasText: '2. 모델 상주 추론' }).click();
    await page.waitForTimeout(50);
    await page.locator('#control-ai .radio-option-btn').filter({ hasText: '3. 학습 체크포인트' }).click();
    await page.waitForTimeout(50);
    await page.locator('#control-servers .radio-option-btn').filter({ hasText: '분산 2대 서버' }).click();
    await page.waitForTimeout(50);

    // Select correct answer
    const ans5 = page.locator('#control-answer .radio-option-btn').filter({ hasText: '처음 로딩과 모델이 이미 GPU 메모리에 있는 추론은 다르고' });
    await ans5.scrollIntoViewIfNeeded();
    await ans5.click();
    await page.getByRole('button', { name: /확인하기/ }).click();

    await page.waitForSelector('.status-badge.correct, .btn-continue');
    await page.screenshot({ path: `${output}/10-app-s5-pass.png`, fullPage: true });
    await page.locator('.btn-continue').click();
  });

  // Scenario 9: Step 6 Synthesis and Completion
  await assert('Step 6 Synthesis and lesson completion', async () => {
    await page.waitForSelector('.prompt-title');
    const title = await page.locator('.prompt-title').textContent();
    if (!title?.includes('종합 정리')) throw Error(`Expected Step 6 synthesis title, got: ${title}`);

    await page.getByRole('button', { name: /이해했습니다/ }).click();
    await page.getByRole('button', { name: /계속하기/ }).click();
    await page.waitForSelector('.completion-card');
    await page.screenshot({ path: `${output}/11-app-s6-completion.png`, fullPage: true });
  });

  // Scenario 10: Progress Persistence & Reload Recovery
  await assert('Progress persistence and reload restoration', async () => {
    await page.reload();
    await page.waitForSelector('.completion-card, .prompt-title');
    const restored = await page.locator('.completion-card').count();
    if (!restored) throw Error('Expected lesson completion card after reload');
    await page.screenshot({ path: `${output}/12-app-reload-restored.png`, fullPage: true });
  });

  // Scenario 11: Mobile Emulation (iPhone 13 - 390x844 & ultra small 320x600)
  await assert('Mobile Viewport Emulation QA', async () => {
    const iphone = await browser.newContext({
      ...devices['iPhone 13'],
    });
    const mobPage = await iphone.newPage();
    await mobPage.goto(baseUrl);
    await mobPage.waitForSelector('.catalog-btn');
    await mobPage.locator('.catalog-btn').click();
    await mobPage.waitForSelector('.catalog-modal');

    const nandChip = mobPage.locator('.course-lesson-chip').filter({ hasText: 'NAND' });
    await nandChip.waitFor({ state: 'visible' });
    await nandChip.click();

    await mobPage.waitForSelector('.prompt-title');
    await mobPage.screenshot({ path: `${output}/13-app-mobile-iphone13.png`, fullPage: true });
    await iphone.close();

    // Ultra compact 320px
    const smallCtx = await browser.newContext({ viewport: { width: 320, height: 600 } });
    const smallPage = await smallCtx.newPage();
    await smallPage.goto(baseUrl);
    await smallPage.waitForSelector('.catalog-btn');
    await smallPage.locator('.catalog-btn').click();
    await smallPage.waitForSelector('.catalog-modal');

    const nandChip2 = smallPage.locator('.course-lesson-chip').filter({ hasText: 'NAND' });
    await nandChip2.waitFor({ state: 'visible' });
    await nandChip2.click();

    await smallPage.waitForSelector('.prompt-title');
    await smallPage.screenshot({ path: `${output}/14-app-mobile-320px.png`, fullPage: true });
    await smallCtx.close();
  });

} catch (err) {
  failures.push({ label: 'Fatal Runner Error', error: String(err) });
  console.error('Fatal Runner Error:', err);
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}

if (failures.length > 0) {
  console.error('\n--- BROWSER SMOKE FAILURES ---');
  for (const f of failures) {
    console.error(`- ${f.label}: ${f.error}`);
  }
  process.exit(1);
} else {
  console.log('\nALL 11 BROWSER SMOKE SCENARIOS PASSED WITH FULL EVIDENCE!');
  process.exit(0);
}
