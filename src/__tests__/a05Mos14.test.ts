import {describe,it,expect} from 'vitest';
import {mos14Scenes,mos14OxidePhysics,mos14Surface,mos14Cv,mos14Current,mos14OxideCurrent,gradeMos14} from '../a05/mos14/mos14Model';
import type {Mos14State} from '../a05/mos14/mos14Model';
describe('A05 MOS14 physically bounded ideal toy and gated learning',()=>{
 const state:Mos14State={gateV:1.1,oxideNm:5,phase:'steady',device:'capacitor',vds:0,showCv:false};
 it('four independently tracked scenes',()=>expect(mos14Scenes).toHaveLength(4));
 it('oxide geometric C of 5nm 0.690627 and 10nm 0.345313 uF/cm², not total measured CV',()=>{
   const a=mos14OxidePhysics(5),b=mos14OxidePhysics(10);
   expect(a.coxMicroFPerCm2).toBeCloseTo(.69062665,5);
   expect(b.coxMicroFPerCm2).toBeCloseTo(.345313325,5);
   expect(b.coxMicroFPerCm2/a.coxMicroFPerCm2).toBeCloseTo(.5,12);
   expect(a.vfbV).toBe(0);expect(a.vtV).toBeGreaterThan(.78);expect(a.vtV).toBeLessThan(.79);
   expect(b.vtV).toBeGreaterThan(a.vtV);
 });
 it('p-type majority holes negative accumulation, toy flatband 0, positive depletion then inversion',()=>{
   expect([-0.5,0,0.3,1.1].map(v=>mos14Surface(v as -0.5|0|0.3|1.1,5)))
    .toEqual(['accumulation','flatband','depletion','inversion']);
   expect(mos14Surface(1.1,10)).toBe('inversion');
 });
 it('oxide insulating in steady DC but external transient charging may occur',()=>{
   expect(mos14OxideCurrent('steady')).toMatchObject({oxideSteadyDcA:0,externalChargeTransientPossible:false});
   expect(mos14OxideCurrent('switching')).toMatchObject({oxideSteadyDcA:0,externalChargeTransientPossible:true});
 });
 it('serial depletion capacitance is LESS than Cox and high/low frequency only schematic',()=>{
   const cv=mos14Cv(5,true);
   expect(cv.depletionSeriesToyMicroFPerCm2).toBeCloseTo(cv.coxMicroFPerCm2/3,10);
   expect(cv.depletionSeriesToyMicroFPerCm2).toBeLessThan(cv.coxMicroFPerCm2);
   expect(cv.assumption).toContain('not measured');
 });
 it('2-terminal MOS cap ID is undefined, nMOS VDS 0 net zero despite inversion, plus VDS possible only',()=>{
   expect(mos14Current(state)).toMatchObject({drainCurrent:'undefined',hasDrainTerminal:false});
   expect(mos14Current({...state,device:'nmos',vds:0}).drainCurrent).toBe('zero');
   expect(mos14Current({...state,device:'nmos',vds:.5}).drainCurrent).toBe('possible');
   expect(mos14Current({...state,device:'nmos',gateV:0,vds:.5}).drainCurrent).toBe('not-guaranteed');
 });
 it('each scene requires hands-on states plus conceptual answer; incorrect answer or missing evidence blocks',()=>{
   const rows=[
    [mos14Scenes[0],['negative','positive','switching','steady'],'field-not-dc'],
    [mos14Scenes[1],['accumulation','flatband','depletion','inversion'],'bulk-unchanged'],
    [mos14Scenes[2],['tox5','tox10','cv'],'inverse-series-frequency'],
    [mos14Scenes[3],['cap','nmos-zero','nmos-positive'],'terminals-and-vds'],
   ] as const;
   for(const [id,seen,answer] of rows){
    expect(gradeMos14(id,seen,answer).passed).toBe(true);
    expect(gradeMos14(id,seen,answer+'-wrong').passed).toBe(false);
    expect(gradeMos14(id,seen.slice(1),answer).passed).toBe(false);
    expect(gradeMos14(id,[],answer).passed).toBe(false);
   }
 });
});
