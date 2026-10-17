import React from 'react';
import { CheckCircle, RotateCcw, ArrowRight, Layers } from 'lucide-react';
import { useLearningEngine } from '../../engine/LearningContext';
import { sfx } from '../../lib/sound/sfx';

interface CompletionCardProps {
  onOpenCatalog: () => void;
}

export const CompletionCard: React.FC<CompletionCardProps> = ({ onOpenCatalog }) => {
  const { lesson, resetCurrentStep, gotoStep } = useLearningEngine();

  if (!lesson) return null;

  const handleRestart = () => {
    sfx.playClick();
    gotoStep(0);
    resetCurrentStep();
  };

  return (
    <div className="completion-card">
      <div className="completion-icon-wrapper">
        <CheckCircle className="completion-check-icon" size={56} />
      </div>

      <h2 className="completion-title">레슨 완주를 축하합니다!</h2>
      <p className="completion-subtitle">{lesson.title}</p>

      <div className="completion-summary-box">
        <h3 className="summary-box-title">이번 레슨에서 완주한 공학 원리</h3>
        <ul className="milestone-list">
          {lesson.steps.map((step, idx) => (
            <li key={step.id} className="milestone-item">
              <CheckCircle size={16} className="text-emerald-400" />
              <span>
                <strong>{idx + 1}단계:</strong> {step.title.replace(/^\d+단계:\s*/, '')}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="completion-actions">
        <button
          type="button"
          className="completion-btn btn-secondary"
          onClick={handleRestart}
        >
          <RotateCcw size={18} />
          <span>처음부터 다시 실습하기</span>
        </button>

        <button
          type="button"
          className="completion-btn btn-primary"
          onClick={onOpenCatalog}
        >
          <Layers size={18} />
          <span>다른 공학 강좌 선택하기</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
