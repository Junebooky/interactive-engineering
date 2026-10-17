# 07 · 서버 메모리는 왜 DDR만 있지 않을까? RDIMM·MRDIMM·LPDDR/SOCAMM2·CXL 4.0
> A06 · 2026-10-17 · source checked · A06 correction authored / A07 SOURCE RECHECK PENDING; A05 2.5D 씬/앱/실사용 검증 = NOT TESTED. 4 step, 3겹 깊이(처음/직접 실험/시니어 설계).
> 선수: D02 DRAM 뱅크·refresh, G03 대역폭·GPU 메모리, 05 CPU SRAM/cache.
> 핵심 질문: **기억장치를 늘리면 빨라지는 걸까요, 아니면 새 대기줄이 생기는 걸까요?**

## 07-S01 · ddr5-data-rate-vs-latency
### ① 처음 1분 — 상황 → 예상 → 만지기
- **sceneId:** `ddr5-data-rate-vs-latency`
- **learningGoal:** 대역폭=width×transfers/s÷8 계산과 latency≠bandwidth를 모두 답하고 한 번의 burst 효율과 연속 대역폭 차이를 설명
- **priorKnowledge:** D02 row/bank/latency, G03 bandwidth, bit→byte
- **storyHook:** 서버에 램을 더 꽂으면 매번 첫 데이터도 빨리 올까요?
- **question:** DDR5-6400이라는 숫자가 첫 읽기 지연시간도 보장할까요?
- **predictionPrompt (learner-visible):** 64-bit 버스의 3200/6400 MT/s와 첫 데이터 지연을 각각 예상하고 나서 실험해 보세요.
- **learnerAction:** 64-bit channel, 3200/6400MT/s 토글→이론 BW 계산; 별도 ACT/READ/PRE 타임라인의 첫-word delay 카드 바꾸기
- **modelInputs:** busWidth=64 bits(data only), dataRate=3200/6400 MT/s toy, tRCD=10/20ns toy, tCL=10/20ns toy
- **expectedObservation (teacher-only):** BW 25.6→51.2GB/s(십진); 첫 READ의 단순 ACT→data 지연 tRCD+tCL=20 또는 40ns라는 별개 개념
- **teacherExpectedAnswer (gated):** BW 25.6→51.2GB/s(십진); 첫 READ의 단순 ACT→data 지연 tRCD+tCL=20 또는 40ns라는 별개 개념
- **displayTextBeforePrediction:** 램 숫자를 올리면 무엇이 달라질까요?
- **displayTextAfterObservation (gated):** 대역폭과 첫 데이터 응답시간은 다른 제약에 따라 정해져요.
- **speechTextBeforePrediction:** 전송률과 첫 데이터 대기시간을 먼저 각각 예상해 보세요.
- **speechTextAfterObservation (gated):** 이론 최대 전송량은 데이터율과 버스 폭을 곱하지만 첫 데이터 도착은 DRAM 내부 활성화와 열 접근이 따로 좌우해요.
### ② 중급 — 원리·분기
- **correctIncorrectCriteria:** 대역폭=width×transfers/s÷8 계산과 latency≠bandwidth를 모두 답하고 한 번의 burst 효율과 연속 대역폭 차이를 설명
- **misconceptions:** 1) [m1] MT/s와 MHz가 언제나 숫자·단위까지 같다 / 2) [m2] DDR5 데이터율을 두 배로 하면 DRAM 내부 tRCD/tCL(ns)는 반드시 절반이 된다 / 3) [m3] 단일 DDR5 채널의 이론 최고 대역폭이 곧 CPU 앱의 유효 처리량이다
- **hints:** 1단 1바이트는 8비트이고 MT/s는 전송 횟수예요. / 2단 첫 데이터가 오기 전 ACT와 CAS 같은 시간이 필요할까요? / 3단 요청이 드문 경우와 길게 이어지는 경우 중 누가 대역폭 상한에 근접할까요?
- **feedback/correct:** “바로 이 차이예요. BW 25.6→51.2GB/s(십진); 첫 READ의 단순 ACT→data 지연 tRCD+tCL=20 또는 40ns라는 별개 개념”
- **feedback/incorrect by option:** [m1] “MT/s는 초당 데이터 전송 횟수이지 CPU MHz와 동일하지 않아요.” [m2] “데이터율과 내부 절대 지연시간은 독립된 특성을 갖고 있어요.” [m3] “버스 최대 처리량에서 refresh·명령·다른 트래픽은 빠져 있어요.”
- **explanation:** 이론 채널 BW(bits/sec)=64×6.4e9/8=51.2e9 B/s. 첫 활성화 뒤 데이터 지연은 tRCD+tCL 식으로 단순화; 이미 열린 행은 다르고 tRP/tRAS/tRFC·큐잉·메모리 컨트롤러 명령·rank interleave 영향을 받음. DDR5는 on-die ECC가 있어도 CPU→DIMM 경로 전체에 대한 end-to-end ECC 보장은 별도 검증.
### ③ 심화 — 한계·검산·선택
- **physicsAssumptions:** 3200/6400MT/s, tRCD/tCL 10/20ns는 계산용 예시. burst, refresh, bank contention, memory controller, ECC overhead·platform limit 무시.
- **seniorDesignReview:** 대역폭·레이턴시·전력·용량·RAS·호환성·큐 혼잡 중 무엇이 고정이고 무엇이 바뀌었는가? 단일 스펙으로 전체 성능을 결정하지 않는다. 제품·워크로드 실제 값은 지원 플랫폼 문서/데이터시트 검증 전엔 넣지 않는다.
- **teachBack:** 기초=원인 한 문장, 중급=변수 변경 후 계산, 심화=한계 하나+다른 선택안·반례 한 개를 답하면 통과.
- **nextHook:** 그럼 DIMM을 여러 개 꽂은 서버는 선이 너무 복잡해지지 않을까요?
- **sourceRefs:** [E1][E2][E3]

