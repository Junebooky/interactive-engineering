# 31 · GPU를 돌리는 전기와 열은 어디로 갈까? PSU→VRM→CDU→PUE/WUE
> 2026-10-17 · **A06_SELF_QA_DONE / A07_INDEPENDENT_EDU_QA_PENDING**, **5 Step 원고 집필 완료, A05/앱 미제작**. 기획 학습 시간 약 45~55분(실측 아님). 기초 12 회로/전력, 01 MOSFET, 06 패키지 열, 10 데이터센터 후속. [공학 수식·실증 문서·toy 경계](../deep-dives/31-vrm-cdu-pue-wue.md).
> **상황:** AI 서버에 GPU는 준비됐어요. 그런데 전기를 1V 정도로 안정적으로 내려주고, 발열을 밖으로 빼고, 시설 효율까지 관리하지 못하면 연산칩만 빠르다고 끝나지 않죠. PSU→VRM의 전기, PDN의 열, CDU 물길, PUE/WUE 시설 경계를 학생이 직접 구성합니다.
> **A07/source QA gate:** 총 교육원고는 기존 15레슨/63 Step + 31 신규 5 Step = **16개 레슨/68 Step 집필량**. 이 숫자는 A07 검증 PASS 수나 A05 구현·앱 배포를 뜻하지 않음. A07 검토 후 MAJOR/BLOCKER 수정→SOURCE PASS 시 A05 직접 인계. Main merge/deploy 금지.

## 공통 예측 먼저·오답 선택 가능 계약
- `predictionPrompt`/`displayTextBeforePrediction`/`speechTextBeforePrediction` only visible before saved prediction; `teacherExpectedAnswer`, `expectedObservation`, numeric results, `displayTextAfterObservation`, `speechTextAfterObservation`, correct/mistake feedback **hidden in learner DOM, aria and Voice** until student submits guess and independently moves 2+ states. The questions and units are allowed; numeric answers are not prefilled.
- `modelInputs` include clearly labeled **TOY assumption cards** so learner knows what has been fixed, without leaking computed answer. Each Step has 3 misconceptions, targeted m1/m2/m3 corrective feedback and 3 gradual hints, but **never requires intentional wrong answer to pass**. Visit/toggle alone isn't comprehension; learner must also explain WHY.
- Numeric examples are fictional physical models, **not actual GPU rail, server PSU certified efficiency, CDU commercial flow, site PUE/WUE claim**. Per-device technology and site architectures vary; senior failure caveats after reveal.

