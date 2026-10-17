import { writeCell, senseRead, leakageVoltage, type Bit, type DramPhase } from '../../a05/dram/dramModel';

/**
 * A02 DRAM Typed Action & Evidence Adapter
 * Maps real UI control interactions (PromptCard/DramSceneVisual) to deterministic
 * DRAM 1T1C physics state transitions and scientific observation evidence.
 */
export function applyDramActionAdapter(
  stepId: string,
  currentParams: Record<string, any>,
  key: string,
  value: any
): Record<string, any> {
  const nextParams = { ...currentParams, [key]: value };
  const history: string[] = Array.isArray(currentParams.history) ? [...currentParams.history] : [];

  switch (stepId) {
    case 'step-dram-s1-write': {
      // Inputs: wl (0 | 1), bl (0 | 1)
      const prevCell: Bit = Number(currentParams.cell ?? 0) === 1 ? 1 : 0;
      const nextWlRaw = key === 'wl' ? Number(value) : Number(currentParams.wl ?? 0);
      const nextBlRaw = key === 'bl' ? Number(value) : Number(currentParams.bl ?? 1);
      const nextWl: Bit = nextWlRaw === 1 ? 1 : 0;
      const nextBl: Bit = nextBlRaw === 1 ? 1 : 0;

      // Compute actual physical cell charge using writeCell model
      const nextCell = writeCell(prevCell, nextBl, nextWl);
      nextParams.wl = nextWl;
      nextParams.bl = nextBl;
      nextParams.cell = nextCell;

      // Evidence 1: 'charged' -> WL=1, BL=1 successfully charges the capacitor
      if (nextWl === 1 && nextBl === 1 && nextCell === 1) {
        if (!history.includes('charged')) {
          history.push('charged');
        }
      }

      // Evidence 2: 'held' -> Cell was charged, WL turned OFF (0), BL drops to 0, but cell remains 1 (isolation)
      if (
        (history.includes('charged') || prevCell === 1) &&
        nextWl === 0 &&
        nextBl === 0 &&
        nextCell === 1
      ) {
        if (!history.includes('held')) {
          history.push('held');
        }
      }

      nextParams.history = history;
      return nextParams;
    }

    case 'step-dram-s2-sense-restore': {
      // Inputs: bit (0 | 1), phase ('precharge' | 'shared' | 'sensed' | 'restored')
      const bitRaw = key === 'bit' ? Number(value) : Number(currentParams.bit ?? 1);
      const bit: Bit = bitRaw === 0 ? 0 : 1;
      let phase = (key === 'phase' ? String(value) : String(currentParams.phase ?? 'precharge')) as DramPhase;

      // If user switches bit, reset phase to precharge
      if (key === 'bit') {
        phase = 'precharge';
        nextParams.phase = 'precharge';
      }

      // Enforce valid phase progression: precharge -> shared -> sensed -> restored
      if (phase === 'shared') {
        if (!history.includes('shared')) {
          history.push('shared');
        }
      } else if (phase === 'sensed') {
        if (history.includes('shared')) {
          if (!history.includes('sensed')) {
            history.push('sensed');
          }
        }
      } else if (phase === 'restored') {
        // Restore is valid only if shared and sensed were both witnessed in sequence
        if (history.includes('shared') && history.includes('sensed')) {
          if (!history.includes('restored')) {
            history.push('restored');
          }
        }
      }

      const read = senseRead(bit, phase);
      nextParams.bit = bit;
      nextParams.phase = phase;
      nextParams.cell = read.cellVoltage >= 0.5 ? 1 : 0;
      nextParams.cellVoltage = read.cellVoltage;
      nextParams.bitlineVoltage = read.bitlineVoltage;
      nextParams.history = history;
      return nextParams;
    }

    case 'step-dram-s3-leak-refresh': {
      // Inputs: elapsed (0.0 to 2.0), refresh (boolean)
      const elapsed = key === 'elapsed' ? Number(value) : Number(currentParams.elapsed ?? 0);
      const isRefreshOn = key === 'refresh' ? Boolean(value) : Boolean(currentParams.refresh ?? false);
      let refreshAt =
        currentParams.refreshAt !== undefined && currentParams.refreshAt !== null
          ? Number(currentParams.refreshAt)
          : null;

      // Evidence 1: 'leaked' -> time elapsed >= 1.0 (voltage drops below operating margin)
      if (elapsed >= 1.0) {
        if (!history.includes('leaked')) {
          history.push('leaked');
        }
      }

      // Evidence 2: 'refreshed' -> refresh toggle activated AFTER leakage has occurred
      if (key === 'refresh' && isRefreshOn) {
        refreshAt = elapsed;
        nextParams.refreshAt = refreshAt;
        if (history.includes('leaked') || elapsed >= 1.0) {
          if (!history.includes('refreshed')) {
            history.push('refreshed');
          }
        }
      } else if (key === 'refresh' && !isRefreshOn) {
        refreshAt = null;
        nextParams.refreshAt = null;
      }

      const vCell = leakageVoltage(elapsed, refreshAt);
      nextParams.elapsed = elapsed;
      nextParams.refresh = isRefreshOn;
      nextParams.refreshAt = refreshAt;
      nextParams.cellVoltage = vCell;
      nextParams.history = history;
      return nextParams;
    }

    case 'step-dram-s4-row-bank': {
      // Inputs: banks (1 | 2)
      const banks = key === 'banks' ? Number(value) : Number(currentParams.banks ?? 1);

      if (banks === 1) {
        if (!history.includes('serial')) {
          history.push('serial');
        }
      } else if (banks === 2) {
        if (!history.includes('parallel')) {
          history.push('parallel');
        }
      }

      nextParams.banks = banks;
      nextParams.history = history;
      return nextParams;
    }

    default:
      return nextParams;
  }
}
