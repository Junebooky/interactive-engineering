import {describe,it,expect} from 'vitest';
import {dc10Order,freshDc10,dc10Roofline,dc10KvCache,dc10Facility,dc10Recovery,dc10DiagramLinks,dc10Probe,dc10RequiredEvidence,gradeDc10} from '../a05/dc10/dc10Model';
import type {Dc10SceneId,Dc10Evidence} from '../a05/dc10/dc10Model';
describe('A05 Lesson10 independent science toy, route chronology and evidence gates',()=>{
 it('has exactly four independently typed scenes',()=>{expect(dc10Order).toHaveLength(4);expect(new Set(dc10Order).size).toBe(4);});
 it('roofline FLOP/B × decimal GB/s, knee at40/20 FLOP/B; all numbers are upper ceilings not latency',()=>{
  expect(dc10Roofline(10,100)).toMatchObject({ceilingTflops:1,memoryCeilingTflops:1,ridgeFlopsPerByte:40,bound:'memory',latencyNotPredicted:true});
  expect(dc10Roofline(80,100)).toMatchObject({ceilingTflops:4,ridgeFlopsPerByte:40,bound:'compute'});
  expect(dc10Roofline(10,200)).toMatchObject({ceilingTflops:2,ridgeFlopsPerByte:20,bound:'memory'});
  expect(dc10Roofline(80,200)).toMatchObject({ceilingTflops:4,ridgeFlopsPerByte:20,bound:'compute'});
 });
 it('KV bytes use KV heads not query heads, separate resident model and unsupported LPDDR route',()=>{
  expect(dc10KvCache(4,1).bytes).toBe(1024);
  expect(dc10KvCache(16,1).bytes).toBe(4096);
  expect(dc10KvCache(16,4).bytes).toBe(16384);
  const v=dc10KvCache(16,4);
  expect(v.queryHeads).toBe(8);expect(v.nKvHeads).toBe(2);
  expect(v.bytes).not.toBe(65536);expect(v.ssdReadRequiredPerGeneratedToken).toBe(false);
  expect(dc10KvCache(16,4,{offload:'LPDDR',offloadPathSupported:false}).offloadAccepted).toBe(false);
  expect(dc10KvCache(16,4,{offload:'LPDDR',offloadPathSupported:true}).offloadAccepted).toBe(true);
 });
 it('PUE same-period facility 1.4 vs1.2MW; app throughput is independent and no latency guarantee',()=>{
  expect(dc10Facility(1.4,1000)).toMatchObject({facilityPowerMw:1.4,overheadMw:.4,throughput:1000});
  expect(dc10Facility(1.2,1000)).toMatchObject({facilityPowerMw:1.2,overheadMw:.2,throughput:1000});
  expect(dc10Facility(1.2,1500)).toMatchObject({facilityPowerMw:1.2,overheadMw:.2,throughput:1500,latencyOrGpuUtilizationNotDetermined:true});
 });
 it('two servers still no route after shared-switch outage; installing switch alone is not connectivity',()=>{
  const s={...freshDc10(),switch1Healthy:false};
  expect(dc10Recovery(s).code).toBe('NO_ROUTE');
  expect(dc10Probe(dc10Order[3],s).evidence).toBe('shared-switch-no-route');
  const installed={...s,switch2Installed:true};
  expect(dc10Recovery(installed).code).toBe('NO_ROUTE');
  expect(dc10Probe(dc10Order[3],installed).evidence).toBe('backup-disconnected');
  const physicallyConnected={...installed,routeBConnected:true};
  expect(dc10Recovery(physicallyConnected).code).toBe('ROUTE_NOT_CONFIGURED');
  const configured={...physicallyConnected,routeBConfigured:true};
  expect(dc10Recovery(configured).code).toBe('FAILOVER_DISABLED');
  const policy={...configured,failoverPolicy:'automatic' as const};
  expect(dc10Recovery(policy).code).toBe('STATE_NOT_RECOVERABLE');
  expect(dc10Probe(dc10Order[3],policy).evidence).toBe('configured-but-local-state');
  const replica={...policy,sessionState:'replicated' as const};
  expect(dc10Recovery(replica)).toMatchObject({code:'RECOVERY_POSSIBLE',needsColdStart:true,actualRtoUnknown:true});
  expect(dc10Probe(dc10Order[3],replica).evidence).toBe('back-route-recoverable');
  expect(dc10Recovery({...replica,sharedPowerHealthy:false}).code).toBe('NO_SHARED_POWER');
  expect(dc10Recovery({...replica,storageReplicaHealthy:false}).code).toBe('REPLICA_UNAVAILABLE');
  expect(dc10Recovery({...replica,jobType:'train'}).code).toBe('CHECKPOINT_REQUIRED');
  expect(dc10Recovery({...replica,jobType:'train',checkpointAvailable:true}).code).toBe('RECOVERY_POSSIBLE');
 });
 it('R28-02 independent live recovery / visual topology parity for disconnected A, missing B, unconfigured B and successful session',()=>{
  const s=freshDc10();
  expect(dc10DiagramLinks({...s,routeAConnected:false})).toMatchObject({primary:'open',primaryCablePresent:false,backup:'open'});
  expect(dc10Recovery({...s,routeAConnected:false}).code).toBe('NO_ROUTE');
  const absent={...s,switch1Healthy:false,routeBConnected:true};
  expect(dc10Recovery(absent).code).toBe('NO_ROUTE');
  expect(dc10DiagramLinks(absent)).toMatchObject({primary:'fault',backup:'open',backupCablePresent:false});
  const unconfigured={...absent,switch2Installed:true};
  expect(dc10Recovery(unconfigured).code).toBe('ROUTE_NOT_CONFIGURED');
  expect(dc10DiagramLinks(unconfigured)).toMatchObject({backup:'unconfigured',backupCablePresent:true});
  const policy={...unconfigured,routeBConfigured:true,failoverPolicy:'automatic' as const};
  expect(dc10Recovery(policy).code).toBe('STATE_NOT_RECOVERABLE');
  expect(dc10DiagramLinks(policy).backup).toBe('standby');
  const working={...policy,sessionState:'replicated' as const};
  expect(dc10Recovery(working).code).toBe('RECOVERY_POSSIBLE');
  expect(dc10DiagramLinks(working)).toMatchObject({backup:'active',backupCablePresent:true});
  expect(dc10DiagramLinks({...working,sharedPowerHealthy:false})).toMatchObject({primary:'fault',backup:'fault'});
  expect(dc10DiagramLinks({...working,switch2Healthy:false}).backup).toBe('fault');
  expect(dc10DiagramLinks({...working,backupHealthy:false}).backup).toBe('fault');
  expect(dc10DiagramLinks({...working,servers:1}).backup).toBe('open');
 });
 it('failed LPDDR probe does not create any success observation even if byte arithmetic is computed',()=>{
  const s={...freshDc10(),offload:'LPDDR' as const,offloadPathSupported:false};
  const r=dc10Probe(dc10Order[1],s);
  expect(r.evidence).toBeNull();expect(r.display).toContain('OFFLOAD_PATH_UNSUPPORTED');
 });
 const positive:[Dc10SceneId,Dc10Evidence[],string][]=[
  [dc10Order[0],['roof-10-100','roof-80-100','roof-10-200','roof-80-200'],'min-compute-memory'],
  [dc10Order[1],['resident-model','kv-16-1','kv-16-4','kv-offload'],'kv-by-kv-heads'],
  [dc10Order[2],['pue-14-1000','pue-12-1000','pue-12-1500'],'pue-is-energy-not-speed'],
  [dc10Order[3],['shared-switch-no-route','backup-disconnected','configured-but-local-state','back-route-recoverable'],'route-state-policy-needed']
 ];
 for(const [scene,evidence,correct] of positive){
  it(scene+' needs four/three physically observed positives and WHY; no forced wrong attempt',()=>{
   expect(dc10RequiredEvidence(scene)).toEqual(evidence);
   expect(gradeDc10(scene,evidence,correct).passed).toBe(true);
   expect(gradeDc10(scene,[],correct).passed).toBe(false);
   for(const k of evidence)expect(gradeDc10(scene,evidence.filter(x=>x!==k),correct).passed).toBe(false);
   for(const m of ['m1','m2','m3'] as const){
    const r=gradeDc10(scene,evidence,m);expect(r.passed).toBe(false);expect(r.misconception).toBe(m);
   }
  });
 }
});
