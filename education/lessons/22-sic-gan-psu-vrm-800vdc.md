# Lesson22 · SiC/GaN 전력반도체에서 800VDC AI 데이터센터까지 — 다섯 번의 전력 미션
> **A06 ORIGINAL_AUTHOR_SOURCE_DONE / NEXT:A07 INDEPENDENT SCIENCE+EDU_SOURCE_REVIEW**; 2026-10-18. [Infineon/Wolfspeed/NVIDIA public senior evidence](../deep-dives/22-sic-gan-power-psu-800vdc.md), [pipeline #62](https://github.com/Junebooky/interactive-engineering/issues/62). Prior23 authored lessons/103 Steps + NEW22 5 Steps => **24 authored lessons/108 Steps**. This counts docs, not reviewer/Chromium/PDK/hardware validation. All voltages/currents are **fictional simulations only, no physical build or 800V handling instructions**.
> Prior01 MOSFET,06 packaging,12/13 unit circuits,15 GAA,20 physical EDA,31 server power and PUE,10 AI DC. Next advanced semiconductor 23 physical test/burn-in, 32 AI SLO, PSU redundancy. Scene stories explicitly separate power efficiency, switch voltage/f, buck ripple, thermal and rack bus distribution safety.

## Safety and learner-first grading boundary
- **Learner BEFORE state** only storyHook, predictionPrompt, displayTextBeforePrediction and speechTextBeforePrediction + neutral definitions; full numeric after `expectedObservation`, `teacherExpectedAnswer`, 3 cause-code feedback, and `speechTextAfterObservation` must NOT be included in pre-prediction DOM/ARIA/TTS. Require prediction+two genuine independently changed typed axes+causal WHY, correct-first PASS supported without requiring deliberately wrong choices, hints L1–L3 requestable and progressive.
- Actual component ratings, power conversion efficiency curves, safety certifications, compliance, infrared thermal, EMI, real equipment and deployment remain NOT_PROVEN, no physical supply assembly or gate-bias instructions. No unqualified material or NVIDIA roadmap product promises. A07 independent original source PASS first before A05 scene coding; A05 and A02 actual app/browser QA distinct.

## 22-S01 · `psu-vrm-efficiency-heat` · 전력 효율 95%가 되면 AI 서버가 5% 빨라질까요?
### ① 호기심과 독립 조작
- **sceneId:** psu-vrm-efficiency-heat
- **learningGoal:** 출력 고정100W인 가상48V DC 변환기에서 η90/95%와 입력 전력·변환 열손실을 별도 계산하고 시스템 처리속도와 구분한다.
- **priorKnowledge:** 12 V/I/R,13 fractions,31 PSU/VRM
- **storyHook:** GPU에 똑같이 백 와트를 전달하는 두 전원 장치, 하나는 더 뜨거워요. 왜 그럴까요?
- **question:** GPU에 똑같이 백 와트를 전달하는 두 전원 장치, 하나는 더 뜨거워요. 왜 그럴까요?
- **predictionPrompt (learner-only):** 둘 다 출력100W인데 효율을90%에서95%로 바꾸면 입력 W와 소자 내부 손실W는 어떻게 달라질까요?
- **displayTextBeforePrediction:** 똑같은 출력을 유지하며 효율만 바꾸면 무엇이 줄어들까요?
- **speechTextBeforePrediction:** 두 전원 장치의 출력과 변환 효율을 각각 선택하고 뜨거워지는 에너지 양을 예상해 보세요.
- **learnerAction:** 독립 학생 입력 `outputW=100|200`과 `efficiency=0.90|0.95`를 바꿔 `inputW=outputW/efficiency`, `lossW=inputW-outputW`를 비교한다. `nominalInputV=48`은 수업용 상수, 입력전류는 계산값만 보인다. 부하 증가와 변환기 효율 변화를 같은 토글로 취급하지 않는다.
- **modelInputs:** `outputW:100|200`, `efficiency:0.90|0.95` independent typed controls, `nominalInputV=48` constant, `inputW=outputW/efficiency`, `conversionLossW=inputW-outputW`, `inputCurrentA=inputW/48`. With output100W, η.90→111.111W in/11.111W lost; η.95→105.263W in/5.263W lost. output200 and η.90→222.222W in/22.222W lost; η.95→210.526W in/10.526W lost. `rackEnergySavings=NOT_PROVEN`, `GPUThroughputGain=NOT_PROVEN`. All efficiency numbers hypothetical same load/temp.
### ② 학생 조작 + WHY 이후에만 교사용 정답/맞춤 교정 공개
- **expectedObservation (teacher-only):** 100W useful output atη90% needs111.111W in with11.111W loss; at95% needs105.263W in/5.263W loss. Both deliver same 100W, not a 5% compute speed or rack energy gain guarantee. Loss can become heat, but actual cooler, conversion stages and PUE not modeled.
- **teacherExpectedAnswer (gated):** 100W useful output atη90% needs111.111W in with11.111W loss; at95% needs105.263W in/5.263W loss. Both deliver same 100W, not a 5% compute speed or rack energy gain guarantee. Loss can become heat, but actual cooler, conversion stages and PUE not modeled.
- **correctIncorrectCriteria:** Change outputW and efficiency separately, compute two 100W states plus a 200W countercase and WHY output power≠efficiency or AI tokens/s.
- **misconceptions:** [m1] 효율90%라면 GPU가 실제로 받는 출력이 반드시90W로 줄어요. / [m2] 효율95%는 효율90%보다 계산 처리속도가 정확히5% 더 빨라진다는 뜻이에요. / [m3] 출력100W에 효율90%라면 변환기 열손실은 정확히10W예요.
- **hints L1/L2/L3 (on request):** [L1] η가 출력/입력 중 무엇으로 정의되나요? / [L2] 전기적 변환기 효율과 GPU 연산 성능은 다른 수치예요. / [L3] 100/0.9와100/0.95를 계산하고 각각100을 빼요.
- **misconceptionFeedback/m1 (gated):** 이 문제는 출력이100W로 고정된 상태예요. 90% 효율이면 더 많은 입력 전력이 필요하죠.
- **misconceptionFeedback/m2 (gated):** 전력 변환 열손실이 줄어도 GPU 클록·작업량과 서비스 성능은 별도 검증해야 해요.
- **misconceptionFeedback/m3 (gated):** 입력은100/0.9≈111.111W라 손실은11.111W예요. 출력의 10%가 아니에요.
- **feedback/correct:** 두 개의 독립 상태와 WHY를 확인했습니다. 수업용 숫자를 실제품/시설 성능·안전 보증으로 바꾸지 않았어요.
- **displayTextAfterObservation (gated):** 효율이 높아지면 같은 출력을 내기 위해 필요한 입력과 국소 손실이 줄 수 있어요.
- **speechTextAfterObservation (gated):** 백 와트를 전달할 때 구십 퍼센트 효율은 약 백십일 와트 입력이 필요해요. 구십오 퍼센트라면 약 백오 와트가 필요하죠. 이 숫자는 GPU 속도가 아닙니다.
### ③ 시니어 설계 리뷰
- **physicsAssumptions:** 이상적인 교실 수식 및 명시된 고정 변수만 유효. 데이터시트/온도/부하/전원/고장/규제와 디바이스 실제 EMI 값은 구하지 않았어요.
- **seniorDesignReview:** AC/DC stages and DC/DC stages require individual operating point efficiency curves, losses and thermal constraints, not one fixed PSU efficiency number for all load profiles.
- **sourceRefs:** [R1][R6]
- **negativePathTest:** Student independently changes two declared typed state dimensions and supplies WHY; no pre-answer leaks of correct numeric values in Voice/DOM/ARIA, no forced wrong, m1/m2/m3 wrong branches each require a distinct cause-matched explanation. For parameter changes after a test, create a new trial rather than retroactive mastery. Reject conversions that claim whole-facility efficiency, real product safe operating area, or real high-voltage setup methods. Actual Chromium/Voice/browser test A05 owns after independent A07 source QA.
- **nextHook:** 다음 실험에서 전원 변환의 다른 비용을 찾아봐요.

## 22-S02 · `wbg-sic-gan-cap-switch-loss` · SiC·GaN이면 스위칭 손실이 자동으로 0일까요?
### ① 호기심과 독립 조작
- **sceneId:** wbg-sic-gan-cap-switch-loss
- **learningGoal:** 가상 고정 커패시턴스의 1회 충전·방전 주기 C V² f를 전압·주파수 독립 조작으로 계산하고 Si/SiC/GaN 재료명만으로 실소자 손실을 확정하지 않는다.
- **priorKnowledge:** 01 FET gate,12 capacitance and Joule,15 FET architecture
- **storyHook:** GaN·SiC 스위치는 빠르다는데, 빨리 켰다 끌수록 진짜 무조건 시원할까요?
- **question:** GaN·SiC 스위치는 빠르다는데, 빨리 켰다 끌수록 진짜 무조건 시원할까요?
- **predictionPrompt (learner-only):** 고정 C=100pF에서 스위칭 전압100→200V면 동작 에너지 항은 몇 배일까요? f100→500kHz면요?
- **displayTextBeforePrediction:** 재료가 다르면 실제 전력 손실 수치도 자동 결정될까요?
- **speechTextBeforePrediction:** 재료 카드와 전압·주파수 슬라이더를 따로 바꾸며 이번 수업이 아는 값과 모르는 값을 구분해 보세요.
- **learnerAction:** `switchVoltageV=100|200`과 `switchFrequencyKHz=100|500`을 독립으로 조작하고 `deviceMaterial=Si|SiC|GaN` 카드는 **소자 카테고리 설명만** 바꾼다. 회로의 Ceff=100pF 가정은 재료 변경으로 자동으로 바뀌지 않으며 `measuredSwitchLossW=NOT_PROVEN`을 표시한다. 임의의 게이트 바이어스/제품 수치 없이 고정 C의 충전·방전 에너지 단순항만 계산한다.
- **modelInputs:** typed `switchVoltageV:100|200`, `switchFrequencyKHz:100|500`, `deviceMaterial:'Si'|'SiC'|'GaN'` independent categorical, `CeffFarad=100e-12` fixed, `PcapToy=CeffFarad*V^2*(fKHz*1000)` assuming each cycle one charge+discharge with no recovery. V100/f100k ⇒0.1W, V200/f100k⇒0.4W, V100/f500k⇒0.5W, V200/f500k⇒2.0W. `actualLoss=NOT_PROVEN` all device choices; `deviceVoltageRating=UNKNOWN` no material-to-rating mapping; driver bias and FET Coss nonlinear unmodeled.
### ② 학생 조작 + WHY 이후에만 교사용 정답/맞춤 교정 공개
- **expectedObservation (teacher-only):** With C fixed, doubling V quadruples this charge/discharge power proxy, f×5 multiplies by5. Choosing GaN or SiC does not magically set C=0 or certify voltage rating. Real SiC MOSFET/GaN power HEMT differ in gate drivers/voltage ratings, package/EMI and converter topology; product efficiency requires actual data.
- **teacherExpectedAnswer (gated):** With C fixed, doubling V quadruples this charge/discharge power proxy, f×5 multiplies by5. Choosing GaN or SiC does not magically set C=0 or certify voltage rating. Real SiC MOSFET/GaN power HEMT differ in gate drivers/voltage ratings, package/EMI and converter topology; product efficiency requires actual data.
- **correctIncorrectCriteria:** Actually change both V and f and separately compare material labels, compute .1/.4/.5/2W, reject inference that category implies a tested product gate-loss, zero EMI or universally higher voltage rating.
- **misconceptions:** [m1] GaN이라는 재료를 고르기만 하면 가상 커패시터 전력은 무조건0W가 돼요. / [m2] 전압을100V에서200V로 두 배 올리면 C V² f 손실 항도 두 배만 커져요. / [m3] SiC는 실제 부품 데이터시트나 게이트 드라이버 조건과 무관하게 모든 전원 회로에서 무조건 최고 효율이에요.
- **hints L1/L2/L3 (on request):** [L1] 식에서 전압은 제곱으로 들어가요. / [L2] 재료 이름과 실제 소자의 정전용량·스위칭 조건은 다른 입력이에요. / [L3] 게이트 드라이버·EMI·방열·VDS 정격도 함께 확인해야 해요.
- **misconceptionFeedback/m1 (gated):** 재료가 바뀌어도 이 수업에선 Ceff100pF가 고정돼 있어요. 실소자 손실은 데이터시트와 회로가 필요해요.
- **misconceptionFeedback/m2 (gated):** 전압의 제곱에 비례하므로 두 배 전압은 고정 조건에서 네 배가 돼요.
- **misconceptionFeedback/m3 (gated):** SiC와 GaN은 적용 전압·구동·패키지에 따른 장단점이 있어요. 최고의 재료는 조건 없이 정할 수 없어요.
- **feedback/correct:** 두 개의 독립 상태와 WHY를 확인했습니다. 수업용 숫자를 실제품/시설 성능·안전 보증으로 바꾸지 않았어요.
- **displayTextAfterObservation (gated):** 가상의 고정 C 스위칭 항은 커질 수 있고 재료만으로 실소자 효율은 계산할 수 없어요.
- **speechTextAfterObservation (gated):** 전압이 두 배면 고정 커패시터의 스위칭 전력은 네 배가 돼요. SiC나 GaN을 선택해도 실제 드라이버와 소자 손실은 따로 측정해야 합니다.
### ③ 시니어 설계 리뷰
- **physicsAssumptions:** 이상적인 교실 수식 및 명시된 고정 변수만 유효. 데이터시트/온도/부하/전원/고장/규제와 디바이스 실제 EMI 값은 구하지 않았어요.
- **seniorDesignReview:** Eoss and Coss(V) nonlinear, loss recovery/ZVS hard vs soft switching, gate drive rating/VGS/false turn-on reliability, GaN power HEMT vs SiC MOSFET and RF GaN purpose distinct.
- **sourceRefs:** [R1][R2][R3][R4]
- **negativePathTest:** Student independently changes two declared typed state dimensions and supplies WHY; no pre-answer leaks of correct numeric values in Voice/DOM/ARIA, no forced wrong, m1/m2/m3 wrong branches each require a distinct cause-matched explanation. For parameter changes after a test, create a new trial rather than retroactive mastery. Reject conversions that claim whole-facility efficiency, real product safe operating area, or real high-voltage setup methods. Actual Chromium/Voice/browser test A05 owns after independent A07 source QA.
- **nextHook:** 다음 실험에서 전원 변환의 다른 비용을 찾아봐요.

## 22-S03 · `buck-vrm-current-ripple` · 스위칭을 두 배 빠르게 하면 리플과 EMI도 동시에 사라질까요?
### ① 호기심과 독립 조작
- **sceneId:** buck-vrm-current-ripple
- **learningGoal:** 이상적 연속전류모드 buck Vin48→Vout12V에서 L·f를 독립 조작해 인덕터 전류 리플 ΔI를 계산하고 EMI·실제 전력손실 개선은 별개라고 설명한다.
- **priorKnowledge:** 12 inductor/time,13 Hz to s,31 VRM
- **storyHook:** 칩에 전력을 안정적으로 줄 때 전류의 파도인 리플은 얼마나 오르내릴까요?
- **question:** 칩에 전력을 안정적으로 줄 때 전류의 파도인 리플은 얼마나 오르내릴까요?
- **predictionPrompt (learner-only):** 입력48V, 출력12V, L10µH, f100kHz이면 이상적 리플 전류는 얼마나 될까요? 주파수를 두 배로 하면요?
- **displayTextBeforePrediction:** 빠르게 바꾸면 리플과 전체 손실이 똑같이 줄어들까요?
- **speechTextBeforePrediction:** L 값과 스위칭 주파수를 각각 선택하고 먼저 전류 파도 높이를 예상해 보세요.
- **learnerAction:** `inductanceMicroH=10|20`과 `frequencyKHz=100|200`을 따로 바꿔보고 `D=Vout/Vin`과 `ripplePpA=(Vin−Vout)*D/(L*f)`를 계산한다. 고정 `loadCurrentA=30`이므로 각각 리플의 반이 30A보다 작아 CCM 단순화가 성립한다. `EMICompliance`와 efficiency는 NOT_PROVEN이고 회로 구성/PCB 제작 조작은 제공하지 않는다.
- **modelInputs:** typed `inductanceMicroH:10|20`,`frequencyKHz:100|200`, constants `VinV=48`,`VoutV=12`,`loadCurrentA=30`,`dutyToy=0.25`. `ripplePpA=(48-12)*.25/((LmicroH*1e-6)*(fKHz*1000))`: L10/f100⇒9A, L10/f200⇒4.5A, L20/f100⇒4.5A, L20/f200⇒2.25A. `actualTransientRipple=NOT_PROVEN`, `emiCompliance=NOT_PROVEN`, `converterTotalLoss=NOT_PROVEN`. Fictional ideal buck CCM only, no real gate drive or EMI spectrum.
### ② 학생 조작 + WHY 이후에만 교사용 정답/맞춤 교정 공개
- **expectedObservation (teacher-only):** Under the fixed ideal buck equation, doubling L or frequency halves ΔIpp. This does NOT imply f↑ always lowers whole-circuit losses or EMI; in high-frequency WBG designs switching edges/driver and magnetic core/PCB matter.
- **teacherExpectedAnswer (gated):** Under the fixed ideal buck equation, doubling L or frequency halves ΔIpp. This does NOT imply f↑ always lowers whole-circuit losses or EMI; in high-frequency WBG designs switching edges/driver and magnetic core/PCB matter.
- **correctIncorrectCriteria:** Use both independent L and f changes to show 9→4.5→2.25A p-p and explain higher f vs switching-loss/EMI tradeoff; correct-first learners can pass.
- **misconceptions:** [m1] 주파수를 두 배로 하면 리플도 무조건 두 배가 되므로 출력은 더 불안정해져요. / [m2] 리플을 절반으로 낮췄으면 스위칭 손실·전자파 문제도 반드시 절반으로 해결돼요. / [m3] 벅 컨버터 듀티는 이 수업에서 입력48/출력12인4로 계산해야 해요.
- **hints L1/L2/L3 (on request):** [L1] 이상적 buck의 D는 Vout/Vin이에요. / [L2] 리플 식에서 L·f는 분모에 있어요. / [L3] 전류 리플·자성체 손실·EMI·변환 효율은 다른 물리량이에요.
- **misconceptionFeedback/m1 (gated):** 이 수업 식에서는 주파수가 분모라서 두 배면 전류 리플 p-p는 절반이에요.
- **misconceptionFeedback/m2 (gated):** 리플이 줄어도 빠른 스위칭의 충방전 손실·EMI와 인덕터 손실은 달라질 수 있어요.
- **misconceptionFeedback/m3 (gated):** 12/48=0.25가 이상적 듀티예요. 4는 듀티 비율로 성립할 수 없어요.
- **feedback/correct:** 두 개의 독립 상태와 WHY를 확인했습니다. 수업용 숫자를 실제품/시설 성능·안전 보증으로 바꾸지 않았어요.
- **displayTextAfterObservation (gated):** 인덕턴스나 주파수를 올리면 이 모형의 리플은 줄지만 EMI까지 사라지는 것은 아니에요.
- **speechTextAfterObservation (gated):** 입력 사십팔 볼트에서 출력 십이 볼트인 수업용 벅 회로는 듀티 사분의 일이에요. 인덕터 십 마이크로헨리에 백 킬로헤르츠면 리플은 구 암페어 피크투피크죠.
### ③ 시니어 설계 리뷰
- **physicsAssumptions:** 이상적인 교실 수식 및 명시된 고정 변수만 유효. 데이터시트/온도/부하/전원/고장/규제와 디바이스 실제 EMI 값은 구하지 않았어요.
- **seniorDesignReview:** Real CCM/DCM boundary, parasitic L/C and dead time, switching/EMI/saturation/core losses, real device datasheet and loop stability not included.
- **sourceRefs:** [R1][R2][R3]
- **negativePathTest:** Student independently changes two declared typed state dimensions and supplies WHY; no pre-answer leaks of correct numeric values in Voice/DOM/ARIA, no forced wrong, m1/m2/m3 wrong branches each require a distinct cause-matched explanation. For parameter changes after a test, create a new trial rather than retroactive mastery. Reject conversions that claim whole-facility efficiency, real product safe operating area, or real high-voltage setup methods. Actual Chromium/Voice/browser test A05 owns after independent A07 source QA.
- **nextHook:** 다음 실험에서 전원 변환의 다른 비용을 찾아봐요.

## 22-S04 · `wbg-thermal-reliability-envelope` · 방열판을 바꾸면 스위치가 영원히 안전할까요?
### ① 호기심과 독립 조작
- **sceneId:** wbg-thermal-reliability-envelope
- **learningGoal:** 온도 주위30°C에서 가상 열손실20/40W와 Rθ1/2K/W를 독립 조작해 접합온도와 임의 알림 한계100°C를 계산하되 부품 정격·수명 인증과 구분한다.
- **priorKnowledge:** 13 W K/W and Celsius difference,22-S01 converter heat,06 package
- **storyHook:** 같은 SiC 스위치도 열이 잘 빠지는 패키지와 답답한 패키지가 있다면 온도가 얼마나 다를까요?
- **question:** 같은 SiC 스위치도 열이 잘 빠지는 패키지와 답답한 패키지가 있다면 온도가 얼마나 다를까요?
- **predictionPrompt (learner-only):** 실내30°C, 소자 열손실20W, 열저항1K/W라면 접합온도를 어떻게 계산하나요? 열손실40W·열저항2K/W라면요?
- **displayTextBeforePrediction:** 발열과 열저항을 따로 바꾸면 어떤 온도가 계산될까요?
- **speechTextBeforePrediction:** 같은 열손실로 방열 조건을 바꾸고, 같은 방열 조건에서 손실도 바꿔보세요.
- **learnerAction:** 독립된 `lossW=20|40`와 `thermalResistanceKperW=1|2`를 변경하고 `junctionC=ambient30+lossW*Rtheta`를 관찰한다. `toyAlertThresholdC=100`은 학생에게 '임의 수업 경보'로 보이며 실제품 Tmax라고 표시하지 않는다. SiC/GaN을 선택하더라도 이 모델의 열 저항·손실이 자동 변경되지 않는다.
- **modelInputs:** typed `lossW:20|40`,`thermalResistanceKperW:1|2`,`materialInfo:'SiC'|'GaN'` qualitative only, constants `ambientC=30`,`toyAlertThresholdC=100`. `junctionC=30+lossW*thermalResistanceKperW`, values20/1→50°C,20/2→70°C,40/1→70°C,40/2→110°C; alert if >100 only `INVESTIGATE_TOY`, else `BELOW_TOY_ALERT`; `actualMaxTjC=UNKNOWN`, `MTTF=NOT_PROVEN`, `realGateReliability=NOT_PROVEN`.
### ② 학생 조작 + WHY 이후에만 교사용 정답/맞춤 교정 공개
- **expectedObservation (teacher-only):** At constant ambient30°C 20W×1K/W gives50°C, 40W×2K/W gives110°C; crossing **fictional** alert100°C asks review, not a specific commercial device failure. Real WBG gate oxide stress, dynamic loss, package thermal path and lifetime require qualified data/tests.
- **teacherExpectedAnswer (gated):** At constant ambient30°C 20W×1K/W gives50°C, 40W×2K/W gives110°C; crossing **fictional** alert100°C asks review, not a specific commercial device failure. Real WBG gate oxide stress, dynamic loss, package thermal path and lifetime require qualified data/tests.
- **correctIncorrectCriteria:** Test two independently modified axes loss and Rtheta, accurately compute 50/70/110, reject false actual device lifetime, automatic cool operation under WBG material.
- **misconceptions:** [m1] Rθ가2K/W면 20W의 손실에도 온도는2°C만 증가해요. / [m2] SiC나 GaN이므로 게이트 산화막 열화나 과전압 스트레스는 영원히 발생하지 않아요. / [m3] 수업용 경보100°C를 넘으면 어느 회사 부품이든 즉시 파괴됐다고 단정할 수 있어요.
- **hints L1/L2/L3 (on request):** [L1] 온도 상승은 손실 전력×열저항이에요. / [L2] 고속·고전압 소자에도 정격·온도·내구한계가 있어요. / [L3] 임의 경보치와 제품 데이터시트의 절대 최대 정격은 다르죠.
- **misconceptionFeedback/m1 (gated):** 20W×2K/W=40K 온도 상승이라 주위30°C에서70°C예요.
- **misconceptionFeedback/m2 (gated):** 고전압 소자는 게이트 드라이버·패키지·산화막과 열 신뢰성 검증이 필요해요.
- **misconceptionFeedback/m3 (gated):** 100°C는 교육용 조사 경계일 뿐이에요. 실제 부품 failure 또는 안전성은 데이터시트/시험으로 판단해요.
- **feedback/correct:** 두 개의 독립 상태와 WHY를 확인했습니다. 수업용 숫자를 실제품/시설 성능·안전 보증으로 바꾸지 않았어요.
- **displayTextAfterObservation (gated):** 열은 누적되어 접합온도를 올리지만 이 숫자는 부품 수명 인증이 아니에요.
- **speechTextAfterObservation (gated):** 섭씨 삼십 도의 주위 환경에서 이십 와트 손실과 일 켈빈퍼와트 열저항이라면 접합온도는 오십 도예요. 부품의 실제 한계와 수명은 따로 확인해야 해요.
### ③ 시니어 설계 리뷰
- **physicsAssumptions:** 이상적인 교실 수식 및 명시된 고정 변수만 유효. 데이터시트/온도/부하/전원/고장/규제와 디바이스 실제 EMI 값은 구하지 않았어요.
- **seniorDesignReview:** Rθ single-node only, junction-to-case/case-to-heatsink, transient Zth, TDDB and VGS overshoot, accelerated-life data and derating not inferable from temperature alone.
- **sourceRefs:** [R3][R4][R5]
- **negativePathTest:** Student independently changes two declared typed state dimensions and supplies WHY; no pre-answer leaks of correct numeric values in Voice/DOM/ARIA, no forced wrong, m1/m2/m3 wrong branches each require a distinct cause-matched explanation. For parameter changes after a test, create a new trial rather than retroactive mastery. Reject conversions that claim whole-facility efficiency, real product safe operating area, or real high-voltage setup methods. Actual Chromium/Voice/browser test A05 owns after independent A07 source QA.
- **nextHook:** 다음 실험에서 전원 변환의 다른 비용을 찾아봐요.

## 22-S05 · `ai-800vdc-rack-power-path` · 800V로 전압을 올리면 데이터센터 전기료도 75% 줄어들까요?
### ① 호기심과 독립 조작
- **sceneId:** ai-800vdc-rack-power-path
- **learningGoal:** 동일 가상 80kW 공급단 경로에서 배전전압400/800V와 루프저항0.05/0.10Ω를 각각 조작해 전류·전압강하·국소 I²R을 계산하고 수신부하와 전체 시설 에너지를 구별한다.
- **priorKnowledge:** 12 Ohm,22-S01 efficiency,31 PUE/PSU,10 AI rack
- **storyHook:** AI 랙에 큰 전력을 보내야 해요. 배전전압을 두 배로 올리면 케이블 전류와 뜨거워지는 양은 어떻게 달라질까요?
- **question:** AI 랙에 큰 전력을 보내야 해요. 배전전압을 두 배로 올리면 케이블 전류와 뜨거워지는 양은 어떻게 달라질까요?
- **predictionPrompt (learner-only):** 동일 공급단 전력80kW와 동일 전선 저항0.05Ω일 때400V 대800V 전류는 몇 암페어이며 배선 손실은 각각 몇 와트일까요?
- **displayTextBeforePrediction:** 같은 공급 전력과 같은 전선 저항일 때 어떤 값만 네 배로 달라질까요?
- **speechTextBeforePrediction:** 배전전압과 전선 저항을 서로 따로 바꿔보며 국소 발열과 전체 데이터센터 소비량을 구분해 봐요.
- **learnerAction:** `busVoltageV=400|800`와 `loopResistanceOhm=0.05|0.10`을 실제 독립 조작하며 `sourcePowerW=80000` 고정이라는 라벨을 유지한다. 계산 I=Psource/V, wireLoss=I²R, drop=IR, receiverPower=Psource−wireLoss를 비교. 전압 상승이 곧바로 80kW *수신* 부하 일정이라는 잘못된 상태를 불합격으로 표시한다. 교육용 신호선 그림만 제공하며 실제 800V 장치 설치/운전 방법은 제공하지 않는다.
- **modelInputs:** typed `busVoltageV:400|800`,`loopResistanceOhm:0.05|0.10`, fixed `nominalSourcePowerW=80000`. `currentA=80000/busVoltageV` =>400V200A,800V100A; `voltageDropV=currentA*loopR`, `lineLossW=currentA^2*loopR`, `receivedW=80000-lineLossW` for toy DC source. At R.05: 400V drop10V/2000W line loss/received78000W, 800V drop5V/500W line loss/received79500W; R.10:400V20V/4000W/76000W,800V10V/1000W/79000W. Single route `Pwire` 2000→500=75% less when V doubles at fixed source P and R; `facilityEnergySavings=NOT_PROVEN`, `voltageSafetyCertified=NOT_PROVEN`, `finalGPUWork=NOT_PROVEN`, `protectionRequired=TRUE` all states.
### ② 학생 조작 + WHY 이후에만 교사용 정답/맞춤 교정 공개
- **expectedObservation (teacher-only):** At fixed source-side rated power and R, V×2 halves I and quarters *the single wire heat term*. Receiver load isn't held constant (78 vs79.5kW at R.05) and converter/switchgear/insulation/arc-flash/cooling/real site energy not included. NVIDIA 2025/2026 800VDC designs are evolving adoption/reference architectures, not evidence all existing facilities retrofitted or safe without certified engineers.
- **teacherExpectedAnswer (gated):** At fixed source-side rated power and R, V×2 halves I and quarters *the single wire heat term*. Receiver load isn't held constant (78 vs79.5kW at R.05) and converter/switchgear/insulation/arc-flash/cooling/real site energy not included. NVIDIA 2025/2026 800VDC designs are evolving adoption/reference architectures, not evidence all existing facilities retrofitted or safe without certified engineers.
- **correctIncorrectCriteria:** Manipulate bus voltage and loop resistance separately, compute 200/100A and line-loss2kW/.5kW (R=.05), explain source-power vs receiving-load distinction and unverified site savings, name electrical safety requirements without actionable wiring instructions.
- **misconceptions:** [m1] 400V에서800V로 올리면 똑같은 조건의 전선 열손실이 언제나75% 감소하니 시설 전체 전기요금도 75% 줄어요. / [m2] 80kW를 공급단에서 고정했다면 양쪽 수신 장치도 배선손실과 무관하게 정확히80kW를 받는 거예요. / [m3] 800VDC 버스는 고전압이지만 절연·차단·접지·전기안전 검증을 특별히 고려할 필요가 없어요.
- **hints L1/L2/L3 (on request):** [L1] 열손실은 전류 제곱×같은 전선 저항이며 시설 전체 구성은 더 커요. / [L2] 수신 전력은 배선에서 사라진 열을 빼야 하죠. / [L3] 높은 전압은 별도의 절연·보호와 전문가 검증을 요구해요.
- **misconceptionFeedback/m1 (gated):** 75%는 이 toy 전선 한 경로의 I²R 항에만 해당해요. UPS·컨버터·랙·냉각과 사이트 비용은 계산하지 않았어요.
- **misconceptionFeedback/m2 (gated):** 400V/R.05에서 공급80kW−배선손실2kW=수신78kW예요. 수신80kW를 고정하려면 식과 전류가 바뀌어요.
- **misconceptionFeedback/m3 (gated):** 실제 고전압 DC 설비는 인증 장비와 절연·고장 차단·전기안전 규정을 갖춰 숙련자가 설계해야 해요.
- **feedback/correct:** 두 개의 독립 상태와 WHY를 확인했습니다. 수업용 숫자를 실제품/시설 성능·안전 보증으로 바꾸지 않았어요.
- **displayTextAfterObservation (gated):** 800V는 높은 전압의 배전 전류를 줄일 수 있지만 데이터센터 총전력이 같은 비율로 줄지는 않아요.
- **speechTextAfterObservation (gated):** 가상의 전선에서 공급 전압을 사백에서 팔백 볼트로 올리면 전류는 절반이 되고 전선 발열은 사분의 일이 될 수 있어요. 하지만 전원변환과 냉각까지 포함한 실제 시설 절감은 따로 검증해야 해요.
### ③ 시니어 설계 리뷰
- **physicsAssumptions:** 이상적인 교실 수식 및 명시된 고정 변수만 유효. 데이터시트/온도/부하/전원/고장/규제와 디바이스 실제 EMI 값은 구하지 않았어요.
- **seniorDesignReview:** Nominal-source vs delivered constant-P load different circuit equations, 800VDC bus transient/fault and touch/arc hazard, insulation/clearance/grounding/energy store/UPS and PUE, manufacturer roadmap not universal deployment.
- **sourceRefs:** [R6][R7][R8]
- **negativePathTest:** Student independently changes two declared typed state dimensions and supplies WHY; no pre-answer leaks of correct numeric values in Voice/DOM/ARIA, no forced wrong, m1/m2/m3 wrong branches each require a distinct cause-matched explanation. For parameter changes after a test, create a new trial rather than retroactive mastery. Reject conversions that claim whole-facility efficiency, real product safe operating area, or real high-voltage setup methods. Actual Chromium/Voice/browser test A05 owns after independent A07 source QA.
- **nextHook:** 전력 공급 실패가 AI 서비스의 p99 및 복구 시간에 미치는 영향을 32번과 연결해 보세요.

## A07 physical/math acceptance vectors and A05 future typed original scene tests
| Step | Mathematically valid toy evidence (after answer only) | Physically invalid conclusions to reject |
|---|---|---|
| 22-S01 | Pout100W η.90→Pin111.111/heat11.111; η.95→Pin105.263/heat5.263, independent output200W cases | 5% compute speed gain, fixed GPU watts changed when η changed, rack PUE proof |
| 22-S02 | Ceff100pF one charge/discharge f100k V100→0.1W; V200→0.4W; f500k V100→0.5W, V200→2.0W | GaN/SiC inherently zero-loss, material name creates hidden capacitor/rating, measured semiconductor Eoss |
| 22-S03 | Vin48/Vout12/D.25 L10µH/f100k→ripple9A p-p, at200k→4.5A, L20µH/100k→4.5A, both→2.25A | switching f always improves EMI/efficiency, duty4 instead of .25 |
| 22-S04 | Ta30°C loss20W R1K/W→Tj50°C, 40W R2K/W→110°C over fictional100°C review alert | all devices fail at100°C, WBG gates have infinite lifespan, units wrong |
| 22-S05 | fixed NOMINAL SOURCE80kW, R.05Ω:400V I200A/drop10V/wire2kW/received78kW;800V I100A/drop5V/wire0.5kW/received79.5kW; only single wire I²R 75% lower | site energy75% lower, delivered power fixed80kW under same input assumptions, 800VDC inherently certified safe |
- [ ] P1 NEXT:A07 review exact source&senior SHAs, 5 objectives and 15 cause-coded negatives, no pre-Voice/DOM/ARIA answers, correct-first+two axes/WHY, source support and safety-limitation warnings. [ ] A06 after actual EDU_QA_PASS_SOURCE direct A05 five scene IDs #4. A05 actual 2.5D/mobile/Chrome/Voice/CI and A02 official product separate.
## Public official source register · checkedAt 2026-10-18
[R1] https://www.infineon.com/technology/wide-bandgap-semiconductors-sic-gan
[R2] https://www.infineon.com/product-information/what-is-a-gan-fet-and-how-does-it-work
[R3] https://www.wolfspeed.com/knowledge-center/article/gate-drives-and-gate-driving-with-sic-mosfets/
[R4] https://www.wolfspeed.com/knowledge-center/article/deciphering-data-sheets/
[R5] https://www.wolfspeed.com/knowledge-center/article/designed-to-last-even-in-the-harshest-environments/
[R6] https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories
[R7] https://blogs.nvidia.com/blog/800-vdc-power-architecture-ai-factory/
[R8] https://www.nvidia.com/en-us/data-center/technologies/800-vdc-architecture/
