# A06 Production Backlog · 2026-10-17
> 최신 계약: Issue #6. Atlas v1 115개 DAG topic. 콘텐츠 **13 lessons / 54 authored Step** = 기존 12/50 + 14 MOS 4 Step **A07 review pending**, 승인된 STORY_READY/SCENE_READY와 다름, 제품 UI·학습자 QA는 별도. 오너의 A01 레슨별 사전 승인 게이트 없음. 앱 코드 A02, scene A05, 원고/교차 QA A06. GitHub 작성만으로 타 에이전트 자동 기동 X.

## 상태 전환의 증거 (타 소유자 명의로 임의 완료 금지)
RESEARCHING (A06 sources/questions, not handoff) → STORY_READY (A06 vetted sources/model limits/3 misconception+hints/Voice/Step spec, **A05 제작 즉시 가능**) → A05_IN_PROGRESS (A05 branch/PR evidence) → SCENE_READY (A05 typed scene plus browser/mobile+CI and science review) → A02_INTEGRATING (A02 app engine/Voice/progress PR) → APP_QA (실제 앱 학습 flow, 접근성/Voice·regression/화면) → COMPLETE (오너 승인된 제공 범위의 최종 QA까지 완료).
- 하나의 레슨에 **여러 산출물 서로 다른 상태** 가능. M01 scene/browser A05 보고는 A02 앱 학습 전체의 브라우저 통과가 아님.
- 완성된 11/12는 STORY_READY이지 2.5D·프로덕션 구현이 아님.
- A06 next rank: 필수 선수 개념 영향(4점×0..3)+후속 가지수(3점×0..3)+A05 제작가능성(2점×0..3)+근거확실성(2점×0..3)−최신 SKU 미검증위험(3점×0..3). 순위는 기획용, 실제 마케팅 KPI가 아님.

