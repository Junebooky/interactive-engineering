# 01 · MOSFET에서 NOT 게이트까지: 스위치가 켜졌는데 왜 0일까?
> 상태: A06 자체 QA 완료 / **A05 장면 제작 인계 가능**, A02 앱 미통합 | 2026-10-17
> 선수지식: 전압/전류의 차이와 간단한 회로(학습 중 복습 제공) | 학습목표: 채널 형성 ≠ 전류, nMOS 스위치 ON ≠ 출력 1을 직접 입증하고 CMOS의 필요성을 다음 레슨에 잇는다.
> 교육 흐름: 상황 제시 → 호기심 유발 → **예상 먼저** → 조작 → 관찰 → 원리 발견 → 응용 → 다음 질문. 학생 제출 전 정답 비노출.

## Step 1 · M01-S01 / sceneId: mosfet-field
- **learningGoal:** 게이트 전압으로 표면 반전층이 생기는 이유
- **priorKnowledge:** 전압·전기장·전자
- **storyHook:** 손가락으로 누르지 않아도 열리는 스위치가 있을까요?
- **question:** 게이트 전압을 올릴 때 소스와 드레인 사이에서 어떤 변화가 생길까요?
- **prediction:** 0·0.6·1.2 V 중 어디에서 그림이 가장 달라질지 먼저 고르세요.
- **learnerAction:** VGS 0→1.2V 천천히 이동; VDS=0V 고정; 전하분포·채널 표식 보기
- **modelInputs:** VGS: 0~1.2 V, step 0.1 V; VDS=0 V; Vth=0.7 V (toy)
- **expectedObservation:** 문턱 근처 이후 반전 채널이 눈에 띄지만 VDS=0이므로 순 전류는 0
- **correctIncorrectCriteria:** 전자 밀도 변화로 채널을 설명하면 정답; 단순히 'VGS>0이면 큰 전류'는 오답
- **misconceptions (3 anticipated wrong answers):** ① 전자들이 산화막을 통과한다 ② 문턱 아래 전류는 물리적으로 정확히 0이다 ③ 0.7V는 모든 트랜지스터의 문턱이다
- **hints (level 1/2/3):** ① 산화막은 절연체일까요? ② 전자는 산화막을 건너가나요, 바로 아래 표면에 모이나요? ③ 이 숫자가 소자별로 달라질 수 있을까요?
- **feedback/correct:** “방금 관찰한 변화가 핵심이에요. 게이트 전기장이 절연막을 가로질러 실리콘 표면 전하 분포를 조절해 반전층을 유도해요.”
- **feedback/incorrect:** “그렇게 예상할 수도 있어요. 산화막은 절연체일까요? 그림에서 다시 확인해 볼까요?”
- **feedback/hint:** “바로 답을 알려드리기보다, 전자는 산화막을 건너가나요, 바로 아래 표면에 모이나요?”
- **explanation:** 게이트 전기장이 절연막을 가로질러 실리콘 표면 전하 분포를 조절해 반전층을 유도해요.
- **nextHook:** 통로가 생겼는데 양쪽 전압이 같아도 전류가 흐를까요?
- **displayText:** 전압으로 전류 길을 열어볼까요?
- **speechText:** 전압을 올려볼까요? 표면의 전자들이 어떻게 모이는지 먼저 예상해 보세요.
- **physicsAssumptions:** 장채널 nMOS, 일정 온도, 예시 Vth=0.7V; subthreshold 전류와 게이트 누설을 생략한 시각 모델
- **sourceRefs:** [S16] 저항/CMOS 참고; A02 PR #5 모델 검토
- **A05:** 먼저 예측/선택 기록, 이어서 실시간 scene 반응; 정답/오답/힌트/왜? 상태마다 별도 시각 표현, 색상 외 모양/숫자로 의미 구별.

