import {useState} from 'react';
import {ElectricitySceneVisual} from './ElectricitySceneVisual';
import {electricitySceneOrder,evaluateElectricity,rcModel} from './electricityModel';
import type {ChargeMode,CircuitTopology,Direction,ElecEvent,ElecFeedback,ElecSceneId} from './electricityModel';
import type {ElectricityVisualState} from './ElectricitySceneVisual';
import '../a05Scenes.css';import './electricityScenes.css';

type Choice={id:string;text:string;whyWrong?:string};
type Story={
  title:string;hook:string;question:string;prediction:string;choices:Choice[];
  prompt:string;answers:Choice[];hints:readonly[string,string,string];
  why:string;nextHook:string;speech:string;assumption:string;
};
const STORIES:Record<ElecSceneId,Story>={
 'charge-voltage-current-arrows':{
  title:'배터리 5V를 연결했는데 계기는 무엇을 보여줄까요?',
  hook:'전압이 있다는 것과 전류가 흐른다는 것은 같은 일이 아니에요.',
  question:'이상적 전원 5V와 1kΩ에서 스위치 OPEN/CLOSED일 때 전류와 전압을 예측해 보세요.',
  prediction:'이상적 전원 5V·저항 1kΩ에서 스위치 OPEN/CLOSED 각각의 전원단자 전압과 회로 전류를 예상해 보세요.',
  choices:[{id:'open-zero',text:'전압은 있어도 전류는 0이에요.'},{id:'always-current',text:'전압이 5V이면 언제나 전류도 5A예요.'}],
  prompt:'5V 선택→스위치 OPEN과 CLOSED→전자/관습전류의 두 화살표를 비교해 보세요.',
  answers:[
   {id:'v-not-current',text:'열린 5V 회로 I=0; 닫힌 1kΩ 회로 I=5mA. 전자 방향과 관습전류는 반대예요.'},
   {id:'v-equals-i',text:'5V면 언제나 5A가 흐르고 V와 I의 단위도 같아요.',whyWrong:'볼트는 전위차, 암페어는 시간당 전하의 흐름이에요. 닫힌 저항회로에서만 I=V/R을 적용해요.'},
   {id:'same-arrows',text:'금속 전자와 관습전류 화살표는 늘 같은 방향이에요.',whyWrong:'전자는 음전하이므로 금속 도선에서 관습전류와 반대 방향으로 움직여요.'},
   {id:'voltage-disappears',text:'스위치를 열면 이상적인 전원 양단 5V도 반드시 0V가 돼요.',whyWrong:'전류 경로가 끊겨도 전원 단자 사이의 전위차는 유지될 수 있어요.'}
  ],
  hints:['끊어진 길에서 전하가 회로를 한 바퀴 돌 수 있을까요?','I=V/R이고 1kΩ는 1000Ω입니다.','전자가 음전하라는 사실을 떠올려 보세요.'],
  why:'전압은 전하당 에너지 차이(V=ΔU/q, J/C), 전류는 시간에 따른 전하량(I=dQ/dt, C/s)이에요. 단순한 이상적 DC 저항 모형에서 OPEN은 I=0, CLOSED에서는 5V/1000Ω=5mA입니다. 전류가 흐르지 않아도 전위차는 있을 수 있어요.',
  nextHook:'저항이 둘이라면 직렬과 병렬의 전류가 어떻게 달라질까요?',
  speech:'스위치를 열었을 때와 닫았을 때를 먼저 예상해 보세요. 전압계와 전류계가 같은 값을 말해줄까요?',
  assumption:'이상적 5V·1kΩ·DC 도선, 금속 전자/관습전류, 기생 누설·내부저항·AC 생략'
 },
 'resistors-series-parallel-kcl':{
  title:'전류가 둘로 갈라지면 더 생기는 걸까요?',
  hook:'같은 1kΩ 두 개, 어떻게 연결하느냐에 따라 회로가 달라져요.',
  question:'저항 연결을 바꾸면 각 저항의 전압과 전원 전체 전류가 어떻게 달라질까요?',
  prediction:'5V, 1kΩ 저항 2개를 직렬/병렬로 놓았을 때 각 저항 전압과 전원 총 전류를 숫자로 예상해 보세요.',
  choices:[{id:'10',text:'두 가지 5mA가 합쳐져 10mA가 돼요.'},{id:'2p5',text:'직렬과 같아서 언제나 2.5mA예요.'}],
  prompt:'직렬/병렬을 바꾸고 등가저항, 전체 전류, 소자 전압, KCL을 비교하세요.',
  answers:[
   {id:'current-conserved',text:'직렬은 같은 2.5mA, 병렬은 5mA+5mA=10mA로 노드 유입/유출이 보존돼요.'},
   {id:'one-branch',text:'병렬 저항 둘이어도 총전류는 한 저항의 5mA 그대로예요.',whyWrong:'두 병렬 가지에 각각 5V가 걸려 전원 전체에는 10mA가 흘러요.'},
   {id:'serial-decay',text:'직렬 첫 저항에서 2.5mA였던 전류가 둘째에서 점차 사라져요.',whyWrong:'정상상태 직렬 경로에서는 어디나 같은 전류가 흐르며 저항마다 전압이 나뉘어요.'},
   {id:'creates-charge',text:'병렬에서 전류가 갈라질 때 전하가 새로 생성돼요.',whyWrong:'전하가 생성되는 게 아니라 회로의 가지를 따라 분배되고 합쳐져요.'}
  ],
  hints:['두 가지 병렬 저항을 하나로 합치면 등가저항은?','직렬 경로에 갈림길이 존재하나요?','병렬 노드 유입 10과 두 가지 유출 5+5를 비교해요.'],
  why:'직렬 등가저항 1kΩ+1kΩ=2kΩ → 5V/2kΩ=2.5mA, 저항마다 2.5V입니다. 병렬 등가저항 500Ω → 10mA 전체, 각 가지 5mA·5V. KCL에서 노드의 유입 전류와 유출 전류 합은 같아요.',
  nextHook:'그렇다면 전류를 잠깐 저장하듯 전하를 모으는 커패시터는 어떨까요?',
  speech:'저항 두 개를 직렬과 병렬로 바꿔 보세요. 각 갈래 숫자를 더하면 어떤 규칙이 보일까요?',
  assumption:'동일 1kΩ 2개·이상적 5V·정상상태 옴 저항, 배선손실·온도/전원 제한 생략'
 },
 'capacitor-rc-charge-discharge':{
  title:'전하를 모으는 커패시터, 언제 다 찰까요?',
  hook:'저항과 커패시터를 잇자 전압이 차츰 움직여요. 기다리는 시간은 누가 정할까요?',
  question:'1kΩ×10µF의 시간상수 10ms에서 몇 볼트가 될까요?',
  prediction:'R=1kΩ, C=10µF, 전원 5V일 때 충전 10ms/30ms의 전압과 완충 후 방전 10ms 전압을 예상해 보세요.',
  choices:[{id:'63',text:'완전히 5V는 아니고 약 3.16V(63%)예요.'},{id:'100',text:'10ms에 정확히 5.00V가 돼요.'}],
  prompt:'R=1/2kΩ, C=10/20µF, 시간 0–100ms를 조절하고, 충전 10ms→방전 10ms→R/C 두배 실험을 해보세요.',
  answers:[
   {id:'tau-exponential',text:'τ=RC이며 충전 1τ 약 63%, 방전 1τ 약 37%; R 또는 C가 두 배면 τ도 두 배예요.'},
   {id:'full-after-tau',text:'시간상수 1τ에 커패시터가 반드시 100% 충전돼요.',whyWrong:'충전은 지수적으로 느려져 1τ에서는 약 63%예요.'},
   {id:'no-rc-effect',text:'R이나 C를 두 배로 바꿔도 τ와 충전속도는 언제나 같아요.',whyWrong:'τ=RC이므로 나머지가 같으면 R 또는 C 두배는 τ 두배예요.'},
   {id:'instant-empty',text:'충전 전원을 분리하는 즉시 모든 커패시터는 반드시 0V가 돼요.',whyWrong:'방전·누설 경로에 따라 변화합니다. 이 장면의 방전은 저항 경로를 가정해요.'}
  ],
  hints:['한 시간상수 뒤 충전율은 1−e^(−1)입니다.','R×C의 단위는 Ω×F = 초예요.','방전은 처음 5V에서 e^(−t/τ)로 감소해요.'],
  why:'이상적인 1차 RC에서 τ=RC. 충전 VC=5(1−e^(−t/τ)), 방전 VC=5e^(−t/τ). 1kΩ·10µF면 τ=10ms, t=10ms에서 충전 3.16V, 방전 1.84V예요. DRAM 실물 리텐션은 이 시간상수와 다른 문제예요.',
  nextHook:'커패시터와 전원에 쌓이거나 소비되는 에너지는 어떻게 계산할까요?',
  speech:'시간 눈금을 움직이기 전에 10밀리초 뒤 전압을 예상해 보세요. 저항이나 커패시턴스도 바꿔볼까요?',
  assumption:'1차 RC 이상화·초기 충전0V/방전5V·누설/ESR/DRAM 센스앰프 미포함. 10ms는 toy RC, DRAM retention 아님'
 },
 'power-energy-joules-heat':{
  title:'와트와 줄은 같은 뜻일까요?',
  hook:'똑같은 전압에서도 회로마다 전력·에너지가 달라질까요?',
  question:'5V×10mA×10초와 10µF 커패시터 5V의 에너지는 같을까요?',
  prediction:'5V·10mA를 10초 사용할 때 전력/에너지와 10µF 커패시터가 5V일 때 저장에너지를 예상해 보세요.',
  choices:[{id:'half',text:'0.5J. 전력과 시간의 곱이에요.'},{id:'50',text:'50W와 50J가 같은 뜻이므로 50J예요.'}],
  prompt:'전압 5/10V, 부하 전류 5/10mA, 작동 1/10초를 조합하고 50mW→0.5J→커패시터125µJ를 확인하세요.',
  answers:[
   {id:'power-vs-energy',text:'P=VI는 W=J/s, E=Pt는 J. 10µF 커패시터 에너지는 ½CV²로 V 두배면 ×4예요.'},
   {id:'watts-joules',text:'50W와 50J는 시간과 관계없는 동일 단위예요.',whyWrong:'전력 W는 에너지 변화율 J/s이고 J는 에너지 자체입니다.'},
   {id:'double-cap',text:'같은 C에서 커패시터 전압 두배면 저장 에너지도 딱 두배예요.',whyWrong:'Ecap=½CV²이므로 전압 두배는 에너지 네배가 돼요.'},
   {id:'fan-heat',text:'GPU 소비 전력은 모두 즉시 CPU 냉각 팬에서 열로 생겨요.',whyWrong:'전기 소자의 에너지 저장·전달과 열 발생 위치/시점은 시스템에 따라 달라요.'}
  ],
  hints:['전력은 매초 에너지를 쓰는 속도입니다.','커패시터 저장 에너지에는 V²이 있어요.','전력과 열 발생 위치를 같은 개념으로 취급하면 안 돼요.'],
  why:'5V×0.010A=0.05W=50mW; 10초 소비 에너지=0.5J. 커패시터는 ½×10µF×(5V)²=125µJ, 10V이면 500µJ. 이 실험에서 V와 I는 독립 입력이므로 고정 R 부하라고 가정하지 않으며 충전기 입력 에너지=커패시터 저장 에너지라는 주장도 아니에요.',
  nextHook:'이제 밴드·도핑·PN 접합을 통해 실리콘이 스위치가 되는 이유를 살펴볼까요?',
  speech:'5볼트, 10밀리암페어, 10초를 골라 보세요. 에너지와 소비 속도는 같은 단위일까요?',
  assumption:'V와 I는 서로 독립 조작하는 가상 부하·고정 R 아님, P 일정·부하 총에너지와 저장 Ecap 구분, 실제 GPU 열/PSU 효율 미적용'
 }
};
const initial=():ElectricityVisualState=>({
 volts:5,closed:false,direction:'conventional',topology:'series',
 mode:'charge',rOhms:1000,cMicroFarads:10,timeMs:0,rcInitialVoltageV:0,rcSegmentStartMs:0,
 powerVolts:5,loadMilliAmps:5,seconds:1
});
export interface ElectricityLabProps{onEvent?:(event:ElecEvent)=>void;onSpeech?:(id:ElecSceneId,speechText:string)=>void;}
export function ElectricitySceneLab({onEvent,onSpeech}:ElectricityLabProps){
 const [index,setIndex]=useState(0),sceneId=electricitySceneOrder[index],story=STORIES[sceneId];
 const [state,setState]=useState<ElectricityVisualState>(initial),[prediction,setPrediction]=useState<string|null>(null);
 const [seen,setSeen]=useState<string[]>([]),[answer,setAnswer]=useState<string|null>(null);
 const [feedback,setFeedback]=useState<ElecFeedback|null>(null),[hint,setHint]=useState(0),[why,setWhy]=useState(false);
 function emit(type:ElecEvent['type'],payload?:ElecEvent['payload']){onEvent?.({sceneId,type,payload});}
 function seenOnce(key:string){setSeen(xs=>xs.includes(key)?xs:[...xs,key]);}
 function change(next:ElectricityVisualState,label:string){setState(next);setFeedback(null);setWhy(false);emit('parameter.changed',{label});}
 function enter(i:number){
  if(i<0||i>=electricitySceneOrder.length)return;
  setIndex(i);setState(initial());setPrediction(null);setSeen([]);setAnswer(null);setFeedback(null);setHint(0);setWhy(false);
  onEvent?.({sceneId:electricitySceneOrder[i],type:'scene.enter'});
 }
 function circuit(closed:boolean){change({...state,volts:5,closed},'switch '+closed);seenOnce(closed?'closed':'open');}
 function direction(value:Direction){change({...state,direction:value},'direction '+value);seenOnce(value);}
 function topology(value:CircuitTopology){change({...state,topology:value},'topology '+value);seenOnce(value);}
 function rcObservation(next:ElectricityVisualState){
  const current=rcModel(next.mode,next.rOhms,next.cMicroFarads,next.timeMs,5,
    next.rcInitialVoltageV,next.rcSegmentStartMs);
  const atTau=next.timeMs-next.rcSegmentStartMs===10&&next.rOhms===1000&&next.cMicroFarads===10;
  if(atTau&&next.mode==='charge'&&next.rcInitialVoltageV===0)seenOnce('charge-tau');
  if(atTau&&next.mode==='discharge'&&next.rcInitialVoltageV===5)seenOnce('discharge-tau');
  if(current.tauMs>10)seenOnce('new-tau');
 }
 function rcChange(next:ElectricityVisualState,label:string){change(next,label);rcObservation(next);}
 function modeFromCurrent(mode:ChargeMode){
  const before=rcModel(state.mode,state.rOhms,state.cMicroFarads,state.timeMs,5,
    state.rcInitialVoltageV,state.rcSegmentStartMs);
  rcChange({...state,mode,rcInitialVoltageV:before.voltageV,rcSegmentStartMs:state.timeMs},
    'RC continuous mode switch '+mode);
 }
 function rcReset(mode:ChargeMode,rOhms=state.rOhms,cMicroFarads=state.cMicroFarads){
  rcChange({...state,mode,rOhms,cMicroFarads,timeMs:0,
    rcSegmentStartMs:0,rcInitialVoltageV:mode==='charge'?0:5},'RC explicit new experiment');
 }
 function changeRcTime(timeMs:number){
  const rewind=timeMs<state.rcSegmentStartMs;
  rcChange({...state,timeMs,rcSegmentStartMs:rewind?0:state.rcSegmentStartMs,
    rcInitialVoltageV:rewind?(state.mode==='charge'?0:5):state.rcInitialVoltageV},
    rewind?'RC timeline reset':'time '+timeMs);
 }
 function powerChange(next:ElectricityVisualState,label:string){
  change(next,label);
  if(next.powerVolts===5&&next.loadMilliAmps===10&&next.seconds===10)seenOnce('base-energy');
  if(next.powerVolts===10)seenOnce('cap-doubled');
 }
 function speak(text:string){emit('voice.requested',{text});onSpeech?.(sceneId,text);}
 const shown=prediction!==null;
 const physicalReady=evaluateElectricity(sceneId,seen,null).conditions.slice(0,-1).every(x=>x.passed);
 const control=(text:string,fn:()=>void,selected:boolean)=>(
  <button type="button" onClick={fn} aria-pressed={selected} className={selected?'selected':''}>{text}</button>
 );
 return <div className="a05-lab a05-electricity-lab" lang="ko">
  <header className="a05-head">
   <p className="a05-eyebrow">A05 · FOUNDATION LAB / 12</p>
   <h1>전압 → 저항 → RC → 전력: 첫 전기 실험</h1>
   <p>먼저 예상하고, 안전한 화면 모형을 조작하고, 관찰 이유를 설명하세요.</p>
   <nav className="a05-stepnav" aria-label="전기 기초 레슨 순서">
    {electricitySceneOrder.map((id,i)=><button key={id} type="button" disabled={i>index}
     aria-current={i===index?'step':undefined} className={i===index?'active':''} onClick={()=>enter(i)}>
     {String(i+1).padStart(2,'0')}</button>)}
   </nav>
  </header>
  <main className="a05-stage">
   <section className="a05-copy">
    <span className="a05-eyebrow">{sceneId} · STEP {index+1}/4</span>
    <h2>{story.title}</h2>
    {sceneId==='charge-voltage-current-arrows'&&<p className="a05-note">선수 개념 40초: 전자는 음전하예요. 전하 Q는 쿨롱(C), 전류 I는 초당 이동한 전하(C/s)예요. 금속의 전자 이동 방향은 양전하 기준 관습전류와 반대예요. 스위치 결과는 직접 예상해 보세요.</p>}
    <p className="a05-hook">{story.hook}</p><p className="a05-question">{!shown?story.question:physicalReady?'관찰한 사실을 바탕으로 이유를 골라보세요.':'지금은 실험 조작 단계입니다. 회로를 직접 바꿔 관찰하세요.'}</p>
    {!shown&&<div className="a05-box">
     <h3>예측을 먼저 기록해요</h3><p>{story.prediction}</p>
     <div className="a05-choice-set">{story.choices.map(c=><button key={c.id} type="button"
      aria-pressed={prediction===c.id} disabled={shown} className={prediction===c.id?'selected':''}
      onClick={()=>{setPrediction(c.id);emit('prediction.recorded',{answer:c.id});}}>{c.text}</button>)}</div>
    </div>}
    {shown&&<>
     {physicalReady?<div className="a05-box"><h3>무엇을 알아냈나요?</h3>
      <div className="a05-choice-set">{story.answers.map(c=><button key={c.id} type="button"
       aria-pressed={answer===c.id} className={answer===c.id?'selected':''}
       onClick={()=>{setAnswer(c.id);setFeedback(null);setWhy(false);}}>{c.text}</button>)}</div>
      <button className="a05-primary" type="button" onClick={()=>{
       const f=evaluateElectricity(sceneId,seen,answer);setFeedback(f);emit('answer.checked',{passed:f.passed});
      }}>관찰 조건으로 확인하기</button>
     </div>:<div className="a05-box a05-experiment-guidance" role="status"><h3>실험 진행 중</h3><p>회로 그림 바로 아래의 ‘실험 조작’에서 변수를 바꾸고 직접 관찰한 뒤 설명 문제로 이동해요.</p></div>}
    </>}
    <div className="a05-tools"><button type="button" onClick={()=>speak(story.speech)}>한국어 질문 듣기</button>
     {shown&&<button type="button" disabled={hint>=3} onClick={()=>{
      setHint(Math.min(3,hint+1));emit('hint.opened',{level:Math.min(3,hint+1)});
     }}>힌트 {hint}/3</button>}
    </div>
    {hint>0&&<div className="a05-hint" role="status">{story.hints.slice(0,hint).map((x,i)=><p key={i}>{i+1}. {x}</p>)}</div>}
    {feedback&&<div className="a05-result" role="status" aria-live="polite">
     <h3>{feedback.passed?'이유까지 발견했어요!':'아직 확인할 실험 조건이 있어요.'}</h3>
     {feedback.conditions.map(c=><p key={c.label}><strong>{c.passed?'✓':'△'} {c.label}</strong>
      {' — '}{c.passed?'직접 확인했어요.':c.explanation}</p>)}
     {!feedback.passed&&<p>{story.answers.find(x=>x.id===answer)?.whyWrong}</p>}
     <button type="button" onClick={()=>speak(feedback.passed?story.nextHook:feedback.conditions.filter(c=>!c.passed).map(c=>c.explanation).join(' '))}>피드백 듣기</button>
     {feedback.passed&&<button type="button" onClick={()=>setWhy(!why)}>{why?'원리 접기':'왜? 원리 보기'}</button>}
    </div>}
    {feedback?.passed&&why&&<div className="a05-why"><h3>왜 그럴까요?</h3><p>{story.why}</p>
     {feedback.passed&&<p className="a05-next">{story.nextHook}</p>}</div>}
    {feedback?.passed&&index<3&&<button type="button" className="a05-primary" onClick={()=>enter(index+1)}>다음 질문으로 →</button>}
    {feedback?.passed&&index===3&&<div className="a05-why"><p className="a05-next">{story.nextHook}</p>
     <p>이 샘플은 A02 공식 레슨 진행·저장 엔진과 분리되어 있습니다.</p></div>}
   </section>
   <section className="a05-canvas-col" aria-label="전기 회로 2.5D 실시간 시뮬레이터">
    <div className="a05-canvas-header"><span>LIVE ELECTRICITY 2.5D</span><span>{shown?'관찰 가능':'예측 먼저'}</span></div>
    <ElectricitySceneVisual sceneId={sceneId} state={state} revealed={shown}/>
    {shown&&<div className="a05-experiment-dock" data-testid="electricity-experiment-dock" aria-label="실험 조작">
     <h3>실험 조작 <span>현재 장면의 물리 변수</span></h3>
     <p className="a05-dock-instruction">{story.prompt}</p>
      {sceneId==='charge-voltage-current-arrows'&&<div className="a05-electricity-controls">
       <strong>전원</strong><div className="a05-control-buttons">
        {control('5 V',()=>change({...state,volts:5},'source 5V'),state.volts===5)}
        {control('0 V',()=>change({...state,volts:0},'source 0V'),state.volts===0)}</div>
       <strong>회로 스위치</strong><div className="a05-control-buttons">
        {control('열림 (OPEN)',()=>circuit(false),!state.closed)}
        {control('닫힘 (CLOSED)',()=>circuit(true),state.closed)}</div>
       <strong>흐름 방향 보기 (관찰 보조)</strong><div className="a05-control-buttons">
        {control('관습전류',()=>direction('conventional'),state.direction==='conventional')}
        {control('전자 이동',()=>direction('electron'),state.direction==='electron')}</div>
      </div>}
      {sceneId==='resistors-series-parallel-kcl'&&<div className="a05-control-buttons">
       {control('직렬 2kΩ',()=>topology('series'),state.topology==='series')}
       {control('병렬 500Ω',()=>topology('parallel'),state.topology==='parallel')}
      </div>}
      {sceneId==='capacitor-rc-charge-discharge'&&<div className="a05-electricity-controls">
       <strong>상태</strong><div className="a05-control-buttons">
        {control('현재 전압에서 충전',()=>modeFromCurrent('charge'),state.mode==='charge')}
        {control('현재 전압에서 방전',()=>modeFromCurrent('discharge'),state.mode==='discharge')}</div>
       <button type="button" className="a05-reset-action" onClick={()=>rcReset('discharge')}>5V 완충 후 새 방전 실험</button>
       <strong>R / C (변경 시 새 실험으로 재설정)</strong><div className="a05-control-buttons">
        {control('R=1kΩ',()=>rcReset(state.mode,1000,state.cMicroFarads),state.rOhms===1000)}
        {control('R=2kΩ',()=>rcReset(state.mode,2000,state.cMicroFarads),state.rOhms===2000)}
        {control('C=10µF',()=>rcReset(state.mode,state.rOhms,10),state.cMicroFarads===10)}
        {control('C=20µF',()=>rcReset(state.mode,state.rOhms,20),state.cMicroFarads===20)}
       </div>
       <label htmlFor="elec-rc-time">시간 <strong>{state.timeMs}ms</strong></label>
       <input id="elec-rc-time" type="range" min="0" max="100" step="10" value={state.timeMs}
        onChange={e=>changeRcTime(Number(e.target.value))}/>
       <p className="a05-note">중간에 방전으로 바꿔도 그 순간 커패시터 전압은 튀지 않아요. 별도 5V 완충 버튼은 초기 상태를 명시적으로 새로 만듭니다. R/C 변경·시간 되감기는 새 실험으로 재설정해요.</p>
      </div>}
      {sceneId==='power-energy-joules-heat'&&<div className="a05-electricity-controls">
       <strong>전압 (부하 전류와 독립인 교육용 입력)</strong><div className="a05-control-buttons">
        {control('5V',()=>powerChange({...state,powerVolts:5},'V5'),state.powerVolts===5)}
        {control('10V',()=>powerChange({...state,powerVolts:10},'V10'),state.powerVolts===10)}</div>
       <strong>부하 전류</strong><div className="a05-control-buttons">
        {control('5mA',()=>powerChange({...state,loadMilliAmps:5},'I5'),state.loadMilliAmps===5)}
        {control('10mA',()=>powerChange({...state,loadMilliAmps:10},'I10'),state.loadMilliAmps===10)}</div>
       <strong>작동 시간</strong><div className="a05-control-buttons">
        {control('1초',()=>powerChange({...state,seconds:1},'t1'),state.seconds===1)}
        {control('10초',()=>powerChange({...state,seconds:10},'t10'),state.seconds===10)}</div>
       <p className="a05-note">이 화면에서 V와 I는 각각 설정해 볼 수 있는 가상 부하예요. 언제나 같은 고정 저항이라는 뜻은 아닙니다.</p>
      </div>}
    </div>}
    <div className="a05-model-limit"><strong>공학 가정 및 단위</strong> {story.assumption}</div>
    <div className="a05-source">A06 교육 PR #7 / 12 전기·RC 원고 · A05 오리지널 SVG · 실물 회로 측정 아님</div>
   </section>
  </main>
 </div>;
}