## 핵심 코어 제작 현황
| 학습 ID | 선수 · 이어지는 원리 | Pipeline current status | Owner + GitHub 증거 | 차단/다음 단계 |
|---|---|---|---|---|
| 12 전기/V-I-R/RC/Power | 없음 → 11,14,01,02,31 | **A06_REVISED / A07_RECHECK_PENDING** 4 Step | A06 [원고](lessons/12-electricity-rc-foundations.md) | A05 새 독립 PR, D02 QA 이후 우선 |
| 11 도핑/PN | 12 일부 → 14/01/22/24 | **A06_REVISED / A07_RECHECK_PENDING** 5 Step | A06 [원고](lessons/11-doping-pn-foundations.md) · [senior note](deep-dives/11-pn-foundations.md) | A05 12 뒤, polarity와 drift/diffusion 보존 |
| 01 MOSFET/CMOS | 11,14 bridge 예고 | **A02_INTEGRATING** | A05 [#8](https://github.com/Junebooky/interactive-engineering/pull/8), A02 [#9](https://github.com/Junebooky/interactive-engineering/pull/9) | 최신 브라우저·통합 learner flow 상태 별개 QA |
| 02 DRAM | 11/12/01 | **A05 standalone SCENE_READY** / **A02 integrated APP_QA BLOCKER** | A05 [#10 head 00eb302](https://github.com/Junebooky/interactive-engineering/pull/10) source ef36a54 + [Chromium 7 PASS](https://github.com/Junebooky/interactive-engineering/actions/runs/39022687806); A02 [#11 head e0dfe83](https://github.com/Junebooky/interactive-engineering/pull/11) | **A05 fixed** 0.45/0.55 & restore snapshot; **separate A02 integrated state/history learner-flow blocker** (A07 source report) needs E2E; do not conflate scene vs app. |
| 05 SRAM/CPU cache | 01/16 | **A05 standalone SCENE_READY**, A02 not yet full integrated QA | A05 [#13 head 292c574](https://github.com/Junebooky/interactive-engineering/pull/13), [Chromium 7 PASS](https://github.com/Junebooky/interactive-engineering/actions/runs/39023202587); A06 [05 story](lessons/05-sram-cpu-cache.md) | A07 standalone source teaching QA yet to confirm; no full app completion |
| 03 GPU DDR/GDDR/HBM | 02/05/17 | **A05 standalone browser evidence** / **A07 EDU_MAJORS_OPEN S02/S03** | A05 [#15 head 1cacdce](https://github.com/Junebooky/interactive-engineering/pull/15) [Chromium 7 PASS](https://github.com/Junebooky/interactive-engineering/actions/runs/39023904320); A06 [03 revised story](lessons/03-gpu-memory-bottleneck.md) | A07 requires independent family/site wrong-placement & same-domain numeric distractors → A05 re-implement/negative-case QA, A07 recheck; source toy math PASS |
| 04 NAND/eSSD/NVMe | 11/02/03 | **STORY_READY** 5 Step | A06 [04](lessons/04-nand-essd-data-center.md) | command vs return payload 방향 |
| 06 wafer/chiplet/TSV/heat | 11/03/20 | **STORY_READY** 4 Step | A06 [06](lessons/06-hbm-chiplet-packaging.md) | KGD와 package yield/thermal toy |
| 07 DDR5/MRDIMM/LPDDR/CXL | 02/03 | **STORY_READY** 4 Step | A06 [07](lessons/07-server-memory-tiers.md) | 제품별 호환성·표준원문 불확실성 |
| 08 NIC/RDMA/IB/NCCL/optic | 03/07/29 | **STORY_READY** 4 Step | A06 [08](lessons/08-ai-fabric-rdma-optics.md) | transport와 CPU data-copy 분리 |
| 09 NAND/eSSD reliability | 04/07 | **STORY_READY** 4 Step | A06 [09](lessons/09-essd-reliability.md) | PLP/ACK/SKU별 조건 |
| 10 AI DC end-to-end | 03/04/07/08/09/31 | **STORY_READY** 4 Step | A06 [10](lessons/10-ai-datacenter-end-to-end.md) | 실제 앱/시설 E2E 계측 전 |

## 다음 A06 자동 선정 (지시 대기 없음)
| 우선 | planned lesson / missing concept | 선수 | Current state/책임/자료 | 완료 조건 |
|---|---|---|---|---|
| P0 | **14 MOS capacitor accumulation/depletion/inversion** | 11,12 | **A06_SELF_QA_DONE / A07_INDEPENDENT_REVIEW_PENDING**, 4 drafted Step · [14 storyboard](lessons/14-mos-capacitor-field-inversion.md) / [14 MIT physics deep dive](deep-dives/14-mos-capacitor-physics.md) | Resolve A07 BLOCKER/MAJOR → A07 EDU_QA_PASS → STORY_READY then A05 #4; NOT READY yet |
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

## A07 협력·품질 게이트 2026-10-17 / 큐 안내
- A07 Issue #12 및 [A07 PR #14 Round02](https://github.com/Junebooky/interactive-engineering/pull/14) 보고 수신인은 A06 Issue #6, A01 승인/별도 보고 없음. A06는 **11/12 pre-prediction Voice spoilers 및 G03 assessment**, [Atlas ID crosswalk](id-namespace-crosswalk.md) 수정. 각각 변경 SHA를 A07에게 보내 **source 재검증/EDU_QA_PASS**를 요청. A07 review 실행은 **A07 본인의 활성 세션**에서 진행; 댓글 작성으로 에이전트가 자동 시작하지 않는다.
- **G03 시각 구현의 A05 브라우저 패스**는 물리/수치의 일부 증거이나 학생이 오답 카드를 실제 넣어보지 못하는 평가 **MAJOR**가 독립 A07 소스 QA에 존재. `A05_SCENE_READY` 단독 선언을 교육 QA와 구별한다.
- **D02 A05 #10** cell0=0.45/cell1=0.55 교정 및 7건 브라우저 evidence 확인. 예전 '미교정 0.55 고정' 블로커는 **닫힘**. **A02 PR #11 통합 앱은 별개 BLOCKER**: 실제 UI WL/BL 조작으로 cell/history 재구성하지 않아 평가 조건 불충족 위험. A02 담당/직접 E2E 필수; A06가 구현 책임을 가로채지 않음.
- **14 MOS capacitor 원고 4 Step/정량 QA만 완료**; 신규 후속 선정 완료하지만 A07 EDU_QA_PENDING. 마스터 13레슨·54 Step은 집필량, A05 제작 가능 판정은 아님.

## A05 권장 제작 순서
(1) 다른 진행 중인 업무·A02 D02 blocker 원인과 독립 가능한 **12 회로/11 PN**은 A07 중립 문구/선수 교정 재검증 후 A05 제작. (2) 14 MOS는 A07 PASS 후 01 앞에 연결. (3) G03 PR #15 현재 코드에 독립 DDR/GDDR/HBM 카드·위치 평가 및 같은 분야 숫자 오답 테스트 추가, 원고 수정 SHA 수신. (4) 이후 기존 04 NAND/06 제조·패키징으로 파이프라인 지속. **다음 A06 연구 예정: 16 논리·클록/레지스터** (14 독립 QA 대기 중에도 병렬 연구 가능). main 병합·배포 금지.
