import {useId} from 'react';
import {dc10Facility,dc10KvCache,dc10Recovery,dc10Roofline} from './dc10Model';
import type {Dc10SceneId,Dc10State} from './dc10Model';
const C={ink:'#e7fbff',mint:'#83f0d5',blue:'#87cfee',amber:'#ffdda4',red:'#ffb1ae'};
function Label({x,y,children,sub=false,color=C.ink}:{x:number;y:number;children:React.ReactNode;sub?:boolean;color?:string}){
 return <text x={x} y={y} fill={color} fontSize={sub?12:16} fontWeight={sub?500:650}>{children}</text>;
}
function Slab({x,y,w=140,h=67,title,sub,accent=C.mint}:{x:number;y:number;w?:number;h?:number;title:string;sub:string;accent?:string}){
 return <g><path d={'M'+(x+9)+' '+(y+11)+'h'+w+'v'+h+'h-'+w+'Z'} fill="#03121d" opacity=".65"/>
 <path d={'M'+x+' '+y+'h'+(w-15)+'l15 12v'+(h-12)+'h-'+w+'Z'} fill="#23465c" stroke={accent} strokeWidth="2"/>
 <path d={'M'+x+' '+y+'h'+(w-15)+'l15 12h-'+w+'Z'} fill={accent} opacity=".23"/>
 <Label x={x+12} y={y+26}>{title}</Label><Label x={x+12} y={y+49} sub>{sub}</Label></g>;
}
export function Dc10SceneVisual({sceneId,state,revealed,hasProbe}:{sceneId:Dc10SceneId;state:Dc10State;revealed:boolean;hasProbe:boolean}){
 const id=useId().replace(/:/g,'');
 if(!revealed||!hasProbe)return <div className="a05-veiled" aria-label="예측과 직접 관찰 이전의 교육용 수치·물리 그래프는 숨겨져 있습니다"><div className="a05-veiled-object" aria-hidden="true"><span/></div><p>먼저 예측하고 직접 실험을 누르면 현재 조건의 도식이 나타납니다.</p></div>;
 const roof=dc10Roofline(state.intensity,state.bandwidthGb);
 const kv=dc10KvCache(state.contextTokens,state.batch,{offload:state.offload,offloadPathSupported:state.offloadPathSupported,modelResident:state.modelResident});
 const energy=dc10Facility(state.pue,state.throughput);
 const recovery=dc10Recovery(state);
 return <div className="a05-visual a05-dc10-visual" data-testid="dc10-visual">
 <svg viewBox="0 0 690 425" role="img" aria-label={
 sceneId==='ai-roofline-bottleneck'?'관찰한 가상 연산집약도와 메모리 대역폭의 roofline 두 상한':
 sceneId==='llm-prefill-decode-kv'?'프리필과 토큰 순차생성, 상주 모델과 KV cache 별도 경로':
 sceneId==='rack-power-pue-thermal'?'IT 부하, 별도 설비 전력, AI 처리량을 분리한 가상 랙 계층':
 '스위치 A 및 물리 독립 백업 스위치 B, 실제 배선 설정과 세션을 분리하는 장애복구 회로'}>
 <defs><linearGradient id={'dc10'+id} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#234e66"/><stop offset="1" stopColor="#0b2538"/></linearGradient></defs>
 <path d="M25 49H607l55 42v261L76 384l-51-30Z" fill={'url(#dc10'+id+')'} stroke={C.mint} strokeWidth="2"/>
 <path d="M607 49l55 42v261l-55-25Z" fill="#183c50" stroke="#6b9cad"/>
 {sceneId==='ai-roofline-bottleneck'&&<>
  <Label x={57} y={88} color={C.mint}>가상 Roofline · 이론 상한과 실제 측정값은 다릅니다</Label>
  <path d="M90 318H606M90 318V120" stroke={C.ink} strokeWidth="2"/>
  <Label x={94} y={348} sub>0 FLOP/B</Label><Label x={549} y={345} sub>Intensity →</Label><Label x={56} y={117} sub>TFLOP/s</Label>
  <path d={'M90 318L'+(90+Math.min(roof.ridgeFlopsPerByte,80)*6)+' 144L595 144'} fill="none" stroke={C.amber} strokeWidth="5"/>
  <path d="M90 144H595" stroke={C.blue} strokeWidth="2" strokeDasharray="7 5"/>
  <circle cx={90+state.intensity*6} cy={318-(roof.ceilingTflops/4)*174} r="10" fill={C.mint} stroke="#fff" strokeWidth="2"/>
  <Label x={124} y={175}>Peak 4 TFLOP/s</Label>
  <Label x={124} y={200}>BW {state.bandwidthGb} GB/s · I {state.intensity} FLOP/B</Label>
  <Label x={124} y={230} color={C.amber}>현재 상한 {roof.ceilingTflops} TFLOP/s</Label>
  <Label x={124} y={254} sub>ridge {roof.ridgeFlopsPerByte} FLOP/B · {roof.bound==='memory'?'메모리 공급 제약':'계산 상한 제약'}</Label>
  <Label x={86} y={377} sub>정상상태 커널 toy: 캐시·실행효율·서비스 지연 미계산</Label>
 </>}
 {sceneId==='llm-prefill-decode-kv'&&<>
  <Label x={54} y={86} color={C.mint}>가상 토큰 흐름 · Q heads ≠ KV heads</Label>
  <Slab x={62} y={125} w={155} title="Prompt 입력" sub={state.contextTokens+' tokens × '+state.batch+' batch'}/>
  <path d="M221 160H277" stroke={C.mint} strokeWidth="4"/>
  <Slab x={280} y={125} w={153} title="Prefill" sub="문맥 동시 처리" accent={C.blue}/>
  <path d="M438 160H490" stroke={C.amber} strokeWidth="4"/>
  <Slab x={494} y={125} w={144} title="Decode" sub="1 token씩" accent={C.amber}/>
  <Slab x={96} y={245} w={175} title="상주 model" sub={state.modelResident?'residing':'not resident'} accent={C.blue}/>
  <Slab x={370} y={245} w={221} title="K/V cache" sub={kv.bytes+' B toy · '+state.offload} accent={C.mint}/>
  <path d="M500 201V243M280 276H366" fill="none" stroke={C.mint} strokeWidth="3" strokeDasharray="7 4"/>
  <Label x={95} y={353} sub>2 layers × 2 KV heads × dim16 × 2B × K/V2</Label>
  <Label x={95} y={376} sub>TTFT / tokens/s 숫자 예측 안 함 · offload는 연결 지원 필요</Label>
 </>}
 {sceneId==='rack-power-pue-thermal'&&<>
  <Label x={55} y={85} color={C.mint}>가상 동일 측정 기간 · 실제 PUE는 에너지 비율</Label>
  <Slab x={62} y={139} w={169} title="IT 장비" sub="1.0 MW (fixed)" accent={C.blue}/>
  <Slab x={267} y={139} w={181} title="시설 overhead" sub={energy.overheadMw.toFixed(1)+' MW'} accent={C.amber}/>
  <Slab x={489} y={139} w={146} title="시설 전체" sub={energy.facilityPowerMw.toFixed(1)+' MW'} accent={C.mint}/>
  <path d="M233 172H263M450 172H484" stroke={C.mint} strokeWidth="4"/>
  <Slab x={80} y={266} w={244} title={state.throughput+' tasks/s'} sub="별도 애플리케이션 측정" accent={C.blue}/>
  <Slab x={382} y={266} w={215} title={'PUE '+state.pue.toFixed(1)} sub="시설 에너지 / IT 에너지" accent={C.amber}/>
  <Label x={80} y={372} sub>PUE가 낮아도 GPU 이용률·작업당 에너지·응답 속도는 자동 보증되지 않음</Label>
 </>}
 {sceneId==='ai-dc-end-to-end-resilience'&&<>
  <Label x={49} y={86} color={C.mint}>학생이 선택한 회선·상태·정책의 현재 그림</Label>
  <Slab x={55} y={145} w={122} title="요청/NIC" sub="입구" accent={C.blue}/>
  <Slab x={226} y={110} w={161} title="Switch A" sub={state.switch1Healthy?'healthy':'FAILED'} accent={state.switch1Healthy?C.mint:C.red}/>
  <Slab x={226} y={245} w={161} title="Switch B" sub={state.switch2Installed?(state.switch2Healthy?'installed':'FAILED'):'not installed'} accent={state.switch2Installed?C.amber:C.red}/>
  <Slab x={462} y={105} w={158} title="Server A" sub="shared primary" accent={C.blue}/>
  <Slab x={462} y={245} w={158} title="Server B" sub={state.servers===2?'backup target':'absent'} accent={C.amber}/>
  <path d="M179 175L225 144M389 141L461 141" stroke={state.switch1Healthy?C.mint:C.red} strokeWidth="4"/>
  <path d="M179 176L225 280M389 279L461 279" stroke={state.routeBConnected?C.amber:'#6c8290'} strokeDasharray={state.routeBConnected?'none':'7 6'} strokeWidth="4"/>
  <Label x={398} y={327} sub color={state.routeBConfigured?C.mint:C.red}>{state.routeBConfigured?'B configured':'B not configured'}</Label>
  <Label x={57} y={344} sub>{recovery.code} · {state.sessionState} · {state.failoverPolicy}</Label>
  <Label x={57} y={371} sub>장비 수만으로 가용성·무손실·복구시간(RTO)을 보증하지 않음</Label>
 </>}
 <Label x={53} y={410} sub>교육용 2.5D 오리지널 SVG · 실제 데이터센터 측정·검증·SLA 인증 아님</Label>
 </svg>
 <div className="a05-readouts">
 {sceneId==='ai-roofline-bottleneck'?<>
  <span>Intensity <b>{state.intensity} FLOP/B</b></span><span>BW <b>{state.bandwidthGb} GB/s</b></span>
  <span>memory ceiling <b>{roof.memoryCeilingTflops} TFLOP/s</b></span><span>upper bound <b>{roof.ceilingTflops} TFLOP/s</b></span>
 </>:sceneId==='llm-prefill-decode-kv'?<>
  <span>KV cache <b>{kv.bytes} B (toy)</b></span><span>KV heads <b>{kv.nKvHeads}, query heads {kv.queryHeads}</b></span>
  <span>Offload <b>{kv.offloadAccepted?kv.offload:'지원 경로 없음'}</b></span><span>실제 TTFT <b>추정 안 함</b></span>
 </>:sceneId==='rack-power-pue-thermal'?<>
  <span>IT <b>{energy.itPowerMw} MW</b></span><span>Facility <b>{energy.facilityPowerMw} MW</b></span>
  <span>Overhead <b>{energy.overheadMw} MW</b></span><span>APP <b>{energy.throughput} tasks/s</b></span>
 </>:<>
  <span>주경로 <b>{recovery.primaryUsable?'건강':'차단'}</b></span><span>백업 물리 배선 <b>{recovery.backupPhysical?'있음':'없음'}</b></span>
  <span>경로 설정 <b>{recovery.backupConfigured?'완료':'미완료'}</b></span><span>복구 판단 <b>{recovery.code}</b></span>
 </>}
 </div><p className="a05-note">장면 값은 학생이 지금 선택해 관찰한 가상 조건에만 유효합니다. 다른 미방문 조건의 교사 해답은 공개하지 않습니다.</p></div>;
}
