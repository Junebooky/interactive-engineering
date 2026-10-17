# A03 | MOSFET Discovery Lab V1 — UI/UX Design Handoff

> DESIGN CONCEPT ONLY. Screenshots are A03 HTML/SVG renders in ChatGPT, not A02 product screenshots. No merge or deployment.

## Verified baseline (2026-10-17)

A02 [Draft PR #44](https://github.com/Junebooky/interactive-engineering/pull/44) HEAD 6c48cbfbf9e81d6967962bcf5bb7fa7c7cc09510. Examined src/index.css blob 30be2471, LessonPlayer dd39d5ee, MOSFET lesson 643b73e2. Current design is all slate dark, split stage-grid 42% prompt/58% simulation, with pre-prediction showObservation gating, Voice settings, FSM, persistence. These features **already exist**; A03 proposes stronger scene-first hierarchy rather than changing scientific/learning engine contracts.

## V1 design

- 1440 desktop: shell light #F5F7F6; dark 2.5D scene #102333 (~69% of lab split), question panel white #FFFFFF (~31%); maximum content width 1350px; spacing 21px; scene/card radius ~24px.
- 390/320 mobile: vertical lab then one-action prompt; native input slider after prediction, accessible controls. 320 requires zero horizontal scrolling; minimum hit target 44x44px.
- Colors: text #17202D, accent decorative #0BA891, **small accent text and solid CTA #087C6D** (~5.1:1 contrast on white), silicon #568FAA, gate #C6D7EB, oxide #7CE7D5. Font Pretendard/NanumSquare/Noto Sans KR fallback.
- Avoid XP/streak/score. The bar represents the canonical chapter/step only, not an invented percentage. Tutor secondary to 2.5D learning and primary action.

## Interaction states and safeguards

ASK -> PREDICT -> MANIPULATE -> OBSERVE -> EXPLAIN -> FEEDBACK -> CONTINUE.

1. Ask and prediction use 0/0.6/1.2 V options. Until prediction is submitted, **no observation results, model values, correct-answer hints, reveal animations, Voice spoilers or accessible hidden-result text**. Structural 2.5D geometry is permitted.
2. After submission, A02 may reveal existing VGS 0..1.2V / 0.1V-step action; compare visits at 0V and >=0.8V. Vth 0.7V is the currently defined **educational toy assumption**, not a universal device constant.
3. With VDS=0 V, gate inversion/channel may develop, but **net DC drain current is 0 A** in this scene; presentation may not conflate channel with current.
4. Only authoritative A02 engine rule may certify observation and answer. On misconceptions give neutral, cause-specific correction and chance to retry; complete only when valid evidence exists.
5. App reduction/restore must never bypass prediction; stale save must not reveal future answers.

## Component handoff

A03 proposes SceneFrame / PredictionCard / ExperimentControlDock / ObservationStatus / FeedbackPanel / TutorMiniPlayer / StepProgress and common tokens. **A02 owns** typed reducer, action adapter, Voice, storage, app E2E, and product integration; map UI event intents (prediction selection/submission, VGS change, observation visit, answer, retry, complete) onto existing authoritative state rather than replacing it. **A05 owns** physical model/geometry/animation and approves cutaway label fidelity. **A06/A07** validate teaching copy, science and anti-spoiler (A07 reports to A06). **A01** reviews design direction. Owner controls merge/release.

## Responsive, accessibility and negative QA

- 1440: scene+question simultaneous; 768/1023: stack rather than squeeze a question panel below 320px; 390/320: large legible stage, one primary action per state, no horizontal overflow.
- Text contrast WCAG AA normal >=4.5:1, large >=3:1, nontext >=3:1; text/icon state beyond color. Visible keyboard focus; Enter/Space radio, arrow-key slider, accessible physical readout and touch targets >=44px.
- 2.5D drag/pinch has an alternative zoom/rotation keyboard/button interface. prefers-reduced-motion static fallback and transcripts / unsupported ko-KR Voice fallback.
- Must test loading, disabled, misconception, experiment model failure, Voice unsupported, storage denied/offline/restore failure; show truthful unsaved indicator.
- **Open:** A02 actual product screenshots on tested SHA/Chromium, A05 physical scene review, A07 scientific copy/spoiler audit, real iOS/Safari/screen reader/student QA, owner approval and RELEASE_HOLD.

## Deliverables / evidence status

A03 ChatGPT conversation provides concept PNG renders for desktop 1440, mobile 390 and 320, observation and finished states, six-stage journey infographic and standalone HTML/SVG interaction concept. The images are **not currently hosted on GitHub**. Check [A03 design issue #54](https://github.com/Junebooky/interactive-engineering/issues/54), [team board #21](https://github.com/Junebooky/interactive-engineering/issues/21), [owner board #16](https://github.com/Junebooky/interactive-engineering/issues/16).