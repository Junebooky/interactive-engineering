# 11 · 실리콘은 어떻게 스위치가 될 준비를 할까? — 밴드·도핑·PN 접합 → MOS
> A06 2026-10-17 · **STORY_READY / FACT CHECKED (정성·식 출처) + TOY MODEL(모든 수치) / 실제 제품·앱 브라우저 QA 미수행**. 5 Step, 학습 계획 45–55분(추정), A05 직접 제작 가능.
> **위치:** 12 전압·전류 입문(첫 10분 마이크로 선행) → **11 본 레슨** → 14 MOS capacitor → 기존 01 MOSFET. 기존 01/02/06에서 ‘n/p는 왜?’ 빠진 학습자의 5-Step bridge.
> **교수원칙:** 첫 질문에 정답을 공개하지 않고 예측을 받은 뒤 조작하게 한다. 마스터는 문제를 외우는 것이 아니라 다음 질문을 스스로 만들게 하는 것. MVP XP/rank/reward/streak 제외. source-of-truth: [공학 심화·식 QA](../deep-dives/11-pn-foundations.md).

## 11-S01 · `semiconductor-band-gap`
### ① Beginner — 1분 상황·예측·손으로 발견
- **sceneId:** `semiconductor-band-gap`
- **learningGoal:** 금속·절연체·반도체의 bandgap과 전자/정공 개념을 구분
- **priorKnowledge:** P01 전하/전자; '에너지'는 흘러가는 입자 자체가 아님
- **storyHook:** 실리콘은 금속도 절연체도 아니라는데, 스위치는 어떻게 될까요?
- **question:** ‘전자에게 허용된 에너지 자리’ 사이의 틈을 움직이면 전하 이동 가능성이 달라질까요?
- **prediction (before revealing):** 금속처럼 겹친 bands / 작은 gap / 큰 gap 중 상온 전자가 전도 대역에 도달하기 쉬운 구조 고르기
- **learnerAction:** 에너지 밴드 EC-EV toy slider: overlap, ~1.1eV Si example, large gap 5eV illustrative; 열/빛으로 e−/hole pair 생성 애니메이션 토글
- **modelInputs:** bandgapMode=overlap/Si-like/large; lightOff/on; temperature=qualitative room/warm (no quantitative carrier model)
- **expectedObservation:** 금속은 전하 이동 상태가 많음; 반도체는 유한 gap, 열/빛·도핑에 따라 mobile carriers를 만들 수 있음; hole은 전자 빈자리의 집단적 표현
- **displayText (한두 문장):** 전자의 ‘에너지 자리’에 틈이 있네요.
- **speechText (자연스러운 존댓말):** 밴드갭은 실리콘에 실제로 뚫린 구멍이 아니에요. 전자가 올라갈 수 있는 에너지 자리의 간격이죠. 틈을 바꿔보세요.

### ② Intermediate — 예측 대비 관찰·계산·정오답 분기
- **correctIncorrectCriteria:** 밴드갭은 실제 공간 틈이 아니며 정공이 양전하 전자라는 뜻이 아니라는 것 두 가지를 설명
- **misconceptions:** [m1] 밴드갭은 웨이퍼에 뚫린 물리적 틈이다 / [m2] 정공은 플러스가 붙은 전자다 / [m3] 반도체는 전류가 절대로 흐르지 않는 절연체다
- **hints (3 layers):** [L1] 밴드는 건물 층이 아니라 허용된 **에너지** 구간이에요. / [L2] 전자 하나가 원자가띠에서 전도띠로 가면 남는 자리는? / [L3] 반도체에는 전압/온도/빛/도핑이 영향을 줍니다.
- **feedback/correct:** “좋아요. 지금 관찰한 것 중 직접 설명할 수 있는 건 무엇인가요? 금속은 전하 이동 상태가 많음; 반도체는 유한 gap, 열/빛·도핑에 따라 mobile carriers를 만들 수 있음; hole은 전자 빈자리의 집단적 표현”
- **feedback/incorrect keyed (selected misconception only):** [m1] “그건 실리콘 안의 빈 공간이 아니라 전자 에너지 사이의 구간이에요.” / [m2] “정공은 빠져나간 전자 빈자리의 이동을 양전하처럼 기술해요.” / [m3] “반도체는 조건에 따라 전하 운반자가 증가/감소할 수 있어요.”
- **explanation:** Si의 300K Eg≈1.1eV 정도(원료/온도에 따라 달라짐); 금속·절연체의 전달도는 단순 gap뿐 아니라 band occupancy, carrier mobility, scattering 등의 영향을 받음. 온도·빛으로 생성된 electron-hole pair 개념은 LED/태양전지/광전소자로도 분기.
- **interaction gates:** 사전 예측 저장 → 2개 이상의 변수 값 실제 조작 → 관찰 정보 열기 → 원리 질문에 답하기 → 정답+조건 만족 통과. **단순 버튼 클릭만으로 pass 금지**.

