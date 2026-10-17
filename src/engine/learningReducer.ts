import type { Lesson, LearningState, StepEvaluation } from '../types';
import { applyDramActionAdapter } from './adapters/dramActionAdapter';
import { applySramActionAdapter } from './adapters/sramActionAdapter';
import { applyGpuActionAdapter } from './adapters/gpuActionAdapter';
import { applyElectricityActionAdapter } from './adapters/electricityActionAdapter';
import { applyPnActionAdapter } from './adapters/pnActionAdapter';
import { applyMos14ActionAdapter } from './adapters/mos14ActionAdapter';

export interface LearningEngineState {
  courseId: string;
  lesson: Lesson | null;
  currentStepIndex: number;
  fsmState: LearningState;
  currentParams: Record<string, any>;
  evaluation: StepEvaluation | null;
  isHelpOpen: boolean;
  activeHintLevel: 1 | 2 | 3;
  completedStepIds: string[];
  isDirty: boolean; // has user modified parameters from initial state
  showWhyModal: boolean;
}

export type LearningAction =
  | { type: 'INIT_LESSON'; payload: { courseId: string; lesson: Lesson; restoredStepIndex?: number; restoredParams?: Record<string, any>; completedStepIds?: string[] } }
  | { type: 'LOAD_STEP'; payload: { stepIndex: number } }
  | { type: 'START_INTERACTION' }
  | { type: 'UPDATE_PARAM'; payload: { key: string; value: any } }
  | { type: 'END_INTERACTION' }
  | { type: 'SUBMIT_CHECK' }
  | { type: 'EVAL_RESULT'; payload: StepEvaluation }
  | { type: 'RETRY' }
  | { type: 'OPEN_HINT'; payload?: { level?: 1 | 2 | 3 } }
  | { type: 'CLOSE_HINT' }
  | { type: 'OPEN_WHY_MODAL' }
  | { type: 'CLOSE_WHY_MODAL' }
  | { type: 'NEXT_STEP' }
  | { type: 'GOTO_STEP'; payload: { stepIndex: number } }
  | { type: 'RESET_CURRENT_STEP' };

export const initialEngineState: LearningEngineState = {
  courseId: '',
  lesson: null,
  currentStepIndex: 0,
  fsmState: 'IDLE',
  currentParams: {},
  evaluation: null,
  isHelpOpen: false,
  activeHintLevel: 1,
  completedStepIds: [],
  isDirty: false,
  showWhyModal: false,
};

