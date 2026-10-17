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
};
export const nand04Fresh=():Nand04State=>({
 cell:'low',readV:1,power:'on',pageStage:'initial',writePattern:'cold',ecc:false,plp:false,dramCache:false,
 transport:'command',ai:'cold-load',servers:1
});
/** Toy threshold levels used to illustrate how a saved charge affects Vt. Not MLC/TLC sensing physics. */
export function nand04Threshold(cell:NandCellState,readV:number,power:NandPower){
 const vt=cell==='low'?0.5:1.5;
 return {vt,readV,power,reading:power==='off'?'not-readable' as const:readV>=vt?'on' as const:'off' as const,
  retainedCell:cell,description:'retention toy assumes stored charge stable over one short power cycle; read operation requires power'};
}
export type ToyPage={block:0|1;page:0|1|2|3;status:'empty'|'valid'|'invalid';lba:number|null;revision:string|null};
/** Two blocks of four pages; old valid page never overwritten in-place, GC only erases after mapping moved. */
export function nand04Pages(stage:NandPageStage):{pages:ToyPage[];mapping:{LBA7:string};erasedBlock0:boolean}{
 const pages=Array.from({length:8},(_,i)=>({
  block:(Math.floor(i/4) as 0|1),page:(i%4 as 0|1|2|3),
  status:'empty' as ToyPage['status'],lba:null as number|null,revision:null as string|null
 }));
 const old=pages[0];old.status=stage==='initial'?'valid':'invalid';old.lba=7;old.revision='A';
 if(stage!=='initial'){const newer=pages[4];newer.status='valid';newer.lba=7;newer.revision='B';}
 if(stage==='collected'){old.status='empty';old.lba=null;old.revision=null;}
 return {pages,mapping:{LBA7:stage==='initial'?'B0:P0 / A':'B1:P0 / B'},erasedBlock0:stage==='collected'};
}
export function nand04Ssd(writePattern:'hot'|'cold',ecc:boolean,plp:boolean,dramCache:boolean){
 return {lba:'LBA7',physical:writePattern==='hot'?'remapped to fresh page (toy)':'mapped stable page (toy)',
  wearIndicator:writePattern==='hot'?'more rewrites; wear-leveling matters':'fewer rewrites (toy)',
  eccClaim:ecc?'ECC selected; correctable errors only, not perfect':'ECC card unselected (toy comparison)',
  plpClaim:plp?'example product with optional PLP protection':'example product without PLP; not all eSSD provide it',
  dramClaim:dramCache?'controller cache DRAM present in chosen design':'DRAMless designs also exist',
  absoluteReliabilityGuaranteed:false,measuredEndurance:false};
}
export function nand04Transport(stage:NandTransportStage){
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
 const conditions:Nand04Condition[]=[
  ...required[id].map(x=>({label:x,passed:seen.includes(x),help:'실험 조건 '+x+'을 직접 조작해 비교해 보세요.'})),
  {label:'설명/오개념 구별',passed:answer===correct[id],help:'관찰 근거에 부합하는 원리 설명을 선택하세요.'}
 ];
 return {passed:conditions.every(c=>c.passed),conditions,
  misconception:answer!==null&&(errorIds[id] as readonly string[]).includes(answer)?answer:null};
}
