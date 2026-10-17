import {describe,it,expect} from 'vitest';
import {bandMaterial,depletion,diodeCurrent,dopantModel,evaluatePn,gateContrast,pnEquilibrium,pnSceneOrder} from '../a05/pn/pnModel';
describe('A06 11 band-doping-PN-diode physics and evaluation contract',()=>{
 it('bandgap is energetic not a hole, carriers from light/heat',()=>{
  expect(bandMaterial('metal',false,false).gapEV).toBe(0);
  expect(bandMaterial('silicon',true,false)).toMatchObject({gapEV:1.1,excited:true,bandGapIsSpatial:false});
  expect(bandMaterial('insulator',false,false).gapEV).toBe(5);
 });
 it('donor n electron, acceptor p hole; bulk neutrality and minority carriers',()=>{
  expect(dopantModel('donor')).toMatchObject({majority:'electron',bulkChargeApproxZero:true,minorityExists:true});
  expect(dopantModel('acceptor')).toMatchObject({majority:'hole',bulkChargeApproxZero:true,minorityExists:true});
 });
 it('PN equilibrium has n+→p- built-in E and diffusion/drift cancellation',()=>{
  expect(pnEquilibrium('diffusion').netCurrentToy).toBe(1);
  expect(pnEquilibrium('equilibrium')).toMatchObject({diffusionToy:1,driftToy:-1,netCurrentToy:0});
 });
 it('Si toy 300K 1e16/1e16 depletion Vbi ~0.714 and W -1/0/+0.2 V around 0.666/0.430/0.365 micron',()=>{
  const r=depletion(-1),z=depletion(0),f=depletion(.2);
  expect(z.builtInV).toBeCloseTo(.7143,3);
  expect(r.widthMicrons).toBeCloseTo(.6659,2);
  expect(z.widthMicrons).toBeCloseTo(.4298,2);
  expect(f.widthMicrons).toBeCloseTo(.3647,2);
  expect(r.widthMicrons).toBeGreaterThan(z.widthMicrons);
  expect(z.widthMicrons).toBeGreaterThan(f.widthMicrons);
  expect(z.nMicrons).toBeCloseTo(z.pMicrons,8);
  expect(()=>depletion(0,0)).toThrow();
 });
 it('Shockley Is1pA n2 uses continuous forward current, reverse leakage; not hard 0.7 switch',()=>{
  expect(diodeCurrent(0).currentA).toBe(0);
  expect(diodeCurrent(.3).currentNanoA).toBeCloseTo(.330,2);
  expect(diodeCurrent(.4).currentNanoA).toBeCloseTo(2.289,2);
  expect(diodeCurrent(-1).currentPicoA).toBeCloseTo(-1,6);
  expect(gateContrast('mos').hasInsulator).toBe(true);
  expect(gateContrast('pn').hasInsulator).toBe(false);
 });
 it('five steps gate success on required scene observations and correct answer',()=>{
  expect(pnSceneOrder).toHaveLength(5);
  const examples=[
   ['semiconductor-band-gap',['metal','silicon','insulator','excited'],'gap-energy-not-hole'],
   ['silicon-donor-acceptor-doping',['donor','acceptor'],'majority-neutrality'],
   ['pn-diffusion-drift-equilibrium',['diffusion','equilibrium'],'balanced-not-battery'],
   ['pn-bias-depletion-calculator',['reverse','zero','forward'],'reverse-widens'],
   ['pn-diode-current-to-mos',['0.3','0.4','-1','mos'],'nonlinear-oxide'],
  ] as const;
  for(const [id,seen,answer] of examples){
   expect(evaluatePn(id,seen,answer).passed).toBe(true);
   expect(evaluatePn(id,[],answer).passed).toBe(false);
   expect(evaluatePn(id,seen,null).passed).toBe(false);
  }
 });
});
