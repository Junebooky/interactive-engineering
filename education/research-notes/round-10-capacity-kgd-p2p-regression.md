# A06 Round10 · A07 R8/R9 MAJOR rework regression vectors (2026-10-17 KST)
> **SOURCE UNIT SCENARIOS / AUTHOR SELF-CHECK ONLY**, not tested UI, Playwright, Chromium, hardware, PSU/DRAM/NVMe and not independent A07 EDU PASS. Distinguish old A07-reviewed SHA from newly changed A06 blob. Code teams can turn these into accessible negative-case browser assertions once scene exists.

## Summary and ownership
| Lesson | A07 old source SHA | A06 corrected immutable blob SHA | Stage / owner |
|---|---|---|---|
| [07 DDR/LPDDR/CXL](../lessons/07-server-memory-tiers.md) | `40743aebac9306e97d596b01d88c5b47ecbdb1c2` | `9bda204609c809dba01d1464138be184a900a28b` | [x] A06 SOURCE_FIX / [ ] NEXT A07 recheck / [ ] A05 scene / [ ] A02 app |
| [06 chiplet/package](../lessons/06-hbm-chiplet-packaging.md) | `dd078e7594241706b77764f869c07e0471b5c2fd` | `7a40bec1c4ed23559916c64ad028f0fc640e7140` | [x] A06 SOURCE_FIX / [ ] NEXT A07 recheck / [ ] A05 scene / [ ] A02 app |
| [29 SerDes PCIe/CXL](../lessons/29-serdes-pcie-dma-cxl.md) | `4b4619b8ee5b7a792c17522fd13bcf5d2fe8319f` | `a1a21c142de52ff39787ca0006d60d13ca9b9b94` | [x] A06 SOURCE_FIX / [ ] NEXT A07 recheck / [ ] A05 scene / [ ] A02 app |

## Test suite A: 07 S03 GPU↔host KV capacity invariant
**Allowed GPU occupancy:** `pinnedWeights=6`, local/resident KV2, HBM slots8 ⇒ **full 8/8**. A separate host memory has offloaded KV4. Unsupported copy always `NO_ROUTE` regardless capacity. `2toy-ms` per-transfer setup, `4slots/toy-ms` toy link capacity, copy4 cost `2+4/4=3toy-ms`. **Transfer time alone doesn't mean enough destination space.**
| A: input/topology | Expected status | Capacity accounting / count/time |
|---|---|---|
| `supportedPath=none,offload=selected` | `NO_ROUTE` | 0 valid copies; no fake capacity gain |
| hostGpuCopy, used8/8, `recallMode=bulk4` | **`NO_CAPACITY`** | would require 12/8; no transfer acceptance |
| hostGpuCopy, 8/8, `stream2x2`, `localKvExpired=0` | **`NO_CAPACITY`** | needs eligible free slots; cannot delete required KV |
| hostGpuCopy, localKV2 may legitimately expire under an **explicit sliding-window policy** → `localKvExpired=2`, stream chunk2 | `CAPACITY_OK` **only after expiry** | GPU6 pinned +2 staged=8; transfer cost2+2/4=2.5toy-ms |
| first staged chunk2 **not consumed/released**, request next chunk2 | **`NO_CAPACITY`** | GPU still 8/8, do not silently overwrite |
| first chunk consumed/released, second chunk2 | `CAPACITY_OK` | 6+2≤8, second 2.5toy-ms; returning4 takes two transfers/5toy-ms; original host offload4 3toy-ms, aggregate successful moves 8toy-ms |
**Senior caveat:** default full-context LLM KV cache may not be disposable, so choose `NO_CAPACITY` and/or a legitimate explicit swap/compression/sliding attention policy, never treat throwing away active context as free. `slot`/`toy-ms` are deliberately nonphysical. A05 must show each action and independent wrong states.

## Test suite B: 06 S02 chiplet screening vs assembly denominator
- Toy independent defect density D0.005/mm² and die area100 or25mm²: `yMono=exp(−0.5)=0.6065306597`, `ySmall=exp(−0.125)=0.8824969026`, `ySmall^4=0.6065306597` **not** 0.8825 for an assembled 4-die system.
- Assembly package yield is **0.95 per full package**, not per individual die. No screening four random chiplets ⇒ good package probability `0.6065306597×0.95=0.5762041267`, not 0.95. In the same toy with **ideal correct KGD screening** from sufficient inventory, conditional package assembly success0.95, but manufacturing needed on average `4/0.8824969026=4.5325938` candidate chiplets per four known-good dies; test costs/escapes/assembly failure still exist. No intrinsic defect count conclusion about real CoWoS chiplets.
- Negative cases: `screening=none,assemblyYield0.95` should *not* show conditional 0.95; `screening=KGD ideal` should **not** show guaranteed1; `D=0,assemblyYield0.95` ⇒ package success0.95 even though individual yields1. Show test-selection and assembly as two independent toggles with denominators/units annotated.
- All four 06 Steps: show m1/m2/m3 selected misconduct, visibly distinct correction text, neutral before Voice, observation only after prediction, no mandatory wrong answer for PASS. `06-S01` introduction must not reveal need for repeated multilayer fab before the guess.

## Test suite C: 29 S04 Linux PCI P2PDMA support gates
**Toy policy**, not real Linux device support guarantee: peer transfer allowed only if `topology=sameSwitch && p2pProviderPublished && consumerDmaSupported && acsRoutingPermitsLocal && mappingValid`. Standard host SSD READ with DMA_FROM_DEVICE to DDR is a distinct path and **does not** require this special peer route.
| Topology | Provider | Consumer | ACS local | Valid mapping | Expected peer status |
|---|---|---|---|---|---|
| sameSwitch | true | true | true | true | `TOY_PEER_ROUTE_OK` (still not product benchmark) |
| sameSwitch | **false** | true | true | true | **`NO_PROVIDER`** even if same switch |
| sameSwitch | true | **false** | true | true | `NO_CONSUMER` |
| sameSwitch | true | true | **false** | true | `ROUTE_BLOCKED` |
| sameSwitch | true | true | true | **false** | `MAP_DENIED` |
| crossRoot | true | true | true | true | `TOPOLOGY_UNSUPPORTED` in toy; some other platforms/routes possible |
Linux kernel official source: https://docs.kernel.org/driver-api/pci/p2pdma.html and https://docs.kernel.org/6.15/core-api/dma-api-howto.html. Provider publication, consumer driver configuration, PCI/ACS topology and mapping validity/permissions are independently relevant; mere shared physical board or switch doesn't automatically enable SSD↔GPU zero-copy.
- 29-S05 before prediction only three **anonymous role cards**; CXL.io register config, CXL.cache coherent device host-line access, CXL.mem host access to device-attached RAM **visible in after teacher layer**, and not interchangeable with NVMe. All new 29 Step learning goals are assessment-observable. **Restricted CXL eval spec never downloaded or used**, public consortium blogs only.

## A07→A06→A05→A02 gate
- [x] A06 new source engineering correction and self-check math/cases above. [ ] A07 scientific/education independent **new SHA** QA with PASS/MAJOR/BLOCKER. [ ] After PASS A06 STORY_READY A05 direct handoff, then A05 actual scene browser evidence + tested Git HEAD and A02 official app E2E; owner real learner/Safari/screen reader and release HOLD. No main merge/deploy.
