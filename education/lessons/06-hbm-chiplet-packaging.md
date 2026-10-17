# 06 · HBM의 연결을 어떻게 만들까? 웨이퍼·칩렛·TSV·2.5D 패키징·열
> A06 교육용 독립 storyboard v0.1 (2026-10-17). **story/필드 자체 검토 완료, A05 제작 가능**, 앱 구현/브라우저/실사용 학습 검증 전.
> 선수지식: MOSFET 제조 기본, 03의 HBM/GDDR 비교, 공정 도입은 이 레슨 초반
> 학습 경로: 제조 공정→수율·칩렛→TSV/인터포저/2.5D 패키징→전력과 열 · 03 GPU HBM→06 실제 패키징→후속 전력/냉각·네트워크·데이터센터
> 교사 원칙: 핵심 질문 → 정답을 감춘 채 예측 → 직접 조작 → 관찰 → 왜? → 적용 → nextHook.
## Step 1 · 06-S01 — `fab-pattern-to-die`
- **sceneId:** `fab-pattern-to-die`
- **learningGoal:** 설계도를 웨이퍼에 옮기는 제조 공정의 단계 알기
- **priorKnowledge:** PN/MOS 도핑, 작은 회로 반복
- **storyHook:** 눈에 보이지도 않는 스위치를 수십억 개 어떻게 똑같이 만들까요?
- **question:** 마스크로 빛을 쏜 뒤 바로 동작하는 완성 칩이 될까요?
- **predictionPrompt (learner-visible):** 마스크로 한 번 노광하면 회로가 완성될지, 몇 번의 공정과 검사가 필요할지 먼저 예측해 보세요.
- **learnerAction:** wafer→pattern/photo→etch/deposit/implant→metal interconnect→test→dicing 카드 순서 맞추기.
- **modelInputs:** mask 1/2 toy, process stages 1...6, defect marker on/off
- **expectedObservation (teacher-only):** 반복 공정/다층 배선이 필요하고 결함 검사가 수율을 결정; 사진처럼 한번 인쇄로 완성되는 구조가 아니다.
- **teacherExpectedAnswer (gated):** 반복 공정/다층 배선이 필요하고 결함 검사가 수율을 결정; 사진처럼 한번 인쇄로 완성되는 구조가 아니다.
- **correctIncorrectCriteria:** 공정 단계를 올바르게 배열하고 layer 반복이 필요함 설명하면 성공.
- **misconceptions (3):** 1) 포토 공정 한 번이면 전체 트랜지스터·배선 완성 | 2) 웨이퍼 위 모든 칩은 무조건 100% 정상 동작 | 3) '3nm'라는 이름이 트랜지스터 정확한 물리 길이를 뜻한다
- **hints (3 levels):** 1) 도핑/배선도 한 번의 빛으로 완성될까요? | 2) 여러 층을 정렬해야 하겠죠? | 3) 공정 명칭과 실제 치수는 꼭 같나요?
- **feedback/correct:** "회로가 미세할수록 만드는 과정과 검사 모두 까다로워져요."
- **feedback/incorrect (dispatcher):** 선택한 잘못된 개념 m1/m2/m3에 따라 바로 아래 세 교정대사 중 하나만 조작·예측 후 공개. 하나의 generic 재질문만으로 평가 통과 불가.
- **feedback/hint (requested only):** L1/L2/L3 단계 힌트를 직접 요청할 때에만 공개. 오개념 원인 교정과 답 선공개 분리.
- **explanation:** 반도체 제조는 포토·식각·증착·주입·배선 등을 반복·정렬하고 시험한다. 공정 노드명은 특정 게이트 길이 하나가 아니다.
- **nextHook:** 웨이퍼에 설계도를 옮기고 지우고 채우는 과정을 맞춰볼까요? 한 번으로 끝나지 않네요.
- **displayText:** 칩도 여러 층을 쌓아 만들어요
- **speechTextBeforePrediction:** 빛을 쓰는 공정, 막을 쌓는 과정과 검사를 카드로 먼저 배치해 보세요.
- **speechTextAfterObservation (gated):** 한 번 인쇄하는 게 아니라 많은 층의 노광과 식각, 증착, 연결, 검사를 거쳐 다이를 만들어요.
- **physicsAssumptions:** [S27] ASML 반복 제조 공정, [S24] TSMC 3D 제조/조립 맥락
- **sourceRefs:** 칩렛·수율의 제조 동기로 연결.
- **A05 visual spec:** layered cutaway/circuit, 상태·단위·모형가정 항상 표시; 예측 이전 정답 노출 금지; 조작만으로 pass 금지; 정답/오답/hint feedback 직접 연결; keyboard/44px/reduced-motion/Voice 구분.


