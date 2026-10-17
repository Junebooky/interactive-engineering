import { describe, it, expect } from 'vitest';
import { calculateMosfetState } from '../simulations/mosfet/mosfetModel';
import { calculateInverterState } from '../simulations/mosfet/inverterModel';
import { calculateCircuitState } from '../simulations/ohmsLaw/circuitModel';
import { calculateGearState } from '../simulations/gears/gearModel';

describe('MOSFET Simulation Physics', () => {
  it('should be in CUTOFF when Vgs < Vth (0.7V)', () => {
    const state = calculateMosfetState({ vgs: 0.5, vds: 1.0 });
    expect(state.region).toBe('CUTOFF');
    expect(state.id).toBe(0);
    expect(state.isChannelFormed).toBe(false);
  });

  it('should be in TRIODE when Vgs >= Vth and Vds < Vgs - Vth', () => {
    // Vgs = 1.5V, Vth = 0.7V => Vov = 0.8V, Vds = 0.3V < 0.8V
    const state = calculateMosfetState({ vgs: 1.5, vds: 0.3 });
    expect(state.region).toBe('TRIODE');
    expect(state.id).toBeGreaterThan(0);
    expect(state.isChannelFormed).toBe(true);
  });

  it('should be in SATURATION when Vds >= Vgs - Vth', () => {
    // Vgs = 1.5V, Vth = 0.7V => Vov = 0.8V, Vds = 1.2V >= 0.8V
    const state = calculateMosfetState({ vgs: 1.5, vds: 1.2 });
    expect(state.region).toBe('SATURATION');
    expect(state.id).toBeCloseTo(0.5 * 2.0 * 0.8 * 0.8, 1);
    expect(state.drainChannelThickness).toBeLessThan(state.channelThickness);
  });
});

describe('NMOS Inverter & NOT Gate Logic', () => {
  it('should output HIGH (5V, logic 1) when input is LOW (0V)', () => {
    const state = calculateInverterState({ vin: 0.0 });
    expect(state.isTransistorOn).toBe(false);
    expect(state.vout).toBe(5.0);
    expect(state.outputLogic).toBe(1);
    expect(state.inputLogic).toBe(0);
  });

  it('should output LOW (~0.1V, logic 0) when input is HIGH (5V)', () => {
    const state = calculateInverterState({ vin: 5.0 });
    expect(state.isTransistorOn).toBe(true);
    expect(state.pullDownActive).toBe(true);
    expect(state.vout).toBeLessThan(1.0);
    expect(state.outputLogic).toBe(0);
    expect(state.inputLogic).toBe(1);
  });
});

describe("Ohm's Law Circuit Physics", () => {
  it('should have 0 current when switch is open', () => {
    const state = calculateCircuitState({ voltage: 12, resistance: 30, switchClosed: false });
    expect(state.currentA).toBe(0);
    expect(state.powerW).toBe(0);
    expect(state.bulbBrightness).toBe(0);
  });

  it('should calculate I = V / R when switch is closed', () => {
    const state = calculateCircuitState({ voltage: 12, resistance: 30, switchClosed: true });
    expect(state.currentA).toBeCloseTo(0.4, 3);
    expect(state.currentMa).toBeCloseTo(400, 1);
    expect(state.powerW).toBeCloseTo(4.8, 1);
    expect(state.bulbBrightness).toBeGreaterThan(0.5);
  });

  it('should increase current when resistance decreases', () => {
    const highR = calculateCircuitState({ voltage: 12, resistance: 60, switchClosed: true });
    const lowR = calculateCircuitState({ voltage: 12, resistance: 20, switchClosed: true });
    expect(lowR.currentA).toBeGreaterThan(highR.currentA);
    expect(lowR.bulbBrightness).toBeGreaterThan(highR.bulbBrightness);
  });
});

describe('Gear Mechanics Physics', () => {
  it('should rotate in opposite direction with external meshing', () => {
    const state = calculateGearState({ n1: 12, n2: 12, angle1: 90 });
    expect(state.directionReversed).toBe(true);
    expect(state.angle2).toBe(-90);
    expect(state.gearRatio).toBe(1.0);
  });

  it('should reduce speed to 1/2 when N2 = 24T and N1 = 12T', () => {
    const state = calculateGearState({ n1: 12, n2: 24, angle1: 360 });
    expect(state.gearRatio).toBe(2.0);
    expect(state.angle2).toBe(-180);
  });

  it('should amplify torque by 3x when N2 = 36T and N1 = 12T', () => {
    const state = calculateGearState({ n1: 12, n2: 36, angle1: 360, inputTorqueNm: 5.0 });
    expect(state.gearRatio).toBe(3.0);
    expect(state.outputTorqueNm).toBe(15.0);
    expect(state.isTargetTorqueReached).toBe(true);
  });
});
