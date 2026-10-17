# A06 senior deep dive 08 — RDMA/IB/RoCE/collectives/optical fabric
CheckedAt: 2026-10-17 KST · Evidence: NVIDIA networking docs + open-source NCCL formula · real vendor/standard specifics needs independent hardware check.

## Domain separation
1. DMA는 NIC↔system/GPU memory data transfer engine; RDMA는 원격 호스트 메모리 대상 통신/transport·API이자 registration/security/ordering mechanism. CPU를 모든 역할에서 완전히 없앤다는 뜻이 아님. [N1][N2]
2. GPUDirect RDMA는 지원 GPU/NIC/driver/PCIe topology에서 peer memory 경로 가능, host bounce copy 감소. GPUDirect **Storage**는 local/remote storage↔GPU 데이터 경로의 또 다른 범주이며 모든 SSD/GPU가 지원하는 기본 동작은 아님. [N1][N2]
3. **InfiniBand**는 Ethernet의 속도 이름이 아닌 별도 fabric; **RoCEv2**는 RDMA transport over Ethernet UDP/IP, ECN/PFC/lossless policy가 운영 변수. RoCEv2 lossless PFC는 하나의 선택지이며 전용 "항상 무손실 네트워크"로 과장 금지. [N3][N4][N5]
4. 통신은 software overhead(launch, queuing, synchronization), PCIe/NVLink, NIC/port, transceiver/link, switch congestion, host topology, collective algo 모두 합쳐진 결과.

## 식 검증·단위
- Rate conversion: 100 Gb/s ÷8=12.5 GB/s **theoretical serial**. 1 GB decimal payload=8e9 bits, at 1e11 bit/s serialization=0.08 s. 실제 프레임·헤더·FEC·전파·retry·큐 대기 및 duplex direction 때문에 애플리케이션 결과는 느릴 수 있다.
- Ring AllReduce ideal: per rank `t≈S/B·2(N−1)/N`. NCCL test의 "busbw" 보정인자가 그 수식으로 기록되어 있으나 **다른 NCCL 알고리즘으로 바뀌면 성능 경로가 달라짐**. N=4, S=1GiB, B=16GiB/s ⇒ (1/16)×1.5=0.09375 s. N=2⇒0.0625, N=8⇒0.109375. 이는 optimistic lower bound / toy effective rank BW, topology oversubscription·per-link serialization/packet overhead 제외. [N6][N7].
- Toy switch queue: arrivals=4/slot, service=2/slot⇒queue+2/slot (cap=8). 실제 packet buffer, queue disciplines, priority/ECN do not follow exact toy independent formula.
- Optical: link/transceiver power toy 4 W/end×2 ends×8 links=64 W. **절대 제품 정격이 아님**; link speed·laser·PHY/optic integration and reach are not omitted when modeling real power.

## 현업 failure modes/보안/측정
- RoCE high load + burst → packet loss/retransmission/ECN/PFC and head-of-line blocking; **측정** NIC counters queue drops/ECN, per-hop buffer & p99 latency, trace CPU copies.
- NIC DMA/GPU peer memory → memory registration/IOMMU restrictions, OOM/capacity, NCCL collective hangs under failed rank. 직통 데이터 경로를 보안 무설정으로 설명 금지.
- "Optical switch always faster" 금지: long links / crosstalk constraints vs optical module cost/heat/serviceability/energy. CPO/NPO/switch silicon-photonics vendor claim and production SKU need cross-check.
- 운영: scale-up GPU link (NVLink etc) vs scale-out NIC/switch vs scale-across DC. 데이터센터 모든 통신을 '광=네트워크'로 환원하지 않는다.

## novice translation
① “서버끼리 데이터를 주고받는 데 CPU가 꼭 복사해야 할까요?” ② IB/RoCE/스위치 큐 조작. ③ 집합연산 AllReduce의 계산·통신 하한과 congestion/optic watts를 비교해 어느 토폴로지를 선택할지 이유 3개로 답.

## Sources
- [N1] https://networking-docs.nvidia.com/gpudirectrdma · updated 2025 vendor user guide · high
- [N2] https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/23.9.0/gpu-operator-rdma.html · GPU Operator GDS/RDMA · high for mechanism, environment-specific
- [N3] https://docs.nvidia.com/networking-ethernet-software/cumulus-linux/Layer-1-and-Switch-Ports/Quality-of-Service/RDMA-over-Converged-Ethernet-RoCE/ · vendor operational guidance · high
- [N4] https://networking-docs.nvidia.com/doca/archive/3-5-0/rdma-over-converged-ethernet · vendor guide · high for protocol, versioned
- [N5] https://www.nvidia.com/en-us/networking/products/infiniband/ · marketing overview · medium
- [N6] https://github.com/NVIDIA/nccl-tests/blob/master/doc/PERFORMANCE.md · NVIDIA open source formula · high
- [N7] https://github.com/NVIDIA/nccl/blob/master/docs/userguide/source/env.rst · NCCL algorithm list · high
- [N8] https://perspectives.nvidia.com/networking/ · Aug 2026 product promotion · medium; product-specific optical comparisons unverified
- [N9] https://www.nvidia.com/en-us/networking/ · product category, no certified W/port · medium
**Unresolved:** cross-vendor RoCE feature parity, CPO pluggable optics 2026 official IEEE/OIF specs, exact GPU/NIC topology. These stay candidates, not factual user claims.
