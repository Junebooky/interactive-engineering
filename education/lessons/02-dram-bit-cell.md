# 02 · DRAM 1T1C: 전하는 어떻게 기억이 될까요?
> 상태: A06 자체 QA 완료 / **A05 장면 제작 인계 가능**, A02 앱 미통합 | 2026-10-17
> 선수지식: 01 레슨의 MOSFET 접근 스위치, 전하·커패시터 복습 | 학습목표: 쓰기·전하 공유 읽기/센스앰프 복원·누설과 리프레시·뱅크 병렬성까지 이어 설명.
> 교육 흐름: 상황 제시 → 호기심 유발 → **예상 먼저** → 조작 → 관찰 → 원리 발견 → 응용 → 다음 질문. 학생 제출 전 정답 비노출.

## Step 1 · D02-S01 / sceneId: dram-write
- **learningGoal:** 워드라인으로 커패시터 저장 비트를 쓰기
- **priorKnowledge:** MOSFET, 전하/전압
- **storyHook:** 스위치 하나와 전하를 담는 작은 칸만 있으면 1을 기억할 수 있을까요?
- **question:** 비트라인을 1로 놓고 워드라인을 열면 무엇이 달라질까요?
- **prediction:** WL OFF와 ON에서 셀 전압 예상.
- **learnerAction:** BL=1→WL=ON→셀 전하 관찰→WL=OFF, BL=0으로 바꿔도 셀이 유지되는지 살펴보기
- **modelInputs:** wordline 0/1; bitline 0/1; cell capacitance 정규화
- **expectedObservation:** 열린 접근 소자를 통해 충·방전, 닫으면 외부 입력 변화에도 셀이 당장 유지
- **correctIncorrectCriteria:** 적절한 WL 순서를 쓰면 정답; WL=OFF에서 즉각 덮어쓰기 주장은 오답
- **misconceptions (3 anticipated wrong answers):** ① 워드라인 OFF에서도 BL 전압만 바꾸면 셀을 쓴다 ② 셀 커패시터가 전기를 계속 생성한다 ③ DRAM의 저장 1은 반드시 완전 VDD다
- **hints (level 1/2/3):** ① WL은 무엇의 게이트를 연결하나요? ② BL과 셀 사이가 닫히면 무슨 일이 일어날까요? ③ 저장 전압은 실제 소자에서 약간 다를 수도 있겠죠?
- **feedback/correct:** “방금 관찰한 변화가 핵심이에요. DRAM의 대표적 1T1C 셀은 접근 트랜지스터 1개와 커패시터 1개를 사용해 저장합니다.”
- **feedback/incorrect:** “그렇게 예상할 수도 있어요. WL은 무엇의 게이트를 연결하나요? 그림에서 다시 확인해 볼까요?”
- **feedback/hint:** “바로 답을 알려드리기보다, BL과 셀 사이가 닫히면 무슨 일이 일어날까요?”
- **explanation:** DRAM의 대표적 1T1C 셀은 접근 트랜지스터 1개와 커패시터 1개를 사용해 저장합니다.
- **nextHook:** 읽기는 저장 내용을 그대로 보존할까요?
- **displayText:** 스위치로 1비트 담기
- **speechText:** 블루라인에 1을 놓고 스위치를 열어봐요. 닫은 뒤에도 셀에 남아 있나요?
- **physicsAssumptions:** 교육용 1T1C·정규화 전압, 실제 쓰기 부스트·마진·셀 산포 생략
- **sourceRefs:** [S1][S2] 삼성반도체 DRAM
- **A05:** 먼저 예측/선택 기록, 이어서 실시간 scene 반응; 정답/오답/힌트/왜? 상태마다 별도 시각 표현, 색상 외 모양/숫자로 의미 구별.

