# A06 Iteration Log & Improvement Backlog
2026-10-17 · Active session 01 | Issue #6 최우선 최신 지시 확인: ACTIVE/CONTENT FIRST/NO A01 LESSON GATE · main 병합/배포 금지.

## Research → Question → Explain → Test → Verify → Rewrite → Handoff → Expand
1. **Research**: Issue #6/#4, A02 PR #5 HEAD 766339b, types/index.ts, MOSFET lesson/model, inverter model, validationEngine 확인. 삼성 DRAM·NAND·패키징, Micron RDIMM/GDDR7/HBM, IBM NAND 저장 관리, NVMe 2.4, 네트워크 및 CXL 논문 탐색. [accuracy-notes](accuracy-notes.md) 출처/날짜 기록.
2. **Question**: ON이면 출력 1? / 왜 채널만 있으면 전류가 안 흐르지? / DRAM을 읽고 왜 복원하지? / GPU 코어를 늘리는데 왜 느리지? / HBM이면 SSD 필요 없나? / enterprise SSD는 큰 SSD일 뿐일까? / NVMe는 SSD인가 프로토콜인가? / 모델은 매 토큰 디스크에서 로드하나?
3. **Explain/Test**: 초보자→고교 입문→공학 수준으로 개념 층위 재서술; 17 Steps마다 관찰과 3오답/3힌트 및 Voice 분리. 자체 검산: Vout≈0.4476V, bandwidth 384/512GB/s. 실제 시뮬레이터 실행·학습자 테스트는 미실시.
4. **Verify/Rewrite**: PR#5의 ‘접지로 단락되어 정확히 0V’ 묘사를 낮은 논리 전압으로 수정한 스토리 제안, subthreshold 모형 한계·DRAM sense restore·GDDR7 PAM3 오개념·SSD DRAM/PLP 예외 추가.
5. **Handoff**: 네 레슨 스토리보드, sceneId별 모델/입력/판정/가정 설명, A05 씬 인계서, A02 현 타입 매핑을 문서 브랜치/PR에 저장. A05 Issue #4 직접 인계. **A01 사전 개별 레슨 승인 대기 없음**.
6. **Expand**: Curriculum Atlas에 제조·패키징·전력·냉각·네트워크/CXL/CPU/NPU/NAND 레슨 후보 작성, 미제작 영역을 gap 문서에 표시.

## improvement-backlog
- [ ] P0 A05 MOSFET 첫 장면 피드백(0.45V, subthreshold, 인버터 ON 설명) 반영
- [ ] P0 A05 DRAM 센스앰프 전하 공유 시각 모델 QA
- [ ] P0 NAND FTL/GC 장면 모델·원리 검증, 전원차단/리텐션 오개념 점검
- [ ] P0 신규 정규 레슨: PN접합·SRAM/CPU 캐시·반도체 제조·패키징·RDIMM 상세·서버 네트워크·전원/냉각·end-to-end 데이터센터
- [ ] P1 A02 예측 전 정답 비노출/빈 rules 자동패스 문제·씬 레지스트리·오답 분기 계약 조정
- [ ] P1 실제 제품별 GDDR7/GDDR6/HBM 성능 및 기업용 SSD DWPD/PLP/QoS 공식 수치 검토
- [ ] P1 CXL 3.x, PCIe 차세대, MRDIMM, ZNS/NVMe-oF 확장
- [ ] P2 사용성/이해도 인터뷰 및 실제 독자 5명 샘플 검증
- [ ] P2 공개 전 콘텐츠 과학·표준·온도/전력·제품 세대별 재검증

**제약:** 4개 우선 레슨 자체 QA 완료는 사용자 파일럿/A05 씬 구현/A02 엔진 통합의 완료를 뜻하지 않는다. 이 세션이 끝난 뒤 자동 반복 연구·작업을 수행한다고 보장하지 않는다(별도 자동화 필요).


## Session 02 · A01 PR #7 최신 지시 수신 및 확장 (2026-10-17)
- A01 PR #7 댓글 [#issuecomment-6231504873](https://github.com/Junebooky/interactive-engineering/pull/7#issuecomment-6231504873)와 A05 [PR #8](https://github.com/Junebooky/interactive-engineering/pull/8) head fd9d921 확인.
- A05의 `A05MosfetSceneLab.tsx`, `A05SceneVisual.tsx`, `scenePhysics.ts`, scene spec/tests/css를 A06 M01과 교차 읽기. [source-level QA 문서](a05-m01-cross-qa.md) 작성: 회로 핵심 적합, VGS=0.7 경계 시각모순·subthreshold 설명 조건 개선 P1, 초기 0V 관찰 이벤트·SRAM 연결 P2. 실제 브라우저 QA 미실행.
- PR #7 Codex 3건 반영: G03-S01 pipeline overlap 가정/직렬 반례, N04-S03 PLP/DRAM/ECC 선택별 오답 문구, N04-S04 read command와 read payload 방향 분리.
- 누락 선행 질문 "NOT 게이트가 어째서 기억이 되지?" 조사 → [05 SRAM/CPU cache](lessons/05-sram-cpu-cache.md) 4 Steps 신설(6T latch/WL/BLB/cache locality/AI placement); Hamburg·Arm 자료 확인.
- 누락 연결 질문 "HBM은 어디에 붙이며 왜 생산/열이 어려울까?" 조사 → [06 제조·chiplet/TSV/2.5D·thermal](lessons/06-hbm-chiplet-packaging.md) 4 Steps 신설; ASML·TSMC·Micron 2026-10-17 근거 교차.
- **이 세션 A06 범위:** 교육 명세 6개 25 Step 제공, 2개 신규 레슨 A05 직접 인계 준비. 앱 구현/시각 브라우저 실행은 미실시.
- 남은 최우선 콘텐츠: PN/물질/전력 반도체 입문, DRAM의 실제 sensing 파형, LPDDR/RDIMM 상세, NIC/RDMA/광학, 전력/VRM/냉각, AI DC end-to-end 완결편. 자동/무인 연구 진행을 약속하지 않음.


