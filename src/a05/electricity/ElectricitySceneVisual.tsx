import {useId} from 'react';
import type {ReactNode} from 'react';
import {energyModel,rcModel,resistorNetwork} from './electricityModel';
import type {ChargeMode,CircuitTopology,Direction,ElecSceneId} from './electricityModel';
export interface ElectricityVisualState{
  volts:0|5;closed:boolean;direction:Direction;
  topology:CircuitTopology;
  mode:ChargeMode;rOhms:1000|2000;cMicroFarads:10|20;timeMs:number;rcInitialVoltageV:number;rcSegmentStartMs:number;
  powerVolts:5|10;loadMilliAmps:5|10;seconds:1|10;
}
function Caption({x,y,children,size=14,color='#e8faff'}:{x:number;y:number;children:ReactNode;size?:number;color?:string}){
  return <text x={x} y={y} fontSize={size} fill={color} fontWeight="650">{children}</text>;
}
function Block({x,y,width=140,height=84,title,sub,accent='#8fead1'}:{
  x:number;y:number;width?:number;height?:number;title:string;sub:string;accent?:string;
}){return <g>
  <rect x={x+8} y={y+10} width={width} height={height} rx="12" fill="#061a28" opacity=".7"/>
  <path d={`M${x} ${y} h${width-15} l15 13 v${height-13} h-${width} Z`} stroke={accent} fill="#244c60" strokeWidth="2"/>
  <path d={`M${x} ${y} h${width-15} l15 13 h-${width} Z`} fill={accent} opacity=".26"/>
  <Caption x={x+12} y={y+30}>{title}</Caption><Caption x={x+12} y={y+53} size={12} color="#d0e5ef">{sub}</Caption>
</g>}
export function ElectricitySceneVisual({sceneId,state,revealed}:{
  sceneId:ElecSceneId;state:ElectricityVisualState;revealed:boolean;
}){
  const id=useId().replace(/:/g,'');
  if(!revealed && sceneId !== 'charge-voltage-current-arrows')return <div className="a05-veiled" aria-label="전기 수치는 예측 전 숨겨져 있습니다">
    <div className="a05-veiled-object" aria-hidden="true"><span/></div>
    <p>먼저 예상해 보세요. 예상을 기록한 뒤 전류와 회로가 열립니다.</p>
  </div>;
  const network=resistorNetwork(state.topology);
  const rc=rcModel(state.mode,state.rOhms,state.cMicroFarads,state.timeMs,5,state.rcInitialVoltageV,state.rcSegmentStartMs);
  const energy=energyModel(state.powerVolts,state.loadMilliAmps,state.seconds);
  const mint='#7be8cb',cyan='#83cef4',gold='#ffdb97';
  const isElectron=state.direction==='electron';
  const isClosed=revealed && state.closed;

  if (sceneId === 'charge-voltage-current-arrows') {
    return (
      <div className="a05-visual a05-electricity-visual">
        <svg
          viewBox="0 0 780 420"
          role="img"
          aria-label="전원 5볼트, 저항 1킬로옴과 열림·닫힘 스위치로 이루어진 회로 모형. 조작은 장면 하단의 실험 도크에서 합니다."
        >
          <defs>
            <linearGradient id={'base' + id} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#274A63" />
              <stop offset="1" stopColor="#153145" />
            </linearGradient>
            <linearGradient id={'battery' + id} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#F6D58C" />
              <stop offset="1" stopColor="#AD7935" />
            </linearGradient>
            <linearGradient id={'res' + id} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#C0E5EA" />
              <stop offset="1" stopColor="#568FAA" />
            </linearGradient>
          </defs>
          <path
            d="M65 95 L680 95 715 126 715 346 685 373 65 373 42 350 42 121Z"
            fill={'url(#base' + id + ')'}
            stroke="#37657D"
            strokeWidth="3"
          />
          <path d="M65 95 L680 95 715 126 95 126Z" fill="#3B6177" opacity=".52" />
          <g stroke="#75B3BF" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" fill="none">
            <path d="M168 177 H300" />
            <path d="M457 177 H602 V305 H168 V255" />
          </g>
          {/* 5V Battery */}
          <g>
            <rect x="118" y="147" width="100" height="115" rx="15" fill="#122434" opacity=".5" transform="translate(9 9)" />
            <rect x="118" y="147" width="100" height="115" rx="15" fill={'url(#battery' + id + ')'} stroke="#FFE8B0" strokeWidth="2" />
            <text x="168" y="191" fontSize="20" fontWeight="800" textAnchor="middle" fill="#332D23">5 V</text>
            <text x="168" y="221" fontSize="14" fontWeight="700" textAnchor="middle" fill="#332D23">전원</text>
            <text x="168" y="245" fontSize="12" textAnchor="middle" fill="#4D4031">+  −</text>
          </g>
          {/* 1kΩ Resistor */}
          <g>
            <path d="M550 151 L635 151 651 165 651 219 635 232 550 232 537 220 537 164Z" fill={'url(#res' + id + ')'} stroke="#D6F5FF" strokeWidth="2" />
            <path d="M550 151 L635 151 651 165 563 165Z" fill="#D9F5F6" opacity=".6" />
            <text x="594" y="188" textAnchor="middle" fontSize="21" fontWeight="800" fill="#102333">1kΩ</text>
            <text x="594" y="208" textAnchor="middle" fontSize="13" fontWeight="650" fill="#17374D">저항</text>
          </g>
          {/* Switch drawing */}
          <g id="switch-drawing">
            <path d="M300 177 H340 M427 177 H457" stroke="#7CE7D5" strokeWidth="11" strokeLinecap="round" />
            <circle cx="340" cy="177" r="11" fill="#9DE5DF" stroke="#D7F7F1" strokeWidth="3" />
            <circle cx="427" cy="177" r="11" fill="#9DE5DF" stroke="#D7F7F1" strokeWidth="3" />
            <path
              id="switch-arm"
              d={isClosed ? 'M340 177 H427' : 'M340 177 L410 117'}
              stroke="#F3C36C"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <text x="384" y="97" fontSize="15" textAnchor="middle" fontWeight="700" fill="#E6F5F6">스위치</text>
          </g>
          {/* Result Arrows: revealed only after prediction and when closed */}
          {isClosed && (
            <g id="result-arrows">
              <circle cx="390" cy="305" r="18" fill="#087C6D" />
              {isElectron ? (
                <path d="M397 305 H382 M389 299 L382 305 389 311" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
              ) : (
                <path d="M382 305 H397 M390 299 L397 305 390 311" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
              )}
              <text x="390" y="337" textAnchor="middle" fill="#BEF5E8" fontWeight="700" fontSize="12">
                {isElectron ? '전자 이동 (− → +)' : '관습전류 (+ → −)'}
              </text>
            </g>
          )}
          <text x="390" y="392" textAnchor="middle" fontSize="12" fill="#B4D7E0">
            이상적인 직류 회로 · 간략화된 교육용 도식
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className="a05-visual a05-electricity-visual">
      <svg
        viewBox="0 0 650 410"
        role="img"
        aria-label={
          sceneId === 'resistors-series-parallel-kcl'
            ? '직렬 또는 병렬 두 저항의 전류 보존 2.5D 회로'
            : sceneId === 'capacitor-rc-charge-discharge'
            ? 'RC 저항-커패시터와 충전/방전 곡선 및 시간상수'
            : '부하 전력과 소모 에너지, 커패시터 저장 에너지를 구분하는 2.5D 도식'
        }
      >
        <defs>
          <linearGradient id={'wafer' + id} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#38788e" />
            <stop offset=".6" stopColor="#21485f" />
            <stop offset="1" stopColor="#102a3e" />
          </linearGradient>
        </defs>
        <path d="M42 39 H564 L598 68 V344 H77 L42 313 Z" fill={'url(#wafer' + id + ')'} stroke="#91c9d6" strokeWidth="2" />
        <path d="M564 39 L598 68 V344 L564 315 Z" fill="#143348" stroke="#78a2b1" />
        <rect x="42" y="39" width="522" height="276" rx="15" fill="#122e43" stroke="#6d9eae" />
        <path d="M60 52 H535" stroke="#bdfff1" opacity=".4" strokeWidth="2" />
        {sceneId === 'resistors-series-parallel-kcl' && <>
          <Caption x={72} y={85} size={21} color={mint}>같은 1kΩ 두 개, 연결에 따라 다른 전류</Caption>
        <Block x={69} y={123} width={124} title="SOURCE" sub="5V ideal DC" accent={gold}/>
        {state.topology==='series'?<>
          <Block x={240} y={123} width={123} title="1kΩ R1" sub="2.5V drop" accent={cyan}/>
          <Block x={408} y={123} width={123} title="1kΩ R2" sub="2.5V drop" accent={cyan}/>
          <path d="M193 165 H240 M363 165 H407" stroke={mint} strokeWidth="5" fill="none"/>
          <Caption x={190} y={264} size={15} color={mint}>직렬: 모든 소자에서 I=2.50mA</Caption>
        </>:<>
          <Block x={260} y={111} width={177} height={70} title="R1 1kΩ" sub="5mA · 5V" accent={cyan}/>
          <Block x={260} y={209} width={177} height={70} title="R2 1kΩ" sub="5mA · 5V" accent={cyan}/>
          <path d="M193 164 H228 V149 H260 M228 164 V244 H260 M437 149 H468 V197 M437 246 H468 V197" stroke={mint} strokeWidth="5" fill="none"/>
          <Caption x={80} y={301} size={14} color={mint}>KCL: 노드 유입 10mA = 5mA + 5mA</Caption>
        </>}
      </>}
      {sceneId==='capacitor-rc-charge-discharge'&&<>
        <Caption x={74} y={84} color={mint} size={19}>RC: 전압은 순간 점프하지 않고 변해요</Caption>
        <Block x={77} y={125} title={state.rOhms/1000+'kΩ'} sub="저항" accent={cyan}/>
        <Block x={258} y={125} title={state.cMicroFarads+'µF'} sub="커패시터" accent={mint}/>
        <Block x={448} y={125} width={112} title={state.mode==='charge'?'충전':'방전'} sub={'t='+state.timeMs+'ms'} accent={gold}/>
        <path d="M217 165 H258 M398 165 H448" stroke={mint} strokeWidth="5" strokeDasharray="6 5"/>
        <rect x="94" y="248" width="458" height="27" rx="8" fill="#10263a" stroke="#557e90"/>
        <rect x="97" y="251" width={Math.min(452,rc.voltageV/5*451)} height="21" rx="6" fill={mint}/>
        <Caption x={94} y={236} color="#cff6e9">커패시터 전압 {rc.voltageV.toFixed(2)}V / 5V</Caption>
        <Caption x={96} y={307} color="#c0e6ed" size={13}>τ = RC = {rc.tauMs.toFixed(0)}ms · I(t)={rc.currentMilliAmps.toFixed(2)}mA · 시작 V={rc.initialVoltageV.toFixed(2)}V</Caption>
      </>}
      {sceneId==='power-energy-joules-heat'&&<>
        <Caption x={73} y={84} color={mint} size={21}>전력 (W)과 에너지 (J)는 달라요</Caption>
        <Block x={73} y={127} width={135} title={state.powerVolts+' V'} sub="가변 DC 전압" accent={cyan}/>
        <Block x={255} y={127} width={137} title={state.loadMilliAmps+' mA'} sub="독립 가상 부하" accent={gold}/>
        <Block x={436} y={127} width={119} title={state.seconds+' s'} sub="작동 시간" accent={mint}/>
        <path d="M208 169 H254 M393 169 H436" stroke={mint} strokeWidth="5"/>
        <Caption x={85} y={251} size={18} color={mint}>P = {energy.milliWatts.toFixed(0)}mW</Caption>
        <Caption x={344} y={251} size={18} color={gold}>E = {energy.joules.toFixed(2)}J</Caption>
        <Caption x={83} y={292} color="#cbebf1" size={13}>10µF 저장 에너지: {energy.capacitorMicroJoules.toFixed(0)}µJ (½CV²)</Caption>
        <Caption x={84} y={310} color="#b8dce5" size={11}>소모 전력 전부가 즉시 같은 위치에서 열이 되는 모형은 아님</Caption>
      </>}
      <Caption x={76} y={377} color="#b0cedb" size={12}>순수 교육용 toy 2.5D · 안전한 화면 시뮬레이터, 실측/실기기 회로 지침 아님</Caption>
    </svg>
    <div className="a05-readouts" aria-live="polite">
      {sceneId==='resistors-series-parallel-kcl'?<>
        <span>연결<b>{state.topology==='series'?'직렬':'병렬'}</b></span><span>등가저항<b>{network.equivalentOhms} Ω</b></span>
        <span>전체 전류<b>{network.totalMilliAmps.toFixed(2)} mA</b></span><span>소자별 전압<b>{network.eachResistorVoltageV.toFixed(2)} V</b></span>
      </>:sceneId==='capacitor-rc-charge-discharge'?<>
        <span>시간상수 τ<b>{rc.tauMs.toFixed(0)} ms</b></span><span>커패시터 전압<b>{rc.voltageV.toFixed(2)} V</b></span>
        <span>가상 시간<b>{state.timeMs} ms</b></span><span>저항 전류<b>{rc.currentMilliAmps.toFixed(2)} mA</b></span>
      </>:<>
        <span>부하 전력<b>{energy.milliWatts.toFixed(0)} mW</b></span><span>소비 에너지<b>{energy.joules.toFixed(2)} J</b></span>
        <span>커패시터 저장<b>{energy.capacitorMicroJoules.toFixed(0)} µJ</b></span><span>시간<b>{state.seconds} s</b></span>
      </>}
    </div>
  </div>
  );
}
