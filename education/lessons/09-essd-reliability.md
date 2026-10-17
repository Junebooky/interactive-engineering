# 09 · eSSD의 숨은 일 — NAND QLC, FTL/GC, PLP, DWPD/p99
> 2026-10-17 · A06 교육 명세 자체 검증 완료(fact checked: 개념, toy model: 수치, needs verification: 실제 SSD 모델). 4 Step. 구현·브라우저 미실행.
> 선수: 04 NAND/eSSD/NVMe, 07 서버 메모리. ① 1분 질문/예측 → ② 직접 숫자/조작 → ③ 시니어 설계판단.

## 09-S01 · `nand-cell-voltage-windows`
- **learningGoal:** SLC/TLC/QLC 저장 밀도와 감지 여유의 trade-off 구분.
- **priorKnowledge:** NAND 임계전압·메모리 read [04].
- **storyHook:** “같은 셀에 더 많이 담을수록 왜 읽는 게 까다로워질까요?”
- **question:** 1/3/4bits per cell이면 몇 가지 상태를 구별하나요?
- **prediction:** SLC=2, TLC=8, QLC=16개 상태를 조작 전 예상.
- **learnerAction:** 1V 가상 전압 창에 2/8/16 상태를 배치하고 ±0.08V 노이즈 슬라이더로 겹침 확인.
- **modelInputs:** thresholdWindow 1V/toy, states [2,8,16], noise [0,0.08]V/toy.
- **expectedObservation:** 균등 중심간격 1/(N−1) V = 1, 0.1429, 0.0667V/toy. 상태가 촘촘해질수록 잡음·분포 겹침에 민감.
- **correctIncorrectCriteria:** 2^bits와 margin 둘 다 설명; toy 정량값을 모든 NAND 제품 사양으로 단정하면 실패.
- **misconceptions:** m1 QLC=4상태만 존재; m2 비트 수 증가해도 감지 난도 동일; m3 더 높은 밀도면 수명·속도 항상 향상.
- **hints:** L1 4비트의 가능한 조합은? / L2 1V를 16개 구간으로 나누면? / L3 실물 저장전하는 온도·시간·read disturb 영향?
- **feedback/incorrect keyed:** m1 “4비트면 16상태예요.” / m2 “전압 상태가 좁아지면 읽기 허용오차도 작아져요.” / m3 “내구성·속도는 제조/전압 분포/컨트롤러마다 달라요.”
- **feedback/correct:** “저장 밀도와 읽기 여유는 서로 다른 목표임을 찾았어요.”
- **explanation:** 실제 NAND Vth 분포는 비균등이고 read reference, program/verify, ECC·retention/read-disturb를 제어한다.
- **physicsAssumptions:** 상태 간격은 가상 균등 창 모델, 실제 프로그램 전압/노이즈/제품 보증과 무관.
- **displayText:** “한 셀에서 16상태를 구별할 수 있을까요?”
- **speechText:** “비트를 더 넣으면 얼마나 작은 차이까지 읽어야 할까요? 직접 상태를 늘려봐요.”
- **nextHook:** 페이지를 덮어쓰기 어려운데 파일 수정은 어떻게 하나요?
- **sourceRefs:** [X1][X2]

