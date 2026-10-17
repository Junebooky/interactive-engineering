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

## 14-S02 · `mos-accumulation-depletion-inversion`
### ① 기초: 예측 먼저
- **sceneId:** `mos-accumulation-depletion-inversion`
- **learningGoal:** p형 Si bulk는 그대로여도 표면 정공/전자 비율이 gate potential에 의해 accumulation→depletion→inversion으로 달라지는 원리를 설명.
- **priorKnowledge:** 14-S01와 11 p형 다수 캐리어·고정 acceptor ion.
- **storyHook:** “p형 실리콘 표면에서 정공 대신 전자가 많아질 수도 있을까요?”
- **question:** 게이트 전압을 음→양으로 움직이면 실리콘의 겉부분에 남는 것들은 무엇일까요?
- **prediction:** VGB −0.5 /0 /+0.3 /+1.1 V 각 스냅샷에서 정공·고정 이온·전자 중 표면 주역 먼저 배치.
- **learnerAction:** gate bias 4단 조작, mobile holes/ electrons와 fixed acceptor separate symbols; 도핑카드 수/원소는 고정. VFB·VT marker와 state status는 **예측 전 숨김**.
- **modelInputs:** *이 한 장면 전용* toy Si p-type NA=1e16cm^-3, ni=1e10cm^-3, T300K, tox5nm, εSi=11.7ε0, εox=3.9ε0, **VFB=0V** workfunction/charge 가정, dynamically derived Vt≈0.7848V. Values bias∈{−0.5,0,+0.3,+1.1}V; discrete visual states, not carrier-density TCAD.
- **displayTextBeforePrediction:** “게이트 전압을 네 번 바꾼 뒤 표면을 살펴볼까요?”
- **speechTextBeforePrediction:** “p형이라는 이름은 그대로예요. 게이트 전압을 바꿀 때 겉부분의 전하가 어떻게 될지 먼저 예상해 보세요.”
### ② 관찰·오개념
- **expectedObservation:** VGB< VFB=0: 다수 hole accumulation; VGB=VFB=0 flatband(특별 모형); +0.3 depletion(정공 밀려남, 음의 고정 acceptor ion), +1.1 strong inversion(전자 수 증가). 실제 약한 inversion은 문턱 이전부터 연속적.
- **correctIncorrectCriteria:** 네 상태 순서·고정이온 부호/이동 캐리어 차이, "0V universal flat-band"가 잘못임을 말할 것. 선택과 조작 증거 모두 필요.
- **misconceptions:** [m1] p형 표면이 반전되면 acceptor 원자가 donor 원자로 바뀐다; [m2] 모든 MOS에서 VGB=0은 flatband, VT는 반드시0.7V다; [m3] depletion은 전자·정공·고정 이온이 모두 사라진 진공이다.
- **hints:** L1 도핑 원자를 바꾼 건가요, 캐리어가 이동한 건가요? / L2 flatband는 일함수/고정전하 영향도 받을까요? / L3 움직이는 정공이 밀려나면 acceptor ion은 남을까요?
- **feedback/incorrect keyed:** m1 “표면 캐리어 조성이 바뀐 거예요. 도핑 원자가 변한 건 아니에요.” / m2 “실제 VFB·VT는 구조/재료에 달라요. 여기 0V flatband는 특별히 택한 toy 가정이에요.” / m3 “공핍 근사는 이동정공이 감소한다는 뜻이지 공간이 텅 빈 게 아니에요.”
- **feedback/correct:** “도핑된 p형 bulk를 유지하면서 표면 상태만 바뀌는 것을 설명했어요.”
- **displayTextAfterObservation:** “p형은 그대로여도 표면 캐리어는 달라져요.”
- **speechTextAfterObservation:** “음의 게이트 전압에선 정공이 표면에 모이고, 양으로 올리면 정공이 밀려나요. 더 올리면 전자가 모여 반전이 나타나죠. 하지만 p형 원자가 바뀐 건 아니에요.”
- **explanation:** p형 기판 nMOS용 MOS cap은 negative relative VFB에서 accumulation, increasing positive gate depletion then inversion. `VFB≠0` in general. 1D Vt has flat-band + surface potential+depletion drop contributions. A02 M01 Vth=0.7 toy is **별도 독립 교육모형**, 충돌된 실제 제품 문턱 수치가 아님.
### ③ 엔지니어 경계
- **physicsAssumptions:** chosen special VFB0, T300K, abrupt p bulk, 1D depletion approximate. Calculated Vt0.784825V; not a true MOSFET technology threshold guarantee; weak inversion continuous, nonideal interface/charge, body bias ignored.
- **teachBack:** (초보) 음/양 gate 시 표면 이동정공/전자 예측 / (중급) 고정 acceptor charge와 flatband marker 구분 / (시니어) workfunction shift/oxide charge changes VFB and Vt.
- **sourceRefs:** [MOS-A][MOS-B]
- **nextHook:** “산화막을 더 두껍게 만들면 전계로 전하를 제어하기 쉬워질까요?”

