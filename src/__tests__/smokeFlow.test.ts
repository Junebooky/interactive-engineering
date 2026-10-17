import { describe, it, expect, beforeEach } from 'vitest';
import { learningReducer, initialEngineState } from '../engine/learningReducer';
import { evaluateStepRules } from '../engine/validationEngine';
import { mosfetLesson } from '../content/semiconductor/mosfetLesson';
import { normalizeEngineeringSpeech } from '../lib/voice/textNormalizer';
import type { SessionProgress } from '../types';

describe('MOSFET Lesson End-to-End Smoke & Regression Flow', () => {
  // Test storage mock
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
  });

  it('1. Concept step auto-pass and navigation to Step 1', () => {
    // Initialize lesson at Step 0 (Concept Step)
    let state = learningReducer(initialEngineState, {
      type: 'INIT_LESSON',
      payload: { courseId: 'course-semiconductor', lesson: mosfetLesson, restoredStepIndex: 0 },
    });

    const step0 = mosfetLesson.steps[0];
    expect(step0.stepType).toBe('CONCEPT');
    expect(step0.simulatorType).toBeUndefined();

    // Evaluate Step 0 (no rules) -> auto passes
    const evalResult0 = evaluateStepRules(step0, state.currentParams);
    expect(evalResult0.passed).toBe(true);
    expect(evalResult0.ruleResults).toEqual([]);

    state = learningReducer(state, {
      type: 'EVAL_RESULT',
      payload: evalResult0,
    });
    expect(state.fsmState).toBe('EVALUATED_CORRECT');
    expect(state.completedStepIds).toContain(step0.id);

    // Advance to Step 1
    state = learningReducer(state, { type: 'NEXT_STEP' });
    expect(state.currentStepIndex).toBe(1);
    expect(state.lesson?.steps[1].id).toBe('step-mosfet-s1-channel');
    expect(state.currentParams.vgs).toBe(0.0);
  });

  it('2. Step 1 manipulation, fail on low Vgs/misconception, pass on proper exploration & concept answer', () => {
    let state = learningReducer(initialEngineState, {
      type: 'INIT_LESSON',
      payload: { courseId: 'course-semiconductor', lesson: mosfetLesson, restoredStepIndex: 1 },
    });

    const step1 = mosfetLesson.steps[1];

    // Under-explored manipulation & wrong misconception answer
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'visited', value: [0, 0.4] },
    });
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'oxide' },
    });

    const failEval = evaluateStepRules(step1, state.currentParams);
    expect(failEval.passed).toBe(false);
    expect(failEval.ruleResults[0].passed).toBe(false);
    expect(failEval.ruleResults[1].passed).toBe(false);

    state = learningReducer(state, {
      type: 'EVAL_RESULT',
      payload: failEval,
    });
    expect(state.fsmState).toBe('EVALUATED_INCORRECT');

    // User explores high voltage and selects correct concept answer
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'visited', value: [0, 0.4, 1.2] },
    });
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'surface' },
    });
    expect(state.fsmState).toBe('INTERACTING'); // Reset on param change
    expect(state.evaluation).toBeNull();

    const passEval = evaluateStepRules(step1, state.currentParams);
    expect(passEval.passed).toBe(true);
    expect(passEval.ruleResults[0].passed).toBe(true);
    expect(passEval.ruleResults[1].passed).toBe(true);

    state = learningReducer(state, {
      type: 'EVAL_RESULT',
      payload: passEval,
    });
    expect(state.fsmState).toBe('EVALUATED_CORRECT');
    expect(state.completedStepIds).toContain(step1.id);
  });

  it('3. Anti-tampering: Invalidate evaluation when param modified after pass', () => {
    let state = learningReducer(initialEngineState, {
      type: 'INIT_LESSON',
      payload: { courseId: 'course-semiconductor', lesson: mosfetLesson, restoredStepIndex: 1 },
    });

    const step1 = mosfetLesson.steps[1];
    const passEval = evaluateStepRules(step1, { visited: [0, 1.2], answer: 'surface' });

    state = learningReducer(state, {
      type: 'EVAL_RESULT',
      payload: passEval,
    });
    expect(state.fsmState).toBe('EVALUATED_CORRECT');
    expect(state.evaluation).not.toBeNull();

    // User changes answer to wrong answer after passing
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'oxide' },
    });

    // Engine must revoke passed status immediately
    expect(state.evaluation).toBeNull();
    expect(state.fsmState).toBe('INTERACTING');
  });

  it('4. Multi-condition CMOS truth table partial failure and full pass', () => {
    const truthTableStep = mosfetLesson.steps.find((s) => s.id === 'step-mosfet-s4-cmos-not-gate')!;
    expect(truthTableStep).toBeDefined();

    // Partial input: visited both 0 and 5V, out0 is 1 (correct), out1 is 1 (wrong, should be 0)
    const partialEval = evaluateStepRules(truthTableStep, { visited: [0, 5], out0: 1, out1: 1 });
    expect(partialEval.passed).toBe(false);
    expect(partialEval.ruleResults).toHaveLength(3);
    expect(partialEval.ruleResults[0].passed).toBe(true); // visited
    expect(partialEval.ruleResults[1].targetKey).toBe('out0');
    expect(partialEval.ruleResults[1].passed).toBe(true);
    expect(partialEval.ruleResults[2].targetKey).toBe('out1');
    expect(partialEval.ruleResults[2].passed).toBe(false);

    // Full correct input: out0 = 1, out1 = 0
    const fullEval = evaluateStepRules(truthTableStep, { visited: [0, 5], out0: 1, out1: 0 });
    expect(fullEval.passed).toBe(true);
    expect(fullEval.ruleResults[0].passed).toBe(true);
    expect(fullEval.ruleResults[1].passed).toBe(true);
    expect(fullEval.ruleResults[2].passed).toBe(true);
  });

  it('5. LocalStorage session serialization and restoration integrity', () => {
    const courseId = 'course-semiconductor';
    const lessonId = mosfetLesson.id;

    const progressToSave: SessionProgress = {
      courseId,
      lessonId,
      currentStepIndex: 2,
      completedStepIds: ['step-mosfet-s0-concept', 'step-mosfet-s1-channel'],
      simulatorInputs: {
        'step-mosfet-s1-channel': { vgs: 1.2 },
        'step-mosfet-s2-vds-drift': { vgs: 1.5, vds: 1.0 },
      },
      updatedAt: Date.now(),
    };

    const key = `ie_progress_${courseId}_${lessonId}`;
    mockStorage[key] = JSON.stringify(progressToSave);

    // Simulate deserialization
    const loaded: SessionProgress = JSON.parse(mockStorage[key]);
    expect(loaded.currentStepIndex).toBe(2);
    expect(loaded.completedStepIds).toEqual(['step-mosfet-s0-concept', 'step-mosfet-s1-channel']);
    expect(loaded.simulatorInputs['step-mosfet-s1-channel'].vgs).toBe(1.2);
  });

  it('6. Korean Voice text normalization for technical formulas and symbols', () => {
    const raw = 'V_GS가 문턱 전압 V_th 0.7V를 넘으면 저항이 10Ω으로 줄고 전류가 0.4A 흐릅니다.';
    const normalized = normalizeEngineeringSpeech(raw);

    expect(normalized).toContain('게이트 전압');
    expect(normalized).toContain('문턱 전압');
    expect(normalized).toContain('0.7 볼트');
    expect(normalized).toContain('10 옴');
    expect(normalized).toContain('0.4 암페어');
  });
});
