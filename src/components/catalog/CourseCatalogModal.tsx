import React, { useState, useEffect, useCallback, useId } from 'react';
import { X, ArrowRight, BookOpen, Compass } from 'lucide-react';
import { courses } from '../../content/courses';
import { useLearningEngine } from '../../engine/LearningContext';
import { sfx } from '../../lib/sound/sfx';
import './courseCatalogA03.css';

interface CourseCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse: (courseId: string, lessonId: string) => void;
}

type FilterCategory = 'all' | 'circuits' | 'semiconductor' | 'memory' | 'computing' | 'mechanics';

interface CategoryFilterOption {
  key: FilterCategory;
  label: string;
}

const CATEGORY_OPTIONS: CategoryFilterOption[] = [
  { key: 'all', label: '전체' },
  { key: 'circuits', label: '전기회로' },
  { key: 'semiconductor', label: '반도체' },
  { key: 'memory', label: '메모리' },
  { key: 'computing', label: '컴퓨팅' },
  { key: 'mechanics', label: '기계공학' },
];

function getLessonCategory(lessonId: string): { key: FilterCategory; label: string } {
  if (lessonId.includes('electricity') || lessonId.includes('circuits') || lessonId.includes('ohms')) {
    return { key: 'circuits', label: '전기회로' };
  }
  if (lessonId.includes('pn') || lessonId.includes('mos-capacitor') || lessonId.includes('mosfet')) {
    return { key: 'semiconductor', label: '반도체' };
  }
  if (lessonId.includes('dram') || lessonId.includes('sram') || lessonId.includes('nand')) {
    return { key: 'memory', label: '메모리' };
  }
  if (lessonId.includes('gpu')) {
    return { key: 'computing', label: '컴퓨팅' };
  }
  if (lessonId.includes('gears') || lessonId.includes('mechanics')) {
    return { key: 'mechanics', label: '기계공학' };
  }
  return { key: 'semiconductor', label: '반도체' };
}

function getLearnerFriendlyTitle(lessonId: string, fullTitle: string): string {
  if (lessonId.includes('electricity')) return '전기 기초 & RC 시정수';
  if (lessonId.includes('pn')) return 'PN 접합 다이오드';
  if (lessonId.includes('mos-capacitor')) return 'MOS 커패시터';
  if (lessonId.includes('mosfet')) return 'MOSFET 트랜지스터';
  if (lessonId.includes('dram')) return 'DRAM 1T-1C 메모리';
  if (lessonId.includes('sram')) return 'SRAM 6T 고속 캐시';
  if (lessonId.includes('nand')) return 'NAND 플래시 & eSSD';
  if (lessonId.includes('gpu')) return 'GPU & HBM 메모리 구조';
  if (lessonId.includes('circuits') || lessonId.includes('ohms')) return '옴의 법칙과 DC 회로';
  if (lessonId.includes('gears') || lessonId.includes('mechanics')) return '기어 동력 전달과 토크';
  return fullTitle.split('—')[0].replace(/^\d+\.\s*/, '').trim();
}

