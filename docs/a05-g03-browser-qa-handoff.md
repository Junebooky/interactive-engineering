# A05 · G03 actual-browser evidence & A02 API handoff

**Independent A05 scene preview, not integrated A02 product app.** [Draft PR #15](https://github.com/Junebooky/interactive-engineering/pull/15), `feat/a05-gpu-memory-bottleneck`, stacked on SRAM #13 → DRAM #10 → M01 #8 → A02 #5.
- **Source SHA verified**: `96eb5b411b3ae41a125654fb62402b3cc604c028`.
- [**Chromium Vite/Playwright actual browser run #39023904320 SUCCESS**](https://github.com/Junebooky/interactive-engineering/actions/runs/39023904320), **7 PASS / 0 FAIL**.
- [**10 real browser screenshot ZIP, artifact #12097623412**](https://github.com/Junebooky/interactive-engineering/actions/runs/39023904320/artifacts/12097623412), 14-day retention. `browser-evidence/g03/*.png`.
- [CI run #39023904281 lint/Vitest/TS+Vite SUCCESS](https://github.com/Junebooky/interactive-engineering/actions/runs/39023904281) same source head. Reproducible `scripts/a05-gpu-browser.mjs`, `.github/workflows/a05-gpu-browser-qa.yml`.

## Chromium runtime cases
| Scene/action | QA result / saved PNG |
|---|---|
| Before prediction: scene/readout hidden | PASS — `01-gpu-predict-hidden.png` |
| `compute-feeding` compute 16→32 at feed8 remains 8 toy s; increasing feed32 at compute32 gives 2 toy s (ideal steady-state overlap) | PASS — `02-feed8-compute32.png`, `03-feed32-compute32.png` |
| `memory-family-roles` CPU DDR/RDIMM, GPU board GDDR6/7, package HBM: all DRAM and representative location | PASS — `04-memory-families.png` |
| `gddr-width-rate` theoretical 128×24/8=384, 128×32/8=512 decimal GB/s; 3 PAM3 amplitudes ≠ 3bits/cycle | PASS — `05-gddr-384.png`, `06-gddr-512-pam3.png` |
| `hbm-tradeoffs` GPU board GDDR vs HBM stack TSV and packaged link; heat/cost constraints | PASS — `07-hbm-stack-tradeoffs.png` |
| Unsupported Korean speech environment triggers readable text and transcript, no JS error | PASS — `08-voice-fallback.png` |
| iPhone Chromium emulated touch on compute32, 375px/320px no root overflow, reduced-motion preference | PASS — `09-gpu-mobile-375.png`, `10-gpu-mobile-320.png` |

## A02 typed integration
- A06 storyboard source of truth: [G03 four-step lesson](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/lessons/03-gpu-memory-bottleneck.md). [Full A05 SceneSpec](https://github.com/Junebooky/interactive-engineering/blob/feat/a05-gpu-memory-bottleneck/docs/a05-g03-scene-spec.md).
- **Pure SVG** `src/a05/gpu/GpuSceneVisual.tsx`: `GpuSceneVisual({sceneId:GpuSceneId,state:GpuVisualState,revealed:boolean})`; `GpuVisualState` fields `compute,feed,family,site,pinRate,signal,topology,showConstraints`. No app state/persistence mutation.
- **Pure math/validation** `gpuModel.ts`: `computeFeeding`, `placement`, `memoryPlacementMatches`, `theoreticalBandwidth`, `signalLevels`, `packaging`, `assessGpu`; `assessGpu(sceneId,observationIds,answerId)` returns `GpuFeedback{passed,conditions}`.
- **Standalone, *not* A02 canonical FSM**: `GpuSceneLab({onEvent?,onSpeech?})`, event union `GpuEvent` types `scene.enter | prediction.recorded | parameter.changed | answer.checked | hint.opened | voice.requested`. A02 owns registration, exact story, progress, canonical validation and voice runtime.
- Scene order `compute-feeding` → `memory-family-roles` → `gddr-width-rate` → `hbm-tradeoffs`.
- Run `npm ci && npm run dev`, preview at `/a05-gpu-preview.html`. Unit `src/__tests__/a05Gpu.test.ts`.
- Science: pipeline **fully overlapped steady state**, ignores startup/latency and differs from serial model; feed/compute in **toy units/s**. DDR/GDDR/HBM all DRAM but SKU, costs and device support vary. 384/512GB/s are fictional 128-bit/24/32Gb/s pin ideal maxima, **not measured GPU throughput**. PAM3 3 signal levels. HBM stack TSV internal, interposer/package connection between GPU and HBM, physical semiconductor packaging 2.5D != UI illustration's 2.5D.
- Accessible browser smoke ≠ native iPhone/Safari/real audible voice quality/screen reader/formal human design review, all pending. A02 integrated app E2E also pending.
- No main merge/deploy.


## A07/A06 G03 EDU_MAJORS 2+Voice corrected and reverified — 2026-10-17
- **Verified code SHA `12527a3ff4b85febbdfb039caf3afebe6c4fffb9`** (the earlier G03 QA code `96eb5b4...` no longer supports current educational evaluation). [**Actual Chromium desktop/mobile run #39028200229 SUCCESS — 7 PASS**](https://github.com/Junebooky/interactive-engineering/actions/runs/39028200229); [**12 PNG browser screenshots artifact #12098554200**](https://github.com/Junebooky/interactive-engineering/actions/runs/39028200229/artifacts/12098554200); [**CI lint/Vitest/TS+Vite #39028200174 success**](https://github.com/Junebooky/interactive-engineering/actions/runs/39028200174).
- **S02** memory family selection is **independent** of placement, with `DDR/RDIMM`, `GDDR6`, `GDDR7`, `HBM` and `cpu-dimm`, `gpu-board`, `gpu-package` separate controls. User can actively create **wrong** pairing and receives reason-specific feedback; correct one-to-many GDDR6/7→board each must be graded by pressing match check. `assessGpu` now requires four matched observations `pair-DDR/RDIMM`, `pair-GDDR6`, `pair-GDDR7`, `pair-HBM` + correct explanation, not visits. Browser negative screenshot `04a-wrong-hbm-at-cpu-dimm.png`.
- **S03** original correct 384→512 answer is no longer given in prompt. Real numeric questions with same-unit 3 distractors: `128×24÷8` → `384 / 192 / 3072 GB/s`, `128×32÷8` → `512 / 384 / 4096 GB/s`. The output SVG/readouts are hidden until **both** quizzes attempted; mere visiting rate controls or answering wrong fails explicit observation gates `quiz24`, `quiz32`, combined with `rate24/32`. Browser screenshot `05a-wrong-32Gbps-quiz.png`, and corrected `05-gddr-384.png`, `06-gddr-512-pam3.png`.
- **S04** initial voice changed to neutral comparison, TSV/heat/cost details only post observation; original physical numbers remain fictional 100%-efficiency toy, PAM3 ≠ 3bits/cycle.
- **A02 typed API delta:** `Family` now `'DDR/RDIMM'|'GDDR6'|'GDDR7'|'HBM'` rather than combined `GDDR6/GDDR7`. `GpuVisualState.family` typed accordingly. Grade matching via `placement[family].site`/`memoryPlacementMatches(family,site)`; `assessGpu` requires `pair-<family>` and `quiz24/quiz32` as physical observations, not visits. `GpuSceneVisual` remains stateless. A02 product integration must create independent card/site picker and numeric answer state; standalone `GpuSceneLab` local controller is NOT product FSM. Native phone/Safari/screen-reader, A02 integrated E2E and A07 independent EDU_QA recheck not asserted. No merge/deploy.
