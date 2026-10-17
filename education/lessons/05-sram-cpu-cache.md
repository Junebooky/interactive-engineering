# 05 · 인버터를 기억으로: SRAM·CPU 캐시·GPU 데이터 위치
> A06 교육용 독립 storyboard v0.1 (2026-10-17). **story/필드 자체 검토 완료, A05 제작 가능**, 앱 구현/브라우저/실사용 학습 검증 전.
> 선수지식: M01 CMOS NOT, D02 DRAM 이해(입문 분기는 M01 뒤 바로 가능)
> 학습 경로: MOSFET→논리→SRAM 6T→CPU cache locality→DDR·GPU 메모리 공급 병목 · M01→05→02 DRAM→03 GPU 병목 (DRAM을 이미 배웠다면 05부터 03으로 합류)
> 교사 원칙: 핵심 질문 → 정답을 감춘 채 예측 → 직접 조작 → 관찰 → 왜? → 적용 → nextHook.
## Step 1 · 05-S01 — `sram-cross-coupled-inverters`
- **sceneId:** `sram-cross-coupled-inverters`
- **learningGoal:** CMOS NOT 두 개의 되먹임으로 두 안정 상태를 만드는 이유
- **priorKnowledge:** M01-S04 CMOS inverter
- **storyHook:** 방금 만든 NOT 게이트 두 개를 고리처럼 잇는다면, 마지막 1이 계속 남을까요?
- **question:** Q=1, Q̅=0 상태에서 외부 신호를 떼면 두 출력이 유지될까요, 둘 다 1로 바뀔까요?
- **prediction:** 학생은 조작 전에 선택/이유를 기록; Q=1, Q̅=0 상태에서 외부 신호를 떼면 두 출력이 유지될까요, 둘 다 1로 바뀔까요?
- **learnerAction:** 두 인버터 출력·입력을 교차 연결하고, Q=1/Q̅=0 또는 Q=0/Q̅=1 토글 후 외부 입력 연결 해제; 피드백 유무 비교.
- **modelInputs:** feedback on/off, initial Q 0/1, supply ON; toy ideal inverter logic
- **expectedObservation:** 되먹임 ON+전원 ON이면 안정한 상보 상태 Q/Q̅ 유지. open feedback이면 hold 보장 없음.
- **correctIncorrectCriteria:** 상보한 두 상태를 구별, 피드백+전원 둘 다 요구한 학생만 성공; XOR/무제한 영구 데이터라고 답하면 실패.
- **misconceptions (3):** 1) 인버터 하나만 있으면 반드시 안정 저장한다 | 2) Q와 Q̅가 함께 1인 상태가 정상 6T SRAM 비트다 | 3) SRAM은 전원 끄면 영구 보존한다
- **hints (3 levels):** 1) 두 인버터 출력이 서로 입력으로 돌아가면 누가 현재값을 붙잡나요? | 2) Q=1일 때 반대편 출력은 0일까요? | 3) 전원을 꺼도 능동 소자들이 상태를 유지할까요?
- **feedback/correct:** "맞아요. 상보적인 두 값이 서로 상태를 지탱해요. 하지만 전원이 꺼지면 기억은 휘발해요."
- **feedback/incorrect (concept-specific):** "인버터만으론 실제 읽기/쓰기 연결이 부족해요. 둘 중 하나를 바꾸려면 어떻게 외부 선을 붙일까요?" (각 오답 선택별로 **해당 misconceptions의 문장을 반박**하는 시각 원인과 관찰로 되돌릴 것)
- **feedback/hint:** Q=1일 때 반대편 출력은 0일까요?
- **explanation:** 두 CMOS 인버터의 상호 피드백으로 **두 안정 상태**를 형성한다. 정적 저장은 리프레시가 필요하지 않지만 전원이 필요하다.
- **nextHook:** 자, 두 스위치 회로를 고리처럼 연결해 봐요. 전원을 켜 둔 동안 어떤 값이 살아남을까요?
- **displayText:** 두 인버터가 서로 기억해요
- **speechText:** 두 인버터가 서로 기억해요
- **physicsAssumptions:** [S21] Universität Hamburg 6T SRAM demonstration
- **sourceRefs:** 다음은 BL/BLB, 워드라인을 통해 셀에 접근합니다.
- **A05 visual spec:** layered cutaway/circuit, 상태·단위·모형가정 항상 표시; 예측 이전 정답 노출 금지; 조작만으로 pass 금지; 정답/오답/hint feedback 직접 연결; keyboard/44px/reduced-motion/Voice 구분.

