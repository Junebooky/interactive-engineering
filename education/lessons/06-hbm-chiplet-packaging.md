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
- **prediction:** 학생은 조작 전에 선택/이유를 기록; 마스크로 빛을 쏜 뒤 바로 동작하는 완성 칩이 될까요?
- **learnerAction:** wafer→pattern/photo→etch/deposit/implant→metal interconnect→test→dicing 카드 순서 맞추기.
- **modelInputs:** mask 1/2 toy, process stages 1...6, defect marker on/off
- **expectedObservation:** 반복 공정/다층 배선이 필요하고 결함 검사가 수율을 결정; 사진처럼 한번 인쇄로 완성되는 구조가 아니다.
- **correctIncorrectCriteria:** 공정 단계를 올바르게 배열하고 layer 반복이 필요함 설명하면 성공.
- **misconceptions (3):** 1) 포토 공정 한 번이면 전체 트랜지스터·배선 완성 | 2) 웨이퍼 위 모든 칩은 무조건 100% 정상 동작 | 3) '3nm'라는 이름이 트랜지스터 정확한 물리 길이를 뜻한다
- **hints (3 levels):** 1) 도핑/배선도 한 번의 빛으로 완성될까요? | 2) 여러 층을 정렬해야 하겠죠? | 3) 공정 명칭과 실제 치수는 꼭 같나요?
- **feedback/correct:** "회로가 미세할수록 만드는 과정과 검사 모두 까다로워져요."
- **feedback/incorrect (concept-specific):** "하나의 칩을 엄청 크게 만들면 왜 제조가 어려워질까요?" (각 오답 선택별로 **해당 misconceptions의 문장을 반박**하는 시각 원인과 관찰로 되돌릴 것)
- **feedback/hint:** 여러 층을 정렬해야 하겠죠?
- **explanation:** 반도체 제조는 포토·식각·증착·주입·배선 등을 반복·정렬하고 시험한다. 공정 노드명은 특정 게이트 길이 하나가 아니다.
- **nextHook:** 웨이퍼에 설계도를 옮기고 지우고 채우는 과정을 맞춰볼까요? 한 번으로 끝나지 않네요.
- **displayText:** 칩도 여러 층을 쌓아 만들어요
- **speechText:** 칩도 여러 층을 쌓아 만들어요
- **physicsAssumptions:** [S27] ASML 반복 제조 공정, [S24] TSMC 3D 제조/조립 맥락
- **sourceRefs:** 칩렛·수율의 제조 동기로 연결.
- **A05 visual spec:** layered cutaway/circuit, 상태·단위·모형가정 항상 표시; 예측 이전 정답 노출 금지; 조작만으로 pass 금지; 정답/오답/hint feedback 직접 연결; keyboard/44px/reduced-motion/Voice 구분.

## Step 2 · 06-S02 — `chiplet-yield-model`
- **sceneId:** `chiplet-yield-model`
- **learningGoal:** 큰 다이와 여러 칩렛으로 쪼개는 설계의 수율/비용 트레이드오프 이해
- **priorKnowledge:** 면적/확률, 제조 수율
- **storyHook:** 큰 칩 한 장이 불량이면 얼마나 아깝겠어요. 조각으로 나눠볼까요?
- **question:** 결함이 희박하게 퍼질 때 큰 칩과 작은 칩, 어떤 쪽이 살아남기 쉬울까요?
- **prediction:** 학생은 조작 전에 선택/이유를 기록; 결함이 희박하게 퍼질 때 큰 칩과 작은 칩, 어떤 쪽이 살아남기 쉬울까요?
- **learnerAction:** 같은 총 회로 면적 100mm²를 1개 vs 4×25mm² 이상 다이로 분리; 결함 밀도 D 0/0.005/mm² 조절; 유효 다이 수율 비교.
- **modelInputs:** area 100mm² or 4×25mm², D 0 or 0.005 /mm² (toy), assemblyYield optional
- **expectedObservation:** Poisson toy: 단독 100mm² 양품 확률 exp(-0.5)=0.6065; 25mm² 소형 다이 개별 양품 확률 exp(-0.125)=0.8825. 하지만 4개를 단순히 모두 한번에 결합하면 전체 성공확률=exp(-0.5)로 동일해질 수도 있으며, 선별(KGD)·패키징 수율·배선 비용을 함께 고려해야 실제 이익.
- **correctIncorrectCriteria:** 개별 소형 다이 수율과 완제품 시스템 수율을 구분한 경우에만 성공; 무조건 칩렛 4개=전체 시스템 더 높은 수율은 오답.
- **misconceptions (3):** 1) 칩렛은 조각이 작으니 제품 수율이 반드시 올라간다 | 2) 패키지 조립 실패나 칩 간 통신 비용은 없다 | 3) 칩렛은 단일 다이보다 항상 전력이 적게 든다
- **hints (3 levels):** 1) 각 조각의 양품 확률과 4개를 모은 시스템 확률이 같을까요? | 2) 검사 후 양품 다이만 조립하면 어떤 비용이 줄까요? | 3) 칩렛 사이 신호선·전원·열 비용도 생각해봐요.
- **feedback/correct:** "작은 조각 하나의 수율과 연결한 완제품의 수율은 별개예요. 계산으로만 결론 내리기 어렵겠죠."
- **feedback/incorrect (concept-specific):** "작은 칩을 연결한다면 선로를 어디에 깔아야 할까요?" (각 오답 선택별로 **해당 misconceptions의 문장을 반박**하는 시각 원인과 관찰로 되돌릴 것)
- **feedback/hint:** 검사 후 양품 다이만 조립하면 어떤 비용이 줄까요?
- **explanation:** 결함 밀도 가정에서 Y≈exp(-D×A)는 단일 다이의 1차 toy 근사. 선별·장당 제작 비용·패키지 수율·조립·인터커넥트 등을 빼면 실제 칩렛 이점 판단 불가능.
- **nextHook:** 큰 칩을 자르면 무조건 더 좋아질까요? 살아남은 조각을 다시 모으는 비용도 고려해봐요.
- **displayText:** 한 덩어리 vs 여러 조각
- **speechText:** 한 덩어리 vs 여러 조각
- **physicsAssumptions:** [S24][S25] TSMC integration
- **sourceRefs:** TSV/인터포저 장면으로 연결.
- **A05 visual spec:** layered cutaway/circuit, 상태·단위·모형가정 항상 표시; 예측 이전 정답 노출 금지; 조작만으로 pass 금지; 정답/오답/hint feedback 직접 연결; keyboard/44px/reduced-motion/Voice 구분.

