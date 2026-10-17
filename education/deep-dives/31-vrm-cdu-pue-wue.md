# 31 · 시니어 물리·설비 Deep Dive: PSU·GPU VRM·PDN·CDU·PUE·WUE
> A06 2026-10-17 · **공개 공식 문서 교차 근거 / 모델·수치 자체 검산 / A07 독립 QA 미실행**. 반도체 전원 게이트→서버 전원/VRM→GPU 신호/PDN→열→데이터센터 냉각/효율 연결. 제품 벤치마크/실제 랙 현장 계측·시설 엔지니어 인증은 없음.

## 1. PSU와 서버의 전력 경로: 100W가 사라지는 이유
- Typical educational block: site power → UPS/PDU → server PSU (AC/DC) → 12/48V intermediate distribution architecture **varies by actual platform** → VRM/buck converter → GPU core lower-voltage high-current rail → transistor switching/PDN heat. The order is a teaching path, not an identical schematic for every AI server.
- Output efficiency eta = Pout/Pin; at Pout=100W and eta=0.90, Pin=111.111...W, loss=11.111...W. **Do not compute loss as 10% ×100W=10W:** 10% of *input*, not output, is lost. At eta=0.95 Pin=105.263W, loss5.263W. Real PSU eta is load, voltage, temperature, fan and power-factor dependent; teaching 90/95% values are invented, not an ENERGY STAR certification.
- General PSU/VRM loss energy becomes heat at various parts; some output power becomes heat at GPU/rack, so distinguish PSU loss vs chip dissipation to avoid double-counting. IT equipment energy at facility meter may include on-board PSUs, fans and conversion depending boundary.

