# 16 Senior deep dive · CMOS 게이트, 조합논리, 래치/플립플롭, 타이밍/메타안정성
> A06 · checkedAt 2026-10-17 KST · **소스 검증/정량 toy 재계산 / A07 독립 QA 미실시**. 01 MOSFET/CMOS NOT → 본 16 → 05 SRAM cross-coupled inverter/17 CPU ISA. 소자/논리/아키텍처 경계에 대한 독립 MIT 6.004 2017 공식 본문 + TI SN74HC74 제품 페이지 교차.
> Sources reviewed as **webpage descriptions/technical course notes, not PDF reproductions**. 링크를 교과서 사진으로 복사하지 말고 A05가 자체 SVG/2.5D 원본 도식 제작.

## 1. 누락된 연결 / 시니어 설계의 전체 서사
- 이미 01에서 nMOS/pMOS→CMOS NOT을 배웠고 05에서 6T SRAM 래치를 소개했지만, "두 신호를 동시에 묶는 규칙"과 "과거 입력을 저장하는 동작" 사이에 NAND/NOR 및 level-sensitive latch, edge-triggered D flip-flop, setup/hold 조건이 빠짐. 학생은 SRAM 내부의 인버터 두 개가 왜 bit를 기억하는지도 논리와 지연관점에서 연결해야 한다.
- 진입 초보 용어 카드: `0/1`은 전압 범위에서 해석되는 논리상태(정확히 0V/VDD를 항상 요구하지 않음), gate input `A,B`, output `Y`, `D`는 next data, `Q`는 저장된 상태, clock `CLK`은 저장시점의 약속 신호, tPD/hold 등은 senior expansion.
- **Not teaching combinational as instantaneous**: 명목 논리함수는 현재 입력에만 달렸지만, 입력 전이 직후 실제 CMOS 게이트에는 tCD/tPD 구간과 glitch 가능성이 있다. Boolean 수식만으로 실제 실리콘 타이밍 보장 불가.

## 2. CMOS 네트워크 vs 수학 논리 (actual topology)
- 2-input **NAND** `Y=¬(A·B)`; only A=B=1 gives Y=0. CMOS pull-down path is **series nMOS A→B**, pull-up **parallel pMOS A||B**. `A/B=00,01,10,11` ⇒ `1,1,1,0`.
- 2-input **NOR** `Y=¬(A+B)`; only A=B=0 gives Y=1. Pull-down **parallel nMOS**, pull-up **series pMOS**. `00,01,10,11` ⇒ `1,0,0,0`. Networks are **complementary**, not physically "2 inverter components" for a NAND.
- **NAND/NOR are functionally universal** under Boolean ideal abstraction; a NAND-only NOT is NAND(A,A), NAND-only AND = NAND(NAND(A,B),NAND(A,B)), OR via De Morgan. Caution multi-input NAND is **not associative**: `NAND(NAND(A,B),C)` generally ≠ 3-input NAND `¬(A·B·C)`. Students must not treat nesting 2-input NAND as n-input NAND.
- CMOS static load has leakage and dynamic charging/switching; no "every CMOS gate draws literally 0 watt when idle". NOR's stacked pMOS and NAND's stacked nMOS have technology dependent delay/resistance; do not unconditionally rank performance. Reference official MIT 6.004 Ch3/4.

## 3. Combinational vs sequential: truth table includes state
- Pure combinational `Y_t=f(A_t,B_t)` after settling; no intentional previous Q stored. Sequential `Q_next=f(Q_current,D,CLK/events)`. A transparent **positive-level D latch**: `G=1` after settling Q follows D; `G=0` Q holds previous value. Distinguish this from edge-triggered D register: sample D **on rising clock edge**, hold Q until next rising edge, except power-on/async reset/set and potential metastability. A particular chip SN74HC74 has asynchronous clear/preset; not every FF has the same pins.
- A latch's source input can affect Q throughout `G=1` window (transparent), not only at opening edge. A master-slave DFF reduces race-around by preventing direct input→output path through both latches while clock phases change. Clock phase/non-overlap hazards are implementation concerns, not literal ideal instantaneous state.
- SRAM 6T stores two complementary node values using regenerative latch/pullup/pulldown, but "latch in register" ≠ SRAM cell transistor or identical read-disturb behavior; separate WL/access and bitlines.

## 4. Critical quantitative timing design — reproducible toy
**A06 invented units**: nanoseconds, one rising-edge register-to-register path, same clock launch/capture and **zero clock skew/jitter/uncertainty**, no process or voltage effects. `tCQmax=1.2ns, logic tPDmax=5.0ns, setup=1.3ns; tCQmin=0.2ns, logic tCDmin=0.3ns, hold=0.8ns.`
- Setup: `Tclock ≥ tCQmax+tPDlogic+setup = 1.2+5.0+1.3=7.5ns` with zero-skew/uncertainty toy. Thus **T=8ns passes setup** margin 0.5ns; frequency 1/(8ns)=125MHz; actual speed not real chip.
- Hold: `tCQmin + tCDlogic ≥ hold =0.8ns` required; given 0.2+0.3=**0.5ns**, violation by **0.3ns**. Crucial: slowing clock **alone does not repair this simple same-edge hold violation**. Changing setup period from8→9ns leaves minimum data arrival too early.
- Delay element `tCDmin=+0.4ns`, `tPDmax=+0.6ns` (fictional) on data path gives new hold `0.2+0.3+0.4=0.9ns ≥0.8ns`, **passes 0.1ns margin**. But new setup constraint `1.2+5.0+0.6+1.3=8.1ns`, so if original T=8ns remains **setup fails by0.1ns**. Set **T=9ns**, setup margin `9-8.1=0.9ns`; hold 0.1ns; f≈111.1MHz. Student’s aha moment: hold repair can worsen setup.
- Real STA uses `clock arrival launch/capture, skew, jitter/uncertainty, max/min derates, crosstalk, path corners, generated clocks`. The toy formulas are not a sign-complete general STA constraint. For actual chip consult liberty cell timing and report/setup/hold. In cases with negative setup/hold library values or retiming, naive inequalities need care.
- MIT 6.004 distinguishes max `tPD` **output settled within** and min `tCD` **earliest possible change**, so these parameters are not interchangeable. Figure "p99 from 8ns clock" is invalid unless workload latency measured separately. This timing path exercise is a toy with entirely fictional cell timings, not specs of TI SN74HC74.