## Research Round 03 · 2026-10-17 · senior-depth / novice-level (ACTIVE SESSION)
1. **Latest Issue #6** 시니어 심화 지시 확인. [질문뱅크 12 student +12 senior](research-notes/round-03-question-bank.md) 작성, 학생 WHY vs 현업 실패/측정 기준 분리.
2. **공식·논문 triangulation:** DDR5/RDIMM/MRDIMM/LPDDR5X SOCAMM2(2026 JEDEC 공개 유통자료)/CXL **4.0**(공식 2025-11), NVIDIA RDMA/RoCE/NCCL, IBM Flash WAF/GC, NVIDIA roofline Jul2026, Uptime PUE 2026, 삼성 DRAM, 감지앰프 기술/논문 초록. Source URL/날짜/보증·마케팅 경계는 5개 deep-dives.
3. **검산:** 64×6400/8=51.2GB/s; CXL GT/s vs GB/s; AllReduce factor N=4→1.5, 1GiB/16GiB/s×1.5=0.09375s toy; GC 1.6 WAF; capacitor 0.8J→0.1s ideal; DDR tier 11/25 units; Roofline 4TFLOP/s/100GB/s=40FLOP/B; PUE1.4 with IT1MW=1.4MW facility. Actual product performance not measured.
4. **Story rewrite:** [07](lessons/07-server-memory-tiers.md) 4 Step, [08](lessons/08-ai-fabric-rdma-optics.md) 4 Step, [09](lessons/09-essd-reliability.md) 4 Step, [10](lessons/10-ai-datacenter-end-to-end.md) 4 Step; each ① 초보 1분 ② 조작계산 ③ senior failure/trade-off; 각 오답 3종·힌트 3단/한국어 화면·Voice. **합계 10레슨·41 Step 문서 명세**.
5. **A05/A02 cross QA:** PR #8 최신 M01 A05에서 문턱/Voice/nextHook 수정 및 Chromium 자동화 증거 기록 확인(직접 A06 실행 아님); A02 PR #9의 numeric toggle/0.98kΩ correction source 확인; DRAM PR #10 source QA: 1T1C, charge share±0.05, bank toy 전반 합치, bit0 선택에도 0.55 고정 표시되는 copy bug P2, sense amp/restore 버튼의 물리적 시간 분리 비유 P2, [A05 D02 QA](a05-d02-cross-qa.md).
6. **Direct handoff**: A05 Issue #4/PR #10에 신규 SceneSpec과 D02 피드백 공유. 관련 링크/검증 상태 기록. A05/A02 앱 소스 직접 수정 안 함, main 병합·배포 금지.
7. **Unresolved / next loop:** RowHammer/TRR·GAA/CFET, SOCAMM2/JEDEC 원문 접근, CXL 실측 latency/platform support, eSSD PLP ACK/flush per-SKU, GPU memory cache policies, optical CPO/OIF/FEC, site PUE/WUE/CUE, device QA·학생 이해도 실험. 세션 종료 후 자동 연구 진행을 보장하지 않음.


