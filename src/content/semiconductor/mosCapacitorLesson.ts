import type { Lesson } from '../../types';

export const mosCapacitorLesson: Lesson = {
  id: 'mos-capacitor-foundations',
  courseId: 'course-semiconductor',
  category: 'semiconductor',
  slug: 'mos-capacitor-foundations',
  title: '14. MOS 커패시터와 표면 반전 기초',
  subtitle: '절연막 전계 제어, 축적·공핍·반전, tox와 C-V 주파수 분산, MOSFET 연결',
  description:
    '산화막으로 절연되어 직류 전도가 0인데 어떻게 전계로 실리콘 표면을 제어하는지, 게이트 전압에 따른 축적(Accumulation)·공핍(Depletion)·반전(Inversion)의 3대 동작 영역, 산화막 두께 tox와 C-V 특성 곡선의 주파수 분산, 그리고 2단자 커패시터에 소스/드레인을 붙여 MOSFET 채널을 완성하는 과정을 대화형 2.5D 시뮬레이션으로 탐구합니다.',
  steps: [
    // Step 0: Concept Intro
    {
      id: 'step-mos14-s0-intro',
      title: '개념 도입: 절연막 너머의 전기장과 MOS 커패시터',
      stepType: 'CONCEPT',
      storyLead: '절연막으로 가로막혀 전자가 건너가지 못하는데, 어떻게 실리콘을 제어할 수 있을까요?',
      prompt:
        '금속 게이트(Metal), 절연 산화막(Oxide), 반도체(Semiconductor)의 3개 층으로 이루어진 MOS 커패시터는 현대 모든 MOSFET과 집적회로의 심장입니다. 아래 버튼을 눌러 절연체 너머로 미치는 전기장의 작용을 확인해 보세요.',
      detailExplanation:
        '• 금속 게이트(Metal Gate): 외부 제어 전압(VGB)을 인가하는 전도성 단자입니다.\n• 산화막(SiO₂ Oxide): 전자가 통과하지 못하는 절연체(Dielectric)로, 정상상태 직류(DC) 전도는 이상적으로 0입니다.\n• 반도체(p-Si Body): 게이트 전압이 만든 전기장에 반응하여 표면의 정공과 전자 분포가 극적으로 변화합니다.\n• 과도 전류 vs DC 전류: 바이어스가 바뀔 때는 커패시터를 채우는 외부 충전 전류(Displacement/Charging Current)가 흐르지만, 산화막을 직접 뚫고 지나가는 정상 DC 전류는 0입니다.',
      whyExplanation:
        '가우스 법칙(Gauss\'s Law)에 따라 게이트 전극에 쌓인 전하는 절연막을 가로지르는 전기장(Electric Field)을 형성하며, 이 전기장이 반도체 표면의 가동 캐리어를 밀어내거나 끌어당겨 소자의 전도성을 조절합니다. 이것이 바로 "전계효과(Field Effect)"의 본질입니다.',
      initialParams: {},
      rules: [],
      voice: {
        intro:
          '절연막으로 막혀 있어도 전기장은 실리콘 내부로 침투합니다. MOS 구조가 어떻게 전하를 제어하는지 4단계로 탐구해 보겠습니다.',
      },
      hints: [
        {
          level: 1,
          title: '절연과 전기장의 차이',
          description: '전자가 직접 통과하는 직류 전도와 공간을 건너 전달되는 전기장 효과는 서로 다릅니다.',
          voiceLine: '전자가 직접 통과하는 직류 전도와 공간을 건너 전달되는 전기장 효과는 서로 다릅니다.',
        },
      ],
      successMessage: 'MOS 커패시터의 기본 3층 구조 개념을 확인했습니다. 1단계 전계 및 충전 전류 실험으로 넘어갑니다.',
    },

    // Step 1: 14-S01 Oxide Field & Charging Current
    {
      id: 'step-mos14-s1-oxide-field',
      title: '1단계: 절연막 너머의 전계와 과도 충전 전류 (14-S01)',
      stepType: 'MANIPULATE',
      storyLead: '절연막으로 막아놓고 실리콘을 조절할 방법이 남아 있을까요?',
      prompt:
        '게이트 전압을 바꿀 때 산화막 아래에서 일어날 일을 먼저 예측한 뒤, 전압(−0.5V / +0.3V)과 외부 회로 시간 상태(전압 변경 순간 / 정착 후)를 조작하며 DC 전도와 충전 전류를 비교하세요.',
      detailExplanation:
        '• 이상적 산화막(SiO₂): 정상상태(Steady State)에서 절연막을 통과하는 직류 누설 전류는 이상적으로 0 A입니다.\n• 외부 충전 전류: 게이트 전압을 바꾸는 순간(Switching Transient)에는 커패시터 판에 전하를 공급하기 위해 외부 게이트 도선에 과도 전류가 흐릅니다.\n• 전계 효과: 절연막이 캐리어의 직접 이동을 막더라도, 전기장은 산화막을 통과해 실리콘 표면 전하 분포를 변화시킵니다.',
      whyExplanation:
        'MOS=Metal-Oxide-Semiconductor입니다. 이상적인 유전체는 정상상태의 직접 DC 전도가 없지만 전계는 p-Si 표면 전하를 움직일 수 있어요. 외부 게이트 회로는 전압 변경 순간 정전용량 충전 전류를 흘릴 수 있습니다. 실물 터널링·트랩·TDDB 등은 모형 밖입니다.',
      simulatorType: 'mos14-oxide-field',
      physicsAssumptions: '이상 1D p-Si, ideal insulating SiO₂ · IG,DC=0 toy; 과도 변화 중 external charging 가능. VFB=0 가정은 특수 조건',
      sourceRefs: ['MIT 6.012 Microelectronic Devices and Circuits (Lecture 9 MOS Capacitor)'],
      initialParams: {
        gateV: 0.3,
        phase: 'steady',
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 게이트와 실리콘 사이에 절연막이 있을 때 전압을 바꾸면 실리콘에 변화가 생길까요?',
          type: 'radioGroup',
          options: [
            {
              label: '직접 전자가 통과하지 않아도 전기장에 의해 표면 전하가 변해요.',
              value: 'field',
            },
            {
              label: '절연막이므로 실리콘 표면에는 어떤 물리적 변화도 없어요.',
              value: 'none',
              misconception: '절연막은 직류 전도를 막지만 전기장은 투과하여 반도체 표면 캐리어를 제어합니다.',
            },
          ],
        },
        {
          id: 'gateV',
          label: '게이트 전압 (VGB)',
          type: 'radioGroup',
          options: [
            { label: '−0.5V (음전압)', value: -0.5 },
            { label: '+0.3V (양전압)', value: 0.3 },
          ],
        },
        {
          id: 'phase',
          label: '외부 회로의 시간 상태',
          type: 'radioGroup',
          options: [
            { label: '전압 변경 순간 (과도 상태)', value: 'switching' },
            { label: '정착 후 (정상 상태)', value: 'steady' },
          ],
        },
        {
          id: 'answer',
          label: '물리 원리와 오개념 구별',
          type: 'radioGroup',
          options: [
            {
              label: '절연막 속 정상 DC 전도와 전기장 효과는 달라요. 전압을 바꾸는 순간 외부 충전 전류가 있을 수 있어요.',
              value: 'field-not-dc',
            },
            {
              label: '절연막이 있으면 전기장도 절대로 실리콘에 닿지 않아요.',
              value: 'm1',
              misconception: '절연막을 통과하는 DC 전도와 전기장의 영향은 다른 물리 현상이에요.',
            },
            {
              label: '전압을 올리는 순간에도 외부 게이트 배선의 전류는 늘 0이에요.',
              value: 'm2',
              misconception: '커패시터의 전하를 새로 채우는 동안 외부 회로에 과도 충전 전류가 존재할 수 있어요.',
            },
            {
              label: '실물 초박막 절연막은 누설·파괴가 물리적으로 불가능해요.',
              value: 'm3',
              misconception: '실물에는 누설·터널링·산화막 파괴와 열화가 있을 수 있어요.',
            },
          ],
        },
      ],
      rules: [
        {
          targetKey: 'history',
          label: '음전압 바이어스 관찰',
          operator: 'contains',
          expected: 'negative',
          feedbackIfFail: '게이트 전압을 −0.5V로 변경하여 관찰하세요.',
        },
        {
          targetKey: 'history',
          label: '양전압 바이어스 관찰',
          operator: 'contains',
          expected: 'positive',
          feedbackIfFail: '게이트 전압을 +0.3V로 변경하여 관찰하세요.',
        },
        {
          targetKey: 'history',
          label: '전압 변경 순간 관찰',
          operator: 'contains',
          expected: 'switching',
          feedbackIfFail: '시간 상태를 "전압 변경 순간"으로 설정하여 과도 충전 전류를 관찰하세요.',
        },
        {
          targetKey: 'history',
          label: '정착 후 정상상태 관찰',
          operator: 'contains',
          expected: 'steady',
          feedbackIfFail: '시간 상태를 "정착 후"로 설정하여 이상 DC 전도가 0임을 확인하세요.',
        },
        {
          targetKey: 'answer',
          label: '전계 효과 및 충전 전류 원리 선택',
          operator: 'eq',
          expected: 'field-not-dc',
          feedbackIfFail: '절연막 정상 DC와 전계 작용, 과도 충전 전류를 구별한 설명을 선택하세요.',
        },
      ],
      voice: {
        intro: '게이트와 실리콘 사이를 자세히 봐주세요. 전압을 바꾸면 아래쪽 전하는 어떻게 될지 먼저 골라볼까요?',
      },
      hints: [
        {
          level: 1,
          title: '커패시터 두 도판',
          description: '커패시터 두 판은 도선으로 직접 이어지지 않았지만 전하가 충전됩니다.',
          voiceLine: '커패시터 두 도판은 직접 이어지지 않았지만 충전 전류가 흐릅니다.',
        },
        {
          level: 2,
          title: '전압 변화와 게이트 전하',
          description: '전압을 바꾸는 동안에는 게이트 표면에 전하가 유입되거나 유출됩니다.',
          voiceLine: '전압을 바꾸는 동안에는 게이트 표면 전하가 변하며 외부 전류가 흐릅니다.',
        },
        {
          level: 3,
          title: '이상 정상 DC vs 과도 충전',
          description: '이상적 정상 DC와 실제 누설 및 과도 충전 전류는 서로 명확히 구별해야 합니다.',
          voiceLine: '이상적 정상 직류와 과도 충전 전류를 구별하세요.',
        },
      ],
      successMessage: '산화막 절연과 외부 과도 충전 전류, 전기장 표면 제어 원리를 정확히 파악했습니다!',
    },

    // Step 2: 14-S02 Accumulation, Depletion, Inversion
    {
      id: 'step-mos14-s2-accumulation-inversion',
      title: '2단계: 표면 전하의 3대 상태 — 축적·공핍·반전 (14-S02)',
      stepType: 'MANIPULATE',
      storyLead: 'p형 실리콘 표면에서 정공 대신 전자가 많아질 수도 있을까요?',
      prompt:
        'p형 기판의 도핑 원자는 그대로인데 표면 캐리어가 어떻게 변할지 먼저 예측한 뒤, 4가지 전압(−0.5V / 0V / +0.3V / +1.1V)을 직접 조작하여 축적·평탄띠·공핍·반전 상태를 관찰하고 올바른 설명을 고르세요.',
      detailExplanation:
        '• 축적(Accumulation, VGB < VFB): 음의 게이트 전압이 양의 다수 운반자(정공)를 산화막 표면으로 강하게 끌어당깁니다.\n• 평탄띠(Flatband, VGB = VFB = 0V 특수 가정): 밴드 휨이 없이 에너지띠가 평탄한 상태입니다 (일반적으로는 금속 일함수와 계면 전하로 인해 VFB ≠ 0V).\n• 공핍(Depletion, VFB < VGB < VT): 양의 게이트 전압이 정공을 벌크 쪽으로 밀어내어, 움직이지 못하는 음의 고정 수용체 이온(Acceptor Ions, B⁻)만 남습니다.\n• 반전(Inversion, VGB ≥ VT): 게이트 전압이 문턱전압(VT ≈ 0.785V)을 넘으면 소수 운반자인 전자가 표면에 다수 모여 n형 채널처럼 반전층을 형성합니다.',
      whyExplanation:
        '특별히 VFB=0인 이상적 p-Si, 300K, NA=10¹⁶cm⁻³, 산화막 5nm에서는 toy VT≈0.785V. −0.5V는 정공 축적, 0V는 이 모형에서만 flatband, +0.3V는 공핍, +1.1V는 강한 반전이에요. 이 그림은 충분히 기다린 준평형의 정성적 상태이고 빠른 스윕에서는 deep depletion이 나타날 수 있어요. M01 Vth0.7은 별도 모형입니다.',
      simulatorType: 'mos14-accumulation-inversion',
      physicsAssumptions: 'p-Si NA 1e16cm⁻³, ni 1e10cm⁻³, 300K, VFB=0 특수 toy, tox 5nm. 1D 준평형 정성 도식, 빠른 스윕 deep depletion/약한 반전 생략',
      sourceRefs: ['Sze & Ng, Physics of Semiconductor Devices (Ch. 4 MOS Capacitor)'],
      initialParams: {
        gateV: 0,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 게이트 전압을 바꿀 때 p형 실리콘 표면에서 일어나는 일은?',
          type: 'radioGroup',
          options: [
            {
              label: '도핑 원자는 그대로이고 움직이는 운반자(정공/전자)의 공간 분포가 달라져요.',
              value: 'surface',
            },
            {
              label: '표면 상태가 바뀌면 실리콘의 붕소 원자가 인 원자로 변환돼요.',
              value: 'dopant',
              misconception: '도핑 원자는 화학적으로 고정되어 있으며 전하 운반자(캐리어)만 이동합니다.',
            },
          ],
        },
        {
          id: 'gateV',
          label: 'p형 벌크 그대로 · 게이트 전압 (VGB)',
          type: 'radioGroup',
          options: [
            { label: '−0.5V (축적 Accumulation)', value: -0.5 },
            { label: '0V (평탄띠 Flatband)', value: 0 },
            { label: '+0.3V (공핍 Depletion)', value: 0.3 },
            { label: '+1.1V (반전 Inversion)', value: 1.1 },
          ],
        },
        {
          id: 'answer',
          label: '표면 전하 물리 메커니즘 선택',
          type: 'radioGroup',
          options: [
            {
              label: 'p형 bulk와 고정 acceptor 이온은 남아요. 음전압 축적→0V 특수 flatband→양전압 공핍→더 높은 양전압 반전으로 표면 캐리어가 바뀌어요.',
              value: 'bulk-unchanged',
            },
            {
              label: '반전되면 acceptor 도핑 원자가 donor 원자로 변해요.',
              value: 'm1',
              misconception: '도핑 원자는 변하지 않고 전자와 정공의 공간 분포가 달라져요.',
            },
            {
              label: '모든 MOS는 VGB=0에서 flatband이고 VT=0.7V예요.',
              value: 'm2',
              misconception: '여기만 특별히 VFB=0 toy를 택했습니다. 실제 VFB·VT는 일함수와 산화막/계면 전하 등에도 달라져요.',
            },
            {
              label: '공핍층엔 전자·정공·고정 이온이 전부 사라져 진공이 돼요.',
              value: 'm3',
              misconception: '공핍은 이동 가능한 다수 캐리어가 줄어드는 것이며 고정 도핑 이온은 남습니다.',
            },
          ],
        },
      ],
      rules: [
        {
          targetKey: 'history',
          label: '축적(Accumulation) 상태 관찰',
          operator: 'contains',
          expected: 'accumulation',
          feedbackIfFail: '게이트 전압을 −0.5V로 설정하여 표면 정공 축적을 관찰하세요.',
        },
        {
          targetKey: 'history',
          label: '평탄띠(Flatband) 상태 관찰',
          operator: 'contains',
          expected: 'flatband',
          feedbackIfFail: '게이트 전압을 0V로 설정하여 평탄띠 상태를 관찰하세요.',
        },
        {
          targetKey: 'history',
          label: '공핍(Depletion) 상태 관찰',
          operator: 'contains',
          expected: 'depletion',
          feedbackIfFail: '게이트 전압을 +0.3V로 설정하여 정공 밀림 및 고정 음이온 노출을 관찰하세요.',
        },
        {
          targetKey: 'history',
          label: '반전(Inversion) 상태 관찰',
          operator: 'contains',
          expected: 'inversion',
          feedbackIfFail: '게이트 전압을 +1.1V로 설정하여 표면 전자 반전층 형성을 관찰하세요.',
        },
        {
          targetKey: 'answer',
          label: '표면 반전 원리 선택',
          operator: 'eq',
          expected: 'bulk-unchanged',
          feedbackIfFail: 'p형 기판 불변과 축적·공핍·반전 표면 상태를 정확히 설명한 항목을 선택하세요.',
        },
      ],
      voice: {
        intro: 'p형이라는 이름은 그대로예요. 게이트 전압을 바꿀 때 겉부분의 전하가 어떻게 될지 먼저 예상해 보세요.',
      },
      hints: [
        {
          level: 1,
          title: '원자 종류 vs 캐리어 분포',
          description: '바뀌는 것은 도핑 원자 자체가 아니라 전도에 참여하는 캐리어의 공간 분포입니다.',
          voiceLine: '도핑 원자가 바뀌는 것이 아니라 전하 캐리어의 분포가 변합니다.',
        },
        {
          level: 2,
          title: '평탄띠 전압(VFB)',
          description: 'Flatband가 0V인 것은 교육용 특수 모형입니다. 실제는 일함수 차이에 따라 달라집니다.',
          voiceLine: '평탄띠 전압 0V는 교육용 특수 모형이며 실제 소자에서는 일함수에 따라 다릅니다.',
        },
        {
          level: 3,
          title: '공핍층의 고정 음이온',
          description: '양전압에 의해 정공이 밀려나면 음전하를 띤 고정 붕소 이온(B⁻)이 남습니다.',
          voiceLine: '정공이 밀려나면 고정된 억셉터 음이온이 공간전하를 형성합니다.',
        },
      ],
      successMessage: '축적·평탄띠·공핍·반전의 4대 표면 영역과 문턱전압 도출 원리를 완벽히 이해했습니다!',
    },

    // Step 3: 14-S03 Oxide Capacitance & C-V Frequency Dispersion
    {
      id: 'step-mos14-s3-capacitance-cv',
      title: '3단계: 산화막 두께 tox와 C-V 특성의 주파수 분산 (14-S03)',
      stepType: 'MANIPULATE',
      storyLead: '절연막을 두껍게 만드는 순간 전하를 제어하는 힘이 어떻게 달라질까요?',
      prompt:
        '산화막 두께가 5nm에서 10nm로 2배 증가할 때 단위면적 정전용량(C\'ox)의 변화를 먼저 예측한 뒤, 두께를 변경하고 심화 버튼으로 고주파(HF) vs 저주파(LF) C-V 곡선을 열어 비교하세요.',
      detailExplanation:
        '• 산화막 기하 정전용량: C\'ox = εox / tox (단위면적당 F/m² 또는 µF/cm²). 산화막 두께가 2배가 되면 C\'ox는 정확히 절반(0.5배)으로 감소합니다.\n  - 5nm: C\'ox ≈ 0.690627 µF/cm²\n  - 10nm: C\'ox ≈ 0.345313 µF/cm²\n• 공핍층 직렬 커패시턴스: 공핍 영역에서는 산화막 용량(Cox)과 공핍층 용량(Cdep)이 직렬 연결되어 총 용량이 감소합니다: 1/Ctotal = 1/Cox + 1/Cdep < Cox.\n• 주파수 분산(Frequency Dispersion): 반전 영역에서 소수 운반자(전자)의 생성-재결합 속도는 상대적으로 느립니다. 고주파(HF)에서는 빠른 교류 신호를 따라가지 못해 Cmin에 머무르고, 저주파(LF)나 준평형에서는 신호를 따라가 Cox 수준으로 회복됩니다.',
      whyExplanation:
        'SiO₂ εr3.9, ε0=8.8541878128×10⁻¹²F/m로 C′ox(5nm)≈0.690627µF/cm², 10nm≈0.345313µF/cm²입니다. 단위면적 기하학적 산화막 C′ox와 실제 총 게이트 C–V는 다릅니다. 공핍층은 직렬로 보며 반전의 HF/LF 응답은 별도이고 정성 스케치는 실측 곡선이 아니에요.',
      simulatorType: 'mos14-capacitance-cv',
      physicsAssumptions: 'ideal parallel-plate SiO₂ εr 3.9, tox 5/10nm, C′ox 기하학적 값만 정량, Cdep toy 0.5*Cox, HF/LF 도식 실측 아님',
      sourceRefs: ['OpenStax University Physics Vol. 2 (Capacitor Physics)', 'MIT 6.012 Lecture 9 MOS C-V'],
      initialParams: {
        oxideNm: 5,
        showCv: false,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 산화막 두께(tox)가 5nm에서 10nm로 두 배가 되면 단위면적 정전용량(C\'ox)은?',
          type: 'radioGroup',
          options: [
            {
              label: '두께와 반비례하므로 절반(0.5배)으로 줄어들어요.',
              value: 'half',
            },
            {
              label: '두께가 두 배이므로 커패시턴스도 두 배로 늘어나요.',
              value: 'double',
              misconception: '커패시턴스 식 C = εA/d에서 두께 d는 분모에 위치하므로 반비례합니다.',
            },
            {
              label: '절연막 두께는 정전용량과 아무런 관계가 없어요.',
              value: 'same',
              misconception: '두 도체 사이 거리가 멀어질수록 단위 전압당 저장 가능한 전하량이 감소합니다.',
            },
          ],
        },
        {
          id: 'oxideNm',
          label: 'SiO₂ 산화막 두께 (tox)',
          type: 'radioGroup',
          options: [
            { label: '5nm (C\'ox ≈ 0.69 µF/cm²)', value: 5 },
            { label: '10nm (C\'ox ≈ 0.35 µF/cm²)', value: 10 },
          ],
        },
        {
          id: 'showCv',
          label: 'HF/LF C–V 정성 특성 곡선 확장 보기',
          type: 'toggle',
        },
        {
          id: 'answer',
          label: 'C-V 특성 곡선 및 기하 용량 원리 선택',
          type: 'radioGroup',
          options: [
            {
              label: '기하학적 C′ox=εox/tox는 두께에 반비례하고, 공핍층은 직렬로 작용해 전체 C가 작아져요. HF/LF C–V는 응답 조건에 따라 달라요.',
              value: 'inverse-series-frequency',
            },
            {
              label: '두께가 2배면 산화막 C는 정확히 2배 커져요.',
              value: 'm1',
              misconception: '동일 유전체/면적에서 t는 분모이므로 두꺼워질수록 C는 작아집니다.',
            },
            {
              label: '공핍 상태의 총 C는 C′ox+C′dep로 단순 합산해요.',
              value: 'm2',
              misconception: '직렬이면 1/Ctotal=1/Cox+1/Cdep입니다.',
            },
            {
              label: '실측 inversion C–V는 모든 주파수에서 정확히 같은 곡선이에요.',
              value: 'm3',
              misconception: 'AC 소수캐리어 응답·트랩·측정 주파수에 따라 달라질 수 있어요.',
            },
          ],
        },
      ],
      rules: [
        {
          targetKey: 'history',
          label: '5nm 산화막 용량 관찰',
          operator: 'contains',
          expected: 'tox5',
          feedbackIfFail: '산화막 두께를 5nm로 설정하여 C\'ox를 관찰하세요.',
        },
        {
          targetKey: 'history',
          label: '10nm 산화막 용량 관찰',
          operator: 'contains',
          expected: 'tox10',
          feedbackIfFail: '산화막 두께를 10nm로 변경하여 용량이 절반으로 줄어듦을 확인하세요.',
        },
        {
          targetKey: 'history',
          label: 'HF/LF C-V 곡선 비교 관찰',
          operator: 'contains',
          expected: 'cv',
          feedbackIfFail: 'HF/LF C–V 확장 토글을 켜서 주파수 분산 도식을 확인하세요.',
        },
        {
          targetKey: 'answer',
          label: '두께 반비례 및 직렬 용량 원리 선택',
          operator: 'eq',
          expected: 'inverse-series-frequency',
          feedbackIfFail: '두께 반비례, 공핍 직렬 합성, 고주파-저주파 응답 차이를 설명한 항목을 선택하세요.',
        },
      ],
      voice: {
        intro: '두께만 바꿔보세요. 전하를 저장하는 능력이 얼마큼 달라질지 먼저 선택해 볼까요?',
      },
      hints: [
        {
          level: 1,
          title: '평행판 커패시터 공식',
          description: 'C = εA/t 공식에서 두께 t는 분모에 위치합니다.',
          voiceLine: '커패시터 공식에서 두께는 분모에 있어 반비례합니다.',
        },
        {
          level: 2,
          title: '직렬 커패시터 합성',
          description: '직렬 커패시턴스는 역수 합으로 계산되므로 각 구성 요소보다 작아집니다.',
          voiceLine: '직렬 커패시턴스는 역수 합으로 합성되어 전체 용량이 줄어듭니다.',
        },
        {
          level: 3,
          title: '소수 운반자 응답 속도',
          description: '소수 운반자인 전자는 빠른 고주파 신호를 즉각 따라오지 못해 Cmin에 머뭅니다.',
          voiceLine: '소수 운반자는 고주파 교류 신호를 따라가지 못해 Cmin을 나타냅니다.',
        },
      ],
      successMessage: '산화막 두께 반비례 법칙과 공핍 직렬 합성, C-V 주파수 분산 메커니즘을 규명했습니다!',
    },

    // Step 4: 14-S04 Bridge from MOS Cap to MOSFET
    {
      id: 'step-mos14-s4-cap-to-nmosfet',
      title: '4단계: 2단자 MOS 커패시터에서 MOSFET으로 (14-S04)',
      stepType: 'MANIPULATE',
      storyLead: '게이트 아래에 전자 통로가 생겼는데, 이 상태만으로 전류가 흘러갈까요?',
      prompt:
        '커패시터에 드레인이 없을 때 드레인 전류(ID)가 어떻게 정의될지 먼저 예측한 뒤, 2단자 커패시터와 n+ 소스/드레인이 부착된 nMOS 구조를 변경하고 VDS 전압을 인가하며 실제 통전 조건을 확인하세요.',
      detailExplanation:
        '• 2단자 MOS 커패시터: 소스/드레인 단자가 존재하지 않으므로 드레인 전류(ID)라는 물리량 자체가 "정의되지 않음(Undefined)" 상태입니다.\n• nMOS 구조 (VDS = 0V): n+ 소스와 드레인이 추가되고 게이트 반전층이 형성되어 통로가 열렸더라도, 두 단자 간 전위차(VDS = 0V)가 없으면 이상적 순 드레인 전류는 0 A입니다.\n• nMOS 구조 (VDS > 0V): 게이트 반전층(전도 채널)과 양의 드레인 전압(VDS = +0.5V)이 모두 갖추어질 때 비로소 소스에서 드레인으로 전자가 이동하며 순 전류가 흐를 수 있습니다.',
      whyExplanation:
        'p형 몸체에서 양의 VGB로 반전 채널이 생길 수 있지만 MOS 커패시터에는 source/drain이 없으므로 ID는 미정의입니다. n+ S/D를 추가하면 nMOS 구조가 되고 VDS=0의 이상적인 순 ID는 0이며, VDS>0·적절한 채널이면 흐를 수 있어요. 몸체를 source에 연결한 toy에서 VGB=VGS=1.1V로 취급하며 실제 subthreshold·온도·누설은 모형 밖입니다.',
      simulatorType: 'mos14-cap-to-nmosfet',
      physicsAssumptions: '2단자 MOS cap ID undefined, S/D 추가 nMOS VDS=0 ideal ID=0, VDS=+0.5V qualitative possible, toy VGB=VGS=1.1V',
      sourceRefs: ['MIT 6.012 Lecture 10 Three-Terminal MOS and MOSFET'],
      initialParams: {
        device: 'capacitor',
        vds: 0,
        gateV: 1.1,
        oxideNm: 5,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 표면에 전자 반전층이 생기면 언제나 큰 드레인 전류가 흐를까요?',
          type: 'radioGroup',
          options: [
            {
              label: '드레인 단자가 있어야 하고, 소스와 드레인 사이에 전위차가 걸려야 순 전류가 흘러요.',
              value: 'terminal',
            },
            {
              label: '표면에 전자만 보이면 2단자 커패시터든 뭐든 큰 전류가 저절로 흘러요.',
              value: 'always',
              misconception: '전류가 흐르기 위해서는 전하 운반자 통로뿐만 아니라 양 끝 단자와 전위차가 필수적입니다.',
            },
          ],
        },
        {
          id: 'device',
          label: '소자 구조 선택',
          type: 'radioGroup',
          options: [
            { label: '2단자 MOS 커패시터 (S/D 없음)', value: 'capacitor' },
            { label: 'n+ S/D 부착 nMOS 구조', value: 'nmos' },
          ],
        },
        {
          id: 'vds',
          label: '드레인-소스 전압 (VDS)',
          type: 'radioGroup',
          options: [
            { label: '0V (전위차 없음)', value: 0 },
            { label: '+0.5V (양의 전위차 인가)', value: 0.5 },
          ],
        },
        {
          id: 'answer',
          label: '드레인 전류 형성 조건 선택',
          type: 'radioGroup',
          options: [
            {
              label: '커패시터엔 ID가 정의되지 않아요. S/D가 있는 nMOS에서 VDS=0이면 이상적 순 ID=0, 적절한 채널과 VDS>0이면 전류가 흐를 수 있어요.',
              value: 'terminals-and-vds',
            },
            {
              label: '드레인 단자 없는 MOS 커패시터에서도 표면 반전만 생기면 ID가 저절로 흘러요.',
              value: 'm1',
              misconception: '드레인 단자가 없다면 ID라는 측정량부터 정의할 수 없습니다.',
            },
            {
              label: 'VGS>VT면 VDS=0에서도 ID는 반드시 양수예요.',
              value: 'm2',
              misconception: '이상적 정상상태의 순 드레인-소스 전류는 VDS=0이면 0입니다.',
            },
            {
              label: 'MOSFET 게이트에 PN 다이오드 순방향 전류를 넣어 채널을 만듭니다.',
              value: 'm3',
              misconception: '절연 게이트의 전계가 표면 캐리어를 제어하며 직접 PN 전도와는 다릅니다.',
            },
          ],
        },
      ],
      rules: [
        {
          targetKey: 'history',
          label: '2단자 MOS 커패시터 관찰',
          operator: 'contains',
          expected: 'cap',
          feedbackIfFail: '소자 구조를 2단자 MOS 커패시터로 설정하여 ID가 미정의됨을 관찰하세요.',
        },
        {
          targetKey: 'history',
          label: 'nMOS VDS=0V 관찰',
          operator: 'contains',
          expected: 'nmos-zero',
          feedbackIfFail: 'nMOS 구조에서 VDS=0V로 설정하여 채널이 있어도 순 전류가 0임을 확인하세요.',
        },
        {
          targetKey: 'history',
          label: 'nMOS VDS=+0.5V 통전 관찰',
          operator: 'contains',
          expected: 'nmos-positive',
          feedbackIfFail: 'nMOS 구조에서 VDS=+0.5V로 변경하여 순 드레인 전류 통전을 관찰하세요.',
        },
        {
          targetKey: 'answer',
          label: 'MOSFET 단자 및 바이어스 조건 선택',
          operator: 'eq',
          expected: 'terminals-and-vds',
          feedbackIfFail: '커패시터 ID 미정의와 nMOS VDS 조건에 따른 드레인 전류 흐름을 올바르게 선택하세요.',
        },
      ],
      voice: {
        intro: '표면의 전자 길을 관찰해 보세요. 이 길만으로 전류가 흐를까요? 단자를 하나씩 붙여보세요.',
      },
      hints: [
        {
          level: 1,
          title: '단자의 부재',
          description: '드레인 단자가 없다면 드레인 전류(ID)라는 물리량 자체를 측정할 수 없습니다.',
          voiceLine: '드레인 단자가 없다면 드레인 전류는 정의되지 않습니다.',
        },
        {
          level: 2,
          title: '전위차와 전류',
          description: '옴의 법칙처럼 채널이 있더라도 양 끝 단자의 전위차(VDS)가 0이면 순 전류는 흐르지 않습니다.',
          voiceLine: '전압차가 없으면 채널이 있더라도 순 전류가 흐르지 않습니다.',
        },
        {
          level: 3,
          title: '절연 게이트 전계 제어',
          description: 'MOS 게이트는 다이오드처럼 전류를 흘리는 것이 아니라 전계로 전자를 모읍니다.',
          voiceLine: '게이트는 절연되어 전계로 표면을 제어하며 직접 전류를 넣지 않습니다.',
        },
      ],
      successMessage: '2단자 커패시터에서 3단자 MOSFET으로의 진화와 순 드레인 전류 통전 조건을 완벽히 정리했습니다!',
    },

    // Step 5: Synthesis / Review
    {
      id: 'step-mos14-s5-synthesis',
      title: '종합 정리: MOS 구조에서 3단자 전계효과 트랜지스터로',
      stepType: 'CONCEPT',
      storyLead: '절연된 커패시터의 전계 제어부터 현대 나노 반도체 스위치까지의 여정을 정리합니다.',
      prompt:
        '축하합니다! Lesson 14를 통해 금속-산화막-반도체 3층 구조의 정전학적 원리부터 표면 반전, 그리고 MOSFET 채널로의 연결까지 완주했습니다. 아래 핵심 요약을 확인하고 다음 Lesson 01 MOSFET 스위칭 실습으로 나아가세요.',
      detailExplanation:
        '1. 이상 산화막 절연과 전계 제어: 정적 DC 전류 없이도 전기장은 실리콘 표면 캐리어를 제어하며, 바이어스 스위칭 시 외부 게이트 충전 전류가 흐릅니다.\n2. 3대 동작 영역: 음전압 축적(Accumulation) → 0V 평탄띠(Flatband) → 양전압 공핍(Depletion, 고정 B⁻ 이온) → 문턱전압(VT ≈ 0.785V) 이상 강한 반전(Inversion, 전자 채널).\n3. 산화막 두께 tox와 C-V: C\'ox = εox / tox로 두께에 반비례하며, 공핍층은 직렬로 합성되고, 고주파(HF)에서는 소수 운반자의 느린 생성 속도로 인해 Cmin에 머무릅니다.\n4. 커패시터와 트랜지스터의 차이: 2단자 MOS 커패시터는 ID가 미정의이지만, n+ 소스와 드레인을 부착하고 VDS > 0V를 인가하면 제어 가능한 거대한 스위칭 소자가 완성됩니다.',
      whyExplanation:
        '현대 첨단 FinFET과 GAA(Gate-All-Around) 소자 역시 이 MOS 커패시터의 정전학적 전계 제어와 표면 반전 원리를 3차원 입체 나노와이어/나노시트로 감싼 확장 구조입니다. 고유전율 절연막(High-k)과 유효 산화막 두께(EOT) 혁신 또한 이번에 배운 C\'ox = εox / tox의 스케일링 한계를 돌파하기 위한 공학적 산물입니다.',
      initialParams: {},
      rules: [],
      voice: {
        intro:
          'MOS 커패시터의 4단계 탐험을 모두 마쳤습니다. 이제 이 기초를 발판 삼아 Lesson 01 MOSFET 레슨에서 드레인 전류를 본격적으로 제어해 보세요.',
      },
      hints: [
        {
          level: 1,
          title: 'MOSFET으로의 연계',
          description: '다음 레슨 01에서 VGS와 VDS 두 다이얼을 직접 조작해 보세요.',
          voiceLine: '다음 레슨 01에서 게이트와 드레인 전압을 직접 조절해 보세요.',
        },
      ],
      successMessage: 'Lesson 14 MOS 커패시터와 표면 반전 과정을 완주했습니다!',
    },
  ],
};
