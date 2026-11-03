# A07 Round14 · 13 단위·확률·분위수·SLO independent educational and physics source audit
**2026-10-17 KST.** Direct owner for author correction: **A06, Issue #6 / PR #7**. User-directed shared hub #21 and lesson #45. A07 independent story review on authored story exact blob **`ea03cc4069bb49c6dfed7dc1edce8a4dd659ac27`** and deep-dive exact blob **`40178ec0ec3b5fb75275a2341d4d85200c4faca8`**, both at `content/a06-curriculum`. Official NIST/PCI-SIG/Prometheus and Google SRE public documentation cross-compared (no licensed spec/PDF). A07 did **not** run a browser, text-to-speech, physical measurement, app tests or user study; source-level scenario risks are **not observed runtime bugs**. No A01 per-lesson authorization and no main merge/deploy.

## Decision
- **[x] Independent first review completed (13-S01–S05 five Steps).**
- **[x] PHYSICS/MATH_PASS_SOURCE (all five)**; numerical calculations, units, statistical definitions and declared toy assumptions are correct.
- **[ ] EDU_QA_PASS_SOURCE — MAJOR_OPEN R14-01 13-S05 request eligibility/exclusion grading state**. Student-facing question and keyed feedback are neutral/correct, but the current model allows an ambiguous exclusion experiment to change the SLO score in a way impossible to prove correct with existing inputs. **NEXT:A06** add fully deterministic per-category population and eligibility/exclusion rules, then new exact 13 authored blob SHA to A07 for retest **before A05 STORY_READY**. No A05 scene work clearance from this source SHA.
- **P2 notes R14-02 histogram-specific exact requirements, R14-03 transport terminology** are refinement, not independent majors.

## Five-step independent science and teaching checks
### 13-S01: SI vs IEC size and transfer time — PASS_SOURCE
- `1 GB = 10^9 bytes=1,000,000,000B`; `1 GiB=2^30B=1,073,741,824B`; `1 GiB=1.073741824 GB`. Percentage vs 1GB = 7.3741824%, not rounded binary “1.07 GB exact”.
- 1 byte=8 bits, capital **B** is bytes, lower-case **b** bits. For expressly *ideal payload-only* 1GB/s, a 1GB payload takes 1s and 1GiB takes1.073741824s; headers/queue/receiver/IO reduce actual speed.
- Before UI and spoken question ask student to predict without exposing derived percentage/time. m1/m2/m3 error routes are individually phrased and physically correct. Avoid conflating binary memory allocation with marketed file format size. **PASS**.
- Public source: NIST prefixes https://pml.nist.gov/cuu/Units/binary.html

### 13-S02: DDR MT/s vs PCIe GT/s, throughput — PASS_SOURCE
- DDR `dataWidth=64 bits`, 6400MT/s → 6.4e9 transfers/s×8B=51.2e9 B/s = **51.2 decimal GB/s**; 3200MT/s → **25.6 GB/s** (isolated data-only bus upper bound; not random-read latency).
- PCIe 6.0 x16 official **256 GB/s aggregate bidirectional** headline implies **128 GB/s one-direction ideal upper portion**, not simultaneous application payload at headline each direction. Already advertised Gen6 GT/s covers PAM4 bit coding and does **not** imply an extra ×2 multiplier. A real PCIe TLP byte payload is lower due to FLIT/FEC/protocol and negotiated link.
- Three distinct errors m1,m2,m3 and learner-neutral Before text/Voice confirmed. The name `GT/s` must never be assumed identical to bytes/s. **PASS**.
- Public source: PCI-SIG https://pcisig.com/pci-express-6.0-specification

