# A06 → A05: 2.5D Scene Handoff v0.1
**인계 대상:** [A05 Issue #4](https://github.com/Junebooky/interactive-engineering/issues/4) · 2026-10-17 · 교육 스토리 및 자체 QA **4개 레슨·17개 Step 준비 완료**. A01 개별 승인 대기 없이 씬 제작 착수 가능. A02 앱/엔진 변경이 아닌 **문서 명세**.
**제작 시작 순서:** M01-S01→S02→S03→S04 먼저 시작. 다음 D02→G03→N04의 완료된 Step은 병렬로 착수 가능. 전체 지형도 완결을 기다릴 필요 없음.

## Scene / 동작 / 관찰 / 정확성
| step | sceneId | 핵심 2.5D 부품·시각 반응 | 조작과 상태 | 평가·물리적 주의 |
|---|---|---|---|---|
| M01-S01 | mosfet-field | gate oxide/nMOS channel inversion, charges | VGS 0~1.2V; VDS=0 | 채널 변화 보임; VDS=0에서 ID≈0. 0.7V threshold는 toy, 문턱 아래 미세전류 생략 |
| M01-S02 | mosfet-current | nMOS cross-section + current vs VDS plot | VGS=1.5V; VDS=0~2V | 전류=0→증가→포화 경향. pinch-off ≠ 전류 소멸; 전자/관습전류 방향 구분 |
| M01-S03 | nmos-resistor-inverter | VDD/10k pull-up and nMOS pulldown | Vin 0/5V | Vout 5V/약0.45V, 논리 1/0. ON ≠ output1, 접지 완전 단락 금지 |
| M01-S04 | cmos-not-gate | top pMOS+bottom nMOS, output and truth table | Vin 0/5V, out0/out1 | 0→1, 1→0. CMOS는 저항형 nMOS와 별도 장면, 정지 전력 0 보장 금지 |
| D02-S01 | dram-write | 1T1C cutaway and WL/BL | WL 0/1, BL 0/1 | 커패시터 충/방전 및 닫힌 셀 유지. 전원 차단 시 유지되지 않음 |
| D02-S02 | dram-sense-restore | capacitor/bitline charge-sharing/sense amplifier | cellBit 0/1, sense, restore | VDD/2에서 ±ΔV를 감지·증폭·복원. 전하공유/읽기 후 복원 필수 |
| D02-S03 | dram-leak-refresh | charge animation + refresh button | time 0~2 toy, leakage, refresh | 시간이 흐르면 전하 감소→refresh 복원. time unit은 ms 아님 |
| D02-S04 | dram-row-bank | row/column/bank tiles and request timeline | bank 1/2, request A/B | 같은 뱅크 충돌, 서로 다르면 일부 병렬. 뱅크 두배=실제 속도 두배 금지 |
| G03-S01 | compute-feeding | compute units + data lane + throughput meter | compute 16/32, feed 8/16/32 toy | min(compute,feed) 병목. toy는 실제 GPU 연산 지표 아님 |
| G03-S02 | memory-family-roles | server DDR RDIMM, board GDDR6/GDDR7, packaged HBM | placement & requirements | 용도/대역폭/용량/비용/열에 따라 상이. 모두 DRAM, GPU=HBM 필수 아님 |
| G03-S03 | gddr-width-rate | bus width, per-pin transmission signal 2-level vs 3-level | 128bit×24/32Gb/s/pin toy | 384/512GB/s theoretical. PAM3≠3bits per cycle; 단위 GB/s |
| G03-S04 | hbm-tradeoffs | stacked DRAM/TSVs/interposer thermal path | GDDR board vs HBM package | 넓은 I/O 및 비용/열 tradeoff. 교육용 2.5D와 반도체 패키지 2.5D 구별 |
| N04-S01 | nand-threshold | threshold distribution and power persistence | thresholdState low/high, readV, power | 전원 꺼도 charge state 정보 보존. 전기 없이 읽을 수 있다는 뜻 아님 |
| N04-S02 | nand-page-block | 2 blocks ×4 pages toy mapping | LBA write, block erase, GC | 새 page에 쓰고 기존 것은 무효화. GC가 파일 삭제하는 것 아님 |
| N04-S03 | ssd-ftl-reliability | SSD controller mapping+wear/ECC/PLP optional card | hot/cold, ECC, PLP opt | LBA 일정·물리위치 이동, durability tradeoff. 모든 SSD DRAM/PLP 내장 주장 금지 |
| N04-S04 | nvme-transfer | NVMe command→PCIe→SSD/NAND→host/GPU | read command/path selection | 매체·장치·명령·전송 구별. DMA/직접 경로 대안 존재 |
| N04-S05 | ai-datacenter-pipeline | storage/DDR/GPU-HBM or GDDR/NIC/network/PSU/cooling | load/infer/train/save | 서로 다른 단계별 bottleneck. 매 토큰 SSD 로딩하는 경로 금지 |

## 공통 scene contract
- 레슨마다 [01](lessons/01-mosfet-to-logic.md), [02](lessons/02-dram-bit-cell.md), [03](lessons/03-gpu-memory-bottleneck.md), [04](lessons/04-nand-essd-data-center.md)의 **learningGoal/priorKnowledge/storyHook/question/prediction/learnerAction/modelInputs/expectedObservation/correctIncorrectCriteria/misconceptions/hints/explanation/nextHook/displayText/speechText/physicsAssumptions/sourceRefs**를 기준으로 작업.
- **순서:** 먼저 예측 고르기(정답 비노출)→조작→결과 관찰→조건별 검증→오답 원인 피드백→왜?→nextHook. 슬라이더만 만졌다는 이유로 정답 판정 금지.
- UI displayText와 speechText 분리. Voice 한국어는 짧은 자연 문장; 오답 3유형/3단계 힌트. 보상·점수·XP·스트릭·랭킹 금지.
- React/SVG 기반 자체 제작, layered cutaway / 상태 강조 / depth. 타사 레슨·그림 복제 금지. 44px 터치/키보드/aria-label/색상 외 표시/reduced-motion 지원. 설명할 수 없는 입자 속도·전류/온도 실측 애니메이션 금지.
- A02 PR #5 현재 head 766339b: Mosfet2DScene, InverterCircuit2D, mosfetModel, inverterModel은 **참고**하되 A05가 별도 feature 브랜치/stacked PR에서 구현. A02 기존 브랜치/엔진 덮어쓰기 금지.
- **필수 모델 주의:** PR #5 저항형 inverter에서 Vin=5V 시 Vout≈0.45V(논리0), perfect 0V가 아님; CMOS와 저항형 인버터는 다름. MOSFET Vth 0.7V toy 가정 및 subthreshold 존재. DRAM sense 읽기 후 복원. 128×24/8=384GB/s, 128×32/8=512GB/s는 **가상** GDDR 대역폭 계산. eSSD PLP/DRAM 필수 아님.
- 물리 데이터와 UI 렌더링의 2.5D, 그리고 **첨단 반도체 패키징 기술로서의 2.5D**는 서로 다른 개념.
- A05 개발 중 부정확·모호한 Step은 Issue #4 또는 #6에 sceneId와 함께 댓글로 질문→A06 스토리 수정 및 교차 인계. **A01의 사전 레슨별 승인 불필요**, main 병합·배포는 오너 승인 전 금지.

## 1차 acceptance checklist
1. M01-S01/02에서 VGS·VDS 조작/상태·전자 방향과 전류 방향을 구별하며 정답 사전노출 없음.
2. M01-S03에서 Vin 5V → Vout 논리0을 학생이 직접 발견. Vout 0.45V≈LOW라는 논리 구분 제공.
3. M01-S04에서 저항 부하 모형을 CMOS라고 이름 바꾸지 않고 pMOS 신규 소자 추가.
4. 각 scene 3개 오개념 피드백, 모바일/키보드/Voice, 물리 가정/단위/Why/nextHook 갖춤.
5. A05가 장면별 PR/스크린샷·조작 시연·테스트 링크를 Issue #4에 올리면 A06가 학습/과학 QA 회신.
