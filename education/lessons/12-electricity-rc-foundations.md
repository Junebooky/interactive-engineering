# 12 · 전기가 움직이고 기억하는 가장 작은 실험 — V/I/R/RC/Power
> A06 · 2026-10-17 · 4 Step **STORY_READY** (text/content self QA); A05 visualization, browser tests, student comprehension **NOT RUN**. 초보자 40–50분 추정. 전자·전압·회로 단위를 먼저 익힌 후 [11 PN junction](11-doping-pn-foundations.md) → [14 MOS capacitor](../production-backlog.md) → [01 MOSFET](01-mosfet-to-logic.md).
> 학습 규칙: 예측(전압·전류 가리고)→조작→단위와 관찰→오개념 별 이유→nextHook. 실물 전기 회로에 연결하는 안내가 아닌 안전한 **toy simulation**. UI/한국어 TTS 분리, 3겹 점진 공개.

## 12-S01 · `charge-voltage-current-arrows`
### ① 1분 훅
- **learningGoal:** 전압(전하당 에너지), 전류(전하의 이동률), 양의 관습전류와 전자의 실제 이동을 구분.
- **priorKnowledge:** 없음. **학습 시작 40초**: 전자 음전하, 한쪽에 전하가 많거나 적을 수 있음, Q 단위 C(쿨롱), 양전하 이동 방향을 관습전류(전류계 정의), 금속 전자의 실제 이동은 반대 방향. 이 카드도 예측 문제의 OPEN=0A 정답은 알려주지 않는다.
- **storyHook:** “배터리가 5볼트인데, 전자 하나도 아직 흐르지 않을 수 있나요?”
- **question:** 회로를 끊으면 전압과 전류가 둘 다 0일까요?
- **predictionPrompt (learner-visible only):** 이상적 전원 5V·저항 1kΩ에서 스위치 OPEN/CLOSED 각각의 전원단자 전압과 회로 전류를 예상해 보세요.
- **learnerAction:** 5V source·1kΩ·switch를 연결. OFF/ON 토글한 후 전자 이동 화살표와 관습전류를 바꿔 관찰.
- **modelInputs:** V=0/5 V; R=1kΩ; switch OPEN/CLOSED; ideal DC; no battery internal resistance.
- **expectedObservation:** 5V ideal source를 연결해도 OPEN이면 I=0A; CLOSE면 I=V/R=5mA. 금속 저항 전자 이동과 관습전류는 반대 방향; 전압은 '초당 전하량'이 아님.
- **teacherExpectedAnswer (gated; never pre-prediction/aria/Voice):** 5V ideal source와 R=1kΩ resistor, switch OFF/ON의 current 0 또는 5mA를 예상.
- **displayText:** “5V 전원에 연결된 스위치를 열면 계기는 어떻게 바뀔까요?”
- **speechText:** “스위치를 열었을 때와 닫았을 때를 먼저 예상해 보세요. 전압계와 전류계가 같은 값을 말해줄까요?”
### ② 조작/피드백
- **correctIncorrectCriteria:** OFF=0A/ON=5mA, electron vs conventional current arrows 반대, V≠I를 모두 말해야 pass.
- **misconceptions:** [m1] 5V가 있으면 언제나 5A 전류가 흐른다. [m2] 전자 이동과 관습전류 방향은 반드시 동일하다. [m3] 스위치 OPEN이면 이상적 배터리의 전압도 반드시 사라진다.
- **hints:** L1 회로가 열려 있으면 닫힌 경로가 있나요? / L2 저항에 흐르는 I=V/R, 1kΩ=1000Ω / L3 전자가 음전하임을 생각해요.
- **feedback/incorrect keyed:** m1 “볼트는 전류 단위가 아니에요. 저항을 나눠요.” / m2 “금속 도선의 전자는 음전하라 관습전류와 반대 방향이에요.” / m3 “스위치는 전류 경로를 끊지만 전원 단자 간 전위차는 남을 수 있어요.”
- **feedback/correct:** “전압은 차이, 전류는 흐름, 저항은 그 흐름과 관련 있음을 찾아냈어요.”
- **explanation:** V=ΔU/q (J/C), I=dQ/dt (C/s=A). Ohmic resistor I=V/R, power sources with ideal zero internal resistance assumption.
### ③ Senior
- **physicsAssumptions:** metal conduction example; AC, displacement current, parasitic leakage, non-ohmic device, switch arc ignored. Turn OFF circuit open means no DC conduction path, not that electrostatic field ceases.
- **sourceRefs:** [EL1][EL2]
- **teachBack:** 어떤 값이 0이고 왜인지, 측정 위치/전류계·전압계 연결법까지.
- **nextHook:** “이제 길이 닫혔어요. 저항을 두 개 놓으면 전류는 어떻게 나뉠까요?”

