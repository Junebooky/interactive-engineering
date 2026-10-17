/** A06 lesson 12: ideal, safe, illustrative circuit models; not device characterization. */
export type ElecSceneId =
  |'charge-voltage-current-arrows'|'resistors-series-parallel-kcl'
  |'capacitor-rc-charge-discharge'|'power-energy-joules-heat';
export const electricitySceneOrder:readonly ElecSceneId[]=[
  'charge-voltage-current-arrows','resistors-series-parallel-kcl',
  'capacitor-rc-charge-discharge','power-energy-joules-heat'];
export type CircuitTopology='series'|'parallel';
export type ChargeMode='charge'|'discharge';
export type Direction='conventional'|'electron';
export interface ElecEvent{
  sceneId:ElecSceneId;
  type:'scene.enter'|'prediction.recorded'|'parameter.changed'|'hint.opened'|'answer.checked'|'voice.requested';
  payload?:Record<string,string|number|boolean>;
}
export type ElecFeedback={passed:boolean;conditions:{label:string;passed:boolean;explanation:string}[]};
export function simpleCircuit(volts:0|5,switchClosed:boolean,resistanceOhms=1000){
  if(resistanceOhms<=0)throw Error('Resistance must be positive');
  const currentAmps=switchClosed?volts/resistanceOhms:0;
  return {terminalVoltageV:volts,currentAmps,currentMilliAmps:currentAmps*1000,
    sourceStillBiasedWhenOpen:volts!==0,
    conventional:'source + → resistor → source −',
    electron:'electron drift − → resistor → + in metal',
    assumption:'ideal DC, zero internal battery/wire resistance and no open-switch leakage'};
}
export function resistorNetwork(topology:CircuitTopology,volts=5,rOhms=1000){
  if(rOhms<=0)throw Error('Positive resistance required');
  const series=topology==='series';
  const equivalentOhms=series?2*rOhms:rOhms/2;
  const totalMilliAmps=volts/equivalentOhms*1000;
  return {equivalentOhms,totalMilliAmps,
    branchMilliAmps:series?[totalMilliAmps,totalMilliAmps]:[totalMilliAmps/2,totalMilliAmps/2],
    eachResistorVoltageV:series?volts/2:volts,
    nodeBalanceMilliAmps:series?0:totalMilliAmps-totalMilliAmps/2-totalMilliAmps/2,
    voltageLoopBalanceV:series?volts-2*(volts/2):0,
    assumption:'ideal Ohmic 1kΩ resistors and 5V DC source, steady state'};
}
export function rcModel(mode:ChargeMode,rOhms:1000|2000,cMicroFarads:10|20,timeMs:number,sourceV=5){
  if(timeMs<0||!Number.isFinite(timeMs))throw Error('Time must be finite and nonnegative');
  const tauMs=rOhms*cMicroFarads*1e-3; // ohms × µF → milliseconds
  const exp=Math.exp(-timeMs/tauMs);
  const voltageV=mode==='charge'?sourceV*(1-exp):sourceV*exp;
  const currentMilliAmps=(mode==='charge'?1:-1)*(sourceV/rOhms)*1000*exp;
  return {mode,tauMs,voltageV,currentMilliAmps,
    percentCharge:voltageV/sourceV*100, initialVoltageV:mode==='charge'?0:sourceV,
    assumption:'ideal first-order RC, charge begins 0V, discharge begins 5V; physical retention/leakage ignored'};
}
export function energyModel(volts:5|10,loadMilliAmps:5|10,seconds:1|10,cMicroFarads=10){
  const watts=volts*loadMilliAmps/1000;
  const joules=watts*seconds;
  const capacitorJoules=.5*cMicroFarads*1e-6*volts**2;
  return {watts,milliWatts:watts*1000,joules,capacitorJoules,capacitorMicroJoules:capacitorJoules*1e6,
    assumption:'independently selected V and I toy load, NOT fixed resistance; steady power, stored cap energy not charger input/dissipated heat'};
}
export function evaluateElectricity(id:ElecSceneId,observed:readonly string[],answerId:string|null):ElecFeedback{
  const has=(key:string)=>observed.includes(key);
  const checks:ElecFeedback['conditions']=[];
  if(id==='charge-voltage-current-arrows'){
    checks.push({label:'회로 OPEN · 전원 5V · I=0',passed:has('open'),explanation:'전원 5V를 유지하고 스위치를 열어 전류 0을 확인해 보세요.'});
    checks.push({label:'회로 CLOSED · I=5mA',passed:has('closed'),explanation:'동일한 1kΩ 회로를 닫아 5mA를 관찰하세요.'});
    checks.push({label:'전자/관습전류 반대 방향',passed:has('electron')&&has('conventional'),explanation:'전류 화살표와 음전하 전자 화살표를 차례로 확인하세요.'});
  }else if(id==='resistors-series-parallel-kcl'){
    checks.push({label:'직렬 2kΩ/2.5mA',passed:has('series'),explanation:'저항 1kΩ 둘을 직렬 연결해 보세요.'});
    checks.push({label:'병렬 500Ω/10mA, 분기 각 5mA',passed:has('parallel'),explanation:'같은 저항 둘을 병렬 연결해 노드 유입·유출을 비교하세요.'});
  }else if(id==='capacitor-rc-charge-discharge'){
    checks.push({label:'기본 τ=10ms에서 충전 3.16V',passed:has('charge-tau'),explanation:'1kΩ·10µF에서 충전 10ms로 설정해 보세요.'});
    checks.push({label:'같은 τ에서 방전 1.84V',passed:has('discharge-tau'),explanation:'같은 저항/용량/시간에서 방전으로 바꿔 보세요.'});
    checks.push({label:'R 또는 C 증가 시 τ 증가',passed:has('new-tau'),explanation:'저항 또는 커패시턴스를 두 배로 바꾸세요.'});
  }else{
    checks.push({label:'5V·10mA·10s → 50mW/0.5J',passed:has('base-energy'),explanation:'5V, 10mA, 10s를 직접 조합해 보세요.'});
    checks.push({label:'10V에서 커패시터 저장 에너지 ×4',passed:has('cap-doubled'),explanation:'전압을 10V로 바꿔 10µF 커패시터 에너지를 비교해 보세요.'});
  }
  const expected:Record<ElecSceneId,string>={
    'charge-voltage-current-arrows':'v-not-current',
    'resistors-series-parallel-kcl':'current-conserved',
    'capacitor-rc-charge-discharge':'tau-exponential',
    'power-energy-joules-heat':'power-vs-energy'};
  checks.push({label:'이유 및 물리적 가정 설명',passed:answerId===expected[id],explanation:'직접 조작한 결과뿐 아니라 그 이유를 정확히 고르세요.'});
  return {passed:checks.every(c=>c.passed),conditions:checks};
}
