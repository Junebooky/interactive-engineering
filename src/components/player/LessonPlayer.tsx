import React from 'react';
import { useLearningEngine } from '../../engine/LearningContext';
import { WhyModal } from './WhyModal';
import { CompletionCard } from './CompletionCard';
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
import { A03SingleTaskPanel, type FlowPhase } from './A03SingleTaskPanel';
import { resolveStepVisual } from '../../engine/visualRegistry';
import { A05ConceptStructureVisual as ConceptIntroSceneVisual } from '../../a05/concepts/A05ConceptStructureVisual'; // A05 proposed concept-only scene for A02 integration review
import './lessonA03.css';

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
  } = useLearningEngine();

  const [activePhase, setActivePhase] = React.useState<FlowPhase>('predict');
  const [zoomLevel, setZoomLevel] = React.useState<number>(1);
  const [showModelBubble, setShowModelBubble] = React.useState<boolean>(false);

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

  const visualSpec = resolveStepVisual(lesson.id, currentStep);

  // Render the appropriate 2.5D simulator scene or concept illustration
  const renderSimulator = () => {
    if (visualSpec.mode === 'concept') {
      return (
        <ConceptIntroSceneVisual
          visualId={visualSpec.visualId}
          title={visualSpec.title}
          subtitle={visualSpec.subtitle}
          caption={visualSpec.caption}
        />
      );
    }

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
          (activePhase !== 'predict' && currentParams.prediction !== undefined && currentParams.prediction !== null);

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
        return (
          <ConceptIntroSceneVisual
            visualId={visualSpec.visualId}
            title={visualSpec.title}
            subtitle={visualSpec.subtitle}
            caption={visualSpec.caption}
          />
        );
    }
  };

  const isMosfet =
    lesson.id.includes('mosfet') ||
    currentStep.simulatorType?.startsWith('mosfet') ||
    currentStep.simulatorType === 'nmos-resistor-inverter' ||
    currentStep.simulatorType === 'cmos-not-gate';
  const isElec = lesson.id.includes('electricity') || currentStep.simulatorType?.startsWith('elec-');
  const isElecStep1 = currentStep.id === 'step-elec-s1-ohms-law';

  // Status subtitle and context for 2.5D visual
  const sceneLabel =
    activePhase === 'predict'
      ? (isElec ? '01 · 회로 모형 살펴보기' : '01 · 구조와 원리 살펴보기')
      : activePhase === 'observe'
      ? (isElec ? '02 · 스위치 조작 · 전류 관찰' : '02 · 직접 조작하며 관찰하기')
      : activePhase === 'check'
      ? '03 · 관찰 원리 설명하기'
      : '04 · 핵심 발견 완료';

  let sceneSignal = '';
  if (activePhase !== 'predict') {
    if (isElec) {
      sceneSignal = currentParams.closed
        ? '스위치가 닫혀 1kΩ 저항에 5mA가 흘러요'
        : '스위치가 열려 전류가 0mA이지만 전원 5V는 유지돼요';
    } else if (isMosfet) {
      sceneSignal = (currentParams.vgs ?? 0) >= 0.8
        ? '전자들이 실리콘 표면에 모였어요'
        : (currentParams.vds ?? 0) >= 1.0
        ? '포화 영역에서도 일정한 전류가 유지돼요'
        : '전압을 조작해 변화를 관찰하세요';
    } else if (currentStep.simulatorType === 'dram-write' || currentStep.simulatorType === 'dram-sense-restore') {
      sceneSignal = currentParams.wl === 1 ? '워드라인이 활성화되어 셀에 접근 중' : '워드라인 대기 중';
    } else if (currentStep.simulatorType === 'sram-cross-coupled-inverters') {
      sceneSignal = currentParams.q === 1 ? '래치 상태 Q=1 (High) 유지' : '래치 상태 Q=0 (Low) 유지';
    } else if (currentStep.simulatorType?.startsWith('nand')) {
      sceneSignal = '전하 트랩층 비휘발성 상태';
    } else if (currentStep.simulatorType?.startsWith('gpu')) {
      sceneSignal = 'SM 코어 병렬 데이터 스트림';
    }
  }

  const domainLabel = isMosfet
    ? 'MOSFET 반도체'
    : isElec
    ? '전기회로'
    : lesson.id.includes('gears')
    ? '기계공학 기어'
    : lesson.id.includes('dram')
    ? 'DRAM 메모리'
    : lesson.id.includes('sram')
    ? 'SRAM 메모리'
    : lesson.id.includes('nand')
    ? 'NAND 플래시'
    : lesson.id.includes('gpu')
    ? 'GPU 병렬 컴퓨팅'
    : lesson.title.split('—')[0].trim();

  const labName = isMosfet
    ? 'MOSFET 탐험실'
    : isElec
    ? 'LESSON 12 · CIRCUIT LAB'
    : lesson.title.split('—')[0].trim();

  const labSubtitle = visualSpec.subtitle || currentStep.storyLead || currentStep.title;

  const labCaption = visualSpec.caption;

  const modelBubbleText = isElec
    ? activePhase === 'predict'
      ? '이상적인 5V 전원과 1kΩ 저항의 교육용 모델. 측정 결과는 예측을 제출한 후에 표시합니다.'
      : '이상적인 DC 5V 전원(내부저항 0Ω), 1kΩ 저항 회로 모형입니다. 스위치가 열리면 I=0mA이며 5V 전위차는 유지됩니다.'
    : isMosfet
    ? activePhase === 'predict'
      ? '이 화면은 교육을 위해 구조를 단순화한 nMOS 모형입니다. 실제 소자의 공정과 온도에 따라 값은 달라지며, 실험 결과는 예측을 제출한 다음 확인할 수 있습니다.'
      : '이 장면은 교육용 nMOS 모형입니다. 문턱 전압은 0.7V로 가정하고 누설과 실제 공정 차이는 생략했습니다. VDS=0V일 때 순 드레인 전류는 0A입니다.'
    : currentStep.physicsAssumptions
    ? `${currentStep.physicsAssumptions}\n\n${currentStep.detailExplanation || ''}`
    : (currentStep.detailExplanation || '교육용 공학 시뮬레이션 모델입니다.');

  return (
    <main className="a03-layout" aria-label="학습 실험실">
      <div className="a03-workspace">
        {/* Left Side: 2.5D Interactive Simulator Lab Canvas */}
        <section className="a03-lab" aria-label={`${domainLabel} 2.5D 구조 실험 시각화`}>
          {/* Top Info Bar inside Lab */}
          <div className="a03-lab-top">
            <div className="a03-symbol" aria-hidden="true">⬡</div>
            <div>
              <div className="a03-lab-name">{labName}</div>
              <div className="a03-lab-sub">{labSubtitle}</div>
            </div>
          </div>

          <div className="a03-v2-label" id="scene-label">{sceneLabel}</div>

          {sceneSignal && (
            <div className="a03-scene-signal" role="status" aria-live="polite">
              {sceneSignal}
            </div>
          )}

          {/* Canvas Wrapper supporting zoom */}
          <div
            className="a03-lab-canvas-wrapper"
            style={{ '--zoom': zoomLevel } as React.CSSProperties}
          >
            {renderSimulator()}
          </div>

          {/* Experiment Control Dock for Lesson 12: Hidden in predict phase, revealed in observe/check/done */}
          {isElecStep1 && (
            <div className="a03-lab-dock-section" hidden={activePhase === 'predict'}>
              <div id="experiment-dock" className="a03-dock" role="region" aria-label="실험 조작 회로 스위치">
                <div className="a03-dock-copy">
                  <span className="a03-dock-title">실험 조작 · 회로 스위치</span>
                  <span className="a03-dock-sub">열림과 닫힘을 직접 비교해 보세요</span>
                </div>
                <div className="a03-seg" role="group" aria-label="실험 조작 회로 스위치">
                  <button
                    id="open-switch"
                    type="button"
                    aria-pressed={!currentParams.closed}
                    className={!currentParams.closed ? 'active' : ''}
                    onClick={() => updateParam('closed', false)}
                  >
                    열림
                  </button>
                  <button
                    id="close-switch"
                    type="button"
                    aria-pressed={Boolean(currentParams.closed)}
                    className={currentParams.closed ? 'active' : ''}
                    onClick={() => updateParam('closed', true)}
                  >
                    닫힘
                  </button>
                </div>
              </div>

              <div id="readouts" className="a03-readouts" aria-live="polite">
                <span>전원 전압 <b>5 V</b></span>
                <span>전류 <b id="amp">{currentParams.closed ? '5 mA' : '0 mA'}</b></span>
                <span id="switch-readout">{currentParams.closed ? '스위치 닫힘' : '스위치 열림'}</span>

                <div className="a03-dir-group" role="group" aria-label="전류 화살표 기준">
                  <button
                    type="button"
                    className={`a03-dir-btn ${(currentParams.direction ?? 'conventional') === 'conventional' ? 'active' : ''}`}
                    onClick={() => updateParam('direction', 'conventional')}
                    aria-pressed={(currentParams.direction ?? 'conventional') === 'conventional'}
                    title="관습전류 (+ → − 방향)"
                  >
                    관습전류
                  </button>
                  <button
                    type="button"
                    className={`a03-dir-btn ${currentParams.direction === 'electron' ? 'active' : ''}`}
                    onClick={() => updateParam('direction', 'electron')}
                    aria-pressed={currentParams.direction === 'electron'}
                    title="전자의 실제 이동 (− → + 방향)"
                  >
                    전자 이동
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Tools & Legend inside Lab */}
          <div className="a03-lab-bottom">
            <div className="a03-lab-context" id="lab-caption">
              {labCaption}
            </div>

            <div className="a03-lab-tools">
              <button
                className="a03-tool"
                type="button"
                id="model-info"
                aria-expanded={showModelBubble}
                aria-controls="model-bubble"
                aria-label="모델 기준 설명"
                onClick={() => setShowModelBubble((v) => !v)}
              >
                ⓘ
              </button>
              <button
                className="a03-tool"
                type="button"
                id="zoom-in"
                aria-label="확대"
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.12))}
              >
                ＋
              </button>
              <button
                className="a03-tool"
                type="button"
                id="zoom-out"
                aria-label="축소"
                onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.12))}
              >
                −
              </button>
              <button
                className="a03-tool"
                type="button"
                id="reset-view"
                aria-label="카메라 초기화"
                onClick={() => setZoomLevel(1)}
              >
                ↺
              </button>
            </div>
          </div>

          {/* Model Criteria Disclosure Bubble */}
          {showModelBubble && (
            <div className="a03-model-bubble" id="model-bubble">
              {modelBubbleText}
            </div>
          )}
        </section>

        {/* Right Side: A03 Single Task Flow Sheet (Panel) */}
        <A03SingleTaskPanel
          onPhaseChange={setActivePhase}
          onExit={onOpenCatalog}
        />
      </div>

      {/* Deep-Dive Why Modal */}
      <WhyModal />
    </main>
  );
};
