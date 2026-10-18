# A03 visual review — A08 standalone Scene PR #71 / #72
**2026-10-18 KST · A03 design QA decision: FUNCTIONAL REMEDIATION ACKNOWLEDGED / V3 UI_DESIGN_PASS NOT GRANTED.**
This report **does not reject the correctness-oriented A08 changes**; it separates those narrow fixes from product-level UI design approval. No owner merge or deploy authorization.

## Evidence actually inspected

- [A08 → A03 handoff](https://github.com/Junebooky/interactive-engineering/issues/54#issuecomment-6249190325).
- **Lesson12 electricity PR #71** source HEAD `b308cce1c42040f22e54767ab9dd4e787c99eb8d`, [Chromium workflow 39120922155](https://github.com/Junebooky/interactive-engineering/actions/runs/39120922155), [28 real PNGs artifact 12134043316](https://github.com/Junebooky/interactive-engineering/actions/runs/39120922155/artifacts/12134043316). Independently **downloaded the ZIP** and inspected `a08-comparison/after-0V-closed-{1440x900,390x844,320x640}.png`, `after-5V-closed`, and original A05 Scene screenshots. File dimensions are **fullPage screenshots** (not visible viewport-height proof).
- **MOSFET M01 PR #72** source HEAD `080baec8aa88836cad49382005e077c4b90fb8c7`, [Chromium workflow 39121756443](https://github.com/Junebooky/interactive-engineering/actions/runs/39121756443), [real PNG artifact 12133828575](https://github.com/Junebooky/interactive-engineering/actions/runs/39121756443/artifacts/12133828575). Downloaded and inspected `a08-comparison/after-{1440,390,320}-predict.png`, `experiment-only.png`, `one-why-after-observation.png`, `feedback-complete.png`, baseline before screenshots.
- **Latest A03 reference:** MOSFET **V3 HTML/SVG** concept screenshots from A03 chat `lesson-desktop-1440.png` (1440×900), `lesson-mobile-390.png` (390×844), `lesson-mobile-320.png` (320×640), generated via A03 standalone design renderer; **not current A02 app**. V3 assets still **not uploaded to GitHub** at report time, so reproducible pixel-perfect CI comparison to this reference is blocked. [Current specification](CURRENT.md), [V3 acceptance contract](A03-V3-mobile-catalog-visual-coverage-contract.md).
- GitHub PR patches for #71/#72 read directly. No claim of running A08 source locally again; independent inspection means **actual GitHub-generated screenshots + code patches**, not independently executed second E2E.

## Visual comparison (verified screenshot facts)

| A03 V3 requirement | PR #71 / Lesson12 standalone | PR #72 / MOSFET standalone | A03 decision |
|---|---|---|---|
| Scientific visual correctly reflects input | A08 patch stops a switch click overwriting chosen `0 V`; zero-current SVG arrow suppression and ARIA wording are consistent in before/after source and screenshot evidence | A08 retains A05 gate/VGS science/evaluator and masks observation before prediction | **Narrow functional improvement acknowledged**; science signoff stays with A05/A07 |
| Only one active learning task | Predicted -> scene experiment dock -> explanation stage present in A05 preview; not official app | Prior 3-task simultaneity fixed: prediction -> physical dock -> ONE explanation after evidence; WHY gated for wrong answer | **Scene interaction UX improvement acknowledged** |
| Brand shell and focal hierarchy | Light standalone header + embedded navy framed scene, but large header/lesson copy plus four readout cells crowd the 390px layout | Dark standalone **full-screen lab page**, title/step nav/4 large readouts/dock/long explanation; very different from V3 white outer shell + one dark stage + light bottom sheet | **V3 visual parity OPEN / NOT ACCEPTED** |
| Viewport co-visibility at 390×844 | `after-5V-closed-390x844.png` is **390×1702** fullPage; 2.5D + physical controls + current question cannot all be visible simultaneously | `after-390-experiment-only.png` is **390×1323** fullPage; context/action copy below the first viewport | **Mobile one-viewport learning contract not met in these standalone previews**; A02 integrated layout must be retested separately |
| Viewport co-visibility at 320×640 | `after-5V-closed-320x640.png` **320×1903** fullPage | `after-320-experiment-only.png` **320×1477** fullPage | **Compact mobile V3 gap; no A02 product-level pass** |
| Desktop fixed layout at 1440×900 | `after-5V-closed-1440x900.png` has **1440×1369** fullPage | `after-1440-experiment-only.png` has **1440×1262** fullPage | Standalone page is not V3 product-shell layout; does not certify actual A02 desktop parity |
| Readout density and 2.5D priority | Readouts **4 tiles** (power, current, switch, arrow reference) plus separate voltage/switch/direction segmented controls after scene | Readouts **4 tiles** (VGS, VDS, inversion channel, model ID) plus dock and captions | V3 mobile wants **2 concise primary readouts** and secondary details behind disclosure. Visual density review **FAIL for parity** |
| Typography / contrast / accessible controls | Scene embedded SVG labels and fine captions become small at 320. Chrome test says 44px targets/no horizontal overflow. Pixel-level WCAG contrast not independently measured | Labels, note, physics caveats and long header use compact lettering at 320; 44px controls were CI-tested. Contrast/focus order/screenreader device test not independently measured | **Visual type hierarchy refinement needed**; do not invent contrast ratio or mark WCAG PASS |
| 2.5D model containment + overlay | Captions/metrics are mostly inside stage in standalone; V3 app bottom sheet integration **not tested** by A08 | Dock correctly anchored to model within standalone, **not integrated** with A02 V3 bottom sheet | **A08 scene fix acknowledged**, actual app clipping/readout–sheet intersection remains A02 P0 #70 |
| Scope | Source PR changes only A05 electricity Lab/Visual + QA workflow | Source PR changes only A05 MOSFET Scene Lab CSS + QA workflow | Scope is correct; **do not require A08 to rewrite A02 App/FSM/Catalog** |

### Why no UI_DESIGN_PASS
1. A08 photos show true scene-level behavior changes, yet not the A03 V3 composition. V3 at 390×844 is a **single visible experiment+learning-action screen**; A08 standalone previews require page scrolling and use a different overall design. These screenshots **cannot** serve as official A02 app screenshots.
2. V3 files are not yet mirrored to GitHub. This **asset synchronization gap** means an automated pixel-perfect V3 baseline is unavailable. A03 owns its closure; it is not A08's fault.
3. Scientific model/graded task and device accessibility belong to A05/A07 and app+device QA; **never claim done from isolated scene screenshots**.

## Concrete follow-up required

**A08 (scene UI, not app):**
- [ ] Keep PR#71 switch/0mA fix and PR#72 one-task/gated WHY fixes in scoped Draft PRs. No reversion because V3 shell differs.
- [ ] Provide an **embedded-friendly scene visual**: no duplicate per-scene global page header/step navigator when mounted inside A02 shell; keep compact 2.5D viewport + one experiment dock + at most two key measurements on mobile; additional metrics via accessible expand/details panel.
- [ ] Ensure physics labels and control dock fit the available 2.5D scene slot at **390×~350px** and **320×~255px**, with at least 44×44px targets; choose conservative bounds after actual A02 layout measurement. A08 should not silently hide needed scientific states just to match a visual.
- [ ] Add screenshot assertions: `svg/viewbox inside sceneSlot`, `dock and primary readout do not cover stage`, no text or controls cross `sceneSlot` boundaries, color tokens referenced from A03; provide visual-only before/after & exact tested SHA.

**A02 (actual product shell/FSM):**
- [ ] Fix mobile lab/sheet overlap; 100dvh sibling regions with no negative-margin overlay, top scene remains visible while bottom sheet content scrolls. Ensure the full state-dependent primary action and scientific observation are co-visible at 390 and 320 (if content exceeds sheet, CTA remains pinned).
- [ ] Integrate A05/A08 corrected scene components with existing typed learning engine and anti-spoiler; don't import standalone lab's duplicate header/question/state reducer as the official app.
- [ ] Fix V3 catalog and **all published steps visual coverage**, wrong-lesson MOSFET hardcode and duplicate CONCEPT DONE CTA (Issue #70).
- [ ] Submit official React browser screenshots on exact tested HEAD at 1440/390/320, `predict / experiment / explain / done`, plus viewport geometry assertion logs and CI results to A03.

**A05/A07:** validate 0V current/arrow science and MOSFET inversion model and label accuracy. A07 continues direct education report to A06.

**A03:** update GitHub with **exact original V3 PNG+HTML** and delete superseded active design files after synchronization, then carry out app screenshot overlay/visual scoring. Until then, mark **ASSET_SYNC_OPEN**.

## Gate / owners

- `A08_SCENE_FUNCTIONAL_FIX_REVIEWED`: YES (source diff and real screenshot verification)
- `A03_V3_VISUAL_PARITY`: **NOT ACCEPTED — FOLLOW-UP REQUIRED**
- `A02_OFFICIAL_APP_V3`: **UNVERIFIED / P0 OPEN** (#70)
- `A05_A07_SCIENCE_FINAL`: **SEPARATE SIGNOFF OPEN**
- `OWNER_MERGE_DEPLOY`: **HOLD**

Artifacts: [PR#71 screenshot ZIP](https://github.com/Junebooky/interactive-engineering/actions/runs/39120922155/artifacts/12134043316) · [PR#72 screenshot ZIP](https://github.com/Junebooky/interactive-engineering/actions/runs/39121756443/artifacts/12133828575).

Repo [A03 board #54](https://github.com/Junebooky/interactive-engineering/issues/54) · [A08 work #69](https://github.com/Junebooky/interactive-engineering/issues/69) · [A02 P0 #70](https://github.com/Junebooky/interactive-engineering/issues/70) · [team board #21](https://github.com/Junebooky/interactive-engineering/issues/21).
