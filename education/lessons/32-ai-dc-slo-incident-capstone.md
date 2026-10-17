# 32 · AI 데이터센터 운영실 탈출: 요청 trace → SLO → 재시도 폭주 → 복구 → 에너지
> **A06_AUTHOR_SOURCE_DONE / A07_EDU_SOURCE_REVIEW_PENDING · 2026-10-17**. 신규 5 Step, [pipeline #46](https://github.com/Junebooky/interactive-engineering/issues/46), [Google SRE/AWS/OpenTelemetry/DOE 시니어 source/math](../deep-dives/32-datacenter-slo-observability-recovery.md). 기존 17레슨/73 Step +신규32 5 Step=**18 authored lessons /78 Steps** (not A07 PASS or A05 browser/app).
> 선수 10 AI DC E2E, 13 숫자·p99/SLO, 31 PSU/VRM/CDU/PUE; 08 fabric+09 storage 부정사례를 선택 복습. **수업 스토리:** “GPU는 빠른데 서비스가 왜 늦고, 왜 재시도를 눌렀다가 더 망가질까?” 운영실에 5개의 사건 카드가 등장해 원인·복구·전력 지표를 학생이 직접 바꿔봅니다. 45~60분(기획 추정, 실측 아님).

## 학생 안전 공개 계약
- Before prediction learner-facing `predictionPrompt`, `storyHook`, `displayTextBeforePrediction`, `speechTextBeforePrediction` only; all computed outcomes, feedback answers, `expectedObservation`, `teacherExpectedAnswer` and after Voice/display **gated until prediction submitted + >=2 independent distinct setting manipulations + WHY** (correct-first allowed without deliberate mistake). Hint L1/L2/L3 user-on-demand only; m1/2/3 keyed specific misconceptions; voice/DOM/aria all subject to same gate. Unit assumptions reference can appear before answer, numeric computed result must not.
- Every incident is synthetic **TOY**, no real production trace, SLA, AWS platform performance, water meter reading, rack test or RTO certification. Lessons 10/13/31 source QA can change; cross-lesson graph subject to independent A07 consistency check. A05 scenes only after own independent A07 PASS; app A02 separate.

## 32-S01 · `dc-request-critical-path` · GPU가 80ms 일했는데 답은 왜 120ms 걸렸을까요?
### ① 1분: 문제를 먼저 예상해 봐요
- **sceneId:** `dc-request-critical-path`
- **learningGoal:** TraceID/span nesting, elapsed vs child-span sum and cold vs warm model load distinct, avoid double-counting concurrent work.
- **priorKnowledge:** 10-S02 prefill/decode, 13-S04 latency and basic units
- **storyHook:** GPU 로그만 보면 빠른데 사용자 화면의 전체 응답은 늦는다고요? 시간이 어디 갔을까요?
- **question:** GPU 로그만 보면 빠른데 사용자 화면의 전체 응답은 늦는다고요? 시간이 어디 갔을까요?
- **predictionPrompt (learner-only):** 동시에 실행되는 기록 작업이 하나 있을 때 사용자 응답에 걸린 시간을 각 조각의 합으로 계산해도 될지 먼저 예측해 보세요.
- **displayTextBeforePrediction:** 요청이 지나간 길을 시간표로 연결해 볼까요?
- **speechTextBeforePrediction:** 게이트웨이부터 GPU, 응답까지 사건 카드를 배치해 봐요. 병렬 기록이 어떤 영향을 줄지도 먼저 예상해 봐요.
- **learnerAction:** Link trace root and child spans; reorder sequential gateway0–20ms, tokenizer20–30ms, GPU30–110ms, response110–120ms, plus logging30–60ms overlapping GPU. Choose sum-of-spans vs root elapsed; then modelWarm yes/no coldload 40ms between tokenizer and GPU shifts final end to160ms. Inject missing trace propagation to see incomplete path rather than invented zero delay.
- **modelInputs:** gateway [0,20],tokenizer[20,30],GPU[30,110],respond[110,120],logging parallel[30,60] in ms; optional coldLoad40ms shifts GPU to[70,150] and send[150,160]; tracePropagated=true|false, modelWarm=true|false, rootStart0 and observed root end, client elapsed if instrumentation boundary defined.
### ② 학생 조작 후 — 가려둔 정답/오개념 연결
- **expectedObservation (teacher-only):** Warm root end120ms while naive span sum20+10+80+10+30=150ms DOUBLE COUNTS parallel logger. Cold model load40 extends root to160ms with GPU service80; no universal per-token SSD model loading. Missing trace propagation => incomplete observation NOT zero work; real clock skew may need correction.
- **teacherExpectedAnswer (gated):** Warm root end120ms while naive span sum20+10+80+10+30=150ms DOUBLE COUNTS parallel logger. Cold model load40 extends root to160ms with GPU service80; no universal per-token SSD model loading. Missing trace propagation => incomplete observation NOT zero work; real clock skew may need correction.
- **correctIncorrectCriteria:** Show warm 120ms vs naive150, cold160ms, map trace root/child and parallel log without counting twice, define timing/missing data and verify two independent configurations.
- **misconceptions:** [m1] 병렬로 진행된 로깅 30ms는 요청 120ms에 무조건 추가해야 해요. / [m2] 서버 trace가 없어도 기록되지 않은 작업시간은 0ms가 맞아요. / [m3] 모델을 SSD에서 한 번 읽으면 모든 토큰마다 SSD에서 다시 통째로 읽어요.
- **hints L1/L2/L3 (on request):** [L1] 사용자의 응답 시작에서 끝까지 경과한 시간을 읽어 봐요. / [L2] 동시에 겹친 작업을 더하면 시간이 중복될까요? / [L3] 냉간 로딩과 이미 상주하는 모델을 별도 상태로 바꿔봐요.
- **misconceptionFeedback/m1 (gated):** “GPU와 겹쳐서 로깅30ms가 수행되므로 단순 합150ms 대신 실제 root 경과120ms를 읽어요.”
- **misconceptionFeedback/m2 (gated):** “누락된 span은 가려진 작업이지 시간이 0이 된 게 아니에요. 관측 범위를 먼저 확인해야 해요.”
- **misconceptionFeedback/m3 (gated):** “모델이 상주하면 매 토큰마다 모델 전체를 SSD에서 다시 읽을 필요가 없어요. 냉간 시작과 분리해요.”
- **feedback/correct:** “서로 다른 두 상태와 단위를 조작해서 실제로 확인했어요. 왜 그랬고 어느 가정이 깨지면 다른 결과가 나올까요?”
- **displayTextAfterObservation (gated):** 병렬 작업은 단순 합산하면 전체 시간이 중복될 수 있어요.
- **speechTextAfterObservation (gated):** 로그 작업이 GPU 연산과 같은 시간에 진행됐다면 사용자 대기 시간은 둘을 단순히 더하지 않아요. 실제 전체 경과 시간과 계측 범위를 비교해야 하죠.
### ③ 시니어 리뷰와 테스트 가능한 반례
- **physicsAssumptions:** Toy deterministic sequential core trace plus one genuinely parallel logging span, zero scheduling gaps, root same-clock timeline; network variations, tracing sampling/clock sync/missing spans unknown. No actual datacenter trace.
- **seniorDesignReview:** OpenTelemetry trace/span parent links vs critical path, time synchronization, missing context, cold model weights vs hot, TTFT/complete latency, biased instrumentation.
- **sourceRefs:** [C1]
- **negativePathTest:** m1/m2/m3 wrongChoice should reveal cause-specific response only after prediction and own controls, never generic feedback PASS; successful first attempt needs two independent manipulations and why. Physical negative cases in source model/expectedObservation require independent A05 exact browser assertions.
- **nextHook:** 사용자 경험을 지키는 목표는 어떤 요청을 세고 몇 개 실패를 허용해야 할까요?

## 32-S02 · `dc-slo-error-budget-burn` · 요청 천 건 중 열 건 실패. 아직 목표는 안전할까요?
### ① 1분: 문제를 먼저 예상해 봐요
- **sceneId:** `dc-slo-error-budget-burn`
- **learningGoal:** Compute request-good/eligible SLI vs SLO target and normalized error-budget burn 10x, distinguish p99 latency separate.
- **priorKnowledge:** 13-S05 eligible/SLO/p99 and 32-S01 trace timing
- **storyHook:** 천 건 중 열 건 실패를 '얼마 안 된다'고 넘겼는데 99.9% 목표라면 어떨까요?
- **question:** 천 건 중 열 건 실패를 '얼마 안 된다'고 넘겼는데 99.9% 목표라면 어떨까요?
- **predictionPrompt (learner-only):** 적격 요청1000건에서 10건 실패와 1건 실패를 각각 비교해 99.9% 목표를 지켰는지, 예산 소비 속도가 어떻게 바뀔지 예측해 보세요.
- **displayTextBeforePrediction:** 실패 한 건도 아까운 목표를 계산해볼까요?
- **speechTextBeforePrediction:** 같은 수의 요청을 두 시나리오로 나누고 목표를 선택해 봐요. 먼저 얼마나 허용할지 예상해 보세요.
- **learnerAction:** **Before viewing outcomes**, freeze eligibility policy `service=/inference AND region=demo AND window=24h` on `rawRequests=1100`. Student independently toggles frozen in-scope pair `good990/bad10|good999/bad1` (bad includes timed-out requests), fixed out-of-scope-good100, SLO goal .999|.99, and optionally `postHocDropTimeouts=true|false` **after** outcomes. Model derives eligibleN and refuses to grade a posthoc exclusion as improvement: `ELIGIBILITY_VIOLATION`; show p99 on separate readout only. Compare 990/10 target99.9 failure & 10× burn against 999/1 pass and 990/10 target99 pass, and predeclared out-of-scope100 excluded legitimately.
- **modelInputs:** `rawRequests=1100` toy with status groups `inScopeGood=990|999`, `inScopeBad=10|1` **paired to sum1000 (timeouts in bad)**, `outOfScopeGood=100`, `outOfScopeBad=0`, `declaredEligibilityRule='service=/inference AND region=demo AND fixed24h'`, `eligibilityPolicyFrozen=true` prior to revealing responses, `postHocDropTimeouts=true|false`, target=.999|.99, `p99` separate observational metric. Derived read-only `rawN=inGood+inBad+outGood+outBad=1100`, `eligibleN=inGood+inBad=1000`, `excludedN=outGood+outBad=100`, `actualBad=inBad`, `SLI=inGood/eligibleN`, `allowedBad=floor(eligibleN×(1−target))`, `normalizedBurn=(actualBad/eligibleN)/(1−target)` in same window. `scoreState=ELIGIBILITY_VIOLATION` if postHocDropTimeouts true **regardless of apparent modified ratio**, or if eligibilityPolicyFrozen false; else `SLO_PASS` iff actualBad≤allowedBad, else `SLO_FAIL`. All counts conserve rawN; no independent editable eligibleN or score by arbitrary status filter.
### ② 학생 조작 후 — 가려둔 정답/오개념 연결
- **expectedObservation (teacher-only):** raw1100 = inGood990 + inBad10 + predeclared outGood100, so **eligible1000** derived, SLI99%. At99.9% SLO only1 bad allowed; actual10 ⇒ **SLO_FAIL, normalized burn10×**/exceeded budget9. At good999/bad1 target.999⇒SLO_PASS exactly; target.99 with990/10⇒SLO_PASS. *Legitimate* out-of-scope100 removed by frozen rule leaves honest990/1000. Posthoc removing failed timeouts could make990/990 appear100%, but **ELIGIBILITY_VIOLATION**, not pass; preserve original baseline failure/burn. p99 latency metric is independent.
- **teacherExpectedAnswer (gated):** Baseline raw 1100 records includes 100 predeclared out-of-scope good requests and 1000 eligible = 990good+10bad (timeouts bad). SLO target99.9% allows1 failure, so10 use10× budget (same window) and exceed9. Legitimate frozen eligibility vs posthoc timeout deletion different **causal** rule; never permit posthoc pass. 999/1 at99.9 passes, 990/10 at99 passes. `eligibleN` must always derive from paired statuses.
- **correctIncorrectCriteria:** First freeze eligible cohort before outcome, demonstrate raw count conservation 1100 and eligible=1000, compute target and burn for baseline/999-good/99% goal, compare legal predeclared exclusion of outScope100 with invalid posthoc deletion and explain WHY. Correct first prediction may pass after two independent valid controls and WHY, without intentionally choosing false timeout filter.
- **misconceptions:** [m1] 성공 990/1000은 목표99.9%에도 통과예요. / [m2] p99 지연이 정상이어도 요청 실패율은 볼 필요 없어요. / [m3] 실패한 요청은 제외하고 990/990으로 다시 계산하면 원래 SLO를 통과한 거예요.
- **hints L1/L2/L3 (on request):** [L1] 적격 전체 수로 성공 수를 나눠요. / [L2] 목표까지 허용되는 오류 비율은 1에서 목표를 뺀 값이에요. / [L3] 대상 요청 포함/제외 기준이 미리 정해졌나요?
- **misconceptionFeedback/m1 (gated):** “990/1000은99%예요. 목표가99.9%라면 같은 표본에서 실패는 한 건만 허용돼요.”
- **misconceptionFeedback/m2 (gated):** “p99은 응답시간 분포의 값이고 오류율과 측정방식은 서로 다른 지표예요.”
- **misconceptionFeedback/m3 (gated):** “측정 뒤 실패한 요청을 제외하면 분모 조작이에요. 사전 합의된 적격 요청 집합이 필요해요.”
- **feedback/correct:** “서로 다른 두 상태와 단위를 조작해서 실제로 확인했어요. 왜 그랬고 어느 가정이 깨지면 다른 결과가 나올까요?”
- **displayTextAfterObservation (gated):** 정해진 기간의 적격 요청과 실패 건수로 SLO를 검증해야 해요.
- **speechTextAfterObservation (gated):** 서비스의 신뢰성 목표를 계산하려면 어떤 요청을 셀지와 기간을 정해야 해요. 허용 오류 예산을 넘는지는 그 다음에 검사하죠.
### ③ 시니어 리뷰와 테스트 가능한 반례
- **physicsAssumptions:** Toy fixed 24h measurement raw1100, predeclared out-of-scope-good100, in-scope1000 (990/10 or999/1), timeouts included in bad. Frozen eligibility policy cannot be changed after outcomes. Burn ratio computed for identical window/population; not real alert-rate or service SLA. Independent p99 needs its own sample and threshold. No app/device measurements.
- **seniorDesignReview:** SLI/SLO math, eligible population contract, latency distribution vs availability, missing metrics, retries/deduped requests, multi-window alerts; separate SLA penalty.
- **sourceRefs:** [C2][C3]
- **negativePathTest:** m1/m2/m3 wrongChoice should reveal cause-specific response only after prediction and own controls, never generic feedback PASS; successful first attempt needs two independent manipulations and why. Physical negative cases in source model/expectedObservation require independent A05 exact browser assertions.
- **nextHook:** 과부하 때 모든 실패 요청을 무조건 다시 보내면 문제를 고칠까요?


- **negativePathTest (R16-01):** [A] raw1100 with outGood100 preexcluded→eligible1000 and 990/10 @99.9 ⇒SLO_FAIL/burn10×/exceed9; [B]999/1 @99.9⇒SLO_PASS; [C]990/10 @99%⇒SLO_PASS; [D]postHocDropTimeouts after outcomes ⇒`ELIGIBILITY_VIOLATION` and baseline metrics remain, NOT 990/990 PASS; [E]no frozen policy ⇒ELIGIBILITY_VIOLATION; [F] p99 excellent but bad10 still SLO_FAIL; [G] reject illegal independent edit of eligibleN, raw sum must be1100. Correctly interpreting violation then resetting to valid policy may earn PASS without forced error.
## 32-S03 · `dc-retry-storm-queue` · 실패했으니 즉시 재시도! 서버가 더 멈출까요?
### ① 1분: 문제를 먼저 예상해 봐요
- **sceneId:** `dc-retry-storm-queue`
- **learningGoal:** Demonstrate retries can overload a service and backoff/jitter only spreads limited retry cohort, not guarantee recovery.
- **priorKnowledge:** 08-S02 queue/capacity, 32-S02 SLO failing requests
- **storyHook:** 서버가 힘든데 클라이언트가 '다시! 다시!' 외치면 어떻게 될까요?
- **question:** 서버가 힘든데 클라이언트가 '다시! 다시!' 외치면 어떻게 될까요?
- **predictionPrompt (learner-only):** 한 틱에 새 요청4건을 처리능력5인 서버가 받는다면 재시도2건이 추가될 때 대기열이 어떻게 달라질지 먼저 예상해 보세요.
- **displayTextBeforePrediction:** 재시도 버튼이 모두에게 좋은 소식일까요?
- **speechTextBeforePrediction:** 서비스 처리량과 요청 수 카드를 조합해 봐요. 실패한 요청을 언제 다시 보내야 할지 예상해 보세요.
- **learnerAction:** Set arrival new=4/tick, capacity=5/tick, fault cohort=2 failed from previous tick, retryMode=none|immediateOnce|spreadTwoTicks, frozen cohort (no recursive retries). Event-loop 2–4 ticks; independently count retries and queue lengths; try wrong unlimited immediate retry policy, then reveal condition that retry fixed source failure doesn't fix and may consume error budget.
- **modelInputs:** newArrival=4 requests/tick, capacity=5 requests/tick, fixed failed cohort2 eligible for at most1 retry, retryMode=none|immediateOnce|spread2ticks; immediate next tick adds2⇒6 vs capacity5⇒backlog+1 if no drop; spread retry1 per tick⇒5 at capacity, no spare; additional retry-generated errors disabled explicitly; real backoff random timing omitted.
### ② 학생 조작 후 — 가려둔 정답/오개념 연결
- **expectedObservation (teacher-only):** Toy no retry new4≤5, immediate2 adds6>5 queue grows by1 for affected tick, spread retry1/tick yields5 per tick with no backlog under unchanged capacity; it may increase recovery latency and has no guarantee if server remains down, new retry generation, jitter collision or correlated failure.
- **teacherExpectedAnswer (gated):** Toy no retry new4≤5, immediate2 adds6>5 queue grows by1 for affected tick, spread retry1/tick yields5 per tick with no backlog under unchanged capacity; it may increase recovery latency and has no guarantee if server remains down, new retry generation, jitter collision or correlated failure.
- **correctIncorrectCriteria:** Compare three modes and 6 vs5 overload/queue+1, specify one-retry and frozen-cohort constraints, correctly reject retries as guaranteed uptime and distinguish dropped requests from requests merely delayed.
- **misconceptions:** [m1] 재시도가 많아질수록 서버는 항상 더 건강해져요. / [m2] 새 요청4건과 재시도2건을 함께 받아도 처리능력5이므로 대기열은 절대로 생기지 않아요. / [m3] 백오프와 지터를 켜면 고장난 서버가 자동으로 고쳐지고 모든 요청이 성공해요.
- **hints L1/L2/L3 (on request):** [L1] 새 요청과 재시도를 같은 용량 예산에서 세어봐요. / [L2] 한 틱당 서비스 능력보다 도착량이 많으면 남는 요청은 어디로 갈까요? / [L3] 시간을 흩뜨리는 것과 물리적 고장을 복구하는 일은 다르죠.
- **misconceptionFeedback/m1 (gated):** “과한 재시도는 서비스에 더 많은 트래픽을 만들어 연쇄장애를 악화시킬 수 있어요.”
- **misconceptionFeedback/m2 (gated):** “도착6건, 처리5건이면 한 건은 다음 틱으로 밀리거나 버려야 해요.”
- **misconceptionFeedback/m3 (gated):** “백오프는 과도한 동시 부하를 줄이는 운영 기법이지만 건강하지 않은 서버를 복구하는 마법은 아니에요.”
- **feedback/correct:** “서로 다른 두 상태와 단위를 조작해서 실제로 확인했어요. 왜 그랬고 어느 가정이 깨지면 다른 결과가 나올까요?”
- **displayTextAfterObservation (gated):** 재시도는 부하를 늘릴 수 있으니 지연·예산과 함께 설계해요.
- **speechTextAfterObservation (gated):** 재시도를 한꺼번에 몰아넣으면 서버가 감당해야 할 요청이 커져요. 간격을 두거나 무리한 요청을 차단하는 설계도 필요하죠.
### ③ 시니어 리뷰와 테스트 가능한 반례
- **physicsAssumptions:** Synthetic deterministic fixed cohort, capacities per toy tick; no recursively generated retries, request dedup/idempotency cost, retries fail outcome, true randomized jitter or network overhead modeled. Backoff can delay and not guarantee service.
- **seniorDesignReview:** Timeout/backoff/jitter, exponential retry budgeting, circuit-breakers, overload load-shedding, idempotency and SLI counting semantics; cascading failure with telemetry.
- **sourceRefs:** [C4]
- **negativePathTest:** m1/m2/m3 wrongChoice should reveal cause-specific response only after prediction and own controls, never generic feedback PASS; successful first attempt needs two independent manipulations and why. Physical negative cases in source model/expectedObservation require independent A05 exact browser assertions.
- **nextHook:** 서버를 다시 살려도 어제 저장한 데이터가 지금의 최신 데이터일까요?

## 32-S04 · `dc-rto-rpo-backup-restore` · 서비스는 살아났는데 최신 데이터가 사라졌다면?
### ① 1분: 문제를 먼저 예상해 봐요
- **sceneId:** `dc-rto-rpo-backup-restore`
- **learningGoal:** Separate outage downtime from potential checkpoint gap and existence vs tested restore validity; RTO vs RPO targets independent.
- **priorKnowledge:** 09-S03 SSD PLP/ACK, 10-S04 failover, 13-S05 SLO
- **storyHook:** 불이 다시 켜졌어요. 그런데 열 분 전 저장한 파일만 남아 있다면 '복구 성공'일까요?
- **question:** 불이 다시 켜졌어요. 그런데 열 분 전 저장한 파일만 남아 있다면 '복구 성공'일까요?
- **predictionPrompt (learner-only):** 장애 발생이 60분, 마지막 복구본이 50분, 다시 서비스가 열린 게 68분이면 복구 시간과 데이터 손실 가능 구간 중 어느 것이 더 큰지 예상해 보세요.
- **displayTextBeforePrediction:** 복구 시간과 데이터 복구 시점은 같을까요?
- **speechTextBeforePrediction:** 장애 시각과 백업 시각, 다시 켠 시각을 각각 카드로 선택해 봐요.
- **learnerAction:** Student independently sets `backupExists`, `checkpointDurable`, `restoreTestedValid`, `serviceRecovered` true|false plus checkpoint timestamp50|58, outage time60 fixed, optional measured recovery68|72; then reads **RPO and RTO as distinct verified facts**, not as a combined success badge. Must simulate (i) backup file exists but checkpoint not durable, (ii) durable checkpoint but failed restore test, (iii) tested usable data but service still offline, and (iv) successful validated recovery with distinct RTO/RPO threshold results. Choosing recent checkpoint alone never clears both failures. Only reveal consequences after own prediction and 2 manipulations.
- **modelInputs:** `outageAt=60 min`, `checkpointAt=50|58 min`, `serviceRestoredAt=68|72 min` (timing read only if verified), `RTOtarget=10 min`,`RPOtarget=5 min`, four **independent** controls `backupExists=true|false`, `checkpointDurable=true|false` (completed durable write with consistent metadata), `restoreTestedValid=true|false` (latest selected checkpoint actually restorable, not just time stamp), `serviceRecovered=true|false` (healthy user access after restore). Derived `proofOk=backupExists&&checkpointDurable&&restoreTestedValid`. `RPOstate=!proofOk ? RPO_NOT_PROVEN : ((outageAt-checkpointAt)<=RPOtarget ? RPO_PASS : RPO_FAIL)`, `RTOstate=(!proofOk||!serviceRecovered) ? RTO_NOT_PROVEN : ((serviceRestoredAt-outageAt)<=RTOtarget ? RTO_PASS : RTO_FAIL)`; if no backup or failed restore, show `NO_PROVEN_RECOVERY` master status, not 0 data loss. If proofOk but serviceRecovered=false, show **RTO_NOT_PROVEN** despite possible proven checkpoint age; don't compute measured downtime from a fictional future time. All stage guards override numeric badges.
### ② 학생 조작 후 — 가려둔 정답/오개념 연결
- **expectedObservation (teacher-only):** With backupExists, checkpointDurable, restoreTestedValid and serviceRecovered all true: outage60→resumed68 means measured downtime8min **RTO_PASS** vs target10, verified last durable checkpoint50 means potential gap10min **RPO_FAIL** vs target5; verified checkpoint58 gives RPO gap2min PASS; measured recovery72 gives downtime12min **RTO_FAIL**. **backupExists=true + checkpointDurable=true + restoreTestedValid=false** ⇒ `NO_PROVEN_RECOVERY`/RPO_NOT_PROVEN and RTO_NOT_PROVEN even if timestamp58. `restoreTestedValid=true` + proven backup but `serviceRecovered=false` ⇒ `RTO_NOT_PROVEN` (RPO may be demonstrated separately, no online service claim). If checkpointDurable=false, RPO_NOT_PROVEN regardless timestamp. Tested restore isn't necessarily the same as live service already reachable.
- **teacherExpectedAnswer (gated):** One clock for outage/recovery RTO and a different clock for outage/last **verified durable and restorable** checkpoint RPO. Only with independent evidence of actual data restore and user-visible service recovery do numeric RTO/RPO statements become meaningful. All-valid default checkpoint50/recovered68 gives RPO gap10>5 FAIL and RTO8≤10 PASS. No independently tested restore⇒NO_PROVEN_RECOVERY, no actual recovered service⇒RTO_NOT_PROVEN even with timestamp68.
- **correctIncorrectCriteria:** Student independently toggles all four booleans and verifies baseline RTO_PASS/RPO_FAIL, checkpoint58 RPO_PASS, restoration72 RTO_FAIL; `backupExists` alone not enough, `checkpointDurable=true,restoreTestedValid=false` cannot pass, `restoreTestedValid=true,serviceRecovered=false` cannot claim RTO. A correct-first guess with two independent actual scenes plus WHY can PASS without deliberately choosing a wrong answer.
- **misconceptions:** [m1] RTO 10분이면 데이터 손실도 언제나 최대 10분이라는 뜻이에요. / [m2] 백업 파일이 하나 있으면 복구 시험을 하지 않아도 최신 데이터가 항상 정확히 돌아와요. / [m3] RPO 목표가 5분이면 장애 난 이후 5분 안에 서비스가 반드시 켜진다는 뜻이에요.
- **hints L1/L2/L3 (on request):** [L1] 장애 이후까지 걸린 시간과 장애 전 백업 시점을 따로 표시해요. / [L2] 데이터를 실제로 복원해 읽어볼 수 있었나요? / [L3] RTO는 중단→복구, RPO는 장애 전으로 돌아갈 수 있는 최신 시점이에요.
- **misconceptionFeedback/m1 (gated):** “RTO는 서비스 복구까지의 허용 시간이고 RPO는 장애 전 데이터 복구 시점의 허용 차이예요.”
- **misconceptionFeedback/m2 (gated):** “백업의 존재와 정합한 복구 테스트 성공은 달라요. 복원 파일이 손상될 수 있죠.”
- **misconceptionFeedback/m3 (gated):** “RPO는 '장애 전 얼마만큼 데이터가 되돌아갈 수 있는가' 목표지 장애 후 서비스 재개 시간 목표가 아니에요.”
- **feedback/correct:** “서로 다른 두 상태와 단위를 조작해서 실제로 확인했어요. 왜 그랬고 어느 가정이 깨지면 다른 결과가 나올까요?”
- **displayTextAfterObservation (gated):** RTO와 RPO는 각각 다른 목표이며 둘 다 실제 시험해야 해요.
- **speechTextAfterObservation (gated):** 서비스가 다시 열린 시간과 마지막 정상 백업이 얼마나 최근인지는 달라요. 타임라인에서 두 목표를 독립적으로 확인해야 하죠.
### ③ 시니어 리뷰와 테스트 가능한 반례
- **physicsAssumptions:** Synthetic recovery clock, independent physical durable checkpoint proof, verified restoration drill, and final user-facing service recovery treated separately. Potential RPO gap is upper window of not-checkpointed changes, not exact bytes lost. Any failed backup/checkpoint/restore invalidates **proven** RPO; unverified service recovery invalidates achieved RTO rather than assigning 8/12minutes. Unknown metadata/PLP/checkpoint consistency/replica and external dependency not guaranteed.
- **seniorDesignReview:** AWS DR RTO vs RPO definitions, backup integrity restore drills, cross-site consistency and storage PLP/flush guarantees vs backups, measurement evidence and unknowns.
- **sourceRefs:** [C5][C6]
- **negativePathTest:** m1/m2/m3 wrongChoice should reveal cause-specific response only after prediction and own controls, never generic feedback PASS; successful first attempt needs two independent manipulations and why. Physical negative cases in source model/expectedObservation require independent A05 exact browser assertions.
- **nextHook:** 가동되는 서버 A와 B 중 누가 전기를 적게 쓰면서 더 많은 정상 요청을 처리할까요?


- **negativePathTest (R16-02):** [A] backupExists=true, durable=true, restoreTestedValid=true, serviceRecovered=true, cp50/resume68 ⇒ `RPO_FAIL gap10`, `RTO_PASS downtime8`; [B] cp58 same proof ⇒`RPO_PASS gap2`; [C] resume72 same proof ⇒`RTO_FAIL downtime12`; [D] backup true durable true restoreTestedValid=false ⇒`NO_PROVEN_RECOVERY`, `RPO_NOT_PROVEN` and `RTO_NOT_PROVEN`; [E] backup true durable true restore valid true but serviceRecovered=false ⇒`RTO_NOT_PROVEN`, no finished user recovery; [F] backup false or durable=false ⇒`RPO_NOT_PROVEN` and master no proof. Never show elapsed8 or gap0 as certified when guard false.
## 32-S05 · `dc-power-goodput-water-tradeoff` · PUE가 더 높은 곳이 요청당 전기를 적게 쓸 수도 있을까요?
### ① 1분: 문제를 먼저 예상해 봐요
- **sceneId:** `dc-power-goodput-water-tradeoff`
- **learningGoal:** Calculate facility energy per good response, PUE, WUE and compare IT throughput with same window. Avoid simplistic PUE=>app efficiency/CO2 claims.
- **priorKnowledge:** 31 PUE/WUE and PSU losses, 13 units and success SLIs
- **storyHook:** 데이터센터 두 곳 중 PUE가 더 낮은 곳이 무조건 더 좋은 AI 서비스일까요?
- **question:** 데이터센터 두 곳 중 PUE가 더 낮은 곳이 무조건 더 좋은 AI 서비스일까요?
- **predictionPrompt (learner-only):** 같은 1MW IT 부하에서 시설 PUE와 초당 성공 요청량이 서로 다르면 요청 한 건당 시설 전력 사용은 어떤 쪽이 작을지 계산 전에 예상해 보세요.
- **displayTextBeforePrediction:** 스펙표에서 좋은 숫자 하나만 고르면 될까요?
- **speechTextBeforePrediction:** 전력 사용과 성공 요청, 물 소비를 세 칸으로 나눠봐요. 먼저 각 지표의 순위를 예상해 보세요.
- **learnerAction:** Compare fictional site A IT1MW PUE1.2 facility1.2MW good1000req/s and site B IT1MW PUE1.4 facility1.4MW good1500req/s over1h; independently toggle `powerPUE`, `goodput`, `waterLiters=2000|500` per site and fixed ITenergy1000kWh; compute facility-kWh per request, successful requests/facility kWh, WUE liters/IT kWh. Optional `qualityEqual=false` badge to block absolute best-site claim without latency/quality/CO2 data. No device product measurements.
- **modelInputs:** same period1h, ITaverage1MW=>ITenergy1000kWh, A PUE1.2 facilityEnergy1200kWh and success1000/s=>3.6million/h =>3000 req/facility-kWh and0.33333Wh/req, siteWater2000L WUE2L/kWh. B PUE1.4=>1400kWh and1500/s=>5.4million/h =>3857.142857 req/kWh and0.259259Wh/req, water500L WUE0.5L/kWh. All invented data, quality/latency/CO2 constraints not compared.
### ② 학생 조작 후 — 가려둔 정답/오개념 연결
- **expectedObservation (teacher-only):** A better facility PUE (1.2 vs B1.4), but B fictional more valid responses per facility-kWh (~3857 vs3000) and fewer Wh/response (.2593 vs.3333) because goodput differs. WUE site A2 vs B.5L/kWh separate; cannot choose global winner without response quality/p99/facility boundaries, real energy mix/location and life-cycle effects.
- **teacherExpectedAnswer (gated):** A better facility PUE (1.2 vs B1.4), but B fictional more valid responses per facility-kWh (~3857 vs3000) and fewer Wh/response (.2593 vs.3333) because goodput differs. WUE site A2 vs B.5L/kWh separate; cannot choose global winner without response quality/p99/facility boundaries, real energy mix/location and life-cycle effects.
- **correctIncorrectCriteria:** Compute both PUE/WUE with declared units and two site goodput per facility kWh, identify reversed efficiency rankings and reject automatic emissions/availability conclusions.
- **misconceptions:** [m1] PUE 1.2인 곳은 같은 조건이 아니어도 무조건 사용자 요청당 전기를 덜 써요. / [m2] WUE는 냉각수가 한 초 동안 지나가는 순환 유량만 알아도 계산할 수 있어요. / [m3] PUE와 응답 처리량을 비교하면 데이터센터의 실제 탄소발자국과 지연시간까지 모두 알 수 있어요.
- **hints L1/L2/L3 (on request):** [L1] 시설에너지와 성공한 요청 수를 같은 기간으로 맞춰 나눠 보세요. / [L2] 시설의 연간 물 사용량과 같은 기간 IT 에너지 사용량이 필요해요. / [L3] 응답 품질·지연, 전력망 탄소집약도, 위치도 주어졌나요?
- **misconceptionFeedback/m1 (gated):** “PUE는 시설/IT 에너지의 비예요. 같은 기간 성공 요청 수까지 계산해야 요청당 시설 에너지를 비교할 수 있어요.”
- **misconceptionFeedback/m2 (gated):** “WUE는 현장에서 실제 사용한 물의 양을 IT 에너지로 나눈 비율이에요. 닫힌 물길의 순환량과 달라요.”
- **misconceptionFeedback/m3 (gated):** “응답 품질·지연 분포와 실제 위치/시간별 전력 배출계수가 없으면 전체 탄소와 서비스 가치 우열을 단정할 수 없어요.”
- **feedback/correct:** “서로 다른 두 상태와 단위를 조작해서 실제로 확인했어요. 왜 그랬고 어느 가정이 깨지면 다른 결과가 나올까요?”
- **displayTextAfterObservation (gated):** 시설 효율·요청당 전기·물 사용은 함께 측정해야 해요.
- **speechTextAfterObservation (gated):** 시설 에너지의 비율이 좋다고 모든 사용자 요청의 에너지가 작은 건 아니에요. 같은 기간 성공 요청량과 물 사용, 응답 품질도 따로 봐야 하죠.
### ③ 시니어 리뷰와 테스트 가능한 반례
- **physicsAssumptions:** Contrived 1h steady IT1MW, constant PUE in each site, response counts quality unspecified; no observed carbon grid intensity, cooling loop design or specific datacenter design. WUE site water measured, not coolant circulation.
- **seniorDesignReview:** Meter boundaries for PUE and WUE, normalized successful tokens/requests per facility-energy, quality/SLO/p99 guardrails and price/emissions tradeoffs; energy-not-compute-only.
- **sourceRefs:** [C7][C2]
- **negativePathTest:** m1/m2/m3 wrongChoice should reveal cause-specific response only after prediction and own controls, never generic feedback PASS; successful first attempt needs two independent manipulations and why. Physical negative cases in source model/expectedObservation require independent A05 exact browser assertions.
- **nextHook:** 이제 모든 핵심 레슨을 이어서 사용자 요청의 병목·장애·에너지 지표를 직접 검증할 수 있어요.

## A07 SOURCE QA / A05 after PASS production acceptance
| SceneID | Key toy numeric and negative truth |
|---|---|
| 32-S01 `dc-request-critical-path` | Parallel logger30ms overlaps GPU: actual warm root120ms vs naive child-sum150ms; cold load+40=>root160ms; missing trace != zero elapsed |
| 32-S02 `dc-slo-error-budget-burn` | Fixed eligible1000, SLO99.9% max1 bad, actual10 bad ratio10× under same window; no silent timeout filtering/p99 substitution |
| 32-S03 `dc-retry-storm-queue` | New4/tick capacity5, immediate2 retries=>6 arrivals backlog+1; spread1/tick=>5 full load in frozen-cohort toy, no guarantee healthy hardware |
| 32-S04 `dc-rto-rpo-backup-restore` | Outage60, restored68=>RTO actual8 ≤target10; last checkpoint50→RPO potential10 >target5; verified checkpoint58→gap2 ≤5; unverified backup NO_PROVEN_RECOVERY |
| 32-S05 `dc-power-goodput-water-tradeoff` | IT1MW 1h, A PUE1.2 site1200kWh throughput1000/s=>3000req/kWh WUE2; B PUE1.4 site1400kWh throughput1500/s=>3857.142857req/kWh WUE0.5, not global product/carbonscore |
- P1 NEXT A07 independent all 5 student pre/after Korean UI/Voice, 15 cause-specific feedback, evidence of no grading answer leakage; official SRE/AWS/OTEL/DOE physics/assumptions and separate numerical negative cases. After exact SOURCE PASS A06 STORY_READY direct A05 #4 five-scene contract; A05 must run actual Chrome/mobile/Voice/aria wrong states and tested HEAD+CI/screens, direct A02 product E2E. Owner RELEASE_HOLD.

## Official public source URLs checked 2026-10-17
[C1] OpenTelemetry https://opentelemetry.io/docs/concepts/signals/traces/
[C2] Google SRE https://sre.google/sre-book/service-level-objectives/
[C3] Google SRE error budgets https://sre.google/workbook/error-budget-policy/
[C4] Google SRE overload https://sre.google/sre-book/service-best-practices/
[C5] AWS Well-Architected https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/disaster-recovery-dr-objectives.html
[C6] AWS verified restores https://docs.aws.amazon.com/wellarchitected/2024-06-27/framework/rel_backing_up_data_periodic_recovery_testing_data.html
[C7] DOE/FEMP https://www.energy.gov/cmei/femp/cooling-water-efficiency-opportunities-federal-data-centers

## A07 Round16 R16-01 / R16-02 source state-contract correction · 2026-10-17
- [A07 independent original Round16](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-16-lesson13-slo-retest-32-capstone-first-audit.md) physics/math PASS across 5 original Step but found 32-S02 excluded-request control no cohort/grade (same prior 13 R14-01) and 32-S04 restoreTestedValid in learnerAction but absent from modelInputs. **A06 new source repair:** S02 import frozen predeclared raw1100=990good+10bad+100outGood; score posthoc invalid even if apparent score improves, S04 independently gate backup existence, checkpoint durability, tested valid restore, and actually recovered service before RPO/RTO proof. 32-S03 one fixed two-request failure cohort only, no recurring new failures. A07 *new exact blob SHA* independent SOURCE_RECHECK still needed; no browser/equipment/app run.
