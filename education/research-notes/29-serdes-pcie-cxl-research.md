# 29 · SerDes/PCIe/CXL 연결 연구 메모 (A06, 2026-10-17)
**RESEARCHING**. 직전 16 CMOS NAND→latch→DFF 4-Step 집필 완료, A07 검수 중이므로 독립 주제 29 선정. 메모리/CPU/GPU/SSD/NIC 연결에서 **PHY 신호율, 인터페이스 링크 대역폭, 애플리케이션 데이터 전송량**을 구별하는 선행 지식 공백이 커서 P0로 선정.

## 5개 초보 WHY 질문 → 시각 실험 아이디어
1. 전선 한 가닥이 엄청 빨라지면 무조건 데이터가 더 빨리 도착할까? 직렬 differential SerDes lanes vs parallel.
2. PCIe 7.0 x16 512 GB/s는 한쪽 방향 512일까? **양방향 합계 512GB/s 최고 사양 프레이밍**, 한 방향을 단순 반분하면 256GB/s link급 수치(사용자 데이터 처리량 아닌 상한).
3. PAM4 신호는 네 전압 단계면 무슨 장점/대가? PCIe6/7 4-level modulation, FEC/CRC 256-byte FLIT 역할/지연·전력 상충.
4. NVMe 명령을 받는 CPU와 데이터를 DMA로 쓰는 장치가 같을까? endpoint/root complex/switch/IOMMU/호스트 주소 공간.
5. CXL.mem·cache와 PCIe 데이터패킷의 의미가 왜 달라? CPU-coherent memory semantics vs I/O semantics, topology latency.

## 공식 자료 교차
- PCI-SIG Base PCIe7.0 dated **2025-06-11** https://pcisig.com/PCIExpress/Spec/Base/_7.0
- PCI-SIG FAQ PCIe7 **128GT/s** and **x16 최대 512 GB/s bidirectional aggregate**, not one-way application throughput https://pcisig.com/what-data-rate-pcie-70-specification
- PCI-SIG PCIe6 FAQ PAM4/FEC/FLIT, **64GT/s**, x16 max256GB/s bidirectional https://pcisig.com/faq?field_category_value%5B%5D=pci_express_6.0&keys=PAM4
- 256-byte FLIT fixed-length for FEC/CRC, PCIe6 https://pcisig.com/what-flit-mode-and-why-did-pci-sig-move-unit-data-exchange
- PCI-SIG blog public transfer-layer illustrative payload 236 bytes within256B FLIT => `236/256=0.921875=92.1875%`; **not** true all end-user payload efficiency https://pcisig.com/blog/pcie%C2%AE-60-specification-webinar-qa-deeper-dive-flit-mode-pam4-and-forward-error-correction-fec
- CXL Consortium 4.0 specification listing https://computeexpresslink.org/cxl-specification/ ; consortium's 2025-11 CXL4 announcement includes 128GT/s, bundled ports, RAS. Full spec agreement **not accepted or read**. Product support / NUMA latency not yet verified.
- PCI-SIG notes subsequent PCIe 7.1 draft publicly, exact SKU/platform implementations unverified https://pcisig.com/specifications/pcie-70-specification-version-03-now-available-members

## 시니어 guardrail
GT/s vs GB/s, PAM4 4 physical signal levels vs GT/s specification interpretation, signaling vs TLP/FLIT/header/FEC/retries, x4 vs x16 lane count, negotiated speed/lane/retimer distance, PCIe IO payload vs CXL memory coherence. Do NOT double count PAM4 2 bits/symbol on top of specified PCIe GT/s value. Release of a spec is not shipment of interoperable system. Need next research: Linux DMA/IOMMU official APIs, practical P2P restrictions, low/high latency and CPU chipset topology. Source-boundary and actual scope will be marked per Step.

**Next actions (independent work session):** read OS DMA docs → quantitative bandwidth units & coding overhead model → new four-step storyboard with prediction-first and 3 misconception-specific hints → request A07 EDU review → if pass handoff A05 without A01 lesson-by-lesson gate. No merge/deploy.
