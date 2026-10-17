# 08 · GPU 네 대가 서로 이야기하려면? RDMA·RoCE·InfiniBand·NCCL·광연결
> A06 2026-10-17. 엔지니어 레퍼런스 교차 확인 / 4-Step 완성된 스토리 인계 가능. Scene 코드는 아직 작성/실행되지 않음.
> 선수: 04 데이터 경로, 05 캐시, 07 memory tiers, G03 GPU. 학습목표: RDMA 오프로드와 물리 링크/혼잡/집합연산/광전력 제약을 연결.
> 3-depth teach-back: ① 처음 배우는 사람용 1문장 ② 조작·계산 ③ 설계/고장/대안 판단.

## 08-S01 · `nic-rdma-data-route`
### 1 · 질문/예측/관찰 (1분)
- **sceneId:** `nic-rdma-data-route`
- **storyHook:** GPU 두 개가 계산을 나눠 하는데 서로 자료를 주려면 CPU를 매번 거쳐야 할까요?
- **question:** 일반 복사와 RDMA가 각각 어디서 CPU 작업을 줄일까요?
- **prediction:** Host-A 앱→OS→NIC→네트워크→NIC→Host-B 앱 복사와 registered memory→NIC DMA 경로를 예상
- **learnerAction:** 두 서버 DDR(A,B) 및 GPU buffer; CPU-mediated 2-copy toy vs RDMA toy switch, 복사 단계/CPU events 강조
- **modelInputs:** mode host-copy/RDMA, payload=1MB toy, cpuCopies=0/2 assumed
- **expectedObservation:** RDMA는 등록된 메모리/권한 조건과 NIC가 원격 메모리를 옮기는 기능; CPU 개입·추가 복사를 줄일 수 있지만 주소 등록·오류·보안·큐 준비는 필요
- **displayText:** GPU끼리 통신할 때 CPU가 꼭 다 옮겨야 할까요?
- **speechText:** 서버 사이를 오가는 데이터도 길을 잘 고르면 CPU가 할 일을 줄일 수 있어요. 두 경로를 나란히 볼까요?
### 2 · 설명과 이해 검사
- **learningGoal:** RDMA가 마법처럼 데이터 0비트 이동하는 것이 아님과 CPU-copy 경로의 어느 단계가 줄었는지 말하면 통과
- **priorKnowledge:** CPU/GPU memory path, PCIe
- **correctIncorrectCriteria:** RDMA가 마법처럼 데이터 0비트 이동하는 것이 아님과 CPU-copy 경로의 어느 단계가 줄었는지 말하면 통과
- **misconceptions:** [m1] RDMA는 CPU가 영원히 전혀 필요 없는 네트워크다; [m2] RDMA 사용 시 패킷이 네트워크에 전혀 흐르지 않는다; [m3] GPU peer memory와 host RAM은 같은 위치·경로에 있다
- **hints:** L1 데이터는 NIC와 물리 링크를 지나야 할까요? / L2 NIC가 DMA를 실행하기 전 메모리를 누가 준비할까요? / L3 GPUDirect RDMA는 전제 조건과 장치 지원이 있을까요?
- **feedback/correct:** "지금 선택한 이유가 실험 결과와 맞아요. RDMA는 등록된 메모리/권한 조건과 NIC가 원격 메모리를 옮기는 기능; CPU 개입·추가 복사를 줄일 수 있지만 주소 등록·오류·보안·큐 준비는 필요"
- **feedback/incorrect keyed:** [m1] RDMA도 CPU 설정/큐 관리가 있을 수 있어요. 주로 데이터 경로의 복사·개입을 줄여요. / [m2] 네트워크 링크 전송은 그대로 존재해요. 없어진 것은 불필요한 CPU 복사 단계예요. / [m3] GPU 메모리와 호스트 RAM은 다른 장소일 수 있고 직접 경로 지원은 시스템별로 달라요.
- **explanation:** RDMA write/read는 NIC가 승인된 메모리 영역을 네트워크 넘어 DMA 하는 형태. GPUDirect RDMA는 지원되는 GPU/NIC/IOMMU/드라이버 조건에서 GPU 메모리와 NIC의 peer-to-peer 경로를 제공. 기존 경로의 구체 복사 횟수는 stack/API/zero-copy 설정마다 달라 toy 2-copy는 대표 가정뿐.
### 3 · 현업식 검증과 다음 질문
- **physicsAssumptions:** 두 번 복사 vs 0번은 조건부 toy path(절대 상수 아님). 실제 CPU/driver/setup/zero-copy/RDMA registration, security checks는 생략.
- **sourceRefs:** [N1][N2]
- **verification/test:** 단위·부하·초기/steady state·실제 장비가 아닌 toy 표시 후 경계조건(0 bytes/무한 링크/혼잡/무지원 NIC)을 학생에게 질문.
- **failureCase:** 대역폭은 충분해도 CPU overhead, fabric congestion, protocol mismatch, buffer pressure, power/thermal·optics failure가 새 병목.
- **teachBack:** 학생은 한 조건을 바꾸어 다음 실험 결과를 예측하고, 엔지니어는 선택 아키텍처가 실패하는 조건을 말한다.
- **nextHook:** RDMA를 이더넷에서 쓸 수 있다고 해도 혼잡이 생기면 어떻게 될까요?