### 13-S03: Poisson zero-defect model, four chiplets and log inverse — PASS_SOURCE
- `D=0.005 /mm², A=100mm²` ⇒ `λ=D A=0.5` **dimensionless**, zero-defect probability `exp(-0.5)=0.6065306597`, at least one `1-P0=0.3934693403`.
- Each of 4 unscreened 25mm² chips: `λ=0.125`, `P0=0.8824969026`; all four mutually independently good `0.8824969^4=e^-0.5=0.6065306597`, not 0.8825 and not 4×. Inverse `D=-ln(P0)/100 mm²≈0.005 /mm²`; log requires `0<P0≤1`, at P0=1⇒D=0, P0=0 not finite measured value. The `D=0` edge is declared.
- Proposed student KGD switch stays separate from random 4-die yield and the manuscript explicitly warns screening changes chosen assembly subset, not raw wafer production. Source `modelInputs` does not grade guaranteed higher yield; teaching objective focuses exponential independence, so not MAJOR. m1/m2/m3 keyed and pre Voice neutral. **PASS**.
- Poisson independent homogeneous toy only, **not** actual fab yield/clustered defects.

### 13-S04: nearest-rank empirical percentile vs coarse classic histogram — PASS_SOURCE
- Dataset A 95×1ms+5×20ms: mean `(95+100)/100=1.95ms`; rank `ceil(.99×100)=99` sorted =20ms. Dataset B 99×1ms+1×20ms: mean `(99+20)/100=1.19ms`, rank99=1ms **while maximum20ms**; demonstrates p99≠max.
- Raw 5 [10,20,30,40,90]ms: q0.9 nearest-rank `ceil(4.5)=5` ⇒90ms. **Classic Prometheus** cumulative buckets `le=50ms:4`, `le=100ms:5`, `le=+Inf:5`; linear interpolation 50+(4.5−4)/(5−4)×(100−50)=**75ms**, not actual raw nearest-rank p90. Prometheus 2.55/latest docs confirm classic bucket interpolation, upper `+Inf` required; native exponential histogram uses a different interpolation model. **Do not teach 75ms as a sample observation or universal p90 estimator.**
- All three wrong causes and correct-first acceptance present, neutral pre Voice. **PASS**.
- Public sources: https://prometheus.io/docs/prometheus/latest/querying/functions/ and https://prometheus.io/docs/specs/native_histograms/ .
- **R14-02 MINOR** Make scene display the *exact bucket labels and cumulative counts* (50/4,100/5,+Inf/5) and keep `quantileEstimator=rawNearestRank|classicHistogramLinear` visually separate. Counts cannot be replaced by arbitrary non-cumulative interval frequencies; never infer exact raw p90 from coarse histogram.

### 13-S05: count-based SLI/SLO error budget math PASS but **model-evaluation MAJOR**
- For one predeclared eligible set **N=1000**, goodCount990 ⇒ actualBad=10 ⇒ SLI=990/1000=**99.0%**. Target99.9% allows `floor(1000×(1−.999))=1` bad; 10 failures **consume 10× budget and exceed it by9**, with under-target condition. For a 99.0% target, budget10 ⇒ exactly meets at 990 good. SLI defined as “eligible good / eligible total”, not a promise of p99 or facility availability. These **numbers PASS**.
- **R14-01 MAJOR**: Canonical S05 `learnerAction` has `eligibleRequests1000 fixed`, `goodCount=990|999|1000`, and `excludedSamples=0|100` toggle, plus student can “choose status all/responded”, is expected to reject “silently dropping timeouts” and “changing exclusion rules after failures”. But **`modelInputs` defines only `eligibleRequests=1000` and goodCount with no raw cohort size, no status of excluded100, no count of *predeclared ineligible* vs *excluded failure*, and no rule for whether denominator changes**. The real teaching objective **eligibility integrity** cannot be causally graded from that state. This can lead to an invalid 100% “success improvement” upon arbitrary timeout filtering even when honest service still failed, or cause denominator inconsistencies.
- **Concrete counterexamples with the same ambiguous current knobs**:
  - Start with eligible N1000 = 990 good+10 bad. Remove **100 good** ⇒ remainder900:890 good+10 bad ⇒ 98.8889%, not 99% or 100%.
  - Remove **10 bad +90 good** ⇒ remainder900:900 good+0 bad ⇒ 100%, but arbitrary post-hoc exclusion invalid under initially fixed eligibility.
  - Remove **100 truly out-of-scope** requests from an initial **raw N1100** ⇒ eligible N1000, 990 good+10 bad ⇒ honest 99%; required raw category counts must be provided.
  - Current `excludedSamples=100` cannot distinguish any of these (nor whether timeout was excluded), so an “exclude100” experiment and score is untestable without additional state.
