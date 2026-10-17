# 01 · MOSFET에서 NOT 게이트까지: 스위치가 켜지면 출력은 어떻게 될까?
> 상태: A06 R8 SOURCE_FIX / A07_RECHECK_PENDING · 이전 A05 장면은 독립 재검증 별도, A02 앱 미통합 | 2026-10-17
> 선수지식: 전압/전류의 차이와 간단한 회로(학습 중 복습 제공) | 학습목표: 채널 형성 ≠ 전류, nMOS 스위치 ON ≠ 출력 1을 직접 입증하고 CMOS의 필요성을 다음 레슨에 잇는다.
> 교육 흐름: 상황 제시 → 호기심 유발 → **예상 먼저** → 조작 → 관찰 → 원리 발견 → 응용 → 다음 질문. 학생 제출 전 정답 비노출.

## Step 1 · M01-S01 / sceneId: mosfet-field
- **learningGoal:** 게이트 전압으로 표면 반전층이 생기는 이유
- **priorKnowledge:** 전압·전기장·전자
- **storyHook:** 눈에 보이지 않는 전기장을 이용하면 스위치를 조절할 수 있을까요?
- **question:** 게이트 전압을 올릴 때 소스와 드레인 사이에서 어떤 변화가 생길까요?
- **predictionPrompt (learner-visible):** VGS를 0V·0.6V·1.2V로 바꿀 때 표면 전하와 드레인 전류에 어떤 변화가 있을지 각각 예측해 보세요. VDS는 0V로 유지해요.
- **learnerAction:** VGS 0→1.2V 천천히 이동; VDS=0V 고정; 전하분포·채널 표식 보기
- **modelInputs:** VGS: 0~1.2 V, step 0.1 V; VDS=0 V; Vth=0.7 V (toy)
- **expectedObservation (teacher-only):** 문턱 근처 이후 반전 채널이 눈에 띄지만 VDS=0이므로 순 전류는 0
- **teacherExpectedAnswer (gated):** 문턱 근처 이후 반전 채널이 눈에 띄지만 VDS=0이므로 순 전류는 0
- **correctIncorrectCriteria:** 전자 밀도 변화로 채널을 설명하면 정답; 단순히 'VGS>0이면 큰 전류'는 오답
- **misconceptions (3 anticipated wrong answers):** ① 전자들이 산화막을 통과한다 ② 문턱 아래 전류는 물리적으로 정확히 0이다 ③ 0.7V는 모든 트랜지스터의 문턱이다
- **hints (level 1/2/3):** ① 산화막은 절연체일까요? ② 전자는 산화막을 건너가나요, 바로 아래 표면에 모이나요? ③ 이 숫자가 소자별로 달라질 수 있을까요?
- **feedback/correct:** “방금 관찰한 변화가 핵심이에요. 게이트 전기장이 절연막을 가로질러 실리콘 표면 전하 분포를 조절해 반전층을 유도해요.”
- **feedback/incorrect (dispatcher):** Student selected m1/m2/m3 cause triggers corresponding misconceptionFeedback; no generic hint substitutes for a specific physical explanation.
- **feedback/hint (on request):** L1→L2→L3 gradual hints only after student requests; no teacherExpectedAnswer before recorded prediction and direct manipulation.
- **explanation:** 게이트 전기장이 절연막을 가로질러 실리콘 표면 전하 분포를 조절해 반전층을 유도해요.
- **nextHook:** 통로가 생겼는데 양쪽 전압이 같아도 전류가 흐를까요?
- **displayTextBeforePrediction:** 게이트를 움직이면 표면에서 어떤 변화가 생길까요?
- **displayTextAfterObservation (gated):** 전기장으로 반전층을 만들 수 있어도 VDS=0이면 순 전류는 없어요.
- **speechTextBeforePrediction:** 게이트 전압을 바꿔 표면 전하가 어떻게 달라질지 먼저 예상해 보세요.
- **speechTextAfterObservation (gated):** 게이트 전기장은 산화막을 건너 직접 전자를 보내지 않고 실리콘 표면 전하분포를 바꿔요. 하지만 이 모형에서 드레인과 소스의 전압이 같으면 순 전류는 0이에요.
- **physicsAssumptions:** A06/A02 toy Vth0.7V, long-channel and fixed temperature, **VDS=0** so net drain DC current 0 independent VGS; subthreshold leakage statement is conditional on NONZERO VDS. Real oxide leakage/tunneling and dynamic gate charge vs DC gate conduction separate. Threshold boundary VGS exactly Vth needs explicit neutral model state, not all hardware is digital on/off.
- **sourceRefs:** [S16] 저항/CMOS 참고; A02 PR #5 모델 검토
- **A05:** 먼저 예측/선택 기록, 이어서 실시간 scene 반응; 정답/오답/힌트/왜? 상태마다 별도 시각 표현, 색상 외 모양/숫자로 의미 구별.

