# A06 Curriculum Atlas v0.1 — 반도체부터 AI 데이터센터까지
작성·검증: 2026-10-17 | 상태: 전체 지형도 구축, 초기 4개 스토리보드 우선 제작. **지형도 수록 ≠ 레슨 전체 제작 완료.**

## 한 편의 이야기: 왜 AI는 이렇게 많은 반도체를 필요로 할까?
손으로 누르지 않아도 전기 흐름을 바꾸는 MOSFET → 0/1 논리를 만드는 CMOS → 계산 결과를 붙잡아 둘 SRAM/DRAM → 전원이 꺼져도 남는 NAND/eSSD → CPU/GPU/AI 가속기의 병렬 계산 → 데이터가 늦게 와서 생기는 병목 → DDR/RDIMM·GDDR6/GDDR7·HBM의 서로 다른 해결책 → PCIe/NVMe/CXL/네트워크 → 칩렛/TSV/2.5D·3D 반도체 패키징 → 전력·냉각·제조·수율 → **한 데이터가 저장되고, 옮겨지고, 계산되고, 응답/체크포인트로 돌아오는 여정**. 
각 엣지는 “지금까지 배운 방식으로는 왜 부족할까?”라는 학생 질문으로 연결한다.

## 필수 개념 연결 지도와 개설 계획
| ID · 깊이 | 기술·공백 포함 영역 | 필수 선수 | 다음 질문 |
|---|---|---|---|
| F01 필수 기초 | 전하, 전압/전기장/전류, 전압원, 저항, 커패시터, 전력, 열 | 없음 | 전기로 스위치 조작? |
| F02 필수 기초 | 실리콘/밴드/도핑/전자·정공, PN 접합, 다이오드 | F01 | 전류 길을 어떻게 열지? |
| F03 필수 기초 | MOS capacitor, nMOS/pMOS, VGS/VDS, 채널·문턱·누설 | F02 | 0/1은 어디서 생길까? |
| F04 필수 기초 | 저항형 인버터→CMOS, NAND/NOR, 논리레벨·게이트 | F03 | 1을 어떻게 기억할까? |
| M01 필수 기초 | SRAM/래치/플립플롭/레지스터/캐시와 DRAM 1T1C 비교 | F04 | 대용량을 싸게 저장? |
| M02 필수 기초 | DRAM WL/BL, 쓰기, 전하공유, 센스앰프, 복원, 누설·리프레시 | M01 | 동시에 많이 읽으면? |
| M03 필수 중급 | 행/열/뱅크, 활성화·프리차지, 레이턴시/대역폭/용량 | M02 | 연산기마다 다른 램? |
| M04 필수 중급 | DDR5/DDR4, 서버 DDR/RDIMM, ECC, LPDDR, MRDIMM(심화) | M03 | GPU는 왜 별도 메모리? |
| M05 필수 중급 | GDDR6·GDDR7, NRZ/PAM3, I/O 폭·데이터 전송률 | M03 | 더 넓은 연결은? |
| M06 필수 중급 | HBM은 적층 DRAM, TSV·넓은 I/O, 열/비용 제약 | M05,P02 개념 예고 | 그래서 SSD는 여전히 필요한가? |
| M07 선택 심화 | CXL 메모리 확장, NUMA, pooling, RDIMM vs MRDIMM | M04,I02 | 멀리 둔 메모리의 비용? |
| S01 필수 기초 | NAND/NOR Flash, 임계 전압에 정보 저장, 3D NAND | F03,M01 | 같은 자리에 수정 쓰기? |
| S02 필수 중급 | NAND 페이지/블록, program/read/erase, SLC/MLC/TLC/QLC | S01 | SSD 내부에 관리자가? |
| S03 필수 중급 | 컨트롤러, FTL, GC, 마모평준화, ECC/OP, eSSD·PLP/QoS | S02 | 호스트에 어떻게 연결? |
| S04 필수 중급 | SSD/HDD, PCIe, NVMe 명령/큐, DMA, EDSFF | S03,I02 | 여러 서버에 저장 공유? |
| S05 선택 심화 | NVMe-oF, ZNS, NVMe TCP/RDMA, tail latency/DWPD | S04,I03 | 데이터가 연산 전에 올까? |
| C01 필수 기초 | CPU·명령어·코어·파이프라인·캐시 | F04,M01 | 독립 계산 수천 개를? |
| C02 필수 중급 | GPU/SIMT·행렬곱, NPU/ASIC·FPGA 대안 | C01 | 계산보다 읽기가 느리면? |
| C03 필수 중급 | AI 학습/추론, weight/activation/KV cache, 산술집약도 | C02,M05 | 단일 GPU를 넘어서면? |
| C04 선택 심화 | sparsity, quantization, offload, tensor parallel, scheduling | C03 | 통신이 새 병목? |
| I01 필수 중급 | bit vs byte, GB/s vs ns, wire/signal, 병렬 버스·직렬 링크 | F01 | 먼 장치도 연결해 볼까? |
| I02 필수 중급 | PCIe root/switch/topology, NUMA, 메모리 경로 | I01 | 자원을 더 늘리면? |
| I03 필수 중급 | NIC/DPU/RDMA, Ethernet/InfiniBand/광통신, 스위치·랙 | I02 | 여러 GPU가 동기화하려면? |
| I04 선택 심화 | CXL.io/cache/mem, NVLink/collectives, UALink 검토 후보 | I03,C03 | 랙 전체 최적화란? |
| P01 필수 중급 | 웨이퍼/노광/증착/식각/주입/배선/검사/수율 | F02 | 큰 칩을 다 만들 수 있나? |
| P02 필수 중급 | 다이/칩렛, 2.5D/3D 실제 패키징, 인터포저/TSV | P01 | 왜 전력이 문제? |
| P03 필수 중급 | VRM/PMIC/전력반도체, 냉각/열, 전원 신뢰성 | P02,C03 | 랙 전체는 어떻게 버틸까? |
| P04 선택 심화 | GaN/SiC, PDN, 열저항, HBM 열·테스트 비용 | P03 | 어떤 설계가 효율적? |
| D01 필수 심화 | CPU+DDR+GPU+GDDR/HBM+eSSD+NIC+전원/냉각 한 데이터 경로 | C03,S04,I03,P03 | 학습·추론·체크포인트가 어떻게 다를까? |
| D02 선택 심화 | 데이터센터 서비스 품질·비용·장애·분산 학습/추론 | D01 | 전체를 어떻게 최적화할까? |

