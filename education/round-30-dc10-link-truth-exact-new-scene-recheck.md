# A07 Round30 · A05 Lesson10 AI datacenter S04 exact new visual/source P1 retest
**2026-10-18 KST.** Independent A07 review of GitHub PR#61 latest immutable code HEAD `5f15e04d5aadcbe23a2a53f168de5081c5f64b06`, author canonical Lesson10 original story `cc579ef196609aa17a6c573657379b8005e88719` previously A07 EDU_QA_PASS_SOURCE Round11. This is **STATIC TypeScript/React source and SVG path physics/teaching QA**, NOT A07-run real Chromium, screenshot, keyboard, TTS, screenreader, iPhone Safari or actual app.

## Exact current branch code fingerprints
- src/a05/dc10/dc10Model.ts blob **`7c3d8be34bf51d06107bb7f27cb319dac1b6a814`**.
- src/a05/dc10/Dc10SceneLab.tsx blob **`0f1b194c49e52f21aac672162d483137dad03ccc`**.
- src/a05/dc10/Dc10SceneVisual.tsx blob **`28f74c27ad082f7a242f75f477ca382107766f8d`**.
- Prior R28 reviewed HEAD **`84b8ac0746ee112fe2ea849a9e8bd1f93f48ca45`** with wrongly continuous green A wire / amber B wire. Historic A05-owned real [Chromium run #39046572471 6 PASS](https://github.com/Junebooky/interactive-engineering/actions/runs/39046572471) and [CI #39046572462 SUCCESS](https://github.com/Junebooky/interactive-engineering/actions/runs/39046572462) ran **older code HEAD**, not this repaired HEAD. New-head CI/real Chromium evidence NOT YET inspected/confirmed, may be pending.

## Result
- [x] **R28-02 false physical cable-state P1 RESOLVED_SOURCE**, exact current code mapping corrected. **A07 Lesson10 four-scene `EDU_SCENE_SOURCE_PASS`** on this new inspected HEAD for bounded model/JSX/static pedagogical truth.
- [x] Original scene S01 roofline I/BW ceilings1/4/2/4 TF, ridge40/20; S02 GQA batch×L2×Hkv2×D16×tokens4/16×2bytes×K/V2 =1024/4096/16384B, no unsupported LPDDR proof; S03 PUE1.4/1.2 IT1MW=>facility1.4/1.2MW, task rate independent; S04 recovery NO_ROUTE/STATE_NOT_RECOVERABLE/RECOVERY_POSSIBLE conditional with separate physical cable/config/policy, RTO not guaranteed. Teacher long WHY only `feedback.passed`, 4×3 cause-specific corrections, changing input sets `hasProbe=false` so SVG after-test numbers re-veil until new deliberate observation.
- [ ] **A05 REAL CHROMIUM/ARIA/Voice/CI PASS AT NEW HEAD NOT YET VALIDATED BY A07**. Cannot upgrade author old Chromium6 PASS to exact new HEAD. New code adds `dc10DiagramLinks` and cable SVG physical condition visuals; require actual screenshot/assertions at new HEAD. A02 official product integration and owner device/safety/release separate.

### Physics/UI retest on exact code
Previous bug paths:
1. **Unplug PRIMARY A**: `switch1Healthy=true, routeAConnected=false, switch2Installed=false`. `dc10Recovery` returns primaryUsable=false and NO_ROUTE, and new `dc10DiagramLinks` sets `primaryCablePresent=false`, `primary='open'` (regardless healthy hardware). Visual displays **two physically separated grey cable segments with RED X glyphs** and group `data-testid="dc10-link-primary" data-route-state="open" data-physical-cable="false"`, primary label `OPEN CABLE`. Previously one connected green wire; now corrected.
2. **Backup B selected but NOT installed**: `switch2Installed=false, routeBConnected=true, servers=2` after primary fault. Pure model NO_ROUTE, `backupCablePresent=servers2 && installed && connected=false`, `backup='open'`. Visual interrupted grey backup path with X; no solid amber cable. Works even when there is a boolean-routeBConnected toggle but no device.
3. **B physically connected but UNCONFIGURED**: `servers=2,switch2Installed=true,switch2Healthy=true,routeBConnected=true,routeBConfigured=false`, primary failed. `backupCablePresent=true`, `backup='unconfigured'`; visual **amber DASHED** cable, label `NOT CONFIGURED`, recovery code `ROUTE_NOT_CONFIGURED` (not falsely active green). 
4. **B physically connected/configured but NOT recoverable** (localOnly, failover policy none, replica unhealthy or train missing checkpoint): `backup='standby'`, amber dashed label `WIRED / NOT ACTIVE`; PURE recovery code remains STATE_NOT_RECOVERABLE / FAILOVER_DISABLED / REPLICA_UNAVAILABLE / CHECKPOINT_REQUIRED. Does not claim successful traffic recovery.
5. **B all valid** route installed+connected+healthy+configured, shared power healthy, eligible failover policy and recoverable session/checkpoint => pure code RECOVERY_POSSIBLE, visual B `backup='active'`, solid mint path, no actual RTO/SLA guarantee.
6. **Switch A link physically present but Switch A failed/shared power failed**: `primaryCablePresent=true` while `primary='fault'`, red DASHED not green, and group title `장비/전원 장애`; separates physical presence from electronic usability.
7. **Unproven scenario probe**: Lab `probe()` now uses `setHasProbe(sceneId==='ai-dc-end-to-end-resilience'||x.evidence!==null)` for S04. Every deliberate fault probe may show **current physical picture/result**, even if `dc10Probe.evidence===null` (not one of four mastery evidence tags). It only adds `evidence` when non-null and event emits `accepted=false`, so no fake mastery from an unrecognized scenario; late state change always re-veils until re-probed. Unsupported KV-offload S02 still veiled and uncredited when path unsupported.
8. **Remaining source P2**: A physically connected B route in standby is not necessarily receiving traffic until eligible policy/state; new visual labels match. Could change SVG root `aria-label` to include instantaneous link-code (currently group `<title>` and labels provide it) to optimize some screenreaders; not blocking P1, but test accessibility tree with actual browser. Control button re-click on same already selected state may still emit `parameter.changed` and reset observation, a UX polish/no falsified scientific calculation.

## Actual new-head A05 Chromium/Voice expected negative matrix
A05 owner should create/attach REAL new PR#61 HEAD test run and screenshots proving:
- [ ] PRIMARY A physically open/no B ⇒ group `data-route-state=open`, `data-physical-cable=false`, interrupted grey link, NO_ROUTE, no surviving green path in DOM/SVG or spoken result.
- [ ] B route boolean true, device B physically not installed ⇒ group open/false, drawn disconnected even if routeBConnected; no mastery route-proof evidence.
- [ ] B present but config false⇒group unconfigured, amber dashed, recovery ROUTE_NOT_CONFIGURED, correct Voice/ARIA semantic.
- [ ] B linked/configured but localOnly⇒group standby, amber dashed, STATE_NOT_RECOVERABLE; fully recoverable⇒active solid mint and RECOVERY_POSSIBLE, explicitly RTO unknown.
- [ ] No visual numeric/teacher WHY leak before prediction, after any parameter changes and before a new accepted probe; 12 Korean keyed wrong feedback and per-scene correct-first path, 320/375 phone, keyboard/reduced motion/WebSpeech absent; correct A05 own screenshots/CI at new HEAD.
- [ ] A02 APP integration under *different* official app commit with equivalent `route`/policy/evidence typed reducer and true product Chromium negatives, no main/deploy without owner.

## Owners
- [x] A07 exact latest A05 *SOURCE* independently accepted, R28-02 RESOLVED_SOURCE at new model/Lab/Visual blob SHAs.
- [ ] **P1 NEXT:A05** new HEAD-specific real Chromium/ARIA/Korean transcript/CI/PNG negative proof **not the old run**, then direct A02 app handoff. Publish checked run IDs with exact tested HEAD on #35 / PR#61 / #21.
- [ ] **P1 NEXT:A02** app with confirmed new A05 scene/progress/Voice and separate source/real Chrome E2E at own HEAD; [ ] **A07** optionally recheck future changed source and new evidence; [ ] Owner actual audible ko-KR/Safari/screenreader/student/datacenter/main merge+production deploy HOLD.
