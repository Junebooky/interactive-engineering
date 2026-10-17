# 20 · 반도체 도면 탐정: RTL→STA→DRC/LVS→ATPG→저전력 UPF
> A06 new **5-Step full scene storyboard SOURCE_AUTHOR_DONE / A07 INDEPENDENT SCIENCE/EDU SOURCE_QA PENDING**, checkedAt 2026-10-17 KST. [OpenROAD/OpenSTA/KLayout/Siemens/IEEE1801 senior note](../deep-dives/20-eda-sta-drc-dft-upf.md); [Lesson20 pipeline #57](https://github.com/Junebooky/interactive-engineering/issues/57). Before this work 21 authored lessons/93 Step, with new20 add 5 = **22 authored lessons/98 Steps**. **Neither actual EDA, signoff, taped-out silicon, A05 2.5D Chromium nor A02 app verified**.
> 선수 01 CMOS/06 physical package/12 timing/13 unit/16 flipflop/17 CPU pipeline/31 PDN; after 20 design-signoff path connect 15 GAA/CFET device reliability, 19 DRAM ECC and 10 AI SoC/datacenter power. All setup/hold ns, DRC spacing µm, utilization toy sites, ATPG detection percentage and power-domain states are explicitly pedagogical, not production PDK/EDA or manufacturer actual data.

## Learner contract
- Before predicting, only `storyHook`, `predictionPrompt`, `displayTextBeforePrediction`, `speechTextBeforePrediction` and basic definitions appear in student DOM/ARIA/TTS; teacherExpectedAnswer, results, specific wrong feedback, display/Voice after are gated until submitted prediction, **at least two actually independent controlled states and causal WHY**. If student first answer correct they can pass without required deliberate wrong choices. L1/L2/L3 hints only when requested, not full correct solution pre-attempt.
- Each Step has three physically distinct m1-m3 cause-specific negative corrections; real modelInputs must match learnerAction. A07 independent exact original source QA first; then A06 direct A05 original five Scene IDs, A05 Chrome/mobile/keyboard/Voice/aria and A02 app distinct evidence gates. Main merge/deploy and real production signoff on HOLD.

## 20-S01 · `rtl-gates-physical-flow` · 코드가 맞으면 칩도 바로 찍을 수 있을까요?
### ① 스스로 예상하고 두 가지 조건 바꾸기
- **sceneId:** `rtl-gates-physical-flow`
- **learningGoal:** RTL→합성→floorplan/placement→clock tree/routing→DRC/LVS를 구분하고 셀 점유/배치 용량 비율로 실제 배치 가능 여부만 판단하며 RTL 시뮬레이션이 물리 사인오프를 대체하지 못함을 설명한다.
- **priorKnowledge:** 01 CMOS 논리, 06 fab/패키징, 13 비율
- **storyHook:** 코드에서 NOT 게이트가 올바르게 나와도 마스크를 바로 공장에 보내면 될까요?
- **question:** 코드에서 NOT 게이트가 올바르게 나와도 마스크를 바로 공장에 보내면 될까요?
- **predictionPrompt (learner-only):** 셀 60개를 놓을 공간100칸과70칸의 점유율을 예측하고, RTL 시뮬레이션을 통과했다면 실제 배선도 자동 통과한 걸지 골라 보세요.
- **displayTextBeforePrediction:** 코드와 게이트 배치 도면은 같은 물건일까요?
- **speechTextBeforePrediction:** 코드, 셀, 칩 위 배선을 서로 다른 단계에 놓아 보세요. 각 단계의 합격 증거가 다른지 예측해요.
- **learnerAction:** Independently set `stage='RTL'|'synthesized'|'placed'|'routed'` and `capacityToy=100|70|50` at occupiedToy=60 constant. Show stage-specific evidenced artefacts (RTL waveform, mapped cell list, placed sites, routed metal) and derived utilization. For capacity50 marked PLACEMENT_CAPACITY_EXCEEDED toy, not a fabricated chip failure. `foundrySignoff=NOT_PROVEN` always.
- **modelInputs:** typed `stage:'RTL'|'synthesized'|'placed'|'routed'`, `capacityToy:100|70|50`, fixed `occupiedToy=60`. `toyUtilization=60/capacityToy`: 60%,85.7142857%,120%. If >100% mark `TOY_OVER_CAPACITY` only in placed/routed toy; else `CAPACITY_NOT_EXCEEDED`. Independently `observedArtifact={rtl_behavior|cell_netlist|placed_instances|metal_routes}` from stage, `timingClosed=NOT_PROVEN`, `functionallyEquivalent=NOT_PROVEN`, `DRCLVS=NOT_PROVEN`, `foundryTapeoutReady=NOT_PROVEN` for every stage. No actual EDA run.
### ② 조작 후에만 보이는 교사용 검증 결과
- **expectedObservation (teacher-only):** 60/100=60%, 60/70≈85.714%,60/50=120% impossible within toy site capacity; only abstract placement pressure changes with capacity. RTL success does not certify synth equivalence, STA, routing, DRC, LVS or actual tapeout. OpenROAD example Yosys→physical→KLayout is workflow, not proof any user's design taped out.
- **teacherExpectedAnswer (gated):** 60/100=60%, 60/70≈85.714%,60/50=120% impossible within toy site capacity; only abstract placement pressure changes with capacity. RTL success does not certify synth equivalence, STA, routing, DRC, LVS or actual tapeout. OpenROAD example Yosys→physical→KLayout is workflow, not proof any user's design taped out.
- **correctIncorrectCriteria:** Compare two capacities and at least RTL vs routed stage, calculate percentages/overflow and explain distinct evidence per stage plus foundry signoff not yet proven.
- **misconceptions:** [m1] RTL 시뮬레이션이 끝나면 게이트 셀 위치와 배선의 물리 규칙도 자동 통과해요. / [m2] 공간70칸에 셀60칸을 놓으면 이용률은 대략 60%예요. / [m3] OpenROAD에서 GDS를 생성했으면 어떤 PDK든 실리콘 수율과 동작이 자동 인증돼요.
- **hints L1/L2/L3 (on-request):** [L1] 코드 논리와 실제 와이어 모양은 같은 산출물일까요? / [L2] 점유율 분모는 전체 사용 가능한 칸 수예요. / [L3] DRC·LVS·타이밍·전원망과 실제 실리콘에는 추가 검증이 필요해요.
- **misconceptionFeedback/m1 (gated):** RTL은 논리 동작 설명과 시뮬레이션을 다룰 뿐 실제 metal 연결과 제조 규칙은 별도 점검해야 해요.
- **misconceptionFeedback/m2 (gated):** 60/70×100≈85.7%예요. 60%는 용량100일 때만 맞아요.
- **misconceptionFeedback/m3 (gated):** 한 플로우의 출력이 검증 전반이나 실물 수율을 인증하지 않아요. PDK·DRC/LVS·STA·전원·제조 검증이 따로 필요해요.
- **feedback/correct:** 두 독립 조작 상태와 실측이 아닌 toy 가정을 확인했어요. 결과의 경계와 WHY를 설명해야 통과합니다.
- **displayTextAfterObservation (gated):** RTL부터 GDS까지는 여러 검증 단계를 거치는 별도 작업이에요.
- **speechTextAfterObservation (gated):** 논리 코드를 합성해 게이트 셀을 만들고 실제 위치와 선을 배치해도, 시간과 제조 규칙을 추가로 확인해야 해요. 점유율만으로 칩 생산을 보증할 수 없어요.
### ③ 시니어 반례/범위와 출처
- **physicsAssumptions:** Fictional rectangular capacity in arbitrary unit tiles, no real placement constraints/PDK/floorplan/power/timing; 120% means impossible only for simplified toy capacity model.
- **seniorDesignReview:** Yosys synthesis, OpenROAD CTS/routing and signoff PDK electrical models; clock/network congestion/cell utilization are not timing equations.
- **sourceRefs:** [R1][R2]
- **negativePathTest:** check correct-first with >=2 distinct actual toggles+WHY, all m1/m2/m3 cause-specific corrections for physically invalid configurations, grade only same typed state and immutable clock/test/corner assumptions. No student pre-answer exposure via text/audio/ARIA, no prior-event regrading after later flag changes; A05 actual browser validation only after A07 independent source PASS.
- **nextHook:** 다음 실험에서 다른 종류의 칩 검증 문을 열어봐요.

## 20-S02 · `sta-setup-hold-slack` · 빠르게 보내야 하는데 너무 빨라도 실패라고요?
### ① 스스로 예상하고 두 가지 조건 바꾸기
- **sceneId:** `sta-setup-hold-slack`
- **learningGoal:** 한 경로의 최대 전달시간과 setup, 최소 전달시간과 hold를 독립 계산하고 한쪽만 수리하면 전체 STA를 통과했다고 주장하지 않는다.
- **priorKnowledge:** 12 클록·ns,16 플립플롭 setup/hold,17 CPU 파이프라인
- **storyHook:** 데이터는 너무 늦어도 안 되고, 어떤 경우엔 너무 일찍 바뀌어도 문제가 생겨요.
- **question:** 데이터는 너무 늦어도 안 되고, 어떤 경우엔 너무 일찍 바뀌어도 문제가 생겨요.
- **predictionPrompt (learner-only):** 1ns 클록에서 느린 배선을 줄이면 setup 여유가 좋아질까요? 같은 경로의 hold까지 자동 통과할까요?
- **displayTextBeforePrediction:** 너무 늦은 도착과 너무 이른 변화는 어떻게 다를까요?
- **speechTextBeforePrediction:** 최대 경로와 최소 경로를 분리해놓고 배선 지연 조절과 홀드 버퍼를 한 번씩 바꿔보세요.
- **learnerAction:** Independently choose `maxWireNs=0.28|0.18` and `holdBufferMinNs=0|0.08`. Read two **separate** STA panels, setup max-path and hold min-path; a new hold buffer is min-only hypothetical and emits `SETUP_RECHECK_REQUIRED` because its max delay not characterized, so the two successes cannot be jointly certified. Confirm clock period fixed1ns and no real OCV/skew signoff.
- **modelInputs:** T1ns; cqMax.12ns combMax.55ns maxWire=.28|.18ns, setup.10ns, setupClockUncertainty.05ns; `setupArrival=.12+.55+maxWire`, `setupRequired=1-.1-.05=.85`, `setupSlack=.85-setupArrival`: for .28 arrival.95 slack−.10ns FAIL, for .18 arrival.85 slack0 PASS in toy **only when holdBufferMin=0**. Hold separately cqMin.08, combMin.06, wireMin.04ns, required hold.20+holdUncertainty.03=.23; bufferMin0|.08, `holdArrival=.18+bufferMin`, holdSlack=arrival−.23 =>−.05 FAIL or+.03 PASS. If bufferMin=.08, setup status `SETUP_RECHECK_REQUIRED` (no max buffer delay input), **never combined ALL_CORNER_PASS**.
### ② 조작 후에만 보이는 교사용 검증 결과
- **expectedObservation (teacher-only):** Original setup slack−0.10ns and hold−0.05ns simultaneously fail. Reduce max wire .28→.18: setup becomes0 but hold stays−.05 (without hold buffer). Adding minimum hold buffer .08: hold becomes+.03, but full setup requires new max-path characterization, so `SETUP_RECHECK_REQUIRED`, not full chip signoff.
- **teacherExpectedAnswer (gated):** Original setup slack−0.10ns and hold−0.05ns simultaneously fail. Reduce max wire .28→.18: setup becomes0 but hold stays−.05 (without hold buffer). Adding minimum hold buffer .08: hold becomes+.03, but full setup requires new max-path characterization, so `SETUP_RECHECK_REQUIRED`, not full chip signoff.
- **correctIncorrectCriteria:** Actively choose maxWire .28 and .18, buffer0 and .08; correctly interpret setup and hold formulas, min-vs-max and no automatic both-pass with unknown max buffer/corners.
- **misconceptions:** [m1] Setup은 늦게 도착한 데이터만 검사하므로 Hold 오류도 setup 배선을 빠르게 하면 자동으로 사라져요. / [m2] Hold를 고치려면 데이터를 더 빨리 도착시키는 회로를 무조건 넣어야 해요. / [m3] Setup Slack이0ns가 되면 공정/전압/온도의 모든 경우에서 전체 칩 signoff가 끝나요.
- **hints L1/L2/L3 (on-request):** [L1] 늦는 시간과 너무 이른 시간을 각각 식으로 써 봐요. / [L2] Hold는 값이 일정 기간 유지돼야 하는 제약이에요. / [L3] 추가 버퍼의 최대 지연과 다른 clock corners도 검사했나요?
- **misconceptionFeedback/m1 (gated):** 배선이 빨라져도 가장 이른 데이터 도착이 더 빨라질 수 있어 hold에는 불리할 수 있어요.
- **misconceptionFeedback/m2 (gated):** Hold는 지나치게 이른 변화를 막아야 해요. 최소 경로에 지연을 더하는 경우가 있죠.
- **misconceptionFeedback/m3 (gated):** 한 경로 한 조건의 setup=0은 여유가 딱0이라는 뜻일 뿐이고 다른 경로·hold·PVT가 남아 있어요.
- **feedback/correct:** 두 독립 조작 상태와 실측이 아닌 toy 가정을 확인했어요. 결과의 경계와 WHY를 설명해야 통과합니다.
- **displayTextAfterObservation (gated):** Setup과 Hold는 서로 다른 시점과 경로 지연을 검사해요.
- **speechTextAfterObservation (gated):** 데이터가 늦으면 setup을 어기고 너무 이르게 바뀌면 hold가 깨질 수 있어요. 홀드를 고치는 버퍼도 가장 느린 경로에 영향을 줄 수 있어서 다시 검사해야 하죠.
### ③ 시니어 반례/범위와 출처
- **physicsAssumptions:** Ideal one-clock same edge zero skew, toy setup/hold uncertainty and max/min paths treated independently; hold buffer min=.08 but max unknown so no combined closure. Real Liberty, OCV, cross-domain and clock variations omitted.
- **seniorDesignReview:** SDC constraints, Liberty max/min, SPEF parasitics, CTS skew, hold fix vs setup regression, MCMM multi-corner mode proofs distinct.
- **sourceRefs:** [R3][R4]
- **negativePathTest:** check correct-first with >=2 distinct actual toggles+WHY, all m1/m2/m3 cause-specific corrections for physically invalid configurations, grade only same typed state and immutable clock/test/corner assumptions. No student pre-answer exposure via text/audio/ARIA, no prior-event regrading after later flag changes; A05 actual browser validation only after A07 independent source PASS.
- **nextHook:** 다음 실험에서 다른 종류의 칩 검증 문을 열어봐요.

## 20-S03 · `layout-drc-lvs-connectivity` · 배선 간격이 맞으면 회로 연결도 맞을까요?
### ① 스스로 예상하고 두 가지 조건 바꾸기
- **sceneId:** `layout-drc-lvs-connectivity`
- **learningGoal:** 단일 금속 간격 제조 규칙 DRC 검사와 schematic-netlist 대비 LVS 연결성 검사를 분리하며 둘 모두 전체 tapeout 검증과 다름을 안다.
- **priorKnowledge:** 01 CMOS 인버터,06 레이아웃/배선,13 길이 단위
- **storyHook:** 두 금속선이 충분히 떨어져 있어도 가운데 연결 구멍인 비아가 빠졌다면요?
- **question:** 두 금속선이 충분히 떨어져 있어도 가운데 연결 구멍인 비아가 빠졌다면요?
- **predictionPrompt (learner-only):** 금속선 간격이 규칙보다 넓어 DRC 검사가 통과한 도면에서 비아가 없으면 회로 연결도 자동 정답일지 예상해 보세요.
- **displayTextBeforePrediction:** 도형이 제조 규칙을 만족하면 연결은 안전할까요?
- **speechTextBeforePrediction:** 금속 간격과 비아 유무를 각각 바꿔 보세요. 두 검사가 무엇을 살펴야 할지도 예상해 봐요.
- **learnerAction:** Independently toggle `spacingUm=.10|.13` and `viaPresent=false|true` with toy minimum=.12µm. Derive toy spacing DRC and one required via connectivity LVS states on separate panels. Must test spacing pass/via fail AND spacing fail/via present, never infer whole physical verification from any single rule.
- **modelInputs:** typed `spacingUm:.10|.13`, `viaPresent:boolean`; `minimumSpacingUm=.12` static. `spacingRulePass=spacingUm>=.12`, .10 violates by.02µm, .13 passes *one spacing rule*. Toy reference circuit requires via from Metal1 to Metal2; `toyLvsConnectivityPass=viaPresent` independently of metal spacing. States `ONE_RULE_DRC_PASS|SPACING_DRC_FAIL`, `TOY_LVS_CONNECTED|LVS_MISSING_VIA`; `fullDrc=NOT_PROVEN`, `fullLvs=NOT_PROVEN`, `siliconFunctional=NOT_PROVEN` always.
### ② 조작 후에만 보이는 교사용 검증 결과
- **expectedObservation (teacher-only):** spacing .10 < min .12 => spacing-rule DRC FAIL by .02µm, .13 passes that one rule. Missing via causes LVS extracted-vs-reference mismatch even if spacing .13; adding via restores connection for this toy LVS check but could introduce other DRC or timing problems; never claim chip overall pass.
- **teacherExpectedAnswer (gated):** spacing .10 < min .12 => spacing-rule DRC FAIL by .02µm, .13 passes that one rule. Missing via causes LVS extracted-vs-reference mismatch even if spacing .13; adding via restores connection for this toy LVS check but could introduce other DRC or timing problems; never claim chip overall pass.
- **correctIncorrectCriteria:** Show spacing .10/.13 and both via statuses, report independent DRC and LVS result, explain one-rule vs full signoff and missing via consequence.
- **misconceptions:** [m1] DRC에서 금속 간격이 규칙을 만족하면 배선이 올바른 신호끼리 연결됐다는 뜻이에요. / [m2] 비아가 없어도 윗층과 아랫층 금속이 그림에서 가까우면 LVS는 무조건 연결됐다고 판단해요. / [m3] LVS 연결이 일치하면 setup·hold와 모든 실제 기능까지 전부 증명된 거예요.
- **hints L1/L2/L3 (on-request):** [L1] DRC는 도형의 제조 간격, LVS는 회로의 연결을 비교해요. / [L2] 비아는 다른 금속 층을 전기적으로 이어주는 통로예요. / [L3] 연결과 물리 시간·기능은 서로 다른 검사예요.
- **misconceptionFeedback/m1 (gated):** 간격 규칙과 전기적 netlist가 맞는지는 달라요. DRC 일부 통과만으로 LVS를 건너뛸 수 없어요.
- **misconceptionFeedback/m2 (gated):** 레이어를 건너 연결하는 비아가 빠지면 netlist 추출에서 끊긴 신호가 될 수 있어요.
- **misconceptionFeedback/m3 (gated):** LVS는 의도한 회로와 도면의 연결 일치를 볼 뿐 timing·성능·전원·기능 전체를 보장하지 않아요.
- **feedback/correct:** 두 독립 조작 상태와 실측이 아닌 toy 가정을 확인했어요. 결과의 경계와 WHY를 설명해야 통과합니다.
- **displayTextAfterObservation (gated):** DRC와 LVS는 서로 다른 종류의 물리 검사예요.
- **speechTextAfterObservation (gated):** 금속 간격이 맞아도 비아가 빠지면 신호가 끊어질 수 있어요. DRC는 기하학적 제약을, LVS는 회로 연결의 일치 여부를 검사하죠.
### ③ 시니어 반례/범위와 출처
- **physicsAssumptions:** Only toy one spacing rule and toy one-via reference net, no foundry min width, antenna/ESD/latch-up/electromigration, layer RC, full electrical signoff.
- **seniorDesignReview:** KLayout extraction topology vs foundry DRC rule deck, waiver/exception qualification and LVS/DRC independent evidence.
- **sourceRefs:** [R5][R6]
- **negativePathTest:** check correct-first with >=2 distinct actual toggles+WHY, all m1/m2/m3 cause-specific corrections for physically invalid configurations, grade only same typed state and immutable clock/test/corner assumptions. No student pre-answer exposure via text/audio/ARIA, no prior-event regrading after later flag changes; A05 actual browser validation only after A07 independent source PASS.
- **nextHook:** 다음 실험에서 다른 종류의 칩 검증 문을 열어봐요.

## 20-S04 · `dft-atpg-fault-coverage` · 제조 테스트 95%면 완성 칩 95%가 좋은 걸까요?
### ① 스스로 예상하고 두 가지 조건 바꾸기
- **sceneId:** `dft-atpg-fault-coverage`
- **learningGoal:** 제조 DFT의 모델 기반 fault coverage 분자·분모를 계산해 실제 웨이퍼 수율/결함 탈출률과 혼동하지 않는다.
- **priorKnowledge:** 13 비율·확률/오류예산,01 로직 게이트
- **storyHook:** 게이트 내부 결함 100개를 모델로 정했는데 테스트 패턴은 몇 개를 찾아낼까요?
- **question:** 게이트 내부 결함 100개를 모델로 정했는데 테스트 패턴은 몇 개를 찾아낼까요?
- **predictionPrompt (learner-only):** 가정한 fault 100종 중90종 발견되면 test coverage는 얼마일까요? 이 숫자가 생산된 칩의 양품률일까요?
- **displayTextBeforePrediction:** 테스트에서 발견한 결함의 비율과 칩 수율은 같을까요?
- **speechTextBeforePrediction:** 검출 결함 수와 검출 가능하다고 정의한 결함 집합을 따로 바꿔 보세요. 분모 선택부터 정확하게 예측해요.
- **learnerAction:** Set independently `detectedFaults=90|95` and `classifiedUntestable=0|5` in fixed candidate faults100; reject impossible detected+untestable>100 by `INVALID_FAULT_PARTITION` (e.g.95+5 valid, 95+6 not offered). Read all-candidate detected fraction vs testable-only denominator, while physical real defect escape always UNKNOWN. Show scan/ATPG fault categories stuck-at and transition but not device-stress test recipe.
- **modelInputs:** `allModeledFaults=100`, `detectedFaults=90|95`, `classifiedUntestable=0|5`, `remaining=100−detected−untestable>=0`, `allCandidateCoverage=detected/100`, `testableOnlyCoverage=detected/(100−untestable)` for valid partitions. States: det90 untest5 => broad90% vs testable90/95=94.736842%; det95 untest5=>95% broad vs95/95=100% testable; det90 untest0=>90% both. `realDefectiveDieYield=NOT_PROVEN`, `escapeRateDPPM=NOT_PROVEN`, `layoutDefectModelCoverage=NOT_PROVEN` regardless of percentages.
### ② 조작 후에만 보이는 교사용 검증 결과
- **expectedObservation (teacher-only):** Stuck-at modeled fault coverage 90/100=90% does not prove manufacturing yield90% or no physical defects. Excluding five legitimately untestable changes denominator to95, yielding90/95≈94.74%, **not** automatically more faults detected. Siemens Tessent models and test pattern effectiveness are fault- and process-dependent.
- **teacherExpectedAnswer (gated):** Stuck-at modeled fault coverage 90/100=90% does not prove manufacturing yield90% or no physical defects. Excluding five legitimately untestable changes denominator to95, yielding90/95≈94.74%, **not** automatically more faults detected. Siemens Tessent models and test pattern effectiveness are fault- and process-dependent.
- **correctIncorrectCriteria:** Compare two detected counts and two denominator policies with explicitly partitioned candidate faults; explain why model coverage is not actual yield or guaranteed DPPM.
- **misconceptions:** [m1] 모델 오류 검출률90%이면 웨이퍼에서 만든 반도체의 양품률도 반드시90%예요. / [m2] 검출 불가능한 결함을 분모에서 빼서 점수가 올라가면 실제 발견한 결함 수도 자동으로 늘어요. / [m3] Stuck-at 결함 모델을 모두 통과하면 지연 결함과 브리지 결함도 자동으로 전부 커버돼요.
- **hints L1/L2/L3 (on-request):** [L1] 커버리지는 무엇을 분모로 한 검출률일까요? / [L2] 같은 검출90인데 분모만100에서95로 바뀌면요? / [L3] 결함 모델은 한 종류만 있는 게 아니에요.
- **misconceptionFeedback/m1 (gated):** 테스트 커버리지는 선택한 결함 모델 집합의 발견 비율이에요. 실제 생산수율은 공정 결함과 로트 데이터를 별도로 측정해요.
- **misconceptionFeedback/m2 (gated):** 90개 발견은 그대로예요. 90/95가 90/100보다 높지만 놓친 물리적 결함이 사라진 뜻은 아니에요.
- **misconceptionFeedback/m3 (gated):** Stuck-at 정적 결함과 transition 시간 결함, 브리지 결함은 다른 테스트 모델일 수 있어요.
- **feedback/correct:** 두 독립 조작 상태와 실측이 아닌 toy 가정을 확인했어요. 결과의 경계와 WHY를 설명해야 통과합니다.
- **displayTextAfterObservation (gated):** ATPG 모델 결함 커버리지는 제조 수율과 다른 지표예요.
- **speechTextAfterObservation (gated):** 백 개의 모델 결함에서 아흔 개를 발견했다면 모델 커버리지는 구십 퍼센트예요. 하지만 실제 칩 불량과 어떤 고장을 놓쳤는지는 별도 제조 데이터가 필요해요.
### ③ 시니어 반례/범위와 출처
- **physicsAssumptions:** Toy ideal discrete list of 100 candidate fault models; labeled unreachable classifications not automatically validated in a real ATPG tool. Real test patterns, compression, bridges and quality statistics omitted.
- **seniorDesignReview:** Scan DFT observability/controllability, stuck-at vs transition, ATPG/at-speed/cell-aware, fault list exclusions, DPPM and quality data require calibrated manufacturing.
- **sourceRefs:** [R7][R8]
- **negativePathTest:** check correct-first with >=2 distinct actual toggles+WHY, all m1/m2/m3 cause-specific corrections for physically invalid configurations, grade only same typed state and immutable clock/test/corner assumptions. No student pre-answer exposure via text/audio/ARIA, no prior-event regrading after later flag changes; A05 actual browser validation only after A07 independent source PASS.
- **nextHook:** 다음 실험에서 다른 종류의 칩 검증 문을 열어봐요.

## 20-S05 · `upf-isolation-retention-power` · 전원을 끈 블록의 기억과 출력은 어디로 갈까요?
### ① 스스로 예상하고 두 가지 조건 바꾸기
- **sceneId:** `upf-isolation-retention-power`
- **learningGoal:** 저전력 파워 도메인 OFF 시 isolation과 retention save/restore 독립 제어를 올바른 시간 순서로 평가해 UPF 설명을 실제 칩 검증으로 오인하지 않는다.
- **priorKnowledge:** 16 register states,31 PSU/VRM,01 CMOS,13 boolean conditions
- **storyHook:** AI 가속기 한쪽을 전원 OFF 했는데 옆 블록은 계속 켜져 있다면 어떤 신호를 믿어야 할까요?
- **question:** AI 가속기 한쪽을 전원 OFF 했는데 옆 블록은 계속 켜져 있다면 어떤 신호를 믿어야 할까요?
- **predictionPrompt (learner-only):** 꺼진 블록의 출력선을 그대로 읽어도 될까요? 레지스터를 저장·복원하는 것과 출력선을 안전값으로 묶는 게 같은 기능일까요?
- **displayTextBeforePrediction:** OFF 후 출력과 내부 기억을 분리해서 볼까요?
- **speechTextBeforePrediction:** 먼저 저장하고 출력 격리한 다음 전원을 꺼보세요. 돌아온 레지스터와 옆 블록 출력을 따로 예상해요.
- **learnerAction:** Operate finite sequence `SETUP→SAVE?→ISOLATE?→OFF→ON→RESTORE?→VERIFY`, not free posthoc toggles. Independently set `isolationEnabled=true|false` and `retentionCellAvailable=true|false`, saveBeforeOff and restoreAfterOn choices at their legal phases; changing isolation or save AFTER `OFF` cannot retroactively make prior event safe. Show A-off B-always-on output status and restored A register state separately.
- **modelInputs:** Typed `phase=SETUP|OFF|ON_AFTER_OFF|VERIFY` staged transitions; `isolationEnabled:boolean` fixed BEFORE OFF for outgoing domain A→live B; `retentionCellAvailable:boolean`, `saveBeforeOff:boolean` must be set before OFF; `restoreAfterOn:boolean` only after ON. At OFF `outputState=(isolationEnabled?'CLAMPED_SAFE':'UNSAFE_UNKNOWN')`, at ON after cycling `registerState=(retentionCellAvailable&&saveBeforeOff&&restoreAfterOn?'RESTORED_PREVIOUS':'STATE_NOT_RESTORED')`. `UPFModelContractValid` only if output clamp was safe while OFF and requested state restored on ON; no real hardware or full IEEE1801 simulation. Posthoc SAVE_AFTER_OFF must be `INVALID_EVENT_ORDER` and cannot PASS.
### ② 조작 후에만 보이는 교사용 검증 결과
- **expectedObservation (teacher-only):** A domain OFF with no isolation leaves B-facing output unknown, with isolation it can be clamped; however clamp is not data retention. To restore register, retention hardware+SAVE before OFF+RESTORE after ON all needed. A UPF power-intent file/one toy simulation cannot prove actual silicon isolation, level shifters and all crossing paths.
- **teacherExpectedAnswer (gated):** A domain OFF with no isolation leaves B-facing output unknown, with isolation it can be clamped; however clamp is not data retention. To restore register, retention hardware+SAVE before OFF+RESTORE after ON all needed. A UPF power-intent file/one toy simulation cannot prove actual silicon isolation, level shifters and all crossing paths.
- **correctIncorrectCriteria:** Student runs two independent changes e.g isolation false/true and retention/no-retention plus proper event sequence, intentionally test safe and unsafe states without forced initial mistake; explain isolation vs retention, reject late save or system-wide UPF signoff.
- **misconceptions:** [m1] 격리 isolation을 켜면 전원이 꺼진 블록의 모든 레지스터 값도 반드시 저장돼요. / [m2] 레지스터 데이터를 OFF 전에 저장하지 않아도 전원 ON 뒤 RESTORE만 누르면 원래 값이 돌아와요. / [m3] UPF 설정 파일에 전원 영역을 적으면 전기적 레벨시프터와 모든 실칩 기능이 자동 검증돼요.
- **hints L1/L2/L3 (on-request):** [L1] 다른 블록으로 나가는 출력과 내부 데이터 기억은 다른 문제예요. / [L2] 저장은 전원을 끄기 전에 끝나야 하겠죠? / [L3] 명세를 적는 것과 검증해 통과시키는 것은 별개예요.
- **misconceptionFeedback/m1 (gated):** Isolation은 꺼진 영역의 출력 경로를 안전값으로 고정하는 기능이지 모든 상태를 저장하는 기술은 아니에요.
- **misconceptionFeedback/m2 (gated):** 저장되지 않은 레지스터 상태는 ON 뒤 RESTORE 버튼만으로 복구된다고 할 수 없어요. 순서와 보존 셀이 필요해요.
- **misconceptionFeedback/m3 (gated):** UPF 전원 의도 명세는 검증 대상이에요. 실제 레벨시프터/격리/타이밍과 전력 공급 검사는 별도로 해야 해요.
- **feedback/correct:** 두 독립 조작 상태와 실측이 아닌 toy 가정을 확인했어요. 결과의 경계와 WHY를 설명해야 통과합니다.
- **displayTextAfterObservation (gated):** Isolation과 retention은 서로 다른 전원 상태 관리 계약이에요.
- **speechTextAfterObservation (gated):** 전원이 꺼진 블록의 출력은 격리해서 이웃을 보호하고, 내부 값을 살리고 싶다면 끄기 전 저장과 켠 후 복원이 필요해요. 명세를 적는 것만으로 실리콘을 검증한 건 아니에요.
### ③ 시니어 반례/범위와 출처
- **physicsAssumptions:** Toy 2-domain always-on B and power-switched A, no level-shift circuit realization, retention cell/sequence conceptual. Event order matters: no retroactive changes after OFF. IEEE1801 formal syntax/semantics not implemented or simulated.
- **seniorDesignReview:** UPF power-state table, isolation clamp, retention save/restore and level shifters, corner timing and actual low-power verification; power intent standards != RTL/GDS signoff.
- **sourceRefs:** [R9]
- **negativePathTest:** check correct-first with >=2 distinct actual toggles+WHY, all m1/m2/m3 cause-specific corrections for physically invalid configurations, grade only same typed state and immutable clock/test/corner assumptions. No student pre-answer exposure via text/audio/ARIA, no prior-event regrading after later flag changes; A05 actual browser validation only after A07 independent source PASS.
- **nextHook:** 이제 만든 반도체와 10/32 AI 데이터센터의 장애·전력 경계를 연결해 보세요.

## A07 independent exact-source QA and future A05 negative test vectors
| ID | Post-prediction demonstrable result | Incorrect assumption MUST NOT pass |
|---|---|---|
| 20-S01 | cells60/siteCapacity100→60%,/70→85.714%,/50→120% toy overflow; RTL vs routed artefact | RTL sim = all physical signoff; toy flow = foundry-ready |
| 20-S02 | setup: T1 required.85, arr .95→slack −.10ns, wire .18→arr .85 slack0; hold .18−.23=−.05ns, min buffer .08→+.03ns; added buffer requires setup recheck | setup fix cures hold; total STA closure even with new max buffer unknown |
| 20-S03 | min spacing.12µm, measured.10 FAIL by.02, .13 passes one spacing rule; viaAbsent→toy LVS_FAIL independently | DRC spacing PASS implies LVS or all-chip PASS |
| 20-S04 | 100 modeled fault, det90 untest5 => broad90% and testable90/95≈94.7368%; det95 untest5 broad95%, testable100%; no device yield claim | denominator silently changes, fault coverage=manufacturing yield |
| 20-S05 | domain A OFF no isolation⇒UNKNOWN output; isolation clamps B input but no retention; save BEFORE OFF and restore AFTER ON require retention cell; late SAVE invalid | UPF written == device pass; isolation == memory, retroactive save works |
- P1 A07 independently review both original/senior SHA, event order/min/max/stage-specific and grade state, numeric units and source status, correct-first and pre Voice hidden; source pass/MAJOR Issue #57 and A06 #6. A05 five typed original scenes only after source PASS, real Chromium/CI/Voice/ARIA/keyboard/320px and negative screenshots, direct A02. Owner actual PDK/license/production yield/student/main merge HOLD.
## Public official references (2026-10-17)
[R1] OpenROAD official RTL-GDSII https://openroad.readthedocs.io/en/latest/main/README.html
[R2] OpenROAD Flow guide https://github.com/The-OpenROAD-Project/OpenROAD-flow-scripts/blob/master/docs/user/UserGuide.md
[R3] OpenSTA source examples https://github.com/The-OpenROAD-Project/OpenSTA/blob/master/doc/Examples.md
[R4] OpenSTA timing architecture https://openroad.readthedocs.io/en/latest/main/src/sta/README.html
[R5] KLayout LVS overview https://www.klayout.de/doc/manual/lvs_overview.html
[R6] KLayout connectivity https://www.klayout.de/doc/manual/lvs_connect.html
[R7] Siemens fault model vs quality coverage https://blogs.sw.siemens.com/tessent/2023/10/31/ensure-ic-quality-with-tessent/
[R8] Siemens compression/scan/ATPG https://blogs.sw.siemens.com/tessent/2015/09/24/using-edt-test-points-to-reduce-test-time-and-cost/
[R9] IEEE approved 1801-2024 low-power UPF scope https://standards.ieee.org/ieee/1801/11890/
