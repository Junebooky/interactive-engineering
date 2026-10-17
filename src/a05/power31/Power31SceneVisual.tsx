import {useId} from 'react';
import {power31Buck,power31Coolant,power31Facility,power31Pdn,power31Psu} from './power31Model';
import type {Power31SceneId,Power31State} from './power31Model';
function Text({x,y,children,size=14,color='#e5fcfc'}:{x:number;y:number;children:React.ReactNode;size?:number;color?:string}){
 return <text x={x} y={y} fontSize={size} fontWeight="650" fill={color}>{children}</text>;
}
function Unit({x,y,w=138,h=74,title,sub,accent='#92e5d5'}:{x:number;y:number;w?:number;h?:number;title:string;sub:string;accent?:string}){
 return <g><path d={`M${x+7} ${y+9}h${w}v${h}h-${w}z`} opacity=".6" fill="#0c1d2d"/>
  <path d={`M${x} ${y}h${w-16}l16 12v${h-12}h-${w}z`} fill="#234860" stroke={accent} strokeWidth="2"/>
  <path d={`M${x} ${y}h${w-16}l16 12h-${w}z`} fill={accent} opacity=".28"/>
  <Text x={x+11} y={y+29} size={16}>{title}</Text><Text x={x+11} y={y+52} size={11} color="#c1dce6">{sub}</Text></g>;
}
function Arrow({x1,x2,y,color='#a8fbe5'}:{x1:number;x2:number;y:number;color?:string}){
 return <g stroke={color} fill="none" strokeWidth="4"><path d={`M${x1} ${y}H${x2}`}/><path d={`M${x2-13} ${y-7}l13 7-13 7`}/></g>;
}
export function Power31SceneVisual({sceneId,state,revealed,evidence=[]}:{sceneId:Power31SceneId;state:Power31State;revealed:boolean;evidence?:readonly string[]}){
 const uid=useId().replace(/:/g,'');
 if(!revealed)return <div className="a05-veiled" aria-label="GPU 전력·냉각의 관찰 결과와 정답 숫자는 예측 및 직접 조작하기 전 비공개">
  <div className="a05-veiled-object" aria-hidden="true"><span/></div><p>입력과 에너지·열의 흐름을 먼저 예상한 뒤 수치를 열어 보세요.</p>
 </div>;
 const psu=power31Psu(state.psu),vrm=power31Buck(state.duty,state.buckEta),
  pdn=power31Pdn(state.rail,state.resistance),cool=power31Coolant(state.heat,state.deltaT,state.cooling),
  dc=power31Facility(state.pue,state.site);
 return <div className="a05-visual a05-power31-visual">
  <svg role="img" viewBox="0 0 660 405" aria-label={
   sceneId==='server-psu-loss-heat'?'서버 PSU 입력 전력과 출력 100와트 및 전력 변환 열손실 개별 경로':
   sceneId==='gpu-buck-vrm-duty-ratio'?'12볼트 입력과 이상적 스위칭 인덕터 출력을 분리한 가상 buck 전압전력 경로':
   sceneId==='gpu-pdn-current-heat'?'가상 GPU 40와트 단자 전압/전류와 패키지 배선 I제곱R 열손실':
   sceneId==='cdu-water-loop-heat-flow'?'차가운 판과 CDU 사이 재순환 냉각수 및 별도의 시설 물 보충 경로':
   '동일 시간 기준 시설/IT 에너지 PUE와 독립 물사용 WUE 이중 계기판'}>
   <defs><linearGradient id={'power'+uid}><stop stopColor="#31576e"/><stop offset="1" stopColor="#112b3d"/></linearGradient></defs>
   <path d="M28 60 H590 L639 97 V335 L80 360 L28 324 Z" stroke="#92eddf" strokeWidth="2" fill={'url(#power'+uid+')'}/>
   <path d="M590 60 L639 97 V335 L590 300 Z" stroke="#729eac" fill="#193548"/>
   {sceneId==='server-psu-loss-heat'&&<>
    <Text x={58} y={101} size={22} color="#b1fbe4">PSU 효율 {state.psu}% · 출력 100W 고정</Text>
    <Unit x={57} y={147} title={psu.inputW.toFixed(3)+'W'} sub="AC 입력 전력" accent="#ffe0a0"/>
    <Arrow x1={200} x2={261} y={184}/>
    <Unit x={263} y={147} title="PSU" sub={'η '+state.psu+'%'} accent="#96d4ff"/>
    <Arrow x1={405} x2={464} y={184}/>
    <Unit x={465} y={147} title="100W" sub="GPU / IT 출력"/>
    <path d="M334 221v49" stroke="#eeac98" strokeWidth="5"/>
    <Unit x={274} y={276} w={168} h={58} title={psu.lossW.toFixed(3)+'W'} sub="PSU 변환 손실 열" accent="#eea994"/>
    <Text x={58} y={356} size={12}>입력 = IT 출력 + PSU 손실 · GPU 자체 소비 100W와 별도</Text>
   </>}
   {sceneId==='gpu-buck-vrm-duty-ratio'&&<>
    <Text x={54} y={103} size={20} color="#b1fbe4">Ideal CCM buck: duty D, 별도 η 손실</Text>
    <Unit x={59} y={156} title="12 V" sub="Vin 입력" accent="#ffdfa6"/>
    <Arrow x1={200} x2={252} y={193}/>
    <Unit x={259} y={156} w={161} title={'D '+(state.duty*100).toFixed(1)+'%'} sub="switch + L + C" accent="#94ceff"/>
    <Arrow x1={426} x2={479} y={193}/>
    <Unit x={480} y={156} w={128} title={vrm.vout.toFixed(2)+' V'} sub="ideal Vout"/>
    <Text x={71} y={286} size={15}>Iout 10A · Pout {vrm.pout.toFixed(2)}W</Text>
    <Text x={71} y={315} size={15}>별도 효율 η={state.buckEta}%: Pin {vrm.pin.toFixed(3)}W · Iin {vrm.iin.toFixed(3)}A</Text>
    <Text x={71} y={345} size={12} color="#f1dfae">비이상 효율을 Vout=D×Vin 식에 다시 곱하지 않아요.</Text>
   </>}
   {sceneId==='gpu-pdn-current-heat'&&<>
    <Text x={56} y={101} size={20} color="#b1fbe4">가상 GPU 40W 고정 · 배선 R 독립 비교</Text>
    <Unit x={55} y={151} title={state.rail+'V'} sub="GPU rail (fixed P)"/>
    <Arrow x1={198} x2={255} y={185}/>
    <Unit x={258} y={151} w={160} title={pdn.currentA+' A'} sub={'R '+state.resistance+'mΩ'} accent="#ffdc9c"/>
    <Arrow x1={425} x2={482} y={185}/>
    <Unit x={483} y={151} w={126} title="40W" sub="toy load"/>
    <Text x={66} y={276} size={19} color="#e9b5a1">Wire heat I²R = {pdn.wireHeatW.toFixed(3)}W</Text>
    <Text x={66} y={312} size={14}>Voltage drop IR = {pdn.wireDropV.toFixed(3)}V</Text>
    <Text x={66} y={344} size={12}>칩 동적전력·결정적 온도·실제 구리 R(T) 예측 아님</Text>
   </>}
   {sceneId==='cdu-water-loop-heat-flow'&&<>
    <Text x={55} y={94} size={20} color="#b1fbe4">순환수량 ≠ 시설 물 소비량</Text>
    <Unit x={55} y={144} title="Cold plate" sub={state.heat+'kW to water'}/>
    <Arrow x1={197} x2={257} y={181} color="#ffc0a2"/>
    <Unit x={259} y={144} title="Rack loop" sub={'ΔT '+state.deltaT+'K'} accent="#f5cf9d"/>
    <Arrow x1={403} x2={463} y={181} color="#ffc0a2"/>
    <Unit x={465} y={144} title="CDU" sub="heat exchanger" accent="#a1cbf9"/>
    <path d="M533 220v45H127v-47" fill="none" stroke="#8cdde8" strokeWidth="4" strokeDasharray="9 6"/>
    <Text x={69} y={295} size={16}>순환 m-dot = {cool.flowKgPerS.toFixed(4)} kg/s</Text>
    <Text x={69} y={324} size={12} color="#eacfa7">시설 heat rejection: {state.cooling==='dry'?'dry 예시':'증발탑 예시'}</Text>
    <Text x={69} y={349} size={12}>보충수 소비량 = 미정 · WUE는 이 유량을 분자에 대입하지 않아요.</Text>
   </>}
   {sceneId==='data-center-pue-wue-tradeoff'&&<>
    <Text x={59} y={96} size={20} color="#b1fbe4">같은 계측 기간 · 시설전력/물 소비 별도</Text>
    <Unit x={56} y={142} title="IT 1 MW" sub="고정 부하"/>
    <Arrow x1={195} x2={249} y={179}/>
    <Unit x={254} y={142} w={163} title={'PUE '+state.pue} sub={'facility '+dc.facilityMW+'MW'} accent="#e9ce9b"/>
    <Arrow x1={424} x2={477} y={179}/>
    <Unit x={481} y={142} w={126} title={dc.overheadMW.toFixed(1)+'MW'} sub="overhead"/>
    <Text x={62} y={253} size={15}>{evidence.includes('pue14')&&evidence.includes('pue12')?'24h 동일 IT 기준: 시설 에너지 차이 4.8MWh':'동일 IT·기간의 두 PUE 조건을 각각 실험한 뒤 차이를 공개해요'}</Text>
    <Unit x={75} y={276} w={214} h={61} title={evidence.includes('site'+state.site)?'site '+state.site+' / PUE '+dc.sitePue.toFixed(2):'site 계측 미관찰'} sub="site facility / IT"/>
    <Unit x={346} y={276} w={241} h={61} title={evidence.includes('site'+state.site)?'WUE '+dc.siteWue.toFixed(2)+' L/kWh':'site WUE 미관찰'} sub="site makeup water / IT kWh" accent="#a1d8ff"/>
    <Text x={64} y={359} size={12}>{evidence.includes('siteA')&&evidence.includes('siteB')?'A: PUE1.2/WUE2.0 vs B: PUE1.35/WUE0.5 · 순위 서로 다름':'사이트 A와 B를 모두 조작한 뒤 두 지표의 순위를 비교해요'}</Text>
   </>}
   <Text x={61} y={387} size={11} color="#adcbd1">2.5D 원본 교육 모형 · 실장치 성능·안전 인증·현장 계측 아님</Text>
  </svg>
  <div className="a05-readouts">
   {sceneId==='server-psu-loss-heat'?<>
    <span>PSU 입력<b>{psu.inputW} W</b></span><span>GPU 출력<b>{psu.pout} W</b></span><span>손실 열<b>{psu.lossW} W</b></span><span>η 기준<b>입력이 분모</b></span>
   </>:sceneId==='gpu-buck-vrm-duty-ratio'?<>
    <span>이상 CCM Vout<b>{vrm.vout} V</b></span><span>효율(별도)<b>{state.buckEta}%</b></span><span>Iin<b>{vrm.iin} A</b></span><span>손실<b>{vrm.loss} W</b></span>
   </>:sceneId==='gpu-pdn-current-heat'?<>
    <span>부하<b>40 W 고정</b></span><span>전류<b>{pdn.currentA} A</b></span><span>배선 손실<b>{pdn.wireHeatW} W</b></span><span>전압강하<b>{pdn.wireDropV} V</b></span>
   </>:sceneId==='cdu-water-loop-heat-flow'?<>
    <span>열<b>{state.heat} kW</b></span><span>냉각수 상승<b>{state.deltaT} K</b></span><span>재순환<b>{cool.flowKgPerS} kg/s</b></span><span>site 보충수<b>미정 (별도)</b></span>
   </>:<>
    <span>시설<b>{dc.facilityMW} MW</b></span><span>동일 시간 energy<b>{dc.facilityMWh} MWh</b></span><span>site PUE<b>{evidence.includes('site'+state.site)?dc.sitePue:'미관찰'}</b></span><span>site WUE<b>{evidence.includes('site'+state.site)?dc.siteWue+' L/kWh':'미관찰'}</b></span>
   </>}
  </div>
  <p className="a05-note">실제 벤더 전원/전력·냉각 데이터가 아닌 A06 교육용 상수로만 계산합니다. 열/순환 kg/s와 site 물 L/kWh는 다른 물리량입니다.</p>
 </div>;
}