## 5. Metastability and asynchronous crossing — never fake determinism
- `setup/hold` window violation **increases risk** output takes unbounded time to settle; it does **not** force a particular wrong output each attempt, nor guarantee the flip-flop always enters metastable state. Diagram marks `risk / unknown until resolved` in red crosshatched zone, not "Q=0 always" or "Q=1 always."
- Demonstration conditional **normalized risk illustration**, not an actual probability of flop failure: `R(T)=exp(−T/τ)` with hypothetical τ=0.5ns and initial R(0)=1. Relative unresolved fractions at T=0.5/1/2ns ≈0.3679/0.1353/0.0183. Such a toy *omits* aperture constant and clock/data transition rates, device-specific metastability gain. No product MTBF claim. Two-stage synchronizer gives a whole cycle or more of resolution time, **risk drops exponentially but not to zero**.
- Clock-domain crossing: 2-FF for **single bit control** with handshake/level pulse considerations; **do not** claim 2 FF independently on each wire makes coherent multi-bit bus. For multi-bit transfers use handshake, async FIFO, data encoding Gray where appropriate. Metastability when sampling out-of-domain input can still occur.
- Product cross-check: TI [SN74HC74](https://www.ti.com/product/SN74HC74) supports positive-edge-triggered D capture and asynchronous clear/preset (Rev F datasheet linked June 2021). **Its maximum clock 29MHz, published tPD 10–50ns** are individual product characteristics and **never used** as input toy; newer CMOS registers and GPUs vary by implementation and PVT. These example products are only proof hardware can include async reset controls and real timing limits.

## 6. A05 SceneSpec deep QA / independent failure tests
1. `logic-nand-nor-truth-table`: two independent toggles A/B and gate NAND/NOR choice. All 8 truth-table cases; additionally allow **wrong** topology selection (PUN/PDC) to elicit targeted feedback. No answer in initial Voice. Toggle A/B in opposite order, output after delay separate instantaneous Boolean truth.
2. `combinational-vs-sequential-memory`: matched current input D=0 but `Q_old`=0 vs1 leads different sequential Q when latch closed; combinational Y only current A/B. Latch G=1 D toggles Q after settled, G=0 Q holds after D toggle. Power off latch Q unknown, not guaranteed restored.
3. `d-latch-vs-d-flip-flop`: D toggles while clock HIGH/no rising event; latch transparent but positive-edge DFF Q holds. Correctly enforce edge detection **previousCLK0→nextCLK1**; initial `CLK=1` is not an edge by itself; asynchronous reset may explicitly override Q only in separately tagged optional lab. Visualization of master/slave high/low complementary open phases is didactic; actual delays nonzero.
4. `setup-hold-metastability-clock`: user tries T=8ns with default toy model → setup pass, hold FAIL; add delay +0.4min/+0.6max at T=8 → hold pass setup FAIL; increase T=9 → both pass. D change within ± setup/hold window demonstrates **risk marker**, never deterministic flip. Show uncertainty and a hypothetical 2-stage synchronizer relative-risk curve **only after** prediction. **Tests** validate unit ns and margins.
- Accessibility: keyboard logical toggle, reduced motion static alternative with two separate waveforms before/after, color-independent HIGH/LOW, dark/bright contrast, 44px controls, Voice Korean "클록" not "클락" as beginner preference; degree/unit standards explicit.
- Student 3-level: beginner "왜?" one scene/one surprise → intermediate truth-table/rate/clock timing/unit → senior failure mode, PVT/STA, async crossing, real-product exceptions.

## 7. Official source ledger 2026-10-17
| Ref | Authority | URL | Evidence scope | Confidence |
|---|---|---|---|---|
| DIG-A | MIT OCW Computation Structures Ch3 CMOS | https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c3/c3s1/ | pull-up/down dual network, tCD vs tPD and PVT | HIGH for educational electronics |
| DIG-B | MIT OCW Ch4 combinational | https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c4/c4s1/ | NAND/NOR universality, **multi-input NAND not associative** | HIGH |
| DIG-C | MIT OCW Ch5 sequential | https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c5/c5s1/ | transparent D latch vs edge D register, setup/hold tCD/tPD | HIGH |
| DIG-D | MIT OCW Ch6 FSM metastability | https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c6/c6s1/ | two-stage sync, no 100% guarantee, positive feedback | HIGH |
| DIG-E | Texas Instruments SN74HC74 product page | https://www.ti.com/product/SN74HC74 | actual positive-edge DFF with async preset/clear, product-specific frequency/tPD | HIGH within SKU, NO claims about GPU FF |
| DIG-F | MIT 6.004 course syllabus | https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/syllabus/ | MOS→gates→sequential→processors pedagogy | HIGH |
**No actual chip simulation, SRAM circuit transistor sizing, GDDR timing, live GPU measurements, product timing-signoff or learner test by A06**. Scope extension to CDC/clock design is an advanced intro not completion of dedicated RTL/STA education.
