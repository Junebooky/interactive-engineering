import React, { useRef } from 'react';
import { sfx } from '../../lib/sound/sfx';

interface ParameterSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  snapPoints?: number[];
  onChange: (val: number) => void;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
}

export const ParameterSlider: React.FC<ParameterSliderProps> = ({
  id,
  label,
  value,
  min,
  max,
  step = 0.1,
  unit = '',
  snapPoints = [],
  onChange,
  onPointerDown,
  onPointerUp,
}) => {
  const lastSnapRef = useRef<number | null>(null);

  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let nextVal = parseFloat(e.target.value);

    // Magnetic snap checking
    for (const snap of snapPoints) {
      if (Math.abs(nextVal - snap) < step * 0.75) {
        nextVal = snap;
        if (lastSnapRef.current !== snap) {
          sfx.playSnap();
          lastSnapRef.current = snap;
        }
        break;
      }
    }

    if (lastSnapRef.current && Math.abs(nextVal - lastSnapRef.current) >= step * 1.5) {
      lastSnapRef.current = null;
    }

    onChange(nextVal);
  };

  return (
    <div className="slider-container" id={`control-${id}`}>
      <div className="slider-header">
        <label htmlFor={id} className="slider-label">
          {label}
        </label>
        <span className="slider-value-badge">
          {value.toFixed(step < 0.1 ? 2 : 1)} {unit}
        </span>
      </div>

      <div className="slider-track-wrapper">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          className="custom-range-slider"
          style={{
            background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${percentage}%, #1e293b ${percentage}%, #1e293b 100%)`,
          }}
        />

        {/* Snap Tick Marks */}
        {snapPoints.map((snap) => {
          const snapPercent = ((snap - min) / (max - min)) * 100;
          return (
            <div
              key={snap}
              className="snap-tick"
              style={{ left: `${snapPercent}%` }}
              title={`기준점 ${snap}${unit}`}
            >
              <span className="snap-tick-label">{snap}{unit}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
