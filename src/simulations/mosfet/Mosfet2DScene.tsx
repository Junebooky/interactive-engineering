import React, { useMemo, useRef, useEffect, useState } from 'react';
import { calculateMosfetState } from './mosfetModel';

interface Mosfet2DSceneProps {
  vgs: number;
  vds: number;
  onParamChange?: (key: string, value: number) => void;
  showIVCurve?: boolean;
}

export const Mosfet2DScene: React.FC<Mosfet2DSceneProps> = ({
  vgs,
  vds,
  showIVCurve = true,
}) => {
  const [animTime, setAnimTime] = useState(0);
  const animFrameRef = useRef<number | null>(null);

  const state = useMemo(() => calculateMosfetState({ vgs, vds }), [vgs, vds]);

  // Animation loop for electron flow
  useEffect(() => {
    let last = performance.now();
    const loop = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      if (state.id > 0) {
        setAnimTime((t) => t + delta * Math.min(6, 1 + state.id * 1.5));
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [state.id]);

  // Pre-generate static electron positions in inversion layer
  const channelElectrons = useMemo(() => {
    const list = [];
    const count = 36;
    for (let i = 0; i < count; i++) {
      const u = (i + 0.5) / count; // 0 (source) to 1 (drain)
      list.push({ id: i, u, seedY: (Math.sin(i * 12.3) + 1) * 0.5 });
    }
    return list;
  }, []);

  // IV curve points for the current Vgs
  const ivPath = useMemo(() => {
    if (!showIVCurve) return '';
    const points: string[] = [];
    const stepVds = 0.1;
    for (let x = 0; x <= 3.0; x += stepVds) {
      const s = calculateMosfetState({ vgs, vds: x });
      // graph coords: width 180, height 70, padding: x: 20..170, y: 75..15
      const gx = 25 + (x / 3.0) * 145;
      const gy = 75 - (s.id / 5.0) * 60;
      points.push(`${gx.toFixed(1)},${Math.max(15, gy).toFixed(1)}`);
    }
    return points.join(' ');
  }, [vgs, showIVCurve]);

  // Current operating point on graph
  const qPointX = 25 + (vds / 3.0) * 145;
  const qPointY = 75 - (state.id / 5.0) * 60;

  return (
    <div className="scene-container">
      <div className="scene-card">
        {/* Header HUD with Live Readouts */}
        <div className="scene-hud">
          <div className="hud-metric">
            <span className="hud-label">게이트 전압 V_GS</span>
            <span className="hud-value" style={{ color: '#06B6D4' }}>{state.vgs.toFixed(2)} V</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">드레인 전압 V_DS</span>
            <span className="hud-value" style={{ color: '#F59E0B' }}>{state.vds.toFixed(2)} V</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">드레인 전류 I_D</span>
            <span className="hud-value" style={{ color: state.id > 0 ? '#10B981' : '#94A3B8' }}>
              {state.id.toFixed(2)} mA
            </span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">동작 영역</span>
            <span className={`hud-badge badge-${state.region.toLowerCase()}`}>
              {state.region === 'CUTOFF' && '차단 영역 (OFF)'}
              {state.region === 'TRIODE' && '선형/트라이오드 영역'}
              {state.region === 'SATURATION' && '포화 영역 (핀치오프)'}
            </span>
          </div>
        </div>

        {/* 2.5D SVG Semiconductor Cross-Section */}
        <div className="svg-wrapper">
          <svg
            viewBox="0 0 600 340"
            className="mosfet-svg"
            role="img"
            aria-label="nMOS 반도체 2.5D 단면 구조도"
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="pSubGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e2238" />
                <stop offset="100%" stopColor="#0f1222" />
              </linearGradient>

              <linearGradient id="nPlusGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>

              <linearGradient id="gateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>

              <linearGradient id="oxideGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.9" />
              </linearGradient>

              <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background 2.5D Grid & Base Plate */}
            <rect x="20" y="70" width="560" height="250" rx="8" fill="url(#pSubGrad)" stroke="#334155" strokeWidth="1.5" />
            <text x="35" y="300" fill="#64748b" fontSize="13" fontFamily="monospace" fontWeight="600">
              P-형 실리콘 기판 (P-Substrate)
            </text>

            {/* Source n+ region */}
            <rect x="70" y="70" width="100" height="75" rx="4" fill="url(#nPlusGrad)" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="120" y="112" fill="#f0f9ff" fontSize="14" fontWeight="bold" textAnchor="middle">
              소스 n+
            </text>
            <text x="120" y="130" fill="#bae6fd" fontSize="11" textAnchor="middle">
              Source (0V)
            </text>

            {/* Drain n+ region */}
            <rect x="430" y="70" width="100" height="75" rx="4" fill="url(#nPlusGrad)" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="480" y="112" fill="#f0f9ff" fontSize="14" fontWeight="bold" textAnchor="middle">
              드레인 n+
            </text>
            <text x="480" y="130" fill="#bae6fd" fontSize="11" textAnchor="middle">
              Drain ({vds.toFixed(1)}V)
            </text>

            {/* Oxide Layer (SiO2) */}
            <rect x="170" y="58" width="260" height="12" rx="2" fill="url(#oxideGrad)" stroke="#d97706" strokeWidth="1" />
            <text x="300" y="67" fill="#fef3c7" fontSize="10" fontWeight="bold" textAnchor="middle">
              산화막 절연체 SiO₂ (Gate Oxide)
            </text>

            {/* Metal Gate Electrode */}
            <rect x="190" y="22" width="220" height="34" rx="4" fill="url(#gateGrad)" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="300" y="44" fill="#f8fafc" fontSize="14" fontWeight="bold" textAnchor="middle">
              게이트 전극 (Gate: {vgs.toFixed(1)}V)
            </text>

            {/* Vertical Field Arrows when Vgs > 0 */}
            {state.vgs > 0.2 && (
              <g opacity={state.verticalFieldIntensity}>
                {[220, 260, 300, 340, 380].map((x) => (
                  <path
                    key={x}
                    d={`M ${x} 54 L ${x} 68`}
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="2 2"
                    markerEnd="url(#arrow)"
                  />
                ))}
              </g>
            )}

            {/* Inversion Layer (n-Channel) */}
            {state.isChannelFormed && (
              <g>
                {/* Dynamic Channel polygon showing pinch-off geometry */}
                <polygon
                  points={`
                    170,72 
                    430,72 
                    430,${72 + state.drainChannelThickness * 28} 
                    170,${72 + state.channelThickness * 28}
                  `}
                  fill="#06b6d4"
                  fillOpacity={0.25 + state.channelThickness * 0.35}
                  stroke="#22d3ee"
                  strokeWidth="1.2"
                />

                {/* Flowing electrons in channel */}
                {channelElectrons.map((el) => {
                  // If current flows, drift u from source to drain
                  const currentU = (el.u + (state.id > 0 ? (animTime * 0.4) : 0)) % 1.0;
                  const x = 175 + currentU * 250;
                  // Local thickness interpolation from source to drain
                  const localThickness = (state.channelThickness * (1 - currentU) + state.drainChannelThickness * currentU) * 24;
                  const y = 74 + el.seedY * Math.max(3, localThickness);

                  return (
                    <circle
                      key={el.id}
                      cx={x}
                      cy={y}
                      r="2.4"
                      fill="#38bdf8"
                      filter="url(#glowCyan)"
                    />
                  );
                })}

                {/* Channel Label */}
                <text x="300" y={105 + state.channelThickness * 10} fill="#67e8f9" fontSize="12" fontWeight="600" textAnchor="middle">
                  전자 반전 채널 (Inversion n-Channel)
                </text>
              </g>
            )}

            {/* When Cutoff: dashed line indicating no channel */}
            {!state.isChannelFormed && (
              <g>
                <line x1="175" y1="74" x2="425" y2="74" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="300" y="105" fill="#f87171" fontSize="12" textAnchor="middle">
                  채널 끊어짐 (V_GS &lt; V_th = {state.vth}V)
                </text>
              </g>
            )}

            {/* Contact Leads & Terminals */}
            <line x1="120" y1="70" x2="120" y2="15" stroke="#94a3b8" strokeWidth="3" />
            <circle cx="120" cy="15" r="4" fill="#38bdf8" />
            <text x="120" y="8" fill="#94a3b8" fontSize="11" textAnchor="middle">GND</text>

            <line x1="480" y1="70" x2="480" y2="15" stroke="#94a3b8" strokeWidth="3" />
            <circle cx="480" cy="15" r="4" fill="#f59e0b" />
            <text x="480" y="8" fill="#f59e0b" fontSize="11" textAnchor="middle">V_DS</text>

            <line x1="300" y1="22" x2="300" y2="8" stroke="#94a3b8" strokeWidth="3" />
            <circle cx="300" cy="8" r="4" fill="#06b6d4" />

            {/* Current Flow Vector arrow when Id > 0 */}
            {state.id > 0 && (
              <g>
                <path
                  d="M 440 95 L 160 95"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  strokeDashoffset={-animTime * 20}
                />
                <text x="300" y="130" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">
                  전류 흐름 I_D (드레인 → 소스)
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Real-time IV Curve Mini-Graph HUD */}
        {showIVCurve && (
          <div className="iv-graph-panel">
            <div className="graph-header">
              <span className="graph-title">실시간 IV 특성 곡선 (V_DS vs I_D)</span>
              <span className="graph-sub">현재 V_GS = {state.vgs.toFixed(1)}V</span>
            </div>
            <svg viewBox="0 0 200 85" className="iv-svg">
              {/* Axes */}
              <line x1="25" y1="75" x2="185" y2="75" stroke="#475569" strokeWidth="1" />
              <line x1="25" y1="75" x2="25" y2="10" stroke="#475569" strokeWidth="1" />
              <text x="180" y="83" fill="#64748b" fontSize="8" textAnchor="end">V_DS (V)</text>
              <text x="25" y="8" fill="#64748b" fontSize="8">I_D (mA)</text>

              {/* Curve */}
              {ivPath && (
                <polyline
                  points={ivPath}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}

              {/* Operating Q Point */}
              {state.isChannelFormed && (
                <g>
                  <circle cx={qPointX} cy={qPointY} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1={qPointX} y1="75" x2={qPointX} y2={qPointY} stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="25" y1={qPointY} x2={qPointX} y2={qPointY} stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                </g>
              )}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
