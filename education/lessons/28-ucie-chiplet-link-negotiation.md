# 28 · UCIe 3.0: 칩렛 사이 전기적 길의 속도·협상·의미·복원·전력
> A06 R35 · 2026-10-18 KST · [#74](https://github.com/Junebooky/interactive-engineering/issues/74) · **AUTHOR_SOURCE_DONE only; A07 independent source QA [ ] / A05 handoff [ ]**. Source: UCIe Consortium official [UCIe 3.0 spec page](https://www.uciexpress.org/specifications) (Aug 5,2025 specification release); UCIe 3.0 supports 48/64 GT/s under documented conditions, **not every product shipping at 64GT/s**. Physics fixture invented for classroom; no real silicon/power/BER/PHY or system SKU certification.
>
> **Prerequisites** 12 unit W·J; 13 bandwidth/latency/units; 06 chiplets/2.5D packaging; 29 PCIe/DMA/CXL and SerDes; 20 RTL/DFT optional. **Next** 03/10 GPU/AI accelerators and30 photonics. Educational sequence S01→S05 30~40minutes *estimated*. 27 previously authored lessons/123 Steps now after 28; 115-topic atlas remains a breadth map not physical signoff.
>
> **UI contract A03 V3:** before student prediction only one Korean neutral question and `speechTextBeforePrediction`; all actual controls scene-adjacent **Experiment Dock** after prediction; actual `observe` event and both typed inputs evidence before graded WHY; teacher value/feedback/after Voice/ARIA/DOM **hidden before correct gate**. 3 wrong answers per scene m1/m2/m3 with cause-specific feedback and separate 3 hints on request; first correct counts after actual trials. `trialId`, phase, immutable event snapshots and no retroactive grade, reset required for new settings after graded/run. A05 must not put control in Problem panel. Not-run is never equal measured0 or PASS.
>
> **Terminology:** 3.0 **specification** published August2025; 48/64GT/s standard supports signaling rates for eligible profiles, vs UCIe2.0 32GT/s reference. UCIe3 “backward compatible” standards claim not a product-specific compatibility guarantee. UCIe package PHY ≠ external PCIe socket/cable ≠ optical CPO. “2.5D” package physical meaning distinct from our artistic UI 2.5D. Actual throughput depends on one vs multiple modules, encoding, FEC/CRC/retry, rate training, protocol and consumer bottlenecks.
>
## Toy typed SceneSpec integration
`lessonId='28'`, `sceneId` exact below, `prediction`, `controlChange`, `observe`, `whyAnswer`, `requestHint`, `newTrialReset`, `voiceRequest` disjoint typed events. `phase='PREDICT'|'EXPERIMENT'|'OBSERVE'|'EXPLAIN'|'FEEDBACK'`, `trialId`, `inputEvidence` for BOTH actual controls, `observationSnapshot` only after explicit event, `gradingEvidence` immutable. After wrong feedback never show full teacher WHY until gate. Synthetic rate/energy/numerical exercises are neither official measured PHY power nor verified device specs. 

## 28-S01 · `ucie-chiplet-module-gross-bandwidth` · 칩을 여러 조각으로 붙이면 데이터 통로도 저절로 무한히 넓어질까요?
### ① 예측 전 학생 원고 (결과·정답·숫자 선노출 금지)
- **sceneId:** `ucie-chiplet-module-gross-bandwidth`
- **learningGoal:** 패키지 속 x16 통로 묶음의 수와 신호 속도를 각각 변경해 총 물리 전송 비트율의 상한을 계산하고 실제 유효 payload와 구분한다.
- **priorKnowledge:** 06 KGD/패키징·29 SerDes/PCIe·13 GT/s와 GB/s
- **storyHook:** GPU 속 계산 칩과 메모리 I/O 칩이 서로 다른 조각이라면 그 사이에 몇 개의 데이터 길이 필요할까요?
- **question:** 칩을 여러 조각으로 붙이면 데이터 통로도 저절로 무한히 넓어질까요?
- **predictionPrompt (student-only):** 가상의 x16 통로 묶음 하나와 두 개가 각각 32GT/s와 64GT/s에서 얼마나 많은 *원시 신호*를 운반할지 예상해 보세요.
- **displayTextBeforePrediction:** 예측을 먼저 선택한 뒤 실험 도크에서 서로 다른 두 조건을 실제로 조작해 보세요.
- **speechTextBeforePrediction (Korean neutral):** 칩 사이에 붙일 통로 묶음과 초당 신호 변화 속도를 따로 고르세요. 숫자는 아직 보지 말고 먼저 예상해요.
- **learnerAction:** `moduleCount:1|2`, `rateGtPerSec:32|64` independently change; each toy module is explicitly 16 one-bit lanes, per-direction symbols carry exactly 1 bit for toy (no PAM / encoding or package tax model). Draw 1 vs 2 x16 bundles between compute and IO chiplets, and **do not draw fiber, motherboard PCIe cable**. Qualitatively distinguish on-package 2D/2.5D/3D package; UCIe spec physical package variants are not UI 2.5D artwork.
- **modelInputs/modelOutputs (typed, toy only):** `modelInputs:{moduleCount:1|2,rateGtPerSec:32|64}`, constants `lanesPerToyModule=16,bitsPerTransferPerLane=1`; `rawGbpsOneDirection=moduleCount*16*rateGtPerSec`, `rawGBperSecond=rawGbpsOneDirection/8`, `payloadGBperSecond:'NOT_MEASURED'`; 1×32→512Gb/s=64GB/s,1×64→1024Gb/s=128GB/s,2×32→1024Gb/s=128GB/s,2×64→2048Gb/s=256GB/s. Both forward/reverse independent capacities NOT summed, protocol overhead/retry/link efficiency ignored. Real PHY organization/module count depends package/spec profile; hypothetical aggregate bundles, not certified UCIe module mapping.
### ② 관찰·이유 검사 뒤에만 보이는 교사용 내용
- **expectedObservation (teacher-only):** x16 가상 묶음 하나,32GT/s라면 원시 전송 상한은512Gb/s, 즉 단방향64GB/s예요. 두 묶음과64GT/s라면2,048Gb/s 또는256GB/s이지만 이 숫자가 소프트웨어의 전송 속도라는 뜻은 아니에요.
- **teacherExpectedAnswer (guarded):** x16 가상 묶음 하나,32GT/s라면 원시 전송 상한은512Gb/s, 즉 단방향64GB/s예요. 두 묶음과64GT/s라면2,048Gb/s 또는256GB/s이지만 이 숫자가 소프트웨어의 전송 속도라는 뜻은 아니에요.
- **correctIncorrectCriteria:** 두 축 각각 조작하고 1×32의64 GB/s vs2×64의256 GB/s, Gb/s vs GB/s, payload NOT_MEASURED를 WHY로 설명한다.
- **misconceptions/m1:** 64GT/s라면 소프트웨어는 반드시64GB/s로 전송한다.
- **misconceptionFeedback/m1 (guarded):** GT/s는 lane당 전송 속도 개념이에요. lane 묶음 수와 한 전송당 비트, 부가 정보 등을 따로 확인해야 해요.
- **misconceptions/m2:** 묶음이 두 개면 유효 payload도 현실에서 무조건 정확히 두 배다.
- **misconceptionFeedback/m2 (guarded):** 실제 데이터는 링크 훈련, encoding, credit, protocol overhead, retry, 시스템 병목의 영향을 받아요. 이 장면은 원시 상한만 계산했어요.
- **misconceptions/m3:** 여기에서 칩 사이 2.5D 패키징은 웹 화면의 2.5D 그림 효과와 같은 뜻이다.
- **misconceptionFeedback/m3 (guarded):** 산업의 2.5D는 인터포저 기반 물리적 패키징을 뜻하고, 학생용 2.5D 그림 스타일과 달라요.
- **hint L1 (on-demand):** GB/s는 몇 bit/s를 8로 나눈 것일까요?
- **hint L2 (on-demand):** 16개 lane 각각32G 단방향 전송을 가정해요.
- **hint L3 (on-demand):** 묶음 수 × 16 lane × GT/s ÷ 8을 계산해요.
- **feedback/correct (guarded):** 두 실제 독립 입력 변경, 관찰 데이터와 WHY의 인과 설명을 확인했습니다. 계산은 장면 가정 안에서만 성립하며, 산업 장비 실증이 아닙니다.
- **displayTextAfterObservation (guarded):** x16 가상 묶음 하나,32GT/s라면 원시 전송 상한은512Gb/s, 즉 단방향64GB/s예요. 두 묶음과64GT/s라면2,048Gb/s 또는256GB/s이지만 이 숫자가 소프트웨어의 전송 속도라는 뜻은 아니에요.
- **speechTextAfterObservation (guarded):** 16개 레인을 한 묶음으로 정하고32기가전송씩 보내면, 원시 데이터 상한은 초당64기가바이트예요. 하지만 실제 앱이 얻는 처리량과는 달라요.
### ③ A07 검수 / 구현 보호 규칙
- **physicsAssumptions:** classroom toy original, no commercial silicon/physical link certification, no full electrical/thermal budget, no security authorization or low-level safety equipment. Source [R1][R2].
- **negativePathTest:** After prediction but BEFORE controls/observe, teacher text+numeric readout+correct explanation/ARIA/Voice remain hidden. Must use 2 independent changed actual controls; select concept answer early or only change default/one control => no pass. m1/m2/m3 feedback different and not generic; correct-first allowed. Revisit after grade must RESET and preserve previous trial evidence. Exact scene-specific NOT_RUN/NOT_MEASURED states cannot be silently shown as numeric0 or successful.
- **nextHook:** 다음에는 양 끝 칩렛이 지원하는 속도를 비교해 볼까요?

## 28-S02 · `ucie-die-link-speed-negotiation` · 새 칩과 옛 칩을 섞으면 언제나 더 빠른 쪽으로 연결될까요?
### ① 예측 전 학생 원고 (결과·정답·숫자 선노출 금지)
- **sceneId:** `ucie-die-link-speed-negotiation`
- **learningGoal:** 양쪽 칩렛이 공통으로 지원하는 최고 toy GT/s를 계산하고 스펙 세대 호환 문구와 실제 PHY link training 성공을 구분한다.
- **priorKnowledge:** 29 lane/training,13 rate units
- **storyHook:** 하나는64GT/s까지 되고 다른 하나는32GT/s까지만 된다면, 연결 뒤 링크는 어느 속도로 달릴까요?
- **question:** 새 칩과 옛 칩을 섞으면 언제나 더 빠른 쪽으로 연결될까요?
- **predictionPrompt (student-only):** 동일한 보안·전기·프로토콜 조건을 만족한다는 가정 아래 한쪽이64, 다른 쪽이32라면 무엇이 병목일까요?
- **displayTextBeforePrediction:** 예측을 먼저 선택한 뒤 실험 도크에서 서로 다른 두 조건을 실제로 조작해 보세요.
- **speechTextBeforePrediction (Korean neutral):** 양쪽 칩렛이 지원하는 최대 전송률을 따로 바꿔요. 같은 UCIe 표준 이름만으로 통신이 자동 성공하는지는 생각해 보세요.
- **learnerAction:** Independently change `leftMaxGtPerSec:32|64`, `rightMaxGtPerSec:32|64` and explicit student `ATTEMPT_TRAIN` after predictive selection. Model assumes their supported discrete rates are nested sets {32} or {32,48,64} for illustrative endpoints; real package/electrical/protocol compatibility is untested.
- **modelInputs/modelOutputs (typed, toy only):** `modelInputs:{leftMaxGtPerSec:32|64,rightMaxGtPerSec:32|64}`, `commonToyRateGtPerSec=Math.min(leftMaxGtPerSec,rightMaxGtPerSec)`, `preTrainState='NOT_TRAINED'` and after `ATTEMPT_TRAIN` with fixed toy compatible package & protocol `state='TOY_LINK_TRAINED'`; left64/right32⇒32;64/64⇒64;32/64⇒32;32/32⇒32. Do not infer actual UCIe silicon PHY implementation, interoperability certification, universal 48/64 availability, or autonomous successful link training from advertised standard names.
### ② 관찰·이유 검사 뒤에만 보이는 교사용 내용
- **expectedObservation (teacher-only):** 가상 양쪽이 같은 전기 조건에서 협상하고 한쪽만32GT/s를 지원하면 공통 속도는32GT/s예요. 하지만 실제 링크 훈련 성공과 보장되는 시스템 대역폭은 다른 검증이에요.
- **teacherExpectedAnswer (guarded):** 가상 양쪽이 같은 전기 조건에서 협상하고 한쪽만32GT/s를 지원하면 공통 속도는32GT/s예요. 하지만 실제 링크 훈련 성공과 보장되는 시스템 대역폭은 다른 검증이에요.
- **correctIncorrectCriteria:** 두 endpoint cap을 각각 변경하고 separate ATTEMPT_TRAIN real trial. Cases64|32=>32 and64|64=>64, pre-train NOT_TRAINED guard, explains spec adoption≠silicon interoperability guarantee.
- **misconceptions/m1:** 64GT/s 가능한 칩을 한쪽에 썼으니 무조건64GT/s로 통신한다.
- **misconceptionFeedback/m1 (guarded):** 두 끝의 공통 지원 조건으로 동작률을 정해야 해요. 한쪽이32만 지원하면 이 가상 협상값은32예요.
- **misconceptions/m2:** 서로 다른 세대라도 backward compatible이라는 홍보 문구가 있으면 보드에서 언제나 훈련에 성공한다.
- **misconceptionFeedback/m2 (guarded):** 표준의 설계상 역호환성은 실제 패키지 배선/PHY/프로토콜/모듈 구성/실리콘 인증과 동일하지 않아요.
- **misconceptions/m3:** 훈련 버튼을 누르기 전에도 설정 최고속도가 실제 측정된 속도다.
- **misconceptionFeedback/m3 (guarded):** 설정/광고 숫자와 실제 이벤트를 구별해요. 누르기 전은 NOT_TRAINED이고 성공은 이 가상 fixture 상태예요.
- **hint L1 (on-demand):** 양 끝에서 동시에 가능한 속도의 교집합을 생각해요.
- **hint L2 (on-demand):** 왼쪽64,오른쪽32의 공통 최대값은 무엇일까요?
- **hint L3 (on-demand):** 훈련은 한 번의 실제 사건으로 기록하고 입력을 바꾸려면 새 trial로 넘겨요.
- **feedback/correct (guarded):** 두 실제 독립 입력 변경, 관찰 데이터와 WHY의 인과 설명을 확인했습니다. 계산은 장면 가정 안에서만 성립하며, 산업 장비 실증이 아닙니다.
- **displayTextAfterObservation (guarded):** 가상 양쪽이 같은 전기 조건에서 협상하고 한쪽만32GT/s를 지원하면 공통 속도는32GT/s예요. 하지만 실제 링크 훈련 성공과 보장되는 시스템 대역폭은 다른 검증이에요.
- **speechTextAfterObservation (guarded):** 두 칩렛 사이의 공통 전송률은 느린 쪽 지원 한도를 넘을 수 없어요. 링크 성공 여부는 별도 훈련과 검증이 필요합니다.
### ③ A07 검수 / 구현 보호 규칙
- **physicsAssumptions:** classroom toy original, no commercial silicon/physical link certification, no full electrical/thermal budget, no security authorization or low-level safety equipment. Source [R1][R3].
- **negativePathTest:** After prediction but BEFORE controls/observe, teacher text+numeric readout+correct explanation/ARIA/Voice remain hidden. Must use 2 independent changed actual controls; select concept answer early or only change default/one control => no pass. m1/m2/m3 feedback different and not generic; correct-first allowed. Revisit after grade must RESET and preserve previous trial evidence. Exact scene-specific NOT_RUN/NOT_MEASURED states cannot be silently shown as numeric0 or successful.
- **nextHook:** 길이 연결된 뒤에는 어떤 프로토콜로 요청을 보낼까요?

## 28-S03 · `ucie-raw-stream-cxl-semantic-mapping` · 길이 빠르다고 CPU의 메모리를 아무렇게나 읽어도 될까요?
### ① 예측 전 학생 원고 (결과·정답·숫자 선노출 금지)
- **sceneId:** `ucie-raw-stream-cxl-semantic-mapping`
- **learningGoal:** 물리 UCIe 링크와 그 위의 Raw/Streaming 전송 및 CXL.cache 메모리 일관성 의미를 구분하고 프로토콜 미협상 상태를 성공으로 세지 않는다.
- **priorKnowledge:** 29 CXL/PCIe,05 cache,13 units
- **storyHook:** 센서 데이터를 연속 보낼 때와 CPU 캐시가 메모리 일관성을 확인할 때, 둘 다 같은 데이터 길만 있으면 될까요?
- **question:** 길이 빠르다고 CPU의 메모리를 아무렇게나 읽어도 될까요?
- **predictionPrompt (student-only):** 하드웨어 링크가 물리적으로 연결되어도 위에서 보낼 데이터의 뜻과 상대 프로토콜이 맞지 않으면 어떻게 될지 예상해요.
- **displayTextBeforePrediction:** 예측을 먼저 선택한 뒤 실험 도크에서 서로 다른 두 조건을 실제로 조작해 보세요.
- **speechTextBeforePrediction (Korean neutral):** 모드와 보내려는 데이터 요청을 따로 선택해 보세요. 단순 전송이 캐시 공유를 자동으로 허용할까요?
- **learnerAction:** `negotiatedProtocol:'RAW_STREAM'|'CXL_CACHE'`, `requestKind:'SENSOR_STREAM'|'COHERENT_CACHE_READ'` two independent typed inputs, explicit `SEND_REQUEST` event required to record an attempted transfer. `RAW_STREAM` matches SENSOR_STREAM only; `CXL_CACHE` matches coherent cache-read only in this one-protocol-at-a-time classroom fixture. Unsupported mismatch: `PROTOCOL_NOT_CONFIGURED`, not a measured latency/failure rate. CXL.cache semantic illustrative; real stack capabilities, address mapping, permission and actual response not guaranteed.
- **modelInputs/modelOutputs (typed, toy only):** `modelInputs:{negotiatedProtocol:'RAW_STREAM'|'CXL_CACHE',requestKind:'SENSOR_STREAM'|'COHERENT_CACHE_READ'}`; match exactly paired modes ⇒ `toyDisposition:'PROTOCOL_ROUTE_POSSIBLE'`; unmatched ⇒`'PROTOCOL_NOT_CONFIGURED'`; even a match `realMemoryAccess:'NOT_VERIFIED'`, `authorization:'NOT_VERIFIED'`, `coherencyProtocolImplementation:'NOT_VERIFIED'`. Before SEND_REQUEST `transferObservation:'NOT_RUN'` always. This minimal controlled router is *not* the full UCIe/CXL architecture: UCIe can transport multiple negotiated protocols in fuller stacks and CXL.io/mem differ from CXL.cache.
### ② 관찰·이유 검사 뒤에만 보이는 교사용 내용
- **expectedObservation (teacher-only):** UCIe는 패키지 안의 전기적 길을 표준화해요. 길 위에 어떤 언어를 얹을지는 별도예요. 단순 Raw 스트림 통로만으로 CPU 캐시의 일관성 읽기가 보장되지는 않아요.
- **teacherExpectedAnswer (guarded):** UCIe는 패키지 안의 전기적 길을 표준화해요. 길 위에 어떤 언어를 얹을지는 별도예요. 단순 Raw 스트림 통로만으로 CPU 캐시의 일관성 읽기가 보장되지는 않아요.
- **correctIncorrectCriteria:** Both protocol and request axes changed with explicit SEND_REQUEST snapshots; one coherent pair, one incompatible pair; old event not retro-rewritten by later toggle; explains phys link≠CXL semantics.
- **misconceptions/m1:** UCIe 물리 링크만 되면 CXL.cache의 공유 메모리 의미를 자동 보장한다.
- **misconceptionFeedback/m1 (guarded):** 전기적 링크와 프로토콜 협상 및 캐시 일관성 구현은 다른 층이에요.
- **misconceptions/m2:** Raw Mode로 센서 스트림을 보내면 CPU 캐시의 일관성 있는 읽기 권한도 같이 생긴다.
- **misconceptionFeedback/m2 (guarded):** 연속 바이트 스트림은 CXL.cache 트랜잭션/권한/코히어런시 의미와 동일하지 않아요.
- **misconceptions/m3:** CXL.cache를 선택했다면 주소 변환, 메모리 접근 제어, 제품 속도도 이미 인증되었다.
- **misconceptionFeedback/m3 (guarded):** 이 장면은 모드-요청 호환성만 보여줘요. 실제 인터페이스, 접근권한, PCIe/CXL 시스템 인증은 별도예요.
- **hint L1 (on-demand):** 길과 길을 통해 보내는 의미를 별도로 구분해요.
- **hint L2 (on-demand):** Raw 스트림과 cache coherent request 중 어느 쌍이 맞을까요?
- **hint L3 (on-demand):** 맞아도 메모리 접근 권한까지 증명했는지 확인해요.
- **feedback/correct (guarded):** 두 실제 독립 입력 변경, 관찰 데이터와 WHY의 인과 설명을 확인했습니다. 계산은 장면 가정 안에서만 성립하며, 산업 장비 실증이 아닙니다.
- **displayTextAfterObservation (guarded):** UCIe는 패키지 안의 전기적 길을 표준화해요. 길 위에 어떤 언어를 얹을지는 별도예요. 단순 Raw 스트림 통로만으로 CPU 캐시의 일관성 읽기가 보장되지는 않아요.
- **speechTextAfterObservation (guarded):** 칩렛을 잇는 UCIe는 전기적 연결이고, CXL 캐시 일관성은 위에 얹힌 별도 프로토콜 의미예요. 모드가 맞아야 요청을 해석할 수 있어요.
### ③ A07 검수 / 구현 보호 규칙
- **physicsAssumptions:** classroom toy original, no commercial silicon/physical link certification, no full electrical/thermal budget, no security authorization or low-level safety equipment. Source [R1][R4][R5].
- **negativePathTest:** After prediction but BEFORE controls/observe, teacher text+numeric readout+correct explanation/ARIA/Voice remain hidden. Must use 2 independent changed actual controls; select concept answer early or only change default/one control => no pass. m1/m2/m3 feedback different and not generic; correct-first allowed. Revisit after grade must RESET and preserve previous trial evidence. Exact scene-specific NOT_RUN/NOT_MEASURED states cannot be silently shown as numeric0 or successful.
- **nextHook:** 깨진 데이터가 생기면 어떻게 재확인할까요?

## 28-S04 · `ucie-d2d-error-detection-retry-event` · 한 번 깨진 데이터가 보였다고 자동으로 복구된 걸까요?
### ① 예측 전 학생 원고 (결과·정답·숫자 선노출 금지)
- **sceneId:** `ucie-d2d-error-detection-retry-event`
- **learningGoal:** 손상된 첫 전송과 재시도 기능 설정을 독립 제어하고 CRC 감지→재요청→확인 상태를 이벤트별 불변 기록으로 구분한다.
- **priorKnowledge:** 29 reliability,13 proportions
- **storyHook:** 칩 사이에 보낸 비트 묶음이 변형되었어요. 오류를 봤다는 것과 데이터를 안전하게 다시 받았다는 건 다르죠.
- **question:** 한 번 깨진 데이터가 보였다고 자동으로 복구된 걸까요?
- **predictionPrompt (student-only):** 첫 데이터 묶음이 깨졌는데 재시도 기능이 꺼져 있으면 수신을 성공으로 표시해도 될지 예상해 봐요.
- **displayTextBeforePrediction:** 예측을 먼저 선택한 뒤 실험 도크에서 서로 다른 두 조건을 실제로 조작해 보세요.
- **speechTextBeforePrediction (Korean neutral):** 첫 전송 손상 여부와 재전송 설정을 따로 바꾸고, 보내는 버튼을 눌러야 실제 사건을 관찰해요.
- **learnerAction:** `firstFlitCorrupt:boolean` and `adapterRetryConfigured:boolean` separate controls; student `SEND_FIRST_FLIT` event records immutable snapshot, `ATTEMPT_RETRY` only active if retry configured and corruption detected. Toy oracle assumes error detected with certainty; first-flit clean ⇒ DELIVERED, corrupt+no retry ⇒ DETECTED_UNRECOVERED, corrupt+retry ⇒ RETRY_PENDING and **NOT DELIVERED** until ATTEMPT_RETRY; retry event synthetic second clean delivery ⇒ DELIVERED_AFTER_RETRY. Post-send changes are CONFIG_LOCKED_RESET_REQUIRED until NEW_TRIAL_RESET. No user traffic, no real channel BER/FIT or UCIe CRC specifics derived from this deterministic example.
- **modelInputs/modelOutputs (typed, toy only):** `modelInputs:{firstFlitCorrupt:boolean,adapterRetryConfigured:boolean}`; `phase:'CONFIGURE'|'FIRST_OBSERVED'|'RETRY_PENDING'|'FINAL'|'RESET_REQUIRED'`, `trialId:number`, immutable `firstEvent:{trialId,inputSnapshot,detectedCorruption,disposition}`, `retryEvent?:{trialId,outcome:'TOY_SECOND_FLIT_CLEAN'}`; first clean ⇒ `status='DELIVERED'`,first corrupt retry false⇒`'DETECTED_UNRECOVERED'`,first corrupt retry true⇒`'RETRY_PENDING'`,second explicitly attempted⇒`'DELIVERED_AFTER_RETRY'`. Counters `repairCount=1` only if actual retry event occurred. No A05 invented auto-grade on flipping retry flag, no grade if not sent.
### ② 관찰·이유 검사 뒤에만 보이는 교사용 내용
- **expectedObservation (teacher-only):** CRC 같은 오류 확인은 문제를 알아챌 수 있는 장치예요. 재시도할 준비가 되어 있어도 실제 재송신 전에는 성공이 아니에요. 이 수업에서는 다시 보낸 두 번째 가상 묶음만 정상이 되도록 설정했어요.
- **teacherExpectedAnswer (guarded):** CRC 같은 오류 확인은 문제를 알아챌 수 있는 장치예요. 재시도할 준비가 되어 있어도 실제 재송신 전에는 성공이 아니에요. 이 수업에서는 다시 보낸 두 번째 가상 묶음만 정상이 되도록 설정했어요.
- **correctIncorrectCriteria:** Actual first SEND and independent toggles and explicit retry event. Show corrupt with retry disabled -> DETECTED_UNRECOVERED, with enabled -> RETRY_PENDING until user ATTEMPT_RETRY, then toy delivered; demonstrate reset preserves prior trial. Correct-first allowed.
- **misconceptions/m1:** 오류를 탐지했다면 원래 데이터가 이미 정확히 고쳐졌다는 뜻이다.
- **misconceptionFeedback/m1 (guarded):** 탐지는 발견이고 복구는 별도의 재전송·수신 확인 절차예요.
- **misconceptions/m2:** 재시도 사용 설정이 켜졌으니 데이터 전송 전에 이미 100% 성공이다.
- **misconceptionFeedback/m2 (guarded):** 설정 플래그만으로 관찰 사건은 생기지 않아요. 실제 첫 전송과 필요한 재시도 이벤트를 실행해야 해요.
- **misconceptions/m3:** 한 번 실험한 뒤 오류 설정을 바꾸면 이전 전송의 성공/실패 기록도 새 값으로 바뀌어야 한다.
- **misconceptionFeedback/m3 (guarded):** 이전 사건은 불변 스냅샷이에요. 다른 조건을 보려면 새 trial을 만들고 다시 전송해야 해요.
- **hint L1 (on-demand):** 오류 감지와 오류 정정을 분리해요.
- **hint L2 (on-demand):** 손상+retryEnabled면 왜 RETRY_PENDING일까요?
- **hint L3 (on-demand):** 재전송 버튼으로 *두 번째* 실제 이벤트가 발생했는지 확인해요.
- **feedback/correct (guarded):** 두 실제 독립 입력 변경, 관찰 데이터와 WHY의 인과 설명을 확인했습니다. 계산은 장면 가정 안에서만 성립하며, 산업 장비 실증이 아닙니다.
- **displayTextAfterObservation (guarded):** CRC 같은 오류 확인은 문제를 알아챌 수 있는 장치예요. 재시도할 준비가 되어 있어도 실제 재송신 전에는 성공이 아니에요. 이 수업에서는 다시 보낸 두 번째 가상 묶음만 정상이 되도록 설정했어요.
- **speechTextAfterObservation (guarded):** 손상된 전송을 탐지해도 실제로 다시 보내고 확인하기 전엔 성공이라고 할 수 없어요. 재시도는 별도 사건으로 기록해야 해요.
### ③ A07 검수 / 구현 보호 규칙
- **physicsAssumptions:** classroom toy original, no commercial silicon/physical link certification, no full electrical/thermal budget, no security authorization or low-level safety equipment. Source [R6][R1].
- **negativePathTest:** After prediction but BEFORE controls/observe, teacher text+numeric readout+correct explanation/ARIA/Voice remain hidden. Must use 2 independent changed actual controls; select concept answer early or only change default/one control => no pass. m1/m2/m3 feedback different and not generic; correct-first allowed. Revisit after grade must RESET and preserve previous trial evidence. Exact scene-specific NOT_RUN/NOT_MEASURED states cannot be silently shown as numeric0 or successful.
- **nextHook:** 데이터를 더 빨리 보내는 데 전력은 얼마나 들까요?

## 28-S05 · `ucie-link-data-power-tradeoff` · 더 빠른 칩렛 링크가 반드시 더 적은 전기를 쓸까요?
### ① 예측 전 학생 원고 (결과·정답·숫자 선노출 금지)
- **sceneId:** `ucie-link-data-power-tradeoff`
- **learningGoal:** 전송 속도와 단위 비트당 에너지를 독립 변경해 활성 PHY 데이터 에너지율을 계산하고 전원/냉각 전체 전력과 구분한다.
- **priorKnowledge:** 12 P=energy/time,13 pJ/bit,31 power/thermal
- **storyHook:** 같은 연결에서 비트 하나를 보내는 에너지를 줄여도 1초에 보내는 비트 수가 두 배가 되면 총 소비 전력은 어떻게 될까요?
- **question:** 더 빠른 칩렛 링크가 반드시 더 적은 전기를 쓸까요?
- **predictionPrompt (student-only):** 가상 x16 묶음에서32GT/s의 1pJ/bit와64GT/s의 .5pJ/bit 중 어느 쪽이 활성 데이터 전력을 더 쓸지 예상해요.
- **displayTextBeforePrediction:** 예측을 먼저 선택한 뒤 실험 도크에서 서로 다른 두 조건을 실제로 조작해 보세요.
- **speechTextBeforePrediction (Korean neutral):** 전송 속도와 비트 하나의 전송 에너지는 다른 조작이에요. 두 숫자를 따로 바꿔서 비교하세요.
- **learnerAction:** `rateGtPerSec:32|64`, `energyPjPerBit:0.5|1` separate. Fixed single x16 hypothetical unidirectional no idle, one bit/transfer per lane, active always, no protocol retry/clock/shared SerDes overhead. Visual draw energy flow at lane-level and a separate grey not-measured package thermal box. Energies are made-up examples, not UCIe 3.0 pJ/b spec target or actual chip.
- **modelInputs/modelOutputs (typed, toy only):** `modelInputs:{rateGtPerSec:32|64,energyPjPerBit:0.5|1}`; `bitsPerSec=16*rateGtPerSec*1e9`; `toyActiveDataW=bitsPerSec*energyPjPerBit*1e-12`; (32,.5)→.256W,(32,1)→.512W,(64,.5)→.512W,(64,1)→1.024W. `packageTotalPower:'NOT_MEASURED'`, `trueThermalJunction:'NOT_MEASURED'`, `realPjPerBit:'NOT_MEASURED'`. If speed doubles at fixed energy/bit, toy active data W doubles; if energy/bit halves while speed doubles, W unchanged.
### ② 관찰·이유 검사 뒤에만 보이는 교사용 내용
- **expectedObservation (teacher-only):** 가상 데이터 비트당 1피코줄이 필요하고16개 길이에서32기가전송씩 보내면 활성 데이터 전력은0점512와트예요. 더 빠르면서 비트당 에너지가 절반이면0점512와트로 같을 수도 있어요.
- **teacherExpectedAnswer (guarded):** 가상 데이터 비트당 1피코줄이 필요하고16개 길이에서32기가전송씩 보내면 활성 데이터 전력은0점512와트예요. 더 빠르면서 비트당 에너지가 절반이면0점512와트로 같을 수도 있어요.
- **correctIncorrectCriteria:** Both GT/s and pJ/bit independently changed, prove two equal-power countercases (32,1) and(64,.5)→.512W, reject full package savings assertion.
- **misconceptions/m1:** 64GT/s는32GT/s의 두 배이니 비트당 에너지가 낮아져도 항상 절대 전력이 두 배다.
- **misconceptionFeedback/m1 (guarded):** 활성 데이터 전력은 실제 전송 비트 수×비트당 에너지예요. 두 축이 함께 바뀌면 결론도 달라져요.
- **misconceptions/m2:** 0.5pJ/bit라는 라벨은 UCIe3.0 실리콘 전력 실측치다.
- **misconceptionFeedback/m2 (guarded):** 이 값은 수업용 독립 모형 수치예요. 특정 PHY 설계/공정/패키지 데이터는 따로 검증해야 해요.
- **misconceptions/m3:** 활성 lane의 모델 소비 전력이0.512W면 패키지 전체 전력·열·냉각도0.512W로 확정이다.
- **misconceptionFeedback/m3 (guarded):** 클록/idle/회로 주변부·전압 변환·냉각 등은 장면에 포함되지 않았어요.
- **hint L1 (on-demand):** 초당 비트 수를 먼저 구해요.
- **hint L2 (on-demand):** pJ는10의 마이너스12승 줄이에요.
- **hint L3 (on-demand):** W = bit/s × J/bit예요. 16×32G×1pJ=0.512W.
- **feedback/correct (guarded):** 두 실제 독립 입력 변경, 관찰 데이터와 WHY의 인과 설명을 확인했습니다. 계산은 장면 가정 안에서만 성립하며, 산업 장비 실증이 아닙니다.
- **displayTextAfterObservation (guarded):** 가상 데이터 비트당 1피코줄이 필요하고16개 길이에서32기가전송씩 보내면 활성 데이터 전력은0점512와트예요. 더 빠르면서 비트당 에너지가 절반이면0점512와트로 같을 수도 있어요.
- **speechTextAfterObservation (guarded):** 같은 가상 전송로에서 비트당 에너지가 절반이어도 속도를 두 배 높이면 활성 데이터 전력이 같을 수 있어요. 패키지 전체 전력은 별도예요.
### ③ A07 검수 / 구현 보호 규칙
- **physicsAssumptions:** classroom toy original, no commercial silicon/physical link certification, no full electrical/thermal budget, no security authorization or low-level safety equipment. Source [R1][R7].
- **negativePathTest:** After prediction but BEFORE controls/observe, teacher text+numeric readout+correct explanation/ARIA/Voice remain hidden. Must use 2 independent changed actual controls; select concept answer early or only change default/one control => no pass. m1/m2/m3 feedback different and not generic; correct-first allowed. Revisit after grade must RESET and preserve previous trial evidence. Exact scene-specific NOT_RUN/NOT_MEASURED states cannot be silently shown as numeric0 or successful.
- **nextHook:** 다음 단계는 완성된 링크를 실제 AI 시스템의 전력·열·보안 병목과 이어 보세요.

## A06 source author self-QA · NOT A07 independent sign-off
- [x] Exactly 5 original Scene IDs, 5 Korean Before Voice without teacher values, 5 gated After Teacher Voice, 15 independently keyed misconception m1/m2/m3 and 5×3 hints, two independent typed model controls each, 5 goal/prediction/obs/WHY+next hooks. First correct accepted; after graded new conditions require new trial, prior evidence immutable.
- [x] Numerics self-check: 16 lanes*32GT/s/8→64GB/s; 2×16*64/8→256GB/s **raw one-direction bound only**. Link min(64,32)→32 GT/s only in nested toy shared support. Raw-vs-CXL mismatch **PROTOCOL_NOT_CONFIGURED**; SEND_REQUEST needed to claim observation; not actual CXL authorization. CRC detect≠retry success; damaged first with retry gives RETRY_PENDING pending actual ATTEMPT_RETRY; no auto delivered. Toy 16 lanes*32Gbit/s×1pJ/bit=.512W, 64G*.5pJ similarly .512W, total package power NOT_MEASURED.
- [ ] **P1 NEXT:A07 FIRST independent source physics+pedagogy review** original + senior exact SHA to [#74](https://github.com/Junebooky/interactive-engineering/issues/74) and A06 #6: check consortium3.0 **2025** published rates vs product claim, x16 aggregate arithmetic, 32/64 per-endpoint negotiation toy, Raw/Streaming↔CXL semantics, retry event state, pJ/bit power. Also five-gate/15 wrong/Voice and full DOM source leak contract. Return science+EDU_SOURCE_PASS_SOURCE or actionable MAJOR with SHAs. [ ] A06 fix MAJOR and only after PASS direct A05#4 source STORY_READY.
- [ ] **NEXT:A05** 5 real 2.5D scenes + 15 browser negative cases and original React/TS/SVG/typed AST, 1440+390+375+320, keyboard/Voice/ARIA/reduced-motion/CI/screens; A02 official app E2E separately. [ ] Owner physical chiplet link/SiP interoperability, native Safari, students, audible TTS, main merge/deploy HOLD.
- [ ] **P2 A06 next:** 30 photonics/CPO research; separate 24 source A07 FIRST QA pending [#66](https://github.com/Junebooky/interactive-engineering/issues/66). Lesson23 independently source-PASS and A05 direct already [#64](https://github.com/Junebooky/interactive-engineering/issues/64).

## 공공 원문·표준/기술 링크 · checked 2026-10-18
- [R1] UCIe Consortium [Official UCIe 3.0 specifications and highlighted rates](https://www.uciexpress.org/specifications); standard *released August 5, 2025* per [official press releases](https://www.uciexpress.org/press-releases). Actual full detailed licensed standard text NOT exhaustively verified (highlights read).
- [R2] Consortium [UCIe3.0 detailed public feature article](https://www.uciexpress.org/post/ucie-3-0-specification-redefining-chiplet-interconnects), [webinar 2025](https://www.uciexpress.org/webinars) spec supports 48/64 GT/s, advanced package/manageability changes.
- [R3] UCIe Consortium [Specifications v2/3 compatibility statements](https://www.uciexpress.org/specifications); backward-compat support ≠ actual interoperability verified.
- [R4] CXL Consortium [Introduction to CXL](https://computeexpresslink.org/blog/introduction-to-compute-express-link-cxl-the-cpu-to-device-interconnect-breakthrough-2313/) explains CXL.io vs CXL.cache vs CXL.memory; CXL standard-version semantic categories not automatically built in all UCIe PHY instances.
- [R5] CXL Consortium [CXL memory/coherency use cases](https://computeexpresslink.org/blog/compute-express-link-1-1-specification-now-available-to-members-2339/) and [security scope](https://computeexpresslink.org/blog/integrity-and-data-encryption-ide-trends-and-verification-challenges-in-cxl-compute-express-link-2797/); protocol/permissions/IDE never inferred from link-only toy.
- [R6] UCIe Consortium [2.0/3.0 feature overview](https://www.uciexpress.org/specifications), D2D adapter error detection/retry educational context; no actual CRC polynomial/FIT rate or repair claim tested.
- [R7] UCIe Consortium [2025 feature article power/runtime recalibration](https://www.uciexpress.org/post/ucie-3-0-specification-redefining-chiplet-interconnects). Toy0.5/1pJ/bit are independent hypothetical numbers, NOT standards targets / PPA measurements.
