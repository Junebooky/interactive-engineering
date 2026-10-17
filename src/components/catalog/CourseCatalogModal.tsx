import React from 'react';
import { X, ArrowRight, Zap, Lightbulb, Cog } from 'lucide-react';
import { courses } from '../../content/courses';
import { useLearningEngine } from '../../engine/LearningContext';
import { sfx } from '../../lib/sound/sfx';

interface CourseCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse: (courseId: string, lessonId: string) => void;
}

export const CourseCatalogModal: React.FC<CourseCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectCourse,
}) => {
  const { courseId: currentCourseId, lesson: currentLesson } = useLearningEngine();

  if (!isOpen) return null;

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'semiconductor':
        return <Zap className="text-cyan-400" size={24} />;
      case 'circuits':
        return <Lightbulb className="text-amber-400" size={24} />;
      case 'mechanics':
        return <Cog className="text-purple-400" size={24} />;
      default:
        return <Zap size={24} />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card catalog-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalog-modal-title"
      >
        <div className="modal-header">
          <div>
            <h3 id="catalog-modal-title" className="modal-title">
              공학 강좌 카탈로그 (Course Catalog)
            </h3>
            <p className="modal-subtitle">
              직접 조작하며 원리를 탐구하는 대표 공학 인터랙티브 실습
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            title="닫기"
          >
            <X size={20} />
          </button>
        </div>

        <div className="catalog-courses-grid">
          {courses.map((course) => {
            const defaultLesson = course.lessons[0];
            const isCourseActive = currentCourseId === course.id;

            return (
              <div
                key={course.id}
                className={`catalog-course-card ${isCourseActive ? 'selected' : ''}`}
                onClick={() => {
                  sfx.playClick();
                  onSelectCourse(course.id, defaultLesson.id);
                  onClose();
                }}
              >
                <div className="course-card-top">
                  <div className="course-icon-box">{getIcon(course.category)}</div>
                  <span className="course-badge">{course.badge}</span>
                </div>

                <h4 className="course-card-title">{course.title}</h4>
                <p className="course-card-summary">{course.summary}</p>

                {course.lessons.length > 1 && (
                  <div className="course-lessons-list" onClick={(e) => e.stopPropagation()}>
                    {course.lessons.map((l) => {
                      const isLessonActive = isCourseActive && currentLesson?.id === l.id;
                      return (
                        <button
                          key={l.id}
                          type="button"
                          className={`course-lesson-chip ${isLessonActive ? 'active' : ''}`}
                          onClick={() => {
                            sfx.playClick();
                            onSelectCourse(course.id, l.id);
                            onClose();
                          }}
                        >
                          <span className="lesson-chip-title">{l.title}</span>
                          <span className="lesson-chip-badge">{l.steps.length}단계</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="course-card-footer">
                  <span className="lesson-step-count">
                    {course.lessons.length > 1
                      ? `${course.lessons.length}개 실습 레슨 (${course.lessons.reduce((acc, l) => acc + l.steps.length, 0)}단계)`
                      : `${defaultLesson.steps.length}개 인터랙티브 실습 스텝`}
                  </span>
                  <div className="course-card-action">
                    {isCourseActive ? (
                      <span className="current-badge">현재 강좌</span>
                    ) : (
                      <span className="select-link">
                        강좌 보기 <ArrowRight size={14} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
