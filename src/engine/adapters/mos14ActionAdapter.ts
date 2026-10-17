import {
  mos14OxidePhysics,
  mos14Surface,
  mos14Current,
  mos14OxideCurrent,
  mos14Cv,
  type Mos14Bias,
  type Mos14Oxide,
  type Mos14Phase,
  type Mos14Device,
  type Mos14Vds,
  type Mos14State,
} from '../../a05/mos14/mos14Model';

/**
 * A02 Lesson 14 MOS Capacitor & Surface Inversion Action Adapter
 * Connects learner actions with physical electrostatics, oxide capacitance, and inversion derivations.
 */
export function applyMos14ActionAdapter(
  stepId: string,
  currentParams: Record<string, any>,
  key: string,
  value: any
): Record<string, any> {
  const nextParams = { ...currentParams, [key]: value };
  const history: string[] = Array.isArray(currentParams.history) ? [...currentParams.history] : [];

  switch (stepId) {
    case 'step-mos14-s1-oxide-field': {
      const gateV = (key === 'gateV' ? Number(value) : Number(currentParams.gateV ?? 0.3)) as Mos14Bias;
      const phase = (key === 'phase' ? String(value) : String(currentParams.phase ?? 'steady')) as Mos14Phase;

      const ig = mos14OxideCurrent(phase);
      nextParams.gateV = gateV;
      nextParams.phase = phase;
      nextParams.oxideSteadyDcA = ig.oxideSteadyDcA;
      nextParams.externalChargeTransientPossible = ig.externalChargeTransientPossible;

      if (gateV < 0 && !history.includes('negative')) history.push('negative');
      if (gateV > 0 && !history.includes('positive')) history.push('positive');
      if (phase === 'switching' && !history.includes('switching')) history.push('switching');
      if (phase === 'steady' && !history.includes('steady')) history.push('steady');

      nextParams.history = history;
      return nextParams;
    }

    case 'step-mos14-s2-accumulation-inversion': {
      const gateV = (key === 'gateV' ? Number(value) : Number(currentParams.gateV ?? 0)) as Mos14Bias;
      const oxideNm = 5 as Mos14Oxide;

      const surface = mos14Surface(gateV, oxideNm);
      const physics = mos14OxidePhysics(oxideNm);

      nextParams.gateV = gateV;
      nextParams.oxideNm = oxideNm;
      nextParams.surface = surface;
      nextParams.vtV = physics.vtV;
      nextParams.vfbV = physics.vfbV;

      if (gateV === -0.5 && !history.includes('accumulation')) history.push('accumulation');
      if (gateV === 0 && !history.includes('flatband')) history.push('flatband');
      if (gateV === 0.3 && !history.includes('depletion')) history.push('depletion');
      if (gateV === 1.1 && !history.includes('inversion')) history.push('inversion');

      nextParams.history = history;
      return nextParams;
    }

    case 'step-mos14-s3-capacitance-cv': {
      const oxideNm = (key === 'oxideNm' ? Number(value) : Number(currentParams.oxideNm ?? 5)) as Mos14Oxide;
      const showCv = key === 'showCv' ? Boolean(value) : Boolean(currentParams.showCv ?? false);

      const physics = mos14OxidePhysics(oxideNm);
      const cv = mos14Cv(oxideNm, showCv);

      nextParams.oxideNm = oxideNm;
      nextParams.showCv = showCv;
      nextParams.coxMicroFPerCm2 = cv.coxMicroFPerCm2;
      nextParams.depletionSeriesToyMicroFPerCm2 = cv.depletionSeriesToyMicroFPerCm2;
      nextParams.vtV = physics.vtV;

      if (oxideNm === 5 && !history.includes('tox5')) history.push('tox5');
      if (oxideNm === 10 && !history.includes('tox10')) history.push('tox10');
      if (showCv && !history.includes('cv')) history.push('cv');

      nextParams.history = history;
      return nextParams;
    }

    case 'step-mos14-s4-cap-to-nmosfet': {
      const device = (key === 'device' ? String(value) : String(currentParams.device ?? 'capacitor')) as Mos14Device;
      const vds = (key === 'vds' ? Number(value) : Number(currentParams.vds ?? 0)) as Mos14Vds;
      const gateV = 1.1 as Mos14Bias;
      const oxideNm = 5 as Mos14Oxide;

      const state: Mos14State = {
        gateV,
        oxideNm,
        phase: 'steady',
        device,
        vds,
        showCv: false,
      };
      const curr = mos14Current(state);

      nextParams.device = device;
      nextParams.vds = vds;
      nextParams.gateV = gateV;
      nextParams.oxideNm = oxideNm;
      nextParams.drainCurrent = curr.drainCurrent;
      nextParams.hasDrainTerminal = curr.hasDrainTerminal;

      if (device === 'capacitor' && !history.includes('cap')) history.push('cap');
      if (device === 'nmos' && vds === 0 && !history.includes('nmos-zero')) history.push('nmos-zero');
      if (device === 'nmos' && vds === 0.5 && !history.includes('nmos-positive')) history.push('nmos-positive');

      nextParams.history = history;
      return nextParams;
    }

    default:
      return nextParams;
  }
}
