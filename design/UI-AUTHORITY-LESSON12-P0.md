# A03 UI/UX DESIGN AUTHORITY & LESSON12-S01 CRITICAL CORRECTION

**Issued 2026-10-18 KST** · Responsible visual director: **A03** · Applies across all Interactive Engineering lessons. This is the design owner’s **implementation and QA contract**, not proof that A02/A05 has implemented it. **No main merge, release or deployment without owner approval.**

## 0. Governance — Who decides what

- **A03 owns ALL UX and visual presentation:** product information architecture, learning-step layout, single-primary-action flows, simulator/control placement, design tokens, educational UI copy placement (wording is A06), accessibility UX, responsive behavior, design review, pixel/interaction parity gate. All A02/A05 product UI contributions must conform to the **latest A03-design-approved canonical reference**.
- **A02 owns APP implementation:** React/TypeScript, lesson reducer/action semantics, voice integration, progress/restore/router, state synchronization, app E2E/CI/browser captures. A02 **must not introduce alternate page layout, duplicate primary CTA, or incompatible control positioning** without A03 review; do not delete functional science validators for appearance.
- **A05 owns scene physics and scene component implementation:** math, physical state, scientific geometry/labels, dynamic 2.5D scene code. A05 **must use A03 visual tokens, camera/control/legend standards and responsive constraints** for outward-facing scene presentation, except where A07-documented physics/accessibility constraints require deviation. Such exceptions require an A03/A05 discussion and documented decision.
- **A06/A07:** content/scientific correctness and pre-prediction leakage; content choices validated through existing channel A07→A06.
- **A01/Owner:** product decisions, design direction conflict resolution and final merge/release. A03 is the **single design-review gate**, not an override of scientific accuracy or owner authority.

**Current canonical**: [CURRENT.md](CURRENT.md), [MOSFET V2 reference image gallery](GALLERY-mosfet-v2.md), [MOSFET V2 executable reference](prototypes/a03-mosfet-discovery-v2.html). This MOSFET reference demonstrates overall UI hierarchy and palette, **not a universal physical diagram to copy into an electricity circuit**. On design revision, replace old assets and CURRENT pointer in the same A03 work turn; superseded design files removed from A03 branch, Git history retained.

## 1. Live page problem record — 2026-10-18

Browser read-only context of localhost:5173, selected Lesson **12 전하·전압·저항·RC·전력** displays:
- Lesson-title `12. 전기가 움직이고 기억하는 가장 작은 실험 — V/I/R/RC/Power`
- Scene/hero heading `전압이 만드는 실리콘의 변화` and unrelated `드레인 전압 차는 0V로 고정` (MOSFET-specific text) despite the **5V / 1kΩ simple circuit** showing `SWITCH CLOSED` and `5.00 mA`.
- Problem panel includes `회로 스위치 (Switch State)` with clickable `닫힘 (CLOSED - 도통 5mA)`, plus problem text incorrectly requesting `0V` and `>=0.8V` visits (MOSFET VGS behavior), plus intro copy instructing voltage manipulation.
- This is a **live rendered text inspection**, not a saved/verified pixel screenshot. Exact local running git SHA was not obtained from browser read-only surface. Independently, the source of the earlier A02 Lesson12 PR #39 at HEAD `d7900323` has `electricityLesson.ts` controls for `closed` at Step1 and `direction`, `answer`, `prediction` all in one controls array; `LessonPlayer.tsx` renders `PromptCard` and `ElectricitySceneVisual` in two columns. In that source, 2.5D uses `#7be8cb` mint, `#83cef4` cyan, `#ffdb97` gold and CSS backdrop radial `#20576b → #102b3e → #071725`, different from A03 reference `#102333`. **Do not assume the live app is exactly PR39 SHA.**
- Scientific contract of Lesson12-S01: 5 V ideal source, 1 kΩ resistor; switch OPEN → I=0 while source terminal voltage remains 5 V; CLOSED → I=5 mA under ideal assumptions. MOSFET VGS/VDS, inversion channel and 0.8 V thresholds do NOT belong in this lesson.

