# A05 Lesson 11 — actual Chromium browser evidence & A02 typed handoff

## Scope and exactly verified SHA
A06 [direct handoff #6232666878](https://github.com/Junebooky/interactive-engineering/issues/4#issuecomment-6232666878), [Story 11 five scene](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/lessons/11-doping-pn-foundations.md), [senior notes](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/deep-dives/11-pn-foundations.md).
- Independent source [Draft PR #20](https://github.com/Junebooky/interactive-engineering/pull/20), **browser-tested SHA `b27a2e50db8bb7f0149dd4a4d091e396ba199aa9`**. Then only scene-spec documentation was added.
- **Actual Vite/Playwright Chromium** [workflow run #39026561882 SUCCESS](https://github.com/Junebooky/interactive-engineering/actions/runs/39026561882), **8 PASS / 0 FAIL**.
- **12 PNG screenshot ZIP artifact #12098289633** [download in GitHub Actions](https://github.com/Junebooky/interactive-engineering/actions/runs/39026561882/artifacts/12098289633), 14-day retention. `browser-evidence/pn11/*.png`.
- [Lint/Vitest/TypeScript + Vite CI #39026561862 **SUCCESS**](https://github.com/Junebooky/interactive-engineering/actions/runs/39026561862) same source SHA; newer doc-only CI #39026606519 also success.
- Browser test script `scripts/a05-pn-browser.mjs`, workflow `.github/workflows/a05-pn-browser-qa.yml`.

| Real browser scenario | Outcome + evidence |
|---|---|
| Prediction before reveal hides value/readout | PASS `01-pn-prediction-veil.png` |
| `semiconductor-band-gap` metal/Si~1.1eV/largegap5eV, light; incorrect-feedback + three hints + Why + correct explanation | PASS `02-pn-band-gap.png` |
| `silicon-donor-acceptor-doping` donor P electron-majority and acceptor B hole-majority, charge-neutral bulk/minority present | PASS `03-pn-donor.png`, `04-pn-acceptor.png` |
| `pn-diffusion-drift-equilibrium` contact→equilibrium, built-in E n(+)→p(−), +1−1=0 net toy, external 0V | PASS `05-pn-drift-diffusion.png` |
| `pn-bias-depletion-calculator` Va reverse−1/0/+0.2, W~0.6659/0.4298/0.3647µm, internal Vbi~0.714V ≠ battery | PASS `06-pn-reverse-w.png`, `07-pn-forward-w.png` |
| `pn-diode-current-to-mos` 0.3V~0.330nA, 0.4V~2.289nA, −1V negative leakage, MOS oxide insulated card | PASS `08-diode-0p3.png`, `09-diode-mos-oxide.png` |
| Unsupported Korean speech causes readable fallback + source transcript, no JS error | PASS `10-pn-voice-fallback.png` |
| iPhone Chromium emulated **touch** metal card, viewport 375px and 320px no root overflow, reduced motion | PASS `11-pn-mobile-375.png`, `12-pn-mobile-320.png` |

## A02 direct typed scene contract, no engine/Voice duplication
- **5 scenes**: `semiconductor-band-gap`, `silicon-donor-acceptor-doping`, `pn-diffusion-drift-equilibrium`, `pn-bias-depletion-calculator`, `pn-diode-current-to-mos`.
- **Pure SVG** `src/a05/pn/PnSceneVisual.tsx`: `PnSceneVisual({sceneId:PnSceneId,state:PnVisualState,revealed:boolean})` with `PnVisualState` fields `material,light,warm,dopant,phase,bias,na,nd,diodeBias,gate`. No progress mutation.
- **Pure physics+grading** `src/a05/pn/pnModel.ts`: `bandMaterial`, `dopantModel`, `pnEquilibrium`, `depletion`, `diodeCurrent`, `gateContrast`, `evaluatePn`. `PnFeedback{passed,conditions[]}`; `evaluatePn(sceneId,observedEventKeys,answerId)` requires physical actions plus correct explanation.
- **Standalone A05 demo** `PnSceneLab({onEvent?,onSpeech?})` in `src/a05/pn/PnSceneLab.tsx`, events `PnEvent{sceneId,type,payload?}`, union `scene.enter|prediction.recorded|parameter.changed|answer.checked|hint.opened|voice.requested`. App state/persistence/engine Voice belongs to A02, **don't mount duplicate demo FSM**.
- [Source/spec/assumptions](https://github.com/Junebooky/interactive-engineering/blob/feat/a05-11-pn-doping-foundations/docs/a05-11-pn-scene-spec.md), independent browser `/a05-pn-preview.html`, unit tests `src/__tests__/a05Pn.test.ts`.
- **Stack** `feat/a05-11-pn-doping-foundations` → Lesson12 PR #18 → G03 #15 → SRAM #13 → DRAM #10 → M01 #8 → A02 #5. A05 did **not** edit A02 branch or production engine.

## Truthful scientific and production QA boundary
- Bandgap is energy, not physical hole. n donor majority electrons, p acceptor majority holes, bulk near-neutral and minority >0.
- Internal PN n(+) donor ions/p(−) acceptor ions E points n→p; steady diffusion and drift cancel, **not motionless or free battery**. Depletion W and diode Shockley metrics are **toy 300K models** not real SKU measurement/high injection/breakdown behavior. Si Vbi internal potential cannot be externally harvested as a supply. MOS oxide insulates field-effect gate, distinct from diode injected current.
- A06 separate source/senior science QA and A02 product app integration E2E, native phone/Safari, screen-reader and audible Korean TTS are **not verified** by headless Chromium. Mark `A05_BROWSER_QA_PASS / A02_HANDOFF_READY / A06_SCIENCE_QA_PENDING`, not product COMPLETE.
- 14 MOS capacitor remains **RESEARCHING** per A06 production backlog; A05 will not mark it ready without handoff.
- **No main merge, no deployment**.


## [2026-10-17] A06/A07 Round02 corrective source QA and real Chromium rerun (supersedes earlier SHA for current code)
- **Corrective scope:** A06 revised lesson11 blob b61c9a49: introductory spoken prompts changed to neutral discovery questions; diode pre-title no answer leak. Upstream Lesson12 science/Voice/RC continuity source files explicitly synchronized into this downstream stacked branch.
- **Verified source SHA:** `6959403a13aaf46a9b700172bf947c235ef025ae`. Previous screen captures and CI runs remain historical, **not the current corrected source**.
- **Actual Chromium browser rerun [#39027054888 — SUCCESS](https://github.com/Junebooky/interactive-engineering/actions/runs/39027054888)**: 8 PASS/0 FAIL, [12 PNG screenshots artifact #12098517945](https://github.com/Junebooky/interactive-engineering/actions/runs/39027054888/artifacts/12098517945). Corrected code-based screenshot evidence.
- **CI [run #39027054809 — SUCCESS](https://github.com/Junebooky/interactive-engineering/actions/runs/39027054809)**, lint/unit test/TypeScript + Vite build. Science model and browser runner modified as described; current QA at exact SHA.
- **Status:** A05 preview Chromium QA PASS, A06/A07 EDU_QA recheck pending; A02 integrated app E2E + physical device/Safari/audible voice/screen-reader QA not done. main merge/deploy forbidden.
