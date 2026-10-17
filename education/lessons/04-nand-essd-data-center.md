# 04 · NAND·eSSD에서 AI 데이터센터까지: 데이터의 여행
> 상태: A06 자체 QA 완료 / A05 장면 제작 인계 가능, A02 앱 미통합 | 2026-10-17
> 선수지식: 02 DRAM 휘발성·03 GPU 메모리/대역폭 | 학습목표: NAND의 저장 방식/페이지·블록 제약 → SSD FTL/eSSD 신뢰성 → NVMe/PCIe → AI 요청과 데이터 흐름.
> 상황 제시→호기심→**정답 비노출 상태에서 먼저 예측**→조작→관찰→원리 발견→응용→다음 질문.

## Step 1 · N04-S01 / sceneId: nand-threshold
- **learningGoal:** NAND 플래시 비휘발성의 물리적 근거 알기
- **priorKnowledge:** MOS 문턱전압, DRAM의 휘발성
- **storyHook:** 컴퓨터를 꺼도 사진은 남죠. DRAM은 안 그런데 왜일까요?
- **question:** 전원을 빼도 유지되는 상태는 어떻게 만들까요?
- **prediction:** 꺼도 남는 기억장치가 무엇인지 예상.
- **learnerAction:** 저장 전하에 따른 임계전압 2상태를 가상 읽기 전압으로 구별, 전원 OFF/ON 비교
- **modelInputs:** thresholdState low/high toy; readVoltage reference; power on/off
- **expectedObservation:** 플래시 저장 전하가 임계전압에 영향을 주며 다시 전원 켠 뒤에도 구별 가능, DRAM은 전하 누설·휘발
- **correctIncorrectCriteria:** 두 메모리의 보존 방식과 '읽으려면 전원 필요'를 구분하면 성공
- **misconceptions (3 expected mistakes):** ① NAND는 전기 없이 데이터를 읽을 수 있다 ② NAND는 DRAM처럼 수십 ms마다 refresh 필요 ③ 모든 NAND 셀은 반드시 1bit만 표현한다
- **hints (level 1/2/3):** ① 비휘발과 무전원 읽기는 같은 말일까요? ② 켜지는 문턱을 구별하면 상태를 읽을 수 있나요? ③ TLC/QLC라는 다중 상태 방식도 있을까요?
- **feedback/correct:** “보셨죠? NAND는 부유 게이트 또는 전하 트랩 등에 저장 전하를 남겨 문턱전압 상태로 정보를 구별해요.”
- **feedback/incorrect:** “그렇게 생각하기 쉬워요. 비휘발과 무전원 읽기는 같은 말일까요? 다시 해볼까요?”
- **feedback/hint:** “바로 답을 보여드리기보다 켜지는 문턱을 구별하면 상태를 읽을 수 있나요?”
- **explanation:** NAND는 부유 게이트 또는 전하 트랩 등에 저장 전하를 남겨 문턱전압 상태로 정보를 구별해요.
- **nextHook:** 같은 칸의 글자를 수정하려면 왜 복잡해질까요?
- **displayText:** 전원을 꺼도 남는 1
- **speechText:** DRAM은 잊어버리는데 NAND는 기억하네요. 같은 트랜지스터를 다르게 쓰면 어떤 일이 생길까요?
- **physicsAssumptions:** 저장 전하 장기 안정성·리텐션 열화/읽기 교란을 생략한 두 상태 toy 모델
- **sourceRefs:** [S6] NAND 기초
- **A05:** scene 연동 입력·출력, 예측 전 정답 숨김, 상태/단위 표시, 3개 오답별 원인 피드백, 키보드/모바일/모션 축소 대응.

## Step 2 · N04-S02 / sceneId: nand-page-block
- **learningGoal:** 페이지 프로그램과 블록 지우기 비대칭 인식
- **priorKnowledge:** N04-S01
- **storyHook:** 한 줄 수정하려는데 책 한 장을 지워야 한다면?
- **question:** 같은 주소의 파일을 곧바로 덮어쓸 수 있을까요?
- **prediction:** 덮어쓰기 가능/불가 예상.
- **learnerAction:** 2블록×4페이지 toy 배열에서 쓰기→같은 LBA 수정→새 페이지 이동→구 블록 GC
- **modelInputs:** pagesPerBlock=4 toy, blocks=2 toy, write LBA/value, blockErase
- **expectedObservation:** NAND는 페이지 쓰기와 블록 단위 지우기 제약, 기존 데이터 무효화 후 새 곳에 기록
- **correctIncorrectCriteria:** 새 페이지 매핑/GC의 필요성 이해하면 성공
- **misconceptions (3 expected mistakes):** ① 페이지를 무제한 즉시 덮어쓸 수 있다 ② GC는 사용자 파일을 임의로 삭제한다 ③ 페이지와 블록 크기가 같다
- **hints (level 1/2/3):** ① 덮어쓰기가 물리적으로 어렵다면 어디에 쓰면 될까요? ② 옛 페이지는 표시만 무효가 될 수 있어요. ③ 살아 있는 데이터는 어떻게 옮긴 다음 지울까요?
- **feedback/correct:** “보셨죠? NAND는 보통 페이지 단위로 프로그램하고 지우기는 더 큰 블록 단위로 해요. 그래서 데이터를 이사시키는 관리가 필요하죠.”
- **feedback/incorrect:** “그렇게 생각하기 쉬워요. 덮어쓰기가 물리적으로 어렵다면 어디에 쓰면 될까요? 다시 해볼까요?”
- **feedback/hint:** “바로 답을 보여드리기보다 옛 페이지는 표시만 무효가 될 수 있어요.”
- **explanation:** NAND는 보통 페이지 단위로 프로그램하고 지우기는 더 큰 블록 단위로 해요. 그래서 데이터를 이사시키는 관리가 필요하죠.
- **nextHook:** 이 복잡한 정리를 누가 대신해줄까요?
- **displayText:** 덮어쓰기, 왜 어려울까?
- **speechText:** 한 칸만 고치려 했는데 다른 빈 칸이 필요하네요. 직접 주소를 옮겨볼까요?
- **physicsAssumptions:** toy block 4 pages; 실제 NAND의 block/page 크기·program order·erase 제약은 세대/제품별 상이
- **sourceRefs:** [S6][S7] NAND 관리
- **A05:** scene 연동 입력·출력, 예측 전 정답 숨김, 상태/단위 표시, 3개 오답별 원인 피드백, 키보드/모바일/모션 축소 대응.

