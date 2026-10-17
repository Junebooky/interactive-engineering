# 14 · 절연막으로 막혔는데 전자가 움직여요? MOS 커패시터→MOSFET
> 2026-10-17 · **A06 SELF_QA / A07 INDEPENDENT_QA_PENDING (EDU_QA_PASS 미확정)**. 4 Step 교육 명세, 35–45분 기획 추정. A05 제작은 A07 BLOCKER/MAJOR 교정 후 직접 인계. 현시점 소스·수식 검산만, 앱/렌더링·학생 검증 없음.
> 선수: 12 V/I/RC 및 11 도핑/PN; 다음: 기존 01 nMOS→CMOS. 질문→예측(선공개 방지)→직접 조작→관찰→오개념별 이유→다음 질문. 기초/중급/현업 시니어 3겹의 깊이. [정량 검증 및 원문·비유의 한계](../deep-dives/14-mos-capacitor-physics.md).

## 14-S01 · `mos-oxide-field-without-dc-path`
### ① 기초: 아직 정답을 말하지 않는 질문
- **sceneId:** `mos-oxide-field-without-dc-path`
- **learningGoal:** 금속 gate–SiO₂ oxide–p-type Si body의 절연과 전계 작용, 외부 충전 전류 vs 산화막 DC 전도 분리.
- **priorKnowledge:** 12-S01, 12-S03 (전압/RC), 11-S02 (p형).
- **storyHook:** “절연막으로 막아놓고 실리콘을 조절할 방법이 남아 있을까요?”
- **question:** 게이트의 전자를 산화막 너머로 직접 보내지 않아도 아래 실리콘의 전하 분포가 변할까요?
- **prediction:** Gate bias를 바꾸면 아래 전하 분포가 변할지/안 변할지; 전압 변경 순간 vs 정지 후 전류가 같은지 예상.
- **learnerAction:** gate·oxide·p-Si 3층 조립; gate relative to body VGB−0.5/0/+0.3V 토글, external gate capacitor charge path 화살표와 oxide through-DC conduction을 서로 다른 아이콘으로 표시.
- **modelInputs:** ideal insulating oxide, p-substrate, VGB∈{−0.5,0,+0.3}V, phase∈{switching,steady}, intentional gate leakage excluded.
- **displayTextBeforePrediction:** “산화막이 있다면 게이트 전압을 바꿀 때 어떤 일이 일어날까요?”
- **speechTextBeforePrediction:** “게이트와 실리콘 사이를 자세히 봐주세요. 전압을 바꾸면 아래쪽 전하는 어떻게 될지 먼저 골라볼까요?”
### ② 조작→관찰
- **expectedObservation:** 이상적 산화막은 DC 통과 전도≈0, 하지만 표면 전계 변화 및 외부 gate charging/displacement current는 존재 가능. steady & changing 구분.
- **correctIncorrectCriteria:** ‘전기장 작용’과 ‘DC 전하 터널링’ 다른 기구, 전압 전이 중 충전 전류 가능성을 모두 말하면 통과.
- **misconceptions:** [m1] 절연막이면 그 아래 전기장 효과도 0; [m2] 전압 바꿀 때도 외부 충전 전류는 항상 0; [m3] 실제 초박막 oxide 누설/파괴가 물리적으로 불가능.
- **hints:** L1 12의 커패시터 두 도체는 바로 전선으로 연결됐나요? / L2 전압을 바꾸는 순간 gate의 표면전하는? / L3 실제 절연막도 결함·터널링·열화가 가능해요.
- **feedback/incorrect keyed:** m1 “산화막을 통과하는 DC 전도와 전기장 영향은 달라요.” / m2 “전압이 변할 때 외부 게이트 배선에 충전 전류가 있을 수 있어요.” / m3 “실물 절연막엔 누설·터널링·절연파괴 위험도 있어요.”
- **feedback/correct:** “충전 순간의 전류와 절연막 속 정상상태 DC 전도를 따로 설명했어요.”
- **displayTextAfterObservation:** “절연막 너머에도 전기장 효과가 있어요.”
- **speechTextAfterObservation:** “게이트가 실리콘을 직접 연결하지 않아도 전기장이 표면 전하 분포를 바꿔요. 바뀌는 순간과 가만히 둘 때 전류는 다르죠.”
- **explanation:** MOS=Metal–Oxide–Semiconductor, ideal oxide a dielectric; static gate leakage≈0 in ideal model but displacement current exists for changing charge. Actual leakage and reliability omitted.
### ③ 현업 검증·다음 질문
- **physicsAssumptions:** ideal 1D oxide/p-type bulk, DC steady vs switching; zero bias flatband not assumed globally; gate tunneling/oxide breakdown excluded. `phase=steady` teaching snapshot not real transient simulation.
- **teachBack:** (초보) 전계 vs 전자 통과 / (중급) steady vs changing current / (시니어) oxide leakage, EOT and TDDB 검증 방법 1개.
- **sourceRefs:** [MOS-A][MOS-B][MOS-E]
- **nextHook:** “아래쪽이 p형 실리콘이라면, 게이트 전압을 올릴 때 어떤 캐리어가 몰려올까요?”
