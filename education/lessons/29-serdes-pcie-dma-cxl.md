# 29 · 서버 데이터는 어떤 길로 움직일까? SerDes·PCIe·DMA·CXL
> 2026-10-17 · **A06_SELF_QA_DONE / A07_EDU_QA_PENDING**, 5 Step (기획 45~60분 미실측). 기존 14레슨·58 Step에 신규 5 Step을 작성하여 **15레슨·63 Step 교육 원고**. A05 장면 제작·앱 구현·사용자 QA 없음; A07 BLOCKER/MAJOR 해결 후 STORY_READY로 A05 인계.
> 선수: 12 전압/비트와 13 단위 짧은 카드, 04 NVMe/SSD, 07 DDR/CXL overview. 후속: 08 AI RDMA/optical → 10 AI DC E2E. [공학 원문·검산 노트](../deep-dives/29-serdes-pcie-cxl-dma.md).
> CXL 4.0 **평가 라이선스 규격은 AI 사용제한이 있어 다운로드·처리하지 않음**; 공개 컨소시엄 설명/보도자료와 PCI-SIG 공개 FAQ, Linux kernel 공식 문서만 활용.
> UI engine: `predictionPrompt`은 학생용 중립 질문, `teacherExpectedAnswer/expectedObservation`은 강사만 보고 learner prediction+실제 입력 후에만 공개. Before Voice/TTS/readout/aria에 정답 선공개 금지. 오답이 실제 가능한 독립 선택, 3개 원인별 feedback/힌트 3단, actionHistory evidence required. 모든 숫자는 PCI-SIG가 공표한 *link headline ceiling* 또는 명시된 TOY; 앱처리량/실리콘 계측 아님.

## 29-S01 · `serdes-lanes-and-signal-eyes` · 빠른 한 줄 vs 여러 줄: lane이 뭘까요?
### ① Beginner · 질문부터
- **sceneId:** `serdes-lanes-and-signal-eyes`
- **learningGoal:** TX/RX full-duplex, x1/x4 lane, PAM4 4 levels=2 bits/symbol을 독립 선택 두 상태 이상으로 확인하고 앱 처리량×4 오해를 설명
- **priorKnowledge:** 12 전하/전압·비트, 13 단위 용어 카드
- **storyHook:** GPU와 CPU를 잇는 전선이 한 줄이라면 전송이 언제나 느릴까요?
- **question:** TX/RX 방향과 x1/x4 폭을 바꾸면 무엇이 달라질까요?
- **predictionPrompt (learner):** x4 vs x1 대역폭 상한, 한 lane의 송수신 경로, PAM4의 심벌당 정보량을 먼저 예측
- **learnerAction:** x1/x4 lane·송신 TX/수신 RX·NRZ/PAM4 각각 독립 선택; 잘못된 반이중 배선도 만들 수 있어야 함
- **modelInputs:** lanes=1/4, direction=TX/RX/both, mode=NRZ/PAM4, qualitative noise=low/high
- **displayTextBeforePrediction:** “GPU와 CPU를 잇는 전선이 한 줄이라면 전송이 언제나 느릴까요?”
- **speechTextBeforePrediction:** “TX/RX 방향과 x1/x4 폭을 바꾸면 무엇이 달라질까요? 먼저 예상한 다음 직접 바꿔볼까요?”
### ② Intermediate · 수치/관찰과 교정
- **expectedObservation (teacher only until reveal):** PCIe lane의 TX/RX는 독립 경로(양방향 가능); x4 집계폭은 x1의 4배 잠재 용량이나 모든 장치/신호 품질에서 앱 성능 4배 보증 아님. NRZ 2 상태 1bit/symbol, PAM4 4 상태 2bits/symbol.
- **teacherExpectedAnswer (gated):** TX/RX 구별·x4 링크의 이론 상한 조건·PAM4 4레벨=2비트 이해
- **correctIncorrectCriteria:** TX/RX 구별·x4 링크의 이론 상한 조건·PAM4 4레벨=2비트 이해
- **misconceptions:** [m1] x4이면 모든 파일 전송이 반드시 4배 빠르다 / [m2] PCIe lane 하나는 양방향 동시 통신을 절대로 못 한다 / [m3] PAM4의 네 전압 레벨은 심벌당 4비트다
- **hints:** [L1] 서로 지원하는 장치의 폭이 같아야 할까요? / [L2] 송신과 수신 화살표를 따로 그려보세요. / [L3] 네 상태에서 고르는 정보량은 log₂4예요.
- **feedback/incorrect keyed:** [m1] “x4는 링크 상한이며 앱 속도는 컨트롤러/오버헤드/토폴로지에 좌우돼요.” / [m2] “lane에는 별도 TX/RX 경로가 있어 동시 양방향 전송 가능해요.” / [m3] “네 선택상태는 2비트 정보예요.”
- **feedback/correct:** “조작한 두 상태의 다른 점과 단위/이유를 직접 설명해 주세요.”
- **displayTextAfterObservation:** “송신·수신, lane 폭, 신호 레벨을 각각 구분해야 해요.”
- **speechTextAfterObservation:** “한 lane에도 보내는 길과 받는 길이 있어요. 여러 lane은 잠재 속도를 높이지만 앱 전체가 꼭 네 배 빨라지는 건 아니죠.”
### ③ Senior · 무엇을 믿지 말아야 할까요?
- **physicsAssumptions:** 단순 lane cartoon; actual SerDes equalization, retimer, eye diagram and BER not simulated; do not double count PAM4 on top of published PCIe GT/s.
- **sourceRefs:** [IO-A][IO-B][IO-C]
- **teachBack:** Beginner=오늘의 왜? 한 문장 / Intermediate=서로 다른 두 state/수치·단위 / Senior=실효성능을 확인할 계측·보안/토폴로지 실패와 대안 하나씩.
- **nextHook:** 그러면 PCIe7 x16 ‘512GB/s’는 한 방향 속도일까요?