## 07-S02 · server-rdimm-mrdimm-ecc
### ① 처음 1분 — 상황 → 예상 → 만지기
- **sceneId:** `server-rdimm-mrdimm-ecc`
- **learningGoal:** RDIMM RCD를 CPU 고속 데이터의 일반 cache라고 말하지 않고 RCD 경로 및 MRDIMM 랭크 다중화·오류 커버리지 차이를 설명
- **priorKnowledge:** 07-S01, DRAM ranks, error bit concept
- **storyHook:** 메모리를 더 꽂았는데 신호가 흐려질 수도 있을까요?
- **question:** RDIMM·MRDIMM과 DDR5 on-die ECC, 왜 이름부터 다를까요?
- **predictionPrompt (learner-visible):** 서버 메모리의 명령 등록, 데이터 다중화, 오류 보호 세 카드가 각각 어디서 작동할지 선택해 보세요.
- **learnerAction:** CPU→DIMM 주소/명령 신호 fanout을 RDIMM RCD 유무로 비교; rank0/1의 data-mux 모형으로 MRDIMM 선택; cell-bit error vs cable/connector path error 위치 토글
- **modelInputs:** type UDIMM/RDIMM/MRDIMM toy, rank 1/2 toy, faultLocation die/host-link toy, systemECC on/off toy
- **expectedObservation (teacher-only):** RDIMM은 주소/명령 경로에 register를 두는 구조, MRDIMM은 rank data multiplex buffer도 사용; on-die ECC는 칩 내부의 특정 오류 보호, host-memory channel/system ECC는 별도 계층
- **teacherExpectedAnswer (gated):** RDIMM은 주소/명령 경로에 register를 두는 구조, MRDIMM은 rank data multiplex buffer도 사용; on-die ECC는 칩 내부의 특정 오류 보호, host-memory channel/system ECC는 별도 계층
- **displayTextBeforePrediction:** 서버 메모리 안의 카드를 배치해 봐요.
- **displayTextAfterObservation (gated):** RDIMM·MRDIMM·ECC는 서로 다른 작업을 해요.
- **speechTextBeforePrediction:** 주소, 데이터, 오류 보호를 어떤 부분에 연결할지 먼저 예측해 보세요.
- **speechTextAfterObservation (gated):** 주소 명령 등록과 랭크 다중화, 칩 내부와 시스템의 오류 보호는 서로 다른 역할이죠.
### ② 중급 — 원리·분기
- **correctIncorrectCriteria:** RDIMM RCD를 CPU 고속 데이터의 일반 cache라고 말하지 않고 RCD 경로 및 MRDIMM 랭크 다중화·오류 커버리지 차이를 설명
- **misconceptions:** 1) [m1] RDIMM 등록 버퍼는 호스트 모든 데이터 경로를 동일 방식으로 캐시한다 / 2) [m2] DDR5 on-die ECC가 있으면 서버 메모리 시스템 ECC가 전혀 필요 없다 / 3) [m3] MRDIMM은 일반 RDIMM 소켓에서 전혀 추가 플랫폼 지원 없이 자동 동작한다
- **hints:** 1단 RCD는 명령/주소의 전기적 부하·타이밍을 다루는 장치예요. / 2단 칩을 떠난 뒤 생긴 오류는 내부 ECC가 어디서 볼 수 있나요? / 3단 MRDIMM의 Rank Mux는 CPU·BIOS·플랫폼 지원을 확인해야 해요.
- **feedback/correct:** “바로 이 차이예요. RDIMM은 주소/명령 경로에 register를 두는 구조, MRDIMM은 rank data multiplex buffer도 사용; on-die ECC는 칩 내부의 특정 오류 보호, host-memory channel/system ECC는 별도 계층”
- **feedback/incorrect by option:** [m1] “RDIMM의 RCD는 주로 command/address register로, 무조건 데이터 캐시가 아니에요.” [m2] “온다이 오류 교정과 경로/시스템 RAS는 보호 위치가 달라요.” [m3] “새로운 데이터 다중화 모듈은 전기·제어기 호환성을 검증해야 해요.”
- **explanation:** Micron DDR5 on-die ECC는 칩 내부의 셀 오류 보정; RDIMM은 register로 command/address 부하 완화. MRDIMM은 두 rank의 내부 데이터 동작을 MDB/MRCD로 집약해 호스트 쪽 대역폭 확보를 도모한다. 용량/신호 무결성/전원/지연·호환성 등 제품별 차이가 남는다.
### ③ 심화 — 한계·검산·선택
- **physicsAssumptions:** UDIMM/RDIMM/MRDIMM simplified blocks; actual channel topology/registered clock driver/data-buffers/BIOS support differ. '에러 1개' toy, ECC correction guarantees not modeled.
- **seniorDesignReview:** 대역폭·레이턴시·전력·용량·RAS·호환성·큐 혼잡 중 무엇이 고정이고 무엇이 바뀌었는가? 단일 스펙으로 전체 성능을 결정하지 않는다. 제품·워크로드 실제 값은 지원 플랫폼 문서/데이터시트 검증 전엔 넣지 않는다.
- **teachBack:** 기초=원인 한 문장, 중급=변수 변경 후 계산, 심화=한계 하나+다른 선택안·반례 한 개를 답하면 통과.
- **nextHook:** 전력을 줄이는 LPDDR이 데이터센터에도 들어오는 걸까요?
- **sourceRefs:** [E2][E3][E4]