- **misconceptionFeedback/m1 (gated):** “게이트의 주 효과는 산화막을 직접 건너가는 DC 전자 주입이 아니라 전기장이 Si 표면 캐리어 분포를 바꾸는 거예요.”
- **misconceptionFeedback/m2 (gated):** “실제 nMOS는 VDS가 0이 아닐 때 문턱 아래에서도 약한 반전/누설 전류가 가능해요. **이 장면은 VDS=0**이므로 VGS에 관계없이 순 드레인 전류가 0이며 ‘below Vth current zero’라는 일반론을 이 조건으로 증명할 수 없어요.”
- **misconceptionFeedback/m3 (gated):** “0.7볼트는 이 레슨의 TOY Vth일 뿐 실제 모든 소자의 보편 문턱값이 아니에요.”
- **validation branch mapping:** wrongChoiceID=m1|m2|m3; exactly matching feedback after input; correctly predicted students do not need intentional error to pass and must explain WHY after at least two distinct input states.
## Step 2 · M01-S02 / sceneId: mosfet-current
- **learningGoal:** 채널의 존재와 전류의 흐름을 구별
- **priorKnowledge:** M01-S01
- **storyHook:** 소스와 드레인 사이 조건을 하나씩 바꿔보면 무슨 일이 일어날까요?
- **question:** 양 끝의 전압이 같을 때 전류가 흐를까요?
- **predictionPrompt (learner-visible):** VGS를 고정하고 VDS를 0V에서 더 큰 값으로 바꾸면 전류 화살표와 곡선이 어떤 모양일지 예측해 보세요.
- **learnerAction:** VGS=1.5V 고정, VDS 0→0.8→1.8V, IV 곡선 보기
- **modelInputs:** VGS=1.5V; VDS: 0~2V; Vth=0.7V
- **expectedObservation (teacher-only):** VDS=0이면 순 DC 전류 0; 전위차가 생기면 전류 증가, 포화 이후에도 전류 유지
- **teacherExpectedAnswer (gated):** VDS=0이면 순 DC 전류 0; 전위차가 생기면 전류 증가, 포화 이후에도 전류 유지
- **correctIncorrectCriteria:** 전류 생성에 VDS가 필요함을 설명하면 정답; 포화=전류 0이면 오답
- **misconceptions (3 anticipated wrong answers):** ① 채널만 열리면 언제나 전류가 흐른다 ② 핀치오프는 전류가 완전히 끊긴다는 뜻이다 ③ 전자 이동 방향이 전류 방향이다
- **hints (level 1/2/3):** ① 소스와 드레인의 전위가 똑같다면 어느 쪽으로 움직일까요? ② VDS를 바꿨을 때 그래프는 0에서 출발하나요? ③ 전자와 관습 전류 방향을 따로 보세요.
- **feedback/correct:** “방금 관찰한 변화가 핵심이에요. 전기가 흐를 길과 흐르게 하는 전위차는 달라요. 이상적인 포화 영역에서도 드레인 전류는 계속 흐릅니다.”
- **feedback/incorrect (dispatcher):** Student selected m1/m2/m3 cause triggers corresponding misconceptionFeedback; no generic hint substitutes for a specific physical explanation.
- **feedback/hint (on request):** L1→L2→L3 gradual hints only after student requests; no teacherExpectedAnswer before recorded prediction and direct manipulation.
- **explanation:** 전기가 흐를 길과 흐르게 하는 전위차는 달라요. 이상적인 포화 영역에서도 드레인 전류는 계속 흐릅니다.
- **nextHook:** 이 스위치를 출력선 아래에 달면 ON일 때 출력은 1일까요?
- **displayTextBeforePrediction:** 드레인 전압을 바꾸면 전류는 어떻게 움직일까요?
- **displayTextAfterObservation (gated):** 채널이 열린 조건에서 VDS가 전류를 결정해요.
- **speechTextBeforePrediction:** 게이트 조건을 유지하고 드레인 쪽 전압을 바꿔보세요. 화살표 변화를 먼저 예측해 봐요.
- **speechTextAfterObservation (gated):** 양 끝 전위차가 0이면 순 드레인 전류가 없고, VDS를 올리면 전류가 생길 수 있어요. 포화는 전류가 끊긴다는 뜻이 아니에요.
- **physicsAssumptions:** 장채널 square-law 근사; 이동도 변화·채널길이 변조·온도/누설 무시; 전류 상대 추세 위주
- **sourceRefs:** A02 PR #5 mosfetModel
- **A05:** 먼저 예측/선택 기록, 이어서 실시간 scene 반응; 정답/오답/힌트/왜? 상태마다 별도 시각 표현, 색상 외 모양/숫자로 의미 구별.