## 29-S02 · `pcie-generations-lanes-bandwidth` · 512GB/s, 두 방향을 합친 숫자일까요?
### ① Beginner · 질문부터
- **sceneId:** `pcie-generations-lanes-bandwidth`
- **learningGoal:** PCIe6/7 x16 bidirectional published maximum vs one-way/x4 illustrative ceiling을 각각 계산하고 GT/s/GB/s를 구분
- **priorKnowledge:** 29-S01, 1byte=8bits 기초카드, GT/s≠GB/s
- **storyHook:** 같은 512GB/s라는 숫자도 읽는 방향이 틀리면 결론이 달라져요.
- **question:** PCIe 7.0 x16의 512GB/s가 한 방향일까요, 양방향 합계일까요?
- **predictionPrompt (learner):** 세대·lane·방향을 골라 PCIe7 x16 양방향 합계, 한 방향, x4 한 방향을 순서대로 예측
- **learnerAction:** generation 6/7·lanes x4/x16·방향 one/both 별도 선택, 자신의 GB/s 예측 숫자 입력 후 공개
- **modelInputs:** PCIe6 official max 64GT/s, x16 bidirectional aggregate256GB/s; PCIe7 official max128GT/s, x16 bidirectional aggregate512GB/s; lanes4/16
- **displayTextBeforePrediction:** “같은 512GB/s라는 숫자도 읽는 방향이 틀리면 결론이 달라져요.”
- **speechTextBeforePrediction:** “PCIe 7.0 x16의 512GB/s가 한 방향일까요, 양방향 합계일까요? 먼저 예상한 다음 직접 바꿔볼까요?”
### ② Intermediate · 수치/관찰과 교정
- **expectedObservation (teacher only until reveal):** PCIe7 x16 양방향 합계 최대512GB/s, 한 방향 이론 ~256GB/s, x4 한 방향 ~64GB/s. PCIe6 x16 양방향256/한쪽128, x4 한쪽32. 숫자는 링크 공식 최대치 및 비례확장 모델이지 장치 앱 실효 처리량 아님.
- **teacherExpectedAnswer (gated):** 512 양방향 합계/256 한쪽 구분, x4÷4, GT/s vs GB/s 구분과 device negotiation caveat
- **correctIncorrectCriteria:** 512 양방향 합계/256 한쪽 구분, x4÷4, GT/s vs GB/s 구분과 device negotiation caveat
- **misconceptions:** [m1] PCIe7 512GB/s는 한 방향으로 앱 데이터가 항상 512GB/s이다 / [m2] 128GT/s 숫자에 PAM4 2비트를 다시 곱해야 공식 대역폭이 나온다 / [m3] 한쪽 Gen7 보드면 다른쪽 Gen6 장치와도 늘 Gen7이다
- **hints:** [L1] 양방향 합계의 의미부터 확인해요. / [L2] GT/s는 공식 표준 속도명이에요. PAM4 비트를 다시 곱할까요? / [L3] 링크는 양측 지원 세대와 lane 폭에 맞춰 협상돼요.
- **feedback/incorrect keyed:** [m1] “PCI-SIG는 x16의 최대 양방향 합계를 512라고 발표했어요.” / [m2] “PCI-SIG GT/s 표기를 심벌률처럼 다시 ×2 하면 이중 계산이에요.” / [m3] “양쪽 조건이 맞아야 그 세대 링크로 동작해요.”
- **feedback/correct:** “조작한 두 상태의 다른 점과 단위/이유를 직접 설명해 주세요.”
- **displayTextAfterObservation:** “512GB/s는 x16 양방향 총합의 표준 최대치예요.”
- **speechTextAfterObservation:** “PCIe7 x16의 오백십이 기가바이트 매초는 보내고 받는 두 방향을 더한 최대치예요. 한 방향만 보면 약 절반인 숫자로 비교해야 해요.”
### ③ Senior · 무엇을 믿지 말아야 할까요?
- **physicsAssumptions:** spec-derived envelope, zero overhead and symmetric split; no measured GPU/SSD performance, link negotiated or SKU tested.
- **sourceRefs:** [IO-A][IO-B][IO-C]
- **teachBack:** Beginner=오늘의 왜? 한 문장 / Intermediate=서로 다른 두 state/수치·단위 / Senior=실효성능을 확인할 계측·보안/토폴로지 실패와 대안 하나씩.
- **nextHook:** 링크를 채운 256바이트가 전부 사용자 파일 내용일까요?

