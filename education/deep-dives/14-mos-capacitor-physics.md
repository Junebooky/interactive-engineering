# 14 · MOS 커패시터 심화 근거: 산화막 전계→표면 캐리어→문턱→MOSFET
> 2026-10-17 KST A06 연구/공학 자가 QA. **A07 독립 검토 요청 전 원고/근거 단계**, EDU_QA_PASS 아님. 출처 [MIT OCW 6.012 Lecture 9 실제 PDF slide 1,8,13,14 확인], MIT 6.012 course notes + MIT Spring lecture7-8 outline; C–V secondary reference로 독립 교차. MIT 그림 복제 금지, A05는 원리만 적용해 독자 시각물 창작.

## 1. 왜 기존 PN·MOS 사이에 이 레슨이 꼭 필요한가?
기존 12 전기·RC는 전계/정전용량을 소개하고 11은 n/p 도핑·접합 장벽을 가르친다. 하지만 01 MOSFET 첫 화면의 “게이트로 반전층 만든다”는 **PN diode forward current와 다르며 SiO₂ 절연막을 통과하는 DC 전류가 아니라 전계가 반도체 표면 전하 분포를 바꾸는 동작**이다. 그 차이를 바로 이해할 선수 모형이 MOS capacitor.
- Gate / oxide / semiconductor + backside body contact가 갖춰진 2-terminal MOS capacitor와 nMOSFET의 gate/source/drain/body를 별도 비교.
- p형 Si bulk라도 양의 gate-bulk 전압을 충분히 주면 Si 표면에 minority electrons가 모여 **inversion**이 일어날 수 있음. 도핑 원자 자체가 n형으로 변하지 않는다. p형 실리콘의 정공이 밀려나는 depletion 단계는 표면 이동정공이 감소하고 **음의 고정 acceptor ion**이 드러난다는 뜻이며 '공핍층 전체가 완전 진공'이 아님.
- 반대쪽 **negative gate bias (relative to V_FB)**에서는 p형 다수 정공이 표면 쪽에 모이는 accumulation. zero gate **항상 flatband이 아님**: 금속/Si work function, oxide/interface trapped charge, depletion에 따라 V_FB 이동. MIT 2009 Lecture9 slide1은 *0V에서 이미 depletion*인 사례를 직접 제시하므로, 간단한 스위칭 단순화로 VGB=0을 **flatband**라고 일반화하면 과학 오류.

## 2. Toy quantitative model / 직접 검산
선언한 1D ideal toy: T=300K; p-Si Na=1.0×10^16 cm⁻³; ni=1.0×10^10 cm⁻³(반올림); oxide εox=3.9ε0; Si εSi=11.7ε0; ε0=8.8541878128×10⁻¹⁴ F/cm; tox=5nm(5×10⁻⁷cm), workfunction/charge chosen **V_FB=0 V** (특수 이상 모형), q=1.602176634×10⁻¹⁹ C.
- `Cox′=εox/tox=(3.9×8.8541878128e−14 F/cm)/(5e−7 cm)=6.906266493984e−7 F/cm² = 0.6906266493984 µF/cm² = 0.006906266493984 F/m²`. ε 단위 F/cm, tox cm, 결과 F/cm².
- `φF=(kT/q) ln(Na/ni)` = 0.35715857599 V (positive *magnitude* for p-type doping, convention depends on source); `2φF≈0.71431715 V`. This is **surface potential** at strong-inversion threshold in the ideal 1D convention, **NOT** the MOS external gate threshold and **NOT** the same as PN built-in voltage in general. Na=Nd=1e16, ni=1e10 made PN Vbi numerically ≈0.7143V but that coincidence is **specific to inputs**: PN has ln(NaNd/ni²), MOS 2φF has 2ln(Na/ni).
- `Wdep,max=√[4 εSi φF/(q Na)] = 0.3039293463 µm` and `|Qdep,max′|=q Na W=4.869484970318e−8 C/cm²`.
- `V_T,ideal = V_FB + 2φF + |Qdep,max′|/Cox′ ≈ 0 + 0.714317152 + 0.070508211 = 0.784825363 V` for this toy. ε/Na/T varied, V_FB shifted by workfunction/fixed charges, body bias / interface traps/short channel effects change V_T. Threshold is **NOT** universal 0.7V. Existing M01 **0.7V** is a separate educational toy, not an inconsistency when each scene's independent parameters are labeled and their coupling is not falsely asserted.
- At tox=10nm holding all others fixed, Cox′=0.3453133246992 µF/cm² (half), `V_T≈0.8553335745V` (because depletion-charge term doubles), **but** modern EOT stack, quantum capacitance, leakage, high-k workfunction and interface properties mean this is not a universal law about real advanced-node V_T. Student level compares **capacitance** only; Vth formula is a *senior expandable*.
- Gate oxide field `Eox≈Vox/tox` only when oxide voltage `Vox` known; **V_GB** splits between flat-band offset, semiconductor surface potential and oxide drop, so **Eox ≠ V_GB/tox** at all biases. `ΔQ′≈Cox′ΔVox` for ideal oxide (per unit area), not arbitrary ΔVG. 5nm thickness number is a didactic input, not physical gate oxide spec for a modern FinFET/GAA stack.

