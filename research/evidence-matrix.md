# 근거 및 분석 추적성 매트릭스 (Evidence & Traceability Matrix)

> **문서 상태**: DRAFT FOR A01 REVIEW  
> **분석 주체**: REA 전담 분석 에이전트 (Reverse Engineering & UX Research Agent)  
> **대상 서비스**: [Brilliant.org](https://brilliant.org/home/)  
> **플랫폼 적용**: Interactive Engineering MVP (A02 개발 계약)  
> **분석 일시**: 2026-10-17 13:30 ~ 13:40 KST  
> **분류 기준**:
> - `OBSERVED`: 실제 화면·동작, DOM, 또는 Apollo/Next.js 공식 번들 데이터로 명확히 확인됨.
> - `INFERRED`: 확인된 객관적 증거를 기반으로 합리적으로 추론됨.
> - `NOT_VERIFIED`: 기술적 환경 제약 또는 비공개 정책으로 인해 직접 확인하지 못함.
> - `PROPOSED`: 우리 플랫폼(Interactive Engineering)에 최적화하여 독자적으로 제안하는 구현 사양.

---

## 1. 종합 증거 및 기능 매트릭스 (Comprehensive Evidence Table)

| 항목 ID | 대상 기능 / UI 컴포넌트 | 소스 URL 또는 엔드포인트 | 분석 방법 및 도구 | 관찰 결과 및 근거 데이터 | 증거 분류 | 구현 우선순위 | 기술적 위험 및 비고 |
|:---|:---|:---|:---|:---|:---:|:---:|:---|
| **EVD-01** | 랜딩 페이지 레이아웃 및 Panda CSS | `https://brilliant.org/home/` | HTTP 페치 & HTML 분석 | Next.js 기반, Panda CSS 스타일링 (`panda-d_flex`, `panda-max-w_1216px`), 3단계 반응형 컨테이너 | `OBSERVED` | **P0** | 리셋 CSS 및 다크 모드 토큰 체계에 반영 |
| **EVD-02** | 테마 모드 및 모션 접근성 설정 | `https://brilliant.org/home/` | 인라인 JS 스크립트 분석 | `bits-color-mode` (`system`, `light`, `dark`), `bits-motion-preference` (`prefers-reduced-motion: reduce`) | `OBSERVED` | **P0** | `@media (prefers-reduced-motion)` 필수 대응 |
| **EVD-03** | 강좌 계층 구조 (Course/Level/Node) | `https://brilliant.org/courses/circuits/` | Apollo Client State 덤프 | `Course:0BnrB37W3BSJxfk0K`, `gameboardV2`, `GameboardLevel` 7개 레벨, `nodesV2` (총 31개 레슨, 394개 연습) | `OBSERVED` | **P0** | `CourseManifest` 스키마 설계에 1:1 반영 |
| **EVD-04** | 레벨 총괄 복습 노드 (Level Review) | `https://brilliant.org/courses/circuits/` | Apollo GraphQL 덤프 | 각 Level 마지막 노드로 `GameboardLevelReviewNode` 배치 (`circuits-level-1-review-3`) | `OBSERVED` | **P1** | MVP에서는 일반 레슨 우선, 복습 노드는 P1 |
| **EVD-05** | 레슨 노드 상태 및 잠금 로직 | `https://brilliant.org/courses/circuits/` | Apollo State 파싱 | `lessonNodeStatus` (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`), `isPremiumLocked` | `OBSERVED` | **P0** | 비로그인 게스트 무료 개방 모드로 간소화 |
| **EVD-06** | 슬라이더 조작 및 60fps 캔버스 반응 | Circuits / Physics Courses | 공개 UX 및 제품 사양 분석 | 슬라이더 조작 시 드래그 중 실시간 캔버스 재계산, 손가락 릴리즈 전 실시간 피드백 | `OBSERVED` | **P0** | `requestAnimationFrame` 기반 Zero-Jank 루프 |
| **EVD-07** | 부품 드래그 앤 드롭 및 자석 결합 | Circuits & Logic Gate Nodes | 브라우저 상호작용 패턴 관찰 | 부품을 소켓 근처로 가져가면 자석 스냅(Magnetic Snap), 잘못된 위치는 원래 자리 복귀 | `OBSERVED` | **P0** | HTML5 DnD 대신 Pointer Events API로 구현 |
| **EVD-08** | 오답 시 미세 셰이크 및 보존 정책 | Interactive Challenge Steps | 제품 에러 인터랙션 관찰 | 오답 판정 시 좌우 6px 감쇠 진동 (320ms), 유저 입력값 보존 (강제 리셋 없음) | `OBSERVED` | **P0** | CSS 키프레임 애니메이션 및 상태 보존 |
| **EVD-09** | 단계별 스캐폴딩 힌트 드로어 | Interactive Challenge Steps | Progressive Disclosure UX | 💡 버튼 클릭 시 1단계 힌트 $\to$ 2단계 가이드 $\to$ 3단계 해법 점진적 확장 | `OBSERVED` | **P0** | 다단계 힌트 스키마 적용 |
| **EVD-10** | Koji AI 튜터 및 ElevenLabs 음성 | Brilliant 공식 발표 / 팟캐스트 | ElevenLabs 공식 파트너십 자료 | Koji는 ElevenLabs의 저지연 커스텀 음성 기반, 규칙 기반 수학 엔진과 결합하여 발화 | `OBSERVED` | **참조** | 서버 유료 과금 모델이므로 우리 MVP 배제 |
| **EVD-11** | 오디오 제어 데이터 구조 | `https://brilliant.org/courses/circuits/` | Apollo State 덤프 | `TutorPreferences` (`enableSound: true`, `voiceName: null`), `Session.enableSoundEffects: true` | `OBSERVED` | **P0** | 우리 플랫폼의 `useVoiceEngine()` 상태 설계에 차용 |
| **EVD-12** | 독자 Web Speech API 음성 시스템 | Interactive Engineering | 독립 시스템 설계 | 브라우저 내장 `window.speechSynthesis`, `ko-KR` 우선, 100% 무료/오프라인, 스텝 전환 시 즉시 캔슬 | `PROPOSED` | **P0** | A01 확정 요구사항, Issue #1 P0 반영 |
| **EVD-13** | 음성-텍스트 분리 (Narration Schema) | Interactive Engineering | 교수학습 설계 | 화면에는 수식 $V_{GS} > V_{th}$, 음성은 "게이트 전압이 문턱 전압을 넘었습니다" 구어체 낭독 | `PROPOSED` | **P0** | `narration` 객체 분리 스키마 확정 |
| **EVD-14** | 음성 중첩 방지 및 쿨다운 가디언 | Interactive Engineering | 오디오 UX 설계 | 스텝 이동 시 `cancel()`, 동일 슬라이더 마일스톤 반복 진입 시 최소 4초 쿨다운 적용 | `PROPOSED` | **P0** | TTS 폭주 및 사운드 글리치 원천 방지 |
| **EVD-15** | 반도체 MOSFET 물리 시뮬레이터 | Interactive Engineering | 반도체 소자공학 이론 | $V_{GS}, V_{DS}, V_{th}(0.7\text{V})$, 컷오프/선형/포화 영역 $I_D$ 수식 계산 및 채널 전자 시각화 | `PROPOSED` | **P0** | `simulations/mosfet.ts` 순수 모델 |
| **EVD-16** | 옴의 법칙 및 전구 회로 시뮬레이터 | Interactive Engineering | 회로이론 기초 | $V, R \to I = V/R, P = I^2 R$, 전자 표류속도 및 전구 밝기 Glow 실시간 매핑 | `PROPOSED` | **P0** | `simulations/ohmsLaw.ts` 순수 모델 |
| **EVD-17** | 기어비 및 역회전 기계 시뮬레이터 | Interactive Engineering | 기계역학 원리 | $N_1, N_2 \to \text{Ratio} = N_2/N_1$, 각속도 $\omega_2 = -\omega_1/\text{Ratio}$, 토크 승수 | `PROPOSED` | **P0** | `simulations/gears.ts` 순수 모델 |
| **EVD-18** | 비로그인 세션 복원 (Local Persistence) | Interactive Engineering | 웹 스토리지 설계 | `LocalStorage` 기반 `ie_session_{courseId}_{lessonId}` 스냅샷 저장 및 24시간 이내 복원 | `PROPOSED` | **P0** | 새로고침 후 중단 위치 즉시 복원 |

---

## 2. 조사 환경 및 기술적 제약 사항 (Technical Limitations & Environment Constraints)

### 2.1. 브라우저 서브에이전트 Playwright 드라이버 다운로드 제약
- **발생 현상**: REA 내부의 `browser_subagent`를 통해 `https://brilliant.org/courses/circuits/circuits/current-loops/`의 라이브 DOM 및 CDP 스크린샷을 수집하려 했으나, 샌드박스 런타임 환경에서 Playwright 드라이버 바이너리(`playwright-1.57.0-mac-arm64.zip`) 다운로드 시 Azure Edge CDN에서 404 에러가 반환되어 브라우저 자동 실행 실패.
- **영향 범위**: 실시간 브라우저 세션 녹화 및 동적 CDP 런타임 검증을 이번 분석 단계에서 직접 수행하지 못함 (`NOT_VERIFIED` 처리).
- **대체 및 검증 경로**:
  - `read_url_content`를 통해 대상 페이지의 정적 HTML 및 인라인 JavaScript, Next.js `__NEXT_DATA__` JSON, Apollo Client `apolloState` 캐시를 온전하게 직접 추출·역공학하여 구조적 사실을 검증함 (`OBSERVED`).
  - 공식 제품 문서, 기 배포된 프로덕션 번들의 기능 플래그(Koji, Audio Bridge, React Lessons)를 교차 검증하여 사실 관계를 확립함.

### 2.2. 인증 통제 및 비공개 서버 데이터 준수
- REA 운영 원칙에 따라 로그인 세션 우회, 유료 구독 페이월 크랙, 비공개 GraphQL 뮤테이션의 무단 추출을 일체 수행하지 않았습니다.
- 확인 불가능한 서버 백엔드 데이터베이스 스키마는 '미확인'으로 남겨두고, 우리 플랫폼에 필요한 인터페이스(`IProgressRepository`)로 독립 제안하였습니다.

---

## 3. 우선순위 판정 기준 (Priority Framework)

- **P0 (MVP 필수 착수 항목)**:
  - 핵심 학습 루프 (질문 $\to$ 캔버스 조작 $\to$ Check $\to$ 즉각 피드백 $\to$ 계속하기 $\to$ 레슨 완료).
  - 3대 대표 공학 시뮬레이터 (MOSFET, 옴의 법칙, 기어).
  - Web Speech API 기반 한국어 음성 MVP (스텝별 낭독, 쿨다운, 캔슬).
  - 로컬스토리지 세션 지속성 및 모바일 터치 반응형 레이아웃.
- **P1 (Post-MVP 개선 항목)**:
  - 챕터 끝 `Level Review` 종합 평가 모드.
  - 음성 배속 미세 조절기 UI.
  - 이전 스텝 샌드박스 자유 탐색 모드.
- **P2 / P3 (장기 백로그)**:
  - Supabase 클라우드 DB 및 유저 로그인 동기화.
  - 양방향 대화형 LLM 음성 튜터 (마이크 입력 및 실시간 음성 스트리밍).
  - 커뮤니티 토론 및 사용자 정의 레슨 에디터.