## 08-S02 · `ethernet-roce-vs-infiniband`
### 1 · 질문/예측/관찰 (1분)
- **sceneId:** `ethernet-roce-vs-infiniband`
- **storyHook:** RDMA까지 준비했는데 다른 서버가 동시에 패킷을 보내면 줄을 서겠죠?
- **question:** RoCE와 InfiniBand는 둘 다 RDMA를 쓰지만 왜 두 경로를 고를까요?
- **prediction:** InfiniBand 링크와 Ethernet RoCEv2의 레이어/혼잡 정책 카드를 예상
- **learnerAction:** Ethernet RoCEv2 UDP/IP + priority/ECN/PFC 카드 / InfiniBand fabric 카드 배치, switch queue toy burst 4 vs service 2 packets/slot
- **modelInputs:** fabric IB/RoCEv2, incomingPackets 2/4 per slot, service 2, queue max 8 packets toy
- **expectedObservation:** 4 arrival−2 service=2 queued per slot 누적; RDMA라고 혼잡이 사라지지 않음. RoCEv2는 Ethernet/IP stack에서 congestion control 필요, IB는 별도 fabric/control plane 설계
- **displayText:** RDMA도 대기줄에서 자유롭진 않아요.
- **speechText:** 직접 메모리로 보낸다 해도 길이 좁거나 붐비면 기다려야 해요. 혼잡을 늘려보세요.
### 2 · 설명과 이해 검사
- **learningGoal:** 프로토콜 이름과 RDMA 동작을 분리하고 어떤 환경에서 congestion management를 검증할지 제시
- **priorKnowledge:** 08-S01 RDMA, networks
- **correctIncorrectCriteria:** 프로토콜 이름과 RDMA 동작을 분리하고 어떤 환경에서 congestion management를 검증할지 제시
- **misconceptions:** [m1] RoCE는 이더넷이 아니라 순수 InfiniBand 전용 물리 링크다; [m2] PFC를 켜면 패킷 손실·헤드오브라인/교착 문제가 무조건 0이다; [m3] RDMA는 네트워크 혼잡과 대기 시간을 완전히 없앤다
- **hints:** L1 RDMA는 메모리 접근 방식, 이더넷과 IB는 네트워크 인프라예요. / L2 입력이 서비스 속도보다 크면 큐는 어떻게 늘까요? / L3 PFC/ECN은 언제 동작하고 어떤 부작용이 있을까요?
- **feedback/correct:** "지금 선택한 이유가 실험 결과와 맞아요. 4 arrival−2 service=2 queued per slot 누적; RDMA라고 혼잡이 사라지지 않음. RoCEv2는 Ethernet/IP stack에서 congestion control 필요, IB는 별도 fabric/control plane 설계"
- **feedback/incorrect keyed:** [m1] RoCEv2는 RDMA transport를 Ethernet의 UDP/IP 위에서 사용해요. / [m2] PFC는 혼잡을 다루는 한 방식이지 안전·성능의 보편적 보증이 아니에요. / [m3] RDMA로 CPU 부담을 줄여도 스위치가 막히면 대기해야 해요.
- **explanation:** RoCEv2 및 IB 모두 RDMA 애플리케이션을 지원하지만 네트워크 제어·주소 지정과 운영이 다름. RoCE는 PFC/ECN 등으로 loss·congestion trade-off 관리. toy queue Qnext=min(Qmax,max(0,Q+arrivals−service)), drop=max(0,Q+arrivals−service−Qmax)로 정의; 실제 switch ingress/egress와 다름.
### 3 · 현업식 검증과 다음 질문
- **physicsAssumptions:** toy discrete queue packets/slot, buffer=8, PFC·ECN의 실제 threshold/flow config 단순화. PFC를 무조건 반드시 쓰는 설계라고 말하지 않음.
- **sourceRefs:** [N3][N4][N5]
- **verification/test:** 단위·부하·초기/steady state·실제 장비가 아닌 toy 표시 후 경계조건(0 bytes/무한 링크/혼잡/무지원 NIC)을 학생에게 질문.
- **failureCase:** 대역폭은 충분해도 CPU overhead, fabric congestion, protocol mismatch, buffer pressure, power/thermal·optics failure가 새 병목.
- **teachBack:** 학생은 한 조건을 바꾸어 다음 실험 결과를 예측하고, 엔지니어는 선택 아키텍처가 실패하는 조건을 말한다.
- **nextHook:** GPU 네 개가 합계를 서로 모두 알아야 한다면 네트워크를 얼마나 쓰게 될까요?

