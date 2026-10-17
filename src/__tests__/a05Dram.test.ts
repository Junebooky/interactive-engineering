import { describe,expect,it } from 'vitest';
import {
  bankOverlap,bankSchedule,dramEvaluate,leakageVoltage,senseRead,shareCharge,writeCell,
} from '../a05/dram/dramModel';

describe('A06→A05 D02 DRAM 2.5D scientific contracts',()=>{
  it('WL=OFF isolates cell; WL=ON writes BL; hold persists after BL changes',()=>{
    expect(writeCell(0,1,0)).toBe(0);
    const charged=writeCell(0,1,1);
    expect(charged).toBe(1);
    expect(writeCell(charged,0,0)).toBe(1);
    expect(writeCell(charged,0,1)).toBe(0);
  });
  it('precharge at VDD/2 gives + or - 0.05 when Cc:Cb=1:9',()=>{
    const one=shareCharge(1),zero=shareCharge(0);
    expect(one.sharedVoltage).toBeCloseTo(.55);
    expect(zero.sharedVoltage).toBeCloseTo(.45);
    expect(one.delta).toBeCloseTo(.05);
    expect(zero.delta).toBeCloseTo(-.05);
    expect(senseRead(1,'shared').cellVoltage).toBeCloseTo(.55);
    expect(senseRead(1,'sensed').cellVoltage).toBeCloseTo(.55);
    expect(senseRead(1,'restored').cellVoltage).toBe(1);
    expect(senseRead(0,'restored').cellVoltage).toBe(0);
    expect(()=>shareCharge(1,0,9)).toThrow();
  });
  it('elapsed 0..2 toy is not real milliseconds; refresh restores charge',()=>{
    expect(leakageVoltage(0,null)).toBe(1);
    expect(leakageVoltage(2,null)).toBeCloseTo(.6);
    expect(leakageVoltage(2,2)).toBe(1);
    expect(leakageVoltage(3,2)).toBeCloseTo(.8);
  });
  it('same bank requests serialize; two banks may overlap internally',()=>{
    expect(bankSchedule(1).map(r=>[r.bank,r.start,r.finish])).toEqual([[1,0,2],[1,2,4]]);
    expect(bankSchedule(2).map(r=>[r.bank,r.start,r.finish])).toEqual([[1,0,2],[2,0,2]]);
    expect(bankOverlap(1)).toBe(false);
    expect(bankOverlap(2)).toBe(true);
  });
  it('each scene requires actions AND correct explanation, partial feedback remains separate',()=>{
    const cases: Array<[Parameters<typeof dramEvaluate>[0],string[],string]> = [
      ['dram-write',['charged','held'],'isolated'],
      ['dram-sense-restore',['shared','sensed','restored'],'restore'],
      ['dram-leak-refresh',['leaked','refreshed'],'leak'],
      ['dram-row-bank',['serial','parallel'],'conditional'],
    ];
    for(const [id,steps,answer] of cases){
      expect(dramEvaluate(id,steps,null).passed).toBe(false);
      expect(dramEvaluate(id,[],answer).passed).toBe(false);
      expect(dramEvaluate(id,steps,answer).passed).toBe(true);
    }
    const partial=dramEvaluate('dram-sense-restore',['shared','sensed'],'restore');
    expect(partial.passed).toBe(false);
    expect(partial.conditions[0].passed).toBe(true);
    expect(partial.conditions[1].passed).toBe(false);
  });
});
