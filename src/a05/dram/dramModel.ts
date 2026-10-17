/** A06 D02 1T1C storyboard — normalized educational models, NOT JEDEC timings. */
export type Bit = 0 | 1;
export type DramSceneId = 'dram-write' | 'dram-sense-restore' | 'dram-leak-refresh' | 'dram-row-bank';
export const dramSceneOrder: readonly DramSceneId[] = [
  'dram-write','dram-sense-restore','dram-leak-refresh','dram-row-bank',
];
export type DramPhase = 'precharge' | 'shared' | 'sensed' | 'restored';
export interface DramEvent {
  sceneId: DramSceneId;
  type: 'prediction.recorded' | 'parameter.changed' | 'action.triggered' | 'answer.checked' | 'hint.opened' | 'voice.requested' | 'scene.enter';
  payload?: Record<string, string | number | boolean>;
}
export interface DramFeedback {
  passed: boolean;
  conditions: { label: string; passed: boolean; explanation: string }[];
}
/** At WL=0, BL changes must not silently overwrite the stored capacitor. */
export function writeCell(cell: Bit, bitline: Bit, wordline: Bit): Bit {
  return wordline === 1 ? bitline : cell;
}
/** Initial normalized voltages: VDD=1, Vpre=0.5. Ccell/Cbitline=1/9 (toy). */
export const C_CELL = 1, C_BITLINE = 9, PRECHARGE = 0.5;
export function shareCharge(cellBit: Bit, cCell = C_CELL, cBitline = C_BITLINE) {
  if (cCell <= 0 || cBitline <= 0) throw Error('capacitances must be positive');
  const sharedVoltage = (cCell * cellBit + cBitline * PRECHARGE) / (cCell + cBitline);
  return {
    initialCell: cellBit,
    delta: sharedVoltage - PRECHARGE,
    sharedVoltage,
    disturbedCellVoltage: sharedVoltage,
    senseOutput: (sharedVoltage > PRECHARGE ? 1 : 0) as Bit,
  };
}
export function senseRead(cellBit: Bit, phase: DramPhase) {
  const q = shareCharge(cellBit);
  switch (phase) {
    case 'precharge': return { cellVoltage: cellBit, bitlineVoltage: PRECHARGE, senseEnabled: false, restored: false };
    case 'shared': return { cellVoltage: q.sharedVoltage, bitlineVoltage: q.sharedVoltage, senseEnabled: false, restored: false };
    case 'sensed': return { cellVoltage: q.sharedVoltage, bitlineVoltage: q.senseOutput, senseEnabled: true, restored: false };
    case 'restored': return { cellVoltage: q.senseOutput, bitlineVoltage: q.senseOutput, senseEnabled: true, restored: true };
  }
}
/** Normalized abstract time (no milliseconds), linear leakage to show shrinking margin. */
export function leakageVoltage(time: number, lastRefresh: number | null, leakRate = 0.2): number {
  const elapsed = Math.max(0, time - (lastRefresh ?? 0));
  return Math.max(0, Math.min(1, 1 - leakRate * elapsed));
}
export type BankLane = { request: 'A' | 'B'; bank: number; start: number; finish: number };
/** Internal-bank overlap only; external shared bus and DRAM timings intentionally excluded. */
export function bankSchedule(bankCount: 1 | 2): BankLane[] {
  return bankCount === 1
    ? [{ request: 'A', bank: 1, start: 0, finish: 2 }, { request: 'B', bank: 1, start: 2, finish: 4 }]
    : [{ request: 'A', bank: 1, start: 0, finish: 2 }, { request: 'B', bank: 2, start: 0, finish: 2 }];
}
export function bankOverlap(bankCount: 1 | 2) {
  const [a, b] = bankSchedule(bankCount);
  return a.start < b.finish && b.start < a.finish && a.bank !== b.bank;
}
export function dramEvaluate(sceneId: DramSceneId, facts: readonly string[], answer: string | null): DramFeedback {
  const has = (event: string) => facts.includes(event);
  const conditions: DramFeedback['conditions'] = [];
  if (sceneId === 'dram-write') {
    conditions.push({ label: 'WL ON에서 비트 1 쓰기', passed: has('charged'), explanation: 'BL=1일 때 WL을 열어 셀을 충전해 보세요.' });
    conditions.push({ label: 'WL OFF 뒤 BL=0에도 셀 유지', passed: has('held'), explanation: 'WL을 닫고 BL만 0으로 내려 보세요.' });
  } else if (sceneId === 'dram-sense-restore') {
    conditions.push({ label: '사전충전→전하 공유', passed: has('shared'), explanation: 'VDD/2에서 WL을 열어 ±ΔV를 관찰해 보세요.' });
    conditions.push({ label: '증폭→복원', passed: has('sensed') && has('restored'), explanation: '센스앰프를 켜고 셀에 값을 다시 써 주세요.' });
  } else if (sceneId === 'dram-leak-refresh') {
    conditions.push({ label: '시간 경과로 전하 감소', passed: has('leaked'), explanation: '가상 시간 눈금을 1 이상으로 옮기세요.' });
    conditions.push({ label: '리프레시로 다시 충전', passed: has('refreshed'), explanation: '리프레시를 눌러 전하를 복원하세요.' });
  } else {
    conditions.push({ label: '같은 뱅크의 순차 실행 관찰', passed: has('serial'), explanation: '뱅크 하나에서 요청 A/B의 타임라인을 보세요.' });
    conditions.push({ label: '서로 다른 뱅크의 내부 처리 겹침 관찰', passed: has('parallel'), explanation: '뱅크 둘로 바꿔 비교하세요.' });
  }
  const answerIds: Record<DramSceneId, string> = {
    'dram-write': 'isolated',
    'dram-sense-restore': 'restore',
    'dram-leak-refresh': 'leak',
    'dram-row-bank': 'conditional',
  };
  conditions.push({ label: '관찰 원리 설명', passed: answer === answerIds[sceneId],
    explanation: '관찰한 원리를 다시 골라 보세요. 단순히 버튼을 눌렀다는 이유로 통과하지 않아요.' });
  return { passed: conditions.every(c => c.passed), conditions };
}
