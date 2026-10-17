## A06 R21 2026-10-17 · device/DRAM coverage authored, still independent QA gated
- [x] **19 RowHammer/PRAC/TRR/ECC and fleet memory risk now authored 5-Step**, [student source exact `152c7697ffc1536c0efdeb63ef464f7d0cef4674`](lessons/19-rowhammer-dram-ecc.md), [Intel2026/Google2025 updated science exact `c316b7de3aff21fe06fe556932390b958d888a48`](deep-dives/19-rowhammer-ecc-defensive-reliability.md), [#53](https://github.com/Junebooky/interactive-engineering/issues/53) NEXT:A07 independent first SOURCE QA [ ]. This covers conceptual RowHammer disturbance, DRAM-victim neighborhood possible beyond adjacent, DDR5 PRAC/RFM/TRR support gates, ECC reactive detection/SECDED limitations and CE/UE fleet fault response **at author source level only**; real manufacturer part-specific TRR/PRAC strengths and actual fault injection/security validation remain OPEN.
- [x] **15 nanosheet GAA/CFET/backside source review state MAJOR corrected by author** [new source `87ca2410`](lessons/15-finfet-gaa-cfet-backside-power.md) and [senior `fedfdc54`](deep-dives/15-gaa-nanosheet-cfet-backside-pdn.md) [#51](https://github.com/Junebooky/interactive-engineering/issues/51) NEXT:A07 R20 exact-new-blob four education state fixes independent QA [ ]; actual A05 2.5D/Voice/app open. Do NOT mark source science+EDU PASS on author repair alone.
- [ ] **20 physical design STA/DFT/ESD signoff** original full Step curriculum and independent review still missing; [ ] 21 KV paging/quantization, [ ]22 wide-bandgap SiC/GaN PSU, [ ]30 silicon photonics/co-packaged optics, [ ] app/physical screenreader/hardware real-world measurements across all. Current authored **21 lessons/93 Step**, 115-topic Atlas, 32 numbered plan nodes not equal 32 manuscript completed.

---
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

## Round 05 (2026-10-17) — 상태 및 새 교육 품질 공백
- 11/12 foundational prerequisites 이제 story exists + pre-prediction text neutral 교정, **A07 독립 QA 재검증 대기**. P01 elementary charge moved to 12-S01 start; P08 exponent-only taught, log/probability/p99 not mastered, needs 13 or a short bridge before 09-S04.
- 14 MOS capacitor has [four-step A06-authored storyboard](lessons/14-mos-capacitor-field-inversion.md), [MIT-based physical source](deep-dives/14-mos-capacitor-physics.md), **A07_REVIEW_PENDING**. Strong inversion, C–V high/low freq, VFB not always0, Vth not always0.7 addressed; not yet STORY_READY.
- G03 S02 independent card/site actual assessment, S03 same-domain BW prediction repaired in A06 canonical, A05 PR#15 implementation/negative-case browser QA pending, no blanket G03 scene-education PASS.
- ID crosswalk [namespace](id-namespace-crosswalk.md) added; typed A02 persisted key migration still an implementation question.
- D02 A05 #10 standalone science copy correct/Chromium evidence; newer A02 #11 implements action adapter and reports app Chromium QA; **A07 retest newest SHA e0dfe83 pending**, source-only potential sequence-skip edge cases flagged (not tested failure).
- New lesson16 [clock/sequential research note](research-notes/16-logic-clock-research.md) started while A07 reviews; flip-flop metastability/timing are missing novice→CPU bridge.

## A06 Round06 next gap scan (2026-10-17)
**Newly addressed at authored-story level:** 16 CMOS gates→combinational vs sequential→level D latch/rising-edge DFF→timing/CDC (4 Step, [source](lessons/16-logic-clock-registers.md), [MIT/TI deep dive](deep-dives/16-digital-logic-clock-timing.md)). A07 independent review pending; not complete production.
**Still pending:** 29 high-speed PCIe SerDes/DMA/IOMMU/CXL interplay [source research kickoff](research-notes/29-serdes-pcie-cxl-research.md); 31 VRM/rack PSU/heat/energy; 32 AI DC end-to-end SLO; 13 units/p99 mini bridge; 17 CPU pipeline; 15 FinFET/GAA/CFET; 20 EDA/STA & signoff; 05 SRAM A07 power-up/write persistence source blocker; 04 NAND targeted feedback source updates; 12 A05 PR#18 science/Voice cross QA. Plan after 29: select 31 vs 17 based on missing prerequisites/downstream impact, not A01 per lesson gate.

## Round07 · PCIe/SerDes/DMA/CXL education coverage updates
- Lesson29 [5 Step educational draft](lessons/29-serdes-pcie-dma-cxl.md) closes narrative gap among SSD/NVMe vs PCIe transport, DMA/IOMMU map, SerDes/PAM4, PCIe6/7 bidirectional headline and CXL memory semantics **at AUTHOR stage only**. A07 independently review pending; exact PCIe7 packet byte layout/SKU-app performance must not be inferred from PCIe6. CXL evaluation restricted spec not processed.
- 14 MOS has A07 SOURCE PASS (scene still open); 11/12 source leaks corrected to gated teacher answer awaiting A07 recheck. Existing SRAM05 source blocker and NAND04 targeted feedback remain separate.
- Next new content priority: 31 PSU/VRM/cooling because GPU/AI DC needs Joule/Watt/Thermal precursor; alternative after 29 A07 review is 13 unit/p99 bridge. Atlas remains coverage graph, not fully implemented course.

## Round09 · Energy, power delivery & site efficiency coverage at authored-story level
- **31 GPU PSU→buck VRM→PDN→CDU→PUE/WUE** 5 Step [new original](lessons/31-gpu-power-thermal-data-center.md) + [official-sourced deep dive](deep-dives/31-vrm-cdu-pue-wue.md), A06_SELF_QA_DONE, **A07 SOURCE_REVIEW_PENDING**, A05/A02 WAITING. Eliminates critical conceptual gap between semiconductor energy and datacenter cooling. Flow recirculation ≠ water consumed, PUE and WUE independent, device/SKU numbers fictional.
- **Remaining gaps** 13 unit/p99 global foundational bridge (09-S04 has local nearest-rank mini-card but full P08 still PARTIAL), 32 AI SLO/reliability incident response capstone, 15 FinFET/GAA/CFET and 20 STA signoff depth, 22 GaN/SiC device technology, operating TCO/CO2e boundaries and actual platform specs. Completion of 31 source draft doesn't settle these.
- R8 A07 P1 feedback for 01/04/07/09 incorporated by A06 canonical SHA, independent reviewer new SHA still pending as of this update. Do not mark source review or A05 scene on author's behalf. **Authoring count now 16 lessons/68 Steps** and full Atlas 115-topic graph still broader than implemented.

## A06 R14 · closed at author draft level, gaps still open through peer QA (2026-10-17)
- [x] **13 P06/P08 bit/GiB/MT/s/Gt/s + Poisson/log/p99/SLO** [5-step](lessons/13-units-probability-percentiles.md), [official math](deep-dives/13-units-statistics-slo.md) author draft source complete only; [#45 A07 QA pending](https://github.com/Junebooky/interactive-engineering/issues/45). Other topic P08 full advanced statistical inference, confidence intervals, unbiased p99 estimation not fully taught; source raw nearest rank and bucket estimate assumptions require review.
- [x] **32 DC operations Trace/SLO/Retry/RTO-RPO/Energy capstone** [5-step](lessons/32-ai-dc-slo-incident-capstone.md), [official source](deep-dives/32-datacenter-slo-observability-recovery.md), [#46 A07 QA pending](https://github.com/Junebooky/interactive-engineering/issues/46). Real route failure, RTO recovery, PUE/WUE and request goodput require tested A05 scene and A02 app; a 'capstone manuscript' is not real operating telemetry.
- [x] **31 PSU/VRM/CDU/PUE/WUE** [source](lessons/31-gpu-power-thermal-data-center.md) A07 independent SOURCE PASS exact source `f7e7aa16`, directly A05 Issue#4 handed off [#38](https://github.com/Junebooky/interactive-engineering/issues/38), actual 2.5D/mobile Voice/App still pending.
- [ ] Remaining **17 CPU ISA/pipeline/cache**, 15 GAA/CFET device, 19 RowHammer/TRR, 20 EDA/STA DFT/ESD signoff, 21 KV paging quantization, 22 power semiconductors GaN/SiC, 30 silicon photonics/CPO, optional ADC/MEMS and on-prem realistic energy/security operations. **18 authored lessons/78 Step**; Atlas 115 topic taxonomy covers drafts and many concepts not yet teachable or A07-passed. No main merge/deploy.


## A06 R17 2026-10-17 · lessons17,32 new physics gaps routed to independent reviewers
- [x] **17 CPU RV32I ISA/µarch** 5-Step [original](lessons/17-cpu-isa-pipeline-hazards.md) + [RISC-V/gem5 physics](deep-dives/17-riscv-isa-pipeline-cpi.md), author [x], A07 [#48](https://github.com/Junebooky/interactive-engineering/issues/48) SOURCE_REVIEW [ ], independent A05 original 2.5D/app [ ]; ISA/µarch separate, no hardware timing promise. 115-topic L06 draft coverage improved but OOO deep resource hazards/memory consistency not completely taught.
- [x] **32 SLO/reliability capstone R16 correction** [current lesson](lessons/32-ai-dc-slo-incident-capstone.md) + [senior research](deep-dives/32-datacenter-slo-observability-recovery.md), A06 fixed two MAJOR state contracts; [#46](https://github.com/Junebooky/interactive-engineering/issues/46) independent A07 NEW_SHA SOURCE_RECHECK [ ], scene/app [ ]. No actual DR restore test or uptime SLO guarantee.
- [x] **13 numeric/statistics foundation** corrected source **A07 independent SOURCE_PASS** [#45](https://github.com/Junebooky/interactive-engineering/issues/45), A06→A05 original five-scene HANDOFF_SENT [x], actual Chrome/Voice/aria APP [ ]. Uncertainty of p99 small samples and quantile estimator method remains senior elective.
- [ ] Remaining curriculum candidates 15 nanosheet GAA/CFET, 19 DRAM RowHammer/TRR variants and ECC guarantees, 20 STA physical signoff/DFT, 21 KV paging/quantization and 22 SiC/GaN PSU power devices, 30 photonics/CPO; prioritize by prerequisites and A07/A05 capacity, no 24/7 background promises. **19 authored lessons/83 Step** vs 115-topic Atlas map and 32 planned-number taxonomy. Main merge/deploy HOLD.

## A06 R26 · EDA/STA/ATPG/UPF new author scope; source QA and production gaps (2026-10-17)
- [x] **20 RTL synthesis→floorplan/place/route→min/max static timing→DRC vs LVS→DFT/ATPG modeled test coverage→IEEE1801 UPF isolation & retention** 5-Step source [exact `7211a5d0`](lessons/20-eda-sta-drc-dft-upf.md), [official/public senior refs `0f180ec9`](deep-dives/20-eda-sta-drc-dft-upf.md) A06 author complete, [#57](https://github.com/Junebooky/interactive-engineering/issues/57) A07 independent first physics/learning QA pending; no actual PDK, STA, layout DRC/LVS, ATPG or hardware signoff run. Future separate deep work still needed for clock corners/OCV, full IEEE standard source clauses, IR/EM/ESD signoff, scan compression ATE and real foundry kit validation.
- [x] **15 physical nanosheet+backside** new `e7aeeaaa` S04 typed gate vs route/derived R source fix [#51](https://github.com/Junebooky/interactive-engineering/issues/51) A07 updated-source retest pending. **19 DRAM RowHammer/PRAC/ECC** new `d7686915` elapsed epochs/PRAC-vs-TRR/no-ECC output source fix [#53](https://github.com/Junebooky/interactive-engineering/issues/53) A07 new-source retest pending. Original reviewers certified earlier old math, not new EDU PASS or actual visual runtime.
- [ ] Remaining **21 KV-cache paging/quantization**, **22 wide-bandgap SiC/GaN power converter**, **23 ATE/burn-in/scan deep**, **25 NVM PIM/CIM**, **28 UCIe die interfaces**, **30 silicon photonics/CPO**, and production-grade actual hardware/browser/user QA. 115-topic atlas taxonomy has a number for planned modules, not all fully authored. **22 authored lessons/98 Steps**, app/tests and main deploy HOLD.

## A06 R28 2026-10-18 · KV/prefix privacy original now authored, remaining real-world and silicon gaps
- [x] **21 LLM KV-cache/PagedAttention block allocation·quantized KV precision·offload·prefix cache/tenant policy** 5 new Step [story `3f0021da`](lessons/21-llm-kv-paged-quant-offload.md) + [vLLM/HF/NVIDIA official senior science `76961239`](deep-dives/21-llm-kv-paged-quant-offload-security.md); [#59 NEXT:A07 independent original source science/privacy/teacher gates QA](https://github.com/Junebooky/interactive-engineering/issues/59), A05/APP [ ]. No real GPU benchmarking/p99 quality measurement and cache salt not secure isolation boundary; concepts directly connect 03 GPU/07 memory/10 prefill-decode/32 SLO.
- [x] **15 modern device, 19 defensive DRAM, 20 physical EDA** A07 Round26 new immutable original EDU_SOURCE_PASS and [direct A05 fifteen 2.5D scene contracts](https://github.com/Junebooky/interactive-engineering/issues/4#issuecomment-6235732585) [x], A05 accepted+real Chrome/mobile/Voice/ARIA/CI [ ], A02 app E2E [ ].
- [ ] Remaining **22 wide-bandgap SiC/GaN power supply/VRM**, **23 DFT/ATPG/ATE/burn-in deep**, **25 emerging MRAM/ReRAM/PIM/CIM**, **28 UCIe/chiplet interoperability**, **30 photonics/CPO**, real cluster serving/tenant security, silicon, physical DRAM and human/accessibility tests. 115-topic taxonomy has numbered planned modules; now **23 authored lessons/103 Step**, not 23 A07/source/runtime/ship passes. Main merge/deploy HOLD.

## A06 R29 2026-10-18 · modern WBG/AI rack 800VDC new teaching source and unsolved validation scopes
- [x] **22 SiC/GaN power semiconductor, PSU/VRM, switching+thermal and NVIDIA 800VDC AI rack electrical path original five Step** [source `11b28095`](lessons/22-sic-gan-psu-vrm-800vdc.md) + [Infineon/Wolfspeed/NVIDIA senior `3872f9d4`](deep-dives/22-sic-gan-power-psu-800vdc.md) [#62 A07 first exact original science+EDU_SOURCE_QA pending](https://github.com/Junebooky/interactive-engineering/issues/62). Covers η output-vs-input heat, hypothetical switched capacitance C V² f without real Eoss, buck ripple L/f and EMI caveat, junction thermal first-order envelope, fixed *source* P80kW/400 vs800VDC cable I²R. Does NOT settle physical converter PCB, silicon/manufacturer PPA, electrical code or high-voltage qualification, measured facility PUE/token efficiency.
- [ ] [21 LLM KV/PagedAttention/quant/offload/prefix privacy](https://github.com/Junebooky/interactive-engineering/issues/59) A07 full source/security independent original QA and real serving data still OPEN. Source-approved 15/19/20 handed A05 fifteen scenes [#4](https://github.com/Junebooky/interactive-engineering/issues/4#issuecomment-6235732585) [x], independent browser/app acceptance for those scenes [ ].
- [ ] Remaining **23 advanced ATE/burn-in/scan/test screening**, **24 ADC/MEMS/photo sensor**, **25 MRAM/ReRAM/PIM/CIM**, **28 UCIe chiplet heterogeneous interface**, **30 co-packaged optics/SiPh**, material standards and product-specific real safety/performance/thermal/GPU, accessibility (iPhone/Safari/actual Korean TTS) and owner RELEASE_HOLD. 115-topic atlas tracks taxonomy; **24 authored lessons/108 Steps** does not mean all peer reviewed/product tested.

## A06 R31 2026-10-18 · new author production test 23 coverage and remaining physical verification omissions
- [x] **23 post-fab wafer probing/final package test conditional denominator, internal scan ATPG stuck-at vs transition, multi-site ATE economics, zero-fail HTOL-style toy statistical caution, AI GPU system-level test (SLT)** original five scenes [story `79a9f6c7`](lessons/23-wafer-dft-ate-htol-slt.md) and [Siemens/TI/ADI/Advantest/Teradyne public sources `a62b8b2c`](deep-dives/23-wafer-atpg-ate-htol-ai-slt.md), [#64 NEXT:A07 first independent original science+EDU QA](https://github.com/Junebooky/interactive-engineering/issues/64). These introduce foundational differences, not actual production ATE qualified process, JESD22-licensed full protocol, wafer/binning yield distribution, true scan compression/physical cell faults or accelerated-life hazard modeling.
- [ ] **Previous 21** prefix KV episode chronology author fixed [#59 NEXT:A07 revised99bfb53b science/teacher recheck](https://github.com/Junebooky/interactive-engineering/issues/59); **22** SiC/GaN converter+800VDC author original [#62 NEXT:A07 first 11b28095](https://github.com/Junebooky/interactive-engineering/issues/62). **15/19/20** already A07 original source accepted and [A06 direct fifteen 2.5D scene A05 contracts sent](https://github.com/Junebooky/interactive-engineering/issues/4#issuecomment-6235732585); actual Chrome/Voice/CI those scenes and A02 app not assumed. No main merge/deploy.
- [ ] Remaining **24 optical semiconductors/photo/ADC/MEMS**, **25 MRAM/ReRAM/PIM/CIM**, **26 ZNS/NVMe-oF**, **28 UCIe packaging PHY/die interoperability**, **30 silicon photonics/CPO**, real production/power/thermal/GPU/screenreader/learner tests. Current authored **25 lessons/113 Step** of 115-topic Atlas/32 planned number slots; authorship != science review or running app.
