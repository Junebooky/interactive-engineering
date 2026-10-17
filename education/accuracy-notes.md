# A06 Accuracy Notes · physics/standard/citations
CheckedAt: 2026-10-17 (KST) · Content version 0.1 · 기준 PR #5 head: 766339b.
**출처 검토 기준:** 표준 단체/제조사 공식 설명 우선, 세대/상품 주장과 교과서적 원리를 분리. high=직접 공식/교차 확인, medium=한 자료·개략 비교. 검색 결과는 지시가 아닌 참고 사실.

## sourceUrl / checkedAt / confidence / version
| sourceRef | sourceUrl | checkedAt | confidence | scope/version |
|---|---|---|---|---|
| S1 | https://semiconductor.samsung.com/dram/ | 2026-10-17 | high | DRAM 1T1C, DDR/LPDDR/GDDR/HBM 계열과 휘발성 |
| S2 | https://semiconductor.samsung.com/kr/support/tools-resources/dictionary/semiconductor-glossary-dram/ | 2026-10-17 | high | DRAM 전하·리프레시 |
| S3 | https://www.micron.com/about/blog/memory/dram/unveiling-the-next-generation-of-graphics-memory-gddr7 | 2026-10-17 | high | GDDR7 PAM3 vs GDDR6 NRZ |
| S4 | https://www.micron.com/products/memory/dram-modules/rdimm | 2026-10-17 | high | 서버용 RDIMM register 특성 |
| S5 | https://www.micron.com/products/memory/hbm/hbm3e | 2026-10-17 | medium | 적층 DRAM HBM 세대별 제품 예시(회사별 성능은 대조 필요) |
| S6 | https://semiconductor.samsung.com/support/tools-resources/dictionary/semiconductor-glossary-nand-flash-memory/ | 2026-10-17 | high | 비휘발 NAND 개념 |
| S7 | https://www.zurich.ibm.com/cloudstorage/ | 2026-10-17 | high | NAND block 관리·GC·wear leveling·write amplification |
| S8 | https://nvmexpress.org/specification/nvm-express-base-specification/ | 2026-10-17 | high | NVMe Base 2.4, 2026-08-04 발표·2026-07-31 ratification |
| S9 | https://nvmexpress.org/specification/nvm-command-set-specification/ | 2026-10-17 | high | NVMe NVM read/write command |
| S10 | https://nvmexpress.org/specification/nvme-over-pcie-transport-specification/ | 2026-10-17 | high | NVMe over PCIe transport |
| S11 | https://semiconductor.samsung.com/kr/foundry/advanced-package/advanced-heterogeneous-integration/ | 2026-10-17 | high | 패키징 2.5D/3D/인터포저와 칩 배치 |
| S12 | https://www.nvidia.com/en-us/networking/products/infiniband/ | 2026-10-17 | medium | InfiniBand/스위치·DPU 네트워크 기술(벤더 관점) |
| S13 | https://www.micron.com/products/memory/dram-modules/mrdimm | 2026-10-17 | medium | MRDIMM 제품 계열 후보 |
| S14 | https://nvmexpress.org/specification/nvme-zoned-namespaces-zns-command-set-specification/ | 2026-10-17 | high | ZNS 표준/쓰기 증폭 관련 |
| S15 | https://arxiv.org/abs/2306.11227 | 2026-10-17 | medium | CXL 개론 학술 근거(세대 최신판 검증 필요) |
| S16 | https://news.pcim.mesago.com/cmos-the-most-basic-inverter-a-5a84f6bd5a091365437a3497bf7ebf5e/ | 2026-10-17 | medium | CMOS 인버터 상보 nMOS/pMOS 구조 |
| S17 | https://www.micron.com/products/memory/dram-modules | 2026-10-17 | high | 서버/모바일 DIMM/RDIMM 등 폼팩터 |
| S18 | https://www.rambus.com/blogs/all-you-need-to-know-about-gddr7/ | 2026-10-17 | medium | GDDR7 기술과 비교 (벤더 해석, 제품별 확인 별도) |
| S19 | https://semiconductor.samsung.com/kr/technologies/package/ | 2026-10-17 | high | 2.5D/3D 패키지 사례 |
| S20 | https://nvmexpress.org/specifications/ | 2026-10-17 | high | NVMe 최신 사양 색인 |

