import { calculateMosfetState } from '../simulations/mosfet/mosfetModel';
import { calculateInverterState } from '../simulations/mosfet/inverterModel';

/** A05 standalone visual contract; A02 Lesson Engine remains authoritative for app progression. */
export type A05SceneId = 'mosfet-field' | 'mosfet-current' | 'nmos-resistor-inverter' | 'cmos-not-gate';
export type LogicBit = 0 | 1;
export type A05Values = { vgs: number; vds: number; vin: number; out0: LogicBit | null; out1: LogicBit | null };
export type A05EventType = 'scene.enter' | 'prediction.recorded' | 'parameter.changed' | 'answer.checked' | 'hint.opened' | 'voice.requested';
export type A05Event = { sceneId: A05SceneId; type: A05EventType; payload?: Record<string, string | number | boolean | null> };
export type A05Result = {
  passed: boolean;
  observationPassed: boolean;
  answerPassed: boolean;
  conditions: { label: string; passed: boolean; feedback: string }[];
};

export const a05SceneIds: readonly A05SceneId[] = [
  'mosfet-field', 'mosfet-current', 'nmos-resistor-inverter', 'cmos-not-gate',
];

export function initialSceneValues(sceneId: A05SceneId): A05Values {
  return { vgs: sceneId === 'mosfet-current' ? 1.5 : 0, vds: 0, vin: 0, out0: null, out1: null };
}

/** Toy long-channel square-law MOSFET. mA, V; subthreshold/leakage excluded. */
export function mosfetObservation(vgs: number, vds: number) {
  return calculateMosfetState({ vgs, vds, vth: 0.7, kn: 2 });
}

/** Same 10 kΩ / nonlinear Ron toy model as A02; Vin=5V gives Vout≈0.45V, NOT exactly 0. */
export function resistorInverterObservation(vin: number) {
  return calculateInverterState({ vin, vdd: 5, rd: 10, vth: 0.7 });
}

/** Separate complementary topology; ideal settled rail output. Not a claim of zero real leakage or switching power. */
export function cmosObservation(vin: LogicBit) {
  const pmosOn = vin === 0;
  const nmosOn = vin === 1;
  return {
    input: vin, pmosOn, nmosOn,
    output: (vin === 0 ? 1 : 0) as LogicBit,
    vout: vin === 0 ? 5 : 0,
    settledDirectPath: false,
  };
}

/** Deterministic feedback contract: exploration alone never passes a scene. */
export function evaluateA05Scene(
  sceneId: A05SceneId,
  visited: readonly number[],
  answer: string | null,
  values: A05Values,
): A05Result {
  const lowSeen = visited.some(v => v === 0);
  const highSeen = visited.some(v => v >= (sceneId === 'mosfet-field' ? 0.8 : sceneId === 'mosfet-current' ? 1 : 5));
  const observationPassed = lowSeen && highSeen;
  const answerPassed = sceneId === 'cmos-not-gate'
    ? values.out0 === 1 && values.out1 === 0
    : answer === ({
      'mosfet-field': 'surface',
      'mosfet-current': 'voltage-needed',
      'nmos-resistor-inverter': 'pulldown',
      'cmos-not-gate': '',
    } as Record<A05SceneId, string>)[sceneId];
  const conditions = [
    {
      label: '낮은 전압과 높은 전압을 모두 관찰',
      passed: observationPassed,
      feedback: observationPassed ? '두 조건을 비교했어요.' : '전압을 직접 바꾸어 낮은 상태와 높은 상태를 비교해 보세요.',
    },
  ];
  if (sceneId === 'cmos-not-gate') {
    conditions.push({
      label: '입력 0 → 출력 1',
      passed: values.out0 === 1,
      feedback: values.out0 === 1 ? '위쪽 pMOS의 역할을 확인했어요.' : '입력 0에서 위쪽 pMOS가 켜지는지 살펴보세요.',
    });
    conditions.push({
      label: '입력 1 → 출력 0',
      passed: values.out1 === 0,
      feedback: values.out1 === 0 ? '아래쪽 nMOS의 역할을 확인했어요.' : '입력 1에서 아래쪽 nMOS가 켜지는지 살펴보세요.',
    });
  } else {
    const messages: Record<Exclude<A05SceneId, 'cmos-not-gate'>, string> = {
      'mosfet-field': '전자는 산화막을 건너지 않고 바로 아래 실리콘 표면에 모여요.',
      'mosfet-current': '채널만으로는 부족해요. VDS가 있어야 순 전류가 생기며 포화에서도 전류는 유지돼요.',
      'nmos-resistor-inverter': 'nMOS가 켜지면 출력 노드를 저항보다 낮은 경로로 접지 근처에 끌어내려요.',
    };
    conditions.push({
      label: '관찰한 원리를 올바르게 설명',
      passed: answerPassed,
      feedback: answerPassed ? '조작과 원리의 연결이 맞아요.' : messages[sceneId],
    });
  }
  return { passed: observationPassed && answerPassed, observationPassed, answerPassed, conditions };
}
