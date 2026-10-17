# 10 · AI 데이터센터 한 번에 연결하기: roofline·KV cache·PUE·장애복구
> A06 2026-10-17. 교육 명세 4-Step 자체 QA: **FACT CHECKED 개념 / TOY MODEL 수치 / 실제 제품·브라우저 미검증**. 한 요청을 끝까지 추적하는 완결편 **초안**; 실제 시스템 전체 교육 완성 선언 아님.
> 선수: 01 MOS/CMOS, 02 DRAM, 03 GDDR/HBM, 04 NAND/eSSD/NVMe, 05 CPU/cache, 06 packaging/heat, 07 tiers, 08 network, 09 reliability.
> **3겹 원리:** 처음 한 문장 → 계산하면서 발견 → 엔지니어처럼 측정/반례·실패 처리.

## 10-S01 · `ai-roofline-bottleneck`
- **learningGoal:** memory-bound vs compute-bound 조건과 arithmetic intensity 계산.
- **priorKnowledge:** GPU compute capacity, HBM/GDDR bandwidth, bytes/s와 FLOP/s.
- **storyHook:** “GPU에 엄청난 계산 능력이 있는데 왜 GPU가 쉬고 있을까요?”
- **question:** 데이터 1바이트를 읽어서 10번 계산할 때와 80번 계산할 때 병목이 같나요?
- **prediction:** 4TFLOP/s peak toy, 100GB/s bandwidth toy이면 경계 연산집약도는 40 FLOP/B?
- **learnerAction:** workload arithmetic intensity 10↔80 FLOP/B, memory BW 100↔200GB/s, compute 4TFLOP/s 고정한 Roofline plot 조작.
- **modelInputs:** peak=4e12 FLOP/s toy, BW=1e11/2e11 B/s toy, I=10/80 FLOP/B toy.
- **expectedObservation:** P≤min(4e12, I×BW). BW=100GB/s에서 I=10→1TFLOP/s, I=80→4TFLOP/s. 경계 I*=4e12/1e11=40 FLOP/B. BW 두 배일 때 I*=20 FLOP/B.
- **correctIncorrectCriteria:** 식·단위, ridge point, 캐시 재사용/작업량 변화가 I를 바꿀 수 있음을 설명; 높은 BW=무조건 빠름 오답.
- **misconceptions:** m1 FLOP/B는 연산 속도 TFLOP/s와 같다; m2 HBM 용량 2배면 대역폭도 정확히 2배; m3 roofline은 모든 커널의 실제 성능을 정확히 예측.
- **hints:** L1 연산수/FLOP를 메모리 bytes로 나눠요 / L2 BW에 intensity 곱하면 단위는? / L3 peak compute와 memory upper bound 중 더 작은 것을 고르세요.
- **feedback/incorrect keyed:** m1 “연산집약도는 작업 특성, TFLOP/s는 속도예요.” / m2 “용량·대역폭은 별개 축이에요.” / m3 “실행 효율·cache·kernel geometry·overhead가 실제 달라요.”
- **feedback/correct:** “계산 성능만 올린다고 해결되지 않는 병목을 찾았어요.”
- **explanation:** roofline 성능 상한은 peak arithmetic throughput과 memory BW×arithmetic intensity의 최소. Model shape/batch/precision/reuse/working set에 따라 I가 달라진다; 애플리케이션 latency를 예측하는 시간 방정식은 아님.
- **physicsAssumptions:** FLOP 및 GB/s 십진/toy, 실제 GPU 이론성능·실측 MLPerf와 무관. caches/launch/low occupancy 무시.
- **displayText:** “빠른 GPU가 왜 데이터를 기다릴까요?”
- **speechText:** “계산기는 준비됐는데 메모리가 느리면 어떻게 될까요? 연산량과 데이터를 따로 올려봐요.”
- **nextHook:** 같은 모델이라도 첫 토큰과 그다음 토큰의 기다림이 다르다면?
- **sourceRefs:** [A1][A2]

