# A06 deep dive · D02 DRAM 센스앰프의 실제 원리와 타이밍 경계
> CheckedAt 2026-10-17 · factual concept cross-checked using Samsung DRAM overview, university/technical educational resources, recent peer-reviewed paper abstract. DRAM 제품 구체 타이밍은 미검증. **Source-level study only, A05 DRAM scene not built yet.**

## 1. 뭘 '읽었다'고 하는가
1T1C DRAM은 WL 접근 트랜지스터 ON으로 셀 커패시터를 BL에 연결. BL/참조선은 보통 VDD/2로 프리차지(전형적 추상모형)되어 있다. Ccell≪Cbitline일 수 있으므로 전하가 섞인 후 미세한 ±ΔV가 형성된다. 그 ΔV는 감지기의 offset/noise/variation margin보다 충분히 크고 알맞은 시간에 sense-enable 되어야 정상 판단 가능. 보통 상보형 래치 센스앰프는 positive feedback으로 0 또는 VDD까지 증폭한다. 읽는 동안 셀 전하가 변경되므로 **restore**가 필요하며 read 직후 WL을 당장 닫는 모델은 잘못된 설명이 될 수 있다.
- ΔVBL ≈ (Cc/(Cc+Cb))×(Vcell−Vpre). 예시 Cc=1, Cb=9 toy, VDD=1V, pre=0.5V: bit 1은 ΔV=+0.05V, bit 0은 −0.05V. Cc=0이라면 ΔV=0 (감지 불가); Cb가 아주 커지면 신호가 더 작아짐.
- sense offset/노이즈를 무시하지 않은 오개념 교정: 센스앰프의 역할은 '이미 확실한 0/1을 그냥 통과'가 아니라 **미세 차이를 증폭해 안정 상태로 몰아가는 것**. 지나치게 빨리 enable하면 실제 신호보다 offset/noise를 증폭할 위험.
- 두 교차결합 CMOS 인버터의 positive feedback 원리는 SRAM 래치와 연결되는 **개념적 유사성**이 있지만 실제 DRAM sense circuit/supply/enable/array geometry가 SRAM 6T 셀과 똑같다고 주장하지 않는다.

## 2. ACT·READ·RESTORE·PRE와 refresh: 명령 vs 물리 단계
전형적 open-row 동작: PRECHARGED → ACT(row selected, sharing/sense/restore 시작) → READ(column selects bits from row buffer) → 충분한 active time 이후 PRE(닫고 bitline equalize). 
- tRCD는 ACT에서 column command를 허용하기까지 기다려야 하는 타이밍(일반화해서 'complete cell restore time'이라고 하면 틀림). tRAS 최소 active time은 sensing과 충분한 restore 관련, tRP는 PRE 후 다음 ACT 전에 필요한 회복 시간. CL은 READ→데이터 반환의 또 다른 지표. 행이 열려 있느냐(row hit/miss) 따라 latency 달라짐.
- refresh는 보통 row의 **내부 데이터 재생 과정**으로 외부 사용자가 파일을 덮어쓰는 동작이 아님. refresh timing/정책, 온도/retention/rowhammer mitigation와 실제 기기 세부 구현은 규격·제품별 검증 필요. “모든 DRAM은 무조건 64ms” 단정 금지.
- SenseAmp는 row buffer latch 역할도 하므로 하나의 ACT가 행 전체를 선택하고 READ는 그 중 column bits를 꺼낸다; “각 비트마다 ACT 명령 따로” 주장은 부정확.
- 실제 DRAM 연구 주제: PVT(process-voltage-temperature) 변화에 따른 offset·전압 마진, 센스앰프 보정, 저전력, read disturb/retention, refresh overhead, bank parallelism.

## 3. A05 D02 직접 제작 QA 체크
| sceneId | 조작 | 관찰 | 반드시 막을 오개념 |
|---|---|---|---|
| `dram-write` | BL 0/1→WL ON→WL OFF | 셀에 비트 전하 유지(전원 켠 한정) | WL OFF에서도 BL 변경이 셀에 즉시 써진다 |
| `dram-sense-restore` | VDD/2 precharge→WL→signal ΔV→sense-enable→restore | Cc:Cb 1:9 toy ⇒ ±0.05V→이상적인 full swing 복원 | 읽기 직후 셀 내용이 손상되지 않아 restore 불필요 |
| `dram-leak-refresh` | 시간 toy→감지 마진 감소→refresh | 비휘발 EEPROM과 다름 | refresh=SSD garbage collection |
| `dram-row-bank` | 동일/다른 row/bank 요청 스케줄 | row hit와 row conflict·bank 병렬의 구별 | bank 2배 = 항상 대역폭 2배 |
개별 Step 학습 시작에 먼저 학생 예측을 받되 `dram-sense-restore`는 **센스 증폭 전에 ΔV만 보인 상태와 restore 뒤 full swing을 다른 색상/레이블**로 표시. 실패 분기: 음의 ΔV에서 참조선·블라인 방향, signal 마진 부족, restore 생략 등 3개 이상. 이상적 Ccell/Cbitline toy, 칩 실제 용량 fF 수치 단정 금지.

## 4. 3겹 교육 표현
① 학생: “읽기만 했는데 전하가 왜 조금 흐려졌을까요?” ② 직접 조작: Ccell:CBL과 sense-enable 시점 비교, restore 버튼 후 cell 상태 확인. ③ 엔지니어: offset/variation/temperature/refresh and timing constraint를 설명하고 안전마진/성능 trade-off를 선택.

## Checked sources
- https://semiconductor.samsung.com/dram/ · manufacturer overview (high for DRAM family).
- https://semiconductor.samsung.com/kr/support/tools-resources/dictionary/semiconductor-glossary-dram/ · maker educational.
- https://www.amemories.com/dram1t1c.php · secondary engineering educational, ΔV equation / restore (medium; exact physical numbers not quoted).
- https://vectree.io/c/dram-bank-internals-row-activation-sense-amplifier-operation-row-buffer-hits-and-misses-precharge-and-refresh-scheduling · secondary practical explainer, rowbuffer (medium).
- https://www.sciencedirect.com/science/article/pii/S0167926026001549 · Sep 2026 peer-reviewed sense amplifier offset compensation abstract only (high for research existence, **paper body not read**).
**Unresolved:** JEDEC DDR5 electrical/timing spec exact operations, actual sensor margin across PVT & full layout, per-SKU refresh policy, specific RowHammer/TRR behavior. No source claims for exact values.
