# A03 V4 · Home-first + 2.5D-first + Plain Korean Microlearning
**2026-10-18 · Owner UX feedback · A03 DESIGN CONCEPT / A02 product not implemented.**
**Current design authority:** V4 supersedes V3 for **Home/Catalog navigation, pre-prediction interaction and panel copy hierarchy** only. Keep validated V3 mobile stage/sheet collision fixes and A05/A08 scientific scene changes. Merge/release HOLD.

## 0. Directly observed, not assumed
A03 read current open localhost:5173 browser tab. On MOSFET Step 1 the live DOM visibly says:
> "먼저 예상해 보세요. 예상이 기록되면 실제 부품이 나타납니다."
It shows full \`step.detailExplanation\` / Vth 0.7, VDS=0 teacher explanation inside **실리콘 구조 및 배경 지식 펼쳐보기**, *available before user predicts*. \`a03-panel-body\` stacks detailed prose, a hypothesis, supporting text, accordion, tutor, CTA. This focuses learners on reading rather than touching 2.5D.

**Source proof:** A02 earlier PR#63 \`src/components/player/A03SingleTaskPanel.tsx\`:
- \`CONCEPT\` prints \`step.detailExplanation\` + \`step.whyExplanation\` in same panel before action;
- \`predict\` prints \`predictionCtrl.label\`, overly long lesson text, result-hinting \`step.detailExplanation\` accordion; includes hardcoded \`실리콘\` wording across domains;
- \`LessonPlayer.tsx\` had generic result gating and scene text from MOSFET; A02 PR#73 already addresses part of V3 source, check latest branch before modifying.

**PR#73 changes** made a redesigned **\`CourseCatalogModal\`** with a grid and filters, but kept \`isOpen/onClose\` and overlay mechanics. New owner request explicitly **rejects modal as the canonical navigation destination**; keep visual card system, change its routing/IA semantics.

## 1. V4 core learning choreography
**BEFORE hypothesis: TOUCH THE REAL STRUCTURE (safe) → hypothesis → manipulate live physics → observe → explain → one-sentence insight → next.**
Do not hide the entire 2.5D artifact until prediction. The static scientific structure should be there at first paint. Students can tap, focus, zoom or rotate the structure's parts from the beginning. *Only the experimental outcome and correct explanation are withheld*.

Example MOSFET Step M01:
1. **Explore/Inspect:** Show actual A05 MOSFET cutaway gate/oxide/source/drain/substrate **in neutral no-result state** with three direct 44px hotspot affordances (Gate, Source, Drain). No charge-channel overlay, current value, teacher WHY, Vth numerical value, answer-highlight; no fake particle/electric flow. Prompt: "그림의 게이트를 눌러보세요." Tap gives one neutral caption: "게이트는 위쪽 판이에요. 전압을 걸어 반도체 표면의 상태를 바꿀 수 있어요." A07 must sign off scientific precision. Tap never changes VGS or earns observation evidence.
2. **Predict (after inspect interaction):** One short question: "게이트 전압을 올리면 실리콘 표면은 어떻게 달라질까요?" Use lesson-original A06/A07 checked hypothesis options, not invented correct choices. Show no threshold / current result. One primary CTA.
3. **Experiment:** A02 authoritative engine unlocks real \`VGS\` control; A05 scene shows validated change; explicitly visit low/high according to canonical rules. No pre-credit for initial default values.
4. **Observe/Explain:** Compare differences; short WHY only after observation and grading, hint on wrong answer with no answer reveal.
5. **Insight:** 1 everyday sentence + optionally one exact scientific sentence, never a paragraph dump. \`VDS=0\` means no net drain current even when inversion layer forms.
**Avoid pseudo-interaction:** A03 HTML design prototype may simulate tapping a dot and changing text but is not A05 physics or A02 official FSM. User can always skip anatomy intro if accessible equivalent required; don't make arbitrary extra taps a hidden grading condition.

### Show/hide contract
| Element | Inspect / pre-predict | After submission & experiment |
|---|---|---|
| Device geometry + factual neutral part labels | YES | YES |
| Tappable parts, zoom and camera reset | YES | YES |
| Neutral part description + caption/Voice | YES | YES |
| Threshold numeric value, channel, moving particles, current numerical result | **NO** | only if science/phase allows |
| \`whyExplanation\` / result-based hints / full teacher answer | **NO; not in DOM/ARIA/TTS/tooltip** | gated behind scientifically valid observation & evaluation |
| Long engineering detail | not in default lesson body | secondary \`더 자세히\` accessible after appropriate gate |

## 2. Short, understandable text owned by A06 / independently checked by A07
**A06 action:** produce a **coverage matrix for every published concept and assessed step** with:
- \`oneLineGoal\`: one concept and one action, Korean natural speech, aim <= 35–45 Hangul-inclusive characters (guideline not brittle validation).
- \`inspectPrompt\`: 1 verb to perform *on scene* (e.g., "게이트를 눌러보세요.").
- \`partLabels[]\`: label + one **non-spoiler, one-sentence** neutral meaning per scene hotspot.
- \`predictionQuestion\`: conversational, plain phrase, not 4-sentence stacked theory.
- \`observationCue\`: one thing to compare after manipulation.
- \`feedbackShort\`: cause → observation; one or two short lines; wrong does NOT reveal full answer.
- \`technicalDetail\`: precise complete science for progressive "원리 더 보기" **after permission**.
- \`voiceScript\`: separate pre/post prediction speech text; no pre-predict correct-answer leak.
No same narrative repeated in step lead + prompt + subtitle + tooltip + Voice. Keep critical scientific meanings/assumptions and terminology **when needed** with plain-language gloss first.

**Example rewrite (subject to A07 verification):**
| Currently too abstract | V4 plain first |
|---|---|
| "게이트에 양(+)전압을 가하면 절연막 너머…소수 캐리어…" | "게이트에 전압을 걸면 실리콘 표면의 전자들이 모일 수 있어요." |
| "Vth를 넘으면 뚜렷한 채널이…" | "전압을 더 올리자 전자가 이어진 길을 만들었어요. 이를 채널이라고 해요." |
| "Vds = 0 V라 순 DC…" | "하지만 양끝 전압 차가 없으니, 전류는 흐르지 않아요." |
A07 verifies scientifically valid wording: say "교육용 모형에서는", gate oxide not an electron-through path, inversion condition, VDS=0 net I_D=0. Pre-predict script must NOT say resulting channel/answer even if text seems simple.

**A07 gate:** audited source key per step, anti-spoiler pre-predict visible/hidden DOM, ARIA, tooltip, captions, Voice, stage imagery. Source PASS ≠ app E2E. A07 sends QA directly to A06.

**A02 contract:** \`A03SingleTaskPanel.tsx\` must stop \`<p>{step.detailExplanation}</p>\` and rendering \`whyExplanation\` in \`CONCEPT\` by default. Do not print full \`detailExplanation\` in predict accordion. Replace with **typed author-controlled short scene-linked slots** and post-grading expandable detail, no implicit text/truthiness condition that leaks. On 390/320 preserve scene + a short bottom sheet; scroll for deeper info only when requested.

## 3. Course Catalog MUST be an actual Home / Courses page, not a modal
**A02 + A01 IA**:
- Core routes (names illustrative; align with existing router): \`/\` = **Home**, \`/courses\` = all courses, \`/courses/:courseId\` = course detail, \`/learn/:courseId/:lessonId\` = immersive lesson. Current active lesson progress restoration should preserve route and only show continue CTA if actual saved state exists.
- Shared desktop nav \`홈 | 강좌 | 학습 경로\`; mobile accessible bottom/tab navigation with the same destinations if proven useful. Immersive player has only **← 홈으로 / exit**, slim progress and Voice. No modal overlay/backdrop/open/close for primary discovery.
- Reuse actual A02 PR#73 V3 visual tiles, filter chips, course thumbs and source-data-bound counts. Strip \`role=dialog\`, \`aria-modal\`, \`CourseCatalogModal\` open state for primary navigation. Convert to \`HomePage\` + \`CoursesPage\` with semantic page \`main\`, headings, links, browser back/forward, direct links, keyboard and focus management. If supplemental quick picker is ever needed, it may be a *separate* modal, not the main catalog.
- On initial entry users see visually useful courses/continuation rather than a forced simulator state. The A02 current App.tsx auto-restores/defaults into player; change landing decision without losing restore. Ask A01 for product default-entry approval.
- User should never be trapped in lesson; exit goes to actual previous home/course route, not overlay.
- A03 independent V4 concept based on previous V3 HTML source is offered as rendered desktop 1440 / mobile 390 ChatGPT screenshots. **Not official app and not yet uploaded to GitHub at time of initial design**.

## 4. Implementation gates
- [ ] A02 new Draft PR head/version and exact app route screenshot at \`/\`, \`/courses\`, \`/learn\` (desktop1440/mobile390/320), direct/Back/reload/resume/keyboard tests. \`a03-catalog-heading\` is page-level \`h1\`, not modal heading.
- [ ] A05/A08 support **safe, static, tappable pre-prediction scene part hotspots**, 44px focus, full keyboard and screen-reader alt description. Distinguish inspect taps from physics changes; no hidden spoiler values. Video/animation/pinch optional, not mandatory.
- [ ] A06 plain-language full coverage + A07 independent science/anti-spoiler review with content version ID, then A02 render mapping.
- [ ] Learners can take a useful first *scene action* without answering card; note/useful feedback linked to tapped part appears close to scene; no forced result reveal.
- [ ] At 390×844 and 320×640, independent scene and question sheet do not intersect, scene >= meaningful visible area, action CTA inside viewport, no horizontal scroll or keyboard focus behind sheet. Accessibility and real Safari/Android device still require validation.
- [ ] A03 evaluates **actual A02 app** against design, not just standalone HTML; any show/hide science deviation escalates to A05/A07.
- [ ] A01 approves IA/entry-route policy, Owner approves any main merge and deploy; HOLD meanwhile.

## 5. Owner-facing visual evidence
A03 made *independent HTML/SVG concept*:
- desktop **Home 1440×900**
- mobile **Home 390×844**
- mobile **pre-predict inspect 390×844 / 320×640**
- mobile **after hotspot inspect 390×844 / 320×640**
Also provides 2 HTML files and an offline ZIP in the ChatGPT response of 2026-10-18. The browser renders were checked for zero horizontal scroll, no lab/sheet overlap in 390/320, safe initial electron/current masking and hotspot→question state. **GitHub does NOT yet contain these V4 actual binary PNG/HTML files; refer to this exact textual contract until asset synchronization.** Do not claim V4 pixel parity from V3 assets.

## 6. Responsibilities
**A03** visual architecture/short panel flow and design parity; **A02** React router/pages/FSM/lesson app; **A05** physics + truthful 2.5D structural anatomy; **A08** visual scene touch/keyboard/label implementation; **A06** short copy; **A07** science/anti-spoiler correctness to A06; **A01** IA coordination; **Owner** merge/deploy decision.

[Dashboard #21](https://github.com/Junebooky/interactive-engineering/issues/21) · [Previous V3 P0 #70](https://github.com/Junebooky/interactive-engineering/issues/70) · [A02 V3 PR #73](https://github.com/Junebooky/interactive-engineering/pull/73) · [A03 design issue #54](https://github.com/Junebooky/interactive-engineering/issues/54).