## Step 3 · 06-S03 — `hbm-tsv-interposer`
- **sceneId:** `hbm-tsv-interposer`
- **learningGoal:** TSV와 인터포저/2.5D 실장으로 넓은 I/O를 설명
- **priorKnowledge:** G03 HBM 특성/패키징 예고
- **storyHook:** GPU가 HBM에 초당 막대한 데이터를 달라는데, 선을 어디에 꽂을까요?
- **question:** 보드 위 길게 뽑는 연결과 가까운 인터포저 연결이 같을까요?
- **prediction:** 학생은 조작 전에 선택/이유를 기록; 보드 위 길게 뽑는 연결과 가까운 인터포저 연결이 같을까요?
- **learnerAction:** GPU 다이+HBM 적층 다이를 평면으로 나란히 올리고 interposer RDL 배선 연결; 적층 내부 TSV 단면 토글; 신호경로 강조.
- **modelInputs:** topology PCB GDDR / 2.5D interposer GPU+HBM / stacked HBM; interposerType silicon/RDL concepts
- **expectedObservation:** HBM 다이는 수직 적층되고 층간 TSV/마이크로범프 등으로 연결, 패키지 내 GPU와 HBM 사이는 인터포저 계열의 고밀도 배선으로 연결될 수 있음. 2.5D의 기술적 의미가 UI 렌더링과 다름.
- **correctIncorrectCriteria:** TSV가 메모리 내부 층간 연결, interposer가 옆 다이 사이 연결의 역할임을 분리하면 성공.
- **misconceptions (3):** 1) GPU 코어와 HBM 셀이 같은 실리콘 하나에 다 새겨진다 | 2) 패키지 인터포저는 무조건 실리콘 재료 하나만 있다 | 3) 2.5D UI 그림은 바로 실제 반도체 2.5D 패키징이다
- **hints (3 levels):** 1) HBM 스택의 위아래 다이 사이에는 무엇이 필요할까요? | 2) GPU 옆 HBM을 연결할 넓은 배선판은 무엇일까요? | 3) CoWoS-S와 R/L처럼 다른 interposer 구조가 있을까요?
- **feedback/correct:** "가까이 붙이고 잘 연결했더니 대역폭을 높일 방법이 보여요. 하지만 배선과 열은 더 어려워졌어요."
- **feedback/incorrect (concept-specific):** "좁은 패키지에 열이 몰리면 어떻게 식힐까요?" (각 오답 선택별로 **해당 misconceptions의 문장을 반박**하는 시각 원인과 관찰로 되돌릴 것)
- **feedback/hint:** GPU 옆 HBM을 연결할 넓은 배선판은 무엇일까요?
- **explanation:** HBM은 적층 DRAM, TSV 등은 스택 내부, 인터포저/배선 층은 다른 칩 사이. 2.5D/3D 공정·패키지는 제품마다 다르며 CoWoS 플랫폼에도 Si·RDL 계열 등이 있다.
- **nextHook:** 다이를 옆으로 가까이, HBM은 위로 쌓아볼까요? 두 연결의 역할이 다르게 보여요.
- **displayText:** GPU 옆에 HBM을 놓아볼까요?
- **speechText:** GPU 옆에 HBM을 놓아볼까요?
- **physicsAssumptions:** [S25] TSMC CoWoS, [S26] Micron HBM
- **sourceRefs:** 전력·냉각의 필요성으로 연결.
- **A05 visual spec:** layered cutaway/circuit, 상태·단위·모형가정 항상 표시; 예측 이전 정답 노출 금지; 조작만으로 pass 금지; 정답/오답/hint feedback 직접 연결; keyboard/44px/reduced-motion/Voice 구분.

