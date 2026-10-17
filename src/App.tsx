import React, { useState, useEffect } from 'react';
import { getCourseById, getLessonById, getDefaultCourseAndLesson, courses } from './content/courses';
import { LearningProvider, useLearningEngine } from './engine/LearningContext';
import { getLastActiveLesson } from './engine/progressStorage';
import { Header } from './components/common/Header';
import { LessonPlayer } from './components/player/LessonPlayer';
import { CourseCatalogModal } from './components/catalog/CourseCatalogModal';
import { A05MosfetSceneLab } from './a05/A05MosfetSceneLab';

const AppContent: React.FC = () => {
  const { initLesson } = useLearningEngine();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [showQALab, setShowQALab] = useState(false);

  // Initial load: restore from query params, last active lesson, or default to first lesson
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const queryLessonId = searchParams.get('lesson');
      const queryStep = searchParams.get('step');
      const stepIndex = queryStep ? parseInt(queryStep, 10) : undefined;

      if (queryLessonId) {
        for (const c of courses) {
          const found = c.lessons.find((l) => l.id === queryLessonId || l.slug === queryLessonId);
          if (found) {
            initLesson(c.id, found, stepIndex);
            return;
          }
        }
      }
    }

    const lastActive = getLastActiveLesson();
    if (lastActive) {
      const restoredCourse = getCourseById(lastActive.courseId);
      const restoredLesson = getLessonById(lastActive.courseId, lastActive.lessonId);
      if (restoredCourse && restoredLesson) {
        initLesson(restoredCourse.id, restoredLesson);
        return;
      }
    }

    const { course, lesson: defaultLesson } = getDefaultCourseAndLesson();
    initLesson(course.id, defaultLesson);
  }, [initLesson]);

  const handleSelectCourse = (newCourseId: string, newLessonId: string) => {
    const targetLesson = getLessonById(newCourseId, newLessonId);
    if (targetLesson) {
      initLesson(newCourseId, targetLesson);
    }
  };

  return (
    <div className="app-container">
      <Header
        onOpenCatalog={() => setIsCatalogOpen(true)}
        onToggleQALab={() => setShowQALab(true)}
      />
      
      <LessonPlayer onOpenCatalog={() => setIsCatalogOpen(true)} />

      <CourseCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectCourse={handleSelectCourse}
      />

      {showQALab && (
        <div className="qa-lab-overlay">
          <div className="qa-lab-header">
            <span>🧪 A05 MOSFET 2.5D Discovery Lab (Standalone QA Preview)</span>
            <button
              type="button"
              className="qa-lab-close-btn"
              onClick={() => setShowQALab(false)}
            >
              ✕ 공식 레슨 플레이어로 돌아가기
            </button>
          </div>
          <A05MosfetSceneLab />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <LearningProvider>
      <AppContent />
    </LearningProvider>
  );
}