## 10-S02 · `llm-prefill-decode-kv`
- **learningGoal:** 요청 프리필/prefill과 생성 decode, KV cache 증가·HBM/LPDDR offload 차이를 체험.
- **priorKnowledge:** 05 cache/locality, 07 LPDDR/HBM tiers, GPU matmul.
- **storyHook:** “첫 글자가 나오기까지 기다렸다가, 그다음 글자는 하나씩 톡톡 나오죠?”
- **question:** 요청을 읽는 prefill과 답을 늘리는 decode는 항상 같은 종류의 계산일까요?
- **prediction:** 모델 가중치를 이미 GPU에 둔 경우 매 토큰 eSSD 전체 로딩이 일어날까? 길어진 문맥에서 무엇이 커질까?
- **learnerAction:** context 4↔16 toy tokens, batch 1↔4, KV/weights residence HBM/LPDDR cards, TTFT-vs-token-throughput indicator (숫자는 추세용).
- **modelInputs:** contextLength 4/16 toy, batch 1/4 toy, KV entries proportional to context×batch (단순 모델), modelResident yes/no, offload none/selected.
- **expectedObservation:** prefill은 입력을 한꺼번에 처리, decode는 새 토큰 순차 생성 + 이전 K/V 참조. context/batch 증가→KV 저장량 증가 경향; 재사용·오프로딩은 bandwidth/capacity/latency tradeoff.
- **correctIncorrectCriteria:** TTFT(첫 토큰까지 시간) vs output tokens/s, KV cache vs model weights, offloading 비용을 분리하면 성공.
- **misconceptions:** m1 AI 응답 매 토큰마다 SSD에서 전체 모델을 새로 읽는다; m2 prefill과 decode는 같은 arithmetic intensity/latency를 보장한다; m3 KV cache를 메모리에서 옮겨도 속도·품질의 영향을 전혀 받지 않는다.
- **hints:** L1 모델은 이미 GPU 메모리에 들어있을 수 있어요 / L2 새 토큰 생성은 이전 K/V를 참조하나요? / L3 데이터를 다른 tier로 옮기면 연결선 왕복이 생겨요.
- **feedback/incorrect keyed:** m1 “상주 모델은 매 토큰 저장소에서 전량 읽을 필요가 없어요.” / m2 “prefill과 decode는 연산 모양·병목이 달라져요.” / m3 “오프로딩은 용량을 늘리는 대신 이동비용이 생겨요.”
- **feedback/correct:** “모델, 입력, KV cache가 서로 다른 이동 경로를 갖는다는 걸 알아냈어요.”
- **explanation:** KV cache는 토큰 생성 중 과거 key/value representation을 보관하는 일반적 최적화. 실제 크기≈layers×heads×head_dim×tokens×bytes×2(구현/그룹쿼리·padding/quantization에 따라 다름). 전용 추론 서버의 batch/continuous batching/attention impl/메모리 정책에 따라 성능도 달라진다.
- **physicsAssumptions:** 토큰 4/16·batch 1/4 toy, 실제 LLM FLOP/token/latency/precision 수치 아님.
- **displayText:** “첫 토큰과 그다음 토큰은 왜 다를까요?”
- **speechText:** “처음 질문을 읽을 때와 답을 하나씩 만들 때 서버의 일이 달라져요. 저장량을 늘려봐요.”
- **nextHook:** 처리량을 높이는 과정에서 GPU가 전력과 열의 상한에 부딪히면?
- **sourceRefs:** [A1][A3]

