import type { Lesson } from '../../types';

export const mosfetLesson: Lesson = {
  id: 'semiconductor-mosfet-fundamentals',
  courseId: 'course-semiconductor',
  slug: 'mosfet-to-logic-inverter',
  title: 'MOSFET에서 논리 0/1과 NOT 게이트로',
  subtitle: '반도체 채널 형성부터 디지털 인버터 회로까지 완결형 스토리',
  description: '게이트 전압으로 전도 채널을 열고, 드레인 전압으로 전류를 흘린 뒤, 풀다운 스위치를 결합해 디지털 컴퓨터의 기본 소자인 NOT 게이트를 완성하는 완결형 공학 실습입니다.',
  category: 'semiconductor',
  steps: [
    // Step 1: 문턱 전압과 채널 형성
    {
      id: 'step-mosfet-s1-channel',
      title: '1단계: 왜 전압을 올리면 전도 채널이 생길까?',
      stepType: 'MANIPULATE',
      storyLead: '트랜지스터는 어떻게 기계적 접점 없이 전기를 통하게 할까요? 실리콘 기판 속 전자의 움직임을 직접 관찰해봅시다.',
      prompt: '게이트 전압 V_GS 슬라이더를 서서히 올려 문턱 전압(V_th = 0.7V) 이상으로 만들어보세요. 산화막 아래에 전자가 모여 소스와 드레인을 잇는 푸른색 전도 채널이 생기는지 확인하세요.',
      detailExplanation: 'MOSFET의 게이트에 양(+)의 전압을 걸면, 얇은 이산화규소(SiO2) 절연막을 통과하는 수직 전계(Electric Field)가 형성됩니다. 이 전계가 P형 기판 깊은 곳에 흩어져 있던 소수 캐리어인 전자(e-)들을 산화막 바로 아래로 강하게 끌어당깁니다. 전압이 문턱 전압(0.7V)에 도달하면, 전자들이 충분히 모여 P형 표면이 N형처럼 전기를 통하는 "반전층(Inversion Layer)" 채널로 바뀝니다.',
      whyExplanation: '금속-산화막-반도체(MOS) 구조는 일종의 평행판 커패시터와 같습니다. 게이트에 양전하가 축적되면 반대편 반도체 표면에는 음전하(전자)가 유도됩니다. 이 전자들의 밀도가 기판 본래의 정공 밀도를 넘어서는 순간을 "강한 반전(Strong Inversion)"이라고 하며, 이때의 전압이 바로 문턱 전압(Threshold Voltage, V_th)입니다.',
      simulatorType: 'mosfet',
      initialParams: {
        vgs: 0.0,
        vds: 0.0,
      },
      controls: [
        {
          id: 'vgs',
          label: '게이트 전압 (V_GS)',
          unit: 'V',
          type: 'slider',
          min: 0.0,
          max: 2.5,
          step: 0.1,
        },
      ],
      rules: [
        {
          targetKey: 'vgs',
          operator: 'between',
          expected: [0.8, 1.8],
          feedbackIfFail: '게이트 전압 V_GS가 문턱 전압(0.7V) 미만이거나 너무 높습니다. 0.8V ~ 1.8V 사이로 설정하여 안정적인 전도 채널을 형성하세요.',
          voiceIfFail: '게이트 전압이 부족합니다. 슬라이더를 올려 문턱 전압 0.7볼트를 넘겨보세요.',
        },
      ],
      successMessage: '완벽합니다! 문턱 전압을 넘어 P형 기판 표면에 전자 반전 채널이 성공적으로 연결되었습니다.',
      successVoice: '완벽합니다! 문턱 전압을 넘어 전도 채널이 성공적으로 연결되었습니다.',
      voice: {
        intro: '반도체 스위치인 모스펫의 원리를 알아봅시다. 게이트 전압 슬라이더를 올려 문턱 전압 0.7볼트 이상으로 만들어보세요.',
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
          title: '직관 질문: 전압을 올리면 전자가 어디로 이동할까요?',
          description: '게이트 전극에 양(+)전압을 가하면, 음(-)전하를 띤 전자들이 게이트 산화막 쪽으로 끌려옵니다.',
          voiceLine: '양전압을 가하면 음전하를 띤 전자가 게이트 산화막 쪽으로 끌려옵니다.',
        },
        {
          level: 2,
          title: '조작 안내: 슬라이더를 0.7V 이상으로 드래그',
          description: 'V_GS 슬라이더를 오른쪽으로 밀어 0.8V 이상으로 설정해보세요. 눈금에 자석 스냅이 걸립니다.',
          voiceLine: '슬라이더를 오른쪽으로 밀어 0.8볼트 이상으로 설정해보세요.',
        },
        {
          level: 3,
          title: '목표 조건',
          description: 'V_GS를 1.0V ~ 1.5V 사이로 맞추고 하단의 [확인하기 (Check)] 버튼을 클릭하세요.',
          voiceLine: '게이트 전압을 1.2볼트 근처로 맞추고 확인하기 버튼을 누르세요.',
        },
      ],
    },

    // Step 2: 채널이 생기면 무조건 전류가 흐를까?
    {
      id: 'step-mosfet-s2-vds-drift',
      title: '2단계: 채널이 생기면 무조건 전류가 흐를까?',
      stepType: 'MANIPULATE',
      storyLead: '채널 고속도로는 열렸습니다. 그런데 드레인-소스 간 전압이 0V라면 전자가 스스로 달릴 수 있을까요?',
      prompt: '현재 V_GS = 1.5V로 채널이 활짝 열려 있지만, V_DS = 0V이므로 전류 I_D = 0mA입니다. 드레인 전압 V_DS를 0.8V 이상으로 올려 전자를 끌어당기는 수평 전계를 만들고 전류를 흘려보세요.',
      detailExplanation: '채널은 전자가 이동할 수 있는 통로일 뿐입니다. 전자가 실제로 소스에서 드레인으로 이동(전류는 드레인에서 소스로 유입)하려면, 양쪽 단자 사이에 위치 에너지 차이, 즉 드레인-소스 전압(V_DS)에 의한 수평 전계가 필요합니다. V_DS가 증가할수록 전류가 흐르고, V_DS >= V_GS - V_th에 이르면 드레인 쪽 채널이 가늘어지는 핀치오프(Pinch-off)가 발생하며 전류가 포화 상태에 도달합니다.',
      whyExplanation: '전하의 이동 속도(드리프트 속도)는 v = μ * E_x로, 수평 전계 E_x = V_DS / L에 비례합니다. V_DS = 0이면 전기적 추진력이 0이므로 순 전류는 0입니다. V_DS를 가해야 비로소 전자가 방향성 있게 이동합니다.',
      simulatorType: 'mosfet',
      initialParams: {
        vgs: 1.5,
        vds: 0.0,
      },
      controls: [
        {
          id: 'vds',
          label: '드레인 전압 (V_DS)',
          unit: 'V',
          type: 'slider',
          min: 0.0,
          max: 3.0,
          step: 0.1,
        },
      ],
      rules: [
        {
          targetKey: 'vds',
          operator: 'gte',
          expected: 0.8,
          feedbackIfFail: '드레인 전압 V_DS가 너무 낮아 전자를 밀어낼 수평 추진력이 부족합니다. V_DS를 0.8V 이상으로 올려보세요.',
          voiceIfFail: '드레인 전압이 낮습니다. 슬라이더를 0.8볼트 이상으로 올려보세요.',
        },
      ],
      successMessage: '훌륭합니다! 드레인 전압 차이에 의해 수평 전계가 형성되어 드레인 전류 I_D가 힘차게 흐르고 있습니다.',
      successVoice: '훌륭합니다! 드레인 전압 차이에 의해 드레인 전류가 흐르고 있습니다.',
      voice: {
        intro: '채널이 있어도 전압 차이가 없으면 전류가 흐르지 않습니다. 드레인 전압 슬라이더를 올려 전자를 움직여보세요.',
        milestone: {
          triggerParam: 'vds',
          threshold: 0.8,
          direction: 'above',
          speech: '드레인 전압이 인가되어 전자가 이동하며 전류가 흐르기 시작합니다.',
        },
        explanation: '수평 전계에 의해 전자가 소스에서 드레인으로 이동하며, 드레인 전류가 정상적으로 관측됩니다.',
      },
      hints: [
        {
          level: 1,
          title: '직관: 평평한 파이프 속의 물',
          description: '파이프가 열려 있어도 양 끝의 높이 차이가 없으면 물이 흐르지 않듯, 전압 차이(V_DS)가 있어야 전류가 흐릅니다.',
        },
        {
          level: 2,
          title: '조작 안내',
          description: 'V_DS 슬라이더를 드래그하여 1.0V 이상으로 설정해보세요. 우측 미니 그래프의 전류 수치가 상승합니다.',
        },
        {
          level: 3,
          title: '목표 조건',
          description: 'V_DS를 1.0V ~ 2.0V 사이로 맞추고 확인하기를 누르세요.',
        },
      ],
    },

    // Step 3: 반전: nMOS가 켜졌다는 건 출력 논리 '1'인가?
    {
      id: 'step-mosfet-s3-inverter-reversal',
      title: '3단계: nMOS가 켜졌다는 건 출력 논리 1일까?',
      stepType: 'MANIPULATE',
      storyLead: '많은 공학 입문자들이 "트랜지스터가 켜졌으니(ON), 출력도 HIGH(1)겠지?"라고 오해합니다. 회로를 직접 조작해 이 반전을 확인해봅시다!',
      prompt: '전원 V_DD(+5V)와 풀업 저항, nMOS 풀다운 스위치로 연결된 인버터 회로입니다. 입력 V_in 버튼을 클릭해 HIGH(+5V)로 만들어보세요. 스위치가 켜질 때, 출력 V_out이 오히려 0V(LOW)로 떨어지는 반전 현상을 확인하세요.',
      detailExplanation: 'nMOS 트랜지스터는 출력 노드를 접지(GND = 0V) 쪽으로 잡아당기는 "풀다운(Pull-Down)" 스위치 역할을 합니다. \n• 입력이 LOW(0V)일 때: nMOS가 OFF(차단)되어 접지와 분리되므로, 풀업 저항을 통해 출력 노드가 전원(+5V = HIGH)으로 유지됩니다.\n• 입력이 HIGH(5V)일 때: nMOS가 ON(도통)되어 출력 노드가 저항이 매우 작은 nMOS를 통해 접지(0V = LOW)로 강력히 당겨집니다!\n즉, "트랜지스터 ON = 출력 LOW(0)"입니다!',
      whyExplanation: '이 회로는 풀업 저항(Rd)과 nMOS의 온저항(Ron)으로 이루어진 전압 분배기(Voltage Divider)입니다. nMOS가 켜지면 Ron(약 100Ω)이 Rd(10,000Ω)보다 훨씬 작아지므로 대부분의 전압 강하가 Rd에서 일어나고 출력 노드는 0V 근처로 떨어집니다.',
      simulatorType: 'inverter',
      initialParams: {
        vin: 0.0,
      },
      controls: [
        {
          id: 'vin',
          label: '게이트 입력 전압 (V_in)',
          type: 'toggle',
          options: [
            { label: 'LOW (0V / 논리 0)', value: 0.0 },
            { label: 'HIGH (5V / 논리 1)', value: 5.0 },
          ],
        },
      ],
      rules: [
        {
          targetKey: 'vin',
          operator: 'gte',
          expected: 2.5,
          feedbackIfFail: '입력 V_in을 HIGH(5V)로 토글하여 nMOS를 켜보세요. 출력이 접지로 당겨지는 것을 확인해야 합니다.',
          voiceIfFail: '입력 버튼을 눌러 하이 5볼트로 켜보세요.',
        },
      ],
      successMessage: '정답입니다! nMOS가 켜지면 출력이 접지(0V)로 단락되어 출력 논리가 0(LOW)으로 떨어지는 반전이 일어납니다!',
      successVoice: '정답입니다! 트랜지스터가 켜지면 출력이 접지로 당겨져 논리 0이 됩니다.',
      voice: {
        intro: '트랜지스터가 켜지면 출력이 1일까요? 직접 입력을 하이 5볼트로 토글하여 출력이 어떻게 변하는지 확인해보세요.',
        milestone: {
          triggerParam: 'vin',
          threshold: 2.5,
          direction: 'above',
          speech: '트랜지스터가 도통되어 출력이 접지 0볼트로 떨어졌습니다. 이것이 풀다운 반전입니다.',
        },
        explanation: '트랜지스터가 켜질 때 접지와 도통되므로 출력은 0이 됩니다. 이는 상식을 뒤집는 핵심 원리입니다.',
      },
      hints: [
        {
          level: 1,
          title: '스위치가 닫히면 어디와 연결될까요?',
          description: 'nMOS 스위치가 닫히면 출력 단자는 아래쪽 접지(0V)와 직접 연결됩니다.',
        },
        {
          level: 2,
          title: '조작 방법',
          description: '캔버스 내부의 입력 버튼이나 아래 토글 스위치를 눌러 HIGH(5V)로 변경하세요.',
        },
        {
          level: 3,
          title: '확인',
          description: 'V_in = 5.0V 상태에서 확인하기 버튼을 누르세요.',
        },
      ],
    },

    // Step 4: 응용: 진리표 완성 및 NOT 게이트 확인
    {
      id: 'step-mosfet-s4-not-gate-truth-table',
      title: '4단계: NOT 게이트 진리표 완성하기',
      stepType: 'CHECK',
      storyLead: '방금 실험한 회로는 입력 신호 0과 1을 정확히 반대로 뒤집는 디지털 컴퓨터의 핵심 부품, 바로 NOT 게이트(인버터)입니다!',
      prompt: '방금 실험한 NMOS 인버터의 논리 진리표를 완성하세요. 입력 0일 때의 출력과, 입력 1일 때의 출력을 올바르게 선택하고 확인하세요.',
      detailExplanation: '축하합니다! 여러분은 실리콘 반도체 물리 원리(수직 전계와 전도 채널)에서 출발하여, 실제 현대 컴퓨터 CPU를 구동하는 기본 논리 소자인 인버터(NOT Gate)의 동작 원리까지 완벽하게 증명해냈습니다. \n\n※ 실제 집적회로(IC)에서는 풀업 저항 대신 pMOS 트랜지스터를 상보적으로 배치하는 CMOS(Complementary MOS) 인버터를 사용하여 정적 전력 소모를 0에 가깝게 줄입니다.',
      whyExplanation: '부울 대수(Boolean Algebra)에서 NOT 연산은 Y = ~A 로 정의됩니다. 이 단순한 반전 기능이 NAND, NOR 등의 만능 게이트(Universal Gate)로 확장되어 모든 덧셈기, ALU, 메모리(SRAM)의 근간이 됩니다.',
      simulatorType: 'inverter',
      initialParams: {
        vin: 0.0,
        out0: null,
        out1: null,
      },
      controls: [
        {
          id: 'truthTable',
          label: '진리표 완성',
          type: 'truthTable',
        },
      ],
      rules: [
        {
          targetKey: 'out0',
          operator: 'eq',
          expected: 1,
          feedbackIfFail: '입력이 0(LOW, 트랜지스터 OFF)일 때, 출력은 풀업 저항을 통해 HIGH(1)이 되어야 합니다.',
          voiceIfFail: '입력이 0일 때 nMOS가 꺼지므로 출력은 1이 됩니다.',
        },
        {
          targetKey: 'out1',
          operator: 'eq',
          expected: 0,
          feedbackIfFail: '입력이 1(HIGH, 트랜지스터 ON)일 때, 출력은 접지로 풀다운되어 LOW(0)이 되어야 합니다.',
          voiceIfFail: '입력이 1일 때 nMOS가 켜지므로 출력은 0이 됩니다.',
        },
      ],
      successMessage: '대성공! 입력 0 → 출력 1, 입력 1 → 출력 0의 완벽한 NOT 게이트 진리표를 완성했습니다. 반도체 스위치에서 논리 신호로 이어지는 전 과정을 마스터하셨습니다!',
      successVoice: '대성공! 입력과 출력이 반전되는 완벽한 낫 게이트 진리표를 완성했습니다.',
      voice: {
        intro: '방금 만든 인버터의 진리표를 완성해봅시다. 입력 0일 때와 1일 때의 출력을 각각 선택하고 확인을 누르세요.',
        explanation: '축하합니다! 모스펫 소자 물리학에서 출발해 현대 디지털 컴퓨터의 심장인 논리 게이트까지 완결했습니다.',
      },
      hints: [
        {
          level: 1,
          title: '3단계의 결과를 떠올려보세요',
          description: '입력이 0V(OFF)일 때 LED는 켜졌나요? 입력이 5V(ON)일 때는 어땠나요?',
        },
        {
          level: 2,
          title: '반전 관계',
          description: '인버터(Inverter)는 입력을 거꾸로 뒤집는 소자입니다.',
        },
        {
          level: 3,
          title: '정답 선택 안내',
          description: '입력 0의 출력은 "1 (HIGH)", 입력 1의 출력은 "0 (LOW)"를 선택하세요.',
        },
      ],
    },
  ],
};
