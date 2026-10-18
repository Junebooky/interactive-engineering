import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {A05_INTERACTIVE_WORLD_BOUNDS} from './a05InteractiveBounds';
import {A05SceneVisual} from '../A05SceneVisual';
import {ElectricitySceneVisual,type ElectricityVisualState} from '../electricity/ElectricitySceneVisual';
import type {ElecSceneId} from '../electricity/electricityModel';
import {PnSceneVisual,type PnVisualState} from '../pn/PnSceneVisual';
import type {PnSceneId} from '../pn/pnModel';
import {Mos14SceneVisual} from '../mos14/Mos14SceneVisual';
import type {Mos14SceneId,Mos14State} from '../mos14/mos14Model';
import {DramSceneVisual,type DramVisualState} from '../dram/DramSceneVisual';
import type {DramSceneId} from '../dram/dramModel';
import {SramSceneVisual,type SramVisualState} from '../sram/SramSceneVisual';
import type {SramSceneId} from '../sram/sramModel';
import {Nand04SceneVisual} from '../nand04/Nand04SceneVisual';
import type {Nand04SceneId} from '../nand04/nand04Model';
import {GpuSceneVisual,type GpuVisualState} from '../gpu/GpuSceneVisual';
import type {GpuSceneId} from '../gpu/gpuModel';
import '../a05Scenes.css';
import '../electricity/electricityScenes.css';
import '../pn/pnScenes.css';
import '../mos14/mos14.css';
import '../dram/dramScenes.css';
import '../sram/sramScenes.css';
import '../nand04/nand04.css';
import '../gpu/gpuScenes.css';
import './preview.css';

