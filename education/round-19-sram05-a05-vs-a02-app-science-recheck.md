# A07 Round19 · SRAM05 A05 corrected scene vs A02 official app typed evidence source mismatch
**2026-10-17 KST.** A07 independent source/static physical state and educational evaluator review only, **not A07 operated Chrome, real Voice, mobile, hardware or learner testing**. Technical owners A05 PR#13 and A02 PR#19, education report direct A06 Issue#6 and team hub #21/card #25. No main merge/deploy. Do not imply A02 last Chromium pass checked these precise negative paths.

## Current exact repository source fingerprints and scoped verdict
| Owner target | SHA inspected | Independent A07 result |
|---|---|---|
| **A05 standalone SRAM05 PR#13 HEAD** | **`ece6b98cbb7ab509286c11b28db8dc6dcae948d0`**, model `src/a05/sram/sramModel.ts` blob **`014a9f43f4ed5021b1898acdbc225cac9507ae2b`**, Lab blob **`2b18cdc6be399971d46dc4e13dab35c764560234`**, Visual blob **`345afd7eb805bb7d4dc59af8d632ec595a275d06`** | **Old A07 S01 phantom-powered SRAM and S02 BL toggled under active WL not retained SOURCE MAJORs FIXED in new A05 scene**; exact-source static only. Browser PASS belongs A05 separately. |
| **A02 official app SRAM PR#19 HEAD** | **`9452b9cc01e192859752c949526972fb42be59bb`**, `src/engine/adapters/sramActionAdapter.ts` blob **`1430704f091e58bc719008c4d873ba6f4a7a9dbd`**, imported **old** A05 `sramModel.ts` blob **`d1117acc8d6500834a4d1ff55645677e44f28743`** | **A07 APP_SOURCE_SCIENCE_MAJORS_OPEN R19-01/R19-02** (current A02 adapter is stale relative to A05). A02 historical 8 Chromium tests/PR comments are A02-owned, not a current-SHA scientific negative proof. |

## A05 current physics correction confirmed (do not re-raise old source bug)
- A05 current `latch(q:Bit|null, feedback, supply)` returns **Q=null/Qbar=null** on OFF or invalid feedback. `SramSceneLab.setSupply(false)` does `q:null`, on `setSupply(true)` retains **the null**; only explicit `q(0|1)` under valid supply+feedback initializes new known Q. A05 visual shows Q=? after power-on without a new explicit init. This fixes A07 prior “OFF then ON automatically restores old bit” on its new SHA.
- A05 current `transitionSramCell(state, action)` recalculates Q whenever **WL=1 AND mode=write** after changes in BL, WL or mode, thereby persisting the new bit when an active WL write drives BL. A05 Lab `setBl/setWl/setMode` calls this transition, keeps returned `next.q`. This fixes old “BL changes while WL active but stored bit doesn't update” on current A05 code.
- 1line/2line LRU for `A,A,B,A,C` toy costs41/32 are correct, residency model explains weights reuse but new input movement; not benchmark or real cache SRAM latency.

## R19-01 P1 A02 official app "SRAM bit resurfaces after power loss" STILL OPEN at current adapter
A02 `applySramActionAdapter('step-sram-s1-cross-coupled',currentParams,key,value)` does:
```ts
const prevQ:Bit = Number(currentParams.q ?? 1)===1?1:0;
const q:Bit = (key==='q'?Number(value):prevQ)===1?1:0;
const supply = key==='supply'?Boolean(value):Boolean(currentParams.supply??true);
const lat = latch(q, feedback, supply);
nextParams.q = q;        // BUG: uses q, NOT lat.q or null
nextParams.qBar=lat.qBar;nextParams.stable=lat.stable;
```
- **Exact deterministic call trace:** initial `{q:1,feedback:true,supply:true}`. After action `supply=false`, adapter keeps **`nextParams.q=1`** even though lat returns Q=null, qBar=null, stable false. Action `supply=true` reads prevQ=1, returns stable true and Q=1 **without re-initialization**. This is the old A07 SRAM physics MAJOR recurring in the **product app**, despite A05's source fix. Null `q` would also be silently coerced to1 by `?? 1` on subsequent action.
- **A02 mandatory science change**: use `Bit|null` for Q through the app serializer/reducer; when supply false or feedback invalid, `nextParams.q=null` and `qBar=null`; restoring supply alone keeps unknown, stable known-state false until independent explicit `key==='q', value=0|1` with supply+feedback true. If initialized false and power restored, no magical historical memory. Consider separate `powered` vs `known` state if UI must distinguish stable circuit vs stored bit knowledge.
- **Negative exact adapter tests**: start q1/supply ON → OFF ⇒ Q=null,bar=null; ON without init ⇒Q=null,bar=null (not 1/0); explicit Q0 ⇒stable Q0/Qbar1; again OFF→ON⇒unknown; feedback OFF→ON similarly shouldn't resurrect last known bit as guarantee. Independent browser integration confirm no answer/ARIA speech announces restored past bit.