## Step 2 · 05-S02 — `sram-6t-access`
- **sceneId:** `sram-6t-access`
- **learningGoal:** 6T SRAM의 4개 인버터 소자+2개 접근 트랜지스터 역할 구분
- **priorKnowledge:** 이전 스텝의 cross-coupled latch, WL/BL의 감각
- **storyHook:** 저장된 1을 읽거나 0으로 바꾸려면 스위치를 몇 개 더 달면 될까요?
- **question:** 워드라인이 꺼진 동안 BL 값을 바꾸면 셀이 덮어써질까요?
- **prediction:** 학생은 조작 전에 선택/이유를 기록; 워드라인이 꺼진 동안 BL 값을 바꾸면 셀이 덮어써질까요?
- **learnerAction:** WL 0→1, 상보 BL/BLB 입력(1/0·0/1)과 Q/Q̅ 비교 → WL 0; 읽기 모드에서 bitline 감지 조작.
- **modelInputs:** wordline on/off; BL,BLB complementary 1/0; read/write; Q/Q̅ stable bits
- **expectedObservation:** WL OFF면 셀 분리·상태 유지, WL ON과 적절한 쓰기 드라이브면 Q/Q̅ 갱신. 읽기는 BL/BLB 감지를 사용.
- **correctIncorrectCriteria:** 6T=4+2 트랜지스터와 WL의 역할 정확히 지목, BL 두 개/읽기 시 교란 가능성 인정하면 통과.
- **misconceptions (3):** 1) 6T SRAM은 전하 커패시터 하나에 1비트를 쓴다 | 2) WL=0이어도 BL만 바꾸면 무조건 덮어쓴다 | 3) 모든 SRAM 읽기는 완전히 비파괴이고 교란 위험이 없다
- **hints (3 levels):** 1) 두 인버터에 각각 몇 개의 MOSFET이 있을까요? | 2) 셀과 BL을 잇는 스위치는 WL이 무엇일 때 열리나요? | 3) 읽기 안정성(noise margin)을 실제 회로는 왜 검토할까요?
- **feedback/correct:** "이제 1비트를 외부에서 다룰 수 있겠네요. 전원을 끄면 휘발하는 특성은 DRAM과 같아요."
- **feedback/incorrect (concept-specific):** "6T 셀이 1T1C보다 부품이 많다면, CPU는 왜 이런 비싼 저장소를 가까이 둘까요?" (각 오답 선택별로 **해당 misconceptions의 문장을 반박**하는 시각 원인과 관찰로 되돌릴 것)
- **feedback/hint:** 셀과 BL을 잇는 스위치는 WL이 무엇일 때 열리나요?
- **explanation:** 대표 6T 셀 = CMOS 인버터 2개(4T) + 접근 nMOS 2개; BL/BLB와 WL. 읽기 안정성·쓰기 능력은 소자 비율/잡음 여유에 달림.
- **nextHook:** 워드라인을 열면 외부 비트라인과 연결돼요. 닫으면 방금 쓴 값이 어떻게 될까요?
- **displayText:** 6T: 두 인버터와 두 출입문
- **speechText:** 6T: 두 인버터와 두 출입문
- **physicsAssumptions:** [S21] Universität Hamburg 6T SRAM demonstration
- **sourceRefs:** 캐시 선택으로 이어지는 셀 면적·회로 제약.
- **A05 visual spec:** layered cutaway/circuit, 상태·단위·모형가정 항상 표시; 예측 이전 정답 노출 금지; 조작만으로 pass 금지; 정답/오답/hint feedback 직접 연결; keyboard/44px/reduced-motion/Voice 구분.

