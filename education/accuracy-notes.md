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


## Round 04 source ledger · core semiconductor and intro electronics (checkedAt 2026-10-17)
| ref | URL | role / status | limits / claims allowed |
|---|---|---|---|
| PN-A | https://ocw.mit.edu/courses/3-024-electronic-optical-and-magnetic-properties-of-materials-spring-2013/833afa926e598523708318bdf7d6a4ed_MIT3_024S13_2012lec18.pdf | MIT academic 2013 lecture18 pp4/5/7 **visually checked** | PN depletion approximation, Vbi and bias, not commercial Si device parameter |
| PN-B | https://openstax.org/books/university-physics-volume-3/pages/9-7-semiconductor-devices | open university text checked | diode qualitative drift/diffusion; leakage idealization |
| PN-C | https://openstax.org/books/university-physics-volume-3/pages/9-6-semiconductors-and-doping | open university text checked | donor/acceptor/holes; contains inconsistent p-type majority sentence: **p majority is holes**, verified MIT |
| EL1/2 | https://openstax.org/books/college-physics/pages/20-2-ohms-law-resistance-and-simple-circuits ; https://openstax.org/books/university-physics-volume-2/pages/9-5-electrical-energy-and-power | official open textbook | I=V/R for ohmic; P=VI, W=J/s |
| EL3/4 | https://openstax.org/books/university-physics-volume-2/pages/10-key-equations ; https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits | open textbook | Kirchhoff, τ=RC, e^-t/τ, 0.632/0.368 fractions |
| EL5 | https://openstax.org/books/university-physics-volume-2/pages/8-3-energy-stored-in-a-capacitor | open textbook | Ecap=½CV²; source energy ≠ stored |
| MOS-START | https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/pages/lecture-notes/ | official course topic index only | MOS accumulation/depletion/inversion; deeper material and threshold numeric still RESEARCHING |
| STD-UCIe | https://www.uciexpress.org/specifications | UCIe consortium official | **UCIe 3.0** Aug2025 48/64GT/s; actual interop/chip SKU not verified |
| STD-PCIe | https://pcisig.com/specifications/pcie-70-specification-version-03-now-available-members | PCI-SIG official | **PCIe7.0** June2025 raw 128GT/s; app payload, platform SKU not implied |
| IMEC-RD | https://www.imec-int.com/en/articles/advancing-cfet-based-device-roadmap-novel-integration-modules-and-standard-cell | research organization 2026 | GAA/CFET R&D roadmap; future R&D path ≠ commercial mass-product availability |

**PN unit/failure checks**: 300K, VT=0.025852V, NA=ND=1e16 cm^-3 ni=1e10 cm^-3 illustrative => Vbi0.7143V, W(VA=-1/0/+0.2)=0.6659/0.4298/0.3647µm. Is=1pA n=2 toy I(0.3)=0.330nA I(0.4)=2.289nA. Vbi is not freely available battery output, reverse nonzero leakage, n/p bulk neutral, p majority holes. **12 RC**: τ1kΩ×10µF=10ms; Vcharge(τ)=3.16V/Vdischarge(τ)=1.84V at5V, resistor series/parallel5V→2.5/10mA; Ecap10µF@5V=125µJ; source P=5V×10mA=50mW, 10s→0.5J. All toy with omissions detailed in [11 PN note](deep-dives/11-pn-foundations.md)/[12 RC note](deep-dives/12-electricity-rc-foundations.md).

**All broader 115 topic graph entries are curriculum coverage, NOT independently source-validated facts.** Full standard text/actual MOS/diode leakage/DDR SKU and user device QA unresolved.

