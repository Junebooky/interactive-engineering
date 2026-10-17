import {describe,it,expect} from 'vitest';
import {nand04SceneOrder,nand04Threshold,nand04Pages,nand04Ssd,nand04Transport,nand04Ai,nand04Fresh,gradeNand04} from '../a05/nand04/nand04Model';
describe('A05 N04 NAND→AI pure 5-scene model and condition-based learner assessment',()=>{
 it('five steps and correct initial toy state',()=>{expect(nand04SceneOrder).toHaveLength(5);expect(nand04Fresh().power).toBe('on');});
 it('retention persists low/high toy threshold through power cycle; reading OFF impossible',()=>{
  const off=nand04Threshold('high',1,'off');
  expect(off).toMatchObject({vt:1.5,reading:'not-readable',retainedCell:'high'});
  expect(nand04Threshold('high',1,'on').reading).toBe('off');
  expect(nand04Threshold('low',1,'on').reading).toBe('on');
  expect(nand04Threshold('high',2,'on').reading).toBe('on');
  expect(nand04Threshold('low',.3,'on').reading).toBe('off');
 });
 it('FTL modifies same LBA through a new physical page and GC never loses live value',()=>{
  const old=nand04Pages('initial'),updated=nand04Pages('updated'),gc=nand04Pages('collected');
  expect(old.pages).toHaveLength(8);expect(old.pages[0].status).toBe('valid');
  expect(updated.pages[0].status).toBe('invalid');
  expect(updated.pages[4]).toMatchObject({status:'valid',lba:7,revision:'B'});
  expect(gc.erasedBlock0).toBe(true);
  expect(gc.pages.slice(0,4).every(x=>x.status==='empty')).toBe(true);
  expect(gc.pages.filter(x=>x.status==='valid')).toHaveLength(1);
  expect(gc.mapping.LBA7).toBe(updated.mapping.LBA7);
 });
 it('independent enterprise feature cards never imply universal ECC/DRAM/PLP',()=>{
  const a=nand04Ssd('hot',true,false,false),z=nand04Ssd('cold',false,true,true);
  expect(a.absoluteReliabilityGuaranteed).toBe(false);expect(a.measuredEndurance).toBe(false);
  expect(a.eccClaim).toContain('not perfect');
  expect(a.plpClaim).toContain('not all eSSD');
  expect(a.dramClaim).toContain('DRAMless');
  expect(z.plpClaim).toContain('optional');
  expect(z.dramClaim).toContain('present');
 });
 it('NVMe command host→controller unlike device DMA data→host DDR; GPU is optional separate movement',()=>{
  const c=nand04Transport('command'),r=nand04Transport('read-data'),g=nand04Transport('to-gpu');
  expect(c.kind).toBe('command');expect(c.from).toContain('Host');expect(c.to).toContain('SSD controller');
  expect(r.kind).toBe('data');expect(r.from).toContain('NAND');expect(r.to).toBe('host DDR');
  expect(r.via).toBe('PCIe DMA');expect(g.kind).toBe('separate');expect(g.to).toContain('when supported');
 });
 it('resident inference skips repeated full-model SSD load; checkpoint includes storage write',()=>{
  expect(nand04Ai('cold-load',1).sequence[0]).toBe('SSD/NAND');
  expect(nand04Ai('resident-infer',1).sequence).not.toContain('SSD/NAND');
  expect(nand04Ai('checkpoint',2).sequence.at(-1)).toContain('SSD');
  expect(nand04Ai('checkpoint',2).network).toContain('NIC');
 });
 const rows=[
  ['nand-threshold',['low','high','power-cycle'],'retention-vs-read',['m1','m2','m3']],
  ['nand-page-block',['initial','updated','collected'],'page-vs-block',['m1','m2','m3']],
  ['ssd-ftl-reliability',['hot','cold','ecc-option','plp-option'],'ftl-feature-options',['ssd-plp-universal','ssd-dram-universal','ecc-perfect']],
  ['nvme-transfer',['command','read-data','to-gpu'],'command-dma-staging',['m1','m2','m3']],
  ['ai-datacenter-pipeline',['cold-load','resident-infer','checkpoint','two-servers'],'resident-vs-cold',['m1','m2','m3']]
 ] as const;
 for(const [id,seen,correct,wrong] of rows){
  it(id+' requires all physical observation tags + correct answer; 3 distinct wrong routes fail without forcing mistakes',()=>{
   expect(gradeNand04(id,seen,correct).passed).toBe(true);
   expect(gradeNand04(id,seen.slice(1),correct).passed).toBe(false);
   expect(gradeNand04(id,[],correct).passed).toBe(false);
   for(const key of wrong){
    const actual=gradeNand04(id,seen,key);
    expect(actual.passed).toBe(false);expect(actual.misconception).toBe(key);
    expect(actual.conditions.at(-1)?.passed).toBe(false);
   }
  });
 }
});
