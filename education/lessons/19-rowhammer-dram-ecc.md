# 19 · DRAM의 보이지 않는 이웃: RowHammer·PRAC·ECC·데이터센터 안전
> **A06_AUTHOR_SOURCE_DONE / NEXT:A07 INDEPENDENT SCIENCE-EDU_REVIEW** · 2026-10-17. Five **defensive educational 2.5D storyboards** not executable hardware attacks; independent [research and current Intel2026 vs Google2025 source notes](../deep-dives/19-rowhammer-ecc-defensive-reliability.md), [pipeline #53](https://github.com/Junebooky/interactive-engineering/issues/53). Previous **20 authored lessons/88 Steps + this19 five =21 lessons/93 Steps**. No A07 source PASS, A05 tested 2.5D, A02 app, DRAM equipment experiment or security certification.
> 선수 02 DRAM1T1C/refresh, 07 DDR/MC, 13 simple binary/statistics, 09 SSD reliability; 후속 10 AI DC memory integrity/32 capstone RTO/RPO/SLI. Student story: 피해 행은 보이지 않지만 흔들릴 수 있다 — 원인·보호 범위·오류·운영경보를 안전한 카드로 분리하는 5개 조사실. No physical memory addresses, activation timing patterns, reproduction code or exploit paths.

## Student-first contract and physical source boundaries
- Learner before stage exposes only hook/question/predictionPrompt/displayTextBeforePrediction/speechTextBeforePrediction; computed teacherExpectedAnswer, observed status, negative corrections, after UI and audio **gated until prediction + two actually distinct manipulations + WHY**. First attempt correct can PASS without deliberate wrong submission; hints L1/L2/L3 only on request, m1/2/3 cause-specific feedback. Numeric toy score/SECDED/CE-rate is never a real RowHammer threshold or product immunity proof.
- Class examples use Intel public guidance updated **2026-07-20**, Google research published **2025-09-15** plus 2014/2021/2022 papers. Publication-date-specific claims about PRAC deployment must not become 'all DDR5 always/never supported'. Simulator is non-operational.

## 19-S01 · `dram-retention-disturbance-margin` · 조용히 줄어드는 전하와 옆에서 흔드는 전하는 같은 걸까요?
### ① 먼저 예상하고 원인을 조작
- **sceneId:** dram-retention-disturbance-margin
- **learningGoal:** 추상 DRAM 전하 여유10점에서 자연 감소와 별도 교란 토큰을 독립 조작하여 refresh·disturbance 차이와 임계 모델의 한계를 설명한다.
- **priorKnowledge:** 02 DRAM read/restore/refresh,13 단위
- **storyHook:** 셀은 가만히 있어도 전하가 줄어드는데 옆줄의 활동까지 영향을 준다면 어떻게 될까요?
- **question:** 셀은 가만히 있어도 전하가 줄어드는데 옆줄의 활동까지 영향을 준다면 어떻게 될까요?
- **predictionPrompt (learner-only):** 처음 여유10점에서 세 번의 시간경과와 교란3개를 별도로 더하면, 임계5점 아래로 내려갈지 먼저 예측하세요.
- **displayTextBeforePrediction:** 시간만 지나도 줄어드는 셀에 주변 간섭이 오면요?
- **speechTextBeforePrediction:** 시간 카드와 옆줄 간섭 카드를 각각 골라 전하 여유가 어느 쪽에서 달라지는지 먼저 예상해 봐요.
- **learnerAction:** 학생은 실제로 독립된 `epochCount=1|3`, `plannedDisturbanceTokens=0|3`와 `refreshAtEpoch2=true|false`를 선택한다. 교란 토큰 3개를 계획하면 **최대 세 epoch에 하나씩** 배정하되 아직 지나지 않은 epoch의 토큰은 절대 조기 적용하지 않는다. `appliedTokens=min(epochCount,plannedDisturbanceTokens)` 파생 읽기전용. `epochCount=1`일 때 refreshAtEpoch2가 켜져도 미래 이벤트는 `REFRESH_NOT_REACHED`로 표시하고 margin 계산에 적용하지 않는다. `epochCount=3`일 때만 epoch2 끝에서 margin10으로 수업용 재충전하고 이후 epoch3의 자연감소/교란만 적용. 두 결과 비교 후 WHY, 실 DRAM ACT 횟수·타이밍 없음.
- **modelInputs:** Typed `epochCount:1|3`, `plannedDisturbanceTokens:0|3`, `refreshAtEpoch2:boolean`, dimensionless marginInitial10, naturalLossPerEpoch1, disturbancePenaltyPerToken1, threshold5. Exactly `appliedTokens=min(epochCount,plannedDisturbanceTokens)` with one *scheduled* token per elapsed epoch; unelapsed tokens never count. If epochCount=1 ⇒margin=10−1−(plannedTokens>0?1:0): 9 for planned0, **8 for planned3**. `refreshAtEpoch2=true` and epochCount<2 => `REFRESH_NOT_REACHED`, **no reset**, margin8 or9 unaffected. For epochCount3 without refresh margin=10−3−(plannedTokens===3?3:0): 7 or4; with valid refresh at end epoch2, epoch3 margin=10−1−(plannedTokens===3?1:0):9 or8. `TOY_CORRUPTED` iff margin<5 else `TOY_STABLE` in this fictional toy; no physical activation threshold or row maps.
### ② 조작 결과에 따른 교사용 정답·원인별 피드백 (before 비노출)
- **expectedObservation (teacher-only):** `epoch1 + planned0` ⇒ margin9; `epoch1 + planned3` ⇒ **only one applied token**, margin8 (not6), refresh toggle yields `REFRESH_NOT_REACHED` and cannot change epoch1 margin. `epoch3 + planned0` ⇒7; `epoch3 + planned3 +no refresh` ⇒4<5 toy corrupted; `epoch3 + planned3 +refreshAtEpoch2` ⇒8 toy stable, `epoch3 +planned0+refresh` ⇒9. Abstract planning tokens have no direct RowHammer command/threshold interpretation.
- **teacherExpectedAnswer (gated):** 분리된 학생 입력 plannedTokens3은 향후 최대3회 교란 계획일 뿐, epoch1에서 appliedTokens1만 차감되어10−1−1=8점. epoch2 미도달 시 REFRESH_NOT_REACHED. epoch3까지 실행하면 토큰3개 적용+자연감소3 =>4점, epoch2 끝에서만 refresh 시 epoch3 상태8점. 모두 실제 DRAM 물리 취약성 수치가 아닌 가상의 상태점수.
- **correctIncorrectCriteria:** epochCount1과3, plannedTokens0과3을 **실제로** 각각 조작하고 epoch1 planned3 margin8, epoch3 planned3 margin4, epoch3 refresh margin8, epoch1 refresh `REFRESH_NOT_REACHED` 네 반례 중 두 이상 관찰하고 WHY 기술. 지난 epoch에만 교란 토큰 반영하고 미래 refresh를 소급 적용하지 않음을 설명하면 first-right PASS. Attack timing/map claims forbidden.
- **misconceptions:** [m1] RowHammer는 보통 자연 누설과 완전히 똑같아 주변 행 활동은 필요 없어요. / [m2] 여유10에서 세 번 경과하고 교란3개를 빼도 결과가 언제나7점이에요. / [m3] 일반 REFRESH가 존재하면 어떤 현실 RowHammer 상황에서도 절대 비트가 뒤집히지 않아요.
- **hints L1/L2/L3 (requested only):** [L1] 시간경과와 주변 간섭의 두 손실 항을 나눠 봐요. / [L2] 한번에 세 토큰을 더 빼면 남는 점수는 얼마일까요? / [L3] 수업 점수표의 임계값과 실제 DRAM 수명은 같은 수치인가요?
- **misconceptionFeedback/m1 (gated):** 자연 보존 손실과 주변 행 간섭은 원인이 다른 효과예요. 옆 행 활동이 추가 영향이 될 수 있죠.
- **misconceptionFeedback/m2 (gated):** 10−3−3=4점이에요. 자연 감소만 있었을 때의7점과 달라요.
- **misconceptionFeedback/m3 (gated):** 리프레시는 저장 전하 복원 과정이지만 간섭을 완전히 없앤다는 제품 보증은 아니에요. 이 수치는 수업용 점수예요.
- **feedback/correct:** 두 독립 조작으로 물리 원인과 결과 범위를 확인했어요. 이 단순화가 실제 제품 안전성 보증은 아닌 이유를 WHY로 설명해 봐요.
- **displayTextAfterObservation (gated):** 리프레시와 외부 교란은 별개의 물리적 문제를 다뤄요.
- **speechTextAfterObservation (gated):** DRAM 전하는 시간이 지나면서 줄어들고, 일부 조건에서는 근처 행의 활동 때문에 추가 교란을 받을 수 있어요. 수업용 숫자를 실제 안전 기준으로 해석하면 안 돼요.
### ③ 시니어 검증·절대 성립하지 않는 결론
- **physicsAssumptions:** Arbitrary dimensionless classroom margin, not voltage or ACT count, no physical attack procedure or real device error susceptibility. PVT/cell variation not modeled.
- **seniorDesignReview:** Kim 2014 ISCA disturbance mechanism, leakage vs refresh and victim errors; no universal flip threshold.
- **sourceRefs:** [R1][R3]
- **negativePathTest:** R25-01 reviewer matrix: epoch1 planned0→margin9; epoch1 planned3→`appliedTokens1`,margin8; epoch1 planned3 refreshAtEpoch2=true→`REFRESH_NOT_REACHED`,margin8; epoch3 planned3 refresh false→margin4<5; epoch3 planned3 refresh true→margin8, actual refresh after epoch2 only; epoch3 planned0 refresh true→margin9. Explicit fail if epoch1 planned3 subtracts all3 to margin6 or if epoch1 refresh changes margin (future event). All m1-m3 cause-specific hidden before prediction; no real activation counts or test hardware.
- **nextHook:** 다음 카드에서 메모리 보호의 또 다른 한계를 찾아봐요.

## 19-S02 · `dram-neighbor-victim-scope` · 바로 옆줄만 보면 모든 메모리 행을 지킬 수 있을까요?
### ① 먼저 예상하고 원인을 조작
- **sceneId:** dram-neighbor-victim-scope
- **learningGoal:** 인접 행만 영향을 준다는 모델과 일부 칩의 2칸 거리 영향 가능성을 구분하고 보호 범위를 잘못 확정하지 않는다.
- **priorKnowledge:** 19-S01 physical disturbance,02 DRAM bank rows
- **storyHook:** A·B·C 세 행이 나란히 있어요. A가 흔들리면 C는 무조건 안전할까요?
- **question:** A·B·C 세 행이 나란히 있어요. A가 흔들리면 C는 무조건 안전할까요?
- **predictionPrompt (learner-only):** A·B·C 중 B만 보호 목록에 올리는 규칙이 '거리2 위험 가능성'이 있는 칩에도 충분한지 예상해 보세요.
- **displayTextBeforePrediction:** 이웃 줄의 범위는 항상 같을까요?
- **speechTextBeforePrediction:** A, B, C 카드의 영향 가능성과 보호 범위를 따로 선택해봐요. C가 안전하다고 바로 선언해도 될까요?
- **learnerAction:** Toggle deviceEvidence=adjacentOnlyObserved|distanceTwoPossible and protectionScope=nearestOnly|qualifiedBroaderScope as two independent cards, mark if C risk coverage is unverified. Never show real physical row address map or how to induce disturbance.
- **modelInputs:** toy rows A,B,C conceptual physical order; deviceEvidence categorical, not guaranteed physical geometry; protectionScope as defined. If distanceTwoPossible and nearestOnly =>`COVERAGE_UNCERTAIN`. If qualifiedBroaderScope=>`SCOPE_REVIEWED_FOR_TOY` without claiming secure or deterministic C flip. If adjacentOnlyObserved =>`NO_DISTANCE_TWO_EVIDENCE_IN_TOY`, not proof none can occur.
### ② 조작 결과에 따른 교사용 정답·원인별 피드백 (before 비노출)
- **expectedObservation (teacher-only):** Some observed DRAM families can show effects beyond immediately adjacent rows; nearest-only protection may miss a possible distance-two outcome. A07 must not teach all chips distance2 or any fixed attenuation, row-map guessing, or guaranteed C corruption.
- **teacherExpectedAnswer (gated):** Some observed DRAM families can show effects beyond immediately adjacent rows; nearest-only protection may miss a possible distance-two outcome. A07 must not teach all chips distance2 or any fixed attenuation, row-map guessing, or guaranteed C corruption.
- **correctIncorrectCriteria:** Student tests nearest and broader scope with two evidence states and distinguishes research possibility from universal behavior; no real device attacker location.
- **misconceptions:** [m1] RowHammer의 영향은 어떤 칩에서도 반드시 정확히 이웃 행 한 줄에만 머물러요. / [m2] A와 두 칸 떨어진 C는 연구에서 영향을 보인 적이 전혀 없어요. / [m3] 더 넓게 보호하도록 그림을 바꾸면 모든 DDR5 장치가 실제로 안전하다고 인증된 거예요.
- **hints L1/L2/L3 (requested only):** [L1] 구글 Half-Double 연구의 핵심 '범위' 질문을 떠올려요. / [L2] 가능하다는 것과 모든 장치에서 반드시 발생한다는 것을 구별해요. / [L3] 그림의 선택은 실기기 성능 시험 결과가 아니에요.
- **misconceptionFeedback/m1 (gated):** 일부 장치는 가까운 행 밖에서도 교란이 관찰돼요. 하나의 거리 규칙을 전 제품에 강제할 수 없어요.
- **misconceptionFeedback/m2 (gated):** 거리2 가능성은 실제 연구 근거가 있어요. 하지만 모든 DRAM에서 그런 건 아니죠.
- **misconceptionFeedback/m3 (gated):** 교육용 보호범위 표시만으로 실제 제품 보호 검증이나 인증을 대신할 수 없어요.
- **feedback/correct:** 두 독립 조작으로 물리 원인과 결과 범위를 확인했어요. 이 단순화가 실제 제품 안전성 보증은 아닌 이유를 WHY로 설명해 봐요.
- **displayTextAfterObservation (gated):** 물리적 영향 범위는 제품별 검증이 필요해요.
- **speechTextAfterObservation (gated):** 처음 알려진 교란은 가까운 행을 주로 다뤘지만 이후 연구에선 더 먼 행까지 영향이 나타날 수 있다고 보고했어요. 그림만으로 안전 판정을 할 수 없어요.
### ③ 시니어 검증·절대 성립하지 않는 결론
- **physicsAssumptions:** Categorical evidence, no real physical addresses, no attack control signals or recurrence. Qualifying broader scope is a concept not product immunity.
- **seniorDesignReview:** Half-Double 2021/22 beyond adjacency context; physical vs virtual address mapping and device vendor variability.
- **sourceRefs:** [R2][R4]
- **negativePathTest:** grader must reject the distinct physical cause of each m1/m2/m3, not a visited-state token; correct-first after two independent actually changed controls+WHY succeeds, after answer audio/DOM/ARIA never leaked pre-prediction. No hardware access frequency, real victim mapping or real attacks. A07 reviewer before A05 physical 2.5D.
- **nextHook:** 다음 카드에서 메모리 보호의 또 다른 한계를 찾아봐요.

## 19-S03 · `dram-prac-refresh-gates` · TRR·RFM·PRAC 버튼이 있으면 보호는 자동 완성일까요?
### ① 먼저 예상하고 원인을 조작
- **sceneId:** dram-prac-refresh-gates
- **learningGoal:** 예방형 DRAM/컨트롤러 기능의 지원·펌웨어 조건을 논리 AND로 검사하고 TRR/RFM/PRAC와 ECC의 목적을 분리한다.
- **priorKnowledge:** 02 refresh,07 DDR5 controller,19-S02 distance-scope caveat
- **storyHook:** 새 서버 사양서에 PRAC이라고 써 있어요. 메모리와 컨트롤러와 BIOS 중 하나가 준비되지 않으면요?
- **question:** 새 서버 사양서에 PRAC이라고 써 있어요. 메모리와 컨트롤러와 BIOS 중 하나가 준비되지 않으면요?
- **predictionPrompt (learner-only):** PRAC 지원 DRAM만 꽂으면 BIOS·컨트롤러와 상관없이 모든 행이 안전할지 먼저 골라봐요.
- **displayTextBeforePrediction:** 보호 기술을 구성하는 세 단계가 모두 맞는지 확인할까요?
- **speechTextBeforePrediction:** DRAM, 컨트롤러, BIOS의 기능 스위치를 따로 만지고 보호 상태가 어떻게 달라질지 예상해 봐요.
- **learnerAction:** Select `protectionMode=PRAC|RFM|TRR` and observe per-mode **actual typed independent feature toggles**: PRAC/RFM teaching profile sets `dramFeatureSupported:boolean`, `controllerFeatureSupported:boolean`, `firmwareConfigured:boolean`, requires all3 true only to show `CONFIGURED_NOT_CERTIFIED`; any false `FEATURE_UNAVAILABLE`. **TRR branch uses separate real booleans** `trrVendorSupported:boolean`, `trrConfigured:boolean` (controllerFeatureSupported does not silently control this DRAM vendor-internal TRR toy). TRR both true⇒`RISK_REDUCED_NOT_CERTIFIED`, otherwise `FEATURE_UNAVAILABLE`. Toggle toy `extraManagementCycles=1|4` to read 101|104 on base100 separate from hardware latency; every mode `protectionGuaranteed=NOT_PROVEN`, no access patterns or universal DDR5 part claims.
- **modelInputs:** Typed `protectionMode:'PRAC'|'RFM'|'TRR'`; `dramFeatureSupported:boolean`, `controllerFeatureSupported:boolean`, `firmwareConfigured:boolean` for PRAC/RFM **fictional chosen platform support contract**; and **independent typed** `trrVendorSupported:boolean`, `trrConfigured:boolean` for TRR only. If mode=PRAC or RFM then `featureState=(dramFeatureSupported&&controllerFeatureSupported&&firmwareConfigured)?'CONFIGURED_NOT_CERTIFIED':'FEATURE_UNAVAILABLE'`. If mode=TRR then `featureState=(trrVendorSupported&&trrConfigured)?'RISK_REDUCED_NOT_CERTIFIED':'FEATURE_UNAVAILABLE'`; neither TRR branch depends on the other 3 toggles nor retroactively enables PRAC. Example DRAM=true,controller=false,firmware=true,TRR vendor=true,TRR configured=true⇒PRAC FEATURE_UNAVAILABLE but TRR RISK_REDUCED_NOT_CERTIFIED. No guarantee in ANY mode. `baseSchedulerCyclesToy=100`,`extraManagementCycles=1|4`, totals101|104 illustrative only. ECC remains reactive independent.
### ② 조작 결과에 따른 교사용 정답·원인별 피드백 (before 비노출)
- **expectedObservation (teacher-only):** PRAC/RFM fictitious profile requires DRAM, memory-controller and firmware feature flags ALL true for CONFIGURED_NOT_CERTIFIED, false for FEATURE_UNAVAILABLE. TRR is a **distinct vendor feature state** requiring only `trrVendorSupported && trrConfigured`, yields RISK_REDUCED_NOT_CERTIFIED and never `protectionGuaranteed=true`. `controllerFeatureSupported=false` alone does not disable TRR when its own supported+configured flags true; it **does disable PRAC/RFM** in this hypothetical profile. Real product interop support and deployment differ; Intel2026 vs Google2025 is date-scoped.
- **teacherExpectedAnswer (gated):** 사례: DRAM feature ON / MC OFF / firmware ON이면 PRAC/RFM 이 교육 모형에서 FEATURE_UNAVAILABLE. 하지만 vendor TRR supported+configured이면 TRR RISK_REDUCED_NOT_CERTIFIED로 별도 표시. PRAC all3 true도 CONFIGURED_NOT_CERTIFIED일 뿐 실기기 방어 인증은 아님. ECC는 오류 발생 후의 검출·정정 별도 계층; 시간 100+1/4=101/104클록도 수업용.
- **correctIncorrectCriteria:** Learner toggles at least two actual independent axes from DRAM/MC/firmware and TRR vendor/configured, demonstrates `PRAC` missing MC=>unavailable vs `TRR` vendor&config true=>risk reduced (not certified), then PRAC all3=>configured not certified. Must keep all protectionGuaranteed NOT_PROVEN, distinguish preventive TRR/RFM/PRAC and reactive ECC without asserting universal feature availability.
- **misconceptions:** [m1] DRAM이 PRAC을 지원하면 메모리 컨트롤러 지원이나 펌웨어 확인이 필요 없어요. / [m2] TRR과 PRAC은 어떤 회사의 모든 DDR5에서 완벽한 보안을 보장해요. / [m3] ECC와 TRR은 모두 DRAM 교란이 발생하기 전에 무조건 전하를 복구하는 동일한 예방 기술이에요.
- **hints L1/L2/L3 (requested only):** [L1] DRAM·컨트롤러·펌웨어 세 곳의 체크박스가 모두 맞나요? / [L2] 기능이 활성화됐다는 것과 실전 모든 경우 검증됐다는 것은 다르죠. / [L3] 오류가 생기기 전 예방과 생긴 뒤 정정을 구분해 봐요.
- **misconceptionFeedback/m1 (gated):** DRAM과 메모리 컨트롤러의 지원 및 펌웨어 활성화가 함께 확인돼야 해요.
- **misconceptionFeedback/m2 (gated):** 보호 기술은 설계·설정·검증 범위가 달라요. 켜짐만으로 모든 행에서 절대 안전하지 않아요.
- **misconceptionFeedback/m3 (gated):** TRR/PRAC/RFM은 예방형 리프레시 관리 계층이고 ECC는 발생한 일부 오류를 사후 검출·정정하는 계층이에요.
- **feedback/correct:** 두 독립 조작으로 물리 원인과 결과 범위를 확인했어요. 이 단순화가 실제 제품 안전성 보증은 아닌 이유를 WHY로 설명해 봐요.
- **displayTextAfterObservation (gated):** 지원·설정이 맞아도 실기기 검증이 별도로 필요해요.
- **speechTextAfterObservation (gated):** 일부 DDR5에 PRAC 같은 기능이 들어가도 컨트롤러와 펌웨어의 연동이 필요해요. 기능 이름 하나만으로 완전한 보안을 약속하진 못하죠.
### ③ 시니어 검증·절대 성립하지 않는 결론
- **physicsAssumptions:** Categorical policy feature availability toy, distinct TRR/RFM/PRAC not implementation-specific thresholds. No access patterns, DRAM command coding or specific security guarantees.
- **seniorDesignReview:** Intel 2026 layered orders and MC/DRAM vs Google2025 report context; RFM/ARFM vs PRAC semantics, TRR limitations, performance/qualification.
- **sourceRefs:** [R3][R5]
- **negativePathTest:** R25-02 reviewer matrix: PRAC DRAMtrue/MCfalse/firmwaretrue⇒FEATURE_UNAVAILABLE; RFM same flags⇒FEATURE_UNAVAILABLE (this course model only); PRAC all3true⇒CONFIGURED_NOT_CERTIFIED, not immunity. TRR trrVendorSupportedtrue/trrConfiguredtrue with unrelated controllerFeatureSupportedfalse⇒RISK_REDUCED_NOT_CERTIFIED; TRR configuredfalse⇒FEATURE_UNAVAILABLE, never impute PRAC/MC readiness to TRR; `protectionGuaranteed=NOT_PROVEN` invariant. No real activation thresholds, hardware protection certification or before Voice leakage, m1-m3 separate corrections.
- **nextHook:** 다음 카드에서 메모리 보호의 또 다른 한계를 찾아봐요.

## 19-S04 · `dram-ecc-single-double-detect` · 비트 오류 두 개가 생기면 ECC가 항상 고칠까요?
### ① 먼저 예상하고 원인을 조작
- **sceneId:** dram-ecc-single-double-detect
- **learningGoal:** 확장 Hamming(8,4) SECDED의 0/1/2/3개 오류 동작을 구분하고 on-die와 시스템 ECC의 보호 경계를 설명한다.
- **priorKnowledge:** 13 binary and parity,02 DRAM cells,09 storage ECC
- **storyHook:** 한 비트는 고쳤는데 두 비트가 동시에 틀리면 어떻게 해야 할까요?
- **question:** 한 비트는 고쳤는데 두 비트가 동시에 틀리면 어떻게 해야 할까요?
- **predictionPrompt (learner-only):** 수업용 SECDED가 한 비트·두 비트·세 비트 오류를 각각 다 고칠 수 있는지 먼저 선택해 보세요.
- **displayTextBeforePrediction:** 수정할 수 있는 오류 개수와 찾을 수 있는 오류 개수는 같을까요?
- **speechTextBeforePrediction:** 오류 비트 수와 ECC 배치 위치를 따로 선택해 보세요. 관찰하기 전에 결과 범위를 예상해 봐요.
- **learnerAction:** Set `toyErrorBits=0|1|2|3`, independently select `eccLayer=onDie|system|both|none` and run toy decoder. Show only syndrome/parity qualitative status after prediction (no executable fault injection). Real ECC codes/bit placements not provided. An onDieOnly toggle cannot grade full-path protection.
- **modelInputs:** Math-only extended Hamming(8,4) SECDED toy, 4 data bits+3 parity bits+1 overall parity, typed `toyErrorBits:0|1|2|3` and `eccLayer:'onDie'|'system'|'both'|'none'`. If eccLayer=`none`, **no ECC syndrome decoder exists** and for 1/2/3 errors return `NOT_OBSERVED_BY_ECC`, not DETECTED or CORRECTED; for 0 return `NO_ECC_DECODER`, not measured-clean guarantee. If eccLayer=onDie|system|both model decoder enabled: 0 CLEAN,1 ONE_CORRECTED,2 TWO_DETECTED_NOT_CORRECTED,3 NOT_GUARANTEED. OnDie alone does NOT mark end-to-end CPU memory-channel protection. No real vendor ECC code, RowHammer immunity, external detector or device proof.
### ② 조작 결과에 따른 교사용 정답·원인별 피드백 (before 비노출)
- **expectedObservation (teacher-only):** When **toy ECC decoder is present**, 1-bit correctable, 2-bit detected but uncorrectable, ≥3 not guaranteed. `eccLayer=none` must show `NOT_OBSERVED_BY_ECC` for any 1/2/3 error, NOT 2-bit DETECTED: without detector there is no syndrome result. On-die ECC and system ECC protect different scope, neither prevents disturbance or certifies end-to-end safety.
- **teacherExpectedAnswer (gated):** SECDED는 **검출기를 켠 가상 모형에 한해** 1bit 오류 정정,2bit 오류 검출(비정정),3+ 동작 미보장. ECC 없이 eccLayer=none이면 교란이 있었다는 학생용 오류 수치만 사전에 모형에서 제공될 뿐, 기기 자체의 검출 출력은 `NOT_OBSERVED_BY_ECC`. 온다이 ECC와 시스템 ECC는 서로 다른 검증 경계.
- **correctIncorrectCriteria:** Compare toyErrorBits1 vs2 with enabled decoder, then independent `eccLayer='none'` with toyErrorBits2 ⇒ `NOT_OBSERVED_BY_ECC` (not detected/corrected). Distinguish one-bit corrected vs two-bit only detected when decoder present, 3+ not guaranteed and onDie not whole channel. Correct first valid after independent manipulations+WHY.
- **misconceptions:** [m1] SECDED가 한 비트를 고친다면 두 비트나 세 비트도 무조건 동시에 고칠 수 있어요. / [m2] 온다이 ECC가 있는 칩이면 CPU에서 최종적으로 받는 데이터 경로가 전부 보호됐다고 증명된 거예요. / [m3] 오류 정정 기능은 RowHammer의 전기적 간섭 자체를 물리적으로 100% 차단해요.
- **hints L1/L2/L3 (requested only):** [L1] Single Error Correction / Double Error Detection 이름을 읽어봐요. / [L2] ECC가 칩 내부와 컨트롤러에 각각 존재할 수 있어요. / [L3] 이미 생긴 비트 오류를 처리하는 것과 교란 원인을 없애는 것은 달라요.
- **misconceptionFeedback/m1 (gated):** 수업용 SECDED는 한 비트 정정, 두 비트 검출까지만 보장해요. 세 비트 이상은 미보장 상태예요.
- **misconceptionFeedback/m2 (gated):** 온다이 ECC는 DRAM 내부의 일부 오류를 다루고 시스템 ECC는 컨트롤러 경로의 다른 문제를 다룰 수 있어요. 같은 범위가 아니에요.
- **misconceptionFeedback/m3 (gated):** ECC는 발생한 오류를 다루는 기술이에요. 전기적 간섭 자체는 별도 완화와 검증이 필요해요.
- **feedback/correct:** 두 독립 조작으로 물리 원인과 결과 범위를 확인했어요. 이 단순화가 실제 제품 안전성 보증은 아닌 이유를 WHY로 설명해 봐요.
- **displayTextAfterObservation (gated):** 검출과 정정, DRAM 내부와 시스템 경계는 각각 달라요.
- **speechTextAfterObservation (gated):** SECDED는 한 비트 정정과 두 비트 검출을 예로 보여 주는 수업이에요. 많은 비트가 함께 틀리거나 인터페이스 문제가 있으면 보호 범위가 달라질 수 있어요.
### ③ 시니어 검증·절대 성립하지 않는 결론
- **physicsAssumptions:** Hamming(8,4) ideal mathematical toy, actual vendor ECC/Chipkill/bit interleaving and telemetry unmodeled; no fault injection or security cert.
- **seniorDesignReview:** SECDED syndrome/overall parity cases, correlated multi-bit limitations, on-die ECC cannot be automatically equated with system ECC.
- **sourceRefs:** [R3][R6]
- **negativePathTest:** R25 P2 ECC none: toyErrorBits2 +eccLayer none MUST output `NOT_OBSERVED_BY_ECC`, never `TWO_DETECTED_NOT_CORRECTED`; errorBits1 none similarly unobserved and 0 none `NO_ECC_DECODER`. Enabled toy SECDED decoder errorBits1 =>ONE_CORRECTED;2=>TWO_DETECTED_NOT_CORRECTED;3=>NOT_GUARANTEED; no guaranteed actual DDR5/RowHammer correction.
- **nextHook:** 다음 카드에서 메모리 보호의 또 다른 한계를 찾아봐요.

## 19-S05 · `dram-fleet-ecc-alert-isolation` · ECC 경고가 다섯 배라면 바로 해킹이 확정일까요?
### ① 먼저 예상하고 원인을 조작
- **sceneId:** dram-fleet-ecc-alert-isolation
- **learningGoal:** 공통 분모의 CE 경고율과 UE 분기·격리 조치를 계산해 경고 증거와 실제 RowHammer 원인·서버 SLO 영향 평가를 분리한다.
- **priorKnowledge:** 13 SLI and denominators,10+32 SLO/fault tolerance,19-S04 ECC
- **storyHook:** 두 서버의 메모리 오류 경고가 2건과 10건이에요. 어느 쪽을 먼저 살펴야 하고 이유는 뭘까요?
- **question:** 두 서버의 메모리 오류 경고가 2건과 10건이에요. 어느 쪽을 먼저 살펴야 하고 이유는 뭘까요?
- **predictionPrompt (learner-only):** 같은 검사 백만 건에서 정정 가능한 오류 2건과 10건이면 비율이 몇 배인지 예상하고, 이것만으로 공격 원인을 확정할 수 있는지 고르세요.
- **displayTextBeforePrediction:** 정정된 오류의 양과 원인의 확신은 같은 값일까요?
- **speechTextBeforePrediction:** 서버가 검사한 전체 건수와 오류 수를 따로 바꿔봐요. 정정 불가능 경고도 켜서 결과를 예상해 보세요.
- **learnerAction:** Change `correctedEvents=2|10`, `checks=1_000_000|2_000_000` independently and `uncorrectableEvent=true|false`. Derive CE rate per million checks and compare classroom alert threshold5; high CE=>INVESTIGATE, UE=>ESCALATE_RESTORE even if CE low. Choosing 'ATTACK_CONFIRMED' is invalid; after changing denominator recalc instead of stale count.
- **modelInputs:** correctedEvents=2|10, checkedOperations=1e6|2e6, normalizedPerMillion=(CE/checks)*1e6, threshold5 per-million toy. CE2/1e6=>2; CE10/1e6=>10 (ratio5); CE10/2e6=>5; if UE=true status=ESCALATE_RECOVERY regardless of CE, else status=INVESTIGATE when rate>=5, otherwise MONITOR. sourceAttribution=UNKNOWN in every case and no real platform SLA guarantee.
### ② 조작 결과에 따른 교사용 정답·원인별 피드백 (before 비노출)
- **expectedObservation (teacher-only):** One million equal-size samples 2 vs10 corrected errors implies rate ratio5; fictional threshold5 flags only high group. Changing denominator from1M to2M halves rate. Even 10 errors does not establish RowHammer or malicious actor; any UE should trigger fault-domain containment/recovery review independent of CE threshold.
- **teacherExpectedAnswer (gated):** One million equal-size samples 2 vs10 corrected errors implies rate ratio5; fictional threshold5 flags only high group. Changing denominator from1M to2M halves rate. Even 10 errors does not establish RowHammer or malicious actor; any UE should trigger fault-domain containment/recovery review independent of CE threshold.
- **correctIncorrectCriteria:** Use two independent count/denominator states and UE toggle, correct normalized metrics + action, reject cause attribution and unconditional security claims.
- **misconceptions:** [m1] 같은 분모에서 오류10건과2건은 위험률이 정확히 두 배예요. / [m2] ECC 경고가 늘면 반드시 누군가 RowHammer를 공격한 것으로 확정돼요. / [m3] 정정 불가능한 오류 UE가 떠도 정정 가능한 오류율이 임계값 아래면 그냥 무시해도 돼요.
- **hints L1/L2/L3 (requested only):** [L1] 10을2로 나누어 볼까요? / [L2] ECC 카운터는 물리적 원인 판별기인가요? / [L3] 정정 가능한 오류 CE와 정정 불가능한 UE는 별도 상태예요.
- **misconceptionFeedback/m1 (gated):** 같은 백만 건 기준으로 10/2=5배예요. 단순 건수 비교에서도 분모를 확인해야 해요.
- **misconceptionFeedback/m2 (gated):** 메모리 오류에는 다양한 원인이 있어요. ECC 로그만으로 RowHammer나 공격자를 확정할 수 없어요.
- **misconceptionFeedback/m3 (gated):** UE는 CE 비율과 별도로 격리·복구·조사 판단을 요구할 수 있어요. 숫자가 낮다고 자동 무시하면 안 돼요.
- **feedback/correct:** 두 독립 조작으로 물리 원인과 결과 범위를 확인했어요. 이 단순화가 실제 제품 안전성 보증은 아닌 이유를 WHY로 설명해 봐요.
- **displayTextAfterObservation (gated):** 오류율은 운영 경보를 돕지만 공격 원인의 증거는 따로 필요해요.
- **speechTextAfterObservation (gated):** 동일한 검사량이라면 정정 오류 열 건은 두 건의 다섯 배예요. 하지만 이것만으로 해킹을 확정할 수 없고 정정 불가능한 오류는 별도 사고 대응이 필요하죠.
### ③ 시니어 검증·절대 성립하지 않는 결론
- **physicsAssumptions:** Pure toy equal measurement windows and logged error definitions; real server CE rates, firmware RAS reporting and vendor procedures differ; no actual attack diagnostic.
- **seniorDesignReview:** Intel platform defense-in-depth, DIMM BIOS/memory controller compatibility, telemetry CE/UE triage, failover and app RTO/RPO/SLO.
- **sourceRefs:** [R3][R5]
- **negativePathTest:** grader must reject the distinct physical cause of each m1/m2/m3, not a visited-state token; correct-first after two independent actually changed controls+WHY succeeds, after answer audio/DOM/ARIA never leaked pre-prediction. No hardware access frequency, real victim mapping or real attacks. A07 reviewer before A05 physical 2.5D.
- **nextHook:** 32 AI 데이터센터 장애복구와 전체 SLO에 이 경보를 연결해 볼까요?

## Independent A07 source-science test matrix and A05 downstream scene QA
| Step | Toy truth only | Negative state must be rejected |
|---|---|---|
| 19-S01 | normal margin10−3=7≥5 vs disturbed10−3−3=4<5, conceptual refresh after epoch2 =>8 | refresh not guaranteed full RowHammer immunity, tokens not real ACT counts |
| 19-S02 | potential distance2 means neighbor-only protection=>COVERAGE_UNCERTAIN, broader toy review not product secure | all chips distance2 flip, software addresses equal physical row map |
| 19-S03 | DRAM+controller+firmware support ALL required for PRAC/RFM CONFIGURED_NOT_CERTIFIED; otherwise FEATURE_UNAVAILABLE | all DDR5 immune, TRR=PRAC=ECC, product guaranteed |
| 19-S04 | toy Hamming(8,4) SECDED: one corrected, two detected not corrected, >=3 NOT_GUARANTEED; on-die not system | multi-bit arbitrary guaranteed correction, physical disturbance prevented |
| 19-S05 | same 1e6 checks corrected events2 vs10=>factor5, UE forces escalation regardless of CE | RowHammer attack attribution from CE alone, ignore UE |
- P1 NEXT:A07 independently verify official source dates Intel2026/Google2025, exact scene model/learning objectives, before answers hidden, 15 distinct messages and non-operational safety, PASS/MAJOR with exact blob to A06 #6 and #53. P1 only after PASS A06→A05 five original scene handoff #4; A05 typed 2.5D/Chrome+Voice+aria negative scenarios/CI screenshots and A02 app E2E separate.
## Source register (checkedAt 2026-10-17)
[R1] Kim et al. IEEE ISCA2014 https://ieeexplore.ieee.org/document/6853210/
[R2] Google Half-Double 2021 https://security.googleblog.com/2021/05/introducing-half-double-new-hammering.html
[R3] Intel RowHammer exposure guidance UPDATED 2026-07-20 https://www.intel.com/content/www/us/en/developer/articles/technical/software-security-guidance/best-practices/reducing-exposure-to-rowhammer.html
[R4] USENIX 2022 Half-Double https://www.usenix.org/conference/usenixsecurity22/presentation/kogler-half-double
[R5] Google DRAM RowHammer mitigation Sept2025 https://blog.google/security/supporting-rowhammer-research-to/
[R6] IEEE ECC research https://doi.org/10.1109/SP.2019.00089 plus ideal Hamming parity teaching math, not a licensed DDR5 implementation.

## A06 R25 source model correction · 2026-10-17
- [Independent A07 R25 first science/edu audit](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-25-lesson19-rowhammer-ecc-first-source-audit.md) on old source `152c7697` SCIENCE/MATH_PASS 5/5, but 2 grade/state MAJOR R25-01/02 + ECC-none P2. A06 new canonical story repairs epoch1 scheduled token1 vs3 ambiguity (`appliedTokens=min(epochCount,plannedTokens)`), `REFRESH_NOT_REACHED` for future epoch2, TRR independent `trrVendorSupported/trrConfigured` and predictable branch vs PRAC/RFM fictional three gates, and no-ECC decoder `NOT_OBSERVED_BY_ECC` instead of magically detected. Explicit negative acceptance and toy assumptions; no physical RowHammer procedures. All new SHA independent A07 EDU_SOURCE_RECHECK pending before A05 story handoff.
