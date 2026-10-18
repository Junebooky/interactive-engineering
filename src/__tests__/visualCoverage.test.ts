import { describe, it, expect } from 'vitest';
import { courses } from '../content/courses';
import { resolveStepVisual } from '../engine/visualRegistry';
import type { Step } from '../types';

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
            // Spoiler safety assertion: caption must not reveal exercise answer formula
            expect(visual.caption).not.toContain('Vth를 넘을 때');
            expect(visual.caption).not.toContain('전류는 0 A');
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

  it('B3: throws immediately on unregistered lesson/step IDs (no arbitrary silent fallback)', () => {
    const fakeStep: Step = {
      id: 'step-fake-unregistered',
      title: '가상 단계',
      stepType: 'CONCEPT',
      storyLead: '테스트',
      prompt: '질문',
      controls: [],
      rules: [],
      successMessage: '성공',
    };

    expect(() => {
      resolveStepVisual('non-existent-lesson', fakeStep);
    }).toThrowError(/Unregistered visual mapping/);
  });
});
