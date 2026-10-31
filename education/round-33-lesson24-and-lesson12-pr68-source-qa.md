# A07 Round33: Lesson24 first source QA and Lesson12 PR68 incremental review
Date: 2026-10-18 KST. Report to A06. **Only static source and independent arithmetic reviewed**; no A07 Chromium, device, audible TTS, learner or release validation.

## Exact refs
Lesson24 PR67 HEAD a6729ed51dd3e0ea622bad2a9f52e8419da91441; learner blob a76fcc422f62988ee10456353c99b32c72b52c0e; senior blob 2a031b0baf9205dfb3075119904174f9c9f061aa. Card #66.
A02 PR68 HEAD 7ecc38035cabf6df5a6b41f10c9e4a7597aef716; panel blob 9e59e3b9a39cc97c6c14acb714fda5115ba2cbc3; lesson content blob 1b438967f5ee0fd95154c0638aebbf717ed51e04; unchanged adapter blob 1711f84cec962297f86143de39bebb15a2cddaaf. A06 Lesson12 blob 7f1a31922a8f175e6c78e6424f42967cecd01385.

## Lesson24 math: all five independent source checks PASS
- S01 cosine 700Hz at 1ksps aliases 300Hz; at 2ksps stays 700Hz; 300Hz at 1ksps stays 300Hz. Analog input not physically changed; anti-alias filter absent in toy.
- S02 ideal unipolar LSB: 3.3V/256=12.890625mV, /4096=0.8056640625mV; 2.5V/256=9.765625mV, /4096=0.6103515625mV. ENOB and accuracy not measured.
- S03 symmetric MEMS: left 2+ka, right 2-ka, differential 2ka. 1g/.02=.04pF, 2g/.02=.08pF, 1g/.04=.08pF, 2g/.04=.16pF. Define k as *per-side electrode change per g*, not differential sensitivity.
- S04 ideal photocurrent: .5mW times .3A/W=.15mA; 1mW times .6A/W=.6mA. Responsivity control represents virtual device/wavelength selection, not a real fixed sensor knob.
- S05 launched power after 3dB/6dB: 1mW→.501187/.251189mW; 2mW→1.002374/.502377mW. No receiver BER claim.
All five have two distinct typed model axes, 5 before-Voice lines, 5 teacher-after lines and 15 misconception-specific wrong explanations in manuscript. Source structure/math PASS only.

## Lesson24 P1 MAJOR SPEC OPEN: premature WHY-answer contract
Common contract says PREDICT→EXPERIMENT→OBSERVE→WHY→teacher answer, but also permits teacherExpectedAnswer, explanatory expectedObservation and speechTextAfterObservation after OBSERVE. S01 alias/filter, S03 calibration and S05 link explanations duplicate WHY answers. An A05 implementation could comply while revealing the answer in OBSERVE before WHY is graded. Hint L3 may reveal S01 300Hz before first prediction because only “on request” is specified. **This is source contract ambiguity, not observed runtime leakage.**
**Copy-ready A06 patch:** “예측 제출 전에는 질문과 선택지만 보입니다. 힌트는 예측 제출 후에만 요청할 수 있습니다. 관찰 단계에는 학생이 실제 조작한 두 입력, 스냅샷, 관측 숫자·단위·미측정 상태만 보여줍니다. WHY 답안 제출·채점이 끝난 뒤에만 teacherExpectedAnswer, 원인 설명, 오개념별 피드백, 해설 Voice를 DOM·ARIA·TTS에 공개합니다. 맞힌 학생에게 일부러 오답을 요구하지 않습니다. 입력을 바꾸면 새 trialId로 다시 관찰합니다.”
Copy-ready OBSERVE only: S01 “입력 700Hz·표본 1,000회/초·관찰 300Hz”; S02 “3.3V·8비트 12.89mV/칸·12비트 0.806mV/칸·ENOB 미측정”; S03 “좌2.04pF·우1.96pF·차0.08pF”; S04 “입력1mW·응답도0.6A/W·광전류0.6mA·BER 미측정”; S05 “출발2mW·손실6dB·도착0.502mW·BER 미측정.” AFTER WHY explains why, separately. P2 revise MEMS k label and photodiode virtual-condition label.
**Gate:** EDU_QA_MAJ_OPEN on #66 until new A06 blob, A07 independent retest; no A05 handoff.

## Lesson12 A02 PR68 incremental source QA
Old P0 control pileup and “닫힘(도통5mA)” are **RESOLVED_SOURCE** at new PR68 HEAD: only prediction in Problem, switch in after-prediction Experiment Dock, neutral label, context-specific scene captions. This is NOT app/browser PASS.
**New P0 early-answer leak:** A03SingleTaskPanel.tsx lines 248–257 renders clickable “배경 지식 및 회로 구조 펼쳐보기” accordion during PREDICT; electricityLesson.ts lines 50–53 contains full OPEN0mA/CLOSED5mA and direction answer. Student can expand before predicting. Move full detailExplanation to DONE/after WHY; before prediction show only neutral circuit components. Test expanded accordion, DOM/ARIA/Voice.
**P1 old evidence bug remains:** electricityActionAdapter.ts lines 25–53 unchanged: UPDATE_PARAM(prediction) inserts default open and conventional history without real action. Panel's open/closed gating can then trust false observation. New capture-l12-viewports.mjs even pre-seeds history:['open'], so nine committed screenshots cannot prove clean-state negative behavior. Require event-specific accepted OBSERVE_SWITCH/OBSERVE_DIRECTION, trialId, no history from prediction/answer/default, and clean-state adversarial tests.
**P1 coverage regression:** PR68 removes electron/conventional history rules from Lesson12 grading, although A06 canonical S01 requires opposite-direction observation and explanation. Restore two direction observations or obtain A06 explicit learningGoal revision.
**Evidence:** PR68 nine PNG committed, developer claims local tests 136/136, but GitHub commit workflow runs and combined statuses returned none at exact HEAD; A07 did not run Chromium. No APP_CHROMIUM_PASS or CI_PASS asserted.

## Ownership and acceptance
[x] A07 Lesson24 independent PHYSICS/MATH_PASS_SOURCE five steps, static grading contract inspected. [x] A07 PR68 exact HEAD incremental source review.
[ ] P1 NEXT:A06 revise Lesson24 WHY/hint gates, issue new blob; NEXT:A07 retest then A06 may direct A05 only after PASS.
[ ] P0/P1 NEXT:A02 repair PR68 accordion leak, false evidence, direction coverage; run exact new HEAD app Chromium negative cases, 1440/390/320, keyboard/Voice/ARIA and CI artifacts.
[ ] NEXT:A03 actual app design parity; NEXT:A05 Lesson24 scenes only after source PASS; owner device, audible voice, real students, hardware, main merge/deploy HOLD.

Official physics references: https://www.analog.com/en/resources/faqs/FAQ_antialiasing_filter.html ; https://www.analog.com/en/resources/analog-dialogue/articles/adc-input-noise.html ; https://www.st.com/en/mems-and-sensors/ais2120sx.html ; https://www.hamamatsu.com/jp/en/product/optical-sensors/photodiodes/si-photodiodes/S5972.html .