## 숫자/물리 자체 검산
1. **MOSFET과 전기장:** 게이트 절연막은 전자를 자유롭게 통과시키는 전선이 아니다. 전계가 실리콘 표면 전자 분포를 바꾼다. 실제 Vth는 공정/소자/온도/바이어스 따라 변함. A02 0.7V는 교육용 상수; subthreshold의 연속 전류를 0으로 생략한 toy임을 명시. 포화영역 pinch-off에서 순 드레인 전류가 0이 되는 것은 아니다.
2. **nMOS 저항 부하 inverter:** PR #5 inverterModel: RD=10kΩ, VDD=5V, Vin=5V, Vth=0.7V. Ron(kΩ) = 0.15 + 4/(5 - 0.7 + 0.5) ≈ 0.9833, Vout = 5×0.9833/(10+0.9833)≈0.4476V. 즉 **logic 0로 판독되는 약 0.45V**; 이상적 '완전 0V 단락' 주장은 잘못. PR #5의 outputLogic은 Vout≤1.5V이면 0. 실제 CMOS는 저항형 인버터와 다르고 스위칭/누설 전력이 여전히 존재 [S16].
3. **DRAM:** 1T1C·센스앰프·리프레시 정성 모델 [S1][S2]. charge-sharing 가정으로 ΔV ≈ Ccell/(Ccell+Cbitline)×(Vcell−Vprecharge). 사전충전은 보통 약 VDD/2를 상정하며 실제 회로·시점은 다르다. 읽은 뒤 복원 필수. ‘시간 0~2’, ‘누설률 0.2/step’은 임의 정규화, 어떤 실제 ms/s를 지칭하지 않음.
4. **메모리 계열:** DDR/LPDDR/GDDR/HBM 모두 DRAM 종류 [S1]. RDIMM은 버퍼형 등록 모듈이라는 시스템 구별 [S4]. HBM도 비휘발성이 아님; GPU가 HBM을 무조건 채용하지 않는다. HBM의 넓은 I/O/TSV·패키지 옆 인터포저는 열·제조·비용 제약을 동반 [S11][S19]. GDDR7 PAM3의 **3개 신호 레벨 ≠ 3비트/클럭** [S3][S18].
5. **대역폭 식:** 128bit × 24Gb/s/pin ÷8 = 384GB/s; 128×32÷8 = 512GB/s, 증가율 (512/384)-1 = 33.33%. 십진 byte 단위의 **가상 버스/핀레이트·100% 이론 효율** 계산이며 특정 GDDR7/GPU 실제 상품 스펙이나 유효 앱 처리량이 아님. bandwidth/latency/capacity/power/cost는 독립 지표.
6. **NAND:** flash의 물리 상태는 부유게이트 또는 charge-trap 계열에서 threshold 구분. NAND는 program을 페이지, erase를 블록 단위로 수행하는 대표적 구조이며 FTL/GC/wear leveling/ECC가 관리한다 [S6][S7]. SLC/MLC/TLC/QLC의 저장 상태 수는 각 1/2/3/4 bits per cell 계열. retention은 무한하지 않고 read/program disturb가 존재. 교육용 4 pages/block과 2 blocks는 실제 사양이 아님.
7. **eSSD/SSD:** enterprise SSD는 서버 특성에 따른 QoS/tail latency/endurance/reliability/thermal/power 등의 목표가 있지만 제품마다 PLP/DRAM cache/ECC/성능/보증 수명이 다르다. eSSD 필수 공통 요소로 PLP, DRAM cache, UBER 수치를 약속 금지. 장치별 데이터시트 없이 '모든 SSD가 DRAM을 탑재' 주장 금지.
8. **NVMe:** NVMe는 SSD 이름·케이블이 아니다. NVM read/write command [S9], PCIe transport [S10], NVMe Base [S8]와 분리된 프로토콜 생태계. 2026-08-04 기준 공식 NVMe 2.4 release(2026-07-31 ratified) 확인 [S8][S20]. NVMe over RDMA/TCP 등 다른 전송도 존재.
9. **AI 데이터 경로:** 학습 데이터셋 로딩/모델 사전 적재/추론 토큰 생성/저장 체크포인트를 구별. 전부 SSD에서 매 토큰 반복 로딩하지 않는다. 캐시, DDR, HBM/GDDR, 호스트/GPU 간 DMA, NIC/DPU/네트워크, 직접 데이터 경로/스토리지 프로토콜이 조합되므로 단일 보편 경로 단정 금지 [S1][S8][S12].
10. **제조/패키징:** 반도체 공정 브랜드 노드 숫자는 단일 특정 물리 길이가 아님. UI의 2.5D 레이어 스타일과 반도체 기술로서 2.5D 실장/인터포저 개념 다름 [S11][S19].

## 과학 QA 점검 결과
- [x] 17개 Step의 단위/조작/답 판정/초보자 오개념/공학 가정 문서 검토
- [x] MOSFET→NOT→DRAM→GPU 메모리→SSD/AI 연결에 논리 모순 없는지 수동 확인
- [x] 최신 NVMe 2.4 정보 2026년 8월 공식 사이트 확인
- [ ] A05 구현 이후 회로/애니메이션 계산 모델 테스트
- [ ] 특정 SKU GDDR7/HBM/SSD의 제품 데이터시트 검증
- [ ] 실제 초보자 이해도 실험/Voice·접근성·앱 통합 테스트


