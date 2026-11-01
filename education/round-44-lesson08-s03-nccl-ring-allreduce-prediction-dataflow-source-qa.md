# A07 R44 · 2026-11-01 KST · Lesson08 S03 Ring AllReduce independent SOURCE QA

**수신: A06 / 상태: P1 MAJOR_OPEN (신규 2건) / HANDOFF SENT → A06.** 이 문서는 원고의 정적 교육·수학 검수 결과이며 앱/Chromium/실제 GPU 실행 PASS가 아니다.

## 1. 재현 가능한 정확한 범위
- A06 manuscript PR #7 HEAD: `8ff859a03df86f421c1884b01787fc42d92a45e5`; `education/lessons/08-ai-fabric-rdma-optics.md` exact blob **`83d5ac9319bf6a367447398936a2c8404f9a8990`**, **08-S03 `nccl-allreduce-traffic`**.
- A07 PR #14 pre-report HEAD: `92d3c1fe78097882268ccc457a59518ccc00a2e2`; this R44 report is a new file on that PR branch. A06 source is unchanged since R43. **This is the first dedicated S03 falsifiable-grading/dataflow review**, not a duplicate of R10/R11.
- Prior R10 S03 **pre-prediction formula leak is RESOLVED_SOURCE** at this blob: `predictionPrompt`, `displayTextBeforePrediction`, `speechTextBeforePrediction` do not disclose `2(N−1)/N` or 0.09375s. Do not reopen it. Teacher-only `expectedObservation` and post-gated explanation may include answers; their runtime gating has **not** been verified.
- Independent public primary source checked 2026-11-01: NVIDIA `nccl-tests/doc/PERFORMANCE.md`, https://github.com/NVIDIA/nccl-tests/blob/master/doc/PERFORMANCE.md, AllReduce busbw correction `2(n−1)/n`, ideal `t=(S/B)×2(n−1)/n`; NVIDIA NCCL Developer Guide https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2212/pdf/NCCL-Developer-Guide.pdf, ReduceScatter then AllGather yields AllReduce. These are **ideal ring toy calculations**, not measured NCCL product timings.

## 2. 독립 계산 — SCIENCE_MATH_PASS_SOURCE (좁은 범위)
Assume **per-rank tensor S=1 GiB**, **effective per-rank ring-link B=16 GiB/s**, equal N-way shards, full overlap of simultaneous rank sends/receives, zero startup/reduction/protocol/congestion costs. Each phase has N−1 sends per rank, each shard S/N; stage traffic per rank = (N−1)S/N; both stages total = 2(N−1)S/N; bandwidth-only ideal time = total/B.

| N | per-shard GiB | steps per phase | reduce-scatter GiB/rank | all-gather GiB/rank | total GiB/rank | ideal time |
|---|---:|---:|---:|---:|---:|---:|
| 2 | 0.5 | 1 | 0.5 | 0.5 | 1.0 | 0.0625s = 62.5ms |
| 4 | 0.25 | 3 | 0.75 | 0.75 | 1.5 | 0.09375s = 93.75ms |
| 8 | 0.125 | 7 | 0.875 | 0.875 | 1.75 | 0.109375s = 109.375ms |

The phrase **'lower bound'** is conditional on the stated ideal ring/effective-link model. Add a visible teacher note: real time includes startup, reduction, scheduling and contention; NCCL may select a different algorithm, so this is not universal actual latency. Never label the factor as a measured bus bandwidth.

## 3. NEW P1 MAJOR L08-R44-01 — 수치 예측은 요구하지만 틀리게 답할 수 없는 평가 계약
**SOURCE reproduction:** S03 `learnerAction` requires learner to **estimate each rank's transmitted fraction** before reveal; `learningGoal` requires N=4 0.09375s, but `modelInputs` only contains N, S, B, algorithm and zero-overhead constants. `correctIncorrectCriteria` repeats expected conceptual statements; there is no `studentPredictedStageGiB`, `studentPredictedTotalGiB`, `studentPredictedTimeMs`, immutable pre-reveal submission or numeric mismatch gate. An implementation could accept a correct WHY even when the numeric prediction is wrong. This is a **SOURCE assessment specification defect**, not a reproduced A05/A02 bug.
- **NEXT:A06:** add typed student fields with units; `submittedBeforeReveal:boolean`, `predictedReduceScatterGiB:number|null`, `predictedAllGatherGiB:number|null`, `predictedTotalGiB:number|null`, `predictedTimeMs:number|null`, immutable `observedCases:[{N,S,B,prediction,observed,why,grade}]`; numeric tolerance (e.g. ±0.001GiB, ±0.01ms for displayed exact decimal), case-scoped answer and phase/WHY gating. `grade = submittedBeforeReveal && twoDistinctNObserved && phaseValuesCorrect && totalCorrect && timeCorrect && whyCorrect`; wrong-first must FAIL, first-correct must PASS without forced wrong. N=4 total1.0GiB (wrong) FAIL, N=4 62.5ms (wrong) FAIL, N=8 factor2.0 (wrong) FAIL, N=4 0.75/0.75/1.5GiB and 93.75ms PASS if WHY correct.

