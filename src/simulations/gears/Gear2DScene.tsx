import React, { useMemo, useRef } from 'react';
import { calculateGearState } from './gearModel';

interface Gear2DSceneProps {
  n1: number; // Driver gear teeth
  n2: number; // Driven gear teeth
  angle1: number;
  onAngle1Change?: (angle: number) => void;
  onN2Change?: (n2: number) => void;
}

// Generate realistic gear SVG path with teeth
function generateGearPath(teethCount: number, pitchRadius: number): string {
  const toothDepth = 9;
  const rootRadius = pitchRadius - toothDepth * 0.5;
  const tipRadius = pitchRadius + toothDepth * 0.5;
  const points: string[] = [];

  const anglePerTooth = (2 * Math.PI) / teethCount;

  for (let i = 0; i < teethCount; i++) {
    const a0 = i * anglePerTooth;
    const a1 = a0 + anglePerTooth * 0.25;
    const a2 = a0 + anglePerTooth * 0.45;
    const a3 = a0 + anglePerTooth * 0.70;
    const a4 = a0 + anglePerTooth * 0.90;

    // Root -> Flank up -> Tip -> Flank down -> Root
    const p0 = `${(Math.cos(a0) * rootRadius).toFixed(2)},${(Math.sin(a0) * rootRadius).toFixed(2)}`;
    const p1 = `${(Math.cos(a1) * rootRadius).toFixed(2)},${(Math.sin(a1) * rootRadius).toFixed(2)}`;
    const p2 = `${(Math.cos(a2) * tipRadius).toFixed(2)},${(Math.sin(a2) * tipRadius).toFixed(2)}`;
    const p3 = `${(Math.cos(a3) * tipRadius).toFixed(2)},${(Math.sin(a3) * tipRadius).toFixed(2)}`;
    const p4 = `${(Math.cos(a4) * rootRadius).toFixed(2)},${(Math.sin(a4) * rootRadius).toFixed(2)}`;

    if (i === 0) {
      points.push(`M ${p0}`);
    }
    points.push(`L ${p1} L ${p2} L ${p3} L ${p4}`);
  }

  points.push('Z');
  return points.join(' ');
}

