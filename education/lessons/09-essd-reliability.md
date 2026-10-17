# 09 · eSSD의 숨은 일 — NAND QLC, FTL/GC, PLP, DWPD/p99
> 2026-10-17 · A06 R6 SOURCE FIX / A07 EDU_QA_RECHECK_PENDING(fact checked: 개념, toy model: 수치, needs verification: 실제 SSD 모델). 4 Step. 구현·브라우저 미실행.
> 선수: 04 NAND/eSSD/NVMe, 07 서버 메모리. ① 1분 질문/예측(student-only) → ② 직접 숫자/조작 → ③ 시니어 설계판단.

## 09-S01 · `nand-cell-voltage-windows`
- **learningGoal:** SLC/TLC/QLC 저장 밀도와 감지 여유의 trade-off 구분.
- **priorKnowledge:** NAND 임계전압·메모리 read [04].
- **storyHook:** “같은 셀에 더 많이 담을수록 왜 읽는 게 까다로워질까요?”
- **question:** 1/3/4bits per cell이면 몇 가지 상태를 구별하나요?
- **predictionPrompt (learner-visible):** 한 셀의 1/3/4비트 선택마다 필요한 구별 상태 수를 예측하고, 같은 1V 창에서 **인접 상태 중심**이 얼마나 떨어질지 선택해 보세요.
- **learnerAction:** 1V 가상 전압 창에 2/8/16 상태를 배치하고 ±0.08V 노이즈 슬라이더로 겹침 확인.
- **modelInputs:** centerSpan=1V/toy, stateCenters N=2^bits for SLC1/TLC3/QLC4, centerGap=centerSpan/(N−1), noiseDisturbance ±0|0.08V. **No 1V/16 bin-width assumption**; 16 centers means 15 center gaps. Sensitivity cartoon, not measured NAND thresholds.
- **expectedObservation (teacher-only):** 균등 중심간격 1/(N−1) V = 1, 0.1429, 0.0667V/toy. 상태가 촘촘해질수록 잡음·분포 겹침에 민감.
- **teacherExpectedAnswer (gated):** SLC 2 centers/1 gap=>1V; TLC 8 centers/7 gaps≈0.142857V; QLC 16 centers/15 gaps≈0.066667V. Relative ±0.08V per-state perturbation can overlap center margin, with no product reliability guarantee.
- **correctIncorrectCriteria:** 2^bits와 margin 둘 다 설명; toy 정량값을 모든 NAND 제품 사양으로 단정하면 실패.
- **misconceptions:** m1 QLC=4상태만 존재; m2 비트 수 증가해도 감지 난도 동일; m3 더 높은 밀도면 수명·속도 항상 향상.
- **hints:** L1 4비트의 가능한 조합은? / L2 1V 구간에 상태 **중심 16개**를 양끝까지 균등 배치하면 **중심 사이 간격 몇 개**가 있나요? / L3 실물 저장전하는 온도·시간·read disturb 영향?
- **feedback/incorrect keyed:** m1 “4비트면 16상태예요.” / m2 “전압 상태가 좁아지면 읽기 허용오차도 작아져요.” / m3 “내구성·속도는 제조/전압 분포/컨트롤러마다 달라요.”
- **feedback/correct:** “저장 밀도와 읽기 여유는 서로 다른 목표임을 찾았어요.”
- **explanation:** 실제 NAND Vth 분포는 비균등이고 read reference, program/verify, ECC·retention/read-disturb를 제어한다.
- **physicsAssumptions:** 상태 간격은 가상 균등 창 모델, 실제 프로그램 전압/노이즈/제품 보증과 무관.
- **displayTextBeforePrediction:** 한 셀의 상태 수를 직접 늘려볼까요?
- **displayTextAfterObservation (gated):** 같은 1볼트 창에서 상태 중심이 많아지면 간격이 줄어요.
- **speechTextBeforePrediction:** 1비트와 4비트에서 몇 가지 전압 상태를 구별해야 할지 먼저 선택해 보세요.
- **speechTextAfterObservation (gated):** 네 비트는 열여섯 상태지만, 열여섯 중심 사이엔 열다섯 간격이 있죠. 이 장난감 모형에서는 간격이 1/15볼트예요.
- **nextHook:** 페이지를 덮어쓰기 어려운데 파일 수정은 어떻게 하나요?
- **sourceRefs:** [X1][X2]


