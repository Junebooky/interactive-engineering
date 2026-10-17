import { describe, it, expect } from 'vitest';
import { sramLesson } from '../content/semiconductor/sramLesson';
import { evaluateStepRules } from '../engine/validationEngine';
import { learningReducer, type LearningEngineState } from '../engine/learningReducer';
import {
  latch,
  access6T,
  simulateLru,
  dataLocality,
} from '../a05/sram/sramModel';

describe('A02 SRAM 05 Learning Engine Integration', () => {
  it('Step 0 (Concept Intro): conforms to 05-S00 introduction schema', () => {
    const s0 = sramLesson.steps[0];
    expect(s0.id).toBe('step-sram-s0-intro');
    expect(s0.stepType).toBe('CONCEPT');
    expect(s0.rules).toBeUndefined();
    expect(s0.title).toContain('SRAM');
  });

  it('Step 1 (05-S01 Cross-Coupled Inverters): evaluates q0, q1, volatile, and answer', () => {
    const s1 = sramLesson.steps[1];
    expect(s1.id).toBe('step-sram-s1-cross-coupled');
    expect(s1.rules).toHaveLength(4);

    // Incomplete history fails
    const failRes = evaluateStepRules(
      s1,
      { history: ['q0'], answer: 'volatile-feedback' }
    );
    expect(failRes.passed).toBe(false);

    // Full history and correct concept answer passes
    const passRes = evaluateStepRules(
      s1,
      { history: ['q0', 'q1', 'volatile'], answer: 'volatile-feedback' }
    );
    expect(passRes.passed).toBe(true);
    expect(passRes.ruleResults.every((r) => r.passed)).toBe(true);

    // Model latch check
    expect(latch(1, true, true).stable).toBe(true);
    expect(latch(1, true, false).stable).toBe(false);
  });

  it('Step 2 (05-S02 6T SRAM Access): evaluates isolated, wrote, read, and answer', () => {
    const s2 = sramLesson.steps[2];
    expect(s2.id).toBe('step-sram-s2-6t-access');
    expect(s2.rules).toHaveLength(4);

    const failRes = evaluateStepRules(
      s2,
      { history: ['isolated', 'wrote'], answer: 'four-plus-two' }
    );
    expect(failRes.passed).toBe(false);

    const passRes = evaluateStepRules(
      s2,
      { history: ['isolated', 'wrote', 'read'], answer: 'four-plus-two' }
    );
    expect(passRes.passed).toBe(true);

    // Model access6T check
    const cellW = access6T(1, 1, 0, 'write');
    expect(cellW.q).toBe(0);
    const cellIso = access6T(0, 0, 1, 'write');
    expect(cellIso.q).toBe(0); // isolated, no write
  });

  it('Step 3 (05-S03 CPU Cache vs DRAM): evaluates 1-line (41) and 2-line (32) toy units', () => {
    const s3 = sramLesson.steps[3];
    expect(s3.id).toBe('step-sram-s3-cpu-cache');
    expect(s3.rules).toHaveLength(3);

    const lru1 = simulateLru(1);
    expect(lru1.total).toBe(41);
    const lru2 = simulateLru(2);
    expect(lru2.total).toBe(32);

    const failRes = evaluateStepRules(
      s3,
      { history: ['one'], answer: 'reuse-not-twice' }
    );
    expect(failRes.passed).toBe(false);

    const passRes = evaluateStepRules(
      s3,
      { history: ['one', 'two'], answer: 'reuse-not-twice' }
    );
    expect(passRes.passed).toBe(true);
  });

  it('Step 4 (05-S04 Data Locality): evaluates resident, not-resident, input, and answer', () => {
    const s4 = sramLesson.steps[4];
    expect(s4.id).toBe('step-sram-s4-data-locality');
    expect(s4.rules).toHaveLength(4);

    const locRes = dataLocality(true);
    expect(locRes.modelUploadNeeded).toBe(false);
    const locNot = dataLocality(false);
    expect(locNot.modelUploadNeeded).toBe(true);

    const passRes = evaluateStepRules(
      s4,
      { history: ['resident', 'not-resident', 'input'], answer: 'weights-vs-input' }
    );
    expect(passRes.passed).toBe(true);
  });

  it('Full Reducer Action Sequence: Step 1 (05-S01) collects q0, q1, volatile atomically', () => {
    const s1 = sramLesson.steps[1];
    let state: LearningEngineState = learningReducer(
      {} as any,
      {
        type: 'INIT_LESSON',
        payload: { courseId: 'course-semiconductor', lesson: sramLesson, restoredStepIndex: 1 },
      }
    );

    // Initial state
    expect(state.currentParams.history).toEqual([]);

    // 1. Q=1 with supply & feedback -> records 'q1'
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'q', value: 1 },
    });
    expect(state.currentParams.history).toContain('q1');

    // 2. Q=0 with supply & feedback -> records 'q0'
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'q', value: 0 },
    });
    expect(state.currentParams.history).toContain('q0');

    // 3. Power supply turned OFF -> records 'volatile'
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'supply', value: false },
    });
    expect(state.currentParams.history).toContain('volatile');
    expect(state.currentParams.stable).toBe(false);

    // 4. Correct concept answer
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'volatile-feedback' },
    });

    const res = evaluateStepRules(s1, state.currentParams);
    expect(res.passed).toBe(true);
  });

  it('Full Reducer Action Sequence: Step 2 (05-S02) collects isolated, wrote, read atomically', () => {
    const s2 = sramLesson.steps[2];
    let state: LearningEngineState = learningReducer(
      {} as any,
      {
        type: 'INIT_LESSON',
        payload: { courseId: 'course-semiconductor', lesson: sramLesson, restoredStepIndex: 2 },
      }
    );

    // 1. WL=0 -> records 'isolated'
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'wl', value: 0 },
    });
    expect(state.currentParams.history).toContain('isolated');

    // 2. WL=1 and mode='write' -> records 'wrote'
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'wl', value: 1 },
    });
    expect(state.currentParams.history).toContain('wrote');

    // 3. Mode='read' -> records 'read'
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'mode', value: 'read' },
    });
    expect(state.currentParams.history).toContain('read');

    // 4. Answer
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'four-plus-two' },
    });

    const res = evaluateStepRules(s2, state.currentParams);
    expect(res.passed).toBe(true);
  });

  it('Full Reducer Action Sequence: Step 3 (05-S03) runs 1-line and 2-line LRU caches', () => {
    const s3 = sramLesson.steps[3];
    let state: LearningEngineState = learningReducer(
      {} as any,
      {
        type: 'INIT_LESSON',
        payload: { courseId: 'course-semiconductor', lesson: sramLesson, restoredStepIndex: 3 },
      }
    );

    // 1. 1 line execution
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'cacheRun', value: true },
    });
    expect(state.currentParams.history).toContain('one');
    expect(state.currentParams.total).toBe(41);

    // 2. 2 lines execution
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'cacheLines', value: 2 },
    });
    expect(state.currentParams.history).toContain('two');
    expect(state.currentParams.total).toBe(32);

    // 3. Answer
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'reuse-not-twice' },
    });

    const res = evaluateStepRules(s3, state.currentParams);
    expect(res.passed).toBe(true);
  });

  it('Full Reducer Action Sequence: Step 4 (05-S04) tracks model residency and input transfer', () => {
    const s4 = sramLesson.steps[4];
    let state: LearningEngineState = learningReducer(
      {} as any,
      {
        type: 'INIT_LESSON',
        payload: { courseId: 'course-semiconductor', lesson: sramLesson, restoredStepIndex: 4 },
      }
    );

    // 1. Not resident initially
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'resident', value: false },
    });
    expect(state.currentParams.history).toContain('not-resident');

    // 2. Resident toggle
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'resident', value: true },
    });
    expect(state.currentParams.history).toContain('resident');

    // 3. Send input
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'sendInput', value: true },
    });
    expect(state.currentParams.history).toContain('input');

    // 4. Answer
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'weights-vs-input' },
    });

    const res = evaluateStepRules(s4, state.currentParams);
    expect(res.passed).toBe(true);
  });
});
