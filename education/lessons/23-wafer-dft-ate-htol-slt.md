# 23 · 좋은 칩은 어떻게 골라낼까? 웨이퍼·스캔·ATE·HTOL·AI 서버 테스트 다섯 장면
> **A06 five original student-first 2.5D source manuscript AUTHOR_DONE / NEXT:A07 FIRST INDEPENDENT EDU+SCIENCE SOURCE QA**, checkedAt 2026-10-18. [Siemens/TI/Advantest/ADI/Teradyne senior source note](../deep-dives/23-wafer-atpg-ate-htol-ai-slt.md), [production card #64](https://github.com/Junebooky/interactive-engineering/issues/64). Prior 24 authored lessons/108 Step + 23 five original => **25 authored lessons/113 Steps**, NOT 25 A07-approved or running A05 code.
> Prereqs 01 gate logic,06 fab/package,13 probability,16 scan flipflops,20 DFT/ATPG/foundry signoff,10/32 GPU AI service. From designed cell to physically checked die to load-conditioned systems. **All measured-style percentages, dollar costs, reliability limits and failures are synthetic mathematical learning cases**, not factual yields/test results/HTOL qualification or actual production SLT/AI workload. No instructions for live stress, heated chips or testers.

## Scene readiness/one-step student-state contract
- Only ONE current scene question shown at once. PRE gate displays solely hook/learningGoal neutral, student prediction prompt and `displayTextBeforePrediction`/`speechTextBeforePrediction`. Do **not** render computed correct numbers, `expectedObservation`, `teacherExpectedAnswer`, exact m1–m3 feedback or afterVoice in student DOM/ARIA/TTS until student explicitly predicts, changes at least TWO actual distinct model axes and explains WHY. Correct-first accepted; student need not intentionally answer wrong; optional hints L1–L3 hidden until requested.
- Typed `learnerAction` is exhaustive state contract; if original input unavailable/false, grader must NOT infer hardware field status. Each observation bounded to given simulated stage. Every incorrect path triggers only matching misconceptionFeedback/m1/2/3, not generic wrong and not early answer. A07 exact independent source QA before A06 direct A05 original scene contract; A05 browser and A02 official app separate.

## 23-S01 · `wafer-sort-final-test-yield` · 웨이퍼에서 합격한 칩이 포장 후에도 전부 합격할까요?
### ① 먼저 예측하고 독립 조작
- **sceneId:** `wafer-sort-final-test-yield`
- **learningGoal:** 웨이퍼 초기 후보100개와 프로브 PASS 수/포장 후 조건부 합격률을 서로 독립 조작해 제조 두 단계의 분모와 최종 양품 후보 수를 구분한다.
- **priorKnowledge:** 06 fab/package,13 percent and conditional probability
- **storyHook:** 웨이퍼에서 통과 도장을 찍어도, 패키지로 옮긴 뒤 또 검사하는 이유가 있을까요?
- **question:** 웨이퍼에서 통과 도장을 찍어도, 패키지로 옮긴 뒤 또 검사하는 이유가 있을까요?
- **predictionPrompt (learner-only):** 원래100개 중 웨이퍼 검사에서80개가 합격하고 그80개 중90%가 최종 검사를 통과하면 실제 몇 개가 남을까요?
- **displayTextBeforePrediction:** 처음의 100개와 패키지 단계에 들어간 수는 같은 분모일까요?
- **speechTextBeforePrediction:** 웨이퍼에서 살아남는 칩 수와 포장 후 합격률을 각각 바꿔보세요. 최종 숫자를 먼저 예측해 봐요.
- **learnerAction:** Only student-selectable independent `waferPassCount=60|80` and `conditionalFinalPassRate=.90|.95` with `waferCandidates=100` fixed. Draw stage arrows as source100→wafer screened→only surviving wafer dies sent into fictitious final test→final candidate yield. No magical revival of wafer-failed dies. Compare 60/80 and .90/.95 pairs and compute actual final denominator.
- **modelInputs:** typed `waferPassCount:60|80`,`conditionalFinalPassRate:0.90|0.95`; constant initialWaferCandidates100. `finalPassCount=waferPassCount*conditionalFinalPassRate`: (60,.9)=54,(60,.95)=57,(80,.9)=72,(80,.95)=76; `overallFraction=finalPassCount/100`, `waferYield=waferPassCount/100`, `conditionalFinalYield=conditionalFinalPassRate`. `waferRejects=100-waferPassCount`, `finalStageRejects=waferPassCount-finalPassCount`, `remaining=finalPassCount`. `measuredFactoryYield=NOT_PROVEN`; toy assumes exact fractional rates yield whole count, no rescreen/partial salvage.
### ② 조작 후에만 교사용 모델 답안·오개념 교정
- **expectedObservation (teacher-only):** 웨이퍼 초기100개 중80개 통과, 그중90%만 최종 통과하면72개 남아요. 마지막90%는100 전체가 아닌80에 적용돼요. 웨이퍼60개 통과/포장95%면57개만 남아요. TI 실제 제조는 웨이퍼 프로브와 패키지 최종 테스트를 단계별로 구분하지만 모든 품목에 같은 검사법/수율이 적용되는 건 아니에요.
- **teacherExpectedAnswer (gated):** 웨이퍼 초기100개 중80개 통과, 그중90%만 최종 통과하면72개 남아요. 마지막90%는100 전체가 아닌80에 적용돼요. 웨이퍼60개 통과/포장95%면57개만 남아요. TI 실제 제조는 웨이퍼 프로브와 패키지 최종 테스트를 단계별로 구분하지만 모든 품목에 같은 검사법/수율이 적용되는 건 아니에요.
- **correctIncorrectCriteria:** Student changes wafer count and final conditional rate separately, reports at least cases80*.9=72 and60*.95=57 including denominator, explains wafer-pass≠finished-product unconditional pass, accepts right-first after independent evidence and WHY.
- **misconceptions:** [m1] 웨이퍼 합격률80%와 최종 합격률90%를 더하면 최종 합격률170%예요. / [m2] 웨이퍼에서 불합격한20개도 포장 검사에 자동 투입되어 최종90개가 출하돼요. / [m3] 웨이퍼 프로브에 합격했다면 패키징·최종 전기 검사·실사용 결함까지 전부 검증된 거예요.
- **hints L1/L2/L3 (on request):** [L1] 최종 검사에서 분모는 처음100개가 아니라 먼저 통과한 다이예요. / [L2] 80에0.9를 곱해보세요. / [L3] 합격 단계가 달라지면 검증 내용과 대상도 바뀌어요.
- **misconceptionFeedback/m1 (gated):** 이 문제는 독립 퍼센트의 합이 아니라 두 조건부 단계가 이어져 최종 숫자를 곱해요.
- **misconceptionFeedback/m2 (gated):** 다음 공정으로 간 후보는 웨이퍼 PASS80개뿐이에요. 그중90%면72개예요.
- **misconceptionFeedback/m3 (gated):** 웨이퍼 단계의 확인과 패키지 연결/최종 성능/장기 신뢰성은 별도예요.
- **feedback/correct:** 두 개 이상의 실제 모델 상태를 바꾸고 선택한 시험의 모집단·단위·WHY를 확인했습니다. 이 수치는 수업용이지 제품 인증이 아니에요.
- **displayTextAfterObservation (gated):** 최종 후보 수는 앞 단계 합격 수 × 뒷 단계 조건부 합격률이에요.
- **speechTextAfterObservation (gated):** 100개를 만들고 웨이퍼에서80개가 합격했다면 그80개만 다음 검사 대상으로 계산해요. 최종 검사에서 90퍼센트가 통과하면 72개죠.
### ③ 시니어 반례, 근거와 상태 승인
- **physicsAssumptions:** 실제품 데이터가 아닌 명시적 독립 가상 시험/데이터셋, 해당 수식 조건에 한해 적용. 실제 ATE·HTOL·SLT 장비를 사용하지 않았으며 생산 품질이나 현장 신뢰성의 실측이 아니다.
- **seniorDesignReview:** Die defects at probe vs package assembly and parametric final test, production binning/traceability and multi-site testers. Not actual manufacturer yield or KGD guarantee; full SLT follows after wafer/ATE where selected.
- **sourceRefs:** [R1][R2]
- **negativePathTest:** Exactly THREE independent cause-graded m1/m2/m3 prompts after student attempts; correct-first mastery allowed after 2 independent ACTUAL typed controls/WHY, no after-answer leak in PRE Voice/ARIA/DOM. Compare self-consistent parameter combinations; when a test type is NOT_RUN or NOT_TESTED never render zero-percent observed or implicit device PASS. If an input is changed after grading, start a new trial rather than rewriting past evidence. A05 real browser/mobile/Voice/CI only after independent A07 source PASS.
- **nextHook:** 다음 장면에서 다른 시험 단계가 무엇을 보장하는지 찾아봐요.

## 23-S02 · `scan-atpg-fault-model-cases` · 스캔 테스트 90%면 숨어 있는 결함도 90% 확실히 찾을까요?
### ① 먼저 예측하고 독립 조작
- **sceneId:** `scan-atpg-fault-model-cases`
- **learningGoal:** 스캔 DFT 내부 관측성과 정적 stuck-at/동적 transition 결함 모델을 독립적인 두 조작으로 비교하고 테스트하지 않은 모델을 0% 검사 결과로 표시하지 않는다.
- **priorKnowledge:** 01 digital logic,16 flipflop,20 modeled ATPG vs physical proof,13 ratio
- **storyHook:** 칩 안쪽 레지스터는 겉에서 보기 어려워요. 스캔 체인으로 연결하면 무엇이 달라질까요?
- **question:** 칩 안쪽 레지스터는 겉에서 보기 어려워요. 스캔 체인으로 연결하면 무엇이 달라질까요?
- **predictionPrompt (learner-only):** 같은 테스트 세트에서 스캔 체인이 있으면 내부값을 더 쉽게 제어·관찰할까요? 붙박이 고장 테스트만 했으면 타이밍 고장도 검사한 걸까요?
- **displayTextBeforePrediction:** 어떤 결함을 대상으로 선택했는지부터 확인해요.
- **speechTextBeforePrediction:** 스캔 가능 여부와 테스트할 결함 모델 종류를 따로 선택해 보세요. 검사하지 않은 결함 목록을 가렸는지도 먼저 예측해요.
- **learnerAction:** Independently toggle `scanEnabled=false|true` and `patternSelection='STUCK_ONLY'|'BOTH_STUCK_AND_TRANSITION'`. On non-scan fixture, arbitrary detect60 static and20 dynamic; on scan fixture,90 static and70 dynamic. Static candidate100, dynamic candidate100 physically different toy lists. When STUCK_ONLY is selected, `transitionStatus=NOT_TESTED`, never display numerical 0% assessed transition detection. When BOTH, overall detection on 200 separately enumerated fault models. No production ATPG hardware tested.
- **modelInputs:** typed `scanEnabled:boolean`,`patternSelection:'STUCK_ONLY'|'BOTH_STUCK_AND_TRANSITION'`. fixed `stuckCandidates=100`,`transitionCandidates=100`; toy fixture `stuckDetected=scanEnabled?90:60`, `transitionDetectedIfSelected=scanEnabled?70:20`. If STUCK_ONLY: `testedCandidateCount=100`,`totalDetected=stuckDetected`, `coverage=scanEnabled?.90:.60`, `transitionState='NOT_TESTED'` (not0%). If BOTH: `testedCandidateCount=200`, `totalDetected=stuckDetected+transitionDetectedIfSelected` ⇒ scanOff80/200=.40, scanOn160/200=.80; also per-model static/dynamic detection report60/20 vs90/70. `realFaultCoverage=NOT_PROVEN`, `actualSiliconYield=NOT_PROVEN`, real ATPG pattern counts/ATPG tool run not given.
### ② 조작 후에만 교사용 모델 답안·오개념 교정
- **expectedObservation (teacher-only):** 스캔은 내부 플립플롭 상태를 제어·관찰할 길을 제공하지만 실제 결함 모델과 테스트 패턴에 따라 검출 정도가 달라져요. 이 임의 수업 fixture에서 스캔 ON + 두 모델 모두 검사=>160/200=80%; 스캔 ON + 정적만 검사=>90/100=90%이고 transition은 'NOT_TESTED'예요. 80/90%는 양품 다이 비율이 아니에요.
- **teacherExpectedAnswer (gated):** 스캔은 내부 플립플롭 상태를 제어·관찰할 길을 제공하지만 실제 결함 모델과 테스트 패턴에 따라 검출 정도가 달라져요. 이 임의 수업 fixture에서 스캔 ON + 두 모델 모두 검사=>160/200=80%; 스캔 ON + 정적만 검사=>90/100=90%이고 transition은 'NOT_TESTED'예요. 80/90%는 양품 다이 비율이 아니에요.
- **correctIncorrectCriteria:** Actually vary scanEnabled AND patternSelection, demonstrate 90/100 stuck-only with transition NOT_TESTED and160/200 BOTH scanOn; explain two fault populations and modeled coverage vs shipped chip quality; right-first allowed.
- **misconceptions:** [m1] Stuck-at 검사에서90개 찾았다면 transition 고장도 자동으로90개 검출한 거예요. / [m2] 스캔 체인을 추가했으니 설계·실리콘 종류와 상관없이 실제 불량 다이의 검출률은 반드시90%예요. / [m3] 정적 검사만 선택해 둔 경우 동적 검사 결과는 숫자0%로 확정되었다고 표시해야 해요.
- **hints L1/L2/L3 (on request):** [L1] 전압 stuck 상태와 속도 transition 상태는 다른 결함 모델이에요. / [L2] ATPG fault cover와 실제 생산 결함 목록은 같지 않을 수 있어요. / [L3] 검사를 안 한 건 실패0%가 아니라 관측하지 않았음이에요.
- **misconceptionFeedback/m1 (gated):** ATPG 테스트 유형은 선택한 결함 모델 목록마다 따로 검증해야 해요. static pass로 dynamic이 통과했다고 결론 내릴 수 없어요.
- **misconceptionFeedback/m2 (gated):** 수업용 90/100은 고른 후보 fault 모델의 발견 비율이에요. 공정 실제 불량률·DPPM은 생산 데이터로 봐야 해요.
- **misconceptionFeedback/m3 (gated):** 선택되지 않은 동적 테스트는 NOT_TESTED입니다. 측정값 0이라고 기록하면 나중에 잘못된 판단을 만들어요.
- **feedback/correct:** 두 개 이상의 실제 모델 상태를 바꾸고 선택한 시험의 모집단·단위·WHY를 확인했습니다. 이 수치는 수업용이지 제품 인증이 아니에요.
- **displayTextAfterObservation (gated):** 검사 범위와 결함 모델을 바꾸면 분모 자체가 달라질 수 있어요.
- **speechTextAfterObservation (gated):** 스캔을 사용하고 정적 고장만 테스트했다면 가상 정적 고장100개 중90개를 찾았다는 뜻이에요. 동적 고장은 테스트하지 않았고 수율도 측정하지 않았어요.
### ③ 시니어 반례, 근거와 상태 승인
- **physicsAssumptions:** 실제품 데이터가 아닌 명시적 독립 가상 시험/데이터셋, 해당 수식 조건에 한해 적용. 실제 ATE·HTOL·SLT 장비를 사용하지 않았으며 생산 품질이나 현장 신뢰성의 실측이 아니다.
- **seniorDesignReview:** Siemens distinguishes controllability/observability, scan compression, stuck-at vs transition at-speed and cell-aware fault models. Fake test fixture detection rates have zero product predictive authority; no real fault simulation or ATPG report.
- **sourceRefs:** [R3][R4][R9]
- **negativePathTest:** Exactly THREE independent cause-graded m1/m2/m3 prompts after student attempts; correct-first mastery allowed after 2 independent ACTUAL typed controls/WHY, no after-answer leak in PRE Voice/ARIA/DOM. Compare self-consistent parameter combinations; when a test type is NOT_RUN or NOT_TESTED never render zero-percent observed or implicit device PASS. If an input is changed after grading, start a new trial rather than rewriting past evidence. A05 real browser/mobile/Voice/CI only after independent A07 source PASS.
- **nextHook:** 다음 장면에서 다른 시험 단계가 무엇을 보장하는지 찾아봐요.

## 23-S03 · `ate-multisite-cost-throughput` · ATE에 칩을 네 개 동시에 넣으면 공장도 네 배 빨라질까요?
### ① 먼저 예측하고 독립 조작
- **sceneId:** `ate-multisite-cost-throughput`
- **learningGoal:** ATE 병렬 사이트 수와 벡터 검사 시간을 서로 독립 조작해 배치 처리량·시험기 점유 비용을 계산하고 현실의 접촉·장비 자원 제약을 분리한다.
- **priorKnowledge:** 13 ms/s/$ and ratios,06 semiconductor test sorting
- **storyHook:** 자동 검사 장비 ATE에서 한 번에 한 개 대신 네 개를 측정하면 생산비는 얼마나 바뀔까요?
- **question:** 자동 검사 장비 ATE에서 한 번에 한 개 대신 네 개를 측정하면 생산비는 얼마나 바뀔까요?
- **predictionPrompt (learner-only):** 가상 검사 실행100ms와 교체 대기20ms가 든다고 하면 한 배치에4개를 병렬 검사할 때 초당 몇 개나 처리할까요?
- **displayTextBeforePrediction:** 한 번 검사하는 데 걸리는 시간과 동시에 검사하는 수는 다른 조작이에요.
- **speechTextBeforePrediction:** 테스트 프로그램 길이와 병렬 소자 수를 각각 바꿔 보세요. 한 배치의 대기시간을 포함해 초당 개수를 먼저 예측해 봐요.
- **learnerAction:** Independent `testTimeMs=100|200`,`siteCount=1|4`. Fixed handler overhead20ms per simultaneous batch and fake tester occupancy rate 360USD/hour. Compare batchSec and throughput and cost per tested device using same toy fixture. Never claim all ATE instruments can actually use 4 sites or 4× production throughput under I/O/load board limits.
- **modelInputs:** typed `testTimeMs:100|200`,`siteCount:1|4`, constants `batchOverheadMs=20`,`testerHourlyCostUSD=360`. `batchSeconds=(testTimeMs+20)/1000`, `throughputDUTPerSec=siteCount/batchSeconds`, `testerCostPerDUT=(360/3600)*batchSeconds/siteCount`. Cases 100ms/site1: batch .12s, rate8.3333/s, cost$.012; 100ms/site4: rate33.3333/s cost$.003; 200ms/site1: batch.22s, rate4.54545/s cost$.022; 200ms/site4: rate18.1818/s cost$.0055. Assumes full successful identical parallel site utilization; no contact/queue/failure/capex/energy/yield. `measuredFactoryThroughput=NOT_PROVEN`.
### ② 조작 후에만 교사용 모델 답안·오개념 교정
- **expectedObservation (teacher-only):** 테스트100ms에 손이 움직이고 접촉하는 가상 오버헤드20ms를 더해 배치0.12초. 병렬4개면 4/0.12≈33.33개/초, 한 사이트는1/.12≈8.33개/초. 장비 시간 단가를 가상360달러/시간으로 두면 테스트 하나당 .003 vs .012달러의 단순 점유비용만 계산돼요. 실제 공장은 핸들러/핀/장비 제약과 불량 재검사 때문에 다를 수 있어요.
- **teacherExpectedAnswer (gated):** 테스트100ms에 손이 움직이고 접촉하는 가상 오버헤드20ms를 더해 배치0.12초. 병렬4개면 4/0.12≈33.33개/초, 한 사이트는1/.12≈8.33개/초. 장비 시간 단가를 가상360달러/시간으로 두면 테스트 하나당 .003 vs .012달러의 단순 점유비용만 계산돼요. 실제 공장은 핸들러/핀/장비 제약과 불량 재검사 때문에 다를 수 있어요.
- **correctIncorrectCriteria:** Manipulate both actual siteCount and testTimeMs, calculate two 100ms scenarios and 200ms case plus cost formula, explain ideal 4× vs real unknown, no test quality gain inference.
- **misconceptions:** [m1] 검사할 칩을4개 병렬로 했으면 각 칩의 ATPG 검출률도 무조건4배로 올라요. / [m2] 100밀리초 검사와20밀리초 대기 오버헤드가 있는데 사이트1개일 때 초당10개로 계산해도 돼요. / [m3] ATE 네 사이트가 있으면 현실 공장 원가와 생산시간도 어떤 조건에서나 정확히4분의1이 돼요.
- **hints L1/L2/L3 (on request):** [L1] 동시에 몇 개를 검사하는 것과 무엇을 검출하는지는 별도예요. / [L2] 한 배치에 걸리는 시간은 100+20밀리초예요. / [L3] 테스터 핀·컨택·핸들러·자본 비용은 toy 계산에 들어 있지 않아요.
- **misconceptionFeedback/m1 (gated):** 병렬 사이트 수는 동시 장치 개수예요. 검출률은 선택한 결함 패턴과 설계 관측성이 결정해요.
- **misconceptionFeedback/m2 (gated):** 배치 120밀리초이므로1/.12≈8.33개/초예요.20밀리초를 빼먹었어요.
- **misconceptionFeedback/m3 (gated):** 이 계산은 일정 조건에서 테스터 사용비만 비교했어요. 실제 장비 병렬 자원과 접촉·재검사·비용은 빠져 있어요.
- **feedback/correct:** 두 개 이상의 실제 모델 상태를 바꾸고 선택한 시험의 모집단·단위·WHY를 확인했습니다. 이 수치는 수업용이지 제품 인증이 아니에요.
- **displayTextAfterObservation (gated):** 멀티사이트는 이상적 검사 처리량을 늘리지만 현실 전체 생산성이 같은 비율로 보장되진 않아요.
- **speechTextAfterObservation (gated):** 사 개의 소자를 한꺼번에 백이십 밀리초 안에 검사하는 수업용 장비라면 초당 약 서른세 개를 검사해요. 실제 검사 품질이나 출하 수율이 네 배 된다는 의미는 아니에요.
### ③ 시니어 반례, 근거와 상태 승인
- **physicsAssumptions:** 실제품 데이터가 아닌 명시적 독립 가상 시험/데이터셋, 해당 수식 조건에 한해 적용. 실제 ATE·HTOL·SLT 장비를 사용하지 않았으며 생산 품질이나 현장 신뢰성의 실측이 아니다.
- **seniorDesignReview:** ATE channel limitations, test handler cycle overlap and temperature, DFT scan/test vector duration, parallel site count vs ATE channels, economics/throughput not yield or test-quality guarantee.
- **sourceRefs:** [R2][R5][R6]
- **negativePathTest:** Exactly THREE independent cause-graded m1/m2/m3 prompts after student attempts; correct-first mastery allowed after 2 independent ACTUAL typed controls/WHY, no after-answer leak in PRE Voice/ARIA/DOM. Compare self-consistent parameter combinations; when a test type is NOT_RUN or NOT_TESTED never render zero-percent observed or implicit device PASS. If an input is changed after grading, start a new trial rather than rewriting past evidence. A05 real browser/mobile/Voice/CI only after independent A07 source PASS.
- **nextHook:** 다음 장면에서 다른 시험 단계가 무엇을 보장하는지 찾아봐요.

## 23-S04 · `htol-zero-failure-statistics` · 가속 신뢰성 시험에서 불량이 0개면 영원히 안 고장날까요?
### ① 먼저 예측하고 독립 조작
- **sceneId:** `htol-zero-failure-statistics`
- **learningGoal:** 0/n과1/n 표본 관측의 차이 및 단순 iid 이항 사건95% 단측 상한을 계산하고 HTOL 가속시험 결과를 현장 수명·FIT 무결함 보증과 구분한다.
- **priorKnowledge:** 13 probability/logs/percent and units,22 thermal caution,20 validation scope
- **storyHook:** 시험한 칩 백 개가 모두 합격했어요. '고장날 확률 0%' 도장을 찍어도 될까요?
- **question:** 시험한 칩 백 개가 모두 합격했어요. '고장날 확률 0%' 도장을 찍어도 될까요?
- **predictionPrompt (learner-only):** 같은 가상 검사에서 실패0개가 100개 표본과300개 표본에서 의미가 같을까요? 실패1개가 발견되면요?
- **displayTextBeforePrediction:** 관측된 불량 수와 실제 미지의 불량확률 추정은 다릅니다.
- **speechTextBeforePrediction:** 표본 수와 관측된 실패 수를 따로 바꾸며 무결함 증명과 신뢰 구간의 차이를 먼저 예측해 보세요.
- **learnerAction:** Independently choose `sampleCount=100|300` and `observedFailures=0|1`, no chips/stress in reality. `observedFraction=failures/sampleCount`; when failures0 and artificial iid Bernoulli sampling/constant one-window risk accepted, compute exact one-sided p upper at95% `1-0.05^(1/n)`; when failures1, **do not apply zero-failure formula**, return `ZERO_FAIL_BOUND_NOT_APPLICABLE` and only observed1/n, with separate binomial confidence computation REQUIRED for actual upper bound. Do not teach physical burn-in conditions or infer ten-year life/Arrhenius without data.
- **modelInputs:** typed `sampleCount:100|300`,`observedFailures:0|1`, constants alpha=.05, iidOneWindowToy=true. `observedFraction=observedFailures/sampleCount`: 0, .01 (1/100), .0033333 (1/300). If failures0 `oneSided95Upper=1-Math.pow(.05,1/sampleCount)` ⇒n100≈.02951305 (2.9513%),n300≈.0099360819 (~0.9936%); if failures1 `oneSided95Upper='ZERO_FAIL_BOUND_NOT_APPLICABLE'`, `independentCI=NOT_EVALUATED`. Always `trueTenYearFailure=NOT_PROVEN`, `realFIT=NOT_PROVEN`, `HTOLQualification=NOT_PROVEN`. This probability toy is not a real stress qualification cohort.
### ② 조작 후에만 교사용 모델 답안·오개념 교정
- **expectedObservation (teacher-only):** 같은 가상 기간에 관측된 실패0/100이라고 해도 알 수 없는 단위 고장 확률이 0이라고 증명한 것은 아니에요. 독립·동일 분포를 가정한 단측95% 상한은 약2.95%이고 0/300이면 약0.99%예요. 실패1개에서는 0실패 공식을 쓰면 안 되고 별도의 신뢰구간을 구해야 해요. 실제 HTOL에서 온도·가속수명·고장기구·표본설계 없이 이런 수치를 실제 제품 수명으로 옮길 수 없어요.
- **teacherExpectedAnswer (gated):** 같은 가상 기간에 관측된 실패0/100이라고 해도 알 수 없는 단위 고장 확률이 0이라고 증명한 것은 아니에요. 독립·동일 분포를 가정한 단측95% 상한은 약2.95%이고 0/300이면 약0.99%예요. 실패1개에서는 0실패 공식을 쓰면 안 되고 별도의 신뢰구간을 구해야 해요. 실제 HTOL에서 온도·가속수명·고장기구·표본설계 없이 이런 수치를 실제 제품 수명으로 옮길 수 없어요.
- **correctIncorrectCriteria:** Compare 0/100 vs0/300 and 1/100 or1/300 using actual independent sample/failure controls, express conditional iid one-sided upper only for zero fail, reject 0% infinite life/actual FIT and physical stress/testing recipes.
- **misconceptions:** [m1] 표본100개 중0개 실패면 그 부품의 진짜 고장확률은 무조건0이고 영원히 안전해요. / [m2] 0/100와0/300은 둘 다 실패0이므로 통계적으로 제공하는 확률 상한도 똑같아요. / [m3] 표본100개 중1개가 실패한 경우에도 0실패용 상한 공식1−0.05^(1/n)을 그대로 쓰면 정확한95% 상한이에요.
- **hints L1/L2/L3 (on request):** [L1] 실패를 못 봤다는 것과 실패가 원천적으로 불가능하다는 건 달라요. / [L2] 표본 수가 크면 0개 관측의 상한은 낮아질 수 있어요. / [L3] 0개용 공식의 유도 조건이 실패1개에도 성립할까요?
- **misconceptionFeedback/m1 (gated):** 표본 실패0개는 관측값이고 모집단의 참된 위험이0이라는 증명이 아니에요.
- **misconceptionFeedback/m2 (gated):** 0/300의 단측 상한은 약0.99%로0/100의 약2.95%보다 작아요. 같은 실패0이어도 표본이 다르죠.
- **misconceptionFeedback/m3 (gated):** 1개가 나온 경우 0개에만 성립하는 공식을 재사용하면 안 돼요. 별도 이항 신뢰구간이 필요해요.
- **feedback/correct:** 두 개 이상의 실제 모델 상태를 바꾸고 선택한 시험의 모집단·단위·WHY를 확인했습니다. 이 수치는 수업용이지 제품 인증이 아니에요.
- **displayTextAfterObservation (gated):** 신뢰성 시험 결과에는 표본의 크기·모형·신뢰수준이라는 조건이 붙어요.
- **speechTextAfterObservation (gated):** 백 개 중 불량이 하나도 발견되지 않아도 실제 고장확률은 영 퍼센트라고 말할 수 없어요. 어떤 가정을 두느냐에 따라 통계적 상한이 달라지고 실제 부품 수명은 별도 분석해야 해요.
### ③ 시니어 반례, 근거와 상태 승인
- **physicsAssumptions:** 실제품 데이터가 아닌 명시적 독립 가상 시험/데이터셋, 해당 수식 조건에 한해 적용. 실제 ATE·HTOL·SLT 장비를 사용하지 않았으며 생산 품질이나 현장 신뢰성의 실측이 아니다.
- **seniorDesignReview:** ADI HTOL Arrhenius acceleration and confidence limits require temperatures, stress physics, activation energy, product-specific failures. Classroom binomial one-window event is NOT HTOL field failure probability or FIT, and all stress operations remain forbidden.
- **sourceRefs:** [R7]
- **negativePathTest:** Exactly THREE independent cause-graded m1/m2/m3 prompts after student attempts; correct-first mastery allowed after 2 independent ACTUAL typed controls/WHY, no after-answer leak in PRE Voice/ARIA/DOM. Compare self-consistent parameter combinations; when a test type is NOT_RUN or NOT_TESTED never render zero-percent observed or implicit device PASS. If an input is changed after grading, start a new trial rather than rewriting past evidence. A05 real browser/mobile/Voice/CI only after independent A07 source PASS.
- **nextHook:** 다음 장면에서 다른 시험 단계가 무엇을 보장하는지 찾아봐요.

## 23-S05 · `ai-chip-ate-vs-system-slt` · ATE 합격한 AI 칩이 실제 AI 랙에서도 100% 안전할까요?
### ① 먼저 예측하고 독립 조작
- **sceneId:** `ai-chip-ate-vs-system-slt`
- **learningGoal:** ATE 개별 칩 검사와 GPU/AI 시스템 수준 테스트의 커버리지·부하 상호작용 차이를 독립 상태 조작으로 비교하고 SLT 미수행을100% 합격으로 기록하지 않는다.
- **priorKnowledge:** 10 AI inference/AI rack,20 design signoff,23-S01 wafer/final and RAS,32 p99
- **storyHook:** 테스터에서 합격한 가속기를 서버에 꽂았는데, 장시간 실제 데이터 작업 중에만 문제가 나타난다면요?
- **question:** 테스터에서 합격한 가속기를 서버에 꽂았는데, 장시간 실제 데이터 작업 중에만 문제가 나타난다면요?
- **predictionPrompt (learner-only):** ATE에서 통과한 가상의 칩100개가 있다면 SLT 미실시 상태와 간단·장시간 SLT를 거친 상태의 결과를 같다고 볼 수 있을까요?
- **displayTextBeforePrediction:** 개별 칩 규격 검사와 실제 시스템 연동 시험이 어디서 다를까요?
- **speechTextBeforePrediction:** 시스템 테스트를 켜거나 끈 다음 시험 유형도 따로 선택해 봐요. 시험하지 않은 것을 합격으로 세지 않도록 주의하세요.
- **learnerAction:** Independently toggle `testLevel='ATE_ONLY'|'ATE_PLUS_SLT'` and `sltProfile='SHORT'|'EXTENDED'`. Fixed 100 synthetic ATE-screen-accepted cohorts. When ATE_ONLY: `sltState='SLT_NOT_RUN'`, `observedAdditionalSystemFailures=NOT_MEASURED` and `sltPassCount=NOT_MEASURED`, **not** pass100. When SLT selected, fictional FIXED dataset SHORT detects1 new failing candidate, EXTENDED detects3 (includes the short failure in same cohort), so 99/97 remain after SLT. Neither SLT nor final ATE guarantees real deployed GPU p99/zero outage; no actual prolonged physical stress procedure.
- **modelInputs:** typed `testLevel:'ATE_ONLY'|'ATE_PLUS_SLT'`,`sltProfile:'SHORT'|'EXTENDED'`, `ateScreenAccepted=100` constant. ATE_ONLY=>`sltState='SLT_NOT_RUN'`,`newFailCount='NOT_MEASURED'`,`sltPassed='NOT_MEASURED'` independent of selected profile. PLUS_SLT SHORT=>`newFailCount=1`,`sltPassed=99`; EXTENDED=>`newFailCount=3`,`sltPassed=97`, with same synthetic cohort and short-discovered failures subset of extended, no actual device aging. `fieldFailureProbability=NOT_PROVEN`, `AIServiceP99=NOT_PROVEN`, `fullPlatformReliability=NOT_PROVEN` for all modes. Flip after a completed demo must begin a new case to avoid retrospective reporting.
### ② 조작 후에만 교사용 모델 답안·오개념 교정
- **expectedObservation (teacher-only):** ATE는 제조 결함, 정해진 성능 등 개별 칩의 검사에 강하지만 실서버 상호연결/전력·열·워크로드를 모사하는 SLT는 다른 질문을 던져요. 가상 100개 중 SHORT SLT에선 추가1개만 불합격·99개 남고 EXTENDED는3개·97개 남아요. SLT를 하지 않았다면 테스트 후 합격100개라고 말할 수 없어요. 실제 AI datacenter 장애확률이나 서비스 p99는 이런 장난감 결과만으로 알 수 없어요.
- **teacherExpectedAnswer (gated):** ATE는 제조 결함, 정해진 성능 등 개별 칩의 검사에 강하지만 실서버 상호연결/전력·열·워크로드를 모사하는 SLT는 다른 질문을 던져요. 가상 100개 중 SHORT SLT에선 추가1개만 불합격·99개 남고 EXTENDED는3개·97개 남아요. SLT를 하지 않았다면 테스트 후 합격100개라고 말할 수 없어요. 실제 AI datacenter 장애확률이나 서비스 p99는 이런 장난감 결과만으로 알 수 없어요.
- **correctIncorrectCriteria:** Use two truly independent test-level & profile settings, show SLT_NOT_RUN does NOT equal 100/100 SLT PASS, distinguish 99/97 after two toy profiles from real SLA and packaged chip KGD proof, first-right valid.
- **misconceptions:** [m1] 웨이퍼 ATE에서 합격했으면 GPU가 데이터센터에서 겪을 네트워크·냉각·메모리 오류도 자동으로 모두 검사된 거예요. / [m2] SLT 실행하지 않았는데 ATE 통과100개니까 시스템 SLT 통과도100/100으로 적으면 맞아요. / [m3] 장시간 SLT에서 가상97개가 합격하면 실제 서비스 지연 p99도97밀리초라고 결론 낼 수 있어요.
- **hints L1/L2/L3 (on request):** [L1] 테스트 장소와 시스템의 부하/연결 조건이 같나요? / [L2] 실행하지 않은 시험에 합격 숫자를 채워도 될까요? / [L3] 검사 생존 비율과 응답시간 퍼센타일은 단위부터 달라요.
- **misconceptionFeedback/m1 (gated):** ATE 개별 칩 테스트와 서버 전체 상호작용·지속 부하 RAS는 서로 다른 범위예요.
- **misconceptionFeedback/m2 (gated):** SLT 실행 기록이 없으면 SLT_NOT_RUN이에요. 제품100개가 ATE PASS라고 SLT 검사도 했다고 쓸 수 없어요.
- **misconceptionFeedback/m3 (gated):** 97은 가상의 테스트 후 남은 소자 수예요. 응답 지연 p99와 물리량·측정 방법이 달라요.
- **feedback/correct:** 두 개 이상의 실제 모델 상태를 바꾸고 선택한 시험의 모집단·단위·WHY를 확인했습니다. 이 수치는 수업용이지 제품 인증이 아니에요.
- **displayTextAfterObservation (gated):** Known Good Die의 ATE 검증과 시스템 시험의 검증 범위를 따로 기록해야 해요.
- **speechTextAfterObservation (gated):** 가상의 가속기 백 개가 ATE를 통과해도 서버 전체의 부하와 연결이 어떻게 동작하는지는 또 다른 시험이에요. 테스트하지 않은 결과는 합격으로 쓰지 않아요.
### ③ 시니어 반례, 근거와 상태 승인
- **physicsAssumptions:** 실제품 데이터가 아닌 명시적 독립 가상 시험/데이터셋, 해당 수식 조건에 한해 적용. 실제 ATE·HTOL·SLT 장비를 사용하지 않았으며 생산 품질이나 현장 신뢰성의 실측이 아니다.
- **seniorDesignReview:** Teradyne Aug2026 distinguishes KGD/wafer/final ATE vs GPU sustained SLT. Actual power/fault/thermal and service SLO different, fault attribution & guardbands, no manufacturing or postdeployment test claims from toy.
- **sourceRefs:** [R8]
- **negativePathTest:** Exactly THREE independent cause-graded m1/m2/m3 prompts after student attempts; correct-first mastery allowed after 2 independent ACTUAL typed controls/WHY, no after-answer leak in PRE Voice/ARIA/DOM. Compare self-consistent parameter combinations; when a test type is NOT_RUN or NOT_TESTED never render zero-percent observed or implicit device PASS. If an input is changed after grading, start a new trial rather than rewriting past evidence. A05 real browser/mobile/Voice/CI only after independent A07 source PASS.
- **nextHook:** AI 데이터센터 신뢰성 10/32번과 실제 장애 복구 정책을 다시 확인해요.

## A07 independent reviewer acceptance & future A05 typed negative matrix
| ID | Correct toy numeric/diagnostic states (after only) | Wrong path must be denied |
|---|---|---|
| 23-S01 | waferPass60|80×finalConditional.90|.95=>54/57/72/76 of initial100; final denominator waferPass | final test% always based on100; wafer PASS means all downstream tests PASS |
| 23-S02 | scan OFF STUCK_ONLY 60/100/TRANSITION NOT_TESTED; scan ON STUCK_ONLY 90/100/TRANSITION NOT_TESTED; scan OFF BOTH80/200=40%; scan ON BOTH160/200=80% | transition coverage implicitly observed0%, modeled% equals real wafer yield |
| 23-S03 | batch .12s at 100ms test +20ms overhead: 1site8.333DUT/s/$0.012,4sites33.333DUT/s/$0.003 at fake360$/h; batch.22s 1site4.545/s4sites18.182/s | four sites always fourfold actual factory throughput, fault coverage ×4 |
| 23-S04 | iid/fixed toy window 0/100 95%-one-sided upper ~2.951%,0/300~0.994%; failure1/100 observed1% and ZERO_FAIL_BOUND_NOT_APPLICABLE; not field FIT | zero observed→zero true risk or infinite product life, 0-fail CI used after1-fail |
| 23-S05 | ATE_ONLY⇒SLT_NOT_RUN (no SLT counts); ATE_PLUS_SLT SHORT⇒99/100 after1 new failure, EXTENDED⇒97/100 after3 new failures (same fictional cohort, nested fail sets) | ATE100 means SLT100, 97 accepted means 97ms p99 |
- [ ] P1 NEXT:A07 exact new story and senior first independent QA, cross official manufacturer and statistics assumptions, 5 before/after Korean Voice, five 3-tier hints, 15 causal wrong corrections, 2 independent real typed student variables, correct-first, any test unperformed NOT_TESTED/NOT_RUN, never suggest physical burn-in/voltage/heat procedures. Response with inspected SHA PASS or actionable MAJOR to #64 and Issue#6.
- [ ] NEXT:A06 source fix/new exact SHA then, after A07 accepted only, original scene IDs direct A05 #4. NEXT:A05 real 2.5D/mobile/keyboard/Voice/ARIA/CI, A02 independent app E2E and owner actual fab/ATE/silicon reliability/real users/launch hold.
## Sources checked 2026-10-18
[R1] https://www.ti.com/about-ti/worldwide-manufacturing/assembly-test.html
[R2] https://www.advantest.com/en/products/semiconductor-test-system/memory/t5833/
[R3] https://blogs.sw.siemens.com/xcelerator-academy/2026/04/20/unlocking-efficiency-a-deep-dive-into-tessent-atpg-for-digital-ic-testing/
[R4] https://blogs.sw.siemens.com/tessent/2023/10/31/ensure-ic-quality-with-tessent/
[R5] https://www.advantest.com/en/products/component-test-system/test-handler/
[R6] https://www.teradyne.com/products/magnum-2/
[R7] https://www.analog.com/en/resources/technical-articles/know-your-safety-part-1.html
[R8] https://www.teradyne.com/2026/08/24/slt-in-the-ai-era-validating-reliability-at-scale/
[R9] https://blogs.sw.siemens.com/tessent/2020/08/13/using-critical-area-to-optimize-test-patterns/
