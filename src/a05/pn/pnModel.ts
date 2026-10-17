/** A06 lesson 11: qualitative band/doping and ideal toy 1D PN models, not measured silicon devices. */
export type PnSceneId='semiconductor-band-gap'|'silicon-donor-acceptor-doping'
 |'pn-diffusion-drift-equilibrium'|'pn-bias-depletion-calculator'|'pn-diode-current-to-mos';
export const pnSceneOrder:readonly PnSceneId[]=[
 'semiconductor-band-gap','silicon-donor-acceptor-doping','pn-diffusion-drift-equilibrium',
 'pn-bias-depletion-calculator','pn-diode-current-to-mos'];
export type BandMaterial='metal'|'silicon'|'insulator';
export type Dopant='intrinsic'|'donor'|'acceptor';
export type JunctionPhase='separate'|'diffusion'|'equilibrium';
export type BiasV=-1|0|0.2;
export type DiodeBiasV=-1|0|0.3|0.4;
export type GateComparison='pn'|'mos';
export interface PnEvent{
 sceneId:PnSceneId;
 type:'scene.enter'|'prediction.recorded'|'parameter.changed'|'answer.checked'|'hint.opened'|'voice.requested';
 payload?:Record<string,number|string|boolean>;
}
export type PnFeedback={passed:boolean;conditions:{label:string;passed:boolean;help:string}[]};
export function bandMaterial(material:BandMaterial,light:boolean,warm:boolean){
 const gapEV=material==='metal'?0:material==='silicon'?1.1:5;
 return {gapEV,bandGapIsSpatial:false,carrierType:material==='silicon'?'electrons and holes':'material-dependent',
  excited:material==='silicon'&&(light||warm),
  interpretation:material==='metal'?'occupied & available bands overlap in cartoon':
   material==='silicon'?'a finite bandgap; excitations can generate electron-hole pairs':
   'large-gap illustrative insulator, not zero carriers in all conditions'};
}
export function dopantModel(dopant:Dopant){
 return {dopant,
  majority:dopant==='donor'?'electron':dopant==='acceptor'?'hole':'no chosen majority',
  minorityExists:true,bulkChargeApproxZero:true,
  fixedIon:dopant==='donor'?'+ donor ion':dopant==='acceptor'?'- acceptor ion':'none',
  example:dopant==='donor'?'P-doped n-type':dopant==='acceptor'?'B-doped p-type':'intrinsic silicon'};
}
/** Conventional currents are equal/opposing. E field points n(+) toward p(-). */
export function pnEquilibrium(phase:JunctionPhase){
 return {contact:phase!=='separate',depletionPresent:phase!=='separate',
  electricField:'n(+) → p(−)',
  fixedIonsN:'positive ionized donors',fixedIonsP:'negative ionized acceptors',
  diffusionToy:phase==='separate'?0:1,
  driftToy:phase==='equilibrium'?-1:0,
  netCurrentToy:phase==='equilibrium'?0:phase==='diffusion'?1:0,
  note:phase==='equilibrium'?'steady equilibrium net current 0; carriers still move':
   phase==='diffusion'?'qualitative transient snapshot, not steady device current':'not contacted'};
}
export const ELEMENTARY_Q=1.602176634e-19, VT_300K=0.025852, NI_CM3=1e10;
export const EPS_SI_F_PER_CM=1.0359e-12;
/** Ideal non-degenerate one-dimensional abrupt junction depletion approximation. */
export function depletion(va:BiasV,naPerCm3=1e16,ndPerCm3=1e16){
 if(naPerCm3<=0||ndPerCm3<=0)throw Error('positive dopant densities required');
 const vbi=VT_300K*Math.log(naPerCm3*ndPerCm3/(NI_CM3**2));
 if(va>=vbi)throw Error('forward bias exceeds depletion model validity');
 const wCm=Math.sqrt(2*EPS_SI_F_PER_CM/ELEMENTARY_Q*(1/naPerCm3+1/ndPerCm3)*(vbi-va));
 const wMicrons=wCm*1e4;
 const xpMicrons=wMicrons*ndPerCm3/(naPerCm3+ndPerCm3);
 const xnMicrons=wMicrons*naPerCm3/(naPerCm3+ndPerCm3);
 return {appliedBiasV:va,barrierV:vbi-va,builtInV:vbi,
  widthMicrons:wMicrons,pMicrons:xpMicrons,nMicrons:xnMicrons,
  fieldDirection:'n donor + → p acceptor −',
  note:'300K ideal abrupt Si 1D depletion, ni=1e10/cm³, dielectric constant fixed, forward high injection excluded'};
}
export function diodeCurrent(volts:DiodeBiasV,isA=1e-12,ideality=2){
 if(isA<=0||ideality<=0)throw Error('positive diode parameters');
 const currentA=isA*Math.expm1(volts/(ideality*VT_300K));
 return {volts,currentA,currentPicoA:currentA*1e12,currentNanoA:currentA*1e9,
  compareResistorMilliA:volts/1000*1e3,
  assumption:'Shockley ideal toy, Is=1pA, n=2, VT=25.852mV; reverse breakdown/series resistance excluded'};
}
export function gateContrast(gate:GateComparison){
 return gate==='mos'?{gateControl:'insulated oxide field effect, ideal DC gate current ≈0',
   path:'MOS gate separated from semiconductor by oxide',hasInsulator:true}:
  {gateControl:'carrier injection across PN junction under forward bias',
   path:'PN interface, not MOS insulated-gate path',hasInsulator:false};
}
export function evaluatePn(id:PnSceneId,observed:readonly string[],answer:string|null):PnFeedback{
 const has=(f:string)=>observed.includes(f);
 const checks:PnFeedback['conditions']=[];
 if(id==='semiconductor-band-gap'){
  checks.push({label:'금속/Si/절연체 밴드 상태 비교',passed:has('metal')&&has('silicon')&&has('insulator'),help:'세 밴드 모형을 눌러 에너지 틈을 비교해 보세요.'});
  checks.push({label:'빛 또는 열로 e−·정공 쌍 변화 관찰',passed:has('excited'),help:'실리콘에서 빛/열 효과를 켜 보세요.'});
 }else if(id==='silicon-donor-acceptor-doping'){
  checks.push({label:'Donor의 n형 전자 다수',passed:has('donor'),help:'P donor 카드를 놓고 다수 전하운반자를 관찰하세요.'});
  checks.push({label:'Acceptor의 p형 정공 다수',passed:has('acceptor'),help:'B acceptor 카드를 놓고 다수 운반자를 비교하세요.'});
 }else if(id==='pn-diffusion-drift-equilibrium'){
  checks.push({label:'접촉과 초기 확산 관찰',passed:has('diffusion'),help:'n형과 p형을 접촉시키세요.'});
  checks.push({label:'전계 n+→p−, drift+diffusion 합 0',passed:has('equilibrium'),help:'평형 단계의 반대 전류 기여를 관찰하세요.'});
 }else if(id==='pn-bias-depletion-calculator'){
  checks.push({label:'역바이어스 −1 V 공핍층 확대',passed:has('reverse'),help:'p단자 기준 −1V에서 W를 관찰하세요.'});
  checks.push({label:'0 V 내부 전계 평형',passed:has('zero'),help:'p단자 기준 0V를 확인하세요.'});
  checks.push({label:'순바이어스 +0.2 V 공핍폭 감소',passed:has('forward'),help:'p단자 기준 +0.2V에서 W를 관찰하세요.'});
 }else{
  checks.push({label:'+0.3와 +0.4V 비선형 I 확인',passed:has('0.3')&&has('0.4'),help:'두 순방향 전압을 모두 조작해 보세요.'});
  checks.push({label:'−1V 누설과 MOS 산화막 대비',passed:has('-1')&&has('mos'),help:'역전압 누설과 절연 MOS 게이트 카드도 확인하세요.'});
 }
 const keys:Record<PnSceneId,string>={
  'semiconductor-band-gap':'gap-energy-not-hole',
  'silicon-donor-acceptor-doping':'majority-neutrality',
  'pn-diffusion-drift-equilibrium':'balanced-not-battery',
  'pn-bias-depletion-calculator':'reverse-widens',
  'pn-diode-current-to-mos':'nonlinear-oxide'};
 checks.push({label:'오개념을 피하고 물리적 이유 설명',passed:answer===keys[id],help:'버튼 조작에 더해 밴드/운반자/전계의 이유를 정확히 고르세요.'});
 return {passed:checks.every(c=>c.passed),conditions:checks};
}
