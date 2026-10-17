# 21 · AI 기억창고를 짓자: KV-cache → PagedAttention → 양자화 → CPU 오프로딩 → prefix 재사용·보안
> **A06 five original learner-first 2.5D storyboards SOURCE_AUTHOR_DONE / NEXT:A07 INDEPENDENT SOURCE_REVIEW**, date 2026-10-18 KST. [Senior official source register vLLM/HuggingFace/NVIDIA/2023 paper](../deep-dives/21-llm-kv-paged-quant-offload-security.md), [pipeline issue #59](https://github.com/Junebooky/interactive-engineering/issues/59). Prior **22 authored lessons/98 Step** + NEW 21/5 = **23 authored lessons/103 Steps**; authored number ≠ A07 PASS, A05 actual 2.5D/Chrome or A02 app complete.
> Pre-req 03 GPU,06 HBM,07 server memory tiers,08 communication,10 LLM prefill/decode,13 binary units & error rates,32 AI SLO; downstream 22 energy supply,32 user TTFT/system SLO, privacy/tenant controls. All cache tensors/block memory/latency/quantization and prefill compute numbers explicitly toy, no measured GPU library performance/quality/security guarantee.

## Pre-/post- Voice and grading contract
- Learner BEFORE stage may see ONLY `storyHook`, `predictionPrompt`, `displayTextBeforePrediction`, `speechTextBeforePrediction` and definitions; computed `teacherExpectedAnswer`, `expectedObservation`, m1/m2/m3 corrective feedback, `displayTextAfterObservation`, `speechTextAfterObservation` **not exposed in DOM/ARIA/TTS until student submitted prediction + at least two genuinely independent controlled test states and WHY**. First answer correct can pass; no forced wrong choice. L1→L2→L3 hints on request only.
- No mutable cached proof after tenant/permission changes, no actual private prompts/timing attacks, and all measurements scoped payload not total GPU/capacity or model output accuracy. Prefix `cache_salt` is NOT tenant security boundary, real isolation requires app auth/gateway or separate instances.

## 21-S01 · `llm-kv-gqa-bytes` · LLM의 기억 노트는 토큰이 늘수록 얼마나 커질까요?
### ① 먼저 예상한 후 조작
- **sceneId:** llm-kv-gqa-bytes
- **learningGoal:** 16층 Transformer에 대해 K/V·KV-head·차원·dtype·토큰 수를 차원 분석해 KV-cache payload 바이트를 구하고 queryHeads와 KV-heads를 혼동하지 않는다.
- **priorKnowledge:** 03 GPU memory bottleneck,06 HBM,13 KiB/MiB,10 prefill/decode
- **storyHook:** AI가 이전 문장을 기억하려고 K와 V를 적어 둔다면, '헤드가 열여섯 개'라는 말만 듣고 메모리를 계산해도 될까요?
- **question:** AI가 이전 문장을 기억하려고 K와 V를 적어 둔다면, '헤드가 열여섯 개'라는 말만 듣고 메모리를 계산해도 될까요?
- **predictionPrompt (learner-only):** 레이어16개와 KV 헤드4개, 차원64, 토큰128개, FP16 값2바이트면 KV 저장공간은 몇 MiB일까요? KV 헤드를8개로 늘리면요?
- **displayTextBeforePrediction:** Query 헤드와 KV 헤드는 같은 숫자일까요?
- **speechTextBeforePrediction:** 토큰 수와 KV 헤드 수를 각각 조절해 보세요. 두 배가 되는 저장 공간을 먼저 예상해 봐요.
- **learnerAction:** Independently manipulate `cachedTokens=128|256` and `kvHeads=4|8` while keeping `numLayers=16`, `queryHeads=16`, `headDim=64`, `bytesPerElement=2`. Show actual *computed* perTokenBytes and MiB after student prediction. Query head count16 is a read-only separate card, NOT substituted for Hkv. For compare require both token and KV-head changes, never weight memory under KV.
- **modelInputs:** `cachedTokens:128|256`, `kvHeads:4|8`; constants `numLayers=16`,`queryHeads=16`,`headDim=64`,`bytesPerElement=2`. `bytesPerToken=2*numLayers*kvHeads*headDim*bytesPerElement`; Hkv4→16384B/token=16KiB, Hkv8→32768B/token=32KiB; `payloadMiB=bytesPerToken*cachedTokens/1048576`. kv4 T128=2MiB,T256=4MiB; kv8 T128=4MiB,T256=8MiB. Total GPU memory/allocator padding, model weights and prefill latency=NOT_PROVEN.
### ② 조작 결과 뒤 교사 단독 답변 및 오개념 교정
- **expectedObservation (teacher-only):** K/V two vectors ×16 layers ×4 KV heads ×64 dims ×2 bytes =16KiB per token, 128 tokens2MiB; 256 tokens4MiB. KV heads8 doubles footprint. Query heads16 do NOT replace KV heads in GQA, model-specific architecture determines memory. Memory weight/activation/metadata unrelated.
- **teacherExpectedAnswer (gated):** K/V two vectors ×16 layers ×4 KV heads ×64 dims ×2 bytes =16KiB per token, 128 tokens2MiB; 256 tokens4MiB. KV heads8 doubles footprint. Query heads16 do NOT replace KV heads in GQA, model-specific architecture determines memory. Memory weight/activation/metadata unrelated.
- **correctIncorrectCriteria:** At least two independent real settings tested (token count and KV head count), calculate 2 vs4 vs8MiB, mention binary MiB and query/KV heads distinction; no universal inference throughput claim.
- **misconceptions:** [m1] GQA에서는 Query 머리가 16개이므로 KV도 무조건 16개로 저장돼요. / [m2] 토큰이 두 배가 되면 KV 저장 메모리는 그대로이고 GPU의 가중치만 늘어요. / [m3] 2MiB는 정확히 2,000,000바이트이며 다른 GPU 메모리는 모두 비어 있어요.
- **hints L1/L2/L3 (on request):** [L1] Key와 Value 두 쌍이 모든 층에서 얼마나 필요할까요? / [L2] 토큰 수는 캐시에 붙는 선형 계수예요. / [L3] 1MiB는 1,048,576바이트예요. 모델 가중치는 별도로 남아 있어요.
- **misconceptionFeedback/m1 (gated):** Grouped-query attention은 Query 헤드와 KV 헤드의 수가 다를 수 있어요. KV 계산엔 `kvHeads`를 쓰세요.
- **misconceptionFeedback/m2 (gated):** 기존 토큰 K/V를 저장해 두므로 같은 구조라면 캐시된 토큰 수에 선형 비례해요.
- **misconceptionFeedback/m3 (gated):** 2MiB는2,097,152바이트예요. 가중치·활성화·할당 패딩도 여전히 존재해요.
- **feedback/correct:** 실제로 두 조건 이상을 달리 실험하고 단위·분모·기술계층의 차이를 WHY로 설명했습니다. 이 수업 숫자는 실제품 성능이나 보안 인증이 아닙니다.
- **displayTextAfterObservation (gated):** 이 toy는 토큰128개·KV헤드4개일 때 KV payload만 2MiB예요.
- **speechTextAfterObservation (gated):** 레이어 열여섯 개, KV 헤드 네 개에 반정밀도 숫자를 저장하면 토큰 백이십팔 개에서 키와 값 캐시가 이 메비바이트예요. 모델 가중치는 따로 필요해요.
### ③ 시니어 물리/시스템 검토 및 차단 사례
- **physicsAssumptions:** Full attention uniform layers, fixed FP16 per KV scalar, no window/padding/allocator/quantization overhead, no measured latency/GPU weight allocation.
- **seniorDesignReview:** GQA queryHeads vs KV heads and per-layer K/V, nonfull attention/sliding windows/prefix blocks, real GPU memory budget pressure and model-specific cache layout.
- **sourceRefs:** [R1][R2][R3]
- **negativePathTest:** correctly keyed m1-m2-m3 must fail with ONLY cause-matched Korean feedback and no teacher answer-before in DOM/ARIA/Voice; correct-first with two genuinely changed typed controls+WHY passes. All capacity/latency/perf/security `NOT_PROVEN` gates are scoped at the evaluated trial; never regrade past event retroactively. A07 independent source pass before A05 real 2.5D browser implementation.
- **nextHook:** 다음 실험에서 GPU 기억창고의 다른 비용을 찾아봐요.

## 21-S02 · `llm-paged-kv-allocator` · 긴 대기줄에 딱 맞는 메모리 칸을 어떻게 줄까요?
### ① 먼저 예상한 후 조작
- **sceneId:** llm-paged-kv-allocator
- **learningGoal:** PagedAttention의 16-token 고정 KV 블록을 길이가 다른 요청에 배정하고 마지막 블록 내 낭비를 수치화하며 전체 고정예약 모형과 실제 논문 성능을 구별한다.
- **priorKnowledge:** 21-S01 KV bytes,13 ceil/division and units,17 memory cache
- **storyHook:** 두 요청은 각각17토큰과31토큰이에요. 64칸을 통째로 미리 예약할까요, 16칸씩 필요한 만큼 나눌까요?
- **question:** 두 요청은 각각17토큰과31토큰이에요. 64칸을 통째로 미리 예약할까요, 16칸씩 필요한 만큼 나눌까요?
- **predictionPrompt (learner-only):** 16칸 블록으로 요청17+31토큰을 보관하면 총 몇 블록을 예약해야 하고 실제 비는 칸은 몇 개인가요?
- **displayTextBeforePrediction:** 여유 슬롯 수와 처리속도는 같은 값일까요?
- **speechTextBeforePrediction:** 열일곱 토큰과 서른한 토큰 요청을 열여섯 칸 블록에 배치해 보고 예약 수와 빈 칸을 예측해 봐요.
- **learnerAction:** Change independently `requestATokens=17|31` and `requestBTokens=17|31`, `blockTokens=16` constant; inspect `ceil(L/16)` per request, page slots and waste. Toggle `displayComparison=fixed64PerRequest|paged16` independently to contrast **two fictional allocator policies** (not vLLM measured benchmark). Provide before results no computed number or other policy's answer.
- **modelInputs:** Typed `requestATokens:17|31`, `requestBTokens:17|31`, `displayComparison:'paged16'|'fixed64PerRequest'`, blockSize16 constant. `useful=LA+LB`; if paged `blocks=ceil(LA/16)+ceil(LB/16)`, `allocated=16*blocks`; if fixed `allocated=2*64` (toy maximum reservation per request). `waste=allocated-useful`,`fractionWaste=waste/allocated`. For17+31 paged blocks2+2=4 ⇒allocated64/useful48/waste16/25%; fixed allocated128/useful48/waste80/62.5%. For31+31 paged64/useful62/waste2/3.125%; for17+17 paged64/useful34/waste30/46.875%. All allocated slots toy, real app QoS/throughput=NOT_PROVEN.
### ② 조작 결과 뒤 교사 단독 답변 및 오개념 교정
- **expectedObservation (teacher-only):** Paged KV blocks can be noncontiguous and on-demand; last page internal slack remains, so17+31 uses4 blocks=64 token slots for48 actual tokens (25% toy waste), hypothetical fixed64/request reserves128 slots (62.5% toy waste). No universal 2–4× speed or zero waste; cache bookkeeping/prompt prefix sharing separate.
- **teacherExpectedAnswer (gated):** Paged KV blocks can be noncontiguous and on-demand; last page internal slack remains, so17+31 uses4 blocks=64 token slots for48 actual tokens (25% toy waste), hypothetical fixed64/request reserves128 slots (62.5% toy waste). No universal 2–4× speed or zero waste; cache bookkeeping/prompt prefix sharing separate.
- **correctIncorrectCriteria:** Change both A and B token length in actual input, compare paged vs fixed reservation with explicit denominators, reject claims page waste0 or real throughput equal allocator capacity ratio.
- **misconceptions:** [m1] PagedAttention을 사용하면 마지막 페이지의 빈 토큰 슬롯까지 완전히 0이 돼요. / [m2] 17토큰 요청은 16칸 블록 하나만 있으면 마지막 한 토큰까지 저장할 수 있어요. / [m3] 가상의 할당 메모리가 절반으로 줄었으면 모든 GPU 작업의 초당 토큰 수도 반드시 두 배예요.
- **hints L1/L2/L3 (on request):** [L1] 17/16을 올림하면 몇 블록일까요? / [L2] 각 요청 마지막 블록은 일부가 비어 있을 수 있어요. / [L3] 저장 용량과 병목 연산/대기시간은 같은 단위가 아니에요.
- **misconceptionFeedback/m1 (gated):** 페이징에도 마지막 블록 내부 단편화가 남을 수 있어요. 0 낭비는 일반 보장이 아니에요.
- **misconceptionFeedback/m2 (gated):** 17개를 16칸에 모두 넣을 수 없으니 두 블록이 필요해요.
- **misconceptionFeedback/m3 (gated):** 메모리 여유가 늘면 배치 기회는 좋아질 수 있지만 연산·네트워크·스케줄에 따라 처리속도는 다르게 나와요.
- **feedback/correct:** 실제로 두 조건 이상을 달리 실험하고 단위·분모·기술계층의 차이를 WHY로 설명했습니다. 이 수업 숫자는 실제품 성능이나 보안 인증이 아닙니다.
- **displayTextAfterObservation (gated):** 필요한 블록만 예약해도 마지막 블록에는 빈 칸이 남을 수 있어요.
- **speechTextAfterObservation (gated):** 이 수업에선 블록 네 개, 총 예순네 칸에 실제 마흔여덟 토큰을 담아요. 낭비 슬롯 열여섯 개는 전체 할당 칸의 사분의 일이죠.
### ③ 시니어 물리/시스템 검토 및 차단 사례
- **physicsAssumptions:** Toy fixed64 slots per request alternative and paged16 allocations without metadata, not published benchmark or exact vLLM memory manager runtime; no measured throughput.
- **seniorDesignReview:** Noncontiguous block table, refcount/eviction, head/tail internal fragmentation, real block size/hybrid attention nuance and variable request batching.
- **sourceRefs:** [R4][R5][R6]
- **negativePathTest:** correctly keyed m1-m2-m3 must fail with ONLY cause-matched Korean feedback and no teacher answer-before in DOM/ARIA/Voice; correct-first with two genuinely changed typed controls+WHY passes. All capacity/latency/perf/security `NOT_PROVEN` gates are scoped at the evaluated trial; never regrade past event retroactively. A07 independent source pass before A05 real 2.5D browser implementation.
- **nextHook:** 다음 실험에서 GPU 기억창고의 다른 비용을 찾아봐요.

## 21-S03 · `llm-kv-int8-error-scope` · KV를 8비트로 줄이면 답이 두 배 빨라질까요?
### ① 먼저 예상한 후 조작
- **sceneId:** llm-kv-int8-error-scope
- **learningGoal:** FP16→가상 INT8 KV payload 절반을 계산하고 scale 별 양자화 오차를 직접 평가하여 모델 품질·속도·전체 GPU 메모리 보장을 금지한다.
- **priorKnowledge:** 21-S01 bytes/token,13 sign and rounding,05 cache precision
- **storyHook:** AI의 기억 노트를 16비트 대신 8비트로 압축하면 언제 득이고 언제 손해일까요?
- **question:** AI의 기억 노트를 16비트 대신 8비트로 압축하면 언제 득이고 언제 손해일까요?
- **predictionPrompt (learner-only):** 128토큰 FP16 KV 2MiB가 이상적인 INT8 payload에선 얼마일까요? 숫자0.26을 0.1 간격으로 반올림하면 정확히 원래대로 복구될까요?
- **displayTextBeforePrediction:** 8비트가 줄이는 건 어떤 메모리일까요?
- **speechTextBeforePrediction:** 토큰 수와 저장 비트를 먼저 바꾼 다음 숫자의 반올림 간격도 조절해 봐요. 어디서 오차가 생길지 예상해 보세요.
- **learnerAction:** Independently choose `cachedTokens=128|256`, `dtype='FP16'|'INT8_TOY'`; and **actual** `scalarX=0.26|0.34` and `quantScale=0.10|0.20`. Inspect conditional memory bytes and `q=round(x/scale)`, dequant and signed error; `INT8_TOY` math can be inspected with both scalar controls; when dtype FP16, scalar quant result shown as comparison-only not actually applied. State explicit metadata/accuracy/speed unknown.
- **modelInputs:** Typed `cachedTokens:128|256`, `dtype:'FP16'|'INT8_TOY'`, `scalarX:.26|.34`, `quantScale:.10|.20`. Fixed kvHeads4,16 layers,headDim64. `payloadMiB=2MiB*(cachedTokens/128)*(dtype==='FP16'?1:0.5)` => FP16 2|4 MiB, theoretical INT8 1|2 MiB ignoring scale/metadata/real kernel. `q=round(scalarX/quantScale)`, `xhat=q*quantScale`, `error=xhat-scalarX`: .26/.1→+.04, .26/.2→−.06, .34/.1→−.04, .34/.2→+.06; no .5 ties. `qualityImpact=NOT_PROVEN`, `totalGPUMemoryReduction=NOT_PROVEN`, `actualLatency=NOT_PROVEN`, backend/version INT8 availability not assumed.
### ② 조작 결과 뒤 교사 단독 답변 및 오개념 교정
- **expectedObservation (teacher-only):** Byte-width half under fixed cache tensor shapes means ideal KV payload half, not full GPU half; scalar precision introduces +/- errors dependent on scale, but a scalar error does not measure model output fidelity. HuggingFace quant cache supported backends/precision vary and short contexts may get slower due overhead.
- **teacherExpectedAnswer (gated):** Byte-width half under fixed cache tensor shapes means ideal KV payload half, not full GPU half; scalar precision introduces +/- errors dependent on scale, but a scalar error does not measure model output fidelity. HuggingFace quant cache supported backends/precision vary and short contexts may get slower due overhead.
- **correctIncorrectCriteria:** Manipulate token and dtype plus x/scale as independent controls, correct toy payload and reconstructed scalar, reject inference that 8-bit always twice throughput or perfect answer fidelity.
- **misconceptions:** [m1] KV를 8비트로 바꾸면 모델 가중치·활성화·전송량까지 항상 절반이 되어서 전체 GPU 메모리도 정확히 절반이에요. / [m2] 비트 수가 작아지면 디코딩 연산이 무조건 가벼워지므로 어떤 짧은 문맥에서도 속도가 빨라요. / [m3] 0.26을 0.1 간격으로 반올림했다가 복원해도 수치 오차는 항상 0이에요.
- **hints L1/L2/L3 (on request):** [L1] 지금 줄인 것이 모델 가중치인가요, KV payload인가요? / [L2] 양자화·역양자화에도 계산과 메타데이터가 들 수 있어요. / [L3] 0.26/0.1을 반올림해 되돌려 볼까요?
- **misconceptionFeedback/m1 (gated):** 가중치와 activation, 관리용 스케일은 지금 계산에 포함되지 않았어요. KV 텐서 payload에 한정된 수치예요.
- **misconceptionFeedback/m2 (gated):** 압축을 풀고 scale을 읽는 비용이 추가돼 짧은 문맥에선 오히려 느릴 수 있어요.
- **misconceptionFeedback/m3 (gated):** 0.26/0.1을3으로 반올림하고0.3으로 복원하면 +0.04의 수치 오차가 남아요.
- **feedback/correct:** 실제로 두 조건 이상을 달리 실험하고 단위·분모·기술계층의 차이를 WHY로 설명했습니다. 이 수업 숫자는 실제품 성능이나 보안 인증이 아닙니다.
- **displayTextAfterObservation (gated):** 토이 KV payload는 절반이지만 실제 출력 품질과 속도는 별도 측정이 필요해요.
- **speechTextAfterObservation (gated):** 반정밀도 KV 이 메비바이트를 8비트로 저장하면 이상적 데이터 부분만 일 메비바이트가 돼요. 메타데이터와 실제 답변 정확도는 따로 확인해야 하죠.
### ③ 시니어 물리/시스템 검토 및 차단 사례
- **physicsAssumptions:** INT8 arithmetic conceptual, backend capability version not implied, no per-group scale overhead, no real model quality/latency data and not model weight quantization.
- **seniorDesignReview:** KV quantized cache backend support and residual FP portion, real dequant kernels and attention accuracy sensitivity, model-specific calibration.
- **sourceRefs:** [R2][R8]
- **negativePathTest:** correctly keyed m1-m2-m3 must fail with ONLY cause-matched Korean feedback and no teacher answer-before in DOM/ARIA/Voice; correct-first with two genuinely changed typed controls+WHY passes. All capacity/latency/perf/security `NOT_PROVEN` gates are scoped at the evaluated trial; never regrade past event retroactively. A07 independent source pass before A05 real 2.5D browser implementation.
- **nextHook:** 다음 실험에서 GPU 기억창고의 다른 비용을 찾아봐요.

## 21-S04 · `llm-kv-cpu-offload-latency` · GPU에서 CPU로 기억을 옮기면 공짜 공간이 생길까요?
### ① 먼저 예상한 후 조작
- **sceneId:** llm-kv-cpu-offload-latency
- **learningGoal:** 가상 GPU 메모리8MiB·비KV 예약4MiB·요청별KV2MiB를 기반으로 CPU 오프로딩의 저장 용량과 단방향 전송지연 하한을 구별한다.
- **priorKnowledge:** 21-S01 KV bytes,07 DDR/CXL tier,08 NIC/PCIe,13 units
- **storyHook:** GPU의 기억 카드가 두 개로 꽉 찼어요. 하나를 CPU에 내려놓으면 새 사용자를 바로 맞을 수 있을까요?
- **question:** GPU의 기억 카드가 두 개로 꽉 찼어요. 하나를 CPU에 내려놓으면 새 사용자를 바로 맞을 수 있을까요?
- **predictionPrompt (learner-only):** GPU8MiB 중 가중치 등4MiB를 이미 쓰고 요청 KV가 각2MiB이면 GPU에 몇 요청이 들어올까요? 2MiB를 초당1GiB로 옮기면 최소 몇 밀리초인가요?
- **displayTextBeforePrediction:** 저장 가능한 요청 수와 동시에 빠르게 처리할 수는 같을까요?
- **speechTextBeforePrediction:** GPU 저장 공간과 CPU 저장 공간을 나눠 담고, 한쪽 이동 비용을 숫자로 계산해 봐요.
- **learnerAction:** Student independently toggles `offloadOneRequest=false|true` and `linkGiBps=1|2` in fictional whole-request-tier model; GPU8MiB, model+other4MiB, each request KV2MiB. With offload, one of 2 old request caches moved to CPU, release one slot and allocate one **new** request on GPU, giving2 GPU-resident cache +1 CPU-resident cache *stored*, not three GPU-active simultaneous attention. Show ideal one-way serial 2MiB/bandwidth bound only when offload=true. No actual host bus or HF layer-cache algorithm.
- **modelInputs:** Typed `offloadOneRequest:boolean`,`linkGiBps:1|2` with constants `gpuBudgetMiB=8`,`modelReservationMiB=4`,`kvPerRequestMiB=2`,`cpuCapacitySufficientToy=true`; `gpuKvCapacityMiB=4`, noOffload `gpuCachedRequests=2`, `cpuCachedRequests=0`, `totalStored=2`, transfer=0. With offload1 and replacement request admitted: `gpuCachedRequests=2`,`cpuCachedRequests=1`,`totalStored=3`, one-way transferTimeMs=(2/1024)/linkGiBps*1000 ⇒1.953125ms at1GiB/s,0.9765625ms at2GiB/s. No other traffic/hardware protocol assumptions. `activeGPUDecodeSlotsGain=NOT_PROVEN`,`actualTTFT=NOT_PROVEN`, `modelWeightsMiB=4 remain`.
### ② 조작 결과 뒤 교사 단독 답변 및 오개념 교정
- **expectedObservation (teacher-only):** Offload can make space but data transfer introduces latency and requires CPU RAM; cached requests across tiers3 does NOT imply3 simultaneous GPU decode streams or faster responses. Hugging Face offloads per-layer tensors unlike this request-tier cartoon; real host link overhead/back-and-forth may increase latency.
- **teacherExpectedAnswer (gated):** Offload can make space but data transfer introduces latency and requires CPU RAM; cached requests across tiers3 does NOT imply3 simultaneous GPU decode streams or faster responses. Hugging Face offloads per-layer tensors unlike this request-tier cartoon; real host link overhead/back-and-forth may increase latency.
- **correctIncorrectCriteria:** Try offload false/true and bandwidth1/2 separately, correctly calculate capacity and one-way lower bound, recognize HF library layer-specific vs toy entire request distinction.
- **misconceptions:** [m1] CPU로 요청 KV를 옮기면 GPU 가중치4MiB도 자동으로 CPU로 옮겨져요. / [m2] 2MiB를 초당1GiB로 옮기는 데 걸리는 전체 최종 토큰 응답 시간은 반드시 정확히1.953ms예요. / [m3] CPU에 저장된 KV 하나가 늘었다는 사실만으로 GPU가 동시에 처리할 요청 수가 반드시 3개가 돼요.
- **hints L1/L2/L3 (on request):** [L1] 모델 가중치와 요청별 캐시는 다른 예약 공간이에요. / [L2] 전송의 이론적 최저 시간과 요청 지연에는 어떤 단계가 더 있나요? / [L3] GPU-resident와 CPU-cached 요청을 구분해요.
- **misconceptionFeedback/m1 (gated):** 이 toy는 KV만 오프로딩하고 모델 메모리4MiB는 그대로 GPU에 남겨요.
- **misconceptionFeedback/m2 (gated):** 1.953밀리초는 대역폭만으로 계산한 단방향 전송 하한이에요. 실제 응답은 계산·복사·스케줄이 더해져요.
- **misconceptionFeedback/m3 (gated):** CPU에 저장됐다는 것과 GPU에서 연산 중이라는 상태는 달라요. 동시 디코드 처리량은 미측정이에요.
- **feedback/correct:** 실제로 두 조건 이상을 달리 실험하고 단위·분모·기술계층의 차이를 WHY로 설명했습니다. 이 수업 숫자는 실제품 성능이나 보안 인증이 아닙니다.
- **displayTextAfterObservation (gated):** 전송 비용을 치르며 저장 요청을 늘리는 것과 처리량 향상은 다릅니다.
- **speechTextAfterObservation (gated):** 이 수업에선 GPU에 두 요청, CPU에 한 요청 캐시를 저장할 수 있어요. 하지만 CPU의 KV를 다시 읽는 비용 때문에 실제 생성 속도 향상을 장담할 수 없어요.
### ③ 시니어 물리/시스템 검토 및 차단 사례
- **physicsAssumptions:** Toy whole-request CPU tier; HF library offloads per-layer (different mechanism); one-way link peak serial bound, no round-trip or real memory/runtime measurements.
- **seniorDesignReview:** PCIe/host DDR bandwidth and copy orchestration, weight reserve vs cache tier, admission and preemption, request active vs cached, latency p99/TFT under contention.
- **sourceRefs:** [R2][R3]
- **negativePathTest:** correctly keyed m1-m2-m3 must fail with ONLY cause-matched Korean feedback and no teacher answer-before in DOM/ARIA/Voice; correct-first with two genuinely changed typed controls+WHY passes. All capacity/latency/perf/security `NOT_PROVEN` gates are scoped at the evaluated trial; never regrade past event retroactively. A07 independent source pass before A05 real 2.5D browser implementation.
- **nextHook:** 다음 실험에서 GPU 기억창고의 다른 비용을 찾아봐요.

## 21-S05 · `llm-prefix-cache-tenant-gate` · 같은 질문 머리말을 재사용하면 사용자 정보도 공유될까요?
### ① 먼저 예상한 후 조작
- **sceneId:** llm-prefix-cache-tenant-gate
- **learningGoal:** 전체 블록 prefix KV 재사용의 toy 연산 절약량과 테넌트 분리 정책·salt 검증을 구별하고 salt 단독이 강한 격리 경계가 아님을 설명한다.
- **priorKnowledge:** 21-S02 block pages,10 TTFT prefill,32 service SLO/security
- **storyHook:** 두 사람이 같은 길잡이 문장을 보내면 먼저 계산한 AI 노트를 같이 써도 될까요? 다른 회사 사용자라면요?
- **question:** 두 사람이 같은 길잡이 문장을 보내면 먼저 계산한 AI 노트를 같이 써도 될까요? 다른 회사 사용자라면요?
- **predictionPrompt (learner-only):** 요청 두 개가 각48토큰이고 같은 앞부분32토큰을 안전하게 재사용한다면 계산하지 않아도 되는 prefill 분량은 얼마일까요? 다른 테넌트인데 salt만 같으면요?
- **displayTextBeforePrediction:** 캐시 공유와 사용자 정보 보호는 어떻게 같이 판단할까요?
- **speechTextBeforePrediction:** 공통 앞부분 블록 수와 테넌트·salt 조건을 따로 바꿔 보세요. 빠름과 안전을 구별해 먼저 예측해 봐요.
- **learnerAction:** Each fresh trial is an **event-sourced nonsecret** scenario. Typed controls `sharedPrefixTokens:16|32`, `sameTenant:boolean`, `cacheSaltMatches:boolean` can change ONLY while `phase='CONFIGURE'`; constants `tokensPerPrompt=48`, `tokensActuallyMatch=true` verified fictional tokens, `blockSize=16`. Explicit real student **ATTEMPT_REUSE** creates a one-time immutable result snapshot and sets `phase='REUSE_OBSERVED'`; before ATTEMPT no KV-hit/miss or full numeric teacher answer appears. If user tries changing ANY prefix/tenant/salt after ATTEMPT, return `CONFIG_LOCKED_RESET_REQUIRED`, transition to `RESET_REQUIRED`, **do not change existing snapshot, do not create second reuse or change old verdict**. Explicit **NEW_TRIAL/RESET** increments `episodeId`, retains old `history` append-only and creates a fresh CONFIGURE trial (default prefix16/sameTenant true/saltMatch true or student reselects); different tenant even with matching salt denies new attempts in a NEW episode. Student compares independent per-episode snapshots: authorized32 work64, new crossTenant/sameSalt work96, new sameTenant/saltMismatch work96. These are teaching policies, not real vLLM tenant isolation, never use actual credentials/private prompt content.
- **modelInputs:** Typed FSM: `episodeId:int>=1`, `phase:'CONFIGURE'|'REUSE_OBSERVED'|'RESET_REQUIRED'`, `sharedPrefixTokens:16|32`, `sameTenant:boolean`, `cacheSaltMatches:boolean`, constants `tokensPerPrompt=48`, `blockSize=16`, `tokensActuallyMatch=true` nonsecret synthetic fixed. On `SET_CONTROL` when CONFIGURE: change the selected typed input **without observing/retroactively regrading previous event**; when phase REUSE_OBSERVED or RESET_REQUIRED: emit `CONFIG_LOCKED_RESET_REQUIRED`, phase becomes RESET_REQUIRED, do NOT mutate controls, `currentSnapshot` or `history`. On `ATTEMPT_REUSE` only in CONFIGURE, compute `authorized=sameTenant&&cacheSaltMatches&&tokensActuallyMatch`, `reuse=authorized?sharedPrefixTokens:0`, `work=96-reuse`, `decisionCode=(!sameTenant?'CROSS_TENANT_POLICY_DENY':!cacheSaltMatches?'SALT_MISMATCH_NO_REUSE':'AUTHORIZED_TOY_PREFIX_REUSE')`, append immutable `snapshot={episodeId,prefixTokens:sharedPrefixTokens,tenantAllowedAtEvent:sameTenant,saltAllowedAtEvent:cacheSaltMatches,tokensActuallyMatched:true,reusedTokens:reuse,workUnits:work,decisionCode}` to `history` **exactly once**, set `currentSnapshot=snapshot`, phase REUSE_OBSERVED. On `ATTEMPT_REUSE` outside CONFIGURE return `CONFIG_LOCKED_RESET_REQUIRED`, no duplicate event. On `NEW_TRIAL_RESET` with previous event observed or RESET_REQUIRED: `episodeId+=1`, phase CONFIGURE, clear only currentSnapshot and set default controls while immutable `history` retained; do not rewrite prior verdict. Authorized prefix16:work80, prefix32:work64; denied work96; all work abstract token-equivalent not wall time. `actualTTFT=NOT_PROVEN`, `tenantIsolationGuaranteed=NOT_PROVEN`, `privatePromptContents=NOT_USED`. Student before-stage gating and event-time authorization invariant.
### ② 조작 결과 뒤 교사 단독 답변 및 오개념 교정
- **expectedObservation (teacher-only):** Trial1 prefix32/sameTenant true/salt true explicit ATTEMPT ⇒ immutable snapshot episode1 AUTHORIZED_TOY_PREFIX_REUSE reused32, work64. Changing tenant/salt/prefix before RESET emits `CONFIG_LOCKED_RESET_REQUIRED` and the first snapshot stays authorized64 in history (neither retroactively denied nor reauthorized). NEW_TRIAL episode2 prefix32/sameTenant false/salt true ATTEMPT ⇒ CROSS_TENANT_POLICY_DENY reused0/work96. NEW_TRIAL episode3 prefix16/sameTenant true/salt false ATTEMPT ⇒ SALT_MISMATCH_NO_REUSE reused0/work96. Reverse order (old deny, then new grant) likewise cannot convert first denial to a grant. Salt alone is NOT a real vLLM security boundary; isolated per-tenant app policy toy.
- **teacherExpectedAnswer (gated):** 공유한 앞부분 전체 블록이 동일해도 **시도한 그 순간의** 테넌트 권한·salt 검사로 한번만 판정해요. Episode1 권한+salt 일치/공통32토큰⇒96−32=64 가상 작업, 시도 후 tenant를 바꾸려 하면 `CONFIG_LOCKED_RESET_REQUIRED`로 결과가 고정돼요. RESET 뒤 Episode2 다른 테넌트/같은 salt⇒`CROSS_TENANT_POLICY_DENY`, work96; Episode3 같은 테넌트/다른 salt⇒`SALT_MISMATCH_NO_REUSE`, work96. 같은 salt로는 실제 데이터 보안 인증이 되지 않아요.
- **correctIncorrectCriteria:** Require at least **two explicit ATTEMPT events in DIFFERENT immutable episodeIds** with independently changed **prefix token size and tenant or salt** and a causal WHY contrasting authorized reuse vs denied; reusing a control toggle after recorded event is NOT experimental evidence and cannot gain mastery (must RESET). Verify authorized prefix32/work64 and different-tenant same-salt/work96, plus optional or reviewer-required salt-mismatch/work96. A first-correct learner can pass on correctly justified distinct episodes, with no deliberate wrong answer. One proof is an ATTEMPT snapshot, never current combinational booleans after the fact; no actual user PII/time attacks.
- **misconceptions:** [m1] prefix가 같은 요청을 두 명이 보냈다면 테넌트가 달라도 캐시를 공유하는 게 무조건 안전해요. / [m2] vLLM cache_salt를 사용하면 다른 인증·테넌트 격리가 필요 없는 완벽한 보안벽이 생겨요. / [m3] 앞부분32토큰을 재사용하면 AI 서비스의 첫 토큰 지연도 모든 장비에서 반드시 정확히 32/96 비율로 줄어요.
- **hints L1/L2/L3 (on request):** [L1] 데이터가 같더라도 누구에게 재사용 권한이 있나요? / [L2] salt는 시간 기반 유추 위험을 줄이지만 로그인/격리를 대체할까요? / [L3] 토큰 작업량·전체 응답 지연·GPU FLOPs는 달라요.
- **misconceptionFeedback/m1 (gated):** 요청 문장이 같아 보여도 권한과 테넌트 경계부터 검증해야 해요. 다른 테넌트는 이 수업 정책에서 재사용하지 않아요.
- **misconceptionFeedback/m2 (gated):** 공식 vLLM 보안 문서는 같은 프로세스의 테넌트 간 격리가 없다고 주의해요. salt는 일부 캐시 관측 위험을 줄이는 수단이에요.
- **misconceptionFeedback/m3 (gated):** 96→64는 계산할 prefill 토큰의 가상 작업량 변화예요. 실제 첫 토큰 지연엔 스케줄·GPU 계산·전송·캐시 조회가 들어가요.
- **feedback/correct:** 실제로 두 조건 이상을 달리 실험하고 단위·분모·기술계층의 차이를 WHY로 설명했습니다. 이 수업 숫자는 실제품 성능이나 보안 인증이 아닙니다.
- **displayTextAfterObservation (gated):** prefix 캐시 재사용은 권한 조건이 확인됐을 때만 허용하는 실험이에요.
- **speechTextAfterObservation (gated):** 같은 권한 그룹에서 앞부분 서른두 토큰을 공유하면 계산 작업량을 아낄 수 있지만, 다른 사용자의 정보를 보호하려면 salt만으로는 충분하지 않아요.
### ③ 시니어 물리/시스템 검토 및 차단 사례
- **physicsAssumptions:** Synthetic token identity and full16-token blocks only. `episodeId`/event snapshot are teaching-model state, not persistent vLLM ACL/session security or actual cache eviction. Recorded trial verdict cannot be rewritten by changing tenant/salt after the attempted reuse; student must use NEW_TRIAL to obtain independent result. Cache salt is not a trust boundary, real authorized tenant separation must be enforced outside shared vLLM, no real user prompts/cookies/credentials.
- **seniorDesignReview:** vLLM prefix full-block key hashing, eviction/refcounts, cache salt is mitigation not strong tenant security boundary, admission/prefix hit accounting and p99 TTFT service evaluation.
- **sourceRefs:** [R5][R7]
- **negativePathTest:** A07 R28-01 event-history negative matrix: episode1 CONFIGURE prefix32,sameTenant=true,salt=true → ATTEMPT_REUSE ⇒ immutable `AUTHORIZED_TOY_PREFIX_REUSE` reused32/work64/history[1]. Change sameTenant false WITHOUT NEW_TRIAL ⇒ `CONFIG_LOCKED_RESET_REQUIRED`, **old episode1 still AUTHORIZED/work64 and no new ATTEMPT**, never retroactively deny. NEW_TRIAL creates episode2, then prefix32/sameTenant=false/salt=true → ATTEMPT ⇒ immutable `CROSS_TENANT_POLICY_DENY` reused0/work96. Attempt sameTenant true without RESET ⇒ LOCKED, old deny unchanged; NEW_TRIAL episode3 sameTenant=true,salt=false,prefix16 → ATTEMPT ⇒ `SALT_MISMATCH_NO_REUSE` work96; old episode1/2 unchanged. Reverse case old deny cannot become authorized by after-event `SET_CONTROL`. Test 2 truly distinct completed episodes + causal WHY + first-correct PASS, all 3 keyed Korean misconception corrections and no teacher answers in pre-prediction DOM/ARIA/Voice; real vLLM caching security not certified.
- **nextHook:** 이제 데이터센터 전원과 서비스 장애 모델로 KV 처리량의 실제 경계를 연결해 봐요.

## A07 exact numeric and security QA acceptance
| Step | Toy after-result proof | Reject this inference |
|---|---|---|
| 21-S01 | layers16 kvHeads4 headDim64 2B K/V =>16384B/token; T128=2MiB/T256=4MiB, kvHeads8 T128=4MiB/T256=8MiB | queryHeads16 determines KV allocation, full GPU measured memory same as KV payload |
| 21-S02 | block16, two requests17/31 => two blocks each, allocated64/useful48/waste16=>25%; fixed64/request slots128/waste80=>62.5% toy | no last-block waste, actual throughput2× or vLLM paper unconditional guarantee |
| 21-S03 | hypothetical INT8 FP16 KV-only payload128T 2MiB→1MiB,256T4MiB→2MiB; scalar .26 with scale .1⇒.30 +.04 and scale .2⇒.20 −.06 | no metadata or model-quality/latency cost, backend/version promised |
| 21-S04 | toy GPU8MiB minus other4MiB =4MiB KV, each2MiB⇒2 GPU cached; offload one to CPU then admit new⇒2 GPU+1 CPU stored; 2MiB /1GiB/s⇒1.953125ms and /2⇒.9765625ms one-way ideal | real HF layer-based offload same as toy whole-request, throughput / TTFT guaranteed |
| 21-S05 | each prompt48, shared full prefix16 or32, total96 token-work; authorized reuse⇒80 or64; differentTenant despite salt equal⇒96 and CROSS_TENANT_POLICY_DENY | cacheSalt alone is multi-tenant isolation, token savings equals TTFT improvements |
- [ ] P1 NEXT:A07 independently verify exact original + senior immutable source SHAs, all five positive and 15 cause-specific negative scenarios, no before-voice answer leaks, GQA/quant/backend caveats, prefix ACL and cache salt security statement. P1 NEXT:A06 correct any MAJOR then A07-approved STORY_READY direct A05 Issue#4. A05 code+real browser/mobile/Voice/ARIA/CI and A02 app official E2E separate owners.
## Source references checked 2026-10-18
[R1] Hugging Face KV explanations https://github.com/huggingface/transformers/blob/main/docs/source/en/cache_explanation.md
[R2] Hugging Face Cache APIs warnings https://huggingface.co/docs/transformers/main/kv_cache
[R3] NVIDIA TensorRT-LLM KV cache blocks https://github.com/NVIDIA/TensorRT-LLM/blob/main/docs/source/features/kvcache.md
[R4] Original PagedAttention paper 2023 https://arxiv.org/abs/2309.06180
[R5] vLLM current v1 prefix design https://github.com/vllm-project/vllm/blob/main/docs/design/prefix_caching.md
[R6] vLLM old version-specific paging https://docs.vllm.ai/en/v0.7.0/design/automatic_prefix_caching.html
[R7] vLLM multi-tenant cache security https://github.com/vllm-project/vllm/blob/main/docs/usage/security.md

## A06 R28-01 independent reviewer P1 source-contract fix · 2026-10-18 KST
- [A07 Round28 exact reviewed older original `3f0021da` static source and discovered one P1](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-28-lesson21-first-kv-and-dc10-scene-audit.md): S05 learnerAction promised immutable per-tenant reuse decision and new-trial reset, while modelInputs only recomputed current booleans and could retroactively authorize/deny prior cache event. **A06 repaired** S05 with an actually modeled typed `episodeId`, `phase`, explicit `ATTEMPT_REUSE` record snapshot and `NEW_TRIAL_RESET`, locked post-event config changes, immutable prior history, and per-episode grading; old accepted science/maths S01..04 unchanged. Reviewer must inspect newest SHA for R28-01 before `EDU_SOURCE_PASS` or A05 handoff; A06 author self-QA only. No real prompt/user/tenant network access.