## 3. Piecewise qualitative student scene — avoid fake 0V boundaries
For simple **separate cartoon** choose `V_FB=0` and threshold from same toy `V_T≈0.785`. At V_GB=-0.5V: p-type hole accumulation; at V_GB=0V **flat band**; at +0.3V depletion (positive ionized acceptors stationary); at +1.1V strong inversion (electron-rich surface). Region labels are **illustrative states**, not TCAD result or guaranteed physical charge density; no hard discontinuity at V_T, weak inversion before threshold exists.
- When changing tox and recalculating V_T, **region classification must update** based on dynamically computed threshold and V_FB. The graphical depletion width must not be represented as PN junction W; for MOS it is vertical depletion into substrate under gate, not a PN diode barrier.
- **Oxide DC**: ideal `Igate,DC≈0` but during changing gate bias there is **capacitive displacement current** through circuit and finite gate charge; leakage/trap-assisted transport/tunneling/oxide breakdown mean real device IG not exactly zero. State on screen: “이상화: DC 게이트 전도 거의 0, 변화 순간 전류 있을 수 있음.”
- **No drain current in two-terminal MOS capacitor**: no source/drain conducting path to compare `I_D`; cannot say “inversion means a huge drain current flows automatically.” In 3-terminal MOSFET with both source/drain present, inversion can support channel **when V_DS applied**, subject to contacts/geometry/temperature/current models. At V_DS=0, ideal net I_D=0 independent of whether inversion layer exists.

## 4. C–V trap for teaching and engineer QA
At low negative voltage in p-substrate accumulation, measured gate capacitance can approach Cox. Depletion adds silicon depletion capacitance **in series**: `1/Ctotal′≈1/Cox′+1/Cdep′` → C smaller. At strong inversion **low-frequency/quasistatic** minority carriers can respond, C tends upward toward Cox; **high frequency** inversion carriers may fail to follow AC, so high-frequency trace can remain near minimum C. Actual high-frequency/low-frequency boundary, deep depletion and leakage depend on generation rate, contacts/bias history and measurement frequency/temperature/device design. No single ‘inversion capacitance must always be Cox’ claim.
- The role of oxide EOT vs physical thickness, `Cox` and threshold, leakage vs gate control, frequency, hysteresis (interface trapping), PVT. Advanced device MOS capacitance extraction by C–V measurements must include body/gate contacts and instrument calibrations.

## 5. Senior failure-modes and alternatives
- Interface states/hysteresis, oxide trapped/fixed charge, bias-temperature instability BTI, TDDB, direct tunneling, oxide/Si band offsets, quantization. High-k metal gate changes EOT without necessarily using 5nm physical SiO₂; threshold and reliability optimized independently.
- FinFET/GAA structures use 3D gate electrostatics, so planar MOS `Cox′` simple parallel-plate formula and 1D depletion approximation cannot be applied directly to real device geometry/dopant profiles.
- Not all FET channels use p-type bulk silicon; depletion/enhancement types, PMOS sign reversals, SOI, III-V, wide-bandgap power FET, junctionless alternatives exist. We deliberately choose **p-type bulk/n-channel conventional inversion MOS**.

## 6. Independent questions, three-stage student teach-back
Student 1: 산화막은 막혔는데 아래 전하를 어떻게 움직이나요? / Student 2: 왜 p형 표면에 전자가 모이나요? / Student 3: 0V면 무조건 flatband인가요? / Student 4: 문턱 0.7V가 자연상수인가요? / Student 5: MOS capacitor만으로 drain current가 나올까요?
Senior 1: V_FB vs V_T and doping/oxide charge? / Senior 2: low/high frequency C–V measurement? / Senior 3: tox/EOT/high-k leakage tradeoff? / Senior 4: weak inversion and threshold discontinuity misleading? / Senior 5: body bias and Si/oxide interface variation?
- Beginner: ‘절연막을 뚫지 않고 전기장으로 실리콘 **표면**의 전하 분포를 바꾼다’ 설명.
- Intermediate: tox 5→10nm gives Cox′ half, C series decreases in depletion, toy 0V flatband **only because VFB toy0**.
- Senior: V_T toy≈0.785V source assumptions, condition when 1D model breaks, C–V frequency and oxide leakage alternative architecture/measurement.

## 7. Source ledger and reviewed material (checked 2026-10-17 KST)
- **MOS-A HIGH**: MIT OpenCourseWare 6.012 Fall 2009 Lecture9 PDF https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/42c863e2e1e9744ce6b797646a30e463_MIT6_012F09_lec09.pdf — **pages 1,8,13,14 rendered/screens visually verified**, includes zero-bias depletion caveat and V_FB / threshold charge equation; 2009 course notes, planar 1D derivation, not modern device SKU.
- **MOS-B HIGH for course scope**: https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/pages/lecture-notes/ — MOS capacitor under bias lecture6/7 and MOSFET lecture8/9.
- **MOS-C HIGH for topic transition**: https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/pages/lecture-notes/ — Lecture10 3-terminal MOS capacitor → MOSFET physical structure.
- **MOS-D MEDIUM independent academic**: https://digitalcollections.ohsu.edu/record/2360/files/3093_etd.pdf — dissertation high- vs low-frequency C–V behavior, introductory text; PDF body not fully inspected, use only corroborative abstract/figure description and mark **NEEDS_FULL_REVIEW**.
- **MOS-E HIGH foundational**: https://openstax.org/books/university-physics-volume-2/pages/8-3-energy-stored-in-a-capacitor — C and stored energy background; lacks semiconductor MOS-specific physics.
All numeric examples are calculations done from declared toy parameters, not reported measurements. A07 independent EDU review pending; actual learner/2.5D app QA NOT RUN.
