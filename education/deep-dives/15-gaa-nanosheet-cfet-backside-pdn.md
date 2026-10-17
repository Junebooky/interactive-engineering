# 15 · 시니어 팩트 검증: FinFET→GAA nanosheet→CFET→후면 전력망
> 2026-10-17 A06 공개 공식 기술 문서 + 수치 검산, A07 독립 SOURCE_QA 대기. 모든 단면·전류·전력 수치는 명시적 toy, SPICE/PDK/웨이퍼/제품 실측 아님.

## 구조의 물리학 / 학생이 바꿀 조건
### 15-S01 planar, FinFET, GAA: 채널 전기장 제어
평면 MOSFET은 상부 게이트가 채널 전위를 제어한다. 짧은 채널에서 소스·드레인의 전기장 영향이 커져 DIBL, off-state 누설, Vth 변동 등 전기장 제어의 문제가 나타날 수 있다. FinFET은 채널 핀의 상부+양쪽 측면을 한 게이트로 제어한다. GAA는 채널 단면을 하나의 게이트가 둘러싼다. 도식상 1→3→4 노출면은 정성적 표시일 뿐, 3배 또는4배 전류/속도/누설 개선을 뜻하지 않는다. 실제 off-state는 work function, oxide, S/D doping, 온도, drain bias, 공정 편차에 달린다. 삼성 GAA MBCFET 초기 생산 발표 2022; Intel RibbonFET GAA 18A; TSMC N2 nanosheet 2025 Q4 HVM 공식 보고 [D1 D2 D3].
### 15-S02 nanosheet 수·너비 vs 회로 전류
한 개 얇은 직사각형 nanosheet 폭 w=20nm, 두께 t=5nm. 한 sheet 둘레 P≈2(w+t)=50nm. 병렬 sheet N2→N3의 단면 게이트 접촉 둘레 총합 N×P=100→150nm, toy 비율1.5. 동일 바이어스·재료·이동도·접촉·높이에서 채널 총 폭에 전류가 비례한다는 **교육용 대리 지표**에서만 전류1.5배 비율. 실제 기생저항, stress, quantum confinement, orientation, gate capacitance/self-heating과 접촉 접근이 전류 및 지연을 바꾼다. sheet 세 개가 전류 3배라는 단정은 오류. 전류 증가가 신호 에너지 감소 보증도 아님 [D1 D2 D3].
### 15-S03 CMOS n/p 배치와 CFET 수직 적층
보통 CMOS 인버터는 상보적 nFET pull-down/pFET pull-up이다. CFET(complementary FET)은 nFET+pFET을 수직으로 통합하는 연구 아키텍처이며 DRAM TSV나 같은 유형 n+n 적층과 다르다. imec outer-wall forksheet(VLSI2025)는 n/p 사이 전기적 분리 wall을 통한 가까운 배치를 연구한 시뮬레이션 기반 연구 공지이고 2026년 보편 양산 CFET이라는 주장 아님 [D4]. 가상의 한 device lane1.0 area units+keepout0.2를 옆으로 나란히 두면 2×1.2=2.4, 수직 perfectly stacked footprint lane1.2라면 pair footprint 면적 절반 -50%. 그러나 이는 toy pair projection만: contact, pin access, interconnect, process yields, overlay, parasitics 등 제외. 실제 standard-cell density50% 증대라는 결론 불가.
### 15-S04 배선과 backside power/IR loss
Chip frontside signal/power metal and backside supply metal compete/use different routing resources. Intel 18A PowerVia/TSMC A16 backside rails 공식 발표; GAA는 backside metal을 요구하는 정의가 아니고 둘은 독립 설계 축이다. toy local rail fixed I10A, front R2mΩ vs back R1mΩ: IR drop V=IR=20mV vs10mV; local heat I²R=0.2W vs0.1W. 회로 블록의 **이 한 경로** 열 손실/IR 저하만 비교. Chip·rack·facility 총에너지 절반 절약이라거나 고정된 backside 실효값을 제품에 약속할 수 없음. Backside routing는 thermal, debugging, contact and manufacturing complexity 트레이드오프가 있다 [D2 D3 D5].
### 15-S05 동적전력·노드 이름·기술 채택
기본 toy CMOS dynamic switching power P≈α C V² f. α0.2, C1nF, f1GHz, V1V =>0.2W; V0.8V with α,C,f fixed=>0.128W (64% of prior dynamic, reduction36%). 이는 총 전력/시간/에너지/AI inference token당 전력 절감36% 확약이 아님: leakage, frequency, Vth, wiring, heat, accuracy, performance conditions separately. Node 이름 2nm/3nm/18A는 세대명/브랜딩이지 모든 gate의 literal 2nm physical gate length가 아니다. Foundry PPA 비교에는 동일 기준/전압/셀 라이브러리/밀도/성능/전력 대상이 필수이다 [D1 D2 D3].

## 학생 오류 가지 / 수치·검증
- S01: one gate around3 or4 surfaces ≠3/4 independent gates, nor speed3/4x; source/drain geometry/doping must be considered.
- S02: P=2(w+t), w20 t5 => P50, N2=100 N3=150, ratio1.5 in toy only, not transistor-current guarantee and not N3/N2=3x.
- S03: complementary stack requires nFET+pFET; side-by-side toy2.4 vs stacked1.2=>50% footprint reduction for **toy pair** only, not true finished chip density.
- S04: I10A R2mΩ=>20mV/0.2W vs R1mΩ=>10mV/0.1W, not full server efficiency.
- S05: Pdyn αCV²f: .2W vs .128W, ratio.64 and -36% dynamic only, not total and no product clock guarantee.
- A07 independent SOURCE_QA must inspect five Step pre Voice/display prediction without derived answer, 15 cause-specific feedback and three optional hints/Step, correct-first non-forced-wrong; A05 actual browser/Voice and A02 app separate.

## 공식 공개 출처 · checkedAt=2026-10-17
[D1] Samsung SF3 GAA MBCFET official 2022 manufacturing announcement https://semiconductor.samsung.com/us/news-events/news/samsung-begins-chip-production-using-3nm-process-technology-with-gaa-architecture/ and process nodes https://semiconductor.samsung.com/kr/foundry/process-technology/logic-node/ .
[D2] Intel 18A RibbonFET/PowerVia https://www.intel.com/content/www/us/en/foundry/process/18a.html and 2025 platform explanation https://newsroom.intel.com/intel-foundry/intel-18a-process-technology-simply-explained .
[D3] TSMC N2 official 4Q25 volume production annual report https://investor.tsmc.com/static/annualReports/2025/english/index.html ; A16 N2P backside SPR proposal https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_A16 .
[D4] imec VLSI 2025 outer-wall forksheet bridge to CFET *research* https://www.imec-int.com/en/articles/outer-wall-forksheet-bridge-nanosheet-and-cfet-device-architectures-logic-technology .
[D5] Intel PowerVia routing/thermal/debug tradeoffs https://www.intel.com/content/www/us/en/newsroom/news/powervia-test-shows-industry-leading-performance.html .
[D6] First-principles idealized geometry and circuit relations N×perimeter, V=IR, P=I²R and αCV²f; HIGH toy arithmetic, **LOW** actual transistor/finished wafer PPA prediction without PDK, SPICE and measurements.
