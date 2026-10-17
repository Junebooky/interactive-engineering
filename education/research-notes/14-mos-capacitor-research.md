# Round 04 → next independent research · Lesson 14 MOS capacitor (RESEARCHING)
Started 2026-10-17, A06 selected without A01 instruction. **No completed storyboard yet**; do NOT queue A05 to implement until STORY_READY.
### Why priority
Lesson 12 (V/I/RC) and lesson 11 (doping/PN) now bridge directly to 01 MOSFET, but **MOS oxide electric field and surface charge** is the remaining conceptual gap. If ignored, students may equate a p-n junction's forward current with the gate current controlling nMOS. Next 4-Step design: oxide field with no ideal DC gate current → p-substrate accumulation/depletion/inversion → flatband/threshold depends on oxide workfunction/charge/temp/doping → body/substrate junction & MOSFET source/drain vs 2-terminal MOS capacitor. This also unlocks FinFET/GAA, DRAM capacitor, oxide reliability.
### Scientific sources checked
- https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/pages/lecture-notes/ MIT 6.012 lectures 9–12: MOS accumulation/depletion/inversion and MOSFET gradual channel/saturation/subthreshold. Official course abstract checkedAt 2026-10-17; formula slide PDF not yet fully reviewed.
- https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/resources/mit6_012f09_lec09/ MOS capacitor lecture description.
- https://ece.gatech.edu/courses/ece3040 Georgia Tech course outline: MOS electrostatics and transistor threshold.
- https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c3/c3s1/ device-to-CMOS learning handoff.
**Qualitative:** on p-type Si with sufficiently negative gate bias, holes accumulate; moderate positive bias depletes holes revealing negatively charged acceptors; stronger positive bias can invert surface with electrons. Boundary voltages are not universal or necessarily exactly 0V / 0.7V. Ideal oxide blocks steady DC gate conduction but traps, tunneling, breakdown/reliability at scaled oxides exist.
**Toy oxide capacitance:** C'ox=εox/tox, εox≈3.9ε0, ε0≈8.854e−12F/m; tox=5 nm toy gives C'ox≈0.006906F/m²≈0.6906µF/cm². Doubling tox halves geometric C'ox; actual MOS capacitance may be different due depletion/inversion quantum and frequency. ΔQ'=C'oxΔV only for a strict oxide voltage increment at fixed effective capacitance (do NOT equate gate voltage directly to oxide voltage in all bias regimes).
### Student 5 questions
1. 산화막은 절연체인데 전자가 왜 그 밑에 모이나요?
2. 게이트와 실리콘은 전자가 서로 오가지 않고도 영향을 주나요?
3. p형 실리콘의 표면이 n형처럼 행동한다는 건 도핑 원자가 바뀐 건가요?
4. 문턱 0.7V는 자연상수예요?
5. MOS capacitor만 있어도 drain current가 흐르나요?
### Senior 5 questions
1. Interface traps/oxide fixed charges/work function shifts VFB/VTH 어떻게 측정할까? (C–V frequency)
2. Oxide field and tunneling when EOT scaled? reliability TDDB?
3. Charge sheet vs depletion approximation validity near weak inversion?
4. Body bias/short-channel/DIBL vs long-channel MOS charge?
5. Temperature/mobile charge, strong inversion threshold criterion and quantum corrections?
### Next gates
Look at MIT OCW lecture 9/10 PDF visual, double-check p-substrate accumulation bias and C–V low/high frequency, construct four Step with charge arrows/voltage labels, error-specific feedback, unit tests, A05 direct #4 handoff. **Do not claim product-accurate 3D device simulation.**