## 31-S01 · `server-psu-loss-heat` · 100W를 쓰는 GPU 전원, 콘센트에서도 100W일까요?
### ① 처음 1분 — 예측 먼저, 결과 숨김
- **sceneId:** `server-psu-loss-heat`
- **learningGoal:** PSU efficiency η=Pout/Pin, conversion input/output/loss heat different; calculate 100W 90% vs95%, not confuse output-relative 10% loss.
- **priorKnowledge:** 12-S04 watt=joule/sec, P=VI, 01 MOSFET switch
- **storyHook:** GPU 쪽에는 전력 100W를 보냈대요. 그럼 콘센트도 딱 100W일까요?
- **question:** PSU 효율이 달라지면 같은 출력 100W를 얻는 데 필요한 입력과 발열은 어떻게 달라질까요?
- **predictionPrompt (learner):** PSU 출력 100W, 효율 90%와95% 조건의 입력 전력과 내부 손실을 계산하기 전 대소 관계를 선택해 보세요.
- **learnerAction:** 100W output card held fixed; choose PSU eta90/95, attach input-output/loss power-meter labels independently, choose wrong 10W loss distractor then see division by input, compare PSUs. Optional PSU/fan/power meter boundaries.
- **modelInputs:** Pout=100W, eta=0.90 or0.95, Pin=Pout/eta, Ploss=Pin−Pout; both eta values fictional, not rated server PSU specs. power arrows input vs GPU output and converter losses separate.
- **displayTextBeforePrediction:** “효율이 달라지면 입력 전력도 달라질까요?”
- **speechTextBeforePrediction:** “같은 출력 백 와트를 만든다고 가정해요. 효율 수치를 바꾸기 전에 입력은 얼마가 필요한지 예상해 보세요.”
### ② 중급 — 관찰 뒤 공개와 오개념 교정
- **expectedObservation (teacher-only):** At eta90%, Pin111.111W and Ploss11.111W; at95%, Pin105.263W, Ploss5.263W. Less conversion loss for same output, but GPU output100W is still useful electrical input that eventually largely dissipates as heat depending workload/system.
- **teacherExpectedAnswer (gated):** Both conditions independently tried and equations/units correct; explicitly reject '10% of output=10W loss' and energy creation. Explain what portion is PSU loss vs downstream IT power.
- **correctIncorrectCriteria:** Both conditions independently tried and equations/units correct; explicitly reject '10% of output=10W loss' and energy creation. Explain what portion is PSU loss vs downstream IT power.
- **misconceptions:** [m1] PSU 효율90%이고 출력100W면 손실은 정확히10W다 / [m2] GPU 전력 100W만큼 출력했다면 PSU에는 에너지 손실이 전혀 없다 / [m3] 변환 효율95%이면 GPU 회로와 건물의 전체 발열까지 0이 된다
- **hints L1/L2/L3:** [L1] 효율의 분모는 출력이 아니라 입력이에요. / [L2] 출력=효율×입력이면 입력은 어떻게 구할까요? / [L3] PSU에서 잃은 열과 GPU가 나중에 소비하는 전력을 따로 그려 보세요.
- **misconceptionFeedback/incorrect keyed:** [m1] “10%의 손실은 입력 전력의 10%예요. 100/0.9−100≈11.11W가 맞아요.” / [m2] “실물 전력 변환에는 저항/스위칭/자성체 손실이 남아요. 이 수업의 90%도 그런 손실을 가정해요.” / [m3] “효율이 올라가면 PSU 손실은 줄지만 출력받은 GPU와 팬·냉각기 등의 소비가 사라지지는 않아요.”
- **feedback/correct:** “계산 결과와 다른 조건의 반례를 직접 비교해 왜 그랬는지 한 문장으로 설명해 주세요.”
- **displayTextAfterObservation:** “출력100W·효율90%일 때 입력 약111.11W, PSU 손실 약11.11W예요.”
- **speechTextAfterObservation:** “효율의 기준은 입력이에요. 아흔 퍼센트로 출력 백 와트를 만들면 입력은 약 백십일 와트이고, 약 열한 와트가 변환 손실이에요.”
### ③ 시니어 — 실제 물리 한계/검증
- **physicsAssumptions:** eta fictional constant per scenario; actual server PSUs efficiency varies load, temperature, fan, PFC, redundancy, input voltage. Do not double count PSU loss and chip dissipation. 100W toy not NVIDIA SKU.
- **seniorDesignReview:** Choose metering location and Pin-Pout energy balance, PSU efficiency versus IT energy boundary, transient and thermal sink; explain why comparing different PSUs at fixed output is not total PUE proof.
- **sourceRefs:** [POWER-B][POWER-C]
- **teachBack:** Beginner=WHY one sentence; Intermediate=2 actual manipulated states and units; Senior=counterexample+real measurement/assumption boundary. No forced mistake.
- **nextHook:** GPU는 이렇게 받은 전압을 그대로 코어 트랜지스터에 걸어도 될까요?

