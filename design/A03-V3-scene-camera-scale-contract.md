# A03 V3 — Smart Scene Fit and 2.5D Camera Scale Design Contract

> Date: 2026-10-18 KST. A03 owns visual standards; A02 owns official app camera integration; A05 owns scientific geometry; A08 owns scene UX review; A06/A07 validate learning semantics. **DESIGN SPECIFICATION ONLY — NOT IMPLEMENTED OR PASS.** No main merge/deployment without owner approval.

## The problem

Student report: a small engineering object can look tiny because some problems default to an overly wide camera; other lessons begin unusually zoomed in. This inconsistency creates confusion when moving between lessons or steps.

### Verified root causes in A02 PR #73 and A05 code

- LessonPlayer.tsx starts every scene with zoomLevel=1 and adjusts zoom by +/-0.12, clamped 0.85–1.4. The reset button sets 1. There is no scene-aware auto-fit nor a step-change zoom reset.
- lessonA03.css scales the entire .a03-lab-canvas-wrapper via transform: scale(var(--zoom,1)) irrespective of the visible geometry, annotations, toolbars or measurement tiles.
- A05 scene SVG viewBoxes vary: MOSFET 630×370, electricity 780×420, MOS14 650×405, DRAM 650×410, SRAM 650×420, NAND 680×400, GPU 650×405. They contain differently sized artwork and blank margins. A shared CSS width:100% does not yield a shared visual scale.
- Example: the MOS14 metal gate spans 247 units within a 650-unit SVG viewport, while the larger underlying wafer spans ~450 units. The object hierarchy and essential labels need semantic framing, not blind zoom of the entire viewBox.
- A05 CONCEPT PR #78 uses a separate 640×360 viewBox, max-height responsive caps of 380/235/195px, and an explicit zoomed minimum width of 640px; this does not use the same camera-fit policy as interactive scenes.
- Different engineering devices should NOT pretend to have equal physical size. Our goal is consistent on-screen visual **prominence and legibility**, not false real-world scale.

## Policy 1 — Start each lesson with Fit Subject

Every published interactive and CONCEPT scene must identify a primary teaching subject and its essential label extent. On initial entry, automatically select the largest camera framing that keeps the entire subject and required labels legible within the stage's actual safe viewport.

- Ignore blank SVG margins and purely decorative scene backgrounds when calculating the subject bounds. Do not crop important component labels, terminals, connections, axes, arrows or physical cues.
- Reserve about 8–12% visual breathing room on each side of the effective safe scene slot. The primary geometry should normally fill 70–85% of its fitting/dominant axis, with ~60% a **review alert** rather than an unquestionable failure (complex diagrams/high aspect ratios need exceptions).
- Center on the engineering subject, not the canvas origin. Allow a documented focal offset to accommodate important one-sided labels.
- **Stable bounds per scene family:** changing VGS/VDS, charge, switch state, wordline or animation step must NOT suddenly change camera framing. Use the union of all meaningful state extents for the step. Only reset fit when entering a different lesson, step, or visualId.
- Never dynamically crop a science outcome or misleadingly depict a compact object as physically comparable in scale to another device.

## Policy 2 — Shared camera math, scene-aware input

A02 builds reusable SceneViewport/SceneCamera behavior (React app shell); A05 provides stable world bounds and subject group geometry for each A05 scene.

Typical contract:

    type SceneFraming = {
      sceneId: string;
      familyId: string;
      stableBounds: {x:number; y:number; width:number; height:number};
      subjectBounds: {x:number; y:number; width:number; height:number};
      essentialLabelBounds?: {x:number; y:number; width:number; height:number};
      focalOffset?: {x:number; y:number};
      policy?: "fit-subject" | "fit-diagram" | "comparison-fixed";
    };

    fitScale = min(
      (safeW * (1 - 2 * padding)) / stableBounds.width,
      (safeH * (1 - 2 * padding)) / stableBounds.height
    );
    effectiveScale = fitScale * userZoom;

Above is a starting formula, not drop-in code. Compute safeW/safeH from a measured **content stage**, excluding header, controls, camera toolbar, measurement readouts, 2.5D dock and learning bottom sheet. Center by logical world-space bounds. Prefer typed authored scene metadata from A05 over calling getBBox on every render/slider tick. ResizeObserver recalculates when the stage size changes; it must not create oscillations.