## 08-S03 · `nccl-allreduce-traffic`
### 1 · 질문/예측/관찰 (1분)
- **sceneId:** `nccl-allreduce-traffic`
- **storyHook:** GPU 네 대가 각자 계산했는데 결국 모두에게 같은 결과를 줘야 해요. 몇 번이나 주고받을까요?
- **question:** 링 올리듀스(AllReduce)에서 GPU 수가 늘면 통신량은 어떻게 될까요?
- **prediction:** 4개 GPU가 같은 크기 S 바이트 결과를 합치고 공유할 때, 2(N−1)/N 계수가 생길까요?
- **learnerAction:** N=2/4/8 ring toy GPU 배열, tensorBytes S=1 GiB(2^30 bytes), link B=16 GiB/s per rank (toy), 가상 timer로 ring lower-bound compare
- **modelInputs:** N 2/4/8 ranks, S 1GiB/rank, B 16GiB/s/link, algorithm ring only, zero software overhead
- **expectedObservation:** lower bound t≥(S/B)×2(N−1)/N: 2→0.0625s, 4→0.09375s, 8→0.109375s; 수학적 이상 링 모델상 N증가해도 통신량 부담이 생김
- **displayText:** 계산이 끝나도 서로 맞춰야 해요.
- **speechText:** 각 GPU가 계산을 끝냈는데도 서로 결과를 나눠야 해요. 숫자를 늘리면 통신은 얼마나 걸릴까요?
### 2 · 설명과 이해 검사
- **learningGoal:** (1) AllReduce=합+전체 전파, (2) 4 ranks에서 1.5×1/16s=0.09375s, (3) 이론 하한이지 보장 지연 아님 세 조건 모두 통과
- **priorKnowledge:** 08-S02 fabric latency, GPU sync
- **correctIncorrectCriteria:** (1) AllReduce=합+전체 전파, (2) 4 ranks에서 1.5×1/16s=0.09375s, (3) 이론 하한이지 보장 지연 아님 세 조건 모두 통과
- **misconceptions:** [m1] GPU가 늘면 통신 시간이 언제나 정확히 1/N이다; [m2] AllReduce는 데이터를 하나의 GPU로만 모으고 끝난다; [m3] ring의 수식은 어떤 네트워크 토폴로지·집합 알고리즘에도 정확히 맞는다
- **hints:** L1 결과를 합친 뒤 모든 GPU에 나누어 줘야 하지 않을까요? / L2 N=4이면 2×3/4=1.5랍니다. / L3 실제에서는 switch oversubscription·타 알고리즘·버퍼/링크·입자 대기시간이 없을까요?
- **feedback/correct:** "지금 선택한 이유가 실험 결과와 맞아요. lower bound t≥(S/B)×2(N−1)/N: 2→0.0625s, 4→0.09375s, 8→0.109375s; 수학적 이상 링 모델상 N증가해도 통신량 부담이 생김"
- **feedback/incorrect keyed:** [m1] 연산을 나눠도 서로 동기화하는 데이터 비용은 생겨요. / [m2] AllReduce는 결과가 모든 참여자에게 가는 연산이에요. / [m3] Ring/tensor/link의 조건을 바꾸면 tree, NVLink 등 다른 성능식이 나와요.
- **explanation:** NVIDIA nccl-tests PERFORMANCE.md의 AllReduce 버스 대역폭 환산 factor=2(N-1)/N 사용. Ring 완전중첩·균등 링크/이상 루트 조건에서 t≈S/B*factor. 네트워크 혼잡/프로토콜 지연, rank간 크기/통신 overlap·tree/SHARP/offload 등 대안은 별도.
### 3 · 현업식 검증과 다음 질문
- **physicsAssumptions:** 1GiB=2^30 bytes, 16GiB/s per rank toy effective link; lower bound not predicted product latency. N=8 0.109375s; congestion/collective implementation not measured.
- **sourceRefs:** [N6][N7]
- **verification/test:** 단위·부하·초기/steady state·실제 장비가 아닌 toy 표시 후 경계조건(0 bytes/무한 링크/혼잡/무지원 NIC)을 학생에게 질문.
- **failureCase:** 대역폭은 충분해도 CPU overhead, fabric congestion, protocol mismatch, buffer pressure, power/thermal·optics failure가 새 병목.
- **teachBack:** 학생은 한 조건을 바꾸어 다음 실험 결과를 예측하고, 엔지니어는 선택 아키텍처가 실패하는 조건을 말한다.
- **nextHook:** 데이터가 서버 밖으로 길게 달리면 전기 신호만으로 충분할까요?