- **misconceptionFeedback/m1 (gated):** “채널이 전류가 다닐 수 있는 길을 만들어도 소스·드레인의 순 전위차가 0이면 순 DC 전류가 없어요.”
- **misconceptionFeedback/m2 (gated):** “포화 영역에서 pinch-off는 ‘전류 완전 차단’이 아니라 전류가 계속 흐르며 VDS에 대한 변화가 완만해지는 조건이에요.”
- **misconceptionFeedback/m3 (gated):** “전자 이동 방향과 양전하 기준의 관습전류 방향은 반대예요. 소자 단자마다 화살표 기준을 같이 표시해야 해요.”
- **validation branch mapping:** wrongChoiceID=m1|m2|m3; exactly matching feedback after input; correctly predicted students do not need intentional error to pass and must explain WHY after at least two distinct input states.
## Step 3 · M01-S03 / sceneId: nmos-resistor-inverter
- **learningGoal:** nMOS ON 상태와 출력 논리의 비동치를 실험
- **priorKnowledge:** 풀업 저항, 접지, M01-S02
- **storyHook:** 한 트랜지스터를 출력선 아래에 두면 입력과 출력은 같을까요?
- **question:** 입력을 HIGH로 바꾸면 출력 전압은 높아질까요, 낮아질까요?
- **predictionPrompt (learner-visible):** Vin=0V/5V 두 조건에서 10kΩ 풀업과 nMOS 풀다운이 연결된 회로의 Vout 논리값을 독립 선택해 보세요.
- **learnerAction:** 5V 전원+10kΩ 풀업 저항+nMOS 풀다운; Vin LOW→HIGH 토글, Vout 실측 모델값 보기
- **modelInputs:** Vin ∈ {0V,5V}; VDD=5V; RD=10kΩ; A02 Ron 모델
- **expectedObservation (teacher-only):** Vin=0→Vout 5V(1), Vin=5→Vout 약 0.45V(0)
- **teacherExpectedAnswer (gated):** Vin=0→Vout 5V(1), Vin=5→Vout 약 0.45V(0)
- **correctIncorrectCriteria:** 출력 진리값 [1,0]을 설명하면 정답; ON=출력1은 오답
- **misconceptions (3 anticipated wrong answers):** ① 트랜지스터가 켜지면 모든 회로에서 비트는 1이다 ② Vout는 항상 Vin과 똑같다 ③ ON일 때 완전 0Ω 단락이며 Vout는 정확히 0.000V다
- **hints (level 1/2/3):** ① 출력선은 스위치 ON일 때 어디로 당겨질까요? ② 풀업 저항의 역할을 생각해봐요. ③ 실제 0.45V를 이 장난감 회로에서 논리 0으로 읽는 이유는?
- **feedback/correct:** “방금 관찰한 변화가 핵심이에요. nMOS ON이면 출력이 저항보다 낮은 경로로 접지 가까이 내려가요. 비트는 회로가 정한 논리 전압 범위이고 ON/OFF 자체가 비트는 아니에요.”
- **feedback/incorrect (dispatcher):** Student selected m1/m2/m3 cause triggers corresponding misconceptionFeedback; no generic hint substitutes for a specific physical explanation.
- **feedback/hint (on request):** L1→L2→L3 gradual hints only after student requests; no teacherExpectedAnswer before recorded prediction and direct manipulation.
- **explanation:** nMOS ON이면 출력이 저항보다 낮은 경로로 접지 가까이 내려가요. 비트는 회로가 정한 논리 전압 범위이고 ON/OFF 자체가 비트는 아니에요.
- **nextHook:** 저항형 인버터는 ON 동안 전력이 낭비되는데 줄일 수 있을까요?
- **displayTextBeforePrediction:** 입력과 출력의 관계를 직접 찾아볼까요?
- **displayTextAfterObservation (gated):** nMOS가 켜지면 출력은 접지 쪽으로 내려갈 수 있어요.
- **speechTextBeforePrediction:** 전원과 저항, nMOS 연결을 살펴보고 출력 두 값을 먼저 골라봐요.
- **speechTextAfterObservation (gated):** 이 장난감 인버터에서 입력 0볼트의 출력은 5볼트이고 입력 5볼트의 출력은 약 0.45볼트예요. 스위치 ON 자체가 출력 1을 의미하지 않죠.
- **physicsAssumptions:** 현재 A02 PR #5 모델의 Vin=5V 출력 약 0.45V; 실제 전기적 단락은 아님
- **sourceRefs:** [S16] CMOS 인버터; A02 PR #5 inverterModel
- **A05:** 먼저 예측/선택 기록, 이어서 실시간 scene 반응; 정답/오답/힌트/왜? 상태마다 별도 시각 표현, 색상 외 모양/숫자로 의미 구별.

