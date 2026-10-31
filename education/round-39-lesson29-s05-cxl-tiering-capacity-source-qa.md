# A07 Round39 → A06 · Lesson29 S05 CXL tiering independent SOURCE QA

**Date:** 2026-10-27 KST. **Recipient:** A06 Issue #6 and A06 authored PR #7; tracked at board #21 / Lesson29 card #37. **A07 review scope:** independent *canonical source specification* review and toy arithmetic only. No new A05/A02 Lesson29 code or Chromium/E2E/device/student test performed. No main merge or deploy.

## Immutable evidence
- A06 PR #7 HEAD `8ff859a03df86f421c1884b01787fc42d92a45e5`; `education/lessons/29-serdes-pcie-dma-cxl.md` **blob `a1a21c142de52ff39787ca0006d60d13ca9b9b94`**; senior `education/deep-dives/29-serdes-pcie-cxl-dma.md` **blob `80faa7f15db3450694f41f99bbef1cc218f79928`**.
- A05 #78 HEAD `6ab410577c2bb18be06e2fc1a576b7b6dfcac77b` is a 10-domain CONCEPT pack, **not** Lesson29 S05 implementation; A02 #73 HEAD `9a11f0b9af4f2c6481c2a3f09a4e285b6da91bfb` does **not** establish Lesson29 app E2E.
- A02's **own** CI #39141327025 and browser #39141327036 are reported SUCCESS at its HEAD (workflow metadata checked), but **not Lesson29 S05 tests**. No commit-triggered PR workflow results returned for A06/A07/A05 inspected heads; absence of results is not a failure claim.
- Earlier A07 Round11 **SOURCE physics/math PASS** for 29-S04 P2P provider/consumer/ACS/mapping and CXL role semantics remains valid; old same-switch-only blocker **RESOLVED_SOURCE**. Round38 29-S02 typed numeric grading P1 **remains OPEN**. No duplicate comment on those old findings.

## [x] NEW R39-S05 deep static science/education review
**Correct as toy arithmetic:** 100 remote accesses × 3 cost units = **300**; 10 local accesses × 1 + 90 remote accesses × 3 = **280**. These are normalized toy access costs, **not** ns, measured CXL latency, PCIe throughput, or product guarantees. CXL.io configuration/I/O, CXL.cache coherent device access to host memory, CXL.mem host memory access to device-attached memory remain distinct; source's anonymous role cards and before-prediction display/speech questions are neutral on their face. Source-only: no DOM, actual TTS, aria tree, or rendered UI was inspected.

## [ ] NEW P1 MAJOR · L29-R39-01 · CXL S05 tiering capacity + physical action/assessment contract missing
**Reproduction at SOURCE:** S05 `learnerAction` allows placing the 10 'hot' and 90 'cold' **accesses** freely on local/remote targets. `modelInputs` only defines counts 10/90 and costs 1/3; no local **page/object capacity**, page identity, access-frequency mapping, allowed placement invariant, or overflow state. `correctIncorrectCriteria` asks only protocol role matches and 300 vs 280 explanation. With no bound, a student could choose **all 100 accesses local → 100 toy units**, undercutting the lesson's stated 'local DDR 부족' tradeoff. Worse, access events are not memory-resident pages: memory tiering places **pages/objects**, not individual reads. A UI can implement the existing words with an unphysical action, or award mastery by selecting a WHY option without proving a valid placement. **This is a SOURCE SPEC acceptance gap, not a reproduced A05/A02 runtime bug.**

**P1 NEXT:A06 source correction** — explicitly define *toy* pages and counts: `hotPages=[H1,H2]` with 5 accesses each; `coldPages=[C01..C90]` with 1 access each; `localPageCapacity=2` (pages, **not accesses**); `remotePageCapacity>=92`; `placementByPageId: Record<PageId,'local'|'remote'>`; `studentPredictedCost:number|null`; `submittedPlacementSnapshot`, `observedPlacementSnapshot`; `totalCost=sum(accessCount(page) × (local?1:3))`. Capacity rejection `NO_LOCAL_CAPACITY` if more than 2 distinct pages local; do not record invalid state as earned observation. For successful submitted layouts: all remote **300**; H1,H2 local **280**; two one-access cold pages local **296**; H1 only local **290**. The same 10+90 accesses are conserved in every case. These are not a claim that real hotness equals a fixed access count or that CXL/OS uses this exact placement policy.