- **negativePathTest:** Learner selecting 16 equal bins (gap=1/16V) in the CENTER model must be corrected; show 16 dots with 15 arrows, not 16 spaces.
## 09-S02 · `ssd-write-amplification`
- **learningGoal:** 호스트 쓰기와 NAND 실제 쓰기, GC/OP/wear 관리 구분.
- **priorKnowledge:** 09-S01 및 NAND page/block, FTL.
- **storyHook:** “파일을 한 번 수정했는데 저장장치 안에서는 무슨 추가 작업이 일어날까요?”
- **question:** 파일 수정 때 옛 유효 페이지를 이사시키면 장치 쓰기량은?
- **predictionPrompt (learner-visible):** 호스트가 1GiB 썼을 때 내부 페이지 이동이 0/0.6GiB라면 NAND 실제 쓰기량과 WAF가 어떻게 달라질지 먼저 예상해 보세요.
- **learnerAction:** 블록 valid/invalid 셀 이사, GC on/off, OP 여유 10/20% 카드.
- **modelInputs:** hostWrite 1GiB/toy, relocation 0/0.6GiB/toy, OP toy 10/20%.
- **expectedObservation (teacher-only):** WAF=(host+relocated)/host =1 또는 1.6. GC/OP/워크로드/FTL 방식 변화에 따라 다르나 OP 2배→WAF 반감 법칙 없음.
- **teacherExpectedAnswer (gated):** WAF=(host+relocated)/host =1 또는 1.6. GC/OP/워크로드/FTL 방식 변화에 따라 다르나 OP 2배→WAF 반감 법칙 없음.
- **correctIncorrectCriteria:** WAF=physical NAND writes / host writes; OP 증가 효과를 조건부로 설명.
- **misconceptions:** m1 GC가 사용자 파일을 마음대로 삭제; m2 NAND 쓰기는 항상 host 쓰기와 동일; m3 OP 두 배면 WAF는 항상 절반.
- **hints:** L1 invalid page와 valid page 차이 / L2 유효 데이터를 블록 지우기 전에 어디로? / L3 여유 공간과 write pattern은?
- **feedback/incorrect keyed:** m1 “GC는 장치 내부 회수 작업이에요.” / m2 “이사도 추가 쓰기예요.” / m3 “컨트롤러·점유율·쓰기에 따라 효과가 달라요.”
- **feedback/correct:** “보이지 않던 내부 이사 비용을 발견했어요.”
- **explanation:** IBM의 분석대로 flash out-of-place writes와 유효 페이지 이동은 쓰기 증폭과 endurance/tail latency에 영향을 준다.
- **physicsAssumptions:** 1/1.6은 교육 계산만; 특정 SSD WAF/GC 시간 수치 아님.
- **displayTextBeforePrediction:** 호스트와 NAND가 쓰는 양은 같을까요?
- **displayTextAfterObservation (gated):** NAND의 내부 페이지 이사도 쓰기 증폭에 포함돼요.
- **speechTextBeforePrediction:** 옛 유효 페이지를 옮기는 동안 NAND가 얼마나 더 써야 할지 예상해 보세요.
- **speechTextAfterObservation (gated):** 호스트 1기가바이트와 내부 이동 0.6기가바이트라면 NAND는 총 1.6기가바이트를 기록해요. WAF는 1.6이죠.
- **nextHook:** 쓰던 중 전원이 갑자기 끊어지면?
- **sourceRefs:** [X2][X3]

