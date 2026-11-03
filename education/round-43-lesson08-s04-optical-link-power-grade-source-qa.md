# A07 R43 · Lesson08-S04 광 링크 전력·직렬화 독립 교육 SOURCE QA
검토일: 2026-10-31 KST. **보고 대상 A06**. 이 문서는 소스/문구 계약의 정적 검토이며 앱 실행/실제 음성 청취/실기기 실험이 아닙니다.

## 고정 버전 및 범위
- A06 원고 PR #7 HEAD `8ff859a03df86f421c1884b01787fc42d92a45e5`; `education/lessons/08-ai-fabric-rdma-optics.md` blob **`83d5ac9319bf6a367447398936a2c8404f9a8990`**. S04 `fiber-transceiver-energy`만 이번 라운드 신규 심층 검수.
- A07 PR #14 검토 전 HEAD `547c79e50929d98a97dde8e34ae0423ff652152b`. 본 보고서 커밋 이후 새 HEAD는 별도 추적.
- A05 Lesson06 PR #56 HEAD `09870f4b4fcdc387151ec35d7afd82d81dd1f082`: CI #39042498701 SUCCESS, **Lesson06만 해당**. A02 PR #73 HEAD `9a11f0b9af4f2c6481c2a3f09a4e285b6da91bfb`: CI #39141327025 및 Chromium #39141327036 SUCCESS, **Lesson08-S04 검증 아님**. A06/A07 HEAD에 대응하는 PR workflow run은 조회 결과 없음. 이번 라운드 A07 Chromium/공식 앱 E2E/실제 한국어 TTS 청취/AT/실기기/학습자 테스트 **미실행**.
- 이전 Lesson08 S02 R40 P1 수치 채점 문제는 **별도 OPEN**, S04 새 결함으로 덮거나 종결하지 않음. R10의 S04 pre-Voice 정답 직접 노출 수정은 해당 원고 SHA에서 **RESOLVED_SOURCE 유지**.

## SOURCE FACT/MATH 검증 (범위 한정 PASS)
- 1GB(decimal)=10^9 B, 100Gb/s=10^11 bit/s, 8bit/B ⇒ 단일 링크 이상적 직렬화 하한 `(10^9 × 8)/(10^11)=0.08s`. 이것은 전파 지연, 프로토콜 오버헤드, 큐, 장치 처리를 제외한 **toy lower bound**이지 실측 파일 완료시간이 아님.
- 8개의 **서로 다른 양끝 모듈이 있는** 광 링크 × 링크당 2개 모듈 × 모듈당 toy 4W = **64W 모듈 합계**. 4링크면 32W, 8링크 ×6W면 96W. 스위치 ASIC, 팬, PSU, 호스트 NIC 및 냉각은 포함하지 않음. 한 파일을 여덟 링크로 자동 병렬 전송한다고 가정하지 않음.
- NVIDIA 공식 LinkX 제품 설명은 DAC와 광 트랜시버를 다른 연결 범주로 구분하고, 광 모듈이 송수신 전기/광 변환을 담당하며 링크 종류·거리·세대별 설계가 다름을 보여줌: https://www.nvidia.com/zh-tw/networking/ethernet/optical-transceivers/ ; https://www.nvidia.cn/networking/interconnect/ . 제조사 400G 광 모듈 공개 예시에서 8W typical(400G), 5W typical(200G)처럼 전력은 모드별로 달라짐: https://networking-docs.nvidia.com/mma4z00ns400t/overview . **이 제품 수치를 100G toy 4/6W의 검증값으로 전용하지 않음.**

## NEW P1 MAJOR · L08-R43-01 · NEXT:A06 (조작 계약/전력 범위)
재현: S04 `learnerAction`은 `copper/optical route select`, `transceiver power+switch heat toy 4 vs 6 W/end`, `transceiver count 4/8`을 요구하지만 `modelInputs`에는 `linkRate,payload,transceiverPower,links`만 있음. `medium`, 광 모듈 설치 여부, 별도 스위치 전력/발열 변수가 없어 구리 vs 광 선택을 상태/관찰로 재현할 수 없고 4/8이 링크 수인지 모듈 수인지 혼동 가능. **실제 구현에서 발견한 버그가 아니라 source contract 결함.**
- 수정 모델: `medium:'DAC'|'OPTICAL'`, `linkCount:4|8`, `modulesPerOpticalLink:2`, `modulePowerW:4|6` (toy), `moduleCount=medium==='OPTICAL'?2*linkCount:0`, `opticsPowerW=moduleCount*modulePowerW`; `switchPowerW`는 **모형 밖**으로 명시하거나 별도 근거·값을 가진 독립 입력으로만 추가. DAC 전력/총시스템 전력은 0이라고 판정하지 말고 **미모델링**으로 표기. 실제 DAC vs 광의 링크속도·도달거리·성능은 동일 보장하지 않음.
- 수용조건: 광8/4W→모듈16개/64W; 광4/4W→8개/32W; 광8/6W→16개/96W; DAC 선택→광 모듈 전력 항목 N/A, 전체 장치 전력 0W로 표시 금지. `switch heat`가 64W에 포함된다는 문구 금지.

