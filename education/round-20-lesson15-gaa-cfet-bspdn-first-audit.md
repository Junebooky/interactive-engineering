# A07 Round20 · Lesson15 FinFET→GAA nanosheet→CFET→backside PDN independent source QA
**2026-10-17 KST**. Direct report **A06 Issue#6**, original PR#7, lesson card #51, shared #21 and A07 PR#14. Inspected actual immutable A06 story **`3cd5fdad82f2b93868ba5ad02099008a17cb45a6`** (`education/lessons/15-finfet-gaa-cfet-backside-power.md`) and senior **`fedfdc541223e4e42b7f046e06b5fbb8dca97b08`** (`education/deep-dives/15-gaa-nanosheet-cfet-backside-pdn.md`). Cross-referenced public Samsung/GAA official 2022 statement, imec 2025 *simulation/research*, process marketing boundaries, source-listed Intel and TSMC public articles; no proprietary PDK, SPICE, hardware, app, Chrome, TTS, mobile or real learner test. A07 **source-only**; no A01 per-lesson sign-off, no merge/deploy.

## Verdict
- [x] Independent 15-S01…S05 five-step science/math factual first review **PHYSICS/MATH_PASS_SOURCE 5/5**; 5 neutral prediction/pre display/pre Voice, 5 teacher gated after, 15 keyed misconceptions and right-first learner permitted are present. No verified measured-product PPA or 2026 commercial CFET assertion.
- [ ] **`EDU_QA_PASS_SOURCE` / author STORY_READY = P1 MAJOR_OPEN**: not all learner experiments have defined state/grader contract, and **every Step has literal `learningGoal: undefined`**, not a learning-goal statement. Existing “correctIncorrectCriteria” sentences are concepts but lack typed causal/evaluable inputs for three specified interactive experiments. This is a **source-to-scene implementation/learner-assessment schema blocker**, not a false physical formula and not an observed UI bug.
- [ ] **NEXT:A06** patch exact canonical five `learningGoal` fields + student-manipulable input/readout/grading invariants for S02, S03 and S05; re-commit and provide *new exact story/deep SHAs* to A07 on #51/#6. **Do NOT mark lesson15 STORY_READY/A05 handoff until independent fixed-source check.** A05/browser and A02 app remain separate.

## Step-by-step independent science
**S01 electrostatic geometry `planar-finfet-gaa-field` — physics PASS.**
Planar top gate versus FinFET *one* gate covering top+two side faces versus GAA *one* gate surrounding four schematic faces is a comparative toy. Number of exposed faces is **not number of independently driven gate electrodes**, not exactly 3/4× drive, and cannot derive `I_on` or `I_off=0` without PVT/doping/contact/geometry. Positive teaching copy and m1/m2/m3 correction physically appropriate. `faceCount=4` is schematic for rectangular sheet cross-section, not a mandatory universal transistor polygon.

**S02 `gaa-sheet-width-perimeter` — physics PASS / R20-02 learner contract P1.**
Width20nm and thickness5nm ⇒ rectangular toy perimeter `2(20+5)=50 nm`; two sheets `100 nm`, three `150 nm`, ratio `3/2=1.5`, **not** measured current, C, speed, delay, or energy. However actual `learnerAction` explicitly says learner **“change sheetCount 2|3 and width20nm/thickness5nm reference”**, additionally **“compare two independently manipulated N and gateCapacitanceVaries=true|false”**, while `modelInputs` only names **fixed** w=20nm,t=5nm and N2|3, **no `gateCapacitanceVaries` input, output, expected feedback or negative test**. `correctIncorrectCriteria` says “test width/thickness” despite no w/t user selectable range. This makes the claimed *two independent physical experiments* not reproducible or gradable and risks a visual capacitor toggle ungrounded in any capacitance model.
**A06 two valid fixes**:
- Preferred **simple learning route**: `modelInputs:{widthNm:20,thicknessNm:5,sheetCount:2|3,capacitanceEffect:'not-modeled'}`; student independently toggles `sheetCount` and selects `interpretation='geometryOnly|guaranteedIonGain|guaranteedEnergySaving'` (two distinct actions rather than two independent physical controls, update correctness criteria accordingly). No phantom `gateCapacitanceVaries` control; feedback rejects current/energy claims.
- Richer route: add `widthNm:20|30`, `thicknessNm:5|7`, `sheetCount:2|3`; derive `PsheetNm=2(w+t)`, `PtotalNm=N*PsheetNm` for all combinations, e.g. w30/t5/N3 ⇒`3×70=210nm`. `capacitanceTrend='possiblyIncreases|noQuantitativeCModel'` is **interpretive**, not a gradeable numeric current/energy predictor. `correctIncorrectCriteria` must match **actual** controls.
**Reject negative** `sheetCount=3, Ptotal=150nm` after w30/t5 because value is now210; refuse “energy must decrease” from geometry alone.

