# A05 SRAM 05 · Actual Chromium QA evidence / A02 handoff

**Independent scene preview, NOT A02 app:** `/a05-sram-preview.html`; branch `feat/a05-sram-cache-scenes` stacked on D02 #10 (which itself stacks M01 #8 and A02 #5).
Source HEAD executed `3d4875dcbcaf83532f500858dcde4b53a136fac6`.
- [**Chromium desktop/mobile run #39023202587 — SUCCESS**](https://github.com/Junebooky/interactive-engineering/actions/runs/39023202587) with **7 PASS / 0 FAIL**.
- [**9 PNG screenshots artifact 12097259051**](https://github.com/Junebooky/interactive-engineering/actions/runs/39023202587/artifacts/12097259051), 14-day retention.
- CI [run #39023205116](https://github.com/Junebooky/interactive-engineering/actions/runs/39023205116), oxlint/Vitest/tsc+Vite success (same SHA). Reproducible `scripts/a05-sram-browser.mjs` & `.github/workflows/a05-sram-browser-qa.yml`.

## Runtime cases (Playwright Chromium, actual Vite page)
1. Before prediction: no readouts or result, actual screenshot `01-prediction-veil-desktop.png`.
2. `sram-cross-coupled-inverters`: Q0/Q1 stabilized, supply OFF shows volatility, incorrect "nonvolatile" gets error, three hints/Why, correct Q/Qbar feedback answer validated. `02-cross-coupled-volatility.png`.
3. `sram-6t-access`: BL=1, WL=ON write, READ switch, Q/Qbar=1/0 and read-disturb warning; condition-level answer passes. `03-sram-6t-access.png`.
4. `cpu-cache-vs-dram`: toy LRU 1-line **41** and 2-lines **32**, measured from UI for A,A,B,A,C, correct explanation required. `04-cache-one-line-41.png` / `05-cache-two-lines-32.png`.
5. `cpu-to-gpu-data-locality`: model unloaded vs resident, fresh input event, readout explicitly retains inputs, correct answer passes. `06-gpu-locality.png`.
6. Browser without SpeechSynthesisUtterance: readable Korean text fallback and requested speech transcript visible; no JS thrown. `07-voice-fallback.png`.
7. Emulated iPhone Chromium touch `Q=1`, responsive 375/320px no root overflow, reducedMotion preference provided. `08-sram-mobile-375.png` / `09-sram-mobile-320.png`.

## Engineering accuracy & QA boundaries
- Ideal CMOS volatile cross-coupled latch; if supply off or feedback absent show uncertain `?`, **not** an experimentally measured retention time.
- 6T = 4T inverter pair + 2T WL-gated nMOS. Reads can disturb internal node; bitline/sizing/noise margin are not quantified.
- Cache miss=10, hit=1 toy time units, 1 line 41 vs 2 lines 32 (not ns nor double performance guarantee).
- GPU weights resident → external model reloading not needed every token in representative case, but inputs/activations still move. HBM/GDDR are DRAM (not CPU SRAM); integrated-memory platforms exist.
- Tested Chromium emulated mobile + screenshots; **not** native physical phone/Safari, screen reader or audible Korean TTS voice-pack certification; not production A02 Lesson Engine E2E.
- Original SVG and CSS, no third-party visual copying, no rank/XP/streak.
- Branch code/testing evidence only, **main merge/public deployment prohibited**.

## A02 direct Scene API
- 4 `SramSceneId`: `sram-cross-coupled-inverters`→`sram-6t-access`→`cpu-cache-vs-dram`→`cpu-to-gpu-data-locality`.
- Pure `SramSceneVisual({sceneId,state,revealed})`, typed `SramVisualState` includes `q,feedback,supply,wl,bl,mode,cacheLines,cacheRan,resident,inputCount` and **does not manage progress**.
- Pure `sramModel.ts` exports `latch/access6T/simulateLru/dataLocality/assessSram`, `SramEvent,SramFeedback`. `assessSram(id,observedActionIDs,finalAnswerID)` enforces both required observations and concept.
- Standalone `SramSceneLab({onEvent?,onSpeech?})`, with event types `scene.enter, prediction.recorded, parameter.changed, answer.checked, hint.opened, voice.requested`. A02 must map pure View + A06 story and grading to its own FSM/Voice/persistence, **not copy standalone Lab's ephemeral FSM**.
- See [complete SceneSpec](https://github.com/Junebooky/interactive-engineering/blob/feat/a05-sram-cache-scenes/docs/a05-05-sram-scene-spec.md) and [source A06 storyboard](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/lessons/05-sram-cpu-cache.md).


## A07 BLOCKER 1+2 closure — 2026-10-17, supersedes previous physics-validity claims
- **New actual code SHA `7fe8f32985abe4494b3f4b51a16d1673a7860760`** (old browser/code SHA `3d4875dc...` is outdated). [Chromium run **#39028033336 SUCCESS**](https://github.com/Junebooky/interactive-engineering/actions/runs/39028033336): **7 PASS/0 FAIL**; [12 PNG screenshots artifact #12098894402](https://github.com/Junebooky/interactive-engineering/actions/runs/39028033336/artifacts/12098894402); [lint/unit/TS+Vite CI run #39028033324 SUCCESS](https://github.com/Junebooky/interactive-engineering/actions/runs/39028033324).
- **SRAM S01 P1**: VDD OFF irreversibly sets `q=null` in demo source; ON alone stays `Q=?/Q̅=?`, with `stable=false`; explicit powered-feedback `Q=0/1` initialization restores known state. Feedback OFF likewise invalidates guaranteed bit. Screenshot `02a-power-cycle-unknown.png`. `latch(q:Bit|null,feedback,supply)` accurately renders unknown.
- **SRAM S02 P1**: `transitionSramCell(state,{type:'wl'|'bl'|'mode',value})` pure transition commits canonical `q` whenever **WL=1 AND mode=write**, regardless of BL-first or WL-first action order. Changing BL under WL OFF or READ does not write; WL OFF keeps last committed Q. `access6T` accepts nullable state and view agrees with canonical transition. Chromium screenshot `03a-sram-wl-first-bl-write-persists.png` and `03b-sram-read-retains-written-bit.png`. Vitest explicitly asserts BL-first→WL-ON, WL-first→BL-change, READ changes BL, WL OFF isolation, and invalid power cycle.
- **Pedagogy**: S01 and S02 initial Korean speech now asks neutral questions rather than revealing stored-bit/wordline answer before prediction. A07/A06 independent EDU_QA on corrected source **still pending**; passing source/browser QA is not final student learning QA.
- **Typed A02 API change**: `SramVisualState.q:Bit|null`, pure `latch(q:Bit|null,...)` and `access6T(q:Bit|null,...)`, plus exported `SramCellState` and `transitionSramCell` in `sramModel.ts`; A02 must propagate nullable unknown through renderer/evaluator and always route WL/BL/mode events through reducer transition. Production app FSM/integrated E2E remains A02 owned. Do not reuse pre-fix #13 code from older stacked branches. No main merge/deploy.