- **displayTextBeforePrediction:** 웨이퍼를 칩으로 만들려면 어떤 단계가 필요할까요?
- **displayTextAfterObservation (gated):** 반도체 제작에는 많은 반복 패턴·배선·검사가 필요해요.
- **misconceptionFeedback/m1 (gated):** “포토 공정 한 번은 전체 소자와 금속 배선을 완성하지 못해요. 층별 패턴·식각·증착과 정렬을 반복하죠.”
- **misconceptionFeedback/m2 (gated):** “한 웨이퍼에도 결함이 있어 정상 다이만 선별하는 테스트가 중요해요. 결함 없는 모형을 제품 보증과 혼동하면 안 돼요.”
- **misconceptionFeedback/m3 (gated):** “‘3nm’ 같은 노드명은 업체·세대별 공정 분류 이름이며 모든 트랜지스터 물리 길이가 정확히 3nm란 뜻은 아니에요.”
- **validation branch mapping:** wrongConcept=m1|m2|m3, exactly keyed response; correct on first prediction + 2 distinct physical states + WHY is eligible to pass without purposely choosing a wrong option.
## Step 2 · 06-S02 — `chiplet-yield-model`
- **sceneId:** `chiplet-yield-model`
- **learningGoal:** 큰 다이와 여러 칩렛으로 쪼개는 설계의 수율/비용 트레이드오프 이해
- **priorKnowledge:** 면적/확률, 제조 수율
- **storyHook:** 큰 칩 한 장이 불량이면 얼마나 아깝겠어요. 조각으로 나눠볼까요?
- **question:** 결함이 희박하게 퍼질 때 큰 칩과 작은 칩, 어떤 쪽이 살아남기 쉬울까요?
- **predictionPrompt (learner-visible):** 큰 다이 1개와 작은 다이 4개를 결합할 때, 검사 전에 네 개를 무작위로 뽑는 경우와 개별 검사 후 뽑는 경우에 완제품 성공확률이 어떻게 달라질지 예측해 보세요.
- **learnerAction:** Compare one 100mm² monolithic die vs four independent 25mm² chiplets at D0/0.005/mm². Toggle `screening=none|KGD` **before** assembly, and `assemblyYield=1.0|0.95` independent. Calculate small individual yield and **full four-die success** for unscreened vs pretested ideal KGD, count necessary candidates and cost. Trigger wrong ‘4×small individual yield = system yield’ choice.
- **modelInputs:** monoArea=100mm², chipletArea=25mm² each, chipletCount=4, defectDensity D=0|0.005 mm⁻² Poisson independent defects; singleDieYield=exp(−D·100), singleChipletYield=exp(−D·25), screening=none|KGD (ideal correct classification for toy), assemblyYield=1.0|0.95 per complete package (not per die), availableInventory=unlimited candidates for KGD only, screeningCost and time qualitative not zero.
- **expectedObservation (teacher-only):** At D=.005, mono die yield `exp(−.5)=0.60653`, individual small die `exp(−.125)=0.882497`. **Unscreened full 4-die** `0.882497^4=0.60653`; with assemblyYield0.95 final≈`0.57620`. **Ideal KGD (screened four functional dies from a sufficiently large candidate pool)** has conditional packaged-good probability ≈`0.95` after selection; still requires on average ≈`4/0.882497=4.532` manufactured candidates per pack and testing/assembly costs, excluding escapes. Without KGD do not show 0.95 success simply from die size. Monolithic packaging assembly treated separately for apples-to-apples comparisons.
- **teacherExpectedAnswer (gated):** yMono≈0.60653; ySmall≈0.88250; 4 unscreened simultaneous ySmall⁴≈0.60653 and assembly0.95 gives0.57620. Ideal screen/KGD lets only confirmed-good dies enter package, so post-screen package assembly pass0.95 in toy with adequate stock; unit yield cost is 4/0.8825≈4.53 input candidates, not four perfect dies for free. KGD screening not 100% in real production.
- **correctIncorrectCriteria:** Student must toggle screening none vs ideal KGD and assemblyYield1/0.95 separately, compute individual vs full product yield, reject ‘4 chiplets automatically higher full-product yield’. Explain screening yield cost + imperfect coverage risk.
- **misconceptions (3):** 1) 칩렛은 조각이 작으니 제품 수율이 반드시 올라간다 | 2) 패키지 조립 실패나 칩 간 통신 비용은 없다 | 3) 칩렛은 단일 다이보다 항상 전력이 적게 든다
- **hints (3 levels):** 1) 각 조각의 양품 확률과 4개를 모은 시스템 확률이 같을까요? | 2) 검사 후 양품 다이만 조립하면 어떤 비용이 줄까요? | 3) 칩렛 사이 신호선·전원·열 비용도 생각해봐요.
- **feedback/correct:** "작은 조각 하나의 수율과 연결한 완제품의 수율은 별개예요. 계산으로만 결론 내리기 어렵겠죠."
- **feedback/incorrect (dispatcher):** 선택한 잘못된 개념 m1/m2/m3에 따라 바로 아래 세 교정대사 중 하나만 조작·예측 후 공개. 하나의 generic 재질문만으로 평가 통과 불가.
- **feedback/hint (requested only):** L1/L2/L3 단계 힌트를 직접 요청할 때에만 공개. 오개념 원인 교정과 답 선공개 분리.
- **explanation:** 결함 밀도 가정에서 Y≈exp(-D×A)는 단일 다이의 1차 toy 근사. 선별·장당 제작 비용·패키지 수율·조립·인터커넥트 등을 빼면 실제 칩렛 이점 판단 불가능.
- **nextHook:** 큰 칩을 자르면 무조건 더 좋아질까요? 살아남은 조각을 다시 모으는 비용도 고려해봐요.
- **displayText:** 한 덩어리 vs 여러 조각
- **speechTextBeforePrediction:** 다이 크기와 결함 밀도, 검사 시점, 패키지 조립 수율을 먼저 선택해봐요.
- **speechTextAfterObservation (gated):** 작은 칩 한 개가 정상일 확률과 네 개를 이어 만든 제품의 수율은 달라요. 테스트로 양품을 고르는 비용과 패키징 실패확률도 생각해야 하죠.
- **physicsAssumptions:** [S24][S25] TSMC integration
- **sourceRefs:** TSV/인터포저 장면으로 연결.
- **A05 visual spec:** layered cutaway/circuit, 상태·단위·모형가정 항상 표시; 예측 이전 정답 노출 금지; 조작만으로 pass 금지; 정답/오답/hint feedback 직접 연결; keyboard/44px/reduced-motion/Voice 구분.


