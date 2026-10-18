import React, { useId } from 'react';
import { cmosObservation, mosfetObservation, resistorInverterObservation } from './scenePhysics';
import type { A05SceneId, A05Values, LogicBit } from './scenePhysics';

type Props = { sceneId: A05SceneId; values: A05Values; showObservation: boolean };
const MINT = '#4fe0ca';
const CYAN = '#4bc6fa';
const GOLD = '#ffd37d';

function CircuitSurface({ children }: { children: React.ReactNode }) {
  return (
    <g>
      <path d="M45 34 L550 34 L578 52 L578 332 L72 332 L45 313 Z" fill="#101e34" stroke="#647c9d" strokeWidth="2" />
      <path d="M550 34 L578 52 L578 332 L550 312 Z" fill="#172f45" stroke="#4e7186" />
      <rect x="45" y="34" width="505" height="278" rx="13" fill="#14263c" stroke="#7397ad" />
      <path d="M60 48 H535" stroke="#9eebd3" strokeOpacity=".4" strokeWidth="2" />
      <g data-scene-subject="inverter-device" data-scene-id="inverter-circuit">{children}</g>
    </g>
  );
}

function SvgLabel({ x, y, children, color = '#d9e9fa', size = 14 }: {
  x: number; y: number; children: React.ReactNode; color?: string; size?: number;
}) {
  return <text x={x} y={y} fill={color} fontSize={size} fontWeight="600">{children}</text>;
}

