# 19 Senior research · RowHammer, DDR5 mitigation, ECC and fleet reliability
> A06 author source checkedAt=2026-10-17. A07 independent SOURCE QA pending. Non-operational physics/defense teaching only: **NO actual attack instructions, physical row mapping, real access-frequency thresholds, live DRAM tests, silicon safety certifications or exploitable sequences.**

## 19-S01 Retention leakage and row disturbance
DRAM 1T1C natural charge loss necessitates refresh; *row disturbance* is an additional possible effect where activity of some rows can perturb neighboring stored charge and produce flips. Kim et al ISCA2014 [R1] scientifically identified disturbance; Intel 2026 [R3] frames as layered risk, not a deterministic flip on a fixed count. Toy margin starts10 abstract units, natural depletion1 unit per epoch, threshold5. Three epochs =>10−3=7 VALID, add3 **fictional** disturbance tokens=>10−3−3=4 below5 INVALID. A conceptual refresh/reset at epoch2 restores margin10, then one normal loss+one abstract extra yields8. These tokens have **no real DRAM cycle, ACT count or physical address interpretation**. No automatic proof refresh always prevents errors.

## 19-S02 Distance and victim-row model limits
Google 2021 Half-Double [R2] and USENIX 2022 [R4] show that some DRAM disturbances can affect rows **beyond immediate neighbors**. Not all devices share this behavior and virtual address adjacency does not define physical DRAM row adjacency. Student toggles categorical toy target model `adjacentOnly|distanceTwoPossible` and coverage `neighborsOnly|platformValidatedScope`; when second possible and only neighbors considered, mark `COVERAGE_UNCERTAIN`, **NOT** deterministic 'row C bit flip'. No actual training of RowHammer technique, timing or target mapping.

## 19-S03 Preventative mitigation and support prerequisites
Intel public guidance updated **2026-07-20** [R3] distinguishes *Order1 prevention* TRR-in-DRAM, controller-assisted pTRR/RFM/ARFM and DRAM+controller PRAC where supported, from *Order2 detection/correction* on-die and system-level ECC. RFM needs MC/DRAM behavior; PRAC per-row activation accounting in **some** DDR5 DRAMs and supported host controllers, firmware/BIOS set appropriately. The manufacturer’s protection model and refresh policy are configuration-dependent, not universal immunity. Google 2025 [R5] describes limits of proprietary TRR and prior DDR5 population; **publication timing explains PRAC support variations**, so never assert every DDR5 device supports or lacks PRAC.
Toy `dramSupportsPRAC`, `controllerSupportsPRAC`, `firmwareConfigured` booleans must all be true to produce `PRAC_CONTRACT_CONFIGURED`. If any missing, `FEATURE_UNAVAILABLE`; even all true `protectionGuaranteed=NOT_PROVEN` until qualification/validation. TRR enabled alone `RISK_REDUCED_NOT_CERTIFIED`; not equivalent to full coverage. RFM a distinct MC/DRAM refresh cooperation mechanism, not PRAC. Toy scheduling budget baseline100 abstract cycles, extra1 vs4 gives101 vs104 modeled cycles only; no product latency or bandwidth guarantee.

## 19-S04 On-die ECC versus system ECC, SECDED toy
An extended Hamming(8,4) toy stores 4 data bits with3 positional parity+1 overall parity. A single-bit error is correctable (nonzero syndrome odd overall parity for a data/parity position, or zero syndrome odd overall parity for the global parity bit); two distinct bit errors detected but **uncorrectable**; 3+ error events are `NOT_GUARANTEED`, could be missed/miscorrected for some patterns. This is mathematical education only, not real DDR5 ECC code or a fixed RowHammer safety bound. `eccLayer=onDie|system|both|none` is distinct from `errorCount=0|1|2|3`; on-die ECC can act inside device, system ECC controller/interface in supporting configurations. On-die does not imply full channel protection. ECC reacts to errors, it does NOT prevent their physical generation [R3,R6].

## 19-S05 Operational rates and defensive fault domains
Intel [R3] recommends validation of selected DIMMs and CPU/BIOS combination, firmware and protections, fleet qualification, telemetry, isolation and incident response. Synthetic window one million memory-check events: device cohort A2 correctable errors per1,000,000 checks→2e−6 per check; cohort B10 per1,000,000→1e−5, rate ratio5. Arbitrary classroom threshold5 per million ⇒B `INVESTIGATE`, A monitor, neither evidence of RowHammer cause/attacker. Uncorrectable error flag ⇒escalation/recovery irrespective of CE threshold; no proof refreshing a row restores application integrity. Real CE counts differ by window, scrub, logging and device mix; choose common denominator and no magic full security claims. Optional one refresh scheduler toy penalty101 vs104 cycles with extra1/4 abstract costs, do not convert to real utilization.

## A07 independent source review acceptance
- [ ] S01 natural retention and disturbance distinct, abstract 10−3=7 vs10−3−3=4 threshold5, no actionable access counts or universal product flip.
- [ ] S02 distance2 risk possible *some* chips, C COVERAGE_UNCERTAIN not deterministic C flip; no physical row targeting.
- [ ] S03 TRR/RFM/PRAC and ECC different layers/orders; PRAC gated DRAM+MC+firmware, all true not CERTIFIED; published Intel2026 vs Google2025 deployment status not contradictions.
- [ ] S04 SECDED 1 corrected,2 detected not corrected,≥3 unknown; on-die ECC not full system ECC; ECC not prevention.
- [ ] S05 2/1e6 vs10/1e6 ratio5; investigate not confirmed attack; UE distinct; no fake guaranteed resilient checkbox.
- [ ] five learner-neutral prediction before UI/Voice, five after-teacher gated messages, 15 m1/m2/m3 actionable educational feedback and 3 optional hint levels each; A05 actual Chrome and A02 product separate.

## Primary public sources, checkedAt=2026-10-17
[R1] Kim et al., ISCA 2014 original IEEE https://ieeexplore.ieee.org/document/6853210/ ; public CMU source https://www.cs.cmu.edu/~18742/papers/Kim2014.pdf
[R2] Google Security May 25 2021 'Introducing Half-Double' https://security.googleblog.com/2021/05/introducing-half-double-new-hammering.html
[R3] Intel July 20 2026 'Reducing Exposure to Rowhammer' https://www.intel.com/content/www/us/en/developer/articles/technical/software-security-guidance/best-practices/reducing-exposure-to-rowhammer.html
[R4] USENIX Security 2022 Half-Double https://www.usenix.org/conference/usenixsecurity22/presentation/kogler-half-double
[R5] Google Security Sep 15 2025 'Supporting Rowhammer research to protect the DRAM ecosystem' https://blog.google/security/supporting-rowhammer-research-to/
[R6] SECDED error models math + ECC RowHammer research https://doi.org/10.1109/SP.2019.00089 — no complete vendor SECDED code or JEDEC licensed full spec reviewed.

**Confidence** HIGH source terminology + toy mathematics, CONDITIONAL for presence of device protection; unknown platform-specific DIMM row mapping/implementation/BIOS status. No actual hardware exploit validation or guarantee.