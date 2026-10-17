import {
  bandMaterial,
  dopantModel,
  pnEquilibrium,
  depletion,
  diodeCurrent,
  gateContrast,
  type BandMaterial,
  type Dopant,
  type JunctionPhase,
  type BiasV,
  type DiodeBiasV,
  type GateComparison,
} from '../../a05/pn/pnModel';

/**
 * A02 Lesson 11 Semiconductor Band, Doping, PN Junction & Diode-to-MOS Action Adapter
 * Bridges interactive UI actions into physical semiconductor models and collects milestone observations.
 */
export function applyPnActionAdapter(
  stepId: string,
  currentParams: Record<string, any>,
  key: string,
  value: any
): Record<string, any> {
  const nextParams = { ...currentParams, [key]: value };
  const history: string[] = Array.isArray(currentParams.history) ? [...currentParams.history] : [];

  switch (stepId) {
    case 'step-pn-s1-band-gap': {
      const material = (key === 'material' ? String(value) : String(currentParams.material ?? 'silicon')) as BandMaterial;
      const light = key === 'light' ? Boolean(value) : Boolean(currentParams.light ?? false);
      const warm = key === 'warm' ? Boolean(value) : Boolean(currentParams.warm ?? false);

      const band = bandMaterial(material, light, warm);
      nextParams.material = material;
      nextParams.light = light;
      nextParams.warm = warm;
      nextParams.gapEV = band.gapEV;
      nextParams.excited = band.excited;

      if (material === 'metal' && !history.includes('metal')) history.push('metal');
      if (material === 'silicon' && !history.includes('silicon')) history.push('silicon');
      if (material === 'insulator' && !history.includes('insulator')) history.push('insulator');
      if (band.excited && !history.includes('excited')) history.push('excited');

      nextParams.history = history;
      return nextParams;
    }

    case 'step-pn-s2-doping': {
      const dopant = (key === 'dopant' ? String(value) : String(currentParams.dopant ?? 'intrinsic')) as Dopant;
      const dop = dopantModel(dopant);

      nextParams.dopant = dopant;
      nextParams.majority = dop.majority;
      nextParams.fixedIon = dop.fixedIon;

      if (dopant === 'intrinsic' && !history.includes('intrinsic')) history.push('intrinsic');
      if (dopant === 'donor' && !history.includes('donor')) history.push('donor');
      if (dopant === 'acceptor' && !history.includes('acceptor')) history.push('acceptor');

      nextParams.history = history;
      return nextParams;
    }

    case 'step-pn-s3-equilibrium': {
      const phase = (key === 'phase' ? String(value) : String(currentParams.phase ?? 'separate')) as JunctionPhase;
      const junction = pnEquilibrium(phase);

      nextParams.phase = phase;
      nextParams.electricField = junction.electricField;
      nextParams.diffusionToy = junction.diffusionToy;
      nextParams.driftToy = junction.driftToy;
      nextParams.netCurrentToy = junction.netCurrentToy;

      if (phase === 'separate' && !history.includes('separate')) history.push('separate');
      if (phase === 'diffusion' && !history.includes('diffusion')) history.push('diffusion');
      if (phase === 'equilibrium' && !history.includes('equilibrium')) history.push('equilibrium');

      nextParams.history = history;
      return nextParams;
    }

    case 'step-pn-s4-depletion-bias': {
      const bias = (key === 'bias' ? Number(value) : Number(currentParams.bias ?? 0)) as BiasV;
      const na = Number(currentParams.na) || 1e16;
      const nd = Number(currentParams.nd) || 1e16;

      const dep = depletion(bias, na, nd);
      nextParams.bias = bias;
      nextParams.na = na;
      nextParams.nd = nd;
      nextParams.widthMicrons = dep.widthMicrons;
      nextParams.builtInV = dep.builtInV;
      nextParams.pMicrons = dep.pMicrons;
      nextParams.nMicrons = dep.nMicrons;

      if (bias === -1 && !history.includes('reverse')) history.push('reverse');
      if (bias === 0 && !history.includes('zero')) history.push('zero');
      if (bias === 0.2 && !history.includes('forward')) history.push('forward');

      nextParams.history = history;
      return nextParams;
    }

    case 'step-pn-s5-diode-to-mos': {
      const diodeBias = (key === 'diodeBias' ? Number(value) : Number(currentParams.diodeBias ?? 0)) as DiodeBiasV;
      const gate = (key === 'gate' ? String(value) : String(currentParams.gate ?? 'pn')) as GateComparison;

      const diode = diodeCurrent(diodeBias);
      const mos = gateContrast(gate);

      nextParams.diodeBias = diodeBias;
      nextParams.gate = gate;
      nextParams.currentNanoA = diode.currentNanoA;
      nextParams.hasInsulator = mos.hasInsulator;

      const biasStr = String(diodeBias);
      if (!history.includes(biasStr)) history.push(biasStr);
      if (gate === 'mos' && !history.includes('mos')) history.push('mos');
      if (gate === 'pn' && !history.includes('pn')) history.push('pn');

      nextParams.history = history;
      return nextParams;
    }

    default:
      return nextParams;
  }
}
