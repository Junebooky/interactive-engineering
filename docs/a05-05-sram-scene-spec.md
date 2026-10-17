# A05 05 · SRAM/CPU cache/GPU locality — 2.5D SceneSpec + A02 handoff

**A06 STORY_READY curriculum:** [A06 lesson 05](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/lessons/05-sram-cpu-cache.md), [Atlas](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/curriculum-atlas.md): **M01 CMOS → 05 SRAM/cache → 02 DRAM → 03 GPU feeding**; since M01+D02 standalone scenes already exist, 05 selected to fill core SRAM bridge before G03. `education/production-backlog.md` **not present** in A06 branch when inspected; chosen order is backed by Atlas section "v0.2" and ready lesson file, pending A06 queue file reconciliation.

### Four distinct coded 2.5D scenes
| sceneId | controls | explicit evidence and concept check | limitations |
|---|---|---|---|
| `sram-cross-coupled-inverters` | q=0/1, feedback ON/OFF, VDD ON/OFF | both complementary Q/Q̅ states + supply OFF volatility + stable feedback concept | Ideal latch logic; feedback OFF stability not guaranteed; no metastability/retention analog |
| `sram-6t-access` | WL ON/OFF, BL/BLB complementary, WRITE/READ | WL=0 isolation, WL=1 controlled write and read, identify 4T inverter core + 2T access, read disturb risk | Ideal differential cell; BL voltage read stability/noise margin not quantified; no separate real DRAM capacitor |
| `cpu-cache-vs-dram` | one/two LRU SRAM cache lines, run A,A,B,A,C requests | observed total **41** vs **32 toy time units**; miss/hit count & misconceptions | hit=1, miss=10 cost, inclusive total; numbers are NOT ns/actual CPU/GPU performance or 2× speedup |
| `cpu-to-gpu-data-locality` | GPU model weights resident true/false, send new input | compare load/retained weights AND separate user-input traffic; answer recognizes model weights not SSD per token | Representative discrete GPU memory; UMA/other data movement architectures exist |

General story pattern: prediction **before revealing 2.5D observation**, direct controls, numeric/logic readouts, explicit correct explanation and required action evidence, three targeted misconceptions + tiered 3 hints, Why/nextHook, Korean speech callback, 44px targets/keyboard/touch/reduced-motion and no score/ranking.

### API contract / A02
- `src/a05/sram/SramSceneVisual.tsx`: pure SVG `SramSceneVisual({sceneId:SramSceneId,state:SramVisualState,revealed:boolean})`; typed state `{q,feedback,supply,wl,bl,mode,cacheLines,cacheRan,resident,inputCount}`.
- `src/a05/sram/sramModel.ts`: pure model `latch`, `access6T`, `simulateLru`, `dataLocality`, `assessSram`, plus types `SramSceneId`, `SramEvent`, `SramFeedback`. `assessSram(sceneId,observationEventIds,answerId)` outputs `{passed,conditions[]}`.
- `src/a05/sram/SramSceneLab.tsx`: independent demo with `onEvent?(event)`, `onSpeech?(sceneId,text)`. Event types `scene.enter | prediction.recorded | parameter.changed | answer.checked | hint.opened | voice.requested`. **Not** an A02 Lesson Engine replacement; production validation/persistence/Voice scheduling belongs to A02.
- Run standalone `npm ci; npm run dev` → `/a05-sram-preview.html`. Korean Web Speech optional; unsupported environment shows readable text.
- `src/__tests__/a05Sram.test.ts` tests both latch states/off, WL 6T isolation and read, 41/32 cache, weights residency input and condition checks.

### CI, actual-browser and integration boundaries
- Source/test authored; report **successful CI only after checking GitHub Actions outcome**. This scene is not yet A02 product integrated. Later browser/physical device QA must be evidenced distinctly.
- `feat/a05-sram-cache-scenes` is stacked on A05 D02 `feat/a05-dram-1t1c-scenes` (#10), which is stacked on M01 #8 and A02 #5. A05 does not change A02 Engine code or branch.
- No main merge or deployment. A06 source/story science cross-review required before formal integration sign-off.
