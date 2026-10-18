/**
 * A03 V3 Smart Scene Fit & Camera Framing Specification
 * Binding Contract: A03-V3-scene-camera-scale-contract.md (P0 Issue #80)
 *
 * Provides typed, stable world bounds and subject geometry for every published
 * 2.5D interactive and concept scene, ensuring consistent visual prominence
 * (70-85% fitting axis fill) and predictable user-zoom behavior.
 */

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type FramingPolicy = 'fit-subject' | 'fit-diagram' | 'comparison-fixed';

export interface SceneFraming {
  sceneId: string;
  familyId: string;
  stableBounds: BoundingBox;
  subjectBounds: BoundingBox;
  essentialLabelBounds?: BoundingBox;
  focalOffset?: { x: number; y: number };
  policy: FramingPolicy;
  defaultViewBox: string;
}

/**
 * Authoritative framing definitions for all scene families.
 * Sourced directly from A05 SVG geometry and A03 design contract.
 */
export const SCENE_FRAMING_REGISTRY: Record<string, SceneFraming> = {
  // 1. MOSFET Family (Lesson 01 & general semiconductor)
  'mosfet-field': {
    sceneId: 'mosfet-field',
    familyId: 'mosfet',
    stableBounds: { x: 65, y: 52, width: 500, height: 298 },
    subjectBounds: { x: 89, y: 70, width: 455, height: 250 },
    essentialLabelBounds: { x: 65, y: 52, width: 500, height: 298 },
    policy: 'fit-subject',
    defaultViewBox: '65 52 500 298',
  },
  'mosfet-current': {
    sceneId: 'mosfet-current',
    familyId: 'mosfet',
    stableBounds: { x: 65, y: 52, width: 500, height: 298 },
    subjectBounds: { x: 89, y: 70, width: 455, height: 250 },
    essentialLabelBounds: { x: 65, y: 52, width: 500, height: 298 },
    policy: 'fit-subject',
    defaultViewBox: '65 52 500 298',
  },
  'nmos-resistor-inverter': {
    sceneId: 'nmos-resistor-inverter',
    familyId: 'mosfet',
    stableBounds: { x: 65, y: 52, width: 500, height: 298 },
    subjectBounds: { x: 89, y: 70, width: 455, height: 250 },
    policy: 'fit-subject',
    defaultViewBox: '65 52 500 298',
  },
  'cmos-not-gate': {
    sceneId: 'cmos-not-gate',
    familyId: 'mosfet',
    stableBounds: { x: 65, y: 52, width: 500, height: 298 },
    subjectBounds: { x: 89, y: 70, width: 455, height: 250 },
    policy: 'fit-subject',
    defaultViewBox: '65 52 500 298',
  },
  'mosfet-intro': {
    sceneId: 'mosfet-intro',
    familyId: 'mosfet',
    stableBounds: { x: 65, y: 52, width: 500, height: 298 },
    subjectBounds: { x: 89, y: 70, width: 455, height: 250 },
    policy: 'fit-subject',
    defaultViewBox: '65 52 500 298',
  },

  // 2. Electricity & RC Family (Lesson 12 & Circuits)
  'elec-charge-current': {
    sceneId: 'elec-charge-current',
    familyId: 'electricity',
    stableBounds: { x: 30, y: 20, width: 720, height: 380 },
    subjectBounds: { x: 50, y: 30, width: 680, height: 350 },
    essentialLabelBounds: { x: 30, y: 20, width: 720, height: 380 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 780 420',
  },
  'elec-resistor-kcl': {
    sceneId: 'elec-resistor-kcl',
    familyId: 'electricity',
    stableBounds: { x: 30, y: 20, width: 720, height: 380 },
    subjectBounds: { x: 50, y: 30, width: 680, height: 350 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 780 420',
  },
  'elec-rc-delay': {
    sceneId: 'elec-rc-delay',
    familyId: 'electricity',
    stableBounds: { x: 30, y: 20, width: 720, height: 380 },
    subjectBounds: { x: 50, y: 30, width: 680, height: 350 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 780 420',
  },
  'elec-power-energy': {
    sceneId: 'elec-power-energy',
    familyId: 'electricity',
    stableBounds: { x: 30, y: 20, width: 720, height: 380 },
    subjectBounds: { x: 50, y: 30, width: 680, height: 350 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 780 420',
  },
  'circuit-intro': {
    sceneId: 'circuit-intro',
    familyId: 'electricity',
    stableBounds: { x: 30, y: 20, width: 720, height: 380 },
    subjectBounds: { x: 50, y: 30, width: 680, height: 350 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 780 420',
  },
  'ohmsLaw': {
    sceneId: 'ohmsLaw',
    familyId: 'electricity',
    stableBounds: { x: 30, y: 20, width: 720, height: 380 },
    subjectBounds: { x: 50, y: 30, width: 680, height: 350 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 780 420',
  },

  // 3. MOS Capacitor Family (Lesson 14)
  'mos14-oxide-field': {
    sceneId: 'mos14-oxide-field',
    familyId: 'mos14',
    stableBounds: { x: 30, y: 25, width: 590, height: 355 },
    subjectBounds: { x: 50, y: 35, width: 550, height: 330 },
    essentialLabelBounds: { x: 30, y: 25, width: 590, height: 355 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 405',
  },
  'mos14-accumulation-inversion': {
    sceneId: 'mos14-accumulation-inversion',
    familyId: 'mos14',
    stableBounds: { x: 30, y: 25, width: 590, height: 355 },
    subjectBounds: { x: 50, y: 35, width: 550, height: 330 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 405',
  },
  'mos14-capacitance-cv': {
    sceneId: 'mos14-capacitance-cv',
    familyId: 'mos14',
    stableBounds: { x: 30, y: 25, width: 590, height: 355 },
    subjectBounds: { x: 50, y: 35, width: 550, height: 330 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 405',
  },
  'mos14-cap-to-nmosfet': {
    sceneId: 'mos14-cap-to-nmosfet',
    familyId: 'mos14',
    stableBounds: { x: 30, y: 25, width: 590, height: 355 },
    subjectBounds: { x: 50, y: 35, width: 550, height: 330 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 405',
  },
  'mos-cap-intro': {
    sceneId: 'mos-cap-intro',
    familyId: 'mos14',
    stableBounds: { x: 30, y: 25, width: 590, height: 355 },
    subjectBounds: { x: 50, y: 35, width: 550, height: 330 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 405',
  },

  // 4. DRAM Family (Lesson 02)
  'dram-write': {
    sceneId: 'dram-write',
    familyId: 'dram',
    stableBounds: { x: 35, y: 25, width: 580, height: 360 },
    subjectBounds: { x: 50, y: 35, width: 550, height: 335 },
    essentialLabelBounds: { x: 35, y: 25, width: 580, height: 360 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 410',
  },
  'dram-sense-restore': {
    sceneId: 'dram-sense-restore',
    familyId: 'dram',
    stableBounds: { x: 35, y: 25, width: 580, height: 360 },
    subjectBounds: { x: 50, y: 35, width: 550, height: 335 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 410',
  },
  'dram-leak-refresh': {
    sceneId: 'dram-leak-refresh',
    familyId: 'dram',
    stableBounds: { x: 35, y: 25, width: 580, height: 360 },
    subjectBounds: { x: 50, y: 35, width: 550, height: 335 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 410',
  },
  'dram-row-bank': {
    sceneId: 'dram-row-bank',
    familyId: 'dram',
    stableBounds: { x: 35, y: 25, width: 580, height: 360 },
    subjectBounds: { x: 50, y: 35, width: 550, height: 335 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 410',
  },
  'dram-intro': {
    sceneId: 'dram-intro',
    familyId: 'dram',
    stableBounds: { x: 35, y: 25, width: 580, height: 360 },
    subjectBounds: { x: 50, y: 35, width: 550, height: 335 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 410',
  },

  // 5. SRAM Family (Lesson 03)
  'sram-cross-coupled-inverters': {
    sceneId: 'sram-cross-coupled-inverters',
    familyId: 'sram',
    stableBounds: { x: 30, y: 20, width: 590, height: 380 },
    subjectBounds: { x: 45, y: 30, width: 560, height: 350 },
    essentialLabelBounds: { x: 30, y: 20, width: 590, height: 380 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 420',
  },
  'sram-6t-access': {
    sceneId: 'sram-6t-access',
    familyId: 'sram',
    stableBounds: { x: 30, y: 20, width: 590, height: 380 },
    subjectBounds: { x: 45, y: 30, width: 560, height: 350 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 420',
  },
  'cpu-cache-vs-dram': {
    sceneId: 'cpu-cache-vs-dram',
    familyId: 'sram',
    stableBounds: { x: 30, y: 20, width: 590, height: 380 },
    subjectBounds: { x: 45, y: 30, width: 560, height: 350 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 420',
  },
  'cpu-to-gpu-data-locality': {
    sceneId: 'cpu-to-gpu-data-locality',
    familyId: 'sram',
    stableBounds: { x: 30, y: 20, width: 590, height: 380 },
    subjectBounds: { x: 45, y: 30, width: 560, height: 350 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 420',
  },
  'sram-intro': {
    sceneId: 'sram-intro',
    familyId: 'sram',
    stableBounds: { x: 30, y: 20, width: 590, height: 380 },
    subjectBounds: { x: 45, y: 30, width: 560, height: 350 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 420',
  },

  // 6. PN Junction Family (Lesson 11)
  'pn-band-gap': {
    sceneId: 'pn-band-gap',
    familyId: 'pn',
    stableBounds: { x: 30, y: 20, width: 590, height: 375 },
    subjectBounds: { x: 45, y: 30, width: 560, height: 350 },
    essentialLabelBounds: { x: 30, y: 20, width: 590, height: 375 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 415',
  },
  'pn-doping-carrier': {
    sceneId: 'pn-doping-carrier',
    familyId: 'pn',
    stableBounds: { x: 30, y: 20, width: 590, height: 375 },
    subjectBounds: { x: 45, y: 30, width: 560, height: 350 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 415',
  },
  'pn-equilibrium-barrier': {
    sceneId: 'pn-equilibrium-barrier',
    familyId: 'pn',
    stableBounds: { x: 30, y: 20, width: 590, height: 375 },
    subjectBounds: { x: 45, y: 30, width: 560, height: 350 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 415',
  },
  'pn-forward-current': {
    sceneId: 'pn-forward-current',
    familyId: 'pn',
    stableBounds: { x: 30, y: 20, width: 590, height: 375 },
    subjectBounds: { x: 45, y: 30, width: 560, height: 350 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 415',
  },
  'pn-reverse-breakdown': {
    sceneId: 'pn-reverse-breakdown',
    familyId: 'pn',
    stableBounds: { x: 30, y: 20, width: 590, height: 375 },
    subjectBounds: { x: 45, y: 30, width: 560, height: 350 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 415',
  },
  'pn-diode-rectifier': {
    sceneId: 'pn-diode-rectifier',
    familyId: 'pn',
    stableBounds: { x: 30, y: 20, width: 590, height: 375 },
    subjectBounds: { x: 45, y: 30, width: 560, height: 350 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 415',
  },
  'pn-intro': {
    sceneId: 'pn-intro',
    familyId: 'pn',
    stableBounds: { x: 30, y: 20, width: 590, height: 375 },
    subjectBounds: { x: 45, y: 30, width: 560, height: 350 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 415',
  },

  // 7. 3D NAND & eSSD Family (Lesson 04)
  'nand-threshold': {
    sceneId: 'nand-threshold',
    familyId: 'nand',
    stableBounds: { x: 30, y: 20, width: 620, height: 360 },
    subjectBounds: { x: 45, y: 30, width: 590, height: 335 },
    essentialLabelBounds: { x: 30, y: 20, width: 620, height: 360 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 680 400',
  },
  'nand-page-block': {
    sceneId: 'nand-page-block',
    familyId: 'nand',
    stableBounds: { x: 30, y: 20, width: 620, height: 360 },
    subjectBounds: { x: 45, y: 30, width: 590, height: 335 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 680 400',
  },
  'ssd-ftl-reliability': {
    sceneId: 'ssd-ftl-reliability',
    familyId: 'nand',
    stableBounds: { x: 30, y: 20, width: 620, height: 360 },
    subjectBounds: { x: 45, y: 30, width: 590, height: 335 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 680 400',
  },
  'nvme-transfer': {
    sceneId: 'nvme-transfer',
    familyId: 'nand',
    stableBounds: { x: 30, y: 20, width: 620, height: 360 },
    subjectBounds: { x: 45, y: 30, width: 590, height: 335 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 680 400',
  },
  'ai-datacenter-pipeline': {
    sceneId: 'ai-datacenter-pipeline',
    familyId: 'nand',
    stableBounds: { x: 30, y: 20, width: 620, height: 360 },
    subjectBounds: { x: 45, y: 30, width: 590, height: 335 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 680 400',
  },
  'nand-intro': {
    sceneId: 'nand-intro',
    familyId: 'nand',
    stableBounds: { x: 30, y: 20, width: 620, height: 360 },
    subjectBounds: { x: 45, y: 30, width: 590, height: 335 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 680 400',
  },

  // 8. GPU Family (Lesson 05)
  'gpu-compute-feeding': {
    sceneId: 'gpu-compute-feeding',
    familyId: 'gpu',
    stableBounds: { x: 30, y: 20, width: 590, height: 365 },
    subjectBounds: { x: 45, y: 30, width: 560, height: 340 },
    essentialLabelBounds: { x: 30, y: 20, width: 590, height: 365 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 405',
  },
  'gpu-memory-family-roles': {
    sceneId: 'gpu-memory-family-roles',
    familyId: 'gpu',
    stableBounds: { x: 30, y: 20, width: 590, height: 365 },
    subjectBounds: { x: 45, y: 30, width: 560, height: 340 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 405',
  },
  'gpu-gddr-width-rate': {
    sceneId: 'gpu-gddr-width-rate',
    familyId: 'gpu',
    stableBounds: { x: 30, y: 20, width: 590, height: 365 },
    subjectBounds: { x: 45, y: 30, width: 560, height: 340 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 405',
  },
  'gpu-hbm-tradeoffs': {
    sceneId: 'gpu-hbm-tradeoffs',
    familyId: 'gpu',
    stableBounds: { x: 30, y: 20, width: 590, height: 365 },
    subjectBounds: { x: 45, y: 30, width: 560, height: 340 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 405',
  },
  'gpu-intro': {
    sceneId: 'gpu-intro',
    familyId: 'gpu',
    stableBounds: { x: 30, y: 20, width: 590, height: 365 },
    subjectBounds: { x: 45, y: 30, width: 560, height: 340 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 650 405',
  },

  // 9. Gears & Mechanics Family
  'gear-ratio': {
    sceneId: 'gear-ratio',
    familyId: 'gears',
    stableBounds: { x: 30, y: 20, width: 540, height: 280 },
    subjectBounds: { x: 45, y: 25, width: 510, height: 265 },
    essentialLabelBounds: { x: 30, y: 20, width: 540, height: 280 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 600 320',
  },
  'gears-intro': {
    sceneId: 'gears-intro',
    familyId: 'gears',
    stableBounds: { x: 30, y: 20, width: 540, height: 280 },
    subjectBounds: { x: 45, y: 25, width: 510, height: 265 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 600 320',
  },
};

/**
 * Returns typed scene framing metadata for a given scene or visual ID.
 * Falls back to canonical concept framing if an unregistered concept is loaded.
 */
export function getSceneFraming(sceneId: string): SceneFraming {
  const direct = SCENE_FRAMING_REGISTRY[sceneId];
  if (direct) return direct;

  // Prefix matching for family resolution
  if (sceneId.startsWith('mosfet-') || sceneId.startsWith('nmos-') || sceneId.startsWith('cmos-')) {
    return { ...SCENE_FRAMING_REGISTRY['mosfet-field'], sceneId };
  }
  if (sceneId.startsWith('elec-') || sceneId.startsWith('circuit-')) {
    return { ...SCENE_FRAMING_REGISTRY['elec-charge-current'], sceneId };
  }
  if (sceneId.startsWith('dram-')) {
    return { ...SCENE_FRAMING_REGISTRY['dram-write'], sceneId };
  }
  if (sceneId.startsWith('sram-') || sceneId.startsWith('cpu-')) {
    return { ...SCENE_FRAMING_REGISTRY['sram-cross-coupled-inverters'], sceneId };
  }
  if (sceneId.startsWith('mos14-') || sceneId.startsWith('mos-cap-')) {
    return { ...SCENE_FRAMING_REGISTRY['mos14-oxide-field'], sceneId };
  }
  if (sceneId.startsWith('pn-')) {
    return { ...SCENE_FRAMING_REGISTRY['pn-band-gap'], sceneId };
  }
  if (sceneId.startsWith('nand-') || sceneId.startsWith('ssd-') || sceneId.startsWith('nvme-') || sceneId.startsWith('ai-datacenter-')) {
    return { ...SCENE_FRAMING_REGISTRY['nand-threshold'], sceneId };
  }
  if (sceneId.startsWith('gpu-')) {
    return { ...SCENE_FRAMING_REGISTRY['gpu-compute-feeding'], sceneId };
  }
  if (sceneId.startsWith('gear-')) {
    return { ...SCENE_FRAMING_REGISTRY['gear-ratio'], sceneId };
  }

  // Canonical baseline framing for general 2.5D diagrams
  return {
    sceneId,
    familyId: 'generic',
    stableBounds: { x: 30, y: 20, width: 640, height: 360 },
    subjectBounds: { x: 50, y: 30, width: 600, height: 320 },
    policy: 'fit-subject',
    defaultViewBox: '0 0 680 400',
  };
}

/**
 * Calculates subject auto-fit scale based on measured safe content stage.
 * Preserves 8-12% breathing room and targets 70-85% fitting-axis fill.
 */
export function computeAutoFitScale(
  stageWidth: number,
  stageHeight: number,
  framing: SceneFraming,
  paddingPercent = 0.08
): {
  fitScale: number;
  dominantFillRatio: number;
  fillRatioW: number;
  fillRatioH: number;
} {
  // Guard against unmeasured or zero stages
  const safeW = Math.max(stageWidth * (1 - 2 * paddingPercent), 60);
  const safeH = Math.max(stageHeight * (1 - 2 * paddingPercent), 60);

  const scaleX = safeW / framing.stableBounds.width;
  const scaleY = safeH / framing.stableBounds.height;
  const fitScale = Math.min(scaleX, scaleY);

  const renderedSubjectW = framing.subjectBounds.width * fitScale;
  const renderedSubjectH = framing.subjectBounds.height * fitScale;

  const fillRatioW = stageWidth > 0 ? renderedSubjectW / stageWidth : 0;
  const fillRatioH = stageHeight > 0 ? renderedSubjectH / stageHeight : 0;
  const dominantFillRatio = Math.max(fillRatioW, fillRatioH);

  return {
    fitScale,
    dominantFillRatio,
    fillRatioW,
    fillRatioH,
  };
}
