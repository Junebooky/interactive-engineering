import {describe,it,expect} from 'vitest';
import {nand04SceneOrder,nand04Threshold,nand04Pages,nand04Ssd,nand04Transport,nand04Ai,nand04Fresh,nand04Advance,nand04ValidFlow,gradeNand04} from '../a05/nand04/nand04Model';
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
  const old=nand04Pages('initial',['initial']),updated=nand04Pages('updated',['initial','updated']),gc=nand04Pages('collected',['initial','updated','collected']);
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
  const c=nand04Transport('command',['command']),r=nand04Transport('read-data',['command','read-data']),g=nand04Transport('to-gpu',['command','read-data','to-gpu']);
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

describe('A07 Round15 P1 causal order and hard RESET — page and NVMe routing',()=>{
 it('direct historical unordered tag sets can never be passed as scientific proof',()=>{
  expect(gradeNand04('nand-page-block',['collected','updated','initial'],'page-vs-block').passed).toBe(false);
  expect(gradeNand04('nvme-transfer',['to-gpu','read-data','command'],'command-dma-staging').passed).toBe(false);
  expect(gradeNand04('nand-page-block',['initial','collected','updated'],'page-vs-block').passed).toBe(false);
  expect(gradeNand04('nvme-transfer',['command','to-gpu','read-data'],'command-dma-staging').passed).toBe(false);
 });
 it('GC early NO_VALID_NEW_PAGE never changes physical page, phantom B is forbidden',()=>{
  const invalid=nand04Advance('page',[],'collected');
  expect(invalid).toMatchObject({accepted:false,code:'NO_VALID_NEW_PAGE',history:[]});
  expect(nand04Pages('collected').pages.filter(p=>p.status==='valid').map(p=>p.revision)).toEqual(['A']);
  expect(nand04Pages('collected').erasedBlock0).toBe(false);
  expect(nand04Pages('updated').pages.filter(p=>p.status==='valid').map(p=>p.revision)).toEqual(['A']);
 });
 it('valid LBA A→new physical B→safe GC, and resetting invalidates earlier history',()=>{
  const init=nand04Advance('page',[],'initial');
  const updated=nand04Advance('page',init.history,'updated');
  const collected=nand04Advance('page',updated.history,'collected');
  expect([init.code,updated.code,collected.code]).toEqual(['OK_INIT','OK_WRITE_B','OK_GC']);
  expect(nand04ValidFlow('page',collected.history)).toBe(true);
  expect(nand04Pages('collected',collected.history).pages.filter(p=>p.status==='valid').map(p=>p.revision)).toEqual(['B']);
  const reset=nand04Advance('page',collected.history,'reset');
  expect(reset).toMatchObject({accepted:true,history:[],reset:true});
  expect(gradeNand04('nand-page-block',reset.history,'page-vs-block').passed).toBe(false);
  const restarted=nand04Advance('page',collected.history,'initial');
  expect(restarted.history).toEqual(['initial']);
  expect(nand04Pages('collected',restarted.history).erasedBlock0).toBe(false);
 });
 it('device DMA before READ and host-to-GPU before DDR are rejected, no false payload',()=>{
  const noReq=nand04Advance('transport',[],'read-data');
  const noData=nand04Advance('transport',[],'to-gpu');
  expect(noReq).toMatchObject({accepted:false,code:'NO_REQUEST',history:[]});
  expect(noData).toMatchObject({accepted:false,code:'DATA_NOT_READY',history:[]});
  expect(nand04Transport('read-data').kind).toBe('blocked');
  expect(nand04Transport('to-gpu').to).toBe('DATA_NOT_READY');
  const issued=nand04Advance('transport',[],'command');
  const earlyCopy=nand04Advance('transport',issued.history,'to-gpu');
  expect(earlyCopy).toMatchObject({accepted:false,code:'DATA_NOT_READY'});
  expect(earlyCopy.history).toEqual(['command']);
  const dma=nand04Advance('transport',issued.history,'read-data');
  expect(nand04Advance('transport',dma.history,'to-gpu',false).code).toBe('GPU_UNSUPPORTED');
  const gpu=nand04Advance('transport',dma.history,'to-gpu');
  expect(gpu).toMatchObject({accepted:true,code:'OK_GPU_COPY'});
  expect(gradeNand04('nvme-transfer',gpu.history,'command-dma-staging').passed).toBe(true);
  const reset=nand04Advance('transport',dma.history,'reset');
  expect(reset.history).toEqual([]);
  expect(gradeNand04('nvme-transfer',reset.history,'command-dma-staging').passed).toBe(false);
 });
});