## 12-S02 · `resistors-series-parallel-kcl`
### ① 1분 훅
- **learningGoal:** 직렬·병렬 저항과 전류/전압 보존(KCL/KVL), power를 이해하기 전 회로 연산.
- **priorKnowledge:** 12-S01.
- **storyHook:** “길을 두 갈래로 나누면 전기가 두 배로 생길까요?”
- **question:** 같은 1kΩ 저항 두 개를 직렬 또는 병렬로 연결하면 전류는?
- **predictionPrompt (learner-visible only):** 5V, 1kΩ 저항 2개를 직렬/병렬로 놓았을 때 각 저항 전압과 전원 총 전류를 숫자로 예상해 보세요.
- **learnerAction:** resistor placement series/parallel toggle, 각 가지 전류 화살표·노드 합계를 관찰하고 전압이 어떻게 분배되는지 고르기.
- **modelInputs:** source V=5V, R1=R2=1kΩ, topology series/parallel, ideal wiring/DC steady state.
- **expectedObservation:** series: Req=2000Ω, I=2.5mA, each VR=2.5V. parallel: Req=500Ω, I=10mA total, 각 branch 5mA, 각 VR=5V. node에서 유입전류=유출전류.
- **teacherExpectedAnswer (gated; never pre-prediction/aria/Voice):** V=5V, 직렬 Req=2kΩ·I=2.5mA vs 병렬 Req=500Ω·Itotal=10mA. 분기 전류 5mA+5mA.
- **displayText:** “한 줄과 두 갈래, 전류 합은 얼마일까요?”
- **speechText:** “저항 두 개를 직렬과 병렬로 바꿔 보세요. 각 갈래의 숫자를 더하면 어떤 규칙이 보일까요?”
### ② 조작/피드백
- **correctIncorrectCriteria:** 두 토폴로지 전류값과 각 branch 전류/전압을 구별, KCL을 지킬 것.
- **misconceptions:** [m1] 병렬 두 저항의 전체 전류는 언제나 한 저항과 같다. [m2] 직렬 회로에서는 두 저항을 지날 때 전류가 차례로 줄어든다. [m3] 전류가 갈라지면 전하가 생성된다.
- **hints:** L1 두 가지 병렬 저항의 Req는? / L2 직렬엔 갈림길이 있나요? / L3 노드 앞과 뒤의 전류량을 더해보세요.
- **feedback/incorrect keyed:** m1 “같은 전압이 두 갈래에 걸리므로 source 총 전류가 늘 수 있어요.” / m2 “정상상태 직렬 전류는 두 소자에서 같아요.” / m3 “보존법칙에 의해 유입전류와 유출전류 합이 같아요.”
- **feedback/correct:** “전류가 나뉘어도 전체는 보존된다는 걸 계산했어요.”
- **explanation:** Ohmic ideal resistors, Req series=R1+R2; parallel reciprocal; sum(Iin)=sum(Iout), sum(Vloop)=0.
### ③ Senior
- **physicsAssumptions:** no wire resistance/inductance/heat resistance drift, current source limits ignored; 5V source ideal. Power load changed with circuit topology.
- **sourceRefs:** [EL1][EL3]
- **teachBack:** 임의 노드 하나를 그려 직렬/병렬과 KCL 수치 검산.
- **nextHook:** “잠깐 전기를 저장하는 부품은 저항과 어떻게 다를까요?”

