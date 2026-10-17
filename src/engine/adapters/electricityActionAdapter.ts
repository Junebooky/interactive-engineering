import {
  simpleCircuit,
  resistorNetwork,
  rcModel,
  energyModel,
  type CircuitTopology,
  type ChargeMode,
  type Direction,
} from '../../a05/electricity/electricityModel';

/**
 * A02 Lesson 12 Electricity, Ohm's Law, RC Transient, & Power Action Adapter
 * Bridges reactive UI inputs into physical circuit equations and observations.
 */
export function applyElectricityActionAdapter(
  stepId: string,
  currentParams: Record<string, any>,
  key: string,
  value: any
): Record<string, any> {
  const nextParams = { ...currentParams, [key]: value };
  const history: string[] = Array.isArray(currentParams.history) ? [...currentParams.history] : [];

  switch (stepId) {
    case 'step-elec-s1-ohms-law': {
      const volts = (key === 'volts' ? Number(value) : Number(currentParams.volts ?? 5)) as 0 | 5;
      const closed = key === 'closed' ? Boolean(value) : Boolean(currentParams.closed ?? false);
      const direction = (key === 'direction' ? String(value) : String(currentParams.direction ?? 'conventional')) as Direction;

      const circuit = simpleCircuit(volts, closed, 1000);
      nextParams.volts = volts;
      nextParams.closed = closed;
      nextParams.direction = direction;
      nextParams.currentMilliAmps = circuit.currentMilliAmps;
      nextParams.terminalVoltageV = circuit.terminalVoltageV;

      // Evidence 1: Open switch under 5V yields zero current
      if (volts === 5 && !closed) {
        if (!history.includes('open')) history.push('open');
      }
      // Evidence 2: Closed switch under 5V yields 5mA current
      if (volts === 5 && closed) {
        if (!history.includes('closed')) history.push('closed');
      }
      // Evidence 3: Both directions observed
      if (direction === 'electron' && !history.includes('electron')) {
        history.push('electron');
      }
      if (direction === 'conventional' && !history.includes('conventional')) {
        history.push('conventional');
      }

      nextParams.history = history;
      return nextParams;
    }

    case 'step-elec-s2-resistors-kcl': {
      const topology = (key === 'topology' ? String(value) : String(currentParams.topology ?? 'series')) as CircuitTopology;
      const network = resistorNetwork(topology, 5, 1000);

      nextParams.topology = topology;
      nextParams.equivalentOhms = network.equivalentOhms;
      nextParams.totalMilliAmps = network.totalMilliAmps;
      nextParams.branchMilliAmps = network.branchMilliAmps;
      nextParams.eachResistorVoltageV = network.eachResistorVoltageV;

      if (topology === 'series' && !history.includes('series')) {
        history.push('series');
      }
      if (topology === 'parallel' && !history.includes('parallel')) {
        history.push('parallel');
      }

      nextParams.history = history;
      return nextParams;
    }

    case 'step-elec-s3-rc-transient': {
      const mode = (key === 'mode' ? String(value) : String(currentParams.mode ?? 'charge')) as ChargeMode;
      const rOhms = (key === 'rOhms' ? Number(value) : Number(currentParams.rOhms ?? 1000)) as 1000 | 2000;
      const cMicroFarads = (key === 'cMicroFarads' ? Number(value) : Number(currentParams.cMicroFarads ?? 10)) as 10 | 20;
      const timeMs = key === 'timeMs' ? Number(value) : Number(currentParams.timeMs ?? 0);

      let initialV = currentParams.rcInitialVoltageV !== undefined ? Number(currentParams.rcInitialVoltageV) : (mode === 'charge' ? 0 : 5);
      let segmentStartMs = currentParams.rcSegmentStartMs !== undefined ? Number(currentParams.rcSegmentStartMs) : 0;

      // When switching mode, preserve continuity or reset
      if (key === 'mode') {
        const prevRc = rcModel(
          currentParams.mode ?? 'charge',
          rOhms,
          cMicroFarads,
          currentParams.timeMs ?? 0,
          5,
          initialV,
          segmentStartMs
        );
        initialV = prevRc.voltageV;
        segmentStartMs = timeMs;
      }

      if (key === 'rOhms' || key === 'cMicroFarads') {
        initialV = mode === 'charge' ? 0 : 5;
        segmentStartMs = 0;
        nextParams.timeMs = 0;
      }

      const effectiveTime = nextParams.timeMs !== undefined ? nextParams.timeMs : timeMs;
      const rc = rcModel(mode, rOhms, cMicroFarads, effectiveTime, 5, initialV, segmentStartMs);

      nextParams.mode = mode;
      nextParams.rOhms = rOhms;
      nextParams.cMicroFarads = cMicroFarads;
      nextParams.rcInitialVoltageV = initialV;
      nextParams.rcSegmentStartMs = segmentStartMs;
      nextParams.tauMs = rc.tauMs;
      nextParams.voltageV = rc.voltageV;
      nextParams.currentMilliAmps = rc.currentMilliAmps;

      // Evidence 1: Default tau (10ms) in charge mode reaching ~3.16V
      if (mode === 'charge' && rOhms === 1000 && cMicroFarads === 10 && effectiveTime >= 10) {
        if (!history.includes('charge-tau')) history.push('charge-tau');
      }

      // Evidence 2: Default tau (10ms) in discharge mode reaching ~1.84V
      if (mode === 'discharge' && rOhms === 1000 && cMicroFarads === 10 && effectiveTime >= 10) {
        if (!history.includes('discharge-tau')) history.push('discharge-tau');
      }

      // Evidence 3: Increased R or C doubles tau
      if (rOhms === 2000 || cMicroFarads === 20) {
        if (!history.includes('new-tau')) history.push('new-tau');
      }

      nextParams.history = history;
      return nextParams;
    }

    case 'step-elec-s4-power-energy': {
      const powerVolts = (key === 'powerVolts' ? Number(value) : Number(currentParams.powerVolts ?? 5)) as 5 | 10;
      const loadMilliAmps = (key === 'loadMilliAmps' ? Number(value) : Number(currentParams.loadMilliAmps ?? 10)) as 5 | 10;
      const seconds = (key === 'seconds' ? Number(value) : Number(currentParams.seconds ?? 10)) as 1 | 10;

      const energy = energyModel(powerVolts, loadMilliAmps, seconds, 10);
      nextParams.powerVolts = powerVolts;
      nextParams.loadMilliAmps = loadMilliAmps;
      nextParams.seconds = seconds;
      nextParams.milliWatts = energy.milliWatts;
      nextParams.joules = energy.joules;
      nextParams.capacitorMicroJoules = energy.capacitorMicroJoules;

      // Evidence 1: Base energy (5V, 10mA, 10s -> 50mW, 0.5J)
      if (powerVolts === 5 && loadMilliAmps === 10 && seconds === 10) {
        if (!history.includes('base-energy')) history.push('base-energy');
      }

      // Evidence 2: 10V doubles voltage and quadruples capacitor energy (500µJ)
      if (powerVolts === 10) {
        if (!history.includes('cap-doubled')) history.push('cap-doubled');
      }

      nextParams.history = history;
      return nextParams;
    }

    default:
      return nextParams;
  }
}
