/** A05 N04 five original educational models. Deliberately qualitative: no production NAND/eSSD performance claim. */
export const nand04SceneOrder=['nand-threshold','nand-page-block','ssd-ftl-reliability','nvme-transfer','ai-datacenter-pipeline'] as const;
export type Nand04SceneId=typeof nand04SceneOrder[number];
export type NandCellState='low'|'high';
export type NandPower='on'|'off';
export type NandPageStage='initial'|'updated'|'collected';
export type NandTransportStage='command'|'read-data'|'to-gpu';
export type NandAiStage='cold-load'|'resident-infer'|'checkpoint';
export type Nand04EventType='scene.enter'|'prediction.recorded'|'parameter.changed'|'answer.checked'|'hint.opened'|'voice.requested';
export type Nand04Event={sceneId:Nand04SceneId;type:Nand04EventType;payload?:Record<string,unknown>};
export type Nand04Condition={label:string;passed:boolean;help:string};
export type Nand04Grade={passed:boolean;conditions:Nand04Condition[];misconception:string|null};
export type Nand04State={
 cell:NandCellState;readV:0.3|1|2;power:NandPower;
 pageStage:NandPageStage;writePattern:'hot'|'cold';ecc:boolean;plp:boolean;dramCache:boolean;
 transport:NandTransportStage;ai:NandAiStage;servers:1|2;
 pageHistory:string[];transportHistory:string[];episode:number;lastCode:Nand04TxnCode;
};
export const nand04Fresh=():Nand04State=>({
 cell:'low',readV:1,power:'on',pageStage:'initial',writePattern:'cold',ecc:false,plp:false,dramCache:false,
 transport:'command',ai:'cold-load',servers:1,pageHistory:[],transportHistory:[],episode:0,lastCode:'RESET'
});
/** Toy threshold levels used to illustrate how a saved charge affects Vt. Not MLC/TLC sensing physics. */
export function nand04Threshold(cell:NandCellState,readV:number,power:NandPower){
 const vt=cell==='low'?0.5:1.5;
 return {vt,readV,power,reading:power==='off'?'not-readable' as const:readV>=vt?'on' as const:'off' as const,
  retainedCell:cell,description:'retention toy assumes stored charge stable over one short power cycle; read operation requires power'};
}
/** Explicit causal transaction FSM; no unordered event-visit grading. A RESET starts a new episode. */
export type Nand04TxnCode='RESET'|'OK_INIT'|'OK_WRITE_B'|'OK_GC'|'OK_READ_REQUEST'|'OK_DMA_COMPLETE'|'OK_GPU_COPY'|'ORDER_ERROR'|'NO_VALID_NEW_PAGE'|'NO_REQUEST'|'DATA_NOT_READY'|'GPU_UNSUPPORTED';
export type Nand04TxnAction='initial'|'updated'|'collected'|'command'|'read-data'|'to-gpu'|'reset';
export interface Nand04TxnOutcome{accepted:boolean;code:Nand04TxnCode;history:string[];phase:string;reset:boolean;explanation:string}
const pageFlow=['initial','updated','collected'] as const;
const transportFlow=['command','read-data','to-gpu'] as const;
export function nand04ValidFlow(kind:'page'|'transport',seen:readonly string[]):boolean{
 const flow=kind==='page'?pageFlow:transportFlow;
 return flow.every((x,i)=>seen[i]===x)&&seen.length===flow.length;
}
export function nand04Advance(kind:'page'|'transport',previous:readonly string[],action:Nand04TxnAction,gpuSupported=true):Nand04TxnOutcome{
 const flow=kind==='page'?pageFlow:transportFlow;
 const history=[...previous];
 if(action==='reset')return{accepted:true,code:'RESET',history:[],phase:'idle',reset:true,explanation:'새 실험입니다. 이전 관찰 증거와 물리 상태를 모두 초기화했어요.'};
 if(!flow.includes(action as never))return{accepted:false,code:'ORDER_ERROR',history,phase:history.at(-1)||'idle',reset:false,explanation:'다른 장면의 물리 행동을 현재 실험에 적용할 수 없어요.'};
 // Explicit new A page initialization or new host READ command starts a new transaction;
 // prior achieved milestones must not be carried into a restarted episode.
 if(action===flow[0])return {accepted:true,code:kind==='page'?'OK_INIT':'OK_READ_REQUEST',history:[action],phase:action,reset:true,
  explanation:kind==='page'?'새 LBA7=A 물리 페이지를 준비했어요. 이전 B/GC 증거는 초기화됩니다.':'새 NVMe READ 명령을 발행했어요. 이전 DMA/GPU 데이터 증거는 초기화됩니다.'};
 if(action===flow[1]&&history.length===1&&history[0]===flow[0])return {accepted:true,code:kind==='page'?'OK_WRITE_B':'OK_DMA_COMPLETE',history:[...history,action],phase:action,reset:false,
  explanation:kind==='page'?'새 물리 B 페이지가 유효해지고 옛 A가 invalid로 바뀌었어요.':'READ 명령을 받은 뒤 SSD→host DDR DMA 데이터를 완료했어요.'};
 if(action===flow[2]&&history.length===2&&history[0]===flow[0]&&history[1]===flow[1]){
  if(kind==='transport'&&!gpuSupported)return{accepted:false,code:'GPU_UNSUPPORTED',history,phase:history.at(-1)||'idle',reset:false,explanation:'선택한 플랫폼은 별도 host DDR→GPU 복사를 지원하지 않는 모형입니다.'};
  return {accepted:true,code:kind==='page'?'OK_GC':'OK_GPU_COPY',history:[...history,action],phase:action,reset:false,
   explanation:kind==='page'?'새 B 매핑을 확인하고 옛 A만 있는 블록을 안전하게 erase했어요.':'host DDR에 데이터가 도착한 뒤 별도 GPU 전송을 완료했어요.'};
 }
 const code:Nand04TxnCode=kind==='page'?action==='collected'?'NO_VALID_NEW_PAGE':'ORDER_ERROR'
  :action==='read-data'?'NO_REQUEST':'DATA_NOT_READY';
 return {accepted:false,code,history,phase:history.at(-1)||'idle',reset:false,
  explanation:kind==='page'?action==='collected'?'NO_VALID_NEW_PAGE: 새 B를 확정하지 않았으므로 GC는 거부됩니다. 페이지 A를 보존해요.':'이전 A 준비/새 페이지 B 프로그램 순서를 먼저 완료하세요.'
  :action==='read-data'?'NO_REQUEST: NVMe READ 명령 없이 SSD DMA payload를 완료할 수 없어요.':'DATA_NOT_READY: host DDR로 READ payload가 도착하기 전에 GPU 복사를 완료할 수 없어요.'};
}
export type ToyPage={block:0|1;page:0|1|2|3;status:'empty'|'valid'|'invalid';lba:number|null;revision:string|null};
/** Two blocks of four pages; old valid page never overwritten in-place, GC only erases after mapping moved. */
export function nand04Pages(stage:NandPageStage,history:readonly string[]=[]):{pages:ToyPage[];mapping:{LBA7:string};erasedBlock0:boolean;code:string}{
 const verified=history[0]==='initial'&&(stage==='initial'||(history[1]==='updated'&&(stage==='updated'||(stage==='collected'&&history[2]==='collected'))));
 const resolved:NandPageStage=verified?stage:'initial';
 const pages=Array.from({length:8},(_,i)=>({
  block:(Math.floor(i/4) as 0|1),page:(i%4 as 0|1|2|3),
  status:'empty' as ToyPage['status'],lba:null as number|null,revision:null as string|null
 }));
 const old=pages[0];old.status=resolved==='initial'?'valid':'invalid';old.lba=7;old.revision='A';
 if(resolved!=='initial'){const newer=pages[4];newer.status='valid';newer.lba=7;newer.revision='B';}
 if(resolved==='collected'){old.status='empty';old.lba=null;old.revision=null;}
 return {pages,mapping:{LBA7:resolved==='initial'?'B0:P0 / A':'B1:P0 / B'},erasedBlock0:resolved==='collected',code:verified?'VALID_SNAPSHOT':'NO_VALID_NEW_PAGE'};
}
export function nand04Ssd(writePattern:'hot'|'cold',ecc:boolean,plp:boolean,dramCache:boolean){
 return {lba:'LBA7',physical:writePattern==='hot'?'remapped to fresh page (toy)':'mapped stable page (toy)',
  wearIndicator:writePattern==='hot'?'more rewrites; wear-leveling matters':'fewer rewrites (toy)',
  eccClaim:ecc?'ECC selected; correctable errors only, not perfect':'ECC card unselected (toy comparison)',
  plpClaim:plp?'example product with optional PLP protection':'example product without PLP; not all eSSD provide it',
  dramClaim:dramCache?'controller cache DRAM present in chosen design':'DRAMless designs also exist',
  absoluteReliabilityGuaranteed:false,measuredEndurance:false};
}
export function nand04Transport(stage:NandTransportStage,history:readonly string[]=[]){
 const command=history[0]==='command',dma=command&&history[1]==='read-data';
 if(stage==='command'&&!command)return {from:'Host queue',via:'awaiting READ',to:'SSD idle',label:'No READ request yet',kind:'idle' as const,detail:'student has not issued a command; no DMA payload exists'};
 if(stage==='read-data'&&!command)return {from:'Host queue',via:'not submitted',to:'NO_REQUEST',label:'DMA blocked: NO_REQUEST',kind:'blocked' as const,detail:'READ command not submitted'};
 if(stage==='to-gpu'&&!dma)return {from:'Host DDR empty',via:'no DMA',to:'DATA_NOT_READY',label:'GPU copy blocked',kind:'blocked' as const,detail:'host DDR read payload not ready'};
 if(stage==='command')return {from:'Host software/queue',via:'PCIe',to:'SSD controller → NAND media',
  label:'NVMe READ command',kind:'command' as const,detail:'host requests work; this is not a read payload'};
 if(stage==='read-data')return {from:'NAND → SSD controller',via:'PCIe DMA',to:'host DDR',
  label:'READ payload',kind:'data' as const,detail:'device-to-host memory direction, not CPU per-byte copy'};
 return {from:'host DDR',via:'platform PCIe transfer',to:'GPU GDDR/HBM when supported',
  label:'later separate GPU transfer',kind:'separate' as const,detail:'not universally SSD→GPU HBM direct'};
}
export function nand04Ai(stage:NandAiStage,servers:1|2){
 const common={servers,network:servers===2?'inter-node network/NIC required in example':'inter-node network not required in this toy',realTiming:false};
 if(stage==='cold-load')return {...common,source:'SSD persistent model',sequence:['SSD/NAND','host DDR','GPU memory','GPU compute','response'],bottleneck:'initial storage/model load may matter'};
 if(stage==='resident-infer')return {...common,source:'already resident GPU model',sequence:['GPU memory','GPU compute','response'],bottleneck:'no full-model SSD read per token by default'};
 return {...common,source:'training/checkpoint',sequence:['GPU compute','GPU memory','host DDR','SSD persistent checkpoint'],bottleneck:'checkpoint write/endurance and distributed network may matter'};
}
const required:Record<Nand04SceneId,readonly string[]>={
 'nand-threshold':['low','high','power-cycle'],
 'nand-page-block':['initial','updated','collected'],
 'ssd-ftl-reliability':['hot','cold','ecc-option','plp-option'],
 'nvme-transfer':['command','read-data','to-gpu'],
 'ai-datacenter-pipeline':['cold-load','resident-infer','checkpoint','two-servers']
};
const correct:Record<Nand04SceneId,string>={
 'nand-threshold':'retention-vs-read',
 'nand-page-block':'page-vs-block',
 'ssd-ftl-reliability':'ftl-feature-options',
 'nvme-transfer':'command-dma-staging',
 'ai-datacenter-pipeline':'resident-vs-cold'
};
const errorIds:Record<Nand04SceneId,readonly [string,string,string]>={
 'nand-threshold':['m1','m2','m3'],
 'nand-page-block':['m1','m2','m3'],
 'ssd-ftl-reliability':['ssd-plp-universal','ssd-dram-universal','ecc-perfect'],
 'nvme-transfer':['m1','m2','m3'],
 'ai-datacenter-pipeline':['m1','m2','m3']
};
/** Wrong choice produces only its keyed misconception response after learner trial. */
export function gradeNand04(id:Nand04SceneId,seen:readonly string[],answer:string|null):Nand04Grade{
 const causal=id==='nand-page-block'?nand04ValidFlow('page',seen):id==='nvme-transfer'?nand04ValidFlow('transport',seen):true;
 const conditions:Nand04Condition[]=[
  ...(['nand-page-block','nvme-transfer'].includes(id)?[{label:'ordered-causal-evidence',passed:causal,help:'먼저 초기화한 뒤 원인→결과 순서대로 완료해야 해요. 역순/조기 실행은 증거가 아니에요.'}]:[]),
  ...required[id].map(x=>({label:x,passed:seen.includes(x),help:'실험 조건 '+x+'을 직접 조작해 비교해 보세요.'})),
  {label:'설명/오개념 구별',passed:answer===correct[id],help:'관찰 근거에 부합하는 원리 설명을 선택하세요.'}
 ];
 return {passed:conditions.every(c=>c.passed),conditions,
  misconception:answer!==null&&(errorIds[id] as readonly string[]).includes(answer)?answer:null};
}
