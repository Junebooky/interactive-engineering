# A06 × A05 D02 Cross-QA v0.1 (source-only) — PR #10
2026-10-17 KST · target: [A05 Draft PR #10](https://github.com/Junebooky/interactive-engineering/pull/10), head `d3a5dad2faaae2ffba9d9271b64c998d79bb276f`, base A05 M01 PR #8. Compared `dramModel.ts`, `DramSceneVisual.tsx`, `DramSceneLab.tsx`, SceneSpec, tests with A06 [02 lesson](lessons/02-dram-bit-cell.md) and [02 deep dive](deep-dives/02-dram-sense-timing.md).
**QA SCOPE:** source-level; no personal real desktop/mobile screenshots/Voice/screen reader/browser execution. A05 GitHub Actions CI passing is distinct from A06 runtime verification. `A02` production integration not included.

## Scene-by-scene
- **D02-S01 dram-write: source PASS:** `writeCell(cell,bl,wl)` changes cell only for WL=1; UI requires 'charged' then WL=0/BL=0 'held', correct thought experiment. Actual device write assist/voltage margin excluded, as disclosed.
- **D02-S02 dram-sense-restore: source CONDITIONAL PASS:** `Cc=1, Cb=9, BLpre=0.5` yields 0.55/0.45, `senseRead` records precharge→shared→sensed→restored. Restore correct. **P2 text bug:** Lab description “전하 공유 후 셀의 1과 BL의 전압이 모두 0.55로…” remains visible if user selects **셀 0**, then correct result is **0.45**. Text/Voice should bind to `state.bit` and `shareCharge(state.bit)`, not literal `shareCharge(1)`. Requested fix to avoid contradictory observation.
- **D02-S03 dram-leak-refresh: source PASS (toy):** leakage=max(0,1−0.2 elapsed), refresh resets reference; UI flags time as NOT milliseconds. Real retention and temperature variation omitted.
- **D02-S04 dram-row-bank: source PASS (internal toy):** A/B same bank serial, independent bank tasks overlap, all readouts disclose shared bus/timing constraints. Distinguish overlap from real 2x external throughput.

## Model/senior notes
- S02 `senseRead('sensed')` models **bitline already full swing, cell not yet fully restored** (cell=sharedVoltage) and `restored` sets both rail. This staged model is physically defensible as a **conceptual transient** but should visibly label “증폭 시작/복원 진행 중(가상 스냅샷)”, not claim cell does not start restoring until an independent second button in actual DRAM. Real WL-connected cell usually restores while sense amplifier drives BL. This distinction matters for tRCD vs tRAS. **P2 teaching representation request**: restore phase UI is for observation, not a literal clock-cycle stop.
- S02 `initial bit=1` and multiple-choice predicts bit1. Selection of bit0 is allowed only in precharge stage. UI and hint need reflect changed bit0 values.
- S04 1 bank A0–2 B2–4 vs 2 banks A/B0–2 excludes external bus and ACT timing; name timeline “뱅크 내부 처리” (already present).
- D02 precharge VDD/2, charge sharing toy equation ±0.05 VDD normalized: if VDD=1toy V, units Δ=±0.05toy V. No measured DRAM cell capacitance/timing spec claim.
- RowHammer/TRR/retention heterogeneity/temperature-dependent refresh are **further advanced candidates**, no established device-specific numbers.

## Teacher clarity rewrite proposals
- Present: "전하 공유 후 셀의 1과 BL의 전압이 모두 0.55로 옮겨가는 모습을 비교하세요."
- Recommended dynamic: "지금 선택한 셀의 비트는 **0**이에요. BL이 0.50에서 **0.45**로 조금 내려갔어요. 증폭과 복원 뒤엔 어떻게 되죠?" (bit1 selected: 0.55)
- Physical nuance: "센스앰프가 활성화되면 읽기와 복원이 진행됩니다. 이 장면은 작은 전압 변화, 증폭 과정, 복원 완료를 구별해 보여주는 가상 순간들이에요."

## QA acceptance / handoff
- Fix bit0/bit1 copy for S02, add source/UI test for both; include voice with selected state as needed. Declare restore stage a **teaching visualization**, not real independent restore command/timing.
- A05 owns all code modification, browser QA (especially cell0 vs cell1) and technical evidence; A02 app integration separately. A06 may recheck updated PR after a new commit. No main merge/deploy.
