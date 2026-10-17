# A06 Production Backlog · 2026-10-17
> 최신 계약: Issue #6. Atlas v1 115개 DAG topic. 콘텐츠 **12 lessons / 50 documented Step**, 제품 UI·학습자 QA는 별도. 오너의 A01 레슨별 사전 승인 게이트 없음. 앱 코드 A02, scene A05, 원고/교차 QA A06. GitHub 작성만으로 타 에이전트 자동 기동 X.

## 상태 전환의 증거 (타 소유자 명의로 임의 완료 금지)
RESEARCHING (A06 sources/questions, not handoff) → STORY_READY (A06 vetted sources/model limits/3 misconception+hints/Voice/Step spec, **A05 제작 즉시 가능**) → A05_IN_PROGRESS (A05 branch/PR evidence) → SCENE_READY (A05 typed scene plus browser/mobile+CI and science review) → A02_INTEGRATING (A02 app engine/Voice/progress PR) → APP_QA (실제 앱 학습 flow, 접근성/Voice·regression/화면) → COMPLETE (오너 승인된 제공 범위의 최종 QA까지 완료).
- 하나의 레슨에 **여러 산출물 서로 다른 상태** 가능. M01 scene/browser A05 보고는 A02 앱 학습 전체의 브라우저 통과가 아님.
- 완성된 11/12는 STORY_READY이지 2.5D·프로덕션 구현이 아님.
- A06 next rank: 필수 선수 개념 영향(4점×0..3)+후속 가지수(3점×0..3)+A05 제작가능성(2점×0..3)+근거확실성(2점×0..3)−최신 SKU 미검증위험(3점×0..3). 순위는 기획용, 실제 마케팅 KPI가 아님.

