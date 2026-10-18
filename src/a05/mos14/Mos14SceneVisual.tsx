import {useId} from 'react';
import {mos14Current,mos14Cv,mos14OxideCurrent,mos14OxidePhysics,mos14Surface} from './mos14Model';
import type {Mos14SceneId,Mos14State} from './mos14Model';
function CapLabel({x,y,text,color='#e7fbff'}:{x:number;y:number;text:string;color?:string}){
 return <text x={x} y={y} fontSize="15" fill={color} fontWeight="650">{text}</text>;
}
export function Mos14SceneVisual({sceneId,state,revealed}:{
 sceneId:Mos14SceneId;state:Mos14State;revealed:boolean;
}){
 const uid=useId().replace(/:/g,'');
 if(!revealed)return <div className="a05-veiled" aria-label="MOS 실험 정답·계산 수치는 예측 전에 공개하지 않습니다">
  <div className="a05-veiled-object" aria-hidden="true"><span/></div>
  <p>먼저 예상하고 조건을 조작하면 전하·전압 결과를 관찰할 수 있어요.</p>
 </div>;
 const surface=mos14Surface(state.gateV,state.oxideNm),geom=mos14OxidePhysics(state.oxideNm),
 cv=mos14Cv(state.oxideNm,state.showCv),current=mos14Current(state),ig=mos14OxideCurrent(state.phase);
 const inv=surface==='inversion',acc=surface==='accumulation';
 const carriers=Array.from({length:11},(_,i)=>i);
 return <div className="a05-visual a05-mos14-visual" data-testid="mos14-visual">
  <svg viewBox="0 0 650 405" role="img" aria-label="A05 원본 MOS 2.5D 단면: 위 금속 게이트, 절연 산화막, 아래 p형 실리콘과 전하 상태">
   <defs>
    <linearGradient id={'gate'+uid} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#a4eaf6"/><stop offset="1" stopColor="#287695"/></linearGradient>
    <linearGradient id={'silicon'+uid} x1="0" x2="0" y1="0" y2="1"><stop stopColor="#2d6870"/><stop offset="1" stopColor="#0a283c"/></linearGradient>
   </defs>
   <g data-scene-subject="mos14-device" data-scene-id={sceneId}>
   <path d="M70 170 L510 170 L565 207 L125 207 Z" fill="#aef3da" opacity=".28"/>
   <path d="M70 207 H510 L565 235 H125 Z" fill="#16394a" stroke="#8de9db"/>
   <rect x="80" y="221" width="450" height="149" rx="9" fill={'url(#silicon'+uid+')'} stroke="#6fbdba" strokeWidth="2"/>
   <path d="M80 221 l42 -20 h450 l-42 20 Z" fill="#578a87" opacity=".48"/>
   <rect x="187" y={state.oxideNm===5?175:164} width="247" height={state.oxideNm===5?31:42} rx="4" fill="#d1e1a4" opacity=".9" stroke="#eefecc"/>
   <path d="M184 174 l32 -23 h241 l-23 23 Z" fill="#e8f9b6" opacity=".75"/>
   <rect x="187" y="120" width="247" height="54" rx="5" fill={'url(#gate'+uid+')'} stroke="#b2ecff" strokeWidth="2"/>
   <path d="M187 120 l26 -22 h242 l-21 22 Z" fill="#b7faff" opacity=".69"/>
   <CapLabel x={270} y={150} text="METAL GATE" color="#072639"/>
   <CapLabel x={265} y={197} text={'SiO₂ '+state.oxideNm+' nm'} color="#183e3f"/>
   <CapLabel x={285} y={350} text="p-Si body"/>
   <path d="M309 97 V49 H448" stroke="#f1b4ca" strokeWidth="5" fill="none"/>
   <circle cx="309" cy="49" r="11" fill="#edbbbf" stroke="#ffeada"/>
   <CapLabel x={460} y={53} text={'VGB '+state.gateV+' V'} color="#ffd5db"/>
   {state.device==='nmos'&&<>
     <path d="M92 244 H177 V308 H92 Z" fill="#47a7ee" opacity=".68" stroke="#9bd8ff"/>
     <path d="M443 244 H520 V308 H443 Z" fill="#47a7ee" opacity=".68" stroke="#9bd8ff"/>
     <CapLabel x={101} y={278} text="n+ S"/><CapLabel x={459} y={278} text="n+ D"/>
     <path d="M116 244 V224 H56" fill="none" stroke="#b5dcff" strokeWidth="3"/>
     <path d="M476 244 V224 H598" fill="none" stroke="#b5dcff" strokeWidth="3"/>
     <CapLabel x={540} y={208} text={'VDS '+state.vds+' V'}/>
   </>}
   <g aria-label="음의 고정 acceptor 이온은 p-Si 내 움직이지 않아요">
    {carriers.slice(0,9).map(i=><g key={'fixed'+i}>
     <circle cx={191+(i%5)*55} cy={282+Math.floor(i/5)*54} r="11" fill="#772f4c" stroke="#ffb7bc"/>
     <CapLabel x={186+(i%5)*55} y={287+Math.floor(i/5)*54} text="−" color="#fff"/>
    </g>)}
   </g>
   {(acc?carriers:inv?carriers.slice(0,2):surface==='flatband'?carriers.slice(0,5):carriers.slice(0,1)).map(i=>
    <g key={'h'+i} aria-label="정공(+), 이동 캐리어">
     <circle cx={146+i*33} cy={241+(i%2)*17} r="9" fill="#ffa8ae" stroke="#fff1da"/>
     <text x={142+i*33} y={245+(i%2)*17} fontSize="12" fill="#55272a">+</text>
    </g>)}
   {(inv?carriers:surface==='depletion'?carriers.slice(0,2):carriers.slice(0,1)).map(i=>
    <g key={'e'+i} aria-label="전자(−), 이동 캐리어">
     <circle cx={147+i*32} cy={226-(i%2)*5} r="8" fill="#9bd7ff" stroke="#f5ffff"/>
     <text x={144+i*32} y={230-(i%2)*5} fontSize="12" fill="#16315c">−</text>
    </g>)}
   <path d="M550 165 V249" stroke="#d9eaff" strokeWidth="2" strokeDasharray="5 5"/>
   <path d="M542 237 l8 12 l8 -12" fill="none" stroke="#d9eaff" strokeWidth="3"/>
   <CapLabel x={539} y={163} text="E field"/>
   {state.phase==='switching'&&<g><path d="M460 48 H550" stroke="#fff1bd" strokeWidth="3"/><path d="M540 41 l12 7 -12 7" fill="none" stroke="#fff1bd" strokeWidth="3"/><CapLabel x={462} y={85} text="charging"/></g>}
   </g>
   <CapLabel x={85} y={394} text="이온(고정) ◉   정공(+) ●   전자(−) ●  |  전하 개수는 정성적 도식" color="#cde2dd"/>
  </svg>
  <div className="a05-readouts">
   {sceneId==='mos-oxide-field-without-dc-path'&&<>
    <div><span>절연막 통과 정상 DC</span><strong>0 A (ideal)</strong></div>
    <div><span>게이트 외부 충전 경로</span><strong>{ig.externalChargeTransientPossible?'전압 변경 중 가능':'정착 시 변화 없음'}</strong></div>
    <div><span>전계에 반응하는 표면</span><strong>변화 가능</strong></div>
   </>}
   {sceneId==='mos-accumulation-depletion-inversion'&&<>
    <div><span>표면 상태 (준평형)</span><strong>{surface}</strong></div>
    <div><span>이 모형 VFB</span><strong>0 V (특수 가정)</strong></div>
    <div><span>계산된 toy VT</span><strong>{geom.vtV.toFixed(3)} V</strong></div>
   </>}
   {sceneId==='mos-oxide-capacitance-cv'&&<>
    <div><span>산화막 C′ox</span><strong>{cv.coxMicroFPerCm2.toFixed(6)} µF/cm²</strong></div>
    <div><span>이상 tox</span><strong>{state.oxideNm} nm</strong></div>
    <div><span>C′dep 직렬 예시</span><strong>{state.showCv?cv.depletionSeriesToyMicroFPerCm2.toFixed(4)+' µF/cm²':'C–V 확장 대기'}</strong></div>
    {state.showCv&&<div><span>정성적 반전 C–V</span><strong>HF≈Cmin · LF↗Cox (실측 아님)</strong></div>}
   </>}
   {sceneId==='mos-cap-to-nmosfet-bridge'&&<>
    <div><span>구조</span><strong>{state.device==='capacitor'?'2단자 MOS capacitor':'S/D 부착 nMOS'}</strong></div>
    <div><span>순 드레인 전류 ID</span><strong>{current.drainCurrent==='undefined'?'정의되지 않음':current.drainCurrent==='zero'?'0 (이상 순 DC)':current.drainCurrent==='possible'?'흐를 수 있음':'강한 반전 보장 없음'}</strong></div>
    <div><span>게이트 산화막</span><strong>이상 DC 절연</strong></div>
   </>}
  </div>
  <p className="a05-note">전압 전환 후 충분히 시간이 지난 준평형 그림이며, 급속 스윕에서는 deep depletion이 생길 수 있습니다. 산화막 C′ox와 실제 측정된 게이트 C–V는 구분하세요.</p>
 </div>;
}
