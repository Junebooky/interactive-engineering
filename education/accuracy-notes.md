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
