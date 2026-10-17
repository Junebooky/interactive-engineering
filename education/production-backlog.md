# A06 Production Backlog · 2026-10-17
> 최신 계약: Issue #6. Atlas v1 115개 DAG topic. 콘텐츠 **15 lessons / 63 authored Step** = 기존 12/50 + 14 MOS 4 Step + 16 논리/클록 4 Step + 29 PCIe/DMA/CXL 5 Step, **16·29 A07 review pending; 14 A07 SOURCE PASS / STORY_READY**, 승인된 STORY_READY/SCENE_READY와 다름, 제품 UI·학습자 QA는 별도. 오너의 A01 레슨별 사전 승인 게이트 없음. 앱 코드 A02, scene A05, 원고/교차 QA A06. GitHub 작성만으로 타 에이전트 자동 기동 X.

## 상태 전환의 증거 (타 소유자 명의로 임의 완료 금지)
RESEARCHING (A06 sources/questions, not handoff) → STORY_READY (A06 vetted sources/model limits/3 misconception+hints/Voice/Step spec, **A05 제작 즉시 가능**) → A05_IN_PROGRESS (A05 branch/PR evidence) → SCENE_READY (A05 typed scene plus browser/mobile+CI and science review) → A02_INTEGRATING (A02 app engine/Voice/progress PR) → APP_QA (실제 앱 학습 flow, 접근성/Voice·regression/화면) → COMPLETE (오너 승인된 제공 범위의 최종 QA까지 완료).
- 하나의 레슨에 **여러 산출물 서로 다른 상태** 가능. M01 scene/browser A05 보고는 A02 앱 학습 전체의 브라우저 통과가 아님.
- 완성된 11/12는 STORY_READY이지 2.5D·프로덕션 구현이 아님.
- A06 next rank: 필수 선수 개념 영향(4점×0..3)+후속 가지수(3점×0..3)+A05 제작가능성(2점×0..3)+근거확실성(2점×0..3)−최신 SKU 미검증위험(3점×0..3). 순위는 기획용, 실제 마케팅 KPI가 아님.

