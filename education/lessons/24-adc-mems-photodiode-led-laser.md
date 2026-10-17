# 24 · ADC·MEMS·광소자: 숫자가 된 센서 신호에서 AI 서버의 빛까지
> A06 인수 라운드 R33 · 2026-10-18 KST · **A06_AUTHOR_SOURCE_DONE only / A07 독립 SOURCE_QA 대기** · [레슨 카드 #66](https://github.com/Junebooky/interactive-engineering/issues/66). 학생용 다섯 장면 원본이며 실장비·실측·광학 안전 인증이 아니다.
>
> **학습 경로** 12(V/I/RC)→11(PN)→24(연속 신호→ADC→MEMS→광수신·광송신)→30(추후 CPO·광트랜시버). 총 약 30~40분 *교육 설계 추정*, 실제 학습자 시간 검증 없음. 필수 12·11·13(단위), 관련 01/16, 후속 08·30.
>
> **보편 UI 계약:** 처음엔 **문제 한 개**만. (1) 중립 질문/정답 없는 한국어 Before Voice → (2) 예상 선택 1개 → (3) 실험 도크에서 **두 실제 타입 독립 조작** → (4) 관찰 카드에 수치/단위 → (5) 이유 선택 1개/오개념 m1·m2·m3 중 해당 피드백 → (6) 교사용 정답·한국어 After Voice·다음 질문. 힌트는 요청 후 L1→L2→L3. **Problem 패널에 스위치/슬라이더 금지; 실험 도크에만 조작**. 정답 문구·숫자·교사 Voice/ARIA는 OBSERVE 전 DOM에서도 사전 누설 금지. 먼저 옳게 답한 학생에게 억지 오답 요구 금지. 실제 변경된 두 입력/관찰/WHY 증거 확인 후 최초 정답 인정. 하나의 에피소드가 이미 채점되면 설정 변경은 새 trial/RESET으로만 처리, 이전 데이터 수정 금지. 실험 경로가 없는 상태는 NOT_RUN이지 0% 성공 측정이 아니다. A03의 디자인 최신 계약과 A07 독립 검수를 거쳐 A05 구현할 것.
>
> **TOY 경계:** 본 다섯 개의 계산용 fixture는 독립적인 수업 예제로서 양산 ADC/SKU, 자동차 MEMS, 칩 설계·레이저 모듈의 실측이 아니다. 제조사 자료는 현상의 물리 개념을 뒷받침하지만 수업용 수치를 인증하지 않는다. 광원 실험은 화면 안 모형만 취급하며 실제 레이저 조립·직시·출력 조절 실험 금지.

## 수업 목표와 초보자 스토리
빛이나 가속도는 처음부터 컴퓨터의 0과 1이 아니에요. 실제 세계에서 받은 연속 신호를 **언제 읽는가(샘플링)**, **몇 칸으로 나누는가(양자화)**에 따라 화면의 숫자가 달라져요. MEMS는 작은 질량의 움직임을 전기 신호로 바꿔요. 반면 광다이오드는 들어온 빛을 전류로 바꾸고, LED·레이저는 전기를 빛으로 바꾸는 광원이죠. 마지막으로 빛이 손실을 겪고 수신기에 도착하는 과정을 계산해 다음 30번 광링크·CPO 학습으로 이어갑니다.
## SceneSpec 공통 typed 인터페이스
- `lessonId='24'`, 각 `sceneId`는 아래 정확 문자열 사용. `prediction`, `controlChange`, `observe`, `whyAnswer`, `requestHint`, `resetTrial`, `voiceRequest`의 이벤트 분리. `phase='PREDICT'|'EXPERIMENT'|'OBSERVE'|'REASON'|'DONE'`, `trialId`, `observedInputsSnapshot`, `observedResultSnapshot`, `gradingEvidence` 타입으로 과거 관찰 불변.
- 각 scene에서 `modelInputs` 두 독립 축, `modelOutputs` 계산 결과, `state`(NOT_RUN|OBSERVED|COMPLETE) 선언. 값·숫자 형식은 소수 반올림 표시와 내부 정밀 계산 분리. 변화 전 결과는 null/not-yet-observed; 음성 읽기 전 단위·상태가 텍스트로 접근 가능해야 함.
- 장면별 `feedback/m1..m3`는 오답 원인에만 매핑, 정답 피드백은 독립. `teacherExpectedAnswer`, `expectedObservation`, `speechTextAfterObservation`은 OBSERVE 이후 조건에서만 렌더. 색/애니메이션만으로 합격·경고 전달 금지, 키보드/375·320px/reduced motion/침묵 fallback 필수.

## 24-S01 · `adc-sampling-alias-two-tones` · 시간을 건너뛰면 빠른 파형이 느린 파형처럼 보일까요?
### ① 학생에게 먼저 보여 줄 것
- **sceneId:** `adc-sampling-alias-two-tones`
- **learningGoal:** 순수 cosine 입력 주파수와 샘플링 속도를 각각 조작하여 alias 주파수를 설명하고 anti-alias 입력필터의 역할을 구분한다.
- **priorKnowledge:** 12 주파수·전압, 13 Hz와 samples/s
- **storyHook:** 초당 700번 출렁이는 신호를 초당 1,000번만 찍으면, 화면에 그대로 700번이 나타날까요?
- **question:** 시간을 건너뛰면 빠른 파형이 느린 파형처럼 보일까요?
- **predictionPrompt (student-only, no answer):** 700Hz 파형을 1,000samples/s로 샘플링하면 어느 주파수로 *보일지* 먼저 고르세요. 답을 본 다음 움직이는 실험이 아니에요.
- **displayTextBeforePrediction:** 예측하기 전에는 결과와 정답 설명을 가려 둡니다.
- **speechTextBeforePrediction:** 신호 주파수와 초당 샘플 개수는 별도 손잡이예요. 무엇이 원래 신호인지 기억해 두고 예측하세요.
- **learnerAction (two independent typed controls):** 실험 도크에서 `signalHz:300|700`과 `sampleRateHz:1000|2000`을 독립으로 변경하고 zero-phase unit cosine `cos(2π f t)`의 실제 파형 vs 마커와 스펙트럼을 관찰. 최소700@1000,700@2000,300@1000 탐색.
- **modelInputs/modelOutputs / unit QA:** `modelInputs:{signalHz:300|700,sampleRateHz:1000|2000}`. `modelOutputs:{nyquistHz:sampleRateHz/2,aliasHz:abs(signalHz-round(signalHz/sampleRateHz)*sampleRateHz),samplingSafeForSelectedTone:signalHz<sampleRateHz/2,filterState:'NOT_MODELED'}`. 700@1000→nyquist500,alias300Hz;700@2000→nyquist1000,alias700Hz;300@1000→300Hz. Ideal cosine/no prefilter, no jitter/phase, one tone. At1000 samples/s sampled 300Hz and700Hz zero-phase cos sequences coincide; this is NOT proof real analog wave is identical. Never label fs/2 equality safe generic reconstruction.
### ② 학생 조작 뒤에만 공개할 정답·오개념 원인
- **expectedObservation (teacher-only):** 1,000번/초로 700Hz를 읽으면 표본 위에서는 300Hz로 겹쳐 보여요. 2,000번/초면700Hz를 구별할 수 있어요. 이것은 **입력 필터를 생략한 가상 샘플러**이며 실제 anti-alias filtering can remove unwanted out-of-band content before ADC.
- **teacherExpectedAnswer (gated):** 1,000번/초로 700Hz를 읽으면 표본 위에서는 300Hz로 겹쳐 보여요. 2,000번/초면700Hz를 구별할 수 있어요. 이것은 **입력 필터를 생략한 가상 샘플러**이며 실제 anti-alias filtering can remove unwanted out-of-band content before ADC.
- **correctIncorrectCriteria:** 두 축 각 1번 이상 수정해 700/1000 alias300과 700/2000 alias700,300/1000 alias300을 관찰하고, 원 신호 vs 디지털로 보이는 신호·전처리 필터 관계를 WHY로 구분. 올바른 첫 시도 인정.
- **misconceptions/m1:** 1,000샘플이면 700Hz를 기록했으니 원래 700Hz가 정확히 표시된다.
- **misconceptionFeedback/m1 (gated):** 표본 사이에서 무슨 일이 있었는지는 샘플 숫자만으로 알 수 없어요. 이 모형에선 700Hz가 300Hz 표본열과 겹쳐요.
- **misconceptions/m2:** 샘플 주파수가 빨라지면 반드시 잡음과 왜곡이 모두 사라진다.
- **misconceptionFeedback/m2 (gated):** 샘플 속도는 aliasing 조건 한 부분뿐이에요. ADC 노이즈·지터·입력 필터 등은 별도예요.
- **misconceptions/m3:** 700Hz가 300Hz로 나타난다면 실제 원래 소리가 300Hz로 변했다.
- **misconceptionFeedback/m3 (gated):** 변한 건 연속 파형 자체가 아니라 샘플로 표현한 주파수예요. 손실된 원 정보는 복원할 수 없어요.
- **hint L1 (on demand):** 한 초에 1,000번 찍으면 구분 가능한 최고 기본대역은 얼마일까요?
- **hint L2 (on demand):** fs/2=500Hz, 700Hz는 그보다 높아요.
- **hint L3 (on demand):** 700−1,000의 절댓값은 300이에요. 아날로그 입력 필터가 필요한 이유도 생각해요.
- **feedback/correct (gated):** 두 개의 독립 조작과 수치/단위, 왜 그렇게 되는지 설명까지 확인했어요. 실제 장비·안전·제품 성능 검증과는 달라요.
- **displayTextAfterObservation (gated):** 1,000번/초로 700Hz를 읽으면 표본 위에서는 300Hz로 겹쳐 보여요. 2,000번/초면700Hz를 구별할 수 있어요. 이것은 **입력 필터를 생략한 가상 샘플러**이며 실제 anti-alias filtering can remove unwanted out-of-band content before ADC.
- **speechTextAfterObservation (gated):** 700헤르츠의 코사인 파형을 초당 천 번 샘플링하면, 300헤르츠와 같은 표본열이 될 수 있어요. 샘플링 전에 필요 없는 고주파를 필터링해야 오인식을 줄일 수 있어요.
### ③ 시니어 반례·검수 계약
- **physicsAssumptions:** 위 두 축으로 제한한 수업용 정규화 모형; 실제 광전/전기 소자·레이저 운용/공정 수치를 인증하지 않음.
- **seniorDesignReview:** Real bandpass undersampling is possible with intentional frequency planning; textbook baseband Nyquist is not a universal blanket ban. ADC finite aperture/time jitter and non-ideal anti-alias filter need separate analysis.
- **negativePathTest:** m1/m2/m3 각각 다른 원인에만 채점되는지, 정답 최초 선택 허용되는지, 입력 변경 시 기존 스냅샷을 다시 쓰지 않는지, PRE DOM·Voice·ARIA 정답 누설/No-observation false PASS 없는지 확인. A05 실제 브라우저 QA 전 A07 exact source 재검토.
- **sourceRefs:** [R1][R2]
- **nextHook:** 다음엔 표본을 몇 칸으로 표현할 수 있을까요?

## 24-S02 · `adc-quantization-bit-vref` · 12비트 숫자라면 측정도 언제나 정확할까요?
### ① 학생에게 먼저 보여 줄 것
- **sceneId:** `adc-quantization-bit-vref`
- **learningGoal:** ADC 비트 수와 기준 전압 두 개를 독립적으로 바꾸어 ideal LSB 간격을 계산하고 ENOB·오차·절대정확도 차이를 말한다.
- **priorKnowledge:** 12 전압,13 mV 및 powers of two
- **storyHook:** 같은 전압 자를 256칸으로 자를까요, 4,096칸으로 자를까요? 작은 눈금이 측정의 완벽함을 보장할까요?
- **question:** 12비트 숫자라면 측정도 언제나 정확할까요?
- **predictionPrompt (student-only, no answer):** 기준 전압 3.3V, 8비트와12비트에서 한 칸의 이상적 간격은 어떻게 바뀔까요? 비트 수만 늘리면 오차가 0이 되는지도 예상해요.
- **displayTextBeforePrediction:** 예측하기 전에는 결과와 정답 설명을 가려 둡니다.
- **speechTextBeforePrediction:** 이번에는 눈금의 칸 수와 눈금자의 끝 전압을 따로 조절해요. 먼저 어떤 변화가 더 가는 눈금을 만드는지 예상하세요.
- **learnerAction (two independent typed controls):** `resolutionBits:8|12`와 `vrefV:2.5|3.3`을 독립 조작. bin width/코드 범위 시각화, quantized stairs observe. ADC 구조, 샘플 주파수 및 주어진 noise/SINAD는 바뀌지 않은 상태 NOT_MODELED.
- **modelInputs/modelOutputs / unit QA:** `modelInputs:{resolutionBits:8|12,vrefV:2.5|3.3}`. `modelOutputs:{idealLevels:2**resolutionBits,lsbV:vrefV/idealLevels,lsbMilliV:1000*vrefV/idealLevels,fullScaleCode:idealLevels-1,measuredENOB:'NOT_MEASURED',totalAccuracy:'NOT_MEASURED'}`. 3.3V 8b→256 levels,12.890625mV/LSB; 12b→4096 levels,.8056640625mV/LSB; 2.5V 8b→9.765625mV;12b→.6103515625mV. Ideal uniform unipolar code-bin model, end-code endpoints not falsely called Vref exactly.
### ② 학생 조작 뒤에만 공개할 정답·오개념 원인
- **expectedObservation (teacher-only):** 3.3V를 256칸으로 나누면 약12.89mV, 4,096칸이면0.806mV예요. 그러나 비트 표시만으로 실제 잡음·오프셋·선형성·ENOB는 확인되지 않아요.
- **teacherExpectedAnswer (gated):** 3.3V를 256칸으로 나누면 약12.89mV, 4,096칸이면0.806mV예요. 그러나 비트 표시만으로 실제 잡음·오프셋·선형성·ENOB는 확인되지 않아요.
- **correctIncorrectCriteria:** 비트수 8/12와 Vref2.5/3.3 각각 한 번 이상 변경, 3.3V의 두 LSB 비교, ENOB/실측 정확도 NOT_MEASURED 구분을 인과 WHY로 선택.
- **misconceptions/m1:** 12비트 센서면 실제로 12비트의 정확한 값이 늘 나온다.
- **misconceptionFeedback/m1 (gated):** 12비트는 표현 칸 수예요. 노이즈와 비선형성에 따른 유효분해능(ENOB)·절대 정확도는 별도 확인해야 해요.
- **misconceptions/m2:** 같은 비트 수에서 3.3V로 늘리면 LSB도 반드시 작아진다.
- **misconceptionFeedback/m2 (gated):** Vref를 키우면 같은 칸 수의 한 칸은 더 커져요. 8비트 2.5V 9.77mV에서 3.3V 12.89mV예요.
- **misconceptions/m3:** 4096개의 코드가 있으면 끝 코드가 정확히3.3V이다.
- **misconceptionFeedback/m3 (gated):** 이 토이 코드 폭은3.3/4096이에요. 맨 위 코드는 기준범위 끝과 같은 전압이라고 간주하면 안 돼요.
- **hint L1 (on demand):** 비트수가 8이면 몇 개의 숫자를 표현할까요?
- **hint L2 (on demand):** 한 칸 길이는 기준 전압 ÷ 2의 비트수 제곱이에요.
- **hint L3 (on demand):** 실제 성능은 별도 측정 SINAD·노이즈·INL 등을 봐야 해요.
- **feedback/correct (gated):** 두 개의 독립 조작과 수치/단위, 왜 그렇게 되는지 설명까지 확인했어요. 실제 장비·안전·제품 성능 검증과는 달라요.
- **displayTextAfterObservation (gated):** 3.3V를 256칸으로 나누면 약12.89mV, 4,096칸이면0.806mV예요. 그러나 비트 표시만으로 실제 잡음·오프셋·선형성·ENOB는 확인되지 않아요.
- **speechTextAfterObservation (gated):** 3점3볼트를 8비트로 나누면 한 칸은 약12점89밀리볼트, 12비트면0점806밀리볼트예요. 숫자가 촘촘해져도 실제 정확도는 노이즈와 회로 오차를 따로 검사해야 해요.
### ③ 시니어 반례·검수 계약
- **physicsAssumptions:** 위 두 축으로 제한한 수업용 정규화 모형; 실제 광전/전기 소자·레이저 운용/공정 수치를 인증하지 않음.
- **seniorDesignReview:** Different ADC architectures have distinct input/reference errors, INL/DNL, bandwidth, ENOB/SINAD; the ideal quantizer assumes no missing codes and no saturation in the input region. Conversion rate, accuracy and energy trade off.
- **negativePathTest:** m1/m2/m3 각각 다른 원인에만 채점되는지, 정답 최초 선택 허용되는지, 입력 변경 시 기존 스냅샷을 다시 쓰지 않는지, PRE DOM·Voice·ARIA 정답 누설/No-observation false PASS 없는지 확인. A05 실제 브라우저 QA 전 A07 exact source 재검토.
- **sourceRefs:** [R3][R4]
- **nextHook:** 그런 연속 센서 신호는 어디서 생겨날까요?

## 24-S03 · `mems-differential-capacitance-motion` · 손으로 움직이면 왜 칩 속 전기 눈금이 바뀔까요?
### ① 학생에게 먼저 보여 줄 것
- **sceneId:** `mems-differential-capacitance-motion`
- **learningGoal:** 정전용량형 MEMS 가속도의 proof mass 변위→차동 용량→읽기회로 연결을 이해하고 가속도와 기계/정전용량 감도 두 축을 구별한다.
- **priorKnowledge:** 12 capacitor;11 재료;13 pF·g
- **storyHook:** 작은 칩 안쪽에 정말 작게 매달린 질량이 움직이면, 회로는 그걸 어떻게 알아챌까요?
- **question:** 손으로 움직이면 왜 칩 속 전기 눈금이 바뀔까요?
- **predictionPrompt (student-only, no answer):** 동일한 감도에서 가속도가 두 배일 때 왼쪽과 오른쪽 정전용량의 차도 두 배일지 예상해 보세요.
- **displayTextBeforePrediction:** 예측하기 전에는 결과와 정답 설명을 가려 둡니다.
- **speechTextBeforePrediction:** 움직임의 크기와 센서 구조 감도를 따로 바꿔봐요. 이 숫자는 실제 자동차 센서의 측정값은 아니에요.
- **learnerAction (two independent typed controls):** `accelerationG:0|1|2`와 `sensitivityPfPerG:0.02|0.04` 각각 조작. 질량이 가운데서 움직이고 양쪽 반대 방향으로 변하는 차동 판독의 *정성적* 그림. 출력은 pF, 가속도는 g, 관측 전 readout veil.
- **modelInputs/modelOutputs / unit QA:** `modelInputs:{accelerationG:0|1|2,sensitivityPfPerG:0.02|0.04}`. `modelOutputs:{leftPf:2+sensitivityPfPerG*accelerationG,rightPf:2-sensitivityPfPerG*accelerationG,differentialPf:2*sensitivityPfPerG*accelerationG,realCalibration:'NOT_MEASURED'}`. 1g,k.02→2.02/1.98pF Δ.04pF;2g,k.02→2.04/1.96,Δ.08pF;1g,k.04→2.04/1.96 Δ.08pF;2g,k.04→2.08/1.92 Δ.16pF. Fictional **linear** normalized sensor, acceleration-g reading includes local gravity orientation effects in real sensors; displacement and capacitance full nonlinear C=εA/d not modeled.
### ② 학생 조작 뒤에만 공개할 정답·오개념 원인
- **expectedObservation (teacher-only):** 같은 구조라면 더 큰 움직임이 양쪽 용량 차이를 크게 만들어요. 그러나 동일한 ΔC가 더 큰 가속도인지 더 민감한 센서인지는 교정 정보 없이 구분할 수 없어요.
- **teacherExpectedAnswer (gated):** 같은 구조라면 더 큰 움직임이 양쪽 용량 차이를 크게 만들어요. 그러나 동일한 ΔC가 더 큰 가속도인지 더 민감한 센서인지는 교정 정보 없이 구분할 수 없어요.
- **correctIncorrectCriteria:** 가속도 축과 감도 축 각각 실제 조작, 1g/.02→.04pF와2g/.02→.08pF 및1g/.04→.08pF 관찰 후 교정 필요성을 WHY에서 선택.
- **misconceptions/m1:** 중앙 질량이 움직이면 칩 내부에서 전하가 새로 생성돼서 가속도를 직접 표시한다.
- **misconceptionFeedback/m1 (gated):** MEMS는 기계적 변위를 전기적으로 *읽는* 센서예요. 새 전하가 가속도만큼 태어나는 모형이 아니에요.
- **misconceptions/m2:** Δ0.08pF를 보면 항상2g라고 단정할 수 있다.
- **misconceptionFeedback/m2 (gated):** 감도0.02pF/g에서2g와 감도0.04pF/g에서1g는 이 수업식에서 같아요. 센서 교정값이 필요해요.
- **misconceptions/m3:** MEMS 센서는 모두 정전용량형이며 중력을 측정하지 않는다.
- **misconceptionFeedback/m3 (gated):** MEMS에는 다른 변환 원리도 있어요. 실제 가속도 센서의 방향·정적 중력·보정 문제가 이 그림만으로 해결되진 않아요.
- **hint L1 (on demand):** 질량의 위치를 읽는 양쪽 전극 간 간격을 보세요.
- **hint L2 (on demand):** 왼쪽2+k·a, 오른쪽2−k·a예요.
- **hint L3 (on demand):** 차는2k·a이므로 k가 다르면 a를 역추산할 수 없어요.
- **feedback/correct (gated):** 두 개의 독립 조작과 수치/단위, 왜 그렇게 되는지 설명까지 확인했어요. 실제 장비·안전·제품 성능 검증과는 달라요.
- **displayTextAfterObservation (gated):** 같은 구조라면 더 큰 움직임이 양쪽 용량 차이를 크게 만들어요. 그러나 동일한 ΔC가 더 큰 가속도인지 더 민감한 센서인지는 교정 정보 없이 구분할 수 없어요.
- **speechTextAfterObservation (gated):** 작은 질량이 움직일 때 양쪽 전극의 정전용량이 반대로 변하고, 그 차이를 회로가 읽어요. 값0점08피코패럿만으로는 가속도와 센서 감도를 따로 알 수 없어요.
### ③ 시니어 반례·검수 계약
- **physicsAssumptions:** 위 두 축으로 제한한 수업용 정규화 모형; 실제 광전/전기 소자·레이저 운용/공정 수치를 인증하지 않음.
- **seniorDesignReview:** ST's capacitive MEMS model ties proof-mass displacement to differential capacitance; this schematic removes mechanical spring response, thermal drift, bias, cross-axis sensitivity, self-test, resonance and gravity/orientation. g means gravitational acceleration unit, not gram mass.
- **negativePathTest:** m1/m2/m3 각각 다른 원인에만 채점되는지, 정답 최초 선택 허용되는지, 입력 변경 시 기존 스냅샷을 다시 쓰지 않는지, PRE DOM·Voice·ARIA 정답 누설/No-observation false PASS 없는지 확인. A05 실제 브라우저 QA 전 A07 exact source 재검토.
- **sourceRefs:** [R5]
- **nextHook:** 작은 광센서는 빛을 어떤 전류로 바꿀까요?

## 24-S04 · `photodiode-responsivity-current` · 눈으로는 빛을 보는데 칩은 빛을 어떻게 읽을까요?
### ① 학생에게 먼저 보여 줄 것
- **sceneId:** `photodiode-responsivity-current`
- **learningGoal:** 광다이오드 입사 광파워와 파장별 responsivity를 독립 조절해 이상적 광전류를 산출하고 실제 어두운 전류·증폭회로·노이즈를 분리한다.
- **priorKnowledge:** 11 PN,12 전류,13 W·mW·A/W
- **storyHook:** 빛이 2배 밝아지면 광센서에서 나오는 전류도 2배일까요? 센서의 색에 따른 감도는 어떨까요?
- **question:** 눈으로는 빛을 보는데 칩은 빛을 어떻게 읽을까요?
- **predictionPrompt (student-only, no answer):** 광파워가 1mW이고 광다이오드 감도가0.6A/W라면 수업용 광전류는 어느 정도일지 예측해요.
- **displayTextBeforePrediction:** 예측하기 전에는 결과와 정답 설명을 가려 둡니다.
- **speechTextBeforePrediction:** 들어오는 빛의 양과 센서가 얼마나 민감하게 받는지를 별도로 바꿀 거예요. 숫자는 정해진 파장 한 점의 가상 값이에요.
- **learnerAction (two independent typed controls):** `incidentOpticalMw:0.5|1`와 `responsivityAperW:0.3|0.6`을 독립 변경. 광→캐리어 분리→광전류→transimpedance/readout chain 개념 그림. 내부 디바이스 실험이 아니라 수식 시각화.
- **modelInputs/modelOutputs / unit QA:** `modelInputs:{incidentOpticalMw:0.5|1,responsivityAperW:0.3|0.6}`. `modelOutputs:{incidentW:incidentOpticalMw/1000,idealPhotoCurrentA:incidentW*responsivityAperW,idealPhotoCurrentMa:incidentOpticalMw*responsivityAperW,darkCurrent:'NOT_MODELED',receiverBER:'NOT_MEASURED'}`. 0.5mW×0.3A/W=.15mA, 1mW×.3=.3mA,1mW×.6=.6mA; wavelength fixed/unspecified, nonlinear saturation/timing/dark current not modeled. No claim that reverse bias always necessary or that photodiode alone produces ready-to-read digital bits.
### ② 학생 조작 뒤에만 공개할 정답·오개념 원인
- **expectedObservation (teacher-only):** 1mW 광파워를0.6A/W 센서가 받는 이상적 예제에서는0.6mA예요. 실제 링크를 읽으려면 증폭·잡음·비교/ADC 또는 수신회로가 더 필요해요.
- **teacherExpectedAnswer (gated):** 1mW 광파워를0.6A/W 센서가 받는 이상적 예제에서는0.6mA예요. 실제 링크를 읽으려면 증폭·잡음·비교/ADC 또는 수신회로가 더 필요해요.
- **correctIncorrectCriteria:** 빛과 responsivity 축 각각 변경, 0.5*.3=.15,1*.6=.6mA 확인하고 detector photocurrent != laser/LED emitter, noiseless receiver guarantee 아님을 설명.
- **misconceptions/m1:** 0.6A/W 센서에1mW를 비추면0.6A가 흐른다.
- **misconceptionFeedback/m1 (gated):** 1밀리와트는 0.001와트예요. A/W×W=.0006A=0.6mA예요.
- **misconceptions/m2:** 광다이오드가 빛을 보내는 레이저와 같은 기능이다.
- **misconceptionFeedback/m2 (gated):** 광다이오드는 빛을 **받아 전기 신호**로 바꿔요. LED·레이저는 전기 구동을 받아 빛을 방출해요.
- **misconceptions/m3:** 전류0.6mA가 나오면 통신 비트 에러율도 자동 0이다.
- **misconceptionFeedback/m3 (gated):** 광전류 하나만으로 노이즈·속도·수신 필터/증폭기·판정 문턱·오류율은 알 수 없어요.
- **hint L1 (on demand):** responsivity 단위는 암페어 매 와트예요.
- **hint L2 (on demand):** 1mW는 와트로 얼마일까요?
- **hint L3 (on demand):** 0.6×0.001 A를 밀리암페어로 바꿔보세요.
- **feedback/correct (gated):** 두 개의 독립 조작과 수치/단위, 왜 그렇게 되는지 설명까지 확인했어요. 실제 장비·안전·제품 성능 검증과는 달라요.
- **displayTextAfterObservation (gated):** 1mW 광파워를0.6A/W 센서가 받는 이상적 예제에서는0.6mA예요. 실제 링크를 읽으려면 증폭·잡음·비교/ADC 또는 수신회로가 더 필요해요.
- **speechTextAfterObservation (gated):** 광센서 감도가 와트당0점6암페어면, 1밀리와트의 빛에서 이상적인 광전류0점6밀리암페어를 계산해요. 실제 전송 성공 여부는 별도의 수신 회로와 잡음 검토가 필요해요.
### ③ 시니어 반례·검수 계약
- **physicsAssumptions:** 위 두 축으로 제한한 수업용 정규화 모형; 실제 광전/전기 소자·레이저 운용/공정 수치를 인증하지 않음.
- **seniorDesignReview:** Hamamatsu responsivity depends on wavelength and detector type (PIN/APD/SiPM distinct); bandwidth, shot noise, dark current, saturation, coupling, and transimpedance amplifier are absent in toy. No BER guarantee.
- **negativePathTest:** m1/m2/m3 각각 다른 원인에만 채점되는지, 정답 최초 선택 허용되는지, 입력 변경 시 기존 스냅샷을 다시 쓰지 않는지, PRE DOM·Voice·ARIA 정답 누설/No-observation false PASS 없는지 확인. A05 실제 브라우저 QA 전 A07 exact source 재검토.
- **sourceRefs:** [R6][R7]
- **nextHook:** 이제 반대로 빛을 보내는 장치를 볼까요?

## 24-S05 · `led-laser-optical-link-budget` · 레이저가 켜졌다면 저쪽 서버도 빛을 충분히 받을까요?
### ① 학생에게 먼저 보여 줄 것
- **sceneId:** `led-laser-optical-link-budget`
- **learningGoal:** LED 자연방출·레이저 유도방출의 역할을 구별하고 송신 광파워와 총 수동광손실 dB를 각각 조작해 광수신 전력을 계산한다.
- **priorKnowledge:** 11 PN,13 dB logarithm,24-S04 receiver
- **storyHook:** 한쪽 서버에서 보낸 빛이 커넥터와 광섬유를 지나 다른 서버에 도착해요. 송신기에 1mW라고 적혀 있으면 수신기도1mW일까요?
- **question:** 레이저가 켜졌다면 저쪽 서버도 빛을 충분히 받을까요?
- **predictionPrompt (student-only, no answer):** 1mW 광출력에서3dB와6dB 손실이 생기면 각각 얼마가 도착하는지 먼저 예상해요.
- **displayTextBeforePrediction:** 예측하기 전에는 결과와 정답 설명을 가려 둡니다.
- **speechTextBeforePrediction:** 송신 광출력과 경로의 손실은 다른 손잡이예요. 광원의 종류가 아닌 빛의 도착 전력을 먼저 예측해요.
- **learnerAction (two independent typed controls):** `launchPowerMw:1|2`와 `passiveLossDb:3|6`를 독립 조작. LED versus laser 개념 비교 탭은 설명용이며 **숫자 계산에 LED가 무조건 불리하다는 숨은 보정 금지**. 단순 광원→fiber/connectors→24-S04 광검출기 표시, 광부품 장치 실습 없음.
- **modelInputs/modelOutputs / unit QA:** `modelInputs:{launchPowerMw:1|2,passiveLossDb:3|6}`. `modelOutputs:{receivedOpticalMw:launchPowerMw*10**(-passiveLossDb/10),linearTransmission:10**(-passiveLossDb/10),deviceType:'IDEAL_LAUNCH_UNKNOWN',bitErrorRate:'NOT_MEASURED'}`. 1mW/3dB→.501187mW, 1/6→.251189mW, 2/3→1.002374mW,2/6→.502377mW. 3dB is roughly factor2 (not exactly); 6dB roughly factor4. Input is already **launched/coupled** optical power, not electrical wallplug power or laser physical output before coupling. Loss includes fictional all-passive path; dispersion, reach, responsivity vs λ, polarization, coding, FEC and sensitivity not modeled.
### ② 학생 조작 뒤에만 공개할 정답·오개념 원인
- **expectedObservation (teacher-only):** 송신2mW라도6dB의 수동 손실이면 약0.502mW만 도착해요. LED는 주로 자연방출, 레이저는 유도방출·광공진을 이용해 빛을 만들어요. 그렇다고 ‘레이저=오류 제로’는 아니에요.
- **teacherExpectedAnswer (gated):** 송신2mW라도6dB의 수동 손실이면 약0.502mW만 도착해요. LED는 주로 자연방출, 레이저는 유도방출·광공진을 이용해 빛을 만들어요. 그렇다고 ‘레이저=오류 제로’는 아니에요.
- **correctIncorrectCriteria:** 광출력1/2와 손실3/6을 모두 변경, 1mW 3dB .501 vs6dB .251, 2mW6dB .502 관찰; log power loss와 광원 메커니즘 구분, 광수신기 측정/BER NOT_MEASURED 설명.
- **misconceptions/m1:** 3dB 손실은 항상 광출력에서3밀리와트를 뺀다는 뜻이다.
- **misconceptionFeedback/m1 (gated):** dB는 선형 mW 빼기가 아니라 전력비를 로그로 쓴 숫자예요. 3dB는 대략 절반이에요.
- **misconceptions/m2:** 송신출력2mW면 수신은 손실과 무관하게2mW다.
- **misconceptionFeedback/m2 (gated):** 커넥터와 광경로에서 일부 전력이 줄어요. 수신은 송신×10의(−손실dB/10)제곱이에요.
- **misconceptions/m3:** 레이저는 단색·고방향성이니까 모든 길이/조건에서 LED보다 빠르고 오류가 없다.
- **misconceptionFeedback/m3 (gated):** 원리와 장점은 있지만 실제 수신품질은 파장/변조/결합손실/광수신 감도/분산·열/안전조건의 문제예요. 이 장면은 BER를 측정하지 않아요.
- **hint L1 (on demand):** dB는 mW와 다른 종류의 수치예요.
- **hint L2 (on demand):** 전력비는10의 (−손실dB/10)제곱이에요.
- **hint L3 (on demand):** 1mW×10^(−3/10)≈0.501mW로 계산해 보세요.
- **feedback/correct (gated):** 두 개의 독립 조작과 수치/단위, 왜 그렇게 되는지 설명까지 확인했어요. 실제 장비·안전·제품 성능 검증과는 달라요.
- **displayTextAfterObservation (gated):** 송신2mW라도6dB의 수동 손실이면 약0.502mW만 도착해요. LED는 주로 자연방출, 레이저는 유도방출·광공진을 이용해 빛을 만들어요. 그렇다고 ‘레이저=오류 제로’는 아니에요.
- **speechTextAfterObservation (gated):** 1밀리와트의 빛은 3데시벨의 손실 뒤 약0점501밀리와트로 도착해요. 레이저라는 이름만으로 통신 성공을 보장하지 않아요. 다음에는 광섬유와 스위치, CPO를 연결해 볼게요.
### ③ 시니어 반례·검수 계약
- **physicsAssumptions:** 위 두 축으로 제한한 수업용 정규화 모형; 실제 광전/전기 소자·레이저 운용/공정 수치를 인증하지 않음.
- **seniorDesignReview:** UO OpenLearn contrasts practical LED/laser coupling and spectra, but toy intentionally fixes already-launched optical power, so any LED vs laser propagation/speed ranking cannot be inferred. Cisco's dB loss is ratio of optical powers; passive loss alone not BER, eye safety or system reach. No hands-on laser instructions.
- **negativePathTest:** m1/m2/m3 각각 다른 원인에만 채점되는지, 정답 최초 선택 허용되는지, 입력 변경 시 기존 스냅샷을 다시 쓰지 않는지, PRE DOM·Voice·ARIA 정답 누설/No-observation false PASS 없는지 확인. A05 실제 브라우저 QA 전 A07 exact source 재검토.
- **sourceRefs:** [R8][R9]
- **nextHook:** 다음 레슨 30에서는 이 광 경로를 서버 네트워크·CPO와 연결해 봐요.

## A06 원고 자체 QA / A07 검토 전표 (2026-10-18)
- [x] **5 Scene IDs / 5 measurable goals / 5 student-neutral pre voice / 5 gated teacher-after voice / 15 cause-specific wrong feedback / 5×L1,L2,L3** 원고 구조 확인. A06 자가 점검만 뜻함.
- [x] **Two independent user typed controls** each scene. 24-S01 signalHz + sampleRateHz, S02 bits + Vref, S03 acceleration + sensitivity, S04 incident optical mW + responsivity, S05 launched power + passive loss. No hidden same-switch control.
- [x] **Calculated toy test vectors:** S01 700@1000→300,700@2000→700,300@1000→300; S02 3.3/256=12.890625mV,3.3/4096=.805664mV,2.5/256=9.765625mV,2.5/4096=.610352mV; S03 1g×.02→Δ.04pF,2g×.02→.08pF,2g×.04→.16pF; S04 .5mW×.3A/W=.15mA,1mW×.6A/W=.6mA; S05 1mW/3dB→.501187,1mW/6dB→.251189,2mW/6dB→.502377.
- [ ] **P1 NEXT:A07** independently review scientific formula, analog/mixed-signal/optics modelling boundaries and no-answer-before prediction; flag education MAJOR with exact blob SHA on [#66](https://github.com/Junebooky/interactive-engineering/issues/66) and directly A06 [#6](https://github.com/Junebooky/interactive-engineering/issues/6). PASS must not be asserted by author.
- [ ] **NEXT:A06 after A07 actual PASS only** STORY_READY + direct [A05 #4](https://github.com/Junebooky/interactive-engineering/issues/4) 5 scene typed handoff. [ ] A05 separate real Chrome/ARIA/Voice/320–375/browser/CI; [ ] A02 official integrated app E2E; [ ] owner native devices/Safari/listening, laser safety/real silicon and main merge/deploy permission all HOLD.
- [ ] **P2 future science content:** Si vs InGaAs wavelength responsivity, optical receiver jitter/shot noise, SNR/ENOB, MEMS drift/calibration/anti-aliasing, BER versus optical power/FEC in 30. Do not conceal these gaps.

## 참고 문헌(원문 링크 / 확인 2026-10-18)
- [R1] Analog Devices, [Aliasing glossary](https://www.analog.com/en/resources/glossary/aliasing.html); [R2] Analog Devices, [Anti-alias input filter FAQ](https://www.analog.com/en/resources/faqs/FAQ_antialiasing_filter.html). Sampling 2BW baseband requirement with caveat bandpass intentional undersampling.
- [R3] Analog Devices, [Types of ADCs and DACs](https://www.analog.com/en/resources/technical-articles/types-of-adcs-and-dacs.html); [R4] Analog Devices, [ENOB converter design calculator](https://www.analog.com/en/resources/design-notes/effective-number-of-bits-calculator-tutorial.html). Ideal ADC resolution is not actual SINAD/accuracy.
- [R5] STMicroelectronics, [AIS2120SX MEMS sensor product / differential capacitance description](https://www.st.com/en/mems-and-sensors/ais2120sx.html). Real MEMS per-SKU 14-bit/±120g spec belongs ONLY to the cited device, none used in toy.
- [R6] Hamamatsu, [detector selection / responsivity definition](https://hub.hamamatsu.com/us/en/technical-notes/detector-selection/the-wits-guide-to-selecting-a-photodetector.html); [R7] Hamamatsu, [Si photodiode product line](https://www.hamamatsu.com/us/en/product/optical-sensors/photodiodes/si-photodiodes.html). Actual spectral responsivity and dark current depend on product & λ.
- [R8] Open University OpenLearn, [LED versus laser light sources and optical detectors](https://www.open.edu/openlearn/mod/oucontent/view.php?id=3435&section=2.1); [R9] Cisco, [Introduction to fiber optics/dB/attenuation](https://www.cisco.com/c/en/us/support/docs/optical/synchronous-digital-hierarchy-sdh/29000-db-29000.html). Loss example is not a certified physical optical budget.
