import {useState} from 'react';
import {Power31SceneVisual} from './Power31SceneVisual';
import {gradePower31,power31Fresh,power31Order,power31Psu,power31Buck,power31Pdn,power31Coolant,power31Facility} from './power31Model';
import type {Power31Event,Power31SceneId,Power31State,Power31Grade} from './power31Model';
import '../a05Scenes.css';import './power31.css';
type Answer={id:string;label:string;feedback?:string};
type Story={title:string;hook:string;question:string;prediction:string;options:[string,string];task:string;answers:[Answer,Answer,Answer,Answer];
 hints:readonly [string,string,string];why:string;next:string;voice:string;bounds:string};
const STORIES:Record<Power31SceneId,Story>={
 'server-psu-loss-heat':{
 title:'100W GPU가 쓰면 PSU는 콘센트에서 몇 W를 받나요?',hook:'입력 전력·출력 전력·변환 열을 각각 알아볼까요?',
 question:'PSU 효율이 90%에서 95%로 바뀌어도 출력 100W는 같아요. 손실은 어떻게 될까요?',
 prediction:'PSU 출력100W 고정에서 효율90%/95%의 입력과 내부 손실의 대소 관계를 계산 전에 예상하세요.',
 options:['효율이 좋아지면 같은 출력에서 입력과 PSU 열손실은 줄어들 것 같아요.','출력 100W라면 입력도 손실도 항상 100W예요.'],
 task:'출력100W를 고정한 채 가상의 η90%, η95%를 각각 조작하고 입력·출력·PSU 손실을 비교하세요.',
 answers:[
 {id:'psu-input-output-heat',label:'η=Pout/Pin, Pin=Pout/η이며 PSU에서 잃은 열은 Pin−Pout이에요. GPU의 100W 소비와 별도예요.'},
 {id:'m1',label:'출력100W·효율90%면 PSU 손실은 무조건10W예요.',feedback:'효율의 분모는 입력 Pin입니다. 출력의 10%를 곧장 빼는 계산은 분모가 달라요.'},
 {id:'m2',label:'GPU에100W 출력했으므로 PSU 자체 손실 열은0W예요.',feedback:'100W는 유용한 출력 전력입니다. 변환 과정에서 PSU 자체 손실이 따로 존재할 수 있어요.'},
 {id:'m3',label:'PSU η95%이면 GPU 및 시설의 모든 발열이0이 돼요.',feedback:'PSU 변환 열만 줄어듭니다. GPU가 소비하는 전력과 건물 냉각 열을 모두 없애지는 못해요.'}],
 hints:['효율은 출력 전력 나누기 무엇일까요?','효율이 일정할 때 입력=출력/효율입니다.','PSU의 열과 GPU 소비 열을 각기 따로 표시하세요.'],
 why:'가정한 PSU 출력100W에서 η=0.9이면 Pin111.111W, 손실11.111W, η=0.95면 Pin105.263W·손실5.263W입니다. η의 분모는 입력입니다. PSU 효율은 실제 제품의 부하·환경 조건에 따라 변하며 GPU 자체 소비 열이 없어진다는 뜻이 아닙니다.',
 next:'12V를 4V로 내리는 GPU VRM의 스위치 비율은 얼마일까요?',
 voice:'콘센트 입력과 GPU로 전달되는 전력을 구별해서 먼저 예상해 보세요.',
 bounds:'출력100W 고정, 가상 η90/95%. 실제 PSU 인증·부하별 효율 데이터 아님.'
 },
 'gpu-buck-vrm-duty-ratio':{
 title:'12V에서 4V를 얻는 스위치 비율과 전류는?',hook:'전압 변환 비율과 에너지 효율은 서로 다른 경계예요.',
 question:'duty 1/4, 1/3, 1/2는 이상적 연속전류 buck의 전압을 어떻게 바꾸나요?',
 prediction:'이상적 Vin12V, D=1/4·1/3·1/2 카드의 Vout을 예상하고 Iout10A와 Iin이 같은지 생각하세요.',
 options:['스위치 비율과 입출력 전력/전류를 따로 비교할게요.','전압을 낮추면 입력과 출력 전류도 항상 똑같을 거예요.'],
 task:'D=25%,33.33%,50%를 각각 실험하고, 별도 η90% 전력 모델을 켜 Vin/Iin vs Vout/Iout을 비교하세요.',
 answers:[
 {id:'buck-ideal-vs-power-efficiency',label:'이상적 CCM buck에서 Vout≈D×Vin이고, 별도 손실η는 Pin=Pout/η와 Iin=Pin/Vin으로 계산해요.'},
 {id:'m1',label:'손실형 buck이라도 duty 1/3이면 어느 부하·상태에서나 정확히4V예요.',feedback:'Vout=D×Vin은 이상적인 안정된 연속 인덕터 전류의 모형입니다. 실제 리플·손실·제어 상태에서 항상 등식은 아닙니다.'},
 {id:'m2',label:'Vout4V에서 Iout10A면 Vin12V의 Iin도 항상10A예요.',feedback:'입력 전력은 출력 전력과 효율로 결정됩니다. 입력12V에서 전류가 출력10A와 같을 이유는 없어요.'},
 {id:'m3',label:'스위치를 빠르게 하면 인덕터 리플과 전력손실이 반드시0이에요.',feedback:'스위칭 손실·인덕터 리플·도통 손실은 실제 설계에서 남습니다. 이상화의 범위를 지켜야 해요.'}],
 hints:['이상적 인덕터 volt-second balance를 생각하세요.','입력 전력은 출력 전력 나누기 효율이에요.','D·Vin과 η·전류를 다른 식으로 계산하세요.'],
 why:'이상적 CCM에서 Vin12V×D1/4,1/3,1/2→Vout3,4,6V입니다. Vout4V·Iout10A면 Pout40W. 별도 가상 η90%이면 Pin44.444W, Iin≈3.704A, 변환손실4.444W. η90%를 ideal Vout=D×Vin에 다시 곱하지 않습니다.',
 next:'GPU 배선이 1V에서 더 큰 전류를 견뎌야 하는 이유는 무엇일까요?',
 voice:'스위치를 켜는 시간 비율과 입력/출력 전류가 같은지 서로 나눠 예상해 보세요.',
 bounds:'Vin12V, 이상적 정상상태 CCM buck 전압만. 별도 η90% 전력모형은 가정; 과도·DCM·PFM·전압 리플·칩 모델 아님.'
 },
 'gpu-pdn-current-heat':{
 title:'GPU 전압이 반으로 내려가면 배선 열은?',hook:'같은 유용한 부하 40W에서 전압과 전류를 바꿔 볼게요.',
 question:'40W를 2V로 공급할 때와 1V로 공급할 때 I²R 전선 열은 몇 배일까요?',
 prediction:'GPU 공급전력40W는 그대로 두고 2V/1V·배선R2mΩ/1mΩ 조건에서 전류와 손실을 예상해 보세요.',
 options:['부하 전력 고정 조건에서 I=P/V와 I²R을 계산할게요.','전압을 낮추면 전류와 열도 언제나 같은 비율로 작아져요.'],
 task:'GPU toy40W에서 레일2V와1V를 전환하고 배선2mΩ와1mΩ을 따로 비교하세요.',
 answers:[
 {id:'fixed40w-i2r',label:'고정40W에서 I=40W/V이므로 2V→1V는 전류20A→40A, R고정 시 I²R 손실은 네 배예요.'},
 {id:'m1',label:'레일 전압을 반으로 하면 모든 경우에 배선 열도 정확히 절반이에요.',feedback:'40W 일정 조건에서는 전압이 내려갈수록 전류가 더 커집니다. 배선 손실 I²R을 별도로 비교해야 해요.'},
 {id:'m2',label:'전선은 전류의 제곱을 고려할 필요 없이 항상 40W 전부 열로 사라져요.',feedback:'유용한 부하40W와 배선 구리 손실 I²R은 위치가 다른 전력입니다. 두 값을 중복 계산하지 마세요.'},
 {id:'m3',label:'전류가 2배면 R이 고정된 배선 열도 반드시 2배예요.',feedback:'I²R의 제곱 때문에 같은 저항에서 I가 2배면 해당 열손실은 4배가 됩니다.'}],
 hints:['전력40W와 단자전압을 나누면 전류는?','배선 손실은 I×I×R입니다.','전류를 두 배로 할 때 제곱은 네 배예요.'],
 why:'부하40W 고정과 배선 저항2mΩ를 가정하면 2V→20A→배선손실0.8W/전압강하0.04V, 1V→40A→3.2W/0.08V입니다. 1mΩ로 낮추면 배선손실도 각각 반이 됩니다. GPU 코어 전압에 따른 실제 스위칭 전력/온도는 여기서 구하지 않습니다.',
 next:'전기를 받아 만들어진 GPU·서버의 열을 물로 옮길 땐 얼마나 순환해야 할까요?',
 voice:'같은40와트 부하에 2볼트와 1볼트를 공급할 때 배선 열을 먼저 예상해 보세요.',
 bounds:'부하40W 일정, 전선 R=1/2mΩ toy, 온도 및 VRM 조절 효과 생략; GPU 데이터시트 값 아님.'
 },
 'cdu-water-loop-heat-flow':{
 title:'냉각수가 많이 돌아가면 실제 물 소비도 같을까요?',hook:'CDU는 랙 물 순환과 시설 열 방출 사이의 경계가 됩니다.',
 question:'100kW 열을 받아 물 온도가 5K/10K 오를 때 순환 유량은 각각?',
 prediction:'열100kW와 Cp4180J/kgK에서 ΔT5/10K의 순환 질량 유량을 먼저 비교하고, 보충수와 혼동하지 마세요.',
 options:['온도 상승을 많이 허용하면 같은 열을 운반하는 순환량은 줄 수도 있어요.','순환량과 데이터센터가 밖에서 사용하는 물의 양은 항상 동일해요.'],
 task:'열100/50kW, 물 상승5/10K를 비교하고 냉각 방식 dry/tower를 각각 확인하세요.',
 answers:[
 {id:'recirculation-vs-makeup',label:'m-dot=Qdot/(Cp×ΔT)는 루프 내 순환 kg/s이고 site 보충수 소비량은 별도 계측 값이에요. CDU만으로 물 소비 0을 보장하지 않아요.'},
 {id:'m1',label:'냉각수가 4.78kg/s 순환하면 사이트는 물을 초당4.78kg 소비해요.',feedback:'닫힌 순환 루프에서 흐르는 냉각수는 되돌아옵니다. 현장 보충수·증발 사용은 루프 유량과 다른 값입니다.'},
 {id:'m2',label:'같은 열에서 물 온도 상승을 두 배 허용하면 순환 유량도 두 배 필요해요.',feedback:'m-dot=Q/(Cp×ΔT)이므로 ΔT를 두 배 허용하면 필요한 순환 유량은 절반으로 줄어듭니다.'},
 {id:'m3',label:'CDU가 설치되어 있으면 냉각탑 증발과 보충수는 반드시0L예요.',feedback:'CDU는 열 교환 경계이며 시설의 dry cooling/증발탑·보충수 소비는 설계에 달려 있어요.'}],
 hints:['다시 쓰는 순환수와 외부로 손실되는 물을 구별해 봐요.','루프 유량은 Q÷(Cp×ΔT)로 계산해요.','CDU 밖에서 열을 버리는 장치를 비교해 보세요.'],
 why:'정상상태 Q100kW, Cp4180J/(kg·K), ΔT5K는 순환4.7847kg/s, ΔT10K는2.3923kg/s입니다. 50kW면 각각 절반입니다. 시설 열 방출이 건식인지 증발식인지와 WUE용 물 사용량은 이 순환량만으로 구할 수 없습니다.',
 next:'시설 에너지 효율 PUE와 물 사용 효율 WUE를 같은 계측 기간에서 따로 비교해 볼까요?',
 voice:'순환하는 냉각수 양과 새로 보충하는 물이 같은지 먼저 예상해 봐요.',
 bounds:'단상 물 Cp4180J/(kgK), 정상상태 toy. 펌프 압손·열교환 비이상·냉각탑 물 사용량은 미모델링.'
 },
 'data-center-pue-wue-tradeoff':{
 title:'PUE가 낮으면 WUE도 무조건 낮을까요?',hook:'건물/IT 전기 비율과 물소비/IT 에너지는 서로 다른 지표예요.',
 question:'같은 IT1MW에서 PUE1.4/1.2를 비교하고 사이트 A/B의 PUE와 WUE를 각각 순위로 볼까요?',
 prediction:'IT 전력1MW 일정할 때 PUE1.4/1.2 시설전력을 예상하고, 사이트 A/B의 에너지·물 지표를 따로 비교해 보세요.',
 options:['에너지 비율과 물 지표는 별도 분모·분자를 확인할게요.','PUE가 더 낮은 사이트는 WUE도 무조건 더 낮을 거예요.'],
 task:'PUE1.4/1.2를 각기 조작하고 동일 IT1000kWh의 site A/B의 PUE/WUE를 직접 비교하세요.',
 answers:[
 {id:'same-boundary-separate-pue-wue',label:'PUE=시설전력·에너지/IT에너지, WUE=site 물 리터/IT kWh로 같은 기간/범위를 비교해야 하고 두 순위가 달라질 수 있어요.'},
 {id:'m1',label:'PUE가1.2면 GPU 응답 p99 지연도 자동으로20% 줄어요.',feedback:'PUE는 시설/IT 에너지 비율이지 GPU의 토큰 처리량이나 tail latency를 직접 정하는 수치가 아닙니다.'},
 {id:'m2',label:'냉각수 순환 L/s를 WUE의 분자에 그대로 넣으면 돼요.',feedback:'WUE의 분자는 같은 기간 시설 물 사용 리터입니다. 재순환 유량 L/s 자체가 아닙니다.'},
 {id:'m3',label:'PUE가 낮은 시설은 WUE도 반드시 낮아 종합 순위 하나만 매기면 돼요.',feedback:'에너지 효율과 물 사용량은 독립 축입니다. 예시 A는 PUE가 낫지만 WUE는 B가 낫습니다.'}],
 hints:['PUE는 전체 시설 에너지 나누기 IT에너지예요.','WUE는 같은 기간 site 물 사용 리터 나누기 IT kWh입니다.','A/B 각각 두 지표를 따로 계산하고 단위를 표시하세요.'],
 why:'IT1MW 고정 PUE1.4→시설1.4MW/overhead0.4MW, PUE1.2→시설1.2MW/overhead0.2MW로 같은24h 기준 시설 에너지 차이4.8MWh입니다. 사이트 A: IT1000kWh/facility1200kWh/water2000L→PUE1.2,WUE2.0L/kWh. B: IT1000kWh/facility1350kWh/water500L→PUE1.35,WUE0.5. GPU 속도와 동의어가 아닙니다.',
 next:'전기·열·SSD·메모리·GPU/네트워크가 함께 있어야 AI 데이터센터가 운영돼요.',
 voice:'PUE와 WUE를 하나의 좋고 나쁨 순위로 묶을 수 있을지 먼저 예상해 보세요.',
 bounds:'동일 시간/계량 경계 toy, IT1MW 24h 일정/사이트 A B 동일 IT1000kWh toy. 실제 시설/토큰 처리량 측정·물 생애주기 미반영.'
 }
};
export interface Power31LabProps{onEvent?:(event:Power31Event)=>void;onSpeech?:(sceneId:Power31SceneId,text:string)=>void}
export function Power31SceneLab({onEvent,onSpeech}:Power31LabProps){
 const [index,setIndex]=useState(0),sceneId=power31Order[index],story=STORIES[sceneId];
 const [state,setState]=useState<Power31State>(power31Fresh);
 const [prediction,setPrediction]=useState<string|null>(null),[seen,setSeen]=useState<string[]>([]);
 const [answer,setAnswer]=useState<string|null>(null),[feedback,setFeedback]=useState<Power31Grade|null>(null);
 const [hint,setHint]=useState(0),[why,setWhy]=useState(false);
 const revealed=prediction!==null,observed=seen.length>0;
 const emit=(type:Power31Event['type'],payload?:Record<string,unknown>)=>onEvent?.({sceneId,type,payload});
 const speak=(txt:string)=>{emit('voice.requested',{text:txt});onSpeech?.(sceneId,txt);};
 function change(next:Power31State,key:string){
  setState(next);setSeen(old=>old.includes(key)?old:[...old,key]);setAnswer(null);setFeedback(null);setWhy(false);
  const physical=sceneId==='server-psu-loss-heat'?power31Psu(next.psu):sceneId==='gpu-buck-vrm-duty-ratio'?power31Buck(next.duty,next.buckEta):
   sceneId==='gpu-pdn-current-heat'?power31Pdn(next.rail,next.resistance):sceneId==='cdu-water-loop-heat-flow'?power31Coolant(next.heat,next.deltaT,next.cooling):power31Facility(next.pue,next.site);
  emit('parameter.changed',{key,observation:physical,evidence:[...seen,key]});
 }
 function enter(i:number){if(i<0||i>=power31Order.length)return;setIndex(i);setState(power31Fresh());setSeen([]);setPrediction(null);setAnswer(null);setHint(0);setFeedback(null);setWhy(false);
  onEvent?.({sceneId:power31Order[i],type:'scene.enter'});}
 const ctl=(text:string,fn:()=>void,selected:boolean)=><button type="button" aria-pressed={selected} className={selected?'selected':''} onClick={fn}>{text}</button>;
 const wrong=story.answers.find(x=>x.id===feedback?.misconception)?.feedback;
 return <div className="a05-lab a05-power31-lab" lang="ko">
  <header className="a05-head"><p className="a05-eyebrow">A05 · POWER / VRM / PDN / CDU / PUE·WUE · LESSON31</p>
   <h1>GPU의 전기와 열은 어디서 오고 어디로 갈까요?</h1><p>입력→변환→배선→냉각→시설 계량. 매번 먼저 예측한 뒤 직접 비교하세요.</p>
   <nav className="a05-stepnav" aria-label="전원·냉각 다섯 단계">{power31Order.map((s,i)=><button key={s} type="button" disabled={i>index} aria-current={i===index?'step':undefined} className={i===index?'active':''} onClick={()=>enter(i)}>{i+1}</button>)}</nav>
  </header>
  <main className="a05-stage"><section className="a05-copy" aria-label="학생용 에너지·열 계산 질문">
   <span className="a05-eyebrow">{sceneId} · {index+1}/5</span><h2>{story.title}</h2>
   <p className="a05-hook">{story.hook}</p><p className="a05-question">{story.question}</p>
   <div className="a05-box"><h3>먼저 예상해 보세요</h3><p>{story.prediction}</p>
    <div className="a05-choice-set">{story.options.map((x,i)=><button key={i} type="button" disabled={revealed} aria-pressed={prediction===String(i)}
     className={prediction===String(i)?'selected':''} onClick={()=>{setPrediction(String(i));emit('prediction.recorded',{prediction:i});}}>{x}</button>)}</div>
   </div>
   {revealed&&<div className="a05-box"><h3>독립 조건을 바꾸고 관찰하세요</h3><p>{story.task}</p>
    <div className="a05-power31-controls">
     {sceneId==='server-psu-loss-heat'&&<>
      <strong>PSU 효율 η (출력 100W 고정)</strong><div className="a05-control-buttons">
       {ctl('PSU 90%',()=>change({...state,psu:90},'eta90'),state.psu===90)}
       {ctl('PSU 95%',()=>change({...state,psu:95},'eta95'),state.psu===95)}</div></>}
     {sceneId==='gpu-buck-vrm-duty-ratio'&&<>
      <strong>이상적 buck CCM duty (Vin 12V)</strong><div className="a05-control-buttons">
       {ctl('D 25%',()=>change({...state,duty:.25},'duty25'),state.duty===.25)}
       {ctl('D 33.33%',()=>change({...state,duty:0.3333333333333333},'duty33'),state.duty===0.3333333333333333)}
       {ctl('D 50%',()=>change({...state,duty:.5},'duty50'),state.duty===.5)}</div>
      <strong>별도 전력 효율 모형</strong><div className="a05-control-buttons">
       {ctl('η 100% ideal',()=>change({...state,buckEta:100},'eta100'),state.buckEta===100)}
       {ctl('η 90% power example',()=>change({...state,buckEta:90},'eta90'),state.buckEta===90)}</div></>}
     {sceneId==='gpu-pdn-current-heat'&&<>
      <strong>전압 (40W 고정)</strong><div className="a05-control-buttons">
       {ctl('Rail 2V',()=>change({...state,rail:2},'rail2'),state.rail===2)}
       {ctl('Rail 1V',()=>change({...state,rail:1},'rail1'),state.rail===1)}</div>
      <strong>배선저항 R</strong><div className="a05-control-buttons">
       {ctl('Wire 2mΩ',()=>change({...state,resistance:2},'wire2'),state.resistance===2)}
       {ctl('Wire 1mΩ',()=>change({...state,resistance:1},'wire1'),state.resistance===1)}</div></>}
     {sceneId==='cdu-water-loop-heat-flow'&&<>
      <strong>냉각수 온도 상승</strong><div className="a05-control-buttons">
       {ctl('ΔT 5K',()=>change({...state,deltaT:5},'temp5'),state.deltaT===5)}
       {ctl('ΔT 10K',()=>change({...state,deltaT:10},'temp10'),state.deltaT===10)}</div>
      <strong>시설에서 옮겨야 하는 열</strong><div className="a05-control-buttons">
       {ctl('Heat 50kW',()=>change({...state,heat:50},'heat50'),state.heat===50)}
       {ctl('Heat 100kW',()=>change({...state,heat:100},'heat100'),state.heat===100)}</div>
      <strong>CDU 외부 시설 열 방출 방식 (보충수량 별개)</strong><div className="a05-control-buttons">
       {ctl('Dry cooling',()=>change({...state,cooling:'dry'},'dry'),state.cooling==='dry')}
       {ctl('Cooling tower',()=>change({...state,cooling:'tower'},'tower'),state.cooling==='tower')}</div></>}
     {sceneId==='data-center-pue-wue-tradeoff'&&<>
      <strong>전체 시설 전력 계측 (IT 1MW 고정)</strong><div className="a05-control-buttons">
       {ctl('PUE 1.4',()=>change({...state,pue:1.4},'pue14'),state.pue===1.4)}
       {ctl('PUE 1.2',()=>change({...state,pue:1.2},'pue12'),state.pue===1.2)}</div>
      <strong>동일 IT1000kWh / 동일 기간 A·B site별 다른 WUE</strong><div className="a05-control-buttons">
       {ctl('Site A',()=>change({...state,site:'A'},'siteA'),state.site==='A')}
       {ctl('Site B',()=>change({...state,site:'B'},'siteB'),state.site==='B')}</div></>}
    </div></div>}
   {revealed&&observed&&<div className="a05-box"><h3>관찰 결과와 원리 연결</h3><div className="a05-choice-set">
    {story.answers.map(c=><button key={c.id} type="button" aria-pressed={answer===c.id} className={answer===c.id?'selected':''} onClick={()=>{setAnswer(c.id);setFeedback(null);setWhy(false);}}>{c.label}</button>)}</div>
    <button className="a05-primary" type="button" onClick={()=>{const g=gradePower31(sceneId,seen,answer);setFeedback(g);emit('answer.checked',{passed:g.passed,misconception:g.misconception,evidence:seen});}}>관찰·WHY 조건 검증</button>
   </div>}
   <div className="a05-tools"><button type="button" onClick={()=>speak(story.voice)}>한국어 질문 듣기</button>
    {revealed&&<button type="button" disabled={hint===3} onClick={()=>{const next=Math.min(3,hint+1);setHint(next);emit('hint.opened',{level:next});}}>힌트 {hint}/3</button>}</div>
   {hint>0&&<div className="a05-hint">{story.hints.slice(0,hint).map((txt,i)=><p key={i}>{i+1}. {txt}</p>)}</div>}
   {feedback&&<section className="a05-result" role="status" aria-live="polite"><h3>{feedback.passed?'단위와 경계의 물리를 확인했어요!':'더 비교할 관찰 조건이 있어요'}</h3>
    {feedback.conditions.map(c=><p key={c.key}><strong>{c.passed?'✓':'△'} {c.key}</strong> — {c.passed?'조건 완료':c.hint}</p>)}
    {!feedback.passed&&wrong&&<p data-testid="power31-keyed-feedback">{seen.length>0?wrong:'먼저 최소 한 가지 물리 조건을 직접 조작해 보세요.'}</p>}
    <button type="button" onClick={()=>speak(feedback.passed?story.next:seen.length>0&&wrong?wrong:feedback.conditions.filter(c=>!c.passed).map(c=>c.hint).join(' '))}>피드백 듣기</button>
    <button type="button" onClick={()=>setWhy(!why)}>{why?'원리 접기':'왜? 원리 보기'}</button>
   </section>}
   {why&&feedback&&<div className="a05-why" data-testid="power31-why-panel"><h3>왜?</h3>{feedback.passed?<><p>{story.why}</p><p>{story.next}</p></>:<p>아직 두 조건의 비교가 완료되지 않았어요. 미관찰 물리 조건을 직접 조작하고 WHY를 다시 평가해 보세요. {feedback.conditions.filter(c=>!c.passed).map(c=>c.hint).join(' ')}</p>}</div>}
   {feedback?.passed&&index<4&&<button type="button" className="a05-primary" onClick={()=>enter(index+1)}>다음 장면으로 →</button>}
   {feedback?.passed&&index===4&&<p className="a05-why">GPU 전기·열·시설 계량의 원리를 발견했어요. 앱 진도 저장은 A02 별도 통합이 필요해요.</p>}
  </section>
  <section className="a05-canvas-col" aria-label="GPU 전원 냉각 2.5D 실험 및 단위 계기판">
   <div className="a05-canvas-header"><span>POWER31 2.5D · SOURCE_PASS A07</span><span>{revealed&&observed?'실험 관찰':'예측·조작 전 정답 비공개'}</span></div>
   <Power31SceneVisual sceneId={sceneId} state={state} revealed={revealed&&observed} evidence={seen}/>
   <div className="a05-model-limit"><strong>물리 모형 범위</strong> {revealed&&observed?story.bounds:'교육용 가상 단위/전력·냉각 모형입니다. 정답 수치는 먼저 예측하고 직접 조작한 뒤 보입니다.'}</div>
   <div className="a05-source">A06 Lesson31 SOURCE blob f7e7aa16 · A07 EDU_QA_PASS_SOURCE · 수치/장비는 교육용 가상 사례</div>
  </section></main></div>;
}
