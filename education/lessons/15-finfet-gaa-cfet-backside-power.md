# 15 · FinFET → GAA 나노시트 → CFET → 뒤쪽 전원망
> **A06 original source authored / A07 independent EDU_SOURCE_REVIEW_PENDING** (2026-10-17). [official senior technical notes](../deep-dives/15-gaa-nanosheet-cfet-backside-pdn.md), [Lesson15 pipeline #51](https://github.com/Junebooky/interactive-engineering/issues/51). Previously19 authored lessons/83 Steps + new15 5 Step = **20 authored lessons/88 Steps**, NOT A07 accepted or browser/product QA. All geometry/current/area/energy computations are explicit fictional toy, not SPICE/PDK/device/wafer measurements.
> 선수 11 PN/doping,14 MOS capacitor,01 CMOS inverter,06 wafer/chiplet,13 units and31 PDN. 후속 20 physical EDA/STA and22 wide-bandgap power,10 AI data center. Student story: 나노미터 광고에서 물리적 숫자를 검증하는 반도체 탐정 5-stage lab.

## 공통 학생/교사 접근 및 검증 규칙
- Learner pre-stage: only predictionPrompt, storyHook, displayTextBeforePrediction, speechTextBeforePrediction; teacherExpectedAnswer, expectedObservation, computed numeric results, after UI/Voice, per-wrong physical corrective explanations **hidden in student DOM/aria/TTS until prediction submitted + >=two independently manipulated states + WHY**. Correct-first learners pass; forced wrong submission disallowed. Requestable L1/L2/L3 hints, one of m1/m2/m3 exactly keyed to actual mistake.
- No real foundry PPA/yield/clock comparisons or absolute product power claims; academic imec forksheet/CFET research ≠ commercial production; gate surfaces not count independent gate electrodes. Owner release, A05 Chrome and A02 app distinct.

## 15-S01 · planar-finfet-gaa-field · 채널을 감싸면 게이트가 세 개가 되는 걸까요?
### ① 먼저 예상하고 조작하기
- **sceneId:** planar-finfet-gaa-field
- **learningGoal:** Planar(윗면)·FinFET(윗면+측면 둘)·GAA(전면 포위)를 비교하고 하나의 게이트 전극과 여러 제어 면을 구분하며, 전류·누설 절대 배수 주장을 물리적 PVT 반례로 기각한다.
- **priorKnowledge:** 11,14,01
- **storyHook:** 게이트가 채널을 위에서만 덮을 때와 양옆까지 감쌀 때, 짧은 채널은 어느 쪽이 잘 제어될까요?
- **question:** 게이트가 채널을 위에서만 덮을 때와 양옆까지 감쌀 때, 짧은 채널은 어느 쪽이 잘 제어될까요?
- **predictionPrompt (learner-only):** Planar·FinFET·GAA 단면을 만져 보고 게이트가 1개인지 3개인지, 제어 면 3배면 전류도 3배인지 먼저 선택해요.
- **displayTextBeforePrediction:** 핀의 옆면을 감싸면 실제로 무엇이 달라질까요?
- **speechTextBeforePrediction:** 세 개의 그림을 돌려 보고 단면과 게이트가 무엇인지 예상해 봐요.
- **learnerAction:** Planar(top)→FinFET(top+2side)→GAA(all-around) 구조 조작, independently channelLength=long|short, drainBias=low|high; real leakage and Ion shown as UNKNOWN, gate input count kept1.
- **modelInputs:** architecture=planar|finfet|gaa; faceCount=1|3|4 schematic, physicalIndependentGateInputs=1 always; L=long|short, Vds=low|high qualitative. No numeric Id/Vth/temperature/doping/oxide/contact device model.
### ② 교사용 답은 조작 뒤 공개
- **expectedObservation (teacher-only):** One physical gate controls top/side fin or GAA surrounding channel. More gate-channel electrostatic enclosure helps manage short-channel effects in comparable designs, **not** exactly ×3/×4 on-current, zero leakage or independent 3/4 logical gates.
- **teacherExpectedAnswer (gated):** One physical gate controls top/side fin or GAA surrounding channel. More gate-channel electrostatic enclosure helps manage short-channel effects in comparable designs, **not** exactly ×3/×4 on-current, zero leakage or independent 3/4 logical gates.
- **correctIncorrectCriteria:** Compare two geometry choices and two L/Vds states; explain one electrode and why Ion/leakage cannot be fixed without doping/PVT/contact data.
- **misconceptions:** [m1] FinFET은 서로 다른 전압을 받는 세 개의 게이트예요. / [m2] 세 면을 덮으면 반드시 전류는 평면형의 세 배예요. / [m3] GAA면 온도와 전압에 무관하게 누설 전류가 완전 0이에요.
- **hints L1/L2/L3 (on request):** [L1] 제어 전극 하나와 표면 세 곳은 다른 말일까요? / [L2] 전류에 이동도와 채널 길이도 관여할까요? / [L3] OFF 전류에 온도·드레인 전압의 영향은 없을까요?
- **misconceptionFeedback/m1 (gated):** 세 면을 감싼 것은 하나의 게이트예요. 입력 게이트가 세 개 생긴 게 아니에요.
- **misconceptionFeedback/m2 (gated):** 더 잘 제어할 수 있어도 전류는 소재·이동도·접촉저항 등으로 달라져요. 세 배라고 단정할 수 없어요.
- **misconceptionFeedback/m3 (gated):** 누설은 전위 장벽과 바이어스·온도·공정 변동에 달려요. GAA만으로 0을 보장할 수 없어요.
- **feedback/correct:** 서로 다른 두 물리상태를 조작하고 WHY로 반례 조건을 설명했습니다. 제품 수치와 교육용 단순 모형을 구분해요.
- **displayTextAfterObservation (gated):** 감싼 면의 개수는 전기장 제어 힌트이지 성능 배수는 아니에요.
- **speechTextAfterObservation (gated):** FinFET의 윗면과 두 옆면은 하나의 게이트가 제어해요. GAA는 채널을 둘러싸며, 누설과 전류는 실제 공정 조건을 더 알아야 해요.
### ③ 시니어 설계 리뷰 및 부정분기
- **physicsAssumptions:** architecture=planar|finfet|gaa; faceCount=1|3|4 schematic, physicalIndependentGateInputs=1 always; L=long|short, Vds=low|high qualitative. No numeric Id/Vth/temperature/doping/oxide/contact device model. Full physical parasitics and PVT unmodeled; no commercial speed or wafer yield proof.
- **seniorDesignReview:** Short-channel DIBL/Vth roll-off vs electrostatics, workfunction/dielectric/PVT/contact/quantum limitations, no vendor PPA claims.
- **sourceRefs:** [D1][D2][D3]
- **negativePathTest:** Test every m1/m2/m3 cause-specific wrong physical answer and a correct-first path. Derived teacher numbers/after voice must not appear in before student DOM/Voice/aria. Passing requires two distinct actual controls + causal WHY, not clicking every card. A05 Chrome/browser/Voice QA only after A07 exact-source PASS.
- **nextHook:** 다음 실험에서 실제 칩과의 차이를 더 찾아볼까요?

## 15-S02 · gaa-sheet-width-perimeter · GAA 나노시트를 두 장에서 세 장으로 바꾸면 3배 빨라질까요?
### ① 먼저 예상하고 조작하기
- **sceneId:** gaa-sheet-width-perimeter
- **learningGoal:** 시트 폭·두께·장수를 독립 조작해 P=2(w+t)와 N×P를 계산하고, 계산한 기하학적 비율을 실제 Ion·C·동적 전력 배수와 구별한다.
- **priorKnowledge:** 15-S01,13
- **storyHook:** 리본 두 장에서 세 장으로 쌓았는데 전류까지 3배라고 광고할 수 있을까요?
- **question:** 리본 두 장에서 세 장으로 쌓았는데 전류까지 3배라고 광고할 수 있을까요?
- **predictionPrompt (learner-only):** 한 시트 폭20nm·두께5nm라면 둘레가 얼마인지, 2장과 3장의 합계 비율이 얼마일지 먼저 고르세요.
- **displayTextBeforePrediction:** 총 표면 길이와 전류는 같은 물리량일까요?
- **speechTextBeforePrediction:** 나노시트 두께와 폭을 자로 확인하고 시트 수를 직접 바꿔 보세요.
- **learnerAction:** Student first predicts total perimeter with `sheetCount=2|3`, then **independently** changes `sheetWidthNm=20|30` and `sheetThicknessNm=5|7`; show four rectangle faces and recalculate derived `perimeterEachNm=2×(w+t)` and `totalPerimeterNm=N×P` after submitted prediction. Base case N2 w20 t5 ⇒100nm and N3⇒150nm; alternative w30 t5 N2⇒140nm N3⇒210nm; alternative w20 t7 N2⇒108nm N3⇒162nm. Toy current and capacitance outputs explicitly `NOT_PROVEN`; only documented controls are present.
- **modelInputs:** `sheetCount:2|3`, `sheetWidthNm:20|30`, `sheetThicknessNm:5|7` are **real independent typed controls**; `perimeterEachNm=2*(sheetWidthNm+sheetThicknessNm)` and `totalPerimeterNm=sheetCount*perimeterEachNm` derived/read-only. Baseline w20 t5⇒P50 N2=100 N3=150 ratio1.5; w30 t5⇒P70, N2=140 N3=210; w20 t7⇒P54, N2=108 N3=162. `measuredOnCurrent=NOT_PROVEN`, `measuredGateCapacitance=NOT_PROVEN`, `realClockOrEnergyGain=NOT_PROVEN`: actual transport/contact/PVT not modeled.
### ② 교사용 답은 조작 뒤 공개
- **expectedObservation (teacher-only):** For baseline width20nm thickness5nm, a sheet perimeter=50nm; 2 sheets=100nm and3=150nm toy geometric ratio1.5. Width30 thickness5→perimeter70nm, N2=140/N3=210; width20 thickness7→perimeter54nm, N2=108/N3=162. Each ratio follows N=3/2 at equal w/t but real Ion, delay, gate C or switching power remain **NOT_PROVEN**.
- **teacherExpectedAnswer (gated):** Only AFTER two independent real controls and WHY: P=2(w+t), total=N×P; baseline P50 N2=100 N3=150; w30,t5 P70 N2=140 N3=210; w20,t7 P54 N2=108 N3=162nm. All are geometric-only quantities; current and switching energy have no numerical device prediction.
- **correctIncorrectCriteria:** Grade learner's arithmetic on two distinct manipulated axes (N2→3 and at least width20→30 or thickness5→7), correct baseline/alternate perimeter and 1.5 geometry ratio; require WHY contact/C/strain prevent measured current/energy inference. No arbitrary UI visit or phantom variable gives PASS.
- **misconceptions:** [m1] 시트가 2장에서3장이 되면 전류는 무조건3배예요. / [m2] 폭20nm짜리 사각 시트의 둘레도20nm예요. / [m3] 시트를 늘려 구동전류가 좋아지면 동적 스위칭 전력은 무조건 작아져요.
- **hints L1/L2/L3 (on request):** [L1] 네 변을 더해 보세요. / [L2] 2장과3장의 비율은 3/2일까요 3/1일까요? / [L3] 게이트 용량도 추가될 수 있어요.
- **misconceptionFeedback/m1 (gated):** 두 장에서 세 장이 되면 시트 수의 비는1.5예요. 실제 구동전류도 그 비를 따른다는 보장은 없어요.
- **misconceptionFeedback/m2 (gated):** 가로20과 세로5nm의 둘레는2×(20+5)=50nm예요.
- **misconceptionFeedback/m3 (gated):** 시트와 게이트 면적이 커지면 용량이 더해질 수 있어요. 스위칭 에너지는 직접 측정해야 해요.
- **feedback/correct:** 서로 다른 두 물리상태를 조작하고 WHY로 반례 조건을 설명했습니다. 제품 수치와 교육용 단순 모형을 구분해요.
- **displayTextAfterObservation (gated):** 장난감 표면 길이는 100에서150nm로 늘어도 칩 속도는 계산할 수 없어요.
- **speechTextAfterObservation (gated):** 두 장과 세 장의 전체 둘레는 각각 백, 백오십 나노미터예요. 전류와 스위칭 에너지는 기생저항과 게이트 용량을 더 확인해야 해요.
### ③ 시니어 설계 리뷰 및 부정분기
- **physicsAssumptions:** Rectangular geometric teaching cross-section only; w20|30nm t5|7nm N2|3. Derived P and N×P with real typed control; contact, mobility, oxide, workfunction, gate capacitance and thermal unknown, device Ion/power NOT_PROVEN. No SPICE or foundry prediction.
- **seniorDesignReview:** Quantum confinement, strain and channel stress, contact parasitic, vertical stack spacing and electrostatic vs Ion/capacitance co-optimization.
- **sourceRefs:** [D1][D2][D3]
- **negativePathTest:** Test every m1/m2/m3 cause-specific wrong physical answer and a correct-first path. Derived teacher numbers/after voice must not appear in before student DOM/Voice/aria. Passing requires two distinct actual controls + causal WHY, not clicking every card. A05 Chrome/browser/Voice QA only after A07 exact-source PASS.
- **nextHook:** 다음 실험에서 실제 칩과의 차이를 더 찾아볼까요?

- **R20 reviewer retest acceptance:** [x] Select (w20,t5,N2) → P50,total100; independently N3 →150; independently w30,t5,N2 →P70,total140; independently w20,t7,N3 →P54,total162. [x] All Ion/C/energy measured result `NOT_PROVEN`. [ ] Source A07 exact-new-SHA review and real A05 browser test.

## 15-S03 · cfet-complementary-stacking · CFET은 HBM처럼 칩을 포개는 걸까요?
### ① 먼저 예상하고 조작하기
- **sceneId:** cfet-complementary-stacking
- **learningGoal:** 수직 n+p 상보 CFET과 n+n·HBM TSV 적층을 구분하고, 콘택트 가용성의 독립 조건 및 이상적 pair 투영면적과 실제 셀 양산 밀도 차이를 평가한다.
- **priorKnowledge:** 01,06,15-S02
- **storyHook:** CMOS의 nFET과 pFET을 위아래로 포개면 메모리 적층과 같은 걸까요?
- **question:** CMOS의 nFET과 pFET을 위아래로 포개면 메모리 적층과 같은 걸까요?
- **predictionPrompt (learner-only):** 인버터의 n+p와 n+n 조합 중 올바른 걸 고르고, 옆으로2.4 toy면적 vs 수직1.2 toy면적의 의미를 예상해 보세요.
- **displayTextBeforePrediction:** 어떤 두 소자를 포개야 CMOS가 성립할까요?
- **speechTextBeforePrediction:** n형과 p형 카드를 위아래에 놓아 보고 두께와 면적을 구분해 봐요.
- **learnerAction:** Independently choose `devicePair=n+p|n+n|p+p|HBM-TSV`, `placement=adjacent|vertical` and **real** `contactAvailable=true|false`. Show hypothetical adjacent projection2.4 and vertical n+p projection1.2 toy units as *ungraded geometry evidence* if valid pair; `contactAvailable=false` must emit `INCOMPLETE_CONTACTS` and **cannot pass a functional CFET claim** even if n+p geometry and 1.2 toy projection match. `productDensityGain=NOT_PROVEN` always. Classify imec forksheet/CFET R&D status distinct from commercial HVM.
- **modelInputs:** Typed `devicePair:'n+p'|'n+n'|'p+p'|'HBM-TSV'`, `placement:'adjacent'|'vertical'`, `contactAvailable:boolean` (independent actual control), `projectedAdjacentAreaToy=2*(1+.2)=2.4`, `projectedVerticalAreaToy=1+.2=1.2`. `pairComplementary=(devicePair==='n+p')`; `state=WRONG_DEVICE_PAIR` unless n+p; `state=INCOMPLETE_CONTACTS` when n+p vertical and !contactAvailable; `state=TOY_CONCEPT_VALID` when n+p vertical and contactAvailable; `productDensityGain=NOT_PROVEN` in ALL states (routing, overlay, heat, yield excluded).
### ② 교사용 답은 조작 뒤 공개
- **expectedObservation (teacher-only):** n+p vertical with contactAvailable=true is *toy geometry/functional pair concept* with projection1.2 vs adjacent2.4, not measured real cell density; n+n cannot make complementary p pull-up; TSV memory-stack not transistor stack. n+p vertical but `contactAvailable=false` ⇒`INCOMPLETE_CONTACTS` and **no functional or commercial PASS**. Regardless of contact, `productDensityGain=NOT_PROVEN`.
- **teacherExpectedAnswer (gated):** Complementary CMOS needs nFET+pFET; projected adjacent2.4 vs ideal vertical1.2 only toy pair geometry (50% of projected toy footprint). Functional conceptual gate additionally requires `contactAvailable=true`; otherwise `INCOMPLETE_CONTACTS`. Any actual standard cell density, heat/yield, or universal CFET HVM proof remains `NOT_PROVEN`.
- **correctIncorrectCriteria:** Student must test n+p vertical contacts true and n+p vertical contacts false PLUS n+n or HBM alternative; treat `INCOMPLETE_CONTACTS` as scientific invalid despite numeric1.2; name physical contact/thermal challenges and research-vs-production. Correct-first allowed after two independent manipulated states+WHY.
- **misconceptions:** [m1] nFET 두 개를 쌓으면 위쪽이 자동으로 pFET이 돼요. / [m2] CFET은 HBM 메모리 다이를 TSV로 묶는 기술이에요. / [m3] 토이 면적을 절반으로 줄였으면 상용 칩 전체 밀도도 반드시 두 배가 돼요.
- **hints L1/L2/L3 (on request):** [L1] CMOS pull-up이 무슨 소자였죠? / [L2] 메모리 다이와 트랜지스터는 같은 단위인가요? / [L3] 실제 접점과 배선은 어느 공간을 사용하나요?
- **misconceptionFeedback/m1 (gated):** nFET+nFET은 pFET pull-up을 만들지 못해요. CFET의 complementary는 n+p 뜻이에요.
- **misconceptionFeedback/m2 (gated):** HBM TSV는 다이 사이 연결이에요. CFET은 서로 상보적인 트랜지스터의 수직 통합이에요.
- **misconceptionFeedback/m3 (gated):** 2.4→1.2는 접촉·배선을 뺀 투영 면적 실험이에요. 실제 셀 밀도·수율은 다른 문제예요.
- **feedback/correct:** 서로 다른 두 물리상태를 조작하고 WHY로 반례 조건을 설명했습니다. 제품 수치와 교육용 단순 모형을 구분해요.
- **displayTextAfterObservation (gated):** 상보 n+p 수직 CFET은 연구·제조 난제가 남은 소자 아키텍처예요.
- **speechTextAfterObservation (gated):** CFET은 n형과 p형을 쌓는 설계예요. 면적 가능성과 양산된 칩의 밀도는 다르고, HBM 칩 적층과도 별개죠.
### ③ 시니어 설계 리뷰 및 부정분기
- **physicsAssumptions:** Pair projected toy adjacent2.4 vs ideal vertical1.2 units; pin contacts can be represented by contactAvailable boolean but real access/yield/thermal unmodeled. Geometry cannot prove actual silicon density in ANY state; `productDensityGain=NOT_PROVEN`. Imec forksheet/CFET status research, not broad HVM.
- **seniorDesignReview:** Forksheet insulating divider and CFET sequential/monolithic integration are research concepts, no universal 2026 HVM; access contacts and self-heating determine full cell area.
- **sourceRefs:** [D4][D1]
- **negativePathTest:** Test every m1/m2/m3 cause-specific wrong physical answer and a correct-first path. Derived teacher numbers/after voice must not appear in before student DOM/Voice/aria. Passing requires two distinct actual controls + causal WHY, not clicking every card. A05 Chrome/browser/Voice QA only after A07 exact-source PASS.
- **nextHook:** 다음 실험에서 실제 칩과의 차이를 더 찾아볼까요?

- **R20 reviewer retest acceptance:** [x] n+p vertical with contactAvailable=true => `TOY_CONCEPT_VALID` **only as projection**, `productDensityGain=NOT_PROVEN`; n+p vertical with contactAvailable=false => `INCOMPLETE_CONTACTS` and no function PASS, despite projected area1.2; n+n vertical =>`WRONG_DEVICE_PAIR`, HBM TSV != CFET. [ ] A07 new-SHA and A05 actual scene tests.

## 15-S04 · backside-power-ir-drop · 전원을 칩 뒤로 보내면 데이터센터 전력도 절반일까요?
### ① 먼저 예상하고 조작하기
- **sceneId:** backside-power-ir-drop
- **learningGoal:** FinFET/GAA 채널 구조와 앞·뒤 전력배선을 독립 비교하고 V=IR 및 P=I²R를 계산해 국소 레일 손실을 전체 GPU/시설 전력으로 오해하지 않는다.
- **priorKnowledge:** 12,31,15-S01
- **storyHook:** 좁은 칩 앞면 배선 복도에서 전원선을 뒤로 보내면 어떤 값이 실제로 바뀔까요?
- **question:** 좁은 칩 앞면 배선 복도에서 전원선을 뒤로 보내면 어떤 값이 실제로 바뀔까요?
- **predictionPrompt (learner-only):** 전류10A로 고정하고 저항을2mΩ에서1mΩ로 줄이면 전압강하와 경로 손실은 각각 어떻게 바뀔까요?
- **displayTextBeforePrediction:** 전력 경로와 게이트 구조는 같은 설계 스위치일까요?
- **speechTextBeforePrediction:** 전력선과 게이트를 서로 다른 버튼으로 바꿔보세요. 어느 쪽이 전압강하를 바꿀지 예상해 봐요.
- **learnerAction:** 학생은 `gateArchitecture=FinFET|GAA` 와 `powerRoute=front|back`을 **서로 독립** 조작한다. 전류 `currentA=10`은 고정되어 있으며 저항은 별도 슬라이더가 아니라 **경로에서 자동 도출되는 읽기 전용 값** (`front→2mΩ`, `back→1mΩ`)이다. GAA+front, FinFET+back, GAA+back, FinFET+front 네 조합 중 2개 이상을 비교해 Ohm 전압 강하와 해당 경로 Joule 손실을 예측한 뒤 계산한다. GAA만 바꿔서는 R·IR·I²R이 바뀌지 않는다. '전체 시설 전력 절반'과 'front 경로인데 수동 R1mΩ'은 둘 다 거절하며, 이 교육 모형에는 저항 직접 오버라이드 버튼이 **존재하지 않는다**. 별도 본드/접점/열 특성은 `NOT_PROVEN`.
- **modelInputs:** 명시적 **typed independent controls**: `gateArchitecture:'FinFET'|'GAA'`, `powerRoute:'front'|'back'`, `currentA=10` (noneditable constant). 읽기 전용 derived `resistanceOhm = powerRoute==='front'?0.002:0.001`; `voltageDropV=currentA*resistanceOhm`; `localLossW=currentA*currentA*resistanceOhm`. Gate type does **not** enter R formula; no independently mutable resistance selector or `manualResistanceOhm`. Front+either gate⇒R2mΩ, Vdrop20mV, local heat0.20W; back+either gate⇒R1mΩ, Vdrop10mV, local heat0.10W. `totalChipSaving=NOT_PROVEN`, `totalFacilitySaving=NOT_PROVEN`, `backsideContactQuality=NOT_PROVEN`. If a UI attempts `powerRoute='front'` with manual R1mΩ or gate-switch-induced R change, return `INVALID_UNDECLARED_OVERRIDE`/`MODEL_INCONSISTENCY` and **no mastery credit**; reset selection to route-derived R. This toy is one isolated DC power path, not actual chip.
### ② 교사용 답은 조작 뒤 공개
- **expectedObservation (teacher-only):** 전류10A 고정, route front⇒R2mΩ/IR20mV/경로열손실0.20W; route back⇒R1mΩ/IR10mV/경로열손실0.10W. **GAA+front도 20mV/0.20W**, **FinFET+back도10mV/0.10W**, GAA+back도10mV/0.10W. 게이트 구조만 바꿔도 저항·전압이 저절로 변하지 않는다. 수동 저항 입력 자체가 없는 모형이며 front+R1mΩ 수동 가정은 `INVALID_UNDECLARED_OVERRIDE`; 후면 연락/실제 전체 칩·시설 에너지 절감은 `NOT_PROVEN`.
- **teacherExpectedAnswer (gated):** `gateArchitecture`와 `powerRoute`는 독립: `routeResistanceΩ = front?0.002:0.001` (read-only). 전류 10A에서 front 20mV/0.20W, back 10mV/0.10W (각 하나의 가상 경로). GAA+front도 front 값, FinFET+back도 back 값이다. Front 경로가 R1mΩ이라고 수동 입력하는 계약은 없으므로 즉시 invalid, 보정된 과학 결과를 성취 PASS로 세지 않는다. 열·접점·실제 GPU/데이터센터 전력 절감률 미입증.
- **correctIncorrectCriteria:** 최소 **두 개 독립 실제 조작 축** `gateArchitecture`와 `powerRoute`를 모두 변경하고 **GAA+front 20mV/0.20W, FinFET+back 10mV/0.10W**를 명시적 route-derived R로 검산하며, GAA-only 전환은 전원경로 R 미변경이라는 이유를 설명하면 PASS (첫 예측 정답도 허용). 모든 조합에서 전류10A, 전압 IR과 열 I²R 단위를 올바르게 사용해야 하며 수동 R override 없는 `front+R1mΩ` 선택/구현과 전체 랙 전력 반감 주장은 `INVALID_UNDECLARED_OVERRIDE` 또는 `SCOPE_OVERREACH`, PASS 금지.
- **misconceptions:** [m1] 한 전력 경로가 절반 손실이면 데이터센터 전체 전력도 반드시 절반이 돼요. / [m2] IR 전압강하는 I×R 대신 I²×R로 계산해요. / [m3] GAA를 만들면 별도 공정 없이 자동으로 후면 전력망이 생겨요.
- **hints L1/L2/L3 (on request):** [L1] 수식에 포함한 전력 경로는 하나뿐이에요. / [L2] 전압과 열손실은 각각 어느 단위를 갖나요? / [L3] 채널 게이트와 전원 배선의 목적을 나눠 봐요.
- **misconceptionFeedback/m1 (gated):** 지금은 작은 가상 경로의 열손실 .2W→.1W만 비교했어요. 서버나 시설 전체는 계산하지 않았어요.
- **misconceptionFeedback/m2 (gated):** 전압은 IR로20mV, 손실열은 I²R로0.2W예요. 단위부터 구별해야 해요.
- **misconceptionFeedback/m3 (gated):** GAA는 채널 제어 구조, 후면 전력은 별도 배선/접촉 설계예요. 독립적으로 선택할 수 있어요.
- **feedback/correct:** 서로 다른 두 물리상태를 조작하고 WHY로 반례 조건을 설명했습니다. 제품 수치와 교육용 단순 모형을 구분해요.
- **displayTextAfterObservation (gated):** 해당 경로 손실은 달라지지만 서버 전력량은 별도로 계산해야 해요.
- **speechTextAfterObservation (gated):** 10암페어에서 두 밀리옴은 전압 강하20밀리볼트예요. 저항이 절반이면 경로 열손실은 줄지만 이것만으로 전체 데이터센터의 절감률은 알 수 없어요.
### ③ 시니어 설계 리뷰 및 부정분기
- **physicsAssumptions:** 가상 하나의 DC 지역 전력망으로 `I=10A` 일정, frontR2mΩ/backR1mΩ **route 고정 도출, 수동값 아님**, `gateArchitecture`는 FinFET|GAA로 독립이고 손실에 직접 들어가지 않음. I*R 20/10mV, I²R .20/.10W. VRM·패키지·접점 기생·Ldi/dt·동적 전압 droop·칩/데이터센터 부하 미모형화, `totalFacilitySaving=NOT_PROVEN`. 실제 PowerVia/A16 제조사 수치는 이 toy 경로의 입력이 아님.
- **seniorDesignReview:** IR drop, rail and signal routing resource contention, voltage droop/transients omitted, backside contact reliability and thermal/debug; Intel PowerVia vs TSMC SPR not same benchmark.
- **sourceRefs:** [D2][D3][D5]
- **negativePathTest:** A07 R22-01 reviewer four route/type combinations and invalid event matrix: (`FinFET`,`front`)→2mΩ/20mV/.20W; (`GAA`,`front`)→same 2mΩ/20mV/.20W; (`FinFET`,`back`)→1mΩ/10mV/.10W; (`GAA`,`back`)→same 1mΩ/10mV/.10W. Change gate only: R and voltage stay identical. Change route only: derived R changes. Reject undeclared resistance manual override: `front + R1mΩ` → `INVALID_UNDECLARED_OVERRIDE` and no mastery credit; reject "backside halves whole facility power"→`SCOPE_OVERREACH`; m1/m2/m3 match only relevant causal Korean feedback. Real source author must not expose correct numeric teacher outcomes through pre-prediction Voice/DOM/ARIA, first-correct students pass after 2 independently changed controls and WHY. Actual A05 Chromium/Voice/mobile/CI proof only after A07 exact SHA approved.
- **nextHook:** 다음 실험에서 실제 칩과의 차이를 더 찾아볼까요?

## 15-S05 · device-ppa-node-energy · 2nm와 36% 전력 절감, 무엇을 확인해야 믿을 수 있나요?
### ① 먼저 예상하고 조작하기
- **sceneId:** device-ppa-node-energy
- **learningGoal:** 동일 활동도·C·f에서 전압 변화의 αCV²f 동적 전력만 계산하고, 누설·타이밍 미확정 상태와 파운드리 세대명·CFET 연구/양산 상태를 구분한다.
- **priorKnowledge:** 13,31,15-S04
- **storyHook:** 파운드리 공정 이름은 나노미터, 개선 수치는 퍼센트. 무엇이 실제 측정됐을까요?
- **question:** 파운드리 공정 이름은 나노미터, 개선 수치는 퍼센트. 무엇이 실제 측정됐을까요?
- **predictionPrompt (learner-only):** VDD만1.0V에서0.8V로 낮추고 활동도·용량·주파수가 같을 때 **동적 스위칭** 전력의 변화를 예측해 보세요. 총 서버전력도 같은 비율일까요?
- **displayTextBeforePrediction:** 숫자가 좋아 보여도 무엇의 비율인지 먼저 정할까요?
- **speechTextBeforePrediction:** 전압을 내리고 변하지 않은 조건과 미측정 조건을 따로 골라봐요. 연구와 제품 출하도 구분해 봐요.
- **learnerAction:** Student changes `Vdd=1.0|0.8V` then **independently** toggles `scenario='fixedDynamicOnly'|'leakageAndTimingUnknown'` while examining `vendorSourceStatus` cards (Samsung SF3 initial announced 2022, TSMC N2 HVM stated 4Q25, Intel 18A platform manufacturer claims, imec outer-wall forksheet/CFET research). In both scenarios calculate explicitly **conditional** α=.2,C=1nF,f=1GHz dynamic component 0.2→0.128W only *under the stipulated fixed α,C,f*. All `totalChipPowerSaving`, `energyPerTaskGain`, actual frequency and `actualGateLength` stay `NOT_PROVEN`; unknown-leakage scenario MUST reject global 36% marketing claim.
- **modelInputs:** Typed `Vdd:1.0|0.8`, `scenario:'fixedDynamicOnly'|'leakageAndTimingUnknown'`, `alphaFixed=0.2`, `capacitanceFaradFixed=1e-9`, `frequencyHzFixed=1e9` are explicit classroom assumptions. `PdynamicToy=alpha*C*Vdd^2*f`: at V1.0→0.2W, at .8→0.128W, ratio.64, 36% reduction of **conditional dynamic portion**. If scenario=fixedDynamicOnly, return `DYNAMIC_ONLY_TOY_PASS` on correct arithmetic+scope; if scenario=leakageAndTimingUnknown, return `SYSTEM_GAIN_NOT_PROVEN` for all claims on total/energy/timing (still display conditional dynamic calculation). Always `totalChipPowerSaving=NOT_PROVEN`, `energyPerTaskGain=NOT_PROVEN`, `realFrequencyChange=NOT_PROVEN`, `physicalGateLengthNm=UNKNOWN`. `vendorSourceStatus={samsungSF3:'manufacturer_2022_initial_production',tsmcN2:'manufacturer_2025Q4_HVM_reported',intel18A:'manufacturer_process_claim',imecForksheetCFET:'research_not_universal_HVM'}`; node labels 2nm/18A categorical only.
### ② 교사용 답은 조작 뒤 공개
- **expectedObservation (teacher-only):** Under stipulated α=.2 C1nF f1GHz, voltage 1.0→0.8 produces conditional dynamic 0.2→0.128W, ratio.64, -36% of that component. `scenario=leakageAndTimingUnknown` must show `SYSTEM_GAIN_NOT_PROVEN`: neither total chip power, latency nor task energy can be inferred. Both scenarios `totalChipPowerSaving=NOT_PROVEN` and node 2nm/18A label ≠ literal physical gate length. Vendor statuses must not equate imec research with universal CFET production.
- **teacherExpectedAnswer (gated):** Math for *toy dynamic part* conditional on fixed α/C/f only: .2W at1V, .128W at.8V, -36%. `fixedDynamicOnly` => DYNAMIC_ONLY_TOY_PASS, not whole-chip; `leakageAndTimingUnknown` => SYSTEM_GAIN_NOT_PROVEN for product total and per-task energy, not false measured benefits. Node name physical gate length UNKNOWN; imec forksheet CFET is research not all-foundry HVM.
- **correctIncorrectCriteria:** Require two distinct Vdd settings plus actual `scenario` toggle and one real `vendorSourceStatus` research-vs-manufacturer classification; grade dynamic math only as conditional, reject total-chip 36%, physical gate length=2nm, imec research→universal HVM even if learner manipulated controls. Correct-first permitted without deliberate incorrect branch.
- **misconceptions:** [m1] 2nm 공정이면 모든 실제 트랜지스터 게이트 길이가2nm예요. / [m2] 동적전력36%를 줄이면 서비스·냉각 포함 시설 총 사용전력도 반드시36% 줄어요. / [m3] imec CFET 시뮬레이션 발표는 모든 파운드리의 CFET 양산 완료를 증명해요.
- **hints L1/L2/L3 (on request):** [L1] 노드명과 실제 gateLength 측정치는 동일할까요? / [L2] 누설과 회로 속도는 이번 토이 수식에 있나요? / [L3] 연구·양산 발표 상태는 다른 종류의 증거예요.
- **misconceptionFeedback/m1 (gated):** 2nm는 공정 세대 이름이며 모든 물리 길이가 동일한2nm로 측정됐다는 뜻은 아니에요.
- **misconceptionFeedback/m2 (gated):** 36%는 αCV²f의 **동적 부분만** 고정 조건에서 줄어든 값이에요. 나머지 전력과 처리시간은 빠졌어요.
- **misconceptionFeedback/m3 (gated):** CFET·forksheet 연구에서 검증된 개념과 상용 팹 양산은 별도 단계예요. 발표 주체·날짜·조건을 확인해요.
- **feedback/correct:** 서로 다른 두 물리상태를 조작하고 WHY로 반례 조건을 설명했습니다. 제품 수치와 교육용 단순 모형을 구분해요.
- **displayTextAfterObservation (gated):** 동적 스위칭 전력만 36% 감소하는 장난감 모형이에요.
- **speechTextAfterObservation (gated):** 전압을1볼트에서0.8볼트로 낮추면 고정된 다른 조건에서 동적 전력은0.2에서0.128와트로 낮아져요. 총전력과 칩 성능은 따로 실측해야 해요.
### ③ 시니어 설계 리뷰 및 부정분기
- **physicsAssumptions:** α=.2 C1nF f1GHz fixed only for conditional dynamic proxy. Real leakage, target frequency, timing/thermal, task count, PVT and energy total unknown. `scenario` and `vendorSourceStatus` actual typed learner states, totalChipPowerSaving/systemThroughput/energyPerTask all NOT_PROVEN. Brand node not measured gate length.
- **seniorDesignReview:** Iso-power vs iso-frequency and VDD/TDP PPA baselines, switching vs static energy, DTCO/EDA node portability, manufacturer status timeline and source bias.
- **sourceRefs:** [D1][D2][D3][D4][D6]
- **negativePathTest:** Test every m1/m2/m3 cause-specific wrong physical answer and a correct-first path. Derived teacher numbers/after voice must not appear in before student DOM/Voice/aria. Passing requires two distinct actual controls + causal WHY, not clicking every card. A05 Chrome/browser/Voice QA only after A07 exact-source PASS.
- **nextHook:** 이제 EDA·STA와 DRAM 신뢰성까지 이어서 확인해 봐요.

- **R20 reviewer retest acceptance:** [x] 1V=>0.2W/0.8V=>0.128W (conditional dynamic proxy); independent `scenario=leakageAndTimingUnknown` => `SYSTEM_GAIN_NOT_PROVEN`, never total-saving36%; `vendorSourceStatus.imecForksheetCFET='research_not_universal_HVM'`; node name2nm does not produce physicalGateLengthNm=2. [ ] A07 new-SHA and A05 browser negative tests.

## 5-step independent A07 math & UI acceptance vector
| Step | After-observation toy truth | Invalid claims to reject |
|---|---|---|
| 15-S01 | planar top, FinFET one gate top+2 sides, GAA one gate all-around | 3/4 distinct gates or current multipliers or perfect off current |
| 15-S02 | rectangular w20 t5 P50nm, 2 sheets100nm, 3 sheets150nm =>1.5 geometrical proxy | 3x measured Ion or guaranteed power saving |
| 15-S03 | n+p vertically complementary, adjacent pair2.4 toy units vs stacked1.2 toy =>50% projection only | n+n CMOS, TSV HBM same as CFET, finished cell density2x promise |
| 15-S04 | I10A R2mΩ front=>20mV,0.2W and R1mΩ back=>10mV,0.1W *single local path* | facility GPU power half, backside mandatory GAA |
| 15-S05 | α0.2 C1nF f1GHz V1=>0.2W, V0.8=>0.128W; dynamic reduction36% | 36% total energy improvement, node gate length literally2nm or CFET universal HVM |
- **NEXT A07** independently check exact story+deep SHAs and 15 keyed wrong/5 neutral pre Voice+gated after, no A05 scene until A07 EDU_QA_PASS_SOURCE. **NEXT A05** implement five actual 2.5D scenes only after validated source, Chrome/mobile/keyboard/Voice/aria negative cases/CI/tested SHA/screens → direct A02. Owner RELEASE_HOLD.
## Source register · checkedAt=2026-10-17
[D1] Samsung official GAA 3nm initial production https://semiconductor.samsung.com/us/news-events/news/samsung-begins-chip-production-using-3nm-process-technology-with-gaa-architecture/
[D2] Intel official 18A RibbonFET/PowerVia https://www.intel.com/content/www/us/en/foundry/process/18a.html
[D3] TSMC N2 2025 Annual https://investor.tsmc.com/static/annualReports/2025/english/index.html and A16 backside https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_A16
[D4] imec research forksheet to CFET https://www.imec-int.com/en/articles/outer-wall-forksheet-bridge-nanosheet-and-cfet-device-architectures-logic-technology
[D5] Intel PowerVia thermal/debug https://www.intel.com/content/www/us/en/newsroom/news/powervia-test-shows-industry-leading-performance.html
[D6] Toy symbolic idealized circuit/electrostatics relations, not verified foundry product SPICE.

## A06 R20-01–04 corrected causal teaching state contracts (2026-10-17)
- [A07 original independent R20 audit](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-20-lesson15-gaa-cfet-bspdn-first-audit.md) judged all 5 physical/math/model stories and 15 misconception-specific feedback scientifically sound on **older** blob `3cd5fdad`, but MAJOR_OPEN educational control contract. **A06 now corrected** all five literal undefined learningGoal fields to measurable Korean objectives.
- S02 real independent `sheetCount2|3`, `sheetWidthNm20|30`, `sheetThicknessNm5|7` controls, all derived perimeters, dropped phantom gateCapacitanceVaries toggle. Baseline w20,t5 P50, N2=100,N3=150; alternate w30,t5 P70, N2=140,N3=210; w20,t7 P54, N2=108,N3=162nm; power/current NOT_PROVEN.
- S03 real independent typed `contactAvailable` and state INCOMPLETE_CONTACTS on n+p vertical when false, irrespective of toy area1.2; productDensityGain NOT_PROVEN for all scenarios.
- S05 typed `scenario` vs actual manufacturer/research `vendorSourceStatus`; αCV²f dynamic0.2→0.128W under fixed α,C,f remains conditional, both scenarios totalChipPowerSaving=NOT_PROVEN; reject leap from imec research to universal mass production.
- These changes do not overwrite A07 old-SHA source verdict, and new exact lesson SHA must be re-reviewed. A05 scene/runtime/browser NOT YET authorized.

## A06 R22-01 route-derived resistance causal contract correction · 2026-10-17
- Reviewer [A07 Round22](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-22-lesson15-corrected-retake.md) accepted old R20-01..04 but found **new** S04 `gateArchitecture`, `powerRoute`, independent resistance ambiguity. Corrected S04 uses only two actual independent selectable axes, gate and route; `resistanceOhm` read-only computed from route (front2mΩ/back1mΩ), I10A fixed. `front+manual1mΩ` cannot be valid because no override; GAA+front stays20mV/.20W, FinFET+back10mV/.10W. Gate does not set power route. Author self-check only, independent A07 NEW SHA retest required before STORY_READY and A05 handoff. No physical chip/prod power guarantees.
