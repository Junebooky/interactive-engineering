import {describe,it,expect} from 'vitest';
import {fabAdvance,fabStageValid,freshPackage06,gradePackage06,package06Order,chipletYield,interconnect,packageThermal} from '../a05/package06/package06Model';
import type {FabAction} from '../a05/package06/package06Model';
describe('A05 Lesson06 wafer KGD HBM and thermal source-physics regression',()=>{
 it('four scenes typed, student initial state neutral to product guarantees',()=>{expect(package06Order).toHaveLength(4);expect(freshPackage06().topology).toBe('board');});
 it('wafer->photo->process->metal->test->dice strictly ordered, skip and reversed sequences cannot grade',()=>{
  let seq:FabAction[]=[];
  for(const invalid of ['dice','metal','test'] as FabAction[]){const x=fabAdvance(seq,invalid);expect(x.accepted).toBe(false);expect(x.code).toBe('INVALID_STAGE');expect(x.history).toEqual([]);}
  for(const action of ['wafer','photo','process','metal','test','dice'] as FabAction[]){const r=fabAdvance(seq,action);expect(r.accepted).toBe(true);seq=r.history;}
  expect(fabStageValid(seq)).toBe(true);
  expect(fabStageValid([...seq].reverse())).toBe(false);
  expect(fabAdvance(seq,'photo').code).toBe('COMPLETE');
  const reset=fabAdvance(seq,'reset');expect(reset.history).toEqual([]);expect(reset.code).toBe('RESET');expect(fabStageValid(reset.history)).toBe(false);
 });
 it('Poisson D0.005 mono100 mm2 .60653, one25 mm2 .882497, UNSCREENED four also .60653, assembly95% -> .5762',()=>{
  const none=chipletYield(.005,'none',.95);
  expect(none.mono).toBeCloseTo(.606531,5);expect(none.individual).toBeCloseTo(.882497,5);
  expect(none.fourUnscreened).toBeCloseTo(.606531,5);expect(none.packageSuccess).toBeCloseTo(.576204,5);
  expect(none.packageSuccess).not.toBeCloseTo(.95,1);
  expect(chipletYield(.005,'none',1).packageSuccess).toBeCloseTo(.606531,5);
  expect(chipletYield(0,'none',.95).packageSuccess).toBe(.95);
 });
 it('ideal KGD picks good dies BEFORE assembly, conditional packaged-good .95 but 4.532 candidates and costs',()=>{
  const kgd=chipletYield(.005,'KGD',.95);
  expect(kgd.packageSuccess).toBe(.95);expect(kgd.conditionalAfterScreen).toBe(true);
  expect(kgd.expectedCandidatesForOnePackage).toBeCloseTo(4.532,2);
  expect(kgd.extraTestingAndInventoryCost).toBe(true);expect(kgd.realScreeningPerfect).toBe(false);
  expect(chipletYield(.005,'KGD',1).packageSuccess).toBe(1);
 });
 it('HBM vertical TSV inside distinct from sideways GPU-interposer; UI 2.5D not actual package; silicon not required',()=>{
  expect(interconnect('board',false,'silicon').externalToGpu).toBe('pcb-board-routing');
  expect(interconnect('hbm-stack',true,'silicon').insideHbm).toBe('vertical-tsv-plus-microbumps');
  const silicon=interconnect('interposer',true,'silicon'),rdl=interconnect('interposer',true,'RDL');
  expect(silicon.externalToGpu).toBe('interposer-dense-sideways');
  expect(rdl.externalToGpu).toBe('interposer-dense-sideways');
  expect(silicon.isUi2p5dSameAsPackaging).toBe(false);
  expect(rdl.realCoWoSSiOnly).toBe(false);
 });
 it('steady package ΔT=P*Rtheta: 20W*.2=4K, 40W*.4=16K and ambient25 toy',()=>{
  expect(packageThermal(20,.2)).toMatchObject({deltaK:4,junctionToyC:29});
  expect(packageThermal(40,.4)).toMatchObject({deltaK:16,junctionToyC:41});
  expect(packageThermal(40,.2)).toMatchObject({deltaK:8,junctionToyC:33,actualChipTempUnknown:true});
  expect(packageThermal(20,.4).deltaK).toBe(8);
 });
 const cases=[
  [package06Order[0],['ordered-fab','layers1','layers2','defect0','defect1'],'repeat-and-test'],
  [package06Order[1],['density0','density005','none','KGD','assembly1','assembly095'],'conditional-kgd-package-yield'],
  [package06Order[2],['board','stack','interposer-silicon','interposer-RDL','tsv'],'tsv-internal-interposer-sideways'],
  [package06Order[3],['power20','power40','r02','r04'],'p-times-r-thermal']
 ] as const;
 for(const [sceneId,trace,correct] of cases){
  it(sceneId+' requires all actual actions AND correct WHY; 3 misconception-specific incorrect concepts',()=>{
   expect(gradePackage06(sceneId,trace,correct).passed).toBe(true);
   expect(gradePackage06(sceneId,[],correct).passed).toBe(false);
   expect(gradePackage06(sceneId,trace.slice(1),correct).passed).toBe(false);
   for(const m of ['m1','m2','m3']){
    const r=gradePackage06(sceneId,trace,m);
    expect(r.passed).toBe(false);expect(r.misconception).toBe(m);
   }
  });
 }
});
