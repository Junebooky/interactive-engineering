import React from 'react';
import { sfx } from '../../lib/sound/sfx';

interface SwitchToggleProps {
  id: string;
  label: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  onText?: string;
  offText?: string;
}

export const SwitchToggle: React.FC<SwitchToggleProps> = ({
  id,
  label,
  checked,
  onToggle,
  onText = '닫힘 (ON)',
  offText = '열림 (OFF)',
}) => {
  const handleClick = () => {
    sfx.playClick();
    onToggle(!checked);
  };

  return (
    <div className="switch-container" id={`control-${id}`}>
      <span className="switch-label">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleClick}
        className={`switch-button ${checked ? 'switch-on' : 'switch-off'}`}
      >
        <span className="switch-thumb" />
        <span className="switch-text">{checked ? onText : offText}</span>
      </button>
    </div>
  );
};
