# A05 → A02 / A03 / A07 · P0 #70 A03 V3 SCIENCE-SAFE structure scene contract
**2026-10-18 KST · Draft PR #78 (A05 branch stacked on A02 PR #73); exact checked source HEAD `39f7e61ab14a762d337faef944f28e83112128c5`.**
This document describes A05-owned *structure illustrations* and proposed A02 integration, not A03 UI_DESIGN_PASS, A07 independent SCIENCE_PASS, or main release approval.

## 1. Actual A02 published lesson / A05 structure coverage
A02 `src/content/courses.ts` has precisely 10 published lessons. A05 `getA05ConceptVisualId(lessonId)` deliberately maps all ten and **throws for a new unmapped published concept** instead of deceptively recycling a battery.

| Real A02 lesson ID | A05 science-owned CONCEPT art | Science-safe representation |
|---|---|---|
| `electricity-rc-foundations` | `circuit-intro` | power terminals, actual open contact and resistance; no 5V/0mA before experiment |
| `pn-doping-foundations` | `pn-intro` | P-side fixed negative ion and N-side positive ion, conceptual depleted junction |
| `mos-capacitor-foundations` | `mos-cap-intro` | electrode/insulating oxide/Si stacked cutaway, no arbitrary bias |
| `semiconductor-mosfet-fundamentals` | `mosfet-intro` | N+ source/drain, oxide gate and merely POSSIBLE field-dependent channel |
| `lesson-dram` | `dram-intro` | physical BL → 1T → capacitor, WL goes to **gate** not main data path |
| `lesson-sram` | `sram-intro` | two cross-connected NOTs (4T) plus access transistors (2T), no state bit |
| `nand-essd-storage-pipeline` | `nand-intro` | vertical channel with stacked WL/selection, no arbitrary `10-year` promise |
| `lesson-gpu` | `gpu-intro` | compute clusters → controller → example optional HBM stack, no performance number |
| `circuits-ohms-law` | `ohms-intro` | ammeter series and voltmeter parallel structure; existing published steps are all interactive and **continue using their A02 ohmsLaw 2D simulator**, not replaced |
| `mechanics-gears-transmission` | `gears-intro` | actual static stylized teeth, pitch contact, two shafts; A02 existing interactive gear simulator retained |

A02 PR #73 contains the general visualRegistry/CONCEPT scaffolding and all 38 distinct interactive `simulatorType` switch cases referenced by the 10 lesson files. A05 independently source-compared current PR#73 `LessonPlayer` 38 case labels against every published explicit `simulatorType`: no missing case at that tested base. This is *source routing*, not full-per-step actual independent Chromium.

## 2. Typed integration contract
Files:
- `src/a05/concepts/A05ConceptStructureVisual.tsx`: `A05ConceptStructureVisual({visualId:string,title?:string,subtitle?:string,caption?:string})`, `A05_CONCEPT_META`, `A05_CONCEPT_VISUAL_IDS`. All SVG are scoped structural cartoons with `role=img`, focusable keyboard, `title/desc/aria-label` and visible scientific assumptions. Arbitrary dynamic `title/subtitle/caption` **never go inside a PRE-level SVG** because copied A02 Step text might disclose a result.
- `src/a05/concepts/a05ConceptContract.ts`: `getA05ConceptVisualId`, typed 10 published lessons, strict unknown-id handling.
- `src/a05/concepts/a05Concepts.css`: V3 navy #102333/cyan/mint/amber, compact stage+visible caveat. 44px keyboard/button zoom; horizontal panning ONLY inside the SVG container (document scrollbar remains unchanged). Reduced motion and focus-visible.
- `a05-concepts-preview.html`: 10 selectable independent concepts, **not** a full product LessonPlayer.
- A05 Draft #78 contains a **one-line A02-proposed import** in `src/components/player/LessonPlayer.tsx` using `A05ConceptStructureVisual as ConceptIntroSceneVisual` and a proposed stricter `src/engine/visualRegistry.ts` lookup. A02 owns both files and must independently review/accept. Nothing was pushed to A02's own PR#73 branch.

A02 contract:
- `CONCEPT` or other published noninteractive steps → A05 static domain diagram, never physics simulator, no science readout or grade evidence.
- `simulatorType` science experiment steps → current React A05/A02 interactive rendering by existing source type; do not replace with static diagram.
- Official LessonPlayer remains the owner of predict/observe/check/done, Voice execution, progress, episode persistence, PromptCard, camera toolbar and responsive lab vs sheet geometry. Do not duplicate those in A05 concept SVG.
- Unknown newly published lesson MUST be blocked in CI until its real domain schematic and senior science copy are added. `A05_CONCEPT_UNMAPPED_LESSON` exception in the **proposed branch** is intentionally fail-closed and must be handled by A02 before future publication.

