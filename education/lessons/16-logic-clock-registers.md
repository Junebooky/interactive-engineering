# 16 · NOT만으로 CPU를 만들 수 있을까? CMOS 논리에서 클록의 약속까지
> 2026-10-17 · **A06_REWORK_AFTER_A07_MAJORS / A07_RECHECK_PENDING**, 예상 40–55분 (교육기획 추정; 실제 사용자 실측 없음). 실제 A05 scene 작성/브라우저/학생 이해도 시험 **미실행**. A07가 현재 11·12·14·03/04/05를 독립 검토하는 동안 A06가 별도 교육 결손인 논리·클록을 스스로 선택해 작성. A07 추가 BLOCKER/MAJOR 해결 및 `EDU_QA_PASS` 뒤에만 A05 신규 제작 STORY_READY 인계.
> **선수:** 01 CMOS NOT, 12 전압/전류·단위; 14 MOS 전계·표면 반전 (A07 SOURCE PASS, 별도 앱 QA 미실시). **후속:** 05 SRAM feedback/CPU cache, 17 CPU ISA/pipeline; 20 EDA/STA, 19 DRAM reliability as elective. [MIT Ch3–6/TI 심화 근거·검산·한계](../deep-dives/16-digital-logic-clock-timing.md). 첫 화면에 CPU 파이프라인·DDR 타이밍·확률 곡선 등 낯선 단어 한꺼번에 보여주지 않음.
> **학습 동기:** 이미 nMOS/pMOS 인버터를 만들었어요. 인버터 하나도 0과 1을 뒤집는 계산을 해요. 다만 두 입력을 조합하거나 이전 값을 기억하는 기능은 이것만으로 부족하죠. 논리게이트를 연결하고, 과거를 붙잡는 래치를 만들고, 정확히 언제 저장할지 클록과 시간을 정한 뒤 SRAM/CPU로 갑니다. 진입은 쉬워도 마지막 설계는 현업 STA/CDC까지 확장합니다.

## 전 레슨 공통 A06↔A05 교육 계약
1. **Before prediction**: 시각 객체 이름/계층은 보이되 정답 출력·상태·숫자·전류흐름/다음 원리 설명/Voice/aria는 가림. 레슨 `storyHook`/neutral `question`/BeforeSpeech만; AFTER 숫자는 prediction+조작+관찰 후 공개.
2. **Correct isn't button visited**: 양쪽 입력을 독립 조작해 예측→관찰한 다음 **WHY를 설명할 수 있으면 통과**. 학생이 일부러 오답을 선택해야만 pass하는 조건은 금지; 오답을 선택한 경우에만 원인별 교정 피드백을 제공.
3. **Selected mistake keyed**: 각 Step 3 misconceptions와 3 level hints가 어느 오답에서 나왔는지 연결. Hints 초반에 바로 해설·최종 결과 말하지 않음. UI 한두 문장, 한국어 Voice 자연 존댓말.
4. **Three depths**: 첫60초 beginner→ 중급 계산·진리표/측정→ 시니어 failure mode·실리콘 timing corner. `tPD`/ns/full circuit derivation 뒤로 숨기기; 실제 데이터시트 제품값과 toy 수치 구별.
5. Scene props tentative `{ sceneId, chosenPrediction, userValues, actionHistory, observation, selectedMisconception, hintLevel, displayText, speechText }`, exact TS type A05/A02 agreed. A06 neither writes SVG/app engine nor claims real browser QA.