## 07-S03 · lpddr-socamm2-kv-cache
### ① 처음 1분 — 상황 → 예상 → 만지기
- **sceneId:** `lpddr-socamm2-kv-cache`
- **learningGoal:** LPDDR이 HBM와 같은 종류의 대역폭을 보장하지 않음을 말하고 offload의 용량 이익과 추가 전송 비용 모두 지목
- **priorKnowledge:** 07-S02, AI model vs KV cache, power budget
- **storyHook:** 스마트폰에서 배터리를 아끼던 메모리가 AI 서버에도 온다면?
- **question:** LPDDR5X와 SOCAMM2는 HBM을 완전히 대신할까요?
- **predictionPrompt (learner-visible):** GPU HBM 8슬롯에 가중치 6슬롯을 놓고 KV 6슬롯이 추가되면 호스트 LPDDR로 이동이 가능한지 경로와 이동 횟수부터 예상해 보세요.
- **learnerAction:** HBM 8슬롯 중 weights6, KV0→6를 직접 배치하고 host LPDDR32슬롯으로 선택적 offload. supportedPath none/hostGpuCopy 먼저 지정, offload on/off 및 recall on/off 별도 토글; unsupported 선택을 실제 오답으로 평가하고 이동 횟수와 toy latency 표시.
- **modelInputs:** hbmCapacity8 slots, hostLpddrCapacity32, weights6, kvSlots0..12, supportedPath=none|hostGpuCopy, offload=none|selected, recall=true|false, linkCapacity=4 slots per toy-ms, setupTime=2 toy-ms per transfer, transferCount integer, transferSlots=overflow. Not real hardware specifications.
- **expectedObservation (teacher-only):** KV6 with weights6 overflows HBM8 by 4 slots. Unsupported route=NO_COPY (not free memory extension). Supported hostGpuCopy of4 costs 2+4/4=3 toy-ms; if GPU later needs a recall, another3 toy-ms => 2 transfers/6 toy-ms. Capacity advantage may cost bandwidth/latency.
- **teacherExpectedAnswer (gated):** supportedPath none => no copy; hostGpuCopy && KV6 => overflow4, one move3 toy-ms, optional recall another3 toy-ms; distinct CPU-host LPDDR and GPU-HBM address spaces, path depends on system.
- **displayTextBeforePrediction:** 다른 메모리 층을 사용할 수 있을까요?
- **displayTextAfterObservation (gated):** 용량 확대에는 지원 경로와 복사 비용이 필요해요.
- **speechTextBeforePrediction:** GPU와 호스트 메모리 사이의 연결 경로부터 선택해 봐요.
- **speechTextAfterObservation (gated):** 호스트 LPDDR을 GPU HBM처럼 무료로 연결할 수는 없어요. 지원되는 복사 경로가 있고 다시 읽을 필요가 있다면 왕복 전송 시간도 고려해야 해요.
### ② 중급 — 원리·분기
- **correctIncorrectCriteria:** independently test supported/unsupported path and recall/no recall, identify 4-slot overflow and count0/1/2 transfers, explain toy 3+3 time, reject universal GPU-addressable LPDDR claim.
- **misconceptions:** 1) [m1] SOCAMM2는 HBM과 동일한 메모리 인터페이스다 / 2) [m2] LPDDR은 휴대폰 전용이라 서버에서 쓰이지 않는다 / 3) [m3] KV cache를 어디로 옮겨도 응답 지연에는 영향이 없다
- **hints:** 1단 저전력과 초고대역폭은 같은 목적일까요? / 2단 SOCAMM2의 LPDDR5X 모듈 사용 예를 찾아봐요. / 3단 가까운 메모리에서 먼 계층으로 이동하면 어떤 전송 단계가 생기죠?
- **feedback/correct:** “바로 이 차이예요. 초기엔 HBM 안에서 처리, KV가 커지면 부족할 수 있어 일부를 LPDDR 등 용량 계층으로 관리; 단, offload는 통신 지연·대역폭 비용을 초래하며 성능 향상 보장 아님”
- **feedback/incorrect by option:** [m1] “SOCAMM2는 LPDDR 기반 모듈, HBM은 적층 DRAM의 넓은 I/O라는 다른 연결 방식이에요.” [m2] “2026년엔 LPDDR 기반 서버 폼팩터도 공식 제품으로 소개돼요.” [m3] “오프로딩은 용량을 아끼지만 데이터 이동 비용을 만들어요.”
- **explanation:** Micron SOCAMM2 공식 제품은 LPDDR5X 기반 데이터센터 모듈이다. 2026-06 JEDEC JESD328(표준 유통문서) 역시 서버/AI 환경용 SOCAMM2를 정의한다. 용량·W/GB에 이점이 있을 수 있으나 HBM과 대역폭·지연·호환성·패키징은 다른 설계 문제다. 제조사 마케팅 상대 개선 숫자는 시험 조건 없이 수업에 일반화하지 않는다.
### ③ 심화 — 한계·검산·선택
- **physicsAssumptions:** HBM/LPDDR slots, toy-ms and link slots/ms are invented teaching values. No universal SOCAMM2 GPU memory offload capability or actual GPU/host DMA, address mapping and overlap model.
- **seniorDesignReview:** 대역폭·레이턴시·전력·용량·RAS·호환성·큐 혼잡 중 무엇이 고정이고 무엇이 바뀌었는가? 단일 스펙으로 전체 성능을 결정하지 않는다. 제품·워크로드 실제 값은 지원 플랫폼 문서/데이터시트 검증 전엔 넣지 않는다.
- **teachBack:** 기초=원인 한 문장, 중급=변수 변경 후 계산, 심화=한계 하나+다른 선택안·반례 한 개를 답하면 통과.
- **nextHook:** 서버에 꽂을 수 있는 램이 부족하면, 외부 메모리를 더 달 수 있을까요?
- **sourceRefs:** [E5][E6][E7]


