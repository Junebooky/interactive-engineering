import {describe,it,expect} from 'vitest';
import {electricitySceneOrder,energyModel,evaluateElectricity,rcModel,resistorNetwork,simpleCircuit} from '../a05/electricity/electricityModel';
describe('A06 12 electrical foundations scientific and grading contracts',()=>{
 it('open 5V source keeps terminals biased without conducting current; closed 1k has 5mA',()=>{
  expect(simpleCircuit(5,false)).toMatchObject({terminalVoltageV:5,currentMilliAmps:0,sourceStillBiasedWhenOpen:true});
  expect(simpleCircuit(5,true).currentMilliAmps).toBeCloseTo(5,12);
  expect(simpleCircuit(0,true).currentMilliAmps).toBe(0);
  expect(()=>simpleCircuit(5,true,0)).toThrow();
 });
 it('two 1k resistors series 2k 2.5mA and 2.5V each, parallel 500 10mA each branch 5mA',()=>{
  const s=resistorNetwork('series'),p=resistorNetwork('parallel');
  expect(s.equivalentOhms).toBe(2000);expect(s.totalMilliAmps).toBeCloseTo(2.5);
  expect(s.eachResistorVoltageV).toBe(2.5);
  expect(p.equivalentOhms).toBe(500);expect(p.totalMilliAmps).toBeCloseTo(10);
  expect(p.branchMilliAmps).toEqual([5,5]);
  expect(p.nodeBalanceMilliAmps).toBeCloseTo(0);
 });
 it('ideal RC 1k 10u has tau 10ms and 3.16V charge / 1.84V discharge',()=>{
  const start=rcModel('charge',1000,10,0);
  expect(start.tauMs).toBe(10);expect(start.voltageV).toBe(0);
  expect(start.currentMilliAmps).toBeCloseTo(5);
  const c=rcModel('charge',1000,10,10),d=rcModel('discharge',1000,10,10);
  expect(c.voltageV).toBeCloseTo(3.160602794,6);
  expect(d.voltageV).toBeCloseTo(1.839397206,6);
  expect(rcModel('charge',1000,10,30).voltageV).toBeCloseTo(4.751064658,6);
  expect(rcModel('charge',2000,10,10).tauMs).toBe(20);
  expect(rcModel('charge',1000,20,10).tauMs).toBe(20);
  // Mid-charge discharge starts at the *observed* capacitor voltage, not an invented full charge.
  const partial=rcModel('charge',1000,10,10).voltageV;
  expect(rcModel('discharge',1000,10,10,5,partial,10).voltageV).toBeCloseTo(partial,10);
  expect(rcModel('discharge',1000,10,20,5,partial,10).voltageV).toBeCloseTo(partial*Math.exp(-1),9);
 });
 it('power W vs energy J and capacitor 125uJ, 10V 500uJ',()=>{
  const p=energyModel(5,10,10),p2=energyModel(10,10,10);
  expect(p.milliWatts).toBe(50);expect(p.joules).toBeCloseTo(.5);
  expect(p.capacitorMicroJoules).toBeCloseTo(125);
  expect(p2.capacitorMicroJoules).toBeCloseTo(500);
  expect(p2.capacitorMicroJoules/p.capacitorMicroJoules).toBeCloseTo(4);
 });
 it('all four scenes must require real experiment action evidence AND explanation',()=>{
  expect(electricitySceneOrder.length).toBe(4);
  const cases=[
   ['charge-voltage-current-arrows',['open','closed','electron','conventional'],'v-not-current'],
   ['resistors-series-parallel-kcl',['series','parallel'],'current-conserved'],
   ['capacitor-rc-charge-discharge',['charge-tau','discharge-tau','new-tau'],'tau-exponential'],
   ['power-energy-joules-heat',['base-energy','cap-doubled'],'power-vs-energy']
  ] as const;
  for(const [id,facts,answer] of cases){
   expect(evaluateElectricity(id,facts,answer).passed).toBe(true);
   expect(evaluateElectricity(id,[],answer).passed).toBe(false);
   expect(evaluateElectricity(id,facts,null).passed).toBe(false);
  }
 });
});
