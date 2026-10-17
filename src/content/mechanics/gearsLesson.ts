import type { Lesson } from '../../types';

export const gearsLesson: Lesson = {
  id: 'mechanics-gears-transmission',
  courseId: 'course-mechanics',
  slug: 'gears-ratio-and-torque',
  title: '기어 시스템과 동력 전달 (기어비와 토크)',
  subtitle: '맞물림 회전 방향 반전부터 감속비 및 토크 증폭 설계',
  description: '외접 기어 맞물림의 회전 방향 반전 원리를 손으로 직접 돌려 확인하고, 잇수 비율에 따른 각속도와 토크의 역비례 물리 법칙을 체득하는 기계공학 핵심 실습입니다.',
  category: 'mechanics',
  steps: [
    // Step 1: 회전 방향 반전
    {
      id: 'step-gears-s1-direction-reversal',
      title: '1단계: 맞물린 기어의 회전 방향',
      stepType: 'MANIPULATE',
      storyLead: '두 톱니바퀴가 외접하여 맞물려 돌아갈 때, 회전 방향은 어떻게 될까요?',
      prompt: '왼쪽 구동 기어(Gear 1)를 마우스 드래그나 터치로 시계 방향으로 돌려보세요. 맞물린 오른쪽 종동 기어(Gear 2)가 어떤 방향으로 회전하는지 관찰하며 한 바퀴 이상(360° 이상) 회전시키세요.',
      detailExplanation: '두 기어가 외접(External Mesh)할 때, 접촉점(Pitch Point)에서 치차 표면이 서로를 밀어내는 작용-반작용 힘에 의해 두 축의 회전 방향은 반드시 반대로 반전(Clockwise ↔ Counter-Clockwise)됩니다. 만약 동일한 방향으로 회전시키려면 중간에 아이들러 기어(Idler Gear)를 하나 추가해야 합니다.',
      whyExplanation: '접촉면에서의 선속도 벡터 v_t는 두 기어의 피치점에서 크기와 방향이 완전히 동일합니다(v_1 = v_2 = r_1 * ω_1 = r_2 * ω_2). 한 기어가 접선 방향으로 아래쪽을 향하면, 상대 기어 역시 접선 방향으로 아래쪽을 향해야 하므로 중심축 기준 각속도의 부호(방향)가 반대가 됩니다.',
      simulatorType: 'gears',
      initialParams: {
        n1: 12,
        n2: 12,
        angle1: 0,
      },
      controls: [
        {
          id: 'angle1',
          label: '구동 기어 회전각 (Gear 1)',
          unit: '°',
          type: 'slider',
          min: 0,
          max: 720,
          step: 15,
        },
      ],
      rules: [
        {
          label: '구동 기어 회전각',
          targetKey: 'angle1',
          operator: 'gte',
          expected: 360,
          feedbackIfFail: '기어를 충분히 회전시키지 않았습니다. 구동 기어를 시계 방향으로 360°(한 바퀴) 이상 돌려보세요.',
          voiceIfFail: '구동 기어를 한 바퀴 이상 시계 방향으로 돌려보세요.',
        },
      ],
      successMessage: '정답입니다! 구동 기어가 시계 방향으로 돌 때, 맞물린 종동 기어는 정확히 반시계 방향으로 반전되어 회전합니다.',
      successVoice: '정답입니다! 외접 맞물림에 의해 회전 방향이 반대로 반전됩니다.',
      voice: {
        intro: '기어 원리를 알아봅시다. 왼쪽 구동 기어를 시계 방향으로 한 바퀴 이상 돌려보세요.',
        milestone: {
          triggerParam: 'angle1',
          threshold: 360,
          direction: 'above',
          speech: '한 바퀴 이상 회전했습니다! 오른쪽 기어가 반대 방향으로 회전함을 확인하셨습니다.',
        },
        explanation: '외접 기어 맞물림에서는 접촉점에서 힘이 전달되어 회전 방향이 항상 반전됩니다.',
      },
      hints: [
        {
          level: 1,
          title: '기어 조작법',
          description: '캔버스 속 파란색 구동 기어를 마우스나 손가락으로 잡고 돌리거나, 아래 슬라이더를 오른쪽으로 미세요.',
        },
        {
          level: 2,
          title: '회전 각도 확인',
          description: '상단 HUD의 Gear 1 각도가 360° 이상이 될 때까지 돌리세요.',
        },
        {
          level: 3,
          title: '제출',
          description: '360° 이상 회전시킨 후 확인하기를 누르세요.',
        },
      ],
    },

    // Step 2: 감속비와 잇수 (2:1 감속)
    {
      id: 'step-gears-s2-speed-reduction',
      title: '2단계: 속도를 절반으로 줄이려면?',
      stepType: 'MANIPULATE',
      storyLead: '구동 기어의 잇수가 12개일 때, 종동 기어의 속도를 절반(2:1 감속)으로 늦추려면 종동 기어 잇수를 얼마로 해야 할까요?',
      prompt: '종동 기어 잇수(N_2)를 선택하여 기어비를 2.0 (2:1 감속)으로 맞추세요. 구동 기어가 2바퀴 돌 때 종동 기어는 정확히 1바퀴만 도는 것을 확인하세요.',
      detailExplanation: '두 기어의 잇수를 N_1, N_2라 할 때 각속도 비는 ω_2 / ω_1 = N_1 / N_2 입니다. 따라서 구동 기어가 12개(N_1=12)일 때 종동 기어 속도를 절반(1/2)으로 줄이려면 잇수가 2배 많은 24개(N_2=24)를 선택해야 합니다. 잇수가 많아지면 피치원 둘레도 2배 커져 회전하는 데 2배의 시간이 걸립니다.',
      whyExplanation: '치차가 하나 맞물릴 때마다 서로의 이빨이 1개씩 전진합니다. 구동 기어가 1회전하면 12개의 이빨이 지나가며, 24개짜리 종동 기어는 자기 전체 이빨의 절반만 지나가므로 정확히 반 바퀴(180°)만 회전합니다.',
      simulatorType: 'gears',
      initialParams: {
        n1: 12,
        n2: 12,
        angle1: 90,
      },
      controls: [
        {
          id: 'n2',
          label: '종동 기어 잇수 (N_2)',
          type: 'gearSelector',
          options: [
            { label: '12T (1:1 동일)', value: 12 },
            { label: '18T (1.5:1)', value: 18 },
            { label: '24T (2:1 감속)', value: 24 },
            { label: '36T (3:1 감속)', value: 36 },
          ],
        },
      ],
      rules: [
        {
          label: '감속비 종동 기어 잇수 (N_2)',
          targetKey: 'n2',
          operator: 'eq',
          expected: 24,
          feedbackIfFail: '속도가 정확히 절반이 되지 않았습니다. 잇수 비율 N_2 / N_1 = 24 / 12 = 2.0이 되도록 24T를 선택하세요.',
          voiceIfFail: '종동 기어 잇수를 24개로 선택해보세요.',
        },
      ],
      successMessage: '정답입니다! N_2 = 24T일 때 기어비가 2:1이 되어, 구동 기어 속도의 정확히 1/2로 감속됩니다.',
      successVoice: '정답입니다! 24개 잇수를 선택하여 정확히 2대 1 감속을 완성했습니다.',
      voice: {
        intro: '구동 기어가 12개일 때, 속도를 절반으로 줄이기 위한 종동 기어 잇수를 선택해보세요.',
        milestone: {
          triggerParam: 'n2',
          threshold: 24,
          direction: 'above',
          speech: '종동 기어를 24개로 변경했습니다! 2대 1 감속비가 적용되었습니다.',
        },
        explanation: '잇수가 두 배 많아지면 회전 속도는 정확히 절반으로 줄어듭니다.',
      },
      hints: [
        {
          level: 1,
          title: '속도와 잇수의 역비례',
          description: '톱니바퀴가 커져서 잇수가 많아질수록 한 바퀴 도는 데 더 오랜 시간이 걸려 느려집니다.',
        },
        {
          level: 2,
          title: '수학적 계산',
          description: 'N_2 = N_1 × 2 = 12 × 2 = 24',
        },
        {
          level: 3,
          title: '선택 버튼',
          description: '캔버스 아래의 [24T] 버튼을 클릭한 뒤 확인하기를 누르세요.',
        },
      ],
    },

    // Step 3: 토크 3배 증폭 설계 도전
    {
      id: 'step-gears-s3-torque-amplification',
      title: '3단계: 무거운 짐을 들기 위한 3배 토크 증폭',
      stepType: 'CHECK',
      storyLead: '에너지 보존 법칙에 따르면 회전 속도가 느려진 대가로 무엇을 얻을 수 있을까요? 바로 회전력(토크)의 증폭입니다!',
      prompt: '모터의 기본 입력 토크는 5.0 N·m입니다. 무거운 하중을 들어 올리기 위해 출력 토크를 3배(15.0 N·m)로 증폭시키는 종동 기어(N_2)를 조합하세요.',
      detailExplanation: '마찰 손실을 무시할 때 동력 P = T × ω 는 일정합니다. 따라서 기어 감속을 통해 각속도가 1/3로 줄어들면, 출력 토크는 반대로 3배(T_2 = T_1 × (N_2 / N_1) = 5.0 × 3 = 15.0 N·m)로 증폭됩니다! 자동차의 1단 변속기나 크레인이 무거운 차체를 움직일 때 거대한 기어로 감속하여 토크를 얻는 원리입니다.',
      whyExplanation: '피치원 반경 r이 3배 커지면, 접촉점에서 작용하는 동일한 접선력 F에 대해 회전 중심축까지의 모멘트 암(r)이 3배 늘어나므로 토크 T = F × r 또한 정확히 3배가 됩니다.',
      simulatorType: 'gears',
      initialParams: {
        n1: 12,
        n2: 12,
        angle1: 0,
      },
      controls: [
        {
          id: 'n2',
          label: '종동 기어 잇수 (N_2)',
          type: 'gearSelector',
          options: [
            { label: '12T (1배 토크)', value: 12 },
            { label: '18T (1.5배 토크)', value: 18 },
            { label: '24T (2배 토크)', value: 24 },
            { label: '36T (3배 토크 증폭)', value: 36 },
          ],
        },
      ],
      rules: [
        {
          label: '토크 증폭 종동 기어 잇수 (N_2)',
          targetKey: 'n2',
          operator: 'eq',
          expected: 36,
          feedbackIfFail: '토크가 3배로 증폭되지 않았습니다. N_2 / N_1 = 36 / 12 = 3.0이 되도록 36T 기어를 선택하세요.',
          voiceIfFail: '토크를 3배로 증폭하려면 36개 잇수를 선택해야 합니다.',
        },
      ],
      successMessage: '대성공! 36T 기어를 선택하여 기어비 3.0, 출력 토크 15.0 N·m를 정확히 달성했습니다. 기계공학의 토크 증폭 원리를 완벽히 마스터하셨습니다!',
      successVoice: '대성공! 기어비 3대 1로 토크를 3배 증폭하는 데 성공했습니다.',
      voice: {
        intro: '토크를 3배로 증폭시키기 위한 기어 조합을 설계해보세요.',
        milestone: {
          triggerParam: 'n2',
          threshold: 36,
          direction: 'above',
          speech: '36개 잇수를 선택했습니다! 출력 토크가 15 뉴턴미터로 3배 증폭되었습니다.',
        },
        explanation: '속도를 3분의 1로 희생한 대신 토크를 3배 얻었습니다. 이것이 기계공학의 핵심 기어비 법칙입니다.',
      },
      hints: [
        {
          level: 1,
          title: '토크 증폭 공식',
          description: '출력 토크 = 입력 토크 × (N_2 / N_1) 입니다.',
        },
        {
          level: 2,
          title: '필요 잇수',
          description: '12T 구동 기어의 3배는 12 × 3 = 36개입니다.',
        },
        {
          level: 3,
          title: '선택 및 확인',
          description: '[36T] 버튼을 클릭한 후 확인하기를 누르세요.',
        },
      ],
    },
  ],
};
