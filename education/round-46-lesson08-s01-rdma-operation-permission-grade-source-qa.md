# A07 R46 — Lesson08 S01 RDMA READ/WRITE 권한·방향·실제 평가 독립 SOURCE QA

- 검수: 2026-11-03 KST / **HANDOFF SENT → A06** / 우선순위 **P1 MAJOR_OPEN ×2**
- A06 원고 PR #7 HEAD `8ff859a03df86f421c1884b01787fc42d92a45e5`; 원본 `education/lessons/08-ai-fabric-rdma-optics.md` blob `83d5ac9319bf6a367447398936a2c8404f9a8990`.
- A07 검수 보고 PR #14 **검수 시작 HEAD** `6776c1ffc5b5ff5bead1815908c14d627eb66ac4` (이 보고서 추가 후 HEAD는 별도 GitHub 확인).
- A05 #56 HEAD `09870f4b4fcdc387151ec35d7afd82d81dd1f082` (Lesson06 범위); A02 #73 HEAD `9a11f0b9af4f2c6481c2a3f09a4e285b6da91bfb` (V3 앱/카탈로그 범위).
- **범위 구분:** [x] A06 08-S01 원고·공식 출처 독립 정적검토; [x] A05 #56 Git tree 정적 목록에서 Lesson08 RDMA scene 없음 확인; [ ] A05 Lesson08-S01 실제 장면 코드 검수(장면 없음); [ ] A07 직접 Chromium/Voice/aria 실행; [ ] A02 Lesson08-S01 공식 앱 E2E; [ ] 실제 모바일/Safari/한국어 음성 청취/스크린리더/초보 학습자/하드웨어 실험. 타 팀 CI는 이 장면의 PASS가 아님.

## 과학/선수지식 SOURCE 판정

- **FACT_PASS_SOURCE(범위 한정):** RDMA는 NIC/메모리 등록·접근권한·QP 설정과 데이터 이동이 필요하며, CPU의 *데이터 복사 개입*을 줄일 수 있지만 CPU의 초기 설정·완료 처리 및 네트워크 전송 자체가 없어지는 것은 아니다. GPU peer 직접 접근은 NIC/GPU/드라이버/PCIe 경로 지원에 좌우된다. 기존 R10의 'NIC/등록/권한/GPU 경로 전제조건 누락'은 현 원고에서 **RESOLVED_SOURCE** 상태 유지. 새로운 이슈는 이전 이슈 재개가 아님.
- **선수 개념 P2 보완:** CPU 프로세스, 호스트 RAM, GPU 메모리, NIC, 네트워크, 등록된 메모리 영역(MR), 접근 권한, 데이터 복사와 패킷 이동의 차이를 20초 그림/툴팁으로 먼저 구분. **권한 자체의 정답은 예측 전 공개하지 말 것.**
- NVIDIA 공식 RDMA Verbs 문서에서 `ibv_reg_mr`의 `IBV_ACCESS_REMOTE_READ` / `IBV_ACCESS_REMOTE_WRITE`는 서로 다른 MR 권한이며 QP도 허용해야 한다. `IBV_ACCESS_REMOTE_WRITE`를 허용하면 `IBV_ACCESS_LOCAL_WRITE`도 필요. NVIDIA GPUDirect RDMA 공식 문서는 PCIe topology/IOMMU/드라이버 제한을 별도 설명한다. 따라서 `remotePermissionValid:boolean` 하나는 READ와 WRITE를 구별하는 실험에 불충분하다.
- 공식 근거: https://networking-docs.nvidia.com/doca/archive/3-5-0/rdma-aware-networks-programming-guide ; https://manpages.debian.org/trixie/libibverbs-dev/ibv_reg_mr.3.en.html ; https://docs.nvidia.com/cuda/archive/13.0.0/gpudirect-rdma/index.html . 벤더/소프트웨어 명세에 따른 조건부 판정이며 실측 성능 보증 아님.

## NEW P1 L08-R46-01 — READ/WRITE 방향·접근권한 모델 결손 · NEXT:A06

**재현(원고 SOURCE):** S01 `learnerAction`은 hostCopy/rdmaHost/rdmaGpuDirect만 고르고 `modelInputs`는 `remotePermissionValid=true|false` 한 비트. 따라서 '원격 읽기는 허용, 쓰기는 거부'인 MR에서 RDMA_READ는 가능하지만 RDMA_WRITE는 거부되는 반례를 설정할 수 없다. `supportedHostRDMA=AND(first five flags)`가 READ/WRITE를 모두 동일 판정할 위험. 이는 **원고/장면 계약의 표현력 결함**, 실제 앱 실행 버그로 단정하지 않는다.