## 09-S02 · `ssd-write-amplification`
- **learningGoal:** 호스트 쓰기와 NAND 실제 쓰기, GC/OP/wear 관리 구분.
- **priorKnowledge:** 09-S01 및 NAND page/block, FTL.
- **storyHook:** “1GiB를 썼는데 NAND는 1.6GiB를 썼대요. 어디서 늘었죠?”
- **question:** 파일 수정 때 옛 유효 페이지를 이사시키면 장치 쓰기량은?
- **prediction:** Host 1GiB + GC 0.6GiB relocation → WAF 1 또는 1.6 중 선택.
- **learnerAction:** 블록 valid/invalid 셀 이사, GC on/off, OP 여유 10/20% 카드.
- **modelInputs:** hostWrite 1GiB/toy, relocation 0/0.6GiB/toy, OP toy 10/20%.
- **expectedObservation:** WAF=(host+relocated)/host =1 또는 1.6. GC/OP/워크로드/FTL 방식 변화에 따라 다르나 OP 2배→WAF 반감 법칙 없음.
- **correctIncorrectCriteria:** WAF=physical NAND writes / host writes; OP 증가 효과를 조건부로 설명.
- **misconceptions:** m1 GC가 사용자 파일을 마음대로 삭제; m2 NAND 쓰기는 항상 host 쓰기와 동일; m3 OP 두 배면 WAF는 항상 절반.
- **hints:** L1 invalid page와 valid page 차이 / L2 유효 데이터를 블록 지우기 전에 어디로? / L3 여유 공간과 write pattern은?
- **feedback/incorrect keyed:** m1 “GC는 장치 내부 회수 작업이에요.” / m2 “이사도 추가 쓰기예요.” / m3 “컨트롤러·점유율·쓰기에 따라 효과가 달라요.”
- **feedback/correct:** “보이지 않던 내부 이사 비용을 발견했어요.”
- **explanation:** IBM의 분석대로 flash out-of-place writes와 유효 페이지 이동은 쓰기 증폭과 endurance/tail latency에 영향을 준다.
- **physicsAssumptions:** 1/1.6은 교육 계산만; 특정 SSD WAF/GC 시간 수치 아님.
- **displayText:** “숨은 0.6GiB 쓰기를 찾아봐요.”
- **speechText:** “옛 데이터를 새 자리로 옮기는 비용이 생겼네요. NAND가 실제로 얼마나 더 쓰는지 계산해봐요.”
- **nextHook:** 쓰던 중 전원이 갑자기 끊어지면?
- **sourceRefs:** [X2][X3]

## 09-S03 · `ssd-plp-power-loss`
- **learningGoal:** SSD ACK/휘발 캐시/비휘발 NAND·PLP 보호범위 구분.
- **priorKnowledge:** 09-S02, NVMe read/write, capacitor C·전력.
- **storyHook:** “완료됐다는 표시 직후 전원이 꺼지면 파일은 안전할까요?”
- **question:** write ACK와 실제 NAND commit은 항상 같은 순간일까요?
- **prediction:** ACK 전에 commit vs volatile cache 선 ACK, PLP 선택 예상.
- **learnerAction:** host→volatile buffer→NAND, PLP on/off, flush/FUA 카드, toy capacitor 전압 변환.
- **modelInputs:** C=0.1F, Vhi=5V, Vlo=3V, P=8W (전부 toy).
- **expectedObservation:** E=0.5×0.1×(25−9)=0.8J; 이상적인 hold-up=E/P=0.1s. 실제 데이터 안전성은 controller·firmware·NAND commit·전원손실 범위에 의존.
- **correctIncorrectCriteria:** ACK의 의미, PLP의 역할/한계, toy값과 실제 제품의 사양을 구별.
- **misconceptions:** m1 어떤 ACK든 물리 NAND commit 보장; m2 모든 eSSD에 동일 PLP 필수; m3 0.8J면 어떤 SSD의 모든 outstanding writes 보장.
- **hints:** L1 버퍼는 휘발할 수 있나요? / L2 전원 보호 회로는 제품별로? / L3 변환 손실/메타데이터/남은 NAND 작업량도 계산?
- **feedback/incorrect keyed:** m1 “완료 시점은 flush/FUA/cache 정책에 달라요.” / m2 “PLP의 유무와 범위는 개별 데이터시트에서 보세요.” / m3 “물리 에너지 계산과 완전 보호 보증은 달라요.”
- **feedback/correct:** “ACK, 캐시, 비휘발 기록은 구별해야 해요.”
- **explanation:** 홀드업 회로는 일부 enterprise SSD에서 전원 손실 때 필요한 NAND 프로그램/FTL metadata 보호를 지원할 수 있으나 개별 모델 검증 필수.
- **physicsAssumptions:** 전력·용량·전압 모두 toy; FUA/flush 의미는 특정 command/drive contract 확인 전 일반화 금지.
- **displayText:** “완료 표시 뒤에 정전이 나면?”
- **speechText:** “저장 완료가 뜬 뒤에 전원을 내려볼까요? 데이터가 실제로 어디에 있었는지 확인해봐요.”
- **nextHook:** 데이터는 안전해도 응답이 가끔 느리다면?
- **sourceRefs:** [X3][X4]