## 09-S03 · `ssd-plp-power-loss`
- **learningGoal:** SSD ACK/휘발 캐시/비휘발 NAND·PLP 보호범위 구분.
- **priorKnowledge:** 09-S02, NVMe read/write, capacitor C·전력.
- **storyHook:** “완료됐다는 표시 직후 전원이 꺼지면 파일은 안전할까요?”
- **question:** write ACK와 실제 NAND commit은 항상 같은 순간일까요?
- **predictionPrompt (learner-visible):** ACK가 반환된 시점과 NAND 저장이 끝난 시점이 같을지, 휘발 캐시·PLP·flush/FUA·전원 상실 시간을 독립적으로 골라 예측해 보세요.
- **learnerAction:** Ordered events: host write → controller volatile cache or direct persistent commit → ACK → optional Flush ISSUED/COMPLETED or FUA WRITE COMPLETED → power-loss at beforeAck/afterAckBeforePersist/afterPersist. Toggles cacheVolatile, ackMode, plpEnabled and remainingCommitWorkJ (0.4 or1.2 toy), explicitly test wrong `ACK=durable` and `flushIssued=completed` choices.
- **modelInputs:** C=0.1F, Vhi5V,Vlo3V,P8W => ideal hold-up0.8J/8W=0.1s. Additional simulator state: cacheVolatile=true|false, ackMode=volatileCache|afterMediaCommit, plpEnabled=true|false, flushState=none|issued|completed, fuaStatus=none|issued|completed, powerLossAt=beforeAck|afterAckBeforeCommit|afterCommit, remainingCommitWorkJ=0.4|1.2 toy, energyEffectiveFraction=0.75 toy => usableEnergy0.6J. durableEvidence=confirmedByDeclaredPolicy|atRisk|requiresDeviceContract. Event order is persisted (not mere flags).
- **expectedObservation (teacher-only):** Capacitor nominal E=½·0.1·(5²−3²)=0.8J, ideal T=0.8/8=0.1s. **Toy PLP usable** 0.8×0.75=0.6J, thus 0.4J pending work can be energetically possible but 1.2J cannot; neither by itself proves cache+mapping metadata commit. A volatile ACK followed by power loss before media commit is at-risk without sufficient declared protection. Flush ISSUED alone is not flush COMPLETED; successfully completed FUA/flush supports a stronger persistence claim only **under stated device/block contract**. `powerLossAt=afterCommit` yields persisted toy state.
- **teacherExpectedAnswer (gated):** ACK from volatile buffer≠media durability; `afterAckBeforeCommit+no PLP` ⇒ atRisk; `plpEnabled+remainingWork0.4J≤usable0.6J` ⇒ energetically feasible but actual metadata/controller/device contract unknown; `remainingWork1.2J>0.6J` ⇒ INSUFFICIENT toy energy; `flushState=issued` not completed; completed flush/FUA changes durability evidence per declared policy.
- **correctIncorrectCriteria:** Learner demonstrates 2 distinct chronological timelines (ACK→power loss vs media commit→power loss), differentiates flush issued/completed and toy PLP energy sufficient/insufficient with 0.6J usable vs0.4/1.2J work. Rejects blanket all-eSSD PLP or all-ACK durable claims.
- **misconceptions:** m1 어떤 ACK든 물리 NAND commit 보장; m2 모든 eSSD에 동일 PLP 필수; m3 0.8J면 어떤 SSD의 모든 outstanding writes 보장.
- **hints:** L1 버퍼는 휘발할 수 있나요? / L2 전원 보호 회로는 제품별로? / L3 변환 손실/메타데이터/남은 NAND 작업량도 계산?
- **feedback/incorrect keyed:** m1 “완료 시점은 flush/FUA/cache 정책에 달라요.” / m2 “PLP의 유무와 범위는 개별 데이터시트에서 보세요.” / m3 “물리 에너지 계산과 완전 보호 보증은 달라요.”
- **feedback/correct:** “ACK, 캐시, 비휘발 기록은 구별해야 해요.”
- **explanation:** 홀드업 회로는 일부 enterprise SSD에서 전원 손실 때 필요한 NAND 프로그램/FTL metadata 보호를 지원할 수 있으나 개별 모델 검증 필수.
- **physicsAssumptions:** Synthetic 0.1F/5→3V/8W, effectiveFraction0.75, pendingEnergy0.4/1.2J. Energy sufficiency only a necessary engineering check and device-specific metadata, NAND program latency, host cache, ordering and Nvme flush/FUA semantics can change durability; do NOT claim PLP universally protects all writes.
- **displayTextBeforePrediction:** 완료 신호만으로 안전한지 어떻게 확인할까요?
- **displayTextAfterObservation (gated):** PLP의 용량 계산과 실제 저장 완료 증명은 달라요.
- **speechTextBeforePrediction:** 데이터가 어디에 있는지 보고 정전 시점을 바꿔보세요. 답은 조작 후 확인해요.
- **speechTextAfterObservation (gated):** 이 가상 회로의 에너지는 0.8줄이고 8와트라면 이상적인 0.1초예요. 하지만 ACK와 flush 완료, 보호 범위와 남은 작업량을 함께 살펴야 하죠.
- **nextHook:** 데이터는 안전해도 응답이 가끔 느리다면?
- **sourceRefs:** [X3][X4]


