# A07 Round18 · Lesson17 RISC-V CPU ISA, 5-stage pipeline, hazards, branch and CPI independent full five-Step QA
**2026-10-17 KST.** Direct recipient **A06 Issue#6 / author PR#7**, shared #21, pipeline #48, A07 PR#14. Independent A07 science/maths/curriculum/source QA only, **not** actual A05 2.5D, A02 official application, Chromium, spoken TTS, gem5 execution, silicon benchmark or learner test. No A01 individual signoff and no main merge/deploy.

## Exact source and independent final verdict
- A06 authored `education/lessons/17-cpu-isa-pipeline-hazards.md`, immutable blob **`20161ccf5afc115374ec5c0f06838d1e7d38543d`**.
- A06 senior `education/deep-dives/17-riscv-isa-pipeline-cpi.md`, immutable blob **`0fbed4022344597d871feb186dd9240218fa7eca`**.
- **[x] A07 17-S01..S05 independently reviewed: EDU_QA_PASS_SOURCE**, five Step **PHYSICS/MATH_PASS_SOURCE**, no independently confirmed P1/P0 science/learning blocker. Four **P2/MINOR** opportunities below. Earlier A06 author math/self-QA is not substituted for A07; current independent PASS is only for the two exact blobs. Exact source before/after UI/Voice, hidden teacher answer/hints and 15 cause-keyed misconception-feedback messages were individually verified. Hints can be requested progressively; correct-first counts without deliberately selecting incorrect misconception.
- External crosscheck **official RISC-V International RV32I [R1]** and **gem5 official O3CPU [R2]**: RISC-V x0 hardwired zero, x1..x31, PC, RV32I 32-bit base instruction words and load/store/register ALU semantics; gem5 CPU model stages are **not universally** our teaching IF/ID/EX/MEM/WB. Sources https://docs.riscv.org/reference/isa/unpriv/rv32.html and https://www.gem5.org/documentation/general_docs/cpu_models/O3CPU . Pipeline five-stage and 1/2-cycle stall/2-cycle mispredict timings are intentionally assigned teaching assumptions, **not mandated ISA/gem5 or measured performance**.

## Independent math and learning acceptance by scene
### 17-S01 `riscv-load-store-pc` — PASS_SOURCE
**Architecture, aligned byte-addressed toy:** x0=0 immutable; x2=0x100, M32[0x100]=9. Sequential:
1. `addi x1,x0,5`: x1=5
2. `sw x1,0(x2)`: M32[0x100]=5, no register destination
3. `lw x3,0(x2)`: x3=5
4. `add x4,x3,x1`: x4=10
5. `addi x0,x1,7`: x0 stays0.
If rearranged as `addi x1`, **`lw x3` before `sw x1`**, then `add x4,x3,x1` after, x3=9 **and x4=14**, even though memory ends 5 after store. Instruction PCs in this no-branch pure RV32I toy 0x0,0x4,0x8,0xc (plus extra x0 step at0x10); branching or RVC would require different movement. x0 write does not change x0, but instruction side effects/exception semantics must not be universally inferred from all instructions writing x0 (outside toy). Source's 9 old load and 10 original output **PASS**; current reordering result only specifies x3 and omits x4, not wrong but helpful to display full updated end state.
**P2 R18-01** A06 or A05 expose reordered **x4=14** as explicitly derived *only when ADD remains after early LW*; student must not see x4=10 reused after alternate order. Counterexample: altered x3=9 but x4=10 is stale false-pass. Also explicitly reset state/PC when reordering rather than replaying on M already modified to5.
**Source first voice / pre-answer neutrality PASS**, 3 wrong-cause feedback distinct, teacher after gated.

### 17-S02 `cpu-five-stage-overlap` — PASS_SOURCE
For N independent operations, balanced IF/ID/EX/MEM/WB each one toy tick:
- N=1: first IF cycle1, WB cycle5 ⇒ total5 both pipeline and hypothetical non-overlap.
- N=4: IF1..4, WBs5..8 ⇒ **8 cycles** `Tpipe=N+4`; serial non-overlap `5N=20` cycles; speedup20/8=**2.5×** for this short job, not universal5×. First instruction **latency 5cycles** vs steady **throughput after fill 1 completed/tick**.
**Negative path** student who picks first instruction 1cycle or all four completed at cycle4 must fail; first-right student must pass on comparing two distinct configs. Pipeline speedup must be compared under **identical toy clock**; not real CPU throughput. Three wrong feedback physically appropriate; Before voice only asks predicted completion.

### 17-S03 `cpu-raw-load-use-stall` — PASS_SOURCE
Exact timing stipulated: preceding LW IF1/ID2/EX3/MEM4/WB5; dependent ADD IF2/ID3/nominal EX4 cannot use a load value that appears only **end MEM4**. With MEM→EX forward, one bubble yields ADD EX5 ⇒ four-instruction completion baseline8+1=**9** toy cycles. Without bypass, file WB first half c5 and consumer ID reads later in c5⇒ ADD EX6, **two bubbles** and total **10**. If producer instead ALU ADDI has result end EX3 and EX→EX bypass, consumer EX4 ⇒ **0 bubble/8**. No false historical x5 value or magic 0-latency load; bubble isn't store/retired instruction.
**P2 R18-02** show two explicit cycle rows in A05 visual: forwarding MEM(c4)→dependent EX(c5); no bypass WB(c5 first half)→dependent ID(c5 later)→EX(c6). Same-cycle WB/ID ability is a **declared special register-file assumption**, not all CPU cores. The source already declares it; P2 primarily an implementation negative test.