## 31-S02 · `gpu-buck-vrm-duty-ratio` · 12V를 4V로 바꿀 땐 스위치를 얼마나 켤까요?
### ① 처음 1분 — 예측 먼저, 결과 숨김
- **sceneId:** `gpu-buck-vrm-duty-ratio`
- **learningGoal:** For ideal steady CCM buck, Vout≈D Vin from inductor volt-second balance; distinguish duty/ratio vs input/output currents and VRM nonideal losses.
- **priorKnowledge:** 31-S01 PSU, 12 capacitor/inductor charge sense mini-card, 01 MOSFET switching
- **storyHook:** GPU 코어는 공급선보다 훨씬 낮은 전압이 필요한데, 스위치로 전압을 조절할 수 있을까요?
- **question:** 입력12V에서 4V를 만들려면 이상적인 buck switch를 몇 분의 1시간 켜야 할까요?
- **predictionPrompt (learner):** 입력 12V, duty 1/4·1/3·1/2 세 카드에서 이상적 출력전압을 먼저 예측하고 10A 출력일 때 입력전류가 10A와 같을지 판단해 보세요.
- **learnerAction:** Vin12 fixed, choose duty D0.25/0.3333/0.5 then slider; animated switch+inductor/capacitor and volt-second bar, toggle output current10A and converter eta1.0/0.9. Distinguish Vin/Iin vs Vout/Iout and show power arrows only after prediction.
- **modelInputs:** ideal lossless CCM Vout=D*Vin with Vin12V; duty=1/4,1/3,1/2 =>3,4,6V. For Vout4V Iout10A, Pout40W and eta0.9: Pin44.444W Iin=44.444/12=3.7037A, Ploss4.444W. All hypothetical.
- **displayTextBeforePrediction:** “스위치 켜짐 시간으로 전압을 바꿔볼까요?”
- **speechTextBeforePrediction:** “열두 볼트를 네 볼트로 만드는 장난감 스위치를 조절해 보세요. 몇 퍼센트 켜야 할지 먼저 고르세요.”
### ② 중급 — 관찰 뒤 공개와 오개념 교정
- **expectedObservation (teacher-only):** Ideal duty1/3 gives 4V; 1/4 gives3V. At 4V×10A output40W and fictional η90%, input44.44W, input current3.70A at12V, not10A. Real VRM PFM/DCM, loss/Rds(on) and transient/load dependent.
- **teacherExpectedAnswer (gated):** Map D/Vout at two duty states and correctly separate input/output currents/physical CCM conditions. No claim Vout=D Vin for any converter or no inductor, no zero-ripple guarantee.
- **correctIncorrectCriteria:** Map D/Vout at two duty states and correctly separate input/output currents/physical CCM conditions. No claim Vout=D Vin for any converter or no inductor, no zero-ripple guarantee.
- **misconceptions:** [m1] buck은 이상적/손실형 관계없이 스위치를 1/3 켜면 정확히4V다 / [m2] 출력전류가10A면 12V 입력전류도 반드시10A다 / [m3] 스위치를 빠르게 움직이면 실제 리플·전력손실이 언제나 정확히 0이다
- **hints L1/L2/L3:** [L1] 인덕터 전압이 한 주기 평균 얼마여야 안정적일까요? / [L2] 입력 전력과 출력 전력은 효율로 연결돼요. / [L3] PFM/DCM, 스위치 저항·자기손실·부하 급변 조건을 생각해요.
- **misconceptionFeedback/incorrect keyed:** [m1] “4V는 이상적 CCM·손실 없는 buck 가정에서 나오는 관계예요. 실제 제어기는 손실을 보정하죠.” / [m2] “40W 출력에 효율90%면 약44.44W 입력, 12V에서 입력전류는 약3.70A예요.” / [m3] “실제 buck에는 스위칭·인덕터·커패시터 리플·전력손실과 제어 오버슈트가 있어요.”
- **feedback/correct:** “계산 결과와 다른 조건의 반례를 직접 비교해 왜 그랬는지 한 문장으로 설명해 주세요.”
- **displayTextAfterObservation:** “이상적 buck에서 duty 1/3이면 출력4V예요.”
- **speechTextAfterObservation:** “전력을 낮추는 게 아니라 전압과 전류를 바꾸는 거예요. 이상적인 벅 회로는 켜짐 비율 삼분의 일에서 네 볼트가 되죠.”
### ③ 시니어 — 실제 물리 한계/검증
- **physicsAssumptions:** Steady-state continuous inductor conduction with losses zero for D relation; subsequent eta0.9 hypothetical circuit. No transistor gate/inductor actual values, switching frequency, phase and transient sizes. GaN/SiC not universal superior.
- **seniorDesignReview:** Inductor volt-second balance and Iin=Pout/(η Vin); switching and conduction losses, phase balancing, compensation, ripple and load-step droop cannot be ignored in actual VRM.
- **sourceRefs:** [POWER-A][POWER-B]
- **teachBack:** Beginner=WHY one sentence; Intermediate=2 actual manipulated states and units; Senior=counterexample+real measurement/assumption boundary. No forced mistake.
- **nextHook:** 전압을 낮추고 전류를 늘리면 공급선은 시원해질까요?