- **negativePathTest:** ACK before NAND commit + volatile buffer + no PLP + power loss ⇒ atRisk; PLP nominal E0.8J but usable0.6J < remaining1.2J ⇒ insufficient; flush issued but not completed ⇒ don't assert durable; flush completed under declared supported policy + media commit ⇒ stronger evidence. Assessment must verify **event order**, not just visited flag set.
## 09-S04 · `essd-dwpd-tail-latency`
- **learningGoal:** DWPD endurance와 평균·p99 latency의 서로 다른 지표 이해.
- **priorKnowledge:** 09-S02/S03, **60~90초 nearest-rank 미니카드에서 처음 퍼센타일 학습** (Atlas P08 아직 PARTIAL): 100개 측정값을 오름차순으로 정렬하고 `ceil(0.99×100)=99`번째 값을 p99으로 읽는다는 정의. 데이터 99개만 1ms, 1개 20ms일 경우 p99=1ms로 'p99는 최대값'이 항상 거짓임을 조작해 확인.
- **storyHook:** “평균은 빠른데 가끔 AI 요청이 멈춰 보이는 이유는요?”
- **question:** 빠른 요청이 대다수라도 가장 느린 쪽의 응답시간 지표는 평균과 같을까요?
- **predictionPrompt (learner-visible):** 100개 요청의 느린 순위 p99를 찾기 전에, 100개 기록을 직접 정렬해 99번째를 고르고 5년의 총 쓰기량을 예측해 보세요.
- **learnerAction:** 먼저 **무작위로 섞인 100개 latency card**를 sort해서 nearest-rank p99 (99th of100) 지정; `95×1ms+5×20ms`와 `99×1ms+1×20ms` 두 분포를 비교해 p99≠max by definition negative case 확인. 이후 decimal 2TB×1 DWPD×365days×5years endurance 계산, queue depth/write mix 배지 바꿔 실측 불가 toy 경계를 알기.
- **modelInputs:** decimalCapacity2TB, DWPD1, years5, daysPerYear365 (toy five-year exactly 1825 days); latencySamples A=95×1ms+5×20ms, B=99×1ms+1×20ms, permuteSeed demo for unsorted order, percentileMethod=nearestRank(n=100,rank=ceil(.99*n)=99), queueDepth=toy label 1/8 with NO numerical latency effect asserted.
- **expectedObservation (teacher-only):** 2TB×1 DWPD×365×5=3650TB=3.65PB written toy. Distribution A mean=(95+100)/100=1.95ms, nearest-rank p99=20ms; B mean=(99+20)/100=1.19ms, nearest-rank p99=1ms even though maximum=20ms. Sort **before** choosing rank99; no real SSD p99 claim.
- **teacherExpectedAnswer (gated):** nearest-rank 100 sample p99 is sorted element #99, A 20ms with avg1.95ms, B 1ms with avg1.19ms and max20ms; decimal TBW=3650TB, not read-DWPD metric.
- **correctIncorrectCriteria:** 장치 보증 내구성 vs 서비스 tail, decimal GB/TB와 binary GiB 분리.
- **misconceptions:** m1 DWPD는 읽기 횟수; m2 avg<2ms이면 p99도<2ms; m3 어떤 QD·혼합 부하라도 p99은 고정.
- **hints:** L1 D는 Day, W는 Write / L2 느린 요청 5개는 오른쪽 끝? / L3 큐·온도·GC steady state는?
- **feedback/incorrect keyed:** m1 “하루 드라이브 용량만큼 쓸 수 있는 횟수의 지표예요.” / m2 “평균이 꼬리를 감출 수 있어요.” / m3 “p99도 워크로드와 측정 조건에 따라 달라져요.”
- **feedback/correct:** “내구성과 서비스 품질을 함께 비교하는 이유를 찾았어요.”
- **explanation:** TBW≈DWPD×사용자 용량(TB)×일수. p99 nearest-rank 정의를 명시; IOPS·p99·99.9/99.999p·QD·write mix·실험 지속시간 통일 없이는 제품 비교하지 않는다.
- **physicsAssumptions:** 수치 모두 toy; 실제 제조사 보증·속도 아님. NAND GC/PLP 사례와 p99의 인과 크기는 실제 측정 필요.
- **displayTextBeforePrediction:** 꼬리 지연시간은 평균과 같을까요?
- **displayTextAfterObservation (gated):** 평균은 빨라도 p99은 훨씬 늦을 수 있어요.
- **speechTextBeforePrediction:** 기록을 작은 순서대로 정렬하고 느린 요청의 위치부터 찾은 뒤 지표를 비교해 보세요.
- **speechTextAfterObservation (gated):** 백 개 기록 중 아흔다섯 개가 1밀리초, 다섯 개가 20밀리초인 경우 99번째는 20밀리초예요. 평균은 1.95밀리초죠.
- **nextHook:** 이제 AI 전체 병목은 어디서 결정될까요?
- **sourceRefs:** [X2][X5]

