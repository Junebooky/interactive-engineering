# A07 Round22 — Lesson15 corrected-source independent QA (2026-10-17 KST)

Recipient: A06 Issue #6; relevant card #51; source PR #7; A07 QA PR #14 and Issue #21. Static canonical science, educational contract and textual gating only; **not** browser, 2.5D scene, speech, PDK or hardware verification.

## Exact current immutable source
- Original Lesson15: **87ca241024ccb5517c9371b004977863d5781f4d**, education/lessons/15-finfet-gaa-cfet-backside-power.md, A06 branch content/a06-curriculum
- Deep dive: **fedfdc541223e4e42b7f046e06b5fbb8dca97b08**, education/deep-dives/15-gaa-nanosheet-cfet-backside-pdn.md, unchanged.

## Independent verdict
**All four previous R20 SOURCE_MAJORS RESOLVED on NEW blob.** Five physics/maths, neutral pre-answer UI/Voice prompts, gated teacher After, 15 m1/m2/m3 cause-specific correction scripts and right-first acceptance remain PHYSICS/MATH_PASS_SOURCE. **A new, different educational scenario-state MAJOR R22-01 at 15-S04 remains [ ]. Final EDU_QA_PASS_SOURCE [ ] until author corrects and A07 retests new exact SHA.**

- [x] **R20-01** five literal undefined learning goals replaced by specific measurable Korean learningGoal sentences (S01 electrostatic gate count, S02 geometry, S03 CFET complementary contacts, S04 local IR/I²R, S05 fixed dynamic electricity versus foundry status).
- [x] **R20-02** S02 real independent model input sheetCount2|3, sheetWidthNm20|30, sheetThicknessNm5|7, no phantom gateCapacitanceVaries; derived P=2(w+t), total=N×P. Baseline w20,t5 P50 N2=100/N3=150nm, alternate w30,t5 P70/N2=140/N3=210, alternate w20,t7 P54/N2=108/N3=162. Ion/C/real energy NOT_PROVEN. Correctness criterion now tests actual independent actions.
- [x] **R20-03** S03 model inputs independent devicePair n+p|n+n|p+p|HBM-TSV, placement adjacent|vertical, contactAvailable true|false; n+p vertical contact false -> INCOMPLETE_CONTACTS (not physically completed CFET), true -> TOY_CONCEPT_VALID, n+n -> WRONG_DEVICE_PAIR, HBM TSV not the same. Ideal pair projected area2.4 ->1.2 only, productDensityGain NOT_PROVEN regardless.
- [x] **R20-04** S05 explicit independent Vdd=1|0.8, scenario=fixedDynamicOnly|leakageAndTimingUnknown, vendorSourceStatus with research vs manufacturing categories. Toy α0.2*C1nF*f1GHz yields 0.200 ->0.128 W, exactly 36% of dynamic component, no real total chip/tokens/cooling claim. Under unknown leakage/timing, SYSTEM_GAIN_NOT_PROVEN; in both scenarios totalChipPowerSaving NOT_PROVEN; imec 2025 simulation research not universal CFET mass production; physicalGateLengthNm UNKNOWN from commercial node branding.
- [x] Original S01 single FinFET electrode covering three schematic faces and GAA wrapping (no triple Ion or zero leakage); S04 fixed10A 2mΩ =>20mV/0.20W, 1mΩ =>10mV/0.10W for one local line (not full DC energy) are physically sound.

## R22-01 — NEW P1 15-S04 input-to-grade state contradiction
Actual canonical learnerAction explicitly invites **independent** gateArchitecture=FinFET|GAA, powerRoute=front|back AND local path R=2|1mΩ manipulation. correctIncorrectCriteria separately grades selected gate architecture and route. But modelInputs lists only fixed current 10A, Rfront=0.002Ω and Rback=0.001Ω plus numeric formulas, with no typed gateArchitecture, powerRoute, active resistance selection / precedence, or negative grading outcome.

A learner can attempt powerRoute=front together with R=1mΩ; one scene may keep the front default resistance2mΩ, another honor manually selected1mΩ. Either can report a different number and call it correct because state mapping is unspecified. Changing GAA alone must not implicitly switch to a back route. This is an **implementation-contract blocker**, not invalid Ohm's law and not an observed running-scene bug.

**Recommended A06 ready state contract:**
- Controls: gateArchitecture=FinFET|GAA; powerRoute=front|back; currentA=10 (constant).
- Derived, never independently mutable in this simple route-mode: resistanceOhm=powerRoute==='front'?0.002:0.001; dropV=currentA*resistanceOhm; localLossW=currentA²*resistanceOhm; totalFacilitySavings=NOT_PROVEN.
- Revise learnerAction and grading to manipulate architecture and power route independently, and **observe R** as a derived property. If teaching a third independent R adjustment is essential, explicitly introduce resistanceMode=routeDefault|manualOverride and manualResistanceOhm=.001|.002; distinguish override from default routing and grade accordingly.

**Must-fail/acceptance for A05 later:** GAA+front =20mV/0.20W; FinFET+back=10mV/0.10W; GAA+back=10mV/0.10W; architecture alone never changes resistance; front+manually1mΩ without explicit override is invalid; site power halving inference invalid; current stays fixed10A. Student must demonstrate WHY and at least two independent real controls, correct-first allowed, teacher After not pre-exposed.

## Next owners / boundary
- [x] A07 independent current-SHA first four repairs revalidated; R22-01 new exact regression requested.
- [ ] **P1 NEXT:A06** repair original 15-S04 typed independent axes, clear R semantics and negativePathTest; commit new author story blob SHA to #51 / #6. Only after A07 new-SHA PASS can A06 mark STORY_READY and hand off to A05.
- [ ] **NEXT:A07** inspect next immutable SHA. [ ] A05 actual Chromium/Voice/ARIA/keyboard/mobile and A02 official app only after source pass. [ ] Owner actual device/student/Safari/screenreader/main merge/deploy HOLD. No A01 per-lesson education sign-off.
