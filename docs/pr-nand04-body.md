## Summary

This Draft PR integrates **Lesson 04: NAND·eSSD에서 AI 데이터센터까지: 데이터의 여행** (`nand-essd-storage-pipeline`) into the official interactive learning engine, backed by A05's verified 2.5D visual scenes (PR #43, tested SHA `61612e5` / `91da079`) and A06's canonical curriculum (`3feba6f3`), and stacked on `feat/a02-14-mos-capacitor-integration` (PR #44).

---

## 1. Curriculum & Course Progression Architecture

Updated `src/content/courses.ts` under `course-semiconductor` (`반도체 소자 및 디지털 논리`):
1. `electricityLesson` (Lesson 12 · 전하·저항·RC 지연)
2. `pnLesson` (Lesson 11 · 반도체 밴드·도핑·PN 접합)
3. `mosCapacitorLesson` (Lesson 14 · MOS 커패시터와 표면 반전)
4. `mosfetLesson` (Lesson 01 · MOSFET 스위칭)
5. `dramLesson` (Lesson 02 · DRAM 메모리 셀)
6. `sramLesson` (Lesson 05 · SRAM 캐시)
7. **`nandLesson` (Lesson 04 · NAND·eSSD·NVMe·AI 스토리지 파이프라인) [NEW]**
8. `gpuLesson` (Lesson 03 · GPU 메모리 계층)

---

## 2. Integrated 5 Practice Scenes & Learning Engine FSM

- **Step 0 (`step-nand04-s0-intro`)**:
  - Non-volatile storage physics introduction (Floating Gate & Charge Trap Flash CTF) with auto-pass concept verification.
- **Step 1 (`step-nand04-s1-threshold` / 04-S01)**:
  - 2-state threshold toy (low 0.5V / high 1.5V) vs read reference voltage (0.3V/1.0V/2.0V) & power supply (ON/OFF).
  - Physical rule: Stored charges shift Vt and remain retained across power cycles; reading physically requires active sensing power (reading with power OFF is impossible).
  - History required: `['low', 'high', 'power-cycle']` + Answer `retention-vs-read`.
  - 3 keyed misconceptions (`m1`: unpowered reading, `m2`: periodic DRAM-like refresh, `m3`: SLC-only) with individual cause explanations.
- **Step 2 (`step-nand04-s2-page-block` / 04-S02)**:
  - 2 blocks × 4 pages toy array.
  - Physical rule: Program is page-based; erase is block-based. In-place overwrite is impossible; modifying LBA 7 writes new Page (B1:P0 / B) and invalidates old Page (B0:P0 / A). Garbage Collection (GC) preserves valid data before block erase.
  - History required: `['initial', 'updated', 'collected']` + Answer `page-vs-block`.
  - 3 keyed misconceptions (`m1`: unlimited in-place overwrite, `m2`: arbitrary deletion, `m3`: page=block size equivalence).
- **Step 3 (`step-nand04-s3-ftl-reliability` / 04-S03)**:
  - Flash Translation Layer (FTL), Hot vs Cold write wear, ECC, PLP (Power Loss Protection), and DRAM cache options.
  - Physical rule: FTL decouples LBA from PBA; PLP and DRAM cache are model-specific design options, not universal; ECC corrects within bounded bit-limits and does not guarantee absolute zero errors.
  - History required: `['hot', 'cold', 'ecc-option', 'plp-option']` + Answer `ftl-feature-options`.
  - 3 keyed misconceptions (`ssd-plp-universal`, `ssd-dram-universal`, `ecc-perfect`).
- **Step 4 (`step-nand04-s4-nvme-transfer` / 04-S04)**:
  - NVMe command protocol vs PCIe DMA payload vs GPU staging.
  - Physical rule: Host issues READ command via PCIe; SSD controller DMA pushes payload into host DDR; GPU transfer is a separate subsequent stage (not universal direct HBM).
  - History required: `['command', 'read-data', 'to-gpu']` + Answer `command-dma-staging`.
  - 3 keyed misconceptions (`m1`: NVMe is cable, `m2`: CPU byte-by-byte copy, `m3`: universal direct GPU HBM).
- **Step 5 (`step-nand04-s5-ai-datacenter` / 04-S05)**:
  - AI datacenter memory/storage pipeline: Cold loading, resident GPU inference, checkpoint writes, and 2-server inter-node network.
  - Physical rule: Cold load streams model from SSD to GPU; resident inference serves tokens without full SSD re-reads; distributed checkpointing and network (NIC/RoCE) are distinct infrastructure requirements.
  - History required: `['cold-load', 'resident-infer', 'checkpoint', 'two-servers']` + Answer `resident-vs-cold`.
  - 3 keyed misconceptions (`m1`: token-by-token SSD full model reload, `m2`: HBM renders SSD/DDR obsolete, `m3`: GPU alone without network/power/cooling).
- **Step 6 (`step-nand04-s6-synthesis`)**:
  - Comprehensive memory-storage hierarchy review synthesizing quantum tunneling, FTL virtualization, PCIe DMA, and datacenter scale-out systems.

---

## 3. Pronunciation & Voice Tutor (Issue #41 Alignment)

- Updated `src/lib/voice/textNormalizer.ts` with domain terms:
  `NAND` (낸드), `eSSD` (이에스에스디), `SSD` (에스에스디), `NVMe` (엔브이엠이), `FTL` (에프티엘), `PLP` (피엘피), `WAF` (더블유에이에프), `CTF` (전하 트랩 플래시 씨티에프), `SLC` (에스엘씨), `MLC` (엠엘씨), `TLC` (티엘씨), `QLC` (큐엘씨), `LBA` (엘비에이), `DMA` (디엠에이), `NIC` (엔아이씨).

---

## 4. Verification & QA Evidence

- **Lint (`oxlint`)**: **0 errors, 0 warnings** across 110 files.
- **Vitest Unit & Integration Suites**: **19 test files, 136 tests PASSED 100%** (including `nandIntegration.test.ts`, `a05Nand04.test.ts`, and all prior lessons regression).
- **TypeScript & Vite Build**: `tsc -b && vite build` passed cleanly in 201ms.
- **Playwright Chromium E2E Browser Smoke Test (`scripts/nand-app-browser-smoke.mjs`)**:
  - Executed on isolated port 4192.
  - **ALL 11 SCENARIOS PASSED**:
    1. Catalog to Lesson 04 navigation PASS
    2. Voice settings modal & audition preview PASS
    3. Step 0 Concept intro PASS
    4. Step 1 04-S01 Threshold & power cycle + negative test PASS
    5. Step 2 04-S02 Page-Block + negative test PASS
    6. Step 3 04-S03 FTL reliability + negative test PASS
    7. Step 4 04-S04 NVMe DMA + negative test PASS
    8. Step 5 04-S05 AI datacenter pipeline + negative test PASS
    9. Step 6 Synthesis and completion card PASS
    10. Progress persistence and reload recovery PASS
    11. Mobile Viewport (iPhone 13 390px, 320px) QA PASS
  - 14 PNG evidence screenshots captured in `browser-evidence/nand-app/`.
- **CI Workflow**: Committed `.github/workflows/nand-app-browser-qa.yml`.

---

## 5. Security & Safety

- Strictly Draft PR; no merge to `main`.
- No deployment or public release.
- **RELEASE_HOLD** maintained for A05 + A07 cross review and owner final approval.
