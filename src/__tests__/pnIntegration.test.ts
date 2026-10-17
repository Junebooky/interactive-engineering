import { describe, expect, it } from 'vitest';
import { pnLesson } from '../content/semiconductor/pnLesson';
import { evaluateStepRules } from '../engine/validationEngine';
import { learningReducer, initialEngineState } from '../engine/learningReducer';
import {
  bandMaterial,
  dopantModel,
  pnEquilibrium,
  depletion,
  diodeCurrent,
  gateContrast,
} from '../a05/pn/pnModel';

describe('A02 Lesson 11 Semiconductor Band, Doping & PN Integration Tests', () => {
  it('1. Step 0 Concept step auto-pass verification', () => {
    const s0 = pnLesson.steps[0];
    expect(s0.stepType).toBe('CONCEPT');
    const result = evaluateStepRules(s0, {});
    expect(result.passed).toBe(true);
    expect(result.ruleResults).toEqual([]);
  });

  it('2. 11-S01 Bandgap model and evaluation', () => {
    const s1 = pnLesson.steps[1];
    expect(s1.id).toBe('step-pn-s1-band-gap');

    // Model checks
    const metal = bandMaterial('metal', false, false);
    expect(metal.gapEV).toBe(0);
    const silicon = bandMaterial('silicon', true, false);
    expect(silicon.gapEV).toBe(1.1);
    expect(silicon.excited).toBe(true);
    const insulator = bandMaterial('insulator', false, false);
    expect(insulator.gapEV).toBe(5);

    // Evaluation incomplete
    const failEval = evaluateStepRules(s1, {
      history: ['metal', 'silicon'],
      answer: 'gap-energy-not-hole',
    });
    expect(failEval.passed).toBe(false);

    // Evaluation complete
    const passEval = evaluateStepRules(s1, {
      history: ['metal', 'silicon', 'insulator', 'excited'],
      answer: 'gap-energy-not-hole',
    });
    expect(passEval.passed).toBe(true);
  });

  it('3. 11-S02 Silicon Doping model and evaluation', () => {
    const s2 = pnLesson.steps[2];
    expect(s2.id).toBe('step-pn-s2-doping');

    const donor = dopantModel('donor');
    expect(donor.majority).toBe('electron');
    expect(donor.fixedIon).toBe('+ donor ion');

    const acceptor = dopantModel('acceptor');
    expect(acceptor.majority).toBe('hole');
    expect(acceptor.fixedIon).toBe('- acceptor ion');

    // Incomplete
    const failEval = evaluateStepRules(s2, {
      history: ['donor'],
      answer: 'majority-neutrality',
    });
    expect(failEval.passed).toBe(false);

    // Complete
    const passEval = evaluateStepRules(s2, {
      history: ['donor', 'acceptor'],
      answer: 'majority-neutrality',
    });
    expect(passEval.passed).toBe(true);
  });

  it('4. 11-S03 PN Junction Diffusion & Drift Equilibrium model and evaluation', () => {
    const s3 = pnLesson.steps[3];
    expect(s3.id).toBe('step-pn-s3-equilibrium');

    const sep = pnEquilibrium('separate');
    expect(sep.diffusionToy).toBe(0);
    expect(sep.netCurrentToy).toBe(0);

    const eq = pnEquilibrium('equilibrium');
    expect(eq.electricField).toBe('n(+) → p(−)');
    expect(eq.diffusionToy).toBe(1);
    expect(eq.driftToy).toBe(-1);
    expect(eq.netCurrentToy).toBe(0);

    // Evaluation
    const passEval = evaluateStepRules(s3, {
      history: ['diffusion', 'equilibrium'],
      answer: 'balanced-not-battery',
    });
    expect(passEval.passed).toBe(true);
  });

  it('5. 11-S04 Depletion Bias Calculator model and evaluation', () => {
    const s4 = pnLesson.steps[4];
    expect(s4.id).toBe('step-pn-s4-depletion-bias');

    const reverse = depletion(-1, 1e16, 1e16);
    const zero = depletion(0, 1e16, 1e16);
    const forward = depletion(0.2, 1e16, 1e16);

    expect(reverse.widthMicrons).toBeGreaterThan(zero.widthMicrons);
    expect(zero.widthMicrons).toBeGreaterThan(forward.widthMicrons);
    expect(reverse.builtInV).toBeCloseTo(0.714, 2);

    // Evaluation
    const passEval = evaluateStepRules(s4, {
      history: ['reverse', 'zero', 'forward'],
      answer: 'reverse-widens',
    });
    expect(passEval.passed).toBe(true);
  });

  it('6. 11-S05 Diode Current vs MOS Gate model and evaluation', () => {
    const s5 = pnLesson.steps[5];
    expect(s5.id).toBe('step-pn-s5-diode-to-mos');

    const d03 = diodeCurrent(0.3);
    const d04 = diodeCurrent(0.4);
    expect(d04.currentNanoA).toBeGreaterThan(d03.currentNanoA * 5); // exponential increase

    const rev = diodeCurrent(-1);
    expect(rev.currentPicoA).toBeCloseTo(-1, 1);

    const mos = gateContrast('mos');
    expect(mos.hasInsulator).toBe(true);

    // Evaluation
    const passEval = evaluateStepRules(s5, {
      history: ['0.3', '0.4', '-1', 'mos'],
      answer: 'nonlinear-oxide',
    });
    expect(passEval.passed).toBe(true);
  });

  it('7. Reducer action adapter execution and milestone accumulation', () => {
    let state = learningReducer(initialEngineState, {
      type: 'INIT_LESSON',
      payload: { courseId: 'course-semiconductor', lesson: pnLesson },
    });

    // Step 0 -> Step 1
    state = learningReducer(state, { type: 'LOAD_STEP', payload: { stepIndex: 1 } });
    expect(state.currentStepIndex).toBe(1);

    // Update material to metal
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'material', value: 'metal' },
    });
    expect(state.currentParams.history).toContain('metal');

    // Update light to true
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'light', value: true },
    });
    expect(state.currentParams.excited).toBe(false); // metal is not excited

    // Update material to silicon
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'material', value: 'silicon' },
    });
    expect(state.currentParams.excited).toBe(true); // silicon with light is excited
    expect(state.currentParams.history).toContain('excited');
  });
});
