# A07 Round 33 · Lesson 24 & Lesson 28 independent SOURCE science/pedagogy review
2026-10-18 KST · A07 takeover continuation after Round32. **STATIC SOURCE REVIEW only; no student/browser/real TTS/ARIA render/hardware verification.** Main merge/deploy HOLD.

## Immutable intake
- L24 [Draft PR #67](https://github.com/Junebooky/interactive-engineering/pull/67), branch `content/a06-lesson24-adc-mems-optics-takeover`: student `a76fcc422f62988ee10456353c99b32c72b52c0e`, senior `2a031b0baf9205dfb3075119904174f9c9f061aa`; card [#66](https://github.com/Junebooky/interactive-engineering/issues/66).
- L28 [Draft PR #77](https://github.com/Junebooky/interactive-engineering/pull/77), branch `content/a06-lesson28-ucie-chiplet-takeover`: student `73fbb7168c79b9c197a9dfbeff0a32960b6dc16d`, senior `69f7ce63f95ba8a7582b4a6003c5e11e4f564837`; card [#74](https://github.com/Junebooky/interactive-engineering/issues/74).
- **RESULT: REVIEW_PERFORMED [x]; L24 EDU_QA_PASS_SOURCE [ ]; L28 EDU_QA_PASS_SOURCE [ ]. Both `P1 MAJOR_SOURCE_OPEN` pending A06 text/contract changes then new exact blob-SHA A07 recheck.** No A05 STORY_READY on these sources.

## L24 physical/teaching results
[x] Static source five unique sceneIDs and pre/post Voice + three individually keyed misconception texts each (15 across five); separate typed control axes; toy vs real caveats. These describe a *planned* state machine only, not verified DOM/ARIA/Voice behavior.
[x] Independently recomputed representative 7 exact fixture assertions: 700Hz/1000sps→300Hz;700/2000→700;3.3V/256→12.890625mV;3.3V/4096→0.8056640625mV;2×2g×0.04pF/g→0.16pF;1mW×0.6A/W→0.6mA;1mW·10^(-3/10)→0.5011872336mW. Confirmed senior note distinctions: Nyquist/anti-alias filtering, ideal nominal LSB≠measured ENOB, MEMS k-calibration, W↔mW, positive loss dB and unknown receiver BER.

### [ ] L24-MAJOR-01 (P1) question asks unanswerable receiver sufficiency
- Student `24-S05` lines ~157-172: title/question **“레이저가 켜졌다면 저쪽 서버도 빛을 충분히 받을까요?”**, but typed `modelOutputs` provides only received optical power and explicitly `bitErrorRate:'NOT_MEASURED'`; there is **no receiver sensitivity, BER requirement, link margin, detector/noise or threshold**. Therefore the scene cannot determine “충분히 받는가 / 통신 성공인가” from mW alone. Current criteria also asks emission physics distinction that no source-type manipulated physics demonstrates (it is an explanatory tab only).
- **A06 replacement (keep toy numbers/formula unchanged):**
  - `question`: **“광섬유를 지나면 빛의 양은 얼마나 달라질까요?”**
  - `storyHook`: **“광섬유로 들어간 빛이 1mW라고 해요. 연결부와 광섬유에서 빛이 줄어든다면 끝에는 얼마나 남을까요?”** (specifically *launched*, not original diode electrical/optical output).
  - `learningGoal`: **“광섬유에 들어간 광파워와 경로 손실(dB)을 각각 바꿔 도착 광파워를 계산하고, 계산된 전력만으로 수신 성공을 판단할 수 없음을 설명한다.”** Move LED spontaneous emission/laser stimulated emission contrast to optional **post-observation** explanation, not assessed by an unobservable LED/laser slider.
  - `correctIncorrectCriteria`: **“송신 광파워·수동 손실을 독립 조작해 1mW/3dB≈0.501mW,1mW/6dB≈0.251mW 비교; BER, 감도, 수신 성공은 NOT_MEASURED로 답한다.”**
  - `speechTextBeforePrediction`: **“광섬유에 들어간 빛의 양과 경로 손실을 바꿔, 끝에 얼마나 남을지 예상해 보세요.”**
  - `speechTextAfterObservation`: **“3데시벨의 손실이 있으면 빛의 힘이 거의 절반으로 줄어요. 다만 이 숫자만으로 통신 성공까지 알 수는 없어요.”**
- Acceptance: pre prediction/ARIA/Voice must not imply valid complete link; any “receiver sufficient?” task must either be removed or add receiver threshold **as a separate later lesson/test**, not invent one silently.

### [ ] L24-P2-02 (non-blocking copy)
`24-S03` question **“손으로 움직이면 왜 칩 속 전기 눈금이 바뀔까요?”** blurs position/constant velocity with measured **acceleration**. Prefer “칩이 가속될 때 안쪽 질량이 왜 한쪽으로 치우칠까요?” with qualifier local spring-mass dynamic response and gravity/orientation. Measured `g` is gravitational acceleration unit, not gram mass. Keep toy `Cleft/right=2±ka` only as calibrated stationary/local relation.

## L28 physical/teaching results
[x] Five unique source sceneIDs, 5 neutral Before/5 gated After Voice, 15 distinct m1/m2/m3 feedback, two typed axes and explicit event/trial guard described. **Source-level intent, not implementation audit.** 4 representative numerical asserts independently evaluated: 2×x16×64 GT/s ÷ 8 = 256 **decimal GB/s**, one direction raw; shared endpoints 64/32→candidate 32 GT/s pending toy TRAIN event; 16×32e9×1e−12 = 0.512 W and 16×64e9×0.5e−12=0.512W (fictional active link, NOT package power). RetryOff/corrupt=unrecovered, retryOn/corrupt=pending until explicit retry described coherently in source.
[x] Official UCIe Consortium press release: v3.0 August 5 2025; 48/64 GT/s *supported rates* not shipping SKU promise. CXL.cache and CXL.mem roles distinct, UCIe physical route not automatically CXL coherence/security.

### [ ] L28-MAJOR-01 (P1) CXL.cache direction / actor ambiguity in beginner prose
- `28-S03` student `storyHook`: **“CPU 캐시가 메모리 일관성을 확인할 때”**; `expectedObservation`: **“CPU 캐시의 일관성 읽기”**; `misconceptions/m2`: **“CPU 캐시의 일관성 있는 읽기 권한”**. Such wording treats “CPU cache reading memory” as the main CXL.cache role. The official CXL Consortium description is that **a CXL device accesses host processor memory with CXL.cache**; **the host accesses device-attached memory with CXL.mem**. The senior text itself gets this right. Misassigning the actor is a wrong mental model even though generic raw-vs-protocol warning is correct.
- **A06 replacement (do not alter toy request/outcomes without new spec):**
  - `storyHook`: **“칩렛 장치가 센서 데이터를 보내는 일과, 호스트 메모리를 일관성 있게 읽는 일은 같을까요?”**
  - `question`: **“전기적으로 이어졌다면 어떤 데이터 요청도 저절로 통할까요?”**
  - `expectedObservation/teacherExpectedAnswer/displayTextAfterObservation`: **“UCIe는 칩렛 사이의 전기적 연결을 도와줘요. CXL.cache는 장치가 호스트 메모리에 일관성 있게 접근할 때 쓰는 별도 프로토콜이에요. 호스트가 장치 메모리에 접근하는 CXL.mem과도 달라요. 이 모형에서 요청 종류가 맞아도 실제 접근 권한이나 성공은 확인하지 않았어요.”**
  - `speechTextAfterObservation`: **“길이 연결된 것만으로는 충분하지 않아요. 장치가 호스트 메모리를 다루려면 CXL 캐시 같은 규칙이 더 필요해요. 여기서는 실제 읽기 성공까지 확인한 게 아니에요.”**
  - `misconceptions/m2`: **“원시 스트림을 보내면 칩렛 장치가 호스트 메모리를 일관성 있게 읽을 권한도 자동으로 얻는다.”**
  - `misconceptionFeedback/m2`: **“Raw 바이트 전송과 CXL.cache 프로토콜·실제 메모리 접근 권한은 별개예요.”**
- Preserve `PROTOCOL_ROUTE_POSSIBLE` (not delivered/authenticated), `NOT_VERIFIED`, explicit `SEND_REQUEST` snapshot, no false CXL hardware certification.

### [ ] L28-P2-02 (non-blocking wording)
`28-S02` 48 GT/s omitted from *toy slider* while included in supported `{32,48,64}`: keep conspicuous “수업 선택지는 32·64뿐, 표준에는 48도 있다” post-explanation; do not teach the simplified min() as universal physical training proof.

## CROSS-LESSON acceptance | A03 V4 #79 (blocking before A05 handoff)
[ ] Guard **L3 hints and teacher result strings after prediction and only on explicit request**; unguarded `hint L3` contains the exact 300Hz / 0.501mW / 0.512W results, and `requestHint` needs explicit minimum-phase authorization in scene/app API. **This is a requirement/check, not an observed DOM leak:** these are markdown source specs, not React rendering evidence.
[ ] One student action + one plain-Korean short question per viewport; optional deep explanation only on demand; inspect scene BEFORE prediction with safe hotspots; no result, teacher WHY, hint L3, aria-label, tooltip or speech leak before earned observation/grade. A06/A02/A05 must coordinate typed `hintAvailableAfterPrediction` and `teacherAnswerAvailableAfterObserveAndReason`.
[ ] Re-run immutable SHA review on A06 revised two pairs, 5 positive + 15 negative path scenario contracts per lesson; A05 after PASS must demonstrate real Chromium 1440/390/320 and DOM/ARIA/Voice screenshots independently. No actual browser/screen reader/student/device validation in this round.

## Evidence
- [Analog Devices anti-aliasing](https://www.analog.com/en/resources/faqs/FAQ_antialiasing_filter.html)
- [Hamamatsu responsivity definition](https://hub.hamamatsu.com/us/en/technical-notes/detector-selection/the-wits-guide-to-selecting-a-photodetector.html)
- [Cisco optical loss dB reference](https://www.cisco.com/c/en/us/support/docs/optical/synchronous-digital-hierarchy-sdh/29000-db-29000.html)
- [UCIe Consortium dated releases](https://www.uciexpress.org/press-releases), [UCIe 3.0 recap](https://www.uciexpress.org/post/ucie-at-the-future-of-memory-and-storage-2025)
- [CXL Consortium CXL.cache vs CXL.mem definition](https://computeexpresslink.org/blog/the-benefits-of-serial-attached-memory-with-compute-express-link-2349/)
- [A03 V4 learning contract #79](https://github.com/Junebooky/interactive-engineering/issues/79)
- [A07 last Round32 A05 9/10 source, SRAM BL open](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-32-a05-p0-v3-concept-structures-science-audit.md)

## Assignment
P1 NEXT **A06** edits original student and senior docs (or verifies senior unchanged), supplies **new actual student blob SHA** and self-QA; **A07** re-review new blobs and record clear `EDU_QA_PASS_SOURCE` only after fixes. AFTER source PASS, A06 sends exact A05 handoff on #4, A05 scene/browser, A02 integrated app. Existing SRAM diagram MAJOR on PR#78 stays independently OPEN. Owner release HOLD.