## 16-S01 · `logic-nand-nor-truth-table` · 한 번에 두 입력을 받으면 답이 어떻게 나올까요?
### ① Beginner — 예상→조작, 답 선공개 금지
- **sceneId:** `logic-nand-nor-truth-table`
- **learningGoal:** CMOS NAND/NOR의 진리표 4×2 조합과 pMOS/nMOS 보완적 직렬·병렬 네트워크를 구분하고 NAND의 universal gate 성질 발견
- **priorKnowledge:** 01-S04 CMOS NOT, 12 기본 전압/논리 0·1 카드
- **storyHook:** NOT 게이트 하나는 0과 1을 바꿀 뿐인데, 두 입력으로 계산할 방법이 있을까요?
- **question:** 입력 A와 B를 따로 바꿨을 때, 출력이 0이 되는 조합을 어떻게 결정할까요?
- **predictionPrompt (learner-visible; answer hidden until submitted):** 입력 (A,B)=(1,1)과 (0,1)에서 NAND/NOR 출력이 각각 어떤 값일지 표로 골라 보세요. 정답은 직접 조작한 뒤 확인해요.
- **learnerAction:** NAND/NOR gate selector, A and B independent 0/1 toggles, invisible full truth table until predictions, afterwards pMOS pullup and nMOS pulldown network rewire to series/parallel and show current source/sink paths
- **modelInputs:** gate∈{NAND,NOR},A,B∈{0,1},networkChoice=unselected/series/parallel for PUN/PDN independent, VDD normalized logic, no real voltages
- **displayTextBeforePrediction:** “두 입력의 조합을 바꾸면 출력은 어떻게 변할까요?”
- **speechTextBeforePrediction:** “A와 B 중 어떤 입력이 출력에 영향을 주는지 먼저 찍어보세요. 아직 전체 정답표는 열지 않을게요.”
### ② Intermediate — 결과 비교와 원인별 피드백
- **expectedObservation:** NAND: 00→1, 01→1,10→1,11→0, nMOS series pMOS parallel. NOR:00→1,01→0,10→0,11→0, nMOS parallel pMOS series. NAND(A,A)=NOT(A) establishes universal building possibility; AND/OR need additional NAND stages. Logic only after settling, real delay/glitch possible
- **teacherExpectedAnswer (gated, teacher-only until observation):** 강사용: NAND (00,01,10,11)=(1,1,1,0); NOR=(1,0,0,0). NAND pulldown=nMOS series, pullup=pMOS parallel; NOR opposite. Wrong topology must be **possible** to select but **not required to pass**.
- **correctIncorrectCriteria:** All four A/B pairs visited for both gates, student matches NAND/NOR outputs and CMOS pullup/pulldown topology and explains one WHY. **No intentionally wrong choice required**; if incorrect topology chosen, show physically targeted feedback then allow correction. No correct network pre-labeled.
- **misconceptions:** [m1] nMOS 하나가 ON이면 NAND 출력은 반드시 0이다 / [m2] NAND 회로도는 nMOS 병렬·pMOS 직렬이다 / [m3] NAND(NAND(A,B),C)는 NAND(A,B,C)와 언제나 똑같다
- **hints L1/L2/L3:** [1] 직렬인 길은 두 스위치가 모두 닫혀야 이어져요. / [2] CMOS NAND에서 출력이 GND에 붙으려면 A/B nMOS가 모두 ON이어야 할까요? / [3] 한 번 더 NAND 하면 입력을 뒤집는 NOT도 만들 수 있어요.
- **feedback/incorrect per cause:** [m1] “nMOS 두 소자가 직렬이면 둘 다 ON이어야 GND로 연결돼요.” / [m2] “NAND pulldown=nMOS 직렬, pullup=pMOS 병렬이에요. NOR은 반대죠.” / [m3] “NAND는 AND가 아니라 NOT(AND)이므로 여러 단계로 묶을 때 괄호를 유지해야 해요.”
- **feedback/correct:** “현재 조작 상태와 출력이 연결됐어요. 다음으로 왜 그런지 말해보세요.”
- **displayTextAfterObservation:** “NAND와 NOR은 두 입력의 0·1을 서로 다르게 조합해요.”
- **speechTextAfterObservation:** “NAND는 두 입력이 모두 1일 때만 0이고, NOR은 두 입력이 모두 0일 때만 1이에요. CMOS 회로에서는 위아래 전류길도 서로 보완하도록 구성하죠.”
### ③ Senior — 물리 가정, 검산, 실패 모드
- **physicsAssumptions:** ideal complementary static CMOS valid input 0/1 and settled output. Invalid analog input/glitch, exact switching delays, leakage/current, PVT and fanout not modeled. pMOS ON when logic input LOW relative source; 'current flow' visualization only active path, not infinite current
- **seniorDesignReview:** Check static contention under intermediate analog input and dead time; NAND pMOS parallel/nMOS serial; timing tCD/tPD and NAND multi-input nonassociativity as counterexample
- **sourceRefs:** [DIG-A][DIG-B]
- **teachBack:** Beginner=지금 실험의 WHY 한 문장 / Intermediate=실제로 둘 이상의 상태를 바꿔 계산·진리표 설명 / Senior=반례·측정/검증 계획·다른 기술적 대안 최소 하나.
- **nextHook:** 이 회로는 지금 입력값만 읽네요. 어제 입력을 오늘까지 기억하게 만들 수 있을까요?

