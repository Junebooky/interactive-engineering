# A06 research launch · 16 논리게이트→클록→레지스터 → CPU (2026-10-17)
> **RESEARCHING** (A07 교정 대기 중 독립 주제 선택); Lesson14 4 Step은 A07_REVIEW_PENDING, Lesson16 storyboard는 아직 제작 전. 오너 Issue#6 다음 지시 없이 우선순위 결정.
> Why: 01 CMOS NOT 이후 05 SRAM cross-coupled invert와 17 CPU가 이미 존재하지만 NAND/NOR, 조합논리 vs 순차 논리, 클록·setup/hold·metastability를 설명하지 않아 이해 경로에 구멍 발생. 학생은 '컴퓨터는 NOT만으로 왜 계산할까?'부터 자연스럽게 묻는다.

## 5 학생 질문(①1분→②조작)
1. NOT 두 개면 계산기가 될까요? → CMOS NAND/NOR 진리표 조작.
2. 같은 입력을 넣어도 이전 기억에 따라 출력이 달라질까요? → 조합 vs 순차 회로 분리.
3. D latch가 gate enable HIGH인 동안 입력이 바뀌면 Q는 어떻게 될까요? → transparent latch.
4. D flip-flop은 언제 값을 기억하나요? → clock edge sampling. “에지가 없을 때 무조건 고정” 설명은 reset/async logic 예외 안내.
5. CPU에서 신호가 늦게 도착하면 0/1이 틀어질 수 있나요? → setup/hold windows와 timing diagram.

## 5 현업 엔지니어 검증 질문
1. Combinational loop가 있으면 ideal static discipline 위반 가능? latch의 intentional positive feedback과 왜 다른가?
2. t_clk≥t_CQ,max + t_logicPD,max + t_setup + skew/uncertainty rule, 게이트 tPD와 tCD 구별 및 hold path constraints은?
3. D-register metastability window and synchronizer MTBF? 확률적으로 줄이되 **0 위험 보증 불가** (MIT OCW 6.004 Ch6).
4. Clock domain crossing of single-bit level vs asynchronous FIFO multi-bit bus, Gray code/handshake exceptions?
5. Glitch/hazard and combinational output temporarily wrong before settling; dynamic vs static disciplines, power from unnecessary transitions?

## Initial four-scene roadmap (unreviewed, not STORY_READY)
- 16-S01 `logic-nand-nor-truth-table`: two MOS networks vs NAND/NOR Boolean operator, learner predicts before gate truth table reveal.
- 16-S02 `combinational-vs-sequential-memory`: current input + stored bit affects output, compare pure combinational and latch.
- 16-S03 `d-latch-vs-d-flip-flop`: enable HIGH transparency vs rising-edge D sampling, timing waveforms; no arbitrary exact silicon propagation numbers.
- 16-S04 `setup-hold-metastability-clock`: input changes around edge; metastability is possible, not deterministic error output each time. toy t_setup/hold with user changepoint slider.

## Official university evidence checked
- MIT OCW 6.004 Spring2017 CMOS timing https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c3/c3s1/ : tCD is min contamination delay, tPD max settling.
- MIT OCW 6.004 Spring2017 Sequential https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c5/c5s1/ : latch setup/hold dynamic discipline.
- MIT OCW 6.004 Spring2017 FSM/metastability https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c6/c6s1/ : two-stage synchronizer reduces risk exponentially, never absolute zero.
- MIT OCW 6.004 Spring2009 course lecture index https://ocw.mit.edu/courses/6-004-computation-structures-spring-2009/pages/lecture-notes/ : lectures 2–8 gates, sequential logic, metastability, pipelining; exists but full PDF details not independently read.
**Limit:** exact setup/hold/skew/MTBF parameters specific to silicon cell library, temperature, voltage, PVT, implementation, clock tree and physical timing analysis. A05 not to implement until A06 publishes vetted four-step storyboard and A07 EDU review.
