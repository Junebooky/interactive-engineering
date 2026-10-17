import React from 'react';
import { sfx } from '../../lib/sound/sfx';

interface TruthTableInputProps {
  out0: number | null; // Output logic for Vin = 0
  out1: number | null; // Output logic for Vin = 1
  onChange: (key: 'out0' | 'out1', val: number) => void;
}

export const TruthTableInput: React.FC<TruthTableInputProps> = ({
  out0,
  out1,
  onChange,
}) => {
  const handleSelect = (key: 'out0' | 'out1', val: number) => {
    sfx.playClick();
    onChange(key, val);
  };

  return (
    <div className="truth-table-container">
      <div className="truth-table-title">인버터(NOT 게이트) 진리표 완성하기</div>
      <table className="truth-table">
        <thead>
          <tr>
            <th>입력 (V_in)</th>
            <th>nMOS 상태</th>
            <th>출력 논리 (V_out)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-mono font-bold text-slate-300">0 (LOW / 0V)</td>
            <td className="text-slate-400">OFF (차단)</td>
            <td>
              <div className="choice-btn-group">
                <button
                  type="button"
                  className={`choice-btn ${out0 === 0 ? 'selected' : ''}`}
                  onClick={() => handleSelect('out0', 0)}
                >
                  0 (LOW)
                </button>
                <button
                  type="button"
                  className={`choice-btn ${out0 === 1 ? 'selected' : ''}`}
                  onClick={() => handleSelect('out0', 1)}
                >
                  1 (HIGH)
                </button>
              </div>
            </td>
          </tr>
          <tr>
            <td className="font-mono font-bold text-slate-300">1 (HIGH / 5V)</td>
            <td className="text-slate-400">ON (접지 풀다운)</td>
            <td>
              <div className="choice-btn-group">
                <button
                  type="button"
                  className={`choice-btn ${out1 === 0 ? 'selected' : ''}`}
                  onClick={() => handleSelect('out1', 0)}
                >
                  0 (LOW)
                </button>
                <button
                  type="button"
                  className={`choice-btn ${out1 === 1 ? 'selected' : ''}`}
                  onClick={() => handleSelect('out1', 1)}
                >
                  1 (HIGH)
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
