import type {Step} from '../types';
import {getA05ConceptVisualId} from '../a05/concepts/a05ConceptContract';
import {A05_CONCEPT_META} from '../a05/concepts/A05ConceptStructureVisual';

export type VisualMode='interactive'|'concept';
export interface VisualSpec {
 mode:VisualMode;
 visualId:string;
 title:string;
 subtitle:string;
 caption:string;
 spoilerSafe:boolean;
 simulatorType?:string;
 sceneId?:string;
}
/**
 * Audited, explicit concept visual mapping for published lessons.
 * B3: Zero arbitrary fallbacks; each published step is explicitly science-audited
 * and verified to be spoiler-safe before prediction.
 */
export const EXPLICIT_CONCEPT_REGISTRY: Record<string, Omit<VisualSpec, 'mode'>> = {
  // 1. Electricity & RC foundations (Lesson 12)
  'electricity-rc-foundations:step-elec-s0-intro': {
    visualId: 'circuit-intro',
    title: '직류 회로와 전위차 기본 구조',
    subtitle: '배터리 전압(V)과 닫힌 도선 경로, 스위치와 저항의 관계',
    caption: '직류 회로 기본 개념 도식 · 전원 전위차와 도선 연결 구조',
    spoilerSafe: true,
  },
  // 2. PN Junction & Doping (Lesson 11)
  'pn-doping-foundations:step-pn-s0-intro': {
    visualId: 'pn-intro',
    title: '반도체 밴드갭과 PN 접합 기본 구조',
    subtitle: '전도대(Ec)와 가전자대(Ev), 도핑된 실리콘의 에너지 장벽',
    caption: '에너지 밴드갭 및 PN 접합 개념 도식 · 전하 캐리어의 확산과 표류',
    spoilerSafe: true,
  },
  'pn-doping-foundations:step-pn-s6-review': {
    visualId: 'pn-intro',
    title: 'PN 접합 종합 정리: 밴드에서 MOS 트랜지스터로',
    subtitle: '확산과 표류의 평형, 공간전하영역(W)과 다이오드 정류 작용',
    caption: 'PN 접합 종합 개념 도식 · 에너지 밴드 다이어그램과 전계 형성',
    spoilerSafe: true,
  },
  // 3. MOS Capacitor (Lesson 14)
  'mos-capacitor-foundations:step-mos14-s0-intro': {
    visualId: 'mos-cap-intro',
    title: 'MOS 커패시터 층상 구조',
    subtitle: '금속 게이트, 얇은 산화막(SiO₂), P형 실리콘 기판의 전계 형성',
    caption: 'MOS 커패시터 구조 도식 · 절연 산화막을 사이에 둔 전하 축적',
    spoilerSafe: true,
  },
  'mos-capacitor-foundations:step-mos14-s5-synthesis': {
    visualId: 'mos-cap-intro',
    title: 'MOS 커패시터 종합 정리: 구조에서 3단자 소자로',
    subtitle: '축적·공핍·반전 3대 동작 영역과 고주파 C-V 특성 곡선',
    caption: 'MOS 커패시터 종합 개념 도식 · 산화막 절연과 정전학적 전계 제어',
    spoilerSafe: true,
  },
  // 4. MOSFET Fundamentals (Lesson 01)
  'semiconductor-mosfet-fundamentals:step-mosfet-s0-concept': {
    visualId: 'mosfet-intro',
    title: 'MOSFET 단면 구조와 채널 형성 원리',
    subtitle: '게이트 전계가 P형 실리콘 표면에 N형 전도 채널을 여는 원리',
    caption: 'nMOSFET 기본 단면 도식 · 게이트 전압 제어를 통한 채널 형성 탐구',
    spoilerSafe: true,
  },
  // 5. DRAM (Lesson 02)
  'lesson-dram:step-dram-s0-intro': {
    visualId: 'dram-intro',
    title: '1T1C DRAM 메모리 셀 기본 구조',
    subtitle: '액세스 트랜지스터(1T)와 전하 저장 커패시터(1C)로 비트 기억',
    caption: '1T1C DRAM 셀 도식 · 커패시터의 미세 전하로 0과 1을 판별',
    spoilerSafe: true,
  },
  // 6. SRAM (Lesson 03)
  'lesson-sram:step-sram-s0-intro': {
    visualId: 'sram-intro',
    title: '6T SRAM 상호 결합 래치 기본 구조',
    subtitle: '두 인버터의 교차 피드백으로 전원이 유지되는 한 영구 래칭',
    caption: '6T SRAM 래치 도식 · 빠른 속도와 무재충전(No Refresh) 캐시 메모리',
    spoilerSafe: true,
  },
  // 7. 3D NAND & eSSD (Lesson 04)
  'nand-essd-storage-pipeline:step-nand04-s0-intro': {
    visualId: 'nand-intro',
    title: '3D NAND 플래시 메모리 스트링 구조',
    subtitle: '전하 트랩층(CTN)에 전자를 가두어 전원 차단 후에도 비트 보존',
    caption: '3D NAND 수직 셀 스트링 도식 · 비휘발성 대용량 eSSD 스토리지',
    spoilerSafe: true,
  },
  'nand-essd-storage-pipeline:step-nand04-s6-synthesis': {
    visualId: 'nand-intro',
    title: '3D NAND 플래시 종합 정리: 미디어에서 AI 데이터센터까지',
    subtitle: '양자 터널링 전하 포획, FTL 주소 가상화, PCIe/NVMe 인터페이스',
    caption: '3D NAND 종합 개념 도식 · 비휘발성 저장 계층 아키텍처',
    spoilerSafe: true,
  },
  // 8. GPU & HBM (Lesson 05)
  'lesson-gpu:step-gpu-s0-intro': {
    visualId: 'gpu-intro',
    title: 'GPU 대규모 병렬 파이프라인과 HBM 구조',
    subtitle: '수천 개 SIMT 연산 코어와 실리콘 인터포저 기반 고대역폭 메모리',
    caption: 'GPU 코어 어레이와 HBM 메모리 버스 도식 · 대규모 데이터 병렬 처리',
    spoilerSafe: true,
  },
  // 9. Circuits Ohm's Law (Lesson 12 Circuits)
  'circuits-ohms-law:step-ohms-s0-concept': {
    visualId: 'circuit-intro',
    title: '직류 회로와 옴의 법칙 기본 개념',
    subtitle: '전압(V), 전류(I), 저항(R)의 상관관계',
    caption: '직류 회로 기본 개념 도식 · 전원 전위차와 도선 연결 구조',
    spoilerSafe: true,
  },
  // 10. Mechanics Gears (Lesson 13 Mechanics)
  'mechanics-gears-transmission:step-gears-s0-concept': {
    visualId: 'gears-intro',
    title: '기어 맞물림과 토크 전달 원리',
    subtitle: '외접 치차의 반대 방향 회전과 잇수비에 따른 각속도·토크 변환',
    caption: '기어 동력 전달 개념 도식 · 피치점의 작용 반작용력과 속도 전달',
    spoilerSafe: true,
  },
};