## 31-S03 · `gpu-pdn-current-heat` · 전압을 반으로 내리면 발열도 반으로 줄까요?
### ① 처음 1분 — 예측 먼저, 결과 숨김
- **sceneId:** `gpu-pdn-current-heat`
- **learningGoal:** Ohmic I²R distribution heat at same delivered 40W, lower rail voltage raises current and loss if R fixed, while not claiming complete GPU performance trend.
- **priorKnowledge:** 31-S02 buck voltage/current, 12-S02 Ohm law
- **storyHook:** 코어 전압은 내려갔는데 전원선이 더 뜨거워질 수도 있을까요?
- **question:** 같은 전력40W를 2V로 보낼 때와 1V로 보낼 때 공급선의 전류와 열은 어떻게 달라질까요?
- **predictionPrompt (learner):** GPU 소비전력40W를 일정하게 두고 코어전압2V/1V와 배선 저항2mΩ를 바꿨을 때 전류와 I²R을 미리 예상해 보세요.
- **learnerAction:** Toy 40W fixed workload rail2V→1V; calculate I=P/V, choose copper path R2mΩ, toggle R1mΩ independent, see I²R heat via wire temperature icon and IR drop bar. Compare 20A/40A; no actual temperature plotted.
- **modelInputs:** Pload40W fixed, Vrail2V/1V, Rpath0.002Ω or0.001Ω, I=P/V; Ploss=I²R; Vdrop=IR. For R2mΩ: V2=>I20A loss0.8W drop0.04V, V1=>I40A loss3.2W drop0.08V. All toy.
- **displayTextBeforePrediction:** “같은 GPU 전력을 더 낮은 전압으로 보낼까요?”
- **speechTextBeforePrediction:** “전력이 같다고 가정한 두 전원선 중 어떤 쪽이 더 많은 전류를 흘리는지 골라보세요.”
### ② 중급 — 관찰 뒤 공개와 오개념 교정
- **expectedObservation (teacher-only):** With constant Pload, railV halved 2→1V leads double current20→40A, and fixed-R line heating 0.8→3.2W (fourfold). Real chip switching power often falls ~CV²f when V decreases, but actual throughput/freq/required I/thermal complex; this scenario holds output power constant deliberately.
- **teacherExpectedAnswer (gated):** Learner calculates voltage/current for 2 toy voltages and heat ratio×4, explains fixed-load-power constraint and distinction from chip's dynamic power.
- **correctIncorrectCriteria:** Learner calculates voltage/current for 2 toy voltages and heat ratio×4, explains fixed-load-power constraint and distinction from chip's dynamic power.
- **misconceptions:** [m1] 코어 전압을 절반으로 낮추면 어떤 조건에서나 배선 열도 반드시 절반으로 준다 / [m2] 저항과 전류가 바뀌어도 전선 열은 항상 P=VI만 보며 I²R을 써선 안 된다 / [m3] 낮은 전압에서 필요한 전류가 2배로 늘면 열도 반드시 2배다
- **hints L1/L2/L3:** [L1] 40W를2V로 나누면 몇 암페어인가요? / [L2] 같은 배선에선 손실이 전류의 제곱에 비례해요. / [L3] 전류가 두 배면 제곱 항은 몇 배가 될까요?
- **misconceptionFeedback/incorrect keyed:** [m1] “같은 40W를 전송한다는 조건이면 낮은 V에선 더 큰 I가 필요해요. 배선저항이 같다면 오히려 열이 늘 수 있죠.” / [m2] “배선의 저항 손실은 I²R로 계산하고 전압 강하는 IR로 확인해요.” / [m3] “전류2배면 I²R 손실은4배예요. GPU 전체 발열 추세는 다른 문제예요.”
- **feedback/correct:** “계산 결과와 다른 조건의 반례를 직접 비교해 왜 그랬는지 한 문장으로 설명해 주세요.”
- **displayTextAfterObservation:** “같은40W를 1V로 공급하면 2V보다 전류는 2배예요.”
- **speechTextAfterObservation:** “전력이 같다면 전압을 절반으로 낮출 때 전류는 두 배예요. 같은 저항의 전원선 손실은 전류의 제곱이므로 네 배가 될 수 있어요.”
### ③ 시니어 — 실제 물리 한계/검증
- **physicsAssumptions:** Constant delivered 40W, same copper R2mΩ ideal path; ignores device dynamic power vs voltage/frequency, regulation, wire R(T), cooling, I²R localized package effects. 0.8/3.2W fictional not chip SKU.
- **seniorDesignReview:** IR drop, socket/package density and transient response; compare current delivery at fixed throughput/constant power vs DVFS dynamic P∝CV²f with leakage and guard bands. Need real current maps/thermal cameras for hardware.
- **sourceRefs:** [POWER-A][POWER-B]
- **teachBack:** Beginner=WHY one sentence; Intermediate=2 actual manipulated states and units; Senior=counterexample+real measurement/assumption boundary. No forced mistake.
- **nextHook:** 이 열을 GPU에서 밖으로 내보낼 땐 물을 얼마나 흘려야 할까요?

