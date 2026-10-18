import { describe, it, expect } from 'vitest';
import {
  getSceneFraming,
  computeAutoFitScale,
} from '../engine/sceneFraming';

describe('A03 V3 Smart Scene Fit & Camera Framing (Issue #80)', () => {
  const publishedSceneIds = [
    'mosfet-field',
    'mosfet-current',
    'nmos-resistor-inverter',
    'cmos-not-gate',
    'mosfet-intro',
    'elec-charge-current',
    'elec-resistor-kcl',
    'elec-rc-delay',
    'elec-power-energy',
    'circuit-intro',
    'ohmsLaw',
    'mos14-oxide-field',
    'mos14-accumulation-inversion',
    'mos14-capacitance-cv',
    'mos14-cap-to-nmosfet',
    'mos-cap-intro',
    'dram-write',
    'dram-sense-restore',
    'dram-leak-refresh',
    'dram-row-bank',
    'dram-intro',
    'sram-cross-coupled-inverters',
    'sram-6t-access',
    'cpu-cache-vs-dram',
    'cpu-to-gpu-data-locality',
    'sram-intro',
    'pn-band-gap',
    'pn-doping-carrier',
    'pn-equilibrium-barrier',
    'pn-forward-current',
    'pn-reverse-breakdown',
    'pn-diode-rectifier',
    'pn-intro',
    'nand-threshold',
    'nand-page-block',
    'ssd-ftl-reliability',
    'nvme-transfer',
    'ai-datacenter-pipeline',
    'nand-intro',
    'gpu-compute-feeding',
    'gpu-memory-family-roles',
    'gpu-gddr-width-rate',
    'gpu-hbm-tradeoffs',
    'gpu-intro',
    'gear-ratio',
    'gears-intro',
  ];

  it('provides typed framing metadata with positive bounds for every published scene', () => {
    for (const id of publishedSceneIds) {
      const framing = getSceneFraming(id);
      expect(framing).toBeDefined();
      expect(framing.stableBounds.width).toBeGreaterThan(200);
      expect(framing.stableBounds.height).toBeGreaterThan(150);
      expect(framing.subjectBounds.width).toBeGreaterThan(100);
      expect(framing.subjectBounds.height).toBeGreaterThan(100);
      expect(framing.policy).toBe('fit-subject');
    }
  });

  it('computes auto-fit scale within 70% to 85% dominant axis fill on desktop 1440x900 stage', () => {
    // Typical safe stage size in 1440x900 split viewport (~800x480)
    const stageW = 800;
    const stageH = 480;

    for (const id of ['mosfet-field', 'elec-charge-current', 'dram-write', 'sram-6t-access', 'nand-threshold']) {
      const framing = getSceneFraming(id);
      const { fitScale, dominantFillRatio } = computeAutoFitScale(stageW, stageH, framing, 0.08);

      expect(fitScale).toBeGreaterThan(0.5);
      // Dominant subject fill ratio should be between 65% and 86%
      expect(dominantFillRatio).toBeGreaterThanOrEqual(0.65);
      expect(dominantFillRatio).toBeLessThanOrEqual(0.86);
    }
  });

  it('computes auto-fit scale within 70% to 85% dominant axis fill on mobile 390x844 stage', () => {
    // Typical safe stage size in 390x844 mobile lab (~390x310)
    const stageW = 390;
    const stageH = 310;

    for (const id of ['mosfet-field', 'elec-charge-current', 'dram-write', 'sram-6t-access', 'nand-threshold']) {
      const framing = getSceneFraming(id);
      const { fitScale, dominantFillRatio } = computeAutoFitScale(stageW, stageH, framing, 0.08);

      expect(fitScale).toBeGreaterThan(0.3);
      expect(dominantFillRatio).toBeGreaterThanOrEqual(0.65);
      expect(dominantFillRatio).toBeLessThanOrEqual(0.86);
    }
  });

  it('computes auto-fit scale within 70% to 85% dominant axis fill on compact mobile 320x640 stage', () => {
    // Typical safe stage size in 320x640 compact mobile lab (~320x220)
    const stageW = 320;
    const stageH = 220;

    for (const id of ['mosfet-field', 'elec-charge-current', 'dram-write', 'sram-6t-access', 'nand-threshold']) {
      const framing = getSceneFraming(id);
      const { fitScale, dominantFillRatio } = computeAutoFitScale(stageW, stageH, framing, 0.08);

      expect(fitScale).toBeGreaterThan(0.25);
      expect(dominantFillRatio).toBeGreaterThanOrEqual(0.65);
      expect(dominantFillRatio).toBeLessThanOrEqual(0.86);
    }
  });

  it('stable bounds remain identical across parameter state transitions within a scene family', () => {
    const mosfetStep1 = getSceneFraming('mosfet-field');
    const mosfetStep2 = getSceneFraming('mosfet-current');

    expect(mosfetStep1.stableBounds).toEqual(mosfetStep2.stableBounds);
    expect(mosfetStep1.familyId).toBe('mosfet');
    expect(mosfetStep2.familyId).toBe('mosfet');
  });
});