## 16-S02 · `combinational-vs-sequential-memory` · 입력이 같아도 출력이 다를 수 있을까요?
### ① Beginner — 예상→조작, 답 선공개 금지
- **sceneId:** `combinational-vs-sequential-memory`
- **learningGoal:** 현재 입력만 보는 조합논리와 피드백 Q를 보존하는 순차논리/level sensitive latch가 다름을 원리와 출력 이력으로 구분
- **priorKnowledge:** 16-S01 NAND truth table, 01-S04 NOT, SRAM 6T는 이후 05
- **storyHook:** 입력을 0으로 똑같이 맞췄는데 회로가 다른 대답을 내놓는다면 어디를 봐야 할까요?
- **question:** 입력 D가 지금 0이면 저장소의 Q도 언제나 0일까요?
- **predictionPrompt (learner-visible; answer hidden until submitted):** 현재 D=0이지만 이전 Q는 다른 두 래치에서, G=0일 때 Q가 같을지 예상해 보세요. NAND 조합회로의 현재 A/B 출력도 별도로 예상해 보세요.
- **learnerAction:** Side-by-side pure combinational NAND A/B, feedback latch D/G/Q. Allow starting storedQ=0 or1 via explicit initialize, toggle G1 and D1 then G0 and D0; show two runs with identical current D but different previous stored Q only after observation
- **modelInputs:** mode∈{combinational,latch}; D∈{0,1}; gateEnable G∈{0,1}; initialQ explicitly initialized 0 or1; powered∈{true,false} optional senior; no asynchronous set/reset
- **displayTextBeforePrediction:** “현재 입력을 같게 맞추면 과거 상태도 상관없을까요?”
- **speechTextBeforePrediction:** “회로 두 개에 같은 입력을 넣어볼게요. 직전에 어떤 일이 있었는지도 기억해 두세요.”
### ② Intermediate — 결과 비교와 원인별 피드백
- **expectedObservation:** NAND depends on current A/B only (settled). Transparent positive-level latch follows D when G=1 (after delay), holds previous sampled Q when G=0. Example Q0→G1/D1→Q1→G0→D0 yields Q1 despite D0. If power removed ordinary CMOS latch loses reliable bit, cannot guarantee reappearance on power ON without reinit
- **teacherExpectedAnswer (gated, teacher-only until observation):** 강사용: positive-level D latch G=1 Q follows D after delay, G=0 holds previous Q even if current D changes. Pure combinational NAND depends only on current A/B after settling; power-off storage invalid.
- **correctIncorrectCriteria:** Student creates two cases with same current D=0 but Q=0 vsQ=1 due to different gated histories, distinguishes state memory from combinational; tests negative scenario G=0,D changes and Q remains same
- **misconceptions:** [m1] 조합논리 출력은 어제 넣었던 입력을 영원히 기억한다 / [m2] G=0으로 닫은 latch라도 D를 0으로 바꾸면 Q도 즉시 0으로 바뀐다 / [m3] SRAM/CMOS 래치는 전원이 꺼졌다 켜져도 전에 쓴 bit를 반드시 기억한다
- **hints L1/L2/L3:** [1] 출력에 '지난 Q'가 경로로 되돌아오나요? / [2] G가 닫힌 순간에는 외부 D와 내부 저장 노드가 이어져 있을까요? / [3] 피드백은 전력이 공급될 때만 안정적으로 두 상태 중 하나를 유지하죠.
- **feedback/incorrect per cause:** [m1] “조합 회로는 현재 입력에 따른 함수를 계산해요. 기억회로에는 상태가 있어야 해요.” / [m2] “닫힌 latch는 D 변화가 Q로 전달되지 않아요. 이전 Q를 보관하죠.” / [m3] “보통 CMOS latch/SRAM은 휘발성이어서 재전원 시 예전 Q를 보증하지 않아요.”
- **feedback/correct:** “현재 조작 상태와 출력이 연결됐어요. 다음으로 왜 그런지 말해보세요.”
- **displayTextAfterObservation:** “저장된 값 Q가 다르면 같은 현재 입력에도 결과가 달라져요.”
- **speechTextAfterObservation:** “조합논리는 지금 들어온 입력으로 답을 정하지만, 래치는 게이트를 닫으면 이전 상태를 품고 있어요. 전원이 꺼지면 이 기억을 계속 보장할 수는 없죠.”
### ③ Senior — 물리 가정, 검산, 실패 모드
- **physicsAssumptions:** ideal level-sensitive positive latch, explicit initialization Q and no power disturbance. Feedback circuit 'bistable' with propagation delays; for G=1 followed by direct feedback path risk race-around, therefore no free-running feedback loop in toy. SRAM bitcell bitline write-disturb differs from D latch
- **seniorDesignReview:** State-equation and timing distinction; stable two-state positive feedback vs glitch feedback combinational loop; power-cycle invalidated storage flags, source-level SRAM05 physics QA alignment
- **sourceRefs:** [DIG-C][DIG-D][DIG-E]
- **teachBack:** Beginner=지금 실험의 WHY 한 문장 / Intermediate=실제로 둘 이상의 상태를 바꿔 계산·진리표 설명 / Senior=반례·측정/검증 계획·다른 기술적 대안 최소 하나.
- **nextHook:** 래치는 게이트가 열린 동안 계속 따라오죠. 정확한 '한 순간'에만 기억하려면 어떻게 할까요?

