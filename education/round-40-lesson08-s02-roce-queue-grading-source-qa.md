# A07 R40 · Lesson08 S02 RoCE/IB 큐·드롭/학습 평가 독립 SOURCE QA
검수일: 2026-10-28 KST · 수신: A06 · HANDOFF SENT → A06 · 상태: **P1 MAJOR_OPEN / SOURCE SPEC ONLY**

## 검수 스냅샷 / 범위
- A06 원고 PR #7 HEAD `8ff859a03df86f421c1884b01787fc42d92a45e5`
- `education/lessons/08-ai-fabric-rdma-optics.md` blob `83d5ac9319bf6a367447398936a2c8404f9a8990` — **08-S02** 심층 독립 정적 검수.
- A07 PR #14 보고서 작성 직전 HEAD `35bf6a66ad1aa486025ea5a09cc73bf437dbcfd3`; A05 #56 `09870f4b4fcdc387151ec35d7afd82d81dd1f082`은 Lesson06, #78 `6ab410577c2bb18be06e2fc1a576b7b6dfcac77b`은 CONCEPT, A02 #73 `9a11f0b9af4f2c6481c2a3f09a4e285b6da91bfb`은 Lesson08 제품 E2E 증거 아님.
- 기존 A07 R11의 **08-S01 NIC/registration/permission/GPU eligibility** 및 **S02/S04 중립 Before/Voice**, **S03 ring 공식 사전노출** 수정은 이 blob에서 **RESOLVED_SOURCE 유지**. 그 범위를 재오픈하지 않음. 본 보고는 새 심층 검수로 찾은 **S02 큐 상태/실제 채점 계약 누락**만 다룸.

## 새 결함 · L08-R40-01 · P1 MAJOR · NEXT:A06
S02 원고의 `learnerAction`은 RoCE/IB 카드 배치와 4 arrivals/2 service toy만 요구하고, `modelInputs`는 `fabric`, `incomingPackets=2|4`, `service=2`, `queue max=8`뿐. 설명에는 `Qnext=min(Qmax,max(0,Q+arrivals−service))`, `drop=max(0,Q+arrivals−service−Qmax)`가 있으나 **초기 Q, slot index, 슬롯별 immutable queue/drop history, 학습자의 수치 예측 입력과 채점 tolerance, 두 독립 관찰의 조건**이 없다. `correctIncorrectCriteria`는 “프로토콜 이름과 RDMA 동작 구분”이라는 서술만 있어 **큐 예측이 틀린 학생을 실제 오답 처리할 근거가 없음**. **소스 명세 미비이지 앱 재현 실패가 아님.**

### 재현 가능한 수학/negative acceptance (명시적 toy 동시 arrival/service convention)
- `Q0=0, arrivals=4, service=2, capacity=8`: slot1 Q2/drop0, slot2 Q4/drop0, slot3 Q6/drop0, slot4 Q8/drop0, **slot5 Q8/drop2**. 학습자가 slot5 drop=0을 제출하면 WHY 정답이어도 FAIL.
- `Q0=0, arrivals=2, service=2`: slot1 Q0/drop0. 학생이 Q2라 답하면 FAIL.
- drain 검증을 위해 `arrivals=0` 선택 추가: `Q0=6, service=2` → Q4/drop0. 현재 2/4 선택지만으로는 큐가 감소하는 경우를 학생이 조작할 수 없음.
- 학생이 첫 시도에 정확한 Q/drop과 WHY를 내면 PASS; 오답 강제 체험 금지. `fabric=RoCEv2|IB`를 바꿔도 **동일한 toy arrival/service라면** 수학적 큐 값은 동일하며 실제 fabric PFC/ECN 효과를 자동으로 시뮬레이션한 것처럼 꾸미지 않음.

### 바로 반영할 source 계약
`initialQueuePackets:0..8`, `arrivalPacketsPerSlot:0|2|4`, `servicePacketsPerSlot:2`, `capacityPackets:8`, `slotIndex`, `queueAfterPackets`, `droppedThisSlotPackets`, `studentPredictedQueuePackets:number|null`, `studentPredictedDropPackets:number|null`, `submittedCaseSnapshot`, `observedCaseSnapshots[]`, `whyChoice`. 실험 시작 전 typed 숫자 제출/잠금; 매 슬롯 actionHistory 기록; 두 조건(혼잡/비혼잡 또는 overflow) 직접 실행; 채점 `predictedQCorrect && predictedDropCorrect && observedTwoCases && whyCorrect`. 숫자는 정수 패킷, 허용오차 0. 변경 후 새 exact blob SHA 필요.

