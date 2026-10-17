/** A05 Lesson09: deliberately fictional NAND/eSSD teaching math, never real device warranties. */
export const ssd09Order=['nand-cell-voltage-windows','ssd-write-amplification','ssd-plp-power-loss','essd-dwpd-tail-latency'] as const;
export type Ssd09Id=typeof ssd09Order[number];
export type BitsPerCell=1|3|4;
export type Noise=0|0.08;
export type OpPercent=10|20;
export type Relocated=0|0.6;
export type LatencySet='A'|'B';
export type Ssd09Event={sceneId:Ssd09Id;type:'scene.enter'|'prediction.recorded'|'parameter.changed'|'answer.checked'|'hint.opened'|'voice.requested';payload?:Record<string,unknown>};
export interface Ssd09State {
 bits:BitsPerCell;noise:Noise;op:OpPercent;gc:boolean;relocated:Relocated;
 plp:PlpTrial;latency:LatencySet;sorted:boolean;selectedRank:number|null;queueDepth:1|8;
}
export const fresh09=():Ssd09State=>({bits:1,noise:0,op:10,gc:false,relocated:0,plp:newPlpTrial(),latency:'A',sorted:false,selectedRank:null,queueDepth:1});
export const round09=(n:number,places=6)=>Number(n.toFixed(places));
export function voltageWindows(bits:BitsPerCell,noise:Noise){
 const centers=2**bits,gaps=centers-1,centerGap=1/gaps;
 const positions=Array.from({length:centers},(_,i)=>round09(i*centerGap,9));
 return {bits,centers,gaps,centerGap:round09(centerGap),positions,noise,
  extent:1 as const,canOverlapInToy:2*noise>=centerGap,
  disclaimer:'equally spaced threshold centers, NOT measured NAND Vt distribution, endurance or BER'};
}
export function ssdWaf(relocated:Relocated,op:OpPercent,gc:boolean){
 const hostGiB=1,validMoveGiB=gc?relocated:0;
 const physicalNandGiB=hostGiB+validMoveGiB,waf=physicalNandGiB/hostGiB;
 return {hostGiB,validMoveGiB,physicalNandGiB,waf:round09(waf),opPercent:op,gc,
  opToWafFormula:false,validPagesPreserved:true,measuredLifetime:false};
}
/** Safe ordered ACK, flush, media commit and power loss: a set of visited labels is never sufficient. */
export type PlpPhase='idle'|'host-write'|'ack'|'flush-issued'|'flush-completed'|'media-committed'|'power-lost';
export type PlpAckMode='volatileCache'|'afterMediaCommit';
export type PlpEvidence='durable-under-declared-policy'|'at-risk'|'energetically-possible-unverified'|'energy-insufficient'|'pending-contract';
export type PlpAction='write'|'ack'|'flush-issue'|'flush-complete'|'media-commit'|'power-loss'|'reset'|'fua-complete';
export type PlpCode='RESET'|'OK_WRITE'|'OK_ACK'|'OK_FLUSH_ISSUED'|'OK_FLUSH_COMPLETED'|'OK_COMMIT'|'OK_POWER_LOSS'|'OK_FUA_COMPLETED'|'INVALID_ORDER'|'NO_PENDING_WRITE'|'NOT_FLUSH_ISSUED'|'MEDIA_COMMIT_REQUIRED';
export interface PlpTrial{
 phase:PlpPhase;events:PlpAction[];ack:boolean;mediaCommitted:boolean;flush:'none'|'issued'|'completed';
 fuaCompleted:boolean;volatileCache:boolean;ackMode:PlpAckMode;plpEnabled:boolean;remainingWorkJ:0.4|1.2;
 energyAvailableJ:number;powerLost:boolean;powerLossVerdict:PlpEvidence|null;lastCode:PlpCode;episode:number;
}
export function newPlpTrial(overrides:Partial<PlpTrial>={}):PlpTrial{
 return {phase:'idle',events:[],ack:false,mediaCommitted:false,flush:'none',fuaCompleted:false,
 volatileCache:true,ackMode:'volatileCache',plpEnabled:false,remainingWorkJ:1.2,energyAvailableJ:0.6,powerLost:false,powerLossVerdict:null,lastCode:'RESET',episode:0,...overrides};
}
export function plpEnergy(work:0.4|1.2){
 const nominalJ=.5*.1*(25-9),idealSeconds=nominalJ/8,usableJ=nominalJ*.75;
 return {capacitorF:.1,vHigh:5,vLow:3,powerW:8,nominalJ:round09(nominalJ),
  idealSeconds:round09(idealSeconds),usableJ:round09(usableJ),pendingWorkJ:work,
  enoughToyEnergy:usableJ>=work,actualDeviceDurabilityGuaranteed:false};
}
export interface PlpResult{accepted:boolean;code:PlpCode;trial:PlpTrial;message:string;evidence:PlpEvidence;}
/** Device settings are immutable once a WRITE has begun; a power loss cannot be relabelled post-hoc. */
export function plpConfigure(old:PlpTrial,change:Partial<Pick<PlpTrial,'volatileCache'|'ackMode'|'plpEnabled'|'remainingWorkJ'>>){
 if(old.phase!=='idle'||old.events.length>0||old.powerLost)return {accepted:false as const,code:'CONFIG_LOCKED' as const,trial:old,message:'이미 시작했거나 정전된 트랜잭션은 설정을 소급 변경할 수 없습니다. RESET 후 새 실험을 시작하세요.'};
 return {accepted:true as const,code:'CONFIG_OK' as const,trial:{...old,...change},message:'새 쓰기 전에 캐시/ACK 정책/PLP 하드웨어 설정을 고정했습니다.'};
}
export function plpOutcome(t:PlpTrial):PlpEvidence{
 if(t.powerLost&&t.powerLossVerdict!==null)return t.powerLossVerdict;
 if(t.mediaCommitted||t.flush==='completed'||t.fuaCompleted)return 'durable-under-declared-policy';
 if(t.powerLost){
  if(!t.volatileCache)return 'pending-contract';
  if(!t.plpEnabled)return 'at-risk';
  return plpEnergy(t.remainingWorkJ).enoughToyEnergy?'energetically-possible-unverified':'energy-insufficient';
 }
 return 'pending-contract';
}
export function plpAdvance(old:PlpTrial,action:PlpAction):PlpResult{
 const t:{[K in keyof PlpTrial]:PlpTrial[K]}={...old,events:[...old.events]};
 function result(accepted:boolean,code:PlpCode,message:string):PlpResult{
  if(accepted){t.lastCode=code;if(action!=='reset')t.events.push(action);}
  return {accepted,code,trial:t,message,evidence:plpOutcome(t)};
 }
 if(action==='reset')return {accepted:true,code:'RESET',trial:newPlpTrial({volatileCache:t.volatileCache,ackMode:t.ackMode,plpEnabled:t.plpEnabled,remainingWorkJ:t.remainingWorkJ,episode:t.episode+1}),message:'새 실험: 이전 ACK/flush/commit/전원손실 증거를 모두 초기화했습니다.',evidence:'pending-contract'};
 if(t.powerLost)return result(false,'INVALID_ORDER','정전이 이미 발생했습니다. 새 트랜잭션 시작을 눌러야 합니다.');
 if(action==='write'){
  if(t.phase!=='idle')return result(false,'INVALID_ORDER','기존 쓰기 작업이 진행 중입니다. 새 실험으로 초기화해 주세요.');
  t.phase='host-write';return result(true,'OK_WRITE','호스트 쓰기 요청이 컨트롤러에 도착했습니다. 아직 ACK/저장 완료를 의미하지 않습니다.');
 }
 if(t.phase==='idle')return result(false,'NO_PENDING_WRITE','아직 호스트 WRITE가 없어 ACK/flush/commit/정전 사건을 유효한 쓰기와 연결할 수 없습니다.');
 if(action==='ack'){
  if(t.ack)return result(false,'INVALID_ORDER','같은 요청의 ACK는 이미 확인했습니다.');
  if(t.ackMode==='afterMediaCommit'&&!t.mediaCommitted)return result(false,'MEDIA_COMMIT_REQUIRED','afterMediaCommit ACK 정책: NAND media commit 전에 ACK를 낼 수 없습니다. 먼저 별도 media COMMIT 사건이 필요합니다.');
  t.ack=true;t.phase='ack';return result(true,'OK_ACK',t.ackMode==='afterMediaCommit'?'가상 afterMediaCommit 계약의 ACK: 이미 NAND media commit을 확인했습니다.':'휘발 캐시 정책의 ACK: 이는 비휘발 NAND media commit 보장이 아닙니다.');
 }
 if(action==='flush-issue'){
  if(!t.ack||t.flush!=='none')return result(false,'INVALID_ORDER','Flush는 ACK 이후 한 번 요청하는 사건입니다.');
  t.flush='issued';t.phase='flush-issued';return result(true,'OK_FLUSH_ISSUED','Flush ISSUED: 완료되지 않은 flush는 저장 보증이 아닙니다.');
 }
 if(action==='flush-complete'){
  if(t.flush!=='issued')return result(false,'NOT_FLUSH_ISSUED','Flush ISSUED 사건이 선행돼야 COMPLETED가 가능합니다.');
  t.flush='completed';t.mediaCommitted=true;t.phase='flush-completed';return result(true,'OK_FLUSH_COMPLETED','Flush COMPLETED (가정한 기기 계약 범위): media commit 완료.');
 }
 if(action==='fua-complete'){
  t.fuaCompleted=true;t.mediaCommitted=true;t.phase='media-committed';
  return result(true,'OK_FUA_COMPLETED','FUA WRITE COMPLETED under declared supported policy; media durable in this toy.');
 }
 if(action==='media-commit'){
  t.mediaCommitted=true;t.phase='media-committed';
  return result(true,'OK_COMMIT','비휘발 NAND에 commit 완료 (가상 장치 정책상 보존).');
 }
 t.powerLost=true;t.phase='power-lost';t.powerLossVerdict=plpOutcome(t);
 return result(true,'OK_POWER_LOSS',t.mediaCommitted?'commit 뒤 정전: 가상 media 데이터 보존.':
  t.plpEnabled?'ACK와 정전 사이 보호를 계산하더라도 보호 에너지 충분함만으로 완전 commit을 보증할 수 없습니다.':
  'ACK가 났더라도 휘발 캐시의 NAND commit 전 정전이면 영속성 위험이 있습니다.');
}
export type LatencyObservation={set:LatencySet;values:number[];permuted:number[];sorted:number[];meanMs:number;p99Ms:number;maxMs:number;rank99:number;rankMethod:string};
function shuffleDeterministic(sorted:readonly number[]){
 // Mathematical reversible index permutation for n=100; gcd(37,100)=1.
 return sorted.map((_,i)=>sorted[(i*37+17)%sorted.length]);
}
export function latencyModel(set:LatencySet):LatencyObservation{
 const slow=set==='A'?5:1;
 const values=[...Array.from({length:100-slow},()=>1),...Array.from({length:slow},()=>20)];
 const sorted=[...values].sort((a,b)=>a-b);
 return {set,values,permuted:shuffleDeterministic(values),sorted,
  meanMs:round09(values.reduce((a,b)=>a+b,0)/100),rank99:Math.ceil(.99*values.length),
  p99Ms:sorted[98],maxMs:sorted[99],rankMethod:'nearest-rank: ceil(0.99*n) / one-based sorted rank'};
}
export function latencyPick(set:LatencySet,sorted:boolean,index:number){
 const l=latencyModel(set);
 return {valid:sorted&&index===l.rank99,code:!sorted?'UNSORTED_CARD':index===100?'MAX_NOT_P99':index!==99?'WRONG_RANK':'OK_RANK_99',
  valueMs:sorted?l.sorted[index-1]??null:l.permuted[index-1]??null,p99Ms:l.p99Ms};
}
export function ssdEndurance(capacityTb=2,dwpd=1,years=5){
 const days=365*years,writeTb=capacityTb*dwpd*days;
 return {capacityTb,dwpd,years,days,writeTb,writePbDecimal:writeTb/1000,readsNotIncluded:true,deviceWarranty:false};
}
const keys:Record<Ssd09Id,readonly string[]>={
 'nand-cell-voltage-windows':['SLC','TLC','QLC','noise0','noise08'],
 'ssd-write-amplification':['base','move','op10','op20'],
 'ssd-plp-power-loss':['risk','commit','flush-issued','flush-completed','plp-enough','plp-not-enough'],
 'essd-dwpd-tail-latency':['A-sorted-99','B-sorted-99','A-mean','B-mean','dwpd']
};
const correct:Record<Ssd09Id,string>={
 'nand-cell-voltage-windows':'centers-gap-15',
 'ssd-write-amplification':'host-vs-nand-waf',
 'ssd-plp-power-loss':'ack-is-not-media-commit',
 'essd-dwpd-tail-latency':'nearest-rank-and-dwpd'
};
export interface Ssd09Grade{passed:boolean;misconception:string|null;conditions:{key:string;passed:boolean;help:string}[]}
export function gradeSsd09(id:Ssd09Id,seen:readonly string[],answer:string|null):Ssd09Grade{
 const conditions=[...keys[id].map(key=>({key,passed:seen.includes(key),help:key+' 조건을 직접 유효한 인과 순서로 관찰하세요.'})),
 {key:'WHY',passed:answer===correct[id],help:'관찰과 일치하는 원리를 설명하세요.'}];
 return {passed:conditions.every(x=>x.passed),misconception:answer!==null&&['m1','m2','m3'].includes(answer)?answer:null,conditions};
}