## 16-S03 · `d-latch-vs-d-flip-flop` · 클록이 켜진 동안 다 읽을까요, 딱 한 번 읽을까요?
### ① Beginner — 예상→조작, 답 선공개 금지
- **sceneId:** `d-latch-vs-d-flip-flop`
- **learningGoal:** level sensitive transparent D latch vs rising-edge D flip-flop을 시각적 timeline과 과거CLK 비교로 구분, 클록 에지 발생 여부를 독립 증명
- **priorKnowledge:** 16-S02 gated latch/feedback, rising/falling edges 입문
- **storyHook:** 클록이 계속 1인 동안 입력이 두 번 바뀌었어요. 저장 비트도 두 번 바뀌었을까요?
- **question:** 클록 HIGH를 그대로 유지하면 래치와 플립플롭의 Q는 어떤 차이를 보일까요?
- **predictionPrompt (learner-visible; answer hidden until submitted):** 클록이 HIGH로 유지되는 동안 D가 두 번 변하면 양의 레벨 D 래치와 상승에지형 D 플립플롭의 Q가 각각 어떻게 움직일지, 실제 클록 상승 사건이 언제인지 예상해 보세요.
- **learnerAction:** Timeline time 0..10ns toy event control: G/CLK initial0, D0, at t2 rising clock (D0), at t3 D1, at t4 D0, at t5 falling clock; later t6 D1, t8 rising clock (D1). Latch output follows D after delay during 2..5 high, FF captures at t2=0 then t8=1. Allow events independently modify; Q after t2 cannot be fixed deterministic if input changed inside setup/hold hazard—S04 handles
- **modelInputs:** logicMode∈{positive-level D latch,positive-edge DFF}, initial Q0, events [CLK=0,D=0],[t2 CLK rise],[t3 D1],[t4 D0],[t5 CLK fall],[t6 D1],[t8 CLK rise]. Event step scheduling educational, setup/hold satisfied except in advanced separate step
- **displayTextBeforePrediction:** “HIGH를 유지한 클록과 순간적인 상승에지는 같을까요?”
- **speechTextBeforePrediction:** “클록을 계속 켠 상태에서 입력을 두 번 바꿔보세요. 두 종류의 저장 회로가 똑같이 움직일지 먼저 예상해 봐요.”
### ② Intermediate — 결과 비교와 원인별 피드백
- **expectedObservation:** G HIGH: latch transparent (after finite settle), sees D=1 then0 between t3,t4. DFF Q remains 0 throughout t3,t4; at t8 positive edge samples D=1 so Q becomes1 after clock-to-Q delay. Merely setting CLK=1 in an initial snapshot is not a new rising edge. Example chip may have asynchronous preset/reset affecting output anytime if enabled—excluded
- **teacherExpectedAnswer (gated, teacher-only until observation):** 강사용: CLK HIGH 구간 D0→1→0이면 latch Q follows after propagation, rising-edge DFF holds Q until next 0→1. Given events t2 CLK↑ D0, t3 D1, t4 D0, t5 CLK↓, t6 D1, t8 CLK↑: DFF captures 0 at t2, 1 at t8 (after clock-to-Q delay). Initial CLK=1 alone not a rising event; async reset exception.
- **correctIncorrectCriteria:** Learner predicts outputs at t3 and t8 for two circuits, manipulates both high-window D and edge, explains why latch and FF differ and notes no 100% memory when poweroff
- **misconceptions:** [m1] 클록이 HIGH인 동안 D flip-flop은 latch처럼 모든 입력 변화에 그대로 반응한다 / [m2] 게이트가 닫힌 D latch도 새 클록 상승 에지를 기다린다 / [m3] 모든 플립플롭은 전원 인가만 하면 Q=0으로 자동 초기화되고 reset 핀이 항상 없다
- **hints L1/L2/L3:** [1] 레벨 민감(level-sensitive)은 한 시간 구간을 들여다봐요. / [2] 에지(edge)는 0→1로 바뀌는 바로 그 사건이에요. / [3] 어떤 데이터시트에는 비동기 프리셋/클리어가 적혀 있어요.
- **feedback/incorrect per cause:** [m1] “상승에지 DFF는 선택된 클록 이벤트에서만 D를 받아요. HIGH를 유지하는 동안은 다른 경우죠.” / [m2] “양의 레벨 D latch는 G=1 동안 D를 따라갈 수 있어요. rising edge를 기다리는 장치가 아니에요.” / [m3] “초기 Q와 async reset 존재는 회로 설계/제품에 따라 달라요. 보편적인 Q0 초기값이 아닙니다.”
- **feedback/correct:** “현재 조작 상태와 출력이 연결됐어요. 다음으로 왜 그런지 말해보세요.”
- **displayTextAfterObservation:** “래치는 열려 있는 동안, D 플립플롭은 상승에지에서 샘플해요.”
- **speechTextAfterObservation:** “레벨 래치는 열려 있는 동안 입력을 따라요. 상승에지형 플립플롭은 클록이 0에서 1로 변하는 순간의 값을 샘플링하고 다음 에지까지 보관하죠.”
### ③ Senior — 물리 가정, 검산, 실패 모드
- **physicsAssumptions:** idealized digital event model; real Q appears after finite tCQ and latch after tPD, transition window and setup/hold exceptions in S04. TI SN74HC74 has async clear/preset and is a specific product example not any DFF
- **seniorDesignReview:** Rising-edge event detection previousCLK=0,currentCLK=1; race-around and master/slave anti-overlap details; clock gating and async control exception, waveform correct both D orders
- **sourceRefs:** [DIG-C][DIG-E]
- **teachBack:** Beginner=지금 실험의 WHY 한 문장 / Intermediate=실제로 둘 이상의 상태를 바꿔 계산·진리표 설명 / Senior=반례·측정/검증 계획·다른 기술적 대안 최소 하나.
- **nextHook:** 그럼 입력이 상승에지 바로 근처에서 바뀌면 플립플롭은 어떤 값을 저장할까요?