## 공식·연구 근거와 인계
[X1] https://semiconductor.samsung.com/support/tools-resources/dictionary/semiconductor-glossary-nand-flash-memory/
[X2] https://research.ibm.com/publications/write-amplification-analysis-in-flash-based-solid-state-drives
[X3] https://www.zurich.ibm.com/cloudstorage/
[X4] https://nvmexpress.org/specification/nvm-express-base-specification/
[X5] https://my.micron.com/about/blog/storage/ai/the-right-tool-for-the-job-from-crescent-wrenches-to-ai-infrastructure
3 오답 branch, 예측 전 정답 노출 금지, 44px/keyboard/reduced-motion/Voice, toy 모델 배지/선수·다음 Hook. 앱 코드 미변경. 제품별 PLP/flush 보증·DWPD/p99은 데이터시트와 동일 시험 조건 전 절대 성능 단정 금지.

- **miniBridgePrePrediction:** “100개의 도착시간을 작은 값부터 정렬해 99번째 기록을 직접 찾아봐요. p99은 무엇일까요?” — teach rank formula only **after initial sorted-card exercise** and before latency DWPD quiz; not prefill A mean/p99 numbers.
- **negativePathTest:** learner selecting max20ms as p99 for B (99×1ms, 1×20ms) must be rejected; unsorted card #99 cannot stand in for sorted rank #99. Show 60–90 second tutorial only, then grade on independent altered dataset.

## A07 Round06 major corrections · 2026-10-17
- [A07 independent source review](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-06-memory-07-ssd-09-audit.md) originally flagged 09-S01 16 centers/15 gaps vs old 16 intervals hint; S03 missing cache/flush/FUA/PLP event model and ordering; S04 missing percentile prerequisite, pre-spoiled mean/p99; S02 pre-display gave away 0.6GiB. This revision addresses each in actual 4-Step lesson source with separate pre and after voice and teacherExpectedAnswer gated.
- Source assumptions: public independent SSD endurance facts intact; X5 Micron account blog is **not** device-specific public evidence for PLP/p99. All durability results conditioned on given NVMe device/host contract, no claim of universal completion semantics or actual SSD measurements.
- Visibility condition: no teacherExpectedAnswer, expectedObservation, or after speech/display in student DOM/aria/TTS until submitted prediction + independent manipulations + WHY. Misconception-specific feedback after error only; never require intentionally wrong answer for pass. A05 Scene/Chromium and A02 app untested; A07 revalidation of this new blob pending.