## 3. Actual QA and preview limits
- [x] `CI #39126869760` SUCCEEDED: lint + 21 Vitest files / 150 tests + TypeScript/Vite production build, exact HEAD above.
- [x] `A05 real Chromium #39126865669` SUCCEEDED: 41 PASS / 0 FAIL = 10 different static scene structures × three viewports (1440×900 / 390×844 / 320×640), three keyboard zoom/pan checks, eight actual **A02 product CONCEPT step0** route screenshots. `41 PNG` original screenshots under `browser-evidence/a05-concepts-p0/` GitHub Actions artifact.
- [x] `A02 existing V3 Chrome #39126869747` SUCCEEDED at exact HEAD (10-course catalog filter/escape, 390/320 lab vs sheet geometric zero overlap, 44px, CONCEPT single CTA, no cross-lesson MOSFET copy, official MOSFET 1440/390/320 predict→check→done, independent A08 staged M01 existing regression). `22 PNG` official V3 app artifact. A05 did not assert pixel-perfect parity with unavailable V3 prototype PNG.
- [x] All 10 unique published lesson IDs resolve to 10 distinct diagrams, and every **currently published CONCEPT** step has a reviewed diagram ID in 13 new A05 vitest tests. Original `visualCoverage.test.ts` still passes. App simulation formulas unchanged.
- [ ] A07→A06 independently review physics of all ten cartoon *structures*; only their explicit reviewed exact SHA merits `EDU_SCENE_SOURCE_PASS`. Browser automated checks are not audible real ko-KR Voice or screenreader/physical hardware.
- [ ] A03 independently compare actual artifacts at 1440/390/320 to **V3** current design sources and issue UI_DESIGN_PASS/FAIL; V3 reference PNG/HTML are not in GitHub per A03 CURRENT. A08 handles separate longstanding interactive-styles/scene visual audits.
- [ ] A02 independent app QA/SCIENCE/P0 history provenance on their own merged **new HEAD**, not A05 stacked PR #78. A05 one-line LessonPlayer change may be accepted/rebased by A02 but is NOT deployed.
- [ ] Owner actual devices/Voice/novices/WCAG and main merge/public deploy RELEASE_HOLD.

## 4. Existing A08 scene improvements (already independently ported to A05 branches)
- [x] A08 [#71](https://github.com/Junebooky/interactive-engineering/pull/71) source0V cannot jump to 5V on switch, 0mA has no motion arrows; A05 [original PR #18](https://github.com/Junebooky/interactive-engineering/pull/18) latest exact `74a6d2e4281cf6b78570889218f7efec399b3d00`; [actual Chrome9 PASS](https://github.com/Junebooky/interactive-engineering/actions/runs/39124466330) / [21 PNG](https://github.com/Junebooky/interactive-engineering/actions/runs/39124466330/artifacts/12135104901).
- [x] A08 [#72](https://github.com/Junebooky/interactive-engineering/pull/72) one-question predict→scene-dock→WHY and no full teacher WHY on wrong; A05 [original PR#8](https://github.com/Junebooky/interactive-engineering/pull/8) latest exact `71b9e3c0504ebf9453066743962a69b8b5e478bd`, plus A05 explicit low voltage observation rather than fake default `visited:[0]`; [actual Chrome12 PASS](https://github.com/Junebooky/interactive-engineering/actions/runs/39124568548) / [14 PNG](https://github.com/Junebooky/interactive-engineering/actions/runs/39124568548/artifacts/12135377870).
- These A08 Draft branches were **never merged into main or A02 branch**. A05 manually ported their fixes; please do not duplicate-merge or misattribute old SHAs.

## 5. Remaining V3 visual consistency backlog (NOT marked done)
The original interactive layers from A05 `src/a05/dram`, `sram`, `gpu`, `pn`, `mos14`, `nand04`, `ssd`, `dc10` and their own distinct 2.5D color schemes require A03 V3 **actual pixel contrast/readout/compact dock** audit by A08/A05; this concept P0 pack does NOT automatically restyle those physics scenes. A02 product stage uses shared V3 shell but this is not proof of science layer visual parity. Keep issue #70 broad P0 state **OPEN** until the remaining interactive-scene audits, A02 APP_QA and A03 UI_DESIGN_PASS.
