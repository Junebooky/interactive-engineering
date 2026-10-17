import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, HelpCircle, Layers, Settings2 } from 'lucide-react';
import { useLearningEngine } from '../../engine/LearningContext';
import { voiceEngine } from '../../lib/voice/webSpeechEngine';
import { sfx } from '../../lib/sound/sfx';
import { VoiceSettingsModal } from './VoiceSettingsModal';

interface HeaderProps {
  onOpenCatalog: () => void;
  onToggleQALab?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCatalog, onToggleQALab }) => {
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
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);

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

  const isImmersion = Boolean(lesson);
  const totalSteps = lesson.steps.length;
  const currentStepNum = currentStepIndex + 1;

  if (isImmersion) {
    return (
      <header className="a03-top" aria-label="학습 상단 내비게이션">
        <button
          type="button"
          className="a03-back"
          onClick={onOpenCatalog}
          title="강좌 및 레슨 목록 열기"
          aria-label="실험 나가기"
        >
          <span className="arrow">←</span> 나가기
        </button>

        <div
          className="a03-nav-progress"
          aria-label={`${lesson.title} ${totalSteps}개의 실험 중 ${currentStepNum}번째`}
        >
          <div
            className="a03-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={totalSteps}
            aria-valuenow={currentStepNum}
            aria-label="실험 단계 진행"
          >
            <div style={{ width: `${(currentStepNum / totalSteps) * 100}%` }} />
          </div>
          <span className="a03-fraction">{currentStepNum} / {totalSteps}</span>
        </div>

        <div className="a03-top-right">
          <button
            type="button"
            className={`voice-toggle-btn ${voiceEnabled ? 'enabled' : 'disabled'} ${isSpeaking ? 'speaking' : ''}`}
            onClick={handleVoiceToggle}
            title={voiceEnabled ? '한국어 음성 튜터 켜짐' : '한국어 음성 튜터 꺼짐'}
            aria-label="음성 튜터 토글"
            style={{ padding: '6px 10px', fontSize: '11px', borderRadius: '8px' }}
          >
            {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="voice-btn-label" style={{ fontSize: '11px' }}>
              {isSpeaking ? '설명 중' : voiceEnabled ? 'Voice' : 'Mute'}
            </span>
          </button>

          <button
            type="button"
            className="voice-settings-btn"
            onClick={() => {
              sfx.playClick();
              setIsVoiceSettingsOpen(true);
            }}
            title="음성 설정"
            aria-label="음성 설정"
            style={{ padding: '6px 8px', borderRadius: '8px' }}
          >
            <Settings2 size={16} />
          </button>

          <div className="a03-top-side">{lesson.category.toUpperCase()}</div>
        </div>

        <VoiceSettingsModal
          isOpen={isVoiceSettingsOpen}
          onClose={() => setIsVoiceSettingsOpen(false)}
        />
      </header>
    );
  }

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
        {onToggleQALab && (
          <button
            type="button"
            className="qa-lab-toggle-btn"
            onClick={onToggleQALab}
            title="A05 MOSFET 2.5D Discovery Lab 독립 프리뷰 열기"
          >
            <span>🧪 QA Lab</span>
          </button>
        )}

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

        {/* Voice Settings Button (Issue #41) */}
        <button
          type="button"
          className="voice-settings-btn"
          onClick={() => {
            sfx.playClick();
            setIsVoiceSettingsOpen(true);
          }}
          title="한국어 음성 선택 및 배속 설정"
          aria-label="음성 선택 및 배속 설정"
        >
          <Settings2 size={17} />
          <span className="voice-settings-label">음성 설정</span>
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

      <VoiceSettingsModal
        isOpen={isVoiceSettingsOpen}
        onClose={() => setIsVoiceSettingsOpen(false)}
      />
    </header>
  );
};
