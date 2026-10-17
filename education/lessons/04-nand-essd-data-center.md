# 04 · NAND·eSSD에서 AI 데이터센터까지: 데이터의 여행
> 상태: A06_SOURCE_FIXED_AFTER_A07_R3 / A07_RECHECK_PENDING / A05 새 장면 제작 최종승인 전, A02 앱 미통합 | 2026-10-17
> 선수지식: 02 DRAM 휘발성·03 GPU 메모리/대역폭 | 학습목표: NAND의 저장 방식/페이지·블록 제약 → SSD FTL/eSSD 신뢰성 → NVMe/PCIe → AI 요청과 데이터 흐름.
> 상황 제시→호기심→**정답 비노출 상태에서 먼저 예측**→조작→관찰→원리 발견→응용→다음 질문.

## Step 1 · N04-S01 / sceneId: nand-threshold
- **learningGoal:** NAND 플래시 비휘발성의 물리적 근거 알기
- **priorKnowledge:** MOS 문턱전압, DRAM의 휘발성
- **storyHook:** 컴퓨터를 꺼도 사진은 남죠. DRAM은 안 그런데 왜일까요?
- **question:** 전원을 빼도 유지되는 상태는 어떻게 만들까요?
- **predictionPrompt (learner-visible):** 전원을 껐다 켠 다음에도 구별할 수 있는 기억 상태가 있는지, DRAM과 NAND 중 어디서 관찰할지 예상해 보세요.
- **learnerAction:** 저장 전하에 따른 임계전압 2상태를 가상 읽기 전압으로 구별, 전원 OFF/ON 비교
- **modelInputs:** thresholdState low/high toy; readVoltage reference; power on/off
- **expectedObservation (teacher-only):** 플래시 저장 전하가 임계전압에 영향을 주며 다시 전원 켠 뒤에도 구별 가능, DRAM은 전하 누설·휘발
- **teacherExpectedAnswer (gated):** 플래시 저장 전하가 임계전압에 영향을 주며 다시 전원 켠 뒤에도 구별 가능, DRAM은 전하 누설·휘발
- **correctIncorrectCriteria:** 두 메모리의 보존 방식과 '읽으려면 전원 필요'를 구분하면 성공
- **misconceptions (3 expected mistakes):** ① NAND는 전기 없이 데이터를 읽을 수 있다 ② NAND는 DRAM처럼 수십 ms마다 refresh 필요 ③ 모든 NAND 셀은 반드시 1bit만 표현한다
- **hints (level 1/2/3):** ① 비휘발과 무전원 읽기는 같은 말일까요? ② 켜지는 문턱을 구별하면 상태를 읽을 수 있나요? ③ TLC/QLC라는 다중 상태 방식도 있을까요?
- **feedback/correct:** “보셨죠? NAND는 부유 게이트 또는 전하 트랩 등에 저장 전하를 남겨 문턱전압 상태로 정보를 구별해요.”
- **feedback/incorrect (dispatcher only):** 실제로 선택한 잘못된 개념 ID m1/m2/m3의 분기만 관찰 뒤 열기. 일괄 generic 오답 피드백을 완료 판정에 사용하지 않음.
- **feedback/hint:** L1/L2/L3는 학습자 요청 시에만 단계 공개; 강사 정답은 prediction·직접 조작 이전의 화면/Voice/aria에 숨김.
- **explanation:** NAND는 부유 게이트 또는 전하 트랩 등에 저장 전하를 남겨 문턱전압 상태로 정보를 구별해요.
- **nextHook:** 같은 칸의 글자를 수정하려면 왜 복잡해질까요?
- **displayTextBeforePrediction:** 전원을 껐다 켰을 때 기억은 어디에 남을까요?
- **displayTextAfterObservation (gated):** NAND는 저장 전하 상태를 남겨 비휘발성으로 만들 수 있어요.
- **speechTextBeforePrediction:** 다른 두 메모리의 전원 꺼진 뒤 상태를 먼저 선택해 보세요.
- **speechTextAfterObservation (gated):** NAND는 전원 없이 읽히는 장치는 아니지만 저장 전하에 따른 문턱전압 상태가 전원 복구 뒤에도 구별될 수 있죠.
- **physicsAssumptions:** 저장 전하 장기 안정성·리텐션 열화/읽기 교란을 생략한 두 상태 toy 모델
- **sourceRefs:** [S6] NAND 기초
- **A05:** scene 연동 입력·출력, 예측 전 정답 숨김, 상태/단위 표시, 3개 오답별 원인 피드백, 키보드/모바일/모션 축소 대응.