## Step 2 · D02-S02 / sceneId: dram-sense-restore
- **learningGoal:** 읽기 전하공유, 감지, 재기록 연속 동작 이해
- **priorKnowledge:** D02-S01, 전하 공유
- **storyHook:** 읽기만 했는데 저장한 1이 옅어지면 어떡하죠?
- **question:** 한 셀의 미세한 신호를 어떻게 확실한 0/1로 바꿀까요?
- **prediction:** BL 사전충전 VDD/2에서 0/1 읽기 전압 변화 방향을 예측.
- **learnerAction:** 비트라인 VDD/2 프리차지→WL 열기→작은 ΔV 관찰→sense enable→셀 복원
- **modelInputs:** cellBit 0/1, bitlinePrecharge=0.5×VDD, sense 0/1, restore 0/1
- **expectedObservation:** BL 미세 변화 증폭, 읽힌 값을 다시 셀에 복원
- **correctIncorrectCriteria:** 감지+복원 두 작업을 설명해야 통과; read가 셀을 전혀 바꾸지 않는다는 답은 오답
- **misconceptions (3 anticipated wrong answers):** ① 읽어도 셀 전하는 완전히 변하지 않는다 ② 센스앰프는 1비트를 무작위로 생성한다 ③ 센스앰프 없이 BL의 매우 작은 변화가 곧 큰 논리 전압이다
- **hints (level 1/2/3):** ① 프리차지한 BL이 셀과 연결되면 전하는 나뉠까요? ② 작은 전압 차이를 누가 키우나요? ③ 읽은 뒤 셀에는 누가 다시 채우나요?
- **feedback/correct:** “방금 관찰한 변화가 핵심이에요. 셀·비트라인 전하 공유로 생긴 작은 변화를 센스앰프가 키우고 셀까지 다시 써 줍니다.”
- **feedback/incorrect:** “그렇게 예상할 수도 있어요. 프리차지한 BL이 셀과 연결되면 전하는 나뉠까요? 그림에서 다시 확인해 볼까요?”
- **feedback/hint:** “바로 답을 알려드리기보다, 작은 전압 차이를 누가 키우나요?”
- **explanation:** 셀·비트라인 전하 공유로 생긴 작은 변화를 센스앰프가 키우고 셀까지 다시 써 줍니다.
- **nextHook:** 읽지도 않았는데 저장이 흐릿해질 수 있을까요?
- **displayText:** 아주 작은 차이를 읽어볼까요?
- **speechText:** 전압이 아주 조금만 움직이네요. 이걸 크게 키운 다음 다시 채워 넣어볼까요?
- **physicsAssumptions:** ΔV≈Cc/(Cc+Cb)×(Vcell−Vpre), 이상 전하 공유; 정확한 실제 전압/타이밍 아님
- **sourceRefs:** [S1][S2] DRAM read/refresh
- **A05:** 먼저 예측/선택 기록, 이어서 실시간 scene 반응; 정답/오답/힌트/왜? 상태마다 별도 시각 표현, 색상 외 모양/숫자로 의미 구별.

## Step 3 · D02-S03 / sceneId: dram-leak-refresh
- **learningGoal:** 누설과 리프레시 필요성 설명
- **priorKnowledge:** D02-S02, 전하/시간
- **storyHook:** 가만히 뒀는데 1이 조금씩 흐려져요.
- **question:** 전원이 켜져 있어도 왜 데이터를 다시 채울까요?
- **prediction:** 시간이 지난 뒤 어느 쪽 상태가 읽기 어렵게 될지 예측.
- **learnerAction:** 정규화 시간 0→2, 셀 전하 감소 → refresh 버튼으로 복원
- **modelInputs:** elapsed 0~2 (가상 단위), leakRate=0.2/step (가상), refresh 버튼
- **expectedObservation:** 판독 여유 감소, 리프레시 후 정상 상태로 복원
- **correctIncorrectCriteria:** 주기적 복원 이유 설명하면 통과; 실제 모든 DRAM이 똑같은 시간에 리프레시한다는 주장은 오답
- **misconceptions (3 anticipated wrong answers):** ① 전원 켜짐=DRAM 누설 없음 ② 리프레시=플래시 메모리 쓰기 수명 관리 ③ 모든 셀이 같은 누설률과 주기를 가진다
- **hints (level 1/2/3):** ① 커패시터는 완벽한 밀폐 용기일까요? ② 전압이 줄면 감지 오류 위험은 어떨까요? ③ 실제 주기는 장치·온도에 따라 달라질 수 있을까요?
- **feedback/correct:** “방금 관찰한 변화가 핵심이에요. 저장 전하가 누설되어 판독 마진이 줄어들므로 충분히 남아 있을 때 재충전해야 해요.”
- **feedback/incorrect:** “그렇게 예상할 수도 있어요. 커패시터는 완벽한 밀폐 용기일까요? 그림에서 다시 확인해 볼까요?”
- **feedback/hint:** “바로 답을 알려드리기보다, 전압이 줄면 감지 오류 위험은 어떨까요?”
- **explanation:** 저장 전하가 누설되어 판독 마진이 줄어들므로 충분히 남아 있을 때 재충전해야 해요.
- **nextHook:** 이런 셀이 수십억 개라면 주소와 동시 작업은 어떻게 관리할까요?
- **displayText:** 기억도 가끔 새로고침
- **speechText:** 시간 슬라이더를 움직여봐요. 작은 누설이 언제 문제로 바뀌는지 볼까요?
- **physicsAssumptions:** 0~2는 실제 밀리초 아님; 리프레시 주기/수명·온도 정량화하지 않음
- **sourceRefs:** [S1][S2] 삼성 DRAM
- **A05:** 먼저 예측/선택 기록, 이어서 실시간 scene 반응; 정답/오답/힌트/왜? 상태마다 별도 시각 표현, 색상 외 모양/숫자로 의미 구별.

