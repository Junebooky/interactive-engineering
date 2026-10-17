# A05 Lesson10 · 2.5D scene/QA/A02 handoff

- Role: original standalone **A05 scene-level** implementation, not the official app.
- Canonical source: A06 [Lesson10](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/lessons/10-ai-datacenter-end-to-end.md) immutable Git blob **cc579ef196609aa17a6c573657379b8005e88719**, A07 Round11 independent EDU_QA_PASS_SOURCE.
- Pipeline card: [#35](https://github.com/Junebooky/interactive-engineering/issues/35), A06 direct [handoff](https://github.com/Junebooky/interactive-engineering/issues/4#issuecomment-6233881319).
- Preview: npm run dev then /a05-dc10-preview.html; independent model/view/lab under src/a05/dc10/, unit cases src/__tests__/a05Dc10.test.ts, actual Chromium runner scripts/a05-dc10-browser.mjs.
- Sequence: neutral prediction, individual controls, explicit physical probe, student evidence, misconception-specific Korean correction, teacher WHY only after successful proof. Correct-first works; no mandatory error. Changing condition veils stale results.
- Dc10SceneLab props: onEvent?:(e:Dc10Event)=>void, onSpeech?:(id:Dc10SceneId,text:string)=>void. Student event types scene.enter / prediction.recorded / parameter.changed / observation.recorded / answer.checked / hint.opened / voice.requested. These are preview integration suggestions, not A02 official progress.

## Source-causal four exact Scene IDs

1. **10-S01 ai-roofline-bottleneck:** I10/80 FLOP/B × BW100/200 decimal GB/s, peak4 TFLOP/s; theoretical ceilings 1/4/2/4, ridges40 or20. Physically probe all 4; m1 dimension failure/m2 memory capacity != BW/m3 roofline != app latency, all specific Korean keyed feedback. Other unvisited numerical answer never appears in pre-predict Voice/SVG.
2. **10-S02 llm-prefill-decode-kv:** toy L2 × KV heads2 (query heads8) × dim16 × bytes2 × K/V2 × tokens4/16 × batch1/4 =512/2048/8192 bytes. Model residence and KV offload separate. Unconfigured LPDDR route returns OFFLOAD_PATH_UNSUPPORTED and cannot create valid offload evidence. Prefill and autoregressive decode are not same phase; not a TTFT benchmark. Three keyed misconceptions address repeated SSD full-model reload, phase identity, free offload.
3. **10-S03 rack-power-pue-thermal:** same-period illustrative IT1MW and PUE1.4/1.2 gives facility1.4/1.2MW and overhead.4/.2MW; throughput1000/1500 tasks/s independent. PUE fundamentally energy over energy, not a performance multiplier. Three misconceptions corrected individually.
4. **10-S04 ai-dc-end-to-end-resilience:** witness four proof outcomes: two servers but sole shared A switch down and no B -> NO_ROUTE; B installed but cable disconnected -> NO_ROUTE; B physically connected/configured+automatic policy while session localOnly -> STATE_NOT_RECOVERABLE; session replicated/stateless and healthy independent path -> RECOVERY_POSSIBLE (not RTO or loss guarantee). Intermediate B physical cable without configured route -> ROUTE_NOT_CONFIGURED. Common power outage -> NO_SHARED_POWER; unhealthy replica -> REPLICA_UNAVAILABLE; train without checkpoint -> CHECKPOINT_REQUIRED. A02 must preserve actual causal observations rather than label-click only.

## Required exact-head acceptance / RELEASE_HOLD

- [x] Original pure typed models, layered responsive SVG, learner-run controls, 12 Korean misconception corrections, unit cases, Chromium script and workflow authored in independent branch.
- [ ] Change checked state to SCENE_CHROMIUM_PASS **only** after latest full SHA GitHub Actions build/unit and actual Chromium positive/negative tests, screenshots and run URLs confirmed.
- [ ] A07 independent source/render/Voice/math science re-review of the A05 exact new head; A06 is the story owner.
- [ ] A02 official LessonPlayer, canonical Voice and graded progress/episode/save/restore integration + own new app HEAD actual Chrome/CI/PNG. A05 standalone pass never substitutes for this.
- [ ] Owner native Safari/real Korean auditory pronunciation, assistive screenreader, novice student/hardware QA; main merge/deploy **RELEASE_HOLD**. No paid API or automation/auto-merge/deploy.
