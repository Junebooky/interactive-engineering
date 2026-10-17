import React from 'react';
import { X, Volume2, Atom } from 'lucide-react';
import { useLearningEngine } from '../../engine/LearningContext';
import { voiceEngine } from '../../lib/voice/webSpeechEngine';
import { sfx } from '../../lib/sound/sfx';

export const WhyModal: React.FC = () => {
  const {
    lesson,
    currentStepIndex,
    showWhyModal,
    closeWhyModal,
  } = useLearningEngine();

  if (!showWhyModal || !lesson) return null;
  const step = lesson.steps[currentStepIndex];
  if (!step) return null;

  const handleSpeak = () => {
    sfx.playClick();
    if (step.whyExplanation) {
      voiceEngine.speak(step.whyExplanation, { force: true });
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeWhyModal}>
      <div
        className="modal-card why-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="why-modal-title"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <Atom className="text-cyan-400" size={22} />
            <h3 id="why-modal-title" className="modal-title">
              Why? 심층 공학 원리 해설
            </h3>
          </div>

          <div className="modal-header-actions">
            <button
              type="button"
              className="modal-voice-btn"
              onClick={handleSpeak}
              title="해설 음성으로 듣기"
            >
              <Volume2 size={16} />
              <span>듣기</span>
            </button>
            <button
              type="button"
              className="modal-close-btn"
              onClick={closeWhyModal}
              title="닫기"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          <div className="why-step-badge">{step.title}</div>
          <div className="why-content">
            <p className="why-paragraph">{step.whyExplanation}</p>
          </div>

          <div className="why-footer-note">
            💡 <strong>엔지니어링 인사이트:</strong> 공학 시뮬레이터에서 직접 관찰한 수치와 변화는 실제 산업용 소자 및 기계 시스템 설계의 기본 공식과 동일합니다.
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="modal-confirm-btn"
            onClick={closeWhyModal}
          >
            이해했습니다 (닫기)
          </button>
        </div>
      </div>
    </div>
  );
};