## 31-S04 · `cdu-water-loop-heat-flow` · 물은 몇 초에 얼마나 지나가야 열을 가져갈까요?
### ① 처음 1분 — 예측 먼저, 결과 숨김
- **sceneId:** `cdu-water-loop-heat-flow`
- **learningGoal:** Use m_dot=Qdot/(Cp ΔT) for ideal coolant circulation and distinguish coolant loop flow from consumed site water and heat-rejection topology.
- **priorKnowledge:** 12-S04 W=J/s, 31-S03 power loss, 12 heat/temperature mini-card
- **storyHook:** GPU가 만든 열을 물길로 빼려면 물은 그냥 조금만 있으면 될까요?
- **question:** 열100kW를 가져가는 물이 5도 올라간다면 매초 얼마나 흘러야 할까요?
- **predictionPrompt (learner):** 열100kW, 물 열용량4180J/(kg·K), 온도 상승5K와10K일 때 필요한 순환 유량이 각각 어느 쪽이 클지 먼저 예측해 보세요.
- **learnerAction:** Build chip→coldplate→rack coolant→CDU heat-exchanger→facility heat rejection as separate stages. ΔT5↔10 K and heat50↔100kW sliders then compute kg/s. Toggle facility rejection 'dry cooling' vs 'evaporative tower' and select independent site water makeup/flow direction; optional pressure/real-world restrictions card.
- **modelInputs:** heatLoad=100000W or50000W toy, Cp4180J/kg/K toy, DeltaT5 or10K, mdot=heatLoad/(Cp*DeltaT), density≈1kg/L only if showing toy volumetric equivalence, siteMakeupLiters independent unknown/option dry-or-tower (not computed from mdot).
- **displayTextBeforePrediction:** “물길로 열을 빼려면 무엇을 정해야 할까요?”
- **speechTextBeforePrediction:** “열의 양과 물이 따뜻해지는 정도를 골라보세요. 매초 흐르는 양이 얼마나 달라질지 먼저 예상해 봐요.”
### ② 중급 — 관찰 뒤 공개와 오개념 교정
- **expectedObservation (teacher-only):** At100kW, ΔT5 K=>4.784689kg/s coolant circulation; ΔT10 K=>2.392344kg/s. At ΔT5 and50kW=>2.392344kg/s. Flow number is heat transfer circulation (kg/s), NOT site water consumed (L/kWh). CDU rack loop can be closed while facility cooling tower evaporates water; dry cooling can involve other energy penalties.
- **teacherExpectedAnswer (gated):** Student predicts/inverts m_dot for two ΔT inputs, labels kg/s vs WUE L/kWh, chooses supported heat path and does not equate 4.78kg/s with water-use rate.
- **correctIncorrectCriteria:** Student predicts/inverts m_dot for two ΔT inputs, labels kg/s vs WUE L/kWh, chooses supported heat path and does not equate 4.78kg/s with water-use rate.
- **misconceptions:** [m1] 수랭 순환 유량이4.78kg/s이면 데이터센터가 물을 매초4.78kg 소비한다 / [m2] 열이 같을 때 물의 온도상승을 두 배 허용하면 유량도 두 배로 늘려야 한다 / [m3] CDU가 있으니 시설 냉각탑의 증발·보충수는 반드시0이다
- **hints L1/L2/L3:** [L1] 돌아다니는 냉각수와 밖에서 새로 보충하는 물은 같을까요? / [L2] 분모에 Cp와 ΔT가 있어요. / [L3] 칩→CDU 다음 바깥쪽 열을 버리는 방식은 어떻게 다를까요?
- **misconceptionFeedback/incorrect keyed:** [m1] “수치는 같은 물이 도는 순환량이에요. 시설 보충수·증발량은 별도 계측해야 해요.” / [m2] “같은 열을 옮기고 ΔT를2배 허용하면 이상식의 필요 질량유량은 절반이에요.” / [m3] “CDU의 밀폐 루프 뒤에도 냉각탑/칠러/건식 열교환 등 다양한 열 방출 설계가 있고 물 사용이 남을 수 있어요.”
- **feedback/correct:** “계산 결과와 다른 조건의 반례를 직접 비교해 왜 그랬는지 한 문장으로 설명해 주세요.”
- **displayTextAfterObservation:** “100kW·온도상승5K면 이상 순환유량 약4.78kg/s예요.”
- **speechTextAfterObservation:** “열 백 킬로와트를 물로 빼고 다섯 켈빈 상승을 허용하면 이상적인 순환유량은 초당 약 사 점 칠팔 킬로그램이에요. 그 물이 매초 소모된다는 뜻은 아니죠.”
### ③ 시니어 — 실제 물리 한계/검증
- **physicsAssumptions:** Steady single-phase water, Cp4180, perfect transfer, no pump head, glycol, pressure-drop, ambient dewpoint, density variation, redundancy or CDU sizing. Site water consumption not deducible from loop mdot.
- **seniorDesignReview:** Pressure drop/fouling/pump power/CDU redundancy/leak detection, mixing/hot spots, cooling tower water makeup versus closed loop; actual sustainability WUE site boundary.
- **sourceRefs:** [POWER-C][POWER-E]
- **teachBack:** Beginner=WHY one sentence; Intermediate=2 actual manipulated states and units; Senior=counterexample+real measurement/assumption boundary. No forced mistake.
- **nextHook:** 열을 처리한 데이터센터가 더 효율적이란 걸 어떤 숫자로 설명할 수 있을까요?

