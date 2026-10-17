import {describe,it,expect} from 'vitest';
import {clockTimeline,evaluateNetwork,gateLogic,gateTopology,gradeLogic16,initialClockHighNoEdge,latchCase,latchStep,logic16Order,metastability,nestedNand,timingToy} from '../a05/logic16/logic16Model';
import type {Bit,GateType} from '../a05/logic16/logic16Model';
describe('A05 16 CMOS logic, volatile level latch, rising edge DFF, setup/hold toy scientific regression',()=>{
 it('four scenes; NAND [1,1,1,0], NOR [1,0,0,0] in 00 01 10 11 order',()=>{
  expect(logic16Order).toHaveLength(4);
  for(const [gate,truth] of [['NAND',[1,1,1,0]],['NOR',[1,0,0,0]]] as [GateType,number[]][]){
   expect([[0,0],[0,1],[1,0],[1,1]].map(([a,b])=>gateLogic(gate,a as Bit,b as Bit))).toEqual(truth);
  }
 });
 it('correct NAND PDN series/PUN parallel and NOR inverted; wrong topology selectable/rejected',()=>{
  expect(gateTopology('NAND')).toEqual({pun:'parallel',pdn:'series'});
  expect(gateTopology('NOR')).toEqual({pun:'series',pdn:'parallel'});
  expect(evaluateNetwork('NAND','parallel','series').correct).toBe(true);
  expect(evaluateNetwork('NAND','series','parallel').correct).toBe(false);
  expect(evaluateNetwork('NOR','parallel','series').correct).toBe(false);
 });
 it('nested NAND is not three-input NAND (A1 B0 C1 explicit counterexample)',()=>{
  expect(nestedNand(1,0,1)).toEqual({nested:0,triple:1,equals:false});
 });
 it('two histories hold different Q with SAME current D0/G0; gate closed blocks D changes',()=>{
  const q0=latchCase(0),q1=latchCase(1);
  expect(q0.d).toBe(0);expect(q1.d).toBe(0);expect(q0.g).toBe(0);expect(q1.g).toBe(0);
  expect(q0.q).toBe(0);expect(q1.q).toBe(1);
  expect(latchStep({d:1,g:0,q:1,powered:true},{type:'d',bit:0}).q).toBe(1);
  expect(latchStep({d:1,g:1,q:1,powered:true},{type:'d',bit:0}).q).toBe(0);
 });
 it('power OFF invalidates stored Q and power ON NEVER restores previous value',()=>{
  const before={d:0 as Bit,g:0 as Bit,q:1 as Bit,powered:true};
  const off=latchStep(before,{type:'off'});
  expect(off.q).toBeNull();
  const back=latchStep(off,{type:'on'});
  expect(back.q).toBeNull();expect(back.powered).toBe(true);
  expect(latchStep(back,{type:'init',bit:0}).q).toBe(0);
 });
 it('high clock t3,t4 latch follows D1 then0; DFF holds Q0 until t8 actual positive edge D1',()=>{
  expect(clockTimeline(1)).toMatchObject({t:2,d:0,clock:1,latchQ:0,ffQ:0,rising:true});
  expect(clockTimeline(2)).toMatchObject({t:3,d:1,clock:1,latchQ:1,ffQ:0,rising:false});
  expect(clockTimeline(3)).toMatchObject({t:4,d:0,clock:1,latchQ:0,ffQ:0,rising:false});
  expect(clockTimeline(6)).toMatchObject({t:8,d:1,clock:1,latchQ:1,ffQ:1,rising:true});
  expect(initialClockHighNoEdge()).toMatchObject({previousKnown:false,captureEvent:false,q:'unknown-uninitialized'});
 });
 it('T8 unbuffered setup+0.5 PASS hold-0.3 FAIL; buffer T8 setup-0.1 FAIL hold+0.1 PASS; T9 buffer both PASS',()=>{
  expect(timingToy(8,false)).toMatchObject({setupRequired:7.5,holdArrival:.5,setupMargin:.5,holdMargin:-.3,setupPass:true,holdPass:false});
  expect(timingToy(8,true)).toMatchObject({setupRequired:8.1,holdArrival:.9,setupMargin:-.1,holdMargin:.1,setupPass:false,holdPass:true});
  expect(timingToy(9,true)).toMatchObject({setupRequired:8.1,holdArrival:.9,setupMargin:.9,holdMargin:.1,setupPass:true,holdPass:true});
  expect(timingToy(9,false).holdPass).toBe(false);
 });
 it('metastability is risk, NOT deterministic wrong bit nor zero failure probability with 2FF',()=>{
  const m=metastability(true,true);
  expect(m.risk).toContain('unknown');expect(m.guaranteedZeroFailure).toBe(false);
  expect(m.synchronizer).toContain('never exact zero');
 });
 it('all observation evidence and WHY required; three misconception wrong alternatives independently fail, no intentional mistake required',()=>{
  const entries=[
   [logic16Order[0],['NAND00','NAND01','NAND10','NAND11','NOR00','NOR01','NOR10','NOR11','topology-NAND','topology-NOR','nested-counterexample'],'complementary'],
   [logic16Order[1],['hold0','hold1','gate-closed-d-change','power-cycle'],'history-q'],
   [logic16Order[2],['t3','t4','t8','initial-high-no-edge'],'edge-vs-level'],
   [logic16Order[3],['initial8','buffer8','buffer9','hazard'],'separate-setup-hold']
  ] as const;
  for(const [id,evidence,correct] of entries){
   expect(gradeLogic16(id,evidence,correct).passed).toBe(true);
   expect(gradeLogic16(id,[],correct).passed).toBe(false);
   expect(gradeLogic16(id,evidence.slice(1),correct).passed).toBe(false);
   for(const wrong of ['m1','m2','m3']){const result=gradeLogic16(id,evidence,wrong);expect(result.passed).toBe(false);expect(result.misconception).toBe(wrong);}
  }
 });
});