- **A06 ready-to-paste graded source model (two independent modes to keep student simple)**:
```
modelInputs:
  rawRequests: 1100
  declaredEligibilityRule: 'service=/inference and region=example and window=24h'
  rawInScopeGood: 990
  rawInScopeBad: 10            # includes timeouts according to predeclared SLI
  rawOutOfScopeGood: 100       # truly excluded before score
  rawOutOfScopeBad: 0
  scoreMode: 'predeclared|postHocDropTimeouts'
  targetSLO: 0.99|0.999
  # Derived, NOT separately writable:
  eligible = rawInScopeGood + rawInScopeBad  # 1000
  allowedBad = floor(eligible*(1-targetSLO))
  observedBad = rawInScopeBad                 # 10
  passed = observedBad <= allowedBad && scoreMode==='predeclared'
  eligibilityViolation = scoreMode==='postHocDropTimeouts'
```
  Alternative genuinely change cohort: `includedGood`, `includedBad`, `excludedGood`, `excludedBad` with invariant all counts sum rawRequests and a **frozen eligibility policy before seeing outcomes**; derived N and goodCount change together, teacher tests multiple cohorts. Do not make mutable `eligibleRequests` independent of per-status counts after filter. 
- **A06 ready Korean BEFORE Voice** “먼저 어떤 요청을 셀지 정해 보세요. 같은 천 건에서 실패가 몇 건까지 허용되는지 예측하고, 그 규칙을 바꿀 수 있는지도 시험해 볼까요?” **AFTER Voice** “대상인 천 건에서 실패 열 건은 성공률 99퍼센트예요. 목표 99.9퍼센트에 허용되는 실패는 한 건뿐이죠. 이미 나온 실패를 빼면 기준을 바꾼 셈이에요.”
- **Must-fail acceptance**: (i) 990good/10bad N1000 target.999 ⇒ fail exceed9; (ii) same target 999good/1bad ⇒ pass; (iii) target.99 990good/10bad ⇒ pass; (iv) raw1100 with100 *predeclared out-of-scope* ⇒ N1000 remains honest; (v) posthoc exclude10 failed timeouts ⇒ **ELIGIBILITY_VIOLATION** (not pass, no success-score inflation); (vi) changes cohort by removing good100 ⇒ honest 890/900 instead of unchanged count; (vii) p99 can be favorable while this count SLO fails; response latency SLI requires a *different* goodness function, not fake independence.
- **NEXT:A06 P1** author new `13-S05` modelInputs/learnerAction/validation/negativePathTest with frozen eligibility and raw+included/excluded good/bad, output invariant. Post **new exact story blob SHA and updated #45/#6** for A07 retest. Do not send old blob to A05 merely because physics numbers PASS.

## Handoff, ownership, status check
- [x] A07 first comprehensive independent 13-S01…S05 science/math and pre/after Voice source QA on source blob `ea03cc4069bb49c6dfed7dc1edce8a4dd659ac27`, senior deep dive `40178ec0ec3b5fb75275a2341d4d85200c4faca8`.
- [x] Physics/maths and keyed response mappings & teaching prompt structure checked; **13-S05 one source-grading MAJOR remains [ ]**.
- [ ] P1 **NEXT:A06** canonical 13-S05 fixed-cohort vs posthoc-exclusion source rewrite, exact new blob SHA; **NEXT:A07** independent recheck then A06 STORY_READY direct A05 handoff. **A05** five scenes actual Chromium/Voice/ARIA/keyboard/mobile after SOURCE PASS; **A02** official app typed state/evidence E2E, then owner physical/user/merge gate. No source reviewer passing app by proxy.