### 17-S04 `cpu-branch-speculation-flush` — PASS_SOURCE
With branch IF1/ID2/EX3 **resolving at the end EX c3**, younger speculative instructions fetched c2 and c3 must be squashed if predicted taken vs actual not, or vice versa, and **must not commit architectural register/memory side-effects**. Correct prediction => no flush for the branch, incorrect => **two younger wrong-path instructions** and exactly two recovery cycles **only by toy assumption**. Independently specified synthetic workload **baseline20 cycles** and externally selected count m2/m4 mispredictions ⇒ `20+2m=24/28`. This is mathematically correct but **m is an aggregate hypothetical input**, not evidence of repeatedly executing one demonstrated branch four times.
**P2 R18-03** UI needs distinct controls `singleBranchExpected|Actual` versus `aggregateMispredictions=2|4 of hypothetical workload`; do not automatically count 4 wrong predictions from toggling one beq control once. Score both outcomes independent; no real product branch penalty/branch delay slot assertion. Source already calls workload unrelated hypothetical; no blocker.

### 17-S05 `cpu-cache-miss-cpi` — PASS_SOURCE
100 retired scalar instructions, 30% loads ⇒30 loads, miss probability **conditional per load** p=0/.05/.1 and each miss costs **extra**20cycles over 1 CPI baseline, serial/no overlap. `E[misses]=100×.30×p`, `E[cycles]=100+20E[misses]`, `E[CPI]=1+.30p×20`. p=.1⇒expected3 misses,160cycles,1.6CPI, at2GHz 0.5ns/cycle⇒**80ns** expected; p=0⇒100cycles/1.0CPI/50ns; p=.05⇒**expected1.5 misses**,130 expected cycles,CPI1.3,65ns. A single instruction trace **cannot contain half a miss**. A fixed illustration with exactly3 misses and p=.1 can achieve160cycles, but a random30-load sample with probability10% need not contain exactly3 misses. Source differentiates .05 expectation clearly, but p=.10 histogram “30 loads and3 misses” can accidentally sound *guaranteed* conditional Bernoulli realization.
**P2 R18-04** label `perLoadMissProbability` vs `fixedObservedMissCount` separately, or explicitly state “이 샘플은 30개 중 정확히3개가 미스인 예시이고, p=.10이면 장기 평균도3개”; p=.05 **expected**130cycles should not appear as a deterministic single-run timing, no half-miss bubble. OoO `possible` only conditional qualitative, must not set exact faster CPI or make true RAW dependency vanish without ROB/MSHR/miss overlap model.
**Source before question:** user asked how much longer, 100base given as stated premise not computed answer; teacher numerical output gated. Scientifically conditional miss rate is **not 10% of all100 instructions**; m1–m3 responses appropriate.

## Implementation / A05–A02 negative evidence gates
1. S01 original x1=5/M5/x3=5/x4=10/x0=0 vs reordered LW early x3=9/x4=14; complete reset to original memory9 before test; no future store magic.
2. S02 with N1 first WB5 and N4 last WB8; serial20, speedup2.5; first single instruction remains5.
3. S03 ALU bypass0 bubble/8 cycles, LW bypass1bubble/9, LW no bypass2bubbles/10, no stale bypass, visible event timeline/cycle.
4. S04 branch taken/not actual vs predictor separated, first wrong flush2 younger and no wrong-path architectural commit, synthetic 2 or4 mispredict counter costs24/28 *without fabricating 2/4 actual branches from one toggle*.
5. S05 p0⇒CPI1/50ns, p.1⇒CPI1.6/80ns expected or exactly3-miss toy, p.05⇒expected CPI1.3/65ns but **no 1.5 physical miss**, all miss fractions relative to30 loads and OoO cannot automatically erase.
6. All five student `BeforePrediction` DOM+aria+onSpeech neutral and no teacher computed answer/hint until student records independent prediction + two distinct manipulations + WHY; then reveal only post-answer feedback for attempted mistake. Do not demand an intentional first wrong answer; 3 independent misconception negative options ×5 scenes. Tested PR SHA/actual Chromium+voice/aria/keyboard/mobile evidence should belong to A05, A02 official app after.

## Checklist / owner-to-owner handoff
- [x] A07 first independent source QA **five/5 complete EDU_QA_PASS_SOURCE**, two exact source SHAs and official RISC-V/gem5 relevance verified.
- [ ] **P1 NEXT:A06** update card #48 `STORY_READY` for exact lesson + senior SHAs; directly hand to **A05 Issue#4** five scene contracts and this negative matrix, note HANDOFF SENT/ACCEPTED separately. No A01 per-lesson approval.
- [ ] **P1 NEXT:A05** actually implement and test 5 scenes with typed stage/PC/history, negative paths and pre-Voice gate at latest scene source SHA; run real Chromium/Voice/aria/browser CI and directly notify A02; [ ] **A02** official app reducer/E2E afterward.
- [ ] **P2 NEXT:A06/A05** four minor fidelity corrections R18-01..04, no need to block production-ready **source** review unless source canonical semantics change; if A06 edits canonical source or source lesson register, new blob needs A07 SHA recheck.
- [ ] **OWNER** actual device/student/TTS pronunciation/Safari/screenreader/main merge and production approval still separate release HOLD.
