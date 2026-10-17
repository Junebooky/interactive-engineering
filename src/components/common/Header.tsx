import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, HelpCircle, Layers } from 'lucide-react';
import { useLearningEngine } from '../../engine/LearningContext';
import { voiceEngine } from '../../lib/voice/webSpeechEngine';
import { sfx } from '../../lib/sound/sfx';

interface HeaderProps {
  onOpenCatalog: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCatalog }) => {
  const {
    lesson,
    currentStepIndex,
    completedStepIds,
    gotoStep,
    isHelpOpen,
    openHint,
    closeHint,
  } = useLearningEngine();

  const [voiceEnabled, setVoiceEnabled] = useState(voiceEngine.getEnabled());
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return voiceEngine.subscribe((state) => {
      setVoiceEnabled(state.enabled);
      setIsSpeaking(state.isSpeaking);
    });
  }, []);

  const handleVoiceToggle = () => {
    sfx.playClick();
    const next = !voiceEnabled;
    voiceEngine.setEnabled(next);
    if (next && lesson) {
      const step = lesson.steps[currentStepIndex];
      if (step?.voice?.intro) {
        voiceEngine.speak(step.voice.intro);
      }
    }
  };

  const handleHelpToggle = () => {
    sfx.playClick();
    if (isHelpOpen) {
      closeHint();
    } else {
      openHint(1);
    }
  };

  if (!lesson) return null;

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="catalog-btn"
          onClick={onOpenCatalog}
          title="강좌 및 레슨 목록 열기"
        >
          <Layers size={18} />
          <span className="catalog-text">강좌 선택</span>
        </button>

        <div className="lesson-breadcrumb">
          <span className="course-tag">{lesson.category.toUpperCase()}</span>
          <span className="lesson-title-text">{lesson.title}</span>
        </div>
      </div>

      {/* Step Progress Dots */}
      <div className="header-center">
        <div className="step-dots" role="tablist" aria-label="레슨 진행 단계">
          {lesson.steps.map((step, idx) => {
            const isCompleted = completedStepIds.includes(step.id);
            const isCurrent = idx === currentStepIndex;

            return (
              <button
                key={step.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                className={`step-dot ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => gotoStep(idx)}
                title={`${idx + 1}단계: ${step.title} ${isCompleted ? '(완료됨)' : ''}`}
              >
                <span className="dot-inner">{idx + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio & Help Controls */}
      <div className="header-right">
        {/* Voice Tutor Button */}
        <button
          type="button"
          className={`voice-toggle-btn ${voiceEnabled ? 'enabled' : 'disabled'} ${isSpeaking ? 'speaking' : ''}`}
          onClick={handleVoiceToggle}
          title={voiceEnabled ? '한국어 음성 튜터 켜짐 (클릭 시 음소거)' : '한국어 음성 튜터 꺼짐 (클릭 시 켜기)'}
          aria-label="음성 튜터 토글"
        >
          {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <span className="voice-btn-label">
            {isSpeaking ? '설명 중...' : voiceEnabled ? 'Voice 켜짐' : 'Voice 꺼짐'}
          </span>
        </button>

        {/* Contextual Help Button */}
        <button
          type="button"
          className={`help-toggle-btn ${isHelpOpen ? 'active' : ''}`}
          onClick={handleHelpToggle}
          title="단계별 힌트 및 튜터 대화 열기"
        >
          <HelpCircle size={18} />
          <span className="help-btn-label">도움말</span>
        </button>
      </div>
    </header>
  );
};