### 바로 붙여 넣을 한국어 문구
- PRE display: **“들어오는 패킷과 나가는 패킷 수를 바꾸면 대기줄에 몇 개가 남을까요? 숫자로 먼저 예상해 보세요.”**
- PRE Voice: **“한 번에 몇 개가 들어오고 몇 개가 나가는지 정해 보세요. 다음 슬롯에 남을 패킷 수와 버려질 수를 먼저 적어 볼까요?”**
- WRONG overflow: **“대기줄은 최대 여덟 개까지만 담아요. 이미 찼을 때 들어오는 패킷과 나가는 패킷을 다시 세어 보세요.”**
- WRONG no-growth: **“들어오는 수와 나가는 수가 같다면 대기줄이 계속 늘어날까요? 지금 대기 중인 수부터 확인해 보세요.”**
- WRONG fabric: **“RoCE와 InfiniBand의 관리 방식은 달라도, 같은 입력과 처리량을 넣은 이 단순 모형의 계산은 같아요.”**
- AFTER display: **“이 모형에서는 슬롯마다 들어온 수에서 처리한 수를 빼고, 대기 공간이 넘치면 초과분을 따로 세요.”**
- AFTER Voice: **“네 개가 들어오고 두 개가 나가면 두 개씩 쌓여요. 여덟 개가 가득 찬 다음 슬롯에서는 두 개를 더 담지 못하죠. 실제 스위치는 혼잡 제어와 버퍼 정책에 따라 달라요.”**
- 교사 답과 수치, aria-live/status, 시각 SVG/tooltip, Voice는 학생의 예측 제출과 실제 조작 전까지 비공개. 요청형 힌트도 예측 제출 후.

## 과학·선수 지식 / 출처
- 위 큐 산식은 명시된 **discrete-time toy**, 실제 스위치 ingress/egress, PFC pause/ECN marking, 손실 동작과 동일시 금지. PFC=무조건 손실 0, RoCE=항상 무혼잡이라는 오개념 방지.
- NVIDIA Cumulus Linux 5.18 공식 문서(2026-10-28 조회): https://docs.nvidia.com/networking-ethernet-software/cumulus-linux/Layer-1-and-Switch-Ports/Quality-of-Service/RDMA-over-Converged-Ethernet-RoCE/ — RoCEv2 over UDP, ECN, PFC lossy/lossless 운영 옵션. 수치 toy는 벤더 실측 수치가 아님.
- 선수: 08-S01 RDMA vs CPU-copy, 패킷·큐·슬롯·처리량의 단위(“패킷/슬롯”), S02 이후 S03 ring의 실제 링크 병목. “큐는 버퍼에 쌓인 패킷” 1문장 먼저 설명.

## 증거/책임/해제
- [x] A07 08-S02 원고 SOURCE 읽기·정수 산식 5-slot 검산·공식 네트워크 문서 교차검증·중립 Before/Voice 원문 확인.
- [ ] **P1 NEXT:A06** source 계약/한국어 문구/채점·negative cases 추가, 수정 story **blob SHA** 회신.
- [ ] **P1 NEXT:A07** 정확히 새 blob에서 5-slot overflow, equal input, drain, wrong numeric/first-correct, pre DOM/Voice/aria 정책 재검증 후 S02 새 source EDU_QA 결정.
- [ ] **P1 NEXT:A05** A06 수정 + A07 승인 source 기반 2.5D scene, 실제 HEAD Chromium/CI + wrong/valid paths·aria·Voice·모바일 증거. 현 단계 **08-S02 A05 scene SHA/test 없음**.
- [ ] **P1 NEXT:A02** 공식 앱 통합 HEAD에 대한 실제 학생 조작 E2E, grade/history/persistence/Voice/ARIA, CI 및 screenshots. 현재 PR#73 기존 CI #39141327025/Chrome #39141327036 SUCCESS는 **다른 범위**.
- [ ] **Owner** 실제 한국어 TTS 청취, 화면읽기, iPhone Safari, 실제 학습자/기기 및 main 병합·배포 RELEASE_HOLD.
- **A07 실행한 Chromium [ ] / A02 앱 E2E [ ] / 실제 기기·학습자 [ ]**. 외부 성공 로그를 본인 실행 PASS로 쓰지 않음.