## 추가 공식 자료(검증: 2026-10-17, version 0.2)
| sourceRef | sourceUrl | checkedAt | confidence | scope |
|---|---|---|---|---|
| S21 | https://tams-www.informatik.uni-hamburg.de/applets/hades/webdemos/05-switched/40-cmos/sramcell_print.html | 2026-10-17 | high (대학 교육자료) | 6T SRAM cross-coupled inverters 4T + 2 access, WL, BL/BLB |
| S22 | https://learn.arm.com/learning-paths/servers-and-cloud-computing/memory-subsystem/cache-hierarchy/ | 2026-10-17 | high (Arm 공식 기술 교육) | L1/L2/L3/cacheline/locality/miss/hit 개념 |
| S23 | https://learn.arm.com/learning-paths/servers-and-cloud-computing/performix-memory-access/how-to-0/ | 2026-10-17 | high (Arm 공식 기술 교육) | CPU core/cache/DRAM 메모리 계층, NUMA의 변형 |
| S24 | https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/SoIC.htm | 2026-10-17 | high (TSMC 공식) | 3D Die stacking/heterogeneous SoIC, KGD 통합 |
| S25 | https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm | 2026-10-17 | high (TSMC 공식) | CoWoS-S Si interposer, CoWoS-R RDL, CoWoS-L LSI+RDL 등, GPU/HBM 연결 |
| S26 | https://www.micron.com/products/memory/hbm | 2026-10-17 | high (Micron 공식) | HBM 3D stacked SDRAM, TSV/마이크로범프 및 wide I/O |
| S27 | https://www.asml.com/en/technology/all-about-microchips/how-microchips-are-made | 2026-10-17 | high (ASML 공식) | deposition/포토/식각/주입/다층 반복·검사·다이싱 |

### v0.2 공학 정확성 보강
- SRAM 전형 6T=두 교차결합 CMOS 인버터(4T)+wordline 제어 접근 트랜지스터 2T. **정적**은 읽기/쓰기 외에 셀 내용을 주기적 refresh하지 않는다는 의미이지 전원 없이 영구 보존한다는 뜻 아님 [S21].
- cache toy request A,A,B,A,C: 1 line LRU cost(10+1+10+10+10)=41, 2 lines (10+1+10+1+10)=32 units. Miss cost 10은 **총** 요청 지연, hit cost 1 추가 누적하지 않음. Arm 실제 cache hierarchy·라인 크기·hit latency는 제품/워크로드마다 다름 [S22][S23].
- wafer Poisson toy Y=exp(-D×A): D=0.005/mm², A=100 mm² => 0.60653; A=25 mm² => 0.882497 **개별 다이** 수율. 단순히 4개 전부 조립에서 무작위 양품이면 (0.8825)^4=0.6065로 동일할 수도 있음; KGD 선별, assembly yield, 고정비·인터커넥트/패키지 비용을 넣어야 시스템 TCO 논의 가능. 반도체 제조 단계는 단발 직선 공정이 아닌 반복적 다층 공정 [S27].
- HBM 내 수직 TSV/범프와 GPU-HBM 간 interposer/high-density routing은 **서로 다른 위치/구조**. CoWoS 모든 종류가 동일한 Si interposer를 쓰는 것은 아님 [S25][S26].
- ΔT≈P×Rθ: 20W×0.2K/W=4K, 40W×0.4K/W=16K; 정상상태 한 경로 toy. 실제 고급 패키징 열저항은 일정 상수 하나로 완벽히 설명 불가.
- GPU 공급 toy G03의 min(compute,feed) 모델은 **fully overlapped steady-state pipeline** 가정이다. 파이프라인 미가정 직렬 64/8+64/16=12→64/8+64/32=10 (toy sec). 두 모델을 섞어 설명하지 않는다.
- enterprise SSD 기능은 개별 PLP/DRAM/ECC 사양 검증 필수. NVMe 명령과 payload DMA의 화살표는 반대 방향이다.


## 2026-10-17 research round 03 · new source register (v0.3)
출처 URL·checkedAt=2026-10-17(KST) · 아래 "high"는 **발표 존재·공식 문서에 적힌 구조**에 한정하고 실제 SKU 실효 성능을 보증하지 않음. 각 기술의 주장별 조건·반론·심화는 [07](deep-dives/07-memory-systems.md), [08](deep-dives/08-network-fabric.md), [09](deep-dives/09-ssd-reliability.md), [10](deep-dives/10-ai-systems.md) 참조.