## 16-S04 · `setup-hold-metastability-clock` · 클록이 너무 늦거나 데이터가 너무 빨라지면?
### ① Beginner — 예상→조작, 답 선공개 금지
- **sceneId:** `setup-hold-metastability-clock`
- **learningGoal:** setup/hold, max propagation vs min contamination delay, one-cycle clock timing and metastability risk, hold-buffer tradeoff를 별개로 추론
- **priorKnowledge:** 16-S03 DFF rising edge, 12 units ns/MHz bridge cards, 고급 정량은 선택
- **storyHook:** 클록을 느리게 만들었는데도 어떤 비트는 틀릴 수 있다면, 무엇이 문제일까요?
- **question:** 회로가 너무 빨리 바뀌는 것도 오류를 만들까요? 클록 주기만 늘리면 다 고쳐질까요?
- **predictionPrompt (learner-visible; answer hidden until submitted):** 버퍼를 넣지 않고 클록 T=8ns인 경우와, 버퍼를 넣은 T=8/9ns인 경우에 setup/hold 각각 PASS/FAIL을 먼저 골라보세요. 입력이 클록 근처에서 바뀔 때 Q의 결과가 확정인지 위험인지 선택해 보세요.
- **learnerAction:** 1) 'setup' max path bar 1.2+5+1.3 vs T=8; 2) 'hold' min path bar0.2+0.3 vs0.8; 3) add buffer path min+0.4/max+0.6, try T8→9ns; 4) D transition near clock edge and 2-FF synchronizer optional relative-risk chart (numeric absolute fail rates not shown)
- **modelInputs:** toy tCQmax1.2ns,tlogicPDmax5ns,setup1.3ns,tCQmin0.2ns,tlogicCDmin0.3ns,hold0.8ns,delayBuffer min0.4max0.6ns, T=8/9ns; zero skew/jitter/uncertainty; asynchronous dataChangeOffset toy ±0.5ns to hazard band, high/low value unspecified
- **displayTextBeforePrediction:** “느린 클록만으로 타이밍 문제를 모두 해결할까요?”
- **speechTextBeforePrediction:** “데이터가 너무 늦게 오는 경우와 너무 빨리 바뀌는 경우를 따로 놓고, 클록 주기를 바꿔 실험해 볼까요?”
### ② Intermediate — 결과 비교와 원인별 피드백
- **expectedObservation:** initial setup min7.5ns <=8 pass margin0.5; initial hold earliest0.5ns<0.8 violates0.3ns. With buffer hold0.9>=0.8 pass0.1 but setup min8.1 >8 fail0.1; T9 yields setup margin0.9ns, hold0.1. At input edge violation output not deterministic; resolving metastability probability decreases with extra settling time but never absolute zero. Clock stretching alone cannot repair hold in zero-skew toy
- **teacherExpectedAnswer (gated, teacher-only until observation):** 강사용: toy T8 initial setup required7.5ns PASS margin0.5, hold arrival0.5ns versus0.8ns FAIL0.3; buffer min+0.4/max+0.6 gives hold arrival0.9 PASS0.1 but setup requires8.1ns, T8 FAIL0.1; T9 setup PASS0.9 and hold PASS0.1. Setup/hold violation means risk/unknown, not guaranteed Q=0/1.
- **correctIncorrectCriteria:** Learner separately diagnoses first setup and hold, chooses delay buffer and longer period in the correct order and reports margins units, chooses 'risk not guaranteed error' for async event; 3 branch misconceptions keyed
- **misconceptions:** [m1] 클록 주기를 무조건 길게 만들면 setup과 hold가 둘 다 자동 해결된다 / [m2] tCD 최소 지연을 tPD 최대 지연과 같은 값으로 계산해도 결과는 동일하다 / [m3] setup/hold를 위반하면 Q는 반드시 0이 되며 2단 동기화기를 쓰면 실패 확률은 정확히 0이다
- **hints L1/L2/L3:** [1] setup은 너무 늦게 오는 데이터, hold는 너무 빨리 바뀌는 데이터 문제예요. / [2] tCQmax+tPDmax+setup과 tCQmin+tCDmin−hold를 각각 계산해 보세요. / [3] 동기화기는 값을 재빨리 결정하도록 기회를 늘리지만 확률 0을 보장하지 않아요.
- **feedback/incorrect per cause:** [m1] “같은 엣지에서 hold는 최단경로 문제라 주기만 늘려서는 고쳐지지 않아요.” / [m2] “tCD는 가장 빨리 변할 시각, tPD는 가장 늦게 안정될 시각이에요.” / [m3] “메타안정성은 가능성·확률 위험이에요. 결정론적 Q=0/1 결과도 100% 보증도 할 수 없어요.”
- **feedback/correct:** “현재 조작 상태와 출력이 연결됐어요. 다음으로 왜 그런지 말해보세요.”
- **displayTextAfterObservation:** “데이터가 너무 빨리 바뀌는 hold 문제는 주기만 늘려도 남아요.”
- **speechTextAfterObservation:** “이 장난감 회로는 처음에 셋업은 통과해도 홀드가 0.3나노초 부족해요. 버퍼를 넣으면 홀드는 고쳐지지만 셋업이 더 빡빡해져요. 주기도 같이 다시 봐야 하죠.”
### ③ Senior — 물리 가정, 검산, 실패 모드
- **physicsAssumptions:** All timing numbers are invented toy in ns, zero clock skew/uncertainty and same-clock domain. Real STA cell arcs, PVT, derating, multi-cycle paths, generated clocks, hold constraints vary. Setup/hold violation illustrates unknown risk, never a forced digital error; 2-stage sync probabilistic and cannot fix multi-bit coherence automatically
- **seniorDesignReview:** Compute setup T≥7.5, hold0.5 vs0.8, after buffer setup8.1 and hold0.9, T9 passes both with margins0.9/0.1; distinguish MTBF/synchronizer risk and no absolute 0 probability; external CDC protocols
- **sourceRefs:** [DIG-A][DIG-C][DIG-D][DIG-E]
- **teachBack:** Beginner=지금 실험의 WHY 한 문장 / Intermediate=실제로 둘 이상의 상태를 바꿔 계산·진리표 설명 / Senior=반례·측정/검증 계획·다른 기술적 대안 최소 하나.
- **nextHook:** 이제 클록으로 저장하고 되먹임으로 유지하는 구조를 05 SRAM 셀과 17 CPU 레지스터·파이프라인에서 찾아봅시다.


