/** A05 Lesson31 explicit fictional PSU/VRM/PDN/cooling/site metering models.
 * No GPU SKU specs, hardware performance, water-consumption guarantee or actual data center benchmarks. */
export const power31Order=['server-psu-loss-heat','gpu-buck-vrm-duty-ratio','gpu-pdn-current-heat','cdu-water-loop-heat-flow','data-center-pue-wue-tradeoff'] as const;
export type Power31SceneId=typeof power31Order[number];
export type Power31Efficiency=90|95;
export type Power31Duty=0.25|1/3|0.5;
export type Power31Rail=1|2;
export type Power31Resistance=1|2;
export type Power31DeltaT=5|10;
export type Power31Heat=50|100;
export type Power31Pue=1.2|1.4;
export type Power31Cooling='dry'|'tower';
export type Power31Site='A'|'B';
export type Power31Event={sceneId:Power31SceneId;type:'scene.enter'|'prediction.recorded'|'parameter.changed'|'answer.checked'|'hint.opened'|'voice.requested';payload?:Record<string,unknown>};
export type Power31State={psu:Power31Efficiency;duty:Power31Duty;buckEta:90|100;rail:Power31Rail;resistance:Power31Resistance;deltaT:Power31DeltaT;heat:Power31Heat;cooling:Power31Cooling;pue:Power31Pue;site:Power31Site};
export type Power31Condition={key:string;passed:boolean;hint:string};
export type Power31Grade={passed:boolean;misconception:string|null;conditions:Power31Condition[]};
export const power31Fresh=():Power31State=>({psu:90,duty:1/3,buckEta:100,rail:2,resistance:2,deltaT:5,heat:100,cooling:'dry',pue:1.4,site:'A'});
const round=(v:number)=>Math.round(v*1e6)/1e6;
export function power31Psu(eta:Power31Efficiency){
 const pout=100,efficiency=eta/100,inputW=pout/efficiency,lossW=inputW-pout;
 return {pout,eta,efficiency,inputW:round(inputW),lossW:round(lossW),realProduct:false,
  inputPlusLossCheck:Math.abs(inputW-(pout+lossW))<1e-9};
}
/** The ideal CCM volts relation never applies the nonideal conversion efficiency to Vout. */
export function power31Buck(duty:Power31Duty,eta:90|100=100){
 const vin=12,vout=vin*duty,iout=10,pout=vout*iout,pin=pout/(eta/100),iin=pin/vin;
 return {vin,duty,vout:round(vout),iout,pout:round(pout),eta,
  pin:round(pin),iin:round(iin),loss:round(pin-pout),
  ccmAssumed:true,voltageIdealized:true,inputCurrentDifferentFromOutput:iout!==iin};
}
export function power31Pdn(rail:Power31Rail,resistance:Power31Resistance){
 const loadW=40,voltage=rail,wireOhm=resistance*.001,current=loadW/rail;
 return {loadW,voltage,resistanceMilliOhm:resistance,currentA:current,
  wireHeatW:round(current*current*wireOhm),wireDropV:round(current*wireOhm),
  actualChipHeatNotDetermined:true};
}
/** coolant recirculation mass flow is NOT site water consumption or WUE */
export function power31Coolant(heat:Power31Heat,deltaT:Power31DeltaT,cooling:Power31Cooling){
 const heatW=heat*1000,cp=4180,flowKgPerS=heatW/(cp*deltaT);
 return {heatKw:heat,heatW,deltaT,cp,flowKgPerS:round(flowKgPerS),cooling,
  makeupWaterLPerS:null as null,siteWaterConsumptionCannotBeDeduced:true,
  rejection:cooling==='dry'?'dry heat rejection example (site makeup still design-dependent)':'evaporative cooling tower example (independent water makeup)'};
}
export function power31Facility(pue:Power31Pue,site:Power31Site){
 const itMW=1,hours=24,facilityMW=itMW*pue,overheadMW=facilityMW-itMW,facilityMWh=facilityMW*hours;
 const a={itKWh:1000,facilityKWh:1200,waterL:2000},b={itKWh:1000,facilityKWh:1350,waterL:500};
 const selected=site==='A'?a:b;
 return {itMW,hours,pue,facilityMW:round(facilityMW),overheadMW:round(overheadMW),facilityMWh:round(facilityMWh),
  deltaMWh24h:4.8,site,siteItKWh:selected.itKWh,siteFacilityKWh:selected.facilityKWh,
  siteWaterL:selected.waterL,sitePue:round(selected.facilityKWh/selected.itKWh),
  siteWue:round(selected.waterL/selected.itKWh),wueUnit:'L/kWh',
  siteRankEnergyBetter:'A' as const,siteRankWaterBetter:'B' as const,
  tokensPerSecond:null as null,meterWindow:'the SAME reporting interval / independent example'};
}
const evidence:Record<Power31SceneId,readonly string[]>={
 'server-psu-loss-heat':['eta90','eta95'],
 'gpu-buck-vrm-duty-ratio':['duty25','duty33','duty50','eta90'],
 'gpu-pdn-current-heat':['rail2','rail1','wire1','wire2'],
 'cdu-water-loop-heat-flow':['temp5','temp10','heat50','heat100','dry','tower'],
 'data-center-pue-wue-tradeoff':['pue14','pue12','siteA','siteB']
};
const answerKey:Record<Power31SceneId,string>={
 'server-psu-loss-heat':'psu-input-output-heat',
 'gpu-buck-vrm-duty-ratio':'buck-ideal-vs-power-efficiency',
 'gpu-pdn-current-heat':'fixed40w-i2r',
 'cdu-water-loop-heat-flow':'recirculation-vs-makeup',
 'data-center-pue-wue-tradeoff':'same-boundary-separate-pue-wue'
};
export function gradePower31(sceneId:Power31SceneId,history:readonly string[],answer:string|null):Power31Grade{
 const conditions:Power31Condition[]=[
  ...evidence[sceneId].map(key=>({key,passed:history.includes(key),hint:'조작·관찰 카드 '+key+'를 비교해 보세요.'})),
  {key:'왜? 원리 설명',passed:answer===answerKey[sceneId],hint:'계산값과 단위에 맞는 원리 설명을 선택하세요.'}
 ];
 return {passed:conditions.every(x=>x.passed),misconception:answer!==null&&['m1','m2','m3'].includes(answer)?answer:null,conditions};
}
