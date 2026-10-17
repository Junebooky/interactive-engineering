# 03 · GPU가 빠른데 왜 기다릴까? DDR·GDDR6/7·HBM
> 상태: A06 자체 QA 완료 / A05 장면 제작 인계 가능, A02 앱 미통합 | 2026-10-17
> 선수지식: 02 DRAM/뱅크, CPU와 GPU 병렬 계산 기초(도입에서 설명), bit/byte | 학습목표: 연산·공급 병목, 메모리 제품 계열의 위치, 이론 대역폭 산식과 적층 패키징의 제약 이해.
> 상황 제시→호기심→**정답 비노출 상태에서 먼저 예측**→조작→관찰→원리 발견→응용→다음 질문.

## Step 1 · G03-S01 / sceneId: compute-feeding
- **learningGoal:** 연산량과 데이터 공급 속도의 차이를 인식
- **priorKnowledge:** 초당 처리량, DRAM read
- **storyHook:** GPU가 놀고 있다면 코어를 더 사면 될까요?
- **question:** 계산기만 두 배로 늘리면 완성 시간이 반으로 줄까요?
- **prediction:** 계산 16→32와 메모리 공급 8에서 결과 시간 미리 선택.
- **learnerAction:** work=64 작업단위; compute=16/32 units/s, feed=8/16/32 units/s로 조작
- **modelInputs:** work=64 toy units, compute=16/32, memoryFeed=8/16/32 units/s
- **expectedObservation:** 충분히 긴 연속 작업에서 공급과 연산이 **파이프라인으로 겹쳐** 진행한다고 가정하면 처리율=min(compute,feed), feed=8에서는 compute=16→32로 바꾸어도 근사 완료시간 64/8=8 toy seconds. 다만 초기 충전/종료 시간은 무시한 정상상태 근사이며 실제 일회성 작업 시간과 다름
- **correctIncorrectCriteria:** 병목의 위치를 집으면 성공; 코어가 늘면 언제나 2배 빨라진다는 답은 오답
- **misconceptions (3 expected mistakes):** ① 코어를 2배 늘리면 시간은 항상 절반 ② 용량 GB가 2배면 대역폭 GB/s도 2배 ③ 지연시간과 총 처리량은 같다
- **hints (level 1/2/3):** ① 데이터가 8개만 오는데 32개를 계산할 수 있을까요? ② 먼저 한쪽 속도만 올려봐요. ③ 데이터가 제때 오도록 feed를 올려보세요.
- **feedback/correct:** “보셨죠? 실효 속도는 계산 처리량과 데이터 공급 속도 중 느린 곳에 막히는 경우가 많아요.”
- **feedback/incorrect:** “그렇게 생각하기 쉬워요. 데이터가 8개만 오는데 32개를 계산할 수 있을까요? 다시 해볼까요?”
- **feedback/hint:** “바로 답을 보여드리기보다 먼저 한쪽 속도만 올려봐요.”
- **explanation:** 실효 속도는 계산 처리량과 데이터 공급 속도 중 느린 곳에 막히는 경우가 많아요.
- **nextHook:** 그럼 데이터가 오는 길을 넓히는 메모리는 무엇일까요?
- **displayText:** 코어가 아니라 데이터 길?
- **speechText:** 계산할 준비는 됐는데 재료가 늦게 온다면요? 속도를 바꾸기 전에 어느 쪽이 막혔는지 맞혀보세요.
- **physicsAssumptions:** min(compute,feed) toy 모델은 메모리 공급과 계산의 **완전 파이프라인 중첩/정상상태 처리율**을 가정한다. 초기/종료 지연과 캐시·재사용은 생략한다. 만약 둘을 순차 진행시켰다면 시간은 64/8+64/16=12초 → 64/8+64/32=10 toy seconds로 달라진다. 실측 GPU FLOPS/GB/s 아님
- **sourceRefs:** [S1] 삼성 DRAM 계열
- **A05:** scene 연동 입력·출력, 예측 전 정답 숨김, 상태/단위 표시, 3개 오답별 원인 피드백, 키보드/모바일/모션 축소 대응.

