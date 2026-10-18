# A07 Round35 · A03 requested exact-source QA 2026-10-19
Independent GitHub source/line/commit review only. NO A07-run Chromium, real TTS playback, screenreader, silicon testing, or production release approval.

## Immutable evidence

- A02 official Draft PR #73 HEAD: 80a132360ecdf469dbbcca2e722f6d638286ba8e. Panel blob cf26c3a14f9882b6ecf366aa76b8240394cd6790; LessonPlayer blob cb4b41d6ac41088ecc2d0064e3e9eceb6ae1cf36; electricityActionAdapter a3a082166bce181f136ddee71f6436bb2b53bdec; electricityLesson 7132b559d81dcb11d43719999515567933cb17d0; MOSFET lesson 643b73e2d10c390faf9e86cdd679d95d134821a5; learningReducer 3008a56fed6274a5d310c5fb5e91c05726ae56b2; visualRegistry 250ad8a63a0c16e3cfa032a5e7537f19d8292860.
- A06 Draft PR #81 HEAD d73d10f612d1ae9946b1c571a66e5afd0999892d: L12 student blob 8b9f1c771adeeabeaad05b75b4b24cdf1872857d, stage/Voice visibility contract dfb96dfdaac1abd68fc76c9b67cd93641d00977a.
- A05 concept Draft PR #78 HEAD 6ab410577c2bb18be06e2fc1a576b7b6dfcac77b, visual blob 5e9790886a2a15c166791511d792933a1abae5ba.
- A05 34 scene geometry Draft PR #83 HEAD eb040ddde31529a332e502a9cb9d1b85e3e1e509, geometry blob e8cc03511cd981207ce0c2739674827a9df058a5, geometry Vitest blob 5826387cf8ed3764f7dcef2c6b6f2feafc08feb9.

## R34 A02 retest

- FIX SOURCE VERIFIED: In A03SingleTaskPanel.tsx:205–247, PREDICT no longer mounts full detailExplanation accordion; CONCEPT no longer mounts whyExplanation; CONCEPT spoken intro now explicitly voice.intro or storyLead/prompt rather than success voice (lines 132–145).
- FIX SOURCE VERIFIED: In electricityActionAdapter.ts:37–55, a prediction update does NOT insert default OPEN/CONVENTIONAL tags. Panel missing visited fallback and manual reset also changed to [].
- PARTIAL: Non-electric/non-MOSFET model bubble in LessonPlayer.tsx:495–507 gates full detailExplanation before prediction but physicsAssumptions for each domain still needs science-safe lexical scrutiny. CONCEPT Step0 always renders prompt and detailExplanation at Panel:195–202; L12 source is neutral, but other lessons need a contract.
- NOT YET PASS: CONCEPT still has direct nextStep CTA without INSPECT_PART hotspot. V4 #79 one-safe-touch-first needs A05/A02 implementation plus typed observation-proof exclusion.

## NEW P0 R35-01 CHECK Voice pregrade teacher answer

In A03SingleTaskPanel.tsx:132–145, currentPhase === 'check' selects step.voice?.explanation, and Listen invokes voiceEngine.speak even before submitCheck. The CHECK state is entered by handleObserveDone, BEFORE WHY grading. ElectricityLesson S01 voice.explanation reveals exact OPEN0mA/CLOSED5mA/source-retained5V, MOSFET S01 voice.explanation directly states electrons concentrate into conductive surface path. This is a concrete user-triggered spoken spoiler pathway even though prior PREDICT accordion is gone. Not a claim A07 actually played audio.

NEXT A02: CHECK speech = neutral one-line WHY question, not explanation/success result. Only DONE after genuine correct WHY may speak full teacher explanation. Wrong-grade feedback can be cause-specific but not full teacher WHY. Add React/Voice spy regression for CONCEPT/PREDICT/OBSERVE/CHECK before answer/CHECK wrong/DONE correct on 1440/390/320. DOM/ARIA/tooltip must obey identical phase rules.

## P1 R35-02 fabricated MOSFET observation is not fixed in engine

Panel fallback visited[] is fixed, but immutable learningReducer.ts:150–155 still uses fallback visited:[0] on UPDATE_PARAM vgs/vds/vin and canonical mosfetLesson.ts M01 Step1/2 initialParams still visited:[0]. A new student can therefore change only the high voltage and inherit a fictitious low visit, satisfy lowSeen && highSeen without actually observing both states, and unlock WHY. At least one A05MosfetSceneLab standalone component also initializes visited with [0], but official A02 current Panel+reducer+canonical lesson suffices to reproduce provenance flaw from source.

NEXT A02: initialize visited[] in lesson, reducer fallback[], record explicit low/high PHYSICAL OBSERVE event with immutable episode identity and snapshot, not a default value, prediction, restored stale data or passive hotspot. Negative tests prediction-only/high-only/reset/reload and first-correct-after-valid-real-low+high.

## P1 R35-03 graduated hints are still disclosed together

A03SingleTaskPanel.tsx:410–421 maps every hint level into one CHECK details panel. On one click learner can read L1,L2,L3, including result-bearing L2 (S01 5mA) and direction L3 before explaining. This is user-requested help after predict, not necessarily an involuntary spoiler, but it violates separate progressive hint-request design and is weaker than source phase contract. Implement requestHint(level) once per level with explicit opt-in, keep absent from CONCEPT/PREDICT markup.