const CatalogCardThumbnail: React.FC<{ lessonId: string; title: string }> = ({ lessonId, title }) => {
  const uid = useId().replace(/:/g, '');

  return (
    <div className="a03-card-thumb" aria-hidden="true">
      <svg
        className="a03-thumb-svg"
        viewBox="0 0 320 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`thumb-bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#102535" />
            <stop offset="100%" stopColor="#0B1A24" />
          </linearGradient>
          <linearGradient id={`thumb-teal-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2CD5B3" />
            <stop offset="100%" stopColor="#087C6D" />
          </linearGradient>
          <linearGradient id={`thumb-gold-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FAD375" />
            <stop offset="100%" stopColor="#C49226" />
          </linearGradient>
          <linearGradient id={`thumb-metal-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8D6DF" />
            <stop offset="100%" stopColor="#7E96A6" />
          </linearGradient>
          <linearGradient id={`thumb-oxide-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFA64D" />
            <stop offset="100%" stopColor="#AD6524" />
          </linearGradient>
        </defs>

        <rect width="320" height="200" fill={`url(#thumb-bg-${uid})`} />

        {(lessonId.includes('circuits') || lessonId.includes('ohms')) && (
          <g transform="translate(20, 15)">
            {/* Battery */}
            <rect x="25" y="60" width="45" height="60" rx="8" fill={`url(#thumb-gold-${uid})`} stroke="#FFE59E" strokeWidth="1.5" />
            <text x="47" y="96" textAnchor="middle" fontSize="13" fontWeight="850" fill="#241B08">5V</text>
            {/* Wires */}
            <path d="M47 60 V35 H150 M190 35 H245 V130 H47 V120" stroke="#4DA3BD" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Switch */}
            <circle cx="150" cy="35" r="5" fill="#2CD5B3" />
            <circle cx="190" cy="35" r="5" fill="#2CD5B3" />
            <path d="M150 35 L180 15" stroke="#FAD375" strokeWidth="4" strokeLinecap="round" />
            {/* Resistor */}
            <rect x="215" y="70" width="60" height="30" rx="6" fill={`url(#thumb-metal-${uid})`} stroke="#E6F2F8" strokeWidth="1.5" />
            <text x="245" y="90" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0C1B24">1 kΩ</text>
          </g>
        )}

        {lessonId.includes('electricity') && (
          <g transform="translate(25, 20)">
            {/* RC Charging Curve */}
            <path d="M25 130 H240" stroke="#37556A" strokeWidth="2" strokeDasharray="4 3" />
            <path d="M25 130 V25" stroke="#37556A" strokeWidth="2" strokeDasharray="4 3" />
            <path d="M25 130 Q90 50, 230 45" stroke="#2CD5B3" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Capacitor plates */}
            <rect x="180" y="85" width="8" height="40" rx="2" fill={`url(#thumb-metal-${uid})`} />
            <rect x="195" y="85" width="8" height="40" rx="2" fill={`url(#thumb-metal-${uid})`} />
            <text x="195" y="145" textAnchor="middle" fontSize="10" fontWeight="700" fill="#A4CEE0">RC 충전 곡선</text>
          </g>
        )}

        {lessonId.includes('pn') && (
          <g transform="translate(35, 30)">
            {/* P-region */}
            <rect x="20" y="30" width="105" height="85" rx="6" fill="#1C475F" stroke="#3A7599" strokeWidth="1.5" />
            <text x="72" y="68" textAnchor="middle" fontSize="13" fontWeight="850" fill="#8CE1FF">P형 (양공)</text>
            <text x="72" y="88" textAnchor="middle" fontSize="10" fill="#BCE6F5">⊕ ⊕ ⊕</text>
            {/* N-region */}
            <rect x="125" y="30" width="105" height="85" rx="6" fill="#143B4E" stroke="#2D6682" strokeWidth="1.5" />
            <text x="177" y="68" textAnchor="middle" fontSize="13" fontWeight="850" fill="#75F6DC">N형 (전자)</text>
            <text x="177" y="88" textAnchor="middle" fontSize="10" fill="#C5F7EC">⊖ ⊖ ⊖</text>
            {/* Depletion line */}
            <line x1="125" y1="20" x2="125" y2="125" stroke="#FAD375" strokeWidth="3" strokeDasharray="4 3" />
            <text x="125" y="138" textAnchor="middle" fontSize="10" fontWeight="800" fill="#FAD375">공핍 접합면</text>
          </g>
        )}

        {lessonId.includes('mos-capacitor') && (
          <g transform="translate(35, 25)">
            {/* Metal */}
            <rect x="40" y="25" width="170" height="25" rx="4" fill={`url(#thumb-metal-${uid})`} stroke="#E6F2F8" strokeWidth="1.5" />
            <text x="125" y="42" textAnchor="middle" fontSize="11" fontWeight="850" fill="#0C1B24">Metal Gate</text>
            {/* Oxide */}
            <rect x="40" y="50" width="170" height="18" fill={`url(#thumb-oxide-${uid})`} stroke="#FF9C3D" strokeWidth="1" />
            <text x="125" y="63" textAnchor="middle" fontSize="9" fontWeight="800" fill="#FFF">SiO₂ Oxide</text>
            {/* Substrate */}
            <rect x="40" y="68" width="170" height="60" rx="4" fill="#1D4B63" stroke="#3A7599" strokeWidth="1.5" />
            <text x="125" y="105" textAnchor="middle" fontSize="12" fontWeight="800" fill="#A8E2F7">P-Substrate</text>
          </g>
        )}

        {lessonId.includes('mosfet') && (
          <g transform="translate(25, 20)">
            {/* Gate Stack */}
            <rect x="100" y="30" width="70" height="20" rx="4" fill={`url(#thumb-metal-${uid})`} stroke="#E4F0F7" strokeWidth="1.5" />
            <rect x="100" y="50" width="70" height="10" fill={`url(#thumb-oxide-${uid})`} stroke="#FFA64D" strokeWidth="1" />
            {/* Substrate */}
            <rect x="30" y="60" width="210" height="75" rx="8" fill="#1C485E" stroke="#3A7599" strokeWidth="1.5" />
            {/* Source / Drain */}
            <rect x="45" y="60" width="45" height="35" rx="4" fill="#186358" stroke="#3AE2BC" strokeWidth="1.5" />
            <text x="67" y="82" textAnchor="middle" fontSize="10" fontWeight="800" fill="#D3F8EF">N+ (S)</text>
            <rect x="180" y="60" width="45" height="35" rx="4" fill="#186358" stroke="#3AE2BC" strokeWidth="1.5" />
            <text x="202" y="82" textAnchor="middle" fontSize="10" fontWeight="800" fill="#D3F8EF">N+ (D)</text>
            {/* Channel */}
            <path d="M90 70 H180" stroke="#FAD375" strokeWidth="3" strokeDasharray="3 2" />
            <text x="135" y="120" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFEAA8">VGS ≥ Vth 채널 전도</text>
          </g>
        )}

        {lessonId.includes('dram') && (
          <g transform="translate(30, 20)">
            {/* Wordline & Bitline */}
            <line x1="30" y1="40" x2="230" y2="40" stroke="#FAD375" strokeWidth="3" strokeLinecap="round" />
            <text x="40" y="32" fontSize="9" fontWeight="800" fill="#FAD375">WL (Gate)</text>
            <line x1="70" y1="30" x2="70" y2="135" stroke="#3EE0C2" strokeWidth="3" strokeLinecap="round" />
            {/* 1T Switch */}
            <rect x="110" y="55" width="40" height="30" rx="5" fill="#1A4A61" stroke="#68B0CE" strokeWidth="1.5" />
            <text x="130" y="74" textAnchor="middle" fontSize="11" fontWeight="800" fill="#E6F5FA">1T</text>
            {/* 1C Capacitor */}
            <rect x="180" y="52" width="42" height="36" rx="6" fill={`url(#thumb-teal-${uid})`} stroke="#72F6DC" strokeWidth="1.5" />
            <text x="201" y="74" textAnchor="middle" fontSize="11" fontWeight="850" fill="#03201A">1C</text>
            {/* Connection */}
            <path d="M70 70 H110 M150 70 H180" stroke="#90C8DF" strokeWidth="2.5" />
            <text x="145" y="125" textAnchor="middle" fontSize="10" fontWeight="700" fill="#9CE1F8">1T-1C 메모리 셀</text>
          </g>
        )}

        {lessonId.includes('sram') && (
          <g transform="translate(35, 25)">
            {/* Inverter 1 & 2 */}
            <rect x="30" y="40" width="70" height="42" rx="6" fill="#1A4A61" stroke="#4FACCF" strokeWidth="1.5" />
            <text x="65" y="65" textAnchor="middle" fontSize="12" fontWeight="850" fill="#B4E8F8">INV 1</text>
            <rect x="150" y="40" width="70" height="42" rx="6" fill="#1A4A61" stroke="#4FACCF" strokeWidth="1.5" />
            <text x="185" y="65" textAnchor="middle" fontSize="12" fontWeight="850" fill="#B4E8F8">INV 2</text>
            {/* Cross coupling */}
            <path d="M100 52 H125 V32 H135 M150 52 H125 V72 H115" stroke="#FAD375" strokeWidth="2.5" fill="none" />
            <text x="125" y="115" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFEAA8">상호 결합 6T 래치</text>
          </g>
        )}

        {lessonId.includes('nand') && (
          <g transform="translate(35, 20)">
            {/* 3D Vertical String */}
            <rect x="50" y="25" width="60" height="22" rx="4" fill="#1A495E" stroke="#52A0BE" strokeWidth="1" />
            <rect x="50" y="52" width="60" height="22" rx="4" fill={`url(#thumb-oxide-${uid})`} stroke="#FFA64D" strokeWidth="1" />
            <rect x="50" y="78" width="60" height="22" rx="4" fill={`url(#thumb-oxide-${uid})`} stroke="#FFA64D" strokeWidth="1" />
            <rect x="50" y="104" width="60" height="22" rx="4" fill={`url(#thumb-oxide-${uid})`} stroke="#FFA64D" strokeWidth="1" />
            <rect x="25" y="20" width="16" height="110" rx="5" fill="#2CD5B3" />
            {/* Info */}
            <rect x="130" y="45" width="105" height="55" rx="6" fill="#0D202D" stroke="#25516B" />
            <text x="182" y="68" textAnchor="middle" fontSize="10" fontWeight="800" fill="#FAD375">비휘발성 CTN</text>
            <text x="182" y="86" textAnchor="middle" fontSize="9" fill="#B4DBED">전하 트랩 셀</text>
          </g>
        )}

        {lessonId.includes('gpu') && (
          <g transform="translate(25, 20)">
            {/* GPU Core Grid */}
            <rect x="25" y="25" width="115" height="105" rx="8" fill="#133C50" stroke="#3FA8CE" strokeWidth="1.5" />
            <text x="82" y="45" textAnchor="middle" fontSize="11" fontWeight="850" fill="#9DE1F8">GPU SM Cores</text>
            {[0, 1].map((r) =>
              [0, 1, 2].map((c) => (
                <rect key={`${r}-${c}`} x={38 + c * 30} y={55 + r * 28} width={24} height={20} rx="3" fill="#0C7C6D" stroke="#5CF0D6" strokeWidth="1" />
              ))
            )}
            {/* HBM Stack */}
            <rect x="165" y="25" width="80" height="105" rx="8" fill="#292314" stroke="#FAD375" strokeWidth="1.5" />
            <text x="205" y="45" textAnchor="middle" fontSize="11" fontWeight="850" fill="#FFEAA8">HBM3e</text>
            {[0, 1, 2, 3].map((l) => (
              <rect key={l} x={175} y={55 + l * 18} width={60} height={12} rx="2" fill="#C49226" stroke="#FFE08F" strokeWidth="1" />
            ))}
            {/* Bus arrow */}
            <path d="M140 75 H165" stroke="#FFEAA8" strokeWidth="3" strokeDasharray="4 2" />
          </g>
        )}

        {(lessonId.includes('gears') || lessonId.includes('mechanics')) && (
          <g transform="translate(30, 20)">
            {/* Left Gear */}
            <circle cx="85" cy="75" r="45" fill="#1B4A62" stroke="#42A9D1" strokeWidth="2" />
            <circle cx="85" cy="75" r="10" fill="#0C1D26" stroke="#63C6EB" strokeWidth="1.5" />
            <text x="85" y="78" textAnchor="middle" fontSize="9" fontWeight="800" fill="#D3F2FD">N1 (구동)</text>
            {/* Right Gear */}
            <circle cx="165" cy="75" r="45" fill="#143D52" stroke="#36E1BA" strokeWidth="2" />
            <circle cx="165" cy="75" r="10" fill="#0C1D26" stroke="#68F3D3" strokeWidth="1.5" />
            <text x="165" y="78" textAnchor="middle" fontSize="9" fontWeight="800" fill="#D3F8EF">N2 (종동)</text>
            {/* Mesh point */}
            <circle cx="125" cy="75" r="4" fill="#FAD375" />
            <text x="125" y="135" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFEAA8">외접 톱니 맞물림 토크 증폭</text>
          </g>
        )}

        <text x="16" y="186" fill="#8FAEC0" fontSize="10" fontWeight="700" letterSpacing="-0.1">
          {title}
        </text>
      </svg>
    </div>
  );
};