function MosfetCutaway({ values, showCurrent }: { values: A05Values; showCurrent: boolean }) {
  const s = mosfetObservation(values.vgs, values.vds);
  const uid = useId().replace(/:/g, '');
  const gateGradient = 'a05gate' + uid;
  const waferGradient = 'a05wafer' + uid;
  const field = s.verticalFieldIntensity;
  const widthAtDrain = Math.max(1, s.drainChannelThickness * 26);
  const widthAtSource = Math.max(1, s.channelThickness * 26);
  const electrons = Array.from({ length: Math.max(0, s.electronCount) }, (_, i) => {
    const u = (i * 47 % 101) / 101;
    const t = (i * 19 % 13) / 13;
    return { x: 159 + 321 * u, y: 181 + (t - 0.5) * Math.max(2, widthAtSource * (1 - u) + widthAtDrain * u) };
  });
  const maxY = 1.5;
  const curve = Array.from({ length: 41 }, (_, i) => {
    const x = (i / 40) * 2;
    const id = mosfetObservation(1.5, x).id;
    return [70 + 470 * i / 40, 98 - (id / maxY) * 78].join(',');
  }).join(' ');
  const measuredX = 70 + values.vds * 235;
  const measuredY = 98 - Math.min(1.5, s.id) / maxY * 78;

  return (
    <div className="a05-visual">
      <svg viewBox="0 0 630 370" role="img" aria-label="nMOS의 절연막, 기판, 소스 드레인 및 표면 반전 채널을 깊이감 있는 단면으로 표현">
        <defs>
          <linearGradient id={waferGradient} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#4b7c91" /><stop offset=".55" stopColor="#224a63" /><stop offset="1" stopColor="#102e4a" />
          </linearGradient>
          <linearGradient id={gateGradient} x1="0" y1="0" x2=".7" y2="1">
            <stop stopColor="#e6fff8" /><stop offset=".3" stopColor="#81eedb" /><stop offset="1" stopColor="#1a8e9f" />
          </linearGradient>
        </defs>
        <g data-scene-subject="mosfet-device" data-scene-id="mosfet-cutaway">
        <path d="M89 133 L509 133 L540 160 L540 309 L120 309 L89 282 Z" fill={'url(#' + waferGradient + ')'} stroke="#7facbd" strokeWidth="2"/>
        <path d="M89 133 L509 133 L540 160 L120 160 Z" fill="#416f84" stroke="#91c1c6"/>
        <path d="M120 160 L540 160 L540 309 L120 309 Z" fill="#29465d" fillOpacity=".55"/>
        <path d="M89 282 L120 309 L120 160 L89 133 Z" fill="#152b42" stroke="#5f8392"/>
        <SvgLabel x={315} y={294} color="#d0e9ec">p형 실리콘 기판 · cutaway</SvgLabel>
        <path d="M106 134 L169 134 L188 150 L124 150 Z" fill="#97e4ff" stroke="#dcffff"/>
        <rect x="124" y="150" width="64" height="50" fill="#227ab0" stroke="#a7eeff"/>
        <path d="M452 134 L515 134 L534 150 L470 150 Z" fill="#97e4ff" stroke="#dcffff"/>
        <rect x="470" y="150" width="64" height="50" fill="#227ab0" stroke="#a7eeff"/>
        <SvgLabel x={113} y={119} color={CYAN}>SOURCE (n+)</SvgLabel>
        <SvgLabel x={456} y={119} color={CYAN}>DRAIN (n+)</SvgLabel>
        <path d="M176 134 L459 134 L475 146 L190 146 Z" fill="#def6fc" stroke="#9bd8f3" strokeWidth="2"/>
        <SvgLabel x={269} y={162} color="#bcdcea" size={12}>SiO₂ · 절연막</SvgLabel>
        <path d="M194 82 L468 82 L484 95 L211 95 Z" fill={'url(#' + gateGradient + ')'} stroke="#e7fffc"/>
        <path d="M211 95 L484 95 L484 133 L211 133 Z" fill="#278da0" stroke="#b5ffee"/>
        <path d="M194 82 L211 95 L211 133 L194 121 Z" fill="#17677b" stroke="#b5ffee"/>
        <SvgLabel x={267} y={72} color={MINT}>GATE · VGS {values.vgs.toFixed(1)} V</SvgLabel>
        {field > 0 && Array.from({ length: 7 }, (_, i) => (
          <g key={i} opacity={0.15 + field * 0.75}>
            <path d={'M' + (225 + i * 34) + ' 122 v50'} stroke={GOLD} strokeWidth={1 + field * 1.2} strokeDasharray="4 4"/>
            <path d={'M' + (220 + i * 34) + ' 165 l5 9 l5 -9'} fill="none" stroke={GOLD} strokeWidth="1.7"/>
          </g>
        ))}
        {s.channelThickness > 0 && (
          <g>
            <path d={'M174 177 L469 177 L469 ' + (177 + widthAtDrain) + ' L174 ' + (177 + widthAtSource) + ' Z'}
              fill={MINT} fillOpacity=".24" stroke={MINT} strokeWidth="2"/>
            {electrons.map((e, i) => <circle key={i} cx={e.x} cy={e.y} r="2.1" fill="#b4ffff"/>)}
          </g>
        )}
        <SvgLabel x={200} y={227} color={MINT} size={13}>{s.channelThickness > 0 ? '표면 반전층 가시화' : values.vgs >= 0.7 ? '문턱 경계 · 아직 채널 두께 0' : '강한 반전층 미형성'}</SvgLabel>
        {showCurrent && s.id > 0 && <>
          <path d="M195 243 H451" stroke={CYAN} strokeWidth="3" strokeDasharray="8 6" className="a05-current-line" />
          <path d="M451 243 l-13 -7 v14 Z" fill={CYAN}/>
          <SvgLabel x={205} y={263} color={CYAN} size={12}>전자 이동: SOURCE → DRAIN</SvgLabel>
          <path d="M449 278 H195" stroke={GOLD} strokeWidth="3"/>
          <path d="M195 278 l13 -7 v14 Z" fill={GOLD}/>
          <SvgLabel x={201} y={311} color={GOLD} size={12}>관습 전류: DRAIN → SOURCE</SvgLabel>
        </>}
        </g>
        <SvgLabel x={94} y={344} color="#aec4d8" size={12}>교육용 장채널 nMOS · Vth=0.7V 가정 · 비례·단면 축척 아님</SvgLabel>
      </svg>
      <div className="a05-readouts" aria-live="polite">
        <span>VGS <b>{values.vgs.toFixed(1)} V</b></span>
        <span>VDS <b>{values.vds.toFixed(1)} V</b></span>
        <span>반전 채널 <b>{s.channelThickness > 0 ? '가시화 (문턱 초과)' : values.vgs >= 0.7 ? '경계 (두께 0)' : '미가시화 (문턱 미만)'}</b></span>
        <span>모델 ID <b>{s.id.toFixed(2)} mA</b></span>
      </div>
      {showCurrent && <div className="a05-plot">
        <svg viewBox="0 0 590 140" role="img" aria-label="VDS 0부터 2볼트까지 드레인 전류의 증가 및 포화 경향">
          <path d="M70 15 V98 H542" stroke="#7390ad" strokeWidth="1.5" fill="none"/>
          <path d="M70 58 H542" stroke="#7390ad" strokeDasharray="4 5" opacity=".35"/>
          <polyline points={curve} fill="none" stroke={MINT} strokeWidth="3" strokeLinejoin="round"/>
          <circle cx={measuredX} cy={measuredY} r="6" fill={GOLD} stroke="#fff5d9" strokeWidth="2"/>
          <SvgLabel x={72} y={12} size={12}>ID (mA, 근사)</SvgLabel>
          <SvgLabel x={475} y={126} size={12}>VDS (V)</SvgLabel>
          <SvgLabel x={59} y={100} size={12}>0</SvgLabel>
          <SvgLabel x={296} y={114} size={12}>1</SvgLabel>
          <SvgLabel x={535} y={114} size={12}>2</SvgLabel>
          <SvgLabel x={95} y={50} size={12} color={MINT}>포화 이후에도 ID는 0이 아님</SvgLabel>
        </svg>
      </div>}
    </div>
  );
}

