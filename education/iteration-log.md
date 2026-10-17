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
