import {useId} from 'react';
import {clockTimeline,evaluateNetwork,gateLogic,initialClockHighNoEdge,latchCase,metastability,timingToy} from './logic16Model';
import type {Logic16SceneId,Logic16State} from './logic16Model';
function T({x,y,children,color='#dff9ff',size=14}:{x:number;y:number;children:React.ReactNode;color?:string;size?:number}){
 return <text x={x} y={y} fill={color} fontWeight="650" fontSize={size}>{children}</text>;
}
function Block({x,y,w=150,h=70,top,bottom,tint='#81e4d1'}:{x:number;y:number;w?:number;h?:number;top:string;bottom:string;tint?:string}){
 return <g><path d={`M${x} ${y} h${w-16} l16 13 v${h-13} h-${w} Z`} fill="#20415b" stroke={tint} strokeWidth="2"/>
  <path d={`M${x} ${y} h${w-16} l16 13 h-${w} Z`} fill={tint} opacity=".32"/>
  <T x={x+11} y={y+29} size={17}>{top}</T><T x={x+11} y={y+51} size={12} color="#c2dce7">{bottom}</T></g>;
}
export function Logic16SceneVisual({sceneId,state,revealed}:{sceneId:Logic16SceneId;state:Logic16State;revealed:boolean}){
 const uid=useId().replace(/:/g,'');
 if(!revealed)return <div className="a05-veiled" aria-label="논리/클록 정답 및 결과는 먼저 예측·조작하기 전엔 숨겨져 있습니다">
  <div className="a05-veiled-object" aria-hidden="true"><span/></div><p>먼저 예상하고 회로 입력이나 시간을 조절해 실험을 열어 보세요.</p>
 </div>;
 const gateOut=gateLogic(state.gate,state.a,state.b);
 const net=evaluateNetwork(state.gate,state.pun,state.pdn);
 const clk=clockTimeline(state.eventIndex),tim=timingToy(state.period,state.buffer);
 return <div className="a05-visual a05-logic16-visual" data-testid="logic16-visual">
  <svg viewBox="0 0 660 388" role="img" aria-label="A05 자체 제작 2.5D 회로 단면과 입력·기억·지연 관찰; 확정된 정답은 선행 실험 후 표시">
   <defs><linearGradient id={'logic16'+uid}><stop stopColor="#285873"/><stop offset="1" stopColor="#10293d"/></linearGradient></defs>
   <path d="M31 59 H578 L631 96 V334 L85 357 L31 320 Z" fill={'url(#logic16'+uid+')'} stroke="#9de9d6" strokeWidth="2"/>
   <path d="M578 59 L631 96 V334 L578 299 Z" fill="#17394d" stroke="#74aabb"/>
   {sceneId==='logic-nand-nor-truth-table'&&<>
    <T x={65} y={95} size={21} color="#9ef9d8">CMOS 2입력 · {state.gate}</T>
    <Block x={76} y={136} w={130} top={'A '+state.a} bottom="입력 1" tint="#6acbf2"/>
    <Block x={76} y={228} w={130} top={'B '+state.b} bottom="입력 2" tint="#6acbf2"/>
    <path d="M210 168 H278 M210 255 H278 V168" fill="none" stroke="#7bdde7" strokeWidth="4"/>
    <path d="M262 157 L278 168 L262 178" fill="none" stroke="#97ffe5" strokeWidth="4"/>
    <Block x={293} y={177} w={132} h={75} top={state.gate} bottom="정착 후 toy" tint="#e7b1ed"/>
    <path d="M428 209 H472" stroke="#aefce6" strokeWidth="5"/>
    <Block x={472} y={173} w={119} top={'OUT '+gateOut} bottom="0 / 1" tint="#ffdba0"/>
    <T x={83} y={329} size={13}>PUN(pMOS) 선택: {state.pun} | PDN(nMOS) 선택: {state.pdn}</T>
    <T x={87} y={348} size={12} color="#bde7df">{net.selected?(net.correct?'선택 회로는 정합':'선택 회로의 물리 경로를 재검토'):'위아래 네트워크를 각각 선택하세요'}</T>
   </>}
   {sceneId==='combinational-vs-sequential-memory'&&<>
    <T x={64} y={96} size={21} color="#a1fce8">현재 입력과 이전에 저장된 Q</T>
    <Block x={67} y={153} w={141} top={'D '+state.d} bottom="현재 데이터" tint="#73cff8"/>
    <Block x={261} y={153} w={153} top={'G '+state.g} bottom="래치 게이트"/>
    <Block x={465} y={153} w={141} top={'Q '+(state.q===null?'?':state.q)} bottom={state.powered?'전원 ON':'POWER OFF'} tint="#ffe1aa"/>
    <path d="M209 188 H259 M414 188 H462" stroke="#a1fbd8" strokeWidth="5" strokeDasharray="7 6"/>
    <path d="M537 223 V290 H305 V224" fill="none" stroke="#b6e1ff" strokeWidth="4" strokeDasharray="6 5"/>
    <T x={334} y={285} size={13}>Q 피드백 경로 (전원 필요)</T>
    <T x={76} y={338} size={13} color="#f6d4b9">동일한 현재 D=0에서도 Q는 지난 유효 이력에 달라집니다.</T>
   </>}
   {sceneId==='d-latch-vs-d-flip-flop'&&<>
    <T x={56} y={95} size={19} color="#a2fde6">클록 타임라인 · t{clk.t} ns (교육용 이벤트)</T>
    <T x={55} y={132} size={13}>D</T><T x={55} y={198} size={13}>CLK</T>
    <path d="M96 155 H610 M96 222 H610" stroke="#6192a6" strokeWidth="1.5" strokeDasharray="5 5"/>
    {[0,2,3,4,5,6,8].map((t,i)=><g key={t}>
     <T x={111+i*76} y={267} size={12} color={state.eventIndex===i?'#fff0b3':'#a6d7e2'}>{t}ns</T>
     {i<=state.eventIndex&&<g>
      <circle cx={120+i*76} cy={145-(clockTimeline(i).d*24)} r="7" fill="#8de1ff"/>
      <circle cx={120+i*76} cy={207-(clockTimeline(i).clock*24)} r="7" fill="#aef9d6"/>
     </g>}
    </g>)}
    <path d={Array.from({length:state.eventIndex+1},(_,i)=>`${i===0?'M':'L'}${120+i*76} ${145-(clockTimeline(i).d*24)}`).join(' ')} fill="none" stroke="#8de1ff" strokeWidth="3"/>
    <path d={Array.from({length:state.eventIndex+1},(_,i)=>`${i===0?'M':'L'}${120+i*76} ${207-(clockTimeline(i).clock*24)}`).join(' ')} fill="none" stroke="#aef9d6" strokeWidth="3"/>
    <Block x={83} y={291} w={205} h={61} top={'Latch Q '+clk.latchQ} bottom="HIGH 동안 D 따라감"/>
    <Block x={341} y={291} w={227} h={61} top={state.initialHigh?'DFF Q ?':'DFF Q '+clk.ffQ} bottom="실제 0→1 사건에서 샘플" tint="#f9d3a3"/>
   </>}
   {sceneId==='setup-hold-metastability-clock'&&<>
    <T x={58} y={96} size={21} color="#9dfbe5">한 클록 도메인 · T {tim.period}ns · 버퍼 {state.buffer?'ON':'OFF'}</T>
    <T x={66} y={146} size={15}>Setup · 가장 늦은 경로</T>
    <rect x="66" y="157" width="500" height="22" rx="6" fill="#274c64"/>
    <rect x="66" y="157" width={tim.setupRequired/tim.period*500} height="22" rx="6" fill={tim.setupPass?'#7edbc5':'#eea69b'}/>
    <T x={69} y={201} size={14}>필요 {tim.setupRequired.toFixed(1)}ns / T {tim.period}ns</T>
    <T x={67} y={244} size={15}>Hold · 가장 빠른 경로</T>
    <rect x="66" y="258" width="500" height="22" rx="6" fill="#274c64"/>
    <rect x="66" y="258" width={tim.holdArrival/.8*500} height="22" rx="6" fill={tim.holdPass?'#7edbc5':'#eea69b'}/>
    <T x={68} y={308} size={14}>도착 {tim.holdArrival.toFixed(1)}ns / 최소 0.8ns</T>
    <T x={70} y={345} size={13} color="#f8dbb5">{state.hazard?'에지 근처 입력 변화: 메타안정성 위험, 실제 Q는 보증할 수 없음':'조건은 0 skew/jitter인 장난감 STA'}</T>
   </>}
   <T x={61} y={378} size={11} color="#a8ccd6">실리콘 2.5D 실물 패키지 아님 · 본 도식은 교육용 가상 스위칭/지연</T>
  </svg>
  <div className="a05-readouts">
   {sceneId==='logic-nand-nor-truth-table'?<>
    <span>게이트<b>{state.gate}</b></span><span>A/B<b>{state.a} / {state.b}</b></span>
    <span>출력 (정착)<b>{gateOut}</b></span><span>PUN/PDN<b>{net.selected?(net.correct?'정합':'불일치'):'미선택'}</b></span>
   </>:sceneId==='combinational-vs-sequential-memory'?<>
    <span>D / G<b>{state.d} / {state.g}</b></span><span>래치 Q<b>{state.q===null?'보증 불가':state.q}</b></span>
    <span>전원<b>{state.powered?'ON':'OFF'}</b></span><span>단자<b>상태 피드백, 일반 CMOS 휘발</b></span>
   </>:sceneId==='d-latch-vs-d-flip-flop'?<>
    <span>toy 시간<b>{clk.t} ns</b></span><span>현재 D/CLK<b>{clk.d} / {clk.clock}</b></span>
    <span>래치 Q<b>{clk.latchQ}</b></span><span>상승 DFF Q<b>{state.initialHigh?'보증 불가':clk.ffQ}</b></span><span>현재 rising?<b>{state.initialHigh?'검증 안됨':clk.rising?'YES':'NO'}</b></span>
   </>:<>
    <span>Setup<b>{tim.setupPass?'PASS':'FAIL'} {tim.setupMargin.toFixed(1)}ns</b></span>
    <span>Hold<b>{tim.holdPass?'PASS':'FAIL'} {tim.holdMargin.toFixed(1)}ns</b></span>
    <span>상태<b>T={tim.period}ns / buf {state.buffer?'1':'0'}</b></span>
    <span>비동기/메타<b>{metastability(state.hazard,false).risk}</b></span>
   </>}
  </div>
  <p className="a05-note">정착된 이상 CMOS 논리와 단일 클록 장난감입니다. 실제 PVT/스큐/지터, 셀 데이터시트, glitch, 동기화기 확률은 따로 검토하세요.</p>
 </div>;
}
