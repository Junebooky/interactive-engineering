# A05 → A02 / A08 / A03: P0 #80 scientific SVG subject-world bounds

**Issue #80 / A03 exact [#4 comment](https://github.com/Junebooky/interactive-engineering/issues/4#issuecomment-6250654738) / A03 [re-review source](https://github.com/Junebooky/interactive-engineering/blob/design/a03-mosfet-discovery-v1/design/A03-PR73-6694e47-camera-visual-re-review.md).** This document is an A05 engineering/science handoff on A02 PR#73 base `6694e47be8165db71e59a8a4c8c556292a572562`, NOT A02 app-camera approval, UI_DESIGN_PASS, A07 independent QA or release approval.

## Why the old camera remains too small
A02 shared `src/components/player/SceneViewport.tsx` currently wraps **all** of `renderSimulator()` in a div of hardcoded stableBounds pixel width/height and CSS `scale(fitScale * userZoom)`. That wrapper also contains `.a05-readouts`, so real device occupies only a thumbnail fraction at 390/320. Its `data-scene-subject` is a DIV proxy, not physics SVG `g`; `data-dominant-fill-ratio` is a math estimate, not real actual device geometry. The old `src/engine/sceneFraming.ts` uses near-full-world guesses, ignores A05 actual physics + label cropping. Avoid globally scaling the entire wrapper or claiming old A02 Chrome regression assures subject zoom visual pass.

## New A05 implementation (physics unchanged)
- `src/a05/geometry/a05InteractiveBounds.ts` exports `A05InteractiveFraming`, `A05_INTERACTIVE_WORLD_BOUNDS`, `getA05InteractiveWorldBounds(sceneId)`. There are exactly 34 A05-owned *public simulatorType IDs* for MOSFET, electricity, PN, MOS14, DRAM, SRAM, GPU, NAND/SSD. Each record: `sceneId`, `familyId`, `defaultViewBox`, `subjectBounds`, `essentialLabelBounds`, `stableBounds`, `policy`. Dimensions use native SVG user units; live-state changes DO NOT change frame. Never use as relative physical dimensions between semiconductor, board, gear, circuit diagrams.
- `src/a05/A05SceneVisual.tsx`, `electricity/ElectricitySceneVisual.tsx`, `pn/PnSceneVisual.tsx`, `mos14/Mos14SceneVisual.tsx`, `dram/DramSceneVisual.tsx`, `sram/SramSceneVisual.tsx`, `nand04/Nand04SceneVisual.tsx`, `gpu/GpuSceneVisual.tsx`: nested **`<g data-scene-subject="…" data-scene-id={sceneId}>` inside actual SVG**. Decorative wafer plate and HTML science readout cards are NOT the physics subject group; SVG equations, node names, axes, labels and essential physical wires remain included. MOSFET curves in separate secondary mini-plot remain out of main group.
- `a05-world-bounds-preview.html`: standalone selected-scene gallery with 34 IDs and physics state A/B. This **does not** replace A02 officially integrated lesson/phase/Voice/history. Real Playwright `scripts/a05-scene-world-bounds-browser.mjs` measures actual group `getBBox` and SVG viewBox, compares to stable union across TWO state variants, checks page overflow, screenshot evidence at 1440/390/320.
- Bounds were calibrated against full actual Chromium `getBBox()` logs; e.g. MOSFET x89..545 y58..314, full gate+substrate in **630×370** native world vs decorative full `0..630`, capacitor MOS14 second state includes x56..624 instead of cropping its important bias explanation. NAND/SSD label-bearing scene requires a different native `680×400` world. Label text often increases bounding range on state B; fixed union prevents camera jumping.
- Non-A05-owned A02 `ohmsLaw` and `gears` SVG/2D scenes **not** modified here. Future published scenes with unknown mapping require a new A05 reviewed entry, not `680×400` silent magic fallback.
- Separate [A05 CONCEPT Draft PR#78](https://github.com/Junebooky/interactive-engineering/pull/78) contains **ten standalone concept subject groups** `data-scene-subject` plus typed `src/a05/concepts/a05ConceptBounds.ts`, authored `640×360` world geometry calibrated by its own Chromium getBBox, not inherited from unrelated interactive viewBox. Also now fixes an A07-identified SRAM 6T illustration blocker: physically connected BL / BL̅ to access transistor outside ports with WL separate; unit assertion and mobile screenshots.
- Original pure physical `*Model.ts`, `scenePhysics.ts`, A08 zero-V/wrong-WHY causality, observation gating all remain unchanged. This is geometry/mapping only.

## Hand-off code sketch to A02 (app owner must adapt carefully)
```ts
import {getA05InteractiveWorldBounds} from '../../a05/geometry/a05InteractiveBounds';
const authored = getA05InteractiveWorldBounds(currentStep.simulatorType);
if (!authored) { /* handle non-A05 simulator explicitly, NEVER pretend a default scene is science reviewed */ }
// SVG camera = inner group g[data-scene-subject][data-scene-id], not surrounding React HTML.
// safe stage pixels must exclude heading, 44px toolbar, two primary readouts and dock.
// Fit authored essentialLabelBounds & subjectBounds into that safe slot; physical labels stay visible.
// userZoom multiplies fitted viewBox scale; reset per step/visualId, preserve within parameter change.
// Test DOM/SVG actual projected bounds with element.getScreenCTM()/getBBox(), NOT only authored ratio.
```

## Gates and owners
- [x] A05 authored **34 science simulator geometries**, one stable per-scene frame, semantic group and state A/B preview. [ ] Exact final SHA CI + 34×2×3 Chromium PASS/screens to be filled by recorded run.
- [x] [A05 PR#78 10 CONCEPT geometries](https://github.com/Junebooky/interactive-engineering/pull/78) separate with no quiz spoilers; [ ] A07 R32 SRAM independent recheck on new SHA pending.
- [ ] **NEXT:A02** apply camera only to native nested SVG group or viewBox, keep readout cards/tools/CTA outside; remove div-proxy auto-fit; use actual measured stage with 8–12% margin; preserve label accessibility and 44px tool sizes, hard refresh reset on step/visualId only. Actual OWN PR#73 head Chromium 1440/390/320 screenshot/metrics + P0 lesson12 CONCEPT answer-prose/ARIA/Voice leakage separately.
- [ ] **NEXT:A08** independent same-size stage cross-scene contact sheet + `getScreenCTM()` projected subject/essential label clipping at 390/320, not author metadata ratio only.
- [ ] **NEXT:A03** true side-by-side new A02 actual screenshots vs CURRENT V3/V4, approve `CAMERA_SCALE_PASS` ONLY after object and labels readable 390/320. 
- [ ] **NEXT:A07→A06** independent SVG geometric science/labels and corrected SRAM BL terminations; no grade/physics conclusions from camera source.
- [ ] Owner main merge/deployment, live Speech/Voice, iOS Safari/screen readers, learners: **HOLD**.

This is an isolated Draft branch. Nobody should merge it directly into main without the owner's approval.