## Step 3 · N04-S03 / sceneId: ssd-ftl-reliability
- **learningGoal:** SSD controller/FTL/eSSD 안정성 이해
- **priorKnowledge:** N04-S02, 논리주소/물리주소
- **storyHook:** SSD 안에 데이터 이사 담당이 있다면요?
- **question:** 서버용 eSSD는 단순히 큰 SSD일까요?
- **prediction:** 자주 쓰는 주소를 한 블록에 몰아넣을 때 내구성 예상.
- **learnerAction:** LBA→물리 page 연결; hot/cold writes·wear leveling, ECC 유무 toy, PLP 설계 카드 비교
- **modelInputs:** writePattern hot/cold, wear counters, ECC on/off toy, PLP optional
- **expectedObservation:** 호스트 주소가 같아도 물리 페이지 이동; 컨트롤러가 수명·오류·QoS 관리; 일부 eSSD에는 전원 보호 설계
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
- **displayText:** 서버는 오래, 안정적으로
- **speechText:** 밤에도 일하는 서버에서는 빠르기만 해선 아쉬워요. 오래 버티고 오류를 줄이는 방법을 골라볼까요?
- **physicsAssumptions:** 제품별 PLP/DRAM/내구성/성능 상이; toy 수명지표는 실측 DWPD 아님
- **sourceRefs:** [S7][S8][S20]
- **A05:** scene 연동 입력·출력, 예측 전 정답 숨김, 상태/단위 표시, 3개 오답별 원인 피드백, 키보드/모바일/모션 축소 대응.

## Step 4 · N04-S04 / sceneId: nvme-transfer
- **learningGoal:** NVMe·PCIe·SSD·NAND 계층 구별
- **priorKnowledge:** N04-S03
- **storyHook:** SSD에 저장된 숫자는 GPU로 어떻게 갈까요?
- **question:** PCIe와 NVMe는 같은 말일까요?
- **prediction:** 장치/명령/통로/매체 카드 미리 매칭.
- **learnerAction:** **명령과 데이터 화살표 분리**: (1) NVMe READ command: 호스트 소프트웨어/큐→PCIe→SSD 컨트롤러→NAND 읽기 준비; (2) read payload: NAND→SSD 컨트롤러→PCIe DMA→host DDR; (3) 필요시 host DDR→GPU 메모리로 PCIe/플랫폼별 전송. 다른 DMA/직접 경로는 옵션으로 분기
- **modelInputs:** request read, transport PCIe, device SSD, media NAND, path standard-host-staging toy
- **expectedObservation:** 호스트→PCIe→SSD 컨트롤러 방향의 **명령**, NAND→컨트롤러→PCIe DMA→호스트 메모리 방향의 **읽기 데이터**, 이후 GPU로 향하는 **별도 전송**을 화살표 색/레이블로 구별. NVMe는 명령/호스트 인터페이스, PCIe는 전송, SSD는 장치, NAND는 매체
- **correctIncorrectCriteria:** 네 층 구분과 (요청 host→SSD, read-data SSD→host, host→GPU 별도) **세 화살표**를 각각 맞히면 성공; 컨트롤러/PCIe를 건너뛴 직행 경로는 오답
- **misconceptions (3 expected mistakes):** ① NVMe는 SSD를 꽂는 물리 케이블이다 ② CPU가 항상 바이트 하나씩 직접 복사해야 한다 ③ SSD 데이터를 읽으면 항상 바로 HBM에 적재된다
- **hints (level 1/2/3):** ① 읽으라는 명령은 누가 주나요? ② 전송하는 길과 명령 규칙이 같을까요? ③ DMA나 GPUDirect Storage 같은 대안 경로는 어떻게 달라질까요?
- **feedback/correct:** “보셨죠? SSD를 무엇으로 읽으라고 요청할지는 NVMe, PCIe는 대표적인 데이터 전송 통로이며 실제 데이터 경로는 플랫폼마다 다릅니다.”
- **feedback/incorrect:** “그렇게 생각하기 쉬워요. 읽으라는 명령은 누가 주나요? 다시 해볼까요?”
- **feedback/hint:** “바로 답을 보여드리기보다 전송하는 길과 명령 규칙이 같을까요?”
- **explanation:** SSD를 무엇으로 읽으라고 요청할지는 NVMe, PCIe는 대표적인 데이터 전송 통로이며 실제 데이터 경로는 플랫폼마다 다릅니다.
- **nextHook:** 서버가 여러 대면 네트워크도 지나야 할까요?
- **displayText:** 저장소에서 GPU로 이동
- **speechText:** SSD 안에 있는 파일이 데이터를 보낼 땐 명령도 필요하고 통로도 필요해요. 각각 역할을 찾아봐요.
- **physicsAssumptions:** 일반적인 host-staging 예시; GPU direct storage 및 NVMe-oF/TCP/RDMA 등 다른 경로를 배제하지 않음
- **sourceRefs:** [S8][S9][S10] NVMe 공식
- **A05:** scene 연동 입력·출력, 예측 전 정답 숨김, 상태/단위 표시, 3개 오답별 원인 피드백, 키보드/모바일/모션 축소 대응.

