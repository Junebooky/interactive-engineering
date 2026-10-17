# A06 senior deep dive 09 — enterprise SSD flash reliability and tail latency
CheckedAt: 2026-10-17 KST · generic NAND/FTL facts = checked; specific SKU power-loss guarantees/FS semantics = needs verification.

## Four mechanisms and why students should care
1. **NAND TLC/QLC** store multiple bits by distinguishing threshold distributions; read margin and ECC/read-retry/temperature/age matter. Simplified state count 2^b; cannot say actual hardware uses equally spaced distributions or that all higher-density NAND have identical endurance.
2. **GC/FTL/wear leveling** address out-of-place program, block erase, invalid pages. IBM SYSTOR work derives write amplification sensitivity to occupancy, OP, write pattern and reclamation strategy. WAF=physical NAND writes / host writes under declared accounting basis. Even if host LBA unchanged, NAND location shifts [X2][X3]. Do not conflate OS "delete file" with controller erase/trim.
3. **Power loss protection** means stored persistent data and not-yet-committed in-flight data are different domains. PLP may provide hold-up energy/metadata recovery. Enterprise category alone ≠ universal individual data-in-flight guarantee. ACK/FUA/flush chain involves host software, block layer, controller caching policy and physical commit; need model-specific interface semantics to assert durability. Capacitor toy E=½C(Vhi²−Vlo²) with C=0.1F,Vhi5V,Vlo3V⇒0.8J; ideal P=8W⇒0.1s, **not an actual SSD spec**.
4. **QoS/durability**: TBW capacity×DWPD×days; 2TB decimal ×1 DWPD×365×5=3650 TB=3.65 PB toy. 95 samples 1ms +5 samples 20ms give mean 1.95ms; 99th nearest-rank sample 20ms. Reporting must state QD, blocksize, read/write mix, test duration/steady-state GC, error and temperature.

## Failure/lifetime checks
- FTL metadata can be lost/corrupted under unexpected reset; recovery method depends on firmware design. PLP alone ≠ distributed durability, snapshots/backups and replicated storage are separate.
- Retention/endurance/read disturb and bad-block growth require guard bands, wear leveling and ECC; no claim all ECC failures recoverable.
- Inference data loader and checkpoint I/O: high bandwidth vs p99 consistency vs write latency and endurance can dominate depending on dataset reuse/model residence and checkpoint interval.
- Actual firmware behavior cannot be deduced from a consumer/enterprise category name. Any SKU case study must include PDF datasheet *with permission and relevant figures verified*, workload, and manufacturer version.

## Teaching rewrite
- dry: “FTL 인덱스의 garbage collection은 write amplification factor를 높인다.”
- new: “1기가를 저장했는데 NAND는 1.6기가를 썼대요. 중간의 숨은 0.6기가는 어디서 왔을까요?”
- dry: “엔터프라이즈 SSD는 PLP 지원.”
- new: “전원이 꺼지는 순간까지 '저장 완료'의 약속을 지키려면 뭐가 필요할까요? 장치마다 확인해봐요.”
- evidence distinction: FACT CHECKED concept / TOY MODEL values / NEEDS VERIFICATION per drive.

## Sources
- [X1] https://semiconductor.samsung.com/support/tools-resources/dictionary/semiconductor-glossary-nand-flash-memory/ (maker explainer) high general physics
- [X2] https://research.ibm.com/publications/write-amplification-analysis-in-flash-based-solid-state-drives (IBM paper 2009) high flash GC WAF analytical
- [X3] https://www.zurich.ibm.com/cloudstorage/ (IBM Research) high controller architecture
- [X4] https://nvmexpress.org/specification/nvm-express-base-specification/ (NVMe 2.4 2026-08) high version but complete command semantics need original spec review
- [X5] https://www.micron.com/products/storage/ssd (maker product category) low for any individual PLP
- [X6] https://my.micron.com/about/blog/storage/ai/the-right-tool-for-the-job-from-crescent-wrenches-to-ai-infrastructure (maker marketing) medium; numerical p99 claims exclude due unknown workload
**Unresolved:** product data-in-flight guarantee, FUA/flush across storage stack, actual 3D NAND type/spare area, NVMe SMART/endurance group exposure, per-drive sustained p99 QoS. Need hardware/firmware/standard docs.