## 4. NEW P1 MAJOR L08-R44-02 — 단계 카드만 있고 링을 따라 움직인 실제 데이터가 없음
**SOURCE reproduction:** S03 `learnerAction` asks choosing reduce-scatter/all-gather cards and estimating each rank's traffic from **actual N−1 steps**. `modelInputs` has no per-rank shard ownership, `phase`, `stepIndex`, `send/receive`, partial vs fully reduced shard state, or invalid phase-order reason. Merely tapping both cards does not show whether the first phase reduces and second distributes; it can reward the misconception “one GPU receives all, others never get the final result.” **SOURCE model/dataflow contract gap** only.
- **NEXT:A06:** specify `phase:'PREDICT'|'REDUCE_SCATTER'|'ALL_GATHER'|'EXPLAIN'`, `stepIndex:0..N-1` within each phase, `shardCount=N`, `shardSizeGiB=S/N`, `rankShardState[]` distinguishing partial sums / fully reduced local shard / fully replicated result; track per-rank sent/received GiB and `INVALID_PHASE_ORDER` for all-gather before reduce-scatter. Visual state must derive from that toy data, not animated dots without causality. Wrong negative: skipping reduce-scatter cannot produce valid all-reduced values; final result present on only one rank FAIL; correct order and all-rank complete result PASS. A05 must implement only after A06 correction + A07 exact-blob recheck.

## 5. 바로 적용할 한국어 학습자 문구 (A06 소유)
- **PRE 화면/Voice/aria**: “GPU마다 같은 크기의 데이터를 가지고 있어요. 먼저 데이터를 몇 조각으로 나눌지, 각 GPU가 두 단계에서 얼마나 보낼지 예상해 보세요. 숫자를 적은 다음 링을 움직여 확인해요.”
- **PRE 질문**: “먼저 합쳐서 나눠 가질까요, 한 GPU에만 모을까요? 각 단계의 순서도 골라 보세요.”
- **WRONG phase order**: “결과를 모두에게 보내려면 먼저 각 조각의 합이 완성되어야 해요. 첫 단계를 다시 골라 보세요.”
- **WRONG N4 total=1GiB**: “합을 만드는 동안에도 데이터를 보내고, 완성된 조각을 모두에게 전할 때도 보내요. 두 단계의 전송량을 각각 세어 보세요.”
- **WRONG N4 62.5ms**: “GPU 수가 달라지면 링에서 건너가는 단계 수도 달라져요. 이번에는 네 GPU의 세 단계씩을 세어 보세요.”
- **WRONG only root result**: “AllReduce는 한 GPU만 결과를 받는 연산이 아니에요. 마지막에 모든 GPU가 같은 결과를 가지고 있는지 확인해 보세요.”
- **AFTER submission + observation only**: “GPU 네 대가 각각 1GiB를 가진 이 가상 링에서는 한 GPU가 합산 단계에서 0.75GiB, 전체 공유 단계에서 0.75GiB를 보내요. 합계 1.5GiB를 16GiB/s로 나누면 이상적인 전송 하한은 93.75ms예요. 실제 실행 시간은 더 길 수 있어요.”
- Never place numeric answer/factor/phase result in **pre-reveal DOM (including hidden answer panels), Voice queue, aria-live, tooltips, card ordering, or hints**. Accessible neutral labels must remain usable. Only gated AFTER reveal may disclose exact expected values.

## 6. Acceptance tests and ownership
- **A06 source tests (NEXT:A06):** N=2/4/8 above exact toy cases; N4 wrong 1GiB/62.5ms; N8 wrong 2.0GiB; all-gather-first invalid; root-only result invalid; first-correct accepted; two independently observed N values; no pre-answer DOM/Voice/aria disclosure. Return new lesson blob SHA, not just PR comment.
- **A07 (NEXT:A07):** inspect revised exact story blob and independently retest science, prerequisites (ring/shard, GiB/s), model, negative/positive grading and source pre/post copy; **revised S03 EDU_QA_PASS_SOURCE [ ]**.
- **A05 (NEXT:A05):** no Lesson08-S03 implemented scene HEAD identified in inspected PRs. PR#56 HEAD `09870f4b4fcdc387151ec35d7afd82d81dd1f082` is Lesson06; prior R36 Lesson06 scene P1 remains open. After A06 source fix, submit own S03 scene SHA and matching Chromium/CI including negative DOM/Voice/aria, reduced-motion/320px. **Changed A05 S03 scene static review: NOT APPLICABLE (none identified)**.
- **A02 (NEXT:A02):** official Lesson08-S03 player E2E **NOT RUN/NOT VERIFIED**. PR#73 HEAD `9a11f0b9af4f2c6481c2a3f09a4e285b6da91bfb` CI `39141327025` SUCCESS and browser `39141327036` SUCCESS are for other scope; no S03 app PASS inferred.
- **Evidence separation:** A06 PR#7 HEAD and A07 PR#14 pre-report HEAD commit-workflow query returned **no runs**. A05 PR#56 HEAD CI `39042498701` SUCCESS **Lesson06 only**. A02 PR#73 HEAD CI `39141327025` and Chromium `39141327036` SUCCESS **other scope**. **A07 directly executed Chromium [ ] / A02 actual S03 app E2E [ ] / real Korean TTS, screen reader, iPhone Safari, novice learners, GPU/NCCL measurement [ ]**.
- **P1 release gate:** A06 corrected source + new SHA → A07 independent source recheck → A05 scene exact-SHA static/Chromium/CI → A02 real app E2E → owner actual-device/learner and explicit main merge/deploy approval. Existing R10 S03 pre-answer leak remains **RESOLVED_SOURCE**; R40 S02 and R43 S04 remain separate OPEN P1. **No main merge/deploy.**

**HANDOFF SENT → A06 Issue #6 / A06 PR #7 / A07 PR #14 / shared #21 / lesson #33. NEXT:A06.**
