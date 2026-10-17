import { describe, expect, it } from 'vitest';
import { dramLesson } from '../content/semiconductor/dramLesson';
import { evaluateStepRules } from '../engine/validationEngine';
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
});
