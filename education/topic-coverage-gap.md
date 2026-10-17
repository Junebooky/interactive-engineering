> **2026-10-17 Atlas v1 우선:** 아래 초기 P0/결손표는 *과거 스냅샷*이며 [115-topic curriculum-atlas-v1.md](curriculum-atlas-v1.md), [실시간 학습-production queue](production-backlog.md)가 권위 있는 최신 자료입니다. 도핑/PN 11과 전압·RC 12는 STORY_READY, MOS capacitor 14는 RESEARCHING입니다. 이어지는 16 논리/clock, 29 PCIe/SerDes, 31 PSU/VRM·냉각, 32 DC capstone은 미작성. 신규 영역 ADC·MEMS·광검출·CFET·UCIe3/PCIe7·ESD/DFT·ZNS·MRAM 등 총 115개 ID로 분류.

# A06 Topic Coverage & Gap Register
점검: 2026-10-17. **인벤토리를 작성했다고 모든 레슨을 완성했다고 주장하지 않음.**

| priority | candidate-topics | dependencies | 왜 필요한가 · 누락 상태 | 근거 |
|---|---|---|---|---|
| P0 | 도핑/PN/밴드 | F01 | MOS 이전 물질 논리 심화 레슨 필요 | 교과서 검증 대기 |
| P0 | SRAM/CPU 캐시·레지스터 | F04 | DRAM의 다른 대안 이해 필수 | [S1] |
| P0 | 2.5D/3D 패키징, TSV, 인터포저, chiplet | P01 | HBM 구조·열 설계 연결할 전용 레슨 미제작 | [S11] |
| P0 | Ethernet/InfiniBand, NIC/DPU, RDMA, 광통신 | I01,I02 | 랙 간 병목 전용 레슨 미제작 | [S12] |
| P0 | VRM, PMIC, 전력/냉각 | P02,C03 | 전체 데이터센터의 숨은 제약 | 추가 표준 검증 |
| P0 | 반도체 공정/검사/수율 | F02 | 설계가 어떻게 실제 칩이 되는지 | 추가 표준 검증 |
| P1 | DDR5/RDIMM/MRDIMM ECC과 실제 속도 비교 | M03 | 대역폭/용량/안정성 혼동 방지 | [S4][S13] |
| P1 | PCIe/CXL memory pooling/NUMA | I02,M04 | 다른 위치의 메모리는 얼마나 느린가 | [S15] |
| P1 | NAND 3D/TLC/QLC·write amplification | S02 | 내구성과 밀도의 트레이드오프 | [S6][S7] |
| P1 | ZNS/NVMe-oF | S04,I03 | 새로운 스토리지 프로토콜/설계 | [S8][S14] |
| P1 | AI weight/KV cache/추론 vs 학습/roofline | C02,M05 | 데이터 이동 병목을 실제 AI로 연결 | 관련 문헌 확장 필요 |
| P2 | eSSD PLP/DWPD/99p latency/ECC/DRAMless | S03 | 모든 eSSD가 같은 기능을 갖는다는 오개념 방지 | 개별 SSD 스펙 확보 |
| P2 | GaN/SiC 전력반도체, 광 CPO, UALink, 신규 HBM 세대 | P03,I03,M06 | 산업 변화가 커 계속 재검토 | 공식 표준/제품별 검증 대기 |

## 이미 초안 레슨에서 다루는 기술
01 MOSFET·CMOS·논리 / 02 DRAM 감지·리프레시·뱅크 / 03 GPU·DDR·RDIMM·GDDR6/GDDR7·HBM / 04 NAND·eSSD·NVMe·PCIe·데이터센터 end-to-end 티저.

## 중복·오개념 위험
- HBM=DRAM 종류이지 SSD나 GPU 계산 코어가 아니다. GDDR6/7과 HBM은 워크로드/비용/패키징 조건별 선택.
- eSSD=enterprise SSD. 모든 SSD에 DRAM cache 또는 PLP가 있다고 단정 금지.
- GDDR7의 PAM3는 3비트/클럭이라는 뜻이 아니다.
- PCIe(전송)/NVMe(호스트-스토리지 프로토콜)/SSD(장치)/NAND(매체)는 서로 다른 층이다.
- EUV/공정 노드 숫자를 특정 transistor 치수라고 단정 금지.
- 2.5D SVG 교육 스타일과 2.5D semiconductor packaging을 혼동하지 않는다.

## 조사 질문 / improvement-backlog 연결
왜 HBM이 모든 GPU를 대체하지 않는가? / 모델이 이미 VRAM에 있는데 eSSD가 매 토큰 필요할까? / CXL 메모리 확장은 HBM을 완전히 대체하는가? / QoS는 평균만 보아도 되는가? / 새 GDDR/HBM/PCIe/NVMe 세대가 실제 제품에 적용되었는가? → 확인한 답만 본 레슨으로 승격하고 출처/검증일/버전 보관.