## P0 R35-04 MOSFET V4 pre-predict semantics still early

The A02 MOSFET CONCEPT content says applied electric field controls current and introduces conductive path before learner inspection. The current visualRegistry.ts concept entry for step-mosfet-s0-concept explicitly titles “MOSFET 단면 구조와 채널 형성 원리” and subtitiles “게이트 전계가 P형 실리콘 표면에 N형 전도 채널을 여는 원리.” LessonPlayer.tsx:94–106 passes these to the ConceptIntroSceneVisual, whose SVG title/subtitle and accessible label render pre-prediction. This violates V4 #79 explicit safe part names first / no channel result before learner prediction and physical observation, even if the statement itself is physically qualitatively correct. A06 PR#81 only updates Lesson12 safe vocabulary.

NEXT A06 + A02: neutral MOSFET pre-inspection copy “게이트·산화막·소스·드레인을 찾아보세요”; label neutral parts only in SVG/aria/tooltip and speak the same. Reveal field-induced inversion layer/threshold/ID only after real experiment evidence. NEXT A05: scientifically accurate 44px keyboard hotspots must not mint electrical observation.

## A06 PR#81 Lesson12 source independent EDU_COPY_SOURCE_PASS_SCOPED

New student S00 definitions V=J/C and I=C/s; fixed 5V source / 1kΩ resistor are explicit given stimuli, not observed outcomes. S00 removes OPEN0 / CLOSED5 / maintained ideal source 5 V teacher results and switches no experiment in its own copy. S01 teacher data still correctly distinguishes OPEN current0, resistor drop0 at steady DC, ideal voltage source terminals5V, CLOSED5mA, electron vs conventional motion, under documented ideal conditions. S00 non-assessed does not inflate four assessed stages. App CHECK Voice and other lessons remain separate blocks. The long S00 prompt still violates V4 microlearning brevity, non-physical editorial P1.

## A05 PR#78 R32-01 SRAM 6T source science RESOLVED

Previous R32 nine domains source-science passed. New source visual SRAM left BL trace M38 106V159 + M38 159H63 ends on exterior left access FET x63,y159. Right complementary BLbar M620 106V159 + M597 159H620 ends right access FET x597,y159. Internal Q-to-access wires x133→161 and x493→522 remain; common gate WL M98 126V92H557V126 touches upper gate terminals and does not geometrically intersect either BL (external x38/x620). No Q stored value or current displayed before student prediction; independent wiring source test asserts all traces, not just BL text. Compare 375a9d5...old→6ab4105...new changed only SRAM/concept SVG, bounds metadata, tests, screenshot script; the other nine science structures have no new factual changes. Therefore R32-01 SOURCE_FIX_PASS; **10/10 qualitative CONCEPT SVG science SOURCE_PASS** within simplified representation, not formal circuit-netlist, A07-run Chromium, official A02 integration, or native device approval.

## A05 PR#83 source geometry consistency scoped PASS, app still NOT PASS

Authored A05_INTERACTIVE_WORLD_BOUNDS contains 34 public simulatorType entries with subject/essential label/stable SVG coordinates and no implied cross-device physical scale. Tests ensure each box lies within native SVG viewBox, four MOSFET sample renderer groups exist and readouts separate; visual patches wrap physics+label geometry inside SVG g groups for MOSFET/electricity/PN/MOS14/DRAM/SRAM/NAND/GPU. Original numerical physics models not modified.

P1 NEXT A05+A02: **public simulatorType vs renderer-native sceneId mismatch**. Bounds map has elec-charge-current, pn-band-gap, mos14-oxide-field; native g data-scene-id from LessonPlayer mapping is charge-voltage-current-arrows, semiconductor-band-gap, mos-oxide-field-without-dc-path. Any exact data-scene-id=simulatorType query misses the native group. Add typed rendererSceneId alias and test all34 public-to-native lookups, not just MOSFET.

P0 NEXT A02: current SceneViewport.tsx uses DIV proxy data-scene-subject=true, measures child svg/getBoundingClientRect, scales entire React renderer; it does not consume A05 true nested SVG g native getBBox+getScreenCTM with label union. Thus PASS of A05 authored world bounds cannot certify A02 optical object scale/labels/readout separation at 390/320. NEXT A08/A03 actual app equal-stage screenshot and science-label clipping inspection.

## Final status / direct owners

A06_L12_EDU_COPY_SOURCE_PASS_SCOPED. A05_PR78_TEN_CONCEPT_SCIENCE_SOURCE_PASS, R32 SRAM blocker CLOSED at exact6ab410... A05_PR83_BOUNDS_SOURCE_CONTRACT_PASS_SCOPED, typed alias and real camera integration OPEN. **A02_PR73_EDU_APP_SOURCE_BLOCKER_OPEN** (CHECK TTS teacher-answer exposure, phantom visits, V4 concept outcome spoilers). No A07-run live DOM/speech/Chromium; A02 owns new exact HEAD E2E; A06 owns safe fields and MOSFET microcopy; A05 geometry; A03 design signoff; owner iOS/screen reader/learners/merge/deploy HOLD.
