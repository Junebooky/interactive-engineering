# A05 · D02 DRAM 1T1C SceneSpec / handoff v0.1

**Source of truth:** [A06 PR #7, lesson 02](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/lessons/02-dram-bit-cell.md) and [Issue #4 handoff v0.2](https://github.com/Junebooky/interactive-engineering/issues/4#issuecomment-6231604791).
**Status:** Four coded standalone DRAM 2.5D scenes, **not A02 production app integration**. Own feature branch `feat/a05-dram-1t1c-scenes`, **stacked onto M01 PR #8** to reuse scene-shell CSS. No A02 Engine edits, main merge or deployment.

## Scene implementation

| Step / sceneId | Direct manipulation / observed state | Numerics, units and model bounds | Explicit validation |
|---|---|---|---|
| D02-S01 `dram-write` | BL 0/1, WL OFF/ON; BL=1→WL ON charges capacitor; WL OFF then BL=0 retains stored one | 1T1C idealized normalized VDD=1. WL OFF isolates, WL ON writes. Real write boosting, signal margin, leakage ignored | Ordered `charged`, `held` action evidence **and** isolated-cell reasoning |
| D02-S02 `dram-sense-restore` | Select cell bit, precharge BL to 0.5VDD, WL connection/sharing, sense enable, write back/restore | Cc:Cb=1:9 toy: for bit1 Vshared=0.55VDD, for bit0=0.45VDD; Δ=±0.05. Both cell and BL initially disturbed; restored to 1/0 later. **Not actual DRAM charge ratio/timing.** | sequential shared/sensed/restored **and** explanation of destructive read/restore |
| D02-S03 `dram-leak-refresh` | virtual time 0..2, normalized charge decrease 1−0.2×time, refresh action resets reference | Time is **toy units, NOT milliseconds**, leakage linear illustrative, no real device retention/reliability claim | decreased charge observed and explicit refresh **and** correct leakage explanation |
| D02-S04 `dram-row-bank` | 1 bank A/B serial 0–2,2–4 versus 2 bank A/B 0–2 both (internal tasks) | toy time slots only. Excludes common bus, command scheduling, tRCD, tRP, tRFC, thermal effects. No 2× real throughput claim | both configurations compared and conditional concurrency explained |

Every step: prediction UI hides final scene before selection → explicit buttons/slider controls → chart/readouts → conceptual answer (3 targeted misconceptions) → deterministic condition-by-condition feedback → three hints → Why/speech callback → next-hook. All user-facing information is in Korean, equations model-labeled, no XP or reward system.

### Scene and event/props mapping for A02
- `DramSceneVisual({sceneId,state,revealed})`: typed pure SVG 2.5D visual. No progress mutation.
- `DramSceneLab({onEvent?,onSpeech?})`: independently working React/SVG lab/preview, owns ephemeral `prediction,sceneIndex,parameters,observedFacts,answer,feedback,hint,why`. App integration remains **A02 responsibility**.
- `dramModel.ts`: `writeCell`, `shareCharge`, `senseRead`, `leakageVoltage`, `bankSchedule`, `bankOverlap`, `dramEvaluate`. Unit tests `src/__tests__/a05Dram.test.ts`.
- `DramEvent` has `sceneId`, `type`: `prediction.recorded / parameter.changed / action.triggered / answer.checked / hint.opened / voice.requested / scene.enter`, optional small payload. A02 can map events to its FSM/Voice contracts; none are written to the A02 Engine from A05.
- Preview: `npm ci && npm run dev` → `/a05-dram-preview.html`, using `src/a05/dram/preview.tsx`; local Web Speech request only upon user button.
- Shared visual CSS inherited from M01 `../a05Scenes.css`; DRAM-only overrides in `dramScenes.css`. **Stacked dependency means PR #8 must be handled before independent D02 integration.**

### QA and limitations
- [x] Created four distinct 2.5D React/SVG renderers and real stateful direct controls, responsive panels, touch-friendly buttons, native keyboard slider, reduced-motion support.
- [x] Wrote unit assertions for write isolation, ±0.05 charge sharing, destructive read & restore, leakage/refresh, bank parallel toy, concept+observations gating.
- [ ] D02 production application, persistence, global Voice Tutor, screen reader testing and actual end-user learning evaluation **not performed**.
- [ ] Real desktop/mobile browser screenshot and device QA for **D02** pending; never treat TypeScript/CI results as evidence of browser visual QA.
- [ ] A06 science/tone cross review requested, including row/bank bus caveat and charge-sharing teaching representation.
- [ ] Native/target device touch/speech synthesis varies by browser; demo's local fallback is intentionally non-blocking.

M01's actual browser validation is separately tracked on [A05 PR #8](https://github.com/Junebooky/interactive-engineering/pull/8) via Playwright Chromium CI and uploaded screen evidence. Do not conflate M01 QA with DRAM QA.