## 14-S03 · `mos-oxide-capacitance-cv`
### ① 기초: 미리 계산하기
- **sceneId:** `mos-oxide-capacitance-cv`
- **learningGoal:** SiO₂ oxide thickness and dielectric change oxide capacitance per unit area, and measured MOS C–V depends on silicon depletion and AC frequency.
- **priorKnowledge:** 12-S03 Q=CV/RC, 14-S01/02 MOS electrostatics.
- **storyHook:** “절연막을 두껍게 만드는 순간 전하를 제어하는 힘이 어떻게 달라질까요?”
- **question:** 절연막 5nm를 10nm로 바꿀 때 같은 재료의 단위면적 capacitance가 절반·같음·두 배 중 무엇일까요?
- **prediction:** ratio 0.5 / 1 / 2 가운데 선택. 이론 숫자/정답은 예측 이전 **감춤**.
- **learnerAction:** tox 5↔10nm, εr=3.9 toy 고정. after-prediction C′ox readout; 심화 펼치기에서 accumulated/depleted/inverted schematic HF vs quasi-static LF C–V paths separately overlay, actual numeric frequency not asserted.
- **modelInputs:** ε0=8.8541878128e−12F/m, εox=3.9ε0, tox=5e−9/10e−9m, C′ox=εox/tox; depletion series `Cdep′=0.5*Cox′` purely illustrative, not measured; frequency labels high/low qualitative only.
- **displayTextBeforePrediction:** “두께가 두 배면 커패시턴스는 어떻게 될까요?”
- **speechTextBeforePrediction:** “두께만 바꿔보세요. 전하를 저장하는 능력이 얼마큼 달라질지 먼저 선택해 볼까요?”
### ② 수치·오개념
- **expectedObservation:** C′ox(5nm)=0.00690627F/m²≈0.690627µF/cm². C′ox(10nm)=0.00345313F/m²≈0.345313µF/cm². Depletion measured C′total≈(1/Cox′+1/Cdep′)⁻¹ < Cox′. HF inversion often approaches Cmin whereas LF inversion can respond toward Cox, measurement setup-dependent.
- **correctIncorrectCriteria:** ratio 0.5 correctly predicted with numerical units; `1/Ctotal′=1/Cox′+1/Cdep′` in depletion; HF/LF distinction not universal value.
- **misconceptions:** [m1] 두께 2배→Cox 두 배; [m2] 직렬 C는 Cox+Cdep 단순합; [m3] 모든 측정 주파수에서 inversion C가 정확히 같다.
- **hints:** L1 C=εA/t, t가 분모인지 확인하세요 / L2 12 직렬 capacitance는 역수 합이에요 / L3 소수 캐리어가 빠른 AC 변화를 따라갈 수 있나요?
- **feedback/incorrect keyed:** m1 “같은 유전체·면적이라면 두께와 C는 반비례해요.” / m2 “직렬이면 커패시턴스 역수가 더해져요.” / m3 “AC 주파수와 캐리어 응답·트랩에 따라 C–V 곡선이 달라질 수 있어요.”
- **feedback/correct:** “Cox의 단위를 계산하고, 실제 MOS C–V에 실리콘 상태가 더해지는 점을 구별했어요.”
- **displayTextAfterObservation:** “산화막 두께 2배 → 단위면적 커패시턴스 절반(이상 모형).”
- **speechTextAfterObservation:** “같은 재료라면 산화막이 두꺼워질수록 커패시턴스가 줄어요. 실제로는 실리콘의 공핍층과 측정 주파수도 함께 봐야 하죠.”
- **explanation:** C′ox=εox/tox. Gate voltage VGB is divided into flatband/surface potential/oxide drop. Only `ΔQ′=Cox′ΔVox` for oxide drop change, not for any arbitrary ΔVGB. In modern high-k stacks EOT/physical tox differ.
### ③ 시니어 실패 모드
- **physicsAssumptions:** parallel-plate constant ε, area fixed, 1D non-quantum oxide. HF/LF C–V only **qualitative schematic**, no measured frequencies; leakage/interface traps/slow minority-carrier generation omitted.
- **teachBack:** (초보) 두께와 C 반비례 / (중급) F/m² ↔ µF/cm² / (시니어) high-frequency inversion vs LF & interface traps and EOT.
- **sourceRefs:** [MOS-A][MOS-D][MOS-E]
- **nextHook:** “전하를 제어하는 커패시터에 소스와 드레인을 붙이면 비로소 어떤 길이 생길까요?”
