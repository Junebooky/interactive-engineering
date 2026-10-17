# A03 → A02 구현 계약: MOSFET Discovery Lab V2

> ⚠️ **항상 [단일 최신 디자인 인덱스](CURRENT.md)를 우선 확인하세요.** 교체된 이전 페이지를 따라 구현하지 마세요.
> 2026-10-18 · 오너의 실제 코드 구현·인계 요청을 반영한 **구현 지시/디자인 기준 문서**. 이 문서는 A03의 별도 V2 디자인을 설명하며, A02 실앱 구현 완료 또는 과학 검수 PASS를 주장하지 않습니다. **main 병합/배포 승인은 별도**입니다.

## 0. 반드시 먼저 열 파일
1. **[실행 가능한 원본 디자인 HTML](prototypes/a03-mosfet-discovery-v2.html)** — V2 화면의 구조·스타일·2.5D SVG·한국어 카피·기본 전환을 포함. URL을 브라우저에서 열거나 clone 후 직접 실행하세요. 실제 앱 소스가 아닌 *visual reference*입니다.
2. **[동일 원본에서 8종 PNG를 다시 만드는 Playwright 스크립트](prototypes/capture-reference.mjs)** — desktop 1440×900 / mobile 390×844 / mobile-320 320×640, 예측/관찰/완료 화면. 소스 기반으로 재현 가능한 것이 핵심입니다.
3. [V2 디자인 결정 기록](a03-mosfet-discovery-lab-v2.md) 및 [A03 작업 #54](https://github.com/Junebooky/interactive-engineering/issues/54).
4. **A02의 현재 제품 코드**에서 실제 변경할 컴포넌트는 \`src/components/common/Header.tsx\`, \`src/components/player/LessonPlayer.tsx\`, \`PromptCard.tsx\`, \`TutorPanel.tsx\`, \`ActionBottomBar.tsx\`, \`src/index.css\`; A05 \`A05SceneVisual\`은 기존 검증된 물리 장면을 **재사용**. 마지막으로 확인한 제품 기준: A02 Draft PR #44 HEAD \`6c48cbf\`. 시작 전 A02가 최신 브랜치/통합 계약을 확인하세요.

## 1. 제품/콘셉트 경계
- **그대로 구현할 것**: 레이아웃, 간결한 내비게이션, 색상·텍스트 위계, 주요 CTA, 답변 카드 스타일, 적절한 폰트·터치 영역, 모바일 시뮬레이터 + 바텀시트의 동시 가시성.
- **실제 코드로 교체할 것**: 프로토타입의 로컬 toy 상태/내장 2.5D SVG/나가기·다음 단계 alert/직접 localStorage 액션 → A02의 typed learning FSM + validated action adapter + A05의 과학 모델/SceneVisual + 공식 TTS/진도/복구 로직.
- **완료 주장 금지**: 디자인 HTML 렌더링 PASS와 공식 React 앱 Chromium E2E, A07 과학 교육 검수, 실제 iOS/Safari/스크린리더 사용성은 각각 독립 체크.

## 2. 5가지 필수 시각 기준 (대체 UI 임의 설계 금지)
| 번호 | 컴포넌트 | 정확한 목표 |
|---|---|---|
| V2-01 | immersive header | 학습 중 GNB와 중복 breadcrumb 완전 제거. 왼쪽 \`← 나가기\`, 중앙 단일 슬림 progress, 상세 단계는 실험 패널에서만. 상단 badge 스택/상시 "자동 저장" 금지. 저장 성공 시만 비침투 토스트/아이콘. |
| V2-02 | CTA | 예측=실험 시작 1개, 관찰=설명하기 1개, 피드백=다시 생각해보기 혹은 다음 1개, 완료=\`다음 실험으로 넘어가기 →\`만 solid teal. 이전/다시 실험은 secondary. 중복 footer 제거. |
| V2-03 | panel | 큰 흰색 단일 면; nested border-box 금지. \`핵심 발견\`만 \`#F2F4F6\`류의 은은한 면. 음성 튜터는 간결한 row/inline text. |
| V2-04 | 2.5D | scene 내 소스/게이트/드레인/실리콘 direct labels. 중복 범례·상태 배지 제거. \`ⓘ 모델 기준\` + 확대/축소/리셋을 한 툴 그룹으로; 실제 씬의 pan/zoom 허용 여부는 A05 승인. pre-prediction tooltip도 threshold/정답 노출 금지. |
| V2-05 | mobile | 390: 헤더 58px + 2.5D 상단 약 49dvh, bottom sheet 나머지. sheet 내부 콘텐츠만 scroll, CTA sheet 하단 유지. 320/높이 700미만: lab 42dvh, 정보 우선순위/버튼 44px 이상 확보. 드래그 리사이즈 제스처는 V2 이미지에 보이는 grip만 제안이며 아직 실제 동작 구현 아님. |

## 3. 시각 디자인 토큰 (HTML을 source of truth로 삼되 실앱 접근성 검사)
- body \`#F5F7F7\`, lab \`#102333\`, text \`#152431\`, secondary text \`#65757C\`, brand CTA \`#087C6D\`, hover/interaction \`#0C947F\`, border \`#E6EBEB\`, accent pale \`#EBF7F3\`.
- Desktop header **68px**, 1440 canvas horizontal padding **32px**, stage/learning grid **minmax(0, 1.77fr) minmax(390px, .8fr)**, gap **20px**, lab corners **23px**, panel corners **23px**. Scene is priority; at 1100–700px use V2 breakpoint adaptation; under 700px use mobile layout from HTML.
- UI text fallback \`Noto Sans KR\` / \`Pretendard\` / \`Apple SD Gothic Neo\`; load with permitted product fonts, never silently substitute unlicensed font assets.
- Label, helper text, icon states and focus ring must preserve WCAG 2.2 AA (normal >=4.5:1, large >=3:1, meaningful nontext indicator >=3:1). No correctness based on color alone.

## 4. 학습 상태 계약 (A02 소유, 디자인이 점수/성공을 판정하지 않음)
| 상태 | 학생 눈에 보이는 행동 | 2.5D/ARIA/TTS 가림 | 활성 CTA |
|---|---|---|---|
| ASK/PREDICT | \`0 / 0.6 / 1.2V\` 중 예상 선택 | 구조/부품 label만; 결과 전자·모델 threshold·정답 효과·튜터 spoilers 모두 차폐. DOM/ARIA/Voice에서도 안 들려야 함. | 예측 제출하고 실험 시작 (선택 전 disabled + 안내) |
| EXPLORE | 예측 제출 후 \`VGS 0.0..1.2V/0.1V\` 조작 | scene A05 current physical inputs 사용. 직접 결과 관찰 가능. | 방문 이력 충족 전 비활성 |
| OBSERVE | 저전압 0V와 높은 전압 >=0.8V **양쪽 실제 방문** | 히스토리는 A02 validated reducer가 기록. 조작 결과를 숫자/문장 모두 표시. | 비교 완료 · 설명해 보기 |
| EXPLAIN | 전자 위치 원리 3-4 선택지 | 채점 전 정답 강조 없음, 기존 과학 원고 정답 키 사용. | 내 설명 확인하기 |
| FEEDBACK | 오개념별 중립적 원인 설명 + 힌트 | 색+텍스트+아이콘으로 전달, 특정 오개념/정답 자동 패스 불가. | 다시 선택/재도전 |
| DONE | 원인→결과 microcopy, 다음 단계 단서 | 완료와 저장 성공은 별개의 이벤트; 다음 단계 이동은 라우터/FSM으로 실제 작동. | 다음 실험으로 넘어가기 |

**중요 과학 조건**: 이 레슨은 toy \`Vth=0.7V\`이며 보편적인 실제 반도체값 아님. MOSFET S01에서 \`VDS=0 V\`이면 반전 채널이 생겨도 **순 정상상태 드레인 전류 = 0A**. gate oxide로 전자가 관통한다고 보여 주지 말 것. A05 물리 모델과 A07 교육 검수로 최종 확정.
**권장 초보자 문장**: "문턱 전압(Vth)을 넘자 전자가 실리콘 표면에 모이며 길이 열렸어요. 하지만 아직 양끝 전압 차(VDS)가 0V라서 순 전류는 흐르지 않아요."

## 5. React 통합 경로 / 예상 소유 파일
- \`Header.tsx\`: lesson immersion인지 판별하여 GNB 제거, \`onExit\`/progress/Voice controls 재배치. 목록 화면의 기존 GNB는 유지.
- \`LessonPlayer.tsx\`: \`LessonLabLayout\` (2.5D left/top, prompt right/bottom) UI slot 구조; 기존 \`renderSimulator()\`와 lesson selection map은 유지. 모바일 바텀시트가 화면 높이를 적절히 할당하도록 100dvh/min-height/overflow 조정.
- \`PromptCard.tsx\`: FSM별 질문, 예측/슬라이더/설명/피드백; duplicate CTA 대신 메인 행동 1곳. \`ActionBottomBar\` 기존 인터랙션을 제거하기 전에 상태 동작/키보드 처리 모두 panel로 이동.
- \`TutorPanel.tsx\`: pre-predict anti-spoiler를 보장하는 narration gating, compact display, ko-KR voice 미지원 시 텍스트 폴백. 실제 A02 VoiceSettingsModal과 연결.
- \`src/index.css\` 또는 scoped style module: V2 토큰과 세 breakpoint, safe-area bottom inset, reduced-motion, focus-visible, accessible target.
- \`A05SceneVisual\`은 렌더 영역 및 \`showObservation\`/보안 가림 프로퍼티만 연결; 별도 A03 toy SVG를 제품으로 복사해 기존 과학 코드를 대체하지 말 것.

## 6. 디자이너 최종 리뷰 조건 (A02 PR에 새 실제 앱 화면을 첨부)
- [ ] 기능: ASK→PREDICT→MANIPULATE(0, >=0.8 모두)→EXPLAIN→MISCONCEPTION RETRY→DONE→실제 NEXT까지 A02 앱에서 통과.
- [ ] 과학: 음성/툴팁/DOM/ARIA도 예측 전에 관찰값·해설이 노출되지 않음; \`VDS=0\` 전류 오개념 없음.
- [ ] 이미지: **1440×900, 390×844, 320×640** 3 화면 크기 × **predict / observe / done** (가능한 9장, 작은 화면 관찰 포함) 실제 제품 Chromium PNG와 A03 기준 캡처를 같은 viewport/DPR/폰트로 나란히 비교. 1차 디자인 parity 미합격이면 A02↔A03 반복 수정.
- [ ] 차이표: \`visual parity\` (공간비중/텍스트/색상/크기), \`interaction parity\` (버튼/바텀시트/Voice), \`science/semantics parity\` (내용/가림)로 각각 pass/fail, 차이 내용·근거·담당 등록.
- [ ] 모바일: overflow 0, sheet만 스크롤, top scene 항상 관찰 가능, CTA 가려지지 않음, 조작 손가락 영역 >=44x44, 320에서 화면 잘림 없음. 키보드 viewport/가상 키보드 대응.
- [ ] 접근성: keyboard-only/focus order/radiogroup/slider aria/색상·대비/reduced-motion/screen reader/live region/한국어 caption.
- [ ] 예외상태: voice unsupported, pause/replay, loading/error/disabled, storage unavailable, reload recovery, exit / Next navigation, double tap.
- [ ] 실기기: iPhone Safari 및 Android Chrome, 한국어 TTS 실제 청취·초보 학습자 확인은 **별도 검증 게이트** (자동 PASS 주장 금지).
- [ ] 증거: 테스트 앱 HEAD SHA, CI run, Playwright 로그, 실제 앱 PNG, 미해결 이슈/담당자 남김.
- [ ] **출시/병합**: Draft 상태/오너 별도 승인 전 main merge 또는 배포 금지.

## 7. 디자인 참조 PNG 생성 (A02 참고)
원본 HTML은 **이미 GitHub에 존재**합니다. 아래 스크립트는 HTML을 열어 V2 reference PNG를 재현할 뿐, 제품 캡처가 아닙니다:

\`\`\`bash
# A02 Playwright dev 환경에서 실행 (필요 시 playwright 설치)
node design/prototypes/capture-reference.mjs
# design/reference-captures/a03-mosfet-v2/*.png
\`\`\`

**바이너리 PNG 8장은 GitHub 디자인 브랜치의 [현재 갤러리](GALLERY-mosfet-v2.md)에 커밋되어 있습니다.** 브라우저 재생성 코드와 갤러리 모두 A02 구현 비교의 기준입니다. 이미지와 UI가 픽셀 100% 같아야 한다는 무리한 기준 대신, 레이아웃·시각 위계·행동·과학/접근성 계약을 먼저 합격시키고 동일 브라우저 조건에서 편차를 줄이세요.

## 8. 책임/다음 순서
1. A02: 최신 앱 브랜치 지정 → 기존 동작 퇴행 방지 테스트 작성 → 몰입 header/sheet/CTA 통합 → 공식 앱 Chrome 3폭 × 3상태 캡처/CI → A03 리뷰 요청.
2. A05: V2 2.5D의 라벨/전자/절연막/툴 그룹과 A05 physics/scene props 일치 확인.
3. A06/A07: 카피/예측 가림/오개념/튜터 대사 검증. A07은 A06에게 직접 보고.
4. A03: A02 실제 제품 화면을 기준 시안과 비교, 차이를 우선순위별로 기록·후속 수정을 직접 인계.
5. A01/Owner: 범위와 출시 게이트 최종 결정. **main merge·배포 승인 없음**.

[Team Board #21](https://github.com/Junebooky/interactive-engineering/issues/21) · [A02 owner issue #1](https://github.com/Junebooky/interactive-engineering/issues/1) · [A03 issue #54](https://github.com/Junebooky/interactive-engineering/issues/54) · [A03 Draft PR #55](https://github.com/Junebooky/interactive-engineering/pull/55).
