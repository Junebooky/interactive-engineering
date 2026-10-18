# A07 Round13 · Issue#41 / A02 PR#44 Korean engineering Voice normalization and 2026 TTS vendor factual QA
**2026-10-17 KST.** A07 independently inspected **A02 actual PR#44** HEAD **`6c48cbfbf9e81d6967962bcf5bb7fa7c7cc09510`** (branch `feat/a02-14-mos-capacitor-integration`), `src/lib/voice/textNormalizer.ts` exact blob **`a24c0b9817dc59d847aedf23ab44f6de27cd8bf3`**, `docs/tts-neural-voice-comparison.md` blob **`9efb5c4d35e90261728cecec836320f640a0ca9a`**. Scope **source/regex science semantics, current public official docs factcheck only**, not actual audible Chrome/Edge/Safari speech or A06 requested 10–20 scripted narration examples (await author blob). No commercial TTS API/key/contract was used, no approval to spend or deploy.

## Verdict
**P1 MAJOR_OPEN Voice science pronunciation correctness**, even if existing A02 Chromium visual widget and Vitest pass. A07 did not run full TS application or live speech audio. A02 owns textNormalizer technical fixes and actual browser/Voice QA, A06 owns human teacher utterance/copy; A07 independently rechecks new source and exact A06 scripted voice blob. No A01 per-lesson approval or main merge/deploy.

### R13-01 P1 `6T SRAM` → invented mechanical “6개 치차 SRAM”
Source rule near bottom:
```ts
.replace(/(\d+(?:\.\d+)?)\s*T(?![a-zA-Z])/g, '$1개 치차')
```
For actual source text `6T SRAM`, **direct JS .replace reproduces exact `6개 치차 SRAM`**, but SRAM 6T=**six-transistor static RAM bit cell**, not “six gear teeth”. Bare scientific `T` can also be tesla, a metric unit for magnetic flux density, and cannot be globally mapped to “gear teeth” or transistor. In curricula 05 SRAM this is a **misstatement of the defining 6T circuit**.
**A02 ready-to-paste mitigation:** remove *global T rule* entirely; add **context-bound** SRAM cell grammar `6T SRAM`→`6트랜지스터 에스램` before generic SRAM acronym normalization; if speaking T as physical tesla require explicit `T (테슬라)` content/unit context instead. Negative tests: 6T SRAM never “치차”; 8T SRAM cell may mean eight transistors but only if context; 2 T magnetic flux density must read tesla rather than teeth; bare 40 T ambiguous → preserve or request context, never silently invent.

### R13-02 P1 VGS/VDS lose **relative-to-source voltage reference**
Current `textNormalizer.ts` rules:
```ts
.replace(/V_GS|Vgs|V_gs\b/gi, '게이트 전압')
.replace(/V_DS|Vds|V_ds\b/gi, '드레인 전압')
```
Direct JS reproductions `VGS=1.2 V`→`게이트 전압=1.2 V`; `VDS=0.5 V`→`드레인 전압=0.5 V`. This is **scientifically incomplete**: VGS is **gate-to-source potential difference**, VDS **drain-to-source**, not absolute gate/drain-to-ground voltage; MOS gate/source/body bias and drain current lessons explicitly require this. If source not at 0V, the omission alters a core lesson fact.
**A02 ready correction:** `VGS`→`게이트와 소스 사이 전압`, `VDS`→`드레인과 소스 사이 전압`, preserve exact subscripts in canvas text. Also `V_GB`→`게이트와 바디 사이 전압` (already close) and `V_BS`→`바디와 소스 사이 전압`. Correct actual spoken unit after context (no double “전압 전압”).

### R13-03 P1 malformed alternation drops numeric-unit binding (microamperes / kilo-ohms)
Current regex:
```ts
.replace(/(\d+(?:\.\d+)?)\s*uA|[µμ]A(?![a-zA-Z])/g, '$1 마이크로암페어')
.replace(/(\d+(?:\.\d+)?)\s*kΩ|kOhm/gi, '$1 킬로옴')
```
Both alternatives are outside a grouped capture, so the entire-number capture is **not applied** for the right-hand alternative. Reproduced by identical JS regex:
- `10 µA`→`10  마이크로암페어` (number left separate, captured $1 empty; TTS may pause/misassign unit)
- `3 kOhm`→`3  킬로옴` (lossy grouping/spoken pause, other text can match `kOhm` anywhere)
Both are high-risk for electronics beginner narration and scientific unit mapping. **Fix:**
```ts
.replace(/(\d+(?:\.\d+)?)\s*(?:uA|[µμ]A)(?![a-zA-Z])/g, '$1 마이크로암페어')
.replace(/(\d+(?:\.\d+)?)\s*(?:kΩ|kOhm)(?![a-zA-Z])/gi, '$1 킬로옴')
.replace(/(\d+(?:\.\d+)?)\s*(?:MΩ|MOhm)(?![a-zA-Z])/gi, '$1 메가옴')
```
Add tests for **all spellings** 10uA,10µA,10μA, 3kΩ,3kOhm, 4MΩ,4MOhm, and watch no erroneous substring matches with adjacent identifiers. Use strong delimiter/word boundary where feasible and add locale speech pronunciation after normalization.

