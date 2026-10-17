# A06 Round 04 Question Bank & coverage decisions · 2026-10-17
**Autonomous owner directive #6**: no next instruction waiting; user-facing only GitHub links. Latest source data: Atlas v1 =115 topic IDs / 12 lesson storyboards 50 Steps, A05 only M01 and DRAM work in current PRs.

## Student WHY questions (rank / scene / next)
| Priority | question | hands-on | lesson |
|---|---|---|---|
| P0 | 1. 5V인데 선이 끊기면 전류가 왜 0이에요? | 5V, 1kΩ, switch toggle | 12-S01 |
| P0 | 2. 두 갈래로 나뉘면 전하가 새로 만들어지나요? | KCL series/parallel | 12-S02 |
| P0 | 3. 10ms만 기다리면 커패시터는 정확히 100% 차나요? | RC t=τ/3τ | 12-S03 |
| P0 | 4. 50mW는 50J라는 뜻인가요? | W×s, Ecap | 12-S04 |
| P0 | 5. Si가 절연체도 금속도 아닌 이유는 무엇일까요? | bandgap choices | 11-S01 |
| P0 | 6. p형은 전자가 '+'로 바뀐 물질인가요? | donor/acceptor ions | 11-S02 |
| P0 | 7. n형과 p형을 붙이면 전기가 공짜로 나와요? | opposite drift/diffusion arrows | 11-S03 |
| P0 | 8. PN 다이오드는 0.7V에서만 딱 켜져요? | signed V vs depletion width/IV | 11-S04/S05 |
| P0 | 9. MOS gate 산화막이 막았는데도 아래 전자를 왜 끌어당기나요? | voltage→surface band bending | next 14 |
| P1 | 10. 핸드폰 속 실리콘과 서버 안 GPU가 같은 원리인가요? | device→logic→GPU path | 01/10 |

## Senior engineering questions (measure/counterexample)
| Priority | question | methodology / boundary |
|---|---|---|
| P0 | 1. Si bulk 도핑 후 전기적으로 중립인데 전기장이 있는 이유는? | spatial-charge depletion local vs quasi-neutral bulk, Hall/C-V |
| P0 | 2. pn built-in 0.714V를 외부 전지로 쓰면 왜 틀리나? | Fermi equilibrium and contact potential, zero net I |
| P0 | 3. 1D sudden junction model에서 W는 전압/도핑/T로 얼마나 변하나? | W=sqrt(2ε/q (1/NA+1/ND)(Vbi−Va)), unit validation |
| P0 | 4. Shockley n=2/Is=1pA의 I–V가 깨지는 조건은? | reverse breakdown, high-injection, series-R, temp & self heating |
| P0 | 5. RC toy τ=10ms를 실제 DRAM retention으로 써도 되나? | real fF C, leakage, sense amp/refresh/temperature |
| P0 | 6. 전원이 5V일 때 RC 커패시터의 저장 에너지와 충전기 공급 에너지가 왜 다른가? | ½CV² vs CV² ideal resistive charging heat |
| P0 | 7. '게이트 전류 0' vs oxide tunneling/BTI/TDDB란? | C-V frequency/oxide leakage/aging, next MOS 14 |
| P1 | 8. FinFET/GAA gate geometry 비교할 때 short-channel electrostatics/sources? | measured subthreshold/DIBL/PVT, compare imec study not marketing |
| P1 | 9. UCIe 3.0 64GT/s/PCIe7 128GT/s가 내 GPU 데이터 속도를 보장하나? | lane mapping, FEC/payload, host support |
| P1 | 10. eSSD PLP와 GPU checkpoint RPO를 동일하게 볼 수 있나? | ACK/durability, replicated storage, fault injection |

## Scientific QA pass/fail
- **Round verified:** MIT OCW 3.024 PN lectures (visible pages 4,5,7), OpenStax semiconductor band/doping/junction & Vol2 circuit/RC power official text; latest PCI-SIG PCIe7 and UCIe3 official pages, imec CFET 2026 R&D viewed. Details [accuracy ledger](../accuracy-notes.md).
- **Toy validation PASS:** 5V/1kΩ=5mA, 2×1kΩ series=2.5mA, parallel=10mA; τ1kΩ×10µF=10ms, VC(τ)=3.16V; P50mW×10s=0.5J, Ecap125µJ. PN equilibrium Vbi0.7143V; W(VA−1/0/+0.2)0.6659/0.4298/0.3647µm, diode I toy0.330nA→2.289nA. (Source assumptions [11 senior](../deep-dives/11-pn-foundations.md), [12 senior](../deep-dives/12-electricity-rc-foundations.md).)
- **Potential contradictions caught:** OpenStax 9.6 text contains p-type majority misstatement; crosschecked MIT so tutorial correctly says p=majority holes. 0.714V internal built-in≠external terminal battery. Shockley n=2 and Is=1pA expressly toy, not measured.
- **Never treat as verified:** modern node Vth exact, commercial PN diodes data/temperature, licensed PCIe/UCIe full interoperability, GAA/CFET commercial rollout, memory product p99; in future inspect raw standard PDF or SKU datasheets with version.
- **A05 visual correctness gates:** diagram must show fixed ions vs mobile carriers; field arrow n+→p−, no reverse current=exact zero, no hard diode 0.7V. Lesson 12 arrows 'electron drift vs conventional I' represent **metal resistor**, not universal every material (p-type holes as majority).
- **Plan next**: lesson 14 MOS oxide field, 16 sequential logic, 29 PCIe PHY, 31 power/cooling, 32 capstone. [production backlog](../production-backlog.md) controls statuses. No unattended execution guarantee.
