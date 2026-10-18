# 28 · UCIe 3.0 시니어 팩트·검증 대장 (D2D PHY · 협상 · 프로토콜 · 오류 이벤트 · 에너지)
> A06 2026-10-18 original teaching-research source ledger. [Lesson #74](https://github.com/Junebooky/interactive-engineering/issues/74), [student original](../lessons/28-ucie-chiplet-link-negotiation.md). **A06 self-QA only; independent A07 review [ ]**. The official UCIe 3.0 specification was released **August 5, 2025** per UCIe Consortium press release [R1], with new supported 48/64 GT/s rates per official summaries. The complete detailed specification text is not fully audited here. A published spec does not certify silicon SKUs, partner compliance, system integration, real package/interposer, throughput or production yields.

## 0. Architecture map (not an arbitrary marketing synonym)
CPU/GPU chiplets inside **single semiconductor package** can exchange data via die-to-die D2D UCIe technology. Physical UCIe is not literally external PCIe card slot, memory controller coherency protocol, 3D NAND TSV, or network fiber; 2.5D industrial silicon interposer packaging is unrelated to the educational 2.5D SVG artistic projection. UCIe layer framing separates PHY/adapter/protocol use, link training, fault tracking and electrical layout. CXL cache/mem/io are separate **protocol semantics** potentially transported over UCIe under actual implementation. See UCIe official spec overview [R1],[R2] and CXL consortium [R4],[R5].

## 28-S01 · Raw path vs payload (x16 toy module)
- **Assumptions:** One `toyModule` is fixed 16 independent lanes, one bit per transfer per lane, no serialization encoding/CRC overhead. Module count1|2 and nominal GT/s per lane32|64 independently selectable in *pedagogical aggregate*. This does not assert any one UCIe package configuration or profile uses that exact proposed module layout under all channel profiles.
- `bitRateGbitPerS = moduleCount × 16 × rateGT/s ×1bit/transfer`; `B/s = bit/s ÷8`. 1×16×32/8=64GB/s per direction, 1×16×64/8=128GB/s, 2×16×32/8=128GB/s, 2×16×64/8=256GB/s, decimal billion bytes, not GiB/s. E.g. theoretical 256GB/s=~238.42GiB/s (divide by 2^30 after converting bytes), this conversion not necessary for learner pre-reveal. Both directions must not be summed without explicit full duplex accounting.
- **Boundary:** 64 GT/s standard *option* and per-lane symbol transfer rate does NOT automatically translate to a specific product app payload throughput, 64GB/s software copy, sustained memory bandwidth, 100% occupancy, or a family/module/speed actually shipped.
- **Reviewer critical negatives:** GT vs GB confusion; multiplying two modules and claiming all real fabric speed2×; mixing 2.5D imagery and 2.5D semiconductor package. See [R1],[R2].

## 28-S02 · Rate negotiation and interoperability must be distinct
- **Toy support sets:** End maximum cap32 means set{32}, cap64 means set{32,48,64}; `toyNegotiatedGT/s=min(leftMax,rightMax)` *only* under assumed shared electrical/package/protocol/link conditions. Cases 64|32→32,32|64→32,64|64→64,32|32→32. Before actual `ATTEMPT_TRAIN`, link status `NOT_TRAINED` and speed is **candidate** not proven observed. Training event in *toy fixture* can show `TOY_LINK_TRAINED`, never hardware compliance.
- **Main engineering counterexample:** both endpoints advertise 64 but different electrical channel reach/bump/retimer/firmware unsupported, or unknown mandatory option => actual link could fail/derate. The consortium states backward compatibility at specification architecture level [R1]; no specific off-the-shelf mixed-chiplet certification guaranteed.
- **Senior questions:** selected channel package standard/advanced/3D; reference clock/link state machine; parameters; interposer parasitics; training log; lab BER/eye; functionality and thermal margins. None tested here. 48GT/s is published and supported in standard, but deliberately not a student slider choice; absence of option must not imply it is unstandardized.

## 28-S03 · UCIe link bits are not CXL.cache semantics
- **Distinct examples:** UCIe 3.0 continuous raw streaming allows mappings for applications such as SoC↔DSP [R2]. CXL consortium defines `CXL.io` for discovery/initialization/configuration, `CXL.cache` for device accessing cache-coherent host memory, `CXL.memory` for host accessing attached device memory; permission/protocol/software stack not implied by PHY [R4],[R5].
- **Pedagogical router** offers two mutually exclusive configured protocols `RAW_STREAM` and `CXL_CACHE` and two test requests `SENSOR_STREAM` and `COHERENT_CACHE_READ`. Matched⇒`PROTOCOL_ROUTE_POSSIBLE` **not actual accepted memory access**. Mismatched⇒`PROTOCOL_NOT_CONFIGURED`; before SEND_REQUEST⇒`NOT_RUN`. No actual CXL opcodes/IDE/security, memory permission, virtual/physical addresses, cacheline operations, credits, latency claims. This restricted one-mode-at-a-time routing must not be described as a universal UCIe limitation: real designs may multiplex multiple protocols.
- **Reviewer gotcha:** "raw bytes can be parsed by receiver therefore raw guarantees coherent memory" is false; accidental scheme could implement application-defined coherent protocol but not automatically CXL.cache. A CXL-capable connection must implement the relevant protocol and required host-device semantics, not just toggled mode.

## 28-S04 · CRC detection is not recovery, retry setting is not transmission
- **Event graph:**
  1. CONFIGURE `firstFlitCorrupt:boolean`, `adapterRetryConfigured:boolean`, no actual transfer.
  2. Learner explicitly emits `SEND_FIRST_FLIT`, immutable snapshot. Our **oracle toy** perfectly detects corruption (it is not a probability model).
  3. Clean⇒DELIVERED/0 repairs; bad & retryOff⇒DETECTED_UNRECOVERED/0 repairs; bad & retryOn⇒RETRY_PENDING/**delivered=false** (still 0 actual repair).
  4. Only explicit `ATTEMPT_RETRY` in pending state results in scripted clean *second* flit: `DELIVERED_AFTER_RETRY` and `repairCount=1`.
  5. After first event any configuration edit⇒`CONFIG_LOCKED_RESET_REQUIRED`; `NEW_TRIAL_RESET` creates fresh trial ID; event history of earlier trial immutable.
- UCIe D2D adapter and link integrity/retry are protocol/mode/BER condition-specific [R1], not guaranteed in all raw profiles; avoid claiming a universal CRC polynomial, any raw BER threshold, or fault correction capacity. Toy corrupt flag is hypothetical observed damage, not hardware BER. Real retry can fail too; 'second always clean' is an explicit scenario convenience.
- **QA blockers:** retry enabled but not attempted cannot receive DONE; toggling retry after a failed event cannot retro-authorize old trial; corrupt and retryOff cannot be rendered green; a NOT_RUN first event cannot count as mastery observation; 1st correct with valid actual events must be allowed.

## 28-S05 · Active PHY energy vs subsystem power
- **Toy:** single x16 aggregate, one bit/transfer, one direction active continuous. Input rate32|64 GT/s and **fictional** energy `0.5|1pJ/bit` *independent* controls.
- `P[W]=rate[GT/s]×10^9[transfers/s]×16[lanes]×1[bit/transfer]×E[pJ/bit]×10^-12[J/pJ]`. 32,.5→.256W; 32,1→.512W; 64,.5→.512W;64,1→1.024W. Counterexample power equal if speed doubles from32→64 while joules/bit halves from1→.5. 
- **Boundary:** spec 3.0 feature mentions runtime TX recalibration and L2 optimization [R2], but no user-selected values0.5/1 pJ/bit in official source are **claimed or measured**. Actual package total may include clock tree, link adapter, idle power, power conversion, interposer loss, SerDes, refclk, temperature/reliability. Real workload rate ≠ advertised PHY potential; power may have nonzero static terms, design/device variability.
- **Reviewer gotcha:** no claim increasing speed always cuts power or always doubles package W. No temp rise/kWh conversion without duty cycle/time/thermal resistance; minimum total W not inferred.

## Source fact hierarchy and date/version table
| Authority | Checked 2026-10-18 | What confirmed | What remains NOT established |
|---|---|---|---|
|[R1] UCIe Consortium spec highlights & press release|Official 2025-08-05 v3.0 release|48/64 GT/s support, 2.0 reference32GT/s, backwards-compatible spec feature, manageability|Exact product SKU, field throughput, real PHY eye margin, package lane repair|
|[R2] UCIe Consortium public 3.0 explanation/webinar|Aired 2025-09-18|Continuous raw transfer for SoC↔DSP, management & recalibration; sideband options|Application buffer semantics, shipping wattage|
|[R3] UCIe3.0 spec page and earlier 2.0 summary|Official|Package/3D, manageability feature evolution|All channel training choices and external signal margins|
|[R4] CXL Consortium introductory article|Official|CXL.io/cache/memory separate roles|Automatic coherence of any UCIe link|
|[R5] CXL Consortium detailed blog / security|Official|protocol and security topics require own semantics|Any real security/access authorization of toy|
|[R6] UCIe standard overview, adapter retry context|Official high-level overview|Integrity is independent of fault-free inference|Any observed BER/FIT/retry success|
|[R7] UCIe3 runtime power feature|Official|Recalibration / low-power states matter|0.5/1pJ/b toy values, actual total PHY W|

## Independent QA queue
- [x] A06 mathematics and event consistency self-tested on fixtures in student source. 5 independent learner source scenes with 5 neutral pre-Voice/5 guarded teacher Voice, 15 wrong-root feedback, 3-level hints x5; initial/default settings not accepted as action evidence.
- [ ] **A07 independent SCIENCE+EDUCATION source review** exact immutable two file blobs and scenario matrix; confirm official vs fictional claims, source no early correct values/teacher readout/Voice, 15 independent wrong feedback and fresh reset semantics. Report exact SHAs with PASS/MAJOR to [#74](https://github.com/Junebooky/interactive-engineering/issues/74) and A06 [#6](https://github.com/Junebooky/interactive-engineering/issues/6).
- [ ] **A06 only after actual A07 PASS** correct issues/new SHA, direct A05 #4 five source scenes typed contract. [ ] A05 actual React/SVG science, browser mobile/keyboard/voice/ARIA/CI screenshot, A02 official app E2E, owner release/native/hardware all separately OPEN.
- [ ] Future silicon co-design questions: package floorplan shoreline limits, PHY lanes/hybrid bonding/retimers, power islands and clock forwarding, DC resistance/thermal/physical test equipment, CXL security/permissions. UCIe 3.0 raw examples cannot stand in for an optical CPO link.

## URL citations (public primary research)
- [R1] https://www.uciexpress.org/specifications and https://www.uciexpress.org/press-releases
- [R2] https://www.uciexpress.org/post/ucie-3-0-specification-redefining-chiplet-interconnects and https://www.uciexpress.org/webinars
- [R3] https://www.uciexpress.org/specifications
- [R4] https://computeexpresslink.org/blog/introduction-to-compute-express-link-cxl-the-cpu-to-device-interconnect-breakthrough-2313/
- [R5] https://computeexpresslink.org/blog/compute-express-link-1-1-specification-now-available-to-members-2339/ and https://computeexpresslink.org/blog/integrity-and-data-encryption-ide-trends-and-verification-challenges-in-cxl-compute-express-link-2797/
- [R6] https://www.uciexpress.org/specifications
- [R7] https://www.uciexpress.org/post/ucie-3-0-specification-redefining-chiplet-interconnects