### R13-04 P2 2026-10-17 TTS vendor comparison contains outdated deprecation/overconfident benchmark
The comparison doc presents `tts-1`/`tts-1-hd` as a generic OpenAI future vendor candidate without mentioning their current deprecation. **Official OpenAI deprecations dated 2026-10-01** list `tts-1` & `tts-1-hd` shutdown **2027-01-06** and recommend migration to `gpt-realtime-2.1-mini`. Source: https://developers.openai.com/api/docs/deprecations . Official TTS docs also describe `gpt-4o-mini-tts` and speech voices/language limitations: https://developers.openai.com/api/docs/guides/text-to-speech . Do not assume that old price/model descriptions are a future-proof architecture in October2026.
Other unsupported comparative qualitative or numerical claims include “WebSpeech TTFB 0ms”, “Azure delay150-250ms”, “Korean tone best”, “ElevenLabs human-indistinguishable”, generic “permanent cache rights”, and “100% free” batch of cloud API without actually checking current account-specific region/limits/terms. **These aren't supported by a same-input measured A/B**, and even A02 doc states no paid calls/listening. Label them **unverified vendor examples / pricing time-sensitive**, not proven current test results, and check official provider rights/price before owner approval. No vendor ranking until blind Korean listening controlled tests; **never enable/pay for external TTS without explicit owner permission**.

## Concrete QA acceptance matrix (A02 owner)
- **P1 unit scientific negative**: input `6T SRAM` never outputs “치차”, output six-transistor cell; `2 T` magnetic unit not teeth; `VGS=1.2 V` and `VDS=0.5 V` must preserve source-terminal difference; `10 µA` and `3 kOhm` number remains joined semantically with unit; `128×24÷8` reads arithmetic with no accidental unit.
- **P1 Byte vs bit**: `512 GB/s` is **gigabytes per second** vs `18 Gb/s` is **gigabits per second**; math/meaning preserved, no case insensitive rewrite on B/b.
- **P1 negative user interaction**: learner BEFORE prediction TTS never reads `teacherExpectedAnswer` or hidden lab results; after a selected WRONG answer, only that attempted concept hint, not a different unattempted family, may be spoken. Change step while speaking stops old utterance; no speech or visual fallback hides text subtitles.
- **P1 test**: input→normalized string assertions in Vitest; real browser with actual selected ko-KR voices (listen and capture) on latest PR HEAD. The current A02 implementation CI/Chromium claim is preserved but **does not prove these untested scientific negatives**.
- **P2 benchmarks**: model support/price/license/caching verified from current official docs, same Korean corpora A/B listening if authorized, record model/version, time, file format and privacy; spend 0 before explicit owner approval.

## Handoff and distinct owners
- [x] A07 current #44 technical **source-static review** and official public model deprecations checked.
- [ ] **P1 NEXT:A02** fix normalization issues R13-01..03, add exact unit science regression tests, real browser voice QA at new code SHA; follow-up PR #44 and issue #41 (not owner-approved deployment).
- [ ] **P1 NEXT:A06** create/commit exactly 10–20 natural Korean BEFORE/hint/WHY approved narration lines and lexicon at A06-owned branch, post **exact original blob SHA** to Issue#6/#41 for A07 script audit. A07 cannot mark **A06→A07 voice-script PASS** until that appears.
- [ ] **P1 NEXT:A07** re-review A02 new normalized code and A06 actual narration text on their exact new SHAs; report A06 and #21. A07 has not personally listened to paid/actual synthesized audio.
- [ ] **P1 NEXT:A02** integrate scientifically reviewed scripts into app, actual audio/BROWSER test separately, keep WebSpeech/text fallback, no user secrets in client.
- Owner still holds payment/API signup, release/main/deploy. A01 per-lesson QA not requested.