/**
 * A03 V3 Visual Coverage Contract Registry
 * Guarantees that EVERY published lesson step resolves to a meaningful,
 * pedagogically verified visual representation (no blank lab scenes).
 * Interactive steps KEEP their current A02 simulatorType.
 * Every concept step gets its exact lesson's A05 concept geometry.
 * Throws immediately on unregistered steps to prevent unverified fallback leaks.
 */
export function resolveStepVisual(lessonId: string, step: Step): VisualSpec {
  if (step.stepType !== 'CONCEPT' && step.simulatorType) {
    return {
      mode: 'interactive',
      visualId: step.simulatorType,
      title: step.title,
      subtitle: step.storyLead || '',
      caption: '실험 결과는 실제 조작 후 확인하세요',
      spoilerSafe: false,
      simulatorType: step.simulatorType,
      sceneId: step.simulatorType,
    };
  }

  // Pre-observation concept stage must never render a live interactive simulator.
  const conceptId = getA05ConceptVisualId(lessonId);
  if (conceptId) {
    const info = A05_CONCEPT_META[conceptId];
    return {
      mode: 'concept',
      visualId: conceptId,
      title: info.title,
      subtitle: info.detail,
      caption: info.limitation,
      spoilerSafe: true,
    };
  }

  // Explicit audited Concept Visual lookup fallback if any
  const registryKey = `${lessonId}:${step.id}`;
  const conceptEntry = EXPLICIT_CONCEPT_REGISTRY[registryKey];
  if (conceptEntry) {
    return {
      mode: 'concept',
      ...conceptEntry,
    };
  }

  // B3: Strictly disallow silent/arbitrary catch-all fallback in production
  throw new Error(
    `[visualRegistry] Unregistered visual mapping for lessonId: "${lessonId}", stepId: "${step.id}". Explicit mapping required.`
  );
}
