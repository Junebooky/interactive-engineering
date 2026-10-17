import {describe,it,expect} from 'vitest';
import {power31Order,power31Fresh,power31Psu,power31Buck,power31Pdn,power31Coolant,power31Facility,gradePower31} from '../a05/power31/power31Model';
describe('A05 Lesson31 PSU/VRM/PDN/CDU/PUE/WUE independent physics and student causality',()=>{
 it('five original scenes, neutral typed defaults',()=>{
  expect(power31Order).toHaveLength(5);expect(power31Fresh().pue).toBe(1.4);
 });
 it('PSU 100W fixed: efficiency denominator is INPUT, not output; no energy creation',()=>{
  const a=power31Psu(90),b=power31Psu(95);
  expect(a.inputW).toBeCloseTo(111.111111,4);expect(a.lossW).toBeCloseTo(11.111111,4);
  expect(b.inputW).toBeCloseTo(105.263158,4);expect(b.lossW).toBeCloseTo(5.263158,4);
  expect(a.inputPlusLossCheck&&b.inputPlusLossCheck).toBe(true);expect(a.lossW).toBeGreaterThan(b.lossW);
  expect(a.lossW).not.toBe(10);
 });
 it('buck IDEAL CCM voltage D*12 = 3/4/6; efficiency 90 only separate power/current branch',()=>{
  expect(power31Buck(.25).vout).toBe(3);expect(power31Buck(0.3333333333333333).vout).toBe(4);
  expect(power31Buck(.5).vout).toBe(6);
  const b=power31Buck(0.3333333333333333,90);
  expect(b).toMatchObject({vout:4,pout:40,eta:90});
  expect(b.pin).toBeCloseTo(44.444444,5);expect(b.iin).toBeCloseTo(3.703704,5);
  expect(b.loss).toBeCloseTo(4.444444,5);
  expect(b.vout).not.toBeCloseTo(3.6,4);
 });
 it('PDN 40W fixed workload V2→1 halves rail/DOUBLES current/QUADRUPLES I²R at R2mΩ',()=>{
  const a=power31Pdn(2,2),b=power31Pdn(1,2),c=power31Pdn(1,1);
  expect(a).toMatchObject({currentA:20,wireHeatW:.8,wireDropV:.04});
  expect(b).toMatchObject({currentA:40,wireHeatW:3.2,wireDropV:.08});
  expect(c).toMatchObject({currentA:40,wireHeatW:1.6,wireDropV:.04});
  expect(a.actualChipHeatNotDetermined).toBe(true);
 });
 it('coolant Q100kW Cp4180 ΔT5→4.784689kg/s, ΔT10→half; NOT site water consumption',()=>{
  const a=power31Coolant(100,5,'dry'),b=power31Coolant(100,10,'tower'),c=power31Coolant(50,10,'dry');
  expect(a.flowKgPerS).toBeCloseTo(4.784689,5);
  expect(b.flowKgPerS).toBeCloseTo(2.392344,5);
  expect(c.flowKgPerS).toBeCloseTo(1.196172,5);
  for(const q of [a,b,c]){
   expect(q.makeupWaterLPerS).toBeNull();expect(q.siteWaterConsumptionCannotBeDeduced).toBe(true);
  }
 });
 it('facility 1MW PUE1.4/1.2 energy difference 4.8MWh over same24h; A better PUE, B better WUE',()=>{
  const a=power31Facility(1.4,'A'),b=power31Facility(1.2,'B');
  expect(a).toMatchObject({itMW:1,facilityMW:1.4,overheadMW:.4,facilityMWh:33.6,deltaMWh24h:4.8,sitePue:1.2,siteWue:2});
  expect(b).toMatchObject({facilityMW:1.2,overheadMW:.2,facilityMWh:28.8,sitePue:1.35,siteWue:.5});
  expect(a.siteRankEnergyBetter).toBe('A');expect(b.siteRankWaterBetter).toBe('B');
  expect(a.tokensPerSecond).toBeNull();expect(a.wueUnit).toBe('L/kWh');
 });
 const cases=[
  [power31Order[0],['eta90','eta95'],'psu-input-output-heat'],
  [power31Order[1],['duty25','duty33','duty50','eta90'],'buck-ideal-vs-power-efficiency'],
  [power31Order[2],['rail2','rail1','wire1','wire2'],'fixed40w-i2r'],
  [power31Order[3],['temp5','temp10','heat50','heat100','dry','tower'],'recirculation-vs-makeup'],
  [power31Order[4],['pue14','pue12','siteA','siteB'],'same-boundary-separate-pue-wue']
 ] as const;
 for(const [id,evidence,right] of cases){
  it(id+' demands distinct physical observations + right WHY; 3 wrong causes separately rejected',()=>{
   expect(gradePower31(id,evidence,right).passed).toBe(true);
   expect(gradePower31(id,evidence.slice(1),right).passed).toBe(false);
   expect(gradePower31(id,[],right).passed).toBe(false);
   for(const wrong of ['m1','m2','m3']){
    const r=gradePower31(id,evidence,wrong);
    expect(r.passed).toBe(false);expect(r.misconception).toBe(wrong);
   }
  });
 }
});