## R19-02 P1 A02 S02 WL-OFF isolation evidence awarded without BL experiment
A02 adapter for `step-sram-s2-6t-access` currently:
```ts
if (wl === 0) history.push('isolated');
if (wl === 1 && mode==='write') history.push('wrote');
if (wl === 1 && mode==='read') history.push('read');
```
A learner can select **WL OFF** with BL left at initial value to receive 'isolated' automatically, select WL ON in default write state and receive 'wrote', select read state and get 'read', all without **comparing Q against an independently changed BL while WL OFF** or verifying write actually changed Q. A05 corrected Scene Lab is stricter: `setBl(value)` observes `isolated` **only if WL=0 AND BL input differs from stored Q**, and `transitionSramCell` stores the actual driven bit while write enabled. A02 current evidence cannot prove the 6T “WL off isolates, WL on permits overwrite” goal and can produce a false mastery pass by control visiting.
- **Required typed gate**: persist `beforeQ` and `afterQ`; `isolated` only when `action='bl'`, `WL=0`, **BL changed** and `afterQ===beforeQ`; `wrote` when `WL=1 && mode='write'`, driven BL known, and new `Q==BL` (prefer at least one Q flip or compare Q before/after), `read` only after successful write and actual read with Q preserved. Current stale `access6T(q:Bit,...)` and `Number(currentParams.q??1)` cannot represent unknown SRAM states without upgrade to A05 `Bit|null` and `transitionSramCell`.
- **Deterministic negative acceptance**: selecting WL0 only **does not** record isolation proof; then WL1 defaultBL and READ only doesn't pass S02 mastery. BL toggled while WL0 from knownQ0→BL1 records valid isolation and Q stays0; WL1 write with BL1 updates Q1; read WL1 mode read must observe Q1; switching BL while READ should not silently write to Q. No credit for 'read' before any successful write if lesson claims sequential proof.

## R19-03 P2 cache-run evidence awarded by selecting capacity
A02 S03 line code `cacheRan=Boolean(currentParams.cacheRan || key==='cacheRun' || key==='cacheLines')`; toggling `cacheLines` silently runs `simulateLru` and awards `one/two` observation whereas A05 scene requires explicit `runCache()` after selecting 1/2 lines. This is not a math error (41 vs32 still mathematically correct), but **evidence/UI contract mismatch**. A02 should only `cacheRan=true` from explicit run action (or honestly label capacity toggle automatically runs simulation and animate full trace, then grade based on viewed event trace). Must not claim student deliberately executed both simulations merely by toggling the selector without observing outcomes.
 
## Owner routing and condition to close
- [x] **A07 latest real A05 #13 model/Lab/Visual static source recheck complete.** Prior **A05-specific** S01 and S02 science SOURCE majors **RESOLVED_SOURCE** at exact code SHA. No independently executed A07 Chromium/Voice. A05 P2 actual cycle/regression evidence owners.
- [x] **A07 independently inspected actual A02 #19 app adapter and imported model**; **P1 app-source majors R19-01/R19-02 OPEN**, P2 capacity evidence mismatch. **NEXT:A02** synchronize with A05 current `Bit|null`, `transitionSramCell` on current code; fix adapter and typed q state, add Vitest+actual latest-head Chromium S01 power-cycle / S02 WL0/BL change / S03 run gating negative paths, record new PR#19 exact SHA/CI/screens. A02 needs to directly notify A05/A07 on #25.
- [ ] **NEXT:A07** independently recheck A02 new exact adapter SHA + negative test transcripts and A05 scene newest code; only then APP_SCIENCE_SOURCE_PASS, not automatic standalone browser PASS.
- [ ] **NEXT:A06** receive educational report Issue#6, update #21/#25 routing; canonical Lesson05 author educational source full QA remains its own separate gate and is **not** claimed PASS by this integration source review.
- [ ] **Owner** physical phone/Safari/screenreader/learner/real TTS and main merge/deploy HOLD, no A01 per-lesson gate.
