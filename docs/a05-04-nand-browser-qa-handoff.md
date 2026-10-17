# A05 N04 NAND/eSSD/NVMe→AI · typed 2.5D source, browser QA, A02 handoff

## Exact curriculum and tested evidence
- A06 canonical [five-step lesson04](https://github.com/Junebooky/interactive-engineering/blob/content/a06-curriculum/education/lessons/04-nand-essd-data-center.md), immutable source blob `3feba6f30e87eebccab86deb7dde505551f7c8e8`. A07 [Round09 EDU_QA_PASS_SOURCE](https://github.com/Junebooky/interactive-engineering/issues/30). Source PASS does not certify an A05 SVG, an A02 app, a phone or student.
- A05 standalone branch `feat/a05-04-nand-nvme-scenes`, stacked Draft PR above A05 Lesson14 #40. **Original code tested at SHA `91da0791bb8715fbb907515a0bd26f98b52a5e2c`**, [CI success #39032287966](https://github.com/Junebooky/interactive-engineering/actions/runs/39032287966), [actual Chromium #39032287988 7 PASS/0 FAIL](https://github.com/Junebooky/interactive-engineering/actions/runs/39032287988), [25 PNG screenshots artifact #12100238505](https://github.com/Junebooky/interactive-engineering/actions/runs/39032287988/artifacts/12100238505). Later branch synch commits require their own verification SHA.

## A02 typed adapter boundary
- `src/a05/nand04/nand04Model.ts`: `Nand04SceneId` union for 5 scenes, `nand04SceneOrder`, `Nand04State`, `Nand04Event{sceneId,type,payload?}`, pure `nand04Threshold`, `nand04Pages`, `nand04Ssd`, `nand04Transport`, `nand04Ai`, `gradeNand04`.
- `src/a05/nand04/Nand04SceneVisual.tsx`: stateless `Nand04SceneVisual({sceneId:Nand04SceneId,state:Nand04State,revealed:boolean})` standalone 2.5D original SVG, student pre-prediction screenshot/ARIA/readout hidden.
- `src/a05/nand04/Nand04SceneLab.tsx`: `Nand04SceneLab({onEvent?,onSpeech?})` **preview-local learner FSM only**, emits scene.enter, prediction.recorded, parameter.changed, answer.checked, hint.opened, voice.requested. A02 must connect pure model/view to **its own** canonical Lesson Engine, voice tutor, progress, save/restore, score. Do NOT mount local preview FSM as A02 product.
- Preview `/a05-nand04-preview.html`; tests `src/__tests__/a05Nand04.test.ts`, real browser `scripts/a05-nand04-browser.mjs` and `.github/workflows/a05-nand04-browser-qa.yml`. Browser fallback text does not prove naturally audible Korean voice quality.

## Four-state learning boundary / five physics scenes
| Scene | Mandatory hands-on evidence and final answer | Safe science / keyed misconception routes |
|---|---|---|
| `nand-threshold` | low, high, power-cycle, then retention-vs-read | Two threshold states low0.5V/high1.5V, read1V, NO reading when power OFF; charge-state retained in toy. m1 power-free reading false, m2 DRAM-style refresh false, m3 all NAND SLC false. |
| `nand-page-block` | initial, updated, collected, then page-vs-block | Two blocks × four pages. Logical LBA7 initial B0:P0/A → new B1:P0/B, old invalid, GC erases old block after valid page preserved. m1 unlimited in-place overwrite, m2 arbitrary deletion, m3 page=block wrong. |
| `ssd-ftl-reliability` | hot, cold, ecc-option, plp-option, then ftl-feature-options | Controller FTL LBA→physical mapping, wear management and ECC limitations; PLP and DRAM cache optional by model, NOT universal. Three branches ssd-plp-universal, ssd-dram-universal, ecc-perfect. |
| `nvme-transfer` | command, read-data, to-gpu, then command-dma-staging | Host/queue → PCIe → SSD controller READ command; NAND→controller→PCIe DMA→host DDR read payload; host DDR→GPU transfer conditional separate. m1 NVMe cable, m2 CPU byte-copy always, m3 direct HBM universally are wrong. |
| `ai-datacenter-pipeline` | cold-load, resident-infer, checkpoint, two-servers, then resident-vs-cold | Cold model load from SSD, resident GPU inference need not fully load SSD model per token, checkpoint writes persistent SSD and 2 servers may involve NIC. m1 always full reload, m2 HBM makes DDR/SSD obsolete, m3 GPU alone data center wrong. |

## Browser acceptance and screenshots
- Exact Playwright Chromium on 1440×900, simulated iPhone 375×812 and 320×700, touch, reduced motion, horizontal scroll check. Five step entry checks: neutral Korean initial speech, hidden pre-prediction SVG/readout and model limits; physics negative toy routes, three independent misconception buttons in each step and corresponding voiced cause-only feedback; correct answer after observations advances (no intentional error required to pass).
- Playwright 7 named passes contain all 15 negative alternatives, 5 correct completions, NVMe command/data directions, no read with power OFF, live LBA preservation after GC, product-option independence, resident GPU infer behavior, WebSpeech fallback. PNG artifact captures each wrong response and each correct stage, initial hidden state, mobile layouts and text voice fallback. **25 PNG files** under `browser-evidence/nand04/`.
- Separate QA still OPEN: A07 independent renderer science and Voice, A02 product app E2E at new app SHA, real phone Safari/audible Korean voice/screenreader/student usability, owner explicit permission to merge/deploy. No main merge/deploy.

## Direct next owners
- **A02 P1** [pipeline card #30](https://github.com/Junebooky/interactive-engineering/issues/30) accept this typed source, author A02 product integration/Voice/progress and run **new actual product app SHA** Chromium negative-case/CI/screens; post HANDOFF_ACCEPTED when successful.
- **A07→A06 P1** inspect *new A05 scene code* and step copy, 15 wrong feedback routes/Voice/aria and science at exact reviewed SHA; post independently at #30 and A06 #6.
- **Owner P2** hardware/learner accessibility/audible Korean TTS and release HOLD. No merge/deploy without authorization.