- **misconceptionFeedback/m1 (gated):** “nMOS ON은 그 드레인 경로를 더 잘 통하게 만든다는 뜻이지, 출력 논리 1을 무조건 뜻하지 않아요.”
- **misconceptionFeedback/m2 (gated):** “이 저항 풀업 회로에서 입력이 HIGH면 nMOS가 출력 노드를 GND 쪽으로 당기므로 Vout은 Vin과 같지 않아요.”
- **misconceptionFeedback/m3 (gated):** “TOY 모델에서 nMOS의 ON 저항은 0Ω이 아니므로 Vin5V일 때 Vout이 약 0.45V예요. 0.000V라고 단정하지 않아요.”
- **validation branch mapping:** wrongChoiceID=m1|m2|m3; exactly matching feedback after input; correctly predicted students do not need intentional error to pass and must explain WHY after at least two distinct input states.
## Step 4 · M01-S04 / sceneId: cmos-not-gate
- **learningGoal:** CMOS 구조와 NOT 진리표를 구분
- **priorKnowledge:** M01-S03, pMOS의 상보 제어
- **storyHook:** 위아래 스위치를 함께 쓰면 결과가 어떻게 달라질까요?
- **question:** 입력 0과 1에서 위아래 소자 중 누가 열릴까요?
- **predictionPrompt (learner-visible):** CMOS의 pMOS와 nMOS가 입력 0/1에서 어떻게 동작하고 출력이 어떤 값일지 진리표 두 칸을 예상해 보세요.
- **learnerAction:** 상단 pMOS·하단 nMOS 도식을 입력 0↔1 토글; out0/out1 기록
- **modelInputs:** Vin=0 또는 VDD; out0 0/1; out1 0/1; 예시 이상 CMOS
- **expectedObservation (teacher-only):** 0→1, 1→0; 이상 정지 상태에서 전원~접지 직류 관통경로가 억제됨
- **teacherExpectedAnswer (gated):** 0→1, 1→0; 이상 정지 상태에서 전원~접지 직류 관통경로가 억제됨
- **correctIncorrectCriteria:** out0=1 AND out1=0이면 성공; CMOS 전력은 정확히 0이라는 주장은 오답
- **misconceptions (3 anticipated wrong answers):** ① CMOS 정적·동적 전력은 언제나 0이다 ② 논리 1은 '전자 있음'만 의미한다 ③ NOT 하나가 1T1C DRAM 셀이다
- **hints (level 1/2/3):** ① 입력 0일 때 위쪽 pMOS는 켜질까요? ② 입력 1일 때 아래쪽 nMOS는 켜질까요? ③ 전환 중 전력과 누설은 사라지나요?
- **feedback/correct:** “방금 관찰한 변화가 핵심이에요. pMOS와 nMOS를 상보적으로 연결해 출력은 입력의 반대가 되고, 정지 상태의 직접 관통 전류를 크게 줄여요. 스위칭·누설 전력은 남습니다.”
- **feedback/incorrect (dispatcher):** Student selected m1/m2/m3 cause triggers corresponding misconceptionFeedback; no generic hint substitutes for a specific physical explanation.
- **feedback/hint (on request):** L1→L2→L3 gradual hints only after student requests; no teacherExpectedAnswer before recorded prediction and direct manipulation.
- **explanation:** pMOS와 nMOS를 상보적으로 연결해 출력은 입력의 반대가 되고, 정지 상태의 직접 관통 전류를 크게 줄여요. 스위칭·누설 전력은 남습니다.
- **nextHook:** 그렇다면 만들어진 논리 1을 기억해 두려면 어떻게 해야 할까요?
- **displayTextBeforePrediction:** 상단과 하단 스위치 중 어느 쪽이 연결될까요?
- **displayTextAfterObservation (gated):** CMOS NOT은 입력과 반대 논리 출력을 만들어요.
- **speechTextBeforePrediction:** 두 입력 상태를 바꾸기 전에 pMOS와 nMOS 연결을 각각 예상해 보세요.
- **speechTextAfterObservation (gated):** pMOS와 nMOS를 보완 연결하면 입력이 낮을 때는 위쪽, 높을 때는 아래쪽이 출력과 이어져요. 정지 직류 관통 경로는 억제돼도 누설과 전환 중 전력은 있어요.
- **physicsAssumptions:** A02 PR #5 inverter는 저항형 nMOS만 구현; CMOS 별도 신규 장면 필요; 실제 트랜지스터 특성/정지 전력 단순화
- **sourceRefs:** [S16] CMOS inverter, [S1] DRAM 다음
- **A05:** 먼저 예측/선택 기록, 이어서 실시간 scene 반응; 정답/오답/힌트/왜? 상태마다 별도 시각 표현, 색상 외 모양/숫자로 의미 구별.

