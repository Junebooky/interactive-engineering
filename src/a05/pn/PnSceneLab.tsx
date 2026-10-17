import {useState} from 'react';
import {PnSceneVisual} from './PnSceneVisual';
import {evaluatePn,pnSceneOrder} from './pnModel';
import type {BandMaterial,BiasV,DiodeBiasV,Dopant,GateComparison,JunctionPhase,PnEvent,PnFeedback,PnSceneId} from './pnModel';
import type {PnVisualState} from './PnSceneVisual';
import '../a05Scenes.css';import './pnScenes.css';
type Choice={id:string;text:string;whyWrong?:string};
type Story={title:string;hook:string;question:string;prediction:string;predictions:Choice[];prompt:string;
 answers:Choice[];hints:readonly [string,string,string];why:string;next:string;speech:string;assumption:string};
const STORIES:Record<PnSceneId,Story>={
 'semiconductor-band-gap':{
  title:'실리콘은 금속도 절연체도 아니라는데?',
  hook:'전자가 올라갈 수 있는 에너지 자리를 바꾸면 전하 이동도 달라질까요?',
  question:'금속·실리콘·큰 밴드갭 물질 중 빛·온도로 캐리어를 만들기 쉬운 곳은?',
  prediction:'밴드갭이 작은 소재와 큰 소재가 왜 다르게 작동할까요?',
  predictions:[{id:'finite',text:'실리콘은 유한한 에너지 틈이 있어 환경에 따라 달라져요.'},{id:'physical',text:'밴드갭은 웨이퍼를 실제로 파낸 틈이에요.'}],
  prompt:'금속 겹침/Si 1.1eV/절연체 5eV를 비교하고 실리콘의 빛 또는 온도를 바꿔 보세요.',
  answers:[
   {id:'gap-energy-not-hole',text:'밴드갭은 허용된 전자 에너지 사이 차이예요. 정공은 빠져나간 전자 자리이지 양전하 전자가 아니에요.'},
   {id:'physical-hole',text:'밴드갭은 결정에 뚫린 물리적 구멍이에요.',whyWrong:'에너지띠 사이의 에너지 구간이지 웨이퍼의 빈 공간이 아니에요.'},
   {id:'positive-electron',text:'정공은 전자에 플러스 전하가 달린 새로운 전자예요.',whyWrong:'정공은 원자가띠에서 빠져나간 전자 자리의 집단적 운동을 나타내요.'},
   {id:'all-insulators',text:'실리콘에는 어떤 조건에서도 이동 가능한 전하가 없어요.',whyWrong:'열·빛·도핑 등의 조건에 따라 전자·정공이 전류를 나를 수 있어요.'}
  ],
  hints:['밴드 그림의 높이 축은 거리인가요 에너지인가요?','전자 하나가 올라갔을 때 원래 있던 자리는?','실리콘의 빛·열 여기와 도핑의 변화를 구별하세요.'],
  why:'실리콘 300K 밴드갭 약 1.1eV는 교과서 근사예요. 금속/절연체/반도체는 에너지띠 점유와 이동도 등도 영향을 받습니다. 정공은 양전하처럼 기술하는 전자 빈자리이며 실제 양전하 전자 입자는 아닙니다.',
  next:'실리콘에 인(P)이나 붕소(B)를 조금 섞으면 다수 운반자는 어떻게 될까요?',
  speech:'금속, 실리콘, 절연체를 나란히 놓고 온도와 빛을 바꿔보세요. 왜 다른 결과가 날까요?',
  assumption:'정성적 밴드 카툰, Si Eg≈1.1eV/절연체 5eV 예시, 광·온도 별 캐리어 수 정량화 금지'
 },
 'silicon-donor-acceptor-doping':{
  title:'도핑 원자 하나에 운반자가 바뀐다고요?',
  hook:'실리콘의 네 결합 자리 사이에 5가 P 또는 3가 B를 대신 놓아봐요.',
  question:'Donor P가 들어간 n형과 Acceptor B가 들어간 p형의 다수 캐리어는?',
  prediction:'도핑하면 실리콘 덩어리 전체가 플러스·마이너스 배터리가 될까요?',
  predictions:[{id:'neutral',text:'대부분의 벌크는 중성을 유지하며 다수 캐리어 종류가 달라져요.'},{id:'charged',text:'n형 전체가 엄청 큰 음전하 덩어리가 돼요.'}],
  prompt:'Intrinsic, donor P, acceptor B 카드에서 다수 캐리어·고정 도핑 이온·소수 캐리어를 비교하세요.',
  answers:[
   {id:'majority-neutrality',text:'Donor n형 다수는 전자, acceptor p형 다수는 정공이에요. 벌크는 거의 중성이고 소수 캐리어도 존재해요.'},
   {id:'hole-electron',text:'p형의 정공은 플러스 전하를 띤 전자가 실체로 나타난 거예요.',whyWrong:'정공은 빠진 전자 자리의 집단적 이동이며 전자의 전하부호가 뒤집힌 입자가 아니에요.'},
   {id:'battery',text:'n형 실리콘 전체는 언제나 음전하가 가득한 배터리예요.',whyWrong:'이온화된 고정 도핑 이온과 움직이는 전하가 대부분 벌크에서 전체 전하를 보상해요.'},
   {id:'no-minority',text:'n형에는 소수 정공이 단 한 개도 존재하지 않아요.',whyWrong:'다수와 소수를 구분하며 온도에 따른 열생성 소수 캐리어는 0이 아니에요.'}
  ],
  hints:['P는 대표적 donor, B는 대표적 acceptor입니다.','고정 도핑 이온과 이동 캐리어 전하를 합하면?','다수 캐리어가 존재한다는 말은 소수가 0이라는 뜻일까요?'],
  why:'P donor는 움직일 전자를 제공해 n형, B acceptor는 정공의 다수를 만들 수 있어 p형이라 부릅니다. 하지만 전체 벌크 전하중성은 대부분 유지되고 소수 캐리어가 존재합니다. 10칸 격자는 설명용으로 실제 도핑 농도가 아닙니다.',
  next:'n형과 p형을 맞닿게 하면 왜 공핍층과 전기장이 생길까요?',
  speech:'도핑 카드를 바꿔 전자와 정공 가운데 어떤 운반자가 다수가 되는지 보세요.',
  assumption:'10격자 아이콘만의 설명, 농도·이온화·이동도 계산 없고 벌크의 전하중성만 표현'
 },
 'pn-diffusion-drift-equilibrium':{
  title:'PN을 붙였는데 왜 계속 전류가 흐르지 않을까요?',
  hook:'두 지역의 전하 운반자가 확산하다가 고정 이온을 남겨요.',
  question:'그 순간 생긴 내부 전기장은 n(+)에서 p(−) 중 어느 방향일까요?',
  prediction:'PN 평형에서 drift와 diffusion 전류가 겹치면 순합이?',
  predictions:[{id:'cancel',text:'두 전류가 상쇄돼 외부 바이어스 없는 평형에서는 순 DC가 0이에요.'},{id:'battery',text:'내장 전기장 때문에 영원히 전기를 꺼내 쓸 수 있어요.'}],
  prompt:'분리 → 접촉·확산 → 평형을 거치고 n+→p− 전계/이온과 확산·drift 흐름 합을 확인해 보세요.',
  answers:[
   {id:'balanced-not-battery',text:'p쪽 고정 acceptor는 음(−), n쪽 donor는 양(+) 이온이에요. 내장 E는 n→p, 평형에서 확산+drift 순전류 0이에요.'},
   {id:'no-ions',text:'공핍층에는 도핑 이온까지 모두 사라져요.',whyWrong:'접합 근처의 이동 가능한 다수 캐리어가 감소하며 고정 이온은 남아요.'},
   {id:'free-energy',text:'내장 전위는 외부 부하에 지속적으로 전력을 주는 공짜 배터리예요.',whyWrong:'내부 평형 전위는 외부 회로로 계속 에너지를 추출하는 전원 장치가 아닙니다.'},
   {id:'no-movement',text:'평형 전류 0이면 개별 전자도 전혀 움직이지 않아요.',whyWrong:'diffusion과 drift의 순합이 0일 뿐 반대 흐름은 지속할 수 있어요.'}
  ],
  hints:['캐리어가 떠난 자리에는 고정 이온이 남겠죠?','n 쪽 양 이온에서 p 쪽 음 이온으로 E 화살표를 그려요.','+1 toy 확산과 −1 toy 드리프트를 더해 보세요.'],
  why:'접합 직후 농도차에 따른 확산으로 이동 캐리어가 줄어들고 고정 donor(+)·acceptor(−) 이온이 남아 내부 E가 n→p로 생깁니다. 평형에서는 확산/드리프트에 해당하는 전류가 같고 반대여서 순 DC가 0이며, 내장 전압은 외부 단자용 배터리 출력이 아니에요.',
  next:'PN에 양/음 바이어스를 걸면 공핍층 넓이가 어떻게 바뀔까요?',
  speech:'n형과 p형을 만나게 해 볼까요? 접합 주변에 어떤 변화가 생길지 먼저 예상해 보세요.',
  assumption:'내장 전계 n+→p−, 전류 +1/−1은 무차원 설명용 snapshot, 1D 평형·외부 0V'
 },
 'pn-bias-depletion-calculator':{
  title:'전압 방향만 바꿨는데 PN 벽이 달라져요',
  hook:'공핍폭은 스위치 ON/OFF처럼 고정되지 않고 전압에 연속해서 반응해요.',
  question:'p단자 상대 n단자 Va가 −1V/0V/+0.2V라면 공핍폭이 가장 큰 경우는?',
  prediction:'역바이어스와 순바이어스 중 어느 쪽 공핍층이 더 넓을까요?',
  predictions:[{id:'reverse',text:'−1V 역바이어스가 가장 넓고, +0.2V 순방향이 더 좁아요.'},{id:'forward',text:'순방향 +0.2V에서 오히려 더 넓어져요.'}],
  prompt:'−1V, 0V, +0.2V 순서로 바이어스를 바꾸고 W(µm)·내장전위(V)를 읽으세요. 고농도 카드로 비선형 변화를 살펴볼 수도 있어요.',
  answers:[
   {id:'reverse-widens',text:'역방향은 장벽을 높여 W를 넓히고 순방향은 좁혀요. 내장전위는 외부 배터리 전압이 아니에요.'},
   {id:'forward-widens',text:'순방향은 공핍폭을 더 넓혀요.',whyWrong:'p 상대 n에 +Va를 걸면 장벽 Vbi−Va가 줄어 이 이상화 모형에서 W가 좁아져요.'},
   {id:'vbi-battery',text:'Vbi 약 0.714V를 외부 단자에서 꺼내 쓸 수 있어요.',whyWrong:'Vbi는 내부 평형 접합 전위이고 별도 배터리로 측정되는 외부 전압이 아니에요.'},
   {id:'half-doping',text:'도핑이 2배면 공핍층 폭은 모든 조건에서 정확히 절반으로 줄어요.',whyWrong:'W는 제곱근에 비례하며 Vbi도 도핑 로그에 따라 변해 단순 절반이 아니에요.'}
  ],
  hints:['역바이어스에서 장벽 Vbi−Va가 커질까요?','W는 (Vbi−Va)의 제곱근이 들어간 식이에요.','Vbi는 장치 안 전위분포이지 충전된 배터리가 아니에요.'],
  why:'이상 Si abrupt PN, 300K, Na=Nd=1e16/cm³, ni=1e10/cm³이면 Vbi≈0.714V. W(−1V)≈0.6659µm, W(0)≈0.4298µm, W(+0.2V)≈0.3647µm. 고농도/강한 주입·breakdown에서는 단순 공핍 근사가 어긋날 수 있어요.',
  next:'공핍폭만 변할까요? 다이오드 전류는 전압에 어떻게 반응할까요?',
  speech:'p 단자의 전압을 바꾸어 보세요. 역방향과 순방향에서 공핍폭이 어떻게 달라지는지 비교해요.',
  assumption:'300K Si 1D abrupt/Na,Nd=1e16/cm³ 기본, ni=1e10/cm³, Va<Vbi, W µm. 실제 실측값 아님'
 },
 'pn-diode-current-to-mos':{
  title:'다이오드는 어떤 전압-전류 곡선을 그릴까요?',
  hook:'0.3V에서 0.4V로 조금 올렸는데 흐름이 몇 배로 커질까요?',
  question:'0.7V 미만은 전류가 정확히 0이고 MOS도 PN 전류만 쓸까요?',
  prediction:'+0.3V와 +0.4V의 다이오드 전류는 비슷할까요?',
  predictions:[{id:'exponential',text:'연속적인 지수함수라 전류는 약 6.9배 차이 날 수 있어요.'},{id:'zero',text:'0.7V 아래니까 둘 다 전류 0이에요.'}],
  prompt:'순방향 +0.3/+0.4V, 역방향 −1V, MOS gate 산화막 카드를 비교하세요.',
  answers:[
   {id:'nonlinear-oxide',text:'다이오드는 지수 I-V라 0.7V 하드 스위치가 아니고, MOS 게이트는 산화막을 통한 전계로 제어해요.'},
   {id:'hard07',text:'실리콘 다이오드 0.7V 미만 전류는 언제나 정확히 0이에요.',whyWrong:'순방향 전류는 지수적으로 연속 증가하며 온도와 장치 Is에 따라 달라져요.'},
   {id:'vbi-same',text:'내장전위와 실제 모든 회로의 0.7V 문턱은 정의상 동일해요.',whyWrong:'내장전위는 평형 접합 내부 전위, 회로 전압-전류 관계는 작동점과 조건에 좌우돼요.'},
   {id:'gate-pn',text:'MOSFET 게이트는 PN 접합에 직접 전류를 흘려 채널을 제어해요.',whyWrong:'MOS 산화막은 DC 게이트를 절연하고 전계로 표면 전하를 바꾸는 방식이에요.'}
  ],
  hints:['다이오드 전류는 Shockley 지수식을 떠올려요.','내장전위와 개별 다이오드 켜짐 전압을 혼동하지 마세요.','MOS에서 O는 oxide, 절연막이에요.'],
  why:'Shockley 교육용 Is=1pA, n=2, VT=25.852mV, T300K에서는 I(0.3V)=0.330nA, I(0.4V)=2.289nA, 역−1V에서는 약−1pA입니다. 역항복/직렬저항/고주입은 모델 밖이에요. MOS는 전계로 채널을 제어하며 PN 순방향 전류만으로 작동하는 게 아니에요.',
  next:'산화막 아래 전하를 모으는 MOS capacitor 14 레슨이 STORY_READY가 되면 그 원리를 더 깊이 실험할 수 있어요.',
  speech:'전압을 조금 올리면 다이오드 전류는 비슷하게 늘까요, 갑자기 늘까요? 두 값을 먼저 예상해 주세요.',
  assumption:'Is=1pA, n=2, VT25.852mV, T300K Shockley toy, −1V breakdown·발열 미모형, MOS 게이트 이상 DC 절연'
 }
};
const fresh=():PnVisualState=>({
 material:'silicon',light:false,warm:false,dopant:'intrinsic',phase:'separate',
 bias:0,na:1e16,nd:1e16,diodeBias:0,gate:'pn'
});
export type PnLabProps={onEvent?:(e:PnEvent)=>void;onSpeech?:(id:PnSceneId,text:string)=>void};
export function PnSceneLab({onEvent,onSpeech}:PnLabProps){
 const [index,setIndex]=useState(0),id=pnSceneOrder[index],story=STORIES[id];
 const [state,setState]=useState<PnVisualState>(fresh);
 const [prediction,setPrediction]=useState<string|null>(null),[answer,setAnswer]=useState<string|null>(null);
 const [observed,setObserved]=useState<string[]>([]),[feedback,setFeedback]=useState<PnFeedback|null>(null);
 const [hints,setHints]=useState(0),[why,setWhy]=useState(false);
 function event(type:PnEvent['type'],payload?:PnEvent['payload']){onEvent?.({sceneId:id,type,payload});}
 function mark(f:string){setObserved(xs=>xs.includes(f)?xs:[...xs,f]);}
 function update(next:PnVisualState,label:string){setState(next);setFeedback(null);setWhy(false);event('parameter.changed',{label});}
 function enter(i:number){
  if(i<0||i>=pnSceneOrder.length)return;
  setIndex(i);setState(fresh());setPrediction(null);setAnswer(null);setObserved([]);
  setFeedback(null);setHints(0);setWhy(false);
  onEvent?.({sceneId:pnSceneOrder[i],type:'scene.enter'});
 }
 const button=(label:string,handler:()=>void,selected:boolean)=>
  <button type="button" onClick={handler} aria-pressed={selected} className={selected?'selected':''}>{label}</button>;
 function material(v:BandMaterial){update({...state,material:v},'material '+v);mark(v);}
 function excitation(v:'light'|'warm'){update({...state,[v]:!state[v]},v+' changed');mark('excited');}
 function dopant(v:Dopant){update({...state,dopant:v},'dopant '+v);if(v!=='intrinsic')mark(v);}
 function phase(v:JunctionPhase){update({...state,phase:v},'junction '+v);if(v!=='separate')mark(v);}
 function bias(v:BiasV){update({...state,bias:v},'Va '+v);mark(v===-1?'reverse':v===0?'zero':'forward');}
 function diodeBias(v:DiodeBiasV){update({...state,diodeBias:v},'diode Va '+v);mark(String(v));}
 function gate(v:GateComparison){update({...state,gate:v},'gate '+v);if(v==='mos')mark('mos');}
 function say(s:string){event('voice.requested',{text:s});onSpeech?.(id,s);}
 const shown=prediction!==null;
 return <div className="a05-lab a05-pn-lab" lang="ko">
  <header className="a05-head">
   <p className="a05-eyebrow">A05 · PN PHYSICS LAB / 11</p>
   <h1>실리콘의 비밀: 밴드 → 도핑 → PN → MOS</h1>
   <p>먼저 예상, 조건 조작, 2.5D 관찰, 이유 설명. 모든 수치는 교육용입니다.</p>
   <nav className="a05-stepnav" aria-label="PN 접합 기초 레슨 진행">
    {pnSceneOrder.map((s,i)=><button key={s} type="button" disabled={i>index}
     aria-current={i===index?'step':undefined} className={i===index?'active':''}
     onClick={()=>enter(i)}>{String(i+1).padStart(2,'0')}</button>)}
   </nav>
  </header>
  <main className="a05-stage">
   <section className="a05-copy" aria-label="학습 실험">
    <span className="a05-eyebrow">{id} · STEP {index+1}/5</span>
    <h2>{story.title}</h2><p className="a05-hook">{story.hook}</p><p className="a05-question">{story.question}</p>
    <div className="a05-box">
     <h3>아직 관찰값을 열지 말고 예상하기</h3><p>{story.prediction}</p>
     <div className="a05-choice-set">{story.predictions.map(c=><button type="button" key={c.id}
      aria-pressed={prediction===c.id} disabled={shown} className={prediction===c.id?'selected':''}
      onClick={()=>{setPrediction(c.id);event('prediction.recorded',{choice:c.id});}}>{c.text}</button>)}</div>
    </div>
    {shown&&<>
     <div className="a05-box"><h3>직접 조작하기</h3><p>{story.prompt}</p>
      {id==='semiconductor-band-gap'&&<div className="a05-pn-controls">
       <strong>밴드 구조 · 에너지 eV</strong>
       <div className="a05-control-buttons">
        {button('금속 겹침',()=>material('metal'),state.material==='metal')}
        {button('실리콘 1.1eV',()=>material('silicon'),state.material==='silicon')}
        {button('큰 갭 5eV',()=>material('insulator'),state.material==='insulator')}
       </div><strong>빛·열 (정성 모형)</strong><div className="a05-control-buttons">
        {button('빛 켜기/끄기',()=>excitation('light'),state.light)}
        {button('따뜻하게',()=>excitation('warm'),state.warm)}
       </div>
      </div>}
      {id==='silicon-donor-acceptor-doping'&&<div className="a05-pn-controls">
       <strong>실리콘 격자 10칸은 실제 원자 농도 아님</strong><div className="a05-control-buttons">
        {button('Intrinsic Si',()=>dopant('intrinsic'),state.dopant==='intrinsic')}
        {button('Donor P → n형',()=>dopant('donor'),state.dopant==='donor')}
        {button('Acceptor B → p형',()=>dopant('acceptor'),state.dopant==='acceptor')}
       </div>
      </div>}
      {id==='pn-diffusion-drift-equilibrium'&&<div className="a05-pn-controls">
       <strong>PN 결합과 전계</strong><div className="a05-control-buttons">
        {button('분리 상태',()=>phase('separate'),state.phase==='separate')}
        {button('접촉·확산',()=>phase('diffusion'),state.phase==='diffusion')}
        {button('평형·순전류 0',()=>phase('equilibrium'),state.phase==='equilibrium')}
       </div>
      </div>}
      {id==='pn-bias-depletion-calculator'&&<div className="a05-pn-controls">
       <strong>외부 Va = V(p)−V(n)</strong><div className="a05-control-buttons">
        {button('역 −1V',()=>bias(-1),state.bias===-1)}
        {button('0V 평형',()=>bias(0),state.bias===0)}
        {button('순 +0.2V',()=>bias(0.2),state.bias===0.2)}
       </div>
       <strong>심화 · 전하 농도 (선택)</strong><div className="a05-control-buttons">
        {button('Na=10¹⁶/cm³',()=>update({...state,na:1e16},'Na1e16'),state.na===1e16)}
        {button('Na=10¹⁷/cm³',()=>update({...state,na:1e17},'Na1e17'),state.na===1e17)}
       </div>
       <p className="a05-note">기본 Na=Nd=10¹⁶cm⁻³, 300K·이상적 1D. 고농도 카드는 다른 모델 조건이므로 동일 W 표준답으로 해석하지 마세요.</p>
      </div>}
      {id==='pn-diode-current-to-mos'&&<div className="a05-pn-controls">
       <strong>전압 −1/0/0.3/0.4V (교육용 다이오드)</strong><div className="a05-control-buttons">
        {button('−1V',()=>diodeBias(-1),state.diodeBias===-1)}
        {button('0V',()=>diodeBias(0),state.diodeBias===0)}
        {button('+0.3V',()=>diodeBias(0.3),state.diodeBias===0.3)}
        {button('+0.4V',()=>diodeBias(0.4),state.diodeBias===0.4)}
       </div><strong>PN 주입 vs MOS 절연 게이트</strong><div className="a05-control-buttons">
        {button('PN diode',()=>gate('pn'),state.gate==='pn')}
        {button('MOS oxide gate',()=>gate('mos'),state.gate==='mos')}
       </div>
      </div>}
     </div>
     <div className="a05-box">
      <h3>원리를 말해 볼까요?</h3>
      <div className="a05-choice-set">{story.answers.map(c=><button type="button" key={c.id}
       className={answer===c.id?'selected':''} aria-pressed={answer===c.id}
       onClick={()=>{setAnswer(c.id);setFeedback(null);setWhy(false);}}>{c.text}</button>)}</div>
      <button type="button" className="a05-primary" onClick={()=>{
       const f=evaluatePn(id,observed,answer);setFeedback(f);event('answer.checked',{passed:f.passed});
      }}>관찰·설명 조건 확인</button>
     </div>
    </>}
    <div className="a05-tools">
     <button type="button" onClick={()=>say(story.speech)}>한국어 질문 듣기</button>
     {shown&&<button type="button" disabled={hints>=3} onClick={()=>{
      setHints(Math.min(3,hints+1));event('hint.opened',{level:Math.min(3,hints+1)});
     }}>힌트 {hints}/3</button>}
    </div>
    {hints>0&&<div className="a05-hint" role="status">{story.hints.slice(0,hints).map((h,i)=><p key={i}>{i+1}. {h}</p>)}</div>}
    {feedback&&<div className="a05-result" aria-live="polite" role="status">
     <h3>{feedback.passed?'밴드·전하 흐름의 이유를 발견했어요!':'빠진 조건을 먼저 찾아볼까요?'}</h3>
     {feedback.conditions.map(c=><p key={c.label}><strong>{c.passed?'✓':'△'} {c.label}</strong> — {c.passed?'확인했어요.':c.help}</p>)}
     {!feedback.passed&&<p>{story.answers.find(a=>a.id===answer)?.whyWrong}</p>}
     <button type="button" onClick={()=>say(feedback.passed?story.next:feedback.conditions.filter(c=>!c.passed).map(c=>c.help).join(' '))}>피드백 듣기</button>
     <button type="button" onClick={()=>setWhy(!why)}>{why?'원리 접기':'왜? 원리 보기'}</button>
    </div>}
    {feedback&&why&&<div className="a05-why"><h3>왜 그럴까요?</h3><p>{story.why}</p>{feedback.passed&&<p className="a05-next">{story.next}</p>}</div>}
    {feedback?.passed&&index<4&&<button type="button" className="a05-primary" onClick={()=>enter(index+1)}>다음 질문으로 →</button>}
    {feedback?.passed&&index===4&&<div className="a05-why"><p className="a05-next">{story.next}</p>
     <p>A02 앱 통합과 진도 저장은 별도 책임이며, 14번은 A06 STORY_READY 이후 제작합니다.</p></div>}
   </section>
   <section className="a05-canvas-col" aria-label="실리콘 PN 반도체 2.5D 모델">
    <div className="a05-canvas-header"><span>LIVE PN PHYSICS 2.5D</span><span>{shown?'관찰 가능':'예측 먼저'}</span></div>
    <PnSceneVisual sceneId={id} state={state} revealed={shown}/>
    <div className="a05-model-limit"><strong>과학 근사/단위</strong> {story.assumption}</div>
    <div className="a05-source">A06 PN 11 STEM storyboard · A05 자체 SVG · 실제 실리콘 SKU 검증 데이터 아님</div>
   </section>
  </main>
 </div>;
}
