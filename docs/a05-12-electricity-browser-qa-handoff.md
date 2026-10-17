# A05 Lesson 12 — verified actual Chromium QA and direct A02 handoff
**A06 owner handoff:** [Issue #4 #6232666878](https://github.com/Junebooky/interactive-engineering/issues/4#issuecomment-6232666878) · [A06 12 STORY_READY](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/lessons/12-electricity-rc-foundations.md).

## Exactly proven QA scope
- **Browser-tested source SHA:** `8b188f4e941e42f850381b20549cde980a24b732`; later only this evidence document added. Draft [PR #18](https://github.com/Junebooky/interactive-engineering/pull/18).
- Real Vite + Chromium [**GitHub Actions QA run #39025894800 SUCCESS**](https://github.com/Junebooky/interactive-engineering/actions/runs/39025894800), **7 PASS / 0 FAIL**, [12 actual PNG captures, artifact #12097863350](https://github.com/Junebooky/interactive-engineering/actions/runs/39025894800/artifacts/12097863350), artifact 14-day retention. Source `scripts/a05-electricity-browser.mjs`, `.github/workflows/a05-electricity-browser-qa.yml`.
- Lint/Vitest/TypeScript + Vite production-build [**CI #39025894757 SUCCESS**](https://github.com/Junebooky/interactive-engineering/actions/runs/39025894757), same code SHA. A separate `CI #39025899399` also succeeded.
- Earlier workflow [#39025779532 failed](https://github.com/Junebooky/interactive-engineering/actions/runs/39025779532) owing to Playwright selector `관습전류` matching correct answer and a choice. Fixed using `exact:true` in QA script, final run passed; **not claimed as first-pass success**.

| Actual browser case | Evidence PNG |
|---|---|
| Pre-prediction hides answer and numeric readouts | `01-prediction-hidden.png` |
| 12-S01 source 5V/1kΩ with OPEN=0mA, CLOSED=5mA, electron vs convention direction, misconception wrong-then-right, 3 hints, Why | `02-voltage-current-arrows.png` |
| 12-S02 1kΩ+1kΩ series 2.5mA and 1kΩ//1kΩ 10mA, KCL & graded explanation | `03-resistors-series.png`, `04-resistors-parallel.png` |
| 12-S03 keyboard slider t=10ms, RC 1kΩ×10µF τ10ms, charge3.16V/discharge1.84V, R2kΩ→τ20ms, explanation | `05-rc-charge-10ms.png`, `06-rc-discharge-10ms.png`, `07-rc-double-r.png` |
| 12-S04 independent toy V and I controls, 5V×10mA×10s=50mW,0.5J; 10µF @5V=125µJ, @10V=500µJ | `08-power-base.png`, `09-capacitor-energy.png` |
| SpeechSynthesisUtterance missing causes visible Korean text fallback and requested speech transcript | `10-voice-text-fallback.png` |
| iPhone-emulated Chromium real touch, reduced-motion, 375/320px root no horizontal overflow | `11-mobile-375.png`, `12-mobile-320.png` |

## Typed A02 contract
- Four scene ids `charge-voltage-current-arrows`, `resistors-series-parallel-kcl`, `capacitor-rc-charge-discharge`, `power-energy-joules-heat`.
- Pure **render** `ElectricitySceneVisual({sceneId:ElecSceneId,state:ElectricityVisualState,revealed:boolean})`, `ElectricityVisualState` fields `{volts,closed,direction,topology,mode,rOhms,cMicroFarads,timeMs,powerVolts,loadMilliAmps,seconds}`.
- Pure **model/validation** `electricityModel.ts`: `simpleCircuit, resistorNetwork, rcModel, energyModel, evaluateElectricity`. `evaluateElectricity(sceneId,observedIds,answerId)` gates success on concrete actions AND accurate conceptual explanation, returns `ElecFeedback{passed,conditions[]}`.
- **Standalone demo only** `ElectricitySceneLab({onEvent?,onSpeech?})`, event union `scene.enter|prediction.recorded|parameter.changed|hint.opened|answer.checked|voice.requested` as `{sceneId,type,payload?}`. A02 must use its **own** shared FSM/progress persistence/voice runtime; DO NOT embed A05 standalone lab's local progress controller in product.
- [SceneSpec/physics assumptions](https://github.com/Junebooky/interactive-engineering/blob/feat/a05-12-electricity-rc-foundations/docs/a05-12-electricity-scene-spec.md); A06 [lesson 12 storyboard](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/lessons/12-electricity-rc-foundations.md).
- Stack PR #18 → A05 G03 #15 → SRAM #13 → DRAM #10 → M01 #8 → A02 #5, each independent diff. A05 has **not** modified A02 engine/Voice/PR9 or main.

**Scientific edge cases:** Voltage may exist without DC open-current, conventional vs electron drift opposite in metal. τ10ms is **toy RC**, never DRAM retention. Voltage/current inputs in energy scene independent rather than fixed R, cap energy is **stored field energy** not all energy required from charger. Native physical phone, Safari, screen reader, actual Korean TTS audible quality, A06 source science re-review and A02 full app E2E **not performed**. No main merge or deploy.

**Status:** `A05_BROWSER_QA_PASS / A02_HANDOFF_READY`; science review A06 pending before final `SCENE_READY` per A06 backlog strict definition.