## 29-S03 · `pcie-flit-fec-payload` · FLIT 256B, 실제 파일도 256B일까요?
### ① Beginner · 질문부터
- **sceneId:** `pcie-flit-fec-payload`
- **learningGoal:** PCIe6 256B FLIT의 236B TLP-carrying region=92.1875%를 구하고 실제 file payload와 별도임을 설명, Gen7 byte-layout extrapolation 거부
- **priorKnowledge:** 29-S02, 바이트/프레임 단위, 01 논리 bit
- **storyHook:** 패킷은 주소와 오류 검사표도 챙겨야 하겠죠?
- **question:** 256B FLIT 한 개에 응용프로그램 데이터 256B가 그대로 꽉 찰까요?
- **predictionPrompt (learner):** ‘256B 전부 사용자가 받음 / 236B가 곧 순수 파일 / 별도 framing’ 중 예측하고 236/256 비율 선택
- **learnerAction:** PCIe6 FLIT 256칸 모델에서 236B TLP용 영역과 나머지 20B를 독립 배치, TLP header·응용 bytes 카드 섞기; wrong user-data=236 허용
- **modelInputs:** PCIe6 public PCI-SIG webinar 256B FLIT with 236B TLP-carrying region, 20B other; no PCIe7 byte-layout assumptions
- **displayTextBeforePrediction:** “패킷은 주소와 오류 검사표도 챙겨야 하겠죠?”
- **speechTextBeforePrediction:** “256B FLIT 한 개에 응용프로그램 데이터 256B가 그대로 꽉 찰까요? 먼저 예상한 다음 직접 바꿔볼까요?”
### ② Intermediate · 수치/관찰과 교정
- **expectedObservation (teacher only until reveal):** 236/256=0.921875=92.1875%는 PCIe6 FLIT의 **TLP를 실을 수 있는 영역** 비율. TLP header 등 때문에 사용자 파일 순 payload는 더 작을 수 있음. PAM4 오류 보호에 FEC/CRC 필요; PCIe7 byte layout은 이 예시로 단정 불가.
- **teacherExpectedAnswer (gated):** 236/256 소수 계산과 TLP 영역 vs user payload 구별; PCIe7 무조건 동일 레이아웃 오답 거부
- **correctIncorrectCriteria:** 236/256 소수 계산과 TLP 영역 vs user payload 구별; PCIe7 무조건 동일 레이아웃 오답 거부
- **misconceptions:** [m1] 236B TLP 공간이면 사용자 파일도 항상 236B 들어간다 / [m2] 고속 PAM4에는 FEC와 CRC가 필요하지 않다 / [m3] PCIe6의 공개 바이트 배치 예제를 PCIe7에 그대로 옮겨도 언제나 맞다
- **hints:** [L1] TLP에는 응용 데이터 말고 어떤 헤더가 들어갈까요? / [L2] 링크 에러 검출과 정정은 어디에 담길까요? / [L3] 다른 세대는 최신 규격을 확인해야 해요.
- **feedback/incorrect keyed:** [m1] “TLP용 영역에는 TLP 헤더와 다양한 패킷이 들어가므로 전부 파일은 아니에요.” / [m2] “FEC/CRC는 PAM4 링크 오류를 처리하는 데 중요해요.” / [m3] “PCIe7에 동일한 236B 숫자를 적용하는 근거가 없어요.”
- **feedback/correct:** “조작한 두 상태의 다른 점과 단위/이유를 직접 설명해 주세요.”
- **displayTextAfterObservation:** “92.19%는 PCIe6의 TLP 영역 비율, 앱 효율이 아니에요.”
- **speechTextAfterObservation:** “이백쉰여섯 바이트의 데이터 묶음에도 오류 제어 정보가 들어가요. 이백서른여섯 바이트라는 공개 예시는 사용자 파일 크기와 같지 않죠.”
### ③ Senior · 무엇을 믿지 말아야 할까요?
- **physicsAssumptions:** PCIe6 public source only; real TLP/FLIT occupancy, retry and link overhead not measured; never use 236/256 as PCIe7 application efficiency.
- **sourceRefs:** [IO-C][IO-D]
- **teachBack:** Beginner=오늘의 왜? 한 문장 / Intermediate=서로 다른 두 state/수치·단위 / Senior=실효성능을 확인할 계측·보안/토폴로지 실패와 대안 하나씩.
- **nextHook:** 읽기 명령을 내린 CPU가 데이터도 직접 옮기는 걸까요?

