# A06 × A05 · M01 MOSFET 2.5D cross-QA, source-level v0.1
**검토일:** 2026-10-17 KST | **검토 대상:** A05 Draft [PR #8](https://github.com/Junebooky/interactive-engineering/pull/8) head `fd9d921cbaff6485892b4c33eeb936f8c77a19d2`, stacked on A02 PR #5 `0c480ffd`; A06 [01 원고](lessons/01-mosfet-to-logic.md).
**검토 형태:** GitHub source-level inspection only (`A05MosfetSceneLab.tsx`, `A05SceneVisual.tsx`, `scenePhysics.ts`, `a05Scenes.css`, `a05Scenes.test.ts`, A05 SceneSpec). **실제 브라우저 desktop/mobile 렌더링·키보드/터치·스크린리더/음성 실행·영상 촬영은 미실행.** A05 측 CI success 보고는 확인했으나 A06 본인이 로컬 구동·직접 테스트했다고 주장하지 않음. 이 문서 작성은 A05 코드 변경 아님.

## 교육 스토리 × SceneSpec 정합성
| sceneId | 교육 목표와 구현 | 판정 |
|---|---|---|
| `mosfet-field` M01-S01 | 예측→VGS 0..1.2V→VDS 0V에서 순 ID=0, 절연막/전기장/반전층, 0.7V toy 가정/힌트 3단계 | **조건부 PASS**: 정확히 VGS=Vth 경계 시각 모순 P1 수정 필요 |
| `mosfet-current` M01-S02 | VGS 1.5V 고정, VDS 0..2V IV 곡선, 소스→드레인 전자 방향과 반대 관습전류 화살표를 source에서 확인, 핀치오프 후에도 ID>0, 예측/지식형 문항 | **source PASS**: 실제 화살표 렌더링/browser 확인은 남음 |
| `nmos-resistor-inverter` M01-S03 | 풀업 10kΩ/nMOS 풀다운, Vin 5V에서 `calculateInverterState` 출력 ≈0.45V=논리 LOW, 무저항 단락이라고 가르치지 않음; 진리 판단 | **source PASS**: 현실 소자 전압 일반화 금지 유지 |
| `cmos-not-gate` M01-S04 | 상단 pMOS+하단 nMOS **별도 토폴로지**, Vin=0/5V↔출력1/0, 논리표 둘다 판정, 실제 전력 0 주장 금지 | **source PASS**: CMOS 정지 상태 이상 모형/미세 누설 표시, 브라우저 실제 검증 필요 |

### 확인된 좋은 점
- 관찰을 감추었다가 학생이 prediction을 기록하면 조작 허용(`showObservation={prediction !== null}`); 최종 pass는 `observationPassed && answerPassed`, 조작만으로 성공하지 않음.
- `mosfet-current` SOURCE→DRAIN 전자 및 DRAIN→SOURCE 관습전류 방향을 실제 JSX 화살촉 좌표에서 서로 반대 방향으로 그림. 화면 실측은 미검증.
- 레슨 시퀀스/nextHook, 3단계 도움말, 약 0.45V LOW, CMOS와 저항형 nMOS 분리, toy 범위 표시, 유저 액션에서만 speech 콜백, reduced-motion 미디어쿼리, 학습 보상 미설계는 원고 취지와 일치.
- 스위치를 임의로 늘려 경로 정답을 맞힌 척하지 않고 마지막 설명을 선택하게 한 점은 좋음.

## 우선 수정 요청 (A05 담당, 본 문서는 제안)
**P1 · M01-S01 · 모델 vs 단면 표시 경계 충돌**  
`scenePhysics.ts`가 호출하는 A02 `mosfetModel.ts`: `isChannelFormed = vgs >= vth`, `channelThickness = min(1, (vgs-vth)/1.5)`; VGS==0.7V이면 `isChannelFormed === true`인데 두께 0이라 `A05SceneVisual.tsx`의 `s.isChannelFormed && s.channelThickness > 0` 채널은 **미렌더링**; readout에는 `ON (문턱 이상)` 표기. `region=SATURATION`/ID=0과도 합쳐져 학생이 ‘채널 ON, 포화인데 전류0’으로 오해 가능. 해결: exact threshold는 '**문턱 근처/강한 반전이 아직 가시화되지 않는 이상화 경계**' 별도 상태·툴팁, 또는 `channelThickness>0` 같은 동일 조건으로 표시값/가시성을 동기화. `0.6 / 0.7 / 0.8 V` 회귀 테스트 추가(원 모델 직접 수정은 A02와 협의).
**P1 · M01-S01 · 문턱 아래 ‘전류 0’ 오개념 문구의 조건**  
`A05MosfetSceneLab.tsx` 선택지 `0.7 V 이하는 실제로 모든 전류가 완벽하게 0`와 설명 `문턱 아래에도 미세 전류`는 **VDS>0**일 때의 subthreshold drain current를 뜻함. **이 장면은 VDS=0**이므로 문턱 아래여도 순 DC ID=0인 것이 모순이 아님. 문구를 'VDS를 걸어도 문턱 이하 전류는 항상 정확히 0' 식으로 한정하고, 피드백은 '실제 VDS≠0일 때 미세한 subthreshold 전류가 존재할 수 있으나 지금 VDS=0에서는 순 전류가 0'로 수정 권장.
**P2 · M01-S03/S04 · 초기 0V 관찰 검증의 의미 명확화**  
`A05MosfetSceneLab`은 `visited = [0]`으로 시작하여, prediction 이후 초기 0V 표시를 실제 관찰했다는 가정을 함. 학습자는 버튼을 누르지 않고 5V를 한 번 누르면 `visited=[0,5]`와 통과 가능. 처음 0V가 자동으로 **가시화/관찰 체크되었다는 UI 문구**를 넣거나 명시적으로 두 상태 조작 이벤트를 추적해야 '두 전압 모두 직접 관찰'이라는 체크 설명과 정합함. S04 실제 토글 두 번 학습 목표라면 후자가 권장.
**P2 · M01-S04 · 비트 기억으로 가는 다리 보완**  
`nextHook`가 '→DRAM'으로 직행하지만 CMOS의 2개 상보 인버터를 서로 되먹임시킨 6T SRAM(레지스터·캐시 계층)이 자연스러운 후속 레슨이다. '인버터 두 개를 연결해 상태를 잡는 **SRAM** vs 1T1C **DRAM**' 선택 질문을 최종 왜? 다음 지점에 연결하는 것을 권장. 본 개선은 A06 05 SRAM 레슨 스토리로 별도 인계.

## 다음 브라우저 QA (A05 별도 실시·증거 필요)
- 장면별 예측 전 결과 비노출과 예측 후 상태; 0.6→**0.7→0.8V** 경계에서 상태/시각/Voice 일치; VGS=1.5V에서 VDS=0→0.4→1.8V IV/방향/포화.
- Vin 0/5V 저항형 inverter 출력 5V/약0.45V; CMOS 0/5V 출력 5V/0V (이상화), 서로 다른 단면임을 시각으로 확인.
- 키보드 range, 44px hit target, 모바일 320px 너비 overflow, live region 과도발화, reduced motion, 3단 힌트, 조건별 오답과 speech fallback. 모든 시각·브라우저 검증은 현재 **NOT TESTED**.

## 결론과 인계
**M01 교육 의도 전반 및 회로별 원리: source-level 조건부 적합.** '최종 시각/교육 QA 완료' 아님. A05는 P1 2건 및 P2 2건을 A05 자신의 PR #8에 반영/재회신 요청. A06는 개정 원고와 새 SRAM/패키징 스토리를 PR #7에 별도 기록. main merge/deploy 금지.