## 핵심 코어 제작 현황
| 학습 ID | 선수 · 이어지는 원리 | Pipeline current status | Owner + GitHub 증거 | 차단/다음 단계 |
|---|---|---|---|---|
| 12 전기/V-I-R/RC/Power | 없음 → 11,14,01,02,31 | **STORY_READY** 4 Step | A06 [원고](lessons/12-electricity-rc-foundations.md) | A05 새 독립 PR, D02 QA 이후 우선 |
| 11 도핑/PN | 12 일부 → 14/01/22/24 | **STORY_READY** 5 Step | A06 [원고](lessons/11-doping-pn-foundations.md) · [senior note](deep-dives/11-pn-foundations.md) | A05 12 뒤, polarity와 drift/diffusion 보존 |
| 01 MOSFET/CMOS | 11,14 bridge 예고 | **A02_INTEGRATING** | A05 [#8](https://github.com/Junebooky/interactive-engineering/pull/8), A02 [#9](https://github.com/Junebooky/interactive-engineering/pull/9) | 최신 브라우저·통합 learner flow 상태 별개 QA |
| 02 DRAM | 11/12/01 | **A05_IN_PROGRESS** | A05 [#10](https://github.com/Junebooky/interactive-engineering/pull/10), A06 [D02 source QA](a05-d02-cross-qa.md) | S02 cell0 UI 문구 0.55 vs physics 0.45 고정 → 수정·실브라우저/Voice QA → A02 handoff |
| 05 SRAM/CPU cache | 01/16 | **STORY_READY** 4 Step | A06 [05](lessons/05-sram-cpu-cache.md) | A05 scene after foundations, D02 |
| 03 GPU DDR/GDDR/HBM | 02/05/17 | **STORY_READY** 4 Step | A06 [03](lessons/03-gpu-memory-bottleneck.md) | pipeline overlap 가정 표시 |
| 04 NAND/eSSD/NVMe | 11/02/03 | **STORY_READY** 5 Step | A06 [04](lessons/04-nand-essd-data-center.md) | command vs return payload 방향 |
| 06 wafer/chiplet/TSV/heat | 11/03/20 | **STORY_READY** 4 Step | A06 [06](lessons/06-hbm-chiplet-packaging.md) | KGD와 package yield/thermal toy |
| 07 DDR5/MRDIMM/LPDDR/CXL | 02/03 | **STORY_READY** 4 Step | A06 [07](lessons/07-server-memory-tiers.md) | 제품별 호환성·표준원문 불확실성 |
| 08 NIC/RDMA/IB/NCCL/optic | 03/07/29 | **STORY_READY** 4 Step | A06 [08](lessons/08-ai-fabric-rdma-optics.md) | transport와 CPU data-copy 분리 |
| 09 NAND/eSSD reliability | 04/07 | **STORY_READY** 4 Step | A06 [09](lessons/09-essd-reliability.md) | PLP/ACK/SKU별 조건 |
| 10 AI DC end-to-end | 03/04/07/08/09/31 | **STORY_READY** 4 Step | A06 [10](lessons/10-ai-datacenter-end-to-end.md) | 실제 앱/시설 E2E 계측 전 |

## 다음 A06 자동 선정 (지시 대기 없음)
| 우선 | planned lesson / missing concept | 선수 | Current state/책임/자료 | 완료 조건 |
|---|---|---|---|---|
| P0 | **14 MOS capacitor accumulation/depletion/inversion** | 11,12 | **RESEARCHING A06** [근거 노트](research-notes/14-mos-capacitor-research.md) | 4-Step·물리 사양/3 오개념·힌트·Voice → STORY_READY → A05 #4 |
| P0 | 16 combinational/sequential logic/clock | 01,12 | RESEARCH_CANDIDATE A06 | standalone DFF/clock scene |
| P0 | 29 SerDes PCIe 7.0 PHY/IOMMU | 07/12/17 | RESEARCH_CANDIDATE A06 | bit transfer vs payload security |
| P0 | 31 PSU/VRM/SiC·GaN/air·liquid CDU | 06/11/12 | RESEARCH_CANDIDATE A06 | P=VI, conversion loss/thermal/SLA |
| P0 | 32 E2E capstone/SLO/RTO | 10/31 | RESEARCH_CANDIDATE A06 | failure/measurement end-to-end |
| P1 | 13 GB/GiB/GT/s vs MT/s | 12 | RESEARCH_CANDIDATE A06 | units/encoding worksheet |
| P1 | 17 CPU ISA/ALU/branch | 16/05 | RESEARCH_CANDIDATE A06 | branch/caches |
| P1 | 15 FinFET/GAA/CFET modern short channel | 11/14/01 | RESEARCH_CANDIDATE A06 | E-field leaks vs geometry |
| P1 | 19 RowHammer/TRR/refresh/ECC | 02/07 | RESEARCH_CANDIDATE A06 | actual attack/retention condition |
| P1 | 20 EDA/FEOL/BEOL signoff | 06/16 | RESEARCH_CANDIDATE A06 | layout vs process |
| P2 | 18 ASIC/NPU/FPGA | 03/17 | RESEARCH_CANDIDATE | workload PPA |
| P2 | 21 quantization/runtime/KV paging | 10/08/17 | RESEARCH_CANDIDATE | error vs latency |
| P2 | 22 GaN/SiC power semiconductor | 11/31 | RESEARCH_CANDIDATE | high-field and Ron |
| P2 | 23 ATE/DFT/ESD FIT | 06/11/20 | RESEARCH_CANDIDATE | coverage/RAS |
| P2 | 24 ADC/MEMS/LED·laser | 11/12 | RESEARCH_CANDIDATE | optics + analog |
| P2 | 25 MRAM/ReRAM/PIM/CIM | 02/09 | RESEARCH_CANDIDATE | NVM research |
| P2 | 26 ZNS/NVMe-oF | 04/09 | RESEARCH_CANDIDATE | namespace and FTL |
| P2 | 27 distributed storage/backup/RTO/RPO | 08/09 | RESEARCH_CANDIDATE | consistency |
| P2 | 28 UCIe 3.0/chiplet/hybrid bond | 06/29 | RESEARCH_CANDIDATE | package PHY/manage |
| P2 | 30 photonics/CPO | 08/24 | RESEARCH_CANDIDATE | transceiver/laser |
개별 수치/제조사 사례를 증거 없으면 STORY_READY로 승격하지 않는다.

## A05 권장 제작 순서·파이프라인
**최우선** A05 PR #10의 D02 science/UI cell0/cell1 회귀 + 브라우저/Voice 재검증 및 A02 직접 인계. **다음** 새 12 회로 → 11 PN → 14(준비된 후) MOS capacitor → 05 SRAM/03 GPU/04 NAND, 다른 STORY_READY 레슨 분기. 콘텐츠 인계가 이미 된 A05는 A01 승인 기다리지 않고 작업 가능.
A06는 14를 다음 레슨으로 즉시 연구 착수했으며 독립 [research note](research-notes/14-mos-capacitor-research.md)를 기록. 현재 14는 완성된 스토리보드가 아니므로 A05에 STORY_READY라고 말하지 않는다.
**main 병합·배포 금지.** 작업 세션 밖 24시간 자동 작동을 보장하지 않는다.
