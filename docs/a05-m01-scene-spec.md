# A05 · M01 scene implementation / A02 integration contract

Status: A05 interactive **standalone prototype**, four complete 2.5D scenes (M01-S01..S04). No A02 app integration, no main merge/deploy.
Upstream handoff: [A06 PR #7](https://github.com/Junebooky/interactive-engineering/pull/7), [Issue #4 handoff](https://github.com/Junebooky/interactive-engineering/issues/4#issuecomment-6231261215).
Integration reference: [A02 PR #5](https://github.com/Junebooky/interactive-engineering/pull/5), head `0c480ffd268f992a2a240131a90e3cb8647945db` when branch created.
A05 working branch: `feat/a05-mosfet-discovery-scenes`, stacked on **A02's unmerged head** (A02 branch not modified).

## Run sample (once this branch is checked out locally)
- `npm ci` → `npm run dev` → open `/a05-preview.html`.
- `npm test` runs existing regression suite plus `src/__tests__/a05Scenes.test.ts`.
- `npm run build` validates standalone preview TSX with the existing app build; Vite produces a production entry only for the standard app until A02 chooses explicit multi-page production integration.
- Build/runtime/browser QA **must be verified in CI or a checked-out development environment**; creation of test files is not evidence that they passed.

## Scene contracts

| Scene | Story/interaction | Physics & numerical outputs | Check |
|---|---|---|---|
| `mosfet-field` M01-S01 | Predict threshold, vary VGS 0–1.2V in 0.1V steps, compare channel | nMOS layered gate/oxide/substrate/n+ source/drain; toy Vth 0.7V; VDS=0 gives ID=0 (net DC) | Observed 0 and ≥0.8V + explains **electrons gathering beneath oxide**, not passing through it |
| `mosfet-current` M01-S02 | Predict current at VDS 0/1V, vary VDS 0–2V in 0.1V steps, compare arrow & IV | VGS=1.5V, kn=2mA/V²; 0→triode→saturation with nonzero ID; electrons SOURCE→DRAIN, conventional ID DRAIN→SOURCE | Observed 0 and ≥1V + distinguishes channel from bias and saturation from cutoff |
| `nmos-resistor-inverter` M01-S03 | Predict Vout at HIGH Vin, toggle 0/5V, inspect electrical connections | **Resistor-loaded** 10kΩ pull-up, nMOS pull-down; use A02 `calculateInverterState`; 5V Vin gives Vout≈0.45V (LOW), not exact 0 | Both Vin states observed + correctly explains pulldown |
| `cmos-not-gate` M01-S04 | Predict pMOS state at Vin=0, toggle 0/5V, fill both truth-table entries | **New distinct CMOS** upper pMOS/lower nMOS; ideal settled Vout 5V/0V; real leakage/switching power not modeled | Both Vin states observed + out0=1 AND out1=0; condition-level feedback |

Shared flow: **prediction stored before rendering the observation** → direct voltage control (keyboard accessible) → explicit final conceptual answer → condition-by-condition check → targeted misconceptions/hints → gated Why and nextHook. Incorrect prediction does *not* permanently penalize learning. Merely sliding a control cannot pass validation.

## A02 API handoff

1. `A05SceneVisual({sceneId, values, showObservation})` renders a pure visual from parent-controlled values. It does not own progress, grading or voice. All four SVGs share a reusable layered circuit board or semiconductor cutaway, reactive readouts, and scope-labeled units.
2. `A05MosfetSceneLab({onEvent?,onSpeech?})` is a **standalone interactive preview**, intentionally outside A02 `LessonPlayer`. Its own ephemeral states are `stepIndex, prediction, visitedVoltageStates, finalChoice/out0/out1, result, hintCount, whyOpen`.
3. `initialSceneValues(sceneId): A05Values`, `evaluateA05Scene(sceneId, visited, answer, values): A05Result`, `mosfetObservation`, `resistorInverterObservation`, `cmosObservation` are pure exports from `src/a05/scenePhysics.ts`. `A05Result.conditions[]` contains `{label,passed,feedback}`.
4. `onEvent(event)` sends `{sceneId,type,payload}`, with `type` one of `scene.enter | prediction.recorded | parameter.changed | answer.checked | hint.opened | voice.requested`. A02 can map these to the existing Lesson Engine FSM and Voice Web Speech API; **do not update A02 engine inside A05**.
5. `onSpeech(sceneId, speechText)` is invoked **only by explicit learner button** in standalone sample, avoiding uncontrolled speech spam. `src/a05/preview.tsx` uses browser speech synthesis for local Korean playback if available; A02 can substitute its voice engine. No external API / sound asset required.
6. A02 integration changes needed: register distinct `cmos-not-gate` scene mode and map A06's `sceneId, prediction, learningGoal, correctIncorrectCriteria, nextHook, displayText, speechText, physicsAssumptions` to canonical Step fields. Existing A02 Step 4 currently uses **resistor-type** inverter for truth table, not A06-required CMOS. Treat engine migration as A02 responsibility.

## A05 animation, accessibility and accuracy

- Self-authored SVG geometry and CSS only; no third-party illustrations, templates or branding.
- Layered front/top/side faces, mint/cyan subtle gradients, soft shadows and depth. This **educational UI 2.5D style is unrelated to physical semiconductor 2.5D advanced packaging**.
- Mobile stacking at 1020px and small-screen HUD at 550px; controls ≥44px; native keyboard-friendly `range` and `button` controls, `aria-pressed`, accessible SVG labels, focus outlines and live feedback.
- Only illustrative current dashes animate; `prefers-reduced-motion: reduce` turns animation off. Dashes are not a calibrated electron drift speed.
- Vth=0.7V and MOSFET long-channel square-law are simplified examples, not guaranteed measured physics. Device geometry not to scale. The A02 inverter Ron model produces a LOW near 0.45V, not an ohmic short. Ideal CMOS settled path suppression does **not** imply real zero static or dynamic power.
- Voice/UI are distinct via `speechText` and `displayText`; hint stages 1–3, four explicit alternative misconceptions for scenes S01–S03, S04 has truth-table-specific corrections.
- Tests added for VDS=0, saturation nonzero, finite Vout at Vin=5V, CMOS complementary topology, all four scene checks, partial truth-table feedback.

## QA checklist / unresolved

- [x] Original 2.5D SVG layers, reusable typed scene props; four M01 scenes coded
- [x] Prediction hiding, manipulation, readouts/IV, direct answer, condition-by-condition feedback, three levels of hints and Why/next
- [x] Scientific limits, reduced motion, keyboard controls, voice callback contract
- [x] Regression tests authored; standalone preview entry authored
- [ ] CI `npm run build` / `npm test` validation **not claimed complete until verified**
- [ ] Desktop/mobile screenshots and actual browser/performance/assistive-tech QA
- [ ] A02 Lesson Engine & persistence/Voice integration, revised course metadata and production route (intentionally outside A05 scope)
- [ ] A06 scientific/tone cross-review of visual portrayal and misconception copy
- [ ] DRAM/GDDR/HBM/NAND/eSSD 2.5D scenes: next lesson batches, not included in first M01 delivery

No score/XP/streak/leaderboard/rewards. No main merge, no deployment. This document distinguishes created source/tests from actually executed runtime verification.