## 12-S03 · `capacitor-rc-charge-discharge`
### ① 1분 훅
- **learningGoal:** Q=CV, RC 시간상수, 전원에서 끊은 capacitor의 충전·방전과 DRAM의 차이를 발견.
- **priorKnowledge:** 12-S01/02; 도함수·지수식은 senior만 공개.
- **storyHook:** “커패시터에 전하를 넣으면 금방 꽉 찰까요?”
- **question:** 1kΩ 저항+10µF 커패시터는 5V 전원에 연결한 뒤 얼마나 기다려야 63% 정도 충전될까요?
- **predictionPrompt (learner-visible only):** R=1kΩ, C=10µF, V_S=5V일 때 충전 10ms/30ms 뒤 V_C와 완전충전 후 방전 10ms 뒤 V_C를 예상해 보세요.
- **learnerAction:** R=1/2kΩ, C=10/20µF 및 t=0/10/30ms slider, charge/discharge switching, VC(t) and I(t) compare.
- **modelInputs:** source=5V, R=1000/2000Ω, C=10e−6/20e−6F, time 0–100ms, ideal 1st-order no leakage.
- **expectedObservation:** default τ=10ms; charge VC=5(1−exp(−t/τ)): VC(0)=0V, VC(τ)≈3.16V, VC(3τ)≈4.75V. discharge from full=5exp(−t/τ): VC(τ)≈1.84V. Icharge initially 5mA and decreases with t, not constant.
- **teacherExpectedAnswer (gated; never pre-prediction/aria/Voice):** τ=RC=0.010s=10ms; t=τ에서 VC≈3.16V, t=3τ에서≈4.75V.
- **displayText:** “5V까지 얼마나 빨리 가까워질까요?”
- **speechText:** “시간 눈금을 움직이기 전에 10밀리초 뒤 전압을 예상해 보세요. 저항이나 커패시턴스도 바꿔볼까요?”
### ② 조작/피드백
- **correctIncorrectCriteria:** τ in seconds/milliseconds, 63%/37%, R or C doubled doubles τ, 0ms/open switch state correctly; '전원 끊으면 항상 당장 0' 오답.
- **misconceptions:** [m1] 10ms 후 항상 정확히 100% 충전된다. [m2] R·C를 두 배로 해도 충전속도는 같다. [m3] 모든 커패시터는 전원을 제거하면 반드시 즉시 0V가 된다.
- **hints:** L1 한 시간상수의 충전율은 1−e^(−1) / L2 τ=R×C의 단위를 보세요 / L3 방전 길이와 누설은 회로에 따라 달라져요.
- **feedback/incorrect keyed:** m1 “τ는 약 63%에 도달하는 시간이죠.” / m2 “R·C 곱이 커지면 더 오래 걸려요.” / m3 “전하를 빼는 경로가 있느냐에 따라 소모속도가 달라져요.”
- **feedback/correct:** “저항과 커패시턴스가 ‘기다리는 시간’을 정한다는 걸 찾았어요.”
- **explanation:** first-order RC: τ=RC, VCcharge=Vs(1−exp(−t/τ)), VCdischarge=V0 exp(−t/τ). Ideal capacitor stores electric-field energy. **DRAM은 무한 보존이 아니며 retention/refresh 및 reading disturbance 별도**.
### ③ Senior
- **physicsAssumptions:** no parasitic R/C, access transistor dynamics/DRAM sense amp, voltage-dependent capacitance, leakage/ESR; toy R/C/time numbers not DRAM product.
- **sourceRefs:** [EL4][EL5]
- **teachBack:** 전압 0.632Vs/0.368Vs, t=RC units and real leakage counterexample.
- **nextHook:** “전하를 저장하면 에너지는 어디에 있을까요? GPU가 쓰는 전력과도 연결될까요?”

