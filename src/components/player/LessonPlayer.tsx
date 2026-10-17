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

  // Render the appropriate 2.5D simulator scene
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
        </section>
      </div>

      {/* Action Bottom Bar */}
      <ActionBottomBar />

      {/* Deep-Dive Why Modal */}
      <WhyModal />
    </main>
  );
};