## Step 2 · M01-S02 / sceneId: mosfet-current
- **learningGoal:** 채널의 존재와 전류의 흐름을 구별
- **priorKnowledge:** M01-S01
- **storyHook:** 통로는 생겼는데 전류계가 여전히 0이에요.
- **question:** 양 끝의 전압이 같을 때 전류가 흐를까요?
- **prediction:** VDS 0V와 1V의 전류 화살표를 먼저 선택.
- **learnerAction:** VGS=1.5V 고정, VDS 0→0.8→1.8V, IV 곡선 보기
- **modelInputs:** VGS=1.5V; VDS: 0~2V; Vth=0.7V
- **expectedObservation:** VDS=0이면 순 DC 전류 0; 전위차가 생기면 전류 증가, 포화 이후에도 전류 유지
- **correctIncorrectCriteria:** 전류 생성에 VDS가 필요함을 설명하면 정답; 포화=전류 0이면 오답
- **misconceptions (3 anticipated wrong answers):** ① 채널만 열리면 언제나 전류가 흐른다 ② 핀치오프는 전류가 완전히 끊긴다는 뜻이다 ③ 전자 이동 방향이 전류 방향이다
- **hints (level 1/2/3):** ① 소스와 드레인의 전위가 똑같다면 어느 쪽으로 움직일까요? ② VDS를 바꿨을 때 그래프는 0에서 출발하나요? ③ 전자와 관습 전류 방향을 따로 보세요.
- **feedback/correct:** “방금 관찰한 변화가 핵심이에요. 전기가 흐를 길과 흐르게 하는 전위차는 달라요. 이상적인 포화 영역에서도 드레인 전류는 계속 흐릅니다.”
- **feedback/incorrect:** “그렇게 예상할 수도 있어요. 소스와 드레인의 전위가 똑같다면 어느 쪽으로 움직일까요? 그림에서 다시 확인해 볼까요?”
- **feedback/hint:** “바로 답을 알려드리기보다, VDS를 바꿨을 때 그래프는 0에서 출발하나요?”
- **explanation:** 전기가 흐를 길과 흐르게 하는 전위차는 달라요. 이상적인 포화 영역에서도 드레인 전류는 계속 흐릅니다.
- **nextHook:** 이 스위치를 출력선 아래에 달면 ON일 때 출력은 1일까요?
- **displayText:** 길이 열려도 전압 차이가 필요해요.
- **speechText:** 채널이 열려 있는데 전류가 없다니 신기하죠? 드레인 쪽 전압을 직접 바꿔봐요.
- **physicsAssumptions:** 장채널 square-law 근사; 이동도 변화·채널길이 변조·온도/누설 무시; 전류 상대 추세 위주
- **sourceRefs:** A02 PR #5 mosfetModel
- **A05:** 먼저 예측/선택 기록, 이어서 실시간 scene 반응; 정답/오답/힌트/왜? 상태마다 별도 시각 표현, 색상 외 모양/숫자로 의미 구별.

## Step 3 · M01-S03 / sceneId: nmos-resistor-inverter
- **learningGoal:** nMOS ON 상태와 출력 논리의 비동치를 실험
- **priorKnowledge:** 풀업 저항, 접지, M01-S02
- **storyHook:** 스위치가 켜졌다면 출력도 1? 정말 그럴까요?
- **question:** 입력을 HIGH로 바꾸면 출력 전압은 높아질까요, 낮아질까요?
- **prediction:** Vin=0·5V 각각 Vout의 논리값을 미리 고르세요.
- **learnerAction:** 5V 전원+10kΩ 풀업 저항+nMOS 풀다운; Vin LOW→HIGH 토글, Vout 실측 모델값 보기
- **modelInputs:** Vin ∈ {0V,5V}; VDD=5V; RD=10kΩ; A02 Ron 모델
- **expectedObservation:** Vin=0→Vout 5V(1), Vin=5→Vout 약 0.45V(0)
- **correctIncorrectCriteria:** 출력 진리값 [1,0]을 설명하면 정답; ON=출력1은 오답
- **misconceptions (3 anticipated wrong answers):** ① 트랜지스터가 켜지면 모든 회로에서 비트는 1이다 ② Vout는 항상 Vin과 똑같다 ③ ON일 때 완전 0Ω 단락이며 Vout는 정확히 0.000V다
- **hints (level 1/2/3):** ① 출력선은 스위치 ON일 때 어디로 당겨질까요? ② 풀업 저항의 역할을 생각해봐요. ③ 실제 0.45V를 이 장난감 회로에서 논리 0으로 읽는 이유는?
- **feedback/correct:** “방금 관찰한 변화가 핵심이에요. nMOS ON이면 출력이 저항보다 낮은 경로로 접지 가까이 내려가요. 비트는 회로가 정한 논리 전압 범위이고 ON/OFF 자체가 비트는 아니에요.”
- **feedback/incorrect:** “그렇게 예상할 수도 있어요. 출력선은 스위치 ON일 때 어디로 당겨질까요? 그림에서 다시 확인해 볼까요?”
- **feedback/hint:** “바로 답을 알려드리기보다, 풀업 저항의 역할을 생각해봐요.”
- **explanation:** nMOS ON이면 출력이 저항보다 낮은 경로로 접지 가까이 내려가요. 비트는 회로가 정한 논리 전압 범위이고 ON/OFF 자체가 비트는 아니에요.
- **nextHook:** 저항형 인버터는 ON 동안 전력이 낭비되는데 줄일 수 있을까요?
- **displayText:** ON인데 출력은 LOW?
- **speechText:** 출력이 어디와 연결되는지 눈으로 따라가볼까요? 먼저 예상하고 토글해봐요.
- **physicsAssumptions:** 현재 A02 PR #5 모델의 Vin=5V 출력 약 0.45V; 실제 전기적 단락은 아님
- **sourceRefs:** [S16] CMOS 인버터; A02 PR #5 inverterModel
- **A05:** 먼저 예측/선택 기록, 이어서 실시간 scene 반응; 정답/오답/힌트/왜? 상태마다 별도 시각 표현, 색상 외 모양/숫자로 의미 구별.