**S03 `cfet-complementary-stacking` — physics PASS / R20-03 learner contract P1.**
CMOS inverter uses nFET pull-down+pFET pull-up; vertical CFET research *n+p*, not n+n and not TSV-stacked HBM dies. Toy projected adjacent `2×(1+0.2)=2.4` units vs perfect vertical `1+0.2=1.2` units ⇒ 50% **idealized pair footprint** saving, **not** final standard-cell density or manufacturing yield. However `learnerAction` asks independent `contactAvailable=true|false` “to block product-level density conclusion”, and `correctIncorrectCriteria` wants consequences of access contacts, but **`modelInputs` lists only devicePair/placement/2.4/1.2**—no `contactAvailable`, routing state, or derived `productDensityProven` flag. On both contact settings a naive scene could incorrectly award physical product 2× density or grade wrong because the model has no state.
**Ready-to-add contract**: `devicePair:'n+p'|'n+n'|'p+p'|'HBM-TSV'; placement:'sideBySide'|'vertical'; contactAvailable:boolean; routingQualified:boolean=false; toyFootprint=2.4|1.2 only for compatible n+p; productDensityResult='NOT_PROVEN' always (unless full cell/layout evidence supplied outside toy); incorrectPair/unsupportedContact ⇒ `PHYSICAL_CONFIGURATION_INVALID` regardless of toy footprint number. Add negative: n+n vertical does not turn into pFET, and n+p vertical with `contactAvailable=false` **cannot** be graded as implementable working CFET despite 1.2 toy projection. Explicit HBM chip-stacking contrast remains.

**S04 `backside-power-ir-drop` — physics PASS.**
At declared *fixed I=10A* and local single power rail, Rfront2mΩ `Vdrop=IR=20mV`, `Pheat=I²R=0.20W`. Rback1mΩ ⇒10mV,0.10W, exactly half the **one path** resistive loss, **not** GPU/chip/server/site energy consumption. Gate architecture and backside PDN are independent design axes; no universal thermal/contact penalty reduction. Student Before asks to calculate (does not reveal values), m1/m2/m3 keyed corrections align.

**S05 `device-ppa-node-energy` — physics PASS / R20-04 learning contract P1.**
Fixed `α=.2,C=1nF,f=1GHz`: `Pdyn=αCV²f`; 1V→`0.200W`,0.8V→`0.128W`; ratio `0.64`, reduction **36% of dynamic switching power only**. No whole-chip, leakage, delay, energy per inference or fab PPA claim. Process node names are labels, not literal measured gate lengths; imec forksheet simulation doesn't prove CFET mass production. But `learnerAction` requires student to independently toggle **`otherConditionsFixed` vs unknown leakage/timing** and **sort different vendor-status evidence**, while `modelInputs` declares only numeric α,C,f,V, then mathematical `Ptotal=Pdyn+V*Ileak+unknown overhead` with **no controlled `otherConditionsFixed`, `leakageKnown`, performance policy, source-category reference identifiers or scored output**. Unqualified scene could continue showing a numeric 36% *whole-chip saving* after switching conditions to unknown and still pass.
**A06 concrete contract**:
```yaml
modelInputs:
  vddV: 1.0|0.8
  alpha: 0.2
  capacitanceF: 1e-9
  frequencyHz: 1e9
  scenario: fixedDynamicOnly|leakageAndTimingUnknown
  nodeClaim: namingOnly|literal2nmGateLength
  cfetClaim: imecResearch|allFoundriesCommercial
derived:
  dynamicW: alpha*capacitanceF*vddV*vddV*frequencyHz
  dynamicSavingFraction: 0.36 # only in fixedDynamicOnly pair
  totalChipPowerSaving: NOT_PROVEN
  energyPerTaskSaving: NOT_PROVEN
  vendorSourceStatus: VERIFIED_CLAIM_ONLY