- **misconceptionFeedback/m1 (gated):** “비휘발성이란 **전원 없이 정보를 유지**한다는 뜻이지, 전원을 끈 채 읽기 동작을 할 수 있다는 뜻은 아니에요.”
- **misconceptionFeedback/m2 (gated):** “NAND는 DRAM과 달리 보통 수십 밀리초마다 주기적 refresh를 요구하지 않아요. 그렇지만 보존시간과 읽기 교란 같은 제약은 있어요.”
- **misconceptionFeedback/m3 (gated):** “TLC·QLC는 셀당 여러 비트를 위해 구분할 문턱전압 상태를 더 많이 사용해요. 모든 NAND가 SLC인 것은 아니죠.”
- **validation branch mapping:** selectedMisconception ∈ {m1,m2,m3}; actual wrong answer triggers matching cause-only feedback; correct predicted learner can pass without ever choosing wrong answer after two independent manipulations and WHY.
## Step 2 · N04-S02 / sceneId: nand-page-block
- **learningGoal:** 페이지 프로그램과 블록 지우기 비대칭 인식
- **priorKnowledge:** N04-S01
- **storyHook:** 한 줄 수정하려는데 책 한 장을 지워야 한다면?
- **question:** 같은 주소의 파일을 곧바로 덮어쓸 수 있을까요?
- **predictionPrompt (learner-visible):** 같은 파일 주소를 수정할 때 NAND에 어떤 물리 페이지 조작이 필요할지 스스로 배치해 보세요.
- **learnerAction:** 2블록×4페이지 toy 배열에서 쓰기→같은 LBA 수정→새 페이지 이동→구 블록 GC
- **modelInputs:** pagesPerBlock=4 toy, blocks=2 toy, write LBA/value, blockErase
- **expectedObservation (teacher-only):** NAND는 페이지 쓰기와 블록 단위 지우기 제약, 기존 데이터 무효화 후 새 곳에 기록
- **teacherExpectedAnswer (gated):** NAND는 페이지 쓰기와 블록 단위 지우기 제약, 기존 데이터 무효화 후 새 곳에 기록
- **correctIncorrectCriteria:** 새 페이지 매핑/GC의 필요성 이해하면 성공
- **misconceptions (3 expected mistakes):** ① 페이지를 무제한 즉시 덮어쓸 수 있다 ② GC는 사용자 파일을 임의로 삭제한다 ③ 페이지와 블록 크기가 같다
- **hints (level 1/2/3):** ① 덮어쓰기가 물리적으로 어렵다면 어디에 쓰면 될까요? ② 옛 페이지는 표시만 무효가 될 수 있어요. ③ 살아 있는 데이터는 어떻게 옮긴 다음 지울까요?
- **feedback/correct:** “보셨죠? NAND는 보통 페이지 단위로 프로그램하고 지우기는 더 큰 블록 단위로 해요. 그래서 데이터를 이사시키는 관리가 필요하죠.”
- **feedback/incorrect (dispatcher only):** 실제로 선택한 잘못된 개념 ID m1/m2/m3의 분기만 관찰 뒤 열기. 일괄 generic 오답 피드백을 완료 판정에 사용하지 않음.
- **feedback/hint:** L1/L2/L3는 학습자 요청 시에만 단계 공개; 강사 정답은 prediction·직접 조작 이전의 화면/Voice/aria에 숨김.
- **explanation:** NAND는 보통 페이지 단위로 프로그램하고 지우기는 더 큰 블록 단위로 해요. 그래서 데이터를 이사시키는 관리가 필요하죠.
- **nextHook:** 이 복잡한 정리를 누가 대신해줄까요?
- **displayTextBeforePrediction:** 같은 주소를 바꿀 때 어떤 페이지가 달라질까요?
- **displayTextAfterObservation (gated):** NAND는 새 페이지에 기록하고 기존 위치를 정리하기도 해요.
- **speechTextBeforePrediction:** 이 작은 NAND에서 파일 한 줄을 수정해 보세요. 어느 칸을 사용할지 골라볼까요?
- **speechTextAfterObservation (gated):** 같은 논리주소를 고쳐도 물리 페이지엔 새로운 위치를 쓰고, 유효 페이지를 옮긴 뒤 블록을 지우는 과정이 필요할 수 있어요.
- **physicsAssumptions:** toy block 4 pages; 실제 NAND의 block/page 크기·program order·erase 제약은 세대/제품별 상이
- **sourceRefs:** [S6][S7] NAND 관리
- **A05:** scene 연동 입력·출력, 예측 전 정답 숨김, 상태/단위 표시, 3개 오답별 원인 피드백, 키보드/모바일/모션 축소 대응.

