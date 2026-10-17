# A05 D02 · 실제 브라우저 QA 및 A02 인계 (2026-10-17 KST)

## Proven execution vs remaining verification
- Actual **Vite dev server + Playwright Chromium** run [#39022687806 — SUCCESS](https://github.com/Junebooky/interactive-engineering/actions/runs/39022687806), source head `ef36a544fb689ce2bca02d029170700e784ba1b8`.
- [12 real browser screenshots ZIP, artifact #12097765079](https://github.com/Junebooky/interactive-engineering/actions/runs/39022687806/artifacts/12097765079), 14-day artifact retention. Files `browser-evidence/d02/*.png`.
- Run job log **7 PASS, 0 FAIL**. First run [#39022436901](https://github.com/Junebooky/interactive-engineering/actions/runs/39022436901) failed because an ambiguous Playwright selector `WL OFF` matched a button and the answer; fixed with `exact:true` in browser script and reran. No false claim of first-pass success.
- CI run [#39022691251](https://github.com/Junebooky/interactive-engineering/actions/runs/39022691251) on same code HEAD: oxlint, Vitest, TS+Vite build **SUCCESS**.
- Browser evidence created before this documentation-only commit; no subsequent source changes on PR #10 are implied by doc update.

### Pass matrix / images
| Scenario | Runtime result | Screenshots |
|---|---|---|
| 1440px prediction-veil hides numeric observations | PASS | 01-dram-predict-desktop.png |
| `dram-write`: BL/WL 1T1C isolation, misconception rejection, three hints, Why, valid pass | PASS | 02-dram-write-desktop.png |
| `dram-sense-restore`: cell0 UI **0.45**, cell0 Voice transcript **0.45**; cell1 UI **0.55**, cell1 Voice transcript **0.55**; precharge→share→sense→restore | PASS | 03/04-dram-sense-cell*.png, 05-dram-sense-shared-amplify.png, 06-dram-restored-cell0.png |
| `dram-leak-refresh`: keyboard slider, toy time=1 → 0.80, explicit refresh → 1.00 | PASS | 07-dram-leak-before.png, 08-dram-refresh-after.png |
| `dram-row-bank`: 1 bank serial vs 2 internal bank overlap & shared bus caveat; no desktop horizontal overflow | PASS | 09-dram-bank-desktop.png |
| Reduced-motion preference rule, no-throw speech request, forced unsupported voice readable Korean fallback | PASS | 10-dram-voice-fallback.png |
| Emulated iPhone Chromium **touch** BL/WL taps, 375px and 320px viewport no root horizontal overflow | PASS | 11-dram-mobile-375.png, 12-dram-mobile-320.png |

**A06 cross-QA**: [Review comment #6232121280](https://github.com/Junebooky/interactive-engineering/pull/10#issuecomment-6232121280). D02-S02 explanation is now computed with `shareCharge(state.bit)` not `shareCharge(1)`; two Voice requests use selected bit/±Δ value, transcript visible and tested. Sense/read/restore buttons and in-scene labels explicitly say **educational time snapshots of a continuous sensed/restoring event**; actual WL-connected DRAM restoration occurs while sense amplifier drives BL, not a third independent JEDEC command. This model is **illustrative** and not precise transient cell voltage simulation.

## A02 handoff (DRAM `SCENE_READY`, product `APP_QA` not claimed)
- A05 PR: [#10](https://github.com/Junebooky/interactive-engineering/pull/10), branch `feat/a05-dram-1t1c-scenes`, **stacked on** M01 `feat/a05-mosfet-discovery-scenes` (#8); M01 itself stacks on A02 PR #5. Use exact SHA; do not copy entire unmerged base history as A05-specific work.
- Story source: A06 PR #7 `education/lessons/02-dram-bit-cell.md` and `education/a05-d02-cross-qa.md`.
- Pure math/assessment: `src/a05/dram/dramModel.ts` typed exports `DramSceneId`, `Bit`, `DramPhase`, `DramEvent`, `DramFeedback`, `writeCell`, `shareCharge`, `senseRead`, `leakageVoltage`, `bankSchedule`, `bankOverlap`, `dramEvaluate`. Physics assumptions VDD=1normalized, Ccell:Cbitline=1:9, Δ±0.05, normalized toy time 0..2, virtual bank slots, **not physical ns/ms or real product metrics**.
- Pure visual: `DramSceneVisual({sceneId,state,revealed})`; `DramVisualState` fields `wl, bl, cell, bit, phase, elapsed, refreshAt, banks`; components never mutate engine state.
- Standalone story/player: `DramSceneLab({onEvent?,onSpeech?})`, separate from A02 engine, with prediction, observation, condition-based evaluation, three hints/Why/nextHook; A02 **reuse pure scene model and typed contract rather than embedding duplicate Lab FSM**.
- Scene IDs in order: `dram-write` → `dram-sense-restore` → `dram-leak-refresh` → `dram-row-bank`.
- Event union: `prediction.recorded | parameter.changed | action.triggered | answer.checked | hint.opened | voice.requested | scene.enter`, with `{sceneId,type,payload?}`. English IDs, Korean UI/voice text. User-initiated speech callback only; A02 owns global Voice handling and progress persistence.
- Docs: [SceneSpec](https://github.com/Junebooky/interactive-engineering/blob/feat/a05-dram-1t1c-scenes/docs/a05-d02-scene-spec.md).
- QA scripts `scripts/a05-dram-browser.mjs`, workflow `.github/workflows/a05-dram-browser-qa.yml`, unit test `src/__tests__/a05Dram.test.ts`, `/a05-dram-preview.html`.
- **Remaining outside A05 preview QA**: native phones/Safari, audible voice-pack quality, screen-reader device, formal manual visual signoff, A02 integrated Lesson Engine app/persistence E2E, actual learner usability. No main merge, no deployment.