### ③ Senior design review — 예외·원리·검증/한계
- **physicsAssumptions:** 3개 band cartoon; Si Eg≈1.1eV example not a universal precise parameter; metal conductor/insulator categories oversimplified; carrier thermal population NOT quantitatively simulated.
- **sourceRefs:** [PN-B][PN-C][PN-A]
- **seniorFailureQuestion:** 입력이 한계에 가까워질 때 근사 모델이 무너지는 조건·시험 장비에서 무엇을 측정할지 제시. 제품별 온도·이동도·도핑농도·누설·breakdown·연결 및 표준 예외는 팩트 미확인 시 숨긴다.
- **teachBack:** Beginner=핵심 WHY 한 문장 / Intermediate=입력 바꾸고 관찰·숫자·단위 근거 / Senior=반례·대안 기술·재현 가능한 계측 질문 최소 1개.
- **nextHook:** 도핑 원자 하나를 섞으면 그 에너지 자리·전하 수는 어떻게 달라질까요?

## 11-S02 · `silicon-donor-acceptor-doping`
### ① Beginner — 1분 상황·예측·손으로 발견
- **sceneId:** `silicon-donor-acceptor-doping`
- **learningGoal:** 도핑 후 n형 다수 전자·p형 다수 정공과 전기적 중성 조건 구분
- **priorKnowledge:** 11-S01, 전자 음전하/정공 양 유효전하
- **storyHook:** 실리콘에 다른 원자를 조금 섞었는데, 전기가 더 잘 통할 수 있을까요?
- **question:** 실리콘 원자 4가 전자 대신 5가 원자·3가 원자를 넣으면 뭐가 달라질까요?
- **prediction (before revealing):** donor(P 같은 5가)는 electron majority, acceptor(B 같은 3가)는 hole majority 중 예상
- **learnerAction:** 실리콘 격자 10칸 toy에서 donor/acceptor 한 개 선택, 움직이는 전자/정공과 고정된 이온 라벨 따로 띄우기. minority carrier도 보조점 1개.
- **modelInputs:** dopant neutral/donor/acceptor; latticeCells=10 icon-only (not concentration); temp qualitative 300K
- **expectedObservation:** donor 도핑→n형 전자 다수, acceptor→p형 정공 다수. bulk 전체가 크게 충전된 덩어리인 것은 아니며 고정 이온·모바일 캐리어가 총전하를 보완
- **displayText (한두 문장):** n형은 전자가 많고, p형은 정공이 많아요.
- **speechText (자연스러운 존댓말):** n형은 전자가 다수, p형은 정공이 다수예요. 그런데 둘 다 덩어리 전체가 충전된 건 아니에요. 움직일 수 있는 전하를 따로 살펴봐요.

