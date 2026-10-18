import React, { useState } from 'react';
import { useLearningEngine } from '../../engine/LearningContext';
import { voiceEngine } from '../../lib/voice/webSpeechEngine';
import { SwitchToggle } from '../interactive/SwitchToggle';
import { TruthTableInput } from '../interactive/TruthTableInput';

export type FlowPhase = 'concept' | 'predict' | 'observe' | 'check' | 'done';

interface A03SingleTaskPanelProps {
  onPhaseChange?: (phase: FlowPhase) => void;
  onExit?: () => void;
}

export const A03SingleTaskPanel: React.FC<A03SingleTaskPanelProps> = ({
  onPhaseChange,
  onExit,
}) => {
  const {
    lesson,
    currentStepIndex,
    currentParams,
    updateParam,
    startInteraction,
    endInteraction,
    submitCheck,
    retry,
    nextStep,
    fsmState,
    evaluation,
    resetCurrentStep,
  } = useLearningEngine();

  // Local phase state within the active step
  const [phaseOverride, setPhaseOverride] = useState<FlowPhase | null>(null);

  if (!lesson) return null;
  const step = lesson.steps[currentStepIndex];
  if (!step) return null;

  const isElecStep1 = step.id === 'step-elec-s1-ohms-law';
  const predictionCtrl = step.controls?.find((c) => c.id === 'prediction');
  const answerCtrl = step.controls?.find((c) => c.id === 'answer');
  const otherControls = step.controls?.filter(
    (c) => c.id !== 'prediction' && c.id !== 'answer' && (!isElecStep1 || (c.id !== 'closed' && c.id !== 'direction'))
  ) || [];

  const predictionVal = currentParams.prediction;
  const isCorrect = fsmState === 'EVALUATED_CORRECT';
  const isIncorrect = fsmState === 'EVALUATED_INCORRECT';

  // Exploration requirement check (e.g., visited low and high for sliders, or open/closed for switches)
  const visitedArr = Array.isArray(currentParams.visited)
    ? currentParams.visited
    : typeof currentParams.visited === 'number'
    ? [currentParams.visited]
    : [];

  const minHighRule = step.rules?.find((r) => r.operator === 'visitedLowHigh');
  const minHigh = typeof minHighRule?.expected === 'number' ? minHighRule.expected : 0.8;
  const lowSeen = visitedArr.some((v) => v === 0);
  const highSeen = visitedArr.some((v) => typeof v === 'number' && v >= minHigh);

  const historyArr: string[] = Array.isArray(currentParams.history) ? currentParams.history : [];
  const requiresOpenClosed = isElecStep1 || step.rules?.some((r) => r.expected === 'open' || r.expected === 'closed');
  const isExplorationDone = requiresOpenClosed
    ? historyArr.includes('open') && historyArr.includes('closed')
    : otherControls.length === 0 || (lowSeen && highSeen);

  // Determine current active phase
  let currentPhase: FlowPhase = 'predict';
  if (step.stepType === 'CONCEPT') {
    currentPhase = 'concept';
  } else if (isCorrect) {
    currentPhase = 'done';
  } else if (!predictionCtrl) {
    // If step has no prediction (e.g. direct exploration)
    currentPhase = answerCtrl ? 'check' : otherControls.length > 0 ? 'observe' : 'done';
  } else if (phaseOverride) {
    currentPhase = phaseOverride;
  } else if (predictionVal !== null && predictionVal !== undefined) {
    // If progress restored from storage with exploration already started
    const hasProgressed = highSeen || (historyArr.includes('open') && historyArr.includes('closed')) || Boolean(currentParams.answer);
    currentPhase = hasProgressed ? 'observe' : 'predict';
  } else {
    currentPhase = 'predict';
  }

  // Notify parent if phase changes
  React.useEffect(() => {
    onPhaseChange?.(currentPhase);
  }, [currentPhase, onPhaseChange]);

  // Reset phase override when step index changes
  React.useEffect(() => {
    setPhaseOverride(null);
  }, [currentStepIndex]);

  // Kicker and Titles according to phase
  let kicker = isElecStep1 ? `01 · 예상해 보기` : `01 · 먼저 예측하기`;
  let title = isElecStep1 ? (predictionCtrl?.label || step.prompt) : step.title;
  let subtitle = isElecStep1
    ? '전류가 흐르는 길을 끊으면 무슨 일이 생길지 먼저 생각해 보세요.'
    : (step.storyLead || '화면의 구조를 살펴본 다음 나만의 가설을 세워보세요.');

  if (step.stepType === 'CONCEPT' || currentPhase === 'concept') {
    kicker = `00 · 개념 도입`;
    title = step.title;
    subtitle = step.storyLead || '실습 시작 전 기본 배경 개념을 확인합니다.';
  } else if (currentPhase === 'observe') {
    kicker = isElecStep1 ? `02 · 직접 실험하기` : `02 · 전압을 직접 바꿔보기`;
    title = isElecStep1
      ? '스위치를 열고 닫으며 비교해 보세요.'
      : (step.id === 'step-mosfet-s2-vds-drift' ? '드레인 전압을 올리면 무엇이 달라질까요?' : '전압을 올리면 무엇이 달라질까요?');
    subtitle = isElecStep1
      ? '왼쪽 2.5D 장면 바로 아래의 실험 조작 도크에서 스위치를 눌러 보세요.'
      : `낮은 상태와 높은 상태를 직접 비교해 보세요.`;
  } else if (currentPhase === 'check') {
    kicker = isElecStep1 ? `03 · 설명해 보기` : `03 · 관찰한 원리 설명하기`;
    title = isElecStep1 ? '왜 회로가 열릴 때 전류만 멈출까요?' : (answerCtrl?.label || '관찰한 원리 설명하기');
    subtitle = isElecStep1
      ? '방금 직접 관찰한 전압과 전류 변화를 떠올려 보세요.'
      : '직접 본 장면을 떠올려 가장 알맞은 이유를 설명해 보세요.';
  } else if (currentPhase === 'done') {
    kicker = isElecStep1 ? `04 · 핵심 발견` : `04 · 실험 완료`;
    title = isElecStep1 ? '길을 끊으면 흐름이 멈춰요.' : '원리를 발견했어요!';
    subtitle = isElecStep1
      ? '스위치가 열리면 전류는 0mA예요. 하지만 배터리 양단 5V 전압은 유지됩니다.'
      : '직접 예측하고 조작한 결과를 올바르게 설명했습니다.';
  }

  // Voice narration text
  const speechText =
    currentPhase === 'concept'
      ? (step.voice?.intro || step.storyLead || step.prompt)
      : currentPhase === 'predict'
      ? (step.voice?.intro || `${step.prompt} 먼저 예상해 보세요.`)
      : currentPhase === 'observe'
      ? (step.voice?.intro || '조작 슬라이더를 움직여 화면의 물리적 변화를 비교해 보세요.')
      : currentPhase === 'check'
      ? (step.voice?.explanation || '직접 관찰한 장면을 떠올려 원리를 설명해 보세요.')
      : (step.successVoice || step.successMessage || '실험을 완료했습니다.');

  const handleListen = () => {
    if (speechText) {
      voiceEngine.speak(speechText, { force: true });
    }
  };

  const handlePredictSubmit = () => {
    if (predictionVal !== null && predictionVal !== undefined) {
      setPhaseOverride('observe');
    }
  };

  const handleObserveDone = () => {
    if (answerCtrl) {
      setPhaseOverride('check');
    } else {
      // If no separate explain question, submit evaluation
      submitCheck();
    }
  };

  const handleCheckSubmit = () => {
    submitCheck();
  };

  const handleResetToPredict = () => {
    resetCurrentStep();
    updateParam('prediction', null);
    updateParam('answer', null);
    updateParam('visited', []);
    if (retry) retry();
    setPhaseOverride('predict');
  };

  const handleBackToObserve = () => {
    if (retry) retry();
    setPhaseOverride('observe');
  };

  return (
    <section className="a03-sheet" aria-label="학습 질문과 실험 조작">
      <div className="a03-drag-handle" aria-hidden="true" />

      {/* Panel Heading */}
      <div className="a03-panel-heading">
        <div className="a03-kicker" id="a03-kicker">{kicker}</div>
        <h1 id="a03-panel-title">{title}</h1>
        <p className="a03-step-intro" id="a03-step-intro">{subtitle}</p>
      </div>

      {/* Panel Body: Strict single-task-at-a-time rendering */}
      <div className="a03-panel-body" id="a03-panel-body">
        {/* CONCEPT STEP INTRODUCTION */}
        {(step.stepType === 'CONCEPT' || currentPhase === 'concept') && (
          <div className="a03-phase-concept">
            <div className="a03-prompt">
              <h2>{step.prompt}</h2>
              {step.detailExplanation && <p className="a03-lead">{step.detailExplanation}</p>}
            </div>
          </div>
        )}

        {/* PHASE 1: PREDICT */}
        {step.stepType !== 'CONCEPT' && currentPhase === 'predict' && (
          <div className="a03-phase-predict">
            <div className="a03-prompt">
              <h2>{predictionCtrl?.label || step.prompt}</h2>
              <p className="a03-lead">
                {isElecStep1
                  ? '전류가 흐르는 길을 끊으면 무슨 일이 생길지 먼저 생각해 보세요.'
                  : '실리콘의 구조를 보고 먼저 예상해 보세요. 실험 결과는 예측을 제출한 뒤 확인할 수 있어요.'}
              </p>
            </div>

            {predictionCtrl?.options && (
              <div
                className="a03-choices"
                role="radiogroup"
                aria-label={predictionCtrl.label}
              >
                {predictionCtrl.options.map((opt) => {
                  const isSelected = String(predictionVal) === String(opt.value);
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`a03-choice ${isSelected ? 'active' : ''}`}
                      onClick={() => updateParam('prediction', opt.value)}
                    >
                      <span className="a03-circle" aria-hidden="true" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <p className="a03-aside-note">
              정답을 맞히는 것보다 스스로 가설을 세우고 관찰하는 과정이 중요해요.
            </p>
          </div>
        )}

        {/* PHASE 2: OBSERVE */}
        {currentPhase === 'observe' && (
          <div className="a03-phase-observe">
            <div className="a03-prompt">
              <h2>{isElecStep1 ? '스위치를 열고 닫으며 비교해 보세요' : '직접 조작하며 변화를 비교해 보세요'}</h2>
              <p className="a03-lead">
                {isElecStep1
                  ? '왼쪽 2.5D 장면 바로 아래의 실험 조작 도크에서 스위치를 눌러 보세요.'
                  : `낮은 상태(0V)와 높은 상태(≥${minHigh}V)를 모두 조작하여 화면의 전자와 전류를 관찰하세요.`}
              </p>
            </div>

            {/* Observation Controls (Sliders, Toggles, Truth tables) */}
            <div className="a03-controls-container">
              {otherControls.map((ctrl) => {
                if (ctrl.type === 'slider') {
                  const val = currentParams[ctrl.id] ?? ctrl.min ?? 0;
                  const snapPoints = ctrl.id === 'vgs' ? [0.7] : [];
                  return (
                    <div key={ctrl.id} className="a03-parameter">
                      <div className="a03-parameter-head">
                        <span>{ctrl.label}</span>
                        <strong>{Number(val).toFixed(1)} {ctrl.unit || 'V'}</strong>
                      </div>
                      <input
                        id={ctrl.id}
                        type="range"
                        min={ctrl.min ?? 0}
                        max={ctrl.max ?? 1.2}
                        step={ctrl.step ?? 0.1}
                        value={val}
                        aria-label={`${ctrl.label} ${ctrl.min ?? 0}부터 ${ctrl.max ?? 1.2}${ctrl.unit || 'V'}까지`}
                        onChange={(e) => updateParam(ctrl.id, parseFloat(e.target.value))}
                        onPointerDown={startInteraction}
                        onPointerUp={endInteraction}
                      />
                      <div className="a03-ticks">
                        <span>{ctrl.min ?? 0} {ctrl.unit || 'V'}</span>
                        {snapPoints.length > 0 && <span>{snapPoints[0]} {ctrl.unit || 'V'} (Vth)</span>}
                        <span>{ctrl.max ?? 1.2} {ctrl.unit || 'V'}</span>
                      </div>
                    </div>
                  );
                }

                if (ctrl.type === 'toggle') {
                  const offOption = ctrl.options?.[0];
                  const onOption = ctrl.options?.[1];
                  const currentVal = currentParams[ctrl.id];
                  const checked = onOption !== undefined
                    ? currentVal === onOption.value || Number(currentVal) === Number(onOption.value)
                    : Boolean(currentVal);

                  return (
                    <SwitchToggle
                      key={ctrl.id}
                      id={ctrl.id}
                      label={ctrl.label}
                      checked={checked}
                      onText={onOption?.label}
                      offText={offOption?.label}
                      onToggle={(nextChecked) => {
                        const targetOption = nextChecked ? onOption : offOption;
                        updateParam(ctrl.id, targetOption?.value ?? nextChecked);
                      }}
                    />
                  );
                }

                if (ctrl.type === 'truthTable') {
                  return (
                    <TruthTableInput
                      key={ctrl.id}
                      out0={currentParams.out0 ?? null}
                      out1={currentParams.out1 ?? null}
                      onChange={(key, val) => updateParam(key, val)}
                    />
                  );
                }

                return null;
              })}
            </div>

            {/* Dynamic observation prompt text */}
            <div className="a03-observe-note" role="status" aria-live="polite">
              {isElecStep1 ? (
                currentParams.closed === undefined ? (
                  '스위치 조작 버튼을 눌러 회로를 열거나 닫아보세요.'
                ) : currentParams.closed ? (
                  '스위치가 닫혀 회로에 5mA가 흐르고 있어요.'
                ) : (
                  '회로가 열리면 전류가 멈춰요. 하지만 배터리의 5V는 그대로 남아 있어요.'
                )
              ) : step.simulatorType === 'mosfet-field' ? (
                (currentParams.vgs ?? 0) >= 0.7 ? (
                  '전압을 0.7V(Vth) 이상으로 올렸더니 전자들이 실리콘 표면에 모여 통로가 열렸어요. 하지만 VDS=0V라서 순 전류는 흐르지 않아요.'
                ) : (
                  '아직 실리콘 표면에 전도 통로가 보이지 않아요. 게이트 전압을 0.8V 이상으로 올려보세요.'
                )
              ) : step.simulatorType === 'mosfet-current' ? (
                (currentParams.vds ?? 0) >= 1.0 ? (
                  '드레인 전압을 가하자 전자가 이동하며 전류가 흐르고, 포화 구간에 도달해도 일정한 전류가 유지돼요.'
                ) : (
                  '드레인 전압(VDS)을 1.0V 이상으로 움직여 전류 곡선의 증가와 포화 경향을 살펴보세요.'
                )
              ) : (
                '스위치 상태를 바꾸며 출력 전압과 논리 상태의 반전을 비교해 보세요.'
              )}
            </div>

            {isElecStep1 && (
              <div className="a03-status-line" id="status" aria-live="polite">
                {isExplorationDone
                  ? '관찰: 2/2 상태 확인 완료'
                  : `관찰: ${[historyArr.includes('open'), historyArr.includes('closed')].filter(Boolean).length}/2 상태 확인`}
              </div>
            )}

          </div>
        )}

        {/* PHASE 3: CHECK / EXPLAIN */}
        {currentPhase === 'check' && answerCtrl && (
          <div className="a03-phase-check">
            <div className="a03-prompt">
              <h2>{answerCtrl.label}</h2>
              <p className="a03-lead">
                실험에서 관찰한 사실을 바탕으로 가장 과학적으로 정확한 설명을 고르세요.
              </p>
            </div>

            <div
              className="a03-choices"
              role="radiogroup"
              aria-label={answerCtrl.label}
            >
              {answerCtrl.options?.map((opt) => {
                const isSelected = currentParams.answer === opt.value;
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`a03-choice ${isSelected ? 'active' : ''}`}
                    onClick={() => updateParam('answer', opt.value)}
                  >
                    <span className="a03-circle" aria-hidden="true" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Targeted misconception feedback */}
            {isIncorrect && evaluation?.message && (
              <div className="a03-feedback-note" role="status">
                <strong>💡 다시 생각해 보세요:</strong>
                <p>{evaluation.message}</p>
              </div>
            )}

            {/* Accordion for Hint */}
            {step.hints && step.hints.length > 0 && (
              <details className="a03-accordion">
                <summary>관찰 힌트 펼쳐보기</summary>
                <div className="a03-accordion-content">
                  {step.hints.map((h) => (
                    <p key={h.level}><strong>레벨 {h.level}:</strong> {h.description}</p>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        {/* PHASE 4: DONE */}
        {currentPhase === 'done' && (
          <div className="a03-phase-done">
            <div className="a03-model-explain">
              <strong>✦ 핵심 발견</strong>
              <p>
                {isElecStep1
                  ? '전압은 전하를 움직이게 하는 차이이고, 전류는 그 결과로 일어나는 흐름입니다.'
                  : (step.successMessage || '실험과 개념 확인을 성공적으로 완수했습니다.')}
              </p>
              {step.whyExplanation && (
                <p style={{ marginTop: '10px', color: '#556c73' }}>
                  {step.whyExplanation}
                </p>
              )}
            </div>

            <p className="a03-aside-note">
              {isElecStep1
                ? '다음 실험으로 넘어가 저항과 KCL의 원리를 탐구해 보세요.'
                : '다음 실험 단계로 넘어가 더 깊은 반도체 원리를 탐구해 보세요.'}
            </p>

            {/* Accordion for deep-dive detail */}
            {step.detailExplanation && (
              <details className="a03-accordion">
                <summary>{isElecStep1 ? '상세 회로 해설 및 다음 단계 연결' : '상세 공학 해설 및 다음 단계 연결'}</summary>
                <div className="a03-accordion-content">
                  {step.detailExplanation.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>

      {/* Panel Bottom Actions (Single Sticky CTA Group) */}
      <div className="a03-panel-actions">
        {/* Voice Coach Row */}
        <div className="a03-coach">
          <span className="a03-voice-icon" aria-hidden="true">◖))</span>
          <div className="a03-coach-text">
            <strong>내 곁의 엔지니어</strong>
            <small id="a03-voice-caption">
              {currentPhase === 'concept'
                ? '기본 배경 개념을 짧게 들려드려요.'
                : currentPhase === 'predict'
                ? '지금은 질문만 들어요.'
                : currentPhase === 'observe'
                ? '직접 조작한 결과를 짧게 들려드려요.'
                : currentPhase === 'done'
                ? '발견한 원리를 다시 들을 수 있어요.'
                : '생각한 이유를 직접 설명해 보세요.'}
            </small>
          </div>
          <button
            type="button"
            className="a03-listen"
            onClick={handleListen}
          >
            ▷ {currentPhase === 'concept' ? '개념 듣기' : currentPhase === 'predict' ? '질문 듣기' : '설명 듣기'}
          </button>
        </div>

        {/* Primary Action Button (Single active CTA) */}
        {(step.stepType === 'CONCEPT' || currentPhase === 'concept') && (
          <button
            type="button"
            className="a03-main-action"
            onClick={nextStep}
          >
            개념을 이해했습니다 · 1단계 실험 시작 →
          </button>
        )}

        {step.stepType !== 'CONCEPT' && currentPhase === 'predict' && (
          <button
            type="button"
            className="a03-main-action"
            disabled={predictionVal === null || predictionVal === undefined}
            onClick={handlePredictSubmit}
          >
            {predictionVal === null || predictionVal === undefined
              ? '예측을 먼저 선택해 주세요'
              : isElecStep1
              ? '예측 제출하고 실험하기 →'
              : '예측 제출하고 실험 시작 →'}
          </button>
        )}

        {step.stepType !== 'CONCEPT' && currentPhase === 'observe' && (
          <button
            type="button"
            className="a03-main-action"
            disabled={!isExplorationDone}
            onClick={handleObserveDone}
          >
            {isExplorationDone
              ? (isElecStep1 ? '관찰 마치고 설명하기 →' : '비교 완료 · 설명해 보기 →')
              : (isElecStep1 ? '열림과 닫힘을 모두 확인해 보세요' : `0V와 ${minHigh}V 이상을 비교해 주세요`)}
          </button>
        )}

        {step.stepType !== 'CONCEPT' && currentPhase === 'check' && (
          <button
            type="button"
            className="a03-main-action"
            disabled={!currentParams.answer}
            onClick={handleCheckSubmit}
          >
            {!currentParams.answer ? '설명을 먼저 선택해 주세요' : '내 설명 확인하기 →'}
          </button>
        )}

        {step.stepType !== 'CONCEPT' && currentPhase === 'done' && (
          <button
            type="button"
            className="a03-main-action"
            onClick={nextStep}
          >
            다음 실험으로 넘어가기 →
          </button>
        )}

        {/* Secondary Back / Retry line */}
        <div className="a03-secondary-line">
          {currentPhase === 'observe' && (
            <button
              type="button"
              className="a03-secondary-action has-retry"
              onClick={handleResetToPredict}
            >
              ↺ 예측부터 다시
            </button>
          )}

          {currentPhase === 'check' && (
            <button
              type="button"
              className="a03-secondary-action has-retry"
              onClick={handleBackToObserve}
            >
              ↺ 다시 관찰하기
            </button>
          )}

          {currentPhase === 'done' && (
            <>
              <button
                type="button"
                className="a03-secondary-action has-retry"
                onClick={handleResetToPredict}
              >
                ↺ 한 번 더 실험하기
              </button>
              <button
                type="button"
                className="a03-secondary-action"
                onClick={handleBackToObserve}
              >
                ← 이전 단계
              </button>
            </>
          )}

          {(currentPhase === 'predict' || currentPhase === 'concept') && onExit && (
            <button
              type="button"
              className="a03-secondary-action"
              onClick={onExit}
            >
              ← 학습 경로로 돌아가기
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
