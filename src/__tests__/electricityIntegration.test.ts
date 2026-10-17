import { describe, expect, it } from 'vitest';
import { electricityLesson } from '../content/semiconductor/electricityLesson';
import { evaluateStepRules } from '../engine/validationEngine';
import { learningReducer, initialEngineState } from '../engine/learningReducer';
import {
  simpleCircuit,
  resistorNetwork,
  rcModel,
  energyModel,
} from '../a05/electricity/electricityModel';

describe('A02 Lesson 12 Electricity & RC Integration Tests', () => {
  it('1. Step 0 Concept step auto-pass verification', () => {
    const s0 = electricityLesson.steps[0];
    expect(s0.stepType).toBe('CONCEPT');
    const result = evaluateStepRules(s0, {});
    expect(result.passed).toBe(true);
    expect(result.ruleResults).toEqual([]);
  });

  it('2. 12-S01 Ohm Law & Switch state transitions and evaluation', () => {
    const s1 = electricityLesson.steps[1];
    expect(s1.id).toBe('step-elec-s1-ohms-law');

    // Model check
    const open = simpleCircuit(5, false);
    expect(open.terminalVoltageV).toBe(5);
    expect(open.currentMilliAmps).toBe(0);

    const closed = simpleCircuit(5, true);
    expect(closed.currentMilliAmps).toBeCloseTo(5);

    // Incomplete evaluation
    const failEval = evaluateStepRules(s1, {
      history: ['open'],
      answer: 'v-not-current',
    });
    expect(failEval.passed).toBe(false);

    // Complete evaluation
    const passEval = evaluateStepRules(s1, {
      history: ['open', 'closed', 'electron', 'conventional'],
      answer: 'v-not-current',
    });
    expect(passEval.passed).toBe(true);
  });

  it('3. 12-S02 Series vs Parallel KCL model and evaluation', () => {
    const s2 = electricityLesson.steps[2];
    expect(s2.id).toBe('step-elec-s2-resistors-kcl');

    const series = resistorNetwork('series');
    expect(series.equivalentOhms).toBe(2000);
    expect(series.totalMilliAmps).toBeCloseTo(2.5);

    const parallel = resistorNetwork('parallel');
    expect(parallel.equivalentOhms).toBe(500);
    expect(parallel.totalMilliAmps).toBeCloseTo(10);
    expect(parallel.branchMilliAmps).toEqual([5, 5]);

    const passEval = evaluateStepRules(s2, {
      history: ['series', 'parallel'],
      answer: 'current-conserved',
    });
    expect(passEval.passed).toBe(true);
  });

  it('4. 12-S03 RC Transient charging/discharging model and evaluation', () => {
    const s3 = electricityLesson.steps[3];
    expect(s3.id).toBe('step-elec-s3-rc-transient');

    const charge = rcModel('charge', 1000, 10, 10);
    expect(charge.tauMs).toBe(10);
    expect(charge.voltageV).toBeCloseTo(3.1606, 3);

    const discharge = rcModel('discharge', 1000, 10, 10);
    expect(discharge.voltageV).toBeCloseTo(1.8394, 3);

    const doubled = rcModel('charge', 2000, 10, 10);
    expect(doubled.tauMs).toBe(20);

    const passEval = evaluateStepRules(s3, {
      history: ['charge-tau', 'discharge-tau', 'new-tau'],
      answer: 'tau-exponential',
    });
    expect(passEval.passed).toBe(true);
  });

  it('5. 12-S04 Power and Energy Joules model and evaluation', () => {
    const s4 = electricityLesson.steps[4];
    expect(s4.id).toBe('step-elec-s4-power-energy');

    const p5 = energyModel(5, 10, 10);
    expect(p5.milliWatts).toBe(50);
    expect(p5.joules).toBeCloseTo(0.5);
    expect(p5.capacitorMicroJoules).toBeCloseTo(125);

    const p10 = energyModel(10, 10, 10);
    expect(p10.capacitorMicroJoules).toBeCloseTo(500);

    const passEval = evaluateStepRules(s4, {
      history: ['base-energy', 'cap-doubled'],
      answer: 'power-vs-energy',
    });
    expect(passEval.passed).toBe(true);
  });

  it('6. Full User Learning Flow through learningReducer', () => {
    let state = learningReducer(initialEngineState, {
      type: 'INIT_LESSON',
      payload: { courseId: 'course-semiconductor', lesson: electricityLesson, restoredStepIndex: 1 },
    });

    // Step 1: Open switch then Close switch then toggle arrows
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'closed', value: false } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'closed', value: true } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'direction', value: 'electron' } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'direction', value: 'conventional' } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'answer', value: 'v-not-current' } });

    expect(state.currentParams.history).toContain('open');
    expect(state.currentParams.history).toContain('closed');
    expect(state.currentParams.history).toContain('electron');
    expect(state.currentParams.history).toContain('conventional');
    const s1Result = evaluateStepRules(electricityLesson.steps[1], state.currentParams);
    expect(s1Result.passed).toBe(true);

    // Step 2: Series to Parallel
    state = learningReducer(state, {
      type: 'INIT_LESSON',
      payload: { courseId: 'course-semiconductor', lesson: electricityLesson, restoredStepIndex: 2 },
    });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'topology', value: 'series' } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'topology', value: 'parallel' } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'answer', value: 'current-conserved' } });
    const s2Result = evaluateStepRules(electricityLesson.steps[2], state.currentParams);
    expect(s2Result.passed).toBe(true);

    // Step 3: RC charge and discharge
    state = learningReducer(state, {
      type: 'INIT_LESSON',
      payload: { courseId: 'course-semiconductor', lesson: electricityLesson, restoredStepIndex: 3 },
    });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'timeMs', value: 10 } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'mode', value: 'discharge' } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'timeMs', value: 10 } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'rOhms', value: 2000 } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'answer', value: 'tau-exponential' } });
    const s3Result = evaluateStepRules(electricityLesson.steps[3], state.currentParams);
    expect(s3Result.passed).toBe(true);

    // Step 4: Power and Energy
    state = learningReducer(state, {
      type: 'INIT_LESSON',
      payload: { courseId: 'course-semiconductor', lesson: electricityLesson, restoredStepIndex: 4 },
    });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'powerVolts', value: 5 } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'loadMilliAmps', value: 10 } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'seconds', value: 10 } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'powerVolts', value: 10 } });
    state = learningReducer(state, { type: 'UPDATE_PARAM', payload: { key: 'answer', value: 'power-vs-energy' } });
    const s4Result = evaluateStepRules(electricityLesson.steps[4], state.currentParams);
    expect(s4Result.passed).toBe(true);
  });
});
