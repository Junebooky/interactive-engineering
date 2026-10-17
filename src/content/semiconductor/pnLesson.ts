import type { Lesson } from '../../types';

export const pnLesson: Lesson = {
  id: 'pn-doping-foundations',
  courseId: 'course-semiconductor',
  category: 'semiconductor',
  slug: 'pn-doping-foundations',
  title: '11. 반도체 밴드·도핑·PN 접합과 MOS 기초',
  subtitle: '에너지 밴드갭, Donor/Acceptor 도핑, 확산과 드리프트의 평형, 공핍폭 바이어스, 다이오드 지수 전류',
  description:
    '실리콘이 왜 도체도 부도체도 아닌지, 5가(P)와 3가(B) 원자가 어떻게 다수 운반자를 결정하는지, PN 접합 시 형성되는 내장 전계와 열평형, 역·순바이어스에 따른 공핍폭 W(µm)의 물리적 변화, 그리고 쇼클리 다이오드 지수 전류와 절연된 MOS 게이트의 차이를 대화형 2.5D 시뮬레이션으로 탐구합니다.',
  steps: [
    // Step 0: Concept Intro
    {
      id: 'step-pn-s0-intro',
      title: '개념 도입: 실리콘의 에너지띠와 반도체의 출발',
      stepType: 'CONCEPT',
      storyLead: '실리콘은 금속처럼 전기가 잘 통하지도, 유리처럼 완전히 막지도 못합니다. 그 이유는 무엇일까요?',
      prompt:
        '물질 안에서 전자가 존재할 수 있는 에너지 구역을 "허용된 띠(Band)"라고 부르며, 전자가 존재할 수 없는 에너지 간격을 "금지대" 혹은 "밴드갭(Bandgap, Eg)"이라고 합니다. 아래 버튼을 눌러 반도체의 에너지 구조를 직접 확인해 보세요.',
      detailExplanation:
        '• 도체(금속): 전도띠(Conduction Band)와 원자가띠(Valence Band)가 겹쳐 있어 상온에서 전자가 자유롭게 이동합니다.\n• 절연체: 밴드갭이 매우 커서(예: 5 eV 이상) 전자가 열이나 빛으로 전도띠로 뛰어넘기 극히 어렵습니다.\n• 반도체(실리콘): 상온에서 밴드갭이 약 1.1 eV로 유한하여, 열이나 빛 에너지, 또는 미량의 불순물(도핑)에 의해 전도 전하를 정밀하게 제어할 수 있습니다.\n• 정공(Hole): 전자가 전도띠로 올라간 뒤 원자가띠에 남겨진 빈자리의 집단적 움직임을 양(+)전하를 띤 가상의 입자처럼 기술한 것입니다. 양전하를 띤 실제 전자가 아닙니다.',
      whyExplanation:
        '양자역학적 결정 격자 내의 주기적 포텐셜에 의해 전자의 파동함수가 블로흐 정리(Bloch Theorem)를 따르며 허용된 에너지 밴드와 금지된 밴드갭이 형성됩니다. 실리콘의 1.12 eV 간격은 상온 열에너지(kT ≈ 25.9 meV) 대비 적절한 장벽을 형성하여 집적회로 소자의 기초가 됩니다.',
      initialParams: {},
      rules: [],
      voice: {
        intro:
          '반도체 혁명의 시작점인 실리콘의 원리를 살펴봅니다. 금속과 절연체 사이에서 전자가 어떻게 움직이고 갇히는지 직접 실험해 보세요.',
      },
      hints: [
        {
          level: 1,
          title: '에너지 틈의 의미',
          description: '밴드갭은 공간적 구멍이 아니라 전자가 뛰어넘어야 하는 에너지 차이예요.',
          voiceLine: '밴드갭은 공간적 구멍이 아니라 전자가 뛰어넘어야 하는 에너지 차이입니다.',
        },
      ],
      successMessage: '실리콘의 밴드갭 개념을 확인했습니다. 밴드 모형 실험으로 넘어갑니다.',
    },

    // Step 1: 11-S01 Bandgap & Excitation
    {
      id: 'step-pn-s1-band-gap',
      title: '1단계: 에너지 밴드갭과 열·빛 여기 (11-S01)',
      stepType: 'MANIPULATE',
      storyLead: '전자가 올라갈 수 있는 에너지 자리를 바꾸면 전하 이동도 달라질까요?',
      prompt:
        '금속·실리콘·절연체의 밴드 구조를 먼저 예상하고, 세 물질의 밴드갭을 비교하며 빛과 열을 켜 전자와 정공 쌍(EHP)이 생기는 과정을 관찰한 뒤 올바른 이유를 고르세요.',
      detailExplanation:
        '• 금속: 밴드 겹침(Eg = 0 eV), 자유 전자가 가득함.\n• 실리콘: Eg ≈ 1.1 eV, 상온에서 열/빛 자극으로 전자가 전도띠로 여기되며 원자가띠에 정공 빈자리가 생성됨.\n• 절연체: Eg ≈ 5 eV, 밴드갭이 너무 넓어 상온 자극으로 캐리어가 거의 생성되지 않음.\n• 밴드 다이어그램의 수직 축은 공간적 위치가 아닌 전자 에너지(eV)입니다.',
      whyExplanation:
        '전도띠로 여기된 전자는 자유롭게 표류(Drift)할 수 있으며, 원자가띠의 빈자리(정공)는 인접 전자의 연속적 채움 이동에 의해 마치 양전하 입자가 반대 방향으로 이동하는 것처럼 거동합니다. 정공은 양전하를 띤 독립 입자가 아닌 빈 양자 상태의 유효 질량 거동입니다.',
      simulatorType: 'pn-band-gap',
      physicsAssumptions: '정성적 밴드 카툰, Si Eg ≈ 1.1 eV, 절연체 5 eV 예시, 캐리어 밀도 정량 계산 배제',
      sourceRefs: ['Sze & Ng, Physics of Semiconductor Devices (Ch. 1 Energy Bands)'],
      initialParams: {
        material: 'silicon',
        light: false,
        warm: false,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 금속·실리콘·큰 밴드갭 물질 중 상온에서 환경(빛/열)에 따라 이동 가능한 캐리어가 생기기 쉬운 구조는?',
          type: 'radioGroup',
          options: [
            {
              label: '실리콘은 유한한 에너지 틈(약 1.1eV)이 있어 환경에 따라 달라져요.',
              value: 'finite',
            },
            {
              label: '밴드갭은 웨이퍼를 실제로 파낸 공간적 틈이에요.',
              value: 'physical',
              misconception: '밴드갭은 공간적 틈이 아니라 전자가 가질 수 없는 에너지 간격(eV)입니다.',
            },
          ],
        },
        {
          id: 'material',
          label: '소재 밴드 구조 선택',
          type: 'radioGroup',
          options: [
            { label: '금속 (겹침, 0eV)', value: 'metal' },
            { label: '실리콘 (1.1eV)', value: 'silicon' },
            { label: '절연체 (큰 갭, 5eV)', value: 'insulator' },
          ],
        },
        {
          id: 'light',
          label: '빛 에너지 조사 (광 여기)',
          type: 'toggle',
        },
        {
          id: 'warm',
          label: '열 에너지 공급 (열 여기)',
          type: 'toggle',
        },
        {
          id: 'answer',
          label: '원리 설명 선택',
          type: 'radioGroup',
          options: [
            {
              label: '밴드갭은 허용된 전자 에너지 사이 차이예요. 정공은 빠져나간 전자 자리이지 양전하 전자가 아니에요.',
              value: 'gap-energy-not-hole',
            },
            {
              label: '밴드갭은 결정에 뚫린 물리적 구멍이에요.',
              value: 'physical-hole',
              misconception: '밴드 다이어그램의 축은 공간 거리가 아니라 전자의 에너지 준위입니다.',
            },
            {
              label: '정공은 전자에 플러스 전하가 달린 새로운 전자예요.',
              value: 'positive-electron',
              misconception: '정공은 원자가띠에 생긴 전자의 빈자리 상태를 기술하는 유효 입자 개념입니다.',
            },
            {
              label: '실리콘에는 어떤 조건에서도 이동 가능한 전하가 없어요.',
              value: 'all-insulators',
              misconception: '실리콘은 적절한 열, 빛, 도핑에 의해 전도 전하가 생성됩니다.',
            },
          ],
        },
      ],
      rules: [
        {
          targetKey: 'history',
          label: '금속 밴드 관찰',
          operator: 'contains',
          expected: 'metal',
          feedbackIfFail: '소재를 금속으로 변경하여 밴드 겹침 상태를 확인하세요.',
        },
        {
          targetKey: 'history',
          label: '실리콘 밴드 관찰',
          operator: 'contains',
          expected: 'silicon',
          feedbackIfFail: '소재를 실리콘(1.1eV)으로 변경하여 유한한 밴드갭을 확인하세요.',
        },
        {
          targetKey: 'history',
          label: '절연체 밴드 관찰',
          operator: 'contains',
          expected: 'insulator',
          feedbackIfFail: '소재를 절연체(5eV)로 변경하여 넓은 밴드갭을 비교하세요.',
        },
        {
          targetKey: 'history',
          label: '빛 또는 열 여기 관찰',
          operator: 'contains',
          expected: 'excited',
          feedbackIfFail: '실리콘에서 빛이나 열 토글을 켜서 전자-정공 쌍 생성을 관찰하세요.',
        },
        {
          targetKey: 'answer',
          label: '밴드갭 및 정공 원리 선택',
          operator: 'eq',
          expected: 'gap-energy-not-hole',
          feedbackIfFail: '밴드갭의 물리적 의미와 정공의 실체에 관한 정확한 설명을 선택하세요.',
        },
      ],
      voice: {
        intro: '실리콘, 금속, 절연체의 밴드 구조를 비교하고, 빛과 열이 전하 운반자를 어떻게 만드는지 확인해 보세요.',
      },
      hints: [
        {
          level: 1,
          title: '에너지 준위',
          description: '밴드 그림의 세로축은 공간상 거리가 아니라 전자 에너지(eV)입니다.',
          voiceLine: '밴드 그림의 세로축은 전자 에너지 준위입니다.',
        },
        {
          level: 2,
          title: '정공의 정체',
          description: '전자가 에너지를 얻어 위로 뛰어오르면, 아래에 남겨진 빈자리가 정공(Hole)이 됩니다.',
          voiceLine: '전자가 전도띠로 올라간 빈자리가 정공입니다.',
        },
        {
          level: 3,
          title: '세 소재 비교',
          description: '금속(0eV), 실리콘(1.1eV), 절연체(5eV)를 모두 눌러본 후 여기 토글을 켜보세요.',
          voiceLine: '세 가지 소재를 모두 클릭하고 빛과 열 효과를 관찰해 보세요.',
        },
      ],
      successMessage: '밴드갭의 에너지 의미와 전자-정공 여기 메커니즘을 정확히 파악했습니다!',
    },

    // Step 2: 11-S02 Silicon Doping
    {
      id: 'step-pn-s2-doping',
      title: '2단계: 실리콘 도핑 — Donor P n형 vs Acceptor B p형 (11-S02)',
      stepType: 'MANIPULATE',
      storyLead: '실리콘 결합 자리에 5가 원자나 3가 원자를 대신 넣으면 무슨 일이 일어날까요?',
      prompt:
        '도핑 시 다수 운반자와 벌크 전하의 성질을 먼저 예상하고, Intrinsic, Donor P(n형), Acceptor B(p형) 카드를 변경하며 다수/소수 운반자와 고정 이온을 관찰한 뒤 올바른 이유를 고르세요.',
      detailExplanation:
        '• 순수 실리콘(Intrinsic): 4개의 최외각 전자가 이웃 4개 실리콘 원자와 완벽히 공유 결합을 형성합니다.\n• Donor 도핑 (예: 5가 인 P): 4개는 결합에 참여하고 5번째 전자가 쉽게 자유 전자가 됩니다. 전자를 공급하므로 n형이며, 전자가 떠난 자리에 고정된 양이온(P⁺)이 남습니다.\n• Acceptor 도핑 (예: 3가 붕소 B): 전자가 1개 부족하여 이웃 전자를 받아들이며 정공을 만듭니다. 전자를 수용하므로 p형이며, 전자를 받아 음이온(B⁻)으로 고정됩니다.\n• 벌크 전하 중성: n형이나 p형 모두, 움직이는 운반자(전자/정공)와 반대 부호의 고정 도핑 이온이 전체적으로 균형을 이루어 벌크 전체는 거의 전기적 중성을 유지합니다.',
      whyExplanation:
        '도펀트 원자의 이온화 에너지(In P ≈ 45 meV, B ≈ 45 meV)는 실리콘 밴드갭(1.1 eV)에 비해 매우 얕은 준위(Shallow Level)를 형성하므로, 상온 열에너지(kT ≈ 26 meV)에 의해 거의 100% 이온화되어 다수 운반자를 제공합니다. 전하 중성 조건(n + NA⁻ = p + ND⁺)에 의해 벌크 전체는 중성입니다.',
      simulatorType: 'pn-doping',
      physicsAssumptions: '10격자 도핑 아이콘은 교육용 정성 모형이며, 실제 10¹⁵~10¹⁸/cm³ 원자 농도가 아님. 완전 이온화 가정',
      sourceRefs: ['Streetman & Banerjee, Solid State Electronic Devices (Ch. 3 Doping)'],
      initialParams: {
        dopant: 'intrinsic',
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 5가 원자나 3가 원자를 도핑할 때 벌크 전체의 전하 상태와 다수 운반자는?',
          type: 'radioGroup',
          options: [
            {
              label: '대부분의 벌크는 중성을 유지하며 다수 캐리어 종류가 달라져요.',
              value: 'neutral',
            },
            {
              label: 'n형 전체가 엄청 큰 음전하 덩어리가 돼요.',
              value: 'charged',
              misconception: '도펀트에서 방출된 전자와 원자핵에 남은 고정 양이온의 수가 같으므로 벌크는 전기적으로 중성입니다.',
            },
          ],
        },
        {
          id: 'dopant',
          label: '불순물 도핑 선택',
          type: 'radioGroup',
          options: [
            { label: '순수 실리콘 (Intrinsic)', value: 'intrinsic' },
            { label: '인(P) 도핑 (Donor → n형)', value: 'donor' },
            { label: '붕소(B) 도핑 (Acceptor → p형)', value: 'acceptor' },
          ],
        },
        {
          id: 'answer',
          label: '원리 설명 선택',
          type: 'radioGroup',
          options: [
            {
              label: 'Donor n형 다수는 전자, acceptor p형 다수는 정공이에요. 벌크는 거의 중성이고 소수 캐리어도 존재해요.',
              value: 'majority-neutrality',
            },
            {
              label: 'p형의 정공은 플러스 전하를 띤 전자가 실체로 나타난 거예요.',
              value: 'hole-electron',
              misconception: '정공은 원자가띠 전자의 집단적 빈자리 이동이지 새로운 기본 입자가 아닙니다.',
            },
            {
              label: 'n형 실리콘 전체는 언제나 음전하가 가득한 배터리예요.',
              value: 'battery',
              misconception: '고정 양이온과 자유 전자가 균형을 이루어 순 전하는 0에 가깝습니다.',
            },
            {
              label: 'n형에는 소수 정공이 단 한 개도 존재하지 않아요.',
              value: 'no-minority',
              misconception: '열적 여기(EHP 생성)에 의해 n형에도 소수 캐리어인 정공이 반드시 존재합니다(np = ni²).',
            },
          ],
        },
      ],
      rules: [
        {
          targetKey: 'history',
          label: 'Donor P (n형) 관찰',
          operator: 'contains',
          expected: 'donor',
          feedbackIfFail: '도펀트를 Donor P로 설정하여 다수 전자와 고정 양이온을 관찰하세요.',
        },
        {
          targetKey: 'history',
          label: 'Acceptor B (p형) 관찰',
          operator: 'contains',
          expected: 'acceptor',
          feedbackIfFail: '도펀트를 Acceptor B로 설정하여 다수 정공과 고정 음이온을 관찰하세요.',
        },
        {
          targetKey: 'answer',
          label: '도핑 및 전하 중성 원리 선택',
          operator: 'eq',
          expected: 'majority-neutrality',
          feedbackIfFail: '다수/소수 운반자와 벌크 전하 중성에 관한 정확한 설명을 선택하세요.',
        },
      ],
      voice: {
        intro: '순수 실리콘에 원자 한 조각을 도핑할 때, 전자와 정공 중 어느 쪽이 많아지는지 직접 관찰해 보세요.',
      },
      hints: [
        {
          level: 1,
          title: '5가와 3가의 결합',
          description: 'P(인)은 5가로 전자를 1개 내놓고(Donor), B(붕소)는 3가로 전자를 받아 정공을 만듭니다(Acceptor).',
          voiceLine: '인은 전자를 제공하는 공여체, 붕소는 전자를 수용하는 억셉터입니다.',
        },
        {
          level: 2,
          title: '고정 이온',
          description: '전자가 떠난 도너는 (+) 고정 이온이 되고, 정공을 만든 억셉터는 (-) 고정 이온이 됩니다.',
          voiceLine: '캐리어가 떠난 자리에는 고정된 이온이 남습니다.',
        },
        {
          level: 3,
          title: '벌크 전하 중성',
          description: '자유 캐리어의 전하와 고정 이온의 전하가 서로 상쇄되므로 실리콘 덩어리는 중성입니다.',
          voiceLine: '자유 전하와 고정 이온이 균형을 이루어 벌크는 중성입니다.',
        },
      ],
      successMessage: 'n형과 p형 도핑, 다수/소수 운반자 및 벌크 전하 중성을 완벽히 이해했습니다!',
    },

    // Step 3: 11-S03 PN Junction Diffusion, Drift & Equilibrium
    {
      id: 'step-pn-s3-equilibrium',
      title: '3단계: PN 접합 — 확산, 드리프트, 내장 전계와 열평형 (11-S03)',
      stepType: 'MANIPULATE',
      storyLead: 'n형과 p형을 붙였는데 왜 전류가 영원히 흐르지 않고 멈출까요?',
      prompt:
        'PN 접합 직후와 평형 상태의 전류 합을 먼저 예상하고, 분리 → 접촉·확산 → 평형 단계를 전환하며 고정 이온에 의한 내장 전기장(n+→p−)과 확산·드리프트 상쇄를 관찰한 뒤 올바른 이유를 고르세요.',
      detailExplanation:
        '• 접촉 초기 (확산, Diffusion): 농도 차이에 의해 n형의 전자들이 p형으로 확산하고, p형의 정공들이 n형으로 확산합니다.\n• 공핍층(Depletion Region) 형성: 접합 부근의 자유 캐리어들이 재결합하여 사라지면서, 이동할 수 없는 n쪽 고정 Donor 양이온(+)과 p쪽 고정 Acceptor 음이온(−)만 남게 됩니다.\n• 내장 전기장 (Built-in Field, E): n쪽 양이온에서 p쪽 음이온 방향(n+ → p−)으로 강력한 전기장이 형성됩니다.\n• 드리프트(Drift)와 평형: 형성된 전기장에 의해 전하들이 반대 방향으로 밀려나는 드리프트 전류가 생깁니다. 확산 전류와 드리프트 전류의 크기가 완벽히 같아지고 방향이 반대가 되면 순(Net) 직류 전류는 0이 되며 열평형 상태에 도달합니다.\n• 주의: 내장 전위(Built-in Potential, Vbi)는 내부 평형 상태의 전위차일 뿐, 외부 회로에 전력을 공급하는 건전지(배터리)가 아닙니다.',
      whyExplanation:
        '열평형 상태에서 반도체 전역의 페르미 준위(Fermi Level, EF)는 일정해야 합니다(dEF/dx = 0). 페르미 준위가 일정해지려면 에너지 밴드가 접합부에서 휘어져 전위 장벽 qVbi가 형성되며, 이로 인한 드리프트 전류와 캐리어 농도 구배에 의한 확산 전류가 아인슈타인 관계식(Dn/μn = kT/q)에 의해 완전히 상쇄(J_total = J_diff + J_drift = 0)됩니다.',
      simulatorType: 'pn-equilibrium',
      physicsAssumptions: '1차원 이상적 계단형(Abrupt) 접합, 외부 바이어스 0V 평형, 확산/드리프트 toy 전류 단위',
      sourceRefs: ['Neamen, Semiconductor Physics and Devices (Ch. 7 PN Junction)'],
      initialParams: {
        phase: 'separate',
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 외부 전압이 없을 때 접합 시간이 흐른 뒤 순 직류 전류와 내장 전위는?',
          type: 'radioGroup',
          options: [
            {
              label: '두 전류(확산과 드리프트)가 상쇄돼 외부 바이어스 없는 평형에서는 순 DC가 0이에요.',
              value: 'cancel',
            },
            {
              label: '내장 전기장 때문에 영원히 전기를 꺼내 쓸 수 있는 공짜 배터리가 돼요.',
              value: 'battery',
              misconception: '내장 전위는 내부 확산과 드리프트를 상쇄하는 정전기적 평형 전위일 뿐 에너지 원천이 아닙니다.',
            },
          ],
        },
        {
          id: 'phase',
          label: '접합 진행 단계',
          type: 'radioGroup',
          options: [
            { label: '분리 상태 (Separate)', value: 'separate' },
            { label: '접촉 및 초기 확산 (Diffusion)', value: 'diffusion' },
            { label: '열평형 상태 (Equilibrium, Net=0)', value: 'equilibrium' },
          ],
        },
        {
          id: 'answer',
          label: '원리 설명 선택',
          type: 'radioGroup',
          options: [
            {
              label: 'p쪽 고정 acceptor는 음(−), n쪽 donor는 양(+) 이온이에요. 내장 E는 n→p, 평형에서 확산+drift 순전류 0이에요.',
              value: 'balanced-not-battery',
            },
            {
              label: '공핍층에는 도핑 이온까지 모두 사라져요.',
              value: 'no-ions',
              misconception: '공핍되는 것은 이동 가능한 자유 전자와 정공이며, 결정 격자에 묶인 고정 도핑 이온은 그대로 남습니다.',
            },
            {
              label: '내장 전위는 외부 부하에 지속적으로 전력을 주는 공짜 배터리예요.',
              value: 'free-energy',
              misconception: '외부 회로를 연결하면 접촉 전위차에 의해 폐회로 총 기전력은 0이 되어 전류가 흐르지 않습니다.',
            },
            {
              label: '평형 전류 0이면 개별 전자도 전혀 움직이지 않아요.',
              value: 'no-movement',
              misconception: '개별 전하들은 열운동으로 끊임없이 이동하며, 단지 반대 방향의 두 거시적 흐름의 합이 0일 뿐입니다.',
            },
          ],
        },
      ],
      rules: [
        {
          targetKey: 'history',
          label: '접촉 및 초기 확산 관찰',
          operator: 'contains',
          expected: 'diffusion',
          feedbackIfFail: '단계를 "접촉 및 초기 확산"으로 변경하여 공핍층 형성을 확인하세요.',
        },
        {
          targetKey: 'history',
          label: '열평형 순전류 0 관찰',
          operator: 'contains',
          expected: 'equilibrium',
          feedbackIfFail: '단계를 "열평형 상태"로 변경하여 확산과 드리프트의 상쇄를 관찰하세요.',
        },
        {
          targetKey: 'answer',
          label: '내장 전계 및 열평형 원리 선택',
          operator: 'eq',
          expected: 'balanced-not-battery',
          feedbackIfFail: '고정 이온 부호, 내장 전계 방향 및 두 전류의 평형에 관한 올바른 설명을 선택하세요.',
        },
      ],
      voice: {
        intro: 'n형과 p형을 접촉시켰을 때 고정 이온들이 만들어내는 내장 전기장과 평형 상태를 관찰해 보세요.',
      },
      hints: [
        {
          level: 1,
          title: '공핍층의 고정 이온',
          description: '전자가 빠져나간 n쪽에는 양(+)이온이, 정공이 빠져나간 p쪽에는 음(−)이온이 남습니다.',
          voiceLine: 'n쪽에는 양이온, p쪽에는 음이온이 고정되어 남습니다.',
        },
        {
          level: 2,
          title: '내장 전계 방향',
          description: '전기장은 양전하에서 음전하로 향하므로, n쪽(+)에서 p쪽(−)으로 형성됩니다.',
          voiceLine: '내장 전기장은 n쪽 양이온에서 p쪽 음이온으로 향합니다.',
        },
        {
          level: 3,
          title: '두 흐름의 균형',
          description: '농도 차이에 의한 확산과 전기장에 의한 드리프트가 크기가 같고 방향이 반대로 상쇄됩니다.',
          voiceLine: '확산 전류와 드리프트 전류가 완벽히 상쇄되어 순 전류는 0이 됩니다.',
        },
      ],
      successMessage: 'PN 접합의 내장 전계 형성과 확산·드리프트 열평형 원리를 성공적으로 검증했습니다!',
    },

    // Step 4: 11-S04 Bias & Depletion Width Calculator
    {
      id: 'step-pn-s4-depletion-bias',
      title: '4단계: 바이어스 인가와 공핍폭 W(µm) 제어 (11-S04)',
      stepType: 'MANIPULATE',
      storyLead: 'p단자와 n단자에 거는 전압 방향을 바꾸면 공핍층 두께는 어떻게 변할까요?',
      prompt:
        '역바이어스(−1V), 평형(0V), 순바이어스(+0.2V)에서의 공핍폭 순서를 먼저 예상하고, 바이어스를 토글하며 W(µm)의 비선형 변화를 관찰한 뒤 올바른 이유를 고르세요.',
      detailExplanation:
        '• 외부 바이어스 Va = V(p) − V(n) 정의.\n• 역바이어스 (Reverse Bias, Va = −1V): p쪽에 (−), n쪽에 (+)를 인가하여 내부 장벽이 Vbi − Va = Vbi + |Va|로 높아집니다. 전하들이 양단으로 끌려가 공핍층 폭 W가 약 0.6659 µm로 크게 넓어집니다.\n• 평형 상태 (0V): 내부 장벽 Vbi ≈ 0.714 V, 공핍폭 W ≈ 0.4298 µm.\n• 순바이어스 (Forward Bias, Va = +0.2V): p쪽에 (+), n쪽에 (−)를 인가하여 내부 장벽이 Vbi − Va = 0.514 V로 낮아집니다. 공핍층 폭 W가 약 0.3647 µm로 좁아집니다.\n• 공핍폭 공식: $W = \\sqrt{\\frac{2\\epsilon_{Si}}{q}\\left(\\frac{1}{N_A} + \\frac{1}{N_D}\\right)(V_{bi} - V_a)}$. W는 전압의 제곱근($\\sqrt{V_{bi}-V_a}$)에 비례합니다.',
      whyExplanation:
        '푸아송 방정식(Poisson equation, $d^2V/dx^2 = -\\rho/\\epsilon$)을 공핍 영역에 적분하면 포텐셜 강하와 공핍폭 사이의 제곱 관계가 유도됩니다. 역바이어스는 공간 전하 영역의 전하량을 증가시켜야 하므로 W가 넓어지고, 순바이어스는 장벽을 낮추어 W를 좁히며 다수 캐리어의 주입(Injection)을 가능하게 합니다.',
      simulatorType: 'pn-depletion-bias',
      physicsAssumptions: '300K Si 1D abrupt 접합, Na=Nd=10¹⁶/cm³, ni=10¹⁰/cm³, Va < Vbi 영역 한정',
      sourceRefs: ['Sze & Ng, Physics of Semiconductor Devices (Ch. 2 p-n Junctions: Depletion Width)'],
      initialParams: {
        bias: 0,
        na: 1e16,
        nd: 1e16,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: Va = −1V (역방향), 0V (평형), +0.2V (순방향) 중 공핍폭이 가장 넓은 조건은?',
          type: 'radioGroup',
          options: [
            {
              label: '−1V 역바이어스가 가장 넓고, +0.2V 순방향이 더 좁아요.',
              value: 'reverse',
            },
            {
              label: '순방향 +0.2V에서 오히려 공핍층이 더 넓어져요.',
              value: 'forward',
              misconception: '순방향 전압은 내부 장벽을 낮추어 공핍층을 좁힙니다.',
            },
          ],
        },
        {
          id: 'bias',
          label: '인가 바이어스 Va = V(p) − V(n)',
          type: 'radioGroup',
          options: [
            { label: '역바이어스 (−1.0 V)', value: -1 },
            { label: '열평형 (0.0 V)', value: 0 },
            { label: '순바이어스 (+0.2 V)', value: 0.2 },
          ],
        },
        {
          id: 'answer',
          label: '원리 설명 선택',
          type: 'radioGroup',
          options: [
            {
              label: '역방향은 장벽을 높여 W를 넓히고 순방향은 좁혀요. 내장전위는 외부 배터리 전압이 아니에요.',
              value: 'reverse-widens',
            },
            {
              label: '순방향은 공핍폭을 더 넓혀요.',
              value: 'forward-widens',
              misconception: '순바이어스는 캐리어를 접합부 쪽으로 밀어내어 공핍층 폭을 축소시킵니다.',
            },
            {
              label: 'Vbi 약 0.714V를 외부 단자에서 꺼내 쓸 수 있어요.',
              value: 'vbi-battery',
              misconception: 'Vbi는 내부 평형 접합 전위이며 전원 장치가 아닙니다.',
            },
            {
              label: '도핑이 2배면 공핍층 폭은 모든 조건에서 정확히 절반으로 줄어요.',
              value: 'half-doping',
              misconception: 'W는 도핑 농도의 제곱근 및 Vbi 로그 변화가 복합 작용하여 단순 절반이 아닙니다.',
            },
          ],
        },
      ],
      rules: [
        {
          targetKey: 'history',
          label: '역바이어스 −1V 공핍층 확대 관찰',
          operator: 'contains',
          expected: 'reverse',
          feedbackIfFail: '바이어스를 역방향(−1.0V)으로 변경하여 W가 약 0.666µm로 늘어나는 것을 확인하세요.',
        },
        {
          targetKey: 'history',
          label: '평형 0V 공핍층 관찰',
          operator: 'contains',
          expected: 'zero',
          feedbackIfFail: '바이어스를 평형(0.0V)으로 설정하여 W가 약 0.430µm임을 확인하세요.',
        },
        {
          targetKey: 'history',
          label: '순바이어스 +0.2V 공핍층 축소 관찰',
          operator: 'contains',
          expected: 'forward',
          feedbackIfFail: '바이어스를 순방향(+0.2V)으로 변경하여 W가 약 0.365µm로 줄어드는 것을 확인하세요.',
        },
        {
          targetKey: 'answer',
          label: '바이어스에 따른 공핍폭 원리 선택',
          operator: 'eq',
          expected: 'reverse-widens',
          feedbackIfFail: '역바이어스와 순바이어스에서 공핍폭 W의 변화에 대한 올바른 설명을 선택하세요.',
        },
      ],
      voice: {
        intro: '전압 방향을 바꿀 때 접합 장벽과 공핍층 폭이 어떻게 반응하는지 마이크로미터 단위로 관찰해 보세요.',
      },
      hints: [
        {
          level: 1,
          title: '장벽 높이',
          description: '역바이어스는 장벽(Vbi - Va)을 높이고, 순바이어스는 장벽을 낮춥니다.',
          voiceLine: '역바이어스는 장벽을 높이고 순바이어스는 장벽을 낮춥니다.',
        },
        {
          level: 2,
          title: '제곱근 비례',
          description: '공핍폭 W는 유효 전위 장벽의 제곱근에 비례하여 변합니다.',
          voiceLine: '공핍폭은 전위 장벽의 제곱근에 비례합니다.',
        },
        {
          level: 3,
          title: '세 가지 전압 비교',
          description: '-1V, 0V, +0.2V를 차례로 누르고 계산된 W(µm) 값을 비교해 보세요.',
          voiceLine: '세 전압에서 계산된 공핍폭 수치를 비교해 보세요.',
        },
      ],
      successMessage: '바이어스에 따른 정량적 공핍폭 W 제어와 장벽 메커니즘을 마스터했습니다!',
    },

    // Step 5: 11-S05 Diode Current to MOS Insulated Gate
    {
      id: 'step-pn-s5-diode-to-mos',
      title: '5단계: PN 다이오드 지수 전류 vs MOS 게이트 산화막 절연 (11-S05)',
      stepType: 'MANIPULATE',
      storyLead: '0.3V에서 0.4V로 0.1V만 올렸는데 전류는 왜 7배 가까이 폭증할까요? 그리고 MOSFET 게이트는 왜 전류가 안 흐를까요?',
      prompt:
        '다이오드의 비선형 전류와 MOS 게이트의 절연 구조를 먼저 예상하고, 다이오드 전압(-1V, 0V, 0.3V, 0.4V)과 게이트 방식(PN vs MOS)을 변경하며 쇼클리 곡선과 산화막 전계 제어를 관찰한 뒤 올바른 이유를 고르세요.',
      detailExplanation:
        '• 쇼클리 다이오드 방정식: $I = I_s \\left( e^{\\frac{qV}{n k T}} - 1 \\right)$.\n• 이상적 교육용 모델 (Is = 1 pA, n = 2, VT = 25.85 mV):\n  - V = 0.3 V: I ≈ 0.330 nA\n  - V = 0.4 V: I ≈ 2.289 nA (약 6.94배 급증!)\n  - V = −1.0 V: I ≈ −1.0 pA (극미한 역포화 누설전류)\n• 오개념 파괴: 다이오드는 0.7V에서 스위치가 켜지는 게 아니라, 매우 작은 전압부터 지수적으로 연속 증가합니다. 0.7V는 통상적인 회로 설계 편의상 부르는 기준값일 뿐입니다.\n• PN 다이오드 vs MOS 게이트: PN 다이오드는 접합을 가로질러 실제 전하를 "직접 주입(Carrier Injection)"하여 전류를 흘립니다. 반면 MOSFET 게이트는 실리콘 산화막(SiO₂/High-k)이라는 물리적 절연층이 가로막고 있어 직류(DC) 전류가 전혀 흐르지 않고, 순수한 "전기장(Field Effect)"으로만 표면 전하를 유인합니다.',
      whyExplanation:
        '맥스웰-볼츠만 에너지 분포에 따라 장벽 q(Vbi - Va)를 뛰어넘을 수 있는 고에너지 캐리어의 비율이 지수함수($\\exp(qV/nkT)$)로 증가하므로 다이오드 전류는 지수적 비선형성을 보입니다. 반면 MOS 소자는 게이트 산화막의 높은 에너지 밴드갭(SiO₂ Eg ≈ 9 eV)에 의해 게이트 전극과 반도체 기판 간의 직류 전도 대역이 차단되어, 이상적인 정전기적 커패시턴스 결합(Field Effect)에 의해서만 채널을 제어합니다.',
      simulatorType: 'pn-diode-to-mos',
      physicsAssumptions: 'Shockley ideal toy, Is=1pA, n=2, VT=25.852mV, T=300K, 역항복 및 직렬 저항 제외, MOS 게이트 이상 DC 절연',
      sourceRefs: ['Sedra & Smith, Microelectronic Circuits (Ch. 4 Diodes & Ch. 5 MOS Field-Effect Transistors)'],
      initialParams: {
        diodeBias: 0,
        gate: 'pn',
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 다이오드 전압을 0.3V에서 0.4V로 올릴 때 전류 변화와 MOSFET 게이트의 차이는?',
          type: 'radioGroup',
          options: [
            {
              label: '연속적인 지수함수라 전류는 약 6.9배 급증하고, MOS 게이트는 산화막 절연으로 직류 전류가 흐르지 않아요.',
              value: 'exponential',
            },
            {
              label: '0.7V 아래니까 둘 다 전류가 0이고 MOSFET 게이트도 PN 접합으로 전류를 흘려요.',
              value: 'zero',
              misconception: '다이오드는 0.7V 이하에서도 지수적으로 연속 증가하며, MOSFET 게이트는 산화막으로 절연되어 직류가 흐르지 않습니다.',
            },
          ],
        },
        {
          id: 'diodeBias',
          label: '다이오드 인가 전압',
          type: 'radioGroup',
          options: [
            { label: '−1.0 V (역누설)', value: -1 },
            { label: '0.0 V (차단)', value: 0 },
            { label: '+0.3 V (0.33 nA)', value: 0.3 },
            { label: '+0.4 V (2.29 nA)', value: 0.4 },
          ],
        },
        {
          id: 'gate',
          label: '게이트 제어 방식 대비',
          type: 'radioGroup',
          options: [
            { label: 'PN 다이오드 (직접 전하 주입)', value: 'pn' },
            { label: 'MOS 절연 게이트 (산화막 전계 제어)', value: 'mos' },
          ],
        },
        {
          id: 'answer',
          label: '원리 설명 선택',
          type: 'radioGroup',
          options: [
            {
              label: '다이오드는 지수 I-V라 0.7V 하드 스위치가 아니고, MOS 게이트는 산화막을 통한 전계로 제어해요.',
              value: 'nonlinear-oxide',
            },
            {
              label: '실리콘 다이오드 0.7V 미만 전류는 언제나 정확히 0이에요.',
              value: 'hard07',
              misconception: '쇼클리 방정식에 따라 지수적으로 전류가 흐르며 0.7V는 거시적 회로 해석 기준선일 뿐입니다.',
            },
            {
              label: '내장전위와 실제 모든 회로의 0.7V 문턱은 정의상 동일해요.',
              value: 'vbi-same',
              misconception: '내장 전위(Vbi)는 접합 내부의 열평형 전위이고, 다이오드 턴온 전압은 전류 작동점에 따라 다릅니다.',
            },
            {
              label: 'MOSFET 게이트는 PN 접합에 직접 전류를 흘려 채널을 제어해요.',
              value: 'gate-pn',
              misconception: 'MOSFET은 Oxide(산화막) 절연체를 통해 전계로만 제어하므로 게이트 DC 전류는 0에 수렴합니다.',
            },
          ],
        },
      ],
      rules: [
        {
          targetKey: 'history',
          label: '+0.3V 순방향 전류 관찰',
          operator: 'contains',
          expected: '0.3',
          feedbackIfFail: '전압을 +0.3V로 변경하여 나노암페어(nA) 단위 전류를 확인하세요.',
        },
        {
          targetKey: 'history',
          label: '+0.4V 지수적 급증 관찰',
          operator: 'contains',
          expected: '0.4',
          feedbackIfFail: '전압을 +0.4V로 변경하여 전류가 약 2.29nA로 급증하는 것을 관찰하세요.',
        },
        {
          targetKey: 'history',
          label: '−1V 역포화 누설전류 관찰',
          operator: 'contains',
          expected: '-1',
          feedbackIfFail: '전압을 −1.0V로 변경하여 극미한 역포화 전류(~1pA)를 확인하세요.',
        },
        {
          targetKey: 'history',
          label: 'MOS 산화막 절연 게이트 관찰',
          operator: 'contains',
          expected: 'mos',
          feedbackIfFail: '게이트 방식을 "MOS 절연 게이트"로 변경하여 산화막 절연의 차이를 확인하세요.',
        },
        {
          targetKey: 'answer',
          label: '지수 I-V 곡선 및 MOS 산화막 원리 선택',
          operator: 'eq',
          expected: 'nonlinear-oxide',
          feedbackIfFail: '다이오드의 지수적 전압-전류 관계와 MOS 게이트 산화막 절연에 관한 올바른 설명을 선택하세요.',
        },
      ],
      voice: {
        intro: '다이오드의 지수적 전류 급증과 MOSFET의 절연 게이트 산화막 차이를 직접 비교해 보세요.',
      },
      hints: [
        {
          level: 1,
          title: '지수함수 I-V',
          description: '전압이 0.1V만 올라가도 전류는 몇 배로 급증하는 지수적 비선형성을 보입니다.',
          voiceLine: '다이오드 전류는 전압에 따라 지수함수적으로 증가합니다.',
        },
        {
          level: 2,
          title: '0.7V 고정 문턱의 오해',
          description: '다이오드는 0.7V 전에도 전류가 연속적으로 흐릅니다. 0.7V는 하드 차단선이 아닙니다.',
          voiceLine: '다이오드는 0.7V 이전에도 전류가 지수적으로 흐릅니다.',
        },
        {
          level: 3,
          title: 'MOS의 O(Oxide)',
          description: 'MOSFET은 산화막(Oxide) 절연체가 게이트를 막고 있어 직류 전류가 흐르지 않고 전계로만 제어합니다.',
          voiceLine: 'MOSFET 게이트는 산화막으로 절연되어 전계로만 제어합니다.',
        },
      ],
      successMessage: '쇼클리 지수 전류와 MOS 게이트 산화막 절연 원리를 완벽하게 구별했습니다!',
    },

    // Step 6: 11-REV Comprehensive Review & Synthesis
    {
      id: 'step-pn-s6-review',
      title: '종합 정리: 밴드에서 MOS 트랜지스터로 이어지는 길 (11-REV)',
      stepType: 'CONCEPT',
      storyLead: '에너지 밴드에서 출발해 도핑, PN 접합, 그리고 MOS 소자까지의 흐름을 한눈에 정리합니다.',
      prompt:
        '11강에서 배운 5가지 핵심 물리 원리를 복습하고, 반도체 공학과 회로 설계에서 가장 흔히 발생하는 3가지 치명적 오개념을 점검하세요.',
      detailExplanation:
        '1. 밴드갭(Eg): 공간적 구멍이 아닌 전자가 뛰어넘어야 하는 에너지 차이(실리콘 약 1.1 eV). 정공은 원자가띠 전자의 빈자리 상태임.\n2. 도핑과 중성: P(5가)는 전자 다수(n형), B(3가)는 정공 다수(p형)를 만들지만, 고정 이온과 이동 전하가 상쇄되어 벌크 자체는 전기적으로 중성임.\n3. PN 열평형: 농도차에 의한 확산과 내장 전계(n+→p−)에 의한 드리프트가 크기가 같고 방향이 반대로 상쇄되어 순 직류 전류는 0임.\n4. 공핍폭 W(µm): 역바이어스는 장벽을 높여 W를 넓히고, 순바이어스는 장벽을 낮추어 W를 좁힘($W \\propto \\sqrt{V_{bi}-V_a}$).\n5. 다이오드 vs MOS: 다이오드는 지수적 캐리어 주입으로 도통하며, MOSFET 게이트는 산화막 절연으로 직류 전류 없이 전계로만 반전 채널을 형성함.',
      whyExplanation:
        '이 기초 물리 체계는 향후 14강(MOS 커패시터·표면 반전층)과 01강(MOSFET 선형/포화 및 CMOS 인버터)으로 직결되며, 현대 모든 마이크로프로세서와 메모리의 전기적 작동 기저를 이룹니다.',
      initialParams: {},
      rules: [],
      voice: {
        intro:
          '반도체 밴드, 도핑, PN 접합, 공핍폭, 그리고 MOS 절연 게이트까지의 모든 핵심 원리를 성공적으로 마쳤습니다. 축하합니다!',
      },
      hints: [
        {
          level: 1,
          title: '복습 완료',
          description: '모든 실험을 완주했습니다. 다음 레슨이나 코스 카탈로그로 이동할 수 있습니다.',
          voiceLine: '축하합니다! 반도체 기초 물리를 완주했습니다.',
        },
      ],
      successMessage: '반도체 밴드·도핑·PN 접합과 MOS 기초 전 과정을 성공적으로 완주했습니다!',
    },
  ],
};
