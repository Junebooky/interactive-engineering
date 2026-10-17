import { describe, it, expect } from 'vitest';
import { nandLesson } from '../content/semiconductor/nandLesson';
import { courses } from '../content/courses';
import { applyNand04ActionAdapter, toNand04State } from '../engine/adapters/nand04ActionAdapter';

describe('A02 Lesson 04 NAND·eSSD·NVMe Official App Integration', () => {
  it('defines the complete 7-step lesson curriculum structure', () => {
    expect(nandLesson.id).toBe('nand-essd-storage-pipeline');
    expect(nandLesson.steps).toHaveLength(7);

    const stepIds = nandLesson.steps.map((s) => s.id);
    expect(stepIds).toEqual([
      'step-nand04-s0-intro',
      'step-nand04-s1-threshold',
      'step-nand04-s2-page-block',
      'step-nand04-s3-ftl-reliability',
      'step-nand04-s4-nvme-transfer',
      'step-nand04-s5-ai-datacenter',
      'step-nand04-s6-synthesis',
    ]);

    // Check step types
    expect(nandLesson.steps[0].stepType).toBe('CONCEPT');
    expect(nandLesson.steps[1].stepType).toBe('MANIPULATE');
    expect(nandLesson.steps[2].stepType).toBe('MANIPULATE');
    expect(nandLesson.steps[3].stepType).toBe('MANIPULATE');
    expect(nandLesson.steps[4].stepType).toBe('MANIPULATE');
    expect(nandLesson.steps[5].stepType).toBe('MANIPULATE');
    expect(nandLesson.steps[6].stepType).toBe('CONCEPT');
  });

  it('embeds nandLesson into course-semiconductor curriculum path', () => {
    const course = courses.find((c) => c.id === 'course-semiconductor');
    expect(course).toBeDefined();
    const lesson = course?.lessons.find((l) => l.id === 'nand-essd-storage-pipeline');
    expect(lesson).toBeDefined();
    expect(lesson?.title).toContain('NAND·eSSD에서 AI 데이터센터까지');
  });

  it('verifies Step 1 N04-S01 threshold action adapter and physics', () => {
    const stepId = 'step-nand04-s1-threshold';
    let params: Record<string, any> = { cell: 'low', readV: 1, power: 'on', history: [] };

    // Initial state: Vt = 0.5V, ReadV = 1V, Power = ON -> reading is ON
    params = applyNand04ActionAdapter(stepId, params, 'cell', 'low');
    expect(params.history).toContain('low');
    expect(params.threshold.reading).toBe('on');

    // Change to high cell: Vt = 1.5V, ReadV = 1V, Power = ON -> reading is OFF
    params = applyNand04ActionAdapter(stepId, params, 'cell', 'high');
    expect(params.history).toContain('high');
    expect(params.threshold.reading).toBe('off');

    // Power OFF -> reading is not-readable
    params = applyNand04ActionAdapter(stepId, params, 'power', 'off');
    expect(params.history).toContain('power-cycle');
    expect(params.threshold.reading).toBe('not-readable');
    expect(params.threshold.retainedCell).toBe('high');
  });

  it('verifies Step 2 N04-S02 page-block action adapter and GC', () => {
    const stepId = 'step-nand04-s2-page-block';
    let params: Record<string, any> = { pageStage: 'initial', history: [] };

    params = applyNand04ActionAdapter(stepId, params, 'pageStage', 'initial');
    expect(params.history).toContain('initial');
    expect(params.pageInfo.mapping.LBA7).toBe('B0:P0 / A');
    expect(params.pageInfo.erasedBlock0).toBe(false);

    params = applyNand04ActionAdapter(stepId, params, 'pageStage', 'updated');
    expect(params.history).toContain('updated');
    expect(params.pageInfo.mapping.LBA7).toBe('B1:P0 / B');
    expect(params.pageInfo.pages[0].status).toBe('invalid');
    expect(params.pageInfo.pages[4].status).toBe('valid');

    params = applyNand04ActionAdapter(stepId, params, 'pageStage', 'collected');
    expect(params.history).toContain('collected');
    expect(params.pageInfo.erasedBlock0).toBe(true);
    expect(params.pageInfo.pages[0].status).toBe('empty');
  });

  it('verifies Step 3 N04-S03 FTL reliability action adapter', () => {
    const stepId = 'step-nand04-s3-ftl-reliability';
    let params: Record<string, any> = { writePattern: 'cold', ecc: false, plp: false, dramCache: false, history: [] };

    params = applyNand04ActionAdapter(stepId, params, 'writePattern', 'hot');
    expect(params.history).toContain('hot');

    params = applyNand04ActionAdapter(stepId, params, 'writePattern', 'cold');
    expect(params.history).toContain('cold');

    params = applyNand04ActionAdapter(stepId, params, 'ecc', true);
    expect(params.history).toContain('ecc-option');

    params = applyNand04ActionAdapter(stepId, params, 'plp', true);
    expect(params.history).toContain('plp-option');

    expect(params.ssdInfo.absoluteReliabilityGuaranteed).toBe(false);
  });

  it('verifies Step 4 N04-S04 NVMe transfer action adapter', () => {
    const stepId = 'step-nand04-s4-nvme-transfer';
    let params: Record<string, any> = { transport: 'command', history: [] };

    params = applyNand04ActionAdapter(stepId, params, 'transport', 'command');
    expect(params.history).toContain('command');
    expect(params.transportInfo.kind).toBe('command');

    params = applyNand04ActionAdapter(stepId, params, 'transport', 'read-data');
    expect(params.history).toContain('read-data');
    expect(params.transportInfo.kind).toBe('data');
    expect(params.transportInfo.to).toBe('host DDR');

    params = applyNand04ActionAdapter(stepId, params, 'transport', 'to-gpu');
    expect(params.history).toContain('to-gpu');
    expect(params.transportInfo.kind).toBe('separate');
  });

  it('verifies Step 5 N04-S05 AI datacenter pipeline action adapter', () => {
    const stepId = 'step-nand04-s5-ai-datacenter';
    let params: Record<string, any> = { ai: 'cold-load', servers: 1, history: [] };

    params = applyNand04ActionAdapter(stepId, params, 'ai', 'cold-load');
    expect(params.history).toContain('cold-load');
    expect(params.aiInfo.source).toBe('SSD persistent model');

    params = applyNand04ActionAdapter(stepId, params, 'ai', 'resident-infer');
    expect(params.history).toContain('resident-infer');
    expect(params.aiInfo.source).toBe('already resident GPU model');

    params = applyNand04ActionAdapter(stepId, params, 'ai', 'checkpoint');
    expect(params.history).toContain('checkpoint');

    params = applyNand04ActionAdapter(stepId, params, 'servers', 2);
    expect(params.history).toContain('two-servers');
    expect(params.aiInfo.network).toContain('inter-node network');
  });

  it('verifies toNand04State converter constructs valid render state', () => {
    const state = toNand04State('step-nand04-s1-threshold', {
      cell: 'high',
      readV: 2,
      power: 'off',
      pageStage: 'updated',
      writePattern: 'hot',
      ecc: true,
      plp: true,
      dramCache: true,
      transport: 'read-data',
      ai: 'resident-infer',
      servers: 2,
    });

    expect(state.cell).toBe('high');
    expect(state.readV).toBe(2);
    expect(state.power).toBe('off');
    expect(state.pageStage).toBe('updated');
    expect(state.writePattern).toBe('hot');
    expect(state.ecc).toBe(true);
    expect(state.plp).toBe(true);
    expect(state.dramCache).toBe(true);
    expect(state.transport).toBe('read-data');
    expect(state.ai).toBe('resident-infer');
    expect(state.servers).toBe(2);
  });
});
