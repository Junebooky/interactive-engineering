import {
  latch,
  access6T,
  simulateLru,
  dataLocality,
  type Bit,
  type AccessMode,
} from '../../a05/sram/sramModel';

/**
 * A02 SRAM Typed Action & Evidence Adapter
 * Maps real UI control interactions (PromptCard / SramSceneVisual) to deterministic
 * SRAM 6T latch, cache LRU, and GPU locality physical state transitions and scientific observation evidence.
 */
export function applySramActionAdapter(
  stepId: string,
  currentParams: Record<string, any>,
  key: string,
  value: any
): Record<string, any> {
  const nextParams = { ...currentParams, [key]: value };
  const history: string[] = Array.isArray(currentParams.history) ? [...currentParams.history] : [];

  switch (stepId) {
    case 'step-sram-s1-cross-coupled': {
      // Inputs: q (0 | 1), feedback (boolean), supply (boolean)
      const prevQ: Bit = Number(currentParams.q ?? 1) === 1 ? 1 : 0;
      const qRaw = key === 'q' ? Number(value) : prevQ;
      const q: Bit = qRaw === 1 ? 1 : 0;
      const feedback = key === 'feedback' ? Boolean(value) : Boolean(currentParams.feedback ?? true);
      const supply = key === 'supply' ? Boolean(value) : Boolean(currentParams.supply ?? true);

      const lat = latch(q, feedback, supply);
      nextParams.q = q;
      nextParams.feedback = feedback;
      nextParams.supply = supply;
      nextParams.qBar = lat.qBar;
      nextParams.stable = lat.stable;
      nextParams.note = lat.note;

      // Evidence 1 & 2: Witness both q=0 and q=1 while supply and feedback are ON
      if (supply && feedback) {
        if (q === 0 && !history.includes('q0')) {
          history.push('q0');
        }
        if (q === 1 && !history.includes('q1')) {
          history.push('q1');
        }
      }

      // Evidence 3: Witness volatility when power supply is turned OFF
      if (!supply) {
        if (!history.includes('volatile')) {
          history.push('volatile');
        }
      }

      nextParams.history = history;
      return nextParams;
    }

    case 'step-sram-s2-6t-access': {
      // Inputs: wl (0 | 1), bl (0 | 1), mode ('write' | 'read')
      let q: Bit = Number(currentParams.q ?? 1) === 1 ? 1 : 0;
      const wlRaw = key === 'wl' ? Number(value) : Number(currentParams.wl ?? 0);
      const blRaw = key === 'bl' ? Number(value) : Number(currentParams.bl ?? 1);
      const wl: Bit = wlRaw === 1 ? 1 : 0;
      const bl: Bit = blRaw === 1 ? 1 : 0;
      const mode: AccessMode = key === 'mode' ? (value as AccessMode) : (currentParams.mode ?? 'write');

      const cell = access6T(q, wl, bl, mode);
      q = cell.q;

      nextParams.q = q;
      nextParams.wl = wl;
      nextParams.bl = bl;
      nextParams.mode = mode;
      nextParams.qBar = cell.qBar;
      nextParams.connected = cell.connected;
      nextParams.readBit = cell.readBit;
      nextParams.readDisturbPossible = cell.readDisturbPossible;

      // Evidence 1: 'isolated' -> WL is OFF, so cell is protected against bitline toggling
      if (wl === 0) {
        if (!history.includes('isolated')) {
          history.push('isolated');
        }
      }

      // Evidence 2: 'wrote' -> WL is ON and mode is write
      if (wl === 1 && mode === 'write') {
        if (!history.includes('wrote')) {
          history.push('wrote');
        }
      }

      // Evidence 3: 'read' -> WL is ON and mode is read
      if (wl === 1 && mode === 'read') {
        if (!history.includes('read')) {
          history.push('read');
        }
      }

      nextParams.history = history;
      return nextParams;
    }

    case 'step-sram-s3-cpu-cache': {
      // Inputs: cacheLines (1 | 2), cacheRun (boolean / trigger)
      const linesRaw = key === 'cacheLines' ? Number(value) : Number(currentParams.cacheLines ?? 1);
      const cacheLines: 1 | 2 = linesRaw === 2 ? 2 : 1;
      const cacheRan = Boolean(currentParams.cacheRan || key === 'cacheRun' || key === 'cacheLines');

      const cache = simulateLru(cacheLines);

      nextParams.cacheLines = cacheLines;
      nextParams.cacheRan = cacheRan;
      nextParams.frames = cache.frames;
      nextParams.total = cache.total;
      nextParams.hits = cache.hits;
      nextParams.misses = cache.misses;

      // Evidence 1: 1 line produces total 41 toy units
      if (cacheLines === 1 && cacheRan) {
        if (!history.includes('one')) {
          history.push('one');
        }
      }

      // Evidence 2: 2 lines produce total 32 toy units
      if (cacheLines === 2 && cacheRan) {
        if (!history.includes('two')) {
          history.push('two');
        }
      }

      nextParams.history = history;
      return nextParams;
    }

    case 'step-sram-s4-data-locality': {
      // Inputs: resident (boolean), sendInput (boolean / trigger)
      const resident = key === 'resident' ? Boolean(value) : Boolean(currentParams.resident ?? true);
      let inputCount = Number(currentParams.inputCount ?? 1);

      if (key === 'sendInput') {
        inputCount += 1;
        if (!history.includes('input')) {
          history.push('input');
        }
      }

      const data = dataLocality(resident);

      nextParams.resident = resident;
      nextParams.inputCount = inputCount;
      nextParams.modelUploadNeeded = data.modelUploadNeeded;
      nextParams.modelPath = data.modelPath;
      nextParams.inputTransferRequired = data.inputTransferRequired;
      nextParams.inputPath = data.inputPath;
      nextParams.architecture = data.architecture;

      // Evidence 1 & 2: Compare resident vs not-resident
      if (resident) {
        if (!history.includes('resident')) {
          history.push('resident');
        }
      } else {
        if (!history.includes('not-resident')) {
          history.push('not-resident');
        }
      }

      // Evidence 3: If input was sent or initial observation
      if (inputCount >= 2 && !history.includes('input')) {
        history.push('input');
      }

      nextParams.history = history;
      return nextParams;
    }

    default:
      return nextParams;
  }
}
