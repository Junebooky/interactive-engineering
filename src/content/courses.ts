import type { Course } from '../types';
import { mosfetLesson } from './semiconductor/mosfetLesson';
import { dramLesson } from './semiconductor/dramLesson';
import { sramLesson } from './semiconductor/sramLesson';
import { ohmsLawLesson } from './circuits/ohmsLawLesson';
import { gearsLesson } from './mechanics/gearsLesson';

export const courses: Course[] = [
  {
    id: 'course-semiconductor',
    title: '반도체 소자 및 디지털 논리',
    slug: 'semiconductor-engineering',
    category: 'semiconductor',
    categoryLabel: '반도체 공학',
    badge: '⚡ 반도체 핵심',
    summary: 'MOSFET 전도 채널 형성에서부터 1T1C DRAM 메모리 셀과 6T SRAM 캐시 및 GPU 데이터 지역성까지 탐구하는 시그니처 코스',
    estimatedMinutes: 35,
    lessons: [mosfetLesson, dramLesson, sramLesson],
  },
  {
    id: 'course-circuits',
    title: '전기회로와 옴의 법칙 (V = I × R)',
    slug: 'electric-circuits',
    category: 'circuits',
    categoryLabel: '전기전자공학',
    badge: '💡 전기전자',
    summary: '폐루프 도선 속 전자의 표류 운동, 가변 저항에 따른 전류 변화 및 전구 필라멘트 발열과 전력 소비를 체험하는 회로 실습 코스',
    estimatedMinutes: 12,
    lessons: [ohmsLawLesson],
  },
  {
    id: 'course-mechanics',
    title: '기계 원리와 기어 동력 전달',
    slug: 'mechanical-gears',
    category: 'mechanics',
    categoryLabel: '기계공학',
    badge: '⚙️ 기계공학',
    summary: '외접 톱니바퀴 맞물림의 회전 방향 반전과 잇수 비율에 따른 각속도 감속 및 토크 3배 증폭 메커니즘을 손으로 직접 돌려보는 실습 코스',
    estimatedMinutes: 12,
    lessons: [gearsLesson],
  },
];

export function getCourseById(courseId: string): Course | undefined {
  return courses.find((c) => c.id === courseId);
}

export function getLessonById(courseId: string, lessonId: string) {
  const course = getCourseById(courseId);
  return course?.lessons.find((l) => l.id === lessonId);
}

export function getDefaultCourseAndLesson() {
  return {
    course: courses[0],
    lesson: courses[0].lessons[0],
  };
}
