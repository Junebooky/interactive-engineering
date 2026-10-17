import {
  computeFeeding,
  memoryPlacementMatches,
  theoreticalBandwidth,
  packaging,
  signalLevels,
  assessGpu,
  type ComputeRate,
  type FeedRate,
  type Family,
  type Placement,
  type PinRate,
  type Signal,
  type Topology,
} from '../../a05/gpu/gpuModel';

export function applyGpuActionAdapter(
  stepId: string,
  currentParams: Record<string, unknown>,
  key: string,
  value: unknown,
): Record<string, unknown> {
  const nextParams = { ...currentParams, [key]: value };
  const history: string[] = Array.isArray(currentParams.history)
    ? [...currentParams.history]
    : [];

  const addTag = (tag: string) => {
    if (!history.includes(tag)) {
      history.push(tag);
    }
  };

  if (stepId.includes('feed') || stepId.includes('s01')) {
    const compute = (Number(nextParams.compute) || 16) as ComputeRate;
    const feed = (Number(nextParams.feed) || 8) as FeedRate;

    if (compute === 16 && feed === 8) {
      addTag('core16feed8');
    }
    if (compute === 32 && feed === 8) {
      addTag('core32feed8');
    }
    if (feed === 32) {
      addTag('feed32');
    }

    const feeding = computeFeeding(compute, feed);
    nextParams.throughput = feeding.throughput;
    nextParams.toySeconds = feeding.toySeconds;
    nextParams.bottleneck = feeding.bottleneck;

    const answer = typeof nextParams.answer === 'string' ? nextParams.answer : null;
    const assess = assessGpu('compute-feeding', history, answer);
    nextParams.passed = assess.passed;
  } else if (stepId.includes('famil') || stepId.includes('s02')) {
    const family = (nextParams.family ?? 'DDR/RDIMM') as Family;
    const site = (nextParams.site ?? 'cpu-dimm') as Placement;

    const matched = memoryPlacementMatches(family, site);
    nextParams.placementMatches = matched;

    if (matched) {
      addTag(site);
    } else {
      addTag(`mismatch-${family}-${site}`);
    }

    const answer = typeof nextParams.answer === 'string' ? nextParams.answer : null;
    const assess = assessGpu('memory-family-roles', history, answer);
    nextParams.passed = assess.passed;
  } else if (stepId.includes('width') || stepId.includes('rate') || stepId.includes('s03')) {
    const pinRate = (Number(nextParams.pinRate) || 24) as PinRate;
    const signal = (nextParams.signal ?? 'NRZ') as Signal;

    if (pinRate === 24) {
      addTag('rate24');
    }
    if (pinRate === 32) {
      addTag('rate32');
    }
    if (signal === 'PAM3') {
      addTag('pam3');
    }

    const bw = theoreticalBandwidth(128, pinRate);
    nextParams.maxGBps = bw.maxGBps;
    nextParams.levels = signalLevels(signal);

    const answer = typeof nextParams.answer === 'string' ? nextParams.answer : null;
    const assess = assessGpu('gddr-width-rate', history, answer);
    nextParams.passed = assess.passed;
  } else if (stepId.includes('hbm') || stepId.includes('tradeoff') || stepId.includes('s04')) {
    const topology = (nextParams.topology ?? 'gddr-board') as Topology;
    const showConstraints = Boolean(nextParams.showConstraints);

    if (topology === 'gddr-board') {
      addTag('gddr');
    }
    if (topology === 'hbm-stack') {
      addTag('hbm');
    }
    if (showConstraints) {
      addTag('constraints');
    }

    const pack = packaging(topology);
    nextParams.packagingTradeoff = pack.tradeoff;

    const answer = typeof nextParams.answer === 'string' ? nextParams.answer : null;
    const assess = assessGpu('hbm-tradeoffs', history, answer);
    nextParams.passed = assess.passed;
  }

  nextParams.history = history;
  return nextParams;
}
