# A03 — V3 PR #73 re-review (actual Chromium) / Smart Scene Fit P0 #80
**2026-10-18 KST. DESIGN QA: CHANGES REQUIRED — UI_DESIGN_PASS=NO; CAMERA_SCALE_PASS=NO; main merge/deploy HOLD.**

## Evidence and exact tested version
- Official product Draft [PR #73](https://github.com/Junebooky/interactive-engineering/pull/73) **real verified HEAD**: `6694e47be8165db71e59a8a4c8c556292a572562` (**not** `6694e471d871e847c22956fe0425785002ba50fe`; that latter full SHA in A02's handoff is not found in GitHub, though both abbreviate to `6694e47`).
- [CI #39130621477](https://github.com/Junebooky/interactive-engineering/actions/runs/39130621477) and [Chromium Browser QA #39130621470](https://github.com/Junebooky/interactive-engineering/actions/runs/39130621470) are both **SUCCESS on the actual verified full HEAD above**. Artifact [v3-browser-evidence / ID 12137203633](https://github.com/Junebooky/interactive-engineering/actions/runs/39130621470/artifacts/12137203633), 28 PNGs.
- Visually inspected **committed real app PNGs** from this exact branch: `mosfet_app_1440x900_observe.png`, `mosfet_app_390x844_predict.png`, `mosfet_app_390x844_observe.png`, `mosfet_app_320x640_predict.png`, `mosfet_app_320x640_observe.png`, `mobile_390x844_observe.png`, `concept_mosfet_step0_1440x900.png`, `concept_elec_step0_1440x900.png`, `concept_dram_step0_1440x900.png`, `catalog_390x844.png`, `catalog_320x640.png`.
- Reviewed source: `src/engine/sceneFraming.ts`, `src/components/player/SceneViewport.tsx`, `LessonPlayer.tsx`, `ConceptIntroSceneVisual.tsx`, `A03SingleTaskPanel.tsx`, `lessonA03.css`, `scripts/test-v3-catalog-and-lab.mjs`. Real screenshot visual review + source inspection; **I did not independently rerun the Chromium app**.

## Acknowledged fixes — keep these
- [x] Step0 no longer has false `04 · 핵심 발견 완료` label; now `00 · 개념 도입`; MOSFET concept structure illustration no longer shows the previous explicit VGS>=Vth result banner.
- [x] First-viewport CTA appears in 390/320 MOSFET screenshots; mobile lab/sheet outer collision is improved. Physical zoom buttons and toolbar are no longer over the measurement tiles in the previously failing 320 screenshot.
- [x] V3 course catalog is substantially improved: white cards, engineering subject thumbnails, 390/320 typography/filters. Some copy density remains (P1).
- [x] A02 implemented actual reusable `SceneViewport`, typed framing map, reset/+/- zoom, and browser tests checking phase/CTA/slot properties. Keep this foundation.

## P0 BLOCKER #80 — actual mobile 2.5D remains far too small

Side-by-side **actual official A02 screenshot** comparison:
- At 1440×900 MOSFET observe, the MOSFET occupies most of the left lab: device, labels and materials readable.
- At 390×844 observe, the entire rendered MOSFET, text labels and **four embedded readout cards** are squeezed into a small approximately central inset with large unused surrounding dark lab space. The text and scientific structure are hard to read.
- At 320×640 observe the content gets even smaller (approximately thumbnail-like). The desktop responsive visual hierarchy is lost. Circuit 390×844 observe also contains a tiny inner circuit relative to stage/dock and excess unused dark background.
- 390 and 320 mobile lab top-left lesson heading/subtitle and four top-right 44px camera buttons visually **overlap/compete**, especially at 320. The text and `02` step label are hard to distinguish from toolbar and scene-signal overlays.

**Concrete source mechanism**:
1. `SceneViewport.tsx` sets a fixed CSS `width: framing.stableBounds.width`/`height: framing.stableBounds.height` wrapper and applies `scale(fitScale * userZoom)` to **all** `renderSimulator()` children. Existing A05 `.a05-visual` already contains an SVG with its own viewBox **and four `.a05-readouts` descendants**, hence the whole diagram + 4 metrics shrinks together. The target subject bounds are **never applied to SVG content's own coordinate/panning/viewBox**, only to a proxy div.
2. The `data-scene-subject` wrapper is not a semantic SVG subject group; it's simply a div around all children. `SCENE_FRAMING_REGISTRY` reuses near-full-viewBox bounds across individual scenes; framing metadata approximates the canvas rather than tight educational object extents; generic `getSceneFraming` fallback silently invents `680x400` generic bounds.
3. `data-dominant-fill-ratio` is computed from authored `subjectBounds` dimensions and stage dimensions; it is not a DOM-measured projection of the ACTUAL scientific device. The asserted `0.79` is a **theoretical proxy** and **not proof the object fills 79%**. Browser tests check this attribute and lab/sheet/tools, but **not SVG geometry, labels, readout overlap within scaled content, or a multi-scene visual comparison grid**.
4. A03 target is **larger subject, not a bigger empty enclosing SVG**. Do not solve by blanket `scale(1.4)`; it may crop labels and readouts on other scenes.

**Required A02 fixes**:
- [ ] Apply camera transforms inside actual SVG scene viewBox or to a well-defined `<g data-scene-camera>` that wraps **physics drawing+necessary in-scene labels only**, NOT readout cards/caption/tools/UI. Alternatively use semantic SVG crop viewBox computed from A05 bounds. Keep A05 physics and graph axes intact.
- [ ] Measure content-slot safe area excluding headers, camera tools, dock and primary readouts and reserve non-overlap zones.
- [ ] Track real subject and essential label DOM/SVG projected bounds, not authored ratio alone, plus fit ratio (prefer 70-85% along fitting axis), scene-specific exceptions documented.
- [ ] At 390/320, render **no more than two primary readouts outside camera**, optional detail disclosure, and maintain legible font. Move/simplify lab top subtitle, info and camera tools so no overlap with labels, 44px targets and readable phase label.
- [ ] Verify zoom persists on VGS slider but resets at step/scene change; check object and label clipping in 320/390 and desktop.

**Required A05 and A08**:
- [ ] A05: supply accurate per-scene SVG subject groups/geometry, **tight stable world bounds** for all physics states and 10 CONCEPT scenes (PR #78), and scientific label sets; no fake equal physical scale.
- [ ] A08: make a true **cross-scene contact sheet of actual A02 app** (or embedded scene in same pixel-sized stage): MOSFET, circuit, PN, MOS14, SRAM, DRAM, NAND, GPU and CONCEPT pack at 1440/390/320; include sceneId, actual subjectFillRatio and screenshots; report too-small exceptions. Prior #71/#72 fixes preserved.

## P0 BLOCKER #70 — electricity CONCEPT still leaks later answer

Actual `browser-evidence/v3/concept_elec_step0_1440x900.png` displays in the main instructional copy: **“회로가 열려 있으면 전압은 존재하지만 전류는 0입니다”** and lower explanatory copy again specifies **5V persists** in an open circuit before the later prediction/switch experiment. That is the very result the learner should discover. Removing prior result text from the SVG did **not** close text/Voice/accessibility leakage. **A06/A07 must explicitly approve exactly what is taught in Step0**; then A02 remove/reorder outcome sentences from all learner-visible prose, TTS, aria labels, details, and hint. The structure diagram with open switch is legitimate if it does not assert the following problem's result.

## Scope of passed checks versus remaining evidence
| Check | A03 decision |
|---|---|
| CI, Chromium workflows on verified SHA | SUCCESS acknowledged |
| Actual CTA visible at 320/390 | Improved / screenshot verified |
| Step0 phase label no longer false completed | PASS for inspected samples |
| Concept answer leakage (electricity explanatory prose) | **FAIL** |
| Scene default apparent size at 390/320 | **FAIL** |
| Camera function exists / zoom reset control | Implemented; theoretical/functional QA acknowledged |
| SVG subject actually fits safe stage / readouts not scaled | **FAIL** |
| 10 families production contact sheet & science framing signoff | **OPEN** |
| Catalog content hierarchy | Improved; P1 card/header copy polish optional |
| Official V3 visual approval | **NO** |
| Release | **HOLD — owner approval required** |

## Evidence required for next re-review

Submit new Draft PR#73 exact FULL HEAD SHA, real 1440/390/320 screenshots of MOSFET/circuit + representative DRAM/SRAM/NAND/PN, all critical learning phases, genuine DOM/SVG subject/labels bounds and per-scene fill ratios, no clipped/overlapping tools/readouts, Step0 spoilers masked in text/voice/ARIA (A07 to A06), successful CI, plus all-scene contact sheet. A03 then performs explicit UI_DESIGN_PASS decision.

Related: [A03 canonical latest design](CURRENT.md), [Smart Scene Fit spec](A03-V3-scene-camera-scale-contract.md), [A02 P0 #70](https://github.com/Junebooky/interactive-engineering/issues/70), [camera P0 #80](https://github.com/Junebooky/interactive-engineering/issues/80), [team board #21](https://github.com/Junebooky/interactive-engineering/issues/21).