## 31-S05 · `data-center-pue-wue-tradeoff` · PUE가 좋은 서버가 물도 가장 적게 쓸까요?
### ① 처음 1분 — 예측 먼저, 결과 숨김
- **sceneId:** `data-center-pue-wue-tradeoff`
- **learningGoal:** Compute PUE facility/IT energy, site WUE site water/IT energy same meter boundary, recognize energy/water tradeoffs independent of token throughput.
- **priorKnowledge:** 31-S01 PSU power boundary, 31-S04 loop vs site makeup, 12-S04 kWh conversion
- **storyHook:** 데이터센터의 효율 숫자가 하나만 좋으면 모든 문제가 해결될까요?
- **question:** PUE를1.4에서1.2로 낮추면, GPU가 답을 더 빨리 내고 물도 덜 사용할까요?
- **predictionPrompt (learner):** IT 전력1MW 고정일 때 PUE1.4/1.2의 총 시설전력을 예상하고, 별도 사례 A/B의 시설 에너지·물 사용량이 다른 경우 어느 곳이 PUE/WUE에서 좋은지 먼저 선택해 보세요.
- **learnerAction:** Facility total=IT+power conversion/cooling/lighting meter blocks, IT power held1MW and PUE choices1.4/1.2, 24-hour bar. Separately compare hypothetical A IT1000kWh/facility1200kWh/water2000L and B IT1000kWh/facility1350kWh/water500L on 2 independent axes, predicted rank then after-display values. Do not include 'GPU tokens/s' counter as changed by PUE input.
- **modelInputs:** PUE=facilityEnergy/ITenergy over equal time and boundary, IT constant1MW, facility1.4/1.2MW, overhead0.4/0.2MW, 24h delta4.8MWh; WUE=siteWaterLiters/ITenergyKWh, A (IT1000kWh facility1200kWh siteWater2000L) => PUE1.2 WUE2.0L/kWh, B (IT1000 facility1350 siteWater500L) => PUE1.35 WUE0.5L/kWh. All toy scenarios.
- **displayTextBeforePrediction:** “서버 효율을 숫자 하나로만 골라도 될까요?”
- **speechTextBeforePrediction:** “GPU 전력을 같게 두고 시설 효율과 물 사용 지표를 따로 비교해 보세요. 답을 고른 뒤 결과를 열어볼까요?”
### ② 중급 — 관찰 뒤 공개와 오개념 교정
- **expectedObservation (teacher-only):** PUE improve with IT held1MW leads total power1.4→1.2MW, 0.2MW reduction, under24hr steady saves4.8MWh/day. A lower PUE1.2 but higher WUE2.0; B higher PUE1.35 but lower WUE0.5. Closed-loop recirculation does not equal site water usage; PUE alone cannot guarantee throughput/tokens/s, IT energy efficiency per answer or true lifecycle carbon impact.
- **teacherExpectedAnswer (gated):** Compute A/B PUE and WUE with units and same time denominators, compare A vs B without collapsing into one 'best' metric, say PUE != GPU performance/tokens/s.
- **correctIncorrectCriteria:** Compute A/B PUE and WUE with units and same time denominators, compare A vs B without collapsing into one 'best' metric, say PUE != GPU performance/tokens/s.
- **misconceptions:** [m1] PUE1.2이면 GPU가 p99 지연도 반드시20% 줄인다 / [m2] 순환 냉각수의 L/s를 그대로 WUE L/kWh 분자에 넣는다 / [m3] PUE가 낮은 데이터센터는 WUE도 반드시 낮고, 모든 사용자 입장에서도 최고다
- **hints L1/L2/L3:** [L1] PUE의 분모는 GPU 한 개가 아니라 같은 기간 IT 전체 에너지예요. / [L2] WUE는 사이트 전체의 물 사용 L를 IT kWh로 나눠요. / [L3] A와 B의 PUE 순위와 WUE 순위를 따로 확인해 봐요.
- **misconceptionFeedback/incorrect keyed:** [m1] “PUE는 시설 에너지 비율이에요. GPU 처리량과 응답 지연은 워크로드·DVFS·IT 설계 등 별도 지표예요.” / [m2] “순환유량과 사이트 보충/소비 수량은 다르며, WUE는 같은 기간 물사용량/IT 전기에너지예요.” / [m3] “예시 A는 전기 사용 비율이 좋지만 물 사용량이 더 많을 수 있어요. 두 지표와 현장 조건을 따로 비교해야 해요.”
- **feedback/correct:** “계산 결과와 다른 조건의 반례를 직접 비교해 왜 그랬는지 한 문장으로 설명해 주세요.”
- **displayTextAfterObservation:** “낮은 PUE가 반드시 낮은 WUE를 뜻하지는 않아요.”
- **speechTextAfterObservation:** “같은 IT 전력에서 PUE를 낮추면 시설 에너지는 줄 수 있어요. 하지만 물 사용량을 뜻하는 WUE는 따로 측정해야 하므로 두 지표 순위가 뒤집힐 수도 있죠.”
### ③ 시니어 — 실제 물리 한계/검증
- **physicsAssumptions:** Invented 1MW steady24h and A/B 1000kWh annual/monthly-like equal period toy; PUE/WUE both meter boundary consistent, no actual sites or GPU token/s performance. Water lifecycle and carbon not captured.
- **seniorDesignReview:** Meter boundary and period alignment, UPS/fans/water pump shared facilities accounting, energy/token and throughput+p99 plus WUE and coolant/power reliability co-optimization; PUE 1 not facility site sustainability 'perfect'.
- **sourceRefs:** [POWER-C][POWER-D][POWER-E]
- **teachBack:** Beginner=WHY one sentence; Intermediate=2 actual manipulated states and units; Senior=counterexample+real measurement/assumption boundary. No forced mistake.
- **nextHook:** 이제 10 AI 데이터센터 E2E와 32 SLO/장애 복구에서 전원·냉각까지 포함한 병목을 진단할까요?