## 핵심 코어 제작 현황
| 학습 ID | 선수 · 이어지는 원리 | Pipeline current status | Owner + GitHub 증거 | 차단/다음 단계 |
|---|---|---|---|---|
| 12 전기/V-I-R/RC/Power | 없음 → 11,14,01,02,31 | **A05 standalone scene/browser evidence**; **A07 EDU_RECHECK_PENDING** 4 Step | A05 [#18](https://github.com/Junebooky/interactive-engineering/pull/18), [Chromium 7 PASS](https://github.com/Junebooky/interactive-engineering/actions/runs/39025894800); A06 [교정 원고](lessons/12-electricity-rc-foundations.md) | A05 과학/교육 교차 QA 요청, A07 최신 pre/post Voice review·actual app integration 별개 |
| 11 도핑/PN | 12 일부 → 14/01/22/24 | **A06_REVISED / A07_RECHECK_PENDING** 5 Step | A06 [원고](lessons/11-doping-pn-foundations.md) · [senior note](deep-dives/11-pn-foundations.md) | A05 12 뒤, polarity와 drift/diffusion 보존 |
| 01 MOSFET/CMOS | 11,14 bridge 예고 | **A02_INTEGRATING** | A05 [#8](https://github.com/Junebooky/interactive-engineering/pull/8), A02 [#9](https://github.com/Junebooky/interactive-engineering/pull/9) | 최신 브라우저·통합 learner flow 상태 별개 QA |
| 02 DRAM | 11/12/01 | **A05 standalone SCENE_READY** / **A02 integrated fix/Chromium evidence reported; A07_RECHECK_PENDING** | A05 [#10 head 00eb302](https://github.com/Junebooky/interactive-engineering/pull/10) source ef36a54 + [Chromium 7 PASS](https://github.com/Junebooky/interactive-engineering/actions/runs/39022687806); A02 [#11 head e0dfe83](https://github.com/Junebooky/interactive-engineering/pull/11) | **A05 fixed** 0.45/0.55 & restore snapshot; **A02 e0dfe83 added typed action adapter + actual Chromium app QA claimed**; A07 independent source/negative-order retest needed, not app Complete; do not conflate scene vs app. |
| 05 SRAM/CPU cache | 01/16 | **A05 standalone browser 7 PASS BUT A07 SOURCE BLOCKERS OPEN** | A05 [#13 head 292c574](https://github.com/Junebooky/interactive-engineering/pull/13), [Chromium](https://github.com/Junebooky/interactive-engineering/actions/runs/39023202587); A07 [Round03](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-03-sram-04-audit.md) | 05-S01 power re-on resurrects lost bit; S02 active BL write not retained. A05 fix/negative-case QA; 05 A06 original field/Voice correction queued after A07 completion. No full app integration |
| 03 GPU DDR/GDDR/HBM | 02/05/17 | **A05 standalone browser evidence** / **A07 EDU_MAJORS_OPEN S02/S03** | A05 [#15 head 1cacdce](https://github.com/Junebooky/interactive-engineering/pull/15) [Chromium 7 PASS](https://github.com/Junebooky/interactive-engineering/actions/runs/39023904320); A06 [03 revised story](lessons/03-gpu-memory-bottleneck.md) | A07 requires independent family/site wrong-placement & same-domain numeric distractors → A05 re-implement/negative-case QA, A07 recheck; source toy math PASS |
| 04 NAND/eSSD/NVMe | 11/02/03 | **A06 SOURCE_FIX_COMPLETE / A07_RECHECK_PENDING**, 5 Step | [04 lesson revised blob 3feba6f3](lessons/04-nand-essd-data-center.md), [card #30](https://github.com/Junebooky/interactive-engineering/issues/30) | S01/02/04/05 generic 3 mistakes → 12 keyed feedback paths + five neutral pre/post UI/Voice; A07 new SHA source review then A05 direct handoff |
| 06 wafer/chiplet/TSV/heat | 11/03/20 | **STORY_READY** 4 Step | A06 [06](lessons/06-hbm-chiplet-packaging.md) | KGD와 package yield/thermal toy |
| 07 DDR5/MRDIMM/LPDDR/CXL | 02/03 | **A06 SOURCE_FIX_COMPLETE / A07_RECHECK_PENDING**, 4 Step | [07 revised 40743aeb](lessons/07-server-memory-tiers.md), [card #32](https://github.com/Junebooky/interactive-engineering/issues/32) | 4× pre/post Voice gating, HBM↔LPDDR supportedPath and two copy costs, SSD block IO vs CXL.mem; no A05 2.5D pass yet |
| 08 NIC/RDMA/IB/NCCL/optic | 03/07/29 | **STORY_READY** 4 Step | A06 [08](lessons/08-ai-fabric-rdma-optics.md) | transport와 CPU data-copy 분리 |
| 09 NAND/eSSD reliability | 04/07 | **A06 SOURCE_FIX_COMPLETE / A07_RECHECK_PENDING**, 4 Step | [09 revised a2fb4bd5](lessons/09-essd-reliability.md), [card #34](https://github.com/Junebooky/interactive-engineering/issues/34) | 16 centers/15 gaps, timeline-aware PLP ACK/flush/FUA state, 100 sample p99 bridge and separate pre/post Voice; actual SSD behavior conditional |
| 10 AI DC end-to-end | 03/04/07/08/09/31 | **STORY_READY** 4 Step | A06 [10](lessons/10-ai-datacenter-end-to-end.md) | 실제 앱/시설 E2E 계측 전 |

## 다음 A06 자동 선정 (지시 대기 없음)
| 우선 | planned lesson / missing concept | 선수 | Current state/책임/자료 | 완료 조건 |
|---|---|---|---|---|
| P0 | **14 MOS capacitor accumulation/depletion/inversion** | 11,12 | **STORY_READY / A07 EDU_QA_PASS_SOURCE** 4 Step, [14 story](lessons/14-mos-capacitor-field-inversion.md) / [MIT deep dive](deep-dives/14-mos-capacitor-physics.md) | Minor quasi-static/deep depletion/C–V copy corrected, A05 #4 direct handoff; A05 SCENE_QA/APP_QA WAITING |
| P0 | 16 combinational/sequential logic/clock | 01,12 | **A06 SOURCE_FIX / A07_RECHECK_PENDING**, 4-Step [lesson](lessons/16-logic-clock-registers.md) / [MIT·TI deep dive](deep-dives/16-digital-logic-clock-timing.md) | A07 independent BLOCKER/MAJOR resolution→EDU_QA_PASS then A05 handoff, not yet READY |
| P0 | **29 PCIe6/7·SerDes·FLIT·DMA/IOMMU·CXL** | 04/07/12/17 | **A06_SELF_QA_DONE / A07_SOURCE_REVIEW_PENDING**, 5-Step [lesson](lessons/29-serdes-pcie-dma-cxl.md), [senior Linux/PCI-SIG/CXL ledger](deep-dives/29-serdes-pcie-cxl-dma.md); shared [LESSON-PIPELINE #37](https://github.com/Junebooky/interactive-engineering/issues/37) | wait A07 source pass, fix MAJOR, only then A05 5-scene handoff |
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
- **D02 A05 #10** cell0=0.45/cell1=0.55 교정 및 7건 브라우저 evidence 확인. 예전 '미교정 0.55 고정' 블로커는 **닫힘**. **A02 PR #11 최신 head e0dfe83은 WL/BL→writeCell·history 어댑터를 실제 추가했고 [A02 PR #11 보고](https://github.com/Junebooky/interactive-engineering/pull/11#issuecomment-6232772631)는 통합 Chromium QA 통과를 기록.** A07의 이전 BLOCKER는 이전 head a3656e/25a090d 소스 기준이므로 **FIX_REPORTED / A07_RECHECK_PENDING**으로 강등하고, 현재 adapter의 `phase=shared→restored`가 `sensed`를 거치지 않아도 복원 evidence를 추가할 수 있는 **순서 생략 위험**과 `refresh`를 leak보다 먼저 눌러도 history 조건을 충족할 가능성을 별도 negative-case로 검토 요청. A06는 앱 실행·독립 브라우저 재검증을 하지 않음.
- **14 MOS capacitor 원고 4 Step 독립 A07 SOURCE_PASS**, 준평형/deep-depletion와 C–V label MINOR 수정 후 **A05 직접 인계** [Issue #28](https://github.com/Junebooky/interactive-engineering/issues/28#issuecomment-6233311459). 마스터 15레슨·63 Step은 집필량, A05 제작 가능 판정은 아님.

## A05 권장 제작 순서
(1) 다른 진행 중인 업무·A02 D02 blocker 원인과 독립 가능한 **12 회로/11 PN**은 A07 중립 문구/선수 교정 재검증 후 A05 제작. (2) 14 MOS는 A07 PASS 후 01 앞에 연결. (3) G03 PR #15 현재 코드에 독립 DDR/GDDR/HBM 카드·위치 평가 및 같은 분야 숫자 오답 테스트 추가, 원고 수정 SHA 수신. (4) 이후 기존 04 NAND/06 제조·패키징으로 파이프라인 지속. **A06 16 논리·클록 4 Step self QA pending A07; 29 SerDes/PCIe/CXL 5-Step authored and A07 review pending** (14 독립 QA 대기 중에도 병렬 연구 가능). main 병합·배포 금지.

## A06 Round06 pipeline addendum 2026-10-17
- **16 sequence logic** [16 original 4-Step](lessons/16-logic-clock-registers.md) / [MIT 6.004 + TI theory](deep-dives/16-digital-logic-clock-timing.md) author-self-QA. In particular setup max toy7.5ns and hold min0.5ns vs0.8ns (fails), +0.4min/+0.6max buffer tradeoff, T9ns both pass. A07 independent science+education review pending; A05 implementation **not** authorized as final until review.
- **12 A05 #18** independent standalone browser 7 PASS; compare newest A06 neutral pre-TTS SHA and physical SVG directions before EDU_QA_PASS, A02 app integration separate.
- **05 A07 Round03 SRAM** source blockers explicitly registered; browser 7 PASS ≠ targeted SRAM retention negative-case PASS. A05 owns code, A06 author content after A07 review cycle. **04 NAND** copy feedback MAJOR tracked, physics violation not reported.
- Next independent topic 29 SerDes/PCIe/NVMe/CXL boundary (01→16 is now filled in drafts); A06 to research while A07 continues review. No merge/deploy.

## A06 Issue #21 공통 현황판 순서 (Round07)
- **A06→A07 recheck:** [11 PN #26](https://github.com/Junebooky/interactive-engineering/issues/26), blob `3ce28160`; [12 RC #27](https://github.com/Junebooky/interactive-engineering/issues/27), blob `7f1a319`. All learner neutral `predictionPrompt` distinct from gated `teacherExpectedAnswer`. A07 now independently granted source PASS on 11 blob 3ce28160 and 12 blob 7f1a319, but latest A05 copy/Voice and A02 app E2E still pending.
- **A06→A05 ready:** [14 MOS #28](https://github.com/Junebooky/interactive-engineering/issues/28), source A07 SOURCE_PASS, minor-revised `d356f8ae`; scene not yet created, direct A05 handoff. **A06→A07 first review:** [29 PCIe/CXL #37](https://github.com/Junebooky/interactive-engineering/issues/37), 5 steps at blob `4b4619b8` and senior source `80faa7f1`, no 2.5D produced. 16 clock [#29](https://github.com/Junebooky/interactive-engineering/issues/29) remains A07 review pending. 
- [Common board #21](https://github.com/Junebooky/interactive-engineering/issues/21) lists 15 lesson cards; GitHub title NEXT status tracks stage/owner, and product release remains HOLD. No main merge/deploy.

## A06 Round08 R6/R3 SOURCE FIX tracking (2026-10-17)
- A07 direct QA flagged **07 server memory** previous blob `00b35bed`: UI/TTS answers pre-reveal, LPDDR host→GPU offload without supported copy path/timing, and CXL.mem vs SSD direct block access conflation. **A06 source FIX SHA `40743aebac9306e97d596b01d88c5b47ecbdb1c2`** 4 Step complete; [card #32](https://github.com/Junebooky/interactive-engineering/issues/32) checked A06 [x], A07 new SHA source [ ], A05 [ ], A02 [ ].
- **09 eSSD reliability** prior `dc342616`: toy 16 center levels/15 gaps mismatch, PLP/ACK/flush/FUA chronological state and safe durability interpretation missing, p99 prerequisite/spoiler. **A06 source FIX `a2fb4bd563ca9de99f710a5b477252b540e66d6e`**, 4 Step; [#34](https://github.com/Junebooky/interactive-engineering/issues/34). Original 0.8J is nominal; toy usable=0.6J with effective fraction, pending0.4 or1.2J conditional, not a product certification. P08 percentile bridge added inside S04 only, Atlas P08 remains **PARTIAL** for overall math topic.
- **04 NAND/eSSD** prior `6cef9fa`: four steps generic misconception feedback; **A06 fix blob `3feba6f30e87eebccab86deb7dde505551f7c8e8`**, 5 neutral prompts/pre-post display-Voice, 12 cause-specific keyed feedback for S01/02/04/05 and S03 retained, [#30](https://github.com/Junebooky/interactive-engineering/issues/30). A07 new SHA PASS [ ], scene [ ], app [ ].
- **16 logic** A06 corrected `0cddc0b8`, now A07 source recheck [#29](https://github.com/Junebooky/interactive-engineering/issues/29); **11/12** A07 source PASS verified on `3ce28160`/`7f1a319` [#26](https://github.com/Junebooky/interactive-engineering/issues/26), [#27](https://github.com/Junebooky/interactive-engineering/issues/27), Scene→A02 new copy/Voice QA pending. **14** A07 final `d356f8ae` SOURCE PASS/A05 HANDOFF ACCEPTED; 2.5D still [ ] [#28](https://github.com/Junebooky/interactive-engineering/issues/28).
- Priority after A07 reconfirm 04/07/09: [#22](https://github.com/Junebooky/interactive-engineering/issues/22) MOSFET intro spoiler MAJOR A06 next; parallel [#38](https://github.com/Junebooky/interactive-engineering/issues/38) 31 power/VRM/cooling lesson new story (research-only). No main merge/deploy. **15 authored lessons/63 authored Steps unchanged**, changes are revisions, not added steps.
