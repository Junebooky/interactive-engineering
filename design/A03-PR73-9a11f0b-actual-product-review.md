# A03 Review of A02 PR #73 — actual Chromium / 9a11f0b9a

**2026-10-19 KST. CHANGES REQUIRED. UI_DESIGN_PASS=NO. DRAFT/HOLD. Owner must explicitly approve any main merge/deployment.** A03 inspected committed actual-app images, code and real CI/Chromium run records, but has not independently run the browser, iOS Safari, Korean speech, or a hardware screen reader.

## Verified evidence and accepted changes

- [PR #73](https://github.com/Junebooky/interactive-engineering/pull/73) exact HEAD 9a11f0b9af4f2c6481c2a3f09a4e285b6da91bfb is DRAFT, unmerged. [A02 handoff](https://github.com/Junebooky/interactive-engineering/pull/73#issuecomment-6251800767), [CI #39141327025](https://github.com/Junebooky/interactive-engineering/actions/runs/39141327025) SUCCESS and [Browser QA #39141327036](https://github.com/Junebooky/interactive-engineering/actions/runs/39141327036) SUCCESS. A02 reported 162 Vitest tests.
- Code from A05 [34 interactive scene subject/world bounds PR #83](https://github.com/Junebooky/interactive-engineering/pull/83) and [10 CONCEPT structures PR #78](https://github.com/Junebooky/interactive-engineering/pull/78) is now included on A02 FEATURE branch. Those separate draft PRs and main were NOT merged/approved. This closes the earlier missing-bridge source code assignment, but not visual design acceptance.
- A02 SceneViewport now queries native SVG g[data-scene-subject] for a measured ratio; getSceneFraming imports A05 calibrated world metadata. MOSFET 390/320 has larger artwork and two principal readouts outside camera; primary CTA visible. Electricity Step0 neutral copy is present.
- A07 R35 request for explicit-action Lesson12 readouts was partly fixed: after prediction, before a switch click, readout now says “관찰 전”, and buttons are not preselected. Preserve these improvements.

## P0 visual FAIL 1 — CONCEPT screen layout is broken in REAL product

Current app screenshots:
- [Electricity concept 1440](https://github.com/Junebooky/interactive-engineering/blob/9a11f0b9af4f2c6481c2a3f09a4e285b6da91bfb/browser-evidence/v3/concept_elec_step0_1440x900.png)
- [SRAM concept 1440](https://github.com/Junebooky/interactive-engineering/blob/9a11f0b9af4f2c6481c2a3f09a4e285b6da91bfb/browser-evidence/v3/concept_sram_step0_1440x900.png)

The scientific diagram is tiny in a large dark stage; standalone “구조 모형 · 측정값 없음” wraps as vertical broken Korean text; separate “구조 확대” and A02 +/-/reset are DUPLICATE camera controls; standalone caption and explanatory labels compete with the tiny object. Right-panel beginner CONCEPT text is a dense textbook paragraph rather than one short question/action. This does not match the A03 scene-as-hero design or [V4 microlearning #79](https://github.com/Junebooky/interactive-engineering/issues/79).

Source diagnosis: LessonPlayer mounts the *entire* A05ConceptStructureVisual figure inside SceneViewport. The A05 standalone figure has its own HTML toolbar, zoom button, scroll mode, SVG and caption. SceneViewport outer fixed-size HTML div then scales every child. Competing player .a03-concept-visual CSS uses width/height 100% flex and SVG 780/420 aspect, while A05 native SVG is 640/360.

**NEXT A02 with A05**: Introduce embedded diagram-only mode (an explicit embedded prop or equivalent), retaining the scientifically accurate A05 SVG but lifting toolbar/caption/controls out of camera. Exactly ONE official lab camera toolbar; no standalone zoom in embedded mode. Native 640/360 aspect and essential labels must stay visible without cutoffs. A06/A07 approve short concept text and any science-safe hotspot. A08 captures actual 1440/390/320 embedded concept screens.

## P0 visual FAIL 2 — scene physical objects still look too small across problems

A08 [independent official integrated-app semantic audit PR #85](https://github.com/Junebooky/interactive-engineering/pull/85), [54 actual Chromium frames #39141221304](https://github.com/Junebooky/interactive-engineering/actions/runs/39141221304), [PNG/JSON artifact](https://github.com/Junebooky/interactive-engineering/actions/runs/39141221304/artifacts/12141304194) measured actual native g with getBBox/getScreenCTM on A02 product at ed99df7. Git compare confirms CURRENT SHA 9a11f0b is only one commit later, changing LessonPlayer.tsx and A03SingleTaskPanel.tsx: NO camera, SVG, CSS changes, so the same measurement findings apply to this HEAD.

A08 true science-subject min-axis safe-slot ratios (390px / 320px respectively): MOSFET 46.3/52.4%; Circuit 25.1/28.3%; PN 22.5/26.4%; MOS14 15.9/18.1%; DRAM 27.9/32.9%; SRAM 27.2/30.9%; NAND 9.8/11.1%; GPU 28.5/33.4%. This min-axis fraction is **aspect-sensitive and a review alert, NOT a scientific equivalence or blanket threshold**. Still, huge variance plus tiny actual screenshots, <9px physics labels, 320 toolbar/header collisions in PN/DRAM/SRAM/NAND/GPU mean product visual acceptance cannot pass.

Camera source still applies CSS translate+scale on the enclosing HTML scene div based on stableBounds; querying inner native SVG g for the measured-ratio display does NOT automatically target/pan SVG artwork. Tests still use the boundingBox width of the entire SVG for MOSFET instead of measuring the science group and essential labels for ALL scene families.

**A02 NEXT**: Compute camera from actual SVG world subject+necessary science labels in safe drawable stage and pan/zoom the SVG content itself (or equivalent true semantic inner camera). Stable camera over parameter changes, reset on new scene; no forced global zoom that cuts wires, terminals or labels. Reconcile simulator alias IDs with native sceneId. Move ALL HTML readouts OUTSIDE the camera; code at this HEAD still mounts readouts within Dram/Sram/Nand/Mos14/PN/GPU renderers. On 320, no more than 2 main metrics; accessible optional details and zero toolbar/label overlap. **A08** rerun equal-stage actual product comparisons after A02 fixes; **A05/A07** check geometry scientific truth.

## P0 independent education and result-gating blockers remain

Current HEAD source, not just prior A07 report:
1. A03SingleTaskPanel CHECK phase uses step.voice.explanation before submitCheck. This prematurely speaks the teacher WHY answer. Neutral CHECK voice until earned grade; A02 test spy for right/wrong/not checked, A07 independently signs off.
2. MOSFET lesson still initialParams.visited=[0], with previous A07 R35 reducer fallback issue unchanged by latest commit. Never mint LOW observation before user manipulates; reset and restore/high-only negative tests.
3. Electricity LessonPlayer sceneSignal checks (!concept && !predict), then treats closed=undefined as false and displays “스위치가 열려 전류가 0mA이지만 전원 5V는 유지돼요” during OBSERVE before any switch click. Thus new neutral “관찰 전” readout is contradicted by answer-revealing lab banner. Gate ALL UI/ARIA/Voice/SVG results on actual deliberate physical action, not phase alone; test no-switch-after-prediction.
4. MOSFET CONCEPT pre-predict copy/visual metadata remains semantically revealing about channel action, per A07 R35. A06/A07 own educational rewriting; A02 gates phase exposure.
5. CHECK expands all hints L1-L3 at once via step.hints.map; progressive hints must be sequential by explicit request.

A07 SOURCE pass on A05 SRAM BL/BLbar correction and A06 lesson copy is acknowledged, but latest A02 exact SHA needs independent new education/source and runtime Voice/ARIA negative signoff.

## Approval checklist and ownership

- **A02**: integrated SVG-only embedded concepts, one camera toolbar, camera on science group and labels, all HTML metrics outside scale, no 320 collisions, educational phase/voice/history gate, real 1440/390/320 per-family E2E PNG and full SHA/CI.
- **A05**: science-correct native group geometry, responsive embedded mode and labels, direct handoff to A02; never change physics purely for visual fill.
- **A08**: exact updated A02 code same-stage contact sheets, getBBox/getScreenCTM, label 9px+ usability, documented high aspect scene exceptions and actual overlap/clip tests.
- **A06/A07**: neutral one question and no pre-earned answers on text, model bubble, subtitle, caption, Voice, ARIA, result, hints; science source approval at exact SHA.
- **A01**: owner dashboard status and cross-agent priority; main/deploy remains owner-only.
- **A03**: actual finished app visual review. Separate V4 [home-first/scene-first #79](https://github.com/Junebooky/interactive-engineering/issues/79) still not yet delivered by this V3 PR.

**State**: A02_A05_SOURCE_INTEGRATED=YES; CI_CHROMIUM=PASS; CONCEPT_EMBEDDED_VISUAL=FAIL; CROSS_SCENE_CAMERA_SCALE=FAIL_REVIEW; A07_FULL_NEW_SHA_SOURCE_PASS=OPEN; A03_UI_DESIGN_PASS=NO; OWNER_MAIN_DEPLOY=HOLD.