- **displayTextBeforePrediction:** 큰 칩과 작은 칩 네 개 중 어느 쪽이 살아남을까요?
- **displayTextAfterObservation (gated):** 선별 다이와 무작위 다이의 조립 결과는 달라질 수 있어요.
- **misconceptionFeedback/m1 (gated):** “다이 하나의 정상확률과 4개가 **모두 정상인 패키지** 성공확률은 다릅니다. 선별 없이 4개를 조립하면 독립확률의 곱을 계산해 보세요.”
- **misconceptionFeedback/m2 (gated):** “KGD(Known Good Die) 선별은 조립 전에 불량 다이를 줄이지만, 조립 실패·검사 오검출·추가 테스트/재고 비용을 없애지는 못해요.”
- **misconceptionFeedback/m3 (gated):** “인터포저 배선과 다이 간 통신, 패키지 발열·전력·수율은 설계 조건에 따라 달라져요. 칩렛이 언제나 전력 효율이 높은 건 아니에요.”
- **validation branch mapping:** wrongConcept=m1|m2|m3, exactly keyed response; correct on first prediction + 2 distinct physical states + WHY is eligible to pass without purposely choosing a wrong option.
- **negativePathTest:** `screening=none, assemblyYield=0.95, D=.005` => **0.57620**, NOT 0.95 or individual small0.8825; `screening=KGD ideal, assemblyYield=.95` => conditional assembly0.95 after test, show candidate cost4.53; even screened assemblyYield=.95 not 1.0. D0 => unscreened pre-assembly die yield1, with assembly0.95 final0.95.
## Step 3 · 06-S03 — `hbm-tsv-interposer`
- **sceneId:** `hbm-tsv-interposer`
- **learningGoal:** TSV와 인터포저/2.5D 실장으로 넓은 I/O를 설명
- **priorKnowledge:** G03 HBM 특성/패키징 예고
- **storyHook:** GPU가 HBM에 초당 막대한 데이터를 달라는데, 선을 어디에 꽂을까요?
- **question:** 보드 위 길게 뽑는 연결과 가까운 인터포저 연결이 같을까요?
- **predictionPrompt (learner-visible):** 수직 적층한 메모리 층과 옆의 GPU 다이 사이에 필요한 연결 구조를 서로 다른 카드로 예상해 보세요.
- **learnerAction:** GPU 다이+HBM 적층 다이를 평면으로 나란히 올리고 interposer RDL 배선 연결; 적층 내부 TSV 단면 토글; 신호경로 강조.
- **modelInputs:** topology PCB GDDR / 2.5D interposer GPU+HBM / stacked HBM; interposerType silicon/RDL concepts
- **expectedObservation (teacher-only):** HBM 다이는 수직 적층되고 층간 TSV/마이크로범프 등으로 연결, 패키지 내 GPU와 HBM 사이는 인터포저 계열의 고밀도 배선으로 연결될 수 있음. 2.5D의 기술적 의미가 UI 렌더링과 다름.
- **teacherExpectedAnswer (gated):** HBM 다이는 수직 적층되고 층간 TSV/마이크로범프 등으로 연결, 패키지 내 GPU와 HBM 사이는 인터포저 계열의 고밀도 배선으로 연결될 수 있음. 2.5D의 기술적 의미가 UI 렌더링과 다름.
- **correctIncorrectCriteria:** TSV가 메모리 내부 층간 연결, interposer가 옆 다이 사이 연결의 역할임을 분리하면 성공.
- **misconceptions (3):** 1) GPU 코어와 HBM 셀이 같은 실리콘 하나에 다 새겨진다 | 2) 패키지 인터포저는 무조건 실리콘 재료 하나만 있다 | 3) 2.5D UI 그림은 바로 실제 반도체 2.5D 패키징이다
- **hints (3 levels):** 1) HBM 스택의 위아래 다이 사이에는 무엇이 필요할까요? | 2) GPU 옆 HBM을 연결할 넓은 배선판은 무엇일까요? | 3) CoWoS-S와 R/L처럼 다른 interposer 구조가 있을까요?
- **feedback/correct:** "가까이 붙이고 잘 연결했더니 대역폭을 높일 방법이 보여요. 하지만 배선과 열은 더 어려워졌어요."
- **feedback/incorrect (dispatcher):** 선택한 잘못된 개념 m1/m2/m3에 따라 바로 아래 세 교정대사 중 하나만 조작·예측 후 공개. 하나의 generic 재질문만으로 평가 통과 불가.
- **feedback/hint (requested only):** L1/L2/L3 단계 힌트를 직접 요청할 때에만 공개. 오개념 원인 교정과 답 선공개 분리.
- **explanation:** HBM은 적층 DRAM, TSV 등은 스택 내부, 인터포저/배선 층은 다른 칩 사이. 2.5D/3D 공정·패키지는 제품마다 다르며 CoWoS 플랫폼에도 Si·RDL 계열 등이 있다.
- **nextHook:** 다이를 옆으로 가까이, HBM은 위로 쌓아볼까요? 두 연결의 역할이 다르게 보여요.
- **displayText:** GPU 옆에 HBM을 놓아볼까요?
- **speechTextBeforePrediction:** 층간 연결과 GPU 옆 다이 연결의 역할을 먼저 짐작해 보세요.
- **speechTextAfterObservation (gated):** HBM 적층 안쪽은 수직 연결이 필요하고 GPU와 HBM 옆면의 많은 신호선은 고밀도 패키지 배선으로 이을 수 있어요.
- **physicsAssumptions:** [S25] TSMC CoWoS, [S26] Micron HBM
- **sourceRefs:** 전력·냉각의 필요성으로 연결.
- **A05 visual spec:** layered cutaway/circuit, 상태·단위·모형가정 항상 표시; 예측 이전 정답 노출 금지; 조작만으로 pass 금지; 정답/오답/hint feedback 직접 연결; keyboard/44px/reduced-motion/Voice 구분.