## Step 2 · G03-S02 / sceneId: memory-family-roles
- **learningGoal:** DDR/RDIMM·GDDR6/GDDR7·HBM이 모두 DRAM임을 확인
- **priorKnowledge:** G03-S01, DRAM 1T1C
- **storyHook:** 서버 CPU와 그래픽 GPU가 같은 메모리를 쓰면 어떨까요?
- **question:** 메모리의 자리가 다르면 설계 목표도 같을까요?
- **prediction:** CPU 서버, 보드 GPU, AI 패키지에 DRAM 카드 매칭 예상.
- **learnerAction:** DDR/RDIMM, GDDR6, GDDR7, HBM 카드별 설치 위치와 장점·제약 드래그
- **modelInputs:** placement CPU DIMM / GPU board / close-to-GPU package; requirements capacity/bandwidth/power/cost
- **expectedObservation:** 서버 DDR/RDIMM은 CPU 측, GDDR6·7은 많은 GPU 보드, HBM은 일부 AI/HPC의 적층·넓은 연결; 모두 DRAM
- **correctIncorrectCriteria:** 적용 위치를 요구에 따라 설명하면 성공; GPU에는 반드시 HBM이라는 답은 오답
- **misconceptions (3 expected mistakes):** ① HBM은 DRAM이 아닌 별도 저장 기술이다 ② 모든 GPU는 HBM만 사용한다 ③ GDDR7이 무조건 모든 지표에서 더 낫다
- **hints (level 1/2/3):** ① 램도 설치 장소와 목표가 다른가요? ② 용량·비용·열·대역폭을 각각 비교해보세요. ③ GPU마다 실제 채용 메모리가 다를까요?
- **feedback/correct:** “보셨죠? 메모리는 한 종류의 승자가 있는 게 아니라 대역폭·용량·비용·열·호환성을 보고 선택하는 거예요.”
- **feedback/incorrect:** “그렇게 생각하기 쉬워요. 램도 설치 장소와 목표가 다른가요? 다시 해볼까요?”
- **feedback/hint:** “바로 답을 보여드리기보다 용량·비용·열·대역폭을 각각 비교해보세요.”
- **explanation:** 메모리는 한 종류의 승자가 있는 게 아니라 대역폭·용량·비용·열·호환성을 보고 선택하는 거예요.
- **nextHook:** GDDR7은 GDDR6보다 신호 자체가 달라졌다고요?
- **displayText:** 같은 DRAM도 쓰임새가 달라요
- **speechText:** 같은 DRAM 가족인데 서로 하는 일이 달라요. 각 상황에 어떤 메모리가 어울릴지 골라봐요.
- **physicsAssumptions:** 실제 제품 SKU별 구성/용량/전력은 다름; RDIMM은 CPU 메모리 쪽의 한 모듈 형식
- **sourceRefs:** [S1][S3][S4][S5]
- **A05:** scene 연동 입력·출력, 예측 전 정답 숨김, 상태/단위 표시, 3개 오답별 원인 피드백, 키보드/모바일/모션 축소 대응.

## Step 3 · G03-S03 / sceneId: gddr-width-rate
- **learningGoal:** 버스 폭과 핀 데이터레이트로 이론 대역폭 계산
- **priorKnowledge:** G03-S02, bit=1/8 byte
- **storyHook:** 길을 그대로 두고 한 신호에서 더 많은 정보를 전달한다면?
- **question:** 128bit 인터페이스에서 24Gb/s/pin과 32Gb/s/pin의 차이는?
- **prediction:** 둘 중 384 또는 512GB/s를 먼저 예상.
- **learnerAction:** 버스 폭 128bit 유지, 24→32 Gb/s/pin, 이론 대역폭 계산·그래프 관찰; PAM3 레벨 전환 보기
- **modelInputs:** busWidth=128 bit toy, pinRate=24/32 Gb/s/pin toy, efficiency=100% toy
- **expectedObservation:** 24일 때 384GB/s, 32일 때 512GB/s(십진); GDDR7 PAM3=3신호레벨, GDDR6 NRZ=2레벨
- **correctIncorrectCriteria:** 두 계산을 맞추고 이론/실효를 구분하면 성공
- **misconceptions (3 expected mistakes):** ① Gb/s를 GB/s와 동일시 ② PAM3는 3비트/클럭이라는 뜻 ③ 계산 결과가 실제 GPU의 실측 처리량이다
- **hints (level 1/2/3):** ① 1바이트가 몇 비트인지 떠올려봐요. ② 128 × 24 ÷ 8은 얼마일까요? ③ PAM3 3단계는 3비트가 아니라 서로 구별되는 신호 높이예요.
- **feedback/correct:** “보셨죠? 대역폭은 폭 × 핀당 전송률 ÷ 8로 계산할 수 있어요. PAM3의 세 단계는 세 비트를 한번에 보낸다는 뜻은 아니에요.”
- **feedback/incorrect:** “그렇게 생각하기 쉬워요. 1바이트가 몇 비트인지 떠올려봐요. 다시 해볼까요?”
- **feedback/hint:** “바로 답을 보여드리기보다 128 × 24 ÷ 8은 얼마일까요?”
- **explanation:** 대역폭은 폭 × 핀당 전송률 ÷ 8로 계산할 수 있어요. PAM3의 세 단계는 세 비트를 한번에 보낸다는 뜻은 아니에요.
- **nextHook:** HBM은 대신 엄청 넓은 연결을 쓰는데 무조건 좋은 걸까요?
- **displayText:** 데이터 통로의 폭 × 속도
- **speechText:** 같은 길에서 신호를 바꿔볼까요? 숫자는 가상 인터페이스의 이론치예요.
- **physicsAssumptions:** 가상의 128bit·24/32Gb/s/pin; 실제 GDDR6/7 SKU 공인 속도나 전송 효율·전력·지연 수치 아님
- **sourceRefs:** [S3][S18] GDDR7 신호 기술
- **A05:** scene 연동 입력·출력, 예측 전 정답 숨김, 상태/단위 표시, 3개 오답별 원인 피드백, 키보드/모바일/모션 축소 대응.