export function learningReducer(
  state: LearningEngineState,
  action: LearningAction
): LearningEngineState {
  switch (action.type) {
    case 'INIT_LESSON': {
      const { courseId, lesson, restoredStepIndex = 0, restoredParams, completedStepIds = [] } = action.payload;
      const initialStep = lesson.steps[restoredStepIndex] || lesson.steps[0];
      const params = restoredParams || { ...initialStep?.initialParams };
      const isAllCompleted = lesson.steps.length > 0 && lesson.steps.every(s => completedStepIds.includes(s.id));

      return {
        ...state,
        courseId,
        lesson,
        currentStepIndex: restoredStepIndex,
        fsmState: isAllCompleted ? 'LESSON_FINISHED' : 'STEP_INTRO',
        currentParams: params,
        evaluation: null,
        isHelpOpen: false,
        activeHintLevel: 1,
        completedStepIds,
        isDirty: false,
        showWhyModal: false,
      };
    }

    case 'LOAD_STEP': {
      if (!state.lesson) return state;
      const targetIndex = action.payload.stepIndex;
      const step = state.lesson.steps[targetIndex];
      if (!step) return state;

      return {
        ...state,
        currentStepIndex: targetIndex,
        fsmState: 'STEP_INTRO',
        currentParams: { ...step.initialParams },
        evaluation: null,
        isHelpOpen: false,
        activeHintLevel: 1,
        isDirty: false,
        showWhyModal: false,
      };
    }

    case 'START_INTERACTION': {
      return {
        ...state,
        fsmState: 'INTERACTING',
      };
    }

    case 'UPDATE_PARAM': {
      const { key, value } = action.payload;
      const step = state.lesson?.steps[state.currentStepIndex];
      const isDram = Boolean(step?.simulatorType?.startsWith('dram-'));
      const isSram = Boolean(
        step?.simulatorType?.startsWith('sram-') ||
        step?.simulatorType === 'cpu-cache-vs-dram' ||
        step?.simulatorType === 'cpu-to-gpu-data-locality'
      );
      const isGpu = Boolean(step?.simulatorType?.startsWith('gpu-'));
      const isElec = Boolean(step?.simulatorType?.startsWith('elec-'));
      const isPn = Boolean(
        step?.simulatorType?.startsWith('pn-') ||
        step?.simulatorType?.startsWith('semiconductor-') ||
        step?.simulatorType?.startsWith('silicon-')
      );
      const isMos14 = Boolean(step?.simulatorType?.startsWith('mos14-'));

      let nextParams = {
        ...state.currentParams,
        [key]: value,
      };

      if (isDram && step) {
        nextParams = applyDramActionAdapter(step.id, state.currentParams, key, value);
      } else if (isSram && step) {
        nextParams = applySramActionAdapter(step.id, state.currentParams, key, value);
      } else if (isGpu && step) {
        nextParams = applyGpuActionAdapter(step.id, state.currentParams, key, value);
      } else if (isElec && step) {
        nextParams = applyElectricityActionAdapter(step.id, state.currentParams, key, value);
      } else if (isPn && step) {
        nextParams = applyPnActionAdapter(step.id, state.currentParams, key, value);
      } else if (isMos14 && step) {
        nextParams = applyMos14ActionAdapter(step.id, state.currentParams, key, value);
      } else if (typeof value === 'number' && (key === 'vgs' || key === 'vds' || key === 'vin')) {
        const prevVisited = Array.isArray(state.currentParams.visited) ? state.currentParams.visited : [0];
        if (!prevVisited.includes(value)) {
          nextParams.visited = [...prevVisited, value];
        }
      }

      // Invariant: Changing parameters after evaluation (CORRECT or INCORRECT)
      // invalidates prior evaluation result and returns to INTERACTING
      const isPostEvaluation =
        state.fsmState === 'EVALUATED_CORRECT' || state.fsmState === 'EVALUATED_INCORRECT';

      return {
        ...state,
        fsmState: isPostEvaluation ? 'INTERACTING' : state.fsmState === 'STEP_INTRO' ? 'INTERACTING' : state.fsmState,
        currentParams: nextParams,
        evaluation: isPostEvaluation ? null : state.evaluation,
        isDirty: true,
      };
    }

    case 'END_INTERACTION': {
      return {
        ...state,
        fsmState: 'AWAITING_VALIDATION',
      };
    }

    case 'SUBMIT_CHECK': {
      return {
        ...state,
        fsmState: 'EVALUATING',
      };
    }

    case 'EVAL_RESULT': {
      const isPassed = action.payload.passed;
      let nextCompleted = state.completedStepIds;
      if (isPassed && state.lesson) {
        const stepId = state.lesson.steps[state.currentStepIndex]?.id;
        if (stepId && !nextCompleted.includes(stepId)) {
          nextCompleted = [...nextCompleted, stepId];
        }
      }

      return {
        ...state,
        fsmState: isPassed ? 'EVALUATED_CORRECT' : 'EVALUATED_INCORRECT',
        evaluation: action.payload,
        completedStepIds: nextCompleted,
      };
    }

    case 'RETRY': {
      return {
        ...state,
        fsmState: 'AWAITING_VALIDATION',
        evaluation: null,
      };
    }

    case 'OPEN_HINT': {
      return {
        ...state,
        isHelpOpen: true,
        activeHintLevel: action.payload?.level || state.activeHintLevel,
      };
    }

    case 'CLOSE_HINT': {
      return {
        ...state,
        isHelpOpen: false,
      };
    }

    case 'OPEN_WHY_MODAL': {
      return {
        ...state,
        showWhyModal: true,
      };
    }

    case 'CLOSE_WHY_MODAL': {
      return {
        ...state,
        showWhyModal: false,
      };
    }

    case 'NEXT_STEP': {
      if (!state.lesson) return state;
      const nextIndex = state.currentStepIndex + 1;
      if (nextIndex >= state.lesson.steps.length) {
        return {
          ...state,
          fsmState: 'LESSON_FINISHED',
          showWhyModal: false,
        };
      }
      const nextStep = state.lesson.steps[nextIndex];
      return {
        ...state,
        currentStepIndex: nextIndex,
        fsmState: 'STEP_INTRO',
        currentParams: { ...nextStep.initialParams },
        evaluation: null,
        isHelpOpen: false,
        activeHintLevel: 1,
        isDirty: false,
        showWhyModal: false,
      };
    }

    case 'GOTO_STEP': {
      if (!state.lesson) return state;
      const targetIndex = action.payload.stepIndex;
      if (targetIndex < 0 || targetIndex >= state.lesson.steps.length) return state;
      const targetStep = state.lesson.steps[targetIndex];

      return {
        ...state,
        currentStepIndex: targetIndex,
        fsmState: 'STEP_INTRO',
        currentParams: { ...targetStep.initialParams },
        evaluation: null,
        isHelpOpen: false,
        activeHintLevel: 1,
        isDirty: false,
        showWhyModal: false,
      };
    }

    case 'RESET_CURRENT_STEP': {
      if (!state.lesson) return state;
      const currentStep = state.lesson.steps[state.currentStepIndex];
      return {
        ...state,
        currentParams: { ...currentStep?.initialParams },
        fsmState: 'STEP_INTRO',
        evaluation: null,
        isDirty: false,
      };
    }

    default:
      return state;
  }
}
