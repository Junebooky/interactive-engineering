# A02 학습 엔진 공통 콘텐츠 계약 (Content Pipeline Contract v0.2)

- **작성일**: 2026-10-17
- **기준 브랜치/HEAD**:
  - A02 학습 엔진: `feat/m01-a05-a06-integration` (PR #9 최신 HEAD)
  - A05 2.5D 그래픽: `feat/a05-mosfet-discovery-scenes` (PR #8 HEAD `374a72d`), `feat/a05-dram-1t1c-scenes` (PR #10 HEAD `d3a5dad`)
  - A06 교육 커리큘럼: `content/a06-curriculum` (PR #7 HEAD `b8692e8`)
- **목적**: A06의 10개 레슨 / 41개 Step 및 추가 4개 레슨(총 57 Step) 교육 설계를 A02 실제 학습 엔진(`src/engine/LearningContext.tsx`, `LessonPlayer.tsx`)에 점진적·안정적으로 수용하기 위한 공통 데이터 스키마 및 등록 파이프라인 규격 정의.

---

## 1. 아키텍처 및 역할 분담 (SSOT 원칙)

1. **A02 학습 엔진 (공식 상태 단독 소유)**:
   - FSM 라이프사이클(`READY` $\to$ `INTERACTING` $\to$ `EVALUATING` $\to$ `EVALUATED_CORRECT` / `EVALUATED_INCORRECT` $\to$ `LESSON_FINISHED`) 단독 관리.
   - 예측 가림(Veiled) 해제, 파라미터 조작 이력(`visited`), 조건별 복합 판정(`RuleEvaluationResult[]`), 3단계 점진적 스캐폴딩 힌트, 심층 Why 모달, 음성 튜터(Web Speech), 로컬스토리지 진척도 저장·복원을 100% 소유.
   - A05 Standalone Lab 등의 내부 로컬 상태를 메인 엔진에 중복 삽입하지 않으며, 순수 뷰(Pure View) 컴포넌트만을 어댑팅.
2. **A05 2.5D 인터랙티브 씬 (순수 뷰 및 물리 계산)**:
   - `SceneVisual({ sceneId, values, showObservation })` 형태의 순수 SVG/2.5D 컴포넌트 제공.
   - `scenePhysics.ts` 및 `dramModel.ts` 등 확정된 결정론적 수치 모델 소유.
3. **A06 교육 콘텐츠 (스토리텔링 및 학습 설계)**:
   - 10개 레슨 41 Step 시나리오, 예측 문항, 오개념 피드백, 3단계 힌트, 음성 튜터 스크립트, 교육용 모델 가정(toy assumption) 및 출처 명세 소유.

---

## 2. 공통 최소 데이터 스키마 (`src/types/index.ts` 기준)

### 2.1 Lesson & Step 최소 스키마
```typescript
export interface Lesson {
  id: string; // 고유 ID (예: 'lesson-mosfet', 'lesson-dram')
  courseId: string; // 소속 강좌 (예: 'course-semiconductor')
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'semiconductor' | 'circuits' | 'mechanics' | 'systems';
  prerequisites?: string[]; // 선수 레슨 ID 목록
  steps: LessonStep[];
}

export interface LessonStep {
  id: string; // 스텝 고유 ID (예: 'step-mosfet-s1-channel', 'step-dram-s1-write')
  title: string;
  stepType: 'CONCEPT' | 'MANIPULATE' | 'CHECK';
  storyLead: string; // 도입 스토리텔링 (1~2문장)
  prompt: string; // 사용자 수행 지시문 (displayText)
  detailExplanation?: string; // 아코디언 이론 심층 해설
  whyExplanation?: string; // 성공 후 Why 팝업 해설 (nextHook 포함)
  simulatorType?: SimulatorType; // 연동할 2.5D 시뮬레이터 씬 ID
  initialParams?: Record<string, any>; // 초기 파라미터 상태
  controls?: StepControl[]; // 인터랙티브 컨트롤 목록
  rules?: ValidationRule[]; // 검증 규칙 목록
  successMessage?: string; // 통과 축하 메시지
  successVoice?: string; // 통과 음성 대사
  voice?: StepVoiceScript; // 튜터 음성 스크립트 (intro, milestone, explanation)
  hints?: StepHint[]; // 3단계 점진적 스캐폴딩 힌트
  physicsAssumptions?: string; // 교육용 모델 가정 (toy model)
  sourceRefs?: string[]; // 교재 및 논문 출처
}
```

### 2.2 StepControl 컨트롤 스키마
```typescript
export interface StepControl {
  id: string; // 파라미터 키 (예: 'vgs', 'vin', 'prediction', 'answer', 'wordline')
  label: string;
  type: 'slider' | 'toggle' | 'radioGroup' | 'truthTable' | 'gearSelector';
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{
    label: string;
    value: any; // 도메인 값 (number, boolean, string)
    description?: string;
    misconception?: string; // 오답 선택 시 오개념 피드백
  }>;
}
```

### 2.3 ValidationRule 검증 규칙 스키마
```typescript
export interface ValidationRule {
  targetKey: string; // 검증 대상 파라미터
  label?: string; // UI에 표시될 조건 라벨 (예: '입력 0V와 5V 모두 관찰')
  operator: 'eq' | 'gte' | 'lte' | 'between' | 'near' | 'visitedLowHigh';
  expected: any;
  tolerance?: number;
  feedbackIfFail: string; // 실패 시 개별 피드백
  voiceIfFail?: string; // 실패 시 음성 안내
}
```

---

## 3. A06 원고 필드 $\to$ A02 엔진 필드 1:1 매핑 표

| A06 원고 필드 | A02 학습 엔진 필드 | 설명 및 런타임 처리 방식 |
|---|---|---|
| `learningGoal` / `priorKnowledge` | `Lesson.description` / `prerequisites` | 강좌 카탈로그 및 레슨 헤더에 노출 |
| `storyHook` | `LessonStep.storyLead` | 스텝 상단 스토리텔링 리드문 |
| `question` / `displayText` | `LessonStep.prompt` | 메인 사용자 행동 지시문 |
| `prediction` | `controls`의 `radioGroup` (`id: 'prediction'`) | 선택 전 관찰 영역 가림(`.a05-veiled`), 선택 즉시 씬 노출 |
| `learnerAction` / `modelInputs` | `controls` (`slider`, `toggle` 등) | 도메인 값(0/5V, true/false)을 매핑하여 엔진 상태 갱신 |
| `expectedObservation` | A05/D02 Scene 렌더링 (`showObservation: true`) | 조작에 따른 물리 모델 반응 시각화 |
| `correctIncorrectCriteria` | `LessonStep.rules[]` | `evaluateStepRules`에서 실시간 개별 ✓/✗ 평가 |
| `misconceptions` | `options[].misconception` / `rules[].feedbackIfFail` | 오답 선택 시 즉시 하단 피드백 영역에 표시 |
| `hints` | `LessonStep.hints[1..3]` | 1단계(방향) $\to$ 2단계(단서) $\to$ 3단계(거의 정답) 스캐폴딩 |
| `explanation` | `LessonStep.detailExplanation` | 아코디언 토글 형태의 심층 이론 해설 |
| `whyExplanation` | `LessonStep.whyExplanation` | 정답 완료 후 활성화되는 "Why? 원리" 팝업 모달 |
| `nextHook` | `LessonStep.whyExplanation` 말미 | 다음 스텝 또는 다음 레슨(예: DRAM, SRAM)으로의 자연스러운 연결 |
| `speechText` | `LessonStep.voice` (`intro`, `milestone`, `explanation`) | Web Speech API 또는 텍스트 대체 fallback으로 전달 |
| `physicsAssumptions` | `LessonStep.physicsAssumptions` | toy 모델의 단순화 가정(온저항, 시비율 등) 명시 |
| `sourceRefs` | `LessonStep.sourceRefs` | 참고 문헌 및 반도체 물리학 교재 인용 |
| `sceneId` | `LessonStep.simulatorType` | `SimulatorType` 레지스트리에 매핑 |

---

## 4. 10개 레슨 / 41 Step 점진적 등록 절차

A02는 41개 장면을 독자적으로 한 번에 대량 구현하지 않으며, 다음 파이프라인에 따라 A05와 A06의 산출물이 준비되는 순서대로 단계별 통합합니다:

```mermaid
graph LR
    A["A06 레슨 원고<br/>(Storyboard)"] --> C["A02 데이터 모델링<br/>(Lesson Content)"]
    B["A05 2.5D Scene<br/>(Pure View)"] --> D["A02 뷰 어댑터<br/>(LessonPlayer)"]
    C --> E["통합 레슨 등록<br/>(src/content/)"]
    D --> E
    E --> F["Vitest 단위/회귀 테스트<br/>(smokeFlow)"]
    F --> G["Chromium 브라우저 QA<br/>(E2E Smoke)"]
    G --> H["별도 Stacked PR 제출<br/>(main 병합 금지)"]
```

### 등록 순서 가이드라인:
1. **D02 (DRAM 1T1C)**: M01(MOSFET)의 후속 레슨으로 첫 번째 모델 통합(본보기 완성).
2. **G03 (GPU 메모리 벽)**: DRAM 완성 후 HBM/SRAM 메모리 계층 구조와 연계하여 통합.
3. **N04 (NAND 플래시 & eSSD)**: 플로팅 게이트 / 전하 포획 트랩 소자 시뮬레이션 연계.
4. **05~10 (고급 시스템 커리큘럼)**: A05의 씬 구현 및 A06의 명세 인계 순서에 맞추어 개별 피처 브랜치에서 PR 단위로 점진적 통합.
5. **게임화 지양**: 점수, XP, 스트릭 등 비교육적 게이미피케이션 요소를 배제하고, 순수 개념 발견과 조건별 피드백 중심의 Brilliant형 엔지니어링 UX를 유지.