## Step 5 · N04-S05 / sceneId: ai-datacenter-pipeline
- **learningGoal:** 데이터센터 전체 추론·학습 흐름과 병목 구별
- **priorKnowledge:** N04-S04, GPU bandwidth, DRAM
- **storyHook:** AI에 질문 한 줄을 쓰면 서버에서는 무슨 여행을 시작할까요?
- **question:** GPU만 더 많이 달면 항상 답이 빨라질까요?
- **prediction:** storage/compute/network 중 느린 곳을 먼저 예측.
- **learnerAction:** 시나리오 전환: 모델 로딩/이미 VRAM 상주/다중 GPU 학습 체크포인트; SSD/DDR/GDDR·HBM/GPU/NIC/네트워크 결과 경로 추적
- **modelInputs:** stage load/infer/train/save, bottleneck storage/compute/network toy, servers 1/2
- **expectedObservation:** 이미 모델이 메모리에 있으면 매 토큰 SSD read 불필요, 학습 체크포인트는 저장 병목, 분산 처리에 네트워크·전력·냉각 필요
- **correctIncorrectCriteria:** 한 요청의 끝 경로 및 2가지 병목을 논리적으로 설명하면 성공
- **misconceptions (3 expected mistakes):** ① 모든 AI 요청마다 모델을 SSD에서 완전히 새로 읽는다 ② HBM이 있으니 SSD나 DDR는 필요 없다 ③ 데이터센터는 GPU만 있으면 작동한다
- **hints (level 1/2/3):** ① 모델이 이미 VRAM에 있으면 다시 읽을까요? ② 다른 서버 GPU와 동기화하려면 무엇이 필요할까요? ③ 발열/전력/오류/복구를 빼도 될까요?
- **feedback/correct:** “보셨죠? 데이터는 SSD·서버 DRAM·GPU 메모리·연산기·네트워크 사이를 목적별로 이동해요. 어떤 단계가 느리거나 뜨거운지 알아야 전체가 잘 돌아갑니다.”
- **feedback/incorrect:** “그렇게 생각하기 쉬워요. 모델이 이미 VRAM에 있으면 다시 읽을까요? 다시 해볼까요?”
- **feedback/hint:** “바로 답을 보여드리기보다 다른 서버 GPU와 동기화하려면 무엇이 필요할까요?”
- **explanation:** 데이터는 SSD·서버 DRAM·GPU 메모리·연산기·네트워크 사이를 목적별로 이동해요. 어떤 단계가 느리거나 뜨거운지 알아야 전체가 잘 돌아갑니다.
- **nextHook:** 이 시스템을 실제로 만들고 더 효율적으로 식히려면 공정·패키징·전력을 배워야 할까요?
- **displayText:** AI 답 하나, 여러 기술의 협업
- **speechText:** 어떤 단계에선 저장소가, 다른 단계에선 GPU나 네트워크가 바빠져요. 전체 여정을 같이 추적해봐요.
- **physicsAssumptions:** AI 워크로드별 캐시/배치/모델 적재/오프로딩·네트워크 토폴로지 다름, 실제 시간 측정 불가
- **sourceRefs:** [S1][S8][S12] DRAM/NVMe/network
- **A05:** scene 연동 입력·출력, 예측 전 정답 숨김, 상태/단위 표시, 3개 오답별 원인 피드백, 키보드/모바일/모션 축소 대응.

## QA
모든 Step 필수 17 필드·오개념 3개·힌트 3개·친근한 한국어 Voice·공학적 가정·다음 Hook 검토. 절대 숫자/업계 제품 성능 대신 구별된 교육용 모형. 실제 학습자 파일럿·A05 구현·A02 앱 통합은 아직 하지 않음.
