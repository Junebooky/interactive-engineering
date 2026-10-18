import type { Step } from '../types';

export type VisualMode = 'interactive' | 'concept';

export interface VisualSpec {
  mode: VisualMode;
  visualId: string;
  title: string;
  subtitle: string;
  caption: string;
  spoilerSafe: boolean;
  simulatorType?: string;
  sceneId?: string;
}

/**
 * A03 V3 Visual Coverage Contract Registry
 * Guarantees that EVERY published lesson step resolves to a meaningful,
 * pedagogically verified visual representation (no blank lab scenes).
 */
export function resolveStepVisual(lessonId: string, step: Step): VisualSpec {
  // If the step specifies an interactive simulatorType, resolve to interactive mode
  if (step.simulatorType) {
    return {
      mode: 'interactive',
      visualId: step.simulatorType,
      title: step.title,
      subtitle: step.storyLead || '',
      caption: '대화형 2.5D 시뮬레이션 실험실',
      spoilerSafe: false,
      simulatorType: step.simulatorType,
      sceneId: step.simulatorType,
    };
  }

  // Domain-specific Concept Visual mapping based on lessonId and stepId
  if (lessonId.includes('electricity') || step.id.includes('elec')) {
    return {
      mode: 'concept',
      visualId: 'circuit-intro',
      title: '직류 회로와 전위차 기본 구조',
      subtitle: '배터리 전압(V)과 닫힌 도선 경로, 스위치와 저항의 관계',
      caption: '직류 회로 기본 개념 도식 · 닫힌 경로에서만 전류가 순환합니다',
      spoilerSafe: true,
    };
  }

  if (lessonId.includes('pn-junction') || step.id.includes('pn')) {
    return {
      mode: 'concept',
      visualId: 'pn-intro',
      title: '반도체 밴드갭과 PN 접합 기본 구조',
      subtitle: '전도대(Ec)와 가전자대(Ev), 도핑된 실리콘의 에너지 장벽',
      caption: '에너지 밴드갭 및 PN 접합 개념 도식 · 전하 캐리어의 확산과 표류',
      spoilerSafe: true,
    };
  }

  if (lessonId.includes('mos-capacitor') || step.id.includes('mos14')) {
    return {
      mode: 'concept',
      visualId: 'mos-cap-intro',
      title: 'MOS 커패시터 층상 구조',
      subtitle: '금속 게이트, 얇은 산화막(SiO₂), P형 실리콘 기판의 전계 형성',
      caption: 'MOS 커패시터 구조 도식 · 절연 산화막을 사이에 둔 전하 축적',
      spoilerSafe: true,
    };
  }

  if (lessonId.includes('mosfet') || step.id.includes('mosfet')) {
    return {
      mode: 'concept',
      visualId: 'mosfet-intro',
      title: 'MOSFET 단면 구조와 채널 형성 원리',
      subtitle: '게이트 전계가 P형 실리콘 표면에 N형 전도 채널을 여는 원리',
      caption: 'nMOSFET 기본 단면 도식 · 게이트 전압이 문턱 전압(Vth)을 넘을 때 도통',
      spoilerSafe: true,
    };
  }

  if (lessonId.includes('dram') || step.id.includes('dram')) {
    return {
      mode: 'concept',
      visualId: 'dram-intro',
      title: '1T1C DRAM 메모리 셀 기본 구조',
      subtitle: '액세스 트랜지스터(1T)와 전하 저장 커패시터(1C)로 비트 기억',
      caption: '1T1C DRAM 셀 도식 · 커패시터의 미세 전하로 0과 1을 판별',
      spoilerSafe: true,
    };
  }

  if (lessonId.includes('sram') || step.id.includes('sram')) {
    return {
      mode: 'concept',
      visualId: 'sram-intro',
      title: '6T SRAM 상호 결합 래치 기본 구조',
      subtitle: '두 인버터의 교차 피드백으로 전원이 유지되는 한 영구 래칭',
      caption: '6T SRAM 래치 도식 · 빠른 속도와 무재충전(No Refresh) 캐시 메모리',
      spoilerSafe: true,
    };
  }

  if (lessonId.includes('nand') || step.id.includes('nand')) {
    return {
      mode: 'concept',
      visualId: 'nand-intro',
      title: '3D NAND 플래시 메모리 스트링 구조',
      subtitle: '전하 트랩층(CTN)에 전자를 가두어 전원 차단 후에도 비트 보존',
      caption: '3D NAND 수직 셀 스트링 도식 · 비휘발성 대용량 eSSD 스토리지',
      spoilerSafe: true,
    };
  }

  if (lessonId.includes('gpu') || step.id.includes('gpu')) {
    return {
      mode: 'concept',
      visualId: 'gpu-intro',
      title: 'GPU 대규모 병렬 파이프라인과 HBM 구조',
      subtitle: '수천 개 SIMT 연산 코어와 실리콘 인터포저 기반 고대역폭 메모리',
      caption: 'GPU 코어 어레이와 HBM 메모리 버스 도식 · 대규모 데이터 병렬 처리',
      spoilerSafe: true,
    };
  }

  if (lessonId.includes('gears') || step.id.includes('gears')) {
    return {
      mode: 'concept',
      visualId: 'gears-intro',
      title: '기어 맞물림과 토크 전달 원리',
      subtitle: '외접 치차의 반대 방향 회전과 잇수비에 따른 각속도·토크 변환',
      caption: '기어 동력 전달 개념 도식 · 피치점의 작용 반작용력과 속도 전달',
      spoilerSafe: true,
    };
  }

  // Fallback to Ohm's Law / general circuit schematic
  return {
    mode: 'concept',
    visualId: 'circuit-intro',
    title: step.title,
    subtitle: step.storyLead || '공학 물리 구조 도식',
    caption: '개념 도입 도식 · 사전 가설 수립용',
    spoilerSafe: true,
  };
}
