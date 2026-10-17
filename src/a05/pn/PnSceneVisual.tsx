import {useId} from 'react';
import type {ReactNode} from 'react';
import {bandMaterial,depletion,diodeCurrent,dopantModel,gateContrast,pnEquilibrium} from './pnModel';
import type {BandMaterial,BiasV,DiodeBiasV,Dopant,GateComparison,JunctionPhase,PnSceneId} from './pnModel';
export interface PnVisualState{
 material:BandMaterial;light:boolean;warm:boolean;
 dopant:Dopant;phase:JunctionPhase;
 bias:BiasV;na:number;nd:number;
 diodeBias:DiodeBiasV;gate:GateComparison;
}
function Label({x,y,children,color='#e6f8ff',size=14}:{x:number;y:number;children:ReactNode;color?:string;size?:number}){
 return <text x={x} y={y} fontSize={size} fontWeight="650" fill={color}>{children}</text>;
}
function Tile({x,y,w=135,h=74,name,sub,accent='#72ebce'}:{
 x:number;y:number;w?:number;h?:number;name:string;sub:string;accent?:string
}){return <g>
 <rect x={x+7} y={y+9} width={w} height={h} rx="11" fill="#061b2b" opacity=".7"/>
 <path d={`M${x} ${y} h${w-14} l14 13 v${h-13} h-${w} Z`} fill="#24485c" stroke={accent} strokeWidth="2"/>
 <path d={`M${x} ${y} h${w-14} l14 13 h-${w} Z`} fill={accent} opacity=".27"/>
 <Label x={x+11} y={y+28} size={15}>{name}</Label>
 <Label x={x+11} y={y+50} size={12} color="#cce6ed">{sub}</Label>
</g>;}
const BLUE='#8bdaff',MINT='#8bf0d4',GOLD='#ffe2a1';
export function PnSceneVisual({sceneId,state,revealed}:{sceneId:PnSceneId;state:PnVisualState;revealed:boolean}){
 const key=useId().replace(/:/g,'');
 if(!revealed)return <div className="a05-veiled" aria-label="PN 실험 관찰과 수치는 예측 전에 가려져 있습니다">
  <div className="a05-veiled-object" aria-hidden="true"><span/></div>
  <p>먼저 예상해 주세요. 선택하면 밴드·실리콘 내부가 보입니다.</p>
 </div>;
 const band=bandMaterial(state.material,state.light,state.warm);
 const dop=dopantModel(state.dopant),junction=pnEquilibrium(state.phase);
 const dep=depletion(state.bias,state.na,state.nd),diode=diodeCurrent(state.diodeBias);
 const mos=gateContrast(state.gate);
 const metric=state.material==='metal'?0:state.material==='silicon'?40:112;
 return <div className="a05-visual a05-pn-visual">
  <svg viewBox="0 0 650 415" role="img" aria-label={
   sceneId==='semiconductor-band-gap'?'전자 허용 에너지띠 및 밴드갭 2.5D 차트':
   sceneId==='silicon-donor-acceptor-doping'?'P donor n형, B acceptor p형 실리콘 도핑 결정층':
   sceneId==='pn-diffusion-drift-equilibrium'?'PN 접합 n 양 고정 이온과 p 음 고정 이온의 공핍 및 내장 전계':
   sceneId==='pn-bias-depletion-calculator'?'순/역 PN 접합 바이어스에 따른 공핍폭 마이크로미터 절개도':
   'PN 다이오드 전압별 지수 전류와 절연 MOS 게이트 구조 차이'
  }>
   <defs><linearGradient id={'pnW'+key} x1="0" x2="1" y1="0" y2="1">
    <stop stopColor="#366d85"/><stop offset=".6" stopColor="#244559"/><stop offset="1" stopColor="#11263a"/>
   </linearGradient></defs>
   <path d="M43 41 H563 L595 71 V342 H76 L43 313 Z" fill={'url(#pnW'+key+')'} stroke="#9bd6da" strokeWidth="2"/>
   <path d="M563 41 L595 71 V342 L563 310 Z" fill="#163348" stroke="#79a6b6"/>
   <rect x="43" y="41" width="520" height="271" rx="15" fill="#152e42" stroke="#7fabb9"/>
   <path d="M61 54 H540" stroke="#bffff3" opacity=".35" strokeWidth="2"/>
   {sceneId==='semiconductor-band-gap'&&<>
    <Label x={77} y={84} size={20} color={MINT}>가운데 틈은 실리콘의 물리적 구멍이 아니에요</Label>
    <path d="M128 133 V288" stroke="#cde5ef" strokeWidth="3"/>
    <Label x={79} y={118} size={12} color="#c4dbe7">에너지 ↑</Label>
    <rect x="181" y="133" width="334" height="37" rx="8" fill="#4488ac" stroke={BLUE}/>
    <rect x="181" y={170+metric} width="334" height="38" rx="8" fill="#36a693" stroke={MINT}/>
    <Label x={205} y={157}>전도띠 Ec</Label>
    <Label x={205} y={196+metric} size={14}>원자가띠 Ev</Label>
    {metric>0&&<path d={`M491 177 V${169+metric}`} stroke={GOLD} strokeWidth="3" strokeDasharray="5 5"/>}
    <Label x={205} y={221+metric/2} color={GOLD} size={14}>Eg {band.gapEV.toFixed(1)} eV {state.material==='silicon'?'(Si toy)':''}</Label>
    {band.excited&&<>
     <circle cx="492" cy="125" r="9" fill={GOLD}/><circle cx="470" cy={215+metric} r="9" fill="none" stroke={GOLD} strokeWidth="3"/>
     <Label x={325} y={300} color={GOLD} size={12}>열·빛 여기 → 전자와 정공 빈자리</Label>
    </>}
   </>}
   {sceneId==='silicon-donor-acceptor-doping'&&<>
    <Label x={76} y={84} size={20} color={MINT}>실리콘 격자 속 한 장의 도핑 카드 (농도 아님)</Label>
    {Array.from({length:10},(_,i)=>{
     const x=100+(i%5)*89,y=117+Math.floor(i/5)*92;
     return <g key={i}>
      <rect x={x} y={y} width="68" height="65" rx="12" fill={i===7&&state.dopant!=='intrinsic'?'#806345':'#235069'}
       stroke={i===7?GOLD:BLUE} strokeWidth="2"/>
      <Label x={x+18} y={y+38} color="#d8f9ed">{i===7&&state.dopant==='donor'?'P':i===7&&state.dopant==='acceptor'?'B':'Si'}</Label>
     </g>;
    })}
    <Label x={89} y={329} color={MINT} size={13}>다수: {dop.majority} · 소수 운반자 ≠ 0 · bulk 거의 중성</Label>
   </>}
   {sceneId==='pn-diffusion-drift-equilibrium'&&<>
    <Label x={75} y={86} size={19} color={MINT}>PN 접합: 고정 이온과 반대의 두 흐름</Label>
    <Tile x={78} y={132} w={220} h={129} name="n형 실리콘" sub="고정 양(+) donor 이온" accent={BLUE}/>
    <Tile x={352} y={132} w={212} h={129} name="p형 실리콘" sub="고정 음(−) acceptor 이온" accent={GOLD}/>
    {junction.contact&&<>
     <rect x="286" y="136" width="76" height="121" rx="10" fill="#a68c78" opacity=".55" stroke="#ffeeae"/>
     <Label x={299} y={185} color="#fff5cb">+ | −</Label>
     <path d="M270 203 H392" stroke={GOLD} strokeWidth="5"/>
     <path d="M375 194 L392 203 L375 212 Z" fill={GOLD}/>
     <Label x={259} y={129} color={GOLD} size={12}>E: n+ → p−</Label>
    </>}
    {state.phase==='equilibrium'&&<>
     <Label x={111} y={284} size={14} color={MINT}>확산 전류 +1</Label>
     <Label x={373} y={284} size={14} color={BLUE}>drift −1</Label>
     <Label x={207} y={318} color={GOLD} size={14}>합 0 · 완전히 멈춘 것이 아님</Label>
    </>}
   </>}
   {sceneId==='pn-bias-depletion-calculator'&&<>
    <Label x={75} y={86} size={19} color={MINT}>공핍폭 W(µm) · p 단자 대비 n 단자 Va</Label>
    <rect x="94" y="132" width="445" height="121" rx="12" fill="#234c65" stroke="#8ddde6"/>
    <rect x="312" y="132" width="227" height="121" fill="#4a3d57" opacity=".65"/>
    <Label x={142} y={170} color={BLUE} size={17}>n-type (+)</Label>
    <Label x={393} y={170} color={GOLD} size={17}>p-type (−)</Label>
    <rect x={316-dep.nMicrons*190} y="151" width={Math.max(2,dep.widthMicrons*190)} height="80"
     rx="6" fill="#c6b38a" opacity=".67" stroke="#ffe7a3"/>
    <path d="M265 250 H353" stroke={MINT} strokeWidth="3"/>
    <Label x={106} y={285} color={MINT} size={14}>W = {dep.widthMicrons.toFixed(4)}µm · Va = {state.bias.toFixed(1)}V</Label>
    <Label x={105} y={308} color="#d3e7ef" size={12}>Vbi = {dep.builtInV.toFixed(3)}V (내부 전위, 외부 배터리 아님)</Label>
   </>}
   {sceneId==='pn-diode-current-to-mos'&&<>
    <Label x={75} y={83} size={19} color={MINT}>다이오드 지수 전류 vs 절연 게이트 전계</Label>
    <Tile x={87} y={129} w={210} h={100} name="PN diode" sub="주입 전류 · V에 따라 비선형" accent={BLUE}/>
    <Tile x={357} y={129} w={210} h={100} name="MOS gate" sub="산화막 절연 · 전계 제어" accent={MINT}/>
    <path d="M299 173 H351" stroke={GOLD} strokeWidth="4" strokeDasharray="8 6"/>
    <Label x={104} y={262} color={state.gate==='mos'?MINT:GOLD} size={14}>
     {state.gate==='mos'?'게이트 산화막: DC 경로 아님':'다이오드 PN 접합: 전하 주입'}
    </Label>
    <Label x={98} y={293} color="#c8e4eb" size={13}>V={diode.volts.toFixed(1)}V · I={diode.currentNanoA.toFixed(3)} nA</Label>
    <Label x={97} y={314} color="#dfc894" size={12}>0.7V 고정 ON 문턱 아님 · 역항복 제외</Label>
   </>}
   <Label x={76} y={378} color="#adced9" size={12}>에너지·격자·공핍폭 toy 모형 · 실제 구조 축척과 제품 측정값 아님</Label>
  </svg>
  <div className="a05-readouts" aria-live="polite">
   {sceneId==='semiconductor-band-gap'?<>
    <span>밴드 소재<b>{state.material}</b></span><span>Eg 모형<b>{band.gapEV.toFixed(1)} eV</b></span>
    <span>열/빛 여기<b>{band.excited?'e−/정공 생성 가능':'선택 안 함'}</b></span><span>빈자리<b>실제 구멍 아님</b></span>
   </>:sceneId==='silicon-donor-acceptor-doping'?<>
    <span>도핑<b>{state.dopant}</b></span><span>다수 운반자<b>{dop.majority}</b></span>
    <span>고정 이온<b>{dop.fixedIon}</b></span><span>벌크 순전하<b>대체로 중성</b></span>
   </>:sceneId==='pn-diffusion-drift-equilibrium'?<>
    <span>상태<b>{state.phase}</b></span><span>내장 전계<b>n(+) → p(−)</b></span>
    <span>확산 + drift<b>{junction.diffusionToy} + {junction.driftToy} (toy)</b></span><span>순 DC 전류<b>{junction.netCurrentToy} (toy)</b></span>
   </>:sceneId==='pn-bias-depletion-calculator'?<>
    <span>Va (p−n)<b>{state.bias.toFixed(1)} V</b></span><span>내장 전위<b>{dep.builtInV.toFixed(4)} V</b></span>
    <span>공핍폭 W<b>{dep.widthMicrons.toFixed(4)} µm</b></span><span>좌/우 부분<b>{dep.nMicrons.toFixed(3)} / {dep.pMicrons.toFixed(3)} µm</b></span>
   </>:<>
    <span>다이오드 전압<b>{diode.volts.toFixed(1)} V</b></span><span>정류 전류<b>{diode.currentNanoA.toFixed(3)} nA</b></span>
    <span>MOS 절연막<b>{mos.hasInsulator?'있음':'PN 모형'}</b></span><span>저항 선형 비교<b>{diode.compareResistorMilliA.toFixed(3)} mA</b></span>
   </>}
  </div>
 </div>;
}
