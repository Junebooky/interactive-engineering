export type SubjectCategory = 'semiconductor' | 'circuits' | 'mechanics';

export type StepType = 
  | 'INTRO' 
  | 'CONCEPT' 
  | 'PREDICT' 
  | 'MANIPULATE' 
  | 'CHECK' 
  | 'FEEDBACK' 
  | 'HELP' 
  | 'EXPLAIN' 
  | 'APPLY' 
  | 'COMPLETE';

export type SimulatorType =
  | 'mosfet'
  | 'ohmsLaw'
  | 'gears'
  | 'inverter'
  | 'mosfet-field'
  | 'mosfet-current'
  | 'nmos-resistor-inverter'
  | 'cmos-not-gate'
  | 'dram-write'
  | 'dram-sense-restore'
  | 'dram-leak-refresh'
  | 'dram-row-bank'
  | 'sram-cross-coupled-inverters'
  | 'sram-6t-access'
  | 'cpu-cache-vs-dram'
  | 'cpu-to-gpu-data-locality'
  | 'gpu-compute-feeding'
  | 'gpu-memory-family-roles'
  | 'gpu-gddr-width-rate'
  | 'gpu-hbm-tradeoffs'
  | 'elec-charge-current'
  | 'elec-resistor-kcl'
  | 'elec-rc-delay'
  | 'elec-power-energy';

export interface ScaffoldingHint {
  level: 1 | 2 | 3;
  title: string;
  description: string;
  voiceLine?: string;
}

export interface ValidationRule {
  targetKey: string;
  label?: string; // Human-readable condition label (e.g. "게이트 전압 0.8V ~ 1.8V 설정")
  operator: 'eq' | 'gte' | 'lte' | 'between' | 'near' | 'visitedLowHigh' | 'contains';
  expected: number | boolean | string | [number, number];
  tolerance?: number; // for 'near'
  feedbackIfFail: string;
  voiceIfFail?: string;
}

export interface RuleEvaluationResult {
  targetKey: string;
  label?: string;
  passed: boolean;
  message: string;
}

export interface StepEvaluation {
  passed: boolean;
  message: string;
  whyExplanation: string;
  voiceLine: string;
  failDiagnosis?: string;
  ruleResults: RuleEvaluationResult[]; // Condition-by-condition pass/fail breakdown
}

export interface StepControl {
  id: string;
  label: string;
  unit?: string;
  type: 'slider' | 'discreteSlider' | 'toggle' | 'truthTable' | 'gearSelector' | 'radioGroup';
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ label: string; value: any; description?: string; misconception?: string }>;
}

export interface LessonStep {
  id: string;
  title: string;
  stepType: StepType;
  storyLead: string; // 서사형 문제 제기 / 의문 (Storytelling lead)
  prompt: string;    // 학습자 조작 지시문 또는 핵심 설명
  detailExplanation?: string; // 추가 개념 설명
  whyExplanation?: string; // "Why?" 버튼 클릭 시 노출되는 물리적/공학적 심층 원리
  
  // Optional for pure explanatory/concept steps (e.g. INTRO, CONCEPT, EXPLAIN)
  simulatorType?: SimulatorType;
  initialParams?: Record<string, any>;
  
  // Controls available in prompt card or canvas (optional for explanation steps)
  controls?: StepControl[];

  // Validation rules for passing this step (optional, empty means auto-pass/informational)
  rules?: ValidationRule[];
  successMessage?: string;
  successVoice?: string;
  
  // Voice narration scripts (Web Speech API)
  voice?: {
    intro?: string;        // 스텝 진입 시 자연스러운 튜터 가이드
    milestone?: {          // 특정 임계 조건 달성 시 (쿨다운 4초)
      triggerParam: string;
      threshold: number;
      direction: 'above' | 'below';
      speech: string;
    };
    explanation?: string;  // 성공 후 또는 Why 해설 음성
  };

  // Contextual scaffolding hints for Help panel (optional)
  hints?: ScaffoldingHint[];

  // Pedagogical assumptions & academic citations (Contract v0.2)
  physicsAssumptions?: string;
  sourceRefs?: string[];
}

export type Step = LessonStep;

export interface Lesson {
  id: string;
  courseId: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: SubjectCategory;
  prerequisites?: string[];
  steps: LessonStep[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  category: SubjectCategory;
  categoryLabel: string;
  badge: string;
  summary: string;
  estimatedMinutes: number;
  lessons: Lesson[];
}

// Learning Engine FSM States
export type LearningState =
  | 'IDLE'
  | 'LOADING_STEP'
  | 'STEP_INTRO'
  | 'INTERACTING'
  | 'AWAITING_VALIDATION'
  | 'EVALUATING'
  | 'EVALUATED_CORRECT'
  | 'EVALUATED_INCORRECT'
  | 'SHOWING_HINT'
  | 'STEP_COMPLETED'
  | 'LESSON_FINISHED';

export interface SessionProgress {
  courseId: string;
  lessonId: string;
  currentStepIndex: number;
  completedStepIds: string[];
  simulatorInputs: Record<string, Record<string, any>>; // stepId -> params
  updatedAt: number;
}
