# A05 · MOSFET M01 actual-browser QA evidence · 2026-10-17 KST

- Branch / head validated: `feat/a05-mosfet-discovery-scenes` @ `0ced96997815b4a8f77f26b9afe03ee514923276`.
- **Real Chromium/Vite headless test execution, not just source inspection or Vitest:** [GitHub Actions run 39018715363](https://github.com/Junebooky/interactive-engineering/actions/runs/39018715363) → **SUCCESS**.
- [10 browser screenshots (ZIP artifact 12095912282)](https://github.com/Junebooky/interactive-engineering/actions/runs/39018715363/artifacts/12095912282).
- `npm run dev -- --host 127.0.0.1 --port 4179 --strictPort` → `/a05-preview.html` with Playwright Chromium v141 (Playwright 1.56.1). Screenshot capture is **CI-local**, not a public deployment.
- Other CI for head: [Actions runs on PR #8](https://github.com/Junebooky/interactive-engineering/pull/8/checks), oxlint/Vitest/tsc+Vite **success**.
- Reproducible source: `scripts/a05-browser-smoke.mjs`; workflow `.github/workflows/a05-browser-qa.yml`.
- Note: first browser QA [run 39018082141](https://github.com/Junebooky/interactive-engineering/actions/runs/39018082141) failed due to Playwright's malformed `fill('1.0')` range value, **not** app's physical model; changed to canonical `fill('1')` and reran. Current head green.

## Recorded runtime test matrix (CI log 11 PASS checks, 0 fail)

| Category | Automated Chromium result | Artifact / proof |
|---|---|---|
| Desktop 1440×900 prediction gate | PASS: no `.a05-readouts` visible before prediction; screen then unlocks | `01-predict-hidden-desktop.png` |
| MOSFET `mosfet-field` VGS boundary 0.6 / 0.7 / 0.8 V | PASS: exact 0.7 displays explicit **경계 (두께 0)**; 0.8 starts visible inversion layer, toy Vth specified | `02-gate-below.png`, `02-gate-boundary.png`, `02-gate-above.png` |
| M01-S01 pedagogy | PASS: false oxide-crossing choice gets conditional error; three hint levels open; changing to correct surface accumulation passes, Why reveals nextHook | Actions browser log |
| `mosfet-current` | PASS: VDS 1.8V displays IV saturation with nonzero ID, physically separate conventional current / electron direction | `03-current-desktop.png` |
| `nmos-resistor-inverter` | PASS: Vin 5V shows Vout 0.45V and LOW; resistance is not called perfect short | `04-resistor-desktop.png` |
| `cmos-not-gate` | PASS: distinct CMOS circuit, partial truth-table error then 0→1/1→0 correct state | `05-cmos-desktop.png` |
| Keyboard | PASS: focused native VGS slider responds to ArrowRight | Actions browser log |
| Reduced motion | PASS: reduced-motion stylesheet available and visual dash animation explicitly disabled by CSS rule (CSS presence test; direct computed animation property not verified) | Actions browser log |
| Voice button & unsupported API | PASS: interactive voice request no thrown page error; forcing `SpeechSynthesisUtterance` unavailable displays readable Korean text fallback | `08-voice-fallback-desktop.png` |
| Mobile touch & overflow | PASS: iPhone emulation, `tap` on slider, state fill, 375px/320px no root horizontal overflow | `06-gate-mobile-375.png`, `07-gate-mobile-320.png` |

## Scientific and education corrections from A06 cross-QA
[Source cross-QA](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/a05-m01-cross-qa.md) & [A06 feedback on PR #8](https://github.com/Junebooky/interactive-engineering/pull/8#issuecomment-6231604486).

1. **P1 `mosfet-field` 0.7V border:** A02 toy has `isChannelFormed=true` but `channelThickness=0` exactly at Vth; new visual and readout both explicitly say threshold boundary / 0 channel thickness. Regression test asserts 0.6/0.7/0.8 with VDS=0. A02 model itself not altered.
2. **P1 subthreshold semantics:** VDS>0 permits subthreshold currents in physical devices; this teaching scene fixes VDS=0 hence net DC ID remains 0 even below threshold. Misconception option/feedback now state bias condition.
3. **P2 initial voltage observation:** as originally implemented, 0V is displayed after prediction and counted; changed condition *text* now says initial low voltage vs manually varied high voltage (current engine policy unchanged).
4. **P2 nextHook:** connects CMOS to feedback-based **SRAM** versus 1T1C **DRAM**, as suggested by A06's expanded 05 SRAM storyboard.

## Remaining honest limitations
- Screenshot ZIP exists and Chrome automatic overflow/assertions passed; **manual image-by-image designer review and native physical phone/touch/audio/screen reader QA not yet performed**.
- Voice success means API call did not throw, **not** that a Korean voice pack audibly spoke on a device.
- Reduced motion test checks stylesheet presence, **not** OS-level user accessibility approval.
- Browser test uses official Playwright iPhone emulation (Chromium/touch), **not Safari** and not a physical iPhone.
- A02 app engine/persistence/global Voice integration, real user understanding tests, final A06 signoff remain separate.
- Main merge, deployment, public release **not performed**.
