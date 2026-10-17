import { describe, expect, it } from 'vitest';
import { mosCapacitorLesson } from '../content/semiconductor/mosCapacitorLesson';
import { evaluateStepRules } from '../engine/validationEngine';
import { learningReducer, initialEngineState } from '../engine/learningReducer';
import {
  mos14OxidePhysics,
  mos14Surface,
  mos14Current,
  mos14OxideCurrent,
  mos14Cv,
} from '../a05/mos14/mos14Model';
import { applyMos14ActionAdapter } from '../engine/adapters/mos14ActionAdapter';
import { voiceEngine } from '../lib/voice/webSpeechEngine';

describe('A02 Lesson 14 MOS Capacitor & Surface Inversion Integration Tests', () => {
  it('1. Step 0 Concept step auto-pass verification', () => {
    const s0 = mosCapacitorLesson.steps[0];
    expect(s0.stepType).toBe('CONCEPT');
    const result = evaluateStepRules(s0, {});
    expect(result.passed).toBe(true);
    expect(result.ruleResults).toEqual([]);
  });

  it('2. 14-S01 Oxide Field & Charging Current model and evaluation', () => {
    const s1 = mosCapacitorLesson.steps[1];
    expect(s1.id).toBe('step-mos14-s1-oxide-field');

    // Model checks
    const steady = mos14OxideCurrent('steady');
    expect(steady.oxideSteadyDcA).toBe(0);
    expect(steady.externalChargeTransientPossible).toBe(false);

    const switching = mos14OxideCurrent('switching');
    expect(switching.oxideSteadyDcA).toBe(0);
    expect(switching.externalChargeTransientPossible).toBe(true);

    // Action adapter checks
    let params: Record<string, any> = { history: [] };
    params = applyMos14ActionAdapter(s1.id, params, 'gateV', -0.5);
    expect(params.history).toContain('negative');
    params = applyMos14ActionAdapter(s1.id, params, 'gateV', 0.3);
    expect(params.history).toContain('positive');
    params = applyMos14ActionAdapter(s1.id, params, 'phase', 'switching');
    expect(params.history).toContain('switching');
    params = applyMos14ActionAdapter(s1.id, params, 'phase', 'steady');
    expect(params.history).toContain('steady');

    // Evaluation incomplete
    const failEval = evaluateStepRules(s1, {
      history: ['negative', 'positive'],
      answer: 'field-not-dc',
    });
    expect(failEval.passed).toBe(false);

    // Evaluation incorrect misconception
    const failMisconception = evaluateStepRules(s1, {
      history: ['negative', 'positive', 'switching', 'steady'],
      answer: 'm1',
    });
    expect(failMisconception.passed).toBe(false);

    // Evaluation complete
    const passEval = evaluateStepRules(s1, {
      history: ['negative', 'positive', 'switching', 'steady'],
      answer: 'field-not-dc',
    });
    expect(passEval.passed).toBe(true);
  });

  it('3. 14-S02 Accumulation, Depletion, Inversion model and evaluation', () => {
    const s2 = mosCapacitorLesson.steps[2];
    expect(s2.id).toBe('step-mos14-s2-accumulation-inversion');

    // Physics checks
    expect(mos14Surface(-0.5, 5)).toBe('accumulation');
    expect(mos14Surface(0, 5)).toBe('flatband');
    expect(mos14Surface(0.3, 5)).toBe('depletion');
    expect(mos14Surface(1.1, 5)).toBe('inversion');

    const geom = mos14OxidePhysics(5);
    expect(geom.vfbV).toBe(0);
    expect(geom.vtV).toBeGreaterThan(0.78);
    expect(geom.vtV).toBeLessThan(0.79);

    // Action adapter checks
    let params: Record<string, any> = { history: [] };
    params = applyMos14ActionAdapter(s2.id, params, 'gateV', -0.5);
    params = applyMos14ActionAdapter(s2.id, params, 'gateV', 0);
    params = applyMos14ActionAdapter(s2.id, params, 'gateV', 0.3);
    params = applyMos14ActionAdapter(s2.id, params, 'gateV', 1.1);
    expect(params.history).toEqual(['accumulation', 'flatband', 'depletion', 'inversion']);

    // Evaluation incomplete
    const failEval = evaluateStepRules(s2, {
      history: ['accumulation', 'depletion'],
      answer: 'bulk-unchanged',
    });
    expect(failEval.passed).toBe(false);

    // Evaluation complete
    const passEval = evaluateStepRules(s2, {
      history: ['accumulation', 'flatband', 'depletion', 'inversion'],
      answer: 'bulk-unchanged',
    });
    expect(passEval.passed).toBe(true);
  });

  it('4. 14-S03 Oxide Capacitance & C-V model and evaluation', () => {
    const s3 = mosCapacitorLesson.steps[3];
    expect(s3.id).toBe('step-mos14-s3-capacitance-cv');

    // Physics checks
    const c5 = mos14OxidePhysics(5);
    const c10 = mos14OxidePhysics(10);
    expect(c10.coxMicroFPerCm2 / c5.coxMicroFPerCm2).toBeCloseTo(0.5, 5);

    const cvData = mos14Cv(5, true);
    expect(cvData.depletionSeriesToyMicroFPerCm2).toBeLessThan(cvData.coxMicroFPerCm2);

    // Action adapter checks
    let params: Record<string, any> = { history: [] };
    params = applyMos14ActionAdapter(s3.id, params, 'oxideNm', 5);
    params = applyMos14ActionAdapter(s3.id, params, 'oxideNm', 10);
    params = applyMos14ActionAdapter(s3.id, params, 'showCv', true);
    expect(params.history).toEqual(['tox5', 'tox10', 'cv']);

    // Evaluation pass
    const passEval = evaluateStepRules(s3, {
      history: ['tox5', 'tox10', 'cv'],
      answer: 'inverse-series-frequency',
    });
    expect(passEval.passed).toBe(true);
  });

  it('5. 14-S04 Bridge to MOSFET model and evaluation', () => {
    const s4 = mosCapacitorLesson.steps[4];
    expect(s4.id).toBe('step-mos14-s4-cap-to-nmosfet');

    // Physics checks
    const cap = mos14Current({ gateV: 1.1, oxideNm: 5, phase: 'steady', device: 'capacitor', vds: 0, showCv: false });
    expect(cap.drainCurrent).toBe('undefined');
    expect(cap.hasDrainTerminal).toBe(false);

    const nmosZero = mos14Current({ gateV: 1.1, oxideNm: 5, phase: 'steady', device: 'nmos', vds: 0, showCv: false });
    expect(nmosZero.drainCurrent).toBe('zero');
    expect(nmosZero.hasDrainTerminal).toBe(true);

    const nmosPos = mos14Current({ gateV: 1.1, oxideNm: 5, phase: 'steady', device: 'nmos', vds: 0.5, showCv: false });
    expect(nmosPos.drainCurrent).toBe('possible');

    // Action adapter checks
    let params: Record<string, any> = { history: [] };
    params = applyMos14ActionAdapter(s4.id, params, 'device', 'capacitor');
    params = applyMos14ActionAdapter(s4.id, params, 'device', 'nmos');
    params = applyMos14ActionAdapter(s4.id, params, 'vds', 0);
    params = applyMos14ActionAdapter(s4.id, params, 'vds', 0.5);
    expect(params.history).toEqual(['cap', 'nmos-zero', 'nmos-positive']);

    // Evaluation pass
    const passEval = evaluateStepRules(s4, {
      history: ['cap', 'nmos-zero', 'nmos-positive'],
      answer: 'terminals-and-vds',
    });
    expect(passEval.passed).toBe(true);
  });

  it('6. Reducer state transitions with Mos14 actions', () => {
    let state = learningReducer(initialEngineState, {
      type: 'INIT_LESSON',
      payload: { courseId: 'course-semiconductor', lesson: mosCapacitorLesson },
    });

    // Advance to step 1
    state = learningReducer(state, { type: 'NEXT_STEP' });
    expect(state.currentStepIndex).toBe(1);

    // Update params via action adapter
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'gateV', value: -0.5 },
    });
    expect(state.currentParams.history).toContain('negative');

    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'gateV', value: 0.3 },
    });
    expect(state.currentParams.history).toContain('positive');

    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'phase', value: 'switching' },
    });
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'phase', value: 'steady' },
    });
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'field-not-dc' },
    });

    const evalResult = evaluateStepRules(mosCapacitorLesson.steps[1], state.currentParams);
    expect(evalResult.passed).toBe(true);

    state = learningReducer(state, {
      type: 'EVAL_RESULT',
      payload: evalResult,
    });
    expect(state.fsmState).toBe('EVALUATED_CORRECT');
    expect(state.completedStepIds).toContain('step-mos14-s1-oxide-field');
  });

  it('7. Voice Engine rate, selection, and preview API verification (Issue #41)', () => {
    voiceEngine.setRate(1.1);
    expect(voiceEngine.getRate()).toBe(1.1);

    voiceEngine.setRate(0.9);
    expect(voiceEngine.getRate()).toBe(0.9);

    // Rate boundary clamping
    voiceEngine.setRate(0.1);
    expect(voiceEngine.getRate()).toBe(0.5);
    voiceEngine.setRate(3.5);
    expect(voiceEngine.getRate()).toBe(2.0);

    // Restore to standard
    voiceEngine.setRate(1.0);
    expect(voiceEngine.getRate()).toBe(1.0);
  });
});
