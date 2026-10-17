# 13 · 데이터센터 숫자 읽는 법: GB·GT/s·확률·p99·SLO
> **A06_AUTHOR_SOURCE_DONE / A07_SOURCE_REVIEW_PENDING (2026-10-17)** · 5 Step × 3 misconception/hint/targeted feedback. 전체 **17 authored lessons /73 authored Steps**, 기존 16/68+13 신규5. A05 scene/code / A02 app not built or tested. [시니어 수치·공개 공식 근거 검증](../deep-dives/13-units-statistics-slo.md) · [Lesson13 pipeline card #45](https://github.com/Junebooky/interactive-engineering/issues/45).
> **학생 스토리:** 'AI 서버 스펙표에는 GB/s·GT/s·p99이 가득한데 뭘 믿어야 하지?' 복잡한 계산기가 아니라 **단위를 바르게 읽고, 조건을 바꿔 반례를 만드는** 실험실입니다. 12 전기·기초 지수를 선수로, 13→06 수율/07 메모리/09 SSD p99/29 PCIe/10 SLO 학습 전에 끼워 넣을 수 있어요. 약 45~55분 *기획 추정*, 실사용 시간 아님.

## 공통 학생·교사 상태 계약
- Student before prediction gets only **predictionPrompt, storyHook, question, displayTextBeforePrediction, speechTextBeforePrediction**; never `model` computed outcomes, `teacherExpectedAnswer`, `expectedObservation`, after Voice/display, m1/m2/m3 explanations before student predicts + manipulates two distinct independent states and teaches back WHY. Unit constants such as definition 1B=8b can be shown as reference cards but **derived quiz answers** remain hidden until after choice.
- `inputEvidence` stores prediction submitted, control changed twice in independent states, observed outputs, WHY reason typed/selected and optional wrongConcept. WrongConcept triggers **exactly the matching** one of three targeted messages, no generic feedback as a pass shortcut. **Correct first try does not need a deliberate wrong choice**. Visible hints level L1/L2/L3 only on request and graded reveal logic must remain transparent for keyboard/Voice/aria.
- All examples are **toy upper bounds or constructed request samples**, *not* real DRAM, SSD, PCIe cards, fabrication yields or AI cloud SLA/benchmark. SI/IEC units and definitions official, Poisson independence and histogram interpolation explicitly model-dependent.

## 13-S01 · `si-byte-gibibyte` · SSD 1GB와 메모리 1GiB, 같은 양일까요?
### ① 첫 1분: 먼저 예상하고 장치를 움직이기
- **sceneId:** `si-byte-gibibyte`
- **learningGoal:** byte vs bit and SI decimal vs IEC binary size convert exactly with labels; distinguish rate and capacity.
- **priorKnowledge:** 12-S01 charges/notation and 12-S04 energy units
- **storyHook:** 1GB 파일을 1GiB 메모리로 옮기면 칸이 정확히 똑같이 찰까요?
- **question:** 1GB 파일을 1GiB 메모리로 옮기면 칸이 정확히 똑같이 찰까요?
- **predictionPrompt (learner-only):** 1GB와 1GiB를 먼저 각각 byte로 변환해 보고 어느 쪽이 얼마나 큰지 수치 답을 제출하기 전에 고르세요.
- **displayTextBeforePrediction:** GB와 GiB의 크기를 비교해 볼까요?
- **speechTextBeforePrediction:** 파일 크기와 전송률의 기호가 같아 보여도 기준은 다를 수 있어요. 두 카드를 먼저 비교해 보세요.
- **learnerAction:** Select 1GB vs1GiB card; independently choose base=1000|1024 and symbol=GB|GiB, toggle 1GB/s ideal link vs1GiB payload; calculate transfer time only after prediction. Wrong convert 1GiB=10^9 and capital B=bit available as distinct choices.
- **modelInputs:** byteBit8, decimalGB=10^9 B, binaryGiB=2^30 B, lineRate=1GB/s=10^9 B/s ideal, payload 1GB or1GiB; no payload headers/queue. Units case sensitive.
### ② 관찰 뒤 확인 — 교사용 정답은 사전 Voice/aria/DOM 비노출
- **expectedObservation (teacher-only):** 1GB=1,000,000,000B; 1GiB=1,073,741,824B≈1.073741824GB, ~7.3741824% bigger. Ideal 1GB/s sends1GB in1s and1GiB in1.073741824s; 1B=8b, throughput ≠ capacity.
- **teacherExpectedAnswer (gated):** 1GB=1,000,000,000B; 1GiB=1,073,741,824B≈1.073741824GB, ~7.3741824% bigger. Ideal 1GB/s sends1GB in1s and1GiB in1.073741824s; 1B=8b, throughput ≠ capacity.
- **correctIncorrectCriteria:** Correct 1GB and1GiB conversion, bit/byte factor8, and two payload ideal times with proper seconds and a real-world caveat.
- **misconceptions:** [m1] 기가(G)와 기비(Gi)는 맞춤법만 다른 동일 값이다 / [m2] 대문자 B는 bit이고 소문자 b는 byte다 / [m3] 1GB/s 링크에선 모든 1GiB 파일이 정확히1초 안에 복사된다
- **hints L1/L2/L3 (requested only):** [L1] 단위 앞의 접두어가10의 거듭제곱인지 2의 거듭제곱인지 확인해요. / [L2] 바이트 대문자 B, 비트 소문자 b예요. / [L3] 데이터 크기를 초당 옮길 수 있는 byte 수로 나누면 이상적인 시간이에요.
- **misconceptionFeedback/m1 (gated):** “GB는10억 바이트고 GiB는2의30제곱 바이트예요. 7% 이상 차이가 나죠.”
- **misconceptionFeedback/m2 (gated):** “1 byte는8 bits예요. 대문자 B와 소문자 b를 바꿔 읽으면 8배 실수할 수 있어요.”
- **misconceptionFeedback/m3 (gated):** “1GiB는1.0737GB라 이상적 1GB/s에서도1.0737초가 필요하고 실제 프로토콜 오버헤드는 더 있어요.”
- **feedback/correct:** “서로 다른 두 설정에서 관찰한 숫자와 단위를 비교했어요. 이제 이 결과가 언제는 맞지 않는지도 설명해 보세요.”
- **displayTextAfterObservation (gated):** 1GiB는 1GB보다 약 7.37% 커요.
- **speechTextAfterObservation (gated):** 일 기가바이트는 십억 바이트지만 일 기비바이트는 이의 삼십 제곱 바이트예요. 실제 저장공간을 계산할 땐 기호를 구분해야 하죠.
### ③ 시니어 판단과 실패 조건
- **physicsAssumptions:** NIST SI/IEC prefix official; 1GB/s ideal payload link fictional; no device promise, memory overhead, SSD formatting, error correction, copy setup. Transfer rate not same as capacity.
- **seniorDesignReview:** Beware decimal drive capacity, binary OS display and storage overhead, network Gbps vs GB/s and negotiated throughput. Exact unit/measurement boundary before performance claims.
- **sourceRefs:** [U1]
- **negativePathTest:** learner chooses corresponding m1/m2/m3 wrong option, shows only matching corrective branch; correct state can pass with 2 independently manipulated settings+WHY. Numerical wrong values shown only after student prediction; special source edge scenarios in modelInputs/observations above must be asserted.
- **nextHook:** 전송률 MT/s와 PCIe GT/s가 나와도 같은 수로 읽어도 될까요?

## 13-S02 · `transfers-bits-bandwidth` · 6,400MT/s면 6,400MB/s일까요?
### ① 첫 1분: 먼저 예상하고 장치를 움직이기
- **sceneId:** `transfers-bits-bandwidth`
- **learningGoal:** Convert channel transfer rate×data width to theoretical bytes/s, contrast PCIe bidirectional market figure and app payload.
- **priorKnowledge:** 13-S01 bit/byte and 02 DRAM bus, 29 PCIe intro can be optional
- **storyHook:** 메모리와 PCIe 사양서엔 MT/s, GT/s, GB/s가 섞여 있어요. 뭐가 진짜 파일속도일까요?
- **question:** 메모리와 PCIe 사양서엔 MT/s, GT/s, GB/s가 섞여 있어요. 뭐가 진짜 파일속도일까요?
- **predictionPrompt (learner-only):** 데이터선 64비트에서 초당 6400백만번 전송하면 몇 GB/s일까요? PCIe6 x16의 '양방향 합계' 256GB/s는 한 방향 속도와 같을까요?
- **displayTextBeforePrediction:** 전송 횟수와 데이터선 너비를 따로 움직여볼까요?
- **speechTextBeforePrediction:** 전송률 카드와 버스 폭 카드를 골라봐요. 각 카드는 다른 단위를 말해요.
- **learnerAction:** 64-bit data-only bus width; transfer slider 3200/6400 MT/s, compute target GB/s decimal without latency merging. Then PCIe6 advertised 256GB/s BOTH directions x16 vs one-way ideal half, toggle direction and marketing metric, test wrong GT/s doubled for PAM4. Reader must separate link ceiling and app throughput.
- **modelInputs:** DDR dataWidth=64bits, rate=3200|6400MT/s, theoreticalGBps=(width/8)*rate/1000 where rate numeric MT/s; DDR51.2/25.6GB/s. PCIe6 x16 public bidirectional total256GB/s, ideal one way128GB/s, oneWayActualLessThanCeiling unspecified. Not equivalent to measured SSD/NIC. PCIe6 PAM4 already included in rate, no multiply2.
### ② 관찰 뒤 확인 — 교사용 정답은 사전 Voice/aria/DOM 비노출
- **expectedObservation (teacher-only):** DDR data-only lane at6400MT/s 64bit⇒51.2GB/s, 3200⇒25.6GB/s, ignoring controller/refresh/bursts. PCIe6 x16 public 256GB/s aggregate two-direction upper envelope, symmetric one-way≈128GB/s, NOT 256GB/s one-way user payload. MT/s memory transfer events vs GT/s PCIe signaling vs app GB/s not interchangeable by name.
- **teacherExpectedAnswer (gated):** DDR data-only lane at6400MT/s 64bit⇒51.2GB/s, 3200⇒25.6GB/s, ignoring controller/refresh/bursts. PCIe6 x16 public 256GB/s aggregate two-direction upper envelope, symmetric one-way≈128GB/s, NOT 256GB/s one-way user payload. MT/s memory transfer events vs GT/s PCIe signaling vs app GB/s not interchangeable by name.
- **correctIncorrectCriteria:** Calculate 51.2 and 25.6 decimal theoretical, identify PCIe both vs one-way 256/128, correctly reject marketed maximum=actual app payload; no PAM4 double multiplication.
- **misconceptions:** [m1] 6400MT/s는 버스폭과 무관하게 6400MB/s다 / [m2] PCIe6 x16의256GB/s는 모든 방향에서 각각 파일을256GB/s 옮긴다는 뜻이다 / [m3] PAM4가 2bit/symbol이니까 공식 PCIe6 GT/s를 또 2배 하면 된다
- **hints L1/L2/L3 (requested only):** [L1] 초당 몇 번 전송하고, 한 번에 몇 비트를 보낼까요? / [L2] 공식 수치에 두 방향을 합산했는지 확인해봐요. / [L3] 전송률 사양에서 이미 신호 부호화를 반영했는지 확인해봐요.
- **misconceptionFeedback/m1 (gated):** “64비트면 한번 전송에8바이트예요. 6400×10^6번/s×8B는51.2GB/s예요.”
- **misconceptionFeedback/m2 (gated):** “256GB/s는 PCI-SIG 공식 x16 양방향 합계예요. 한 방향 이상적 몫은 약 절반이고 앱 payload는 더 제한받죠.”
- **misconceptionFeedback/m3 (gated):** “PCI-SIG의 advertised GT/s에 PAM4를 다시 곱하면 이중 계산이에요. 프로토콜 오버헤드도 고려해야 해요.”
- **feedback/correct:** “서로 다른 두 설정에서 관찰한 숫자와 단위를 비교했어요. 이제 이 결과가 언제는 맞지 않는지도 설명해 보세요.”
- **displayTextAfterObservation (gated):** 전송률만으로 실제 파일 전송속도를 확정할 수 없어요.
- **speechTextAfterObservation (gated):** 메모리 최대 바이트 수는 전송 횟수와 데이터 폭을 함께 곱해요. PCIe는 양방향 합계 표기인지 먼저 확인해야 하죠.
### ③ 시니어 판단과 실패 조건
- **physicsAssumptions:** DDR 64 data bits excluding ECC, aggregate theoretical zero overhead; PCIe6 spec max public PCI-SIG, not actual app rate. GT/s vs PAM4 symbol clocks and link generation require full protocol accounting.
- **seniorDesignReview:** Check negotiated Gen/lanes, coding, FEC/FLIT, headers, DMA buffers, queue occupancy and asymmetric bandwidth; no guaranteed SSD performance.
- **sourceRefs:** [U2][U1]
- **negativePathTest:** learner chooses corresponding m1/m2/m3 wrong option, shows only matching corrective branch; correct state can pass with 2 independently manipulated settings+WHY. Numerical wrong values shown only after student prediction; special source edge scenarios in modelInputs/observations above must be asserted.
- **nextHook:** 숫자 말고 확률을 다뤄야 하는 제조 수율은 어떻게 읽을까요?

## 13-S03 · `poisson-yield-log` · 큰 칩을 잘라서 네 개로 만들면 수율이 4배일까요?
### ① 첫 1분: 먼저 예상하고 장치를 움직이기
- **sceneId:** `poisson-yield-log`
- **learningGoal:** Connect dimensioned defect density area to Poisson zero-defect probability e^-DA, ln inverse and screened assembly denominator.
- **priorKnowledge:** 12-S03 exponential decay and 06 wafer toy preview
- **storyHook:** 웨이퍼에서 큰 칩 하나 대신 작은 칩 네 개를 뽑으면 생산 성공확률도 네 배일까요?
- **question:** 웨이퍼에서 큰 칩 하나 대신 작은 칩 네 개를 뽑으면 생산 성공확률도 네 배일까요?
- **predictionPrompt (learner-only):** 같은 총 면적100mm², 결함 밀도0.005/mm²라면 단일 큰 칩과 작은25mm² 네 개를 무작위로 골라 모두 정상일 확률이 어떻게 될지 예상해 보세요.
- **displayTextBeforePrediction:** 칩 크기만 바꾸면 무슨 확률이 바뀔까요?
- **speechTextBeforePrediction:** 결함과 면적 카드를 조합해 어떤 칩이 정상일지 먼저 예상해보세요.
- **learnerAction:** Area slider100mm² big vs4×25mm² with D 0 or.005/mm²; calculate expected defects λ=DA as dimensionless; read P0=e^-λ after prediction. For group4 choose all-good and reverse ln to infer D from observed conditional toy P0; show screened KGD as separate later choice NOT automatically same as four random chips.
- **modelInputs:** D=0|0.005/mm², A=100|25mm², independent homogeneous Poisson defects, P0=exp(-D*A), P>=1=1-P0; y25^4=y100 for unscreened independent die defects; inferred D=-ln(y100)/100mm²; KGD toggle exists but not used in random package product yield.
### ② 관찰 뒤 확인 — 교사용 정답은 사전 Voice/aria/DOM 비노출
- **expectedObservation (teacher-only):** D.005 A100 =>λ.5, P0=.60653066 and P(≥1)=.39346934; A25=>λ.125, P0=.88249690; four unscreened all-good (.8824969)^4=.60653066. ln(.60653)/(-100mm²)≈.005/mm². Screening before assembly changes conditional selection, not raw wafer yield.
- **teacherExpectedAnswer (gated):** D.005 A100 =>λ.5, P0=.60653066 and P(≥1)=.39346934; A25=>λ.125, P0=.88249690; four unscreened all-good (.8824969)^4=.60653066. ln(.60653)/(-100mm²)≈.005/mm². Screening before assembly changes conditional selection, not raw wafer yield.
- **correctIncorrectCriteria:** Choose independent die success vs all-four probability, correctly compute exp/log inversion and units, explain Poisson spatial independence and why KGD is separate selection/cost.
- **misconceptions:** [m1] 소형 다이의 개별 양품률이88%면 그 다이 네 개의 완제품 양품률도88%다 / [m2] 결함 밀도 단위가1/mm²여도 면적과 곱하면 결과에 mm²가 남는다 / [m3] KGD 검사를 하면 제조한 웨이퍼의 모든 다이가 공짜로 양품으로 바뀐다
- **hints L1/L2/L3 (requested only):** [L1] 좋은 작은 칩 네 개가 동시에 필요하다면 확률을 어떻게 결합할까요? / [L2] 결함 밀도와 면적의 단위는 약분될까요? / [L3] 선별한 양품만 조립하는 것과 웨이퍼에서 나온 전체 수율을 구분해요.
- **misconceptionFeedback/m1 (gated):** “각 다이 독립 확률의 곱을 구해야 해요. 네 개 모두 양품일 확률은 약60.65%예요.”
- **misconceptionFeedback/m2 (gated):** “(결함/mm²)×(mm²)=예상 결함수라는 무차원 모형 값이에요.”
- **misconceptionFeedback/m3 (gated):** “KGD는 양품을 선택해 불량 조립을 줄일 수 있지만 검사·선별 비용과 투입된 불량 후보를 없애지는 못해요.”
- **feedback/correct:** “서로 다른 두 설정에서 관찰한 숫자와 단위를 비교했어요. 이제 이 결과가 언제는 맞지 않는지도 설명해 보세요.”
- **displayTextAfterObservation (gated):** 개별 칩의 생존확률과 네 칩 모두의 생존확률은 달라요.
- **speechTextAfterObservation (gated):** 작은 칩 하나는 정상일 가능성이 더 높을 수 있어요. 하지만 네 개를 한 번에 무작위로 조립한다면 네 개 모두 정상이어야 하죠.
### ③ 시니어 판단과 실패 조건
- **physicsAssumptions:** Independent spatial Poisson point defects, uniform density; 4 dies each independent drawn unscreened, no packaging failure included in this pure submodel, real process clustered defects, defect kills and KGD escapes vary.
- **seniorDesignReview:** Yield curve parameter fitting and log units, selection-vs-package conditional denominator, chiplet interposer assembly yield; never generalize toy to commercial node or cost.
- **sourceRefs:** [U7]
- **negativePathTest:** learner chooses corresponding m1/m2/m3 wrong option, shows only matching corrective branch; correct state can pass with 2 independently manipulated settings+WHY. Numerical wrong values shown only after student prediction; special source edge scenarios in modelInputs/observations above must be asserted.
- **nextHook:** 그럼 숫자 백 개를 평균 하나로 뭉치면 느린 요청을 찾을 수 있을까요?

## 13-S04 · `raw-percentile-histogram` · 평균은 1ms대인데 p99가 20ms일 수도 있을까요?
### ① 첫 1분: 먼저 예상하고 장치를 움직이기
- **sceneId:** `raw-percentile-histogram`
- **learningGoal:** Compute nearest-rank raw percentile with sorted samples and explain histogram bucket interpolation can give different estimate.
- **priorKnowledge:** 13-S01 prefix ms, 13-S03 probability/exponent, 09 SSD p99 preview
- **storyHook:** 99명이 빠르게 답을 받고 한 명만 오래 기다리면, 그 한 명은 통계에 안 보일까요?
- **question:** 99명이 빠르게 답을 받고 한 명만 오래 기다리면, 그 한 명은 통계에 안 보일까요?
- **predictionPrompt (learner-only):** 백 번의 응답 중 빠른 요청과 느린 요청이 섞였을 때 평균·최댓값·p99는 각각 어떻게 달라질지, 데이터를 먼저 정렬할지 선택해 보세요.
- **displayTextBeforePrediction:** 느린 요청을 한눈에 볼 수 있을까요?
- **speechTextBeforePrediction:** 응답시간 카드를 섞고 순서를 바꿔봐요. 평균과 느린 꼬리 지표를 비교하기 전에 직접 고르세요.
- **learnerAction:** Drag/shuffle 100 latency cards then sort; A: 95×1ms+5×20ms and B:99×1ms+1×20ms; choose quantile definition nearestRank and 99th after sorting. Independently coarse histogram toy raw 10,20,30,40,90ms with buckets <=50 count4, <=100 count5 plus +Inf, choose nearest-rank p90 versus Prometheus classic bucket-interpolated estimate. Try unsorted index mistake and 'p99=max' trap.
- **modelInputs:** n100 datasets A95×1ms+5×20ms, B99×1ms+1×20ms, q=.99 rank=ceil(.99n)=99 in one-indexed ordered values; raw n5 [10,20,30,40,90]ms q=.9 rankceil4.5=5 =>90ms; classic cumulative bucket <=50 4, <=100 5, <=+Inf 5, interpolate target count4.5 in (50,100] =>75ms estimate; sample window/aggregation method explicit.
### ② 관찰 뒤 확인 — 교사용 정답은 사전 Voice/aria/DOM 비노출
- **expectedObservation (teacher-only):** A mean1.95ms raw p99=20ms; B mean1.19ms raw p99=1ms **despite max20ms**; nearest-rank n5 p90=90ms but coarse classic histogram interpolated p90 estimate75ms, because bucket detail lost. Quantile methods and sample windows differ; no SSD production performance claim.
- **teacherExpectedAnswer (gated):** A mean1.95ms raw p99=20ms; B mean1.19ms raw p99=1ms **despite max20ms**; nearest-rank n5 p90=90ms but coarse classic histogram interpolated p90 estimate75ms, because bucket detail lost. Quantile methods and sample windows differ; no SSD production performance claim.
- **correctIncorrectCriteria:** Student sorts and selects #99 with distinct A/B outcomes, computes two means and distinguishes p99 vs maximum. At n5 raw p90 90 vs histogram estimate75 with bucket interpolation assumptions and metric-specific valid window.
- **misconceptions:** [m1] p99은 표본에서 언제나 가장 오래 걸린 최대 요청과 같다 / [m2] 퍼센타일은 입력 순서 그대로 99번째 카드를 읽으면 된다 / [m3] 히스토그램 p90 근삿값은 원시 표본에서 뽑은 정확한 p90과 반드시 같다
- **hints L1/L2/L3 (requested only):** [L1] 먼저 작은 수부터 큰 수로 순서를 만들어 볼까요? / [L2] nearest-rank 정의가 n100일 때 99번째를 뜻해요. / [L3] 히스토그램 경계 사이의 원시 관찰 위치가 복원될까요?
- **misconceptionFeedback/m1 (gated):** “예시 B에선 99번째가1ms이고 마지막100번째만20ms예요. p99과 최댓값은 달라요.”
- **misconceptionFeedback/m2 (gated):** “정렬하지 않고 99번째 원래 순서를 읽는 것은 nearest-rank 분위수가 아니에요.”
- **misconceptionFeedback/m3 (gated):** “거친 버킷은 안쪽 분포를 잃어요. 이 장난감 예시 원시 p90=90ms와 버킷 보간 추정75ms가 다르죠.”
- **feedback/correct:** “서로 다른 두 설정에서 관찰한 숫자와 단위를 비교했어요. 이제 이 결과가 언제는 맞지 않는지도 설명해 보세요.”
- **displayTextAfterObservation (gated):** p99은 정한 계산 방식과 표본 분포에 따라 달라요.
- **speechTextAfterObservation (gated):** 똑같은 최댓값이라도 느린 요청의 개수가 다르면 p99이 달라질 수 있어요. 히스토그램 추정값은 정확한 원시 표본 값과 같지 않을 수도 있죠.
### ③ 시니어 판단과 실패 조건
- **physicsAssumptions:** Nearest-rank convention explicit vs Prometheus classic histogram linear interpolation: input cumulative buckets valid with +Inf, assume uniform within bucket. Tiny n5 intentionally illustrates inaccuracy, not production quantile confidence. A/B 100 toy synthetic sample distributions, no request filters or omitted timeouts.
- **seniorDesignReview:** SLO monitoring high-cardinality window, distribution shifts, weighted histograms, histogram bucket accuracy, missing data and tail correlations; never compare metrics computed over unlike windows.
- **sourceRefs:** [U3][U4][U5][U6]
- **negativePathTest:** learner chooses corresponding m1/m2/m3 wrong option, shows only matching corrective branch; correct state can pass with 2 independently manipulated settings+WHY. Numerical wrong values shown only after student prediction; special source edge scenarios in modelInputs/observations above must be asserted.
- **nextHook:** p99과 사용자 약속 SLO는 같을까요? 실패 요청 수로 직접 검사해 봐요.

## 13-S05 · `slo-error-budget` · 성공률 99%면 SLO 99.9%를 통과한 걸까요?
### ① 첫 1분: 먼저 예상하고 장치를 움직이기
- **sceneId:** `slo-error-budget`
- **learningGoal:** Distinguish SLI sample-good fraction from SLO target, error budget and tail latency, with exact eligible-request denominator/window.
- **priorKnowledge:** 13-S04 percentiles; 10 AI DC serving metrics preview
- **storyHook:** 실패한 요청 열 개. 천 번 중이면 괜찮아 보이죠? 목표가 99.9%라면요?
- **question:** 실패한 요청 열 개. 천 번 중이면 괜찮아 보이죠? 목표가 99.9%라면요?
- **predictionPrompt (learner-only):** 같은 기간의 적격 요청 1,000개 중 성공990개일 때 성공률을 예상하고, 목표99.9%를 지킬 수 있는 최대 실패 수를 먼저 고르세요.
- **displayTextBeforePrediction:** 사용자에게 약속한 목표를 직접 시험해 볼까요?
- **speechTextBeforePrediction:** 요청 수와 목표 성공률이 주어졌어요. 어떤 요청을 셀지 먼저 정하고 성공률을 예상해 보세요.
- **learnerAction:** **Before outcomes**, pin written `eligibilityPolicy=service:/inference,region:demo,window:24h` and `rawRequests=1100` as eligible scope rules. Show 100 out-of-scope **good** samples as separate colored cards from predeclared included1000: 990 good+10 bad (timeouts counted as bad). Derive eligibleN from status-group counts, never independently edit it. Learner toggles count scenario predeclared good990/bad10 vs good999/bad1 vs good1000/bad0, SLOtarget .99/.999, and scoring policy `predeclared|postHocDropTimeouts`. Then independently try read-only diagnostic exclusions: 100 observed good removal ⇒ 890good/10bad/900 eligible (98.8889%), or 10 bad+90 good removal⇒900good/0bad/900 eligible (100% apparent), **both marked ELIGIBILITY_VIOLATION** if selected after outcomes; legitimate 100 out-of-scope records already excluded before scoring. No pass from post-hoc 100%.
- **modelInputs:** `rawRequests=1100` toy, `declaredEligibilityRule='service=/inference AND region=demo AND fixed 24h'` **frozen before seeing statuses**; `rawInScopeGood=990|999|1000`, `rawInScopeBad=10|1|0` with correlated pairing summing1000 (bad includes timeouts); `rawOutOfScopeGood=100`, `rawOutOfScopeBad=0`; `scoreMode=predeclared|postHocDropTimeouts`, `diagnosticFilter=none|remove100ObservedGood|remove10ObservedBadPlus90Good`, `targetSLO=.99|.999`, and `observedLatencyDistribution` optional separate. Derived *read-only* `rawN=inGood+inBad+outGood+outBad=1100`, `eligibleN=inGood+inBad=1000`, `excludedN=outGood+outBad=100`, `allowedBad=floor(eligibleN*(1−target))`, `observedBad=inBad`, `SLI=inGood/eligibleN`, `passed=(observedBad<=allowedBad && scoreMode=predeclared && diagnosticFilter=none)`. Diagnostic after-outcome filters compute their own **coupled** denominator/numerator for demonstration ONLY; never silently change declared eligibleN or claim SLO PASS.
### ② 관찰 뒤 확인 — 교사용 정답은 사전 Voice/aria/DOM 비노출
- **expectedObservation (teacher-only):** From **raw1100** and predeclared out-of-scope-good100, eligible=990 good+10 bad=1000, SLI99%, SLO99.9% allows1 bad; 10 observed fail/exceed by9. Alternate in-scope999good/1bad meets exactly; 990/10 meets target99%. Dropping failed timeouts *after observing outcomes* returns `ELIGIBILITY_VIOLATION`, not pass, even if computed filtered fraction=100%. A diagnostic `remove100ObservedGood` from original in-scope leaves890/900≈98.8889%, while `remove10BadPlus90Good` leaves900/900=100%, both show different fractions and invalid post-hoc selection. The predeclared excluded100 out-of-scope good samples *never* changes eligible status counts and stays N1000. P99 latency metric remains independent.
- **teacherExpectedAnswer (gated):** Baseline category invariant `rawN1100=inScopeGood990+bad10+outScopeGood100+bad0`, eligibleN1000 derived, allowed bad1 @99.9%, actual10 =>10× budget, over9. 999good/1bad meets99.9%, 990good/10bad meets99%; one hundred genuine out-of-scope removed by **predeclared** policy is valid N1000. Any outcome-chosen removal of ten failed timeouts is an **eligibility violation**, not successful SLO; removing hundred good diagnostic yields 890/900, removing ten bad and ninety good yields 900/900, neither is valid evidence for original frozen policy.
- **correctIncorrectCriteria:** Learner matches raw1100 to inScope good/bad and out-of-scope good100 *before* outcomes, calculates eligibleN1000 dynamically, targets .999/.99 with 990/10 and 999/1, and demonstrates **all three** (a) legal predeclared100-out-of-scope gives honest990/1000, (b) post-hoc timeout drop invalid, (c) remove100 observed GOOD yields 890/900—not unchanged 990/1000 or blanket100%. Counts for numerator and denominator move together; none of post-hoc diagnostic scores can earn PASS.
- **misconceptions:** [m1] 실제 성공률99.0%면 SLO 99.9%도 자동으로 통과한다 / [m2] p99 지연시간이 좋으면 어떤 조건에서도 실패요청 SLO도 보장된다 / [m3] 일단 실패한 요청을 샘플에서 제외하면 서비스 성공률을 높였으니 올바른 측정이다
- **hints L1/L2/L3 (requested only):** [L1] 성공 요청 수를 적격 전체 요청 수로 나눠 봐요. / [L2] 허용 실패는 전체 요청 중 목표에 못 미쳐도 되는 분량이에요. / [L3] 먼저 적격 요청 포함·제외 기준과 기간을 정의했나요?
- **misconceptionFeedback/m1 (gated):** “990/1000은99.0%예요. 99.9%를 만족하려면 같은 집합에서 최소999개 성공이 필요해요.”
- **misconceptionFeedback/m2 (gated):** “p99는 분포의 응답시간 지표예요. 실패 요청 비율과 측정 조건은 따로 지정해야 해요.”
- **misconceptionFeedback/m3 (gated):** “실패/타임아웃을 규칙 없이 제외하면 분모 조작이 돼요. 사전 합의된 적격 요청 기준을 지켜야 해요.”
- **feedback/correct:** “서로 다른 두 설정에서 관찰한 숫자와 단위를 비교했어요. 이제 이 결과가 언제는 맞지 않는지도 설명해 보세요.”
- **displayTextAfterObservation (gated):** 적격 요청 1,000개 중 실패10개는 성공률 99%예요.
- **speechTextAfterObservation (gated):** 같은 천 건에서 목표가 구십구 점 구 퍼센트라면 실패는 한 개만 허용돼요. 목표와 기간, 어떤 요청을 세는지를 함께 써야죠.
### ③ 시니어 판단과 실패 조건
- **physicsAssumptions:** Fixed fictional 24h cohort of raw1100 including100 predeclared out-of-scope good records, initially eligible1000 composed of990 good/10 bad with timeouts=bad. Alternate eligibility filters shown only as **post-outcome diagnostic counterexamples**, not permitted changes to original SLO population. Any genuinely new predeclared cohort must supply includedGood, includedBad, excludedGood, excludedBad separately and satisfy raw count conservation, and its own measurement window/target. No production SLO, filtering vendor or p99 inference.
- **seniorDesignReview:** Define numerator/denominator, windows, resets, regional/service filters, retry/double counting and user-visible TTFT/p99 metrics separately; combine availability and performance only through explicit multi-SLI contract.
- **sourceRefs:** [U5][U6]
- **negativePathTest:** learner chooses corresponding m1/m2/m3 wrong option, shows only matching corrective branch; correct state can pass with 2 independently manipulated settings+WHY. Numerical wrong values shown only after student prediction; special source edge scenarios in modelInputs/observations above must be asserted.
- **nextHook:** 이제 09 SSD의 p99, 06 칩렛 수율, 29 PCIe 전송률, 10 AI DC 목표를 직접 검증할 수 있겠죠?

## A07 independent source review / A05 possible SceneSpec after PASS
| Step | Key physical/quantitative acceptance | Must fail/hidden branch |
|---|---|---|
| 13-S01 | 1GB=10^9B, 1GiB=2^30B=1.073741824GB; 1GB/s payload 1GiB→1.073741824s ideal | B/b reversal, GI decimal mistake, real copy exact-time promise |
| 13-S02 | DDR64×6400MT/s /8=>51.2GB/s; 3200→25.6GB/s; PCIe6 x16 official both256 / one-way≈128GB/s marketing max | GT/s×2 PAM4 and one-way app payload 256GB/s false |
| 13-S03 | D.005/mm² ×A100mm²=>λ.5, P0=e^−.5≈.60653; A25 =>.88250; 4 all-good≈.60653; inverse −ln(P0)/A | small die individual y falsely reused as 4-die product, raw KGD success with free perfect dies |
| 13-S04 | n100 A mean1.95/p99 20ms, B mean1.19/p991ms despite max20; n5 raw p90=90ms, coarse histogram interpolation estimate75ms | unsorted rank, p99=max, histogram estimate identical to exact raw |
| 13-S05 | Eligible1000, SLO99.9% allows1 bad, 990good⇒99% and10bad (10× budget, exceeds by9), SLO99% threshold exactly met | p99≠SLO, selective removing failed requests invalid |
- P1 NEXT:A07 evaluate all 15 targeted physical misconceptions, five separately gated before/post Korean Voice and correctness of sampled/estimated metrics with public official sources. After A07 exact source PASS, A06→A05 direct #4 handoff with five 2.5D scene contracts; A05 test invalid branches actual Chromium/mobile/aria/audio and exact tested HEAD then A02 app. Owner hardware/user QA/main merge/deploy HOLD.

## Source URLs (checkedAt 2026-10-17, each full address in deep dive)
[U1] NIST https://pml.nist.gov/cuu/Units/binary.html
[U2] PCI-SIG https://pcisig.com/faq?field_category_value%5B%5D=pci_express_6.0&keys=PAM4
[U3] Prometheus https://prometheus.io/docs/prometheus/latest/querying/functions/
[U4] Prometheus native histogram spec https://prometheus.io/docs/specs/native_histograms/
[U5] Google SRE https://sre.google/sre-book/service-level-objectives/
[U6] Google SRE https://sre.google/sre-book/monitoring-distributed-systems/
[U7] Poisson independent defects math model, no product/fab source representation.

- **eligibilityInvariant:** `rawN=inScopeGood+inScopeBad+outScopeGood+outScopeBad=1100`. Only a *frozen* policy before outcomes derives eligibleN1000, pass-good990/bad10. `postHocDropTimeouts` and both after-outcome filters must report **ELIGIBILITY_VIOLATION**, optionally show honest diagnostic changed numerators+denominators separately, never count as valid SLO improvement.
- **negativePathTest:** 1) baseline in990/bad10/target.999 ⇒ FAIL budget over9; 2) good999/bad1/target.999 ⇒ PASS; 3) in990/bad10/target.99 ⇒ PASS; 4) raw1100 includes predeclared outGood100 ⇒ eligible1000 and valid baseline99%; 5) posthoc timeout10 removed ⇒ ELIGIBILITY_VIOLATION even though filtered990/990 appears100%; 6) posthoc remove100 observed good ⇒ diagnostic890/900 (~98.8889%), ELIGIBILITY_VIOLATION; 7) posthoc remove10bad+90good ⇒ diagnostic900/900=100% but ELIGIBILITY_VIOLATION; 8) favorable p99 does not guarantee SLO success. Must test hidden before-Voice and independent frozen-eligibility state at actual 2.5D when A05 built after A07 PASS.

## A07 Round14 R14-01 grading-MAJOR repair authored 2026-10-17
- [Independent A07 audited original `ea03cc40`](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-14-lesson13-units-statistics-slo-independent-audit.md) and found S05 exclusion100 toggle without status or raw population incapable of causal grading. New S05 fixes cohort invariant (raw1100 = eligible990good+10bad +100 out-of-scope good), frozen eligibility rule and explicit `postHocDropTimeouts` **ELIGIBILITY_VIOLATION**. Diagnostic filters remove100 observed good→890/900, remove10bad+90good→900/900 invalid even if apparent performance improves. Derived eligibleN (never mutable), full negative tests. S01-S04 math source PASS retained, current new SHA independent A07 full EDU source recheck pending. P2: classic histogram cumulative le buckets 50:4,100:5,+Inf:5 already in S04, keep distinct from raw nearest rank.