## 2026-10-17 추가 조사/완료 상태 업데이트
- 기존 P0 "SRAM/CPU 캐시·레지스터": **05 레슨에서 6T·hit/miss/CPU↔DRAM 데이터 지역성 4-Step 스토리보드 제작**. 레지스터·TLB·일관성/NUMA의 심화는 여전히 후보.
- 기존 P0 "2.5D/3D 패키징, TSV, 인터포저, chiplet": **06 레슨에서 웨이퍼 제조·칩렛 Poisson toy·HBM TSV·인터포저·열 4-Step 스토리보드 제작**. 신호·전력 무결성/실제 CoWoS-S/R/L/SRAM-HBM 연결과 비용·테스트 심화는 남음.
- 새 P0 "학습자 경로 분기": 01 CMOS의 다음 질문은 **SRAM 05**와 **DRAM 02**를 나란히 제시. SRAM용 6T 저장과 DRAM 1T1C 저장의 휘발성/리프레시 차이, 캐시라인/DDR 구분.
- 새 P1 "패키징 수율 모델의 오개념": Y=exp(-D×A)는 **다이 양품 확률**이며 KGD/조립·패키지 수율을 빼고 '칩렛 전체 수율 높다' 단정하지 않기.
- 새 P1 "광 인터커넥트": 단순 전송률뿐 아니라 트랜시버/전력/거리/광모듈·스위치 포함. 제품/표준 수치 확인 없이 도식만 구분.
- 리뷰 수정: G03-S01 완전 파이프라인 중첩과 직렬 모델의 시간 결과를 명시; N04-S03 오개념 3개 각각 별도 피드백, N04-S04 command와 read payload 분리.
- 추가 검증: 05는 Hamburg 대학 6T + Arm 2026 cache, 06은 ASML 제조·TSMC CoWoS 및 SoIC/3DFabric·Micron HBM를 활용([accuracy-notes](accuracy-notes.md)).


## Round 03 coverage 업데이트 / 계속 누락 발굴
- **07 완료(교육명세):** DDR5 channel data rate vs tRCD/tCL, RDIMM command register, MRDIMM rank multiplex, LPDDR5X/SOCAMM2, CXL 4.0 memory tiering. 기존 'CXL 3.x 최신'처럼 단정했던 기록은 2025-11-18 공식 CXL 4.0 발표로 업데이트. 장치 출하·운영 지원은 별도 검증.
- **08 완료(교육명세):** NIC·RDMA·GPUDirect, RoCE vs InfiniBand, NCCL AllReduce factor, Ethernet/optics transceiver. **CPO/OIF·광 FEC·리타이머·PFC 운영 실패**는 심화 backlog에 남음.
- **09 완료(교육명세):** QLC Vth toy, FTL GC/WAF, eSSD PLP capacitor toy, DWPD vs p99 latency. **특정 SSD의 DRAM/PLP/데이터 보증·ZNS 지원**은 SKU별 검증 전 공개 불가.
- **10 완료(교육명세):** roofline, prefill/decode/KV cache, site PUE vs IT utilization, AI inference/train/checkpoint와 장애 복구. **실물 서비스 SLA, 냉각·물·전력 계측**은 미실행.
- **D02 deep dive**: charge-sharing ΔV ±0.05 toy, sense amp positive feedback/restore, tRCD vs tRAS/tRP, offset/PVT와 refresh의 관계 확인. A05 Draft PR #10 source QA의 셀0에서 고정 0.55V copy 버그/복원 스냅샷 오개념 개선 요청.

### 스스로 발굴한 후속 핵심 후보 (완료 아닌 backlog)
| Priority | 새 후보 | 선수 | 이유 / 근거 검증 |
|---|---|---|---|
| P0 | RowHammer/TRR/retention heterogeneity, ECC scrubbing, DDR5 RAS | D02,07 | DRAM이 데이터 손상을 완전히 막는가? 표준·학술 교차 검증 대기 |
| P0 | Device FinFET→GAA/nanosheet/CFET, gate leakage, BTI/hot carriers | F02,F03,P01 | 장채널 MOS toy가 현대 로직에서 어디서 깨지나? 공정별 공식 제조사 소스 필요 |
| P0 | eSSD namespace/ZNS, NVMe-oF TCP/RDMA, checkpoint consistency | 04,08,09 | host FT/파일시스템·장치 durability 구분 |
| P1 | HBM4/HBM4E 세대 및 GDDR7 실제 비교/JEDEC 원문 | G03,06,07 | 공인 표준/공급 가능 SKU별 전력과 데이터레이트 재검증 |
| P1 | DRAM PIM/CIM, CXL memory semantics and accelerators | D02,05,07 | 메모리 이동 병목을 계산을 옮겨서 줄일까? |
| P1 | Silicon photonics CPO/NPO, OIF/IEEE FEC/optical efficiency | 08 | 광도 열/전력·서비스 성능 제약이 남는가? |
| P1 | GaN/SiC PSU, VRM/PDN, liquid cooling CDU, PUE/WUE/CUE | 06,10 | IT load에 대한 실제 에너지·수자원·신뢰성 |
| P1 | Advanced AI runtime: tensor parallel, MIG, paged KV, quantization NVFP4, queue scheduler | 05,08,10 | prefill/decode kernel 속도를 어떻게 실측/튜닝? |

우선 탐색은 A01 Issue #6 기준: D02 감지·복원 정확성, 서버 DRAM/GDDR/HBM, enterprise SSD durability, AI DC GPU+전력/네트워크. **41개 Step은 교육 명세 개수일 뿐, 학생 실기기 QA/프로덕션 이행 비율로 환산 금지.**
