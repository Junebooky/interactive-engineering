import { describe, expect, it } from 'vitest';
import { dramLesson } from '../content/semiconductor/dramLesson';
import { evaluateStepRules } from '../engine/validationEngine';
import { learningReducer, initialEngineState } from '../engine/learningReducer';
import {
  writeCell, shareCharge, senseRead, leakageVoltage, bankSchedule, bankOverlap,
} from '../a05/dram/dramModel';

describe('DRAM D02 Lesson Engine Integration & Physics Model Tests', () => {
  it('1. Step 0 Concept step auto-pass verification', () => {
    const s0 = dramLesson.steps[0];
    expect(s0.stepType).toBe('CONCEPT');
    const result = evaluateStepRules(s0, {});
    expect(result.passed).toBe(true);
    expect(result.ruleResults).toEqual([]);
  });

  it('2. D02-S01 Write & Isolation physics and rule evaluation', () => {
    const s1 = dramLesson.steps[1];
    expect(s1.id).toBe('step-dram-s1-write');

    // Model test: When WL=1, cell takes BL (1)
    let cell = writeCell(0, 1, 1);
    expect(cell).toBe(1);

    // When WL=0, cell remains 1 even if BL becomes 0
    cell = writeCell(cell, 0, 0);
    expect(cell).toBe(1);

    // Under-evaluated params (missing held / wrong answer)
    const failEval = evaluateStepRules(s1, {
      history: 'charged',
      answer: 'perpetual',
    });
    expect(failEval.passed).toBe(false);

    // Full pass params
    const passEval = evaluateStepRules(s1, {
      history: ['charged', 'held'],
      answer: 'isolated',
    });
    expect(passEval.passed).toBe(true);
    expect(passEval.ruleResults.find(r => r.label?.includes('셀 유지'))?.passed).toBe(true);
    expect(passEval.ruleResults.find(r => r.label?.includes('원리'))?.passed).toBe(true);
  });

  it('3. D02-S02 Charge sharing and Sense-Restore physics for both Bit 1 and Bit 0', () => {
    const s2 = dramLesson.steps[2];
    expect(s2.id).toBe('step-dram-s2-sense-restore');

    // Bit 1: Vpre=0.5, Cc:Cb=1:9 -> Vshared = 0.55 (+0.05)
    const q1 = shareCharge(1);
    expect(q1.sharedVoltage).toBeCloseTo(0.55, 3);
    expect(q1.delta).toBeCloseTo(0.05, 3);
    expect(q1.senseOutput).toBe(1);

    // Bit 0: Vpre=0.5, Cc:Cb=1:9 -> Vshared = 0.45 (-0.05)
    const q0 = shareCharge(0);
    expect(q0.sharedVoltage).toBeCloseTo(0.45, 3);
    expect(q0.delta).toBeCloseTo(-0.05, 3);
    expect(q0.senseOutput).toBe(0);

    // 4 phases verification
    const pre = senseRead(1, 'precharge');
    expect(pre.bitlineVoltage).toBe(0.5);
    expect(pre.restored).toBe(false);

    const shared = senseRead(1, 'shared');
    expect(shared.cellVoltage).toBeCloseTo(0.55, 3);
    expect(shared.bitlineVoltage).toBeCloseTo(0.55, 3);

    const sensed = senseRead(1, 'sensed');
    expect(sensed.bitlineVoltage).toBe(1);
    expect(sensed.restored).toBe(false);

    const restored = senseRead(1, 'restored');
    expect(restored.cellVoltage).toBe(1);
    expect(restored.bitlineVoltage).toBe(1);
    expect(restored.restored).toBe(true);

    // Evaluation check
    const passEval = evaluateStepRules(s2, {
      history: ['shared', 'restored'],
      answer: 'restore',
    });
    expect(passEval.passed).toBe(true);
    expect(passEval.ruleResults.find(r => r.label?.includes('복원'))?.passed).toBe(true);
    expect(passEval.ruleResults.find(r => r.label?.includes('파괴적 읽기'))?.passed).toBe(true);
  });

  it('4. D02-S03 Leakage and Refresh physics model', () => {
    const s3 = dramLesson.steps[3];
    expect(s3.id).toBe('step-dram-s3-leak-refresh');

    // t=0 -> 1.0V
    expect(leakageVoltage(0, null)).toBe(1.0);
    // t=1.0 -> 0.8V (leakRate=0.2)
    expect(leakageVoltage(1.0, null)).toBeCloseTo(0.8, 2);
    // t=2.0 -> 0.6V
    expect(leakageVoltage(2.0, null)).toBeCloseTo(0.6, 2);

    // Refresh at t=1.5 restores margin
    expect(leakageVoltage(1.5, 1.5)).toBe(1.0);

    const passEval = evaluateStepRules(s3, {
      history: ['leaked', 'refreshed'],
      answer: 'leak',
    });
    expect(passEval.passed).toBe(true);
    expect(passEval.ruleResults.find(r => r.label?.includes('리프레시'))?.passed).toBe(true);
    expect(passEval.ruleResults.find(r => r.label?.includes('필요성'))?.passed).toBe(true);
  });

  it('5. D02-S04 Bank parallelism schedule and overlap physics', () => {
    const s4 = dramLesson.steps[4];
    expect(s4.id).toBe('step-dram-s4-row-bank');

    // 1 bank: serialized
    const sched1 = bankSchedule(1);
    expect(sched1[0].start).toBe(0);
    expect(sched1[0].finish).toBe(2);
    expect(sched1[1].start).toBe(2);
    expect(sched1[1].finish).toBe(4);
    expect(bankOverlap(1)).toBe(false);

    // 2 banks: internal timeline overlap
    const sched2 = bankSchedule(2);
    expect(sched2[0].start).toBe(0);
    expect(sched2[1].start).toBe(0);
    expect(sched2[0].bank).not.toBe(sched2[1].bank);
    expect(bankOverlap(2)).toBe(true);

    const passEval = evaluateStepRules(s4, {
      history: ['serial', 'parallel'],
      answer: 'conditional',
    });
    expect(passEval.passed).toBe(true);
    expect(passEval.ruleResults.find(r => r.label?.includes('겹침'))?.passed).toBe(true);
    expect(passEval.ruleResults.find(r => r.label?.includes('병렬성'))?.passed).toBe(true);
  });

  it('6. S01 User Action Sequence: WL1/BL1 -> charge -> WL0/BL0 -> hold -> pass', () => {
    const s1 = dramLesson.steps[1];
    let state = learningReducer(initialEngineState, {
      type: 'INIT_LESSON',
      payload: { courseId: 'course-semiconductor', lesson: dramLesson, restoredStepIndex: 1 },
    });
    expect(state.currentParams.cell).toBe(0);
    expect(state.currentParams.history).toEqual([]);

    // 1. Student turns WL ON while BL is 1
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'wl', value: 1 },
    });
    expect(state.currentParams.cell).toBe(1);
    expect(state.currentParams.history).toContain('charged');

    // 2. Student turns WL OFF (closes gate)
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'wl', value: 0 },
    });
    expect(state.currentParams.cell).toBe(1);

    // 3. Student changes BL to 0 (line drops to 0V)
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'bl', value: 0 },
    });
    // Cell must still be 1 (isolated!) and history must record 'held'
    expect(state.currentParams.cell).toBe(1);
    expect(state.currentParams.history).toContain('held');

    // 4. Select answer and evaluate
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'isolated' },
    });
    const result = evaluateStepRules(s1, state.currentParams);
    expect(result.passed).toBe(true);
  });

  it('7. S02 User Action Sequence: Bit selection and Precharge -> Shared -> Sensed -> Restored', () => {
    const s2 = dramLesson.steps[2];
    let state = learningReducer(initialEngineState, {
      type: 'INIT_LESSON',
      payload: { courseId: 'course-semiconductor', lesson: dramLesson, restoredStepIndex: 2 },
    });

    // Student selects Bit 0
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'bit', value: 0 },
    });
    expect(state.currentParams.bit).toBe(0);

    // Progression: Shared
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'phase', value: 'shared' },
    });
    expect(state.currentParams.history).toContain('shared');
    expect(state.currentParams.bitlineVoltage).toBeCloseTo(0.45, 2);

    // Progression: Sensed
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'phase', value: 'sensed' },
    });
    expect(state.currentParams.bitlineVoltage).toBe(0);

    // Progression: Restored
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'phase', value: 'restored' },
    });
    expect(state.currentParams.history).toContain('restored');

    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'restore' },
    });
    const result = evaluateStepRules(s2, state.currentParams);
    expect(result.passed).toBe(true);
  });

  it('8. S03 User Action Sequence: Time elapsed leak -> refresh recovery', () => {
    const s3 = dramLesson.steps[3];
    let state = learningReducer(initialEngineState, {
      type: 'INIT_LESSON',
      payload: { courseId: 'course-semiconductor', lesson: dramLesson, restoredStepIndex: 3 },
    });

    // Move slider to 1.2
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'elapsed', value: 1.2 },
    });
    expect(state.currentParams.history).toContain('leaked');
    expect(state.currentParams.cellVoltage).toBeLessThan(0.8);

    // Toggle refresh ON
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'refresh', value: true },
    });
    expect(state.currentParams.history).toContain('refreshed');
    expect(state.currentParams.cellVoltage).toBe(1.0);

    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'leak' },
    });
    const result = evaluateStepRules(s3, state.currentParams);
    expect(result.passed).toBe(true);
  });

  it('9. S04 User Action Sequence: 1 bank vs 2 banks timeline comparison', () => {
    const s4 = dramLesson.steps[4];
    let state = learningReducer(initialEngineState, {
      type: 'INIT_LESSON',
      payload: { courseId: 'course-semiconductor', lesson: dramLesson, restoredStepIndex: 4 },
    });

    // 1 bank
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'banks', value: 1 },
    });
    expect(state.currentParams.history).toContain('serial');

    // 2 banks
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'banks', value: 2 },
    });
    expect(state.currentParams.history).toContain('parallel');

    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'conditional' },
    });
    const result = evaluateStepRules(s4, state.currentParams);
    expect(result.passed).toBe(true);
  });

  it('10. S02 Negative Case: Skipping sensed directly to restored is rejected', () => {
    const s2 = dramLesson.steps[2];
    let state = learningReducer(initialEngineState, {
      type: 'INIT_LESSON',
      payload: { courseId: 'course-semiconductor', lesson: dramLesson, restoredStepIndex: 2 },
    });

    // Student goes: precharge -> shared
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'phase', value: 'shared' },
    });
    expect(state.currentParams.history).toContain('shared');

    // Negative case: Directly jumps to restored without going through sensed
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'phase', value: 'restored' },
    });
    // restored MUST NOT be awarded because sensed was skipped!
    expect(state.currentParams.history).not.toContain('restored');

    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'restore' },
    });
    // Evaluation must fail
    const result = evaluateStepRules(s2, state.currentParams);
    expect(result.passed).toBe(false);
  });

  it('11. S03 Negative Case: Refreshing before leakage does not award refreshed milestone', () => {
    const s3 = dramLesson.steps[3];
    let state = learningReducer(initialEngineState, {
      type: 'INIT_LESSON',
      payload: { courseId: 'course-semiconductor', lesson: dramLesson, restoredStepIndex: 3 },
    });

    // Student toggles refresh at t=0 without letting voltage leak
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'refresh', value: true },
    });
    // refreshed MUST NOT be awarded before leakage
    expect(state.currentParams.history).not.toContain('refreshed');

    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'leak' },
    });
    // Evaluation must fail
    const resultFail = evaluateStepRules(s3, state.currentParams);
    expect(resultFail.passed).toBe(false);

    // Now let time elapse >= 1.0 (leakage happens)
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'elapsed', value: 1.2 },
    });
    expect(state.currentParams.history).toContain('leaked');

    // Toggle refresh ON after leakage
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'refresh', value: true },
    });
    expect(state.currentParams.history).toContain('refreshed');

    const resultPass = evaluateStepRules(s3, state.currentParams);
    expect(resultPass.passed).toBe(true);
  });
});

