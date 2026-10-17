# 인터랙티브 학습 시스템 심층 명세서 (Interaction Specification)

> **문서 상태**: DRAFT FOR A01 REVIEW  
> **분석 주체**: REA 전담 분석 에이전트  
> **대상 서비스**: [Brilliant.org](https://brilliant.org/home/)  
> **플랫폼 적용**: Interactive Engineering MVP (A02 개발 계약)  
> **증거 상태**: `OBSERVED` (Brilliant 인터랙티브 캔버스 관찰), `PROPOSED` (공학 플랫폼 독립 설계)

---

## 1. 개요 및 상호작용 철학

Brilliant의 핵심 강점은 단순한 텍스트 퀴즈가 아니라, 학습자가 **"직접 만지고, 값을 바꾸고, 실시간으로 변화를 관찰하며 법칙을 깨닫는"** 고도의 물리적 인터랙션에 있습니다.  
Interactive Engineering은 이 상호작용 원리를 계승하여, 반도체·회로·기계공학의 복잡한 수학 공식과 물리 현상을 직관적인 UI 조작으로 변환합니다.

---

## 2. 인터랙션 유형 분류 체계 (Taxonomy)

| 분류 | 유형 ID | 명칭 | 공학 도메인 적용 예시 |
|:---|:---|:---|:---|
| **선택형** | `INT-SC` | 단일 선택 카드 (Single Choice) | 논리 게이트 출력 예측 (0 or 1) |
| | `INT-MC` | 복수 선택 카드 (Multi Choice) | 단락(Short)을 일으키는 소자 조합 선택 |
| **조절형** | `INT-SLIDER-CONT` | 연속형 슬라이더 (Continuous Slider) | 게이트 전압 $V_{GS}$ 조절, 가변 저항값 변경 |
| | `INT-SLIDER-DISC` | 이산형 스텝 슬라이더 (Discrete Slider) | 기어 잇수(12, 18, 24, 36) 선택, 배터리 개수 |
| **배치/결합형** | `INT-DND-MATCH` | 드래그 앤 드롭 슬롯 (Drag & Drop) | 회로 브레드보드에 저항/커패시터 부품 삽입 |
| | `INT-OBJ-DRAG` | 오브젝트 직접 드래그 (Direct Drag) | 기어 직접 회전, 와이어 노드 연결 |
| **수학/그래프형** | `INT-DYN-GRAPH` | 동적 실시간 그래프 (Dynamic Graph) | $V_{GS}$-$I_D$ 전류 곡선, 옴의 법칙 기울기 ($1/R$) |
| | `INT-MULTI-VAR` | 다변수 결합 탐색 (Multi-Variable) | 전압($V$)과 저항($R$)을 동시 조절하여 전류($I$) 관찰 |
| **보조/반응형** | `INT-RESP-TEXT` | 실시간 반응형 인라인 텍스트 | 조작에 따라 본문 속 "$I = 2.4\text{A}$" 실시간 갱신 |
| | `INT-HINT-PROG` | 점진적 스캐폴딩 힌트 (Progressive Hint) | 1단계 직관 질문 $\to$ 2단계 위치 안내 $\to$ 3단계 해답 |
| | `INT-SOLVE-CELEB` | 승리 마이크로 애니메이션 | 정답 시 체크마크 바운스, 에너지 펄스 파티클 |

---

## 3. 인터랙션별 정밀 동작 명세 (Interaction Specifications)

---

### [INT-SLIDER-CONT] 연속형 파라미터 슬라이더
- **Interaction ID**: `INT-SLIDER-CONT`
- **Purpose**: 전압, 저항, 온도 등 연속적인 물리량을 학습자가 부드럽게 가감하면서 시스템의 실시간 반응 곡선과 물리적 변화를 체험.
- **Initial State**:
  - 슬라이더 트랙 중앙 또는 지정된 초기값 ($V_{GS} = 0.0\text{V}$)에 썸(Thumb) 위치.
  - 썸 상단에 플로팅 툴팁("0.0 V") 표시.
  - 하단 Check 버튼은 초기 비활성화(수정 전) 또는 유효 범위 진입 시 활성화.
- **User Input**:
  - 마우스 드래그, 터치 스와이프, 키보드 좌/우 화살표 키 (1 스텝 = 0.05V).
- **State Transition**:
  - 입력 수치 $v$ 변경 $\to$ 내부 상태 `state.voltage = v` 갱신 $\to$ `requestAnimationFrame`을 통해 물리 모델(MOSFET 드레인 전류) 즉시 재계산 $\to$ 캔버스 60fps 재렌더링.
- **Visual Response**:
  - 썸 드래그 중 스케일 $1.0 \to 1.25$ 확대, 테두리 글로우 효과.
  - 트랙의 채워진 영역(Filled Track)이 썸을 따라 부드럽게 확장/축소.
  - 연동된 그래픽: MOSFET 게이트 아래의 산화막에 반전 채널 전자(Cyan 도트)가 전압 제곱에 비례하여 밀도 증가.
- **Feedback**:
  - 문턱 전압($V_{th} = 0.7\text{V}$) 통과 시 햅틱 진동(모바일) 및 트랙 눈금에 미세 자석 스냅(Magnetic Snap) 효과.
- **Success Condition**: 목표 범위 내 파라미터 설정 (예: $1.2\text{V} \le V_{GS} \le 1.8\text{V}$) 후 Check 클릭.
- **Failure Condition**: 범위를 벗어난 상태에서 Check 클릭 (예: $V_{GS} < 0.7\text{V}$로 여전히 컷오프 상태).
- **Retry Behavior**: 슬라이더 조작 가능 상태 유지, 썸 위치 강제 리셋 없음.
- **Voice Behavior**:
  - 드래그 중에는 TTS 발화 차단 (과부하 방지).
  - 문턱 전압 $0.7\text{V}$ 돌파 후 1.5초 정지 시 마일스톤 발화: "게이트 전압이 문턱 전압을 넘었습니다. 채널이 열리고 있습니다." (쿨다운 4초).
- **Mobile Behavior**: 터치 타깃 최소 $48 \times 48\text{px}$ 확보, 슬라이더 조작 중 뷰포트 스크롤 방지(`touch-action: none`).
- **Implementation Suggestion**:
  - HTML `<input type="range">` 커스텀 래퍼 또는 Framer Motion / Vanilla PointerEvent 기반 구현.
  - `Math.min(max, Math.max(min, value))` 클램핑.
- **Evidence**: `OBSERVED` (Brilliant Sliders in Physics & Math courses).
- **Confidence**: `OBSERVED` (확실성 100%).

---

### [INT-SLIDER-DISC] 이산형 스텝 슬라이더
- **Interaction ID**: `INT-SLIDER-DISC`
- **Purpose**: 기어 잇수(12, 24, 36), 배터리 직렬 개수(1, 2, 3개) 등 불연속적인 정수형 물리 요소를 선택.
- **Initial State**: 트랙에 명확한 눈금(Tick Mark) 및 라벨(12T, 24T, 36T) 표시.
- **User Input**: 드래그 또는 특정 틱 클릭.
- **State Transition**: 드래그 해제 시 가장 가까운 틱으로 강한 자석 스냅(Spring Snap, stiffness: 300, damping: 25).
- **Visual Response**:
  - 선택된 틱 번호에 맞춰 캔버스의 기어 크기가 즉시 리사이징되며 이빨 맞물림(Mesh) 재정렬.
- **Feedback**: 딸깍하는 사운드 효과음(Web Audio API 클릭 음).
- **Success Condition**: 목표 기어비(예: 1:2 감속비) 달성.
- **Failure Condition**: 부적절한 기어비 선택.
- **Retry Behavior**: 이전 선택 상태 유지.
- **Voice Behavior**: 정수값 변경 시 짧은 상태 브리핑: "종동 기어 잇수를 24개로 변경했습니다."
- **Mobile Behavior**: 손가락 가림을 고려하여 값 툴팁을 손가락 상단 30px 위에 렌더링.
- **Implementation Suggestion**: `steps = [12, 24, 36, 48]` 인덱스 매핑 컴포넌트.
- **Evidence**: `OBSERVED` (Brilliant Gear & Discrete Math UI).
- **Confidence**: `OBSERVED`.

---

### [INT-DND-MATCH] 부품 드래그 앤 드롭 배치
- **Interaction ID**: `INT-DND-MATCH`
- **Purpose**: 저항, 스위치, 측정기 등의 부품을 회로 상의 올바른 슬롯(Socket)에 배치하여 회로를 완성.
- **Initial State**:
  - 화면 하단 팔레트에 드래그 가능한 부품 카드 3~4개 대기.
  - 캔버스 회로도에 점선 테두리의 빈 소켓(Target Dropzone) 노출.
- **User Input**: 부품 아이콘 터치/클릭 후 타깃 드롭존으로 포인터 이동 및 릴리즈.
- **State Transition**:
  - 드래그 시작: `draggedItem = id`, z-index 최상위 상승, 섀도우 확대.
  - 드롭존 호버: 소켓 테두리가 파란색 점선 $\to$ 실선으로 펄스 애니메이션.
  - 드롭 성공: 소켓 중앙으로 자석 스냅 결합 (`magnetizeToSlot()`).
  - 드롭 실패: 원래 팔레트 위치로 부드럽게 탄성 복귀 (`returnToPalette()`).
- **Visual Response**:
  - 부품이 회로에 장착되는 즉시 회로 배선과 전기적으로 결합되어 전류 루프 계산.
- **Feedback**: 부품 체결 시 경쾌한 스냅 사운드 및 소켓 테두리 1회 발광.
- **Success Condition**: 모든 필수 부품이 올바른 극성과 위치에 장착됨.
- **Failure Condition**: 잘못된 부품 장착 또는 소켓 미완성 상태에서 Check 클릭.
- **Retry Behavior**: 소켓에 들어간 부품을 다시 드래그하여 팔레트로 빼거나 교체 가능.
- **Voice Behavior**: 부품 체결 시: "100옴 저항이 회로에 직렬로 연결되었습니다."
- **Mobile Behavior**: 터치 딜레이 방지를 위해 `PointerEvents`의 `setPointerCapture` 활용.
- **Implementation Suggestion**:
  - HTML5 DnD는 모바일 터치 호환성이 떨어지므로, **Pointer Events API (`pointerdown`, `pointermove`, `pointerup`)** 기반 독자 구현 권장.
- **Evidence**: `OBSERVED` (Brilliant Circuit Builder & Logic Gate Assembly).
- **Confidence**: `OBSERVED`.

---

### [INT-OBJ-DRAG] 캔버스 오브젝트 직접 회전/이동
- **Interaction ID**: `INT-OBJ-DRAG`
- **Purpose**: 기어를 손으로 직접 돌리거나, 도선 와이어의 끝점을 잡아당겨 회로를 잇는 등 직관적인 물리 조작감 제공.
- **Initial State**: 상호작용 가능한 회전체(기어 1) 중앙에 회전 유도 화살표 힌트 애니메이션 노출.
- **User Input**: 기어 표면 터치 후 원형 궤적으로 드래그.
- **State Transition**:
  - 중심점 $(x_c, y_c)$와 포인터 좌표 $(x_p, y_p)$ 사이의 아크탄젠트 각도 $\theta = \text{atan2}(y_p - y_c, x_p - x_c)$ 실시간 계산.
  - 각속도 $\omega_1 = \Delta \theta / \Delta t$ 계산 $\to$ 맞물린 기어 2에 기어비($-N_1/N_2$) 곱하여 반대 방향 회전 각도 $\theta_2$ 반영.
- **Visual Response**:
  - 두 기어의 이빨이 정확히 맞물려 60fps로 실시간 상호 회전.
  - 드래그 해제 시 관성 감쇠(Inertial Damping, 감속 계수 0.92)로 서서히 멈춤.
- **Feedback**: 회전 속도에 비례하는 부드러운 회전음 또는 눈금 통과 틱.
- **Success Condition**: 지정된 방향으로 최소 1바퀴 이상 회전시켜 기어비 관계를 확인.
- **Failure Condition**: 없음 (자유 물리 탐색형 인터랙션).
- **Voice Behavior**: 기어 회전 개시 시: "기어 1을 시계 방향으로 돌려보세요. 맞물린 기어 2가 어느 방향으로 얼마나 빠르게 도는지 관찰하세요."
- **Implementation Suggestion**: SVG `transform: rotate(deg)` 또는 Canvas 2D 컨텍스트 렌더링.
- **Evidence**: `OBSERVED` (Brilliant Classical Mechanics & Everyday Physics).
- **Confidence**: `OBSERVED`.

---

### [INT-DYN-GRAPH] 동적 파라미터 연동 실시간 그래프
- **Interaction ID**: `INT-DYN-GRAPH`
- **Purpose**: 슬라이더나 회로 조작에 의해 변화하는 물리 수치(예: 전압 $V$ vs 전류 $I$)의 관계 곡선이 실시간으로 그려지는 것을 보며 수식의 기하학적 의미를 파악.
- **Initial State**:
  - 데스크톱 우측 하단에 2D 좌표축 ($X$: 전압 $0\sim 5\text{V}$, $Y$: 전류 $0\sim 50\text{mA}$) 렌더링.
  - 현재 작동점(Operating Point)을 나타내는 빛나는 점(Glowing Marker) 표시.
- **User Input**: 좌측 슬라이더 조작 ($V_{GS}$ 또는 $V$).
- **State Transition**:
  - 수치 입력에 따라 작동점 좌표 $(x, y)$가 실시간 이동.
  - 궤적이 지나간 자리에 반투명한 이력 곡선(Trace Trail)이 동적으로 드로잉됨.
- **Visual Response**:
  - 옴의 법칙: 저항값 슬라이더를 줄이면 그래프의 기울기($1/R$)가 가파르게 일어섬.
  - MOSFET: $V_{th}$ 이하에서는 바닥에 붙어있다가, $V_{th}$ 초과 시 포물선 형태로 급격히 상승(Triode/Saturation 곡선).
- **Feedback**: 그래프 축 레이블 및 수치 툴팁 실시간 반영.
- **Success Condition**: 특정 전류값(예: $I = 20\text{mA}$)에 도달하는 저항값 설정.
- **Voice Behavior**: "저항을 절반으로 줄이자 전류가 2배로 증가하여 그래프의 기울기가 두 배 가팔라졌습니다."
- **Implementation Suggestion**: 가벼운 SVG `<path>` 실시간 `d` 속성 생성 또는 Canvas 2D API.
- **Evidence**: `OBSERVED` (Brilliant Calculus & Physics Graphing Tools).
- **Confidence**: `OBSERVED`.

---

### [INT-MULTI-VAR] 다변수 상호 결합 실험 (Coupled Variables)
- **Interaction ID**: `INT-MULTI-VAR`
- **Purpose**: 공학 시스템에서 2개 이상의 독립 변수가 1개의 종속 변수에 미치는 복합적 영향을 실험 (예: 옴의 법칙 $I = V / R$).
- **Initial State**:
  - 슬라이더 1 (전압 $V$: $1\sim 12\text{V}$, 기본 $6\text{V}$).
  - 슬라이더 2 (저항 $R$: $10\sim 100\Omega$, 기본 $50\Omega$).
  - 종속 변수 디스플레이 (전류계 $I$: $0.12\text{A}$).
- **User Input**: 슬라이더 1 또는 2 임의 조작.
- **State Transition**:
  - `I = V / R` 공식에 따라 $I$ 즉시 재계산.
  - 전구 발광 전력 $P = I^2 \cdot R$ 계산.
- **Visual Response**:
  - 전구 밝기: $P$ 값에 따라 CSS 필터 `filter: drop-shadow(0 0 {P*2}px #FBBF24)` 동적 반영.
  - 도선 내 전자 이동 속도: 전류 $I$에 비례하여 CSS 애니메이션 속도(`animation-duration`)를 $2.0\text{s} \to 0.2\text{s}$로 실시간 가감.
- **Feedback**: 수치 게이지 및 시각적 밝기 동시 변화.
- **Success Condition**: 전류를 정확히 $0.24\text{A}$로 맞추시오 (예: $12\text{V} / 50\Omega$ 또는 $6\text{V} / 25\Omega$).
- **Voice Behavior**: "전압을 올리거나 저항을 낮추면 전류가 강해져 전구가 더 밝게 빛납니다."
- **Implementation Suggestion**: React 상태 관리 (`useState`, `useMemo`)로 $V, R \to I$ 파생 상태 처리.
- **Evidence**: `OBSERVED` (Brilliant Circuits & Ohm's Law exploration).
- **Confidence**: `OBSERVED`.

---

### [INT-RESP-TEXT] 반응형 인라인 본문 텍스트
- **Interaction ID**: `INT-RESP-TEXT`
- **Purpose**: 설명 텍스트가 정적으로 고정되어 있지 않고, 사용자가 캔버스를 조작할 때 본문 속 수식과 숫자가 함께 실시간 변환되어 이론과 실습의 간극 해소.
- **Initial State**:
  - 문제 지문: "현재 전압 <Badge color="blue">{voltage}V</Badge>에 저항 <Badge color="amber">{resistance}Ω</Badge>이므로, 흐르는 전류는 <Badge color="green">{current}A</Badge>입니다."
- **User Input**: 캔버스의 슬라이더 조작.
- **Visual Response**:
  - 사용자가 슬라이더를 움직이는 동안 텍스트 배지 안의 숫자가 부드럽게 카운팅 업/다운.
  - 값이 변하는 배지는 일시적으로 $1.1\times$ 스케일 펄스.
- **Evidence**: `OBSERVED` (Brilliant Reactive Text pattern in math puzzles).
- **Confidence**: `OBSERVED`.

---

### [INT-SOLVE-CELEB] 정답 통과 마이크로 모션
- **Interaction ID**: `INT-SOLVE-CELEB`
- **Purpose**: 문제 해결 순간 학습자에게 강력한 도파민 보상과 성취감을 제공.
- **Initial State**: 사용자가 정답 상태를 달성하고 "Check" 버튼 클릭.
- **Visual Response**:
  1. **T = 0ms**: Check 버튼이 부드럽게 튀어 오르며 녹색 에메랄드로 채색.
  2. **T = 50ms**: 체크마크 아이콘이 원형 궤적을 그리며 튕기듯 등장 (Elastic Pop, `cubic-bezier(0.175, 0.885, 0.32, 1.275)`).
  3. **T = 100ms**: 캔버스 회로 주변으로 가벼운 에너지 펄스 링(Circle Ring Wave)이 1회 퍼져나감.
  4. **T = 200ms**: 하단 피드백 시트가 아래에서 위로 슬라이드 업(`translateY(0)`).
- **Sound & Voice**: 경쾌한 실로폰 코드(Ding-Dong) 사운드와 함께 `EV_VOICE_CORRECT` 재생.
- **Evidence**: `OBSERVED` (Brilliant Micro-celebrations).
- **Confidence**: `OBSERVED`.

---

## 4. 미세 동작(Micro-interaction) 엔지니어링 가이드

1. **60fps 입력 반응성 (Zero-Jank Guarantee)**:
   - 슬라이더 및 드래그 중에는 무거운 DOM 재계산, 복잡한 레이아웃 리플로우(Reflow), 외부 API 호출을 일체 금지합니다.
   - 캔버스 변환은 반드시 CSS `transform`, `opacity` 또는 `<canvas>` 컨텍스트의 `clearRect` $\to$ `draw` 루프로 처리합니다.
2. **에러 셰이크(Error Shake) 물리 수치**:
   - 오답 시 진동은 학습자를 불쾌하게 하지 않도록 미세해야 합니다.
   - 진폭: $\pm 6\text{px} \to \pm 4\text{px} \to \pm 2\text{px} \to 0$.
   - 총 지속시간: $320\text{ms}$, 3회 왕복.
3. **조작과 해설의 상호 배제 레이아웃**:
   - 하단 피드백 시트나 힌트 드로어가 열릴 때, 핵심 캔버스 조작 영역을 가리지 않도록 캔버스가 위쪽으로 $20\text{px}$ 부드럽게 리포지셔닝되어야 합니다.