```
**Negative** `scenario=leakageAndTimingUnknown` must display `totalChipPowerSaving: NOT_PROVEN`, cannot score whole-system 36%. Reject node naming as literal physical gate length and imec research as already shipped all-fab CFET. The current story explicitly cautions about this in prose, but *selected student-control inputs are absent from `modelInputs`*.

## R20-01 global MAJOR: Five `learningGoal: undefined` fields
All 15-S01...S05 have literal `- **learningGoal:** undefined` in the original canonical source. This does not state a learner-observable outcome and may be serialized as the string “undefined” by a story schema importer/voice/help system. The scientific teaching objectives exist in `correctIncorrectCriteria` but should not be *silently substituted* by A05/A02 independently.
**A06 ready Korean goals**:
- S01: “평면형·FinFET·GAA에서 한 게이트가 제어하는 채널 면을 구분하고, 누설·전류 배수를 수치로 단정할 수 없는 이유를 설명한다.”
- S02: “직사각 시트의 둘레와 시트 수에 따른 합계를 계산하되 전류·스위칭 에너지의 보장 값으로 오해하지 않는다.”
- S03: “CMOS의 n+p와 수직 CFET을 TSV 메모리 다이 적층과 구별하고, 면적 장난감 값과 제조 가능한 셀 밀도를 분리한다.”
- S04: “한 전원 경로의 IR 강하와 I²R 열손실을 계산하고 후면 PDN의 국소 효과를 시설 전체 절감률과 분리한다.”
- S05: “αCV²f의 고정 조건 동적전력 비율을 계산하고 공정 명칭·연구 발표와 실측 전체 PPA를 구분한다.”
Acceptance: all five nonempty objectives, measurable verbs, scoped exactly to current controls; no `undefined`, contradictory grading or missing output state.

## Negative/regression matrix required before A05 handoff
1. S01 FinFET faceCount3 still ONE physicalIndependentGateInput and Ion/leakage UNKNOWN, wrong triple-electrode option grades FAIL.
2. S02 w20 t5 N2/3⇒100/150; if width adjustable w30 t5 N3⇒210. No phantom `gateCapacitanceVaries` action, no numeric guaranteed Ion/energy ratio.
3. S03 vertical n+n fails complementary, HBM-TSV not CFET. n+p vertical with contacts unavailable cannot pass “manufacturable density doubled”; productDensity NOT_PROVEN even with contacts available.
4. S04 I10,R2mΩ→20mV,0.20W; R1mΩ→10mV,0.10W and facility power UNKNOWN; GAA architecture switch alone does not toggle PDN.
5. S05 V1/.8 at fixed α,C,f⇒0.2/.128W, 36% dynamic-only; unknown leakage/timing cannot grade “total power reduced36%”; vendor node vs gate length not identified, imec research not mass-production.
6. All 5 3-keyed misconception corrections, no pre-learner derived answer in DOM/aria/TTS, teacher result/hints after gate, 2 genuine independent evaluated controls and WHY, right-first allowed; A05 actual browser/Voice/aria evidence must be separately captured at scene HEAD+CI.

## Public science provenance
- Samsung official 2022-06-30 initial 3nm GAA production, and four-sided GAA versus three FinFET surfaces: https://semiconductor.samsung.com/us/news-events/news/samsung-begins-chip-production-using-3nm-process-technology-with-gaa-architecture/ .
- Samsung process node retrospective: https://semiconductor.samsung.com/foundry/process-technology/logic-node/ .
- imec VLSI 2025 outer-wall forksheet **TCAD simulation** and future CFET roadmap, *not generic commercial production*: https://www.imec-int.com/en/articles/outer-wall-forksheet-bridge-nanosheet-and-cfet-device-architectures-logic-technology .
- Intel 18A official: https://www.intel.com/content/www/us/en/foundry/process/18a.html ; TSMC N2 annual reporting and A16 https://investor.tsmc.com/static/annualReports/2025/english/index.html and https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_A16 . The original A06 source correctly qualifies product-status claims; not cross-vendor PPA benchmarks.
- All exact current toy calculations are independently reproducible from definition with HIGH confidence; **LOW real-device prediction** without PDK/SPICE/measured sample conditions.

## Ownership
- [x] **A07 independent first 5-Step physical/math and pedagogy/source contract review** at exact above SHAs, factual math all PASS.
- [ ] **P1 NEXT:A06** replace undefined goals, align S02/S03/S05 learner controls, typed modelInputs and criteria/negative-path outcomes, add cause-grade states. Post exact NEW canonical story and senior blob SHAs #51 and A06 Issue#6 to A07 retest. No A05 2.5D handoff before independent EDU SOURCE_PASS.
- [ ] **P1 NEXT:A07** repeat exact-source review on new SHA; if clean mark EDU_QA_PASS_SOURCE and A06 may author STORY_READY and direct source-to-A05 5 scenes; **A05/A02 actual app/browser** distinct afterward.
- [ ] **Owner** learner/device/browser Voice audio, iOS Safari, screenreader, main merge/deploy approval HOLD. No A01 per-lesson gate.
