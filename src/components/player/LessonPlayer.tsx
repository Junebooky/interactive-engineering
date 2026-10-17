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
import { A05SceneVisual } from '../../a05/A05SceneVisual';
import { DramSceneVisual, type DramVisualState } from '../../a05/dram/DramSceneVisual';
import { SramSceneVisual, type SramVisualState } from '../../a05/sram/SramSceneVisual';
import { GpuSceneVisual, type GpuVisualState } from '../../a05/gpu/GpuSceneVisual';
import type { GpuSceneId } from '../../a05/gpu/gpuModel';
import { ElectricitySceneVisual, type ElectricityVisualState } from '../../a05/electricity/ElectricitySceneVisual';
import type { ElecSceneId } from '../../a05/electricity/electricityModel';
import { PnSceneVisual, type PnVisualState } from '../../a05/pn/PnSceneVisual';
import type { BandMaterial, BiasV, DiodeBiasV, Dopant, GateComparison, JunctionPhase, PnSceneId } from '../../a05/pn/pnModel';
import { Mos14SceneVisual } from '../../a05/mos14/Mos14SceneVisual';
import type { Mos14Bias, Mos14Device, Mos14Oxide, Mos14Phase, Mos14SceneId, Mos14State, Mos14Vds } from '../../a05/mos14/mos14Model';
import { Nand04SceneVisual } from '../../a05/nand04/Nand04SceneVisual';
import type { Nand04SceneId, Nand04State } from '../../a05/nand04/nand04Model';
import type { A05Values } from '../../a05/scenePhysics';
import '../../a05/dram/dramScenes.css';
import '../../a05/sram/sramScenes.css';
import '../../a05/gpu/gpuScenes.css';
import '../../a05/electricity/electricityScenes.css';
import '../../a05/pn/pnScenes.css';
import '../../a05/mos14/mos14.css';
import '../../a05/nand04/nand04.css';
import '../../a05/a05Scenes.css';
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
      case 'mosfet-field':
      case 'mosfet-current':
      case 'nmos-resistor-inverter':
      case 'cmos-not-gate': {
        const a05Values: A05Values = {
          vgs: Number(currentParams.vgs ?? (currentStep.simulatorType === 'mosfet-current' ? 1.5 : 0)),
          vds: Number(currentParams.vds ?? 0),
          vin: Number(currentParams.vin ?? 0),
          out0: currentParams.out0 === 0 || currentParams.out0 === 1 ? currentParams.out0 : null,
          out1: currentParams.out1 === 0 || currentParams.out1 === 1 ? currentParams.out1 : null,
        };
        const hasPredictionCtrl = currentStep.controls?.some((c) => c.id === 'prediction');
        const showObservation =
          !hasPredictionCtrl ||
          (currentParams.prediction !== undefined && currentParams.prediction !== null);

        return (
          <A05SceneVisual
            sceneId={currentStep.simulatorType}
            values={a05Values}
            showObservation={showObservation}
          />
        );
      }

      case 'dram-write':
      case 'dram-sense-restore':
      case 'dram-leak-refresh':
      case 'dram-row-bank': {
        const dramState: DramVisualState = {
          wl: (currentParams.wl ?? 0) as 0 | 1,
          bl: (currentParams.bl ?? 1) as 0 | 1,
          cell: (currentParams.cell ?? 0) as 0 | 1,
          bit: (currentParams.bit ?? 1) as 0 | 1,
          phase: (currentParams.phase ?? 'precharge') as any,
          elapsed: Number(currentParams.elapsed ?? 0),
          refreshAt: currentParams.refreshAt !== undefined && currentParams.refreshAt !== null ? Number(currentParams.refreshAt) : null,
          banks: Number(currentParams.banks ?? 1) as 1 | 2,
        };
        const hasPredictionCtrl = currentStep.controls?.some((c) => c.id === 'prediction');
        const showObservation =
          !hasPredictionCtrl ||
          (currentParams.prediction !== undefined && currentParams.prediction !== null);

        return (
          <DramSceneVisual
            sceneId={currentStep.simulatorType}
            state={dramState}
            revealed={showObservation}
          />
        );
      }

      case 'sram-cross-coupled-inverters':
      case 'sram-6t-access':
      case 'cpu-cache-vs-dram':
      case 'cpu-to-gpu-data-locality': {
        const sramState: SramVisualState = {
          q: (currentParams.q ?? 1) as 0 | 1,
          feedback: Boolean(currentParams.feedback ?? true),
          supply: Boolean(currentParams.supply ?? true),
          wl: (currentParams.wl ?? 0) as 0 | 1,
          bl: (currentParams.bl ?? 1) as 0 | 1,
          mode: (currentParams.mode ?? 'write') as any,
          cacheLines: (currentParams.cacheLines ?? 1) as 1 | 2,
          cacheRan: Boolean(currentParams.cacheRan ?? false),
          resident: Boolean(currentParams.resident ?? false),
          inputCount: Number(currentParams.inputCount ?? 1),
        };
        const hasPredictionCtrl = currentStep.controls?.some((c) => c.id === 'prediction');
        const showObservation =
          !hasPredictionCtrl ||
          (currentParams.prediction !== undefined && currentParams.prediction !== null);

        return (
          <SramSceneVisual
            sceneId={currentStep.simulatorType}
            state={sramState}
            revealed={showObservation}
          />
        );
      }

      case 'gpu-compute-feeding':
      case 'gpu-memory-family-roles':
      case 'gpu-gddr-width-rate':
      case 'gpu-hbm-tradeoffs': {
        const gpuState: GpuVisualState = {
          compute: (Number(currentParams.compute) || 16) as 16 | 32,
          feed: (Number(currentParams.feed) || 8) as 8 | 16 | 32,
          family: (currentParams.family ?? 'DDR/RDIMM') as any,
          site: (currentParams.site ?? 'cpu-dimm') as any,
          pinRate: (Number(currentParams.pinRate) || 24) as 24 | 32,
          signal: (currentParams.signal ?? 'NRZ') as any,
          topology: (currentParams.topology ?? 'gddr-board') as any,
          showConstraints: Boolean(currentParams.showConstraints ?? false),
        };
        const hasPredictionCtrl = currentStep.controls?.some((c) => c.id === 'prediction');
        const showObservation =
          !hasPredictionCtrl ||
          (currentParams.prediction !== undefined && currentParams.prediction !== null);

        const sceneIdMap: Record<string, GpuSceneId> = {
          'gpu-compute-feeding': 'compute-feeding',
          'gpu-memory-family-roles': 'memory-family-roles',
          'gpu-gddr-width-rate': 'gddr-width-rate',
          'gpu-hbm-tradeoffs': 'hbm-tradeoffs',
        };

        const sceneId = sceneIdMap[currentStep.simulatorType] ?? 'compute-feeding';

        return (
          <GpuSceneVisual
            sceneId={sceneId}
            state={gpuState}
            revealed={showObservation}
          />
        );
      }

      case 'elec-charge-current':
      case 'elec-resistor-kcl':
      case 'elec-rc-delay':
      case 'elec-power-energy': {
        const elecState: ElectricityVisualState = {
          volts: (currentParams.volts ?? 5) as 0 | 5,
          closed: Boolean(currentParams.closed),
          direction: currentParams.direction ?? 'conventional',
          topology: currentParams.topology ?? 'series',
          mode: currentParams.mode ?? 'charge',
          rOhms: currentParams.rOhms ?? 1000,
          cMicroFarads: currentParams.cMicroFarads ?? 10,
          timeMs: currentParams.timeMs ?? 0,
          rcInitialVoltageV: currentParams.rcInitialVoltageV ?? 0,
          rcSegmentStartMs: currentParams.rcSegmentStartMs ?? 0,
          powerVolts: (currentParams.powerVolts ?? 5) as 5 | 10,
          loadMilliAmps: (currentParams.loadMilliAmps ?? 10) as 5 | 10,
          seconds: (currentParams.seconds ?? 10) as 1 | 10,
        };
        const hasPredictionCtrl = currentStep.controls?.some((c) => c.id === 'prediction');
        const showObservation =
          !hasPredictionCtrl ||
          (currentParams.prediction !== undefined && currentParams.prediction !== null);

        const sceneIdMap: Record<string, ElecSceneId> = {
          'elec-charge-current': 'charge-voltage-current-arrows',
          'elec-resistor-kcl': 'resistors-series-parallel-kcl',
          'elec-rc-delay': 'capacitor-rc-charge-discharge',
          'elec-power-energy': 'power-energy-joules-heat',
        };

        const sceneId = sceneIdMap[currentStep.simulatorType] ?? 'charge-voltage-current-arrows';

        return (
          <ElectricitySceneVisual
            sceneId={sceneId}
            state={elecState}
            revealed={showObservation}
          />
        );
      }

      case 'pn-band-gap':
      case 'pn-doping':
      case 'pn-equilibrium':
      case 'pn-depletion-bias':
      case 'pn-diode-to-mos': {
        const pnState: PnVisualState = {
          material: (currentParams.material ?? 'silicon') as BandMaterial,
          light: Boolean(currentParams.light ?? false),
          warm: Boolean(currentParams.warm ?? false),
          dopant: (currentParams.dopant ?? 'intrinsic') as Dopant,
          phase: (currentParams.phase ?? 'separate') as JunctionPhase,
          bias: (currentParams.bias !== undefined ? Number(currentParams.bias) : 0) as BiasV,
          na: Number(currentParams.na) || 1e16,
          nd: Number(currentParams.nd) || 1e16,
          diodeBias: (currentParams.diodeBias !== undefined ? Number(currentParams.diodeBias) : 0) as DiodeBiasV,
          gate: (currentParams.gate ?? 'pn') as GateComparison,
        };
        const hasPredictionCtrl = currentStep.controls?.some((c) => c.id === 'prediction');
        const showObservation =
          !hasPredictionCtrl ||
          (currentParams.prediction !== undefined && currentParams.prediction !== null);

        const sceneIdMap: Record<string, PnSceneId> = {
          'pn-band-gap': 'semiconductor-band-gap',
          'pn-doping': 'silicon-donor-acceptor-doping',
          'pn-equilibrium': 'pn-diffusion-drift-equilibrium',
          'pn-depletion-bias': 'pn-bias-depletion-calculator',
          'pn-diode-to-mos': 'pn-diode-current-to-mos',
        };

        const sceneId = sceneIdMap[currentStep.simulatorType] ?? 'semiconductor-band-gap';

        return (
          <PnSceneVisual
            sceneId={sceneId}
            state={pnState}
            revealed={showObservation}
          />
        );
      }

      case 'mos14-oxide-field':
      case 'mos14-accumulation-inversion':
      case 'mos14-capacitance-cv':
      case 'mos14-cap-to-nmosfet': {
        const defaultGateV = currentStep.simulatorType === 'mos14-cap-to-nmosfet' ? 1.1 : 0;
        const mos14State: Mos14State = {
          gateV: (currentParams.gateV !== undefined ? Number(currentParams.gateV) : defaultGateV) as Mos14Bias,
          oxideNm: (currentParams.oxideNm !== undefined ? Number(currentParams.oxideNm) : 5) as Mos14Oxide,
          phase: (currentParams.phase ?? 'steady') as Mos14Phase,
          device: (currentParams.device ?? 'capacitor') as Mos14Device,
          vds: (currentParams.vds !== undefined ? Number(currentParams.vds) : 0) as Mos14Vds,
          showCv: Boolean(currentParams.showCv ?? false),
        };
        const hasPredictionCtrl = currentStep.controls?.some((c) => c.id === 'prediction');
        const showObservation =
          !hasPredictionCtrl ||
          (currentParams.prediction !== undefined && currentParams.prediction !== null);

        const sceneIdMap: Record<string, Mos14SceneId> = {
          'mos14-oxide-field': 'mos-oxide-field-without-dc-path',
          'mos14-accumulation-inversion': 'mos-accumulation-depletion-inversion',
          'mos14-capacitance-cv': 'mos-oxide-capacitance-cv',
          'mos14-cap-to-nmosfet': 'mos-cap-to-nmosfet-bridge',
        };

        const sceneId = sceneIdMap[currentStep.simulatorType] ?? 'mos-oxide-field-without-dc-path';

        return (
          <Mos14SceneVisual
            sceneId={sceneId}
            state={mos14State}
            revealed={showObservation}
          />
        );
      }

      case 'nand-threshold':
      case 'nand-page-block':
      case 'ssd-ftl-reliability':
      case 'nvme-transfer':
      case 'ai-datacenter-pipeline': {
        const nand04State: Nand04State = {
          cell: (currentParams.cell ?? 'low') as any,
          readV: (currentParams.readV !== undefined ? Number(currentParams.readV) : 1) as any,
          power: (currentParams.power ?? 'on') as any,
          pageStage: (currentParams.pageStage ?? 'initial') as any,
          writePattern: (currentParams.writePattern ?? 'cold') as any,
          ecc: Boolean(currentParams.ecc ?? false),
          plp: Boolean(currentParams.plp ?? false),
          dramCache: Boolean(currentParams.dramCache ?? false),
          transport: (currentParams.transport ?? 'command') as any,
          ai: (currentParams.ai ?? 'cold-load') as any,
          servers: (currentParams.servers !== undefined ? Number(currentParams.servers) : 1) as any,
        };
        const hasPredictionCtrl = currentStep.controls?.some((c) => c.id === 'prediction');
        const showObservation =
          !hasPredictionCtrl ||
          (currentParams.prediction !== undefined && currentParams.prediction !== null);

        return (
          <Nand04SceneVisual
            sceneId={currentStep.simulatorType as Nand04SceneId}
            state={nand04State}
            revealed={showObservation}
          />
        );
      }

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
