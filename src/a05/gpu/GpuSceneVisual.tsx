import {useId} from 'react';
import {computeFeeding,packaging,placement,signalLevels,theoreticalBandwidth} from './gpuModel';
import type {ComputeRate,Family,FeedRate,GpuSceneId,PinRate,Placement,Signal,Topology} from './gpuModel';
import type {ReactNode} from 'react';

export interface GpuVisualState{
  compute:ComputeRate;feed:FeedRate;
  family:Family;site:Placement;
  pinRate:PinRate;signal:Signal;
  topology:Topology;showConstraints:boolean;
}
function T({x,y,children,color='#e5faff',size=14}:{
  x:number;y:number;children:ReactNode;color?:string;size?:number;
}){return <text x={x} y={y} fontSize={size} fill={color} fontWeight="650">{children}</text>;}
function Chip({x,y,w=150,h=75,name,detail,accent='#7df5cf'}:{
  x:number;y:number;w?:number;h?:number;name:string;detail:string;accent?:string;
}){return <g>
  <rect x={x+10} y={y+10} width={w} height={h} rx="13" fill="#061b2c" opacity=".6"/>
  <path d={`M${x} ${y} h${w-17} l17 14 v${h-14} h-${w} Z`} fill="#24495c" stroke={accent} strokeWidth="2"/>
  <path d={`M${x} ${y} h${w-17} l17 14 h-${w} Z`} fill={accent} opacity=".28"/>
  <T x={x+10} y={y+30} size={16}>{name}</T>
  <T x={x+10} y={y+50} size={12} color="#c7e7ec">{detail}</T>
</g>}
export function GpuSceneVisual({sceneId,state,revealed}:{
  sceneId:GpuSceneId;state:GpuVisualState;revealed:boolean;
}){
  const uid=useId().replace(/:/g,'');
  if(!revealed)return <div className="a05-veiled" aria-label="GPU 실험 결과는 예측 전 숨겨져 있습니다">
    <div className="a05-veiled-object" aria-hidden="true"><span/></div>
    <p>먼저 예상한 다음 그래픽과 계산을 열어 볼까요?</p>
  </div>;
  const rate=computeFeeding(state.compute,state.feed);
  const bandwidth=theoreticalBandwidth(128,state.pinRate);
  const pack=packaging(state.topology);
  return <div className="a05-visual a05-gpu-visual">
    <svg viewBox="0 0 650 405" role="img" aria-label={
      sceneId==='compute-feeding'?'GPU 병렬 계산기와 메모리 공급 파이프라인 병목 상태':
      sceneId==='memory-family-roles'?'CPU DIMM, GPU 보드 DRAM, 패키지 HBM이 각각 배치되는 계층':
      sceneId==='gddr-width-rate'?'비트 버스 폭과 핀 전송률의 이론 대역폭 계산 및 PAM3 신호 높이':
      '보드 GDDR와 HBM 적층 TSV 및 GPU-HBM 연결 레이어 도식'
    }>
      <defs><linearGradient id={'a05gpu'+uid} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#315e7c"/><stop offset=".6" stopColor="#214458"/><stop offset="1" stopColor="#102738"/>
      </linearGradient></defs>
      <path d="M44 44 H563 L592 68 V333 H75 L44 311 Z" fill={'url(#a05gpu'+uid+')'} stroke="#9bdace" strokeWidth="2"/>
      <path d="M563 44 L592 68 V333 L563 309 Z" fill="#15354b" stroke="#86aebd"/>
      <rect x="44" y="44" width="519" height="266" rx="16" stroke="#6a9bb1" fill="#132c43"/>
      <path d="M60 57 H540" stroke="#baf5ea" opacity=".4" strokeWidth="2"/>
      {sceneId==='compute-feeding'&&<>
        <T x={72} y={89} size={21} color="#8bf2d9">GPU 계산 용량과 데이터 공급률</T>
        <Chip x={80} y={132} name={'FEED '+state.feed} detail="toy units/s" accent="#7accf1"/>
        <Chip x={392} y={132} name={'COMPUTE '+state.compute} detail="toy units/s"/>
        <path d="M230 166 H392" fill="none" stroke="#8cfff0" strokeDasharray="8 7" strokeWidth={4+state.feed/8}/>
        <path d="M380 157 L395 166 L380 175 Z" fill="#9dfaea"/>
        <T x={235} y={145} size={12}>공급 → 처리 (겹침)</T>
        <Chip x={223} y={231} w={210} h={60} name={rate.throughput+' toy units/s'} detail={'근사 시간 '+rate.toySeconds+' toy s'} accent="#ffda9e"/>
        <T x={92} y={318} color="#bbdfeb" size={12}>정상상태 완전 파이프라인 · 시작/종료 지연 생략</T>
      </>}
      {sceneId==='memory-family-roles'&&<>
        <T x={69} y={88} size={20} color="#8ef4dc">DRAM 가족은 같아도 설치 위치는 달라요</T>
        <Chip x={69} y={126} w={155} name="CPU 소켓" detail="DDR / RDIMM" accent="#ffd18c"/>
        <Chip x={245} y={126} w={155} name="GPU 보드" detail="GDDR6 / GDDR7" accent="#71d4fa"/>
        <Chip x={420} y={126} w={160} name="GPU 패키지" detail="HBM stack" accent="#83efd9"/>
        <path d="M91 225 H540" stroke="#638da6" strokeDasharray="6 7" strokeWidth="3"/>
        <rect x={73} y="246" width="478" height="54" rx="11" fill="#254f5a" stroke="#87d8cb"/>
        <T x={86} y={269} color="#dffff6" size={14}>{state.family} → {placement[state.family].site}</T>
        <T x={85} y={289} color="#cbe9ea" size={12}>{placement[state.family].disclaimer}</T>
      </>}
      {sceneId==='gddr-width-rate'&&<>
        <T x={70} y={88} size={20} color="#8af1d8">이론 대역폭 = 버스 폭 × 핀 전송률 ÷ 8</T>
        <Chip x={79} y={126} name="BUS 128 bit" detail="교육용 고정 폭" accent="#77dcf8"/>
        <Chip x={385} y={126} name={state.pinRate+' Gb/s/pin'} detail="교육용 가상 값"/>
        <path d="M230 163 H385" stroke="#a0f7e0" strokeWidth="5" strokeDasharray="7 5"/>
        <Chip x={197} y={230} w={262} h={69} name={bandwidth.maxGBps+' GB/s'} detail="100% 효율 상한 toy" accent="#ffe2a3"/>
        <T x={81} y={322} size={13} color="#bbdef0">{state.signal} 신호 높이 {signalLevels(state.signal)}개 · PAM3는 3bit/cycle이 아님</T>
      </>}
      {sceneId==='hbm-tradeoffs'&&<>
        <T x={69} y={86} size={20} color="#a6ffe6">HBM도 DRAM, 연결과 패키징 방법이 달라요</T>
        <Chip x={84} y={135} w={173} name="GPU Compute" detail="연산 코어"/>
        {state.topology==='hbm-stack'?<>
          {Array.from({length:4},(_,i)=><rect key={i} x={405+i*5} y={124+i*17} width="124" height="25" rx="4"
            fill={i%2?'#56bdd2':'#5cd8bb'} stroke="#c4ffe8" strokeWidth="1.5"/>)}
          {Array.from({length:5},(_,i)=><path key={i} d={'M'+(428+i*22)+' 142 v68'} stroke="#ffe2a3" strokeWidth="2"/>)}
          <path d="M258 234 H540" stroke="#ffd9a8" strokeWidth="10"/>
          <T x={386} y={114} color="#c4f9ea" size={13}>HBM 적층 DRAM · TSV</T>
          <T x={275} y={262} color="#ffe6b2" size={13}>GPU ↔ HBM : interposer/연결층</T>
        </>:<>
          <Chip x={388} y={135} w={170} name="GDDR on board" detail="GPU↔PCB trace" accent="#6ccdf1"/>
          <path d="M258 171 H386" stroke="#a0d9f6" strokeWidth="5" strokeDasharray="8 5"/>
          <T x={282} y={245} color="#c7e8ee" size={13}>보드 상 연결과 신호 품질</T>
        </>}
        <T x={91} y={310} color="#c9e4ee" size={12}>{state.showConstraints?pack.tradeoff:'더 넓은 I/O 이점에도 추가 제약이 있을까요?'}</T>
      </>}
      <T x={70} y={366} color="#a8cad5" size={12}>모형/상대 비교만 · 실제 SKU/온도/단위 최적화 보장 아님 · UI 2.5D≠패키징 2.5D</T>
    </svg>
    <div className="a05-readouts" aria-live="polite">
      {sceneId==='compute-feeding'?<>
        <span>계산 능력<b>{state.compute}/s toy</b></span><span>공급 능력<b>{state.feed}/s toy</b></span>
        <span>실효 처리율<b>{rate.throughput}/s toy</b></span><span>예상 시간<b>{rate.toySeconds} toy s</b></span>
      </>:sceneId==='memory-family-roles'?<>
        <span>선택 계열<b>{state.family}</b></span><span>장치 자리<b>{state.site}</b></span>
        <span>정합 여부<b>{placement[state.family].site===state.site?'맞음':'재확인'}</b></span><span>저장 방식<b>모두 DRAM</b></span>
      </>:sceneId==='gddr-width-rate'?<>
        <span>버스 폭<b>128 bit</b></span><span>핀 속도<b>{state.pinRate} Gb/s</b></span>
        <span>이론 대역폭<b>{bandwidth.maxGBps} GB/s</b></span><span>전압 레벨<b>{signalLevels(state.signal)} levels</b></span>
      </>:<>
        <span>토폴로지<b>{state.topology==='hbm-stack'?'HBM stack':'board GDDR'}</b></span>
        <span>저장 셀<b>DRAM</b></span><span>연결<b>{state.topology==='hbm-stack'?'TSV+패키지':'PCB trace'}</b></span>
        <span>제약<b>{state.showConstraints?'비용·열 고려':'탐구 중'}</b></span>
      </>}
    </div>
  </div>;
}