## 29-S04 · `dma-iommu-nvme-p2p-route` · SSD의 바이트는 CPU 코어를 거쳐야 할까요?
### ① Beginner · 질문부터
- **sceneId:** `dma-iommu-nvme-p2p-route`
- **learningGoal:** host NVMe command and DMA payload + x/y/z address 세 역할을 그린 후 same-switch provider=false/crossRoot unsupported P2P negative paths 원인을 설명
- **priorKnowledge:** 04 SSD/NVMe read/write, 29-S02 PCIe link
- **storyHook:** CPU가 SSD에게 ‘읽어 줘’라고 요청했습니다. 파일 바이트는 어떤 길로 올까요?
- **question:** NVMe 명령 경로와 read payload 경로는 같은가요? DMA 주소는 CPU 주소와 같은가요?
- **predictionPrompt (learner):** 명령과 읽기 데이터가 각각 누가 움직이는지, DMA가 CPU virtual address를 직접 쓸 수 있는지, SSD→GPU 경로 보편성을 예측
- **learnerAction:** (1) Host CPU/NVMe command vs SSD DMA_FROM_DEVICE payload arrows independently assemble; CPU virtual X/physical Y/device DMA Z map. (2) For *optional* SSD↔GPU peer path choose `topology=sameSwitch|crossRoot`, and independently toggle **`p2pProviderPublished`**, **`consumerDmaSupported`**, **`acsRoutingPermitsLocal`**, **`mappingValid`**. Test both same-switch provider=false and unsupported cross-root even when other booleans true; visually block or allow the toy P2P route with reason code. Do not assume host staging has same restrictions as P2P.
- **modelInputs:** toy CPU virtual X=0x1000, CPU physical Y=0xA000, device-visible DMA Z=0x5000 (only under one fictional mapping/IOMMU configuration); command NVMe_READ, data direction DMA_FROM_DEVICE, `topology=sameSwitch|crossRoot`, `p2pProviderPublished=true|false`, `consumerDmaSupported=true|false`, `acsRoutingPermitsLocal=true|false`, `mappingValid=true|false`, platformDefaultPeerCrossRoot=false. **Toy P2P acceptance** = sameSwitch AND providerPublished AND consumerSupported AND acsLocal AND mappingValid. No real universal PCIe route performance or guaranteed GPUDirect.
- **displayTextBeforePrediction:** “CPU가 SSD에게 ‘읽어 줘’라고 요청했습니다. 파일 바이트는 어떤 길로 올까요?”
- **speechTextBeforePrediction:** “NVMe 명령 경로와 read payload 경로는 같은가요? DMA 주소는 CPU 주소와 같은가요? 먼저 예상한 다음 직접 바꿔볼까요?”
### ② Intermediate · 수치/관찰과 교정
- **expectedObservation (teacher only until reveal):** Standard NVMe READ uses host command/doorbell→SSD controller, SSD NAND→controller→PCIe DMA_FROM_DEVICE→mapped host DDR buffer and host completion (simplified). Device bus address need not equal host virtual or CPU physical. For **optional P2P** in this Linux-inspired toy, same-switch with all four gates true ⇒ toy SUPPORT_OK; **same-switch + providerPublished=false ⇒ NO_PROVIDER**; consumerDmaSupported=false ⇒ NO_CONSUMER; ACS local route not permitted ⇒ ROUTE_BLOCKED; mapping invalid ⇒ MAP_DENIED; cross-root default unsupported ⇒ TOPOLOGY_UNSUPPORTED even with other flags true. These are *conditional example requirements*, not a promise all same-switch devices work; supported provider doesn't mean authorized consumer automatically.
- **teacherExpectedAnswer (gated):** Host READ data SSD→DDR via mapped DMA_FROM_DEVICE works in the toy independently of optional P2P. P2P does NOT follow only from topology: require sameSwitch + provider published P2P pages + consumer DMA setup + ACS route permission + mappingValid. Negative proofs: sameSwitch + provider=false⇒NO_PROVIDER, sameSwitch + consumer=false⇒NO_CONSUMER, sameSwitch+acs=false⇒ROUTE_BLOCKED, sameSwitch+mapping=false⇒MAP_DENIED, crossRoot regardless flags⇒TOPOLOGY_UNSUPPORTED in this restricted toy. Linux runtime P2P and IOMMU effects need real driver/platform measurement.
- **correctIncorrectCriteria:** Correctly draw three distinct arrows/addresses and name DMA_FROM_DEVICE for NVMe READ; independently toggle at least **two negative P2P gates**, including **sameSwitch/provider=false** and **crossRoot unsupported**, then explain why proximity alone cannot guarantee SSD→GPU peer data movement. Do not require student to choose a wrong answer if prediction was correct.
- **misconceptions:** [m1] CPU가 READ를 요청했으니 CPU ALU가 SSD 바이트를 전부 복사해야 한다 / [m2] DMA device bus address는 모든 경우 CPU virtual address와 같다 / [m3] SSD와 GPU가 같은 서버에 있으면 언제나 직접 P2P 전송 가능하다
- **hints:** [L1] 명령을 쓰는 역할과 실제 이동 엔진을 나눠보세요. / [L2] Linux DMA API가 장치 주소를 왜 반환할까요? / [L3] PCI root bridge와 ACS/드라이버 조건을 확인해봐요.
- **feedback/incorrect keyed:** [m1] “CPU가 큐/명령을 관리하더라도 컨트롤러가 DMA로 바이트를 이동할 수 있어요.” / [m2] “IOMMU나 host bridge mapping 때문에 device-visible DMA 주소가 달라질 수 있어요.” / [m3] “P2P는 topology·드라이버 허용 조건이 맞아야 해요.”
- **feedback/correct:** “조작한 두 상태의 다른 점과 단위/이유를 직접 설명해 주세요.”
- **displayTextAfterObservation:** “CPU 요청과 SSD 읽기 데이터의 DMA는 다른 역할이에요.”
- **speechTextAfterObservation:** “CPU는 읽기 명령을 준비하고, 실제 데이터 이동은 SSD 컨트롤러가 DMA로 처리할 수 있어요. GPU로 바로 보내는 경로는 지원 조건을 따져야 하죠.”
### ③ Senior · 무엇을 믿지 말아야 할까요?
- **physicsAssumptions:** Linux official DMA API and PCI P2PDMA publicly documented: provider must publish P2P memory, consumer mapping/driver support needed, PCI root/switch route and ACS/IOMMU/software restrictions apply; real peer path may fail even same switch for other reasons not represented. Three hexadecimal addresses are fake educational labels; cross-root unsupported is **toy default**, some platforms may support other routes or host bounce. Conventional NVMe SSD may NOT publish P2PDMA pages; do not assume GPUDirect, CXL or GPU BAR peer support by marketing name.
- **sourceRefs:** [IO-E][IO-F]
- **teachBack:** Beginner=오늘의 왜? 한 문장 / Intermediate=서로 다른 두 state/수치·단위 / Senior=실효성능을 확인할 계측·보안/토폴로지 실패와 대안 하나씩.
- **nextHook:** PCIe 링크를 통해 SSD 대신 메모리를 붙이면 무엇이 달라질까요?


