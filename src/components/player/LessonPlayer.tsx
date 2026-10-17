import React from 'react';
import { useLearningEngine } from '../../engine/LearningContext';
import { PromptCard } from './PromptCard';
import { TutorPanel } from './TutorPanel';
import { WhyModal } from './WhyModal';
import { CompletionCard } from './CompletionCard';
import { ActionBottomBar } from '../common/ActionBottomBar';
import { Mosfet2DScene } from '../../simulations/mosfet/Mosfet2DScene';
import { InverterCircuit2D } from '../../simulations/mosfet/InverterCircuit2D';
import { Circuit2DScene } from '../../simulations/ohmsLaw/Circuit2DScene';
import { Gear2DScene } from '../../simulations/gears/Gear2DScene';
import { BookOpen, Sparkles } from 'lucide-react';

interface LessonPlayerProps {
  onOpenCatalog: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ onOpenCatalog }) => {
  const {
    lesson,
    currentStepIndex,
    currentParams,
    updateParam,
    fsmState,
    isHelpOpen,
  } = useLearningEngine();

  if (!lesson) {
    return (
      <div className="empty-player">
        <p>선택된 레슨이 없습니다. 상단에서 강좌를 선택하세요.</p>
      </div>
    );
  }

  // If lesson is finished, show completion screen
  if (fsmState === 'LESSON_FINISHED') {
    return (
      <main className="player-viewport">
        <div className="player-centered-container">
          <CompletionCard onOpenCatalog={onOpenCatalog} />
        </div>
      </main>
    );
  }

  const currentStep = lesson.steps[currentStepIndex];
  if (!currentStep) return null;

  const hasSimulator = Boolean(currentStep.simulatorType);

  // Render the appropriate 2.5D simulator scene if one is specified
  const renderSimulator = () => {
    switch (currentStep.simulatorType) {
      case 'mosfet':
        return (
          <Mosfet2DScene
            vgs={currentParams.vgs ?? 0}
            vds={currentParams.vds ?? 0}
            onParamChange={(key, val) => updateParam(key, val)}
            showIVCurve={true}
          />
        );

      case 'inverter':
        return (
          <InverterCircuit2D
            vin={currentParams.vin ?? 0}
            onVinChange={(val) => updateParam('vin', val)}
            showTruthTableHint={true}
          />
        );

      case 'ohmsLaw':
        return (
          <Circuit2DScene
            voltage={currentParams.voltage ?? 12}
            resistance={currentParams.resistance ?? 40}
            switchClosed={Boolean(currentParams.switchClosed)}
            onSwitchToggle={() => updateParam('switchClosed', !currentParams.switchClosed)}
          />
        );

      case 'gears':
        return (
          <Gear2DScene
            n1={currentParams.n1 ?? 12}
            n2={currentParams.n2 ?? 12}
            angle1={currentParams.angle1 ?? 0}
            onAngle1Change={(val) => updateParam('angle1', val)}
            onN2Change={(val) => updateParam('n2', val)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <main className="player-viewport">
      {/* 
        Layout Architecture:
        - When isHelpOpen is false: Centered focused immersion card + canvas
        - When isHelpOpen is true: Split mode (Tutor on Left / Canvas on Right on Desktop)
      */}
      <div className={`player-workspace ${isHelpOpen ? 'mode-split-help' : 'mode-focused'}`}>
        {/* If Help is open, show TutorPanel on left */}
        {isHelpOpen && <TutorPanel />}

        {/* Central or Right Stage */}
        <section className="stage-area" aria-label="인터랙티브 실습 영역">
          {hasSimulator ? (
            <div className="stage-grid">
              {/* Prompt & Storytelling Card */}
              <div className="stage-prompt-col">
                <PromptCard />
              </div>

              {/* 2.5D Interactive Simulator Canvas */}
              <div className="stage-canvas-col">
                {renderSimulator()}
              </div>
            </div>
          ) : (
            /* Explanatory / Concept Step Layout (No simulator required) */
            <div className="stage-concept-grid">
              <div className="stage-concept-main">
                <PromptCard />
              </div>
              <div className="stage-concept-visual">
                <div className="concept-info-card">
                  <div className="concept-info-icon">
                    <Sparkles className="text-cyan-400" size={32} />
                  </div>
                  <h3 className="concept-info-title">핵심 공학 개념</h3>
                  <p className="concept-info-desc">
                    {currentStep.prompt}
                  </p>
                  <div className="concept-info-footer">
                    <BookOpen size={16} className="text-slate-400" />
                    <span>개념을 숙지한 후 하단의 확인 버튼을 눌러 다음 단계로 진행하세요.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Action Bottom Bar */}
      <ActionBottomBar />

      {/* Deep-Dive Why Modal */}
      <WhyModal />
    </main>
  );
};
