# A03 디자인 최신본 (Single Source of Truth)

> **현재 A02 구현 기준: MOSFET Discovery Lab V2** · 마지막 동기화: 2026-10-18 KST
>
> **구분:** A03 디자인 레퍼런스 · 공식 A02 React 앱 구현/릴리스 아님. 최종 제품 승인과 main 병합/배포는 별도.

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
