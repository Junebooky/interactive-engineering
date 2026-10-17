import React, { useMemo, useState, useEffect, useRef } from 'react';
import { calculateCircuitState } from './circuitModel';

interface Circuit2DSceneProps {
  voltage: number;
  resistance: number;
  switchClosed: boolean;
  onSwitchToggle?: () => void;
}

export const Circuit2DScene: React.FC<Circuit2DSceneProps> = ({
  voltage,
  resistance,
  switchClosed,
  onSwitchToggle,
}) => {
  const [electronOffset, setElectronOffset] = useState(0);
  const animFrameRef = useRef<number | null>(null);

  const state = useMemo(
    () => calculateCircuitState({ voltage, resistance, switchClosed }),
    [voltage, resistance, switchClosed]
  );

  // Animation loop for circulating electrons
  useEffect(() => {
    let last = performance.now();
    const loop = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      if (state.switchClosed && state.electronSpeed > 0) {
        setElectronOffset((prev) => (prev + delta * state.electronSpeed * 220) % 1200);
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [state.switchClosed, state.electronSpeed]);

  // Circuit loop path: 500x260 rectangle with rounded corners
  // Top: (100, 50) -> (480, 50)
  // Right: (480, 50) -> (480, 260)
  // Bottom: (480, 260) -> (100, 260)
  // Left: (100, 260) -> (100, 50)
  // Perimeter = (380 + 210) * 2 = 1180px

  return (
    <div className="scene-container">
      <div className="scene-card">
        {/* Circuit HUD */}
        <div className="scene-hud">
          <div className="hud-metric">
            <span className="hud-label">전원 전압 V</span>
            <span className="hud-value" style={{ color: '#F59E0B' }}>{state.voltage.toFixed(1)} V</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">회로 저항 R</span>
            <span className="hud-value" style={{ color: '#A855F7' }}>{state.resistance.toFixed(1)} Ω</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">전류 I (V/R)</span>
            <span className="hud-value" style={{ color: state.currentA > 0 ? '#10B981' : '#94A3B8' }}>
              {state.currentA.toFixed(3)} A ({state.currentMa.toFixed(0)} mA)
            </span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">전력 소비량 P</span>
            <span className="hud-value" style={{ color: state.powerW > 0 ? '#38BDF8' : '#94A3B8' }}>
              {state.powerW.toFixed(2)} W
            </span>
          </div>
        </div>

        {/* 2.5D Circuit Canvas */}
        <div className="svg-wrapper">
          <svg
            viewBox="0 0 580 320"
            className="circuit-svg"
            role="img"
            aria-label="옴의 법칙 직류 회로도 (배터리, 스위치, 저항, 전구)"
          >
            <defs>
              <radialGradient id="bulbGlowRadial" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity={state.bulbBrightness * 0.9} />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity={state.bulbBrightness * 0.5} />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </radialGradient>

              <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Circuit Wire Base Loop */}
            <rect
              x="90"
              y="50"
              width="400"
              height="220"
              rx="16"
              fill="none"
              stroke="#334155"
              strokeWidth="5"
            />

            {/* Circulating Electron particles when switch is closed */}
            {state.switchClosed && state.currentA > 0 && (
              <rect
                x="90"
                y="50"
                width="400"
                height="220"
                rx="16"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeDasharray="4 38"
                strokeDashoffset={-electronOffset}
                filter="url(#softGlow)"
              />
            )}

            {/* BATTERY (Left Side: x=90, y=160) */}
            <g transform="translate(60, 120)">
              {/* Battery Body */}
              <rect x="15" y="10" width="30" height="60" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
              <rect x="25" y="2" width="10" height="8" rx="2" fill="#f59e0b" />
              {/* Polarities */}
              <text x="30" y="32" fill="#ef4444" fontSize="16" fontWeight="bold" textAnchor="middle">+</text>
              <text x="30" y="58" fill="#38bdf8" fontSize="18" fontWeight="bold" textAnchor="middle">-</text>
              <text x="30" y="88" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle">
                {state.voltage.toFixed(0)}V DC
              </text>
            </g>

            {/* KNIFE SWITCH (Top: x=240, y=50) */}
            <g
              transform="translate(220, 25)"
              style={{ cursor: 'pointer' }}
              onClick={onSwitchToggle}
            >
              {/* Switch Base */}
              <rect x="0" y="15" width="80" height="20" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              {/* Contact Terminals */}
              <circle cx="15" cy="25" r="4" fill="#cbd5e1" />
              <circle cx="65" cy="25" r="4" fill="#cbd5e1" />

              {/* Lever arm */}
              {state.switchClosed ? (
                // Closed Knife Blade
                <line x1="15" y1="25" x2="65" y2="25" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
              ) : (
                // Open Knife Blade (Angled up 35 deg)
                <line x1="15" y1="25" x2="55" y2="2" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
              )}

              <text x="40" y="52" fill={state.switchClosed ? '#34d399' : '#f87171'} fontSize="11" fontWeight="bold" textAnchor="middle">
                {state.switchClosed ? '스위치 닫힘 (ON)' : '스위치 열림 (클릭하여 닫기)'}
              </text>
            </g>

            {/* VARIABLE RESISTOR (Right Side: x=490, y=160) */}
            <g transform="translate(460, 120)">
              {/* Resistor Body */}
              <rect x="15" y="10" width="30" height="60" rx="4" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
              {/* Color Bands */}
              <rect x="15" y="22" width="30" height="5" fill="#f59e0b" />
              <rect x="15" y="34" width="30" height="5" fill="#a855f7" />
              <rect x="15" y="46" width="30" height="5" fill="#06b6d4" />
              <rect x="15" y="58" width="30" height="4" fill="#e2e8f0" />
              <text x="30" y="88" fill="#e2e8f0" fontSize="12" fontWeight="bold" textAnchor="middle">
                {state.resistance.toFixed(0)} Ω
              </text>
            </g>

            {/* LIGHTBULB (Bottom: x=290, y=270) */}
            <g transform="translate(250, 230)">
              {/* Radial Bulb Glow Aura */}
              {state.bulbBrightness > 0.05 && (
                <circle
                  cx="40"
                  cy="40"
                  r={30 + state.bulbBrightness * 35}
                  fill="url(#bulbGlowRadial)"
                />
              )}

              {/* Glass Dome */}
              <circle
                cx="40"
                cy="40"
                r="24"
                fill={state.bulbBrightness > 0.1 ? '#fef08a' : '#1e293b'}
                fillOpacity={0.25 + state.bulbBrightness * 0.75}
                stroke="#64748b"
                strokeWidth="1.5"
              />

              {/* Filament */}
              <path
                d="M 33 46 L 37 32 L 43 32 L 47 46"
                fill="none"
                stroke={state.filamentColor}
                strokeWidth={state.bulbBrightness > 0.3 ? '2.5' : '1.5'}
                filter={state.bulbBrightness > 0.2 ? 'url(#softGlow)' : undefined}
              />

              {/* Bulb Metal Screw Base */}
              <rect x="34" y="60" width="12" height="10" rx="2" fill="#94a3b8" />

              <text x="40" y="85" fill="#f8fafc" fontSize="12" fontWeight="600" textAnchor="middle">
                전구 ({Math.round(state.bulbBrightness * 100)}% 밝기)
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
