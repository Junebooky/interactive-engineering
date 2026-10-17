import React, { useState, useEffect } from 'react';
import { getCourseById, getLessonById, getDefaultCourseAndLesson } from './content/courses';
import { LearningProvider, useLearningEngine } from './engine/LearningContext';
import { getLastActiveLesson } from './engine/progressStorage';
import { Header } from './components/common/Header';
import { LessonPlayer } from './components/player/LessonPlayer';
import { CourseCatalogModal } from './components/catalog/CourseCatalogModal';

const AppContent: React.FC = () => {
  const { initLesson } = useLearningEngine();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Initial load: restore from last active lesson or default to semiconductor
  useEffect(() => {
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
      <Header onOpenCatalog={() => setIsCatalogOpen(true)} />
      
      <LessonPlayer onOpenCatalog={() => setIsCatalogOpen(true)} />

      <CourseCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectCourse={handleSelectCourse}
      />
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