## DAG (순환 없는 의존성)
- F01 → F02 → F03 → F04 → M01 → M02 → M03 → M04 → M05
- F03 → S01 → S02 → S03 → S04 → S05
- F04 → C01 → C02 → C03 → C04
- F02 → P01 → P02 → P03 → P04
- F01 → I01 → I02 → I03 → I04
- M05 + P02 → M06 → M07 (M06의 첫 소개 때 P02의 단면 **티저**만 제공, 정규 심화는 P02 학습 뒤)
- C03 + S04 + I03 + P03 + M06 → D01 → D02

## 네 개의 제작 우선 레슨
1. [MOSFET에서 논리까지](lessons/01-mosfet-to-logic.md): 채널≠전류, ON≠출력1, CMOS의 필요 → SRAM/DRAM의 질문.
2. [DRAM 1T1C](lessons/02-dram-bit-cell.md): 쓰기→전하공유 읽기→복원→리프레시→뱅크.
3. [GPU와 메모리 병목](lessons/03-gpu-memory-bottleneck.md): 계산속도≠공급속도→서버 DDR/GDDR6·7/HBM과 트레이드오프.
4. [NAND/eSSD에서 데이터센터까지](lessons/04-nand-essd-data-center.md): 비휘발 저장→페이지/블록→FTL→NVMe/PCIe→AI 결과.

