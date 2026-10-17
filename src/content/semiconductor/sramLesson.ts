import type { Lesson } from '../../types';

export const sramLesson: Lesson = {
  id: 'lesson-sram',
  courseId: 'course-semiconductor',
  slug: 'sram-cpu-cache',
  title: 'SRAM 6T와 CPU 캐시: 전하 대신 래치로 초고속 기억하기',
  subtitle: '리프레시 없는 6T 정적 메모리 셀에서 CPU 캐시 계층과 GPU 데이터 지역성까지',
  category: 'semiconductor',
  description: '두 개의 인버터가 서로를 지탱하는 6T SRAM 셀의 정적 래치 구조를 탐구하고, CPU 캐시의 LRU 적중 원리와 대규모 AI 연산에서의 GPU 데이터 지역성을 직접 조작해 봅니다.',
  prerequisites: ['lesson-mosfet', 'lesson-dram'],
  steps: [
    // Step 0: Concept Intro
    {
      id: 'step-sram-s0-intro',
      title: '0단계: 전원이 켜져 있는 한 기억을 붙잡는 정적 메모리 (SRAM)',
      stepType: 'CONCEPT',
      storyLead: 'DRAM이 전하를 담은 작은 컵이라면, SRAM은 두 인버터가 서로를 꽉 붙잡고 있는 단단한 회로입니다.',
      prompt: '커패시터 누설도 없고 주기적 리프레시도 필요 없는 초고속 정적 메모리(SRAM)의 4단계 동작 원리를 탐구해 보세요.',
      detailExplanation: 'SRAM(Static Random Access Memory)은 전하 축적 방식이 아닌 교차 결합 인버터(Cross-coupled Inverter)의 쌍안정(Bistable) 상태를 이용합니다.\n• 장점: 리프레시 사이클이 없어 반응 속도가 압도적으로 빠르며 CPU 연산 장치 바로 옆에 배치할 수 있습니다.\n• 단점: 1비트 저장에 트랜지스터가 6개(6T)나 필요하여 면적이 크고 고비용입니다.\n• 전원 의존성: DRAM과 마찬가지로 전원이 차단되면 저장된 데이터가 즉시 사라지는 휘발성(Volatile) 메모리입니다.',
      whyExplanation: 'CPU는 1초에 수십억 번 연산하지만, 메인 메모리(DRAM)까지 다녀오는 데는 수백 사이클의 긴 대기 시간이 걸립니다. 이 지연을 숨기기 위해 CPU 칩 내부에 가장 빠르고 비싼 SRAM을 캐시(L1, L2, L3)로 탑재합니다.',
      hints: [
        {
          level: 1,
          title: '정적(Static)의 의미',
          description: '전원이 공급되는 동안에는 전하가 새어나가지 않아 다시 채워줄 필요가 없어요.',
        },
      ],
    },

    // Step 1: 05-S01 Cross-Coupled Inverters
    {
      id: 'step-sram-s1-cross-coupled',
      title: '1단계: 마주 보는 두 인버터와 휘발성 (05-S01)',
      stepType: 'MANIPULATE',
      storyLead: '두 개의 CMOS 인버터가 서로의 출력을 상대방의 입력으로 되먹이고 있습니다. 이 고리는 어떻게 상태를 유지할까요?',
      prompt: '전원과 피드백 연결 상태에서 Q의 논리값을 관찰하고, 전원이 꺼졌을 때 데이터가 어떻게 되는지 확인하세요.',
      detailExplanation: '두 CMOS 인버터의 입출력을 서로 교차 연결하면(Cross-coupled Latch), 한쪽이 1이면 반대쪽은 0이 되고, 그 0이 다시 원래 인버터의 입력을 1로 유지시켜 줍니다.\n• 두 개의 안정 상태: (Q=1, Q̅=0) 또는 (Q=0, Q̅=1)의 두 상보적 상태만 안정적으로 존재합니다.\n• 전원(VDD) 의존성: 이 피드백 루프는 능동 소자에 전원이 공급되는 동안에만 작동합니다. 전원이 차단되면 즉시 두 상태 모두 소멸하는 휘발성 특성을 갖습니다.\n※ 물리적 보존 시간(Retention Time)이 보장되는 비휘발성 소자가 아닙니다.',
      whyExplanation: '되먹임 고리는 외부 잡음이 들어와도 본래 상태로 되돌리려는 복원력을 가집니다. 이것이 커패시터 전하 누설로 전압이 서서히 떨어지는 DRAM과의 본질적인 물리적 차이입니다.',
      simulatorType: 'sram-cross-coupled-inverters',
      physicsAssumptions: '이상적 CMOS 쌍안정 래치 · 비정량적 정성 모형 (전원 차단 시 즉시 ? 표기)',
      sourceRefs: ['Rabaey et al., Digital Integrated Circuits: A Design Perspective', 'A06 05 SRAM Story'],
      initialParams: {
        q: 1,
        feedback: true,
        supply: true,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 전원을 켜 둔 동안 두 인버터 고리는 어떤 상태를 유지할까요?',
          type: 'radioGroup',
          options: [
            { label: '서로 반대되는 논리값(Q와 Q̅)을 맞물려 안정적으로 유지해요.', value: 'keep-opposite' },
            { label: '전원이 켜져 있어도 1초마다 0과 1이 저절로 뒤바뀌어요.', value: 'flip-spontaneous', misconception: '되먹임 고리가 닫혀 있으면 외란이 없는 한 본래 상태를 단단히 유지합니다.' },
            { label: '전원을 완전히 꺼도 커패시터처럼 영구히 값을 보존해요.', value: 'nonvolatile-stay', misconception: 'SRAM은 능동 인버터의 전원에 의존하므로 전원이 꺼지면 즉시 휘발합니다.' },
          ],
        },
        {
          id: 'q',
          label: '논리 상태 Q 설정',
          type: 'toggle',
          options: [
            { label: 'Q = 0 (LOW)', value: 0 },
            { label: 'Q = 1 (HIGH)', value: 1 },
          ],
        },
        {
          id: 'feedback',
          label: '상호 되먹임 (Feedback Loop)',
          type: 'toggle',
          options: [
            { label: '되먹임 차단 (OFF)', value: false },
            { label: '되먹임 연결 (ON)', value: true },
          ],
        },
        {
          id: 'supply',
          label: '전원 공급 (VDD Power)',
          type: 'toggle',
          options: [
            { label: '전원 차단 (OFF)', value: false },
            { label: '전원 인가 (ON)', value: true },
          ],
        },
        {
          id: 'answer',
          label: '개념 확인: 교차 결합 인버터의 기억 보존 원리를 가장 바르게 설명한 것은?',
          type: 'radioGroup',
          options: [
            { label: '두 인버터가 상보적인 값을 지탱하지만, 전원이 꺼지면 상태가 사라지는 휘발성 메모리이다.', value: 'volatile-feedback' },
            { label: 'SRAM은 플래시 메모리처럼 전원이 꺼져도 물리적으로 영구 보존된다.', value: 'nonvolatile', misconception: '플래시 메모리와 달리 SRAM은 전원이 끊기면 즉시 논리 상태를 잃습니다.' },
            { label: '되먹임 선이 끊어져도 개별 인버터 혼자서 이전 전압을 영구히 유지한다.', value: 'no-feedback', misconception: '피드백이 없으면 외부 입력이 없을 때 상태를 유지할 수 없습니다.' },
          ],
        },
      ],
      rules: [
        {
          label: 'Q=0 상태 관찰',
          targetKey: 'history',
          operator: 'contains',
          expected: 'q0',
          feedbackIfFail: '전원과 피드백을 켠 상태에서 Q를 0으로 설정해 보세요.',
        },
        {
          label: 'Q=1 상태 관찰',
          targetKey: 'history',
          operator: 'contains',
          expected: 'q1',
          feedbackIfFail: '전원과 피드백을 켠 상태에서 Q를 1로 설정해 보세요.',
        },
        {
          label: '전원 OFF 시 데이터 휘발 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'volatile',
          feedbackIfFail: '전원을 끄면 Q/Q̅를 유지할 수 없는 휘발성을 확인하세요.',
        },
        {
          label: '상보 피드백과 휘발성 원리 이해',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'volatile-feedback',
          feedbackIfFail: '두 인버터가 상보 상태를 지탱하며 전원이 꺼지면 휘발하는 특성을 선택하세요.',
        },
      ],
      hints: [
        { level: 1, title: '상보적 관계', description: 'Q가 1이면 반대편 Q̅는 0이 되어 서로를 떠받쳐 줍니다.' },
        { level: 2, title: '전원의 중요성', description: '인버터는 증폭기이므로 외부 전원 공급이 필수적이에요.' },
        { level: 3, title: '휘발성 메모리', description: '전원이 끊기면 저장된 모든 논리 상태가 물거품처럼 사라집니다.' },
      ],
      successMessage: '정답입니다! 두 인버터의 상호 피드백으로 형성되는 정적 쌍안정 상태와 전원 의존적 휘발성을 파악했습니다.',
    },

    // Step 2: 05-S02 6T SRAM Access
    {
      id: 'step-sram-s2-6t-access',
      title: '2단계: 6T 셀과 워드라인 격리 (05-S02)',
      stepType: 'MANIPULATE',
      storyLead: '내부 래치(4T)에 외부 비트라인을 연결하기 위해 접근 트랜지스터 2개를 추가했습니다. 총 6개의 트랜지스터(6T)가 작동합니다.',
      prompt: '워드라인(WL)을 닫은 상태에서 비트라인을 바꿔보고, WL을 열어 쓰기와 읽기 동작을 수행해 보세요.',
      detailExplanation: '표준 6T SRAM 셀 구조:\n• 래치(4T): 2개의 풀업 pMOS와 2개의 풀다운 nMOS가 형성하는 인버터 쌍\n• 접근 트랜지스터(2T): 워드라인(WL)에 의해 제어되는 2개의 접근 nMOS 스위치\n• 워드라인(WL=0): 셀이 비트라인과 완전히 차단(격리)되어 내부 래치 상태를 안전하게 보존합니다.\n• 워드라인(WL=1): 비트라인(BL, BLB)과 연결되어 새로운 값을 쓰거나(Write) 저장된 전압을 감지(Read)합니다.\n※ 읽기 시에는 비트라인의 미세한 전압 변화가 셀 내부 노드를 일시적으로 흔드는 읽기 교란(Read Disturb) 가능성이 존재합니다.',
      whyExplanation: 'DRAM은 1T1C로 읽을 때 커패시터 전하가 완전히 파괴되지만, SRAM은 래치가 계속 전류를 공급하므로 복원(Restore) 없이 즉시 다음 읽기가 가능합니다.',
      simulatorType: 'sram-6t-access',
      physicsAssumptions: '이상적 6T 셀 구동비 모델 · 읽기 교란 가능성 정성적 표기 (노이즈 마진 정량 단정 배제)',
      sourceRefs: ['Weste & Harris, CMOS VLSI Design', 'A06 05 SRAM Story'],
      initialParams: {
        wl: 0,
        bl: 1,
        mode: 'write',
        q: 1,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 워드라인(WL)이 꺼진(0) 상태에서 비트라인(BL) 전압을 바꾸면 셀의 Q는 어떻게 될까요?',
          type: 'radioGroup',
          options: [
            { label: '접근 트랜지스터가 닫혀 있어 외부 BL이 바뀌어도 셀 데이터는 안전하게 격리 보존돼요.', value: 'isolated-wl-off' },
            { label: 'WL이 꺼져 있어도 비트라인이 강하면 무조건 셀 값이 덮어써져요.', value: 'override-wl', misconception: '접근 트랜지스터가 꺼져 있으면 비트라인 전압이 셀 내부로 들어가지 못합니다.' },
            { label: 'WL이 꺼지면 인버터 전원도 함께 꺼져 데이터가 즉시 0이 돼요.', value: 'power-loss', misconception: 'WL은 통로 스위치일 뿐이며 내부 래치 전원선과는 별개입니다.' },
          ],
        },
        {
          id: 'wl',
          label: '워드라인 (WL - 접근 제어)',
          type: 'toggle',
          options: [
            { label: '닫힘 (WL = 0, 격리)', value: 0 },
            { label: '열림 (WL = 1, 접근)', value: 1 },
          ],
        },
        {
          id: 'bl',
          label: '비트라인 입력 (BL / BLB)',
          type: 'toggle',
          options: [
            { label: 'BL=0 / BLB=1', value: 0 },
            { label: 'BL=1 / BLB=0', value: 1 },
          ],
        },
        {
          id: 'mode',
          label: '접근 모드 선택',
          type: 'radioGroup',
          options: [
            { label: '쓰기 모드 (Write)', value: 'write' },
            { label: '읽기 모드 (Read)', value: 'read' },
          ],
        },
        {
          id: 'answer',
          label: '개념 확인: 6T SRAM 셀의 구조적 특징과 워드라인의 역할을 고르세요',
          type: 'radioGroup',
          options: [
            { label: '4개의 래치 트랜지스터와 2개의 접근 nMOS로 구성되며, WL=0일 때 셀을 격리하고 읽기 시 미세 교란 가능성이 있다.', value: 'four-plus-two' },
            { label: '6T SRAM은 커패시터 6개로 1비트를 저장하여 리프레시가 필요하다.', value: 'six-capacitors', misconception: 'SRAM에는 커패시터가 없으며 6개의 MOSFET으로만 구성됩니다.' },
            { label: '워드라인이 0이어도 비트라인 전압만 올리면 언제나 셀이 즉시 덮어써진다.', value: 'override-wl', misconception: 'WL=0이면 트랜지스터가 꺼져 외부 전압이 침투할 수 없습니다.' },
          ],
        },
      ],
      rules: [
        {
          label: 'WL OFF 격리 상태 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'isolated',
          feedbackIfFail: 'WL을 0으로 닫은 상태에서 비트라인을 조작해 전하 격리를 확인하세요.',
        },
        {
          label: 'WL ON 쓰기 동작 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'wrote',
          feedbackIfFail: 'WL을 1로 열고 쓰기 모드에서 새 비트를 입력해 보세요.',
        },
        {
          label: 'WL ON 읽기 동작 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'read',
          feedbackIfFail: '읽기 모드로 전환하여 비트라인을 통한 판독 동작을 확인하세요.',
        },
        {
          label: '6T 셀 구성과 격리 원리 이해',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'four-plus-two',
          feedbackIfFail: '4T 인버터 래치 + 2T 접근 nMOS 구조와 WL 격리 역할을 선택하세요.',
        },
      ],
      hints: [
        { level: 1, title: '문지기 스위치', description: '워드라인은 외부 비트라인이 내부 방으로 들어오는 문을 여닫는 스위치예요.' },
        { level: 2, title: '4 + 2의 의미', description: '내부 기억을 위한 인버터 2개(4T)와 양쪽 출입문 2개(2T)로 이루어져 있어요.' },
        { level: 3, title: '읽기 교란', description: '읽기 위해 문을 열었을 때 비트라인의 전압이 내부 값을 살짝 흔들 수 있습니다.' },
      ],
      successMessage: '정답입니다! 4개의 인버터 트랜지스터와 2개의 접근 트랜지스터로 완성되는 6T 셀의 쓰기·읽기·격리 메커니즘을 파악했습니다.',
    },

    // Step 3: 05-S03 CPU Cache vs DRAM
    {
      id: 'step-sram-s3-cpu-cache',
      title: '3단계: CPU 캐시 용량과 LRU 지연 시간 (05-S03)',
      stepType: 'MANIPULATE',
      storyLead: 'CPU가 같은 숫자를 여러 번 계산하는데 매번 먼 DRAM까지 다녀오면 시간이 얼마나 낭비될까요?',
      prompt: '1라인과 2라인 캐시에서 요청열(A,A,B,A,C)을 실행하여 캐시 적중과 총 처리 지연 시간을 비교하세요.',
      detailExplanation: '캐시 메모리(Cache Memory)와 지역성 원리:\n• 시간 지역성(Temporal Locality): 최근에 접근한 데이터는 조만간 다시 접근될 가능성이 높습니다.\n• LRU(Least Recently Used) 교체 정책: 캐시가 가득 찼을 때 가장 오랫동안 사용되지 않은 데이터를 밀어내고 새 데이터를 담습니다.\n• 지연 시간 모델 (정규화 toy 시간 단위):\n  - 캐시 적중(Hit): 1 toy 시간 단위 (초고속 SRAM 바로 읽기)\n  - 캐시 미스(Miss): 10 toy 시간 단위 (먼 DRAM까지 다녀오는 큰 비용)\n• 요청열 A, A, B, A, C 실행 결과:\n  - 1라인 캐시: A(미스,10) + A(히트,1) + B(미스,10,A방출) + A(미스,10,B방출) + C(미스,10) = 41 toy units\n  - 2라인 캐시: A(미스,10) + A(히트,1) + B(미스,10) + A(히트,1) + C(미스,10,B방출) = 32 toy units\n※ 용량이 2배(1라인→2라인)가 되어도 지연 시간이 정확히 절반이 되는 것은 아니며 워크로드에 따라 달라집니다.',
      whyExplanation: '캐시는 한정된 크기로 최대의 성능을 내기 위한 경제학적 타협입니다. 2배 큰 캐시는 더 많은 칩 면적과 전력을 소모하므로 시스템 엔지니어는 적절한 계층(L1/L2/L3) 크기를 설계해야 합니다.',
      simulatorType: 'cpu-cache-vs-dram',
      physicsAssumptions: 'LRU 교체 알고리즘 · 히트=1, 미스=10 정규화 toy 시간 단위 (실제 ns 단위 아님)',
      sourceRefs: ['Hennessy & Patterson, Computer Architecture: A Quantitative Approach', 'Arm Cache Learning Path'],
      initialParams: {
        cacheLines: 1,
        cacheRan: false,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 작은 고속 캐시 메모리가 있을 때 반복 접근 데이터의 처리 시간은 어떻게 변할까요?',
          type: 'radioGroup',
          options: [
            { label: '다시 쓰이는 데이터가 캐시에 남아 있으면 먼 DRAM에 가지 않고 즉시 히트되어 시간을 크게 아껴요.', value: 'cache-hit-saves' },
            { label: '캐시가 아무리 커도 모든 요청은 반드시 동일한 DRAM 지연을 겪어야 해요.', value: 'always-miss', misconception: '캐시 적중 시에는 DRAM에 갈 필요가 없어 지연 시간이 대폭 단축됩니다.' },
            { label: '캐시 용량을 2배로 늘리면 어떤 요청 순서든 처리 속도가 무조건 정확히 2배 빨라져요.', value: 'linear-2x', misconception: '캐시 크기가 2배라고 성능이 무조건 2배가 되는 것은 아니며 워크로드 패턴에 좌우됩니다.' },
          ],
        },
        {
          id: 'cacheLines',
          label: '캐시 용량 (라인 수 설정)',
          type: 'radioGroup',
          options: [
            { label: '1라인 캐시 (최소 용량)', value: 1 },
            { label: '2라인 캐시 (2배 용량)', value: 2 },
          ],
        },
        {
          id: 'cacheRun',
          label: '요청열 (A, A, B, A, C) LRU 시뮬레이션 실행',
          type: 'toggle',
          options: [
            { label: '대기 중', value: false },
            { label: '시뮬레이션 실행 완료', value: true },
          ],
        },
        {
          id: 'answer',
          label: '개념 확인: 캐시 동작 원리와 2라인 확장의 공학적 의미를 고르세요',
          type: 'radioGroup',
          options: [
            { label: '캐시는 시간/공간 지역성을 활용하여 반복 접근 지연을 줄이며, 2배 용량이 무조건 2배 속도를 보장하지는 않는다.', value: 'reuse-not-twice' },
            { label: '캐시 용량이 2배가 되면 어떤 프로그램이든 실행 시간이 무조건 정확히 절반으로 줄어든다.', value: 'always-double', misconception: '캐시 크기 확장은 히트율을 올리지만 모든 프로그램에서 선형적으로 2배 빨라지지는 않습니다.' },
            { label: '캐시 적중(Hit)과 DRAM 미스(Miss)의 지연 시간은 동일하다.', value: 'equal-latency', misconception: 'SRAM 캐시 적중(1)과 DRAM 미스(10)는 지연 시간 차이가 큽니다.' },
          ],
        },
      ],
      rules: [
        {
          label: '1라인 캐시 실행 (41 toy units)',
          targetKey: 'history',
          operator: 'contains',
          expected: 'one',
          feedbackIfFail: '1라인 캐시 상태에서 시뮬레이션을 실행하여 41 toy 단위를 관찰하세요.',
        },
        {
          label: '2라인 캐시 실행 (32 toy units)',
          targetKey: 'history',
          operator: 'contains',
          expected: 'two',
          feedbackIfFail: '2라인 캐시로 전환 후 시뮬레이션을 실행하여 32 toy 단위를 관찰하세요.',
        },
        {
          label: '캐시 지역성과 비선형 속도 향상 이해',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'reuse-not-twice',
          feedbackIfFail: '데이터 재사용을 통한 지연 감소와 2배 용량≠무조건 2배 속도 원리를 선택하세요.',
        },
      ],
      hints: [
        { level: 1, title: '다시 찾기 (Hit)', description: 'A가 방금 쓰였는데 또 필요하다면 캐시에서 바로 가져올 수 있어요.' },
        { level: 2, title: '누가 밀려나는가', description: '1라인 캐시에서는 B가 들어오는 순간 이전 A가 쫓겨나고 맙니다.' },
        { level: 3, title: '비용의 합산', description: '미스는 10, 히트는 1입니다. 41 단위와 32 단위의 차이를 비교해 보세요.' },
      ],
      successMessage: '정답입니다! 캐시 적중(Hit)을 통한 지연 절감과 1라인(41) vs 2라인(32) LRU 교체의 핵심 메커니즘을 파악했습니다.',
    },

    // Step 4: 05-S04 Data Locality
    {
      id: 'step-sram-s4-data-locality',
      title: '4단계: GPU 가중치 상주와 데이터 지역성 (05-S04)',
      stepType: 'CHECK',
      storyLead: '수십 기가바이트의 거대한 AI 모델을 계산할 때, 모델 가중치를 매번 SSD나 메인 DDR에서 다시 읽어와야 할까요?',
      prompt: '모델 가중치를 GPU VRAM에 상주시켰을 때와 매번 로드할 때를 비교하고, 새 입력 데이터의 이동을 확인하세요.',
      detailExplanation: 'AI 추론과 데이터 지역성(Data Locality):\n• 모델 가중치(Weights): 수십억 개의 매개변수는 여러 번의 사용자 질문에 걸쳐 변하지 않습니다. 이 가중치를 GPU 전용 고속 메모리(HBM/GDDR)에 한 번 상주(Resident)시켜 두면, 매 토큰 생성 시 호스트(SSD/DDR)에서 다시 읽어오는 병목을 제거할 수 있습니다.\n• 입력/활성값(Inputs & Activations): 모델이 GPU에 상주해 있어도, 사용자가 입력한 새로운 질문(프롬프트)과 계산 중간의 활성값은 매번 호스트에서 GPU로 계속 전송되어야 합니다.\n※ Unified Memory Architecture(통합 메모리) 등 CPU와 GPU가 물리 메모리를 공유하는 특수 구조도 존재하지만, 일반 가속기 환경에서는 데이터 이동 비용을 최소화하는 계층 배치가 성능의 핵심입니다.',
      whyExplanation: '계산기(ALU)가 아무리 빨라도 데이터를 공급하는 버스(Bus)가 좁으면 연산기는 놀게 됩니다(Memory Wall). 다음 질문: 그렇다면 GPU 전용 메모리인 GDDR과 HBM은 일반 DDR과 무엇이 다를까요? → G03 GPU 메모리 벽과 고대역폭 메모리',
      simulatorType: 'cpu-to-gpu-data-locality',
      physicsAssumptions: 'GPU 분리 메모리 모델 · 통합 메모리(UMA) 예외 존재 명시',
      sourceRefs: ['Samsung HBM Technology Whitepaper', 'A06 05 SRAM Story'],
      initialParams: {
        resident: false,
        inputCount: 1,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: AI 모델 가중치가 GPU VRAM에 이미 상주해 있다면, 추론 시 호스트 메모리에서 모델을 다시 읽어올까요?',
          type: 'radioGroup',
          options: [
            { label: '가중치는 GPU 메모리에서 재사용하므로 다시 읽지 않지만, 새로운 입력 데이터는 계속 계산기로 이동해야 해요.', value: 'resident-reuse' },
            { label: '가중치가 상주해 있으면 사용자 입력과 출력 데이터조차 전혀 이동할 필요가 없어요.', value: 'no-input-move', misconception: '모델이 상주하더라도 새로운 사용자 입력 데이터는 당연히 호스트에서 GPU로 전달되어야 합니다.' },
            { label: 'GPU에 가중치가 있어도 매 토큰마다 무조건 SSD에서 전체 모델을 다시 읽어와야 해요.', value: 'always-reload', misconception: '가중치를 GPU에 상주시키는 이유가 바로 느린 SSD 재읽기를 방지하기 위함입니다.' },
          ],
        },
        {
          id: 'resident',
          label: 'AI 모델 가중치 GPU 상주 여부',
          type: 'toggle',
          options: [
            { label: '미상주 (매번 SSD/DDR에서 로드)', value: false },
            { label: '상주 완료 (GPU VRAM에 보존)', value: true },
          ],
        },
        {
          id: 'sendInput',
          label: '새 입력 데이터 전송 (새 추론 실행)',
          type: 'toggle',
          options: [
            { label: '입력 대기 중', value: false },
            { label: '새 입력 토큰 전송 완료', value: true },
          ],
        },
        {
          id: 'answer',
          label: '개념 확인: 가중치 상주와 데이터 지역성의 진정한 공학적 의미를 고르세요',
          type: 'radioGroup',
          options: [
            { label: '모델 가중치는 GPU 메모리에 상주시켜 반복 전송을 없애지만, 새 입력 및 활성값은 계속 이동해야 한다.', value: 'weights-vs-input' },
            { label: '모델이 상주하면 새로운 사용자 입력 데이터조차 전혀 이동하지 않는다.', value: 'no-input-move', misconception: '새로운 질문과 입력값은 계속해서 호스트로부터 공급되어야 합니다.' },
            { label: 'CPU SRAM 캐시와 GPU HBM/GDDR은 완전히 동일한 용도와 구조이다.', value: 'same-memory', misconception: 'SRAM은 6T 래치이고 HBM/GDDR은 커패시터 기반 DRAM으로 구조와 용도가 다릅니다.' },
          ],
        },
      ],
      rules: [
        {
          label: '모델 미상주 시 전송 경로 관찰',
          targetKey: 'history',
          operator: 'contains',
          expected: 'not-resident',
          feedbackIfFail: '미상주 상태를 확인하여 호스트에서 가중치를 로드하는 경로를 관찰하세요.',
        },
        {
          label: '모델 상주 시 GPU 재사용 관찰',
          targetKey: 'history',
          operator: 'contains',
          expected: 'resident',
          feedbackIfFail: '모델 상주를 켜서 GPU VRAM에서 가중치가 재사용되는 모습을 관찰하세요.',
        },
        {
          label: '새 입력 데이터 이동 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'input',
          feedbackIfFail: '새 입력 데이터 전송을 실행하여 계산기로의 데이터 유입을 확인하세요.',
        },
        {
          label: '가중치 상주 vs 입력 이동의 차이 이해',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'weights-vs-input',
          feedbackIfFail: '가중치는 재사용되지만 새 입력과 활성값은 계속 이동해야 한다는 점을 선택하세요.',
        },
      ],
      hints: [
        { level: 1, title: '변하지 않는 것', description: '모델 가중치는 이미 학습이 끝나 수십 기가바이트 크기로 고정되어 있어요.' },
        { level: 2, title: '변하는 것', description: '사용자가 질문하는 내용(입력)은 매 순간 새로 들어오는 데이터예요.' },
        { level: 3, title: '계산기 옆에 두기', description: '거대한 가중치는 계산기 옆에 모셔두고, 가벼운 입력만 배달하는 것이 현명합니다.' },
      ],
      successMessage: '정답입니다! 가중치 상주를 통한 불필요한 재전송 방지와 새 입력 데이터의 지속적 이동이라는 데이터 지역성의 원리를 완벽히 파악했습니다.',
    },
  ],
};