- **misconceptionFeedback/m1 (gated):** “일반 NAND에선 이미 프로그램된 페이지를 SSD처럼 자유롭게 제자리 덮어쓰기 할 수 없어요. FTL이 새 물리 페이지에 기록하죠.”
- **misconceptionFeedback/m2 (gated):** “GC는 무효 페이지를 정리하되 유효 페이지를 보존·이동하는 내부 관리 작업이에요. 사용자 파일을 임의로 지우는 것이 목적은 아니에요.”
- **misconceptionFeedback/m3 (gated):** “페이지는 프로그램 단위, 블록은 더 큰 지우기 단위예요. 이 모형의 한 블록에는 네 페이지가 들어 있어요.”
- **validation branch mapping:** selectedMisconception ∈ {m1,m2,m3}; actual wrong answer triggers matching cause-only feedback; correct predicted learner can pass without ever choosing wrong answer after two independent manipulations and WHY.
## Step 3 · N04-S03 / sceneId: ssd-ftl-reliability
- **learningGoal:** SSD controller/FTL/eSSD 안정성 이해
- **priorKnowledge:** N04-S02, 논리주소/물리주소
- **storyHook:** SSD 안에 데이터 이사 담당이 있다면요?
- **question:** 서버용 eSSD는 단순히 큰 SSD일까요?
- **predictionPrompt (learner-visible):** 논리주소와 물리 페이지의 대응을 먼저 예상하고, SSD에 어떤 부품·보호 기능이 실제로 있을지 후보별로 선택해 보세요.
- **learnerAction:** LBA→물리 page 연결; hot/cold writes·wear leveling, ECC 유무 toy, PLP 설계 카드 비교
- **modelInputs:** writePattern hot/cold, wear counters, ECC on/off toy, PLP optional
- **expectedObservation (teacher-only):** 호스트 주소가 같아도 물리 페이지 이동; 컨트롤러가 수명·오류·QoS 관리; 일부 eSSD에는 전원 보호 설계
- **teacherExpectedAnswer (gated):** 호스트 주소가 같아도 물리 페이지 이동; 컨트롤러가 수명·오류·QoS 관리; 일부 eSSD에는 전원 보호 설계
- **correctIncorrectCriteria:** 논리/물리 위치 차이와 eSSD의 평가 기준을 설명하면 성공
- **misconceptions (3 expected mistakes):** ① 모든 eSSD는 반드시 PLP가 있다 ② 모든 SSD는 DRAM 캐시를 내장한다 ③ ECC면 오류 확률 0
- **hints (level 1/2/3):** ① PLP는 실제 제품 사양을 확인해야 해요. eSSD라는 이름만으로 유무를 알 수 있을까요? ② DRAM 캐시 없이 동작하는 SSD도 있어요. 호스트 메모리 버퍼 등 설계 차이를 찾아봐요. ③ ECC는 오류 가능성을 줄이지만 정정 한계가 있어요. 한계를 넘는 비트 오류는 어떡할까요?
- **feedback/correct:** “보셨죠? SSD 컨트롤러가 FTL·마모 평준화·GC·ECC를 조정해요. eSSD는 용량만이 아니라 안정적 지연·내구성·전원 장애 대비 같은 목표를 함께 봅니다.”
- **feedback/incorrect (generic):** “어떤 기능이 이 제품에 실제로 있는지 다시 확인해 볼까요?”
- **misconceptionFeedback/ssd-plp-universal:** “eSSD도 제품마다 달라요. 정전 보호(PLP)는 개별 제품 데이터시트에서 지원 여부와 보호 범위를 확인해야 해요.”
- **misconceptionFeedback/ssd-dram-universal:** “SSD의 주소 관리에 모든 모델이 전용 DRAM을 요구하지는 않아요. DRAMless 설계·호스트 메모리 활용도 가능해요.”
- **misconceptionFeedback/ecc-perfect:** “ECC가 오류를 줄여도 복구 불가능한 오류는 남을 수 있어요. 무엇을 어느 수준까지 정정하는지 확인해야 하죠.”
- **validation branch mapping:** `selectedMisconception` ∈ `ssd-plp-universal | ssd-dram-universal | ecc-perfect`, 각 오답 선택에 해당하는 message만 노출; LBA/FTL 질문은 별도 `ftl-address` 선택지에서만 노출.
- **feedback/hint:** “바로 답을 보여드리기보다 DRAM 없는 SSD도 존재할까요?”
- **explanation:** SSD 컨트롤러가 FTL·마모 평준화·GC·ECC를 조정해요. eSSD는 용량만이 아니라 안정적 지연·내구성·전원 장애 대비 같은 목표를 함께 봅니다.
- **nextHook:** SSD에서 GPU까지 데이터는 어떤 길로 갈까요?
- **displayTextBeforePrediction:** SSD 안에서는 데이터를 어디에 두고 있을까요?
- **displayTextAfterObservation (gated):** FTL과 ECC·PLP·DRAM 여부는 제품마다 달라요.
- **speechTextBeforePrediction:** 같은 호스트 주소로 쓰기를 반복해 보고, 어떤 기능이 개별 제품에 필요한지 선택해 보세요.
- **speechTextAfterObservation (gated):** SSD는 논리주소를 물리 위치에 매핑해요. 전원 보호와 전용 DRAM은 모델마다 다르고, ECC도 정정 가능한 한계가 있어요.
- **physicsAssumptions:** 제품별 PLP/DRAM/내구성/성능 상이; toy 수명지표는 실측 DWPD 아님
- **sourceRefs:** [S7][S8][S20]
- **A05:** scene 연동 입력·출력, 예측 전 정답 숨김, 상태/단위 표시, 3개 오답별 원인 피드백, 키보드/모바일/모션 축소 대응.