- **negativePathTest:** topology=sameSwitch and providerPublished=false (all other gates=true) ⇒ `NO_PROVIDER`; sameSwitch and consumerDmaSupported=false ⇒ `NO_CONSUMER`; sameSwitch+acsRoutingPermitsLocal=false ⇒ `ROUTE_BLOCKED`; sameSwitch+mappingValid=false ⇒ `MAP_DENIED`; topology=crossRoot (all booleans true) ⇒ `TOPOLOGY_UNSUPPORTED` under toy policy; sameSwitch+all booleans true⇒`TOY_PEER_ROUTE_OK` **not product guarantee**. UI shows provider, consumer, ACS, mapping as four separate student toggles, no shortcut 'same switch == pass'.
## 29-S05 · `cxl-io-cache-mem-tiering` · 멀리 붙은 메모리도 DDR처럼 쓰면 언제나 이득일까요?
### ① Beginner · 질문부터
- **sceneId:** `cxl-io-cache-mem-tiering`
- **learningGoal:** CXL.io/.cache/.mem 역할 세 개를 독립 매칭하고 NVMe I/O vs memory address semantics 및 toy access cost300/280을 검증
- **priorKnowledge:** 29-S04 DMA, 07 DDR/CXL, 05 SRAM cache basics
- **storyHook:** AI 서버의 로컬 DDR이 부족해요. 멀리 있는 메모리를 하나 더 붙여볼까요?
- **question:** CXL.io/cache/mem 역할과 NVMe 파일 명령, 데이터가 멀리 있을 때 비용은 어떻게 다를까요?
- **predictionPrompt (learner):** CXL.mem vs NVMe READ queue를 분류하고 hot 10개만 local로 둔 경우 vs 모두 remote 비용이 작을지 예상
- **learnerAction:** Show three movable anonymous protocol-role cards for register/config-control, coherent device-side host-cache access, and CPU memory load/store to device-attached RAM; learner matches cards to `CXL.io / CXL.cache / CXL.mem` **before** labels/role answers appear. Separately place toy 10 hot/90 cold accesses on local/remote targets; readout after prediction.
- **modelInputs:** toy 10 hot+90 cold accesses; localCost1, remoteCost3 arbitrary normalized units; CXL4 public announcement 128GT/s (not user GB/s or remote latency)
- **displayTextBeforePrediction:** “AI 서버의 로컬 DDR이 부족해요. 멀리 있는 메모리를 하나 더 붙여볼까요?”
- **speechTextBeforePrediction:** “CXL.io/cache/mem 역할과 NVMe 파일 명령, 데이터가 멀리 있을 때 비용은 어떻게 다를까요? 먼저 예상한 다음 직접 바꿔볼까요?”
### ② Intermediate · 수치/관찰과 교정
- **expectedObservation (teacher only until reveal):** CXL.io is config/IO, CXL.cache coherency, CXL.mem memory semantics (device type dependent). Toy all100 remote=300 units, hot10 local+90remote=280; actual request patterns/hit locality/time/power not measured. CXL4 128GT/s link speed doesn't guarantee local-DDR-equivalent latency.
- **teacherExpectedAnswer (gated):** io/cache/mem 역할 세 개 구분; toy300 vs280 and unit 'toy cost' not ns; CXL vs NVMe/PCIe semantics
- **correctIncorrectCriteria:** io/cache/mem 역할 세 개 구분; toy300 vs280 and unit 'toy cost' not ns; CXL vs NVMe/PCIe semantics
- **misconceptions:** [m1] CXL.mem과 NVMe는 둘 다 파일 읽기 명령만 쓴다 / [m2] CXL4 128GT/s라 모든 CXL 메모리 접근이 로컬 DDR만큼 빠르다 / [m3] 메모리 장치를 붙이면 OS 배치 정책과 CPU 호환성을 신경 쓸 필요가 없다
- **hints:** [L1] 파일 큐와 주소 기반 메모리는 다른 인터페이스예요. / [L2] GT/s와 왕복 지연(ns)은 같은 차원일까요? / [L3] host/coherency/NUMA 배치·지원이 필요하죠.
- **feedback/incorrect keyed:** [m1] “CXL.mem은 device-attached memory에 대한 프로토콜 의미를 제공하고 NVMe 큐와 달라요.” / [m2] “빠른 링크 대역폭은 모든 메모리 접근지연 보증이 아니에요.” / [m3] “실제 CXL 지원과 hot-data 배치 정책은 플랫폼별이에요.”
- **feedback/correct:** “조작한 두 상태의 다른 점과 단위/이유를 직접 설명해 주세요.”
- **displayTextAfterObservation:** “같은 빠른 케이블이라도 메모리의 의미와 접근 비용은 다를 수 있어요.”
- **speechTextAfterObservation:** “CXL은 PCIe에서 쓰는 물리적 연결 위에 메모리와 일관성의 약속을 더할 수 있어요. 하지만 원격 메모리는 로컬 DDR의 자동 대체품이 아니죠.”
### ③ Senior · 무엇을 믿지 말아야 할까요?
- **physicsAssumptions:** CXL 4 only public press release/blogs; evaluation licensed spec NOT read or processed. Memory access costs and request distribution toy not measured SKU/NUMA hardware. Coherency semantics depend on device types.
- **sourceRefs:** [IO-G][IO-H][IO-I]
- **teachBack:** Beginner=오늘의 왜? 한 문장 / Intermediate=서로 다른 두 state/수치·단위 / Senior=실효성능을 확인할 계측·보안/토폴로지 실패와 대안 하나씩.
- **nextHook:** 이제 CPU·GPU·SSD·메모리·네트워크 데이터 경로를 08 RDMA와 10 데이터센터에서 합쳐봅시다.
## A05 SceneSpec preview (A07 SOURCE PASS 후에만 제작 인계)
| Step | 실제 틀릴 수 있는 student action | 필수 source-level 회귀 |
|---|---|---|
| 29-S01 | lanes x1/x4, TX/RX, PAM4/NRZ independent | PAM4=2bits/symbol, not official PCIe GT/s ×2 |
| 29-S02 | Gen6/7 vs x4/x16 vs one/both independently | PCIe7 max x16 both512, one256; x4 one64; PCIe6 x16 both256, one128, x4 one32 GB/s ideal headline |
| 29-S03 | 256B FLIT tile; TLP region/user data wrong choice | PCIe6 236/256=92.1875% TLP region *not application payload*, never infer Gen7 bytes |
| 29-S04 | NVMe command vs payload; DMA x/y/z and supported P2P | READ payload device→DDR DMA_FROM_DEVICE; unrelated root can block P2P |
| 29-S05 | CXL.io/cache/mem role and hot/cold placement | toy all remote300 vs hotLocal280 cost units, no claim remote=DDR latency |