## 08-S04 · `fiber-transceiver-energy`
### 1 · 질문/예측/관찰 (1분)
- **sceneId:** `fiber-transceiver-energy`
- **storyHook:** 랙 사이를 길게 연결할 때 전선에서 신호가 약해지거나 전력을 너무 많이 쓰면?
- **question:** 광섬유를 쓰면 대역폭·레이턴시·에너지 고민이 끝날까요?
- **prediction:** 스위치→전기 신호/트랜시버→광섬유→수광→전기 신호 경로에서 누가 열과 소비전력을 만들까요?
- **learnerAction:** copper/optical route select, transceiver power+switch heat toy 4 vs 6 W/end, transceiver count 4/8, link 100Gb/s toy and payload 1GB time calculator
- **modelInputs:** linkRate=100Gb/s toy, payload=1e9B toy, transceiverPower=4/6 W per end toy, links 4/8 toy
- **expectedObservation:** 최소 직렬화 지연 1e9×8/1e11=0.08s, 실제 프로토콜/큐/전파/광전변환 더해짐; 8 links×2 ends×4W=64W의 가상 광모듈 전력, 광도 전력 0이 아님
- **displayText:** 빛으로 연결해도 공짜는 아니에요.
- **speechText:** 전기는 빛으로 바뀌고, 다시 전기로 돌아와요. 케이블보다 양 끝 장치에서 어떤 비용이 생길까요?
### 2 · 설명과 이해 검사
- **learningGoal:** 광전변환·스위치·링크 양 끝 전력과 거리/실효 대역폭 트레이드오프를 제시; 보편 우월 주장 금지
- **priorKnowledge:** 08-S03 scale-out networking
- **correctIncorrectCriteria:** 광전변환·스위치·링크 양 끝 전력과 거리/실효 대역폭 트레이드오프를 제시; 보편 우월 주장 금지
- **misconceptions:** [m1] 광섬유 자체를 쓰면 송수신기의 전력은 0W다; [m2] 100Gb/s 링크에서 1GB 파일이 항상 정확히 0.08초에 완료된다; [m3] 광 인터커넥트는 HBM TSV와 같은 칩 내부 수직 연결이다
- **hints:** L1 전기→빛→전기는 무엇으로 바꿀까요? / L2 전송량÷속도 계산에 패킷 헤더·큐잉도 포함했나요? / L3 랙간 트랜시버와 실리콘 내부 TSV는 위치가 같을까요?
- **feedback/correct:** "지금 선택한 이유가 실험 결과와 맞아요. 최소 직렬화 지연 1e9×8/1e11=0.08s, 실제 프로토콜/큐/전파/광전변환 더해짐; 8 links×2 ends×4W=64W의 가상 광모듈 전력, 광도 전력 0이 아님"
- **feedback/incorrect keyed:** [m1] 레이저/광트랜시버·냉각과 전력 경로가 남아 있어요. / [m2] 0.08초는 단일 링크의 오버헤드 없는 직렬화 하한이에요. / [m3] TSV는 HBM 내부 층간, 광 모듈은 서버·스위치 사이 신호 전달에 쓰여요.
- **explanation:** Optical interconnect는 거리/전기 채널 손실/밀도 등을 고려한 기술 선택, 물리적으로 광전 변환부와 온도 관리가 남는다. CPO/NPO/pluggable은 광 엔진을 ASIC에 두는 거리·서비스성·전력 설계 차이가 있다. 이 장면은 제품 성능 예시가 아니라 네트워크 케이블/광 트랜시버의 역할만 평가.
### 3 · 현업식 검증과 다음 질문
- **physicsAssumptions:** 100Gb/s, 1e9B=decimal 1GB, 4W/6W per port toy (not product specification), link=4/8. 광전 전환/온도/통신 overhead 무시한 serial latency.
- **sourceRefs:** [N8][N9]
- **verification/test:** 단위·부하·초기/steady state·실제 장비가 아닌 toy 표시 후 경계조건(0 bytes/무한 링크/혼잡/무지원 NIC)을 학생에게 질문.
- **failureCase:** 대역폭은 충분해도 CPU overhead, fabric congestion, protocol mismatch, buffer pressure, power/thermal·optics failure가 새 병목.
- **teachBack:** 학생은 한 조건을 바꾸어 다음 실험 결과를 예측하고, 엔지니어는 선택 아키텍처가 실패하는 조건을 말한다.
- **nextHook:** 이 통신망을 지탱하는 전력과 냉각을 합치면 데이터센터의 실제 비용은 무엇이 될까요?

