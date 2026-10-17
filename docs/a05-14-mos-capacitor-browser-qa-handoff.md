# A05 Lesson 14 · four MOS capacitor 2.5D scenes — real Chromium QA & A02 direct adapter handoff

## Canonical source & exact evidence
- [A06 canonical lesson14](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/lessons/14-mos-capacitor-field-inversion.md) **blob `d356f8ae8746d6eea880989736343079109f14af`** · [A07 source PASS / common card #28](https://github.com/Junebooky/interactive-engineering/issues/28) · [A06 quantitative derivation](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/deep-dives/14-mos-capacitor-physics.md).
- Independent [A05 Draft PR #40](https://github.com/Junebooky/interactive-engineering/pull/40), **browser+CI tested code HEAD `49ed826647fb69a7b38084941dfc0a111ba608ca`**. This documentation is a later *docs-only* commit, not a new tested code assertion.
- **Actual Playwright Chromium** [run #39030396906 SUCCESS, 7 PASS / 0 FAIL](https://github.com/Junebooky/interactive-engineering/actions/runs/39030396906) · [13 PNG screenshots in artifact #12100077848](https://github.com/Junebooky/interactive-engineering/actions/runs/39030396906/artifacts/12100077848) · [lint/Vitest/TypeScript+Vite CI #39030396847 PASS](https://github.com/Junebooky/interactive-engineering/actions/runs/39030396847).

## A02 exact typed scene contract
1. **Pure physics**: `src/a05/mos14/mos14Model.ts`, `Mos14SceneId` union & `mos14Scenes`; `Mos14State{gateV:-0.5|0|0.3|1.1,oxideNm:5|10,phase:'switching'|'steady',device:'capacitor'|'nmos',vds:0|0.5,showCv:boolean}`. Pure funcs `mos14OxidePhysics(toxNm)`, `mos14Surface(gateV,oxideNm)`, `mos14OxideCurrent(phase)`, `mos14Cv(toxNm,showCv)`, `mos14Current(state)`, `gradeMos14(id,observations,answer)`.
2. **Pure original layered SVG**: `Mos14SceneVisual({sceneId:Mos14SceneId,state:Mos14State,revealed:boolean})` in `src/a05/mos14/Mos14SceneVisual.tsx`. No persistence engine, no actions. Never render numeric readouts, charged carriers or answer when `revealed=false` (pre-prediction).
3. **QA-only standalone controller**: `Mos14SceneLab({onEvent?,onSpeech?})` in `src/a05/mos14/Mos14SceneLab.tsx`, `Mos14Event{sceneId,type:'scene.enter'|'prediction.recorded'|'parameter.changed'|'answer.checked'|'voice.requested'|'hint.opened',payload?}`. A02 owns canonical LessonStep FSM, learner answer, voice tutor/persistence and app-level grading; **do not mount A05 demo lab as product FSM**.
4. Independent preview `/a05-mos14-preview.html`, `src/a05/mos14/preview.tsx`, CSS `mos14.css`; unit tests `src/__tests__/a05Mos14.test.ts`; Chromium QA `scripts/a05-mos14-browser.mjs`, workflow `.github/workflows/a05-mos14-browser-qa.yml`.

## Four scenes and grader observations
| Scene | Inputs; observed tags required for pass | Numerical/scientific constraints |
|---|---|---|
| `mos-oxide-field-without-dc-path` | gate bias ±.5/.3 and phase switching/steady; `negative,positive,switching,steady` + answer id `field-not-dc` | Ideal oxide through DC = 0A regardless phase; external capacitor **charging current during bias change** exists, not DC tunnel through oxide |
| `mos-accumulation-depletion-inversion` | gate −.5, 0, +.3, +1.1, observation `accumulation,flatband,depletion,inversion` + `bulk-unchanged` | p-type bulk/dopants unchanged, negative gate holes collect; fixed negative acceptor ions remain in depletion. Toy Si300K, NA1e16/cm³, ni1e10/cm³, oxide5nm, **VFB=0 special case**, derived VT~0.785V, **NOT M01's separate toy0.7V**. Quasi-static sufficient-minority-carrier response, fast sweep deep depletion omitted |
| `mos-oxide-capacitance-cv` | oxide 5 and 10 nm and open qualitative CV, `tox5,tox10,cv` + `inverse-series-frequency` | C′ox5nm 0.69062665 µF/cm², C′ox10nm 0.345313325 µF/cm², inverse thickness; toy depletion series C lower than oxide C. HF/LF inversion **schematic not measured** |
| `mos-cap-to-nmosfet-bridge` | device cap, nMOS+VDS=0, nMOS+VDS=.5, tags `cap,nmos-zero,nmos-positive` + `terminals-and-vds` | **2-terminal cap ID undefined (not 0A)**, S/D present & VDS0 ideal net ID0, +VDS .5 appropriate inversion means ID possible (qualitative only); VGB≈VGS only under body/source tie |

## Actual Chromium 7 positive/negative checks / exact screenshots
1. `01-before-prediction-veiled.png`: every readout and SVG hidden before prediction, neutral initial question.
2. `02-oxide-switching-current.png`, `03-oxide-steady-feedback.png`: switching versus steady oxide DC/external charging, incorrect answer blocked, 3 hints then successful reasoning and Why.
3. `04-accumulation-holes.png`, `05-depletion-fixed-ions.png`, `06-inversion-electrons.png`: p-type fixed dopants and surface carrier transitions, dynamically derived VT.
4. `07-oxide-5nm-capacitance.png`, `08-oxide-10nm-hf-lf-cv.png`: exact numerical values with µF/cm², HF/LF explicitly qualitative, incorrect physical assumption rejected.
5. `09-two-terminal-no-id.png`, `10-nmos-sd-positive-vds.png`: no-drain ID undefined vs nMOS 0 and possible positive VDS.
6. `11-voice-fallback.png`: Korean request transcript, no pre-prediction science spoiler, unsupported speech text fallback.
7. `12-mobile-375.png`, `13-mobile-320.png`: emulated iPhone Chromium touch, reduced-motion, no root horizontal overflow.

## Open + next (not an assertion of app readiness)
- **A02 P1 next**: integrate pure model/view & A06 story into real Lesson Engine/Voice/progress, test pre-reveal DOM/ARIA/TTS spoiler, actual wrong-choice and time/threshold boundary, app Chrome E2E+regression/CI at A02's **own new product SHA**; post HANDOFF_ACCEPTED in [#28](https://github.com/Junebooky/interactive-engineering/issues/28).
- **A07→A06 P1**: independently review new A05 visual and feedback at tested source SHA; source educational PASS pertains to A06 original, **not** A05 browser/scene.
- **Owner P2**: real iOS/Safari, native audible Korean TTS, actual accessibility assistive technologies, first-time learner testing, explicit merge/deploy authorization. **RELEASE_HOLD**.
- Branch is **stacked Draft PR**; no main merge or deployment, no edit to A02-owned branch.
