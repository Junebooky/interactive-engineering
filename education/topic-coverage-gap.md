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