## Step 3 · 05-S03 — `cpu-cache-vs-dram`
- **sceneId:** `cpu-cache-vs-dram`
- **learningGoal:** SRAM 캐시와 DRAM의 역할 차이를 데이터 접근에서 발견
- **priorKnowledge:** SRAM 6T, DRAM 1T1C, CPU 연산기
- **storyHook:** CPU가 같은 숫자를 여러 번 더하는데 매번 DRAM까지 다녀오면 시간이 얼마나 걸릴까요?
- **question:** 작은 빠른 캐시가 있어도 메모리 읽기 속도에 차이가 생길까요?
- **prediction:** 학생은 조작 전에 선택/이유를 기록; 작은 빠른 캐시가 있어도 메모리 읽기 속도에 차이가 생길까요?
- **learnerAction:** toy CPU 요청열 A,A,B,A,C. 캐시 용량 1 또는 2 line, LRU replacement; hit/miss 동작 및 처리시간 합산.
- **modelInputs:** requests A,A,B,A,C; cacheLines 1/2, hit 1 time unit, miss 10 toy time units
- **expectedObservation:** 예를 들어 1라인 LRU: A miss,A hit,B miss,A miss,C miss = 41 units; 2라인 LRU: A miss,A hit,B miss,A hit,C miss = 32 units (miss 비용을 총 비용으로 가정).
- **correctIncorrectCriteria:** 요청 A에 재방문하며 hit를 만들어 1라인/2라인 시간 41/32를 계산하고 2배 크기=항상 2배 빠르지는 않음을 설명.
- **misconceptions (3):** 1) CPU 캐시는 모든 데이터를 무조건 담을 수 있다 | 2) 캐시 2배 용량이면 어떤 워크로드든 정확히 2배 빠르다 | 3) cache hit와 DRAM miss는 같은 지연이다
- **hints (3 levels):** 1) A가 다시 나왔을 때 작은 캐시에 남아 있을까요? | 2) B가 들어오면 어떤 데이터가 밀려날까요? | 3) 요청 패턴이 랜덤이라면 어떻게 달라질까요?
- **feedback/correct:** "같은 데이터가 다시 쓰일 때 캐시가 시간을 아껴줘요. 캐시 미스는 큰 메모리로 가야 해요."
- **feedback/incorrect (concept-specific):** "코어가 수십 개라면 어느 데이터를 공유하고, 각자 메모리까지 어떻게 찾아갈까요?" (각 오답 선택별로 **해당 misconceptions의 문장을 반박**하는 시각 원인과 관찰로 되돌릴 것)
- **feedback/hint:** B가 들어오면 어떤 데이터가 밀려날까요?
- **explanation:** 캐시는 지역성을 이용한다. SRAM류 온칩 저장 구조는 상대적으로 빠르고 용량/비용/전력 제약으로 작게 두며, 큰 작업집합은 DRAM을 사용.
- **nextHook:** 같은 A를 반복하면 어디에서 가져오는 편이 좋을까요? 요청 순서를 바꿔 비교해봐요.
- **displayText:** 가까운 작은 기억 vs 먼 큰 기억
- **speechText:** 가까운 작은 기억 vs 먼 큰 기억
- **physicsAssumptions:** [S22] Arm cache hierarchy learning path
- **sourceRefs:** CPU 레지스터/코어·NUMA의 후속 주제.
- **A05 visual spec:** layered cutaway/circuit, 상태·단위·모형가정 항상 표시; 예측 이전 정답 노출 금지; 조작만으로 pass 금지; 정답/오답/hint feedback 직접 연결; keyboard/44px/reduced-motion/Voice 구분.

