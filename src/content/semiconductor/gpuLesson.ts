import type { Lesson } from '../../types';

export const gpuLesson: Lesson = {
  id: 'lesson-gpu',
  courseId: 'course-semiconductor',
  slug: 'gpu-memory-dram-families',
  title: 'GPU 메모리 병목과 DRAM 가족 (GDDR·HBM)',
  subtitle: '파이프라인 병목에서부터 GDDR 이론 대역폭과 HBM TSV 적층 패키징까지',
  category: 'semiconductor',
  description:
    '수천 개의 GPU 연산 코어에 데이터를 어떻게 먹여 살릴까요? 파이프라인 중첩, 버스 폭과 핀 데이터레이트의 이론 대역폭, 패키징과 HBM TSV 적층의 공학적 트레이드오프를 직접 탐구합니다.',
  prerequisites: ['lesson-mosfet', 'lesson-dram', 'lesson-sram'],
  steps: [
    // Step 0: Concept Intro
    {
      id: 'step-gpu-s0-intro',
      title: '0단계: 거대한 계산기와 데이터 공급의 줄다리기',
      stepType: 'CONCEPT',
      storyLead: 'GPU는 수천 개의 코어로 한 번에 엄청난 양의 행렬을 계산합니다. 하지만 연산기에 공급할 데이터가 늦게 오면 어떻게 될까요?',
      prompt: '연산 코어의 굶주림(Memory Starvation)을 해결하기 위한 DRAM 가족(DDR, GDDR, HBM)의 4단계 진화 과정을 탐구해 보세요.',
      detailExplanation:
        'GPU(Graphics Processing Unit)는 대규모 병렬 연산에 최적화된 하드웨어입니다.\n• 문제점: 연산 성능(FLOPS)은 빠르게 증가했지만, 메모리에서 데이터를 가져오는 통로(대역폭)의 발전 속도는 이를 따라가지 못해 생기는 격차를 메모리 벽(Memory Wall)이라고 합니다.\n• DRAM 패밀리: 시스템 메모리인 표준 DDR부터, 보드 위 고주파 신호의 GDDR, 실리콘 인터포저 위에 수직 적층한 HBM까지 모두 1T1C DRAM 셀 기반이지만 대역폭과 패키징에서 큰 차이를 보입니다.',
      whyExplanation:
        '연산 코어를 2배로 늘려도 메모리가 데이터를 제때 공급하지 못하면 코어는 절반 이상 쉬게(stall) 됩니다. 이것이 AI와 고성능 컴퓨팅에서 메모리 대역폭이 연산기 클록만큼 중요한 이유입니다.',
      hints: [
        {
          level: 1,
          title: '메모리 병목의 이해',
          description: '연산 코어 수뿐만 아니라 데이터 공급 통로의 넓이가 전체 시스템 성능을 좌우해요.',
          voiceLine: '연산 코어 수뿐만 아니라 데이터 공급 통로의 넓이가 전체 속도를 좌우해요.',
        },
      ],
    },

    // Step 1: Compute vs Feeding
    {
      id: 'step-gpu-s1-feeding',
      title: '1단계: 연산 능력과 데이터 공급률의 줄다리기 (G03-S01)',
      stepType: 'MANIPULATE',
      storyLead: 'GPU의 연산 코어를 2배로 늘리면 수행 시간도 무조건 절반으로 줄어들까요? 완전 중첩 파이프라인에서 실제 처리량을 결정하는 병목을 찾아보세요.',
      prompt: 'FEED가 8일 때 COMPUTE를 16에서 32로 올려보고, 다시 FEED를 32로 올려 수행 시간의 변화를 관찰하세요.',
      detailExplanation:
        '연산 파이프라인이 이상적으로 완전히 겹쳐(Overlapped) 돌아갈 때:\n• 실효 처리율 = min(계산 능력, 공급 능력)\n• 전체 수행 시간 = 작업량(64) ÷ min(계산 능력, 공급 능력)\n공급 속도가 8에 묶여 있으면 코어를 16에서 32로 올려도 여전히 8 toy seconds가 걸립니다. FEED를 32로 올려야 비로소 2 toy seconds로 단축됩니다.\n※ 본 시뮬레이션은 시작/종료 지연을 생략한 이상적 정상상태(steady-state) 교육용 토이 모델입니다.',
      whyExplanation:
        'GPU의 방대한 연산 코어가 제 성능을 내려면 지속적으로 텐서와 가중치 데이터가 파이프라인에 공급되어야 합니다. 데이터 공급률이 연산 처리량보다 낮으면 코어는 데이터가 도착할 때까지 쉬게(stall) 됩니다. 아무리 코어를 늘려도 공급 대역폭이 좁으면 전체 처리율은 공급 속도에 의해 강제 제한됩니다.',
      simulatorType: 'gpu-compute-feeding',
      physicsAssumptions: '이상적 완전 중첩 파이프라인 · 정상 상태 토이 단위(toy units/s, toy s)',
      sourceRefs: ['A06 03 GPU Story', 'Patterson & Hennessy, Computer Architecture'],
      initialParams: {
        compute: 16,
        feed: 8,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 공급(FEED)이 8일 때 연산 코어를 16에서 32로 2배 늘리면 수행 시간은?',
          type: 'radioGroup',
          options: [
            { label: '데이터 공급이 8로 묶여 있으면 시간은 8초 그대로다', value: 'supply-limits' },
            { label: '코어가 2배이므로 무조건 시간이 4초로 절반이 된다', value: 'compute-only', misconception: '데이터 공급이 부족하면 코어가 놀게 되므로 시간이 줄지 않습니다.' },
            { label: '공급 시간 8초와 연산 2초가 직렬로 더해져 10초가 된다', value: 'serial-sum', misconception: '파이프라인이 겹쳐 작동하므로 직렬로 더해지지 않습니다.' },
          ],
        },
        {
          id: 'compute',
          label: 'GPU 계산 능력 (COMPUTE)',
          type: 'slider',
          min: 16,
          max: 32,
          step: 16,
          unit: 'toy units/s',
        },
        {
          id: 'feed',
          label: '데이터 공급 능력 (FEED)',
          type: 'slider',
          min: 8,
          max: 32,
          step: 8,
          unit: 'toy units/s',
        },
        {
          id: 'answer',
          label: '실험 결과 공학적 해석',
          type: 'radioGroup',
          options: [
            { label: '공급 속도가 연산보다 느리면 코어 수와 무관하게 공급 속도가 전체 처리율을 제한한다', value: 'supply-limits' },
            { label: '코어만 무제한으로 늘리면 어떤 대역폭에서도 최고 속도가 나온다', value: 'compute-only', misconception: '공급 병목 상태에서는 코어를 늘려도 성능 향상이 없습니다.' },
            { label: '메모리 대역폭은 연산 지연 시간과 아무런 상관이 없다', value: 'no-relation', misconception: '메모리 대역폭이 좁으면 연산기가 데이터 기아 상태에 빠집니다.' },
          ],
        },
      ],
      hints: [
        {
          level: 1,
          title: '공급 속도와 연산 능력의 관계',
          description: '공급 속도(FEED)가 8일 때 계산 능력(COMPUTE)을 16에서 32로 올려도 완료 시간이 왜 8초로 똑같을까요?',
          voiceLine: '공급 속도가 8일 때 코어를 두 배로 늘려도 왜 시간은 그대로일까요?',
        },
        {
          level: 2,
          title: '최소값(min)에 의한 처리량 결정',
          description: '파이프라인이 완전히 겹쳐 작동할 때 단위 시간당 처리량은 min(연산, 공급)으로 결정돼요.',
          voiceLine: '연산과 공급 중 더 좁은 쪽이 전체 파이프라인의 속도를 결정해요.',
        },
        {
          level: 3,
          title: '공급 병목 해소 실험',
          description: 'FEED를 32로 올리고 COMPUTE 32와 결합해 보세요. 8초였던 완료 시간이 2초로 대폭 단축됩니다!',
          voiceLine: '공급 속도를 32로 올려 연산 코어의 굶주림을 해결해 보세요.',
        },
      ],
      rules: [
        {
          label: 'FEED 8 및 COMPUTE 16 관찰',
          targetKey: 'history',
          operator: 'contains',
          expected: 'core16feed8',
          feedbackIfFail: 'FEED 8에서 COMPUTE 16 상태를 먼저 관찰하세요.',
        },
        {
          label: 'FEED 8 및 COMPUTE 32 병목 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'core32feed8',
          feedbackIfFail: 'FEED 8에서 COMPUTE를 32로 올려도 시간이 줄지 않는 병목을 확인하세요.',
        },
        {
          label: 'FEED 32 공급 병목 해소',
          targetKey: 'history',
          operator: 'contains',
          expected: 'feed32',
          feedbackIfFail: 'FEED를 32로 올려 연산 코어 기아 상태를 해소해 보세요.',
        },
        {
          label: '공급 속도 지배 결론 선택',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'supply-limits',
          feedbackIfFail: '공급 속도가 연산보다 느릴 때 파이프라인 전체를 제약한다는 결론을 선택하세요.',
        },
      ],
    },

    // Step 2: DRAM Family Roles
    {
      id: 'step-gpu-s2-families',
      title: '2단계: DRAM 가족의 진화와 배치 계층 (G03-S02)',
      stepType: 'MANIPULATE',
      storyLead: 'DDR, GDDR, HBM은 서로 완전히 다른 반도체일까요? 시스템 어디에 어떤 I/O 인터페이스로 연결되는지 맞춰보세요.',
      prompt: 'DDR/RDIMM, GDDR6/GDDR7, HBM 세 가지 메모리를 CPU 소켓, GPU 보드, GPU 패키지와 각각 매칭해 보세요.',
      detailExplanation:
        '모든 메모리는 1T1C DRAM 셀 기반이지만, 시스템 내 물리적 배치와 I/O 연결 형태가 다릅니다:\n• DDR / RDIMM: 메인보드의 CPU 소켓 DIMM 슬롯에 장착. 교체와 대용량 확장을 위해 긴 버스 배선을 감수.\n• GDDR6 / GDDR7: 그래픽 카드의 PCB 보드 위에 BGA 형태로 실장. 좁은 보드 공간에서 핀당 초고주파 점대점 신호를 전송.\n• HBM: GPU 실리콘 다이 바로 옆 실리콘 인터포저 위에 수직 적층(TSV) 실장. 초광대역 버스로 극도의 대역폭 달성.',
      whyExplanation:
        'DDR은 표준 소켓을 통한 교체와 대용량 확장을 위해 긴 버스 배선을 감수합니다. 반면 GDDR은 그래픽 카드의 제한된 PCB 위에서 핀당 초고주파 신호를 쏘고, HBM은 실리콘 인터포저 위에 칩을 수직 적층하여 수천 가닥의 I/O 라인을 패키지 내부에서 직접 연결합니다. 모두 DRAM이지만 물리적 위치와 신호 채널이 설계 목적에 맞게 완전히 다릅니다.',
      simulatorType: 'gpu-memory-family-roles',
      physicsAssumptions: '정성적 배치 계층 모형 · 모든 제품이 특정 메모리를 채택한다는 보증 아님',
      sourceRefs: ['JEDEC Standards (DDR, GDDR, HBM)', 'A06 03 Story'],
      initialParams: {
        family: 'DDR/RDIMM',
        site: 'cpu-dimm',
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: DDR, GDDR, HBM의 본질과 위치는?',
          type: 'radioGroup',
          options: [
            { label: '모두 DRAM 셀 기반이며 시스템 내 물리적 배치와 I/O 폭이 다르다', value: 'all-dram-roles' },
            { label: 'HBM은 SRAM이고 GDDR만 DRAM이다', value: 'hbm-is-sram', misconception: 'HBM 역시 내부적으로 DRAM 셀로 구성되어 있습니다.' },
            { label: '서로 완전히 동일하며 슬롯만 호환되면 교체할 수 있다', value: 'any-socket-compatible', misconception: '핀 규격과 전기적 인터페이스가 달라 직접 호환되지 않습니다.' },
          ],
        },
        {
          id: 'family',
          label: '메모리 패밀리 선택',
          type: 'radioGroup',
          options: [
            { label: 'DDR / RDIMM (시스템 메모리)', value: 'DDR/RDIMM' },
            { label: 'GDDR6 / GDDR7 (그래픽 전용 DRAM)', value: 'GDDR6/GDDR7' },
            { label: 'HBM (고대역폭 적층 DRAM)', value: 'HBM' },
          ],
        },
        {
          id: 'site',
          label: '설치 위치 매칭',
          type: 'radioGroup',
          options: [
            { label: 'CPU DIMM 소켓 (메인보드 슬롯)', value: 'cpu-dimm' },
            { label: 'GPU 보드 기판 (PCB 위 BGA 패키지)', value: 'gpu-board' },
            { label: 'GPU 실리콘 패키지 (인터포저 근접 적층)', value: 'gpu-package' },
          ],
        },
        {
          id: 'answer',
          label: '배치 계층 분석 정답',
          type: 'radioGroup',
          options: [
            { label: '모두 DRAM 기반이며 설계 목적에 따라 소켓·보드·패키지로 분화되었다', value: 'all-dram-roles' },
            { label: '모든 위치에 무조건 HBM만 꽂아야 최고의 시스템이 된다', value: 'hbm-everywhere', misconception: 'HBM은 고비용이므로 모든 PC 메모리를 대체하지 않습니다.' },
            { label: 'DDR과 GDDR는 플래시 메모리이고 HBM만 DRAM이다', value: 'flash-myth', misconception: '셋 다 휘발성 DRAM 셀 기반입니다.' },
          ],
        },
      ],
      hints: [
        {
          level: 1,
          title: '이름 속에 숨은 공통점',
          description: 'DDR, GDDR, HBM은 명칭과 특성이 달라도 기본 비트 저장 원리는 모두 1T1C 커패시터 DRAM입니다.',
          voiceLine: '세 메모리 모두 정보를 커패시터 전하로 저장하는 DRAM 가족이에요.',
        },
        {
          level: 2,
          title: '물리적 배치 장소',
          description: 'CPU DIMM 소켓에는 DDR/RDIMM, GPU 기판 보드에는 GDDR, GPU 실리콘 옆 패키지에는 HBM이 배치돼요.',
          voiceLine: '각 메모리가 보드 위인지, 소켓 슬롯인지, 칩 패키지 안인지 구분해 보세요.',
        },
        {
          level: 3,
          title: '3개 위치 모두 탐색',
          description: 'CPU DIMM, GPU 보드, GPU 패키지 세 위치를 모두 선택해 각각 정합하는 메모리를 확인하세요.',
          voiceLine: '세 곳의 위치를 모두 선택해 보면서 DRAM이 어떻게 배치되는지 관찰하세요.',
        },
      ],
      rules: [
        {
          label: 'CPU DIMM 소켓 배치 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'cpu-dimm',
          feedbackIfFail: 'CPU 소켓 DIMM 슬롯에 DDR/RDIMM이 배치되는 것을 확인하세요.',
        },
        {
          label: 'GPU 보드 PCB 배치 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'gpu-board',
          feedbackIfFail: 'GPU 보드 기판(PCB) 위에 GDDR가 배치되는 것을 확인하세요.',
        },
        {
          label: 'GPU 패키지 인터포저 적층 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'gpu-package',
          feedbackIfFail: 'GPU 연산 칩 바로 옆 실리콘 패키지에 HBM이 배치되는 것을 확인하세요.',
        },
        {
          label: 'DRAM 가족 본질 결론 선택',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'all-dram-roles',
          feedbackIfFail: '모두 DRAM이지만 시스템 계층과 I/O 위치가 다르다는 결론을 선택하세요.',
        },
      ],
    },

    // Step 3: GDDR Width & Rate
    {
      id: 'step-gpu-s3-width-rate',
      title: '3단계: 버스 폭 × 핀 전송률: 이론 대역폭 계산과 PAM3 (G03-S03)',
      stepType: 'MANIPULATE',
      storyLead: '도로의 차선 폭(버스 비트)과 자동차 속도(핀당 데이터레이트)로 이론적 최대 대역폭을 계산해 보세요.',
      prompt: '128비트 버스에서 핀당 전송률을 24Gbps 및 32Gbps로 변경하고, PAM3 신호 방식을 선택해 보세요.',
      detailExplanation:
        '이론 대역폭 계산 공식:\n• 이론 대역폭(GB/s) = (버스 폭[bit] × 핀당 전송률[Gb/s/pin]) ÷ 8\n• 128 bit × 24 Gb/s/pin ÷ 8 = 384 GB/s\n• 128 bit × 32 Gb/s/pin ÷ 8 = 512 GB/s\n신호 변조 방식:\n• NRZ: 2개 전압 레벨 (0, 1)\n• PAM3: 3개 전압 레벨 (-1, 0, +1). 신호 높이가 3단계라는 뜻이지 한 클록에 3비트를 보낸다는 뜻이 아닙니다.',
      whyExplanation:
        '이론 대역폭(GB/s) = (버스 폭[bit] × 핀당 전송률[Gb/s/pin]) ÷ 8 [bits/Byte]. 고속 신호 전송 시 주파수가 높아지면 신호 감쇠와 간섭이 급격히 증가합니다. GDDR7에서는 2레벨 전압(0, 1)을 쓰는 NRZ 대신 3레벨(-1, 0, +1) 전압을 사용하는 PAM3 신호 방식을 도입하여, 동일한 고주파 환경에서 신호 무결성을 지키면서 데이터 전송 효율을 끌어올립니다. 단, PAM3의 3레벨은 1클럭에 3비트를 의미하는 것이 아닙니다.',
      simulatorType: 'gpu-gddr-width-rate',
      physicsAssumptions: '128비트 가상 인터페이스 · 100% 이론적 상한값 (프로토콜 손실 미반영)',
      sourceRefs: ['GDDR7 Specification', 'Micron Technical Brief'],
      initialParams: {
        pinRate: 24,
        signal: 'NRZ',
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 128bit 버스에서 24Gbps와 32Gbps의 이론 대역폭은?',
          type: 'radioGroup',
          options: [
            { label: '24Gbps는 384 GB/s, 32Gbps는 512 GB/s 이다', value: 'theoretical-pam3' },
            { label: '24Gbps는 3072 GB/s, 32Gbps는 4096 GB/s 이다 (8로 나누지 않음)', value: 'bits-equals-levels', misconception: '1바이트=8비트이므로 8로 나누어야 바이트 단위가 됩니다.' },
            { label: '24Gbps는 192 GB/s, 32Gbps는 256 GB/s 이다', value: 'wrong-division', misconception: '128비트 × 전송률 ÷ 8 공식을 다시 확인하세요.' },
          ],
        },
        {
          id: 'pinRate',
          label: '핀당 전송률 (Pin Data Rate)',
          type: 'slider',
          min: 24,
          max: 32,
          step: 8,
          unit: 'Gb/s/pin',
        },
        {
          id: 'signal',
          label: '신호 변조 방식',
          type: 'radioGroup',
          options: [
            { label: 'NRZ (2 전압 레벨)', value: 'NRZ' },
            { label: 'PAM3 (3 전압 레벨)', value: 'PAM3' },
          ],
        },
        {
          id: 'answer',
          label: '대역폭 계산 및 신호 특성 결론',
          type: 'radioGroup',
          options: [
            { label: '대역폭은 폭×속도÷8로 계산되며 PAM3의 3레벨은 3비트 전송을 뜻하지 않는다', value: 'theoretical-pam3' },
            { label: 'PAM3는 3비트를 동시에 전송하므로 대역폭이 3배가 된다', value: 'bits-equals-levels', misconception: 'PAM3는 3단계 전압 레벨을 의미합니다.' },
            { label: '이 계산값은 실제 게임이나 AI 벤치마크에서 100% 그대로 나오는 실측값이다', value: 'measured-gpu-speed', misconception: '프로토콜 오버헤드와 효율을 제외한 100% 이론적 최대치입니다.' },
          ],
        },
      ],
      hints: [
        {
          level: 1,
          title: '비트(bit)와 바이트(Byte)의 변환',
          description: '1바이트는 8비트입니다. 핀당 Gbps 수치에 버스 폭(128비트)을 곱한 뒤 8로 나누어야 GB/s가 나와요.',
          voiceLine: '1바이트는 8비트예요. 128비트를 8로 나누면 16바이트 폭이 됩니다.',
        },
        {
          level: 2,
          title: '계산 공식 적용',
          description: '128 × 24 ÷ 8 = 384 GB/s, 128 × 32 ÷ 8 = 512 GB/s 입니다.',
          voiceLine: '128 곱하기 24 나누기 8은 384, 128 곱하기 32 나누기 8은 512예요.',
        },
        {
          level: 3,
          title: 'PAM3 신호의 의미',
          description: 'PAM3의 3개 전압 레벨은 신호 높이가 3단계라는 뜻이지 한 번에 3비트를 보낸다는 뜻이 아니에요.',
          voiceLine: 'PAM3 3단계는 신호 전압의 높이 레벨이지 3비트가 아니에요.',
        },
      ],
      rules: [
        {
          label: '24 Gb/s/pin 384 GB/s 계산 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'rate24',
          feedbackIfFail: '24 Gb/s/pin에서 384 GB/s 이론 대역폭을 확인하세요.',
        },
        {
          label: '32 Gb/s/pin 512 GB/s 계산 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'rate32',
          feedbackIfFail: '32 Gb/s/pin에서 512 GB/s 이론 대역폭을 확인하세요.',
        },
        {
          label: '이론식 및 PAM3 3레벨 결론 선택',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'theoretical-pam3',
          feedbackIfFail: '이론식(폭×속도÷8)과 PAM3의 3레벨 신호 특성을 올바르게 설명한 항목을 선택하세요.',
        },
      ],
    },

    // Step 4: HBM Tradeoffs
    {
      id: 'step-gpu-s4-hbm',
      title: '4단계: HBM 적층 TSV 구조와 패키징 트레이드오프 (G03-S04)',
      stepType: 'MANIPULATE',
      storyLead: 'HBM은 DRAM 다이를 수직 관통(TSV) 적층하여 수천 비트의 초광대역 연결을 제공합니다. 하지만 왜 모든 컴퓨터가 HBM을 쓰지 않을까요?',
      prompt: '보드 GDDR와 패키지 HBM 적층 구조를 비교하고, 공학적 제약(Constraints) 패널을 열어 열과 비용의 트레이드오프를 확인하세요.',
      detailExplanation:
        'HBM의 2.5D 패키징 구조:\n• TSV(Through-Silicon Via): 실리콘 다이를 수직 관통하는 미세 구리 기둥으로 여러 DRAM 층을 수직 연결.\n• 실리콘 인터포저: GPU 로직 다이와 HBM 스택을 초미세 배선으로 수평 연결하는 베이스 기판.\n공학적 트레이드오프:\n• 장점: 극도의 I/O 대역폭(초당 수 테라바이트), 칩 간 물리적 거리 단축으로 인한 지연 감소.\n• 단점: 수직 적층으로 인한 방열(열 집중) 문제, 인터포저 제조 단가 상승, 패키징 결함 시 수율 하락.\n※ 교육용 2.5D 일러스트와 반도체 패키징 2.5D 이종 집적은 완전히 다른 개념입니다.',
      whyExplanation:
        'HBM은 여러 개의 DRAM 다이를 TSV(Through-Silicon Via)로 수직 관통하여 적층하고, 연산 로직(GPU)과 함께 초미세 인터포저 위에 수평 집적(2.5D 패키징)합니다. 이를 통해 수천 비트 폭의 I/O를 확보하여 메모리 벽(Memory Wall)을 돌파하지만, 미세 공정의 결함률, 방열 면적 부족으로 인한 열 밀집, 패키징 제조 단가 상승이라는 명확한 공학적 트레이드오프가 수반됩니다. UI의 2.5D 그래픽과 반도체 2.5D 패키징은 완전히 다른 개념입니다.',
      simulatorType: 'gpu-hbm-tradeoffs',
      physicsAssumptions: '정성적 상대 비교 모형 · UI의 2.5D 그림과 반도체 2.5D 패키징 명확 구분',
      sourceRefs: ['IEEE Micro (HBM Architecture)', 'SK Hynix / Samsung Whitepapers'],
      initialParams: {
        topology: 'gddr-board',
        showConstraints: false,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: HBM이 최고 대역폭인데 모든 기기에 쓰지 못하는 이유는?',
          type: 'radioGroup',
          options: [
            { label: 'TSV 적층과 인터포저 패키징으로 인한 고비용과 발열 집적 제약 때문이다', value: 'relative-tradeoffs' },
            { label: 'HBM은 속도가 너무 느려서 일반 PC에 맞지 않기 때문이다', value: 'too-slow', misconception: 'HBM은 현존하는 가장 빠른 I/O 대역폭을 제공합니다.' },
            { label: 'HBM은 영구 저장이 불가능해서 SSD가 대신 쓰이기 때문이다', value: 'storage-confusion', misconception: '주기억장치와 보조기억장치는 용도가 다릅니다.' },
          ],
        },
        {
          id: 'topology',
          label: '메모리 연결 토폴로지',
          type: 'radioGroup',
          options: [
            { label: '보드 GDDR (PCB 트레이스 연결)', value: 'gddr-board' },
            { label: '패키지 HBM (TSV 수직 적층 + 실리콘 인터포저)', value: 'hbm-stack' },
          ],
        },
        {
          id: 'showConstraints',
          label: '공학적 제약 및 트레이드오프 표시',
          type: 'toggle',
          options: [
            { label: '제약 숨김', value: false },
            { label: '비용·열·공정 제약 표시', value: true },
          ],
        },
        {
          id: 'answer',
          label: 'HBM 도입 시 핵심 고려 사항',
          type: 'radioGroup',
          options: [
            { label: '초광대역 I/O의 이점 뒤에 제조 복잡도·열 관리·비용이라는 트레이드오프가 있다', value: 'relative-tradeoffs' },
            { label: '비용이나 열에 상관없이 무조건 모든 기기에 HBM을 도입해야 한다', value: 'hbm-everywhere-ideal', misconception: '경제성과 용도에 맞게 보드 GDDR나 표준 DDR을 선택합니다.' },
            { label: 'TSV 관통 전극은 일반 구리선과 같아서 공정 난이도가 전혀 없다', value: 'tsv-is-simple-wire', misconception: '실리콘 다이를 미세 관통하는 TSV는 고난도 반도체 공정입니다.' },
          ],
        },
      ],
      hints: [
        {
          level: 1,
          title: '열 밀집 문제',
          description: '여러 장의 DRAM 칩을 수직으로 빽빽하게 쌓고 바로 옆에 고발열 연산 칩을 두면 열은 어떻게 빠져나갈까요?',
          voiceLine: '수직으로 칩을 빽빽이 쌓으면 열을 밖으로 빼내기 어려워져요.',
        },
        {
          level: 2,
          title: '인터포저와 제조 단가',
          description: '실리콘 인터포저와 마이크로 범프를 이용한 고정밀 패키징은 일반 PCB 기판에 비해 제조 비용이 매우 비싸요.',
          voiceLine: '인터포저와 미세 범프 패키징은 생산 비용과 공정 난이도가 높아요.',
        },
        {
          level: 3,
          title: '공학적 최적화',
          description: '엔지니어링은 무조건 최고 스펙을 쓰는 것이 아니라, 비용·발열·대역폭 사이에서 용도에 맞는 균형을 찾는 과정입니다.',
          voiceLine: '비용과 발열, 대역폭 사이의 균형을 찾는 것이 공학적 설계예요.',
        },
      ],
      rules: [
        {
          label: '보드 상 GDDR PCB 트레이스 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'gddr',
          feedbackIfFail: '보드 상의 표준 GDDR PCB 트레이스 연결을 확인하세요.',
        },
        {
          label: 'HBM TSV 적층 및 인터포저 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'hbm',
          feedbackIfFail: 'HBM의 TSV 적층 및 인터포저 패키지 구조를 확인하세요.',
        },
        {
          label: '열·비용·공정 제약 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'constraints',
          feedbackIfFail: '열·비용·공정 제약 패널을 열어 실제 한계를 확인하세요.',
        },
        {
          label: '공학적 트레이드오프 결론 선택',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'relative-tradeoffs',
          feedbackIfFail: '광대역 I/O 장점 뒤에 패키징 비용·열 제약이라는 트레이드오프가 존재함을 선택하세요.',
        },
      ],
    },
  ],
};