## 12-S04 · `power-energy-joules-heat`
### ① 1분 훅
- **learningGoal:** P=VI (W), E=P t (J), Ecap=½CV² 및 열 예산의 구분.
- **priorKnowledge:** 12-S01~03.
- **storyHook:** “똑같이 5V인데 어떤 회로는 뜨겁고 어떤 회로는 거의 안 뜨거워요.”
- **question:** 5V×10mA가 몇 W, 그 상태로 10초면 몇 J? 10µF를 5V로 충전한 capacitor는 에너지 얼마?
- **predictionPrompt (learner-visible only):** 5V·10mA를 10초 사용할 때 전력/에너지와 10µF 커패시터가 5V일 때 내부 저장에너지를 각각 예상해 보세요.
- **learnerAction:** source V=5/10V, load I=5/10mA toy, operation time 1/10s, capacitor 10µF, charger energy card; power/energy/heat channels separate.
- **modelInputs:** V=5/10 V; I=5/10mA independent toy load (not fixed resistor); t=1/10s; C=10µF, Vcap=5/10V; steady DC ideal efficiency.
- **expectedObservation:** 5V×0.010A=0.05W; 10s→0.5J. capacitor at5V: 0.5×10µF×25V²=125µJ; at10V: 500µJ (4x), though charger input energy/dissipation depends on circuit.
- **teacherExpectedAnswer (gated; never pre-prediction/aria/Voice):** P=0.050W=50mW, E=0.5J, Ecap=125µJ.
- **displayText:** “50mW와 0.5J, 무엇이 다를까요?”
- **speechText:** “5볼트, 10밀리암페어, 10초를 골라 보세요. 에너지와 소비 속도는 같은 단위일까요?”
### ② 조작/피드백
- **correctIncorrectCriteria:** W=J/s, 50mW/0.5J/125µJ; capacitance held constant V doubling quadruples stored energy; source power not always all heat.
- **misconceptions:** [m1] 50W와 50J는 같은 단위다. [m2] 커패시터 전압 2배면 저장 에너지도 반드시 2배다. [m3] GPU가 소비한 모든 전력은 동일 시점에 CPU 냉각 팬에서 발생한다.
- **hints:** L1 전력=에너지/시간 / L2 커패시터 에너지에 V²가 등장해요 / L3 발열은 소자·전력 전달/저장·냉각 시스템에 걸쳐 있어요.
- **feedback/incorrect keyed:** m1 “W는 J/s, J는 축적된 에너지예요.” / m2 “C가 같으면 에너지는 V의 제곱에 비례해요.” / m3 “전력 사용/열 발생 위치와 냉각 비용은 시스템 구조에 따라 달라요.”
- **feedback/correct:** “이제 작은 capacitor와 큰 랙의 에너지를 같은 단위로 설명할 수 있어요.”
- **explanation:** electric power P=VI=V²/R for ohmic R; energy E=∫Pdt; capacitor stored E=½CV². DRAM cells use tiny C; VRM/PSU/cooling face efficiency/heat trade-offs.
### ③ Senior
- **physicsAssumptions:** I independent input is toy configurable load; does not imply same fixed R at both V/I settings. 5V 10mA 10s constant power assumption; capacitor charging resistor energy losses/PSU efficiencies omitted; no actual GPU thermals.
- **sourceRefs:** [EL5][EL6]
- **teachBack:** W vs J vs Wh conversion, what meter reports; identify capacitive vs resistive energy, real system heat.
- **nextHook:** “이제 실리콘 결정에 약간의 도핑을 넣어볼까요? → 11 도핑/PN 접합 → 14 MOS capacitor → 01 MOSFET”

## A05 제작 계약 / 4-Step QA
- 독립 2.5D 회로 실험이지만 구현 위치·상태관리는 A05, Lesson Engine/Voice global tracking은 A02 책임. 4개 sceneId는 위 헤더 문자열이 정규 식별자.
- 정답 관찰은 prediction 이전 숨김. 스위치 OFF 상태의 전압 표시와 electron vs conventional arrows를 분리. 터치/키보드/축소모션/읽기 대체, 최소 3개 오답원인/힌트3단계를 연결.
- 12-S03 R/C selectable 이므로 값 변경 시 τ와 이론 곡선, 충전/방전 초기 조건·상태를 함께 재설정. **초기 0ms ‘예측만’** 누른 것을 조작 방문으로 자동 승급할지 여부는 엔진 계약에 맞추고 수치 비교 증거는 실제 action으로 기록.
- “RC toy time=10ms”는 실제 DRAM retention ms가 아님. 12-S04 capacitor input energy ≠ stored energy when resistor dissipation is present; watt vs joule vs watt-hour clarity.
- source QA 자체 체크: 4 Step × (goal/prereq/why/prediction/action/input/observation/criteria/misconceptions3/hints3/keyed feedback3/voice/next/sources/limitations) PASS. **코드·브라우저·사용자 테스트는 미수행**.

