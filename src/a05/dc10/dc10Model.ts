/** A05 Lesson10 independent, decimal, non-vendor datacenter toy. A06 story blob cc579ef196609aa17a6c573657379b8005e88719. */
export const dc10Order=['ai-roofline-bottleneck','llm-prefill-decode-kv','rack-power-pue-thermal','ai-dc-end-to-end-resilience'] as const;
export type Dc10SceneId=typeof dc10Order[number];
export type Dc10Evidence='roof-10-100'|'roof-80-100'|'roof-10-200'|'roof-80-200'|'kv-4-1'|'kv-16-1'|'kv-16-4'|'kv-offload'|'resident-model'|'pue-14-1000'|'pue-12-1000'|'pue-12-1500'|'shared-switch-no-route'|'backup-disconnected'|'configured-but-local-state'|'back-route-recoverable';
export type Dc10Event={sceneId:Dc10SceneId;type:'scene.enter'|'prediction.recorded'|'parameter.changed'|'observation.recorded'|'answer.checked'|'hint.opened'|'voice.requested';payload?:Record<string,unknown>};
export type Dc10State={
 intensity:10|80;bandwidthGb:100|200;
 contextTokens:4|16;batch:1|4;modelResident:boolean;offload:'none'|'LPDDR';offloadPathSupported:boolean;
 pue:1.4|1.2;throughput:1000|1500;
 servers:1|2;switch1Healthy:boolean;switch2Installed:boolean;switch2Healthy:boolean;
 routeAConnected:boolean;routeBConnected:boolean;routeBConfigured:boolean;
 failoverPolicy:'none'|'retry'|'automatic';sessionState:'localOnly'|'replicated'|'stateless';
 backupWarm:boolean;backupHealthy:boolean;sharedPowerHealthy:boolean;storageReplicaHealthy:boolean;
 jobType:'infer'|'train';checkpointAvailable:boolean;
};
export const freshDc10=():Dc10State=>({
 intensity:10,bandwidthGb:100,contextTokens:4,batch:1,modelResident:true,offload:'none',offloadPathSupported:false,
 pue:1.4,throughput:1000,servers:2,switch1Healthy:true,switch2Installed:false,switch2Healthy:true,
 routeAConnected:true,routeBConnected:false,routeBConfigured:false,failoverPolicy:'none',
 sessionState:'localOnly',backupWarm:false,backupHealthy:true,sharedPowerHealthy:true,storageReplicaHealthy:true,
 jobType:'infer',checkpointAvailable:false
});
const round=(n:number)=>Number(n.toFixed(6));
export function dc10Roofline(intensity:10|80,bandwidthGb:100|200){
 const peakTflops=4,memoryCeilingTflops=intensity*bandwidthGb/1000,ridgeFlopsPerByte=4000/bandwidthGb;
 return {peakTflops,memoryCeilingTflops,ceilingTflops:Math.min(peakTflops,memoryCeilingTflops),
  ridgeFlopsPerByte,bound:memoryCeilingTflops<peakTflops?'memory':'compute',
  theoreticalUpperBoundOnly:true,latencyNotPredicted:true,units:'TFLOP/s' as const};
}
export function dc10KvCache(contextTokens:4|16,batch:1|4,opts?:{offload?:'none'|'LPDDR';offloadPathSupported?:boolean;modelResident?:boolean}){
 const nLayers=2,nKvHeads=2,queryHeads=8,headDim=16,bytesPerElement=2,kvFactor=2;
 const bytes=batch*nLayers*nKvHeads*headDim*contextTokens*bytesPerElement*kvFactor;
 const offload=opts?.offload??'none',pathSupported=opts?.offloadPathSupported??false;
 return {contextTokens,batch,nLayers,nKvHeads,queryHeads,headDim,bytesPerElement,kvFactor,bytes,
  offload,offloadAccepted:offload==='none'||pathSupported,
  modelResident:opts?.modelResident??true,ssdReadRequiredPerGeneratedToken:false,
  prefill:'parallel-prompt-processing',decode:'autoregressive-kv-reuse',
  latencyNumbersNotPredicted:true,realAllocationMayDiffer:true};
}
export function dc10Facility(pue:1.4|1.2,throughput:1000|1500){
 const itPowerMw=1,facilityPowerMw=round(pue*itPowerMw),overheadMw=round(facilityPowerMw-itPowerMw);
 return {pue,itPowerMw,facilityPowerMw,overheadMw,throughput,taskPerSecondPerFacilityMw:round(throughput/facilityPowerMw),
  toySameMeasurementPeriod:true,pueIsEnergyRatioInPractice:true,
  latencyOrGpuUtilizationNotDetermined:true};
}
export type Dc10RecoveryCode='PRIMARY_OK'|'NO_ROUTE'|'ROUTE_NOT_CONFIGURED'|'NO_BACKUP_TARGET'|'NO_SHARED_POWER'|'FAILOVER_DISABLED'|'STATE_NOT_RECOVERABLE'|'REPLICA_UNAVAILABLE'|'CHECKPOINT_REQUIRED'|'RECOVERY_POSSIBLE';
export type Dc10Recovery={code:Dc10RecoveryCode;primaryUsable:boolean;backupPhysical:boolean;backupConfigured:boolean;recoverable:boolean;needsColdStart:boolean;actualRtoUnknown:true};
export function dc10Recovery(s:Readonly<Dc10State>):Dc10Recovery{
 const physical=s.servers===2&&s.switch2Installed&&s.switch2Healthy&&s.routeBConnected&&s.backupHealthy;
 const configured=physical&&s.routeBConfigured;
 const primary=s.sharedPowerHealthy&&s.switch1Healthy&&s.routeAConnected;
 const finish=(code:Dc10RecoveryCode):Dc10Recovery=>({
  code,primaryUsable:primary,backupPhysical:physical,backupConfigured:configured,recoverable:code==='PRIMARY_OK'||code==='RECOVERY_POSSIBLE',
  needsColdStart:code==='RECOVERY_POSSIBLE'&&!s.backupWarm,actualRtoUnknown:true
 });
 if(!s.sharedPowerHealthy)return finish('NO_SHARED_POWER');
 if(primary)return finish('PRIMARY_OK');
 if(s.servers!==2||!s.backupHealthy||!s.switch2Installed||!s.switch2Healthy||!s.routeBConnected)return finish('NO_ROUTE');
 if(!s.routeBConfigured)return finish('ROUTE_NOT_CONFIGURED');
 if(s.failoverPolicy==='none')return finish('FAILOVER_DISABLED');
 if(s.jobType==='train'&&!s.checkpointAvailable)return finish('CHECKPOINT_REQUIRED');
 if(s.sessionState==='localOnly')return finish('STATE_NOT_RECOVERABLE');
 if(s.sessionState==='replicated'&&!s.storageReplicaHealthy)return finish('REPLICA_UNAVAILABLE');
 return finish('RECOVERY_POSSIBLE');
}
/** Separate cable existence from live forwarding. Never color an absent/faulted cable as a working route.
 * 'standby' is wired + configured but not recovered (policy/session/state may still block).
 * These tokens drive the original SVG and are regression-tested against dc10Recovery. */
