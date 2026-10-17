import type { Lesson } from '../../types';

export const dramLesson: Lesson = {
  id: 'lesson-dram',
  courseId: 'course-semiconductor',
  slug: 'dram-bit-cell',
  title: 'DRAM 1T1C: 커패시터 하나에 비트를 담고 기억하는 원리',
  subtitle: '반도체 메모리의 기적: 1T1C 쓰기, 전하 공유, 센스앰프 복원, 누설 리프레시, 뱅크 병렬화',
  category: 'semiconductor',
  description: 'MOSFET 스위치 1개와 커패시터 1개(1T1C)로 0과 1 비트를 저장하는 DRAM의 핵심 동작 원리를 배우고, 미세한 전하 공유 전압을 증폭 복원하는 센스앰프와 뱅크 구조를 직접 조작해 봅니다.',
  prerequisites: ['lesson-mosfet'],
  steps: [
    // Step 0: Concept Intro
    {
      id: 'step-dram-s0-intro',
      title: '0단계: 트랜지스터 1개와 커패시터 1개로 비트 하나를 담다',
      stepType: 'CONCEPT',
      storyLead: 'SRAM은 비트 하나를 저장하는 데 트랜지스터 6개가 필요하지만, DRAM은 트랜지스터 단 1개와 커패시터 1개(1T1C)로 비트를 저장하여 압도적인 고집적도를 달성합니다.',
      prompt: '1T1C 구조는 작고 경제적이지만, 커패시터의 전하는 영구적이지 않고 읽는 순간 훼손됩니다. 이 문제를 현대 반도체 공학이 어떻게 해결했는지 4단계로 탐구해 보세요.',
      detailExplanation: 'DRAM(Dynamic Random Access Memory)의 기본 기억 단위는 접근 트랜지스터(Access Transistor)와 저장 커패시터(Storage Capacitor)의 1T1C 구조입니다.\n• 워드라인(WL, Wordline): 접근 트랜지스터의 게이트를 열고 닫는 제어선\n• 비트라인(BL, Bitline): 데이터를 읽고 쓰는 데이터 입출력선\n• 커패시터(Capacitor): 전하의 유무로 논리 1(VDD 충전)과 0(방전)을 기억하는 저장소',
      whyExplanation: '1T1C 구조는 면적이 매우 작아 기가바이트(GB) 단위 대용량 주기억장치를 가능하게 합니다. 하지만 커패시터에서 전하가 조금씩 새어나가고(누설), 읽는 즉시 전하가 분배되어 사라지는 치명적 약점을 가집니다.',
      hints: [
        {
          level: 1,
          title: '1T1C의 구성',
          description: '스위치 역할을 하는 트랜지스터 1개와 전하를 담는 커패시터 1개로 이루어져 있어요.',
        },
      ],
    },

    // Step 1: D02-S01 Write & Isolation
    {
      id: 'step-dram-s1-write',
      title: '1단계: 워드라인과 비트라인으로 커패시터에 1을 쓰다 (D02-S01)',
      stepType: 'MANIPULATE',
      storyLead: '커패시터에 1을 쓰려면 워드라인(WL)과 비트라인(BL)을 어떤 순서로 조작해야 할까요? 스위치를 닫은 후 비트라인 전압이 변해도 저장된 값이 유지될까요?',
      prompt: '비트 1을 저장하는 조작 순서를 먼저 예상하고, WL=1로 열어 커패시터를 충전한 뒤 WL=0으로 닫고 BL을 0으로 내려도 커패시터에 1이 격리 보존되는지 확인하세요.',
      detailExplanation: 'DRAM 쓰기 동작의 핵심은 격리(Isolation)입니다.\n1. 비트라인(BL)에 쓰고자 하는 전압(1=VDD)을 인가합니다.\n2. 워드라인(WL)에 전압을 가해 접근 트랜지스터를 켜면 커패시터가 충전됩니다.\n3. 워드라인(WL)을 0V로 내려 트랜지스터를 먼저 끕니다.\n4. 이제 비트라인(BL) 전압이 0V로 바뀌더라도 커패시터의 전하는 빠져나가지 못하고 갇히게 됩니다.',
      whyExplanation: '워드라인 스위치를 먼저 끄지 않고 비트라인을 바꾸면 커패시터 전하가 비트라인으로 즉시 방전됩니다. 트랜지스터가 완벽한 차단벽 역할을 해 전하를 커패시터 안에 가둡니다.',
      simulatorType: 'dram-write',
      physicsAssumptions: '이상 장채널 스위치 모형 · 전하 주입 및 기생 커패시턴스는 교육용으로 단순화',
      sourceRefs: ['Kang & Leblebici, CMOS Digital Integrated Circuits', 'A06 D02 DRAM Curriculum'],
      initialParams: {
        wl: 0,
        bl: 1,
        cell: 0,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 커패시터에 1을 쓰고 안전하게 보존하려면 어떻게 해야 할까요?',
          type: 'radioGroup',
          options: [
            { label: 'WL을 열어 충전한 뒤, WL을 닫아야 BL이 바뀌어도 보존돼요.', value: 'close-wl-first' },
            { label: 'WL은 항상 켜두어야 전하가 유지돼요.', value: 'keep-wl-on', misconception: 'WL을 계속 켜두면 BL 전압이 변할 때 커패시터 전하도 함께 방전되어 버려요.' },
            { label: 'BL만 올리면 WL 스위치와 상관없이 저절로 충전돼요.', value: 'bl-only', misconception: '접근 트랜지스터(WL)가 닫혀 있으면 BL의 전압이 커패시터로 전달되지 않아요.' },
          ],
        },
        {
          id: 'wl',
          label: '워드라인 (WL - 게이트 제어)',
          type: 'toggle',
          options: [
            { label: '닫힘 (WL = 0)', value: 0 },
            { label: '열림 (WL = 1)', value: 1 },
          ],
        },
        {
          id: 'bl',
          label: '비트라인 (BL - 데이터 공급)',
          type: 'toggle',
          options: [
            { label: '0 V (논리 0)', value: 0 },
            { label: 'VDD (논리 1)', value: 1 },
          ],
        },
        {
          id: 'answer',
          label: '개념 확인: BL이 0V로 떨어졌는데도 셀에 1이 남아있는 이유는 무엇일까요?',
          type: 'radioGroup',
          options: [
            { label: 'WL=0으로 트랜지스터를 끄면 전하가 갇혀 비트가 격리 보존돼요.', value: 'isolated' },
            { label: '커패시터는 전압이 끊겨도 항상 영구적으로 전하를 생성해요.', value: 'perpetual', misconception: '커패시터는 수동 소자이며 영구 전력원이 아니에요. 스위치가 닫혀 방전 경로가 차단되었기 때문이에요.' },
            { label: '비트라인 전압이 사실은 0V로 떨어지지 않았어요.', value: 'not-zero', misconception: 'BL 전압은 0V로 떨어졌지만, 트랜지스터가 꺼져 셀 노드와 분리되었습니다.' },
          ],
        },
      ],
      rules: [
        {
          label: 'WL ON에서 비트 1 쓰기',
          targetKey: 'history',
          operator: 'contains',
          expected: 'charged',
          feedbackIfFail: 'WL을 열고(WL=1) BL=1인 상태에서 셀을 충전해 보세요.',
        },
        {
          label: 'WL OFF 뒤 BL=0에도 셀 유지',
          targetKey: 'history',
          operator: 'contains',
          expected: 'held',
          feedbackIfFail: 'WL을 0으로 닫은 후 BL을 0으로 내려 전하 격리를 확인하세요.',
        },
        {
          label: '전하 격리 보존 원리 이해',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'isolated',
          feedbackIfFail: '트랜지스터가 꺼지면 방전 통로가 막혀 전하가 셀 노드에 갇히게 됩니다.',
        },
      ],
      hints: [
        { level: 1, title: '문지기 역할', description: '워드라인은 커패시터 방을 여닫는 문지기예요.' },
        { level: 2, title: '충전 순서', description: '문을 열고 전하를 넣은 뒤 문을 닫아보세요.' },
        { level: 3, title: '격리 상태', description: '문(WL)이 닫히면 복도(BL)의 불이 꺼져도 방 안의 전하는 안전합니다.' },
      ],
      successMessage: '완벽합니다! 워드라인을 닫아 전하를 안전하게 가두는 1T1C 쓰기 및 격리 메커니즘을 확인했습니다.',
    },

    // Step 2: D02-S02 Sense & Restore
    {
      id: 'step-dram-s2-sense-restore',
      title: '2단계: 0.5 VDD 사전충전과 전하 공유, 그리고 파괴적 읽기 복원 (D02-S02)',
      stepType: 'MANIPULATE',
      storyLead: '커패시터의 전하량은 비트라인에 비해 10분의 1 수준으로 매우 작습니다. 전하를 비트라인에 쏟아부으면 전압이 어떻게 변하고, 원래 비트는 어떻게 복원될까요?',
      prompt: '비트라인 전하 공유 결과를 먼저 예상하고, 0.5VDD 사전충전 후 전하 공유(ΔV=±0.05V)와 센스앰프 증폭 및 재충전(복원) 과정을 단계별로 관찰한 뒤 올바른 이유를 고르세요.',
      detailExplanation: 'DRAM 읽기는 파괴적 읽기(Destructive Read)입니다.\n1. 사전충전(Precharge): 비트라인을 정확히 0.5 VDD로 충전해 둡니다.\n2. 전하 공유(Charge Sharing): WL을 열면 셀과 비트라인의 전하가 섞입니다. 비트라인 용량이 훨씬 크므로(Cb:Cc ≈ 9:1), 전압은 아주 미세하게(셀=1일 때 약 +0.05V 상승한 0.55V, 셀=0일 때 약 -0.05V 하강한 0.45V) 변합니다.\n3. 센스 증폭(Sense Amplification): 미세한 전압 차(ΔV)를 감지하여 0.55V는 완전한 1.0V(HIGH)로, 0.45V는 0V(LOW)로 밀어 올립니다.\n4. 복원(Restore): 전하 공유로 셀 전압이 훼손되었으므로, 센스앰프가 증폭한 전압을 열려 있는 WL을 통해 커패시터에 다시 가득 채워(재충전) 놓습니다.\n※ 교육용 장면에서는 이해를 돕기 위해 센싱과 복원을 2단계 스냅샷으로 나누어 시각화했습니다.',
      whyExplanation: '전하 공유 수식: Vshared = (Cc·Vcell + Cb·Vpre)/(Cc + Cb). Vpre=0.5V, Cc:Cb=1:9일 때 Vcell=1이면 Vshared = (1 + 4.5)/10 = 0.55V (+0.05V 차이), Vcell=0이면 Vshared = 4.5/10 = 0.45V (-0.05V 차이)가 됩니다. 읽는 순간 원래 셀 전하가 흩어지므로 복원(Restore) 없이는 다음 읽기에서 데이터를 잃게 됩니다.',
      simulatorType: 'dram-sense-restore',
      physicsAssumptions: 'Cc:Cb = 1:9 가상 비율 · ΔV = ±0.05V 단순화 · 실제 tRCD/tRP 센싱 타이밍은 생략',
      sourceRefs: ['Keeth et al., DRAM Circuit Design', 'A06 Deep Dive: DRAM Sense Timing'],
      initialParams: {
        bit: 1,
        phase: 'precharge',
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 커패시터의 비트 1을 읽으려고 스위치를 열면 어떤 일이 일어날까요?',
          type: 'radioGroup',
          options: [
            { label: '비트라인으로 전하가 섞여 미세하게 0.55V로 오르고, 원래 전하는 훼손돼요.', value: 'disturbed-delta' },
            { label: '커패시터 전하가 무한해서 비트라인이 즉시 5V로 뛰어올라요.', value: 'infinite', misconception: '커패시터 용량(Cc)은 비트라인(Cb)보다 훨씬 작아서 전압 변화량은 아주 미세합니다.' },
            { label: '읽기를 해도 커패시터 전하는 전혀 줄어들지 않아요.', value: 'nondestructive', misconception: 'DRAM 읽기는 전하를 나누는 파괴적 읽기이므로 원래 셀 전하가 변형됩니다.' },
          ],
        },
        {
          id: 'bit',
          label: '저장된 셀 데이터 비트 선택',
          type: 'radioGroup',
          options: [
            { label: '비트 1 (VDD 완충전)', value: 1 },
            { label: '비트 0 (0V 방전)', value: 0 },
          ],
        },
        {
          id: 'phase',
          label: '읽기 및 복원 사이클 진행',
          type: 'radioGroup',
          options: [
            { label: '1. 사전충전 (BL = 0.5 VDD)', value: 'precharge' },
            { label: '2. 전하 공유 (WL 오픈, Δ±0.05V)', value: 'shared' },
            { label: '3. 센스 증폭 (BL 풀스윙 판독)', value: 'sensed' },
            { label: '4. 재충전 복원 (셀 전하 원상복구)', value: 'restored' },
          ],
        },
        {
          id: 'answer',
          label: '개념 확인: 센스앰프가 전압을 판독한 뒤 반드시 복원(Restore) 단계를 거쳐야 하는 이유는?',
          type: 'radioGroup',
          options: [
            { label: '전하 공유로 원래 셀 데이터가 훼손(파괴적 읽기)되었기 때문이에요.', value: 'restore' },
            { label: '복원을 하지 않으면 트랜지스터가 영구 파손되기 때문이에요.', value: 'burnout', misconception: '소자 파손이 아니라, 전하가 분배되어 데이터가 사라지는 논리적 손실 때문입니다.' },
            { label: '워드라인을 닫기 전에 비트라인을 접지로 비워야 하기 때문이에요.', value: 'clear-bl', misconception: '복원은 비트라인을 비우는 것이 아니라 셀 커패시터를 다시 원래 전압으로 채우는 과정입니다.' },
          ],
        },
      ],
      rules: [
        {
          label: '사전충전 후 전하 공유 관찰',
          targetKey: 'history',
          operator: 'contains',
          expected: 'shared',
          feedbackIfFail: '전하 공유 단계를 선택해 비트라인 전압의 미세한 변화를 관찰하세요.',
        },
        {
          label: '센스 증폭 및 복원 완료',
          targetKey: 'history',
          operator: 'contains',
          expected: 'restored',
          feedbackIfFail: '센스 증폭과 복원 단계를 차례대로 실행하여 셀 충전을 완료하세요.',
        },
        {
          label: '파괴적 읽기와 복원 필요성 이해',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'restore',
          feedbackIfFail: 'DRAM은 읽는 순간 셀의 전하가 비트라인과 섞여 손상되므로 복원이 필수적입니다.',
        },
      ],
      hints: [
        { level: 1, title: '큰 물통과 작은 컵', description: '큰 물통(비트라인)에 작은 컵(커패시터)의 물을 붓는 모습을 상상해 보세요.' },
        { level: 2, title: '미세한 수위 변화', description: '물통의 수위는 아주 조금 변하지만, 컵 안의 물은 이미 섞여버렸어요.' },
        { level: 3, title: '다시 채워주기', description: '데이터를 계속 보존하려면 센스앰프 펌프로 컵에 물을 다시 가득 채워줘야 합니다.' },
      ],
      successMessage: '정답입니다! 미세한 전하 공유(±0.05V)를 감지하고 파괴된 셀을 즉시 재충전하는 센스앰프 복원의 핵심을 파악했습니다.',
    },

    // Step 3: D02-S03 Leakage & Refresh
    {
      id: 'step-dram-s3-leak-refresh',
      title: '3단계: 누설되는 전하와 주기적 리프레시 (D02-S03)',
      stepType: 'MANIPULATE',
      storyLead: '완벽한 절연체는 세상에 없습니다. 트랜지스터 접합부를 통해 커패시터 전하가 조금씩 새어나가면 데이터는 어떻게 될까요?',
      prompt: '시간 경과에 따른 전하 누설을 예상하고, 가상 시간 슬라이더를 움직여 셀 전압이 감소하는 모습을 관찰한 뒤 리프레시 버튼을 눌러 전하를 복원하세요.',
      detailExplanation: 'DRAM의 "Dynamic(동적)"이라는 명칭은 전하가 가만히 머물러 있지 않고 시간에 따라 빠져나가기 때문에 붙여졌습니다.\n• 접합부 누설 전류(Subthreshold & Junction Leakage)로 인해 커패시터 전압은 시간이 흐르면 서서히 0V로 방전됩니다.\n• 셀 전압이 판독 마진 이하로 떨어지면 비트 1을 0으로 잘못 읽게 됩니다.\n• 따라서 데이터가 지워지기 전에 모든 행을 주기적으로 다시 읽고 써주는 리프레시(Refresh) 동작을 64ms 이내에 반복해야 합니다.\n※ 화면의 시간(0~2)은 수 초/밀리초 단위가 아닌 교육용 정규화 시간 단위입니다.',
      whyExplanation: '리프레시 오버헤드: 메모리 용량이 테라바이트(TB)로 커질수록 리프레시해야 할 행의 수가 급증하여 전력 소모와 성능 저하(Refresh overhead)의 주원인이 됩니다. 이 누설 특성이 비휘발성 NAND 플래시나 정적 SRAM과의 핵심 차이점입니다.',
      simulatorType: 'dram-leak-refresh',
      physicsAssumptions: '선형 누설 근사 모형 (leakRate=0.2) · 정규화 toy time (JEDEC 64ms 표준 미적용)',
      sourceRefs: ['JEDEC DDR4/DDR5 SDRAM Standard', 'Jacob et al., Memory Systems'],
      initialParams: {
        elapsed: 0.0,
        refreshAt: null,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 전원을 켜둔 상태에서도 시간이 지나면 커패시터 전하는 어떻게 될까요?',
          type: 'radioGroup',
          options: [
            { label: '미세한 누설 전류 때문에 시간이 지나면 전하가 빠져나가요.', value: 'leak-over-time' },
            { label: '전원이 켜져 있으면 커패시터 전하는 영원히 100% 유지돼요.', value: 'static-stay', misconception: '트랜지스터의 미세한 누설 전류로 인해 전하가 서서히 방전됩니다.' },
            { label: '외부 온도가 영하이면 전하가 스스로 두 배로 늘어나요.', value: 'grow', misconception: '온도가 낮으면 누설이 줄어들 수는 있지만 전하가 스스로 증가하지는 않습니다.' },
          ],
        },
        {
          id: 'elapsed',
          label: '가상 경과 시간 (정규화 시간)',
          type: 'slider',
          min: 0.0,
          max: 2.0,
          step: 0.1,
        },
        {
          id: 'refresh',
          label: '리프레시 (Refresh) 실행',
          type: 'toggle',
          options: [
            { label: '대기 중', value: false },
            { label: '리프레시 재충전 (VDD 완충)', value: true },
          ],
        },
        {
          id: 'answer',
          label: '개념 확인: DRAM에 주기적인 리프레시 사이클이 반드시 필요한 이유는?',
          type: 'radioGroup',
          options: [
            { label: '누설로 전압 마진이 줄어들어 1이 0으로 오인되는 것을 방지하기 위해', value: 'leak' },
            { label: '메모리 칩 내부의 온도를 낮추기 위한 냉각 동작으로', value: 'cooling', misconception: '리프레시는 오히려 스위칭 전류를 소모하여 열을 발생시킵니다.' },
            { label: '모든 셀의 데이터를 무작위로 섞어 보안을 유지하기 위해', value: 'security', misconception: '리프레시는 데이터를 지키기 위한 재충전 동작입니다.' },
          ],
        },
      ],
      rules: [
        {
          label: '시간 경과로 전하 누설 관찰',
          targetKey: 'history',
          operator: 'contains',
          expected: 'leaked',
          feedbackIfFail: '시간 슬라이더를 1 이상으로 움직여 전압이 감소하는 모습을 관찰하세요.',
        },
        {
          label: '리프레시로 만충전 복구',
          targetKey: 'history',
          operator: 'contains',
          expected: 'refreshed',
          feedbackIfFail: '리프레시 버튼을 켜서 전하를 다시 채워 넣으세요.',
        },
        {
          label: '리프레시 필요성 이해',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'leak',
          feedbackIfFail: '누설로 인해 판독 마진이 줄어들므로 정기적인 리프레시가 필수적입니다.',
        },
      ],
      hints: [
        { level: 1, title: '밑 빠진 독', description: '아주 작은 구멍이 뚫린 독에 물을 채워둔 것과 같아요.' },
        { level: 2, title: '마진 감소', description: '전압이 절반 이하로 떨어지면 센스앰프가 1인지 0인지 분간할 수 없어요.' },
        { level: 3, title: '주기적 채우기', description: '물이 다 빠지기 전에 정기적으로 물을 붓는 동작이 리프레시입니다.' },
      ],
      successMessage: '정답입니다! 동적 메모리의 숙명인 전하 누설과 데이터 보존을 위한 주기적 리프레시 원리를 이해했습니다.',
    },

    // Step 4: D02-S04 Row Bank Parallelism
    {
      id: 'step-dram-s4-row-bank',
      title: '4단계: 뱅크 분할로 요청 지연을 줄이다 (D02-S04)',
      stepType: 'CHECK',
      storyLead: '하나의 뱅크 안에서는 한 행(Row)을 닫고 다음 행을 열기까지 긴 지연(tRP, tRCD)이 걸립니다. 메모리를 여러 뱅크로 쪼개면 어떻게 될까요?',
      prompt: '뱅크 분할 효과를 먼저 예상하고, 1개 뱅크(직렬 처리)와 2개 뱅크(내부 겹침) 타임라인을 비교한 뒤 뱅크 병렬성의 실제 의미를 정확히 설명하세요.',
      detailExplanation: 'DRAM 내부는 여러 개의 독립된 뱅크(Bank)로 나뉘어 있습니다.\n• 동일 뱅크 접근: 요청 A가 행을 열고(Activate), 읽고, 닫을(Precharge) 때까지 요청 B는 대기해야 합니다(직렬 지연).\n• 다중 뱅크 접근(Bank-Level Parallelism): 요청 A가 뱅크 1에서 작업하는 동안, 뱅크 2에서 요청 B의 활성화를 내부적으로 미리 시작(파이프라이닝 겹침)할 수 있습니다.\n※ 외부 데이터 입출력 버스는 하나를 공유하므로 처리량이 단순 2배가 되는 것은 아니며, 내부 지연 시간을 효과적으로 숨기는(Latency hiding) 기술입니다.',
      whyExplanation: '뱅크 레벨 병렬성(BLP)은 CPU/GPU가 대량의 메모리 요청을 쏟아낼 때 메모리 컨트롤러가 뱅크를 번갈아 접근하여(Interleaving) 평균 대기 시간을 획기적으로 낮춥니다. 다음 질문: 고성능 AI 반도체에서는 이 DRAM 수천 개를 수직으로 쌓아 실리콘 관통 전극(TSV)으로 연결한 HBM(고대역폭 메모리)을 사용합니다. HBM은 GPU 메모리 벽을 어떻게 극복할까요? → G03',
      simulatorType: 'dram-row-bank',
      physicsAssumptions: '단순화된 가상 슬롯 타임라인 · 외부 공유 버스 경합 및 복합 타이밍 파라미터는 추상화',
      sourceRefs: ['Mutlu & Moscibroda, Parallelism-Aware Batch Scheduling', 'A06 Curriculum Atlas'],
      initialParams: {
        banks: 1,
        prediction: null,
        answer: null,
        history: [],
      },
      controls: [
        {
          id: 'prediction',
          label: '예측: 메모리를 여러 뱅크로 나누면 두 메모리 요청 A와 B는 어떻게 처리될까요?',
          type: 'radioGroup',
          options: [
            { label: '서로 다른 뱅크라면 내부 동작을 일부 겹쳐서 대기 시간을 줄여요.', value: 'overlap-latency' },
            { label: '외부 버스까지 복제되어 언제나 정확히 2배 속도가 돼요.', value: 'always-2x', misconception: '외부 데이터 버스는 하나를 공유하므로 무조건 2배가 되지는 않아요.' },
            { label: '아무리 뱅크를 나눠도 항상 완벽한 직렬로만 동작해요.', value: 'strictly-serial', misconception: '서로 다른 뱅크는 내부 행 활성화와 프리차지를 병렬로 진행할 수 있습니다.' },
          ],
        },
        {
          id: 'banks',
          label: '뱅크 구성 선택',
          type: 'radioGroup',
          options: [
            { label: '1개 뱅크 (동일 뱅크 직렬 순차 처리)', value: 1 },
            { label: '2개 뱅크 (서로 다른 뱅크 내부 겹침)', value: 2 },
          ],
        },
        {
          id: 'answer',
          label: '개념 확인: 다중 뱅크 구조의 진정한 공학적 의미를 고르세요',
          type: 'radioGroup',
          options: [
            { label: '외부 공유 버스 제약이 있지만, 내부 동작을 겹쳐 대기 지연을 숨긴다.', value: 'conditional' },
            { label: '칩 내부의 트랜지스터 개수를 절반으로 줄여준다.', value: 'reduce-transistor', misconception: '뱅크마다 디코더와 센스앰프가 추가되므로 트랜지스터 수는 오히려 증가합니다.' },
            { label: '커패시터의 전하 누설을 물리적으로 원천 차단해 준다.', value: 'stop-leak', misconception: '누설은 셀 커패시터의 물리적 특성이며 뱅크 분할로 누설이 사라지지 않습니다.' },
          ],
        },
      ],
      rules: [
        {
          label: '동일 뱅크 직렬 처리 관찰',
          targetKey: 'history',
          operator: 'contains',
          expected: 'serial',
          feedbackIfFail: '1개 뱅크 모드에서 요청 A와 B가 순차 실행되는 타임라인을 확인하세요.',
        },
        {
          label: '복수 뱅크 내부 겹침 관찰',
          targetKey: 'history',
          operator: 'contains',
          expected: 'parallel',
          feedbackIfFail: '2개 뱅크 모드로 전환하여 내부 동작이 겹치는 타임라인을 확인하세요.',
        },
        {
          label: '뱅크 레벨 병렬성 의미 이해',
          targetKey: 'answer',
          operator: 'eq',
          expected: 'conditional',
          feedbackIfFail: '외부 공유 버스의 한계 속에서 내부 지연을 숨기는 뱅크 병렬성의 의미를 파악하세요.',
        },
      ],
      hints: [
        { level: 1, title: '주방의 화구 수', description: '화구가 하나인 주방과 화구가 두 개인 주방에서 두 요리를 하는 모습을 떠올려 보세요.' },
        { level: 2, title: '배식구는 하나', description: '요리는 각 화구에서 동시에 시작할 수 있지만, 서빙 테이블(외부 버스)은 하나예요.' },
        { level: 3, title: '지연 시간 단축', description: '외부 버스 병목이 있지만, 내부 조리(활성화) 시간을 겹쳐 총 시간을 줄입니다.' },
      ],
      successMessage: '대성공! 1T1C 셀 물리학에서 시작해 센스앰프 복원, 누설 리프레시, 뱅크 병렬 구조까지 DRAM의 전 과정을 완벽히 마스터했습니다. 다음 레슨(G03)에서는 GPU의 메모리 벽과 HBM으로 이어집니다!',
    },
  ],
};