function ResistorInverter({ vin }: { vin: number }) {
  const s = resistorInverterObservation(vin);
  return <div className="a05-visual">
    <svg viewBox="0 0 630 370" role="img" aria-label="5볼트 전원, 10킬로옴 풀업 저항과 nMOS 풀다운으로 이루어진 저항형 NOT 회로">
      <CircuitSurface>
        <path d="M320 75 V106 M320 163 V209 M320 209 H455 M320 209 V252 M320 291 V304"
          fill="none" stroke="#b1d1da" strokeWidth="5" strokeLinecap="round" />
        <rect x="273" y="75" width="94" height="29" rx="9" fill="#5c4737" stroke={GOLD} strokeWidth="2"/>
        <SvgLabel x={284} y={95} color="#fff3cc">+5V VDD</SvgLabel>
        <rect x="303" y="106" width="34" height="57" rx="4" fill="#ecbf87" stroke="#ffefd5" strokeWidth="3"/>
        <path d="M304 122 H337 M304 140 H337" stroke="#91694c" strokeWidth="4"/>
        <SvgLabel x={357} y={138} color={GOLD}>10 kΩ</SvgLabel>
        <circle cx="320" cy="209" r="9" fill={CYAN} stroke="#e8ffff" strokeWidth="2"/>
        <path d="M445 186 H521 V232 H445 Z" fill="#1b354a" stroke={CYAN} strokeWidth="2"/>
        <SvgLabel x={456} y={205} color={CYAN} size={12}>VOUT</SvgLabel>
        <SvgLabel x={453} y={224} color={GOLD}>{s.vout.toFixed(2)} V</SvgLabel>
        <path d="M300 252 H345 M300 291 H345 M320 252 V262 M320 279 V291"
          fill="none" stroke={s.pullDownActive ? MINT : '#4c6375'} strokeWidth="5" strokeLinecap="round"/>
        <rect x="293" y="262" width="54" height="17" rx="4" fill={s.pullDownActive ? '#178e7e' : '#3b5263'}
          stroke={s.pullDownActive ? '#92ffe4' : '#7c92a5'} strokeWidth="2"/>
        <SvgLabel x={355} y={277} color={MINT}>nMOS {s.isTransistorOn ? 'ON' : 'OFF'}</SvgLabel>
        <path d="M315 304 H325 M309 310 H331 M315 316 H325" fill="none" stroke="#e1ebf7" strokeWidth="3"/>
        <path d="M136 267 H288" stroke={CYAN} strokeWidth="3"/>
        <rect x="92" y="241" width="119" height="47" rx="9" fill="#204b63" stroke={CYAN} strokeWidth="2"/>
        <SvgLabel x={107} y={261} color="#e7faff" size={12}>VIN {vin.toFixed(0)}V</SvgLabel>
        <SvgLabel x={107} y={278} color={CYAN} size={12}>입력 논리 {s.inputLogic}</SvgLabel>
        <SvgLabel x={98} y={73} color="#e4f3fd" size={18}>저항형 nMOS 인버터</SvgLabel>
        {s.currentMa > 0 && <path d="M319 167 V199" stroke={MINT} strokeWidth="5" strokeDasharray="6 6" className="a05-current-line"/>}
        <SvgLabel x={94} y={343} color="#b6c7d8" size={12}>ON이어도 완전 단락 아님 · 유한한 Ron/저항분배 모델</SvgLabel>
      </CircuitSurface>
    </svg>
    <div className="a05-readouts" aria-live="polite">
      <span>입력 <b>{s.inputLogic} ({vin.toFixed(0)}V)</b></span>
      <span>nMOS <b>{s.isTransistorOn ? 'ON' : 'OFF'}</b></span>
      <span>VOUT <b>{s.vout.toFixed(2)} V</b></span>
      <span>출력 논리 <b>{s.outputLogic} ({s.outputLogic ? 'HIGH' : 'LOW'})</b></span>
    </div>
  </div>;
}