- **validation branch mapping:** 기존 S03 `ssd-plp-universal` / `ssd-dram-universal` / `ecc-perfect` 세 고유 피드백 유지; `feedback/incorrect (generic)`는 학생 응답에 노출되는 dispatcher가 아니라 fallback guard로만 사용.
## Step 4 · N04-S04 / sceneId: nvme-transfer
- **learningGoal:** NVMe·PCIe·SSD·NAND 계층 구별
- **priorKnowledge:** N04-S03
- **storyHook:** SSD에 저장된 숫자는 GPU로 어떻게 갈까요?
- **question:** PCIe와 NVMe는 같은 말일까요?
- **predictionPrompt (learner-visible):** NVMe 명령, PCIe 연결, SSD 컨트롤러와 NAND를 섞은 카드에서 요청 화살표와 읽기 데이터 화살표를 구분해 배치해 보세요.
- **learnerAction:** **명령과 데이터 화살표 분리**: (1) NVMe READ command: 호스트 소프트웨어/큐→PCIe→SSD 컨트롤러→NAND 읽기 준비; (2) read payload: NAND→SSD 컨트롤러→PCIe DMA→host DDR; (3) 필요시 host DDR→GPU 메모리로 PCIe/플랫폼별 전송. 다른 DMA/직접 경로는 옵션으로 분기
- **modelInputs:** request read, transport PCIe, device SSD, media NAND, path standard-host-staging toy
- **expectedObservation (teacher-only):** 호스트→PCIe→SSD 컨트롤러 방향의 **명령**, NAND→컨트롤러→PCIe DMA→호스트 메모리 방향의 **읽기 데이터**, 이후 GPU로 향하는 **별도 전송**을 화살표 색/레이블로 구별. NVMe는 명령/호스트 인터페이스, PCIe는 전송, SSD는 장치, NAND는 매체
- **teacherExpectedAnswer (gated):** 호스트→PCIe→SSD 컨트롤러 방향의 **명령**, NAND→컨트롤러→PCIe DMA→호스트 메모리 방향의 **읽기 데이터**, 이후 GPU로 향하는 **별도 전송**을 화살표 색/레이블로 구별. NVMe는 명령/호스트 인터페이스, PCIe는 전송, SSD는 장치, NAND는 매체
- **correctIncorrectCriteria:** 네 층 구분과 (요청 host→SSD, read-data SSD→host, host→GPU 별도) **세 화살표**를 각각 맞히면 성공; 컨트롤러/PCIe를 건너뛴 직행 경로는 오답
- **misconceptions (3 expected mistakes):** ① NVMe는 SSD를 꽂는 물리 케이블이다 ② CPU가 항상 바이트 하나씩 직접 복사해야 한다 ③ SSD 데이터를 읽으면 항상 바로 HBM에 적재된다
- **hints (level 1/2/3):** ① 읽으라는 명령은 누가 주나요? ② 전송하는 길과 명령 규칙이 같을까요? ③ DMA나 GPUDirect Storage 같은 대안 경로는 어떻게 달라질까요?
- **feedback/correct:** “보셨죠? SSD를 무엇으로 읽으라고 요청할지는 NVMe, PCIe는 대표적인 데이터 전송 통로이며 실제 데이터 경로는 플랫폼마다 다릅니다.”
- **feedback/incorrect (dispatcher only):** 실제로 선택한 잘못된 개념 ID m1/m2/m3의 분기만 관찰 뒤 열기. 일괄 generic 오답 피드백을 완료 판정에 사용하지 않음.
- **feedback/hint:** L1/L2/L3는 학습자 요청 시에만 단계 공개; 강사 정답은 prediction·직접 조작 이전의 화면/Voice/aria에 숨김.
- **explanation:** SSD를 무엇으로 읽으라고 요청할지는 NVMe, PCIe는 대표적인 데이터 전송 통로이며 실제 데이터 경로는 플랫폼마다 다릅니다.
- **nextHook:** 서버가 여러 대면 네트워크도 지나야 할까요?
- **displayTextBeforePrediction:** 저장소에서 읽기 명령과 데이터의 방향은 같을까요?
- **displayTextAfterObservation (gated):** 명령과 SSD의 실제 읽기 데이터는 반대 방향으로 갈 수 있어요.
- **speechTextBeforePrediction:** NVMe, PCIe, SSD 컨트롤러, NAND 카드가 각각 어떤 순서인지 먼저 맞춰보세요.
- **speechTextAfterObservation (gated):** 호스트가 읽기 명령을 보내고, SSD 컨트롤러가 NAND를 읽어 DMA로 호스트 메모리에 데이터를 보내요. GPU로의 이동은 별도 지원 경로를 따르죠.
- **physicsAssumptions:** 일반적인 host-staging 예시; GPU direct storage 및 NVMe-oF/TCP/RDMA 등 다른 경로를 배제하지 않음
- **sourceRefs:** [S8][S9][S10] NVMe 공식
- **A05:** scene 연동 입력·출력, 예측 전 정답 숨김, 상태/단위 표시, 3개 오답별 원인 피드백, 키보드/모바일/모션 축소 대응.

