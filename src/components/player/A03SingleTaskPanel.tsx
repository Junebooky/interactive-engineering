import React, { useState } from 'react';
import { useLearningEngine } from '../../engine/LearningContext';
import { voiceEngine } from '../../lib/voice/webSpeechEngine';
import { ParameterSlider } from '../interactive/ParameterSlider';
import { SwitchToggle } from '../interactive/SwitchToggle';
import { TruthTableInput } from '../interactive/TruthTableInput';

export type FlowPhase = 'predict' | 'observe' | 'check' | 'done';

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

  const predictionCtrl = step.controls?.find((c) => c.id === 'prediction');
  const answerCtrl = step.controls?.find((c) => c.id === 'answer');
  const otherControls = step.controls?.filter(
    (c) => c.id !== 'prediction' && c.id !== 'answer'
  ) || [];

  const predictionVal = currentParams.prediction;
  const isCorrect = fsmState === 'EVALUATED_CORRECT';
  const isIncorrect = fsmState === 'EVALUATED_INCORRECT';

  // Determine current active phase
  let currentPhase: FlowPhase = 'predict';
  if (isCorrect) {
    currentPhase = 'done';
  } else if (step.stepType === 'CONCEPT' || !predictionCtrl) {
    // If step has no prediction (e.g. Concept step or direct exploration)
    currentPhase = answerCtrl ? 'check' : otherControls.length > 0 ? 'observe' : 'done';
  } else if (phaseOverride) {
    currentPhase = phaseOverride;
  } else if (predictionVal === null || predictionVal === undefined) {
    currentPhase = 'predict';
  } else {
    currentPhase = 'observe';
  }

  // Notify parent if phase changes
  React.useEffect(() => {
    onPhaseChange?.(currentPhase);
  }, [currentPhase, onPhaseChange]);

  // Reset phase override when step index changes
  React.useEffect(() => {
    setPhaseOverride(null);
  }, [currentStepIndex]);

  // Exploration requirement check (e.g., visited low and high)
  const visitedArr = Array.isArray(currentParams.visited)
    ? currentParams.visited
    : typeof currentParams.visited === 'number'
    ? [currentParams.visited]
    : [0];

  const minHigh = step.rules?.find((r) => r.operator === 'visitedLowHigh')?.expected ?? 0.8;
  const lowSeen = visitedArr.some((v) => v === 0);
  const highSeen = visitedArr.some((v) => typeof v === 'number' && v >= minHigh);
  const isExplorationDone = otherControls.length === 0 || (lowSeen && highSeen);

  // Kicker and Titles according to phase
  let kicker = `01 · 먼저 예측하기`;
  let title = step.title;
  let subtitle = step.storyLead || '화면의 구조를 살펴본 다음 나만의 가설을 세워보세요.';

  if (step.stepType === 'CONCEPT') {
    kicker = `00 · 개념 도입`;
    title = step.title;
    subtitle = step.prompt;
  } else if (currentPhase === 'observe') {
    kicker = `02 · 전압을 직접 바꿔보기`;
    title = step.id === 'step-mosfet-s2-vds-drift' ? '드레인 전압을 올리면 무엇이 달라질까요?' : '전압을 올리면 무엇이 달라질까요?';
    subtitle = `낮은 상태와 높은 상태를 직접 비교해 보세요.`;
  } else if (currentPhase === 'check') {
    kicker = `03 · 관찰한 원리 설명하기`;
    title = answerCtrl?.label || '관찰한 원리 설명하기';
    subtitle = '직접 본 장면을 떠올려 가장 알맞은 이유를 설명해 보세요.';
  } else if (currentPhase === 'done') {
    kicker = `04 · 실험 완료`;
    title = '원리를 발견했어요!';
    subtitle = '직접 예측하고 조작한 결과를 올바르게 설명했습니다.';
  }

  // Voice narration text
  const speechText =
    currentPhase === 'predict'
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
    updateParam('visited', [0]);
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
        {step.stepType === 'CONCEPT' && (
          <div className="a03-phase-concept">
            <div className="a03-prompt">
              <h2>{step.prompt}</h2>
              <p className="a03-lead">{step.detailExplanation}</p>
            </div>
            {step.whyExplanation && (
              <div className="a03-model-explain" style={{ marginTop: '16px' }}>
                <strong>✦ 왜 반도체일까요?</strong>
                {step.whyExplanation}
              </div>
            )}
          </div>
        )}

        {/* PHASE 1: PREDICT */}
        {step.stepType !== 'CONCEPT' && currentPhase === 'predict' && (
          <div className="a03-phase-predict">
            <div className="a03-prompt">
              <h2>{predictionCtrl?.label || step.prompt}</h2>
              <p className="a03-lead">
                실리콘의 구조를 보고 먼저 예상해 보세요. 실험 결과는 예측을 제출한 뒤 확인할 수 있어요.
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

            {/* Accordion for supplementary physics background */}
            {step.detailExplanation && (
              <details className="a03-accordion">
                <summary>실리콘 구조 및 배경 지식 펼쳐보기</summary>
                <div className="a03-accordion-content">
                  {step.detailExplanation.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        {/* PHASE 2: OBSERVE */}
        {currentPhase === 'observe' && (
          <div className="a03-phase-observe">
            <div className="a03-prompt">
              <h2>직접 조작하며 변화를 비교해 보세요</h2>
              <p className="a03-lead">
                낮은 상태(0V)와 높은 상태(≥{minHigh}V)를 모두 조작하여 화면의 전자와 전류를 관찰하세요.
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
              {step.simulatorType === 'mosfet-field' ? (
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

            {/* Accordion for Why Explanation */}
            {step.whyExplanation && (
              <details className="a03-accordion">
                <summary>동작 원리 및 모델 가정 펼쳐보기</summary>
                <div className="a03-accordion-content">
                  <p>{step.whyExplanation}</p>
                </div>
              </details>
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
              {step.successMessage || '실험과 개념 확인을 성공적으로 완수했습니다.'}
              {step.whyExplanation && (
                <p style={{ marginTop: '10px', color: '#556c73' }}>
                  {step.whyExplanation}
                </p>
              )}
            </div>

            <p className="a03-aside-note">
              다음 실험 단계로 넘어가 더 깊은 반도체 원리를 탐구해 보세요.
            </p>

            {/* Accordion for deep-dive detail */}
            {step.detailExplanation && (
              <details className="a03-accordion">
                <summary>상세 공학 해설 및 다음 단계 연결</summary>
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
              {currentPhase === 'predict'
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
            ▷ {currentPhase === 'predict' ? '질문 듣기' : '설명 듣기'}
          </button>
        </div>

        {/* Primary Action Button (Single active CTA) */}
        {step.stepType === 'CONCEPT' && (
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
              : '예측 제출하고 실험 시작 →'}
          </button>
        )}

        {currentPhase === 'observe' && (
          <button
            type="button"
            className="a03-main-action"
            disabled={!isExplorationDone}
            onClick={handleObserveDone}
          >
            {isExplorationDone
              ? '비교 완료 · 설명해 보기 →'
              : `0V와 ${minHigh}V 이상을 비교해 주세요`}
          </button>
        )}

        {currentPhase === 'check' && (
          <button
            type="button"
            className="a03-main-action"
            disabled={!currentParams.answer}
            onClick={handleCheckSubmit}
          >
            {!currentParams.answer ? '설명을 먼저 선택해 주세요' : '내 설명 확인하기 →'}
          </button>
        )}

        {currentPhase === 'done' && (
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

          {currentPhase === 'predict' && onExit && (
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