Fit computation must control the SVG/camera-content group or the viewBox, **NOT the toolbar, text UI, captions or CTA**. Preserve viewport masks, graph axes and correct physical labels.

## Policy 3 — Predictable manual zoom

- Initial normalized view = Fit Subject (userZoom=1). The Reset button must restore Fit Subject, not a universal raw CSS scale of 1. Add accessible tooltip "화면에 맞춤" or "기본 보기".
- + and − operate **relative to the computed fit**, e.g. about 15% steps, reasonable range ~0.8×–2.5×. Offer panning and keyboard access when magnified. Do not permit zoom to permanently hide controls or result labels.
- Zoom does not carry into a new step/visualId. Within the same scene, students can change voltage or switch state without zoom snapping back.
- Avoid scaling labels so small they become unreadable at 320px. Place important on-scene annotations in the camera label layer where necessary; always maintain accessible text equivalents.

## Policy 4 — A03 consistent framing QA across scenes

A02 + A08 run real Chromium QA at **1440×900, 390×844, 320×640**, across all published scenes including the 10-domain A05 CONCEPT pack; review a compact cross-scene contact sheet at **identical content stage pixel dimensions**.

Required checks:
1. Stage/subject/essential-label bounding boxes must be within a safe viewport: no device crop, no camera tool or readout overlapping the subject's essential labels.
2. Report each scene's visible subject width/height, fill ratio, camera scale, viewport, and exception reason. Tiny subjects (<60% of the fitting axis) should be flagged for A03 visual review unless they require a wider composition.
3. Change parameters repeatedly: subject camera stable and no jump; switch step: camera recomputed and userZoom resets. Test +/−/reset and orientation/dynamic viewport resizing.
4. Test 390/320 at scroll position zero: device, meaningful labels, active experiment/question, and primary CTA remain discoverable; preserve at least 44px controls. Existing PR #73 sibling lab/sheet non-overlap tests alone are NOT sufficient.
5. Ensure no Vth/current/answers are unmasked in initial CONCEPT/PREDICT, including ARIA and TTS, regardless of camera scale.
6. Evidence: exact app HEAD SHA, A05 source/physics branch, CI logs, real app before/after PNGs and contact sheet with scene IDs; document all exceptions.

Recommended automated attributes: data-scene-slot, data-scene-camera, data-scene-subject, data-scene-essential-labels, data-scene-id. Use authored fallback only for marked unknown bounds, never silently show a tiny scene.

## Handoff responsibilities

**A02 (shared app):** implement scene-aware auto-fit, safe stage measurement, zoom reset per lesson/step/visualId and separate camera layer. Keep FSM, Voice, progress, responsive layout and mobile sheet functional. Make actual app E2E/CI screenshots.

**A05 (geometry/physics):** provide semantic stable bounds and grouped artwork/labels for all scene families and PR #78 concepts; check multiple physics states and scientific integrity. Handoff typed bounds map to A02.

**A08 (scene UI):** simplify visual camera and label framing, prevent clipping/overlays at 1440/390/320, generate real Chromium cross-scene comparison sheet and hand off issues to A03/A02. Do not rewrite A05 physics or A02 FSM.

**A03:** visually inspect size consistency and approve/decline. Maintain [CURRENT.md](CURRENT.md) and owner-facing visual reference. A06/A07 assess answers/labels/spoiler safety.

**Status**: A03_CAMERA_DESIGN_DEFINED; A02_IMPLEMENTATION_OPEN; A05_SCENE_BOUNDS_OPEN; A08_SCENE_VISUAL_QA_OPEN; A03_CAMERA_UI_PASS=NO until actual product screenshots reviewed.

References: [A02 V3 PR #73](https://github.com/Junebooky/interactive-engineering/pull/73), [A05 CONCEPT PR #78](https://github.com/Junebooky/interactive-engineering/pull/78), [A03 PR73 review](A03-PR73-V3-app-visual-review.md), [P0 #70](https://github.com/Junebooky/interactive-engineering/issues/70), [team #21](https://github.com/Junebooky/interactive-engineering/issues/21).
