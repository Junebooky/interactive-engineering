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