- **displayTextBeforePrediction:** GPU와 HBM은 어떤 선으로 만날까요?
- **displayTextAfterObservation (gated):** 적층 안쪽의 TSV와 GPU 옆의 인터포저는 다른 연결이에요.
- **misconceptionFeedback/m1 (gated):** “GPU 계산 다이와 HBM 적층 메모리 다이는 일반적으로 별도 실리콘 다이들입니다. 패키지에서 나란히 연결될 수 있어요.”
- **misconceptionFeedback/m2 (gated):** “인터포저 역할은 고밀도 연결이에요. 특정 공정은 실리콘·유기/재배선 층(RDL) 같은 기술이 다를 수 있어요.”
- **misconceptionFeedback/m3 (gated):** “여기 쓰는 2.5D UI는 **시각화 방식**이고 HBM 패키지의 2.5D는 별도 실물 제조·배선 기술을 뜻해요.”
- **validation branch mapping:** wrongConcept=m1|m2|m3, exactly keyed response; correct on first prediction + 2 distinct physical states + WHY is eligible to pass without purposely choosing a wrong option.
## Step 4 · 06-S04 — `package-power-heat`
- **sceneId:** `package-power-heat`
- **learningGoal:** 칩렛/적층 HBM의 전력·열 제약을 시스템 조건과 연결
- **priorKnowledge:** 패키지/인터포저/대역폭, 전력
- **storyHook:** 메모리를 더 가까이 붙였는데 온도가 올라가면 모든 게 무효일까요?
- **question:** 같은 발열에서 냉각 능력을 바꾸면 온도 상승은 어떻게 될까요?
- **predictionPrompt (learner-visible):** 같은 열이라도 열저항을 낮추면 칩 온도 변화가 어떻게 달라질지 전력·열저항을 바꿔 예측해 보세요.
- **learnerAction:** toy thermal Rθ 0.2/0.4 K/W, power 20/40W 선택, ΔT≈P×Rθ를 계산하고 수동 냉각 카드 조절.
- **modelInputs:** power 20/40 W, Rtheta 0.2/0.4 K/W toy, ambient 25°C toy
- **expectedObservation (teacher-only):** 20W×0.2K/W=4K, 40W×0.4K/W=16K의 단순 온도상승. 같은 발열이라도 열저항 낮추면 온도상승 작아짐.
- **teacherExpectedAnswer (gated):** 20W×0.2K/W=4K, 40W×0.4K/W=16K의 단순 온도상승. 같은 발열이라도 열저항 낮추면 온도상승 작아짐.
- **correctIncorrectCriteria:** 전력·열저항 모두 필요한 이유/단위를 설명하면 성공; HBM 인터포저가 열을 완전히 없앤다는 답은 오답.
- **misconceptions (3):** 1) TSV가 많으면 발열이 0이 된다 | 2) 냉각 팬만 달면 소비 전력이 0이 된다 | 3) 칩 열저항은 온도·위치·시간·냉각과 무관한 절대 상수다
- **hints (3 levels):** 1) 전력 W에 열저항 K/W를 곱하면 단위는 무엇일까요? | 2) 냉각을 바꾸면 같은 W에도 상승 온도가 달라질까요? | 3) 실제 온도는 여러 칩의 열 결합·유동까지 계산해야 하겠죠?
- **feedback/correct:** "칩 설계를 계산 성능만으로 고를 수 없는 이유를 찾았네요. 열을 빼는 방법도 기술이에요."
- **feedback/incorrect (dispatcher):** 선택한 잘못된 개념 m1/m2/m3에 따라 바로 아래 세 교정대사 중 하나만 조작·예측 후 공개. 하나의 generic 재질문만으로 평가 통과 불가.
- **feedback/hint (requested only):** L1/L2/L3 단계 힌트를 직접 요청할 때에만 공개. 오개념 원인 교정과 답 선공개 분리.
- **explanation:** 열저항 단순 모델 ΔT=P×Rθ는 정상상태 한 경로 근사. 실제 적층/패키지에서 열이 여러 경로로 퍼지고 시간에 따라 달라진다. VRM/PMIC/냉각 신뢰성이 필수.
- **nextHook:** 전력을 두 배로 쓰면 온도는 얼마나 올라갈까요? 열이 빠져나갈 길도 같이 바꿔볼까요?
- **displayText:** 칩을 가까이 두면 열은 어디로 갈까요?
- **speechTextBeforePrediction:** 전력과 열저항 카드를 바꾸어 결과를 예상한 뒤 따로 계산해 봐요.
- **speechTextAfterObservation (gated):** 교육용 열저항 계산에선 전력에 열저항을 곱해 주위 온도와의 차이를 구할 수 있어요. 실제 칩 온도는 더 복잡하죠.
- **physicsAssumptions:** [S25] TSMC CoWoS power integrity; 열 모델 기본식
- **sourceRefs:** 데이터센터 전력·냉각과 안정성 레슨으로 연결.
- **A05 visual spec:** layered cutaway/circuit, 상태·단위·모형가정 항상 표시; 예측 이전 정답 노출 금지; 조작만으로 pass 금지; 정답/오답/hint feedback 직접 연결; keyboard/44px/reduced-motion/Voice 구분.

