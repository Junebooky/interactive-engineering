import type { SessionProgress } from '../types';

const STORAGE_KEY_PREFIX = 'ie_progress_';
const LAST_LESSON_KEY = 'ie_last_active_lesson';

export function loadLessonProgress(courseId: string, lessonId: string): SessionProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${courseId}_${lessonId}`);
    if (!raw) return null;
    return JSON.parse(raw) as SessionProgress;
  } catch (err) {
    console.warn('Failed to load lesson progress from LocalStorage:', err);
    return null;
  }
}

export function saveLessonProgress(progress: SessionProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}${progress.courseId}_${progress.lessonId}`,
      JSON.stringify(progress)
    );
    localStorage.setItem(LAST_LESSON_KEY, JSON.stringify({
      courseId: progress.courseId,
      lessonId: progress.lessonId,
    }));
  } catch (err) {
    console.warn('Failed to save lesson progress to LocalStorage:', err);
  }
}

export function getLastActiveLesson(): { courseId: string; lessonId: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LAST_LESSON_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearLessonProgress(courseId: string, lessonId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${courseId}_${lessonId}`);
  } catch (err) {
    console.warn('Failed to clear lesson progress:', err);
  }
}