## Step 4 · D02-S04 / sceneId: dram-row-bank
- **learningGoal:** 행/열·뱅크 충돌과 잠재 병렬성 구분
- **priorKnowledge:** D02-S03, 주소/동시성
- **storyHook:** 메모리 요청 두 개가 동시에 몰리면 누가 먼저 들어갈까요?
- **question:** 뱅크를 늘리면 언제 대기줄이 줄까요?
- **prediction:** A·B를 같은 뱅크/서로 다른 뱅크 배치 예측.
- **learnerAction:** 두 요청을 같은 bank에서 실행 → 별개 bank 배치 → 타임라인 비교
- **modelInputs:** bankCount 1/2, twoRequests A/B, timeSlot 가상
- **expectedObservation:** 공유 뱅크에서는 직렬 제약, 서로 다른 뱅크는 일부 겹쳐 처리 가능
- **correctIncorrectCriteria:** 동시 가능 조건을 설명하면 통과; bank 수 2=항상 2배 처리량은 오답
- **misconceptions (3 anticipated wrong answers):** ① 은행처럼 뱅크 숫자가 늘면 무조건 2배 빨라진다 ② 메모리 용량 GB와 대역폭 GB/s는 같은 지표다 ③ 모든 DRAM 액세스는 동일 지연시간이다
- **hints (level 1/2/3):** ① 두 요청이 같은 자원을 쓰나요? ② 버스가 공용인 경우는 어떨까요? ③ GB와 GB/s의 차이를 말해봐요.
- **feedback/correct:** “방금 관찰한 변화가 핵심이에요. 메모리 뱅크는 요청을 부분 병렬로 처리할 가능성을 높이지만 버스·타이밍·컨트롤러 제약은 남아요.”
- **feedback/incorrect:** “그렇게 예상할 수도 있어요. 두 요청이 같은 자원을 쓰나요? 그림에서 다시 확인해 볼까요?”
- **feedback/hint:** “바로 답을 알려드리기보다, 버스가 공용인 경우는 어떨까요?”
- **explanation:** 메모리 뱅크는 요청을 부분 병렬로 처리할 가능성을 높이지만 버스·타이밍·컨트롤러 제약은 남아요.
- **nextHook:** GPU 연산기가 많은데 메모리가 데이터를 제때 못 준다면?
- **displayText:** 뱅크를 나누면 빨라질까?
- **speechText:** 뱅크를 둘로 나눠볼까요? 어떤 대기줄은 짧아지고 어떤 건 그대로일 거예요.
- **physicsAssumptions:** 가상 시간 슬롯/뱅크 모델; tRCD/tRP/tRFC 등 실제 제약은 후속 심화
- **sourceRefs:** [S1][S4] DRAM/server RDIMM
- **A05:** 먼저 예측/선택 기록, 이어서 실시간 scene 반응; 정답/오답/힌트/왜? 상태마다 별도 시각 표현, 색상 외 모양/숫자로 의미 구별.

## A05 자체 QA 체크
Step 4개, 각 Step 핵심 질문/예측/조작/관찰/정오답 기준/오개념 3개/힌트 3단계/Voice/가정/출처 기재. 실측 반도체 동작이 아닌 **명시적 교육용 모델**. 실제 사용자의 이해도·A05 구현 테스트·A02 앱 통합은 아직 수행되지 않음.