## 10-S03 · `rack-power-pue-thermal`
- **learningGoal:** 시스템 전력·냉각, PUE와 업무 처리 효율의 차이 구분.
- **priorKnowledge:** 06-Package power/heat, 서버·네트워크·저장장치.
- **storyHook:** “GPU는 1MW의 일을 하는데 냉각과 전원 설비도 전기를 쓰네요.”
- **question:** PUE가 줄면 AI 응답이 무조건 빨라지거나 GPU 와트당 성능도 자동으로 좋아질까요?
- **prediction:** IT=1MW 고정, PUE 1.4→1.2면 facility power 1.4→1.2MW? 보조전력은 0.4→0.2MW?
- **learnerAction:** IT load 1MW toy, facility factor PUE=1.4/1.2, tasks/s=1000/1500 toy independent; cooling & PSU loss cards to mark overhead.
- **modelInputs:** PIT=1MW, PUE 1.4/1.2, appThroughput 1000/1500 tasks/s toy, facilityPower=PUE×ITpower.
- **expectedObservation:** 1.4MW→1.2MW; facility overhead 0.4MW→0.2MW. 하지만 task/s/W 지표는 IT 실제 workload와 accelerator utilization에 따라 달라지며 PUE만으로 결정되지 않는다.
- **correctIncorrectCriteria:** PUE의 분자/분모·단위 없음, 사업 KPI(queries per kWh) 차이/장기 energy 기반 측정, thermal power constraints 설명.
- **misconceptions:** m1 PUE 1.2=데이터센터가 GPU만큼 1.2배 빠르다; m2 PUE가 낮으면 IT 사용률과 효율이 무조건 좋다; m3 광 스위치/펌프/UPS의 전력은 0이라 빼도 된다.
- **hints:** L1 시설 전체 에너지와 IT 에너지 비율입니다 / L2 GPU가 놀아도 PUE가 낮을 수 있나요? / L3 전력 전달 손실·펌프·팬을 무엇으로 기록하나요?
- **feedback/incorrect keyed:** m1 “PUE는 속도가 아니라 인프라의 에너지 비율이에요.” / m2 “처리 효율은 workload별로 따로 봐야 해요.” / m3 “전력 공급과 냉각 설비도 비용이 있어요.”
- **feedback/correct:** “PUE와 실제 AI 효율을 별개로 확인해야 해요.”
- **explanation:** PUE=facility annual energy/IT annual energy(ISO/IEC 30134-2 개념). 짧은 일정 toy는 순간 전력비로 묘사하지만 시설 실제 보고는 적절한 energy 경계·기간·측정 조건을 준수. Uptime Institute는 PUE가 IT utilization·작업당 에너지의 대체가 아니라는 점을 강조.
- **physicsAssumptions:** 1MW·1.4/1.2는 가상/시간 평균 일치 가정. 실제 시설 overhead/냉각 방식/성능·TCO 비교 아님.
- **displayText:** “GPU 밖에서도 전기가 쓰여요.”
- **speechText:** “계산기에 넣는 전기만 있는 게 아니에요. 냉각과 전원 설비가 쓰는 전력도 함께 계산해봐요.”
- **nextHook:** 한 군데가 고장 나면 전체 답변 서비스도 끝나는 걸까요?
- **sourceRefs:** [A4][A5]