export type Dc10DiagramLink='open'|'fault'|'unconfigured'|'standby'|'active';
export function dc10DiagramLinks(s:Readonly<Dc10State>):{primary:Dc10DiagramLink;backup:Dc10DiagramLink;primaryCablePresent:boolean;backupCablePresent:boolean}{
 const verdict=dc10Recovery(s);
 const primaryCablePresent=s.routeAConnected;
 const backupCablePresent=s.servers===2&&s.switch2Installed&&s.routeBConnected;
 const primary:Dc10DiagramLink=!primaryCablePresent?'open':
  !s.switch1Healthy||!s.sharedPowerHealthy?'fault':'active';
 const backup:Dc10DiagramLink=!backupCablePresent?'open':
  !s.switch2Healthy||!s.backupHealthy||!s.sharedPowerHealthy?'fault':
  !s.routeBConfigured?'unconfigured':
  verdict.code==='RECOVERY_POSSIBLE'?'active':'standby';
 return {primary,backup,primaryCablePresent,backupCablePresent};
}
/** Proof keys are minted only when learner explicitly probes a physical state.
 * No invalid/backtracking toggle alone can manufacture route recovery evidence. */
export function dc10Probe(scene:Dc10SceneId,s:Readonly<Dc10State>):{evidence:Dc10Evidence|null;display:string;result:unknown}{
 if(scene==='ai-roofline-bottleneck'){
  const v=dc10Roofline(s.intensity,s.bandwidthGb);
  return {evidence:('roof-'+s.intensity+'-'+s.bandwidthGb) as Dc10Evidence,display:'가상 roofline '+v.ceilingTflops+' TFLOP/s (상한, 실속도 아님)',result:v};
 }
 if(scene==='llm-prefill-decode-kv'){
  const v=dc10KvCache(s.contextTokens,s.batch,{offload:s.offload,offloadPathSupported:s.offloadPathSupported,modelResident:s.modelResident});
  if(!v.offloadAccepted)return {evidence:null,display:'OFFLOAD_PATH_UNSUPPORTED: 지원/설정 없는 LPDDR 이동은 불가합니다.',result:v};
  const key=s.offload==='LPDDR'?'kv-offload':s.modelResident&&s.contextTokens===4&&s.batch===1?'resident-model':
   ('kv-'+s.contextTokens+'-'+s.batch) as Dc10Evidence;
  return {evidence:key,display:'관찰한 KV 예시 '+v.bytes+' B, modelResident='+v.modelResident+', offload='+v.offload,result:v};
 }
 if(scene==='rack-power-pue-thermal'){
  const v=dc10Facility(s.pue,s.throughput);
  const ev=s.pue===1.4?'pue-14-1000':s.throughput===1500?'pue-12-1500':'pue-12-1000';
  return {evidence:ev,display:'가상 전체 '+v.facilityPowerMw+' MW, 설비초과 '+v.overheadMw+' MW, 별도 처리량 '+v.throughput+' tasks/s',result:v};
 }
 const v=dc10Recovery(s);
 let ev:Dc10Evidence|null=null;
 if(!s.switch1Healthy&&s.servers===2&&!s.switch2Installed&&v.code==='NO_ROUTE')ev='shared-switch-no-route';
 else if(!s.switch1Healthy&&s.switch2Installed&&!s.routeBConnected&&v.code==='NO_ROUTE')ev='backup-disconnected';
 else if(!s.switch1Healthy&&v.code==='STATE_NOT_RECOVERABLE')ev='configured-but-local-state';
 else if(!s.switch1Healthy&&v.code==='RECOVERY_POSSIBLE')ev='back-route-recoverable';
 return {evidence:ev,display:v.code+(v.needsColdStart?' · backup model cold-start possible, RTO unknown':''),result:v};
}
const criteria:Record<Dc10SceneId,readonly Dc10Evidence[]>={
 'ai-roofline-bottleneck':['roof-10-100','roof-80-100','roof-10-200','roof-80-200'],
 'llm-prefill-decode-kv':['resident-model','kv-16-1','kv-16-4','kv-offload'],
 'rack-power-pue-thermal':['pue-14-1000','pue-12-1000','pue-12-1500'],
 'ai-dc-end-to-end-resilience':['shared-switch-no-route','backup-disconnected','configured-but-local-state','back-route-recoverable']
};
const answers:Record<Dc10SceneId,string>={
 'ai-roofline-bottleneck':'min-compute-memory',
 'llm-prefill-decode-kv':'kv-by-kv-heads',
 'rack-power-pue-thermal':'pue-is-energy-not-speed',
 'ai-dc-end-to-end-resilience':'route-state-policy-needed'
};
export type Dc10Grade={passed:boolean;misconception:null|'m1'|'m2'|'m3';conditions:{key:string;passed:boolean;help:string}[]};
export function gradeDc10(scene:Dc10SceneId,evidence:readonly Dc10Evidence[],answer:string|null):Dc10Grade{
 const conditions=[...criteria[scene].map(key=>({key,passed:evidence.includes(key),help:'아직 확인하지 않은 실험 조건: '+key})),
  {key:'WHY',passed:answer===answers[scene],help:'검증한 관찰에 맞는 물리적 원인을 선택하세요.'}];
 return {passed:conditions.every(c=>c.passed),misconception:answer==='m1'||answer==='m2'||answer==='m3'?answer:null,conditions};
}
export function dc10RequiredEvidence(scene:Dc10SceneId){return criteria[scene];}