## End-to-end 경로: '내 질문이 AI 답변이 되는 길'
웹 요청→서버 NIC→CPU가 전처리·스케줄링→이미 HBM/GDDR에 적재된 모델 또는 외부 eSSD/스토리지의 모델 로딩→CPU DDR/전송링크(대표 경로는 PCIe, 대안 경로 존재)→GPU/NPU 메모리·캐시→텐서 연산→KV cache 갱신→생성된 결과→네트워크 반환. 학습은 데이터셋 재공급·다중 GPU 동기화·체크포인트 저장을 추가. 모든 요청이 SSD에서 매 토큰 가중치를 새로 읽는다고 주장하지 않는다.

**성공 기준**: 학습자가 각 기술을 “왜 필요→어떻게→한계→다음 기술”로 설명한다. 제품 이름 암기/점수·XP·스트릭·랭킹은 설계하지 않는다.

**비유의 경계**: '넓은 길'=대역폭이지 짧은 대기시간·큰 용량의 보증이 아니다. '전자 길'=전자 이동과 관습 전류 방향 차이를 지워서는 안 된다. 교육용 시각 2.5D ≠ 반도체 2.5D 패키징.

**근거:** [accuracy-notes.md](accuracy-notes.md) (2026-10-17 출처/assumptions/신뢰도), [topic-coverage-gap.md](topic-coverage-gap.md) (미제작/누락/후보).


## 2026-10-17 확장판 v0.2 — 누락 엣지에 실제 질문·장면 배치
**새 정규 레슨 두 개 / 총 6개·25 Step 문서화**, 앱 구현/브라우저 동작과 구분:
- [05 · 인버터 두 개가 기억이 될까? SRAM 6T→CPU 캐시](lessons/05-sram-cpu-cache.md): M01-S04 CMOS 이후 질문(쌍방 되먹임으로 비트를 유지?) → 6T WL/BLB → 1/2라인 toy 캐시 miss/hit → DDR/GDDR/HBM 재사용. **M01→05→02 DRAM→03 GPU**를 추천 학습 경로로 추가. 학습자가 02를 먼저 배웠다면 05를 가로로 연결 가능. SRAM은 휘발성이지만 DRAM 1T1C와 달리 주기적 셀 refresh를 하지 않는다.
- [06 · 제조·칩렛·TSV·실제 2.5D 패키징](lessons/06-hbm-chiplet-packaging.md): 반복 웨이퍼 공정/수율 → 양품 다이 선별/칩렛 비용 → HBM TSV vs 인터포저 배선 → 전력·열저항. G03의 HBM 패키징은 이 레슨을 위한 **예고**였고 실제 심화는 06을 우선 확인.
- 질문 흐름: "CMOS NOT으로 1을 만들었어→그 1을 스스로 붙잡는 법은?→SRAM은 빠르지만 왜 작을까?→DRAM은 왜 전하로 바꾸지?→메모리 속도가 부족하면?→HBM은 왜 옆에서 적층되지?→수율과 열은 어떻게 풀지?→전원/냉각/서버 네트워크는 어떻게 이어질까?"
- 업데이트된 산업 증거(검증일 2026-10-17): [S21] Hamburg 6T SRAM, [S22/S23] Arm CPU cache hierarchy, [S25] TSMC CoWoS package variants, [S26] Micron HBM stack, [S27] ASML 제조 레이어 반복. 상세 URL은 accuracy notes.
- **남은 대형 필수 레슨:** PN junction 심화, DDR/RDIMM/LPDDR 상세, 네트워크 NIC/DPU/RDMA/광, 전력 VRM/PMIC·냉각/랙, 분산 AI 데이터센터 end-to-end 심화. 이들이 미완료인 상태에서 '모든 반도체 교육 완성' 선언 금지.


