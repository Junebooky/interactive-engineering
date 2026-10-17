# 음성 내레이션 및 대화형 학습 UX 명세서 (Voice Narration Specification)

> **문서 상태**: DRAFT FOR A01 REVIEW  
> **분석 주체**: REA 전담 분석 에이전트  
> **대상 서비스**: [Brilliant.org](https://brilliant.org/home/) (Koji AI Tutor 레퍼런스)  
> **플랫폼 적용**: Interactive Engineering MVP P0 확정 사양 (A02 개발 계약)  
> **증거 상태 구분**:  
> - **제1부 레퍼런스 분석**: `OBSERVED` (공식 발표 및 덤프 검증), `INFERRED`  
> - **제2부 독자 구현 사양**: `PROPOSED` (독립적 Web Speech API 아키텍처)

---

# 제1부. Brilliant.org 음성 학습 경험 레퍼런스 분석

## 1. 관찰된 음성 시스템 개요
Brilliant는 2025~2026년에 걸쳐 실시간 AI 튜터인 **"Koji"**를 도입하며 대화형 음성 학습을 본격화했습니다.

### 1.1. 기술 스택 및 프로바이더 (Observed)
- **ElevenLabs 파트너십**: 실시간 음성 합성 엔진으로 **ElevenLabs**의 저지연(Low-Latency) 커스텀 음성 모델을 채택.
- **인하우스 보이스 페르소나**: 로봇 같은 기계음이 아닌, Brilliant 내부 디자이너/엔지니어의 실제 음성을 스튜디오에서 녹음·파인튜닝한 자연스럽고 친근한 톤앤매너.
- **결합 아키텍처**: LLM의 환각(Hallucination)을 방지하기 위해 엄격한 규칙 기반 수학/물리 엔진(Rule-based Engine)이 정답과 상태를 판정하고, ElevenLabs 음성이 이를 바탕으로 스크린 요소 드로잉과 동기화되어 발화.

### 1.2. 화면 및 조작 인터랙션 관찰
- **제공 화면**: 모든 레슨 화면에서 제공되는 것이 아니라, 특정 최신 코스 및 AI 튜터 지원 레벨에서 우측 플로팅 패널 형태로 제공.
- **지문 낭독 방식**: 단순히 화면의 텍스트를 기계적으로 읽는 것이 아니라, "지금 이 회로를 보세요. 왜 불이 안 켜질까요?"와 같은 구어체 튜터링 화법 사용.
- **조작 중 음성 정책**: 사용자가 슬라이더나 부품을 드래그하는 도중에는 음성을 일시적으로 멈추거나 방해하지 않음. 조작이 끝나고 의미 있는 상태에 도달했을 때 짤막한 반응 제공.
- **상태 제어 데이터**:
  - Apollo State 내 `TutorPreferences`: `{ enableSound: true, voiceName: "koji_default" }`.
  - 세션 제어: `enableSoundEffects: true`.
  - 클라이언트 플래그: `enable_desktop_gamer_koji`, `enable_native_audio_bridge`.

### 1.3. 레퍼런스의 한계 및 우리 MVP의 차별점
- **비용 및 의존성 한계**: ElevenLabs 기반 실시간 서버 스트리밍 TTS는 분당 API 과금 비용이 발생하며, 네트워크 지연 시 오디오 버퍼링이 발생함.
- **언어 한계**: Brilliant Koji는 주로 영어권 최적화 음성이며, 한국어 공학 전문 용어 발음 지원이 미흡.
- **우리 플랫폼 방향**: **외부 서버 과금 및 API 키가 필요 없는 브라우저 내장 Web Speech API 기반의 완전 독립 무료 시스템** 구축.

---

# 제2부. Interactive Engineering 독자 음성 시스템 설계 명세 (MVP P0)

## 2.1. 기본 기술 및 환경 원칙

1. **핵심 API**: 브라우저 표준 **Web Speech API** (`window.speechSynthesis`, `SpeechSynthesisUtterance`).
2. **무과금/오프라인 보장**: 외부 클라우드 결제, API Key, 서버 통신 일체 불필요. 100% 클라이언트 로컬 실행.
3. **한국어 (`ko-KR`) 최우선**:
   - 브라우저 설치 음성 중 `ko-KR` 로케일 음성을 우선 탐색.
   - 선호 음성 순위: Google 한국어 $\to$ Apple Yuna / Sora $\to$ Microsoft Heami $\to$ 시스템 기본 한국어.
   - 기기에 한국어 음성 엔진이 설치되어 있지 않은 경우 오류 없이 **텍스트 전용(Text-Only) 모드로 정상 폴백(Graceful Degradation)**.
4. **브라우저 자동 재생 정책(Autoplay Policy) 준수**:
   - 첫 페이지 진입 즉시 자동 발화하는 것을 금지합니다.
   - 사용자가 화면을 처음 클릭하거나 레슨 시작 버튼을 누르는 **최초 명시적 인터랙션(User Gesture) 이후에만 오디오 재생 활성화**.
   - 기본 상태는 음소거(Muted) 또는 사용자가 "음성 튜터 켜기"를 선택할 수 있는 Opt-in 토글 제공.

---

## 2.2. 오디오 플레이어 UI 및 사용자 제어 사양

- **GNB 스피커 토글**:
  - 🔊 (소리 켬) / 🔇 (음소거). 상태는 `localStorage`(`ie_voice_enabled`)에 영속 저장.
- **발화 제어 플로팅 바 (선택적 표시)**:
  - ⏯️ 일시정지 / 다시 재생.
  - 🔄 다시 듣기 (Replay): 현재 스텝의 안내 대사를 처음부터 다시 발화.
  - ⚡ 배속 조절: `0.8x` (또박또박), `1.0x` (기본), `1.25x` (빠르게).

---

## 2.3. 음성 라이프사이클 및 오버랩 방지 정책 (Anti-Jank & Lifecycle)

1. **스텝 전환 시 즉시 캔슬 (Instant Cancellation)**:
   - 사용자가 "Continue"를 누르거나 이전/다음 스텝으로 이동할 때, 직전 스텝의 발화가 끝나지 않았더라도 **반드시 `window.speechSynthesis.cancel()`을 즉시 호출**하여 오디오 큐(Queue)를 완전히 비웁니다.
   - 이전 스텝의 설명이 다음 스텝에서 뒤늦게 겹쳐 나오는 "TTS 지연 큐 현상"을 원천 차단합니다.
2. **슬라이더 드래그 중 TTS 폭주 금지 (Throttling & Debouncing)**:
   - 슬라이더 값이 변경되는 매 프레임(`onChange`)마다 TTS를 호출하는 것을 엄격히 금지합니다.
   - 물리 모델의 **"의미 있는 마일스톤(Milestone)"** 상태에 진입했을 때만 1회 발화합니다.
3. **마일스톤 재진입 쿨다운 (Milestone Cooldown)**:
   - 사용자가 슬라이더를 문턱전압($0.7\text{V}$) 전후로 왔다 갔다 반복할 때마다 매번 말하는 현상을 방지하기 위해, 동일 마일스톤 이벤트는 **최소 4초간의 쿨다운(Cooldown)**을 적용합니다.

---

## 2.4. 화면 텍스트와 음성 대사의 분리 (Narration Decoupling)

화면에 표시되는 시각 텍스트는 수식과 기호($V_{GS} > V_{th}$, $I = V/R$)로 간결하게 표현되지만, 음성 튜터는 사람이 옆에서 설명하듯 자연스러운 한국어 구어체로 낭독해야 합니다.  
따라서 데이터 스키마에서 `displayText`와 `narrationText`를 분리합니다.

```json
{
  "stepId": "mosfet-step-2",
  "displayText": "게이트 전압 $V_{GS}$를 문턱 전압 $V_{th}(0.7\text{V})$ 이상으로 올려보세요.",
  "narration": {
    "intro": "슬라이더를 움직여 게이트 전압을 문턱 전압인 0.7볼트 이상으로 올려보세요.",
    "onThresholdReached": "좋습니다! 문턱 전압을 넘자 전자가 모여 전류가 흐를 수 있는 통로가 생겼습니다.",
    "correct": "완벽합니다! 채널이 완전히 형성되어 드레인 전류가 흐를 준비가 되었습니다.",
    "incorrect": "아직 게이트 전압이 부족합니다. 전압을 0.7볼트보다 더 높여보세요."
  }
}
```

---

## 2.5. 표준 교육용 음성 이벤트 (Voice Event Taxonomy)

| 이벤트 ID | 발화 시점 | 튜터 톤앤매너 | 목적 |
|:---|:---|:---|:---|
| `INTRO` | 스텝 최초 진입 시 (100ms 후) | 친절하고 명확한 안내 | 이번 스텝에서 탐구할 질문과 목표 제시 |
| `INSTRUCTION` | 5초간 입력이 없을 때 | 부드러운 유도 | 구체적으로 무엇을 터치해야 할지 행동 유도 |
| `INTERACTION_FEEDBACK`| 의미 있는 물리 상태 도달 시 | 직관적 감탄과 설명 | "채널 형성됨", "기어비 반전됨" 실시간 알림 |
| `CORRECT` | Check 검증 성공 시 | 경쾌한 칭찬 | 성공 확인 및 핵심 물리 규칙 1줄 요약 |
| `INCORRECT` | Check 검증 실패 시 | 온화하고 건설적인 피드백 | 오답 원인 분석 및 재시도 독려 |
| `HINT` | 💡 힌트 버튼 클릭 시 | 차분한 조언 | 사고를 확장해주는 단계별 단서 제공 |
| `EXPLANATION` | 정답 후 해설 패널 열람 시 | 깊이 있는 이론 정리 | 방금 실험한 현상의 산업적·공학적 의의 |
| `NEXT_STEP` | Continue 클릭 시 | 다음 단계 연결 브릿지 | "다음 단계에서는 전압을 더 높여보겠습니다." |

---

## 2.6. 대표 3개 공학 레슨 음성 대사 스크립트 (Korean Dialogue Scripts)

### 1. 반도체: MOSFET 채널 형성 데모
- **스텝 1 (INTRO)**:  
  *"반도체 스위치인 모스펫의 원리를 알아봅시다. 지금은 게이트에 전압이 없어 전류가 흐르지 않는 차단 상태입니다."*
- **스텝 1 (조작 마일스톤 $V_{GS} = 0.8	ext{V}$ 통과 시)**:  
  *"문턱 전압 0.7볼트를 넘었습니다! 게이트 산화막 아래에 전자가 끌려와 파란색 전도 채널이 열리는 것을 확인해보세요."*
- **스텝 1 (CORRECT)**:  
  *"정답입니다! 게이트 전압이 충분히 높아지면 반전층 채널이 형성되어 도체처럼 동작합니다."*
- **스텝 1 (INCORRECT)**:  
  *"아직 전압이 0.7볼트보다 낮습니다. 슬라이더를 오른쪽으로 더 밀어보세요."*

---

### 2. 전기전자: 옴의 법칙 데모 ($V = I 	imes R$)
- **스텝 1 (INTRO)**:  
  *"전압과 저항이 전류에 미치는 영향을 실험해봅시다. 전구의 밝기는 회로에 흐르는 전류에 비례합니다."*
- **스텝 1 (조작 마일스톤 저항 절반 감소 시)**:  
  *"저항을 절반으로 줄이자 전류가 두 배로 늘어나 전구가 훨씬 밝아졌습니다."*
- **스텝 1 (CORRECT)**:  
  *"훌륭합니다! 전압이 일정할 때 저항이 작아질수록 전류는 커진다는 옴의 법칙을 확인하셨습니다."*
- **스텝 1 (HINT)**:  
  *"전류는 전압을 저항으로 나눈 값입니다. 전구를 더 밝게 하려면 저항 슬라이더를 낮춰보세요."*

---

### 3. 기계공학: 기어비와 회전 속도 데모
- **스텝 1 (INTRO)**:  
  *"기어는 회전 속도와 힘을 바꾸는 핵심 기계 요소입니다. 첫 번째 기어를 손으로 직접 돌려보세요."*
- **스텝 1 (조작 마일스톤 기어 맞물림 회전 시)**:  
  *"기어 1이 시계 방향으로 돌자, 맞물린 기어 2는 반시계 방향으로 회전합니다."*
- **스텝 1 (CORRECT)**:  
  *"정답입니다! 두 기어가 맞물리면 회전 방향은 항상 반대가 되며, 잇수가 두 배 많은 기어는 절반의 속도로 돕니다."*

---

## 2.7. A02 개발자를 위한 Voice 모듈 구현 코드 템플릿

```typescript
// lib/voice/voiceEngine.ts
export class WebSpeechVoiceEngine {
  private synth: SpeechSynthesis | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isMuted: boolean = false;
  private rate: number = 1.0;
  private lastMilestoneTime: number = 0;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.initVoice();
    }
  }

  private initVoice(): void {
    if (!this.synth) return;
    const loadVoices = () => {
      const voices = this.synth!.getVoices();
      // ko-KR 우선 탐색
      this.selectedVoice = voices.find(v => v.lang === "ko-KR") || 
                           voices.find(v => v.lang.startsWith("ko")) || null;
    };
    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  public speak(text: string, options?: { force?: boolean; milestoneKey?: string }): void {
    if (this.isMuted || !this.synth || !text) return;

    // 쿨다운 검사 (동일 마일스톤 4초 이내 반복 방지)
    if (options?.milestoneKey) {
      const now = Date.now();
      if (now - this.lastMilestoneTime < 4000) return;
      this.lastMilestoneTime = now;
    }

    // 이전 발화 취소
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) utterance.voice = this.selectedVoice;
    utterance.lang = "ko-KR";
    utterance.rate = this.rate;
    utterance.pitch = 1.0;

    this.synth.speak(utterance);
  }

  public cancel(): void {
    this.synth?.cancel();
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) this.cancel();
  }

  public setRate(rate: number): void {
    this.rate = Math.max(0.8, Math.min(1.5, rate));
  }
}
```
