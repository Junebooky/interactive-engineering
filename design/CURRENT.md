# A03 최신 UX 인덱스 · 2026-10-18

**현재 우선 구현 기준 = V3 모바일 학습 화면/강좌 카탈로그/시각화 보장.** [P0 작업 #70](https://github.com/Junebooky/interactive-engineering/issues/70) · [V3 상세 구현 계약](https://github.com/Junebooky/interactive-engineering/blob/design/a03-mosfet-discovery-v1/design/A03-V3-mobile-catalog-visual-coverage-contract.md).

- V3 A03 프로토타입 이미지는 2026-10-18 A03 ChatGPT 대화의 **catalog 1440/390, MOSFET 1440/390/320, 원본 HTML/CSS/SVG**에서 실제 Chromium으로 렌더링해 공개했습니다. **A02 정식 제품 캡처 아님**.
- **GitHub 텍스트 명세/작업 카드가 최신 기준이며 PNG/HTML V3 바이너리는 현재 ChatGPT 패키지에만 있음.** A02에게 과거 V2 PDF/PNG를 V3로 오인하여 구현하라는 지시 금지. 디자인 자산 동기화 TODO를 OPEN으로 둡니다.
- 기존 MOSFET V2 갤러리/실행형 HTML은 **이전 레퍼런스**(공식 새 구현 합격 기준 아님). 새 V3 시안 소스/이미지의 GitHub 업로드와 CI가 검증되기 전에는 사용 가능한 이전 파일을 삭제해 인계가 끊기지 않도록 하고, 교체본 업로드 후 오래된 파일을 A03 브랜치에서 즉시 정리합니다.
- **A02:** `lessonA03.css` mobile 49dvh/absolute tools/negative overlap, `CourseCatalogModal.tsx` giant columns, `LessonPlayer.tsx` null scene + MOSFET hardcode, `A03SingleTaskPanel.tsx` concept/done dual CTA 모두 수정. 실제 앱 HEAD+CI+3폭 screenshots.
- **A05:** 각 CONCEPT의 의미 있는 안전한 2.5D 도해 및 실험 scene responsive scientific props, QA evidence/HEAD 직접 인계. A03 UI 감리, A06/A07 과학 검수.
- 진행/최종 릴리스: owner main 병합/배포 승인 전 HOLD.

---

## 이전 인계 이력 (V2 및 Lesson12)

> **현재 시각 기준: MOSFET Discovery Lab V2**, 전기회로 Lesson12는 [P0 UX 보정 사양](UI-AUTHORITY-LESSON12-P0.md)을 추가 적용 · 마지막 동기화: 2026-10-18 KST
>
> **구분:** A03 디자인 레퍼런스 · 공식 A02 React 앱 구현/릴리스 아님. 최종 제품 승인과 main 병합/배포는 별도.

## 모든 레슨에 우선 적용되는 A03 UI 설계 책임/중요 수정

> **P0 현재 문제:** Lesson12 '회로 스위치'가 Problem 안에 있음, 전기회로에 MOSFET 전용 문구가 혼입됨, A05 scene 팔레트가 A03 공통 토큰에서 이탈. **[A03 전체 UI 지침 및 정확한 수정 계약](UI-AUTHORITY-LESSON12-P0.md)** · **[A02/A05 공동 차단 이슈 #65](https://github.com/Junebooky/interactive-engineering/issues/65)**.
>
> A03는 모든 학습 화면의 최종 UI/UX 디자인 기준·디자인 QA를 소유합니다. A02는 앱 구현, A05는 물리 장면 구현을 소유하고 시각/행동/컴포넌트 기준은 A03 최신본을 따릅니다. 과학·교육 정확성은 A05/A06/A07과 협의하며 오너 승인 전 main 병합/배포 금지입니다.

## Lesson 12 전기회로 (현재 UX P0) — 별도 최신 화면 확보

**새 A03 전기회로 UI 레퍼런스**: [Lesson12 예측 / 실험 도크 / 완료 이미지 9장](GALLERY-lesson12.md) · [실행형 HTML/디자인 소스](prototypes/a03-lesson12-switch-layout-reference.html) · [1440/390/320 Chromium 검증](https://github.com/Junebooky/interactive-engineering/actions/runs/39050723828). **회로 스위치가 Problem에서 빠지고 2.5D에 붙은 Experiment Control Dock으로 이동한 시안**입니다. 이는 A03 별도 HTML 참조 화면이며 A02 공식 React 앱 화면은 아직 아닙니다.

**시각 역할**: MOSFET은 V2 레퍼런스, Lesson12 전기회로는 이 별도 최신 갤러리/HTML이 기준입니다. 공유 색·글자·버튼 시스템은 동일하고 물리 구조/과학 표현은 각 레슨별 A05 모델로 별도 구현합니다.

## 지금 A02가 구현할 유일한 디자인 기준

| 우선순위 | 리소스 | GitHub 단일 최신 경로 |
|---|---|---|
| 1 | 실제 화면 비교용 PNG 8장 | [MOSFET 최신 갤러리](GALLERY-mosfet-v2.md) |
| 2 | 작동하는 레퍼런스 HTML/CSS/SVG | [최신 디자인 프로토타입](prototypes/a03-mosfet-discovery-v2.html) |
| 3 | React 상태·컴포넌트·레이아웃·접근성 인계 | [A02 구현 계약](A02-implementation-contract-mosfet-v2.md) |
| 4 | 현재 의사결정과 미완료 과제 | [V2 디자인 결정 기록](a03-mosfet-discovery-lab-v2.md) |
| 5 | PNG 재생성/검증 스크립트 | [Playwright 디자인 레퍼런스 스크립트](prototypes/capture-reference.mjs) |
| 6 | 디자인과 실제 제품 간 이슈 | [A02 구현 이슈 #58](https://github.com/Junebooky/interactive-engineering/issues/58) / [A03 Draft PR #55](https://github.com/Junebooky/interactive-engineering/pull/55) |

이 파일이 **고정 진입점**입니다. A02는 오래된 댓글/스크린샷/버전별 링크가 아니라 **항상 여기서 현재 파일을 열어** 작업해야 합니다. 브랜치명에 `v1`이 남아 있는 것은 기존 PR의 역사적 이름이며 **내용 버전은 V2**입니다.

## 변경 즉시 동기화 규칙 (오너 요청)

디자인 방향이 바뀌면 A03는 **같은 작업 회차에서** 다음 순서로 처리합니다.

1. 변경 요청 범위를 확인하고 새 디자인/상태가 실제로 준비되었는지 검증합니다. *시안 이미지와 공식 앱 스크린샷을 혼동하지 않습니다.*
2. 작업 중인 **A03 Draft 브랜치**에 **최신 HTML/CSS/SVG 및 갤러리 이미지**를 먼저 추가/교체하고, React 구현 명세·상태·반응형 수치·비교 기준을 함께 맞춥니다.
3. **기존 화면의 더 이상 사용하지 않는 PNG/HTML/명세 파일을 현재 브랜치에서 삭제합니다.** 서로 충돌하는 V1/V2/V3 파일을 동시에 "최신 디자인"으로 운영하지 않습니다.
4. 이 `design/CURRENT.md`를 최신 링크로 갱신합니다. 레퍼런스 이미지로 이룬 QA와 실제 A02 앱 QA는 반드시 분리하여 표기합니다.
5. [A02 #58](https://github.com/Junebooky/interactive-engineering/issues/58), [A03 #54](https://github.com/Junebooky/interactive-engineering/issues/54), [공동 현황판 #21](https://github.com/Junebooky/interactive-engineering/issues/21)에 **새 버전/브랜치 SHA, 추가·교체·삭제 파일 목록, 디자인 차이, 실앱 미적용 부분, 다음 담당자**를 직접 전달합니다.
6. **A02는 변경된 화면만 회귀 검증**하고 실제 React 앱 테스트 SHA/CI/PNG를 제출합니다. A03는 시안과 실제 앱의 시각·사용성 차이표를 검수한 뒤 완료 여부를 업데이트합니다.

### 삭제의 의미와 안전 경계
- **삭제 대상:** A03 디자인 브랜치에서 현재 사용하지 않는 이전 버전 페이지/이미지/프로토타입 및 잘못된 중복 인계 문서.
- **삭제 금지:** A02/A05 소유 코드, 학습 원고·과학 모델·다른 팀의 PR, 사용자 확인 없이 main의 파일, 본 이슈의 감사 이력 및 CI 증거.
- GitHub에서 파일을 삭제해도 이전 Git 커밋 기록과 기존 Issue 댓글 기록은 남습니다. 새로운 사용자는 이 최신 인덱스만 보면 됩니다.
- **예외:** 정확한 비교에 필요한 과거 증거는 버전별 Git SHA/PR 링크로 추적할 수 있으나 현재 디자인 폴더에 낡은 사본을 중복 유지하지 않습니다.
- main 병합·배포는 오너 별도 승인 전 절대 금지. 자동 스케줄링은 설정하지 않습니다.

## 이번 적용
- [x] V2 최신 디자인·8장 PNG·HTML·A02 구현 계약/기준 GitHub에 존재.
- [x] 단일 최신 디자인 진입점 제공.
- [x] 이전 V1 별도 핸드오프 문서 삭제(Commit history로 복원 가능).
- [ ] A02 실제 제품 UI V2 적용, A05/A07 물리·교육 검수, 실제 iOS/Voice/스크린리더 QA 및 출시 승인: **별도 미완료**.
