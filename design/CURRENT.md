# A03 — Interactive Engineering 최신 디자인 정본

**최신 디자인: V3 / 2026-10-18 KST** · **Design-only Draft PR #55** · **공식 A02 React 앱 최종 승인은 아직 보류**.

## 지금 개발팀이 열어야 하는 5개 링크

1. **[V3 최신 디자인 이미지 5장 — Gallery](GALLERY-v3.md)**: 카탈로그 desktop/mobile, MOSFET desktop/390/320
2. **[V3 원본 카탈로그 HTML/CSS/SVG](prototypes/a03-v3-catalog.html)** / **[V3 원본 학습 화면 HTML/CSS/SVG](prototypes/a03-v3-mosfet-lesson.html)**
3. **[V3 화면 구현/반응형/레슨 시각화 계약](A03-V3-mobile-catalog-visual-coverage-contract.md)** · [화면 PNG 재생성 스크립트](prototypes/capture-v3-reference.mjs)
4. **[A02 공식 앱 Draft PR #73](https://github.com/Junebooky/interactive-engineering/pull/73)** 및 **[A03 실앱 디자인 검수 보고서](A03-PR73-V3-app-visual-review.md)**: 현재 `UI_DESIGN_PASS=NO, CHANGES_REQUIRED`
5. **[P0 Issue #70](https://github.com/Junebooky/interactive-engineering/issues/70)**, **[공동 보드 #21](https://github.com/Junebooky/interactive-engineering/issues/21)**

원본 디자인 PNG는 [GitHub Actions #39127237173](https://github.com/Junebooky/interactive-engineering/actions/runs/39127237173) Chromium 렌더 성공 후 위 디자인 브랜치에 **실제 5개 바이너리 파일로 커밋**되었습니다. HTML과 PNG는 **A03 콘셉트 프로토타입**이며 공식 A02 React 앱 스크린샷과 혼동하지 마세요.

## 2.5D 화면 크기 정규화 — Smart Scene Fit (2026-10-18)

- **[P0 Issue #80 — 장면별 시각적 확대율 불일치 수정](https://github.com/Junebooky/interactive-engineering/issues/80)** · **[A03 2.5D Camera/Scale 디자인 계약](A03-V3-scene-camera-scale-contract.md)**
- V3의 **모든 기존 디자인 자산은 유효**하며 이번 변경은 카메라 기본 맞춤과 장면별 시각적 크기를 통일하는 **추가 계약**입니다. 새로운 페이지 시안이 아니라 기존 장면 구성의 보완이므로 V3 HTML/PNG를 잘못된 최신본으로 표시하지 않습니다.
- 원칙: 실제 공학 물체+필수 라벨 범위에 맞춰 기본 화면 설정(최대한 크고 안전하게), 서로 다른 SVG viewBox/여백에 따라 작게 나오는 현상 해소. 같은 장면을 조작할 때 카메라 크기 유지; 새 스텝에서 재설정; 확대/축소는 Fit 대비 상대값.
- **NEXT A02** shared SceneCamera/step reset/browser E2E, **A05** scene/CONCEPT stable bounds+science, **A08** 1440/390/320 cross-scene Chromium 비교, **A03** 최종 디자인 리뷰. **현행 A02 PR#73에는 아직 적용/검증되지 않았습니다.**

## 최신 A02 PR #73 검수 — Commit 6694e47be8 (2026-10-18)

- **[A03 실제 Chromium 11장/소스 재검수 보고서](A03-PR73-6694e47-camera-visual-re-review.md)** · [A02 검증 CI #39130621477](https://github.com/Junebooky/interactive-engineering/actions/runs/39130621477) 성공 · [Browser #39130621470](https://github.com/Junebooky/interactive-engineering/actions/runs/39130621470) 성공 · PR #73은 Draft.
- [x] A02 개선 인정: CONCEPT 도입 `00` 표시, 모바일 320/390 CTA 표시, 카탈로그 타이포/그리드, 공통 SceneViewport 및 zoom reset 동작의 일부 브라우저 검증.
- [ ] **P0 CAMERA SCALE STILL FAIL**: 실제 390/320 MOSFET·회로 그림이 장면 중앙에서 매우 작게 보임; `SceneViewport`가 실제 SVG subject가 아니라 임의 DIV와 A05 readouts를 함께 CSS scaling. `data-dominant-fill-ratio=0.79`는 metadata 계산값으로 실제 물체의 화면 점유율을 증명하지 못함. A02 실제 SVG framing+readouts 독립 배치, A05 tight bounds, A08 동일 stage 크기 cross-scene contact sheet 필요.
- [ ] **P0 CONCEPT ANSWER LEAK**: 전기회로 Step0 설명에 '회로가 열려 있으면 전압은 존재하지만 전류는 0' 등 이후 예측 질문의 결과가 그대로 보임. A02 문구/ARIA/Voice 순서 수정, A06/A07 교육 검수 필요.
- [ ] 320px 상단 제목·카메라 툴·상태 라벨 충돌 해소 및 실제 SVG/라벨 bounding QA. **A03 UI_DESIGN_PASS=NO**, 오너 main 병합/배포 HOLD.
- 오너 인계 전체 SHA `6694e471d871e847c22956fe0425785002ba50fe`는 GitHub에서 조회되지 않음. **실제 PR HEAD는 `6694e47be8165db71e59a8a4c8c556292a572562`이며 CI 두 개 모두 이 SHA를 가리킴.**

## 아직 열려 있는 3대 품질 게이트

- **P0 학습 누설**: A02 PR#73 개념 도입에서 미리 `04 · 핵심 발견 완료`, `VGS≥Vth 채널 형성`, 전기회로 `5V 유지/전류0mA` 등 이후 예측 과제의 결론이 나오는 문제. A02 수정 후 A06/A07 교육 검수 필수.
- **P0 모바일 내부 밀집/CTA**: 320×640 모바일 첫 화면 Primary CTA 미노출, 측정값과 카메라 도구 중첩, 390에서도 단일 뷰포트 공존 보장 부족. A02/A08 실제 앱 수정 후 1440/390/320 검수.
- **P0 시각화 정합성**: `VisualSpec`의 catch-all circuit-intro는 의미상 맞는 레슨별 구조도를 보장하지 않음. A05/A06/A07 전 스텝 시각화 및 정답 선노출 점검 후 A03 디자인 검수.

## 담당자와 운영 규칙

- **A03** = 단일 UI/UX 및 아트디렉션 기준/최종 시각 QA. A02/A08 실제품/씬 캡처를 최신 디자인과 비교해 명시적 PASS/FAIL.
- **A02** = React 앱, 학습 FSM/저장/Voice/접근성/모바일·카탈로그, 앱 Chromium E2E, 실제 제품 스크린샷/QA.
- **A05** = 2.5D 과학 모델/실제 물리 장면 및 학습 단계에 맞는 컨셉 도해.
- **A08** = A05 장면 UI/조작 품질 코드 수정 및 A03 스타일 정합성.
- **A06/A07** = 교육 단계·원고/과학·정답 선노출 검수 (A07은 A06에게 직접).
- **A01/Owner** = 제품 구조/범위·최종 main 병합·배포 승인.

**디자인 변경 즉시** A03는 새로운 원본 HTML·이미지·구현 계약을 같은 작업 회차에 갱신하고, 대체된 구버전 디자인 파일은 브랜치 현재 트리에서 삭제합니다. 이전 이력은 Git 커밋과 PR에서 보존합니다. 다른 에이전트가 오래된 버전을 구현하지 않도록 #70/#21에 직접 차이와 담당/QA를 인계합니다. **main merge / deployment HOLD until owner approval**.

## 별도 활성 레슨 화면 및 과거 검수 증거

- **Lesson12 회로 스위치 전용 시안**: [갤러리 9장](GALLERY-lesson12.md), [실행형 레퍼런스](prototypes/a03-lesson12-switch-layout-reference.html), [A03 회로 UX 지침](UI-AUTHORITY-LESSON12-P0.md).
- **A08 독립 장면 PR #71/#72 검수**: [실제 Chrome 화면 비교](A03-A08-PR71-PR72-V3-visual-review.md). 기능 수정은 인정하나 독립 Scene Chrome 통과가 A02 제품 승인을 의미하지 않음.
- 과거 V2 시안은 현재 작업 원본이 아니므로 디자인 최신 폴더에서 정리하고 과거 Git 기록으로만 추적합니다.
