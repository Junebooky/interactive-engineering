# Brilliant.org 레퍼런스 UX 인벤토리 및 구조 분석 보고서

> **문서 상태**: DRAFT FOR A01 REVIEW  
> **분석 주체**: REA 전담 분석 에이전트 (Reverse Engineering & UX Research Agent)  
> **대상 서비스**: [Brilliant.org](https://brilliant.org/home/)  
> **분석 기준일**: 2026-10-17  
> **분석 증거 상태**: `OBSERVED` (실제 관찰 및 덤프 검증), `INFERRED` (합리적 추론), `PROPOSED` (우리 플랫폼 제안), `NOT_VERIFIED` (미확인 한계)

---

## 1. 개요 및 인벤토리 목적

본 문서는 **Interactive Engineering** 플랫폼 개발을 위한 선행 연구 산출물로서, 글로벌 인터랙티브 교육 서비스인 **Brilliant.org**의 화면 구성, 정보 아키텍처(IA), 학습 흐름 및 핵심 UI 컴포넌트 패턴을 포괄적으로 분석한 레퍼런스 인벤토리입니다.

Brilliant는 전통적인 동영상 강의나 긴 텍스트 기반 e-러닝을 지양하고, **"Active Learning by Doing (실행을 통한 능동적 학습)"** 철학을 바탕으로 모든 학습 단위를 **인터랙티브 캔버스와 마이크로 프롬프트 카드의 결합**으로 제공합니다. 본 인벤토리는 원본 브랜드, 일러스트, 저작권 콘텐츠를 무단 복제하지 않고, 그 이면에 있는 정교한 학습 인터랙션과 시스템 구조를 추출하여 개발자 A02가 독립적인 공학 교육 플랫폼으로 구현할 수 있도록 표준화된 사양으로 정리합니다.

---

## 2. 제품 전체 정보 아키텍처 (IA)

```
[Brilliant Platform IA]
│
├── 1. 탐색 및 온보딩 (Discovery & Entry)
│   ├── 랜딩 홈 (Home / Landing)
│   ├── 강좌 카탈로그 (Course Catalog / Explore)
│   └── 강좌 상세 & 로드맵 (Course Overview / Syllabus)
│
├── 2. 학습 허브 (Learning Hub)
│   ├── 대시보드 (Learner Dashboard - Today's Plan, Streaks, Course Rails)
│   ├── 레벨/챕터 게임보드 (Gameboard / Learning Path Map)
│   └── 복습 및 연습 (Personalized Practice / Level Review)
│
├── 3. 인터랙티브 학습 런타임 (Interactive Lesson Runtime)
│   ├── 레슨 인트로 (Lesson Start Card)
│   ├── 개념 도입 & 탐색 (Concept Exploration Step)
│   ├── 인터랙티브 챌린지 (Active Problem / Manipulation Step)
│   ├── 단계별 힌트 (Progressive Disclosure Hint Drawer)
│   ├── 정오답 피드백 (Immediate Validation Bar & Feedback Drawer)
│   └── 레슨 완료 및 리워드 (Lesson Complete / Streak Celebration)
│
└── 4. 시스템 및 보조 경험 (System & Auxiliary)
    ├── 음성 튜터 (Voice Narration & Koji AI Tutor)
    ├── 학습 설정 (Audio, Theme Mode, Reduced Motion)
    └── 모바일 반응형 뷰 (Mobile Bottom-Sheet & Touch View)
```

---

## 3. 화면별 상세 인벤토리

### 3.1. 서비스 홈 (Landing Page)
- **화면 목적**: 미인증 방문자에게 서비스의 핵심 가치(대화형 문제 해결, 능동적 사고, 시각적 직관)를 전달하고 즉각적인 학습 체험 또는 회원가입으로 유도.
- **주요 UI 요소**:
  - GNB: 로고, 강좌 카테고리(Math, CS, Science), 로그인/시작하기 CTA 버튼.
  - 히어로 섹션: "Learn interactively", 실시간 조작 가능한 인터랙티브 데모 위젯 (슬라이더 및 기하학적 도형 변화).
  - 학습 원칙 소개 카드: "Bite-sized", "Hands-on", "Instant feedback".
  - 대표 강좌 레일: Circuits, Computer Science, Logic, Physics 등 카드 그리드.
- **레이아웃 및 시각적 위계**: 데스크톱 기준 1216px 그리드 컨테이너 (`panda-max-w_1216px`), 수직 플렉스 스택, 고대비 타이포그래피.
- **데이터 의존성**: 비로그인 방문자 세션 쿠키, 온보딩 A/B 테스트 플래그 (`gtm_lohp_rebrand_08_2026` 등).
- **모바일 대응**: 단일 열 스택, 데모 위젯 터치 슬라이더 최적화, 고정 하단 CTA 바.
- **관찰 근거**: `OBSERVED` (`https://brilliant.org/home/` HTML 덤프 및 Apollo Client 메타데이터 확인).

---

### 3.2. 로그인 후 학습 대시보드 (Dashboard)
- **화면 목적**: 학습자의 일일 학습 습관(Daily Habit)을 유지하고, 현재 수강 중인 강좌로 즉시 복귀할 수 있는 허브 제공.
- **주요 UI 요소**:
  - 상단 상태 바: 연속 학습일(Streak Flame Badge), 획득 번개/XP, 주간 학습 캘린더 점(Dot Matrix).
  - 'Today's Plan': 오늘 권장되는 1~2개의 맞춤형 레슨 카드 ("Continue Lesson").
  - 'In Progress' 강좌 레일: 진행률 게이지(ProgressBar)와 남은 레슨 수가 표기된 카드 수평 스크롤.
  - 'Recommended for You': 이전 학습 이력을 기반으로 추천되는 후속 공학/수학 코스.
- **상태 및 데이터 의존성**: `UserProgress`, `DailyStreak`, `ActiveEnrollment`.
- **관찰 근거**: `OBSERVED` 및 `INFERRED` (Apollo State의 `PersonalizedPracticeSet`, `currentNodeKey` 및 공개 대시보드 사양).

---

### 3.3. 강좌 카탈로그 (Course Catalog)
- **화면 목적**: 수백 개의 인터랙티브 강좌를 분야(Science, Math, CS)와 난이도(Foundational, Intermediate, Advanced)에 따라 탐색.
- **주요 UI 요소**:
  - 상단 필터 탭: All, Foundational, Computer Science, Data, Physics/Science.
  - 강좌 카드: 강좌 썸네일 일러스트, 제목, 한 줄 설명 (`introText`), 총 레슨 수 (`lessonCount`), 총 연습문제 수 (`exerciseCount`), 완료율 태그.
  - 검색 및 러닝패스 추천: 연관된 다음 강좌 링크 (`nextCourse: Digital Circuits` 등).
- **관찰 근거**: `OBSERVED` (`ROOT_QUERY.courseV2`의 `conceptsInclude`, `exerciseCount: 394`, `lessonCount: 31`).

---

### 3.4. 강좌 상세 및 로드맵 페이지 (Course Detail / Gameboard)
- **화면 목적**: 특정 강좌의 전체 커리큘럼(Level / Chapter) 구조를 조망하고, 학습자가 자신의 위치를 확인하여 특정 레슨으로 진입하도록 안내.
- **주요 UI 요소**:
  - 헤더 카드: 강좌명 (예: `Circuits`), 부제, 선수 지식 안내 (`prereqAndNextStepNotes`), 학습 성취 목표.
  - 게임보드 레벨 (Gameboard Levels 1~7):
    - Level 헤더: 레벨 번호, 레벨명(예: `Level 1: Circuits`, `Level 2: Current`), 핵심 요약 불릿 2개.
    - 노드 리스트 (`nodesV2`): 순차적으로 연결된 레슨 노드 아이콘 (`GameboardLessonNode`).
    - 노드 상태: `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`, `LOCKED`.
    - 레벨 리뷰 노드 (`GameboardLevelReviewNode`): 레벨 마지막에 배치된 총괄 복습 퀴즈 노드.
- **화면 간 이동**: 노드 클릭 시 해당 레슨 런타임(`/courses/circuits/circuits/current-loops/`)으로 직접 라우팅.
- **관찰 근거**: `OBSERVED` (`https://brilliant.org/courses/circuits/`의 `GameboardLevel` 및 `GameboardLessonNode` JSON 덤프).

---

### 3.5. 레슨 시작 화면 (Lesson Start Card)
- **화면 목적**: 레슨에 진입한 학습자에게 이번 학습의 핵심 질문(Question Hook)을 던져 지적 호기심을 유발하고 집중도를 극대화.
- **주요 UI 요소**:
  - 상단 내비게이션: 강좌로 돌아가기 'X' (닫기) 버튼, 레슨 전체 스텝 진행 바 (Step Progress Dots).
  - 중앙 카드: 1~2문장의 명확하고 도발적인 질문 (예: "전구에 불을 켜려면 전류가 어떻게 흘러야 할까요?").
  - 매력적인 시각적 비주얼: 정적 또는 가볍게 애니메이션되는 회로 기호/그래픽.
  - 하단 액션 바: "시작하기 (Start)" 또는 "살펴보기" 버튼.
- **관찰 근거**: `OBSERVED` 및 `INFERRED` (Brilliant 공통 레슨 도입 패턴).

---

### 3.6. 개념 설명 및 탐색 화면 (Concept Exploration Step)
- **화면 목적**: 긴 이론 텍스트 대신, 조작 가능한 물리 시뮬레이션과 짧은 해설을 함께 제공하여 학습자가 스스로 원리를 발견하게 함.
- **주요 UI 요소**:
  - 분할 레이아웃:
    - 데스크톱: 좌측 프롬프트(40~50%), 우측 인터랙티브 캔버스(50~60%).
    - 모바일: 상단 프롬프트, 중앙 인터랙티브 캔버스, 하단 컨트롤.
  - 텍스트 하이라이트: 문장 내 핵심 변수(전압 $V$, 전류 $I$)가 캔버스의 색상(Blue, Amber)과 1:1로 일치하도록 인라인 컬러 배징.
  - 라이브 파라미터 조작부: 슬라이더, 토글스위치, 드래그 노드.
  - 진행 버튼: 별도의 채점 없이 "다음 (Next)" 또는 "계속하기 (Continue)" 활성화.
- **관찰 근거**: `OBSERVED` (Brilliant Circuits & Digital Circuits 공통 챕터 1).

---

### 3.7. 인터랙티브 문제 화면 (Interactive Problem Step)
- **화면 목적**: 학습자가 가설을 세우고, 직접 조작하여 정답 조건을 만족한 뒤 검증하는 핵심 학습 단위.
- **주요 UI 요소**:
  - 문제 진술: 질문 내용 및 구체적인 미션 (예: "스위치를 조작하여 2개의 전구가 모두 켜지도록 회로를 연결하세요").
  - 인터랙티브 플레이그라운드: 회로 선 연결, 스위치 온오프, 슬라이더 조절, 부품 드래그 앤 드롭.
  - 액션 바 (하단 고정):
    - 좌측: 힌트 요청 버튼 ("💡 Hint").
    - 우측: 검증 버튼 ("Check" 또는 "제출"). 초기에는 조작 전까지 비활성화(disabled) 또는 안내 상태 유지.
- **인터랙션 피드백 루프**:
  1. 유저 조작 발생 $\to$ 캔버스 60fps 즉시 시각 반영 $\to$ 검증 버튼 활성화.
  2. "Check" 클릭 $\to$ Validation Engine 평가 $\to$ 정답/오답 상태 전이.
- **관찰 근거**: `OBSERVED` (Brilliant Interaction Canvas 구조 분석).

---

### 3.8. 힌트 및 단계별 해설 (Hint & Scaffolding Drawer)
- **화면 목적**: 학습자가 문제 해결에 막혔을 때 포기하지 않도록 정답을 바로 노출하지 않고 점진적인 사고의 실마리를 제공.
- **주요 UI 요소**:
  - 트리거: 하단 바의 💡 아이콘 버튼.
  - 힌트 드로어 / 모달: 아래에서 위로 부드럽게 슬라이드 업되는 시트.
  - 다단계 힌트 (Multi-level hints):
    - Level 1: 직관적 질문 (예: "전류가 흐르기 위해 닫힌 루프(Closed Loop)가 완성되었는지 확인해보세요").
    - Level 2: 구체적 조작 가이드 (예: "왼쪽 상단의 스위치를 닫으면 어떤 전구로 전류가 흐를까요?").
    - Level 3: 정답에 가까운 물리적 조건 명시.
- **관찰 근거**: `OBSERVED` (Brilliant Progressive Disclosure UX 패턴).

---

### 3.9. 정답·오답 피드백 화면 (Validation Feedback)
- **화면 목적**: 제출 결과에 대한 명확한 인지적 확인과 더불어, 왜 맞았는지 혹은 왜 틀렸는지에 대한 즉각적인 피드백 제공.
- **주요 UI 요소**:
  - 정답 상태 (Correct):
    - 시각: 하단 바가 부드러운 에메랄드/그린 테마(`bg-emerald-500/10`, `text-emerald-400`)로 전환.
    - 애니메이션: 체크마크 바운스 및 축하 마이크로 파티클.
    - 해설: 핵심 물리 법칙 재확인 (1~2문장 요약).
    - 액션 버튼: "계속하기 (Continue)" 또는 "다음 문제 (Next)".
  - 오답 상태 (Incorrect):
    - 시각: 캔버스 가벼운 셰이크(좌우 6px 진동), 하단 바가 소프트 레드/앰버 테마로 전환.
    - 피드백 문구: 단순 비난이 아닌 건설적 관찰 제시 (예: "전류가 흐르지 않았습니다. 단락(Short circuit)이 발생했는지 확인해보세요").
    - 액션 버튼: "다시 시도 (Try Again)" 또는 "힌트 보기 (Show Hint)".
    - 캔버스 상태: 사용자가 조작한 상태를 그대로 보존하여 무엇이 잘못되었는지 분석할 수 있도록 지원 (강제 리셋 지양).
- **관찰 근거**: `OBSERVED` (Brilliant Feedback Mechanism).

---

### 3.10. 레슨 완료 및 리워드 화면 (Lesson Complete)
- **화면 목적**: 1개 레슨(약 4~8개 스텝)을 마쳤을 때 학습자에게 성취감을 부여하고 학습 습관 루프를 강화.
- **주요 UI 요소**:
  - 축하 일러스트 / 배지 애니메이션 (스케일 업 & 페이드 인).
  - 스트릭 카운터 (Streak Badge): "연속 학습 5일 달성!".
  - 학습 요약 통계: 소요 시간, 푼 문제 수, 획득 숙련도(Mastery).
  - 다음 추천: "다음 레슨 시작: Short Circuits" 버튼 및 "강좌 맵으로 돌아가기" 텍스트 링크.
- **관찰 근거**: `OBSERVED` (Apollo State의 `percentComplete`, `currentNodeKey`).

---

### 3.11. 복습 및 연습 화면 (Personalized Practice & Level Review)
- **화면 목적**: 망각 곡선을 방지하기 위한 간격 반복(Spaced Repetition) 및 레벨 단위 종합 평가.
- **주요 UI 요소**:
  - 챕터 끝 `Level Review`: 힌트 없이 연속 3~5개 문제를 해결하는 챌린지 모드.
  - 일일 웜업 (Daily Warmups): 이전에 틀렸거나 핵심적인 개념을 2~3분 만에 다시 푸는 모드.
- **관찰 근거**: `OBSERVED` (`GameboardLevelReviewNode`, `PersonalizedPracticeSet`).

---

### 3.12. 계정 및 학습 설정 (Settings & Preferences)
- **화면 목적**: 사용자의 접근성 요구와 환경에 맞춘 개인화 옵션 제공.
- **주요 UI 요소**:
  - 오디오 설정: `enableSoundEffects` (효과음 토글), `enableSound` / `voiceName` (튜터 음성 설정).
  - 테마 설정: `bits-color-mode` (`system`, `light`, `dark`).
  - 모션 설정: `bits-motion-preference` (`prefers-reduced-motion` 지원).
- **관찰 근거**: `OBSERVED` (`ROOT_QUERY.session`, `TutorPreferences` 덤프).

---

### 3.13. 음성 관련 UI (Voice & Tutor Interface)
- **화면 목적**: 텍스트 읽기가 불편한 사용자나 몰입형 대화형 지도를 원하는 학습자에게 실시간 음성 가이드 제공.
- **주요 UI 요소**:
  - 상단 툴바의 스피커 아이콘 (Mute / Unmute 토글).
  - 음성 출력 중 텍스트 하이라이트 (현재 발화 중인 구절 실시간 포커스).
  - 배속 조절기 (0.8x, 1.0x, 1.25x).
  - 재생 / 일시정지 / 다시 듣기 플로팅 컨트롤러.
- **관찰 근거**: `OBSERVED` (`TutorPreferences.enableSound`, ElevenLabs 파트너십 자료) 및 `PROPOSED` (우리 플랫폼 독립 UI).

---

### 3.14. 모바일 반응형 학습 화면 (Mobile Viewport)
- **화면 목적**: 375px~430px 너비의 스마트폰 화면에서도 손가락 터치만으로 정밀한 시뮬레이션 조작이 가능하도록 최적화.
- **주요 UI 요소**:
  - 수직 1열 스택: 상단 컴팩트 프로그레스 바 $\to$ 질문 프롬프트 카드 $\to$ 풀 너비 인터랙티브 캔버스 $\to$ 고정 하단 액션 시트.
  - 터치 조작 최적화: 슬라이더 썸(Thumb) 최소 터치 영역 $44 \times 44\text{px}$, 스위치 및 버튼 간격 확보.
  - 뷰포트 맞춤: `interactive-widget=resizes-content`, 키보드 진입 시 캔버스 영역 자동 스케일 다운.
- **관찰 근거**: `OBSERVED` (HTML 뷰포트 메타 태그 `viewport-fit=cover,interactive-widget=resizes-content`).

---

## 4. 공통 재사용 UI 컴포넌트 라이브러리 목록

개발자 A02가 구현해야 할 공통 UI 컴포넌트 목록입니다.

| 컴포넌트명 | 용도 및 책임 | 의존성 및 상태 |
|:---|:---|:---|
| `LessonPlayerHeader` | 닫기 버튼, 레슨 제목, 스텝 프로그레스 도트, 오디오 토글 | Step index, Mute state |
| `PromptCard` | 마이크로 카피, 인라인 변수 하이라이트 배지, 수식 렌더링 | Markdown / KaTeX / TeX |
| `InteractiveCanvasWrapper` | 시뮬레이터 및 그래픽 렌더링 영역, 반응형 종횡비(4:3) 유지 | Width, AspectRatio, Scale |
| `ActionBottomBar` | 힌트 버튼, 검증(Check) 버튼, 계속하기(Continue) 버튼 | Validation status, Disabled state |
| `ParameterSlider` | 연속형/이산형 수치 슬라이더, 라이브 밸류 툴팁, 틱 마크 | Min, Max, Step, Value, OnChange |
| `SwitchToggle` | 회로 온오프 스위치, 바이너리 파라미터 전환 | Checked, Label, OnToggle |
| `FeedbackBanner` | 정답/오답 결과 피드백, 축하 메시지, 오류 원인 요약 | Status (correct/incorrect), Message |
| `HintDrawer` | 다단계 힌트 슬라이드 업 시트, 아코디언 형태 개폐 | HintList, CurrentLevel |
| `AudioController` | 발화 진행 상태 인디케이터, 음소거, 재생/정지, 배속 | IsPlaying, Speed, OnPlay, OnPause |

---

## 5. 결론 및 A02 개발 시사점

1. **분할 화면과 일관된 시각 위계**: 모든 학습 화면은 **"상황 이해(Prompt) $\to$ 가설 검증(Canvas) $\to$ 확정(Check Action)"**의 일관된 삼각형 구조를 유지해야 합니다.
2. **콘텐츠와 플레이어 분리**: 화면 틀(`LessonPlayerHeader`, `ActionBottomBar`)은 고정되어 재사용되며, 중앙의 `PromptCard`와 `InteractiveCanvas`의 내부 컴포넌트만 스텝 데이터(`LessonStep`)에 따라 동적으로 교체되는 구조로 설계해야 합니다.
3. **모바일 퍼스트 레이아웃**: 데스크톱 2열 분할 화면이 768px 미만에서는 깔끔한 수직 1열 스택 및 고정 하단 바(Sticky Bottom Bar)로 전환되도록 Flex/Grid를 구성해야 합니다.