## Round 05 · MIT MOS capacitor + independent A07 education QA (2026-10-17)
- **MIT MOS lecture source (actual PDF slides 1,8,13,14 visually read)**: https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/42c863e2e1e9744ce6b797646a30e463_MIT6_012F09_lec09.pdf . Source explains **0V may already be depletion** for specific gate-metal workfunction; flatband VFB ≠ universal 0; p-type inversion over positive bias, depletion ion signs; `V_T=V_FB+2φ_F+|Qdep,max′|/Cox′` in 1D depletion model. CheckedAt 2026-10-17 academic HIGH within model scope. [Detailed independently derived parameters](deep-dives/14-mos-capacitor-physics.md).
- 1D toy `NA=1e16cm^-3, ni=1e10cm^-3, T300K, epsSi=11.7eps0, epsOx=3.9eps0, tox5nm, VFB=0`: `φ_F=0.3571586V, Cox′5nm=0.69062665µF/cm², Wdep,max=0.30392935µm, Qdep,max=4.869485e-8C/cm², Vth=0.78482536V`. tox10nm → Cox′ 0.34531332µF/cm² and Vth0.85533357V if other ideal assumptions unchanged. **Actual Vth vs existing M01 toy0.7V not interchangeable.**
- **Physics QA limits:** gate oxide steady DC conduction vs switching displacement current different; depletion leaves fixed acceptor ions; p-type surface may invert to minority electrons without dopant conversion; MOS capacitor has NO drain terminal, so ID undefined. VDS0 nMOS even with inversion has ideal net ID0. HF inversion C–V vs LF can differ, C–V figure corroboration from https://digitalcollections.ohsu.edu/record/2360/files/3093_etd.pdf; **corroborative PDF not fully read**, do not claim exact measured curves or frequency.
- **A07 independent QA** [Round02](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-02-foundations-g03-audit.md) found 11/12 pre-prediction spoiler and G03 S02/S03 assessment gaps. A06 source revised blob `b61c9a49`, `e11f51ad`, `af0b7e75`; source model toy arithmetic verified but A07 EDU_QA_PASS/retest pending. [Crosswalk](id-namespace-crosswalk.md) distinguishes topic vs lesson IDs. Role separation remains.
- **A02 D02 latest** [PR #11 head e0dfe83](https://github.com/Junebooky/interactive-engineering/pull/11): newer code includes typed WL/BL→cell/history adapter; older A07 blocker no longer exact HEAD verdict. Potential out-of-order restore/refresh evidence warrants negative-case test; [A02 follow-up](https://github.com/Junebooky/interactive-engineering/pull/11#issuecomment-6233005867).

## A06 Round06 · CMOS sequential/clock senior verification (2026-10-17)
**Verified official public texts** (webpage body, not licensed standard PDFs):
- https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c3/c3s1/ MIT CMOS pullup/pulldown dual network; tCD contamination min / tPD propagation max, PVT caution.
- https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c4/c4s1/ MIT NAND/NOR universal, multi-input NAND **not associative**; NAND nMOS series pMOS parallel; NOR opposite.
- https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c5/c5s1/ MIT latch G HIGH transparency, positive-edge D register, setup/hold dynamic discipline.
- https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c6/c6s1/ MIT metastability and 2FF synchronizer exponentially reducing risk **not zero**.
- https://www.ti.com/product/SN74HC74 TI actual DFF has positive-edge sampling with asynchronous clear/preset; TI SKU parameters not used as imaginary educational buffer/setup parameters.
**A06 toy timing units recomputed (NOT chip):** `tCQmax1.2+tlogicPDmax5+setup1.3 =7.5ns`, 8ns period setup pass margin0.5; `tCQmin0.2+tlogicCDmin0.3=0.5ns` vs hold0.8 means violation0.3. Add buffer min0.4/max0.6→hold0.9pass0.1; setup needed8.1ns so T8 fails0.1; choose T9ns→setup margin0.9+hold0.1 pass; period9ns⇒111.1MHz toy clock. Setup and hold constraints assume same launch/capture edge, zero skew/jitter. Exact timing cell/PVT/SKU not asserted. Actual violations are **risk**, not forced bit errors. Further [16 deep dive](deep-dives/16-digital-logic-clock-timing.md).
**Status:** A06 16 4-Step author-self-QA / A07 independent EDU_QA_PENDING; A05 code/browser/user QA NOT RUN. New high-priority [29 PCIe SerDes research](research-notes/29-serdes-pcie-cxl-research.md) initiated from official PCI-SIG and CXL consortium pages, full spec and SKU not reviewed.

## Round07 · 29 PCIe/SerDes/DMA/CXL (2026-10-17)
- PCI-SIG publicly confirmed PCIe7 `128GT/s`, x16 up to **512GB/s bidirectional aggregate**, PCIe6 `64GT/s`, x16 up to **256GB/s** bidirectional; unit/integer arithmetic: PCIe7 x16 one-direction spec envelope256GB/s, x4 one-direction64GB/s; PCIe6 x16 one-direction128GB/s, x4 one-direction32GB/s. All are link maxima, not SSD/GPU application throughput. [Public PCI7](https://pcisig.com/what-data-rate-pcie-70-specification), [PCI6 FAQ](https://pcisig.com/faq?field_category_value%5B%5D=pci_express_6.0&keys=PAM4).
- Public PCI-SIG webinar PCIe6 `256B FLIT /236B TLP-carrying region` yields `236/256=0.921875`, **not final user payload fraction and never generic PCIe7 layout claim**: https://pcisig.com/blog/pcie%C2%AE-60-specification-webinar-qa-deeper-dive-flit-mode-pam4-and-forward-error-correction-fec.
- Linux kernel 6.15 DMA address translation X CPU virtual/Y CPU physical/Z device-visible, driver DMA direction/streaming vs coherent and P2P root/switch caveats: https://docs.kernel.org/6.15/core-api/dma-api-howto.html and https://docs.kernel.org/driver-api/pci/p2pdma.html.
- CXL Consortium public technical post distinguishes CXL.io/.cache/.mem: https://computeexpresslink.org/blog/the-benefits-of-serial-attached-memory-with-compute-express-link-2349/; CXL4 2025-11 public announcement notes128GT/s. **2026 official CXL 4 evaluation specification has explicit AI-processing license restrictions**; A06 did **NOT** accept or process that restricted specification. Rely on public blog/release only; hardware SKU latency and memory coherency details remain conditional.
- [29 new 5-Step education draft](lessons/29-serdes-pcie-dma-cxl.md) / [source boundaries deep dive](deep-dives/29-serdes-pcie-cxl-dma.md), A06 self-QA, A07 independent review pending, not A05 scene/APP QA.
