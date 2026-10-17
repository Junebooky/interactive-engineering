import {
  nand04Threshold,
  nand04Pages,
  nand04Ssd,
  nand04Transport,
  nand04Ai,
  type Nand04State,
  type NandCellState,
  type NandPower,
  type NandPageStage,
  type NandTransportStage,
  type NandAiStage,
} from '../../a05/nand04/nand04Model';

/**
 * A02 Lesson 04 NAND, eSSD, NVMe & AI Data Center Action Adapter.
 * Bridges user interactions with pure educational models, tracks evidence history tags,
 * and maintains reactive simulation states.
 */
export function applyNand04ActionAdapter(
  stepId: string,
  currentParams: Record<string, any>,
  key: string,
  value: any
): Record<string, any> {
  const nextParams = { ...currentParams, [key]: value };
  const history: string[] = Array.isArray(currentParams.history) ? [...currentParams.history] : [];

  switch (stepId) {
    case 'step-nand04-s1-threshold': {
      const cell = (key === 'cell' ? value : (currentParams.cell ?? 'low')) as NandCellState;
      const readV = Number(key === 'readV' ? value : (currentParams.readV ?? 1)) as 0.3 | 1 | 2;
      const power = (key === 'power' ? value : (currentParams.power ?? 'on')) as NandPower;

      const threshold = nand04Threshold(cell, readV, power);
      nextParams.cell = cell;
      nextParams.readV = readV;
      nextParams.power = power;
      nextParams.threshold = threshold;

      if (cell === 'low' && !history.includes('low')) history.push('low');
      if (cell === 'high' && !history.includes('high')) history.push('high');
      if ((power === 'off' || key === 'power') && !history.includes('power-cycle')) {
        history.push('power-cycle');
      }

      nextParams.history = history;
      return nextParams;
    }

    case 'step-nand04-s2-page-block': {
      const pageStage = (key === 'pageStage' ? value : (currentParams.pageStage ?? 'initial')) as NandPageStage;
      const pageInfo = nand04Pages(pageStage);

      nextParams.pageStage = pageStage;
      nextParams.pageInfo = pageInfo;

      if (pageStage === 'initial' && !history.includes('initial')) history.push('initial');
      if (pageStage === 'updated' && !history.includes('updated')) history.push('updated');
      if (pageStage === 'collected' && !history.includes('collected')) history.push('collected');

      nextParams.history = history;
      return nextParams;
    }

    case 'step-nand04-s3-ftl-reliability': {
      const writePattern = (key === 'writePattern' ? value : (currentParams.writePattern ?? 'cold')) as 'hot' | 'cold';
      const ecc = Boolean(key === 'ecc' ? value : (currentParams.ecc ?? false));
      const plp = Boolean(key === 'plp' ? value : (currentParams.plp ?? false));
      const dramCache = Boolean(key === 'dramCache' ? value : (currentParams.dramCache ?? false));

      const ssdInfo = nand04Ssd(writePattern, ecc, plp, dramCache);
      nextParams.writePattern = writePattern;
      nextParams.ecc = ecc;
      nextParams.plp = plp;
      nextParams.dramCache = dramCache;
      nextParams.ssdInfo = ssdInfo;

      if (writePattern === 'hot' && !history.includes('hot')) history.push('hot');
      if (writePattern === 'cold' && !history.includes('cold')) history.push('cold');
      if ((ecc || key === 'ecc') && !history.includes('ecc-option')) history.push('ecc-option');
      if ((plp || key === 'plp') && !history.includes('plp-option')) history.push('plp-option');

      nextParams.history = history;
      return nextParams;
    }

    case 'step-nand04-s4-nvme-transfer': {
      const transport = (key === 'transport' ? value : (currentParams.transport ?? 'command')) as NandTransportStage;
      const transportInfo = nand04Transport(transport);

      nextParams.transport = transport;
      nextParams.transportInfo = transportInfo;

      if (transport === 'command' && !history.includes('command')) history.push('command');
      if (transport === 'read-data' && !history.includes('read-data')) history.push('read-data');
      if (transport === 'to-gpu' && !history.includes('to-gpu')) history.push('to-gpu');

      nextParams.history = history;
      return nextParams;
    }

    case 'step-nand04-s5-ai-datacenter': {
      const ai = (key === 'ai' ? value : (currentParams.ai ?? 'cold-load')) as NandAiStage;
      const servers = Number(key === 'servers' ? value : (currentParams.servers ?? 1)) as 1 | 2;

      const aiInfo = nand04Ai(ai, servers);
      nextParams.ai = ai;
      nextParams.servers = servers;
      nextParams.aiInfo = aiInfo;

      if (ai === 'cold-load' && !history.includes('cold-load')) history.push('cold-load');
      if (ai === 'resident-infer' && !history.includes('resident-infer')) history.push('resident-infer');
      if (ai === 'checkpoint' && !history.includes('checkpoint')) history.push('checkpoint');
      if ((servers === 2 || key === 'servers') && !history.includes('two-servers')) {
        history.push('two-servers');
      }

      nextParams.history = history;
      return nextParams;
    }

    default:
      return nextParams;
  }
}

/**
 * Helper to construct a typed Nand04State from simulatorParams for rendering.
 */
export function toNand04State(
  _stepId: string,
  params: Record<string, any>
): Nand04State {
  return {
    cell: (params.cell ?? 'low') as any,
    readV: (params.readV !== undefined ? Number(params.readV) : 1) as any,
    power: (params.power ?? 'on') as any,
    pageStage: (params.pageStage ?? 'initial') as any,
    writePattern: (params.writePattern ?? 'cold') as any,
    ecc: Boolean(params.ecc ?? false),
    plp: Boolean(params.plp ?? false),
    dramCache: Boolean(params.dramCache ?? false),
    transport: (params.transport ?? 'command') as any,
    ai: (params.ai ?? 'cold-load') as any,
    servers: (params.servers !== undefined ? Number(params.servers) : 1) as any,
  };
}
