import React, { useMemo, useState, useEffect, useRef } from 'react';
import { calculateInverterState } from './inverterModel';

interface InverterCircuit2DProps {
  vin: number;
  onVinChange?: (vin: number) => void;
  showTruthTableHint?: boolean;
}

export const InverterCircuit2D: React.FC<InverterCircuit2DProps> = ({
  vin,
  onVinChange,
  showTruthTableHint = true,
}) => {
  const [animTime, setAnimTime] = useState(0);
  const animFrameRef = useRef<number | null>(null);

  const state = useMemo(() => calculateInverterState({ vin }), [vin]);

  // Current animation loop
  useEffect(() => {
    let last = performance.now();
    const loop = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      if (state.pullDownActive) {
        setAnimTime((t) => t + delta * 2.5);
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [state.pullDownActive]);

  return (
    <div className="scene-container">
      <div className="scene-card">
        {/* HUD Bar */}
        <div className="scene-hud">
          <div className="hud-metric">
            <span className="hud-label">입력 신호 V_in</span>
            <span className="hud-value" style={{ color: state.vin >= 2.5 ? '#10B981' : '#94A3B8' }}>
              {state.vin.toFixed(1)}V (논리 {state.inputLogic})
            </span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">nMOS 동작 상태</span>
            <span className="hud-value" style={{ color: state.isTransistorOn ? '#38BDF8' : '#F43F5E' }}>
              {state.transistorStateText}
            </span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">출력 전압 V_out</span>
            <span className="hud-value" style={{ color: state.outputLogic === 1 ? '#10B981' : '#F59E0B' }}>
              {state.vout.toFixed(2)}V (논리 {state.outputLogic})
            </span>
          </div>
        </div>

        {/* 2.5D SVG Circuit Schematic */}
        <div className="svg-wrapper">
          <svg
            viewBox="0 0 560 330"
            className="inverter-svg"
            role="img"
            aria-label="NMOS 인버터 및 NOT 게이트 회로도"
          >
            <defs>
              <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* VDD Supply Rail */}
            <line x1="200" y1="30" x2="360" y2="30" stroke="#f59e0b" strokeWidth="4" />
            <circle cx="280" cy="30" r="5" fill="#f59e0b" />
            <text x="280" y="20" fill="#f59e0b" fontSize="13" fontWeight="bold" textAnchor="middle">
              V_DD = +5.0V (전원 공급 레일)
            </text>

            {/* Top wire to Resistor */}
            <line x1="280" y1="30" x2="280" y2="60" stroke="#94a3b8" strokeWidth="3" />

            {/* Pull-up Resistor Rd */}
            <rect x="260" y="60" width="40" height="60" rx="4" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="260" y1="75" x2="300" y2="75" stroke="#f59e0b" strokeWidth="2" />
            <line x1="260" y1="90" x2="300" y2="90" stroke="#06b6d4" strokeWidth="2" />
            <line x1="260" y1="105" x2="300" y2="105" stroke="#10b981" strokeWidth="2" />
            <text x="315" y="95" fill="#f8fafc" fontSize="12" fontWeight="600">
              R_D (10kΩ) 풀업 저항
            </text>

            {/* Wire to Node V_out */}
            <line x1="280" y1="120" x2="280" y2="160" stroke="#94a3b8" strokeWidth="3" />
            {/* Output Node Dot */}
            <circle cx="280" cy="160" r="6" fill="#38bdf8" />
            <text x="295" y="152" fill="#38bdf8" fontSize="13" fontWeight="bold">
              출력 노드 (V_out)
            </text>

            {/* Horizontal Branch to Output Pin & LED */}
            <line x1="280" y1="160" x2="430" y2="160" stroke="#94a3b8" strokeWidth="3" />

            {/* Output LED & Logic Indicator */}
            <g transform="translate(430, 140)">
              <rect x="0" y="0" width="85" height="42" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              {/* LED circle */}
              <circle
                cx="20"
                cy="21"
                r="10"
                fill={state.outputLogic === 1 ? '#10b981' : '#334155'}
                filter={state.outputLogic === 1 ? 'url(#bulbGlow)' : undefined}
              />
              <text x="40" y="18" fill="#f8fafc" fontSize="11" fontWeight="bold">
                출력 {state.outputLogic}
              </text>
              <text x="40" y="32" fill="#94a3b8" fontSize="9">
                {state.vout.toFixed(1)}V
              </text>
            </g>

            {/* Wire from Node to nMOS Drain */}
            <line x1="280" y1="160" x2="280" y2="195" stroke="#94a3b8" strokeWidth="3" />

            {/* nMOS Transistor Symbol */}
            {/* Drain & Source terminals */}
            <line x1="280" y1="195" x2="255" y2="195" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="280" y1="245" x2="255" y2="245" stroke="#94a3b8" strokeWidth="2.5" />
            {/* Drain-channel bars */}
            <line x1="255" y1="190" x2="255" y2="202" stroke="#38bdf8" strokeWidth="3" />
            <line x1="255" y1="215" x2="255" y2="225" stroke="#38bdf8" strokeWidth="3" />
            <line x1="255" y1="238" x2="255" y2="250" stroke="#38bdf8" strokeWidth="3" />
            {/* Gate Dielectric gap & Gate Plate */}
            <line x1="247" y1="190" x2="247" y2="250" stroke="#f8fafc" strokeWidth="3" />

            {/* Gate Lead to Input */}
            <line x1="247" y1="220" x2="140" y2="220" stroke="#94a3b8" strokeWidth="3" />

            {/* Interactive Gate Input Toggle Button in Canvas */}
            <g
              transform="translate(45, 195)"
              style={{ cursor: 'pointer' }}
              onClick={() => onVinChange && onVinChange(state.vin >= 2.5 ? 0 : 5.0)}
            >
              <rect
                x="0"
                y="0"
                width="95"
                height="50"
                rx="6"
                fill={state.vin >= 2.5 ? '#064e3b' : '#1e293b'}
                stroke={state.vin >= 2.5 ? '#10b981' : '#475569'}
                strokeWidth="2"
              />
              <text x="47" y="22" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">
                입력 V_in
              </text>
              <text
                x="47"
                y="40"
                fill={state.vin >= 2.5 ? '#34d399' : '#94a3b8'}
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
              >
                {state.vin >= 2.5 ? 'HIGH (1)' : 'LOW (0)'}
              </text>
            </g>

            <text x="210" y="275" fill="#94a3b8" fontSize="11" textAnchor="middle">
              nMOS (풀다운 스위치)
            </text>

            {/* Wire to Ground */}
            <line x1="280" y1="245" x2="280" y2="280" stroke="#94a3b8" strokeWidth="3" />
            {/* Ground Symbol (GND) */}
            <line x1="265" y1="280" x2="295" y2="280" stroke="#94a3b8" strokeWidth="3" />
            <line x1="270" y1="286" x2="290" y2="286" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="275" y1="292" x2="285" y2="292" stroke="#94a3b8" strokeWidth="2" />
            <text x="280" y="307" fill="#64748b" fontSize="11" textAnchor="middle">접지 (0V GND)</text>

            {/* Animated Pull-Down Current dots when nMOS is ON */}
            {state.pullDownActive && (
              <g>
                {[0, 1, 2, 3].map((idx) => {
                  const progress = (animTime * 0.7 + idx * 0.25) % 1.0;
                  const dotY = 30 + progress * (280 - 30);
                  return (
                    <circle
                      key={idx}
                      cx="280"
                      cy={dotY}
                      r="3"
                      fill="#38bdf8"
                    />
                  );
                })}
              </g>
            )}
          </svg>
        </div>

        {/* Explanation callout inside scene */}
        {showTruthTableHint && (
          <div className="inverter-callout">
            <span className="callout-icon">💡</span>
            <div className="callout-text">
              <strong>핵심 반전 원리:</strong> nMOS가 <strong>ON(도통)</strong>되면 출력이 접지(0V)로 단락되어 <strong>논리 0</strong>이 되고, 
              nMOS가 <strong>OFF(차단)</strong>되면 풀업 저항에 의해 전원(+5V)으로 당겨져 <strong>논리 1</strong>이 됩니다!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