## Step 4 · M01-S04 / sceneId: cmos-not-gate
- **learningGoal:** CMOS 구조와 NOT 진리표를 구분
- **priorKnowledge:** M01-S03, pMOS의 상보 제어
- **storyHook:** 저항을 pMOS 스위치로 바꾸면 어떨까요?
- **question:** 입력 0과 1에서 위아래 소자 중 누가 열릴까요?
- **prediction:** 진리표 출력 두 칸을 먼저 입력.
- **learnerAction:** 상단 pMOS·하단 nMOS 도식을 입력 0↔1 토글; out0/out1 기록
- **modelInputs:** Vin=0 또는 VDD; out0 0/1; out1 0/1; 예시 이상 CMOS
- **expectedObservation:** 0→1, 1→0; 이상 정지 상태에서 전원~접지 직류 관통경로가 억제됨
- **correctIncorrectCriteria:** out0=1 AND out1=0이면 성공; CMOS 전력은 정확히 0이라는 주장은 오답
- **misconceptions (3 anticipated wrong answers):** ① CMOS 정적·동적 전력은 언제나 0이다 ② 논리 1은 '전자 있음'만 의미한다 ③ NOT 하나가 1T1C DRAM 셀이다
- **hints (level 1/2/3):** ① 입력 0일 때 위쪽 pMOS는 켜질까요? ② 입력 1일 때 아래쪽 nMOS는 켜질까요? ③ 전환 중 전력과 누설은 사라지나요?
- **feedback/correct:** “방금 관찰한 변화가 핵심이에요. pMOS와 nMOS를 상보적으로 연결해 출력은 입력의 반대가 되고, 정지 상태의 직접 관통 전류를 크게 줄여요. 스위칭·누설 전력은 남습니다.”
- **feedback/incorrect:** “그렇게 예상할 수도 있어요. 입력 0일 때 위쪽 pMOS는 켜질까요? 그림에서 다시 확인해 볼까요?”
- **feedback/hint:** “바로 답을 알려드리기보다, 입력 1일 때 아래쪽 nMOS는 켜질까요?”
- **explanation:** pMOS와 nMOS를 상보적으로 연결해 출력은 입력의 반대가 되고, 정지 상태의 직접 관통 전류를 크게 줄여요. 스위칭·누설 전력은 남습니다.
- **nextHook:** 그렇다면 만들어진 논리 1을 기억해 두려면 어떻게 해야 할까요?
- **displayText:** 입력을 뒤집는 한 쌍
- **speechText:** 두 스위치를 번갈아 움직여볼까요? 출력이 왜 뒤집히는지 이제 설명할 수 있어요.
- **physicsAssumptions:** A02 PR #5 inverter는 저항형 nMOS만 구현; CMOS 별도 신규 장면 필요; 실제 트랜지스터 특성/정지 전력 단순화
- **sourceRefs:** [S16] CMOS inverter, [S1] DRAM 다음
- **A05:** 먼저 예측/선택 기록, 이어서 실시간 scene 반응; 정답/오답/힌트/왜? 상태마다 별도 시각 표현, 색상 외 모양/숫자로 의미 구별.

## A05 자체 QA 체크
Step 4개, 각 Step 핵심 질문/예측/조작/관찰/정오답 기준/오개념 3개/힌트 3단계/Voice/가정/출처 기재. 실측 반도체 동작이 아닌 **명시적 교육용 모델**. 실제 사용자의 이해도·A05 구현 테스트·A02 앱 통합은 아직 수행되지 않음.