**수정 계약(단방향 toy, RDMA SEND/RECV와 구분):**
```ts
operation: 'RDMA_WRITE'|'RDMA_READ';
initiator: 'A'; target: 'B';
targetMrRemoteRead: boolean; targetMrRemoteWrite: boolean;
targetMrLocalWrite: boolean;
qpAllowsRemoteRead: boolean; qpAllowsRemoteWrite: boolean;
rkeyValid: boolean; addressWithinMr: boolean;
// existing nicRdmaSupported, memoryRegistered, queueConfigured,
// accessAddressValid, gpuDirectSupported retained and scoped.
```
- `RDMA_WRITE`: A가 **A 메모리의 데이터를 B 메모리로 씀**. B target MR의 remote-write 권한, 필요한 local-write, QP write 허용, 유효한 rkey·범위 모두 충족할 때만 성공.
- `RDMA_READ`: A가 **B 메모리의 데이터를 A 메모리로 읽음**. B target MR remote-read, QP read, rkey·범위 필요; write 권한이 없다는 이유만으로 실패시키지 않음.
- 이 장면의 `NO_PERMISSION` 대신 `REMOTE_READ_DENIED` / `REMOTE_WRITE_DENIED` / `INVALID_RKEY` / `OUT_OF_MR_RANGE` / `QP_OPERATION_DENIED`로 구분. 실제 RDMA stack에서 모든 실패를 이 문자열로 반환한다는 주장이 아니라 **교육용 이유 코드**.

**필수 반례:** (1) read=true,write=false, QP 양쪽 허용 ⇒ READ 허용, WRITE 거부. (2) read=false,write=true, localWrite=true ⇒ WRITE 허용, READ 거부. (3) WRITE remoteWrite=true, localWrite=false ⇒ 잘못된 MR 권한 조합/등록 실패. (4) 유효 권한이어도 rkey 틀리거나 MR 범위 밖 ⇒ 거부. (5) GPU direct 미지원이면 GPU peer만 거부, 지원되는 host RAM 경로는 별도 판정. `hostCopy`는 RDMA remote-MR 권한이 없다고 무조건 실패시키지 않음.

## NEW P1 L08-R46-02 — 실제 틀릴 수 있는 사전 예측·평가 증거 누락 · NEXT:A06

**재현(원고 SOURCE):** `correctIncorrectCriteria`는 '허용 RDMA 시도, 등록/권한 거부 시연, GPU 미지원 시연'이라는 조작 목록만 제시. 학생이 전송 방향·허용/거부 결과를 **먼저 제출한 기록**, 각 조건을 실제로 관찰한 불변 증거, 잘못된 예측의 채점 규칙이 없다. 구현자가 토글 방문 + 정답 WHY 선택만으로 PASS시킬 여지가 남는다.

**수정 계약:** `phase='PREDICT'|'ACT'|'OBSERVE'|'EXPLAIN'`, `studentPredictedDirection`, `studentPredictedAllowed`, `studentPredictedReason`, `submittedBeforeReveal`, `observedCases:[{operation,flags,prediction,observedResult,reasonCode,caseId}]`를 immutable snapshot으로 저장. 최소 **READ allowed / WRITE denied / GPU direct denied (host fallback possible)** 3개 독립 사례를 요구하고 WHY 정답을 함께 검사. `grade=preSubmitted && casesComplete && eachPredictionCorrect && directionCorrect && whyCorrect`; 틀린 첫 시도는 FAIL+원인별 힌트, **첫 시도부터 전부 맞으면 PASS**. 한 사례의 성공 방문 기록을 다른 사례에 재사용 불가.

**NEGATIVE 필수:** (a) READ 허용 상태에서 WRITE도 허용이라 예측 ⇒ FAIL; (b) RDMA_WRITE를 B→A라고 표기 ⇒ FAIL; (c) GPU direct=false인데 GPU peer 성공 예측 ⇒ FAIL; (d) `memoryRegistered=false`인데 host RDMA 성공 예측 ⇒ FAIL; (e) 유효한 첫 예측+관찰+WHY ⇒ PASS. 실물 CPU-copy count=2/0은 교육용 가정이며 실제 측정값이 아님.

