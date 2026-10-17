import {useId} from 'react';
import {chipletYield,interconnect,packageThermal} from './package06Model';
import type {Package06SceneId,Package06State} from './package06Model';
function T({x,y,children,size=15,color='#e7faf8'}:{x:number;y:number;children:React.ReactNode;size?:number;color?:string}){
 return <text x={x} y={y} fill={color} fontWeight="650" fontSize={size}>{children}</text>;
}
function Piece({x,y,w=146,h=75,title,sub,tint='#9de8d7'}:{x:number;y:number;w?:number;h?:number;title:string;sub:string;tint?:string}){
 return <g><path d={`M${x+8} ${y+8}h${w}v${h}h-${w}Z`} fill="#061929" opacity=".7"/>
 <path d={`M${x} ${y}h${w-17}l17 13v${h-13}h-${w}Z`} fill="#244b64" stroke={tint} strokeWidth="2"/>
 <path d={`M${x} ${y}h${w-17}l17 13h-${w}Z`} fill={tint} opacity=".22"/>
 <T x={x+11} y={y+29} size={17}>{title}</T><T x={x+11} y={y+53} size={12} color="#cee8ee">{sub}</T></g>;
}
export function Package06SceneVisual({sceneId,state,revealed}:{sceneId:Package06SceneId;state:Package06State;revealed:boolean}){
 const uid=useId().replace(/:/g,'');
 if(!revealed)return <div className="a05-veiled" aria-label="제조 공정·KGD 수율·HBM TSV 경로·열의 정답과 수치는 예측하고 직접 실험 전까지 숨겨져 있습니다">
  <div className="a05-veiled-object" aria-hidden="true"><span/></div><p>먼저 예상한 후 공정·검사·배선·열을 직접 조작해 보세요.</p></div>;
 const y=chipletYield(state.density,state.screening,state.assembly),ic=interconnect(state.topology,state.tsv,state.interposer),heat=packageThermal(state.power,state.thermalR);
 return <div className="a05-visual a05-package06-visual" data-testid="package06-visual">
  <svg role="img" viewBox="0 0 660 402" aria-label={
   sceneId==='fab-pattern-to-die'?'현재 학생이 진행한 웨이퍼 적층 제조 공정만 표시한 원본 가상 칩 단면':
   sceneId==='chiplet-yield-model'?'독립 결함/다이검사/4칩 조립과 조건부 KGD 포장 수율 원본 도식':
   sceneId==='hbm-tsv-interposer'?'가상 보드·메모리 내부 수직 TSV와 GPU 옆 실물 interposer 연결의 역할 차이':
   '패키지 정상상태 장난감 전력과 열저항을 분리해 온도 상승을 보는 2.5D 도식'}>
   <defs><linearGradient id={'p06'+uid}><stop stopColor="#2a5a70"/><stop offset="1" stopColor="#10283a"/></linearGradient></defs>
   <path d="M27 55H582l54 40v236L83 360l-56-33Z" stroke="#92eada" strokeWidth="2" fill={'url(#p06'+uid+')'}/>
   <path d="M582 55l54 40v236l-54-29Z" fill="#183a4d" stroke="#719faa"/>
   {sceneId==='fab-pattern-to-die'&&<>
    <T x={57} y={97} size={21} color="#b6fce8">가상 웨이퍼 제조 층: {state.layers}층 · 학생 완료 공정 {state.fab.length}/6</T>
    <ellipse cx="330" cy="226" rx="190" ry="77" fill="#24495e" stroke="#bce4e7" strokeWidth="4"/>
    {Array.from({length:state.layers},(_,i)=><g key={i}>
     <path d={`M${171-i*7} ${231-i*32} Q330 ${150-i*32} ${489+i*7} ${231-i*32} L${483+i*7} ${248-i*32}Q330 ${166-i*32} ${177-i*7} ${248-i*32}Z`} fill={i===0?'#538795':'#a3d4d1'} opacity=".88"/>
     {state.fab.includes('photo')&&Array.from({length:5},(_,j)=><rect key={j} x={233+j*37} y={186-i*30} width="23" height="8" fill="#f0d3a9" stroke="#fef6d8"/>)}
    </g>)}
    {state.defect&&<circle cx="426" cy="220" r="18" fill="#e4a8aa" stroke="#fff0c6" strokeWidth="3"/>}
    <T x={54} y={316} size={14}>완료: {state.fab.join(' → ')||'아직 없음'}</T>
    <T x={57} y={341} size={12}>결함 마커 {state.defect?'ON':'OFF'} · 포토 한 번=완성칩 아님</T>
   </>}
   {sceneId==='chiplet-yield-model'&&<>
    <T x={55} y={95} size={19} color="#acfae5">독립 결함 포아송 toy · D={state.density}/mm²</T>
    <Piece x={58} y={151} w={180} title="1×100 mm²" sub={'Y = '+y.mono.toFixed(5)} tint="#a8d6fe"/>
    {Array.from({length:4},(_,i)=><g key={i}>
      <rect x={290+(i%2)*58} y={151+Math.floor(i/2)*51} width="46" height="40" fill={state.screening==='KGD'?'#86d6c9':'#b6c6d5'} stroke="#e8edcf" strokeWidth="2"/>
      <T x={303+(i%2)*58} y={174+Math.floor(i/2)*51} size={11} color="#11344a">{i+1}</T>
    </g>)}
    <Piece x={440} y={151} w={177} title={state.screening==='KGD'?'KGD 4개':'무선별 4개'} sub={'pkg pass '+y.packageSuccess.toFixed(5)} tint="#f5d7a1"/>
    <T x={64} y={292} size={15}>작은 die 개별 Y = {y.individual.toFixed(6)}</T>
    <T x={64} y={318} size={14}>4개 무선별 동시 양품 Y = {y.fourUnscreened.toFixed(6)}</T>
    <T x={64} y={340} size={12}>KGD ideal {state.screening==='KGD'?'ON':'OFF'} · Assembly {state.assembly*100}% · 평균 후보 {y.expectedCandidatesForOnePackage.toFixed(3)}개</T>
   </>}
   {sceneId==='hbm-tsv-interposer'&&<>
    <T x={55} y={99} size={19} color="#b8fbe6">가상 HBM 제조 연결 ≠ UI 시각화 방식 2.5D</T>
    <Piece x={63} y={163} w={169} title={state.topology==='board'?'GPU board':'GPU compute'} sub="GPU 다이" tint="#a5d7fc"/>
    {state.topology==='board'?<>
     <path d="M230 217H453" stroke="#7cdce2" strokeWidth="4" strokeDasharray="9 6"/>
     <Piece x={456} y={163} w={166} title="GDDR board" sub="PCB traces"/>
    </>:<>
     <rect x="225" y="247" width="247" height="24" rx="6" fill="#5c93a4" stroke="#a9e9e1" strokeWidth="3"/>
     <Piece x={466} y={132} w={153} h={72} title="HBM stack" sub="multiple DRAM dies" tint="#f5cfac"/>
     {Array.from({length:4},(_,i)=><rect key={i} x={479} y={208+i*12} width="122" height="9" fill="#71c2bb" stroke="#d0eade" strokeWidth="1.3"/>)}
     {state.tsv&&Array.from({length:5},(_,i)=><path key={i} d={`M${491+i*23} 210v51`} stroke="#ffe3a4" strokeWidth="2.8"/>)}
     {state.topology==='interposer'&&<path d="M236 255H478" stroke="#f0ca8d" strokeWidth="4" strokeDasharray="8 6"/>}
    </>}
    <T x={66} y={305} size={13}>경로: {ic.externalToGpu}</T>
    <T x={66} y={327} size={12}>스택 내부 {ic.insideHbm} · {state.interposer} 배선판 후보</T>
    <T x={65} y={348} size={12}>칩 사이 interposer/redistribution ≠ DRAM 스택 내부 TSV</T>
   </>}
   {sceneId==='package-power-heat'&&<>
    <T x={56} y={99} size={20} color="#b9fce2">정상상태 단일 열 경로 근사 (실칩 아님)</T>
    <Piece x={61} y={160} title={state.power+' W'} sub="패키지 발열" tint="#ffc7a3"/>
    <path d="M211 194H278" stroke="#f0a993" strokeWidth="5"/>
    <Piece x={282} y={160} title={state.thermalR+' K/W'} sub="가상 방열 경로"/>
    <path d="M430 194H471" stroke="#a3efdd" strokeWidth="5"/>
    <Piece x={475} y={160} w={145} title={heat.deltaK+' K'} sub="주위 대비 상승" tint="#f0dda3"/>
    <T x={64} y={294} size={18}>ΔT = P × Rθ = {heat.deltaK.toFixed(1)} K</T>
    <T x={64} y={324} size={14}>주위 25°C → toy 접합 {heat.junctionToyC.toFixed(1)}°C</T>
    <T x={64} y={348} size={12}>HBM/GPU 다중 열경로·시간변화·실제 접합온도는 계산하지 않습니다.</T>
   </>}
   <T x={55} y={383} size={11} color="#a9cfd8">교육용 가상 원본 SVG · 실제 2.5D 패키지 성능/수율·부품 규격 인증 자료 아님</T>
  </svg>
  <div className="a05-readouts">
   {sceneId==='fab-pattern-to-die'?<>
    <span>완료 단계<b>{state.fab.length}/6</b></span><span>정합 순서<b>{state.fab.length===6?'수행 완료':'미완성'}</b></span><span>가상 층<b>{state.layers}</b></span><span>결함 마커<b>{state.defect?'ON':'OFF'}</b></span>
   </>:sceneId==='chiplet-yield-model'?<>
    <span>단일100mm²<b>{y.mono}</b></span><span>작은25mm² 1개<b>{y.individual}</b></span>
    <span>모든 4다이 통과 (무선별)<b>{y.fourUnscreened}</b></span>
    <span>선택한 package 성공<b>{y.packageSuccess}</b></span><span>KGD 후보 개수 기대치<b>{y.expectedCandidatesForOnePackage}</b></span>
   </>:sceneId==='hbm-tsv-interposer'?<>
    <span>현재 구조<b>{state.topology}</b></span><span>GPU↔외부 메모리<b>{ic.externalToGpu}</b></span>
    <span>HBM 내부<b>{ic.insideHbm}</b></span><span>인터포저 후보<b>{state.interposer}</b></span>
   </>:<>
    <span>발열<b>{heat.powerW} W</b></span><span>열저항<b>{heat.thermalR} K/W</b></span><span>ΔT<b>{heat.deltaK} K</b></span><span>가상 Tj<b>{heat.junctionToyC} °C</b></span>
   </>}
  </div>
  <p className="a05-note">모든 수치는 독립 조건을 명시한 가상 정착 모델입니다. 조건부 선별 확률과 물리 열 저항을 실제 제품 성능으로 단정할 수 없습니다.</p>
 </div>;
}
