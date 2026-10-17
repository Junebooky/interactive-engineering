import {describe,it,expect} from 'vitest';
import {assessGpu,computeFeeding,memoryPlacementMatches,packaging,signalLevels,theoreticalBandwidth} from '../a05/gpu/gpuModel';
describe('A06 G03 GPU data/memory 2.5D physics contracts',()=>{
 it('fully overlapped pipeline: feed8 dominates 16/32 compute',()=>{
   expect(computeFeeding(16,8)).toMatchObject({toySeconds:8,throughput:8,bottleneck:'data supply'});
   expect(computeFeeding(32,8)).toMatchObject({toySeconds:8,throughput:8,bottleneck:'data supply'});
   expect(computeFeeding(32,32)).toMatchObject({toySeconds:2,throughput:32,bottleneck:'balanced'});
   expect(()=>computeFeeding(16,8,0)).toThrow();
 });
 it('every memory family remains DRAM and placement is qualitative',()=>{
   expect(memoryPlacementMatches('DDR/RDIMM','cpu-dimm')).toBe(true);
   expect(memoryPlacementMatches('GDDR6','gpu-board')).toBe(true);
   expect(memoryPlacementMatches('GDDR7','gpu-board')).toBe(true);
   expect(memoryPlacementMatches('GDDR6','cpu-dimm')).toBe(false);
   expect(memoryPlacementMatches('HBM','gpu-package')).toBe(true);
   expect(memoryPlacementMatches('HBM','cpu-dimm')).toBe(false);
 });
 it('128bit × 24/32 Gb/s per pin divided by eight yields 384/512 decimal GB/s',()=>{
   expect(theoreticalBandwidth(128,24).maxGBps).toBe(384);
   expect(theoreticalBandwidth(128,32).maxGBps).toBe(512);
   expect(theoreticalBandwidth(128,32,.5).modelGBps).toBe(256);
   expect(()=>theoreticalBandwidth(0,24)).toThrow();
   expect(signalLevels('NRZ')).toBe(2);expect(signalLevels('PAM3')).toBe(3);
 });
 it('HBM TSV stack is not an interposer and performance is not asserted numerically',()=>{
   expect(packaging('hbm-stack').connection).toContain('TSV in HBM stack');
   expect(packaging('hbm-stack').connection).toContain('interposer');
   expect(packaging('gddr-board').connection).toContain('board traces');
 });
 it('negative cases: visiting location without actual matched family must not pass',()=>{
   const all=['pair-DDR/RDIMM','pair-GDDR6','pair-GDDR7','pair-HBM'];
   expect(assessGpu('memory-family-roles',['cpu-dimm','gpu-board','gpu-package'],'all-dram-roles').passed).toBe(false);
   for(let i=0;i<all.length;i++)expect(assessGpu('memory-family-roles',all.filter((_,j)=>i!==j),'all-dram-roles').passed).toBe(false);
 });
 it('negative cases: merely visiting both pin rates without numerical quiz never passes',()=>{
   const correct=['rate24','rate32','quiz24','quiz32'];
   expect(assessGpu('gddr-width-rate',['rate24','rate32'],'theoretical-pam3').passed).toBe(false);
   expect(assessGpu('gddr-width-rate',correct.filter(x=>x!=='quiz24'),'theoretical-pam3').passed).toBe(false);
   expect(assessGpu('gddr-width-rate',correct.filter(x=>x!=='quiz32'),'theoretical-pam3').passed).toBe(false);
 });
 it('all four lessons require observations and engineering explanation',()=>{
   const cases=[
     ['compute-feeding',['core16feed8','core32feed8','feed32'],'supply-limits'],
     ['memory-family-roles',['pair-DDR/RDIMM','pair-GDDR6','pair-GDDR7','pair-HBM'],'all-dram-roles'],
     ['gddr-width-rate',['rate24','rate32','quiz24','quiz32'],'theoretical-pam3'],
     ['hbm-tradeoffs',['gddr','hbm','constraints'],'relative-tradeoffs'],
   ] as const;
   for(const [id,seen,answer] of cases){
     expect(assessGpu(id,[],answer).passed).toBe(false);
     expect(assessGpu(id,seen,null).passed).toBe(false);
     expect(assessGpu(id,seen,answer).passed).toBe(true);
   }
 });
});