## 바로 적용할 한국어 Display / Voice / aria / 원인별 피드백

- **PRE 화면·음성·aria (정답 누설 금지):** “서버 A와 B가 메모리를 주고받으려 합니다. 누가 데이터를 보내고 받는지, 어떤 준비가 있어야 전송되는지 먼저 예상해 보세요.”
- **PRE 질문:** “A가 B의 메모리를 읽을 때와 B에 쓸 때, 허용 결과가 항상 같을까요? 먼저 방향과 성공 여부를 선택하세요.”
- **AFTER 설명(관찰·제출 뒤):** “원격 메모리를 읽는 권한과 쓰는 권한은 따로 정해요. A가 B에 쓰면 데이터는 A에서 B로, A가 B에서 읽으면 B에서 A로 움직여요. NIC가 데이터를 옮겨도 CPU의 설정과 네트워크 전송은 남아요.”
- **WRONG 권한:** “읽기와 쓰기 허용은 따로 정해져요. 이번 동작이 어느 쪽인지 확인해 보세요.”
- **WRONG 방향:** “읽기를 요청한 쪽은 A예요. 실제 데이터는 어느 메모리에서 출발할까요?”
- **WRONG 미등록:** “NIC가 접근할 메모리를 먼저 준비하고 등록해야 해요. 등록 상태를 확인해 보세요.”
- **WRONG GPU:** “호스트 RAM으로 가는 길과 GPU 메모리로 직접 가는 길은 달라요. 장치 지원을 다시 확인해 보세요.”
- **기존 m1/m2/m3 교정 유지:** CPU setup은 남음 / 패킷은 링크를 지나감 / GPU memory≠host RAM. 위 원인 코드는 기존 오개념별 교육 피드백을 보강.
- **예측 전 DOM, 숨긴 정답 요소, aria-label/description/live, Voice 대기열, 툴팁, 카드 순서/색상/초기 애니메이션 모두 점검:** `REMOTE_READ_DENIED`, 올바른 read/write 권한 조합, 정답 선택지 강조, after 교사 문구가 PRE에서 노출되면 FAIL. 중립적 “읽기/쓰기 선택” 라벨은 허용. 이후 접근성 검사는 별도 실제 실행 필요.

## 증거 단계·해제 조건

1. [x] **SOURCE** A06 PR#7 원고 blob 위 SHA 및 공식 RDMA 자료 정적 검수; 기존 R10 수정은 **RESOLVED_SOURCE**, 신규 R46-01/02 **OPEN P1**.
2. [x] **A05 code static scope** #56 HEAD Git tree(전체, truncated=false)에 `08-S01`/RDMA 전용 장면 파일 없음. 따라서 S01 scene 코드 검수 **[ ] NOT APPLICABLE YET**. #56 CI `39042498701` SUCCESS는 Lesson06.
3. [x] **third-party CI metadata only** A02 #73 HEAD CI `39141327025` SUCCESS + Chromium `39141327036` SUCCESS는 V3 UI 다른 범위; A06 PR#7 / A07 PR#14 검사 시각 HEAD에 해당하는 workflow run 반환 없음. 이 결과로 Lesson08-S01 PASS 주장 불가.
4. [ ] **NEXT:A06 P1** 위 모델/평가/중립 PRE+gated AFTER/오개념 피드백 수정, 새 **lesson blob SHA** 회신.
5. [ ] **NEXT:A07 P1** 새 blob에서 READ/WRITE 반례·first-correct/negative·선수 개념·pre DOM/Voice/aria 계약 재검수 후 **EDU_QA_PASS_SOURCE 여부 결정**.
6. [ ] **NEXT:A05 P1** 새 Lesson08-S01 실제 장면 구현, 고유 scene HEAD 및 그 SHA에 대응하는 Chromium/CI/aria/Voice 텍스트·320px·키보드 반례 결과 제출.
7. [ ] **NEXT:A02 P1** 공식 LessonPlayer에 통합한 실제 앱 SHA와 예측/관찰/채점/음성/복원 E2E 증거 제출.
8. [ ] **Owner** 실제 Safari·한국어 음성 청취·스크린리더·초보 학습자·하드웨어 및 main 병합/배포 승인. **RELEASE_HOLD**, 오너 명시 승인 없는 main 병합·배포 금지.

**HANDOFF SENT → A06 Issue #6, A06 PR #7, A07 PR #14, 공통 #21, 개별 #33 (댓글/카드 갱신을 별도로 확인할 것).**