## A05 직접 구현 계약
모든 장면 **예측 먼저 / 실제 토글 다음 / 조건별 피드백 / why 클릭 후 원리 / 다음 질문**. NIC와 GPU 메모리 사이의 실제 선·방향을 혼동하지 않는다. 광모듈/속도 수치는 **toy**, 실제 특정 GPU/트랜시버 스펙 인용 금지. 모션 저감에서는 흐르는 점 대신 화살표+수치. 색상 외 모양/텍스트로 송수신 구분. 권장 전용 PR, 앱 엔진 변경 A02 책임.

## 공식 근거
[N1] https://networking-docs.nvidia.com/gpudirectrdma — GPUDirect RDMA manual (2025 revised)
[N2] https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/23.9.0/gpu-operator-rdma.html — GPUDirect Storage / RDMA 경로
[N3] https://docs.nvidia.com/networking-ethernet-software/cumulus-linux/Layer-1-and-Switch-Ports/Quality-of-Service/RDMA-over-Converged-Ethernet-RoCE/ — RoCE PFC·ECN 모드
[N4] https://networking-docs.nvidia.com/doca/archive/3-5-0/rdma-over-converged-ethernet — RDMA 및 RoCE 구조
[N5] https://www.nvidia.com/en-us/networking/products/infiniband/ — IB 개요(벤더)
[N6] https://github.com/NVIDIA/nccl-tests/blob/master/doc/PERFORMANCE.md — AllReduce 2(N−1)/N 검증
[N7] https://github.com/NVIDIA/nccl/blob/master/docs/userguide/source/env.rst — ring/tree/NVLS 대안
[N8] https://perspectives.nvidia.com/networking/ — 2026-08 network/optics 제품 설명 (벤더 주장 구분)
[N9] https://www.nvidia.com/en-us/networking/ — switch/transceiver 제품 범주, 실제 전력 수치 미인용.