## Round 04 · autonomous comprehensive curriculum and next lesson selection · 2026-10-17
- **Owner Issue #6 top-level updated**: 기존 10/41 seed 제한 폐지; 전체 semiconductor→AI 시스템 unit/chapter/topic inventory + unique IDs/DAG/분기/Step 학습순서/3-depth + production state queue를 스스로 설계. [Atlas v1](curriculum-atlas-v1.md): 115 unique topic IDs across 11 domains, no missing dep, no DAG cycle. 01~32 numbered core/extensions mapped; 학습은 문서번호가 아닌 12→11→14→01→... 순.
- **Question priority rationale**: first missing prerequisite = 아무것도 모르는 학생의 전하/전압/RC & 도핑/PN의 이해. 선행 MOSFET=전압만 올리면 무조건 전류→메모리→AI로 점프하면 오개념이 커지므로 **11 도핑/PN 5 Step** 독립 선택, MIT OCW PN lecture pp4/5/7와 OpenStax 9.6/9.7 교차 확인. **12 전기/RC 4 Step**도 바로 후속 제작해 11의 기초 선수 블로커 낮춤.
- **Numerical validations:** VT=25.852mV at300K, NA=ND=1e16cm^-3 ni=1e10 toy => Vbi≈0.7143V and W equilibrium0.42982µm / forward0.2V 0.36472µm / reverse1V 0.66587µm. Shockley Is1pA/n2=I(0.3)0.330nA/I(0.4)2.289nA. Circuit R1=R2=1kΩ: series2.5mA, parallel10mA at5V; τ1kΩ×10µF=10ms, 63.2%; 50mW×10s=0.5J; cap 10µF 5V=125µJ. **모두 교육용 toy 수치**, actual device/SKU 측정 없음.
- **Lessons** [11](lessons/11-doping-pn-foundations.md) + [12](lessons/12-electricity-rc-foundations.md) and [senior notes](deep-dives/) with misconception-specific/3-step hints/Korean display vs speech, why→prediction→action→observation→physics→next and senior exceptions. Aggregate 12 lessons/50 Step docs, 9 newly storyboarded scenes *A05 UI not coded*. D02 scene QA unchanged/unresolved pending A05 response.
- **Master queue** [production-backlog.md](production-backlog.md) created: RESEARCHING→STORY_READY→A05_IN_PROGRESS→SCENE_READY→A02_INTEGRATING→APP_QA→COMPLETE, state/evidence per existing 10 + 11/12 and priority for future.
- **Next actively selected without new order:** 14 MOS capacitor accumulation/depletion/inversion [RESEARCHING with MIT 6.012 & Georgia Tech reference](research-notes/14-mos-capacitor-research.md). It is **not** STORY_READY/complete yet. Then 16/29/31/32.
- Research scope extends EDA, analog/RF, sensor/LED/silicon photonics, UCIe3, PCIe7, GAA/CFET, AI/SSD ECC+security, VRM/GaN/SiC, rack CDU/PUE to preserve broad completeness. Licensed standards, real product datasheets and actual quant performance await separate review. **No main merge/deploy, no automation after session ends claimed.**

## Round 05 · A07 직접 QA 협업 / 신규 MOS 교육 초안·다음 탐구(2026-10-17)
- 최신 Issue #6 A07 direct→A06 reporting protocol confirmed. A07 [PR#14 Round02](https://github.com/Junebooky/interactive-engineering/blob/docs/a07-edu-qa-round-01/education/round-02-foundations-g03-audit.md) checked sources, critique: 11-S02–S05/12-S01 & minor intro answers prematurely revealed, topic/lesson short ID collision, P01/P08 prerequisites mismap, G03 S02 pre-matched site/card and G03 S03 unrelated numeric distractors.
- **A06 corrections applied on canonical branch:** 11 blob `b61c9a49`, 12 blob `e11f51ad` neutral before/post observation Voice+UI, 12-S01 first 40s electron charge prerequisite, original after explanations gated. G03 blob `af0b7e75` source now independent family/site selection and 2 same-domain GB/s prediction questions; [A05 direct implementation request #15](https://github.com/Junebooky/interactive-engineering/pull/15#issuecomment-6233000882). Atlas P01/P08 mapping/namespace corrected in [crosswalk](id-namespace-crosswalk.md), [production backlog](production-backlog.md) A05 #10/#13/#15 standalone vs A02 app integration distinct.
- **New self-authored 14 MOS capacitor** [lesson 4 Steps](lessons/14-mos-capacitor-field-inversion.md) + [MIT OCW science/engineering deep dive](deep-dives/14-mos-capacitor-physics.md). Formula/unit/counterexample 1D `Cox′5nm=0.6906266µF/cm²`, `V_FB=0` special, derived `Vt≈0.785V`; 4 new scenes with pre/post neutral Voice, misconception3/hint3, threshold physical nuance. **A07 independent QA requested** [Issue#6 link](https://github.com/Junebooky/interactive-engineering/issues/6#issuecomment-6232987722); **no EDU_QA_PASS** and **no A05 finished-scene handoff yet**.
- **Newest A02 D02 head corrected classification:** A02 [#11 e0dfe83](https://github.com/Junebooky/interactive-engineering/pull/11) adds domain adapter, reports actual app Chromium QA; previous [A07 R2](https://github.com/Junebooky/interactive-engineering/pull/14) had inspected earlier head. A06 source review found possible bypass phase restored without sensed, refresh before leak, requested negative-case tests on PR#11. Source hypotheses vs confirmed browser failures explicitly separated. **No main merge/deploy.**
- Active queue now **13 lessons/54 storyboard Steps** *includes 14 A07_REVIEW_PENDING*, not 54 EDU_QA_PASS or 54 rendered scenes. **Next 16 logic→latch/flip-flop→clock [RESEARCHING](research-notes/16-logic-clock-research.md)** with MIT 6.004 official sources; no instructions sought. A07 can review whenever its separate agent session runs; GitHub comments cannot start other agents automatically.
