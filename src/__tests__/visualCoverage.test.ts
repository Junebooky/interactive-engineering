import { describe, it, expect } from 'vitest';
import { courses } from '../content/courses';
import { resolveStepVisual } from '../engine/visualRegistry';

describe('P0-VISUAL-03 Visual Coverage Contract', () => {
  it('guarantees 100% visual coverage across all courses, lessons, and steps without blank scenes', () => {
    let totalStepsChecked = 0;
    let missingVisualStepCount = 0;
    const missingSteps: string[] = [];

    for (const course of courses) {
      for (const lesson of course.lessons) {
        for (const step of lesson.steps) {
          totalStepsChecked++;
          const visual = resolveStepVisual(lesson.id, step);

          if (!visual || !visual.visualId || !visual.title || !visual.caption) {
            missingVisualStepCount++;
            missingSteps.push(`${course.id} -> ${lesson.id} -> ${step.id}`);
          }

          // If step is CONCEPT, it must resolve to concept mode with spoiler-safe flag
          if (step.stepType === 'CONCEPT') {
            expect(visual.mode).toBe('concept');
            expect(visual.spoilerSafe).toBe(true);
            expect(visual.caption).toBeTruthy();
          }

          // If step has simulatorType, it must resolve to interactive mode
          if (step.simulatorType) {
            expect(visual.mode).toBe('interactive');
            expect(visual.simulatorType).toBe(step.simulatorType);
          }
        }
      }
    }

    expect(missingSteps).toEqual([]);
    expect(missingVisualStepCount).toBe(0);
    // Sanity check that we actually checked all published steps
    expect(totalStepsChecked).toBeGreaterThanOrEqual(40);
  });
});