## 10-S04 · `ai-dc-end-to-end-resilience`
- **learningGoal:** 요청 경로와 고장·중복·체크포인트가 SLA에 미치는 영향을 근거로 결정.
- **priorKnowledge:** 04 NVMe, 07 CXL, 08 NIC/RDMA, 09 SSD PLP/QoS, 10-S01~03.
- **storyHook:** “GPU는 멀쩡한데 답변이 멈췄어요. 범인은 누구일까요?”
- **question:** NIC·스위치·SSD·DDR·GPU·전력·냉각 중 어느 곳이 병목·단일고장점일까?
- **prediction:** AI 서버 2대가 같은 1개 스위치를 공유하면 스위치가 고장났을 때 서비스 가용성은?
- **learnerAction:** 입력→NIC→CPU/DDR→GPU HBM/GDDR→응답, 모델 로딩은 eSSD↔host, 학습 checkpoint는 storage eSSD/NVMe-oF 선택. GPU/NIC/switch/PSU fail 토글→고장 지점·재시도·복구 정책 선택.
- **modelInputs:** servers 1/2 toy, switch 1/2 independent toy, storage 1/2 toy, job type infer/train, failure event one component, repair paths manually selected.
- **expectedObservation:** 서버 중복만으로 공용 단일 스위치 고장 해결 불가; redundant link/switch/replication과 software failover/consistency·cold start latency를 함께 설계해야 한다. 모델 상주 추론 vs 학습 체크포인트는 저장/네트워크 경로가 다르다.
- **correctIncorrectCriteria:** 단일고장점과 대응책·비용/지연·데이터 일관성 리스크 3요소를 하나의 사건에 대해 기술.
- **misconceptions:** m1 GPU 둘이면 네트워크·스토리지는 단일 고장이라도 괜찮다; m2 모든 추론 토큰이 NAND→GPU를 지나야 한다; m3 백업 전원만 있으면 저장 데이터/응답 서비스가 무조건 무손실이다.
- **hints:** L1 두 서버가 같은 스위치를 지나나요? / L2 가중치가 이미 HBM에 상주해 있나요? / L3 전원 유지와 네트워크 복구·데이터 복제는 다른 기능이에요.
- **feedback/incorrect keyed:** m1 “중복하지 않은 공유 부품에서 장애가 생길 수 있어요.” / m2 “모델 로딩과 반복 토큰 생성 경로를 구분해요.” / m3 “가용성·내구성·일관성은 각각 관리해야 해요.”
- **feedback/correct:** “계산 칩 밖의 조건까지 살펴보면 데이터센터가 하나의 시스템으로 보여요.”
- **explanation:** 실제 서비스 SLA/SLI는 end-to-end latency percentiles, error budgets, recovery time, checkpoint consistency and replica coordination. Toy single failure toggle은 상관 장애/복구시간의 실제 확률을 모델링하지 못한다.
- **physicsAssumptions:** redundancy links count toy, 확률·고장율·복구 지연 수치 주지 않음. 실제 GPUDirect Storage/InfiniBand/RDMA 경로는 플랫폼별로 다름.
- **displayText:** “답이 늦는 이유를 경로에서 찾아봐요.”
- **speechText:** “GPU만 살펴보면 원인을 놓칠 수 있어요. 데이터가 지나가는 장치를 하나씩 꺼보고 어디가 멈추는지 확인해봐요.”
- **nextHook:** 이제 어떤 성능·신뢰성·에너지 지표를 직접 측정해 가장 먼저 최적화할까요?
- **sourceRefs:** [A1][A6][A7]

## 시니어 검증 / A05 인계
- 모든 Step은 예측→조작→조건별 오답→Why→다음 질문; 3개 이상 misconception과 3단계 힌트. 물리/제품 수치가 toy인지 반드시 화면 상시 표시.
- A05 SceneSpec: roofline 좌표 두 상한/지표 단위, prefill/decode 2타임라인+KV 사용량, rack power/thermal 및 PUE(기본은 **에너지** 비율), 단일 장애 지점/복구 화살표. 3겹 난이도 점진 공개, 키보드·모바일·Voice 접근성. A05 단독 브랜치/PR, A02 학습 엔진 임의수정 금지.
- PUE가 낮아도 GPU utilization 낮으면 실제 queries per kWh는 낮을 수 있다. 값 검증 방법은 같은 실험에서 throughput·TTFT·tail-latency·power meter·temperature와 함께 측정.
- 데이터센터가 항상 HBM/GDDR 및 eSSD를 같은 형태로 갖는다고 단정하지 않는다. 시스템은 제품/용도/지리/재해복구 정책마다 다름.

## 공식 근거
[A1] https://developer.nvidia.com/blog/ai-model-co-design-hardware-friendly-llm-design/ (2026-07 roofline/AI bottleneck)
[A2] https://github.com/NVIDIA/nccl-tests/blob/master/doc/PERFORMANCE.md (collective 통신 근거)
[A3] https://www.micron.com/products/memory/lpddr-modules/socamm (LPDDR/SOCAMM2와 KV offload 사례/벤더별 시험 조건)
[A4] https://journal.uptimeinstitute.com/ask-the-expert-qa-follow-up-with-uptime-institute-cto-chris-brown/ (PUE vs IT 이용률)
[A5] https://journal.uptimeinstitute.com/capacity-allocation-and-the-next-generation-of-ai-era-kpis/ (2026-05 PUE의 한계)
[A6] https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/23.9.0/gpu-operator-rdma.html (GDS/RDMA 대안 경로)
[A7] https://nvmexpress.org/specification/nvm-express-base-specification/ (NVMe transport/storage)
