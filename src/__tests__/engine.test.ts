import { describe, it, expect } from 'vitest';
import { evaluateStepRules } from '../engine/validationEngine';
import { learningReducer, initialEngineState } from '../engine/learningReducer';
import { mosfetLesson } from '../content/semiconductor/mosfetLesson';

describe('Validation Engine', () => {
  const step1 = mosfetLesson.steps[0];

  it('should fail when Vgs is below 0.7V threshold', () => {
    const result = evaluateStepRules(step1, { vgs: 0.5 });
    expect(result.passed).toBe(false);
    expect(result.message).toContain('문턱 전압');
  });

  it('should pass when Vgs is within [0.8, 1.8] range', () => {
    const result = evaluateStepRules(step1, { vgs: 1.2 });
    expect(result.passed).toBe(true);
    expect(result.message).toContain('완벽합니다');
  });
});

describe('Learning Reducer FSM', () => {
  it('should initialize to STEP_INTRO on INIT_LESSON', () => {
    const state = learningReducer(initialEngineState, {
      type: 'INIT_LESSON',
      payload: { courseId: 'test-course', lesson: mosfetLesson },
    });
    expect(state.fsmState).toBe('STEP_INTRO');
    expect(state.currentStepIndex).toBe(0);
    expect(state.currentParams.vgs).toBe(0.0);
  });

  it('should update params and mark dirty on UPDATE_PARAM', () => {
    let state = learningReducer(initialEngineState, {
      type: 'INIT_LESSON',
      payload: { courseId: 'test-course', lesson: mosfetLesson },
    });

    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'vgs', value: 1.2 },
    });

    expect(state.currentParams.vgs).toBe(1.2);
    expect(state.isDirty).toBe(true);
  });

  it('should advance to next step on NEXT_STEP', () => {
    let state = learningReducer(initialEngineState, {
      type: 'INIT_LESSON',
      payload: { courseId: 'test-course', lesson: mosfetLesson },
    });

    state = learningReducer(state, { type: 'NEXT_STEP' });
    expect(state.currentStepIndex).toBe(1);
    expect(state.lesson?.steps[1].id).toBe('step-mosfet-s2-vds-drift');
  });
});
