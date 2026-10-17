/** A05 Lesson16: deterministic teaching models, NOT silicon product timing or measured data. */
export const logic16Order=['logic-nand-nor-truth-table','combinational-vs-sequential-memory','d-latch-vs-d-flip-flop','setup-hold-metastability-clock'] as const;
export type Logic16SceneId=typeof logic16Order[number];
export type GateType='NAND'|'NOR';export type Bit=0|1;
export type Network='series'|'parallel'|'unset';
export interface Logic16State{
 gate:GateType;a:Bit;b:Bit;pun:Network;pdn:Network;
 d:Bit;g:Bit;powered:boolean;q:Bit|null;
 eventIndex:number;initialHigh:boolean;
 period:8|9;buffer:boolean;hazard:boolean;
}
export type Logic16Event={sceneId:Logic16SceneId;type:'scene.enter'|'prediction.recorded'|'parameter.changed'|'answer.checked'|'hint.opened'|'voice.requested';payload?:Record<string,unknown>};
export interface Logic16Grade{passed:boolean;misconception:string|null;conditions:{key:string;passed:boolean;help:string}[]}
export const logic16Fresh=():Logic16State=>({gate:'NAND',a:0,b:0,pun:'unset',pdn:'unset',
 d:0,g:0,powered:true,q:0,eventIndex:0,initialHigh:false,period:8,buffer:false,hazard:false});
export function gateLogic(gate:GateType,a:Bit,b:Bit):Bit{
 return gate==='NAND'?(a===1&&b===1?0:1):(a===0&&b===0?1:0);
}
export function gateTopology(gate:GateType){
 return gate==='NAND'?{pun:'parallel' as const,pdn:'series' as const}:{pun:'series' as const,pdn:'parallel' as const};
}
export function evaluateNetwork(gate:GateType,pun:Network,pdn:Network){
 const topology=gateTopology(gate);
 return {correct:pun===topology.pun&&pdn===topology.pdn,
  selected:pun!=='unset'&&pdn!=='unset',state:'stable ideal complementary CMOS, after settling; analog glitch/leakage outside toy'};
}
/** Deliberate counterexample: NAND(NAND(1,1),0)=1 but three-input NAND(1,1,0)=1? 
 * choose A=1 B=0 C=1: nested=0, 3-input=1. */
