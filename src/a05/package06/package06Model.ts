/** A05 Lesson06 imaginary wafer/chiplet/packaging, no vendor process data. */
export const package06Order=['fab-pattern-to-die','chiplet-yield-model','hbm-tsv-interposer','package-power-heat'] as const;
export type Package06SceneId=typeof package06Order[number];
export type FabAction='wafer'|'photo'|'process'|'metal'|'test'|'dice'|'reset';
export type Screening='none'|'KGD';
export type PackageTopology='board'|'hbm-stack'|'interposer';
export type InterposerKind='silicon'|'RDL';
export type Package06Event={sceneId:Package06SceneId;type:'scene.enter'|'prediction.recorded'|'parameter.changed'|'answer.checked'|'hint.opened'|'voice.requested';payload?:Record<string,unknown>};
export type Package06State={
 fab:FabAction[];fabError:string;layers:1|2;defect:boolean;
 density:0|0.005;screening:Screening;assembly:1|0.95;
 topology:PackageTopology;interposer:InterposerKind;tsv:boolean;
 power:20|40;thermalR:.2|.4;
};
export const freshPackage06=():Package06State=>({fab:[],fabError:'',layers:1,defect:false,density:.005,screening:'none',assembly:.95,topology:'board',interposer:'silicon',tsv:false,power:20,thermalR:.2});
export const fabSequence=['wafer','photo','process','metal','test','dice'] as const;
export interface FabTransition{accepted:boolean;code:'OK'|'RESET'|'INVALID_STAGE'|'COMPLETE';history:FabAction[];feedback:string}
export function fabAdvance(before:readonly FabAction[],action:FabAction):FabTransition{
 if(action==='reset')return{accepted:true,code:'RESET',history:[],feedback:'새 공정 실험: 이전 순서·검사 증거 초기화'};
 const history=[...before],required=fabSequence[history.length];
 if(!required)return{accepted:false,code:'COMPLETE',history,feedback:'이미 다이 검사를 마쳤어요. 재시작하여 다층 공정을 비교하세요.'};
 if(action!==required)return{accepted:false,code:'INVALID_STAGE',history,feedback:'다음 단계는 '+required+'입니다. 웨이퍼→포토→식각/막/주입→금속배선→검사→절단 순서로 진행해야 해요.'};
 return{accepted:true,code:'OK',history:[...history,action],feedback:action==='test'?'검사: 결함 다이는 실제로 양품 선별이 필요합니다.':'유효 단계 완료: '+action};
}
export function fabStageValid(history:readonly FabAction[]):boolean{
 return history.length===fabSequence.length&&history.every((x,i)=>x===fabSequence[i]);
}
const round=(n:number)=>Number(n.toFixed(6));
export function chipletYield(density:0|0.005,screening:Screening,assembly:1|0.95){
 const mono=Math.exp(-density*100),small=Math.exp(-density*25),fourUnscreened=small**4;
 const packageSuccess=round((screening==='KGD'?1:fourUnscreened)*assembly);
 return {density,mono:round(mono),individual:round(small),fourUnscreened:round(fourUnscreened),
  assemblyYield:assembly,packageSuccess,conditionalAfterScreen:screening==='KGD',screening,
  expectedCandidatesForOnePackage:round(4/small),assemblyOnlyNotPerDie:true,
  realScreeningPerfect:false,extraTestingAndInventoryCost:true};
}
export function interconnect(topology:PackageTopology,tsv:boolean,interposer:InterposerKind){
 return {topology,tsv,interposer,
  externalToGpu:topology==='interposer'?'interposer-dense-sideways':topology==='board'?'pcb-board-routing':'internal-hbm-stacked-only',
  insideHbm:topology==='hbm-stack'||topology==='interposer'?(tsv?'vertical-tsv-plus-microbumps':'vertical-link-not-yet-enabled'):'not-applicable',
  isUi2p5dSameAsPackaging:false,realCoWoSSiOnly:false};
}
export function packageThermal(power:20|40,thermalR:.2|.4){
 const ambientC=25,deltaK=power*thermalR;
 return {powerW:power,thermalR,deltaK:round(deltaK),junctionToyC:round(ambientC+deltaK),ambientC,unit:'K/W' as const,
  steadyOnePathOnly:true,actualChipTempUnknown:true};
}
const evidence:Record<Package06SceneId,readonly string[]>={
 'fab-pattern-to-die':['ordered-fab','layers1','layers2','defect0','defect1'],
 'chiplet-yield-model':['density0','density005','none','KGD','assembly1','assembly095'],
 'hbm-tsv-interposer':['board','stack','interposer-silicon','interposer-RDL','tsv'],
 'package-power-heat':['power20','power40','r02','r04']
};
const right:Record<Package06SceneId,string>={
 'fab-pattern-to-die':'repeat-and-test',
 'chiplet-yield-model':'conditional-kgd-package-yield',
 'hbm-tsv-interposer':'tsv-internal-interposer-sideways',
 'package-power-heat':'p-times-r-thermal'
};
export interface Package06Grade{passed:boolean;misconception:string|null;conditions:{key:string;passed:boolean;help:string}[]}
export function gradePackage06(id:Package06SceneId,observed:readonly string[],answer:string|null):Package06Grade{
 const conditions=[
  ...evidence[id].map(key=>({key,passed:observed.includes(key),help:key+' 조건을 직접 관찰해 보세요.'})),
  {key:'WHY',passed:answer===right[id],help:'정량 결과와 물리적 이유를 함께 설명해야 해요.'}
 ];
 return {passed:conditions.every(x=>x.passed),misconception:answer&&['m1','m2','m3'].includes(answer)?answer:null,conditions};
}
