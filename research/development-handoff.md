# A02 개발 에이전트 통합 구현 인수인계 계약서 (Development Handoff Specification)

> **문서 상태**: DRAFT FOR A01 REVIEW & APPROVAL  
> **발신**: REA 전담 분석 에이전트 (Reverse Engineering & UX Research Agent)  
> **수신**: 개발 총괄 A01 (검토/승인권자) $\to$ 개발 에이전트 A02 (구현 담당자)  
> **기준 이슈**: [Junebooky/interactive-engineering#2](https://github.com/Junebooky/interactive-engineering/issues/2) (분석) & [#1](https://github.com/Junebooky/interactive-engineering/issues/1) (개발)  
> **현재 상태**: **착수 대기 (Pending A01 Review)** — A01의 최종 승인 전까지 A02는 구현 코드를 작성하지 않음.

---

## 1. 프로젝트 목표 및 MVP 범위 (Executive Brief)

### 1.1. 제품 비전
**Interactive Engineering**은 글로벌 인터랙티브 교육 플랫폼인 Brilliant.org의 학습 경험(문제 해결 중심, 능동적 조작, 실시간 피드백, 60fps 시뮬레이션, 대화형 음성 가이드)을 공학 교육(반도체, 회로, 기계)에 접목한 차세대 웹 플랫폼입니다.

### 1.2. MVP 구현 범위 (Scope Boundary)
- **포함 (In-Scope - P0)**:
  1. **코어 플레이어**: 분할 화면(데스크톱 2열 45:55, 모바일 1열 스택), 진행 도트 헤더, 고정 하단 액션 바.
  2. **학습 엔진 (Learning Engine FSM)**: 도입 $\to$ 조작 $\to$ 검증 $\to$ 성공/실패 $\to$ 해설 $\to$ 진행의 상태 머신.
  3. **3대 대표 공학 시뮬레이터**:
     - 반도체: MOSFET 게이트 전압($V_{GS}$) 조절에 따른 반전 채널 형성 및 드레인 전류($I_D$) 특성.
     - 전기전자: 옴의 법칙($V = I \times R$), 전압/저항 조절에 따른 전류 변화 및 전구 밝기/전자 흐름.
     - 기계원리: 2단 맞물림 기어비($N_1, N_2$), 외접 맞물림에 따른 회전 방향 반전 및 각속도/토크 전달.
  4. **Voice Narration MVP**: Web Speech API (`window.speechSynthesis`), 한국어 (`ko-KR`) 우선, 스텝 이동 시 즉각 취소, 슬라이더 쿨다운(4초), 사용자 제스처 후 활성화.
  5. **세션 지속성 (Persistence)**: `LocalStorage` 기반 새로고침 복원 및 레슨 완료 기록.
  6. **반응형 조작성**: 모바일 터치 타깃($\ge 44\text{px}$), 가로 스크롤 방지, 부드러운 CSS/Canvas 렌더링.
- **제외 (Out-of-Scope - P1/P2 이관)**:
  - 서버 측 Supabase 사용자 계정/인증 (LocalStorage 인터페이스로 추상화).
  - 유료 ElevenLabs / 클라우드 TTS API (Web Speech API로 완전 대체).
  - 마이크 입력(STT) 및 실시간 양방향 LLM 대화.
  - 전 과목 전수 콘텐츠 제작 (대표 3개 레슨의 완결성 집중).

---

## 2. 권장 기술 스택 및 디렉터리 아키텍처

A02는 다음 기술 스택과 폴더 구조를 준수하여 구현하십시오.

### 2.1. 기술 스택
- **Framework**: Next.js 14+ (App Router 또는 Pages Router) 또는 React 18 + Vite
- **Language**: TypeScript (엄격 모드 `strict: true`, any 지양)
- **Styling**: Vanilla Tailwind CSS v3.4+ (Dark 모드 클래스 기반)
- **Math / Physics Rendering**: Pure SVG + HTML5 Canvas (2D Context)
- **Audio**: Web Speech API (`SpeechSynthesisUtterance`)
- **State Management**: React `useReducer` + Custom Context (외부 거대 라이브러리 지양)

### 2.2. 소스코드 디렉터리 구조 (`src/` 권장안)
```
src/
├── app/ 또는 pages/          # 라우팅 (강좌 목록, 로드맵, 레슨 플레이어)
│   ├── courses/
│   │   └── [courseSlug]/
│   │       └── [lessonSlug]/page.tsx
│   └── page.tsx              # 홈 / 카탈로그
│
├── features/learning/        # 핵심 학습 엔진 계층
│   ├── LearningContext.tsx   # FSM 상태 제공자
│   ├── learningReducer.ts    # 상태 전이 리듀서
│   ├── types.ts              # 학습 엔진 인터페이스
│   └── useLearningEngine.ts  # 커스텀 훅
│
├── components/
│   ├── lesson/               # 공통 플레이어 레이아웃
│   │   ├── LessonPlayer.tsx
│   │   ├── LessonHeader.tsx
│   │   ├── PromptCard.tsx
│   │   ├── ActionBottomBar.tsx
│   │   ├── FeedbackSheet.tsx
│   │   └── HintDrawer.tsx
│   │
│   ├── interactive/          # 인터랙션 UI 위젯
│   │   ├── ParameterSlider.tsx
│   │   ├── SwitchToggle.tsx
│   │   ├── DraggablePalette.tsx
│   │   └── DynamicGraphView.tsx
│   │
│   └── voice/                # 음성 제어 UI
│       └── VoiceControls.tsx
│
├── simulations/              # 순수 수학/물리 엔진 (렌더러 비종속)
│   ├── types.ts              # SimulatorAdapter 인터페이스
│   ├── mosfet/
│   │   ├── mosfetModel.ts    # 물리 공식 (Cutoff, Triode, Saturation)
│   │   └── MosfetCanvas.tsx  # 2D 시각화 (산화막, 전자 도트)
│   ├── ohmsLaw/
│   │   ├── circuitModel.ts   # V=IR, 전력 계산
│   │   └── CircuitCanvas.tsx # 전구 글로우, 도선 전자 점선
│   └── gears/
│       ├── gearModel.ts      # 기어비, 각속도, 토크 계산
│       └── GearCanvas.tsx    # SVG/Canvas 치차 회전 맞물림
│
├── content/                  # 강좌 및 레슨 순수 데이터
│   ├── courses.ts            # 전체 강좌 메타데이터 목록
│   ├── semiconductor/
│   │   └── mosfetLesson.ts   # 스텝 1~4 데이터
│   ├── circuits/
│   │   └── ohmsLawLesson.ts  # 스텝 1~4 데이터
│   └── mechanics/
│       └── gearsLesson.ts    # 스텝 1~4 데이터
│
└── lib/
    ├── voice/
    │   └── webSpeechEngine.ts# SpeechSynthesis 래퍼, 쿨다운 가디언
    └── storage/
        ├── progressStorage.ts# LocalStorage 인터페이스
        └── types.ts
```

---

## 3. 대표 3개 공학 레슨 상세 구현 명세 (Signature Lessons)

### 3.1. 레슨 1: 반도체 — MOSFET 채널 형성과 동작 원리
- **강좌/레슨 ID**: `semiconductor-mosfet-fundamentals`
- **학습 목표**: $V_{GS}$가 문턱전압 $V_{th}(0.7\text{V})$를 초과할 때 게이트 산화막 아래에 전도 채널이 형성되고 드레인 전류가 흐름을 체득.
- **스텝 구성 (총 3스텝)**:
  - **스텝 1 (문턱 전압과 채널 형성)**:
    - 지문: "게이트 전압 $V_{GS}$를 올려 문턱 전압 $0.7\text{V}$ 이상으로 만들어보세요."
    - 조작: 슬라이더 $V_{GS}$ ($0 \sim 2.5\text{V}$, step: 0.1V, 초기값 0.0V).
    - 시각 반응: $V_{GS} < 0.7\text{V}$이면 전자 없음. $V_{GS} \ge 0.7\text{V}$ 시 푸른색 전자 도트들이 산화막 아래에 집중되며 전도 채널 연결.
    - 통과 조건: $0.8\text{V} \le V_{GS} \le 1.5\text{V}$ 설정 후 Check.
    - 음성(INTRO): "반도체 스위치인 모스펫의 원리를 알아봅시다. 게이트 전압 슬라이더를 올려 문턱 전압 이상으로 만들어보세요."
    - 음성(마일스톤): "문턱 전압 0.7볼트를 넘었습니다! 전도 채널이 열렸습니다."
  - **스텝 2 (선형 영역 vs 포화 영역)**:
    - 지문: "드레인 전압 $V_{DS}$를 서서히 올려 핀치오프(Pinch-off)가 발생하는 포화 영역을 관찰하세요."
    - 조작: 슬라이더 $V_{DS}$ ($0 \sim 3.0\text{V}$, $V_{GS} = 1.5\text{V}$ 고정).
    - 시각 반응: $V_{DS} \ge V_{GS} - V_{th}$ ($0.8\text{V}$) 도달 시 드레인 측 채널 두께가 가늘어지는 핀치오프 연출.
    - 통과 조건: $V_{DS} \ge 1.0\text{V}$ (포화 상태 진입) 후 Check.
  - **스텝 3 (IV 곡선 탐색)**:
    - 지문: "$V_{GS}$와 $V_{DS}$를 조절하여 목표 전류 $4.0\text{mA}$를 달성하세요."
    - 통과 조건: $|I_D - 4.0\text{mA}| \le 0.2\text{mA}$.

---

### 3.2. 레슨 2: 전기전자 — 옴의 법칙과 전류 제어 ($V = I \times R$)
- **강좌/레슨 ID**: `circuits-ohms-law`
- **학습 목표**: 전압이 일정할 때 저항이 감소하면 전류가 증가하며, 전구의 밝기는 소비 전력($P = I^2 R$)에 비례함을 이해.
- **스텝 구성 (총 3스텝)**:
  - **스텝 1 (닫힌 회로와 전류)**:
    - 지문: "스위치를 닫아 배터리와 전구를 연결하세요."
    - 조작: 캔버스 내 토글스위치 클릭.
    - 시각 반응: 스위치 닫힘 $\to$ 도선 내 전자 점선 60fps 순환 시작 $\to$ 전구 밝게 점등.
    - 통과 조건: `switchClosed === true` 후 Check.
  - **스텝 2 (저항 조절과 전구 밝기)**:
    - 지문: "저항을 $50\Omega$에서 $20\Omega$으로 낮춰 전류를 증가시키세요."
    - 조작: 저항 슬라이더 ($10\Omega \sim 100\Omega$).
    - 시각 반응: 저항 감소 시 전자 이동 애니메이션 가속, 전구 Drop-shadow Glow 강도 증가.
    - 통과 조건: $R \le 25\Omega$ 후 Check.
  - **스텝 3 (목표 전류 맞추기)**:
    - 지문: "배터리 전압 $12\text{V}$에서 전류를 정확히 $0.4\text{A}$로 맞추기 위한 저항값을 설정하세요."
    - 통과 조건: $R = 30\Omega$ ($I = 12 / 30 = 0.4\text{A}$).

---

### 3.3. 레슨 3: 기계공학 — 기어비와 회전 전달
- **강좌/레슨 ID**: `mechanics-gears-transmission`
- **학습 목표**: 맞물린 기어의 회전 방향 반전, 잇수 비에 따른 회전 속도와 토크의 역비례 관계 체득.
- **스텝 구성 (총 3스텝)**:
  - **스텝 1 (회전 방향 반전)**:
    - 지문: "기어 1을 시계 방향으로 드래그하여 기어 2의 회전 방향을 확인하세요."
    - 조작: 기어 1 터치/마우스 회전 드래그.
    - 시각 반응: 기어 1 시계 방향 회전 시 기어 2는 정확히 반시계 방향으로 연동 회전.
    - 통과 조건: 누적 회전각 $\ge 360^\circ$ 달성 후 Check.
  - **스텝 2 (감속비와 잇수)**:
    - 지문: "구동 기어 잇수가 12개일 때, 속도를 절반으로 줄이려면 종동 기어 잇수를 얼마로 해야 할까요?"
    - 조작: 이산형 슬라이더 ($N_2 \in \{12, 18, 24, 36\}$).
    - 시각 반응: $N_2 = 24$ 선택 시 기어 2 직경 2배 확대, 회전 속도 $\omega_2 = \omega_1 / 2$.
    - 통과 조건: $N_2 = 24$ (기어비 2:1) 후 Check.
  - **스텝 3 (토크 증가의 이해)**:
    - 지문: "무거운 짐을 들어 올리기 위해 토크를 3배로 증폭시키는 기어 조합을 만드세요."
    - 통과 조건: $\text{Ratio} = N_2 / N_1 = 3.0$ (예: $N_1 = 12, N_2 = 36$).

---

## 4. Voice MVP 구현 규약 (Voice Contract)

A02는 음성 구현 시 다음 규칙을 엄격히 준수해야 합니다.

1. **외부 유료 라이브러리 금지**: `window.speechSynthesis`만 사용하며, ElevenLabs 등 외부 API 호출 금지.
2. **`ko-KR` 음성 우선 로드**:
   ```typescript
   const voices = window.speechSynthesis.getVoices();
   const koVoice = voices.find(v => v.lang === "ko-KR") || null;
   ```
3. **강제 캔슬 불변식**:
   ```typescript
   // 스텝 전환(Next / Prev), 레슨 종료, 컴포넌트 unmount 시 반드시 호출
   window.speechSynthesis.cancel();
   ```
4. **마일스톤 쿨다운 (최소 4초)**:
   - 슬라이더 이동 중 매 값마다 말하지 않고, 특정 임계점 통과 시 `Date.now() - lastSpokenTime > 4000`일 때만 발화.
5. **텍스트 낭독 정규화**:
   - 화면: "$V_{GS} = 1.2\text{V}$" $\to$ 음성: "게이트 전압 일 점 이 볼트".

---

## 5. 단계별 구현 로드맵 (Milestones for A02)

```
[Milestone Roadmap]
M0: 프로젝트 셋업 및 기본 빌드 환경
 ├── Next.js / Tailwind CSS / TypeScript 환경 설정
 └── 공통 타입 및 인터페이스 정의 (types.ts)
M1: 핵심 학습 엔진 및 플레이어 셸 (Shell)
 ├── useLearningEngine (FSM 리듀서)
 ├── LessonPlayer, Header, PromptCard, ActionBottomBar
 └── 로컬스토리지 진행률 복원
M2: 인터랙션 컴포넌트 및 시뮬레이션 엔진
 ├── ParameterSlider, SwitchToggle, DynamicGraph
 └── 3대 순수 물리 모델 (mosfetModel, circuitModel, gearModel)
M3: 2D 캔버스 렌더러 및 시각 효과
 ├── MOSFET 캔버스, 회로 캔버스, 기어 캔버스
 └── 60fps 전자 흐름 애니메이션, 정답 체크마크 팝, 오답 셰이크
M4: Voice Narration 엔진 통합 및 데모 레슨 탑재
 ├── WebSpeechVoiceEngine 및 쿨다운 가디언
 ├── 3개 대표 레슨 데이터 작성 및 통합 테스트
 └── 모바일 반응형 터치 QA 및 빌드 검증
```

---

## 6. 구체적인 수용 기준 (Acceptance Criteria & Verification Checklist)

A02는 구현 완료 후 아래 체크리스트를 전수 검증하여 PR을 제출해야 합니다.

- [ ] **빌드 및 타입 무결성**: `npm run build` 및 `tsc --noEmit` 실행 시 0 에러.
- [ ] **학습 루프 완결성**: 비로그인 방문자가 강좌 선택 $\to$ 레슨 1 진입 $\to$ 슬라이더 조작 $\to$ Check 검증 $\to$ Continue $\to$ 스텝 완료까지 막힘없이 진행.
- [ ] **3대 시뮬레이터 동작**:
  - MOSFET: $V_{GS}$ 조절 시 전자 도트 및 채널 두께 실시간 렌더링.
  - 회로: 전압/저항 조절 시 전류계 수치 및 전구 밝기 Glow 실시간 반응.
  - 기어: 기어 1 회전 시 기어 2가 반대 방향으로 정확한 기어비 속도로 맞물려 회전.
- [ ] **오답 복원력**: 오답 제출 시 캔버스 오브젝트가 강제 초기화되지 않고, 진동(Shake) 후 재시도 가능.
- [ ] **세션 복원력**: 학습 중간에 브라우저 새로고침(F5) 시 마지막 진행 스텝과 파라미터 복원.
- [ ] **음성 엔진 동작**:
  - 한국어(`ko-KR`) 음성으로 스텝 진입 시 질문 자연스럽게 낭독.
  - 스텝 넘어가면 이전 발화 즉시 중단(`cancel()`).
  - 슬라이더 마구 흔들어도 음성 폭주 현상 없음(쿨다운 4초 준수).
  - 음성 음소거(Mute) 버튼 동작.
- [ ] **모바일 뷰포트**: 가로 너비 375px 환경에서 가로 스크롤(오버플로) 없이 모든 슬라이더/버튼 터치 가능.

---

## 7. 인수인계 및 서명

- **인계자**: REA Reverse Engineering Agent
- **검토 요청**: 총괄 책임자 A01
- **개발 대기**: 개발 담당자 A02
- **비고**: 본 명세서는 A01의 최종 검토 및 공식 승인(APPROVE) 직후 A02의 공식 구현 개발 계약서로 효력을 발휘합니다.
