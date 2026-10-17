import type { LessonStep, StepEvaluation, RuleEvaluationResult } from '../types';

export function evaluateStepRules(
  step: LessonStep,
  currentParams: Record<string, any>
): StepEvaluation {
  const rules = step.rules || [];

  // If there are no rules (e.g. INTRO, CONCEPT, EXPLAIN steps), auto-pass
  if (rules.length === 0) {
    return {
      passed: true,
      message: step.successMessage || '개념 확인을 완료했습니다.',
      whyExplanation: step.whyExplanation || '',
      voiceLine: step.successVoice || step.successMessage || '개념 확인을 완료했습니다.',
      ruleResults: [],
    };
  }

  const ruleResults: RuleEvaluationResult[] = [];
  let firstFailMessage = '';
  let firstFailVoice = '';
  let failDiagnosis = '';

  for (const rule of rules) {
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
      case 'visitedLowHigh': {
        const visitedArr = Array.isArray(val) ? val : typeof val === 'number' ? [val] : [];
        const minHigh = typeof rule.expected === 'number' ? rule.expected : 0.8;
        const lowSeen = visitedArr.some((v) => v === 0);
        const highSeen = visitedArr.some((v) => typeof v === 'number' && v >= minHigh);
        isPassed = lowSeen && highSeen;
        break;
      }
      case 'contains': {
        if (Array.isArray(val)) {
          isPassed = val.includes(rule.expected);
        } else if (typeof val === 'string') {
          isPassed = val.includes(String(rule.expected));
        } else {
          isPassed = false;
        }
        break;
      }
      default:
        isPassed = false;
    }

    ruleResults.push({
      targetKey: rule.targetKey,
      label: rule.label || `${rule.targetKey} 조건`,
      passed: isPassed,
      message: isPassed ? '조건 만족' : rule.feedbackIfFail,
    });

    if (!isPassed && !firstFailMessage) {
      firstFailMessage = rule.feedbackIfFail;
      firstFailVoice = rule.voiceIfFail || rule.feedbackIfFail;
      failDiagnosis = `조건 미달: ${rule.targetKey} = ${val} (목표: ${rule.operator} ${JSON.stringify(rule.expected)})`;
    }
  }

  const allPassed = ruleResults.every((r) => r.passed);

  if (!allPassed) {
    return {
      passed: false,
      message: firstFailMessage,
      whyExplanation: step.whyExplanation || '',
      voiceLine: firstFailVoice,
      failDiagnosis,
      ruleResults,
    };
  }

  return {
    passed: true,
    message: step.successMessage || '완벽합니다!',
    whyExplanation: step.whyExplanation || '',
    voiceLine: step.successVoice || step.successMessage || '완벽합니다!',
    ruleResults,
  };
}