## A05 SceneSpec after A07 EDU_QA_PASS_SOURCE only
| Step / Scene | Student's independent levers & negative case | Checkable toy science |
|---|---|---|
| 31-S01 `server-psu-loss-heat` | PSU eta90/95, Pin/Pout/loss arrows, incorrect loss10W available | Pout100W eta0.9 =>Pin111.111W loss11.111W; eta0.95=>Pin105.263 loss5.263 |
| 31-S02 `gpu-buck-vrm-duty-ratio` | Vin12 D1/4,1/3,1/2, output current10A, eta0.9 or ideal, real-world mode caveat | ideal CCM Vout3/4/6V; at4V×10A η0.9 Pin44.444W Iin3.7037A |
| 31-S03 `gpu-pdn-current-heat` | constant P40W rail2V/1V, path R2mΩ/1mΩ, current and IR drop independent | I20→40A, fixed R2mΩ heat0.8→3.2W (×4) and Vdrop0.04→0.08V |
| 31-S04 `cdu-water-loop-heat-flow` | Qdot50/100kW, deltaT5/10K, CDU vs dry cooler/tower, site makeup independent |100kW 5K=>4.78469kg/s;10K=>2.39234kg/s **recirculation not consumption** |
| 31-S05 `data-center-pue-wue-tradeoff` | IT constant1MW PUE1.4/1.2, 1000kWh meter A/B PUE vs WUE cards | facility1.4→1.2MW; saving4.8MWh per day; A PUE1.2 WUE2, B PUE1.35 WUE0.5L/kWh |
- **A07 QA tests requested:** Every pre Voice neutral/no numeric answer; three incorrect choices physically available with distinct feedback; PSU loss denominator trap, buck CCM ideal scope, PDN constant-P counterexample, pump flow≠site consumption, PUE vs WUE independent metrics and correct units. No fake measured hardware/spec card.
- **A05 production**: original 2.5D objects (switches, inductor, cold plate, CDU), mobile touch/keyboard/aria/reduced motion/three-level hints, scientific model state and controls; after source QA only. A02 app engine separate tested integration. No main merge or deploy.

## Source URLs and verification 2026-10-17 (public)
[POWER-A] TI education buck video https://www.ti.com/ko-kr/video/4523892863001
[POWER-B] TI public buck reference design https://www.ti.com/tool/PMP20807
[POWER-C] U.S. DOE/FEMP open guide PUE/WUE/CDU https://www.energy.gov/cmei/femp/cooling-water-efficiency-opportunities-federal-data-centers
[POWER-D] The Green Grid legacy PUE glossary https://www.thegreengrid.org/resources/glossary?combine=pue
[POWER-E] Uptime June2026 public PUE/WUE webinar summary https://intelligence.uptimeinstitute.com/resource/replay-uptime-intelligence-client-webinar-view-efficiency-through-pue-and-wue
