import type { LessonStep, StepEvaluation } from '../types';

export function evaluateStepRules(
  step: LessonStep,
  currentParams: Record<string, any>
): StepEvaluation {
  for (const rule of step.rules) {
    const val = currentParams[rule.targetKey];
    let isPassed = false;

    switch (rule.operator) {
      case 'eq':
        isPassed = val === rule.expected;
        break;
      case 'gte':
        isPassed = typeof val === 'number' && typeof rule.expected === 'number' && val >= rule.expected;
        break;
      case 'lte':
        isPassed = typeof val === 'number' && typeof rule.expected === 'number' && val <= rule.expected;
        break;
      case 'between': {
        const [min, max] = rule.expected as [number, number];
        isPassed = typeof val === 'number' && val >= min && val <= max;
        break;
      }
      case 'near': {
        const expectedNum = rule.expected as number;
        const tol = rule.tolerance ?? 0.05;
        isPassed = typeof val === 'number' && Math.abs(val - expectedNum) <= tol;
        break;
      }
      default:
        isPassed = false;
    }

    if (!isPassed) {
      return {
        passed: false,
        message: rule.feedbackIfFail,
        whyExplanation: step.whyExplanation,
        voiceLine: rule.voiceIfFail || rule.feedbackIfFail,
        failDiagnosis: `조건 미달: ${rule.targetKey} = ${val} (목표: ${rule.operator} ${JSON.stringify(rule.expected)})`,
      };
    }
  }

  return {
    passed: true,
    message: step.successMessage,
    whyExplanation: step.whyExplanation,
    voiceLine: step.successVoice,
  };
}
