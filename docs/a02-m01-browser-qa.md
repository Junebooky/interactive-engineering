# A02 M01 MOSFET Actual App Chromium Browser QA Report

이 문서는 A02 실제 통합 앱(`LessonPlayer.tsx`)의 실제 사용자 학습 완주 경로에 대한 Chromium 브라우저 자동화 QA 결과 및 검증 매트릭스를 기록합니다.

---

## 1. QA 환경 및 실행 정보
- **테스트 러너**: Chromium Headless (Playwright 1.56.1, `--no-sandbox`)
- **실행 스크립트**: `scripts/m01-app-browser-smoke.mjs`
- **검증 URL**: `http://127.0.0.1:4182/` (A02 메인 앱 진입점)
- **CI 워크플로**: `.github/workflows/m01-app-browser-qa.yml`
- **스크린샷 아티팩트 경로**: `browser-evidence/m01-app/`

---

## 2. 검증 매트릭스 및 결과

| 단계 | 검증 항목 | 세부 확인 내용 | 검증 결과 | 캡처 아티팩트 |
|---|---|---|:---:|---|
| **Step 0** | 개념 도입 & Voice | 스케이트보드 하프파이프 비유 노출, 헤더 한국어 Voice 토글 클릭 (Mute/Unmute) | **PASS** | `01-app-step0-concept.png` |
| **Step 1 (S01)** | 예측 가림 (Veil) | 예측 라디오 선택 전 관찰 영역 가림(`.a05-veiled`), 예측 선택 후 2.5D MOSFET 단면 컷어웨이 출현 | **PASS** | `02-app-s01-veiled.png`<br>`03-app-s01-unveiled.png` |
| **Step 1 (S01)** | 슬라이더 & 오개념 | $V_{GS}$ 0.6V, 0.7V(경계), 1.2V 조작. 오답("산화막을 뚫고...") 제출 시 개별 ✗ 규칙 진단 및 오개념 피드백 | **PASS** | `04-app-s01-misconception.png` |
| **Step 1 (S01)** | 힌트, 정답 & Why | 힌트 보기 클릭, 정답 선택 후 실행 검증(개별 ✓ 통과), 심층 "Why? 원리" 모달 노출 | **PASS** | `05-app-s01-pass.png`<br>`06-app-s01-why-modal.png` |
| **Step 2 (S02)** | VDS 드리프트 | 예측 $\to$ $V_{DS}$ 슬라이더 조작(1.5V) $\to$ 핀치오프 후에도 포화 전류 유지 확인 $\to$ 검증 통과 | **PASS** | `07-app-s02-pass.png` |
| **Step 3 (S03)** | 저항형 nMOS 인버터 | 입력 5V 토글 클릭 $\to$ nMOS ON 및 $V_{OUT} \approx 0.45\text{V}$ (LOW) 판독 확인 $\to$ 풀다운 원리 검증 통과 | **PASS** | `08-app-s03-inverter-045v.png` |
| **Step 4 (S04)** | 상보형 CMOS NOT | pMOS/nMOS 상보 스위칭 토글 $\to$ 진리표(out0=1, out1=0) 완성 $\to$ 3개 조건 동시 통과 | **PASS** | `09-app-s04-cmos-pass.png` |
| **Completion** | 학습 완료 화면 | 4단계 완주 후 `CompletionCard` (축하 메시지, 카탈로그 복귀 등) 출현 | **PASS** | `10-app-completion-card.png` |
| **Persistence** | 저장 및 복원 | `page.reload()` 실행 후 로컬스토리지 진척도 및 완료 상태 유지 확인 | **PASS** | (검증 완료) |
| **QA Lab** | Standalone 연동 | 헤더의 `🧪 QA Lab` 버튼 클릭 시 A05 4개 씬 샌드박스 모달 정상 표시 및 닫기 | **PASS** | `11-app-qa-lab-modal.png` |
| **Responsive** | 모바일 반응형 | 375px (iPhone 13), 320px (Small Mobile) 뷰포트에서 가로 스크롤 오버플로 없음(`scrollWidth <= clientWidth + 2`) | **PASS** | `12-app-mobile-375.png`<br>`13-app-mobile-320.png` |

---

## 3. 미실행 영역 (QA 환경 제약)
헤드리스 Linux/macOS CI 및 브라우저 에뮬레이터 환경의 특성상 다음 항목은 **미실행**으로 분류하며, 추후 실기기 QA 단계에서 검증합니다:
1. **물리 디바이스 터치스크린**: 실제 스마트폰/태블릿 디바이스의 하드웨어 터치 감도 및 핀치 줌 제스처.
2. **OS 네이티브 한국어 음성팩 합성**: 헤드리스 Chromium에는 한국어 TTS 음성 합성 엔진이 내장되어 있지 않아 실제 발화 음향 청취는 미실행 (Web Speech API 호출 이벤트 및 Fallback 동작만 검증).
3. **화면 낭독기 접근성 (VoiceOver / TalkBack)**: 실제 OS 스크린리더 음성 낭독 흐름.
