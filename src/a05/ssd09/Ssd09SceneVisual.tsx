import {useId} from 'react';
import {latencyModel,plpEnergy,plpOutcome,ssdEndurance,ssdWaf,voltageWindows} from './ssd09Model';
import type {Ssd09Id,Ssd09State} from './ssd09Model';
function T({x,y,children,size=14,color='#ddf8f6'}:{x:number;y:number;children:React.ReactNode;size?:number;color?:string}){
 return <text x={x} y={y} fill={color} fontSize={size} fontWeight="600">{children}</text>;
}
function Plate({x,y,w=152,h=78,label,desc,color='#91e1d8'}:{x:number;y:number;w?:number;h?:number;label:string;desc:string;color?:string}){
 return <g><path d={`M${x+8} ${y+9}h${w}v${h}h-${w}z`} fill="#091b2a" opacity=".75"/>
 <path d={`M${x} ${y}h${w-15}l15 11v${h-11}h-${w}z`} fill="#244b5e" stroke={color} strokeWidth="2"/>
 <path d={`M${x} ${y}h${w-15}l15 11h-${w}z`} fill={color} opacity=".2"/>
 <T x={x+11} y={y+31} size={18}>{label}</T><T x={x+11} y={y+54} size={12} color="#c5e2e5">{desc}</T></g>;
}
export function Ssd09SceneVisual({sceneId,state,revealed,evidence=[]}:{sceneId:Ssd09Id;state:Ssd09State;revealed:boolean;evidence?:readonly string[]}){
 const uid=useId().replace(/:/g,'');
 if(!revealed)return <div className="a05-veiled" aria-label="eSSD 실험의 정답 숫자와 개념은 예측하고 조작하기 전까지 공개되지 않습니다">
  <div className="a05-veiled-object" aria-hidden="true"><span/></div><p>전압 중심·GC·전원 사건·순위의 결과를 먼저 예상해 보세요.</p>
 </div>;
 const v=voltageWindows(state.bits,state.noise),w=ssdWaf(state.relocated,state.op,state.gc),plp=plpEnergy(state.plp.remainingWorkJ);
 const l=latencyModel(state.latency),end=ssdEndurance();
 const width=660;
 return <div className="a05-visual a05-ssd09-visual" data-testid="ssd09-visual">
  <svg role="img" viewBox={`0 0 ${width} 400`} aria-label={
   sceneId==='nand-cell-voltage-windows'?'균등 가상 문턱전압 상태 중심 개수와 인접 중심 간격, 유효 교란 크기':
   sceneId==='ssd-write-amplification'?'호스트 NAND 쓰기와 유효 페이지 이동으로 계산하는 가상 쓰기 증폭':
   sceneId==='ssd-plp-power-loss'?'ACK, flush 사건, NAND media 저장, 전원 차단과 가상 커패시터 0.6줄 유효 에너지':
   '100개 지연 카드의 정렬된 99번째 nearest-rank 위치와 별도 DWPD'}>
   <defs><linearGradient id={'ssd09'+uid}><stop stopColor="#315b6e"/><stop offset="1" stopColor="#12293b"/></linearGradient></defs>
   <path d="M25 52 H590 L637 98 V329 L77 361 L25 322 Z" stroke="#94f3de" strokeWidth="2" fill={'url(#ssd09'+uid+')'}/>
   <path d="M590 52 L637 98 V329 L590 298 Z" fill="#16354a" stroke="#7db3bd"/>
   {sceneId==='nand-cell-voltage-windows'&&<>
    <T x={53} y={92} size={20} color="#adfae2">가상 1V 창 · 상태 중심 {v.centers}개 · 간격 {v.gaps}개</T>
    <rect x="72" y="137" width="515" height="65" fill="#102a40" stroke="#6cbfd4" rx="7"/>
    {v.positions.map((x,i)=><g key={i}>
     {state.noise>0&&<rect x={74+x*509-509*.08} y="148" width={509*.16} height="43" rx="5" opacity=".16" fill="#ffc2a7"/>}
     <circle cx={74+x*509} cy="174" r={state.bits===4?6:8} fill="#94f6d7" stroke="#f6e0af" strokeWidth="1.3"/>
    </g>)}
    <T x={71} y={124} size={12}>0V</T><T x={565} y={124} size={12}>1V</T>
    <Plate x={67} y={228} w={161} h={89} label={v.centers+' centers'} desc={'2^'+state.bits+' distinct states'}/>
    <Plate x={246} y={228} w={161} h={89} label={v.gaps+' gaps'} desc="중심끼리 사이 개수" color="#f3c7a9"/>
    <Plate x={425} y={228} w={172} h={89} label={v.centerGap.toFixed(6)+'V'} desc="인접 중심 간격" color="#bcd4ff"/>
    <T x={79} y={341} size={12}>반폭 ±{state.noise.toFixed(2)}V: {v.canOverlapInToy?'서로 겹칠 수 있는 장난감 교란':'모형상 중심 구별 가능'} · 실제 BER 아님</T>
   </>}
   {sceneId==='ssd-write-amplification'&&<>
    <T x={57} y={93} size={20} color="#a8f9df">Host → SSD 내부 GC → NAND 실제 쓰기</T>
    <Plate x={52} y={146} label="1 GiB" desc="host writes" color="#8bcff8"/>
    <path d="M207 183h53" stroke="#b1f8e5" strokeWidth="5"/><path d="m251 177 10 6-10 6" stroke="#b1f8e5" strokeWidth="3" fill="none"/>
    <Plate x={270} y={146} w={160} label={w.validMoveGiB.toFixed(1)+' GiB'} desc="valid page relocation" color="#ffe1a6"/>
    <path d="M430 183h38" stroke="#b1f8e5" strokeWidth="5"/><path d="m461 177 10 6-10 6" stroke="#b1f8e5" strokeWidth="3" fill="none"/>
    <Plate x={474} y={146} w={133} label={w.physicalNandGiB.toFixed(1)+' GiB'} desc="NAND total" color="#9cf7d0"/>
    <T x={61} y={281} size={17}>WAF = physical NAND GiB / host GiB = {w.waf.toFixed(1)}</T>
    <T x={60} y={310} size={14} color="#e9d0ae">OP {w.opPercent}% / GC {w.gc?'ON':'OFF'} · 과도한 일반식 금지</T>
    <T x={60} y={339} size={13}>GC에서 유효 데이터는 보존해 옮기며 무효 페이지/블록 공간만 재활용해요.</T>
   </>}
   {sceneId==='ssd-plp-power-loss'&&<>
    <T x={61} y={92} size={18} color="#acf8df">ACK 시각과 실제 비휘발 저장은 다른 사건입니다.</T>
    <Plate x={46} y={132} w={176} label={'ACK '+(state.plp.ack?'YES':'NO')} desc={'event #'+state.plp.events.length} color="#a7dcfa"/>
    <path d="M222 171h56" stroke="#a7e7d8" strokeWidth="4" strokeDasharray="7 5"/>
    <Plate x={281} y={132} w={160} label={'Flush '+state.plp.flush} desc="issued vs completed" color="#edc899"/>
    <path d="M442 171h32" stroke="#a7e7d8" strokeWidth="4" strokeDasharray="7 5"/>
    <Plate x={475} y={132} w={147} label={state.plp.mediaCommitted?'NAND YES':'NAND ?'} desc="media commit" color="#a4f0c9"/>
    <T x={61} y={252} size={15}>가상 커패시터 nominal {plp.nominalJ.toFixed(1)}J · usable {plp.usableJ.toFixed(1)}J</T>
    <T x={61} y={280} size={14}>잔여 NAND 작업 {plp.pendingWorkJ.toFixed(1)}J → {plp.enoughToyEnergy?'전력 관점 가능':'에너지 부족'}</T>
    <T x={61} y={310} size={13} color="#ffe3b2">PLP {state.plp.plpEnabled?'ON':'OFF'} / {state.plp.volatileCache?'volatile cache':'cache bypass'} / 정전 {state.plp.powerLost?'YES':'NO'}</T>
    <T x={61} y={339} size={12}>현재 근거: {plpOutcome(state.plp)} · media/metadata 보호는 기기 계약 필요</T>
   </>}
   {sceneId==='essd-dwpd-tail-latency'&&<>
    <T x={54} y={92} size={19} color="#b0fbe3">100개 요청 · {state.latency} · {state.sorted?'정렬됨':'섞임'} · 선택 #{state.selectedRank??'—'}</T>
    {Array.from({length:100},(_,i)=>{
     const sample=state.sorted?l.sorted[i]:l.permuted[i],px=70+(i%20)*27,py=126+Math.floor(i/20)*33;
     return <g key={i}>
      <rect x={px} y={py} width="22" height="24" rx="4" fill={sample===20?'#f2b894':'#7ccec9'} stroke={state.selectedRank===i+1?'#fff9d0':'#295164'} strokeWidth={state.selectedRank===i+1?3:1}/>
      <text x={px+11} y={py+17} textAnchor="middle" fill="#123045" fontSize="9" fontWeight="750">{sample}</text>
     </g>;
    })}
    <T x={65} y={321} size={15}>선택한 #{state.selectedRank??'—'} · {state.sorted&&state.selectedRank===99?'99번째 순위 검사 완료':'먼저 정렬하고 99번째 순위를 직접 선택해 보세요'}</T>
    <T x={64} y={347} size={12}>{evidence.includes('A-sorted-99')&&evidence.includes('B-sorted-99')?
     'A p99 20ms · B p99 1ms (B 최대 20ms)':'A/B를 독립적으로 정렬·선택하기 전에는 두 분포의 정답 지도를 숨깁니다.'}</T>
   </>}
   <T x={60} y={382} size={11} color="#aaccd0">모든 수치 교육용 toy · 전압·저장 수명·PLP 보증·제품 지연 실측이 아닙니다.</T>
  </svg>
  <div className="a05-readouts">
   {sceneId==='nand-cell-voltage-windows'?<>
    <span>상태<b>{v.centers}</b></span><span>간격<b>{v.gaps}</b></span><span>centers gap<b>{v.centerGap} V</b></span><span>노이즈<b>±{v.noise} V</b></span>
   </>:sceneId==='ssd-write-amplification'?<>
    <span>호스트 기록<b>1 GiB</b></span><span>추가 유효-page 이사<b>{w.validMoveGiB} GiB</b></span><span>총 NAND 기록<b>{w.physicalNandGiB} GiB</b></span><span>WAF<b>{w.waf}</b></span>
   </>:sceneId==='ssd-plp-power-loss'?<>
    <span>phase<b>{state.plp.phase}</b></span><span>ACK/commit<b>{state.plp.ack?'ACK':''} / {state.plp.mediaCommitted?'MEDIA':'no media'}</b></span>
    <span>Flush<b>{state.plp.flush}</b></span><span>durability<b>{plpOutcome(state.plp)}</b></span>
   </>:<>
    <span>sample<b>{l.values.length} requests</b></span>
    <span>99위 선택<b>{state.sorted&&state.selectedRank===99?'확인':'미검증'}</b></span>
    <span>DWPD toy<b>{evidence.includes('dwpd')?end.writeTb+' decimal TB':'검증 전'}</b></span>
    <span>p99(선택 set)<b>{state.sorted&&state.selectedRank===99?l.p99Ms+'ms':'정렬·선택 필요'}</b></span>
   </>}
  </div>
  <p className="a05-note">정렬 없는 99번째 카드 ≠ nearest-rank p99; Flush ISSUED ≠ COMPLETED; 센터 16개 ≠ 간격 16개.</p>
 </div>;
}