function CMOSInverter({ vin }: { vin: LogicBit }) {
  const s = cmosObservation(vin);
  return <div className="a05-visual">
    <svg viewBox="0 0 630 370" role="img" aria-label="상단 pMOS와 하단 nMOS가 입력 전압에 따라 상보적으로 열리는 CMOS 인버터">
      <CircuitSurface>
        <SvgLabel x={96} y={75} color="#e4f3fd" size={18}>CMOS NOT · 상보적인 두 스위치</SvgLabel>
        <path d="M322 89 V128 M322 160 V207 M322 207 H452 M322 207 V247 M322 279 V302"
          fill="none" stroke="#a9cedd" strokeWidth="4" strokeLinecap="round"/>
        <path d="M303 128 H341 M303 160 H341" stroke={s.pmosOn ? GOLD : '#637c8b'} strokeWidth="5"/>
        <rect x="304" y="136" width="35" height="18" rx="5" fill={s.pmosOn ? '#f8ca86' : '#42556a'} stroke="#ffeed7"/>
        <circle cx="288" cy="145" r="6" fill="none" stroke={GOLD} strokeWidth="2.5"/>
        <path d="M303 247 H341 M303 279 H341" stroke={s.nmosOn ? MINT : '#637c8b'} strokeWidth="5"/>
        <rect x="304" y="255" width="35" height="16" rx="4" fill={s.nmosOn ? '#35af9d' : '#42556a'} stroke="#a7fce2"/>
        <path d="M91 191 H256 V145 H283 M256 191 V264 H303" stroke={CYAN} strokeWidth="3" fill="none"/>
        <rect x="94" y="163" width="112" height="45" rx="9" fill="#1c4d66" stroke={CYAN} strokeWidth="2"/>
        <SvgLabel x={105} y={183} color="#e7faff" size={12}>VIN {vin ? '5V' : '0V'}</SvgLabel>
        <SvgLabel x={105} y={198} color={CYAN} size={12}>논리 {vin}</SvgLabel>
        <rect x="445" y="184" width="100" height="49" rx="9" fill="#1d3b50" stroke={MINT} strokeWidth="2"/>
        <SvgLabel x={456} y={204} color="#d7ffec" size={12}>출력 VOUT</SvgLabel>
        <SvgLabel x={456} y={223} color={GOLD}>{s.vout.toFixed(0)}V · {s.output}</SvgLabel>
        <rect x="275" y="87" width="96" height="24" rx="6" fill="#68543b" stroke={GOLD}/>
        <SvgLabel x={287} y={103} color={GOLD} size={12}>VDD +5V</SvgLabel>
        <path d="M306 302 H338 M312 309 H332 M318 316 H326" stroke="#dcecf5" strokeWidth="3" strokeLinecap="round"/>
        <SvgLabel x={356} y={150} color={s.pmosOn ? GOLD : '#b9c8d2'} size={13}>pMOS {s.pmosOn ? 'ON' : 'OFF'}</SvgLabel>
        <SvgLabel x={357} y={269} color={s.nmosOn ? MINT : '#b9c8d2'} size={13}>nMOS {s.nmosOn ? 'ON' : 'OFF'}</SvgLabel>
        <SvgLabel x={96} y={343} size={12} color="#bbccdb">정지 상태의 관통 경로 억제 · 실제 누설/스위칭 전력은 존재</SvgLabel>
      </CircuitSurface>
    </svg>
    <div className="a05-readouts" aria-live="polite">
      <span>입력 <b>{vin} ({vin ? 5 : 0} V)</b></span>
      <span>pMOS <b>{s.pmosOn ? 'ON' : 'OFF'}</b></span>
      <span>nMOS <b>{s.nmosOn ? 'ON' : 'OFF'}</b></span>
      <span>출력 <b>{s.output} ({s.vout} V)</b></span>
    </div>
  </div>;
}

export function A05SceneVisual({ sceneId, values, showObservation }: Props) {
  if (!showObservation) return (
    <section className="a05-veiled" aria-label="예측 후 열리는 실험 장면">
      <div className="a05-veiled-object" aria-hidden="true"><span /></div>
      <p>먼저 예상해 보세요. 예상이 기록되면 실제 부품이 나타납니다.</p>
    </section>
  );
  switch (sceneId) {
    case 'mosfet-field': return <MosfetCutaway values={values} showCurrent={false}/>;
    case 'mosfet-current': return <MosfetCutaway values={values} showCurrent={true}/>;
    case 'nmos-resistor-inverter': return <ResistorInverter vin={values.vin}/>;
    case 'cmos-not-gate': return <CMOSInverter vin={values.vin >= 2.5 ? 1 : 0}/>;
  }
}