- **misconceptionFeedback/m1 (gated):** “NVMe는 저장장치의 명령/큐 인터페이스 규칙이며, PCIe는 대표적인 연결/전송 경로예요. 같은 물리 케이블 이름이 아니죠.”
- **misconceptionFeedback/m2 (gated):** “CPU가 I/O를 설정하더라도 실제 읽기 payload를 장치 DMA로 호스트 DDR에 옮길 수 있어요. CPU 코어가 바이트마다 복사해야 하는 건 아니에요.”
- **misconceptionFeedback/m3 (gated):** “SSD를 읽었다고 데이터가 무조건 GPU HBM에 직접 들어가지는 않아요. 호스트 메모리를 거치는 기본 경로와 조건부 직접 경로를 나눠 확인해야 해요.”
- **validation branch mapping:** selectedMisconception ∈ {m1,m2,m3}; actual wrong answer triggers matching cause-only feedback; correct predicted learner can pass without ever choosing wrong answer after two independent manipulations and WHY.
## Step 5 · N04-S05 / sceneId: ai-datacenter-pipeline
- **learningGoal:** 데이터센터 전체 추론·학습 흐름과 병목 구별
- **priorKnowledge:** N04-S04, GPU bandwidth, DRAM
- **storyHook:** AI에 질문 한 줄을 쓰면 서버에서는 무슨 여행을 시작할까요?
- **question:** GPU만 더 많이 달면 항상 답이 빨라질까요?
- **predictionPrompt (learner-visible):** 모델이 이미 GPU 메모리에 있는 경우와 저장소에서 처음 적재해야 하는 경우 중 어느 경로가 필요할지 먼저 예상해 보세요.
- **learnerAction:** 시나리오 전환: 모델 로딩/이미 VRAM 상주/다중 GPU 학습 체크포인트; SSD/DDR/GDDR·HBM/GPU/NIC/네트워크 결과 경로 추적
- **modelInputs:** stage load/infer/train/save, bottleneck storage/compute/network toy, servers 1/2
- **expectedObservation (teacher-only):** 이미 모델이 메모리에 있으면 매 토큰 SSD read 불필요, 학습 체크포인트는 저장 병목, 분산 처리에 네트워크·전력·냉각 필요
- **teacherExpectedAnswer (gated):** 이미 모델이 메모리에 있으면 매 토큰 SSD read 불필요, 학습 체크포인트는 저장 병목, 분산 처리에 네트워크·전력·냉각 필요
- **correctIncorrectCriteria:** 한 요청의 끝 경로 및 2가지 병목을 논리적으로 설명하면 성공
- **misconceptions (3 expected mistakes):** ① 모든 AI 요청마다 모델을 SSD에서 완전히 새로 읽는다 ② HBM이 있으니 SSD나 DDR는 필요 없다 ③ 데이터센터는 GPU만 있으면 작동한다
- **hints (level 1/2/3):** ① 모델이 이미 VRAM에 있으면 다시 읽을까요? ② 다른 서버 GPU와 동기화하려면 무엇이 필요할까요? ③ 발열/전력/오류/복구를 빼도 될까요?
- **feedback/correct:** “보셨죠? 데이터는 SSD·서버 DRAM·GPU 메모리·연산기·네트워크 사이를 목적별로 이동해요. 어떤 단계가 느리거나 뜨거운지 알아야 전체가 잘 돌아갑니다.”
- **feedback/incorrect (dispatcher only):** 실제로 선택한 잘못된 개념 ID m1/m2/m3의 분기만 관찰 뒤 열기. 일괄 generic 오답 피드백을 완료 판정에 사용하지 않음.
- **feedback/hint:** L1/L2/L3는 학습자 요청 시에만 단계 공개; 강사 정답은 prediction·직접 조작 이전의 화면/Voice/aria에 숨김.
- **explanation:** 데이터는 SSD·서버 DRAM·GPU 메모리·연산기·네트워크 사이를 목적별로 이동해요. 어떤 단계가 느리거나 뜨거운지 알아야 전체가 잘 돌아갑니다.
- **nextHook:** 이 시스템을 실제로 만들고 더 효율적으로 식히려면 공정·패키징·전력을 배워야 할까요?
- **displayTextBeforePrediction:** AI 요청마다 같은 길을 지날까요?
- **displayTextAfterObservation (gated):** AI 모델이 이미 GPU 메모리에 있다면 매번 SSD를 다시 읽지 않아요.
- **speechTextBeforePrediction:** 모델이 이미 메모리에 있을 때와 처음 불러오는 때의 경로를 따로 그려봐요.
- **speechTextAfterObservation (gated):** 시나리오별로 로딩, 계산, 네트워크, 전력과 냉각의 병목이 달라질 수 있어요.
- **physicsAssumptions:** AI 워크로드별 캐시/배치/모델 적재/오프로딩·네트워크 토폴로지 다름, 실제 시간 측정 불가
- **sourceRefs:** [S1][S8][S12] DRAM/NVMe/network
- **A05:** scene 연동 입력·출력, 예측 전 정답 숨김, 상태/단위 표시, 3개 오답별 원인 피드백, 키보드/모바일/모션 축소 대응.

