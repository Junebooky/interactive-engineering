import type { Lesson } from '../../types';

export const electricityLesson: Lesson = {
  id: 'electricity-rc-foundations',
  courseId: 'course-semiconductor',
  category: 'semiconductor',
  slug: 'electricity-rc-foundations',
  title: '12. 전기가 움직이고 기억하는 가장 작은 실험 — V/I/R/RC/Power',
  subtitle: '전압·전류·저항(옴의 법칙), 직·병렬 KCL, 커패시터 충·방전 RC 시간상수, 전력과 에너지',
  description:
    '배터리 전압과 전류의 본질적 차이, 저항 분배와 노드 전류 보존(KCL), 1차 RC 회로의 지수적 충·방전과 시간상수(τ=RC), 전력(W)과 에너지(J)의 구분을 대화형 2.5D 시뮬레이션으로 탐구합니다.',
  steps: [
    // Step 0: Concept Intro
    {
      id: 'step-elec-s0-intro',
      title: '개념 도입: 전압(차이)과 전류(흐름)의 본질',
      stepType: 'CONCEPT',
      storyLead: '배터리가 5볼트인데 전자가 하나도 흐르지 않을 수 있을까요?',
      prompt:
        '전압은 단위 전하당 위치 에너지 차(J/C)이며, 전류는 단위 시간당 흐르는 전하량(C/s=A)입니다. 회로가 열려 있으면 전압은 존재하지만 전류는 0입니다. 아래 버튼을 눌러 첫 번째 회로 실험을 시작해 보세요.',
      detailExplanation:
        '• 전압(V, 볼트): 두 지점 사이의 전위차(ΔU/q, 단위: J/C). 물탱크의 수위 차이에 비유됩니다.\n• 전류(I, 암페어): 단위 시간당 단면을 통과하는 전하의 흐름률(dQ/dt, 단위: C/s). 수도관을 흐르는 물의 유량에 비유됩니다.\n• 스위치가 열려 있으면 수위 차이(전압)는 그대로 유지되지만 밸브가 잠겨 물(전류)은 흐르지 못합니다.\n• 금속 도선에서 실제로 이동하는 전자는 음전하(−)이므로, 역사적인 관습전류(+) 방향과 정반대로 이동합니다.',
      whyExplanation:
        '정전기학에서 전위차는 전하의 이동 경로와 무관하게 보존장(Conservative Field)의 위치 에너지를 나타냅니다. 회로가 단절(Open)되어 직류 전도 경로가 차단되더라도 배터리 화학 반응에 의한 단자 간 전위차(5V)는 그대로 유지됩니다.',
      initialParams: {},
      rules: [],
      voice: {
        intro:
          '반도체와 컴퓨터의 기본이 되는 전기 회로의 가장 작은 법칙을 살펴봅니다. 전압과 전류가 어떻게 다르고, 전기가 어떻게 시간을 기억하는지 직접 조작해 보세요.',
      },
      hints: [
        {
          level: 1,
          title: '차이와 흐름',
          description: '전압은 높이 차이이고 전류는 흐르는 물길이에요.',
          voiceLine: '전압은 높이 차이, 전류는 흐르는 물길입니다.',
        },
      ],
      successMessage: '전압과 전류의 개념을 확인했습니다. 옴의 법칙 실험으로 넘어갑니다.',
    },

    // Step 1: 12-S01 Ohm's Law and Switch
    {
      id: 'step-elec-s1-ohms-law',
      title: '1단계: 옴의 법칙과 스위치 개폐, 관습전류와 전자의 실제 이동 (12-S01)',
      stepType: 'MANIPULATE',
      storyLead: '회로를 끊으면 전압과 전류가 둘 다 0일까요?',
      prompt:
        '5V 배터리의 스위치를 열면 전류와 전압은 어떻게 될까요?',
      detailExplanation:
        '• 이상적인 5V 전원과 1kΩ(1000Ω) 저항이 연결되어 있습니다.\n• 스위치 열림(OPEN): 닫힌 통로가 없으므로 직류 전류 I = 0 mA입니다. 그러나 전원 양단의 5V 전위차는 여전히 유지됩니다.\n• 스위치 닫힘(CLOSED): 옴의 법칙(I = V/R)에 따라 I = 5V / 1000Ω = 5 mA의 전류가 흐릅니다.\n• 관습전류는 (+)에서 (−)로 흐르지만, 실제 금속 도선 내의 자유 전자는 음전하를 띠므로 (−)에서 (+) 쪽으로 표류(drift)합니다.',
      whyExplanation:
        'I = V/R (옴의 법칙). 저항에 걸리는 전압 V가 전류 I를 구동합니다. 스위치를 열면 회로의 저항이 이상적으로 무한대(R=∞)가 되므로 I = V/∞ = 0A가 되며, 전원 단자 자체의 기전력은 사라지지 않습니다.',
      simulatorType: 'elec-charge-current',
      physicsAssumptions: '이상적 DC 전원(내부저항 0Ω), 무손실 도선, 스위치 아크 방전 및 누설전류 배제',
      sourceRefs: ['Halliday & Resnick, Fundamentals of Physics (Ch. 26 Current & Resistance)'],
      initialParams: {
        volts: 5,
        closed: false,
        direction: 'conventional',
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '5V 배터리의 스위치를 열면 전류와 전압은 어떻게 될까요?',
          type: 'radioGroup',
          options: [
            {
              label: '배터리의 전압은 남지만 전류는 멈출 것 같아요.',
              value: 'v5-i0',
            },
            {
              label: '전압과 전류가 모두 없어질 것 같아요.',
              value: 'all-zero',
              misconception:
                '스위치는 전류 통로를 끊을 뿐, 배터리 양단의 전위차(전압)는 그대로 유지돼요.',
            },
            {
              label: '회로가 열려도 전류가 계속 흐를 것 같아요.',
              value: 'keep-current',
              misconception:
                '전하가 이동할 수 있는 닫힌 경로가 없으면 전류는 흐를 수 없어요.',
            },
          ],
        },
        {
          id: 'closed',
          label: '회로 스위치 (Switch State)',
          type: 'toggle',
          options: [
            { label: '열림', value: false },
            { label: '닫힘', value: true },
          ],
        },
        {
          id: 'direction',
          label: '전류 화살표 기준 (Flow Perspective)',
          type: 'radioGroup',
          options: [
            { label: '관습전류 (+ → − 방향)', value: 'conventional' },
            { label: '전자의 실제 이동 (− → + 방향)', value: 'electron' },
          ],
        },
        {
          id: 'answer',
          label: '왜 회로가 열릴 때 전류만 멈출까요?',
          type: 'radioGroup',
          options: [
            {
              label: '전압은 전하를 밀어주는 차이이고, 전류는 실제 흐름이에요.',
              value: 'v-not-current',
            },
            {
              label: '스위치가 열린 채로도 전류가 흐르는 통로가 있어요.',
              value: 'same-thing',
              misconception:
                '다시 생각해 볼까요? 스위치를 열면 전류의 통로가 끊기지만 배터리 양단 전압까지 사라지는 것은 아니에요.',
            },
            {
              label: '전압과 전류는 언제나 똑같은 값이에요.',
              value: 'flew-away',
              misconception:
                '전압은 전하를 미는 에너지 차(V=J/C)이고, 전류는 전하의 흐름률(I=C/s)입니다.',
            },
          ],
        },
      ],
      rules: [
        {
          label: '스위치 OPEN 상태 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'open',
          feedbackIfFail: '스위치를 열어 전압 5V에서 전류가 0mA가 되는 것을 확인하세요.',
        },
        {
          label: '스위치 CLOSED 상태 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'closed',
          feedbackIfFail: '스위치를 닫아 1kΩ 저항에 5mA가 흐르는 것을 관찰하세요.',
        },
        {
          label: '전압과 전류의 구분 이해',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'v-not-current',
          feedbackIfFail: '전압은 위치 에너지 차이고 전류는 흐름률임을 선택하세요.',
        },
      ],
      hints: [
        {
          level: 1,
          title: '닫힌 길 찾기',
          description: '스위치가 열려 있으면 전자가 지나갈 길이 끊겨요.',
          voiceLine: '스위치가 열려 있으면 전하가 이동할 통로가 없습니다.',
        },
        {
          level: 2,
          title: '옴의 법칙 계산',
          description: '5V 나누기 1000Ω은 0.005A, 즉 5mA입니다.',
          voiceLine: '오 볼트를 천 옴으로 나누면 오 밀리암페어가 흐릅니다.',
        },
        {
          level: 3,
          title: '전자의 음전하',
          description: '전자는 음전하이므로 양극(+)으로 끌려가며 관습전류와 반대로 흐릅니다.',
          voiceLine: '전자는 음전하이므로 관습전류와 반대 방향으로 이동합니다.',
        },
      ],
      voice: {
        intro: '스위치를 열었을 때와 닫았을 때 전류계가 어떻게 달라질지 먼저 예상해 보세요.',
        explanation: '전원 양단에는 5볼트가 유지될 수 있어도 열린 회로에는 직류가 흐르지 않아요. 닫힌 1킬로옴 경로에서 5밀리암페어가 흐릅니다.',
      },
      successMessage: '정답입니다! 전압과 전류의 차이 및 옴의 법칙(I=V/R)을 명확히 확인했습니다.',
    },

    // Step 2: 12-S02 Series & Parallel KCL
    {
      id: 'step-elec-s2-resistors-kcl',
      title: '2단계: 직렬·병렬 저항 회로와 키르히호프 전류 법칙(KCL) (12-S02)',
      stepType: 'MANIPULATE',
      storyLead: '길을 두 갈래로 나누면 전기가 두 배로 생길까요?',
      prompt:
        '동일한 1kΩ 저항 2개를 직렬 또는 병렬로 연결했을 때의 전류를 예상하고, 회로 토폴로지를 전환하며 등가저항과 분기 전류(KCL)를 비교한 뒤 올바른 이유를 고르세요.',
      detailExplanation:
        '• 직렬 연결 (Series): Req = R1 + R2 = 1k + 1k = 2kΩ. 전체 전류 I = 5V / 2000Ω = 2.5 mA. 각 저항에 동일한 2.5mA가 흐르며 2.5V씩 전압이 분배됩니다.\n• 병렬 연결 (Parallel): Req = (1k × 1k) / (1k + 1k) = 500Ω. 전체 전류 I = 5V / 500Ω = 10 mA. 두 갈래 길에 각각 5mA씩 나뉘어 흐릅니다(5mA + 5mA = 10mA).\n• 키르히호프 전류 법칙(KCL): 회로의 어떤 노드(접속점)에서도 유입되는 전류의 총합은 유출되는 전류의 총합과 항상 같습니다(전하 보존).',
      whyExplanation:
        'KCL(Kirchhoff Current Law)은 전하 보존 법칙(Conservation of Charge)의 필연적 결과입니다. 전하는 도선의 분기점에 머무르거나 저절로 생겨나지 않으므로, 병렬 회로에서 각 가지로 갈라진 전류의 합은 전원에서 공급한 총 전류와 정확히 일치합니다.',
      simulatorType: 'elec-resistor-kcl',
      physicsAssumptions: '이상적 1kΩ 저항체, 도선 저항 및 접촉 저항 무시, 정상상태 직류',
      sourceRefs: ['Nilsson & Riedel, Electric Circuits (Ch. 2 Circuit Elements & Kirchhoff Laws)'],
      initialParams: {
        topology: 'series',
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 동일한 1kΩ 저항 2개를 5V에 직렬/병렬로 놓았을 때 전류는?',
          type: 'radioGroup',
          options: [
            {
              label: '직렬은 2kΩ에 2.5mA, 병렬은 500Ω에 총 10mA(각 가지 5mA)가 흘러요.',
              value: 'calc-exact',
            },
            {
              label: '저항이 2개이므로 직렬이든 병렬이든 총 전류는 항상 5mA예요.',
              value: 'always-same',
              misconception:
                '병렬은 전류 경로가 늘어나 합성저항이 절반(500Ω)으로 줄어들므로 총 전류가 2배로 증가해요.',
            },
            {
              label: '직렬 회로에서는 첫 번째 저항을 지나면 전류가 거의 다 소모돼요.',
              value: 'consumed',
              misconception:
                '전류는 전하의 흐름률이므로 직렬 도선 어디에서나 동일하게 보존됩니다.',
            },
          ],
        },
        {
          id: 'topology',
          label: '저항 연결 방식 (Topology)',
          type: 'radioGroup',
          options: [
            { label: '직렬 연결 (Series - Req 2kΩ, 2.5mA)', value: 'series' },
            { label: '병렬 연결 (Parallel - Req 500Ω, 10mA)', value: 'parallel' },
          ],
        },
        {
          id: 'answer',
          label: '개념 확인: 병렬 노드(분기점)에서 유입 전류와 유출 전류의 관계는?',
          type: 'radioGroup',
          options: [
            {
              label: '전하 보존법칙에 의해 유입 전류의 합과 유출 전류의 합은 항상 같아요(KCL).',
              value: 'current-conserved',
            },
            {
              label: '분기점을 지나면 전하가 스스로 증식하여 전류가 무한해져요.',
              value: 'create-charge',
              misconception: '전하는 스스로 생성되거나 소멸하지 않고 보존됩니다.',
            },
            {
              label: '노드에서 전류의 절반은 항상 열로 증발하여 사라져요.',
              value: 'evaporate',
              misconception: '전하는 보존되며 전류 합은 정확히 일치합니다.',
            },
          ],
        },
      ],
      rules: [
        {
          label: '직렬 회로 관찰',
          targetKey: 'history',
          operator: 'contains',
          expected: 'series',
          feedbackIfFail: '저항 연결을 직렬(Series)로 전환해 보세요.',
        },
        {
          label: '병렬 회로 관찰',
          targetKey: 'history',
          operator: 'contains',
          expected: 'parallel',
          feedbackIfFail: '저항 연결을 병렬(Parallel)로 전환해 보세요.',
        },
        {
          label: '전하 보존 및 KCL 이해',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'current-conserved',
          feedbackIfFail: '노드에서 전류의 총합이 보존된다는 법칙(KCL)을 고르세요.',
        },
      ],
      hints: [
        {
          level: 1,
          title: '저항의 갈림길',
          description: '도로가 두 갈래로 나뉘면 차가 더 잘 빠져나가듯이 저항이 줄어들어요.',
          voiceLine: '갈림길이 생기면 저항이 줄어들어 전류가 더 많이 흐릅니다.',
        },
        {
          level: 2,
          title: '노드 전하 합계',
          description: '들어온 전류(10mA) = 첫째 길(5mA) + 둘째 길(5mA) 입니다.',
          voiceLine: '노드로 들어온 전류와 나가는 전류의 합은 같습니다.',
        },
        {
          level: 3,
          title: '직렬 전류의 보존',
          description: '직렬 회로는 도중에 전하가 샐 곳이 없으므로 모든 곳에서 전류가 같습니다.',
          voiceLine: '직렬 회로에서는 전하가 나갈 통로가 없어 모든 지점의 전류가 같습니다.',
        },
      ],
      voice: {
        intro: '저항 두 개를 직렬과 병렬로 바꾸었을 때 전류가 어떻게 달라지는지 예상해 보세요.',
      },
      successMessage: '완벽합니다! 직렬·병렬 등가저항과 분기점 전류 보존 법칙(KCL)을 확인했습니다.',
    },

    // Step 3: 12-S03 Capacitor RC Transient
    {
      id: 'step-elec-s3-rc-transient',
      title: '3단계: 커패시터 충·방전과 RC 시간상수 (12-S03)',
      stepType: 'MANIPULATE',
      storyLead: '커패시터에 전하를 넣으면 순간적으로 꽉 찰까요?',
      prompt:
        '1시간상수(τ=RC) 후 커패시터의 충전 및 방전 전압을 먼저 예상하고, 저항과 커패시턴스를 변경하며 슬라이더를 움직여 충·방전 지수 곡선을 관찰한 뒤 올바른 이유를 고르세요.',
      detailExplanation:
        '• 1차 RC 회로의 시간상수: τ = R × C. (1kΩ × 10µF = 0.01s = 10 ms).\n• 충전(Charge): Vc(t) = Vs × (1 − e^(−t/τ)).\n  - t = 0 ms: Vc = 0.00 V (0%)\n  - t = τ (10 ms): Vc = 5V × (1 − e^−1) ≈ 3.16 V (약 63.2%)\n  - t = 3τ (30 ms): Vc ≈ 4.75 V (약 95.0%)\n• 방전(Discharge): Vc(t) = V0 × e^(−t/τ).\n  - 만충전(5V) 기준 t = τ (10 ms): Vc = 5V × e^−1 ≈ 1.84 V (약 36.8%)\n• R이나 C가 2배로 커지면 τ도 2배(20ms)로 늘어나 충·방전에 걸리는 지연 시간이 길어집니다.\n※ DRAM은 커패시터 전하가 영구 유지되지 않고 누설되므로 주기적 리프레시가 필요하다는 점과 연결됩니다.',
      whyExplanation:
        '커패시터 전류 i(t) = C · (dVc/dt) 이며, 저항의 전압 강하는 Vs − Vc(t) = i(t) · R 입니다. 이 미분방정식을 풀면 지수함수 e^(−t/RC) 형태의 과도 응답(Transient Response)이 유도됩니다. 충전이 진행될수록 커패시터의 역전압이 높아져 전류가 줄어들기 때문에 전압 상승률이 점차 완만해집니다.',
      simulatorType: 'elec-rc-delay',
      physicsAssumptions: '1차 RC 지수응답 근사 모형, 기생 저항/인덕턴스 무시, 이상적 선형 커패시터',
      sourceRefs: ['Sedra & Smith, Microelectronic Circuits (Ch. 1 Signals and Amplifiers, RC filters)'],
      initialParams: {
        mode: 'charge',
        rOhms: 1000,
        cMicroFarads: 10,
        timeMs: 0,
        rcInitialVoltageV: 0,
        rcSegmentStartMs: 0,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: R=1kΩ, C=10µF, 5V 충전 시 1시간상수(τ=10ms) 뒤 전압은?',
          type: 'radioGroup',
          options: [
            {
              label: '약 63%에 도달하여 약 3.16V가 되고, 방전 10ms 뒤엔 약 1.84V가 돼요.',
              value: 'tau-63',
            },
            {
              label: '10ms 후 정확히 100%인 5.0V까지 완전히 충전돼요.',
              value: 'tau-100',
              misconception:
                'RC 회로는 지수함수(1 - e^-1) 곡선을 따르므로 1τ에서 약 63.2%에 도달해요.',
            },
            {
              label: '전원을 끊으면 방전 시간과 상관없이 즉시 0V로 떨어져요.',
              value: 'instant-zero',
              misconception:
                '커패시터는 전하를 저장하므로 저항을 통해 지수적으로 서서히 방전됩니다.',
            },
          ],
        },
        {
          id: 'mode',
          label: '충전/방전 모드 (Mode)',
          type: 'radioGroup',
          options: [
            { label: '충전 (Charge - 5V 전원 공급)', value: 'charge' },
            { label: '방전 (Discharge - 저항 방전)', value: 'discharge' },
          ],
        },
        {
          id: 'rOhms',
          label: '저항 R (Resistance)',
          type: 'radioGroup',
          options: [
            { label: '1 kΩ (기본)', value: 1000 },
            { label: '2 kΩ (저항 2배 → 지연 증가)', value: 2000 },
          ],
        },
        {
          id: 'cMicroFarads',
          label: '커패시턴스 C (Capacitance)',
          type: 'radioGroup',
          options: [
            { label: '10 µF (기본)', value: 10 },
            { label: '20 µF (용량 2배 → 지연 증가)', value: 20 },
          ],
        },
        {
          id: 'timeMs',
          label: '가상 경과 시간 (t in ms)',
          type: 'slider',
          min: 0,
          max: 100,
          step: 5,
        },
        {
          id: 'answer',
          label: '개념 확인: RC 회로에서 충·방전 속도를 결정하는 물리적 원리는?',
          type: 'radioGroup',
          options: [
            {
              label: '시간상수 τ=R·C에 따라 지수적으로 전압이 변하며, R이나 C가 커지면 지연이 늘어나요.',
              value: 'tau-exponential',
            },
            {
              label: '전압은 항상 시간에 비례하여 직선(선형)으로 충전돼요.',
              value: 'linear',
              misconception:
                '커패시터에 전하가 쌓일수록 역전압이 커져 충전 전류가 줄어들므로 지수곡선을 그립니다.',
            },
            {
              label: '커패시터는 저항과 상관없이 항상 1ms 안에 완충돼요.',
              value: 'always-1ms',
              misconception:
                '저항 R이 전류 유입 속도를 제한하므로 R과 C의 곱이 시간을 결정합니다.',
            },
          ],
        },
      ],
      rules: [
        {
          label: '충전 1τ (10ms) 전압 관찰',
          targetKey: 'history',
          operator: 'contains',
          expected: 'charge-tau',
          feedbackIfFail: '1kΩ·10µF 충전 모드에서 시간을 10ms 이상으로 올려 3.16V를 확인하세요.',
        },
        {
          label: '방전 1τ (10ms) 전압 관찰',
          targetKey: 'history',
          operator: 'contains',
          expected: 'discharge-tau',
          feedbackIfFail: '방전 모드로 전환한 뒤 10ms에서 전압이 1.84V로 떨어지는 것을 확인하세요.',
        },
        {
          label: 'R 또는 C 증가 시 τ 증가 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'new-tau',
          feedbackIfFail: '저항을 2kΩ으로 또는 용량을 20µF로 변경해 시간상수가 늘어나는 것을 확인하세요.',
        },
        {
          label: '시간상수와 지수 응답 이해',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'tau-exponential',
          feedbackIfFail: '시간상수 τ=RC와 지수함수적 전압 변화를 선택하세요.',
        },
      ],
      hints: [
        {
          level: 1,
          title: '시간상수 타우(τ)',
          description: '저항(R)과 커패시턴스(C)를 곱한 값이 63%까지 차오르는 기준 시간이에요.',
          voiceLine: '시간상수 타우는 약 63퍼센트까지 충전되는 기준 시간입니다.',
        },
        {
          level: 2,
          title: '지수함수 곡선',
          description: '처음에는 빠르게 차오르지만 뒤로 갈수록 천천히 충전됩니다.',
          voiceLine: '커패시터에 전압이 찰수록 들어오는 전류가 줄어 완만해집니다.',
        },
        {
          level: 3,
          title: '지연 시간의 증가',
          description: '저항이 커지면 전류가 좁아지고, 용량이 커지면 채울 물통이 커져 시간이 더 걸립니다.',
          voiceLine: '저항이나 용량이 커지면 신호가 도달하는 지연 시간이 늘어납니다.',
        },
      ],
      voice: {
        intro: '시간 눈금을 움직이기 전에 10밀리초 뒤 전압이 얼마나 될지 먼저 예상해 보세요.',
      },
      successMessage: '정답입니다! 커패시터 충·방전 곡선과 RC 시간상수(τ=RC)의 공학적 의미를 파악했습니다.',
    },

    // Step 4: 12-S04 Power, Energy, Heat
    {
      id: 'step-elec-s4-power-energy',
      title: '4단계: 전력(W)과 에너지(J), 커패시터 정전에너지(½CV²) (12-S04)',
      stepType: 'MANIPULATE',
      storyLead: '똑같이 5V인데 어떤 회로는 뜨겁고 어떤 회로는 거의 안 뜨거울까요?',
      prompt:
        '5V·10mA를 10초 사용할 때의 전력과 누적 에너지를 먼저 예상하고, 전압·부하전류·작동시간을 조작하며 소비 전력(W)과 총 에너지(J), 커패시터 저장 에너지를 비교한 뒤 올바른 이유를 고르세요.',
      detailExplanation:
        '• 전력 (Power, P): 단위 시간당 소비되거나 공급되는 에너지의 변환 속도.\n  - P = V × I (단위: W, 와트 = J/s).\n  - 5V × 10mA = 50 mW (0.05 W).\n• 에너지 (Energy, E): 특정 시간(t) 동안 누적된 총 일의 양.\n  - E = P × t (단위: J, 줄 = W·s).\n  - 50mW × 10s = 0.5 J (500 mJ).\n• 커패시터 정전 에너지: Ecap = ½ × C × V².\n  - 10µF, 5V: ½ × 10e−6 × 25 = 125 µJ.\n  - 10µF, 10V: ½ × 10e−6 × 100 = 500 µJ (전압 2배 시 에너지는 4배!).\n※ 전력은 발열의 속도(단위 시간당 열)이고, 에너지는 냉각 시스템이 흡수해야 할 누적 열량입니다.',
      whyExplanation:
        'P = dE/dt 이므로 전력은 순간적인 소모 속도이며 에너지는 이를 시간에 대해 적분한 누적 총량입니다. 또한 커패시터 충전 시 전하 dq를 전위 v로 끌어올리는 일 dW = v dq = (q/C) dq 를 적분하면 E = ½ q²/C = ½ C V² 가 되어 전압의 제곱에 비례합니다.',
      simulatorType: 'elec-power-energy',
      physicsAssumptions: '일정 전류 가상 부하(독립 직류원), 이상적 효율, 열 분산 위치는 단순화',
      sourceRefs: ['Horowitz & Hill, The Art of Electronics (Ch. 1 Foundations: Power & Energy)'],
      initialParams: {
        powerVolts: 5,
        loadMilliAmps: 10,
        seconds: 10,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 5V·10mA를 10초간 사용할 때 전력과 소비 에너지는?',
          type: 'radioGroup',
          options: [
            {
              label: '전력은 50mW, 10초 에너지는 0.5J이며 커패시터(10µF) 전압 2배 시 에너지는 4배가 돼요.',
              value: 'pred-power-energy',
            },
            {
              label: '전력 50W와 에너지 50J는 단위만 다를 뿐 항상 같은 값이에요.',
              value: 'same-num',
              misconception:
                '전력(W)은 초당 에너지(J/s)이며, 총 에너지는 전력에 시간(s)을 곱해야 합니다.',
            },
            {
              label: '커패시터 전압이 2배가 되면 저장 에너지는 정확히 2배만 증가해요.',
              value: 'cap-double-only',
              misconception:
                '커패시터 정전에너지는 E = ½CV²로 전압의 제곱에 비례하므로 4배가 됩니다.',
            },
          ],
        },
        {
          id: 'powerVolts',
          label: '공급 전압 (Voltage V)',
          type: 'radioGroup',
          options: [
            { label: '5 V (기본)', value: 5 },
            { label: '10 V (전압 2배 → 정전에너지 4배)', value: 10 },
          ],
        },
        {
          id: 'loadMilliAmps',
          label: '부하 전류 (Load Current I)',
          type: 'radioGroup',
          options: [
            { label: '5 mA', value: 5 },
            { label: '10 mA (기본)', value: 10 },
          ],
        },
        {
          id: 'seconds',
          label: '작동 시간 (Duration t)',
          type: 'radioGroup',
          options: [
            { label: '1 초 (순간 에너지)', value: 1 },
            { label: '10 초 (누적 에너지)', value: 10 },
          ],
        },
        {
          id: 'answer',
          label: '개념 확인: 전력(W)과 에너지(J)의 핵심 차이점은?',
          type: 'radioGroup',
          options: [
            {
              label: '전력(W)은 단위 시간당 에너지 변환율(J/s)이고, 에너지(J)는 시간 동안 누적된 총량이에요.',
              value: 'power-vs-energy',
            },
            {
              label: '전력은 배터리에 저장된 양이고, 에너지는 전선에서 흐르는 양이에요.',
              value: 'reversed',
              misconception:
                '에너지가 저장 및 누적되는 물리량(J)이고 전력은 소비 속도(W)입니다.',
            },
            {
              label: '둘은 완전히 동일한 단위이며 표기법만 달라요.',
              value: 'identical',
              misconception:
                '1W = 1 J/s 로 시간 차원이 결합된 서로 다른 차원의 물리량입니다.',
            },
          ],
        },
      ],
      rules: [
        {
          label: '5V·10mA·10s 기준 전력/에너지 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'base-energy',
          feedbackIfFail: '5V, 10mA, 10초를 설정하여 P=50mW 및 E=0.5J를 확인하세요.',
        },
        {
          label: '10V 설정 시 커패시터 에너지 4배 확인',
          targetKey: 'history',
          operator: 'contains',
          expected: 'cap-doubled',
          feedbackIfFail: '전압을 10V로 올려 커패시터 정전에너지가 4배(500µJ)가 되는 것을 확인하세요.',
        },
        {
          label: '전력(W)과 에너지(J)의 물리적 차이 이해',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'power-vs-energy',
          feedbackIfFail: '전력은 단위 시간당 소비율(J/s)이고 에너지는 누적량임을 선택하세요.',
        },
      ],
      hints: [
        {
          level: 1,
          title: '속도와 누적량',
          description: '시속 100km는 속도이고 1시간 달린 100km는 총 거리예요. 전력과 에너지도 같습니다.',
          voiceLine: '전력은 에너지의 소비 속도이고 에너지는 쌓인 총량입니다.',
        },
        {
          level: 2,
          title: '전압의 제곱 법칙',
          description: '커패시터 에너지 공식 E = ½ C V² 에서 V가 두 배면 제곱되어 4배가 됩니다.',
          voiceLine: '커패시터에 저장되는 에너지는 전압의 제곱에 비례합니다.',
        },
        {
          level: 3,
          title: '발열과 냉각 예산',
          description: '전력은 순간적으로 발생하는 열의 세기이고, 에너지는 냉각기가 식혀야 할 열의 총합입니다.',
          voiceLine: '반도체 칩에서 전력은 발열 속도를, 에너지는 총 발열량을 결정합니다.',
        },
      ],
      voice: {
        intro: '5볼트와 10밀리암페어를 골랐을 때 전력과 에너지가 어떻게 계산되는지 관찰해 보세요.',
      },
      successMessage: '축하합니다! 전력(W)과 에너지(J), 커패시터 전압 제곱 법칙을 완벽히 이해했습니다.',
    },
  ],
};