## 09-S04 · `essd-dwpd-tail-latency`
- **learningGoal:** DWPD endurance와 평균·p99 latency의 서로 다른 지표 이해.
- **priorKnowledge:** 09-S02/03, 퍼센타일 기초.
- **storyHook:** “평균은 빠른데 가끔 AI 요청이 멈춰 보이는 이유는요?”
- **question:** 평균 1.95ms여도 p99은 20ms일까요?
- **prediction:** 2TB ×1DWPD ×365day ×5년의 TBW, 요청 95×1ms+5×20ms의 avg/p99 예상.
- **learnerAction:** 쓰기 보증 계산과 latency 100개 histogram, QD/burst 상태변경.
- **modelInputs:** capacity 2TB decimal, DWPD 1, years 5, latency samples toy 95×1ms+5×20ms.
- **expectedObservation:** TBW≈3650TB=3.65PB, 평균 (95+100)/100=1.95ms, nearest-rank p99=20ms.
- **correctIncorrectCriteria:** 장치 보증 내구성 vs 서비스 tail, decimal GB/TB와 binary GiB 분리.
- **misconceptions:** m1 DWPD는 읽기 횟수; m2 avg<2ms이면 p99도<2ms; m3 어떤 QD·혼합 부하라도 p99은 고정.
- **hints:** L1 D는 Day, W는 Write / L2 느린 요청 5개는 오른쪽 끝? / L3 큐·온도·GC steady state는?
- **feedback/incorrect keyed:** m1 “하루 드라이브 용량만큼 쓸 수 있는 횟수의 지표예요.” / m2 “평균이 꼬리를 감출 수 있어요.” / m3 “p99도 워크로드와 측정 조건에 따라 달라져요.”
- **feedback/correct:** “내구성과 서비스 품질을 함께 비교하는 이유를 찾았어요.”
- **explanation:** TBW≈DWPD×사용자 용량(TB)×일수. p99 nearest-rank 정의를 명시; IOPS·p99·99.9/99.999p·QD·write mix·실험 지속시간 통일 없이는 제품 비교하지 않는다.
- **physicsAssumptions:** 수치 모두 toy; 실제 제조사 보증·속도 아님. NAND GC/PLP 사례와 p99의 인과 크기는 실제 측정 필요.
- **displayText:** “평균보다 늦는 요청을 찾아봐요.”
- **speechText:** “대부분 빨라도 가끔 길게 기다릴 수 있어요. 평균과 p99을 나란히 볼까요?”
- **nextHook:** 이제 AI 전체 병목은 어디서 결정될까요?
- **sourceRefs:** [X2][X5]

## 공식·연구 근거와 인계
[X1] https://semiconductor.samsung.com/support/tools-resources/dictionary/semiconductor-glossary-nand-flash-memory/
[X2] https://research.ibm.com/publications/write-amplification-analysis-in-flash-based-solid-state-drives
[X3] https://www.zurich.ibm.com/cloudstorage/
[X4] https://nvmexpress.org/specification/nvm-express-base-specification/
[X5] https://my.micron.com/about/blog/storage/ai/the-right-tool-for-the-job-from-crescent-wrenches-to-ai-infrastructure
3 오답 branch, 예측 전 정답 노출 금지, 44px/keyboard/reduced-motion/Voice, toy 모델 배지/선수·다음 Hook. 앱 코드 미변경. 제품별 PLP/flush 보증·DWPD/p99은 데이터시트와 동일 시험 조건 전 절대 성능 단정 금지.
