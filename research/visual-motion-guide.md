# 시각 디자인 및 모션 시스템 가이드 (Visual & Motion Guide)

> **문서 상태**: DRAFT FOR A01 REVIEW  
> **분석 주체**: REA 전담 분석 에이전트  
> **대상 서비스**: [Brilliant.org](https://brilliant.org/home/)  
> **플랫폼 적용**: Interactive Engineering MVP (A02 개발 계약)  
> **디자인 원칙**: Brilliant의 높은 학습 몰입감과 햅틱적 조작감을 계승하되, 원본 그래픽 자산을 복제하지 않는 독자적인 엔지니어링 다크 모드 디자인 시스템 구축.

---

## 1. 레이아웃 아키텍처 및 반응형 브레이크포인트

Interactive Engineering의 레이아웃은 **"맥락(Context)"**과 **"실험실(Playground)"**이 한눈에 상호작용하도록 배치하는 것을 원칙으로 합니다.

```
[데스크톱 레이아웃 (Desktop >= 1024px)]
┌────────────────────────────────────────────────────────────────────────┐
│ [헤더] ✕ (닫기)   반도체 원리: MOSFET 채널 형성    ● ● ○ ○    🔊 (음성) │
├───────────────────────────────────┬────────────────────────────────────┤
│ [좌측: 맥락 및 질문 프롬프트 (45%)] │ [우측: 인터랙티브 캔버스 (55%)]    │
│                                   │                                    │
│ 1. 핵심 질문 및 개념 설명         │  ┌──────────────────────────────┐  │
│    - 인라인 수식: Vgs > Vth       │  │  MOSFET 물리 시뮬레이터      │  │
│    - 반응형 수치 뱃지             │  │  (게이트, 산화막, 채널 전자) │  │
│                                   │  └──────────────────────────────┘  │
│ 2. 라이브 파라미터 조절부         │                                    │
│    - 게이트 전압 Vgs 슬라이더     │  [실시간 IV 특성 그래프]           │
│    - 드레인 전압 Vds 슬라이더     │                                    │
├───────────────────────────────────┴────────────────────────────────────┤
│ [하단 고정 액션 바]  💡 힌트 보기                  [ 확인하기 (Check) ] │
└────────────────────────────────────────────────────────────────────────┘

[모바일 레이아웃 (Mobile < 768px)]
┌────────────────────────────────────────┐
│ [헤더] ✕   MOSFET 원리   ● ● ○ ○   🔊  │
├────────────────────────────────────────┤
│ [1. 질문 프롬프트 카드 (상단)]         │
│   "게이트 전압을 조절해 채널을 여세요" │
├────────────────────────────────────────┤
│ [2. 인터랙티브 캔버스 (중앙 종횡비 4:3)]│
│   ┌──────────────────────────────────┐ │
│   │   터치 최적화 물리 시뮬레이션    │ │
│   └──────────────────────────────────┘ │
│   - 직관적 슬라이더 (터치 영역 48px)   │
├────────────────────────────────────────┤
│ [하단 고정 액션 시트]                  │
│   💡 힌트          [ 확인하기 (Check) ]│
└────────────────────────────────────────┘
```

### 브레이크포인트 사양 (Breakpoints)
- **Desktop (`lg`, $\ge 1024\text{px}$)**: 2열 나란히 분할 (좌측 45%, 우측 55%), 최대 컨테이너 너비 $1216\text{px}$ 중앙 정렬.
- **Tablet (`md`, $768\text{px} \sim 1023\text{px}$)**: 단일 열 스택, 컨테이너 너비 $680\text{px}$, 상단 프롬프트 $\to$ 캔버스 $\to$ 하단 컨트롤.
- **Mobile (`sm`, $< 768\text{px}$)**: $100\text{vw}$ 풀 스택, 하단 액션 바 뷰포트 하단 고정 (`position: sticky; bottom: 0`), Safe Area 패딩 대응.

---

## 2. 디자인 토큰 및 컬러 팔레트 (Design Tokens)

공학 시뮬레이션의 특성상 전류, 전자, 전압, 열, 자속 등의 물리적 에너지를 시각화하기 위해 **"엔지니어링 딥 다크 모드 (Engineering Slate Dark)"**를 기본 테마로 채택합니다.

### 2.1. 컬러 팔레트 (Color Palette)

| 토큰명 | HEX 코드 | Tailwind 클래스 | 용도 |
|:---|:---|:---|:---|
| `bg-app` | `#0A0F1D` | `bg-slate-950` | 전체 애플리케이션 최하단 배경 |
| `bg-surface` | `#151E32` | `bg-slate-900` | 프롬프트 카드, 캔버스 패널 배경 |
| `bg-subtle` | `#1E2942` | `bg-slate-800` | 슬라이더 트랙, 비활성 버튼, 툴팁 배경 |
| `border-default` | `#29354F` | `border-slate-700` | 패널 및 카드 기본 경계선 |
| `border-focus` | `#3B82F6` | `border-blue-500` | 포커스 링, 활성화된 오브젝트 테두리 |
| `text-primary` | `#F8FAFC` | `text-slate-50` | 제목, 지문 텍스트, 주요 수치 |
| `text-muted` | `#94A3B8` | `text-slate-400` | 보조 설명, 단위 라벨, 비활성 캡션 |
| **물리 에너지 토큰** | | | |
| `energy-amber` | `#F59E0B` | `text-amber-500` | 전압(V), 전구 발광, 열 에너지 표현 |
| `energy-cyan` | `#06B6D4` | `text-cyan-500` | 전자(e-), 전류(I), n형 반도체 캐리어 |
| `energy-purple` | `#A855F7` | `text-purple-500` | 정공(h+), p형 기판, 기계적 토크(Torque) |
| **피드백 토큰** | | | |
| `status-correct` | `#10B981` | `bg-emerald-500` | 정답 판정, Check 통과 액션 버튼 |
| `status-correct-bg`| `#064E3B33` | `bg-emerald-950/20` | 성공 피드백 하단 바 배경 |
| `status-error` | `#F43F5E` | `bg-rose-500` | 오답 판정, 단락(Short) 경고 |
| `status-error-bg` | `#88133733` | `bg-rose-950/20` | 실패 피드백 하단 바 배경 |

---

### 2.2. 타이포그래피 시스템 (Typography Hierarchy)

- **Font Family**:
  - 본문/UI: `-apple-system, BlinkMacSystemFont, "Pretendard Variable", "Inter", sans-serif`
  - 수식 및 수치: `"JetBrains Mono", "Source Code Pro", monospace` (수치가 실시간 변경될 때 레이아웃 흔들림 방지 `font-variant-numeric: tabular-nums`).
- **Scale**:
  - `Display`: 28px / Line-height 1.3 / Bold (레슨 타이틀, 수료 축하 헤드라인)
  - `Heading 1`: 20px / Line-height 1.4 / SemiBold (질문 프롬프트 핵심 질문)
  - `Body Primary`: 16px / Line-height 1.6 / Regular (원리 설명 지문)
  - `Math / Value`: 15px / Line-height 1.0 / Monospace Medium (슬라이더 수치, 인라인 변수)
  - `Caption`: 13px / Line-height 1.4 / Regular (단위 기호, 힌트 레벨 라벨)

---

## 3. 핵심 UI 컴포넌트 디자인 사양

### 3.1. 스텝 진행 인디케이터 (Step Progress Dots)
- **위치**: 헤더 중앙.
- **사양**:
  - 각 스텝은 원형 도트 ($8\text{px} \times 8\text{px}$)로 표현.
  - **대기 상태**: `bg-slate-700`, 원형.
  - **현재 스텝**: `bg-blue-500`, 가로로 길어지는 캡슐 형태 ($24\text{px} \times 8\text{px}$), 펄스 애니메이션.
  - **완료된 스텝**: `bg-emerald-500`, 중앙에 마이크로 체크 표시.

### 3.2. 파라미터 조절 슬라이더 (Parameter Slider)
- **트랙**: 높이 $8\text{px}$, 모서리 둥글기 $4\text{px}$, 배경 `bg-slate-800`.
- **채워진 트랙 (Fill)**: 활성 구간은 에너지 컬러(`bg-cyan-500` 또는 `bg-amber-500`) 그라데이션.
- **썸 (Thumb)**: 지름 $24\text{px}$ 원형, 흰색 배경, `border: 3px solid #3B82F6`, `box-shadow: 0 2px 8px rgba(0,0,0,0.4)`.
- **호버 및 활성 상태**: 썸 스케일 $1.2\times$, 드래그 중인 수치를 담은 플로팅 툴팁이 썸 상단 $12\text{px}$ 위에 항상 노출.

### 3.3. 하단 액션 버튼 (Check / Continue Button)
- **크기**: 최소 높이 $52\text{px}$, 가로 패딩 $32\text{px}$, `rounded-xl`.
- **비활성 상태 (Disabled)**: `bg-slate-800`, `text-slate-500`, `cursor-not-allowed`.
- **활성 상태 (Ready to Check)**: `bg-blue-600`, `hover:bg-blue-500`, `text-white`, 부드러운 호흡 펄스 (1.5초 주기).
- **정답 통과 상태 (Correct)**: `bg-emerald-600`, `hover:bg-emerald-500`, "계속하기 (Continue) $\to$" 라벨로 전환.

---

## 4. 애니메이션 및 모션 명세서 (Motion Choreography)

모든 애니메이션은 단순한 장식이 아니라 **"물리적 상태 변화와 인과관계를 설명하는 시각적 피드백"**이어야 합니다.

### 4.1. 스텝 전환 모션 (Step Slide-Fade Transition)
- **원리**: 이전 문제와 다음 문제의 선후 관계를 표현하기 위해 수평 슬라이드를 적용합니다.
- **사양**:
  - 이전 스텝 퇴장: `translateX(0) $\to$ translateX(-24px)`, `opacity: 1 $\to$ 0`, $200\text{ms}$, `ease-in`.
  - 다음 스텝 등장: `translateX(24px) $\to$ translateX(0)`, `opacity: 0 $\to$ 1`, $280\text{ms}$, `cubic-bezier(0.16, 1, 0.3, 1)` (Smooth Spring Out).

### 4.2. 정답 승리 모션 (Success Celebration Pop)
- **원리**: 문제를 성공적으로 해결했을 때의 성취감 강화.
- **타임라인**:
  - $0\text{ms}$: Check 버튼이 $0.95\times$로 눌렸다가 $1.05\times$로 튀어오름.
  - $80\text{ms}$: 체크마크 아이콘이 회전하며 스케일 팝업 (`scale: 0 $\to$ 1.3 $\to$ 1.0`, $240\text{ms}$).
  - $150\text{ms}$: 캔버스 회로 주변으로 반투명 에메랄드 에너지 링 1회 확산 (`scale: 0.8 $\to$ 1.4`, `opacity: 0.6 $\to$ 0`, $400\text{ms}$).
  - $200\text{ms}$: 하단 정답 해설 패널이 아래에서 $30\text{px}$ 부드럽게 슬라이드 업.

### 4.3. 오답 셰이크 모션 (Error Shake)
- **원리**: 틀렸음을 직관적으로 알리되 불쾌감을 주지 않는 부드러운 감쇠 진동.
- **CSS 키프레임**:
  ```css
  @keyframes gentleShake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(5px); }
    60% { transform: translateX(-3px); }
    80% { transform: translateX(2px); }
  }
  .shake-error {
    animation: gentleShake 320ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }
  ```

### 4.4. 실시간 물리 렌더링 루프 (60fps Animation Loop)
- **도선 내 전자 흐름**:
  - 도선 패스(`SVG path`)를 따라 흐르는 점선 대시(`stroke-dasharray: 4 8`, `stroke-dashoffset`) 애니메이션.
  - 전류 $I$가 증가하면 대시 오프셋 이동 속도를 실시간으로 빠르게 가속.
- **기어 회전 애니메이션**:
  - 각속도 $\omega$에 따라 `transform: rotate(angle deg)`를 매 프레임 (`requestAnimationFrame`) 누적 업데이트.

---

## 5. 접근성 및 모션 감소 모드 (Accessibility & Reduced Motion)

`prefers-reduced-motion: reduce` 설정이 켜져 있는 기기에서는 현기증을 유발할 수 있는 수평 슬라이드와 회전 셰이크를 비활성화하고, 즉각적인 투명도 페이드($100\text{ms}$)로 대체합니다.

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .step-transition {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

---

## 6. A02 개발자를 위한 스타일링 구현 가이드

1. **CSS 프레임워크 권장**: **Vanilla Tailwind CSS v3.4+** 또는 **Pure CSS Variables**.
2. **GPU 가속 속성 한정**: 애니메이션 속성은 오직 `transform`과 `opacity`만을 사용하고, `width`, `height`, `top`, `left` 애니메이션은 강제 리플로우(Layout Reflow)를 유발하므로 절대 사용하지 마십시오.
3. **고해상도 캔버스 대응**: `<canvas>` 요소를 사용할 경우 기기의 `window.devicePixelRatio`(보통 2x~3x)를 감안하여 캔버스 내부 버퍼 해상도를 곱해 레티나 디스플레이에서 선명하게 렌더링하십시오.