**Visibility/test:** predictionSubmitted saved before revealing `expectedObservation`, no answers in before TTS/aria, two distinct state changes, reason, selected wrong concept feedback. Wrong cases must be physically reachable. A05 QA desktop/mobile/keyboarding/reduced motion/Voice after independent source signoff. Source checkedAt 2026-10-17: 
[IO-A] https://pcisig.com/what-data-rate-pcie-70-specification
[IO-B] https://pcisig.com/faq?field_category_value%5B%5D=pci_express_7.0&keys=
[IO-C] https://pcisig.com/faq?field_category_value%5B%5D=pci_express_6.0&keys=PAM4
[IO-D] https://pcisig.com/blog/pcie%C2%AE-60-specification-webinar-qa-deeper-dive-flit-mode-pam4-and-forward-error-correction-fec
[IO-E] https://docs.kernel.org/6.15/core-api/dma-api-howto.html
[IO-F] https://docs.kernel.org/driver-api/pci/p2pdma.html
[IO-G] https://computeexpresslink.org/blog/the-benefits-of-serial-attached-memory-with-compute-express-link-2349/
[IO-H] https://computeexpresslink.org/wp-content/uploads/2025/11/CXL_4.0-Specification-Release_FINAL_Website-Copy.pdf (public press release, not restricted eval spec)
[IO-I] https://computeexpresslink.org/blog/questions-from-the-compute-express-link-exploring-coherent-memory-and-innovative-use-cases-webinar-2341/

## A07 Round08 P2P driver-provider MAJOR correction · 2026-10-17
- [A07 audit](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-08-lesson16-retest-29-pcie-gpu-recheck.md) original `4b4619b8` passed numerical/units/physical link facts but found 29-S04 P2P false-green: same switch alone was sufficient in model. New source adds four individually controlled boolean gates provider-published, consumer-supported, ACS route and valid mapping, plus cross-root unsupported toy policy; same-switch/provider=false fails. 29-S05 pre-action CXL role labels neutralized to protect prediction. Actual Linux P2PDMA partner topology/driver still needs code/hardware tests, no universal SSD→GPU direct semantics.
