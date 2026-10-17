# A03 MOSFET Discovery Lab V2 — UI/UX revision handoff
2026-10-17 · **DESIGN CONCEPT ONLY** · no actual React app change, merge or deployment.

## Five revisions accepted
1. Remove global GNB, duplicate breadcrumbs, scattered DISCOVERY/STEP/autosave badges. Immersive header = **← 나가기 + single slim step progress + compact lesson name**. Save confirmation only when validated, never always-on false success.
2. One contextual primary CTA. When completed: **다음 실험으로 넘어가기 →** solid teal; **한 번 더 실험하기** and previous as low-key secondary. Remove duplicate page footer actions; navigation stays in one learning panel.
3. Make right learning panel one white continuous surface. Only **핵심 발견** uses quiet cool grey `#F2F4F6`. Voice mini-player is a low-chrome row, not a nested outlined card.
4. Prioritize 2.5D geometry: direct labels on MOSFET retained; redundant legend and scattered completion/status tags removed; camera/info grouped together. **'ⓘ 모델 기준' information must not leak toy threshold Vth before prediction**—show general model limit before, numerical details after submission.
5. Cause-and-effect learner language: "문턱 전압(Vth)을 넘자 전자들이 실리콘 표면에 모여 통로가 열렸어요. 하지만 양끝 전압 차(Vds)가 0V라서 이 모형에서는 순 드레인 전류가 흐르지 않아요."

## Mobile bottom sheet
- 390×844: 58px slim header + `49dvh` persistent scene = ~55.9% of whole viewport, learning panel on lower remainder; the only scrollable region is the panel content, while its primary CTA stays attached to sheet footer. 2.5D and manipulation/choices can be viewed simultaneously.
- 320×640 or mobile height <700px: reduce stage to `42dvh`, preserve sheet height and scroll; document itself must not scroll horizontally. Keep 44×44px button targets and keyboard support.
- Design demo shows a visual grip. Drag-to-resize sheet and real lesson transition are **NOT** implemented.

## Existing science/state must stay with owners
M01-S01 toy: predict 0/0.6/1.2 V; VGS slider 0..1.2 V (0.1 steps); 0 and >=0.8 direct visit before concept answer; **Vth 0.7 is a lesson-only toy**, VDS=0 V net steady ID=0 A. Phase sequence `predict -> observe -> explain -> feedback retry/complete -> next` maps to A02's own FSM. A05 owns physical model/geometry, A06 lesson copy, A07 science/anti-spoiler review to A06.

## Evidence and open gates
- **A03 independent design prototype**: HTML/SVG V2 screenshots captured via Chromium at 1440×900, 390×844 and 320×640. Prototype checked for zero document horizontal overflow, prediction veil, VGS history, misconception retry, successful completion. **This is not A02 real app CI/E2E**. Images and self-contained HTML are supplied directly in this A03 ChatGPT conversation; not hosted/committed in this GitHub PR.
- [ ] A01 visual direction approval.
- [ ] A02 actual React/TS state, Voice, responsive bottom sheet implementation; save-feedback truth, focus/ARIA/keyboard/screen reader and product E2E on exact SHA; 390/320/1440 app screenshots.
- [ ] A05 physical/electron visualization scientific consistency, camera/drag feasibility.
- [ ] A06/A07 copy/Voice/misconception and answer-before-prediction QA.
- [ ] A03 follow-up: loading/error/Voice unsupported/saved restore/reduced-motion separate visuals; mobile 320 first-action usability testing.
- [ ] Owner Safari device, actual Korean TTS, screen reader/student QA, main merge/deploy release HOLD.

Refs: [issue #54](https://github.com/Junebooky/interactive-engineering/issues/54), [Draft PR #55](https://github.com/Junebooky/interactive-engineering/pull/55), [team board #21](https://github.com/Junebooky/interactive-engineering/issues/21).