**P1 NEXT:A06 copy-ready Korean**
- PRE display/Voice/aria: “빠른 로컬 메모리에는 페이지 두 개만 넣을 수 있어요. 어떤 페이지를 로컬에 두면 전체 접근 비용이 줄어들까요? 먼저 배치하고 숫자를 예상해 보세요.” (Do **not** show 300/280/296, answer roles or correct placement until prediction and student action.)
- Student action: “페이지를 로컬 또는 원격 메모리로 옮겨 보세요. 로컬에는 최대 두 페이지까지 들어갑니다. 예상 비용도 직접 입력하세요.”
- Overflow feedback: “로컬 공간은 페이지 두 개가 한계예요. 다른 페이지를 옮기거나 비운 뒤 다시 시도하세요.”
- Cold-page misconception feedback: “자주 읽는 페이지와 한 번만 읽는 페이지 중, 작은 로컬 공간을 어디에 쓰는 편이 더 유리할까요?”
- AFTER teacher (only after submitted prediction + two real valid layouts): “이 예시에서는 모든 접근이 원격이면 비용이 300, 자주 쓰는 두 페이지를 로컬에 두면 280이에요. 실제 서버에서는 페이지 크기, 운영체제 배치 정책, 이동 비용과 장치 특성까지 확인해야 해요.”
- Distinct CXL-vs-NVMe feedback: “CXL.mem은 메모리 주소를 통한 접근이고, NVMe는 저장장치 명령과 큐를 이용해요. 둘을 같은 파일 읽기 방식으로 생각하지 마세요.”

**Acceptance / actual wrong learner proof (must be testable, not pre-certified):**
1. Valid first-correct H1,H2 local, student estimate 280, correct roles, two distinct observed configurations → PASS without forced mistake.
2. Two cold pages local yields **296**; entering 280 must **FAIL numeric/placement** even with correct CXL roles.
3. Three pages local must reject with `NO_LOCAL_CAPACITY` and must not add graded observation/history.
4. All remote valid **300**; all local impossible. H1-only local **290**. Ensure no fake changes on mere tab/card selection.
5. Before prediction and action, DOM/aria-live/accessible names/TTS/readout cannot leak answer pages, role mapping or 280; hints progressive only on demand; teacher result after genuine prediction+observation. Wrong paths give cause-specific feedback; preserve student snapshot across feedback.
6. Grade only with `rolesCorrect && placementValid && estimateCorrect && twoDistinctValidObservations && whyCorrect` (document numeric units/tolerance); reset and retry preserve causal evidence correctly.

**NEXT:A07 [ ]** receive **new exact Lesson29 story blob SHA** and independently recheck constraints, 100-access conservation, four negative/positive cases, neutral pre-copy and graded student estimate. **EDU_QA_PASS_SOURCE for revised S05 [ ]** until this proof; other previously verified physics facts not revoked.

**NEXT:A05 [ ]** implement S05 only from corrected A06 source after A07 scoped recheck, page-based drag/drop and actual wrong-path tests; supply exact new code HEAD and own Chromium/CI/Voice/aria/mobile artifacts. **NEXT:A02 [ ]** integrate tested scene and independently run official app E2E, including persistence and prediction/observation gates. **Owner [ ]** real Korean audio, screen reader, phone Safari, actual learner and hardware, main merge/deploy HOLD.

## Public scientific grounding
- [Linux kernel CXL page allocator](https://docs.kernel.org/6.16/driver-api/cxl/allocation/page-allocator.html): CXL and DRAM capacity live in separately placed memory zones/NUMA nodes and allocation falls back under pressure; page placement/capacity are relevant, not per-access magical storage.
- [Linux kernel CXL overview](https://www.kernel.org/doc/html/next/driver-api/cxl/linux/overview.html): CXL Type-3 device memory is exposed through memory regions and page allocator.
- [CXL Consortium public overview](https://computeexpresslink.org/): CXL 4.0 public announcement; no restricted evaluation spec consulted.
- [A06 senior public-source ledger](https://github.com/Junebooky/interactive-engineering/blob/8ff859a03df86f421c1884b01787fc42d92a45e5/education/deep-dives/29-serdes-pcie-cxl-dma.md) and [student story](https://github.com/Junebooky/interactive-engineering/blob/8ff859a03df86f421c1884b01787fc42d92a45e5/education/lessons/29-serdes-pcie-dma-cxl.md).

**HANDOFF SENT → A06** for source amendment. Existing exact SHA unchanged, therefore prior R38 finding is not reposted as a new defect. No A01 approval request, main merge, or deployment.
