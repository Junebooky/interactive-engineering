# A06 next autonomous research · 31 전력반도체/PSU→GPU VRM→열→CDU→PUE/WUE (2026-10-17)
**Status: RESEARCHING, not a finished A07-accepted lesson.** A06 independently selected after finishing 29 PCIe/SerDes/DMA/CXL 5-step manuscript (A07 source review pending). This is the last missing energy chain from MOSFET's switching circuit to rack-scale AI GPU answer, not mere cooling vocabulary.

## Five beginner WHY questions → independent interactive scenes
1. **서버 전원에서 12V를 GPU의 낮은 코어전압으로 바꿀 때 에너지가 사라지나요?** → PSU/VRM topology with input/output watt arrows, current/voltage contrast.
2. **스위치를 1/3시간 켜면 12V를 4V로 만들 수 있을까요?** → ideal buck D duty ratio, L and switch, output ripple/error vs nonideal loss (12V, D=1/3 → 4V toy); not a real VRM design formula under every mode.
3. **전압을 낮추면 항상 발열이 줄까요?** → P=I²R at copper/PDN, conduction vs switching losses, GaN/SiC vs Si MOS/IGBT choices under voltage/frequency/thermal and cost, no universal best technology.
4. **GPU heat 100kW를 5°C 따뜻해지는 물로 뺀다면 물을 얼마나 흘려야 할까요?** → `Qdot=m_dot Cp ΔT`; toy 100000W/(4180J/(kg K)×5K)=**4.7847 kg/s** under perfect transfer, not real CDU sizing or site water *consumption*. **Closed-loop coolant flow rate ≠ net water consumed**.
5. **데이터센터 PUE를 1.4→1.2로 낮추면 GPU 모델도 빨라지나요?** → 1MW steady IT, total facility 1.4→1.2MW; overhead0.4→0.2MW, same GPU compute throughput if utilization unchanged; WUE/water and IT energy per token separately.

## Senior cross-check questions
- Inductor volt-second balance/continuous conduction valid for fixed-frequency ideal buck, `Vout≈D Vin` doesn't imply zero loss, design must check loop stability/inductor peak ripple/transient overshoot.
- PDN I·R drop and package parasitic, decoupling MLCC, GPU load transients / thermal resistance and aging; a regulator can run lower V but higher I at constant P.
- PSU 90% efficiency at **Pout=100W** implies **Pin=111.11W and loss11.11W**, not loss10W. Load fractions and power-factor harmonics affect real measurement.
- For flow experiment, `Cp≈4180J/kg/K` water at nominal T as illustrative; deltaT5K and 100kW perfect coupling ignore pressure drop/pump power/redundancy/leaks/ambient. Flow kg/s not WUE annual facility makeup liters/kWh.
- PUE=**facility energy/IT equipment energy**, measured over same period and boundary; independent of SLA tokens/s p99. **IT fixed1MW PUE1.4→1.2** saves200kW facility, equivalent **4.8MWh/day** at steady case; not evidence of measured cooling improvement. WUE=site water liters / IT electricity kWh, cooling tower/process boundary. PUE improvement can worsen water consumption depending design.

## Evidence starting ledger · browsed 2026-10-17
- [POWER-A] TI official buck converter educational video derives `Vout=D Vin` from inductor volt-second balance https://www.ti.com/ko-kr/video/4523892863001
- [POWER-B] DOE federal cooling resource distinguishes direct liquid cooling/CDU loop and cooling tower and annual PUE/WUE definitions https://www.energy.gov/cmei/femp/cooling-water-efficiency-opportunities-federal-data-centers
- [POWER-C] The Green Grid official PUE formula (legacy glossary) https://www.thegreengrid.org/resources/glossary?combine=pue
- [POWER-D] Uptime 2021 article: direct liquid cooling changes facility loads, PUE alone not IT efficiency/water/resilience https://journal.uptimeinstitute.com/does-the-spread-of-direct-liquid-cooling-make-pue-less-relevant/
- [POWER-E] Infineon vendor-wide bandgap GaN-on-Si vs GaN-on-SiC product application overview https://www.infineon.com/product-information/gan-on-silicon-and-gan-on-silicon-carbide-for-power-electronics-a-review (vendor claims not universal across all SiC/GaN/Si power).
- [POWER-F] Uptime sustainability glossary site energy and IT distinctions https://intelligence.uptimeinstitute.com/resource/glossary-digital-infrastructure-sustainability
- **Unverified:** VRM real silicon switching frequencies, actual rack CDU flow rates, chip PUE/tested energy, product PSU ratings, GaN vs SiC exact performance/no factory data. Do not claim those figures without independent source/data.
- **Next independent session:** build five 3-depth Step storyboards, all student-safe predictionPrompts and separate teacher answers, keyed 3 misconceptions/hints, source+unit QA then request A07 source review. A05 not asked to build 31 until SOURCE PASS. User instruction cycles are not autonomous infinite/background execution.
