import { describe, it, expect } from 'vitest';
import { gpuLesson } from '../content/semiconductor/gpuLesson';
import { courses } from '../content/courses';
import { learningReducer, type LearningEngineState } from '../engine/learningReducer';
import { evaluateStepRules } from '../engine/validationEngine';

describe('GPU Memory Bottleneck & DRAM Families (G03) Integration Tests', () => {
  it('registers gpuLesson under course-semiconductor with 5 valid steps (1 intro + 4 interactive)', () => {
    const semiCourse = courses.find((c) => c.id === 'course-semiconductor');
    expect(semiCourse).toBeDefined();
    expect(semiCourse?.lessons.some((l) => l.id === 'lesson-gpu')).toBe(true);

    expect(gpuLesson.steps).toHaveLength(5);
    // Step 0 is CONCEPT
    expect(gpuLesson.steps[0].stepType).toBe('CONCEPT');

    // Steps 1-4 are MANIPULATE with hints, misconceptions, rules, whyExplanation
    for (let i = 1; i < gpuLesson.steps.length; i++) {
      const step = gpuLesson.steps[i];
      expect(step.hints).toHaveLength(3);
      expect(step.whyExplanation).toBeTruthy();
      expect(step.rules?.length).toBeGreaterThanOrEqual(3);
    }
  });

  function createInitialState(stepIndex = 1): LearningEngineState {
    const step = gpuLesson.steps[stepIndex];
    return learningReducer(
      {} as any,
      {
        type: 'INIT_LESSON',
        payload: {
          courseId: 'course-semiconductor',
          lesson: gpuLesson,
          restoredStepIndex: stepIndex,
          restoredParams: { ...step.initialParams },
        },
      }
    );
  }

  it('Step 1 (G03-S01): compute feeding evaluates fully overlapped pipeline and supply limits', () => {
    let state = createInitialState(1);
    const step = gpuLesson.steps[1];

    // Initial evaluation should not pass rules
    let evalRes = evaluateStepRules(step, state.currentParams);
    expect(evalRes.passed).toBe(false);

    // 1. Core 16 with feed 8
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'compute', value: 16 },
    });
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'feed', value: 8 },
    });
    expect(state.currentParams.throughput).toBe(8);
    expect(state.currentParams.toySeconds).toBe(8);
    expect(state.currentParams.bottleneck).toBe('data supply');
    expect(state.currentParams.history).toContain('core16feed8');

    // 2. Core 32 with feed 8 (bottleneck discovered: time still 8s!)
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'compute', value: 32 },
    });
    expect(state.currentParams.throughput).toBe(8);
    expect(state.currentParams.toySeconds).toBe(8);
    expect(state.currentParams.history).toContain('core32feed8');

    // 3. Relieve bottleneck by increasing feed to 32
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'feed', value: 32 },
    });
    expect(state.currentParams.throughput).toBe(32);
    expect(state.currentParams.toySeconds).toBe(2);
    expect(state.currentParams.history).toContain('feed32');

    // 4. Select answer
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'supply-limits' },
    });

    evalRes = evaluateStepRules(step, state.currentParams);
    expect(evalRes.passed).toBe(true);
  });

  it('Step 2 (G03-S02): detects placement mismatch and requires exploring all 3 memory family placements', () => {
    let state = createInitialState(2);
    const step = gpuLesson.steps[2];

    // Mismatched pair test
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'family', value: 'HBM' },
    });
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'site', value: 'cpu-dimm' },
    });
    expect(state.currentParams.placementMatches).toBe(false);
    expect(state.currentParams.history).toContain('mismatch-HBM-cpu-dimm');
    expect(evaluateStepRules(step, state.currentParams).passed).toBe(false);

    // Explore 3 valid placements
    // 1) DDR/RDIMM -> cpu-dimm
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'family', value: 'DDR/RDIMM' },
    });
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'site', value: 'cpu-dimm' },
    });
    expect(state.currentParams.placementMatches).toBe(true);
    expect(state.currentParams.history).toContain('cpu-dimm');

    // 2) GDDR6/GDDR7 -> gpu-board
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'family', value: 'GDDR6/GDDR7' },
    });
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'site', value: 'gpu-board' },
    });
    expect(state.currentParams.placementMatches).toBe(true);
    expect(state.currentParams.history).toContain('gpu-board');

    // 3) HBM -> gpu-package
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'family', value: 'HBM' },
    });
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'site', value: 'gpu-package' },
    });
    expect(state.currentParams.placementMatches).toBe(true);
    expect(state.currentParams.history).toContain('gpu-package');

    // Select answer
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'all-dram-roles' },
    });

    const evalRes = evaluateStepRules(step, state.currentParams);
    expect(evalRes.passed).toBe(true);
  });

  it('Step 3 (G03-S03): calculates theoretical bandwidth and verifies PAM3 3-level distinction', () => {
    let state = createInitialState(3);
    const step = gpuLesson.steps[3];

    // 1. 24 Gb/s/pin -> 128 * 24 / 8 = 384 GB/s
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'pinRate', value: 24 },
    });
    expect(state.currentParams.maxGBps).toBe(384);
    expect(state.currentParams.history).toContain('rate24');

    // 2. 32 Gb/s/pin -> 128 * 32 / 8 = 512 GB/s
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'pinRate', value: 32 },
    });
    expect(state.currentParams.maxGBps).toBe(512);
    expect(state.currentParams.history).toContain('rate32');

    // 3. PAM3 modulation
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'signal', value: 'PAM3' },
    });
    expect(state.currentParams.levels).toBe(3);
    expect(state.currentParams.history).toContain('pam3');

    // 4. Select answer
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'theoretical-pam3' },
    });

    const evalRes = evaluateStepRules(step, state.currentParams);
    expect(evalRes.passed).toBe(true);
  });

  it('Step 4 (G03-S04): verifies HBM TSV/interposer topology and engineering tradeoffs', () => {
    let state = createInitialState(4);
    const step = gpuLesson.steps[4];

    // 1. Observe GDDR board topology
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'topology', value: 'gddr-board' },
    });
    expect(state.currentParams.history).toContain('gddr');

    // 2. Observe HBM stack topology
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'topology', value: 'hbm-stack' },
    });
    expect(state.currentParams.history).toContain('hbm');

    // 3. Inspect constraints panel
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'showConstraints', value: true },
    });
    expect(state.currentParams.history).toContain('constraints');
    expect(state.currentParams.packagingTradeoff).toContain('적층');

    // 4. Answer question
    state = learningReducer(state, {
      type: 'UPDATE_PARAM',
      payload: { key: 'answer', value: 'relative-tradeoffs' },
    });

    const evalRes = evaluateStepRules(step, state.currentParams);
    expect(evalRes.passed).toBe(true);
  });

  it('runs complete 5-step sequence from Intro to Lesson Completion', () => {
    // Start at Step 0 (Intro)
    let state = createInitialState(0);
    const eval0 = evaluateStepRules(gpuLesson.steps[0], state.currentParams);
    expect(eval0.passed).toBe(true);
    state = learningReducer(state, { type: 'EVAL_RESULT', payload: eval0 });
    expect(state.fsmState).toBe('EVALUATED_CORRECT');

    state = learningReducer(state, { type: 'NEXT_STEP' });
    expect(state.currentStepIndex).toBe(1);

    // Step 1: Feeding
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'compute', value: 16 } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'feed', value: 8 } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'compute', value: 32 } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'feed', value: 32 } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'answer', value: 'supply-limits' } });
    const eval1 = evaluateStepRules(gpuLesson.steps[1], state.currentParams);
    expect(eval1.passed).toBe(true);
    state = learningReducer(state, { type: 'EVAL_RESULT', payload: eval1 });
    expect(state.fsmState).toBe('EVALUATED_CORRECT');

    state = learningReducer(state, { type: 'NEXT_STEP' });
    expect(state.currentStepIndex).toBe(2);

    // Step 2: Families
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'family', value: 'DDR/RDIMM' } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'site', value: 'cpu-dimm' } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'family', value: 'GDDR6/GDDR7' } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'site', value: 'gpu-board' } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'family', value: 'HBM' } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'site', value: 'gpu-package' } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'answer', value: 'all-dram-roles' } });
    const eval2 = evaluateStepRules(gpuLesson.steps[2], state.currentParams);
    expect(eval2.passed).toBe(true);
    state = learningReducer(state, { type: 'EVAL_RESULT', payload: eval2 });
    expect(state.fsmState).toBe('EVALUATED_CORRECT');

    state = learningReducer(state, { type: 'NEXT_STEP' });
    expect(state.currentStepIndex).toBe(3);

    // Step 3: Width & Rate
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'pinRate', value: 24 } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'pinRate', value: 32 } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'signal', value: 'PAM3' } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'answer', value: 'theoretical-pam3' } });
    const eval3 = evaluateStepRules(gpuLesson.steps[3], state.currentParams);
    expect(eval3.passed).toBe(true);
    state = learningReducer(state, { type: 'EVAL_RESULT', payload: eval3 });
    expect(state.fsmState).toBe('EVALUATED_CORRECT');

    state = learningReducer(state, { type: 'NEXT_STEP' });
    expect(state.currentStepIndex).toBe(4);

    // Step 4: HBM Tradeoffs
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'topology', value: 'gddr-board' } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'topology', value: 'hbm-stack' } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'showConstraints', value: true } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'answer', value: 'relative-tradeoffs' } });
    const eval4 = evaluateStepRules(gpuLesson.steps[4], state.currentParams);
    expect(eval4.passed).toBe(true);
    state = learningReducer(state, { type: 'EVAL_RESULT', payload: eval4 });
    expect(state.fsmState).toBe('EVALUATED_CORRECT');

    // Final Next Step completes lesson
    state = learningReducer(state, { type: 'NEXT_STEP' });
    expect(state.fsmState).toBe('LESSON_FINISHED');
    expect(state.completedStepIds).toHaveLength(5);
  });
});