## 출처 (reviewed 2026-10-17)
[EL1] https://openstax.org/books/college-physics/pages/20-2-ohms-law-resistance-and-simple-circuits · Ohm and V/I/R.
[EL2] https://openstax.org/books/university-physics-volume-2/pages/9-5-electrical-energy-and-power · electric field and P=IV.
[EL3] https://openstax.org/books/university-physics-volume-2/pages/10-key-equations · Kirchhoff circuits.
[EL4] https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits · RC τ, charge/discharge.
[EL5] https://openstax.org/books/university-physics-volume-2/pages/8-3-energy-stored-in-a-capacitor · E=½CV².
[EL6] https://openstax.org/books/university-physics-volume-2/pages/9-5-electrical-energy-and-power · watts and energy.

## A07 Round 02 교정 · pre-/post-observation 분리와 선수지식 브리지
원본 pre-prediction display/voice는 **중립적 질문만** 나오도록 수정. source [A07 round 02](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-02-foundations-g03-audit.md).
| Scene | after-observation displayText | after-observation speechText |
|---|---|---|
| charge-voltage-current-arrows | 전원 5V와 회로 전류 0A는 동시에 가능해요 | 열린 회로에서도 이상적 전원 양단의 전압은 5볼트지만 직류 전도전류는 0이에요. 닫힌 1킬로옴 회로는 5밀리암페어예요. |
| resistors-series-parallel-kcl | 직렬 2.5mA, 병렬은 5+5=10mA | 직렬은 같은 전류가 흐르고, 병렬은 전류가 두 갈래로 나뉘어요. 노드에서 유입과 유출은 같아요. |
| capacitor-rc-charge-discharge | RC=10ms, 한 시정수 후 약 3.16V | 기본 1킬로옴과 10마이크로패럿은 시정수 10밀리초예요. 충전 10밀리초에는 약 3.16볼트죠. 진짜 DRAM 보존시간은 아니에요. |
| power-energy-joules-heat | 50mW×10초=0.5J예요 | 전력은 순간 에너지 사용률이에요. 5볼트에서 10밀리암페어를 10초 쓰면 0.5줄입니다. 축전기 자체 저장 에너지는 회로가 공급한 총 에너지와 다를 수 있어요. |
**Visibility:** 아직 예측하지 않은 상태의 readout·TTS·aria 및 정답 조건 힌트에서 post 정량값/원리 노출 금지. 사용자가 조작을 한 뒤 현재 모델 결과와 일치하는 after-observation 문구만 보여준다.
**Charge concept map:** Atlas `P01`의 *공통 Q, C, e− charge sign, conventional current* 부분은 **12-S01 처음 40초**. hole·carrier 도핑의 상세는 11-S01/S02로 이어진다. 전하라는 말 자체를 처음 만나는 사람을 위해 용어 카드(정답 노출 없는)를 제공.
**RC action state:** 충전→방전 전환 시 직전 실제 `Vcap(t0)`을 `V0`로 사용: `V(t0+Δt)=V0 exp(−Δt/RC)`; R/C 변경 시 τ 재계산. "다 찬 5V에서만 방전"은 **preset fully charged** 시나리오로 명시, 임의 시점 전환과 혼동 금지.
**Math gap:** `P08`의 확률·p99/로그 개념은 이 레슨이 가르치지 않으므로 `P08=PARTIAL`, 추천 13 lesson bridge 또는 09-S04 전 짧은 학습카드를 배정한다.

## A07 Round 04 SOURCE MAJOR 교정 — predictionPrompt vs teacherExpectedAnswer (2026-10-17)
- A07 review [Round04](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-04-a06-retest-mos14.md) identified that even after display/Voice were made neutral, `prediction` was carrying a teacher key. This update turns all 4 cases into **neutral learner-visible `predictionPrompt`** plus separate **`teacherExpectedAnswer`** after the `expectedObservation` for author-only grading. **Never render** teacherExpectedAnswer, expectedObservation, correctIncorrectCriteria, post-observation text, or full misconception feedback in student UI/aria/Voice before saved prediction and actual manipulation.
- `predictionPrompt` alone is safe to expose before action, hints appear only on learner request, and even correct numeric alternatives should not be styled or sorted as a solution. Store answer as teacher-only script/data, never pass as pre-reveal lesson props. A05 and A02 existing scenes/engine need code-level copy comparison and negative-case UI/TTS evidence; this source fix does **not** imply browser pass.
- **STATE:** A06 canonical fix awaiting A07 independent SOURCE_RECHECK on updated blob. A05 scene changes and A02 integration are separate.
