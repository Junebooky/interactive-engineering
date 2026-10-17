# ID and progress namespace crosswalk · A06 canonical (2026-10-17)
> Resolves A07 EDU-02/R2-05 **namespace ambiguity** without renumbering existing A02 persisted IDs or rewriting links. The Atlas 115 topic dependency graph is *internally acyclic*, but topic ID reuse as display labels can collide with lesson/step IDs. **Never join database tables using a bare short code.**

| Canonical identifier | Format / example | Owner | Meaning / persistence |
|---|---|---|---|
| topicId | `topic:D02` | A06 | Atlas D02=carrier recombination/majority-minority; **not** DRAM lesson |
| topicId | `topic:M01` | A06 | Atlas M01=SRAM 6T; **not** MOSFET lesson M01 |
| lessonId | `lesson:02` or legacy `D02` | A06 authored → A02 persistence | **DRAM** lesson, not topic D02 |
| lessonId | `lesson:01` or legacy `M01` | A06 authored → A02 persistence | MOSFET lesson, not topic M01 |
| stepId | `step:D02-S02` | A06 | DRAM bitcell sense-restoration step. Prefix MUST include namespace `step:` |
| sceneId | `scene:dram-sense-restore` | A05 | unique renderer/view contract for D02-S02; not a progress ID |
| lessonId | `lesson:14` | A06 | 14 MOS capacitor; after A07 gate; maps topic D06 to lesson14 |

## Stable crosswalk samples
| topicId(s) | lessonId | stepId | sceneId |
|---|---|---|---|
| topic:D06 (MOS capacitor) | lesson:14 | step:14-S01 | scene:mos-oxide-field-without-dc-path |
| topic:D06 (MOS capacitor) | lesson:14 | step:14-S02 | scene:mos-accumulation-depletion-inversion |
| topic:D07 (MOSFET) | lesson:M01/01 (legacy) | step:M01-S01 | scene:mosfet-field |
| topic:M03 (DRAM charge-share) | lesson:D02/02 (legacy) | step:D02-S02 | scene:dram-sense-restore |
| topic:M01 (SRAM) | lesson:05 | step:05-S01 | scene:sram-cross-coupled-inverters |
| topic:C03 (roofline) | lesson:10 | step:10-S01 | scene:ai-roofline-bottleneck |
| topic:P01 (basic charge) | lesson:12 | step:12-S01 | scene:charge-voltage-current-arrows |
| topic:P08 (math/probability/p99) | **lesson:12 PARTIAL only RC exponential**, full p99 bridge lesson:13 RESEARCH_CANDIDATE | no complete step | not implemented |

## Contract and validation
- Split user-facing label from internal canonical code. Store `namespace + ':' + id` or distinct typed fields. A02 must preserve existing persistence migration for older `M01`/`D02` keys; do not silently reinterpret existing saved progress as topic progress.
- `lesson:14` and `topic:D06` differ. A05's sceneId is not used as course progress key. Story Step must explicitly map scene contract, not assume e.g. D02 prefix means a topic ID.
- Assert in A02 schema/tests: every `stepId` unique within lesson and global key; every `sceneId` unique per implementation; `lessonId` type not accepted as `topicId`; old progress resolves to original lesson definition.
- Concept ID `P01`: core elementary charge/negative electron signs taught in 12-S01 first minute; hole/semiconductor carrier detailed in 11-S01/S02. Atlas legacy planned `lesson 11` for P01 is now split **taught:12-S01; enriched:11**.
- `P08`: square root/log and probability/p99 **not** completely in lesson12. Set `PARTIAL`: exponent RC shown in senior drawer, sqrt/ln mini bridge before PN-S04, p99/per cent coverage explicitly ahead of 09-S04. Not STORY_READY at topic mastery level.
- Source: A07 [Round 02 findings](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-02-foundations-g03-audit.md). **A07 revalidation pending**. Application/database migration not performed by A06. No main merge/deploy.
