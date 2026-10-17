export interface InverterParams {
  vin: number; // Input voltage: 0V ~ 5V
  vdd?: number; // Supply voltage: 5.0V
  rd?: number; // Pull-up resistor in kOhm: 10 kOhm
  vth?: number; // MOSFET threshold voltage: 0.7V
}

export interface InverterState {
  vin: number;
  vdd: number;
  rd: number;
  vth: number;
  inputLogic: 0 | 1;
  outputLogic: 0 | 1;
  vout: number; // Output voltage (V)
  isTransistorOn: boolean;
  transistorStateText: string;
  currentMa: number; // Current flowing through pull-up resistor and nMOS
  pullDownActive: boolean;
}

export function calculateInverterState(params: InverterParams): InverterState {
  const { vin, vdd = 5.0, rd = 10, vth = 0.7 } = params;
  
  const isTransistorOn = vin >= vth;
  const inputLogic: 0 | 1 = vin >= 2.5 ? 1 : 0;

  let vout = vdd;
  let currentMa = 0;
  let pullDownActive = false;

  if (!isTransistorOn) {
    // Transistor OFF -> No current -> Vout = Vdd (5V)
    vout = vdd;
    currentMa = 0;
    pullDownActive = false;
  } else {
    // Transistor ON -> pulls down to ground
    // As Vin goes from 0.7 to 5V, on-resistance Ron drops from ~5k to ~100 ohm
    const onResistance = 0.15 + 4.0 / Math.max(0.1, (vin - vth + 0.5));
    // Voltage divider between Rd (10k) and Ron (0.2k ~ 2k)
    vout = (vdd * onResistance) / (rd + onResistance);
    currentMa = (vdd - vout) / rd;
    pullDownActive = true;
  }

  const outputLogic: 0 | 1 = vout <= 1.5 ? 0 : 1;

  return {
    vin: Math.round(vin * 100) / 100,
    vdd,
    rd,
    vth,
    inputLogic,
    outputLogic,
    vout: Math.round(vout * 100) / 100,
    isTransistorOn,
    transistorStateText: isTransistorOn ? '도통 (ON - 풀다운 접지 연결)' : '차단 (OFF - 개방 상태)',
    currentMa: Math.round(currentMa * 100) / 100,
    pullDownActive,
  };
}