- **negativePathTest:** route none + offload selected must fail; route hostGpuCopy + offload selected must count copy, optional recall separately; visit alone cannot pass.
## 07-S04 · cxl-memory-tiering
### ① 처음 1분 — 상황 → 예상 → 만지기
- **sceneId:** `cxl-memory-tiering`
- **learningGoal:** CXL가 PCIe와 같은 물리적 연결 자원을 활용할 수 있어도 고유 메모리 프로토콜과 coherency/OS tier 관리가 있음을 설명; 용량 증가와 지연/대역폭 트레이드오프를 구분
- **priorKnowledge:** 07-S01~03, NUMA latency, PCIe vs protocol
- **storyHook:** CPU 옆 램 슬롯이 꽉 찼다면, 스위치를 거쳐 메모리를 더 쓰면 되겠죠?
- **question:** CXL 메모리 확장은 HBM이나 CPU DRAM을 아무 때나 대체할까요?
- **predictionPrompt (learner-visible):** CPU load/store 가능 경로와 SSD의 명령형 블록 읽기를 구분하고 가까운/먼 메모리 비용을 예측해 보세요.
- **learnerAction:** Local DDR/CXL.mem physical memory path and SSD NVMe block I/O path as independent lanes; choose target DDR|CXL|SSD for CPU LOAD; if SSD, learner must first issue NVMe READ to stage into host memory. Try invalid direct SSD load; compare local hot8/CXL cold1 and reverse.
- **modelInputs:** localDDR8 slots with CPU access cost1 toy, cxlMem32 slots with access cost3 toy if platformSupportsCxl=true, SSD128 logical blocks with NVMe page-in cost30 toy *per I/O* before CPU loads, cpuLoadTarget=DDR|CXL|SSD, platformSupportsCxl=true|false, hotAccessCount8,coldAccessCount1,queuePenalty0|5.
- **expectedObservation (teacher-only):** CPU DDR hot8 + CXL cold1 gives 8*1+1*3=11 toy vs CXL hot8 + DDR cold1 gives8*3+1*1=25. This is DDR vs CXL byte-addressed memory access ONLY. SSD does not satisfy CPU LOAD directly: NVMe block READ -> staging host DDR/CXL -> CPU LOAD, plus 30 toy units and memory costs. Unsupported CXL host cannot load it.
- **teacherExpectedAnswer (gated):** CPU LOAD DDR or supported CXL.mem; CPU_LOAD(SSD_LBA) is invalid, requires NVMe command/payload transfer and page-in; DDR-hot/CXL-cold=11, CXL-hot/DDR-cold=25 toy units.
- **displayTextBeforePrediction:** CPU가 바로 읽는 메모리와 SSD는 같을까요?
- **displayTextAfterObservation (gated):** CXL.mem은 CPU 메모리 접근, SSD는 블록 입출력이에요.
- **speechTextBeforePrediction:** 어떤 경로가 메모리 접근이고 어느 경로가 파일 블록 읽기인지 구분해 봐요.
- **speechTextAfterObservation (gated):** 지원되는 CXL 메모리는 CPU가 주소로 접근할 수 있지만 SSD 데이터는 먼저 블록 명령으로 호스트 메모리에 가져오는 단계가 필요해요.
### ② 중급 — 원리·분기
- **correctIncorrectCriteria:** two independent access modes shown and wrong SSD direct load rejected; 11 versus25 computed with toy unit and supported CXL platform checked.
- **misconceptions:** 1) [m1] CXL 4.0 128GT/s는 CPU 메모리에 128GB/s의 앱 데이터율을 보장한다 / 2) [m2] CXL pool은 HBM 수준 접근 지연을 무조건 제공한다 / 3) [m3] CXL 프로토콜만 있으면 모든 CPU/OS/보드/장치에서 pooling 가능하다
- **hints:** 1단 GT/s는 트랜스퍼/초이지 애플리케이션 GB/s가 아니에요. / 2단 가까운 DRAM과 스위치/링크를 지나는 장치의 왕복 경로 길이는 같을까요? / 3단 CXL 기술은 하드웨어·펌웨어·OS를 함께 확인해야 해요.
- **feedback/correct:** “바로 이 차이예요. 핫 데이터 local: 8×1+1×3=11 toy; hot remote: 8×3+1×1=25 toy; 연결이 혼잡하면 원격 계층의 이익이 더 줄어들 수 있음”
- **feedback/incorrect by option:** [m1] “링크의 GT/s는 인코딩/폭/프로토콜 오버헤드를 빼기 전 수치예요.” [m2] “추가 메모리의 용량과 HBM 대역폭·지연은 별개예요.” [m3] “지원 여부는 플랫폼·장치·소프트웨어 구현과 세대 조합에 달려요.”
- **explanation:** 2025-11-18 CXL 4.0 공식 사양 발표는 이전 세대 64GT/s→128GT/s, bundled port, RAS 개선을 명시. 이는 링크 전송 단위 지표이지 실효 앱 BW/latency가 아니다. CXL memory expand/pool/sharing은 지원되는 장치/host/switch/OS 관리·일관성 범위 등에 의존. OS memory tier migration과 host coherency을 개념적으로 분리.
### ③ 심화 — 한계·검산·선택
- **physicsAssumptions:** toy address costs not real product; SSD is a block device, not byte-addressable CPU memory under NVMe, page-in to host memory required; CXL.mem depends on device type, CPU/OS/topology support.
- **seniorDesignReview:** 대역폭·레이턴시·전력·용량·RAS·호환성·큐 혼잡 중 무엇이 고정이고 무엇이 바뀌었는가? 단일 스펙으로 전체 성능을 결정하지 않는다. 제품·워크로드 실제 값은 지원 플랫폼 문서/데이터시트 검증 전엔 넣지 않는다.
- **teachBack:** 기초=원인 한 문장, 중급=변수 변경 후 계산, 심화=한계 하나+다른 선택안·반례 한 개를 답하면 통과.
- **nextHook:** 메모리를 한 서버 밖으로 늘렸는데, 여러 GPU가 협력할 때는 데이터가 어떻게 움직이죠?
- **sourceRefs:** [E8][E9]

