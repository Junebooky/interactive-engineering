# 17 · CPU가 명령을 처리하는 진짜 방법 — RISC-V ISA부터 파이프라인·캐시까지
> **A06 original author source / A07 independent source review pending · 2026-10-17**. New 5 interactive storyboard Step [pipeline #48](https://github.com/Junebooky/interactive-engineering/issues/48), [RISC-V ISA + gem5 reviewed public-reference science model](../deep-dives/17-riscv-isa-pipeline-cpi.md). A05 implemented scene or A02 app/browser/real chip benchmarks do NOT exist from this source draft. Prior 18 authored lessons/78 Steps + this 17 five Steps = **19 authored lessons/83 Steps**.
> 권장 선수 12 전압/클록, 13 확률·단위, 01 트랜지스터와 16 플립플롭, 05 SRAM/Cache; 후속 03 GPU vs CPU / 07 서버 DDR·CXL / 29 PCIe DMA / 10 AI 데이터센터 host path. 강의가 보여 주는 5단계 IF/ID/EX/MEM/WB와 모든 CPI 값은 **명시적 toy**: RISC-V ISA 자체는 단계/캐시/예측 페널티를 지정하지 않습니다. 시간45–55분 기획 추정, 실측 학습 시간 아님.

## Learner evidence and hidden-answer contract
- Prediction stage only receives storyHook/question/predictionPrompt/displayTextBeforePrediction/speechTextBeforePrediction and ungraded basic definitions; computed numerical `teacherExpectedAnswer`, `expectedObservation`, specific error feedback, `displayTextAfterObservation`, `speechTextAfterObservation` **blocked in DOM/ARIA/Voice until student makes prediction and changes two distinct independent controls and records WHY**. Student who predicts right the first time CAN pass with evidence; wrong choice not mandatory. Hints L1/L2/L3 requested only and staged, never generic 3-choice pass without cause-specific correction.
- Every stage has 3 different wrong options mapped to 3 specific Korean corrections, and numeric/physical test cases with model inputs and toy assumptions. A07 independently reviews exact source blob, then only after SOURCE PASS A06 directly hands all five 2.5D SceneIDs to A05; A05 browser tests, A02 product app and owner release separately evidence-gated.

## 17-S01 · `riscv-load-store-pc` · 레지스터 5, 메모리 9 — CPU 명령은 어디에 쓰일까요?
### ① 먼저 예측하고 직접 움직이기
- **sceneId:** `riscv-load-store-pc`
- **learningGoal:** RV32I architectural x0/PC/register vs load/store/memory accurately separate ISA guarantees from clock/performance.
- **priorKnowledge:** 12 전기·시계, 16 레지스터 플립플롭, 05 SRAM 메모리 계층
- **storyHook:** CPU가 더하기를 시작할 때 SSD나 DRAM에서 직접 두 숫자를 더하는 걸까요?
- **question:** CPU가 더하기를 시작할 때 SSD나 DRAM에서 직접 두 숫자를 더하는 걸까요?
- **predictionPrompt (learner-only):** `addi`, `sw`, `lw`, `add` 네 명령 카드를 실행하면 x1, 메모리, x3, x4 중 어느 것이 먼저 바뀔지 골라 보세요. x0에 쓰면 값이 저장될까요?
- **displayTextBeforePrediction:** ISA는 CPU가 해야 하는 일을 말할까요, 얼마나 빠르게 하는지도 정할까요?
- **speechTextBeforePrediction:** 명령 카드를 메모리와 레지스터 사이에 직접 배치해 봐요. 숫자를 보기도 전에 이동 경로를 예측해 보세요.
- **learnerAction:** x2 주소0x100과 초기 M[0x100]=9 및 x0=0 표시. (a) `addi x1,x0,5`, `sw x1,0(x2)`, `lw x3,0(x2)`, `add x4,x3,x1` 카드를 드래그해 PC 0x000,004,008,00C (pure RV32I 32bit only)와 register/memory 변화 관찰. (b) re-order `lw` before `sw` and then `addi x0,x1,7`, check load uses old memory9 rather than new5 and x0 zero. Action trace stepwise, no architectural branch in toy.
- **modelInputs:** RV32I XLEN32, x0=0 hardwired, x1=0,x2=0x100,x3=0,x4=0 initially, M32[0x100]=9, instructions addi/sw/lw/add/addi-to-x0, pc starts0 and increments+4 only because all toy instructions 32bit and no branch, addresses valid aligned, no exceptions/MMIO; execution order selectable and determines memory data.
### ② 교사용 관찰·정답 — 학생 예측 전 비공개
- **expectedObservation (teacher-only):** Original order: x1=5, memory[0x100]=5, x3=5, x4=10; `addi x0,x1,7` leaves x0=0; if `lw x3` before `sw`, x3=9 in toy. Plain RV32I PC normally advances4 for sequential 32bit instructions but branch/jump and compressed extensions can change that. ISA describes results not stage count or speed.
- **teacherExpectedAnswer (gated):** Original order: x1=5, memory[0x100]=5, x3=5, x4=10; `addi x0,x1,7` leaves x0=0; if `lw x3` before `sw`, x3=9 in toy. Plain RV32I PC normally advances4 for sequential 32bit instructions but branch/jump and compressed extensions can change that. ISA describes results not stage count or speed.
- **correctIncorrectCriteria:** Complete two distinct orders and write x0, explain x register vs byte-addressed data memory and `load/store only` accesses, name ISA correctness vs physical microarchitecture speed. Negative old memory reading must not magically use future store.
- **misconceptions:** [m1] ALU 더하기 명령어는 무조건 DRAM에 있는 두 숫자를 직접 더해요. / [m2] RISC-V 레지스터 x0에 7을 쓰면 앞으로 x0은 7이에요. / [m3] 앞으로 등장할 STORE보다 먼저 LOAD해도 아직 저장되지 않은 새 값이 읽혀요.
- **hints L1/L2/L3 (requested only):** [L1] add의 입력으로 레지스터를 그려볼까요? / [L2] 하드와이어드 레지스터가 어느 하나인지 확인해봐요. / [L3] 실행 순서와 주소0x100에 써 있는 현재 값을 비교해요.
- **misconceptionFeedback/m1 (gated):** “RV32I 산술 명령은 레지스터 값을 계산하고 데이터 메모리는 load/store가 접근해요.”
- **misconceptionFeedback/m2 (gated):** “x0은 0으로 고정돼 있어요. x0를 목적지로 적어도 7로 바뀌지 않아요.”
- **misconceptionFeedback/m3 (gated):** “선행 STORE가 아직 실행되지 않았다면 해당 주소에 남은 이전 값 9가 LOAD됩니다. 명령 순서는 중요해요.”
- **feedback/correct:** “서로 다른 두 상태에서 실제 명령/클록을 확인했어요. 장난감 가정 밖에서도 항상 그럴지 WHY로 확인해봐요.”
- **displayTextAfterObservation (gated):** ISA의 명령 의미와 CPU의 내부 실행 방식은 구분해야 해요.
- **speechTextAfterObservation (gated):** 메모리를 읽거나 쓰는 명령과 레지스터끼리 계산하는 명령이 달라요. RISC-V x0은 언제나 0이고, 실행 순서에 따라 메모리 값도 달라지죠.
### ③ 시니어 설계판단과 실패조건
- **physicsAssumptions:** RV32I base no C extension, all selected toy instructions 4B and no branch; valid aligned RAM and no faults. RISC-V ISA does not prescribe pipeline or clocks; this is architectural sequential execution without speculative side effects.
- **seniorDesignReview:** CPU ISA portability vs pipeline/OoO implementation and memory ordering in concurrent multithread/IO cases omitted; x0 store destination has no architectural write.
- **sourceRefs:** [R1]
- **negativePathTest:** student must be able to choose any m1/m2/m3 physical misconception and receive only its own correction *after* grading; correct-first can pass with at least 2 independent controls and WHY. Model's alternate states/negative timing/capacity invariants above become A05 real Chrome/Voice/aria assertions after exact-source A07 PASS.
- **nextHook:** 명령어 네 개를 단계별로 겹쳐 실행하면 무슨 일이 일어날까요?

## 17-S02 · `cpu-five-stage-overlap` · 명령어 네 개를 겹치면 정말 5배 빨라질까요?
### ① 먼저 예측하고 직접 움직이기
- **sceneId:** `cpu-five-stage-overlap`
- **learningGoal:** Distinguish pipeline fill latency from sustainable throughput and ideal short job speedup under fixed toy 5-stage in-order single issue.
- **priorKnowledge:** 17-S01 instruction sequence, 16 flip-flops clock, 13 cycle and ns
- **storyHook:** 한 레스토랑에서 주문·요리·서빙 다섯 단계를 겹치면 한 손님도 순식간에 끝날까요?
- **question:** 한 레스토랑에서 주문·요리·서빙 다섯 단계를 겹치면 한 손님도 순식간에 끝날까요?
- **predictionPrompt (learner-only):** 단계가 각각1클록인 다섯 단계 CPU에 독립 명령어 네 개를 넣으면 마지막 명령이 완료되는 데 몇 클록이 들지 예상해 보세요.
- **displayTextBeforePrediction:** 겹쳐 처리하면 개인 지연과 전체 완료 시간이 같을까요?
- **speechTextBeforePrediction:** 각 단계 칸에 명령 카드를 하나씩 넣어 봐요. 첫 카드가 끝나는 시간과 네 번째 카드가 끝나는 시간을 예상해 보세요.
- **learnerAction:** Place four independent ADDI ALU cards into IF→ID→EX→MEM→WB five-column cycle matrix, play pipeline and a **hypothetical entirely non-overlapped single-issue** comparison. Slide numInstructions=1|4 and choose pipelineEnabled yes/no; after predicting reveal warm-up completion and steady throughput. Show stage tokens physically distinct and gray idle slots.
- **modelInputs:** five stages IF/ID/EX/MEM/WB, each exactly 1 toy cycle; one issue/cycle, independent instructions, no structural/branch/data/cache hazards, first IF cycle1 and WB cycle5, N=1|4, pipelineCycles=N+4, nonOverlappedCycles=5N, speedup=5N/(N+4). For N=4 cycles8 vs20, speedup2.5; N=1 cycles5 vs5 speedup1.
### ② 교사용 관찰·정답 — 학생 예측 전 비공개
- **expectedObservation (teacher-only):** With four independent ops pipelined completion cycles5,6,7,8; first latency5 cycles, fourth completed at8, completed peak throughput1 instruction/cycle after fill. Without overlap four×5=20 cycles; short-run ideal speedup20/8=2.5, not guaranteed5x. One instruction latency remains5 either case.
- **teacherExpectedAnswer (gated):** With four independent ops pipelined completion cycles5,6,7,8; first latency5 cycles, fourth completed at8, completed peak throughput1 instruction/cycle after fill. Without overlap four×5=20 cycles; short-run ideal speedup20/8=2.5, not guaranteed5x. One instruction latency remains5 either case.
- **correctIncorrectCriteria:** Two configurations N1 vs4, pipeline vs non-overlap and distinguish latency5 from throughput, 4-ops completion8 vs20 and explains fill/drain. No real CPU five-stage universal claim.
- **misconceptions:** [m1] 파이프라인이 다섯 단계면 명령 하나의 지연이 언제나 5분의1로 줄어들어요. / [m2] 네 명령 네 클록만 지나면 5단계 파이프라인에서 모두 끝나요. / [m3] 모든 CPU와 gem5 모델이 정확히 IF·ID·EX·MEM·WB 다섯 단계로 만들어져요.
- **hints L1/L2/L3 (requested only):** [L1] 첫 명령의 WB는 몇 번째 클록에서 만날까요? / [L2] 두 번째 명령은 첫 번째 뒤 한 클록부터 겹쳐 넣어요. / [L3] 하드웨어 구조는 설계마다 같을까요?
- **misconceptionFeedback/m1 (gated):** “파이프라인은 주로 연속 작업 처리량을 개선해요. 개별 명령이 거치는 다섯 단계는 남아 있어요.”
- **misconceptionFeedback/m2 (gated):** “마지막 네 번째 명령은 IF가4클록에서 시작하니 WB는8클록이에요. 채우는 시간도 세야 하죠.”
- **misconceptionFeedback/m3 (gated):** “이 다섯 단계는 수업용 고전 모형이에요. 실제 gem5 Minor/O3 및 상용 CPU 단계 구조는 달라요.”
- **feedback/correct:** “서로 다른 두 상태에서 실제 명령/클록을 확인했어요. 장난감 가정 밖에서도 항상 그럴지 WHY로 확인해봐요.”
- **displayTextAfterObservation (gated):** 파이프라인은 처리량과 개별 지연을 다르게 바꿔요.
- **speechTextAfterObservation (gated):** 여러 명령을 겹쳐도 맨 처음 명령의 다섯 단계가 사라지는 건 아니에요. 네 개를 처리하는 짧은 작업은 채우기 시간 때문에 이상적으로도 두 점 오 배 정도만 빨라질 수 있어요.
### ③ 시니어 설계판단과 실패조건
- **physicsAssumptions:** Explicit fictional five-stage 1cycle each single issue fully balanced, no hazard, clock frequency identical between designs, no actual silicon benchmark or universal pipeline layout.
- **seniorDesignReview:** Frequency-vs-stage balance, fill/drain effects, data/branch hazards and front-end fetch bandwidth, superscalar width separate.
- **sourceRefs:** [R2][R3][R4]
- **negativePathTest:** student must be able to choose any m1/m2/m3 physical misconception and receive only its own correction *after* grading; correct-first can pass with at least 2 independent controls and WHY. Model's alternate states/negative timing/capacity invariants above become A05 real Chrome/Voice/aria assertions after exact-source A07 PASS.
- **nextHook:** 앞 명령이 메모리에서 값을 받아야 다음 명령이 움직이는 경우는 어떨까요?

## 17-S03 · `cpu-raw-load-use-stall` · 포워딩이 있으면 메모리 기다림도 사라질까요?
### ① 먼저 예측하고 직접 움직이기
- **sceneId:** `cpu-raw-load-use-stall`
- **learningGoal:** Demonstrate in-order RAW hazards and one load-use bubble despite bypass, contrasting ALU forwarding and no forwarding timings.
- **priorKnowledge:** 17-S02 pipeline timeline, 17-S01 load-store, 05 cache
- **storyHook:** 바로 앞 명령이 메모리 읽기를 끝내기도 전에 다음 더하기가 달려가면 무슨 값으로 계산할까요?
- **question:** 바로 앞 명령이 메모리 읽기를 끝내기도 전에 다음 더하기가 달려가면 무슨 값으로 계산할까요?
- **predictionPrompt (learner-only):** 바로 다음 명령이 로드한 값을 사용해야 할 때, 포워딩을 켜면 대기 없이 실행될지 먼저 예측해 보세요.
- **displayTextBeforePrediction:** 포워딩은 시간을 건너뛰는 마법일까요?
- **speechTextBeforePrediction:** 메모리와 더하기 장치를 연결해 보세요. 어떤 값이 언제 준비되는지 먼저 선택해봐요.
- **learnerAction:** Arrange `lw x5,0(x2)` then dependent `add x6,x5,x1` then two independent ALUs; toggle forward=true|false and replace producer with ALU addi for second experiment. Animate IF/ID/EX/MEM/WB and bubble with data-ready event, choose deliberately wrong old-value bypass; exercise same pattern with no dependency for reference.
- **modelInputs:** four in-order instructions in classic five stages, baseline 8cycle no hazard. Load data ready **at end MEM** cycle4, dependent next EX would start cycle4, forwarding allows dependent EX cycle5 after 1 bubble ⇒ four-job completion9 cycles. Without forwarding, file writes first half WB cycle5 and ID can read second half, next dependent EX6 ⇒ two bubble cycles and total10. For ALU producer result available end EX cycle3 and forwarded dependent EX4 ⇒0 bubble, four-job completion8. All other resource/cache hazards disabled.
### ② 교사용 관찰·정답 — 학생 예측 전 비공개
- **expectedObservation (teacher-only):** Adjacent RAW ALU→ALU with EX forwarding may be0 bubble (8 cycles); `lw`→use with forwarding still1 bubble/9 cycles because data appears end MEM4 not before dependent EX4; no forwarding `lw`→use 2 bubbles/10 toy cycles. Bubble is a clock slot, not a new architectural instruction. Real bypass/register file phases differ by CPU.
- **teacherExpectedAnswer (gated):** Adjacent RAW ALU→ALU with EX forwarding may be0 bubble (8 cycles); `lw`→use with forwarding still1 bubble/9 cycles because data appears end MEM4 not before dependent EX4; no forwarding `lw`→use 2 bubbles/10 toy cycles. Bubble is a clock slot, not a new architectural instruction. Real bypass/register file phases differ by CPU.
- **correctIncorrectCriteria:** Must select both ALU producer and LW producer and toggle forwarding, explain why load-use waits after MEM even if forwarding enabled, nonforward 2-bubble assumption explicitly on screen.
- **misconceptions:** [m1] 포워딩 회로를 켜면 모든 종류의 RAW 의존성이 0클록으로 사라져요. / [m2] 메모리에서 값이 나오기 전에도 다음 ADD가 정답을 계산하도록 과거 값으로 실행해도 돼요. / [m3] 버블은 실제 프로그램에 새로 넣은 STORE 명령이라서 건수를 늘려야 해요.
- **hints L1/L2/L3 (requested only):** [L1] 로드한 값은 파이프라인에서 어느 단계가 끝날 때 준비되나요? / [L2] ADD의 EX 시작과 LW의 MEM 완료 시점을 비교해요. / [L3] 버블은 빈 단계인가요, 소프트웨어 명령어인가요?
- **misconceptionFeedback/m1 (gated):** “EX에서 계산되는 ALU 결과와 MEM 뒤에 나오는 LOAD 데이터는 준비 시점이 달라요. LOAD-use에는 기다림이 남아요.”
- **misconceptionFeedback/m2 (gated):** “아직 읽지 못한 값을 예전 레지스터 값으로 쓰면 프로그램 결과가 틀려져요. 데이터 준비까지 멈춰야 해요.”
- **misconceptionFeedback/m3 (gated):** “버블은 파이프라인에 넣는 쉬는 클록이에요. 실제 프로그램 명령이 아니므로 레지스터 결과도 바꾸지 않아요.”
- **feedback/correct:** “서로 다른 두 상태에서 실제 명령/클록을 확인했어요. 장난감 가정 밖에서도 항상 그럴지 WHY로 확인해봐요.”
- **displayTextAfterObservation (gated):** 데이터가 준비되는 순간보다 먼저 사용할 수는 없어요.
- **speechTextAfterObservation (gated):** 포워딩 덕분에 계산 결과를 다음 단계로 빠르게 보낼 수 있지만, 로드한 데이터는 메모리 단계가 끝나야 나와요. 그래서 한 클록 버블이 필요할 수 있죠.
### ③ 시니어 설계판단과 실패조건
- **physicsAssumptions:** Load MEM result end cycle4; next EX would start cycle4, forwarding at next EX5, no bypass uses WB write early/ID read late same cycle5. Four instr single issue no further hazards. Actual load/store unit varies.
- **seniorDesignReview:** Scoreboards, bypass networks, register file write-read timing, memory/cache miss latency, OoO can issue independent ops but can't violate RAW.
- **sourceRefs:** [R2][R3]
- **negativePathTest:** student must be able to choose any m1/m2/m3 physical misconception and receive only its own correction *after* grading; correct-first can pass with at least 2 independent controls and WHY. Model's alternate states/negative timing/capacity invariants above become A05 real Chrome/Voice/aria assertions after exact-source A07 PASS.
- **nextHook:** 그럼 CPU가 다음 명령 주소를 잘못 예측해 두 개를 먼저 실행했다면요?

## 17-S04 · `cpu-branch-speculation-flush` · 분기 예측이 틀리면 이미 가져온 명령은 어떻게 되나요?
### ① 먼저 예측하고 직접 움직이기
- **sceneId:** `cpu-branch-speculation-flush`
- **learningGoal:** Count toy misprediction flushed younger instructions versus architecturally committed results, branch EX resolve recovery.
- **priorKnowledge:** 17-S02 stage overlap, 17-S01 PC, 13 cycle conversion
- **storyHook:** CPU가 '아마 오른쪽 길!' 하고 먼저 뛰었는데 왼쪽이 정답이라면?
- **question:** CPU가 '아마 오른쪽 길!' 하고 먼저 뛰었는데 왼쪽이 정답이라면?
- **predictionPrompt (learner-only):** 조건 분기가 실제 실행할 방향과 예측한 방향이 다를 때 뒤의 두 명령 결과도 남을지 예상해 보세요.
- **displayTextBeforePrediction:** 틀린 길로 먼저 뛰면 어떤 일을 취소해야 할까요?
- **speechTextBeforePrediction:** 분기 방향 예측과 실제 비교 결과를 서로 다른 스위치로 움직여봐요. 정답 경로를 가린 채 예측해 봐요.
- **learnerAction:** Choose x1/x2 equal|different to control `beq x1,x2,TARGET` taken vs fall-through; choose predictor taken|notTaken. Animate branch IF1 ID2 EX3 resolving at EX end, younger wrong-path IF at cycle2/3, flush exactly two speculative tokens when mispredicted; commit only correct architectural path. Independently set 2|4 mispredictions in synthetic base 20-cycle job and compute two-cycle penalty each.
- **modelInputs:** Toy branch resolves EX cycle3; two younger wrong-path instructions may occupy IF/ID and must be squashed, per mispredicted branch penalty exactly2cycles under toy control. Base work20 cycles unrelated hypothetical, missCount2|4, elapsed=20+2*missCount =24|28 toy cycles, no additional cache/data stalls; branch x1==x2 taken else not, PC target aligned and valid. No delay slot or real predictor algorithm.
### ② 교사용 관찰·정답 — 학생 예측 전 비공개
- **expectedObservation (teacher-only):** Correct prediction no flush and younger work correct; `beq` actual taken with predict notTaken yields exactly two younger speculative instructions flushed, **no wrong-path state committed**; 2 mispredictions add4cycles to base20=>24, 4 add8=>28 in the illustrative penalty formula. Real branch depth and flush cost are CPU-specific.
- **teacherExpectedAnswer (gated):** Correct prediction no flush and younger work correct; `beq` actual taken with predict notTaken yields exactly two younger speculative instructions flushed, **no wrong-path state committed**; 2 mispredictions add4cycles to base20=>24, 4 add8=>28 in the illustrative penalty formula. Real branch depth and flush cost are CPU-specific.
- **correctIncorrectCriteria:** Actively try right and wrong prediction for both branch inputs, identify count of flushed younger instructions and no wrong register update, calculate 24/28 with independent missCount switch and toy penalty.
- **misconceptions:** [m1] 예측에 실패해도 미리 실행한 잘못된 명령의 값은 레지스터에 그대로 확정 저장해요. / [m2] 분기 예측 실패 페널티가 모든 실제 RISC-V CPU에서 정확히 2클록이에요. / [m3] 예측을 바꿔도 프로그램이 계산해야 하는 최종 결과가 달라지는 것이 정상이에요.
- **hints L1/L2/L3 (requested only):** [L1] 아직 확정(commit)되지 않은 추측 명령은 취소할 수 있을까요? / [L2] 분기 판단이 EX 끝에서 나온다는 조건을 확인해 봐요. / [L3] 예측은 속도만 바꾸는지 프로그램의 의미도 바꾸는지 생각해요.
- **misconceptionFeedback/m1 (gated):** “틀린 경로에서 가져온 어린 명령은 flush하고 아키텍처 상태에 확정하면 안 돼요.”
- **misconceptionFeedback/m2 (gated):** “2클록은 이 5단계 장난감의 EX 분기 결정을 가정한 값이에요. 실제 파이프라인은 다를 수 있어요.”
- **misconceptionFeedback/m3 (gated):** “정확한 CPU는 예측 실패 뒤에도 올바른 경로로 돌아가 동일한 프로그램 의미를 유지해야 해요.”
- **feedback/correct:** “서로 다른 두 상태에서 실제 명령/클록을 확인했어요. 장난감 가정 밖에서도 항상 그럴지 WHY로 확인해봐요.”
- **displayTextAfterObservation (gated):** 틀린 추측 명령은 취소돼야 하고, 속도 페널티는 설계에 따라 달라요.
- **speechTextAfterObservation (gated):** 분기 예측 실패는 먼저 가져온 틀린 경로의 명령을 버리고 올바른 명령부터 다시 진행하게 해요. 수업에선 두 클록 손실로 가정하지만 실제 CPU마다 다르죠.
### ③ 시니어 설계판단과 실패조건
- **physicsAssumptions:** Explicit toy EX-end branch resolution, two wrong-path younger instructions, flush with no architectural side effects, penalty2 per misprediction, no branch predictor implementation claim, no speculative cache side-channel teaching.
- **seniorDesignReview:** Prediction correctness vs ISA semantics, reorder buffer commit/OoO retirement, speculative cache timing/side channels out of scope for numeric results, front-end penalties varying by microarchitecture.
- **sourceRefs:** [R1][R3]
- **negativePathTest:** student must be able to choose any m1/m2/m3 physical misconception and receive only its own correction *after* grading; correct-first can pass with at least 2 independent controls and WHY. Model's alternate states/negative timing/capacity invariants above become A05 real Chrome/Voice/aria assertions after exact-source A07 PASS.
- **nextHook:** 분기를 잘 맞혀도 캐시에서 자료가 늦게 오면 CPU 전체는 얼마큼 멈출까요?

## 17-S05 · `cpu-cache-miss-cpi` · CPU가 2GHz인데 왜 항상 초당 20억 명령을 끝내진 못할까요?
### ① 먼저 예측하고 직접 움직이기
- **sceneId:** `cpu-cache-miss-cpi`
- **learningGoal:** Compute expected CPI and total cycles from load fraction, conditional miss rate and incremental penalty; do not claim throughput from clock alone or guaranteed OoO overlap.
- **priorKnowledge:** 13 probability and fractions, 05 SRAM L1 caches, 17-S03 RAW stalls
- **storyHook:** 2GHz CPU는 1초에 20억 번 박자를 세는데, 그 박자마다 명령 하나가 꼭 끝날까요?
- **question:** 2GHz CPU는 1초에 20억 번 박자를 세는데, 그 박자마다 명령 하나가 꼭 끝날까요?
- **predictionPrompt (learner-only):** 100개 명령 중 30개가 로드이고 그중 일부가 캐시 미스라면 2GHz에서 작업이 기본 100클록보다 얼마나 늦어질지 예상해 보세요.
- **displayTextBeforePrediction:** GHz와 초당 명령 완료 수는 같은 뜻일까요?
- **speechTextBeforePrediction:** CPU 클록과 로드 수, 캐시 미스 비율을 따로 설정해 봐요. 처리량을 예측하기 전 작은 타임라인을 확인해요.
- **learnerAction:** Set toy 100 retired scalar instructions, loadFraction0.3 and conditional missRate=0|0.1 (toggle optional .05 **expected only**), extraMissPenalty=20 cycles, baseCPI1, CPUclock=2GHz. Histogram 30 loads and 3 misses in .1 branch, compute 100+3×20 and CPI; compare zero misses and .05 **expected** 1.5 misses. Select outOfOrderOverlap=off|possible qualitative; UI refuses to infer definite OoO speedup without ROB/MSHR/independent ops capacity.
- **modelInputs:** base instructions N100 and baseCPI1, loadFraction.30 ⇒30 loads, perLoadMissProb=0|.05|.10, incrementalMissPenalty20 cycles (above baseline hit service), no memory/branch overlap in serial toy, expectedMisses=N*.30*p, expectedCycles=N*(1+(.30*p*20)), expectedCPI=1+0.30*p*20. For p=.10 expectedMisses3, cycles160, CPI1.6, clock2GHz period0.5ns, total time80ns toy. For p=.05 expectedMisses1.5 & expectedCycles130 CPI1.3; noninteger expectation across hypothetical repeated trials, not observed 1.5 miss in one execution.
### ② 교사용 관찰·정답 — 학생 예측 전 비공개
- **expectedObservation (teacher-only):** At load fraction30%, miss-per-load10%, **3 misses among30 loads** illustrative, 60 stall cycles beyond baseline100 =>160 total, CPI1.6; clock2GHz period0.5ns =>80ns in toy. At 0% misses CPI1 and 50ns, at 5% **expected** CPI1.3/130 cycles/65ns. GHz is clock ticks, not IPC guarantee; real OOO might overlap some independent misses but true RAW and resource limits remain.
- **teacherExpectedAnswer (gated):** At load fraction30%, miss-per-load10%, **3 misses among30 loads** illustrative, 60 stall cycles beyond baseline100 =>160 total, CPI1.6; clock2GHz period0.5ns =>80ns in toy. At 0% misses CPI1 and 50ns, at 5% **expected** CPI1.3/130 cycles/65ns. GHz is clock ticks, not IPC guarantee; real OOO might overlap some independent misses but true RAW and resource limits remain.
- **correctIncorrectCriteria:** Compute CPI1 vs1.6 from two physical states, divide load% and miss-per-load%, explain 3 misses vs 1.5 expected, 2GHz clock/0.5ns conversion and 80ns output, reject universal OOO no-miss penalty.
- **misconceptions:** [m1] 2GHz이면 어떤 프로그램도 항상 매 클록 정확히 명령 하나를 완료해요. / [m2] 캐시 미스10%는 전체100명령에서10개가 미스라는 뜻이에요. 로드 비율은 상관없어요. / [m3] Out-of-Order를 켜면 DRAM 값을 아직 못 받아도 모든 미스 지연이 0이 돼요.
- **hints L1/L2/L3 (requested only):** [L1] GHz는 클록 주파수지 명령완료 비율일까요? / [L2] 전체 명령 중 로드 몇 개와 그 로드 중 미스 몇 개인지 순서대로 곱해요. / [L3] OOO는 독립 작업을 겹칠 수 있지만 RAW 데이터 의존도 사라지나요?
- **misconceptionFeedback/m1 (gated):** “클록은 회로 박자일 뿐이에요. 캐시 대기나 분기 실패가 있으면 한 명령당 평균 클록인 CPI가 늘 수 있어요.”
- **misconceptionFeedback/m2 (gated):** “30개 로드 중10%가 미스이므로 이 모형에선 미스3개예요. 전체100명령의10%와 달라요.”
- **misconceptionFeedback/m3 (gated):** “OOO는 독립 명령을 먼저 실행할 수 있지만 실제 필요한 메모리 데이터 자체를 순간이동시키지 못해요.”
- **feedback/correct:** “서로 다른 두 상태에서 실제 명령/클록을 확인했어요. 장난감 가정 밖에서도 항상 그럴지 WHY로 확인해봐요.”
- **displayTextAfterObservation (gated):** CPI가 달라지면 같은 GHz에서도 실제 작업시간이 달라져요.
- **speechTextAfterObservation (gated):** 이상적으로는 한 클록마다 하나씩 끝내지만 미스가 반복되면 CPU가 기다리는 시간이 더해져요. 클록과 명령당 평균 클록을 모두 확인해야 하죠.
### ③ 시니어 설계판단과 실패조건
- **physicsAssumptions:** Single-issue ideal base1 CPI, 30 loads/100 instructions, misses only on loads and serialized20 extra cycles per miss, no overlap, 2GHz constant toy frequency. Fractional expected misses in p=.05 are probabilistic average, not single trace. Modern OoO, SMT, branch and cache levels may change values.
- **seniorDesignReview:** Cycle accounting vs wall time, CPI vs IPC, miss-rate denominators, miss latency and miss-level parallelism/OOO dependencies, speculative execution and bandwidth vs latency different.
- **sourceRefs:** [R2][R3][R4]
- **negativePathTest:** student must be able to choose any m1/m2/m3 physical misconception and receive only its own correction *after* grading; correct-first can pass with at least 2 independent controls and WHY. Model's alternate states/negative timing/capacity invariants above become A05 real Chrome/Voice/aria assertions after exact-source A07 PASS.
- **nextHook:** 이제 CPU가 읽어온 데이터를 07 서버 메모리와 29 PCIe/NIC, 03 GPU로 넘길 때 병목을 찾아보세요.

## A07 exact source QA / future A05 scene acceptance matrix
| Step/Scene | Expected critical result | Wrong-case/assumption that MUST NOT silently pass |
|---|---|---|
| 17-S01 ISA & x0 | x1=5, M[0x100]=5, lw x3=5, add x4=10, x0 hardzero; alternate lw-before-sw x3=9; plain RV32I PC+4 | No ALU direct-to-memory magic or future-store read, ISA not fixed pipeline |
| 17-S02 five-stage overlap | four independent 5-stage instructions first WB5, last WB8 vs nonoverlapped20; speedup2.5, first latency5 | no claims first instr latency 1 or four ops finish cycle4 |
| 17-S03 load-use bypass | ALU forward no bubble ideal8; LW load-use bypass one bubble9; no forwarding two bubbles10 under stated same-cycle WB/ID | no stale data accepted, no universal zero-stall/forwarding speedup |
| 17-S04 wrong branch | EX-end mispredict flush two younger speculative instructions; base20 +2×(2 or4 misses)=24 or28 | wrong-path register commit forbidden, real RISC-V pipeline not mandated |
| 17-S05 cache CPI | N100, 30 loads, miss p=.1⇒3 misses×20 extra +100⇒160 cycles CPI1.6, clock2GHz=0.5ns =>80ns; p=.05 expected1.5 misses CPI1.3 | cache miss fraction denominator must be loads not all instructions, p=.05 1.5 expectation not an observed half-miss, OOO not zero-latency guarantee |
- Reviewer P1: accurate RISC-V ISA vs pedagogical pipeline model; pre Voice does not reveal computed numeric answer/flush, correct without forced wrong; negative m1/2/3 15 cause-specific answers, teacher after isolation. A05 scene AND A02 app separate.
## Sources · checkedAt=2026-10-17
[R1] RISC-V International official https://docs.riscv.org/reference/isa/unpriv/rv32.html (high: RV32I/x0/PC/load-store).
[R2] gem5 official https://www.gem5.org/documentation/general_docs/cpu_models/SimpleCPU (high for timing and stall, not five-stage toy).
[R3] gem5 official https://www.gem5.org/documentation/general_docs/cpu_models/O3CPU (high: rename/commit/OoO).
[R4] gem5 official https://www.gem5.org/documentation/learning_gem5/part1/cache_config/ (high: Simple/Minor/O3 distinctions).
[R5] Invented five-stage and hazard/CPI inputs deliberately toy; higher confidence in arithmetic than any real product timing.
