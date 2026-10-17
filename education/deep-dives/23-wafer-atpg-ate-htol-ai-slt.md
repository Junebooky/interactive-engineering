# 23 · 시니어 근거 노트: DFT/스캔→웨이퍼 소트→패키지 최종 ATE→HTOL→AI SLT
> A06 2026-10-18 공공 원문 공식 제조사/ATE/반도체 장비기관 자료 조사 및 교차 검증. 23번 다섯 장면은 **허구의 학습 수치**이며 실제 양산 웨이퍼, 개별 가속기, 소자 데이터시트, 테스트 프로그램, JEDEC 원문 전체, 실측 HTOL/ATE/AI workload가 아니다. 독립 A07 물리·교육 원고 QA 아직 없음. [Pipeline #64](https://github.com/Junebooky/interactive-engineering/issues/64).

## 23-S01 · 웨이퍼 검사, 패키지 최종 테스트와 수율은 각각 다른 모집단
TI 실제 Assembly & Test 공정 설명 [R1]에 따르면 wafer probe는 다이 개별 전기 검사 후 불량 다이의 후공정 투입을 줄이고, 전자패키지 제조 뒤 final test가 전기 성능 및 신뢰성 사양을 검증한다. Advantest DRAM/NAND ATE 자료 [R2] 역시 wafer sort와 final package test를 구분한다. Wafer pass를 전자 패키징 수율과 혼동하지 않고 제품·불량 판정 기준이 단계별로 다르다는 점에 주목.
학습 시나리오: 웨이퍼 원래 후보 다이100개, waferPassed=60|80. 해당 wafer PASS 집합에 대해서만 **후속 finalTestConditionalRate=.90|.95라는 허구의 고정 비율**을 적용. finalPassed=waferPassed×conditionalRate =>60*.90=54,60*.95=57,80*.90=72,80*.95=76. 초기 후보 대비 출하가능 비율54/57/72/76%, 조건부 final 양품률은90/95%. 웨이퍼 분모와 final 분모 혼동 금지. 패키징 결함, 오버레이, 비닝, 불량 수율/원가 측정치 아니다. 이 예제에서는 정수 인원/수율이 편하도록 선택한 모집단이며 현실에는 샘플·분석/재검사 등이 존재.

## 23-S02 · 스캔 체인 ATPG의 내부 상태 접근과 결함 모델 구별
Siemens 2026 original [R3]는 scan flip-flop의 내부 controllability/observability와 ATPG의 stuck-at 및 at-speed transition fault 모델을 설명한다. 압축/ATPG 툴 자료 [R4]은 test volume reduction이 실제 fault coverage를 자동 인증하지 않음을 시사한다. 스캔 설계 DFT와 프로브 ATE의 장비 시험은 별도 생산 흐름; scan-enabled는 내부 관측이 가능해지지만 기능적 완전성, 실제 silicon escape/DPPM을 입증하지 않는다.
학습용 임의 결함 fixture: static stuckAt 후보100개, dynamic transition 후보100개 **서로 다른 가상 fault 목록**. scanEnabled=false라면 전용 테스트 패턴에서 static60 detect/dynamic20 detect; scanEnabled=true면 static90/dynamic70 detect라는 숫자는 실제 Siemens나 설계 데이터가 아닌 의도적으로 만든 수업 fixture. `patternSelection=STUCK_ONLY`일 때 static coverage false60%/true90%; transition은 **NOT_TESTED**, 절대 0%로 바꾸어 관측했다고 하지 않음. `patternSelection=BOTH`일 때 false (60+20)/200=40%, true(90+70)/200=80%; static/dynamic 개별 비율 병기. Test set 교체와 scan 추가의 독립 효과를 보여 주되, 80%를 실제 양품률/모든 결함 모델 검사/보장으로 부르면 FAIL. 실제 툴 fault model/ATPG 패턴은 세부 모델 라이선스·설계 회로에 따라 달라진다.

## 23-S03 · ATE 멀티사이트 생산성은 시험 시간 외 대기시간·병렬 능력에도 좌우됨
Advantest 핸들러 자료 [R5]와 Teradyne tester product [R6]은 테스트 장비가 DUT를 여러 개 자동 투입하고 wafer sort/final test를 지원할 수 있음을 설명한다. 멀티사이트 검사에서 site 수가 fourfold라 하더라도 tester pin resource/접촉/장비 대기/병렬 실행 가능 여부가 독립되어 전체 양산 4x가 보장되지 않는다.
Toy single simultaneous batch cycle: `siteCount=1|4`, per-batch test vector runtime `testTimeMs=100|200`, fixed test overhead `handlerTimeMs=20`, all sites exactly same per-batch duration assumed. `batchSec=(testTimeMs+20)/1000`. `throughputDUTperSec=siteCount/batchSec`: 100ms→ site1 8.3333/s, site4 33.3333/s; 200ms→ site1 4.54545/s, site4 18.1818/s. Hypothetical tester hourly bill=$360/hr = $0.10/s, test cost/device (100ms)=site1 $0.012 vs site4 $0.003, (200ms)=site1 $0.022 vs site4 $0.0055; no capital equipment/labor/yield/retention/queue/rates. Cost computation made explicit as purely per-test machine occupancy toy. Real elapsed, binning and site failures unknown.

## 23-S04 · HTOL/Burn-in과 모집단 신뢰구간을 분리하자
Analog Devices 2025 official science article [R7] 설명: HTOL은 온도·전압 조건으로 lifetime mechanisms을 가속해 통계 모델/Arrhenius, 활성화에너지·온도와 신뢰수준에 따른 실패율 추정에 사용. JEDEC JESD22-A108은 ADI가 공개한 개별 품질 보고서/공식 문서에 표기되어 있으나 A06는 표준 전문을 읽지 않았으며 **각종 스트레스 온도/전압 recipe를 제공하지 않는다**. Production burn-in(screening some early failures)과 qualification HTOL(표본/메커니즘 추정)은 목적·모집단이 다르며 모든 제품에 동일 100% screening을 실시한다고 단정하면 안 된다.
오직 자연 기간 한정 독립 베르누이 모집단에 대해, 샘플 n개 중 FAIL 0개를 봤을 때, 이 원시 toy 모집단 사건 확률 p의 **exact one-sided confidence upper bound 95%** (α=.05)는 `p_upper = 1 − 0.05^(1/n)` [독립/동일 p/완전 관측 전제]. n=100 ⇒ 0.0295130496 ≈2.9513%, n=300 ⇒ 0.00993608194446 ≈0.9936%. **이 값이 소자 10년 고장확률·FIT·DPPM/차량급 자격/양품률을 의미하는 건 아니다**. 별도 `observedFails=0|1` 조작에 1개인 경우 관측 rate=1/n이고 `zeroFailUpperBound=NOT_APPLICABLE`, 정확한 k≥1 신뢰구간 계산이 별도 필요. 즉 실패1에서 아무 근거 없이 3/n upper를 재사용하거나 실기기 MTTF 예측으로 전환 금지. 시그니처 실무 신뢰성 시험 데이터/Arrhenius 상수·failure mode 모두 없음.

## 23-S05 · ATE Known Good Die는 AI SLT와 데이터센터 환경을 대체하지 못해
Teradyne **2026-08-24** AI 시스템 수준 테스트(SLT) 공식 해설 [R8]은 wafer sort, final ATE/KGD 과정과 AI accelerator system-level sustained workloads/패키지 상호연결, 전원·열·system interaction 검증 필요성을 구분한다. 이는 제조사의 테스트 솔루션 시각이며 ‘모든 AI 장치는 SLT 없이는 불량’ 같은 보편 규칙은 아님.
토이: 이미 ATE 구조 검사 합격으로 판정한 서로 다른 후보100개를 테스트 대상으로 취급, `testLevel=ATE_ONLY|ATE_PLUS_SLT`와 `sltWorkload=SHORT|EXTENDED` 두 독립 입력. ATE_ONLY → `SLT_NOT_RUN` (systems pass100/100라고 주장 금지), SLT selected SHORT => 1개만 추가 **toy scenario FAIL** =>SLT pass99/100, EXTENDED => 3개 검출 =>97/100 (같은 fixture에서 short FAIL⊆extended FAIL 가정). `newlyRejected=1|3`, `remainingAccepted=99|97`는 실제 서버 SLA, p99, RAS 문제 정량 또는 반도체 실제 판매 수율 예측 불가. ATE structural fault passing과 SLT system function/stress 검증도 단순 참/거짓 불량 위험으로 동치 아님. Native error injection stress pattern or unsafe prolonged hardware stress instructions 없음.

## A07 검증 요청 / 시스템 오류 감지
- [ ] 5단계 각각 도입(1분 학생 hook), 예측+독립조작 2축 후 WHY, 숨겨진 교사용 사후와 실제 수식, 3개 원인별 오개념 m1–m3, 각 단계 3단 힌트/L1–L3, 별도 한국어 speechText before/after. First correct도 PASS, 원하지 않은 오류 선택 강요 금지, 학습내용/실장비 인증 구분.
- [ ] S01 wafer pass 60|80 vs conditional final90|95; 54/57/72/76/100 counts, different denominators; no package/fab measured yield.
- [ ] S02 toy scan vs pattern type independent and transition UNTESTED when STUCK_ONLY, 60/90% vs 40/80% combined; wrong model coverage/yield claims.
- [ ] S03 overhead20ms and vector100|200ms, 1|4 sites, throughput 8.333/33.333 and4.545/18.182 DUT/s; fake 360$/hour yields .012/.003 and .022/.0055 $/DUT; no claims ATE hardware observed.
- [ ] S04 0/n exact one-sided 95% upper `1-.05^(1/n)` at100≈2.95%,300≈0.995%; 1/n observed case does NOT use zero-failure bound, independent real device lifetime unknown.
- [ ] S05 ATE_ONLY→SLT_NOT_RUN, +SLT short1/100 fail vs extended3/100 fail toy, long-run not automatically zero escapes nor p99 guarantee.
- [ ] Need to avoid dangerous physical over-temperature testing procedural directions, products/quality promises, observed tests all fake, real fault model datasets unknown, exact JEDEC licensed text not consulted.

## Source register, checked 2026-10-18
[R1] TI official Assembly & test flow (wafer probe/final) https://www.ti.com/about-ti/worldwide-manufacturing/assembly-test.html
[R2] Advantest DRAM/NAND ATE supports wafer sort and final https://www.advantest.com/en/products/semiconductor-test-system/memory/t5833/
[R3] Siemens Tessent ATPG and scan overview (published Apr20 2026) https://blogs.sw.siemens.com/xcelerator-academy/2026/04/20/unlocking-efficiency-a-deep-dive-into-tessent-atpg-for-digital-ic-testing/
[R4] Siemens modeled fault coverage not product quality and compression https://blogs.sw.siemens.com/tessent/2023/10/31/ensure-ic-quality-with-tessent/
[R5] Advantest handler temperature control/final handler https://www.advantest.com/en/products/component-test-system/test-handler/
[R6] Teradyne ATE wafer sort/final and site capabilities https://www.teradyne.com/products/magnum-2/
[R7] Analog Devices official accelerated HTOL statistical confidence/Arrhenius analysis https://www.analog.com/en/resources/technical-articles/know-your-safety-part-1.html
[R8] Teradyne Aug24 2026 AI system-level test vs KGD and ATE https://www.teradyne.com/2026/08/24/slt-in-the-ai-era-validating-reliability-at-scale/
[R9] Siemens ATPG physical defect models/critical-area weight vs raw detected fault counts https://blogs.sw.siemens.com/tessent/2020/08/13/using-critical-area-to-optimize-test-patterns/
**Evidence level:** official vendors high for how their devices/tech are described, not independent peer-proof of production improvements. Toy arithmetic independently reproducible under written assumptions; A07 source QA and real industry test executions are separate OPEN items.