export const Gear2DScene: React.FC<Gear2DSceneProps> = ({
  n1,
  n2,
  angle1,
  onAngle1Change,
  onN2Change,
}) => {
  const isDraggingRef = useRef(false);
  const dragCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startPointerAngleRef = useRef(0);
  const startGearAngleRef = useRef(0);

  const state = useMemo(() => calculateGearState({ n1, n2, angle1 }), [n1, n2, angle1]);

  // Center coordinates
  const gear1Center = { x: 170, y: 160 };
  // Gear 2 placed at mesh distance
  const centerDistance = state.pitchRadius1 + state.pitchRadius2;
  const gear2Center = { x: gear1Center.x + centerDistance, y: 160 };

  const gear1Path = useMemo(() => generateGearPath(n1, state.pitchRadius1), [n1, state.pitchRadius1]);
  const gear2Path = useMemo(() => generateGearPath(n2, state.pitchRadius2), [n2, state.pitchRadius2]);

  // Pointer drag on Gear 1
  const handlePointerDown = (e: React.PointerEvent<SVGGElement>) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    isDraggingRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    dragCenterRef.current = { x: cx, y: cy };

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    startPointerAngleRef.current = Math.atan2(dy, dx) * (180 / Math.PI);
    startGearAngleRef.current = angle1;
  };

  const handlePointerMove = (e: React.PointerEvent<SVGGElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragCenterRef.current.x;
    const dy = e.clientY - dragCenterRef.current.y;
    const currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    const delta = currentAngle - startPointerAngleRef.current;
    if (onAngle1Change) {
      onAngle1Change(startGearAngleRef.current + delta);
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="scene-container">
      <div className="scene-card">
        {/* HUD */}
        <div className="scene-hud">
          <div className="hud-metric">
            <span className="hud-label">구동 기어 (Gear 1)</span>
            <span className="hud-value" style={{ color: '#06B6D4' }}>{state.n1}T ({state.angle1.toFixed(0)}°)</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">종동 기어 (Gear 2)</span>
            <span className="hud-value" style={{ color: '#A855F7' }}>{state.n2}T ({state.angle2.toFixed(0)}°)</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">기어비 (감속 / 토크비)</span>
            <span className="hud-value" style={{ color: '#F59E0B' }}>
              {state.gearRatio.toFixed(2)} : 1
            </span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">출력 토크 T₂</span>
            <span className="hud-value" style={{ color: state.outputTorqueNm >= 15 ? '#10B981' : '#38BDF8' }}>
              {state.outputTorqueNm.toFixed(1)} N·m
            </span>
          </div>
        </div>

        {/* 2.5D SVG Gear Train Canvas */}
        <div className="svg-wrapper">
          <svg
            viewBox="0 0 600 320"
            className="gear-svg"
            role="img"
            aria-label="기어 맞물림 및 회전비 시뮬레이션"
          >
            <defs>
              <linearGradient id="gear1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              <linearGradient id="gear2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Mesh Alignment Indicator */}
            <line
              x1={gear1Center.x}
              y1={gear1Center.y}
              x2={gear2Center.x}
              y2={gear2Center.y}
              stroke="#334155"
              strokeDasharray="4 4"
              strokeWidth="1"
            />

            {/* GEAR 1 (Driver Gear - Draggable) */}
            <g
              transform={`translate(${gear1Center.x}, ${gear1Center.y}) rotate(${state.angle1})`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{ cursor: 'grab', touchAction: 'none' }}
            >
              {/* Teeth Path */}
              <path d={gear1Path} fill="url(#gear1Grad)" stroke="#38bdf8" strokeWidth="2" />
              {/* Inner Hole & Hub */}
              <circle cx="0" cy="0" r={state.pitchRadius1 * 0.4} fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="0" cy="0" r="6" fill="#38bdf8" />
              {/* Rotation Handle Indicator spoke */}
              <line x1="0" y1="0" x2={state.pitchRadius1 * 0.75} y2="0" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
              <circle cx={state.pitchRadius1 * 0.75} cy="0" r="5" fill="#f8fafc" />
            </g>

            {/* Gear 1 Label */}
            <text x={gear1Center.x} y={gear1Center.y + state.pitchRadius1 + 25} fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
              구동 기어 (드래그하여 회전)
            </text>

            {/* GEAR 2 (Driven Gear - Auto-Rotated in opposite direction) */}
            <g
              transform={`translate(${gear2Center.x}, ${gear2Center.y}) rotate(${state.angle2})`}
            >
              {/* Teeth Path */}
              <path d={gear2Path} fill="url(#gear2Grad)" stroke="#c084fc" strokeWidth="2" />
              {/* Inner Hole & Hub */}
              <circle cx="0" cy="0" r={state.pitchRadius2 * 0.35} fill="#0f172a" stroke="#c084fc" strokeWidth="2" />
              <circle cx="0" cy="0" r="6" fill="#c084fc" />
              {/* Output marker spoke */}
              <line x1="0" y1="0" x2={state.pitchRadius2 * 0.7} y2="0" stroke="#e9d5ff" strokeWidth="3" strokeLinecap="round" />
              <circle cx={state.pitchRadius2 * 0.7} cy="0" r="5" fill="#e9d5ff" />
            </g>

            {/* Gear 2 Label */}
            <text x={gear2Center.x} y={gear2Center.y + state.pitchRadius2 + 25} fill="#c084fc" fontSize="12" fontWeight="bold" textAnchor="middle">
              종동 기어 (반대 방향 회전)
            </text>

            {/* Rotation Direction Arrow Indicators */}
            <g transform="translate(170, 80)">
              <text x="0" y="0" fill="#38bdf8" fontSize="11" textAnchor="middle">
                ↻ 시계 방향
              </text>
            </g>
            <g transform={`translate(${gear2Center.x}, 80)`}>
              <text x="0" y="0" fill="#c084fc" fontSize="11" textAnchor="middle">
                ↺ 반시계 방향 (반전!)
              </text>
            </g>
          </svg>
        </div>

        {/* Interactive Teeth Selector for N2 if supported */}
        {onN2Change && (
          <div className="gear-selector-bar">
            <span className="selector-label">종동 기어 잇수 (N₂):</span>
            <div className="selector-buttons">
              {[12, 18, 24, 36].map((count) => (
                <button
                  key={count}
                  type="button"
                  className={`selector-btn ${n2 === count ? 'active' : ''}`}
                  onClick={() => onN2Change(count)}
                >
                  {count}T ({count === 12 ? '1:1' : count === 24 ? '2:1 감속' : count === 36 ? '3:1 감속' : '1.5:1'})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
