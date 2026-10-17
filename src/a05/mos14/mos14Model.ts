/** A05 Lesson 14: 1D ideal planar p-Si MOS capacitor teaching models, not real CMOS SKU values. */
export const mos14Scenes=[
 'mos-oxide-field-without-dc-path',
 'mos-accumulation-depletion-inversion',
 'mos-oxide-capacitance-cv',
 'mos-cap-to-nmosfet-bridge',
] as const;
export type Mos14SceneId=(typeof mos14Scenes)[number];
export type Mos14Bias=-0.5|0|0.3|1.1;
export type Mos14Oxide=5|10;
export type Mos14Phase='switching'|'steady';
export type Mos14Device='capacitor'|'nmos';
export type Mos14Vds=0|0.5;
export type Mos14Surface='accumulation'|'flatband'|'depletion'|'inversion';
export interface Mos14State{
 gateV:Mos14Bias;
 oxideNm:Mos14Oxide;
 phase:Mos14Phase;
 device:Mos14Device;
 vds:Mos14Vds;
 showCv:boolean;
}
export interface Mos14Event{
 sceneId:Mos14SceneId;
 type:'scene.enter'|'prediction.recorded'|'parameter.changed'|'answer.checked'|'voice.requested'|'hint.opened';
 payload?:Record<string,unknown>;
}
export interface Mos14Condition{label:string;passed:boolean;help:string}
export interface Mos14Feedback{passed:boolean;conditions:Mos14Condition[]}
const eps0=8.8541878128e-12; // F/m
const epsSi=11.7*eps0;
const epsOx=3.9*eps0;
const q=1.602176634e-19; // C
const na=1e22; // 1e16 cm^-3 -> m^-3
const thermalV=0.0258526; // 300 K toy
const phiF=thermalV*Math.log(1e6);
const depWidthM=Math.sqrt(4*epsSi*phiF/(q*na));
const depChargeCm2=q*na*depWidthM/1e4;
export function mos14OxidePhysics(toxNm:Mos14Oxide){
 const coxFPerM2=epsOx/(toxNm*1e-9);
 const coxMicroFPerCm2=coxFPerM2*100;
 // fixed acceptor depletion charge is per cm²; convert back to C/m² for gate overdrive.
 const vtV=2*phiF+(depChargeCm2*1e4)/coxFPerM2;
 return {oxideNm:toxNm,coxFPerM2,coxMicroFPerCm2,vtV,phiF,
  vfbV:0 as const,naCm3:1e16,temperatureK:300,depWidthMicrons:depWidthM*1e6,
  assumption:'special VFB=0 ideal planar MOS toy; high-k/EOT/body bias/interface charge omitted'};
}
export function mos14Surface(gateV:Mos14Bias,oxideNm:Mos14Oxide):Mos14Surface{
 if(gateV<0)return 'accumulation';
 if(gateV===0)return 'flatband'; // ONLY the expressly chosen VFB=0 toy
 return gateV>=mos14OxidePhysics(oxideNm).vtV?'inversion':'depletion';
}
export function mos14Current(state:Mos14State){
 if(state.device==='capacitor')return {drainCurrent:'undefined' as const,hasDrainTerminal:false,
  physicalNote:'two-terminal MOS capacitor: I_D is not defined because there is no drain'};
 if(state.vds===0)return {drainCurrent:'zero' as const,hasDrainTerminal:true,
  physicalNote:'ideal inverted nMOS at V_DS=0 has net I_D=0'};
 if(mos14Surface(state.gateV,state.oxideNm)!=='inversion')
  return {drainCurrent:'not-guaranteed' as const,hasDrainTerminal:true,
   physicalNote:'no strong inversion in this 1D cartoon; subthreshold and leakage outside toy'};
 return {drainCurrent:'possible' as const,hasDrainTerminal:true,
  physicalNote:'with source/drain, inversion and V_DS>0, net conduction is possible; no ampere value claimed'};
}
export function mos14OxideCurrent(phase:Mos14Phase){
 return {oxideSteadyDcA:0,externalChargeTransientPossible:phase==='switching',
  disclaimer:'ideal oxide DC through-conduction is zero; external displacement/charging path can flow during changing bias, not a DC tunnel'};
}
export function mos14Cv(toxNm:Mos14Oxide,showCv:boolean){
 const cox=mos14OxidePhysics(toxNm).coxMicroFPerCm2;
 const cdepToy=0.5*cox;
 const cseries=cox*cdepToy/(cox+cdepToy);
 return {coxMicroFPerCm2:cox,depletionSeriesToyMicroFPerCm2:cseries,
  highFrequencyInversion:'near Cmin in illustrative high-frequency inversion' as const,
  lowFrequencyInversion:'may approach Cox when minority carriers follow slow excitation' as const,
  showCv,assumption:'qualitative schematic, not measured C-V/frequency; C_ox geometry != measured gate capacitance'};
}
const required:Record<Mos14SceneId,readonly string[]>={
 'mos-oxide-field-without-dc-path':['negative','positive','switching','steady'],
 'mos-accumulation-depletion-inversion':['accumulation','flatband','depletion','inversion'],
 'mos-oxide-capacitance-cv':['tox5','tox10','cv'],
 'mos-cap-to-nmosfet-bridge':['cap','nmos-zero','nmos-positive'],
};
const correctAnswer:Record<Mos14SceneId,string>={
 'mos-oxide-field-without-dc-path':'field-not-dc',
 'mos-accumulation-depletion-inversion':'bulk-unchanged',
 'mos-oxide-capacitance-cv':'inverse-series-frequency',
 'mos-cap-to-nmosfet-bridge':'terminals-and-vds',
};
export function gradeMos14(id:Mos14SceneId,observations:readonly string[],answer:string|null):Mos14Feedback{
 const conditions:Mos14Condition[]=[
  ...required[id].map(k=>({label:'실험 '+k,passed:observations.includes(k),help:'직접 '+k+' 조건을 선택하고 관찰해 보세요.'})),
  {label:'물리 원리와 오개념 구별',passed:answer===correctAnswer[id],help:'관찰 결과와 단자/전하 이동을 정확하게 설명한 항목을 선택하세요.'}
 ];
 return {passed:conditions.every(c=>c.passed),conditions};
}