## 2. P0-UX-01: Separate problem from physical manipulation

**Question / Problem panel** contains ONLY one learner decision at a time:
1. PREDICT (ask what happens when circuit is OPEN; one prediction question + one primary submit button)
2. EXPERIMENT (after prediction submission; scene is revealed and direct switch control becomes available in/adjacent to scene)
3. OBSERVE (OPEN and CLOSED visited, results visible in lab, never spoil before)
4. EXPLAIN (one question about 5 V vs 0/5mA).
5. FEEDBACK (specific misconception correction or confirmation)
6. NEXT.

**The physical `회로 스위치` does not belong inside the Problem question-answer choices.** Place it in a **scene-anchored Experiment Control Dock** next to/below the circuit visualization: `회로 스위치 — 열림/닫힘`. If 2.5D scene is narrower, use an associated non-overlay dock immediately under the scene. Controls are semantic input buttons or a segmented/toggle with 44×44px tap targets and explicit text state; icon alone not sufficient.

- **Desktop**: Left/dominant Lab Canvas: circuit + Experiment Control Dock + compact readouts. Right learning panel: *one current question or explanation* only, with compact tutor, next/feedback action. Never simultaneous prediction radio + voltage/switch controls + concept quiz.
- **Mobile**: stage remains visible at top; sheet below changes content by phase. During PREDICT show one question. During EXPERIMENT sheet becomes **'실험 조작'**, with switch + optional arrow toggle inside sheet **only if** stage-anchored control would obstruct mobile 2.5D; it must no longer be headed/semantically grouped as Problem. Keep one CTA per state and bottom-sheet internal scrolling. Desktop/in-scene control ownership and mobile stage-linked sheet interaction must be equivalent.
- `direction (관습전류/전자 이동)` is optional observation perspective selector and **not a second problem**. Keep it hidden/accordion until after main switch action, or group as an unobtrusive view-mode toolbar, not independent simultaneous assessment.
- `answer` only appears after real OPEN and CLOSED transitions have been visited in A02 authoritative history/epoch, never simply by initial default state or toggling labels. Reset invalidates prior evidence. No answer/measurement/Voice spoilers before prediction.

**Proposed exact user-facing microcopy:**
- Scene heading: `스위치를 열면 전류가 어떻게 될까요?`
- PREDICT question: `5V 배터리의 스위치를 열면 전류와 전압은 어떻게 될까요?`
- EXPERIMENT: `스위치를 열고 닫으며 전류계가 어떻게 달라지는지 살펴보세요.`
- OBSERVE: `회로가 열리면 전류가 멈춰요. 하지만 배터리의 5V는 그대로 남아 있어요.`
- CTA sequence: `예측 제출` → `스위치 조작해 보기` → `관찰 마치고 설명하기` → `설명 확인` → `다음 실험으로`. A06/A07 verify actual pedagogical copy before product signoff.
- Remove control label `닫힘 (CLOSED - 도통 5mA)` until observation; use simply `닫힘` vs `열림`. English can be small tooltip, not mixed in primary Korean UI. Keep scientific readout `0 mA / 5 mA` inside observed scene.

## 3. P0-VIS-02: Visual token parity in every A05 scene

A03 **approved application palette**, shared CSS custom properties, not scattershot hardcoded hex values:

| Token | Proposed value | Use |
|---|---|---|
| `--ie-app-bg` | `#F5F7F7` | outer learning shell |
| `--ie-surface` | `#FFFFFF` | question/sheet background |
| `--ie-lab-bg` | `#102333` | 2.5D lab ground plane/background |
| `--ie-text-primary` | `#152431` | readable headings/body |
| `--ie-text-muted` | `#65757C` | secondary copy (contrast must be checked) |
| `--ie-primary` | `#087C6D` | one active CTA |
| `--ie-accent-cyan` | `#568FAA` | neutral substrate/component shading, **not scientific measurement meaning** |
| `--ie-accent-teal` | `#7CE7D5` | teaching accent, model-dependent |
| `--ie-accent-amber` | `#F3C36C` | scientific signal ONLY if legibly explained |
| `--ie-discovery-surface` | `#F2F4F6` | insight background |
| `--ie-border-muted` | `#E6EBEB` | occasional subtle borders |

