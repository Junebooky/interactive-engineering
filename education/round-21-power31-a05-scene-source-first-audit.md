# A07 Round21 · A05 Lesson31 power/cooling five-scene independent science+pedagogy React source audit
**2026-10-17 KST.** Review assignment from A05 direct Issue#6 comment #6234663518 and pipeline #38, on latest A05 PR#50 **HEAD `439843c2493e5efe91f537e716ebc2aa8c5188ae`** (branch `feat/a05-31-power-cooling-foundations`). Source file immutable SHA:
- `src/a05/power31/power31Model.ts`: **`2fcf0c47c1481091c654eaa71f6ad5331af228ff`**
- `src/a05/power31/Power31SceneLab.tsx`: **`98381645d20c7a885aa892f8a85175aa258ab3b6`**
- `src/a05/power31/Power31SceneVisual.tsx`: **`21e9c6637e3df29e71b1c824ddf0c533e199d24a`**
Canonical A06 31 lesson `f7e7aa16db5cdd71f489cdf0ea8a0c586f5b15b2` and senior `62dfb603997cbe8eb87e89a52f3f999b2915e98d` **already A07 EDU_QA_PASS_SOURCE (Round12)**, unaffected by this scene audit.

## Verdict
- [x] **A07 independent source/static science/physical numerical model `PHYSICS/MATH_PASS_SOURCE` 5/5.** PSU 100W/0.9⇒Pin111.111W loss11.111W vs0.95⇒105.263/5.263; ideal buck Vin12V D1/4,1/3,1/2⇒3/4/6V, separate Pout40W/η90⇒Pin44.444W Iin3.7037A loss4.444W; fixed load40W rail2→1V current20→40A at2mΩ heat.8→3.2W drop.04→.08V; coolant100kW Cp4180 ΔT5/10⇒4.784689/2.392344kg/s circulation and makeupWater=null regardless dry/tower; facility IT1MW PUE1.4/1.2 facility1.4/1.2MW =4.8MWh differential over24h, independent Site A/B PUE1.2/1.35 and WUE2.0/0.5L/ITkWh. No PSU GPU energy or water benchmarking claim.
- [x] **A05-authored actual test evidence preserved (not independently executed by A07)**: latest [CI #39038020559 SUCCESS](https://github.com/Junebooky/interactive-engineering/actions/runs/39038020559), [Chromium #39038017667 7/7 PASS](https://github.com/Junebooky/interactive-engineering/actions/runs/39038017667) and [26 image artifacts](https://github.com/Junebooky/interactive-engineering/actions/runs/39038017667/artifacts/12102452908). Browser test pass at its authored tested PR SHA **does not demonstrate the two new specifically untested negative grading/gating paths**.
- [ ] **`A07_EDU_SCENE_QA_PASS` = P1 MAJORS_OPEN**: R21-01 teacher answer in `story.why` can be revealed on just one observation and a failed concept score; R21-02 S05 displays unattempted Site A site-PUE and WUE numbers after any PUE click even before site A/B independent investigation. These are **code-derived reachable render branches**, **not A07-observed Chrome or voiced audio**.

## R21-01 P1: 31-S01..S05 detailed teacher WHY answer unlocked after one observation + wrong attempt
**Causal source path** `Power31SceneLab.tsx`:
```tsx
const revealed=prediction!==null,observed=seen.length>0;
{revealed&&observed&& <div className="a05-box"> /* shows answers */
  ... onClick={()=>{const g=gradePower31(sceneId,seen,answer);setFeedback(g); ... }}
</div>}
{feedback&& <section className="a05-result">
  <button type="button" onClick={()=>setWhy(!why)}>왜? 원리 보기</button>
</section>}
{why&&feedback&&<div className="a05-why"><p>{seen.length>0?story.why:'...'}</p></div>}
```
`gradePower31()` returns **passed=false** for incomplete independent evidence but still sets nonnull `feedback`. The Why button is **not gated on `feedback.passed` nor checked against required independent observation states**. Thus explanation `story.why`, containing all derived answers for **untried** configurations, is shown after any one observed tag and any wrong graded answer. This violates authored 31 source contract: hidden computed teacher answers/after Voice until student prediction **and independently performs two different scenario states and records WHY**. Hints L1/2/3 should remain progressive and concept-keyed, but the complete answer should not be a shortcut to mastery.
**Deterministic source-path negative**:
1. On S01 choose first prediction, click **PSU90% only** (`seen=['eta90']`), select misconception `m1` and grade: `gradePower31('server-psu-loss-heat',['eta90'],'m1').passed=false` because no eta95 and wrong answer.
2. Click “왜? 원리 보기”. Current unconditional `why&&feedback` shows **both** ETA90 `Pin111.111W/loss11.111W` **and ETA95 `Pin105.263W/loss5.263W`** although η95 hasn't been selected, plus complete teacher derivation.
3. Repeat S04 after only `ΔT5K`: long `story.why` exposes untried10K flow2.3923 and heat50K result. Repeat S05 after only `PUE1.4`: `story.why` exposes unvisited site A/B PUE+WUE.
**Fix options (A05 owner):**
- Treat full `story.why` as a **post-mastery teacher explanatory reveal**, render only `feedback?.passed && why`. For failed-grade responses expose **only attempted misconception-specific text** or missing-condition hints (which code already has), not full cross-state answer. Explicitly verify S01 `eta90` alone + m1 feedback never reveals eta95 derived inputs in DOM/aria/Voice; after eta90+eta95 and correct WHY it can reveal both numbers.
- If the pedagogy deliberately permits a non-mastered learner to request full worked solution, make it a **distinct acknowledged “정답 보기 · 성취점수 미부여” action after two distinct observations**, and ensure grade does not turn PASS from seeing. But do **not** silently contradict the canonical authored contract.
**Pre-answer source at initial render** has `Power31SceneVisual` early veil until prediction+any observation and neutral question `story.voice` (PASS in source, not tested browser); the bug is a *post-first-observation, pre-full-evidence cross-condition answer leak*, not “before any prediction” browser evidence.

## R21-02 P1: 31-S05 unseen **site A** metering values leak from default state after only PUE experiment
`power31Fresh()` defaults `site:'A'`, `pue:1.4`. `Power31SceneLab.change(next,'pue14')` increments `seen=['pue14']` even if no independent site action. `Power31SceneVisual` sees `revealed=prediction!==null && observed=seen.length>0` and immediately renders:
```tsx
const dc=power31Facility(state.pue,state.site); // state.site 'A' default
<Unit title={'site '+state.site+' / PUE '+dc.sitePue.toFixed(2)} .../>
<Unit title={'WUE '+dc.siteWue.toFixed(2)+' L/kWh'} .../>
...
<span>site PUE<b>{dc.sitePue}</b></span>
<span>site WUE<b>{dc.siteWue} L/kWh</b></span>
```
The lower “A: PUE1.2/WUE2 vs B:PUE1.35/WUE.5” comparison string is **correctly guarded** behind `evidence.includes('siteA')&&evidence.includes('siteB')`, but **individual Site A** numbers in `Unit` and `.a05-readouts` are **not** gated by `siteA` evidence at all. The student may have selected only independent facility PUE and never clicked the Site A site experiment; Site A “PUE1.20/WUE2.00” answers nevertheless appear. A05 PR#50 report claims unseen site/PUE numeric no-leak without defining this negative path.
**Required A05 gating:** Before `seen.includes('siteA')`, hide both site-PUE and site-WUE numeric readouts (e.g. “Site A — 아직 직접 관찰하지 않음”); when A visited render A only; when B visited render B only; pairwise ranking/complete table only after **both `siteA` and `siteB` independently seen**. After facility PUE14 alone, the facility `facilityMW=1.4` and overhead numbers are **valid visible observation** because that control was tried; only *site metrics* require separate evidence. Ensure SVG text, readouts, screen reader ARIA and TTS respect same guard.
**Must-fail negative**: record prediction, click PUE1.4 only, no siteA/siteB actions ⇒ DOM/text content must not contain `site A / PUE 1.20` nor `WUE 2.00 L/kWh`. Click siteA ⇒ site A visible, siteB still unknown. Click siteB ⇒ both may be compared and rankings shown. Previous general initial-veil test alone insufficient.

## P2 polish / physics visualization
- **R21-03** PDN visual shows `GPU rail (fixed P) 2V` **upstream of a nonzero series resistor** and draws current through wire before toy load. Model computes `I=40W/2V`, which uses **2V as GPU load-terminal voltage**, not necessarily upstream regulator output; at R2mΩ/I20A, upstream should be **2.04V** if 2V is load-side. Label displayed `GPU terminal 2V`, or visibly show source `Vupstream=Vgpu+IR=2.04V` in the indicated toy circuit. The source text says “rail” but reviewers/users could treat left box as true upstream rail and erroneously compute an inconsistent 40W. This is **MINOR** with declared “GPU rail (fixed P)” toy and loss separately stated, not a blocking arithmetical source error.
- **R21-04** Click on already-selected current state emits `parameter.changed` and adds graded history (`eta90`, `rail2`, `siteA`) even if value unchanged. For science-learning *evidence* “manipulated and observed”, either count a consciously invoked **observe current state** action if visual changes and student saw it, or demand a true state transition and record `observation.kind` distinct from `changed`. Current label `parameter.changed` is inaccurate for no-op buttons. Nonblocking if demonstrated initial observation is allowed, but prevent “all seen” score without genuine independent comparisons.

## Acceptance and owners
- [x] **A07 independent current PR#50 pure model/React source science inspection** all five mathematical scenarios and 15 cause-specific wrong messages present.
- [ ] **P1 NEXT:A05** patch the why gate and site-specific independent metric visibility, add **actual Chromium negative DOM+ARIA+onSpeech assertions at corrected HEAD** (S01 one η+wrong WHY cannot yield untried η95; S05 PUE-only cannot show site A/B metrics), update CI and 26 screenshot evidence as relevant, and send **NEW exact A05 PR HEAD + Lab and Visual blob SHAs** to A07 and #38. Preserve existing 7 A05-owned successful tests at old tested SHA.
- [ ] **P1 NEXT:A07** independently recheck corrected exact files and evidence; only then state `EDU_SCENE_QA_PASS_SOURCE` and pass to A02.
- [ ] **P1 NEXT:A02** official app integration must honor independently graded evidence tags, distinguish teacher answer reveal from earned mastery, hide unseen site metrics; new app HEAD actual E2E. [ ] **Owner** real native Korean audio/iPhone Safari/screen-reader/student/hardware/main merge/release still HOLD.