### ② Intermediate — 예측 대비 관찰·계산·정오답 분기
- **correctIncorrectCriteria:** n형 전자/p형 정공을 올바르게 구분, 'p 전체는 양전하'나 'n형엔 정공 0' 오답을 반박
- **misconceptions:** [m1] p형은 양전하 전자만으로 이뤄진다 / [m2] n형 실리콘 전체는 음전하로 충전된 배터리다 / [m3] n형에는 소수 정공이 절대로 존재하지 않는다
- **hints (3 layers):** [L1] 정공은 빠진 전자 자리의 변화로 표현해요. / [L2] 고정 도핑 이온과 모바일 전하의 총합도 살펴봐요. / [L3] 다수 carrier라는 말은 소수가 0이라는 말인가요?
- **feedback/correct:** “좋아요. 지금 관찰한 것 중 직접 설명할 수 있는 건 무엇인가요? donor 도핑→n형 전자 다수, acceptor→p형 정공 다수. bulk 전체가 크게 충전된 덩어리인 것은 아니며 고정 이온·모바일 캐리어가 총전하를 보완”
- **feedback/incorrect keyed (selected misconception only):** [m1] “p형 다수 carrier는 정공이고 전자가 양전하로 바뀐 건 아니에요.” / [m2] “대부분의 bulk는 이온과 캐리어 전하가 거의 중성이에요.” / [m3] “n형에도 열적으로 생기는 정공 같은 minority carrier가 존재해요.”
- **explanation:** Si 결정에 P donor는 전자 하나를 쉽게 제공, B acceptor는 hole 제공하는 대표적 도핑. 실제 ionization depends T/doping. '격자 10칸' 그림은 물리 농도 아님; 도핑 비율/이동도/강한 도핑에서 고전적 모델 깨짐.
- **interaction gates:** 사전 예측 저장 → 2개 이상의 변수 값 실제 조작 → 관찰 정보 열기 → 원리 질문에 답하기 → 정답+조건 만족 통과. **단순 버튼 클릭만으로 pass 금지**.

### ③ Senior design review — 예외·원리·검증/한계
- **physicsAssumptions:** 10개 원자 카드와 캐리어 점은 개념용, ionization/charge neutrality generalized, actual crystal doping concentrations not implied.
- **sourceRefs:** [PN-C][PN-A]
- **seniorFailureQuestion:** 입력이 한계에 가까워질 때 근사 모델이 무너지는 조건·시험 장비에서 무엇을 측정할지 제시. 제품별 온도·이동도·도핑농도·누설·breakdown·연결 및 표준 예외는 팩트 미확인 시 숨긴다.
- **teachBack:** Beginner=핵심 WHY 한 문장 / Intermediate=입력 바꾸고 관찰·숫자·단위 근거 / Senior=반례·대안 기술·재현 가능한 계측 질문 최소 1개.
- **nextHook:** 서로 다른 두 재료를 딱 붙이면 더 잘 흐를까요, 뜻밖의 장벽이 생길까요?

## 11-S03 · `pn-diffusion-drift-equilibrium`
### ① Beginner — 1분 상황·예측·손으로 발견
- **sceneId:** `pn-diffusion-drift-equilibrium`
- **learningGoal:** PN 접합 평형에서 확산과 내장 전기장에 의한 drift가 상쇄돼 net I=0인 이유
- **priorKnowledge:** 11-S02, 농도 높은 쪽→낮은 쪽 확산, 전계의 힘
- **storyHook:** n형·p형을 붙였어요. 전자가 퍼지기 시작했는데 왜 끝없이 흐르지 않을까요?
- **question:** 농도 차이로 움직이는 확산과 전기장 때문에 반대로 움직이는 drift는 언제 균형을 이룰까요?
- **prediction (before revealing):** n→p 전자 확산과 p→n 정공 확산 뒤 공핍층 전계 방향 n(+)→p(−), 순 DC 전류는 0일까요?
- **learnerAction:** n/p 두 블록 연결, carrier arrows diffusion→이온 고정→E field n→p 화살표→균형; drift/diffusion 전류 막대 1 vs 1 balanced toy + net=0
- **modelInputs:** junction separated/connected; normalized diffusionCurrent=1 and driftCurrent=-1 at equilibrium, no external bias
- **expectedObservation:** 접합 주변 이동 carrier 밀도 감소, p쪽 음 acceptor 이온/n쪽 양 donor 이온 형성, built-in E field; 평형시 drift+diffusion의 net 0 despite moving carriers
- **displayText (한두 문장):** 접합 안의 두 흐름이 균형을 이루네요.
- **speechText (자연스러운 존댓말):** 전자가 퍼지자 고정 이온이 드러나고, 그 이온들이 전기장을 만들어요. 퍼짐과 반대 작용이 균형을 잡으면 외부 전류는 0이 돼요.