## Step 4 · G03-S04 / sceneId: hbm-tradeoffs
- **learningGoal:** HBM 적층·TSV·인터포저 구조와 비용/열 trade-off
- **priorKnowledge:** G03-S03, 칩 연결
- **storyHook:** 길을 엄청 넓히면 끝일까요?
- **question:** HBM이 좋다면 모든 컴퓨터가 HBM을 쓰지 않는 이유는?
- **prediction:** 가격·열·용량·대역폭 중 어떤 게 제약일지 예측.
- **learnerAction:** 보드 GDDR 배치/패키지 옆 HBM 적층 보기; 넓은 인터페이스 ↔ 패키징 비용·열 가상축 조절
- **modelInputs:** topology GDDR board vs HBM stack/TSV/interposer; bandwidth/cost/thermal qualitative
- **expectedObservation:** HBM도 DRAM, 넓은 I/O와 가까운 패키징은 장점이나 제조 복잡도·열·비용 제약
- **correctIncorrectCriteria:** 동일 제품/워크로드의 확정 비교가 아닌 요구별 선택 설명하면 성공
- **misconceptions (3 expected mistakes):** ① HBM이 있으면 SSD와 DDR는 완전히 불필요하다 ② HBM은 GPU 계산 코어다 ③ 교육용 2.5D 시각과 반도체 2.5D 패키지는 같다
- **hints (level 1/2/3):** ① 데이터를 오래 저장할 곳은 따로 필요하지 않을까요? ② 열이 많은 부품을 가까이 두면 어떤 일이 생길까요? ③ 인터포저는 연산기인가요 연결판인가요?
- **feedback/correct:** “보셨죠? HBM은 적층 DRAM과 TSV, 넓은 연결로 고대역폭을 노리지만 비용·전력·발열을 함께 설계해야 해요.”
- **feedback/incorrect:** “그렇게 생각하기 쉬워요. 데이터를 오래 저장할 곳은 따로 필요하지 않을까요? 다시 해볼까요?”
- **feedback/hint:** “바로 답을 보여드리기보다 열이 많은 부품을 가까이 두면 어떤 일이 생길까요?”
- **explanation:** HBM은 적층 DRAM과 TSV, 넓은 연결로 고대역폭을 노리지만 비용·전력·발열을 함께 설계해야 해요.
- **nextHook:** 그런데 전원이 꺼진 뒤 AI 모델은 어디에 남을까요?
- **displayText:** 더 넓은 길에도 제약이 있어요
- **speechText:** HBM이 빠른 이유를 살펴봤어요. 동시에 왜 비싸고 까다로운지도 직접 비교해볼까요?
- **physicsAssumptions:** 상대적인 toy 비교만 허용; 특정 SKU의 HBM 우위 단정 금지, 2.5D 두 의미 명확 구별
- **sourceRefs:** [S5][S11][S19]
- **A05:** scene 연동 입력·출력, 예측 전 정답 숨김, 상태/단위 표시, 3개 오답별 원인 피드백, 키보드/모바일/모션 축소 대응.

## QA
모든 Step 필수 17 필드·오개념 3개·힌트 3개·친근한 한국어 Voice·공학적 가정·다음 Hook 검토. 절대 숫자/업계 제품 성능 대신 구별된 교육용 모형. 실제 학습자 파일럿·A05 구현·A02 앱 통합은 아직 하지 않음.