## A05 SceneSpec / 테스트 명세 — A07 RECHECK PASS 후에만 최종 인계
| Step | 화면 객체 · learner가 잘못 답할 수 있는 조작 | 정답 회귀/부정경로 테스트 |
|---|---|---|
| 16-S01 | A/B independent toggles→NAND/NOR mode, PUN/PDN series/parallel **선택 가능**, CMOS two-rail current cutaway | NAND [1,1,1,0], NOR [1,0,0,0], wrong p/n arrangement rejected; nested NAND≠3-input NAND |
| 16-S02 | static NAND vs gated feedback latch; `D,G,Q`, explicit reinit/power supply states | same D0 different historical Q; G0 D toggles Q holds; power off bit becomes invalid, power on does **not resurrect** old Q |
| 16-S03 | editable clk/d waveform, latch vs positive-edge DFF; t2/t3/t4/t5/t6/t8 events | latch follows t3/t4 during HIGH, DFF Q doesn't until rising at t8; initialize CLK=1 without 0→1 **not rising edge**, async reset caveat |
| 16-S04 | max/min timing paths and optional buffer, T8/9ns, metastability unknown band | T8 initial setup pass 0.5ns / hold FAIL 0.3ns; buffer add tCD0.4+tPD0.6: at T8 setup FAIL0.1 / hold PASS0.1; at T9 both pass setup0.9/hold0.1ns. Delaying clock alone never repairs simple hold. |
- Negative cases essential. **Do not give A05 pre-matched "correct" gate topology that cannot be wrong**, and don't let students clear a step merely by visiting an icon. A07 G03 review found this failure pattern; guard reused across this new lesson.
- Time axis labels numerical **fiction**; flip-flop within setup/hold edge should display `위험/미정(보장되지 않음)` not guaranteed 0/1 or forced X in real circuit. 2FF is risk reduction **not** guaranteed zero, multi-bit crossing requires protocol.
- A05 assets custom SVG/2.5D, without copying MIT graphics. Keyboard and voice transcript pre/post no answer leak; mobile/320px overflow; color-independent truth table and motion-reduced snapshots. Scientific QA of actual scene independent from browser E2E and from A02 engine QA.
- Lesson 05 A07 independent source reported **real SRAM power-cycle/write-retention risks in A05 #13**: 16-S02 teaching must **never** copy any faulty behavior and A05 owners fix their own branch. 16 is written independently; its readiness does not grant 05 QA.
- **Review gate:** A06 internal content checklist 4× full schema + 3 misconceptions/3 targeted feedback/3 hints + source/units + pre/post Korean Voice passed. A07 to check current blob SHA for `BLOCKER / MAJOR / MINOR` and send direct Issue #6 feedback; STORY_READY only on positive education QA. Main merge/deployment forbidden.