### ② Intermediate — 예측 대비 관찰·계산·정오답 분기
- **correctIncorrectCriteria:** p측 음 고정이온·n측 양 고정이온과 E 방향, 0 net current 이유 세 가지를 모두 연결
- **misconceptions:** [m1] 공핍층에는 도핑 원자가 전부 사라진다 / [m2] 공핍층에 전기장이 생겼으니 외부 부하에 지속 전류가 자동 생긴다 / [m3] 평형에서 전류 0이면 모든 전자가 완전히 정지한다
- **hints (3 layers):** [L1] 떠난 carrier 자리에 남는 이온은 고정돼 있겠죠? / [L2] 농도 때문에 퍼지는 힘과 전기장 반작용이 같으면? / [L3] 순합이 0이어도 서로 반대인 flux는 있을 수 있어요.
- **feedback/correct:** “좋아요. 지금 관찰한 것 중 직접 설명할 수 있는 건 무엇인가요? 접합 주변 이동 carrier 밀도 감소, p쪽 음 acceptor 이온/n쪽 양 donor 이온 형성, built-in E field; 평형시 drift+diffusion의 net 0 despite moving carriers”
- **feedback/incorrect keyed (selected misconception only):** [m1] “이온은 남아 있고 **이동 가능한** 다수 carrier가 적어져요.” / [m2] “내장 전계는 내부 평형을 만든 것이지 무료 배터리 출력이 아니에요.” / [m3] “반대되는 drift와 diffusion 흐름이 상쇄돼 전체 전류가 0이에요.”
- **explanation:** equilibrium Fermi level alignment and space-charge region. ρ(p side)=-qNA, ρ(n side)=+qND depletion approximation; E points n→p; net drift+diffusion currents cancel. 내장 전압은 금속 단자 사이 외부 전압계로 지속 전력 추출 가능한 배터리 전압이 아님.
- **interaction gates:** 사전 예측 저장 → 2개 이상의 변수 값 실제 조작 → 관찰 정보 열기 → 원리 질문에 답하기 → 정답+조건 만족 통과. **단순 버튼 클릭만으로 pass 금지**.

### ③ Senior design review — 예외·원리·검증/한계
- **physicsAssumptions:** toy equal normalized currents 1 and −1 are visualization, no measured drift current; equilibrium at no external bias, ideal 1D, charge-depletion approximation.
- **sourceRefs:** [PN-A][PN-B]
- **seniorFailureQuestion:** 입력이 한계에 가까워질 때 근사 모델이 무너지는 조건·시험 장비에서 무엇을 측정할지 제시. 제품별 온도·이동도·도핑농도·누설·breakdown·연결 및 표준 예외는 팩트 미확인 시 숨긴다.
- **teachBack:** Beginner=핵심 WHY 한 문장 / Intermediate=입력 바꾸고 관찰·숫자·단위 근거 / Senior=반례·대안 기술·재현 가능한 계측 질문 최소 1개.
- **nextHook:** 배터리 극성을 바꿔 이 균형을 일부러 흔들면 공핍층 두께는 어떻게 될까요?

## 11-S04 · `pn-bias-depletion-calculator`
### ① Beginner — 1분 상황·예측·손으로 발견
- **sceneId:** `pn-bias-depletion-calculator`
- **learningGoal:** 순/역바이어스에 따른 공핍폭과 내장전위의 정량 관계·단위
- **priorKnowledge:** 11-S03, W=length·V=potential·sqrt/ln
- **storyHook:** 같은 PN 접합인데 배터리 방향만 바꿨더니 벽이 얇아졌다 두꺼워져요.
- **question:** p단자+ / n단자−(forward)와 반대(reverse)일 때 공핍폭은 각각 어떻게 달라질까요?
- **prediction (before revealing):** toy Va=-1/0/+0.2 V에서 W reverse > W0 > Wforward 순서 맞히기
- **learnerAction:** signed Va slider -1→+0.2V, dopant Na Nd 각각 1e16 cm^-3 toy (senior unlock 1e17 for one side), 장벽 Vbi-Va와 xp/xn/W 숫자 표시, 0V 때 균형 표시
- **modelInputs:** Si 300K; NA=ND=1e16cm^-3, ni=1e10cm^-3, epsSi=1.0359e-12F/cm, kT/q=25.852mV; Va=-1/0/+0.2 V. Advanced unequal-doping switch requires Vbi recalculation
- **expectedObservation:** Vbi≈0.7143V toy; W(-1V)≈0.6659µm, W(0)≈0.4298µm, W(+0.2)≈0.3647µm. Symmetric x_n=x_p=W/2. Reverse widens, forward narrows
- **displayText (한두 문장):** 배터리 방향이 장벽의 두께를 바꿔요.
- **speechText (자연스러운 존댓말):** 배터리를 순방향으로 연결했더니 내부 장벽이 낮아지고 공핍층이 얇아져요. 반대로 연결하면 더 두꺼워지네요. 장벽 두께를 직접 계산해볼까요?