## Step 4 · 06-S04 — `package-power-heat`
- **sceneId:** `package-power-heat`
- **learningGoal:** 칩렛/적층 HBM의 전력·열 제약을 시스템 조건과 연결
- **priorKnowledge:** 패키지/인터포저/대역폭, 전력
- **storyHook:** 메모리를 더 가까이 붙였는데 온도가 올라가면 모든 게 무효일까요?
- **question:** 같은 발열에서 냉각 능력을 바꾸면 온도 상승은 어떻게 될까요?
- **prediction:** 학생은 조작 전에 선택/이유를 기록; 같은 발열에서 냉각 능력을 바꾸면 온도 상승은 어떻게 될까요?
- **learnerAction:** toy thermal Rθ 0.2/0.4 K/W, power 20/40W 선택, ΔT≈P×Rθ를 계산하고 수동 냉각 카드 조절.
- **modelInputs:** power 20/40 W, Rtheta 0.2/0.4 K/W toy, ambient 25°C toy
- **expectedObservation:** 20W×0.2K/W=4K, 40W×0.4K/W=16K의 단순 온도상승. 같은 발열이라도 열저항 낮추면 온도상승 작아짐.
- **correctIncorrectCriteria:** 전력·열저항 모두 필요한 이유/단위를 설명하면 성공; HBM 인터포저가 열을 완전히 없앤다는 답은 오답.
- **misconceptions (3):** 1) TSV가 많으면 발열이 0이 된다 | 2) 냉각 팬만 달면 소비 전력이 0이 된다 | 3) 칩 열저항은 온도·위치·시간·냉각과 무관한 절대 상수다
- **hints (3 levels):** 1) 전력 W에 열저항 K/W를 곱하면 단위는 무엇일까요? | 2) 냉각을 바꾸면 같은 W에도 상승 온도가 달라질까요? | 3) 실제 온도는 여러 칩의 열 결합·유동까지 계산해야 하겠죠?
- **feedback/correct:** "칩 설계를 계산 성능만으로 고를 수 없는 이유를 찾았네요. 열을 빼는 방법도 기술이에요."
- **feedback/incorrect (concept-specific):** "많은 GPU를 한 랙에 모으면 전원·냉각·네트워크를 같이 설계해야겠죠?" (각 오답 선택별로 **해당 misconceptions의 문장을 반박**하는 시각 원인과 관찰로 되돌릴 것)
- **feedback/hint:** 냉각을 바꾸면 같은 W에도 상승 온도가 달라질까요?
- **explanation:** 열저항 단순 모델 ΔT=P×Rθ는 정상상태 한 경로 근사. 실제 적층/패키지에서 열이 여러 경로로 퍼지고 시간에 따라 달라진다. VRM/PMIC/냉각 신뢰성이 필수.
- **nextHook:** 전력을 두 배로 쓰면 온도는 얼마나 올라갈까요? 열이 빠져나갈 길도 같이 바꿔볼까요?
- **displayText:** 칩을 가까이 두면 열은 어디로 갈까요?
- **speechText:** 칩을 가까이 두면 열은 어디로 갈까요?
- **physicsAssumptions:** [S25] TSMC CoWoS power integrity; 열 모델 기본식
- **sourceRefs:** 데이터센터 전력·냉각과 안정성 레슨으로 연결.
- **A05 visual spec:** layered cutaway/circuit, 상태·단위·모형가정 항상 표시; 예측 이전 정답 노출 금지; 조작만으로 pass 금지; 정답/오답/hint feedback 직접 연결; keyboard/44px/reduced-motion/Voice 구분.

## QA status
- 4 steps × 17 required fields: 문서에서 점검, 각 Step마다 오개념 3개/힌트 3개·정답 전 조작/그 다음 질문.
- 숫자는 **toy**·공식은 조건 있는 근사. 정확한 제품 SKU 수치·장면 구현·브라우저 행동/접근성은 아직 검증되지 않았으므로 완료라고 부르지 않음.
- 실물 시뮬레이션은 A05 Scene 제작, A02 앱 엔진에 연결 전이며 A06는 파일로만 수업 내용을 인계.
