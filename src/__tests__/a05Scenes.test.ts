import { describe, expect, it } from 'vitest';
import {
  a05SceneIds, cmosObservation, evaluateA05Scene, initialSceneValues,
  mosfetObservation, resistorInverterObservation,
} from '../a05/scenePhysics';

describe('A05 discovery lab scientific contracts', () => {
  it('VGS changes surface channel but at VDS=0 net DC drain current stays zero', () => {
    expect(mosfetObservation(0, 0).isChannelFormed).toBe(false);
    expect(mosfetObservation(0.6, 0).id).toBe(0);
    expect(mosfetObservation(1.2, 0).isChannelFormed).toBe(true);
    expect(mosfetObservation(1.2, 0).id).toBe(0);
  });
  it('a conductive channel needs VDS, and saturation does not mean zero current', () => {
    const zero = mosfetObservation(1.5, 0);
    const triode = mosfetObservation(1.5, 0.4);
    const saturated = mosfetObservation(1.5, 1.8);
    expect(zero.id).toBe(0);
    expect(triode.region).toBe('TRIODE');
    expect(triode.id).toBeGreaterThan(0);
    expect(saturated.region).toBe('SATURATION');
    expect(saturated.id).toBeGreaterThan(0);
  });
  it('resistor-loaded nMOS output is HIGH when OFF, about 0.45V LOW when ON', () => {
    const off = resistorInverterObservation(0);
    const on = resistorInverterObservation(5);
    expect(off.vout).toBe(5);
    expect(off.outputLogic).toBe(1);
    expect(on.outputLogic).toBe(0);
    expect(on.vout).toBeGreaterThan(0.4);
    expect(on.vout).toBeLessThan(0.5);
    expect(on.vout).not.toBe(0);
  });
  it('CMOS has separate complementary pMOS/nMOS switches', () => {
    const low = cmosObservation(0);
    const high = cmosObservation(1);
    expect([low.pmosOn, low.nmosOn, low.output]).toEqual([true, false, 1]);
    expect([high.pmosOn, high.nmosOn, high.output]).toEqual([false, true, 0]);
    expect(low.settledDirectPath).toBe(false);
  });
  it('all four scenes require voltage observation AND concept answer', () => {
    for (const id of a05SceneIds) {
      const values = initialSceneValues(id);
      expect(evaluateA05Scene(id, [0, 5], null, values).passed).toBe(false);
    }
    expect(evaluateA05Scene('mosfet-field', [0, 1.2], 'surface', initialSceneValues('mosfet-field')).passed).toBe(true);
    expect(evaluateA05Scene('mosfet-current', [0, 1.0], 'voltage-needed', initialSceneValues('mosfet-current')).passed).toBe(true);
    expect(evaluateA05Scene('nmos-resistor-inverter', [0, 5], 'pulldown', initialSceneValues('nmos-resistor-inverter')).passed).toBe(true);
  });
  it('CMOS truth table reports each wrong condition, never passes on partial answers', () => {
    const values = { ...initialSceneValues('cmos-not-gate'), out0: 1 as const, out1: 1 as const };
    const partial = evaluateA05Scene('cmos-not-gate', [0, 5], null, values);
    expect(partial.passed).toBe(false);
    expect(partial.conditions[1].passed).toBe(true);
    expect(partial.conditions[2].passed).toBe(false);
    const full = evaluateA05Scene('cmos-not-gate', [0, 5], null, { ...values, out1: 0 });
    expect(full.passed).toBe(true);
  });
});