### ② Intermediate — 예측 대비 관찰·계산·정오답 분기
- **correctIncorrectCriteria:** 3 values correct ordering and W≈µm scale with F/cm→µm unit; 내장전압이 외부로 0.714V 출력된다고 믿으면 오답
- **misconceptions:** [m1] 순방향에서 공핍층은 더 넓어진다 / [m2] Vbi=0.714V는 전극에서 꺼내 쓰는 충전된 배터리다 / [m3] 도핑을 정확히 두 배 넣으면 공핍폭은 언제나 딱 절반이다
- **hints (3 layers):** [L1] p쪽에 (+)를 연결하면 carrier 주입 장벽이 어떻게 바뀔까요? / [L2] Vbi−Va 라는 식을 보세요. Va가 +면? / [L3] W∝√[(1/Na+1/Nd)(Vbi−Va)]; Vbi도 doping에 따라 달라요.
- **feedback/correct:** “좋아요. 지금 관찰한 것 중 직접 설명할 수 있는 건 무엇인가요? Vbi≈0.7143V toy; W(-1V)≈0.6659µm, W(0)≈0.4298µm, W(+0.2)≈0.3647µm. Symmetric x_n=x_p=W/2. Reverse widens, forward narrows”
- **feedback/incorrect keyed (selected misconception only):** [m1] “순방향은 장벽을 낮추므로 이 1D 모형에서 공핍폭이 좁아져요.” / [m2] “내장전압은 내부의 전위분포예요. 밖에서 무한히 꺼낼 전력이 아니에요.” / [m3] “제곱근과 로그가 함께 움직이니 무조건 절반이 아니에요.”
- **explanation:** V_T=kBT/q, Vbi=V_T ln(NA ND/ni^2), W=sqrt[(2epsilonSi/q)(1/Na+1/Nd)(Vbi-Va)]. depletion approx & Va<Vbi; Na*xp=Nd*xn, lower-doped side W extends more. cm↔µm units and temperature limitation explicitly shown; forward high-injection/outside depletion limit not simulated.
- **interaction gates:** 사전 예측 저장 → 2개 이상의 변수 값 실제 조작 → 관찰 정보 열기 → 원리 질문에 답하기 → 정답+조건 만족 통과. **단순 버튼 클릭만으로 pass 금지**.

### ③ Senior design review — 예외·원리·검증/한계
- **physicsAssumptions:** Si ideal abrupt junction/300K/constant eps/ni=1e10, depletion 1D non-degenerate, Va < Vbi. W values rounded. Actual device built-in potentials not transferable to silicon product.
- **sourceRefs:** [PN-A][PN-B]
- **seniorFailureQuestion:** 입력이 한계에 가까워질 때 근사 모델이 무너지는 조건·시험 장비에서 무엇을 측정할지 제시. 제품별 온도·이동도·도핑농도·누설·breakdown·연결 및 표준 예외는 팩트 미확인 시 숨긴다.
- **teachBack:** Beginner=핵심 WHY 한 문장 / Intermediate=입력 바꾸고 관찰·숫자·단위 근거 / Senior=반례·대안 기술·재현 가능한 계측 질문 최소 1개.
- **nextHook:** 공핍폭만 바뀐 걸까요? 다이오드로 흐르는 전류는 전압에 어떻게 반응할까요?