export function nestedNand(a:Bit,b:Bit,c:Bit){
 const nested=gateLogic('NAND',gateLogic('NAND',a,b),c);
 const triple=(a===1&&b===1&&c===1?0:1) as Bit;
 return {nested,triple,equals:nested===triple};
}
export interface LatchState{d:Bit;g:Bit;q:Bit|null;powered:boolean}
/** Plain CMOS positive level latch; powered off loses valid state, no auto recovery. */
export function latchStep(s:LatchState,action:{type:'init';bit:Bit}|{type:'d';bit:Bit}|{type:'g';bit:Bit}|{type:'off'}|{type:'on'}):LatchState{
 if(action.type==='off')return {...s,powered:false,q:null,g:0};
 if(action.type==='on')return {...s,powered:true,q:null,g:0};
 if(action.type==='init')return s.powered?{...s,q:action.bit,g:0}:s;
 if(action.type==='d'){const next={...s,d:action.bit};return {...next,q:s.powered&&s.g===1?action.bit:s.q};}
 const next={...s,g:action.bit};return {...next,q:s.powered&&action.bit===1?s.d:s.q};
}
export function latchCase(which:0|1){
 let s:LatchState={d:0,g:0,q:0,powered:true};
 s=latchStep(s,{type:'init',bit:which});
 s=latchStep(s,{type:'g',bit:1});
 s=latchStep(s,{type:'d',bit:which});
 s=latchStep(s,{type:'g',bit:0});
 s=latchStep(s,{type:'d',bit:0});
 return {...s,previous:which,history:which===0?'Q0→G1/D0→G0/D0':'Q1→G1/D1→G0/D0'};
}
export interface ClockSnapshot{t:number;d:Bit;clock:Bit;latchQ:Bit;ffQ:Bit;rising:boolean;event:string}
const clockEvents:readonly {t:number;d:Bit;clock:Bit;event:string}[]=[
 {t:0,d:0,clock:0,event:'clock LOW + D0 초기'},
 {t:2,d:0,clock:1,event:'0→1 클록 상승, D0'},
 {t:3,d:1,clock:1,event:'클록 HIGH 유지, D1'},
 {t:4,d:0,clock:1,event:'클록 HIGH 유지, D0'},
 {t:5,d:0,clock:0,event:'클록 하강, D0'},
 {t:6,d:1,clock:0,event:'클록 LOW 유지, D1'},
 {t:8,d:1,clock:1,event:'0→1 클록 상승, D1'},
];
export function clockTimeline(index:number):ClockSnapshot{
 const at=Math.max(0,Math.min(index,clockEvents.length-1));
 let prev:Bit=0,ff:Bit=0,latch:Bit=0;let edge=false;
 for(let i=0;i<=at;i++){
  const e=clockEvents[i];edge=i>0&&prev===0&&e.clock===1;
  if(edge)ff=e.d;
  if(e.clock===1)latch=e.d;
  prev=e.clock;
 }
 return {...clockEvents[at],latchQ:latch,ffQ:ff,rising:edge};
}
export function initialClockHighNoEdge(){
 return {clock:1 as Bit,previousKnown:false,captureEvent:false,
  q:'unknown-uninitialized' as const,description:'CLK=1 snapshot is not evidence of a 0→1 transition'};
}
export function timingToy(period:8|9,buffer:boolean){
 const setupRequired=1.2+5+1.3+(buffer?0.6:0);
 const holdArrival=0.2+0.3+(buffer?0.4:0);
 const setupMargin=Number((period-setupRequired).toFixed(2));
 const holdMargin=Number((holdArrival-0.8).toFixed(2));
 return {period,buffer,setupRequired,holdArrival,setupMargin,holdMargin,
  setupPass:setupMargin>=0,holdPass:holdMargin>=0,
  inputs:'tCQmax 1.2ns, maxLogicPD 5ns, tsetup 1.3ns; tCQmin0.2ns, minLogicCD0.3ns, thold0.8ns; buffer max+0.6ns, min+0.4ns; skew/jitter 0 toy'};
}
export function metastability(hazard:boolean,twoFlipFlops:boolean){
 return {hazard,risk:hazard?'unknown/possible metastability (not deterministic Q=0 or Q=1)':'no modeled edge-proximity hazard',
  synchronizer:twoFlipFlops?'additional settling time can reduce risk; never exact zero':'no synchronizer selected',
  guaranteedZeroFailure:false};
}
const required:Record<Logic16SceneId,readonly string[]>={
 'logic-nand-nor-truth-table':['NAND00','NAND01','NAND10','NAND11','NOR00','NOR01','NOR10','NOR11','topology-NAND','topology-NOR','nested-counterexample'],
 'combinational-vs-sequential-memory':['hold0','hold1','gate-closed-d-change','power-cycle'],
 'd-latch-vs-d-flip-flop':['t3','t4','t8','initial-high-no-edge'],
 'setup-hold-metastability-clock':['initial8','buffer8','buffer9','hazard']
};
const correct:Record<Logic16SceneId,string>={
 'logic-nand-nor-truth-table':'complementary',
 'combinational-vs-sequential-memory':'history-q',
 'd-latch-vs-d-flip-flop':'edge-vs-level',
 'setup-hold-metastability-clock':'separate-setup-hold'
};
export function gradeLogic16(id:Logic16SceneId,seen:readonly string[],answer:string|null):Logic16Grade{
 const conditions=[
  ...required[id].map(key=>({key,passed:seen.includes(key),help:'아직 '+key+'의 독립 조건을 조작/측정해야 해요.'})),
  {key:'explain-why',passed:answer===correct[id],help:'관찰 결과를 설명하는 물리 원리를 직접 골라 주세요.'}
 ];
 return {passed:conditions.every(x=>x.passed),misconception:answer!==null&&['m1','m2','m3'].includes(answer)?answer:null,conditions};
}