## 2026-10-17 Research Round 03: 시스템에서 빠진 네 가지 다리 (v0.3)
**정규 레슨 명세: 10개 / 41 Step** — 기존 6개·25 Step에 신규 4개·16 Step 추가. **시니어 deep dives 5개와 question bank로 증거/제약/고장 모드까지 확장**, A05 시각 구현 및 앱 통합은 별도.

**새 07 → 08 → 09 → 10**
- [07 DDR5/RDIMM/MRDIMM/LPDDR5X SOCAMM2/CXL 4.0](lessons/07-server-memory-tiers.md), 4 Step. DRAM bank→서버 DDR의 폭/지연→명령 register/RAS→저전력 LPDDR/SOCAMM2→CXL 원격 tier. **새 기술 발견: JEDEC SOCAMM2 2026-06, CXL 4.0(2025-11-18 공식 발표)**. CXL 3.2를 최신으로 잘못 가르치지 않는다. 주제별 [deep dive](deep-dives/07-memory-systems.md).
- [08 NIC/DPU·RoCE/InfiniBand·NCCL allreduce·광 인터커넥트](lessons/08-ai-fabric-rdma-optics.md), 4 Step. 분산 GPU 전송→RDMA→혼잡→집합연산 통신량→광트랜시버/전력. [Deep dive](deep-dives/08-network-fabric.md).
- [09 QLC/NAND·GC/WAF·eSSD PLP·DWPD/p99 QoS](lessons/09-essd-reliability.md), 4 Step. NAND 저장 밀도→쓰기 증폭→전원 장애 데이터 보호→tail latency. [Deep dive](deep-dives/09-ssd-reliability.md).
- [10 AI roofline·prefill/decode·KV cache·PUE·end-to-end resilience](lessons/10-ai-datacenter-end-to-end.md), 4 Step. 메모리/계산 roofline→토큰/KV residency→전력/냉각→네트워크·스토리지 장애복구. [Deep dive](deep-dives/10-ai-systems.md).

**인과 DAG 확대**:
`02 D02 + 05 SRAM → 07 server memory tiers → 08 NIC/RDMA/collectives`;
`04 NAND/eSSD → 09 SSD reliability`;
`03 GPU bottleneck + 06 HBM packaging + 07 tiered memory + 08 fabric + 09 SSD reliability → 10 AI datacenter end-to-end`.
기존 03 HBM/GDDR와 새 07 DDR/CXL은 대체관계가 아니라 서로 다른 데이터 이동·보존·용량계층. 실제 열/데이터센터 응용 시 **전력 06 → 10 PUE**로 연결.

**유지보수 필수 구분**:
- DDR5 on-die ECC ≠ system ECC; RDIMM command/address RCD ≠ MRDIMM data buffer/rank mux; LPDDR/SOCAMM2 ≠ HBM 적층.
- GT/s ≠ GB/s; CXL 4.0 발표의 128GT/s ≠ 모든 CPU의 실효 대역폭/DDR 같은 지연 보증.
- RDMA≠네트워크 없는 마법, ethernet RoCE와 IB는 다른 fabric, NCCL ring factor는 toy lower bound.
- eSSD의 PLP와 제품별 ACK/Flush 계약은 모델별; NAND GC WAF, 99th QoS/수명·워크로드 필요.
- roofline P≤min(compute, BW×intensity) upper bound ≠ 앱의 실제 TTFT. PUE는 site-to-IT energy ratio이지 IT 토큰/와트의 보증치 아님.
- 제조사 마케팅의 상대 개선 숫자는 가정/시험조건/제품 SKU 검증 없이 어떤 모든 고객 사례에도 적용하지 않는다.

**후속 과학 QA**: [D02 read/sense/refresh 물리 노트](deep-dives/02-dram-sense-timing.md), [A05 PR #10 검토](a05-d02-cross-qa.md). **연구 반복 질문:** [round-03 question bank](research-notes/round-03-question-bank.md). 구현 브랜치/PR은 A05·A02 소유, A06 원고만.