## 11-S05 · `pn-diode-current-to-mos`
### ① Beginner — 1분 상황·예측·손으로 발견
- **sceneId:** `pn-diode-current-to-mos`
- **learningGoal:** 정류 I-V vs 저항 선형 I-V, reverse leakage, diode vs MOS gate oxide 제어 구분
- **priorKnowledge:** 11-S04 + 옴의 법칙 기초
- **storyHook:** 전류가 직선으로 커질 줄 알았는데, 다이오드는 곡선으로 휘어요.
- **question:** 순방향 0.3V에서 0.4V로 조금 올리면 다이오드 전류가 얼마쯤 변할까요? 0.7V 미만에는 정말 0일까요?
- **prediction (before revealing):** toy Is=1pA, ideality n=2, T=300K: at +0.3V ~0.330nA, +0.4V ~2.289nA, reverse −1V ≈−1pA 예상
- **learnerAction:** I-V log graph와 선형 resistor 1kΩ 비교, signed V=-1/0/0.3/0.4, leakage & breakdown caution. 마지막 PN diode vs MOS insulated gate circuit 카드 골라 P/N source/drain body diode와 field-effect path 구분
- **modelInputs:** Is=1pA, n=2 toy, VT=25.852mV, temperature=300K, R=1kΩ comparison, bias -1/0/0.3/0.4
- **expectedObservation:** Shockley toy I0=0, I(0.3)≈0.330nA, I(0.4)≈2.289nA, reverse≈−1pA (magnitude). 0.7V hard threshold 부정; pn junction injected current differs MOS insulated-gate field control
- **displayText (한두 문장):** 다이오드 I–V는 ‘딱 켜짐’이 아니라 곡선이에요.
- **speechText (자연스러운 존댓말):** 0.7볼트에서 갑자기 문이 열리는 건 아니에요. 전류는 전압에 따라 계속 변하죠. 그런데 MOSFET은 다른 방식으로 길을 만들어요. 다음 장면에서 볼까요?

### ② Intermediate — 예측 대비 관찰·계산·정오답 분기
- **correctIncorrectCriteria:** Shockley current grows nonlinear & reverse nonzero leakage, MOS oxide separates gate from channel, 'MOSFET=PN diode with extra terminal' 오개념 반박
- **misconceptions:** [m1] 다이오드 전압 0.7V 아래는 항상 전류가 정확히 0이다 / [m2] PN 접합의 Vbi는 다이오드 '켜짐' 전압과 항상 같다 / [m3] MOSFET의 게이트는 PN 접합을 직접 통과시키며 전류를 만든다
- **hints (3 layers):** [L1] 지수함수는 0이 되는 경계가 아니라 연속된 곡선이에요. / [L2] Vbi는 내부 평형 전위와 접합 도핑의 함수이고 회로 전류의 단일 고정 문턱이 아니에요. / [L3] MOS는 'metal-oxide-semiconductor' 구조: 산화막 절연을 기억해보세요.
- **feedback/correct:** “좋아요. 지금 관찰한 것 중 직접 설명할 수 있는 건 무엇인가요? Shockley toy I0=0, I(0.3)≈0.330nA, I(0.4)≈2.289nA, reverse≈−1pA (magnitude). 0.7V hard threshold 부정; pn junction injected current differs MOS insulated-gate field control”
- **feedback/incorrect keyed (selected misconception only):** [m1] “전류는 실제 온도/Is/전압에 따라 연속적으로 증가해요.” / [m2] “내장전위와 특정 순방향 회로전압(예: 0.7V)은 같은 정의가 아니에요.” / [m3] “MOS 게이트는 절연막을 통해 전계로 표면 전하를 바꿔요. 의도한 DC 게이트 전류는 흐르지 않아야 하죠.”
- **explanation:** I=Is(exp(V/(nVT))−1). +0.3→0.4V is ~6.94x for given toy. n=2 denotes illustrative ideality, Is device-specific. Real reverse leakage is T-dependent and breakdown not modeled; real high current series resistance/self-heating invalidate ideal form. To reach 01 lesson, MOS capacitor 14 bridge explains inversion vs PN diode; MOSFET source-drain are junctions but current control isn't just forward diode conduction.
- **interaction gates:** 사전 예측 저장 → 2개 이상의 변수 값 실제 조작 → 관찰 정보 열기 → 원리 질문에 답하기 → 정답+조건 만족 통과. **단순 버튼 클릭만으로 pass 금지**.