const ids=Object.keys(A05_INTERACTIVE_WORLD_BOUNDS);
const elecIds:Record<string,ElecSceneId>={
 'elec-charge-current':'charge-voltage-current-arrows',
 'elec-resistor-kcl':'resistors-series-parallel-kcl',
 'elec-rc-delay':'capacitor-rc-charge-discharge',
 'elec-power-energy':'power-energy-joules-heat',
};
const pnIds:Record<string,PnSceneId>={
 'pn-band-gap':'semiconductor-band-gap',
 'pn-doping':'silicon-donor-acceptor-doping',
 'pn-equilibrium':'pn-diffusion-drift-equilibrium',
 'pn-depletion-bias':'pn-bias-depletion-calculator',
 'pn-diode-to-mos':'pn-diode-current-to-mos'
};
const mosIds:Record<string,Mos14SceneId>={
 'mos14-oxide-field':'mos-oxide-field-without-dc-path',
 'mos14-accumulation-inversion':'mos-accumulation-depletion-inversion',
 'mos14-capacitance-cv':'mos-oxide-capacitance-cv',
 'mos14-cap-to-nmosfet':'mos-cap-to-nmosfet-bridge',
};
const gpuIds:Record<string,GpuSceneId>={
 'gpu-compute-feeding':'compute-feeding',
 'gpu-memory-family-roles':'memory-family-roles',
 'gpu-gddr-width-rate':'gddr-width-rate',
 'gpu-hbm-tradeoffs':'hbm-tradeoffs'
};
function Content({id,variant}:{id:string;variant:boolean}){
 const meta=A05_INTERACTIVE_WORLD_BOUNDS[id];
 if(!meta)return <p>INVALID SCENE</p>;
 if(meta.familyId==='mosfet'||meta.familyId==='mosfet-logic'){
  return <A05SceneVisual sceneId={id as 'mosfet-field'|'mosfet-current'|'nmos-resistor-inverter'|'cmos-not-gate'}
   values={{vgs:variant?1.5:0,vds:variant?1:0,vin:variant?5:0,out0:null,out1:null}}
   showObservation={true}/>;
 }
 if(meta.familyId==='electricity'){
  const state:ElectricityVisualState={
   volts:variant?5:0,closed:variant,direction:variant?'electron':'conventional',topology:variant?'parallel':'series',
   mode:variant?'discharge':'charge',rOhms:variant?2000:1000,cMicroFarads:variant?20:10,
   timeMs:variant?50:0,rcInitialVoltageV:variant?5:0,rcSegmentStartMs:0,
   powerVolts:variant?10:5,loadMilliAmps:variant?10:5,seconds:variant?10:1};
  return <ElectricitySceneVisual sceneId={elecIds[id]} state={state} revealed/>;
 }
 if(meta.familyId==='pn'){
  const state:PnVisualState={
   material:variant?'insulator':'silicon',light:variant,warm:variant,dopant:variant?'donor':'intrinsic',
   phase:variant?'equilibrium':'separate',bias:variant?-1:0,na:1e16,nd:1e16,
   diodeBias:variant?0.4:0,gate:variant?'mos':'pn'};
  return <PnSceneVisual sceneId={pnIds[id]} state={state} revealed/>;
 }
 if(meta.familyId==='mos14'){
  const state:Mos14State={gateV:variant?1.1:0,oxideNm:variant?10:5,
   phase:variant?'switching':'steady',device:variant?'nmos':'capacitor',
   vds:variant?0.5:0,showCv:variant};
  return <Mos14SceneVisual sceneId={mosIds[id]} state={state} revealed/>;
 }
 if(meta.familyId==='dram'){
  const state:DramVisualState={wl:variant?1:0,bl:variant?0:1,cell:variant?1:0,
   bit:variant?0:1,phase:variant?'sensed':'precharge',elapsed:variant?5:0,
   refreshAt:variant?null:10,banks:variant?2:1};
  return <DramSceneVisual sceneId={id as DramSceneId} state={state} revealed/>;
 }
 if(meta.familyId==='sram'){
  const state:SramVisualState={q:variant?0:1,feedback:!variant,supply:true,
   wl:variant?1:0,bl:variant?0:1,mode:variant?'read':'write',
   cacheLines:variant?2:1,cacheRan:variant,resident:variant,inputCount:variant?3:1};
  return <SramSceneVisual sceneId={id as SramSceneId} state={state} revealed/>;
 }
 if(meta.familyId==='nand04'){
  const state={cell:variant?'high':'low',readV:variant?2:1,power:variant?'off':'on',
   pageStage:variant?'collected':'initial',writePattern:variant?'hot':'cold',
   ecc:variant,plp:variant,dramCache:variant,transport:variant?'read-data':'command',
   ai:variant?'resident-infer':'cold-load',servers:variant?2:1} as const;
  return <Nand04SceneVisual sceneId={id as Nand04SceneId} state={state} revealed/>;
 }
 if(meta.familyId==='gpu'){
  const state:GpuVisualState={compute:variant?32:16,feed:variant?32:8,
   family:'DDR/RDIMM',site:'cpu-dimm',pinRate:variant?32:24,signal:'NRZ',
   topology:variant?'hbm-stack':'gddr-board',showConstraints:variant};
  return <GpuSceneVisual sceneId={gpuIds[id]} state={state} revealed/>;
 }
 return <p>NOT IMPLEMENTED: {id}</p>;
}
function Preview(){
 const [id,setId]=useState(ids[0]);
 const [variant,setVariant]=useState(false);
 const frame=A05_INTERACTIVE_WORLD_BOUNDS[id];
 return <main className="a05-world-gallery" lang="ko">
  <h1>A05 P0 #80 · 실제 2.5D 장치 좌표계</h1>
  <p>실물 장면과 장면별 과학 라벨을 별도 SVG 그룹으로 검증합니다. 물리 모델 변경 없이 상태 A/B 비교.</p>
  <div className="a05-world-controls"><label htmlFor="scene">장면 선택</label>
   <select id="scene" value={id} onChange={e=>{setId(e.target.value);setVariant(false)}}>{ids.map(k=><option key={k} value={k}>{k}</option>)}</select>
   <button type="button" aria-pressed={variant} onClick={()=>setVariant(v=>!v)}>
    {variant?'상태 B · 조작 후':'상태 A · 초기'} (전환)
   </button>
  </div>
  <div className="a05-world-slot" data-testid="a05-world-slot" data-scene-id={id}
   data-framing={JSON.stringify(frame)}>
   <Content id={id} variant={variant}/>
  </div>
  <p>스크린샷의 결과 수치는 공개 앱의 학습 완료 판정이 아닙니다. 실험 값 카드와 SVG 장치 크기는 독립 측정합니다.</p>
 </main>;
}
const root=document.getElementById('root');if(root)createRoot(root).render(<Preview/>);
