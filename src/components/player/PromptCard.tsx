import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useLearningEngine } from '../../engine/LearningContext';
import { ParameterSlider } from '../interactive/ParameterSlider';
import { SwitchToggle } from '../interactive/SwitchToggle';
import { TruthTableInput } from '../interactive/TruthTableInput';

export const PromptCard: React.FC = () => {
  const {
    lesson,
    currentStepIndex,
    currentParams,
    updateParam,
    startInteraction,
    endInteraction,
  } = useLearningEngine();

  const [isDetailExpanded, setIsDetailExpanded] = useState(false);

  if (!lesson) return null;
  const step = lesson.steps[currentStepIndex];
  if (!step) return null;

  return (
    <div className="prompt-card">
      <div className="prompt-card-header">
        <div className="prompt-step-badge">
          <Sparkles size={14} className="text-cyan-400" />
          <span>STEP {currentStepIndex + 1} OF {lesson.steps.length}</span>
        </div>
        <h2 className="prompt-title">{step.title}</h2>
      </div>

      {/* Storytelling Narrative Lead */}
      <div className="prompt-story-lead">
        <p>{step.storyLead}</p>
      </div>

      {/* Core Instruction Box */}
      <div className="prompt-instruction-box">
        <div className="instruction-icon">👉</div>
        <div className="instruction-text">{step.prompt}</div>
      </div>

      {/* Expandable Theory Deep-Dive Snippet */}
      {step.detailExplanation && (
        <div className="prompt-detail-section">
          <button
            type="button"
            className="detail-accordion-btn"
            onClick={() => setIsDetailExpanded(!isDetailExpanded)}
          >
            <span>이론 배경 및 동작 메커니즘</span>
            {isDetailExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {isDetailExpanded && (
            <div className="detail-accordion-content">
              {step.detailExplanation.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interactive Controls Section */}
      <div className="prompt-controls-section">
        {step.controls.map((ctrl) => {
          if (ctrl.type === 'slider') {
            const val = currentParams[ctrl.id] ?? ctrl.min ?? 0;
            // Snaps
            const snapPoints = ctrl.id === 'vgs' ? [0.7] : ctrl.id === 'resistance' ? [30.0] : [];
            return (
              <ParameterSlider
                key={ctrl.id}
                id={ctrl.id}
                label={ctrl.label}
                value={val}
                min={ctrl.min ?? 0}
                max={ctrl.max ?? 100}
                step={ctrl.step ?? 0.1}
                unit={ctrl.unit}
                snapPoints={snapPoints}
                onChange={(newVal) => updateParam(ctrl.id, newVal)}
                onPointerDown={startInteraction}
                onPointerUp={endInteraction}
              />
            );
          }

          if (ctrl.type === 'toggle') {
            const checked = Boolean(currentParams[ctrl.id]);
            return (
              <SwitchToggle
                key={ctrl.id}
                id={ctrl.id}
                label={ctrl.label}
                checked={checked}
                onToggle={(newVal) => updateParam(ctrl.id, newVal)}
              />
            );
          }

          if (ctrl.type === 'truthTable') {
            return (
              <TruthTableInput
                key={ctrl.id}
                out0={currentParams.out0 ?? null}
                out1={currentParams.out1 ?? null}
                onChange={(key, val) => updateParam(key, val)}
              />
            );
          }

          if (ctrl.type === 'gearSelector') {
            const selectedN2 = currentParams.n2 ?? 12;
            return (
              <div key={ctrl.id} className="control-group">
                <span className="control-label">{ctrl.label}</span>
                <div className="gear-selector-buttons">
                  {ctrl.options?.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`selector-btn ${selectedN2 === opt.value ? 'active' : ''}`}
                      onClick={() => updateParam('n2', opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