### ③ Senior design review — 예외·원리·검증/한계
- **physicsAssumptions:** Is=1pA,n=2 empirical toy, 300K, no breakdown/series resistance/self heating/high-level injection; all current data derived from this toy not measured; logarithmic plot uses log absolute with polarity marker.
- **sourceRefs:** [PN-A][PN-B][PN-C]
- **seniorFailureQuestion:** 입력이 한계에 가까워질 때 근사 모델이 무너지는 조건·시험 장비에서 무엇을 측정할지 제시. 제품별 온도·이동도·도핑농도·누설·breakdown·연결 및 표준 예외는 팩트 미확인 시 숨긴다.
- **teachBack:** Beginner=핵심 WHY 한 문장 / Intermediate=입력 바꾸고 관찰·숫자·단위 근거 / Senior=반례·대안 기술·재현 가능한 계측 질문 최소 1개.
- **nextHook:** 그렇다면 산화막을 사이에 둔 게이트는 어떻게 실리콘 표면 전자를 모을까요? → 14 MOS 커패시터 → 01 MOSFET

## A05 제작용 명세 및 1차 회귀시험
| Step | Scene 중심 시각적 객체 | 상호작용·상태/단위 | 필수 회귀 |
|---|---|---|---|
| 11-S01 | energy band 상단/하단, e−/hole 별도 기호 | energy gaps qualitative/eV label | gap은 물리 구멍 아님; hole≠양전자 |
| 11-S02 | Si 결정 안 donor P·acceptor B 카드, fixed ion vs movable | dopant choice; majority/minority | n:electron/p:hole, bulk neutral, minority not zero |
| 11-S03 | n/p contact cutaway·확산/drift 두 화살표+전계·fixed ions | join/equilibrium, sign and net 0 | E n+→p−, drift+diffusion cancel, free battery 해설 금지 |
| 11-S04 | depletion width W/xn/xp bar vs applied signed bias | Va -1/0/+0.2 V; W in µm toy, Na/Nd in cm^-3 | 0.6659/0.4298/0.3647µm, VA polarity, Vbi≠terminal voltage, sqrt units |
| 11-S05 | ideal diode I–V (+signed current); MOS gate isolated contrast | Is 1pA/n2/VT25.85mV; -1/0/+0.3/+0.4V | -1pA/0/+0.330nA/+2.289nA; no hard 0.7 threshold |

- **Scene interface**: `sceneId`, `values`, `revealed` (pre-prediction false), controlled predictable actions, `observation`, `misconceptionId`, `hintLevel`, `speechText`, `displayText`. Props shape A05 decides with A02 contract; A06 does not edit app engine/2.5D code. Do not leak answer in pre-prediction readouts/tutor speech; allow keyboard/touch/reduced-motion and numerical unit alt-text.
- **No asset reuse of MIT original figure**: draw new A05 2.5D cutaway and band-energy diagram; source is for fact-check only.
- **Physical fidelity**: PN reverse depletion must not be represented as *no carriers whatsoever*; diagram distinguishes immobile ions vs mobile carriers. n/p neutral bulk vs contact space-charge region. E arrow is from n positive ion to p negative ion in depletion. sign of bias is p relative to n.
- **Model numeric guard:** after 0.2V forward model uses low injection approximation, closer to Va≈Vbi or high doping cannot extrapolate W; I-V model at -1V excludes breakdown. **0.714V internal built-in potential is not measured open-circuit battery output.** All toy parameters visible in info drawer + always “교육용 모델” label.
- **Quality gate:** self-checked five scenes×core contract/3 misconceptions/3 targeted feedback/3 hints/Voice & nextHook, *not* rendered/tested. A05 browser screenshot/logic readout in its separate PR; A02 integration later; main merge/deploy forbidden.

## sourceRefs (checkedAt 2026-10-17)
[PN-A] MIT 3.024 OCW PN lecture 18 (2013), pp 4/5/7 https://ocw.mit.edu/courses/3-024-electronic-optical-and-magnetic-properties-of-materials-spring-2013/833afa926e598523708318bdf7d6a4ed_MIT3_024S13_2012lec18.pdf
[PN-B] OpenStax University Physics Vol 3 9.7 https://openstax.org/books/university-physics-volume-3/pages/9-7-semiconductor-devices
[PN-C] OpenStax 9.6 https://openstax.org/books/university-physics-volume-3/pages/9-6-semiconductors-and-doping (p-type majority=holes verified against MIT; one mistaken textbook sentence not repeated).
More formula limits/source confidence: [11 deep dive](../deep-dives/11-pn-foundations.md).
