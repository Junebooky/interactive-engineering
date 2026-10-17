# A05 Lesson 11 · semiconductor band/doping/PN→MOS SceneSpec and A02 adapter contract

A06 [direct v1 handoff](https://github.com/Junebooky/interactive-engineering/issues/4#issuecomment-6232666878), [production backlog](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/production-backlog.md), [11 storyboards five steps](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/lessons/11-doping-pn-foundations.md), [senior physical derivation](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/deep-dives/11-pn-foundations.md). **12 foundation Lesson code/browser delivered before starting this Lesson 11; MOS capacitor #14 remains A06 RESEARCHING, not a buildable storyboard**.

## Five independently manipulable React/SVG 2.5D scenes
| Scene ID | Manipulation & learning outcome | Engineering boundary |
|---|---|---|
| `semiconductor-band-gap` | metal overlapping vs Si 1.1 eV gap vs illustrative large 5 eV gap; qualitative warm/light excitation. Hole shown as electronic vacancy, not positively charged electron. | Energy gap **not physical gap**; Si Eg toy~1.1eV, no carrier density/temperature calculation |
| `silicon-donor-acceptor-doping` | intrinsic vs donor P n-type electron-majority vs acceptor B p-type hole-majority; fixed ions and minority carrier reminder. | 10-icon grid **not concentration**; bulk approximately neutral even when doped, ionization details unmodeled |
| `pn-diffusion-drift-equilibrium` | n/p separate→initial diffusion→equilibrium; fixed n+ donor/p− acceptor, internal E points **n+→p−**, normalized +1 diffusion and −1 drift net0 in equilibrium. | Not free energy/battery voltage; toy current normalizations no measured net transient; depletion mobile carrier reduction ≠ removal of all dopants |
| `pn-bias-depletion-calculator` | p-relative-to-n Va−1/0/+0.2V, output Vbi and W in **µm** plus n/p widths, optional unequal doping 1e17/cm³. | Si 300K, ni=1e10cm⁻³, epsilonSi=1.0359e−12F/cm, thermal voltage25.852mV, abrupt 1D depletion; default Na=Nd=1e16cm⁻³ gives **Vbi~0.714V**, W ~0.6659/0.4298/0.3647µm. **Vbi not external battery**, no high injection |
| `pn-diode-current-to-mos` | diode −1/0/+0.3/+0.4 V Shockley curve and insulated MOS-gate toggle. | Is=1pA, ideality2, VT25.852mV, I(+0.3)~0.330nA, I(+0.4)~2.289nA, −1V~−1pA, no hard 0.7V threshold. **MOS gate oxide insulated** ≠ forward PN diode injection |

A06 story respected: hook/question → answer veil/prediction → variable manipulation → condition-based answer + 3 misconception-specific correction messages → 3 hints → Why/nextHook. Voice on user action only; source types and readouts include units. Layered original 2.5D styled SVG illustration ≠ industrial semiconductor packaging 2.5D; no commercial image copying/gamification.

### Exact A02 engine-facing API
- Pure view in `src/a05/pn/PnSceneVisual.tsx`: `PnSceneVisual({sceneId:PnSceneId,state:PnVisualState,revealed:boolean})`. `PnVisualState` has `material,light,warm,dopant,phase,bias,na,nd,diodeBias,gate`. No progress/state side-effects.
- Pure physical computations and grading in `src/a05/pn/pnModel.ts`: `bandMaterial,dopantModel,pnEquilibrium,depletion,diodeCurrent,gateContrast,evaluatePn`. Result `PnFeedback{passed,conditions[]}`; success requires observed control facts AND conceptual explanation.
- Separate QA/demo controller `PnSceneLab({onEvent?,onSpeech?})` in `src/a05/pn/PnSceneLab.tsx` for preview only. `PnEvent` union types `scene.enter|prediction.recorded|parameter.changed|answer.checked|hint.opened|voice.requested` with payload. **A02 owns product FSM, Voice scheduling, saved progress, content registry and app QA**, don't embed A05 demo state.
- Independent URL `/a05-pn-preview.html` with Korean speech fallback and visible request transcript, `src/__tests__/a05Pn.test.ts` pure physics+grading tests, `scripts/a05-pn-browser.mjs` and `.github/workflows/a05-pn-browser-qa.yml` actual browser QA.
- Branch `feat/a05-11-pn-doping-foundations`, stacked on A05 Lesson12 (then G03#15, SRAM#13, DRAM#10, M01#8 and A02#5). A02 app branches/main not edited.

### Accuracy and QA gates
- S01 "hole=positive electron" wrong, Si Eg varies and band diagrams oversimplify.
- S02 P donor fixed positive ion vs n majority electron, B acceptor fixed negative ion vs p majority hole, bulk neutral, minority >0.
- S03 electron diffusion direction and conventional current/field distinctions, equilibrium drift/diffusion current signs +1/−1 toy **do not imply electrons stop**.
- S04 W model only under Va<Vbi; when doping changes Vbi recalculated. W has µm not cm units; Vbi not terminal source.
- S05 diode forward at 0.3/0.4 small but nonzero; reverse toy nonzero leakage not real breakdown/temperature.
- A06 pedagogical/science cross-QA must check source before final `SCENE_READY`. Chromium preview pass must be backed by run and screenshots, separate from mobile physical device/Safari, audible TTS and production A02 integration.
- No merge, main write, or public deployment.
