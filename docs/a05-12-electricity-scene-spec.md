# A05 Lesson 12 · Voltage/current, resistor networks, RC and energy — 2.5D SceneSpec

**A06 direct handoff:** [Issue #4 comment #6232666878](https://github.com/Junebooky/interactive-engineering/issues/4#issuecomment-6232666878), [A06 canonical production backlog](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/production-backlog.md), [A06 lesson12](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/lessons/12-electricity-rc-foundations.md) & [senior deep dive](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/deep-dives/12-electricity-rc-foundations.md). Status `STORY_READY` from A06, priority **12 before 11 PN; 14 still RESEARCHING**. DRAM #10 P2 already fixed and tested, handed to A02.

## Four unique 2.5D scene contracts
| sceneId | model/controller | required observation + grading | explicit limits |
|---|---|---|---|
| `charge-voltage-current-arrows` | 5V source & 1kΩ switch OPEN/CLOSED, 0V alternative, electron/conventional arrow toggle | OPEN under 5V: I=0mA, CLOSED: I=5mA, electron direction opposite conventional, explain V≠I | Ideal metal DC; no open-switch leakage/AC/arc, source terminal voltage remains when open |
| `resistors-series-parallel-kcl` | two 1kΩ series/parallel and node arrows | series Req=2kΩ I=2.5mA VR=2.5V each, parallel Req=500Ω total10mA, branch5+5, KCL | ideal wiring, no source current limit or temperature feedback |
| `capacitor-rc-charge-discharge` | R 1/2kΩ C10/20µF, t0..100ms keyboard slider; charge/discharge 5V | τ=RC default 10ms, at τ charge3.16V/discharge1.84V, increasing R or C increases τ, 63/37%; include hint/Why | no leakage, access transistor, ESR, actual DRAM retention. **R/C changes reset toy t=0**; discharge assumed initially fully charged |
| `power-energy-joules-heat` | voltage 5/10V, independent toy load current5/10mA, time1/10s; C10µF | 5V×10mA=50mW, ×10s=0.5J, Ecap=½CV²=125µJ at5V &500µJ at10V; W≠J | V and I independent toy switches **not fixed resistor**; cap stored energy ≠ charge supply energy/dissipated losses, heat location unmodeled |

All four scenes: **prediction veil before showing numerical result**, original React SVG layered circuit 2.5D with gloss, semantic/readable react controls, observable vs explanation conditions, three misconceptions with keyed Korean correction, 3-tier hints, Why? and nextHook, spoken Korean callback and readable fallback. No XP/rewards/leaderboards. Touch ≥44px via common A05 styles, keyboard, reduced-motion and mobile resizing. Visual 2.5D is a rendering style, not semiconductor physical 2.5D packaging.

## A02 typed handoff contract
- **Pure renderer:** `ElectricitySceneVisual({sceneId:ElecSceneId,state:ElectricityVisualState,revealed:boolean})` in `src/a05/electricity/ElectricitySceneVisual.tsx`; props cover `volts,closed,direction,topology,mode,rOhms,cMicroFarads,timeMs,powerVolts,loadMilliAmps,seconds`. No app state mutation or persistent side effects.
- **Pure model/assessment:** `src/a05/electricity/electricityModel.ts` exports `electricitySceneOrder`, `simpleCircuit`, `resistorNetwork`, `rcModel`, `energyModel`, `evaluateElectricity(id,observations,answerId)`, typed `ElecFeedback`, `ElecEvent`.
- **Standalone preview only:** `ElectricitySceneLab({onEvent?,onSpeech?})` with `{sceneId,type,payload?}` events `scene.enter|prediction.recorded|parameter.changed|hint.opened|answer.checked|voice.requested`. A02 app canonical Lesson Engine, Voice playback/enable, and persistence not duplicated.
- Browser `/a05-electricity-preview.html` served by local `npm run dev`; preview speech fallback in `src/a05/electricity/preview.tsx`. Unit tests `src/__tests__/a05Electricity.test.ts`.
- **Stacked base** G03 `feat/a05-gpu-memory-bottleneck` (PR #15), which stacks on SRAM #13, DRAM #10, M01 #8 and A02 #5. This lesson is a separate change set; don't merge entire stack as "Lesson12-only" in main.

## Acceptance / distinction
- A05 standalone source, its browser screenshots, CI checks and A06 science cross-QA are **separate** from A02 product app integrated browser E2E, accessibility/audible native-phone/Safari QA.
- Source-backed toy science, not a physical mains/battery lab procedure. No real device specs asserted. Precise tests/QA run URLs and code tested SHA added after actual completion only.
- **A06 science review request:** particularly S01 electron/current direction on visual arrows, S03 RC startup/discharge assumptions, S04 V/I independent vs fixed resistance. 11 PN is next READY; 14 only when A06 marks STORY_READY.
- Owner forbidden operations: **no main merge, no deploy**.
