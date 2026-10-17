export interface CircuitParams {
  voltage: number; // Voltage V in Volts (e.g. 1V ~ 24V)
  resistance: number; // Resistance R in Ohms (e.g. 5 ~ 100 Ohms)
  switchClosed: boolean; // Knife switch state
}

export interface CircuitState {
  voltage: number;
  resistance: number;
  switchClosed: boolean;
  currentA: number; // Current I in Amperes
  currentMa: number; // Current I in Milliamperes
  powerW: number; // Power P = V * I in Watts
  bulbBrightness: number; // Normalized brightness 0.0 ~ 1.0 (with slight glow threshold)
  electronSpeed: number; // Normalized electron drift velocity 0.0 ~ 1.0
  isOverloaded: boolean; // Overload danger if I > 2.0A
  filamentColor: string;
}

export function calculateCircuitState(params: CircuitParams): CircuitState {
  const { voltage, resistance, switchClosed } = params;

  if (!switchClosed || resistance <= 0) {
    return {
      voltage: Math.round(voltage * 10) / 10,
      resistance: Math.round(resistance * 10) / 10,
      switchClosed,
      currentA: 0,
      currentMa: 0,
      powerW: 0,
      bulbBrightness: 0,
      electronSpeed: 0,
      isOverloaded: false,
      filamentColor: '#475569',
    };
  }

  // Ohm's law: I = V / R
  const currentA = voltage / resistance;
  const currentMa = currentA * 1000;
  // Power: P = I * V
  const powerW = currentA * voltage;

  // Normalized brightness: reference 12V with 30 Ohm -> I = 0.4A, P = 4.8W -> ~0.7 brightness
  const bulbBrightness = Math.min(1.0, Math.pow(powerW / 8.0, 0.7));
  const electronSpeed = Math.min(1.0, currentA / 1.5);
  const isOverloaded = currentA >= 1.8;

  // Filament glow color transition based on brightness
  let filamentColor = '#fbbf24';
  if (bulbBrightness > 0.8) {
    filamentColor = '#ffffff';
  } else if (bulbBrightness > 0.4) {
    filamentColor = '#fef08a';
  } else if (bulbBrightness > 0.1) {
    filamentColor = '#f59e0b';
  }

  return {
    voltage: Math.round(voltage * 10) / 10,
    resistance: Math.round(resistance * 10) / 10,
    switchClosed,
    currentA: Math.round(currentA * 1000) / 1000,
    currentMa: Math.round(currentMa * 10) / 10,
    powerW: Math.round(powerW * 100) / 100,
    bulbBrightness,
    electronSpeed,
    isOverloaded,
    filamentColor,
  };
}
