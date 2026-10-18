# A03 — Draft PR #73 V3 design QA / CHANGES REQUESTED
**2026-10-18 KST.** Reviewed official A02 V3 React browser evidence, GitHub source and handoff comments. This is a **design/learning-flow review**, not independent execution of CI and not A05/A07 scientific certification.

## Evidence inspected
- [A02 PR #73](https://github.com/Junebooky/interactive-engineering/pull/73) exact currently inspected HEAD `759deacba661edf76dfe3fabd588c478740c2301`. The handoff comment referenced **older SHA** `759deac4e930f40f0c0ae16cb0e07198a28fe72f`; update the test-evidence mapping to the actual latest commit.
- [A02 handoff #70](https://github.com/Junebooky/interactive-engineering/issues/70#issuecomment-6249793330) and [team #21](https://github.com/Junebooky/interactive-engineering/issues/21#issuecomment-6249798939), referenced GitHub Actions successful runs #39126340730 and #39126340809. Successful builds are acknowledged but do not by themselves constitute visual approval.
- Retrieved and visually inspected **actual PNG files committed in A02 branch**, not synthetic mockups:
  `browser-evidence/v3/catalog_1440x900_all.png`, `catalog_390x844.png`, `mosfet_app_390x844_predict.png`, `mosfet_app_390x844_observe.png`, `mosfet_app_320x640_predict.png`, `mosfet_app_320x640_observe.png`, `concept_mosfet_step0_1440x900.png`, `concept_elec_step0_1440x900.png`.
- Read code from `LessonPlayer.tsx` lines 410–560, `lessonA03.css` 755–955, `visualRegistry.ts` 1–146, `ConceptIntroSceneVisual.tsx`, `test-v3-catalog-and-lab.mjs` 156–240 and 335–415 at named PR branch. A03 V3 independent-design reference is **not** the official A02 app; both sources are now being synchronized under [CURRENT](CURRENT.md).

## Accepted direction (NOT overall signoff)
- **Catalog overhaul real**: former dark giant 3-card columns replaced by offwhite discovery grid, topical filters and unique domain diagrams. 1440 has four readable columns; 390 shows two compact cards. Product direction is an improvement.
- **Outer geometric split passes limited check**: Playwright verifies lab.bottom == sheet.top at 390 and 320; no negative-margin overlap, and button target min-size tests passed on the asserted selectors.
- **Concept visual infrastructure exists**: `ConceptIntroSceneVisual` and `visualRegistry` render a drawing instead of `null`, plus cross-lesson labels are more specific.
- **App browser captures exist** in PR #73; these differ materially from the earlier A08 standalone previews. Good evidence practice.

## Blocking problems (P0)
**B1 — Concept intro contains result/answer spoiler and false completion status**:
- Actual `concept_mosfet_step0_1440x900.png` depicts already-formed conduction region text `VGS ≥ Vth 일 때 전도 채널 형성` and shows `04 · 핵심 발견 완료` in the lab **on Step 0**, before the student's later MOSFET prediction. `visualRegistry.ts` sets `spoilerSafe:true` unconditionally without enforced hiding in `ConceptIntroSceneVisual`.
- Actual `concept_elec_step0_1440x900.png` shows `04 · 핵심 발견 완료`, model banner with `스위치가 열려 전류가 0mA이지만 전원 5V는 유지돼요`, and SVG panel `... 전류는 0 A`; this is the subsequent switch question's answer before prediction. In the same screenshot a prominent `핵심 발견` panel appears ahead of experiment.
- `LessonPlayer.tsx` `sceneLabel` ternary maps any `activePhase` other than predict/observe/check to `04 · 핵심 발견 완료` (including CONCEPT); `sceneSignal` checks `activePhase !== 'predict'`, insufficient for concept-first masking. **Fix with explicit CONCEPT/INTRO phase and authorized observation gating** across visible text, SVG, ARIA, tooltips, Voice and model accordion. A06/A07 must verify lesson-copy order; scientific structures may appear without supplying the next question's exact answer.

**B2 — Mobile actual content collision / first-action visibility**:
- Actual A02 `mosfet_app_320x640_predict.png` shows question/radio options but **no primary CTA inside the initial viewport**. A03 V3 requires an always-accessible bottom-sheet primary action; test it without auto-scrolling, particularly 320×640, keyboard and safe area.
- Actual `mosfet_app_320x640_observe.png` shows the camera tools overlaying the 2×2 measurement grid, with text visibly behind tool buttons and too much readout density. `lessonA03.css` still positions `.a03-lab-bottom` absolutely and lab at 44dvh with four metrics. Outer lab/sheet boundary non-overlap alone **does not test internal floating overlays**.
- `mosfet_app_390x844_observe.png` begins inside the lab with the top header absent: automated screenshots follow clicks with Playwright auto-scroll. Require **top-of-viewport capture + scroll position assertions** before approving simultaneous experiment/action visibility.
- **Fix design**: mobile lab 1 clean view with at most 2 main readouts; other values behind accessible `details`; move camera toolbar to upper-right *inside safe bounds* without covering labels/readouts; separate internal flex rows; bottom-sheet action pinned within viewport; 44×44px controls. Test **all descendants**, not just lab vs sheet.

**B3 — Semantic coverage not proven by type-safe visual registry**:
- `visualRegistry.ts` returns a `circuit-intro` visual as catch-all for every unknown lesson/step, and `ConceptIntroSceneVisual` has domain-specific SVGs. `resolveStepVisual(...) !== null` gives **100% non-null coverage**, not **100% correct, science-reviewed concepts**. Eliminate production catch-all or fail tests on unknown IDs. Maintain an explicit audited mapping per published step; review A05/A06/A07 visual science and pre-prediction semantics. `spoilerSafe` currently advisory only.

## Nonblocking polish / evidence gaps (P1)
- At 390px catalog title wraps its last character onto an isolated third line next to close action; reduce title/close horizontal competition, move close control to independent top row or shrink only title appropriately.
- At mobile 2-column catalog, card image, tagline and descriptions are small; maintain readable 12–14px body with consistent card height and more concise synopsis.
- Publish 320px catalog capture and `DONE` app screenshots at 1440/390/320; verify focus trap/restore and actual Voice text.
- Review the special CONCEPT Step0 panel layout: overly long answer copy is duplicated in a giant bold block and within nested `핵심 발견` card; A03 V3 aims at one current action and short contextual teaching. Consolidate editorial copy with A06.

## Required A02 retest before A03 signoff
- [ ] Step0 intro: no misleading `04 완료`, no subsequent exercise result in text/SVG/ARIA/TTS (A06/A07 audit).
- [ ] 320×640 & 390×844: from **scrollY=0** show scene and primary CTA together; no camera/readout/scene-label overlap. Assert boxes of **all child control and label nodes**, not only sibling `.a03-lab` & `.a03-sheet`.
- [ ] ConceptRegistry: exact per-step explicit visual mapping; zero unknown fallback, science audited; no false measurements.
- [ ] Actual app screenshots at 1440/390/320 predict/observe/check/done + catalog 390/320; matching exact tested HEAD CI + visual diff to A03 V3.
- [ ] A03 design **UI_DESIGN_PASS** only after fixes and visual re-review. A05/A07 science approval separate; owner no main merge/deploy.

## Decision / ownership
`A02_P0_GEOMETRIC_NON_OVERLAP: ACKNOWLEDGED`; `A02_CATALOG_STRUCTURE: IMPROVED`; `A03_V3_UI_DESIGN_PASS: **NO — CHANGES_REQUESTED**`; `A02_APP_FINAL_SCIENCE_QA: OPEN`; `OWNER_MERGE_RELEASE: HOLD`.
A02 fixes layout, phase and registry; A05 reviews visuals; A06/A07 teaching/science; A03 re-reviews **actual A02 app**. Team board [#21](https://github.com/Junebooky/interactive-engineering/issues/21), P0 [#70](https://github.com/Junebooky/interactive-engineering/issues/70).