## QA status
- 4 steps × 17 required fields: 문서에서 점검, 각 Step마다 오개념 3개/힌트 3개·정답 전 조작/그 다음 질문.
- 숫자는 **toy**·공식은 조건 있는 근사. 정확한 제품 SKU 수치·장면 구현·브라우저 행동/접근성은 아직 검증되지 않았으므로 완료라고 부르지 않음.
- 실물 시뮬레이션은 A05 Scene 제작, A02 앱 엔진에 연결 전이며 A06는 파일로만 수업 내용을 인계.

- **displayTextBeforePrediction:** 패키지의 열을 어디로 보내야 할까요?
- **displayTextAfterObservation (gated):** 열저항이 높으면 같은 발열에서도 온도가 더 오를 수 있어요.
- **misconceptionFeedback/m1 (gated):** “TSV와 패키징을 붙여도 트랜지스터가 소비한 에너지의 열은 사라지지 않아요. 열저항과 냉각경로를 따로 계산해야 해요.”
- **misconceptionFeedback/m2 (gated):** “냉각팬 역시 전력을 소비해요. 팬을 달아도 칩 연산전력과 전체 시설전력이 0이 되는 건 아니에요.”
- **misconceptionFeedback/m3 (gated):** “0.2K/W 같은 열저항은 이 강의의 고정 **toy** 값이에요. 실제 열전달은 공간·시간·팬·액체·접촉저항·온도에 따라 달라질 수 있어요.”
- **validation branch mapping:** wrongConcept=m1|m2|m3, exactly keyed response; correct on first prediction + 2 distinct physical states + WHY is eligible to pass without purposely choosing a wrong option.

## A07 Round09 manufacturing/HBM independent review corrections · 2026-10-17
- [A07 independent R9 science audit](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-09-a06-fix-recheck-packaging06.md) found generic `feedback/incorrect` despite 3 misconceptions per step, S01 Voice hint accidentally spoiled ‘layers’ answer, S02 lacked screening/KGD controlled before assembly. New source: **all four Step student-neutral predictionPrompt**, 4 before/after Voice/display, each **3 distinct m1/m2/m3 branch feedback (12 total)**; Poisson individual vs full-system and assemblyYield 1/.95 with ideal screening/KGD independent. Toy calculations only, real test escape and known-good-die cost not modeled numerically; no app/Chromium run; A07 independent new SHA recheck pending.
