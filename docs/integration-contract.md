# Interactive Engineering — 에이전트 간 통합 인터페이스 계약서 (Integration Contract)

**버전**: 1.0.0  
**기준 커밋**: `766339b` (PR #5)  
**적용 대상**: A02(플랫폼 엔진), A05(2.5D 인터랙션 디자이너), A06(공학 교육 스토리텔러)

---

## 1. 개요 및 역할 분담 원칙 (Role Boundaries)

| 에이전트 | 공식 역할 | 핵심 책임 및 산출물 | 비담당 영역 (침범 금지) |
| :--- | :--- | :--- | :--- |
| **A02** | 플랫폼 엔진 & 아키텍처 | • 학습 유한상태머신(FSM) 및 검증 엔진<br>• UI 셸, 반응형 레이아웃, 오디오/음성 브리지<br>• LocalStorage 세션 복원 및 CI/테스트 파이프라인 | 2.5D 그래픽 메시/조명 자체 제작,<br>교육 원고 임의 작성 |
| **A05** | 2.5D 인터랙션 디자이너 | • 2.5D SVG/Canvas 시뮬레이터 씬 컴포넌트<br>• 60fps 드래그/터치 물리 인터랙션 렌더러<br>• 인볼류트 기하, 전계 화살표, 캐리어 파티클 시각화 | 플랫폼 상태머신 수정,<br>단독 배포 및 커리큘럼 설계 |
| **A06** | 공학 교육 스토리텔러 | • 반도체/회로/기계 레슨 서사 기획 (`storyLead`)<br>• 3단계 스캐폴딩 힌트 및 Why? 심층 원리 작성<br>• 한국어 Voice Tutor 대본 및 물리 모델 감수 | 2.5D SVG 컴포넌트 코드 작성,<br>엔진 코어 수정 |

---

## 2. 레슨 및 스텝 데이터 계약 (`LessonStep`)

모든 교육 콘텐츠는 `src/types/index.ts`의 `LessonStep` 인터페이스를 준수해야 합니다.

```typescript
export interface LessonStep {
  // [필수 메타데이터]
  id: string;                         // 스텝 고유 ID (예: 'step-mosfet-s1-channel')
  title: string;                      // 스텝 제목 (예: '1단계: 문턱 전압과 채널 형성')
  stepType: StepType;                 // 스텝 유형 ('CONCEPT' | 'MANIPULATE' | 'CHECK' | 'INTRO' 등)
  storyLead: string;                  // 서사형 도입 질문/의문 (학습 동기 유발)
  prompt: string;                     // 사용자 조작 지시문 또는 핵심 요약

  // [선택적 교육 텍스트 - A06 작성]
  detailExplanation?: string;         // 본문 개념 보충 설명
  whyExplanation?: string;            // 'Why? 원리' 모달에서 노출되는 심층 공학 원리 해설

  // [선택적 시뮬레이터 및 파라미터 - 설명형 스텝은 생략 가능]
  simulatorType?: SimulatorType;      // 'mosfet' | 'ohmsLaw' | 'gears' | 'inverter' (없으면 개념형 뷰로 렌더링)
  initialParams?: Record<string, any>;// 시뮬레이터 초기값 (예: { vgs: 0.0, vds: 0.0 })

  // [선택적 컨트롤 정의]
  controls?: StepControl[];           // 슬라이더, 토글, 진리표, 기어 선택기 등

  // [선택적 검증 규칙 - 없으면 '이해했습니다' 확인 버튼으로 자동 통과]
  rules?: ValidationRule[];
  successMessage?: string;            // 통과 시 녹색 알림 텍스트
  successVoice?: string;              // 통과 시 음성 낭독 스크립트

  // [선택적 한국어 Voice Tutor 스크립트 - A06 작성]
  voice?: {
    intro?: string;                   // 스텝 진입 시 음성 가이드
    milestone?: {                     // 임계값 돌파 시 1회 발화
      triggerParam: string;           // 감시 파라미터 키
      threshold: number;              // 임계 수치
      direction: 'above' | 'below';   // 진입 방향
      speech: string;                 // 마일스톤 발화 문장
    };
    explanation?: string;             // 정답 통과 후 설명 음성
  };

  // [선택적 스캐폴딩 힌트 - A06 작성]
  hints?: ScaffoldingHint[];          // 1단계(직관) -> 2단계(조작) -> 3단계(정답 유도)
}
```

### 2.1 설명형 Step (`CONCEPT`, `INTRO`, `EXPLAIN`) 계약 규정
- `simulatorType`, `controls`, `rules`, `initialParams`는 **생략(undefined)** 가능합니다.
- 시뮬레이터가 없는 경우 `LessonPlayer`는 중앙에 `.stage-concept-grid`를 렌더링하여 공학 개념 요약 카드를 노출합니다.
- `rules`가 없거나 빈 배열인 경우 하단 액션바는 `이해했습니다 (확인)` 버튼을 제공하며, 클릭 시 `passed: true`, `ruleResults: []`로 안전하게 즉시 통과 처리됩니다.

---

## 3. 2.5D 시뮬레이터 씬 컴포넌트 인터페이스 계약 (A05)

A05가 제작하는 모든 2.5D 씬 컴포넌트는 `src/simulations/<domain>/` 하위에 위치하며, 다음 표준 규격을 준수합니다.

### 3.1 컴포넌트 Props 표준 패턴
```typescript
export interface BaseSceneProps {
  // 시뮬레이터 구동에 필요한 물리 파라미터 (단방향 전달)
  // 예: vgs, vds, voltage, resistance, switchClosed, n1, n2, angle1
  [key: string]: any;

  // 파라미터 변경 콜백 (사용자 드래그/클릭 인터랙션 시 호출)
  onParamChange?: (key: string, value: any) => void;

  // 보조 시각 요소 표시 여부 플래그
  showIVCurve?: boolean;
  interactive?: boolean;
}
```

### 3.2 2.5D SVG/Canvas 그래픽 규격
1. **뷰포트 및 스케일링**:
   - SVG 루트는 항상 `viewBox="0 0 W H"`(예: `viewBox="0 0 600 360"`) 및 `preserveAspectRatio="xMidYMid meet"`를 적용하여 부모 컨테이너(`stage-canvas-col`)에 반응형으로 맞춥니다.
2. **조작 반응성 및 터치 불변식**:
   - 드래그 조작 요소에는 CSS `touch-action: none`을 선언하여 모바일에서 핀치 줌이나 페이지 스크롤 간섭을 차단합니다.
   - 드래그 중 `onParamChange(key, value)`를 연속 호출하더라도 엔진은 60fps로 파라미터를 갱신합니다.
3. **디자인 토큰 활용**:
   - `var(--canvas-bg)`, `var(--slate-800)`, `var(--cyan-400)`, `var(--emerald-400)` 등 `src/index.css`에 선언된 공통 엔지니어링 테마 변수를 준수합니다.

### 3.3 신규 씬 등록 3단계 절차
새로운 물리 현상 시뮬레이터(예: 커패시터 충방전, HBM 적층 열전도 등)를 추가할 때는 다음 3곳만 수정합니다.
1. `src/types/index.ts`: `SimulatorType` 유니온에 새 키 추가 (예: `| 'capacitor'`).
2. `src/simulations/<domain>/`: 순수 모델 수식(`*Model.ts`)과 2.5D 씬(`*Scene.tsx`) 구현.
3. `src/components/player/LessonPlayer.tsx`: `renderSimulator()`의 `switch (currentStep.simulatorType)` 문에 새 케이스 추가.

---

## 4. 검증 규칙 및 조건별 평가 데이터 계약 (`ValidationRule` & `RuleEvaluationResult`)

다중 조건 평가(예: 인버터 진리표, 복합 회로 설계)의 투명성을 위해 조건별 데이터 구조를 제공합니다.

### 4.1 조건 규칙 명세 (`ValidationRule`)
```typescript
export interface ValidationRule {
  targetKey: string;             // 검증 대상 파라미터 키 (예: 'out0', 'vgs')
  label?: string;                // 사용자에게 노출할 조건 이름 (예: '입력 0일 때 출력 (out0)')
  operator: 'eq' | 'gte' | 'lte' | 'between' | 'near';
  expected: number | boolean | string | [number, number];
  tolerance?: number;            // 'near' 연산자용 허용 오차
  feedbackIfFail: string;        // 조건 불충족 시 피드백
  voiceIfFail?: string;          // 조건 불충족 시 음성 가이드
}
```

### 4.2 조건별 평가 결과 구조 (`RuleEvaluationResult`)
검증 엔진(`evaluateStepRules`)은 모든 규칙을 전수 평가하여 아래 배열을 반환합니다:
```typescript
export interface StepEvaluation {
  passed: boolean;                         // 전체 조건 모두 충족 시 true
  message: string;                        // 종합 피드백 문구
  ruleResults: RuleEvaluationResult[];    // 각 조건별 개별 평가 배열
  whyExplanation: string;
  voiceLine: string;
}

export interface RuleEvaluationResult {
  targetKey: string;
  label?: string;                         // 정의된 조건 라벨 (없으면 targetKey로 폴백)
  passed: boolean;                        // 개별 조건 충족 여부
  message: string;                        // 개별 피드백 메시지
}
```
하단 액션바(`ActionBottomBar`)는 `ruleResults`가 2개 이상일 때 각 조건별 성공/실패 뱃지(`[✓ 입력 0일 때 출력]`, `[✗ 입력 1일 때 출력]`)를 자동으로 렌더링합니다.

### 4.3 정답 판정 후 조작 무효화 불변식 (Anti-Tampering)
- 사용자가 정답 판정을 받은 상태(`EVALUATED_CORRECT`)에서 슬라이더나 토글을 다시 변경할 경우, 학습 엔진은 즉시 `evaluation: null`로 초기화하고 `fsmState: 'INTERACTING'`으로 복귀시킵니다.
- 따라서 사용자가 값을 임의 변경한 뒤 이전 정답 판정에 편승하여 "다음 단계"로 진행하는 것은 불가능합니다.

---

## 5. 한국어 Voice Tutor 인터페이스 계약 (A06)

브라우저 내장 `window.speechSynthesis`를 사용하는 완전 독립 무료 한국어 음성 튜터 규격입니다.

### 5.1 공학 수식 및 기호 한국어 정규화
`src/lib/voice/textNormalizer.ts`가 낭독 전 텍스트를 자동 정규화합니다. A06는 원고 작성 시 표준 공학 표기법을 그대로 사용하면 됩니다.
- $V_{GS} \to$ `게이트 전압`
- $V_{DS} \to$ `드레인 전압`
- $V_{th} \to$ `문턱 전압`
- $0.7\text{V} \to$ `0.7 볼트`
- $10\Omega \to$ `10 옴`
- $0.4\text{A} \to$ `0.4 암페어`

### 5.2 마일스톤 경계 교차(True Crossing) 발화 의미론
- `voice.milestone`은 감시 파라미터가 임계값을 넘어서는 **순간(경계 진입 시점)**에만 1회 발화됩니다.
- 이미 임계 구간 내에서 슬라이더를 미세 조정하는 동작은 무시되며, 구간을 벗어났다가 다시 진입할 때만 재발화가 허용됩니다.
- 연속 발화 방지를 위해 4초의 쿨다운 가디언이 기본 적용됩니다.

### 5.3 무음 폴백 보장 (Graceful Fallback)
- 브라우저 음성 엔진이 비활성화되었거나 권한이 차단된 환경에서도 화면 UI 및 텍스트 피드백은 100% 정상 작동하며, 어떠한 런타임 에러도 발생하지 않습니다.

---

## 6. 세션 영속화 및 진행도 복원 계약 (`LocalStorage`)

### 6.1 저장 키 규격
- 레슨별 진행도: `ie_progress_{courseId}_{lessonId}`
- 마지막 학습 위치: `ie_last_active_lesson`
- 음성 활성화 여부: `ie_voice_enabled`

### 6.2 데이터 스키마 (`SessionProgress`)
```typescript
export interface SessionProgress {
  courseId: string;
  lessonId: string;
  currentStepIndex: number;
  completedStepIds: string[];
  simulatorInputs: Record<string, Record<string, any>>; // stepId별 파라미터 스냅샷
  updatedAt: number;
}
```
페이지를 새로고침하거나 브라우저를 재시작해도 마지막으로 머물던 스텝과 시뮬레이터 조작 상태가 오차 없이 복구됩니다.
