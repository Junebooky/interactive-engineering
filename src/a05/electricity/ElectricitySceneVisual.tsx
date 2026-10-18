import type {ReactNode} from 'react';
import {energyModel,rcModel,resistorNetwork,simpleCircuit} from './electricityModel';
import type {ChargeMode,CircuitTopology,Direction,ElecSceneId} from './electricityModel';
export interface ElectricityVisualState{
  volts:0|5;closed:boolean;direction:Direction;
  topology:CircuitTopology;
  mode:ChargeMode;rOhms:1000|2000;cMicroFarads:10|20;timeMs:number;rcInitialVoltageV:number;rcSegmentStartMs:number;
  powerVolts:5|10;loadMilliAmps:5|10;seconds:1|10;
}
function Caption({x,y,children,size=14,color='var(--ie-scene-ink)'}:{x:number;y:number;children:ReactNode;size?:number;color?:string}){
  return <text x={x} y={y} fontSize={size} fill={color} fontWeight="650">{children}</text>;
}
function Block({x,y,width=140,height=84,title,sub,accent='var(--ie-accent-teal)'}:{
  x:number;y:number;width?:number;height?:number;title:string;sub:string;accent?:string;
}){return <g>
  <rect x={x+8} y={y+10} width={width} height={height} rx="12" fill="var(--ie-material-shadow)" opacity=".7"/>
  <path d={`M${x} ${y} h${width-15} l15 13 v${height-13} h-${width} Z`} stroke={accent} fill="var(--ie-material-front)" strokeWidth="2"/>
  <path d={`M${x} ${y} h${width-15} l15 13 h-${width} Z`} fill={accent} opacity=".26"/>
  <Caption x={x+12} y={y+30}>{title}</Caption><Caption x={x+12} y={y+53} size={12} color="var(--ie-scene-muted)">{sub}</Caption>
</g>}
export function ElectricitySceneVisual({sceneId,state,revealed}:{
  sceneId:ElecSceneId;state:ElectricityVisualState;revealed:boolean;
}){
  if(!revealed)return <div className="a05-veiled" aria-label="전기 수치는 예측 전 숨겨져 있습니다">
    <div className="a05-veiled-object" aria-hidden="true"><span/></div>
    <p>먼저 예상해 보세요. 예상을 기록한 뒤 전류와 회로가 열립니다.</p>
  </div>;
  const basic=simpleCircuit(state.volts,state.closed);
  const network=resistorNetwork(state.topology);
  const rc=rcModel(state.mode,state.rOhms,state.cMicroFarads,state.timeMs,5,state.rcInitialVoltageV,state.rcSegmentStartMs);
  const energy=energyModel(state.powerVolts,state.loadMilliAmps,state.seconds);
  const mint='var(--ie-accent-teal)',cyan='var(--ie-accent-cyan)',gold='var(--ie-accent-amber)';
  const now=state.direction==='electron';
  return <div className="a05-visual a05-electricity-visual">
    <svg viewBox="0 0 650 410" role="img" aria-label={
      sceneId==='charge-voltage-current-arrows'?'이상적인 전원 '+state.volts+'V, 스위치 '+(state.closed?'닫힘':'열림')+', 전류 '+basic.currentMilliAmps.toFixed(2)+'밀리암페어. '+(basic.currentMilliAmps>0?'금속 전자 방향은 관습전류와 반대입니다.':'전류가 흐르지 않으므로 방향 화살표는 표시하지 않습니다.'):
      sceneId==='resistors-series-parallel-kcl'?'직렬 또는 병렬 두 저항의 전류 보존 2.5D 회로':
      sceneId==='capacitor-rc-charge-discharge'?'RC 저항-커패시터와 충전/방전 곡선 및 시간상수':
      '부하 전력과 소모 에너지, 커패시터 저장 에너지를 구분하는 2.5D 도식'
    }>
      <path d="M42 39 H564 L598 68 V344 H77 L42 313 Z" fill="var(--ie-lab-bg)" stroke="var(--ie-material-edge)" strokeWidth="2"/>
      <path d="M564 39 L598 68 V344 L564 315 Z" fill="var(--ie-material-side)" stroke="var(--ie-material-edge)"/>
      <rect x="42" y="39" width="522" height="276" rx="12" fill="var(--ie-lab-ground)" stroke="var(--ie-material-edge)"/>
      <path d="M60 52 H535" stroke="var(--ie-accent-teal)" opacity=".26" strokeWidth="2"/>
      {sceneId==='charge-voltage-current-arrows'&&<>
        <Caption x={72} y={79} size={20} color={mint}>전압 (V)과 전류 (A)는 다른 양</Caption>
        <Block x={81} y={127} width={130} title={state.volts+' V'} sub="이상적인 전압원" accent={gold}/>
        <Block x={425} y={127} width={135} title="1kΩ" sub="옴 저항" accent={cyan}/>
        <path d="M212 169 H265 M328 169 H424 M491 211 V253 H142 V211" stroke="var(--ie-scene-wire)" strokeWidth="5" fill="none"/>
        <g data-testid="electricity-switch-geometry" data-switch-state={state.closed?'closed':'open'}>
          <circle cx="265" cy="169" r="6" fill={mint}/><circle cx="328" cy="169" r="6" fill={mint}/>
          {state.closed?<path d="M265 169 H328" stroke={mint} strokeLinecap="round" strokeWidth="6"/>:
            <path d="M265 169 L313 141" stroke={gold} strokeLinecap="round" strokeWidth="5"/>}
        </g>
        <Caption x={253} y={126} color={state.closed?mint:gold}>스위치 {state.closed?'닫힘':'열림'}</Caption>
        {basic.currentMilliAmps>0&&<g data-testid="electricity-current-flow-arrows" aria-hidden="true">
          <path d={now?'M358 191 L340 183 L358 175':'M338 175 L356 183 L338 191'} fill={now?gold:mint}/>
          <path d={now?'M239 236 L258 244 L239 252':'M259 236 L240 244 L259 252'} fill={now?gold:mint}/>
        </g>}
        <Caption x={108} y={283} color={now?gold:mint} size={15}>
          {basic.currentMilliAmps===0?'전류 0mA · 방향 화살표 없음':now?'전자 이동 (음전하) ← 관습전류와 반대':'양전하 기준 관습전류 → 전자와 반대'}
        </Caption>
        <Caption x={82} y={306} color="var(--ie-scene-muted)" size={12}>{!state.closed?'스위치 열림: 전원 '+state.volts+'V, I=0':state.volts===5?'스위치 닫힘: 5V / 1kΩ = 5mA':'스위치 닫힘·전원 0V: I=0'}</Caption>
      </>}
      {sceneId==='resistors-series-parallel-kcl'&&<>
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
        <rect x="94" y="248" width="458" height="27" rx="8" fill="var(--ie-lab-ground)" stroke="var(--ie-material-edge)"/>
        <rect x="97" y="251" width={Math.min(452,rc.voltageV/5*451)} height="21" rx="6" fill={mint}/>
        <Caption x={94} y={236} color="var(--ie-scene-ink)">커패시터 전압 {rc.voltageV.toFixed(2)}V / 5V</Caption>
        <Caption x={96} y={307} color="var(--ie-scene-muted)" size={13}>τ = RC = {rc.tauMs.toFixed(0)}ms · I(t)={rc.currentMilliAmps.toFixed(2)}mA · 시작 V={rc.initialVoltageV.toFixed(2)}V</Caption>
      </>}
      {sceneId==='power-energy-joules-heat'&&<>
        <Caption x={73} y={84} color={mint} size={21}>전력 (W)과 에너지 (J)는 달라요</Caption>
        <Block x={73} y={127} width={135} title={state.powerVolts+' V'} sub="가변 DC 전압" accent={cyan}/>
        <Block x={255} y={127} width={137} title={state.loadMilliAmps+' mA'} sub="독립 가상 부하" accent={gold}/>
        <Block x={436} y={127} width={119} title={state.seconds+' s'} sub="작동 시간" accent={mint}/>
        <path d="M208 169 H254 M393 169 H436" stroke={mint} strokeWidth="5"/>
        <Caption x={85} y={251} size={18} color={mint}>P = {energy.milliWatts.toFixed(0)}mW</Caption>
        <Caption x={344} y={251} size={18} color={gold}>E = {energy.joules.toFixed(2)}J</Caption>
        <Caption x={83} y={292} color="var(--ie-scene-muted)" size={13}>10µF 저장 에너지: {energy.capacitorMicroJoules.toFixed(0)}µJ (½CV²)</Caption>
        <Caption x={84} y={310} color="var(--ie-scene-muted)" size={11}>소모 전력 전부가 즉시 같은 위치에서 열이 되는 모형은 아님</Caption>
      </>}
      <Caption x={76} y={377} color="var(--ie-scene-muted)" size={12}>순수 교육용 toy 2.5D · 안전한 화면 시뮬레이터, 실측/실기기 회로 지침 아님</Caption>
    </svg>
    <div className="a05-readouts" aria-live="polite">
      {sceneId==='charge-voltage-current-arrows'?<>
        <span>전원 양단 전압<b>{basic.terminalVoltageV} V</b></span><span>직류 전류<b>{basic.currentMilliAmps.toFixed(2)} mA</b></span>
        <span>스위치<b>{state.closed?'닫힘':'열림'}</b></span><span>화살표 기준<b>{now?'전자':'관습전류'}</b></span>
      </>:sceneId==='resistors-series-parallel-kcl'?<>
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
  </div>;
}