- A05: replace arbitrary stage CSS per-lesson backgrounds/tints with token-derived **shared scene shell**: stable dark navy lab, legible labels, consistent component material treatment, subdued vignette; preserve distinct scientific encodings if a hue carries a physical quantity/status. Physical signals may use different hues but must be labeled; no unlabeled green=correct/red=wrong semantics.
- A05 scene primary focus is the circuit/MOSFET/DRAM 2.5D geometry, **not repeated decorative cards/graphs/text layers**. Scene controls, meters and legend positioned by A03 slot contract; scientific data from A05 model only. Text and camera overlays must avoid clipping at 390/320.
- Do not simply recolor the SVG to the AI concept image and claim physics or geometry matches. A03 handles visual composition/palette; A05 may explicitly flag impossible/misleading depiction with evidence → A03 revise visual while maintaining accessible contrast.

## 4. Mandatory regression/acceptance gate (A02+ A05+ A03)

A02:
- [ ] Strip all MOSFET-exclusive strings (`실리콘`, `드레인`, `VGS`, `VDS`, `0.8V`, `채널`) from Lesson12 visible header/prompt/helpers and dynamic aria/TTS, except **explicit educational comparison** approved by A06/A07.
- [ ] Step-specific semantic title, current lesson ID, model, controls, scene correspond — no global hardcoded content that leaks across curriculum.
- [ ] Desktop/mobile phase separation; switch moves out of Problem; hypothesis/measurement/answer correctness is not revealed prior to prediction.
- [ ] Negative app E2E for OPEN→CLOSED→OPEN, 5V still there, 0/5mA readout, not both questions visible, no stale evidence after reset/restore, responsive 1440/390/320.
- [ ] New app screenshots and exact tested branch HEAD/CI/Chrome logs.

A05:
- [ ] Update **Lesson12 A05 SVG and scene shell** to use A03 tokens/presentation rules for light material and navy stage, consistent typographic/label hierarchy and scientific signal legend when needed.
- [ ] React props visual/readout alignment in OPEN and CLOSED; physical switch visibly open/closed; no action disguised as quiz.
- [ ] 1440/390/320 **independent actual Chromium** 2.5D capture and science negative QA with tested SHA + CI; handoff to A02. A05's independent scene PASS does **not** imply official A02 app PASS.

A03:
- [ ] Review A02 official app screenshots side-by-side with **current A03 design references**; record explicit pass/fail on information hierarchy, component locations, colors (visual pixel sampling), copy and 2.5D focality, responsive interaction, keyboard/Voice exposure.
- [ ] If design needs adjustment, **update current design+actual screenshot reference together** and delete superseded A03 designs; [CURRENT.md](CURRENT.md) remains single point of truth.
- [ ] A03 signs off only design parity; scientific/educational signoff requires A05/A06/A07 and release still requires owner.

**Stop conditions:** any wrong-lesson phrase, experiment control in Problem panel, pre-prediction leakage, unreviewed scene shell palette, or mobile inoperability means `UI_DESIGN_NOT_ACCEPTED`. Existing APP_CHROMIUM_PASS from older SHA does not waive this design acceptance gate.

## 5. Coordination

1. [Lesson12 pipeline #27](https://github.com/Junebooky/interactive-engineering/issues/27) — add new UX blocker without revoking unrelated historical science PASS.
2. [A02 integration issue #58](https://github.com/Junebooky/interactive-engineering/issues/58) and [A02 owner #1](https://github.com/Junebooky/interactive-engineering/issues/1) — update React, typed events, state, app QA.
3. [A05 scene #4](https://github.com/Junebooky/interactive-engineering/issues/4) — A03 palette/scene slot and physics fidelity.
4. [A03 design #54](https://github.com/Junebooky/interactive-engineering/issues/54) + [Team board #21](https://github.com/Junebooky/interactive-engineering/issues/21) — A03 cross-team completion/next owner.