## NEW P1 MAJOR · L08-R43-02 · NEXT:A06 (실제로 틀릴 수 있는 예측/채점)
재현: S04 `correctIncorrectCriteria`는 '트레이드오프 제시'만 명시. 학생의 사전 예상 직렬화 시간·광모듈 수·전력·'0.08초가 실제 완료시간인가' 판단을 저장/채점하지 않음. `teacherExpectedAnswer`는 gated지만 학습자가 숫자를 틀려도 이유 한 문장으로 통과할 수 있는 계약.
- 추가: `predictedSerializationSeconds`, `predictedOpticalModuleCount`, `predictedOpticsPowerW`, `predictedIsActualCompletionTime:boolean`, `submittedBeforeReveal`, `observationTriggered`, `observedCases[]` (caseId, inputs, expected, submitted, timestamp) immutable. `grade = submittedBeforeReveal && observationTriggered && serializationCorrect && moduleCountCorrect && powerCorrect && actualTimeClaimCorrect && whyCorrect`. 숫자 오차허용 `abs(t-0.08)<=0.001` toy, 전력 W/모듈 수 정수 정확 일치; 4/8 링크·4/6W 각각 재계산.
- 필수 음성/DOM/aria/tooltip/live-region 검증: **예측 전** `0.08`, `64W`, 모듈 16개, 정답 선택지 위치/힌트 정답 공개 금지. 학생 제출→실제 계산/토글 관찰 후에만 결과/WHY 노출. 틀린 값 먼저 제출해도 실제 오답, 첫 시도 정답은 불필요한 강제 오답 없이 통과.
- Negative: 광8링크×4W를 32W로 답하면 FAIL(양 끝 누락); 100Gb/s/1GB가 언제나 0.08초 완료라면 FAIL; 광 모듈 전력 0W라면 FAIL; `medium=DAC`인데 16개 광모듈이 있다고 표시하면 FAIL. Positive: 광8/4W 16개·64W, 직렬화 0.08s **하한**, 완료시간 보장 아님, 근거 설명→PASS.

## A06가 바로 붙일 수 있는 한국어 문구
- PRE 화면: **“링크가 여러 개라면 양쪽 끝에는 어떤 장치가 필요할까요? 모듈 수와 전력을 먼저 예상해 보세요.”**
- PRE 음성: **“먼저 연결 방식을 고르고, 링크 양쪽에 무엇이 달리는지 세어 보세요. 답은 계산해 본 뒤 확인할게요.”**
- WRONG 양끝 누락: **“한 링크는 양쪽 장치를 연결해요. 모듈이 한쪽에만 있는지 다시 확인해 보세요.”**
- WRONG 0.08 실제: **“지금 계산은 비트를 줄 세워 보내는 최소 시간이에요. 실제로는 대기와 추가 처리가 있을 수 있어요.”**
- WRONG 광 전력0: **“빛이 이동해도 빛을 만들고 받아들이는 전자장치는 전기를 써요.”**
- WRONG DAC 0W: **“광모듈을 쓰지 않는다는 뜻이지, 장치 전체 전력이 0이라는 뜻은 아니에요.”**
- AFTER 화면: **“이 가상 조건에서 8개 광 링크의 양끝 모듈은 16개예요. 모듈마다 4W라면 합계 64W이고, 1GB를 100Gb/s 링크 하나로 보내는 직렬화 하한은 0.08초예요.”**
- AFTER 음성: **“광섬유가 스스로 전기를 쓰는 건 아니지만, 양쪽 광 모듈은 전력을 써요. 실제 파일 전송은 계산한 최소 시간보다 더 걸릴 수 있어요.”**
- 접근성: 결과 영역 `aria-live`는 제출 전 `아직 관찰하지 않았어요`; 정답 값·오개념 피드백은 submit+observe 뒤에만. 키보드·320px·스크린리더 검증은 아직 미실행.

## HANDOFF SENT / 남은 TODO
- [x] A07 신규 S04 SOURCE 심층 정적검수, 공개 1차 자료 교차확인, toy 산식 독립 검산, 한국어 수정안/negative test 작성 (위 원고 blob만).
- [ ] **P1 NEXT:A06** canonical Lesson08 S04 model/grade/Voice/aria/피드백 수정 후 **새 blob SHA** 회신.
- [ ] **P1 NEXT:A07** 수정된 정확한 SHA에서 사전누설·오답/첫정답·DAC/광 상태·모듈 수/전력 재검수 후 EDU_QA_PASS_SOURCE 재결정.
- [ ] **P1 NEXT:A05** A07 재검수 후 별도 Lesson08-S04 scene HEAD, 정적 과학검수, 정확한 HEAD Chromium/CI, 음성/aria negative tests 제공.
- [ ] **P1 NEXT:A02** A05 실제 장면 인계 후 공식 앱 E2E 및 tested SHA 증빙.
- [ ] **Owner** 실기기/한국어 실제 음성 청취/스크린리더/초보 학습자 검증과 main 병합·배포 명시 승인. **RELEASE_HOLD**.
