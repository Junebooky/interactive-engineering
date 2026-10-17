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

  it('7. S03 & S04 toggle mapping to numeric vin=5.0 and automatic visited tracking with physical observation', async () => {
    const s03 = mosfetLesson.steps.find((s) => s.id === 'step-mosfet-s3-inverter-reversal')!;
    expect(s03).toBeDefined();

    const vinCtrl = s03.controls?.find((c) => c.id === 'vin');
    expect(vinCtrl?.type).toBe('toggle');
    expect(vinCtrl?.options).toBeDefined();

    // Verify toggle mapping helper logic identical to PromptCard
    const offOpt = vinCtrl!.options![0];
    const onOpt = vinCtrl!.options![1];
    expect(offOpt.value).toBe(0.0);
    expect(onOpt.value).toBe(5.0);

    // Initial state: vin = 0.0, visited = [0]
    let params: Record<string, any> = { ...s03.initialParams };
    expect(params.vin).toBe(0.0);
    expect(params.visited).toEqual([0]);

    // Simulate clicking toggle ON: UI produces nextChecked = true -> maps to onOpt.value (5.0)
    const nextValOn = onOpt.value;
    params.vin = nextValOn;
    // LearningContext automatic visited tracking for number voltage
    if (typeof nextValOn === 'number') {
      params.visited = Array.from(new Set([...params.visited, nextValOn]));
    }
    expect(params.vin).toBe(5.0);
    expect(params.visited).toContain(0);
    expect(params.visited).toContain(5);

    // Verify physical observation matches A02 toy model: 10k pullup, ~0.98k Ron -> Vout ≈ 0.45V
    const { resistorInverterObservation } = await import('../a05/scenePhysics');
    const invObs = resistorInverterObservation(params.vin);
    expect(invObs.vin).toBe(5.0);
    expect(invObs.vout).toBe(0.45);
    expect(invObs.outputLogic).toBe(0);
    expect(invObs.pullDownActive).toBe(true);

    // Evaluation with prediction & correct explanation
    params.prediction = 'down';
    params.answer = 'pulldown';
    const evalS03 = evaluateStepRules(s03, params);
    expect(evalS03.passed).toBe(true);
    expect(evalS03.ruleResults[0].passed).toBe(true); // visitedLowHigh (0 and >= 5)
    expect(evalS03.ruleResults[1].passed).toBe(true); // pulldown answer

    // Check S04 CMOS toggle to 5V and physical observation
    const s04 = mosfetLesson.steps.find((s) => s.id === 'step-mosfet-s4-cmos-not-gate')!;
    const { cmosObservation } = await import('../a05/scenePhysics');
    const cmosObs0 = cmosObservation(0);
    expect(cmosObs0.vout).toBe(5);
    expect(cmosObs0.output).toBe(1);
    expect(cmosObs0.pmosOn).toBe(true);
    expect(cmosObs0.nmosOn).toBe(false);

    const cmosObs1 = cmosObservation(1);
    expect(cmosObs1.vout).toBe(0);
    expect(cmosObs1.output).toBe(0);
    expect(cmosObs1.pmosOn).toBe(false);
    expect(cmosObs1.nmosOn).toBe(true);
    expect(cmosObs1.settledDirectPath).toBe(false);

    // S04 evaluation with visited and truth table
    const s04Params = {
      ...s04.initialParams,
      vin: 5.0,
      visited: [0, 5],
      prediction: 'pmos-on',
      out0: 1,
      out1: 0,
    };
    const evalS04 = evaluateStepRules(s04, s04Params);
    expect(evalS04.passed).toBe(true);
    expect(evalS04.ruleResults[0].passed).toBe(true);
    expect(evalS04.ruleResults[1].passed).toBe(true);
    expect(evalS04.ruleResults[2].passed).toBe(true);
  });

  it('8. Ohms law knife switch regression: toggle mapping preserves boolean switchClosed', async () => {
    const { ohmsLawLesson } = await import('../content/circuits/ohmsLawLesson');
    const step0 = ohmsLawLesson.steps[0];
    const switchCtrl = step0.controls?.find((c) => c.id === 'switchClosed');
    expect(switchCtrl).toBeDefined();
    expect(switchCtrl.type).toBe('toggle');
    expect(switchCtrl.options).toBeDefined();

    const offOpt = switchCtrl.options![0];
    const onOpt = switchCtrl.options![1];
    expect(offOpt.value).toBe(false);
    expect(onOpt.value).toBe(true);

    // Initial state: false
    let switchClosed = false;

    // Simulate clicking toggle ON
    const nextChecked = true;
    const targetVal = nextChecked ? onOpt.value : offOpt.value;
    switchClosed = targetVal;
    expect(typeof switchClosed).toBe('boolean');
    expect(switchClosed).toBe(true);

    // Circuit evaluation with switchClosed = true
    const evalResult = evaluateStepRules(step0, {
      ...step0.initialParams,
      switchClosed: true,
      voltage: 12,
      resistance: 30,
    });
    expect(evalResult.passed).toBe(true);
    expect(evalResult.ruleResults[0].passed).toBe(true);
  });
});