## 2. Buck/VRM switch transistor physical assumptions
- An **ideal lossless synchronous buck in continuous-conduction steady state (CCM)** uses inductor volt-second balance: D·(Vin−Vout)+(1−D)·(−Vout)=0 ⇒ Vout=D·Vin. For Vin12V and D=1/3, Vout=4V. For D=1/4 =>3V. No claim that PWM alone with missing inductor/capacitor produces zero-ripple regulated 4V in an actual GPU.
- At Vin12V, Vout4V, Iout10A, Pout40W; with fictional VRM eta0.9, Pin44.444W, Iin=Pin/12=3.7037A, loss4.444W. Do not confuse output current10A with input current3.704A. CCM continuous means inductor current nonzero across cycle, not duty 100%. At light load DCM/PFM and real Rds(on), dead time, diode/body diode, inductor ESR, phase shedding and thermal feedback alter exact D relation.
- Senior timing/physics: switch MOSFET conduction P≈I_rms² Rds(on), switching ∫v(t)i(t)dt×f, gate drive Qg·Vdrive·fsw, magnetic core/copper losses, output capacitance transient undershoot. Exact transistor GaN vs SiC vs Si tradeoffs depend voltage/temperature/reliability/cost; **no universal GaN > SiC > Si ranking** or invented W figures.
- Source: TI [official regulator educational video](https://www.ti.com/ko-kr/video/4523892863001), [TI non-PDF reference design product page](https://www.ti.com/tool/PMP20807) for practical efficiency being load/config dependent. Datasheet PDFs were not inspected page by page: do not claim their plot as verified.

## 3. PDN low voltage =? heat always lower
- Ohmic distribution path copper/contact resistance: Vdrop=I R, copper heating Pcond=I²R. Fictional path R=2mΩ, at I20A => Vdrop0.04V and heat0.8W. At I40A => Vdrop0.08V and heat3.2W. At **fixed load Pout=40W**, core rail2V implies20A vs core rail1V implies40A, so lowering voltage for equal power can quadruple I²R loss. In real power/compute comparison, energy per token, switching C V² f and gate leakage depend workload/clock/voltage, so holding Pout=40W is an explicit counterexample setup rather than a universal outcome.
- Package/substrate connector current density, IR drop, supply-induced timing faults, VRM phase balancing, decoupling and transient droop are senior design challenges. A02/A05 should use fictional 2mΩ and never label it as actual GPU rail resistance.

## 4. Water loop: heat transfer flow vs site water makeup
- Simplified steady single-phase water loop: heat removed Qdot = m_dot·Cp·ΔT. For artificial Qdot100kW, Cp=4180 J/(kg·K), ΔT5K: m_dot=100000/(4180×5)=**4.784689 kg/s**. At ΔT10K =>2.392344 kg/s. This is **recirculating mass flow**, NOT water consumed, not annual site makeup water, and not installed pump pressure/flow requirement for a rack. Cp, viscosity, density, glycol concentration, water quality, and loop limits vary.
- Heat path chips→cold plate→rack coolant→CDU heat exchanger→facility water loop / chiller / dry cooler / cooling tower, based on architecture. The CDU separates liquid circuits in common configurations and may regulate pressure/flow, temperature/contamination; closed rack coolant loop can coexist with an evaporative facility rejection system consuming water. Lower ΔT may demand higher flow and pump power; leak detection, corrosion, redundancy and dew point matter. **Do not draw all liquid cooling as zero-water consumption.**
- Official U.S. DOE FEMP accessible HTML [Cooling Water Efficiency Opportunities for Federal Data Centers](https://www.energy.gov/cmei/femp/cooling-water-efficiency-opportunities-federal-data-centers), reviewed 2026-10-17: separate data-center closed loop, CDU and cooling tower, site water metrics. Example heat path is illustrative and not a universal installed topology.

## 5. Facility PUE and WUE: denominator discipline
- PUE = **total facility energy (kWh) / IT equipment energy (kWh)** over the same period and meter boundary. Dimensionless. IT=1MW constant, facility PUE1.4 ⇒total1.4MW / overhead0.4MW; if PUE=1.2 at same IT throughput/power ⇒total1.2MW / overhead0.2MW. 0.2MW saved ×24h = **4.8MWh/day** under fictional 24-hour steady conditions. **PUE does not itself determine GPU response latency, tokens/s or IT energy per token**. 1.0 is mathematical ideal lower limit for positive energy flows.
- WUE(site) = **annual site water usage (liters) / IT equipment energy (kWh)**, L/kWh; do not use recirculation flow in numerator. Fictional same-boundary period IT1000kWh, facility A1200kWh, water2000L ⇒PUE1.2, WUE2.0L/kWh; B facility1350kWh, water500L ⇒PUE1.35, WUE0.5L/kWh. A has lower PUE but higher WUE; cannot rank energy/water sustainability with one ratio. Metrics here are teaching scenarios, not actual datacenter readings.
- Source [DOE FEMP public page](https://www.energy.gov/cmei/femp/cooling-water-efficiency-opportunities-federal-data-centers) explicitly defines PUE and WUE units/period. [The Green Grid glossary](https://www.thegreengrid.org/resources/glossary?combine=pue) legacy notation for PUE but official legacy glossary warns some entries may be outdated; DOE is primary. [Uptime 2026 efficiency webinar overview](https://intelligence.uptimeinstitute.com/resource/replay-uptime-intelligence-client-webinar-view-efficiency-through-pue-and-wue) highlights energy/water tradeoffs, not universal rankings.

## 6. A07 physics cross-QA / A05 future scene failure cases
1. **η denominator**: Pout100W eta90% ⇒ loss11.11W, not10W; PSU efficient95%→lower loss5.26W, does not prove zero heat.
2. **ideal buck**: Vin12V D1/3→4V only ideal buck CCM; output current≠input current under step-down; thermal and switching losses matter.
3. **PDN**: fixed power40W/rail2V vs1V, current doubles20→40A, I²R loss quadruples0.8→3.2W at 2mΩ; change voltage alone isn't guarantee heat reduction.
4. **CDU**: 100kW loop Cp4180 ΔT5K→4.7847kg/s, double ΔT→half flow ideal, but *not* water consumption; facility cooling architecture can consume makeup water.
5. **PUE/WUE**: IT1MW=PUE1.4→1.2 saves facility200kW or4.8MWh/day if held stable. WUE2.0 vs0.5 scenarios and site boundary must remain separate. No tokens/s inference.
**Limits:** 5 Step future source author-self-QA only. A07 must perform independent official-source science/teaching recheck; A05 browser/physical/touch/Voice and A02 app/progress QA are different gates. No main merge/deploy.

## Public-source provenance (checked 2026-10-17)
- [POWER-A] https://www.ti.com/ko-kr/video/4523892863001 — TI buck and PWM teaching source.
- [POWER-B] https://www.ti.com/tool/PMP20807 — TI public buck reference product page, real device examples separate from artificial 90% teaching model.
- [POWER-C] https://www.energy.gov/cmei/femp/cooling-water-efficiency-opportunities-federal-data-centers — FEMP PUE, site WUE, direct liquid cooled loop/CDU and tower boundary.
- [POWER-D] https://www.thegreengrid.org/resources/glossary?combine=pue — legacy glossary PUE, may contain outdated historical terms.
- [POWER-E] https://intelligence.uptimeinstitute.com/resource/replay-uptime-intelligence-client-webinar-view-efficiency-through-pue-and-wue — Uptime June 2026 energy/water choices.
