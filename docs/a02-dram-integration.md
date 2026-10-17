# A02 DRAM 1T1C (D02) 통합 보고서 및 아키텍처 명세

- **일자**: 2026-10-17
- **브랜치**: `feat/d02-a05-a06-integration` (기준 베이스: `feat/m01-a05-a06-integration` / PR #9)
- **Upstream 소스**:
  - A05 DRAM 1T1C Visual: PR #10 (`d3a5dad`)
  - A06 Curriculum Blueprint: PR #7 (`b8692e8`)
  - A02 Content Contract: `docs/a02-content-contract.md` (v0.2)
- **상태**: 통합 완료 및 Stacked Draft PR 제출 대기 (A05 upstream 블로커 분리 명시)

---

## 1. 개요 및 설계 철학

A01의 지시에 따라 A05의 DRAM PR #10(`d3a5dad`)을 A02 공식 학습 엔진(`LearningContext`, `LessonPlayer`)에 통합했습니다.
- **SSOT 원칙**: A05 Standalone Lab(`DramSceneLab`)의 로컬 상태 머신을 메인 앱에 중복 삽입하지 않고, 순수 시각화 컴포넌트(`DramSceneVisual`) 및 결정론적 수치 모형(`dramModel.ts`)만을 A02 엔진 어댑터로 연결했습니다.
- **10레슨 41스텝 계약 준수**: `docs/a02-content-contract.md`에 명시된 `Lesson`, `LessonStep`, `SimulatorType`, `ValidationRule` 스키마에 따라 D02 4단계를 구현했습니다.

---

## 2. 4단계 학습 시나리오 및 엔진 매핑

| 단계 | 스텝 ID | SimulatorType | 핵심 물리 및 학습 목표 | 검증 규칙 및 조작 시퀀스 |
|---|---|---|---|---|
| **Step 0** | `step-dram-s0-intro` | (CONCEPT) | DRAM 1T1C 도입 및 3D 스택 커패시터 개요 | 규칙 없음 (자동 통과, 예측 가림 없음) |
| **Step 1** | `step-dram-s1-write` | `dram-write` | WL 게이트 제어로 커패시터 충전 및 방전 통로 격리 | `history` contains `'charged'`, `'held'`, `answer: 'isolated'` |
| **Step 2** | `step-dram-s2-sense-restore` | `dram-sense-restore` | 0.5 VDD 사전충전 $\to$ 전하 공유(±0.05V) $\to$ 센스 증폭 $\to$ 2단 복원 | `history` contains `'shared'`, `'restored'`, `answer: 'restore'` |
| **Step 3** | `step-dram-s3-leak-refresh` | `dram-leak-refresh` | 서브문턱/접합부 전하 누설과 판독 마진 감소, 주기적 리프레시 | `history` contains `'leaked'`, `'refreshed'`, `answer: 'leak'` |
| **Step 4** | `step-dram-s4-row-bank` | `dram-row-bank` | 1개 뱅크 직렬 지연 vs 다중 뱅크(BLP) 내부 활성화 겹침 및 지연 숨김 | `history` contains `'serial'`, `'parallel'`, `answer: 'conditional'` |

---

## 3. A06 제기 블로커 격리 및 선제 방어 현황

A06이 PR #10 코드리뷰에서 제기한 2건의 핵심 차단 사항에 대해, A02 엔진은 다음과 같이 격리 및 선제 대응을 완료했습니다.

1. **D02-S02 비트 0 선택 시 0.45V vs 0.55V 하드코딩 표기 이슈**:
   - **A05 upstream 현황**: A05 `DramSceneVisual.tsx`의 텍스트 레이블 중 일부가 `bit=0`일 때도 0.55V로 표기되는 이슈가 존재하여 A05의 upstream 패치 대기 중입니다.
   - **A02 선제 조치**: `dramLesson.ts`의 스텝 설명 및 Why 해설, `dramModel.ts` 수치 모델에서는 $V_{shared} = (C_c V_{cell} + C_b V_{pre}) / (C_c + C_b)$를 정확히 계산하여 $V_{cell}=1 \to 0.55\text{V}$, $V_{cell}=0 \to 0.45\text{V}$로 동적 설명 및 검증을 완료했습니다.
2. **센스 증폭과 셀 재충전(복원) 2단계 분리**:
   - **A05 upstream 현황**: `DramSceneLab`에서 phase를 `sensed`와 `restored`로 나누었으나 비트라인 풀스윙과 셀 복원 연출의 동시성 논란이 제기되었습니다.
   - **A02 선제 조치**: A02 엔진에서는 교육적 목적(전하 파괴 $\to$ 판독 $\to$ 셀 재충전 인과관계)을 명확히 설명하는 4단계 시퀀스(`precharge` $\to$ `shared` $\to$ `sensed` $\to$ `restored`)로 정의하고, 학생이 두 단계를 모두 거치도록 `contains` 검증 규칙을 적용했습니다.

---

## 4. 검증 결과

1. **단위 및 통합 테스트**:
   - `src/__tests__/a05Dram.test.ts`: A05 물리 모델 5개 전수 통과.
   - `src/__tests__/dramIntegration.test.ts`: A02 엔진 4단계 FSM 및 조작 시퀀스 전수 통과 (5 tests).
   - Vitest 전체 결과: 7개 테스트 스위트, 47개 테스트 전수 통과 (`0.1s`).
2. **TypeScript & 번들 빌드**:
   - `oxlint`: 0 warnings, 0 errors.
   - `tsc -b && vite build`: 무경고 빌드 성공 (`dist/index.html` 1.25 kB, `dist/assets/index-BcQlkdJI.js` 391 kB).
