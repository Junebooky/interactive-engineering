# A06 deep dive 12 · V/I/R/RC와 전력·에너지: MOS·DRAM·GPU의 선수 원리
ReviewedAt: 2026-10-17 · FACT CHECKED source(OpenStax university physics Volume2) / TOY MODEL examples, NOT measured silicon/RC parasitics.

## 전압/전류의 물리와 흔한 '물길' 비유 실패
- V=ΔU/q (J/C), I=dq/dt (C/s). 배터리에 전압이 걸린 회로가 open이면 steady-state 전도전류는 0, 도선 자체의 내부 현상/정전용량이나 leakage를 '절대 0'이라고 단정하지 않는다.
- '전자=물방울, 전선=관'은 물리적으로 부정확한 부분이 있다: 회로에서 신호/전자기장 전파와 전자 drift는 같은 속도가 아니다. 진짜 전자는 주로 금속 도선 내 음전하 carrier; 관습전류는 양전하 이동 방향 정의. 반도체에는 hole drift 포함해 단순 물길 비유를 버려야 한다.
- Ohm's law I=V/R applies to **ohmic linear** resistors under fixed material and temperature; diode/MOSFET nonlinear switches don't obey constant R.

## 검산 1: 저항과 보존
- Ideal source 5V & 1kΩ, loop closed: I=5/1000=0.005A=5mA, P=0.025W=25mW. Open: I=0; source still potential difference 5V, actual ideal voltmeter loading ignored.
- Series (R1=R2=1kΩ): Req=2kΩ, I=2.5mA and VR1=VR2=2.5V. Parallel: Req=500Ω; I_total=10mA, each branch5mA. KCL at split 10=5+5mA; power in resistors 5V×10mA=50mW parallel, 5V×2.5mA=12.5mW series. Comparing resistor count without topology is misleading.
- Circuit nodes vs branch current: lumped quasi-static approximation, neglect inductance/transmission-line propagation and leakage. For high-speed SerDes/PCIe **KCL still applies**, but need distributed RC/L/C and eye-diagram analysis.

## 검산 2: RC is time, not permanent storage
- Q=C V, τ=RC; C=10µF=10e−6F, R=1kΩ gives τ=0.010s=10ms because Ω×F=s. At V_S=5V, charge after τ VC=5(1−e^−1)=3.1606V, after 3τ VC≈4.751V. Charge approaches 5V asymptotically, it does not reach 100% exactly at 10ms. Discharge from full after τ VC=5e^−1≈1.8394V.
- Changing R or C doubles τ if only that variable doubles (linear lumped model). If the capacitor is **physically isolated**, there is no ideal resistive discharge path; stored charge can remain in an ideal toy model, while physical leakage always sets a finite practical retention (and DRAM requires sensing+refresh). If switch toggles halfway, initial capacitor voltage must be carried to next segment, not restart blindly at 0 or 5.
- MOS capacitor oxide can be charged/discharged electrostatically through external gate electrodes; under ideal DC the gate oxide has near zero conduction while electric field changes Si surface charge. The analogy “one transistor gate is a resistor with steady electron flow” is wrong.

## 검산 3: W vs J vs Wh, capacitor energy and charging losses
- P=VI=I²R=V²/R (ohmic resistor). Given V=5V, I=0.010A, constant T=10s: P=0.05W=50mW and E=P t=0.5J. 1Wh=3600J, so 0.5J≈0.0001389Wh (toy).
- E_cap=½ C V² =½×10e−6F×25V²=125e−6J=125µJ at5V, at10V 500µJ (4× if C constant). This is **energy stored in the capacitor**, not necessarily energy drawn from a real source to charge it through a resistor. In a simple ideal constant voltage source through dissipative resistor from uncharged state, source work QV=CV² while capacitor ends with half CV² and resistor dissipates the other half (switching losses; assuming zero energy recovery).
- *System connection*: billions of switching capacitances imply dynamic CMOS energy and power ~α C V² f; CPU/GPU real energy includes static leakage, clock trees, distribution, memory, interconnect, regulators, and cooling—do not teach “all CMOS power is only capacitor E”.
- Unit soundness: W=J/s, Ω=V/A, F=C/V, ε oxide measured F/m, power budget measured W, annual PUE requires energy ratio.

## Design counterexamples and acceptance
- 5V→10V across *fixed resistance* gives current and power 2× and 4× respectively; lesson 12-S04 allows V and I independent because it explicitly models a configurable load, not a fixed 500Ω resistor. A05 must label this or lock I=V/R if fixed R chosen.
- Switching capacitor into short circuit yields high transient current limited by ESR/inductance/driver; simple RC model should not encourage applying arbitrary real device voltages.
- 'DRAM refresh interval=τ from 1kΩ×10µF' is false; real DRAM includes leakage mechanisms/retention distribution, sense amps, physical fF scales, process T/P variations.
- Toy plotted charging instantaneous current at t=0+ should be 5mA for R=1kΩ; t=τ drops to 1.839mA. This is an *RC loop* demonstration, not a model of complete memory-controller read latency.

## Referenced source ledger
[EL1] https://openstax.org/books/college-physics/pages/20-2-ohms-law-resistance-and-simple-circuits · ohmic I=V/R and limitations.
[EL2] https://openstax.org/books/university-physics-volume-2/pages/9-5-electrical-energy-and-power · P=VI, resistor conversion to heat.
[EL3] https://openstax.org/books/university-physics-volume-2/pages/10-key-equations · KCL/KVL, RC.
[EL4] https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits · RC charge/discharge and τ.
[EL5] https://openstax.org/books/university-physics-volume-2/pages/8-3-energy-stored-in-a-capacitor · C V²/2.
ReviewedAt=2026-10-17; university textbook confidence high for ideal circuit theory, low for any specific fabricated component. Hardware measurements, parasitic time constants, operating voltage and thermal safety **not tested**. 
