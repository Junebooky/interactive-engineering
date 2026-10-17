import { describe, it, expect } from 'vitest';
import { evaluateStepRules } from '../engine/validationEngine';
import { learningReducer, initialEngineState } from '../engine/learningReducer';
import { mosfetLesson } from '../content/semiconductor/mosfetLesson';
import type { Step } from '../types';

describe('Validation Engine', () => {
  const conceptStep = mosfetLesson.steps.find((s) => s.id === 'step-mosfet-s0-concept')!;
  const channelStep = mosfetLesson.steps.find((s) => s.id === 'step-mosfet-s1-channel')!;
  const truthTableStep = mosfetLesson.steps.find((s) => s.id === 'step-mosfet-s4-not-gate-truth-table')!;

  it('should auto-pass explanatory steps with no rules', () => {
    const result = evaluateStepRules(conceptStep, {});
    expect(result.passed).toBe(true);
    expect(result.ruleResults).toEqual([]);
    expect(result.message).toContain('기본 개념을 확인했습니다');
  });

  it('should fail when Vgs is below 0.7V threshold', () => {
    const result = evaluateStepRules(channelStep, { vgs: 0.5 });
    expect(result.passed).toBe(false);
    expect(result.message).toContain('문턱 전압');
    expect(result.ruleResults).toHaveLength(1);
    expect(result.ruleResults[0].passed).toBe(false);
    expect(result.ruleResults[0].targetKey).toBe('vgs');
    expect(result.ruleResults[0].label).toBe('게이트 전압 V_GS');
  });

  it('should pass when Vgs is within [0.8, 1.8] range', () => {
    const result = evaluateStepRules(channelStep, { vgs: 1.2 });
    expect(result.passed).toBe(true);
    expect(result.message).toContain('완벽합니다');
    expect(result.ruleResults[0].passed).toBe(true);
  });

  it('should return condition-by-condition evaluation results for multi-rule steps', () => {
    // When out0 is correct (1) but out1 is incorrect (1 instead of 0)
    const partialResult = evaluateStepRules(truthTableStep, { out0: 1, out1: 1 });
    expect(partialResult.passed).toBe(false);
    expect(partialResult.ruleResults).toHaveLength(2);
    expect(partialResult.ruleResults[0].targetKey).toBe('out0');
    expect(partialResult.ruleResults[0].passed).toBe(true);
    expect(partialResult.ruleResults[1].targetKey).toBe('out1');
    expect(partialResult.ruleResults[1].passed).toBe(false);

    // When both are correct
    const fullResult = evaluateStepRules(truthTableStep, { out0: 1, out1: 0 });
    expect(fullResult.passed).toBe(true);
    expect(fullResult.ruleResults[0].passed).toBe(true);
    expect(fullResult.ruleResults[1].passed).toBe(true);
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
    expect(state.lesson?.steps[1].id).toBe('step-mosfet-s1-channel');
  });

  it('CRITICAL REGRESSION: should invalidate evaluation and reset to INTERACTING when param is updated after correct answer', () => {
    let state = learningReducer(initialEngineState, {
      type: 'INIT_LESSON',
      payload: { courseId: 'test-course', lesson: mosfetLesson },
    });

    // Simulate achieving correct evaluation
    state = learningReducer(state, {
      type: 'EVAL_RESULT',
      payload: {
        passed: true,
        message: '성공',
        ruleResults: [{ targetKey: 'vgs', passed: true, message: '정상' }],
        whyExplanation: '원리 해설',
        voiceLine: '성공 음성',
      },
    });

    expect(state.fsmState).toBe('EVALUATED_CORRECT');
    expect(state.evaluation?.passed).toBe(true);

    // User changes slider value after success
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'vgs', value: 0.1 },
    });

    // Evaluation MUST be nullified and fsmState must return to INTERACTING
    expect(state.evaluation).toBeNull();
    expect(state.fsmState).toBe('INTERACTING');
  });

  it('should safely handle steps without initialParams', () => {
    const mockStepWithoutParams: Step = {
      id: 'mock-concept',
      title: 'Mock Concept',
      stepType: 'CONCEPT',
      storyLead: 'Mock Story Lead',
      prompt: 'Mock Prompt',
      detailExplanation: 'Explanation',
      whyExplanation: 'Why',
    };

    const mockLesson = {
      ...mosfetLesson,
      steps: [mockStepWithoutParams],
    };

    const state = learningReducer(initialEngineState, {
      type: 'INIT_LESSON',
      payload: { courseId: 'test-course', lesson: mockLesson },
    });

    expect(state.currentParams).toEqual({});
    expect(state.fsmState).toBe('STEP_INTRO');
  });
});
