import {useState} from 'react';
import {Logic16SceneVisual} from './Logic16SceneVisual';
import {evaluateNetwork,gradeLogic16,initialClockHighNoEdge,latchCase,latchStep,logic16Fresh,logic16Order,nestedNand} from './logic16Model';
import type {Bit,GateType,Logic16Event,Logic16SceneId,Logic16State,Network} from './logic16Model';
import '../a05Scenes.css';import './logic16.css';
type Option={id:string;text:string;whyWrong?:string};
type Story={title:string;hook:string;question:string;prediction:string;choices:Option[];task:string;answers:Option[];
 hints:readonly [string,string,string];why:string;next:string;voice:string;bounds:string};
const STORIES:Record<Logic16SceneId,Story>={
 'logic-nand-nor-truth-table':{
  title:'두 입력을 받는 NAND와 NOR은 어떻게 다를까요?',
  hook:'NOT도 실제로 0/1을 뒤집는 연산을 해요. 두 신호를 조합해 볼까요?',
  question:'A/B를 독립적으로 바꾼 4개 상태에서 게이트의 출력은 무엇일까요?',
  prediction:'(A,B)=(1,1)과 (0,1)의 결과를 예상한 뒤, NAND/NOR마다 독립적으로 조작하세요.',
  choices:[{id:'compare',text:'두 입력이 함께 작용하는 조건을 비교할게요.'},{id:'identical',text:'어떤 A/B든 NAND와 NOR의 답은 같을 것 같아요.'}],
  task:'NAND와 NOR 각각 네 입력 조합을 방문하고, PUN(pMOS)·PDN(nMOS)를 직렬 또는 병렬로 독립 선택/검사하고 중첩 NAND 반례를 관찰하세요.',
  answers:[
   {id:'complementary',text:'NAND/NOR의 정착 출력은 다르고 PUN/PDN은 보완형으로 연결돼요. 중첩 NAND의 괄호도 지켜야 해요.'},
   {id:'m1',text:'NAND에서 nMOS 하나라도 ON이면 출력은 무조건 0이에요.',whyWrong:'NAND pull-down nMOS 두 개가 직렬이므로 둘 다 켜져야 출력이 GND로 내려갑니다.'},
   {id:'m2',text:'CMOS NAND의 PDN은 병렬이고 PUN은 직렬이에요.',whyWrong:'NAND는 nMOS PDN 직렬, pMOS PUN 병렬이고 NOR은 반대입니다.'},
   {id:'m3',text:'NAND(NAND(A,B),C)는 입력 세 개짜리 NAND(A,B,C)와 항상 같아요.',whyWrong:'NAND는 AND의 부정이라 괄호에 따라 결과가 달라질 수 있어요. A=1,B=0,C=1 반례를 비교해 보세요.'}
  ],
  hints:['직렬 경로는 두 스위치가 모두 닫혀야 이어지나요?','위와 아래의 pMOS/nMOS 경로는 보완되어야 해요.','NAND를 다시 NAND하는 연산의 괄호를 꼭 유지하세요.'],
  why:'NAND 00/01/10/11은 1/1/1/0, NOR은 1/0/0/0입니다. 정착한 이상 CMOS에서 NAND PDN=nMOS 직렬, PUN=pMOS 병렬이고 NOR은 반대예요. NAND(A,A)=NOT(A)로 범용 게이트 구성이 가능하지만 두 NAND를 중첩했다고 자동으로 3-input NAND가 되는 것은 아닙니다.',
  next:'현재 입력을 계산하는 게이트와 과거 Q를 보존하는 피드백은 어떻게 다를까요?',
  voice:'A와 B 중 어떤 입력이 출력에 영향을 주는지 먼저 예상해 보세요. 아직 전체 정답표는 보여드리지 않을게요.',
  bounds:'정착된 이상적 static CMOS 0/1 입력; 입력 과도/글리치, 실제 지연과 누설, PVT/팬아웃 생략. 실제 transistor 회로 지도가 아님'
 },
 'combinational-vs-sequential-memory':{
  title:'같은 현재 D=0인데 Q는 달라질까요?',
  hook:'출력에 오래전의 정보를 되돌려 주는 피드백이 있다고 해 봐요.',
  question:'G가 닫혔을 때 현재 D가 바뀌어도 이전 Q는 남을까요?',
  prediction:'같은 현재 D=0에서 두 래치가 이전 이력만 다를 때 Q를 예상해 보세요. 순수 NAND 조합회로와도 비교하세요.',
  choices:[{id:'history',text:'지금 D뿐 아니라 이전에 저장한 상태를 비교할게요.'},{id:'current',text:'모든 회로의 Q는 항상 지금 D와 동일해요.'}],
  task:'두 역사(Q0/Q1)를 각각 실행하고, G=0에서 D 변경 및 전원 OFF→ON 후 상태를 비교하세요.',
  answers:[
   {id:'history-q',text:'조합 NAND는 현재 A/B만 보지만, G=1 양의 레벨 래치는 D를 따라가고 G=0에는 이전 Q를 보존해요. 일반 CMOS 래치는 전원 차단 뒤 Q가 보증되지 않아요.'},
   {id:'m1',text:'입력만으로 계산하는 NAND도 언제나 전날 상태를 기억해요.',whyWrong:'조합 게이트는 정착된 현재 입력만 따르며 과거 상태를 보존하려면 저장 노드가 필요합니다.'},
   {id:'m2',text:'G=0으로 닫은 래치도 D를 바꾸면 Q가 즉시 따라 바뀌어요.',whyWrong:'닫힌 래치는 입력 D의 변화를 차단해 전원이 살아 있는 동안 이전 Q를 유지해요.'},
   {id:'m3',text:'일반 CMOS 래치는 전원을 껐다 켜면 이전 비트가 자동 복구돼요.',whyWrong:'일반 CMOS 래치는 휘발성입니다. 전원 차단 뒤 이전 Q 복원은 보증할 수 없어요.'}
  ],
  hints:['기억을 보존하려면 Q가 어디로 피드백돼야 할까요?','G=0이면 D가 내부 노드로 전달되나요?','전원 OFF 동안 같은 상태가 보장될까요?'],
  why:'양의 레벨 D 래치는 G=1 동안 D를 따라가고 G=0 동안 마지막 Q를 붙잡아요. 초기 Q1에서 G1/D1, G0/D0이면 현재 D0에도 Q1이고, 초기 Q0 이력이면 같은 D0에서 Q0입니다. 전원이 끊기면 일반 CMOS 래치 Q는 무효이며 OFF→ON에 이전 상태를 보장하지 않습니다. 조합 NAND는 입력 이력을 저장하지 않아요.',
  next:'계속 HIGH인 동안 입력을 따라가는 래치와 한 번 샘플하는 DFF의 차이를 볼까요?',
  voice:'두 회로에 같은 현재 입력을 넣을게요. 직전에 어떤 일이 있었는지도 기억해 두세요.',
  bounds:'양의 레벨 ideal D 래치, 명시적 초기 Q/전원 공급 필요. 정착 후 출력을 보는 toy; 실제 tPD/비동기 reset/race는 생략'
 },
 'd-latch-vs-d-flip-flop':{
  title:'클록 HIGH 구간과 상승에지는 같은가요?',
  hook:'시계가 켜져 있는 시간과 0→1 변화 사건을 따로 보세요.',
  question:'HIGH 중 D가 0→1→0이 되면 래치와 상승에지 DFF의 Q는?',
  prediction:'HIGH 구간 D 두 번 변경과 t2/t8 상승사건에서 저장 값을 예상해 보세요.',
  choices:[{id:'events',text:'HIGH인 구간과 0→1 순간을 구분해 볼게요.'},{id:'same',text:'둘은 클록 HIGH 동안 똑같은 Q를 가져요.'}],
  task:'t2 CLK 상승D0, t3 D1, t4 D0, t5 하강, t6 D1, t8 재상승D1을 눌러 래치와 DFF Q를 비교하세요. “처음 CLK가 1”은 상승사건인지 따로 검사하세요.',
  answers:[
   {id:'edge-vs-level',text:'래치는 G/CLK=1 동안 D를 따라가지만 양의 에지 DFF는 실제 0→1 순간만 D를 샘플해 다음 에지까지 보존해요.'},
   {id:'m1',text:'DFF도 클록 HIGH 동안 D가 바뀔 때마다 계속 Q를 바꿔요.',whyWrong:'상승에지 DFF는 실제 상승 순간을 기록합니다. 높은 레벨 유지 중에는 새로운 샘플 이벤트가 없어요.'},
   {id:'m2',text:'양의 레벨 D 래치도 상승 에지만 기다려야 D를 저장해요.',whyWrong:'래치는 클록/게이트가 열린 레벨 전체에서 D를 따라갈 수 있습니다.'},
   {id:'m3',text:'어떤 DFF든 전원 ON과 동시에 Q0으로 초기화되고 비동기 reset이 없어요.',whyWrong:'Q 초기화/비동기 preset/clear 유무는 회로 설계마다 다르고 보편적이지 않습니다.'}
  ],
  hints:['레벨은 구간, 에지는 변화 사건이에요.','상승에지형 DFF는 이전 CLK0 → 현재 CLK1인가요?','초기 CLK1 화면만 보고 새 에지가 있었다고 추론할 수 있을까요?'],
  why:'t2에서 D0으로 상승하면 DFF Q0이고 t3/t4에 CLK1 유지 동안 D가 1→0이어도 DFF Q0을 보존합니다. 양의 레벨 래치 Q는 각각 D1→0을 따릅니다. t8 새 상승에서 DFF Q1로 갱신돼요. 실물은 유한 tCQ/전파지연이 있으며 비동기 reset/preset 옵션은 셀마다 달라요.',
  next:'엣지 바로 근처에서 D를 바꾸면 어느 지연 경로가 문제일까요?',
  voice:'클록을 계속 켠 상태에서 입력을 두 번 바꿔보세요. 두 저장 회로가 똑같이 움직일지 먼저 예상해 봐요.',
  bounds:'t0,t2,t3,t4,t5,t6,t8ns는 toy 이벤트; clk-to-Q 지연, setup/hold 위반, reset/preset은 별도. 최초 CLK1 표시는 새 상승 에지 증거 아님'
 },
 'setup-hold-metastability-clock':{
  title:'클록을 느리게 하면 setup과 hold가 모두 해결될까요?',
  hook:'늦게 도착하는 신호와 너무 빨리 바뀌는 신호는 서로 다른 실패예요.',
  question:'버퍼를 넣을 때 clock8/9ns 각각 setup/hold 조건을 따로 검사하세요.',
  prediction:'버퍼 없는 T8ns와 버퍼를 넣은 T8/9ns 각각 setup/hold PASS/FAIL을 먼저 예상하세요. 에지 바로 옆 입력의 Q는 보장될까요?',
  choices:[{id:'separate',text:'최대 지연과 최소 지연을 나눠 계산해야겠어요.'},{id:'only-period',text:'클록을 느리게 하면 모든 종류의 시간 제약이 자동 해결돼요.'}],
  task:'먼저 T8/버퍼 없음 → T8/버퍼 ON → T9/버퍼 ON을 각기 조작하고, 에지 근처 D 변화와 위험 상태를 비교하세요.',
  answers:[
   {id:'separate-setup-hold',text:'setup은 최대 지연, hold는 최소 지연 조건이에요. 버퍼+주기를 함께 조정해야 할 수 있고 메타안정성은 확률 위험이지 확정 비트값이 아니에요.'},
   {id:'m1',text:'클록 주기만 무조건 길게 하면 hold도 자동 해결돼요.',whyWrong:'같은 에지에 대한 hold 위반은 최소 경로 문제여서 단순 주기 증가만으로 해결되지 않아요.'},
   {id:'m2',text:'가장 빠른 tCD와 가장 늦은 tPD는 언제나 같은 값으로 계산해요.',whyWrong:'tCD는 최초 변화 가능 시각, tPD는 최종 안정 최대 지연입니다. 서로 다른 경계값이에요.'},
   {id:'m3',text:'setup/hold를 어기면 Q는 반드시 0이고 동기화기 2개면 실패 확률이 정확히 0이에요.',whyWrong:'에지 근처 위반은 메타안정성 가능성을 키울 뿐 Q값 결정론적 예측이나 실패 0%를 보장하지 않아요.'}
  ],
  hints:['setup은 데이터가 너무 늦고 hold는 너무 빠른 경우예요.','최대 tCQ+tPD+setup, 최소 tCQ+tCD−hold를 나눠 보세요.','두 플립플롭 동기화는 위험을 줄일 수 있어도 절대 0으로 만들지 못해요.'],
  why:'최대 경로 1.2+5+1.3=7.5ns → T8 setup 여유 +0.5ns. 최소 경로 0.2+0.3=0.5ns, hold 요구0.8ns → −0.3ns FAIL. 버퍼 max+0.6/min+0.4를 넣으면 setup 필요8.1ns로 T8에서 −0.1ns FAIL, hold 도착0.9ns라 +0.1ns PASS. T9에서는 setup +0.9ns, hold +0.1ns로 둘 다 PASS. 스큐/지터0인 단일 도메인 교육 모델이고 에지 위반은 비결정적 위험입니다.',
  next:'05 SRAM 저장 회로와 17 CPU 레지스터·파이프라인에서 타이밍을 다시 찾아볼까요?',
  voice:'데이터가 너무 늦게 오는 경우와 너무 빨리 바뀌는 경우를 따로 놓고 클록 주기를 조절해 볼까요?',
  bounds:'모든 숫자는 invented ns toy: tCQ max/min1.2/0.2, logic max/min5/0.3, setup1.3, hold0.8, buf max/min0.6/0.4; zero skew/jitter, same-clock domain only. 2FF risk never exactly zero'
 }
};
export interface Logic16LabProps{onEvent?:(ev:Logic16Event)=>void;onSpeech?:(id:Logic16SceneId,text:string)=>void}
export function Logic16SceneLab({onEvent,onSpeech}:Logic16LabProps){
 const [index,setIndex]=useState(0),sceneId=logic16Order[index],story=STORIES[sceneId];
 const [state,setState]=useState<Logic16State>(logic16Fresh),[prediction,setPrediction]=useState<string|null>(null);
 const [seen,setSeen]=useState<string[]>([]),[answer,setAnswer]=useState<string|null>(null);
 const [feedback,setFeedback]=useState<ReturnType<typeof gradeLogic16>|null>(null);
 const [hint,setHint]=useState(0),[why,setWhy]=useState(false),[networkVerdict,setNetworkVerdict]=useState('');
 const [lastHistory,setLastHistory]=useState('');
 const revealed=prediction!==null;const interacted=seen.length>0;const mayAnswer=seen.length>=2;
 const emit=(type:Logic16Event['type'],payload?:Record<string,unknown>)=>onEvent?.({sceneId,type,payload});
 const obs=(tag:string)=>setSeen(old=>old.includes(tag)?old:[...old,tag]);
 function change(next:Logic16State,tag:string){setState(next);setFeedback(null);setWhy(false);obs(tag);emit('parameter.changed',{tag});}
 function enter(i:number){if(i<0||i>=4)return;setIndex(i);setState(logic16Fresh());setSeen([]);setAnswer(null);setPrediction(null);setFeedback(null);setWhy(false);setHint(0);setNetworkVerdict('');setLastHistory('');onEvent?.({sceneId:logic16Order[i],type:'scene.enter'});}
 const ctl=(label:string,fn:()=>void,selected:boolean)=><button type="button" aria-pressed={selected} className={selected?'selected':''} onClick={fn}>{label}</button>;
 function selectGate(g:GateType){setState(old=>({...old,gate:g,pun:'unset',pdn:'unset'}));setNetworkVerdict('');setFeedback(null);}
 function setBit(which:'a'|'b',v:Bit){
  const next={...state,[which]:v};setState(next);setFeedback(null);
  obs(state.gate+String(next.a)+String(next.b));
  emit('parameter.changed',{which,v});
 }
 function net(which:'pun'|'pdn',v:Network){setState({...state,[which]:v});setNetworkVerdict('');setFeedback(null);}
 function gradeNetwork(){const n=evaluateNetwork(state.gate,state.pun,state.pdn);
  setNetworkVerdict(!n.selected?'두 네트워크를 직접 선택해 주세요.':n.correct?'PUN/PDN 보완 연결을 확인했어요.':'틀린 배선입니다. 두 입력이 동시에 연결될 조건을 다시 조사하세요.');
  if(n.correct)obs('topology-'+state.gate);emit('parameter.changed',{tag:'topology-'+state.gate,correct:n.correct});
 }
 function history(q:Bit){const result=latchCase(q);setState({...state,d:result.d,g:result.g,q:result.q,powered:true});
  obs(q===0?'hold0':'hold1');setLastHistory(result.history+' → 저장 Q'+result.q);emit('parameter.changed',{tag:'history-'+q});}
 function closeGateChange(){const initial={d:1 as Bit,g:0 as Bit,q:1 as Bit,powered:true};
  const x=latchStep(initial,{type:'d',bit:0});setState({...state,...x});obs('gate-closed-d-change');setLastHistory('G0 동안 D1→D0, Q'+x.q+' 유지');emit('parameter.changed',{tag:'gate-closed-d-change'});}
 function powerCycle(){let s={d:state.d,g:state.g,q:state.q,powered:true};
  s=latchStep(s,{type:'off'});s=latchStep(s,{type:'on'});
  setState({...state,...s});obs('power-cycle');setLastHistory('전원 OFF→ON · 기존 Q 미보증');emit('parameter.changed',{tag:'power-cycle'});}
 function event(i:number){setState({...state,eventIndex:i,initialHigh:false});if(i===2)obs('t3');if(i===3)obs('t4');if(i===6)obs('t8');setFeedback(null);emit('parameter.changed',{tag:'clock-event-'+i});}
 function initialHigh(){setState({...state,initialHigh:true});obs('initial-high-no-edge');setFeedback(null);emit('parameter.changed',{tag:initialClockHighNoEdge().description});}
 function timing(t:8|9,buffer:boolean,tag:string){change({...state,period:t,buffer},tag);}
 function hazard(){change({...state,hazard:true},'hazard');}
 function speak(s:string){emit('voice.requested',{text:s});onSpeech?.(sceneId,s);}
 const wrong=story.answers.find(x=>x.id===feedback?.misconception)?.whyWrong;
 return <div className="a05-lab a05-logic16-lab" lang="ko">
  <header className="a05-head"><p className="a05-eyebrow">A05 · DIGITAL LOGIC & CLOCK / LESSON 16</p>
   <h1>CMOS 논리에서 래치·플립플롭·타이밍까지</h1><p>4개 독립 실험 · 정답은 예측·직접 조작 후에만 나타납니다.</p>
   <nav className="a05-stepnav" aria-label="디지털 논리 네 단계">{logic16Order.map((x,i)=><button key={x} type="button" disabled={i>index}
    aria-current={i===index?'step':undefined} onClick={()=>enter(i)} className={i===index?'active':''}>{i+1}</button>)}</nav></header>
  <main className="a05-stage"><section className="a05-copy" aria-label="학생용 예측·회로 실험">
   <span className="a05-eyebrow">{sceneId} · {index+1}/4</span><h2>{story.title}</h2>
   <p className="a05-hook">{story.hook}</p><p className="a05-question">{story.question}</p>
   <div className="a05-box"><h3>먼저 예측하세요</h3><p>{story.prediction}</p><div className="a05-choice-set">
    {story.choices.map(c=><button key={c.id} type="button" disabled={revealed} aria-pressed={prediction===c.id}
     className={prediction===c.id?'selected':''} onClick={()=>{setPrediction(c.id);emit('prediction.recorded',{prediction:c.id});}}>{c.text}</button>)}
   </div></div>
   {revealed&&<div className="a05-box"><h3>실험 조건을 직접 바꿔 보세요</h3><p>{story.task}</p>
    {sceneId==='logic-nand-nor-truth-table'&&<div className="a05-logic16-controls">
     <strong>논리 게이트</strong><div className="a05-control-buttons">{ctl('NAND',()=>selectGate('NAND'),state.gate==='NAND')}{ctl('NOR',()=>selectGate('NOR'),state.gate==='NOR')}</div>
     <strong>A/B를 각각 전환</strong><div className="a05-control-buttons">
      {([0,1] as const).map(v=>ctl('A='+v,()=>setBit('a',v),state.a===v))}
      {([0,1] as const).map(v=>ctl('B='+v,()=>setBit('b',v),state.b===v))}
     </div>
     <strong>상단 PUN(pMOS) 스위치 연결을 직접 고르세요</strong><div className="a05-control-buttons">
      {ctl('PUN 직렬',()=>net('pun','series'),state.pun==='series')}
      {ctl('PUN 병렬',()=>net('pun','parallel'),state.pun==='parallel')}</div>
     <strong>하단 PDN(nMOS) 스위치 연결을 직접 고르세요</strong><div className="a05-control-buttons">
      {ctl('PDN 직렬',()=>net('pdn','series'),state.pdn==='series')}
      {ctl('PDN 병렬',()=>net('pdn','parallel'),state.pdn==='parallel')}</div>
     <button type="button" onClick={gradeNetwork}>선택한 배선 검증</button>
     {networkVerdict&&<p role="status" className="a05-note">{networkVerdict}</p>}
     <button type="button" onClick={()=>{const n=nestedNand(1,0,1);obs('nested-counterexample');setNetworkVerdict('A1 B0 C1: 중첩 NAND='+n.nested+', 3-input NAND='+n.triple+' (정착 논리 비교)');}}>세 입력 NAND 중첩 반례 살펴보기</button>
    </div>}
    {sceneId==='combinational-vs-sequential-memory'&&<div className="a05-logic16-controls">
     <strong>같은 현재 D=0, 서로 다른 과거 이력</strong><div className="a05-control-buttons">
      {ctl('Q0 이력 실행',()=>history(0),false)}{ctl('Q1 이력 실행',()=>history(1),false)}</div>
     <strong>닫힌 게이트와 전원 차단 검사</strong><div className="a05-control-buttons">
      {ctl('G=0, D1→D0',closeGateChange,false)}
      {ctl('전원 OFF→ON',powerCycle,false)}</div>
     {lastHistory&&<p role="status" className="a05-note">{lastHistory}</p>}
    </div>}
    {sceneId==='d-latch-vs-d-flip-flop'&&<div className="a05-logic16-controls">
     <strong>상승/중간 HIGH 입력 변화의 이벤트 순서</strong><div className="a05-control-buttons">
      {ctl('t2 CLK↑,D0',()=>event(1),state.eventIndex===1)}
      {ctl('t3 HIGH,D1',()=>event(2),state.eventIndex===2)}
      {ctl('t4 HIGH,D0',()=>event(3),state.eventIndex===3)}
      {ctl('t5 CLK↓,D0',()=>event(4),state.eventIndex===4)}
      {ctl('t6 LOW,D1',()=>event(5),state.eventIndex===5)}
      {ctl('t8 CLK↑,D1',()=>event(6),state.eventIndex===6)}</div>
     <button type="button" onClick={initialHigh}>시작 시 CLK=1만 표시 (직전 CLK 미상)</button>
     {state.initialHigh&&<p role="status" className="a05-note">이 화면만으로는 0→1 상승 사건이 확인되지 않으므로 DFF Q 초기값/갱신을 보증하지 않습니다.</p>}
    </div>}
    {sceneId==='setup-hold-metastability-clock'&&<div className="a05-logic16-controls">
     <strong>최대·최소 경로를 독립적으로 계산</strong><div className="a05-control-buttons">
      {ctl('기본 T8 / 버퍼 없음',()=>timing(8,false,'initial8'),state.period===8&&!state.buffer)}
      {ctl('버퍼 추가 / T8',()=>timing(8,true,'buffer8'),state.period===8&&state.buffer)}
      {ctl('버퍼 유지 / T9',()=>timing(9,true,'buffer9'),state.period===9&&state.buffer)}</div>
     <button type="button" onClick={hazard}>입력이 클록 에지에 가까이 변경 (위험 확인)</button>
    </div>}
   </div>}
   {revealed&&mayAnswer&&<div className="a05-box"><h3>직접 관찰 뒤 원리를 설명하세요</h3>
    <div className="a05-choice-set">{story.answers.map(c=><button key={c.id} type="button" aria-pressed={answer===c.id}
     className={answer===c.id?'selected':''} onClick={()=>{setAnswer(c.id);setFeedback(null);setWhy(false);}}>{c.text}</button>)}</div>
    <button type="button" className="a05-primary" onClick={()=>{const f=gradeLogic16(sceneId,seen,answer);setFeedback(f);emit('answer.checked',{passed:f.passed,misconception:f.misconception});}}>관찰·WHY 조건별 검증</button>
   </div>}
   <div className="a05-tools"><button type="button" onClick={()=>speak(story.voice)}>한국어 질문 듣기</button>
    {revealed&&<button type="button" disabled={hint===3} onClick={()=>{setHint(Math.min(3,hint+1));emit('hint.opened',{level:Math.min(3,hint+1)});}}>힌트 {hint}/3</button>}</div>
   {hint>0&&<div className="a05-hint">{story.hints.slice(0,hint).map((c,i)=><p key={i}>{i+1}. {c}</p>)}</div>}
   {feedback&&<section className="a05-result" role="status" aria-live="polite">
    <h3>{feedback.passed?'원리를 실제 실험으로 확인했어요!':'빠진 실험 조건을 채워 보세요.'}</h3>
    {feedback.conditions.map(c=><p key={c.key}><strong>{c.passed?'✓':'△'} {c.key}</strong> — {c.passed?'증거 확보':c.help}</p>)}
    {!feedback.passed&&wrong&&<p data-testid="logic16-keyed-feedback">{wrong}</p>}
    <button type="button" onClick={()=>speak(feedback.passed?story.next:wrong||feedback.conditions.filter(c=>!c.passed).map(x=>x.help).join(' '))}>피드백 듣기</button>
    <button type="button" onClick={()=>setWhy(!why)}>{why?'원리 접기':'왜? 원리 보기'}</button>
   </section>}
   {feedback&&why&&<div className="a05-why"><h3>왜?</h3><p>{story.why}</p>{feedback.passed&&<p>{story.next}</p>}</div>}
   {feedback?.passed&&index<3&&<button type="button" className="a05-primary" onClick={()=>enter(index+1)}>다음 질문으로 →</button>}
   {feedback?.passed&&index===3&&<p className="a05-why">디지털 논리/클록 레슨 완료. A02 제품 앱 저장·진도는 별도 통합 과정입니다.</p>}
  </section>
  <section className="a05-canvas-col" aria-label="디지털 논리 2.5D 원본 도식">
   <div className="a05-canvas-header"><span>CMOS LOGIC & CLOCK 2.5D</span><span>{revealed&&interacted?'관찰 결과':'예측·조작 전 정답 은닉'}</span></div>
   <Logic16SceneVisual sceneId={sceneId} state={state} revealed={revealed&&interacted}/>
   <div className="a05-model-limit"><strong>물리 범위</strong> {revealed&&interacted?story.bounds:'장난감 교육 모형입니다. 구체적인 올바른 결과와 제한 수치는 먼저 예상하고 조작한 뒤 확인하세요.'}</div>
   <div className="a05-source">A06 16 corrected source blob 0cddc0b8 · A07 EDU_QA_PASS_SOURCE · 실제 칩 성능/전류 측정 아님</div>
  </section></main></div>;
}