export const CourseCatalogModal: React.FC<CourseCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectCourse,
}) => {
  const { courseId: currentCourseId, lesson: currentLesson } = useLearningEngine();
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');

  // Handle ESC key to close modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // Derive flat discoverable catalog items directly from courses metadata
  const allCatalogItems = courses.flatMap((course) =>
    course.lessons.map((lesson) => {
      const cat = getLessonCategory(lesson.id);
      return {
        courseId: course.id,
        lessonId: lesson.id,
        lesson,
        categoryKey: cat.key,
        categoryLabel: cat.label,
      };
    })
  );

  const filteredItems =
    selectedCategory === 'all'
      ? allCatalogItems
      : allCatalogItems.filter((item) => item.categoryKey === selectedCategory);

  return (
    <div
      className="a03-catalog-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="a03-catalog-heading"
    >
      <div
        className="a03-catalog-shell"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="a03-catalog-header">
          <div>
            <div className="a03-catalog-brand">
              <Compass size={14} />
              <span>Interactive Engineering Library</span>
            </div>
            <h2 id="a03-catalog-heading" className="a03-catalog-title">
              오늘은 무엇을 발견해 볼까요?
            </h2>
            <p className="a03-catalog-sub">
              손으로 직접 전압과 스위치를 조작하며 물리학과 전자·기계 시스템의 원리를 발견합니다.
            </p>
          </div>
          <button
            type="button"
            className="a03-catalog-close-btn"
            onClick={onClose}
            aria-label="카탈로그 닫기"
          >
            <X size={18} />
            <span>닫기 (Esc)</span>
          </button>
        </header>

        {/* Scrollable Body */}
        <div className="a03-catalog-body">
          {/* Hero: Continue Learning Strip (Real metadata only) */}
          {currentLesson && (
            <section className="a03-catalog-hero" aria-label="이어서 배우기">
              <div className="a03-hero-left">
                <span className="a03-hero-badge">이어서 배우기 · Active</span>
                <h3 className="a03-hero-title">{currentLesson.title}</h3>
                <p className="a03-hero-meta">
                  총 {currentLesson.steps.length}개 탐구 단계 중 실습 진행 중 · 언제든 즉시 복귀 가능
                </p>
              </div>
              <button
                type="button"
                className="a03-hero-btn"
                onClick={() => {
                  sfx.playClick();
                  onClose();
                }}
              >
                <span>이어서 탐구하기</span>
                <ArrowRight size={16} />
              </button>
            </section>
          )}

          {/* Category Filter Chips */}
          <nav
            className="a03-catalog-filters"
            role="tablist"
            aria-label="주제별 분류 필터"
          >
            {CATEGORY_OPTIONS.map((opt) => {
              const count =
                opt.key === 'all'
                  ? allCatalogItems.length
                  : allCatalogItems.filter((i) => i.categoryKey === opt.key).length;
              const isSelected = selectedCategory === opt.key;

              return (
                <button
                  key={opt.key}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`a03-filter-chip ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    sfx.playClick();
                    setSelectedCategory(opt.key);
                  }}
                >
                  <span>{opt.label}</span>
                  <span style={{ fontSize: '11px', opacity: 0.75 }}>({count})</span>
                </button>
              );
            })}
          </nav>

          {/* Discovery Card Grid */}
          <div className="a03-catalog-grid" role="list">
            {filteredItems.map(({ courseId, lessonId, lesson, categoryLabel }) => {
              const isCurrentActive =
                currentCourseId === courseId && currentLesson?.id === lessonId;

              const friendlyTitle = getLearnerFriendlyTitle(lessonId, lesson.title);

              return (
                <article
                  key={lessonId}
                  role="listitem"
                  tabIndex={0}
                  className={`a03-course-card ${isCurrentActive ? 'active-lesson' : ''}`}
                  onClick={() => {
                    sfx.playClick();
                    onSelectCourse(courseId, lessonId);
                    onClose();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      sfx.playClick();
                      onSelectCourse(courseId, lessonId);
                      onClose();
                    }
                  }}
                  aria-label={`${friendlyTitle} 실습 탐구, 총 ${lesson.steps.length}단계`}
                >
                  <CatalogCardThumbnail lessonId={lessonId} title={friendlyTitle} />

                  <div className="a03-card-badge-row">
                    <span className="a03-card-cat-badge">{categoryLabel}</span>
                    <span className="a03-card-steps-badge">{lesson.steps.length}단계 실습</span>
                  </div>

                  <h3 className="a03-card-title">{friendlyTitle}</h3>
                  <p className="a03-card-desc">
                    {lesson.description || lesson.subtitle || '상호작용 시뮬레이터를 조작하며 공학 원리를 직접 탐구합니다.'}
                  </p>

                  <div className="a03-card-footer">
                    <span className="a03-card-action-text">
                      {isCurrentActive ? (
                        <>
                          <span>현재 실습 중</span>
                          <span aria-hidden="true">⚑</span>
                        </>
                      ) : (
                        <>
                          <span>탐구하기</span>
                          <ArrowRight size={13} />
                        </>
                      )}
                    </span>
                    <BookOpen size={14} style={{ color: '#8BA5B2' }} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
