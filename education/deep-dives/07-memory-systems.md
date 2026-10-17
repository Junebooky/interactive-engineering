# A06 senior deep dive 07 — DDR5/RDIMM/MRDIMM/LPDDR SOCAMM2/CXL
CheckedAt: 2026-10-17 KST · Research state: official sources checked; product comparison and real measured latency needs verification.
**주제 질문:** 왜 같은 DRAM이 서버에서는 한 종류의 DIMM으로 수렴하지 않을까?

## 핵심 증거를 엔지니어처럼 읽기
- **DDR5**: Micron DDR5 component matrix는 4800–8800 MT/s 범주를 표기한다. 이는 해당 소개 페이지의 제품/세대 범위이고 모든 CPU/BIOS/board가 최고 속도를 지원한다는 보증이 아니다. DDR5의 on-die ECC는 DRAM die 내부 특정 오류를 보정하나 CPU↔DIMM 데이터 경로 전체를 커버하지 않는다. 검증은 제조사 세대·CPU SKU·DIMM rank/count·population rules·system RAS 지원 자료에 의존. [E1][E3]
- **RDIMM**: Micron 소개는 등록 register가 메모리 컨트롤러의 electrical loading을 줄여 신호 무결성과 모듈 규모를 지원한다고 밝힘. command/address의 RCD를 데이터 cache 또는 CPU cache로 오해 금지. RCD가 있다 해도 read/write latency, capacity, CPU 호환성이 제품별 제약. [E2]
- **MRDIMM**: multiplexed rank는 모듈 내 data buffers/MRCD에 의한 rank multiplex의 별개 레벨. 단순히 "RDIMM에 하나 더 꽂은 것"이 아니며 호스트 플랫폼/펌웨어/신호 timing 지원과 속도·용량·전력 검증 필요. Micron의 '최대 39% 개선' 같은 홍보치는 비교용 SKU/조건 확인 전 보편 법칙 아님. [E4]
- **LPDDR5X/SOCAMM2**: LPDDR의 저전력 선택지가 AI 서버에서도 등장; JEDEC JESD328 (2026-06 유통목록)과 Micron SOCAMM2 사이트 교차 확인. 낮은 와트/GB·용량 활용과 HBM의 높은 대역폭 지향은 별개. 제조사 웹사이트의 "2.3x TTFT"는 내부 Llama3 70B FP16, 500K 컨텍스트, 16 동시 사용자 시험/추정 조건이 있어 **일반화 금지**. [E5][E6][E7]
- **CXL**: 공식 CXL Pressroom 2025-11-18 발표 **CXL 4.0**(이전 3.2보다 신형, 64→128 GT/s, bundled ports, RAS). 공식 발표의 zero-added-latency는 *발표 문맥의 세대별 PHY 지연 주장*이지 'CPU local DRAM과 CXL memory latency가 같음'을 뜻하지 않는다. 공식 specification full 4.0 텍스트는 웹 평가 동의 절차가 있으므로 접근/약관 동의 없이 내용을 아는 척하거나 재배포 금지. [E8][E9]

## 단위/경계 조건 검산
1. DDR5 이론 BW: width=64 data bits ×3200e6 transfers/s /8=25.6 GB/s; 6400 MT/s→51.2 GB/s. ECC 비트·prefetch·on-die ECC와 실제 channel payload/CPU BW 관계는 별도.
2. memory first access (장난감): tRCD 10ns+tCL 10ns→20ns, tRCD 20+tCL 20→40ns. row hit/miss, precharge tRP, refresh, queueing, core cache, frequency 영향을 생략했으므로 **real DDR5 CAS latency 아님**.
3. tier placement example: 8 hot accesses local=8×1, cold=1×3→11 units; hot remote=8×3, cold local=1→25 units. CXL direct attach/fabric, CPU NUMA, QoS, page migration와 실제 latency는 다름.
4. **GT/s vs GB/s**: 128 GT/s는 전송 rate이며 *bus width, protocol flit overhead, encoding* 등이 필요, 데이터 128GB/s로 해석하면 단위 오류.
5. **RAS**: on-die ECC (DRAM internal) vs CPU memory controller ECC/Chipkill vs end-to-end data integrity vs storage PLP protection은 오류 도메인이 다름.

## 대안/실패 모드/설계 판단
- 더 빠른 data rate라도 많은 DIMM을 꽂거나 RAS/reliability 조건을 강화하면 가능한 속도/전력/타이밍이 달라질 수 있다. 플랫폼 메모리 population/thermal limits 먼저 확인.
- 서버 socket local RDIMM 용량과 CXL fabric-attached 메모리는 capacity·access-path·OS tier/placement·sharing semantics에서 다르고, GPU HBM을 무조건 대체하지 않는다.
- KV/weights를 LPDDR로 offload할 때 실제 batch, context-length, KV quantization, CPU↔GPU interconnect, random access rate/activation residency를 함께 모델링한다. 경고: 비용과 지연이 좋아지는 조건도, 악화되는 조건도 존재.
- 분리된 mem tiers의 보안/격리/일관성, 메모리 오류 주입, hotplug/firmware recovery는 심화 follow-up. 

## Three-layer translation
① 학생: "큰 램을 더 꽂으면 무조건 빨라질까요?" ② 조작: 폭×전송횟수와 첫 데이터 시간 별도 비교. ③ 시니어: RCD/MRCD/LPDDR/SOCAMM2/CXL을 BW+latency+capacity+W/GB+RAS+CPU 지원 축에 놓고 설계 검토.

## Source ledger
- [E1] https://www.micron.com/products/memory/dram-components/ddr5-sdram · vendor official · DDR5/on-die ECC · high (상품 범위 조건부)
- [E2] https://www.micron.com/products/memory/dram-modules/rdimm · vendor official · RDIMM RCD · high
- [E3] https://www.micron.com/about/blog/company/partners/redefining-performance-with-ddr5-and-4th-gen-intel-xeon-scalable · vendor official · DDR5 RAS · medium (상용 플랫폼 벤치마크 혼재)
- [E4] https://www.micron.com/products/memory/dram-modules/mrdimm · vendor official · multiplexed rank · high
- [E5] https://www.micron.com/products/memory/lpddr-modules/socamm · vendor official · SOCAMM2·LPDDR5X·TTFT internal testing footnote · high for existence, limited for claimed speed
- [E6] https://store.accuristech.com/standards/jedec-jesd328?product_id=3116332 · JEDEC licensed catalog · JESD328 June 2026 · medium for metadata (원문 미열람)
- [E7] https://www.micron.com/products/memory/lpddr-modules · vendor official · SOCAMM2 vs LPCAMM2 · high
- [E8] https://computeexpresslink.org/news/ · CXL Consortium official · 4.0 release Nov 18 2025 · high
- [E9] https://computeexpresslink.org/cxl-specification/ · Consortium evaluation license page · version 4.0 · high metadata, actual spec features partly unreviewed
**Unresolved:** JEDEC JEP/JEDEC DDR5 register timing original spec access, per-host CXL hotplug OS support, actual 2026 SOCAMM2 platform-independent performance. Recheck at next session; not auto-monitored.
