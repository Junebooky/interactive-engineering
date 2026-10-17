import React from 'react';
import { Check, ArrowRight, RotateCcw, Lightbulb, Info } from 'lucide-react';
import { useLearningEngine } from '../../engine/LearningContext';

export const ActionBottomBar: React.FC = () => {
  const {
    fsmState,
    submitCheck,
    retry,
    nextStep,
    openHint,
    openWhyModal,
    resetCurrentStep,
    isDirty,
    evaluation,
  } = useLearningEngine();

  const isCorrect = fsmState === 'EVALUATED_CORRECT';
  const isIncorrect = fsmState === 'EVALUATED_INCORRECT';
  const isEvaluating = fsmState === 'EVALUATING';

  return (
    <nav className={`action-bottom-bar ${isCorrect ? 'bar-correct' : ''} ${isIncorrect ? 'bar-incorrect' : ''}`} aria-label="학습 액션 컨트롤">
      <div className="bottom-bar-content">
        {/* Left Secondary Actions */}
        <div className="bar-left-group">
          <button
            type="button"
            className="bar-text-btn"
            onClick={() => openHint()}
            title="단계별 힌트 열기"
          >
            <Lightbulb size={17} />
            <span>힌트 보기</span>
          </button>

          <button
            type="button"
            className="bar-text-btn"
            onClick={resetCurrentStep}
            title="이 단계 파라미터 초기화"
          >
            <RotateCcw size={16} />
            <span>초기화</span>
          </button>

          <button
            type="button"
            className="bar-text-btn"
            onClick={openWhyModal}
            title="심층 물리/공학 원리 해설 보기"
          >
            <Info size={16} />
            <span>Why? 원리</span>
          </button>
        </div>

        {/* Center Feedback Text when evaluated */}
        {evaluation && (
          <div className="bar-center-feedback">
            <span className={`feedback-inline ${isCorrect ? 'text-correct' : 'text-incorrect'}`}>
              {evaluation.message}
            </span>
          </div>
        )}

        {/* Right Primary Action Button */}
        <div className="bar-right-group">
          {isCorrect ? (
            <button
              type="button"
              className="primary-btn btn-continue"
              onClick={nextStep}
            >
              <span>계속하기 (Continue)</span>
              <ArrowRight size={18} />
            </button>
          ) : isIncorrect ? (
            <button
              type="button"
              className="primary-btn btn-retry"
              onClick={retry}
            >
              <RotateCcw size={17} />
              <span>다시 시도 (Try Again)</span>
            </button>
          ) : (
            <button
              type="button"
              className={`primary-btn btn-check ${isDirty ? 'pulse' : ''}`}
              disabled={isEvaluating}
              onClick={submitCheck}
            >
              {isEvaluating ? (
                <span className="spinner" />
              ) : (
                <>
                  <Check size={18} />
                  <span>확인하기 (Check)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
