export interface MosfetParams {
  vgs: number; // Gate-Source voltage (V)
  vds: number; // Drain-Source voltage (V)
  vth?: number; // Threshold voltage (default: 0.7V)
  kn?: number; // Conduction parameter (default: 2.0 mA/V^2)
}

export type MosfetRegion = 'CUTOFF' | 'TRIODE' | 'SATURATION';

export interface MosfetState {
  region: MosfetRegion;
  vgs: number;
  vds: number;
  vth: number;
  vov: number; // Overdrive voltage: Vgs - Vth
  vdsSat: number; // Saturation drain voltage: Vgs - Vth
  id: number; // Drain current (mA)
  channelThickness: number; // Normalized channel depth at source side (0 ~ 1)
  drainChannelThickness: number; // Normalized channel depth at drain side (0 ~ 1, pinches off to ~0.05)
  isChannelFormed: boolean;
  electronCount: number; // Number of electrons visible in inversion layer
  verticalFieldIntensity: number; // 0 ~ 1
  horizontalFieldIntensity: number; // 0 ~ 1
}

export function calculateMosfetState(params: MosfetParams): MosfetState {
  const { vgs, vds, vth = 0.7, kn = 2.0 } = params;
  const vov = Math.max(0, vgs - vth);
  const isChannelFormed = vgs >= vth;

  let region: MosfetRegion = 'CUTOFF';
  let id = 0;
  const vdsSat = vov;

  if (!isChannelFormed) {
    region = 'CUTOFF';
    id = 0;
  } else if (vds < vdsSat) {
    region = 'TRIODE';
    // Id = kn * [(Vgs - Vth)*Vds - 0.5 * Vds^2]
    id = kn * (vov * vds - 0.5 * vds * vds);
  } else {
    region = 'SATURATION';
    // Id = 0.5 * kn * (Vgs - Vth)^2
    id = 0.5 * kn * vov * vov;
  }

  // Visual channel parameters
  const channelThickness = isChannelFormed ? Math.min(1.0, vov / 1.5) : 0;
  let drainChannelThickness = channelThickness;

  if (isChannelFormed) {
    if (vds >= vdsSat) {
      // Pinched off at drain edge
      drainChannelThickness = 0.08 * channelThickness;
    } else {
      // Linear slope from source to drain
      const reduction = (vds / Math.max(0.001, vdsSat)) * 0.85;
      drainChannelThickness = Math.max(0.1, channelThickness * (1 - reduction));
    }
  }

  const electronCount = isChannelFormed ? Math.round(15 + channelThickness * 45) : Math.round(vgs * 4);
  const verticalFieldIntensity = Math.min(1.0, vgs / 2.5);
  const horizontalFieldIntensity = Math.min(1.0, vds / 3.0);

  return {
    region,
    vgs: Math.round(vgs * 100) / 100,
    vds: Math.round(vds * 100) / 100,
    vth,
    vov: Math.round(vov * 100) / 100,
    vdsSat: Math.round(vdsSat * 100) / 100,
    id: Math.max(0, Math.round(id * 100) / 100),
    channelThickness,
    drainChannelThickness,
    isChannelFormed,
    electronCount,
    verticalFieldIntensity,
    horizontalFieldIntensity,
  };
}
