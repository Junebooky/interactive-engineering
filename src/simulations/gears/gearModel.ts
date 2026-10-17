export interface GearParams {
  n1: number; // Driving gear teeth (e.g. 12)
  n2: number; // Driven gear teeth (e.g. 12, 18, 24, 36)
  angle1: number; // Driving gear rotation angle in degrees
  angularSpeed1?: number; // Driving gear angular speed (deg/s)
  inputTorqueNm?: number; // Input torque in N*m (default: 5.0)
}

export interface GearState {
  n1: number;
  n2: number;
  gearRatio: number; // N2 / N1 (Speed reduction ratio / Torque amplification)
  angle1: number; // Degrees
  angle2: number; // Driven gear angle in degrees (rotated in opposite direction!)
  angularSpeed1: number;
  angularSpeed2: number; // Opposite sign and scaled
  inputTorqueNm: number;
  outputTorqueNm: number; // T2 = T1 * (N2 / N1)
  pitchRadius1: number; // Relative radius for rendering
  pitchRadius2: number;
  meshCenterDistance: number;
  directionReversed: boolean; // Always true for external mesh
  isTargetTorqueReached: boolean;
}

export function calculateGearState(params: GearParams): GearState {
  const { n1, n2, angle1, angularSpeed1 = 45, inputTorqueNm = 5.0 } = params;

  // Gear ratio = Driven / Driver
  const gearRatio = n2 / Math.max(1, n1);

  // Direction is inverted in external meshing!
  // theta2 = - theta1 * (N1 / N2)
  const angle2 = -(angle1 * (n1 / n2));
  const angularSpeed2 = -(angularSpeed1 / gearRatio);

  // Torque amplification: T2 = T1 * (N2 / N1)
  const outputTorqueNm = inputTorqueNm * gearRatio;

  // Pitch diameter is proportional to teeth number
  // Let module m = 5px
  const modulePx = 4.2;
  const pitchRadius1 = (n1 * modulePx);
  const pitchRadius2 = (n2 * modulePx);
  const meshCenterDistance = pitchRadius1 + pitchRadius2;

  return {
    n1,
    n2,
    gearRatio: Math.round(gearRatio * 100) / 100,
    angle1: Math.round(angle1 * 10) / 10,
    angle2: Math.round(angle2 * 10) / 10,
    angularSpeed1,
    angularSpeed2: Math.round(angularSpeed2 * 10) / 10,
    inputTorqueNm,
    outputTorqueNm: Math.round(outputTorqueNm * 10) / 10,
    pitchRadius1,
    pitchRadius2,
    meshCenterDistance,
    directionReversed: true,
    isTargetTorqueReached: Math.abs(gearRatio - 3.0) < 0.05,
  };
}
