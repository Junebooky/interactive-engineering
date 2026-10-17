import React from 'react';
import { X, Volume2, Lightbulb } from 'lucide-react';
import { useLearningEngine } from '../../engine/LearningContext';
import { voiceEngine } from '../../lib/voice/webSpeechEngine';
import { sfx } from '../../lib/sound/sfx';

export const TutorPanel: React.FC = () => {
  const {
    lesson,
    currentStepIndex,
    activeHintLevel,
    openHint,
    closeHint,
  } = useLearningEngine();

  if (!lesson) return null;
  const step = lesson.steps[currentStepIndex];
  if (!step) return null;

  const handleSpeakHint = (text: string) => {
    sfx.playClick();
    voiceEngine.speak(text, { force: true });
  };

  return (
    <aside className="tutor-panel" aria-label="단계별 힌트 및 튜터 패널">
      <div className="tutor-header">
        <div className="tutor-persona">
          <div className="tutor-avatar">🤖</div>
          <div className="tutor-info">
            <span className="tutor-name">공학 튜터 가이드</span>
            <span className="tutor-status">실시간 상황별 힌트 제공 중</span>
          </div>
        </div>

        <button
          type="button"
          className="tutor-close-btn"
          onClick={closeHint}
          title="도움말 패널 닫기 (중앙 집중 화면으로 복귀)"
        >
          <X size={18} />
        </button>
      </div>

      <div className="tutor-body">
        <div className="tutor-intro-bubble">
          안녕하세요! {step.title}에서 막히셨나요? 단계별 질문을 통해 정답에 도달하도록 도와드릴게요.
        </div>

        {/* Tiered Scaffolding Hints */}
        <div className="hints-list">
          {step.hints && step.hints.length > 0 ? (
            step.hints.map((hint) => {
              const isUnlocked = activeHintLevel >= hint.level;
              return (
                <div
                  key={hint.level}
                  className={`hint-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="hint-card-header">
                    <div className="hint-level-badge">
                      <Lightbulb size={14} />
                      <span>힌트 {hint.level}단계</span>
                    </div>
                    {isUnlocked && hint.voiceLine && (
                      <button
                        type="button"
                        className="hint-voice-btn"
                        onClick={() => handleSpeakHint(hint.voiceLine!)}
                        title="음성으로 듣기"
                      >
                        <Volume2 size={15} />
                        <span>듣기</span>
                      </button>
                    )}
                  </div>

                  <div className="hint-title">{hint.title}</div>

                  {isUnlocked ? (
                    <div className="hint-content">
                      <p>{hint.description}</p>
                    </div>
                  ) : (
                    <div className="hint-locked-row">
                      <span>더 자세한 힌트가 필요하신가요?</span>
                      <button
                        type="button"
                        className="unlock-hint-btn"
                        onClick={() => openHint(hint.level)}
                      >
                        힌트 열기
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="hint-card unlocked">
              <div className="hint-title">개념 설명 단계</div>
              <div className="hint-content">
                <p>본 단계는 핵심 공학 개념을 학습하는 설명형 단계입니다. 본문의 원리 설명을 차근차근 읽어보세요.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
