import type { Lesson } from '../../types';

export const ohmsLawLesson: Lesson = {
  id: 'circuits-ohms-law',
  courseId: 'course-circuits',
  slug: 'ohms-law-current-control',
  title: '옴의 법칙과 전류 제어 (V = I × R)',
  subtitle: '닫힌 회로 연결부터 저항 가변 및 회로 설계 실습',
  description: '전압, 전류, 저항의 유기적 상관관계를 직접 조작하며 전구의 밝기와 전력 소비 공식(P = I²R)을 체득하는 전기전자 핵심 레슨입니다.',
  category: 'circuits',
  steps: [
    // Step 1: 닫힌 회로와 전류 루프
    {
      id: 'step-ohms-s1-closed-loop',
      title: '1단계: 닫힌 회로와 전류',
      stepType: 'MANIPULATE',
      storyLead: '배터리에 전압이 걸려 있어도 도선이 끊겨 있다면 전자가 움직일 수 있을까요?',
      prompt: '캔버스 상단의 나이프 스위치를 클릭하여 닫힌 루프(Closed Circuit)를 완성하세요. 도선 속 전자가 순환하기 시작하며 전구에 불이 켜지는지 확인하세요.',
      detailExplanation: '전류는 전하의 연속적인 흐름입니다. 스위치가 열려 있으면 공기라는 거대한 절연체가 도선을 가로막아 전자가 이동할 수 없습니다. 스위치를 닫아 금속 도체의 연속적인 폐회로가 형성되면, 배터리의 전기장에 의해 모든 도선 내 전자들이 동시에 표류(Drift)하기 시작합니다.',
      whyExplanation: '전기 회로는 닫힌 루프(Closed Loop)에서만 키르히호프의 전류 법칙(KCL)과 전압 법칙(KVL)을 만족합니다. 스위치 단락 시 전위차가 도선 전체에 광속에 가까운 전자기파로 전파되어 거의 즉시 전류가 흐릅니다.',
      simulatorType: 'ohmsLaw',
      initialParams: {
        voltage: 12.0,
        resistance: 40.0,
        switchClosed: false,
      },
      controls: [
        {
          id: 'switchClosed',
          label: '나이프 스위치',
          type: 'toggle',
          options: [
            { label: '열림 (OFF)', value: false },
            { label: '닫힘 (ON)', value: true },
          ],
        },
      ],
      rules: [
        {
          targetKey: 'switchClosed',
          operator: 'eq',
          expected: true,
          feedbackIfFail: '스위치가 아직 열려 있습니다. 캔버스 속 스위치나 아래 토글 버튼을 눌러 스위치를 닫으세요.',
          voiceIfFail: '스위치를 클릭하여 회로를 닫아보세요.',
        },
      ],
      successMessage: '정답입니다! 스위치가 닫혀 도선 전체에 전자가 순환하며 전구가 점등되었습니다.',
      successVoice: '정답입니다! 닫힌 회로가 완성되어 전류가 흐르기 시작합니다.',
      voice: {
        intro: '옴의 법칙을 알아봅시다. 캔버스 상단의 스위치를 클릭해 닫힌 회로를 만들어보세요.',
        milestone: {
          triggerParam: 'switchClosed',
          threshold: 1,
          direction: 'above',
          speech: '스위치가 닫혔습니다! 전자가 도선을 따라 흐르기 시작합니다.',
        },
        explanation: '폐루프가 완성되어 배터리의 전위차에 의해 전자들이 이동합니다.',
      },
      hints: [
        {
          level: 1,
          title: '스위치 조작',
          description: '캔버스 위쪽의 스위치 또는 아래 토글 버튼을 클릭하세요.',
        },
        {
          level: 2,
          title: '닫힌 상태 확인',
          description: '스위치 칼날이 단자에 맞닿으면 녹색 불이 들어옵니다.',
        },
        {
          level: 3,
          title: '제출',
          description: '스위치가 닫힌 상태에서 [확인하기 (Check)]를 누르세요.',
        },
      ],
    },

    // Step 2: 저항 조절과 전구 밝기
    {
      id: 'step-ohms-s2-resistance-brightness',
      title: '2단계: 저항을 낮추면 전구는 어떻게 될까?',
      stepType: 'MANIPULATE',
      storyLead: '전압이 12V로 일정할 때, 회로의 저항(R)을 줄이면 전류와 전구 밝기는 어떻게 변할까요?',
      prompt: '저항 R 슬라이더를 20Ω 이하로 낮춰보세요. 저항이 줄어듦에 따라 전류 I(V/R)가 급증하고, 전구 필라멘트 발열과 빛(P = I²R)이 강렬해지는 것을 관찰하세요.',
      detailExplanation: '옴의 법칙(I = V / R)에 따르면, 전압이 일정할 때 전류는 저항에 반비례합니다. 저항을 줄이면 전자가 격자 원자와 덜 충돌하므로 더 많은 전하가 흐르게 됩니다. 전구의 밝기는 소비 전력 P = I × V = I² × R에 결정되며, 전류 증가가 저항 감소보다 전력에 더 큰 영향을 미쳐 전구가 훨씬 밝아집니다.',
      whyExplanation: '소비 전력 P = V² / R 로 표현할 수도 있습니다. 전압 V가 12V로 고정되어 있으므로, 저항 R이 절반으로 줄어들면 전력 P는 정확히 2배로 증가합니다.',
      simulatorType: 'ohmsLaw',
      initialParams: {
        voltage: 12.0,
        resistance: 60.0,
        switchClosed: true,
      },
      controls: [
        {
          id: 'resistance',
          label: '가변 저항값 (R)',
          unit: 'Ω',
          type: 'slider',
          min: 10.0,
          max: 100.0,
          step: 5.0,
        },
      ],
      rules: [
        {
          targetKey: 'resistance',
          operator: 'lte',
          expected: 25.0,
          feedbackIfFail: '저항이 여전히 큽니다. 슬라이더를 왼쪽으로 밀어 25Ω 이하로 낮춰 전류를 증가시키세요.',
          voiceIfFail: '저항을 25옴 이하로 더 낮춰보세요.',
        },
      ],
      successMessage: '완벽합니다! 저항이 20Ω 수준으로 낮아져 전류가 0.6A 이상으로 치솟고 전구가 최대 밝기로 빛납니다.',
      successVoice: '완벽합니다! 저항이 감소하여 전류가 증가하고 전구가 밝아졌습니다.',
      voice: {
        intro: '저항 슬라이더를 낮춰 전류와 전구 밝기가 어떻게 변하는지 관찰해보세요.',
        milestone: {
          triggerParam: 'resistance',
          threshold: 25.0,
          direction: 'below',
          speech: '저항이 낮아져 전류가 급증했습니다! 전구가 눈부시게 밝아졌습니다.',
        },
        explanation: '옴의 법칙에 따라 전압이 일정할 때 저항이 작아지면 전류는 증가합니다.',
      },
      hints: [
        {
          level: 1,
          title: '저항의 역할',
          description: '저항은 전자의 흐름을 방해하는 요소입니다. 방해물이 줄어들면 전류가 더 빠르게 흐릅니다.',
        },
        {
          level: 2,
          title: '조작 안내',
          description: '저항 슬라이더를 왼쪽으로 밀어 20Ω 근처로 설정하세요.',
        },
        {
          level: 3,
          title: '목표 수치',
          description: 'R <= 25Ω 설정 후 확인하기 버튼을 누르세요.',
        },
      ],
    },

    // Step 3: 회로 설계 도전 - 목표 전류 맞추기
    {
      id: 'step-ohms-s3-design-challenge',
      title: '3단계: 목표 전류 0.4A를 달성하는 저항 설계',
      stepType: 'CHECK',
      storyLead: '이제 실전 회로 설계자로서 직접 부품 값을 결정해봅시다!',
      prompt: '배터리 전압이 12V로 고정되어 있습니다. 회로에 정확히 0.4A (400mA)의 정격 전류를 흘리기 위한 최적의 저항값 R을 옴의 법칙(R = V / I)으로 계산하여 설정하세요.',
      detailExplanation: '계산식: R = V / I = 12V / 0.4A = 30Ω 입니다. \n실제 회로 설계에서도 정격 전류를 초과하면 부품이 타버리고, 부족하면 정상 동작하지 않기 때문에 옴의 법칙을 이용한 정밀한 저항 선정이 필수적입니다.',
      whyExplanation: '회로에 직렬로 연결된 저항은 전류 제한 저항(Current Limiting Resistor) 역할을 합니다. 12V 배터리에서 0.4A가 흐르면 저항에서 소비되는 열전력은 P = 0.4A × 12V = 4.8W이므로, 5W 이상의 권선 저항이나 시멘트 저항을 채택해야 안전합니다.',
      simulatorType: 'ohmsLaw',
      initialParams: {
        voltage: 12.0,
        resistance: 60.0,
        switchClosed: true,
      },
      controls: [
        {
          id: 'resistance',
          label: '저항값 선택 (R)',
          unit: 'Ω',
          type: 'slider',
          min: 10.0,
          max: 80.0,
          step: 2.0,
        },
      ],
      rules: [
        {
          targetKey: 'resistance',
          operator: 'near',
          expected: 30.0,
          tolerance: 1.0,
          feedbackIfFail: '목표 전류 0.4A에 도달하지 못했습니다. R = V / I 공식을 이용해 12V / 0.4A의 값을 계산해보세요.',
          voiceIfFail: '전류가 0.4암페어가 되도록 저항을 30옴으로 맞춰보세요.',
        },
      ],
      successMessage: '정답입니다! R = 30Ω 일 때 12V / 30Ω = 0.4A 정격 전류가 정확히 회로에 흐릅니다. 훌륭한 회로 설계입니다!',
      successVoice: '정답입니다! 30옴 저항으로 목표 전류 0.4암페어를 정확히 달성했습니다.',
      voice: {
        intro: '배터리 12볼트에서 전류를 정확히 0.4암페어로 맞추기 위한 저항값을 찾아보세요.',
        milestone: {
          triggerParam: 'resistance',
          threshold: 30.0,
          direction: 'below',
          speech: '저항 30옴에 도달했습니다! 전류계가 0.4암페어를 가리킵니다.',
        },
        explanation: '알은 브이 나누기 아이 공식을 통해 30옴의 정격 저항값을 정확히 설계해냈습니다.',
      },
      hints: [
        {
          level: 1,
          title: '옴의 법칙 변형',
          description: 'I = V / R 식의 양변을 정리하면 R = V / I 가 됩니다.',
        },
        {
          level: 2,
          title: '숫자 대입',
          description: '전압 V = 12, 전류 I = 0.4를 대입하면 12 ÷ 0.4 = ?',
        },
        {
          level: 3,
          title: '정답 저항값',
          description: '슬라이더를 30Ω에 맞추고 확인하기를 누르세요.',
        },
      ],
    },
  ],
};