## Step 4 · 05-S04 — `cpu-to-gpu-data-locality`
- **sceneId:** `cpu-to-gpu-data-locality`
- **learningGoal:** CPU 캐시/서버 DDR에서 GPU 연산 데이터로 이어지는 계층 구분
- **priorKnowledge:** CPU cache, DRAM, GPU 메모리 선택
- **storyHook:** AI 모델을 계산할 때 CPU 캐시 하나에 다 넣을 수 있을까요?
- **question:** 모델 가중치가 GPU 메모리에 이미 있다면 매번 서버 DDR/eSSD에서 다시 불러올까요?
- **prediction:** 학생은 조작 전에 선택/이유를 기록; 모델 가중치가 GPU 메모리에 이미 있다면 매번 서버 DDR/eSSD에서 다시 불러올까요?
- **learnerAction:** CPU core/cache→DDR→PCIe or platform link→GPU SRAM/cache→GDDR/HBM 단계 배치; 모델 상주/미상주 토글.
- **modelInputs:** modelResident true/false, inputBatch, memoryStage cache/DDR/GDDR/HBM/eSSD concept
- **expectedObservation:** 상주 모형에서는 반복 추론 시 모델 가중치 전량 SSD/DDR 재읽기 불필요. 입력/활성값/출력 데이터는 계속 이동.
- **correctIncorrectCriteria:** 언제 데이터 전송이 필요하며 메모리 재사용이 언제 도움 되는지 설명하면 성공.
- **misconceptions (3):** 1) 모든 추론 토큰마다 SSD에서 모델 전체를 불러와야 한다 | 2) CPU SRAM 캐시와 GPU HBM은 용도/저장 방식이 같다 | 3) 모델이 GPU에 상주하면 입력 데이터조차 전혀 이동하지 않는다
- **hints (3 levels):** 1) 모델의 가중치와 사용자 입력 중 무엇이 이미 적재되어 있나요? | 2) GPU 안에도 레지스터·캐시와 장치 DRAM 계층이 있을까요? | 3) 고속 메모리에도 용량·비용 제한이 있지 않을까요?
- **feedback/correct:** "기억은 단순히 저장하기 위한 게 아니라, 데이터를 계산기 가까이 두기 위한 전략이기도 해요."
- **feedback/incorrect (concept-specific):** "GPU 코어가 아무리 많아도 데이터 길이 좁으면 기다리죠. 이제 DDR·GDDR·HBM의 이유를 살펴볼까요?" (각 오답 선택별로 **해당 misconceptions의 문장을 반박**하는 시각 원인과 관찰로 되돌릴 것)
- **feedback/hint:** GPU 안에도 레지스터·캐시와 장치 DRAM 계층이 있을까요?
- **explanation:** 데이터 지역성과 계층을 최적화하면 연산기를 기다리지 않게 한다. CPU/GPU가 물리 주소 공간·메모리 계층을 공유하는 구조도 있으므로 모든 GPU에 분리된 GDDR/HBM이 있다고 단정하지 않는다.
- **nextHook:** 모델이 GPU 옆에 있다면 저장소까지 반복 여행할 필요가 있을까요? 그래도 새 입력은 들어와야겠죠.
- **displayText:** CPU/GPU 메모리는 한 가지가 아니에요
- **speechText:** CPU/GPU 메모리는 한 가지가 아니에요
- **physicsAssumptions:** [S22][S23] Arm memory hierarchy, [S1] Samsung DRAM
- **sourceRefs:** G03 GPU 데이터 공급 병목과 D01 end-to-end 연결.
- **A05 visual spec:** layered cutaway/circuit, 상태·단위·모형가정 항상 표시; 예측 이전 정답 노출 금지; 조작만으로 pass 금지; 정답/오답/hint feedback 직접 연결; keyboard/44px/reduced-motion/Voice 구분.

## QA status
- 4 steps × 17 required fields: 문서에서 점검, 각 Step마다 오개념 3개/힌트 3개·정답 전 조작/그 다음 질문.
- 숫자는 **toy**·공식은 조건 있는 근사. 정확한 제품 SKU 수치·장면 구현·브라우저 행동/접근성은 아직 검증되지 않았으므로 완료라고 부르지 않음.
- 실물 시뮬레이션은 A05 Scene 제작, A02 앱 엔진에 연결 전이며 A06는 파일로만 수업 내용을 인계.
