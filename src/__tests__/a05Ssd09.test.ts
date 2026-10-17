import {describe,it,expect} from 'vitest';
import {fresh09,gradeSsd09,latencyModel,latencyPick,newPlpTrial,plpAdvance,plpConfigure,plpEnergy,plpOutcome,ssd09Order,ssdEndurance,ssdWaf,voltageWindows} from '../a05/ssd09/ssd09Model';
import type {PlpAction,PlpTrial} from '../a05/ssd09/ssd09Model';
describe('A05 Lesson09 educational threshold spacing, WAF, ordered PLP and nearest rank tail',()=>{
 it('four typed scenes and 16 centers are separated by exactly FIFTEEN gaps, not 16 bins',()=>{
  expect(ssd09Order).toHaveLength(4);expect(fresh09().bits).toBe(1);
  const s=voltageWindows(1,0),t=voltageWindows(3,.08),q=voltageWindows(4,.08);
  expect(s).toMatchObject({centers:2,gaps:1,centerGap:1});
  expect(t).toMatchObject({centers:8,gaps:7,centerGap:.142857,canOverlapInToy:true});
  expect(q).toMatchObject({centers:16,gaps:15,centerGap:.066667,canOverlapInToy:true});
  expect(q.positions).toHaveLength(16);expect(q.positions[0]).toBe(0);expect(q.positions[15]).toBe(1);
  expect(q.centerGap).not.toBe(.0625);expect(voltageWindows(4,0).canOverlapInToy).toBe(false);
 });
 it('WAF host1GiB vs physical 1 or 1.6GiB; OP has no universal inverse WAF law',()=>{
  expect(ssdWaf(0,10,false)).toMatchObject({hostGiB:1,validMoveGiB:0,physicalNandGiB:1,waf:1});
  expect(ssdWaf(.6,10,true)).toMatchObject({hostGiB:1,validMoveGiB:.6,physicalNandGiB:1.6,waf:1.6});
  expect(ssdWaf(.6,20,true).waf).toBe(1.6);
  expect(ssdWaf(.6,10,false).waf).toBe(1);expect(ssdWaf(.6,20,true).validPagesPreserved).toBe(true);
 });
 it('capacitor nominal energy0.8J / ideal0.1sec; effective0.6J means 0.4 feasible and1.2 insufficient, neither durability guarantee',()=>{
  const a=plpEnergy(.4),b=plpEnergy(1.2);
  expect(a).toMatchObject({nominalJ:.8,idealSeconds:.1,usableJ:.6,pendingWorkJ:.4,enoughToyEnergy:true,actualDeviceDurabilityGuaranteed:false});
  expect(b).toMatchObject({nominalJ:.8,usableJ:.6,pendingWorkJ:1.2,enoughToyEnergy:false});
 });
 it('bad causal event order cannot fake completed flush, FUA, ACK or media commit',()=>{
  const idle=newPlpTrial();
  expect(plpAdvance(idle,'ack').code).toBe('NO_PENDING_WRITE');
  expect(plpAdvance(idle,'flush-complete').code).toBe('NO_PENDING_WRITE');
  const requested=plpAdvance(idle,'write').trial;
  expect(plpAdvance(requested,'flush-complete').code).toBe('NOT_FLUSH_ISSUED');
  const ack=plpAdvance(requested,'ack').trial;
  const issue=plpAdvance(ack,'flush-issue').trial;
  expect(issue.flush).toBe('issued');expect(issue.mediaCommitted).toBe(false);
  expect(plpOutcome(issue)).toBe('pending-contract');
  const complete=plpAdvance(issue,'flush-complete').trial;
  expect(complete.flush).toBe('completed');expect(complete.mediaCommitted).toBe(true);
  expect(plpOutcome(complete)).toBe('durable-under-declared-policy');
  expect(plpAdvance(complete,'power-loss').evidence).toBe('durable-under-declared-policy');
 });
 it('ACK→loss before media commit unprotected AT_RISK; PLP sufficient never auto claims durable; 1.2J insufficient',()=>{
  let t=newPlpTrial({volatileCache:true,plpEnabled:false});
  t=plpAdvance(plpAdvance(t,'write').trial,'ack').trial;
  expect(plpOutcome(t)).toBe('pending-contract');
  expect(plpAdvance(t,'power-loss').evidence).toBe('at-risk');
  let enough=newPlpTrial({plpEnabled:true,remainingWorkJ:.4});
  enough=plpAdvance(plpAdvance(enough,'write').trial,'ack').trial;
  expect(plpAdvance(enough,'power-loss').evidence).toBe('energetically-possible-unverified');
  let insufficient=newPlpTrial({plpEnabled:true,remainingWorkJ:1.2});
  insufficient=plpAdvance(plpAdvance(insufficient,'write').trial,'ack').trial;
  expect(plpAdvance(insufficient,'power-loss').evidence).toBe('energy-insufficient');
 });
 it('A07 R23-01 afterMediaCommit ACK requires accepted media commit BEFORE emitting success',()=>{
  const policy=plpConfigure(newPlpTrial(),{volatileCache:false,ackMode:'afterMediaCommit'});
  expect(policy).toMatchObject({accepted:true,code:'CONFIG_OK'});
  const write=plpAdvance(policy.trial,'write').trial;
  const premature=plpAdvance(write,'ack');
  expect(premature).toMatchObject({accepted:false,code:'MEDIA_COMMIT_REQUIRED'});
  expect(premature.trial.ack).toBe(false);
  const committed=plpAdvance(write,'media-commit').trial;
  const acknowledged=plpAdvance(committed,'ack');
  expect(acknowledged).toMatchObject({accepted:true,code:'OK_ACK',evidence:'durable-under-declared-policy'});
  expect(acknowledged.trial.events).toEqual(['write','media-commit','ack']);
  expect(plpAdvance(acknowledged.trial,'power-loss').evidence).toBe('durable-under-declared-policy');
 });
 it('A07 R23-02 cannot retroactively install PLP or change cache/ACK policy during WRITE or after power-outage',()=>{
  let t=newPlpTrial({volatileCache:true,ackMode:'volatileCache',plpEnabled:false});
  t=plpAdvance(plpAdvance(t,'write').trial,'ack').trial;
  expect(plpConfigure(t,{plpEnabled:true,remainingWorkJ:.4})).toMatchObject({accepted:false,code:'CONFIG_LOCKED'});
  t=plpAdvance(t,'power-loss').trial;
  expect(t.powerLossVerdict).toBe('at-risk');expect(plpOutcome(t)).toBe('at-risk');
  for(const config of [{plpEnabled:true,remainingWorkJ:.4 as const},{volatileCache:false},{ackMode:'afterMediaCommit' as const}]){
   const rejected=plpConfigure(t,config);
   expect(rejected).toMatchObject({accepted:false,code:'CONFIG_LOCKED'});
   expect(rejected.trial).toBe(t);expect(plpOutcome(rejected.trial)).toBe('at-risk');
  }
  expect(plpOutcome({...t,plpEnabled:true,remainingWorkJ:.4})).toBe('at-risk'); // stamped verdict
  const next=plpAdvance(t,'reset').trial;
  expect(next).toMatchObject({phase:'idle',powerLossVerdict:null,episode:1});
  expect(plpConfigure(next,{plpEnabled:true,remainingWorkJ:.4}).accepted).toBe(true);
 });
 it('PLP energy possible/insufficient are incident results not merely enabling a toggle',()=>{
  for(const [work,evidence] of [[.4,'energetically-possible-unverified'],[1.2,'energy-insufficient']] as const){
   let trial=plpConfigure(newPlpTrial(),{plpEnabled:true,remainingWorkJ:work}).trial;
   expect(plpOutcome(trial)).toBe('pending-contract');
   trial=plpAdvance(plpAdvance(trial,'write').trial,'ack').trial;
   expect(plpOutcome(trial)).toBe('pending-contract');
   trial=plpAdvance(trial,'power-loss').trial;
   expect(plpOutcome(trial)).toBe(evidence);
   expect(trial.powerLossVerdict).toBe(evidence);
  }
 });
 it('reset/replayed trial never reuses last ACK/FLUSH/COMMIT transaction evidence',()=>{
  let t:PlpTrial=newPlpTrial();
  for(const a of ['write','ack','media-commit'] as PlpAction[]){t=plpAdvance(t,a).trial;}
  expect(t.mediaCommitted).toBe(true);
  const reset=plpAdvance(t,'reset').trial;
  expect(reset.events).toEqual([]);expect(reset.ack).toBe(false);expect(reset.mediaCommitted).toBe(false);
  expect(reset.flush).toBe('none');expect(reset.episode).toBe(1);
  expect(plpAdvance(reset,'power-loss').code).toBe('NO_PENDING_WRITE');
 });
 it('100-card nearest rank: A=95 one ms + 5 twenty ms p99 20 and mean1.95; B=99+1 p99 1 max20',()=>{
  const a=latencyModel('A'),b=latencyModel('B');
  expect(a).toMatchObject({rank99:99,p99Ms:20,maxMs:20,meanMs:1.95});
  expect(b).toMatchObject({rank99:99,p99Ms:1,maxMs:20,meanMs:1.19});
  expect(a.permuted).toHaveLength(100);
  expect(latencyPick('B',false,99)).toMatchObject({valid:false,code:'UNSORTED_CARD'});
  expect(latencyPick('B',true,100)).toMatchObject({valid:false,code:'MAX_NOT_P99',valueMs:20});
  expect(latencyPick('B',true,99)).toMatchObject({valid:true,code:'OK_RANK_99',valueMs:1,p99Ms:1});
 });
 it('DWPD is decimal WRITE measure, not read count/latency',()=>{
  expect(ssdEndurance()).toMatchObject({days:1825,writeTb:3650,writePbDecimal:3.65,readsNotIncluded:true,deviceWarranty:false});
 });
 const cases=[
  [ssd09Order[0],['SLC','TLC','QLC','noise0','noise08'],'centers-gap-15'],
  [ssd09Order[1],['base','move','op10','op20'],'host-vs-nand-waf'],
  [ssd09Order[2],['risk','commit','flush-issued','flush-completed','plp-enough','plp-not-enough'],'ack-is-not-media-commit'],
  [ssd09Order[3],['A-sorted-99','B-sorted-99','A-mean','B-mean','dwpd'],'nearest-rank-and-dwpd']
 ] as const;
 for(const [id,seen,right] of cases){
  it(id+' no forced wrong answer; incomplete evidence cannot pass, m1/2/3 cause independently wrong',()=>{
   expect(gradeSsd09(id,seen,right).passed).toBe(true);
   expect(gradeSsd09(id,[],right).passed).toBe(false);
   expect(gradeSsd09(id,seen.slice(1),right).passed).toBe(false);
   for(const wrong of ['m1','m2','m3']){const grade=gradeSsd09(id,seen,wrong);expect(grade.passed).toBe(false);expect(grade.misconception).toBe(wrong);}
  });
 }
});