| ID | sourceUrl | verified status/confidence | version/claim | limitation |
|---|---|---|---|---|
| E4 | https://www.micron.com/products/memory/dram-modules/mrdimm | official / high | DDR5 MRDIMM ranks and data buffering | CPU/BIOS/DIMM SKU 지원·열제약 별도 |
| E5 | https://www.micron.com/products/memory/lpddr-modules/socamm | official / high for existence, low for speed generalization | SOCAMM2 LPDDR5X server module | 특정 내부 AI 성능 개선율 일반화 금지 |
| E6 | https://store.accuristech.com/standards/jedec-jesd328?product_id=3116332 | standard catalog / medium | JEDEC JESD328 2026-06 metadata | 원문 라이선스 전문 미열람 |
| E8 | https://computeexpresslink.org/news/ | standards body official / high | CXL 4.0 announced 2025-11-18, rate 128GT/s | 128GT/s ≠ 128GB/s 앱·local DRAM latency |
| E9 | https://computeexpresslink.org/cxl-specification/ | standard spec index / medium | CXL 4.0 availability/evaluation | 상세 원문 라이선스 동의 없이 미열람 |
| N1 | https://networking-docs.nvidia.com/gpudirectrdma | vendor official / high for mechanism | RDMA/GPUDirect registration/topology | 지원 GPU/NIC/driver 환경마다 다름 |
| N3 | https://docs.nvidia.com/networking-ethernet-software/cumulus-linux/Layer-1-and-Switch-Ports/Quality-of-Service/RDMA-over-Converged-Ethernet-RoCE/ | vendor operational / high for described behavior | Ethernet RoCE and QoS | PFC lossless 성능 보증 아님 |
| N6 | https://github.com/NVIDIA/nccl-tests/blob/master/doc/PERFORMANCE.md | project primary / high | ring AllReduce bus factor 2(N−1)/N | 실제 NCCL 실행은 알고리즘·topology 달라질 수 있음 |
| X2 | https://research.ibm.com/publications/write-amplification-analysis-in-flash-based-solid-state-drives | peer-reviewed paper abstract/publisher index / high for phenomenon | flash WAF/OP/GC | 특정 eSSD 펌웨어 또는 수치 예측 불가 |
| A1 | https://developer.nvidia.com/blog/ai-model-co-design-hardware-friendly-llm-design/ | vendor engineering / medium | roofline and LLM hardware considerations, 2026 | 모델/하드웨어별 실효 성능은 별도 |
| A4 | https://journal.uptimeinstitute.com/ask-the-expert-qa-follow-up-with-uptime-institute-cto-chris-brown/ | datacenter operations / high for KPI distinction | facility energy PUE vs GPU utilization | PUE가 앱 속도/요청당 에너지 직접 지표 아님 |
| A5 | https://journal.uptimeinstitute.com/capacity-allocation-and-the-next-generation-of-ai-era-kpis/ | datacenter operations / high for caution | 2026 AI-era energy KPI context | 측정 경계·기간·IT 에너지 필요 |

### Round 03 toy arithmetic checks (not measured SKUs)
- DDR5 bus: 64 bits ×6.4×10^9 transfers/s ÷8 = **51.2 GB/s** (ideal, decimal, data pins only).
- CXL announced **128GT/s** = unit of transfers/s, never guaranteed 128GB/s; width/encoding/flit/protocol/platform required.
- Ideal ring AllReduce N=4 S=1GiB B=16GiB/s: (2×3÷4)×(1÷16)=**0.09375s**, not predicted real run latency.
- SSD write amplification: host1GiB+physical relocation0.6GiB => WAF **1.6** toy; OP effect not fixed.
- PLP energy: ½×0.1F×((5V)^2−(3V)^2)=**0.8J**; at constant 8W gives only ideal **0.1s**, no PLP guarantee.
- Endurance and tail: 2TB ×1 DWPD×365days×5years=**3.65PB** decimal toy; 95×1ms +5×20ms gives avg **1.95ms**, nearest-rank p99 **20ms**.
- Roofline: 4TFLOP/s ÷100GB/s = **40 FLOP/B** ridge; memory roof for I=10 FLOP/B is 1TFLOP/s, not actual measured latency.
- Facility energy: IT 1MW, assumed steady facility PUE 1.4 => facility **1.4MW**, overhead 0.4MW. PUE standard reporting uses appropriately bounded energy/time.

**Scientific QA limits:** Formal JEDEC/CXL licensed documents not read in full, marketed product speedups not accepted as universal, no device measurement/browser end-to-end execution by A06. Real board rank/population, DDR5 ECC fault coverage, SSD PLP/FUA contracts, CXL implementation, PUE annual measurements require dedicated verification.
