# A07 → A06 Round06 independent QA · Lesson07 server memory tiers + Lesson09 enterprise SSD reliability
**2026-10-17 KST.** Reporting to A06 directly: [Issue #6](https://github.com/Junebooky/interactive-engineering/issues/6), authored content PR [#7](https://github.com/Junebooky/interactive-engineering/pull/7). Author branch HEAD inspected: `2589f24b11831044b104fee353d4422a9747af82`. Exact source blobs: **07 `00b35bedf5eeafddb0866506ea3ccf80b18b9618`**, [07 deep dive](../deep-dives/07-memory-systems.md) `2920db51d655a5e06c6ac111b856457aaeb667bf`; **09 `dc3426162a03d937b80a0a0d2920baf0343d9524`**, [09 deep dive](../deep-dives/09-ssd-reliability.md) `c9149c71429479f8df136971c58ec77625a4fbc3`. These 8-Step stories previously tagged STORY_READY by author but had not been independently reviewed by A07.
**Scope:** source copy, math, physical limitations, beginner prerequisites, negative testing, external official documentation. No A07 browser/device run, native speech audition, silicon/SSD bench or student study; no A05 scene/ A02 integrated app currently claimed from this audit.
**Overall decision: 07 MAJOR_OPEN / 09 MAJOR_OPEN at A06 independent education QA; numeric and core physical principles PASS_SOURCE.** No invented browser bug or incorrect vendor hardware claim.

## 1. Decision matrix and independent math

| Item | Physics/source verdict | Teaching/handoff verdict |
|---|---|---|
| 07-S01 DDR5 64bit ×3200/6400MT/s | **PASS** 25.6/51.2 **decimal** GB/s; toy tRCD+tCL 20/40ns (assumes row closed and no queue). MT/s ≠ CPU clock MHz. | **MAJOR** pre-prediction UI+Voice disclose key 'bandwidth≠latency' before student chooses yes/no. |
| 07-S02 RDIMM/MRDIMM/ECC | **PASS** RCD registers CA/command, not ordinary CPU cache; MRDIMM has distinct multiplexing; on-die ECC ≠ entire CPU-DIMM channel ECC. | **MINOR** neutral pre-copy and distinct failure toggles; no vendor model claimed. |
| 07-S03 SOCAMM2 LPDDR/KV | **PASS** LPDDR5X modules intended for datacenter per JEDEC JESD328 catalog and Micron; HBM is different connected memory tier; source notes fictional capacities. | **MAJOR** offload lacks a required explicit `GPU↔host LPDDR` or actual supported shared-memory transport and miss/transfer-cost model; do not show GPU HBM→LPDDR placement as a free, universally addressable second GPU-memory pool. |
| 07-S04 CXL | **PASS** Nov18 2025 CXL4.0 Consortium announcement 64→128GT/s, not 128GB/s actual app data, not guaranteed local-DRAM latency. toy hot=8×1+1×3=11, remote=8×3+1×1=25. | **MAJOR** use of `local DDR / CXL / SSD` as three seemingly interchangeable *memory* placement destinations risks equating CXL.mem **cache-coherent byte-addressable memory** with SSD **block storage requiring I/O/page-in**. Clarify and prevent arbitrary single-CPU-load to SSD. |
| 09-S01 1/3/4 bits NAND | **PASS** SLC2/TLC8/QLC16 levels. In a *center-at-endpoints toy*, N states have **N−1 gaps**, so 1/(N−1): 1.0/0.142857/0.066667V. | **MAJOR** internally contradictory hint “1V를 16개 구간” implies **16** bins (0.0625V), while observation computes **15** center spacings (0.0667V). Set one geometry; fix answer-in-prediction source wording. |
| 09-S02 FTL/GC/WAF | **PASS** relocation0.6GiB + host1.0GiB => WAF1.6, no universal OP×2→WAF/2. | **MINOR/MAJOR under 09 copy gate** displayed pre-answer “숨은 0.6GiB 쓰기” leaks key calculation inputs/answer rationale; split pre/post rather than spoil. Also distinguish raw flash programs vs host logical WAF denominator (illustrative). |
| 09-S03 power-loss protection | **PASS** ideal toy capacitor 0.5×0.1×(5²−3²)=**0.8J**; at constant8W hold-up**0.1s**, ignoring conversion losses. Actual durability depends VWC, flush/FUA, NAND/FTL + firmware. | **MAJOR** action promises volatile/PLP/flush/FUA choices but `modelInputs` supplies **ONLY** C,Vhi,Vlo,P. No `cachePolicy`, `plpEnabled`, `flushFua`, `powerLossTiming`, `remainingCommitWork` state or pass/fail evidence. The central ACK-vs-durable learning objective cannot be evaluated by the stated model; must not grade merely from 0.8J calculation or a button click. |
| 09-S04 TBW & p99 | **PASS** 2TB×1DWPD×365×5=3650TB=3.65PB decimal, 95×1ms+5×20ms -> mean1.95ms, nearest-rank p99 (99th sorted sample) **20ms**. | **MAJOR** known Atlas `P08` percentile/prerequisite gap, here marked “퍼센타일 기초” yet neither earlier 12 nor 07 taught p99. Also learner pre-`question` already gives mean1.95 and p99 20ms, rather than eliciting computed result. Add 60–90 sec nearest-rank intro. |

**What NOT to reopen:** CXL 4.0 128GT/s official version and JEDEC JESD328 June2026 SOCAMM2 are **confirmed**, not errors; source numeric toy calculations independently pass, no fabricated 2026 per-SKU performance. A07 reviewed previous Round05 16 but these are **new unrelated** 07/09 findings.

## 2. 07 exact actionable fixes — separate learner Before vs gated After

**R6-01 MAJOR · pre-prediction answer leak in four scene field pairs**
Each 07 step uses single `displayText` and `speechText` rather than explicit before/after. Particularly:
- 07-S01 **before** display “빠른 전송과 빠른 첫 응답은 같지 않아요”; Voice “초당 얼마나 많이 보낼지와 첫 데이터가 언제 도착할지는 다른 문제예요” ⇒ directly answers “DDR5-6400이 첫 응답도 보장하나요?”.
- 07-S02 Voice says “오류를 고치는 위치와 신호를 안정시키는 회로는 다른 역할” before the roles evaluation; 07-S03 uses “HBM 빠른 작업대 / LPDDR 용량과 전력 균형” before the offload choice; 07-S04 says “멀리 있는 메모리는 왕복 시간이 달라” before the tier question.
- **A07 did not see actual lesson render**; this is *canonical story contract* pre/post ambiguity. A05 must never treat source `expectedObservation` or guided `hints` as visible pre-answer status.
**Copy-ready learner Before / gated After** (keep source `expectedObservation` as teacher-only until prediction/action):
| Step | `displayTextBeforePrediction` | `speechTextBeforePrediction` | `displayTextAfterObservation` |
|---|---|---|---|
| 07-S01 | **메모리 속도 숫자 하나면 첫 대기시간도 알 수 있을까요?** | “전송 횟수만 두 배로 바꿔보세요. 초당 전달량과 첫 데이터가 오는 시각이 어떻게 달라질지 각각 먼저 예상해 봐요.” | “64비트 6400MT/s는 이론 51.2GB/s; 첫 응답시간은 별도 타이밍에 달려요.” |
| 07-S02 | **이 부품들을 어느 경로에 연결해야 할까요?** | “CPU와 메모리 사이에 등록 회로와 오류 정정 카드가 있어요. 위치와 역할을 먼저 골라보세요.” | “RDIMM RCD는 명령·주소 경로, MRDIMM은 추가 rank data multiplex, on-die ECC와 시스템 ECC의 보호 위치가 달라요.” |
| 07-S03 | **HBM이 가득 차면 다음에는 어떻게 할까요?** | “가중치와 KV가 늘어날 때 어느 장치에 둘지 먼저 골라보세요. 데이터가 이동하는 경로도 표시해 볼게요.” | “용량 계층으로 KV 일부를 옮길 수 있지만 CPU↔GPU 지원 전송 경로·복사·회수 비용이 추가돼요.” |
| 07-S04 | **용량이 늘어나면 매 요청의 이동 과정도 같을까요?** | “자주 쓰는 정보와 드물게 쓰는 정보를 서로 다른 위치에 놓아 보세요. 접근 과정과 대기시간을 비교해 볼까요?” | “이 toy는 local11 / remote25 접근지연 단위예요. CXL.mem은 시스템 메모리, SSD는 별도의 입출력/페이지 이동을 거쳐요.” |
- **After Voice** for each scene should articulate numerical *current model* (not globally valid) and causal reason; never pre-speak the table.

**R6-02 MAJOR · 07-S03 KV offload transport**:
- Before allowing `selected` KV offload, declare `lpddrRole=host memory` and `platformPath=supported GPU↔CPU transfer` as a **scenario prerequisite**, rather than assuming GPU's direct HBM-style access to generic SOCAMM2. The backend model may separately offer `unsupported` as negative case.
- Learner toggles `offloadStrategy=none/selected`, `transferNeeded=0/1` and a **fictional** per-slot transport overhead, with a response counter of transfers/cumulative time. Example `weights=6`, `HBM capacity8`, `KV=12`: 2 KV slots fit alongside weights, 10 require alternative storage; if no transfer path, “현재 구성에서는 직접 옮길 수 없음” rather than instantaneous success. No fabricated real PCIe/NVLink latency.
- `correctIncorrectCriteria` includes explaining **what moves, who moves it, what host/GPU support exists, and price of reading it back**.

**R6-03 MAJOR · 07-S04 separate CXL.mem and SSD**:
- Offer `CPU load/store: local DDR or mapped CXL.mem ONLY`, and a **separate** `SSD backing store via block read/page-fault/page-in` card; do not label the latter as another directly addressed RAM bank. CXL Tier migration requires firmware+OS/hardware configuration (Linux docs), is not automatic to all hosts.
- Show: 8 hot accesses local (8×1) +1 cold remote (1×3) =11 toy memory-access units; reversed 25. For an SSD example, show `I/O request+copy into RAM+later CPU load` as a *different workflow*, not merely compare 30 units as though one load goes to SSD. Button “SSD를 메모리처럼 직접 Load” must yield “아니요, 이 toy에서는 먼저 I/O/페이징 필요”. Real SSD persistent vs CXL.memory volatile or persistent varies by device, not “CXL always volatile”. Guarded test.
- **Official source cross-check**: [CXL Consortium 2026 presentation](https://computeexpresslink.org/blog/introducing-the-cxl-4-0-specification-webinar-qa-recap-4386/), [Linux CXL Type3 and CXL.mem semantics](https://docs.kernel.org/next/driver-api/cxl/devices/device-types.html), [Linux memory-tier initialization](https://docs.kernel.org/driver-api/cxl/linux/early-boot.html).
**R6-04 MINOR 07-S01**: explain 64-bit *aggregate data width* of typical two 32-bit DDR5 subchannels in toy; DDR5-6400 MT/s label isn't a blanket platform guarantee; model doesn't include ECC pins or real burst. Existing deep dive makes limits mostly right.

## 3. 09 exact actionable fixes — avoid arithmetic contradiction and ungradeable PLP

**R6-05 MAJOR 09-S01 geometry**: source `expectedObservation` says centers at ends of toy 1V window: spacing `ΔV=1V/(N−1)`. But hint L2 says “1V를 16개 구간으로” ⇒ `1V/16`, inconsistent. Use replacement hint:
> “16개의 **상태 중심**을 맨 왼쪽부터 맨 오른쪽까지 1V 범위에 놓으면, **중심 사이 간격은 몇 개** 생길까요? 각 간격은 1V를 무엇으로 나눈 값일까요?”
`prediction` replace “SLC/TLC/QLC를 각각 1/3/4비트 저장할 때 서로 구별해야 할 상태 수를 예측해 보세요. 1V 가상 범위에서 서로 이웃한 상태 중심의 간격도 계산해 보세요.”. Keep answer 2/8/16, 1/7, 1/15 teacher-only. If instead teaching **16 bins** across window, change the geometric assumption and *all* readouts to use 1/16 and explicitly distinguish bins from centers; do not mix.
Noise test (if symmetric ±0.08V indicator around **each** center, illustration only): two adjacent uncertainty bands overlap whenever `2×0.08≥ΔV`; TLC Δ0.1429 and QLC Δ0.0667 overlap, SLC Δ1 does not. Noise vs actual Vth Gaussian distributions NOT implied. Note this is toy **uncertainty interval** not proof of real NAND errors.

**R6-06 MAJOR 09-S03 PLP/ACK model**: `learnerAction` lists PLP ON/OFF and flush/FUA, but `modelInputs` includes fixed C=0.1F, V5→3V, P8W **only**, and observation lists only 0.8J and 0.1s. Hence no canonical causal rule for decisions or successful learning demonstration. Add **scenario state contract**:
`cacheType: volatile|nonvolatile-protected`; `writeStatus: notAcknowledged|acknowledged`; `flushOrFua: none|flushCompleted|fuaWriteCompleted`; `plpAvailable: boolean`; `powerLossAt: beforeAck|afterAckBeforeDurable|afterDurable`; `requiredCommitEnergyToy: 0.4|1.2 J`; `capacitorEnergyAvailable: 0.8 J`; `efficiencyAssumption: ideal1` (optionally reduce to e.g.0.8 when tested separately). If `requiredCommitEnergyToy>usableEnergy` no safe completion guarantee from toy PLP, irrespective of PLP tag. Explicit outcome `notProven|volatileAtRisk|protectedUnderDeclaredScenario`, *never* “any ACK ensures NAND commit”.
**Safe teachback options**: (a) ACK + volatile unflushed buffer + powerloss -> at-risk; (b) explicit flush/FUA appropriately completed according to declared drive/block contract -> stronger durability evidence; (c) PLP-capacitor E/P toy is **necessary energy sufficiency check, not blanket guarantee** of all in-flight/data+metadata or distributed transaction. Real NVMe semantics vary by VWC/PLP implementation; source [Linux official write-back cache control](https://www.kernel.org/doc/html/latest/block/writeback_cache_control.html), [NVMe data center SSD OCP spec](https://www.opencompute.org/documents/datacenter-nvme-ssd-specification-v2-6-2-pdf) (PDF identified but NOT visually analyzed in this A07 round).
**Before text**: “완료라는 신호가 오면, 데이터가 어디에 있는지 어떻게 확인할까요?” / Voice “쓰기 도중 전원이 꺼지는 세 시점을 골라보세요. 캐시와 NAND의 상태를 보고 무엇을 믿을 수 있는지 예측해봐요.” **After**: “계산상 0.8줄은 이상적 8와트에서 0.1초뿐이에요. 실제 완료 보장은 쓰기 정책과 제품별 보호 범위가 결정해요.”

**R6-07 MAJOR 09-S04 missing P08 percentile prerequisite**:
- `priorKnowledge` asks for a percentile despite A06 Atlas crosswalk `P08=PARTIAL` and author acknowledges p99 not taught in lesson12. Add 60–90s **nearest-rank classroom bridge** before S04 prediction.
- Paste-ready learner speech BEFORE: “요청을 빠른 순서부터 느린 순서로 정렬해요. 100개 중 99번째 요청은 몇 번째 값일까요? 먼저 직접 찾아볼까요?”
- After: “100개 중 99번째 기록값을 p99으로 읽는 'nearest-rank' 방식을 써요. 95개가 1ms, 5개가 20ms라면 99번째는 20ms예요. 평균은 1.95ms라서 느린 꼬리를 가릴 수 있죠.”
- Replace S04 pre `question` “평균1.95ms여도 p99은20ms?” (fully spoils *both* results) with “빠른 요청이 대다수여도, 가장 느린 요청의 지표는 평균과 같을까요?”. Keep 2TB DWPD question answers post-hidden.
- Test students can compute p99 from **unsorted** cards and choose correct 99th after sorting; wrong `p99≈average` and `p99=max by definition` choices must remain gradeable (nearest rank n=100 happens to be 99th, not maximum).
**R6-08 MINOR 09-S02**: split `displayText` and `speechText` into before-neutral vs after-result as 07. Before: “호스트가 쓴 양과 NAND가 기록한 양이 다를까요?” / “옛 유효 페이지를 옮기는 동안 실제 쓰기량이 얼마나 변할지 먼저 예상해 보세요.” After: “호스트1GiB와 내부 이동0.6GiB면 NAND1.6GiB, WAF=1.6(교육용).”
**R6-09 MINOR source reference hygiene**: 09 `sourceRefs` [X5] currently resolves to Micron marketing account behind sign-in and senior note links a *different generic product category* as low evidence for PLP. **Do not upgrade any individual SSD durability or p99 specification based on [X5]**; keep vendor caveats. A06 should use device-specific public datasheet/official spec with bounded claims when later adding a product case study.

## 4. Author/scene/QA routing and gates
1. **A06** owns changed canonical 07/09 Markdown and updated `production-backlog.md` (current STORY_READY author-only vs A07 independent MAJOR_OPEN). Source handoff: mark `A07_REVIEW_MAJORS_OPEN` or equivalent pending new source SHA. Replace 07 pre vs post fields, make KV GPU/host path and CXL.mem vs SSD distinct. Fix 09 NAND N−1 hint, PLP state/grading contract, percentile introduction + pre-result spoilers. Submit **new exact 07/09 blob SHA** to Issue #6 for A07 retest; no A01 approval request.
2. **A05** must not claim education-science scene PASS from unimplemented source. When later building the 8 scenes, test wrong choices: S01 '2×DDR bandwidth ⇒ half latency' false; S02 RCD as CPU data cache false; S03 unsupported offload/no free transfers; S04 CPU direct load of SSD false; 09-S01 ±0.08 toy center overlap, S02 WAF OP not invariant, S03 PLP inadequate energy + ACK volatile case, S04 sort100 requests p99 and unsorted cases. Browser/Voice/aria negative tests separate.
3. **A02** integration must preserve input-dependent grading; snapshot persistence cannot be replaced with visited button counts. Source QA ≠ integrated app PASS or any real hardware test.
4. **A07** independently rechecks changed blobs. Retain unaffected source **PHYSICS PASS**, no wholesale rejection of current official CXL/JESD328 facts. Existing 11/12/16 source issues, GPU scene, SRAM05 and NAND04 findings remain separate. No main merge or deployment.

## 5. Original standards/tech sources checked during Round06
- CXL Consortium Jan15 2026 FAQ confirms 4.0 is based on PCIe7 128GT/s (link speed, not guaranteed app speed): https://computeexpresslink.org/blog/introducing-the-cxl-4-0-specification-webinar-qa-recap-4386/
- JEDEC JESD328 standard metadata dated June1 2026 SOCAMM2 for data center main memory: https://store.accuristech.com/standards/jedec-jesd328?product_id=3116332 (catalog metadata **not full paid standards body**).
- Linux kernel official CXL type3 device and coherency vs block storage: https://docs.kernel.org/next/driver-api/cxl/devices/device-types.html
- Linux official CXL SystemRAM/DAX and tiers mapping: https://docs.kernel.org/driver-api/cxl/linux/early-boot.html
- Micron SOCAMM2 official vendor page: https://www.micron.com/products/memory/lpddr-modules/socamm (performance ratios dependent on exact test scenario).
- Linux block layer official flush/FUA + volatile cache durability: https://www.kernel.org/doc/html/latest/block/writeback_cache_control.html
- IBM FTL write-amplification analysis: https://research.ibm.com/publications/write-amplification-analysis-in-flash-based-solid-state-drives
**Evidence caution**: source checks above support general science boundaries, not new quantitative claims for a real SSD/DDR/CXL SKU. No private paid JEDEC/CXL docs quoted or reproduced.