## Sources (checked 2026-10-17, official, full URLs)
[DIG-A] https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c3/c3s1/ — CMOS complementary networks, tCD min/tPD max & manufacturing.
[DIG-B] https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c4/c4s1/ — NAND/NOR universal and non-associative NAND.
[DIG-C] https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c5/c5s1/ — D latch transparent/edge-triggered register, setup and hold.
[DIG-D] https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c6/c6s1/ — metastability and synchronizers probabilistic.
[DIG-E] https://www.ti.com/product/SN74HC74 — specific positive-edge DFF with preset/clear; product data never the toy lab values.
[DIG-F] https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/syllabus/ — devices→gates→sequential→processor education sequence.

## A07 2026-10-17 최초 SOURCE MAJOR 대응 · 독립 재검증 대기
- [A07 공통 레슨 #29](https://github.com/Junebooky/interactive-engineering/issues/29)에서 지적한 S03/S04 teacher answers in `prediction` → 모든 S01~S04의 **neutral learner `predictionPrompt` / gated `teacherExpectedAnswer`** 분리. Before Voice, `aria` 및 단위 정답은 학생 선택·조작 전 노출 금지.
- S01의 **의도적 오답을 하나 이상 골라야 통과한다**는 강제 규칙 제거: 올바르게 미리 예측한 학생도 여러 입력 독립 조작+원리를 설명하면 통과. 오답 피드백은 실제 틀렸을 때만 조건부.
- NOT은 **입력 반전 연산이라는 실제 계산**을 수행한다고 intro 수정; 기억/다입력 조합 기능 부족으로 연결. 기존 NAND/NOR 진리표·ideal timing toy 수식은 변경 없이 보존.
- A06 SOURCE REWORK 완료, A07 독립 **new blob 재검증/EDU_QA_PASS 아직 미완료**, A05 원고 최종 인계는 SOURCE PASS 후, 앱/브라우저/학생 QA 따로 진행.
