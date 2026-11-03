# A07 Round15 · A05 NAND/eSSD/NVMe→AI five 2.5D scenes independent source/static science review
**2026-10-17 KST · A07 reviewer reports to A06 Issue#6, technical fix owner A05 PR#43, official integrated assessment owner A02.** Source manuscript A06 04 already **EDU_QA_PASS_SOURCE** on `3feba6f30e87eebccab86deb7dde505551f7c8e8` (Round09), unaffected. Inspected actual **A05 PR#43 HEAD `61612e546868269d6c9b766ba1a18cfd9a8f8877`** and GitHub blobs:
- `src/a05/nand04/nand04Model.ts` SHA **`d806070abf78cc82155aabbc8f8871e90493e538`**
- `src/a05/nand04/Nand04SceneLab.tsx` SHA **`afe1f2c748f902e3b734906d83745b9888894b99`**
- `src/a05/nand04/Nand04SceneVisual.tsx` SHA **`15a563670ecfa382d552fad68a8d3532e39cf0ba`**.

**Independent A07 scope:** actual React JSX and pure model source inspected, scientific state consistency and negative-case reachability analyzed. A07 has **not personally run Chromium, live Voice, actual DOM/ARIA/accessibility tree, physical NAND/SSD, iOS or student testing**. A05-authored CI success and Chromium 7/7 at tested HEAD ([CI run39032848290](https://github.com/Junebooky/interactive-engineering/actions/runs/39032848290), [Chromium run39032844633](https://github.com/Junebooky/interactive-engineering/actions/runs/39032844633)) remain **A05-owned reported evidence**, not A07 browser PASS. No authorized main merge/deploy.

## Summary: partial static physics PASS, **SCIENCE_SCENE_MAJOR_OPEN ordering**
- [x] N04-S01 source math/retention OFF power distinction, S03 optional PLP/ECC/DRAM, S05 cold-loading/resident/checkpoint scenarios physically reasonable pedagogical toy (no hardware timing, no universal product claims).
- [x] Pre-student prediction guard `revealed=prediction!==null` used in Nand04SceneVisual, neutral `story.speech` question available before recorded prediction, cause-specific m1/m2/m3 answers delivered after user selects wrong and clicks check. Before spoiler NOT evident in these exact source files. **No independent rendered/Voice PASS**.
- [ ] **P1 R15-01 04-S02 program→invalidate→GC event-order invariant MAJOR**: `nand04Model.ts` required history only lists `['initial','updated','collected']`; `gradeNand04()` checks `observations.includes(k)` for all three **without ordering**. JSX `Nand04SceneLab.tsx` controls map direct `change({...state,pageStage:'initial'|'updated'|'collected'},tag)` in any sequence. Clicking `GC · 무효 블록 지우기` **first** directly sets `pageStage:'collected'` and pure `nand04Pages('collected')` constructs an already-written valid B1:P0 revision B even though no learner has issued the rewrite, then erases old B0:P0. After subsequently clicking `same LBA 수정 B` and `초기 A 저장`, `seen=['collected','updated','initial']` and selecting answer `page-vs-block`, `gradeNand04` returns **`passed:true`** despite performing sequence GC→write→initial (reverse physical causality, ending at A). This is a demonstrable **code-path / grader accepted false causal history**, not browser-asserted runtime pass. Student can pass after experiencing invalid write/erase order; original A06 04-S02 asks sequence A→new B→invalidate A→safe GC.
- [ ] **P1 R15-02 04-S04 READ command→payload→optional GPU copy causal order MAJOR**: `required['nvme-transfer']=['command','read-data','to-gpu']` and evaluator once again checks **unordered `seen.includes`**. JSX direct stage selectors allow `to-gpu` FIRST, then `read-data`, then `command` and correct `answer='command-dma-staging'`. Since tags all present, result is **PASS**, even though GPU transfer started before issuing the SSD READ, no host DDR valid bytes staged, and final transport now only command. The SVG separately depicts each state but lacks a valid transfer-episode/history FSM, violating independent chronology and cause-effect teaching.
- [ ] **P1 R15-03 source-to-A02 adapter contract**: A05 `onEvent` emits `parameter.changed {tag}` and `answer.checked {passed}`, yet does not emit sequence number, readComplete/readPayloadPresent, programmedValidMap, flush/order proof, error branch identifier when invalid transition. If A02 follows pure `gradeNand04` or simply checks tags, official app will carry the same educational false PASS. Need **typed event chronology, state transition guards, eval derived from valid trace** in A05 and A02, not a visit ledger.

## Exact deterministic counterexample
```ts
gradeNand04('nand-page-block', ['collected','updated','initial'],'page-vs-block')
  // => passed: true by current code's includes() checks, but sequence invalid

gradeNand04('nvme-transfer', ['to-gpu','read-data','command'],'command-dma-staging')
  // => passed: true by identical unordered membership despite no causal READ→DMA→GPU flow
```
Direct source predicate is `required[id].map(k=>({passed:observations.includes(k)}))` plus correct answer. No ordering/transition proof exists in the current inspected pure scorer. **These precise assertions should be added as negative Vitest and actual Chromium**, both MUST FAIL until valid sequence replay.

## A05/A02 ready fix and acceptance contract
**04-S02 NAND page/GC state machine**:
```ts
type PagePhase='initial'|'newPageProgrammed'|'oldPageInvalid'|'gcAfterSafeCopy';
type Event='WRITE_NEW_B'|'INVALIDATE_OLD_A'|'GC_ERASE_BLOCK0'|'RESET';
allowed = {
  initial:['WRITE_NEW_B'],
  newPageProgrammed:['INVALIDATE_OLD_A'],
  oldPageInvalid:['GC_ERASE_BLOCK0'],
  gcAfterSafeCopy:[],
}
```
Handle **partial transaction failure** via explicit source and durable mapping: new B valid and old A still valid briefly is possible during crash-safe FTL update, but the *old* must not be erased before the new mapping is durable; toy uses strictly ordered simplified flow. If existing 3 UI buttons are kept, `초기 A 저장` must `RESET` and **clear prior grading episode**; `GC` available ONLY after valid updated and invalidation (can model combined update+invalidation if clearly declared), otherwise show `GC_BEFORE_REWRITE` and do NOT create B page or credit completed GC. Canonical A06 initial source separates GC preserve-valid; don't claim physical NAND can rewrite/erase individually.
**04-S04 NVMe route FSM**:
```ts
type ReadPhase='idle'|'readCommandSubmitted'|'payloadDmaToHostCompleted'|'gpuCopyCompleted';
idle -> SEND_NVME_READ -> readCommandSubmitted;
readCommandSubmitted -> COMPLETE_DMA_READ -> payloadDmaToHostCompleted;
payloadDmaToHostCompleted -> COPY_DDR_TO_GPU -> gpuCopyCompleted;
```
Unsupported GPU copy route should have independent supported flag or stay an explicitly hypothetical conditional extension. Reject `GPU_COPY_BEFORE_DMA` and `DMA_BEFORE_READ` (no completion tags); command after GPU copy is a new transaction/reset, cannot retroactively validate old tags. Grading MUST check actual finite-state ordering **and** learner causal answer, not visited cards.
**Regression matrix**:
1. S02 valid initial→rewrite B+invalidate A→GC block0: latest B1:P0 valid and mapping LBA7=B; PASS with correct explanation.
2. S02 first GC (no newer valid copy): FAIL `GC_BEFORE_VALID_COPY` and preserve original LBA7=A.
3. S02 GC→rewrite→initial (out of order) + correct answer: FAIL and no stale accumulated proof.
4. S02 valid final GC then reset initial→current model back A, old completion tag invalidated.
5. S04 valid host READ command→device DMA payload into DDR→explicit supported GPU copy: PASS with explanation.
6. S04 GPU copy first→DMA→command: FAIL, not retrospectively PASS.
7. S04 device DMA before read command: FAIL `NO_REQUEST`; no “payload received” status.
8. S04 unsupported GPU transfer: GPU path fails/fallback, cannot auto-pass “to-GPU” tag.
9. S01 retention power OFF→ON retains toy stored cell but READ during OFF forbidden; S03 ECC PLP DRAM independent SKU toggles not universal, S05 resident inference not full SSD reload every token; preanswer DOM/ARIA/Voice answer hidden. No regression to valid existing A05 15 misconception-specific after-learner feedback.

## Source audit by Step (other science)
- **N04-S01** threshold .5 vs1.5V, read0.3/1/2V, power OFF `reading:'not-readable'` and preserved toy cell: suitable qualitative model; no actual retention lifetime.
- **N04-S02** valid eventual mapping: updated stage has old B0:P0 invalid + new B1:P0 valid; after collected old page empty and new B1 still valid. Steady snapshots correct BUT source transition shortcuts physically impossible when visited unordered.
- **N04-S03** `nand04Ssd` does not assert ECC perfect, PLP universal or DRAM mandatory; all three can be picked for independent error and feedback, `absoluteReliabilityGuaranteed=false`. Limited but correct toy.
- **N04-S04** host READ command reaches SSD controller, controller DMA payload travels to host DDR, later separate GPU copy conditional. Good path semantics correct, **invalid chronological path not guarded**.
- **N04-S05** cold-load SSD→host DDR→GPU vs resident compute path vs checkpoint and 2 server NIC required are sufficiently qualified as toy, no timings.
- **Pre-answer and Voice** `Story.speech` is question-only, model numeric bounds rendered only after first `prediction`. Keyed WRONG messages require selected wrong answer and at least two seen manipulations; early “why” generic fallback is not the teacher answer. A05 actual 7/7 Chrome claimed on happy/wrong misconception choices, **not yet on above source-causal negative sequences**.

## Owner routing
- **NEXT A05 (primary P1)** fix N04-S02/S04 state transitions / invalid-order grader & event sequence evidence on PR#43, add negative Vitest and *actual new-head* Chromium assertions with SHA/CI/captures. Record on #30 and direct A02. **Do not set N04 scene scientific PASS while R15 open.**
- **NEXT A02 (parallel P1)** official app adapter must record physical model transition semantics; do not promote A05's unordered `parameter.changed tag` list as engine grader. After A05 fix integrate and E2E.
- **NEXT A07** independently re-read changed PR#43 model/Lab exact new blobs and A05 new negative test evidence, report science-scene PASS only when fixed; report to **A06 Issue#6**.
- **Owner** mobile Safari/real audible TTS/screenreader/learners/merge/deploy **HOLD**. A07 no actual independent browser execution.