## A05 구현 요구
상태 readout·단위와 예측 카드 분리, 키보드/접근성, 3 오답 3조건 피드백, 소리 내기 자연스러운 voice, (수치들은 제품 실측과 구분) 표시. 탭은 **먼저 왜?→직접 실험→시니어 Q&A** 3겹 점진 공개, 각 Step 정답 조작 전 숨김. 어떤 UI/Voice도 'RDIMM은 다 빠르다', 'HBM 대체', 'CXL 128GB/s' 단정하지 않는다.

## 근거 참조
[E1] https://www.micron.com/products/memory/dram-components/ddr5-sdram (DDR5 세대/온다이 ECC)
[E2] https://www.micron.com/products/memory/dram-modules/rdimm (RDIMM RCD)
[E3] https://www.micron.com/about/blog/company/partners/redefining-performance-with-ddr5-and-4th-gen-intel-xeon-scalable (온다이 ECC)
[E4] https://www.micron.com/products/memory/dram-modules/mrdimm (MRDIMM rank multiplex)
[E5] https://www.micron.com/products/memory/lpddr-modules/socamm (SOCAMM2 LPDDR5X)
[E6] https://store.accuristech.com/standards/jedec-jesd328?product_id=3116332 (JEDEC JESD328 2026-06 published, catalog; 상세 표준 원문 비공개/구매 필요)
[E7] https://www.micron.com/products/memory/lpddr-modules (SOCAMM2 vs LPCAMM2)
[E8] https://computeexpresslink.org/news/ (2025-11-18 CXL4.0 release)
[E9] https://computeexpresslink.org/cxl-specification/ (CXL4.0 evaluation copy terms; 전체 규격 원문 미열람)
상세 source/check/confidence/반론: [연구 노트](../deep-dives/07-memory-systems.md).

- **negativePathTest:** reject CPU_LOAD SSD without block-I/O staging; reject CPU_LOAD CXL if no platform support; do not represent SSD as another identical direct-memory card.

## A07 Round06 independent QA correction audit (2026-10-17)
- Original source 00b35bedf5eeafddb0866506ea3ccf80b18b9618 A07 reported 4× pre Voice/UI answer leakage, S03 unsupported GPU offload, S04 SSD/CXL.mem conflation. All four now have student predictionPrompt and before/after UI+Voice, gated teacherExpectedAnswer; S03 and S04 specify independent pass/fail branches and quantitative toy caveats.
- See [Round06 A07 audit](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-06-memory-07-ssd-09-audit.md). Teacher-only expectedObservation and post explanation hidden in DOM/aria/TTS before student prediction AND direct manipulation and WHY. A05 app implementation/browser not tested; A07 must review new exact blob independently.