## A05 자체 QA 체크
Step 4개, 각 Step 핵심 질문/예측/조작/관찰/정오답 기준/오개념 3개/힌트 3단계/Voice/가정/출처 기재. 실측 반도체 동작이 아닌 **명시적 교육용 모델**. 실제 사용자의 이해도·A05 구현 테스트·A02 앱 통합은 아직 수행되지 않음.
- **misconceptionFeedback/m1 (gated):** “이상적인 정지 CMOS는 관통 전류를 줄이지만 실제 누설·충전/방전·전환 단락전류가 있고 전력 0을 보장하지 않아요.”
- **misconceptionFeedback/m2 (gated):** “논리 HIGH는 정의된 전압범위이지 개별 전자 입자 하나의 존재만을 의미하지 않아요.”
- **misconceptionFeedback/m3 (gated):** “NOT은 조합논리 게이트이고 1T1C DRAM 셀의 전하 저장/읽기/refresh 구조와 달라요.”
- **validation branch mapping:** wrongChoiceID=m1|m2|m3; exactly matching feedback after input; correctly predicted students do not need intentional error to pass and must explain WHY after at least two distinct input states.

## A07 initial M01 story-pre-reveal MAJOR correction · 2026-10-17
- [Card #22](https://github.com/Junebooky/interactive-engineering/issues/22) identified title/Voice displaying current=0 and LOW output too early. A06 neutralized **lesson title, S02 storyHook, S03 before display/voice, all four steps before/after Korean narration** and split learner predictionPrompt from teacherExpectedAnswer, correct feedback gated. This does not claim actual A05/A02 app changes or browser PASS.
- Important scientific condition: The S01 toy has VDS=0, hence any statement 'subthreshold current exists' needs *VDS nonzero* qualification, now in misconception-specific feedback. VGS=Vth threshold exactly must not imply physically abrupt on/off; 0.7V teaching-model parameter, not universal.
- Four steps × 3 cause-specific misconceptionFeedback =12 branches. Even correct learner must observe manipulated states and WHY, not intentionally make mistakes to unlock.
- A07 independent recheck on current exact new SHA required before source EDU_QA_PASS_SOURCE; A05 #8 and A02 #9 old browser evidence remains tied to older scene/app SHA. No main merge/deploy.
