import React, { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';
import type { Lesson } from '../types';
import { learningReducer, initialEngineState, type LearningEngineState } from './learningReducer';
import { evaluateStepRules } from './validationEngine';
import { loadLessonProgress, saveLessonProgress } from './progressStorage';
import { voiceEngine } from '../lib/voice/webSpeechEngine';
import { sfx } from '../lib/sound/sfx';

interface LearningContextValue extends LearningEngineState {
  initLesson: (courseId: string, lesson: Lesson) => void;
  updateParam: (key: string, value: any) => void;
  startInteraction: () => void;
  endInteraction: () => void;
  submitCheck: () => void;
  retry: () => void;
  openHint: (level?: 1 | 2 | 3) => void;
  closeHint: () => void;
  openWhyModal: () => void;
  closeWhyModal: () => void;
  nextStep: () => void;
  gotoStep: (stepIndex: number) => void;
  resetCurrentStep: () => void;
}

const LearningContext = createContext<LearningContextValue | null>(null);

export const LearningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(learningReducer, initialEngineState);

  // Initialize lesson with LocalStorage restoration
  const initLesson = useCallback((courseId: string, lesson: Lesson) => {
    voiceEngine.cancel();
    const saved = loadLessonProgress(courseId, lesson.id);

    if (saved) {
      const stepIndex = Math.min(saved.currentStepIndex, lesson.steps.length - 1);
      const stepId = lesson.steps[stepIndex]?.id;
      const restoredParams = saved.simulatorInputs[stepId] || lesson.steps[stepIndex]?.initialParams;

      dispatch({
        type: 'INIT_LESSON',
        payload: {
          courseId,
          lesson,
          restoredStepIndex: stepIndex,
          restoredParams,
          completedStepIds: saved.completedStepIds || [],
        },
      });
    } else {
      dispatch({
        type: 'INIT_LESSON',
        payload: {
          courseId,
          lesson,
          restoredStepIndex: 0,
        },
      });
    }
  }, []);

  // Update parameter and trigger milestone voice if threshold crossed
  const updateParam = useCallback((key: string, value: any) => {
    dispatch({ type: 'UPDATE_PARAM', payload: { key, value } });

    // Check milestone voice
    if (state.lesson) {
      const step = state.lesson.steps[state.currentStepIndex];
      if (step?.voice?.milestone && step.voice.milestone.triggerParam === key) {
        const { threshold, direction, speech } = step.voice.milestone;
        const reached = direction === 'above' ? value >= threshold : value <= threshold;
        if (reached) {
          voiceEngine.speak(speech, { isMilestone: true });
        }
      }
    }
  }, [state.lesson, state.currentStepIndex]);

  const startInteraction = useCallback(() => {
    dispatch({ type: 'START_INTERACTION' });
  }, []);

  const endInteraction = useCallback(() => {
    dispatch({ type: 'END_INTERACTION' });
  }, []);

  // Submit check and evaluate rules
  const submitCheck = useCallback(() => {
    if (!state.lesson) return;
    const currentStep = state.lesson.steps[state.currentStepIndex];
    if (!currentStep) return;

    dispatch({ type: 'SUBMIT_CHECK' });
    sfx.playClick();

    // Small delay to simulate evaluation feel
    setTimeout(() => {
      const result = evaluateStepRules(currentStep, state.currentParams);
      dispatch({ type: 'EVAL_RESULT', payload: result });

      if (result.passed) {
        sfx.playCorrect();
        voiceEngine.speak(result.voiceLine);
      } else {
        sfx.playIncorrect();
        voiceEngine.speak(result.voiceLine);
      }
    }, 120);
  }, [state.lesson, state.currentStepIndex, state.currentParams]);

  const retry = useCallback(() => {
    sfx.playClick();
    dispatch({ type: 'RETRY' });
  }, []);

  const openHint = useCallback((level?: 1 | 2 | 3) => {
    sfx.playClick();
    dispatch({ type: 'OPEN_HINT', payload: { level } });

    if (state.lesson) {
      const step = state.lesson.steps[state.currentStepIndex];
      const hint = step?.hints.find(h => h.level === (level || 1));
      if (hint?.voiceLine) {
        voiceEngine.speak(hint.voiceLine);
      }
    }
  }, [state.lesson, state.currentStepIndex]);

  const closeHint = useCallback(() => {
    voiceEngine.cancel();
    dispatch({ type: 'CLOSE_HINT' });
  }, []);

  const openWhyModal = useCallback(() => {
    sfx.playClick();
    dispatch({ type: 'OPEN_WHY_MODAL' });
    if (state.lesson) {
      const step = state.lesson.steps[state.currentStepIndex];
      if (step?.whyExplanation) {
        voiceEngine.speak(step.whyExplanation);
      }
    }
  }, [state.lesson, state.currentStepIndex]);

  const closeWhyModal = useCallback(() => {
    voiceEngine.cancel();
    dispatch({ type: 'CLOSE_WHY_MODAL' });
  }, []);

  const nextStep = useCallback(() => {
    voiceEngine.cancel();
    sfx.playClick();
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const gotoStep = useCallback((stepIndex: number) => {
    voiceEngine.cancel();
    sfx.playClick();
    dispatch({ type: 'GOTO_STEP', payload: { stepIndex } });
  }, []);

  const resetCurrentStep = useCallback(() => {
    voiceEngine.cancel();
    sfx.playSnap();
    dispatch({ type: 'RESET_CURRENT_STEP' });
  }, []);

  // Step change effect: speak intro voice narration
  useEffect(() => {
    if (state.lesson && state.fsmState === 'STEP_INTRO') {
      const step = state.lesson.steps[state.currentStepIndex];
      if (step?.voice?.intro) {
        // Voice is only played if enabled by user
        voiceEngine.speak(step.voice.intro);
      }
    }
  }, [state.lesson, state.currentStepIndex, state.fsmState]);

  // Persistence sync to LocalStorage
  useEffect(() => {
    if (state.lesson && state.courseId) {
      const stepId = state.lesson.steps[state.currentStepIndex]?.id;
      const prevSaved = loadLessonProgress(state.courseId, state.lesson.id);
      const simulatorInputs = { ...(prevSaved?.simulatorInputs || {}) };
      if (stepId) {
        simulatorInputs[stepId] = state.currentParams;
      }

      saveLessonProgress({
        courseId: state.courseId,
        lessonId: state.lesson.id,
        currentStepIndex: state.currentStepIndex,
        completedStepIds: state.completedStepIds,
        simulatorInputs,
        updatedAt: Date.now(),
      });
    }
  }, [state.courseId, state.lesson, state.currentStepIndex, state.currentParams, state.completedStepIds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      voiceEngine.cancel();
    };
  }, []);

  const value: LearningContextValue = {
    ...state,
    initLesson,
    updateParam,
    startInteraction,
    endInteraction,
    submitCheck,
    retry,
    openHint,
    closeHint,
    openWhyModal,
    closeWhyModal,
    nextStep,
    gotoStep,
    resetCurrentStep,
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
};

export const useLearningEngine = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearningEngine must be used within a LearningProvider');
  }
  return context;
};
