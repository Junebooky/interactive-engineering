import type { Lesson } from '../../types';

export const mosfetLesson: Lesson = {
  id: 'semiconductor-mosfet-fundamentals',
  courseId: 'course-semiconductor',
  slug: 'mosfet-to-logic-inverter',
  title: 'MOSFET에서 논리 0/1과 NOT 게이트로',
  subtitle: '반도체 채널 형성부터 CMOS 디지털 인버터 회로까지 완결형 스토리',
  description: '게이트 전압으로 전도 채널을 열고, 드레인 전압으로 전류를 흘린 뒤, 저항형 풀다운을 거쳐 상보형 CMOS NOT 게이트를 완성하는 A05 2.5D 실시간 조작 기반 완결형 공학 실습입니다.',
  category: 'semiconductor',
  steps: [
    // Step 0: 개념 도입 (설명형 Step - 시뮬레이터 생략 가능 계약 검증)
    {
      id: 'step-mosfet-s0-concept',
      title: '개념 도입: 왜 반도체로 스위치를 만들까?',
      stepType: 'CONCEPT',
      storyLead: '물리적인 접점이나 마모되는 기계 부품 없이, 1초에 수십억 번 켜고 끌 수 있는 스위치는 어떻게 가능할까요?',
      prompt: '현대 모든 컴퓨터 칩은 기계적 접점 대신 실리콘 결정과 전계(Electric Field)를 이용해 전류를 제어하는 MOSFET 트랜지스터로 만들어집니다. 아래 원리를 읽고 학습을 시작하세요.',
      detailExplanation: 'MOSFET(금속-산화막-반도체 전계효과 트랜지스터)은 현대 집적회로의 가장 기초적인 단위 소자입니다. 물리적인 가동 부품이 전혀 없기 때문에 마모되지 않고 나노초(ns) 이하의 극도로 빠른 속도로 0과 1 신호를 스위칭할 수 있습니다.',
      whyExplanation: '컴퓨터의 덧셈, 기억, 통신은 모두 0과 1이라는 두 상태를 고속으로 전환하는 과정입니다. 반도체는 전압에 따라 도체(전류 통함)와 부도체(전류 차단)의 성질을 자유자재로 오갈 수 있어 이상적인 스위치 재료가 됩니다.',
      successMessage: 'MOSFET의 기본 개념을 확인했습니다. 이제 직접 게이트 전압을 조작해 전도 채널을 열어봅시다!',
      successVoice: '모스펫의 기본 개념을 확인했습니다. 직접 게이트 전압을 조작해 채널을 열어봅시다.',
      voice: {
        intro: '현대 컴퓨터의 심장인 반도체 트랜지스터의 세계에 오신 것을 환영합니다. 설명을 읽고 다음 단계로 넘어가보세요.',
        explanation: '반도체는 전압을 통해 전도성을 제어할 수 있는 신비로운 재료입니다.',
      },
    },

    // Step 1: M01-S01 / mosfet-field
    {
      id: 'step-mosfet-s1-channel',
      title: '1단계: 전압만으로 스위치를 열 수 있을까요? (M01-S01)',
      stepType: 'MANIPULATE',
      storyLead: '손으로 누르지 않아도 열리는 스위치가 있을까요? 게이트 전압을 올리면 실리콘 표면에서 어떤 변화가 생길까요?',
      prompt: '채널이 생길 것 같은 전압을 먼저 예상하고, V_GS 슬라이더를 0V부터 1.2V까지 조작해 산화막 아래 표면에 모이는 전자를 관찰한 뒤 올바른 원리를 고르세요.',
      detailExplanation: 'MOSFET 게이트에 양(+)전압을 가하면 절연막(SiO₂) 너머 실리콘 표면에 수직 전계가 형성됩니다. P형 기판 내부의 소수 캐리어인 전자들이 산화막 바로 아래 표면으로 끌어당겨져, 소스와 드레인을 잇는 전도 채널(반전층)이 형성됩니다.\n※ 본 실습은 교육용 장채널 모델(V_th=0.7V)을 따르며, V_DS=0일 때 순 DC 전류는 0입니다.',
      whyExplanation: '게이트의 전기장이 SiO₂ 절연막 너머 실리콘 표면의 전하 분포를 바꿔 반전층을 유도해요. 장채널 nMOS를 가정했고 문턱 아래 미세 전류·게이트 누설은 시각화하지 않았어요.',
      simulatorType: 'mosfet-field',
      initialParams: {
        vgs: 0.0,
        vds: 0.0,
        visited: [0],
        prediction: null,
        answer: null,
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 0, 0.6, 1.2V 중 가장 뚜렷한 채널이 생길 것 같은 값을 골라보세요',
          type: 'radioGroup',
          options: [
            { label: '0 V', value: '0' },
            { label: '0.6 V', value: '0.6' },
            { label: '1.2 V', value: '1.2' },
          ],
        },
        {
          id: 'vgs',
          label: '게이트 전압 (V_GS)',
          unit: 'V',
          type: 'slider',
          min: 0.0,
          max: 1.2,
          step: 0.1,
        },
        {
          id: 'answer',
          label: '개념 확인: 직접 관찰한 전자들은 어디에 모였나요?',
          type: 'radioGroup',
          options: [
            { label: '전자들이 산화막을 뚫고 게이트로 넘어갔어요.', value: 'oxide', misconception: '산화막은 절연체예요. 전기장은 영향을 주지만, 전자가 산화막을 통과하는 모습은 아니에요.' },
            { label: '게이트 아래 실리콘 표면에 전자들이 모였어요.', value: 'surface' },
            { label: '0.7 V 이하는 실제로 모든 전류가 완벽하게 0이에요.', value: 'zero', misconception: '문턱 아래에도 미세한 전류가 존재할 수 있어요. 이 화면에서만 단순화했어요.' },
            { label: '모든 MOSFET의 문턱은 언제나 0.7 V예요.', value: 'universal', misconception: '문턱 전압은 실제 소자·공정·온도에 따라 달라요. 0.7 V는 이 실험의 가정이에요.' },
          ],
        },
      ],
      rules: [
        {
          label: '낮은 전압(0V)과 높은 전압(≥0.8V)을 모두 관찰',
          targetKey: 'visited',
          operator: 'visitedLowHigh',
          expected: 0.8,
          feedbackIfFail: '전압을 직접 바꾸어 낮은 상태(0V)와 높은 상태(0.8V 이상)를 모두 비교해 보세요.',
          voiceIfFail: '슬라이더를 움직여 낮은 전압과 높은 전압을 모두 관찰해 보세요.',
        },
        {
          label: '관찰한 원리를 올바르게 설명',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'surface',
          feedbackIfFail: '전자는 산화막을 건너지 않고 바로 아래 실리콘 표면에 모여요.',
          voiceIfFail: '전자가 산화막을 통과하지 않고 표면에 모인다는 점을 기억하세요.',
        },
      ],
      successMessage: '완벽합니다! 게이트 전계에 의해 실리콘 표면에 전자 반전층이 형성되었음을 확인했습니다.',
      successVoice: '완벽합니다! 게이트 전계에 의해 실리콘 표면에 전자 반전층이 형성되었습니다.',
      voice: {
        intro: '전압을 천천히 올려보세요. 전자들이 어디에 모이는지 먼저 예상해 볼까요?',
        milestone: {
          triggerParam: 'vgs',
          threshold: 0.7,
          direction: 'above',
          speech: '문턱 전압 0.7볼트를 넘었습니다! 산화막 아래에 전도 채널이 열렸습니다.',
        },
        explanation: '수직 전계에 의해 전자가 집중되어 소스와 드레인 사이에 전류가 흐를 수 있는 고속도로가 개통되었습니다.',
      },
      hints: [
        {
          level: 1,
          title: '절연막의 성질',
          description: '절연막이 전자를 그대로 통과시키는 물질일까요?',
          voiceLine: '절연막이 전자를 그대로 통과시키는 물질일까요?',
        },
        {
          level: 2,
          title: '전자의 집결 위치',
          description: '전자는 산화막을 건너가나요, 실리콘 표면으로 모이나요?',
          voiceLine: '전자는 산화막을 건너가나요, 실리콘 표면으로 모이나요?',
        },
        {
          level: 3,
          title: '문턱 전압의 의미',
          description: '문턱 전압이 소자마다 달라질 가능성도 생각해 보세요.',
          voiceLine: '문턱 전압이 소자마다 달라질 가능성도 생각해 보세요.',
        },
      ],
    },

    // Step 2: M01-S02 / mosfet-current
    {
      id: 'step-mosfet-s2-vds-drift',
      title: '2단계: 길은 열렸는데, 전류가 왜 0일까요? (M01-S02)',
      stepType: 'MANIPULATE',
      storyLead: '채널이 분명히 생겼는데 전류계가 0을 가리키고 있어요. 양 끝의 전압이 같을 때도 전류가 흐를까요?',
      prompt: 'V_DS가 0V일 때와 1V일 때의 전류를 먼저 예상하고, V_DS 슬라이더를 움직여 수평 전계에 의해 전류가 흐르고 포화되는 과정을 관찰한 뒤 올바른 설명을 고르세요.',
      detailExplanation: '채널은 전자가 이동할 수 있는 통로일 뿐입니다. 전자가 실제로 소스에서 드레인으로 이동하려면 양쪽 단자 사이의 전위차(V_DS)에 의한 수평 전계가 필요합니다. V_DS가 증가하면 핀치오프가 발생하며 포화 영역에 도달하지만, 포화 영역에서도 전류는 0이 되지 않고 안정적으로 유지됩니다.',
      whyExplanation: '장채널 square-law 근사: 선형 영역 ID=kn[(VGS−Vth)VDS−VDS²/2], 포화 영역 ID=kn(VGS−Vth)²/2. 여기서 kn=2 mA/V², VGS=1.5 V예요. 채널 길이 변조·온도·누설은 생략했어요.',
      simulatorType: 'mosfet-current',
      initialParams: {
        vgs: 1.5,
        vds: 0.0,
        visited: [0],
        prediction: null,
        answer: null,
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: V_DS가 0V일 때와 1V일 때의 전류를 예상해 보세요',
          type: 'radioGroup',
          options: [
            { label: '채널만 열리면 둘 다 흐를 것 같아요.', value: 'always' },
            { label: '0 V에서는 0, 1 V에서는 흐를 것 같아요.', value: 'needs-voltage' },
            { label: '두 경우 모두 흐르지 않을 것 같아요.', value: 'never' },
          ],
        },
        {
          id: 'vds',
          label: '드레인 전압 (V_DS)',
          unit: 'V',
          type: 'slider',
          min: 0.0,
          max: 2.0,
          step: 0.1,
        },
        {
          id: 'answer',
          label: '개념 확인: 0V에서 출발하는 곡선과 포화 구간을 보고 가장 정확한 설명을 고르세요',
          type: 'radioGroup',
          options: [
            { label: '채널만 생기면 V_DS가 0이어도 순 전류가 흘러요.', value: 'channel-always', misconception: '채널은 통로이고, 순 전류에는 드레인과 소스 사이의 전압 차도 필요해요.' },
            { label: '전압 차가 있어야 흐르고, 포화되어도 전류가 유지돼요.', value: 'voltage-needed' },
            { label: '핀치오프가 되면 전류가 완전히 끊겨요.', value: 'saturation-zero', misconception: '핀치오프와 차단은 달라요. 이상 장채널 모형에서 포화 영역에도 전류는 흐릅니다.' },
            { label: '전자 이동과 관습 전류는 같은 방향이에요.', value: 'same-direction', misconception: '전자 이동은 소스→드레인, 관습 전류는 드레인→소스 방향으로 표시했어요.' },
          ],
        },
      ],
      rules: [
        {
          label: '낮은 전압(0V)과 높은 전압(≥1.0V)을 모두 관찰',
          targetKey: 'visited',
          operator: 'visitedLowHigh',
          expected: 1.0,
          feedbackIfFail: '드레인 전압 V_DS를 0V와 1V 이상으로 각각 조작하여 비교해 보세요.',
          voiceIfFail: '드레인 전압을 0V와 1V 이상으로 조작해 보세요.',
        },
        {
          label: '관찰한 원리를 올바르게 설명',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'voltage-needed',
          feedbackIfFail: '채널만으로는 부족해요. V_DS가 있어야 순 전류가 생기며 포화에서도 전류는 유지돼요.',
          voiceIfFail: '전압 차가 있어야 전류가 흐르고 포화 영역에서도 전류가 유지됩니다.',
        },
      ],
      successMessage: '훌륭합니다! 전압 차이가 전자를 움직이며, 포화 상태에서도 전류가 끊기지 않음을 확인했습니다.',
      successVoice: '훌륭합니다! 전압 차이가 전류를 만들며 포화 상태에서도 전류가 유지됩니다.',
      voice: {
        intro: '채널이 있는데도 전류가 0이에요. 드레인 전압을 바꾸면 어떻게 될까요?',
        milestone: {
          triggerParam: 'vds',
          threshold: 1.0,
          direction: 'above',
          speech: '드레인 전압이 가해져 전류가 흐르고 있습니다. 포화 영역에 도달했습니다.',
        },
        explanation: '수평 전계에 의해 전자가 소스에서 드레인으로 이동하며, 포화 영역에서도 일정한 전류가 유지됩니다.',
      },
      hints: [
        {
          level: 1,
          title: '전위차의 역할',
          description: '양 끝의 전압이 같으면 어떤 쪽으로 밀어줄까요?',
          voiceLine: '양 끝의 전압이 같으면 어떤 쪽으로 밀어줄까요?',
        },
        {
          level: 2,
          title: '원점 출발 확인',
          description: 'V_DS를 0에서 올릴 때 그래프가 어디에서 출발하나요?',
          voiceLine: '드레인 전압을 0에서 올릴 때 그래프가 어디에서 출발하나요?',
        },
        {
          level: 3,
          title: '포화와 전류 방향',
          description: '포화 영역에서 곡선이 0으로 내려가나요? 전자의 방향도 따로 보세요.',
          voiceLine: '포화 영역에서 곡선이 0으로 내려가나요? 전자의 방향도 따로 보세요.',
        },
      ],
    },

    // Step 3: M01-S03 / nmos-resistor-inverter
    {
      id: 'step-mosfet-s3-inverter-reversal',
      title: '3단계: nMOS가 ON인데 출력은 왜 LOW일까요? (M01-S03)',
      stepType: 'MANIPULATE',
      storyLead: '스위치가 켜졌으니 출력도 1일까요? 정말 그럴까요? 입력을 HIGH(5V)로 바꾸면 출력 전압은 어떻게 변할까요?',
      prompt: '입력 HIGH에서 출력 논리를 먼저 예상하고, 입력 토글을 눌러 0V와 5V 상태를 비교하며 출력이 약 0.45V(LOW)로 떨어지는 풀다운 반전을 관찰한 뒤 올바른 이유를 고르세요.',
      detailExplanation: 'nMOS 트랜지스터는 출력 노드를 접지(0V) 쪽으로 당기는 풀다운 스위치입니다. 입력이 5V일 때 nMOS가 도통되면, 10kΩ 풀업 저항과 nMOS의 유한한 온저항(약 100Ω) 간의 전압 분배에 의해 출력은 약 0.45V로 내려가며, 디지털 회로는 이를 논리 LOW(0)로 해석합니다.\n※ ON이어도 완전 0.000V 단락은 아닙니다.',
      whyExplanation: '저항형 인버터에서는 풀업 10 kΩ과 nMOS의 유한한 ON 저항이 전압을 나눠요. A02 PR #5의 Ron 모형을 그대로 사용해 Vin=5 V일 때 VOUT≈0.45 V입니다. 완전 단락이라고 부르지 않아요.',
      simulatorType: 'nmos-resistor-inverter',
      initialParams: {
        vin: 0.0,
        visited: [0],
        prediction: null,
        answer: null,
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 입력 HIGH(5V)에서 출력 논리를 먼저 골라보세요',
          type: 'radioGroup',
          options: [
            { label: '출력 1 (HIGH)', value: 'up' },
            { label: '출력 0 (LOW)', value: 'down' },
            { label: '입력과 항상 같음', value: 'same' },
          ],
        },
        {
          id: 'vin',
          label: '게이트 입력 전압 (V_in)',
          type: 'toggle',
          options: [
            { label: 'LOW (0V / 논리 0)', value: 0.0 },
            { label: 'HIGH (5V / 논리 1)', value: 5.0 },
          ],
        },
        {
          id: 'answer',
          label: '개념 확인: 5V를 넣었을 때 약 0.45V가 나온 이유를 설명해 보세요',
          type: 'radioGroup',
          options: [
            { label: 'nMOS ON 자체가 무조건 출력 비트 1을 뜻해요.', value: 'on-high', misconception: '스위치 ON/OFF와 논리 0/1은 같은 개념이 아니에요. 출력선이 어디에 연결되는지를 보세요.' },
            { label: '출력이 낮은 저항 경로를 통해 접지 근처로 당겨져요.', value: 'pulldown' },
            { label: '출력 V_OUT은 항상 입력 V_IN과 똑같은 전압이에요.', value: 'same', misconception: '출력 노드에서는 풀업 저항과 nMOS 온저항이 전압을 나누고 있어요.' },
            { label: 'nMOS가 켜지면 완전한 0 Ω이어서 정확히 0.000 V예요.', value: 'perfect', misconception: '유한한 ON 저항 때문에 이 toy 모형은 약 0.45 V이고 논리 LOW로 해석해요.' },
          ],
        },
      ],
      rules: [
        {
          label: '입력 0V와 5V를 모두 관찰',
          targetKey: 'visited',
          operator: 'visitedLowHigh',
          expected: 5.0,
          feedbackIfFail: '입력 토글 버튼을 눌러 0V와 5V 상태를 모두 확인해 보세요.',
          voiceIfFail: '입력 토글 버튼을 눌러 두 전압 상태를 모두 확인해 보세요.',
        },
        {
          label: '풀다운 반전 원리 이해',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'pulldown',
          feedbackIfFail: 'nMOS가 켜지면 출력 노드를 저항보다 낮은 경로로 접지 근처에 끌어내려요.',
          voiceIfFail: '출력이 낮은 저항 경로를 통해 접지 근처로 당겨집니다.',
        },
      ],
      successMessage: '정답입니다! nMOS가 도통되면 출력이 접지로 당겨져 논리 0이 되는 반전 원리를 완벽히 파악했습니다.',
      successVoice: '정답입니다! 트랜지스터가 켜지면 출력이 접지로 당겨져 논리 0이 됩니다.',
      voice: {
        intro: '출력선이 어디에 연결되는지 보세요. 스위치가 켜지면 어떤 일이 일어날까요?',
        milestone: {
          triggerParam: 'vin',
          threshold: 2.5,
          direction: 'above',
          speech: '트랜지스터가 켜지며 출력이 약 0.45볼트 로우로 떨어졌습니다.',
        },
        explanation: '트랜지스터가 켜질 때 접지와 연결되므로 출력은 0이 됩니다. 이는 상식을 뒤집는 핵심 원리입니다.',
      },
      hints: [
        {
          level: 1,
          title: '스위치 닫힘 경로',
          description: '스위치가 닫힐 때 출력이 전원 쪽일까요, 접지 쪽일까요?',
          voiceLine: '스위치가 닫힐 때 출력이 전원 쪽일까요, 접지 쪽일까요?',
        },
        {
          level: 2,
          title: '저항 크기 비교',
          description: '풀업 저항 10 kΩ과 아래쪽 스위치 경로를 비교해 보세요.',
          voiceLine: '풀업 저항 10킬로옴과 아래쪽 스위치 경로를 비교해 보세요.',
        },
        {
          level: 3,
          title: '논리 0 전압 마진',
          description: '정확히 0 V가 아닌 약 0.45 V도 논리 0일 수 있을까요?',
          voiceLine: '정확히 0V가 아닌 약 0.45V도 논리 0일 수 있을까요?',
        },
      ],
    },

    // Step 4: M01-S04 / cmos-not-gate (신규 CMOS 상보 토폴로지)
    {
      id: 'step-mosfet-s4-cmos-not-gate',
      title: '4단계: 상보적인 두 스위치로 CMOS NOT 완성하기 (M01-S04)',
      stepType: 'CHECK',
      storyLead: '저항 대신 위에 pMOS를 하나 더 넣었어요. 뭐가 달라질까요? 입력이 0과 1일 때 위아래 소자 중 누가 켜질까요?',
      prompt: '입력 0V에서 위쪽 pMOS 상태를 먼저 예상하고, 입력 토글을 움직여 상보적인 두 스위치의 동작을 관찰한 뒤 CMOS NOT 진리표를 완성하세요.',
      detailExplanation: 'CMOS(Complementary MOS) 인버터는 상단 pMOS 풀업과 하단 nMOS 풀다운을 상보적으로 구동합니다.\n• 입력 0(LOW): pMOS ON, nMOS OFF → 출력 +5V(HIGH, 1)\n• 입력 1(HIGH): pMOS OFF, nMOS ON → 출력 0V(LOW, 0)\n정지 상태에서 전원(VDD)에서 접지(GND)로의 직류 관통 경로가 차단되므로 정적 전력 소모를 극적으로 줄입니다.',
      whyExplanation: 'CMOS는 pMOS 풀업과 nMOS 풀다운을 상보적으로 구동해 안정 상태에서 직접 VDD→GND 관통 경로를 억제해요. 실제 회로에는 누설 및 스위칭 전력이 존재합니다. 이는 이전의 저항형 nMOS 회로와 다른 토폴로지예요.',
      simulatorType: 'cmos-not-gate',
      initialParams: {
        vin: 0.0,
        visited: [0],
        prediction: null,
        out0: null,
        out1: null,
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 입력 0V에서 위쪽 pMOS 상태를 예상해 보세요',
          type: 'radioGroup',
          options: [
            { label: 'pMOS ON (도통)', value: 'pmos-on' },
            { label: 'nMOS만 ON', value: 'nmos-on' },
            { label: '둘 다 ON', value: 'both-on' },
          ],
        },
        {
          id: 'vin',
          label: '게이트 입력 전압 (V_in)',
          type: 'toggle',
          options: [
            { label: 'LOW (0V / 논리 0)', value: 0.0 },
            { label: 'HIGH (5V / 논리 1)', value: 5.0 },
          ],
        },
        {
          id: 'truthTable',
          label: 'CMOS NOT 게이트 진리표 완성',
          type: 'truthTable',
        },
      ],
      rules: [
        {
          label: '입력 0V와 5V 모두 관찰',
          targetKey: 'visited',
          operator: 'visitedLowHigh',
          expected: 5.0,
          feedbackIfFail: '입력 0V와 5V 상태를 모두 토글하여 상단 pMOS와 하단 nMOS의 동작을 관찰하세요.',
          voiceIfFail: '입력을 0볼트와 5볼트로 모두 토글해 보세요.',
        },
        {
          label: '입력 0일 때 출력 (out0)',
          targetKey: 'out0',
          operator: 'eq',
          expected: 1,
          feedbackIfFail: '입력이 0(LOW)일 때 위쪽 pMOS가 켜지므로 출력은 HIGH(1)이어야 합니다.',
          voiceIfFail: '입력이 0일 때 pMOS가 켜지므로 출력은 1이 됩니다.',
        },
        {
          label: '입력 1일 때 출력 (out1)',
          targetKey: 'out1',
          operator: 'eq',
          expected: 0,
          feedbackIfFail: '입력이 1(HIGH)일 때 아래쪽 nMOS가 켜지므로 출력은 LOW(0)이어야 합니다.',
          voiceIfFail: '입력이 1일 때 nMOS가 켜지므로 출력은 0이 됩니다.',
        },
      ],
      successMessage: '대성공! 상보형 pMOS와 nMOS로 구동되는 완벽한 CMOS NOT 게이트 진리표를 완성했습니다. 다음 단계에서는 이 0과 1 비트를 기억하는 DRAM으로 연결됩니다!',
      successVoice: '대성공! 입력과 출력이 반전되는 완벽한 시모스 낫 게이트 진리표를 완성했습니다.',
      voice: {
        intro: '이번에는 위쪽에 pMOS가 있어요. 입력을 바꾸면서 두 소자가 어떻게 번갈아 움직이는지 보세요.',
        explanation: '축하합니다! 모스펫 소자 물리학에서 출발해 현대 디지털 컴퓨터의 심장인 시모스 논리 게이트까지 완결했습니다.',
      },
      hints: [
        {
          level: 1,
          title: '입력 0에서의 pMOS',
          description: '입력 0에서는 위쪽 pMOS가 켜질까요?',
          voiceLine: '입력 0에서는 위쪽 pMOS가 켜질까요?',
        },
        {
          level: 2,
          title: '입력 1에서의 nMOS',
          description: '입력 1에서는 아래쪽 nMOS가 켜질까요?',
          voiceLine: '입력 1에서는 아래쪽 nMOS가 켜질까요?',
        },
        {
          level: 3,
          title: '이상적 정지 상태와 실제 전력',
          description: '이상적인 정지 상태의 관통경로와 실제 스위칭·누설 전력은 다르답니다.',
          voiceLine: '이상적인 정지 상태의 관통경로와 실제 스위칭 누설 전력은 다르답니다.',
        },
      ],
    },
  ],
};
