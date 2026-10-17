# A05 G03 · GPU feed and DDR/GDDR/HBM 2.5D SceneSpec

- Owner source: [A05 Issue #4](https://github.com/Junebooky/interactive-engineering/issues/4) autonomous implementation; A06 [G03 storyboard](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/lessons/03-gpu-memory-bottleneck.md) QA-ready.
- Precedence: after 05 SRAM and 02 DRAM, G03 is next dependency in [A06 Atlas](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/curriculum-atlas.md).
- Branch `feat/a05-gpu-memory-bottleneck`, stacked on A05 SRAM PR #13, DRAM #10, M01 #8, A02 #5. A05 does not update A02 engine.
- `/a05-gpu-preview.html` on local Vite. Separate A02 application integration and native device QA.

## Four scene contracts

| sceneId | input | observed | condition & physical guardrail |
|---|---|---|---|
| `compute-feeding` | work 64 toy; compute 16/32; feed 8/16/32 | steady-state throughput min(compute,feed); with feed8 both compute16/32 ~8 toy seconds; after feed32 compute32 →2 toy s | observe both compute at feed8, then change feed32 and explain bottleneck. **Fully overlapped steady-state**, no startup/drain/latency. Serial model would differ. |
| `memory-family-roles` | CPU DIMM→DDR/RDIMM; board GPU→GDDR6/GDDR7; GPU package→HBM | all are **DRAM**, with different representative placement | visit three, explain tradeoffs. HBM neither nonvolatile nor mandatory for every GPU; SKU specificity not asserted. |
| `gddr-width-rate` | 128 bit × 24/32 Gb/s/pin, NRZ/PAM3 | **384/512 decimal GB/s upper toy** at 100% efficiency. NRZ 2 levels, PAM3 3 signal levels | test both rates and correctly explain ÷8; **PAM3 ≠ 3bits/cycle**, product measured throughput not guaranteed. |
| `hbm-tradeoffs` | board GDDR vs package HBM, constraint panel | HBM vertical TSV *inside* stack; GPU↔HBM package link via interposer or equivalent; board GDDR traces alternative | compare both, inspect heat/cost/complexity, answer relative constraints. **UI 2.5D ≠ 2.5D semiconductor packaging**. |

All scenes with prediction veil, reactive original SVG layered circuits, native touch/keyboard buttons, target >=44px, reduced-motion CSS, individual three misconceptions/three hints/Why/nextHook and explicit request-only Korean Voice. no score/XP/streak/leaderboard.

### A02 API (typed pure views vs separate standalone Lab)
- `src/a05/gpu/GpuSceneVisual.tsx`: `GpuSceneVisual({sceneId:GpuSceneId,state:GpuVisualState,revealed:boolean})`.
- `GpuVisualState`: `{compute,feed,family,site,pinRate,signal,topology,showConstraints}`.
- `src/a05/gpu/gpuModel.ts`: `computeFeeding,placement,memoryPlacementMatches,theoreticalBandwidth,signalLevels,packaging,assessGpu`, typed `GpuFeedback`, `GpuEvent`.
- `GpuSceneLab({onEvent?,onSpeech?})`: standalone ephemeral prediction/control/feedback loop only; never mount its local state into A02 product FSM. A02 maps scene model and A06 story to canonical app content/progress/Voice.
- Events `scene.enter, prediction.recorded, parameter.changed, answer.checked, hint.opened, voice.requested` with `{sceneId,type,payload?}`; no global voice or persistence side effects.
- Preview `src/a05/gpu/preview.tsx` with transparent speech transcript/fallback; tests `src/__tests__/a05Gpu.test.ts`.
- **Cross-review/QA**: unit tests exist; check GitHub CI/real browser after run before marking SCENE_READY. Formal native smartphone, Safari, speech audibility, screen-reader and real learner tests stay separate.
- No main merge or deployment.