## QA
모든 Step 필수 17 필드·오개념 3개·힌트 3개·친근한 한국어 Voice·공학적 가정·다음 Hook 검토. 절대 숫자/업계 제품 성능 대신 구별된 교육용 모형. 실제 학습자 파일럿·A05 구현·A02 앱 통합은 아직 하지 않음.
- **misconceptionFeedback/m1 (gated):** “모델·캐시가 GPU 메모리에 계속 상주한다면 토큰마다 모델을 SSD에서 통째로 다시 읽는 건 아니에요.”
- **misconceptionFeedback/m2 (gated):** “HBM이 빨라도 장기 저장소 SSD와 CPU DDR 같은 다른 계층의 목적은 사라지지 않아요.”
- **misconceptionFeedback/m3 (gated):** “GPU 외에도 전원·냉각·NIC·CPU·저장소·네트워크가 있어야 전체 서버/클러스터를 운영할 수 있어요.”
- **validation branch mapping:** selectedMisconception ∈ {m1,m2,m3}; actual wrong answer triggers matching cause-only feedback; correct predicted learner can pass without ever choosing wrong answer after two independent manipulations and WHY.

## A07 Round03 source-feedback MAJOR correction · 2026-10-17
- A07 [Round03 independent source review](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-03-sram-04-audit.md): S01, S02, S04, S05 previously had 3 misconceptions each but only **generic one-message** incorrect feedback; now each has explicit m1,m2,m3 matching cause feedback. S03 previously had 3 named guarded responses and those are preserved.
- Five steps all use student-neutral predictionPrompt, gated teacherExpectedAnswer + expectedObservation, before/after Display/Voice. S02 prior TTS did not state answers as physics results, nevertheless separated into neutral question before vs explanation after. No A07 recheck on current blob yet, no A05/Chromium/API checks by A06.
- Acceptance: independently choose 3 wrong options in each of 4 flagged steps; each must trigger its distinct corrective explanation only after prediction and action, never generic fallback; correct learners are not required to make a mistake; keyboard/Voice/aria scripts must obey gated order.
